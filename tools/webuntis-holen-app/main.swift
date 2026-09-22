// "WebUntis holen" - a small native macOS app (AppKit) that pulls the school
// year from WebUntis into HTML/svp/plandaten/ and shows real progress.
//
// Build (tools/webuntis-holen-app/build.command does exactly this):
//   swiftc -O -framework AppKit main.swift -o "WebUntis holen.app/Contents/MacOS/WebUntisHolen"
//
// It runs:  node tools/webuntis.js year && node tools/webuntis.js names
// and then tools/plan-diff.mjs, which says whether the fetched plan differs
// from the one of the last run. Progress comes from the "i/80  class" lines the
// year export prints, the verdict from plan-diff's single "--line" output.
//
// Since 06.09.2026 it also asks the classbook what is still missing
// ("webuntis.js plan --offen --dry --line" -> "KLASSENBUCH: ...") and shows that as a second
// line. Is anything open, an "Eintragen" button appears next to OK. Nothing is ever written
// without that click: Doc presses send himself, that was the deal (01.09.2026), and it keeps
// the timing plausible for the Untis server.
//
// Since 22.09.2026 nothing is cut off any more: every line wraps, each fact separated by " · "
// gets its own line, and the window grows to whatever it needs. Green rgb(121,158,49) means
// fine, red rgb(176,36,24) means something wants doing - the palette values as they are, on
// the labs' almost-black navy, so they look the same in light mode and dark.

import AppKit

let REPO = "/Users/malvers/IdeaProjects/forloop"
let NODE = "/usr/local/bin/node"

// The forloop palette, exactly as CLAUDE.md and the labs use it - no lightened variants.
// They keep their punch because the window is always dark (docNavy below), light mode included.
let docRed = NSColor(srgbRed: 176 / 255, green: 36 / 255, blue: 24 / 255, alpha: 1)
let docGreen = NSColor(srgbRed: 121 / 255, green: 158 / 255, blue: 49 / 255, alpha: 1)
// almost black, never black: the labs' --bg from HTML/js/viewer-base.css
let docNavy = NSColor(srgbRed: 8 / 255, green: 20 / 255, blue: 42 / 255, alpha: 1)

// window geometry - one place, the layout below derives everything from it
let WIN: CGFloat = 460          // window width
let PAD: CGFloat = 20           // side margin
let COL = WIN - 2 * PAD         // text width

// One fact per line: the summary lines join their parts with " · ", which used to run past
// the window edge and disappear behind an ellipsis.
func broken(_ line: String) -> String {
    line.components(separatedBy: " \u{00b7} ").joined(separator: "\n")
}

final class App: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    let title = NSTextField(labelWithString: "WebUntis: Stundenplan holen")
    let status = NSTextField(labelWithString: "Anmelden …")
    let bar = NSProgressIndicator()
    let verdict = NSTextField(labelWithString: "")
    let book = NSTextField(labelWithString: "")
    let ok = NSButton(title: "OK", target: nil, action: nil)
    let fill = NSButton(title: "Eintragen", target: nil, action: nil)
    var summary: [String] = []
    var buffer = ""
    var writing = false          // second phase: the classbook is being filled
    func applicationDidFinishLaunching(_ n: Notification) {
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: WIN, height: 212),
                          styleMask: [.titled, .closable], backing: .buffered, defer: false)
        window.title = "WebUntis holen"
        // Always dark, whatever the system does - the palette is made for a dark ground.
        window.appearance = NSAppearance(named: .darkAqua)
        window.backgroundColor = docNavy
        window.center()
        let v = window.contentView!

        title.font = NSFont.boldSystemFont(ofSize: 14)
        v.addSubview(title)

        bar.style = .bar
        bar.minValue = 0; bar.maxValue = 80
        bar.isIndeterminate = true
        bar.startAnimation(nil)
        v.addSubview(bar)

        status.font = NSFont.systemFont(ofSize: 12)
        status.textColor = .secondaryLabelColor
        v.addSubview(status)

        // the verdict of plan-diff - stays empty until the run is through
        verdict.font = NSFont.boldSystemFont(ofSize: 13)
        v.addSubview(verdict)

        // second verdict: what the classbook is still missing
        book.font = NSFont.boldSystemFont(ofSize: 13)
        v.addSubview(book)

        // every label wraps instead of truncating - the window makes room for it
        for f in [title, status, verdict, book] {
            f.usesSingleLineMode = false
            f.cell?.wraps = true
            f.cell?.isScrollable = false
            f.lineBreakMode = .byWordWrapping
            f.preferredMaxLayoutWidth = COL
        }

        // Only shown when something is actually open - and it is the ONLY thing that writes.
        fill.bezelStyle = .rounded
        fill.target = self; fill.action = #selector(fillBook)
        fill.isHidden = true
        v.addSubview(fill)

        ok.bezelStyle = .rounded
        ok.keyEquivalent = "\r"
        ok.target = self; ok.action = #selector(quit)
        ok.isHidden = true
        v.addSubview(ok)

        relayout()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        run()
    }

    // How tall a wrapped label needs to be at COL points - an empty one takes no room at all.
    func height(_ f: NSTextField) -> CGFloat {
        guard !f.stringValue.isEmpty, let cell = f.cell else { return 0 }
        return ceil(cell.cellSize(forBounds: NSRect(x: 0, y: 0, width: COL, height: 10_000)).height)
    }

    // Stacks the rows top down and resizes the window to fit, keeping its top edge where it is
    // so the dialog grows downwards instead of jumping around under the pointer.
    func relayout() {
        let tH = height(title), sH = height(status), vH = height(verdict), bH = height(book)
        var total: CGFloat = 16 + tH + 12 + 20 + 10 + sH
        if vH > 0 { total += 12 + vH }
        if bH > 0 { total += 8 + bH }
        total += 16 + 28 + 14

        var fr = window.frameRect(forContentRect: NSRect(x: 0, y: 0, width: WIN, height: total))
        fr.origin.x = window.frame.origin.x
        fr.origin.y = window.frame.maxY - fr.height
        window.setFrame(fr, display: true)

        var y = total - 16 - tH
        title.frame = NSRect(x: PAD, y: y, width: COL, height: tH)
        y -= 12 + 20
        bar.frame = NSRect(x: PAD, y: y, width: COL, height: 20)
        y -= 10 + sH
        status.frame = NSRect(x: PAD, y: y, width: COL, height: sH)
        if vH > 0 { y -= 12 + vH; verdict.frame = NSRect(x: PAD, y: y, width: COL, height: vH) }
        if bH > 0 { y -= 8 + bH; book.frame = NSRect(x: PAD, y: y, width: COL, height: bH) }
        y -= 16 + 28
        ok.frame = NSRect(x: WIN - PAD - 70, y: y, width: 70, height: 28)
        fill.frame = NSRect(x: WIN - PAD - 70 - 10 - 115, y: y, width: 115, height: 28)
    }

    func run() {
        let p = Process()
        p.executableURL = URL(fileURLWithPath: "/bin/bash")
        // plan-diff and the classbook check both answer 1 for "there is something", which is
        // not a failure - hence the test wrappers, or the app would go red every time.
        p.arguments = ["-lc", "cd \"\(REPO)\" && \"\(NODE)\" tools/webuntis.js year && \"\(NODE)\" tools/webuntis.js names"
            + " && { \"\(NODE)\" tools/plan-diff.mjs --save --line; test $? -le 1; }"
            + " && { \"\(NODE)\" tools/webuntis.js plan --offen --dry --line; test $? -le 1; }"]
        let pipe = Pipe()
        p.standardOutput = pipe; p.standardError = pipe
        pipe.fileHandleForReading.readabilityHandler = { h in
            let d = h.availableData
            if d.isEmpty { return }
            let s = String(decoding: d, as: UTF8.self)
            DispatchQueue.main.async { self.consume(s) }
        }
        p.terminationHandler = { proc in
            DispatchQueue.main.async { self.finish(code: proc.terminationStatus) }
        }
        do { try p.run() } catch {
            status.stringValue = "Konnte node nicht starten: \(error.localizedDescription)"
            finish(code: 1)
        }
    }

    // progress lines arrive as "\r  37/80  FOG25-1     "; summaries end with "\n"
    func consume(_ s: String) {
        buffer += s
        let parts = buffer.components(separatedBy: CharacterSet(charactersIn: "\r\n"))
        buffer = parts.last ?? ""
        for raw in parts.dropLast() {
            let line = raw.trimmingCharacters(in: .whitespaces)
            if line.isEmpty { continue }
            if line.hasPrefix("KEINE ÄNDERUNGEN") || line.hasPrefix("ÄNDERUNGEN:")
                || line.hasPrefix("ERSTER LAUF:") {
                showVerdict(line)
                continue
            }
            if line.hasPrefix("KLASSENBUCH:") {
                showBook(line)
                continue
            }
            if line.contains("Stunden") || line.contains("Namen") { summary.append(line) }
            show(line)
        }
        let live = buffer.trimmingCharacters(in: .whitespaces)
        if !live.isEmpty { show(live) }
    }

    func show(_ line: String) {
        status.stringValue = line
        relayout()
        // While writing there is no 80-class scale to fill - the bar keeps sweeping, and the
        // "120/767 Stundeninhalte gelesen" lines of the status refresh must not drive it.
        if writing { return }
        // "37/80  FOG25-1" -> 37
        if let slash = line.firstIndex(of: "/"), let n = Int(line[..<slash].trimmingCharacters(in: .whitespaces)) {
            if bar.isIndeterminate { bar.isIndeterminate = false; bar.stopAnimation(nil) }
            bar.doubleValue = Double(n)
        }
        if line.contains("Namen") || line.contains("Schuljahr") {
            if !bar.isIndeterminate { bar.doubleValue = line.contains("Namen") ? 80 : bar.doubleValue }
        }
    }

    // green when nothing moved, our red when it did - readable at a glance from
    // across the room, which is the whole point of the line.
    func showVerdict(_ line: String) {
        verdict.stringValue = broken(line)
        verdict.toolTip = line
        verdict.textColor = line.hasPrefix("ÄNDERUNGEN:") ? docRed : docGreen
        relayout()
    }

    // Same idea one line down, for the classbook: green means nothing is missing, red means
    // lessons are still empty - and only then does the Eintragen button appear.
    func showBook(_ line: String) {
        book.stringValue = broken(line)
        book.toolTip = line
        // Red only when there is something to DO: empty lessons, or a write that failed.
        // "7 Stunden eingetragen" after a successful run is good news, not a warning.
        let open = line.contains("ohne Lernstoff") || line.contains("FEHLGESCHLAGEN")
        book.textColor = open ? docRed : docGreen
        fill.isHidden = !open || writing
        relayout()
    }

    func finish(code: Int32) {
        bar.isIndeterminate = false; bar.stopAnimation(nil)
        if code == 0 {
            bar.doubleValue = 80
            title.stringValue = writing ? "Klassenbuch gefüllt." : "WebUntis geholt."
            if !writing {
                status.stringValue = summary.map { $0.components(separatedBy: " -> ").first ?? $0 }
                    .joined(separator: "\n")
            }
        } else {
            title.stringValue = "Fehlgeschlagen (Code \(code))"
            status.textColor = docRed
        }
        ok.isHidden = false
        ok.isEnabled = true
        relayout()
        window.makeFirstResponder(ok)
        NSApp.activate(ignoringOtherApps: true)
    }

    // The one place that writes. Runs the same check again WITHOUT --dry, so what gets written is
    // exactly what the line above just announced; the tool itself reads every entry back and
    // refuses to touch a lesson whose text was changed by hand.
    @objc func fillBook() {
        writing = true
        fill.isHidden = true
        ok.isEnabled = false
        title.stringValue = "Klassenbuch füllen …"
        status.textColor = .secondaryLabelColor
        status.stringValue = "Stundeninhalte werden eingetragen …"
        bar.isIndeterminate = true
        bar.startAnimation(nil)
        summary.removeAll()
        buffer = ""
        relayout()

        let p = Process()
        p.executableURL = URL(fileURLWithPath: "/bin/bash")
        p.arguments = ["-lc", "cd \"\(REPO)\" && { \"\(NODE)\" tools/webuntis.js plan --offen --line; test $? -le 1; }"]
        let pipe = Pipe()
        p.standardOutput = pipe; p.standardError = pipe
        pipe.fileHandleForReading.readabilityHandler = { h in
            let d = h.availableData
            if d.isEmpty { return }
            let s = String(decoding: d, as: UTF8.self)
            DispatchQueue.main.async { self.consume(s) }
        }
        p.terminationHandler = { proc in
            DispatchQueue.main.async { self.finish(code: proc.terminationStatus) }
        }
        do { try p.run() } catch {
            status.stringValue = "Konnte node nicht starten: \(error.localizedDescription)"
            finish(code: 1)
        }
    }

    @objc func quit() { NSApp.terminate(nil) }
    func applicationShouldTerminateAfterLastWindowClosed(_ s: NSApplication) -> Bool { true }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = App()
app.delegate = delegate
app.run()
