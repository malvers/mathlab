// WindowSets — remembers the window layout per display configuration and puts it back.
// The app keeps recording where windows are; when the set of attached monitors changes
// it recognises the new configuration and restores the layout last seen with it.

import Cocoa
import ApplicationServices
import ServiceManagement

// MARK: - Accessibility helpers

private func axValue(_ el: AXUIElement, _ attr: String) -> CFTypeRef? {
    var v: CFTypeRef?
    guard AXUIElementCopyAttributeValue(el, attr as CFString, &v) == .success else { return nil }
    return v
}

private func axString(_ el: AXUIElement, _ attr: String) -> String? { axValue(el, attr) as? String }
private func axBool(_ el: AXUIElement, _ attr: String) -> Bool? { axValue(el, attr) as? Bool }

/// Window frame in Accessibility coordinates (origin top-left of the main display, y down).
/// Those are the coordinates we also write back, so no flipping is ever needed.
private func axFrame(_ el: AXUIElement) -> CGRect? {
    guard let pv = axValue(el, kAXPositionAttribute as String),
          let sv = axValue(el, kAXSizeAttribute as String),
          CFGetTypeID(pv) == AXValueGetTypeID(), CFGetTypeID(sv) == AXValueGetTypeID() else { return nil }
    var p = CGPoint.zero
    var s = CGSize.zero
    guard AXValueGetValue(unsafeBitCast(pv, to: AXValue.self), .cgPoint, &p),
          AXValueGetValue(unsafeBitCast(sv, to: AXValue.self), .cgSize, &s) else { return nil }
    return CGRect(origin: p, size: s)
}

@discardableResult
private func axSetFrame(_ el: AXUIElement, _ r: CGRect) -> Bool {
    var p = r.origin
    var s = r.size
    guard let pv = AXValueCreate(.cgPoint, &p), let sv = AXValueCreate(.cgSize, &s) else { return false }
    // Position, then size, then position again: while a window still hangs off the old
    // screen many apps clamp the size, so the first move has to happen first.
    AXUIElementSetAttributeValue(el, kAXPositionAttribute as CFString, pv)
    AXUIElementSetAttributeValue(el, kAXSizeAttribute as CFString, sv)
    return AXUIElementSetAttributeValue(el, kAXPositionAttribute as CFString, pv) == .success
}

struct LiveWindow {
    let el: AXUIElement
    let title: String
    let frame: CGRect
}

/// The window elements of one process. Finder answers AXWindows with an empty list —
/// its windows only ever show up among the children — so that is the fallback.
private func windowElements(of app: AXUIElement) -> [AXUIElement] {
    if let wins = axValue(app, kAXWindowsAttribute as String) as? [AXUIElement], !wins.isEmpty {
        return wins
    }
    guard let kids = axValue(app, kAXChildrenAttribute as String) as? [AXUIElement] else { return [] }
    return kids.filter { axString($0, kAXRoleAttribute as String) == (kAXWindowRole as String) }
}

/// Movable windows of one process. Minimised, full screen and fixed panels are left alone.
private func liveWindows(pid: pid_t) -> [LiveWindow] {
    let app = AXUIElementCreateApplication(pid)
    AXUIElementSetMessagingTimeout(app, 0.4)   // never hang on a busy app
    var out: [LiveWindow] = []
    for w in windowElements(of: app) {
        if axBool(w, kAXMinimizedAttribute as String) == true { continue }
        if axBool(w, "AXFullScreen") == true { continue }
        // Whether the position can be written is the honest test for "this is a window
        // I may put back" — the subrole is not: Finder windows carry none at all.
        var settable = DarwinBoolean(false)
        AXUIElementIsAttributeSettable(w, kAXPositionAttribute as CFString, &settable)
        guard settable.boolValue else { continue }
        if let sub = axString(w, kAXSubroleAttribute as String),
           sub == (kAXSystemDialogSubrole as String) || sub == (kAXSystemFloatingWindowSubrole as String) {
            continue
        }
        guard let f = axFrame(w), f.width > 60, f.height > 60 else { continue }
        out.append(LiveWindow(el: w, title: axString(w, kAXTitleAttribute as String) ?? "", frame: f))
    }
    return out
}

// MARK: - display configuration

struct DisplayInfo {
    let id: CGDirectDisplayID
    let name: String
    let frame: CGRect
}

enum Displays {
    static func current() -> [DisplayInfo] {
        NSScreen.screens.compactMap { s in
            guard let n = s.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber else { return nil }
            return DisplayInfo(id: CGDirectDisplayID(n.uint32Value), name: s.localizedName, frame: s.frame)
        }
    }

    /// Identity of the whole setup: which panels, at which resolution, arranged how.
    /// Rearranging the displays in System Settings therefore counts as a new configuration.
    static func key(_ screens: [DisplayInfo]) -> String {
        screens.map { d in
            String(format: "%u-%u-%u@%.0f,%.0f,%.0fx%.0f",
                   CGDisplayVendorNumber(d.id), CGDisplayModelNumber(d.id), CGDisplaySerialNumber(d.id),
                   d.frame.origin.x, d.frame.origin.y, d.frame.width, d.frame.height)
        }.sorted().joined(separator: "|")
    }

    static func name(_ screens: [DisplayInfo]) -> String {
        let names = screens.map(\.name).sorted()
        return names.isEmpty ? "no display" : names.joined(separator: " + ")
    }
}

// MARK: - stored layouts

struct WindowRec: Codable, Equatable {
    var app: String        // bundle identifier
    var name: String       // app name, for the menu
    var title: String
    var index: Int
    var x: Double, y: Double, w: Double, h: Double

    var frame: CGRect { CGRect(x: x, y: y, width: w, height: h) }
}

struct Layout: Codable {
    var saved: Date
    var windows: [WindowRec]
}

struct ConfigEntry: Codable {
    var name: String
    var snapshots: [Layout]   // newest first
    /// Deliberately kept by the user via "Save layout now". The rolling snapshots follow
    /// every move within seconds, so only this one can serve as "put it back the way I like it".
    var pinned: Layout?
}

final class Store {
    private(set) var configs: [String: ConfigEntry] = [:]
    private let maxSnapshots = 6
    private let historyGap: TimeInterval = 120   // seconds between history entries

    private var url: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("WindowSets", isDirectory: true)
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        return base.appendingPathComponent("layouts.json")
    }

    init() { load() }

    func newest(_ key: String) -> Layout? { configs[key]?.snapshots.first }
    func pinned(_ key: String) -> Layout? { configs[key]?.pinned }

    func pin(key: String, name: String, windows: [WindowRec]) {
        guard !windows.isEmpty else { return }
        var entry = configs[key] ?? ConfigEntry(name: name, snapshots: [], pinned: nil)
        entry.name = name
        entry.pinned = Layout(saved: Date(), windows: windows)
        configs[key] = entry
        save()
    }

    func unpin(_ key: String) {
        configs[key]?.pinned = nil
        save()
    }

    func add(key: String, name: String, windows: [WindowRec]) {
        guard !windows.isEmpty else { return }
        var entry = configs[key] ?? ConfigEntry(name: name, snapshots: [], pinned: nil)
        entry.name = name

        // A new entry in the history is only worth it when windows actually moved, and
        // not more than once every couple of minutes — otherwise dragging one window
        // around would push the layout of half an hour ago out of reach.
        let unchanged = entry.snapshots.first.map { geometry($0.windows) == geometry(windows) } ?? false
        let recent = entry.snapshots.first.map { Date().timeIntervalSince($0.saved) < historyGap } ?? false
        if !entry.snapshots.isEmpty, unchanged || recent {
            entry.snapshots[0] = Layout(saved: Date(), windows: windows)
        } else {
            entry.snapshots.insert(Layout(saved: Date(), windows: windows), at: 0)
            if entry.snapshots.count > maxSnapshots { entry.snapshots.removeLast() }
        }
        configs[key] = entry
        save()
    }

    /// Positions only — a window whose title changed did not move.
    private func geometry(_ windows: [WindowRec]) -> [String] {
        windows.map { String(format: "%@:%.0f,%.0f,%.0f,%.0f", $0.app, $0.x, $0.y, $0.w, $0.h) }.sorted()
    }

    func forget(_ key: String) {
        configs[key] = nil
        save()
    }

    private func load() {
        guard let data = try? Data(contentsOf: url) else { return }
        let dec = JSONDecoder()
        dec.dateDecodingStrategy = .iso8601
        configs = (try? dec.decode([String: ConfigEntry].self, from: data)) ?? [:]
    }

    private func save() {
        let enc = JSONEncoder()
        enc.dateEncodingStrategy = .iso8601
        enc.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let data = try? enc.encode(configs) else { return }
        try? data.write(to: url, options: .atomic)
    }
}

// MARK: - snapshot and restore

enum Windows {

    static func snapshot() -> [WindowRec] {
        var out: [WindowRec] = []
        let mine = Bundle.main.bundleIdentifier
        for app in NSWorkspace.shared.runningApplications where app.activationPolicy == .regular {
            guard let bid = app.bundleIdentifier, bid != mine else { continue }
            for (i, w) in liveWindows(pid: app.processIdentifier).enumerated() {
                out.append(WindowRec(app: bid, name: app.localizedName ?? bid, title: w.title, index: i,
                                     x: w.frame.origin.x, y: w.frame.origin.y,
                                     w: w.frame.width, h: w.frame.height))
            }
        }
        return out
    }

    /// Puts every window we can identify back. Returns how many were placed out of how many were stored.
    @discardableResult
    static func restore(_ layout: Layout) -> (placed: Int, stored: Int) {
        var byApp: [String: [WindowRec]] = [:]
        for r in layout.windows { byApp[r.app, default: []].append(r) }

        var placed = 0
        for app in NSWorkspace.shared.runningApplications where app.activationPolicy == .regular {
            guard let bid = app.bundleIdentifier, var recs = byApp[bid] else { continue }
            var wins = liveWindows(pid: app.processIdentifier)
            var pairs: [(LiveWindow, WindowRec)] = []

            // Titles are the reliable identity (one document, one window). Whatever is left
            // over — untitled or renamed windows — is matched in the recorded order.
            var i = 0
            while i < recs.count {
                if !recs[i].title.isEmpty, let j = wins.firstIndex(where: { $0.title == recs[i].title }) {
                    pairs.append((wins.remove(at: j), recs.remove(at: i)))
                } else {
                    i += 1
                }
            }
            for rec in recs.sorted(by: { $0.index < $1.index }) {
                if wins.isEmpty { break }
                pairs.append((wins.removeFirst(), rec))
            }

            for (w, rec) in pairs {
                if w.frame.equalTo(rec.frame) { placed += 1; continue }
                if axSetFrame(w.el, rec.frame) { placed += 1 }
            }
        }
        return (placed, layout.windows.count)
    }
}

// MARK: - app

final class AppDelegate: NSObject, NSApplicationDelegate {

    private let store = Store()
    private let work = DispatchQueue(label: "de.docalvers.windowsets.ax", qos: .userInitiated)

    private var bar: DocBarClient!
    private var autoSaveTimer: Timer?
    private var pendingChange: DispatchWorkItem?

    private var currentKey = ""
    private var currentName = ""
    private var settling = false      // display change in progress: do not record
    private var busy = false

    private var autoRestore: Bool {
        get { UserDefaults.standard.object(forKey: "autoRestore") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "autoRestore") }
    }
    /// The recorder is only useful when it is always running.
    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }

    private var autoRecord: Bool {
        get { UserDefaults.standard.object(forKey: "autoRecord") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "autoRecord") }
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        bar = DocBarClient(id: "de.docalvers.windowsets", name: "WindowSets",
                           symbol: "macwindow.on.rectangle", rank: 10) { [weak self] item in
            self?.handle(item)
        }
        readConfiguration()
        refreshIcon()

        NotificationCenter.default.addObserver(self, selector: #selector(screensChanged),
                                               name: NSApplication.didChangeScreenParametersNotification,
                                               object: nil)

        autoSaveTimer = Timer.scheduledTimer(withTimeInterval: 6, repeats: true) { [weak self] _ in
            self?.record()
        }

        if !AXIsProcessTrusted() { requestAccessibility() }
    }

    // MARK: configuration

    private func readConfiguration() {
        let screens = Displays.current()
        currentKey = Displays.key(screens)
        currentName = Displays.name(screens)
    }

    @objc private func screensChanged() {
        // Windows are being shuffled by macOS right now — freeze recording immediately.
        settling = true
        pendingChange?.cancel()
        let item = DispatchWorkItem { [weak self] in self?.applyNewConfiguration() }
        pendingChange = item
        // Displays report in several steps; wait until the dust has settled.
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5, execute: item)
    }

    private func applyNewConfiguration() {
        let previousKey = currentKey
        readConfiguration()
        refreshIcon()

        guard currentKey != previousKey else { settling = false; return }
        guard autoRestore, let layout = store.newest(currentKey) else {
            settling = false
            record()                      // first time we see this setup: start recording it
            return
        }
        restore(layout, announce: true)
    }

    // MARK: recording

    private func record() {
        guard autoRecord, !settling, !busy, AXIsProcessTrusted() else { return }
        let key = currentKey, name = currentName
        work.async { [weak self] in
            let windows = Windows.snapshot()
            DispatchQueue.main.async {
                guard let self = self, !self.settling, self.currentKey == key else { return }
                self.store.add(key: key, name: name, windows: windows)
            }
        }
    }

    private func restore(_ layout: Layout, announce: Bool) {
        guard AXIsProcessTrusted() else { requestAccessibility(); settling = false; return }
        busy = true
        work.async { [weak self] in
            let result = Windows.restore(layout)
            DispatchQueue.main.async {
                guard let self = self else { return }
                self.busy = false
                self.settling = false
                if announce { self.flash("\(result.placed)") }
                self.refreshIcon()
            }
        }
    }

    // MARK: menu bar

    /// Publishes the current state and the actions into DocBar.
    private func refreshIcon() {
        let entry = store.configs[currentKey]
        let known = store.newest(currentKey) != nil
        let count = (store.pinned(currentKey) ?? store.newest(currentKey))?.windows.count ?? 0

        var items: [DocBarItem] = []
        items.append(DocBarItem("restore", known ? "Restore \(count) windows" : "Nothing recorded yet"))
        items.append(DocBarItem("save", "Save this arrangement"))
        if store.pinned(currentKey) != nil { items.append(DocBarItem("unpin", "Forget saved arrangement")) }

        let fmt = DateFormatter()
        fmt.timeStyle = .short
        fmt.dateStyle = .none
        for (n, snap) in (entry?.snapshots ?? []).prefix(4).enumerated() where n > 0 {
            items.append(DocBarItem("snap\(n)", "Back to \(fmt.string(from: snap.saved)) — \(snap.windows.count) windows"))
        }

        items.append(DocBarItem("autorestore", "Restore automatically on display change", state: autoRestore))
        items.append(DocBarItem("autorecord", "Keep recording", state: autoRecord))
        items.append(DocBarItem("login", "Start at login", state: startsAtLogin))
        if !AXIsProcessTrusted() { items.append(DocBarItem("ax", "Allow Accessibility access …")) }
        if entry != nil { items.append(DocBarItem("forget", "Forget this configuration …")) }

        bar.publish(status: known ? "\(currentName): \(count) windows"
                                  : "\(currentName): nothing recorded yet",
                    items: items, primary: known ? "restore" : nil)
    }

    private func handle(_ item: String) {
        switch item {
        case "restore": restoreNow()
        case "save": saveNow()
        case "unpin": forgetSaved()
        case "autorestore": toggleAutoRestore()
        case "autorecord": toggleAutoRecord()
        case "login": toggleLogin()
        case "ax": requestAccessibility()
        case "forget": forgetConfiguration()
        case "quit": NSApp.terminate(nil)
        default:
            guard item.hasPrefix("snap"), let n = Int(item.dropFirst(4)),
                  let entry = store.configs[currentKey], n < entry.snapshots.count else { return }
            restore(entry.snapshots[n], announce: true)
        }
    }

    /// The restored count used to appear next to the icon; DocBar shows it in the status line.
    private func flash(_ text: String) { refreshIcon() }

    @objc private func restoreNow() {
        // The saved layout is the anchor; without one, the last recorded state is all there is.
        guard let layout = store.pinned(currentKey) ?? store.newest(currentKey) else {
            alert("Nothing recorded for \(currentName) yet.\n\nWindowSets is watching now — the layout of this setup will be restored the next time you come back to it.")
            return
        }
        restore(layout, announce: true)
    }

    /// Pins the current arrangement as the layout a click returns to.
    @objc private func saveNow() {
        settling = false
        let key = currentKey, name = currentName
        work.async { [weak self] in
            let windows = Windows.snapshot()
            DispatchQueue.main.async {
                guard let self = self, self.currentKey == key else { return }
                self.store.pin(key: key, name: name, windows: windows)
                self.store.add(key: key, name: name, windows: windows)
                self.flash("\u{2713}")
                self.refreshIcon()
            }
        }
    }

    @objc private func forgetSaved() {
        store.unpin(currentKey)
        refreshIcon()
    }

    @objc private func forgetConfiguration() {
        let a = NSAlert()
        a.messageText = "Forget this configuration?"
        a.informativeText = "All recorded layouts for \(currentName) are deleted. Recording starts over."
        a.addButton(withTitle: "Forget")
        a.addButton(withTitle: "Cancel")
        guard a.runModal() == .alertFirstButtonReturn else { return }
        store.forget(currentKey)
        refreshIcon()
    }

    func applicationWillTerminate(_ note: Notification) { bar.withdraw() }

    @objc private func toggleLogin() {
        defer { refreshIcon() }
        do {
            if startsAtLogin { try SMAppService.mainApp.unregister() }
            else { try SMAppService.mainApp.register() }
        } catch {
            alert("Could not change the login item: \(error.localizedDescription)\n\nMoving WindowSets.app to /Applications usually fixes this.")
        }
    }

    @objc private func toggleAutoRestore() { autoRestore = !autoRestore; refreshIcon() }
    @objc private func toggleAutoRecord() { autoRecord = !autoRecord; refreshIcon() }

    @objc private func requestAccessibility() {
        let key = kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String
        AXIsProcessTrustedWithOptions([key: true] as CFDictionary)
    }

    private func alert(_ text: String) {
        let a = NSAlert()
        a.messageText = "WindowSets"
        a.informativeText = text
        a.runModal()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
