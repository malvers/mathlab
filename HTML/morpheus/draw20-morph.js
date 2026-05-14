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
        const pW = Math.max(1e-6, pBB.maxX - pBB.minX);
        const pH = Math.max(1e-6, pBB.maxY - pBB.minY);
        const lW = Math.max(1e-6, lBB.maxX - lBB.minX);
        const lH = Math.max(1e-6, lBB.maxY - lBB.minY);
        const sx = pW / lW, sy = pH / lH;
        return l.map(q => ({
            x: (q.x - lCx) * sx + pCx,
            y: (q.y - lCy) * sy + pCy,
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
        // Source pane: hidden only during the morph (t ≥ eps); in pre-morph
        // (correspondence lines) it stays visible so the lines anchor on
        // something recognisable. Tex pane always visible as reference.
        const srcEl = useStift ? stiftCanvas : pix;
        tex.style.opacity = '';
        if (!pairs.length) {
            srcEl.style.opacity = '';
            // Pre-morph not active: show all outlines/points again.
            overlay.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
            stiftOutlineSvg.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
            stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
            return;
        }
        srcEl.style.opacity = (t < MORPH_EPS) ? '' : '0';
        // Interpolate the displayed similarity from baseSimilarity → 100%.
        const morphedSim = Math.round(getBS() + (100 - getBS()) * t);
        const simVal = document.getElementById('sim-value');
        if (simVal) simVal.textContent = morphedSim + '%';
        // During morph (t ≥ eps): hide ONLY source-side outlines/points;
        // target outlines (LaTeX) stay visible.
        if (t >= MORPH_EPS) {
            const srcLabel = useStift ? 'stift' : 'png';
            overlay.querySelectorAll(`polygon[data-source="${srcLabel}"]`).forEach(p => { p.style.display = 'none'; });
            overlay.querySelectorAll(`circle[data-kind="point"][data-source="${srcLabel}"]`).forEach(c => { c.style.display = 'none'; });
            if (useStift) {
                stiftOutlineSvg.querySelectorAll('polygon').forEach(p => { p.style.display = 'none'; });
                stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = 'none'; });
            }
        } else {
            // Pre-morph: show all outlines/points.
            overlay.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
            stiftOutlineSvg.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
            stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
        }
        if (t < MORPH_EPS) {
            // KORRESPONDENZ toggle gates the per-vertex source→target lines.
            // When off, pre-morph stays empty (source pane still visible as
            // reference, no correspondence overlay).
            const corrToggle = document.getElementById('correspondence-toggle');
            const showCorr = corrToggle ? corrToggle.checked : true;
            if (!showCorr) return;
            // Pre-morph preview: same correspondence the morph uses.
            // alignTargetTo (engine) finds the rotation+reverse; the line
            // shows source → ACTUAL target (not BB-aligned).
            const svgNS = 'http://www.w3.org/2000/svg';
            const N = 60;
            const z = getZ() || 1;
            const sw = String(0.8 / z);
            for (const pair of pairs) {
                const p = resampleClosed(pair[srcKey], N);
                const l = resampleClosed(pair[dstKey], N);
                if (p.length < 3 || l.length < 3) continue;
                // BB-align l to src BEFORE alignTargetTo — otherwise the
                // centroid offset dominates and the rotation is arbitrary.
                const lInPlace = alignDstToSrcBBox(p, l);
                const eng = alignTargetWithEngine(p, lInPlace);
                if (!eng) continue;
                // idxMap points to BB-aligned indices — same indices apply
                // 1:1 to the original `l` (alignTargetTo only permutes,
                // doesn't change the count).
                const color = draw20PaletteColor(pair.mid);
                for (let i = 0; i < N; i++) {
                    const j = eng.idxMap[i];
                    const ln = document.createElementNS(svgNS, 'line');
                    ln.setAttribute('x1', p[i].x.toFixed(2));
                    ln.setAttribute('y1', p[i].y.toFixed(2));
                    ln.setAttribute('x2', l[j].x.toFixed(2));
                    ln.setAttribute('y2', l[j].y.toFixed(2));
                    ln.setAttribute('stroke', color);
                    ln.setAttribute('stroke-width', sw);
                    ln.setAttribute('stroke-opacity', '0.45');
                    morphLayer.appendChild(ln);
                }
            }
            return;
        }
        const svgNS = 'http://www.w3.org/2000/svg';
        const N = 60;
        const z = getZ() || 1;
        let drawn = 0;
        for (const pair of pairs) {
            const p = resampleClosed(pair[srcKey], N);
            const l = resampleClosed(pair[dstKey], N);
            if (p.length < 3 || l.length < 3) continue;
            // In-place: dst polygon BB-aligned onto src. Then alignTargetTo
            // (engine) chooses the rotation+reverse. Together: low-cross
            // correspondence + in-place morph.
            const lInPlace = alignDstToSrcBBox(p, l);
            const eng = alignTargetWithEngine(p, lInPlace);
            if (!eng) continue;
            const pts = p.map((pp, i) => ({
                x: (1 - t) * pp.x + t * eng.alignedXY[i].x,
                y: (1 - t) * pp.y + t * eng.alignedXY[i].y,
            }));
            const polyStr = pts.map(pp => `${pp.x},${pp.y}`).join(' ');
            const poly = document.createElementNS(svgNS, 'polygon');
            poly.setAttribute('points', polyStr);
            poly.setAttribute('fill', draw20PaletteColor(pair.mid));
            poly.setAttribute('fill-opacity', '0.85');
            poly.setAttribute('stroke', '#ffffff');
            poly.setAttribute('stroke-width', String(1.5 / z));
            poly.setAttribute('stroke-opacity', '0.6');
            morphLayer.appendChild(poly);
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
        for (const o of sCls.outers) {
            const mid = stiftId[o.idx];
            if (mid < 0) continue;
            srcPts.set(mid, stiftContours[o.idx].map(p => stiftMap(p[0], p[1])));
        }
        const dstPts = new Map();
        for (const o of lCls.outers) {
            const mid = latId[o.idx];
            if (mid < 0) continue;
            dstPts.set(mid, lat[o.idx].map(p => latMap(p[0], p[1])));
        }
        for (const [mid, sp] of srcPts) {
            const lp = dstPts.get(mid);
            if (!lp) continue;
            stiftMorphPairs.push({ mid, srcPts: sp, dstPts: lp });
        }
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
            if (t < 1) morphAnimRaf = requestAnimationFrame(tick);
            else morphAnimRaf = null;
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
    };
}
