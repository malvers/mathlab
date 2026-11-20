// DocHere — knows whether Doc sits at the Mac: the D of DocBar is green while he does.
// Keyboard and mouse answer without the camera. After 30 s without input the camera runs for
// about two seconds, at most every 30 s, and Apple's Vision looks for a person on this Mac.
// Frames stay in memory and nothing is sent. Once Doc's face prints exist (face.swift), the
// frame that showed a person is also checked for whether it is Doc or somebody else.
//
// --ask answers once for a Solita call and quits: "here", "away", or "unknown" when the
// camera gives no answer. --ask-who looks in any case and answers "doc", "other", "away", "unknown".
// --snap <file> takes one photo for Doc's face prints (only into Application Support/DocHere).
// --enroll makes Doc's prints from faces/doc-*.jpg, --evaluate tests them on every picture
// there (faces/other-*.jpg are other people), --crops writes the upright face crops to check.
// --test <seconds> prints what Vision measures, to find the thresholds. No pictures either.
// --every <seconds> ignores keyboard and mouse and looks this often, to try it out.
//
// Watching on demand (13.11.2026, for DocPhoto: the photos show only while Doc sits here): while another tool asks
// for it (distributed notification de.docalvers.dochere.watch, renewed at least every 30 s), the camera stays on
// without pausing - one steady green light, no blinking - and one frame is checked every second on mains power,
// every 5 s on battery. Each answer ("doc", "other", "unknown", "away") goes out as de.docalvers.dochere.who,
// steadied (struct Steady) so that one bad frame in a dark room does not switch it.
// Screen locked, display asleep, DocHere off, or no request for 30 s: the camera stops.
//
// The background looks are steadied too (16.11.2026, one frame scored 0.104 and DocBar showed "!" for six minutes
// while Doc typed): each look's face goes through Pose and Steady like the watching, and a stranger needs two
// judgeable weak faces before "other" (Steady.confirm). While a stranger is suspected or shown, DocHere looks
// again after a few seconds even while Doc types (Timing.recheck, at most Timing.rechecks quick looks in a row),
// and while "!" stays it keeps the usual 30 s pace despite keyboard and mouse.
//
// Closeness (20.11.2026, Doc: the photos also showed while he stood a metre away): the watching estimates how far the
// face is from its face box (closeness.swift) and sends "near" and "cm" along with each answer. DocPhoto shows its
// photos only for "doc" and near; the answer itself, DocBar's D and "!" and --ask for Solita's calls are unchanged.
// --distance <seconds> prints the numbers per frame for the experiment. The threshold is the user default nearCm.

import AVFoundation
import Cocoa
import IOKit.ps
import ServiceManagement
import Vision

// MARK: - settings

enum Timing {
    static let input = 30.0     // keyboard or mouse used this recently means Doc is here
    static let poll = 2.0       // how often input and lock are checked
    static let again = 30.0     // the camera looks at most this often
    static let warmUp = 0.7     // the first frames are dark until the exposure has settled
    static let look = 2.0       // the camera looks this long, a person ends it earlier
    static let step = 0.25      // pause between two measured frames
    static let giveUp = 10.0    // the camera gets this long, Vision alone loads for about 2 s
    static let prompt = 60.0    // only the first run: time to answer the camera prompt
    static let recheck = 5.0    // a suspected stranger: the next look this soon, even while Doc types
    static let rechecks = 3     // quick looks in a row at most, then the usual pace again
}

enum Threshold {
    static let face: Float = 0.5
    static let body: Float = 0.5
    static let figure: Float = 0.05     // share of the frame that shows a person
}

// MARK: - log

/// The answer and why, never a picture.
func log(_ text: String) {
    let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("Logs/DocHere.log")
    let line = "\(ISO8601DateFormatter().string(from: Date())) \(text)\n"
    if let handle = try? FileHandle(forWritingTo: url) {
        handle.seekToEndOfFile()
        handle.write(Data(line.utf8))
        try? handle.close()
    } else {
        try? line.write(to: url, atomically: true, encoding: .utf8)
    }
}

// MARK: - seeing

struct Seen {
    var face: Float = 0
    var faces = 0                   // faces found with at least Threshold.face (two or more: Steady's crowd)
    var body: Float = 0
    var figure: Float = 0

    var light: Float = 0            // mean brightness of the whole frame, 0…1
    var lens: Double = 0            // tan of half the vertical field of view of this frame (Closeness), 0 if unknown

    var picture: CGImage? = nil     // the frame that showed the person, in memory only, for "who"

    var person: Bool { face >= Threshold.face || body >= Threshold.body || figure >= Threshold.figure }
    var text: String { String(format: "face %.2f body %.2f figure %.3f", face, body, figure) }
}

private let sharedContext = CIContext()

func picture(_ frame: CVPixelBuffer) -> CGImage? {
    let image = CIImage(cvPixelBuffer: frame)
    return sharedContext.createCGImage(image, from: image.extent)
}

/// Mean brightness of a frame, 0…1 (Core Image's area average, one pixel read back).
func brightness(_ frame: CVPixelBuffer) -> Float {
    let image = CIImage(cvPixelBuffer: frame)
    guard let out = CIFilter(name: "CIAreaAverage", parameters: [kCIInputImageKey: image,
                                                                  kCIInputExtentKey: CIVector(cgRect: image.extent)])?.outputImage
    else { return 0 }
    var px = [UInt8](repeating: 0, count: 4)
    sharedContext.render(out, toBitmap: &px, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1),
                         format: .RGBA8, colorSpace: nil)
    return (0.299 * Float(px[0]) + 0.587 * Float(px[1]) + 0.114 * Float(px[2])) / 255
}

enum Detector {
    /// The share of bright pixels in the person mask.
    private static func coverage(_ mask: CVPixelBuffer) -> Float {
        CVPixelBufferLockBaseAddress(mask, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(mask, .readOnly) }
        guard let base = CVPixelBufferGetBaseAddress(mask) else { return 0 }
        let width = CVPixelBufferGetWidth(mask), height = CVPixelBufferGetHeight(mask)
        let row = CVPixelBufferGetBytesPerRow(mask)
        var bright = 0
        for y in 0..<height {
            let line = base.advanced(by: y * row).assumingMemoryBound(to: UInt8.self)
            for x in 0..<width where line[x] > 127 { bright += 1 }
        }
        return Float(bright) / Float(max(width * height, 1))
    }

    static func measure(_ frame: CVPixelBuffer) -> Seen {
        let face = VNDetectFaceRectanglesRequest()
        let body = VNDetectHumanRectanglesRequest()
        let figure = VNGeneratePersonSegmentationRequest()
        figure.qualityLevel = .balanced
        figure.outputPixelFormat = kCVPixelFormatType_OneComponent8
        try? VNImageRequestHandler(cvPixelBuffer: frame, options: [:]).perform([face, body, figure])

        var seen = Seen()
        seen.face = face.results?.map(\.confidence).max() ?? 0
        seen.faces = face.results?.filter { $0.confidence >= Threshold.face }.count ?? 0
        seen.body = body.results?.map(\.confidence).max() ?? 0
        if let mask = figure.results?.first?.pixelBuffer { seen.figure = coverage(mask) }
        return seen
    }
}

/// One look through the camera. Reports once on the main queue, nil when there is no camera.
final class Eye: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let session = AVCaptureSession()
    private let queue = DispatchQueue(label: "de.docalvers.dochere.camera")
    private let testing: Double?
    private let snapTo: URL?
    private var report: ((Seen?) -> Void)?
    private var firstFrame: Date?
    private var nextLook = Date.distantPast
    private var best = Seen()

    init(testing: Double? = nil, snapTo: URL? = nil, report: @escaping (Seen?) -> Void) {
        self.testing = testing
        self.snapTo = snapTo
        self.report = report
    }

    /// Writes one frame as JPEG (only for --snap, which Doc starts himself for the face test).
    private func save(_ frame: CVPixelBuffer, to url: URL) -> Bool {
        let image = CIImage(cvPixelBuffer: frame)
        guard let cg = CIContext().createCGImage(image, from: image.extent),
              let data = NSBitmapImageRep(cgImage: cg).representation(using: .jpeg, properties: [.compressionFactor: 0.9])
        else { return false }
        return (try? data.write(to: url, options: .atomic)) != nil
    }

    func start() {
        DispatchQueue.main.asyncAfter(deadline: .now() + (testing ?? 0) + Timing.giveUp) { [weak self] in
            self?.deliver(nil)
        }
        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .unspecified),
              let input = try? AVCaptureDeviceInput(device: camera), session.canAddInput(input) else {
            deliver(nil)
            return
        }
        session.sessionPreset = snapTo == nil ? .medium : .high
        session.addInput(input)
        let output = AVCaptureVideoDataOutput()
        output.alwaysDiscardsLateVideoFrames = true
        output.setSampleBufferDelegate(self, queue: queue)
        session.addOutput(output)
        queue.async { [session] in session.startRunning() }
    }

    func captureOutput(_ output: AVCaptureOutput, didOutput buffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        let now = Date()
        if firstFrame == nil { firstFrame = now }
        guard let start = firstFrame, now.timeIntervalSince(start) >= Timing.warmUp, now >= nextLook,
              let frame = CMSampleBufferGetImageBuffer(buffer) else { return }
        nextLook = now.addingTimeInterval(Timing.step)

        if let url = snapTo {
            // the exposure needs a little longer than for a measurement
            guard now.timeIntervalSince(start) >= Timing.warmUp + 0.8 else { return }
            let seen = Detector.measure(frame)
            deliver(save(frame, to: url) ? seen : nil)
            return
        }

        let seen = Detector.measure(frame)
        best.face = max(best.face, seen.face)
        best.body = max(best.body, seen.body)
        best.figure = max(best.figure, seen.figure)
        let elapsed = now.timeIntervalSince(start) - Timing.warmUp

        if let seconds = testing {
            print(String(format: "%5.1f s  %@", elapsed, seen.text))
            fflush(stdout)
            if elapsed >= seconds { deliver(best) }
        } else if seen.person {
            var found = seen
            found.picture = picture(frame)
            deliver(found)
        } else if elapsed >= Timing.look {
            deliver(best)
        }
    }

    private func deliver(_ seen: Seen?) {
        DispatchQueue.main.async { [self] in
            guard let report = report else { return }
            self.report = nil
            queue.async { [session] in session.stopRunning() }
            report(seen)
        }
    }
}

/// The camera kept running for DocPhoto (see the header): one frame every `interval` seconds is measured, the rest
/// are dropped. The camera itself runs at its lowest frame rate.
final class Watcher: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let session = AVCaptureSession()
    private let queue = DispatchQueue(label: "de.docalvers.dochere.watch")
    private let report: (Seen) -> Void
    private var firstFrame: Date?
    private var next = Date.distantPast
    private var interval = 1.0              // only touched on `queue`
    private var camera: AVCaptureDevice?
    private var field = (width: 0, height: 0)   // the camera's active format, the full picture (only on `queue`)
    private(set) var format = ""            // the camera format the session picked and the frame size, for --distance

    init(report: @escaping (Seen) -> Void) { self.report = report }

    func start() -> Bool {
        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .unspecified),
              let input = try? AVCaptureDeviceInput(device: camera), session.canAddInput(input) else { return false }
        session.sessionPreset = .medium
        session.addInput(input)
        let output = AVCaptureVideoDataOutput()
        output.alwaysDiscardsLateVideoFrames = true
        output.setSampleBufferDelegate(self, queue: queue)
        session.addOutput(output)
        self.camera = camera
        // as few frames as the camera allows - one per second is all that is looked at
        if (try? camera.lockForConfiguration()) != nil {
            if let slow = camera.activeFormat.videoSupportedFrameRateRanges.map({ $0.minFrameRate }).min() {
                let fps = max(slow, 2)
                let d = CMTime(value: 1000, timescale: CMTimeScale(fps * 1000))
                camera.activeVideoMinFrameDuration = d
                camera.activeVideoMaxFrameDuration = d
            }
            camera.unlockForConfiguration()
        }
        queue.async { [session] in session.startRunning() }
        return true
    }

    func stop() { queue.async { [session] in session.stopRunning() } }

    func every(_ seconds: Double) { queue.async { [weak self] in self?.interval = seconds } }

    func captureOutput(_ output: AVCaptureOutput, didOutput buffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        let now = Date()
        if firstFrame == nil {
            firstFrame = now
            if let camera = camera, let frame = CMSampleBufferGetImageBuffer(buffer) {
                let dims = CMVideoFormatDescriptionGetDimensions(camera.activeFormat.formatDescription)
                field = (Int(dims.width), Int(dims.height))
                let text = "\(camera.localizedName), format \(dims.width) x \(dims.height), frames "
                    + "\(CVPixelBufferGetWidth(frame)) x \(CVPixelBufferGetHeight(frame))"
                DispatchQueue.main.async { [weak self] in self?.format = text }
            }
        }
        guard let start = firstFrame, now.timeIntervalSince(start) >= Timing.warmUp, now >= next,
              let frame = CMSampleBufferGetImageBuffer(buffer) else { return }
        next = now.addingTimeInterval(interval)
        var seen = Detector.measure(frame)
        seen.light = brightness(frame)
        seen.lens = Closeness.tanHalfVertical(width: CVPixelBufferGetWidth(frame), height: CVPixelBufferGetHeight(frame),
                                              fieldWidth: field.width, fieldHeight: field.height)
        if seen.person { seen.picture = picture(frame) }
        DispatchQueue.main.async { [report] in report(seen) }
    }
}

// MARK: - steady answers

/// Whether a face is turned so that its score can say "not Doc" (15.11.2026). The camera sits on the MacBook to Doc's
/// side, so his usual pose is already turned: looking at the big screen yaw 35..60 degrees, scores 0.68 on average;
/// turned further, nearly in profile (65..80), 3 of 4 frames fell below 0.45 although it was him. A face outside this
/// range (or looking far up or down) that does not match is "unclear" - it keeps the answer. A match counts at any
/// angle, as before, so nobody is taken for Doc more easily; and a stranger facing the Mac (yaw near 0) is judged.
enum Pose {
    static let yaw: ClosedRange<Float> = -25...60
    static let pitch: Float = 25

    static func judgeable(_ cut: FaceCut) -> Bool {
        (cut.yaw.isNaN || yaw.contains(cut.yaw)) && (cut.pitch.isNaN || abs(cut.pitch) <= pitch)
    }

    /// The frame Steady gets for a face with this likeness.
    static func frame(_ cut: FaceCut, score: Float, threshold: Float) -> Steady.Frame {
        score >= threshold || judgeable(cut) ? .face(score) : .unclear
    }
}

// MARK: - app

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var bar: DocBarClient?
    private var eye: Eye?
    private var here = false
    private var nextLook = Date.distantPast
    private var inputCounts = Timing.input
    private var lookEvery = Timing.again
    private var published = ""
    private var who = ""                    // "doc", "other" or "" when nobody or no prints
    private lazy var identity = Identity()
    private var watcher: Watcher?
    private var watchWanted = Date.distantPast   // a tool asked for watching until then
    private var lastWatch = ""                   // the last answer, logged only when it changes
    private var steady = Steady()                // the watching's answer, changed only when frames agree
    private var held = 0                         // frames since the last change that Steady held back
    private var seenSteady = Steady(confirm: 2, sticky: false)  // the background looks' answer, steadied like the watching
    private var rechecks = Timing.rechecks       // quick looks left while a stranger is suspected
    private var recheckAt: Date?                 // a quick look is due then, even while Doc types
    private var near = Near()                    // the watching's closeness, steadied (closeness.swift)
    private var lastNear: Bool?                  // logged only when it changes
    private var minute = (start: Date(), cm: [Double](), frames: 0)   // the watching's distances, one log line a minute
    static let whoNote = Notification.Name("de.docalvers.dochere.who")
    static let watchNote = Notification.Name("de.docalvers.dochere.watch")

    private var onBattery: Bool {
        guard let info = IOPSCopyPowerSourcesInfo()?.takeRetainedValue(),
              let type = IOPSGetProvidingPowerSourceType(info)?.takeUnretainedValue() else { return false }
        return (type as String) == "Battery Power"
    }

    /// "doc" or "other" for the person in this look, logged with the likeness and head pose (numbers only).
    /// Only for --ask-who, which answers from one look; the background steadies its looks (judge).
    private func identify(_ seen: Seen?) -> String {
        guard let image = seen?.picture, identity.ready, let found = identity.look(image) else { return "" }
        let answer = found.score >= identity.engine.threshold ? "doc" : "other"
        log(String(format: "who: %@ (%@ %.3f, yaw %.0f, pitch %.0f)", answer, identity.engine.name, found.score,
                   found.cut.yaw, found.cut.pitch))
        return answer
    }

    private var enabled: Bool {
        get { UserDefaults.standard.object(forKey: "enabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "enabled") }
    }

    private var startsAtLogin: Bool { SMAppService.mainApp.status == .enabled }

    private var screenLocked: Bool {
        (CGSessionCopyCurrentDictionary() as? [String: Any])?["CGSSessionScreenIsLocked"] as? Bool ?? false
    }

    private var secondsSinceInput: Double {
        CGEventSource.secondsSinceLastEventType(.hidSystemState, eventType: CGEventType(rawValue: ~0)!)
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        let args = CommandLine.arguments
        if let at = args.firstIndex(of: "--test"), at + 1 < args.count, let seconds = Double(args[at + 1]) {
            test(seconds)
        } else if let at = args.firstIndex(of: "--measure"), at + 1 < args.count, let seconds = Double(args[at + 1]) {
            measure(seconds, keep: args.contains("--keep"))
        } else if let at = args.firstIndex(of: "--distance"), at + 1 < args.count, let seconds = Double(args[at + 1]) {
            distanceRun(seconds)
        } else if let at = args.firstIndex(of: "--snap"), at + 1 < args.count {
            snap(URL(fileURLWithPath: args[at + 1]))
        } else if args.contains("--enroll") {
            print(identity.enroll()); exit(0)
        } else if args.contains("--evaluate") {
            print(identity.evaluate()); exit(0)
        } else if let at = args.firstIndex(of: "--score"), at + 1 < args.count {
            let prefix = args.firstIndex(of: "--prefix").flatMap { $0 + 1 < args.count ? args[$0 + 1] : nil } ?? ""
            print(identity.scores(in: URL(fileURLWithPath: args[at + 1]), prefix: prefix)); exit(0)
        } else if let at = args.firstIndex(of: "--strangers"), at + 1 < args.count {
            let limit = args.firstIndex(of: "--limit").flatMap { $0 + 1 < args.count ? Int(args[$0 + 1]) : nil } ?? 2000
            print(identity.strangers(in: URL(fileURLWithPath: args[at + 1]), limit: limit, dim: args.contains("--dim")))
            exit(0)
        } else if args.contains("--crops") {
            print("\(identity.saveCrops()) crops written"); exit(0)
        } else if args.contains("--ask-who") {
            answerOnce(who: true)
        } else if args.contains("--ask") {
            answerOnce()
        } else {
            if let at = args.firstIndex(of: "--every"), at + 1 < args.count, let seconds = Double(args[at + 1]) {
                inputCounts = 0
                lookEvery = seconds
            }
            stayRunning()
        }
    }

    func applicationWillTerminate(_ note: Notification) {
        bar?.withdraw()
    }

    private func withCamera(_ go: @escaping (Bool) -> Void) {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            go(true)
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                DispatchQueue.main.async { go(granted) }
            }
        default:
            go(false)
        }
    }

    private func use(_ new: Eye) {
        eye = new
        new.start()
    }

    // MARK: answering once

    private func test(_ seconds: Double) {
        withCamera { [weak self] allowed in
            guard allowed else { self?.finish("unknown", "camera not allowed"); return }
            self?.use(Eye(testing: seconds) { _ in self?.finish("unknown", "test ended") })
        }
    }

    /// --measure <seconds>: the steady camera of the watching, one line per frame with everything the decision uses -
    /// the frame's brightness, person, and for a clear face its crop's brightness, contrast, Vision's quality and the
    /// likeness to Doc. Numbers only. With --keep the frames that showed a person go to faces/dark/ (700), to tune
    /// on them; nothing else is written.
    private func measure(_ seconds: Double, keep: Bool) {
        let dir = Store.faces.appendingPathComponent("dark")
        if keep {
            Store.prepare()
            try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            try? FileManager.default.setAttributes([.posixPermissions: 0o700], ofItemAtPath: dir.path)
        }
        let stamp = Int(Date().timeIntervalSince1970)
        withCamera { [weak self] allowed in
            guard let self = self else { return }
            guard allowed else { self.finish("unknown", "camera not allowed"); return }
            let start = Date()
            var n = 0
            var steady = Steady()
            let threshold = self.identity.engine.threshold
            print("engine \(self.identity.engine.name), threshold \(threshold), \(self.identity.doc.count) prints")
            let w = Watcher { [weak self] seen in
                guard let self = self else { return }
                let t = Date().timeIntervalSince(start)
                var line = String(format: "%5.1f s  frame %.2f  %@", t, seen.light, seen.text)
                var frame = Steady.Frame.nobody
                var turned = false
                if let image = seen.picture {
                    if let found = self.identity.look(image) {
                        let c = found.cut
                        frame = Pose.frame(c, score: found.score, threshold: threshold)
                        turned = Self.turned(c)
                        let d = self.distance(c, lens: seen.lens)
                        line += String(format: " | crop %.2f contrast %.2f quality %.2f share %.2f yaw %.0f pitch %.0f | %@ cm | score %.3f",
                                        c.light, c.contrast, c.quality, c.share, c.yaw, c.pitch, Self.cm(d.box), found.score)
                    } else {
                        frame = .unclear
                        line += " | no clear face"
                    }
                    if keep, let data = NSBitmapImageRep(cgImage: image).representation(using: .jpeg, properties: [.compressionFactor: 0.9]) {
                        n += 1
                        let url = dir.appendingPathComponent(String(format: "frame-%d-%03d.jpg", stamp, n))
                        if (try? data.write(to: url, options: .atomic)) != nil { Store.lock(url) }
                    }
                } else {
                    line += " | nobody"
                }
                line += " -> " + steady.add(frame, threshold: threshold, turned: turned, crowd: seen.faces >= 2)
                print(line)
                fflush(stdout)
                if t >= seconds { self.finish("unknown", "measure ended") }
            }
            if w.start() { self.watcher = w } else { self.finish("unknown", "no camera") }
        }
    }

    /// The face's distance in cm, from the face box and from the pupils (nil without an answer). See Closeness.
    private func distance(_ cut: FaceCut, lens: Double) -> (box: Double?, eyes: Double?) {
        let scale = NearSettings.scale
        return (Closeness.fromBox(Double(cut.box), tanHalfV: lens, scale: scale),
                Closeness.fromEyes(Double(cut.eyes), yaw: Double(cut.yaw), tanHalfV: lens, scale: scale))
    }

    /// A face turned beyond Steady.turnedYaw counts less for leaving "doc".
    private static func turned(_ cut: FaceCut) -> Bool { !cut.yaw.isNaN && abs(cut.yaw) > Steady.turnedYaw }

    private static func cm(_ value: Double?) -> String { value.map { String(format: "%3.0f", $0) } ?? "  -" }

    /// --distance <seconds>: the experiment for the closeness (20.11.2026). The watching camera at its pace on mains,
    /// one line per frame: clock time, seconds, the distance from the face box and from the pupils, head turn,
    /// likeness, recognised yes/no, the steady answer and near/far - the same steps DocPhoto gets, with the current
    /// settings (NearSettings). Printed and appended to ~/Library/Logs/DocHere-distance.log, at the end a summary in
    /// 5 s steps. Numbers only, no picture is kept.
    private func distanceRun(_ seconds: Double) {
        let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("Logs/DocHere-distance.log")
        func out(_ text: String) {
            print(text)
            fflush(stdout)
            let data = Data((text + "\n").utf8)
            if let handle = try? FileHandle(forWritingTo: url) {
                handle.seekToEndOfFile(); handle.write(data); try? handle.close()
            } else { try? data.write(to: url) }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds + Timing.prompt) { [weak self] in
            out("# no camera frames in time")     // the camera never answered: do not hang
            self?.finish("unknown", "distance: no frames")
        }
        withCamera { [weak self] allowed in
            guard let self = self else { return }
            guard allowed else { self.finish("unknown", "camera not allowed"); return }
            let start = Date()
            let threshold = self.identity.engine.threshold
            let nearCm = NearSettings.threshold, margin = NearSettings.margin
            var steady = Steady()
            var near = Near()
            var bins: [Int: (cm: [Double], doc: Int, near: Int, frames: Int)] = [:]
            var told = false
            let clock = DateFormatter()
            clock.dateFormat = "HH:mm:ss"
            out(String(format: "# DocHere distance %@, %.0f s: near at <= %.0f cm, far beyond %.0f cm, scale %.2f "
                        + "(field of view %.0f deg, face box %.1f cm), likeness threshold %.2f",
                       ISO8601DateFormatter().string(from: start), seconds, nearCm, nearCm + margin, NearSettings.scale,
                       Closeness.fieldOfView, Closeness.faceBox, threshold))
            out("# time        t   box cm  eyes cm  yaw  score  doc  faces  -> steady, near")
            let w = Watcher { [weak self] seen in
                guard let self = self else { return }
                if !told, let format = self.watcher?.format, !format.isEmpty { out("# " + format); told = true }
                let t = Date().timeIntervalSince(start)
                var frame = Steady.Frame.nobody
                var d: (box: Double?, eyes: Double?) = (nil, nil)
                var yaw = "   -", score = "    -", recognised = " -"
                var turned = false
                if let image = seen.picture {
                    if let found = self.identity.look(image) {
                        frame = Pose.frame(found.cut, score: found.score, threshold: threshold)
                        turned = Self.turned(found.cut)
                        d = self.distance(found.cut, lens: seen.lens)
                        yaw = found.cut.yaw.isNaN ? "   -" : String(format: "%4.0f", found.cut.yaw)
                        score = String(format: "%.3f", found.score)
                        recognised = found.score >= threshold ? "yes" : " no"
                    } else {
                        frame = .unclear
                        recognised = " ?"         // a person without a clear face
                    }
                }
                let answer = steady.add(frame, threshold: threshold, turned: turned, crowd: seen.faces >= 2)
                if answer == "away" { near.reset() }
                let isNear = near.add(d.box.map { Near.Frame.distance($0) } ?? .unclear, threshold: nearCm, margin: margin)
                out(String(format: "%@ %5.1f s  %@     %@     %@  %@  %@  %d  -> %@, %@", clock.string(from: Date()), t,
                           Self.cm(d.box), Self.cm(d.eyes), yaw, score, recognised, seen.faces, answer, isNear ? "near" : "far"))
                var bin = bins[Int(t / 5)] ?? ([], 0, 0, 0)
                if let cm = d.box { bin.cm.append(cm) }
                if recognised == "yes" { bin.doc += 1 }
                if isNear { bin.near += 1 }
                bin.frames += 1
                bins[Int(t / 5)] = bin
                guard t >= seconds else { return }
                out("# summary in 5 s steps: median distance (face box), recognised as Doc, near")
                for key in bins.keys.sorted() {
                    let b = bins[key]!
                    let sorted = b.cm.sorted()
                    let median = sorted.isEmpty ? "  -" : String(format: "%3.0f", sorted[sorted.count / 2])
                    let range = sorted.isEmpty ? "" : String(format: " (%.0f..%.0f)", sorted.first!, sorted.last!)
                    out(String(format: "# %3d-%3d s: %@ cm%@, doc %d/%d, near %d/%d", key * 5, key * 5 + 5, median, range,
                               b.doc, b.frames, b.near, b.frames))
                }
                self.finish("done", "distance ended")
            }
            if w.start() { self.watcher = w } else { self.finish("unknown", "no camera") }
        }
    }

    /// --snap <file>: one photo for the face test. The file must lie outside the repo, the
    /// folder is made private (700). The log gets only that a photo was taken, never where.
    private func snap(_ url: URL) {
        let dir = url.deletingLastPathComponent()
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true,
                                                 attributes: [.posixPermissions: 0o700])
        withCamera { [weak self] allowed in
            guard allowed else { self?.finish("unknown", "camera not allowed"); return }
            self?.use(Eye(snapTo: url) { seen in
                guard let seen = seen else { self?.finish("unknown", "snap failed"); return }
                self?.finish("snap", "photo taken, " + seen.text)
            })
        }
    }

    /// --ask prints here/away/unknown (Solita's watcher relies on that). --ask-who always looks
    /// and prints doc, other, away or unknown (unknown also when no prints of Doc exist yet).
    private func answerOnce(who: Bool = false) {
        if screenLocked { finish("away", "screen locked"); return }
        let idle = secondsSinceInput
        if idle < Timing.input && !who { finish("here", String(format: "input %.0f s ago", idle)); return }

        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.prompt) { [weak self] in
            self?.finish("unknown", "no camera answer")
        }
        withCamera { [weak self] allowed in
            guard allowed else { self?.finish("unknown", "camera not allowed"); return }
            self?.use(Eye { seen in
                guard let seen = seen, let self = self else { self?.finish("unknown", "no camera"); return }
                let found = seen.person ? self.identify(seen) : ""
                if who {
                    self.finish(seen.person ? (found.isEmpty ? "unknown" : found) : "away", "camera: " + seen.text)
                } else {
                    self.finish(seen.person ? "here" : "away", "camera: " + seen.text)
                }
            })
        }
    }

    private func finish(_ answer: String, _ why: String) {
        print(answer)
        log("\(answer) (\(why))")
        exit(0)
    }

    // MARK: staying around

    private func stayRunning() {
        bar = DocBarClient(id: "de.docalvers.dochere", name: "DocHere",
                           symbol: "camera.fill", rank: 30) { [weak self] item in self?.clicked(item) }
        if !UserDefaults.standard.bool(forKey: "loginSet") {
            UserDefaults.standard.set(true, forKey: "loginSet")
            try? SMAppService.mainApp.register()
        }
        DistributedNotificationCenter.default().addObserver(forName: AppDelegate.watchNote, object: nil, queue: .main) {
            [weak self] note in
            let on = (note.userInfo?["on"] as? String) == "1"
            self?.watchWanted = on ? Date().addingTimeInterval(30) : .distantPast
            self?.tick()
        }
        Timer.scheduledTimer(withTimeInterval: Timing.poll, repeats: true) { [weak self] _ in self?.tick() }
        tick()
    }

    /// Starts or stops the steady camera for DocPhoto; on battery it looks every 5 s instead of every second.
    private func manageWatch() {
        let wanted = enabled && Date() < watchWanted && !screenLocked && CGDisplayIsAsleep(CGMainDisplayID()) == 0
        if wanted, watcher == nil, eye == nil {
            withCamera { [weak self] allowed in
                guard let self = self, allowed, self.watcher == nil else { return }
                let w = Watcher { [weak self] seen in self?.watched(seen) }
                if w.start() {
                    self.watcher = w; self.steady = Steady(); self.held = 0
                    self.near.reset(); self.lastNear = nil; self.minute = (Date(), [], 0)
                    log("watching for DocPhoto")
                }
            }
        } else if !wanted, let w = watcher {
            w.stop()
            watcher = nil
            lastWatch = ""
            steady = Steady()
            logMinute()
            near.reset()
            lastNear = nil
            log("watching stopped")
            tellWho("away")       // DocPhoto hides at once
        }
        watcher?.every(onBattery ? 5 : 1)
    }

    /// One frame of the watching, steadied (see Steady). The log gets each change with the frame's numbers and how
    /// many frames since the last change disagreed with the answer and were held back.
    private func watched(_ seen: Seen) {
        guard watcher != nil else { return }
        var frame = Steady.Frame.nobody
        var score: Float?
        var yaw = Float.nan
        var cm: Double?
        var turned = false
        if seen.person {
            if let image = seen.picture, let found = identity.look(image) {
                frame = Pose.frame(found.cut, score: found.score, threshold: identity.engine.threshold)
                score = found.score
                yaw = found.cut.yaw
                turned = Self.turned(found.cut)
                cm = distance(found.cut, lens: seen.lens).box
            }
            else { frame = .unclear }
        }
        let answer = steady.add(frame, threshold: identity.engine.threshold, turned: turned, crowd: seen.faces >= 2)
        // closeness, a signal of its own next to the answer: DocPhoto wants "doc" and near, everything else keeps
        // the answer's meaning (closeness.swift)
        if answer == "away" { near.reset() }
        let threshold = NearSettings.threshold
        let isNear = near.add(cm.map { Near.Frame.distance($0) } ?? .unclear, threshold: threshold, margin: NearSettings.margin)
        if isNear != lastNear {
            if lastNear != nil || isNear {
                log(String(format: "near: %@ (%@threshold %.0f cm)", isNear ? "yes" : "no",
                           cm.map { String(format: "%.0f cm, ", $0) } ?? "no clear face, ", threshold))
            }
            lastNear = isNear
        }
        minute.frames += 1
        if let cm = cm { minute.cm.append(cm) }
        if Date().timeIntervalSince(minute.start) >= 60 { logMinute() }
        let raw: String
        switch frame {
        case .nobody: raw = "away"
        case .unclear: raw = "unknown"
        case .face(let s): raw = s >= identity.engine.threshold ? "doc" : "other"
        }
        if raw != answer { held += 1 }
        update(answer != "away", "watching")
        who = answer == "doc" || answer == "other" ? answer : ""
        if answer != lastWatch {
            log(String(format: "watch: %@ (%@%@light %.2f, %d frames held before)", answer,
                       score.map { String(format: "score %.3f, yaw %.0f, ", $0, yaw) } ?? "",
                       cm.map { String(format: "%.0f cm, ", $0) } ?? "", seen.light, held))
            lastWatch = answer
            held = 0
        }
        tellWho(answer, near: isNear, cm: cm)
        publish()
    }

    /// One line a minute while watching: how far the face was (numbers only), to see Doc's usual distances.
    private func logMinute() {
        defer { minute = (Date(), [], 0) }
        guard minute.frames > 0 else { return }
        let sorted = minute.cm.sorted()
        if sorted.isEmpty {
            log("distance: no clear face in \(minute.frames) frames, near \(near.near ? "yes" : "no")")
        } else {
            log(String(format: "distance: median %.0f cm (%.0f..%.0f, %d of %d frames with a face), near %@, threshold %.0f cm",
                       sorted[sorted.count / 2], sorted.first!, sorted.last!, sorted.count, minute.frames,
                       near.near ? "yes" : "no", NearSettings.threshold))
        }
    }

    /// The watching's answer for DocPhoto. "near" (1/0) and "cm" (the face box's distance, empty without a clear face)
    /// ride along as a signal of their own, so "answer" keeps its meaning for everybody else.
    private func tellWho(_ answer: String, near: Bool = false, cm: Double? = nil) {
        DistributedNotificationCenter.default().postNotificationName(
            AppDelegate.whoNote, object: "de.docalvers.dochere",
            userInfo: ["answer": answer, "near": near ? "1" : "0", "cm": cm.map { String(format: "%.0f", $0) } ?? ""],
            deliverImmediately: true)
    }

    /// When the next look is due although Doc types: soon after a suspected stranger (Timing.recheck), and at the
    /// usual pace while DocBar shows "!" - so a wrong "!" does not stay for as long as Doc works.
    private var lookDespiteInput: Date? { recheckAt ?? (who == "other" ? nextLook : nil) }

    private func tick() {
        manageWatch()
        if enabled && eye == nil && watcher == nil {
            let awake = CGDisplayIsAsleep(CGMainDisplayID()) == 0
            if screenLocked {
                update(false, "screen locked")
            } else if awake, let due = lookDespiteInput, Date() >= due {
                look()
            } else if secondsSinceInput < inputCounts {
                update(true, "input")
            } else if !awake {
                update(false, "display asleep")     // nobody needs the camera in a dark room
            } else if Date() >= nextLook {
                look()
            }
        }
        publish()
    }

    private func look() {
        let quick = recheckAt != nil
        recheckAt = nil
        nextLook = Date().addingTimeInterval(lookEvery)
        withCamera { [weak self] allowed in
            guard allowed else { self?.update(false, "camera not allowed"); return }
            self?.use(Eye { seen in
                guard let self = self else { return }
                self.eye = nil
                // keyboard or mouse still mean here, also when the camera missed Doc in a quick look
                self.update((seen?.person ?? false) || self.secondsSinceInput < self.inputCounts,
                            seen.map { "camera: " + $0.text } ?? "no camera")
                log((quick ? "looked again: " : "looked: ") + (seen?.text ?? "no camera"))
                self.judge(seen)
                self.publish()
            })
        }
    }

    /// Who the background look saw, steadied like the watching (Pose, then Steady with confirm 2). The log gets the
    /// likeness, the head pose and the steady answer. A look without a person (or without a camera) ends it at once,
    /// as before: the background's "away" needs no steadying, and Doc coming back must not inherit an old "!".
    private func judge(_ seen: Seen?) {
        guard let seen = seen, seen.person else {
            seenSteady = Steady(confirm: 2, sticky: false)
            rechecks = Timing.rechecks
            recheckAt = nil
            who = ""
            return
        }
        let threshold = identity.engine.threshold
        var frame = Steady.Frame.unclear
        var line: String?
        if let image = seen.picture, identity.ready, let found = identity.look(image) {
            frame = Pose.frame(found.cut, score: found.score, threshold: threshold)
            var turned = ""
            if case .unclear = frame { turned = ", turned too far" }
            line = String(format: "who: %@ (%@ %.3f, yaw %.0f, pitch %.0f%@)", found.score >= threshold ? "doc" : "other",
                          identity.engine.name, found.score, found.cut.yaw, found.cut.pitch, turned)
        }
        let answer = seenSteady.add(frame, threshold: threshold)
        who = answer == "doc" || answer == "other" ? answer : ""
        let suspect = answer == "other" || seenSteady.pending
        if suspect && rechecks > 0 {
            rechecks -= 1
            recheckAt = Date().addingTimeInterval(Timing.recheck)
        } else if !suspect {
            rechecks = Timing.rechecks
        }
        if let line = line {
            log(line + " -> " + (seenSteady.pending ? answer + " (weak face, other needs a second one)" : answer))
        }
    }

    private func update(_ now: Bool, _ why: String) {
        guard now != here else { return }
        here = now
        log("\(now ? "here" : "away") (\(why))")
    }

    private func publish() {
        let items = [DocBarItem("toggle", "Active", state: enabled),
                     DocBarItem("login", "Start at login", state: startsAtLogin),
                     DocBarItem("quit", "Quit DocHere")]
        let status = !enabled ? "off" : !here ? "Doc is away" : who == "other" ? "Somebody else is here" : "Doc is here"
        let key = "\(status)|\(startsAtLogin)"
        guard key != published else { return }
        published = key
        bar?.publish(status: status, items: items, primary: "toggle", here: enabled && here, toggle: enabled,
                     other: enabled && here && who == "other")     // DocBar shows "!" instead of the D
    }

    private func clicked(_ item: String) {
        switch item {
        case "toggle": enabled.toggle()
        case "login":
            if startsAtLogin { try? SMAppService.mainApp.unregister() }
            else { try? SMAppService.mainApp.register() }
        case "quit": NSApp.terminate(nil)
        default: break
        }
        publish()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
