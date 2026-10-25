/* buch-os5.js — widgets of the book Mathematik · Oberschule 5 (js/buch.js; SVG helpers Buch.geo from js/buch-geometrie.js,
 * which must be loaded first). Every name ends in os5. The book also uses widgets of the Gymnasium 5 book (js/buch-gy5.js)
 * and the cube building of the Oberschule 6 book (js/buch-os6.js) instead of copying them.
 *   titelbildos5    the cover: a cube in the oblique view with its net, a circle in thirds, a mirrored butterfly,
 *                   Babylonian wedges for 2026 and a number line
 *   zahlenstrahlos5 natural numbers on the number line: steps of 1, 10, 100 … 100 000; explore (drag the point) or read a
 *                   marked number and type it (data-mode="lesen", data-s, data-a)
 * Colours of drawn parts go into style="" (never fill=""), so js/farbschema.js can translate them — except on the cover,
 * which is dark in every scheme and keeps its colours through presentation attributes, like the other covers.
 * Looks: the general classes of js/buch.css (b-ctrls, b-two, b-svgbox, g-svg, b-out) and the section "Oberschule 5".
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, math, seg, div, range } = B;
    const { f1, line, handle, dragSVG } = B.geo;
    const W = B.widget;
    const LAM = '#F5C242', CY = '#7fd8ee', PHI = '#A0C85A', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    let uid = 0;

    /* ---------- small helpers ---------- */
    // digits in groups of three with a narrow no-break space: 4 738 216 (as in js/buch-gy5.js)
    const grp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const svg = (w, h, label, body) => '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" style="max-width:100%;height:auto" role="img" aria-label="' + label + '">' + body + '</svg>';
    const T = (x, y, s, cls, anchor, st) => '<text class="' + (cls || 'g-lab') + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || 'middle') + '"' + (st ? ' style="' + st + '"' : '') + '>' + s + '</text>';
    const rect = (x, y, w, h, st) => '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" style="' + st + '"/>';
    const rgba = (c, a) => { const n = parseInt(c.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
    const area = (c, a, w) => 'fill:' + rgba(c, a) + ';stroke:' + c + ';stroke-width:' + (w || 1.6) + ';stroke-linejoin:round';
    const isHero = box => box.dataset.hero != null;
    // hero mode (chapter opener): only the picture, centred
    function heroOnly(box, pic, hide, maxW) {
        if (!isHero(box)) return false;
        hide.forEach(e => { if (e) e.style.display = 'none'; });
        if (pic.parentNode && pic.parentNode.classList.contains('b-two')) pic.parentNode.style.display = 'block';
        pic.style.maxWidth = (maxW || 320) + 'px'; pic.style.margin = '0 auto';
        return true;
    }
    // a row of buttons; onClick(key, button)
    function buttons(parent, list, onClick) {
        const box = div(parent, 'b-ctrls');
        box.innerHTML = list.map(([k, l, cls]) => '<button type="button" class="b-btn' + (cls ? ' ' + cls : '') + '" data-a="' + k + '">' + l + '</button>').join('');
        box.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && !b.disabled) onClick(b.dataset.a, b); });
        return box;
    }
    // a text field with a label and a check button; onCheck(value) returns true/false or null (nothing to judge)
    function askRow(parent, label, ph, onCheck) {
        const row = div(parent, 'b-ctrls');
        const id = 'os5-in-' + (++uid);
        row.innerHTML = '<label class="b-ctrl" for="' + id + '">' + label + '</label><input class="b-in os5-in" id="' + id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="' + (ph || '') + '">' +
            '<button type="button" class="b-btn">Prüfen</button><span class="b-fb" aria-live="polite"></span>';
        const inp = row.querySelector('input'), fb = row.querySelector('.b-fb');
        const go = () => {
            const ok = onCheck(inp.value);
            if (ok == null) { fb.className = 'b-fb'; fb.innerHTML = ''; return; }
            inp.classList.toggle('ok', ok); inp.classList.toggle('bad', !ok);
            fb.className = 'b-fb ' + (ok ? 'ok' : 'bad');
            fb.innerHTML = (ok ? B.icon.ok + ' richtig' : B.icon.bad + ' noch nicht');
        };
        row.querySelector('button').addEventListener('click', go);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
        return { row, inp, reset() { inp.value = ''; inp.classList.remove('ok', 'bad'); fb.className = 'b-fb'; fb.innerHTML = ''; } };
    }
    // a whole number as typed: "4 730", "4.730", "4730" → 4730 (NaN otherwise)
    const whole = s => { const t = String(s).replace(/[\s .]/g, ''); return /^\d+$/.test(t) ? parseInt(t, 10) : NaN; };

    /* ---------- the cover ---------- */
    W('titelbildos5', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        // presentation attributes, not style="": js/farbschema.js leaves them alone, the cover stays dark in every scheme
        const A = css => css.split(';').filter(Boolean).map(kv => { const k = kv.indexOf(':'); return ' ' + kv.slice(0, k).trim() + '="' + kv.slice(k + 1).trim() + '"'; }).join('');
        const pth = (d, css) => '<path d="' + d + '"' + A(css) + '/>';
        const P2 = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
        const closed = list => P2(list) + ' Z';
        const glow = (d, c, w, dash) => pth(d, 'stroke:' + c + ';stroke-width:12;stroke-opacity:0.12;fill:none;stroke-linejoin:round;stroke-linecap:round') +
            pth(d, 'stroke:' + c + ';stroke-width:' + (w || 3) + ';fill:none;stroke-linejoin:round;stroke-linecap:round' + (dash ? ';stroke-dasharray:' + dash : ''));
        let art = '';
        // a cube in the oblique view: depth at 45°, shortened by half; hidden edges dashed
        const e = 130, k = 0.5 * e * Math.SQRT1_2, O = [64, 606];
        const P = (x, y, z) => [O[0] + x * e + y * k, O[1] - z * e - y * k];
        art += pth(closed([P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)]), 'fill:' + CY + ';fill-opacity:0.10;stroke:none');
        art += pth(closed([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)]), 'fill:' + CY + ';fill-opacity:0.16;stroke:none');
        art += pth(closed([P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)]), 'fill:' + CY + ';fill-opacity:0.06;stroke:none');
        [[P(0, 1, 0), P(1, 1, 0)], [P(0, 1, 0), P(0, 1, 1)], [P(0, 0, 0), P(0, 1, 0)]].forEach(([p, q]) => { art += pth(P2([p, q]), 'stroke:' + CY + ';stroke-opacity:0.55;stroke-width:2;stroke-dasharray:8 7;fill:none'); });
        art += glow(closed([P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)]), CY, 2.6);
        art += glow(P2([P(0, 0, 1), P(0, 1, 1), P(1, 1, 1), P(1, 1, 0), P(1, 0, 0)]), CY, 2.6) + glow(P2([P(1, 0, 1), P(1, 1, 1)]), CY, 2.6);
        // its net: the cross of six squares
        const u = 28, N0 = [300, 362];
        [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]].forEach(([c, r]) => {
            const x = N0[0] + c * u, y = N0[1] + r * u;
            art += '<rect x="' + x + '" y="' + y + '" width="' + u + '" height="' + u + '"' + A('fill:' + VIO + ';fill-opacity:0.16;stroke:' + VIO + ';stroke-width:2') + '/>';
        });
        // a circle in thirds, two of them lit
        const M = [472, 424], r = 70;
        for (let i = 0; i < 3; i++) {
            const a0 = -Math.PI / 2 + i * 2 * Math.PI / 3, a1 = a0 + 2 * Math.PI / 3;
            const p0 = [M[0] + r * Math.cos(a0), M[1] + r * Math.sin(a0)], p1 = [M[0] + r * Math.cos(a1), M[1] + r * Math.sin(a1)];
            if (i < 2) art += pth('M' + M[0] + ' ' + M[1] + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + r + ' ' + r + ' 0 0 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z', 'fill:' + LAM + ';fill-opacity:' + (0.2 + 0.08 * i) + ';stroke:none');
            art += pth(P2([M, p0]), 'stroke:' + LAM + ';stroke-opacity:0.6;stroke-width:1.6;fill:none');
        }
        art += glow('M' + (M[0] - r) + ' ' + M[1] + ' a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0 Z', LAM, 3);
        // a butterfly and its mirror image at a dashed axis
        const ax = 470, wing = [[ax - 3, 540], [ax - 40, 508], [ax - 82, 520], [ax - 88, 555], [ax - 60, 585], [ax - 14, 594], [ax - 50, 610], [ax - 66, 648], [ax - 40, 670], [ax - 6, 648]];
        art += glow('M' + ax + ' 494 L' + ax + ' 690', PHI, 2, '9 9');
        art += pth(closed(wing), 'fill:' + PHI + ';fill-opacity:0.14;stroke:none') + glow(closed(wing), PHI, 2.6);
        const img = wing.map(p => [2 * ax - p[0], p[1]]);
        art += pth(closed(img), 'fill:' + PHI + ';fill-opacity:0.14;stroke:none') + glow(closed(img), PHI, 2.6);
        // Babylonian wedges for 2026 = 33 · 60 + 46
        const keil = (x, y) => pth('M' + (x - 6) + ' ' + y + ' L' + (x + 6) + ' ' + y + ' L' + x + ' ' + (y + 9) + ' Z', 'fill:' + LAM + ';stroke:' + LAM + ';stroke-width:1') +
            pth('M' + x + ' ' + (y + 5) + ' L' + x + ' ' + (y + 24), 'stroke:' + LAM + ';stroke-width:2.4;stroke-linecap:round;fill:none');
        const haken = (x, y) => pth('M' + (x + 14) + ' ' + (y - 9) + ' L' + x + ' ' + y + ' L' + (x + 14) + ' ' + (y + 9), 'stroke:' + LAM + ';stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;fill:none') +
            pth('M' + (x - 1) + ' ' + y + ' L' + (x + 7) + ' ' + (y - 5) + ' L' + (x + 7) + ' ' + (y + 5) + ' Z', 'fill:' + LAM + ';stroke:none');
        const digit = (v, x, y) => {
            let s = '', xx = x;
            for (let i = 0; i < Math.floor(v / 10); i++) { s += haken(xx, y + 12); xx += 17; }
            const ones = v % 10, rows = ones > 3 ? 2 : 1, per = Math.ceil(ones / rows);
            for (let i = 0; i < ones; i++) s += keil(xx + 5 + (i % per) * 11, y + (rows > 1 ? Math.floor(i / per) * 14 - 6 : 0));
            return s;
        };
        art += digit(33, 66, 650) + digit(46, 166, 650);
        // a number line along the bottom
        const NL = 736;
        art += glow('M30 ' + NL + ' L570 ' + NL, '#ffffff', 2.2);
        for (let i = 0; i <= 10; i++) art += pth('M' + (50 + 50 * i) + ' ' + (NL - (i % 5 ? 8 : 14)) + ' L' + (50 + 50 * i) + ' ' + (NL + (i % 5 ? 8 : 14)), 'stroke:#ffffff;stroke-opacity:0.7;stroke-width:2');
        [[400, NL], M].forEach(p => { art += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="13" fill="#fff" fill-opacity="0.12"/>'; });
        const id = 'to5' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.88" stop-color="#fff" stop-opacity="1"/><stop offset="0.97" stop-color="#fff" stop-opacity="0.15"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- natural numbers on the number line ---------- */
    const STEPS = [[1, '1'], [10, '10'], [100, '100'], [1000, '1 000'], [10000, '10 000'], [100000, '100 000']];
    W('zahlenstrahlos5', function (box) {
        const S = { s: +(box.dataset.s || 100), a: +(box.dataset.a || 4000), k: 6, mode: box.dataset.mode || 'erkunden', q: null };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['erkunden', 'Erkunden'], ['lesen', 'Ablesen']], S.mode, v => { S.mode = v; if (v === 'lesen') neu(); render(); }, 'Modus');
        const c2 = div(box, 'b-ctrls');
        const stepSeg = seg(c2, STEPS.map(([v, l]) => [v, 'Schritt ' + l]), S.s, v => { S.s = +v; S.a = Math.floor(S.a / (10 * S.s)) * 10 * S.s; render(); }, 'Einteilung');
        const pic = div(box, 'b-svgbox g-svg');
        const ask = askRow(box, 'Welche Zahl ist markiert?', 'Zahl', v => { const n = whole(v); if (isNaN(n)) return null; S.q.done = n === S.a + S.k * S.s; render(); return S.q.done; });
        const acts = buttons(box, [['neu', 'Neue Aufgabe', 'b-go']], () => { neu(); render(); });
        const out = div(box, 'b-out');
        const help = div(box, 'b-help', '');
        heroOnly(box, pic, [ctr, c2, ask.row, acts, out, help], 420);
        const X0 = 40, X1 = 520, Y = 70, dx = (X1 - X0) / 10;
        dragSVG(pic, (i, x) => { if (S.mode !== 'erkunden') return; S.k = clamp(Math.round((x - X0) / dx), 0, 10); render(); });
        function neu() {
            S.s = STEPS[rnd(1, 4)][0];
            S.a = rnd(1, 40) * 10 * S.s;
            S.k = [1, 2, 3, 4, 6, 7, 8, 9][rnd(0, 7)];
            S.q = { done: false };
            stepSeg.set(S.s); ask.reset();
        }
        function render() {
            const lesen = S.mode === 'lesen';
            if (!isHero(box)) {
                c2.style.display = lesen ? 'none' : '';
                ask.row.style.display = acts.style.display = lesen ? '' : 'none';
            }
            const v = S.a + S.k * S.s;
            let s = line([X0 - 22, Y], [X1 + 26, Y], 'stroke:' + TXT + ';stroke-width:2');
            s += '<path d="M' + (X1 + 26) + ' ' + (Y - 6) + ' L' + (X1 + 36) + ' ' + Y + ' L' + (X1 + 26) + ' ' + (Y + 6) + ' Z" style="fill:' + TXT + '"/>';
            for (let i = 0; i <= 10; i++) {
                const x = X0 + i * dx, big = i % 5 === 0;
                s += line([x, Y - (big ? 13 : 8)], [x, Y + (big ? 13 : 8)], 'stroke:' + TXT + ';stroke-width:' + (big ? 2 : 1.3));
                if (i === 0 || i === 10 || (i === 5 && !lesen)) s += T(x, Y + 36, grp(S.a + i * S.s), 'g-val');
            }
            const x = X0 + S.k * dx;
            if (lesen) s += '<path d="M' + f1(x) + ' ' + (Y - 16) + ' L' + f1(x - 8) + ' ' + (Y - 30) + ' L' + f1(x + 8) + ' ' + (Y - 30) + ' Z" style="fill:' + LAM + '"/>' +
                (S.q && S.q.done ? T(x, Y - 38, grp(v), 'g-pt', 'middle', 'fill:' + PHI) : T(x, Y - 38, '?', 'g-pt', 'middle', 'fill:' + LAM));
            else s += T(x, Y - 26, grp(v), 'g-pt', 'middle', 'fill:' + LAM) + handle([x, Y], 0, LAM);
            pic.innerHTML = svg(570, 120, 'Zahlenstrahl von ' + grp(S.a) + ' bis ' + grp(S.a + 10 * S.s), s);
            help.textContent = lesen ? 'Zähle die Striche ab der linken Zahl. Wie groß ist ein Schritt von Strich zu Strich?' : 'Zieh den Punkt über den Zahlenstrahl. Je weiter rechts, desto größer die Zahl.';
            if (lesen) {
                out.innerHTML = S.q && S.q.done
                    ? '<p class="g-ok">Richtig: ' + grp(S.a) + ' + ' + S.k + ' · ' + grp(S.s) + ' = ' + grp(v) + '</p><p class="g5-dim">Von ' + grp(S.a) + ' bis ' + grp(S.a + 10 * S.s) + ' sind es 10 Schritte, einer ist ' + grp(S.s) + ' groß.</p>'
                    : '<p>Links steht ' + grp(S.a) + ', rechts ' + grp(S.a + 10 * S.s) + '. Dazwischen liegen 10 gleich große Schritte.</p>';
                return;
            }
            out.innerHTML = '<p class="g5-big">' + grp(v) + '</p>' +
                '<p>Ein Schritt von Strich zu Strich ist <b>' + grp(S.s) + '</b>. Der Punkt liegt ' + S.k + ' Schritte rechts von ' + grp(S.a) + '.</p>' +
                (S.s === 1 ? '<p class="g5-dim">Vorgänger ' + (v ? grp(v - 1) : '–') + ', Nachfolger ' + grp(v + 1) + '.</p>' :
                    '<p class="g5-dim">Die Zahl liegt zwischen ' + grp(v - S.s) + ' und ' + grp(v + S.s) + '.</p>');
        }
        if (S.mode === 'lesen') neu();
        render();
    });

    /* ---------- written arithmetic, step by step: + − · : ---------- */
    const PLACE = { '-3': 'Tausendstel', '-2': 'Hundertstel', '-1': 'Zehntel', '0': 'Einer', '1': 'Zehner', '2': 'Hunderter', '3': 'Tausender',
        '4': 'Zehntausender', '5': 'Hunderttausender', '6': 'Millionen', '7': 'Zehnmillionen', '8': 'Hundertmillionen', '9': 'Milliarden' };
    // a number as typed ("1 234,5") → { i: '1234', f: '5' }; null if it is none
    function dnum(t) {
        const m = String(t).replace(/[\s ]/g, '').replace('.', ',').match(/^(\d+)(?:,(\d*))?$/);
        return m ? { i: m[1].replace(/^0+(?=\d)/, ''), f: m[2] || '' } : null;
    }
    const dshow = x => grp(x.i) + (x.f ? ',' + x.f : '');
    const scaled = (x, d) => parseInt(x.i + x.f.padEnd(d, '0'), 10);              // the value in units of 10^-d
    function unscale(n, d) {                                                        // 14700, 3 → "14,7"
        if (!d) return grp(n);
        const s = String(n).padStart(d + 1, '0'), f = s.slice(-d).replace(/0+$/, '');
        return grp(s.slice(0, -d)) + (f ? ',' + f : '');
    }
    // for an estimate: two leading digits for numbers from 100 on (4 738 → 4 700), tens below, decimals to whole numbers
    const rough = v => v < 10 ? Math.round(v) : Math.round(v / Math.pow(10, Math.max(1, String(Math.floor(v)).length - 2))) * Math.pow(10, Math.max(1, String(Math.floor(v)).length - 2));
    // one significant digit (352 → 400, 23 → 20) for the estimate of a product
    const lead = v => v < 10 ? Math.max(1, Math.round(v)) : Math.round(v / Math.pow(10, String(Math.floor(v)).length - 1)) * Math.pow(10, String(Math.floor(v)).length - 1);
    const val = x => parseFloat(x.i + '.' + (x.f || '0'));

    // the sheet of a written calculation: rows of cells; a cell keeps its texts with the step they appear in,
    // plus the steps from which it is struck through (x), carries a comma (ck) or a line above (line)
    function Sheet(C) { this.C = C; this.rows = []; }
    Sheet.prototype.row = function (cls) { const r = { cls: cls || '', c: {} }; this.rows.push(r); return r; };
    const cell = (r, k) => r.c[k] || (r.c[k] = { v: [], cls: '' });
    function put(r, k, t, s, cls) { const c = cell(r, k); c.v.push([s || 0, String(t)]); if (cls) c.cls = cls; return c; }
    function lineAt(r, from, to, s) { for (let k = from; k <= to; k++) cell(r, k).line = s || 0; }
    function sheetHtml(sh, step, right) {
        let h = '<table class="os5-calc">';
        sh.rows.forEach((r, ri) => {
            h += '<tr' + (r.cls ? ' class="' + r.cls + '"' : '') + '>';
            for (let k = 0; k < sh.C; k++) {
                const c = r.c[k], cls = [];
                let t = '';
                if (c) {
                    const vis = c.v.filter(v => v[0] <= step);
                    if (vis.length) { t = vis[vis.length - 1][1]; if (step > 0 && vis[vis.length - 1][0] === step) cls.push('os5-new'); }
                    if (c.cls) cls.push(c.cls);
                    if (c.line != null && c.line <= step) cls.push('os5-l');
                    if (c.x != null && c.x <= step) cls.push('os5-x');
                    if (c.ck != null && c.ck <= step && t) cls.push('os5-ck');
                }
                h += '<td' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + t + '</td>';
            }
            if (right != null) h += ri === 0 ? '<td class="os5-r">' + right + '</td>' : '<td></td>';
            h += '</tr>';
        });
        return h + '</table>';
    }
    // the digit of x at place p (p < 0: after the comma); null where x has no digit
    const digAt = (x, p) => p >= 0 ? (p < x.i.length ? +x.i[x.i.length - 1 - p] : null) : (-p <= x.f.length ? +x.f[-p - 1] : null);
    // the two numbers of an addition or subtraction, written place under place (col(p) for place p)
    function twoRows(sh, a, b, d, col, rA, rB) {
        [[rA, a], [rB, b]].forEach(([r, x]) => {
            for (let p = -d; p < x.i.length; p++) {
                const v = digAt(x, p), c = put(r, col(p), v == null ? 0 : v, 0, v == null ? 'os5-dim' : '');
                if (p === 0 && d) c.ck = 0;
            }
        });
    }
    function buildAdd(a, b) {
        const d = Math.max(a.f.length, b.f.length), top = Math.max(a.i.length, b.i.length);
        const C = 2 + top + d, col = p => 1 + top - p;                       // col(top) = 1 for the last carry
        const sh = new Sheet(C), rA = sh.row(), rB = sh.row(), rC = sh.row('os5-carry'), rR = sh.row();
        twoRows(sh, a, b, d, col, rA, rB);
        put(rB, 0, '+', 0); lineAt(rR, 0, C - 1, 0);
        const text = ['Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer' + (d ? ', Komma unter Komma. Fehlende Stellen hinter dem Komma füllst du mit Nullen auf' : '') + '. Gerechnet wird von rechts nach links.'];
        let carry = 0, s = 0;
        for (let p = -d; p < top; p++) {
            const x = digAt(a, p) || 0, y = digAt(b, p) || 0, sum = x + y + carry;
            s++;
            const c = put(rR, col(p), sum % 10, s); if (p === 0 && d) c.ck = s;
            if (sum >= 10) put(rC, col(p + 1), Math.floor(sum / 10), s);
            text.push('<b>' + PLACE[p] + ':</b> ' + x + ' + ' + y + (carry ? ' + ' + carry + ' (Übertrag)' : '') + ' = ' + sum + '. Schreibe ' + (sum % 10) +
                (sum >= 10 ? ' und übertrage ' + Math.floor(sum / 10) + ' in die nächste Spalte.' : '.'));
            carry = Math.floor(sum / 10);
        }
        if (carry) { s++; put(rR, col(top), carry, s); text.push('Der letzte Übertrag ' + carry + ' kommt vorn ins Ergebnis.'); }
        const R = scaled(a, d) + scaled(b, d), ea = rough(val(a)), eb = rough(val(b));
        return { sh, n: s, text, res: dshow(a) + ' + ' + dshow(b) + ' = ' + unscale(R, d),
            note: 'Überschlag: ' + grp(ea) + ' + ' + grp(eb) + ' = ' + grp(ea + eb) + '. Probe: ' + unscale(R, d) + ' − ' + dshow(b) + ' = ' + dshow(a) + '.' };
    }
    function buildSub(a, b, way) {
        const d = Math.max(a.f.length, b.f.length), va = scaled(a, d), vb = scaled(b, d);
        if (vb > va) return { err: 'Die zweite Zahl ist größer als die erste. In den natürlichen Zahlen geht diese Subtraktion nicht.' };
        const top = Math.max(a.i.length, b.i.length), C = 1 + top + d, col = p => top - p;
        const ent = way === 'ent', sh = new Sheet(C);
        const rE = ent ? sh.row('os5-carry') : null, rA = sh.row(), rB = sh.row(), rC = ent ? null : sh.row('os5-carry'), rR = sh.row();
        twoRows(sh, a, b, d, col, rA, rB);
        put(rB, 0, '−', 0); lineAt(rR, 0, C - 1, 0);
        const R = va - vb, hp = Math.max(0, String(R).length - 1 - d);                 // the highest place of the result
        const text = ['Schreibe die Zahlen stellengerecht untereinander' + (d ? ', Komma unter Komma' : '') + '. Gerechnet wird von rechts nach links' +
            (ent ? ', beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.' : ', beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?')];
        let s = 0, carry = 0;
        const tv = {};
        for (let p = -d; p < top; p++) tv[p] = digAt(a, p) || 0;
        for (let p = -d; p < top; p++) {
            const y = digAt(b, p) || 0;
            let r, t = '<b>' + PLACE[p] + ':</b> ';
            s++;
            if (!ent) {
                const x = tv[p], bb = y + carry;
                if (carry) t += y + ' + 1 (Übertrag) = ' + bb + '. ';
                if (bb <= x) { r = x - bb; t += 'Von ' + bb + ' bis ' + x + ' sind ' + r + '.'; carry = 0; }
                else { r = x + 10 - bb; t += 'Von ' + bb + ' bis ' + (x + 10) + ' sind ' + r + '. Übertrag 1 in die nächste Spalte.'; put(rC, col(p + 1), 1, s); carry = 1; }
            } else {
                if (tv[p] < y) {
                    let q = p + 1; while (tv[q] === 0) q++;
                    const mark = k => { put(rE, col(k), tv[k], s); const c = cell(rA, col(k)); if (c.x == null) c.x = s; };
                    const chain = [];
                    tv[q]--; mark(q);
                    for (let k = q - 1; k > p; k--) { tv[k] = 9; mark(k); }
                    for (let k = q; k > p; k--) chain.push('1 ' + PLACE[k].replace(/Millionen$/, 'Million') + ' → 10 ' + PLACE[k - 1]);
                    t += tv[p] + ' ist kleiner als ' + y + '. Entbündle: ' + chain.join(', dann ') + '. ';
                    tv[p] += 10; mark(p);
                }
                r = tv[p] - y; t += tv[p] + ' − ' + y + ' = ' + r + '.';
            }
            if (p <= hp) { const c = put(rR, col(p), r, s); if (p === 0 && d) c.ck = s; }
            else t += ' Eine Null ganz vorn schreibt man nicht.';
            text.push(t);
        }
        const ea = rough(val(a)), eb = rough(val(b));
        return { sh, n: s, text, res: dshow(a) + ' − ' + dshow(b) + ' = ' + unscale(R, d),
            note: 'Überschlag: ' + grp(ea) + ' − ' + grp(eb) + ' = ' + grp(Math.max(0, ea - eb)) + '. Probe: ' + unscale(R, d) + ' + ' + dshow(b) + ' = ' + dshow(a) + '.' };
    }
    function buildMul(a, b) {
        if (b.f) return { err: 'Der zweite Faktor muss hier eine natürliche Zahl sein. Tausche die Faktoren, wenn nötig.' };
        const da = a.f.length, A = a.i + a.f, Bd = b.i, na = A.length, nb = Bd.length;
        if (na > 7 || nb > 3) return { err: 'Bitte höchstens sieben Ziffern im ersten und drei im zweiten Faktor.' };
        const C = na + nb + 2, R = na + nb + 1, sh = new Sheet(C), rT = sh.row();
        [...A].forEach((ch, k) => { const c = put(rT, 1 + k, ch, 0); if (da && k === na - da - 1) c.ck = 0; });
        put(rT, na + 1, '·', 0);
        [...Bd].forEach((ch, k) => put(rT, na + 2 + k, ch, 0));
        const Av = parseInt(A, 10), Bv = parseInt(Bd, 10), total = Av * Bv;
        const text = ['Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal' +
            (da ? ', zuerst ohne auf das Komma zu achten.' : '.')];
        let s = 0, rRes;
        if (nb === 1) {
            const y = Bv; rRes = sh.row(); lineAt(rRes, 1, R, 0);
            let carry = 0;
            for (let k = na - 1; k >= 0; k--) {
                const x = +A[k], pr = x * y + carry, end = R - (na - 1 - k);
                s++;
                if (k > 0) {
                    put(rRes, end, pr % 10, s);
                    text.push(y + ' · ' + x + (carry ? ' + ' + carry + ' (gemerkt)' : '') + ' = ' + pr + '. Schreibe ' + pr % 10 + (pr >= 10 ? ', merke ' + Math.floor(pr / 10) : '') + '.');
                    carry = Math.floor(pr / 10);
                } else {
                    String(pr).split('').reverse().forEach((ch, j) => put(rRes, end - j, ch, s));
                    text.push(y + ' · ' + x + (carry ? ' + ' + carry + ' (gemerkt)' : '') + ' = ' + pr + '. Das ist die letzte Ziffer: Schreibe ' + pr + ' ganz hin.');
                }
            }
        } else {
            const parts = [];
            [...Bd].forEach((ch, j) => {
                const y = +ch, P = Av * y, end = na + 2 + j, r = sh.row();
                if (!j) lineAt(r, 1, R, 0);
                s++;
                String(P).split('').reverse().forEach((c2, i) => put(r, end - i, c2, s));
                parts.push(grp(P));
                text.push(grp(Av) + ' · ' + y + ' = ' + grp(P) + '. Die letzte Ziffer steht genau unter der ' + y + ' des zweiten Faktors.');
            });
            rRes = sh.row(); s++;
            lineAt(rRes, 1, R, s);
            String(total).split('').reverse().forEach((ch, i) => put(rRes, R - i, ch, s));
            text.push('Addiere die Teilprodukte stellengerecht, so wie sie stehen. Das ergibt ' + grp(total) + '.');
        }
        if (da) {
            s++;
            const str = String(total);
            for (let i = str.length; i <= da; i++) put(rRes, R - i, 0, s);                   // 0,02 · 3: leading zeros for the comma
            cell(rRes, R - da).ck = s;
            text.push('Der erste Faktor hat ' + da + (da > 1 ? ' Stellen' : ' Stelle') + ' nach dem Komma, also auch das Ergebnis: ' + unscale(total, da) + '.');
        }
        const ea = lead(val(a)), eb = lead(Bv);
        return { sh, n: s, text, res: dshow(a) + ' · ' + grp(Bd) + ' = ' + unscale(total, da),
            note: 'Überschlag: ' + grp(ea) + ' · ' + grp(eb) + ' = ' + grp(ea * eb) + '.' };
    }
    function buildDiv(a, b) {
        if (b.f || +b.i < 1 || +b.i > 9) return { err: 'Hier teilst du durch eine einstellige Zahl von 1 bis 9.' };
        if (a.i.length + a.f.length > 8) return { err: 'Bitte höchstens acht Ziffern.' };
        const y = +b.i, ia = a.i.length, dec = a.f.length > 0;
        let D = (a.i + a.f).split('').map(Number), ext = 0;
        if (dec) { let r = 0; D.forEach(x => { r = (r * 10 + x) % y; }); while (r && a.f.length + ext < 4) { ext++; r = (r * 10) % y; } }
        D = D.concat(Array(ext).fill(0));
        const n = D.length, places = a.f.length + ext, sh = new Sheet(n + 1), r0 = sh.row();
        D.forEach((x, k) => { const c = put(r0, 1 + k, x, 0, k >= n - ext ? 'os5-dim' : ''); if (dec && k === ia - 1) c.ck = 0; });
        const q = [], text = ['Teile von links nach rechts. Frage bei jeder Stelle: Wie oft passt die ' + y + ' hinein?' + (ext ? ' Hinten hängst du Nullen an, das ändert den Wert nicht.' : '')];
        let cur = 0, s = 0, started = false, last = null;
        for (let i = 0; i < n; i++) {
            cur = cur * 10 + D[i];
            if (!started && cur < y && i < ia - 1) continue;
            s++;
            let t = '';
            if (last) { put(last, 1 + i, D[i], s); t = 'Hole die ' + D[i] + ' herunter: ' + cur + '. '; }
            else if (i > 0) t = 'In die ' + D[0] + ' passt die ' + y + ' nicht, nimm die ersten ' + (i + 1) + ' Ziffern: ' + cur + '. ';
            started = true;
            const qd = Math.floor(cur / y), pr = qd * y, rem = cur - pr, ps = String(pr), cs = String(cur);
            q.push([s, String(qd)]);
            if (i === ia - 1 && i < n - 1) q.push([s, ',']);
            const rp = sh.row();
            ps.split('').reverse().forEach((ch, j) => put(rp, 1 + i - j, ch, s));
            put(rp, i - ps.length + 1, '−', s);
            const rr = sh.row();
            String(rem).split('').reverse().forEach((ch, j) => put(rr, 1 + i - j, ch, s));
            lineAt(rr, 2 + i - cs.length, 1 + i, s);
            t += cur + ' : ' + y + ' = ' + qd + ', denn ' + qd + ' · ' + y + ' = ' + pr + '. ' + (rem ? 'Es bleibt ' + rem + '.' : 'Es bleibt nichts übrig.');
            if (i === ia - 1 && i < n - 1) t += ' Hier kommt das Komma: Setze es auch im Ergebnis.';
            text.push(t);
            last = rr; cur = rem;
        }
        const Av = parseInt(D.join(''), 10), Q = Math.floor(Av / y), rest = Av - Q * y;
        if (!dec && rest) q.push([s, ' Rest ' + rest]);
        const res = dec ? dshow(a) + ' : ' + y + (rest ? ' ≈ ' : ' = ') + unscale(Q, places) : grp(a.i) + ' : ' + y + ' = ' + grp(Q) + (rest ? ' Rest ' + rest : '');
        const note = dec ? (rest ? 'Die Division geht nicht auf. Nach ' + places + ' Stellen hinter dem Komma wird abgebrochen.' : 'Probe: ' + unscale(Q, places) + ' · ' + y + ' = ' + dshow(a) + '.')
            : 'Probe: ' + grp(Q) + ' · ' + y + (rest ? ' + ' + rest : '') + ' = ' + grp(a.i) + '.';
        return { sh, n: s, text, res, note, right: st => ': ' + y + ' = ' + q.filter(t => t[0] <= st).map(t => t[1]).join('') };
    }
    W('schriftlichos5', function (box) {
        const S = { op: box.dataset.op || '+', a: box.dataset.a || '4738', b: box.dataset.b || '1296', way: box.dataset.way || 'erg', step: 0, P: null };
        const hero = isHero(box);
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['+', 'Addieren'], ['−', 'Subtrahieren'], ['·', 'Multiplizieren'], [':', 'Dividieren']], S.op, v => { S.op = v; build(); }, 'Rechenart');
        const wayBox = div(box, 'b-ctrls');
        seg(wayBox, [['erg', 'Ergänzen'], ['ent', 'Entbündeln']], S.way, v => { S.way = v; build(); }, 'Verfahren');
        const inp = div(box, 'b-ctrls');
        inp.innerHTML = '<span class="b-ctrl"><input class="b-in os5-in" data-k="a" type="text" inputmode="decimal" autocomplete="off" aria-label="erste Zahl"> <b class="os5-op"></b> ' +
            '<input class="b-in os5-in" data-k="b" type="text" inputmode="decimal" autocomplete="off" aria-label="zweite Zahl"></span>';
        const ia = inp.querySelector('[data-k="a"]'), ib = inp.querySelector('[data-k="b"]'), opEl = inp.querySelector('.os5-op');
        ia.value = S.a; ib.value = S.b;
        [ia, ib].forEach(el => el.addEventListener('input', () => { S[el.dataset.k] = el.value; build(); }));
        const acts = buttons(box, [['next', 'Nächster Schritt', 'b-go'], ['all', 'Alles zeigen'], ['reset', 'Von vorn']], k => {
            if (!S.P || S.P.err) return;
            S.step = k === 'next' ? Math.min(S.step + 1, S.P.n) : k === 'all' ? S.P.n : 0;
            render();
        });
        const pic = div(box, 'os5-sheet'), out = div(box, 'b-out');
        if (hero) [ctr, wayBox, inp, acts, out].forEach(e => { e.style.display = 'none'; });
        function build() {
            const a = dnum(S.a), b = dnum(S.b);
            opEl.textContent = S.op;
            if (!hero) wayBox.style.display = S.op === '−' ? '' : 'none';
            if (!a || !b) S.P = { err: 'Bitte zwei Zahlen eingeben, zum Beispiel 4738 und 1296.' };
            else if (a.f.length > 3 || b.f.length > 3) S.P = { err: 'Bitte höchstens drei Stellen nach dem Komma.' };
            else if (a.i.length > 9 || b.i.length > 9) S.P = { err: 'Bitte Zahlen mit höchstens neun Stellen vor dem Komma.' };
            else S.P = S.op === '+' ? buildAdd(a, b) : S.op === '−' ? buildSub(a, b, S.way) : S.op === '·' ? buildMul(a, b) : buildDiv(a, b);
            S.step = (hero || B.printing()) && !S.P.err ? S.P.n : 0;
            render();
        }
        function render() {
            const P = S.P;
            if (P.err) { pic.innerHTML = ''; out.innerHTML = '<p class="g-warn">' + P.err + '</p>'; return; }
            pic.innerHTML = sheetHtml(P.sh, S.step, P.right ? P.right(S.step) : null);
            const done = S.step >= P.n;
            out.innerHTML = '<p>' + P.text[S.step] + '</p>' + (done ? '<hr class="g5-hr"><p class="g5-big">' + P.res + '</p><p class="g5-dim">' + P.note + '</p>'
                : '<p class="g5-dim">Schritt ' + S.step + ' von ' + P.n + '</p>');
        }
        build();
    });

    /* ---------- order of operations, step by step ---------- */
    const HL = s => '\\underline{\\textcolor{#e39b2d}{' + s + '}}';
    function tokens(str) {
        const s = String(str).replace(/[×*xX]/g, '·').replace(/[÷/]/g, ':').replace(/[−–]/g, '-').replace(/[\s ]+/g, '');
        const out = [], re = /(\d+)|([+\-·:()])/y;
        let i = 0;
        while (i < s.length) {
            re.lastIndex = i;
            const m = re.exec(s);
            if (!m) return null;
            out.push(m[1] ? { n: +m[1] } : { o: m[2] });
            i = re.lastIndex;
        }
        return out;
    }
    // expr = term {(+|−) term}; term = factor {(·|:) factor}; factor = number | (expr)
    function valid(T) {
        let i = 0;
        const factor = () => {
            if (T[i] && T[i].n != null) { i++; return true; }
            if (T[i] && T[i].o === '(') { i++; if (!expr() || !T[i] || T[i].o !== ')') return false; i++; return true; }
            return false;
        };
        const term = () => { if (!factor()) return false; while (T[i] && (T[i].o === '·' || T[i].o === ':')) { i++; if (!factor()) return false; } return true; };
        const expr = () => { if (!term()) return false; while (T[i] && (T[i].o === '+' || T[i].o === '-')) { i++; if (!term()) return false; } return true; };
        return T.length > 0 && expr() && i === T.length;
    }
    const tt = t => t.n != null ? String(t.n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : t.o === '·' ? '\\cdot' : t.o;
    function texOf(T, hl) {
        const p = T.map(tt);
        return hl ? [p.slice(0, hl[0]).join(' '), HL(p.slice(hl[0], hl[1] + 1).join(' ')), p.slice(hl[1] + 1).join(' ')].join(' ') : p.join(' ');
    }
    // all steps of a term: the innermost (leftmost) bracket first, inside it · and : before + and −, else from the left
    function vorrangSteps(T) {
        const lines = [];
        let err = '';
        while (T.length > 1) {
            const close = T.findIndex(t => t.o === ')');
            let lo = 0, hi = T.length - 1, inBr = false;
            if (close >= 0) { let open = close; while (T[open].o !== '(') open--; lo = open + 1; hi = close - 1; inBr = true; }
            const ops = []; for (let j = lo; j <= hi; j++) if (T[j].o) ops.push(j);
            const pts = ops.filter(j => T[j].o === '·' || T[j].o === ':'), str = ops.filter(j => T[j].o === '+' || T[j].o === '-');
            const k = pts.length ? pts[0] : str[0];
            const rule = (inBr ? 'Klammer zuerst' : '') + (pts.length && str.length ? (inBr ? ', darin ' : '') + 'Punkt vor Strich' : '') +
                ((pts.length ? pts.length : str.length) > 1 ? (inBr || (pts.length && str.length) ? ', ' : '') + 'von links nach rechts' : '');
            lines.push({ T, hl: [k - 1, k + 1], rule: rule || 'die letzte Rechnung' });
            const x = T[k - 1].n, y = T[k + 1].n, o = T[k].o;
            let v;
            if (o === '+') v = x + y;
            else if (o === '-') { if (y > x) { err = grp(x) + ' − ' + grp(y) + ' geht in den natürlichen Zahlen nicht.'; break; } v = x - y; }
            else if (o === '·') v = x * y;
            else { if (!y) { err = 'Durch 0 kann man nicht teilen.'; break; } if (x % y) { err = grp(x) + ' : ' + grp(y) + ' geht nicht ohne Rest auf. Wähle andere Zahlen.'; break; } v = x / y; }
            T = T.slice(0, k - 1).concat([{ n: v }], T.slice(k + 2));
            for (let j = 0; j + 2 < T.length; j++) if (T[j].o === '(' && T[j + 1].n != null && T[j + 2].o === ')') { T.splice(j + 2, 1); T.splice(j, 1); j = -1; }
        }
        if (!err) lines.push({ T, hl: null, rule: 'Ergebnis' });
        return { lines, err };
    }
    W('vorrangos5', function (box) {
        const PRE = (box.dataset.terms || '36 − 4 · 5|(36 − 4) · 5|48 : (2 + 6) − 3|100 − 20 − 30|7 · 8 + 7 · 2').split('|');
        const S = { t: PRE[0], step: 0, P: null };
        const ctr = div(box, 'b-ctrls');
        ctr.innerHTML = PRE.map((p, i) => '<button type="button" class="b-btn" data-p="' + i + '">' + p + '</button>').join('');
        const row = div(box, 'b-ctrls'), id = 'os5-term-' + (++uid);
        row.innerHTML = '<label class="b-ctrl" for="' + id + '">Eigener Term</label><input class="b-in os5-term" id="' + id + '" type="text" autocomplete="off" spellcheck="false">';
        const inp = row.querySelector('input');
        inp.value = S.t;
        ctr.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; S.t = PRE[+b.dataset.p]; inp.value = S.t; build(); });
        inp.addEventListener('input', () => { S.t = inp.value; build(); });
        buttons(box, [['next', 'Nächster Schritt', 'b-go'], ['all', 'Alle Schritte'], ['reset', 'Von vorn']], k => {
            if (!S.P) return;
            const n = S.P.lines.length - 1;
            S.step = k === 'next' ? Math.min(S.step + 1, n) : k === 'all' ? n : 0;
            render();
        });
        const out = div(box, 'b-out os5-steps');
        div(box, 'b-help', 'Erlaubt sind natürliche Zahlen, + − · : und Klammern. Für · darfst du auch * tippen, für : auch /.');
        function build() {
            const T = tokens(S.t);
            S.P = T && valid(T) ? vorrangSteps(T) : null;
            S.step = S.P && B.printing() ? S.P.lines.length - 1 : 0;
            render();
        }
        function render() {
            if (!S.P) { out.innerHTML = '<p class="g-warn">Das ist kein vollständiger Term. Prüfe Zahlen, Rechenzeichen und Klammern.</p>'; return; }
            const L = S.P.lines, n = L.length - 1;
            let h = '';
            for (let i = 0; i <= Math.min(S.step, n); i++) {
                const l = L[i];
                h += '<p class="os5-st' + (i === S.step ? ' on' : '') + '"><span>$' + (i ? '= ' : '') + texOf(l.T, l.hl) + '$</span>' +
                    '<span class="os5-rule">' + l.rule + '</span></p>';
            }
            if (S.step >= n && S.P.err) h += '<p class="g-warn">' + S.P.err + '</p>';
            else if (S.step < n) h += '<p class="g5-dim">Unterstrichen ist, was als Nächstes gerechnet wird.</p>';
            out.innerHTML = h;
            math(out);
        }
        build();
    });
    /* ---------- powers of ten: count the zeros, split a power of ten off ---------- */
    const TEN = ['eins', 'zehn', 'hundert', 'tausend', 'zehntausend', 'hunderttausend', 'eine Million', 'zehn Millionen', 'hundert Millionen',
        'eine Milliarde', 'zehn Milliarden', 'hundert Milliarden', 'eine Billion'];
    const tg = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');               // a whole number for TeX: 4\,700\,000
    W('zehnerpotenzos5', function (box) {
        const S = { mode: box.dataset.mode || 'potenz', n: +(box.dataset.n || 6), v: box.dataset.v || '4700000', k: null };
        seg(div(box, 'b-ctrls'), [['potenz', 'Zehnerpotenzen'], ['abtrennen', 'Nullen abtrennen']], S.mode, v => { S.mode = v; render(); }, 'Ansicht');
        const pBox = div(box, '');
        range(pBox, { label: 'Hochzahl', min: 1, max: 12, step: 1, value: S.n, fmt: v => v, onInput: v => { S.n = v; render(); } });
        const aBox = div(box, 'b-ctrls'), id = 'os5-zp-' + (++uid);
        aBox.innerHTML = '<label class="b-ctrl" for="' + id + '">Zahl</label><input class="b-in os5-in os5-wide" id="' + id + '" type="text" inputmode="numeric" autocomplete="off">';
        const vin = aBox.querySelector('input');
        vin.value = grp(S.v);
        const kBox = div(box, '');
        const rk = range(kBox, { label: 'Nullen abtrennen', min: 0, max: 5, step: 1, value: 0, fmt: v => v, onInput: v => { S.k = v; render(); } });
        vin.addEventListener('input', () => { S.v = vin.value; S.k = null; render(); });
        const out = div(box, 'b-out');
        function render() {
            const pot = S.mode === 'potenz';
            pBox.style.display = pot ? '' : 'none';
            aBox.style.display = kBox.style.display = pot ? 'none' : '';
            if (pot) {
                const n = S.n, digits = ('1' + '0'.repeat(n)).split('');
                const html = digits.map((d, i) => '<span class="' + (i ? 'os5-z' : '') + ((digits.length - i) % 3 === 0 && i ? ' os5-g' : '') + '">' + d + '</span>').join('');
                out.innerHTML = '<p class="os5-zeros">' + html + '</p>' +
                    '<p>$10^{' + n + '} = ' + (n <= 6 ? Array(n).fill('10').join(' \\cdot ') : '10 \\cdot 10 \\cdot \\ldots \\cdot 10') + ' = ' + tg('1' + '0'.repeat(n)) + '$</p>' +
                    '<p>Die Hochzahl ' + n + ' sagt: ' + n + ' Faktoren 10, also ' + (n === 1 ? 'eine Null' : n + ' Nullen') + '. Das ist <b>' + TEN[n] + '</b>.</p>';
            } else {
                const t = whole(S.v);
                if (isNaN(t) || !t || String(t).length > 15) { out.innerHTML = '<p class="g-warn">Bitte eine natürliche Zahl mit höchstens 15 Stellen eingeben, zum Beispiel 4 700 000.</p>'; return; }
                const z = String(t).match(/0*$/)[0].length;
                rk.input.max = Math.max(z, 1); rk.input.disabled = !z;
                if (S.k == null || S.k > z) S.k = z;
                rk.set(S.k);
                const k = S.k, m = t / Math.pow(10, k), s = String(t);
                const forms = [];
                for (let j = 1; j <= Math.min(z, 6); j++) forms.push(tg(t / Math.pow(10, j)) + ' \\cdot 10^{' + j + '}');
                const tr = s.length <= 10 ? s : s[0] + (s.slice(1).replace(/0+$/, '') ? '.' + s.slice(1).replace(/0+$/, '').slice(0, 8) : '') + '<span class="os5-trx">×10<sup>' + (s.length - 1) + '</sup></span>';
                const mant = s[0] + (s.slice(1).replace(/0+$/, '') ? ',' + s.slice(1).replace(/0+$/, '').slice(0, 8) : '');
                out.innerHTML = '<p class="g5-big">$' + tg(t) + (k ? ' = ' + tg(m) + ' \\cdot 10^{' + k + '}' : '') + '$</p>' +
                    (!z ? '<p>Die Zahl hat keine Endnull. Hier kann man keine Zehnerpotenz abtrennen.</p>' :
                        '<p>' + (k === z ? 'Vor dem Malpunkt steht keine Endnull mehr: Das ist die kürzeste Schreibweise.' : 'Du kannst noch ' + (z - k) + (z - k > 1 ? ' Nullen' : ' Null') + ' mehr abtrennen.') + '</p>' +
                        '<p class="g5-dim">Alle Schreibweisen: $' + tg(t) + ' = ' + forms.join(' = ') + '$</p>') +
                    '<hr class="g5-hr"><p>So zeigt ein Taschenrechner mit 10 Stellen die Zahl:</p><p><span class="os5-tr">' + tr + '</span></p>' +
                    (s.length <= 10 ? '<p class="g5-dim">Die Zahl passt in die Anzeige.</p>' :
                        '<p class="g5-dim">Die Zahl ist zu lang. Der Rechner zeigt $' + mant.replace(',', '{,}') + ' \\cdot 10^{' + (s.length - 1) + '}$: Rücke das Komma um ' + (s.length - 1) + ' Stellen nach rechts, dann hast du die Zahl.</p>');
            }
            math(out);
        }
        render();
    });

    /* ---------- square numbers and square roots ---------- */
    W('quadratos5', function (box) {
        const S = { mode: box.dataset.mode || 'quadrat', n: +(box.dataset.n || 12), v: box.dataset.v || '150' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['quadrat', 'Quadrieren'], ['wurzel', 'Wurzel ziehen']], S.mode, v => { S.mode = v; render(); }, 'Richtung');
        const qBox = div(box, '');
        range(qBox, { label: 'Seitenlänge n', min: 1, max: 20, step: 1, value: S.n, fmt: v => v, onInput: v => { S.n = v; render(); } });
        const wBox = div(box, 'b-ctrls'), id = 'os5-q-' + (++uid);
        wBox.innerHTML = '<label class="b-ctrl" for="' + id + '">Anzahl Plättchen</label><input class="b-in os5-in" id="' + id + '" type="text" inputmode="numeric" autocomplete="off">';
        const win = wBox.querySelector('input');
        win.value = S.v;
        win.addEventListener('input', () => { S.v = win.value; render(); });
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const tab = div(box, 'os5-sq');
        heroOnly(box, pic, [ctr, qBox, wBox, out, tab], 280);
        // n × n tiles, plus `extra` tiles in the next column and row (what is missing to the next square)
        function tiles(n, extra) {
            const u = Math.min(22, 236 / (n + (extra ? 1 : 0))), g = u > 9 ? 1.4 : 0.6;
            let s = '';
            for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) s += rect(10 + c * u, 10 + r * u, u - g, u - g, area(LAM, 0.3, 0.8));
            for (let i = 0; i < extra; i++) {
                const [c, r] = i < n ? [n, i] : [i - n, n];
                s += rect(10 + c * u, 10 + r * u, u - g, u - g, area(CY, 0.3, 0.8));
            }
            const w = 20 + (n + (extra ? 1 : 0)) * u;
            return svg(Math.ceil(w), Math.ceil(w), n + ' mal ' + n + ' Plättchen' + (extra ? ' und ' + extra + ' weitere' : ''), s);
        }
        function render() {
            const q = S.mode === 'quadrat';
            if (!isHero(box)) { qBox.style.display = q ? '' : 'none'; wBox.style.display = q ? 'none' : ''; }
            let cur = S.n;
            if (q) {
                const n = S.n, v = n * n;
                pic.innerHTML = tiles(n, 0);
                out.innerHTML = '<p class="g5-big">$' + n + '^2 = ' + n + ' \\cdot ' + n + ' = ' + tg(v) + '$</p><p>' + n + ' Reihen mit je ' + n + ' Plättchen ergeben ein Quadrat aus ' + v + ' Plättchen.</p>' +
                    '<p>Umgekehrt: $\\sqrt{' + tg(v) + '} = ' + n + '$, denn $' + n + ' \\cdot ' + n + ' = ' + tg(v) + '$.</p>';
            } else {
                const v = whole(S.v);
                if (isNaN(v) || v < 1 || v > 440) { pic.innerHTML = ''; out.innerHTML = '<p class="g-warn">Bitte eine Zahl von 1 bis 440 eingeben.</p>'; tab.innerHTML = ''; return; }
                const n = Math.floor(Math.sqrt(v + 0.5)), extra = v - n * n;
                cur = n;
                pic.innerHTML = tiles(n, extra);
                out.innerHTML = extra === 0
                    ? '<p class="g5-big">$\\sqrt{' + tg(v) + '} = ' + n + '$</p><p>' + v + ' ist eine Quadratzahl: Die Plättchen bilden ein Quadrat mit der Seite ' + n + '.</p>'
                    : '<p class="g5-big">' + v + ' ist keine Quadratzahl.</p><p>$' + n + '^2 = ' + tg(n * n) + '$ ist zu klein, $' + (n + 1) + '^2 = ' + tg((n + 1) * (n + 1)) + '$ ist zu groß. ' +
                        'Es bleiben ' + extra + ' Plättchen übrig, zum nächsten Quadrat fehlen ' + ((n + 1) * (n + 1) - v) + '.</p><p class="g5-dim">$\\sqrt{' + tg(v) + '}$ liegt zwischen ' + n + ' und ' + (n + 1) + '.</p>';
            }
            let t = '';
            for (let k = 1; k <= 20; k++) t += '<span class="' + (k === cur ? 'on' : '') + '">' + k + '² = ' + k * k + '</span>';
            tab.innerHTML = t;
            math(out);
        }
        render();
    });

    /* ---------- solving by trying: equations and inequalities with natural numbers ---------- */
    const PROB5 = [
        { l: '540 + y = 684', t: '540 + y = 684', v: 'y', lo: 100, hi: 200, f: y => 540 + y, rel: '=', r: 684, inv: 'y = 684 - 540 = 144', sh: y => '540 + ' + y },
        { l: '780 − x = 516', t: '780 - x = 516', v: 'x', lo: 200, hi: 300, f: x => 780 - x, rel: '=', r: 516, inv: 'x = 780 - 516 = 264', sh: x => '780 - ' + x },
        { l: '7 · x = 84', t: '7 \\cdot x = 84', v: 'x', lo: 0, hi: 20, f: x => 7 * x, rel: '=', r: 84, inv: 'x = 84 : 7 = 12', sh: x => '7 \\cdot ' + x },
        { l: 'x : 6 = 9', t: 'x : 6 = 9', v: 'x', lo: 30, hi: 70, f: x => x / 6, rel: '=', r: 9, inv: 'x = 9 \\cdot 6 = 54', sh: x => x + ' : 6' },
        { l: '10<sup>x</sup> = 1 000', t: '10^x = 1\\,000', v: 'x', lo: 0, hi: 6, f: x => Math.pow(10, x), rel: '=', r: 1000, inv: '10^3 = 10 \\cdot 10 \\cdot 10 = 1\\,000', sh: x => '10^{' + x + '}' },
        { l: 'y + 10 < 25', t: 'y + 10 < 25', v: 'y', lo: 0, hi: 25, f: y => y + 10, rel: '<', r: 25, sh: y => y + ' + 10' },
        { l: '3 · x > 20', t: '3 \\cdot x > 20', v: 'x', lo: 0, hi: 15, f: x => 3 * x, rel: '>', r: 20, sh: x => '3 \\cdot ' + x, more: true }
    ];
    W('probierenos5', function (box) {
        const S = { p: +(box.dataset.p || 0), x: 0, tried: new Set() };
        const P = () => PROB5[S.p];
        seg(div(box, 'b-ctrls'), PROB5.map((p, i) => [String(i), p.l]), String(S.p), v => { S.p = +v; reset(); }, 'Aufgabe');
        const sl = div(box, '');
        const rx = range(sl, { label: 'Einsetzen', min: 0, max: 10, step: 1, value: 0, fmt: v => P().v + ' = ' + v, onInput: v => { S.x = v; S.tried.add(v); render(); } });
        buttons(box, [['all', 'Alle Zahlen prüfen'], ['reset', 'Von vorn']], a => { if (a === 'all') { for (let k = P().lo; k <= P().hi; k++) S.tried.add(k); render(); } else reset(); });
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        const holds = (p, x) => { const d = p.f(x) - p.r; return p.rel === '=' ? Math.abs(d) < 1e-9 : p.rel === '<' ? d < 0 : d > 0; };
        function reset() {
            const p = P();
            rx.input.min = p.lo; rx.input.max = p.hi;
            S.x = p.lo + Math.round((p.hi - p.lo) / 3);
            rx.set(S.x);
            S.tried = new Set([S.x]);
            if (B.printing()) for (let k = p.lo; k <= p.hi; k++) S.tried.add(k);
            render();
        }
        function render() {
            const p = P(), x = S.x, lv = p.f(x), ok = holds(p, x);
            const X0 = 24, X1 = 536, Y = 40, n = p.hi - p.lo, X = k => X0 + (k - p.lo) / n * (X1 - X0);
            const every = n <= 30 ? 1 : 10, lab = n <= 30 ? (n <= 10 ? 1 : 5) : 20;
            let s = line([X0 - 10, Y], [X1 + 10, Y], 'stroke:' + TXT + ';stroke-width:1.6');
            for (let k = p.lo; k <= p.hi; k++) {
                if ((k - p.lo) % every && k % every) continue;
                const big = k % lab === 0;
                s += line([X(k), Y - (big ? 8 : 5)], [X(k), Y + (big ? 8 : 5)], 'stroke:' + DIM + ';stroke-width:1.2');
                if (big) s += T(X(k), Y + 28, k, 'g-small');
            }
            S.tried.forEach(k => { s += '<circle cx="' + f1(X(k)) + '" cy="' + Y + '" r="' + (k === x ? 7 : 4.5) + '" style="fill:' + (holds(p, k) ? PHI : RED) + ';stroke:#0a1426;stroke-width:1.4"/>'; });
            pic.innerHTML = svg(560, 80, 'Zahlenstrahl mit den eingesetzten Zahlen', s);
            const inc = p.f(p.hi) > p.f(p.lo);
            const lt = Number.isInteger(lv) ? tg(lv) : '\\approx ' + B.texNum(lv, 2);
            let h = '<p class="g5-big">$' + p.t + '$</p><p>Einsetzen: $' + p.sh(x) + (Number.isInteger(lv) ? ' = ' : ' ') + lt + '$ ';
            if (p.rel === '=') {
                h += ok ? '<span class="g-ok">stimmt!</span></p><p>Lösung: $' + p.v + ' = ' + x + '$. Mit der Umkehraufgabe geht es direkt: $' + p.inv + '$.</p>'
                    : (lv < p.r ? 'ist zu klein' : 'ist zu groß') + '.</p><p class="g5-dim">Nimm eine ' + ((lv < p.r) === inc ? 'größere' : 'kleinere') + ' Zahl.</p>';
            } else {
                h += (ok ? '<span class="g-ok">erfüllt die Ungleichung.</span>' : '<span class="g-warn">erfüllt sie nicht.</span>') + '</p>';
                const sol = [...S.tried].filter(k => holds(p, k)).sort((a, b) => a - b);
                const all = S.tried.size === n + 1;
                if (all) {
                    const L = []; for (let k = p.lo; k <= p.hi; k++) if (holds(p, k)) L.push(k);
                    h += '<p>Alle Lösungen: ' + (p.more ? L.slice(0, 4).join(', ') + ', … und jede größere Zahl.' : L[0] + ', ' + L[1] + ', …, ' + L[L.length - 1] + ' (' + L.length + ' Zahlen).') + '</p>';
                } else h += '<p class="g5-dim">' + (sol.length ? 'Bisher gefundene Lösungen: ' + sol.join(', ') + '.' : 'Noch keine Lösung gefunden.') + ' Eine Ungleichung hat oft viele Lösungen.</p>';
            }
            out.innerHTML = h;
            math(out);
        }
        reset();
    });

    /* ---------- divisibility rules ---------- */
    W('teilbarkeitos5', function (box) {
        const S = { v: box.dataset.v || '2316' };
        const row = div(box, 'b-ctrls'), id = 'os5-t-' + (++uid);
        row.innerHTML = '<label class="b-ctrl" for="' + id + '">Zahl</label><input class="b-in os5-in" id="' + id + '" type="text" inputmode="numeric" autocomplete="off">' +
            '<button type="button" class="b-btn">Zufallszahl</button>';
        const inp = row.querySelector('input');
        inp.value = grp(S.v);
        inp.addEventListener('input', () => { S.v = inp.value; render(); });
        row.querySelector('button').addEventListener('click', () => { S.v = String(rnd(100, 9999)); inp.value = grp(S.v); render(); });
        const out = div(box, 'b-out os5-rules');
        function render() {
            const n = whole(S.v);
            if (isNaN(n) || n < 1 || n > 999999999) { out.innerHTML = '<p class="g-warn">Bitte eine natürliche Zahl von 1 bis 999 999 999 eingeben.</p>'; return; }
            const s = String(n), dig = s.split('').map(Number), last = dig[dig.length - 1], two = n % 100, qs = dig.reduce((a, b) => a + b, 0);
            const ok = { 2: last % 2 === 0, 3: qs % 3 === 0, 4: two % 4 === 0, 5: last % 5 === 0, 9: qs % 9 === 0, 10: last === 0 };
            ok[6] = ok[2] && ok[3];
            const qsT = (dig.length > 1 ? dig.join(' + ') + ' = ' : '') + qs;
            const why = {
                2: 'Die letzte Ziffer ' + last + ' ist ' + (ok[2] ? 'gerade.' : 'ungerade.'),
                3: 'Quersumme ' + qsT + (ok[3] ? ' ist durch 3 teilbar.' : ' ist nicht durch 3 teilbar.'),
                4: 'Die letzten zwei Ziffern bilden ' + (s.length > 1 ? s.slice(-2) : s) + (ok[4] ? ', das ist durch 4 teilbar.' : ', das ist nicht durch 4 teilbar.'),
                5: 'Die letzte Ziffer ist ' + last + (ok[5] ? '.' : ', nicht 0 oder 5.'),
                6: ok[6] ? 'Durch 2 und durch 3 teilbar.' : ok[2] ? 'Durch 2, aber nicht durch 3 teilbar.' : ok[3] ? 'Durch 3, aber nicht durch 2 teilbar.' : 'Weder durch 2 noch durch 3 teilbar.',
                9: 'Quersumme ' + qs + (ok[9] ? ' ist durch 9 teilbar.' : ' ist nicht durch 9 teilbar.'),
                10: 'Die letzte Ziffer ist ' + last + (ok[10] ? '.' : ', nicht 0.')
            };
            let h = '<p class="g5-big">' + grp(n) + '</p>';
            [2, 3, 4, 5, 6, 9, 10].forEach(d => {
                h += '<p class="os5-rr ' + (ok[d] ? 'ok' : 'no') + '">' + (ok[d] ? B.icon.ok : B.icon.bad) + '<span><b>durch ' + d + (ok[d] ? '' : ' nicht') + ':</b> ' + why[d] +
                    (ok[d] ? ' <span class="g5-dim">' + grp(n) + ' : ' + d + ' = ' + grp(n / d) + '</span>' : '') + '</span></p>';
            });
            if (n <= 100000) {
                const T2 = []; for (let k = 1; k * k <= n; k++) if (n % k === 0) { T2.push(k); if (k * k !== n) T2.push(n / k); }
                T2.sort((a, b) => a - b);
                h += '<hr class="g5-hr"><p><b>Alle Teiler</b> (' + T2.length + '): ' + T2.map(grp).join(', ') + '</p>' +
                    (n === 1 ? '<p class="g5-dim">Die 1 hat nur einen Teiler. Sie ist keine Primzahl.</p>' : T2.length === 2 ? '<p class="g-ok">' + grp(n) + ' ist eine Primzahl: genau zwei Teiler.</p>' : '<p class="g5-dim">' + grp(n) + ' ist keine Primzahl.</p>');
            }
            out.innerHTML = h;
        }
        render();
    });
    /* ---------- a fraction of a quantity: z/n of G things ---------- */
    // a stepper "label [−] value [+]" inside parent; returns its output element
    function stepper(parent, label, key, aria) {
        const c = div(parent, 'b-ctrl');
        c.innerHTML = label + ' <span class="b-stepper"><button type="button" data-k="' + key + '" data-d="-1" aria-label="' + (aria || label) + ' kleiner">−</button><output></output>' +
            '<button type="button" data-k="' + key + '" data-d="1" aria-label="' + (aria || label) + ' größer">+</button></span>';
        return c.querySelector('output');
    }
    // a little person (or a dot) in a cell of size c around (x, y)
    function token(x, y, c, col, person) {
        const st = 'fill:' + col + ';stroke:none';
        if (!person) return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(c * 0.3) + '" style="' + st + '"/>';
        return '<circle cx="' + f1(x) + '" cy="' + f1(y - 0.17 * c) + '" r="' + f1(0.16 * c) + '" style="' + st + '"/>' +
            '<path d="M' + f1(x - 0.3 * c) + ' ' + f1(y + 0.38 * c) + ' Q' + f1(x - 0.3 * c) + ' ' + f1(y + 0.03 * c) + ' ' + f1(x) + ' ' + f1(y + 0.03 * c) +
            ' Q' + f1(x + 0.3 * c) + ' ' + f1(y + 0.03 * c) + ' ' + f1(x + 0.3 * c) + ' ' + f1(y + 0.38 * c) + ' Z" style="' + st + '"/>';
    }
    W('bruchteilos5', function (box) {
        const S = { z: +(box.dataset.z || 2), n: +(box.dataset.n || 3), g: +(box.dataset.g || 24), person: (box.dataset.kind || 'personen') === 'personen' };
        const st = div(box, 'b-ctrls');
        const oz = stepper(st, 'Zähler', 'z'), on = stepper(st, 'Nenner', 'n'), og = stepper(st, 'Ganzes', 'g');
        st.addEventListener('click', e => {
            const b = e.target.closest('[data-k]'); if (!b) return;
            const d = +b.dataset.d, k = b.dataset.k;
            if (k === 'z') S.z = clamp(S.z + d, 0, S.n);
            else if (k === 'n') { S.n = clamp(S.n + d, 2, 12); S.z = Math.min(S.z, S.n); S.g = clamp(Math.round(S.g / S.n) * S.n, S.n, Math.floor(60 / S.n) * S.n); }
            else S.g = clamp(S.g + d * S.n, S.n, Math.floor(60 / S.n) * S.n);
            render();
        });
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Das Ganze lässt sich nur in gleich große Gruppen teilen, wenn es ein Vielfaches des Nenners ist. Darum springt es in Schritten.');
        heroOnly(box, pic, [st, out, help], 360);
        function render() {
            const { z, n, g } = S, k = g / n, r = z * k;
            oz.textContent = z; on.textContent = n; og.textContent = g;
            const gc = Math.ceil(Math.sqrt(k)), gr = Math.ceil(k / gc), c = 22, pad = 7, gw = gc * c + 2 * pad, gh = gr * c + 2 * pad;
            const per = Math.max(1, Math.min(n, Math.floor(536 / (gw + 10))));
            const rows = Math.ceil(n / per), Wd = per * (gw + 10) + 4, Ht = rows * (gh + 10) + 4;
            let s = '';
            for (let i = 0; i < n; i++) {
                const gx = 4 + (i % per) * (gw + 10), gy = 4 + Math.floor(i / per) * (gh + 10), on2 = i < z;
                s += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gh + '" rx="8" style="fill:' + (on2 ? rgba(LAM, 0.1) : 'none') + ';stroke:' + (on2 ? LAM : DIM) + ';stroke-width:1.4' + (on2 ? '' : ';stroke-dasharray:4 4') + '"/>';
                for (let j = 0; j < k; j++) s += token(gx + pad + (j % gc + 0.5) * c, gy + pad + (Math.floor(j / gc) + 0.5) * c, c, on2 ? LAM : DIM, S.person);
            }
            pic.innerHTML = svg(Wd, Ht, z + ' von ' + n + ' Gruppen zu je ' + k + ' sind gefärbt', s);
            out.innerHTML = '<p class="g5-big">$\\tfrac{' + z + '}{' + n + '}$ von ' + g + '</p>' +
                '<p>1. Teile das Ganze in ' + n + ' gleich große Gruppen: $' + g + ' : ' + n + ' = ' + k + '$.</p>' +
                '<p>2. Nimm ' + z + (z === 1 ? ' Gruppe' : ' Gruppen') + ': $' + z + ' \\cdot ' + k + ' = ' + r + '$.</p>' +
                '<p class="g5-big">$\\tfrac{' + z + '}{' + n + '}$ von ' + g + ' sind ' + r + '.</p>' +
                (z === n ? '<p class="g5-dim">Alle Gruppen: Das ist das Ganze.</p>' : 2 * z === n ? '<p class="g5-dim">Genau die Hälfte.</p>' : '');
            math(out);
        }
        render();
    });

    /* ---------- comparing two fractions by reasoning: same denominator, same numerator, one half, the missing piece ---------- */
    const NTH = ['', 'Ganze', 'Halbe', 'Drittel', 'Viertel', 'Fünftel', 'Sechstel', 'Siebtel', 'Achtel', 'Neuntel', 'Zehntel', 'Elftel', 'Zwölftel'];
    const NTH1 = ['', 'Ganzes', 'Halbes', 'Drittel', 'Viertel', 'Fünftel', 'Sechstel', 'Siebtel', 'Achtel', 'Neuntel', 'Zehntel', 'Elftel', 'Zwölftel'];
    W('halbesos5', function (box) {
        const pf = (t, d) => { const m = String(t || d).match(/^(\d+)\/(\d+)$/); return m ? [+m[1], +m[2]] : d.split('/').map(Number); };
        const S = { a: pf(box.dataset.a, '2/5'), b: pf(box.dataset.b, '3/4') };
        const rA = div(box, 'b-ctrls'), rB = div(box, 'b-ctrls');
        rA.insertAdjacentHTML('afterbegin', '<span class="b-ctrl os5-lab" style="color:' + LAM + '">A</span>');
        rB.insertAdjacentHTML('afterbegin', '<span class="b-ctrl os5-lab" style="color:' + CY + '">B</span>');
        const o = [stepper(rA, 'Zähler', 'az', 'Zähler A'), stepper(rA, 'Nenner', 'an', 'Nenner A'), stepper(rB, 'Zähler', 'bz', 'Zähler B'), stepper(rB, 'Nenner', 'bn', 'Nenner B')];
        [rA, rB].forEach(r => r.addEventListener('click', e => {
            const b = e.target.closest('[data-k]'); if (!b) return;
            const F = S[b.dataset.k[0]], d = +b.dataset.d;
            if (b.dataset.k[1] === 'z') F[0] = clamp(F[0] + d, 0, 2 * F[1]);
            else { F[1] = clamp(F[1] + d, 1, 12); F[0] = Math.min(F[0], 2 * F[1]); }
            render();
        }));
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        heroOnly(box, pic, [rA, rB, out], 420);
        const fr = F => '\\tfrac{' + F[0] + '}{' + F[1] + '}';
        const half = F => Math.sign(2 * F[0] - F[1]), whole1 = F => Math.sign(F[0] - F[1]);
        const hw = F => half(F) < 0 ? 'weniger als ein Halbes' : half(F) > 0 ? 'mehr als ein Halbes' : 'genau ein Halbes';
        function reason(A, Bf) {
            const c = A[0] * Bf[1] - Bf[0] * A[1], rel = c < 0 ? '<' : c > 0 ? '>' : '=';
            const res = '$' + fr(A) + ' ' + rel + ' ' + fr(Bf) + '$';
            if (!c) return [res, 'Die gefärbten Längen sind genau gleich: zwei Namen für dieselbe Zahl.'];
            if (A[1] === Bf[1]) return [res, '<b>Gleicher Nenner:</b> Beide Male sind es ' + NTH[A[1]] + ', also gleich große Stücke. Es kommt nur darauf an, wie viele: ' + A[0] + ' ' + rel + ' ' + Bf[0] + '.'];
            if (A[0] === Bf[0]) return [res, '<b>Gleicher Zähler:</b> Beide Male sind es ' + A[0] + (A[0] === 1 ? ' Stück' : ' Stücke') + '. ' + NTH[Math.min(A[1], Bf[1])] + ' sind größer als ' + NTH[Math.max(A[1], Bf[1])] +
                ': Je größer der Nenner, desto kleiner die Stücke.'];
            if (whole1(A) !== whole1(Bf)) return [res, '<b>Vergleich mit 1:</b> $' + fr(A) + '$ ist ' + (whole1(A) < 0 ? 'weniger als' : whole1(A) > 0 ? 'mehr als' : 'genau') + ' ein Ganzes, $' + fr(Bf) + '$ ist ' + (whole1(Bf) < 0 ? 'weniger als' : whole1(Bf) > 0 ? 'mehr als' : 'genau') + ' ein Ganzes.'];
            if (half(A) !== half(Bf) && whole1(A) < 0) return [res, '<b>Vergleich mit einem Halben:</b> $' + fr(A) + '$ ist ' + hw(A) + ', denn ' + A[0] + ' ist ' + (half(A) < 0 ? 'weniger' : half(A) > 0 ? 'mehr' : 'genau') + ' als die Hälfte von ' + A[1] +
                '. $' + fr(Bf) + '$ ist ' + hw(Bf) + '.'];
            const ma = A[1] - A[0], mb = Bf[1] - Bf[0];
            if (ma === mb && ma > 0) return [res, '<b>Was fehlt zum Ganzen?</b> Bei A fehlen ' + ma + ' ' + NTH[A[1]] + ', bei B ' + mb + ' ' + NTH[Bf[1]] + '. ' + NTH[Math.max(A[1], Bf[1])] + ' sind kleiner, also fehlt bei ' + (A[1] > Bf[1] ? 'A' : 'B') + ' weniger.'];
            return [res, 'Hier hilft das Bild: Der längere gefärbte Streifen gehört zum größeren Bruch. Genau nachrechnen kannst du das in Klasse 6, wenn du Brüche erweiterst.'];
        }
        function bar(F, y, col, U, X0, wholes) {
            const [z, n] = F, w = U / n;
            let s = '';
            for (let i = 0; i < n * wholes; i++) s += rect(X0 + i * w, y, w, 34, 'fill:' + (i < z ? rgba(col, 0.42) : 'rgba(0,0,0,0.15)') + ';stroke:' + (i < z ? col : DIM) + ';stroke-width:1');
            return s;
        }
        function render() {
            const A = S.a, Bf = S.b;
            o[0].textContent = A[0]; o[1].textContent = A[1]; o[2].textContent = Bf[0]; o[3].textContent = Bf[1];
            const wholes = A[0] > A[1] || Bf[0] > Bf[1] ? 2 : 1, X0 = 36, U = 480 / wholes;
            let s = bar(A, 34, LAM, U, X0, wholes) + bar(Bf, 98, CY, U, X0, wholes);
            s += T(18, 57, 'A', 'g-pt', 'middle', 'fill:' + LAM) + T(18, 121, 'B', 'g-pt', 'middle', 'fill:' + CY);
            for (let h = 1; h <= 2 * wholes; h++) {
                const x = X0 + h * U / 2, full = h % 2 === 0;
                s += line([x, 22], [x, 142], 'stroke:' + (full ? TXT : PHI) + ';stroke-width:' + (full ? 2 : 1.6) + (full ? '' : ';stroke-dasharray:5 4'));
                s += T(x, 16, full ? String(h / 2) : (h === 1 ? '½' : (h - 1) / 2 + '½'), 'g-small', 'middle', full ? '' : 'fill:' + PHI);
            }
            s += line([X0, 22], [X0, 142], 'stroke:' + TXT + ';stroke-width:2') + T(X0, 16, '0', 'g-small');
            pic.innerHTML = svg(540, 150, 'Zwei Bruchstreifen untereinander, mit der Marke für ein Halbes', s);
            const [res, why] = reason(A, Bf);
            out.innerHTML = '<p class="g5-big"><span class="g-lam">A</span> ' + res.replace(/\$(.*)\$/, (m, x) => '$' + x + '$') + ' <span class="g-cy">B</span></p><p>' + why + '</p>';
            math(out);
        }
        render();
    });
})();
