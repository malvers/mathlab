// UI wiring for the draw20 stack: formula/symbol/radio dispatch, the four
// toggles (LINIE / PUNKTE / PIXEL / POLYGONE FÜLLEN), the right-click
// context menu, and the floating RING button.
//
// Pure side-effect factory — does not return state. Callers wire it up
// once during init.

function createDraw20UI({
    // DOM refs
    host,
    pix, tex,
    overlay, stiftOutlineSvg,
    stiftCanvas,
    // Renderers (closure into draw20.js)
    renderLatex,
    renderBBoxes,
    // Diagnostic callbacks
    openPolygonRing,
    openMorph3D,
    // Stift bridge — called when user picks a FORMULA (Formel) so we can
    // wipe the freehand drawing + outlines. PNG preset + LaTeX remain.
    onFormulaSelected,
    // Defaults
    defaultLatex = (typeof DRAW20_DEFAULT_LATEX !== 'undefined' ? DRAW20_DEFAULT_LATEX : 'E=mc^2'),
    defaultPreset = (typeof DRAW20_DEFAULT_PRESET !== 'undefined' ? DRAW20_DEFAULT_PRESET : 0),
    // Logger (optional)
    dbg,
}) {
    const log = (typeof dbg === 'function') ? dbg : () => {};

    // ── Formula / Symbol / Radio dispatch ───────────────────────────────────
    // Wipes the morph polygon layer immediately. Used by setFormula and
    // setSymbolLatex to clear stale correspondence/morph lines BEFORE the
    // async LaTeX/PNG render kicks off — otherwise the user sees stale
    // lines blink from the previous selection.
    function clearMorphLayer() {
        const ml = document.getElementById('morph-layer');
        if (!ml) return;
        while (ml.firstChild) ml.removeChild(ml.firstChild);
    }
    // Strip the bulk of the previous render (paths/polygons/dots) from the
    // overlay SVG BEFORE the KaTeX wrapper is appended. Otherwise the
    // browser has to do style/layout/paint over the entire heavy overlay
    // while it processes the new KaTeX HTML — which blocks the main
    // thread for 1–4 s (see setTimeout(50) actual = 1500–3800 ms).
    // morph-layer is preserved so renderBBoxes' assumption holds.
    function clearOverlayBulk() {
        const overlay = document.getElementById('draw20-overlay');
        if (!overlay) return;
        const morphLayer = document.getElementById('morph-layer');
        for (let i = overlay.childNodes.length - 1; i >= 0; i--) {
            const c = overlay.childNodes[i];
            if (c !== morphLayer) overlay.removeChild(c);
        }
    }
    // ── pix-Lifecycle (single source of truth for the handwriting <img>) ────
    // Symbol-mode click → resetPix. Formula click → loadPix(url). Both reset
    // every style property pix could carry from a previous mode (visibility,
    // display, transform, src) so no leakage between Formel → Symbol → Formel.
    function resetPix() {
        pix.removeAttribute('src');
        pix.style.visibility = '';
        pix.style.display = '';
        pix.style.transform = '';
        pix.style.opacity = '';
    }
    function loadPix(url, alt) {
        pix.style.visibility = '';
        pix.style.display = '';
        pix.style.transform = '';
        pix.style.opacity = '';
        return new Promise(resolve => {
            if (pix.src && pix.src.endsWith(url)) { resolve(); return; }
            pix.onload = () => resolve();
            pix.onerror = () => resolve();
            pix.src = url;
            if (alt) pix.alt = alt;
        });
    }
    function setFormula(latex, presetIndex, prefix = 'formula') {
        // Total click→done timer (read by renderBBoxes at the very end).
        window.__draw20ClickT0 = performance.now();
        // Wipe lingering correspondence/morph artifacts immediately so the
        // user doesn't see stale lines from the previous formula while the
        // new LaTeX renders async.
        clearMorphLayer();
        clearOverlayBulk();
        // Formel-Klick: stift strokes + outlines weg, nur PNG + LaTeX
        // bleiben (User wollte: "wenn ich eine Formel wähle alles gemalte
        // löschen, nur Latex und die Hand-Formel stehen lassen").
        if (typeof onFormulaSelected === 'function') onFormulaSelected();
        tex.dataset.latex = latex;
        // Mirror the choice into the text-input (UI sync, non-recursive).
        const ti = document.getElementById('text-input');
        if (ti && ti.value !== String(latex)) ti.value = String(latex);
        const latexReady = renderLatex(latex);
        // prefix = 'formula' or 'complex' — both share the same pipeline,
        // only the PNG namespace differs.
        const url = `presets/${prefix}-${presetIndex}.png`;
        const pixReady = loadPix(url, latex);
        Promise.all([latexReady, pixReady]).then(() => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                renderBBoxes();
                if (typeof Morph3D !== 'undefined' && Morph3D.refreshIfOpen) Morph3D.refreshIfOpen();
            }));
        });
    }

    // SYMBOLE / DIGIT clicks — single LaTeX glyph, no PNG preset.
    // Renders the symbol into the tex pane and hides pix (no handwritten
    // counterpart exists). draw20 listens directly to the radios; no hook
    // on legacy globals needed.
    function setSymbolLatex(latex) {
        if (!latex || !String(latex).trim()) return;
        // Total click→done timer (read by renderBBoxes at the very end).
        window.__draw20ClickT0 = performance.now();
        // Wipe lingering correspondence/morph artifacts (see setFormula).
        clearMorphLayer();
        clearOverlayBulk();
        tex.dataset.latex = String(latex);
        // No PNG counterpart: clear pix fully so renderBBoxes skips the PNG
        // side (pix.naturalWidth becomes 0) and nothing from a previous
        // formula mode leaks through (transform, visibility, src).
        resetPix();
        // Mirror the choice into the text-input (UI sync; non-recursive
        // because .value = … doesn't fire an 'input' event).
        const ti = document.getElementById('text-input');
        if (ti && ti.value !== String(latex)) ti.value = String(latex);
        renderLatex(String(latex)).then(() => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                renderBBoxes();
                if (typeof Morph3D !== 'undefined' && Morph3D.refreshIfOpen) Morph3D.refreshIfOpen();
            }));
        });
    }

    // Direct 'change' listeners on every input[name="digit"] — digit
    // (value="1".."9","0"), LaTeX symbol (value="latex-N"), Komplex
    // (value="complex-N") or Formel (value="formula-N"). No hook on legacy
    // globals — the inline onclick="…" handlers in markup either no-op
    // (pure draw20 setup) or drive the legacy stack (when both are loaded).
    // Both fine.
    function attachAllRadios() {
        const radios = document.querySelectorAll('input[name="digit"]');
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
        // Persist last-selected radio (mode + element) for reload restore.
        try { localStorage.setItem('draw20-radio-value', v); } catch (_) {}
        if (v.startsWith('formula-')) {
            const latex = r.dataset.latex;
            const preset = parseInt(r.dataset.preset, 10);
            if (latex && !isNaN(preset)) setFormula(latex, preset);
        } else if (v.startsWith('complex-')) {
            // Komplex-Formel: hat Bild presets/complex-N.png. Index aus
            // dem value (kein data-preset auf den complex-Radios).
            const latex = r.dataset.latex;
            const preset = parseInt(v.slice('complex-'.length), 10);
            if (latex && !isNaN(preset)) setFormula(latex, preset, 'complex');
        } else {
            // Digits (no data-latex) use the value directly; LaTeX symbols
            // have data-latex.
            const latex = r.dataset.latex || v;
            if (latex) setSymbolLatex(latex);
        }
    }
    // Initial display: restore last-selected radio from localStorage
    // (covers SYMBOLE / FORMELN / KOMPLEX since they share name="digit"),
    // else any currently-checked radio, else default.
    function applyInitialSelection() {
        let stored = null;
        try { stored = localStorage.getItem('draw20-radio-value'); } catch (_) {}
        if (stored) {
            const r = document.querySelector(`input[name="digit"][value="${stored}"]`);
            if (r) {
                r.checked = true;
                dispatchRadio(r);
                return;
            }
        }
        const checked = document.querySelector('input[name="digit"]:checked');
        if (checked) dispatchRadio(checked);
        else setFormula(defaultLatex, defaultPreset);
    }

    // The radio grid is built by the inline script in morph.html during
    // parse; it exists by DOMContentLoaded. Defensive retry anyway.
    function tryAttachRadios() {
        if (document.querySelector('input[name="digit"]')) {
            attachAllRadios();
            applyInitialSelection();
        } else {
            setTimeout(tryAttachRadios, 50);
        }
    }
    tryAttachRadios();

    // ── Centralized toggle application ──────────────────────────────────────
    // Single source of truth: walks ALL render layers (overlay + morphLayer
    // is inside overlay so it's covered by the overlay query; stiftOutlineSvg
    // separately) and applies five toggles uniformly via data-kind selectors.
    // The grey bboxes (rect[data-kind="bbox"]) stay visible regardless.
    function applyAllToggles() {
        const flags = {
            lines:      document.getElementById('lines-toggle')?.checked ?? true,
            points:     document.getElementById('points-toggle')?.checked ?? true,
            pixel:      document.getElementById('art-toggle')?.checked ?? true,
            fill:       document.getElementById('fill-toggle')?.checked ?? false,
            morphLines: document.getElementById('correspondence-toggle')?.checked ?? false,
        };
        const setDisp = (el, on) => { el.style.display = on ? '' : 'none'; };
        const apply = (layer) => {
            layer.querySelectorAll('[data-kind="stroke"]').forEach(e => setDisp(e, flags.lines));
            layer.querySelectorAll('[data-kind="point"]').forEach(e => setDisp(e, flags.points));
            layer.querySelectorAll('[data-kind="fill"]').forEach(e => setDisp(e, flags.fill));
            layer.querySelectorAll('[data-kind="ghost"]').forEach(e => setDisp(e, flags.fill));
            layer.querySelectorAll('[data-kind="corr-line"]').forEach(e => setDisp(e, flags.morphLines));
        };
        apply(overlay);
        apply(stiftOutlineSvg);
        // Morph paths share fill with the pixel ink: fill OR stroke-only.
        overlay.querySelectorAll('path[data-kind="stroke"][data-source="morph"]').forEach(p => {
            p.setAttribute('fill', flags.fill ? '#adff2f' : 'none');
        });
        // PIXEL: opacity, not visibility — keeps mouse events working on
        // stiftCanvas and avoids clash with display='none' set by renderBBoxes.
        pix.style.opacity = flags.pixel ? '' : '0';
        tex.style.opacity = flags.pixel ? '' : '0';
        stiftCanvas.style.opacity = flags.pixel ? '' : '0';
    }
    // Back-compat aliases — other modules still call these individually
    // (e.g. draw20-stift onAfterOutlinesChanged callback, draw20-render
    // applyToggles after drawContours). All route to applyAllToggles now.
    const applyLinesToggle = applyAllToggles;
    const applyPointsToggle = applyAllToggles;
    const applyArtToggle = applyAllToggles;
    const applyFillToggle = applyAllToggles;
    function attachToggles() {
        const ids = ['lines-toggle', 'points-toggle', 'art-toggle', 'fill-toggle', 'correspondence-toggle'];
        const els = ids.map(id => document.getElementById(id));
        if (els.some(e => !e)) { setTimeout(attachToggles, 50); return; }
        els.forEach(e => e.addEventListener('change', applyAllToggles));
        applyAllToggles();
    }
    attachToggles();
    // Cross-module hook: renderMorph (in draw20-morph.js) must reapply
    // toggles after creating new SVG elements. Phase B will wire this via
    // the factory API; for now expose globally.
    if (typeof window !== 'undefined') window.__draw20ApplyAllToggles = applyAllToggles;

    // L / P keys mirror the legacy points/lines toggles — but legacy just
    // flips `.checked` without dispatching a change event, so the draw20
    // apply* listeners never fire. AND legacy ran AFTER us (bubble phase)
    // would flip the checkbox a SECOND time → net-zero visual toggle but
    // applyToggle ran with the intermediate state → desync.
    // Solution: capture-phase + stopImmediatePropagation so legacy never
    // sees the L/P keydown.
    document.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (e.key === 'l' || e.key === 'L') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const t = document.getElementById('lines-toggle');
            if (t) t.checked = !t.checked;
            applyLinesToggle();
        } else if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const t = document.getElementById('points-toggle');
            if (t) t.checked = !t.checked;
            applyPointsToggle();
        }
    }, true);

    // ── Right-click context menu (custom). ──────────────────────────────────
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

    // ── RING button ─────────────────────────────────────────────────────────
    // Placed directly below the similarity-box info card (same width, same
    // left edge, similar styling) so it visually belongs to the diagnostic-
    // info stack. Sits inside canvas-container with an inline display
    // override against the global `> * { display: none !important }` rule.
    const ringBtn = document.createElement('button');
    ringBtn.id = 'draw20-ring-btn';
    ringBtn.textContent = 'RING';
    ringBtn.title = 'Alle Outer-Polygone im Ring anzeigen (neues Fenster)';
    if (typeof openPolygonRing === 'function') {
        ringBtn.addEventListener('click', openPolygonRing);
    }
    host.appendChild(ringBtn);

    // ── 3D MORPH button ─────────────────────────────────────────────────────
    // Button creation + window-spawn logic live in morph3d.js. Layout
    // (position-below-RING) is handled here so the whole stack stays in sync.
    const morph3dBtn = (typeof Morph3D !== 'undefined' && Morph3D.createMorph3DButton)
        ? Morph3D.createMorph3DButton(host, openMorph3D)
        : null;

    // Shared styling for both buttons (RING + 3D MORPH).
    const stackBtnCss = `
        position: absolute !important;
        display: block !important;
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

    // Position both buttons below the similarity-box. Re-position on every
    // render (in case the sim-box size changed) and on resize.
    function positionRingBtn() {
        const sim = document.getElementById('similarity-box');
        if (!sim) { setTimeout(positionRingBtn, 100); return; }
        const simRect = sim.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();
        const left = simRect.left - hostRect.left;
        const width = simRect.width;
        const ringTop = simRect.bottom - hostRect.top + 8;
        ringBtn.style.cssText = stackBtnCss + `top:${ringTop}px;left:${left}px;width:${width}px;`;
        // 3D MORPH directly under RING with the same gap.
        if (morph3dBtn) {
            const ringRect = ringBtn.getBoundingClientRect();
            const morphTop = ringRect.bottom - hostRect.top + 8;
            morph3dBtn.style.cssText = stackBtnCss + `top:${morphTop}px;left:${left}px;width:${width}px;`;
        }
    }
    positionRingBtn();
    window.addEventListener('resize', positionRingBtn);

    return {
        // Centralized toggle pass — single entry point. Other code (stift's
        // onAfterOutlinesChanged, drawContours epilogue, etc.) should call
        // this after re-rendering layers.
        applyAllToggles,
        // Back-compat aliases (route to applyAllToggles internally).
        applyLinesToggle, applyPointsToggle, applyArtToggle, applyFillToggle,
        // Expose setters so init() can also kick the initial selection
        // path manually if needed.
        setFormula, setSymbolLatex,
        // Repositioning hook (called by zoom/render code).
        positionRingBtn,
    };
}
