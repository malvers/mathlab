// Shared GPS-track renderer — single source of truth for tracker.html (full app) and
// view.html (read-only shared view). Both pages keep their own Leaflet map, their own
// parallel data arrays (track / times / speeds / activities) and their own trackLayer;
// they hand those in via a context object so this module stays state-free and reusable.
// Centralising it here means the colour scales, gap logic and run-splitting are fixed in
// ONE place (no more double-patching the renderer in two files).
//
//   ctx = { track, times, speeds, activities, layer, usesHotline }
//     track       array of [lat, lng]
//     times       ISO timestamp per point (index-aligned)
//     speeds      km/h per point (null if unknown)
//     activities  travel mode per point ('walking' | 'running' | 'on_bicycle' | 'in_vehicle' | 'still')
//     layer       a Leaflet LayerGroup the runs/gaps are drawn into
//     usesHotline true if leaflet-hotline is loaded (else fall back to a plain orange polyline)

(function (global) {
    'use strict';

    const MAX_KMH = 40;                       // top of the absolute speed scale (km/h)
    const COL_ORANGE = 'rgb(245, 194, 66)';   // fallback polyline colour when hotline is missing

    // Absolute speed scale: 0–5 km/h is its own walking sub-scale (0.0–0.5), 5–40 maps 0.5–1.0.
    const SPEED_PALETTE = {
        0.00: 'rgb(40,90,30)',    //  0 km/h   deep green
        0.25: 'rgb(121,158,49)',  //  2.5      brand green (φ)
        0.50: 'rgb(180,200,70)',  //  5 km/h   light lime — top of the walking sub-scale
        0.70: 'rgb(245,194,66)',  // ~15       orange (λ)
        1.00: 'rgb(176,36,24)',   // 40+       red (Υ)
    };
    // Per travel mode: white (slow) → mode colour (fast), each with a sensible km/h span.
    // 'unknown' (web / before first detection) falls back to the absolute speed scale.
    const MODE_COLORS = {
        walking:    { max: 6,  palette: { 0: '#ffffff', 1: 'rgb(121,158,49)' } },                        // white → green
        running:    { max: 14, palette: { 0: '#ffffff', 1: 'rgb(60,180,120)' } },                        // white → teal-green
        on_bicycle: { max: 30, palette: { 0: '#ffffff', 1: 'rgb(60,130,210)' } },                        // white → blue
        in_vehicle: { max: 80, palette: { 0: '#ffffff', 0.5: 'rgb(245,194,66)', 1: 'rgb(176,36,24)' } }, // white → orange → red
        still:      { max: 1,  palette: { 0: 'rgb(150,165,190)', 1: 'rgb(150,165,190)' } },              // flat grey
    };
    const GAP_SEC = 20;   // s between two consecutive recorded points
    const GAP_M = 30;     // m — only when there's a real jump too (not a standing-still pause)

    function speedToScale(kmh) {
        if (kmh <= 5) return (kmh / 5) * 0.5;                       // 0–5 km/h  → 0.0–0.5 (walking)
        return 0.5 + Math.min((kmh - 5) / (MAX_KMH - 5), 1) * 0.5;  // 5–40 km/h → 0.5–1.0
    }

    function haversine(a, b) {
        const R = 6371000; // metres
        const toRad = d => d * Math.PI / 180;
        const dLat = toRad(b[0] - a[0]);
        const dLon = toRad(b[1] - a[1]);
        const lat1 = toRad(a[0]);
        const lat2 = toRad(b[0]);
        const x = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }

    // A real gap = a long pause AND a real jump (so a standing-still pause is not drawn as a gap).
    function isGap(ctx, i) {
        return ctx.times[i] && ctx.times[i - 1]
            && ((Date.parse(ctx.times[i]) - Date.parse(ctx.times[i - 1])) / 1000 > GAP_SEC)
            && (haversine(ctx.track[i - 1], ctx.track[i]) > GAP_M);
    }

    // Draw one continuous run, coloured by its travel mode (white → mode-colour by speed).
    function drawRun(ctx, idxs, activity) {
        if (idxs.length < 2) return; // a lone point has no segment to draw
        const mode = MODE_COLORS[activity];
        if (ctx.usesHotline) {
            const pal = mode ? mode.palette : SPEED_PALETTE;
            const data = idxs.map(i => {
                const kmh = ctx.speeds[i] != null ? ctx.speeds[i] : 0;
                const v = mode ? Math.min(kmh / mode.max, 1) : speedToScale(kmh);
                return [ctx.track[i][0], ctx.track[i][1], v];
            });
            L.hotline(data, { weight: 5, outlineWidth: 1, outlineColor: 'rgba(8,20,42,0.6)', palette: pal, min: 0, max: 1 }).addTo(ctx.layer);
        } else {
            L.polyline(idxs.map(i => ctx.track[i]), { color: COL_ORANGE, weight: 5, opacity: 0.9 }).addTo(ctx.layer);
        }
    }

    // White/red barber-pole over a gap (two offset dashed lines), no speed colour beneath.
    function drawGap(ctx, a, b) {
        const seg = [ctx.track[a], ctx.track[b]];
        L.polyline(seg, { color: '#ffffff', weight: 4, dashArray: '10 10', interactive: false }).addTo(ctx.layer);
        L.polyline(seg, { color: 'rgb(176,36,24)', weight: 4, dashArray: '10 10', dashOffset: '10', interactive: false }).addTo(ctx.layer);
    }

    // Rebuild: split into runs at gaps AND at mode changes; each run coloured by its mode.
    function redraw(ctx) {
        ctx.layer.clearLayers();
        if (!ctx.track.length) return;
        let run = [0];
        let runAct = ctx.activities[0] || 'unknown';
        for (let i = 1; i < ctx.track.length; i++) {
            const act = ctx.activities[i] || 'unknown';
            if (isGap(ctx, i)) { drawRun(ctx, run, runAct); drawGap(ctx, i - 1, i); run = [i]; runAct = act; }
            else if (act !== runAct) { drawRun(ctx, run, runAct); run = [i - 1, i]; runAct = act; } // overlap point → continuous
            else run.push(i);
        }
        drawRun(ctx, run, runAct);
    }

    global.TrackRender = {
        MAX_KMH, COL_ORANGE, SPEED_PALETTE, MODE_COLORS, GAP_SEC, GAP_M,
        speedToScale, haversine, isGap, drawRun, drawGap, redraw,
    };
})(window);
