// DocMic (app file: GlobeMic) — hold the Globe key to dictate into the Claude panel of VS Code, release to send.
// Holding Globe presses Cmd+D, letting go ends the dictation and presses Return. Return only
// goes out when a new microphone capture really started: with the cursor anywhere else Cmd+D
// never opens the mic, so nothing can land in the code. A dictation that reads exactly
// "Slash clear", "Slash usage" or "Slash context" becomes the real command. The tap only
// listens, a hang in here can not block the keyboard.
// In every other app the hold records on this Mac, Apple's on-device recognition writes it
// down and the text goes in at the cursor, without Return.

import AVFoundation
import Cocoa
import CoreAudio
import ServiceManagement
import Speech

// MARK: - settings

enum Timing {
    static let arm = 0.12       // Globe held this long counts as a hold, shorter stays a tap
    static let tail = 0.30      // the mic stays open after release so the last word arrives
    static let minHold = 0.25   // the panel latches the mic on when Cmd+D is shorter than 0.2 s
    static let send = 0.12      // pause between ending the dictation and Return
    static let poll = 0.05      // how often the mic is checked during a hold
    static let beep = 0.60      // a hold this long without a mic gets a beep, a slow tap does not
    static let command = 6.0    // only a hold this short can be a spoken command
    static let copy = 0.05      // pause between select all and copy, and after each copy check
    static let copyTries = 8    // gives the panel 0.4 s to answer Cmd+C
    static let menu = 0.15      // the slash menu needs a moment before Return
    static let finish = 4.0     // the longest wait for the last words of a local dictation
    static let paste = 0.40     // the clipboard goes back once the app has pasted
    static let ask = 0.50       // the longest an app may take to say where its cursor is
    static let notice = 1.20    // how long the HUD shows "nothing heard" and the like
}

enum Key {
    static let globe: Int64 = 63
    static let command: CGKeyCode = 55
    static let shift: CGKeyCode = 56
    static let d: CGKeyCode = 2
    static let enter: CGKeyCode = 36
    static let a: CGKeyCode = 0
    static let c: CGKeyCode = 8
    static let v: CGKeyCode = 9
    static let delete: CGKeyCode = 51
}

let vsCodeBundle = "com.microsoft.VSCode"

/// Messengers where letting go of Globe also sends, like in the Claude panel (Doc, 03.11.2026).
/// Everywhere else the text only goes in.
let sendsOnRelease: Set<String> = ["net.whatsapp.WhatsApp", "org.whispersystems.signal-desktop",
                                   "com.microsoft.teams2", "ru.keepcoder.Telegram"]

/// Spoken word to real command. German dictation writes "Kontext" just as well as "context".
let spokenCommands = ["clear": "/clear", "usage": "/usage", "context": "/context", "kontext": "/context"]

/// The command the whole field stands for, anything else stays a normal message (nil).
/// Short dictations often already arrive as "/clear." with a period that breaks the command.
func spokenCommand(_ text: String) -> String? {
    let compact = text.lowercased().filter { $0.isLetter || $0.isNumber || $0 == "/" }
    for slash in ["slash", "/"] where compact.hasPrefix(slash) {
        if let command = spokenCommands[String(compact.dropFirst(slash.count))] { return command }
    }
    return nil
}

// MARK: - log

/// Phases and timing only, never which keys were pressed.
func log(_ text: String) {
    let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("Logs/GlobeMic.log")
    let line = "\(ISO8601DateFormatter().string(from: Date())) \(text)\n"
    if let handle = try? FileHandle(forWritingTo: url) {
        handle.seekToEndOfFile()
        handle.write(Data(line.utf8))
        try? handle.close()
    } else {
        try? line.write(to: url, atomically: true, encoding: .utf8)
    }
}

// MARK: - microphone

enum Mic {
    /// Processes capturing audio right now, on any input device.
    static func capturing() -> Set<pid_t> {
        let system = AudioObjectID(kAudioObjectSystemObject)
        var addr = address(kAudioHardwarePropertyProcessObjectList)
        var size: UInt32 = 0
        guard AudioObjectGetPropertyDataSize(system, &addr, 0, nil, &size) == noErr else { return [] }
        var objects = [AudioObjectID](repeating: 0, count: Int(size) / MemoryLayout<AudioObjectID>.size)
        guard AudioObjectGetPropertyData(system, &addr, 0, nil, &size, &objects) == noErr else { return [] }

        var pids = Set<pid_t>()
        for object in objects {
            var running: UInt32 = 0
            var pid: pid_t = -1
            guard read(object, kAudioProcessPropertyIsRunningInput, &running), running != 0,
                  read(object, kAudioProcessPropertyPID, &pid) else { continue }
            pids.insert(pid)
        }
        return pids
    }

    private static func address(_ selector: AudioObjectPropertySelector) -> AudioObjectPropertyAddress {
        AudioObjectPropertyAddress(mSelector: selector, mScope: kAudioObjectPropertyScopeGlobal,
                                   mElement: kAudioObjectPropertyElementMain)
    }

    private static func read<T: FixedWidthInteger>(_ object: AudioObjectID,
                                                   _ selector: AudioObjectPropertySelector,
                                                   _ value: inout T) -> Bool {
        var addr = address(selector)
        var size = UInt32(MemoryLayout<T>.size)
        return AudioObjectGetPropertyData(object, &addr, 0, nil, &size, &value) == noErr
    }
}

// MARK: - clipboard

enum Clipboard {
    static func snapshot() -> [NSPasteboardItem] {
        (NSPasteboard.general.pasteboardItems ?? []).map { item in
            let copy = NSPasteboardItem()
            for type in item.types {
                if let data = item.data(forType: type) { copy.setData(data, forType: type) }
            }
            return copy
        }
    }

    static func restore(_ items: [NSPasteboardItem]) {
        NSPasteboard.general.clearContents()
        if !items.isEmpty { NSPasteboard.general.writeObjects(items) }
    }

    /// The marker clipboard managers honour, so a dictation does not land in their history.
    static func put(_ text: String) {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(text, forType: .string)
        NSPasteboard.general.setData(Data(), forType: NSPasteboard.PasteboardType("org.nspasteboard.TransientType"))
    }

    /// Pastes at the cursor and gives the old clipboard back afterwards.
    static func paste(_ text: String) {
        let saved = snapshot()
        put(text)
        Keyboard.paste()
        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.paste) { restore(saved) }
    }
}

// MARK: - focus

enum Focus {
    private static let textRoles: Set<String> = ["AXTextField", "AXTextArea", "AXComboBox", "AXSearchField"]

    /// True only when the cursor of the app sits in something that takes text. Typed letters
    /// anywhere else are shortcuts (in Gmail "e" archives, "#" deletes). Electron apps like
    /// Signal only show their fields once asked for accessibility. The note names the kind of
    /// element for the log, never what is in it.
    static func takesText(_ pid: pid_t) -> (Bool, String) {
        let app = AXUIElementCreateApplication(pid)
        AXUIElementSetMessagingTimeout(app, Float(Timing.ask))
        AXUIElementSetAttributeValue(app, "AXManualAccessibility" as CFString, kCFBooleanTrue)
        var value: CFTypeRef?
        let asked = AXUIElementCopyAttributeValue(app, kAXFocusedUIElementAttribute as CFString, &value)
        guard asked == .success, let focused = value, CFGetTypeID(focused) == AXUIElementGetTypeID() else {
            return (false, "focus unreadable \(asked.rawValue)")
        }
        let element = focused as! AXUIElement
        var role: CFTypeRef?
        AXUIElementCopyAttributeValue(element, kAXRoleAttribute as CFString, &role)
        let name = role as? String ?? "no role"
        if textRoles.contains(name) { return (true, name) }
        // A new mail in Mail is a whole editable web page; the message view has the same role but
        // can not be changed, and there Delete would throw the mail away.
        if name == "AXWebArea" {
            var settable = DarwinBoolean(false)
            AXUIElementIsAttributeSettable(element, kAXValueAttribute as CFString, &settable)
            return (settable.boolValue, settable.boolValue ? "editable AXWebArea" : "read-only AXWebArea")
        }
        var editable: CFTypeRef?
        AXUIElementCopyAttributeValue(element, "AXEditable" as CFString, &editable)
        return ((editable as? Bool) == true, name)
    }
}

// MARK: - keyboard

enum Keyboard {
    // A private state keeps the posted Cmd out of the real modifier state of the machine.
    private static let source = CGEventSource(stateID: .privateState)
    /// Every event posted here carries this, so the tap can tell it from the real keyboard.
    static let mark: Int64 = 0x444D_6963

    private static func post(_ key: CGKeyCode, down: Bool, flags: CGEventFlags = []) {
        guard let event = CGEvent(keyboardEventSource: source, virtualKey: key, keyDown: down) else { return }
        event.flags = flags
        event.setIntegerValueField(.eventSourceUserData, value: mark)
        event.post(tap: .cghidEventTap)
    }

    static func holdCmdD() {
        post(Key.command, down: true, flags: .maskCommand)
        post(Key.d, down: true, flags: .maskCommand)
    }

    static func releaseCmdD() {
        post(Key.d, down: false, flags: .maskCommand)
        post(Key.command, down: false)
    }

    static func tapEnter() {
        post(Key.enter, down: true)
        post(Key.enter, down: false)
    }

    /// Shift+Return with a real Shift press around it: apps from the iPad like WhatsApp look
    /// at the Shift key, not only at the flag on the Return, and would send instead.
    static func newLine() {
        post(Key.shift, down: true, flags: .maskShift)
        post(Key.enter, down: true, flags: .maskShift)
        post(Key.enter, down: false, flags: .maskShift)
        post(Key.shift, down: false)
    }

    private static func tapWithCommand(_ key: CGKeyCode) {
        post(key, down: true, flags: .maskCommand)
        post(key, down: false, flags: .maskCommand)
    }

    static func selectAll() { tapWithCommand(Key.a) }
    static func copy() { tapWithCommand(Key.c) }

    /// Cmd+V with a real Command press around it, like Cmd+D for the panel.
    static func paste() {
        post(Key.command, down: true, flags: .maskCommand)
        post(Key.v, down: true, flags: .maskCommand)
        post(Key.v, down: false, flags: .maskCommand)
        post(Key.command, down: false)
    }

    static func erase(_ count: Int) {
        for _ in 0..<max(0, count) {
            post(Key.delete, down: true)
            post(Key.delete, down: false)
        }
    }

    /// Types by character, so the keyboard layout does not matter; an emoji goes out whole.
    /// A line break is Shift+Return, which starts a new line in messengers instead of sending.
    static func type(_ text: String) {
        for character in text {
            if character == "\n" { newLine(); continue }
            var units = Array(String(character).utf16)
            for down in [true, false] {
                guard let event = CGEvent(keyboardEventSource: source, virtualKey: 0, keyDown: down) else { continue }
                event.keyboardSetUnicodeString(stringLength: units.count, unicodeString: &units)
                event.flags = []
                event.setIntegerValueField(.eventSourceUserData, value: mark)
                event.post(tap: .cghidEventTap)
            }
        }
    }
}

// MARK: - local dictation

/// Apple's SpeechAnalyzer (macOS 26) on the Neural Engine. The system keeps the model, so
/// nothing stays loaded in here, and the audio never leaves the Mac. Whisper large-v3-turbo
/// was tried first (03.11.2026): about 3 s per dictation on this M3 and 0.7 to 1.7 GB held
/// all the time, against 0.3 to 0.5 s here with the same text.
enum Transcriber {
    static let locale = Locale(identifier: "de_DE")
    /// The recognizer splits the names of the house tools.
    static let names = ["Doc Point": "DocPoint", "Docpoint": "DocPoint", "Doc Mic": "DocMic", "Docmic": "DocMic",
                        "Doc Mirror": "DocMirror", "Docmirror": "DocMirror", "Doc Bar": "DocBar", "Docbar": "DocBar"]

    /// The audio format the recognizer wants, known once the model is there.
    private(set) static var format: AVAudioFormat?

    /// Fetches the German model once, about a minute and a half, later only checks.
    static func prepare() {
        Task {
            let transcriber = SpeechTranscriber(locale: locale, preset: .progressiveTranscription)
            do {
                if let request = try await AssetInventory.assetInstallationRequest(supporting: [transcriber]) {
                    log("speech model downloading")
                    try await request.downloadAndInstall()
                }
                let format = await SpeechAnalyzer.bestAvailableAudioFormat(compatibleWith: [transcriber])
                await MainActor.run { self.format = format }
                log(format == nil ? "speech model has no audio format" : "speech model ready")
            } catch {
                log("speech model missing")
            }
        }
    }

    static func fix(_ text: String) -> String {
        names.reduce(text) { $0.replacingOccurrences(of: $1.key, with: $1.value) }
    }
}

/// Spoken commands for the dictation outside VS Code (Doc, 03.11.2026). The recognizer writes
/// them as words, so they become signs afterwards, together with the commas and spaces it put
/// around them. "Punkt" and "Komma" stay words: too common ("der Punkt ist"), and the
/// recognizer sets both by itself, question marks mostly too.
enum Spoken {
    private enum Kind { case breaks, closing, bracket, opening, emoji }

    /// Spoken words (a regex, longer phrases first), the sign and how it sits in the text.
    private static let commands: [(String, String, Kind)] = [
        ("neue[rn]? absatz|new paragraph", "\n\n", .breaks),
        ("neue[rn]? zeile|nächste zeile|new line|next line", "\n", .breaks),
        ("ausrufezeichen|exclamation mark|exclamation point", "!", .closing),
        ("fragezeichen|question mark", "?", .closing),
        ("doppelpunkt|colon", ":", .closing),
        ("semikolon|semicolon", ";", .closing),
        ("klammer zu|close bracket", ")", .bracket),
        ("anführungszeichen zu|anführungszeichen oben|close quote", "“", .bracket),
        ("klammer auf|open bracket", "(", .opening),
        ("anführungszeichen auf|anführungszeichen unten|open quote", "„", .opening),
        ("gedankenstrich|dash", "–", .emoji),
        ("lachende[rs]? smiley|laughing smiley", "😄", .emoji),
        ("zwinker[- ]?smiley|zwinkernde[rs]? smiley|winking smiley", "😉", .emoji),
        ("traurige[rs]? smiley|sad smiley", "🙁", .emoji),
        ("smiley|smilie", "🙂", .emoji),
        ("daumen hoch|thumbs up", "👍", .emoji),
        ("herzchen|heart emoji", "❤️", .emoji),
    ]

    /// At the very end: the whole dictation goes away, nothing is sent.
    private static let scratch = "kommando zurück|scratch that"
    /// At the very end: the text stays, but a messenger does not send.
    private static let hold = "nicht senden|nicht abschicken|don'?t send"

    /// The text with the commands carried out, and whether a messenger may send it.
    static func apply(_ raw: String) -> (text: String, send: Bool) {
        if matches(raw, "\\b(?:\(scratch))\\b[\\s.,!?]*$") { return ("", false) }
        var text = raw
        var send = true
        if matches(text, "\\b(?:\(hold))\\b[\\s.,!?]*$") {
            text = replace(text, "[\\s,.;:]*\\b(?:\(hold))\\b[\\s.,!?]*$", "")
            send = false
        }
        for (words, sign, kind) in commands {
            let word = "\\b(?:\(words))\\b"
            let mark = NSRegularExpression.escapedTemplate(for: sign)
            let same = NSRegularExpression.escapedPattern(for: sign)
            switch kind {
            case .breaks: text = replace(text, "[ \\t,;]*\(word)[\\s,.;:]*", mark)
            // The recognizer often set the sign itself already, it is not doubled.
            case .closing: text = replace(text, "[\\s,.;:\(same)]*\(word)[ \\t,.;:]*", "\(mark) ")
            case .bracket: text = replace(text, "[\\s,]*\(word)[ \\t,]*", "\(mark) ")
            case .opening: text = replace(text, "[ \\t,]*\(word)[ \\t,.;:]*", " \(mark)")
            case .emoji: text = replace(text, "[ \\t,.]*\(word)[ \\t,.]*", " \(mark) ")
            }
        }
        text = replace(text, "[ \\t]{2,}", " ")
        text = replace(text, "[ \\t]+(?=[\\n!?:;,.)“])", "")
        text = replace(text, "(?<=[\\n(„])[ \\t]+", "")
        text = capitalized(text)
        text = text.trimmingCharacters(in: CharacterSet(charactersIn: " \t"))
        // A message that ends in a new line is still being written.
        if text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || text.hasSuffix("\n") { send = false }
        return (text, send)
    }

    /// A new line or the end of a sentence starts the next word with a capital.
    private static func capitalized(_ text: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: "(?:\\n|[!?] )(\\p{Ll})") else { return text }
        var result = text
        for match in regex.matches(in: text, range: NSRange(text.startIndex..., in: text)).reversed() {
            guard let range = Range(match.range(at: 1), in: result) else { continue }
            result.replaceSubrange(range, with: result[range].uppercased())
        }
        return result
    }

    private static func matches(_ text: String, _ pattern: String) -> Bool {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) else { return false }
        return regex.firstMatch(in: text, range: NSRange(text.startIndex..., in: text)) != nil
    }

    private static func replace(_ text: String, _ pattern: String, _ template: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) else { return text }
        return regex.stringByReplacingMatches(in: text, range: NSRange(text.startIndex..., in: text), withTemplate: template)
    }
}

/// One hold: the microphone feeds the recognizer while Globe is down, and every new guess
/// comes back as the whole text so far.
final class Live {
    static var allowed: Bool { AVCaptureDevice.authorizationStatus(for: .audio) == .authorized }

    private let engine = AVAudioEngine()
    private var analyzer: SpeechAnalyzer?
    private var feed: AsyncStream<AnalyzerInput>.Continuation?
    private var reader: Task<Void, Never>?
    private var finished = ""           // sentences the recognizer will not change any more
    private var guess = ""              // the part it may still change
    private var peak: Float = 0         // written on the audio thread, only read for the HUD
    private var pending: ((String) -> Void)?

    var text: String {
        let space = finished.isEmpty || guess.isEmpty || finished.last!.isWhitespace || guess.first!.isWhitespace ? "" : " "
        return Transcriber.fix(finished + space + guess).trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// The level from 0 to 1 since the last call.
    func level() -> Float {
        let db = 20 * log10(max(peak, 0.000_001))
        peak = 0
        return max(0, min(1, (db + 50) / 50))
    }

    /// `update` gets the whole text on the main thread whenever the recognizer has news.
    func start(_ update: @escaping (String) -> Void) -> Bool {
        let mic = engine.inputNode.outputFormat(forBus: 0)
        guard let format = Transcriber.format, mic.sampleRate > 0,
              let converter = AVAudioConverter(from: mic, to: format) else { return false }
        let transcriber = SpeechTranscriber(locale: Transcriber.locale, preset: .progressiveTranscription)
        let analyzer = SpeechAnalyzer(modules: [transcriber])
        let (stream, feed) = AsyncStream<AnalyzerInput>.makeStream()

        engine.inputNode.installTap(onBus: 0, bufferSize: 1024, format: mic) { [weak self] buffer, _ in
            self?.measure(buffer)
            let frames = AVAudioFrameCount(Double(buffer.frameLength) * format.sampleRate / mic.sampleRate) + 16
            guard let out = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frames) else { return }
            var given = false
            converter.convert(to: out, error: nil) { _, status in
                if given { status.pointee = .noDataNow; return nil }
                given = true
                status.pointee = .haveData
                return buffer
            }
            if out.frameLength > 0 { feed.yield(AnalyzerInput(buffer: out)) }
        }
        engine.prepare()
        do { try engine.start() } catch { engine.inputNode.removeTap(onBus: 0); return false }

        self.analyzer = analyzer
        self.feed = feed
        reader = Task { [weak self] in
            do {
                for try await result in transcriber.results {
                    let part = String(result.text.characters)
                    await MainActor.run {
                        guard let self = self else { return }
                        if result.isFinal {
                            let space = self.finished.isEmpty || part.first?.isWhitespace == true ? "" : " "
                            self.finished += space + part
                            self.guess = ""
                        } else {
                            self.guess = part
                        }
                        update(self.text)
                    }
                }
            } catch {
                log("local: recognizer stopped")
            }
        }
        Task { try? await analyzer.start(inputSequence: stream) }
        return true
    }

    /// Ends the hold, waits for the last words and hands over the whole text. Gives up after
    /// a few seconds with what it has, so a stuck recognizer can not hold the key.
    func stop(_ done: @escaping (String) -> Void) {
        halt()
        pending = done
        let analyzer = self.analyzer, reader = self.reader
        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.finish) { [weak self] in self?.deliver() }
        Task { [weak self] in
            try? await analyzer?.finalizeAndFinishThroughEndOfInput()
            await reader?.value
            await MainActor.run { self?.deliver() }
        }
    }

    func cancel() {
        halt()
        let analyzer = self.analyzer
        Task { await analyzer?.cancelAndFinishNow() }
    }

    private func deliver() {
        guard let done = pending else { return }
        pending = nil
        done(text)
    }

    private func halt() {
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()
        feed?.finish()
        feed = nil
    }

    private func measure(_ buffer: AVAudioPCMBuffer) {
        guard let samples = buffer.floatChannelData?[0] else { return }
        var loudest: Float = 0
        for i in 0..<Int(buffer.frameLength) { loudest = max(loudest, abs(samples[i])) }
        peak = max(peak, loudest)
    }
}

/// Keeps the field in step with the recognizer: only the end that changed is deleted and
/// typed again, and never more than it typed itself.
final class Typist {
    private var typed = ""

    func reset() { typed = "" }

    func show(_ text: String) {
        let same = zip(typed, text).prefix { $0.0 == $0.1 }.count
        Keyboard.erase(typed.count - same)
        Keyboard.type(String(text.dropFirst(same)))
        typed = text
    }
}

/// A small dark capsule at the bottom of the screen with the mouse, five bars move with the
/// voice. Never takes the focus or a click.
final class Hud {
    private static let orange = NSColor(srgbRed: 245 / 255, green: 194 / 255, blue: 66 / 255, alpha: 1)
    private static let red = NSColor(srgbRed: 176 / 255, green: 36 / 255, blue: 24 / 255, alpha: 1)
    private static let green = NSColor(srgbRed: 121 / 255, green: 158 / 255, blue: 49 / 255, alpha: 1)
    private static let size = NSSize(width: 44, height: 18)
    private static let shape: [CGFloat] = [0.45, 0.75, 1, 0.75, 0.45]
    private static let bar: CGFloat = 2.5
    private static let step: CGFloat = 6

    private let panel: NSPanel
    private var bars: [CALayer] = []
    private var hideWork: DispatchWorkItem?

    init() {
        let size = Hud.size
        panel = NSPanel(contentRect: NSRect(origin: .zero, size: size),
                        styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: true)
        panel.level = .statusBar
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false
        panel.ignoresMouseEvents = true
        panel.alphaValue = 0.85
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary]

        let pill = NSVisualEffectView(frame: NSRect(origin: .zero, size: size))
        pill.material = .hudWindow
        pill.state = .active
        pill.wantsLayer = true
        pill.layer?.cornerRadius = size.height / 2
        pill.layer?.masksToBounds = true

        let left = (size.width - Hud.step * CGFloat(Hud.shape.count - 1) - Hud.bar) / 2
        for i in Hud.shape.indices {
            let bar = CALayer()
            bar.cornerRadius = Hud.bar / 2
            bar.frame = NSRect(x: left + CGFloat(i) * Hud.step, y: 0, width: Hud.bar, height: Hud.bar)
            pill.layer?.addSublayer(bar)
            bars.append(bar)
        }
        panel.contentView = pill
        level(0)
    }

    func listening() { show(Hud.orange) }
    func nothing() { show(Hud.red); level(0); hide(after: Timing.notice) }
    func onClipboard() { show(Hud.green); level(1); hide(after: Timing.notice) }

    /// The bars breathe with the voice.
    func level(_ value: Float) {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        for (bar, shape) in zip(bars, Hud.shape) {
            let height = max(Hud.bar, (Hud.size.height - 6) * shape * CGFloat(value) * .random(in: 0.8...1.2))
            bar.frame = NSRect(x: bar.frame.minX, y: (Hud.size.height - height) / 2, width: Hud.bar, height: height)
        }
        CATransaction.commit()
    }

    func hide(after delay: TimeInterval = 0) {
        hideWork?.cancel()
        let work = DispatchWorkItem { [weak self] in self?.panel.orderOut(nil) }
        hideWork = work
        DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: work)
    }

    private func show(_ color: NSColor) {
        hideWork?.cancel()
        for bar in bars { bar.backgroundColor = color.cgColor }
        let mouse = NSEvent.mouseLocation
        if let screen = NSScreen.screens.first(where: { NSMouseInRect(mouse, $0.frame, false) }) ?? NSScreen.main {
            let area = screen.visibleFrame
            panel.setFrameOrigin(NSPoint(x: area.midX - Hud.size.width / 2, y: area.minY + 16))
        }
        panel.orderFrontRegardless()
    }
}

// MARK: - app

enum Phase { case idle, armed, talking, finishing }

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var bar: DocBarClient!
    private var tap: CFMachPort?
    private var phase = Phase.idle
    private var armWork: DispatchWorkItem?
    private var micTimer: Timer?
    private var captureBefore = Set<pid_t>()
    private var micStarted = false
    private var talkStart = Date()
    private var published = ""
    private var live: Live?
    private let typist = Typist()
    private let hud = Hud()
    private var levelTimer: Timer?
    private var local = false           // this hold dictates on this Mac, not into the Claude panel
    private var target: pid_t = 0       // the app the text goes to
    private var strayed = false         // another app came to the front during this hold
    private var typesLive = false       // the cursor is in a text field, so guesses go in right away
    private var sends = false           // a messenger: Return goes out on release

    private var enabled: Bool {
        get { UserDefaults.standard.object(forKey: "enabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "enabled") }
    }

    private var everywhere: Bool {
        get { UserDefaults.standard.object(forKey: "everywhere") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "everywhere") }
    }

    private var frontApp: pid_t { NSWorkspace.shared.frontmostApplication?.processIdentifier ?? 0 }

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }
    private var canListen: Bool { CGPreflightListenEventAccess() }
    private var canPost: Bool { CGPreflightPostEventAccess() }
    private var vsCodeInFront: Bool {
        NSWorkspace.shared.frontmostApplication?.bundleIdentifier == vsCodeBundle
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        bar = DocBarClient(id: "de.docalvers.globemic", name: "DocMic",
                           symbol: "mic.fill", rank: 20) { [weak self] item in self?.clicked(item) }

        if !UserDefaults.standard.bool(forKey: "loginSet") {
            UserDefaults.standard.set(true, forKey: "loginSet")
            try? SMAppService.mainApp.register()
        }
        if !canListen { CGRequestListenEventAccess() }
        if !canPost { CGRequestPostEventAccess() }
        if everywhere && AVCaptureDevice.authorizationStatus(for: .audio) == .notDetermined {
            AVCaptureDevice.requestAccess(for: .audio) { _ in }
        }
        Transcriber.prepare()

        // A freshly granted permission only shows up by asking again.
        Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in self?.refresh() }
        refresh()
    }

    func applicationWillTerminate(_ note: Notification) {
        if phase == .talking && !local { Keyboard.releaseCmdD() }
        live?.cancel()
        bar.withdraw()
    }

    // MARK: state

    private func refresh() {
        if tap == nil && canListen { startTap() }

        var items = [DocBarItem("toggle", "Active", state: enabled),
                     DocBarItem("everywhere", "Dictate in every app", state: everywhere),
                     DocBarItem("login", "Start at login", state: startsAtLogin)]
        if !canListen { items.append(DocBarItem("listen", "Allow Input Monitoring …")) }
        if !canPost { items.append(DocBarItem("post", "Allow Accessibility access …")) }
        if everywhere && !Live.allowed { items.append(DocBarItem("mic", "Allow Microphone …")) }
        items.append(DocBarItem("quit", "Quit DocMic"))

        let ready = tap != nil && canPost
        let status = !ready ? "needs a permission" : enabled ? "hold Globe to dictate" : "off"
        let key = "\(status)|\(enabled)|\(everywhere)|\(startsAtLogin)|\(items.count)"
        guard key != published else { return }
        published = key
        bar.publish(status: status, items: items, primary: "toggle", alert: !ready, toggle: enabled)
    }

    private func clicked(_ item: String) {
        switch item {
        case "toggle": enabled.toggle()
        case "everywhere": everywhere.toggle()
        case "login": toggleLogin()
        case "listen": openPrivacy("Privacy_ListenEvent")
        case "post": openPrivacy("Privacy_Accessibility")
        case "mic": askForMic()
        case "quit": NSApp.terminate(nil)
        default: break
        }
        refresh()
    }

    private func toggleLogin() {
        if startsAtLogin { try? SMAppService.mainApp.unregister() }
        else { try? SMAppService.mainApp.register() }
    }

    /// macOS asks only once, after a no the switch is in System Settings.
    private func askForMic() {
        if AVCaptureDevice.authorizationStatus(for: .audio) == .notDetermined {
            AVCaptureDevice.requestAccess(for: .audio) { _ in }
        } else {
            openPrivacy("Privacy_Microphone")
        }
    }

    private func openPrivacy(_ pane: String) {
        let base = "x-apple.systempreferences:com.apple.preference.security?"
        if let url = URL(string: base + pane) { NSWorkspace.shared.open(url) }
    }

    // MARK: listening

    private func startTap() {
        let mask = CGEventMask(1 << CGEventType.flagsChanged.rawValue)
                 | CGEventMask(1 << CGEventType.keyDown.rawValue)
        tap = CGEvent.tapCreate(tap: .cgSessionEventTap, place: .headInsertEventTap,
                                options: .listenOnly, eventsOfInterest: mask,
                                callback: { _, type, event, info in
            if let info = info {
                Unmanaged<AppDelegate>.fromOpaque(info).takeUnretainedValue().received(type, event)
            }
            return Unmanaged.passUnretained(event)
        }, userInfo: Unmanaged.passUnretained(self).toOpaque())

        guard let tap = tap else { return }
        CFRunLoopAddSource(CFRunLoopGetMain(),
                           CFMachPortCreateRunLoopSource(nil, tap, 0), .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
        log("listening")
    }

    private func received(_ type: CGEventType, _ event: CGEvent) {
        if type == .tapDisabledByTimeout || type == .tapDisabledByUserInput {
            if let tap = tap { CGEvent.tapEnable(tap: tap, enable: true) }
            return
        }
        if event.getIntegerValueField(.eventSourceUserData) == Keyboard.mark { return }   // typed by us
        let code = event.getIntegerValueField(.keyboardEventKeycode)
        if type == .flagsChanged && code == Key.globe {
            if event.flags.contains(.maskSecondaryFn) { globeDown() } else { globeUp() }
        } else if code != Int64(Key.command) && code != Int64(Key.d) {
            otherKey()                      // our own posted Cmd and D must not cancel the hold
        }
    }

    // MARK: the hold

    private func globeDown() {
        guard enabled, phase == .idle else { return }
        phase = .armed
        let work = DispatchWorkItem { [weak self] in self?.startTalking() }
        armWork = work
        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.arm, execute: work)
    }

    private func globeUp() {
        switch phase {
        case .armed: disarm()
        case .talking: stopTalking(send: true)
        default: break
        }
    }

    /// Globe combined with another key stays what it was, for example fn+Delete.
    private func otherKey() {
        switch phase {
        case .armed: disarm()
        case .talking: stopTalking(send: false)
        default: break
        }
    }

    private func disarm() {
        armWork?.cancel()
        phase = .idle
    }

    private func startTalking() {
        guard phase == .armed, canPost else { phase = .idle; return }
        if vsCodeInFront { talkToPanel() }
        else if everywhere && Transcriber.format != nil && Live.allowed { talkLocally() }
        else { phase = .idle }
    }

    private func talkLocally() {
        let live = Live()
        target = frontApp
        strayed = false
        typesLive = false
        sends = sendsOnRelease.contains(NSWorkspace.shared.frontmostApplication?.bundleIdentifier ?? "")
        typist.reset()
        guard live.start({ [weak self] text in self?.liveText(text) }) else {
            phase = .idle
            log("local: microphone did not start")
            return
        }
        // Asked after the microphone is on, so a slow app does not cost the first words.
        let (takes, kind) = Focus.takesText(target)
        typesLive = takes
        self.live = live
        phase = .talking
        local = true
        talkStart = Date()
        hud.listening()
        levelTimer = Timer.scheduledTimer(withTimeInterval: Timing.poll, repeats: true) { [weak self] _ in
            guard let self = self, let live = self.live else { return }
            self.hud.level(live.level())
        }
        log(typesLive ? "local: talking, typing live (\(kind))" : "local: talking, pasting at the end (\(kind))")
    }

    /// Every new guess goes into the field right away, but only while its app stays in front:
    /// once another one came up, the rest of this hold types nothing.
    private func liveText(_ text: String) {
        if frontApp != target { strayed = true }
        if typesLive && !strayed { typist.show(Spoken.apply(text).text) }
    }

    private func talkToPanel() {
        phase = .talking
        local = false
        talkStart = Date()
        micStarted = false
        captureBefore = Mic.capturing()
        Keyboard.holdCmdD()
        micTimer = Timer.scheduledTimer(withTimeInterval: Timing.poll, repeats: true) { [weak self] _ in
            self?.checkMic()
        }
        log("talking, already capturing: \(captureBefore.count)")
    }

    private func checkMic() {
        if !micStarted && !Mic.capturing().subtracting(captureBefore).isEmpty {
            micStarted = true
            log(String(format: "mic on after %.2f s", Date().timeIntervalSince(talkStart)))
        }
    }

    private func stopTalking(send: Bool) {
        phase = .finishing
        if local {
            DispatchQueue.main.asyncAfter(deadline: .now() + (send ? Timing.tail : 0)) { [weak self] in
                self?.finishLocal(send: send)
            }
            return
        }
        let held = Date().timeIntervalSince(talkStart)
        let wait = max(send ? Timing.tail : 0, Timing.minHold - held)
        DispatchQueue.main.asyncAfter(deadline: .now() + wait) { [weak self] in
            self?.finish(send: send, held: held)
        }
    }

    private func finish(send: Bool, held: TimeInterval) {
        checkMic()
        micTimer?.invalidate()
        Keyboard.releaseCmdD()

        guard send else { phase = .idle; log("cancelled by another key"); return }
        guard micStarted else {
            phase = .idle
            log(String(format: "no mic after %.2f s, nothing sent", held))
            if held >= Timing.beep { NSSound.beep() }
            return
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.send) { [weak self] in
            guard let self = self else { return }
            guard self.vsCodeInFront, held <= Timing.command else { self.deliver("sent"); return }
            self.readField { text in
                if let text = text { log("read \(text.count) characters") }
                guard let text = text, let command = spokenCommand(text) else { self.deliver("sent"); return }
                Keyboard.type(command)
                DispatchQueue.main.asyncAfter(deadline: .now() + Timing.menu) { self.deliver("spoken \(command)") }
            }
        }
    }

    /// Waits for the last words and brings the field up to date. When another app came to the
    /// front during the hold, the whole text waits on the clipboard instead.
    private func finishLocal(send: Bool) {
        levelTimer?.invalidate()
        hud.level(0)
        guard let live = live else { phase = .idle; return }
        guard send else {
            live.cancel()
            self.live = nil
            hud.hide()
            phase = .idle
            log("local: cancelled by another key")
            return
        }
        live.stop { [weak self] raw in
            guard let self = self else { return }
            self.liveText(raw)
            let (text, send) = Spoken.apply(raw)
            self.live = nil
            self.phase = .idle
            log(String(format: "local: %.1f s, %d characters", Date().timeIntervalSince(self.talkStart), text.count))
            if raw.isEmpty { self.hud.nothing(); return }
            if text.isEmpty { self.hud.hide(); log("local: scratched"); return }
            if self.strayed { Clipboard.put(text); self.hud.onClipboard(); log("local: the app changed, left on the clipboard"); return }
            if !self.typesLive { Clipboard.paste(text); log("local: pasted") }
            self.hud.hide()
            guard self.sends else { return }
            guard send else { log("local: held back, not sent"); return }
            DispatchQueue.main.asyncAfter(deadline: .now() + Timing.send) {
                guard self.frontApp == self.target, self.phase == .idle else { log("local: the app changed, not sent"); return }
                Keyboard.tapEnter()
                log("local: sent")
            }
        }
    }

    private func deliver(_ what: String) {
        if vsCodeInFront { Keyboard.tapEnter() }
        log(vsCodeInFront ? what : "VS Code left the front, nothing sent")
        phase = .idle
    }

    // MARK: reading the field

    /// Reads the input field through the clipboard, which is given back right away.
    private func readField(_ done: @escaping (String?) -> Void) {
        let saved = Clipboard.snapshot()
        let count = NSPasteboard.general.changeCount
        Keyboard.selectAll()
        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.copy) { [weak self] in
            Keyboard.copy()
            self?.awaitCopy(since: count, tries: Timing.copyTries) { text in
                if text != nil { Clipboard.restore(saved) }
                done(text)
            }
        }
    }

    private func awaitCopy(since count: Int, tries: Int, _ done: @escaping (String?) -> Void) {
        if NSPasteboard.general.changeCount != count {
            done(NSPasteboard.general.string(forType: .string) ?? "")
        } else if tries > 0 {
            DispatchQueue.main.asyncAfter(deadline: .now() + Timing.copy) { [weak self] in
                self?.awaitCopy(since: count, tries: tries - 1, done)
            }
        } else {
            log("field could not be read")
            done(nil)
        }
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
