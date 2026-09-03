// DeskPhoto — lays photos on the real desktop: borderless windows at desktop-icon
// level, so a picture sits above the wallpaper and below every ordinary window.
// Each photo is drawn as a print (white margin, soft shadow, slight tilt) and can
// be dragged, scaled and rotated with the mouse; position and size are remembered.

import Cocoa
import ServiceManagement

// MARK: - Model

struct PhotoRec: Codable {
    var id: String
    var path: String
    var centerX: Double      // screen coordinates, origin bottom-left of the primary display
    var centerY: Double
    var width: Double        // width of the image itself, without the white margin
    var angle: Double        // radians, counter-clockwise
}

final class Store {
    private(set) var recs: [PhotoRec] = []

    private var url: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("DeskPhoto", isDirectory: true)
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        return base.appendingPathComponent("photos.json")
    }

    init() {
        if let data = try? Data(contentsOf: url),
           let list = try? JSONDecoder().decode([PhotoRec].self, from: data) {
            recs = list
        }
    }

    func replace(_ list: [PhotoRec]) {
        recs = list
        let enc = JSONEncoder()
        enc.outputFormatting = [.prettyPrinted]
        if let data = try? enc.encode(recs) { try? data.write(to: url, options: .atomic) }
    }
}

// MARK: - Geometry helpers

/// White margin around the image, growing with the print but never dominating it.
private func margin(for width: Double) -> Double { min(18, max(6, width * 0.028)) }

/// Padding that keeps the drop shadow inside the window even when the print is tilted.
private let shadowPad: Double = 40

// MARK: - The view that draws one print

final class PhotoView: NSView {
    var paperSize: CGSize = .zero
    var paperMargin: Double = 0
    var angle: Double = 0

    private let paper = CALayer()
    private let photo = CALayer()
    private var handles: [CALayer] = []

    weak var item: PhotoItem?

    /// Distance in points around a corner that counts as grabbing the handle.
    private let handleGrab: Double = 22
    private let handleRadius: CGFloat = 5.5

    private enum Mode { case none, move, transform }
    private var mode: Mode = .none

    private var startMouse: NSPoint = .zero       // screen coordinates
    private var startOrigin: NSPoint = .zero
    private var startCenter: NSPoint = .zero      // screen coordinates, fixed while transforming
    private var startWidth: Double = 0
    private var startAngle: Double = 0
    private var startVector: Double = 0           // angle of centre → mouse at grab time
    private var startDistance: Double = 1

    private var hovering = false

    override init(frame: NSRect) {
        super.init(frame: frame)
        wantsLayer = true
        layer?.backgroundColor = NSColor.clear.cgColor

        paper.backgroundColor = NSColor.white.cgColor
        paper.cornerRadius = 2
        paper.masksToBounds = false
        paper.shadowColor = NSColor.black.cgColor
        paper.shadowOpacity = 0.45
        paper.shadowRadius = 16
        paper.shadowOffset = CGSize(width: 0, height: -8)   // layer coordinates: y points up

        photo.masksToBounds = true
        photo.contentsGravity = .resizeAspectFill
        photo.cornerRadius = 1
        paper.addSublayer(photo)

        // Corner grips, sitting inside the paper layer so they turn along with the print.
        for _ in 0..<4 {
            let h = CALayer()
            h.backgroundColor = NSColor.white.cgColor
            h.borderColor = NSColor(white: 0.25, alpha: 0.85).cgColor
            h.borderWidth = 1
            h.cornerRadius = handleRadius
            h.bounds = CGRect(x: 0, y: 0, width: handleRadius * 2, height: handleRadius * 2)
            h.shadowColor = NSColor.black.cgColor
            h.shadowOpacity = 0.35
            h.shadowRadius = 2
            h.shadowOffset = CGSize(width: 0, height: -1)
            h.opacity = 0
            paper.addSublayer(h)
            handles.append(h)
        }

        layer?.addSublayer(paper)
    }

    required init?(coder: NSCoder) { fatalError() }

    func setImage(_ image: CGImage) { photo.contents = image }

    /// Re-lays the print for the current window size; called after every scale or rotate.
    func relayout() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        let m = CGFloat(paperMargin)
        paper.bounds = CGRect(origin: .zero, size: paperSize)
        paper.position = CGPoint(x: bounds.midX, y: bounds.midY)
        paper.transform = CATransform3DMakeRotation(CGFloat(angle), 0, 0, 1)
        photo.frame = CGRect(x: m, y: m, width: paperSize.width - 2 * m, height: paperSize.height - 2 * m)
        for (i, h) in handles.enumerated() {
            let x: CGFloat = (i == 0 || i == 3) ? 0 : paperSize.width
            let y: CGFloat = (i < 2) ? 0 : paperSize.height
            h.position = CGPoint(x: x, y: y)
        }
        CATransaction.commit()
    }

    // MARK: hover

    /// Driven by the app's global mouse monitor rather than a tracking area: while another
    /// app owns the cursor — "show desktop" puts a catcher over the wallpaper — a tracking
    /// area on a desktop-level window stops firing, and the grips would never appear.
    func showHandles(_ on: Bool) {
        guard on != hovering else { return }
        hovering = on
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        for h in handles { h.opacity = on ? 1 : 0 }
        CATransaction.commit()
    }

    /// True when the point, in screen coordinates, lies on the print.
    func covers(screenPoint p: NSPoint) -> Bool {
        guard let win = window else { return false }
        let local = NSPoint(x: p.x - win.frame.origin.x, y: p.y - win.frame.origin.y)
        return containsLocal(local)
    }

    // MARK: geometry

    /// Point in the paper's own, un-rotated coordinate system, measured from its centre.
    private func paperLocal(_ viewPoint: NSPoint) -> NSPoint {
        let dx = Double(viewPoint.x - bounds.midX)
        let dy = Double(viewPoint.y - bounds.midY)
        let ca = cos(-angle), sa = sin(-angle)
        return NSPoint(x: dx * ca - dy * sa, y: dx * sa + dy * ca)
    }

    private func isOnHandle(_ event: NSEvent) -> Bool {
        let p = paperLocal(convert(event.locationInWindow, from: nil))
        let hw = Double(paperSize.width) / 2, hh = Double(paperSize.height) / 2
        return hypot(abs(p.x) - hw, abs(p.y) - hh) <= handleGrab
    }

    /// Only the print and its corner grips are clickable — the shadow padding is not.
    override func hitTest(_ point: NSPoint) -> NSView? {
        let p = superview.map { convert(point, from: $0) } ?? point
        return containsLocal(p) ? self : nil
    }

    /// Point in this view's own coordinates on the print, grips included.
    private func containsLocal(_ point: NSPoint) -> Bool {
        let p = paperLocal(point)
        let slack = handleGrab * 0.6
        return abs(p.x) <= Double(paperSize.width) / 2 + slack
            && abs(p.y) <= Double(paperSize.height) / 2 + slack
    }

    // MARK: mouse

    override func mouseDown(with event: NSEvent) {
        if event.clickCount == 2 { item?.openOriginal(); return }
        guard let win = window else { return }

        startMouse = NSEvent.mouseLocation
        startOrigin = win.frame.origin
        startCenter = NSPoint(x: win.frame.midX, y: win.frame.midY)

        if isOnHandle(event) {
            mode = .transform
            startWidth = item?.rec.width ?? 1
            startAngle = angle
            let dx = Double(startMouse.x - startCenter.x)
            let dy = Double(startMouse.y - startCenter.y)
            startVector = atan2(dy, dx)
            startDistance = max(8, hypot(dx, dy))
            NSCursor.crosshair.set()
        } else {
            mode = .move
            NSCursor.closedHand.set()
        }
    }

    override func mouseDragged(with event: NSEvent) {
        let now = NSEvent.mouseLocation
        switch mode {
        case .move:
            window?.setFrameOrigin(NSPoint(x: startOrigin.x + (now.x - startMouse.x),
                                           y: startOrigin.y + (now.y - startMouse.y)))
        case .transform:
            // Dragging a corner turns and scales the print at once — the way a photo
            // moves when you push its corner across a table. Shift keeps the angle,
            // option keeps the size.
            let dx = Double(now.x - startCenter.x)
            let dy = Double(now.y - startCenter.y)
            let dist = max(8, hypot(dx, dy))
            let mods = event.modifierFlags
            let width = mods.contains(.option) ? startWidth : startWidth * dist / startDistance
            let turn = mods.contains(.shift) ? startAngle : startAngle + (atan2(dy, dx) - startVector)
            item?.setTransform(width: width, angle: turn)
        case .none:
            break
        }
    }

    override func mouseUp(with event: NSEvent) {
        mode = .none
        NSCursor.arrow.set()
        item?.commit()
    }

    /// Scrolling scales the print; holding option turns it instead.
    override func scrollWheel(with event: NSEvent) {
        guard let item = item else { return }
        if event.modifierFlags.contains(.option) {
            item.rotate(by: Double(event.scrollingDeltaY) * 0.004)
        } else {
            item.scale(by: 1 + Double(event.scrollingDeltaY) * 0.006)
        }
    }

    override func rightMouseDown(with event: NSEvent) { item?.showMenu(at: event) }
}

// MARK: - One photo: window + view + record

final class PhotoItem {
    private(set) var rec: PhotoRec
    let window: NSPanel
    private let view: PhotoView
    private let aspect: Double            // width / height of the image
    weak var owner: AppDelegate?

    init?(rec: PhotoRec, owner: AppDelegate) {
        guard let image = NSImage(contentsOfFile: rec.path),
              let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil),
              cg.height > 0 else { return nil }

        self.rec = rec
        self.owner = owner
        self.aspect = Double(cg.width) / Double(cg.height)

        let panel = NSPanel(contentRect: NSRect(x: 0, y: 0, width: 10, height: 10),
                            styleMask: [.borderless, .nonactivatingPanel],
                            backing: .buffered, defer: false)
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false                 // the shadow is drawn in the layer so it tilts along
        panel.isMovableByWindowBackground = false
        panel.hidesOnDeactivate = false
        panel.becomesKeyOnlyIfNeeded = true
        // One step above the desktop icons: at the icon level itself Finder's desktop window
        // takes the front spot whenever it redraws, and then it swallows every click on a print.
        // Still far below any ordinary window, so a print never covers real work.
        panel.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopIconWindow)) + 1)
        panel.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle, .fullScreenNone]
        self.window = panel

        view = PhotoView(frame: .zero)
        view.setImage(cg)
        panel.contentView = view
        view.item = self

        apply()
        panel.orderFront(nil)
    }

    /// Rebuilds the window geometry from the record, keeping the print centred.
    private func apply() {
        let w = rec.width
        let h = w / aspect
        let m = margin(for: w)
        let paper = CGSize(width: w + 2 * m, height: h + 2 * m)

        let ca = abs(cos(rec.angle)), sa = abs(sin(rec.angle))
        let boxW = Double(paper.width) * ca + Double(paper.height) * sa
        let boxH = Double(paper.width) * sa + Double(paper.height) * ca

        let winW = boxW + 2 * shadowPad
        let winH = boxH + 2 * shadowPad
        window.setFrame(NSRect(x: rec.centerX - winW / 2, y: rec.centerY - winH / 2,
                               width: winW, height: winH), display: true)

        view.frame = NSRect(origin: .zero, size: CGSize(width: winW, height: winH))
        view.paperSize = paper
        view.paperMargin = m
        view.angle = rec.angle
        view.relayout()
    }

    /// Sets size and angle in one go, keeping the print centred where it lies.
    func setTransform(width: Double, angle: Double) {
        rec.width = min(2400, max(90, width))
        rec.angle = angle
        apply()
    }

    func scale(by factor: Double) {
        rec.width = min(2400, max(90, rec.width * factor))
        apply()
        commit()
    }

    func rotate(by delta: Double) {
        rec.angle += delta
        apply()
        commit()
    }

    func straighten() {
        rec.angle = 0
        apply()
        commit()
    }

    func hover(_ on: Bool) { view.showHandles(on) }

    func covers(_ p: NSPoint) -> Bool { view.covers(screenPoint: p) }

    func openOriginal() { NSWorkspace.shared.open(URL(fileURLWithPath: rec.path)) }

    /// Writes the live window position back into the record and saves.
    func commit() {
        let f = window.frame
        rec.centerX = Double(f.midX)
        rec.centerY = Double(f.midY)
        owner?.save()
    }

    func close() { window.orderOut(nil) }

    func showMenu(at event: NSEvent) {
        let menu = NSMenu()
        menu.addItem(withTitle: "Gerade ausrichten", action: #selector(AppDelegate.menuStraighten(_:)), keyEquivalent: "")
        menu.addItem(withTitle: "Kleiner", action: #selector(AppDelegate.menuSmaller(_:)), keyEquivalent: "")
        menu.addItem(withTitle: "Größer", action: #selector(AppDelegate.menuBigger(_:)), keyEquivalent: "")
        menu.addItem(.separator())
        menu.addItem(withTitle: "Original öffnen", action: #selector(AppDelegate.menuOpen(_:)), keyEquivalent: "")
        menu.addItem(withTitle: "Vom Schreibtisch nehmen", action: #selector(AppDelegate.menuRemove(_:)), keyEquivalent: "")
        for it in menu.items {
            it.target = owner
            it.representedObject = self
        }
        NSMenu.popUpContextMenu(menu, with: event, for: window.contentView!)
    }
}

// MARK: - App

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var bar: DocBarClient!
    private let store = Store()
    private var items: [PhotoItem] = []

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }

    func applicationDidFinishLaunching(_ note: Notification) {
        bar = DocBarClient(id: "de.docalvers.deskphoto", name: "DeskPhoto",
                           symbol: "photo.on.rectangle.angled") { [weak self] item in
            self?.handle(item)
        }

        for rec in store.recs {
            if let item = PhotoItem(rec: rec, owner: self) { items.append(item) }
        }
        save()   // drops records whose file has gone
        publishMenu()

        // One monitor for all prints; global sees the pointer while other apps are in front,
        // local sees it while our own panel has it.
        NSEvent.addGlobalMonitorForEvents(matching: [.mouseMoved, .leftMouseDragged]) { [weak self] _ in
            self?.updateHover()
        }
        NSEvent.addLocalMonitorForEvents(matching: [.mouseMoved, .leftMouseDragged]) { [weak self] e in
            self?.updateHover()
            return e
        }

        NotificationCenter.default.addObserver(self, selector: #selector(screensChanged),
                                               name: NSApplication.didChangeScreenParametersNotification, object: nil)
    }

    // MARK: menu

    private func publishMenu() {
        var items: [DocBarItem] = [DocBarItem("add", "Foto ablegen …")]
        if !self.items.isEmpty { items.append(DocBarItem("clear", "Alle Fotos wegräumen")) }
        items.append(DocBarItem("login", "Beim Anmelden starten", state: startsAtLogin))

        let n = self.items.count
        let status = n == 0 ? "kein Foto abgelegt" : (n == 1 ? "1 Foto auf dem Schreibtisch"
                                                             : "\(n) Fotos auf dem Schreibtisch")
        bar.publish(status: status, items: items)
    }

    private func handle(_ item: String) {
        switch item {
        case "add": addPhoto()
        case "clear": removeAll()
        case "login": toggleLogin()
        case "quit": quit()
        default: break
        }
    }

    @objc private func addPhoto() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = true
        panel.canChooseDirectories = false
        panel.allowedContentTypes = [.image]
        panel.prompt = "Ablegen"
        NSApp.activate(ignoringOtherApps: true)
        guard panel.runModal() == .OK else { return }

        let screen = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1440, height: 900)
        for (i, url) in panel.urls.enumerated() {
            let n = items.count + i
            let rec = PhotoRec(id: UUID().uuidString,
                               path: url.path,
                               centerX: Double(screen.midX) + Double(n % 5) * 34,
                               centerY: Double(screen.midY) - Double(n % 5) * 28,
                               width: 340,
                               angle: Double.random(in: -0.06 ... 0.06))
            if let item = PhotoItem(rec: rec, owner: self) { items.append(item) }
        }
        save()
        publishMenu()
    }

    @objc private func removeAll() {
        items.forEach { $0.close() }
        items.removeAll()
        save()
        publishMenu()
    }

    @objc private func toggleLogin() {
        do {
            if startsAtLogin { try SMAppService.mainApp.unregister() }
            else { try SMAppService.mainApp.register() }
        } catch {
            let a = NSAlert()
            a.messageText = "DeskPhoto"
            a.informativeText = "Der Anmeldeeintrag ließ sich nicht ändern: \(error.localizedDescription)"
            a.runModal()
        }
        publishMenu()
    }

    @objc private func quit() { NSApp.terminate(nil) }

    func applicationWillTerminate(_ note: Notification) { bar.withdraw() }

    // MARK: per-photo menu actions

    @objc func menuStraighten(_ sender: NSMenuItem) { (sender.representedObject as? PhotoItem)?.straighten() }
    @objc func menuSmaller(_ sender: NSMenuItem) { (sender.representedObject as? PhotoItem)?.scale(by: 0.8) }
    @objc func menuBigger(_ sender: NSMenuItem) { (sender.representedObject as? PhotoItem)?.scale(by: 1.25) }
    @objc func menuOpen(_ sender: NSMenuItem) { (sender.representedObject as? PhotoItem)?.openOriginal() }

    @objc func menuRemove(_ sender: NSMenuItem) {
        guard let item = sender.representedObject as? PhotoItem else { return }
        item.close()
        items.removeAll { $0 === item }
        save()
        publishMenu()
    }

    // MARK: housekeeping

    /// Pulls prints back onto a visible screen after a monitor was unplugged.
    @objc private func screensChanged() {
        for item in items {
            let f = item.window.frame
            let onScreen = NSScreen.screens.contains { $0.frame.intersects(f) }
            if !onScreen, let vis = NSScreen.main?.visibleFrame {
                item.window.setFrameOrigin(NSPoint(x: vis.midX - f.width / 2, y: vis.midY - f.height / 2))
                item.commit()
            }
        }
    }

    /// Shows the grips on the print under the pointer and hides them everywhere else.
    private func updateHover() {
        let p = NSEvent.mouseLocation
        var found = false
        for item in items.reversed() {       // topmost print wins
            let on = !found && item.covers(p)
            item.hover(on)
            if on { found = true }
        }
    }

    func save() { store.replace(items.map { $0.rec }) }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
