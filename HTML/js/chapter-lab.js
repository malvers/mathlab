/* chapter-lab.js — shared shell of the chapter labs: tab strip with chapter numbers,
 * sidebar slot per chapter, theory + exercise column, floating value panel (HUD),
 * hint line under the stage, deep link ?tab=…, arrow keys for chapter forward/back.
 *
 * Taken from the inline shell of vektoren.html (26.09.2026) so that a new chapter
 * lab does not copy it again; vektoren.html still carries its own copy.
 *
 * A chapter module is { id, build(ctx), draw(stage, ctx), onShow?(ctx), onHide?(ctx), onDrag?(ctx) }.
 * `build` runs once, the first time the tab opens.
 */
(function () {
    'use strict';

    /**
     * opt.chapters  [{ id, tab, plan, core?, dim? }] — `core` paints the plan label orange
     * opt.lib       { modules, theory(id, html), tasks(id, list), renderMath(el) }
     * opt.stage2    2D stage (resize(), render(), clearHandles(), draw, onChange)
     * opt.stage3    optional 3D stage (onReady(), resize(), render(), ready, draw)
     * opt.first     default chapter id
     */
    function start(opt) {
        const CHAPTERS = opt.chapters;
        const lib = opt.lib;
        const stage2 = opt.stage2, stage3 = opt.stage3 || null;

        const bar = document.getElementById('tab-bar');
        const sb = document.getElementById('ui-container');
        const doc = document.getElementById('v-doc');
        const wrap2 = document.getElementById('v-canvas-wrap');
        const host3 = document.getElementById('v-3d');
        const hud = document.getElementById('v-hud');
        const tip = document.getElementById('v-tip');

        // reset-view button on the stage, for stages that know their own framing
        if (wrap2 && typeof stage2.resetView === 'function') {
            const rb = document.createElement('button');
            rb.className = 'v-reset';
            rb.type = 'button';
            rb.title = 'Ansicht zurücksetzen (auch: Doppelklick auf die Bühne)';
            rb.setAttribute('aria-label', 'Ansicht zurücksetzen');
            rb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2.2"/></svg>';
            rb.addEventListener('click', () => stage2.resetView());
            wrap2.appendChild(rb);
        }

        CHAPTERS.forEach((ch, i) => {
            const b = document.createElement('button');
            b.className = 'tab-btn';
            b.dataset.tab = ch.id;
            b.innerHTML = `<span class="v-no">${i + 1}</span>${ch.tab.toUpperCase()}`;
            bar.appendChild(b);

            const s = document.createElement('div');
            s.className = 'v-tab';
            s.id = 'sb-' + ch.id;
            sb.appendChild(s);

            const d = document.createElement('div');
            d.className = 'v-doc-tab';
            d.id = 'doc-' + ch.id;
            d.innerHTML =
                `<div class="v-plan${ch.core ? ' v-plan-test' : ''}">${ch.plan}</div>` +
                `<div class="v-doc-card"><h3>Theorie</h3><div class="v-doc-body" id="doc-theory-${ch.id}"></div></div>` +
                `<div class="v-doc-card v-tasks"><h3>Aufgaben</h3><div class="v-doc-body" id="doc-tasks-${ch.id}"></div></div>`;
            doc.appendChild(d);
        });

        let current = null;   // active chapter id
        let chapterNo = 1;    // 1-based, shown in the hint line under the stage
        const built = {};     // chapters whose build() has already run
        const ctxs = {};

        /** The API a chapter module gets handed. */
        function contextFor(id) {
            if (ctxs[id]) return ctxs[id];
            const ctx = {
                id,
                sidebar: 'sb-' + id,
                stage2, stage3,
                /** Is this chapter the one on screen? */
                get active() { return current === id; },
                /** Fill the floating value panel over the stage. */
                hud(html) { if (current === id) queueHud(html); },
                /** One line of grey text at the bottom left of the stage. */
                tip(t) { if (current === id) tip.textContent = `KAPITEL ${chapterNo} / ${CHAPTERS.length}` + (t ? '  ·  ' + t : ''); },
                theory: html => lib.theory(id, html),
                tasks: list => lib.tasks(id, list),
                redraw: () => { if (current === id) renderStage(); },
            };
            ctxs[id] = ctx;
            return ctx;
        }

        // KaTeX is expensive — collapse HUD updates from a drag into one per frame
        let hudPending = null, hudRaf = 0;
        function queueHud(html) {
            hudPending = html;
            if (hudRaf) return;
            hudRaf = requestAnimationFrame(() => {
                hudRaf = 0;
                hud.innerHTML = hudPending ? `<div class="v-hud-box">${hudPending}</div>` : '';
                lib.renderMath(hud);
            });
        }

        function renderStage() {
            const ch = CHAPTERS.find(c => c.id === current);
            if (!ch) return;
            if (ch.dim === 3 && stage3) stage3.render(); else stage2.render();
        }

        function switchTab(id) {
            const ch = CHAPTERS.find(c => c.id === id);
            if (!ch) return;
            const prev = current && lib.modules[current];
            if (prev && prev.onHide && current !== id) {
                try { prev.onHide(contextFor(current)); } catch (e) { dbg('onHide ' + current + ': ' + e.message); }
            }
            current = id;
            document.querySelectorAll('#tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
            document.querySelectorAll('#ui-container .v-tab').forEach(d => d.classList.toggle('active', d.id === 'sb-' + id));
            document.querySelectorAll('#v-doc .v-doc-tab').forEach(d => d.classList.toggle('active', d.id === 'doc-' + id));
            chapterNo = CHAPTERS.indexOf(ch) + 1;
            doc.scrollTop = 0;
            hud.innerHTML = '';
            tip.textContent = `KAPITEL ${chapterNo} / ${CHAPTERS.length}`;

            const is3 = ch.dim === 3 && !!stage3;
            if (wrap2) wrap2.hidden = is3;
            if (host3) host3.hidden = !is3;

            const mod = lib.modules[id];
            if (mod) {
                const ctx = contextFor(id);
                try {
                    if (!built[id]) { mod.build(ctx); built[id] = true; }
                    stage2.clearHandles();
                    stage2.draw = null;
                    if (stage3) stage3.draw = null;
                    if (is3) stage3.onReady(() => { stage3.draw = s => mod.draw(s, ctx); stage3.resize(); if (mod.onShow) mod.onShow(ctx); renderStage(); });
                    else { stage2.draw = s => mod.draw(s, ctx); stage2.onChange = () => { if (mod.onDrag) mod.onDrag(ctx); }; if (mod.onShow) mod.onShow(ctx); }
                } catch (e) { dbg('chapter ' + id + ': ' + e.message); }
            }
            requestAnimationFrame(() => { resizeAll(); renderStage(); layoutStrip(); });
            const u = new URL(location.href);
            u.searchParams.set('tab', id);
            history.replaceState(null, '', u);
        }
        bar.addEventListener('click', e => {
            const b = e.target.closest('.tab-btn');
            if (b) switchTab(b.dataset.tab);
        });

        /** Keep the tab strip clear of the branding overlay, whose width is not fixed. */
        function layoutStrip() {
            const strip = document.getElementById('tab-strip');
            const brand = document.getElementById('branding-master-title') || document.querySelector('[id^="branding"]');
            if (!strip) return;
            let gap = 20;
            if (brand) {
                const sr = strip.getBoundingClientRect(), br = brand.getBoundingClientRect();
                if (br.width) gap = Math.max(20, Math.round(sr.right - br.left + 14));
            }
            document.getElementById('v-progress').style.marginRight = gap + 'px';
            const act = document.querySelector('#tab-bar .tab-btn.active');
            if (act) act.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
        window.addEventListener('load', layoutStrip);
        document.fonts.ready.then(layoutStrip);
        setTimeout(layoutStrip, 1200);

        function resizeAll() {
            stage2.resize();
            if (stage3 && stage3.ready) stage3.resize();
        }
        window.addEventListener('resize', () => { resizeAll(); renderStage(); layoutStrip(); });

        // deep link ?tab=…
        const q = new URLSearchParams(location.search);
        const first = CHAPTERS.some(c => c.id === q.get('tab')) ? q.get('tab') : (opt.first || CHAPTERS[0].id);
        window.addEventListener('katex-ready', () => { document.querySelectorAll('#v-doc, #v-hud').forEach(el => lib.renderMath(el)); });
        switchTab(first);

        // keyboard: chapter forward / back (but never swallow Cmd-Shift-R)
        document.addEventListener('keydown', e => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
            const i = CHAPTERS.findIndex(c => c.id === current);
            if (e.key === 'ArrowRight' && i < CHAPTERS.length - 1) switchTab(CHAPTERS[i + 1].id);
            if (e.key === 'ArrowLeft' && i > 0) switchTab(CHAPTERS[i - 1].id);
        });

        return { switchTab, get current() { return current; }, renderStage };
    }

    function dbg(msg) { if (window.DebugWindow) window.DebugWindow.log('[chapter-lab] ' + msg); }

    window.ChapterLab = { start };
})();
