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
    // ── Morph render helpers (Phase B extraction) ───────────────────────────
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Drop every morph-src-* class + restore element display. Called when
    // there are no pairs (pre-morph idle state) so the stiftCanvas is
    // interactive again and any source outlines hidden by a previous morph
    // come back. Idempotent.
    function clearMorphSourceVisibility() {
        pix.classList.remove('morph-src-pixel-hidden');
        stiftCanvas.classList.remove('morph-src-pixel-hidden');
        overlay.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
        stiftOutlineSvg.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
        overlay.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
        overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
        stiftOutlineSvg.querySelectorAll('polygon').forEach(p => { p.style.display = ''; });
        stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(c => { c.style.display = ''; });
    }

    // Manage which source-pane elements are visible based on the morph t.
    // At t === 0 the source (PNG / stift) is fully visible. As soon as
    // t > 0 the source pixels, outlines, points, fills get hidden via the
    // `.morph-src-*` CSS classes (which use !important to survive toggles).
    function manageSourceVisibility(t, useStift, srcEl) {
        if (t > 0) {
            srcEl.classList.add('morph-src-pixel-hidden');
        } else {
            pix.classList.remove('morph-src-pixel-hidden');
            stiftCanvas.classList.remove('morph-src-pixel-hidden');
        }
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
            overlay.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
            stiftOutlineSvg.querySelectorAll('.morph-src-hidden').forEach(el => el.classList.remove('morph-src-hidden'));
        }
    }

    // Compute vertex correspondence between two equal-length closed polygons.
    // Prefers the corner-match module (scale + cyclic offset → monotonic
    // idxMap); falls back to the legacy alignTargetTo engine if corner-match
    // is unavailable or returns null. Returns idxMap[] or null on failure.
    function resolveCorrespondence(p, lInPlace) {
        if (typeof draw20CornerMatch === 'function') {
            const cm = draw20CornerMatch(p, lInPlace);
            if (cm && cm.idxMap) return cm.idxMap;
        }
        const eng = alignTargetWithEngine(p, lInPlace);
        return eng ? eng.idxMap : null;
    }

    // Pre-morph correspondence lines at t === 0. In formula mode only shows
    // the hovered match (gated by overlay.dataset.activeMatchId); in stift
    // mode shows all pairs simultaneously. Skipped when MORPH-LINIEN toggle
    // is off.
    function renderCorrespondenceLines(pairs, srcKey, dstKey, useStift) {
        const corrToggle = document.getElementById('correspondence-toggle');
        const showCorr = corrToggle ? corrToggle.checked : true;
        if (!showCorr) return;
        const activeId = (overlay.dataset && overlay.dataset.activeMatchId) || '';
        if (!useStift && !activeId) return;
        const z = getZ() || 1;
        const sw = String(0.8 / z);
        for (const pair of pairs) {
            if (!useStift && String(pair.mid) !== activeId) continue;
            const srcLen = pair[srcKey] ? pair[srcKey].length : 0;
            const dstLen = pair[dstKey] ? pair[dstKey].length : 0;
            const N = Math.max(srcLen, dstLen);
            const p = resampleClosed(pair[srcKey], N);
            const l = resampleClosed(pair[dstKey], N);
            if (p.length < 3 || l.length < 3) continue;
            const lInPlace = alignDstToSrcBBox(p, l);
            const idxMap = resolveCorrespondence(p, lInPlace);
            if (!idxMap) continue;
            const color = draw20PaletteColor(pair.mid);
            for (let i = 0; i < N; i++) {
                const j = idxMap[i];
                const ln = document.createElementNS(SVG_NS, 'line');
                ln.setAttribute('x1', p[i].x.toFixed(2));
                ln.setAttribute('y1', p[i].y.toFixed(2));
                ln.setAttribute('x2', l[j].x.toFixed(2));
                ln.setAttribute('y2', l[j].y.toFixed(2));
                ln.setAttribute('stroke', color);
                ln.setAttribute('stroke-width', sw);
                ln.setAttribute('stroke-opacity', '0.45');
                ln.dataset.kind = 'corr-line';
                ln.dataset.source = 'morph';
                ln.dataset.matchId = String(pair.mid);
                morphLayer.appendChild(ln);
            }
        }
    }

    // Morph one ring pair (outer-outer, hole-hole). When one side is
    // missing, a tiny ghost ring is synthesised at the partner's centroid
    // (so the morph "spawns" a vanishing hole rather than jumping).
    //
    // Endpoint per vertex: raw l[j] + (shiftX, shiftY). The caller decides
    // what those shifts are:
    //   FORMEL/SYMBOL mode → shifts = -t * (latCentroid - pngCentroid),
    //                       i.e. dist/100 to the left per slider step.
    //                       At t=1 the whole morph sits on the source
    //                       formula's position (LaTeX shape, PNG location).
    //   STIFT mode        → shiftX = -((latBboxW) + 40), shiftY = 0.
    //                       Morph travels next to the LaTeX target pane.
    //
    // Returns { subpath, pts, isGhost } or null if both sides degenerate.
    const GHOST_SCALE = 0.05;
    function morphRingPair(sr, dr, t, shiftX, shiftY) {
        const srOk = sr && sr.length >= 3;
        const drOk = dr && dr.length >= 3;
        if (!srOk && !drOk) return null;
        const isGhost = (!srOk && drOk) || (!drOk && srOk);
        if (!srOk && drOk) {
            let cx = 0, cy = 0;
            for (const q of dr) { cx += q.x; cy += q.y; }
            cx /= dr.length; cy /= dr.length;
            sr = dr.map(q => ({
                x: (cx + (shiftX || 0)) + (q.x - cx) * GHOST_SCALE,
                y: (cy + (shiftY || 0)) + (q.y - cy) * GHOST_SCALE,
            }));
        } else if (!drOk && srOk) {
            let cx = 0, cy = 0;
            for (const q of sr) { cx += q.x; cy += q.y; }
            cx /= sr.length; cy /= sr.length;
            dr = sr.map(q => ({
                x: cx + (q.x - cx) * GHOST_SCALE,
                y: cy + (q.y - cy) * GHOST_SCALE,
            }));
        }
        const N = Math.max(sr.length, dr.length);
        const p = resampleClosed(sr, N);
        const l = resampleClosed(dr, N);
        if (p.length < 3 || l.length < 3) return null;
        // lInPlace only feeds the rotation/reverse search for idxMap —
        // the endpoint itself uses raw l + caller-supplied shifts.
        const lInPlace = alignDstToSrcBBox(p, l);
        const idxMap = resolveCorrespondence(p, lInPlace);
        if (!idxMap) return null;
        const sx = shiftX || 0;
        const sy = shiftY || 0;
        const pts = p.map((pp, i) => {
            const j = idxMap[i];
            return {
                x: (1 - t) * pp.x + t * (l[j].x + sx),
                y: (1 - t) * pp.y + t * (l[j].y + sy),
            };
        });
        let s = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
        for (let i = 1; i < pts.length; i++) {
            s += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
        }
        s += ' Z';
        return { subpath: s, pts, isGhost };
    }

    // Render the polygon-morph for every pair (t > 0). Each pair becomes
    // one main green <path> (outer + paired holes via evenodd) plus an
    // optional black "ghost" <path> covering unpaired holes. Vertex dots
    // are appended below.
    function renderMorphPolygons(pairs, t, useStift, srcKey, dstKey) {
        const z = getZ() || 1;
        const pr = (2 / z).toFixed(2);
        const fillOn = document.getElementById('fill-toggle')?.checked ?? false;
        const pointsOn = document.getElementById('points-toggle')?.checked ?? true;
        // Formula-level (global) shift: subtract the centroid distance
        // PNG → LaTeX so the entire LaTeX shape ends up at the PNG
        // formula's location. CONSTANT (not t-dependent) — interpolation
        // is linear between src and (l - dist), so the morph stays in
        // place instead of bowing right-then-left.
        // Stift mode bypasses this and keeps the legacy per-pair shift.
        let globalShiftX = 0;
        let globalShiftY = 0;
        if (!useStift) {
            let pCx = 0, pCy = 0, pCt = 0;
            let lCx = 0, lCy = 0, lCt = 0;
            for (const pair of pairs) {
                if (pair[srcKey]) for (const q of pair[srcKey]) { pCx += q.x; pCy += q.y; pCt++; }
                if (pair[dstKey]) for (const q of pair[dstKey]) { lCx += q.x; lCy += q.y; lCt++; }
            }
            if (pCt && lCt) {
                globalShiftX = -((lCx / lCt) - (pCx / pCt));
                globalShiftY = -((lCy / lCt) - (pCy / pCt));
            }
        }
        for (const pair of pairs) {
            const srcOuter = pair[srcKey];
            const dstOuter = pair[dstKey];
            const srcHolesArr = pair[useStift ? 'srcHoles' : 'pngHoles'] || [];
            const dstHolesArr = pair[useStift ? 'dstHoles' : 'latHoles'] || [];
            const srcRings = [srcOuter, ...srcHolesArr];
            const dstRings = [dstOuter, ...dstHolesArr];
            const numRings = Math.max(srcRings.length, dstRings.length);
            // Per-pair shift: stift mode pushes the morph 40px LEFT of the
            // LaTeX target pane. Formula mode uses the globalShift computed
            // above instead — applied uniformly to every pair.
            let shiftX = globalShiftX;
            let shiftY = globalShiftY;
            if (useStift && dstOuter && dstOuter.length >= 3) {
                const bb = bboxOfPts(dstOuter);
                shiftX = -((bb.maxX - bb.minX) + 40);
                shiftY = 0;
            }
            let pathD = '';
            let ghostPathD = '';
            const allPts = [];
            for (let r = 0; r < numRings; r++) {
                const result = morphRingPair(srcRings[r], dstRings[r], t, shiftX, shiftY);
                if (!result) continue;
                if (result.isGhost) {
                    ghostPathD += (ghostPathD ? ' ' : '') + result.subpath;
                } else {
                    pathD += (pathD ? ' ' : '') + result.subpath;
                }
                for (const pp of result.pts) allPts.push(pp);
            }
            // Main path first, ghost path on top (covers green at hole locations
            // when fully morphed at t=1 so the result looks like cut-out holes).
            if (pathD) {
                const pairColor = draw20PaletteColor(pair.mid);
                const path = document.createElementNS(SVG_NS, 'path');
                path.setAttribute('d', pathD);
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('fill', fillOn ? pairColor : 'none');
                path.setAttribute('stroke', pairColor);
                path.setAttribute('stroke-width', String(1.5 / z));
                path.setAttribute('stroke-opacity', '0.9');
                path.dataset.kind = 'stroke';
                path.dataset.source = 'morph';
                path.dataset.matchId = String(pair.mid);
                morphLayer.appendChild(path);
            }
            if (ghostPathD) {
                const gpath = document.createElementNS(SVG_NS, 'path');
                gpath.setAttribute('d', ghostPathD);
                gpath.setAttribute('fill-rule', 'evenodd');
                gpath.setAttribute('fill', '#000');
                gpath.setAttribute('stroke', 'none');
                gpath.dataset.kind = 'ghost';
                gpath.dataset.source = 'morph';
                gpath.dataset.matchId = String(pair.mid);
                morphLayer.appendChild(gpath);
            }
            if (!pathD && !ghostPathD) continue;
            for (const pp of allPts) {
                const dot = document.createElementNS(SVG_NS, 'circle');
                dot.setAttribute('cx', pp.x.toFixed(2));
                dot.setAttribute('cy', pp.y.toFixed(2));
                dot.setAttribute('r', pr);
                dot.setAttribute('fill', '#4363d8');
                dot.dataset.kind = 'point';
                dot.dataset.source = 'morph';
                dot.dataset.matchId = String(pair.mid);
                if (!pointsOn) dot.style.display = 'none';
                morphLayer.appendChild(dot);
            }
        }
    }

    // ── renderMorph: thin orchestrator ──────────────────────────────────────
    // Source = stift (when stiftMorphPairs is populated), else PNG preset.
    // Both panes stay visible as reference — the morph happens inside the
    // polygon overlay at source location/size (no travelling across panes).
    //   t === 0 → pre-morph: correspondence lines source → target.
    //   t > 0   → polygon overlay: shape interpolates src → dst.
    function renderMorph(t) {
        while (morphLayer.firstChild) morphLayer.removeChild(morphLayer.firstChild);
        t = Math.max(0, Math.min(1, t));
        const useStift = stiftMorphPairs.length > 0;
        const pairs = useStift ? stiftMorphPairs : morphPairs;
        const srcKey = useStift ? 'srcPts' : 'pngPts';
        const dstKey = useStift ? 'dstPts' : 'latPts';
        const srcEl = useStift ? stiftCanvas : pix;
        tex.style.opacity = '';
        if (!pairs.length) {
            srcEl.style.opacity = '';
            clearMorphSourceVisibility();
            return;
        }
        manageSourceVisibility(t, useStift, srcEl);
        // Display similarity 'morphedSim' interpolated from baseSim → 100%.
        const morphedSim = Math.round(getBS() + (100 - getBS()) * t);
        const simVal = document.getElementById('sim-value');
        if (simVal) simVal.textContent = morphedSim + '%';
        if (t === 0) {
            renderCorrespondenceLines(pairs, srcKey, dstKey, useStift);
            return;
        }
        renderMorphPolygons(pairs, t, useStift, srcKey, dstKey);
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
        if (m.idToPair) {
            const pairsList = [];
            for (const [id, p] of m.idToPair) pairsList.push(`${id}:png=${p.png}/lat=${p.lat}`);
        }
        if (m.plausibility && m.plausibility.matches) {
            const ms = m.plausibility.matches.map(mm => `pIdx=${mm.pngIdx}→lIdx=${mm.latIdx} score=${mm.score?.toFixed(2)} verdict=${mm.verdict}`);
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
