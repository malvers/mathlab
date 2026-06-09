// Non-destructive client-side track smoothing (GPS-Nachbearbeitung, Stufe 1.2). Despike (Hampel) +
// smooth (binomial weighted moving average) the recorded [lat,lng] positions, segment-by-segment at
// the SAME gaps the renderer uses (pause >20 s AND jump >30 m), so the smoothed line and the gap
// breaks stay consistent. Returns a NEW same-length array (positions replaced, count/order kept →
// the parallel times/speeds/activities arrays stay aligned). Does NOT touch the stored track — it's
// purely a display transform; raw data is untouched.
//
// IIFE global like track-render.js. API: TrackSmooth.smooth(track, times) -> newTrack
(function (global) {
    'use strict';

    const GAP_SEC = 20, GAP_M = 30;   // must match track-render.js so segments == drawn runs
    const HAMPEL_K = 3;               // half-window for spike detection
    const HAMPEL_SIGMA = 3;          // |x - median| beyond this many robust sigmas → replace with median
    const SMOOTH_W = [1, 4, 6, 4, 1]; // window-5 binomial weights — smooth but turn-preserving

    function haversine(a, b) {
        const R = 6371000, toRad = (d) => d * Math.PI / 180;
        const dLat = toRad(b[0] - a[0]), dLon = toRad(b[1] - a[1]);
        const x = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }
    function median(arr) {
        const s = arr.slice().sort((x, y) => x - y), n = s.length;
        return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    }

    // [start,end) index ranges between gaps (same gap test as the renderer).
    function segments(track, times) {
        const segs = [];
        let start = 0;
        for (let i = 1; i < track.length; i++) {
            const dt = (Date.parse(times[i]) - Date.parse(times[i - 1])) / 1000;
            if (times[i] && times[i - 1] && dt > GAP_SEC && haversine(track[i - 1], track[i]) > GAP_M) {
                segs.push([start, i]);
                start = i;
            }
        }
        segs.push([start, track.length]);
        return segs;
    }

    // Hampel filter: replace isolated outliers with the local median.
    function hampel(vals) {
        const out = vals.slice();
        for (let i = 0; i < vals.length; i++) {
            const lo = Math.max(0, i - HAMPEL_K), hi = Math.min(vals.length, i + HAMPEL_K + 1);
            const win = vals.slice(lo, hi);
            const m = median(win);
            const mad = median(win.map((v) => Math.abs(v - m)));
            if (mad > 0 && Math.abs(vals[i] - m) > HAMPEL_SIGMA * 1.4826 * mad) out[i] = m;
        }
        return out;
    }

    // Binomial weighted moving average; partial window at the ends (endpoints stay near original).
    function smoothAxis(vals) {
        const out = vals.slice(), half = (SMOOTH_W.length - 1) / 2;
        for (let i = 0; i < vals.length; i++) {
            let sum = 0, wsum = 0;
            for (let j = -half; j <= half; j++) {
                const k = i + j;
                if (k < 0 || k >= vals.length) continue;
                const w = SMOOTH_W[j + half];
                sum += w * vals[k];
                wsum += w;
            }
            out[i] = sum / wsum;
        }
        return out;
    }

    function smooth(track, times) {
        if (!Array.isArray(track) || track.length < 3) return (track || []).slice();
        const out = track.map((p) => p.slice()); // copy — never mutate the stored track
        for (const [s, e] of segments(track, times)) {
            if (e - s < 3) continue; // too short to smooth meaningfully → leave as-is
            let lat = [], lng = [];
            for (let i = s; i < e; i++) { lat.push(track[i][0]); lng.push(track[i][1]); }
            lat = smoothAxis(hampel(lat));
            lng = smoothAxis(hampel(lng));
            for (let i = s; i < e; i++) { out[i][0] = lat[i - s]; out[i][1] = lng[i - s]; }
        }
        return out;
    }

    global.TrackSmooth = { smooth: smooth };
})(window);
