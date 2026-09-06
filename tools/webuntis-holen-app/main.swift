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

import AppKit

let REPO = "/Users/malvers/IdeaProjects/forloop"
let NODE = "/usr/local/bin/node"

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
        let rect = NSRect(x: 0, y: 0, width: 460, height: 212)
        window = NSWindow(contentRect: rect, styleMask: [.titled, .closable], backing: .buffered, defer: false)
        window.title = "WebUntis holen"
        window.center()
        let v = window.contentView!

        title.font = NSFont.boldSystemFont(ofSize: 14)
        title.frame = NSRect(x: 20, y: 170, width: 420, height: 22)
        v.addSubview(title)

        bar.frame = NSRect(x: 20, y: 136, width: 420, height: 20)
        bar.style = .bar
        bar.minValue = 0; bar.maxValue = 80
        bar.isIndeterminate = true
        bar.startAnimation(nil)
        v.addSubview(bar)

        status.font = NSFont.systemFont(ofSize: 12)
        status.textColor = .secondaryLabelColor
        status.frame = NSRect(x: 20, y: 110, width: 420, height: 18)
        status.lineBreakMode = .byTruncatingTail
        v.addSubview(status)

        // the verdict of plan-diff - stays empty until the run is through
        verdict.font = NSFont.boldSystemFont(ofSize: 13)
        verdict.frame = NSRect(x: 20, y: 76, width: 420, height: 20)
        verdict.lineBreakMode = .byTruncatingTail
        v.addSubview(verdict)

        // second verdict: what the classbook is still missing
        book.font = NSFont.boldSystemFont(ofSize: 13)
        book.frame = NSRect(x: 20, y: 50, width: 420, height: 20)
        book.lineBreakMode = .byTruncatingTail
        v.addSubview(book)

        // Only shown when something is actually open - and it is the ONLY thing that writes.
        fill.frame = NSRect(x: 245, y: 12, width: 115, height: 28)
        fill.bezelStyle = .rounded
        fill.target = self; fill.action = #selector(fillBook)
        fill.isHidden = true
        v.addSubview(fill)

        ok.frame = NSRect(x: 370, y: 12, width: 70, height: 28)
        ok.bezelStyle = .rounded
        ok.keyEquivalent = "\r"
        ok.target = self; ok.action = #selector(quit)
        ok.isHidden = true
        v.addSubview(ok)

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        run()
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

    // green when nothing moved, orange when it did - readable at a glance from
    // across the room, which is the whole point of the line.
    func showVerdict(_ line: String) {
        verdict.stringValue = line
        verdict.toolTip = line
        verdict.textColor = line.hasPrefix("ÄNDERUNGEN:") ? .systemOrange : .systemGreen
    }

    // Same idea one line down, for the classbook: green means nothing is missing, orange means
    // lessons are still empty - and only then does the Eintragen button appear.
    func showBook(_ line: String) {
        book.stringValue = line
        // The window is 460 pt wide and the group list runs past that; the tooltip carries the
        // full sentence so nothing is lost to the ellipsis.
        book.toolTip = line
        // Orange only when there is something to DO: empty lessons, or a write that failed.
        // "7 Stunden eingetragen" after a successful run is good news, not a warning.
        let open = line.contains("ohne Lernstoff") || line.contains("FEHLGESCHLAGEN")
        book.textColor = open ? .systemOrange : .systemGreen
        fill.isHidden = !open || writing
    }

    func finish(code: Int32) {
        bar.isIndeterminate = false; bar.stopAnimation(nil)
        if code == 0 {
            bar.doubleValue = 80
            title.stringValue = writing ? "Klassenbuch gefüllt." : "WebUntis geholt."
            if !writing {
                status.stringValue = summary.map { $0.components(separatedBy: " -> ").first ?? $0 }.joined(separator: " · ")
            }
        } else {
            title.stringValue = "Fehlgeschlagen (Code \(code))"
            status.textColor = .systemRed
        }
        ok.isHidden = false
        ok.isEnabled = true
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
