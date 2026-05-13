// Morpheus drawing v2 — clean restart.
// Tandem display: pixel formula (preset PNG) + LaTeX rendering of the same
// formula, side-by-side with vector bounding boxes around the actual character
// pixels. Hooks into the existing formula radio grid so selecting a formula
// updates both panes.

(function () {
    const DEFAULT_LATEX = 'E=mc^2';
    const DEFAULT_PRESET = 0;
    const INK_COLOR = '#F4C430';

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
        function drawContours(contours, mapFn, label) {
            if (!contours || contours.length === 0) return;
            const svgNS = 'http://www.w3.org/2000/svg';
            const z = zoom || 1;
            const sw = String(1 / z);
            const pr = 2 / z;
            const col = (i) => (typeof regionColor === 'function')
                ? regionColor(i) : INK_COLOR;

            const mappedAll = contours.map(c =>
                (c && c.length >= 2) ? c.map(p => mapFn(p[0], p[1])) : null
            );

            const classified = (typeof classifyContours === 'function')
                ? classifyContours(contours)
                : { outers: contours.map((_, i) => ({ idx: i, holes: [] })), holes: [] };

            // Build matchId: outer's matchId = its position in outers list;
            // holes inherit their parent outer's matchId.
            const matchId = new Array(contours.length).fill(-1);
            for (let oi = 0; oi < classified.outers.length; oi++) {
                const outer = classified.outers[oi];
                matchId[outer.idx] = oi;
                for (const hi of outer.holes) matchId[hi] = oi;
            }

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
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', d);
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('fill', col(outer.idx));
                path.setAttribute('stroke', 'none');
                path.dataset.kind = 'fill';
                path.dataset.source = label;
                path.dataset.matchId = String(oi);
                overlay.appendChild(path);
            }

            // ── STROKE + POINTS: one polygon + N circles per contour.
            let totalVerts = 0;
            for (let i = 0; i < contours.length; i++) {
                const mapped = mappedAll[i];
                if (!mapped) continue;
                const colour = col(i);
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
                poly.style.cursor = 'pointer';
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

        // Cross-pane region highlighting. Three visual hits so the highlight
        // is visible regardless of which toggles are on:
        //   • polygon stroke thickens to 3× (visible when LINIE is on)
        //   • vertex circles enlarge (visible when PUNKTE is on)
        //   • fill path gets a thick white halo stroke (visible when FÜLLEN is
        //     on — the polygon's own stroke is the same colour as the fill
        //     underneath, so a contrasting halo is needed to see it).
        function setMatchHighlight(matchId, on) {
            if (matchId === undefined || matchId === '' || matchId === '-1') return;
            const z = zoom || 1;
            overlay.querySelectorAll(
                `polygon[data-match-id="${matchId}"]`
            ).forEach(p => {
                p.setAttribute('stroke-width', String((on ? 3 : 1) / z));
            });
            overlay.querySelectorAll(
                `circle[data-kind="point"][data-match-id="${matchId}"]`
            ).forEach(c => {
                c.setAttribute('r', String((on ? 4 : 2) / z));
            });
            overlay.querySelectorAll(
                `path[data-kind="fill"][data-match-id="${matchId}"]`
            ).forEach(p => {
                if (on) {
                    p.setAttribute('stroke', '#fff');
                    p.setAttribute('stroke-width', String(4 / z));
                } else {
                    p.setAttribute('stroke', 'none');
                    p.removeAttribute('stroke-width');
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
            const valid = mid && mid !== '-1';
            const next = (e.type === 'mouseover' && valid) ? mid : null;
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

        function renderBBoxes() {
            while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
            let pngContours = null;
            let latexContoursList = null;

            // ── PNG (engine: user-draw.js extractOutline) ─────────────────
            if (pix.complete && pix.naturalWidth) {
                const bbox = computeImageBBox(pix);
                if (bbox) drawBBox(mapImageBBoxToViewport(pix, bbox), 'png');

                const pc = document.createElement('canvas');
                pc.width = pix.naturalWidth;
                pc.height = pix.naturalHeight;
                pc.getContext('2d').drawImage(pix, 0, 0);
                pngContours = extractPNGContours(pc);
                if (pngContours.length) {
                    // Map source-pixel coords through object-fit:contain
                    // scaling, then through the wrap-local conversion.
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
                    drawContours(pngContours, mapFn, 'png');
                }
            }

            // ── LaTeX: tex img sources from latexCanvas (same canvas the
            // contours come from). Use the same PNG-style mapping so display
            // and contours share one coordinate system → perfect alignment.
            if (tex.complete && tex.naturalWidth && latexCanvas) {
                // BBox via alpha channel (matches canvasToGridAlpha used by
                // contour extraction so the rectangle and the contours share
                // exactly the same definition of "ink").
                const bbox = computeContentBBox(latexCanvas, 'alpha');
                if (bbox) drawBBox(mapImageBBoxToViewport(tex, bbox), 'latex');

                const res = extractLatexContours();
                if (res && res.contours.length) {
                    latexContoursList = res.contours;
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
                    drawContours(latexContoursList, mapFn, 'latex');
                }
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
        let dragging = false, dragStartX = 0, dragStartY = 0, panStartX = 0, panStartY = 0;
        host.style.cursor = 'grab';
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
            host.style.cursor = 'grab';
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
