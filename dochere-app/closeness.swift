// How far the face in front of the camera is, from the face DocHere finds anyway (20.11.2026, Doc: "Die Bilder sollen
// bitte nur kommen, wenn ich gefühlt wirklich davor sitze. Ich kann tatsächlich mindestens 1 Meter weggehen und das
// erkennt mich immer noch"). No extra Vision pass: the face box and the pupils come from the landmarks that align the
// face for the face print (face.swift). Numbers only, nothing is saved.
//
// Pinhole camera: a face box that fills the share s of the frame height lies at d = box / (2 * s * tan(v / 2)), v the
// vertical field of view of the delivered frame. Kept free of AVFoundation and Vision so that tests/closeness_test.swift
// can check it on its own.

import Foundation

enum Closeness {
    /// Height of Vision's face box on a real face. The box is square, about eyebrows to chin; on Doc's 15 enrolled
    /// pictures it measured 2.07 times the distance between the pupils (turned heads corrected by cos(yaw), 1.97..2.26),
    /// and with the adult mean of 6.3 cm between the pupils that makes 13 cm.
    static let faceBox = 13.0
    /// Mean adult distance between the pupils, in cm.
    static let pupils = 6.3
    /// The FaceTime HD camera's horizontal field of view over its full picture, in degrees. On this MacBook Air the
    /// full picture is square (active format 1552 x 1552, the 480 x 480 frames are all of it; a 1920 x 1080 photo is a
    /// crop with the full width). A first guess: Apple does not publish it and macOS does not report it
    /// (videoFieldOfView is unavailable there). Errors in it and in `faceBox` scale every distance alike - the user
    /// default `distanceScale` corrects both after one measurement at a known distance.
    static let fieldOfView = 65.0
    /// Beyond this head turn the pupils say nothing reliable about the distance any more.
    static let maxYaw = 60.0

    /// tan of half the vertical field of view of a delivered frame of this size. The frame is taken as the largest
    /// centred crop of the full picture (`fieldWidth` x `fieldHeight`, the camera's active format) with the frame's own
    /// aspect: a narrower frame keeps the full height, a wider one the full width. Without the format the frame is
    /// taken as the full picture.
    static func tanHalfVertical(width: Int, height: Int, fieldWidth: Int = 0, fieldHeight: Int = 0,
                                fieldOfView: Double = fieldOfView) -> Double {
        guard width > 0, height > 0 else { return 0 }
        let tanHalfH = tan(fieldOfView * .pi / 360)
        let frameAspect = Double(width) / Double(height)
        let fieldAspect = fieldWidth > 0 && fieldHeight > 0 ? Double(fieldWidth) / Double(fieldHeight) : frameAspect
        return frameAspect <= fieldAspect ? tanHalfH / fieldAspect : tanHalfH / frameAspect
    }

    /// The distance in cm from the face box's height as a share of the frame height (Vision's normalised box).
    static func fromBox(_ share: Double, tanHalfV: Double, scale: Double = 1) -> Double? {
        guard share > 0, share.isFinite, tanHalfV > 0 else { return nil }
        return scale * faceBox / (2 * share * tanHalfV)
    }

    /// The distance in cm from the distance between the pupils as a share of the frame height. A head turned by `yaw`
    /// shows them closer together by cos(yaw); turned beyond `maxYaw` there is no answer.
    static func fromEyes(_ share: Double, yaw: Double, tanHalfV: Double, scale: Double = 1) -> Double? {
        guard share > 0, share.isFinite, tanHalfV > 0 else { return nil }
        let turn = yaw.isNaN ? 1 : cos(yaw * .pi / 180)
        guard yaw.isNaN || abs(yaw) <= maxYaw else { return nil }
        return scale * pupils * turn / (2 * share * tanHalfV)
    }

    /// The face box share that lies at `cm` (the inverse of fromBox) - for the tests and for reading the log.
    static func boxShare(at cm: Double, tanHalfV: Double, scale: Double = 1) -> Double {
        scale * faceBox / (2 * cm * tanHalfV)
    }
}

/// Whether the face is near enough, steadied so that the photos do not flicker at the boundary:
/// - "near" takes `enter` frames in a row at or below the threshold,
/// - "far" takes `leave` frames in a row beyond threshold + margin (the hysteresis); a frame in between keeps the answer,
/// - a frame without a distance (nobody, or a person without a clear face) keeps it too, but `unclear` of them in a
///   row (30 s on mains) end "near": somebody whose face cannot be found for that long is not sitting at the Mac,
/// - a threshold of 0 or less switches it off: always near.
struct Near {
    static let enter = 2
    static let leave = 2
    static let unclear = 30      // 10 was too few (20.11.2026): Doc looking down at his desk for 10 s lost "near"

    enum Frame { case distance(Double), unclear }

    private(set) var near = false
    private var closer = 0          // frames in a row at or below the threshold
    private var further = 0         // frames in a row beyond threshold + margin
    private var unseen = 0          // frames in a row without a distance

    mutating func add(_ frame: Frame, threshold: Double, margin: Double) -> Bool {
        guard threshold > 0 else { near = true; return near }
        switch frame {
        case .unclear:
            unseen += 1
            if unseen >= Self.unclear { near = false; closer = 0; further = 0 }
        case .distance(let cm):
            unseen = 0
            if cm <= threshold {
                closer += 1; further = 0
                if closer >= Self.enter { near = true }
            } else if cm > threshold + max(margin, 0) {
                further += 1; closer = 0
                if further >= Self.leave { near = false }
            } else {
                closer = 0; further = 0
            }
        }
        return near
    }

    mutating func reset() { self = Near() }
}

/// The settings for closeness, all in DocHere's user defaults so that one place changes them, read on every frame (no
/// restart needed):
///     defaults write de.docalvers.dochere nearCm -float 75         # photos only this close (0 = off: as before)
///     defaults write de.docalvers.dochere nearMarginCm -float 15   # leave "near" only beyond nearCm + this
///     defaults write de.docalvers.dochere distanceScale -float 1.0 # measured cm = shown cm x this, after calibrating
enum NearSettings {
    static let defaultThreshold = 75.0
    static let defaultMargin = 15.0

    private static func value(_ key: String, _ fallback: Double) -> Double {
        (UserDefaults.standard.object(forKey: key) as? NSNumber)?.doubleValue ?? fallback
    }

    static var threshold: Double { value("nearCm", defaultThreshold) }
    static var margin: Double { value("nearMarginCm", defaultMargin) }
    static var scale: Double {
        let s = value("distanceScale", 1)
        return s > 0 ? s : 1
    }
}
