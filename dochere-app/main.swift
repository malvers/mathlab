// DocHere — knows whether Doc sits at the Mac: the D of DocBar is green while he does.
// Keyboard and mouse answer without the camera. After 30 s without input the camera runs for
// about two seconds, at most every 30 s, and Apple's Vision looks for a person on this Mac.
// Frames stay in memory, nothing is saved or sent, and it only tells that somebody is there,
// never who.
//
// --ask answers once for a Solita call and quits: "here", "away", or "unknown" when the
// camera gives no answer.
// --test <seconds> prints what Vision measures, to find the thresholds. No pictures either.
// --every <seconds> ignores keyboard and mouse and looks this often, to try it out.

import AVFoundation
import Cocoa
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
    var body: Float = 0
    var figure: Float = 0

    var person: Bool { face >= Threshold.face || body >= Threshold.body || figure >= Threshold.figure }
    var text: String { String(format: "face %.2f body %.2f figure %.3f", face, body, figure) }
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
    private var report: ((Seen?) -> Void)?
    private var firstFrame: Date?
    private var nextLook = Date.distantPast
    private var best = Seen()

    init(testing: Double? = nil, report: @escaping (Seen?) -> Void) {
        self.testing = testing
        self.report = report
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
        session.sessionPreset = .medium
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
            deliver(seen)
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

// MARK: - app

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var bar: DocBarClient?
    private var eye: Eye?
    private var here = false
    private var nextLook = Date.distantPast
    private var inputCounts = Timing.input
    private var lookEvery = Timing.again
    private var published = ""

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

    private func answerOnce() {
        if screenLocked { finish("away", "screen locked"); return }
        let idle = secondsSinceInput
        if idle < Timing.input { finish("here", String(format: "input %.0f s ago", idle)); return }

        DispatchQueue.main.asyncAfter(deadline: .now() + Timing.prompt) { [weak self] in
            self?.finish("unknown", "no camera answer")
        }
        withCamera { [weak self] allowed in
            guard allowed else { self?.finish("unknown", "camera not allowed"); return }
            self?.use(Eye { seen in
                guard let seen = seen else { self?.finish("unknown", "no camera"); return }
                self?.finish(seen.person ? "here" : "away", "camera: " + seen.text)
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
        Timer.scheduledTimer(withTimeInterval: Timing.poll, repeats: true) { [weak self] _ in self?.tick() }
        tick()
    }

    private func tick() {
        if enabled && eye == nil {
            if screenLocked {
                update(false, "screen locked")
            } else if secondsSinceInput < inputCounts {
                update(true, "input")
            } else if CGDisplayIsAsleep(CGMainDisplayID()) != 0 {
                update(false, "display asleep")     // nobody needs the camera in a dark room
            } else if Date() >= nextLook {
                look()
            }
        }
        publish()
    }

    private func look() {
        nextLook = Date().addingTimeInterval(lookEvery)
        withCamera { [weak self] allowed in
            guard allowed else { self?.update(false, "camera not allowed"); return }
            self?.use(Eye { seen in
                self?.eye = nil
                self?.update(seen?.person ?? false, seen.map { "camera: " + $0.text } ?? "no camera")
                log("looked: " + (seen?.text ?? "no camera"))
            })
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
        let status = !enabled ? "off" : here ? "Doc is here" : "Doc is away"
        let key = "\(status)|\(startsAtLogin)"
        guard key != published else { return }
        published = key
        bar?.publish(status: status, items: items, primary: "toggle", here: enabled && here, toggle: enabled)
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
