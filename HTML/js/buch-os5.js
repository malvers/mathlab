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
})();
