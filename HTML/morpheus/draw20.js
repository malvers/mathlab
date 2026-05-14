// Morpheus drawing v2 — clean restart.
// Tandem display: pixel formula (preset PNG) + LaTeX rendering of the same
// formula, side-by-side with vector bounding boxes around the actual character
// pixels. Hooks into the existing formula radio grid so selecting a formula
// updates both panes.

(function () {
    const DEFAULT_LATEX = 'E=mc^2';
    const DEFAULT_PRESET = 0;
    const INK_COLOR = '#F4C430';
    // 20 maximally-distinguishable colours — RED-FREE on purpose so orphans
    // (rendered in a saturated knallrot with glow) cannot be confused with
    // any paired-region colour. Indexed by matchId — PNG outer #N and LaTeX
    // outer #N share the same palette slot, so paired regions match in hue.
    const REGION_PALETTE = [
        '#3cb44b', // green
        '#4363d8', // blue
        '#f58231', // orange
        '#911eb4', // purple
        '#42d4f4', // cyan
        '#f032e6', // magenta
        '#bfef45', // lime
        '#469990', // teal
        '#dcbeff', // lavender
        '#9A6324', // brown
        '#aaffc3', // mint
        '#808000', // olive
        '#ffd8b1', // apricot
        '#E040FB', // bright violet (replaces navy — too close to dark-blue bg)
        '#a9a9a9', // gray
        '#1abc9c', // turquoise
        '#7B68EE', // slate blue (replaces red)
        '#A1887F', // light warm brown (replaces maroon)
        '#85C1E9', // sky blue (replaces pumpkin)
        '#3D9970', // forest green (replaces pink)
    ];
    const ORPHAN_COLOR = '#FF1744';
    const ORPHAN_GLOW = 'drop-shadow(0 0 3px #FF1744)';
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

        // Most-recent render data — populated by renderBBoxes, consumed by
        // openPolygonRing (the extra-window diagnostic view).
        let lastRenderData = null;

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
        // Dedicated layer for the morph (interpolated polygons between PNG
        // and LaTeX matched pairs). Appended early so it sits BELOW the
        // outline/point/match-line elements drawn by drawContours.
        const morphLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        morphLayer.id = 'morph-layer';
        overlay.appendChild(morphLayer);
        // Single delegated hover listener for the whole overlay — handles
        // both <polygon> outlines and <path> fills via e.target.dataset.
        // mouseover / mouseout bubble (unlike mouseenter / mouseleave) so a
        // single listener at the parent catches every child transition.
        overlay.addEventListener('mouseover', onOverlayHover);
        overlay.addEventListener('mouseout', onOverlayHover);

        // ── Stift: eigene Zeichenfläche (entkoppelt vom Legacy-draw-canvas) ─
        // Strokes werden in normalisierten [0,1]-Koordinaten gespeichert, damit
        // sie mit Wrap-Resizing skalieren. localStorage-Persistenz für Reload.
        const stiftCanvas = document.createElement('canvas');
        stiftCanvas.id = 'draw20-stift';
        stiftCanvas.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 12;
            pointer-events: none;
            touch-action: none;
        `;
        wrap.appendChild(stiftCanvas);
        const stiftCtx = stiftCanvas.getContext('2d');

        let strokes = [];
        let curStroke = null;
        let drawingNow = false;
        let stiftEnabled = false;
        try {
            const j = localStorage.getItem('draw20-strokes');
            if (j) strokes = JSON.parse(j) || [];
        } catch (_) {}
        try {
            stiftEnabled = localStorage.getItem('draw20-stift-enabled') === '1';
        } catch (_) {}

        // Undo/Redo: Snapshot-Stack der strokes-Arrays. Index zeigt auf
        // aktuellen Zustand. Neue Aktion truncatet alle „Future"-Snapshots
        // (klassische Linear-History).
        const strokeHistory = [snapshotStrokesNow()];
        let historyIdx = 0;
        const MAX_HISTORY = 50;
        function snapshotStrokesNow() {
            return strokes.map(s => ({
                points: s.points.map(p => ({ nx: p.nx, ny: p.ny })),
                width: s.width,
                mode: s.mode,
            }));
        }
        function pushHistory() {
            if (historyIdx < strokeHistory.length - 1) {
                strokeHistory.length = historyIdx + 1;
            }
            strokeHistory.push(snapshotStrokesNow());
            if (strokeHistory.length > MAX_HISTORY) {
                strokeHistory.shift();
            } else {
                historyIdx++;
            }
        }
        function applyHistorySnapshot() {
            const snap = strokeHistory[historyIdx];
            strokes = snap.map(s => ({
                points: s.points.map(p => ({ nx: p.nx, ny: p.ny })),
                width: s.width,
                mode: s.mode,
            }));
            curStroke = null;
            drawingNow = false;
            redrawStift();
            persistStrokes();
            // Outlines: wenn aktiv und Striche da → re-extract; wenn keine
            // Striche mehr aber noch alte Outlines → wegräumen.
            const active = (() => { try { return localStorage.getItem('draw20-outlines-active') === '1'; } catch (_) { return false; } })();
            if (active && strokes.length > 0 && typeof extractStiftOutlines === 'function') {
                extractStiftOutlines();
            } else if (typeof stiftContours !== 'undefined' && stiftContours && typeof clearStiftOutlines === 'function') {
                clearStiftOutlines();
            }
        }
        function undo() {
            if (historyIdx <= 0) return;
            historyIdx--;
            applyHistorySnapshot();
            dbg(`↶ undo (idx=${historyIdx}/${strokeHistory.length - 1})`);
        }
        function redo() {
            if (historyIdx >= strokeHistory.length - 1) return;
            historyIdx++;
            applyHistorySnapshot();
            dbg(`↷ redo (idx=${historyIdx}/${strokeHistory.length - 1})`);
        }

        function persistStrokes() {
            try { localStorage.setItem('draw20-strokes', JSON.stringify(strokes)); } catch (_) {}
        }
        function redrawStift() {
            const w = stiftCanvas.width, h = stiftCanvas.height;
            const dpr = window.devicePixelRatio || 1;
            stiftCtx.clearRect(0, 0, w, h);
            for (const s of strokes) {
                if (!s.points || s.points.length < 1) continue;
                stiftCtx.globalCompositeOperation = (s.mode === 'eraser') ? 'destination-out' : 'source-over';
                stiftCtx.strokeStyle = '#F4C430';
                stiftCtx.fillStyle = '#F4C430';
                stiftCtx.lineCap = 'round';
                stiftCtx.lineJoin = 'round';
                stiftCtx.lineWidth = (s.width || 6) * dpr;
                if (s.points.length === 1) {
                    const p = s.points[0];
                    stiftCtx.beginPath();
                    stiftCtx.arc(p.nx * w, p.ny * h, ((s.width || 6) * dpr) / 2, 0, Math.PI * 2);
                    stiftCtx.fill();
                } else {
                    stiftCtx.beginPath();
                    stiftCtx.moveTo(s.points[0].nx * w, s.points[0].ny * h);
                    for (let i = 1; i < s.points.length; i++) {
                        stiftCtx.lineTo(s.points[i].nx * w, s.points[i].ny * h);
                    }
                    stiftCtx.stroke();
                }
            }
            stiftCtx.globalCompositeOperation = 'source-over';
        }
        function resizeStift() {
            const r = wrap.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            stiftCanvas.width = Math.max(1, Math.round(r.width * dpr));
            stiftCanvas.height = Math.max(1, Math.round(r.height * dpr));
            redrawStift();
            // Outline-Polygone leben in canvas-Pixel-Koordinaten — nach Resize
            // ist die Pixel-Skala anders. Re-extract aus den frisch gezeichneten
            // Strichen, sonst landen die Outlines an falscher Stelle.
            if (stiftContours && typeof extractStiftOutlines === 'function') {
                extractStiftOutlines();
            }
        }
        function clearStrokes() {
            strokes = [];
            curStroke = null;
            drawingNow = false;
            redrawStift();
            persistStrokes();
            // Leeren Zustand in die History pushen → Cmd+Z stellt
            // den vor-Lösch-Zustand wieder her.
            pushHistory();
            // Stale-Outlines mit-ausräumen (gehörten zu den jetzt weg-radierten
            // Strichen). `clearStiftOutlines` ist später im Init definiert; bei
            // tatsächlichem Aufruf via Button längst vorhanden.
            if (typeof clearStiftOutlines === 'function') clearStiftOutlines();
            dbg('strokes cleared');
        }
        function ptFromEvent(e) {
            const r = stiftCanvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            return { nx: (cx - r.left) / r.width, ny: (cy - r.top) / r.height };
        }
        function onStiftDown(e) {
            if (!stiftEnabled) return;
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault();
            drawingNow = true;
            const sw = document.getElementById('stroke-slider');
            curStroke = {
                points: [ptFromEvent(e)],
                width: sw ? +sw.value : 6,
                mode: 'pen',
            };
            strokes.push(curStroke);
            redrawStift();
        }
        function onStiftMove(e) {
            if (!drawingNow || !curStroke) return;
            e.preventDefault();
            curStroke.points.push(ptFromEvent(e));
            redrawStift();
        }
        function onStiftUp() {
            if (!drawingNow) return;
            drawingNow = false;
            curStroke = null;
            persistStrokes();
            // Strich abgeschlossen → in die History pushen.
            pushHistory();
        }
        stiftCanvas.addEventListener('mousedown', onStiftDown);
        window.addEventListener('mousemove', onStiftMove);
        window.addEventListener('mouseup', onStiftUp);
        stiftCanvas.addEventListener('touchstart', onStiftDown, { passive: false });
        stiftCanvas.addEventListener('touchmove', onStiftMove, { passive: false });
        stiftCanvas.addEventListener('touchend', onStiftUp);

        // Cmd/Ctrl+Z = Undo, Cmd/Ctrl+Shift+Z = Redo (klassisch).
        // capture:true damit's vor anderen Handlern feuert; ignoriere wenn
        // Fokus in einem Input/Textarea ist (z.B. Text-Input für LaTeX).
        document.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (!(e.metaKey || e.ctrlKey)) return;
            if (e.key === 'z' || e.key === 'Z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
        }, true);

        function applyStiftState() {
            stiftCanvas.style.pointerEvents = stiftEnabled ? 'auto' : 'none';
            stiftCanvas.style.cursor = stiftEnabled ? 'crosshair' : 'default';
            const icon = document.getElementById('draw-toggle');
            if (icon) icon.style.opacity = stiftEnabled ? '1' : '0.35';
        }
        // Eigene Click-Listener für Stift-Toggle + LÖSCHEN — kein Hook auf
        // window.onDrawToggle / window.clearDraw. Legacy-Handler (falls geladen)
        // laufen parallel an versteckten Canvases — schaden nicht.
        const stiftTglBtn = document.getElementById('draw-toggle');
        if (stiftTglBtn) {
            stiftTglBtn.addEventListener('click', () => {
                stiftEnabled = !stiftEnabled;
                try { localStorage.setItem('draw20-stift-enabled', stiftEnabled ? '1' : '0'); } catch (_) {}
                applyStiftState();
            });
        }
        const stiftClearBtn = document.querySelector('button.cyber-btn[onclick*="clearDraw"]');
        if (stiftClearBtn) stiftClearBtn.addEventListener('click', clearStrokes);

        applyStiftState();
        requestAnimationFrame(() => {
            resizeStift();
            // Outlines beim Reload wiederherstellen: wenn beim letzten Klick
            // auf OUTLINES GENERIEREN das Flag gesetzt wurde UND noch Striche
            // im Canvas sind, automatisch neu extrahieren. (Re-extract aus den
            // frisch gemalten Pixeln ist günstiger als die Kontur-Daten zu
            // persistieren — und vermeidet Skalierungs-Drift bei anderer
            // Fenstergröße.)
            try {
                if (localStorage.getItem('draw20-outlines-active') === '1' && strokes.length > 0
                    && typeof extractStiftOutlines === 'function') {
                    extractStiftOutlines();
                }
            } catch (_) {}
        });
        window.addEventListener('resize', resizeStift);

        // ── Stift-Outlines: gleiche Pipeline wie extractPNGContours ─────────
        // Klickt der User OUTLINES GENERIEREN, lese ich die stiftCanvas-Pixel,
        // jage sie durch dieselbe Extraktion (red-Threshold + morphClose +
        // getContoursWithHoles + Area-Filter + rdp(eps)) und rendere die
        // Outer-Polygone (paletteColor) + Holes (hellblau) in ein eigenes
        // SVG-Layer oberhalb der Striche. Stroke-Width/Dot-Radius werden mit
        // /zoom skaliert, damit sie im Zoom konstant dünn bleiben.
        const stiftOutlineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        stiftOutlineSvg.id = 'draw20-stift-outlines';
        stiftOutlineSvg.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 13;
            pointer-events: none;
        `;
        wrap.appendChild(stiftOutlineSvg);

        let stiftContours = null;

        function renderStiftOutlines() {
            while (stiftOutlineSvg.firstChild) stiftOutlineSvg.removeChild(stiftOutlineSvg.firstChild);
            if (!stiftContours || stiftContours.length === 0) return;
            const z = zoom || 1;
            // stift natural pixel → wrap pre-transform CSS. Verhältnis kommt
            // direkt aus offsetWidth (= pre-transform) / canvas.width
            // (= natural). Damit ist die Skala unabhängig vom aktuellen Zoom
            // — wichtig, weil sich canvas.width nur bei resize ändert, der
            // Zoom aber kontinuierlich variieren kann.
            const sx = wrap.offsetWidth / Math.max(1, stiftCanvas.width);
            const sy = wrap.offsetHeight / Math.max(1, stiftCanvas.height);
            const mapXY = (x, y) => [x * sx, y * sy];
            const cls = (typeof classifyContours === 'function')
                ? classifyContours(stiftContours)
                : { outers: stiftContours.map((_, i) => ({ idx: i, holes: [] })), holes: [] };
            const svgNS = 'http://www.w3.org/2000/svg';
            const sw = String(1.5 / z);
            const dotR = (2 / z).toFixed(2);
            const dash = `${(3 / z).toFixed(2)} ${(3 / z).toFixed(2)}`;

            const ptsOf = (poly) => poly.map(p => {
                const [x, y] = mapXY(p[0], p[1]);
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(' ');
            const subpathOf = (poly) => {
                let s = '';
                const m = mapXY(poly[0][0], poly[0][1]);
                s += `M ${m[0].toFixed(2)} ${m[1].toFixed(2)}`;
                for (let i = 1; i < poly.length; i++) {
                    const q = mapXY(poly[i][0], poly[i][1]);
                    s += ` L ${q[0].toFixed(2)} ${q[1].toFixed(2)}`;
                }
                return s + ' Z';
            };

            cls.outers.forEach((o, i) => {
                const color = paletteColor(i);
                const outerPoly = stiftContours[o.idx];
                if (!outerPoly || outerPoly.length < 2) return;

                // ── FÜLLEN: outer + holes als evenodd-Subpfad. fill-opacity
                // 0.35 damit die gelben Striche darunter noch durchscheinen.
                const fillParts = [outerPoly, ...o.holes.map(hi => stiftContours[hi]).filter(Boolean)];
                const d = fillParts.map(subpathOf).join(' ');
                const fillPath = document.createElementNS(svgNS, 'path');
                fillPath.setAttribute('d', d);
                fillPath.setAttribute('fill-rule', 'evenodd');
                fillPath.setAttribute('fill', color);
                fillPath.setAttribute('fill-opacity', '0.35');
                fillPath.setAttribute('stroke', 'none');
                fillPath.dataset.kind = 'fill';
                fillPath.dataset.source = 'stift';
                stiftOutlineSvg.appendChild(fillPath);

                // ── LINIE: Outer-Polygon (durchgezogen) in Palette-Farbe.
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', ptsOf(outerPoly));
                poly.setAttribute('fill', 'none');
                poly.setAttribute('stroke', color);
                poly.setAttribute('stroke-width', sw);
                poly.setAttribute('stroke-linejoin', 'round');
                poly.dataset.source = 'stift';
                stiftOutlineSvg.appendChild(poly);

                // ── PUNKTE: Vertex-Dots.
                for (const p of outerPoly) {
                    const [x, y] = mapXY(p[0], p[1]);
                    const c = document.createElementNS(svgNS, 'circle');
                    c.setAttribute('cx', x.toFixed(2));
                    c.setAttribute('cy', y.toFixed(2));
                    c.setAttribute('r', dotR);
                    c.setAttribute('fill', color);
                    c.dataset.kind = 'point';
                    c.dataset.source = 'stift';
                    stiftOutlineSvg.appendChild(c);
                }

                // Holes: hellblau gestrichelt + ihre Vertex-Dots
                for (const hi of o.holes) {
                    const holePoly = stiftContours[hi];
                    if (!holePoly || holePoly.length < 2) continue;
                    const hp = document.createElementNS(svgNS, 'polygon');
                    hp.setAttribute('points', ptsOf(holePoly));
                    hp.setAttribute('fill', 'none');
                    hp.setAttribute('stroke', '#9ad6ff');
                    hp.setAttribute('stroke-width', sw);
                    hp.setAttribute('stroke-linejoin', 'round');
                    hp.setAttribute('stroke-dasharray', dash);
                    hp.dataset.source = 'stift';
                    stiftOutlineSvg.appendChild(hp);
                    for (const p of holePoly) {
                        const [x, y] = mapXY(p[0], p[1]);
                        const c = document.createElementNS(svgNS, 'circle');
                        c.setAttribute('cx', x.toFixed(2));
                        c.setAttribute('cy', y.toFixed(2));
                        c.setAttribute('r', dotR);
                        c.setAttribute('fill', '#9ad6ff');
                        c.dataset.kind = 'point';
                        c.dataset.source = 'stift';
                        stiftOutlineSvg.appendChild(c);
                    }
                }
            });

            // Aktuellen Schalterstand sofort anwenden, sonst sind frisch
            // gerenderte Elemente immer sichtbar — egal was die Toggles sagen.
            if (typeof applyLinesToggle === 'function') applyLinesToggle();
            if (typeof applyPointsToggle === 'function') applyPointsToggle();
            if (typeof applyFillToggle === 'function') applyFillToggle();
            if (typeof applyArtToggle === 'function') applyArtToggle();
            dbg(`stift outlines rendered: ${cls.outers.length} outer + ${cls.holes.length} hole(s)`);
        }

        function extractStiftOutlines() {
            if (typeof extractPNGContours !== 'function') {
                dbg('✗ extractPNGContours unavailable (modul fehlt)');
                return;
            }
            stiftContours = extractPNGContours(stiftCanvas) || [];
            dbg(`▶ stift extract: ${stiftContours.length} contour(s)`);
            renderStiftOutlines();
            // Outlines-Status persistieren, damit beim Reload automatisch
            // wieder extrahiert wird.
            try { localStorage.setItem('draw20-outlines-active', '1'); } catch (_) {}
            // Morph-Pairs für stift↔LaTeX bauen (falls eine LaTeX-Pane
            // bereits gerendert ist). Danach renderMorph mit aktuellem Slider,
            // damit eine bereits gesetzte t-Position sofort die neue Quelle nutzt.
            if (typeof buildStiftMorphPairs === 'function') buildStiftMorphPairs();
            const sl = document.getElementById('morph-slider');
            if (sl && typeof renderMorph === 'function') renderMorph(+sl.value / 100);
        }

        function clearStiftOutlines() {
            stiftContours = null;
            while (stiftOutlineSvg.firstChild) stiftOutlineSvg.removeChild(stiftOutlineSvg.firstChild);
            try { localStorage.removeItem('draw20-outlines-active'); } catch (_) {}
            // Stift-Morph aus — Fallback auf PNG↔LaTeX.
            if (typeof stiftMorphPairs !== 'undefined') stiftMorphPairs.length = 0;
            // Crossfade-Reste am stiftCanvas zurücksetzen, sonst bleibt es bei
            // 0.5 stehen vom letzten Stift-Morph.
            stiftCanvas.style.opacity = '';
            const sl = document.getElementById('morph-slider');
            if (sl && typeof renderMorph === 'function') renderMorph(+sl.value / 100);
            dbg('stift outlines cleared');
        }

        // Buttons hängen (legacy onclick im Markup läuft parallel ins Leere/
        // an versteckte Canvases, schadet nicht):
        const stiftExtractBtn = document.querySelector('button.cyber-btn[onclick*="extractOutline"]');
        if (stiftExtractBtn) stiftExtractBtn.addEventListener('click', extractStiftOutlines);
        const stiftClearOutBtn = document.querySelector('button.cyber-btn[onclick*="clearOutline"]');
        if (stiftClearOutBtn) stiftClearOutBtn.addEventListener('click', clearStiftOutlines);

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
        // `pointsOut` (optional Map<matchId, mapped-point-array>) stores the
        // wrap-local point array per outer — used by renderMorph() for the
        // pair-wise interpolation between PNG and LaTeX matched outers.
        function drawContours(contours, mapFn, label, matchIdByContour, centroidsOut, pointsOut) {
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
            const isOrphanMid = (mid) => mid >= 0 && orphanMatchIds.has(String(mid));
            const colourOf = (i) => {
                const mid = matchId[i];
                if (mid < 0) return INK_COLOR;
                return isOrphanMid(mid) ? ORPHAN_COLOR : paletteColor(mid);
            };

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
                const orphan = isOrphanMid(mid);
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', d);
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('fill', orphan ? ORPHAN_COLOR : paletteColor(mid));
                path.setAttribute('stroke', 'none');
                if (orphan) path.style.filter = ORPHAN_GLOW;
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
            }

            // ── STROKE + POINTS: one polygon + N circles per contour.
            let totalVerts = 0;
            for (let i = 0; i < contours.length; i++) {
                const mapped = mappedAll[i];
                if (!mapped) continue;
                const mid = matchId[i];
                const orphan = isOrphanMid(mid);
                const colour = colourOf(i);
                const pts = mapped.map(m => `${m.x},${m.y}`).join(' ');
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', pts);
                poly.setAttribute('fill', 'none');
                poly.setAttribute('stroke', colour);
                poly.setAttribute('stroke-width', sw);
                poly.setAttribute('stroke-linejoin', 'round');
                if (orphan) poly.style.filter = ORPHAN_GLOW;
                poly.dataset.source = label;
                poly.dataset.matchId = String(mid);
                poly.style.pointerEvents = 'all';
                overlay.appendChild(poly);

                for (const m of mapped) {
                    const dot = document.createElementNS(svgNS, 'circle');
                    dot.setAttribute('cx', m.x);
                    dot.setAttribute('cy', m.y);
                    dot.setAttribute('r', pr);
                    dot.setAttribute('fill', colour);
                    if (orphan) dot.style.filter = ORPHAN_GLOW;
                    dot.dataset.kind = 'point';
                    dot.dataset.source = label;
                    dot.dataset.matchId = String(mid);
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

        // Master switch — when false, Hungarian / vetoes / uncrossing /
        // rescue / suspect-drop are all bypassed. Each PNG and LaTeX outer
        // gets its own unique id (no cross-pane pairing) and renders with
        // a unique palette colour. Used to verify that every character is
        // detected and contour-extracted, without matching artefacts.
        const MATCHING_ENABLED = true;

        // Build per-contour matchId arrays. When MATCHING_ENABLED, the cost
        // matrix uses the same shape descriptors (size / elongation / position
        // / fuzz) as plausibilcheck.js with hard vetoes for impossible pairs
        // — Hungarian + uncrossing + rescue + suspect-drop refine until stable.
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
            if (MATCHING_ENABLED
                && pOuters.length && lOuters.length
                && typeof PlausibilCheck !== 'undefined'
                && typeof hungarian === 'function') {
                const pBB = PlausibilCheck.equationBBox(pOuters);
                const lBB = PlausibilCheck.equationBBox(lOuters);
                // Pass each outer's HOLE polygons too — the descriptor needs
                // them for hole-count / hole-area-fraction features.
                pDesc = pClass.outers.map(o => PlausibilCheck.shapeDescriptor(
                    png[o.idx],
                    (o.holes || []).map(hi => png[hi]).filter(Boolean),
                    pBB));
                lDesc = lClass.outers.map(o => PlausibilCheck.shapeDescriptor(
                    lat[o.idx],
                    (o.holes || []).map(hi => lat[hi]).filter(Boolean),
                    lBB));
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
                            // Detect crossings on EITHER axis: X-order
                            // inversion (formula left-to-right reading flow)
                            // OR Y-order inversion (vertical structures like
                            // fractions). Either is a strong indicator that
                            // the two pairs are swapped.
                            const crossX = (pDesc[i].nx < pDesc[k].nx) !== (lDesc[j].nx < lDesc[l].nx);
                            const crossY = (pDesc[i].ny < pDesc[k].ny) !== (lDesc[j].ny < lDesc[l].ny);
                            if (!crossX && !crossY) continue;
                            // Only refuse the swap when it would create a
                            // veto-level pair (cost ≥ 1e5 — fundamentally
                            // incompatible shapes). For ALL other cases
                            // accept it — Hungarian is globally optimal so a
                            // local swap inevitably raises total cost, but
                            // crossings are a stronger reading-order signal
                            // than tiny cost deltas. No cost cap.
                            if (cost[i][l] >= VETO_COST || cost[k][j] >= VETO_COST) continue;
                            assign[i] = l;
                            assign[k] = j;
                            changed = true;
                            swaps++;
                            // First-iteration spotlight on the swap that
                            // fixed something (helps verify in debug).
                            if (sweeps === 1 && swaps <= 4) {
                                dbg(`  SWAP PNG#${i}↔LaTeX#${l} & PNG#${k}↔LaTeX#${j} (was: ${j},${l}) crossX=${crossX} crossY=${crossY}`);
                            }
                        }
                    }
                }
                dbg(`Uncrossing: ${swaps} swap(s) over ${sweeps} sweep(s)`);

                // ── Stages 3 + 4 iterated until stable.
                //
                // Stage 3: RESCUE — re-run Hungarian on remaining orphans
                //   with RELAXED vetoes (5× elong, 20× size, no order term).
                //   Catches good pairs Hungarian sacrificed for global cost.
                //
                // Stage 4: SUSPECT-DROP — break any pair whose plausibility
                //   score falls below 0.55. Both glyphs become orphans →
                //   visible as red dashed circles, no misleading match-line.
                //
                // Iterate (rescue → drop → rescue → drop ...) until no
                // assignment changes. Each suspect-drop frees up a LaTeX
                // outer that the next rescue might pair with a previously
                // orphaned PNG (the b-orphan / b-claimed-by-junk inversion).
                const SUSPECT_THRESHOLD = 0.55;
                const REL_ELONG = Math.log(5);
                const REL_SIZE  = Math.log(20);

                function runRescue() {
                    const pngOrphIdx = [], latClaimed = new Set();
                    for (let i = 0; i < N; i++) {
                        if (assign[i] < 0) pngOrphIdx.push(i);
                        else latClaimed.add(assign[i]);
                    }
                    const latOrphIdx = [];
                    for (let j = 0; j < M; j++) if (!latClaimed.has(j)) latOrphIdx.push(j);
                    if (!pngOrphIdx.length || !latOrphIdx.length) return 0;

                    const RN = pngOrphIdx.length, RM = latOrphIdx.length;
                    const cost2 = new Array(RN);
                    for (let pi = 0; pi < RN; pi++) {
                        cost2[pi] = new Array(RM);
                        const a = pDesc[pngOrphIdx[pi]];
                        for (let li = 0; li < RM; li++) {
                            const b = lDesc[latOrphIdx[li]];
                            const elongR = Math.abs(Math.log(a.elong / b.elong));
                            const sizeR  = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
                            const dh = Math.abs(a.holes - b.holes);
                            const dmY = Math.abs(a.massY - b.massY);
                            const dmX = Math.abs(a.massX - b.massX);
                            let veto = 0;
                            if (elongR > REL_ELONG) veto += 1e6 * (elongR - REL_ELONG);
                            if (sizeR  > REL_SIZE)  veto += 1e6 * (sizeR  - REL_SIZE);
                            if (dh >= 2)            veto += 1e6 * (dh - 1);
                            if (dmY > 0.9)          veto += 1e6 * (dmY - 0.9);
                            if (dmX > 1.3)          veto += 1e6 * (dmX - 1.3);
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
                            const a = pDesc[pngOrphIdx[pi]];
                            const b = lDesc[latOrphIdx[li]];
                            const pl = PlausibilCheck.pairPlausibility(a, b);
                            if (pl.score >= SUSPECT_THRESHOLD) {
                                assign[pngOrphIdx[pi]] = latOrphIdx[li];
                                rescued++;
                                dbg(`  RESCUE PNG#${pngOrphIdx[pi]} → LaTeX#${latOrphIdx[li]} score=${(pl.score*100).toFixed(0)}%`);
                            }
                        }
                    }
                    return rescued;
                }

                function runSuspectDrop() {
                    let dropped = 0;
                    for (let i = 0; i < N; i++) {
                        const j = assign[i];
                        if (j < 0) continue;
                        const pl = PlausibilCheck.pairPlausibility(pDesc[i], lDesc[j]);
                        if (pl.score < SUSPECT_THRESHOLD) {
                            assign[i] = -1;
                            dropped++;
                            dbg(`  DROP-SUSPECT PNG#${i} ↮ LaTeX#${j} score=${(pl.score*100).toFixed(0)}%`);
                        }
                    }
                    return dropped;
                }

                let iter = 0, totalRescued = 0, totalDropped = 0;
                while (iter < 5) {
                    iter++;
                    const dropped = runSuspectDrop();
                    const rescued = runRescue();
                    totalDropped += dropped;
                    totalRescued += rescued;
                    if (dropped === 0 && rescued === 0) break;
                }
                dbg(`Refine-loop: ${iter} iter(s), ${totalRescued} rescued, ${totalDropped} dropped`);
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

            // Run plausibility check on the resulting pairing — using the
            // SAME descriptors the cost matrix used. Verdicts are reported
            // for diagnostics and used for line styling.
            let plausibility = null;
            if (typeof PlausibilCheck !== 'undefined' && pDesc.length) {
                const pairing = new Array(pOuters.length).fill(-1);
                for (let oi = 0; oi < pClass.outers.length; oi++) {
                    pairing[oi] = assign[oi] === undefined ? -1 : assign[oi];
                }
                plausibility = PlausibilCheck.checkMatching(pOuters, lOuters, pairing, pDesc, lDesc);
                dbg(PlausibilCheck.summarize(plausibility));
                // Only dump suspect matches + orphans (the actionable ones).
                for (const m of plausibility.matches) {
                    if (m.verdict !== 'ok') dbg(PlausibilCheck.describeMatch(m));
                }
                for (const o of plausibility.pngOrphans) dbg(PlausibilCheck.describeOrphan(o, 'png'));
                for (const o of plausibility.latexOrphans) dbg(PlausibilCheck.describeOrphan(o, 'latex'));
            }

            return { pngId, latId, idToPair, plausibility, pClass, lClass };
        }

        // ── Polygon-Ring diagnostic view ───────────────────────────────────
        // Opens a separate window showing every PNG and LaTeX OUTER polygon
        // arranged around a circle. Each slot has its label (PNG#N / LaTeX#M),
        // matchId (= shared colour), and plausibility score for paired ones.
        // Orphans get a red dashed border. Holes are rendered inside their
        // outer so the shape reads correctly.
        function openPolygonRing() {
            if (!lastRenderData) {
                alert('Noch keine Polygon-Daten — bitte erst eine Formel laden.');
                return;
            }
            const { pngContours, latexContours, pClass, lClass,
                    pngId, latId, idToPair, plausibility,
                    pngDisplayScale, latDisplayScale } = lastRenderData;

            // Build a flat list of items {polys, matchId, label, score, orphan}.
            const items = [];
            const orphanLookup = new Set();
            // Skip orphan tagging when matching is off — every outer would
            // otherwise be flagged as "no partner" and render bright red.
            if (MATCHING_ENABLED) {
                for (const [id, pair] of idToPair) {
                    if (pair.png < 0 || pair.lat < 0) orphanLookup.add(id);
                }
            }
            const scoreById = new Map();
            if (plausibility) {
                for (const m of plausibility.matches) {
                    for (const [id, pair] of idToPair) {
                        if (pair.png === m.pngIdx) {
                            scoreById.set(id, { score: m.score, verdict: m.verdict });
                            break;
                        }
                    }
                }
            }

            if (pngContours && pClass) {
                for (let oi = 0; oi < pClass.outers.length; oi++) {
                    const o = pClass.outers[oi];
                    const id = pngId[o.idx];
                    items.push({
                        outer: pngContours[o.idx],
                        holes: (o.holes || []).map(hi => pngContours[hi]).filter(Boolean),
                        label: `P${oi}`,
                        matchId: id,
                        score: scoreById.get(id),
                        orphan: orphanLookup.has(id) && idToPair.get(id).lat < 0,
                    });
                }
            }
            if (latexContours && lClass) {
                for (let oi = 0; oi < lClass.outers.length; oi++) {
                    const o = lClass.outers[oi];
                    const id = latId[o.idx];
                    items.push({
                        outer: latexContours[o.idx],
                        holes: (o.holes || []).map(hi => latexContours[hi]).filter(Boolean),
                        label: `L${oi}`,
                        matchId: id,
                        score: scoreById.get(id),
                        orphan: orphanLookup.has(id) && idToPair.get(id).png < 0,
                    });
                }
            }
            if (!items.length) {
                alert('Keine Outer-Polygone zum Anzeigen.');
                return;
            }

            // Layout: PNG on LEFT half, LaTeX on RIGHT half of the ring.
            // Each polygon is drawn at the EXACT on-screen size it has in the
            // live panes (natural-pixel coords × display-scale captured when
            // renderBBoxes last ran). No re-scaling — the polygons appear as
            // big as they are on the page.
            const W = 1800, H = 1300;
            const cx = W / 2, cy = H / 2;
            const R = 580;
            const pngItems = items.filter(it => it.label[0] === 'P');
            const latItems = items.filter(it => it.label[0] === 'L');
            const pngScale = pngDisplayScale || 1;
            const latScale = latDisplayScale || 1;

            const placeAt = (it, angle, scale) => {
                const px = cx + R * Math.cos(angle);
                const py = cy + R * Math.sin(angle);
                return { it, px, py, scale };
            };
            const placed = [];
            pngItems.forEach((it, i) => {
                const angle = -Math.PI / 2 - (i + 0.5) * Math.PI / pngItems.length;
                placed.push(placeAt(it, angle, pngScale));
            });
            latItems.forEach((it, i) => {
                const angle = -Math.PI / 2 + (i + 0.5) * Math.PI / latItems.length;
                placed.push(placeAt(it, angle, latScale));
            });

            // Per-pane equation bboxes (for normalised descriptors used in
            // the cross-polygon similarity ranking).
            const pBB = pngItems.length
                ? PlausibilCheck.equationBBox(pngItems.map(it => it.outer))
                : { cx: 0, cy: 0, w: 1, h: 1 };
            const lBB = latItems.length
                ? PlausibilCheck.equationBBox(latItems.map(it => it.outer))
                : { cx: 0, cy: 0, w: 1, h: 1 };

            const svgPieces = [];
            const polyData = []; // { idx, px, py, top3: [{idx, score}, ...] }

            placed.forEach(({ it, px, py, scale }, idx) => {
                const isOrphan = !!it.orphan;
                const colour = isOrphan
                    ? ORPHAN_COLOR
                    : (it.matchId >= 0 ? paletteColor(it.matchId) : '#888');
                const pathStyle = isOrphan ? ` style="filter:${ORPHAN_GLOW}"` : '';

                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (const [x, y] of it.outer) {
                    if (x < minX) minX = x; if (x > maxX) maxX = x;
                    if (y < minY) minY = y; if (y > maxY) maxY = y;
                }
                const ox = (minX + maxX) / 2;
                const oy = (minY + maxY) / 2;
                // Scaled-screen bbox for the hover hit-test rect.
                const sw = (maxX - minX) * scale;
                const sh = (maxY - minY) * scale;
                const pad = 14; // generous so even thin glyphs are easy to hit
                const boxX = px - sw / 2 - pad;
                const boxY = py - sh / 2 - pad;
                const boxW = sw + pad * 2;
                const boxH = sh + pad * 2;

                const place = (poly) => poly.map(([x, y]) =>
                    `${px + (x - ox) * scale},${py + (y - oy) * scale}`).join(' ');

                let d = `M ${place(it.outer).split(' ').join(' L ')} Z`;
                for (const hp of it.holes) {
                    d += ` M ${place(hp).split(' ').join(' L ')} Z`;
                }
                // Visible polygon (no hover hook).
                svgPieces.push(
                    `<path d="${d}" fill="${colour}" fill-rule="evenodd" stroke="none"${pathStyle}/>`
                );
                // Transparent hit-test rect ON TOP — captures mouseenter for
                // its whole bounding box (much easier to hit than a thin
                // glyph). Visually invisible but cursor stays pointer.
                svgPieces.push(
                    `<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" data-idx="${idx}" fill="transparent" pointer-events="all" style="cursor:pointer"/>`
                );
                polyData.push({ idx, px, py, colour, src: it.label[0] });
            });

            // Per-polygon shape descriptor — serialised into the popup so the
            // top-3 can be RE-COMPUTED on the fly when the user drags the
            // weight sliders.
            const descriptors = placed.map(({ it }) => {
                const bb = it.label[0] === 'P' ? pBB : lBB;
                return PlausibilCheck.shapeDescriptor(it.outer, it.holes, bb);
            });
            // Attach a slim descriptor (only what shapeOnlyPlausibility needs)
            // to each polyData entry so the popup can score pairs locally.
            descriptors.forEach((d, i) => {
                polyData[i].desc = d ? {
                    size: d.size, elong: d.elong, fuzz: d.fuzz,
                    massX: d.massX, massY: d.massY,
                    holes: d.holes, holeFrac: d.holeFrac,
                } : null;
            });

            // Restore the user's last window size/position (persisted in
            // localStorage by the popup itself via beforeunload).
            let geom = null;
            try { geom = JSON.parse(localStorage.getItem('draw20-ring-geom') || 'null'); } catch (_) {}
            const defW = Math.min(W, Math.round(window.screen.availWidth * 0.9));
            const defH = Math.min(H + 60, Math.round(window.screen.availHeight * 0.9));
            const wsz = geom && geom.w > 200 ? geom.w : defW;
            const hsz = geom && geom.h > 200 ? geom.h : defH;
            const features = [`width=${wsz}`, `height=${hsz}`];
            if (geom && Number.isFinite(geom.x) && Number.isFinite(geom.y)) {
                features.push(`left=${geom.x}`, `top=${geom.y}`);
            }
            const win = window.open('', 'draw20-polygon-ring', features.join(','));
            if (!win) { alert('Popup wurde blockiert.'); return; }
            win.document.open();
            win.document.write(`<!DOCTYPE html><html lang="de"><head>
<meta charset="utf-8"><title>Polygon Ring (${items.length} outers)</title>
<style>
  html, body { height: 100%; }
  body { margin: 0; padding: 0; background: #000010; color: #aaa; font-family: 'Orbitron', sans-serif; display: flex; flex-direction: column; }
  .hdr { padding: 6px 16px; font-size: 11px; color: #00d2ff; border-bottom: 1px solid #222; flex: 0 0 auto; }
  .sliders { display: flex; gap: 14px; padding: 10px 16px; border-bottom: 1px solid #222; flex: 0 0 auto; flex-wrap: wrap; align-items: center; background: rgba(0,0,40,0.4); }
  .sl { display: flex; flex-direction: column; gap: 2px; min-width: 110px; }
  .sl .row { display: flex; align-items: center; gap: 8px; }
  .sl label { font-size: 10px; letter-spacing: 0.08em; color: #aaa; text-transform: uppercase; }
  .sl input[type=range] { flex: 1; accent-color: #00d2ff; }
  .sl .val { font-size: 11px; color: #00d2ff; font-weight: 700; min-width: 28px; text-align: right; font-family: Arial, sans-serif; }
  .reset { padding: 6px 12px; background: rgba(0,0,0,0.6); color: #00d2ff; border: 1px solid rgba(0,210,255,0.5); border-radius: 4px; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; cursor: pointer; letter-spacing: 0.08em; }
  .stage { flex: 1 1 auto; min-height: 0; }
  svg { display: block; background: #000010; width: 100%; height: 100%; }
  rect[data-idx] { transition: stroke 0.1s; }
</style></head><body>
<div class="hdr">Polygon Ring — ${items.length} outer polygons (PNG: ${pngItems.length}, LaTeX: ${latItems.length}) · <b>klick</b> ein Polygon (lock) — slider gewichten in Echtzeit · <span style="color:#F4C430;font-weight:700">[A]</span> Top-1 für alle</div>
<div class="sliders" id="sliders">
  <div class="sl"><label>Mass</label><div class="row"><input type="range" id="w-mass" min="0" max="100" value="38"><span class="val" id="v-mass">38</span></div></div>
  <div class="sl"><label>Size</label><div class="row"><input type="range" id="w-size" min="0" max="100" value="20"><span class="val" id="v-size">20</span></div></div>
  <div class="sl"><label>Holes</label><div class="row"><input type="range" id="w-holes" min="0" max="100" value="18"><span class="val" id="v-holes">18</span></div></div>
  <div class="sl"><label>Elong</label><div class="row"><input type="range" id="w-elong" min="0" max="100" value="14"><span class="val" id="v-elong">14</span></div></div>
  <div class="sl"><label>Fuzz</label><div class="row"><input type="range" id="w-fuzz" min="0" max="100" value="10"><span class="val" id="v-fuzz">10</span></div></div>
  <button class="reset" id="greedy-match">GREEDY [G]</button>
  <button class="reset" id="reset-weights">RESET</button>
</div>
<div class="stage"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
  <g id="similarity-lines"></g>
  ${svgPieces.join('')}
</svg></div>
<script>
  const POLYS = ${JSON.stringify(polyData)};
  const layer = document.getElementById('similarity-lines');
  function clearLines() { while (layer.firstChild) layer.removeChild(layer.firstChild); }
  const NS = 'http://www.w3.org/2000/svg';

  // Weight state — driven by the 5 sliders. Defaults match shapeOnlyPlausibility.
  const W = { mass: 38, size: 20, holes: 18, elong: 14, fuzz: 10 };
  function readSliders() {
    W.mass  = +document.getElementById('w-mass').value;
    W.size  = +document.getElementById('w-size').value;
    W.holes = +document.getElementById('w-holes').value;
    W.elong = +document.getElementById('w-elong').value;
    W.fuzz  = +document.getElementById('w-fuzz').value;
    document.getElementById('v-mass').textContent  = W.mass;
    document.getElementById('v-size').textContent  = W.size;
    document.getElementById('v-holes').textContent = W.holes;
    document.getElementById('v-elong').textContent = W.elong;
    document.getElementById('v-fuzz').textContent  = W.fuzz;
  }
  // Score function: identical to PlausibilCheck.shapeOnlyPlausibility but
  // with weights from the sliders (renormalised so they sum to 1).
  function score(a, b) {
    if (!a || !b) return 0;
    const sizeR = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
    const sSize = Math.max(0, 1 - sizeR / 1.5);
    const elongR = Math.abs(Math.log(a.elong / b.elong));
    const sElong = Math.max(0, 1 - elongR / 1.0);
    const fuzzR = Math.abs(Math.log(a.fuzz / b.fuzz));
    const sFuzz = Math.max(0, 1 - fuzzR / 1.0);
    const dmX = Math.abs(a.massX - b.massX);
    const dmY = Math.abs(a.massY - b.massY);
    const sMass = Math.max(0, 1 - (dmX + dmY) / 1.5);
    const dh = Math.abs(a.holes - b.holes);
    const dhf = Math.abs(a.holeFrac - b.holeFrac);
    const sHoles = Math.max(0, 1 - dh / 2 - dhf * 0.5);
    const sum = W.mass + W.size + W.holes + W.elong + W.fuzz;
    if (sum <= 0) return 0;
    return (W.mass * sMass + W.size * sSize + W.holes * sHoles
          + W.elong * sElong + W.fuzz * sFuzz) / sum;
  }
  function topN(idx, n) {
    const me = POLYS[idx];
    if (!me || !me.desc) return [];
    const out = [];
    for (let j = 0; j < POLYS.length; j++) {
      if (j === idx) continue;
      const o = POLYS[j];
      if (!o.desc || o.src === me.src) continue;
      out.push({ idx: j, score: score(me.desc, o.desc) });
    }
    out.sort((a, b) => b.score - a.score);
    return out.slice(0, n);
  }

  let lockedIdx = null;
  function showFor(idx) {
    clearLines();
    const me = POLYS[idx];
    if (!me) return;
    // Recompute top-3 on the fly using current slider weights.
    const top3 = topN(idx, 3);
    if (!top3.length) return;
    // Rank 0 (most similar) gets thickest, brightest line; rank 2 thinnest.
    top3.forEach((t, r) => {
      const other = POLYS[t.idx];
      if (!other) return;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', me.px); line.setAttribute('y1', me.py);
      line.setAttribute('x2', other.px); line.setAttribute('y2', other.py);
      line.setAttribute('stroke', '#cccccc');
      line.setAttribute('stroke-width', String(4 - r));
      line.setAttribute('opacity', String(0.85 - r * 0.20));
      layer.appendChild(line);
      // Score badge: a rounded box with the percentage, positioned along the
      // line biased toward the target end. Big text + dark backdrop for
      // readability against any underlying polygon colour.
      const tx = me.px + (other.px - me.px) * 0.62;
      const ty = me.py + (other.py - me.py) * 0.62;
      const label = Math.round(t.score * 100) + '%';
      const fontSize = 32;
      const padX = 16, padY = 10;
      const charW = fontSize * 0.55;
      const boxW = label.length * charW + padX * 2;
      const boxH = fontSize + padY * 2;
      // Rank → colour: best=green, 2nd=yellow, 3rd=red.
      const RANK_COL = ['#3cb44b', '#F4C430', '#FF1744'];
      const rankCol = RANK_COL[r] || '#888';
      const g = document.createElementNS(NS, 'g');
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', tx - boxW / 2);
      rect.setAttribute('y', ty - boxH / 2);
      rect.setAttribute('width', boxW);
      rect.setAttribute('height', boxH);
      rect.setAttribute('rx', 8);
      rect.setAttribute('fill', '#000');
      rect.setAttribute('stroke', rankCol);
      rect.setAttribute('stroke-width', '2');
      g.appendChild(rect);
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', tx);
      txt.setAttribute('y', ty);
      txt.setAttribute('fill', rankCol);
      txt.setAttribute('font-size', String(fontSize));
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'central');
      txt.textContent = label;
      g.appendChild(txt);
      layer.appendChild(g);
    });
  }
  // Draw one line from each polygon's centroid to its top-1 most similar
  // partner — used by [A] overview mode. Each line is coloured by the PNG
  // endpoint's polygon colour.
  function drawTop1ForAll() {
    clearLines();
    POLYS.forEach(me => {
      if (!me.desc) return;
      const top = topN(me.idx, 1);
      if (!top.length) return;
      const other = POLYS[top[0].idx];
      if (!other) return;
      const pngEnd = me.src === 'P' ? me : (other.src === 'P' ? other : me);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', me.px); line.setAttribute('y1', me.py);
      line.setAttribute('x2', other.px); line.setAttribute('y2', other.py);
      line.setAttribute('stroke', pngEnd.colour);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('opacity', '0.75');
      layer.appendChild(line);
    });
  }
  let allMode = false;
  let greedyMode = false;

  // Greedy bipartite assignment: sort every cross-pane pair by score
  // descending, fix the top pair, mark both endpoints "used" so they can't
  // appear in another pair, repeat. Not globally optimal like Hungarian,
  // but simple and intuitive — and respects the current slider weights.
  function drawGreedy() {
    clearLines();
    const pairs = [];
    for (let i = 0; i < POLYS.length; i++) {
      const a = POLYS[i];
      if (!a.desc) continue;
      for (let j = i + 1; j < POLYS.length; j++) {
        const b = POLYS[j];
        if (!b.desc || a.src === b.src) continue;
        pairs.push({ i, j, s: score(a.desc, b.desc) });
      }
    }
    pairs.sort((x, y) => y.s - x.s);
    const used = new Set();
    const picked = [];
    for (const p of pairs) {
      if (used.has(p.i) || used.has(p.j)) continue;
      used.add(p.i); used.add(p.j);
      picked.push(p);
    }
    // Draw — top of the list = highest score = thickest, brightest line.
    picked.forEach((p, rank) => {
      const a = POLYS[p.i], b = POLYS[p.j];
      const pngEnd = a.src === 'P' ? a : (b.src === 'P' ? b : a);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', a.px); line.setAttribute('y1', a.py);
      line.setAttribute('x2', b.px); line.setAttribute('y2', b.py);
      line.setAttribute('stroke', pngEnd.colour);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('opacity', '0.85');
      layer.appendChild(line);
      // Score badge in the middle of each line.
      const tx = (a.px + b.px) / 2;
      const ty = (a.py + b.py) / 2;
      const label = Math.round(p.s * 100) + '%';
      const fontSize = 24;
      const padX = 10, padY = 6;
      const boxW = label.length * fontSize * 0.55 + padX * 2;
      const boxH = fontSize + padY * 2;
      const rankCol = p.s >= 0.70 ? '#3cb44b' : p.s >= 0.55 ? '#F4C430' : '#FF1744';
      const g = document.createElementNS(NS, 'g');
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', tx - boxW / 2);
      rect.setAttribute('y', ty - boxH / 2);
      rect.setAttribute('width', boxW);
      rect.setAttribute('height', boxH);
      rect.setAttribute('rx', 6);
      rect.setAttribute('fill', '#000');
      rect.setAttribute('stroke', rankCol);
      rect.setAttribute('stroke-width', '2');
      g.appendChild(rect);
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', tx);
      txt.setAttribute('y', ty);
      txt.setAttribute('fill', rankCol);
      txt.setAttribute('font-size', String(fontSize));
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'central');
      txt.textContent = label;
      g.appendChild(txt);
      layer.appendChild(g);
    });
  }

  // Click to LOCK a polygon's top-3 display. Click again or on another →
  // switches. The lines stay until cleared.
  document.querySelectorAll('[data-idx]').forEach(p => {
    p.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const idx = +p.dataset.idx;
      if (lockedIdx === idx) { lockedIdx = null; clearLines(); }
      else { lockedIdx = idx; allMode = false; showFor(idx); }
    });
  });
  // Click on empty space (the SVG, not on a polygon) → unlock.
  document.querySelector('svg').addEventListener('click', () => {
    lockedIdx = null;
    if (allMode) drawTop1ForAll(); else clearLines();
  });

  function redraw() {
    if (greedyMode) drawGreedy();
    else if (allMode) drawTop1ForAll();
    else if (lockedIdx !== null) showFor(lockedIdx);
    else clearLines();
  }

  // Keys: [A] = top-1 for all, [G] = greedy assignment.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
      allMode = !allMode;
      if (allMode) { greedyMode = false; lockedIdx = null; }
      redraw();
    } else if (e.key === 'g' || e.key === 'G') {
      greedyMode = !greedyMode;
      if (greedyMode) { allMode = false; lockedIdx = null; }
      redraw();
    }
  });

  // Slider listeners — recompute live.
  ['mass','size','holes','elong','fuzz'].forEach(k => {
    document.getElementById('w-' + k).addEventListener('input', () => {
      readSliders();
      redraw();
    });
  });
  document.getElementById('reset-weights').addEventListener('click', () => {
    document.getElementById('w-mass').value = 38;
    document.getElementById('w-size').value = 20;
    document.getElementById('w-holes').value = 18;
    document.getElementById('w-elong').value = 14;
    document.getElementById('w-fuzz').value = 10;
    readSliders();
    redraw();
  });
  document.getElementById('greedy-match').addEventListener('click', () => {
    greedyMode = !greedyMode;
    if (greedyMode) { allMode = false; lockedIdx = null; }
    redraw();
  });
  readSliders();
  // Persist window geometry (size + position). Shared localStorage with the
  // opener since the popup is same-origin.
  function saveGeom() {
    try {
      localStorage.setItem('draw20-ring-geom', JSON.stringify({
        w: window.outerWidth,
        h: window.outerHeight,
        x: window.screenX,
        y: window.screenY,
      }));
    } catch (_) {}
  }
  window.addEventListener('resize', saveGeom);
  window.addEventListener('beforeunload', saveGeom);
  // Position has no event — poll every 1.5s while the popup is open.
  setInterval(saveGeom, 1500);
</script>
</body></html>`);
            win.document.close();
        }

        function renderBBoxes() {
            // Detach morph-layer first, wipe everything, drawing happens in
            // between, morph-layer gets re-attached as the LAST child below
            // so its polygons render on TOP of bboxes/outlines/dots.
            if (morphLayer.parentNode === overlay) overlay.removeChild(morphLayer);
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
            const { pngId, latId, idToPair, plausibility, pClass, lClass } = matchInfo;
            dbg(`Hungarian: png=${pngContours?.length || 0} latex=${latexContoursList?.length || 0}`);

            // Display scales — natural pixel → displayed CSS pixel, exactly
            // as used by drawContours for the main panes. The polygon-ring
            // uses these so each polygon is rendered at the SAME on-screen
            // size as in the live panes.
            const pixR = pix.getBoundingClientRect();
            const texR = tex.getBoundingClientRect();
            const pngDisplayScale = (pix.naturalWidth && pix.naturalHeight)
                ? Math.min(pixR.width / pix.naturalWidth, pixR.height / pix.naturalHeight) : 1;
            const latDisplayScale = (tex.naturalWidth && tex.naturalHeight)
                ? Math.min(texR.width / tex.naturalWidth, texR.height / tex.naturalHeight) : 1;

            // Stash the most-recent render data so the polygon-ring view can
            // grab it without re-running the matcher.
            lastRenderData = {
                pngContours, latexContours: latexContoursList,
                pClass, lClass, pngId, latId, idToPair, plausibility,
                pngDisplayScale, latDisplayScale,
            };

            // Refresh the orphan-id set so setMatchHighlight knows which mids
            // are orphans (and must skip the yellow glow on hover). When
            // MATCHING_ENABLED is false, every outer is "unpaired" by design
            // — skip the orphan flagging so they keep their palette colours
            // instead of all rendering bright red.
            // Orphan-Flagging vorerst aus — kommt später wieder rein. Ohne
            // diesen Check fallen unpaired Outers auf ihre Palette-Farbe
            // zurück (statt knallrot mit Glow).
            orphanMatchIds.clear();

            // Centroid maps populated by drawContours — used afterwards to
            // draw cross-pane match lines (centroid PNG ↔ centroid LaTeX).
            const pngCentroids = new Map();
            const latCentroids = new Map();
            const pngPoints = new Map();
            const latPoints = new Map();

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
                    drawContours(pngContours, mapFn, 'png', pngId, pngCentroids, pngPoints);
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
                    drawContours(latexContoursList, mapFn, 'latex', latId, latCentroids, latPoints);
                }
            }

            // ── Match lines: Centroid-zu-Centroid pro gematchtes Outer-Pair.
            // Per default JETZT sichtbar (vorher nur on-hover). Solid stroke;
            // Farbe = Palette für ok/meh, knallrot für suspect.
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
                line.dataset.kind = 'match-line';
                line.dataset.matchId = String(mid);
                line.dataset.verdict = verdict;
                line.dataset.score = score.toFixed(2);
                overlay.appendChild(line);
            }
            // Orphan dashed-circle markers removed — the bright-red polygon
            // (rendered with ORPHAN_COLOR and red glow) is enough.
            let pngOrphCount = 0, latOrphCount = 0;
            for (const [id, pair] of idToPair) {
                if (pair.png >= 0 && pair.lat < 0) pngOrphCount++;
                else if (pair.lat >= 0 && pair.png < 0) latOrphCount++;
            }
            dbg(`Orphans: png=${pngOrphCount} lat=${latOrphCount}`);

            // Build the morph-pair list (matched outer pairs in wrap-local
            // coords) so renderMorph(t) can interpolate without re-running
            // anything. Re-apply the current morph value so the slider state
            // stays consistent across re-renders.
            morphPairs.length = 0;
            for (const [mid, pp] of pngPoints) {
                const lp = latPoints.get(mid);
                if (!lp) continue;
                morphPairs.push({ mid, pngPts: pp, latPts: lp });
            }
            dbg(`morphPairs: ${morphPairs.length} (png points: ${pngPoints.size}, lat points: ${latPoints.size})`);
            // Morph-layer on top of everything for visibility.
            overlay.appendChild(morphLayer);
            const sl = document.getElementById('morph-slider');

            // Wenn Stift-Outlines da sind, jetzt auch stift→LaTeX-Pairs neu
            // bauen — die LaTeX-Coords haben sich gerade aktualisiert. Muss
            // VOR renderMorph passieren, sonst nutzt der erste Slider-Tick
            // noch das alte stiftMorphPairs.
            if (stiftContours && stiftContours.length && typeof buildStiftMorphPairs === 'function') {
                buildStiftMorphPairs(latexContoursList);
            }

            if (sl) renderMorph(+sl.value / 100);

            updateInfoBoxes(pngContours, latexContoursList);
        }

        // ── Morph: interpolate matched outer pairs between PNG and LaTeX —
        // ODER stift↔LaTeX, sobald der User selbst Outlines extrahiert hat.
        // morphPairs wird von renderBBoxes befüllt; stiftMorphPairs von
        // buildStiftMorphPairs (nach extractStiftOutlines bzw. nach jedem
        // renderBBoxes, damit die LaTeX-Coords frisch bleiben).
        // Slider (0..100, /100 = t) treibt die Interpolation; passende Quelle
        // (pix vs. stiftCanvas) crossfadet zur tex-Pane.
        const morphPairs = [];
        const stiftMorphPairs = [];
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
        // Rotate `pts` so the point closest to `anchor` is first — keeps the
        // interpolation from "twisting" when the two polygons start at
        // different positions on their boundary.
        function alignStart(pts, anchor) {
            let best = 0, bestD = Infinity;
            for (let i = 0; i < pts.length; i++) {
                const d = (pts[i].x - anchor.x) ** 2 + (pts[i].y - anchor.y) ** 2;
                if (d < bestD) { bestD = d; best = i; }
            }
            return best === 0 ? pts : [...pts.slice(best), ...pts.slice(0, best)];
        }
        // BB-Hilfen für Nearest-Mapping + In-Place-Morph.
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
        // Verschiebe + skaliere `l` so, dass seine BB exakt auf der BB von `p`
        // liegt — der Morph passiert dann in place an der Quell-Position und
        // -Größe statt quer durchs Pane zu wandern.
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
        // Wrapper um die Engine-Funktion `alignTargetTo` aus morph-engine.js.
        // Findet die Rotation k (und ggf. reverse) des Ziel-Polygons, die die
        // Summe der quadratischen Punkt-zu-Punkt-Abstände zur Quelle minimiert
        // — bewährte Logik aus dem alten Morph.
        // Erwartet beide Polygone bereits same-length (= N nach resample) und
        // im SELBEN Koordinatensystem (BB-aligned via alignDstToSrcBBox),
        // damit die Distanzen sinnvoll vergleichbar sind.
        // Liefert { alignedXY, idxMap } — alignedXY ist das rotierte Ziel
        // im selben Format wie die Quelle ({x,y}), idxMap[i] gibt den
        // ursprünglichen Ziel-Index (in `l`) für Quell-Punkt i.
        function alignTargetWithEngine(p, l) {
            if (typeof alignTargetTo !== 'function') return null;
            if (p.length !== l.length) return null;
            // Engine erwartet [x,y]-Tupel; trail ein Index-Tag um die
            // ursprüngliche Reihenfolge durch die Rotation/Reverse zu
            // tracken (Engine slict 3-Tupel transparent durch).
            const src = p.map(q => [q.x, q.y]);
            const tgt = l.map((q, i) => [q.x, q.y, i]);
            const res = alignTargetTo(src, tgt);
            return {
                alignedXY: res.map(t => ({ x: t[0], y: t[1] })),
                idxMap: res.map(t => t[2]),
            };
        }
        // BB-Nearest Pairing (vorerst nicht mehr im Morph genutzt, aber
        // behalten — vielleicht später für andere Visualisierungen).
        function mapByBBoxNearest(p, l) {
            const bb = (pts) => {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (const q of pts) {
                    if (q.x < minX) minX = q.x;
                    if (q.y < minY) minY = q.y;
                    if (q.x > maxX) maxX = q.x;
                    if (q.y > maxY) maxY = q.y;
                }
                return { minX, minY, maxX, maxY };
            };
            const pBB = bb(p), lBB = bb(l);
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
        // Render morph polygons in-place an der Quell-Position.
        // Quelle = Stift (eigenes Drawing) wenn stiftMorphPairs vorhanden,
        // sonst PNG-Preset. Beide Panes bleiben sichtbar als Referenz —
        // der Morph passiert im Polygon-Overlay an der Quell-Stelle in
        // Quell-Größe, statt quer durchs Pane zu wandern.
        // t < eps → Pre-Morph-Vorschau: Korrespondenz-Linien Quelle → Ziel.
        // t ≥ eps → Polygon-Overlay: shape morpht src → dst (alignDstToSrcBBox).
        const MORPH_EPS = 0.02;
        function renderMorph(t) {
            while (morphLayer.firstChild) morphLayer.removeChild(morphLayer.firstChild);
            t = Math.max(0, Math.min(1, t));
            const useStift = stiftMorphPairs.length > 0;
            const pairs = useStift ? stiftMorphPairs : morphPairs;
            const srcKey = useStift ? 'srcPts' : 'pngPts';
            const dstKey = useStift ? 'dstPts' : 'latPts';
            dbg(`renderMorph t=${t.toFixed(2)} src=${useStift ? 'stift' : 'png'} pairs=${pairs.length}`);
            // Ausgangs-Pane: nur während des Morphs (t ≥ eps) ausgeblendet,
            // im Pre-Morph-Modus (Korrespondenz-Linien) bleibt sie sichtbar
            // damit die Linien an etwas Erkennbarem ansetzen. Tex-Pane immer
            // sichtbar als Referenz.
            const srcEl = useStift ? stiftCanvas : pix;
            tex.style.opacity = '';
            if (!pairs.length) {
                srcEl.style.opacity = '';
                return;
            }
            srcEl.style.opacity = (t < MORPH_EPS) ? '' : '0';
            if (t < MORPH_EPS) {
                // Pre-Morph-Vorschau: gleiche Korrespondenz die der Morph
                // nutzt. alignTargetTo (engine) findet Rotation+Reverse;
                // Linie zeigt Quelle → ECHTES Ziel (ungescaled).
                const svgNS = 'http://www.w3.org/2000/svg';
                const N = 60;
                const z = zoom || 1;
                const sw = String(0.8 / z);
                for (const pair of pairs) {
                    const p = resampleClosed(pair[srcKey], N);
                    const l = resampleClosed(pair[dstKey], N);
                    if (p.length < 3 || l.length < 3) continue;
                    // BB-align l zur src BEVOR alignTargetTo — sonst dominiert
                    // der Centroid-Offset und die Rotation wird willkürlich.
                    const lInPlace = alignDstToSrcBBox(p, l);
                    const eng = alignTargetWithEngine(p, lInPlace);
                    if (!eng) continue;
                    // idxMap zeigt auf den BB-aligned Index — gleiche Indizes
                    // gelten 1:1 auch fürs Original `l` (alignTargetTo
                    // permutiert nur, ändert keine Stückzahl).
                    const color = paletteColor(pair.mid);
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
            const z = zoom || 1;
            let drawn = 0;
            for (const pair of pairs) {
                const p = resampleClosed(pair[srcKey], N);
                const l = resampleClosed(pair[dstKey], N);
                if (p.length < 3 || l.length < 3) continue;
                // In-Place: dst-Polygon BB-aligned auf src. Danach
                // alignTargetTo (engine) für die Rotation+Reverse-Wahl.
                // Beides zusammen: kreuzungsarme Korrespondenz + in-place.
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
                poly.setAttribute('fill', paletteColor(pair.mid));
                poly.setAttribute('fill-opacity', '0.85');
                poly.setAttribute('stroke', '#ffffff');
                poly.setAttribute('stroke-width', String(1.5 / z));
                poly.setAttribute('stroke-opacity', '0.6');
                morphLayer.appendChild(poly);
                drawn++;
            }
            dbg(`renderMorph drawn=${drawn} polygons`);
        }

        // Stift→LaTeX-Paare bauen — gleiche Match-Pipeline wie PNG↔LaTeX
        // (computeMatchIds → Hungarian etc.), nur dass die Quelle stiftContours
        // ist statt PNG. Punkte landen in wrap-pre-transform-CSS, damit
        // renderMorph direkt interpolieren kann ohne erneutes Mapping.
        function buildStiftMorphPairs(latexContoursList) {
            stiftMorphPairs.length = 0;
            if (!stiftContours || !stiftContours.length) return;
            // Falls Caller keine LaTeX-Contours mitliefert, frisch holen.
            let lat = latexContoursList;
            if (!lat) {
                const res = (typeof extractLatexContours === 'function') ? extractLatexContours() : null;
                lat = res ? res.contours : null;
            }
            if (!lat || !lat.length) return;
            if (!tex.complete || !tex.naturalWidth || !latexCanvas) return;
            if (typeof computeMatchIds !== 'function' || typeof classifyContours !== 'function') return;

            const m = computeMatchIds(stiftContours, lat);
            const stiftId = m.pngId, latId = m.latId;

            // stift natural → wrap pre-transform CSS
            const ssx = wrap.offsetWidth / Math.max(1, stiftCanvas.width);
            const ssy = wrap.offsetHeight / Math.max(1, stiftCanvas.height);
            const stiftMap = (x, y) => ({ x: x * ssx, y: y * ssy });

            // latex natural → wrap pre-transform CSS (Mirror der renderBBoxes-mapFn)
            const r = tex.getBoundingClientRect();
            const wrapRect = wrap.getBoundingClientRect();
            const scale = Math.min(r.width / tex.naturalWidth, r.height / tex.naturalHeight);
            const renderW = tex.naturalWidth * scale;
            const renderH = tex.naturalHeight * scale;
            const offX = r.left + (r.width - renderW) / 2;
            const offY = r.top + (r.height - renderH) / 2;
            const z = zoom || 1;
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
            dbg(`stiftMorphPairs: ${stiftMorphPairs.length}`);
        }

        // Animations-Loop für den ► MORPH-Knopf. Treibt den Slider 0→100 über
        // MORPH_DURATION ms, danach Loop-Ende. Bricht alte Animation ab.
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
            dbg('▶ morph anim start');
            tick();
        }
        function stopMorphAnim() {
            if (morphAnimRaf !== null) {
                cancelAnimationFrame(morphAnimRaf);
                morphAnimRaf = null;
                dbg('⏸ morph anim stop');
            }
        }
        // ► MORPH-Knopf hängen
        const morphStartBtn = document.querySelector('button.cyber-btn[onclick*="startMorph"]');
        if (morphStartBtn) morphStartBtn.addEventListener('click', startMorphAnim);
        // Space-Taste zum Start/Pause (mirror des Legacy-Verhaltens)
        document.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (e.code !== 'Space') return;
            if (morphAnimRaf !== null) { e.preventDefault(); stopMorphAnim(); }
            else { e.preventDefault(); startMorphAnim(); }
        });
        // Hook into the existing morph-slider (lives in the side panel).
        // Updates draw20's overlay morph; the legacy engine listener still
        // fires too but only updates the (hidden) legacy canvases.
        function attachMorphSlider() {
            const sl = document.getElementById('morph-slider');
            if (!sl) { setTimeout(attachMorphSlider, 100); return; }
            sl.min = '0';
            if (sl.value === '1') sl.value = '0';
            // OVERRIDE the legacy global onMorphSlider — its body uses the
            // hidden legacy canvases (digit-canvas / morph-canvas) and won't
            // produce visible morphs in our draw20 setup. Replacing the
            // function on `window` redirects the HTML `oninput="onMorphSlider(this.value)"`
            // attribute to our renderMorph.
            window.onMorphSlider = function (val) {
                stopMorphAnim();
                const span = document.getElementById('morph-val');
                if (span) span.textContent = val;
                dbg(`onMorphSlider → ${val}`);
                renderMorph(+val / 100);
            };
            // Also keep addEventListener as a belt-and-braces fallback.
            sl.addEventListener('input', () => {
                stopMorphAnim();
                dbg(`slider input → ${sl.value}`);
                renderMorph(+sl.value / 100);
            });
            dbg(`morph-slider listener attached (min=${sl.min}, max=${sl.max}, value=${sl.value})`);
            renderMorph(+sl.value / 100);
        }
        attachMorphSlider();

        // Coordinated setter: switch both panes to a new formula and re-render
        // the bounding boxes once BOTH images have loaded (pix from preset PNG,
        // tex from rendered LaTeX canvas data-URL).
        function setFormula(latex, presetIndex) {
            dbg(`setFormula latex="${latex}" preset=${presetIndex}`);
            tex.dataset.latex = latex;
            // Re-show pix in case a previous symbol-click hid it.
            pix.style.visibility = '';
            // Spiegele die Auswahl ins Text-Input (UI-Sync, nicht-rekursiv).
            const ti = document.getElementById('text-input');
            if (ti && ti.value !== String(latex)) ti.value = String(latex);
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

        // SYMBOLE / DIGIT clicks — single LaTeX glyph, no PNG preset.
        // Renders the symbol into the tex pane and hides pix (no handwritten
        // counterpart exists). draw20 listens directly to the radios (siehe
        // attachSymbolRadios), kein Hook mehr auf Legacy-Globals.
        function setSymbolLatex(latex) {
            if (!latex || !String(latex).trim()) return;
            dbg(`setSymbolLatex "${latex}"`);
            tex.dataset.latex = String(latex);
            // No PNG counterpart: hide pix entirely and clear its src so
            // renderBBoxes skips the PNG side (pix.naturalWidth becomes 0).
            pix.style.visibility = 'hidden';
            pix.removeAttribute('src');
            // Spiegele die Auswahl ins Text-Input (rein UI-Sync; nicht-rekursiv,
            // weil .value = … kein 'input'-Event auslöst).
            const ti = document.getElementById('text-input');
            if (ti && ti.value !== String(latex)) ti.value = String(latex);
            renderLatex(String(latex)).then(() => {
                requestAnimationFrame(() => requestAnimationFrame(renderBBoxes));
            });
        }
        // Direkte 'change'-Listener auf alle Radios mit name="digit" — egal ob
        // Ziffer (value="1".."9","0"), LaTeX-Symbol (value="latex-N"), Komplex
        // (value="complex-N") oder Formel (value="formula-N"). Kein Hook auf
        // Legacy-Globals — die Inline-onclick="…"-Handler im Markup laufen
        // parallel ins Leere (in einer reinen draw20-Konfiguration) bzw.
        // bedienen den Legacy-Stack (wenn beide geladen sind). Beides okay.
        function attachAllRadios() {
            const radios = document.querySelectorAll('input[name="digit"]');
            dbg(`radios attached: ${radios.length}`);
            radios.forEach(r => {
                r.addEventListener('change', () => {
                    if (!r.checked) return;
                    dispatchRadio(r);
                });
            });
            const ti = document.getElementById('text-input');
            if (ti) {
                ti.addEventListener('input', () => {
                    const v = (ti.value || '').trim();
                    if (v) setSymbolLatex(v);
                });
            }
        }
        function dispatchRadio(r) {
            const v = r.value || '';
            if (v.startsWith('formula-')) {
                const latex = r.dataset.latex;
                const preset = parseInt(r.dataset.preset, 10);
                if (latex && !isNaN(preset)) setFormula(latex, preset);
            } else {
                // Ziffern (kein data-latex) verwenden den value direkt;
                // LaTeX-Symbole & Komplex haben data-latex.
                const latex = r.dataset.latex || v;
                if (latex) setSymbolLatex(latex);
            }
        }
        // Initiale Anzeige: aktuell gechecktes Radio (falls Legacy-Boot
        // localStorage→radio.checked schon angewandt hat), sonst Default.
        function applyInitialSelection() {
            const checked = document.querySelector('input[name="digit"]:checked');
            if (checked) dispatchRadio(checked);
            else setFormula(DEFAULT_LATEX, DEFAULT_PRESET);
        }

        // Das Radio-Grid wird vom Inline-Script in morph.html beim Parsen
        // gebaut; bei DOMContentLoaded existiert es. Trotzdem defensiv retryen.
        function tryAttach() {
            if (document.querySelector('input[name="digit"]')) {
                attachAllRadios();
                applyInitialSelection();
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
            stiftOutlineSvg.querySelectorAll('polygon').forEach(p => {
                p.style.display = show ? '' : 'none';
            });
        }
        function applyPointsToggle() {
            const t = document.getElementById('points-toggle');
            const show = t ? t.checked : true;
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(p => {
                p.style.display = show ? '' : 'none';
            });
            stiftOutlineSvg.querySelectorAll('circle[data-kind="point"]').forEach(p => {
                p.style.display = show ? '' : 'none';
            });
        }
        // PIXEL toggle: show/hide the raw PNG (handwriting), LaTeX glyphs UND
        // die Stift-Striche. Vector outlines + bbox stay so the user can see
        // contours alone. opacity statt visibility am stiftCanvas, damit der
        // Stift-Modus weiter Maus-Events empfängt (visibility:hidden würde
        // pointer-events killen).
        function applyArtToggle() {
            const t = document.getElementById('art-toggle');
            const show = t ? t.checked : true;
            pix.style.visibility = show ? '' : 'hidden';
            tex.style.visibility = show ? '' : 'hidden';
            stiftCanvas.style.opacity = show ? '1' : '0';
        }
        // POLYGONE FÜLLEN: show/hide the grouped fill paths emitted by
        // drawContours + renderStiftOutlines (one path per outer, with its
        // holes as evenodd subpaths). Per-contour stroke polygons stay
        // unchanged.
        function applyFillToggle() {
            const t = document.getElementById('fill-toggle');
            const fill = t ? t.checked : false;
            overlay.querySelectorAll('path[data-kind="fill"]').forEach(p => {
                p.style.display = fill ? '' : 'none';
            });
            stiftOutlineSvg.querySelectorAll('path[data-kind="fill"]').forEach(p => {
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
            overlay.querySelectorAll('rect, polygon, polyline, path, line').forEach(r => {
                r.setAttribute('stroke-width', sw);
            });
            // Counter-scale vertex dots so they stay constant screen size.
            const pr = String(2 / zoom);
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => {
                c.setAttribute('r', pr);
            });
            // Gleiches Spiel für Stift-Outlines: Strich = 1.5/zoom, Dot = 2/zoom.
            const ssw = String(1.5 / zoom);
            stiftOutlineSvg.querySelectorAll('polygon').forEach(p => {
                p.setAttribute('stroke-width', ssw);
                if (p.hasAttribute('stroke-dasharray')) {
                    p.setAttribute('stroke-dasharray', `${(3 / zoom).toFixed(2)} ${(3 / zoom).toFixed(2)}`);
                }
            });
            stiftOutlineSvg.querySelectorAll('circle').forEach(c => c.setAttribute('r', pr));
        }, { passive: false });
        // Double-click and ESC both reset the view.
        function resetZoom() {
            zoom = 1; panX = 0; panY = 0;
            saveZoomPan();
            wrap.style.transform = '';
            overlay.querySelectorAll('rect, polygon, polyline, path, line').forEach(r => {
                r.setAttribute('stroke-width', '1');
            });
            overlay.querySelectorAll('circle[data-kind="point"]').forEach(c => {
                c.setAttribute('r', '2');
            });
            stiftOutlineSvg.querySelectorAll('polygon').forEach(p => {
                p.setAttribute('stroke-width', '1.5');
                if (p.hasAttribute('stroke-dasharray')) p.setAttribute('stroke-dasharray', '3 3');
            });
            stiftOutlineSvg.querySelectorAll('circle').forEach(c => c.setAttribute('r', '2'));
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

        // Stift-Integration: draw20 hat eine eigene Zeichenfläche (siehe oben
        // im Init); die Closure-Variable `stiftEnabled` gated pan-on-mousedown
        // — bei aktivem Stift fängt das eigene Canvas den mousedown, kein
        // Pan-Drag startet. Kein Hook auf Legacy-Globals nötig.

        // ── Right-click context menu (custom).
        // Currently a single action: "Delete Local" — wipes all localStorage
        // (zoom/pan, drawn pixels, switch states, formula choice, …) so the
        // next reload starts from a clean slate.
        let ctxMenu = null;
        function closeCtxMenu() {
            if (ctxMenu && ctxMenu.parentNode) ctxMenu.parentNode.removeChild(ctxMenu);
            ctxMenu = null;
        }
        function openCtxMenu(x, y) {
            closeCtxMenu();
            ctxMenu = document.createElement('div');
            ctxMenu.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid rgba(0, 210, 255, 0.5);
                border-radius: 6px;
                box-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
                padding: 4px 0;
                font-family: 'Orbitron', sans-serif;
                font-size: 12px;
                color: #00d2ff;
                min-width: 180px;
                user-select: none;
            `;
            const item = document.createElement('div');
            item.textContent = 'Delete Local';
            item.style.cssText = `
                padding: 8px 14px;
                cursor: pointer;
                letter-spacing: 0.06em;
            `;
            item.addEventListener('mouseenter', () => { item.style.background = 'rgba(0,210,255,0.15)'; });
            item.addEventListener('mouseleave', () => { item.style.background = ''; });
            item.addEventListener('click', () => {
                try { localStorage.clear(); } catch (_) {}
                dbg('localStorage cleared');
                closeCtxMenu();
                location.reload();
            });
            ctxMenu.appendChild(item);
            document.body.appendChild(ctxMenu);
        }
        host.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openCtxMenu(e.clientX, e.clientY);
        });
        // Any click elsewhere (or Escape) closes the menu.
        document.addEventListener('mousedown', (e) => {
            if (ctxMenu && !ctxMenu.contains(e.target)) closeCtxMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCtxMenu();
        });

        host.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (stiftEnabled) return; // Stift on → eigenes Canvas hat Priorität
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
        // Expose the diagnostic ring-view (also bound to a floating button).
        window.openPolygonRing = openPolygonRing;

        // RING button — placed directly below the similarity-box info card
        // (same width, same left edge, similar styling) so it visually belongs
        // to the diagnostic-info stack. Sits inside canvas-container with an
        // inline display override against the global `> * { display: none
        // !important }` rule.
        const ringBtn = document.createElement('button');
        ringBtn.id = 'draw20-ring-btn';
        ringBtn.textContent = 'RING';
        ringBtn.title = 'Alle Outer-Polygone im Ring anzeigen (neues Fenster)';
        ringBtn.addEventListener('click', openPolygonRing);
        host.appendChild(ringBtn);

        // Position the button below the similarity-box. Re-position on
        // every render (in case the sim-box size changed) and on resize.
        function positionRingBtn() {
            const sim = document.getElementById('similarity-box');
            if (!sim) { setTimeout(positionRingBtn, 100); return; }
            const simRect = sim.getBoundingClientRect();
            const hostRect = host.getBoundingClientRect();
            const top = simRect.bottom - hostRect.top + 8;
            const left = simRect.left - hostRect.left;
            const width = simRect.width;
            ringBtn.style.cssText = `
                position: absolute !important;
                display: block !important;
                top: ${top}px;
                left: ${left}px;
                width: ${width}px;
                z-index: 50;
                padding: 10px 12px;
                background: rgba(0, 0, 0, 0.85);
                color: #00d2ff;
                border: 1px solid rgba(0, 210, 255, 0.5);
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);
                font-family: 'Orbitron', sans-serif;
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 0.08em;
                cursor: pointer;
            `;
        }
        positionRingBtn();
        window.addEventListener('resize', positionRingBtn);

        dbg('✓ wrap appended');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
