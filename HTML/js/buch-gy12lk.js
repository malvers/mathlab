/* buch-gy12lk.js — widgets of the book "Mathematik · Gymnasium 12 · Leistungskurs" that the other modules do not have
 * (js/buch.js, js/buch-plot.js). Calculus, vector and stochastics widgets of the other books are used as they are.
 *   titelbildgy12lk   cover art: a solid of revolution, binomial bars under the bell curve, two skew lines and their common perpendicular
 *   normalverteilung  the density of N(μ; σ²) with sliders: P(X ≤ b), P(a ≤ X ≤ b), P(X ≥ a), σ-intervals; density or distribution function
 *                     data-mu, data-sigma, data-xr="x0,x1", data-unit, data-a, data-b set a context (body heights, filling machines …)
 *   moivre            binomial histogram B(n; p) with the normal density of the same μ and σ on top; standardised view
 *   rotation          a graph turning around the x-axis in real 3D (Three.js): the solid, its disks, V = π ∫ f(x)² dx
 *   integralfunktion  the area from a to x under f and the graph of the integral function I_a with its tangent: I_a'(x) = f(x)
 *   hesse2d           a line in the plane in Hesse normal form, a draggable point and its signed distance
 *   simpson           parabolic arcs over pairs of strips (Kepler, Simpson) with a table against the trapezoid rule and a stopping rule
 *   abstand3d         point and line (data-mode="pg") or two lines, skew or not (data-mode="gg"), in real 3D with feet and shortest connection
 *   uneigentlich      areas that reach to infinity: A(b) for b → ∞ (or a → 0) converging or growing without bound
 * Looks: js/buch.css (shared classes only; the 3D stage uses .vk-stage from the vector chapters).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;

    // ---------- the normal distribution ----------
    // erf after Abramowitz/Stegun 7.1.26 (|error| < 1.5e-7, enough for four decimals)
    function erf(x) {
        const s = x < 0 ? -1 : 1, t = 1 / (1 + 0.3275911 * Math.abs(x));
        const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
        return s * y;
    }
    const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
    const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
    const dens = (x, mu, sd) => phi((x - mu) / sd) / sd;
    B.normal = { Phi, phi, dens };
    const binomPmf = (n, p, k) => {
        if (k < 0 || k > n) return 0;
        let lg = 0;
        for (let i = 1; i <= k; i++) lg += Math.log(n - k + i) - Math.log(i);
        return Math.exp(lg + k * Math.log(p) + (n - k) * Math.log(1 - p));
    };
    const niceStep = r => { const m = Math.pow(10, Math.floor(Math.log10(r))); return [1, 2, 5, 10].map(f => f * m).find(s => s >= r) || r; };
    const roundTo = (v, s) => Math.round(v / s) * s;
    const dec = s => Math.max(0, -Math.floor(Math.log10(s) + 1e-9));

    /* ---------- cover art ---------- */
    W('titelbildgy12lk', function (box) {
        const Wd = 600, Ht = 850, n1 = v => v.toFixed(1);
        let grid = '';
        for (let x = 0; x <= Wd; x += 66.7) grid += '<line x1="' + n1(x) + '" y1="0" x2="' + n1(x) + '" y2="' + Ht + '" />';
        for (let y = 0; y <= Ht; y += 65.4) grid += '<line x1="0" y1="' + n1(y) + '" x2="' + Wd + '" y2="' + n1(y) + '" />';
        // middle: a vase-like solid around a horizontal axis, drawn with elliptic disks (oblique view)
        const ax = 520, x0 = 70, x1 = 530, R = x => 34 + 46 * Math.exp(-((x - 0.38) ** 2) / 0.05) * 0.9 + 26 * Math.sin(Math.PI * x) ** 2, sq = 0.32;
        const X = t => x0 + (x1 - x0) * t;
        let top = '', bot = '';
        for (let i = 0; i <= 120; i++) { const t = i / 120; top += (i ? 'L' : 'M') + n1(X(t)) + ' ' + n1(ax - R(t)); bot += 'L' + n1(X(1 - t)) + ' ' + n1(ax + R(1 - t)); }
        let solid = '<path d="' + top + bot + 'Z" fill="#7fd8ee" fill-opacity="0.07"/>';
        let disks = '';
        for (let k = 0; k <= 12; k++) {
            const t = 0.02 + 0.96 * k / 12, r = R(t);
            disks += '<ellipse cx="' + n1(X(t)) + '" cy="' + ax + '" rx="' + n1(r * sq) + '" ry="' + n1(r) + '"/>';
        }
        solid += '<g fill="none" stroke="#7fd8ee" stroke-opacity="0.45" stroke-width="1.3">' + disks + '</g>';
        solid += '<path d="' + top + '" stroke="#F5C242" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#tbg12lk-glow)"/>';
        solid += '<path d="M' + bot.slice(1) + '" stroke="#F5C242" stroke-opacity="0.45" stroke-width="1.6" fill="none" stroke-dasharray="6 6"/>';
        solid += '<line x1="40" y1="' + ax + '" x2="566" y2="' + ax + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="3 6"/>';
        // lower left: B(20; 0,5) with the bell curve of the same mean and spread
        const n = 20, mu = 10, sd = Math.sqrt(5), bx = k => 4 + k * 13.5, by = 780, sc = 820;
        let bars = '';
        for (let k = 3; k <= 17; k++) {
            const h = binomPmf(n, 0.5, k) * sc, red = k >= 14;
            bars += '<rect x="' + n1(bx(k) - 5.4) + '" y="' + n1(by - h) + '" width="10.8" height="' + n1(h) + '" rx="1.5" fill="' + (red ? '#e2665a' : '#A0C85A') + '" fill-opacity="' + (red ? 0.75 : 0.42) + '"/>';
        }
        let bell = '';
        for (let i = 0; i <= 100; i++) { const x = 2.5 + 15 * i / 100; bell += (i ? 'L' : 'M') + n1(bx(x)) + ' ' + n1(by - dens(x, mu, sd) * sc); }
        bars += '<path d="' + bell + '" stroke="#F5C242" stroke-width="2.6" fill="none" filter="url(#tbg12lk-glow)"/>';
        bars += '<line x1="22" y1="' + (by + 0.5) + '" x2="248" y2="' + (by + 0.5) + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2"/>';
        // lower right: two skew lines (one in front, one behind) and their shortest connection
        const P = (x, y, z) => [440 + x * 58 - y * 34, 742 - z * 58 + y * 20];
        // a faint floor plane under the lower line gives the depth
        const floor = [[-1.9, -1.4, 0.2], [2.3, -1.4, 0.2], [2.3, 1.6, 0.2], [-1.9, 1.6, 0.2]].map(q => P(...q)).map(q => n1(q[0]) + ',' + n1(q[1])).join(' ');
        const l = (a, b, c, w, extra) => { const p = P(...a), q = P(...b); return '<line x1="' + n1(p[0]) + '" y1="' + n1(p[1]) + '" x2="' + n1(q[0]) + '" y2="' + n1(q[1]) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || '') + '/>'; };
        let skew = '<polygon points="' + floor + '" fill="#B8A4F2" fill-opacity="0.13" stroke="#B8A4F2" stroke-opacity="0.45" stroke-width="1.2" stroke-linejoin="round"/>';
        skew += l([-1.6, 0, 0.2], [2, 0, 0.2], '#B8A4F2', 2.6);
        skew += l([0.3, -1.8, 1.4], [0.3, 2.4, 1.4], '#7fd8ee', 3, ' filter="url(#tbg12lk-glow)"');
        skew += l([0.3, 0, 0.2], [0.3, 0, 1.4], '#e682be', 2.2, ' stroke-dasharray="5 5"');
        [[0.3, 0, 0.2], [0.3, 0, 1.4]].forEach(p => { const q = P(...p); skew += '<circle cx="' + n1(q[0]) + '" cy="' + n1(q[1]) + '" r="4.2" fill="#e682be"/>'; });
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Rotationskörper mit Kreisscheiben, ein Binomialhistogramm unter der Glockenkurve, zwei windschiefe Geraden mit ihrem kürzesten Verbindungsstück">' +
            '<defs><linearGradient id="tbg12lk-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="tbg12lk-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tbg12lk-fade)"/></mask>' +
            '<filter id="tbg12lk-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Wd + '" height="' + Ht + '"><feGaussianBlur stdDeviation="5" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g mask="url(#tbg12lk-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' + solid + bars + '</g>' + skew + '</svg>';
    });

    /* ---------- normal distribution: density, probabilities, σ-intervals ---------- */
    W('normalverteilung', function (box) {
        const d = box.dataset;
        const xr = (d.xr || '-4,4').split(',').map(Number), span = xr[1] - xr[0];
        const step = niceStep(span / 160), dg = dec(step), unit = d.unit ? '\\,\\text{' + d.unit + '}' : '';
        const S = { mu: d.mu != null ? +d.mu : (xr[0] + xr[1]) / 2, sd: d.sigma != null ? +d.sigma : span / 8, mode: d.mode || 'ab',
            a: d.a != null ? +d.a : xr[0] + span * 0.35, b: d.b != null ? +d.b : xr[0] + span * 0.6, view: 'dichte' };
        const sl = div(box, '');
        const sdStep = niceStep(span / 400);
        const clean = (v, s) => { const r = roundTo(v, s); return Math.abs(r) < s / 2 ? 0 : +r.toFixed(dec(s) + 2); };
        range(sl, { label: 'Erwartungswert $\\mu$', min: roundTo(xr[0] + span * 0.2, step), max: roundTo(xr[1] - span * 0.2, step), step, value: S.mu, fmt: v => fmt(clean(v, step), dg), onInput: v => { S.mu = clean(v, step); render(); } });
        range(sl, { label: 'Standardabweichung $\\sigma$', min: roundTo(Math.max(sdStep, span / 40), sdStep), max: roundTo(span / 5, sdStep), step: sdStep, value: S.sd, fmt: v => fmt(v, dec(sdStep)), onInput: v => { S.sd = v; render(); } });
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['le', '$P(X \\le b)$'], ['ab', '$P(a \\le X \\le b)$'], ['ge', '$P(X \\ge a)$'], ['sigma', '$\\sigma$-Regeln']], S.mode, v => { S.mode = v; render(); }, 'Was wird berechnet?');
        seg(ctl, [['dichte', 'Dichte'], ['vert', 'Verteilungsfunktion']], S.view, v => { S.view = v; render(); }, 'Ansicht');
        math(ctl);
        const abBox = div(box, '');
        const ra = range(abBox, { label: '$a$', min: xr[0], max: xr[1], step, value: S.a, fmt: v => fmt(clean(v, step), dg), onInput: v => { v = clean(v, step); S.a = Math.min(v, S.mode === 'ab' ? S.b : xr[1]); ra.set(S.a); render(); } });
        const rb = range(abBox, { label: '$b$', min: xr[0], max: xr[1], step, value: S.b, fmt: v => fmt(clean(v, step), dg), onInput: v => { v = clean(v, step); S.b = Math.max(v, S.mode === 'ab' ? S.a : xr[0]); rb.set(S.b); render(); } });
        const plot = new Plot(div(box, ''), { height: 270, x: xr, y: [0, 1], xLabel: d.unit || 'x', yLabel: 'φ', aria: 'Dichtefunktion der Normalverteilung mit markierter Fläche' });
        const out = div(box, 'b-out');
        function render() {
            const { mu, sd, mode } = S, f = x => dens(x, mu, sd), top = dens(mu, mu, sd);
            ra.input.parentElement.style.display = mode === 'le' || mode === 'sigma' ? 'none' : '';
            rb.input.parentElement.style.display = mode === 'ge' || mode === 'sigma' ? 'none' : '';
            const z = x => (x - mu) / sd, nz = v => texNum(v, 2), np4 = v => texNum(v, 4);
            let lo = xr[0] - span, hi = xr[1] + span, tex = '', L = [];
            if (mode === 'le') { hi = S.b; tex = 'P(X \\le ' + texNum(S.b, dg) + ') = \\Phi\\!\\left(\\tfrac{' + texNum(S.b, dg) + ' - ' + texNum(mu, dg) + '}{' + texNum(sd, dec(sdStep)) + '}\\right) = \\Phi(' + nz(z(S.b)) + ') \\approx ' + np4(Phi(z(S.b))); }
            else if (mode === 'ge') { lo = S.a; tex = 'P(X \\ge ' + texNum(S.a, dg) + ') = 1 - \\Phi(' + nz(z(S.a)) + ') \\approx ' + np4(1 - Phi(z(S.a))); }
            else if (mode === 'ab') { lo = S.a; hi = S.b; tex = 'P(' + texNum(S.a, dg) + ' \\le X \\le ' + texNum(S.b, dg) + ') = \\Phi(' + nz(z(S.b)) + ') - \\Phi(' + nz(z(S.a)) + ') \\approx ' + np4(Phi(z(S.b)) - Phi(z(S.a))); }
            if (S.view === 'dichte') {
                plot.view(xr, [0, top * 1.22]);
                if (mode === 'sigma') {
                    [[3, 'violet'], [2, 'cyan'], [1, 'lambda']].forEach(([k, c]) => L.push({ area: f, from: mu - k * sd, to: mu + k * sd, color: c }));
                    [1, 2, 3].forEach(k => { L.push({ vline: mu - k * sd }, { vline: mu + k * sd }); });
                } else L.push({ area: f, from: Math.max(lo, xr[0] - 1), to: Math.min(hi, xr[1] + 1), color: 'lambda' });
                L.push({ fn: f, color: 'lambda', label: 'φ', labelAt: mu + 1.25 * sd }, { vline: mu, color: 'red' }, { text: 'μ', at: [mu, top * 1.1], color: 'red' });
                if (mode !== 'sigma') { L.push({ seg: [[mu, top * 0.6], [mu + sd, top * 0.6]], color: 'white', arrow: true }); L.push({ text: 'σ', at: [mu + sd / 2 - span / 90, top * 0.6], color: 'white' }); }
            } else {
                const F = x => Phi(z(x));
                plot.view(xr, [-0.08, 1.15]);
                L.push({ hline: 1 }, { hline: 0.5 }, { fn: F, color: 'cyan', label: 'F' }, { vline: mu, color: 'red' });
                if (mode === 'le') L.push({ seg: [[S.b, 0], [S.b, F(S.b)]], color: 'lambda' }, { seg: [[xr[0], F(S.b)], [S.b, F(S.b)]], color: 'lambda', dash: true }, { pts: [[S.b, F(S.b)]], color: 'lambda' });
                else if (mode === 'ge') L.push({ seg: [[S.a, F(S.a)], [S.a, 1]], color: 'lambda', width: 4 }, { pts: [[S.a, F(S.a)]], color: 'lambda' });
                else if (mode === 'ab') L.push({ seg: [[S.b, F(S.a)], [S.b, F(S.b)]], color: 'lambda', width: 4 }, { seg: [[S.a, F(S.a)], [S.b, F(S.a)]], color: 'lambda', dash: true }, { pts: [[S.a, F(S.a)], [S.b, F(S.b)]], color: 'lambda' });
                else [1, 2, 3].forEach(k => L.push({ pts: [[mu - k * sd, F(mu - k * sd)], [mu + k * sd, F(mu + k * sd)]], color: 'violet' }));
            }
            plot.draw(L);
            let html = '<p style="margin:0 0 6px">$X \\sim N(\\mu;\\ \\sigma^2)$ mit $\\mu = ' + texNum(mu, dg) + unit + '$ und $\\sigma = ' + texNum(sd, dec(sdStep)) + unit + '$. ' +
                'Standardisieren: $Z = \\dfrac{X - \\mu}{\\sigma}$ ist standardnormalverteilt.</p>';
            if (mode === 'sigma') html += '<p style="margin:0">' + [1, 2, 3].map(k => '$P(\\mu - ' + (k > 1 ? k : '') + '\\sigma \\le X \\le \\mu + ' + (k > 1 ? k : '') + '\\sigma) = P(' + texNum(mu - k * sd, dg) + ' \\le X \\le ' + texNum(mu + k * sd, dg) + ') \\approx ' + np4(Phi(k) - Phi(-k)) + '$').join('<br>') + '</p>';
            else html += '<p style="margin:0">$' + tex + '$' + (S.view === 'dichte' ? '. Das ist die gelbe Fläche.' : '. Das ist der gelbe Anstieg der Verteilungsfunktion.') + '</p>';
            out.innerHTML = html; math(out);
        }
        render();
    });

    /* ---------- de Moivre–Laplace: binomial bars and the bell curve ---------- */
    W('moivre', function (box) {
        const S = { n: +(box.dataset.n || 20), p: +(box.dataset.p || 0.3), std: false };
        const sl = div(box, '');
        range(sl, { label: 'Anzahl der Versuche $n$', min: 4, max: 400, step: 1, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; render(); } });
        range(sl, { label: 'Trefferwahrscheinlichkeit $p$', min: 0.02, max: 0.98, step: 0.01, value: S.p, fmt: v => fmt(v, 2), onInput: v => { S.p = v; render(); } });
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['0', 'Histogramm'], ['1', 'standardisiert']], '0', v => { S.std = v === '1'; render(); }, 'Ansicht');
        const plot = new Plot(div(box, ''), { height: 270, yLabel: 'P', xLabel: 'k', aria: 'Histogramm der Binomialverteilung mit der Glockenkurve gleichen Erwartungswerts und gleicher Standardabweichung' });
        const out = div(box, 'b-out');
        function render() {
            const { n, p } = S, mu = n * p, sd = Math.sqrt(n * p * (1 - p));
            let err = 0, max = 0, rects = [];
            const k0 = Math.max(0, Math.floor(mu - 4.5 * sd - 1)), k1 = Math.min(n, Math.ceil(mu + 4.5 * sd + 1));
            for (let k = k0; k <= k1; k++) {
                const P = binomPmf(n, p, k);
                err = Math.max(err, Math.abs(P - dens(k, mu, sd)));
                max = Math.max(max, P);
                if (S.std) rects.push([(k - 0.5 - mu) / sd, (k + 0.5 - mu) / sd, P * sd]);
                else rects.push([k - 0.5, k + 0.5, P]);
            }
            if (S.std) {
                plot.view([-4.2, 4.2], [0, Math.max(0.45, max * sd * 1.15)]);
                plot.draw([{ rects, color: 'cyan' }, { fn: phi, color: 'lambda', label: 'φ' }, { vline: 0, color: 'red' }]);
            } else {
                plot.view([k0 - 1, k1 + 1], [0, Math.max(max, dens(mu, mu, sd)) * 1.2]);
                plot.draw([{ rects, color: 'cyan' }, { fn: x => dens(x, mu, sd), color: 'lambda' }, { vline: mu, color: 'red' }, { text: 'μ', at: [mu, Math.max(max, dens(mu, mu, sd)) * 1.1], color: 'red' }]);
            }
            const ok = sd > 3;
            out.innerHTML = '<p style="margin:0 0 6px">Erwartungswert $\\mu = n \\cdot p = ' + texNum(mu, 2) + '$, Standardabweichung $\\sigma = \\sqrt{n \\cdot p \\cdot (1 - p)} \\approx ' + texNum(sd, 3) + '$.<br>' +
                'Laplace-Bedingung $\\sigma > 3$: <b style="color:var(--b-' + (ok ? 'phi' : 'red') + ')">' + (ok ? 'erfüllt' : 'nicht erfüllt') + '</b></p>' +
                '<p style="margin:0">' + (S.std ? 'Standardisiert: Jede Säule wird um $\\mu$ verschoben, in der Breite durch $\\sigma$ geteilt und in der Höhe mit $\\sigma$ multipliziert. Für großes $n$ legen sich alle Histogramme auf dieselbe Kurve $\\varphi$.'
                    : 'Größte Abweichung zwischen $P(X = k)$ und der Glockenkurve an der Stelle $k$: $' + texNum(err, 4) + '$.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- solids of revolution in real 3D ---------- */
    const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
    let threeP = null;
    const three = () => threeP || (threeP = import(THREE_URL));
    const PAL = { lambda: 'rgb(245,194,66)', cyan: '#7fd8ee', phi: 'rgb(160,200,90)', red: '#e2665a', violet: '#b8a4f2', axis: '#8fa3bd', pink: '#e682be' };
    const col3 = c => { const v = PAL[c] || c; return window.Farbschema && Farbschema.map ? Farbschema.map(v, 'line') : v; };
    const BODIES = {
        kegel: { k: 'Kegel', tex: 'f(x) = \\tfrac12 x', f: x => 0.5 * x, a: 0, b: 4, V: 16 * Math.PI / 3, Vtex: '\\tfrac{16}{3}\\pi' },
        kugel: { k: 'Kugel', tex: 'f(x) = \\sqrt{4 - x^2}', f: x => Math.sqrt(Math.max(0, 4 - x * x)), a: -2, b: 2, V: 32 * Math.PI / 3, Vtex: '\\tfrac{32}{3}\\pi' },
        wurzel: { k: 'Paraboloid', tex: 'f(x) = \\sqrt{x}', f: x => Math.sqrt(Math.max(0, x)), a: 0, b: 4, V: 8 * Math.PI, Vtex: '8\\pi' },
        fass: { k: 'Fass', tex: 'f(x) = 2 - 0{,}08x^2', f: x => 2 - 0.08 * x * x, a: -2.5, b: 2.5, V: Math.PI * (20 - 10 / 3 + 0.25), Vtex: '\\tfrac{203}{12}\\pi' }
    };
    W('rotation', function (box) {
        const S = { key: box.dataset.body || 'kegel', n: 0, az: -0.32, el: 0.34 };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.entries(BODIES).map(([k, o]) => [k, o.k]), S.key, v => { S.key = v; build(); }, 'Welcher Körper?');
        const sl = div(box, '');
        range(sl, { label: 'Kreisscheiben $n$', min: 0, max: 40, step: 1, value: S.n, fmt: v => v ? String(v) : 'aus', onInput: v => { S.n = v; build(); } });
        const wrap = div(box, 'b-canvasbox vk-stage');
        wrap.style.height = '340px';
        const cv = document.createElement('canvas');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar');
        wrap.appendChild(cv);
        const hint = div(wrap, 'vk-hint'); hint.textContent = 'Ziehen zum Drehen';
        const out = div(box, 'b-out');
        let T, renderer, scene, camera, layer, base;
        const v3 = (x, y, z) => new T.Vector3(x, y, z);         // here: x to the right, y up, z towards the viewer
        const mat = (c, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: new T.Color(col3(c)), roughness: 0.5, metalness: 0.05 }, o));
        function clear(g) { while (g.children.length) { const o = g.children.pop(); o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map) x.material.map.dispose(); x.material.dispose(); } }); } }
        function label(text, p, c, size = 0.42, g = layer) {
            const c2 = document.createElement('canvas'), ctx = c2.getContext('2d'), px = 64, font = 'italic 600 ' + px + 'px Raleway, system-ui, sans-serif';
            ctx.font = font; const w = Math.ceil(ctx.measureText(text).width) + 24; c2.width = w; c2.height = px + 24;
            ctx.font = font; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.fillStyle = col3(c); ctx.fillText(text, w / 2, c2.height / 2);
            const tex = new T.CanvasTexture(c2); tex.colorSpace = T.SRGBColorSpace;
            const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
            s.scale.set(size * w / c2.height, size, 1); s.position.copy(p); s.renderOrder = 10; g.add(s);
        }
        function line(pts, c, o = {}, g = layer) {
            const l = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: new T.Color(col3(c)), transparent: true, opacity: o.opacity || 1 }));
            g.add(l); return l;
        }
        function axes() {
            clear(base);
            const ax = (a, b, n, lp) => {
                const d = new T.Vector3().subVectors(b, a), L = d.length(), grp = new T.Group();
                const sh = new T.Mesh(new T.CylinderGeometry(0.022, 0.022, L - 0.3, 10), mat('axis')); sh.position.y = (L - 0.3) / 2;
                const tip = new T.Mesh(new T.ConeGeometry(0.075, 0.3, 14), mat('axis')); tip.position.y = L - 0.15;
                grp.add(sh, tip); grp.position.copy(a); grp.quaternion.setFromUnitVectors(v3(0, 1, 0), d.normalize()); base.add(grp);
                label(n, lp, 'axis', 0.5, base);
            };
            ax(v3(-3.4, 0, 0), v3(5.2, 0, 0), 'x', v3(5.45, 0.05, 0));
            ax(v3(0, -2.6, 0), v3(0, 2.9, 0), 'y', v3(0.05, 3.15, 0));
            ax(v3(0, 0, -2.6), v3(0, 0, 2.9), 'z', v3(0, 0.05, 3.15));
            for (let k = -3; k <= 5; k++) if (k) label(String(k), v3(k, -0.32, 0), 'axis', 0.28, base);
        }
        function cam() { const R = 9.6 * Math.max(1, 1.55 / (camera.aspect || 2)); camera.position.set(R * Math.sin(S.az) * Math.cos(S.el) + 0.8, R * Math.sin(S.el), R * Math.cos(S.az) * Math.cos(S.el)); camera.lookAt(0.8, 0, 0); }
        function draw() { if (!renderer) return; cam(); renderer.render(scene, camera); }
        function size() { const w = wrap.clientWidth, h = wrap.clientHeight; if (!w || !h || !renderer) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); draw(); }
        function build() {
            const o = BODIES[S.key];
            if (T) {
                clear(layer);
                const NX = 72, NT = 56, pos = [], idx = [];
                for (let i = 0; i <= NX; i++) {
                    const x = o.a + (o.b - o.a) * i / NX, r = o.f(x);
                    for (let j = 0; j <= NT; j++) { const t = 2 * Math.PI * j / NT; pos.push(x, r * Math.cos(t), r * Math.sin(t)); }
                }
                for (let i = 0; i < NX; i++) for (let j = 0; j < NT; j++) { const a = i * (NT + 1) + j, b = a + NT + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
                const geo = new T.BufferGeometry();
                geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
                const skin = new T.Mesh(geo, mat('cyan', { transparent: true, opacity: S.n ? 0.12 : 0.34, side: T.DoubleSide, depthWrite: false }));
                layer.add(skin);
                // meridians and a few circles: the shape stays readable while turning
                for (let j = 0; j < 8; j++) {
                    const t = Math.PI * j / 4, pts = [];
                    for (let i = 0; i <= NX; i++) { const x = o.a + (o.b - o.a) * i / NX, r = o.f(x); pts.push(v3(x, r * Math.cos(t), r * Math.sin(t))); }
                    line(pts, 'cyan', { opacity: 0.35 });
                }
                // the generating graph in the x-y plane, bright
                const gp = [];
                for (let i = 0; i <= 160; i++) { const x = o.a + (o.b - o.a) * i / 160; gp.push(v3(x, o.f(x), 0)); }
                const tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(gp), 160, 0.045, 8, false), mat('lambda', { emissive: new T.Color(col3('lambda')), emissiveIntensity: 0.35 }));
                layer.add(tube);
                label('f', v3(o.b + 0.15, o.f(o.b) + 0.35, 0), 'lambda', 0.46);
                if (S.n) {
                    const dx = (o.b - o.a) / S.n;
                    for (let i = 0; i < S.n; i++) {
                        const xm = o.a + (i + 0.5) * dx, r = o.f(xm);
                        if (r < 1e-3) continue;
                        const cyl = new T.Mesh(new T.CylinderGeometry(r, r, dx * 0.92, 40), mat(i % 2 ? 'lambda' : 'phi', { transparent: true, opacity: 0.55 }));
                        cyl.rotation.z = Math.PI / 2; cyl.position.set(xm, 0, 0); layer.add(cyl);
                    }
                }
                draw();
            }
            let sum = 0;
            if (S.n) { const dx = (o.b - o.a) / S.n; for (let i = 0; i < S.n; i++) { const r = o.f(o.a + (i + 0.5) * dx); sum += Math.PI * r * r * dx; } }
            out.innerHTML = '<p style="margin:0 0 6px">$' + o.tex + '$ auf $[' + texNum(o.a, 1) + ';\\ ' + texNum(o.b, 1) + ']$ dreht sich um die $x$-Achse: ' +
                '$V = \\pi \\displaystyle\\int_{' + texNum(o.a, 1) + '}^{' + texNum(o.b, 1) + '} f(x)^2\\,\\mathrm{d}x = ' + o.Vtex + ' \\approx ' + texNum(o.V, 2) + '$</p>' +
                '<p style="margin:0">' + (S.n ? 'Summe der ' + S.n + ' Kreisscheiben (Radius in der Mitte jedes Streifens): $\\sum \\pi \\, f(x_i)^2 \\, \\Delta x \\approx ' + texNum(sum, 2) + '$, Abweichung $' + texNum(Math.abs(sum - o.V), 3) + '$.'
                    : 'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.') + '</p>';
            math(out);
        }
        B.later(three().then(M => {
            T = M;
            renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: B.printing() });
            renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
            scene = new T.Scene(); camera = new T.PerspectiveCamera(32, 1, 0.1, 200);
            scene.add(new T.AmbientLight(0xffffff, 0.8));
            const sun = new T.DirectionalLight(0xffffff, 0.9); sun.position.set(4, 9, 8); scene.add(sun);
            base = new T.Group(); layer = new T.Group(); scene.add(base, layer);
            axes();
            cv.style.touchAction = 'pan-y'; cv.style.cursor = 'grab';
            let last = null;
            cv.addEventListener('pointerdown', e => { last = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; });
            cv.addEventListener('pointermove', e => {
                if (!last) return;
                S.az -= (e.clientX - last[0]) * 0.008; S.el = Math.max(-0.6, Math.min(1.4, S.el + (e.clientY - last[1]) * 0.006));
                last = [e.clientX, e.clientY]; draw();
            });
            const end = () => { last = null; cv.style.cursor = 'grab'; };
            cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
            if (window.ResizeObserver) new ResizeObserver(size).observe(wrap);
            addEventListener('resize', size);
            addEventListener('farbschema', () => { axes(); build(); });
            size(); build();
        }));
        build();
    });

    /* ---------- the integral function and the fundamental theorem ---------- */
    const IFN = {
        parabel: { k: 'f(x) = x² − 2x', tex: 'x^2 - 2x', f: x => x * x - 2 * x, I: (a, x) => (x ** 3 / 3 - x * x) - (a ** 3 / 3 - a * a), x: [-1.5, 3.8], y: [-1.8, 3.6], Iy: [-2.2, 2.4] },
        sinus: { k: 'f(x) = sin x', tex: '\\sin x', f: Math.sin, I: (a, x) => Math.cos(a) - Math.cos(x), x: [-1, 7], y: [-1.5, 1.5], Iy: [-0.6, 2.6] },
        gerade: { k: 'f(x) = 2 − x', tex: '2 - x', f: x => 2 - x, I: (a, x) => (2 * x - x * x / 2) - (2 * a - a * a / 2), x: [-1.5, 5.5], y: [-3.8, 3.8], Iy: [-4.5, 2.6] }
    };
    W('integralfunktion', function (box) {
        const S = { key: box.dataset.fn || 'parabel', a: 0, x: 2.5 };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.entries(IFN).map(([k, o]) => [k, o.k]), S.key, v => { S.key = v; const o = IFN[v]; S.x = Math.min(S.x, o.x[1] - 0.2); render(); }, 'Welche Funktion?');
        const sl = div(box, '');
        const ra = range(sl, { label: 'untere Grenze $a$', min: -1, max: 3, step: 0.1, value: S.a, fmt: v => fmt(v, 1), onInput: v => { S.a = v; render(); } });
        const top = new Plot(div(box, ''), { height: 220, aria: 'Graph von f mit der Fläche von a bis x' });
        const bot = new Plot(div(box, ''), { height: 220, yLabel: 'I', aria: 'Graph der Integralfunktion mit Tangente' });
        const out = div(box, 'b-out');
        top.handles([{ x: S.x, y: 0, color: 'lambda' }], (i, x) => { const o = IFN[S.key]; S.x = Math.max(o.x[0] + 0.1, Math.min(o.x[1] - 0.1, x)); render(); });
        function render() {
            const o = IFN[S.key], f = o.f, I = x => o.I(S.a, x), lo = Math.min(S.a, S.x), hi = Math.max(S.a, S.x);
            top.view(o.x, o.y);
            // the lower picture follows I_a: its range changes with the lower limit a
            let lo2 = 0, hi2 = 0;
            for (let i = 0; i <= 120; i++) { const v = I(o.x[0] + (o.x[1] - o.x[0]) * i / 120); lo2 = Math.min(lo2, v); hi2 = Math.max(hi2, v); }
            const pad = Math.max(0.4, (hi2 - lo2) * 0.12);
            bot.view(o.x, [Math.max(lo2 - pad, o.Iy[0] - 6), Math.min(hi2 + pad, o.Iy[1] + 6)]);
            top.hs = [{ x: S.x, y: 0, color: 'lambda' }];
            top.draw([{ area: x => Math.max(0, f(x)), from: lo, to: hi, color: 'lambda' }, { area: x => Math.min(0, f(x)), from: lo, to: hi, color: 'red' },
                { fn: f, color: 'lambda', label: 'f' }, { vline: S.a, color: 'dim' }, { text: 'a', at: [S.a, o.y[1] * 0.85], color: 'dim' }, { seg: [[S.x, 0], [S.x, f(S.x)]], color: 'lambda', dash: true }]);
            const m = f(S.x), y0 = I(S.x), w = (o.x[1] - o.x[0]) * 0.12;
            bot.draw([{ fn: I, color: 'cyan', width: 1.4, dash: true }, { fn: I, color: 'cyan', domain: [o.x[0], S.x], label: 'I' },
                { seg: [[S.x - w, y0 - m * w], [S.x + w, y0 + m * w]], color: 'pink', width: 2.2 }, { pts: [[S.x, y0], [S.a, 0]], color: 'cyan' }]);
            const sgn = S.x < S.a ? ' (x links von a: das Integral zählt rückwärts)' : '';
            const integrand = /[+-]/.test(o.tex) ? '\\left(' + o.tex.replace(/x/g, 't') + '\\right)' : o.tex.replace(/x/g, 't');
            out.innerHTML = '<p style="margin:0 0 6px">$I_{' + texNum(S.a, 1) + '}(x) = \\displaystyle\\int_{' + texNum(S.a, 1) + '}^{x} ' + integrand + '\\,\\mathrm{d}t$. ' +
                'An der Stelle $x = ' + texNum(S.x, 2) + '$: $I_{' + texNum(S.a, 1) + '}(' + texNum(S.x, 2) + ') \\approx ' + texNum(y0, 3) + '$' + sgn + '.</p>' +
                '<p style="margin:0">Die pinke Tangente an $I$ hat die Steigung $' + texNum(m, 3) + '$, und das ist genau $f(' + texNum(S.x, 2) + ')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.</p>';
            math(out);
        }
        render();
    });

    /* ---------- Hesse normal form of a line in the plane ---------- */
    W('hesse2d', function (box) {
        const S = { A: [-1, 1], ang: 0.5, P: [2.5, 3] };
        const sl = div(box, '');
        range(sl, { label: 'Richtung des Normalenvektors', min: 0, max: 360, step: 1, value: Math.round(S.ang * 180 / Math.PI), fmt: v => v + '°', onInput: v => { S.ang = v * Math.PI / 180; render(); } });
        const plot = new Plot(div(box, ''), { height: 320, x: [-5, 5], y: [-4, 4], equal: true, aria: 'Gerade mit Normaleneinheitsvektor, ein Punkt P und sein Lot auf die Gerade' });
        const out = div(box, 'b-out');
        plot.handles([], (i, x, y) => { const p = [Math.round(x * 2) / 2, Math.round(y * 2) / 2]; if (i === 0) S.A = p; else S.P = p; render(); });
        function render() {
            const n0 = [Math.cos(S.ang), Math.sin(S.ang)], u = [-n0[1], n0[0]], A = S.A, P = S.P;
            const c = n0[0] * A[0] + n0[1] * A[1], d = n0[0] * P[0] + n0[1] * P[1] - c, F = [P[0] - d * n0[0], P[1] - d * n0[1]];
            const far = 20, L = [[A[0] - far * u[0], A[1] - far * u[1]], [A[0] + far * u[0], A[1] + far * u[1]]];
            plot.hs = [{ x: A[0], y: A[1], color: 'violet' }, { x: P[0], y: P[1], color: 'lambda' }];
            plot.draw([{ seg: L, color: 'violet', width: 2.6 }, { seg: [A, [A[0] + n0[0], A[1] + n0[1]]], color: 'pink', arrow: true, width: 2.4 },
                { text: 'n₀', at: [A[0] + n0[0], A[1] + n0[1]], color: 'pink' }, { seg: [P, F], color: 'lambda', dash: true }, { pts: [F], color: 'white' },
                { text: 'A', at: A, color: 'violet', dx: -18, dy: 20 }, { text: 'P', at: P, color: 'lambda' }, { text: 'F', at: F, color: 'white' }]);
            const a = n0[0], b = n0[1], tn = v => texNum(Math.abs(v) < 5e-4 ? 0 : v, 3);
            const sgnTxt = Math.abs(d) < 1e-9 ? 'P liegt auf der Geraden.' : d > 0 ? 'Positiv: P liegt auf der Seite, in die $\\vec n_0$ zeigt.' : 'Negativ: P liegt auf der anderen Seite.';
            out.innerHTML = '<p style="margin:0 0 6px">Hessesche Normalform: $' + tn(a) + ' \\cdot x ' + (b < 0 ? '-' : '+') + ' ' + tn(Math.abs(b)) + ' \\cdot y ' + (c < 0 ? '+' : '-') + ' ' + tn(Math.abs(c)) + ' = 0$ ' +
                'mit $|\\vec n_0| = 1$.</p><p style="margin:0">Punkt einsetzen: $' + tn(a) + ' \\cdot ' + texNum(P[0], 1) + (b < 0 ? ' - ' : ' + ') + tn(Math.abs(b)) + ' \\cdot ' + texNum(P[1], 1) + (c < 0 ? ' + ' : ' - ') + tn(Math.abs(c)) + ' \\approx ' + tn(d) + '$. ' +
                'Abstand $d(P, g) \\approx ' + tn(Math.abs(d)) + '$. ' + sgnTxt + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- Kepler and Simpson: parabolic arcs instead of chords ---------- */
    W('simpson', function (box) {
        const FN = {
            gauss: { k: 'e^(−x²)', tex: '\\mathrm{e}^{-x^2}', f: x => Math.exp(-x * x), a: 0, b: 1, I: 0.746824132812427, y: [-0.1, 1.15] },
            sinus: { k: 'sin x', tex: '\\sin x', f: Math.sin, a: 0, b: Math.PI, I: 2, y: [-0.2, 1.3], btex: '\\pi' },
            hyperbel: { k: '1/x', tex: '\\tfrac1x', f: x => 1 / x, a: 1, b: 2, I: Math.LN2, y: [-0.1, 1.15] },
            wurzel: { k: '√x', tex: '\\sqrt{x}', f: Math.sqrt, a: 0, b: 4, I: 16 / 3, y: [-0.3, 2.4] }
        };
        let G = FN.gauss, n = 2;
        B.seg(div(box, 'b-ctrls'), Object.entries(FN).map(([k, o]) => [k, 'f(x) = ' + o.k]), 'gauss', v => { G = FN[v]; render(); }, 'Funktion');
        range(div(box, ''), { label: 'Anzahl der Streifen $n$ (gerade)', min: 2, max: 20, step: 2, value: n, fmt: v => String(v), onInput: v => { n = v; render(); } });
        const p = new Plot(div(box, ''), { height: 280, aria: 'Graph mit Parabelbögen über je zwei Streifen' });
        const out = div(box, 'b-out');
        const trapez = k => { const { f, a, b } = G, h = (b - a) / k; let s = (f(a) + f(b)) / 2; for (let i = 1; i < k; i++) s += f(a + i * h); return s * h; };
        const simpson = k => { const { f, a, b } = G, h = (b - a) / k; let s = f(a) + f(b); for (let i = 1; i < k; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return s * h / 3; };
        // the parabola through three points (Lagrange form)
        const par = (x0, x1, x2, y0, y1, y2) => x => y0 * (x - x1) * (x - x2) / ((x0 - x1) * (x0 - x2)) + y1 * (x - x0) * (x - x2) / ((x1 - x0) * (x1 - x2)) + y2 * (x - x0) * (x - x1) / ((x2 - x0) * (x2 - x1));
        function render() {
            const { f, a, b } = G, h = (b - a) / n, pad = (b - a) * 0.1;
            p.view([a - pad, b + pad], G.y);
            const L = [];
            for (let i = 0; i < n; i += 2) {
                const x0 = a + i * h, x1 = x0 + h, x2 = x1 + h, q = par(x0, x1, x2, f(x0), f(x1), f(x2));
                L.push({ area: q, from: x0, to: x2, color: i % 4 ? 'cyan' : 'phi' }, { fn: q, domain: [x0, x2], color: 'phi', width: 1.6 }, { vline: x2 });
            }
            const pts = []; for (let i = 0; i <= n; i++) pts.push([a + i * h, f(a + i * h)]);
            L.push({ fn: f, color: 'lambda', label: 'f' }, { pts, color: 'white', r: 3.5 });
            p.draw(L);
            const ks = [n, 2 * n, 4 * n], T = ks.map(trapez), S = ks.map(simpson), eT = T.map(v => v - G.I), eS = S.map(v => v - G.I);
            // stopping rule: halve the strips until two Simpson values differ by less than 10^-6
            let k = 2, prev = simpson(2), stop = null;
            while (k < 4096) { const nx = simpson(2 * k); if (Math.abs(nx - prev) < 1e-6) { stop = 2 * k; break; } prev = nx; k *= 2; }
            const e = v => Math.abs(v) < 5e-13 ? '0' : texNum(v, 7);
            out.innerHTML = '<p style="margin:0 0 6px">$\\int_{' + texNum(a, 0) + '}^{' + (G.btex || texNum(b, 0)) + '} ' + G.tex + '\\,\\mathrm{d}x \\approx ' + texNum(G.I, 7) + '$. Simpson mit $n = ' + n + '$: $' + texNum(S[0], 7) + '$</p>' +
                '<div class="b-table-wrap"><table class="b-table"><tr><th>$n$</th><th>Trapez</th><th>Fehler</th><th>Simpson</th><th>Fehler</th></tr>' +
                ks.map((kk, i) => '<tr><td>$' + kk + '$</td><td>$' + texNum(T[i], 6) + '$</td><td>$' + e(eT[i]) + '$</td><td>$' + texNum(S[i], 7) + '$</td><td>$' + e(eS[i]) + '$</td></tr>').join('') + '</table></div>' +
                '<p style="margin:6px 0 0">Doppelt so viele Streifen: Trapezfehler etwa durch $' + texNum(eT[0] / eT[1], 1) + '$, Simpsonfehler etwa durch $' + (Math.abs(eS[1]) > 1e-13 ? texNum(eS[0] / eS[1], 1) : '\\infty') + '$ geteilt. ' +
                'Abbruchregel „zwei Simpson-Werte unterscheiden sich um weniger als $10^{-6}$“: ' + (stop ? 'erfüllt ab $n = ' + stop + '$.' : 'erst sehr spät erfüllt.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- distances in space: point and line, skew lines (uses the 3D stage of js/buch-vektoren.js) ---------- */
    W('abstand3d', function (box) {
        const V = B.vk;
        if (!B.Raum || !V) { box.textContent = 'Das 3D-Modul fehlt.'; return; }
        const { coords, presetRow, vtex, add, sub, mul, dot, len, cross, n2 } = V;
        const mode = box.dataset.mode === 'gg' ? 'gg' : 'pg';
        const g3 = v => v.map(x => n2(x)).join(' \\mid ');
        const PRE = mode === 'pg'
            ? { a: { k: 'Beispiel 1', A: [1, 0, 1], u: [1, 2, 2], P: [4, 0, 4] }, b: { k: 'Beispiel 2', A: [0, 0, 0], u: [1, 1, 0], P: [2, 0, 3] }, c: { k: 'P auf g', A: [1, 0, 1], u: [1, 2, 2], P: [2, 2, 3] } }
            : { a: { k: 'windschief', P: [-1, -1, -1], u: [2, 2, 1], Q: [2, 0, 3], v: [0, 1, 1] }, b: { k: 'schneidend', P: [1, 0, 1], u: [1, 1, 0], Q: [2, 3, 0], v: [1, -1, 1] }, c: { k: 'parallel', P: [1, 0, 1], u: [1, 1, 0], Q: [0, 2, 3], v: [2, 2, 0] } };
        const S = JSON.parse(JSON.stringify(PRE.a));
        const keys = mode === 'pg' ? [['A', 'A', 'cyan'], ['u', 'u', 'cyan'], ['P', 'P', 'lambda']] : [['P', 'P', 'cyan'], ['u', 'u', 'cyan'], ['Q', 'Q', 'phi'], ['v', 'v', 'phi']];
        presetRow(box, PRE, pr => { keys.forEach(([k], i) => cs[i].set(pr[k].slice())); draw(); });
        const inBox = div(box, 'vk-inputs vk-four');
        const cs = keys.map(([k, nm, c]) => coords(inBox, nm, S[k], draw, c));
        math(inBox);
        const R = new B.Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        const lineThrough = (P, u, c) => { const k = 12 / len(u); R.line(add(P, mul(-k, u)), add(P, mul(k, u)), c); };
        const eq = v => Math.abs(v - Math.round(v)) < 1e-9 ? '= ' + texNum(Math.round(v), 0) : '\\approx ' + texNum(v, 3);
        function draw() {
            R.ready.then(() => {
                R.clear();
                let html;
                if (mode === 'pg') {
                    const { A, u, P } = S;
                    if (len(u) < 1e-9) { out.innerHTML = '<p style="margin:0">Der Richtungsvektor darf nicht der Nullvektor sein.</p>'; R.render(); return; }
                    const t = dot(sub(P, A), u) / dot(u, u), F = add(A, mul(t, u)), d = len(sub(P, F)), c = len(cross(sub(P, A), u)) / len(u);
                    lineThrough(A, u, 'cyan'); R.dot(A, 'cyan', 0.09); R.label('g', add(A, [0, 0, 0.45]), 'cyan');
                    R.dot(P, 'lambda', 0.13); R.label('P', add(P, [0, 0.3, 0.45]), 'lambda');
                    R.dot(F, 'white', 0.1); R.label('F', add(F, [0, 0.3, -0.45]), 'white');
                    if (d > 1e-7) R.line(P, F, 'red', { dash: true });
                    html = '<p style="margin:0 0 6px">$g\\colon \\vec{x} = ' + vtex(A) + ' + t \\cdot ' + vtex(u) + '$, $P(' + g3(P) + ')$</p>' +
                        '<p style="margin:0 0 6px">Lotfußpunkt: $\\big(\\vec{p} - \\vec{f}(t)\\big) \\circ \\vec{u} = 0$ gibt $t = ' + n2(t) + '$, also $F(' + g3(F) + ')$ und $d(P, g) = |\\vec{FP}| ' + eq(d) + '$.</p>' +
                        '<p style="margin:0">Kontrolle mit dem Vektorprodukt: $\\dfrac{|(\\vec{p} - \\vec{a}) \\times \\vec{u}|}{|\\vec{u}|} ' + eq(c) + '$' + (d < 1e-7 ? '. $P$ liegt auf $g$.' : '.') + '</p>';
                } else {
                    const { P, u, Q, v } = S;
                    if (len(u) < 1e-9 || len(v) < 1e-9) { out.innerHTML = '<p style="margin:0">Richtungsvektoren dürfen nicht der Nullvektor sein.</p>'; R.render(); return; }
                    lineThrough(P, u, 'cyan'); lineThrough(Q, v, 'phi');
                    R.dot(P, 'cyan', 0.09); R.label('g', add(P, [0, 0, 0.45]), 'cyan'); R.dot(Q, 'phi', 0.09); R.label('h', add(Q, [0, 0, 0.45]), 'phi');
                    const n = cross(u, v), nl = len(n);
                    const head = '<p style="margin:0 0 6px">$g\\colon \\vec{x} = ' + vtex(P) + ' + t \\cdot ' + vtex(u) + '$, $\\;h\\colon \\vec{x} = ' + vtex(Q) + ' + s \\cdot ' + vtex(v) + '$</p>';
                    if (nl < 1e-9) {
                        const t = dot(sub(Q, P), u) / dot(u, u), F = add(P, mul(t, u)), d = len(sub(Q, F));
                        if (d > 1e-7) { R.line(Q, F, 'red', { dash: true }); R.dot(F, 'white', 0.08); }
                        html = head + '<p style="margin:0">$\\vec{u} \\times \\vec{v} = \\vec{0}$: Die Geraden sind parallel. Dann ist ihr Abstand der Abstand des Punktes $Q$ von $g$: $d ' + eq(d) + '$' + (d < 1e-7 ? ', sie sind identisch.' : '.') + '</p>';
                    } else {
                        const w0 = sub(P, Q), a = dot(u, u), b = dot(u, v), c = dot(v, v), dd = dot(u, w0), e = dot(v, w0), den = a * c - b * b;
                        const t = (b * e - c * dd) / den, s2 = (a * e - b * dd) / den, Fg = add(P, mul(t, u)), Fh = add(Q, mul(s2, v));
                        const d = Math.abs(dot(sub(Q, P), n)) / nl;
                        if (d > 1e-7) {
                            R.line(Fg, Fh, 'pink', { dash: true }); R.dot(Fg, 'white', 0.09); R.dot(Fh, 'white', 0.09);
                            R.label('F', add(Fg, [0, -0.35, -0.4]), 'white'); R.label('G', add(Fh, [0, 0.35, 0.4]), 'white');
                        } else { R.dot(Fg, 'lambda', 0.14); R.label('S', add(Fg, [0, 0.3, 0.45]), 'lambda'); }
                        html = head + '<p style="margin:0 0 6px">$\\vec{n} = \\vec{u} \\times \\vec{v} = ' + vtex(n) + '$ steht auf beiden Geraden senkrecht, $|\\vec{n}| ' + eq(nl) + '$.</p>' +
                            '<p style="margin:0">$d(g, h) = \\dfrac{|(\\vec{q} - \\vec{p}) \\circ \\vec{n}|}{|\\vec{n}|} = \\dfrac{' + n2(Math.abs(dot(sub(Q, P), n))) + '}{' + texNum(nl, 3) + '} ' + eq(d) + '$' +
                            (d < 1e-7 ? '. Abstand $0$: Die Geraden <b>schneiden</b> sich in $S(' + g3(Fg) + ')$.' : '. <b>Windschief</b>; das kürzeste Verbindungsstück (pink) verbindet $F(' + g3(Fg) + ')$ und $G(' + g3(Fh) + ')$.') + '</p>';
                    }
                }
                out.innerHTML = html; math(out); R.render();
            });
        }
        draw();
    });

    /* ---------- improper integrals ---------- */
    const UFN = {
        quadrat: { k: '1/x²', tex: '\\frac{1}{x^2}', f: x => 1 / (x * x), A: b => 1 - 1 / b, lim: '1', from: 1 },
        hyperbel: { k: '1/x', tex: '\\frac{1}{x}', f: x => 1 / x, A: b => Math.log(b), lim: '\\infty', from: 1 },
        exp: { k: 'e^(−x)', tex: '\\mathrm{e}^{-x}', f: x => Math.exp(-x), A: b => 1 - Math.exp(-b), lim: '1', from: 0 },
        wurzel: { k: '1/√x bei 0', tex: '\\frac{1}{\\sqrt{x}}', f: x => 1 / Math.sqrt(x), A: a => 2 - 2 * Math.sqrt(a), lim: '2', zero: true }
    };
    W('uneigentlich', function (box) {
        const S = { key: box.dataset.fn || 'quadrat', t: 0.4 };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.entries(UFN).map(([k, o]) => [k, o.k]), S.key, v => { S.key = v; render(); }, 'Welche Funktion?');
        const sl = div(box, '');
        const rr = range(sl, { label: 'Grenze', min: 0, max: 1, step: 0.005, value: S.t, fmt: () => '', onInput: v => { S.t = v; render(); } });
        const plot = new Plot(div(box, ''), { height: 250, x: [-0.4, 10.5], y: [-0.25, 2.6], aria: 'Fläche unter einer Kurve bis zu einer verschiebbaren Grenze' });
        const out = div(box, 'b-out');
        function render() {
            const o = UFN[S.key];
            // the slider runs on a log scale: b from 1 (or 0) to 10 000, or a from 1 down to 10⁻⁶
            const g = o.zero ? Math.pow(10, -6 * S.t) : (o.from === 0 ? 10000 * (Math.pow(10, 4 * S.t) - 1) / 9999 : Math.pow(10, 4 * S.t));
            const gTex = g >= 100 ? texNum(Math.round(g), 0) : g < 0.001 ? '10^{' + Math.round(Math.log10(g)) + '}' : texNum(g, 3);
            const row = rr.input.parentElement, lab = row.querySelector('label'), want = o.zero ? 'untere Grenze $a$' : 'obere Grenze $b$';
            if (lab.dataset.k !== want) { lab.dataset.k = want; lab.innerHTML = want; math(lab); }
            row.querySelector('output').innerHTML = g >= 100 ? fmt(Math.round(g), 0) : g >= 10 ? fmt(g, 1) : g < 0.001 ? '10<sup>' + Math.round(Math.log10(g)) + '</sup>' : fmt(g, 3);
            const lo = o.zero ? g : o.from, hi = o.zero ? 1 : g, A = o.A(g);
            plot.draw([{ area: o.f, from: Math.max(lo, 0.004), to: Math.min(hi, 10.5), color: 'lambda' }, { fn: o.f, color: 'lambda', domain: [0.004, 10.5], label: 'f' },
                { vline: o.zero ? lo : Math.min(hi, 10.5), color: 'red' }]);
            const rows = (o.zero ? [0.1, 0.01, 0.0001, 0.000001] : [10, 100, 1000, 10000]).map(v => '$' + (o.zero ? 'a' : 'b') + ' = ' + (v < 0.001 ? '10^{' + Math.round(Math.log10(v)) + '}' : texNum(v, 4)) + '$: $A \\approx ' + texNum(o.A(v), 4) + '$').join('; ');
            const intTex = o.zero ? '\\int_{' + gTex + '}^{1} ' : '\\int_{' + o.from + '}^{' + gTex + '} ';
            out.innerHTML = '<p style="margin:0 0 6px">$' + intTex + o.tex + '\\,\\mathrm{d}x \\approx ' + texNum(A, 4) + '$' + (!o.zero && g > 10.5 ? ' (die Grenze liegt weit rechts außerhalb des Bildes)' : '') + '</p>' +
                '<p style="margin:0 0 6px">' + rows + '</p><p style="margin:0">Grenzwert: $' + (o.zero ? '\\lim_{a \\to 0}' : '\\lim_{b \\to \\infty}') + ' A = ' + o.lim + '$' +
                (o.lim === '\\infty' ? ': Die Fläche ist unbegrenzt, obwohl der Graph sich der Achse nähert.' : ': Die unbegrenzte Fläche hat einen endlichen Inhalt.') + '</p>';
            math(out);
        }
        render();
    });
})();
