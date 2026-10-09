/* farbschema.js — three colour schemes for every lab and the textbook: Blau (the original), Grau, Hell.
 * Doc, 09.10.2026: "einen Graumodus wie beim Stoffverteilungsplan und einen Hellmodus … für alle Labs".
 *
 * The labs were drawn for the dark scheme, with thousands of fixed colours in CSS, inline styles and canvas code.
 * Instead of touching every lab, this file translates colours on the fly - one place for the whole site:
 *   1. CSS:     every same-origin style rule with a colour gets a twin under html.fs-grey / html.fs-light
 *   2. inline:  style="" attributes (also the ones scripts set later) are translated in place
 *   3. canvas:  fillStyle, strokeStyle, shadowColor and gradient stops are translated while the lab draws
 * Grau follows the SVP grey scheme (svp/svp-tokens.css): blue grounds turn neutral zinc, the accents stay.
 * Hell follows the SVP light scheme: light grounds, dark text, darker accents (never the old ochre).
 * WebGL scenes keep their own colours. A page that styles all three schemes itself sets <html data-fs-native>.
 *
 * Include it in <head>, AFTER the stylesheets (a script there waits for them, so the first paint is already right):
 *     <script src="js/farbschema.js"></script>
 * Hand-made corrections live in js/farbschema.css. Test a scheme with ?farbschema=grey|light|dark in the address.
 * API: Farbschema.get(), .set('grey'), .next(), .label(mode), .mount(el), window event 'farbschema'.
 */
(function () {
    'use strict';
    if (window.Farbschema) return;

    const KEY = 'farbschema';
    const NEXT = { dark: 'grey', grey: 'light', light: 'dark' };          // the SVP cycle: Blau → Grau → Hell → Blau
    const LABEL = { dark: 'Blau', grey: 'Grau', light: 'Hell' };
    const ME = document.currentScript ? document.currentScript.src : '';
    const html = document.documentElement;

    let mode = 'dark';
    try { const s = localStorage.getItem(KEY); if (NEXT[s]) mode = s; } catch (_) { }
    try { const q = new URLSearchParams(location.search).get('farbschema'); if (NEXT[q]) mode = q; } catch (_) { }
    const forced = html.getAttribute('data-fs-force');                          // e.g. the print edition: always light, never stored
    if (NEXT[forced]) mode = forced;

    function dbg(msg) { try { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('[farbschema] ' + msg); } catch (_) { } }

    /* ===================== colours ===================== */
    const NAMED = { white: [255, 255, 255], black: [0, 0, 0], red: [255, 0, 0], lime: [0, 255, 0], green: [0, 128, 0], blue: [0, 0, 255],
        yellow: [255, 255, 0], cyan: [0, 255, 255], aqua: [0, 255, 255], magenta: [255, 0, 255], fuchsia: [255, 0, 255], orange: [255, 165, 0],
        gold: [255, 215, 0], gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192], purple: [128, 0, 128], pink: [255, 192, 203] };
    const TOKEN = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black|red|lime|green|blue|yellow|cyan|aqua|magenta|fuchsia|orange|gold|gray|grey|silver|purple|pink)\b/g;
    const HAS_COLOR = new RegExp(TOKEN.source, 'i');                               // same pattern, without the global state

    function parse(s) {
        s = s.trim().toLowerCase();
        if (s[0] === '#') {
            let h = s.slice(1);
            if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
            if (h.length !== 6 && h.length !== 8) return null;
            const n = parseInt(h.slice(0, 6), 16);
            return [(n >> 16) & 255, (n >> 8) & 255, n & 255, h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1];
        }
        if (s.startsWith('rgb')) {
            const p = s.slice(s.indexOf('(') + 1, s.lastIndexOf(')')).split(/[\s,\/]+/).filter(Boolean);
            if (p.length < 3) return null;
            const v = p.slice(0, 3).map(x => x.endsWith('%') ? parseFloat(x) * 2.55 : parseFloat(x));
            let a = p[3] != null ? (p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])) : 1;
            if (v.some(isNaN) || isNaN(a)) return null;
            return [v[0], v[1], v[2], a];
        }
        if (s.startsWith('hsl')) {
            const p = s.slice(s.indexOf('(') + 1, s.lastIndexOf(')')).split(/[\s,\/]+/).filter(Boolean);
            if (p.length < 3) return null;
            const h = parseFloat(p[0]), sat = parseFloat(p[1]) / 100, l = parseFloat(p[2]) / 100;
            const a = p[3] != null ? (p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])) : 1;
            if ([h, sat, l, a].some(isNaN)) return null;
            return fromHsl(h, sat, l).concat([a]);
        }
        if (NAMED[s]) return NAMED[s].concat([1]);
        return null;
    }
    function out(c) {
        const [r, g, b] = c.slice(0, 3).map(v => Math.round(Math.max(0, Math.min(255, v))));
        const a = Math.round(c[3] * 1000) / 1000;
        return a >= 1 ? 'rgb(' + r + ', ' + g + ', ' + b + ')' : 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    function toHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
        if (mx === mn) return [0, 0, l];
        const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
        let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        return [h * 60, s, l];
    }
    function fromHsl(h, s, l) {
        h = ((h % 360) + 360) % 360 / 360;
        if (s === 0) return [l * 255, l * 255, l * 255];
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
        return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
    }

    // The palette, exactly: these colours get hand-picked partners (SVP tokens) instead of the general rule.
    // key "r,g,b" → { grey, light } ; a role suffix (":fg", ":line") wins over the plain key.
    const EXACT = {
        '0,0,20': { grey: [26, 26, 28], light: [246, 248, 252] },                  // --space-bg
        '245,194,66:fg': { light: [30, 60, 120] },                                  // λ as text: the SVP light accent blue
        '245,194,66': { light: [226, 120, 0] },                                     // λ as line, fill, curve: deep orange, never ochre
        '255,222,0': { light: [210, 110, 0] },
        '0,210,255': { light: [28, 118, 158] },                                     // branding cyan
        '0,210,255:line': { grey: [190, 194, 202], light: [40, 70, 120] },         // cyan rims turn grey (SVP grey) / blue
        '127,216,238': { light: [28, 118, 158] },
        '121,158,49': { light: [92, 122, 32] },                                     // φ
        '160,200,90': { light: [92, 122, 32] },
        '176,36,24': { grey: [176, 36, 24], light: [176, 36, 24] },                // Υ stays
        '2,100,123:line': { grey: [120, 124, 132], light: [150, 172, 200] }
    };

    // role: 'fg' text · 'bg' ground · 'line' border/shadow · 'any' unknown (canvas, custom properties)
    function mapRGBA(c, role, m) {
        if (role === 'shadow') {                                                   // glows: same colour as a line, much fainter on white
            const v = mapRGBA(c, 'line', m);
            if (m === 'light') v[3] = c[3] * 0.28;
            return v;
        }
        const [r, g, b, a] = c;
        const key = Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b);
        const ex = EXACT[key + ':' + role] || EXACT[key];
        if (ex && ex[m]) return ex[m].concat([a]);
        let [h, s, l] = toHsl(r, g, b);
        if (role === 'any') role = l < 0.32 ? 'bg' : 'fg';
        if (role === 'bg' && l > 0.85) return c;                                   // a deliberately light ground (paper) stays
        if (role === 'fg' && l < 0.25 && m === 'light') return c;                   // dark text on such a ground stays
        if (m === 'grey') {
            if (l < 0.36 && (s < 0.85 || l < 0.2)) return fromHsl(240, 0.04, Math.min(0.9, 0.085 + l * 0.92)).concat([a]);   // blue-black → zinc
            if (s < 0.4 || (l > 0.74 && s < 0.6)) return fromHsl(240, 0.04, Math.min(0.86, l * 0.86 + 0.02)).concat([a]);  // greys, white text → zinc-300
            if (role === 'line' && h > 180 && h < 200 && s > 0.8) return [190, 194, 202, a];                                 // neon rims → grey
            return c;                                                                                                          // accents stay
        }
        // light
        if (s < 0.3 || l < 0.2 || l > 0.9 || (l > 0.74 && s < 0.6)) {             // neutral, also the pale tinted text whites
            let L = 1 - l;                                                         // neutral: lightness turns round
            if (role === 'fg' && l > 0.5) L = Math.min(L, 0.26 + (1 - l) * 0.4);    // light text → dark text
            if (role === 'bg' && l < 0.5) L = Math.max(L, 0.9);                     // dark ground → light ground
            return fromHsl(h, Math.min(s, 0.35), L).concat([a]);
        }
        if (s < 0.45) return fromHsl(h, s, Math.min(0.68, Math.max(0.42, l))).concat([a]);   // muted tones keep their tone
        if (h >= 34 && h <= 66) { h = 27; s = 1; l = 0.44; }                       // yellow/gold → orange, not ochre
        else if (h > 66 && h <= 160) l = Math.min(l, 0.33);                        // greens
        else if (h > 160 && h <= 260) l = Math.min(l, 0.38);                       // cyans, blues
        else l = Math.min(l, 0.45);                                                // reds, magentas
        return fromHsl(h, Math.max(s, 0.55), l).concat([a]);
    }
    const cache = { grey: new Map(), light: new Map() };
    function mapColor(str, role, m = mode) {
        if (m === 'dark' || typeof str !== 'string') return str;
        const k = role + '|' + str, C = cache[m];
        let v = C.get(k);
        if (v != null) return v;
        v = str.replace(TOKEN, t => { const c = parse(t); return c ? out(mapRGBA(c, role, m)) : t; });
        if (C.size > 20000) C.clear();
        C.set(k, v);
        return v;
    }
    function roleOf(prop) {
        if (prop === 'color' || prop === 'fill' || prop === '-webkit-text-fill-color' || prop === 'caret-color') return 'fg';
        if (prop.startsWith('background') || prop === 'stop-color' || prop === 'flood-color') return 'bg';
        if (prop.startsWith('--')) return 'any';
        if (prop === 'box-shadow' || prop === 'text-shadow' || prop === 'filter') return 'shadow';
        return 'line';                                                             // border, outline, shadows, stroke, column-rule …
    }

    /* ===================== 1. style sheets ===================== */
    let styleEl = null;
    const skipSheet = sh => { const n = sh.ownerNode; return n && (n.id === 'fs-mapped' || (n.dataset && n.dataset.fsSkip != null)); };
    function splitSel(t) {
        const parts = []; let depth = 0, cur = '';
        for (const ch of t) {
            if (ch === '(' || ch === '[') depth++;
            else if (ch === ')' || ch === ']') depth--;
            if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
        }
        parts.push(cur);
        return parts;
    }
    function scope(selText, m) {
        const cls = 'html.fs-' + m;
        return splitSel(selText).map(sel => {
            sel = sel.trim();
            if (/^(html|:root)\b/.test(sel)) return sel.replace(/^(html|:root)/, cls);
            return cls + ' ' + sel;
        }).join(', ');
    }
    function rulesOf(list, m, outArr) {
        for (const r of list) {
            if (r.type === 1) {                                                     // CSSStyleRule
                const st = r.style; let decl = '';
                for (let i = 0; i < st.length; i++) {
                    const p = st[i], v = st.getPropertyValue(p);
                    if (!v || !HAS_COLOR.test(v)) continue;
                    const mv = mapColor(v, roleOf(p), m);
                    if (mv !== v) decl += p + ': ' + mv + (st.getPropertyPriority(p) ? ' !important' : '') + '; ';
                }
                if (decl && r.selectorText) outArr.push(scope(r.selectorText, m) + ' { ' + decl + '}');
            } else if (r.type === 4 || r.type === 12) {                            // @media, @supports
                const inner = []; rulesOf(r.cssRules, m, inner);
                if (inner.length) outArr.push((r.type === 4 ? '@media ' + r.conditionText : '@supports ' + r.conditionText) + ' { ' + inner.join('\n') + ' }');
            } else if (r.type === 3 && r.styleSheet) {                             // @import: the imported sheet's rules
                let inner; try { inner = r.styleSheet.cssRules; } catch (_) { inner = null; }
                if (inner) rulesOf(inner, m, outArr);
            } else if (r.cssRules && r.type !== 7) {                               // @layer and friends (not keyframes)
                rulesOf(r.cssRules, m, outArr);
            }
        }
    }
    function buildCSS() {
        if (html.hasAttribute('data-fs-native')) return;
        const parts = [];
        if (mode !== 'dark') {
            for (const sh of Array.from(document.styleSheets)) {
                if (skipSheet(sh)) continue;
                let rules; try { rules = sh.cssRules; } catch (_) { continue; }    // other origins (fonts, KaTeX) stay as they are
                if (rules) rulesOf(rules, mode, parts);
            }
        }
        if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'fs-mapped'; }
        styleEl.textContent = parts.join('\n');
        (document.head || html).appendChild(styleEl);                               // always last, so it wins ties
    }
    let rebuildT = 0, frozen = false;
    function rebuildSoon() { if (frozen) return; clearTimeout(rebuildT); rebuildT = setTimeout(buildCSS, 30); }

    /* ===================== 2. inline styles ===================== */
    // per element and property: [original value, our translation]. A value that is not our translation is a new
    // original (the lab changed it) - so a colour is never translated twice, whatever else the lab sets on the element.
    const track = new WeakMap();
    let busy = false;
    function mapInline(el) {
        const st = el.style; if (!st || !st.length) return;
        let t = track.get(el);
        busy = true;
        for (let i = 0; i < st.length; i++) {
            const p = st[i], v = st.getPropertyValue(p);
            if (!v || !HAS_COLOR.test(v)) continue;
            if (t && t[p] && t[p][1] === v) continue;                             // already ours
            const mv = mapColor(v, roleOf(p));
            if (!t) { t = {}; track.set(el, t); }
            if (mv !== v) st.setProperty(p, mv, st.getPropertyPriority(p));
            t[p] = [v, st.getPropertyValue(p)];                                     // as the browser wrote it back
        }
        busy = false;
    }
    function remapAllInline() {
        document.querySelectorAll('[style]').forEach(el => {
            const t = track.get(el);
            if (t) {
                busy = true;
                for (const p in t) if (el.style.getPropertyValue(p) === t[p][1]) el.style.setProperty(p, t[p][0], el.style.getPropertyPriority(p));
                busy = false;
                track.delete(el);
            }
            if (mode !== 'dark') mapInline(el);
        });
    }
    const mo = new MutationObserver(list => {
        if (busy) return;
        let sheets = false;
        for (const m of list) {
            if (m.type === 'attributes') { if (mode !== 'dark' && m.target.nodeType === 1) mapInline(m.target); continue; }
            for (const n of m.addedNodes) {
                if (n.nodeType !== 1) continue;
                if (n.tagName === 'STYLE' || (n.tagName === 'LINK' && /stylesheet/i.test(n.rel))) {
                    if (n.id !== 'fs-mapped') { sheets = true; if (n.tagName === 'LINK') n.addEventListener('load', rebuildSoon, { once: true }); }
                    continue;
                }
                if (mode !== 'dark') { if (n.hasAttribute('style')) mapInline(n); n.querySelectorAll && n.querySelectorAll('[style]').forEach(mapInline); }
            }
        }
        if (sheets) rebuildSoon();
    });

    /* ===================== 3. canvas ===================== */
    // Canvases that are light by design keep their colours. ONE list for the site, page → selector
    // (or data-fs-keep on the canvas). wortvorhersage: the working sheet is paper (Doc, 22.09.2026).
    const KEEP = { 'wortvorhersage.html': '#canvas' };
    const keepSel = KEEP[(location.pathname.split('/').pop() || 'index.html')] || '';
    const kept = new WeakMap();
    function keepCanvas(cv) {
        if (!cv || !cv.hasAttribute) return false;
        let k = kept.get(cv);
        if (k == null) { k = cv.hasAttribute('data-fs-keep') || (!!keepSel && cv.matches(keepSel)); kept.set(cv, k); }
        return k;
    }
    (function patchCanvas() {
        const C2D = window.CanvasRenderingContext2D;
        if (!C2D) return;
        [[C2D.prototype, 'fillStyle', 'any'], [C2D.prototype, 'strokeStyle', 'any'], [C2D.prototype, 'shadowColor', 'shadow']].forEach(([P, prop, role]) => {
            const d = Object.getOwnPropertyDescriptor(P, prop);
            if (!d || !d.set) return;
            Object.defineProperty(P, prop, {
                configurable: true, enumerable: d.enumerable,
                get() { return d.get.call(this); },
                set(v) { d.set.call(this, (mode !== 'dark' && typeof v === 'string' && !keepCanvas(this.canvas)) ? mapColor(v, role) : v); }
            });
        });
        const G = window.CanvasGradient && CanvasGradient.prototype, add = G && G.addColorStop;
        if (add) G.addColorStop = function (o, c) { return add.call(this, o, mode !== 'dark' ? mapColor(c, 'any') : c); };
    })();

    /* ===================== switching ===================== */
    const buttons = new Set();
    function paintButtons() {
        buttons.forEach(b => {
            const nx = NEXT[mode];
            b.title = 'Farbschema ' + LABEL[nx] + ' einschalten';
            b.setAttribute('aria-label', b.title);
            const t = b.querySelector('.fs-label'); if (t) t.textContent = LABEL[nx];
            b.dataset.next = nx;
        });
    }
    function applyClasses() {
        html.classList.toggle('fs-grey', mode === 'grey');
        html.classList.toggle('fs-light', mode === 'light');
        html.style.colorScheme = mode === 'light' ? 'light' : 'dark';
    }
    function set(m) {
        if (!NEXT[m] || m === mode || NEXT[forced]) return;
        mode = m;
        try { localStorage.setItem(KEY, m); } catch (_) { }
        applyClasses(); buildCSS(); remapAllInline(); paintButtons();
        window.dispatchEvent(new CustomEvent('farbschema', { detail: { mode } }));
        window.dispatchEvent(new Event('resize'));                                   // canvases that draw on resize redraw now
        dbg('mode ' + m);
    }
    // the switch: the SVP pill names the scheme that comes next
    const ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/></svg>';
    function mount(target, kind) {
        if (!target) return null;
        const b = document.createElement(kind === 'rail' ? 'div' : 'button');
        if (kind === 'rail') { b.className = 'nav-btn fs-toggle'; b.setAttribute('role', 'button'); b.tabIndex = 0; b.innerHTML = ICON; }
        else { b.type = 'button'; b.className = 'fs-pill'; b.innerHTML = ICON + '<span class="fs-label"></span>'; }
        b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); set(NEXT[mode]); });
        b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(NEXT[mode]); } });
        buttons.add(b); target.appendChild(b); paintButtons();
        return b;
    }

    function start() {
        buildCSS();
        if (mode !== 'dark') document.querySelectorAll('[style]').forEach(mapInline);
        mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
        if (!html.hasAttribute('data-fs-nobutton')) {
            const rail = document.getElementById('mini-rail');
            const top = document.querySelector('.b-top');
            if (rail) mount(rail, 'rail');
            else if (top) mount(top, 'pill');
            else { const b = mount(document.body, 'pill'); if (b) b.classList.add('fs-float'); }   // labs with their own shell
        }
    }

    // hand-made corrections; never translated themselves
    if (ME) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = ME.replace(/farbschema\.js(\?.*)?$/, 'farbschema.css'); l.dataset.fsSkip = '';
        (document.head || html).appendChild(l);
    }
    applyClasses();
    buildCSS();                                                                     // the sheets above this script are loaded: no dark flash
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
    window.addEventListener('load', rebuildSoon);

    // freeze(): translate nothing more from now on - for pages that copy their own styles (the print edition: Paged.js
    // duplicates every sheet while it sets the pages, and a cover that must stay dark would be translated after all)
    function freeze() { frozen = true; mo.disconnect(); clearTimeout(rebuildT); }
    window.Farbschema = { get: () => mode, set, next: () => set(NEXT[mode]), label: m => LABEL[m || mode], mount, map: mapColor, freeze };
})();
