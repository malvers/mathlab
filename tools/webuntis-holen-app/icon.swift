// Draws the app icon: dark-blue rounded square, a small timetable grid in the
// lab palette (λ orange, φ green, cyan) and a green check mark. Renders every
// size an .iconset needs; build.command turns the set into an .icns.
import AppKit

func draw(size: CGFloat) -> NSImage {
    let img = NSImage(size: NSSize(width: size, height: size))
    img.lockFocus()
    let ctx = NSGraphicsContext.current!.cgContext
    let s = size
    // background: rounded square (macOS style), dark blue like the pages
    let bgRect = CGRect(x: s * 0.06, y: s * 0.06, width: s * 0.88, height: s * 0.88)
    let bg = CGPath(roundedRect: bgRect, cornerWidth: s * 0.2, cornerHeight: s * 0.2, transform: nil)
    ctx.addPath(bg)
    ctx.setFillColor(CGColor(red: 14 / 255, green: 36 / 255, blue: 78 / 255, alpha: 1))
    ctx.fillPath()

    // grid: 4 columns x 3 rows of lesson tiles
    let cols = 4, rows = 3
    let gx = s * 0.17, gy = s * 0.24, gw = s * 0.66, gh = s * 0.50
    let cw = gw / CGFloat(cols), ch = gh / CGFloat(rows), pad = s * 0.018
    let orange = CGColor(red: 245 / 255, green: 194 / 255, blue: 66 / 255, alpha: 1)
    let green = CGColor(red: 121 / 255, green: 158 / 255, blue: 49 / 255, alpha: 1)
    let cyan = CGColor(red: 90 / 255, green: 190 / 255, blue: 230 / 255, alpha: 1)
    let dim = CGColor(red: 120 / 255, green: 160 / 255, blue: 220 / 255, alpha: 0.22)
    let palette: [[CGColor?]] = [
        [orange, cyan, nil, green],
        [cyan, nil, orange, cyan],
        [nil, green, cyan, nil],
    ]
    for r in 0..<rows {
        for c in 0..<cols {
            let rect = CGRect(x: gx + CGFloat(c) * cw + pad, y: gy + gh - CGFloat(r + 1) * ch + pad,
                              width: cw - 2 * pad, height: ch - 2 * pad)
            let p = CGPath(roundedRect: rect, cornerWidth: s * 0.02, cornerHeight: s * 0.02, transform: nil)
            ctx.addPath(p)
            ctx.setFillColor(palette[r][c] ?? dim)
            ctx.fillPath()
        }
    }
    // header band above the grid (the weekday row)
    let band = CGRect(x: gx, y: gy + gh + s * 0.03, width: gw, height: s * 0.05)
    ctx.addPath(CGPath(roundedRect: band, cornerWidth: s * 0.02, cornerHeight: s * 0.02, transform: nil))
    ctx.setFillColor(CGColor(red: 120 / 255, green: 160 / 255, blue: 220 / 255, alpha: 0.5))
    ctx.fillPath()

    // check mark badge bottom right
    let bc = CGPoint(x: s * 0.78, y: s * 0.22), br = s * 0.13
    ctx.addEllipse(in: CGRect(x: bc.x - br, y: bc.y - br, width: 2 * br, height: 2 * br))
    ctx.setFillColor(green)
    ctx.fillPath()
    ctx.setStrokeColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    ctx.setLineWidth(s * 0.035)
    ctx.setLineCap(.round); ctx.setLineJoin(.round)
    ctx.move(to: CGPoint(x: bc.x - br * 0.5, y: bc.y))
    ctx.addLine(to: CGPoint(x: bc.x - br * 0.1, y: bc.y - br * 0.4))
    ctx.addLine(to: CGPoint(x: bc.x + br * 0.55, y: bc.y + br * 0.4))
    ctx.strokePath()
    img.unlockFocus()
    return img
}

func png(_ img: NSImage, _ px: Int) -> Data {
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: px, pixelsHigh: px, bitsPerSample: 8,
                               samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
                               bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    img.draw(in: NSRect(x: 0, y: 0, width: px, height: px), from: .zero, operation: .copy, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()
    return rep.representation(using: .png, properties: [:])!
}

let out = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "icon.iconset"
try? FileManager.default.createDirectory(atPath: out, withIntermediateDirectories: true)
for (name, px) in [("16x16", 16), ("16x16@2x", 32), ("32x32", 32), ("32x32@2x", 64), ("128x128", 128), ("128x128@2x", 256),
                   ("256x256", 256), ("256x256@2x", 512), ("512x512", 512), ("512x512@2x", 1024)] {
    let img = draw(size: CGFloat(px))
    try! png(img, px).write(to: URL(fileURLWithPath: "\(out)/icon_\(name).png"))
}
print("iconset: \(out)")
