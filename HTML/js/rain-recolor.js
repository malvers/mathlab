// Central rain-radar RECOLOUR math — single source of truth for the live radar (js/rain-radar.js)
// AND the debug page (debug.html). Dep-free; reads colours from window.RainPalette (load that first).
// Pure functions, no canvas/Leaflet. Exposes window.RainRecolor.
(function (global) {
    'use strict';
    const RP = global.RainPalette || {};
    const DWD_STOPS = RP.DWD_STOPS || [];
    const RV_STOPS = RP.RV_STOPS || [];
    const LIGHT_ALPHA = RP.LIGHT_ALPHA || [];

    // Sample an [r,g,b] ramp at u∈[0,1] (linear between the stops).
    function sampleRamp(stops, u) {
        const n = stops.length;
        if (u <= 0) return stops[0];
        if (u >= 1) return stops[n - 1];
        const f = u * (n - 1), i = f | 0, t = f - i, a = stops[i], c = stops[i + 1];
        return [(a[0] + (c[0] - a[0]) * t) | 0, (a[1] + (c[1] - a[1]) * t) | 0, (a[2] + (c[2] - a[2]) * t) | 0];
    }
    // Nearest point on a stop polyline → global intensity parameter u∈[0,1]. Projecting a pixel
    // (incl. antialiased blends, which lie ON the segments) back onto the ramp recovers its intensity.
    function nearestU(stops, r, g, b) {
        let bestD = Infinity, bestU = 0;
        const n = stops.length;
        for (let i = 0; i < n - 1; i++) {
            const a = stops[i], c = stops[i + 1];
            const dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2];
            const len2 = dx * dx + dy * dy + dz * dz || 1;
            let t = ((r - a[0]) * dx + (g - a[1]) * dy + (b - a[2]) * dz) / len2;
            if (t < 0) t = 0; else if (t > 1) t = 1;
            const px = a[0] + dx * t, py = a[1] + dy * t, pz = a[2] + dz * t;
            const D = (r - px) * (r - px) + (g - py) * (g - py) + (b - pz) * (b - pz);
            if (D < bestD) { bestD = D; bestU = (i + t) / (n - 1); }
        }
        return bestU;
    }
    // Map an intensity u onto the OUTPUT ramp + the lightest-bin alpha factor. Returns [r,g,b,af].
    function rampAt(u) {
        const c = sampleRamp(RV_STOPS, u);
        const si = (u * (RV_STOPS.length - 1)) | 0;            // which output bin
        const af = (si < LIGHT_ALPHA.length) ? LIGHT_ALPHA[si] : 1;
        return [c[0], c[1], c[2], af];
    }
    // DWD pixel → RainViewer-style colour (remap DWD's palette onto our ramp).
    function dwdToRv(r, g, b) { return rampAt(nearestU(DWD_STOPS, r, g, b)); }

    // Is this a RainViewer warm sand→brown sub-drizzle pixel? (Those are the only ones we recolour.)
    function isWarmDrizzle(r, g, b) {
        return r > b && g > b && b >= 40 && r <= 232 &&
            (r - b) >= 8 && (r - b) <= 120 && (r > g ? r - g : g - r) <= 40;
    }
    // RainViewer bakes a warm sand→brown sub-ramp into its lightest precip (drizzle / sub-drizzle).
    // Those are the ONLY pixels we recolour — to a faint light-blue gradient — leaving the real
    // blue→yellow→red→magenta rain ramp untouched. (Global ramp-projection mis-binned the darker
    // browns onto mid-intensity → olive; MEASURED 2026-06-09 from a real tile, so we detect the warm
    // band directly by hue. Endpoints come from the central palette.) Returns [r,g,b,af].
    function rvToRv(r, g, b) {
        if (!isWarmDrizzle(r, g, b)) return [r, g, b, 1];
        const lo = RV_STOPS[0] || [150, 205, 255];  // faintest drizzle → very light blue
        const hi = RV_STOPS[2] || [0, 163, 224];     // strongest drizzle → meets the real blue rain
        let w = (r + g + b - 285) / (581 - 285);      // brightness across the measured tan band
        w = w < 0 ? 0 : (w > 1 ? 1 : w);
        return [
            (lo[0] + (hi[0] - lo[0]) * w) | 0,
            (lo[1] + (hi[1] - lo[1]) * w) | 0,
            (lo[2] + (hi[2] - lo[2]) * w) | 0,
            0.45 + 0.45 * w                            // 0.45 (faint) → 0.90 (near full)
        ];
    }

    global.RainRecolor = { sampleRamp, nearestU, rampAt, dwdToRv, rvToRv, isWarmDrizzle };
})(typeof window !== 'undefined' ? window : this);
