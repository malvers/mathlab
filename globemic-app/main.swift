// GlobeMic — hold the Globe key to dictate into the Claude panel of VS Code, release to send.
// Holding Globe presses Cmd+D, letting go ends the dictation and presses Return. Return only
// goes out when a new microphone capture really started: with the cursor anywhere else Cmd+D
// never opens the mic, so nothing can land in the code. The tap only listens, a hang in here
// can not block the keyboard.

import Cocoa
import CoreAudio
import ServiceManagement

// MARK: - settings

enum Timing {
    static let arm = 0.12       // Globe held this long counts as a hold, shorter stays a tap
    static let tail = 0.30      // the mic stays open after release so the last word arrives
    static let minHold = 0.25   // the panel latches the mic on when Cmd+D is shorter than 0.2 s
    static let send = 0.12      // pause between ending the dictation and Return
    static let poll = 0.05      // how often the mic is checked during a hold
    static let beep = 0.60      // a hold this long without a mic gets a beep, a slow tap does not
}

enum Key {
    static let globe: Int64 = 63
    static let command: CGKeyCode = 55
    static let d: CGKeyCode = 2
    static let enter: CGKeyCode = 36
}

let vsCodeBundle = "com.microsoft.VSCode"

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

// MARK: - keyboard

enum Keyboard {
    // A private state keeps the posted Cmd out of the real modifier state of the machine.
    private static let source = CGEventSource(stateID: .privateState)

    private static func post(_ key: CGKeyCode, down: Bool, flags: CGEventFlags = []) {
        guard let event = CGEvent(keyboardEventSource: source, virtualKey: key, keyDown: down) else { return }
        event.flags = flags
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

    private var enabled: Bool {
        get { UserDefaults.standard.object(forKey: "enabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "enabled") }
    }

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }
    private var canListen: Bool { CGPreflightListenEventAccess() }
    private var canPost: Bool { CGPreflightPostEventAccess() }
    private var vsCodeInFront: Bool {
        NSWorkspace.shared.frontmostApplication?.bundleIdentifier == vsCodeBundle
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        bar = DocBarClient(id: "de.docalvers.globemic", name: "GlobeMic",
                           symbol: "mic.fill", rank: 20) { [weak self] item in self?.clicked(item) }

        if !UserDefaults.standard.bool(forKey: "loginSet") {
            UserDefaults.standard.set(true, forKey: "loginSet")
            try? SMAppService.mainApp.register()
        }
        if !canListen { CGRequestListenEventAccess() }
        if !canPost { CGRequestPostEventAccess() }

        // A freshly granted permission only shows up by asking again.
        Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in self?.refresh() }
        refresh()
    }

    func applicationWillTerminate(_ note: Notification) {
        if phase == .talking { Keyboard.releaseCmdD() }
        bar.withdraw()
    }

    // MARK: state

    private func refresh() {
        if tap == nil && canListen { startTap() }

        var items = [DocBarItem("toggle", "Active", state: enabled),
                     DocBarItem("login", "Start at login", state: startsAtLogin)]
        if !canListen { items.append(DocBarItem("listen", "Allow Input Monitoring …")) }
        if !canPost { items.append(DocBarItem("post", "Allow Accessibility access …")) }
        items.append(DocBarItem("quit", "Quit GlobeMic"))

        let ready = tap != nil && canPost
        let status = !ready ? "needs a permission" : enabled ? "hold Globe to dictate" : "off"
        let key = "\(status)|\(enabled)|\(startsAtLogin)|\(items.count)"
        guard key != published else { return }
        published = key
        bar.publish(status: status, items: items, primary: "toggle", alert: !ready, toggle: enabled)
    }

    private func clicked(_ item: String) {
        switch item {
        case "toggle": enabled.toggle()
        case "login": toggleLogin()
        case "listen": openPrivacy("Privacy_ListenEvent")
        case "post": openPrivacy("Privacy_Accessibility")
        case "quit": NSApp.terminate(nil)
        default: break
        }
        refresh()
    }

    private func toggleLogin() {
        if startsAtLogin { try? SMAppService.mainApp.unregister() }
        else { try? SMAppService.mainApp.register() }
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
        guard phase == .armed, vsCodeInFront, canPost else { phase = .idle; return }
        phase = .talking
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
            if self.vsCodeInFront { Keyboard.tapEnter() }
            log(self.vsCodeInFront ? "sent" : "VS Code left the front, nothing sent")
            self.phase = .idle
        }
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
