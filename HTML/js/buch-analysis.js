/* buch-analysis.js — widgets for the chapters on differential calculus (Lernbereich 2, Klasse 12) of the textbook
 * (js/buch.js, js/buch-plot.js).
 *   titelbild12   the cover of book 12: a curve with tangent and derivative, binomial bars, a vector
 *   grenzwert     approach a point or infinity step by step: table of values, graph, asymptotes, a hole
 *   sekante       secant through P and Q, Q slides towards P: difference quotient → derivative
 *   ableitungsgraph  drag P along f, its slope draws the graph of f' point by point
 *   kurve         f(x) = ax³ + bx² + cx + d: monotony, extrema and inflection point with f' and f''
 *   tangente      tangent and normal at a draggable point, both equations
 *   ableiten      derivative trainer: random terms, type f'(x), checked numerically
 *   steckbrief    a function from conditions: draggable points, the system of equations and its solution
 *   optimieren    box from a sheet, tin can, fence at a wall: target function, slider, maximum by f' = 0
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
    W('titelbild12', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const path = (f, a, b, n = 160) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x); d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); }
            return d;
        };
        const f = x => 0.1 * (x + 2.2) * (x - 1) * (x - 4.8) + 1.4;
        const fd = x => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
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
        let art = '';
        const glow = (d, col, w, dash) => '<path d="' + d + '" stroke="' + col + '" stroke-width="12" stroke-opacity="0.13" fill="none" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        art += glow(path(x => fd(x) * 0.8 - 0.6, -3, 6), '#B8A4F2', 2.4, '7 9');                    // the derivative, dashed
        art += glow(path(f, -3, 6), '#F5C242', 3.4);                                                  // the curve
        const x0 = 3.6, m = fd(x0);
        art += glow(path(x => f(x0) + m * (x - x0), 1.6, 6), '#7fd8ee', 2.6);                         // tangent
        // the vector: an arrow up and to the right
        const ax = X(-2.4), ay = Y(-0.6), bx = X(0.2), by = Y(2.6), ang = Math.atan2(by - ay, bx - ax);
        const hd = (s, t) => (bx + 22 * Math.cos(ang + s)).toFixed(1) + ',' + (by + 22 * Math.sin(ang + s)).toFixed(1);
        art += '<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by + '" stroke="#e682be" stroke-width="3.2" stroke-linecap="round"/>' +
            '<polygon points="' + bx + ',' + by + ' ' + hd(Math.PI - 0.38) + ' ' + hd(Math.PI + 0.38) + '" fill="#e682be"/>';
        // extrema and the point of tangency
        zeros(fd, -3, 6).concat([x0]).forEach(x => { art += '<circle cx="' + X(x) + '" cy="' + Y(f(x)) + '" r="6" fill="#fff"/><circle cx="' + X(x) + '" cy="' + Y(f(x)) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Kurve mit Tangente und Ableitung, Binomialverteilung und ein Vektor">' +
            '<defs><linearGradient id="tb12-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.97" stop-color="#fff" stop-opacity="0.2"/></linearGradient>' +
            '<mask id="tb12-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tb12-fade)"/></mask></defs>' +
            '<g mask="url(#tb12-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' +
            '<g fill="#A0C85A" fill-opacity="0.32" stroke="#A0C85A" stroke-opacity="0.55" stroke-width="1.2">' + bars + '</g>' + art + '</g></svg>';
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
        let mode = 'ext', mW = -1;
        const ctl = div(box, 'b-ctrls');
        segBox(ctl, Object.keys(MODES).map(k => [k, MODES[k].k]), mode, v => { mode = v; setup(); }, 'Bedingungen');
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
})();
