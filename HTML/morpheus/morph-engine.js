// Morph engine: pair regions, interpolate, render.
// Reads/writes global state defined in morph.html's inline script:
//   rawContour, rawContours, targetPolygon,
//   userMorphPoly, userMorphPolys, targetMorphPoly, targetMorphPolys,
//   morphCtx
// Uses helpers from morpheus/geometry.js and morpheus/contours.js:
//   rdp, resamplePolygon, centroid, bboxOfMultiPoly, sortContoursCanonical
// Reads DOM at call time only — safe to load before state init.

// Animation duration (ms) for the START → END morph
const MORPH_DURATION = 2500;

// Distinct colors per contour region — kept consistent across user/target/morph.
const REGION_COLORS = [
    '#ff3030', // red
    '#30c4ff', // bright cyan-blue
    '#ff30c8', // magenta
    '#ff9030', // orange
    '#a060ff', // purple
    '#30ffd0', // turquoise
    '#ff6060', // coral
    '#60a0ff', // light blue
];
function regionColor(idx) { return REGION_COLORS[idx % REGION_COLORS.length]; }

function getLargestTargetSubPoly() {
    if (!targetPolygon || targetPolygon.length === 0) return null;
    let largest = targetPolygon[0];
    for (const p of targetPolygon) if (p.length > largest.length) largest = p;
    return largest;
}

// Rotate (and possibly reverse) target polygon so that vertex order best matches user.
function alignTargetTo(userPoly, target) {
    const n = userPoly.length;
    if (target.length !== n) return target;
    function bestRotation(t) {
        let bestK = 0, bestDist = Infinity;
        for (let k = 0; k < n; k++) {
            let dist = 0;
            for (let i = 0; i < n; i++) {
                const dx = userPoly[i][0] - t[(i + k) % n][0];
                const dy = userPoly[i][1] - t[(i + k) % n][1];
                dist += dx * dx + dy * dy;
                if (dist >= bestDist) break;
            }
            if (dist < bestDist) { bestDist = dist; bestK = k; }
        }
        return { k: bestK, dist: bestDist };
    }
    const fwd = bestRotation(target);
    const rev = [...target].reverse();
    const bwd = bestRotation(rev);
    if (bwd.dist < fwd.dist) {
        return [...rev.slice(bwd.k), ...rev.slice(0, bwd.k)];
    }
    return [...target.slice(fwd.k), ...target.slice(0, fwd.k)];
}

// Build userMorphPolys[] and targetMorphPolys[] from current state.
// Uses canonical sort: index i is the same region (outer / top hole / ...)
// across user and target — so colors stay consistent.
function prepareMorph() {
    if (!targetPolygon) return false;
    const sourceContours = (rawContours && rawContours.length > 0)
        ? rawContours
        : (rawContour && rawContour.length >= 3 ? [rawContour] : []);
    if (sourceContours.length === 0) return false;

    const targetPolys = (targetPolygon || []).filter(p => p && p.length >= 3);
    if (targetPolys.length === 0) return false;

    const eps = +(document.getElementById('eps-slider')?.value ?? 1);

    // RDP-simplify and unclose each user contour
    const userSimplified = sourceContours
        .filter(c => c && c.length >= 3)
        .map(p => {
            let s = rdp(p, eps);
            if (s.length > 1 &&
                s[0][0] === s[s.length - 1][0] &&
                s[0][1] === s[s.length - 1][1]) {
                s = s.slice(0, -1);
            }
            return s;
        })
        .filter(p => p.length >= 3);
    if (userSimplified.length === 0) return false;

    // Canonical sort — outer first, holes by Y ascending.
    const userSorted = sortContoursCanonical(userSimplified);
    const targetSorted = sortContoursCanonical(targetPolys);

    // Translate ALL target polygons LEFT of the times outline (X only).
    // Keep Y as-is — the target is already correctly positioned (baseline aligned).
    const tb = bboxOfMultiPoly(targetSorted);
    const gap = 100;
    const dxTarget = tb.minX - gap - tb.maxX;
    const targetTranslated = targetSorted.map(p =>
        p.map(([x, y]) => [x + dxTarget, y])
    );

    // Direct index pairing — canonical sort guarantees i-th user region
    // corresponds to i-th target region.
    const newUserPolys = [];
    const newTargetPolys = [];
    const nRegions = Math.max(userSorted.length, targetTranslated.length);

    for (let i = 0; i < nRegions; i++) {
        const u = userSorted[i];
        const t = targetTranslated[i];

        if (u && t) {
            const resampledU = resamplePolygon(u, t.length);
            const alignedT = alignTargetTo(resampledU, t);
            newUserPolys.push(resampledU);
            newTargetPolys.push(alignedT);
        } else if (u) {
            const c = centroid(u);
            newUserPolys.push(u);
            newTargetPolys.push(u.map(() => [c[0], c[1]]));
        } else if (t) {
            const c = centroid(t);
            newUserPolys.push(t.map(() => [c[0], c[1]]));
            newTargetPolys.push(t);
        }
    }

    userMorphPolys = newUserPolys;
    targetMorphPolys = newTargetPolys;
    userMorphPoly = userMorphPolys[0] || null;
    targetMorphPoly = targetMorphPolys[0] || null;

    DebugWindow.log(`✓ prepareMorph: ${nRegions} region(s) matched`);
    return true;
}

// Similarity metric in pixels: 0 dist = 100%, 150 dist = 0%.
function calculateSimilarity(morphPts, targetPts) {
    if (!morphPts || !targetPts || morphPts.length === 0) return 0;
    let sumDist = 0;
    const n = Math.min(morphPts.length, targetPts.length);
    for (let i = 0; i < n; i++) {
        const dx = morphPts[i][0] - targetPts[i][0];
        const dy = morphPts[i][1] - targetPts[i][1];
        sumDist += Math.sqrt(dx * dx + dy * dy);
    }
    const avgDist = sumDist / n;
    const maxDist = 150;
    const similarity = Math.max(0, Math.min(100, 100 * (1 - avgDist / maxDist)));
    return Math.round(similarity);
}

// Render current morph state at interpolation parameter t ∈ [0, 1].
// forceLines / forcePoints (optional booleans) override LINES/POINTS toggles.
function drawMorph(t, forceLines, forcePoints) {
    morphCtx.clearRect(0, 0, 1000, 1000);
    if (!userMorphPolys || !targetMorphPolys || userMorphPolys.length === 0) return;

    morphCtx.save();

    // Interpolate each region separately
    const allInterp = [];
    for (let r = 0; r < userMorphPolys.length; r++) {
        const u = userMorphPolys[r];
        const tg = targetMorphPolys[r];
        const n = u.length;
        const pts = new Array(n);
        for (let i = 0; i < n; i++) {
            const ux = u[i][0], uy = u[i][1];
            const tx = tg[i][0], ty = tg[i][1];
            pts[i] = [ux + (tx - ux) * t, uy + (ty - uy) * t];
        }
        allInterp.push(pts);
    }

    // Fill all regions in ONE path with evenodd rule —
    // outer fills, holes XOR-cancel to become transparent.
    // Color morph: green (#adff2f) → target-yellow (#F4C430) over t∈[0,1].
    const cr = Math.round(173 + (244 - 173) * t);
    const cg = Math.round(255 + (196 - 255) * t);
    const cb = Math.round(47  + (48  - 47 ) * t);
    morphCtx.fillStyle = `rgb(${cr},${cg},${cb})`;
    morphCtx.beginPath();
    for (const pts of allInterp) {
        morphCtx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) morphCtx.lineTo(pts[i][0], pts[i][1]);
        morphCtx.closePath();
    }
    morphCtx.fill('evenodd');

    // Outline overlay per region (LINES / POINTS switches, overrideable)
    const showLines = forceLines !== undefined
        ? forceLines
        : (document.getElementById('lines-toggle')?.checked ?? true);
    const showPoints = forcePoints !== undefined
        ? forcePoints
        : (document.getElementById('points-toggle')?.checked ?? true);
    if (showLines || showPoints) {
        morphCtx.lineWidth = 2;
        morphCtx.lineCap = 'round';
        morphCtx.lineJoin = 'round';
        for (let r = 0; r < allInterp.length; r++) {
            const color = regionColor(r);
            if (showLines) {
                morphCtx.strokeStyle = color;
                morphCtx.beginPath();
                morphCtx.moveTo(allInterp[r][0][0], allInterp[r][0][1]);
                for (let i = 1; i < allInterp[r].length; i++) {
                    morphCtx.lineTo(allInterp[r][i][0], allInterp[r][i][1]);
                }
                morphCtx.closePath();
                morphCtx.stroke();
            }
            if (showPoints) {
                morphCtx.fillStyle = color;
                for (const [x, y] of allInterp[r]) {
                    morphCtx.beginPath();
                    morphCtx.arc(x, y, 1.6, 0, Math.PI * 2);
                    morphCtx.fill();
                }
            }
        }
    }
    morphCtx.restore();

    // Similarity in % — updated EVERY frame, shown in the corner box.
    let totalDist = 0, totalPts = 0;
    for (let r = 0; r < allInterp.length; r++) {
        const u = allInterp[r];
        const tg = targetMorphPolys[r];
        const n = Math.min(u.length, tg.length);
        for (let i = 0; i < n; i++) {
            const dx = u[i][0] - tg[i][0];
            const dy = u[i][1] - tg[i][1];
            totalDist += Math.sqrt(dx * dx + dy * dy);
        }
        totalPts += n;
    }
    const avgDist = totalPts > 0 ? totalDist / totalPts : 0;
    const sim = Math.round(Math.max(0, Math.min(100, 100 * (1 - avgDist / 150))));

    const simEl = document.getElementById('morph-similarity');
    if (simEl) simEl.textContent = sim + '%';
    const simBoxVal = document.getElementById('sim-value');
    if (simBoxVal) simBoxVal.textContent = sim + '%';

    // At the END of the morph, prune zero-area regions (collapsed points)
    if (t >= 1) {
        const regionAreas = allInterp.map(poly => {
            let a = 0;
            for (let i = 0; i < poly.length; i++) {
                const [x1, y1] = poly[i];
                const [x2, y2] = poly[(i + 1) % poly.length];
                a += (x2 - x1) * (y2 + y1);
            }
            return Math.round(Math.abs(a) / 2);
        });
        const keep = regionAreas.map(a => a > 0);
        const pruned = regionAreas.length - keep.filter(Boolean).length;

        DebugWindow.log(`🎬 t=100% | sim: ${sim}% (avg dist ${Math.round(avgDist)}px) | ${keep.filter(Boolean).length} region(s)`);
        regionAreas.forEach((a, i) => {
            if (!keep[i]) return;
            const role = i === 0 ? 'outer' : `hole ${i}`;
            DebugWindow.log(`  region ${i} (${role}): ${a} px²`);
        });

        if (pruned > 0) {
            userMorphPolys = userMorphPolys.filter((_, i) => keep[i]);
            targetMorphPolys = targetMorphPolys.filter((_, i) => keep[i]);
            userMorphPoly = userMorphPolys[0] || null;
            targetMorphPoly = targetMorphPolys[0] || null;
            // Also prune rawContours (only when counts align) so outlines
            // match when stopMorph restores the user drawing. We do NOT call
            // drawPolygon() here — that would resurrect the hidden user art.
            if (typeof rawContours !== 'undefined' && rawContours &&
                rawContours.length === regionAreas.length) {
                rawContours = rawContours.filter((_, i) => keep[i]);
                rawContour = rawContours[0] || null;
            }
            DebugWindow.log(`  🗑 deleted ${pruned} zero-area region(s)`);
        }
    }
}
