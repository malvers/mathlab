// Grid + geometry helpers for the draw20 stack.
// Plain globals — loaded before draw20.js (and any draw20-* submodule).
//
// Engine-mirroring grid builders. Two thresholds match what the legacy
// engine uses on its two distinct surfaces:
//   - PNG / drawing (user-draw.js extractOutline):  RED channel > t
//   - LaTeX html2canvas snapshot (target-render.js):  ALPHA > t
// Callers pass the current threshold (so this stays DOM-free).

function draw20CanvasToGridRed(c, threshold) {
    const cw = c.width, ch = c.height;
    let data;
    try { data = c.getContext('2d').getImageData(0, 0, cw, ch).data; }
    catch (e) { return null; }
    const grid = new Uint8Array(cw * ch);
    for (let i = 0; i < cw * ch; i++) grid[i] = data[i * 4] > threshold ? 1 : 0;
    return { grid, W: cw, H: ch };
}

function draw20CanvasToGridAlpha(c, threshold) {
    const cw = c.width, ch = c.height;
    let data;
    try { data = c.getContext('2d').getImageData(0, 0, cw, ch).data; }
    catch (e) { return null; }
    const grid = new Uint8Array(cw * ch);
    for (let i = 0; i < cw * ch; i++) grid[i] = data[i * 4 + 3] > threshold ? 1 : 0;
    return { grid, W: cw, H: ch };
}

// Shoelace area (matches user-draw.js polyArea).
function draw20PolyArea(poly) {
    let a = 0;
    for (let i = 0; i < poly.length; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[(i + 1) % poly.length];
        a += (x2 - x1) * (y2 + y1);
    }
    return Math.abs(a) / 2;
}

// Stride-based downsample to ≤ maxPts (matches target-render.js).
function draw20StrideResample(poly, maxPts) {
    if (poly.length <= maxPts) return poly;
    const step = poly.length / maxPts;
    const sub = [];
    for (let i = 0; i < maxPts; i++) sub.push(poly[Math.round(i * step)]);
    return sub;
}
