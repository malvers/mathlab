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
function regionColor(idx) {
    // Robust against undefined/NaN/negative inputs — colour arrays may be
    // briefly out of sync during boot.
    if (typeof idx !== 'number' || !isFinite(idx)) idx = 0;
    const n = REGION_COLORS.length;
    return REGION_COLORS[((idx % n) + n) % n];
}

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
//
// Pairing strategy: Hungarian bipartite matching (see matching.js).
// rawContours and targetPolygon are kept in canonical sort order by their
// respective producers; the matching authority is updateMatching(), which
// stores userToTargetMatch[i] = j (target index paired with user contour i,
// -1 if no pair). This function consumes that map so the morph pairing
// agrees with the static colour assignment.
function prepareMorph() {
    if (!targetPolygon) return false;
    const sourceContours = (rawContours && rawContours.length > 0)
        ? rawContours
        : (rawContour && rawContour.length >= 3 ? [rawContour] : []);
    if (sourceContours.length === 0) return false;

    const targetPolys = (targetPolygon || []).filter(p => p && p.length >= 3);
    if (targetPolys.length === 0) return false;

    const eps = +(document.getElementById('eps-slider')?.value ?? 1);

    // RDP-simplify in place (preserve array length so userToTargetMatch indices
    // remain valid). Bad entries become length-0 and are skipped in the loop.
    const userSimplified = sourceContours.map(p => {
        if (!p || p.length < 3) return [];
        let s = rdp(p, eps);
        if (s.length > 1 &&
            s[0][0] === s[s.length - 1][0] &&
            s[0][1] === s[s.length - 1][1]) {
            s = s.slice(0, -1);
        }
        return s;
    });

    // Translate ALL target polygons LEFT of the user (X only).
    const tb = bboxOfMultiPoly(targetPolys);
    const gap = 100;
    const dxTarget = tb.minX - gap - tb.maxX;
    const targetTranslated = targetPolys.map(p =>
        p.map(([x, y]) => [x + dxTarget, y])
    );

    // Use the global Hungarian assignment from matching.js. Fall back to a
    // fresh match if the global is stale (e.g. matching.js not yet run) or to
    // identity pairing if matching.js is missing entirely.
    let assign;
    if (typeof userToTargetMatch !== 'undefined' &&
        userToTargetMatch.length === sourceContours.length) {
        assign = userToTargetMatch.slice();
    } else if (typeof matchContours === 'function') {
        assign = matchContours(userSimplified, targetTranslated);
    } else {
        assign = userSimplified.map((_, i) => i < targetTranslated.length ? i : -1);
    }

    const newUserPolys = [];
    const newTargetPolys = [];
    const newColors = [];
    const targetUsed = new Set();

    for (let i = 0; i < userSimplified.length; i++) {
        const u = userSimplified[i];
        if (u.length < 3) continue;
        const colorIdx = (typeof userColorIdx !== 'undefined' && userColorIdx[i] !== undefined)
            ? userColorIdx[i] : i;
        const j = assign[i];

        if (j >= 0 && j < targetTranslated.length && !targetUsed.has(j)) {
            const t = targetTranslated[j];
            const resampledU = resamplePolygon(u, t.length);
            const alignedT = alignTargetTo(resampledU, t);
            newUserPolys.push(resampledU);
            newTargetPolys.push(alignedT);
            newColors.push(colorIdx);
            targetUsed.add(j);
        } else {
            // Unmatched user → collapses to its own centroid at t=1.
            const c = centroid(u);
            newUserPolys.push(u);
            newTargetPolys.push(u.map(() => [c[0], c[1]]));
            newColors.push(colorIdx);
        }
    }
    // Unmatched targets emerge from their own centroid at t=0.
    for (let j = 0; j < targetTranslated.length; j++) {
        if (targetUsed.has(j)) continue;
        const t = targetTranslated[j];
        const c = centroid(t);
        newUserPolys.push(t.map(() => [c[0], c[1]]));
        newTargetPolys.push(t);
        const colorIdx = (typeof targetColorIdx !== 'undefined' && targetColorIdx[j] !== undefined)
            ? targetColorIdx[j] : (sourceContours.length + j);
        newColors.push(colorIdx);
    }

    if (newUserPolys.length === 0) return false;

    userMorphPolys = newUserPolys;
    targetMorphPolys = newTargetPolys;
    morphColorIdx = newColors;
    userMorphPoly = userMorphPolys[0] || null;
    targetMorphPoly = targetMorphPolys[0] || null;

    DebugWindow.log(`✓ prepareMorph: ${userMorphPolys.length} region(s), ${targetUsed.size} paired by Hungarian`);
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

    // Helper: signed area magnitude (shoelace)
    const polyArea = poly => {
        let a = 0;
        for (let i = 0; i < poly.length; i++) {
            const [x1, y1] = poly[i];
            const [x2, y2] = poly[(i + 1) % poly.length];
            a += (x2 - x1) * (y2 + y1);
        }
        return Math.abs(a) / 2;
    };

    // At t=1, DELETE zero-area (collapsed-to-point) regions from state
    // BEFORE rendering — threshold 1 px² to be safe (real regions have ≥100).
    let pruned = 0;
    if (t >= 1) {
        const targetAreas = targetMorphPolys.map(polyArea);
        DebugWindow.log(`  pruning check — targetAreas: [${targetAreas.map(Math.round).join(', ')}]`);
        const keep = targetAreas.map(a => a >= 1);
        pruned = targetAreas.length - keep.filter(Boolean).length;
        if (pruned > 0) {
            const origLen = userMorphPolys.length;
            userMorphPolys = userMorphPolys.filter((_, i) => keep[i]);
            targetMorphPolys = targetMorphPolys.filter((_, i) => keep[i]);
            userMorphPoly = userMorphPolys[0] || null;
            targetMorphPoly = targetMorphPolys[0] || null;
            if (typeof morphColorIdx !== 'undefined' && morphColorIdx.length === origLen) {
                morphColorIdx = morphColorIdx.filter((_, i) => keep[i]);
            }
            if (typeof rawContours !== 'undefined' && rawContours &&
                rawContours.length === origLen) {
                rawContours = rawContours.filter((_, i) => keep[i]);
                rawContour = rawContours[0] || null;
                DebugWindow.log(`  rawContours pruned: ${origLen} → ${rawContours.length}`);
            }
        }
    }

    if (userMorphPolys.length === 0) {
        morphCtx.restore();
        return;
    }

    // Interpolate each (surviving) region
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
    // PIXEL switch hides the fill (the morph's "pixel art" equivalent).
    const showArt = document.getElementById('art-toggle')?.checked ?? true;
    if (showArt) {
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
    }

    // Outline overlay per region (LINES / POINTS switches, overrideable)
    const showLines = forceLines !== undefined
        ? forceLines
        : (document.getElementById('lines-toggle')?.checked ?? true);
    const showPoints = forcePoints !== undefined
        ? forcePoints
        : (document.getElementById('points-toggle')?.checked ?? true);
    if (showLines || showPoints) {
        const lw = (typeof outlineWidth !== 'undefined') ? outlineWidth : 1.5;
        morphCtx.lineWidth = lw;
        morphCtx.lineCap = 'round';
        morphCtx.lineJoin = 'round';
        for (let r = 0; r < allInterp.length; r++) {
            const cIdx = (typeof morphColorIdx !== 'undefined' && morphColorIdx[r] !== undefined)
                ? morphColorIdx[r] : r;
            const color = regionColor(cIdx);
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
                    morphCtx.arc(x, y, lw, 0, Math.PI * 2);
                    morphCtx.fill();
                }
            }
        }
    }
    morphCtx.restore();

    // Similarity in % — updated EVERY frame
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

    // Final debug log
    if (t >= 1) {
        DebugWindow.log(`🎬 t=100% | sim: ${sim}% (avg dist ${Math.round(avgDist)}px) | ${allInterp.length} region(s)`);
        allInterp.forEach((poly, i) => {
            const a = Math.round(polyArea(poly));
            const role = i === 0 ? 'outer' : `hole ${i}`;
            DebugWindow.log(`  region ${i} (${role}): ${a} px²`);
        });
        if (pruned > 0) DebugWindow.log(`  🗑 deleted ${pruned} zero-area region(s)`);
    }
}
