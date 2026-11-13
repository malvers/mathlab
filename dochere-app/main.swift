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
// every 5 s on battery. Each answer ("doc", "other", "unknown", "away") goes out as de.docalvers.dochere.who.
// Screen locked, display asleep, DocHere off, or no request for 30 s: the camera stops.

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

    var picture: CGImage? = nil     // the frame that showed the person, in memory only, for "who"

    var person: Bool { face >= Threshold.face || body >= Threshold.body || figure >= Threshold.figure }
    var text: String { String(format: "face %.2f body %.2f figure %.3f", face, body, figure) }
}

func picture(_ frame: CVPixelBuffer) -> CGImage? {
    let image = CIImage(cvPixelBuffer: frame)
    return CIContext().createCGImage(image, from: image.extent)
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
        if firstFrame == nil { firstFrame = now }
        guard let start = firstFrame, now.timeIntervalSince(start) >= Timing.warmUp, now >= next,
              let frame = CMSampleBufferGetImageBuffer(buffer) else { return }
        next = now.addingTimeInterval(interval)
        var seen = Detector.measure(frame)
        if seen.person { seen.picture = picture(frame) }
        DispatchQueue.main.async { [report] in report(seen) }
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
    static let whoNote = Notification.Name("de.docalvers.dochere.who")
    static let watchNote = Notification.Name("de.docalvers.dochere.watch")

    private var onBattery: Bool {
        guard let info = IOPSCopyPowerSourcesInfo()?.takeRetainedValue(),
              let type = IOPSGetProvidingPowerSourceType(info)?.takeUnretainedValue() else { return false }
        return (type as String) == "Battery Power"
    }

    /// "doc" or "other" for the person in this look, logged with the likeness (numbers only).
    private func identify(_ seen: Seen?) -> String {
        guard let image = seen?.picture, identity.ready, let found = identity.who(image) else { return "" }
        log(String(format: "who: %@ (%@ %.3f)", found.answer, identity.engine.name, found.score))
        return found.answer
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
        } else if let at = args.firstIndex(of: "--snap"), at + 1 < args.count {
            snap(URL(fileURLWithPath: args[at + 1]))
        } else if args.contains("--enroll") {
            print(identity.enroll()); exit(0)
        } else if args.contains("--evaluate") {
            print(identity.evaluate()); exit(0)
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
                if w.start() { self.watcher = w; log("watching for DocPhoto") }
            }
        } else if !wanted, let w = watcher {
            w.stop()
            watcher = nil
            lastWatch = ""
            log("watching stopped")
            tellWho("away")       // DocPhoto hides at once
        }
        watcher?.every(onBattery ? 5 : 1)
    }

    private func watched(_ seen: Seen) {
        guard watcher != nil else { return }
        var answer = "away"
        if seen.person {
            if let image = seen.picture, identity.ready, let found = identity.who(image) { answer = found.answer }
            else { answer = "unknown" }
        }
        update(seen.person, "watching")
        who = answer == "doc" || answer == "other" ? answer : ""
        if answer != lastWatch { log("watch: " + answer); lastWatch = answer }
        tellWho(answer)
        publish()
    }

    private func tellWho(_ answer: String) {
        DistributedNotificationCenter.default().postNotificationName(AppDelegate.whoNote, object: "de.docalvers.dochere",
                                                                     userInfo: ["answer": answer], deliverImmediately: true)
    }

    private func tick() {
        manageWatch()
        if enabled && eye == nil && watcher == nil {
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
                self?.who = (seen?.person ?? false) ? (self?.identify(seen) ?? "") : ""
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
        let status = !enabled ? "off" : !here ? "Doc is away" : who == "other" ? "Somebody else is here" : "Doc is here"
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
