/* buch.js — behaviour of the interactive textbook pages (HTML/buch/…), shared by every chapter.
 *
 * A chapter page is plain HTML; this file turns its markup into the book:
 *   section.b-sec[id][data-toc]          → entry in the chapter list (left) and the pill strip (narrow screens)
 *   .b-tasks > .b-task[data-lvl]         → numbered task with level mark, "Tipp" / "Lösung" buttons for .b-hint / .b-sol
 *   .b-check > .b-q[data-ans] / [data-mc]→ self-check: answer field (fraction, decimal comma or percent) or choice
 *   a.b-lab[data-lab]                    → lab card with the lab's own icon from js/labs-icons.js
 *   [data-widget="name"]                 → interactive widget registered with Buch.widget(name, init)
 * Maths: $…$ and $$…$$ via KaTeX auto-render (loaded by the page, fires 'katex-ready').
 * Solved self-checks are remembered per browser (localStorage, wrapped - the page works without it).
 * Debug window (js/debug-window.js) only with ?debug in the address.
 */
(function () {
    'use strict';

    // The debug window only on request: ?debug in the address (Doc, 09.10.2026: "im Moment brauchen wir es ja nicht").
    // Loaded from beside this file; its own autostart (DOMContentLoaded) may already be past, so start it here.
    const ME = document.currentScript && document.currentScript.src;
    if (ME && new URLSearchParams(location.search).has('debug')) {
        const sc = document.createElement('script');
        sc.src = ME.replace(/buch\.js(\?.*)?$/, 'debug-window.js');
        sc.onload = () => { try { DebugWindow.init(); dbg('debug window on'); } catch (_) { } };
        document.head.appendChild(sc);
    }

    function dbg(msg) {
        try { if (typeof DebugWindow !== 'undefined' && DebugWindow.log) DebugWindow.log('[buch] ' + msg); } catch (_) { }
    }

    // ---------- numbers ----------
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }

    // exact fractions for probabilities read off a tree (integers only)
    class Frac {
        constructor(n, d = 1) {
            if (d < 0) { n = -n; d = -d; }
            const g = gcd(n, d);
            this.n = n / g; this.d = d / g;
        }
        mul(o) { return new Frac(this.n * o.n, this.d * o.d); }
        add(o) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
        sub(o) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
        get value() { return this.n / this.d; }
        tex() { return this.d === 1 ? String(this.n) : '\\tfrac{' + this.n + '}{' + this.d + '}'; }
        texBig() { return this.d === 1 ? String(this.n) : '\\dfrac{' + this.n + '}{' + this.d + '}'; }
    }

    // German number: comma, up to `digits` decimals, trailing zeros dropped
    function fmt(x, digits = 4) {
        if (!isFinite(x)) return '–';
        let s = Number(x).toFixed(digits);
        if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
        return s.replace('.', ',');
    }
    // the same inside TeX: the comma must not add space ({,})
    function texNum(x, digits = 4) { return fmt(x, digits).replace(',', '{,}'); }
    // terms in TeX: signed number "+ 2{,}5" / "- 2{,}5" (empty for 0; first = no plus in front)
    function sg(v, d = 2, first = false) {
        if (Math.abs(v) < 1e-12) return '';
        const s = texNum(Math.abs(v), d);
        if (first) return (v < 0 ? '-' : '') + s;
        return v < 0 ? ' - ' + s : ' + ' + s;
    }
    // coefficient in front of a variable: 1 → "", −1 → "-", else the number
    function co(v, d = 2) { return Math.abs(v - 1) < 1e-9 ? '' : Math.abs(v + 1) < 1e-9 ? '-' : texNum(v, d); }
    // signed term with a variable: "+ x", "- 2{,}5x", empty for 0
    function sgx(v, x, d = 2) { if (Math.abs(v) < 1e-12) return ''; const a = Math.abs(v); return (v < 0 ? ' - ' : ' + ') + (Math.abs(a - 1) < 1e-9 ? '' : texNum(a, d)) + x; }
    // a term in JS notation ("x^2", "2^x", "sin(x)") as a function of x
    function compile(expr) {
        const e = String(expr).replace(/\^/g, '**');
        // eslint-disable-next-line no-new-func
        return new Function('x', 'with (Math) { return (' + e + '); }');
    }
    function pct(x, digits = 1) { return fmt(x * 100, digits) + ' %'; }

    // what a student types: "1/36", "0,25", "25 %", "≈ 0.49", "1 / 3"
    function parseAnswer(raw) {
        if (raw == null) return NaN;
        let s = String(raw).trim().replace(/[≈~\s]/g, '').replace(/−/g, '-');
        if (!s) return NaN;
        let percent = false;
        if (s.endsWith('%')) { percent = true; s = s.slice(0, -1); }
        s = s.replace(/,/g, '.');
        let v;
        const m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
        if (m) v = parseFloat(m[1]) / parseFloat(m[2]);
        else if (/^-?\d*\.?\d+(e-?\d+)?$/i.test(s)) v = parseFloat(s);
        else return NaN;
        return percent ? v / 100 : v;
    }
    function matches(raw, expected, tol) {
        const v = parseAnswer(raw), e = parseAnswer(expected);
        if (isNaN(v) || isNaN(e)) return false;
        if (tol == null) tol = (Number.isInteger(e) && !String(expected).includes('/')) ? 0 : 0.005;
        return Math.abs(v - e) <= tol + 1e-12;
    }

    // ---------- storage (never required) ----------
    const KEY = 'buch:' + location.pathname.replace(/^.*\/buch\//, '');
    function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } }
    function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { } }
    const state = load();

    // ---------- icons (plain geometry, SVG) ----------
    const ICON = {
        ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
        bad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
    };

    // ---------- maths ----------
    const MATH_OPTS = {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false
    };
    function math(el) {
        if (!el) return;
        if (typeof window.renderMathInElement === 'function') {
            try { window.renderMathInElement(el, MATH_OPTS); } catch (e) { dbg('katex ' + e.message); }
        }
    }
    window.addEventListener('katex-ready', () => math(document.querySelector('.b-main')));

    // ---------- tasks ----------
    function buildTasks(root) {
        root.querySelectorAll('.b-tasks').forEach(list => {
            let no = parseInt(list.dataset.start || '1', 10);
            list.querySelectorAll(':scope > .b-task').forEach(task => {
                const q = task.querySelector(':scope > .b-task-q');
                const hint = task.querySelector(':scope > .b-hint');
                const sol = task.querySelector(':scope > .b-sol');
                const head = document.createElement('div');
                head.className = 'b-task-head';
                const num = document.createElement('div');
                num.className = 'b-task-no'; num.textContent = no++;
                head.appendChild(num);
                const lvl = document.createElement('span');
                lvl.className = 'b-lvl'; lvl.dataset.lvl = task.dataset.lvl || '1';
                lvl.title = ['', 'Grundlage', 'Mittel', 'Anspruchsvoll'][+lvl.dataset.lvl] || '';
                lvl.setAttribute('aria-label', 'Niveau: ' + lvl.title);
                head.appendChild(lvl);
                task.insertBefore(head, q);
                if (q) head.appendChild(q);
                if (!hint && !sol) return;
                const acts = document.createElement('div');
                acts.className = 'b-acts';
                task.insertBefore(acts, hint || sol);
                [[hint, 'Tipp', 'b-hintbtn'], [sol, 'Lösung', '']].forEach(([box, label, cls]) => {
                    if (!box) return;
                    box.classList.add('b-reveal');
                    const b = document.createElement('button');
                    b.type = 'button'; b.className = 'b-btn ' + cls; b.textContent = label;
                    b.addEventListener('click', () => {
                        const open = box.classList.toggle('open');
                        b.classList.toggle('open', open);
                    });
                    acts.appendChild(b);
                });
                // the reveals go after the buttons, hint before solution
                if (hint) task.appendChild(hint);
                if (sol) task.appendChild(sol);
            });
        });
    }

    // ---------- reveals outside a task (worked examples): own buttons, no number ----------
    function buildLoose(root) {
        root.querySelectorAll('.b-hint:not(.b-reveal), .b-sol:not(.b-reveal)').forEach(box => {
            if (box.closest('.b-task, .b-q')) return;
            box.classList.add('b-reveal', 'b-loose');
            // hint and solution side by side share one button row
            let prev = box.previousElementSibling;
            while (prev && prev.classList.contains('b-loose')) prev = prev.previousElementSibling;
            let acts = prev && prev.classList.contains('b-acts') ? prev : null;
            if (!acts) {
                acts = document.createElement('div');
                acts.className = 'b-acts b-acts-loose';
                box.parentNode.insertBefore(acts, box);
            }
            const isHint = box.classList.contains('b-hint');
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'b-btn' + (isHint ? ' b-hintbtn' : '');
            b.textContent = isHint ? 'Tipp' : 'Lösung zeigen';
            b.addEventListener('click', () => b.classList.toggle('open', box.classList.toggle('open')));
            acts.appendChild(b);
        });
    }

    // ---------- self-checks ----------
    function buildChecks(root) {
        root.querySelectorAll('.b-check').forEach((box, bi) => {
            const id = box.dataset.check || ('c' + bi);
            const qs = Array.from(box.querySelectorAll('.b-q'));
            const title = box.querySelector('.b-box-title');
            let score = null;
            if (title && qs.length) {
                score = document.createElement('span');
                score.className = 'b-check-score';
                title.appendChild(score);
            }
            function updateScore() {
                if (!score) return;
                const done = qs.filter((_, i) => state[id + ':' + i]).length;
                score.textContent = done + ' / ' + qs.length;
                score.classList.toggle('full', done === qs.length);
            }
            qs.forEach((q, i) => {
                const sk = id + ':' + i;
                const sol = q.querySelector(':scope > .b-sol');
                if (sol) sol.classList.add('b-reveal');
                let tries = 0;
                function showSol() { if (sol) sol.classList.add('open'); }
                function solved(val) {
                    state[sk] = val == null ? 1 : val; save(state); updateScore(); showSol();
                }
                if (q.dataset.mc != null) {
                    const btns = Array.from(q.querySelectorAll('.b-mc > button'));
                    const right = parseInt(q.dataset.mc, 10);
                    btns.forEach((b, bi2) => {
                        b.type = 'button';
                        b.addEventListener('click', () => {
                            if (bi2 === right) {
                                btns.forEach(x => x.classList.remove('bad'));
                                b.classList.add('ok'); solved(1);
                            } else {
                                b.classList.add('bad'); tries++;
                                if (tries >= 2) { btns[right].classList.add('ok'); showSol(); }
                            }
                        });
                    });
                    if (state[sk]) { btns[right] && btns[right].classList.add('ok'); showSol(); }
                    return;
                }
                if (q.dataset.ans == null) return;
                if (PRINT) {                                                       // paper: a line to write on
                    const line = document.createElement('div');
                    line.className = 'b-answer'; line.textContent = (q.dataset.label || 'Ergebnis') + ':';
                    q.insertBefore(line, sol || null);
                    return;
                }
                const row = document.createElement('div');
                row.className = 'b-ask';
                const inId = 'b-in-' + id + '-' + i;
                row.innerHTML =
                    '<label for="' + inId + '">' + (q.dataset.label || 'Ergebnis') + '</label>' +
                    '<input class="b-in" id="' + inId + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="' + (q.dataset.ph || 'z. B. 3/10') + '">' +
                    '<button type="button" class="b-btn">Prüfen</button>' +
                    '<span class="b-fb" aria-live="polite"></span>';
                q.insertBefore(row, sol || null);
                const input = row.querySelector('input'), btn = row.querySelector('button'), fb = row.querySelector('.b-fb');
                function check() {
                    if (!input.value.trim()) return;
                    const ok = matches(input.value, q.dataset.ans, q.dataset.tol != null ? parseFloat(q.dataset.tol) : null);
                    input.classList.toggle('ok', ok); input.classList.toggle('bad', !ok);
                    fb.className = 'b-fb ' + (ok ? 'ok' : 'bad');
                    if (ok) { fb.innerHTML = ICON.ok + ' richtig'; solved(input.value); dbg('check ' + sk + ' ok'); return; }
                    tries++;
                    fb.innerHTML = ICON.bad + (tries >= 2 && sol ? ' noch nicht – schau dir die Lösung an' : ' noch nicht – versuch es noch einmal');
                    if (tries >= 2) showSol();
                }
                btn.addEventListener('click', check);
                input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
                if (state[sk]) {
                    input.value = typeof state[sk] === 'string' ? state[sk] : '';
                    input.classList.add('ok'); fb.className = 'b-fb ok'; fb.innerHTML = ICON.ok + ' richtig'; showSol();
                }
            });
            updateScore();
        });
    }

    // ---------- lab cards ----------
    function buildLabs(root) {
        root.querySelectorAll('a.b-lab').forEach(a => {
            a.target = '_blank'; a.rel = 'noopener';
            const slot = a.querySelector('.b-lab-icon');
            if (slot && !slot.innerHTML.trim()) {
                const icons = (typeof LAB_ICONS !== 'undefined') ? LAB_ICONS : null;
                slot.innerHTML = (icons && icons[a.dataset.lab]) || ICON.ext;
            }
        });
    }

    // ---------- chapter list + strip + scroll progress ----------
    function buildToc() {
        const secs = Array.from(document.querySelectorAll('section.b-sec[id][data-toc]'));
        const toc = document.querySelector('.b-toc-list');
        const strip = document.querySelector('.b-strip');
        const links = [];
        secs.forEach(s => {
            const k = s.dataset.tocK || '';
            const label = s.dataset.toc;
            if (toc) {
                const a = document.createElement('a');
                a.href = '#' + s.id;
                a.innerHTML = '<span class="b-toc-k">' + k + '</span><span>' + label + '</span>';
                toc.appendChild(a); links.push([s, a]);
            }
            if (strip) {
                const p = document.createElement('a');
                p.href = '#' + s.id; p.textContent = s.dataset.tocShort || label;
                strip.appendChild(p); links.push([s, p]);
            }
        });
        const bar = document.querySelector('.b-progress');
        let current = null;
        function onScroll() {
            const head = document.querySelector('.b-top');
            const off = (head ? head.offsetHeight : 0) + 90;
            let cur = secs[0] || null;
            secs.forEach(s => { if (s.getBoundingClientRect().top - off <= 0) cur = s; });
            if (cur !== current) {
                current = cur;
                links.forEach(([s, a]) => a.classList.toggle('active', s === cur));
                const pill = links.find(([s, a]) => s === cur && a.parentElement === strip);
                if (pill && strip && strip.offsetParent !== null) {
                    const a = pill[1];
                    strip.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
                }
            }
            if (bar) {
                const max = document.documentElement.scrollHeight - innerHeight;
                bar.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%';
            }
        }
        addEventListener('scroll', onScroll, { passive: true });
        addEventListener('resize', onScroll);
        onScroll();
    }

    // ---------- small controls for widgets ----------
    // slider row: label, range, live value; returns { input, get, set }
    let rangeNo = 0;
    function range(parent, o) {
        const id = 'b-r' + (++rangeNo);
        const row = document.createElement('div');
        row.className = 'b-range';
        row.innerHTML = '<label for="' + id + '">' + o.label + '</label>' +
            '<input class="b-slider" id="' + id + '" type="range" min="' + o.min + '" max="' + o.max + '" step="' + (o.step || 0.1) + '">' +
            '<output></output>';
        parent.appendChild(row);
        const input = row.querySelector('input'), out = row.querySelector('output');
        const show = () => { out.innerHTML = o.fmt ? o.fmt(+input.value) : fmt(+input.value, 2); };
        input.value = o.value; show();
        input.addEventListener('input', () => { show(); if (o.onInput) o.onInput(+input.value); });
        return { input, get: () => +input.value, set: v => { input.value = v; show(); } };
    }
    // segmented choice: items [[value, label]], returns { get, set }
    function seg(parent, items, value, onPick, aria) {
        const box = document.createElement('div');
        box.className = 'b-seg'; box.setAttribute('role', 'group'); if (aria) box.setAttribute('aria-label', aria);
        box.innerHTML = items.map(([v, l]) => '<button type="button" data-v="' + v + '">' + l + '</button>').join('');
        parent.appendChild(box);
        let cur = value;
        const mark = () => box.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === String(cur)));
        box.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            cur = b.dataset.v; mark(); if (onPick) onPick(cur);
        });
        mark();
        return { el: box, get: () => cur, set: v => { cur = v; mark(); } };
    }
    function div(parent, cls, html) {
        const d = document.createElement('div'); if (cls) d.className = cls; if (html != null) d.innerHTML = html;
        parent.appendChild(d); return d;
    }

    // ---------- the book: chapter list (window.BUCH from the book folder's kapitel.js) ----------
    function buildBook() {
        const B = window.BUCH; if (!B || !B.chapters) return;
        const file = (location.pathname.split('/').pop() || 'index.html');
        const i = B.chapters.findIndex(c => c.file === file);
        const top = document.querySelector('.b-top-book');
        if (top && top.tagName !== 'A') {
            const a = document.createElement('a');
            a.className = 'b-top-book'; a.href = 'index.html'; a.textContent = top.textContent;
            a.title = 'Inhaltsverzeichnis des Buches';
            top.replaceWith(a);
        }
        if (i < 0) return;
        const prev = B.chapters[i - 1], next = B.chapters[i + 1];
        const nav = document.createElement('nav');
        nav.className = 'b-chapnav'; nav.setAttribute('aria-label', 'Blättern');
        const card = (c, dir) => c
            ? '<a class="b-chapcard ' + dir + '" href="' + c.file + '"><span class="b-chapcard-k">' + (dir === 'prev' ? '← ZURÜCK' : 'WEITER →') +
              ' · KAPITEL ' + c.k + '</span><span class="b-chapcard-t">' + c.title + '</span></a>'
            : '<a class="b-chapcard ' + dir + '" href="index.html"><span class="b-chapcard-k">' + (dir === 'prev' ? '← ' : '') + 'INHALT' + (dir === 'next' ? ' →' : '') +
              '</span><span class="b-chapcard-t">Alle Kapitel</span></a>';
        nav.innerHTML = card(prev, 'prev') + card(next, 'next');
        const foot = document.querySelector('.b-foot');
        if (foot) foot.parentNode.insertBefore(nav, foot); else document.querySelector('.b-main').appendChild(nav);
    }

    // the table of contents: chapter cards grouped by Lernbereich, with the solved self-checks of this browser
    function buildIndex() {
        const B = window.BUCH, box = document.querySelector('.b-chapters');
        if (!B || !box) return;
        const folder = location.pathname.replace(/^.*\/buch\//, '').replace(/[^/]*$/, '');
        let html = '', last = '';
        B.chapters.forEach(c => {
            if (c.lb !== last) { html += '<p class="b-lbhead">' + c.lb.toUpperCase() + '</p>'; last = c.lb; }
            let solved = 0;
            try { solved = Object.keys(JSON.parse(localStorage.getItem('buch:' + folder + c.file) || '{}')).length; } catch (_) { }
            html += '<a class="b-chap" href="' + c.file + '"><span class="b-chap-k">' + c.k + '<small>KAPITEL</small></span>' +
                '<span><span class="b-chap-t">' + c.title + '</span><span class="b-chap-s">' + c.sub + '</span></span>' +
                '<span class="b-chap-m">' + c.when.toUpperCase() + '<br>' + c.ustd + ' USTD.' +
                (solved ? '<br><span class="b-done">' + solved + ' GELÖST</span>' : '') + '</span></a>';
        });
        box.innerHTML = html;
    }

    // ---------- overview of the print pages: O (or the grid pill in the header) ----------
    // Doc, 09.10.2026: "wie in den Decks auf O … alle Seiten, die dann im PDF stehen werden … auf einen Blick … eine
    // auswählen und reinspringen". The pages exist only once Paged.js has set the print edition, so the overview is
    // druck.html?uebersicht in a frame over the book (built on the first O, a few seconds, kept for the next one).
    // Every block of a section carries data-ziel="file|section|n" - set here and in js/buch-druck.js from the same
    // source order, so a printed page knows where its first block lives online and the book knows where the reader is.
    function ziele(root, file) {
        root.querySelectorAll('.b-sec[id]').forEach(s => Array.from(s.children).forEach((ch, n) => { ch.dataset.ziel = file + '|' + s.id + '|' + n; }));
    }
    const FILE = location.pathname.split('/').pop() || 'index.html';
    function headOffset() {
        const top = document.querySelector('.b-top'), strip = document.querySelector('.b-strip');
        return (top ? top.offsetHeight : 0) + (strip && strip.offsetParent !== null ? strip.offsetHeight : 0);
    }
    // where the reader is: the first block not yet scrolled away under the header
    function wo() {
        const off = headOffset() + 10;
        const e = Array.from(document.querySelectorAll('.b-main [data-ziel]')).find(x => x.getBoundingClientRect().bottom > off);
        return e ? e.dataset.ziel : FILE + '||';
    }
    function hin(ziel) {
        const [f, s, n] = ziel.split('|');
        let e = n ? document.querySelector('[data-ziel="' + ziel.replace(/"/g, '') + '"]') : null;
        if (!e && s) e = document.getElementById(s);
        // instant: the page scrolls smoothly (buch.css), a jump across half a chapter would crawl
        scrollTo({ top: e ? Math.max(0, e.getBoundingClientRect().top + scrollY - headOffset() - 14) : 0, behavior: 'instant' });
    }
    // a jump into another chapter: the hash gets the section, sessionStorage the exact block
    function sprung(ziel) {
        const f = ziel.split('|')[0];
        if (f === FILE) { zu(); hin(ziel); return; }
        try { sessionStorage.setItem('buch-sprung', ziel); } catch (_) { }
        const s = ziel.split('|')[1];
        location.href = f + (s ? '#' + s : '');
    }
    let ov = null, frame = null, ovBtn = null;
    function auf() {
        if (!ov) {
            ov = document.createElement('div');
            ov.className = 'b-ov';
            frame = document.createElement('iframe');
            frame.title = 'Alle Seiten der Druckausgabe';
            frame.src = 'druck.html?uebersicht';
            ov.appendChild(frame);
            document.body.appendChild(ov);
        }
        ov.hidden = false;
        document.documentElement.classList.add('b-ov-open');
        const w = frame.contentWindow;
        if (w && w.BuchDruckOv) w.BuchDruckOv.zeige(wo());              // already built: mark the reader's page at once
        frame.focus();
    }
    function zu() {
        if (!ov || ov.hidden) return;
        ov.hidden = true;
        document.documentElement.classList.remove('b-ov-open');
        if (ovBtn) ovBtn.focus({ preventScroll: true });
    }
    function buildOverview() {
        const top = document.querySelector('.b-top');
        if (!top || !window.BUCH) return;
        ovBtn = document.createElement('button');
        ovBtn.type = 'button'; ovBtn.className = 'b-ovbtn';
        ovBtn.title = 'Alle Seiten der Druckausgabe (O)';
        ovBtn.setAttribute('aria-label', 'Alle Seiten der Druckausgabe');
        ovBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
            '<rect x="2.5" y="2.5" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="2.5" width="8.5" height="8.5" rx="1.2"/>' +
            '<rect x="2.5" y="13" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="13" width="8.5" height="8.5" rx="1.2"/></svg><span class="b-ovbtn-l">Seiten</span>';
        const book = top.querySelector('.b-top-book');
        if (book) book.after(ovBtn); else top.appendChild(ovBtn);
        ovBtn.addEventListener('click', () => { if (ov && !ov.hidden) zu(); else auf(); });
        addEventListener('keydown', e => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
            if (e.key === 'o' || e.key === 'O') { e.preventDefault(); if (ov && !ov.hidden) zu(); else auf(); }
            else if (e.key === 'Escape' && ov && !ov.hidden) zu();
        });
        // the frame calls back: where the reader is, close, jump
        window.BuchUebersicht = { wo, zu, sprung };
        // arrived from the overview of another chapter: to the exact block, once the page stands
        let ziel = null;
        try { ziel = sessionStorage.getItem('buch-sprung'); sessionStorage.removeItem('buch-sprung'); } catch (_) { }
        if (ziel && ziel.split('|')[0] === FILE) {
            requestAnimationFrame(() => hin(ziel));
            addEventListener('load', () => hin(ziel), { once: true });
        }
    }

    // ---------- widgets ----------
    const widgets = {};
    function widget(name, init) { widgets[name] = init; }
    function buildWidgets(root) {
        root.querySelectorAll('[data-widget]').forEach(el => {
            const init = widgets[el.dataset.widget];
            if (!init) { dbg('unknown widget ' + el.dataset.widget); return; }
            try { init(el); } catch (e) { dbg('widget ' + el.dataset.widget + ': ' + e.message); }
        });
    }

    // builds tasks, self-checks, examples, lab cards, widgets and maths inside root - also for content loaded later
    // (the print edition, js/buch-druck.js, fetches all chapters into one page and renders them with this)
    let PRINT = false;
    // widgets that load something first (Three.js for the vector chapters) hand in a promise; the print edition
    // waits for all of them before it freezes the canvases (js/buch-druck.js)
    const pending = [];
    function later(p) { pending.push(Promise.resolve(p).catch(e => dbg('later: ' + e.message))); return p; }
    function settled() { return Promise.all(pending.splice(0)); }
    function render(root, opt = {}) {
        PRINT = !!opt.print;
        buildTasks(root);
        buildChecks(root);
        buildLoose(root);
        buildLabs(root);
        buildWidgets(root);
        math(root);
    }
    function start() {
        if (document.body.classList.contains('b-print')) return;                // the print page renders itself
        const main = document.querySelector('.b-main') || document.body;
        ziele(main, FILE);                                                       // before render: the source order
        render(main);
        buildToc();
        buildBook();
        buildIndex();
        buildOverview();
        dbg('ready ' + KEY);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    window.Buch = { widget, math, Frac, gcd, fmt, texNum, pct, parseAnswer, matches, dbg, icon: ICON, range, seg, div, render, ziele, later, settled, printing: () => PRINT, sg, co, sgx, compile };
})();
