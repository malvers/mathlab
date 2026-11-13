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
        return FaceCut(crop: crop, quality: score, share: Float(face.boundingBox.width))
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

    /// "doc" or "other" for the largest face in a frame, nil without a clear face or prints.
    func who(_ image: CGImage) -> (answer: String, score: Float)? {
        guard ready, let cut = FaceCutter.largest(in: image), let score = likeness(cut.crop) else { return nil }
        return (score >= engine.threshold ? "doc" : "other", score)
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
            lines.append(String(format: "doc   %@ %.3f %@", url.lastPathComponent, s, s >= engine.threshold ? "ok" : "MISSED"))
        }
        for url in Self.pictures(prefix: "other-") {
            guard let image = Store.image(url), let cut = FaceCutter.largest(in: image),
                  let s = likeness(cut.crop) else { lines.append("\(url.lastPathComponent): -"); continue }
            lines.append(String(format: "other %@ %.3f %@", url.lastPathComponent, s, s < engine.threshold ? "ok" : "TAKEN FOR DOC"))
        }
        return lines.joined(separator: "\n")
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
