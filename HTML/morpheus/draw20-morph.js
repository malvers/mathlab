// Morph: interpolate matched outer pairs between PNG and LaTeX
// (or stift↔LaTeX once the user has extracted their own outlines).
//
// Owns:
//   - stiftMorphPairs (built by buildStiftMorphPairs)
//   - MORPH_EPS, animation state (morphAnimRaf, morphAnimStart)
//   - in-place BB align + engine alignTargetTo wrapper
//   - the slider override (window.onMorphSlider) + ► MORPH button anim
//
// Receives morphPairs by reference — renderBBoxes (in draw20.js) keeps
// rebuilding that array, the factory just reads it.
//
// Requires globals: alignTargetTo (morph-engine.js), resamplePolygon
// (geometry.js), classifyContours (count-objects.js), draw20PaletteColor
// (draw20-constants.js).

function createDraw20Morph({
    morphLayer,
    overlay,
    pix, tex,
    stiftCanvas,
    stiftOutlineSvg,
    wrap,
    morphPairs,
    getZoom,
    getLatexCanvas,
    getStiftContours,
    getBaseSimilarity,
    extractLatexContours,
    computeMatchIds,
    dbg,
}) {
    const log = (typeof dbg === 'function') ? dbg : () => {};
    const getZ = (typeof getZoom === 'function') ? getZoom : () => 1;
    const getLC = (typeof getLatexCanvas === 'function') ? getLatexCanvas : () => null;
    const getSC = (typeof getStiftContours === 'function') ? getStiftContours : () => null;
    const getBS = (typeof getBaseSimilarity === 'function') ? getBaseSimilarity : () => 0;

    const stiftMorphPairs = [];
    const MORPH_EPS = 0.02;

    // ── Geometry helpers ────────────────────────────────────────────────────
    function resampleClosed(pts, n) {
        if (!pts || pts.length === 0) return [];
        if (typeof resamplePolygon === 'function') {
            const arr = pts.map(p => [p.x, p.y]);
            return resamplePolygon(arr, n).map(p => ({ x: p[0], y: p[1] }));
        }
        // Stride fallback if geometry.js helper is missing.
        const step = pts.length / n;
        const out = [];
        for (let i = 0; i < n; i++) out.push(pts[Math.floor(i * step) % pts.length]);
        return out;
    }
    // BB helpers for nearest-mapping + in-place morph.
    function bboxOfPts(pts) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const q of pts) {
            if (q.x < minX) minX = q.x;
            if (q.y < minY) minY = q.y;
            if (q.x > maxX) maxX = q.x;
            if (q.y > maxY) maxY = q.y;
        }
        return { minX, minY, maxX, maxY };
    }
    // Translate + scale `l` so its BB lands exactly on the BB of `p` — the
    // morph then happens in place at the source location and size instead of
    // travelling across the pane.
    function alignDstToSrcBBox(p, l) {
        const pBB = bboxOfPts(p), lBB = bboxOfPts(l);
        const pCx = (pBB.minX + pBB.maxX) / 2;
        const pCy = (pBB.minY + pBB.maxY) / 2;
        const lCx = (lBB.minX + lBB.maxX) / 2;
        const lCy = (lBB.minY + lBB.maxY) / 2;
        // Translate-only: keep the LaTeX target at its NATURAL size,
        // just shift its centroid onto the source centroid. The morph
        // result at t=1 is then exactly the LaTeX size at the source
        // location. (anisotropic scaling distorted; min(sx,sy) shrank.)
        return l.map(q => ({
            x: q.x - lCx + pCx,
            y: q.y - lCy + pCy,
        }));
    }
    // Wrapper around the engine function `alignTargetTo` (morph-engine.js).
    // Finds the rotation k (and optional reverse) of the target polygon
    // that minimises the sum of squared point-to-point distances to the
    // source — proven logic from the legacy morph.
    // Both polygons must be the same length (= N after resample) and live
    // in the SAME coordinate system (BB-aligned via alignDstToSrcBBox) so
    // that the distances are comparable.
    // Returns { alignedXY, idxMap } — alignedXY is the rotated target in
    // the same {x,y} format as the source, idxMap[i] gives the original
    // target index (in `l`) for source point i.
    function alignTargetWithEngine(p, l) {
        if (typeof alignTargetTo !== 'function') return null;
        if (p.length !== l.length) return null;
        // Engine expects [x,y] tuples; trail an index tag so we can track
        // the original position through the rotation/reverse (the engine
        // slices 3-tuples transparently).
        const src = p.map(q => [q.x, q.y]);
        const tgt = l.map((q, i) => [q.x, q.y, i]);
        const res = alignTargetTo(src, tgt);
        return {
            alignedXY: res.map(t => ({ x: t[0], y: t[1] })),
            idxMap: res.map(t => t[2]),
        };
    }
    // BB-Nearest pairing — currently unused by the morph but kept for
    // potential future visualisations. Pure helper, no closure deps.
    function mapByBBoxNearest(p, l) {
        const pBB = bboxOfPts(p), lBB = bboxOfPts(l);
        const pW = Math.max(1e-6, pBB.maxX - pBB.minX);
        const pH = Math.max(1e-6, pBB.maxY - pBB.minY);
        const lW = Math.max(1e-6, lBB.maxX - lBB.minX);
        const lH = Math.max(1e-6, lBB.maxY - lBB.minY);
        const pN = p.map(q => [(q.x - pBB.minX) / pW, (q.y - pBB.minY) / pH]);
        const lN = l.map(q => [(q.x - lBB.minX) / lW, (q.y - lBB.minY) / lH]);
        const map = new Array(p.length).fill(0);
        for (let i = 0; i < p.length; i++) {
            let bestJ = 0, bestD = Infinity;
            const pxi = pN[i][0], pyi = pN[i][1];
            for (let j = 0; j < l.length; j++) {
                const dx = lN[j][0] - pxi, dy = lN[j][1] - pyi;
                const d = dx * dx + dy * dy;
                if (d < bestD) { bestD = d; bestJ = j; }
            }
            map[i] = bestJ;
        }
        return map;
    }

    // ── renderMorph: in-place at the source position ────────────────────────
    // Source = stift (own drawing) when stiftMorphPairs is populated, else
    // the PNG preset. Both panes stay visible as reference — the morph
    // happens in the polygon overlay at source location/size, instead of
    // travelling across the pane.
    // t < eps → pre-morph preview: correspondence lines source → target.
    // t ≥ eps → polygon overlay: shape morphs src → dst (alignDstToSrcBBox).
    function renderMorph(t) {
        while (morphLayer.firstChild) morphLayer.removeChild(morphLayer.firstChild);
        t = Math.max(0, Math.min(1, t));
        const useStift = stiftMorphPairs.length > 0;
        const pairs = useStift ? stiftMorphPairs : morphPairs;
        const srcKey = useStift ? 'srcPts' : 'pngPts';
        const dstKey = useStift ? 'dstPts' : 'latPts';
        // log(`🎬 renderMorph(t=${t.toFixed(3)}) useStift=${useStift} stiftMP=${stiftMorphPairs.length} pngMP=${morphPairs.length}`);
        const srcEl = useStift ? stiftCanvas : pix;
        tex.style.opacity = '';
        if (!pairs.length) {
            // log('🎬 ⊘ EARLY RETURN — pairs.length === 0');
            srcEl.style.opacity = '';
            // CRITICAL: drop the morph-src-* classes — without this the
            // stiftCanvas can stay visibility:hidden after LÖSCHEN, which
            // blocks all mouse events and breaks drawing until reload.
            pix.classList.remove('morph-src-pixel-hidden');
            stiftCanvas.classList.remove('morph-src-pixel-hidden');
            overlay.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
            stiftOutlineSvg.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
            // Pre-morph not active: show all outlines/points again.
            overlay.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
            stiftOutlineSvg.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
            stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
            return;
        }
        // Source pane: visible ONLY at t==0; hidden as soon as the morph
        // starts. Use a CSS class with !important so the PIXEL toggle
        // (applyArtToggle sets inline opacity/visibility) cannot bring
        // the source back during morph.
        if (t > 0) {
            srcEl.classList.add('morph-src-pixel-hidden');
        } else {
            // Drop class from both panes so toggles work normally again.
            pix.classList.remove('morph-src-pixel-hidden');
            stiftCanvas.classList.remove('morph-src-pixel-hidden');
        }
        // Interpolate the displayed similarity from baseSimilarity → 100%.
        const morphedSim = Math.round(getBS() + (100 - getBS()) * t);
        const simVal = document.getElementById('sim-value');
        if (simVal) simVal.textContent = morphedSim + '%';
        // Source figure (PNG or stift) is completely hidden the moment
        // morph starts — pts, lines, fills AND pixels — and stays hidden
        // through to t=1. Only at t==0 the source is fully visible.
        // We tag elements with class `morph-src-hidden` (CSS rule with
        // `!important` lives in morph.css). This SURVIVES later toggle
        // clicks (PUNKTE/LINIE/etc.) because the class wins over their
        // inline `display=''` resets — the source stays gone for good.
        if (t > 0) {
            const srcLabel = useStift ? 'stift' : 'png';
            overlay.querySelectorAll(`polygon[data-source="${srcLabel}"]`).forEach(p => p.classList.add('morph-src-hidden'));
            overlay.querySelectorAll(`circle[data-kind="point"][data-source="${srcLabel}"]`).forEach(c => c.classList.add('morph-src-hidden'));
            overlay.querySelectorAll(`path[data-source="${srcLabel}"]`).forEach(p => p.classList.add('morph-src-hidden'));
            if (useStift) {
                stiftOutlineSvg.querySelectorAll('polygon').forEach(p => p.classList.add('morph-src-hidden'));
                stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(c => c.classList.add('morph-src-hidden'));
                stiftOutlineSvg.querySelectorAll('path[data-kind="fill"]').forEach(p => p.classList.add('morph-src-hidden'));
            }
        } else {
            // t==0: drop the class so source becomes visible again.
            overlay.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
            stiftOutlineSvg.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
        }
        if (t === 0) {
            const corrToggle = document.getElementById('correspondence-toggle');
            const showCorr = corrToggle ? corrToggle.checked : true;
            if (!showCorr) return;
            // Formula mode: only show lines for the currently hovered match.
            // If nothing is hovered, no lines at all. Stift mode keeps the
            // existing behaviour (all pairs shown).
            const activeId = (overlay.dataset && overlay.dataset.activeMatchId) || '';
            if (!useStift && !activeId) return;
            const svgNS = 'http://www.w3.org/2000/svg';
            const z = getZ() || 1;
            const sw = String(0.8 / z);
            let drawnLines = 0;
            let pairIdx = 0;
            for (const pair of pairs) {
                // Formula mode: skip non-hovered pairs.
                if (!useStift && String(pair.mid) !== activeId) continue;
                const srcLen = pair[srcKey] ? pair[srcKey].length : 0;
                const dstLen = pair[dstKey] ? pair[dstKey].length : 0;
                pairIdx++;
                const N = Math.max(srcLen, dstLen);
                const p = resampleClosed(pair[srcKey], N);
                const l = resampleClosed(pair[dstKey], N);
                if (p.length < 3 || l.length < 3) continue;
                // Pre-morph "MORPH LINIEN": lines end ON the LaTeX (no
                // shift). The polygon-morph branch below uses the shift
                // so the final morph lands NEXT TO the LaTeX — but at
                // t=0 we show the natural correspondence.
                const lInPlace = alignDstToSrcBBox(p, l);
                let idxMap = null;
                let anchors = null;
                if (typeof draw20CornerMatch === 'function') {
                    const cm = draw20CornerMatch(p, lInPlace);
                    if (cm && cm.idxMap) { idxMap = cm.idxMap; anchors = cm.anchors; }
                }
                if (!idxMap) {
                    const eng = alignTargetWithEngine(p, lInPlace);
                    if (!eng) continue;
                    idxMap = eng.idxMap;
                }
                const color = draw20PaletteColor(pair.mid);
                for (let i = 0; i < N; i++) {
                    const j = idxMap[i];
                    const ln = document.createElementNS(svgNS, 'line');
                    ln.setAttribute('x1', p[i].x.toFixed(2));
                    ln.setAttribute('y1', p[i].y.toFixed(2));
                    ln.setAttribute('x2', l[j].x.toFixed(2));
                    ln.setAttribute('y2', l[j].y.toFixed(2));
                    ln.setAttribute('stroke', color);
                    ln.setAttribute('stroke-width', sw);
                    ln.setAttribute('stroke-opacity', '0.45');
                    morphLayer.appendChild(ln);
                    drawnLines++;
                }
                // Anchor visualization: per-pair colour (so you can see which
                // src-anchor matches which dst-anchor) + a label index next
                // to each anchor.
                if (anchors && anchors.src && anchors.dst) {
                    const M = Math.min(anchors.src.length, anchors.dst.length);
                    const anchorR = (7 / (getZ() || 1)).toFixed(2);
                    const anchorSW = String(3 / (getZ() || 1));
                    const ANCHOR_PALETTE = ['#FF1744','#F4C430','#42d4f4','#bfef45','#f032e6','#E040FB','#aaffc3','#9A6324'];
                    for (let m = 0; m < M; m++) {
                        const srcIdx = anchors.src[m];
                        const dstIdx = anchors.dst[(m + anchors.offset) % M];
                        const sp = p[srcIdx];
                        const lp = l[dstIdx];
                        if (!sp || !lp) continue;
                        const ac = ANCHOR_PALETTE[m % ANCHOR_PALETTE.length];
                        // Pair link line in pair colour
                        const ln = document.createElementNS(svgNS, 'line');
                        ln.setAttribute('x1', sp.x.toFixed(2));
                        ln.setAttribute('y1', sp.y.toFixed(2));
                        ln.setAttribute('x2', lp.x.toFixed(2));
                        ln.setAttribute('y2', lp.y.toFixed(2));
                        ln.setAttribute('stroke', ac);
                        ln.setAttribute('stroke-width', anchorSW);
                        ln.setAttribute('stroke-opacity', '0.95');
                        morphLayer.appendChild(ln);
                        // Source anchor dot + index label
                        const sc = document.createElementNS(svgNS, 'circle');
                        sc.setAttribute('cx', sp.x.toFixed(2));
                        sc.setAttribute('cy', sp.y.toFixed(2));
                        sc.setAttribute('r', anchorR);
                        sc.setAttribute('fill', ac);
                        sc.setAttribute('stroke', '#08142A');
                        sc.setAttribute('stroke-width', '1.5');
                        morphLayer.appendChild(sc);
                        const sl = document.createElementNS(svgNS, 'text');
                        sl.setAttribute('x', (sp.x + 10 / (getZ() || 1)).toFixed(2));
                        sl.setAttribute('y', (sp.y - 6 / (getZ() || 1)).toFixed(2));
                        sl.setAttribute('fill', ac);
                        sl.setAttribute('font-size', String(14 / (getZ() || 1)));
                        sl.setAttribute('font-weight', 'bold');
                        sl.textContent = String(m);
                        morphLayer.appendChild(sl);
                        // Dst anchor dot + index label
                        const dc = document.createElementNS(svgNS, 'circle');
                        dc.setAttribute('cx', lp.x.toFixed(2));
                        dc.setAttribute('cy', lp.y.toFixed(2));
                        dc.setAttribute('r', anchorR);
                        dc.setAttribute('fill', ac);
                        dc.setAttribute('stroke', '#08142A');
                        dc.setAttribute('stroke-width', '1.5');
                        morphLayer.appendChild(dc);
                        const dl = document.createElementNS(svgNS, 'text');
                        dl.setAttribute('x', (lp.x + 10 / (getZ() || 1)).toFixed(2));
                        dl.setAttribute('y', (lp.y - 6 / (getZ() || 1)).toFixed(2));
                        dl.setAttribute('fill', ac);
                        dl.setAttribute('font-size', String(14 / (getZ() || 1)));
                        dl.setAttribute('font-weight', 'bold');
                        dl.textContent = String(m);
                        morphLayer.appendChild(dl);
                    }
                }
            }
            return;
        }
        const svgNS = 'http://www.w3.org/2000/svg';
        const z = getZ() || 1;
        const pr = (2 / z).toFixed(2);
        const fillToggle = document.getElementById('fill-toggle');
        const fillOn = fillToggle ? fillToggle.checked : false;
        // Respect PUNKTE toggle for the morph dots — when off, don't even
        // add them (newly-created elements default to visible, so without
        // this they'd appear even with the toggle off).
        const pointsToggle = document.getElementById('points-toggle');
        const pointsOn = pointsToggle ? pointsToggle.checked : true;
        let drawn = 0;
        // Morph each pair as ONE <path> with M-L-Z subpaths for outer
        // + every paired hole; fill-rule=evenodd cuts the holes out.
        // Each ring is morphed independently (alignTargetTo per ring).
        for (const pair of pairs) {
            const srcOuter = pair[srcKey];
            const dstOuter = pair[dstKey];
            const srcHolesArr = pair[useStift ? 'srcHoles' : 'pngHoles'] || [];
            const dstHolesArr = pair[useStift ? 'dstHoles' : 'latHoles'] || [];
            const srcRings = [srcOuter, ...srcHolesArr];
            const dstRings = [dstOuter, ...dstHolesArr];
            const numRings = Math.max(srcRings.length, dstRings.length);
            // Shift the morph end-position so it lands `40 px` LEFT of the
            // LaTeX bbox instead of on top of it. Computed once per pair
            // from the outer's bbox (holes live inside, so outer is enough).
            let shiftX = 0;
            if (dstOuter && dstOuter.length >= 3) {
                const bb = bboxOfPts(dstOuter);
                shiftX = -((bb.maxX - bb.minX) + 40);
            }
            let pathD = '';        // matched rings → main green path
            let ghostPathD = '';   // ghost (unpaired) rings → BLACK from start
            const allPts = [];
            for (let r = 0; r < numRings; r++) {
                let sr = srcRings[r], dr = dstRings[r];
                const srOk = sr && sr.length >= 3;
                const drOk = dr && dr.length >= 3;
                const isGhost = (!srOk && drOk) || (!drOk && srOk);
                const GHOST_SCALE = 0.05;
                if (!srOk && drOk) {
                    let cx = 0, cy = 0;
                    for (const q of dr) { cx += q.x; cy += q.y; }
                    cx /= dr.length; cy /= dr.length;
                    sr = dr.map(q => ({
                        x: (cx + shiftX) + (q.x - cx) * GHOST_SCALE,
                        y: cy + (q.y - cy) * GHOST_SCALE,
                    }));
                } else if (!drOk && srOk) {
                    let cx = 0, cy = 0;
                    for (const q of sr) { cx += q.x; cy += q.y; }
                    cx /= sr.length; cy /= sr.length;
                    dr = sr.map(q => ({
                        x: cx + (q.x - cx) * GHOST_SCALE,
                        y: cy + (q.y - cy) * GHOST_SCALE,
                    }));
                } else if (!srOk && !drOk) {
                    continue;
                }
                const N = Math.max(sr.length, dr.length);
                const p = resampleClosed(sr, N);
                const l = resampleClosed(dr, N);
                if (p.length < 3 || l.length < 3) continue;
                // Corner-anchored matching for vertex correspondence
                // (fallback to engine if corner-match unavailable / degenerate).
                const lInPlace = alignDstToSrcBBox(p, l);
                let idxMap = null;
                if (typeof draw20CornerMatch === 'function') {
                    const cm = draw20CornerMatch(p, lInPlace);
                    if (cm && cm.idxMap) {
                        idxMap = cm.idxMap;
                        if (r === 0) {
                            const a = cm.anchors;
                            log(`🔶 MORPH pair#${pair.mid}/ring0: N=${N} corners=${a ? a.src.length : 0}`
                                + ` offset=${a ? a.offset : '-'} reversed=${a ? a.reversed : '-'}`);
                            if (a) {
                                log(`    srcA=[${a.src.join(',')}]`);
                                log(`    dstA=[${a.dst.join(',')}]`);
                            }
                        }
                    }
                }
                if (!idxMap) {
                    const eng = alignTargetWithEngine(p, lInPlace);
                    if (!eng) continue;
                    idxMap = eng.idxMap;
                    if (r === 0) log(`🔶 MORPH pair#${pair.mid}/ring0: FALLBACK engine`);
                }
                const pts = p.map((pp, i) => {
                    const j = idxMap[i];
                    return {
                        x: (1 - t) * pp.x + t * (l[j].x + shiftX),
                        y: (1 - t) * pp.y + t * l[j].y,
                    };
                });
                let s = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
                for (let i = 1; i < pts.length; i++) {
                    s += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
                }
                s += ' Z';
                if (isGhost) {
                    ghostPathD += (ghostPathD ? ' ' : '') + s;
                } else {
                    pathD += (pathD ? ' ' : '') + s;
                }
                for (const pp of pts) allPts.push(pp);
            }
            // Main green path FIRST, then BLACK ghost path on top — at t=1
            // the ghost covers the green at the hole-position so the morph
            // looks like the LaTeX with real holes. At t=0 the ghost is
            // tiny at the morph-final position; barely visible on black bg.
            if (pathD) {
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', pathD);
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('fill', fillOn ? '#adff2f' : 'none');
                path.setAttribute('stroke', '#ffffff');
                path.setAttribute('stroke-width', String(1.5 / z));
                path.setAttribute('stroke-opacity', '0.6');
                path.dataset.source = 'morph';
                morphLayer.appendChild(path);
            }
            if (ghostPathD) {
                const gpath = document.createElementNS(svgNS, 'path');
                gpath.setAttribute('d', ghostPathD);
                gpath.setAttribute('fill-rule', 'evenodd');
                gpath.setAttribute('fill', '#000');
                gpath.setAttribute('stroke', 'none');
                gpath.dataset.source = 'morph';
                gpath.dataset.kind = 'ghost';
                morphLayer.appendChild(gpath);
            }
            if (!pathD && !ghostPathD) continue;
            log(`🟢 MORPH pair#${pair.mid}: drawing ${allPts.length} morph dots`);
            // Vertex dots across all rings — blue, controlled by PUNKTE.
            // Always create them but set display:none upfront if PUNKTE is
            // off, so a later toggle-on can reveal them via the standard
            // applyPointsToggle path.
            for (const pp of allPts) {
                const dot = document.createElementNS(svgNS, 'circle');
                dot.setAttribute('cx', pp.x.toFixed(2));
                dot.setAttribute('cy', pp.y.toFixed(2));
                dot.setAttribute('r', pr);
                dot.setAttribute('fill', '#4363d8');
                dot.dataset.kind = 'point';
                dot.dataset.source = 'morph';
                if (!pointsOn) dot.style.display = 'none';
                morphLayer.appendChild(dot);
            }
            drawn++;
        }
    }

    // ── buildStiftMorphPairs: stift→LaTeX matching pipeline ─────────────────
    // Same match pipeline as PNG↔LaTeX (computeMatchIds → Hungarian etc.),
    // but the source is stiftContours instead of PNG. Points land in
    // wrap-pre-transform CSS so renderMorph can interpolate directly without
    // remapping.
    function buildStiftMorphPairs(latexContoursList) {
        stiftMorphPairs.length = 0;
        const stiftContours = getSC();
        // log(`🔧 buildStiftMorphPairs: stift=${stiftContours ? stiftContours.length : 'null'} latArg=${latexContoursList ? latexContoursList.length : 'null'}`);
        if (!stiftContours || !stiftContours.length) return;
        // If the caller didn't pass LaTeX contours, fetch them now.
        let lat = latexContoursList;
        if (!lat) {
            const res = (typeof extractLatexContours === 'function') ? extractLatexContours() : null;
            lat = res ? res.contours : null;
        }
        if (!lat || !lat.length) return;
        const latexCanvas = getLC();
        if (!tex.complete || !tex.naturalWidth || !latexCanvas) return;
        if (typeof computeMatchIds !== 'function' || typeof classifyContours !== 'function') return;

        const m = computeMatchIds(stiftContours, lat);
        const stiftId = m.pngId, latId = m.latId;
        // log(`🔧 match: stiftIds=[${stiftId.join(',')}] latIds=[${latId.join(',')}]`);
        if (m.idToPair) {
            const pairsList = [];
            for (const [id, p] of m.idToPair) pairsList.push(`${id}:png=${p.png}/lat=${p.lat}`);
            // log(`🔧 idToPair: ${pairsList.join(' | ')}`);
        }
        if (m.plausibility && m.plausibility.matches) {
            const ms = m.plausibility.matches.map(mm => `pIdx=${mm.pngIdx}→lIdx=${mm.latIdx} score=${mm.score?.toFixed(2)} verdict=${mm.verdict}`);
            // log(`🔧 plausibility: ${ms.join(' | ')}`);
        }

        // stift natural → wrap pre-transform CSS
        const ssx = wrap.offsetWidth / Math.max(1, stiftCanvas.width);
        const ssy = wrap.offsetHeight / Math.max(1, stiftCanvas.height);
        const stiftMap = (x, y) => ({ x: x * ssx, y: y * ssy });

        // latex natural → wrap pre-transform CSS (mirrors the renderBBoxes mapFn)
        const r = tex.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const scale = Math.min(r.width / tex.naturalWidth, r.height / tex.naturalHeight);
        const renderW = tex.naturalWidth * scale;
        const renderH = tex.naturalHeight * scale;
        const offX = r.left + (r.width - renderW) / 2;
        const offY = r.top + (r.height - renderH) / 2;
        const z = getZ() || 1;
        const latMap = (x, y) => ({
            x: (offX + x * scale - wrapRect.left) / z,
            y: (offY + y * scale - wrapRect.top) / z,
        });

        const sCls = classifyContours(stiftContours);
        const lCls = classifyContours(lat);
        const srcPts = new Map();
        const srcHoles = new Map();
        for (const o of sCls.outers) {
            const mid = stiftId[o.idx];
            if (mid < 0) continue;
            srcPts.set(mid, stiftContours[o.idx].map(p => stiftMap(p[0], p[1])));
            srcHoles.set(mid, o.holes.map(hi => stiftContours[hi].map(p => stiftMap(p[0], p[1]))));
        }
        const dstPts = new Map();
        const dstHoles = new Map();
        for (const o of lCls.outers) {
            const mid = latId[o.idx];
            if (mid < 0) continue;
            dstPts.set(mid, lat[o.idx].map(p => latMap(p[0], p[1])));
            dstHoles.set(mid, o.holes.map(hi => lat[hi].map(p => latMap(p[0], p[1]))));
        }
        for (const [mid, sp] of srcPts) {
            const lp = dstPts.get(mid);
            if (!lp) continue;
            stiftMorphPairs.push({
                mid,
                srcPts: sp, dstPts: lp,
                srcHoles: srcHoles.get(mid) || [],
                dstHoles: dstHoles.get(mid) || [],
            });
        }
        // Fallback: Hungarian/Plausibility refused all matches (free-hand
        // stift vs polished LaTeX often falls below the suspect threshold).
        // Pair them 1:1 by canonical outer order so the user still gets a
        // morph. Holes are paired by index within each outer pair.
        if (stiftMorphPairs.length === 0 && sCls.outers.length && lCls.outers.length) {
            // log('🔧 fallback: forcing 1:1 outer pairing (matching rejected all)');
            const nP = Math.min(sCls.outers.length, lCls.outers.length);
            for (let k = 0; k < nP; k++) {
                const so = sCls.outers[k];
                const lo = lCls.outers[k];
                const sp = stiftContours[so.idx].map(p => stiftMap(p[0], p[1]));
                const lp = lat[lo.idx].map(p => latMap(p[0], p[1]));
                const sh = so.holes.map(hi => stiftContours[hi].map(p => stiftMap(p[0], p[1])));
                const lh = lo.holes.map(hi => lat[hi].map(p => latMap(p[0], p[1])));
                stiftMorphPairs.push({ mid: k, srcPts: sp, dstPts: lp, srcHoles: sh, dstHoles: lh });
            }
        }
        // log(`🔧 stiftMorphPairs built: ${stiftMorphPairs.length} pair(s)`);
    }

    // ── ► MORPH animation loop ──────────────────────────────────────────────
    // Drives the slider 0→100 over MORPH_DURATION ms, then stops. Cancels
    // any in-flight animation first.
    const STIFT_MORPH_DURATION = 2500;
    let morphAnimRaf = null;
    let morphAnimStart = 0;
    function startMorphAnim() {
        cancelAnimationFrame(morphAnimRaf);
        const sl = document.getElementById('morph-slider');
        const span = document.getElementById('morph-val');
        if (!sl) return;
        morphAnimStart = performance.now();
        function tick() {
            const elapsed = performance.now() - morphAnimStart;
            const t = Math.min(1, elapsed / STIFT_MORPH_DURATION);
            const pct = Math.round(t * 100);
            sl.value = String(pct);
            if (span) span.textContent = String(pct);
            renderMorph(t);
            if (t < 1) {
                morphAnimRaf = requestAnimationFrame(tick);
            } else {
                morphAnimRaf = null;
                // Log point count of the finished morph polygon — once,
                // only at end-of-animation (not during each frame).
                const morphPts = morphLayer.querySelectorAll('circle[data-source="morph"]').length;
                // log(`🎯 morph done: ${morphPts} pts`);
            }
        }
        tick();
    }
    function stopMorphAnim() {
        if (morphAnimRaf !== null) {
            cancelAnimationFrame(morphAnimRaf);
            morphAnimRaf = null;
        }
    }

    // Space-key toggle for the anim (mirrors legacy behaviour).
    document.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.code !== 'Space') return;
        if (morphAnimRaf !== null) { e.preventDefault(); stopMorphAnim(); }
        else { e.preventDefault(); startMorphAnim(); }
    });

    // Slider hookup. OVERRIDES the legacy global onMorphSlider — its body
    // uses the hidden legacy canvases (digit-canvas / morph-canvas) and
    // wouldn't drive our overlay morph. Replacing on `window` redirects the
    // HTML inline `oninput="onMorphSlider(this.value)"` attribute to ours.
    function attachMorphSlider() {
        const sl = document.getElementById('morph-slider');
        if (!sl) { setTimeout(attachMorphSlider, 100); return; }
        sl.min = '0';
        if (sl.value === '1') sl.value = '0';
        window.onMorphSlider = function (val) {
            stopMorphAnim();
            const span = document.getElementById('morph-val');
            if (span) span.textContent = val;
            renderMorph(+val / 100);
        };
        // Belt-and-braces: also addEventListener.
        sl.addEventListener('input', () => {
            stopMorphAnim();
            renderMorph(+sl.value / 100);
        });
        renderMorph(+sl.value / 100);
    }

    return {
        renderMorph,
        buildStiftMorphPairs,
        startMorphAnim,
        stopMorphAnim,
        attachMorphSlider,
        getStiftMorphPairs: () => stiftMorphPairs,
        MORPH_EPS,
        // Expose the rotation/alignment helpers so the 3D view can compute
        // the SAME vertex correspondence the 2D morph uses.
        morphHelpers: {
            resampleClosed,
            alignDstToSrcBBox,
            alignTargetWithEngine,
        },
    };
}
