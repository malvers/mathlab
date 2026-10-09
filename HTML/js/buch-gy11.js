/* buch-gy11.js — widgets of the book "Mathematik · Gymnasium 11" (Grundkurs) that the other modules do not have yet
 * (js/buch.js, js/buch-plot.js). The calculus, vector and stochastics widgets of the other books are used as they are.
 *   titelbildgy11  the cover: secants closing in on a tangent, Newton's tangents walking to a zero,
 *                  a plane pierced by a line, binomial bars
 *   kettenregel    f(x) = u(v(x)) from an outer and an inner function: f'(x) = u'(v(x)) · v'(x), tangent at a draggable point,
 *                  checked against the difference quotient
 *   matrixprodukt  A · B for chained matrices: click a cell of the product, its row and column light up; B · A for comparison
 *   drehmatrix     the rotation matrix D(φ) turns a figure about the origin; the image of one point is computed
 *   newton         Newton's method: tangent after tangent from a draggable start value, table of x_n, f(x_n), f'(x_n)
 * Looks: js/buch.css (section "Widgets of the Gymnasium 11 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;
    let uid = 0;

    /* ---------- the cover ---------- */
    W('titelbildgy11', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const f = x => 0.1 * (x + 2.5) * (x - 1.2) * (x - 4.6);
        const df = x => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
        const path = (g, a, b, n = 200) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(g(x)).toFixed(1); }
            return d;
        };
        const line = (x1, y1, x2, y2, c, w, op, dash) => '<line x1="' + X(x1).toFixed(1) + '" y1="' + Y(y1).toFixed(1) + '" x2="' + X(x2).toFixed(1) + '" y2="' + Y(y2).toFixed(1) +
            '" stroke="' + c + '" stroke-width="' + w + '" stroke-opacity="' + op + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const dot = (x, y, r = 6) => '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="' + r + '" fill="#fff"/><circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="' + 2 * r + '" fill="#fff" fill-opacity="0.12"/>';
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        let art = '';
        // the art lives in the band between the title (top) and the foot line (bottom): about −1.5 < y < 3
        const A0 = 0.8;                                     // height of the curve's zero axis on the cover
        const F = x => f(x) + A0;
        // binomial bars B(10; 0.35) on the right, quiet in the background
        const bin = k => { let c = 1; for (let i = 0; i < k; i++) c = c * (10 - i) / (i + 1); return c * Math.pow(0.35, k) * Math.pow(0.65, 10 - k); };
        for (let k = 0; k <= 10; k++) {
            const bx = 0.55 + k * 0.48, h = bin(k) / bin(3) * 0.75;
            art += '<rect x="' + X(bx).toFixed(1) + '" y="' + Y(-1.5 + h).toFixed(1) + '" width="' + (0.4 / 9 * Wd).toFixed(1) + '" height="' + (h / 13 * Ht).toFixed(1) +
                '" fill="#A0C85A" fill-opacity="' + (k === 3 ? 0.45 : 0.22) + '"/>';
        }
        // a plane (oblique parallelogram) pierced by a line, upper right
        const pl = [[2.55, 1.55], [4.1, 1.55], [4.55, 2.75], [3.0, 2.75]];
        const pd = 'M' + pl.map(p => X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('L') + 'Z';
        art += '<path d="' + pd + '" fill="#B8A4F2" fill-opacity="0.1" stroke="#B8A4F2" stroke-opacity="0.6" stroke-width="2"/>';
        const S = [3.55, 2.1];
        art += line(2.75, 3.2, S[0], S[1], '#B8A4F2', 2.6, 0.9) + line(S[0], S[1], 4.15, 1.25, '#B8A4F2', 2.6, 0.35, '5 7');
        // the curve and its zero axis
        art += line(-3, A0, 6, A0, '#7fd8ee', 1.4, 0.18);
        art += '<path d="' + path(F, -3, 5.45) + '" stroke="#F5C242" stroke-width="12" stroke-opacity="0.13" fill="none" stroke-linecap="round"/>' +
            '<path d="' + path(F, -3, 5.45) + '" stroke="#F5C242" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
        // secants through P closing in on the tangent
        const x0 = 0.25, y0 = F(x0), m = df(x0);
        [2.6, 1.7, 1.0, 0.5].forEach((h, i) => {
            const s = (F(x0 + h) - y0) / h;
            art += line(x0 - 1.5, y0 - 1.5 * s, x0 + 2.8, y0 + 2.8 * s, '#e8edf5', 1.6, 0.14 + 0.07 * i, '4 8');
        });
        art += line(x0 - 1.7, y0 - 1.7 * m, x0 + 3, y0 + 3 * m, '#7fd8ee', 3, 0.95);
        // Newton's tangents from x = 5.4 down to the zero 4.6
        let xn = 5.4;
        for (let i = 0; i < 3; i++) {
            const yn = F(xn), x1 = xn - f(xn) / df(xn);
            art += line(xn, A0, xn, yn, '#e8edf5', 1.4, 0.35, '3 6') + line(xn, yn, x1, A0, '#7fd8ee', 2, 0.6);
            art += '<circle cx="' + X(x1).toFixed(1) + '" cy="' + Y(A0).toFixed(1) + '" r="4" fill="#7fd8ee"/>';
            xn = x1;
        }
        art += dot(x0, y0) + dot(5.4, F(5.4), 5) + dot(S[0], S[1], 5);
        const id = 'tg11' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Sekanten, die sich einer Tangente nähern, Tangenten des Newton-Verfahrens auf dem Weg zu einer Nullstelle, eine Ebene, die von einer Geraden durchstoßen wird, und die Balken einer Binomialverteilung">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- chain rule ---------- */
    // outer functions u(z) and inner functions v(x); tex(v) puts the inner term into the outer one
    const OUTER = {
        q: { k: 'z²', tex: v => '\\left(' + v + '\\right)^2', u: z => z * z, du: z => 2 * z, dtex: v => '2\\left(' + v + '\\right)' },
        k: { k: 'z³', tex: v => '\\left(' + v + '\\right)^3', u: z => z ** 3, du: z => 3 * z * z, dtex: v => '3\\left(' + v + '\\right)^2' },
        w: { k: '√z', tex: v => '\\sqrt{' + v + '}', u: z => (z >= 0 ? Math.sqrt(z) : NaN), du: z => (z > 0 ? 1 / (2 * Math.sqrt(z)) : NaN), dtex: v => '\\dfrac{1}{2\\sqrt{' + v + '}}' },
        e: { k: 'eᶻ', tex: v => '\\mathrm{e}^{' + v + '}', u: Math.exp, du: Math.exp, dtex: v => '\\mathrm{e}^{' + v + '}' },
        s: { k: 'sin z', tex: v => '\\sin\\left(' + v + '\\right)', u: Math.sin, du: Math.cos, dtex: v => '\\cos\\left(' + v + '\\right)' },
        l: { k: 'ln z', tex: v => '\\ln\\left(' + v + '\\right)', u: z => (z > 0 ? Math.log(z) : NaN), du: z => (z > 0 ? 1 / z : NaN), dtex: v => '\\dfrac{1}{' + v + '}' }
    };
    const INNER = {
        a: { k: '2x + 1', tex: '2x + 1', v: x => 2 * x + 1, dv: () => 2, dtex: '2' },
        b: { k: 'x²', tex: 'x^2', v: x => x * x, dv: x => 2 * x, dtex: '2x' },
        c: { k: '3x − 1', tex: '3x - 1', v: x => 3 * x - 1, dv: () => 3, dtex: '3' },
        d: { k: '−0,5x', tex: '-0{,}5x', v: x => -0.5 * x, dv: () => -0.5, dtex: '\\left(-0{,}5\\right)' },
        e: { k: 'x² + 1', tex: 'x^2 + 1', v: x => x * x + 1, dv: x => 2 * x, dtex: '2x' }
    };
    W('kettenregel', function (box) {
        const S = { u: OUTER.s, v: INNER.a, x0: 0.5 };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(OUTER).map(k => [k, OUTER[k].k]), 's', v => { S.u = OUTER[v]; render(); }, 'Äußere Funktion u(z)');
        const ctl2 = div(box, 'b-ctrls');
        seg(ctl2, Object.keys(INNER).map(k => [k, INNER[k].k]), 'a', v => { S.v = INNER[v]; render(); }, 'Innere Funktion v(x)');
        ctl2.style.marginTop = '8px';
        const p = new Plot(div(box, ''), { x: [-3, 3], y: [-3, 4], height: 320, aria: 'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt' });
        const out = div(box, 'b-out');
        const hs = [{ x: S.x0, y: 0, color: 'lambda', fixY: true }];
        p.handles(hs, (i, x) => { S.x0 = Math.max(-2.9, Math.min(2.9, Math.round(x * 20) / 20)); render(); });
        const f = x => S.u.u(S.v.v(x));
        const df = x => S.u.du(S.v.v(x)) * S.v.dv(x);
        function render() {
            const x0 = S.x0, y0 = f(x0), m = df(x0), ok = isFinite(y0) && isFinite(m);
            hs[0].x = x0; hs[0].y = ok ? y0 : 0;
            // y range from the graph itself (clamped, so z³ or eᶻ do not flatten everything)
            const ys = [];
            for (let i = 0; i <= 120; i++) { const y = f(-3 + i / 20); if (isFinite(y)) ys.push(Math.max(-8, Math.min(12, y))); }
            const lo = ys.length ? Math.min(...ys, 0) : -3, hi = ys.length ? Math.max(...ys, 1) : 4, pad = (hi - lo) * 0.12 + 0.3;
            p.view([-3, 3], [lo - pad, hi + pad]);
            const L = [{ fn: f, color: 'lambda', label: 'f' }];
            if (ok) L.push({ fn: x => y0 + m * (x - x0), color: 'cyan', width: 1.8 }, { pts: [[x0, y0]], color: 'white' });
            p.draw(L);
            const vt = S.v.tex, z0 = S.v.v(x0);
            let h = '<p style="margin:0 0 6px">$f(x) = ' + S.u.tex(vt) + '$ &nbsp;·&nbsp; außen $u(z) = ' + S.u.tex('z').replace(/\\left\(z\\right\)/g, ' z').trim() +
                '$, innen $v(x) = ' + vt + '$</p>' +
                '<p style="margin:0 0 6px">$f\'(x) = u\'\\bigl(v(x)\\bigr) \\cdot v\'(x) = ' + S.u.dtex(vt) + ' \\cdot ' + S.v.dtex + '$</p>';
            if (!ok) h += '<p style="margin:0">An der Stelle $x_0 = ' + texNum(x0, 2) + '$ ist $v(x_0) = ' + texNum(z0, 3) + '$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.</p>';
            else {
                const dq = (f(x0 + 1e-4) - f(x0 - 1e-4)) / 2e-4;
                h += '<p style="margin:0">An der Stelle $x_0 = ' + texNum(x0, 2) + '$: $v(x_0) = ' + texNum(z0, 3) + '$, $u\'\\bigl(v(x_0)\\bigr) = ' + texNum(S.u.du(z0), 3) +
                    '$, $v\'(x_0) = ' + texNum(S.v.dv(x0), 3) + '$, also $f\'(x_0) \\approx ' + texNum(m, 3) + '$. Kontrolle mit dem Differenzenquotienten ($h = 0{,}0001$): $' + texNum(dq, 3) + '$.</p>';
            }
            out.innerHTML = h;
            math(out);
        }
        render();
    });

    /* ---------- product of chained matrices ---------- */
    W('matrixprodukt', function (box) {
        const SIZES = { a: [2, 2, 2], b: [2, 3, 1], c: [2, 3, 2], d: [3, 3, 1] };   // A is m×n, B is n×k
        const S = { size: 'c', order: 'ab', A: null, B: null, hot: [0, 0] };
        const rnd = () => Math.floor(Math.random() * 8) - 3;
        const make = (r, c) => Array.from({ length: r }, () => Array.from({ length: c }, rnd));
        const START = { A: [[1, 2, 0], [3, -1, 2]], B: [[2, 1], [0, 3], [1, -2]] };
        function fresh(first) {
            const [m, n, k] = SIZES[S.size];
            if (first) { S.A = START.A; S.B = START.B; } else { S.A = make(m, n); S.B = make(n, k); }
            S.hot = [0, 0];
        }
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['a', '(2,2) · (2,2)'], ['b', '(2,3) · (3,1)'], ['c', '(2,3) · (3,2)'], ['d', '(3,3) · (3,1)']], 'c', v => { S.size = v; S.order = 'ab'; fresh(); ord.querySelector('[data-v="ab"]').click(); render(); }, 'Typen der Matrizen');
        const ctl2 = div(box, 'b-ctrls');
        ctl2.style.marginTop = '8px';
        const ordBox = div(ctl2, '');
        let ord = null;
        seg(ordBox, [['ab', 'A · B'], ['ba', 'B · A']], 'ab', v => { S.order = v; S.hot = [0, 0]; render(); }, 'Reihenfolge');
        ord = ordBox.querySelector('.b-seg');
        const nb = div(ctl2, '', '<button type="button" class="b-btn">Neue Zahlen</button>');
        nb.querySelector('button').addEventListener('click', () => { fresh(); render(); });
        const stage = div(box, 'g11-mm b-scroll');
        const out = div(box, 'b-out');
        const mul = (P, Q) => P.map(row => Q[0].map((_, j) => row.reduce((s, a, t) => s + a * Q[t][j], 0)));
        const grid = (M, name, cls, hotRow, hotCol, click) => '<div class="g11-mm-term"><span class="g11-mm-name">' + name + '</span><div class="g11-mat ' + (cls || '') + '" style="grid-template-columns:repeat(' + M[0].length + ',auto)">' +
            M.map((row, i) => row.map((v, j) => '<span class="g11-cell' + (i === hotRow || j === hotCol ? ' g11-lit' : '') + (i === hotRow && j === hotCol ? ' g11-hot' : '') +
                '"' + (click ? ' data-ij="' + i + ',' + j + '" role="button" tabindex="0"' : '') + '>' + String(v).replace('-', '−') + '</span>').join('')).join('') + '</div></div>';
        function render() {
            const [P, Q, pn, qn] = S.order === 'ab' ? [S.A, S.B, 'A', 'B'] : [S.B, S.A, 'B', 'A'];
            const typ = M => '(' + M.length + ',' + M[0].length + ')';
            if (P[0].length !== Q.length) {
                stage.innerHTML = grid(P, pn) + '<span class="g11-mm-op">·</span>' + grid(Q, qn) + '<span class="g11-mm-op">=</span><span class="g11-mm-none">nicht definiert</span>';
                out.innerHTML = '<p style="margin:0">$' + pn + '$ hat den Typ $' + typ(P) + '$, $' + qn + '$ den Typ $' + typ(Q) + '$. ' + pn + ' hat ' + P[0].length + ' Spalten, ' + qn + ' aber ' + Q.length +
                    ' Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.</p>';
                math(out); return;
            }
            const C = mul(P, Q), [i, j] = [Math.min(S.hot[0], C.length - 1), Math.min(S.hot[1], C[0].length - 1)];
            stage.innerHTML = grid(P, pn, '', i, -1) + '<span class="g11-mm-op">·</span>' + grid(Q, qn, '', -1, j) + '<span class="g11-mm-op">=</span>' + grid(C, pn + ' · ' + qn, 'g11-mat-c', i, j, true);
            const terms = P[i].map((a, t) => texNum(a, 0) + ' \\cdot ' + (Q[t][j] < 0 ? '(' + texNum(Q[t][j], 0) + ')' : texNum(Q[t][j], 0)));
            let h = '<p style="margin:0 0 6px">Typen: $' + typ(P) + ' \\cdot ' + typ(Q) + ' = ' + typ(C) + '$ · Klick auf ein Feld des Ergebnisses.</p>' +
                '<p style="margin:0">Zeile ' + (i + 1) + ' von $' + pn + '$ mal Spalte ' + (j + 1) + ' von $' + qn + '$: $c_{' + (i + 1) + (j + 1) + '} = ' + terms.join(' + ') + ' = ' + texNum(C[i][j], 0) + '$</p>';
            // the other order for comparison: not defined, another type, or (for square matrices) usually other numbers
            const rev = (Q[0].length === P.length) ? mul(Q, P) : null;
            let cmp;
            if (!rev) cmp = '$' + qn + ' \\cdot ' + pn + '$ ist nicht definiert.';
            else if (rev.length !== C.length || rev[0].length !== C[0].length) cmp = '$' + qn + ' \\cdot ' + pn + '$ hat den Typ $' + typ(rev) + '$, ist also etwas ganz anderes.';
            else cmp = '$' + qn + ' \\cdot ' + pn + '$ ergibt ' + (rev.every((r, a) => r.every((v, b) => v === C[a][b])) ? 'hier zufällig dasselbe' : 'andere Zahlen') + '.';
            h += '<p style="margin:6px 0 0">Andersherum: ' + cmp + ' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.</p>';
            out.innerHTML = h;
            math(out);
        }
        stage.addEventListener('click', e => { const c = e.target.closest('[data-ij]'); if (!c) return; S.hot = c.dataset.ij.split(',').map(Number); render(); });
        stage.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const c = e.target.closest('[data-ij]'); if (!c) return; e.preventDefault(); S.hot = c.dataset.ij.split(',').map(Number); render(); });
        fresh(true);
        render();
    });

    /* ---------- rotation matrix ---------- */
    W('drehmatrix', function (box) {
        const FIG = [[1, 0], [3, 0], [3, 1], [2, 1], [2, 3], [1, 3]];         // an L-shaped flag: its turn is easy to see
        const P = [3, 1];
        let phi = 90;
        const p = new Plot(div(box, ''), { x: [-4.5, 4.5], y: [-4.5, 4.5], height: 340, equal: true, aria: 'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht' });
        const sl = div(box, '');
        range(sl, { label: 'Drehwinkel $\\varphi$', min: 0, max: 360, step: 15, value: phi, fmt: v => v + '°', onInput: v => { phi = v; render(); } });
        math(sl);
        const out = div(box, 'b-out');
        function render() {
            const r = phi * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
            const rot = ([x, y]) => [c * x - s * y, s * x + c * y];
            const img = FIG.map(rot), Pi = rot(P);
            // equal units keep the x-range and derive y: widen x on wide boxes so y always shows −4.5 … 4.5
            const cw = p.canvas.clientWidth, ch = p.canvas.clientHeight, xh = cw && ch ? Math.max(4.5, 4.5 * cw / ch) : 4.5;
            p.view([-xh, xh], [-4.5, 4.5]);
            const ring = pts => pts.map((q, i) => ({ seg: [q, pts[(i + 1) % pts.length]] }));
            p.draw([
                ...ring(FIG).map(o => Object.assign(o, { color: 'lambda', width: 2.2 })),
                ...ring(img).map(o => Object.assign(o, { color: 'cyan', width: 2.2 })),
                { seg: [[0, 0], P], color: 'dim', dash: true }, { seg: [[0, 0], Pi], color: 'dim', dash: true },
                { pts: [P], color: 'lambda' }, { pts: [Pi], color: 'cyan' },
                { text: 'P', at: [P[0] + 0.25, P[1] + 0.3], color: 'lambda' }, { text: 'P′', at: [Pi[0] + 0.25, Pi[1] + 0.3], color: 'cyan' }
            ]);
            const n = v => texNum(Math.abs(v) < 1e-9 ? 0 : v, 3);
            const lin = (a, b) => n(a) + ' \\cdot 3 ' + (b < -1e-9 ? '-' : '+') + ' ' + n(Math.abs(b)) + ' \\cdot 1';   // a·3 + b·1 with one sign
            out.innerHTML = '<p style="margin:0 0 6px">$D = \\begin{pmatrix} \\cos\\varphi & -\\sin\\varphi \\\\ \\sin\\varphi & \\cos\\varphi \\end{pmatrix} = \\begin{pmatrix} ' + n(c) + ' & ' + n(-s) + ' \\\\ ' + n(s) + ' & ' + n(c) + ' \\end{pmatrix}$</p>' +
                '<p style="margin:0">$D \\cdot \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} ' + lin(c, -s) + ' \\\\ ' + lin(s, c) + ' \\end{pmatrix} = \\begin{pmatrix} ' + n(Pi[0]) + ' \\\\ ' + n(Pi[1]) + ' \\end{pmatrix}$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.</p>';
            math(out);
        }
        render();
        // the x-range depends on the box's aspect ratio: draw again when the box gets its real size or changes it
        if (window.ResizeObserver) { let lw = 0; new ResizeObserver(() => { const w = p.canvas.clientWidth; if (w && w !== lw) { lw = w; render(); } }).observe(p.canvas); }
    });

    /* ---------- Newton's method ---------- */
    W('newton', function (box) {
        const F = {
            a: { k: 'x² − 2', tex: 'x^2 - 2', dtex: '2x', f: x => x * x - 2, d: x => 2 * x, x0: 1, v: [-0.5, 3, -2.5, 6] },
            b: { k: 'x³ − x − 1', tex: 'x^3 - x - 1', dtex: '3x^2 - 1', f: x => x ** 3 - x - 1, d: x => 3 * x * x - 1, x0: 1, v: [-0.5, 2.2, -2, 5] },
            c: { k: 'eˣ + x − 3', tex: '\\mathrm{e}^x + x - 3', dtex: '\\mathrm{e}^x + 1', f: x => Math.exp(x) + x - 3, d: x => Math.exp(x) + 1, x0: 1, v: [-1, 2, -4, 6] },
            d: { k: 'cos x − x', tex: '\\cos x - x', dtex: '-\\sin x - 1', f: x => Math.cos(x) - x, d: x => -Math.sin(x) - 1, x0: 1, v: [-1, 2, -2.5, 2] },
            e: { k: 'x³ − 2x + 2', tex: 'x^3 - 2x + 2', dtex: '3x^2 - 2', f: x => x ** 3 - 2 * x + 2, d: x => 3 * x * x - 2, x0: 0, v: [-2.5, 2, -3, 5] }
        };
        let cur = F.a, xs = [cur.x0];
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(F).map(k => [k, F[k].k]), 'a', v => { cur = F[v]; xs = [cur.x0]; note = ''; step(); step(); render(); }, 'Funktion');
        const p = new Plot(div(box, ''), { x: [-0.5, 3], y: [-2.5, 6], height: 320, aria: 'Newton-Verfahren: Tangenten führen zur Nullstelle' });
        const hs = [{ x: xs[0], y: 0, color: 'white', fixY: true }];
        p.handles(hs, (i, x) => { xs = [Math.round(x * 20) / 20]; render(); });
        const acts = div(box, 'b-ctrls', '<button type="button" class="b-btn b-go" data-s>Nächster Schritt</button><button type="button" class="b-btn" data-s5>5 Schritte</button><button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>');
        acts.style.marginTop = '10px';
        const out = div(box, 'b-table-wrap b-scroll');
        let note = '';
        function step() {
            const x = xs[xs.length - 1], d = cur.d(x);
            if (Math.abs(d) < 1e-12) { note = 'Bei $x_{' + (xs.length - 1) + '}$ ist $f\'(x) = 0$: Die Tangente ist waagerecht, das Verfahren bricht ab.'; return false; }
            const nx = x - cur.f(x) / d;
            if (!isFinite(nx) || Math.abs(nx) > 1e6) { note = 'Die Folge läuft weg: anderer Startwert.'; return false; }
            xs.push(nx); return true;
        }
        function render() {
            hs[0].x = xs[0];
            p.view([cur.v[0], cur.v[1]], [cur.v[2], cur.v[3]]);
            const L = [{ hline: 0, color: 'dim' }, { fn: cur.f, color: 'lambda', label: 'f' }];
            for (let i = 0; i + 1 < xs.length; i++) {
                const x = xs[i], y = cur.f(x);
                L.push({ seg: [[x, 0], [x, y]], color: 'dim', dash: true }, { seg: [[x, y], [xs[i + 1], 0]], color: 'cyan', width: 1.8 });
            }
            L.push({ pts: xs.slice(1).map(x => [x, 0]), color: 'cyan' });
            p.draw(L);
            const m = (v, d) => fmt(v, d).replace('-', '−');
            const rows = xs.map((x, i) => '<tr><td>' + i + '</td><td class="b-hot">' + m(x, 8) + '</td><td>' + m(cur.f(x), 8) + '</td><td>' + m(cur.d(x), 6) + '</td></tr>').join('');
            out.innerHTML = '<p style="margin:0 0 8px">$f(x) = ' + cur.tex + '$ und $f\'(x) = ' + cur.dtex + '$. Iteration: $x_{n+1} = x_n - \\dfrac{f(x_n)}{f\'(x_n)}$. Den Startwert verschiebst du mit dem weißen Punkt auf der $x$-Achse.</p>' +
                '<table class="b-table"><thead><tr><th>$n$</th><th>$x_n$</th><th>$f(x_n)$</th><th>$f\'(x_n)$</th></tr></thead><tbody>' + rows + '</tbody></table>' +
                (note ? '<p style="margin:8px 0 0">' + note + '</p>' : '');
            math(out);
        }
        acts.addEventListener('click', e => {
            const t = e.target.closest('button'); if (!t) return;
            note = '';
            if (t.hasAttribute('data-s')) step();
            else if (t.hasAttribute('data-s5')) { for (let i = 0; i < 5; i++) if (!step()) break; }
            else xs = [cur.x0];
            render();
        });
        step(); step();                                     // start with two tangents drawn, so the idea shows at once (and in print)
        render();
    });
})();
