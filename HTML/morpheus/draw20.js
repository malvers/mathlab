// Morpheus drawing v2 — clean restart.
// Tandem display: pixel formula (preset PNG) + LaTeX rendering of the same
// formula, side-by-side with vector bounding boxes around the actual character
// pixels. Hooks into the existing formula radio grid so selecting a formula
// updates both panes.

(function () {
    // Constants live in draw20-constants.js (loaded before this file).
    // Local aliases keep the rest of the file unchanged.
    const DEFAULT_LATEX = DRAW20_DEFAULT_LATEX;
    const DEFAULT_PRESET = DRAW20_DEFAULT_PRESET;
    const INK_COLOR = DRAW20_INK_COLOR;
    const REGION_PALETTE = DRAW20_REGION_PALETTE;
    const ORPHAN_COLOR = DRAW20_ORPHAN_COLOR;
    const ORPHAN_GLOW = DRAW20_ORPHAN_GLOW;
    const paletteColor = draw20PaletteColor;

    function dbg(msg) {
        if (typeof DebugWindow !== 'undefined') DebugWindow.log('[draw20] ' + msg);
    }

    function getThreshold() {
        return +(document.getElementById('threshold-slider')?.value ?? 20);
    }

    function init() {
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
        // Dedicated layer for the morph (interpolated polygons between PNG
        // and LaTeX matched pairs). Appended early so it sits BELOW the
        // outline/point/match-line elements drawn by drawContours.
        const morphLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        morphLayer.id = 'morph-layer';
        overlay.appendChild(morphLayer);

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

        // ── Stift-Outlines SVG layer: oberhalb der Striche, eigene Polygone
        // + Punkte + Holes.  z-index 13 (über stiftCanvas z-index 12).
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

        // ── Stift module: drawing, undo/redo, outlines — all in draw20-stift.js
        // The onAfterOutlinesChanged callback closes over toggle/morph
        // functions defined later in init() (function hoisting handles the
        // forward reference). It's only invoked after extract/clear, by which
        // time the whole init body has run.
        // `ui` is forward-declared so the stift's onAfterOutlinesChanged
        // callback can reach into it lazily — UI factory is created later
        // (after morph factory is available).
        let ui = null;
        const stift = createDraw20Stift({
            stiftCanvas,
            stiftCtx,
            stiftOutlineSvg,
            wrap,
            dbg,
            getZoom: () => zoom,
            // Lazy thunk: extractPNGContours is a `const` declared later in
            // init() (no hoisting). Wrap it so the lookup happens at call time.
            extractContours: (cvs) => extractPNGContours(cvs),
            onAfterOutlinesChanged: () => {
                if (ui) {
                    ui.applyLinesToggle();
                    ui.applyPointsToggle();
                    ui.applyFillToggle();
                    ui.applyArtToggle();
                }
                if (typeof buildStiftMorphPairs === 'function') buildStiftMorphPairs();
                const sl = document.getElementById('morph-slider');
                if (sl && typeof renderMorph === 'function') renderMorph(+sl.value / 100);
            },
        });

        // Stift-toggle + clear buttons hook into the factory methods.
        // (Legacy onclick="..." attributes in the markup still fire too but
        // hit hidden canvases — harmless.)
        const stiftTglBtn = document.getElementById('draw-toggle');
        if (stiftTglBtn) stiftTglBtn.addEventListener('click', stift.toggleStiftEnabled);
        const stiftClearBtn = document.querySelector('button.cyber-btn[onclick*="clearDraw"]');
        if (stiftClearBtn) stiftClearBtn.addEventListener('click', stift.clearStrokes);
        const stiftExtractBtn = document.querySelector('button.cyber-btn[onclick*="extractOutline"]');
        if (stiftExtractBtn) stiftExtractBtn.addEventListener('click', stift.extractStiftOutlines);
        const stiftClearOutBtn = document.querySelector('button.cyber-btn[onclick*="clearOutline"]');
        if (stiftClearOutBtn) stiftClearOutBtn.addEventListener('click', stift.clearStiftOutlines);

        stift.applyStiftState();
        requestAnimationFrame(() => {
            stift.resizeStift();
            // Auto-restore outlines on reload: if the flag was set on the last
            // OUTLINES GENERIEREN click AND strokes are still in the canvas,
            // re-extract automatically. (Re-extracting from the freshly-drawn
            // pixels is cheaper than persisting the contour data — and avoids
            // scale drift at a different window size.)
            try {
                if (localStorage.getItem('draw20-outlines-active') === '1' && stift.getStrokes().length > 0) {
                    stift.extractStiftOutlines();
                }
            } catch (_) {}
        });
        window.addEventListener('resize', stift.resizeStift);

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



        // Contour extraction lives in draw20-extract.js.
        // Wrappers run without `dbg` so non-Stift noise stays out of DEBUG.
        const extractPNGContours = (canvas) => draw20ExtractPNGContours(canvas);
        const extractLatexContours = () => draw20ExtractLatexContours(latexCanvas);



        const morphPairs = [];
        let baseSimilarity = 0; // Ähnlichkeit bei t=0, wird in renderBBoxes gespeichert

        // ── Morph: PNG↔LaTeX (or stift↔LaTeX) interpolation. Lives in
        // draw20-morph.js. morphPairs is a shared array — renderBBoxes
        // (in draw20.js) keeps refilling it; the factory just reads.
        const morph = createDraw20Morph({
            morphLayer,
            overlay,
            pix, tex,
            stiftCanvas,
            stiftOutlineSvg,
            wrap,
            morphPairs,
            getZoom: () => zoom,
            getLatexCanvas: () => latexCanvas,
            getStiftContours: () => stift.getStiftContours(),
            getBaseSimilarity: () => baseSimilarity,
            extractLatexContours,
            // Inline matchIds wrapper — render factory has its own copy for
            // its renderBBoxes; this one is for buildStiftMorphPairs.
            computeMatchIds: (p, l) => draw20ComputeMatchIds(p, l, {
                matchingEnabled: DRAW20_MATCHING_ENABLED,
            }),
            dbg,
        });
        // Local aliases keep the existing call sites unchanged.
        const renderMorph = morph.renderMorph;
        const buildStiftMorphPairs = morph.buildStiftMorphPairs;
        const startMorphAnim = morph.startMorphAnim;

        // ► MORPH-Knopf hängen
        const morphStartBtn = document.querySelector('button.cyber-btn[onclick*="startMorph"]');
        if (morphStartBtn) morphStartBtn.addEventListener('click', startMorphAnim);

        morph.attachMorphSlider();

        // KORRESPONDENZ toggle — re-render the pre-morph view when toggled
        // so the change is immediately visible (no slider movement needed).
        const corrToggle = document.getElementById('correspondence-toggle');
        if (corrToggle) corrToggle.addEventListener('change', () => {
            const sl = document.getElementById('morph-slider');
            if (sl) renderMorph(+sl.value / 100);
        });

        // ── Render: drawContours, hover, similarity, renderBBoxes orchestrator.
        // Lives in draw20-render.js. Owns its own pngVertCount/latVertCount/
        // lastRenderData; writes baseSimilarity back via setter.
        const render = createDraw20Render({
            overlay, morphLayer, wrap,
            pix, tex,
            getZoom: () => zoom,
            getLatexCanvas: () => latexCanvas,
            getThreshold,
            extractPNGContours, extractLatexContours,
            getStiftContours: () => stift.getStiftContours(),
            buildStiftMorphPairs,
            renderMorph,
            morphPairs,
            getUI: () => ui,
            matchingEnabled: DRAW20_MATCHING_ENABLED,
            setBaseSimilarity: (v) => { baseSimilarity = v; },
            dbg,
        });
        const renderBBoxes = render.renderBBoxes;
        const openPolygonRing = render.openPolygonRing;
        const openMorph3D = render.openMorph3D;

        // ── UI: Toggles, Formula/Symbol radios, context menu, RING button.
        // Lives in draw20-ui.js. Assigning to the previously-declared `let
        // ui = null;` so the stift's onAfterOutlinesChanged callback (which
        // captured the binding earlier) sees the populated object.
        ui = createDraw20UI({
            host, pix, tex,
            overlay, stiftOutlineSvg, stiftCanvas,
            renderLatex,
            renderBBoxes,
            openPolygonRing,
            openMorph3D,
            defaultLatex: DEFAULT_LATEX,
            defaultPreset: DEFAULT_PRESET,
            dbg,
        });

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

        // Stift gating: while the stift module's stiftEnabled is on, its own
        // canvas (z-index 12) catches the mousedown — no pan-drag starts.
        host.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (stift.getStiftEnabled()) return; // Stift on → eigenes Canvas hat Priorität
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


    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
