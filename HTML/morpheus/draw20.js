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

    function init() {
        dbg('init called');
        const host = document.getElementById('canvas-container');
        if (!host) { dbg('ABORT: no canvas-container'); return; }

        // Mouse-zoom state — declared up top so drawBBox closures see it
        // initialized regardless of which async path fires first.
        let zoom = 1, panX = 0, panY = 0;

        const wrap = document.createElement('div');
        wrap.id = 'draw20-wrap';
        wrap.style.cssText = `
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(20px, 4vw, 80px);
            z-index: 10;
            pointer-events: none;
            background: rgb(0, 0, 20);
        `;

        const pix = document.createElement('img');
        pix.style.cssText = `
            max-height: 43vh;
            max-width: 29vw;
            object-fit: contain;
            mix-blend-mode: screen;
        `;

        const tex = document.createElement('div');
        tex.style.cssText = `
            color: ${INK_COLOR};
            font-size: clamp(16px, 2.59vw, 52px);
            line-height: 1;
        `;

        wrap.appendChild(pix);
        wrap.appendChild(tex);
        host.appendChild(wrap);

        // Extra drawing layer: vector bounding boxes around the actual character
        // pixels of both the PNG and the LaTeX render.
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        overlay.id = 'draw20-overlay';
        overlay.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 11;
            pointer-events: none;
        `;
        wrap.appendChild(overlay);

        function renderLatex(latex) {
            if (typeof katex === 'undefined') {
                setTimeout(() => renderLatex(latex), 50);
                return;
            }
            tex.innerHTML = katex.renderToString(latex, {
                displayMode: true,
                throwOnError: false,
            });
            tex.querySelectorAll('.katex, .katex *').forEach(el => {
                el.style.color = INK_COLOR;
            });
        }

        function computeImageBBox(img) {
            const cw = img.naturalWidth, ch = img.naturalHeight;
            if (!cw || !ch) return null;
            const c = document.createElement('canvas');
            c.width = cw; c.height = ch;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let data;
            try { data = ctx.getImageData(0, 0, cw, ch).data; }
            catch (e) { return null; }
            let minX = cw, minY = ch, maxX = -1, maxY = -1;
            for (let y = 0; y < ch; y++) {
                for (let x = 0; x < cw; x++) {
                    const i = (y * cw + x) * 4;
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a > 16 && (r + g + b) > 60) {
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
                for (let y = 0; y < ch; y++) {
                    for (let x = 0; x < cw; x++) {
                        const i = (y * cw + x) * 4;
                        if (data[i + 3] > 16) {
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

        function renderBBoxes() {
            while (overlay.firstChild) overlay.removeChild(overlay.firstChild);

            if (pix.complete && pix.naturalWidth) {
                const bbox = computeImageBBox(pix);
                if (bbox) drawBBox(mapImageBBoxToViewport(pix, bbox), 'png');
            }

            const katexEl = tex.querySelector('.katex');
            if (katexEl) {
                computeElementInkBBox(katexEl).then(rect => {
                    if (rect) drawBBox(rect, 'latex');
                });
            }
        }

        // Coordinated setter: switch both panes to a new formula and re-render
        // the bounding boxes once both panes have settled.
        function setFormula(latex, presetIndex) {
            dbg(`setFormula latex="${latex}" preset=${presetIndex}`);
            renderLatex(latex);
            const url = `presets/formula-${presetIndex}.png`;
            if (pix.src.endsWith(url)) {
                // PNG didn't change — still re-run bboxes (latex may have).
                requestAnimationFrame(() => requestAnimationFrame(renderBBoxes));
                return;
            }
            pix.onload = () => {
                requestAnimationFrame(() => requestAnimationFrame(renderBBoxes));
            };
            pix.onerror = () => dbg(`PNG load FAILED: ${url}`);
            pix.src = url;
            pix.alt = latex;
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

        // ── Mouse-anchored zoom ─────────────────────────────────────────────
        // The wheel anchors the zoom at the cursor: the world point under the
        // mouse stays put. Transform is applied to `wrap` (transform-origin
        // 0 0), so pix + tex + overlay all scale together — vector-effect on
        // the SVG strokes keeps the bbox lines crisp at any zoom.
        wrap.style.transformOrigin = '0 0';
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
            wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
            // Counter-scale stroke width so the bbox lines stay 1 screen pixel.
            overlay.querySelectorAll('rect').forEach(r => {
                r.setAttribute('stroke-width', String(1 / zoom));
            });
        }, { passive: false });
        // Double-click and ESC both reset the view.
        function resetZoom() {
            zoom = 1; panX = 0; panY = 0;
            wrap.style.transform = '';
            overlay.querySelectorAll('rect').forEach(r => r.setAttribute('stroke-width', '1'));
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
        });

        window.addEventListener('resize', renderBBoxes);
        dbg('✓ wrap appended');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
