// DeskPhoto — lays photos on the real desktop: borderless windows at desktop-icon
// level, so a picture sits above the wallpaper and below every ordinary window.
// Each photo is drawn like a macOS widget (no margin, no shadow, rounded corners,
// straight) and can be dragged, scaled and rotated with the mouse; position and
// size are remembered. An image with transparent pixels is treated as a cut-out:
// nothing is clipped, the wallpaper shows through its own outline. Every picture
// is copied into ~/Library/Application Support/DeskPhoto/images when it is added.

import Cocoa
import ServiceManagement

// MARK: - Model

struct PhotoRec: Codable {
    var id: String
    var path: String
    var centerX: Double      // screen coordinates, origin bottom-left of the primary display
    var centerY: Double
    var width: Double        // width of the image itself
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

/// Corner radius of a photo, in proportion to its width so it keeps its look when
/// scaled. 0.056 is measured from the chat-bubble cut-out on Doc's desktop (37.5 px
/// radius on 669 px), so a photo at the same width has the same corners as it and as
/// the system widgets beside it (about 19 pt at the default 340 pt).
private func cornerRadius(for width: Double) -> CGFloat { CGFloat(max(6, width * 0.056)) }

/// Padding around the photo inside its window, so the corner grips and a tilted
/// photo still fit.
private let shadowPad: Double = 40

/// True when the image has pixels that are not fully opaque. Probed on a small
/// RGBA rendering: a real cut-out keeps translucent pixels even at 256 px, while an
/// opaque photo that merely carries an alpha channel stays solid everywhere.
private func hasTransparency(_ cg: CGImage) -> Bool {
    switch cg.alphaInfo {
    case .none, .noneSkipLast, .noneSkipFirst: return false
    default: break
    }
    let n = 256
    guard let ctx = CGContext(data: nil, width: n, height: n, bitsPerComponent: 8, bytesPerRow: n * 4,
                              space: CGColorSpaceCreateDeviceRGB(),
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue),
          let data = ctx.data else { return false }
    ctx.clear(CGRect(x: 0, y: 0, width: n, height: n))
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: n, height: n))
    let px = data.bindMemory(to: UInt8.self, capacity: n * n * 4)
    for i in stride(from: 3, to: n * n * 4, by: 4) where px[i] < 250 { return true }
    return false
}

// MARK: - The view that draws one print

final class PhotoView: NSView {
    var paperSize: CGSize = .zero
    var angle: Double = 0
    private var rounded = false           // photo with widget corners; a cut-out keeps its own outline

    private let paper = CALayer()
    private let photo = CALayer()
    private var handles: [CALayer] = []

    weak var item: PhotoItem?

    /// Distance in points around a corner that counts as grabbing the handle.
    private let handleGrab: Double = 22
    private let handleRadius: CGFloat = 5.5

    private enum Mode { case none, move, transform }
    private var mode: Mode = .none
    private var dragged = false           // set as soon as the mouse really moves

    private var startMouse: NSPoint = .zero       // screen coordinates
    private var startOrigin: NSPoint = .zero
    private var startCenter: NSPoint = .zero      // screen coordinates, fixed while transforming
    private var startWidth: Double = 0
    private var startAngle: Double = 0
    private var startVector: Double = 0           // angle of centre → mouse at grab time
    private var startDistance: Double = 1

    private var selected = false

    override init(frame: NSRect) {
        super.init(frame: frame)
        wantsLayer = true
        layer?.backgroundColor = NSColor.clear.cgColor

        // The paper layer only carries the photo and its grips, so both turn together;
        // it draws nothing itself.
        paper.backgroundColor = nil
        paper.masksToBounds = false

        photo.masksToBounds = true
        photo.contentsGravity = .resizeAspectFill
        photo.cornerCurve = .continuous     // the squircle of the system widgets
        paper.addSublayer(photo)

        // Corner grips, sitting inside the paper layer so they turn along with the photo.
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

    /// A photo looks like the widgets beside it: no white margin, no shadow, rounded
    /// corners (Doc, 10.11.2026: "nicht, dass das so einen weißen Rand kriegt ... mit so
    /// runden Ecken"). A cut-out is not clipped, it sits on the wallpaper as its own outline.
    func setImage(_ image: CGImage, borderless: Bool) {
        photo.contents = image
        rounded = !borderless
    }

    /// Re-lays the print for the current window size; called after every scale or rotate.
    func relayout() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        paper.bounds = CGRect(origin: .zero, size: paperSize)
        paper.position = CGPoint(x: bounds.midX, y: bounds.midY)
        paper.transform = CATransform3DMakeRotation(CGFloat(angle), 0, 0, 1)
        photo.frame = paper.bounds
        photo.cornerRadius = rounded ? cornerRadius(for: Double(paperSize.width)) : 0
        for (i, h) in handles.enumerated() {
            let x: CGFloat = (i == 0 || i == 3) ? 0 : paperSize.width
            let y: CGFloat = (i < 2) ? 0 : paperSize.height
            h.position = CGPoint(x: x, y: y)
        }
        CATransaction.commit()
    }

    // MARK: selection

    /// Driven by the app's global mouse monitor rather than a tracking area: while another
    /// app owns the cursor — "show desktop" puts a catcher over the wallpaper — a tracking
    /// area on a desktop-level window stops firing, and the grips would never appear.
    /// Grips show on the print that was clicked, not on the one under the pointer: a
    /// desktop full of photos should stay quiet while the mouse only travels across it.
    func showHandles(_ on: Bool) {
        guard on != selected else { return }
        selected = on
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        for h in handles { h.opacity = on ? 1 : 0 }
        CATransaction.commit()
    }

    func toggleHandles() { showHandles(!selected) }

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

        dragged = false
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
        if hypot(now.x - startMouse.x, now.y - startMouse.y) > 2 { dragged = true }
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
        // A click that moved nothing toggles the grips, so the same print puts them
        // away again — clicking the wallpaper instead would reveal the desktop.
        if !dragged && event.clickCount == 1 { toggleHandles() }
        mode = .none
        dragged = false
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
    let borderless: Bool                  // cut-out, drawn unclipped, see hasTransparency
    weak var owner: AppDelegate?

    init?(rec: PhotoRec, owner: AppDelegate) {
        guard let image = NSImage(contentsOfFile: rec.path),
              let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil),
              cg.height > 0 else { return nil }

        self.rec = rec
        self.owner = owner
        self.aspect = Double(cg.width) / Double(cg.height)
        self.borderless = hasTransparency(cg)

        let panel = NSPanel(contentRect: NSRect(x: 0, y: 0, width: 10, height: 10),
                            styleMask: [.borderless, .nonactivatingPanel],
                            backing: .buffered, defer: false)
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false                 // flat like a widget, no window shadow
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
        view.setImage(cg, borderless: borderless)
        panel.contentView = view
        view.item = self

        apply()
        panel.orderFront(nil)
    }

    /// Rebuilds the window geometry from the record, keeping the photo centred.
    private func apply() {
        let w = rec.width
        let paper = CGSize(width: w, height: w / aspect)

        let ca = abs(cos(rec.angle)), sa = abs(sin(rec.angle))
        let boxW = Double(paper.width) * ca + Double(paper.height) * sa
        let boxH = Double(paper.width) * sa + Double(paper.height) * ca

        let winW = boxW + 2 * shadowPad
        let winH = boxH + 2 * shadowPad
        window.setFrame(NSRect(x: rec.centerX - winW / 2, y: rec.centerY - winH / 2,
                               width: winW, height: winH), display: true)

        view.frame = NSRect(origin: .zero, size: CGSize(width: winW, height: winH))
        view.paperSize = paper
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

    func select(_ on: Bool) { view.showHandles(on) }

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
        bar = DocBarClient(id: "de.docalvers.deskphoto", name: "DocPhoto",
                           symbol: "photo.on.rectangle.angled") { [weak self] item in
            self?.handle(item)
        }

        for rec in store.recs {
            if let item = PhotoItem(rec: rec, owner: self) { items.append(item) }
        }
        save()   // drops records whose file has gone
        publishMenu()

        // One monitor for all prints; global sees the click while other apps are in front,
        // local sees it while our own window has it. A click anywhere else clears the grips.
        NSEvent.addGlobalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] _ in
            self?.updateSelection()
        }
        NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] e in
            self?.updateSelection()
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
            let id = UUID().uuidString
            let rec = PhotoRec(id: id,
                               path: ownCopy(of: url, id: id).path,
                               centerX: Double(screen.midX) + Double(n % 5) * 34,
                               centerY: Double(screen.midY) - Double(n % 5) * 28,
                               width: 340,
                               angle: 0)     // straight, like the widgets beside it
            if let item = PhotoItem(rec: rec, owner: self) { items.append(item) }
        }
        save()
        publishMenu()
    }

    @objc private func removeAll() {
        let paths = items.map { $0.rec.path }
        items.forEach { $0.close() }
        items.removeAll()
        save()
        paths.forEach(trashOwnCopy)
        publishMenu()
    }

    @objc private func toggleLogin() {
        do {
            if startsAtLogin { try SMAppService.mainApp.unregister() }
            else { try SMAppService.mainApp.register() }
        } catch {
            let a = NSAlert()
            a.messageText = "DocPhoto"
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
        trashOwnCopy(item.rec.path)
        publishMenu()
    }

    // MARK: own copies

    /// DeskPhoto's own folder of pictures; reading it needs no permission.
    private var imagesFolder: URL {
        let url = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("DeskPhoto/images", isDirectory: true)
        try? FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
        return url
    }

    /// True when the file lies directly in DeskPhoto's own folder.
    private func isOwnCopy(_ url: URL) -> Bool {
        url.standardizedFileURL.deletingLastPathComponent().path == imagesFolder.standardizedFileURL.path
    }

    /// Copies a picture Doc picked into DeskPhoto's own folder and returns the copy.
    /// Reading ~/Desktop or ~/Downloads needs a macOS permission, and every ad-hoc signed
    /// rebuild voids it: on the next start the original could not be read, macOS asked
    /// again, and a refused or missed prompt dropped the photo from photos.json
    /// (10.11.2026). The copy needs no permission. Falls back to the original if the
    /// copy fails, so adding a photo never breaks because of it.
    private func ownCopy(of url: URL, id: String) -> URL {
        if isOwnCopy(url) { return url }
        let base = url.deletingPathExtension().lastPathComponent.lowercased()
            .replacingOccurrences(of: " ", with: "-")
        let ext = url.pathExtension.lowercased()
        let name = "\(base)-\(id.prefix(8).lowercased())" + (ext.isEmpty ? "" : ".\(ext)")
        let dest = imagesFolder.appendingPathComponent(name)
        do {
            try FileManager.default.copyItem(at: url, to: dest)
            return dest
        } catch {
            return url
        }
    }

    /// Moves DeskPhoto's own copy to the Trash once its photo has left the desktop —
    /// the Trash, not deleted, so it can still be brought back. Files outside the own
    /// folder (the originals) and copies another photo still shows are never touched.
    private func trashOwnCopy(_ path: String) {
        let url = URL(fileURLWithPath: path)
        guard isOwnCopy(url), !items.contains(where: { $0.rec.path == path }) else { return }
        try? FileManager.default.trashItem(at: url, resultingItemURL: nil)
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

    /// Hides the grips everywhere but on the print that was just clicked; that one
    /// toggles its own grips on mouse up, so a second click puts them away.
    private func updateSelection() {
        let p = NSEvent.mouseLocation
        var hitTopmost = false
        for item in items.reversed() {       // topmost print wins
            if !hitTopmost && item.covers(p) { hitTopmost = true } else { item.select(false) }
        }
    }

    func save() { store.replace(items.map { $0.rec }) }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
