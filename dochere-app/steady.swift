// The steadied answer of the watching camera (moved out of main.swift on 20.11.2026, so that tests/closeness_test.swift
// can check it on its own - no AVFoundation, no Vision).

import Foundation

/// Steadies the watching camera's answers (13.11.2026, Doc in a dark room: "die Bilder gehen weg, kommen wieder,
/// kommen weg"). One frame is noisy in poor light, so the answer that goes out only changes when the frames agree.
/// The threshold stays 0.45 for every frame - nobody is taken for Doc more easily than before:
/// - "doc" comes at once: one frame at or above the threshold.
/// - Leaving "doc" for "other" (sticky, the watching - 20.11.2026): only a run of faces clearly below Doc, every one
///   under `low` (0.30), held for `dropSeconds` (12 s; 20 s when a face in the run was turned beyond `turnedYaw`, as
///   Doc's usually is) and at least `dropFrames` frames. A face between 0.30 and the threshold ends the run, a face at
///   the threshold too, and so does a frame without a clear face (lunch at the desk, 20.11.2026: half the frames
///   had no clear face, and the low faces between them added up to 20 s). While two or more faces are seen the old rule holds for those frames: `notDoc` judgeable weak
///   faces without a Doc frame in between. Without `sticky` (the background looks) always the old rule.
///   A person without a clear face, or a face turned too far to be judged (Pose), counts for neither and keeps "doc".
/// - "away" takes `leave` frames in a row without a person - Doc gone ends "doc" as before.
/// - Otherwise a stranger is "other" at once (`confirm`), a person without a clear face "unknown".
/// Measured 13.11.2026 in Doc's dark room (with the dark prints): 1 of 117 frames below 0.45, never 3 in a row.
/// 15.11.2026 (Doc: "wenn ich mich zur Seite drehe, erkennt er mich nicht mehr. Und dann gehen die Bilder weg, kommen die
/// Bilder wieder"): a head held turned for a few seconds gave 3 weak frames in a row - now 5, and only judgeable ones.
/// 20.11.2026 (Doc: "Jetzt geht es ständig weg und kommt"): turned 40..60 degrees to the LG his scores hovered around
/// 0.45 (0.10..0.55), and 5 weak frames came every 20..60 s - "other" for 2 s each time. Strangers stay far below
/// 0.30 (LFW: median far lower, max 0.367 of 2000), so a run of 12 s under 0.30 is still quick for them.
struct Steady {
    static let leave = 3
    static let notDoc = 5
    static let low: Float = 0.30
    static let dropSeconds = 12.0
    static let dropSecondsTurned = 20.0
    static let dropFrames = 3
    static let turnedYaw: Float = 35

    enum Frame { case nobody, unclear, face(Float) }

    /// Judgeable weak faces it takes to call a person "other" when the answer is not "doc": 1 for the watching (a
    /// frame every second), 2 for the background looks (16.11.2026) - there one bad frame showed DocBar's "!".
    let confirm: Int
    /// Sticky Doc (see above): the watching. The background looks keep the old rule.
    let sticky: Bool

    init(confirm: Int = 1, sticky: Bool = true) {
        self.confirm = confirm
        self.sticky = sticky
    }

    private(set) var answer = "away"
    private var low = 0             // faces below the threshold since the last Doc frame (the old rule)
    private var nobody = 0          // frames in a row without a person
    private var runStart: Date?     // sticky: the first face of the current run below `Steady.low`
    private var runFrames = 0
    private var runTurned = false

    /// A weak face was seen but does not make "other" yet (only with confirm > 1).
    var pending: Bool { answer != "doc" && answer != "other" && low > 0 }

    private mutating func endRun() { runStart = nil; runFrames = 0; runTurned = false }

    /// `turned`: the face is turned beyond `turnedYaw`; `crowd`: two or more faces in the frame.
    mutating func add(_ frame: Frame, threshold: Float, turned: Bool = false, crowd: Bool = false,
                      at now: Date = Date()) -> String {
        switch frame {
        case .nobody:
            nobody += 1
            endRun()
            if answer != "doc" && answer != "other" || nobody >= Self.leave { answer = "away"; low = 0 }
        case .unclear:
            nobody = 0
            endRun()            // the run must be faces, one after the other - a hand at the face breaks it
            if answer == "away" { answer = "unknown" }
        case .face(let score):
            nobody = 0
            if score >= threshold {
                answer = "doc"
                low = 0
                endRun()
            } else if answer == "doc" && sticky && !crowd {
                guard score < Self.low else { endRun(); break }
                if runStart == nil { runStart = now }
                runFrames += 1
                if turned { runTurned = true }
                let need = runTurned ? Self.dropSecondsTurned : Self.dropSeconds
                if runFrames >= Self.dropFrames, let start = runStart, now.timeIntervalSince(start) >= need {
                    answer = "other"; low = 0; endRun()
                }
            } else if answer != "other" {
                low += 1
                if low >= (answer == "doc" ? Self.notDoc : confirm) { answer = "other"; low = 0; endRun() }
                else if answer == "away" { answer = "unknown" }
            }
        }
        return answer
    }
}

