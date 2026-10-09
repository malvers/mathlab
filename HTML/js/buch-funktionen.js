/* buch-funktionen.js — widgets for the chapters on functions (Lernbereich 3) of the textbook (js/buch.js, js/buch-plot.js).
 *   graph            a fixed figure: data-fns='["x^2","2^x"]' data-x="-4,4" data-y="-1,8" [data-labels, data-pts, data-pi, data-h, data-equal]
 *   cover            the book cover: the basic functions side by side
 *   detektiv         pick a function, guess its properties, uncover them one by one
 *   wachstum         linear against exponential growth (saving, radioactive decay, own values)
 *   parabel          f(x) = a(x − d)² + e with sliders and a draggable vertex; normal form and zeros
 *   wurf             vertical throw h(t) = h0 + v0·t − g/2·t²
 *   einheitskreis    the point on the unit circle draws the sine curve
 *   sinus            f(x) = a·sin(b(x − c)) + d
 *   tageslaenge      day length in Dresden as a sine model
 *   regression       linear / quadratic / exponential regression on example data, points draggable
 *   anscombe         four data sets, one regression line (Anscombe 1973)
 *   umkehr           function and inverse, mirrored at y = x
 *   expgleichung     a^x = b solved with the logarithm, step by step
 *   parameter        c·f(x), f(x) + c, f(c·x), f(x + c) for the basic functions
 *   graphquiz        which term belongs to the graph?
 *   funktion         function or not? the vertical line test on six curves, then domain and range (book FOS 11)
 *   lage             two lines y = m·x + n: intersecting, orthogonal, parallel or identical; intersection point and angles (book FOS 11)
 *   parabelschar     families of parabolas with a case distinction on the parameter: number of zeros, vertex, locus (book FOS 11)
 *   ganzrational     f(x) = a·(x − x1)^k1·(x − x2)^k2·(x − x3)^k3: draggable zeros, multiplicities, behaviour at infinity (book FOS 11)
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;

    const { sg, co, sgx, compile } = B;                               // term helpers (js/buch.js)
    const COLORS = ['lambda', 'cyan', 'phi', 'red', 'violet', 'pink'];

    /* ---------- fixed figure ---------- */
    W('graph', function (box) {
        const d = box.dataset;
        const fns = JSON.parse(d.fns || '[]').map(compile);
        const labels = d.labels ? JSON.parse(d.labels) : [];
        const xr = (d.x || '-5,5').split(',').map(Number), yr = (d.y || '-5,5').split(',').map(Number);
        const p = new Plot(box, { x: xr, y: yr, height: +(d.h || 300), piX: d.pi != null, equal: d.equal != null,
            xLabel: d.xl || 'x', yLabel: d.yl || 'y', aria: d.aria || 'Funktionsgraph' });
        const lat = d.lat ? JSON.parse(d.lat) : [];   // x positions of the labels
        const layers = fns.map((f, i) => ({ fn: f, color: COLORS[i % COLORS.length], label: labels[i] || '', labelAt: lat[i] }));
        if (d.pts) layers.push({ pts: JSON.parse(d.pts), color: 'white' });
        if (d.hl) layers.push({ hline: +d.hl });
        p.draw(layers);
    });

    W('cover', function (box) {
        const p = new Plot(box, { x: [-4, 4], y: [-2.2, 4.2], height: 260, grid: false, aria: 'Graphen der Grundfunktionen' });
        p.draw([
            { fn: x => x * x, color: 'lambda', label: 'x²', labelAt: -1.95 },
            { fn: x => Math.pow(2, x), color: 'cyan', label: '2ˣ', labelAt: 1.15 },
            { fn: Math.sin, color: 'phi', label: 'sin x', labelAt: -3.6 },
            { fn: x => 1 / x, color: 'red', label: '1/x', labelAt: 2.6 },
            { fn: Math.sqrt, color: 'violet', label: '√x', labelAt: 3.3, domain: [0, 4] }
        ]);
    });

    /* ---------- the cover artwork: four function types sweeping through the lower part of the cover ---------- */
    W('titelbild', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const path = (f, a, b, n = 160) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x); d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); }
            return d;
        };
        const curves = [
            [x => -0.45 * (x - 1.8) ** 2 + 4.5, -1.6, 5.2, '#7fd8ee'],     // parabola
            [x => 1.1 * Math.sin(1.6 * x) + 0.4, -3, 6, '#F5C242'],          // sine
            [x => 0.35 * 1.9 ** x - 2.6, -3, 5.1, '#A0C85A'],                // exponential
            [x => 0.7 * x - 1.6, -3, 6, '#B8A4F2', '7 9']                    // straight line
        ];
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        let art = '';
        curves.forEach(([f, a, b, c, dash]) => {
            const d = path(f, a, b);
            art += '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.13" fill="none" stroke-linecap="round"/>' +
                '<path d="' + d + '" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        });
        // marked points lie exactly on their curves: parabola, the two sine crests, the exponential, the line
        const pts = [[0, curves[0][0](0)], [1.8, curves[0][0](1.8)], [3.6, curves[0][0](3.6)], [Math.PI / 3.2, 1.5], [Math.PI / 3.2 + 2 * Math.PI / 1.6, 1.5],
            [3, curves[2][0](3)], [-1, curves[3][0](-1)]];
        pts.forEach(([x, y]) => { art += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="6" fill="#fff"/><circle cx="' + X(x) + '" cy="' + Y(y) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade">' +
            '<defs><linearGradient id="tb-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="tb-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tb-fade)"/></mask></defs>' +
            '<g mask="url(#tb-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- function detective ---------- */
    W('detektiv', function (box) {
        const F = [
            { k: 'x²', tex: 'f(x) = x^2', f: x => x * x, y: [-1.5, 6],
              p: ['$\\mathbb{R}$', '$y \\geq 0$', '$x = 0$ (doppelt)', 'fallend für $x \\leq 0$, steigend für $x \\geq 0$', 'achsensymmetrisch zur $y$-Achse', 'nein', 'keine'] },
            { k: 'x³', tex: 'f(x) = x^3', f: x => x * x * x, y: [-5, 5],
              p: ['$\\mathbb{R}$', '$\\mathbb{R}$', '$x = 0$', 'überall steigend', 'punktsymmetrisch zum Ursprung', 'nein', 'keine'] },
            { k: '1/x', tex: 'f(x) = \\tfrac1x', f: x => 1 / x, y: [-5, 5],
              p: ['$\\mathbb{R} \\setminus \\{0\\}$', '$\\mathbb{R} \\setminus \\{0\\}$', 'keine', 'fallend auf $x < 0$ und fallend auf $x > 0$', 'punktsymmetrisch zum Ursprung', 'nein', '$x = 0$ (senkrecht) und $y = 0$ (waagerecht)'] },
            { k: '√x', tex: 'f(x) = \\sqrt{x}', f: x => Math.sqrt(x), y: [-1.5, 3.5],
              p: ['$x \\geq 0$', '$y \\geq 0$', '$x = 0$', 'überall steigend', 'keine', 'nein', 'keine'] },
            { k: '2ˣ', tex: 'f(x) = 2^x', f: x => Math.pow(2, x), y: [-1.5, 8],
              p: ['$\\mathbb{R}$', '$y > 0$', 'keine', 'überall steigend', 'keine', 'nein', '$y = 0$ für $x \\to -\\infty$'] },
            { k: 'sin x', tex: 'f(x) = \\sin x', f: Math.sin, y: [-2, 2], pi: true,
              p: ['$\\mathbb{R}$', '$-1 \\leq y \\leq 1$', '$x = k \\cdot \\pi$ mit $k \\in \\mathbb{Z}$', 'abwechselnd steigend und fallend', 'punktsymmetrisch zum Ursprung', 'ja, Periode $2\\pi$', 'keine'] },
            { k: '|x|', tex: 'f(x) = |x|', f: Math.abs, y: [-1.5, 5],
              p: ['$\\mathbb{R}$', '$y \\geq 0$', '$x = 0$', 'fallend für $x \\leq 0$, steigend für $x \\geq 0$', 'achsensymmetrisch zur $y$-Achse', 'nein', 'keine'] },
            { k: '½x² − 2', tex: 'f(x) = \\tfrac12 x^2 - 2', f: x => x * x / 2 - 2, y: [-3, 5],
              p: ['$\\mathbb{R}$', '$y \\geq -2$', '$x = -2$ und $x = 2$', 'fallend für $x \\leq 0$, steigend für $x \\geq 0$', 'achsensymmetrisch zur $y$-Achse', 'nein', 'keine'] }
        ];
        const NAMES = ['Definitionsbereich', 'Wertebereich', 'Nullstellen', 'Monotonie', 'Symmetrie', 'Periodisch?', 'Asymptoten'];
        let cur = 0;
        const ctr = div(box, 'b-ctrls');
        seg(ctr, F.map((x, i) => [i, x.k]), 0, v => { cur = +v; render(); }, 'Funktion');
        const two = div(box, 'b-two');
        const left = div(two, ''), right = div(two, '');
        const head = div(left, 'b-out', '');
        head.style.marginBottom = '10px';
        const plotBox = div(left, '');
        const p = new Plot(plotBox, { x: [-5, 5], y: [-2, 6], height: 300, aria: 'Graph der gewählten Funktion' });
        const tab = div(right, 'b-table-wrap');
        const all = div(right, 'b-ctrls', '<button type="button" class="b-btn">Alle aufdecken</button>');
        all.style.marginTop = '10px';
        function render() {
            const fx = F[cur];
            head.innerHTML = '$' + fx.tex + '$';
            p.opt.piX = !!fx.pi;
            p.view(fx.pi ? [-2 * Math.PI - 0.5, 2 * Math.PI + 0.5] : [-5, 5], fx.y);
            p.draw([{ fn: fx.f, color: 'lambda' }]);
            tab.innerHTML = '<table class="b-table"><tbody>' + NAMES.map((n, i) =>
                '<tr><th style="text-align:left">' + n + '</th><td style="text-align:left"><button type="button" class="b-btn" data-i="' + i + '">aufdecken</button>' +
                '<span data-v="' + i + '" style="display:none">' + fx.p[i] + '</span></td></tr>').join('') + '</tbody></table>';
            math(box);
        }
        box.addEventListener('click', e => {
            const b = e.target.closest('button[data-i]');
            if (b) { b.style.display = 'none'; tab.querySelector('[data-v="' + b.dataset.i + '"]').style.display = ''; return; }
            if (e.target.closest('.b-ctrls') === all) tab.querySelectorAll('button[data-i]').forEach(x => x.click());
        });
        render();
    });

    /* ---------- linear vs exponential growth ---------- */
    W('wachstum', function (box) {
        const PRE = {
            sparen: { a: 1000, m: 30, q: 1.03, T: 40, unit: '€', t: 'Jahre', lin: 'einfache Zinsen (30 € pro Jahr)', exp: 'Zinseszins (3 % pro Jahr)',
                      ra: [100, 5000, 50], rm: [-100, 200, 1], rq: [0.9, 1.15, 0.005] },
            zerfall: { a: 100, m: -6.25, q: 0.917, T: 40, unit: '%', t: 'Tage', lin: 'linear: jeden Tag 6,25 Prozentpunkte weniger', exp: 'Jod-131: Halbwertszeit 8 Tage',
                      ra: [10, 200, 5], rm: [-20, 5, 0.25], rq: [0.5, 1, 0.001] },
            eigen: { a: 10, m: 2, q: 1.2, T: 20, unit: '', t: 'Schritte', lin: 'linear', exp: 'exponentiell',
                      ra: [1, 100, 1], rm: [-10, 10, 0.5], rq: [0.3, 2, 0.01] }
        };
        let P = PRE.sparen, S = {};
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['sparen', 'Sparen'], ['zerfall', 'Kernzerfall'], ['eigen', 'Eigene Werte']], 'sparen', v => { P = PRE[v]; build(); }, 'Beispiel');
        const sl = div(box, '');
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [0, 40], y: [0, 4000], height: 300, xLabel: 't', yLabel: 'y', aria: 'Lineares und exponentielles Wachstum' });
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            S = { a: P.a, m: P.m, q: P.q, T: P.T };
            range(sl, { label: 'Startwert $a$', min: P.ra[0], max: P.ra[1], step: P.ra[2], value: P.a, fmt: v => fmt(v, 2), onInput: v => { S.a = v; render(); } });
            range(sl, { label: 'linear: Änderung $m$ pro Schritt', min: P.rm[0], max: P.rm[1], step: P.rm[2], value: P.m, fmt: v => fmt(v, 2), onInput: v => { S.m = v; render(); } });
            range(sl, { label: 'exponentiell: Faktor $q$', min: P.rq[0], max: P.rq[1], step: P.rq[2], value: P.q, fmt: v => fmt(v, 3), onInput: v => { S.q = v; render(); } });
            range(sl, { label: 'Zeitraum', min: 5, max: 80, step: 1, value: P.T, fmt: v => v + ' ' + P.t, onInput: v => { S.T = v; render(); } });
            math(sl); render();
        }
        function render() {
            const lin = t => S.a + S.m * t, ex = t => S.a * Math.pow(S.q, t);
            // a stock cannot become negative: the straight line ends where everything is used up
            const t0 = S.m < 0 ? -S.a / S.m : Infinity, tEnd = Math.min(S.T, t0);
            const ymax = Math.max(lin(0), lin(tEnd), ex(S.T), ex(0)) * 1.12;
            p.view([0, S.T], [0, ymax]);
            p.draw([{ fn: lin, color: 'cyan', label: 'linear', labelAt: tEnd * 0.6, domain: [0, tEnd] }, { fn: ex, color: 'lambda', label: 'exponentiell', labelAt: S.T * 0.82, domain: [0, S.T] }]);
            const pq = (S.q - 1) * 100;
            const hz = Math.abs(Math.log(2) / Math.log(S.q));
            const rows = [0, 1, 2, 5, 10, 20].filter(t => t <= S.T);
            out.innerHTML =
                '<p style="margin:0 0 6px"><span style="color:#7fd8ee">' + P.lin + ':</span> $f(t) = ' + texNum(S.a, 2) + sg(S.m, 2) + '\\cdot t$ — in jedem Schritt ' +
                    (S.m < 0 ? 'geht <b>gleich viel</b> weg' + (t0 <= S.T ? '. Nach $' + texNum(t0, 2) + '$ ' + P.t + ' wäre alles verbraucht.' : '.') : 'kommt <b>gleich viel</b> hinzu.') + '</p>' +
                '<p style="margin:0 0 8px"><span style="color:rgb(245,194,66)">' + P.exp + ':</span> $g(t) = ' + texNum(S.a, 2) + '\\cdot ' + texNum(S.q, 3) + '^{\\,t}$ — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert' +
                (Math.abs(S.q - 1) > 1e-9 ? ', das sind ' + (pq > 0 ? '+' : '−') + fmt(Math.abs(pq), 2) + ' % pro Schritt. ' +
                    (S.q > 1 ? 'Verdopplungszeit' : 'Halbwertszeit') + ': $' + texNum(hz, 2) + '$ ' + P.t + '.' : '.') + '</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0"><thead><tr><th>$t$</th>' + rows.map(t => '<th>' + t + '</th>').join('') + '</tr></thead><tbody>' +
                '<tr><th>$f(t)$</th>' + rows.map(t => '<td>' + fmt(Math.max(0, lin(t)), 2) + '</td>').join('') + '</tr>' +
                '<tr><th>$g(t)$</th>' + rows.map(t => '<td class="b-hot">' + fmt(ex(t), 2) + '</td>').join('') + '</tr></tbody></table></div>';
            math(out);
        }
        build();
    });

    /* ---------- line through two points ---------- */
    W('gerade', function (box) {
        const h = [{ x: 1, y: 3, color: 'lambda', snap: 0.5 }, { x: 4, y: 9, color: 'cyan', snap: 0.5 }];
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-6, 8], y: [-6, 12], height: 340, aria: 'Gerade durch zwei verschiebbare Punkte' });
        const out = div(box, 'b-out');
        p.handles(h, () => render());
        function render() {
            const [P, Q] = h, dx = Q.x - P.x, dy = Q.y - P.y;
            if (Math.abs(dx) < 1e-9) {
                p.draw([{ vline: P.x, color: 'red' }]);
                out.innerHTML = 'Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ' + texNum(P.x, 2) + '$ ist <b>kein</b> Funktionsgraph.';
                return math(out);
            }
            const m = dy / dx, n = P.y - m * P.x;
            p.draw([{ fn: x => m * x + n, color: 'lambda', label: 'f' },
                { seg: [[P.x, P.y], [Q.x, P.y]], color: 'phi', width: 2.4 }, { seg: [[Q.x, P.y], [Q.x, Q.y]], color: 'phi', width: 2.4 },
                { text: 'Δx = ' + fmt(dx, 2), at: [(P.x + Q.x) / 2, P.y], color: 'phi', align: 'center', dy: dy > 0 ? 20 : -8, italic: false },
                { text: 'Δy = ' + fmt(dy, 2), at: [Q.x, (P.y + Q.y) / 2], color: 'phi', italic: false },
                { pts: [[0, n]], color: 'white' }]);
            out.innerHTML = '<p style="margin:0 0 6px">Steigung $m = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{' + texNum(dy, 2) + '}{' + texNum(dx, 2) + '} = ' + texNum(m, 3) + '$ · ' +
                'Achsenabschnitt $n = ' + texNum(n, 3) + '$ (weißer Punkt)</p>' +
                '<p style="margin:0">$f(x) = ' + (Math.abs(m) < 1e-12 ? texNum(n, 3) : co(m, 3) + 'x' + sg(n, 3)) + '$' + (Math.abs(m) > 1e-9 ? ' · Nullstelle $x_0 = -\\tfrac{n}{m} = ' + texNum(-n / m, 3) + '$' : ' · waagerechte Gerade') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- parabola workshop ---------- */
    W('parabel', function (box) {
        const S = { a: 0.5, d: 1, e: -2 };
        const sl = div(box, '');
        const ra = range(sl, { label: 'Streckfaktor $a$', min: -3, max: 3, step: 0.1, value: S.a, onInput: v => { S.a = v; render(); } });
        const rd = range(sl, { label: 'Verschiebung nach rechts $d$', min: -5, max: 5, step: 0.5, value: S.d, onInput: v => { S.d = v; h[0].x = v; render(); } });
        const re = range(sl, { label: 'Verschiebung nach oben $e$', min: -5, max: 5, step: 0.5, value: S.e, onInput: v => { S.e = v; h[0].y = v; render(); } });
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-6, 6], y: [-6, 6], height: 340, aria: 'Parabel mit verschiebbarem Scheitelpunkt' });
        const out = div(box, 'b-out');
        const h = [{ x: S.d, y: S.e, color: 'lambda', snap: 0.5 }];
        p.handles(h, (i, x, y) => { S.d = x; S.e = y; rd.set(x); re.set(y); render(); });
        function render() {
            const { a, d, e } = S;
            const f = x => a * (x - d) * (x - d) + e;
            const layers = [{ fn: f, color: 'lambda', label: 'f' }, { fn: x => x * x, color: 'dim', dash: true, width: 1.4 }];
            let zeros = '';
            if (Math.abs(a) < 1e-9) zeros = 'Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.';
            else {
                const r = -e / a;
                if (r < -1e-12) zeros = 'keine Nullstellen: Der Scheitel liegt ' + (e > 0 ? 'über' : 'unter') + ' der $x$-Achse und die Parabel ist nach ' + (a > 0 ? 'oben' : 'unten') + ' geöffnet.';
                else if (r < 1e-12) { zeros = 'eine (doppelte) Nullstelle: $x = ' + texNum(d, 2) + '$'; layers.push({ pts: [[d, 0]], color: 'cyan' }); }
                else {
                    const w = Math.sqrt(r);
                    zeros = 'Nullstellen: $x_1 = ' + texNum(d - w, 3) + '$, $x_2 = ' + texNum(d + w, 3) + '$';
                    layers.push({ pts: [[d - w, 0], [d + w, 0]], color: 'cyan' });
                }
            }
            p.draw(layers);
            const b = -2 * a * d, c = a * d * d + e;
            out.innerHTML =
                '<p style="margin:0 0 6px">Scheitelpunktform: $f(x) = ' + (Math.abs(a - 1) < 1e-9 ? '' : texNum(a, 2)) + '(x' + sg(-d, 2) + ')^2' + sg(e, 2) + '$ · Scheitel $S(' + texNum(d, 2) + ' \\mid ' + texNum(e, 2) + ')$</p>' +
                '<p style="margin:0 0 6px">Normalform: $f(x) = ' + co(a) + 'x^2' + sgx(b, 'x') + sg(c, 3) + '$</p>' +
                '<p style="margin:0">' + zeros + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- vertical throw ---------- */
    W('wurf', function (box) {
        const g = 9.81, S = { h0: 1.5, v0: 12 };
        const sl = div(box, '');
        range(sl, { label: 'Abwurfhöhe $h_0$', min: 0, max: 30, step: 0.5, value: S.h0, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.h0 = v; render(); } });
        range(sl, { label: 'Abwurfgeschwindigkeit $v_0$', min: 0, max: 30, step: 0.5, value: S.v0, fmt: v => fmt(v, 1) + ' m/s', onInput: v => { S.v0 = v; render(); } });
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [0, 6], y: [0, 40], height: 300, xLabel: 't in s', yLabel: 'h in m', aria: 'Höhe beim senkrechten Wurf' });
        const out = div(box, 'b-out');
        function render() {
            const { h0, v0 } = S;
            const h = t => h0 + v0 * t - g / 2 * t * t;
            const ts = v0 / g, hmax = h0 + v0 * v0 / (2 * g), tl = (v0 + Math.sqrt(v0 * v0 + 2 * g * h0)) / g;
            p.view([0, Math.max(1, tl * 1.12)], [0, Math.max(2, hmax * 1.18)]);
            p.draw([{ fn: h, color: 'lambda', domain: [0, tl] }, { pts: [[ts, hmax], [tl, 0]], color: 'cyan' }, { vline: ts }]);
            out.innerHTML = '<p style="margin:0 0 6px">$h(t) = ' + texNum(h0, 2) + sg(v0, 2) + '\\,t - 4{,}905\\,t^2$</p>' +
                '<p style="margin:0">Höchster Punkt nach $t_S = \\tfrac{v_0}{g} \\approx ' + texNum(ts, 2) + '\\,\\text{s}$ in $' + texNum(hmax, 2) + '\\,\\text{m}$ Höhe. ' +
                'Aufprall nach $' + texNum(tl, 2) + '\\,\\text{s}$.</p>';
            math(out);
        }
        render();
    });

    /* ---------- unit circle → sine curve ---------- */
    W('einheitskreis', function (box) {
        let deg = 50, playing = false, raf = 0;
        const ctr = div(box, 'b-ctrls');
        const play = document.createElement('button'); play.type = 'button'; play.className = 'b-btn b-go'; play.textContent = 'Abspielen'; ctr.appendChild(play);
        const sl = div(box, '');
        const r = range(sl, { label: 'Winkel $\\alpha$', min: 0, max: 360, step: 1, value: deg, fmt: v => v + '°', onInput: v => { deg = v; draw(); } });
        const cb = div(box, 'b-canvasbox'); cb.style.height = '300px';
        const cv = document.createElement('canvas'); cv.setAttribute('aria-label', 'Einheitskreis und Sinuskurve'); cb.appendChild(cv);
        const out = div(box, 'b-out');
        const ctx = cv.getContext('2d');
        function draw() {
            const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
            cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
            const R = Math.min(h * 0.38, w * 0.16), cx = R + 24, cy = h / 2;
            const gx0 = cx + R + 40, gw = w - gx0 - 16, X = a => gx0 + a / (2 * Math.PI) * gw;
            const a = deg * Math.PI / 180, px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
            ctx.font = '13px "Lab Ziffern", Raleway, sans-serif';
            // axes
            ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(cx - R - 14, cy); ctx.lineTo(cx + R + 14, cy); ctx.moveTo(cx, cy - R - 14); ctx.lineTo(cx, cy + R + 14);
            ctx.moveTo(gx0, cy); ctx.lineTo(gx0 + gw, cy); ctx.moveTo(gx0, cy - R - 14); ctx.lineTo(gx0, cy + R + 14); ctx.stroke();
            ctx.fillStyle = '#8fa3bd'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ['π/2', 'π', '3π/2', '2π'].forEach((t, i) => { const x = X((i + 1) * Math.PI / 2); ctx.fillText(t, x, cy + 6); ctx.beginPath(); ctx.moveTo(x, cy - 4); ctx.lineTo(x, cy + 4); ctx.stroke(); });
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText('1', gx0 - 6, cy - R); ctx.fillText('−1', gx0 - 6, cy + R);
            // circle and angle
            ctx.strokeStyle = 'rgba(127,216,238,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = 'rgb(160,200,90)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.28, 0, -a, true); ctx.stroke();
            ctx.strokeStyle = '#e8edf5'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
            ctx.strokeStyle = 'rgb(245,194,66)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
            ctx.strokeStyle = '#7fd8ee'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
            // sine curve up to the angle, and the bridge
            ctx.strokeStyle = 'rgba(245,194,66,0.25)'; ctx.lineWidth = 2; ctx.beginPath();
            for (let i = 0; i <= 200; i++) { const t = i / 200 * 2 * Math.PI; i ? ctx.lineTo(X(t), cy - R * Math.sin(t)) : ctx.moveTo(X(t), cy - R * Math.sin(t)); } ctx.stroke();
            ctx.strokeStyle = 'rgb(245,194,66)'; ctx.lineWidth = 2.6; ctx.beginPath();
            for (let i = 0; i <= 200; i++) { const t = i / 200 * a; i ? ctx.lineTo(X(t), cy - R * Math.sin(t)) : ctx.moveTo(X(t), cy - R * Math.sin(t)); } ctx.stroke();
            ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(X(a), py); ctx.stroke(); ctx.setLineDash([]);
            [[px, py, '#e8edf5'], [X(a), py, 'rgb(245,194,66)']].forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); });
            out.innerHTML = '$\\alpha = ' + Math.round(deg) + '^\\circ = ' + texNum(a, 3) + '$ im Bogenmaß · ' +
                '<span style="color:rgb(245,194,66)">$\\sin \\alpha = ' + texNum(Math.sin(a), 3) + '$</span> · <span style="color:#7fd8ee">$\\cos \\alpha = ' + texNum(Math.cos(a), 3) + '$</span>';
            math(out);
        }
        function tick() { deg = (deg + 1) % 361; r.set(deg); draw(); if (playing) raf = requestAnimationFrame(tick); }
        play.addEventListener('click', () => { playing = !playing; play.textContent = playing ? 'Anhalten' : 'Abspielen'; if (playing) tick(); else cancelAnimationFrame(raf); });
        addEventListener('resize', draw); if (window.ResizeObserver) new ResizeObserver(draw).observe(cb);
        draw();
    });

    /* ---------- sine workshop ---------- */
    W('sinus', function (box) {
        const S = { a: 2, b: 1, c: 0, d: 0 };
        const sl = div(box, '');
        range(sl, { label: 'Amplitude $a$', min: -3, max: 3, step: 0.1, value: S.a, onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)', min: 0.25, max: 4, step: 0.25, value: S.b, onInput: v => { S.b = v; render(); } });
        range(sl, { label: 'Verschiebung $c$ nach rechts', min: -Math.PI, max: Math.PI, step: Math.PI / 12, value: S.c, fmt: v => fmt(v / Math.PI, 3) + 'π', onInput: v => { S.c = v; render(); } });
        range(sl, { label: 'Verschiebung $d$ nach oben', min: -3, max: 3, step: 0.5, value: S.d, onInput: v => { S.d = v; render(); } });
        math(sl);
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-0.5, 4 * Math.PI + 0.5], y: [-5, 5], height: 300, piX: true, aria: 'Sinusfunktion mit Parametern' });
        const out = div(box, 'b-out');
        function render() {
            const { a, b, c, d } = S, f = x => a * Math.sin(b * (x - c)) + d;
            p.draw([{ fn: Math.sin, color: 'dim', dash: true, width: 1.4 }, { fn: f, color: 'lambda', label: 'f' }, { hline: d }]);
            const xs = Math.abs(c) < 1e-9 ? 'x' : 'x' + (c > 0 ? ' - ' : ' + ') + texNum(Math.abs(c) / Math.PI, 3) + '\\pi';
            const inner = Math.abs(b - 1) < 1e-9 ? xs : texNum(b, 2) + (xs === 'x' ? 'x' : '\\,(' + xs + ')');
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + co(a) + '\\sin(' + inner + ')' + sg(d, 2) + '$</p>' +
                '<p style="margin:0">Amplitude $|a| = ' + texNum(Math.abs(a), 2) + '$ · Periode $p = \\tfrac{2\\pi}{' + texNum(b, 2) + '} \\approx ' + texNum(2 * Math.PI / b, 3) + '$ · Mittellinie $y = ' + texNum(d, 2) + '$ · Wertebereich $' + texNum(d - Math.abs(a), 2) + ' \\leq y \\leq ' + texNum(d + Math.abs(a), 2) + '$</p>';
            math(out);
        }
        render();
    });

    /* ---------- day length in Dresden ---------- */
    W('tageslaenge', function (box) {
        // model: mean 12.27 h, amplitude 4.28 h (Dresden, 51.05° N), zero crossing around 21 March (day 80)
        const f = t => 12.27 + 4.28 * Math.sin(2 * Math.PI / 365 * (t - 80));
        let day = 172;
        const sl = div(box, '');
        const MON = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const date = t => { let m = 0, d = Math.round(t); while (m < 11 && d > DAYS[m]) { d -= DAYS[m]; m++; } return d + '. ' + MON[m]; };
        range(sl, { label: 'Tag des Jahres', min: 1, max: 365, step: 1, value: day, fmt: v => date(v), onInput: v => { day = v; render(); } });
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [0, 365], y: [0, 18], height: 280, xLabel: 't in Tagen', yLabel: 'Stunden', xStep: 30, yStep: 2, aria: 'Tageslänge in Dresden' });
        const out = div(box, 'b-out');
        function render() {
            p.draw([{ fn: f, color: 'lambda' }, { hline: 12.27 }, { pts: [[day, f(day)]], color: 'cyan', r: 6 }]);
            const hh = Math.floor(f(day)), mm = Math.round((f(day) - hh) * 60);
            out.innerHTML = '$T(t) = 12{,}27 + 4{,}28 \\cdot \\sin\\!\\big(\\tfrac{2\\pi}{365}(t - 80)\\big)$ · am ' + date(day) + ': <b>' + hh + ' h ' + mm + ' min</b> Tageslicht';
            math(out);
        }
        render();
    });

    /* ---------- regression ---------- */
    function solve3(M, v) {   // Gauss with partial pivoting, 3×3
        const A = M.map((r, i) => r.concat([v[i]]));
        for (let c = 0; c < 3; c++) {
            let m = c; for (let r = c + 1; r < 3; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
            [A[c], A[m]] = [A[m], A[c]];
            for (let r = 0; r < 3; r++) if (r !== c) { const k = A[r][c] / A[c][c]; for (let j = c; j < 4; j++) A[r][j] -= k * A[c][j]; }
        }
        return [A[0][3] / A[0][0], A[1][3] / A[1][1], A[2][3] / A[2][2]];
    }
    function fit(model, P) {
        const n = P.length, sx = P.reduce((s, p) => s + p[0], 0);
        if (model === 'lin') {
            const sy = P.reduce((s, p) => s + p[1], 0), sxx = P.reduce((s, p) => s + p[0] * p[0], 0), sxy = P.reduce((s, p) => s + p[0] * p[1], 0);
            const m = (n * sxy - sx * sy) / (n * sxx - sx * sx), b = (sy - m * sx) / n;
            return { f: x => m * x + b, tex: 'f(x) = ' + texNum(m, 4) + 'x' + sg(b, 4) };
        }
        if (model === 'quad') {
            const S = k => P.reduce((s, p) => s + Math.pow(p[0], k), 0), T = k => P.reduce((s, p) => s + Math.pow(p[0], k) * p[1], 0);
            const [a, b, c] = solve3([[S(4), S(3), S(2)], [S(3), S(2), S(1)], [S(2), S(1), n]], [T(2), T(1), T(0)]);
            return { f: x => a * x * x + b * x + c, tex: 'f(x) = ' + texNum(a, 4) + 'x^2' + sg(b, 4) + 'x' + sg(c, 4) };
        }
        // exponential: straight line through (x, ln y)
        const Q = P.filter(p => p[1] > 0);
        if (Q.length < 2) return null;
        const l = Q.map(p => [p[0], Math.log(p[1])]);
        const k = l.length, lx = l.reduce((s, p) => s + p[0], 0), ly = l.reduce((s, p) => s + p[1], 0),
            lxx = l.reduce((s, p) => s + p[0] * p[0], 0), lxy = l.reduce((s, p) => s + p[0] * p[1], 0);
        const m = (k * lxy - lx * ly) / (k * lxx - lx * lx), b = (ly - m * lx) / k;
        const a = Math.exp(b), q = Math.exp(m);
        return { f: x => a * Math.pow(q, x), tex: 'f(x) = ' + texNum(a, 4) + '\\cdot ' + texNum(q, 4) + '^{\\,x}' };
    }
    function r2(P, f) {
        const my = P.reduce((s, p) => s + p[1], 0) / P.length;
        const ss = P.reduce((s, p) => s + (p[1] - my) ** 2, 0), sr = P.reduce((s, p) => s + (p[1] - f(p[0])) ** 2, 0);
        return 1 - sr / ss;
    }
    B.regression = { fit, r2 };
    W('regression', function (box) {
        const SETS = {
            kerze: { name: 'Kerze', x: 'Brenndauer in h', y: 'Länge in cm', model: 'lin', px: [0, 9], py: [0, 24], at: 8,
                     q: 'Wann ist die Kerze abgebrannt?', P: [[0, 20], [1, 18.4], [2, 16.9], [3, 15.2], [4, 13.8], [5, 12.1], [6, 10.6]] },
            brems: { name: 'Bremsweg', x: 'Tempo in km/h', y: 'Bremsweg in m', model: 'quad', px: [0, 160], py: [0, 260], at: 150,
                     q: 'Bremsweg bei 150 km/h?', P: [[30, 9.5], [50, 24], [70, 50], [90, 80], [110, 122], [130, 168]] },
            tee: { name: 'Abkühlen', x: 'Zeit in min', y: 'ΔT in °C', model: 'exp', px: [0, 60], py: [0, 80], at: 45,
                   q: 'Temperaturunterschied nach 45 min?', P: [[0, 70], [5, 55], [10, 42], [15, 33], [20, 25], [25, 19], [30, 15]] },
            welt: { name: 'Weltbevölkerung', x: 'Jahr', y: 'Mrd. Menschen', model: 'exp', px: [1940, 2060], py: [0, 14], at: 2050,
                    q: 'Prognose für 2050?', P: [[1950, 2.5], [1960, 3.02], [1970, 3.7], [1980, 4.44], [1990, 5.32], [2000, 6.15], [2010, 6.99], [2020, 7.84]] }
        };
        let set = SETS.kerze, model = 'lin', pts = [];
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(SETS).map(k => [k, SETS[k].name]), 'kerze', v => { set = SETS[v]; load(); }, 'Messreihe');
        const mseg = seg(ctr, [['lin', 'linear'], ['quad', 'quadratisch'], ['exp', 'exponentiell']], 'lin', v => { model = v; render(); }, 'Modell');
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [0, 10], y: [0, 10], height: 320, aria: 'Messpunkte und Regressionskurve' });
        const out = div(box, 'b-out');
        p.canvas.title = 'Messpunkte lassen sich verschieben';
        function load() {
            pts = set.P.map(q => ({ x: q[0], y: q[1], color: 'cyan' }));
            model = set.model; mseg.set(model);
            p.opt.xLabel = set.x; p.opt.yLabel = set.y; p.view(set.px, set.py);
            p.handles(pts, () => render());
            render();
        }
        function render() {
            const P = pts.map(h => [h.x, h.y]);
            // the world-population years are shifted to "years since 1950" for the fit, so the numbers stay readable
            const shift = set === SETS.welt ? 1950 : 0;
            const R = fit(model, P.map(q => [q[0] - shift, q[1]]));
            if (!R) { out.textContent = 'Für ein exponentielles Modell müssen die Werte positiv sein.'; p.draw([]); return; }
            const f = x => R.f(x - shift);
            p.draw([{ fn: f, color: 'lambda' }, { vline: set.at }]);
            const rr = r2(P, f);
            out.innerHTML = '<p style="margin:0 0 6px">Regressionsfunktion: $' + R.tex + '$' + (shift ? ' &nbsp;mit $x$ = Jahre seit 1950' : '') + '</p>' +
                '<p style="margin:0 0 6px">Bestimmtheitsmaß $R^2 = ' + texNum(rr, 4) + '$ ' + (rr > 0.99 ? '(passt sehr gut)' : rr > 0.95 ? '(passt gut)' : '(passt mäßig)') + '</p>' +
                '<p style="margin:0">' + set.q + ' Das Modell sagt: $f(' + set.at + ') \\approx ' + texNum(f(set.at), 2) + '$.</p>';
            math(out);
        }
        load();
    });

    W('anscombe', function (box) {
        // F. J. Anscombe, Graphs in Statistical Analysis, The American Statistician 27 (1973), 17–21
        const X = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
        const D = {
            I: X.map((x, i) => [x, [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68][i]]),
            II: X.map((x, i) => [x, [9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74][i]]),
            III: X.map((x, i) => [x, [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73][i]]),
            IV: [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8].map((x, i) => [x, [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89][i]])
        };
        let k = 'I';
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(D).map(x => [x, 'Datensatz ' + x]), 'I', v => { k = v; render(); }, 'Datensatz');
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [0, 20], y: [0, 14], height: 280, aria: 'Anscombe-Quartett' });
        const out = div(box, 'b-out');
        function render() {
            const R = fit('lin', D[k]);
            p.draw([{ fn: R.f, color: 'lambda' }, { pts: D[k], color: 'cyan' }]);
            out.innerHTML = 'Regressionsgerade: $' + R.tex + '$ · $R^2 = ' + texNum(r2(D[k], R.f), 3) + '$';
            math(out);
        }
        render();
    });

    /* ---------- function and inverse ---------- */
    W('umkehr', function (box) {
        const F = {
            lin: { k: '2x + 1', f: x => 2 * x + 1, g: x => (x - 1) / 2, ft: 'f(x) = 2x + 1', gt: 'f^{-1}(x) = \\tfrac{x - 1}{2}', d: [-4, 4] },
            sq: { k: 'x² (x ≥ 0)', f: x => x * x, g: Math.sqrt, ft: 'f(x) = x^2,\\; x \\geq 0', gt: 'f^{-1}(x) = \\sqrt{x}', d: [0, 4] },
            cube: { k: 'x³', f: x => x * x * x, g: Math.cbrt, ft: 'f(x) = x^3', gt: 'f^{-1}(x) = \\sqrt[3]{x}', d: [-4, 4] },
            exp: { k: '2ˣ', f: x => Math.pow(2, x), g: Math.log2, ft: 'f(x) = 2^x', gt: 'f^{-1}(x) = \\log_2 x', d: [-4, 4] },
            ten: { k: '10ˣ', f: x => Math.pow(10, x), g: Math.log10, ft: 'f(x) = 10^x', gt: 'f^{-1}(x) = \\lg x', d: [-4, 4] }
        };
        let cur = F.sq;
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(F).map(k => [k, F[k].k]), 'sq', v => { cur = F[v]; h[0].x = 1.5; render(); }, 'Funktion');
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-4, 5], y: [-3.5, 5], height: 360, equal: true, aria: 'Funktion und Umkehrfunktion, gespiegelt an y = x' });
        const out = div(box, 'b-out');
        const h = [{ x: 1.5, y: 2.25, color: 'lambda', fixY: true }];
        p.handles(h, () => render());
        function render() {
            const x = Math.min(Math.max(h[0].x, cur.d[0]), cur.d[1]); h[0].x = x;
            const y = cur.f(x); h[0].y = y;
            p.draw([{ fn: x => x, color: 'dim', dash: true, width: 1.2, label: 'y = x', labelAt: 3.6 },
                { fn: cur.f, color: 'lambda', domain: cur.d, label: 'f', labelAt: cur === F.ten ? 0.55 : 1.9 },
                { fn: cur.g, color: 'cyan', domain: cur === F.sq ? [0, 9] : [-50, 50], label: 'f⁻¹', labelAt: 3.9 },
                { seg: [[x, y], [y, x]], color: 'white', dash: true }, { pts: [[y, x]], color: 'cyan', r: 6 }]);
            out.innerHTML = '$' + cur.ft + '$ &nbsp;→&nbsp; $' + cur.gt + '$ · Der Punkt $P(' + texNum(x, 2) + ' \\mid ' + texNum(y, 2) + ')$ auf $f$ wird zum Punkt $P\'(' + texNum(y, 2) + ' \\mid ' + texNum(x, 2) + ')$ auf $f^{-1}$.';
            math(out);
        }
        render();
    });

    /* ---------- a^x = b ---------- */
    W('expgleichung', function (box) {
        box.innerHTML = '<div class="b-ctrls"><label class="b-ctrl" for="eg-a">Basis $a$</label><input class="b-in" id="eg-a" value="2" style="width:90px" inputmode="decimal">' +
            '<label class="b-ctrl" for="eg-b">rechte Seite $b$</label><input class="b-in" id="eg-b" value="40" style="width:110px" inputmode="decimal">' +
            '<button type="button" class="b-btn b-go">Lösen</button></div><div class="b-out"></div>';
        const out = box.querySelector('.b-out');
        function run() {
            const a = B.parseAnswer(box.querySelector('#eg-a').value), b = B.parseAnswer(box.querySelector('#eg-b').value);
            if (!(a > 0) || Math.abs(a - 1) < 1e-12) { out.innerHTML = 'Die Basis muss positiv und von 1 verschieden sein.'; return; }
            if (!(b > 0)) { out.innerHTML = 'Keine Lösung: $' + texNum(a, 4) + '^x$ ist immer positiv, kann also nie $' + texNum(b, 4) + '$ werden.'; math(out); return; }
            const x = Math.log(b) / Math.log(a);
            out.innerHTML = '<p style="margin:0 0 6px">$' + texNum(a, 4) + '^{\\,x} = ' + texNum(b, 4) + '$</p>' +
                '<p style="margin:0 0 6px">$x = \\log_{' + texNum(a, 4) + '} ' + texNum(b, 4) + ' = \\dfrac{\\lg ' + texNum(b, 4) + '}{\\lg ' + texNum(a, 4) + '} \\approx \\dfrac{' + texNum(Math.log10(b), 4) + '}{' + texNum(Math.log10(a), 4) + '} \\approx ' + texNum(x, 4) + '$</p>' +
                '<p style="margin:0">Probe: $' + texNum(a, 4) + '^{' + texNum(x, 4) + '} \\approx ' + texNum(Math.pow(a, x), 3) + '$</p>';
            math(out);
        }
        box.querySelector('button').addEventListener('click', run);
        box.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
        math(box); run();
    });

    /* ---------- parameters ---------- */
    const BASE = {
        x: { k: 'x', f: x => x, t: 'x' }, sq: { k: 'x²', f: x => x * x, t: '(\\ldots)^2' }, sqrt: { k: '√x', f: Math.sqrt, t: '\\sqrt{\\ldots}' },
        inv: { k: '1/x', f: x => 1 / x, t: '\\tfrac{1}{\\ldots}' }, exp: { k: '2ˣ', f: x => Math.pow(2, x), t: '2^{\\ldots}' }, sin: { k: 'sin x', f: Math.sin, t: '\\sin(\\ldots)' }
    };
    W('parameter', function (box) {
        const S = { base: 'sq', a: 1, b: 1, c: 0, d: 0 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(BASE).map(k => [k, BASE[k].k]), 'sq', v => { S.base = v; render(); }, 'Grundfunktion');
        const sl = div(box, '');
        range(sl, { label: '$c \\cdot f(x)$: strecken in $y$-Richtung', min: -3, max: 3, step: 0.25, value: 1, onInput: v => { S.a = v; render(); } });
        range(sl, { label: '$f(x) + c$: verschieben in $y$-Richtung', min: -4, max: 4, step: 0.5, value: 0, onInput: v => { S.d = v; render(); } });
        range(sl, { label: '$f(c \\cdot x)$: stauchen in $x$-Richtung', min: -3, max: 3, step: 0.25, value: 1, onInput: v => { S.b = v; render(); } });
        range(sl, { label: '$f(x + c)$: verschieben in $x$-Richtung', min: -4, max: 4, step: 0.5, value: 0, onInput: v => { S.c = v; render(); } });
        math(sl);
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-6, 6], y: [-5, 6], height: 340, aria: 'Grundfunktion und veränderte Funktion' });
        const out = div(box, 'b-out');
        function render() {
            const F = BASE[S.base], { a, b, c, d } = S;
            p.opt.piX = S.base === 'sin';
            p.view(S.base === 'sin' ? [-2 * Math.PI, 2 * Math.PI] : [-6, 6], [-5, 6]);
            const g = x => a * F.f(b * (x + c)) + d;
            p.draw([{ fn: F.f, color: 'dim', dash: true, width: 1.4 }, { fn: g, color: 'lambda', label: 'g' }]);
            const inner = (Math.abs(b - 1) < 1e-9 ? '' : texNum(b, 2) + '\\,') + (Math.abs(c) < 1e-9 ? 'x' : '(x' + sg(c, 2) + ')');
            const core = F.t.replace('\\ldots', inner);
            const text = [];
            if (Math.abs(a - 1) > 1e-9) text.push(a < 0 ? 'gespiegelt an der $x$-Achse' + (Math.abs(a) !== 1 ? ' und mit $' + texNum(Math.abs(a), 2) + '$ gestreckt' : '') : 'in $y$-Richtung mit Faktor $' + texNum(a, 2) + '$ ' + (a > 1 ? 'gestreckt' : 'gestaucht'));
            if (Math.abs(b - 1) > 1e-9) text.push(b < 0 ? 'gespiegelt an der $y$-Achse' + (Math.abs(b) !== 1 ? ', in $x$-Richtung mit Faktor $\\tfrac{1}{' + texNum(Math.abs(b), 2) + '}$' : '') : 'in $x$-Richtung mit Faktor $\\tfrac{1}{' + texNum(b, 2) + '}$ ' + (b > 1 ? 'gestaucht' : 'gestreckt'));
            if (Math.abs(c) > 1e-9) text.push('um $' + texNum(Math.abs(c), 2) + '$ nach ' + (c > 0 ? 'links' : 'rechts') + ' verschoben');
            if (Math.abs(d) > 1e-9) text.push('um $' + texNum(Math.abs(d), 2) + '$ nach ' + (d > 0 ? 'oben' : 'unten') + ' verschoben');
            out.innerHTML = '<p style="margin:0 0 6px">$g(x) = ' + (Math.abs(a - 1) < 1e-9 ? '' : texNum(a, 2) + '\\cdot ') + core + sg(d, 2) + '$</p>' +
                '<p style="margin:0">' + (text.length ? 'Der Graph ist ' + text.join(', ') + '.' : 'Das ist die Grundfunktion selbst.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- which term belongs to the graph? ---------- */
    W('graphquiz', function (box) {
        const POOL = [
            ['x^2 - 2', x => x * x - 2], ['(x - 2)^2', x => (x - 2) ** 2], ['-x^2 + 3', x => -x * x + 3], ['(x + 1)^2 - 1', x => (x + 1) ** 2 - 1],
            ['\\tfrac12 x^2', x => x * x / 2], ['2x - 1', x => 2 * x - 1], ['-\\tfrac12 x + 2', x => -x / 2 + 2], ['\\sqrt{x}', Math.sqrt],
            ['\\sqrt{x + 3}', x => Math.sqrt(x + 3)], ['-\\sqrt{x}', x => -Math.sqrt(x)], ['\\tfrac1x', x => 1 / x], ['\\tfrac1x + 2', x => 1 / x + 2],
            ['\\tfrac{1}{x - 2}', x => 1 / (x - 2)], ['2^x', x => 2 ** x], ['2^x - 3', x => 2 ** x - 3], ['\\left(\\tfrac12\\right)^x', x => 0.5 ** x],
            ['2^{x + 2}', x => 2 ** (x + 2)], ['\\sin x', Math.sin], ['2\\sin x', x => 2 * Math.sin(x)], ['\\sin x + 2', x => Math.sin(x) + 2], ['\\sin(2x)', x => Math.sin(2 * x)],
            ['x^3', x => x ** 3], ['|x| - 1', x => Math.abs(x) - 1]
        ];
        let target, opts, score = 0, done = false;
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-5, 5], y: [-4, 5], height: 300, aria: 'Graph, zu dem der Term gesucht ist' });
        const mc = div(box, 'b-mc'); mc.style.marginTop = '12px';
        const foot = div(box, 'b-ctrls', '<button type="button" class="b-btn b-go">Nächster Graph</button><span class="b-check-score" style="margin-left:auto"></span>');
        foot.style.marginTop = '12px';
        function next() {
            done = false;
            const idx = [...POOL.keys()].sort(() => Math.random() - 0.5).slice(0, 4);
            opts = idx.map(i => POOL[i]); target = opts[Math.floor(Math.random() * 4)];
            p.draw([{ fn: target[1], color: 'lambda' }]);
            mc.innerHTML = opts.map((o, i) => '<button type="button" data-o="' + i + '">$f(x) = ' + o[0] + '$</button>').join('');
            math(mc);
        }
        mc.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b || done) return;
            const o = opts[+b.dataset.o];
            if (o === target) { b.classList.add('ok'); done = true; score++; }
            else { b.classList.add('bad'); p.draw([{ fn: target[1], color: 'lambda' }, { fn: o[1], color: 'red', dash: true, width: 1.6 }]); }
            if (done) { foot.querySelector('.b-check-score').textContent = score + ' richtig'; }
        });
        foot.querySelector('button').addEventListener('click', next);
        next();
    });
    /* ---------- function or not: the vertical line test ---------- */
    const CURVES = {
        parabel: { k: 'Parabel', parts: [[x => 0.5 * x * x - 2, -6, 6]], fn: true, D: '\\mathbb{R}', W: '\\{\\, y \\in \\mathbb{R} \\mid y \\geq -2 \\,\\}', tex: 'y = \\tfrac12 x^2 - 2' },
        spitze: { k: 'Liegende Spitze', parts: [[x => x + 1, -1, 6], [x => -(x + 1), -1, 6]], fn: false, tex: 'x = |y| - 1',
                  why: 'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.' },
        liegend: { k: 'Liegende Parabel', parts: [[x => Math.sqrt(2 * x), 0, 6], [x => -Math.sqrt(2 * x), 0, 6]], fn: false, tex: 'x = \\tfrac12 y^2',
                   why: 'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.' },
        wurzel: { k: 'Wurzel', parts: [[x => Math.sqrt(x + 4), -4, 6]], fn: true, D: '\\{\\, x \\in \\mathbb{R} \\mid x \\geq -4 \\,\\}', W: '\\{\\, y \\in \\mathbb{R} \\mid y \\geq 0 \\,\\}', tex: 'y = \\sqrt{x + 4}' },
        hyperbel: { k: 'Hyperbel', parts: [[x => 2 / x, -6, -0.01], [x => 2 / x, 0.01, 6]], fn: true, D: '\\mathbb{R} \\setminus \\{0\\}', W: '\\mathbb{R} \\setminus \\{0\\}', tex: 'y = \\tfrac{2}{x}' },
        betrag: { k: 'Betrag', parts: [[x => Math.abs(x) - 1, -6, 6]], fn: true, D: '\\mathbb{R}', W: '\\{\\, y \\in \\mathbb{R} \\mid y \\geq -1 \\,\\}', tex: 'y = |x| - 1' }
    };
    W('funktion', function (box) {
        let C = CURVES.parabel, answered = false;
        const h = [{ x: 1, y: -4.6, color: 'cyan', fixY: true, snap: 0.25 }];
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(CURVES).map(k => [k, CURVES[k].k]), 'parabel', v => { C = CURVES[v]; answered = false; render(); }, 'Kurve');
        div(box, 'b-help', 'Zieh den türkisen Punkt unten: Die senkrechte Gerade wandert mit. Wie oft trifft sie die Kurve?');
        const p = new Plot(div(box, ''), { x: [-6, 6], y: [-5, 5], height: 330, aria: 'Kurve mit verschiebbarer senkrechter Gerade' });
        const ask = div(box, 'b-ctrls');
        ask.innerHTML = '<span class="b-ctrl">Ist die Kurve der Graph einer Funktion?</span><button type="button" class="b-btn" data-a="1">Funktion</button><button type="button" class="b-btn" data-a="0">keine Funktion</button>';
        const out = div(box, 'b-out');
        p.handles(h, () => render());
        ask.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; answered = (b.dataset.a === '1') === C.fn ? 'ok' : 'no'; render(); });
        function render() {
            const c = h[0].x, hits = [];
            const L = C.parts.map(([f, a, b]) => ({ fn: f, color: 'lambda', domain: [a, b] }));
            C.parts.forEach(([f, a, b]) => { if (c >= a - 1e-9 && c <= b + 1e-9) { const y = f(c); if (isFinite(y)) hits.push(y); } });
            const ys = hits.filter((y, i) => hits.findIndex(z => Math.abs(z - y) < 1e-6) === i);
            L.push({ vline: c, color: ys.length > 1 ? 'red' : 'cyan' }, { pts: ys.map(y => [c, y]), color: ys.length > 1 ? 'red' : 'white', r: 6 });
            p.draw(L);
            let t = '<p style="margin:0 0 6px">$' + C.tex + '$ · Bei $x = ' + texNum(c, 2) + '$ trifft die Senkrechte die Kurve <b>' + (ys.length === 0 ? 'gar nicht' : ys.length === 1 ? 'genau einmal' : ys.length + '-mal') + '</b>' +
                (ys.length ? ': $y = ' + ys.map(y => texNum(y, 2)).join('$ und $y = ') + '$' : '') + '.</p>';
            if (answered) {
                t += '<p style="margin:0">' + (answered === 'ok' ? '<b class="ug-yes">Richtig.</b> ' : '<b class="ug-no">Nicht ganz.</b> ') +
                    (C.fn ? 'Jede senkrechte Gerade trifft die Kurve höchstens einmal: eine Funktion. <span class="b-res">$D = ' + C.D + '$, $W = ' + C.W + '$</span>' : C.why) + '</p>';
            } else t += '<p style="margin:0" class="b-help">Entscheide mit den Knöpfen. Danach siehst du Definitions- und Wertebereich.</p>';
            out.innerHTML = t;
            math(out);
        }
        render();
    });

    /* ---------- two lines: position relative to each other ---------- */
    const lineTex = (m, n) => 'y = ' + (Math.abs(m) < 1e-9 ? texNum(n, 2) : co(m, 2) + 'x' + sg(n, 2));
    W('lage', function (box) {
        const S = { m1: 0.5, n1: 1, m2: -2, n2: 4 };
        const PRE = { schneidend: [0.5, 1, -1, 4], orthogonal: [0.5, 1, -2, 4], parallel: [0.5, 1, 0.5, -2], identisch: [0.5, 1, 0.5, 1] };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(PRE).map(k => [k, k]), 'orthogonal', v => { [S.m1, S.n1, S.m2, S.n2] = PRE[v]; R.forEach((r, i) => r.set(PRE[v][i])); render(); }, 'Beispiel');
        const sl = div(box, '');
        const R = [
            range(sl, { label: '$g$: Anstieg $m_1$', min: -4, max: 4, step: 0.25, value: S.m1, fmt: v => fmt(v, 2), onInput: v => { S.m1 = v; render(); } }),
            range(sl, { label: '$g$: Achsenabschnitt $n_1$', min: -5, max: 5, step: 0.5, value: S.n1, onInput: v => { S.n1 = v; render(); } }),
            range(sl, { label: '$h$: Anstieg $m_2$', min: -4, max: 4, step: 0.25, value: S.m2, fmt: v => fmt(v, 2), onInput: v => { S.m2 = v; render(); } }),
            range(sl, { label: '$h$: Achsenabschnitt $n_2$', min: -5, max: 5, step: 0.5, value: S.n2, onInput: v => { S.n2 = v; render(); } })
        ];
        math(sl);
        const p = new Plot(div(box, ''), { x: [-6, 6], y: [-5, 7], height: 330, equal: true, aria: 'Zwei Geraden und ihre Lage zueinander' });
        const out = div(box, 'b-out');
        const slopeDeg = m => { const t = Math.atan(m) * 180 / Math.PI; return t < 0 ? 180 + t : t; };
        function render() {
            const { m1, n1, m2, n2 } = S;
            const L = [{ fn: x => m1 * x + n1, color: 'lambda', label: 'g', labelAt: 4.2 }, { fn: x => m2 * x + n2, color: 'cyan', label: 'h', labelAt: -5.4 }];
            let rel, res;
            if (Math.abs(m1 - m2) < 1e-9) {
                rel = Math.abs(n1 - n2) < 1e-9 ? 'identisch' : 'parallel';
                res = rel === 'identisch' ? 'Gleicher Anstieg und gleicher Achsenabschnitt: <b>identisch</b>. Jeder Punkt ist gemeinsam.'
                    : 'Gleicher Anstieg $m_1 = m_2$, verschiedene Achsenabschnitte: <b>parallel</b>. Es gibt keinen Schnittpunkt.';
            } else {
                const xs = (n2 - n1) / (m1 - m2), ys = m1 * xs + n1;
                let d = Math.abs(slopeDeg(m1) - slopeDeg(m2)); if (d > 90) d = 180 - d;
                rel = Math.abs(m1 * m2 + 1) < 1e-9 ? 'orthogonal' : 'schneidend';
                L.push({ pts: [[xs, ys]], color: 'white', r: 6 }, { text: 'S', at: [xs, ys], color: 'white' });
                res = (rel === 'orthogonal' ? '$m_1 \\cdot m_2 = ' + texNum(m1 * m2, 2) + '$: Die Geraden sind <b>orthogonal</b> (senkrecht zueinander).' : 'Verschiedene Anstiege: Die Geraden <b>schneiden</b> sich.') +
                    '<br>Gleichsetzen: $' + co(m1, 2) + 'x' + sg(n1, 2) + ' = ' + co(m2, 2) + 'x' + sg(n2, 2) + '$ ergibt $x = \\dfrac{n_2 - n_1}{m_1 - m_2} = ' + texNum(xs, 3) + '$, also <span class="b-res">$S(' + texNum(xs, 3) + ' \\mid ' + texNum(ys, 3) + ')$</span> · Schnittwinkel $' + texNum(d, 1) + '^\\circ$';
            }
            p.draw(L);
            const ang = m => Math.abs(m) < 1e-9 ? 'parallel zur $x$-Achse' : '$\\tan \\alpha = ' + texNum(m, 2) + '$, $\\alpha \\approx ' + texNum(slopeDeg(m), 1) + '^\\circ$';
            out.innerHTML = '<p style="margin:0 0 6px"><span class="b-res">$g$</span>: $' + lineTex(m1, n1) + '$ · ' + ang(m1) + ' &nbsp; <span style="color:#7fd8ee">$h$</span>: $' + lineTex(m2, n2) + '$ · ' + ang(m2) + '</p>' +
                '<p style="margin:0">' + res + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- families of parabolas: case distinction on the parameter ---------- */
    const SCHAREN = {
        q: { k: 'fₐ(x) = x² − 2x + a', tex: a => 'x^2 - 2x' + sg(a, 2), f: (a, x) => x * x - 2 * x + a, a: 0,
             zeros: a => a < 1 - 1e-9 ? [1 - Math.sqrt(1 - a), 1 + Math.sqrt(1 - a)] : Math.abs(a - 1) < 1e-9 ? [1] : [],
             vertex: a => [1, a - 1], locus: null, locusTex: 'x = 1',
             cases: [['a < 1', 'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$', a => a < 1 - 1e-9], ['a = 1', 'eine (doppelte) Nullstelle $x = 1$', a => Math.abs(a - 1) < 1e-9], ['a > 1', 'keine Nullstelle', a => a > 1 + 1e-9]],
             why: 'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.' },
        p: { k: 'fₐ(x) = x² + a·x', tex: a => 'x^2' + sgx(a, 'x', 2), f: (a, x) => x * x + a * x, a: 2,
             zeros: a => Math.abs(a) < 1e-9 ? [0] : [Math.min(0, -a), Math.max(0, -a)],
             vertex: a => [-a / 2, -a * a / 4], locus: x => -x * x, locusTex: 'y = -x^2',
             cases: [['a \\neq 0', 'zwei Nullstellen $x = 0$ und $x = -a$', a => Math.abs(a) > 1e-9], ['a = 0', 'eine doppelte Nullstelle $x = 0$', a => Math.abs(a) < 1e-9]],
             why: 'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).' },
        k: { k: 'fₖ(x) = k·x² − 4', tex: a => (Math.abs(a) < 1e-9 ? '-4' : co(a, 2) + 'x^2 - 4'), f: (a, x) => a * x * x - 4, a: 1,
             zeros: a => a > 1e-9 ? [-2 / Math.sqrt(a), 2 / Math.sqrt(a)] : [],
             vertex: a => (Math.abs(a) < 1e-9 ? null : [0, -4]), locus: null, locusTex: '',
             cases: [['k > 0', 'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$', a => a > 1e-9], ['k = 0', 'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle', a => Math.abs(a) < 1e-9],
                     ['k < 0', 'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle', a => a < -1e-9]],
             why: '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.' }
    };
    W('parabelschar', function (box) {
        let G = SCHAREN[box.dataset.schar] || SCHAREN.q, a = G.a;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(SCHAREN).map(k => [k, SCHAREN[k].k]), box.dataset.schar || 'q', v => { G = SCHAREN[v]; a = G.a; r.set(a); render(); }, 'Funktionenschar');
        const sl = div(box, '');
        const r = range(sl, { label: 'Parameter', min: -3, max: 3, step: 0.25, value: a, fmt: v => fmt(v, 2), onInput: v => { a = v; render(); } });
        const p = new Plot(div(box, ''), { x: [-5, 5], y: [-6, 6], height: 330, aria: 'Schar von Parabeln mit einem hervorgehobenen Mitglied' });
        const out = div(box, 'b-out');
        function render() {
            const L = [];
            for (let b = -3; b <= 3; b += 1) if (Math.abs(b - a) > 1e-9) L.push({ fn: x => G.f(b, x), color: 'dim', width: 1 });
            if (G.locus) L.push({ fn: G.locus, color: 'violet', dash: true, width: 1.8 });
            if (G === SCHAREN.q) L.push({ vline: 1, color: 'violet' });
            L.push({ fn: x => G.f(a, x), color: 'lambda', label: G === SCHAREN.k ? 'fₖ' : 'fₐ', labelAt: 2.6 });
            const Z = G.zeros(a), V = G.vertex(a);
            if (V) L.push({ pts: [V], color: 'violet', r: 5 });
            L.push({ pts: Z.map(z => [z, 0]), color: 'white', r: 6 });
            p.draw(L);
            const par = G === SCHAREN.k ? 'k' : 'a';
            out.innerHTML = '<p style="margin:0 0 6px">$' + (par === 'k' ? 'f_k' : 'f_a') + '(x) = ' + G.tex(a) + '$ für $' + par + ' = ' + texNum(a, 2) + '$ · ' +
                (Z.length ? 'Nullstellen: $' + Z.map(z => 'x = ' + texNum(z, 3)).join('$, $') + '$' : 'keine Nullstelle') + (V ? ' · Scheitel $(' + texNum(V[0], 3) + ' \\mid ' + texNum(V[1], 3) + ')$' : '') + '</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0">' + G.cases.map(([c, t, test]) => '<tr' + (test(a) ? ' class="sc-row-on"' : '') + '><th>$' + c + '$</th><td style="text-align:left">' + t + '</td></tr>').join('') + '</table></div>' +
                '<p style="margin:8px 0 0" class="b-help">' + G.why + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- polynomial functions from their zeros ---------- */
    const ZCOL = ['lambda', 'cyan', 'phi'];
    const factorTex = (z, k) => {
        const base = Math.abs(z) < 1e-9 ? 'x' : '(x ' + (z > 0 ? '- ' : '+ ') + texNum(Math.abs(z), 1) + ')';
        return k > 1 ? base + '^{' + k + '}' : base;
    };
    W('ganzrational', function (box) {
        const Z = [{ x: -2, y: 0, k: 1 }, { x: 1, y: 0, k: 2 }, { x: 3, y: 0, k: 1 }].map((z, i) => Object.assign(z, { color: ZCOL[i], fixY: true, snap: 0.5 }));
        let a = 0.5;
        const ctl = div(box, 'b-ctrls');
        ctl.innerHTML = Z.map((z, i) => '<div class="b-ctrl"><span class="gr-dot gr-' + ZCOL[i] + '"></span>Vielfachheit <span class="b-stepper"><button type="button" data-i="' + i + '" data-d="-1" aria-label="Vielfachheit kleiner">−</button>' +
            '<output data-o="' + i + '"></output><button type="button" data-i="' + i + '" data-d="1" aria-label="Vielfachheit größer">+</button></span></div>').join('');
        const sl = div(box, '');
        range(sl, { label: 'Faktor $a$', min: -2, max: 2, step: 0.1, value: a, fmt: v => fmt(v, 1), onInput: v => { a = Math.abs(v) < 0.05 ? 0.1 : v; render(); } });
        math(sl);
        div(box, 'b-help', 'Zieh die Nullstellen auf der $x$-Achse. Vielfachheit 0 nimmt den Linearfaktor heraus.');
        const p = new Plot(div(box, ''), { x: [-5, 5], y: [-8, 8], height: 340, aria: 'Ganzrationale Funktion mit verschiebbaren Nullstellen' });
        const out = div(box, 'b-out');
        p.handles(Z, () => render());
        ctl.addEventListener('click', e => {
            const b = e.target.closest('[data-d]'); if (!b) return;
            const i = +b.dataset.i, k = Z[i].k + +b.dataset.d;
            if (k < 0 || k > 3 || Z.reduce((s, z, j) => s + (j === i ? k : z.k), 0) < 1) return;
            Z[i].k = k; render();
        });
        const KIND = ['', 'einfach', 'doppelt', 'dreifach', 'vierfach', 'fünffach', 'sechsfach', 'siebenfach', 'achtfach', 'neunfach'];
        function render() {
            const m = new Map();                                   // zeros at the same place add up
            Z.forEach(z => { if (z.k) m.set(z.x, (m.get(z.x) || 0) + z.k); });
            const zs = [...m.entries()].sort((u, v) => u[0] - v[0]);
            const n = zs.reduce((s, [, k]) => s + k, 0);
            const f = x => a * zs.reduce((s, [z, k]) => s * (x - z) ** k, 1);
            Z.forEach((z, i) => { ctl.querySelector('[data-o="' + i + '"]').textContent = z.k; z.color = z.k ? ZCOL[i] : 'dim'; });
            p.draw([{ fn: f, color: 'violet', label: 'f', labelAt: 3.9 }]);
            const sgn = v => v > 0 ? '+\\infty' : '-\\infty';
            const list = zs.map(([z, k]) => '<li>$x = ' + texNum(z, 1) + '$: ' + KIND[k] + ' → ' +
                (k % 2 ? (k === 1 ? 'Vorzeichenwechsel, der Graph <b>schneidet</b> die $x$-Achse' : 'Vorzeichenwechsel, der Graph schneidet die $x$-Achse <b>flach</b> (Sattelpunkt)')
                    : 'kein Vorzeichenwechsel, der Graph <b>berührt</b> die $x$-Achse') + '</li>').join('');
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + co(a, 1) + zs.map(([z, k]) => factorTex(z, k)).join('') + '$ · Grad $' + n + '$ · $f(0) = ' + texNum(f(0), 2) + '$</p>' +
                '<ul class="gr-list">' + list + '</ul>' +
                '<p style="margin:6px 0 0">Für $x \\to +\\infty$ geht $f(x) \\to ' + sgn(a) + '$, für $x \\to -\\infty$ geht $f(x) \\to ' + sgn(n % 2 ? -a : a) + '$. ' +
                'Es entscheidet nur der Summand mit der höchsten Potenz: $' + co(a, 1) + 'x' + (n > 1 ? '^{' + n + '}' : '') + '$.</p>';
            math(out);
        }
        render();
    });
})();
