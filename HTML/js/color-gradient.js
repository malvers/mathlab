/**
 * CyberGradient — editable colour gradient, ported from Docs Java ColorGradient
 * (~/IdeaProjects/Colorizer/src/{ColorGradient,ColorSeperator}.java).
 *
 * The model is his: a gradient is a list of SEPARATORS, each with a position
 * (0…1) and TWO colours — one to its left, one to its right. Equal colours make
 * a smooth passage, different ones a hard edge. Between two separators the
 * colour is interpolated from the left one's RIGHT colour to the right one's
 * LEFT colour.
 *
 *   const g = CyberGradient.create(hostElement, {
 *       key: 'my-lab-gradient',        // localStorage key (optional)
 *       stops: [{ v: 0, left: '#799E31', right: '#799E31' }, …],
 *       onChange: (g) => { … }
 *   });
 *   g.colorAt(0.37)   → [r, g, b]      single value
 *   g.lut(256)        → Uint8Array     fast lookup for per-pixel work
 *
 * Mouse: drag a separator · double-click the strip adds one · click selects and
 * shows its two colour wells · ⌫ removes (never the two ends).
 * Keys while focused: S shows/hides the separators, ⌫/Delete removes.
 */
const CyberGradient = (function () {
    'use strict';

    const CSS_ID = 'cyber-gradient-css';
    const CSS = `
        /* --cg-gap is the distance strip → separators; the connectors bridge exactly it */
        .cg-wrap { position: relative; user-select: none; --cg-h: 34px; --cg-pin: 14px; --cg-gap: 8px; }
        /* the widget takes focus so S and ⌫ work — but without the browser's blue ring */
        .cg-wrap:focus, .cg-wrap:focus-visible { outline: none; }
        .cg-strip {
            display: block; width: 100%; height: var(--cg-h);
            border: none; cursor: crosshair;
            /* square at the bottom — that edge faces the separators */
            border-radius: 8px 8px 0 0;
        }
        .cg-marks { position: relative; height: var(--cg-pin); margin-top: var(--cg-gap); }
        .cg-pin {
            position: absolute; top: 0; width: var(--cg-pin); height: var(--cg-pin);
            margin-left: calc(var(--cg-pin) / -2); border-radius: 3px;
            border: none;                       /* pure colour, no frame */
            cursor: grab; box-sizing: border-box; overflow: hidden;
        }
        .cg-pin.sel { box-shadow: 0 0 0 2px #00d2ff; }
        /* tick from the handle up to the strip — its own element, because the pin
           clips its content (overflow: hidden keeps the colour halves rounded) */
        .cg-tick {
            position: absolute;
            bottom: 100%;
            width: 2px; height: var(--cg-gap);
            margin-left: -1px;
        }
        .cg-tick.first { margin-left: 0; }
        .cg-tick.last { margin-left: -2px; }
        /* the two ends are HALF pins, flush with the edge of the strip: the outer side
           is straight because there is nothing beyond it */
        .cg-pin.first {
            margin-left: 0; width: calc(var(--cg-pin) / 2);
            border-radius: 0 3px 3px 0;
        }
        .cg-pin.last {
            margin-left: calc(var(--cg-pin) / -2); width: calc(var(--cg-pin) / 2);
            border-radius: 3px 0 0 3px;
        }
        .cg-pin i { display: block; width: 50%; height: 100%; float: left; }
        .cg-edit {
            display: none; align-items: center; justify-content: center; gap: 18px; margin-top: 28px;
            font-family: 'Orbitron', sans-serif; font-size: 0.62rem;
            color: rgba(190, 214, 246, 0.8);
        }
        .cg-edit.on { display: flex; }
        /* the word sits UNDER its colour well */
        .cg-side { display: inline-flex; flex-direction: column-reverse; align-items: center; gap: 5px; }
        .cg-side b { font-weight: 400; }
        /* the wells show pure colour — no frame around them */
        .cg-edit input[type="color"] {
            width: 40px; height: 26px; padding: 0; border: none;
            border-radius: 5px; background: transparent; cursor: pointer;
        }
        .cg-edit input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        .cg-edit input[type="color"]::-webkit-color-swatch { border: none; border-radius: 5px; }
        .cg-edit input[type="color"]::-moz-color-swatch { border: none; border-radius: 5px; }
        /* small popup on right-click — no native menu, no native confirm */
        .cg-menu {
            position: fixed; z-index: 90;
            background: rgb(12, 30, 64);
            border: 1px solid rgba(120, 160, 220, 0.35);
            border-radius: 8px; padding: 4px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
        }
        .cg-menu button {
            display: block; width: 100%;
            font-family: 'Orbitron', sans-serif; font-size: 0.66rem; letter-spacing: 0.05em;
            padding: 8px 16px; border: none; border-radius: 6px;
            background: transparent; color: rgb(214, 92, 82); cursor: pointer;
        }
        .cg-menu button:hover { background: rgba(176, 36, 24, 0.18); }

        .cg-hint {
            margin-top: 6px; text-align: center;
            font-family: 'Outfit', sans-serif; font-size: 0.68rem;
            color: rgba(190, 214, 246, 0.5); line-height: 1.45;
        }
    `;

    function injectCss() {
        if (document.getElementById(CSS_ID)) return;
        const st = document.createElement('style');
        st.id = CSS_ID;
        st.textContent = CSS;
        document.head.appendChild(st);
    }

    const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const hex2rgb = (h) => {
        const s = h.replace('#', '');
        return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    };
    const rgb2hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

    function create(host, opts) {
        injectCss();
        opts = opts || {};
        const key = opts.key || null;
        const onChange = opts.onChange || function () { };

        /* --- model: separators sorted by position, ends pinned at 0 and 1 --- */
        let stops = (opts.stops || [
            { v: 0, left: '#799E31', right: '#799E31' },
            { v: 1, left: '#B02418', right: '#B02418' }
        ]).map((s) => ({ v: clamp01(s.v), left: s.left, right: s.right || s.left }));

        let sel = -1, drag = -1, showPins = true, lutCache = null;

        function load() {
            if (!key) return;
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const o = JSON.parse(raw);
                if (Array.isArray(o) && o.length >= 2) {
                    stops = o.map((s) => ({ v: clamp01(s.v), left: s.left, right: s.right || s.left }));
                }
            } catch (e) { }
        }

        function save() {
            if (!key) return;
            try { localStorage.setItem(key, JSON.stringify(stops)); } catch (e) { }
        }

        function sort() {
            stops.sort((a, b) => a.v - b.v);
            stops[0].v = 0;
            stops[stops.length - 1].v = 1;
        }

        /* --- the gradient itself: right colour of the left stop → left colour of the right one --- */
        function colorAt(t) {
            t = clamp01(t);
            for (let i = 0; i < stops.length - 1; i++) {
                const a = stops[i], b = stops[i + 1];
                if (t >= a.v && t <= b.v) {
                    const span = b.v - a.v;
                    const f = span <= 1e-9 ? 0 : (t - a.v) / span;
                    const ca = hex2rgb(a.right), cb = hex2rgb(b.left);
                    return [ca[0] + f * (cb[0] - ca[0]), ca[1] + f * (cb[1] - ca[1]), ca[2] + f * (cb[2] - ca[2])];
                }
            }
            return hex2rgb(stops[stops.length - 1].left);
        }

        /* 256 entries as a flat Uint8Array — for per-pixel work (heatmaps, image tinting) */
        function lut(n) {
            n = n || 256;
            if (lutCache && lutCache.n === n) return lutCache.data;
            const data = new Uint8Array(n * 3);
            for (let i = 0; i < n; i++) {
                const c = colorAt(i / (n - 1));
                data[i * 3] = c[0]; data[i * 3 + 1] = c[1]; data[i * 3 + 2] = c[2];
            }
            lutCache = { n: n, data: data };
            return data;
        }

        /* --- markup --- */
        const wrap = document.createElement('div');
        wrap.className = 'cg-wrap';
        wrap.tabIndex = 0;
        /* the same widget serves a narrow sidebar and a large window */
        if (opts.stripHeight) wrap.style.setProperty('--cg-h', opts.stripHeight + 'px');
        if (opts.pinSize) wrap.style.setProperty('--cg-pin', opts.pinSize + 'px');
        wrap.innerHTML =
            '<canvas class="cg-strip"></canvas>' +
            '<div class="cg-marks"></div>' +
            '<div class="cg-edit">' +
            '  <span class="cg-side cg-side-l"><b>links</b><input type="color" class="cg-l" aria-label="Farbe links"></span>' +
            '  <span class="cg-side cg-side-b"><b>beide</b><input type="color" class="cg-b" aria-label="Beide Farben"></span>' +
            '  <span class="cg-side cg-side-r"><b>rechts</b><input type="color" class="cg-r" aria-label="Farbe rechts"></span>' +
            '</div>' +
            /* the hint line is opt-in — most pages carry that information elsewhere */
            (opts.hint ? '<div class="cg-hint">Doppelklick setzt einen Trenner · ziehen verschiebt · ' +
                'rechte Maustaste löscht · S blendet die Trenner aus</div>' : '');
        host.appendChild(wrap);

        const strip = wrap.querySelector('.cg-strip');
        const marks = wrap.querySelector('.cg-marks');
        const edit = wrap.querySelector('.cg-edit');
        const inL = wrap.querySelector('.cg-l');
        const inR = wrap.querySelector('.cg-r');
        const inB = wrap.querySelector('.cg-b');
        const sideL = wrap.querySelector('.cg-side-l');
        const sideR = wrap.querySelector('.cg-side-r');
        const sideB = wrap.querySelector('.cg-side-b');
        const ctx = strip.getContext('2d');

        function paint() {
            const w = Math.max(1, strip.clientWidth);
            const h = Math.max(1, strip.clientHeight || opts.stripHeight || 34);
            const dpr = window.devicePixelRatio || 1;
            strip.width = Math.round(w * dpr);
            strip.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            /* draw column by column — a hard edge must stay hard */
            for (let x = 0; x < w; x++) {
                const c = colorAt(x / (w - 1));
                ctx.fillStyle = 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')';
                ctx.fillRect(x, 0, 1, h);
            }
            /* The two ends have only ONE meaningful colour: nothing lies left of 0 and
               nothing right of 1 — so they are drawn as single colour chips. */
            marks.innerHTML = showPins ? stops.map((s, i) => {
                const first = i === 0, last = i === stops.length - 1;
                /* the connector carries the separator's own colours — for a hard edge
                   its two pixels differ, exactly like the gradient does at that spot */
                const tick = '<span class="cg-tick' + (first ? ' first' : last ? ' last' : '') +
                    '" style="left:' + (s.v * 100).toFixed(3) + '%;background:linear-gradient(90deg,' +
                    (first ? s.right : s.left) + ' 50%,' + (last ? s.left : s.right) + ' 50%)"></span>';
                const halves = first ? '<i style="width:100%;background:' + s.right + '"></i>'
                    : last ? '<i style="width:100%;background:' + s.left + '"></i>'
                        : '<i style="background:' + s.left + '"></i><i style="background:' + s.right + '"></i>';
                return tick + '<span class="cg-pin' + (i === sel ? ' sel' : '') +
                    (first ? ' first' : last ? ' last' : '') +
                    '" data-i="' + i + '" style="left:' + (s.v * 100).toFixed(3) + '%">' + halves + '</span>';
            }).join('') : '';
            edit.classList.toggle('on', showPins && sel >= 0);
            if (sel >= 0) {
                const first = sel === 0, last = sel === stops.length - 1;
                inL.value = stops[sel].left;
                inR.value = stops[sel].right;
                inB.value = stops[sel].left;
                sideL.style.display = first ? 'none' : '';
                sideR.style.display = last ? 'none' : '';
                /* "beide" only makes sense where there are two sides */
                sideB.style.display = (first || last) ? 'none' : '';
                sideL.querySelector('b').textContent = last ? 'Farbe' : 'links';
                sideR.querySelector('b').textContent = first ? 'Farbe' : 'rechts';
                /* the words stay neutral — the wells right above them carry the colour */
                sideL.querySelector('b').style.color = '';
                sideR.querySelector('b').style.color = '';
                sideB.querySelector('b').style.color = '';
            }
        }

        function changed() {
            lutCache = null;
            sort();
            paint();
            save();
            onChange(api);
        }

        const posOf = (e) => {
            const r = strip.getBoundingClientRect();
            const t = e.touches ? e.touches[0] : e;
            return clamp01((t.clientX - r.left) / Math.max(1, r.width));
        };

        marks.addEventListener('mousedown', (e) => {
            const pin = e.target.closest('.cg-pin');
            if (!pin) return;
            sel = parseInt(pin.dataset.i, 10);
            drag = sel;
            wrap.focus();
            paint();
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (drag < 0) return;
            if (drag === 0 || drag === stops.length - 1) return;   // the ends stay put
            stops[drag].v = posOf(e);
            const moved = stops[drag];
            changed();
            sel = stops.indexOf(moved);
            drag = sel;
            paint();
        });

        window.addEventListener('mouseup', () => { drag = -1; });

        strip.addEventListener('dblclick', (e) => {
            const v = posOf(e);
            const c = rgb2hex(colorAt(v));
            const s = { v: v, left: c, right: c };
            stops.push(s);
            changed();
            sel = stops.indexOf(s);
            paint();
        });

        inL.addEventListener('input', () => {
            if (sel < 0) return;
            stops[sel].left = inL.value;
            if (sel === stops.length - 1) stops[sel].right = inL.value;   // the last one is single
            changed();
        });
        inR.addEventListener('input', () => {
            if (sel < 0) return;
            stops[sel].right = inR.value;
            if (sel === 0) stops[sel].left = inR.value;                   // the first one is single
            changed();
        });

        /* one well for both sides — the usual case: a smooth passage */
        inB.addEventListener('input', () => {
            if (sel < 0) return;
            stops[sel].left = inB.value;
            stops[sel].right = inB.value;
            changed();
        });

        function removeSel() {
            if (sel <= 0 || sel >= stops.length - 1) return;
            stops.splice(sel, 1);
            sel = Math.max(0, Math.min(sel - 1, stops.length - 1));   // keep a selection
            changed();
        }
        /* right-click a separator: a small popup asks first (the two ends have none) */
        let menu = null;

        /* a click INSIDE the popup must reach the button — only clicks outside close it */
        function onDocDown(ev) {
            if (menu && menu.contains(ev.target)) return;
            closeMenu();
        }
        function onDocKey() { closeMenu(); }

        function closeMenu() {
            if (!menu) return;
            menu.remove();
            menu = null;
            window.removeEventListener('mousedown', onDocDown);
            window.removeEventListener('keydown', onDocKey);
        }

        function openMenu(x, y, i) {
            closeMenu();
            menu = document.createElement('div');
            menu.className = 'cg-menu';
            menu.innerHTML = '<button type="button">Trenner löschen</button>';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            document.body.appendChild(menu);
            menu.querySelector('button').addEventListener('click', () => {
                sel = i;
                closeMenu();
                removeSel();
            });
            /* anything outside closes it again */
            setTimeout(() => {
                window.addEventListener('mousedown', onDocDown);
                window.addEventListener('keydown', onDocKey);
            }, 0);
        }

        marks.addEventListener('contextmenu', (e) => {
            const pin = e.target.closest('.cg-pin');
            if (!pin) return;
            e.preventDefault();
            const i = parseInt(pin.dataset.i, 10);
            if (i <= 0 || i >= stops.length - 1) return;
            sel = i;
            paint();
            openMenu(e.clientX, e.clientY, i);
        });

        wrap.addEventListener('keydown', (e) => {
            const k = e.key.toLowerCase();
            if (k === 's') { showPins = !showPins; paint(); e.preventDefault(); }
            else if (k === 'backspace' || k === 'delete') { removeSel(); e.preventDefault(); }
        });

        window.addEventListener('resize', paint);

        load();
        sort();
        /* always keep one separator selected — the colour row stays put and the window
           does not jump in height */
        sel = Math.min(1, stops.length - 1);
        paint();

        const api = {
            colorAt: colorAt,
            lut: lut,
            get stops() { return stops.map((s) => ({ v: s.v, left: s.left, right: s.right })); },
            set stops(list) {
                stops = list.map((s) => ({ v: clamp01(s.v), left: s.left, right: s.right || s.left }));
                sel = -1;
                changed();
            },
            repaint: paint,
            element: wrap
        };
        return api;
    }

    return { create: create };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { CyberGradient };
