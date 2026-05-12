// Bipartite region matching: pair user contours to target contours
// minimizing total cost (normalized centroid distance + area + aspect).
// Uses the Hungarian algorithm (Kuhn-Munkres) on a rectangular cost matrix.
//
// Why: with N user regions and M target regions, naive sort-by-X pairing fails on
// stacked/fractional formulas. Hungarian finds the assignment that minimises total
// pairwise cost, which — for points normalized into the same frame — also
// minimises line crossings (triangle-inequality argument).
//
// Reads/writes globals defined in morph.html's inline script:
//   rawContours, targetPolygon, userColorIdx, targetColorIdx, userToTargetMatch
// Uses helpers from other morpheus modules:
//   centroid, bboxOf, bboxOfMultiPoly (geometry.js)
//   signedArea (count-objects.js)

// ── Normalize: zero-center, scale to unit range, preserving aspect ──────────
// Both user and target are normalized independently so their centroids land in
// the same canonical frame [-1, 1] × [-1, 1].
function normalizeForMatching(polys) {
    if (!polys || polys.length === 0) return [];
    const bb = bboxOfMultiPoly(polys);
    const cx = (bb.minX + bb.maxX) / 2;
    const cy = (bb.minY + bb.maxY) / 2;
    const range = Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY, 1);
    const scale = 2 / range; // longest side → [-1, 1]
    return polys.map(p => p.map(([x, y]) => [(x - cx) * scale, (y - cy) * scale]));
}

// ── Descriptor: centroid + size + aspect (in normalized space) ──────────────
function regionDescriptor(poly) {
    const c = centroid(poly);
    const a = Math.abs(signedArea(poly));
    const bb = bboxOf(poly);
    const w = bb.maxX - bb.minX;
    const h = bb.maxY - bb.minY;
    return { cx: c[0], cy: c[1], area: a, w, h };
}

// ── Pairwise cost: low = good match ─────────────────────────────────────────
function regionCost(u, t) {
    // Spatial: dominant; normalized polygons live in [-1, 1] so distance ≤ ~2.83.
    const dx = u.cx - t.cx;
    const dy = u.cy - t.cy;
    const spatial = Math.sqrt(dx * dx + dy * dy);
    // Area: log-ratio of normalized areas, clamped to [0, 2].
    const areaRatio = Math.log((u.area + 0.001) / (t.area + 0.001));
    const areaPen = Math.min(2, Math.abs(areaRatio));
    // Aspect: difference in log(w/h), clamped to [0, 2].
    const ua = Math.log((u.w + 0.001) / (u.h + 0.001));
    const ta = Math.log((t.w + 0.001) / (t.h + 0.001));
    const aspectPen = Math.min(2, Math.abs(ua - ta));
    // Weighted sum — spatial dominates, area+aspect break ties.
    return spatial + 0.25 * areaPen + 0.15 * aspectPen;
}

// ── Hungarian (Kuhn-Munkres) on rectangular cost matrix ─────────────────────
// O(n³) potential-based augmenting-path variant (e-maxx style, 1-indexed).
// Returns assign[] of length N where assign[i] = j (column matched to row i)
// or -1 if row i has no real-column match (when N > M).
function hungarian(costMatrix) {
    const N = costMatrix.length;
    if (N === 0) return [];
    const M = costMatrix[0].length;
    if (M === 0) return new Array(N).fill(-1);

    const size = Math.max(N, M);
    const INF = 1e15;

    // Pad to square with INF cost — dummy cells force real-real assignment first.
    const c = new Array(size);
    for (let i = 0; i < size; i++) {
        c[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            c[i][j] = (i < N && j < M) ? costMatrix[i][j] : INF;
        }
    }

    const u = new Array(size + 1).fill(0);
    const v = new Array(size + 1).fill(0);
    const p = new Array(size + 1).fill(0);
    const way = new Array(size + 1).fill(0);

    for (let i = 1; i <= size; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = new Array(size + 1).fill(Infinity);
        const used = new Array(size + 1).fill(false);
        do {
            used[j0] = true;
            const i0 = p[j0];
            let delta = Infinity, j1 = -1;
            for (let j = 1; j <= size; j++) {
                if (used[j]) continue;
                const cur = c[i0 - 1][j - 1] - u[i0] - v[j];
                if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                if (minv[j] < delta) { delta = minv[j]; j1 = j; }
            }
            for (let j = 0; j <= size; j++) {
                if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                else minv[j] -= delta;
            }
            j0 = j1;
        } while (p[j0] !== 0);
        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }

    // Decode: column j ← row p[j]. Strip dummy padding.
    const assign = new Array(N).fill(-1);
    for (let j = 1; j <= size; j++) {
        const row = p[j] - 1;
        const col = j - 1;
        if (row >= 0 && row < N && col >= 0 && col < M) {
            assign[row] = col;
        }
    }
    return assign;
}

// ── High-level: match user contours → target contours ───────────────────────
function matchContours(userPolys, targetPolys) {
    if (!userPolys || !targetPolys) return [];
    const N = userPolys.length, M = targetPolys.length;
    if (N === 0) return [];
    if (M === 0) return new Array(N).fill(-1);

    const userNorm = normalizeForMatching(userPolys);
    const targetNorm = normalizeForMatching(targetPolys);
    const userDesc = userNorm.map(regionDescriptor);
    const targetDesc = targetNorm.map(regionDescriptor);

    const cost = new Array(N);
    for (let i = 0; i < N; i++) {
        cost[i] = new Array(M);
        for (let j = 0; j < M; j++) {
            cost[i][j] = regionCost(userDesc[i], targetDesc[j]);
        }
    }

    return hungarian(cost);
}

// ── Update global color indices + match map based on current state ──────────
// Called whenever rawContours or targetPolygon changes (after canonical sort).
// Side-effects: userColorIdx, targetColorIdx, userToTargetMatch.
// Convention: userColorIdx[i] = i (user is the colour anchor); matched target
// inherits its user's colour; unmatched targets get fresh indices appended.
function updateMatching() {
    const haveUser = (typeof rawContours !== 'undefined')
        && rawContours && rawContours.length > 0;
    const haveTarget = (typeof targetPolygon !== 'undefined')
        && targetPolygon && targetPolygon.length > 0;

    userColorIdx = haveUser ? rawContours.map((_, i) => i) : [];
    targetColorIdx = haveTarget ? targetPolygon.map((_, i) => i) : [];
    userToTargetMatch = haveUser ? new Array(rawContours.length).fill(-1) : [];

    if (!haveUser || !haveTarget) return;

    const assign = matchContours(rawContours, targetPolygon);
    userToTargetMatch = assign;

    targetColorIdx = new Array(targetPolygon.length).fill(-1);
    const matched = new Set();
    for (let i = 0; i < rawContours.length; i++) {
        const j = assign[i];
        if (j >= 0 && j < targetPolygon.length) {
            targetColorIdx[j] = userColorIdx[i];
            matched.add(j);
        }
    }
    // Unmatched targets get fresh colour indices after the user range.
    let next = rawContours.length;
    for (let j = 0; j < targetPolygon.length; j++) {
        if (targetColorIdx[j] === -1) targetColorIdx[j] = next++;
    }

    if (typeof DebugWindow !== 'undefined') {
        const pairs = assign.map((j, i) => j >= 0 ? `${i}→${j}` : `${i}→·`).join(', ');
        DebugWindow.log(`🎯 Hungarian: [${pairs}] (user=${rawContours.length}, target=${targetPolygon.length})`);
    }
}
