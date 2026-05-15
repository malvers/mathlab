// Cross-pane region matching for draw20.
//
// Pure function — no closure state. Takes PNG + LaTeX contour arrays and
// returns the same shape draw20.js was producing inline:
//   { pngId, latId, idToPair, plausibility, pClass, lClass }
//
// pngId/latId: per-contour matchId arrays (holes inherit their outer's id;
// unpaired outers get a unique id that doesn't appear on the other side).
//
// NEW STRATEGY (replaces Hungarian):
// Greedy sequential matching with symbol-type classification.
// Symbols are classified as 'stroke', 'loop', or 'glyph' based on geometry,
// then matched tier-by-tier. This respects formula structure far better than
// Hungarian's global optimization.
//
// Requires globals: classifyContours (count-objects.js),
//                   PlausibilCheck    (plausibilcheck.js).

function draw20ComputeMatchIds(pngContours, latexContours, options) {
    const matchingEnabled = !options || options.matchingEnabled !== false;
    const dbg = (options && typeof options.dbg === 'function') ? options.dbg : () => {};

    const safe = (c) => Array.isArray(c) ? c : [];
    const png = safe(pngContours);
    const lat = safe(latexContours);
    const pClass = (typeof classifyContours === 'function')
        ? classifyContours(png) : { outers: png.map((_,i) => ({ idx: i, holes: [] })), holes: [] };
    const lClass = (typeof classifyContours === 'function')
        ? classifyContours(lat) : { outers: lat.map((_,i) => ({ idx: i, holes: [] })), holes: [] };
    const pngId = new Array(png.length).fill(-1);
    const latId = new Array(lat.length).fill(-1);

    const pOuters = pClass.outers.map(o => png[o.idx]);
    const lOuters = lClass.outers.map(o => lat[o.idx]);

    const N = pClass.outers.length, M = lClass.outers.length;
    const assign = new Array(N).fill(-1);
    let plausibility = null;

    if (matchingEnabled && N > 0 && M > 0 && typeof PlausibilCheck !== 'undefined') {
        const pBB = PlausibilCheck.equationBBox(pOuters);
        const lBB = PlausibilCheck.equationBBox(lOuters);
        const pDesc = pClass.outers.map(o => PlausibilCheck.shapeDescriptor(
            png[o.idx],
            (o.holes || []).map(hi => png[hi]).filter(Boolean),
            pBB));
        const lDesc = lClass.outers.map(o => PlausibilCheck.shapeDescriptor(
            lat[o.idx],
            (o.holes || []).map(hi => lat[hi]).filter(Boolean),
            lBB));

        // Symbol type classification: group shapes by topological properties
        const symbolType = (desc) => {
            if (!desc) return 'glyph';
            if (desc.holes > 0) return 'loop';
            if (desc.elong > 3) return 'stroke';
            return 'glyph';
        };

        const pTypes = pDesc.map(d => symbolType(d));
        const lTypes = lDesc.map(d => symbolType(d));

        // dbg(`PNG types: ${pTypes.join(',')}`);
        // dbg(`LaTeX types: ${lTypes.join(',')}`);

        const VETO = 1e9;
        const usedPng = new Set(), usedLat = new Set();

        // Tier-based greedy matching: process symbol types in priority order
        const TIERS = ['stroke', 'loop', 'glyph'];

        for (const tier of TIERS) {
            const tierCosts = [];
            for (let i = 0; i < N; i++) {
                if (usedPng.has(i) || pTypes[i] !== tier || !pDesc[i]) continue;
                for (let j = 0; j < M; j++) {
                    if (usedLat.has(j) || lTypes[j] !== tier || !lDesc[j]) continue;
                    const cost = PlausibilCheck.pairCost(pDesc[i], lDesc[j]);
                    if (cost >= VETO) continue;
                    tierCosts.push({ i, j, cost });
                }
            }
            tierCosts.sort((a, b) => a.cost - b.cost);

            for (const { i, j } of tierCosts) {
                if (usedPng.has(i) || usedLat.has(j)) continue;
                assign[i] = j;
                usedPng.add(i);
                usedLat.add(j);
                // dbg(`  [${tier}] PNG#${i} ↔ LaTeX#${j}`);
            }
        }

        // Fallback: match remaining unmatched pairs without type constraint
        const fallbackCosts = [];
        for (let i = 0; i < N; i++) {
            if (usedPng.has(i) || !pDesc[i]) continue;
            for (let j = 0; j < M; j++) {
                if (usedLat.has(j) || !lDesc[j]) continue;
                const cost = PlausibilCheck.pairCost(pDesc[i], lDesc[j]);
                if (cost >= VETO) continue;
                fallbackCosts.push({ i, j, cost });
            }
        }
        fallbackCosts.sort((a, b) => a.cost - b.cost);

        for (const { i, j } of fallbackCosts) {
            if (usedPng.has(i) || usedLat.has(j)) continue;
            assign[i] = j;
            usedPng.add(i);
            usedLat.add(j);
            // dbg(`  [fallback] PNG#${i} ↔ LaTeX#${j}`);
        }

        // Plausibility check on the resulting pairing
        if (typeof PlausibilCheck !== 'undefined' && pDesc.length) {
            const pairing = assign.slice();
            plausibility = PlausibilCheck.checkMatching(pOuters, lOuters, pairing, pDesc, lDesc);
            // dbg(PlausibilCheck.summarize(plausibility));
            // for (const m of plausibility.matches) {
            //     if (m.verdict !== 'ok') dbg(PlausibilCheck.describeMatch(m));
            // }
            // for (const o of plausibility.pngOrphans) dbg(PlausibilCheck.describeOrphan(o, 'png'));
            // for (const o of plausibility.latexOrphans) dbg(PlausibilCheck.describeOrphan(o, 'latex'));
        }
    }

    // Build result structure (same as before)
    const usedLatex = new Set();
    let nextId = 0;
    const idToPair = new Map();

    for (let oi = 0; oi < pClass.outers.length; oi++) {
        const id = nextId++;
        const po = pClass.outers[oi];
        pngId[po.idx] = id;
        for (const hi of po.holes) pngId[hi] = id;

        const j = assign[oi];
        if (j !== undefined && j >= 0 && j < lClass.outers.length && !usedLatex.has(j)) {
            const lo = lClass.outers[j];
            latId[lo.idx] = id;
            for (const hi of lo.holes) latId[hi] = id;
            usedLatex.add(j);
            idToPair.set(id, { png: oi, lat: j });
        } else {
            idToPair.set(id, { png: oi, lat: -1 });
        }
    }

    for (let j = 0; j < lClass.outers.length; j++) {
        if (usedLatex.has(j)) continue;
        const id = nextId++;
        const lo = lClass.outers[j];
        latId[lo.idx] = id;
        for (const hi of lo.holes) latId[hi] = id;
        idToPair.set(id, { png: -1, lat: j });
    }

    return { pngId, latId, idToPair, plausibility, pClass, lClass };
}
