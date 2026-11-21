// DocClock — Doc's World Clock as a widget on the real desktop: one borderless, round window at desktop-icon level,
// so the clock sits above the wallpaper, below every ordinary window and on every Space. It shows the lab itself,
// HTML/worldclock/worldclock.html?widget=1, in a WKWebView, so the clock stays one source: the same cities, map,
// hour ring and look as the lab; a change to the lab shows here after "Neu laden", a restart or the next wake.
// Made from DocPhoto (deskphoto-app): the same desktop level, dragging, remembered place, DocBar menu and login item.
// Inside the hour ring it is as interactive as the lab (city panels, turning the dial); a click on the outer ring selects
// it (φ green ring + handles, as DocPhoto), then the ring moves it and a handle sizes it; a right click opens its menu
// (Kleiner, Größer, Neu laden, Labor öffnen, …), a double click on the ring opens the full lab in Chrome. Place and size live in the user defaults of de.docalvers.docclock (21.11.2026).

import Cocoa
import WebKit
import ServiceManagement

// MARK: - Settings

enum Settings {
    private static let d = UserDefaults.standard
    /// Smallest dial: the city names (Orbitron at 3 % of the dial's radius r = 0.4 · size) stay at 7 px and more on the
    /// LG, which shows 1 px per point (Doc, 21.11.2026: "die minimale Größe zu klein").
    static let minSize: Double = 600
    static let maxSize: Double = 1400
    static let defaultSize: Double = 720

    /// The repo's HTML folder; the lab is loaded straight from its file, no server needed (works offline, survives a
    /// stopped serve.py). Another place: `defaults write de.docalvers.docclock htmlRoot /path/to/forloop/HTML`
    static var htmlRoot: URL {
        if let p = d.string(forKey: "htmlRoot"), !p.isEmpty {
            return URL(fileURLWithPath: (p as NSString).expandingTildeInPath, isDirectory: true)
        }
        return FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("IdeaProjects/forloop/HTML", isDirectory: true)
    }

    /// Side of the square window = diameter of the dial, in points.
    static var size: Double {
        get { let v = d.double(forKey: "size"); return v > 0 ? min(maxSize, max(minSize, v)) : defaultSize }
        set { d.set(min(maxSize, max(minSize, newValue)), forKey: "size") }
    }

    /// Centre of the clock in screen coordinates (origin bottom-left of the primary display); nil before the first move.
    static var center: NSPoint? {
        get {
            guard d.object(forKey: "centerX") != nil else { return nil }
            return NSPoint(x: d.double(forKey: "centerX"), y: d.double(forKey: "centerY"))
        }
        set {
            guard let c = newValue else { return }
            d.set(Double(c.x), forKey: "centerX")
            d.set(Double(c.y), forKey: "centerY")
        }
    }

    /// "Weltuhr zeigen": off hides the clock without forgetting its place; remembered across restarts.
    static var shown: Bool {
        get { d.object(forKey: "shown") as? Bool ?? true }
        set { d.set(newValue, forKey: "shown") }
    }

    /// The login item is switched on once, at the very first start; after that only the menu changes it.
    static var loginOffered: Bool {
        get { d.bool(forKey: "loginOffered") }
        set { d.set(newValue, forKey: "loginOffered") }
    }
}

// MARK: - Views

/// Room around the dial inside the window for the selection ring, its glow and the handles.
let selPad: CGFloat = 16

/// The web view never takes the mouse from AppKit itself: every event comes through the DragView above it, which
/// decides between selecting, moving and sizing the clock and handing the event on to the lab.
final class ClockWebView: WKWebView {
    override func hitTest(_ point: NSPoint) -> NSView? { nil }
}

/// A borderless panel cannot take the keyboard by itself; the clock's must while it is selected (Esc). It stays a
/// non-activating panel, like DocPhoto's prints: VS Code stays the active app.
final class ClockPanel: NSPanel {
    override var canBecomeKey: Bool { true }
}

/// Lies over the web view and takes the mouse on the round dial only - the corners are left to the desktop.
/// Selecting as with DocPhoto's prints (Doc, 21.11.2026): a click on the outer ring with the hour numbers selects the
/// clock - a ring in φ green with a soft glow and four round handles - and a drag on the ring moves it; a handle sizes
/// it, round, about its middle. A click inside the dial, anywhere else or Esc ends the selection. Inside the ring
/// everything goes on to the lab, as interactive as in the browser: a click on a city opens its panel, dragging the
/// dial turns the time, hovering shows the pointer. Right click: DocClock's menu; double click on the ring: the lab.
final class DragView: NSView {
    weak var owner: AppDelegate?
    weak var web: WKWebView?
    private enum Mode { case none, move, size, web }
    private var mode: Mode = .none
    private(set) var selected = false
    private var onRingBefore = false
    private var startMouse = NSPoint.zero          // screen coordinates
    private var startOrigin = NSPoint.zero
    private var centreOnScreen = NSPoint.zero      // fixed while sizing
    private var dragged = false

    private static let phi = NSColor(srgbRed: 121 / 255, green: 158 / 255, blue: 49 / 255, alpha: 1)
    private let ring = CAShapeLayer()
    private var handles: [CALayer] = []
    private let handleRadius: CGFloat = 5.5
    private let handleGrab: CGFloat = 12

    override init(frame: NSRect) {
        super.init(frame: frame)
        wantsLayer = true
        ring.fillColor = nil
        ring.strokeColor = DragView.phi.cgColor
        ring.lineWidth = 3
        ring.shadowColor = DragView.phi.cgColor
        ring.shadowOpacity = 0.85
        ring.shadowRadius = 7
        ring.shadowOffset = .zero
        ring.opacity = 0
        layer?.addSublayer(ring)
        for _ in 0..<4 {
            let h = CALayer()
            h.backgroundColor = NSColor.white.cgColor
            h.borderColor = DragView.phi.cgColor
            h.borderWidth = 1.5
            h.cornerRadius = handleRadius
            h.bounds = CGRect(x: 0, y: 0, width: handleRadius * 2, height: handleRadius * 2)
            h.shadowColor = NSColor.black.cgColor
            h.shadowOpacity = 0.35
            h.shadowRadius = 2
            h.shadowOffset = CGSize(width: 0, height: -1)
            h.opacity = 0
            layer?.addSublayer(h)
            handles.append(h)
        }
        relayout()
    }

    required init?(coder: NSCoder) { fatalError() }

    // MARK: geometry

    private var centre: NSPoint { NSPoint(x: bounds.midX, y: bounds.midY) }
    /// Radius of the dial (the window is the dial plus selPad on every side).
    private var radius: CGFloat { (min(bounds.width, bounds.height) - 2 * selPad) / 2 }
    private var ringRadius: CGFloat { radius + 3 }
    private func distance(_ p: NSPoint) -> CGFloat { hypot(p.x - centre.x, p.y - centre.y) }
    private func local(_ event: NSEvent) -> NSPoint { convert(event.locationInWindow, from: nil) }

    /// The handles sit on the selection ring at the four diagonals.
    private func handleCentre(_ i: Int) -> NSPoint {
        let a = CGFloat.pi / 4 + CGFloat(i) * .pi / 2
        return NSPoint(x: centre.x + cos(a) * ringRadius, y: centre.y + sin(a) * ringRadius)
    }

    private func onHandle(_ p: NSPoint) -> Bool {
        selected && (0..<4).contains { hypot(p.x - handleCentre($0).x, p.y - handleCentre($0).y) <= handleGrab }
    }

    /// The ring outside the city plaques: the lab's plaques end at 1.1 r = 0.88 of the dial's radius (r = 0.8 of it).
    private func onRing(_ p: NSPoint) -> Bool { distance(p) >= radius * 0.88 && distance(p) <= radius }

    override func setFrameSize(_ newSize: NSSize) {
        super.setFrameSize(newSize)
        relayout()
    }

    private func relayout() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        ring.frame = bounds
        ring.path = CGPath(ellipseIn: CGRect(x: centre.x - ringRadius, y: centre.y - ringRadius,
                                             width: ringRadius * 2, height: ringRadius * 2), transform: nil)
        for (i, h) in handles.enumerated() { h.position = handleCentre(i) }
        CATransaction.commit()
    }

    // MARK: selection

    func select(_ on: Bool) {
        guard on != selected else { return }
        selected = on
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        ring.opacity = on ? 1 : 0
        handles.forEach { $0.opacity = on ? 1 : 0 }
        CATransaction.commit()
        if on {
            window?.makeKey()                            // for Esc; the panel does not activate DocClock
            window?.makeFirstResponder(self)
        }
    }

    /// Esc: the selection ends and the keys go back to the app in front (ordering the panel out and in again hands
    /// them back - a non-activating panel cannot give them away otherwise).
    override var acceptsFirstResponder: Bool { true }
    override func keyDown(with event: NSEvent) {
        guard event.keyCode == 53 else { return }          // only Esc; anything else is swallowed silently
        select(false)
        if let w = window, w.isKeyWindow { w.orderOut(nil); w.orderFront(nil) }
    }

    override func hitTest(_ point: NSPoint) -> NSView? {
        let p = superview.map { convert(point, from: $0) } ?? point
        return distance(p) <= radius || onHandle(p) ? self : nil
    }

    /// The first click counts as a click, not only as taking the keys (as on DocPhoto's prints): at desktop level the
    /// app is never active, and a city must answer the very first click.
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    // MARK: mouse

    // Hover: a tracking area that fires while another app is active, too. WebKit sends no mouse moves to a page in an
    // inactive window, so every move inside the ring goes to the lab through JavaScript (worldclock.js __wcWidgetHover),
    // and the cursor it asks for (a pointer on a city) is shown here.
    override func updateTrackingAreas() {
        super.updateTrackingAreas()
        trackingAreas.forEach(removeTrackingArea)
        addTrackingArea(NSTrackingArea(rect: bounds, options: [.mouseMoved, .mouseEnteredAndExited, .activeAlways, .inVisibleRect],
                                       owner: self, userInfo: nil))
    }

    override func mouseMoved(with event: NSEvent) {
        let p = local(event)
        if onHandle(p) { onRingBefore = true; NSCursor.crosshair.set(); return }
        let ring = onRing(p) || distance(p) > radius
        onRingBefore = ring
        if ring {
            if distance(p) <= radius { NSCursor.openHand.set() } else { NSCursor.arrow.set() }
            web?.evaluateJavaScript("window.__wcWidgetLeave && __wcWidgetLeave()")
            return
        }
        guard let web = web else { return }
        let q = web.convert(event.locationInWindow, from: nil)
        let y = web.isFlipped ? q.y : web.bounds.height - q.y
        let js = String(format: "window.__wcWidgetHover ? __wcWidgetHover(%.1f, %.1f) : ''", Double(q.x), Double(y))
        web.evaluateJavaScript(js) { [weak self] result, _ in
            guard let self = self, !self.onRingBefore, self.mode == .none else { return }
            ((result as? String) == "pointer" ? NSCursor.pointingHand : NSCursor.arrow).set()
        }
    }

    override func mouseExited(with event: NSEvent) {
        onRingBefore = false
        NSCursor.arrow.set()
        web?.evaluateJavaScript("window.__wcWidgetLeave && __wcWidgetLeave()")
    }

    override func mouseDown(with event: NSEvent) {
        let p = local(event)
        dragged = false
        startMouse = NSEvent.mouseLocation
        if onHandle(p) {
            mode = .size
            if let w = window { centreOnScreen = NSPoint(x: w.frame.midX, y: w.frame.midY) }
            NSCursor.crosshair.set()
        } else if onRing(p) {
            if event.clickCount == 2 { owner?.openLab(); mode = .none; return }
            select(true)
            mode = .move
            startOrigin = window?.frame.origin ?? .zero
            NSCursor.closedHand.set()
        } else {
            select(false)
            mode = .web
            web?.mouseDown(with: event)
        }
    }

    override func mouseDragged(with event: NSEvent) {
        let now = NSEvent.mouseLocation
        if !dragged, hypot(now.x - startMouse.x, now.y - startMouse.y) > 2 { dragged = true }
        switch mode {
        case .move:
            guard dragged, let win = window else { return }
            win.setFrameOrigin(NSPoint(x: startOrigin.x + now.x - startMouse.x, y: startOrigin.y + now.y - startMouse.y))
        case .size:
            guard dragged else { return }
            // the handle follows the mouse: the selection ring's radius is the distance from the fixed middle
            let r = hypot(now.x - centreOnScreen.x, now.y - centreOnScreen.y) - 3
            owner?.setSize(Double(2 * r), centre: centreOnScreen)
        case .web:
            web?.mouseDragged(with: event)
        case .none:
            break
        }
    }

    override func mouseUp(with event: NSEvent) {
        switch mode {
        case .move:
            if dragged { owner?.commitPlace() }
            NSCursor.openHand.set()
        case .size:
            if dragged { owner?.commitPlace() }
        case .web:
            web?.mouseUp(with: event)
        case .none:
            break
        }
        mode = .none
        dragged = false
    }

    override func scrollWheel(with event: NSEvent) {
        if onRing(local(event)) { super.scrollWheel(with: event) } else { web?.scrollWheel(with: event) }
    }

    override func rightMouseDown(with event: NSEvent) { owner?.showMenu(at: event, in: self) }
}

// MARK: - App

final class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate {
    private var bar: DocBarClient!
    private var window: ClockPanel!
    private var web: ClockWebView!
    private var drag: DragView!

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }

    private var clockURL: URL {
        let file = Settings.htmlRoot.appendingPathComponent("worldclock/worldclock.html")
        var c = URLComponents(url: file, resolvingAgainstBaseURL: false)
        c?.query = "widget=1"
        return c?.url ?? file
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        bar = DocBarClient(id: "de.docalvers.docclock", name: "DocClock", symbol: "clock") { [weak self] item in
            self?.handle(item)
        }
        buildWindow()
        place()
        if Settings.shown { window.orderFront(nil) }
        loadClock()
        if !Settings.loginOffered {
            Settings.loginOffered = true
            try? SMAppService.mainApp.register()       // a desktop clock should be there after a restart, too
        }
        publishMenu()

        // A click in another app or on the wallpaper ends the selection (DocPhoto does the same)
        NSEvent.addGlobalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] _ in
            self?.drag.select(false)
        }

        NotificationCenter.default.addObserver(self, selector: #selector(screensChanged),
                                               name: NSApplication.didChangeScreenParametersNotification, object: nil)
        // After sleep the page starts afresh: timers that slept, a WebContent process macOS has trimmed
        let ws = NSWorkspace.shared.notificationCenter
        for name in [NSWorkspace.didWakeNotification, NSWorkspace.screensDidWakeNotification] {
            ws.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in self?.reload() }
        }
    }

    // MARK: window

    private func buildWindow() {
        let s = CGFloat(Settings.size) + 2 * selPad
        let panel = ClockPanel(contentRect: NSRect(x: 0, y: 0, width: s, height: s),
                               styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false                 // flat like a widget, the dial brings its own rim
        panel.isMovableByWindowBackground = false
        panel.hidesOnDeactivate = false
        panel.becomesKeyOnlyIfNeeded = true
        panel.isReleasedWhenClosed = false
        // One step above the desktop icons, as DocPhoto's prints: at the icon level itself Finder's desktop window takes
        // the front spot whenever it redraws and swallows the clicks. Still below any ordinary window.
        panel.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopIconWindow)) + 1)
        panel.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle, .fullScreenNone]
        panel.acceptsMouseMovedEvents = true                // hover over the cities while another app is active

        let root = NSView(frame: NSRect(x: 0, y: 0, width: s, height: s))
        root.wantsLayer = true
        root.layer?.backgroundColor = NSColor.clear.cgColor

        let conf = WKWebViewConfiguration()
        conf.suppressesIncrementalRendering = true          // the dial appears drawn, not while the page builds up
        let web = ClockWebView(frame: root.bounds.insetBy(dx: selPad, dy: selPad), configuration: conf)
        web.autoresizingMask = [.width, .height]
        web.setValue(false, forKey: "drawsBackground")      // transparent: the wallpaper shows around the round dial
        web.navigationDelegate = self
        root.addSubview(web)

        let drag = DragView(frame: root.bounds)
        drag.autoresizingMask = [.width, .height]
        drag.owner = self
        drag.web = web
        root.addSubview(drag)

        panel.contentView = root
        window = panel
        self.web = web
        self.drag = drag
    }

    /// Everything from the internet is blocked: the dial needs only the lab's local files (map, cities, scripts) and the
    /// Orbitron installed on this Mac, so it looks the same offline, starts at once and never pulls three.js, satellite
    /// data or fonts from a CDN. Then the lab's page is loaded from its file.
    private func loadClock() {
        let rules = #"[{"trigger":{"url-filter":"^https?://"},"action":{"type":"block"}}]"#
        WKContentRuleListStore.default().compileContentRuleList(forIdentifier: "docclock-offline",
                                                                encodedContentRuleList: rules) { [weak self] list, _ in
            DispatchQueue.main.async {
                guard let self = self else { return }
                if let list = list { self.web.configuration.userContentController.add(list) }
                self.reload()
            }
        }
    }

    private func reload() {
        web.loadFileURL(clockURL, allowingReadAccessTo: Settings.htmlRoot)
    }

    /// macOS may end the page's process (memory pressure): start it again instead of leaving an empty window.
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { reload() }

    /// To its remembered place. A place on a screen that is not connected right now (the LG unplugged, the laptop
    /// closed) is left alone: the clock waits at the default spot of a connected screen meanwhile, and only a real
    /// move by hand records a new place.
    private func place() {
        let s = CGFloat(Settings.size)
        var c = Settings.center ?? defaultCenter(size: s)
        if !NSScreen.screens.contains(where: { $0.frame.contains(c) }) { c = defaultCenter(size: s) }
        window.setFrame(frame(centre: c, size: s), display: true)
        if Settings.center == nil { commitPlace() }       // the first spot is kept, whatever screen is main next time
    }

    /// First start: the top left corner of the main screen, a little in from the edges (desktop icons and the system
    /// widgets usually take the right side).
    private func defaultCenter(size s: CGFloat) -> NSPoint {
        let vis = (NSScreen.main ?? NSScreen.screens.first)?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1440, height: 900)
        let margin: CGFloat = 40
        return NSPoint(x: vis.minX + margin + s / 2, y: vis.maxY - margin - s / 2)
    }

    /// The window for a dial of diameter `s` around `c`: the dial plus selPad on every side.
    private func frame(centre c: NSPoint, size s: CGFloat) -> NSRect {
        let w = s + 2 * selPad
        return NSRect(x: c.x - w / 2, y: c.y - w / 2, width: w, height: w)
    }

    /// Place and size as they stand now, remembered for the next start.
    func commitPlace() {
        Settings.center = NSPoint(x: window.frame.midX, y: window.frame.midY)
        Settings.size = Double(window.frame.width - 2 * selPad)
    }

    /// Sizing with a handle: round, about the fixed middle, within Settings.minSize … maxSize.
    func setSize(_ size: Double, centre c: NSPoint) {
        let s = CGFloat(min(Settings.maxSize, max(Settings.minSize, size)))
        window.setFrame(frame(centre: c, size: s), display: true)
    }

    @objc private func screensChanged() { place() }

    private func resize(by factor: Double) {
        let c = NSPoint(x: window.frame.midX, y: window.frame.midY)
        Settings.size = Settings.size * factor
        window.setFrame(frame(centre: c, size: CGFloat(Settings.size)), display: true)
        commitPlace()
    }

    private func setShown(_ on: Bool) {
        Settings.shown = on
        if on { window.orderFront(nil) } else { window.orderOut(nil) }
        publishMenu()
    }

    /// The full lab in Chrome (never Safari): the local server with live reload when it runs, else the live site.
    func openLab() {
        let local = URL(string: "http://localhost:8765/worldclock/worldclock.html")!
        let live = URL(string: "https://docalvers.de/worldclock/worldclock.html")!
        var probe = URLRequest(url: local, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 0.6)
        probe.httpMethod = "HEAD"
        URLSession.shared.dataTask(with: probe) { _, response, _ in
            let up = (response as? HTTPURLResponse)?.statusCode == 200
            DispatchQueue.main.async {
                let url = up ? local : live
                if let chrome = NSWorkspace.shared.urlForApplication(withBundleIdentifier: "com.google.Chrome") {
                    NSWorkspace.shared.open([url], withApplicationAt: chrome, configuration: NSWorkspace.OpenConfiguration())
                } else {
                    NSWorkspace.shared.open(url)
                }
            }
        }.resume()
    }

    // MARK: menus

    func showMenu(at event: NSEvent, in view: NSView) {
        let menu = NSMenu()
        func add(_ title: String, _ action: Selector, state: Bool? = nil) {
            let it = menu.addItem(withTitle: title, action: action, keyEquivalent: "")
            it.target = self
            if let s = state { it.state = s ? .on : .off }
        }
        add("Kleiner", #selector(menuSmaller))
        add("Größer", #selector(menuBigger))
        menu.addItem(.separator())
        add("Neu laden", #selector(menuReload))
        add("Weltuhr-Labor öffnen", #selector(menuOpenLab))
        menu.addItem(.separator())
        add("Beim Anmelden starten", #selector(menuLogin), state: startsAtLogin)
        add("Ausblenden", #selector(menuHide))
        // No "Beenden" here: it sat at the bottom of the menu and closed the clock by mistake (Doc, 21.11.2026: "Im
        // Moment ist die irgendwie geschlossen"); quitting stays in DocBar, where it is a deliberate step.
        NSMenu.popUpContextMenu(menu, with: event, for: view)
    }

    @objc private func menuSmaller() { resize(by: 0.85) }
    @objc private func menuBigger() { resize(by: 1 / 0.85) }
    @objc private func menuReload() { reload() }
    @objc private func menuOpenLab() { openLab() }
    @objc private func menuLogin() { toggleLogin() }
    @objc private func menuHide() { setShown(false) }

    /// DocBar: the DocClock row switches the clock on and off (ON/OFF pill), the items below do the rest.
    /// false once DocClock quits on purpose: DocBar then lists it as "nicht aktiv - klicken zum Starten" and leaves it;
    /// while it runs, DocBar starts it again should it ever die without quitting (crash, killed).
    private var keepAlive = true

    private func publishMenu() {
        let items = [
            DocBarItem("show", "Weltuhr zeigen", state: Settings.shown),
            DocBarItem("smaller", "Kleiner"),
            DocBarItem("bigger", "Größer"),
            DocBarItem("reload", "Neu laden"),
            DocBarItem("lab", "Weltuhr-Labor öffnen"),
            DocBarItem("login", "Beim Anmelden starten", state: startsAtLogin),
            DocBarItem("quit", "DocClock beenden"),
        ]
        bar.publish(status: Settings.shown ? "Weltuhr auf dem Schreibtisch" : "Weltuhr ausgeblendet",
                    items: items, primary: "show", toggle: Settings.shown, keepAlive: keepAlive)
    }

    private func handle(_ item: String) {
        switch item {
        case "show": setShown(!Settings.shown)
        case "smaller": resize(by: 0.85)
        case "bigger": resize(by: 1 / 0.85)
        case "reload": reload()
        case "lab": openLab()
        case "login": toggleLogin()
        case "quit": NSApp.terminate(nil)
        default: break
        }
    }

    private func toggleLogin() {
        do {
            if startsAtLogin { try SMAppService.mainApp.unregister() }
            else { try SMAppService.mainApp.register() }
        } catch {
            let a = NSAlert()
            a.messageText = "DocClock"
            a.informativeText = "Der Anmeldeeintrag ließ sich nicht ändern: \(error.localizedDescription)"
            a.runModal()
        }
        publishMenu()
    }

    /// Quitting (DocBar's "DocClock beenden", logout) keeps the clock's row in DocBar, so one click starts it again,
    /// and tells DocBar not to revive it.
    func applicationWillTerminate(_ note: Notification) {
        keepAlive = false
        publishMenu()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
