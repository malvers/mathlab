// Records ONE window (by CGWindowID) into a .mov via ScreenCaptureKit — works while the window
// is behind others or on another Space. Usage: screcord <windowID> <seconds> <out.mov> [scale]
import Foundation
import Cocoa
import ScreenCaptureKit
import AVFoundation
import CoreMedia

final class RecDelegate: NSObject, SCRecordingOutputDelegate, SCStreamDelegate {
    var finished = false
    func done() { finished = true }
    func recordingOutputDidStartRecording(_ o: SCRecordingOutput) { print("recording started") }
    func recordingOutputDidFinishRecording(_ o: SCRecordingOutput) { print("recording finished"); done() }
    func recordingOutput(_ o: SCRecordingOutput, didFailWithError e: Error) { print("recording failed: \(e)"); done() }
    func stream(_ s: SCStream, didStopWithError e: Error) { print("stream stopped: \(e)"); done() }
}

// ScreenCaptureKit wants a window-server connection (CGS_REQUIRE_INIT) — an NSApplication gives it one.
_ = NSApplication.shared
setbuf(stdout, nil)                  // run2 waits for "recording started" through a pipe — no buffering
nonisolated(unsafe) var stopRequested = false
let a = CommandLine.arguments
let wid = CGWindowID(UInt32(a[1])!), secs = Double(a[2])!, out = URL(fileURLWithPath: a[3])
let scale = a.count > 4 ? Double(a[4])! : 2.0
let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: false)
guard let win = content.windows.first(where: { $0.windowID == wid }) else { print("window \(wid) not found"); exit(1) }
print("window '\(win.title ?? "")' \(win.frame)")
let filter = SCContentFilter(desktopIndependentWindow: win)
let cfg = SCStreamConfiguration()
cfg.width = Int(win.frame.width * scale); cfg.height = Int(win.frame.height * scale)
cfg.minimumFrameInterval = CMTime(value: 1, timescale: 30)
cfg.showsCursor = false
cfg.capturesAudio = false
let del = RecDelegate()
let stream = SCStream(filter: filter, configuration: cfg, delegate: del)
let rc = SCRecordingOutputConfiguration()
rc.outputURL = out; rc.outputFileType = .mov; rc.videoCodecType = .h264
let rec = SCRecordingOutput(configuration: rc, delegate: del)
try stream.addRecordingOutput(rec)
try await stream.startCapture()
print("capturing \(secs)s at \(cfg.width)x\(cfg.height)")
// SIGINT/SIGTERM end the take early but cleanly (run2 sends it when the choreography is done)
signal(SIGINT) { _ in stopRequested = true }
signal(SIGTERM) { _ in stopRequested = true }
var waited = 0.0
while waited < secs && !stopRequested { try await Task.sleep(nanoseconds: 200_000_000); waited += 0.2 }
print("stopping after \(String(format: "%.1f", waited))s")
try await stream.stopCapture()
for _ in 0..<100 where !del.finished { try await Task.sleep(nanoseconds: 100_000_000) }
print("wrote \(out.path)")
