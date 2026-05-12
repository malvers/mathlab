// Topology-aware contour extraction (Marching Squares with edge linking)
// and canonical sorting for stable region identity.
// Depends on: centroid() from geometry.js

// ── Topology-aware boundary tracing using Marching Squares with proper edge linking.
// Returns multiple disjoint closed contours (outer + holes) — no bridges between them.
function getContoursWithHoles(grid, W, H) {
    // Step 1: For each cell, generate line segments based on marching-squares case.
    // Each segment is [pt1, pt2] where pts are at edge midpoints.
    // Cell case bits (msb first): TL TR BR BL
    const segments = [];

    for (let y = 0; y < H - 1; y++) {
        for (let x = 0; x < W - 1; x++) {
            const tl = grid[y * W + x];
            const tr = grid[y * W + (x + 1)];
            const br = grid[(y + 1) * W + (x + 1)];
            const bl = grid[(y + 1) * W + x];
            const cas = (tl << 3) | (tr << 2) | (br << 1) | bl;
            if (cas === 0 || cas === 15) continue;

            const top    = [x + 0.5, y];
            const right  = [x + 1,   y + 0.5];
            const bottom = [x + 0.5, y + 1];
            const left   = [x,       y + 0.5];

            switch (cas) {
                // Single-corner cases (one filled corner)
                case 1:  segments.push([left, bottom]); break;            // BL
                case 2:  segments.push([bottom, right]); break;           // BR
                case 4:  segments.push([top, right]); break;              // TR
                case 8:  segments.push([top, left]); break;               // TL

                // Three-corner cases (one outside corner)
                case 7:  segments.push([left, top]); break;               // TR+BR+BL
                case 11: segments.push([right, top]); break;              // TL+BR+BL
                case 13: segments.push([right, bottom]); break;           // TL+TR+BL
                case 14: segments.push([bottom, left]); break;            // TL+TR+BR

                // Two-corner adjacent (horizontal/vertical)
                case 3:  segments.push([left, right]); break;             // BL+BR
                case 12: segments.push([left, right]); break;             // TL+TR
                case 6:  segments.push([top, bottom]); break;             // TR+BR
                case 9:  segments.push([top, bottom]); break;             // TL+BL

                // Saddle cases (ambiguous diagonal — pick local disambiguation)
                case 5:
                    segments.push([top, right]);
                    segments.push([left, bottom]);
                    break;
                case 10:
                    segments.push([top, left]);
                    segments.push([right, bottom]);
                    break;
            }
        }
    }

    if (segments.length === 0) return [];

    // Step 2: Build endpoint→segment-indices map for chaining.
    const ptKey = pt => pt[0] * 1e6 + pt[1];
    const endpointMap = new Map();
    for (let i = 0; i < segments.length; i++) {
        for (let e = 0; e < 2; e++) {
            const k = ptKey(segments[i][e]);
            if (!endpointMap.has(k)) endpointMap.set(k, []);
            endpointMap.get(k).push(i);
        }
    }

    // Step 3: Walk segments to build closed contours.
    const used = new Uint8Array(segments.length);
    const contours = [];

    for (let startIdx = 0; startIdx < segments.length; startIdx++) {
        if (used[startIdx]) continue;
        used[startIdx] = 1;

        const startPt = segments[startIdx][0];
        const startKey = ptKey(startPt);
        const contour = [startPt];
        let currentPt = segments[startIdx][1];
        contour.push(currentPt);

        let safety = 0;
        const maxSteps = segments.length + 2;

        while (safety++ < maxSteps) {
            const k = ptKey(currentPt);
            if (k === startKey) break;

            const candidates = endpointMap.get(k);
            if (!candidates) break;

            let nextSegIdx = -1;
            for (const ci of candidates) {
                if (!used[ci]) { nextSegIdx = ci; break; }
            }
            if (nextSegIdx < 0) break;
            used[nextSegIdx] = 1;

            const seg = segments[nextSegIdx];
            currentPt = (ptKey(seg[0]) === k) ? seg[1] : seg[0];
            contour.push(currentPt);
        }

        if (contour.length >= 5) contours.push(contour);
    }

    return contours;
}

// Legacy: returns only the largest (outer) contour as a single polygon.
function getContour(grid, W, H) {
    const all = getContoursWithHoles(grid, W, H);
    if (all.length === 0) return [];
    let largest = all[0];
    for (const c of all) if (c.length > largest.length) largest = c;
    return largest;
}

// CANONICAL sort for stable region identity across user-drawing, target, morph.
// Index 0 = OUTER (largest by vertex count).
// Index 1+ = HOLES, sorted by centroid Y ascending (top to bottom), X as tiebreaker.
// Guarantees colors stay consistent: i-th region is always the SAME region.
function sortContoursCanonical(contours) {
    if (!contours || contours.length <= 1) return contours;
    let largestIdx = 0;
    for (let i = 1; i < contours.length; i++) {
        if (contours[i].length > contours[largestIdx].length) largestIdx = i;
    }
    const outer = contours[largestIdx];
    const holes = [];
    for (let i = 0; i < contours.length; i++) {
        if (i !== largestIdx) holes.push(contours[i]);
    }
    holes.sort((a, b) => {
        const ca = centroid(a);
        const cb = centroid(b);
        if (Math.abs(ca[1] - cb[1]) > 5) return ca[1] - cb[1];
        return ca[0] - cb[0];
    });
    return [outer, ...holes];
}
