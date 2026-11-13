// Who sits at the Mac: Doc or somebody else. Vision finds the face and its eye and mouth points,
// the face is turned upright into the 112×112 crop that face models expect, and a face print
// (a list of numbers) is compared with Doc's prints.
//
// Everything stays on this Mac. Photos, prints and the model live in
// ~/Library/Application Support/DocHere (folder 700, files 600), never in the repo, and the log
// gets numbers only, never a picture or a path.
//
// Two engines: a face model in Core ML when one is installed (models/FaceEmbedding.mlpackage,
// an ArcFace-style network: 112×112 RGB in, a 512-number print out), otherwise Apple's own
// image feature print as a stand-in, which measures likeness of pictures rather than of people.

import AppKit
import CoreML
import Vision

// MARK: - where things live

enum Store {
    static let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("DocHere")
    static let faces = dir.appendingPathComponent("faces")
    static let models = dir.appendingPathComponent("models")
    static let prints = dir.appendingPathComponent("doc-prints.json")
    static let model = models.appendingPathComponent("FaceEmbedding.mlpackage")
    static let compiled = models.appendingPathComponent("FaceEmbedding.mlmodelc")

    /// Folders only Doc's user can open.
    static func prepare() {
        for url in [dir, faces, models] {
            try? FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
            try? FileManager.default.setAttributes([.posixPermissions: 0o700], ofItemAtPath: url.path)
        }
    }

    static func lock(_ url: URL) {
        try? FileManager.default.setAttributes([.posixPermissions: 0o600], ofItemAtPath: url.path)
    }

    static func image(_ url: URL) -> CGImage? {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
        return CGImageSourceCreateImageAtIndex(source, 0, nil)
    }
}

// MARK: - the face, upright

struct FaceCut {
    let crop: CGImage       // 112×112, eyes and mouth where the template wants them
    let quality: Float      // Vision's capture quality, 0…1 (sharp, frontal, well lit is high)
    let share: Float        // face width as a share of the picture width
    let light: Float        // mean brightness of the crop, 0…1
    let contrast: Float     // spread (standard deviation) of the crop's brightness, 0…1
}

enum Tone {
    /// Mean and spread of a picture's grey values, 0…1.
    static func of(_ image: CGImage) -> (light: Float, contrast: Float) {
        let w = image.width, h = image.height
        var px = [UInt8](repeating: 0, count: w * h)
        let drawn: Bool = px.withUnsafeMutableBytes { buf in
            guard let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w,
                                      space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)
            else { return false }
            ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))
            return true
        }
        guard drawn, !px.isEmpty else { return (0, 0) }
        let n = Float(px.count)
        let mean = px.reduce(Float(0)) { $0 + Float($1) } / n
        let spread = px.reduce(Float(0)) { $0 + (Float($1) - mean) * (Float($1) - mean) } / n
        return (mean / 255, sqrt(spread) / 255)
    }
}

enum FaceCutter {
    /// InsightFace's 112×112 template (norm_crop): left eye, right eye, nose, left and right
    /// mouth corner as seen in the picture. The nose is left out: Vision has no clear tip point,
    /// and four points fix a turn, a size and a shift well enough.
    private static let template: [CGPoint] = [CGPoint(x: 38.2946, y: 51.6963), CGPoint(x: 73.5318, y: 51.5014),
                                              CGPoint(x: 41.5493, y: 92.3655), CGPoint(x: 70.7299, y: 92.2041)]
    static let side = 112

    /// The largest face in the picture, cut out and turned upright, or nil without a clear face.
    static func largest(in image: CGImage) -> FaceCut? {
        let marks = VNDetectFaceLandmarksRequest()
        let handler = VNImageRequestHandler(cgImage: image, options: [:])
        try? handler.perform([marks])
        guard let face = marks.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width }),
              let points = keyPoints(face, image) else { return nil }

        let quality = VNDetectFaceCaptureQualityRequest()
        quality.inputFaceObservations = [face]
        try? handler.perform([quality])
        let score = quality.results?.first?.faceCaptureQuality ?? 0

        guard let crop = warp(image, from: points) else { return nil }
        let tone = Tone.of(crop)
        return FaceCut(crop: crop, quality: score, share: Float(face.boundingBox.width), light: tone.light,
                       contrast: tone.contrast)
    }

    /// Eyes and mouth corners in picture pixels, top-left origin, ordered like the template.
    private static func keyPoints(_ face: VNFaceObservation, _ image: CGImage) -> [CGPoint]? {
        guard let marks = face.landmarks else { return nil }
        let size = CGSize(width: image.width, height: image.height)
        func flip(_ p: CGPoint) -> CGPoint { CGPoint(x: p.x, y: size.height - p.y) }
        func centre(_ region: VNFaceLandmarkRegion2D?) -> CGPoint? {
            guard let pts = region?.pointsInImage(imageSize: size), !pts.isEmpty else { return nil }
            let sum = pts.reduce(CGPoint.zero) { CGPoint(x: $0.x + $1.x, y: $0.y + $1.y) }
            return flip(CGPoint(x: sum.x / CGFloat(pts.count), y: sum.y / CGFloat(pts.count)))
        }
        guard let a = centre(marks.leftPupil) ?? centre(marks.leftEye),
              let b = centre(marks.rightPupil) ?? centre(marks.rightEye),
              let lips = marks.outerLips?.pointsInImage(imageSize: size).map(flip), lips.count >= 2,
              let left = lips.min(by: { $0.x < $1.x }), let right = lips.max(by: { $0.x < $1.x })
        else { return nil }
        let eyes = [a, b].sorted { $0.x < $1.x }
        return [eyes[0], eyes[1], left, right]
    }

    /// The least-squares turn, size and shift that carries the points onto the template.
    private static func warp(_ image: CGImage, from src: [CGPoint]) -> CGImage? {
        let n = CGFloat(src.count)
        let ms = src.reduce(CGPoint.zero) { CGPoint(x: $0.x + $1.x / n, y: $0.y + $1.y / n) }
        let md = template.reduce(CGPoint.zero) { CGPoint(x: $0.x + $1.x / n, y: $0.y + $1.y / n) }
        var sxx: CGFloat = 0, dot: CGFloat = 0, cross: CGFloat = 0
        for (s, d) in zip(src, template) {
            let x = s.x - ms.x, y = s.y - ms.y, u = d.x - md.x, v = d.y - md.y
            sxx += x * x + y * y
            dot += x * u + y * v
            cross += x * v - y * u
        }
        guard sxx > 0 else { return nil }
        let a = dot / sxx, b = cross / sxx
        let tx = md.x - (a * ms.x - b * ms.y), ty = md.y - (b * ms.x + a * ms.y)

        let side = Self.side
        guard let ctx = CGContext(data: nil, width: side, height: side, bitsPerComponent: 8, bytesPerRow: side * 4,
                                  space: CGColorSpaceCreateDeviceRGB(),
                                  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { return nil }
        ctx.interpolationQuality = .high
        // work in top-left coordinates for the crop and for the picture alike
        ctx.translateBy(x: 0, y: CGFloat(side))
        ctx.scaleBy(x: 1, y: -1)
        ctx.concatenate(CGAffineTransform(a: a, b: b, c: -b, d: a, tx: tx, ty: ty))
        ctx.translateBy(x: 0, y: CGFloat(image.height))
        ctx.scaleBy(x: 1, y: -1)
        ctx.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
        return ctx.makeImage()
    }
}

// MARK: - face prints

protocol PrintEngine {
    var name: String { get }
    /// Above this likeness two prints count as the same person.
    var threshold: Float { get }
    func print(_ crop: CGImage) -> [Float]?
}

/// An ArcFace-style Core ML model; it scales the pixels itself.
final class ModelEngine: PrintEngine {
    let name = "model"
    let threshold: Float = 0.45   // LFW, 13.11.2026: 2000 strangers max 0.367, Doc min 0.576 - room on both sides
    private let request: VNCoreMLRequest

    init?() {
        guard FileManager.default.fileExists(atPath: Store.model.path) || FileManager.default.fileExists(atPath: Store.compiled.path)
        else { return nil }
        if !FileManager.default.fileExists(atPath: Store.compiled.path) {
            guard let temp = try? MLModel.compileModel(at: Store.model),
                  (try? FileManager.default.moveItem(at: temp, to: Store.compiled)) != nil else { return nil }
        }
        let config = MLModelConfiguration()
        config.computeUnits = .all
        guard let ml = try? MLModel(contentsOf: Store.compiled, configuration: config),
              let vision = try? VNCoreMLModel(for: ml) else { return nil }
        request = VNCoreMLRequest(model: vision)
        request.imageCropAndScaleOption = .scaleFill
    }

    func print(_ crop: CGImage) -> [Float]? {
        try? VNImageRequestHandler(cgImage: crop, options: [:]).perform([request])
        guard let array = (request.results?.first as? VNCoreMLFeatureValueObservation)?.featureValue.multiArrayValue
        else { return nil }
        return Likeness.unit((0..<array.count).map { array[$0].floatValue })
    }
}

/// Apple's image feature print of the upright crop: a stand-in until a face model is installed.
final class FeaturePrintEngine: PrintEngine {
    let name = "featureprint"
    let threshold: Float = 0.80     // a first guess, the test pictures set the real value

    func print(_ crop: CGImage) -> [Float]? {
        let request = VNGenerateImageFeaturePrintRequest()
        try? VNImageRequestHandler(cgImage: crop, options: [:]).perform([request])
        guard let fp = request.results?.first, fp.elementType == .float else { return nil }
        let values = fp.data.withUnsafeBytes { Array($0.bindMemory(to: Float.self).prefix(fp.elementCount)) }
        return Likeness.unit(values)
    }
}

enum Likeness {
    static func unit(_ v: [Float]) -> [Float] {
        let norm = sqrt(v.reduce(0) { $0 + $1 * $1 })
        return norm > 0 ? v.map { $0 / norm } : v
    }

    static func cosine(_ a: [Float], _ b: [Float]) -> Float {
        guard a.count == b.count else { return -1 }
        return zip(a, b).reduce(0) { $0 + $1.0 * $1.1 }
    }
}

// MARK: - Doc's prints

struct DocPrints: Codable {
    var engine: String
    var prints: [[Float]]
}

final class Identity {
    let engine: PrintEngine
    private(set) var doc: [[Float]] = []

    init() {
        engine = ModelEngine() ?? FeaturePrintEngine()
        if let data = try? Data(contentsOf: Store.prints),
           let saved = try? JSONDecoder().decode(DocPrints.self, from: data), saved.engine == engine.name {
            doc = saved.prints
        }
    }

    var ready: Bool { !doc.isEmpty }

    /// How much this crop looks like Doc: the best likeness to one of his prints.
    func likeness(_ crop: CGImage, skipping skip: Int? = nil) -> Float? {
        guard let p = engine.print(crop) else { return nil }
        return doc.enumerated().filter { $0.offset != skip }.map { Likeness.cosine(p, $0.element) }.max()
    }

    /// The largest face in a frame with its likeness to Doc, nil without a clear face or prints.
    func look(_ image: CGImage) -> (cut: FaceCut, score: Float)? {
        guard ready, let cut = FaceCutter.largest(in: image), let score = likeness(cut.crop) else { return nil }
        return (cut, score)
    }

    /// "doc" or "other" for the largest face in a frame, nil without a clear face or prints.
    func who(_ image: CGImage) -> (answer: String, score: Float)? {
        guard let found = look(image) else { return nil }
        return (found.score >= engine.threshold ? "doc" : "other", found.score)
    }

    /// Doc's prints from every faces/doc-*.jpg; the others are kept for the test.
    @discardableResult
    func enroll() -> String {
        Store.prepare()
        let files = Self.pictures(prefix: "doc-")
        var prints: [[Float]] = []
        var lines: [String] = []
        for url in files {
            guard let image = Store.image(url), let cut = FaceCutter.largest(in: image) else {
                lines.append("\(url.lastPathComponent): no clear face"); continue
            }
            guard let p = engine.print(cut.crop) else { lines.append("\(url.lastPathComponent): no print"); continue }
            prints.append(p)
            lines.append(String(format: "%@: quality %.2f face %.0f%%", url.lastPathComponent, cut.quality, cut.share * 100))
        }
        doc = prints
        if let data = try? JSONEncoder().encode(DocPrints(engine: engine.name, prints: prints)) {
            try? data.write(to: Store.prints, options: .atomic)
            Store.lock(Store.prints)
        }
        lines.append("engine \(engine.name), \(prints.count) prints of Doc saved")
        return lines.joined(separator: "\n")
    }

    /// The test: every Doc picture against the other Doc pictures (leaving itself out), every
    /// other picture against all of Doc's. Numbers only.
    func evaluate() -> String {
        var lines = ["engine \(engine.name), threshold \(engine.threshold)"]
        let docs = Self.pictures(prefix: "doc-")
        for (i, url) in docs.enumerated() {
            guard let image = Store.image(url), let cut = FaceCutter.largest(in: image),
                  let s = likeness(cut.crop, skipping: i) else { lines.append("\(url.lastPathComponent): -"); continue }
            lines.append(String(format: "doc   %@ %.3f %@  (crop %.2f contrast %.2f quality %.2f share %.2f)",
                                url.lastPathComponent, s, s >= engine.threshold ? "ok" : "MISSED",
                                cut.light, cut.contrast, cut.quality, cut.share))
        }
        for url in Self.pictures(prefix: "other-") {
            guard let image = Store.image(url), let cut = FaceCutter.largest(in: image),
                  let s = likeness(cut.crop) else { lines.append("\(url.lastPathComponent): -"); continue }
            lines.append(String(format: "other %@ %.3f %@", url.lastPathComponent, s, s < engine.threshold ? "ok" : "TAKEN FOR DOC"))
        }
        return lines.joined(separator: "\n")
    }

    /// How a folder of Doc's frames (e.g. faces/dark/ from --measure --keep) scores against his prints: the spread,
    /// and how many would be below the threshold (and below 0.40). Numbers only.
    func scores(in folder: URL, prefix: String) -> String {
        let files = ((try? FileManager.default.contentsOfDirectory(at: folder, includingPropertiesForKeys: nil)) ?? [])
            .filter { ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) && $0.lastPathComponent.hasPrefix(prefix) }
            .sorted { $0.lastPathComponent < $1.lastPathComponent }
        var s: [Float] = []
        var noFace = 0
        for url in files {
            guard let image = Store.image(url), let cut = FaceCutter.largest(in: image), let v = likeness(cut.crop)
            else { noFace += 1; continue }
            s.append(v)
        }
        let sorted = s.sorted()
        func pct(_ p: Double) -> Float { sorted.isEmpty ? 0 : sorted[min(sorted.count - 1, Int(Double(sorted.count) * p))] }
        return String(format: "%d frames (%d without a clear face), %d prints: min %.3f  p10 %.3f  median %.3f  max %.3f"
                        + "  | below threshold %d, below 0.40 %d", sorted.count, noFace, doc.count, sorted.first ?? 0,
                      pct(0.1), pct(0.5), sorted.last ?? 0, sorted.filter { $0 < engine.threshold }.count,
                      sorted.filter { $0 < 0.40 }.count)
    }

    /// The safety test against strangers: the first picture of each person in a folder of folders (LFW's layout),
    /// at most `limit` people, each against all of Doc's prints. With `dim` every picture is first made to look
    /// like a camera frame in a dark room (a quarter of the light on an 8-bit sensor, read noise, then the gain
    /// that brings it back up). Numbers only, no names.
    func strangers(in folder: URL, limit: Int, dim: Bool) -> String {
        let fm = FileManager.default
        let people = ((try? fm.contentsOfDirectory(at: folder, includingPropertiesForKeys: nil)) ?? [])
            .filter { $0.hasDirectoryPath }.sorted { $0.lastPathComponent < $1.lastPathComponent }
        var scores: [Float] = []
        var noFace = 0
        for person in people {
            guard scores.count + noFace < limit else { break }
            guard let first = ((try? fm.contentsOfDirectory(at: person, includingPropertiesForKeys: nil)) ?? [])
                .filter({ ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) })
                .sorted(by: { $0.lastPathComponent < $1.lastPathComponent }).first,
                  var image = Store.image(first) else { continue }
            if dim, let dark = Self.darkRoom(image, seed: UInt64(scores.count + noFace + 1)) { image = dark }
            guard let cut = FaceCutter.largest(in: image), let s = likeness(cut.crop) else { noFace += 1; continue }
            scores.append(s)
        }
        let sorted = scores.sorted()
        func pct(_ p: Double) -> Float { sorted.isEmpty ? 0 : sorted[min(sorted.count - 1, Int(Double(sorted.count) * p))] }
        let top = sorted.suffix(5).reversed().map { String(format: "%.3f", $0) }.joined(separator: " ")
        return String(format: "strangers%@: %d faces (%d without a clear face), %d prints of Doc, threshold %.2f\n"
                        + "median %.3f  p99 %.3f  p99.9 %.3f  max %.3f  | >= 0.40: %d  >= threshold: %d\ntop 5: %@",
                      dim ? " (dark room)" : "", sorted.count, noFace, doc.count, engine.threshold,
                      pct(0.5), pct(0.99), pct(0.999), sorted.last ?? 0,
                      sorted.filter { $0 >= 0.40 }.count, sorted.filter { $0 >= engine.threshold }.count, top)
    }

    /// A picture as a webcam in a dark room sees it: a quarter of the light, rounded to 8 bits, read noise
    /// (sigma 1.5 levels), then four times the gain. Deterministic for a seed.
    static func darkRoom(_ image: CGImage, seed: UInt64) -> CGImage? {
        let w = image.width, h = image.height
        var px = [UInt8](repeating: 0, count: w * h * 4)
        var rng = seed &* 6364136223846793005 &+ 1442695040888963407
        func gauss() -> Float {
            func uniform() -> Float {
                rng = rng &* 6364136223846793005 &+ 1442695040888963407
                return (Float(rng >> 40) + 0.5) / Float(1 << 24)
            }
            return sqrt(-2 * log(uniform())) * cos(2 * .pi * uniform())
        }
        return px.withUnsafeMutableBytes { buf -> CGImage? in
            guard let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                                      space: CGColorSpaceCreateDeviceRGB(),
                                      bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { return nil }
            ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))
            let p = buf.bindMemory(to: UInt8.self)
            for i in 0..<(w * h * 4) where i % 4 != 3 {
                let dark = (Float(p[i]) / 4).rounded() + 1.5 * gauss()
                p[i] = UInt8(max(0, min(255, (dark * 4).rounded())))
            }
            return ctx.makeImage()
        }
    }

    /// Writes the upright crops next to the pictures (faces/crops/), to check the cutting by eye.
    func saveCrops() -> Int {
        let dir = Store.faces.appendingPathComponent("crops")
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        try? FileManager.default.setAttributes([.posixPermissions: 0o700], ofItemAtPath: dir.path)
        var n = 0
        for url in Self.pictures(prefix: "") {
            guard let image = Store.image(url), let cut = FaceCutter.largest(in: image),
                  let png = NSBitmapImageRep(cgImage: cut.crop).representation(using: .png, properties: [:]) else { continue }
            let out = dir.appendingPathComponent(url.deletingPathExtension().lastPathComponent + ".png")
            if (try? png.write(to: out, options: .atomic)) != nil { Store.lock(out); n += 1 }
        }
        return n
    }

    private static func pictures(prefix: String) -> [URL] {
        let all = (try? FileManager.default.contentsOfDirectory(at: Store.faces, includingPropertiesForKeys: nil)) ?? []
        return all.filter { ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) && $0.lastPathComponent.hasPrefix(prefix) }
            .sorted { $0.lastPathComponent < $1.lastPathComponent }
    }
}
