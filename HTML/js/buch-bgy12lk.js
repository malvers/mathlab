/* buch-bgy12lk.js — widgets of the book "Mathematik · Berufliches Gymnasium 12 · Leistungskurs" that the other modules do not have
 * (js/buch.js, js/buch-plot.js). Stochastics, calculus and vector widgets of the other books are used as they are.
 *   titelbildbgy12lk     cover art: a distribution function as a staircase over its bars, a curve with the tangent that replaces it near
 *                        the point of contact, a three-sided pyramid with its centroid
 *   verteilungsfunktion  a discrete random variable as a bar chart and its distribution function F(x) = P(X ≤ x) as a staircase;
 *                        a slider for b (and a) gives P(X ≤ b), P(X > b) = 1 − F(b) or P(a < X ≤ b) = F(b) − F(a)
 *                        data-set="muenzen|wuerfel|rad" picks the first example
 * Looks: js/buch.css (shared classes only).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;

    /* ---------- cover art ---------- */
    W('titelbildbgy12lk', function (box) {
        const Wd = 600, Ht = 850, n1 = v => v.toFixed(1);
        let grid = '';
        for (let x = 0; x <= Wd; x += 66.7) grid += '<line x1="' + n1(x) + '" y1="0" x2="' + n1(x) + '" y2="' + Ht + '" />';
        for (let y = 0; y <= Ht; y += 65.4) grid += '<line x1="0" y1="' + n1(y) + '" x2="' + Wd + '" y2="' + n1(y) + '" />';
        // middle: a curve and the tangent at P, which hugs the curve near P (linear approximation)
        const X = t => 40 + 520 * t, Y = v => 650 - 230 * v;
        const f = t => 0.48 + 0.3 * Math.sin(5.2 * t - 0.7) + 0.15 * t;
        const fd = t => 0.3 * 5.2 * Math.cos(5.2 * t - 0.7) + 0.15;
        let curve = '';
        for (let i = 0; i <= 160; i++) { const t = i / 160; curve += (i ? 'L' : 'M') + n1(X(t)) + ' ' + n1(Y(f(t))); }
        const t0 = 0.66, m = fd(t0), tg = t => f(t0) + m * (t - t0);
        let art = '<line x1="0" y1="' + n1(Y(0)) + '" x2="' + Wd + '" y2="' + n1(Y(0)) + '" stroke="#cfe4f5" stroke-opacity="0.22" stroke-width="1.2"/>';
        art += '<path d="' + curve + '" stroke="#F5C242" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#tbb12-glow)"/>';
        art += '<line x1="' + n1(X(t0 - 0.3)) + '" y1="' + n1(Y(tg(t0 - 0.3))) + '" x2="' + n1(X(t0 + 0.3)) + '" y2="' + n1(Y(tg(t0 + 0.3))) +
            '" stroke="#7fd8ee" stroke-width="2.6" stroke-linecap="round" filter="url(#tbb12-glow)"/>';
        art += '<circle cx="' + n1(X(t0)) + '" cy="' + n1(Y(f(t0))) + '" r="46" fill="none" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="3 5"/>';
        art += '<circle cx="' + n1(X(t0)) + '" cy="' + n1(Y(f(t0))) + '" r="5.5" fill="#e682be"/>';
        // lower left: B(6; 0,5) as bars and its distribution function as a staircase
        const pm = [1, 6, 15, 20, 15, 6, 1].map(c => c / 64), bx = k => 34 + k * 36, by = 752, hs = 150;
        let stairs = '', acc = 0, bars = '';
        pm.forEach((p, k) => {
            const h = p * hs;
            bars += '<rect x="' + n1(bx(k) - 6) + '" y="' + n1(by - h) + '" width="12" height="' + n1(h) + '" rx="1.5" fill="#A0C85A" fill-opacity="0.5"/>';
            const yOld = by - acc * hs; acc += p; const yNew = by - acc * hs;
            stairs += '<line x1="' + n1(bx(k)) + '" y1="' + n1(yNew) + '" x2="' + n1(bx(k) + 36) + '" y2="' + n1(yNew) + '" stroke="#F5C242" stroke-width="2.8" stroke-linecap="round"/>';
            stairs += '<circle cx="' + n1(bx(k)) + '" cy="' + n1(yOld) + '" r="3.6" fill="none" stroke="#F5C242" stroke-width="1.6"/>';
            stairs += '<circle cx="' + n1(bx(k)) + '" cy="' + n1(yNew) + '" r="3.8" fill="#F5C242"/>';
        });
        stairs += '<line x1="10" y1="' + by + '" x2="' + n1(bx(0)) + '" y2="' + by + '" stroke="#F5C242" stroke-width="2.8" stroke-linecap="round"/>';
        stairs += '<line x1="14" y1="' + (by + 0.5) + '" x2="292" y2="' + (by + 0.5) + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2"/>';
        // lower right: a three-sided pyramid ABCD and its centroid S = (A + B + C + D) / 4
        const P = (x, y, z) => [452 + x * 62 - y * 36, 738 - z * 62 + y * 22];
        const A = [-1.6, 0, 0], Bp = [1.7, -0.6, 0], C = [0.4, 1.9, 0], D = [0.2, 0.4, 2.3];
        const S = [0, 1, 2].map(i => (A[i] + Bp[i] + C[i] + D[i]) / 4), G = [0, 1, 2].map(i => (A[i] + Bp[i] + C[i]) / 3);
        const l = (a, b, c, w, extra) => { const p = P(...a), q = P(...b); return '<line x1="' + n1(p[0]) + '" y1="' + n1(p[1]) + '" x2="' + n1(q[0]) + '" y2="' + n1(q[1]) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || '') + '/>'; };
        const base = [A, Bp, C].map(q => P(...q)).map(q => n1(q[0]) + ',' + n1(q[1])).join(' ');
        let pyr = '<polygon points="' + base + '" fill="#B8A4F2" fill-opacity="0.13" stroke="none"/>';
        pyr += l(A, Bp, '#B8A4F2', 1.4, ' stroke-dasharray="5 5"') + l(Bp, C, '#B8A4F2', 2.2) + l(C, A, '#B8A4F2', 2.2);   // A–B is the hidden back edge
        pyr += l(A, D, '#B8A4F2', 2.2) + l(Bp, D, '#B8A4F2', 2.2) + l(C, D, '#B8A4F2', 2.2);
        pyr += l(D, G, '#e682be', 1.8, ' stroke-dasharray="4 5"');
        [G, S].forEach((q, i) => { const p = P(...q); pyr += '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="' + (i ? 5.4 : 3.6) + '" fill="' + (i ? '#e682be' : '#cfe4f5') + '"' + (i ? ' filter="url(#tbb12-glow)"' : '') + '/>'; });
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: eine Verteilungsfunktion als Treppe über ihren Stäben, eine Kurve mit der Tangente, die sie im Berührpunkt ersetzt, und eine dreiseitige Pyramide mit ihrem Schwerpunkt">' +
            '<defs><linearGradient id="tbb12-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="tbb12-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tbb12-fade)"/></mask>' +
            '<filter id="tbb12-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Wd + '" height="' + Ht + '"><feGaussianBlur stdDeviation="5" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g mask="url(#tbb12-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' + art + bars + stairs + '</g>' + pyr + '</svg>';
    });

    /* ---------- the distribution function of a discrete random variable ---------- */
    W('verteilungsfunktion', function (box) {
        const SETS = {
            muenzen: { k: 'Drei Münzen', x: 'Anzahl Wappen bei drei Münzwürfen', v: [0, 1, 2, 3], n: [1, 3, 3, 1], d: 8 },
            wuerfel: { k: 'Würfel', x: 'Augenzahl eines Würfels', v: [1, 2, 3, 4, 5, 6], n: [1, 1, 1, 1, 1, 1], d: 6 },
            rad: { k: 'Glücksrad', x: 'Gewinn in € (Auszahlung minus 2 € Einsatz)', v: [-2, -1, 1, 6], n: [5, 2, 2, 1], d: 10 }
        };
        let key = SETS[box.dataset.set] ? box.dataset.set : 'muenzen', mode = 'le';
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(SETS).map(k => [k, SETS[k].k]), key, v => { key = v; setup(); }, 'Zufallsgröße');
        const ctl2 = div(box, 'b-ctrls');
        seg(ctl2, [['le', 'P(X ≤ b)'], ['gt', 'P(X > b)'], ['ab', 'P(a < X ≤ b)']], mode, v => { mode = v; draw(); }, 'Gesuchte Wahrscheinlichkeit');
        const help = div(box, 'b-help');
        const sl = div(box, '');
        const p1 = new B.Plot(div(box, ''), { height: 190, xStep: 1, yLabel: 'P', aria: 'Wahrscheinlichkeitsfunktion als Stabdiagramm' });
        const p2 = new B.Plot(div(box, ''), { height: 230, xStep: 1, yLabel: 'F', aria: 'Verteilungsfunktion als Treppenfunktion' });
        const out = div(box, 'b-out');
        out.style.marginTop = '12px';
        let ra = null, rb = null;
        function F(x) { const G = SETS[key]; let s = 0; G.v.forEach((v, i) => { if (v <= x + 1e-9) s += G.n[i]; }); return s / G.d; }
        function setup() {
            const G = SETS[key], lo = Math.min(...G.v) - 1, hi = Math.max(...G.v) + 1;
            sl.innerHTML = '';
            ra = range(sl, { label: 'a', min: lo, max: hi, step: 0.1, value: G.v[0], fmt: v => fmt(v, 1), onInput: draw });
            rb = range(sl, { label: 'b', min: lo, max: hi, step: 0.1, value: G.v[Math.floor(G.v.length / 2)], fmt: v => fmt(v, 1), onInput: draw });
            draw();
        }
        function draw() {
            const G = SETS[key], p = G.n.map(c => c / G.d), lo = Math.min(...G.v) - 1, hi = Math.max(...G.v) + 1;
            let a = ra.get(), b = rb.get();
            ra.input.parentElement.style.display = mode === 'ab' ? '' : 'none';
            if (mode === 'ab' && a > b) { const t = a; a = b; b = t; }
            help.innerHTML = '$X$ = ' + G.x + '. Oben die Wahrscheinlichkeitsfunktion $x_i \\mapsto P(X = x_i)$, unten die Verteilungsfunktion $F(x) = P(X \\le x)$.';
            math(help);
            const inSet = v => mode === 'le' ? v <= b + 1e-9 : mode === 'gt' ? v > b + 1e-9 : v > a + 1e-9 && v <= b + 1e-9;
            p1.view([lo, hi], [0, Math.max(...p) * 1.3]);
            p1.draw(G.v.map((x, i) => ({ seg: [[x, 0], [x, p[i]]], color: inSet(x) ? 'lambda' : 'dim', width: 6 }))
                .concat([{ pts: G.v.map((x, i) => [x, p[i]]), color: 'cyan', r: 3 }, { vline: b, color: 'cyan' }])
                .concat(mode === 'ab' ? [{ vline: a, color: 'pink' }] : []));
            // the staircase: closed dot at the upper value of each jump (F is continuous from the right)
            const L = [], xs = [lo].concat(G.v, [hi]);
            for (let i = 0; i < xs.length - 1; i++) { const y = F(xs[i] + (i ? 0 : -1e-6)); L.push({ seg: [[xs[i], y], [xs[i + 1], y]], color: 'lambda', width: 3 }); }
            G.v.forEach(x => { L.push({ pts: [[x, F(x)]], color: 'lambda', r: 4.5 }); L.push({ pts: [[x, F(x - 1e-6)]], color: 'dim', r: 3.5 }); });
            L.push({ hline: 1, color: 'dim', dash: true }, { vline: b, color: 'cyan' }, { pts: [[b, F(b)]], color: 'cyan', r: 5 });
            if (mode === 'ab') L.push({ vline: a, color: 'pink' }, { pts: [[a, F(a)]], color: 'pink', r: 5 });
            p2.view([lo, hi], [0, 1.15]);
            p2.draw(L);
            const t = v => texNum(v, 4), bb = texNum(b, 1), aa = texNum(a, 1);
            out.innerHTML = mode === 'le' ? '<p style="margin:0">$P(X \\le ' + bb + ') = F(' + bb + ') \\approx ' + t(F(b)) + '$</p>'
                : mode === 'gt' ? '<p style="margin:0">$P(X > ' + bb + ') = 1 - F(' + bb + ') \\approx 1 - ' + t(F(b)) + ' = ' + t(1 - F(b)) + '$</p>'
                : '<p style="margin:0">$P(' + aa + ' < X \\le ' + bb + ') = F(' + bb + ') - F(' + aa + ') \\approx ' + t(F(b)) + ' - ' + t(F(a)) + ' = ' + t(F(b) - F(a)) + '$</p>';
            math(out);
        }
        setup();
    });
})();
