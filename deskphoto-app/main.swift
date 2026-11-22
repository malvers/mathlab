// DeskPhoto — lays photos on the real desktop: borderless windows at desktop-icon
// level, so a picture sits above the wallpaper and below every ordinary window.
// Each photo is drawn like a macOS widget (no margin, no shadow, rounded corners,
// straight) and can be dragged, scaled and rotated with the mouse; position and
// size are remembered. An image with transparent pixels is treated as a cut-out:
// nothing is clipped, the wallpaper shows through its own outline. Every picture
// is copied into ~/Library/Application Support/DeskPhoto/images when it is added.
// The photos show only on Doc's LG monitor (found by maker and model, any port) and only while DocHere sees him there;
// without the LG - laptop alone, beamer, board - none shows anywhere and the camera is not asked for (15.11.2026).
// Since 20.11.2026 only while he sits close, too: DocHere's "near" (its threshold is DocHere's user default nearCm).
// Since 22.11.2026 a photo can be cropped like in PowerPoint: right click → "Zuschneiden" shows black crop marks.

import Cocoa
import ServiceManagement

// MARK: - Model

/// The part of the picture that shows, in fractions of the whole picture: x from its left edge, y from its bottom edge
/// (Doc, 22.11.2026: crop like in PowerPoint). A photo without one shows all of its picture.
struct CropRect: Codable, Equatable {
    var x: Double
    var y: Double
    var w: Double
    var h: Double
}

struct PhotoRec: Codable {
    var id: String
    var path: String
    var centerX: Double      // screen coordinates, origin bottom-left of the primary display
    var centerY: Double
    var width: Double        // width of the image itself (of its cropped part, when cropped)
    var angle: Double        // radians, counter-clockwise
    var crop: CropRect? = nil   // nil: the whole picture; older photos.json files have no such key
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

/// Corner radius of a photo: one fixed size for every photo at every size, the one of the system widgets beside them
/// (about 19 pt). It used to grow with the photo (0.056 of its width), and a big photo got big round corners (Doc,
/// 15.11.2026: "dass die Rundungen von der Größe des Bildes abhängen. Nee, machen wir nie. Macht das bitte so, wie
/// die kleinen Rundungen rechts überall."). A very small photo keeps at most a sixth of its shorter side.
private let photoCorner: Double = 19
private func cornerRadius(for size: CGSize) -> CGFloat {
    CGFloat(min(photoCorner, Double(min(size.width, size.height)) / 6))
}

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

// MARK: - Snapping to the other photos

/// A photo being moved or sized snaps to the edges and middles of the other photos when it comes within `reach`, and
/// is free again once it is pulled further (Doc, 15.11.2026: "dass die auf diese Höhe erstmal snappen, nur wenn man sie
/// wirklich rausdrängt. Dass sie dann frei beweglich sind. Nicht so hart, aber so vielleicht wie bei PowerPoint").
/// Every step is worked out from where the mouse alone would put it, so nothing sticks. Rectangles are the photos as
/// they stand on the screen (a turned one by its outline), in screen coordinates. Nothing is ever moved by itself.
enum Snap {
    static let reach: CGFloat = 8
    /// Sideways much softer, and only like with like - left on left, middle on middle, right on right - never a left
    /// edge onto a right one, so photos kept a few pixels apart are not pulled together (Doc, 15.11.2026: "der Snap
    /// nach links und rechts ist zu hart, weil wenn die ein paar Pixel zwischendrin haben, kann man nicht mehr fein
    /// justieren").
    static let reachX: CGFloat = 3

    private static func xs(_ r: NSRect) -> [CGFloat] { [r.minX, r.midX, r.maxX] }
    private static func ys(_ r: NSRect) -> [CGFloat] { [r.minY, r.midY, r.maxY] }

    /// A guide along x = v (vertical) or y = v, over the photo and every other photo with an edge or middle on it.
    private static func guide(vertical: Bool, at v: CGFloat, _ r: NSRect, _ others: [NSRect]) -> NSRect {
        let on = others.filter { o in (vertical ? xs(o) : ys(o)).contains { abs($0 - v) < 0.5 } } + [r]
        let pad: CGFloat = 10
        if vertical {
            let lo = on.map(\.minY).min()! - pad, hi = on.map(\.maxY).max()! + pad
            return NSRect(x: v - 0.5, y: lo, width: 1, height: hi - lo)
        }
        let lo = on.map(\.minX).min()! - pad, hi = on.map(\.maxX).max()! + pad
        return NSRect(x: lo, y: v - 0.5, width: hi - lo, height: 1)
    }

    /// Moving: the shift that lays one of the photo's edges or middles onto another photo's, per axis, and the guides.
    static func move(_ r: NSRect, among others: [NSRect], x: Bool, y: Bool) -> (dx: CGFloat, dy: CGFloat, guides: [NSRect]) {
        func best(_ pairs: [(CGFloat, CGFloat)], within limit: CGFloat) -> CGFloat? {
            var d: CGFloat? = nil
            for (a, b) in pairs where abs(b - a) <= limit && abs(b - a) < abs(d ?? .infinity) { d = b - a }
            return d
        }
        let sameKind = others.flatMap { o in zip(xs(r), xs(o)).map { ($0, $1) } }          // left-left, mid-mid, right-right
        let anyKind = others.flatMap { o in ys(r).flatMap { a in ys(o).map { (a, $0) } } }
        let dx = x ? best(sameKind, within: reachX) : nil
        let dy = y ? best(anyKind, within: reach) : nil
        let moved = r.offsetBy(dx: dx ?? 0, dy: dy ?? 0)
        var lines: [NSRect] = []
        if dx != nil, let v = xs(moved).enumerated().first(where: { i, a in others.contains { abs(xs($0)[i] - a) < 0.5 } })?.element {
            lines.append(guide(vertical: true, at: v, moved, others))
        }
        if dy != nil, let v = ys(moved).first(where: { a in others.flatMap(ys).contains { abs($0 - a) < 0.5 } }) {
            lines.append(guide(vertical: false, at: v, moved, others))
        }
        return (dx ?? 0, dy ?? 0, lines)
    }

    /// Sizing a straight photo of width `w` (shape kept: height w / aspect). With `anchor` the opposite corner stays and
    /// the corner (sx, sy) moves; without, it grows about `centre`. Returns the width whose moving edge lies on another
    /// photo's edge or middle, if one is within reach, and its guide.
    static func size(width w: CGFloat, aspect: CGFloat, anchor: NSPoint?, corner sx: CGFloat, _ sy: CGFloat,
                     centre: NSPoint, among others: [NSRect]) -> (width: CGFloat, guides: [NSRect]) {
        var bestW = w, bestD = reach + 1, line: (Bool, CGFloat)? = nil
        // a moving side edge only onto the same edge of another photo, and only within reachX (see reachX)
        let sides = anchor != nil ? others.map { sx > 0 ? $0.maxX : $0.minX } : others.flatMap { [$0.minX, $0.maxX] }
        for b in sides {
            let nw = anchor.map { (b - $0.x) / sx } ?? 2 * abs(b - centre.x)
            let d = anchor == nil ? abs(nw - w) / 2 : abs(nw - w)          // how far the moving edge has to go
            if nw >= 90, nw <= 2400, d <= reachX, d < bestD { bestW = nw; bestD = d; line = (true, b) }
        }
        for b in others.flatMap(ys) {
            let nh = anchor.map { (b - $0.y) / sy } ?? 2 * abs(b - centre.y)
            let d = anchor == nil ? abs(nh - w / aspect) / 2 : abs(nh - w / aspect)
            if nh * aspect >= 90, nh * aspect <= 2400, d < bestD { bestW = nh * aspect; bestD = d; line = (false, b) }
        }
        guard bestD <= reach, let (vertical, v) = line else { return (w, []) }
        let h = bestW / aspect
        let r: NSRect
        if let a = anchor {
            r = NSRect(x: min(a.x, a.x + sx * bestW), y: min(a.y, a.y + sy * h), width: bestW, height: h)
        } else {
            r = NSRect(x: centre.x - bestW / 2, y: centre.y - h / 2, width: bestW, height: h)
        }
        return (bestW, [guide(vertical: vertical, at: v, r, others)])
    }
}

/// The thin guide lines while a photo has snapped, in the palette's λ orange, just above the photos and still below
/// every ordinary window; they never take a click.
final class Guides {
    static let shared = Guides()
    private var lines: [NSPanel] = []

    func show(_ rects: [NSRect]) {
        while lines.count < rects.count {
            let p = NSPanel(contentRect: .zero, styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
            p.isOpaque = false
            p.backgroundColor = NSColor(srgbRed: 245 / 255, green: 194 / 255, blue: 66 / 255, alpha: 0.95)
            p.hasShadow = false
            p.ignoresMouseEvents = true
            p.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopIconWindow)) + 2)
            p.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle, .fullScreenNone]
            lines.append(p)
        }
        for (i, p) in lines.enumerated() {
            if i < rects.count { p.setFrame(rects[i], display: true); p.orderFront(nil) } else { p.orderOut(nil) }
        }
    }

    func hide() { lines.forEach { $0.orderOut(nil) } }
}

/// The group box (Doc, 21.11.2026: several selected prints resize together, "as if grouped"): while two or more prints
/// are selected, a dashed φ-green frame around all of them with a grip at each corner. A grip scales the whole group
/// from the opposite corner (control: about its middle), just like a grip on one of the selected prints. Only the grips
/// take a click; the frame's transparent inside lets every click through to the prints below.
final class GroupFrame {
    private let panel: NSPanel
    private let view = GroupFrameView(frame: .zero)
    static let margin: CGFloat = 12     // between the prints' outline and the dashed line, outside their green rings
    static let pad: CGFloat = 10        // room for the grips around the line

    init(owner: AppDelegate) {
        panel = NSPanel(contentRect: .zero, styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false
        panel.hidesOnDeactivate = false
        panel.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopIconWindow)) + 2)   // above the prints
        panel.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle, .fullScreenNone]
        view.owner = owner
        panel.contentView = view
    }

    var window: NSWindow { panel }

    /// `outline`: the union of the selected prints' outlines in screen coordinates; nil hides the frame.
    func show(_ outline: NSRect?) {
        guard let r = outline else { if panel.isVisible { panel.orderOut(nil) }; return }
        let line = r.insetBy(dx: -GroupFrame.margin, dy: -GroupFrame.margin)
        let f = line.insetBy(dx: -GroupFrame.pad, dy: -GroupFrame.pad)
        panel.setFrame(f, display: false)
        view.frame = NSRect(origin: .zero, size: f.size)
        view.line = NSRect(x: GroupFrame.pad, y: GroupFrame.pad, width: line.width, height: line.height)
        view.needsDisplay = true
        if !panel.isVisible { panel.orderFront(nil) }
    }
}

final class GroupFrameView: NSView {
    weak var owner: AppDelegate?
    var line: NSRect = .zero                     // the dashed frame, in this view's coordinates
    private let gripRadius: CGFloat = 5.5
    private let grab: CGFloat = 14               // distance around a grip that counts as grabbing it
    private var scaling = false

    var corners: [NSPoint] {
        [NSPoint(x: line.minX, y: line.minY), NSPoint(x: line.maxX, y: line.minY),
         NSPoint(x: line.maxX, y: line.maxY), NSPoint(x: line.minX, y: line.maxY)]
    }

    private func corner(at p: NSPoint) -> NSPoint? { corners.first { hypot($0.x - p.x, $0.y - p.y) <= grab } }

    override func draw(_ dirtyRect: NSRect) {
        let frame = NSBezierPath(rect: line)
        frame.lineWidth = 1.5
        frame.setLineDash([6, 4], count: 2, phase: 0)
        PhotoView.phi.setStroke()
        frame.stroke()
        for c in corners {
            let dot = NSBezierPath(ovalIn: NSRect(x: c.x - gripRadius, y: c.y - gripRadius, width: gripRadius * 2, height: gripRadius * 2))
            NSColor.white.setFill()
            dot.fill()
            dot.lineWidth = 1.5
            dot.stroke()
        }
    }

    override func hitTest(_ point: NSPoint) -> NSView? {
        let p = superview.map { convert(point, from: $0) } ?? point
        return corner(at: p) != nil ? self : nil
    }

    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    override func mouseDown(with event: NSEvent) {
        guard let c = corner(at: convert(event.locationInWindow, from: nil)) else { return }
        let towards = NSPoint(x: c.x > line.midX ? 1 : -1, y: c.y > line.midY ? 1 : -1)
        owner?.beginChange()
        scaling = owner?.beginGroupScale(towards: towards, mouse: NSEvent.mouseLocation) ?? false
        if scaling { NSCursor.crosshair.set() }
    }

    override func mouseDragged(with event: NSEvent) {
        guard scaling else { return }
        owner?.groupScale(to: NSEvent.mouseLocation, aboutMiddle: event.modifierFlags.contains(.control))
    }

    override func mouseUp(with event: NSEvent) {
        if scaling { owner?.endGroupScale() }
        scaling = false
        owner?.endChange()
        NSCursor.arrow.set()
    }
}

// MARK: - The view that draws one print

final class PhotoView: NSView {
    var paperSize: CGSize = .zero
    var angle: Double = 0
    private var rounded = false           // photo with widget corners; a cut-out keeps its own outline

    private let paper = CALayer()
    private let photo = CALayer()         // the visible part: clips the picture to the cut, with the widget corners
    private let picture = CALayer()       // the whole picture inside `photo`, shifted so the cut shows
    private var handles: [CALayer] = []

    /// Cropping (Doc, 22.11.2026: "dass die Bilder ... auch gekroppt werden können ... wie bei PowerPoint dann so
    /// Crop-Ecken"). While on, the whole picture shows faded around the cut (`ghost`), black crop marks sit on the cut's
    /// corners and edges (`cropMarks`): a mark moves its edge(s), a drag on the picture slides it under the cut, control
    /// moves the opposite edge too. Return, Esc, a double click or a click elsewhere ends it (AppDelegate.endCrop).
    var crop = CGRect(x: 0, y: 0, width: 1, height: 1)   // set by PhotoItem.apply, see CropRect
    private(set) var cropping = false
    private let ghost = CALayer()
    private let cropMarks = CAShapeLayer()
    private let cropGrab: Double = 16             // distance around a crop mark that counts as grabbing it
    private let cropMin: Double = 30              // the cut never gets narrower or lower than this, in points
    private var cropStart = CGRect.zero           // the cut at mouse down
    private var cropFull = CGSize.zero            // the whole picture's size on the screen at mouse down
    private var cropImageOrigin = NSPoint.zero    // its bottom-left corner on the screen at mouse down
    private var cropEdge = (x: 0, y: 0)           // the edges a crop mark moves: -1 left/bottom, 1 right/top, 0 none

    weak var item: PhotoItem?

    /// Distance in points around a corner that counts as grabbing the handle.
    private let handleGrab: Double = 22
    private let handleRadius: CGFloat = 5.5

    private enum Mode { case none, move, transform, cropEdge, cropPan }
    private var mode: Mode = .none
    private var dragged = false           // set as soon as the mouse really moves

    private var startMouse: NSPoint = .zero       // screen coordinates
    private var startOrigin: NSPoint = .zero
    private var startCenter: NSPoint = .zero      // screen coordinates, fixed while transforming
    private var startWidth: Double = 0
    private var startAngle: Double = 0
    private var startVector: Double = 0           // angle of centre → mouse at grab time
    private var startDistance: Double = 1
    private var corner = NSPoint(x: 1, y: 1)       // the grabbed corner in the paper's frame: (±1, ±1)
    private var anchor: NSPoint = .zero           // screen coordinates of the opposite corner, fixed while scaling

    private var selected = false
    var isSelected: Bool { selected }

    /// Several prints can be selected and moved together (Doc, 20.11.2026: shift + click adds a print, a drag moves
    /// every selected one by the same distance). Set at mouse down, used until mouse up.
    private var group: [(item: PhotoItem, origin: NSPoint)] = []
    private var wasSelected = false               // the print was selected before this mouse down
    private var shiftClick = false                // shift was held at mouse down

    /// The selection's mark: a ring in Doc's φ green (rgb 121, 158, 49) with a soft glow around the print, so a
    /// selected print stands out among the others; the corner grips carry the same green.
    private let ring = CALayer()
    static let phi = NSColor(srgbRed: 121 / 255, green: 158 / 255, blue: 49 / 255, alpha: 1)
    private var groupScaling = false              // a grip of a print in a selection of several scales the whole group

    override init(frame: NSRect) {
        super.init(frame: frame)
        wantsLayer = true
        layer?.backgroundColor = NSColor.clear.cgColor

        // The paper layer only carries the photo and its grips, so both turn together;
        // it draws nothing itself.
        paper.backgroundColor = nil
        paper.masksToBounds = false

        photo.masksToBounds = true
        photo.cornerCurve = .continuous     // the squircle of the system widgets
        picture.contentsGravity = .resize   // its frame always has the picture's own shape
        photo.addSublayer(picture)
        paper.addSublayer(photo)

        // The whole picture, faded, under the cut while cropping
        ghost.contentsGravity = .resize
        ghost.borderColor = NSColor.white.cgColor
        ghost.borderWidth = 1
        ghost.opacity = 0
        paper.insertSublayer(ghost, below: photo)

        // The selection ring, just outside the photo, turning with it; it lies under the photo, so its glow shines
        // outwards only and never tints the picture
        ring.backgroundColor = nil
        ring.borderColor = PhotoView.phi.cgColor
        ring.borderWidth = 3
        ring.cornerCurve = .continuous
        ring.shadowColor = PhotoView.phi.cgColor
        ring.shadowOpacity = 0.85
        ring.shadowRadius = 7
        ring.shadowOffset = .zero
        ring.opacity = 0
        paper.insertSublayer(ring, below: photo)

        // Corner grips, sitting inside the paper layer so they turn along with the photo.
        for _ in 0..<4 {
            let h = CALayer()
            h.backgroundColor = NSColor.white.cgColor
            h.borderColor = PhotoView.phi.cgColor
            h.borderWidth = 1.5
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

        // PowerPoint's crop marks: black, with a thin white edge so they show on any picture
        cropMarks.fillColor = NSColor.black.cgColor
        cropMarks.strokeColor = NSColor.white.cgColor
        cropMarks.lineWidth = 1
        cropMarks.lineJoin = .miter
        cropMarks.opacity = 0
        paper.addSublayer(cropMarks)

        layer?.addSublayer(paper)
    }

    required init?(coder: NSCoder) { fatalError() }

    /// A photo looks like the widgets beside it: no white margin, no shadow, rounded
    /// corners (Doc, 10.11.2026: "nicht, dass das so einen weißen Rand kriegt ... mit so
    /// runden Ecken"). A cut-out is not clipped, it sits on the wallpaper as its own outline.
    func setImage(_ image: CGImage, borderless: Bool) {
        picture.contents = image
        ghost.contents = image
        rounded = !borderless
    }

    /// Crop mode on or off; PhotoItem.setCropping lays the window out for it afterwards.
    func setCropping(_ on: Bool) {
        cropping = on
        mode = .none
        updateMarks()
    }

    /// The whole picture in the paper's turned frame, measured from the middle of the cut.
    private var fullRect: CGRect {
        let fw = paperSize.width / max(crop.width, 1e-6), fh = paperSize.height / max(crop.height, 1e-6)
        return CGRect(x: -paperSize.width / 2 - crop.minX * fw, y: -paperSize.height / 2 - crop.minY * fh,
                      width: fw, height: fh)
    }

    /// The black marks on the cut of size `s`: an L in each corner and a bar in the middle of each edge, inside the cut.
    private func cropMarkPath(_ s: CGSize) -> CGPath {
        let p = CGMutablePath()
        let len = min(18, s.width / 3, s.height / 3), t = min(4.5, len / 2)
        let corners: [(CGFloat, CGFloat)] = [(0, 0), (s.width, 0), (s.width, s.height), (0, s.height)]
        for (cx, cy) in corners {
            let dx: CGFloat = cx == 0 ? 1 : -1, dy: CGFloat = cy == 0 ? 1 : -1
            p.addLines(between: [CGPoint(x: cx, y: cy), CGPoint(x: cx + dx * len, y: cy),
                                 CGPoint(x: cx + dx * len, y: cy + dy * t), CGPoint(x: cx + dx * t, y: cy + dy * t),
                                 CGPoint(x: cx + dx * t, y: cy + dy * len), CGPoint(x: cx, y: cy + dy * len)])
            p.closeSubpath()
        }
        p.addRect(CGRect(x: s.width / 2 - len / 2, y: 0, width: len, height: t))
        p.addRect(CGRect(x: s.width / 2 - len / 2, y: s.height - t, width: len, height: t))
        p.addRect(CGRect(x: 0, y: s.height / 2 - len / 2, width: t, height: len))
        p.addRect(CGRect(x: s.width - t, y: s.height / 2 - len / 2, width: t, height: len))
        return p
    }

    /// Ring and grips while selected, crop marks and the faded picture while cropping.
    private func updateMarks() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        let grips = selected && !cropping
        for h in handles { h.opacity = grips ? 1 : 0 }
        ring.opacity = grips ? 1 : 0
        cropMarks.opacity = cropping ? 1 : 0
        ghost.opacity = cropping ? 0.4 : 0
        photo.cornerRadius = rounded && !cropping ? cornerRadius(for: paperSize) : 0
        CATransaction.commit()
    }

    /// Re-lays the print for the current window size; called after every scale or rotate.
    func relayout() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        paper.bounds = CGRect(origin: .zero, size: paperSize)
        paper.position = CGPoint(x: bounds.midX, y: bounds.midY)
        paper.transform = CATransform3DMakeRotation(CGFloat(angle), 0, 0, 1)
        photo.frame = paper.bounds
        photo.cornerRadius = rounded && !cropping ? cornerRadius(for: paperSize) : 0   // a plain rectangle while cropping
        // the whole picture, in the paper's (= photo's) coordinates, shifted so that the cut lies on the paper
        let full = fullRect.offsetBy(dx: paperSize.width / 2, dy: paperSize.height / 2)
        picture.frame = full
        ghost.frame = full
        cropMarks.frame = paper.bounds
        cropMarks.path = cropMarkPath(paperSize)
        ring.frame = paper.bounds.insetBy(dx: -3, dy: -3)
        ring.cornerRadius = (rounded ? cornerRadius(for: paperSize) : 0) + 3
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
    /// Selected: the green ring and the grips.
    func showHandles(_ on: Bool) {
        guard on != selected else { return }
        selected = on
        updateMarks()
        item?.owner?.refreshGroupFrame()
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
        if cropping { return fullRect.insetBy(dx: -slack, dy: -slack).contains(p) }   // the faded part takes clicks too
        return abs(p.x) <= Double(paperSize.width) / 2 + slack
            && abs(p.y) <= Double(paperSize.height) / 2 + slack
    }

    /// The crop mark at `p` (paper frame, from the cut's middle) as the edges it moves: a corner, an edge's bar, or
    /// anywhere along an edge. nil: no mark there.
    private func cropHandle(at p: NSPoint) -> (x: Int, y: Int)? {
        let hw = Double(paperSize.width) / 2, hh = Double(paperSize.height) / 2
        let px = Double(p.x), py = Double(p.y)
        let spots: [(x: Int, y: Int)] = [(-1, -1), (1, -1), (1, 1), (-1, 1), (0, -1), (1, 0), (0, 1), (-1, 0)]
        for s in spots where hypot(px - Double(s.x) * hw, py - Double(s.y) * hh) <= cropGrab { return s }
        if abs(abs(px) - hw) <= 6, abs(py) <= hh { return (px < 0 ? -1 : 1, 0) }
        if abs(abs(py) - hh) <= 6, abs(px) <= hw { return (0, py < 0 ? -1 : 1) }
        return nil
    }

    /// Moves one edge of the cut along one axis by `d` (fractions of the picture, + right/up): `edge` -1 is the low
    /// edge, 1 the high one; `both` moves the opposite edge the other way. The cut stays inside the picture and at
    /// least `m` wide.
    private static func moveEdge(_ lo: Double, _ hi: Double, edge e: Int, by d: Double, both: Bool, min m: Double) -> (Double, Double) {
        var inward = e < 0 ? d : -d                                   // how far the edge goes into the cut
        let out = min(e < 0 ? lo : 1 - hi, both ? (e < 0 ? 1 - hi : lo) : .infinity)
        let inMax = max(0, both ? (hi - lo - m) / 2 : hi - lo - m)
        inward = min(max(inward, -out), inMax)
        var nlo = lo, nhi = hi
        if e < 0 || both { nlo += inward }
        if e > 0 || both { nhi -= inward }
        return (nlo, nhi)
    }

    private func cropMouseDown(_ event: NSEvent) {
        guard let win = window, let item = item else { return }
        if event.clickCount == 2 { item.owner?.endCrop(); return }
        item.owner?.beginChange()
        dragged = false
        startMouse = NSEvent.mouseLocation
        startCenter = NSPoint(x: win.frame.midX, y: win.frame.midY)
        cropStart = crop
        let full = fullRect
        cropFull = full.size
        cropImageOrigin = onScreen(startCenter, Double(full.minX), Double(full.minY))
        let p = paperLocal(convert(event.locationInWindow, from: nil))
        if let e = cropHandle(at: p) {
            cropEdge = e
            mode = .cropEdge
            NSCursor.crosshair.set()
        } else if full.contains(p) {
            mode = .cropPan                 // as in PowerPoint: the picture slides under the cut, the cut stays
            NSCursor.closedHand.set()
        } else {
            mode = .none
        }
    }

    private func cropDrag(to now: NSPoint, both: Bool) {
        guard let item = item else { return }
        let sx = Double(now.x - startMouse.x), sy = Double(now.y - startMouse.y)
        let ca = cos(-angle), sa = sin(-angle)
        let fw = Double(cropFull.width), fh = Double(cropFull.height)
        let du = (sx * ca - sy * sa) / fw, dv = (sx * sa + sy * ca) / fh   // the mouse in fractions of the picture
        var x0 = Double(cropStart.minX), x1 = Double(cropStart.maxX)
        var y0 = Double(cropStart.minY), y1 = Double(cropStart.maxY)
        if mode == .cropPan {
            let w = x1 - x0, h = y1 - y0
            x0 = min(max(x0 - du, 0), 1 - w)
            y0 = min(max(y0 - dv, 0), 1 - h)
            item.setCrop(CGRect(x: x0, y: y0, width: w, height: h), width: item.rec.width, center: startCenter)
            return
        }
        if cropEdge.x != 0 { (x0, x1) = PhotoView.moveEdge(x0, x1, edge: cropEdge.x, by: du, both: both, min: cropMin / fw) }
        if cropEdge.y != 0 { (y0, y1) = PhotoView.moveEdge(y0, y1, edge: cropEdge.y, by: dv, both: both, min: cropMin / fh) }
        // the picture stays where it lies; the cut's middle moves with its edges
        let centre = onScreen(cropImageOrigin, (x0 + x1) / 2 * fw, (y0 + y1) / 2 * fh)
        item.setCrop(CGRect(x: x0, y: y0, width: x1 - x0, height: y1 - y0), width: (x1 - x0) * fw, center: centre)
    }

    /// The point `(x, y)` away from `origin` in the paper's turned frame, in screen coordinates.
    private func onScreen(_ origin: NSPoint, _ x: Double, _ y: Double, angle a: Double? = nil) -> NSPoint {
        let t = a ?? angle, ca = cos(t), sa = sin(t)
        return NSPoint(x: Double(origin.x) + x * ca - y * sa, y: Double(origin.y) + x * sa + y * ca)
    }

    // MARK: mouse

    /// The first click on a print whose panel does not have the keys counts as a click, not only as taking the keys:
    /// before, the click on another print only cleared the old selection and a second click selected it (Doc,
    /// 20.11.2026: "mit demselben Klick").
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    /// Selecting, as in PowerPoint (Doc, 20.11.2026): a click selects exactly this print, at once, and a drag moves
    /// it; shift + click adds it to the selection or, when it was selected, takes it out again; a drag on a selected
    /// print moves every selected print by the same distance (shift while dragging keeps the height, as before). A
    /// click that moved nothing on the only selected print puts its grips away, as before. A click anywhere else
    /// clears the selection (AppDelegate.clearSelection).
    override func mouseDown(with event: NSEvent) {
        if cropping { cropMouseDown(event); return }
        if event.clickCount == 2 { item?.openOriginal(); return }
        guard let win = window, let item = item else { return }
        item.owner?.beginChange()      // whatever this drag changes, ⌘Z takes back in one step

        dragged = false
        startMouse = NSEvent.mouseLocation
        startOrigin = win.frame.origin
        startCenter = NSPoint(x: win.frame.midX, y: win.frame.midY)
        wasSelected = selected
        shiftClick = event.modifierFlags.contains(.shift)
        if !wasSelected {
            if shiftClick { showHandles(true) } else { item.owner?.selectOnly(item) }
        }
        group = []
        groupScaling = false

        if isOnHandle(event) {
            mode = .transform
            startWidth = item.rec.width
            startAngle = angle
            let dx = Double(startMouse.x - startCenter.x)
            let dy = Double(startMouse.y - startCenter.y)
            startVector = atan2(dy, dx)
            startDistance = max(8, hypot(dx, dy))
            let local = paperLocal(convert(event.locationInWindow, from: nil))
            corner = NSPoint(x: local.x >= 0 ? 1 : -1, y: local.y >= 0 ? 1 : -1)
            anchor = onScreen(startCenter, -Double(corner.x) * Double(paperSize.width) / 2,
                              -Double(corner.y) * Double(paperSize.height) / 2)
            // one of several selected prints: its grip scales the whole group from the group's opposite corner
            let towards = NSPoint(x: startMouse.x >= startCenter.x ? 1 : -1, y: startMouse.y >= startCenter.y ? 1 : -1)
            groupScaling = item.owner?.beginGroupScale(from: item, towards: towards, mouse: startMouse) ?? false
            NSCursor.crosshair.set()
        } else {
            mode = .move
            // every selected print moves along, each from where it lies now
            let selection = item.owner?.selectedItems() ?? []
            group = (selection.contains { $0 === item } ? selection : [item]).map { ($0, $0.window.frame.origin) }
            NSCursor.closedHand.set()
        }
    }

    override func mouseDragged(with event: NSEvent) {
        let now = NSEvent.mouseLocation
        if hypot(now.x - startMouse.x, now.y - startMouse.y) > 2 { dragged = true }
        let mods = event.modifierFlags
        switch mode {
        case .move:
            // shift: only sideways, the height stays exactly (Doc, 15.11.2026: "wenn ich das Bild bewege und Shift
            // gedrückt habe, soll es bitte in Y gleich bleiben")
            // The grabbed print snaps to the prints that stay; the others of the selection follow it by the same distance.
            guard let win = window else { break }
            let dx = now.x - startMouse.x, dy = mods.contains(.shift) ? 0 : now.y - startMouse.y
            let moving = group.map { $0.item }
            let snap = Snap.move(NSRect(origin: NSPoint(x: startOrigin.x + dx, y: startOrigin.y + dy), size: win.frame.size)
                                    .insetBy(dx: shadowPad, dy: shadowPad),
                                 among: item?.owner?.photoRects(except: moving) ?? [], x: true, y: !mods.contains(.shift))
            for g in group {
                g.item.window.setFrameOrigin(NSPoint(x: g.origin.x + dx + snap.dx, y: g.origin.y + dy + snap.dy))
            }
            Guides.shared.show(snap.guides)
            item?.owner?.refreshGroupFrame()
        case .transform where groupScaling && !mods.contains(.option):
            // several selected: all of them scale as one group (AppDelegate.groupScale); option still turns this one
            Guides.shared.hide()
            item?.owner?.groupScale(to: now, aboutMiddle: mods.contains(.control))
        case .transform:
            // A corner scales the print from the opposite corner, which stays where it is; control scales it about its
            // middle instead; option turns it about its middle, the size kept. The shape always stays (Doc, 15.11.2026:
            // "nicht zentral gezoomt ..., sondern wirklich pro Ecke. Und nur wenn ich noch die Control-Taste gedrückt
            // halte, dann soll es sozusagen zentral zoomen").
            let dx = Double(now.x - startCenter.x)
            let dy = Double(now.y - startCenter.y)
            let others = item.map { $0.owner?.photoRects(except: [$0]) ?? [] } ?? []
            let straight = abs(startAngle) < 0.001                    // a turned photo sizes freely, without snapping
            let aspectNow = paperSize.height > 0 ? paperSize.width / paperSize.height : 1
            if mods.contains(.option) {
                Guides.shared.hide()
                item?.setTransform(width: startWidth, angle: startAngle + (atan2(dy, dx) - startVector))
            } else if mods.contains(.control) {
                var width = CGFloat(startWidth * max(8, hypot(dx, dy)) / startDistance)
                var lines: [NSRect] = []
                if straight {
                    (width, lines) = Snap.size(width: width, aspect: aspectNow, anchor: nil, corner: corner.x, corner.y,
                                               centre: startCenter, among: others)
                }
                Guides.shared.show(lines)
                item?.setTransform(width: Double(width), angle: startAngle)
            } else {
                // the mouse seen from the fixed corner, in the paper's frame, projected onto the diagonal
                let ax = Double(now.x - anchor.x), ay = Double(now.y - anchor.y)
                let ca = cos(-startAngle), sa = sin(-startAngle)
                let lx = ax * ca - ay * sa, ly = ax * sa + ay * ca
                let aspect = paperSize.height > 0 ? Double(paperSize.width / paperSize.height) : 1
                let w = (Double(corner.x) * lx + Double(corner.y) * ly / aspect) / (1 + 1 / (aspect * aspect))
                var width = min(2400, max(90, w))
                var lines: [NSRect] = []
                if straight {
                    let snapped = Snap.size(width: CGFloat(width), aspect: CGFloat(aspect), anchor: anchor,
                                            corner: corner.x, corner.y, centre: startCenter, among: others)
                    width = Double(snapped.width)
                    lines = snapped.guides
                }
                Guides.shared.show(lines)
                let centre = onScreen(anchor, Double(corner.x) * width / 2, Double(corner.y) * width / aspect / 2,
                                      angle: startAngle)
                item?.setTransform(width: width, angle: startAngle, center: centre)
            }
        case .cropEdge, .cropPan:
            cropDrag(to: now, both: mods.contains(.control))
        case .none:
            break
        }
    }

    override func mouseUp(with event: NSEvent) {
        if cropping {
            mode = .none
            dragged = false
            NSCursor.arrow.set()
            item?.commit()
            item?.owner?.endChange()
            return
        }
        // A click that moved nothing: with shift it takes a print that was selected out of the selection; without, on
        // a selected print, it leaves only this one selected - or, when it was the only one, puts its grips away, so
        // the same print takes them back (clicking the wallpaper instead would reveal the desktop).
        if !dragged && event.clickCount == 1, wasSelected, let item = item {
            if shiftClick {
                showHandles(false)
            } else if (item.owner?.selectedItems().count ?? 1) > 1 {
                item.owner?.selectOnly(item)
            } else {
                showHandles(false)
            }
        }
        mode = .none
        dragged = false
        Guides.shared.hide()
        NSCursor.arrow.set()
        if groupScaling {
            groupScaling = false
            item?.owner?.endGroupScale()
        } else if group.isEmpty {
            item?.commit()
        } else {
            group.forEach { $0.item.commit() }
        }
        group = []
        item?.owner?.endChange()
    }

    /// Option + scrolling turns the print. Scrolling alone no longer zooms - the size changes only at the corners (Doc,
    /// 15.11.2026: "den Zoom mit dem Wheel rausnehmen") - and goes on to whatever lies behind, unswallowed.
    override func scrollWheel(with event: NSEvent) {
        guard let item = item, event.modifierFlags.contains(.option) else { super.scrollWheel(with: event); return }
        item.owner?.wheelTurn(item, by: Double(event.scrollingDeltaY) * 0.004)
    }

    /// The menu acts on every selected print; a right click on a print that is not selected selects just that one.
    override func rightMouseDown(with event: NSEvent) { item.map { $0.owner?.showMenu(for: $0, at: event) } }

    /// ⌘Z takes back the last change - a drag, a corner, the arrow keys or a menu command (AppDelegate.undo).
    override func performKeyEquivalent(with event: NSEvent) -> Bool {
        let m = event.modifierFlags.intersection([.command, .shift, .option, .control])
        if m == .command, event.charactersIgnoringModifiers?.lowercased() == "z", let owner = item?.owner {
            owner.undo()
            return true
        }
        return super.performKeyEquivalent(with: event)
    }

    // MARK: keys

    /// The arrow keys move the selected print by a point, with shift by ten, as in PowerPoint and Keynote - no
    /// snapping, saved like a drag (Doc, 15.11.2026: "wenn das Bild selektiert ist, möchte ich das auch mit den
    /// Pfeiltasten pixelgenau positionieren können"). Only while a print has the keys - after a click on it; any other
    /// app's typing never comes here.
    override var acceptsFirstResponder: Bool { true }
    override var needsPanelToBecomeKey: Bool { true }

    /// With several prints selected, the arrow keys move all of them.
    override func keyDown(with event: NSEvent) {
        // Return, Enter or Esc ends cropping
        if cropping, [36, 76, 53].contains(event.keyCode) { item?.owner?.endCrop(); return }
        guard selected, let item = item else { return }
        let step: CGFloat = event.modifierFlags.contains(.shift) ? 10 : 1
        var d = NSPoint.zero
        switch event.keyCode {
        case 123: d.x = -step       // left
        case 124: d.x = step        // right
        case 125: d.y = -step       // down
        case 126: d.y = step        // up
        default: return
        }
        item.owner?.beginChange()
        for it in item.owner?.selectedItems() ?? [item] {
            let o = it.window.frame.origin
            it.window.setFrameOrigin(NSPoint(x: o.x + d.x, y: o.y + d.y))
            it.commit()
        }
        item.owner?.endChange()
    }
}

// MARK: - One photo: window + view + record

/// A borderless panel cannot take the keyboard by itself; a print's must, for the arrow keys. It stays a non-activating
/// panel: a click on a print gives it the keys without bringing DocPhoto to the front, a click elsewhere takes them back.
final class PhotoPanel: NSPanel {
    override var canBecomeKey: Bool { true }
}


final class PhotoItem {
    private(set) var rec: PhotoRec
    let window: NSPanel
    private let view: PhotoView
    private let imageAspect: Double       // width / height of the whole picture
    /// width / height of what shows: the cropped part, or the whole picture
    private var aspect: Double { imageAspect * Double(crop.width) / Double(max(crop.height, 1e-6)) }
    let borderless: Bool                  // cut-out, drawn unclipped, see hasTransparency
    weak var owner: AppDelegate?
    /// Centre of the window while the print lies somewhere else for the moment, because its own place (rec) is on
    /// a screen that is not connected right now - a monitor unplugged, only the laptop, a beamer instead.
    /// nil: it lies at its own place. Never saved; see place(home:shift:nudge:).
    private var stand: NSPoint? = nil
    /// How far the LG lies from where it lay when the places were recorded (another screen arrangement, e.g. the LG
    /// alone as the main screen): every print moves with it, so it keeps its place on the LG. Never saved.
    private var shift = NSPoint.zero

    init?(rec: PhotoRec, owner: AppDelegate, visible: Bool = true) {
        guard let image = NSImage(contentsOfFile: rec.path),
              let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil),
              cg.height > 0 else { return nil }

        self.rec = rec
        self.owner = owner
        self.imageAspect = Double(cg.width) / Double(cg.height)
        self.borderless = hasTransparency(cg)

        let panel = PhotoPanel(contentRect: NSRect(x: 0, y: 0, width: 10, height: 10),
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
        if visible { panel.orderFront(nil) }
    }

    /// Rebuilds the window geometry from the record, keeping the photo centred (at `centre` while a corner drags it).
    private func apply(at centre: NSPoint? = nil) {
        let w = rec.width
        let paper = CGSize(width: w, height: w / aspect)

        let ca = abs(cos(rec.angle)), sa = abs(sin(rec.angle))
        var boxW = Double(paper.width) * ca + Double(paper.height) * sa
        var boxH = Double(paper.width) * sa + Double(paper.height) * ca
        let cut = crop
        if view.cropping {
            // while cropping the whole picture shows around the cut: the window takes all of it in, still centred on
            // the cut, so the cut's middle stays the window's middle as always
            let fw = Double(paper.width) / Double(cut.width), fh = Double(paper.height) / Double(cut.height)
            let x0 = -Double(paper.width) / 2 - Double(cut.minX) * fw, y0 = -Double(paper.height) / 2 - Double(cut.minY) * fh
            let ct = cos(rec.angle), st = sin(rec.angle)
            var hx = 0.0, hy = 0.0
            for (x, y) in [(x0, y0), (x0 + fw, y0), (x0, y0 + fh), (x0 + fw, y0 + fh)] {
                hx = max(hx, abs(x * ct - y * st))
                hy = max(hy, abs(x * st + y * ct))
            }
            boxW = 2 * hx
            boxH = 2 * hy
        }

        let winW = boxW + 2 * shadowPad
        let winH = boxH + 2 * shadowPad
        let c = centre ?? stand ?? NSPoint(x: rec.centerX + Double(shift.x), y: rec.centerY + Double(shift.y))   // a stand-in place stays while it lasts
        window.setFrame(NSRect(x: Double(c.x) - winW / 2, y: Double(c.y) - winH / 2,
                               width: winW, height: winH), display: true)

        view.frame = NSRect(origin: .zero, size: CGSize(width: winW, height: winH))
        view.crop = cut
        view.paperSize = paper
        view.angle = rec.angle
        view.relayout()
    }

    /// Sets size and angle in one go, keeping the print centred where it lies - or around `center` (screen
    /// coordinates; a corner drag keeps the opposite corner still). commit() writes the place afterwards.
    func setTransform(width: Double, angle: Double, center: NSPoint? = nil) {
        rec.width = min(2400, max(90, width))
        rec.angle = angle
        if let c = center { stand = nil; apply(at: c) } else { apply(at: NSPoint(x: window.frame.midX, y: window.frame.midY)) }
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

    var isSelected: Bool { view.isSelected }

    // MARK: cropping (see PhotoView.cropping; AppDelegate.startCrop / endCrop)

    /// The part of the picture that shows, in fractions of it (see CropRect); the whole picture when not cropped.
    var crop: CGRect {
        rec.crop.map { CGRect(x: $0.x, y: $0.y, width: $0.w, height: $0.h) } ?? CGRect(x: 0, y: 0, width: 1, height: 1)
    }

    var isCropped: Bool { rec.crop != nil }

    /// Crop mode on or off. On, the print takes the keys, so Return or Esc can end it.
    func setCropping(_ on: Bool) {
        guard view.cropping != on else { return }
        view.setCropping(on)
        apply(at: NSPoint(x: window.frame.midX, y: window.frame.midY))
        if on {
            window.makeKey()
            window.makeFirstResponder(view)
        }
    }

    /// A new cut `r` (fractions of the picture), shown `width` points wide with its middle at `center` on the screen.
    /// commit() saves.
    func setCrop(_ r: CGRect, width: Double, center: NSPoint) {
        let whole = r.minX < 1e-6 && r.minY < 1e-6 && r.maxX > 1 - 1e-6 && r.maxY > 1 - 1e-6
        rec.crop = whole ? nil : CropRect(x: Double(r.minX), y: Double(r.minY), w: Double(r.width), h: Double(r.height))
        rec.width = width
        stand = nil
        apply(at: center)
    }

    /// The whole picture again, at the size it has now and where it lies now (commit() saves).
    func resetCrop() {
        guard isCropped else { return }
        let cut = crop
        let fw = rec.width / Double(cut.width), fh = rec.width / aspect / Double(cut.height)
        // the middle of the whole picture, seen from the cut's middle, turned onto the screen
        let fx = Double(0.5 - cut.midX) * fw, fy = Double(0.5 - cut.midY) * fh
        let t = rec.angle
        let middle = NSPoint(x: Double(window.frame.midX) + fx * cos(t) - fy * sin(t),
                             y: Double(window.frame.midY) + fx * sin(t) + fy * cos(t))
        setCrop(CGRect(x: 0, y: 0, width: 1, height: 1), width: min(2400, fw), center: middle)
    }

    func covers(_ p: NSPoint) -> Bool { view.covers(screenPoint: p) }

    func openOriginal() { NSWorkspace.shared.open(URL(fileURLWithPath: rec.path)) }

    /// Writes the live window position back into the record and saves. On a stand-in place only a real move by
    /// hand counts as a new place; resizing or turning it there keeps its own place for when the monitor is back.
    func commit() {
        owner?.refreshGroupFrame()
        let f = window.frame
        if let s = stand, abs(Double(f.midX - s.x)) < 1, abs(Double(f.midY - s.y)) < 1 {
            owner?.save()                                     // size/angle changed, the place stays its own
            return
        }
        stand = nil
        rec.centerX = Double(f.midX) - Double(shift.x)          // recorded in the arrangement the places were made in
        rec.centerY = Double(f.midY) - Double(shift.y)
        owner?.save()
    }

    /// Puts the print at its own place on the LG (moved along by `shift`). A print whose place is not on the LG - laid
    /// on the laptop screen once - goes onto the LG for the moment (offset by `nudge` steps, so several do not hide each
    /// other), and the record is NOT changed. Returns true when it had to take a stand-in place.
    @discardableResult
    func place(home: NSScreen, shift: NSPoint, nudge: Int) -> Bool {
        self.shift = shift
        stand = nil
        apply()
        let f = window.frame
        guard !home.frame.contains(NSPoint(x: f.midX, y: f.midY)) else { return false }
        let vis = home.visibleFrame, step = 28.0 * Double(nudge)
        stand = NSPoint(x: Double(vis.midX) + step, y: Double(vis.midY) - step)
        apply()
        return true
    }

    func close() { window.orderOut(nil) }

    /// Shows or hides the print without touching its record: position, size and angle stay.
    func setVisible(_ on: Bool) {
        if on { window.orderFront(nil) } else { select(false); window.orderOut(nil) }
    }

    // MARK: for the menu's commands and ⌘Z (AppDelegate)

    /// The print's outline on the screen: its turned box, without the window's padding.
    var outline: NSRect { window.frame.insetBy(dx: shadowPad, dy: shadowPad) }

    /// The photo's own height (its width is rec.width), whatever its angle.
    var photoHeight: Double { rec.width / aspect }

    /// Same angle, this height, the middle where it is (commit() saves).
    func setHeight(_ h: Double) { setTransform(width: h * aspect, angle: rec.angle) }

    /// Moved by `d` on the screen (commit() saves).
    func move(by d: NSPoint) {
        let o = window.frame.origin
        window.setFrameOrigin(NSPoint(x: o.x + d.x, y: o.y + d.y))
    }

    /// Back to an earlier size, angle and place (⌘Z); the caller saves.
    func restore(_ old: PhotoRec) {
        rec.centerX = old.centerX
        rec.centerY = old.centerY
        rec.width = old.width
        rec.angle = old.angle
        rec.crop = old.crop
        stand = nil
        apply()
    }
}

// MARK: - App

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var bar: DocBarClient!
    private let store = Store()
    private var items: [PhotoItem] = []

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }

    /// "Fotos zeigen": off hides every print at once (13.11.2026, Doc: things on the desk
    /// others should not see) without putting anything away; photos.json stays as it is.
    /// Remembered in the user defaults, so a hidden desk stays hidden after a restart or login.
    private static let shownKey = "photosShown"
    private var shown: Bool {
        get { UserDefaults.standard.object(forKey: AppDelegate.shownKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: AppDelegate.shownKey) }
    }

    /// Doc sits at the Mac, confirmed by DocHere's camera ("doc"). The photos show only then (13.11.2026, Doc: "Wenn ich
    /// hier nicht da bin, sollen die verschwinden" - "natürlich sollen sie nur auftauchen, wenn ich hier sitze"). Off at
    /// start, on lock, screen saver and sleep, and for every other answer (away, other, unknown, no answer): rather
    /// hidden once too often than shown once too many. "Fotos zeigen" stays the master switch; off, no camera at all.
    private var present = false
    private var misses = 0                       // answers in a row that were not "doc" and near
    private var missSince: Date?                 // the first of them
    /// Seconds of "not doc or not near" before the photos go, 0 = at once (Doc, 20.11.2026: 10 s was "sehr
    /// irritierend", he wants to see it react). DocHere steadies its answers itself. Read on every answer:
    ///     defaults write de.docalvers.deskphoto hideDelay -float 2
    private var hideDelay: Double { max(0, UserDefaults.standard.double(forKey: "hideDelay")) }
    private var lastAnswer = Date.distantPast    // DocHere's heartbeat: no answer for 15 s counts as not Doc
    private var visible: Bool { shown && present && home != nil }

    /// The one screen the photos live on (15.11.2026, Doc: "dass die nur gezeigt werden, wenn der LG dran ist, nicht auf
    /// dem Mac selbst"): his LG UltraWide, recognised by maker and model as the monitor reports them (EDID vendor 0x1e6d,
    /// model 0x77e9), never by its place or its port - he plugs it into either. Without it - on the road, in a classroom
    /// with a beamer or the Promethean board, the MacBook alone - no photo shows anywhere, and DocHere's camera is not
    /// asked for. Another monitor: `defaults write de.docalvers.deskphoto homeDisplay <vendor hex>:<model hex>`.
    private var home: NSScreen?
    private static func findHome() -> NSScreen? {
        let parts = (UserDefaults.standard.string(forKey: "homeDisplay") ?? "1e6d:77e9").split(separator: ":")
        guard parts.count == 2, let vendor = UInt32(parts[0], radix: 16), let model = UInt32(parts[1], radix: 16) else { return nil }
        return NSScreen.screens.first { s in
            guard let n = s.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber else { return false }
            let id = CGDirectDisplayID(n.uint32Value)
            return CGDisplayIsBuiltin(id) == 0 && CGDisplayVendorNumber(id) == vendor && CGDisplayModelNumber(id) == model
        }
    }
    /// Where the LG's corner lay when the places were recorded; remembered the first time it is seen. See PhotoItem.shift.
    private var homeOrigin: NSPoint {
        get {
            let d = UserDefaults.standard
            if d.object(forKey: "homeOriginX") == nil, let h = home {
                d.set(Double(h.frame.minX), forKey: "homeOriginX")
                d.set(Double(h.frame.minY), forKey: "homeOriginY")
            }
            return NSPoint(x: d.double(forKey: "homeOriginX"), y: d.double(forKey: "homeOriginY"))
        }
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        bar = DocBarClient(id: "de.docalvers.deskphoto", name: "DocPhoto",
                           symbol: "photo.on.rectangle.angled") { [weak self] item in
            self?.handle(item)
        }

        home = AppDelegate.findHome()
        for rec in store.recs {
            if let item = PhotoItem(rec: rec, owner: self, visible: false) { items.append(item) }
        }
        save()   // drops records whose file has gone
        placeAll()   // every print to its place on the LG; without the LG they stay hidden
        publishMenu()

        // A click anywhere but on a print clears the selection: the global monitor sees clicks that go to other apps
        // (the wallpaper, any window), the local one those to our own windows. A click on a print is the print's own
        // business (PhotoView.mouseDown: select it, add it with shift, move the selection).
        NSEvent.addGlobalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] _ in
            self?.clearSelection()
        }
        NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] e in
            if let self = self, !self.items.contains(where: { $0.window === e.window }), e.window !== self.groupFrame.window {
                self.clearSelection()
            }
            if let self = self, let c = self.cropItem, e.window !== c.window { self.endCrop() }   // a click on another print
            return e
        }

        NotificationCenter.default.addObserver(self, selector: #selector(screensChanged),
                                               name: NSApplication.didChangeScreenParametersNotification, object: nil)
        watchPresence()
    }

    // MARK: Doc at the Mac? (DocHere)

    /// DocHere keeps its camera on for us while we ask for it (one steady green light, one look per second on mains,
    /// every 5 s on battery) and sends each answer. One "doc" that is also near shows the photos; two other answers in a
    /// row hide them, so a single unclear frame does not make them flicker. Since 20.11.2026 DocHere's answers are steady
    /// themselves (sticky Doc, near with hysteresis), so any other answer hides them at once - or after `hideDelay`
    /// seconds if set; an empty chair ("away") always at once. One "doc" that is near shows them again at once. "near" is DocHere's own steadied closeness
    /// (20.11.2026, Doc: "nur, wenn ich gefühlt wirklich davor sitze" - a metre away still showed them); a DocHere
    /// without it sends no "near", which counts as near. Lock, screen saver and sleep hide them at once; DocHere
    /// stops its camera there by itself. Doc, 13.11.2026: "Aber eben durchgehend laufen lassen. Was blöde wäre, wenn
    /// das immer grün blinkt."
    private func watchPresence() {
        let dnc = DistributedNotificationCenter.default()
        dnc.addObserver(forName: Notification.Name("de.docalvers.dochere.who"), object: nil, queue: .main) { [weak self] n in
            let info = n.userInfo
            self?.answered((info?["answer"] as? String) ?? "", near: (info?["near"] as? String).map { $0 == "1" } ?? true)
        }
        for name in ["com.apple.screenIsLocked", "com.apple.screensaver.didstart"] {
            dnc.addObserver(forName: Notification.Name(name), object: nil, queue: .main) { [weak self] _ in self?.absent() }
        }
        for name in ["com.apple.screenIsUnlocked", "com.apple.screensaver.didstop"] {
            dnc.addObserver(forName: Notification.Name(name), object: nil, queue: .main) { [weak self] _ in self?.request() }
        }
        let ws = NSWorkspace.shared.notificationCenter
        for name in [NSWorkspace.screensDidSleepNotification, NSWorkspace.willSleepNotification,
                     NSWorkspace.sessionDidResignActiveNotification] {
            ws.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in self?.absent() }
        }
        for name in [NSWorkspace.screensDidWakeNotification, NSWorkspace.didWakeNotification,
                     NSWorkspace.sessionDidBecomeActiveNotification] {
            ws.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in self?.request() }
        }
        Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in self?.heartbeat() }
        request()
    }

    /// Asks DocHere to keep watching (renewed every 5 s; DocHere stops 30 s after the last request) - or to stop.
    private func request() {
        DistributedNotificationCenter.default().postNotificationName(
            Notification.Name("de.docalvers.dochere.watch"), object: "de.docalvers.deskphoto",
            userInfo: ["on": shown && home != nil ? "1" : "0"], deliverImmediately: true)
    }

    private func heartbeat() {
        if shown && home != nil { request() }
        if present && Date().timeIntervalSince(lastAnswer) > 15 { absent() }   // DocHere silent: hide
    }

    private func answered(_ answer: String, near: Bool) {
        lastAnswer = Date()
        guard shown, home != nil else { return }        // without the LG nothing shows, whatever the camera says
        let here = answer == "doc" && near
        if here { misses = 0; missSince = nil } else { misses += 1; if missSince == nil { missSince = Date() } }
        let gone = answer == "away" || (missSince.map { Date().timeIntervalSince($0) >= hideDelay } ?? false)
        let now = here ? true : (gone ? false : present)
        if now != present { present = now; applyVisibility() }
    }

    private func absent() {
        misses = 2
        guard present else { return }
        present = false
        applyVisibility()
    }

    private func applyVisibility() {
        if !visible { endCrop() }
        items.forEach { $0.setVisible(visible) }
        refreshGroupFrame()
        publishMenu()
    }

    // MARK: menu

    private func publishMenu() {
        var items: [DocBarItem] = []
        if !self.items.isEmpty || !shown { items.append(DocBarItem("show", "Fotos zeigen", state: shown)) }
        items.append(DocBarItem("add", "Foto ablegen …"))
        if !self.items.isEmpty { items.append(DocBarItem("clear", "Alle Fotos wegräumen")) }
        items.append(DocBarItem("login", "Beim Anmelden starten", state: startsAtLogin))

        let n = self.items.count
        let fotos = n == 1 ? "1 Foto" : "\(n) Fotos"
        let status = n == 0 ? "kein Foto abgelegt"
                   : !shown ? "\(fotos) ausgeblendet"
                   : home == nil ? "\(fotos) – nur am LG-Monitor"
                   : present ? "\(fotos) auf dem Schreibtisch" : "\(fotos) – nur sichtbar, wenn du da bist"
        bar.publish(status: status, items: items)
    }

    private func handle(_ item: String) {
        switch item {
        case "show": toggleShown()
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

        for url in panel.urls {
            let id = UUID().uuidString
            let path = ownCopy(of: url, id: id).path
            let width = 340.0
            let size = NSImage(contentsOfFile: path)?.size ?? NSSize(width: 4, height: 3)
            let height = size.width > 0 ? width * Double(size.height / size.width) : width * 0.75
            let spot = newSpot(width: width, height: height)
            let rec = PhotoRec(id: id, path: path,
                               centerX: Double(spot.x), centerY: Double(spot.y),
                               width: width,
                               angle: 0)     // straight, like the widgets beside it
            // A photo added while the desk is hidden stays hidden too: hiding is for privacy.
            if let item = PhotoItem(rec: rec, owner: self, visible: visible) { items.append(item) }
        }
        save()
        publishMenu()
    }

    /// Where a new photo goes: right beside the photo added last, top edges aligned, so
    /// it lands where Doc keeps his photos and can see them. The middle of the screen is
    /// nearly always covered by windows, and a desktop photo lies below every window
    /// (10.11.2026: a screenshot landed in the middle of the LG, behind his windows —
    /// "kommt aber nicht aufs Desktop"). No room on the right: below it; no room there
    /// either: slightly offset on top of it. Without any photo yet: the middle of the
    /// screen under the mouse. Several pictures from one dialog line up one after another.
    private func newSpot(width w: Double, height h: Double) -> NSPoint {
        let gap = 24.0
        if let last = items.last {
            // The window is the photo plus shadowPad on every side.
            let f = last.window.frame.insetBy(dx: shadowPad, dy: shadowPad)
            let vis = (NSScreen.screens.first { $0.frame.contains(NSPoint(x: f.midX, y: f.midY)) }
                       ?? NSScreen.main)?.visibleFrame ?? f
            let right = NSPoint(x: Double(f.maxX) + gap + w / 2, y: Double(f.maxY) - h / 2)
            if right.x + w / 2 <= Double(vis.maxX) && right.y - h / 2 >= Double(vis.minY) { return right }
            let below = NSPoint(x: Double(f.minX) + w / 2, y: Double(f.minY) - gap - h / 2)
            if below.y - h / 2 >= Double(vis.minY) && below.x + w / 2 <= Double(vis.maxX) { return below }
            return NSPoint(x: f.midX + 34, y: f.midY - 28)
        }
        let mouse = NSEvent.mouseLocation
        let vis = (home ?? NSScreen.screens.first { NSMouseInRect(mouse, $0.frame, false) }
                   ?? NSScreen.main)?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1440, height: 900)
        return NSPoint(x: vis.midX, y: vis.midY)
    }

    @objc private func removeAll() {
        endCrop()
        let paths = items.map { $0.rec.path }
        items.forEach { $0.close() }
        items.removeAll()
        save()
        paths.forEach(trashOwnCopy)
        publishMenu()
    }

    @objc private func toggleShown() {
        shown.toggle()
        present = false             // on: they show after DocHere's first "doc"; off: DocHere's camera goes off
        request()
        applyVisibility()
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

    func applicationWillTerminate(_ note: Notification) {
        bar.withdraw()
        DistributedNotificationCenter.default().postNotificationName(      // DocHere's camera off
            Notification.Name("de.docalvers.dochere.watch"), object: "de.docalvers.deskphoto",
            userInfo: ["on": "0"], deliverImmediately: true)
    }

    // MARK: the right-click menu (Doc, 21.11.2026): it acts on every selected print

    private var menuTargets: [PhotoItem] = []    // the prints the open menu acts on
    private weak var menuClicked: PhotoItem?     // the one that was right-clicked

    /// The menu for a right click on `item`: when it is selected, for the whole selection; when not, it alone becomes
    /// the selection. "Größer"/"Kleiner" are gone (the corners do that); "Ausrichten" lines up two or more prints, as in
    /// Keynote and PowerPoint. Every command can be taken back (⌘Z or "Rückgängig").
    func showMenu(for item: PhotoItem, at event: NSEvent) {
        if !item.isSelected { selectOnly(item) }
        let targets = selectedItems().isEmpty ? [item] : selectedItems()
        menuTargets = targets
        menuClicked = item
        let n = targets.count, several = n >= 2
        func entry(_ title: String, _ action: Selector, tag: Int = 0, enabled: Bool = true) -> NSMenuItem {
            let it = NSMenuItem(title: title, action: action, keyEquivalent: "")
            it.target = self
            it.tag = tag
            it.isEnabled = enabled
            return it
        }
        let menu = NSMenu()
        menu.autoenablesItems = false
        let undoItem = entry("Rückgängig", #selector(menuUndo(_:)), enabled: !undoStack.isEmpty)
        undoItem.keyEquivalent = "z"
        undoItem.keyEquivalentModifierMask = .command
        menu.addItem(undoItem)
        menu.addItem(.separator())
        menu.addItem(entry(several ? "Gerade ausrichten (\(n) Fotos)" : "Gerade ausrichten", #selector(menuStraighten(_:))))
        if !several {
            // cropping, one print at a time (Doc, 22.11.2026)
            menu.addItem(entry(cropItem === item ? "Zuschneiden beenden" : "Zuschneiden", #selector(menuCrop(_:))))
            if item.isCropped { menu.addItem(entry("Zuschnitt zurücksetzen", #selector(menuResetCrop(_:)))) }
        }
        if several {
            let w = item.rec.width, h = item.photoHeight
            let avgW = targets.map { $0.rec.width }.reduce(0, +) / Double(n)
            let avgH = targets.map { $0.photoHeight }.reduce(0, +) / Double(n)
            let align = NSMenu()
            align.autoenablesItems = false
            align.addItem(entry(String(format: "Gleiche Breite wie dieses Foto (%.0f pt)", w), #selector(menuSameWidth(_:)), tag: 0))
            align.addItem(entry(String(format: "Gleiche Breite – Durchschnitt (%.0f pt)", avgW), #selector(menuSameWidth(_:)), tag: 1))
            align.addItem(entry(String(format: "Gleiche Höhe wie dieses Foto (%.0f pt)", h), #selector(menuSameHeight(_:)), tag: 0))
            align.addItem(entry(String(format: "Gleiche Höhe – Durchschnitt (%.0f pt)", avgH), #selector(menuSameHeight(_:)), tag: 1))
            align.addItem(.separator())
            align.addItem(entry("Oben bündig", #selector(menuAlign(_:)), tag: 0))
            align.addItem(entry("Unten bündig", #selector(menuAlign(_:)), tag: 1))
            align.addItem(entry("Links bündig", #selector(menuAlign(_:)), tag: 2))
            align.addItem(entry("Rechts bündig", #selector(menuAlign(_:)), tag: 3))
            align.addItem(.separator())
            align.addItem(entry("Horizontal gleich verteilen", #selector(menuDistribute(_:)), tag: 0, enabled: n >= 3))
            align.addItem(entry("Vertikal gleich verteilen", #selector(menuDistribute(_:)), tag: 1, enabled: n >= 3))
            let alignItem = NSMenuItem(title: "Ausrichten", action: nil, keyEquivalent: "")
            alignItem.submenu = align
            menu.addItem(alignItem)
        }
        menu.addItem(.separator())
        menu.addItem(entry("Original öffnen", #selector(menuOpen(_:))))
        menu.addItem(entry(several ? "\(n) Fotos vom Schreibtisch nehmen" : "Vom Schreibtisch nehmen", #selector(menuRemove(_:))))
        NSMenu.popUpContextMenu(menu, with: event, for: item.window.contentView!)
    }

    /// One command on the prints, as one step for ⌘Z, every place saved.
    private func change(_ act: () -> Void) {
        beginChange()
        act()
        menuTargets.forEach { $0.commit() }
        endChange()
    }

    @objc func menuUndo(_ sender: NSMenuItem) { undo() }

    @objc func menuStraighten(_ sender: NSMenuItem) { change { menuTargets.forEach { $0.straighten() } } }

    @objc func menuCrop(_ sender: NSMenuItem) {
        guard let item = menuClicked else { return }
        if cropItem === item { endCrop() } else { startCrop(item) }
    }

    @objc func menuResetCrop(_ sender: NSMenuItem) { change { menuClicked?.resetCrop() } }

    // MARK: cropping (Doc, 22.11.2026: "wie bei PowerPoint dann so Crop-Ecken"); see PhotoView.cropping

    private weak var cropItem: PhotoItem?        // the print being cropped, if any - never more than one

    /// Crop mode for this print alone; any other print's crop mode ends.
    func startCrop(_ item: PhotoItem) {
        if cropItem !== item { endCrop() }
        selectOnly(item)
        cropItem = item
        item.setCropping(true)
    }

    /// Ends crop mode, the cut kept (every crop drag has saved itself already).
    func endCrop() {
        guard let item = cropItem else { return }
        cropItem = nil
        item.setCropping(false)
    }

    /// tag 0: the right-clicked photo's width, tag 1: the average; each keeps its shape and its middle
    @objc func menuSameWidth(_ sender: NSMenuItem) {
        let w = sender.tag == 0 ? (menuClicked?.rec.width ?? 0)
                                : menuTargets.map { $0.rec.width }.reduce(0, +) / Double(max(1, menuTargets.count))
        guard w > 0 else { return }
        change { menuTargets.forEach { $0.setTransform(width: w, angle: $0.rec.angle) } }
    }

    @objc func menuSameHeight(_ sender: NSMenuItem) {
        let h = sender.tag == 0 ? (menuClicked?.photoHeight ?? 0)
                                : menuTargets.map { $0.photoHeight }.reduce(0, +) / Double(max(1, menuTargets.count))
        guard h > 0 else { return }
        change { menuTargets.forEach { $0.setHeight(h) } }
    }

    /// tag 0 top, 1 bottom, 2 left, 3 right: every outline onto the outermost edge of the selection
    @objc func menuAlign(_ sender: NSMenuItem) {
        let boxes = menuTargets.map { $0.outline }
        guard !boxes.isEmpty else { return }
        change {
            for (it, b) in zip(menuTargets, boxes) {
                switch sender.tag {
                case 0: it.move(by: NSPoint(x: 0, y: boxes.map { $0.maxY }.max()! - b.maxY))
                case 1: it.move(by: NSPoint(x: 0, y: boxes.map { $0.minY }.min()! - b.minY))
                case 2: it.move(by: NSPoint(x: boxes.map { $0.minX }.min()! - b.minX, y: 0))
                default: it.move(by: NSPoint(x: boxes.map { $0.maxX }.max()! - b.maxX, y: 0))
                }
            }
        }
    }

    /// tag 0 horizontally, 1 vertically: the outer two stay, the gaps between the outlines become equal
    @objc func menuDistribute(_ sender: NSMenuItem) {
        let across = sender.tag == 0
        let sorted = menuTargets.sorted { across ? $0.outline.midX < $1.outline.midX : $0.outline.midY < $1.outline.midY }
        guard sorted.count >= 3, let first = sorted.first?.outline, let last = sorted.last?.outline else { return }
        let span = across ? last.maxX - first.minX : last.maxY - first.minY
        let sizes = sorted.map { across ? $0.outline.width : $0.outline.height }
        let gap = (span - sizes.reduce(0, +)) / CGFloat(sorted.count - 1)
        change {
            var at = across ? first.minX : first.minY
            for (it, size) in zip(sorted, sizes) {
                let b = it.outline
                it.move(by: across ? NSPoint(x: at - b.minX, y: 0) : NSPoint(x: 0, y: at - b.minY))
                at += size + gap
            }
        }
    }

    @objc func menuOpen(_ sender: NSMenuItem) { menuClicked?.openOriginal() }

    /// Every selected print off the desk (their copies go to the Trash); this one cannot be taken back with ⌘Z.
    @objc func menuRemove(_ sender: NSMenuItem) {
        let gone = menuTargets
        if gone.contains(where: { $0 === cropItem }) { endCrop() }
        for item in gone {
            item.close()
            items.removeAll { $0 === item }
        }
        save()
        gone.forEach { trashOwnCopy($0.rec.path) }
        refreshGroupFrame()
        publishMenu()
    }

    // MARK: ⌘Z (Doc, 21.11.2026: every change undoable)

    private var undoStack: [[PhotoRec]] = []     // the desk before each change, newest last
    private var changeStart: [PhotoRec]?
    private var lastWheel = Date.distantPast

    /// A change begins (mouse down on a print or a grip, a key, a menu command): the desk as it is now.
    func beginChange() {
        if changeStart == nil { changeStart = items.map { $0.rec } }
    }

    /// The change is over: when it moved, sized or turned anything, the desk before it goes on the undo stack.
    func endChange() {
        guard let before = changeStart else { return }
        changeStart = nil
        let now = Dictionary(items.map { ($0.rec.id, $0.rec) }, uniquingKeysWith: { a, _ in a })
        let moved = before.contains { b in
            guard let n = now[b.id] else { return false }
            return abs(n.centerX - b.centerX) > 0.01 || abs(n.centerY - b.centerY) > 0.01
                || abs(n.width - b.width) > 0.01 || abs(n.angle - b.angle) > 0.0001 || n.crop != b.crop
        }
        guard moved else { return }
        undoStack.append(before)
        if undoStack.count > 50 { undoStack.removeFirst() }
    }

    /// Option + wheel turns a print; one turning, until the wheel rests for 1.5 s, is one step for ⌘Z.
    func wheelTurn(_ item: PhotoItem, by delta: Double) {
        if Date().timeIntervalSince(lastWheel) > 1.5 {
            beginChange()
            item.rotate(by: delta)
            endChange()
        } else {
            item.rotate(by: delta)
        }
        lastWheel = Date()
    }

    /// Takes back the last change: every print back to its size, angle and place before it (a removed print stays gone).
    func undo() {
        guard let before = undoStack.popLast() else { NSSound.beep(); return }
        for item in items {
            if let old = before.first(where: { $0.id == item.rec.id }) { item.restore(old) }
        }
        save()
        refreshGroupFrame()
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

    /// A monitor came or went: with the LG there every print goes to its own place on it; without it they all stay
    /// hidden - never on the laptop, a beamer or the board - and DocHere's camera is let go. No restart needed.
    @objc private func screensChanged() {
        let had = home != nil
        home = AppDelegate.findHome()
        placeAll()
        if had != (home != nil) {
            if home == nil { present = false; misses = 2 }
            request()
        }
        applyVisibility()
    }

    private func placeAll() {
        guard let h = home else { return }               // nothing shows anywhere else
        let o = homeOrigin
        let shift = NSPoint(x: h.frame.minX - o.x, y: h.frame.minY - o.y)
        var away = 0
        for item in items {
            if item.place(home: h, shift: shift, nudge: away) { away += 1 }
        }
    }

    // MARK: selection (see PhotoView.mouseDown)

    /// Exactly this print selected, every other one not.
    func selectOnly(_ chosen: PhotoItem) {
        if cropItem !== chosen { endCrop() }
        for item in items { item.select(item === chosen) }
    }

    func clearSelection() {
        endCrop()
        for item in items { item.select(false) }
    }

    /// The selected prints that can be seen, in their order on the desk.
    func selectedItems() -> [PhotoItem] {
        items.filter { $0.isSelected && $0.window.isVisible }
    }

    // MARK: several selected prints scale as one group (Doc, 21.11.2026: "as if grouped")

    private lazy var groupFrame = GroupFrame(owner: self)
    private var groupScaling: GroupScaling?

    /// What a group scaling starts from: the group's outline, both possible fixed points, where the mouse took hold, and
    /// each print's width and middle.
    private struct GroupScaling {
        let outline: NSRect
        let corner: NSPoint          // the group's corner opposite the grabbed grip: stays where it is
        let middle: NSPoint          // with control the group scales about its middle instead
        let start: NSPoint
        let members: [(item: PhotoItem, width: Double, centre: NSPoint)]
    }

    /// The union of the selected prints' outlines (their turned boxes), or nil while fewer than two are selected.
    private func groupOutline() -> NSRect? {
        let selection = selectedItems()
        guard selection.count >= 2 else { return nil }
        let outlines = selection.map { $0.window.frame.insetBy(dx: shadowPad, dy: shadowPad) }
        return outlines.dropFirst().reduce(outlines[0]) { $0.union($1) }
    }

    /// The dashed group box follows the selection: shown around two or more selected prints, hidden otherwise.
    func refreshGroupFrame() { groupFrame.show(groupOutline()) }

    /// A grip was taken - of the group box, or of a print (`from`) that is one of several selected. `towards`: the grip's
    /// side, (±1, ±1) on the screen. False when there is no group to scale; the print then scales alone, as before.
    func beginGroupScale(from item: PhotoItem? = nil, towards: NSPoint, mouse: NSPoint) -> Bool {
        let selection = selectedItems()
        guard let outline = groupOutline(), item.map({ i in selection.contains { $0 === i } }) ?? true else { return false }
        groupScaling = GroupScaling(
            outline: outline,
            corner: NSPoint(x: towards.x > 0 ? outline.minX : outline.maxX, y: towards.y > 0 ? outline.minY : outline.maxY),
            middle: NSPoint(x: outline.midX, y: outline.midY),
            start: mouse,
            members: selection.map { ($0, $0.rec.width, NSPoint(x: $0.window.frame.midX, y: $0.window.frame.midY)) })
        return true
    }

    /// Scales every selected print by one factor about the fixed point: its width and its distance from that point, so
    /// the group keeps its arrangement and each print its shape. The factor is how far the mouse has gone along the line
    /// from the fixed point through the place it took hold. No print gets narrower than 90 or wider than 2400 points,
    /// and a growing group stops at the edge of its screen.
    func groupScale(to mouse: NSPoint, aboutMiddle: Bool) {
        guard let g = groupScaling else { return }
        let a = aboutMiddle ? g.middle : g.corner
        let ux = Double(g.start.x - a.x), uy = Double(g.start.y - a.y)
        let reach = ux * ux + uy * uy
        guard reach > 4 else { return }
        var s = (Double(mouse.x - a.x) * ux + Double(mouse.y - a.y) * uy) / reach
        let smallest = g.members.map { 90 / $0.width }.max() ?? 0
        var largest = g.members.map { 2400 / $0.width }.min() ?? 1
        if let screen = (NSScreen.screens.first { $0.frame.contains(a) } ?? NSScreen.main)?.visibleFrame {
            var fit = Double.infinity
            for (p, lo, hi, at) in [(g.outline.minX, screen.minX, screen.maxX, a.x), (g.outline.maxX, screen.minX, screen.maxX, a.x),
                                    (g.outline.minY, screen.minY, screen.maxY, a.y), (g.outline.maxY, screen.minY, screen.maxY, a.y)] {
                let d = Double(p - at)
                if d > 0.5 { fit = min(fit, Double(hi - at) / d) } else if d < -0.5 { fit = min(fit, Double(lo - at) / d) }
            }
            largest = min(largest, max(1, fit))      // a group already past the edge may still shrink, not grow
        }
        s = min(max(s, smallest), max(smallest, largest))
        for m in g.members {
            let c = NSPoint(x: Double(a.x) + s * Double(m.centre.x - a.x), y: Double(a.y) + s * Double(m.centre.y - a.y))
            m.item.setTransform(width: m.width * s, angle: m.item.rec.angle, center: c)
        }
        refreshGroupFrame()
    }

    /// The group scaling ends: every print's new size and place is saved.
    func endGroupScale() {
        guard let g = groupScaling else { return }
        groupScaling = nil
        g.members.forEach { $0.item.commit() }
        refreshGroupFrame()
    }

    func save() { store.replace(items.map { $0.rec }) }

    /// The other photos as they stand on the screen (their outline, without the window's padding), to snap to - all
    /// but the ones that are being moved.
    func photoRects(except moving: [PhotoItem]) -> [NSRect] {
        items.filter { item in !moving.contains { $0 === item } && item.window.isVisible }
            .map { $0.window.frame.insetBy(dx: shadowPad, dy: shadowPad) }
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
