// Central rain-radar colour palettes — SINGLE SOURCE OF TRUTH for both the live radar
// (js/rain-radar.js) and the debug legend (debug.html). Dep-free, no Leaflet, plain globals so the
// standalone debug page can include it too. Edit colours HERE only.
(function (global) {
    'use strict';

    // DWD's 15 discrete intensity bins (mm/h), light → heavy — MEASURED from the GetLegendGraphic.
    const DWD_STOPS = [
        [51, 255, 255], [26, 204, 154], [1, 153, 52], [77, 179, 27], [153, 204, 1],
        [204, 230, 1], [255, 255, 1], [255, 196, 1], [255, 137, 1], [255, 69, 1],
        [254, 0, 0], [229, 0, 76], [204, 0, 152], [102, 0, 203], [0, 0, 254]
    ];

    // RainViewer's ORIGINAL "Universal Blue" lightest steps are a warm sand→brown sub-ramp (MEASURED
    // from real tiles 2026-06-09): light tan [222,208,151]/[194,180,130] down through dark browns to
    // ~[99,97,89] for sub-drizzle. rain-radar.js detects that warm band by hue and recolours it to a
    // faint light blue between RV_STOPS[0] (faintest) and RV_STOPS[2] (where the real blue begins).
    // Output ramp — the two lightest drizzle steps (0.1–0.2 / 0.2–0.4 mm/h), whose sand/tan tone is
    // replaced 2026-06-09 with a faint LIGHT BLUE (Doc: the brown read like terrain, not rain). Both
    // the DWD recolour and the RV remap sample THIS ramp.
    const RV_STOPS = [
        [150, 205, 255], [90, 185, 245], [0, 163, 224], [0, 119, 170], [0, 91, 142],
        [0, 78, 120], [255, 224, 0], [255, 197, 0], [255, 170, 0], [255, 129, 0],
        [217, 27, 0], [168, 0, 0], [93, 0, 0], [255, 159, 255], [255, 119, 255]
    ];

    // The two lightest steps also render slightly TRANSPARENT (trace drizzle barely there). Alpha
    // factor applied to those bins by the recolour/filter. Index 0 = lightest.
    const LIGHT_ALPHA = [0.55, 0.78]; // 0.1–0.2 → 55 %, 0.2–0.4 → 78 %, rest = 100 %

    global.RainPalette = { DWD_STOPS, RV_STOPS, LIGHT_ALPHA };
})(typeof window !== 'undefined' ? window : this);
