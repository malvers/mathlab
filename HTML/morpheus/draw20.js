// Morpheus drawing v2 — clean restart.
// Tandem display: pixel formula (preset PNG) + LaTeX rendering of the same
// formula, side-by-side with vector bounding boxes around the actual character
// pixels. Hooks into the existing formula radio grid so selecting a formula
// updates both panes.

(function () {
    const DEFAULT_LATEX = 'E=mc^2';
    const DEFAULT_PRESET = 0;
    const INK_COLOR = '#F4C430';
    // 20 maximally-distinguishable colours (Sasha Trubetskoy palette, with
    // the original yellow swapped for a saturated gold so it doesn't collide
    // with INK_COLOR). Indexed by matchId — PNG outer #N and LaTeX outer #N
    // share the same palette slot, so paired regions glow in the same hue.
    const REGION_PALETTE = [
        '#e6194B', // red
        '#3cb44b', // green
        '#4363d8', // blue
        '#f58231', // orange
        '#911eb4', // purple
        '#42d4f4', // cyan
        '#f032e6', // magenta
        '#bfef45', // lime
        '#fabed4', // pink
        '#469990', // teal
        '#dcbeff', // lavender
        '#9A6324', // brown
        '#800000', // maroon
        '#aaffc3', // mint
        '#808000', // olive
        '#ffd8b1', // apricot
        '#000075', // navy
        '#a9a9a9', // gray
        '#e67e22', // pumpkin
        '#1abc9c', // turquoise
    ];
    function paletteColor(i) {
        const n = REGION_PALETTE.length;
        return REGION_PALETTE[((i % n) + n) % n];
    }

    function dbg(msg) {
        if (typeof DebugWindow !== 'undefined') DebugWindow.log('[draw20] ' + msg);
    }

    function getThreshold() {
        return +(document.getElementById('threshold-slider')?.value ?? 20);
    }

    function init() {
        dbg('init called');
        const host = document.getElementById('canvas-container');
        if (!host) { dbg('ABORT: no canvas-container'); return; }

        // Mouse-zoom state — declared up top so drawBBox closures see it
        // initialized regardless of which async path fires first.
        let zoom = +(localStorage.getItem('draw20-zoom') ?? 1);
        let panX = +(localStorage.getItem('draw20-panX') ?? 0);
        let panY = +(localStorage.getItem('draw20-panY') ?? 0);

        function saveZoomPan() {
            try {
                localStorage.setItem('draw20-zoom', zoom);
                localStorage.setItem('draw20-panX', panX);
                localStorage.setItem('draw20-panY', panY);
            } catch (_) {}
        }

        const wrap = document.createElement('div');
        wrap.id = 'draw20-wrap';
        // pointer-events: auto on wrap so the overlay polygons can receive
        // hover events. Mouse events still bubble up to `host`, where wheel/
        // drag listeners live (bubbling is independent of pointer-events
        // targeting). pix/tex get pointer-events: none individually so the
        // images themselves never become event targets.
        wrap.style.cssText = `
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(20px, 4vw, 80px);
            z-index: 10;
            background: rgb(0, 0, 20);
        `;

        const pix = document.createElement('img');
        pix.draggable = false;
        pix.style.cssText = `
            max-height: 43vh;
            max-width: 29vw;
            object-fit: contain;
            mix-blend-mode: screen;
            pointer-events: none;
            user-select: none;
        `;

        // tex is now an <img> displaying the offscreen-rendered LaTeX canvas
        // (data URL). The SAME canvas is the source for contour extraction —
        // this guarantees pixel-perfect alignment between display and contours
        // (no two-render discrepancy from a separate html2canvas pass).
        const tex = document.createElement('img');
        tex.draggable = false;
        tex.style.cssText = `
            max-height: 43vh;
            max-width: 29vw;
            object-fit: contain;
            pointer-events: none;
            user-select: none;
        `;
        // Stash the rendered offscreen canvas for re-use during contour
        // extraction (avoids re-rendering, and keeps coords identical).
        let latexCanvas = null;

        wrap.appendChild(pix);
        wrap.appendChild(tex);
        host.appendChild(wrap);

        // Extra drawing layer: vector bounding boxes around the actual character
        // pixels of both the PNG and the LaTeX render. The <svg> itself uses
        // pointer-events: auto so polygons inside it can receive hover events;
        // wheel/drag still work on `host` because mouse events bubble up from
        // overlay → wrap → host regardless of who is the event target.
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        overlay.id = 'draw20-overlay';
        overlay.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 11;
            pointer-events: auto;
        `;
        wrap.appendChild(overlay);
        // Single delegated hover listener for the whole overlay — handles
        // both <polygon> outlines and <path> fills via e.target.dataset.
        // mouseover / mouseout bubble (unlike mouseenter / mouseleave) so a
        // single listener at the parent catches every child transition.
        overlay.addEventListener('mouseover', onOverlayHover);
        overlay.addEventListener('mouseout', onOverlayHover);

        // Render LaTeX offscreen (KaTeX → html2canvas) and use the resulting
        // canvas as BOTH the displayed image (tex.src = dataURL) and the
        // source for contour extraction (latexCanvas). Returns a Promise that
        // resolves once tex.src has been set.
        function renderLatex(latex) {
            return new Promise(resolve => {
                if (typeof katex === 'undefined' || typeof html2canvas === 'undefined') {
                    setTimeout(() => renderLatex(latex).then(resolve), 50);
                    return;
                }
                let processed = latex.trim();
                if (processed === '\\sqrt') processed = '\\surd';
                let html;
                try { html = katex.renderToString(processed, { throwOnError: false, displayMode: true }); }
                catch (e) { resolve(null); return; }
                const wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                wrapper.style.cssText = `
                    position: fixed; left: -10000px; top: 0;
                    background: transparent; color: ${INK_COLOR};
                    font-size: 400px; padding: 60px;
                    display: inline-block; line-height: 1;
                `;
                document.body.appendChild(wrapper);
                setTimeout(() => {
                    const rect = wrapper.getBoundingClientRect();
                    html2canvas(wrapper, {
                        backgroundColor: null, scale: 1, logging: false,
                        width: rect.width, height: rect.height
                    }).then(canvas => {
                        document.body.removeChild(wrapper);
                        latexCanvas = canvas;
                        tex.onload = () => resolve(canvas);
                        tex.src = canvas.toDataURL();
                    }).catch(() => {
                        try { document.body.removeChild(wrapper); } catch (_) {}
                        resolve(null);
                    });
                }, 50);
            });
        }

        // Compute the content bbox of an image (or canvas) by scanning a
        // chosen channel. PNG presets use 'red' (black background, coloured
        // ink, alpha is uniformly 255). LaTeX canvas uses 'alpha' (transparent
        // background, ink alpha varies). Pass canvas directly to avoid an
        // extra drawImage round-trip.
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
            const t = getThreshold();
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
            // The input rect is in viewport (post-transform) coords. The overlay
            // SVG lives inside `wrap`, which gets translate+scale applied, so we
            // must convert into wrap's pre-transform local space by dividing by
            // the current zoom.
            const wrapRect = wrap.getBoundingClientRect();
            const z = zoom || 1;
            const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            r.setAttribute('x', (rect.left - wrapRect.left) / z);
            r.setAttribute('y', (rect.top - wrapRect.top) / z);
            r.setAttribute('width', rect.width / z);
            r.setAttribute('height', rect.height / z);
            r.setAttribute('fill', 'none');
            r.setAttribute('stroke', '#888');
            r.setAttribute('stroke-width', String(1 / (zoom || 1)));
            overlay.appendChild(r);
            dbg(`bbox ${label}: ${Math.round(rect.width)}×${Math.round(rect.height)}`);
        }

        function computeElementInkBBox(el) {
            if (typeof html2canvas === 'undefined') return Promise.resolve(null);
            return html2canvas(el, {
                backgroundColor: null,
                logging: false,
                scale: 1,
            }).then(canvas => {
                const cw = canvas.width, ch = canvas.height;
                if (!cw || !ch) return null;
                const ctx = canvas.getContext('2d');
                let data;
                try { data = ctx.getImageData(0, 0, cw, ch).data; }
                catch (e) { return null; }
                let minX = cw, minY = ch, maxX = -1, maxY = -1;
                const t = getThreshold();
                for (let y = 0; y < ch; y++) {
                    for (let x = 0; x < cw; x++) {
                        const i = (y * cw + x) * 4;
                        // Match the offscreen contour grid threshold so the
                        // mapping target (this rect) and source (cb in
                        // extractLatexContours) share the same definition of
                        // "ink" — otherwise the contours land off-glyph.
                        if (data[i + 3] > t) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
                if (maxX < 0) return null;
                const r = el.getBoundingClientRect();
                const sx = r.width / cw;
                const sy = r.height / ch;
                return {
                    left: r.left + minX * sx,
                    top: r.top + minY * sy,
                    width: (maxX - minX + 1) * sx,
                    height: (maxY - minY + 1) * sy,
                };
            }).catch(() => null);
        }

        // Engine-mirroring grid builders. Two thresholds match what the legacy
        // engine uses on its two distinct surfaces:
        //   - PNG / drawing (user-draw.js extractOutline):  RED channel > 30
        //   - LaTeX html2canvas snapshot (target-render.js):  ALPHA > 30
        function canvasToGridRed(c) {
            const cw = c.width, ch = c.height;
            let data;
            try { data = c.getContext('2d').getImageData(0, 0, cw, ch).data; }
            catch (e) { return null; }
            const grid = new Uint8Array(cw * ch);
            const t = getThreshold();
            for (let i = 0; i < cw * ch; i++) grid[i] = data[i * 4] > t ? 1 : 0;
            return { grid, W: cw, H: ch };
        }
        function canvasToGridAlpha(c) {
            const cw = c.width, ch = c.height;
            let data;
            try { data = c.getContext('2d').getImageData(0, 0, cw, ch).data; }
            catch (e) { return null; }
            const grid = new Uint8Array(cw * ch);
            const t = getThreshold();
            for (let i = 0; i < cw * ch; i++) grid[i] = data[i * 4 + 3] > t ? 1 : 0;
            return { grid, W: cw, H: ch };
        }

        // Shoelace area (matches user-draw.js polyArea).
        function polyArea(poly) {
            let a = 0;
            for (let i = 0; i < poly.length; i++) {
                const [x1, y1] = poly[i];
                const [x2, y2] = poly[(i + 1) % poly.length];
                a += (x2 - x1) * (y2 + y1);
            }
            return Math.abs(a) / 2;
        }

        // Stride-based downsample to ≤ maxPts (matches target-render.js).
        function strideResample(poly, maxPts) {
            if (poly.length <= maxPts) return poly;
            const step = poly.length / maxPts;
            const sub = [];
            for (let i = 0; i < maxPts; i++) sub.push(poly[Math.round(i * step)]);
            return sub;
        }

        // Mirrors user-draw.js extractOutline: red-channel > 30 → morphClose
        // (merge slider) → getContoursWithHoles → area filter → canonical sort.
        // Then rdp(eps) for visualization (engine applies this at morph stage).
        function extractPNGContours(canvas) {
            const g = canvasToGridRed(canvas);
            if (!g) return [];
            const mergeEl = document.getElementById('merge-slider');
            const closeR = mergeEl ? +mergeEl.value : 4;
            const grid = (closeR > 0 && typeof morphClose === 'function')
                ? morphClose(g.grid, g.W, g.H, closeR) : g.grid;
            if (typeof getContoursWithHoles !== 'function') return [];
            const raw = getContoursWithHoles(grid, g.W, g.H);
            const areaScale = (g.W * g.H) / (1000 * 1000);
            const MIN_AREA = 10 * areaScale;
            const filtered = raw.filter(p => polyArea(p) >= MIN_AREA);
            let sorted = (typeof sortContoursCanonical === 'function')
                ? sortContoursCanonical(filtered) : filtered;
            const eps = +(document.getElementById('eps-slider')?.value ?? 1);
            if (typeof rdp === 'function' && eps > 0) {
                sorted = sorted.map(p => (p && p.length >= 3) ? rdp(p, eps) : p);
            }
            const totalV = sorted.reduce((s, p) => s + (p ? p.length : 0), 0);
            dbg(`PNG: raw=${raw.length}, filtered=${filtered.length}, rdp(eps=${eps}) → ${totalV} verts`);
            return sorted;
        }

        // Extract LaTeX contours from the SAME canvas that we display in `tex`
        // (latexCanvas, set by renderLatex). No second html2canvas pass → no
        // alignment drift. Mirrors the engine's target-render pipeline:
        // alpha-grid → getContoursWithHoles → stride-resample → canonical sort
        // → RDP. Returns null synchronously when no canvas is ready yet.
        const TARGET_MAX_PTS = 300;
        function extractLatexContours() {
            if (!latexCanvas) return null;
            const g = canvasToGridAlpha(latexCanvas);
            if (!g) return null;
            let contours = (typeof getContoursWithHoles === 'function')
                ? getContoursWithHoles(g.grid, g.W, g.H) : [];
            const rawCount = contours.length;
            contours = contours.map(p => strideResample(p, TARGET_MAX_PTS));
            contours = (typeof sortContoursCanonical === 'function')
                ? sortContoursCanonical(contours) : contours;
            const eps = +(document.getElementById('eps-slider')?.value ?? 1);
            if (typeof rdp === 'function' && eps > 0) {
                contours = contours.map(p => (p && p.length >= 3) ? rdp(p, eps) : p);
            }
            const totalV = contours.reduce((s, p) => s + (p ? p.length : 0), 0);
            dbg(`LaTeX: raw=${rawCount}, rdp(eps=${eps}) → ${totalV} verts`);
            return { contours, W: g.W, H: g.H };
        }

        // Draw contours (array of polylines, each an array of [x,y] points in
        // source-canvas pixels) onto the overlay, transforming source-canvas
        // coords through mapFn(x, y) → wrap-local {x, y}.
        //
        // Holes are handled correctly: classifyContours() identifies outer vs
        // hole regions. For each outer, we emit ONE <path> with the outer +
        // its holes as subpaths and fill-rule="evenodd", so the holes XOR-out
        // of the fill (same idea as morph-engine.js fill('evenodd')). The
        // per-contour stroke/points stay individual so each region keeps its
        // own color.
        //
        // `label` ('png' or 'latex') tags polygons + fill paths via
        // data-source. Each element also carries data-match-id = the outer's
        // index in the classified outers list (holes inherit their parent's
        // id), so cross-pane hover highlighting can pair regions: PNG outer
        // #N ↔ LaTeX outer #N (both sets are canonical-sorted left-to-right).
        // drawContours accepts an optional `matchIdByContour` array
        // (length = contours.length) that maps each contour index to the
        // shared cross-pane matchId. When omitted, falls back to numbering
        // outers in canonical order (legacy single-pane behaviour). The
        // shared map is built by renderBBoxes via Hungarian assignment so
        // PNG outer #N ↔ LaTeX outer #M get the same matchId.
        //
        // `centroidsOut` (optional Map<matchId,[x,y]>) is populated with the
        // wrap-local centroid of each outer's mapped polygon so the caller
        // can draw cross-pane match lines.
        function drawContours(contours, mapFn, label, matchIdByContour, centroidsOut) {
            if (!contours || contours.length === 0) return;
            const svgNS = 'http://www.w3.org/2000/svg';
            const z = zoom || 1;
            const sw = String(1 / z);
            const pr = 2 / z;

            const mappedAll = contours.map(c =>
                (c && c.length >= 2) ? c.map(p => mapFn(p[0], p[1])) : null
            );

            const classified = (typeof classifyContours === 'function')
                ? classifyContours(contours)
                : { outers: contours.map((_, i) => ({ idx: i, holes: [] })), holes: [] };

            // matchId per contour: from override if provided (Hungarian),
            // else legacy "outer position" numbering. Holes always inherit
            // their parent outer's id.
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
            const colourOf = (i) => (matchId[i] >= 0)
                ? paletteColor(matchId[i])
                : INK_COLOR;

            // ── FILL: one <path> per outer group (outer + its holes).
            for (let oi = 0; oi < classified.outers.length; oi++) {
                const outer = classified.outers[oi];
                const oc = mappedAll[outer.idx];
                if (!oc) continue;
                const parts = [oc, ...outer.holes.map(hi => mappedAll[hi]).filter(Boolean)];
                const d = parts.map(pts => {
                    let s = `M ${pts[0].x} ${pts[0].y}`;
                    for (let k = 1; k < pts.length; k++) s += ` L ${pts[k].x} ${pts[k].y}`;
                    return s + ' Z';
                }).join(' ');
                const mid = matchId[outer.idx];
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', d);
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('fill', paletteColor(mid));
                path.setAttribute('stroke', 'none');
                path.dataset.kind = 'fill';
                path.dataset.source = label;
                path.dataset.matchId = String(mid);
                overlay.appendChild(path);

                // Record the outer's centroid (wrap-local) so renderBBoxes
                // can draw a line between paired centroids across the panes.
                if (centroidsOut) {
                    let sx = 0, sy = 0;
                    for (const m of oc) { sx += m.x; sy += m.y; }
                    centroidsOut.set(mid, [sx / oc.length, sy / oc.length]);
                }
            }

            // ── STROKE + POINTS: one polygon + N circles per contour.
            let totalVerts = 0;
            for (let i = 0; i < contours.length; i++) {
                const mapped = mappedAll[i];
                if (!mapped) continue;
                const colour = colourOf(i);
                const pts = mapped.map(m => `${m.x},${m.y}`).join(' ');
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', pts);
                poly.setAttribute('fill', 'none');
                poly.setAttribute('stroke', colour);
                poly.setAttribute('stroke-width', sw);
                poly.setAttribute('stroke-linejoin', 'round');
                poly.dataset.source = label;
                poly.dataset.matchId = String(matchId[i]);
                poly.style.pointerEvents = 'all';
                overlay.appendChild(poly);

                for (const m of mapped) {
                    const dot = document.createElementNS(svgNS, 'circle');
                    dot.setAttribute('cx', m.x);
                    dot.setAttribute('cy', m.y);
                    dot.setAttribute('r', pr);
                    dot.setAttribute('fill', colour);
                    dot.dataset.kind = 'point';
                    dot.dataset.source = label;
                    dot.dataset.matchId = String(matchId[i]);
                    overlay.appendChild(dot);
                    totalVerts++;
                }
            }
            dbg(`outlines ${label}: ${contours.length} contour(s), ${totalVerts} verts, ${classified.outers.length} outer(s), ${classified.holes.length} hole(s)`);
            applyLinesToggle();
            applyPointsToggle();
            applyFillToggle();
        }

        // Cross-pane region highlighting. Yellow glow = "you and your partner".
        // ORPHANS are explicitly excluded — hovering an orphan gives NO glow
        // (the red dashed circle is its permanent marker; glow would falsely
        // imply a partnership). The set of orphan matchIds is updated by
        // renderBBoxes after computing idToPair.
        const GLOW_FILTER = 'drop-shadow(0 0 6px #F4C430) drop-shadow(0 0 12px #F4C430)';
        const orphanMatchIds = new Set();
        function setMatchHighlight(matchId, on) {
            if (matchId === undefined || matchId === '' || matchId === '-1') return;
            if (orphanMatchIds.has(String(matchId))) return; // orphan: no glow
            overlay.querySelectorAll(
                `[data-match-id="${matchId}"]`
            ).forEach(el => {
                if (el.dataset.kind === 'match-line') {
                    el.style.display = on ? '' : 'none';
                } else {
                    el.style.filter = on ? GLOW_FILTER : '';
                }
            });
        }
        // Currently-highlighted matchId. Single delegated mouseover/mouseout
        // listener on overlay catches every child transition (path or polygon)
        // via e.target. We track the active id so moves between sibling
        // elements (e.g. polygon → its own fill path) don't flicker.
        let activeMatchId = null;
        function onOverlayHover(e) {
            const t = e.target;
            const mid = (t && t.dataset) ? t.dataset.matchId : '';
            const src = (t && t.dataset) ? t.dataset.source : '';
            const valid = mid && mid !== '-1';
            const next = (e.type === 'mouseover' && valid) ? mid : null;
            if (e.type === 'mouseover') {
                dbg(`hover tgt=${t.tagName} kind=${t.dataset && t.dataset.kind || '-'} src=${src} mid=${mid}`);
            }
            if (next === activeMatchId) return;
            if (activeMatchId !== null) setMatchHighlight(activeMatchId, false);
            if (next !== null) setMatchHighlight(next, true);
            activeMatchId = next;
        }

        // Similarity metric: normalize both contour sets to the same
        // [-1, 1] box (preserving aspect via normalizeForMatching), then
        // average the centroid distance between paired outers (smallest-area
        // index match). Result mapped to 0–100% with maxDist = 0.5.
        function computeSimilarity(pngContours, latexContours) {
            if (!pngContours || !latexContours
                || pngContours.length === 0 || latexContours.length === 0
                || typeof classifyContours !== 'function'
                || typeof normalizeForMatching !== 'function'
                || typeof centroid !== 'function') return 0;
            const pOuters = classifyContours(pngContours).outers
                .map(o => pngContours[o.idx]).filter(Boolean);
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
            // Count mismatch penalty: missing/extra outers count as max dist.
            const missing = Math.abs(pNorm.length - lNorm.length);
            const penalty = missing * 0.5;
            const effDist = (avg * n + penalty) / Math.max(n + missing, 1);
            const maxDist = 0.5;
            return Math.max(0, Math.min(100, Math.round(100 * (1 - effDist / maxDist))));
        }

        function updateInfoBoxes(pngContours, latexContours) {
            const objVal = document.getElementById('obj-value');
            const latVal = document.getElementById('lat-value');
            const simVal = document.getElementById('sim-value');
            const pOuters = (pngContours && typeof classifyContours === 'function')
                ? classifyContours(pngContours).outers.length : 0;
            const lOuters = (latexContours && typeof classifyContours === 'function')
                ? classifyContours(latexContours).outers.length : 0;
            if (objVal) objVal.textContent = pOuters;
            if (latVal) latVal.textContent = lOuters;
            if (simVal) simVal.textContent = computeSimilarity(pngContours, latexContours) + '%';
        }

        // Build per-contour matchId arrays. The cost matrix for Hungarian
        // uses the SAME shape descriptor (size / elongation / position /
        // fuzz) as plausibilcheck.js — with hard vetoes for impossible
        // pairs (e.g. a "2" onto a √-overbar — elongation differs ≥3×).
        // Hungarian still produces a full assignment, but any pair whose
        // cost crosses the veto threshold is forcibly rejected after the
        // fact (treated as orphan instead of an absurd pair).
        function computeMatchIds(pngContours, latexContours) {
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

            let assign = [];
            let pDesc = [], lDesc = [];
            if (pOuters.length && lOuters.length
                && typeof PlausibilCheck !== 'undefined'
                && typeof hungarian === 'function') {
                const pBB = PlausibilCheck.equationBBox(pOuters);
                const lBB = PlausibilCheck.equationBBox(lOuters);
                pDesc = pOuters.map(p => PlausibilCheck.shapeDescriptor(p, pBB));
                lDesc = lOuters.map(p => PlausibilCheck.shapeDescriptor(p, lBB));
                const N = pDesc.length, M = lDesc.length;

                // ── Stage 0: reading-order ranks. Sorting by (cx + 0.3·cy)
                // gives a useful left-to-right + slight-vertical-bias linear
                // order that matches how formulas are read.
                const rankOf = (desc) => {
                    const keyed = desc.map((d, i) => ({ i, k: d.nx + 0.3 * d.ny }));
                    keyed.sort((a, b) => a.k - b.k);
                    const r = new Array(desc.length);
                    for (let k = 0; k < keyed.length; k++) r[keyed[k].i] = k;
                    return r;
                };
                const pRank = rankOf(pDesc);
                const lRank = rankOf(lDesc);
                const ORDER_WEIGHT = 0.15;

                // Cost = shape-plausibility cost + reading-order penalty.
                // The order term is BUILT INTO the cost matrix so Hungarian
                // already prefers in-order pairings, dramatically reducing
                // crossings in the initial solution.
                const cost = new Array(N);
                for (let i = 0; i < N; i++) {
                    cost[i] = new Array(M);
                    for (let j = 0; j < M; j++) {
                        const base = PlausibilCheck.pairCost(pDesc[i], lDesc[j]);
                        const ord = Math.abs(pRank[i] / Math.max(1, N - 1) - lRank[j] / Math.max(1, M - 1));
                        cost[i][j] = base + ORDER_WEIGHT * ord;
                    }
                }
                assign = hungarian(cost);

                // Post-filter: veto-bust to orphan.
                const VETO_COST = 1e5;
                for (let i = 0; i < N; i++) {
                    const j = assign[i];
                    if (j >= 0 && j < M && cost[i][j] >= VETO_COST) {
                        assign[i] = -1;
                        dbg(`  VETO PNG#${i} ↮ LaTeX#${j} (cost=${cost[i][j].toExponential(1)} — shape incompatible)`);
                    }
                }

                // ── Stage 2: uncrossing-swap pass.
                let swaps = 0, sweeps = 0;
                let changed = true;
                while (changed && sweeps < 8) {
                    changed = false;
                    sweeps++;
                    for (let i = 0; i < N; i++) {
                        const j = assign[i];
                        if (j < 0) continue;
                        for (let k = i + 1; k < N; k++) {
                            const l = assign[k];
                            if (l < 0) continue;
                            const cross = (pDesc[i].ny < pDesc[k].ny) !== (lDesc[j].ny < lDesc[l].ny);
                            if (!cross) continue;
                            const orig = cost[i][j] + cost[k][l];
                            const swap = cost[i][l] + cost[k][j];
                            if (swap <= orig + 1e-6) {
                                assign[i] = l;
                                assign[k] = j;
                                changed = true;
                                swaps++;
                            }
                        }
                    }
                }
                dbg(`Uncrossing: ${swaps} swap(s) over ${sweeps} sweep(s)`);

                // ── Stage 3: rescue pass on the leftover orphans.
                // Hungarian's global optimum can sacrifice perfectly-plausible
                // pairs to minimise total cost — re-run Hungarian on just the
                // orphans with RELAXED vetoes (5× elong, 20× size — was 3× /
                // 10×) and no reading-order term (orphans are by definition
                // out-of-order). Only accept pairs that still beat the relaxed
                // veto — absurd matches are still rejected.
                const pngOrphIdx = [];
                const latClaimed = new Set();
                for (let i = 0; i < N; i++) {
                    if (assign[i] < 0) pngOrphIdx.push(i);
                    else latClaimed.add(assign[i]);
                }
                const latOrphIdx = [];
                for (let j = 0; j < M; j++) if (!latClaimed.has(j)) latOrphIdx.push(j);

                if (pngOrphIdx.length && latOrphIdx.length) {
                    const REL_ELONG = Math.log(5);
                    const REL_SIZE  = Math.log(20);
                    const RN = pngOrphIdx.length, RM = latOrphIdx.length;
                    const cost2 = new Array(RN);
                    for (let pi = 0; pi < RN; pi++) {
                        cost2[pi] = new Array(RM);
                        const a = pDesc[pngOrphIdx[pi]];
                        for (let li = 0; li < RM; li++) {
                            const b = lDesc[latOrphIdx[li]];
                            const elongR = Math.abs(Math.log(a.elong / b.elong));
                            const sizeR  = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
                            let veto = 0;
                            if (elongR > REL_ELONG) veto += 1e6 * (elongR - REL_ELONG);
                            if (sizeR  > REL_SIZE)  veto += 1e6 * (sizeR  - REL_SIZE);
                            const pl = PlausibilCheck.pairPlausibility(a, b);
                            cost2[pi][li] = (1 - pl.score) + veto;
                        }
                    }
                    const assign2 = hungarian(cost2);
                    let rescued = 0;
                    for (let pi = 0; pi < RN; pi++) {
                        const li = assign2[pi];
                        if (li !== undefined && li >= 0 && li < RM
                            && cost2[pi][li] < VETO_COST) {
                            const i = pngOrphIdx[pi];
                            const j = latOrphIdx[li];
                            assign[i] = j;
                            rescued++;
                            dbg(`  RESCUE PNG#${i} → LaTeX#${j} cost=${cost2[pi][li].toFixed(2)}`);
                        }
                    }
                    dbg(`Rescue: ${rescued}/${Math.min(RN, RM)} orphan pairings found`);
                }

                // ── Stage 4: drop suspect pairs.
                // A pair below the suspect threshold (0.45) is essentially a
                // false match — clearer to the user that BOTH glyphs become
                // orphans (both get a red dashed circle) than to show a
                // misleading red match-line. Prevents the "PNG-b orphan but
                // LaTeX-b paired with junk" inconsistency.
                let dropped = 0;
                for (let i = 0; i < N; i++) {
                    const j = assign[i];
                    if (j < 0) continue;
                    const pl = PlausibilCheck.pairPlausibility(pDesc[i], lDesc[j]);
                    if (pl.score < 0.45) {
                        assign[i] = -1;
                        dropped++;
                        dbg(`  DROP-SUSPECT PNG#${i} ↮ LaTeX#${j} score=${(pl.score*100).toFixed(0)}%`);
                    }
                }
                if (dropped) dbg(`Suspect-drop: ${dropped} pair(s) dissolved → orphans`);

                // Final per-pair log.
                for (let i = 0; i < N; i++) {
                    const j = assign[i];
                    const c = (j >= 0 && j < M) ? cost[i][j].toFixed(2) : '—';
                    dbg(`  PNG#${i} → LaTeX#${j} cost=${c}`);
                }
            }

            const usedLatex = new Set();
            let nextId = 0;
            // Track id ↔ (pngOuterIdx, latexOuterIdx) so the plausibility
            // report can be indexed by matchId in renderBBoxes.
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

            // Run plausibility check on the resulting pairing — independent of
            // the cost-matrix used by Hungarian (different metric → catches
            // bad pairs that the matcher accepted just to minimise total cost).
            let plausibility = null;
            if (typeof PlausibilCheck !== 'undefined') {
                const pairing = new Array(pOuters.length).fill(-1);
                for (let oi = 0; oi < pClass.outers.length; oi++) {
                    pairing[oi] = assign[oi] === undefined ? -1 : assign[oi];
                }
                plausibility = PlausibilCheck.checkMatching(pOuters, lOuters, pairing);
                dbg(PlausibilCheck.summarize(plausibility));
                for (const m of plausibility.matches) dbg(PlausibilCheck.describeMatch(m));
                for (const o of plausibility.pngOrphans) dbg(PlausibilCheck.describeOrphan(o, 'png'));
                for (const o of plausibility.latexOrphans) dbg(PlausibilCheck.describeOrphan(o, 'latex'));
            }

            return { pngId, latId, idToPair, plausibility, pClass, lClass };
        }

        function renderBBoxes() {
            while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
            let pngContours = null;
            let latexContoursList = null;

            // ── Extract contours from both panes FIRST so we can match
            // before drawing (shared matchIds drive both colour + hover pair).
            if (pix.complete && pix.naturalWidth) {
                const pc = document.createElement('canvas');
                pc.width = pix.naturalWidth;
                pc.height = pix.naturalHeight;
                pc.getContext('2d').drawImage(pix, 0, 0);
                pngContours = extractPNGContours(pc);
            }
            if (tex.complete && tex.naturalWidth && latexCanvas) {
                const res = extractLatexContours();
                if (res && res.contours.length) latexContoursList = res.contours;
            }

            const matchInfo = computeMatchIds(pngContours, latexContoursList);
            const { pngId, latId, idToPair, plausibility } = matchInfo;
            dbg(`Hungarian: png=${pngContours?.length || 0} latex=${latexContoursList?.length || 0}`);

            // Refresh the orphan-id set so setMatchHighlight knows which mids
            // are orphans (and must skip the yellow glow on hover).
            orphanMatchIds.clear();
            for (const [id, pair] of idToPair) {
                if (pair.png < 0 || pair.lat < 0) orphanMatchIds.add(String(id));
            }

            // Centroid maps populated by drawContours — used afterwards to
            // draw cross-pane match lines (centroid PNG ↔ centroid LaTeX).
            const pngCentroids = new Map();
            const latCentroids = new Map();

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
                    const z = zoom || 1;
                    const mapFn = (x, y) => ({
                        x: (offX + x * scale - wrapRect.left) / z,
                        y: (offY + y * scale - wrapRect.top) / z,
                    });
                    drawContours(pngContours, mapFn, 'png', pngId, pngCentroids);
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
                    const z = zoom || 1;
                    const mapFn = (x, y) => ({
                        x: (offX + x * scale - wrapRect.left) / z,
                        y: (offY + y * scale - wrapRect.top) / z,
                    });
                    drawContours(latexContoursList, mapFn, 'latex', latId, latCentroids);
                }
            }

            // ── Match lines: hidden by default, only the hovered pair's line
            // is revealed (via setMatchHighlight). Solid stroke; colour =
            // palette for ok/meh, bright red for suspect (the plausibility
            // verdict still affects colour, just not visibility).
            const svgNS = 'http://www.w3.org/2000/svg';
            const z = zoom || 1;
            const verdictById = new Map();
            if (plausibility) {
                for (const m of plausibility.matches) {
                    for (const [id, pair] of idToPair) {
                        if (pair.png === m.pngIdx) {
                            verdictById.set(id, { verdict: m.verdict, score: m.score });
                            break;
                        }
                    }
                }
            }
            for (const [mid, p] of pngCentroids) {
                const l = latCentroids.get(mid);
                if (!l) continue;
                const v = verdictById.get(mid);
                const verdict = v ? v.verdict : 'ok';
                const score = v ? v.score : 1;
                const line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', p[0]);
                line.setAttribute('y1', p[1]);
                line.setAttribute('x2', l[0]);
                line.setAttribute('y2', l[1]);
                line.setAttribute('stroke', verdict === 'suspect' ? '#ff3030' : paletteColor(mid));
                line.setAttribute('stroke-width', String((verdict === 'suspect' ? 2 : 1.5) / z));
                line.setAttribute('opacity', '0.9');
                line.style.display = 'none';
                line.dataset.kind = 'match-line';
                line.dataset.matchId = String(mid);
                line.dataset.verdict = verdict;
                line.dataset.score = score.toFixed(2);
                overlay.appendChild(line);
            }
            // Orphan markers: an outer that has no partner in the other pane
            // gets a red dashed ring at its centroid. "pur nerd" indeed.
            const markOrphan = (centroidMap, mid) => {
                const c = centroidMap.get(mid);
                if (!c) return;
                const r = document.createElementNS(svgNS, 'circle');
                r.setAttribute('cx', c[0]);
                r.setAttribute('cy', c[1]);
                r.setAttribute('r', String(14 / z));
                r.setAttribute('fill', 'none');
                r.setAttribute('stroke', '#ff3030');
                r.setAttribute('stroke-width', String(2 / z));
                r.setAttribute('stroke-dasharray', `${3 / z},${3 / z}`);
                r.setAttribute('opacity', '0.85');
                r.dataset.kind = 'orphan';
                r.dataset.matchId = String(mid);
                overlay.appendChild(r);
            };
            for (const [id, pair] of idToPair) {
                if (pair.png >= 0 && pair.lat < 0) markOrphan(pngCentroids, id);
                else if (pair.lat >= 0 && pair.png < 0) markOrphan(latCentroids, id);
            }

            updateInfoBoxes(pngContours, latexContoursList);
        }

        // Coordinated setter: switch both panes to a new formula and re-render
        // the bounding boxes once BOTH images have loaded (pix from preset PNG,
        // tex from rendered LaTeX canvas data-URL).
        function setFormula(latex, presetIndex) {
            dbg(`setFormula latex="${latex}" preset=${presetIndex}`);
            tex.dataset.latex = latex;
            const latexReady = renderLatex(latex);
            const url = `presets/formula-${presetIndex}.png`;
            const pixReady = new Promise(resolve => {
                if (pix.src.endsWith(url)) { resolve(); return; }
                pix.onload = () => resolve();
                pix.onerror = () => { dbg(`PNG load FAILED: ${url}`); resolve(); };
                pix.src = url;
                pix.alt = latex;
            });
            Promise.all([latexReady, pixReady]).then(() => {
                requestAnimationFrame(() => requestAnimationFrame(renderBBoxes));
            });
        }

        // Wire up the existing formula radio grid: any change selects a new
        // formula. We read the data-latex / data-preset attributes the inline
        // markup already provides.
        function attachFormulaRadios() {
            const radios = document.querySelectorAll(
                'input[name="digit"][value^="formula-"]'
            );
            dbg(`formula radios: ${radios.length}`);
            radios.forEach(r => {
                r.addEventListener('change', () => {
                    if (!r.checked) return;
                    const latex = r.dataset.latex;
                    const preset = parseInt(r.dataset.preset, 10);
                    if (!latex || isNaN(preset)) return;
                    setFormula(latex, preset);
                });
            });
            // Pick up the currently-checked one, if any; else default.
            const checked = document.querySelector(
                'input[name="digit"][value^="formula-"]:checked'
            );
            if (checked) {
                setFormula(checked.dataset.latex, parseInt(checked.dataset.preset, 10));
            } else {
                setFormula(DEFAULT_LATEX, DEFAULT_PRESET);
            }
        }

        // The formula grid is built by the inline script in morph.html which
        // runs at parse time; by the time DOMContentLoaded fires the radios
        // exist. If we get called too early, retry.
        function tryAttach() {
            if (document.querySelector('input[name="digit"][value^="formula-"]')) {
                attachFormulaRadios();
            } else {
                setTimeout(tryAttach, 50);
            }
        }
        tryAttach();

        // ── LINIE / PUNKTE / PIXEL toggles control overlay element visibility.
        // The gray bboxes (rects) stay visible regardless.
        function applyLinesToggle() {
            const t = document.getElementById('lines-toggle');
            const show = t ? t.checked : true;
            overlay.querySelectorAll('polygon').forEach(p => {
                p.style.display = show ? '' : 'none';
            });
        }
        function applyPointsToggle() {
            const t = document.getElementById('points-toggle');
            const show = t ? t.checked : true;
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(p => {
                p.style.display = show ? '' : 'none';
            });
        }
        // PIXEL toggle: show/hide the raw PNG (handwriting) and LaTeX glyphs.
        // Vector outlines + bbox stay so the user can see contours alone.
        function applyArtToggle() {
            const t = document.getElementById('art-toggle');
            const show = t ? t.checked : true;
            pix.style.visibility = show ? '' : 'hidden';
            tex.style.visibility = show ? '' : 'hidden';
        }
        // POLYGONE FÜLLEN: show/hide the grouped fill paths emitted by
        // drawContours (one path per outer, with its holes as evenodd
        // subpaths). Per-contour stroke polygons stay unchanged.
        function applyFillToggle() {
            const t = document.getElementById('fill-toggle');
            const fill = t ? t.checked : false;
            overlay.querySelectorAll('path[data-kind="fill"]').forEach(p => {
                p.style.display = fill ? '' : 'none';
            });
        }
        function attachToggles() {
            const lt = document.getElementById('lines-toggle');
            const pt = document.getElementById('points-toggle');
            const at = document.getElementById('art-toggle');
            const ft = document.getElementById('fill-toggle');
            if (!lt || !pt || !at || !ft) { setTimeout(attachToggles, 50); return; }
            lt.addEventListener('change', applyLinesToggle);
            pt.addEventListener('change', applyPointsToggle);
            at.addEventListener('change', applyArtToggle);
            ft.addEventListener('change', applyFillToggle);
            applyLinesToggle();
            applyPointsToggle();
            applyArtToggle();
            applyFillToggle();
            dbg('lines + points + pixel + fill toggles wired');
        }
        attachToggles();

        // ── Mouse-anchored zoom ─────────────────────────────────────────────
        // The wheel anchors the zoom at the cursor: the world point under the
        // mouse stays put. Transform is applied to `wrap` (transform-origin
        // 0 0), so pix + tex + overlay all scale together — vector-effect on
        // the SVG strokes keeps the bbox lines crisp at any zoom.
        wrap.style.transformOrigin = '0 0';
        // Apply the restored zoom/pan from localStorage immediately so the
        // very first renderBBoxes sees a wrap rect that matches the current
        // zoom state. Without this, drawBBox divides by z but wrapRect is
        // still pre-transform → tiny bbox at top-left.
        if (zoom !== 1 || panX !== 0 || panY !== 0) {
            wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        }
        // wrap has pointer-events: none — wheel events fall through to host.
        host.addEventListener('wheel', (e) => {
            e.preventDefault();
            const hr = host.getBoundingClientRect();
            const mx = e.clientX - hr.left;
            const my = e.clientY - hr.top;
            const factor = Math.exp(-e.deltaY * 0.001);
            const newZoom = Math.max(1, Math.min(10, zoom * factor));
            // world point currently under the mouse:
            const wx = (mx - panX) / zoom;
            const wy = (my - panY) / zoom;
            // keep that world point under the mouse after the zoom change:
            panX = mx - newZoom * wx;
            panY = my - newZoom * wy;
            zoom = newZoom;
            saveZoomPan();
            wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
            // Counter-scale stroke width so all overlay lines stay 1 screen px.
            const sw = String(1 / zoom);
            overlay.querySelectorAll('rect, polygon, polyline, path').forEach(r => {
                r.setAttribute('stroke-width', sw);
            });
            // Counter-scale vertex dots so they stay constant screen size.
            const pr = String(2 / zoom);
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => {
                c.setAttribute('r', pr);
            });
        }, { passive: false });
        // Double-click and ESC both reset the view.
        function resetZoom() {
            zoom = 1; panX = 0; panY = 0;
            saveZoomPan();
            wrap.style.transform = '';
            overlay.querySelectorAll('rect, polygon, polyline, path').forEach(r => {
                r.setAttribute('stroke-width', '1');
            });
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => {
                c.setAttribute('r', '2');
            });
        }
        host.addEventListener('dblclick', resetZoom);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') resetZoom();
        });

        // ── Left-mouse-button pan ───────────────────────────────────────────
        // Default cursor is crosshair; switches to grabbing only while
        // actively dragging the pane.
        let dragging = false, dragStartX = 0, dragStartY = 0, panStartX = 0, panStartY = 0;
        host.style.cursor = 'crosshair';
        host.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            dragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            panStartX = panX;
            panStartY = panY;
            host.style.cursor = 'grabbing';
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            panX = panStartX + (e.clientX - dragStartX);
            panY = panStartY + (e.clientY - dragStartY);
            wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        });
        window.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            host.style.cursor = 'crosshair';
            saveZoomPan();
        });

        window.addEventListener('resize', renderBBoxes);

        // Expose redraw function for threshold slider.
        window.redrawDraw20 = renderBBoxes;

        dbg('✓ wrap appended');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
