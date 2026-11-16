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
// Since 04.11.2026 a third line compares the tests: "webuntis.js pruefungen --line" ->
// "PRÜFUNGEN: ..." says whether WebUntis and the plan name the same tests for the next 14 days,
// and which tests the next school day has (Doc, 04.11.2026, after BGY 13 read an old Mini-Test
// date in WebUntis). Read-only, nothing to press.
//
// Since 05.11.2026 OK no longer closes quietly while the classbook line is red: a warning names
// the open lessons with the text the button would write ("OFFEN:" lines of the same check) and
// offers Eintragen once more. Doc had pressed OK at 18:00 and BGY24/BGY25 stayed empty ("Da muss
// also dringend eine Warnung kommen"). The window's close button goes the same way.
//
// Since 22.09.2026 nothing is cut off any more: every line wraps, each fact separated by " · "
// gets its own line, and the window grows to whatever it needs. Green rgb(121,158,49) means
// fine, red rgb(176,36,24) means something wants doing - the palette values as they are, on
// the labs' almost-black navy, so they look the same in light mode and dark.
//
// Since 16.11.2026 a run without its KLASSENBUCH line counts as failed, whatever the exit code
// says - in the check and in Eintragen alike. That evening the 18:00 check died on a network
// error; its exit code 1 passed the `test $? -le 1` wrapper as "something open", the window said
// "WebUntis geholt." in green, had no classbook line and no Eintragen button, and OK closed it
// without a word. webuntis.js now ends a crash with 3 (and retries its reads), and everything
// the run prints goes, with a time stamp, to ~/Library/Logs/webuntis-app.log - before, nothing
// was left to tell what the window had shown.

import AppKit

let REPO = "/Users/malvers/IdeaProjects/forloop"
let NODE = "/usr/local/bin/node"

// The app's own log: every line the run prints, plus start, end and what was pressed.
let LOG = URL(fileURLWithPath: NSHomeDirectory() + "/Library/Logs/webuntis-app.log")
let logStamp: DateFormatter = {
    let f = DateFormatter()
    f.locale = Locale(identifier: "en_US_POSIX")
    f.dateFormat = "yyyy-MM-dd HH:mm:ss"
    return f
}()
func appLog(_ text: String) {
    guard let data = "\(logStamp.string(from: Date()))  \(text)\n".data(using: .utf8) else { return }
    if let h = try? FileHandle(forWritingTo: LOG) {
        defer { try? h.close() }
        _ = try? h.seekToEnd()
        try? h.write(contentsOf: data)
    } else {
        try? data.write(to: LOG)       // first line: the file does not exist yet
    }
}

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

final class App: NSObject, NSApplicationDelegate, NSWindowDelegate {
    var window: NSWindow!
    let title = NSTextField(labelWithString: "WebUntis: Stundenplan holen")
    let status = NSTextField(labelWithString: "Anmelden …")
    let bar = NSProgressIndicator()
    let verdict = NSTextField(labelWithString: "")
    let book = NSTextField(labelWithString: "")
    let exams = NSTextField(labelWithString: "")
    let ok = NSButton(title: "OK", target: nil, action: nil)
    let fill = NSButton(title: "Eintragen", target: nil, action: nil)
    var summary: [String] = []
    var buffer = ""
    var writing = false          // second phase: the classbook is being filled
    var pending: [String] = []   // "OFFEN:" lines - what Eintragen would write, for the warning
    var sawBook = false          // a KLASSENBUCH line arrived in this phase - without it, no success
    func applicationDidFinishLaunching(_ n: Notification) {
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: WIN, height: 212),
                          styleMask: [.titled, .closable], backing: .buffered, defer: false)
        window.title = "WebUntis holen"
        window.delegate = self
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

        // third verdict: do WebUntis and the plan name the same tests?
        exams.font = NSFont.boldSystemFont(ofSize: 13)
        v.addSubview(exams)

        // every label wraps instead of truncating - the window makes room for it
        for f in [title, status, verdict, book, exams] {
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
        let tH = height(title), sH = height(status), vH = height(verdict), bH = height(book), eH = height(exams)
        var total: CGFloat = 16 + tH + 12 + 20 + 10 + sH
        if vH > 0 { total += 12 + vH }
        if bH > 0 { total += 8 + bH }
        if eH > 0 { total += 8 + eH }
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
        if eH > 0 { y -= 8 + eH; exams.frame = NSRect(x: PAD, y: y, width: COL, height: eH) }
        y -= 16 + 28
        ok.frame = NSRect(x: WIN - PAD - 70, y: y, width: 70, height: 28)
        fill.frame = NSRect(x: WIN - PAD - 70 - 10 - 115, y: y, width: 115, height: 28)
    }

    func run() {
        // plan-diff and the classbook check both answer 1 for "there is something", which is
        // not a failure - hence the test wrappers, or the app would go red every time. A crash
        // of webuntis.js ends with 3 since 16.11.2026, so the wrapper no longer lets it through.
        appLog("START holen")
        launch("cd \"\(REPO)\" && \"\(NODE)\" tools/webuntis.js year && \"\(NODE)\" tools/webuntis.js names"
            + " && { \"\(NODE)\" tools/plan-diff.mjs --save --line; test $? -le 1; }"
            + " && { \"\(NODE)\" tools/webuntis.js plan --offen --dry --line; test $? -le 1; }"
            + " && { \"\(NODE)\" tools/webuntis.js pruefungen --line; test $? -le 1; }")
    }

    // One way to run a phase (fetch or Eintragen): bash -lc, output streamed into consume().
    // At the end the pipe is drained BEFORE finish() runs - the KLASSENBUCH line of Eintragen is
    // the very last thing printed, and finish() now treats a missing one as a failure.
    func launch(_ script: String) {
        let p = Process()
        p.executableURL = URL(fileURLWithPath: "/bin/bash")
        p.arguments = ["-lc", script]
        let pipe = Pipe()
        p.standardOutput = pipe; p.standardError = pipe
        pipe.fileHandleForReading.readabilityHandler = { h in
            let d = h.availableData
            if d.isEmpty { return }
            let s = String(decoding: d, as: UTF8.self)
            DispatchQueue.main.async { self.consume(s) }
        }
        p.terminationHandler = { proc in
            let h = pipe.fileHandleForReading
            h.readabilityHandler = nil
            let rest = String(decoding: h.readDataToEndOfFile(), as: UTF8.self)
            DispatchQueue.main.async {
                if !rest.isEmpty { self.consume(rest) }
                if !self.buffer.isEmpty { self.consume("\n") }   // a last line without newline
                self.finish(code: proc.terminationStatus)
            }
        }
        do { try p.run() } catch {
            status.stringValue = "Konnte node nicht starten: \(error.localizedDescription)"
            appLog("FEHLER: node nicht gestartet: \(error.localizedDescription)")
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
            appLog(line)
            if line.hasPrefix("KEINE ÄNDERUNGEN") || line.hasPrefix("ÄNDERUNGEN")
                || line.hasPrefix("ERSTER LAUF:") {
                showVerdict(line)
                continue
            }
            if line.hasPrefix("OFFEN:") {
                pending.append(String(line.dropFirst(6)).trimmingCharacters(in: .whitespaces))
                continue
            }
            if line.hasPrefix("KLASSENBUCH:") {
                showBook(line)
                continue
            }
            if line.hasPrefix("PRÜFUNGEN:") {
                showExams(line)
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
        verdict.textColor = line.hasPrefix("ÄNDERUNGEN") ? docRed : docGreen
        relayout()
    }

    // Same idea one line down, for the classbook: green means nothing is missing, red means
    // lessons are still empty - and only then does the Eintragen button appear.
    func showBook(_ line: String) {
        sawBook = true
        book.stringValue = broken(line)
        book.toolTip = line
        // Red only when there is something to DO: empty lessons, or a write that failed.
        // "7 Stunden eingetragen" after a successful run is good news, not a warning.
        let open = line.contains("ohne Lernstoff") || line.contains("FEHLGESCHLAGEN")
        book.textColor = open ? docRed : docGreen
        fill.isHidden = !open || writing
        relayout()
    }

    // Third line, the tests: red when WebUntis and the plan disagree or the check failed.
    // Nothing to press - a test is moved by hand in WebUntis, after Doc's yes.
    func showExams(_ line: String) {
        exams.stringValue = broken(line)
        exams.toolTip = line
        let off = line.contains("Abweichung") || line.contains("FEHLGESCHLAGEN")
        exams.textColor = off ? docRed : docGreen
        relayout()
    }

    func finish(code: Int32) {
        bar.isIndeterminate = false; bar.stopAnimation(nil)
        // Safety net (16.11.2026): no KLASSENBUCH line means the classbook was NOT checked - or,
        // after Eintragen, that nobody knows what got written. That is a failure even with exit
        // code 0; the status keeps the last line the run printed (usually the error), and there
        // is no Eintragen button on a check that never happened.
        if !sawBook {
            book.stringValue = writing ? "KLASSENBUCH: keine Rückmeldung – ob eingetragen wurde, ist unklar"
                : "KLASSENBUCH: nicht geprüft – die Abfrage ist abgebrochen"
            book.toolTip = book.stringValue
            book.textColor = docRed
            fill.isHidden = true
        }
        // Eintragen whose own line reports failed lessons is not "gefüllt" either.
        let partly = writing && book.stringValue.contains("FEHLGESCHLAGEN")
        if code == 0 && sawBook && !partly {
            bar.doubleValue = 80
            title.stringValue = writing ? "Klassenbuch gefüllt." : "WebUntis geholt."
            if !writing {
                status.stringValue = summary.map { $0.components(separatedBy: " -> ").first ?? $0 }
                    .joined(separator: "\n")
            }
        } else {
            title.stringValue = partly ? "Eintragen teilweise fehlgeschlagen"
                : code == 0 ? "Fehlgeschlagen (keine Klassenbuch-Antwort)" : "Fehlgeschlagen (Code \(code))"
            title.textColor = docRed
            status.textColor = docRed
        }
        appLog("ENDE \(writing ? "eintragen" : "holen"): Code \(code) · \(title.stringValue)")
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
        sawBook = false              // the check's line does not count for the write
        relayout()

        appLog("START eintragen")
        launch("cd \"\(REPO)\" && { \"\(NODE)\" tools/webuntis.js plan --offen --line; test $? -le 1; }")
    }

    // OK and the close button both ask here first. While lessons are still empty and nothing was
    // written in this run, leaving takes a second word: the warning lists what is open and offers
    // Eintragen again. After an Eintragen run (writing) it never asks - a failure is red already.
    func mayLeave() -> Bool {
        guard !writing, !fill.isHidden else { return true }
        let a = NSAlert()
        a.alertStyle = .critical
        // no OFFEN line = only the attendance tick or plan gaps are left, not a topic
        a.messageText = pending.isEmpty ? "Klassenbuch ist noch nicht fertig!"
            : "Klassenbuch ist noch NICHT eingetragen!"
        let shown = pending.prefix(8).map { $0.count > 110 ? String($0.prefix(110)) + " …" : $0 }
        let more = pending.count > shown.count ? ["… und \(pending.count - shown.count) weitere"] : []
        var text = book.stringValue.replacingOccurrences(of: "KLASSENBUCH: ", with: "")
        if !shown.isEmpty {
            text += "\n\nDas würde eingetragen:\n" + (shown + more).joined(separator: "\n")
                + "\n\nStimmt das für jede Stunde? (Test geschrieben, Stunde anders gelaufen?)"
        }
        a.informativeText = text
        a.addButton(withTitle: "Eintragen")
        a.addButton(withTitle: "Nicht eintragen")
        a.buttons[1].keyEquivalent = "\u{1b}"   // Esc = leave without writing
        NSApp.activate(ignoringOtherApps: true)
        if a.runModal() == .alertFirstButtonReturn {
            appLog("Warnung beim Schließen: Eintragen gewählt")
            fillBook()
            return false
        }
        appLog("Warnung beim Schließen: Nicht eintragen gewählt")
        return true
    }

    @objc func quit() { if mayLeave() { appLog("geschlossen (OK)"); NSApp.terminate(nil) } }
    func windowShouldClose(_ sender: NSWindow) -> Bool {
        let leave = mayLeave()
        if leave { appLog("geschlossen (Fenster)") }
        return leave
    }
    func applicationShouldTerminateAfterLastWindowClosed(_ s: NSApplication) -> Bool { true }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = App()
app.delegate = delegate
app.run()
