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

import AppKit

let REPO = "/Users/malvers/IdeaProjects/forloop"
let NODE = "/usr/local/bin/node"

final class App: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    let title = NSTextField(labelWithString: "WebUntis: Stundenplan holen")
    let status = NSTextField(labelWithString: "Anmelden …")
    let bar = NSProgressIndicator()
    let verdict = NSTextField(labelWithString: "")
    let ok = NSButton(title: "OK", target: nil, action: nil)
    var summary: [String] = []
    var buffer = ""

    func applicationDidFinishLaunching(_ n: Notification) {
        let rect = NSRect(x: 0, y: 0, width: 460, height: 186)
        window = NSWindow(contentRect: rect, styleMask: [.titled, .closable], backing: .buffered, defer: false)
        window.title = "WebUntis holen"
        window.center()
        let v = window.contentView!

        title.font = NSFont.boldSystemFont(ofSize: 14)
        title.frame = NSRect(x: 20, y: 144, width: 420, height: 22)
        v.addSubview(title)

        bar.frame = NSRect(x: 20, y: 110, width: 420, height: 20)
        bar.style = .bar
        bar.minValue = 0; bar.maxValue = 80
        bar.isIndeterminate = true
        bar.startAnimation(nil)
        v.addSubview(bar)

        status.font = NSFont.systemFont(ofSize: 12)
        status.textColor = .secondaryLabelColor
        status.frame = NSRect(x: 20, y: 84, width: 420, height: 18)
        status.lineBreakMode = .byTruncatingTail
        v.addSubview(status)

        // the verdict of plan-diff - stays empty until the run is through
        verdict.font = NSFont.boldSystemFont(ofSize: 13)
        verdict.frame = NSRect(x: 20, y: 50, width: 420, height: 20)
        verdict.lineBreakMode = .byTruncatingTail
        v.addSubview(verdict)

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
        p.arguments = ["-lc", "cd \"\(REPO)\" && \"\(NODE)\" tools/webuntis.js year && \"\(NODE)\" tools/webuntis.js names"
            + " && { \"\(NODE)\" tools/plan-diff.mjs --save --line; test $? -le 1; }"]
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
            if line.contains("Stunden") || line.contains("Namen") { summary.append(line) }
            show(line)
        }
        let live = buffer.trimmingCharacters(in: .whitespaces)
        if !live.isEmpty { show(live) }
    }

    func show(_ line: String) {
        status.stringValue = line
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
        verdict.textColor = line.hasPrefix("ÄNDERUNGEN:") ? .systemOrange : .systemGreen
    }

    func finish(code: Int32) {
        bar.isIndeterminate = false; bar.stopAnimation(nil)
        if code == 0 {
            bar.doubleValue = 80
            title.stringValue = "WebUntis geholt."
            status.stringValue = summary.map { $0.components(separatedBy: " -> ").first ?? $0 }.joined(separator: " · ")
        } else {
            title.stringValue = "Fehlgeschlagen (Code \(code))"
            status.textColor = .systemRed
        }
        ok.isHidden = false
        window.makeFirstResponder(ok)
        NSApp.activate(ignoringOtherApps: true)
    }

    @objc func quit() { NSApp.terminate(nil) }
    func applicationShouldTerminateAfterLastWindowClosed(_ s: NSApplication) -> Bool { true }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = App()
app.delegate = delegate
app.run()
