// Polygon vertex correspondence via scale + cyclic offset.
//
// Inputs: two closed polygons (arrays of {x, y}).
// Output: { idxMap, offset, reversed } — idxMap[i] = j gives the dst
//         vertex corresponding to src vertex i. Monotonic by construction
//         (cyclic offset), so morph lines mathematically cannot cross.
//
// Pipeline:
//   1. Uniform-scale both polygons to a common [-1, 1] bbox.
//   2. Reverse dst if its winding direction differs from src (CW vs CCW).
//   3. Search the cyclic offset k ∈ [0, N) that minimises Σ ||src[i] - dst[(i+k) % N]||².
//   4. Build idxMap respecting offset and the reverse mapping.
//
// Assumes srcN == dstN (true after resampleClosed equalises both sides).
//
// Wrapped in an IIFE so internal helpers (signedArea, normalizeToUnitBBox)
// do NOT pollute the global namespace — count-objects.js defines its own
// top-level `signedArea` (for [x,y]-array polygons) that classifyContours()
// depends on, and a global collision broke hole detection.

(function () {

function draw20CornerMatch(srcPolygon, dstPolygon) {
    if (!srcPolygon || !dstPolygon) return null;
    const N = srcPolygon.length;
    if (N < 3 || dstPolygon.length !== N) return null;

    // 1. Uniform-scale both polygons to a common [-1, 1] bbox.
    const srcS = normalizeToUnitBBox(srcPolygon);
    const dstS = normalizeToUnitBBox(dstPolygon);

    // 2. Reverse-orientation check (CW vs CCW). signedArea < 0 = CW in image
    //    coords (y-down). If src and dst wind in opposite directions, reverse
    //    dst before offset search so the cyclic sequences are comparable.
    const reversed = (signedAreaXY(srcS) < 0) !== (signedAreaXY(dstS) < 0);
    const dstWork = reversed ? dstS.slice().reverse() : dstS;

    // 3. Cyclic offset search.
    const STEP = Math.max(1, Math.floor(N / 80));
    let bestK = 0, bestCost = Infinity;
    for (let k = 0; k < N; k++) {
        let cost = 0;
        for (let i = 0; i < N; i += STEP) {
            const s = srcS[i];
            const d = dstWork[(i + k) % N];
            const dx = s.x - d.x;
            const dy = s.y - d.y;
            cost += dx * dx + dy * dy;
        }
        if (cost < bestCost) { bestCost = cost; bestK = k; }
    }

    // 4. Build idxMap. dstWork[j] === dstPolygon[(N-1-j) % N] if reversed.
    const idxMap = new Array(N);
    for (let i = 0; i < N; i++) {
        const j = (i + bestK) % N;
        idxMap[i] = reversed ? (N - 1 - j + N) % N : j;
    }
    return { idxMap, offset: bestK, reversed, anchors: null };
}

// Local signedArea for {x, y}-object polygons (do NOT name it `signedArea`
// — that name is taken by count-objects.js for [x, y]-array polygons).
function signedAreaXY(poly) {
    let s = 0;
    const n = poly.length;
    for (let i = 0; i < n; i++) {
        const a = poly[i], b = poly[(i + 1) % n];
        s += (b.x - a.x) * (b.y + a.y);
    }
    return s / 2;
}

function normalizeToUnitBBox(poly) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of poly) {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    }
    const w = Math.max(1e-6, maxX - minX);
    const h = Math.max(1e-6, maxY - minY);
    return poly.map(p => ({
        x: (p.x - minX) / w * 2 - 1,
        y: (p.y - minY) / h * 2 - 1,
    }));
}

if (typeof window !== 'undefined') {
    window.draw20CornerMatch = draw20CornerMatch;
}

})();
