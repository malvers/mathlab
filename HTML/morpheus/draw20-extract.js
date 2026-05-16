// Contour extraction wrappers for the draw20 stack.
// Plain globals — loaded before draw20.js.
//
// Both functions read the live slider values (threshold, merge, eps) directly
// from the DOM, matching the legacy engine pipelines:
//   - PNG (user-draw.js extractOutline): red-channel → morphClose → getContoursWithHoles → area-filter → canonical-sort → rdp
//   - LaTeX (target-render.js): alpha-grid → getContoursWithHoles → stride-resample → canonical-sort → rdp

const DRAW20_TARGET_MAX_PTS = 300;

function draw20GetThreshold() {
    return +(document.getElementById('threshold-slider')?.value ?? 20);
}

function draw20GetEps() {
    // Default 0 → RDP simplification OFF. With ensureMinDensity growing
    // polygons up to MIN_POINTS, RDP-reduced contours look edgy because
    // midpoint-insertion preserves the original sharp corners.
    return +(document.getElementById('eps-slider')?.value ?? 0);
}

function draw20ExtractPNGContours(canvas, dbg) {
    const g = draw20CanvasToGridRed(canvas, draw20GetThreshold());
    if (!g) return [];
    // morphClose entfällt — Verschmelzung benachbarter Glyphen war
    // unerwünscht; User wollte den Slider weg, Radius auf 0.
    const grid = g.grid;
    if (typeof getContoursWithHoles !== 'function') return [];
    const raw = getContoursWithHoles(grid, g.W, g.H);
    const areaScale = (g.W * g.H) / (1000 * 1000);
    const MIN_AREA = 10 * areaScale;
    let filtered = raw.filter(p => draw20PolyArea(p) >= MIN_AREA);
    // Cap each contour at DRAW20_TARGET_MAX_PTS via stride-resample so PNG
    // and LaTeX polygons share the same upper bound (matching pipeline).
    if (typeof draw20StrideResample === 'function') {
        filtered = filtered.map(p => draw20StrideResample(p, DRAW20_TARGET_MAX_PTS));
    }
    let sorted = (typeof sortContoursCanonical === 'function')
        ? sortContoursCanonical(filtered) : filtered;
    const eps = draw20GetEps();
    if (typeof rdp === 'function' && eps > 0) {
        sorted = sorted.map(p => (p && p.length >= 3) ? rdp(p, eps) : p);
    }
    const totalV = sorted.reduce((s, p) => s + (p ? p.length : 0), 0);
    if (typeof dbg === 'function') dbg(`PNG: raw=${raw.length}, filtered=${filtered.length}, rdp(eps=${eps}) → ${totalV} verts`);
    return sorted;
}

function draw20ExtractLatexContours(latexCanvas, dbg) {
    if (!latexCanvas) return null;
    const g = draw20CanvasToGridAlpha(latexCanvas, draw20GetThreshold());
    if (!g) return null;
    let contours = (typeof getContoursWithHoles === 'function')
        ? getContoursWithHoles(g.grid, g.W, g.H) : [];
    const rawCount = contours.length;
    contours = contours.map(p => draw20StrideResample(p, DRAW20_TARGET_MAX_PTS));
    contours = (typeof sortContoursCanonical === 'function')
        ? sortContoursCanonical(contours) : contours;
    const eps = draw20GetEps();
    if (typeof rdp === 'function' && eps > 0) {
        contours = contours.map(p => (p && p.length >= 3) ? rdp(p, eps) : p);
    }
    const totalV = contours.reduce((s, p) => s + (p ? p.length : 0), 0);
    if (typeof dbg === 'function') dbg(`LaTeX: raw=${rawCount}, rdp(eps=${eps}) → ${totalV} verts`);
    return { contours, W: g.W, H: g.H };
}
