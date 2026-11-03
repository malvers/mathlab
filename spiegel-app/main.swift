// Spiegel — shows the second screen in a small window on the Mac's own screen, so Doc sees
// what the board in the classroom shows while he works on the Mac. It comes by itself when a
// screen is extended next to the built-in display and goes with that screen; a mirrored
// screen needs no mirror. Frames go straight from ScreenCaptureKit into the window, nothing
// is saved or sent.
//
// Drag the picture to move it, drag one of its corners to resize it. Both are remembered.

import Cocoa
import CoreMedia
import ScreenCaptureKit
import ServiceManagement

// MARK: - settings

enum Setting {
    static let fps: Int32 = 15              // enough to follow a pen on the board
    static let share: CGFloat = 0.28        // first width, as a share of the Mac's screen
    static let margin: CGFloat = 16
    static let minWidth: CGFloat = 160
    static let minPixels: CGFloat = 640     // never capture smaller than this
    static let settle = 1.0                 // screens report several changes in a row
    static let retry = 3.0                  // a lost stream starts again after this
    static let windowRadius: CGFloat = 15   // measured on macOS 26: the panel's round corners
    static let gripZone: CGFloat = 32       // a press this close to a corner resizes
    static let gripLength: CGFloat = 18
    static let gripInset: CGFloat = 6
    static let gripLine: CGFloat = 3
    static let gripColor = NSColor(srgbRed: 245 / 255, green: 194 / 255, blue: 66 / 255, alpha: 1)   // λ orange
}

// MARK: - log

/// What was shown and why it stopped, never a picture.
func log(_ text: String) {
    let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("Logs/Spiegel.log")
    let line = "\(ISO8601DateFormatter().string(from: Date())) \(text)\n"
    if let handle = try? FileHandle(forWritingTo: url) {
        handle.seekToEndOfFile()
        handle.write(Data(line.utf8))
        try? handle.close()
    } else {
        try? line.write(to: url, atomically: true, encoding: .utf8)
    }
}

// MARK: - screens

extension NSScreen {
    var displayID: CGDirectDisplayID {
        (deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber)?.uint32Value ?? 0
    }

    var isBuiltIn: Bool { CGDisplayIsBuiltin(displayID) != 0 }

    var pixelWidth: CGFloat {
        CGFloat(CGDisplayCopyDisplayMode(displayID)?.pixelWidth ?? Int(frame.width * backingScaleFactor))
    }
}

// MARK: - capture

enum CaptureError: LocalizedError {
    case noDisplay
    var errorDescription: String? { "screen not offered for capture" }
}

/// Streams one display into a layer. Our own window is left out, so a mirror moved onto the
/// board does not show itself again and again.
final class Capture: NSObject, SCStreamOutput, SCStreamDelegate {
    let displayID: CGDirectDisplayID
    private let layer: CALayer
    private let lost: (Error) -> Void
    private let queue = DispatchQueue(label: "de.docalvers.spiegel.capture")
    private let config = SCStreamConfiguration()
    private var stream: SCStream?

    init(displayID: CGDirectDisplayID, layer: CALayer, lost: @escaping (Error) -> Void) {
        self.displayID = displayID
        self.layer = layer
        self.lost = lost
    }

    /// Reports once on the main queue, nil when the first frames are on their way.
    func start(size: CGSize, done: @escaping (Error?) -> Void) {
        SCShareableContent.getExcludingDesktopWindows(false, onScreenWindowsOnly: false) { content, error in
            DispatchQueue.main.async { [self] in
                guard let content, let display = content.displays.first(where: { $0.displayID == displayID }) else {
                    done(error ?? CaptureError.noDisplay)
                    return
                }
                let me = content.applications.filter { $0.processID == getpid() }
                let filter = SCContentFilter(display: display, excludingApplications: me, exceptingWindows: [])
                config.width = Int(size.width)
                config.height = Int(size.height)
                config.minimumFrameInterval = CMTime(value: 1, timescale: Setting.fps)
                config.showsCursor = true
                config.queueDepth = 4
                let new = SCStream(filter: filter, configuration: config, delegate: self)
                do {
                    try new.addStreamOutput(self, type: .screen, sampleHandlerQueue: queue)
                } catch {
                    done(error)
                    return
                }
                stream = new
                new.startCapture { error in DispatchQueue.main.async { done(error) } }
            }
        }
    }

    func resize(_ size: CGSize) {
        guard let stream else { return }
        config.width = Int(size.width)
        config.height = Int(size.height)
        stream.updateConfiguration(config) { _ in }
    }

    func stop() {
        stream?.stopCapture { _ in }
        stream = nil
    }

    func stream(_ stream: SCStream, didOutputSampleBuffer buffer: CMSampleBuffer, of type: SCStreamOutputType) {
        // Idle frames carry no picture: the board did not change, the last one stays.
        guard type == .screen, buffer.isValid,
              let infos = CMSampleBufferGetSampleAttachmentsArray(buffer, createIfNecessary: false)
                as? [[SCStreamFrameInfo: Any]],
              let raw = infos.first?[.status] as? Int, SCFrameStatus(rawValue: raw) == .complete,
              let pixels = buffer.imageBuffer,
              let surface = CVPixelBufferGetIOSurface(pixels)?.takeUnretainedValue() else { return }
        DispatchQueue.main.async { [layer] in
            CATransaction.begin()
            CATransaction.setDisableActions(true)
            layer.contents = surface
            CATransaction.commit()
        }
    }

    func stream(_ stream: SCStream, didStopWithError error: Error) {
        DispatchQueue.main.async { [self] in
            guard self.stream === stream else { return }
            self.stream = nil
            lost(error)
        }
    }
}

// MARK: - window

/// Floats over everything, full-screen apps included, and never takes the keyboard away
/// from the app Doc works in.
final class MirrorPanel: NSPanel {
    override var canBecomeKey: Bool { false }
    override var canBecomeMain: Bool { false }
    override func zoom(_ sender: Any?) {}      // a double-click on the top edge would fill the screen
}

/// The picture. Under the mouse its corners show grips: dragging one resizes the mirror around
/// the opposite corner and keeps the board's shape, dragging anywhere else moves it.
final class MirrorView: NSView {
    var resized: (() -> Void)?
    private let grips = CAShapeLayer()
    private var drag: (anchor: NSPoint, right: Bool, top: Bool)?

    override init(frame: NSRect) {
        super.init(frame: frame)
        wantsLayer = true
        layer?.backgroundColor = NSColor.black.cgColor
        layer?.contentsGravity = .resizeAspect
        grips.strokeColor = Setting.gripColor.cgColor
        grips.fillColor = nil
        grips.lineWidth = Setting.gripLine
        grips.lineCap = .round
        grips.lineJoin = .round
        grips.shadowColor = NSColor.black.cgColor
        grips.shadowOpacity = 0.8
        grips.shadowRadius = 2
        grips.shadowOffset = .zero
        grips.opacity = 0
        layer?.addSublayer(grips)
    }

    required init?(coder: NSCoder) { fatalError("not used") }

    override var mouseDownCanMoveWindow: Bool { false }
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    override func setFrameSize(_ size: NSSize) {
        super.setFrameSize(size)
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        grips.frame = bounds
        grips.path = gripPath()
        CATransaction.commit()
    }

    override func viewDidChangeBackingProperties() {
        super.viewDidChangeBackingProperties()
        grips.contentsScale = window?.backingScaleFactor ?? 2
    }

    private func gripPath() -> CGPath {
        let path = CGMutablePath()
        let (w, h, i, l) = (bounds.width, bounds.height, Setting.gripInset, Setting.gripLength)
        let radius = Setting.windowRadius - i      // bends parallel to the window's round corner
        let corners: [(CGFloat, CGFloat, CGFloat, CGFloat)] = [(i, i, 1, 1), (w - i, i, -1, 1),
                                                               (i, h - i, 1, -1), (w - i, h - i, -1, -1)]
        for (x, y, dx, dy) in corners {
            path.move(to: CGPoint(x: x + dx * l, y: y))
            path.addArc(tangent1End: CGPoint(x: x, y: y), tangent2End: CGPoint(x: x, y: y + dy * l), radius: radius)
            path.addLine(to: CGPoint(x: x, y: y + dy * l))
        }
        return path
    }

    private func showGrips(_ on: Bool) { grips.opacity = on ? 1 : 0 }

    /// Which corner a point is in, nil away from the corners.
    private func corner(at event: NSEvent) -> (right: Bool, top: Bool)? {
        let point = convert(event.locationInWindow, from: nil)
        let zone = min(Setting.gripZone, bounds.width / 3, bounds.height / 3)
        let right = point.x > bounds.width - zone, top = point.y > bounds.height - zone
        guard right || point.x < zone, top || point.y < zone else { return nil }
        return (right, top)
    }

    private func cursor(for corner: (right: Bool, top: Bool)?) -> NSCursor {
        guard let corner else { return .openHand }
        if #available(macOS 15, *) {
            let position: NSCursor.FrameResizePosition = corner.top ? (corner.right ? .topRight : .topLeft)
                                                                    : (corner.right ? .bottomRight : .bottomLeft)
            return .frameResize(position: position, directions: .all)
        }
        return .crosshair
    }

    override func updateTrackingAreas() {
        super.updateTrackingAreas()
        trackingAreas.forEach(removeTrackingArea)
        addTrackingArea(NSTrackingArea(rect: .zero, options: [.mouseEnteredAndExited, .mouseMoved,
                                                              .activeAlways, .inVisibleRect],
                                       owner: self))
    }

    override func mouseEntered(with event: NSEvent) { showGrips(true) }

    override func mouseMoved(with event: NSEvent) { cursor(for: corner(at: event)).set() }

    override func mouseExited(with event: NSEvent) {
        guard drag == nil else { return }
        showGrips(false)
        NSCursor.arrow.set()
    }

    override func mouseDown(with event: NSEvent) {
        guard let window, let corner = corner(at: event) else {
            window?.performDrag(with: event)
            return
        }
        let frame = window.frame
        drag = (NSPoint(x: corner.right ? frame.minX : frame.maxX, y: corner.top ? frame.minY : frame.maxY),
                corner.right, corner.top)
    }

    override func mouseDragged(with event: NSEvent) {
        guard let window, let drag, window.contentAspectRatio.width > 0 else { return }
        let ratio = window.contentAspectRatio.height / window.contentAspectRatio.width
        let mouse = NSEvent.mouseLocation
        var width = max(abs(mouse.x - drag.anchor.x), abs(mouse.y - drag.anchor.y) / ratio)
        if let room = window.screen?.visibleFrame.size { width = min(width, room.width, room.height / ratio) }
        width = max(width, Setting.minWidth).rounded()
        let height = (width * ratio).rounded()
        window.setFrame(NSRect(x: drag.right ? drag.anchor.x : drag.anchor.x - width,
                               y: drag.top ? drag.anchor.y : drag.anchor.y - height,
                               width: width, height: height), display: true)
    }

    override func mouseUp(with event: NSEvent) {
        guard drag != nil else { return }
        drag = nil
        resized?()
        if !bounds.contains(convert(event.locationInWindow, from: nil)) { mouseExited(with: event) }
    }
}

// MARK: - app

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    private var bar: DocBarClient?
    private let panel = MirrorPanel(contentRect: NSRect(x: 0, y: 0, width: 480, height: 270),
                                    styleMask: [.titled, .resizable, .fullSizeContentView,
                                                .nonactivatingPanel, .utilityWindow],
                                    backing: .buffered, defer: false)
    private let picture = MirrorView()
    private var capture: Capture?
    private var board = CGSize(width: 16, height: 9)    // the mirrored screen, in points
    private var boardPixels: CGFloat = 1920
    private var shown = ""                              // name of the mirrored screen
    private var problem: String?
    private var askedForPermission = false
    private var pending: DispatchWorkItem?

    private var enabled: Bool {
        get { UserDefaults.standard.object(forKey: "enabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "enabled") }
    }

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }

    private var home: NSScreen? { NSScreen.screens.first { $0.isBuiltIn } }

    func applicationDidFinishLaunching(_ note: Notification) {
        makePanel()
        bar = DocBarClient(id: "de.docalvers.spiegel", name: "Spiegel",
                           symbol: "pip", rank: 40) { [weak self] item in self?.clicked(item) }
        if !UserDefaults.standard.bool(forKey: "loginSet") {
            UserDefaults.standard.set(true, forKey: "loginSet")
            try? SMAppService.mainApp.register()
        }
        NotificationCenter.default.addObserver(forName: NSApplication.didChangeScreenParametersNotification,
                                               object: nil, queue: .main) { [weak self] _ in self?.later() }
        NSWorkspace.shared.notificationCenter.addObserver(forName: NSWorkspace.didWakeNotification,
                                                          object: nil, queue: .main) { [weak self] _ in self?.later() }
        reconcile()
    }

    func applicationWillTerminate(_ note: Notification) {
        capture?.stop()
        bar?.withdraw()
    }

    private func makePanel() {
        panel.titlebarAppearsTransparent = true
        panel.titleVisibility = .hidden
        for button in [NSWindow.ButtonType.closeButton, .miniaturizeButton, .zoomButton] {
            panel.standardWindowButton(button)?.isHidden = true
        }
        panel.isFloatingPanel = true
        panel.level = .floating
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle]
        panel.hidesOnDeactivate = false
        panel.isMovableByWindowBackground = false     // the picture moves it, its corners resize it
        panel.isReleasedWhenClosed = false
        panel.backgroundColor = .black
        panel.contentMinSize = NSSize(width: Setting.minWidth, height: Setting.minWidth * 9 / 16)
        panel.delegate = self
        picture.resized = { [weak self] in self?.resized() }
        panel.contentView = picture
    }

    // MARK: following the screens

    private func later(_ delay: Double = Setting.settle) {
        pending?.cancel()
        let work = DispatchWorkItem { [weak self] in self?.reconcile() }
        pending = work
        DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: work)
    }

    /// The first other screen goes into the mirror, the mirror sits on the built-in screen.
    /// With the lid closed there is no built-in screen and nothing to do.
    private func reconcile() {
        guard enabled, let home, let other = NSScreen.screens.first(where: { !$0.isBuiltIn }) else {
            problem = nil
            stop()
            publish()
            return
        }
        if capture?.displayID == other.displayID {
            if !home.visibleFrame.intersects(panel.frame) { panel.setFrame(cornerFrame(on: home), display: true) }
            publish()
            return
        }
        stop()
        start(other, on: home)
    }

    private func start(_ other: NSScreen, on home: NSScreen) {
        problem = nil
        board = other.frame.size
        boardPixels = other.pixelWidth
        panel.contentAspectRatio = board
        panel.setFrame(savedFrame(on: home) ?? cornerFrame(on: home), display: false)
        picture.layer?.contents = nil
        panel.orderFrontRegardless()     // before the capture asks, so our window can be left out

        let name = other.localizedName
        let new = Capture(displayID: other.displayID, layer: picture.layer!) { [weak self] error in
            log("lost \(name): \(error.localizedDescription)")
            self?.stop()
            self?.publish()
            self?.later(Setting.retry)
        }
        capture = new
        new.start(size: captureSize()) { [weak self] error in
            guard let self, self.capture === new else { return }
            if let error {
                self.failed(error)
            } else {
                self.shown = name
                log("shows \(name)")
            }
            self.publish()
        }
    }

    private func failed(_ error: Error) {
        log("failed: \(error.localizedDescription)")
        stop()
        if CGPreflightScreenCaptureAccess() {
            problem = "no picture"
        } else {
            problem = "allow Screen Recording"
            if !askedForPermission {
                askedForPermission = true
                CGRequestScreenCaptureAccess()
            }
        }
    }

    private func stop() {
        capture?.stop()
        capture = nil
        shown = ""
        panel.orderOut(nil)
    }

    // MARK: size and place

    private func height(for width: CGFloat) -> CGFloat { (width * board.height / board.width).rounded() }

    private func cornerFrame(on home: NSScreen) -> NSRect {
        let area = home.visibleFrame
        let width = (area.width * Setting.share).rounded()
        let height = height(for: width)
        return NSRect(x: area.maxX - width - Setting.margin, y: area.minY + Setting.margin,
                      width: width, height: height)
    }

    /// The last place, when it is still on the Mac's screen; another board may need another height.
    private func savedFrame(on home: NSScreen) -> NSRect? {
        guard let text = UserDefaults.standard.string(forKey: "frame") else { return nil }
        var rect = NSRectFromString(text)
        guard rect.width >= Setting.minWidth, home.visibleFrame.contains(NSPoint(x: rect.midX, y: rect.midY)) else {
            return nil
        }
        let top = rect.maxY
        rect.size.height = height(for: rect.width)
        rect.origin.y = top - rect.height
        return rect
    }

    /// As many pixels as the window shows, never more than the board has.
    private func captureSize() -> CGSize {
        let wanted = panel.frame.width * (home?.backingScaleFactor ?? 2)
        let width = min(max(wanted, Setting.minPixels), boardPixels)
        let even = { (value: CGFloat) in (value / 2).rounded() * 2 }
        return CGSize(width: even(width), height: even(width * board.height / board.width))
    }

    private func remember() {
        UserDefaults.standard.set(NSStringFromRect(panel.frame), forKey: "frame")
    }

    func windowDidMove(_ note: Notification) {
        if capture != nil { remember() }
    }

    private func resized() {
        remember()
        capture?.resize(captureSize())
    }

    func windowDidEndLiveResize(_ note: Notification) { resized() }

    // MARK: DocBar

    private func publish() {
        var items = [DocBarItem("toggle", "Active", state: enabled),
                     DocBarItem("corner", "Back to the corner"),
                     DocBarItem("login", "Start at login", state: startsAtLogin)]
        if problem != nil { items.append(DocBarItem("settings", "Screen Recording settings")) }
        items.append(DocBarItem("quit", "Quit Spiegel"))
        let status = !enabled ? "off" : problem ?? (shown.isEmpty ? "no second screen" : "shows \(shown)")
        bar?.publish(status: status, items: items, primary: "toggle", alert: problem != nil, toggle: enabled)
    }

    private func clicked(_ item: String) {
        switch item {
        case "toggle":
            enabled.toggle()
            reconcile()
        case "corner":
            if let home, capture != nil {
                panel.setFrame(cornerFrame(on: home), display: true)
                resized()
            }
        case "login":
            if startsAtLogin { try? SMAppService.mainApp.unregister() }
            else { try? SMAppService.mainApp.register() }
        case "settings":
            if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture") {
                NSWorkspace.shared.open(url)
            }
        case "quit":
            NSApp.terminate(nil)
        default:
            break
        }
        publish()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
