// Cross-pane rendering for the draw20 stack: BBox helpers, drawContours
// (PNG + LaTeX outlines + fills + dots), hover highlighting, similarity
// metric, info-boxes update, and the renderBBoxes orchestrator.
//
// Owns:
//   - pngVertCount, latVertCount (read by computeSimilarity, displayed by
//     updateInfoBoxes)
//   - lastRenderData (consumed by openPolygonRing)
//   - orphanMatchIds, activeMatchId, GLOW_FILTER (hover state)
//
// Wires `mouseover` / `mouseout` listeners on the overlay at construction
// time. Returns `renderBBoxes` + `openPolygonRing` for callers to bind into
// window globals or button hooks.
//
// Requires globals: classifyContours (count-objects.js), normalizeForMatching
// + centroid (matching.js), draw20PaletteColor (draw20-constants.js),
// draw20ComputeMatchIds (draw20-match.js), draw20OpenPolygonRing
// (draw20-ring.js).

function createDraw20Render({
    overlay, morphLayer, wrap,
    pix, tex,
    getZoom,
    getLatexCanvas,
    getThreshold,
    extractPNGContours, extractLatexContours,
    getStiftContours,
    buildStiftMorphPairs,
    renderMorph,
    morphPairs,
    getUI,
    matchingEnabled,
    setBaseSimilarity,
    rerenderStift,
    morphHelpers,
    dbg,
}) {
    const log = (typeof dbg === 'function') ? dbg : () => {};
    const getZ = (typeof getZoom === 'function') ? getZoom : () => 1;
    const getLC = (typeof getLatexCanvas === 'function') ? getLatexCanvas : () => null;
    const getThr = (typeof getThreshold === 'function') ? getThreshold : () => 20;
    const getU = (typeof getUI === 'function') ? getUI : () => null;
    const setBS = (typeof setBaseSimilarity === 'function') ? setBaseSimilarity : () => {};

    // ── private state ───────────────────────────────────────────────────────
    let pngVertCount = 0;
    let latVertCount = 0;
    let lastRenderData = null;
    let activeMatchId = null;
    let currentMode = 'empty'; // 'empty' | 'symbol' | 'formel' | 'stift'
    let inSymbolMode = false;  // derived: currentMode === 'symbol'
    const orphanMatchIds = new Set();
    // Single source of truth for "which render mode are we in?". The pure
    // helper lives in draw20-mode.js; this closure wires up the factory
    // dependencies. Called at the top of renderBBoxes.
    function detectRenderMode() {
        if (typeof draw20DetectRenderMode !== 'function') return 'empty';
        return draw20DetectRenderMode({
            pix, tex,
            getLatexCanvas: getLC,
            getStiftContours,
        });
    }
    const GLOW_FILTER = 'drop-shadow(0 0 6px #F4C430) drop-shadow(0 0 12px #F4C430)';
    // Side-colours used in symbol mode (matches the count-box labels).
    const SIDE_COLOR_PNG = '#adff2f';
    const SIDE_COLOR_LATEX = '#F4C430';

    // ── Point-count equalization ────────────────────────────────────────────
    // For each matched (PNG/stift)↔LaTeX outer pair (and their paired
    // holes), grow the shorter polygon to match the longer one by
    // inserting midpoints on the LONGEST edge — preserves original
    // vertices, adds new ones where it matters most (long straight
    // segments get refined, short curvy parts stay untouched).
    function growPoly(poly, target) {
        if (!poly || poly.length >= target) return poly;
        const p = poly.slice();
        while (p.length < target) {
            let maxLen = -1, maxIdx = 0;
            for (let i = 0; i < p.length; i++) {
                const a = p[i], b = p[(i + 1) % p.length];
                const dx = b[0] - a[0], dy = b[1] - a[1];
                const len = dx * dx + dy * dy;
                if (len > maxLen) { maxLen = len; maxIdx = i; }
            }
            const a = p[maxIdx], b = p[(maxIdx + 1) % p.length];
            const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            p.splice(maxIdx + 1, 0, mid);
        }
        return p;
    }
    // Grow both polygons to `max(a.length, b.length, MIN)`.
    // IDEMPOTENT: once both polygons reach the same length (and ≥ MIN),
    // further calls are no-ops. This is critical because equalize can
    // run multiple times (formula switch, window resize, stift stroke,
    // …). A multiplier would compound (300 → 600 → 1200 → ...).
    const DRAW20_MIN_POINTS = 300;
    function equalizePair(arrA, idxA, arrB, idxB) {
        const a = arrA[idxA], b = arrB[idxB];
        if (!a || !b) return;
        const target = Math.max(a.length, b.length, DRAW20_MIN_POINTS);
        if (a.length < target) arrA[idxA] = growPoly(a, target);
        if (b.length < target) arrB[idxB] = growPoly(b, target);
    }
    function equalizeMatchedContours(srcContours, dstContours, matchInfo) {
        if (!matchInfo || !matchInfo.idToPair || !matchInfo.pClass || !matchInfo.lClass) return;
        const { idToPair, pClass, lClass } = matchInfo;
        for (const [, pair] of idToPair) {
            if (pair.png < 0 || pair.lat < 0) continue; // orphans untouched
            const pOuter = pClass.outers[pair.png];
            const lOuter = lClass.outers[pair.lat];
            if (!pOuter || !lOuter) continue;
            equalizePair(srcContours, pOuter.idx, dstContours, lOuter.idx);
            const nH = Math.min(pOuter.holes.length, lOuter.holes.length);
            for (let h = 0; h < nH; h++) {
                equalizePair(srcContours, pOuter.holes[h], dstContours, lOuter.holes[h]);
            }
        }
        // Density floor for EVERY contour (matched or not, outer or hole)
        // — unmatched holes (e.g. when one side has fewer holes than the
        // other) would otherwise stay sparse and look chunky on render.
        ensureMinDensity(srcContours);
        ensureMinDensity(dstContours);
    }
    // Laplacian smoothing pass for closed polygons. Weighted: each vertex is
    // pulled toward the midpoint of its neighbours by `alpha`. Iterations
    // and alpha kept mild so corners are preserved but marching-squares
    // staircase noise gets averaged out.
    const SMOOTH_PASSES = 3;
    const SMOOTH_ALPHA = 0.5;
    function smoothPoly(poly) {
        if (!poly || poly.length < 4) return poly;
        let p = poly;
        for (let pass = 0; pass < SMOOTH_PASSES; pass++) {
            const n = p.length;
            const out = new Array(n);
            for (let i = 0; i < n; i++) {
                const a = p[(i - 1 + n) % n];
                const b = p[i];
                const c = p[(i + 1) % n];
                const mx = (a[0] + c[0]) / 2;
                const my = (a[1] + c[1]) / 2;
                out[i] = [
                    b[0] + SMOOTH_ALPHA * (mx - b[0]),
                    b[1] + SMOOTH_ALPHA * (my - b[1]),
                ];
            }
            p = out;
        }
        return p;
    }
    function smoothContours(contours) {
        if (!contours) return;
        for (let i = 0; i < contours.length; i++) {
            const c = contours[i];
            if (c && c.length >= 4) contours[i] = smoothPoly(c);
        }
    }
    function ensureMinDensity(contours) {
        if (!contours) return;
        for (let i = 0; i < contours.length; i++) {
            const c = contours[i];
            if (c && c.length >= 3 && c.length < DRAW20_MIN_POINTS) {
                contours[i] = growPoly(c, DRAW20_MIN_POINTS);
            }
        }
        smoothContours(contours);
    }

    // ── BBox helpers ────────────────────────────────────────────────────────
    // Threshold-driven: any pixel above the threshold counts as "ink".
    function computeContentBBox(source, channel) {
        let cw, ch, ctx;
        if (source instanceof HTMLCanvasElement) {
            cw = source.width; ch = source.height;
            ctx = source.getContext('2d');
        } else {
            cw = source.naturalWidth; ch = source.naturalHeight;
            if (!cw || !ch) return null;
            const c = document.createElement('canvas');
            c.width = cw; c.height = ch;
            ctx = c.getContext('2d');
            ctx.drawImage(source, 0, 0);
        }
        let data;
        try { data = ctx.getImageData(0, 0, cw, ch).data; }
        catch (e) { return null; }
        const off = channel === 'alpha' ? 3 : 0;
        const t = getThr();
        let minX = cw, minY = ch, maxX = -1, maxY = -1;
        for (let y = 0; y < ch; y++) {
            for (let x = 0; x < cw; x++) {
                const i = (y * cw + x) * 4;
                if (data[i + off] > t) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        if (maxX < 0) return null;
        return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, cw, ch };
    }
    // PNG path keeps the red-channel test.
    function computeImageBBox(img) { return computeContentBBox(img, 'red'); }

    function mapImageBBoxToViewport(img, bbox) {
        const r = img.getBoundingClientRect();
        const scale = Math.min(r.width / bbox.cw, r.height / bbox.ch);
        const renderW = bbox.cw * scale;
        const renderH = bbox.ch * scale;
        const offX = r.left + (r.width - renderW) / 2;
        const offY = r.top + (r.height - renderH) / 2;
        return {
            left: offX + bbox.x * scale,
            top: offY + bbox.y * scale,
            width: bbox.w * scale,
            height: bbox.h * scale,
        };
    }

    function drawBBox(rect, label) {
        // Input rect is viewport (post-transform) coords. The overlay SVG
        // lives inside `wrap`, which gets translate+scale applied — convert
        // to wrap's pre-transform local space by dividing by current zoom.
        const wrapRect = wrap.getBoundingClientRect();
        const z = getZ() || 1;
        const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('x', (rect.left - wrapRect.left) / z);
        r.setAttribute('y', (rect.top - wrapRect.top) / z);
        r.setAttribute('width', rect.width / z);
        r.setAttribute('height', rect.height / z);
        r.setAttribute('fill', 'none');
        r.setAttribute('stroke', '#888');
        r.setAttribute('stroke-width', String(1 / z));
        r.dataset.kind = 'bbox';
        r.dataset.source = label || '';
        overlay.appendChild(r);
    }

    // ── Render helpers (Phase B extraction) ─────────────────────────────────
    // Module-level constants shared by the three render sub-functions and
    // by the colour helper. (Were previously local to drawContours.)
    const INK = (typeof DRAW20_INK_COLOR !== 'undefined') ? DRAW20_INK_COLOR : '#F4C430';
    const ORPHAN = (typeof DRAW20_ORPHAN_COLOR !== 'undefined') ? DRAW20_ORPHAN_COLOR : '#FF1744';
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Single source of truth for "what colour does this element have?".
    //   matchId  : the canonical match id (< 0 = unmatched)
    //   kind     : 'fill' | 'stroke' | 'point'
    //   isOrphan : true if matchId is in orphanMatchIds
    //   sideColor: SIDE_COLOR_LATEX or SIDE_COLOR_PNG (precomputed for the label)
    //   pointColor: POINT_COLOR specific to PNG/Stift vs LaTeX
    function computeElementColor(matchId, kind, isOrphan, sideColor, pointColor) {
        if (matchId < 0) return INK;
        if (kind === 'point') return isOrphan ? ORPHAN : pointColor;
        if (inSymbolMode) return sideColor;
        return isOrphan ? ORPHAN : draw20PaletteColor(matchId);
    }

    // Build "M..L..Z M..L..Z" subpath string for one outer + its holes.
    // The evenodd fill-rule turns hole subpaths into cutouts at render time.
    function buildFillPathData(outer, mappedAll) {
        const oc = mappedAll[outer.idx];
        if (!oc) return null;
        const rings = [oc, ...outer.holes.map(hi => mappedAll[hi]).filter(Boolean)];
        return rings.map(pts => {
            let s = `M ${pts[0].x} ${pts[0].y}`;
            for (let k = 1; k < pts.length; k++) s += ` L ${pts[k].x} ${pts[k].y}`;
            return s + ' Z';
        }).join(' ');
    }

    // Render one <path> per outer (with holes as evenodd subpaths). Populates
    // centroidsOut/pointsOut/holesOut for downstream cross-pane consumers.
    function renderFill(label, classified, mappedAll, matchId, isOrphanMid, sideColor, centroidsOut, pointsOut, holesOut) {
        for (let oi = 0; oi < classified.outers.length; oi++) {
            const outer = classified.outers[oi];
            const oc = mappedAll[outer.idx];
            if (!oc) continue;
            const d = buildFillPathData(outer, mappedAll);
            if (!d) continue;
            const mid = matchId[outer.idx];
            const orphan = isOrphanMid(mid);
            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('d', d);
            path.setAttribute('fill-rule', 'evenodd');
            path.setAttribute('fill', computeElementColor(mid, 'fill', orphan, sideColor, null));
            path.setAttribute('stroke', 'none');
            path.dataset.kind = 'fill';
            path.dataset.source = label;
            path.dataset.matchId = String(mid);
            overlay.appendChild(path);

            if (centroidsOut) {
                let sx = 0, sy = 0;
                for (const m of oc) { sx += m.x; sy += m.y; }
                centroidsOut.set(mid, [sx / oc.length, sy / oc.length]);
            }
            if (pointsOut) pointsOut.set(mid, oc);
            if (holesOut) holesOut.set(mid, outer.holes.map(hi => mappedAll[hi]).filter(Boolean));
        }
    }

    // Render one <polygon> per contour (palette-coloured stroke, no fill).
    function renderStroke(label, contours, mappedAll, matchId, isOrphanMid, sideColor, sw) {
        for (let i = 0; i < contours.length; i++) {
            const mapped = mappedAll[i];
            if (!mapped) continue;
            const mid = matchId[i];
            const orphan = isOrphanMid(mid);
            const poly = document.createElementNS(SVG_NS, 'polygon');
            poly.setAttribute('points', mapped.map(m => `${m.x},${m.y}`).join(' '));
            poly.setAttribute('fill', 'none');
            poly.setAttribute('stroke', computeElementColor(mid, 'stroke', orphan, sideColor, null));
            poly.setAttribute('stroke-width', sw);
            poly.setAttribute('stroke-linejoin', 'round');
            poly.dataset.kind = 'stroke';
            poly.dataset.source = label;
            poly.dataset.matchId = String(mid);
            poly.style.pointerEvents = 'all';
            overlay.appendChild(poly);
        }
    }

    // Render vertex dots for every contour. Returns the total vertex count
    // (used by similarity/info-box computations).
    function renderPoints(label, contours, mappedAll, matchId, isOrphanMid, pointColor, pr) {
        let totalVerts = 0;
        for (let i = 0; i < contours.length; i++) {
            const mapped = mappedAll[i];
            if (!mapped) continue;
            const mid = matchId[i];
            const orphan = isOrphanMid(mid);
            const fill = computeElementColor(mid, 'point', orphan, null, pointColor);
            for (const m of mapped) {
                const dot = document.createElementNS(SVG_NS, 'circle');
                dot.setAttribute('cx', m.x);
                dot.setAttribute('cy', m.y);
                dot.setAttribute('r', pr);
                dot.setAttribute('fill', fill);
                dot.dataset.kind = 'point';
                dot.dataset.source = label;
                dot.dataset.matchId = String(mid);
                overlay.appendChild(dot);
                totalVerts++;
            }
        }
        return totalVerts;
    }

    // ── drawContours ────────────────────────────────────────────────────────
    // Thin orchestrator: classify → build matchId map → renderFill → renderStroke
    // → renderPoints → apply visibility toggles. Delegated heavy lifting to the
    // four helpers above.
    //
    // `label` ('png'|'latex'|'stift') tags every element via data-source.
    // `matchIdByContour` (optional) overrides the default "outer position" id
    //   mapping with the Hungarian/Greedy assignment from computeMatchIds.
    // `centroidsOut` / `pointsOut` / `holesOut` (optional Maps) capture
    //   per-matchId data for downstream cross-pane consumers (match lines,
    //   morph interpolation).
    function drawContours(contours, mapFn, label, matchIdByContour, centroidsOut, pointsOut, holesOut) {
        if (!contours || contours.length === 0) return 0;
        const z = getZ() || 1;
        const sw = String(1 / z);
        const pr = 2 / z;

        const mappedAll = contours.map(c =>
            (c && c.length >= 2) ? c.map(p => mapFn(p[0], p[1])) : null
        );

        const classified = (typeof classifyContours === 'function')
            ? classifyContours(contours)
            : { outers: contours.map((_, i) => ({ idx: i, holes: [] })), holes: [] };

        // matchId per contour: from caller (Hungarian/Greedy override),
        // else legacy "outer position" numbering. Holes inherit their parent's id.
        let matchId;
        if (matchIdByContour && matchIdByContour.length === contours.length) {
            matchId = matchIdByContour;
        } else {
            matchId = new Array(contours.length).fill(-1);
            for (let oi = 0; oi < classified.outers.length; oi++) {
                const outer = classified.outers[oi];
                matchId[outer.idx] = oi;
                for (const hi of outer.holes) matchId[hi] = oi;
            }
        }
        const isOrphanMid = (mid) => mid >= 0 && orphanMatchIds.has(String(mid));
        const sideColor = (label === 'latex') ? SIDE_COLOR_LATEX : SIDE_COLOR_PNG;
        const pointColor = (label === 'latex') ? '#8B0000' : '#4363d8';

        renderFill(label, classified, mappedAll, matchId, isOrphanMid, sideColor, centroidsOut, pointsOut, holesOut);
        renderStroke(label, contours, mappedAll, matchId, isOrphanMid, sideColor, sw);
        const totalVerts = renderPoints(label, contours, mappedAll, matchId, isOrphanMid, pointColor, pr);

        const u = getU();
        if (u) {
            u.applyAllToggles ? u.applyAllToggles() : (u.applyLinesToggle(), u.applyPointsToggle(), u.applyFillToggle());
        }
        return totalVerts;
    }

    // ── Cross-pane hover highlighting ──────────────────────────────────────
    // Yellow glow = "you and your partner". ORPHANS are explicitly excluded.
    function setMatchHighlight(matchId, on) {
        if (matchId === undefined || matchId === '' || matchId === '-1') return;
        if (orphanMatchIds.has(String(matchId))) return; // orphan: no glow
        overlay.querySelectorAll(`[data-match-id="${matchId}"]`).forEach(el => {
            if (el.dataset.kind === 'match-line') {
                el.style.display = on ? '' : 'none';
            } else {
                el.style.filter = on ? GLOW_FILTER : '';
            }
        });
    }
    // Single delegated mouseover/mouseout listener on overlay catches every
    // child transition (path or polygon) via e.target. Track the active id
    // so moves between sibling elements (polygon → its own fill path) don't
    // flicker.
    function onOverlayHover(e) {
        const t = e.target;
        const mid = (t && t.dataset) ? t.dataset.matchId : '';
        const valid = mid && mid !== '-1';
        const next = (e.type === 'mouseover' && valid) ? mid : null;
        // Don't trigger morph-line render for orphans — they have no partner.
        const nextEffective = (next !== null && !orphanMatchIds.has(String(next))) ? next : null;
        if (next === activeMatchId) return;
        if (activeMatchId !== null) setMatchHighlight(activeMatchId, false);
        if (next !== null) setMatchHighlight(next, true);
        activeMatchId = next;
        // Persist active id so the morph layer can render pre-morph lines
        // only for the hovered pair (formula mode). Then re-render.
        overlay.dataset.activeMatchId = nextEffective || '';
        if (typeof renderMorph === 'function') {
            const sl = document.getElementById('morph-slider');
            if (sl) renderMorph(+sl.value / 100);
        }
    }
    overlay.addEventListener('mouseover', onOverlayHover);
    overlay.addEventListener('mouseout', onOverlayHover);

    // ── Similarity metric ───────────────────────────────────────────────────
    // Returns 0–100 with penalties for: contour count mismatch, vertex-count
    // difference, and centroid displacement.
    function computeSimilarity(srcContours, latexContours, srcVerts, latVerts) {
        if (!srcContours || !latexContours
            || srcContours.length === 0 || latexContours.length === 0
            || typeof classifyContours !== 'function'
            || typeof normalizeForMatching !== 'function'
            || typeof centroid !== 'function') return 0;
        const pOuters = classifyContours(srcContours).outers
            .map(o => srcContours[o.idx]).filter(Boolean);
        const lOuters = classifyContours(latexContours).outers
            .map(o => latexContours[o.idx]).filter(Boolean);
        if (!pOuters.length || !lOuters.length) return 0;
        const pNorm = normalizeForMatching(pOuters);
        const lNorm = normalizeForMatching(lOuters);
        const n = Math.min(pNorm.length, lNorm.length);
        let sum = 0;
        for (let i = 0; i < n; i++) {
            const a = centroid(pNorm[i]);
            const b = centroid(lNorm[i]);
            sum += Math.hypot(a[0] - b[0], a[1] - b[1]);
        }
        const avg = sum / n;
        const missing = Math.abs(pNorm.length - lNorm.length);
        const countPenalty = missing * 0.5;
        // Explicit vertex counts so stift fallback works.
        const sv = (typeof srcVerts === 'number') ? srcVerts : pngVertCount;
        const lv = (typeof latVerts === 'number') ? latVerts : latVertCount;
        const vertDiff = Math.abs(sv - lv);
        const maxVerts = Math.max(sv, lv, 1);
        const vertPenalty = (vertDiff / maxVerts) * 0.2;
        const effDist = (avg * n + countPenalty) / Math.max(n + missing, 1) + vertPenalty;
        const maxDist = 0.7;
        return Math.max(0, Math.min(100, Math.round(100 * (1 - effDist / maxDist))));
    }

    function updateInfoBoxes(pngContours, latexContours) {
        const objVal = document.getElementById('obj-value');
        const latVal = document.getElementById('lat-value');
        const simVal = document.getElementById('sim-value');
        const objVerts = document.getElementById('obj-verts');
        const latVerts = document.getElementById('lat-verts');
        // Left-side source: PNG if present, else fall back to stift (the
        // user's own drawing). pngVertCount is already 0 when no PNG was
        // rendered — compute stift counts on-demand from getStiftContours.
        let leftOuters = (pngContours && typeof classifyContours === 'function')
            ? classifyContours(pngContours).outers.length : 0;
        let leftVerts = pngVertCount;
        // The effective LEFT contours — used for both info-boxes AND
        // similarity. When the user is in symbol mode (no PNG) but has
        // drawn stift strokes, stift IS the source.
        let leftContours = (pngContours && pngContours.length) ? pngContours : null;
        if (leftOuters === 0 && leftVerts === 0) {
            const sc = (typeof getStiftContours === 'function') ? getStiftContours() : null;
            if (sc && sc.length && typeof classifyContours === 'function') {
                leftOuters = classifyContours(sc).outers.length;
                leftVerts = sc.reduce((s, p) => s + (p ? p.length : 0), 0);
                leftContours = sc;
            }
        }
        const lOuters = (latexContours && typeof classifyContours === 'function')
            ? classifyContours(latexContours).outers.length : 0;
        if (objVal) objVal.textContent = leftOuters;
        if (latVal) latVal.textContent = lOuters;
        if (objVerts) objVerts.textContent = leftVerts;
        if (latVerts) latVerts.textContent = latVertCount;
        // Compute similarity using the effective left source (stift fall-
        // back makes the % non-zero even when PNG is empty). Pass explicit
        // vert counts so the penalty term uses leftVerts (not stale
        // pngVertCount).
        const sim = computeSimilarity(leftContours, latexContours, leftVerts, latVertCount);
        setBS(sim);
        if (simVal) simVal.textContent = sim + '%';
    }

    // ── Cross-pane matching wrapper ─────────────────────────────────────────
    function computeMatchIds(pngContours, latexContours) {
        return draw20ComputeMatchIds(pngContours, latexContours, {
            matchingEnabled: matchingEnabled !== false,
            // dbg disabled — Hungarian/iteration logs flood DEBUG and slow
            // renderBBoxes by 5–10× due to many DOM writes per formula.
        });
    }

    // When the user draws with stift instead of loading a PNG preset,
    // lastRenderData.pngContours is empty and the matcher returns LaTeX as
    // an orphan. Substitute stiftContours into the data and re-run the
    // match against LaTeX so the diagnostic views (RING, 3D MORPH) see a
    // real source side. Returns lastRenderData unchanged when no stift.
    function dataWithStiftSubstitution() {
        if (!lastRenderData) return null;
        const hasPng = lastRenderData.pngContours && lastRenderData.pngContours.length;
        if (hasPng) return lastRenderData;
        const stiftContours = (typeof getStiftContours === 'function') ? getStiftContours() : null;
        if (!stiftContours || !stiftContours.length) return lastRenderData;
        if (!lastRenderData.latexContours || !lastRenderData.latexContours.length) return lastRenderData;
        const sm = computeMatchIds(stiftContours, lastRenderData.latexContours);
        return Object.assign({}, lastRenderData, {
            pngContours: stiftContours,
            pClass: sm.pClass,
            pngId: sm.pngId,
            latId: sm.latId,
            idToPair: sm.idToPair,
            plausibility: sm.plausibility,
            pngDisplayScale: 1,
        });
    }

    // ── Polygon-Ring diagnostic (delegates to draw20-ring.js) ───────────────
    function openPolygonRing() {
        if (typeof draw20OpenPolygonRing === 'function') {
            draw20OpenPolygonRing(dataWithStiftSubstitution(), matchingEnabled !== false);
        }
    }

    // ── 3D Morph view (delegates to morph3d.js) ─────────────────────────────
    function openMorph3D() {
        if (typeof Morph3D === 'undefined' || typeof Morph3D.openMorph3D !== 'function') return;
        if (!lastRenderData) { Morph3D.openMorph3D(null); return; }

        let data = dataWithStiftSubstitution();

        // Per-pair vertex correspondence: resample both outlines to N points,
        // then run the SAME alignment engine the 2D morph uses to get the
        // rotation-correct idxMap. The popup uses this for picking — clicking
        // an original vertex finds its partner via arc-length-fraction → mapped
        // resampled index → fraction → interpolated point on the partner outline.
        if (data && data.idToPair && data.pngContours && data.latexContours
            && morphHelpers && typeof morphHelpers.resampleClosed === 'function'
            && typeof morphHelpers.alignDstToSrcBBox === 'function'
            && typeof morphHelpers.alignTargetWithEngine === 'function'
            && typeof classifyContours === 'function') {
            const N = 60;
            const pClass = data.pClass;
            const lClass = data.lClass;
            // outerId → outerIdx for both sides (mirrors morph3d.js).
            const pngIdxById = new Map();
            for (let oi = 0; oi < pClass.outers.length; oi++) {
                pngIdxById.set(data.pngId[pClass.outers[oi].idx], oi);
            }
            const latIdxById = new Map();
            for (let oi = 0; oi < lClass.outers.length; oi++) {
                latIdxById.set(data.latId[lClass.outers[oi].idx], oi);
            }
            const alignments = [];
            for (const [id, pair] of data.idToPair) {
                if (pair.png < 0 || pair.lat < 0) continue;
                const pi = pngIdxById.get(id);
                const li = latIdxById.get(id);
                if (pi == null || li == null) continue;
                const srcRaw = data.pngContours[pClass.outers[pi].idx];
                const dstRaw = data.latexContours[lClass.outers[li].idx];
                if (!srcRaw || !dstRaw) continue;
                // morphHelpers expects {x,y} objects.
                const srcPts = srcRaw.map(p => ({ x: p[0], y: p[1] }));
                const dstPts = dstRaw.map(p => ({ x: p[0], y: p[1] }));
                const srcR = morphHelpers.resampleClosed(srcPts, N);
                const dstR = morphHelpers.resampleClosed(dstPts, N);
                if (srcR.length < 3 || dstR.length < 3) continue;
                const dstAligned = morphHelpers.alignDstToSrcBBox(srcR, dstR);
                const eng = morphHelpers.alignTargetWithEngine(srcR, dstAligned);
                if (!eng) continue;
                alignments.push({
                    outerId: id,
                    pngOuterIdx: pi,
                    latOuterIdx: li,
                    N: N,
                    idxMap: eng.idxMap, // src-resampled-i → dst-resampled-j (in dstR)
                });
            }
            data = Object.assign({}, data, { pairAlignments: alignments });
        }

        // Per-match palette colour — same convention as the 2D main view:
        // both sides of a match share the colour from draw20PaletteColor.
        if (data && data.idToPair && typeof draw20PaletteColor === 'function') {
            const colorByMatchId = {};
            for (const [id] of data.idToPair) colorByMatchId[id] = draw20PaletteColor(id);
            data = Object.assign({}, data, { colorByMatchId });
        }
        Morph3D.openMorph3D(data);
    }

    // ── renderBBoxes: orchestrator ──────────────────────────────────────────
    function renderBBoxes() {
        // Mode detection at the very top — every subsequent decision reads
        // currentMode / inSymbolMode rather than re-checking pix/stift state.
        currentMode = detectRenderMode();
        inSymbolMode = (currentMode === 'symbol');
        // Detach morph-layer first, wipe everything, drawing happens in
        // between, morph-layer gets re-attached as the LAST child below so
        // its polygons render on TOP of bboxes/outlines/dots.
        if (morphLayer.parentNode === overlay) overlay.removeChild(morphLayer);
        while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
        // Reset vert counts so stale values from a previous render don't
        // poison the similarity penalty when one side is empty this round.
        pngVertCount = 0;
        latVertCount = 0;
        let pngContours = null;
        let latexContoursList = null;

        // ── Extract contours from both panes FIRST so we can match before
        // drawing (shared matchIds drive both colour + hover pair).
        if (pix.complete && pix.naturalWidth) {
            const pc = document.createElement('canvas');
            pc.width = pix.naturalWidth;
            pc.height = pix.naturalHeight;
            pc.getContext('2d').drawImage(pix, 0, 0);
            pngContours = extractPNGContours(pc);
        }
        const latexCanvas = getLC();
        if (tex.complete && tex.naturalWidth && latexCanvas) {
            const res = extractLatexContours();
            if (res && res.contours.length) latexContoursList = res.contours;
        }

        // ── Match pix content-height to tex content-height + align baselines
        // PLAN B: Both pix and tex content are scaled to fit within
        // TARGET_CONTENT_FRAC of BOTH pane width AND pane height — the
        // smaller of the two scales wins (Math.min) so tall formulas
        // don't overflow the pane vertically and wide ones don't overflow
        // horizontally. paneW = wrap.width/2 (flex split), paneH = wrap.height.
        const TARGET_CONTENT_FRAC = 0.66;
        const wrapRect = wrap.getBoundingClientRect();
        const paneW = (wrapRect.width || 2) / 2;
        const paneH = wrapRect.height || 1;
        const targetW = TARGET_CONTENT_FRAC * paneW;
        const targetH = TARGET_CONTENT_FRAC * paneH;
        const fitContentToTarget = (img, bb) => {
            // Always reset transform first — covers the "no image" case (e.g.
            // switching from a formula preset to a symbol-only render where
            // pix has no src; without this the previous formula's transform
            // would persist and push pix outside the viewport).
            img.style.transform = '';
            img.style.transformOrigin = 'center';
            if (!img.complete || !img.naturalWidth) return;
            if (!bb || bb.w <= 0 || bb.h <= 0 || !bb.ch) return;
            const r = img.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) return;
            const renderScale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
            const contentW = bb.w * renderScale;
            const contentH = bb.h * renderScale;
            if (contentW <= 0 || contentH <= 0) return;
            // Y-LIMIT: never let scaled content exceed the image's CSS box
            // height (max-height: 54vh). Without this clamp, tall formulas
            // (e.g. a/b fraction with small width) get scaled UP by sfW to
            // hit targetW and overflow the pane vertically.
            // Clamp to max 1 — NEVER upscale (single symbols would otherwise
            // render at huge size with visible pixelation/fuzziness).
            const sf = Math.min(targetW / contentW, targetH / contentH, r.height / contentH, 1);
            // Y-CENTER: shift the CONTENT-bbox center to the image center
            // (img is already pane-centered via flex align-items:center).
            // Offset in natural coords, scaled to displayed CSS px.
            const offsetYNat = (bb.y + bb.h / 2) - (bb.ch / 2);
            const dy = -offsetYNat * renderScale * sf;
            img.style.transform = `translateY(${dy.toFixed(2)}px) scale(${sf.toFixed(4)})`;
        };
        fitContentToTarget(pix, pix.naturalWidth ? computeImageBBox(pix) : null);
        fitContentToTarget(tex, latexCanvas ? computeContentBBox(latexCanvas, 'alpha') : null);
        // Hide pix entirely when it has no src (symbol mode) so the broken-
        // image icon never leaks through after a Formel→Symbol switch.
        if (!pix.getAttribute('src') || !pix.naturalWidth) {
            pix.style.display = 'none';
        } else {
            pix.style.display = '';
        }

        const matchInfo = computeMatchIds(pngContours, latexContoursList);
        const { pngId, latId, idToPair, plausibility, pClass, lClass } = matchInfo;

        // Density floor for EVERY contour — even before matching. This
        // way unmatched contours (e.g. LaTeX-only when no PNG/stift is
        // present, or extra holes that don't pair) still hit MIN_POINTS.
        ensureMinDensity(pngContours);
        ensureMinDensity(latexContoursList);

        // Equalize point counts between matched PNG↔LaTeX pairs.
        if (pngContours && pngContours.length && latexContoursList && latexContoursList.length) {
            equalizeMatchedContours(pngContours, latexContoursList, matchInfo);
        }

        // Same for stift↔LaTeX (when user has drawn). After equalizing,
        // re-render the stift outlines so the display reflects the new
        // point counts.
        const stiftC = (typeof getStiftContours === 'function') ? getStiftContours() : null;
        if (stiftC && stiftC.length && latexContoursList && latexContoursList.length) {
            const stiftMatch = computeMatchIds(stiftC, latexContoursList);
            equalizeMatchedContours(stiftC, latexContoursList, stiftMatch);
            if (typeof rerenderStift === 'function') rerenderStift();
        }

        // Display scales — natural pixel → displayed CSS pixel, exactly as
        // used by drawContours for the main panes. The polygon-ring uses
        // these so each polygon is rendered at the SAME on-screen size as
        // in the live panes.
        const pixR = pix.getBoundingClientRect();
        const texR = tex.getBoundingClientRect();
        const pngDisplayScale = (pix.naturalWidth && pix.naturalHeight)
            ? Math.min(pixR.width / pix.naturalWidth, pixR.height / pix.naturalHeight) : 1;
        const latDisplayScale = (tex.naturalWidth && tex.naturalHeight)
            ? Math.min(texR.width / tex.naturalWidth, texR.height / tex.naturalHeight) : 1;

        // Stash render data so the polygon-ring view can grab it without
        // re-running the matcher.
        lastRenderData = {
            pngContours, latexContours: latexContoursList,
            pClass, lClass, pngId, latId, idToPair, plausibility,
            pngDisplayScale, latDisplayScale,
        };

        // Refresh the orphan-id set: any match-id whose pair has png<0 or
        // lat<0 (no partner on the other side) is flagged so drawContours
        // can paint it red. Symbol mode is not "orphaned" — it's just the
        // only source, so skip orphan-marking and use side-colours.
        // inSymbolMode was already set at the top via detectRenderMode().
        orphanMatchIds.clear();
        if (!inSymbolMode) {
            for (const [id, pair] of idToPair) {
                if (pair.png < 0 || pair.lat < 0) orphanMatchIds.add(String(id));
            }
        }

        // Centroid maps populated by drawContours — used afterwards to draw
        // cross-pane match lines (centroid PNG ↔ centroid LaTeX).
        const pngCentroids = new Map();
        const latCentroids = new Map();
        const pngPoints = new Map();
        const latPoints = new Map();
        const pngHoles = new Map();
        const latHoles = new Map();

        // ── PNG render
        if (pix.complete && pix.naturalWidth) {
            const bbox = computeImageBBox(pix);
            if (bbox) drawBBox(mapImageBBoxToViewport(pix, bbox), 'png');
            if (pngContours && pngContours.length) {
                const r = pix.getBoundingClientRect();
                const wrapRect = wrap.getBoundingClientRect();
                const scale = Math.min(r.width / pix.naturalWidth, r.height / pix.naturalHeight);
                const renderW = pix.naturalWidth * scale;
                const renderH = pix.naturalHeight * scale;
                const offX = r.left + (r.width - renderW) / 2;
                const offY = r.top + (r.height - renderH) / 2;
                const z = getZ() || 1;
                const mapFn = (x, y) => ({
                    x: (offX + x * scale - wrapRect.left) / z,
                    y: (offY + y * scale - wrapRect.top) / z,
                });
                pngVertCount = drawContours(pngContours, mapFn, 'png', pngId, pngCentroids, pngPoints, pngHoles);
            }
        }

        // ── LaTeX render
        if (tex.complete && tex.naturalWidth && latexCanvas) {
            const bbox = computeContentBBox(latexCanvas, 'alpha');
            if (bbox) drawBBox(mapImageBBoxToViewport(tex, bbox), 'latex');
            if (latexContoursList && latexContoursList.length) {
                const r = tex.getBoundingClientRect();
                const wrapRect = wrap.getBoundingClientRect();
                const scale = Math.min(r.width / tex.naturalWidth, r.height / tex.naturalHeight);
                const renderW = tex.naturalWidth * scale;
                const renderH = tex.naturalHeight * scale;
                const offX = r.left + (r.width - renderW) / 2;
                const offY = r.top + (r.height - renderH) / 2;
                const z = getZ() || 1;
                const mapFn = (x, y) => ({
                    x: (offX + x * scale - wrapRect.left) / z,
                    y: (offY + y * scale - wrapRect.top) / z,
                });
                latVertCount = drawContours(latexContoursList, mapFn, 'latex', latId, latCentroids, latPoints, latHoles);
            }
        }

        // Match lines (centroid-to-centroid) disabled — user requested
        // they be hidden. Keep the loop infrastructure commented for easy
        // restoration.
        const svgNS = 'http://www.w3.org/2000/svg';
        const z = getZ() || 1;
        // const verdictById = new Map();
        // if (plausibility) { ... }
        // for (const [mid, p] of pngCentroids) { ... overlay.appendChild(line); }

        // Build the morph-pair list (matched outer pairs in wrap-local
        // coords) so renderMorph(t) can interpolate without re-running
        // anything. Re-apply the current morph value so the slider state
        // stays consistent across re-renders.
        morphPairs.length = 0;
        for (const [mid, pp] of pngPoints) {
            const lp = latPoints.get(mid);
            if (!lp) continue;
            morphPairs.push({
                mid,
                pngPts: pp, latPts: lp,
                pngHoles: pngHoles.get(mid) || [],
                latHoles: latHoles.get(mid) || [],
            });
        }
        // Morph-layer on top of everything for visibility.
        overlay.appendChild(morphLayer);
        const sl = document.getElementById('morph-slider');

        // If stift outlines exist, also rebuild stift→LaTeX pairs — the
        // LaTeX coords just changed. Must happen BEFORE renderMorph,
        // otherwise the first slider tick still uses stale stiftMorphPairs.
        const sc = (typeof getStiftContours === 'function') ? getStiftContours() : null;
        if (sc && sc.length && typeof buildStiftMorphPairs === 'function') {
            buildStiftMorphPairs(latexContoursList);
        }

        if (sl && typeof renderMorph === 'function') renderMorph(+sl.value / 100);

        updateInfoBoxes(pngContours, latexContoursList);
        if (typeof window !== 'undefined' && window.__draw20ClickT0) {
            window.__draw20ClickT0 = 0;
        }
    }

    // Re-run updateInfoBoxes from the most recent renderBBoxes state.
    // Cheap — no contour extraction. Used after stift outlines change so
    // the left info-box reflects fresh stift counts.
    function refreshInfoBoxes() {
        if (!lastRenderData) {
            updateInfoBoxes(null, null);
            return;
        }
        updateInfoBoxes(lastRenderData.pngContours, lastRenderData.latexContours);
    }

    // Equalize stift contours against the most recently rendered LaTeX
    // contours. Used after a stroke completes — keeps point counts aligned
    // without re-running the full renderBBoxes. Returns true if any
    // equalization actually happened.
    function equalizeStiftWithLatex(stiftContours) {
        if (!stiftContours || !stiftContours.length) return false;
        if (!lastRenderData || !lastRenderData.latexContours || !lastRenderData.latexContours.length) return false;
        const stiftMatch = computeMatchIds(stiftContours, lastRenderData.latexContours);
        equalizeMatchedContours(stiftContours, lastRenderData.latexContours, stiftMatch);
        return true;
    }

    return {
        renderBBoxes,
        openPolygonRing,
        openMorph3D,
        getLastRenderData: () => lastRenderData,
        refreshInfoBoxes,
        equalizeStiftWithLatex,
    };
}
