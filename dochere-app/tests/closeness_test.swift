// Tests for closeness.swift (the distance from the face box and the pupils, the steadied "near") and steady.swift
// (the sticky Doc answer). Run from dochere-app/:
//     swiftc -parse-as-library -o /tmp/closeness-test closeness.swift steady.swift tests/closeness_test.swift && /tmp/closeness-test

import Foundation

@main
enum ClosenessTest {
    static var failures = 0

    static func check(_ ok: Bool, _ what: String) {
        print((ok ? "ok    " : "FAIL  ") + what)
        if !ok { failures += 1 }
    }

    static func near(_ a: Double?, _ b: Double, within: Double = 0.5) -> Bool { a.map { abs($0 - b) <= within } ?? false }

    static func main() {
        // geometry of the delivered frame
        let tanH = tan(65.0 * .pi / 360)
        let square = Closeness.tanHalfVertical(width: 480, height: 480, fieldWidth: 1552, fieldHeight: 1552)
        check(abs(square - tanH) < 1e-9, "480 x 480 of the square 1552 x 1552 picture: vertical = horizontal field")
        check(abs(Closeness.tanHalfVertical(width: 1920, height: 1080, fieldWidth: 1552, fieldHeight: 1552) - tanH * 9 / 16) < 1e-9,
              "1920 x 1080 from the square picture keeps the full width")
        check(abs(Closeness.tanHalfVertical(width: 480, height: 480, fieldWidth: 1920, fieldHeight: 1080) - tanH * 9 / 16) < 1e-9,
              "a square frame from a 16:9 picture keeps the full height")
        check(abs(Closeness.tanHalfVertical(width: 640, height: 480) - tanH * 3 / 4) < 1e-9, "without the format: the frame is all")
        check(Closeness.tanHalfVertical(width: 0, height: 480) == 0, "no frame, no lens")

        // face box: round trip and proportionality
        for cm in [40.0, 60.0, 75.0, 100.0, 150.0] {
            let share = Closeness.boxShare(at: cm, tanHalfV: square)
            check(near(Closeness.fromBox(share, tanHalfV: square), cm, within: 1e-6), "box share at \(Int(cm)) cm gives \(Int(cm)) cm back")
        }
        let s60 = Closeness.boxShare(at: 60, tanHalfV: square)
        check(near(Closeness.fromBox(s60 / 2, tanHalfV: square), 120, within: 1e-6), "half the box, twice the distance")
        check(near(Closeness.fromBox(s60, tanHalfV: square, scale: 1.25), 75, within: 1e-6), "distanceScale multiplies")
        check(Closeness.fromBox(0, tanHalfV: square) == nil, "no box, no distance")
        check(Closeness.fromBox(0.2, tanHalfV: 0) == nil, "no lens, no distance")
        // a 13 cm box filling 17 % of a 65 degree high frame: 13 / (2 * 0.17 * tan(32.5 deg)) = 60.0 cm
        check(near(Closeness.fromBox(0.17, tanHalfV: square), 60.0, within: 0.5), "box 0.17 of the square frame is about 60 cm")

        // pupils: the same distance from the eyes, a turned head corrected, too far turned no answer
        let eyes60 = Closeness.pupils / (2 * 60 * square)
        check(near(Closeness.fromEyes(eyes60, yaw: 0, tanHalfV: square), 60, within: 1e-6), "pupils facing the camera at 60 cm")
        check(near(Closeness.fromEyes(eyes60 * cos(45 * .pi / 180), yaw: 45, tanHalfV: square), 60, within: 1e-6),
              "pupils at 45 degrees yaw, corrected")
        check(near(Closeness.fromEyes(eyes60, yaw: .nan, tanHalfV: square), 60, within: 1e-6), "unknown yaw counts as facing")
        check(Closeness.fromEyes(eyes60, yaw: 70, tanHalfV: square) == nil, "beyond 60 degrees no answer")

        // steadied near: threshold 75, margin 15
        var n = Near()
        check(!n.add(.distance(60), threshold: 75, margin: 15), "one near frame is not near yet")
        check(n.add(.distance(62), threshold: 75, margin: 15), "two near frames in a row are near")
        check(n.add(.distance(85), threshold: 75, margin: 15), "inside the margin keeps near")
        check(n.add(.distance(95), threshold: 75, margin: 15), "one far frame keeps near")
        check(n.add(.distance(70), threshold: 75, margin: 15), "a near frame in between resets the far count")
        _ = n.add(.distance(95), threshold: 75, margin: 15)
        check(!n.add(.distance(100), threshold: 75, margin: 15), "two far frames in a row are far")
        check(!n.add(.distance(80), threshold: 75, margin: 15), "inside the margin keeps far")
        check(!n.add(.distance(74), threshold: 75, margin: 15), "one near frame after far is not near yet")
        check(!n.add(.distance(80), threshold: 75, margin: 15), "a margin frame breaks the run")
        _ = n.add(.distance(74), threshold: 75, margin: 15)
        check(n.add(.distance(70), threshold: 75, margin: 15), "two near in a row again: near")
        for _ in 1..<Near.unclear { _ = n.add(.unclear, threshold: 75, margin: 15) }
        check(n.near, "unclear frames keep near for a while")
        check(!n.add(.unclear, threshold: 75, margin: 15), "\(Near.unclear) unclear frames in a row end near")
        n.reset()
        check(!n.near, "reset is far")
        check(n.add(.distance(200), threshold: 0, margin: 15), "threshold 0 switches it off: always near")

        // sticky Doc: Steady with the watching's settings, one frame a second
        let t0 = Date()
        func at(_ s: Double) -> Date { t0.addingTimeInterval(s) }
        var st = Steady()
        check(st.add(.face(0.20), threshold: 0.45, at: at(0)) == "other", "a stranger at first sight is other at once")
        st = Steady()
        check(st.add(.face(0.50), threshold: 0.45, at: at(0)) == "doc", "one frame at 0.45 or more is doc")
        // Doc turned to the LG: today's pattern, weak frames 0.10..0.44 between Doc frames
        var flipped = false
        let pattern: [Float] = [0.41, 0.33, 0.10, 0.40, 0.38, 0.29, 0.36, 0.25, 0.44, 0.39, 0.12, 0.31, 0.47]
        for (i, v) in (pattern + pattern + pattern).enumerated() where st.add(.face(v), threshold: 0.45, turned: true, at: at(Double(i + 1))) != "doc" {
            flipped = true
        }
        check(!flipped, "Doc's weak turned frames (0.10..0.44, 12 in a row without a Doc frame) keep doc")
        st = Steady()
        _ = st.add(.face(0.50), threshold: 0.45, at: at(0))
        var ans = ""
        for i in 1...12 { ans = st.add(.face(0.15), threshold: 0.45, at: at(Double(i))) }
        check(ans == "doc", "11 s under 0.30, facing: still doc")
        ans = st.add(.face(0.15), threshold: 0.45, at: at(13))
        check(ans == "other", "12 s under 0.30, facing: other")
        st = Steady()
        _ = st.add(.face(0.50), threshold: 0.45, at: at(0))
        for i in 1...20 { ans = st.add(.face(0.15), threshold: 0.45, turned: true, at: at(Double(i))) }
        check(ans == "doc", "19 s under 0.30, turned: still doc")
        ans = st.add(.face(0.15), threshold: 0.45, turned: true, at: at(21))
        check(ans == "other", "20 s under 0.30, turned: other")
        st = Steady()
        _ = st.add(.face(0.50), threshold: 0.45, at: at(0))
        for i in 1...10 { _ = st.add(.face(0.15), threshold: 0.45, at: at(Double(i))) }
        _ = st.add(.face(0.35), threshold: 0.45, at: at(11))          // a face between 0.30 and 0.45 ends the run
        for i in 12...20 { ans = st.add(.face(0.15), threshold: 0.45, at: at(Double(i))) }
        check(ans == "doc", "a 0.35 frame restarts the 12 s")
        st = Steady()
        _ = st.add(.face(0.50), threshold: 0.45, at: at(0))
        for i in 1...40 { ans = st.add(i % 2 == 0 ? .unclear : .face(0.15), threshold: 0.45, turned: true, at: at(Double(i))) }
        check(ans == "doc", "low faces with unclear frames between (a hand at the face) never add up: doc")
        st = Steady()
        _ = st.add(.face(0.50), threshold: 0.45, at: at(0))
        for i in 1...4 { ans = st.add(.face(0.40), threshold: 0.45, crowd: true, at: at(Double(i))) }
        check(ans == "doc", "two faces: 4 weak frames keep doc")
        ans = st.add(.face(0.40), threshold: 0.45, crowd: true, at: at(5))
        check(ans == "other", "two faces: the old rule, 5 weak frames make other")
        st = Steady()
        _ = st.add(.face(0.50), threshold: 0.45, at: at(0))
        for i in 1...3 { ans = st.add(.nobody, threshold: 0.45, at: at(Double(i))) }
        check(ans == "away", "3 empty frames: away as before")
        check(st.add(.face(0.20), threshold: 0.45, at: at(4)) == "other", "a stranger after away is other at once again")
        var bg = Steady(confirm: 2, sticky: false)
        _ = bg.add(.face(0.50), threshold: 0.45, at: at(0))
        for i in 1...4 { ans = bg.add(.face(0.40), threshold: 0.45, at: at(Double(i * 30))) }
        check(ans == "doc", "background looks (not sticky): 4 weak looks keep doc")
        check(bg.add(.face(0.40), threshold: 0.45, at: at(150)) == "other", "background looks: the 5th weak look makes other, as before")

        print(failures == 0 ? "all passed" : "\(failures) failed")
        exit(failures == 0 ? 0 : 1)
    }
}
