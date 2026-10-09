/* buch-analysis.js — widgets for the chapters on differential calculus (Lernbereich 2, Klasse 12) of the textbook
 * (js/buch.js, js/buch-plot.js).
 *   titelbild12   the cover of book 12: a curve with its tangent at the point of inflection and its derivative,
 *                 binomial bars, a vector in space
 *   grenzwert     approach a point or infinity step by step: table of values, graph, asymptotes, a hole
 *   sekante       secant through P and Q, Q slides towards P: difference quotient → derivative
 *   ableitungsgraph  drag P along f, its slope draws the graph of f' point by point
 *   kurve         f(x) = ax³ + bx² + cx + d: monotony, extrema and inflection point with f' and f''
 *   tangente      tangent and normal at a draggable point, both equations
 *   ableiten      derivative trainer: random terms, type f'(x), checked numerically
 *   steckbrief    a function from conditions: draggable points, the system of equations and its solution (data-modes="p3 ext wp")
 *   optimieren    box from a sheet, tin can, fence at a wall: target function, slider, maximum by f' = 0
 *   schar         a family f_a with its members, the extreme points and their locus (Klasse 13, Lernbereich 6)
 *   gewinn        costs, revenue and profit: break-even points and maximum profit for a chosen price
 *   titelbildfos12  the cover of the FOS 12 book: e-curve with tangent and rectangles, hyperbola, parallelogram with its cross product
 *   bruchfunktion   rational functions from linear factors: zeros, poles with or without sign change, holes, asymptotes (book FOS 12)
 *   efunktion       the number e: the base with slope 1 at 0, f(x) = a·e^(bx) + c, continuous compounding (book FOS 12)
 * Looks: js/buch.css (section "Widgets of the calculus chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, div, Plot, sg, co, sgx } = B;
    const W = B.widget;
    const rnd = n => Math.floor(Math.random() * n);
    const pick = a => a[rnd(a.length)];

    // ---------- polynomials as coefficient lists [a0, a1, a2, …] ----------
    const pval = (c, x) => c.reduceRight((s, a) => s * x + a, 0);
    const pder = c => c.slice(1).map((a, i) => a * (i + 1));
    function ptex(c, d = 2) {                                 // highest power first: "0{,}25x^3 - x + 1"
        let s = '';
        for (let k = c.length - 1; k >= 0; k--) {
            const a = c[k]; if (Math.abs(a) < 1e-12) continue;
            const v = k === 0 ? '' : k === 1 ? 'x' : 'x^{' + k + '}';
            if (!s) s = k === 0 ? texNum(a, d) : co(a, d) + v;
            else s += k === 0 ? sg(a, d) : sgx(a, v, d);
        }
        return s || '0';
    }
    // zeros of fn in [a, b]: sign changes on a fine grid, refined by bisection; touching zeros by small |fn| at a local min of |fn|
    function zeros(fn, a, b, n = 900) {
        const out = [];
        let x0 = a, y0 = fn(a);
        for (let i = 1; i <= n; i++) {
            const x1 = a + (b - a) * i / n, y1 = fn(x1);
            if (isFinite(y0) && isFinite(y1)) {
                if (y0 === 0) out.push(x0);
                else if (y0 * y1 < 0) {
                    let lo = x0, hi = x1, flo = y0;
                    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2, fm = fn(m); if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
                    out.push((lo + hi) / 2);
                }
            }
            x0 = x1; y0 = y1;
        }
        return out.filter((x, i) => i === 0 || Math.abs(x - out[i - 1]) > 1e-6);
    }
    const num = (x, d = 2) => texNum(Math.abs(x) < 5e-13 ? 0 : x, d);
    const pt = (x, y, d = 2) => '(' + num(x, d) + ' \\mid ' + num(y, d) + ')';
    // solve A·x = b (Gauss with pivoting); null if singular
    function solve(A, b) {
        const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
        for (let c = 0; c < n; c++) {
            let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
            if (Math.abs(M[p][c]) < 1e-10) return null;
            [M[c], M[p]] = [M[p], M[c]];
            for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
        }
        return M.map((r, i) => r[n] / r[i]);
    }
    function segBox(box, items, value, onPick, aria) { return B.seg(box, items, value, onPick, aria); }

    /* ---------- the cover of book 12 ---------- */
    // Reworked 09.10.2026 (Doc: "der Vektor sieht da noch nicht so toll aus … die Kurven finde ich auch noch nicht so
    // berauschend"): a calm cubic, symmetric about its point of inflection, with the tangent there; its derivative
    // crosses a faint x-axis exactly under the high and the low point. The vector stands in space now - the diagonal of
    // a box on three axes, the picture of Lernbereich 5 - in the free corner beside the title. The glow is a soft blur
    // instead of a wide band; the binomial bars stay as they were.
    W('titelbild12', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const n1 = v => v.toFixed(1);
        const path = (g, a, b, n = 160) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + n1(X(x)) + ' ' + n1(Y(g(x))); }
            return d;
        };
        // f(x) = a(x - xw)³ - b(x - xw) + yw: high point H at xw - dd, low point T at xw + dd, both ends inside the cover.
        // T lies well below the x-axis, so the zero of f' above it stands apart (at 0.2 below, the two dots touched)
        const xw = 1.5, dd = 2.3, yH = 4.0, yT = -0.7;
        const a = (yH - yT) / (4 * dd ** 3), b = 3 * a * dd * dd, yw = (yH + yT) / 2;
        const f = x => a * (x - xw) ** 3 - b * (x - xw) + yw;
        const fd = x => 3 * a * (x - xw) ** 2 - b;
        const S = 0.33;                                         // the derivative at a third of its size: the same zeros, clear of the bars
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        // binomial bars B(10; 0,45) along the bottom
        let bars = '';
        const nB = 10, pB = 0.45;
        let c = 1;
        for (let k = 0; k <= nB; k++) {
            if (k) c = c * (nB - k + 1) / k;
            const P = c * pB ** k * (1 - pB) ** (nB - k), x = -2.6 + k * 0.78, h = P * 9.5;
            bars += '<rect x="' + X(x - 0.3).toFixed(1) + '" y="' + Y(-3 + h).toFixed(1) + '" width="' + (X(0.6) - X(0)).toFixed(1) + '" height="' + (Y(-3) - Y(-3 + h)).toFixed(1) + '" rx="3"/>';
        }
        // an arrowhead with a notch, its tip at q; the shaft ends in the notch so no line cap pokes through
        function pfeil(p, q, s, col, w, extra) {
            const ang = Math.atan2(q[1] - p[1], q[0] - p[0]), cs = Math.cos(ang), sn = Math.sin(ang);
            const at = (back, side) => n1(q[0] - back * cs - side * sn) + ',' + n1(q[1] - back * sn + side * cs);
            return '<line x1="' + n1(p[0]) + '" y1="' + n1(p[1]) + '" x2="' + n1(q[0] - 0.62 * s * cs) + '" y2="' + n1(q[1] - 0.62 * s * sn) +
                '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || '') + '/>' +
                '<polygon points="' + at(0, 0) + ' ' + at(s, 0.42 * s) + ' ' + at(0.68 * s, 0) + ' ' + at(s, -0.42 * s) + '" fill="' + col + '"' + (extra || '') + '/>';
        }
        let art = '';
        // the x-axis, faint, and the dotted way from the extrema down to the zeros of f'
        art += '<line x1="0" y1="' + n1(Y(0)) + '" x2="' + Wd + '" y2="' + n1(Y(0)) + '" stroke="#cfe4f5" stroke-opacity="0.2" stroke-width="1.2"/>';
        [xw - dd, xw + dd].forEach(x => {
            art += '<line x1="' + n1(X(x)) + '" y1="' + n1(Y(f(x))) + '" x2="' + n1(X(x)) + '" y2="' + n1(Y(0)) + '" stroke="#cfe4f5" stroke-opacity="0.4" stroke-width="1.4" stroke-dasharray="1.5 5" stroke-linecap="round"/>';
        });
        art += '<path d="' + path(x => S * fd(x), -3, 6) + '" stroke="#B8A4F2" stroke-opacity="0.9" stroke-width="2.2" stroke-dasharray="7 8" fill="none" stroke-linecap="round"/>';
        [xw - dd, xw + dd].forEach(x => { art += '<circle cx="' + n1(X(x)) + '" cy="' + n1(Y(0)) + '" r="4.5" fill="#B8A4F2"/>'; });
        art += '<path d="' + path(f, -3, 6) + '" stroke="#F5C242" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#tb12-glow)"/>';
        // the tangent at the point of inflection, long enough to be seen crossing the curve there, fading out at both ends
        const t1 = [X(xw - 1.7), Y(yw - b * -1.7)], t2 = [X(xw + 1.7), Y(yw - b * 1.7)];
        art += '<line x1="' + n1(t1[0]) + '" y1="' + n1(t1[1]) + '" x2="' + n1(t2[0]) + '" y2="' + n1(t2[1]) + '" stroke="url(#tb12-tan)" stroke-width="2.6" stroke-linecap="round" filter="url(#tb12-glow)"/>';
        // high and low point white, the point of inflection a cyan ring
        [xw - dd, xw + dd].forEach(x => {
            art += '<circle cx="' + n1(X(x)) + '" cy="' + n1(Y(f(x))) + '" r="13" fill="#fff" fill-opacity="0.12"/><circle cx="' + n1(X(x)) + '" cy="' + n1(Y(f(x))) + '" r="6" fill="#fff"/>';
        });
        art += '<circle cx="' + n1(X(xw)) + '" cy="' + n1(Y(yw)) + '" r="13" fill="#7fd8ee" fill-opacity="0.12"/>' +
            '<circle cx="' + n1(X(xw)) + '" cy="' + n1(Y(yw)) + '" r="6" fill="#0b1830" stroke="#7fd8ee" stroke-width="2.6"/>';
        // the vector in space: three axes, a box drawn faintly, its diagonal as the vector, the shadow on the floor dashed
        const O = [412, 407], ex = [-36, 26], ey = [100, 0], ez = [0, -92];
        const pt = (i, j, k) => [O[0] + i * ex[0] + j * ey[0] + k * ez[0], O[1] + i * ex[1] + j * ey[1] + k * ez[1]];
        const strich = (p, q, attr) => '<line x1="' + n1(p[0]) + '" y1="' + n1(p[1]) + '" x2="' + n1(q[0]) + '" y2="' + n1(q[1]) + '" ' + attr + '/>';
        let raum = '';
        // the box's edges away from the origin - the three at the origin lie on the axes
        [[[1, 0, 0], [1, 1, 0]], [[0, 1, 0], [1, 1, 0]], [[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [0, 1, 1]], [[1, 1, 0], [1, 1, 1]],
         [[0, 0, 1], [1, 0, 1]], [[0, 0, 1], [0, 1, 1]], [[1, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 1]]].forEach(([p, q]) => {
            raum += strich(pt(...p), pt(...q), 'stroke="#cfe4f5" stroke-opacity="0.3" stroke-width="1.2"');
        });
        [[1.9, 0, 0], [0, 1.5, 0], [0, 0, 1.45]].forEach(e => { raum += pfeil(O, pt(...e), 10, '#cfe4f5', 1.6, ' opacity="0.6"'); });
        raum += strich(O, pt(1, 1, 0), 'stroke="#e682be" stroke-opacity="0.6" stroke-width="1.6" stroke-dasharray="5 6" stroke-linecap="round"');
        raum += '<g filter="url(#tb12-glow)">' + pfeil(O, pt(1, 1, 1), 19, '#e682be', 3.4) + '</g>';
        raum += '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="3.5" fill="#cfe4f5" fill-opacity="0.8"/>';
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum">' +
            '<defs><linearGradient id="tb12-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.97" stop-color="#fff" stop-opacity="0.2"/></linearGradient>' +
            '<mask id="tb12-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tb12-fade)"/></mask>' +
            '<linearGradient id="tb12-tan" gradientUnits="userSpaceOnUse" x1="' + n1(t1[0]) + '" y1="' + n1(t1[1]) + '" x2="' + n1(t2[0]) + '" y2="' + n1(t2[1]) + '">' +
            '<stop offset="0" stop-color="#7fd8ee" stop-opacity="0"/><stop offset="0.25" stop-color="#7fd8ee"/><stop offset="0.75" stop-color="#7fd8ee"/><stop offset="1" stop-color="#7fd8ee" stop-opacity="0"/></linearGradient>' +
            '<filter id="tb12-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Wd + '" height="' + Ht + '"><feGaussianBlur stdDeviation="5" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g mask="url(#tb12-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' +
            '<g fill="#A0C85A" fill-opacity="0.32" stroke="#A0C85A" stroke-opacity="0.55" stroke-width="1.2">' + bars + '</g>' + art + '</g>' + raum + '</svg>';
    });

    /* ---------- limits: step by step towards a point or infinity ---------- */
    W('grenzwert', function (box) {
        const F = [
            { k: '(2x+1)/(x−1)', tex: 'f(x) = \\dfrac{2x + 1}{x - 1}', f: x => (2 * x + 1) / (x - 1), x: [-6, 8], y: [-6, 9],
              to: [{ id: 'inf', a: Infinity, txt: 'x \\to \\infty', lim: 2, asy: { h: 2 } },
                   { id: 'm1', a: 1, txt: 'x \\to 1', lim: null, asy: { v: 1 }, pole: 'links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$' }] },
            { k: '(x²−1)/(x−1)', tex: 'f(x) = \\dfrac{x^2 - 1}{x - 1}', f: x => (x * x - 1) / (x - 1), x: [-4, 5], y: [-3, 6], hole: [1, 2],
              to: [{ id: '1', a: 1, txt: 'x \\to 1', lim: 2, note: 'An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.' }] },
            { k: '3x²/(x²+1)', tex: 'f(x) = \\dfrac{3x^2}{x^2 + 1}', f: x => 3 * x * x / (x * x + 1), x: [-10, 10], y: [-1, 4.5],
              to: [{ id: 'inf', a: Infinity, txt: 'x \\to \\infty', lim: 3, asy: { h: 3 } }, { id: 'minf', a: -Infinity, txt: 'x \\to -\\infty', lim: 3, asy: { h: 3 } }] },
            { k: '2^(−x)+1', tex: 'f(x) = 2^{-x} + 1', f: x => Math.pow(2, -x) + 1, x: [-3, 10], y: [-1, 6],
              to: [{ id: 'inf', a: Infinity, txt: 'x \\to \\infty', lim: 1, asy: { h: 1 } }, { id: 'minf', a: -Infinity, txt: 'x \\to -\\infty', lim: null, pole: 'wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert' }] },
            { k: 'sin(x)/x', tex: 'f(x) = \\dfrac{\\sin x}{x}', f: x => Math.sin(x) / x, x: [-14, 14], y: [-0.5, 1.4], hole: [0, 1],
              to: [{ id: '0', a: 0, txt: 'x \\to 0', lim: 1, note: 'Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.' },
                   { id: 'inf', a: Infinity, txt: 'x \\to \\infty', lim: 0, asy: { h: 0 }, note: 'Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.' }] }
        ];
        let fi = 0, ti = 0, k = 3;
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, F.map((F, i) => [i, F.k]), 0, v => { fi = +v; ti = 0; buildTo(); render(); }, 'Funktion');
        const toBox = div(box, 'b-ctrls');
        range(div(box, ''), { label: 'Annäherung, Schritt $k$', min: 1, max: 6, step: 1, value: k, fmt: v => String(v), onInput: v => { k = v; render(); } });
        const p = new Plot(div(box, ''), { height: 300, aria: 'Graph mit Annäherung an einen Grenzwert' });
        const out = div(box, 'b-out');
        function buildTo() {
            toBox.innerHTML = '<span class="b-ctrl">Annäherung:</span>';
            segBox(toBox, F[fi].to.map((t, i) => [i, '$' + t.txt + '$']), 0, v => { ti = +v; render(); }, 'Richtung');
            math(toBox);
        }
        function render() {
            const G = F[fi], T = G.to[ti];
            p.view(G.x, G.y);
            const xs = [];
            for (let j = 1; j <= k; j++) {
                if (T.a === Infinity) xs.push([Math.pow(10, j)]);
                else if (T.a === -Infinity) xs.push([-Math.pow(10, j)]);
                else xs.push([T.a - Math.pow(10, -j), T.a + Math.pow(10, -j)]);
            }
            const layers = [{ fn: G.f, color: 'lambda', label: 'f' }];
            if (T.asy && T.asy.h != null) layers.push({ hline: T.asy.h, color: 'cyan' });
            if (T.asy && T.asy.v != null) layers.push({ vline: T.asy.v, color: 'red' });
            if (G.hole) layers.push({ pts: [G.hole], color: 'lambda', r: 6 }, { pts: [G.hole], color: '#0a1426', r: 3.5 });
            // the last approach points that lie in the window
            const vis = xs[xs.length - 1].filter(x => x >= G.x[0] && x <= G.x[1] && isFinite(G.f(x)));
            if (T.a === Infinity || T.a === -Infinity) {           // in the window: walk along the curve to its edge
                const edge = T.a > 0 ? G.x[1] * 0.97 : G.x[0] * 0.97;
                layers.push({ pts: [[edge, G.f(edge)]], color: 'cyan', r: 5 });
            } else layers.push({ pts: vis.map(x => [x, G.f(x)]), color: 'cyan', r: 5 });
            p.draw(layers);
            const rows = xs.map(r => r.map(x => '<td>' + fmt(x, 6) + '</td><td>' + fmt(G.f(x), 6) + '</td>').join('')).map(r => '<tr>' + r + '</tr>').join('');
            const head = xs[0].length === 2 ? '<tr><th>$x$ links</th><th>$f(x)$</th><th>$x$ rechts</th><th>$f(x)$</th></tr>' : '<tr><th>$x$</th><th>$f(x)$</th></tr>';
            out.innerHTML = '<p style="margin:0 0 8px">$' + G.tex + '$ für $' + T.txt + '$</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0">' + head + rows + '</table></div>' +
                '<p style="margin:8px 0 0">' + (T.lim != null ? '$\\lim\\limits_{' + T.txt + '} f(x) = ' + texNum(T.lim, 3) + '$' : '$f(x)$ ' + T.pole) + '</p>' +
                (T.note ? '<p style="margin:6px 0 0">' + T.note + '</p>' : '') +
                (T.asy && T.asy.h != null && T.lim != null ? '<p style="margin:6px 0 0">Waagerechte Asymptote: $y = ' + texNum(T.asy.h, 3) + '$</p>' : '');
            math(out);
        }
        buildTo();
        render();
    });

    // functions with their derivative, for the secant, the derivative graph and the tangent
    const FUN = {
        x2: { k: 'x²', tex: 'x^2', f: x => x * x, d: x => 2 * x, dtex: '2x', x: [-4, 4], y: [-2, 10] },
        cub: { k: '¼x³ − x + 1', tex: '\\tfrac14 x^3 - x + 1', f: x => 0.25 * x ** 3 - x + 1, d: x => 0.75 * x * x - 1, dtex: '\\tfrac34 x^2 - 1', x: [-4, 4], y: [-4, 6] },
        sin: { k: 'sin x', tex: '\\sin x', f: Math.sin, d: Math.cos, dtex: '\\cos x', x: [-1, 7], y: [-2.2, 2.2] },
        exp: { k: 'eˣ', tex: '\\mathrm{e}^x', f: Math.exp, d: Math.exp, dtex: '\\mathrm{e}^x', x: [-3, 3], y: [-1, 8] },
        quart: { k: 'x⁴ − 4x²', tex: 'x^4 - 4x^2', f: x => x ** 4 - 4 * x * x, d: x => 4 * x ** 3 - 8 * x, dtex: '4x^3 - 8x', x: [-2.6, 2.6], y: [-6, 6] },
        root: { k: '√x', tex: '\\sqrt{x}', f: Math.sqrt, d: x => 0.5 / Math.sqrt(x), dtex: '\\dfrac{1}{2\\sqrt{x}}', x: [-0.5, 9], y: [-1, 4], min: 0.01 }
    };

    /* ---------- from the secant to the tangent ---------- */
    W('sekante', function (box) {
        const HS = [2, 1.5, 1, 0.5, 0.25, 0.1, 0.05, 0.01, 0.001];
        const S = { f: FUN.cub, x0: 1, hi: 0, tan: false };
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, ['x2', 'cub', 'sin', 'exp'].map(k => [k, FUN[k].k]), 'cub', v => { S.f = FUN[v]; S.x0 = 1; render(); }, 'Funktion');
        range(div(box, ''), { label: 'Abstand $h$ von $P$ zu $Q$', min: 0, max: HS.length - 1, step: 1, value: 0, fmt: i => 'h = ' + fmt(HS[i], 3), onInput: v => { S.hi = v; render(); } });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-t>Tangente zeigen</button>';
        acts.querySelector('[data-t]').addEventListener('click', e => { S.tan = !S.tan; e.target.textContent = S.tan ? 'Tangente ausblenden' : 'Tangente zeigen'; render(); });
        const p = new Plot(div(box, ''), { height: 320, aria: 'Sekante durch P und Q nähert sich der Tangente' });
        const out = div(box, 'b-out');
        const hs = [{ x: S.x0, y: 0, color: 'lambda', fixY: true }];
        p.handles(hs, (i, x) => { S.x0 = Math.round(x * 10) / 10; render(); });
        function render() {
            const F = S.f, h = HS[S.hi], x0 = Math.max(S.x0, F.min || -Infinity), x1 = x0 + h;
            hs[0].x = x0; hs[0].y = F.f(x0);
            const y0 = F.f(x0), y1 = F.f(x1), ms = (y1 - y0) / h, mt = F.d(x0);
            p.view(F.x, F.y);
            const L = [{ fn: F.f, color: 'lambda', label: 'f' },
                { fn: x => y0 + ms * (x - x0), color: 'cyan', width: 1.8 },
                { seg: [[x0, y0], [x1, y0]], color: 'phi', width: 2 }, { seg: [[x1, y0], [x1, y1]], color: 'phi', width: 2 },
                { pts: [[x1, y1]], color: 'cyan', r: 5.5 }, { text: 'Q', at: [x1, y1], color: 'cyan' }, { text: 'P', at: [x0, y0], color: 'lambda', dx: -18 }];
            if (S.tan) L.splice(1, 0, { fn: x => y0 + mt * (x - x0), color: 'red', dash: true, width: 1.6 });
            p.draw(L);
            out.innerHTML = '<p style="margin:0 0 6px">$P' + pt(x0, y0) + '$, $Q' + pt(x1, y1, 3) + '$ mit $h = ' + texNum(h, 3) + '$</p>' +
                '<p style="margin:0 0 6px">Sekantensteigung (Differenzenquotient): $\\dfrac{f(x_0 + h) - f(x_0)}{h} = \\dfrac{' + texNum(y1, 4) + sg(-y0, 4) + '}{' + texNum(h, 3) + '} \\approx ' + texNum(ms, 4) + '$</p>' +
                '<p style="margin:0">Tangentensteigung: $f\'(' + num(x0, 2) + ') = ' + texNum(mt, 4) + '$ ' +
                (S.hi >= HS.length - 2 ? '· Für $h \\to 0$ wird aus der Sekante die Tangente.' : '· Mach $h$ kleiner.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- graphical differentiation ---------- */
    W('ableitungsgraph', function (box) {
        const S = { f: FUN.cub, x0: -2, trace: [], all: false };
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, ['x2', 'cub', 'quart', 'sin'].map(k => [k, FUN[k].k]), 'cub', v => { S.f = FUN[v]; S.trace = []; S.all = false; S.x0 = S.f.x[0] + 0.5; render(); }, 'Funktion');
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-all>Ganzen Graphen von f′ zeigen</button><button type="button" class="b-btn b-hintbtn" data-clr>Spur löschen</button>';
        acts.querySelector('[data-all]').addEventListener('click', () => { S.all = !S.all; render(); });
        acts.querySelector('[data-clr]').addEventListener('click', () => { S.trace = []; S.all = false; render(); });
        div(box, 'b-help').textContent = 'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.';
        const top = new Plot(div(box, ''), { height: 250, aria: 'Graph von f mit Tangente' });
        const bot = new Plot(div(box, ''), { height: 200, yLabel: 'y′', aria: 'Graph der Ableitung f Strich' });
        const out = div(box, 'b-out');
        const hs = [{ x: S.x0, y: 0, color: 'lambda', fixY: true }];
        top.handles(hs, (i, x) => { S.x0 = x; S.trace.push([x, S.f.d(x)]); render(); });
        function render() {
            const F = S.f, x0 = S.x0, y0 = F.f(x0), m = F.d(x0);
            hs[0].y = y0;
            top.view(F.x, F.y);
            top.draw([{ fn: F.f, color: 'lambda', label: 'f' }, { fn: x => y0 + m * (x - x0), color: 'cyan', width: 1.6, domain: [x0 - 1.6, x0 + 1.6] }]);
            let lo = Infinity, hi = -Infinity;
            for (let i = 0; i <= 200; i++) { const v = F.d(F.x[0] + (F.x[1] - F.x[0]) * i / 200); lo = Math.min(lo, v); hi = Math.max(hi, v); }
            const pad = (hi - lo) * 0.15 + 0.5;
            bot.view(F.x, [Math.min(lo - pad, -1), Math.max(hi + pad, 1)]);
            const L = [{ pts: S.trace.slice(-400), color: 'violet', r: 2.6 }, { pts: [[x0, m]], color: 'cyan', r: 5.5 }, { vline: x0 }];
            if (S.all) L.unshift({ fn: F.d, color: 'violet', label: "f′" });
            bot.draw(L);
            out.innerHTML = '<p style="margin:0">$f(x) = ' + F.tex + '$ · Steigung in $P' + pt(x0, y0) + '$: $f\'(' + num(x0, 2) + ') \\approx ' + texNum(m, 2) + '$' +
                (S.all ? ' · $f\'(x) = ' + F.dtex + '$' : '') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- monotony, extrema, inflection point of a cubic ---------- */
    W('kurve', function (box) {
        const S = { a: 0.25, b: 0, c: -3, d: 1, show: 'f' };
        const sl = div(box, '');
        range(sl, { label: '$a$ (vor $x^3$)', min: -1, max: 1, step: 0.05, value: S.a, onInput: v => { S.a = v; render(); } });
        range(sl, { label: '$b$ (vor $x^2$)', min: -3, max: 3, step: 0.25, value: S.b, onInput: v => { S.b = v; render(); } });
        range(sl, { label: '$c$ (vor $x$)', min: -5, max: 5, step: 0.25, value: S.c, onInput: v => { S.c = v; render(); } });
        range(sl, { label: '$d$', min: -5, max: 5, step: 0.5, value: S.d, onInput: v => { S.d = v; render(); } });
        const ctl = div(box, 'b-ctrls');
        ctl.innerHTML = '<span class="b-ctrl">Zeige auch:</span>';
        segBox(ctl, [['f', 'nur f'], ['f1', 'f′'], ['f2', 'f′ und f″']], 'f', v => { S.show = v; render(); }, 'Ableitungen zeigen');
        const p = new Plot(div(box, ''), { x: [-6, 6], y: [-8, 8], height: 340, aria: 'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten' });
        const out = div(box, 'b-out');
        function render() {
            const c = [S.d, S.c, S.b, S.a], c1 = pder(c), c2 = pder(c1);
            const f = x => pval(c, x), f1 = x => pval(c1, x), f2 = x => pval(c2, x);
            const L = [{ fn: f, color: 'lambda', label: 'f' }];
            if (S.show !== 'f') L.push({ fn: f1, color: 'cyan', label: "f′", dash: true, width: 1.8 });
            if (S.show === 'f2') L.push({ fn: f2, color: 'violet', label: "f″", dash: true, width: 1.6 });
            // critical points: zeros of f' = 3a x² + 2b x + c, exactly (a double zero is a saddle point)
            const crit = [], A2 = 3 * S.a, B1 = 2 * S.b;
            if (Math.abs(A2) > 1e-12) {
                const D = B1 * B1 - 4 * A2 * S.c;
                if (D > 1e-12) crit.push((-B1 - Math.sqrt(D)) / (2 * A2), (-B1 + Math.sqrt(D)) / (2 * A2));
                else if (D > -1e-12) crit.push(-B1 / (2 * A2));
            } else if (Math.abs(B1) > 1e-12) crit.push(-S.c / B1);
            const ext = [], sad = [];
            crit.forEach(x => { const k = f2(x); if (Math.abs(k) > 1e-9) ext.push([x, k < 0 ? 'H' : 'T']); else sad.push(x); });
            const infl = Math.abs(S.a) > 1e-12 ? [-S.b / (3 * S.a)] : [];
            ext.forEach(([x, t]) => L.push({ pts: [[x, f(x)]], color: t === 'H' ? 'red' : 'phi', r: 6 }, { text: t, at: [x, f(x)], color: t === 'H' ? 'red' : 'phi' }));
            infl.forEach(x => L.push({ pts: [[x, f(x)]], color: 'white', r: 5 }, { text: 'W', at: [x, f(x)], color: 'white', dy: 18 }));
            p.draw(L);
            // sign chart of f'
            const cuts = crit.slice().sort((u, v) => u - v);
            const bounds = [-Infinity].concat(cuts, [Infinity]);
            let rows = '';
            for (let i = 0; i < bounds.length - 1; i++) {
                const lo = bounds[i], hi = bounds[i + 1];
                const mid = !isFinite(lo) && !isFinite(hi) ? 0 : !isFinite(lo) ? hi - 1 : !isFinite(hi) ? lo + 1 : (lo + hi) / 2;
                const s = f1(mid);
                const iv = (isFinite(lo) ? num(lo, 2) : '-\\infty') + ' < x < ' + (isFinite(hi) ? num(hi, 2) : '\\infty');
                rows += '<tr><td>$' + iv + '$</td><td>' + (Math.abs(s) < 1e-12 ? '$= 0$' : s > 0 ? '$> 0$' : '$< 0$') + '</td><td>' + (Math.abs(s) < 1e-12 ? 'konstant' : s > 0 ? 'steigt ↗' : 'fällt ↘') + '</td></tr>';
            }
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + ptex(c) + '$ · $f\'(x) = ' + ptex(c1) + '$ · $f\'\'(x) = ' + ptex(c2) + '$</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0"><tr><th>Intervall</th><th>$f\'(x)$</th><th>$f$</th></tr>' + rows + '</table></div>' +
                '<p style="margin:8px 0 0">' + (ext.length ? ext.map(([x, t]) => (t === 'H' ? 'Hochpunkt' : 'Tiefpunkt') + ' $' + t + pt(x, f(x)) + '$ ($f\'\'(' + num(x, 2) + ') ' + (t === 'H' ? '< 0' : '> 0') + '$)').join(' · ') : 'keine Extrempunkte') +
                (sad.length ? ' · Sattelpunkt bei $x = ' + num(sad[0], 2) + '$' : '') + '</p>' +
                '<p style="margin:4px 0 0">' + (infl.length ? 'Wendepunkt $W' + pt(infl[0], f(infl[0])) + '$: Dort ist $f\'\'(x) = 0$ und die Steigung ' + (S.a > 0 ? 'am kleinsten' : 'am größten') + '.' : 'Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- tangent and normal ---------- */
    W('tangente', function (box) {
        const S = { f: FUN.x2, x0: 1 };
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, ['x2', 'cub', 'root', 'exp'].map(k => [k, FUN[k].k]), 'x2', v => { S.f = FUN[v]; S.x0 = 1; render(); }, 'Funktion');
        const p = new Plot(div(box, ''), { height: 340, equal: true, aria: 'Tangente und Normale an einen Graphen' });
        const out = div(box, 'b-out');
        const hs = [{ x: S.x0, y: 0, color: 'lambda', fixY: true }];
        p.handles(hs, (i, x) => { S.x0 = Math.round(x * 10) / 10; render(); });
        function render() {
            const F = S.f, x0 = Math.max(S.x0, F.min || -Infinity), y0 = F.f(x0), m = F.d(x0);
            hs[0].x = x0; hs[0].y = y0;
            p.view([-5, 5], [-2, 6]);
            const L = [{ fn: F.f, color: 'lambda', label: 'f', domain: F.min != null ? [0, 99] : null }, { fn: x => y0 + m * (x - x0), color: 'cyan', width: 1.8 }];
            if (Math.abs(m) > 1e-9) L.push({ fn: x => y0 - (x - x0) / m, color: 'violet', width: 1.6, dash: true });
            else L.push({ vline: x0, color: 'violet' });
            p.draw(L);
            const n = y0 - m * x0;
            const tTex = 't(x) = ' + (Math.abs(m) < 1e-9 ? num(y0, 3) : co(Math.round(m * 1000) / 1000, 3) + 'x' + sg(n, 3));
            const nTex = Math.abs(m) < 1e-9 ? 'x = ' + num(x0, 2) : 'n(x) = ' + co(Math.round(-1000 / m) / 1000, 3) + 'x' + sg(y0 + x0 / m, 3);
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + F.tex + '$, $f\'(x) = ' + F.dtex + '$ · Berührpunkt $P' + pt(x0, y0) + '$, $m_t = f\'(' + num(x0, 2) + ') = ' + texNum(m, 3) + '$</p>' +
                '<p style="margin:0 0 6px">Tangente: $' + tTex + '$</p>' +
                '<p style="margin:0">Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $' + nTex + '$</p>';
            math(out);
        }
        render();
    });

    /* ---------- derivative trainer ---------- */
    // what a student types: "3x^2+2", "1/(2√x)", "e^x+cos x", "x e^x + e^x", "(3x-1)cos(x)+3sin(x)" → a JS function
    function parseTerm(raw) {
        let s = String(raw).toLowerCase().replace(/\s+/g, '').replace(/,/g, '.').replace(/[·⋅×]/g, '*').replace(/[−–]/g, '-')
            .replace(/²/g, '^2').replace(/³/g, '^3').replace(/√/g, 'sqrt').replace(/f'\(x\)=|y'=/g, '');
        const toks = [], re = /\d*\.?\d+|sqrt|sin|cos|tan|exp|ln|pi|e|x|[+\-*/^()]/y;
        let m;
        re.lastIndex = 0;
        while (re.lastIndex < s.length) { m = re.exec(s); if (!m) return null; toks.push(m[0]); }
        const isAtomEnd = t => /^[\d.]/.test(t) || t === 'x' || t === 'e' || t === 'pi' || t === ')';
        const isAtomStart = t => /^[\d.]/.test(t) || /^(x|e|pi|sqrt|sin|cos|tan|exp|ln)$/.test(t) || t === '(';
        const fnName = t => /^(sqrt|sin|cos|tan|exp|ln)$/.test(t);
        let js = '';
        for (let i = 0; i < toks.length; i++) {
            const t = toks[i], prev = toks[i - 1];
            if (i && isAtomEnd(prev) && isAtomStart(t)) js += '*';
            if (fnName(t) && toks[i + 1] !== '(') {          // "sin x", "sqrtx": the next atom is the argument
                const nx = toks[i + 1]; if (!nx) return null;
                js += ({ ln: 'log' }[t] || t) + '(' + (nx === 'e' ? 'E' : nx === 'pi' ? 'PI' : nx) + ')'; i++; continue;
            }
            js += t === 'e' ? 'E' : t === 'pi' ? 'PI' : t === 'ln' ? 'log' : t === '^' ? '**' : t;
        }
        try {
            // eslint-disable-next-line no-new-func
            const fn = new Function('x', 'with (Math) { return (' + js + '); }');
            fn(1.3);
            return fn;
        } catch (_) { return null; }
    }
    function same(fa, fb) {
        const xs = [0.37, 0.81, 1.23, 1.77, 2.31, 2.9];
        return xs.every(x => { const a = fa(x), b = fb(x); return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)); });
    }
    const TASKS = {
        potenz() {
            const n = 2 + rnd(6), a = pick([1, 2, 3, 4, 5, -2, -3, 0.5]);
            return { tex: co(a) + 'x^{' + n + '}', d: x => a * n * x ** (n - 1), dtex: co(a * n) + (n - 1 === 1 ? 'x' : 'x^{' + (n - 1) + '}'),
                rule: 'Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.' };
        },
        summe() {
            const c = [rnd(9) - 4, pick([1, 2, -3, 5, 0]), pick([1, -2, 3, 0.5]), pick([0, 1, -1, 2])];
            if (pick([0, 1])) c.push(pick([1, -1, 0.5]));
            return { tex: ptex(c), d: x => pval(pder(c), x), dtex: ptex(pder(c)),
                rule: 'Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.' };
        },
        wurzel() {
            return pick([
                () => { const a = pick([1, 2, 4, 6]); return { tex: co(a) + '\\sqrt{x}', d: x => a / (2 * Math.sqrt(x)), dtex: a === 2 ? '\\dfrac{1}{\\sqrt{x}}' : '\\dfrac{' + texNum(a / 2, 2) + '}{\\sqrt{x}}',
                    rule: '$\\sqrt{x} = x^{\\frac12}$, also $(\\sqrt{x})\' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$.' }; },
                () => { const a = pick([1, 2, 3, -1, 5]); return { tex: '\\dfrac{' + a + '}{x}', d: x => -a / (x * x), dtex: '-\\dfrac{' + a + '}{x^2}',
                    rule: '$\\tfrac{1}{x} = x^{-1}$, also $(x^{-1})\' = -x^{-2} = -\\dfrac{1}{x^2}$.' }; },
                () => { const p = pick([3, 5, 7]), q = 2; return { tex: 'x^{\\frac{' + p + '}{' + q + '}}', d: x => p / q * x ** (p / q - 1), dtex: '\\tfrac{' + p + '}{' + q + '}\\,x^{\\frac{' + (p - q) + '}{' + q + '}}',
                    rule: 'Die Potenzregel gilt auch für rationale Exponenten: $(x^r)\' = r\\,x^{r-1}$.' }; },
                () => { const a = pick([1, 2, 3]); return { tex: '\\dfrac{' + a + '}{x^2}', d: x => -2 * a / x ** 3, dtex: '-\\dfrac{' + 2 * a + '}{x^3}',
                    rule: '$\\tfrac{1}{x^2} = x^{-2}$, also $(x^{-2})\' = -2x^{-3}$.' }; }
            ])();
        },
        exsin() {
            const a = pick([1, 2, 3, -1, 0.5]), b = pick([1, 2, -1, 4]), n = pick([2, 3]), c = pick([1, -1, 2]);
            return pick([
                () => ({ tex: co(a) + '\\mathrm{e}^x' + sgx(b, '\\sin x'), d: x => a * Math.exp(x) + b * Math.cos(x), dtex: co(a) + '\\mathrm{e}^x' + sgx(b, '\\cos x'),
                    rule: '$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ und $(\\sin x)\' = \\cos x$.' }),
                () => ({ tex: co(c) + 'x^{' + n + '}' + sgx(a, '\\mathrm{e}^x'), d: x => c * n * x ** (n - 1) + a * Math.exp(x), dtex: co(c * n) + (n === 2 ? 'x' : 'x^{' + (n - 1) + '}') + sgx(a, '\\mathrm{e}^x'),
                    rule: 'Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.' }),
                () => ({ tex: co(b) + '\\sin x' + sgx(c, 'x'), d: x => b * Math.cos(x) + c, dtex: co(b) + '\\cos x' + sg(c, 2),
                    rule: '$(\\sin x)\' = \\cos x$, und $(c \\cdot x)\' = c$.' })
            ])();
        },
        produkt() {
            return pick([
                () => ({ tex: 'x \\cdot \\mathrm{e}^x', d: x => (1 + x) * Math.exp(x), dtex: '\\mathrm{e}^x + x\\,\\mathrm{e}^x = (1 + x)\\,\\mathrm{e}^x',
                    rule: 'Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit $u = x$, $v = \\mathrm{e}^x$.' }),
                () => { const a = pick([2, 3, 4]), b = pick([1, -1, 2, -3]); return { tex: '(' + a + 'x' + sg(b, 0) + ') \\cdot \\sin x', d: x => a * Math.sin(x) + (a * x + b) * Math.cos(x),
                    dtex: a + '\\sin x + (' + a + 'x' + sg(b, 0) + ')\\cos x', rule: 'Produktregel mit $u = ' + a + 'x' + sg(b, 0) + '$, $u\' = ' + a + '$, $v = \\sin x$, $v\' = \\cos x$.' }; },
                () => ({ tex: 'x^2 \\cdot \\mathrm{e}^x', d: x => (2 * x + x * x) * Math.exp(x), dtex: '2x\\,\\mathrm{e}^x + x^2\\,\\mathrm{e}^x = (x^2 + 2x)\\,\\mathrm{e}^x',
                    rule: 'Produktregel mit $u = x^2$, $v = \\mathrm{e}^x$.' }),
                () => ({ tex: 'x \\cdot \\sin x', d: x => Math.sin(x) + x * Math.cos(x), dtex: '\\sin x + x\\cos x',
                    rule: 'Produktregel mit $u = x$, $v = \\sin x$.' })
            ])();
        }
    };
    W('ableiten', function (box) {
        const KINDS = [['potenz', 'Potenzen'], ['summe', 'Summen'], ['wurzel', 'Wurzeln und Brüche'], ['exsin', 'eˣ und sin x'], ['produkt', 'Produkte'], ['mix', 'Gemischt']];
        let kind = 'mix', T = null, solved = 0, tried = 0;
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, KINDS, kind, v => { kind = v; next(); }, 'Aufgabenart');
        const q = div(box, 'b-out');
        const row = div(box, 'b-ctrls');
        row.innerHTML = '<label class="b-ctrl" style="flex:1 1 260px">$f\'(x) =$ <input class="b-in" type="text" autocomplete="off" spellcheck="false" placeholder="z. B. 6x^2 - 2 oder cos x" style="flex:1;min-width:0"></label>' +
            '<button type="button" class="b-btn b-go" data-c>Prüfen</button><button type="button" class="b-btn b-hintbtn" data-s>Lösung</button><button type="button" class="b-btn" data-n>Neue Aufgabe</button>';
        const inp = row.querySelector('input'), fb = div(box, 'b-out');
        fb.style.display = 'none';
        function next() {
            const k = kind === 'mix' ? pick(Object.keys(TASKS)) : kind;
            T = TASKS[k]();
            q.innerHTML = '<p style="margin:0">Leite ab: $f(x) = ' + T.tex + '$</p>';
            inp.value = ''; fb.style.display = 'none';
            math(q); math(row);
        }
        function say(html) { fb.style.display = ''; fb.innerHTML = html; math(fb); }
        function check() {
            const fn = parseTerm(inp.value);
            if (!inp.value.trim()) return;
            if (!fn) { say('<p style="margin:0">Das kann ich nicht lesen. Schreibe zum Beispiel <code>3x^2 + 2x</code>, <code>e^x</code>, <code>cos x</code>, <code>1/(2sqrt(x))</code>.</p>'); return; }
            tried++;
            if (same(fn, T.d)) { solved++; say('<p style="margin:0"><b>Richtig!</b> $f\'(x) = ' + T.dtex + '$ · ' + solved + ' von ' + tried + ' gelöst</p>'); }
            else say('<p style="margin:0">Noch nicht. Tipp: ' + T.rule + '</p>');
        }
        row.querySelector('[data-c]').addEventListener('click', check);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        row.querySelector('[data-s]').addEventListener('click', () => say('<p style="margin:0">$f\'(x) = ' + T.dtex + '$</p><p style="margin:6px 0 0">' + T.rule + '</p>'));
        row.querySelector('[data-n]').addEventListener('click', next);
        next();
    });
    B.parseTerm = parseTerm;                                   // for the debug window and tests

    /* ---------- a function from conditions ---------- */
    W('steckbrief', function (box) {
        const MODES = {
            p3: { k: 'Parabel durch 3 Punkte', pts: [[-2, 3], [1, -1.5], [3, 2]], names: ['A', 'B', 'C'] },
            ext: { k: 'Kubisch: Extrempunkt + 2 Punkte', pts: [[-1, 3], [0, 0], [3, -1]], names: ['E', 'P', 'Q'] },
            wp: { k: 'Kubisch: Wendepunkt mit Tangente + Punkt', pts: [[1, 1], [-2, -1]], names: ['W', 'P'] }
        };
        // data-modes="p3" limits the choice (book FOS 11: only the parabola); without it all three, starting with 'ext'
        const keys = (box.dataset.modes || 'p3 ext wp').split(/\s+/).filter(k => MODES[k]);
        let mode = box.dataset.modes ? keys[0] : 'ext', mW = -1;
        const ctl = div(box, 'b-ctrls');
        if (keys.length > 1) segBox(ctl, keys.map(k => [k, MODES[k].k]), mode, v => { mode = v; setup(); }, 'Bedingungen');
        const mBox = div(box, '');
        range(mBox, { label: 'Steigung im Wendepunkt $m$', min: -4, max: 4, step: 0.5, value: mW, onInput: v => { mW = v; render(); } });
        const p = new Plot(div(box, ''), { x: [-5, 5], y: [-5, 6], height: 330, aria: 'Funktion aus Bedingungen' });
        const out = div(box, 'b-out');
        let hs = [];
        function setup() {
            hs = MODES[mode].pts.map(([x, y], i) => ({ x, y, color: ['lambda', 'cyan', 'phi'][i], snap: 0.5 }));
            mBox.style.display = mode === 'wp' ? '' : 'none';
            p.handles(hs, () => render());
            render();
        }
        function render() {
            const M = MODES[mode], P = hs.map(h => [h.x, h.y]);
            let A, b, eqs, deg;
            if (mode === 'p3') {
                deg = 2;
                A = P.map(([x]) => [x * x, x, 1]); b = P.map(([, y]) => y);
                eqs = P.map(([x, y], i) => 'f(' + num(x, 1) + ') = ' + num(y, 1) + ' &:\\; ' + rowTex([x * x, x, 1], ['a', 'b', 'c']) + ' = ' + num(y, 1));
            } else if (mode === 'ext') {
                deg = 3;
                const [[xe, ye], [xp, yp], [xq, yq]] = P;
                A = [[xe ** 3, xe * xe, xe, 1], [3 * xe * xe, 2 * xe, 1, 0], [xp ** 3, xp * xp, xp, 1], [xq ** 3, xq * xq, xq, 1]];
                b = [ye, 0, yp, yq];
                eqs = ['f(' + num(xe, 1) + ') = ' + num(ye, 1), "f'(" + num(xe, 1) + ') = 0', 'f(' + num(xp, 1) + ') = ' + num(yp, 1), 'f(' + num(xq, 1) + ') = ' + num(yq, 1)]
                    .map((t, i) => t + ' &:\\; ' + rowTex(A[i], ['a', 'b', 'c', 'd']) + ' = ' + num(b[i], 1));
            } else {
                deg = 3;
                const [[xw, yw], [xp, yp]] = P;
                A = [[xw ** 3, xw * xw, xw, 1], [6 * xw, 2, 0, 0], [3 * xw * xw, 2 * xw, 1, 0], [xp ** 3, xp * xp, xp, 1]];
                b = [yw, 0, mW, yp];
                eqs = ['f(' + num(xw, 1) + ') = ' + num(yw, 1), "f''(" + num(xw, 1) + ') = 0', "f'(" + num(xw, 1) + ') = ' + num(mW, 1), 'f(' + num(xp, 1) + ') = ' + num(yp, 1)]
                    .map((t, i) => t + ' &:\\; ' + rowTex(A[i], ['a', 'b', 'c', 'd']) + ' = ' + num(b[i], 1));
            }
            const s = solve(A, b);
            const L = [];
            let res = '';
            if (s) {
                const c = s.slice().reverse();                                   // [d, c, b, a] → coefficient list
                const f = x => pval(c, x);
                L.push({ fn: f, color: 'lambda', label: 'f' });
                if (mode === 'wp') { const [xw, yw] = P[0]; L.push({ fn: x => yw + mW * (x - xw), color: 'cyan', dash: true, width: 1.4, domain: [xw - 2, xw + 2] }); }
                res = '<p style="margin:8px 0 0">Lösung: $f(x) = ' + ptex(c.map(v => Math.round(v * 1e4) / 1e4), 4) + '$</p>';
                if (mode === 'ext') {
                    const k = pval(pder(pder(c)), P[0][0]);
                    res += '<p style="margin:4px 0 0">' + (Math.abs(k) < 1e-9 ? 'Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.' : 'Probe: $f\'\'(' + num(P[0][0], 1) + ') ' + (k < 0 ? '< 0$, also ein Hochpunkt.' : '> 0$, also ein Tiefpunkt.')) + '</p>';
                }
            } else res = '<p style="margin:8px 0 0">Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?</p>';
            P.forEach(([x, y], i) => L.push({ text: M.names[i], at: [x, y], color: ['lambda', 'cyan', 'phi'][i] }));
            p.draw(L);
            out.innerHTML = '<p style="margin:0 0 6px">Ansatz: $f(x) = ' + (deg === 2 ? 'ax^2 + bx + c' : 'ax^3 + bx^2 + cx + d') + '$' +
                (deg === 3 ? ', $f\'(x) = 3ax^2 + 2bx + c$, $f\'\'(x) = 6ax + 2b$' : '') + '</p>' +
                '<p style="margin:0">$\\begin{aligned}' + eqs.join('\\\\') + '\\end{aligned}$</p>' + res;
            math(out);
        }
        function rowTex(r, v) {
            let t = '';
            r.forEach((a, i) => { if (Math.abs(a) < 1e-12) return; const term = (Math.abs(a - 1) < 1e-9 ? '' : Math.abs(a + 1) < 1e-9 ? '-' : num(a, 2)) + v[i]; t += t ? (a < 0 ? ' - ' + term.replace(/^-/, '') : ' + ' + term) : term; });
            return t || '0';
        }
        setup();
    });

    /* ---------- optimisation: box, tin can, fence ---------- */
    W('optimieren', function (box) {
        const P = {
            box: { k: 'Schachtel', v: 'x', unit: 'cm', lo: 0.2, hi: 9.8, step: 0.1, x: 2, xl: 'x in cm', yl: 'V in cm³',
                f: x => x * (30 - 2 * x) * (20 - 2 * x), y: [0, 1250], best: (200 - Math.sqrt(200 * 200 - 4 * 12 * 600)) / 24, kind: 'Maximum',
                task: 'Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?',
                tex: 'V(x) = x\\,(30 - 2x)(20 - 2x) = 4x^3 - 100x^2 + 600x', dtex: "V'(x) = 12x^2 - 200x + 600 = 0", val: 'V' },
            can: { k: 'Dose', v: 'r', unit: 'cm', lo: 1.5, hi: 12, step: 0.05, x: 3, xl: 'r in cm', yl: 'O in cm²',
                f: r => 2 * Math.PI * r * r + 2000 / r, y: [0, 1400], best: Math.cbrt(500 / Math.PI), kind: 'Minimum',
                task: 'Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?',
                tex: 'O(r) = 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + \\dfrac{2000}{r}', dtex: "O'(r) = 4\\pi r - \\dfrac{2000}{r^2} = 0", val: 'O' },
            fence: { k: 'Zaun an der Mauer', v: 'x', unit: 'm', lo: 0.5, hi: 29.5, step: 0.5, x: 8, xl: 'x in m', yl: 'A in m²',
                f: x => x * (60 - 2 * x), y: [0, 520], best: 15, kind: 'Maximum',
                task: 'Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?',
                tex: 'A(x) = x\\,(60 - 2x) = 60x - 2x^2', dtex: "A'(x) = 60 - 4x = 0", val: 'A' }
        };
        let key = 'box', x = P.box.x, show = false;
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, Object.keys(P).map(k => [k, P[k].k]), key, v => { key = v; x = P[v].x; show = false; build(); }, 'Problem');
        const task = div(box, 'b-help');
        const sl = div(box, '');
        const wrap = div(box, 'an-opt');
        const sketch = div(wrap, 'an-sketch');
        const plotBox = div(wrap, '');
        const p = new Plot(plotBox, { height: 260, aria: 'Zielfunktion' });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-best>Lösung mit der Ableitung</button>';
        const out = div(box, 'b-out');
        acts.querySelector('[data-best]').addEventListener('click', () => { show = !show; render(); });
        function build() {
            const Q = P[key];
            task.innerHTML = Q.task; math(task);
            sl.innerHTML = '';
            range(sl, { label: '$' + Q.v + '$', min: Q.lo, max: Q.hi, step: Q.step, value: x, fmt: v => fmt(v, 2) + ' ' + Q.unit, onInput: v => { x = v; render(); } });
            p.view([0, Q.hi + Q.lo], Q.y); p.opt.xLabel = Q.xl; p.opt.yLabel = Q.yl;
            render();
        }
        function render() {
            const Q = P[key], y = Q.f(x);
            p.draw([{ fn: Q.f, color: 'lambda', domain: [Q.lo * 0.5, Q.hi + Q.lo * 0.5] }, { pts: [[x, y]], color: 'cyan', r: 6 }].concat(show ? [{ pts: [[Q.best, Q.f(Q.best)]], color: 'red', r: 6 }, { vline: Q.best, color: 'red' }] : []));
            sketch.innerHTML = drawSketch(key, x);
            out.innerHTML = '<p style="margin:0 0 6px">$' + Q.tex + '$</p><p style="margin:0">Bei $' + Q.v + ' = ' + texNum(x, 2) + '\\,\\text{' + Q.unit + '}$: $' + Q.val + ' \\approx ' + texNum(y, 1) + '$</p>' +
                (show ? '<p style="margin:8px 0 0">$' + Q.dtex + '$ ergibt $' + Q.v + ' \\approx ' + texNum(Q.best, 2) + '\\,\\text{' + Q.unit + '}$ mit $' + Q.val + ' \\approx ' + texNum(Q.f(Q.best), 1) + '$ (' + Q.kind + ').' +
                    (key === 'box' ? ' Die zweite Lösung $x \\approx ' + texNum((200 + Math.sqrt(11200)) / 24, 2) + '$ liegt außerhalb von $0 < x < 10$.' : '') +
                    (key === 'can' ? ' Dann ist $h = \\tfrac{1000}{\\pi r^2} \\approx ' + texNum(1000 / (Math.PI * Q.best * Q.best), 2) + '\\,\\text{cm} = 2r$: Die beste Dose ist so hoch wie breit.' : '') +
                    (key === 'fence' ? ' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.' : '') + '</p>' : '');
            math(out);
        }
        build();
    });
    // the little drawings beside the target function (SVG, colours as style so js/farbschema.js translates them)
    function drawSketch(key, x) {
        const L = 'style="stroke:#8fa3bd;stroke-width:1.5;fill:none"', G = 'style="stroke:rgb(245,194,66);stroke-width:2;fill:rgba(245,194,66,0.12)"';
        const T = (tx, ty, s, a = 'middle') => '<text x="' + tx + '" y="' + ty + '" text-anchor="' + a + '" style="fill:#cfd8e6;font:13px Raleway,sans-serif">' + s + '</text>';
        if (key === 'box') {
            const k = 7, W = 30 * k, H = 20 * k, c = x * k, ox = 20, oy = 16;
            const cut = (cx, cy) => '<rect x="' + cx + '" y="' + cy + '" width="' + c + '" height="' + c + '" style="fill:rgba(226,102,90,0.35);stroke:#e2665a;stroke-width:1.2"/>';
            return '<svg viewBox="0 0 ' + (W + 40) + ' ' + (H + 44) + '" role="img" aria-label="Karton mit ausgeschnittenen Ecken">' +
                '<rect x="' + ox + '" y="' + oy + '" width="' + W + '" height="' + H + '" ' + L + '/>' +
                '<rect x="' + (ox + c) + '" y="' + (oy + c) + '" width="' + (W - 2 * c) + '" height="' + (H - 2 * c) + '" ' + G + '/>' +
                cut(ox, oy) + cut(ox + W - c, oy) + cut(ox, oy + H - c) + cut(ox + W - c, oy + H - c) +
                T(ox + W / 2, oy + H + 18, '30 cm') + T(ox + W + 4, oy + H / 2 + 4, '20 cm', 'start') + T(ox + c / 2, oy + c + 15, 'x') + '</svg>';
        }
        if (key === 'can') {
            const r = x, h = 1000 / (Math.PI * r * r), k = 9, w = 2 * r * k, hh = Math.min(h * k, 230), cx = 130, top = 20, e = Math.max(6, w * 0.16);
            return '<svg viewBox="0 0 260 ' + (hh + 70) + '" role="img" aria-label="Zylindrische Dose">' +
                '<path d="M' + (cx - w / 2) + ' ' + (top + e) + ' L' + (cx - w / 2) + ' ' + (top + e + hh) + ' A' + w / 2 + ' ' + e + ' 0 0 0 ' + (cx + w / 2) + ' ' + (top + e + hh) + ' L' + (cx + w / 2) + ' ' + (top + e) + '" ' + G + '/>' +
                '<ellipse cx="' + cx + '" cy="' + (top + e) + '" rx="' + w / 2 + '" ry="' + e + '" ' + G + '/>' +
                T(cx, top + e + hh + e + 22, 'r = ' + fmt(r, 2) + ' cm, h = ' + fmt(h, 2) + ' cm') + '</svg>';
        }
        const k = 6, a = x * k, b = (60 - 2 * x) * k, ox = 16, oy = 26;
        return '<svg viewBox="0 0 ' + (60 * k + 40) + ' ' + (30 * k + 70) + '" role="img" aria-label="Gehege an einer Mauer">' +
            '<line x1="6" y1="' + oy + '" x2="' + (60 * k + 34) + '" y2="' + oy + '" style="stroke:#e2665a;stroke-width:5"/>' + T(60 * k / 2 + 20, oy - 8, 'Mauer') +
            '<rect x="' + ox + '" y="' + oy + '" width="' + b + '" height="' + a + '" ' + G + '/>' +
            T(ox + b / 2, oy + a + 18, fmt(60 - 2 * x, 1) + ' m') + T(ox + b + 6, oy + a / 2 + 4, 'x = ' + fmt(x, 1) + ' m', 'start') + '</svg>';
    }
    /* =========================== Klasse 13, Lernbereich 6: families of functions, costs and profit =========================== */
    /* ---------- a family of functions f_a with the locus of its extreme points ---------- */
    W('schar', function (box) {
        const P = {
            kub: { k: 'fₐ(x) = x³ − a·x', tex: a => 'f_{' + texNum(a, 1) + '}(x) = x^3' + sgx(-a, 'x', 1), f: (a, x) => x ** 3 - a * x, lo: -2, hi: 6, a: 3, y: [-8, 8],
                ext: a => a > 0 ? [[-Math.sqrt(a / 3), 'H'], [Math.sqrt(a / 3), 'T']] : [], ort: x => -2 * x ** 3, orttex: 'y = -2x^3',
                note: 'Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.' },
            par: { k: 'fₐ(x) = −x² + a·x', tex: a => 'f_{' + texNum(a, 1) + '}(x) = -x^2' + sgx(a, 'x', 1), f: (a, x) => -x * x + a * x, lo: -4, hi: 4, a: 2, y: [-4, 5],
                ext: a => [[a / 2, 'H']], ort: x => x * x, orttex: 'y = x^2', note: 'Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.' }
        };
        let G = P.kub, a = G.a, showOrt = true;
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, Object.keys(P).map(k => [k, P[k].k]), 'kub', v => { G = P[v]; a = G.a; build(); }, 'Funktionenschar');
        const sl = div(box, '');
        const c2 = div(box, 'b-ctrls');
        c2.innerHTML = '<label class="b-ctrl"><input type="checkbox" checked> Ortskurve der Extrempunkte zeigen</label>';
        c2.querySelector('input').addEventListener('change', e => { showOrt = e.target.checked; render(); });
        const p = new Plot(div(box, ''), { x: [-4, 4], height: 330, aria: 'Funktionenschar mit Ortskurve' });
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            range(sl, { label: 'Parameter $a$', min: G.lo, max: G.hi, step: 0.5, value: a, fmt: v => fmt(v, 1), onInput: v => { a = v; render(); } });
            math(sl); render();
        }
        function render() {
            p.view([-4, 4], G.y);
            const L = [];
            for (let b = G.lo; b <= G.hi; b += 1) if (Math.abs(b - a) > 1e-9) L.push({ fn: x => G.f(b, x), color: 'dim', width: 1 });
            if (showOrt) L.push({ fn: G.ort, color: 'violet', dash: true, width: 1.8 });
            L.push({ fn: x => G.f(a, x), color: 'lambda', label: 'fₐ' });
            const E = G.ext(a);
            E.forEach(([x, t]) => L.push({ pts: [[x, G.f(a, x)]], color: t === 'H' ? 'red' : 'phi', r: 6 }, { text: t, at: [x, G.f(a, x)], color: t === 'H' ? 'red' : 'phi' }));
            p.draw(L);
            out.innerHTML = '<p style="margin:0 0 6px">$' + G.tex(a) + '$ · ' + (E.length ? E.map(([x, t]) => (t === 'H' ? 'Hochpunkt' : 'Tiefpunkt') + ' $(' + num(x, 3) + ' \\mid ' + num(G.f(a, x), 3) + ')$').join(' · ') : 'keine Extrempunkte') + '</p>' +
                '<p style="margin:0">Ortskurve aller Extrempunkte (violett): $' + G.orttex + '$. ' + G.note + '</p>';
            math(out);
        }
        build();
    });

    /* ---------- costs, revenue, profit ---------- */
    W('gewinn', function (box) {
        const K = x => 0.02 * x ** 3 - 1.2 * x * x + 30 * x + 200;
        let price = 30;
        range(div(box, ''), { label: 'Verkaufspreis $p$ (€ pro Stück)', min: 15, max: 50, step: 1, value: price, fmt: v => v + ' €', onInput: v => { price = v; render(); } });
        const p = new Plot(div(box, ''), { x: [-1, 62], y: [-400, 3100], height: 320, xLabel: 'x in Stück', yLabel: '€', aria: 'Kosten, Erlös und Gewinn' });
        const out = div(box, 'b-out');
        function render() {
            const E = x => price * x, Gw = x => E(x) - K(x);
            const z = zeros(Gw, 0, 60, 1200);
            // G'(x) = p − K'(x) = 0 ⇔ 0,06x² − 2,4x + 30 − p = 0; the larger root is the maximum
            const D = 5.76 - 0.24 * (30 - price), xm = D >= 0 ? (2.4 + Math.sqrt(D)) / 0.12 : null;
            const ok = xm != null && xm <= 60 && Gw(xm) > 0;
            const L = [{ fn: K, color: 'red', label: 'K', domain: [0, 60] }, { fn: E, color: 'phi', label: 'E', domain: [0, 60] }, { fn: Gw, color: 'lambda', label: 'G', domain: [0, 60], labelAt: 50 }, { hline: 0 }];
            if (z.length) L.push({ pts: z.map(x => [x, 0]), color: 'white', r: 5 });
            if (ok) L.push({ pts: [[xm, Gw(xm)]], color: 'lambda', r: 6 }, { vline: xm, color: 'lambda' });
            p.draw(L);
            out.innerHTML = '<p style="margin:0 0 6px">$K(x) = 0{,}02x^3 - 1{,}2x^2 + 30x + 200$ · $E(x) = ' + price + 'x$ · $G(x) = E(x) - K(x)$</p>' +
                '<p style="margin:0 0 6px">' + (z.length >= 2 ? 'Gewinnschwelle bei $x \\approx ' + num(z[0], 1) + '$, Gewinngrenze bei $x \\approx ' + num(z[z.length - 1], 1) + '$ Stück.' : z.length === 1 ? 'Gewinn ab $x \\approx ' + num(z[0], 1) + '$ Stück.' : 'Bei diesem Preis wird nie Gewinn gemacht.') + '</p>' +
                '<p style="margin:0">' + (ok ? 'Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ' + num(xm, 1) + '$ Stück, $G \\approx ' + num(Gw(xm), 0) + '$ €.' : 'Kein positives Gewinnmaximum.') + '</p>';
            math(out);
        }
        render();
    });

    /* =========================== Book FOS 12 =========================== */

    /* ---------- the cover of the FOS 12 book ---------- */
    // One picture per Lernbereich, calm like the cover of book 12: an exponential curve u·e^(-u) with its high point and
    // the tangent at the point of inflection (LB 2), rectangles under it (LB 3), a hyperbola with its two asymptotes at the
    // bottom (LB 4), and in the free corner beside the title a parallelogram in space with its cross product standing
    // perpendicular on it (LB 1).
    W('titelbildfos12', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const n1 = v => v.toFixed(1);
        const path = (g, a, b, n = 160) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + n1(X(x)) + ' ' + n1(Y(g(x))); }
            return d;
        };
        // f(x) = A·u·e^(-u/s) with u = x + x0: zero at -x0, high point at u = s, point of inflection at u = 2s
        const x0 = 2.2, s = 1.6, A = 5.44;
        const f = x => A * (x + x0) * Math.exp(-(x + x0) / s);
        const xH = s - x0, xW = 2 * s - x0, yW = f(xW), mW = A * Math.exp(-2) * -1;
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        // midpoint rectangles under the falling part of the curve
        let bars = '';
        for (let k = 0; k < 8; k++) {
            const a = 1.6 + k * 0.4, h = f(a + 0.2);
            bars += '<rect x="' + n1(X(a) + 1) + '" y="' + n1(Y(h)) + '" width="' + n1(X(0.4) - X(0) - 2) + '" height="' + n1(Y(0) - Y(h)) + '" rx="2"/>';
        }
        // the hyperbola y = -1.5 ± 0.45/(x - 1.5) with its asymptotes
        const xp = 1.5, ya = -1.5, c = 0.45, hy = x => ya + c / (x - xp);
        let hyp = '<line x1="' + n1(X(xp)) + '" y1="' + n1(Y(-0.2)) + '" x2="' + n1(X(xp)) + '" y2="' + Ht + '" stroke="#B8A4F2" stroke-opacity="0.45" stroke-width="1.4" stroke-dasharray="6 7"/>' +
            '<line x1="0" y1="' + n1(Y(ya)) + '" x2="' + Wd + '" y2="' + n1(Y(ya)) + '" stroke="#B8A4F2" stroke-opacity="0.45" stroke-width="1.4" stroke-dasharray="6 7"/>';
        [[xp + c / (-0.25 - ya), 6], [-3, xp - c / (3.3 + ya)]].forEach(([a, b]) => {
            hyp += '<path d="' + path(hy, a, b, 120) + '" stroke="#B8A4F2" stroke-opacity="0.85" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
        });
        let art = '';
        art += '<line x1="0" y1="' + n1(Y(0)) + '" x2="' + Wd + '" y2="' + n1(Y(0)) + '" stroke="#cfe4f5" stroke-opacity="0.2" stroke-width="1.2"/>';
        art += '<path d="' + path(f, -x0, 6) + '" stroke="#F5C242" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#tbf12-glow)"/>';
        const t1 = [X(xW - 1.6), Y(yW - 1.6 * mW)], t2 = [X(xW + 1.6), Y(yW + 1.6 * mW)];
        art += '<line x1="' + n1(t1[0]) + '" y1="' + n1(t1[1]) + '" x2="' + n1(t2[0]) + '" y2="' + n1(t2[1]) + '" stroke="url(#tbf12-tan)" stroke-width="2.6" stroke-linecap="round" filter="url(#tbf12-glow)"/>';
        art += '<circle cx="' + n1(X(xH)) + '" cy="' + n1(Y(f(xH))) + '" r="13" fill="#fff" fill-opacity="0.12"/><circle cx="' + n1(X(xH)) + '" cy="' + n1(Y(f(xH))) + '" r="6" fill="#fff"/>';
        art += '<circle cx="' + n1(X(xW)) + '" cy="' + n1(Y(yW)) + '" r="13" fill="#7fd8ee" fill-opacity="0.12"/>' +
            '<circle cx="' + n1(X(xW)) + '" cy="' + n1(Y(yW)) + '" r="6" fill="#0b1830" stroke="#7fd8ee" stroke-width="2.6"/>';
        // space: three faint axes, a parallelogram A, A+u, A+u+v, A+v and u × v from its centre with a right-angle mark
        const O = [400, 470], ex = [-34, 24], ey = [96, 0], ez = [0, -88];
        const pt = p => [O[0] + p[0] * ex[0] + p[1] * ey[0] + p[2] * ez[0], O[1] + p[0] * ex[1] + p[1] * ey[1] + p[2] * ez[1]];
        const vadd = (a, b) => a.map((v, i) => v + b[i]), vmul = (r, a) => a.map(v => r * v);
        function pfeil(p, q, sz, colr, w, extra) {
            const ang = Math.atan2(q[1] - p[1], q[0] - p[0]), cs = Math.cos(ang), sn = Math.sin(ang);
            const at = (back, side) => n1(q[0] - back * cs - side * sn) + ',' + n1(q[1] - back * sn + side * cs);
            return '<line x1="' + n1(p[0]) + '" y1="' + n1(p[1]) + '" x2="' + n1(q[0] - 0.62 * sz * cs) + '" y2="' + n1(q[1] - 0.62 * sz * sn) +
                '" stroke="' + colr + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || '') + '/>' +
                '<polygon points="' + at(0, 0) + ' ' + at(sz, 0.42 * sz) + ' ' + at(0.68 * sz, 0) + ' ' + at(sz, -0.42 * sz) + '" fill="' + colr + '"' + (extra || '') + '/>';
        }
        const Ap = [0, 0, 1.2], u = [1, 0, -0.25], v = [0, 1.2, -1], n = [0.3, 1, 1.2];      // u × v = n
        const M = vadd(Ap, vmul(0.5, vadd(u, v))), nl = Math.hypot(...n), ul = Math.hypot(...u);
        const quad = [Ap, vadd(Ap, u), vadd(Ap, vadd(u, v)), vadd(Ap, v)].map(pt);
        let raum = '';
        [[1.9, 0, 0], [0, 1.75, 0], [0, 0, 1.75]].forEach(e => { raum += pfeil(O, pt(e), 10, '#cfe4f5', 1.6, ' opacity="0.55"'); });
        raum += '<polygon points="' + quad.map(q => n1(q[0]) + ',' + n1(q[1])).join(' ') + '" fill="#B8A4F2" fill-opacity="0.2" stroke="#B8A4F2" stroke-opacity="0.75" stroke-width="1.6" stroke-linejoin="round"/>';
        raum += pfeil(pt(Ap), pt(vadd(Ap, u)), 12, '#7fd8ee', 2.4) + pfeil(pt(Ap), pt(vadd(Ap, v)), 12, '#A0C85A', 2.4);
        const q = 0.2, a1 = vadd(M, vmul(q / ul, u)), a2 = vadd(a1, vmul(q / nl, n)), a3 = vadd(M, vmul(q / nl, n));
        raum += '<polyline points="' + [a1, a2, a3].map(pt).map(r => n1(r[0]) + ',' + n1(r[1])).join(' ') + '" fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="1.4"/>';
        raum += '<g filter="url(#tbf12-glow)">' + pfeil(pt(M), pt(vadd(M, vmul(0.8, n))), 18, '#e682be', 3.4) + '</g>';
        raum += '<circle cx="' + n1(pt(M)[0]) + '" cy="' + n1(pt(M)[1]) + '" r="3.5" fill="#e682be"/><circle cx="' + O[0] + '" cy="' + O[1] + '" r="3.5" fill="#cfe4f5" fill-opacity="0.8"/>';
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Exponentialkurve mit Hochpunkt, Wendetangente und Rechtecken darunter, eine Hyperbel mit Asymptoten und ein Parallelogramm im Raum mit seinem Vektorprodukt">' +
            '<defs><linearGradient id="tbf12-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.97" stop-color="#fff" stop-opacity="0.2"/></linearGradient>' +
            '<mask id="tbf12-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tbf12-fade)"/></mask>' +
            '<linearGradient id="tbf12-tan" gradientUnits="userSpaceOnUse" x1="' + n1(t1[0]) + '" y1="' + n1(t1[1]) + '" x2="' + n1(t2[0]) + '" y2="' + n1(t2[1]) + '">' +
            '<stop offset="0" stop-color="#7fd8ee" stop-opacity="0"/><stop offset="0.25" stop-color="#7fd8ee"/><stop offset="0.75" stop-color="#7fd8ee"/><stop offset="1" stop-color="#7fd8ee" stop-opacity="0"/></linearGradient>' +
            '<filter id="tbf12-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Wd + '" height="' + Ht + '"><feGaussianBlur stdDeviation="5" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g mask="url(#tbf12-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' +
            '<g fill="#A0C85A" fill-opacity="0.28" stroke="#A0C85A" stroke-opacity="0.55" stroke-width="1.2">' + bars + '</g>' + hyp + art + '</g>' + raum + '</svg>';
    });

    /* ---------- rational functions: zeros, poles and holes from the linear factors ---------- */
    W('bruchfunktion', function (box) {
        const PRE = {
            pol: { k: 'Polstelle', ki: 5, z: [-1], p: [2] },
            luecke: { k: 'Lücke', ki: 5, z: [1], p: [1, -2] },
            doppelt: { k: 'ohne Vorzeichenwechsel', ki: 6, z: [], p: [1, 1] },
            schief: { k: 'schiefe Asymptote', ki: 4, z: [-1, 2], p: [1] }
        };
        const KS = [-3, -2, -1, -0.5, 0.5, 1, 2, 3], ZD = [-1, 2], PD = [2, -2];
        let S = null;
        const pick = pr => { S = { ki: pr.ki, z: pr.z.slice(), p: pr.p.slice() }; build(); };
        const pre = div(box, 'b-ctrls');
        pre.innerHTML = '<span class="b-ctrl">Beispiele:</span>' + Object.keys(PRE).map(k => '<button type="button" class="b-btn" data-p="' + k + '">' + PRE[k].k + '</button>').join('');
        pre.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b) pick(PRE[b.dataset.p]); });
        const deg = div(box, 'b-ctrls');
        const sl = div(box, '');
        const p = new Plot(div(box, ''), { x: [-6, 6], y: [-6, 6], height: 320, aria: 'Graph einer gebrochenrationalen Funktion mit Polstellen, Lücken und Asymptoten' });
        const out = div(box, 'b-out');
        const near = (a, b) => Math.abs(a - b) < 1e-9;
        const uniq = a => a.filter((x, i) => a.findIndex(y => near(x, y)) === i).sort((u, w) => u - w);
        const lin = z => (near(z, 0) ? 'x' : '(x ' + (z < 0 ? '+' : '-') + ' ' + texNum(Math.abs(z), 1) + ')');
        function facTex(list) {                                    // (x - 1)^2 (x + 2), equal factors grouped
            return uniq(list).map(z => { const m = list.filter(y => near(y, z)).length; return lin(z) + (m > 1 ? '^{' + m + '}' : ''); }).join('');
        }
        function frac(k, zs, ps) {
            let top = zs.length ? co(k, 1) + facTex(zs) : texNum(k, 1);
            if (zs.length === 1 && Math.abs(k - 1) < 1e-9 && !near(zs[0], 0)) top = top.slice(1, -1);
            let bot = facTex(ps);
            if (ps.length === 1 && !near(ps[0], 0)) bot = bot.slice(1, -1);
            return bot ? '\\dfrac{' + top + '}{' + bot + '}' : top;
        }
        function build() {
            deg.innerHTML = '<span class="b-ctrl">Zähler:</span>';
            segBox(deg, [['0', 'Grad 0'], ['1', 'Grad 1'], ['2', 'Grad 2']], String(S.z.length), v => { S.z = ZD.slice(0, +v).map((d, i) => S.z[i] != null ? S.z[i] : d); build(); }, 'Grad des Zählers');
            const s2 = document.createElement('span'); s2.className = 'b-ctrl'; s2.textContent = 'Nenner:'; deg.appendChild(s2);
            segBox(deg, [['1', 'Grad 1'], ['2', 'Grad 2']], String(S.p.length), v => { S.p = PD.slice(0, +v).map((d, i) => S.p[i] != null ? S.p[i] : d); build(); }, 'Grad des Nenners');
            sl.innerHTML = '';
            range(sl, { label: 'Faktor $k$', min: 0, max: KS.length - 1, step: 1, value: S.ki, fmt: i => fmt(KS[i], 1), onInput: v => { S.ki = v; render(); } });
            S.z.forEach((z, i) => range(sl, { label: 'Nullstelle des Zählers $z_' + (i + 1) + '$', min: -4, max: 4, step: 0.5, value: z, fmt: v => fmt(v, 1), onInput: v => { S.z[i] = v; render(); } }));
            S.p.forEach((q, i) => range(sl, { label: 'Nullstelle des Nenners $p_' + (i + 1) + '$', min: -4, max: 4, step: 0.5, value: q, fmt: v => fmt(v, 1), onInput: v => { S.p[i] = v; render(); } }));
            math(sl);
            render();
        }
        function render() {
            const k = KS[S.ki], zs = S.z, ps = S.p;
            // cancel common linear factors
            const rz = zs.slice(), rp = [];
            ps.forEach(q => { const i = rz.findIndex(z => near(z, q)); if (i >= 0) rz.splice(i, 1); else rp.push(q); });
            const f = x => k * zs.reduce((s, z) => s * (x - z), 1) / ps.reduce((s, q) => s * (x - q), 1);
            const fr = x => k * rz.reduce((s, z) => s * (x - z), 1) / rp.reduce((s, q) => s * (x - q), 1);
            const gaps = uniq(ps);
            const poles = gaps.filter(q => rp.some(r => near(r, q))).map(q => ({ x: q, ord: rp.filter(r => near(r, q)).length }));
            const holes = gaps.filter(q => !rp.some(r => near(r, q))).map(q => [q, fr(q)]);
            const zeros = uniq(rz.filter(z => !gaps.some(g => near(g, z))));
            const L = [];
            poles.forEach(o => L.push({ vline: o.x, color: 'red' }));
            let asy = '', asyFn = null;
            const m = zs.length, n = ps.length;
            if (!rp.length) asy = 'Nach dem Kürzen steht kein $x$ mehr im Nenner: Der Graph ist ' + (rz.length ? 'eine Gerade' : 'eine waagerechte Gerade') + ' mit ' + (holes.length > 1 ? 'Löchern' : 'einem Loch') + '.';
            else if (m < n) { asyFn = 0; asy = 'Zählergrad kleiner als Nennergrad: waagerechte Asymptote $y = 0$, die $x$-Achse.'; }
            else if (m === n) { asyFn = k; asy = 'Zählergrad gleich Nennergrad: waagerechte Asymptote $y = ' + texNum(k, 1) + '$ (Quotient der Leitkoeffizienten).'; }
            else {
                const q = ps[0], a = k, b = k * (q - zs[0] - zs[1]), r = k * (q - zs[0]) * (q - zs[1]);
                L.push({ fn: x => a * x + b, color: 'cyan', dash: true, width: 1.6 });
                asy = 'Zählergrad um 1 größer: Polynomdivision ergibt $f(x) = ' + co(a, 1) + 'x' + sg(b, 2) + ' + \\dfrac{' + texNum(r, 2) + '}{' + facTex([q]).replace(/^\((.*)\)$/, '$1') + '}$, schiefe Asymptote $y = ' + co(a, 1) + 'x' + sg(b, 2) + '$.';
            }
            if (asyFn != null) L.push({ hline: asyFn, color: 'cyan' });
            L.push({ fn: f, color: 'lambda', label: 'f' });
            if (zeros.length) L.push({ pts: zeros.map(z => [z, 0]), color: 'phi', r: 5.5 });
            holes.forEach(([x, y]) => { if (Math.abs(y) < 6.5) L.push({ pts: [[x, y]], color: 'lambda', r: 6 }, { pts: [[x, y]], color: '#0a1426', r: 3.5 }); });
            p.draw(L);
            const set = gaps.map(q => texNum(q, 1)).join('; ');
            let html = '<p style="margin:0 0 6px">$f(x) = ' + frac(k, zs, ps) + '$ · $D = \\mathbb{R} \\setminus \\{' + set + '\\}$</p>';
            if (holes.length) html += '<p style="margin:0 0 6px">Kürzen: $f(x) = ' + frac(k, rz, rp) + '$ für $x \\neq ' + holes.map(h => texNum(h[0], 1)).join(', ') + '$ · hebbare Lücke' + (holes.length > 1 ? 'n' : '') + ' ' + holes.map(([x, y]) => '$(' + texNum(x, 1) + ' \\mid ' + texNum(y, 3) + ')$').join(', ') + '</p>';
            html += '<p style="margin:0 0 6px">Nullstellen: ' + (zeros.length ? zeros.map(z => '$x = ' + texNum(z, 1) + '$').join(', ') : 'keine') + ' · Polstellen: ' +
                (poles.length ? poles.map(o => '$x = ' + texNum(o.x, 1) + '$ ' + (o.ord % 2 ? 'mit' : 'ohne') + ' Vorzeichenwechsel').join(', ') + ' (senkrechte Asymptote)' : 'keine') + '</p>';
            html += '<p style="margin:0">' + asy + '</p>';
            out.innerHTML = html; math(out);
        }
        pick(PRE.pol);
    });

    /* ---------- the number e: the base with slope 1, e-functions, continuous compounding ---------- */
    W('efunktion', function (box) {
        let mode = box.dataset.mode || 'basis';
        const S = { a: 2, A: 2, b: -1, c: 1, ni: 0 };
        const NS = [[1, 'jährlich'], [2, 'halbjährlich'], [4, 'vierteljährlich'], [12, 'monatlich'], [52, 'wöchentlich'], [365, 'täglich'], [8760, 'stündlich'], [525600, 'minütlich']];
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, [['basis', 'Welche Basis?'], ['graph', 'a · eᵇˣ + c'], ['zins', 'Zinseszins']], mode, v => { mode = v; build(); }, 'Was wird gezeigt?');
        const sl = div(box, '');
        const p = new Plot(div(box, ''), { x: [-3, 3], y: [-1, 8], height: 300, aria: 'Exponentialfunktionen und die Eulersche Zahl e' });
        const out = div(box, 'b-out');
        const ex = (b, d = 2) => '\\mathrm{e}^{' + (Math.abs(b) < 1e-12 ? '0' : co(b, d) + 'x') + '}';
        function build() {
            sl.innerHTML = '';
            if (mode === 'basis') {
                const r = range(sl, { label: 'Basis $a$', min: 1.5, max: 4, step: 0.01, value: S.a, fmt: v => fmt(v, 2), onInput: v => { S.a = v; render(); } });
                const b = div(sl, 'b-ctrls');
                b.innerHTML = '<button type="button" class="b-btn">a = e setzen</button>';
                b.querySelector('button').addEventListener('click', () => { S.a = Math.E; r.set(Math.E); render(); });
            } else if (mode === 'graph') {
                range(sl, { label: 'Faktor $a$', min: -3, max: 3, step: 0.5, value: S.A, fmt: v => fmt(v, 1), onInput: v => { S.A = v; render(); } });
                range(sl, { label: 'im Exponenten $b$', min: -2, max: 2, step: 0.25, value: S.b, fmt: v => fmt(v, 2), onInput: v => { S.b = v; render(); } });
                range(sl, { label: 'Verschiebung $c$', min: -3, max: 3, step: 0.5, value: S.c, fmt: v => fmt(v, 1), onInput: v => { S.c = v; render(); } });
            } else {
                range(sl, { label: 'Verzinsung', min: 0, max: NS.length - 1, step: 1, value: S.ni, fmt: i => NS[i][1], onInput: v => { S.ni = v; render(); } });
            }
            math(sl);
            render();
        }
        function render() {
            if (mode === 'basis') {
                const a = S.a, la = Math.log(a), f = x => Math.pow(a, x);
                p.view([-3, 3], [-1, 8]);
                p.draw([{ fn: x => la * f(x), color: 'violet', dash: true, width: 1.8, label: 'f′', labelAt: -2.4 }, { fn: f, color: 'lambda', label: 'f', labelAt: 1.6 },
                    { fn: x => 1 + la * x, color: 'cyan', width: 1.6, domain: [-1.8, 1.8] }, { pts: [[0, 1]], color: 'white', r: 5 }]);
                const hit = Math.abs(la - 1) < 0.006;
                out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + texNum(a, 3) + '^x$ · Steigung in $(0 \\mid 1)$: $f\'(0) = \\lim\\limits_{h \\to 0} \\dfrac{a^h - 1}{h} \\approx ' + texNum(la, 4) + '$</p>' +
                    '<p style="margin:0">' + (hit ? '<b>Treffer:</b> Bei $a = \\mathrm{e} \\approx 2{,}71828$ ist die Steigung genau $1$ und $f\'(x) = f(x)$: Die Graphen von $f$ und $f\'$ liegen aufeinander.'
                        : 'Die Ableitung ist $f\'(x) = ' + texNum(la, 3) + ' \\cdot f(x)$, ein Vielfaches von $f$. Für welche Basis ist der Faktor genau $1$?') + '</p>';
            } else if (mode === 'graph') {
                const { A, b, c } = S, f = x => A * Math.exp(b * x) + c;
                p.view([-4, 4], [-6, 8]);
                const L = [{ fn: f, color: 'lambda', label: 'f' }, { pts: [[0, A + c]], color: 'white', r: 5 }];
                let html = '<p style="margin:0 0 6px">$f(x) = ' + (Math.abs(A) < 1e-12 ? '' : co(A, 1) + ex(b)) + (Math.abs(A) < 1e-12 ? texNum(c, 1) : sg(c, 1)) + '$';
                if (Math.abs(A) < 1e-12 || Math.abs(b) < 1e-12) {
                    html += ' · Mit $a = 0$ oder $b = 0$ ist $f$ konstant.</p>';
                } else {
                    L.push({ hline: c, color: 'cyan' });
                    const q = -c / A, z = q > 0 ? Math.log(q) / b : null;
                    if (z != null && Math.abs(z) < 4.2) L.push({ pts: [[z, 0]], color: 'phi', r: 5.5 });
                    const up = A * b > 0, side = b > 0 ? 'x \\to -\\infty' : 'x \\to +\\infty', other = b > 0 ? 'x \\to +\\infty' : 'x \\to -\\infty';
                    html += ' · $f\'(x) = ' + co(A * b, 2) + ex(b) + '$</p>' +
                        '<p style="margin:0 0 6px">Schnittpunkt mit der $y$-Achse: $(0 \\mid ' + texNum(A + c, 2) + ')$ · Nullstelle: ' +
                        (z != null ? '$' + co(A, 1) + ex(b) + ' = ' + texNum(-c, 1) + '$, also $x = \\dfrac{\\ln(' + texNum(q, 3) + ')}{' + texNum(b, 2) + '} \\approx ' + texNum(z, 3) + '$' : 'keine, denn $\\mathrm{e}^{bx} > 0$ kann nicht $' + texNum(q, 3) + '$ sein') + '</p>' +
                        '<p style="margin:0">Für $' + side + '$ geht $f(x) \\to ' + texNum(c, 1) + '$: waagerechte Asymptote $y = ' + texNum(c, 1) + '$. Für $' + other + '$ geht $f(x) \\to ' + (A > 0 ? '+' : '-') + '\\infty$. ' +
                        '$f$ ist überall streng monoton ' + (up ? 'steigend' : 'fallend') + ', weil $f\'(x)$ immer ' + (up ? 'positiv' : 'negativ') + ' ist.</p>';
                }
                p.draw(L);
                out.innerHTML = html;
            } else {
                const [n, t] = NS[S.ni], K = Math.pow(1 + 1 / n, n);
                p.view([0, 41], [1.8, 2.9]);
                const seq = []; for (let k = 1; k <= 40; k++) seq.push([k, Math.pow(1 + 1 / k, k)]);
                const L = [{ hline: Math.E, color: 'cyan' }, { pts: seq, color: 'violet', r: 3 }, { text: 'e', at: [38, Math.E], color: 'cyan', dy: -8 }];
                if (n <= 40) L.push({ pts: [[n, K]], color: 'lambda', r: 6 });
                p.draw(L);
                out.innerHTML = '<p style="margin:0 0 6px">Ein Euro, 100 % Zinsen im Jahr, ' + t + ' verzinst: ' + n.toLocaleString('de-DE') + '-mal $\\tfrac{100\\,\\%}{' + n + '}$, also $\\left(1 + \\tfrac{1}{' + n + '}\\right)^{' + n + '} \\approx ' + texNum(K, 6) + '$ €</p>' +
                    '<p style="margin:0">Je öfter verzinst wird, desto näher kommt das Guthaben an $\\mathrm{e} = 2{,}718281\\ldots$ heran, aber nie darüber: $\\lim\\limits_{n \\to \\infty} \\left(1 + \\tfrac1n\\right)^n = \\mathrm{e}$.</p>';
            }
            math(out);
        }
        build();
    });
})();
