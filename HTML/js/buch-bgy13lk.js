/* buch-bgy13lk.js — widgets of the book "Mathematik · Berufliches Gymnasium 13 · Leistungskurs" that the other modules do not have
 * (js/buch.js, js/buch-plot.js). Calculus, stochastics, vector and matrix widgets of the other books are used as they are.
 *   titelbildbgy13lk  cover art: trapezoids under a curve, the bell curve with its rejection region, a population cycle egg → larva → beetle
 *   matrixinverse     the Gauß-Jordan scheme (A | E) step by step with exact fractions up to (E | A⁻¹), the check A · A⁻¹ = E,
 *                     a system A · x = b solved with the inverse; a singular matrix stops with the reason
 *   leontief          an economy of three sectors: technology matrix A, final demand y on sliders, x = (E − A)⁻¹ · y,
 *                     the input-output table that belongs to it and the Leontief inverse
 *   uebergang         a population model x(n+1) = U · x(n) with its transition graph and the course of the three stages:
 *                     beetles (eggs → larvae → beetles, a cycle when a · b · f = 1) or customers moving between three
 *                     providers (a stochastic matrix, its powers approaching the limit matrix, the fixed vector)
 *   biquadratisch     x⁴ + p·x² + q = 0 by substitution z = x²: the parabola in z next to the quartic in x, each z > 0 gives ±√z,
 *                     z = 0 gives 0, z < 0 gives nothing; p and q on sliders, the number of solutions with the reason
 * Looks: js/buch.css (shared classes only, colours of the SVG drawings as inline styles so the colour schemes translate them).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { Frac, fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;
    let uid = 0;
    const ROM = ['I', 'II', 'III'];
    // matrices and vectors in TeX (numbers with decimal comma)
    const tm = (M, d = 3) => '\\begin{pmatrix} ' + M.map(r => r.map(v => texNum(v, d)).join(' & ')).join(' \\\\ ') + ' \\end{pmatrix}';
    const tv = (v, d = 3) => '\\begin{pmatrix} ' + v.map(x => texNum(x, d)).join(' \\\\ ') + ' \\end{pmatrix}';
    const mmul = (P, Q) => P.map(row => Q[0].map((_, j) => row.reduce((s, a, t) => s + a * Q[t][j], 0)));
    const mvec = (P, v) => P.map(row => row.reduce((s, a, t) => s + a * v[t], 0));
    const ident = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    // the inverse of a small matrix with partial pivoting (numbers), null if it is singular
    function inverse(M) {
        const n = M.length, A = M.map((r, i) => r.concat(ident(n)[i]));
        for (let j = 0; j < n; j++) {
            let p = j;
            for (let i = j + 1; i < n; i++) if (Math.abs(A[i][j]) > Math.abs(A[p][j])) p = i;
            if (Math.abs(A[p][j]) < 1e-12) return null;
            [A[j], A[p]] = [A[p], A[j]];
            const piv = A[j][j];
            A[j] = A[j].map(v => v / piv);
            for (let i = 0; i < n; i++) if (i !== j) { const f = A[i][j]; A[i] = A[i].map((v, k) => v - f * A[j][k]); }
        }
        return A.map(r => r.slice(n));
    }

    /* ---------- cover art ---------- */
    W('titelbildbgy13lk', function (box) {
        const Wd = 600, Ht = 850, n1 = v => v.toFixed(1);
        let grid = '';
        for (let x = 0; x <= Wd; x += 66.7) grid += '<line x1="' + n1(x) + '" y1="0" x2="' + n1(x) + '" y2="' + Ht + '" />';
        for (let y = 0; y <= Ht; y += 65.4) grid += '<line x1="0" y1="' + n1(y) + '" x2="' + Wd + '" y2="' + n1(y) + '" />';
        // middle: a curve with trapezoids under it (numerical integration) and a dashed second curve that closes an area
        const X = t => 60 + 480 * t, base = 600, f = t => base - (60 + 115 * Math.exp(-((t - 0.36) ** 2) / 0.06) + 50 * t * t), g = t => base - (32 + 42 * t);
        let strips = '';
        const n = 8;
        for (let i = 0; i < n; i++) {
            const a = i / n, b = (i + 1) / n;
            strips += '<path d="M' + n1(X(a)) + ' ' + base + 'L' + n1(X(a)) + ' ' + n1(f(a)) + 'L' + n1(X(b)) + ' ' + n1(f(b)) + 'L' + n1(X(b)) + ' ' + base + 'Z"/>';
        }
        let curve = '', lower = '';
        for (let i = 0; i <= 120; i++) { const t = i / 120; curve += (i ? 'L' : 'M') + n1(X(t)) + ' ' + n1(f(t)); lower += (i ? 'L' : 'M') + n1(X(t)) + ' ' + n1(g(t)); }
        let mid = '<g fill="#F5C242" fill-opacity="0.12" stroke="#F5C242" stroke-opacity="0.5" stroke-width="1.2">' + strips + '</g>';
        mid += '<path d="' + lower + '" stroke="#7fd8ee" stroke-opacity="0.7" stroke-width="2" fill="none" stroke-dasharray="7 6"/>';
        mid += '<path d="' + curve + '" stroke="#F5C242" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#tbb13lk-glow)"/>';
        mid += '<line x1="40" y1="' + base + '" x2="566" y2="' + base + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2"/>';
        // lower left: the bell curve, the right tail red as a rejection region
        const bx = z => 130 + z * 48, by = 770, sc = 260;
        const dens = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
        let bell = '', tail = 'M' + n1(bx(1.65)) + ' ' + by;
        for (let i = 0; i <= 100; i++) { const z = -2.5 + 5 * i / 100; bell += (i ? 'L' : 'M') + n1(bx(z)) + ' ' + n1(by - dens(z) * sc); }
        for (let i = 0; i <= 30; i++) { const z = 1.65 + 0.85 * i / 30; tail += 'L' + n1(bx(z)) + ' ' + n1(by - dens(z) * sc); }
        tail += 'L' + n1(bx(2.5)) + ' ' + by + 'Z';
        let stat = '<path d="' + bell + 'L' + n1(bx(2.5)) + ' ' + by + 'L' + n1(bx(-2.5)) + ' ' + by + 'Z" fill="#A0C85A" fill-opacity="0.16"/>';
        stat += '<path d="' + tail + '" fill="#e2665a" fill-opacity="0.75"/>';
        stat += '<path d="' + bell + '" stroke="#A0C85A" stroke-width="2.6" fill="none" filter="url(#tbb13lk-glow)"/>';
        stat += '<line x1="' + n1(bx(1.65)) + '" y1="' + (by - 104) + '" x2="' + n1(bx(1.65)) + '" y2="' + by + '" stroke="#e2665a" stroke-width="1.6" stroke-dasharray="4 4"/>';
        stat += '<line x1="' + n1(bx(-2.6)) + '" y1="' + (by + 0.5) + '" x2="' + n1(bx(2.6)) + '" y2="' + (by + 0.5) + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2"/>';
        // lower right: a population cycle egg → larva → beetle → egg (Wahlpflicht 2), three nodes on a triangle with curved arrows
        const NODES = [[455, 652], [532, 742], [378, 742]], COL = ['#F5C242', '#7fd8ee', '#B8A4F2'], R = 24;
        let cyc = '';
        for (let i = 0; i < 3; i++) {
            const [x1, y1] = NODES[i], [x2, y2] = NODES[(i + 1) % 3], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
            const ux = dx / L, uy = dy / L, bend = 22, mx = (x1 + x2) / 2 + uy * bend, my = (y1 + y2) / 2 - ux * bend;
            cyc += '<path d="M' + n1(x1 + ux * (R + 4)) + ' ' + n1(y1 + uy * (R + 4)) + ' Q' + n1(mx) + ' ' + n1(my) + ' ' + n1(x2 - ux * (R + 10)) + ' ' + n1(y2 - uy * (R + 10)) +
                '" fill="none" stroke="#e682be" stroke-width="2.4" marker-end="url(#tbb13lk-arr)"/>';
        }
        NODES.forEach(([x, y], i) => { cyc += '<circle cx="' + x + '" cy="' + y + '" r="' + R + '" fill="' + COL[i] + '" fill-opacity="0.18" stroke="' + COL[i] + '" stroke-width="2.4"/>'; });
        // a little beetle in the beetle node, an egg and a larva as plain shapes
        cyc += '<ellipse cx="455" cy="652" rx="7" ry="10" fill="#F5C242" fill-opacity="0.85"/>';
        cyc += '<path d="M518 745 q7 -9 14 0 t14 0" stroke="#7fd8ee" stroke-width="5" fill="none" stroke-linecap="round"/>';
        cyc += '<ellipse cx="378" cy="745" rx="9" ry="12" fill="#B8A4F2" fill-opacity="0.9"/><line x1="378" y1="733" x2="378" y2="757" stroke="#2a2440" stroke-width="1.4"/>';
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer">' +
            '<defs><linearGradient id="tbb13lk-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="tbb13lk-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tbb13lk-fade)"/></mask>' +
            '<marker id="tbb13lk-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#e682be"/></marker>' +
            '<filter id="tbb13lk-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Wd + '" height="' + Ht + '"><feGaussianBlur stdDeviation="5" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g mask="url(#tbb13lk-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' + mid + stat + '</g>' + cyc + '</svg>';
    });
    /* ---------- the inverse matrix with the Gauß-Jordan scheme (A | E) ---------- */
    const INV = {
        zwei: { A: [[2, 1], [5, 3]], b: [4, 9] },
        drei: { A: [[1, 0, 2], [2, 1, 3], [0, 1, 1]], b: [5, 9, 2] },
        singulaer: { A: [[1, 2, 1], [2, 3, 4], [3, 5, 5]], b: [1, 2, 3] }
    };
    W('matrixinverse', function (box) {
        const F = (n, d = 1) => new Frac(n, d);
        const fdiv = (a, b) => a.mul(F(b.d, b.n));
        const ftex = f => (f.n < 0 ? '-' : '') + (f.d === 1 ? String(Math.abs(f.n)) : '\\tfrac{' + Math.abs(f.n) + '}{' + f.d + '}');
        let key = 'drei', steps = [], at = 0;
        seg(box, [['zwei', '2 × 2'], ['drei', '3 × 3'], ['singulaer', 'nicht invertierbar']], key, v => { key = v; build(); }, 'Beispielmatrix');
        const stage = div(box, 'b-out');
        stage.style.overflowX = 'auto';
        const ctr = div(box, 'b-ctrls', '<button type="button" class="b-btn b-go" data-s>Nächster Schritt</button>' +
            '<button type="button" class="b-btn" data-all>Alle Schritte</button><button type="button" class="b-btn b-hintbtn" data-r>Von vorn</button>');
        ctr.style.margin = '12px 0';
        const out = div(box, 'b-out');
        function scheme(M, n) {
            return '\\left(\\begin{array}{' + 'c'.repeat(n) + '|' + 'c'.repeat(n) + '} ' + M.map(r => r.map(ftex).join(' & ')).join(' \\\\ ') + ' \\end{array}\\right)';
        }
        // all steps of the elimination in advance: per column a swap if needed, the pivot to 1, the other rows to 0
        function build() {
            const A = INV[key].A, n = A.length;
            let M = A.map((r, i) => r.map(v => F(v)).concat(ident(n)[i].map(v => F(v))));
            const copy = X => X.map(r => r.slice());
            steps = [{ M: copy(M), text: 'Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.' }];
            let ok = true;
            for (let j = 0; j < n && ok; j++) {
                if (M[j][j].n === 0) {
                    const k = M.findIndex((r, i) => i > j && r[j].n !== 0);
                    if (k < 0) { ok = false; break; }
                    [M[j], M[k]] = [M[k], M[j]];
                    steps.push({ M: copy(M), text: 'Zeilen ' + ROM[j] + ' und ' + ROM[k] + ' tauschen, damit in Spalte ' + (j + 1) + ' oben keine Null steht.' });
                }
                const p = M[j][j];
                if (!(p.n === 1 && p.d === 1)) {
                    M[j] = M[j].map(v => fdiv(v, p));
                    steps.push({ M: copy(M), text: 'Zeile ' + ROM[j] + ' durch $' + ftex(p) + '$ teilen: Das Pivotelement wird 1.' });
                }
                const ops = [];
                for (let i = 0; i < n; i++) {
                    if (i === j || M[i][j].n === 0) continue;
                    const f = M[i][j];
                    M[i] = M[i].map((v, k) => v.sub(f.mul(M[j][k])));
                    const af = F(Math.abs(f.n), f.d);
                    ops.push(ROM[i] + (f.n > 0 ? ' - ' : ' + ') + (af.n === 1 && af.d === 1 ? '' : ftex(af) + ' \\cdot ') + ROM[j]);
                }
                if (ops.length) steps.push({ M: copy(M), text: 'In Spalte ' + (j + 1) + ' Nullen erzeugen: $' + ops.join(',\\quad ').replace(/\b(I{1,3})\b/g, '\\text{$1}') + '$' });
                // a row that is zero on the left: no inverse
                const z = M.findIndex(r => r.slice(0, n).every(v => v.n === 0));
                if (z >= 0) { ok = false; }
            }
            if (!ok) steps.push({ M: copy(M), text: 'Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr. <b>$A$ ist nicht invertierbar.</b>', end: 'singular' });
            else steps.push({ M: copy(M), text: 'Links steht $E$, rechts steht $A^{-1}$.', end: 'ok' });
            at = 0; show();
        }
        function show() {
            const s = steps[at], n = INV[key].A.length;
            stage.innerHTML = '<p style="margin:0 0 8px">Schritt ' + at + ' von ' + (steps.length - 1) + ': ' + s.text + '</p>$$' + scheme(s.M, n) + '$$';
            let r = '';
            if (s.end === 'ok') {
                const A = INV[key].A, Ainv = s.M.map(row => row.slice(n)), b = INV[key].b;
                const x = Ainv.map(row => row.reduce((acc, v, k) => acc.add(v.mul(F(b[k]))), F(0)));
                const ftm = X => '\\begin{pmatrix} ' + X.map(row => row.map(ftex).join(' & ')).join(' \\\\ ') + ' \\end{pmatrix}';
                r = '<p style="margin:0 0 6px">$A^{-1} = ' + ftm(Ainv) + '$. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: $' +
                    A[0].map((v, k) => texNum(v, 0) + ' \\cdot ' + (Ainv[k][0].n < 0 ? '\\left(' + ftex(Ainv[k][0]) + '\\right)' : ftex(Ainv[k][0]))).join(' + ') + ' = 1$ ✓</p>' +
                    '<p style="margin:0">Das Gleichungssystem $A \\cdot \\vec{x} = ' + tv(b, 0) + '$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ' + '\\begin{pmatrix} ' + x.map(ftex).join(' \\\\ ') + ' \\end{pmatrix}$.</p>';
            } else if (s.end === 'singular') {
                r = '<p style="margin:0">Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.</p>';
            } else r = '<p style="margin:0">Weiter mit „Nächster Schritt“.</p>';
            out.innerHTML = r;
            math(stage); math(out);
        }
        box.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b || b.closest('.b-seg')) return;
            if (b.hasAttribute('data-s')) at = Math.min(steps.length - 1, at + 1);
            else if (b.hasAttribute('data-all')) at = steps.length - 1;
            else if (b.hasAttribute('data-r')) at = 0;
            show();
        });
        build();
    });

    /* ---------- the Leontief model of three sectors ---------- */
    const LEO = {
        names: ['Landwirtschaft', 'Industrie', 'Dienstleistung'], short: ['L', 'I', 'D'],
        A: [[0.1, 0.2, 0.1], [0.3, 0.2, 0.2], [0.1, 0.3, 0.2]],
        y: [100, 200, 150]
    };
    W('leontief', function (box) {
        const y = LEO.y.slice(), n = 3, EA = LEO.A.map((r, i) => r.map((v, j) => (i === j ? 1 : 0) - v)), L = inverse(EA);
        const sl = div(box, '');
        LEO.names.forEach((name, i) => range(sl, { label: 'Endnachfrage ' + name + ' $y_' + (i + 1) + '$', min: 0, max: 400, step: 10, value: y[i], fmt: v => fmt(v, 0) + ' ME', onInput: v => { y[i] = v; render(); } }));
        math(sl);
        const tab = div(box, 'b-table-wrap');
        const out = div(box, 'b-out');
        function render() {
            const x = mvec(L, y), X = LEO.A.map(r => r.map((a, j) => a * x[j]));
            let h = '<table class="b-table"><thead><tr><th></th>' + LEO.short.map(s => '<th>' + s + '</th>').join('') + '<th>Markt</th><th>Summe</th></tr></thead><tbody>';
            for (let i = 0; i < n; i++) {
                h += '<tr><th>' + LEO.short[i] + '</th>' + X[i].map(v => '<td>' + fmt(v, 0) + '</td>').join('') + '<td><b>' + fmt(y[i], 0) + '</b></td><td><b>' + fmt(x[i], 0) + '</b></td></tr>';
            }
            tab.innerHTML = '<p class="b-help" style="margin:0 0 6px">' + 'Zeile: liefernder Sektor, Spalte: empfangender Sektor. ' + LEO.names.map((nm, i) => LEO.short[i] + ' = ' + nm).join(', ') + '. Summe = Produktion, alle Angaben gerundet in ME.</p>' + h + '</tbody></table>';
            out.innerHTML = '<p style="margin:0 0 6px">Technologiematrix $A = ' + tm(LEO.A, 2) + '$, Leontief-Inverse $(E - A)^{-1} \\approx ' + tm(L, 3) + '$.</p>' +
                '<p style="margin:0">$\\vec{x} = (E - A)^{-1} \\cdot \\vec{y} \\approx ' + tv(x, 1) + '$. Jede Zeile der Tabelle geht auf: Lieferungen an die drei Sektoren plus Endnachfrage ergeben die Produktion. ' +
                'Insgesamt werden ' + fmt(x.reduce((s, v) => s + v, 0), 0) + ' ME erzeugt, damit ' + fmt(y.reduce((s, v) => s + v, 0), 0) + ' ME den Markt erreichen.</p>';
            math(out);
        }
        render();
    });

    /* ---------- population models: x(n+1) = U · x(n) ---------- */
    const UEB = {
        kaefer: { names: ['Eier', 'Larven', 'Käfer'], short: ['Eier', 'Larven', 'Käfer'], cols: ['#F5C242', '#7fd8ee', '#B8A4F2'], x0: [800, 200, 50] },
        kunden: { names: ['Anbieter A', 'Anbieter B', 'Anbieter C'], short: ['A', 'B', 'C'], cols: ['#F5C242', '#7fd8ee', '#A0C85A'], x0: [5000, 3000, 2000],
            U: [[0.8, 0.1, 0.2], [0.1, 0.7, 0.2], [0.1, 0.2, 0.6]] }
    };
    W('uebergang', function (box) {
        let mode = box.dataset.mode === 'kunden' ? 'kunden' : 'kaefer', f = 8, steps = 0;
        const a = 0.25, b = 0.5;
        const top = div(box, '');
        const segm = seg(top, [['kaefer', 'Käferpopulation'], ['kunden', 'Kundenwanderung']], mode, v => { mode = v; steps = 0; setup(); }, 'Modell');
        const sl = div(top, '');
        const fr = range(sl, { label: 'Eier je Käfer $f$', min: 4, max: 12, step: 1, value: f, fmt: v => fmt(v, 0), onInput: v => { f = v; render(); } });
        math(sl);
        const two = div(box, 'b-grid2');
        const g = div(two, 'b-svgbox');
        // the graph at most 340 px wide: in print the two columns stack and a full-width graph took the whole page,
        // the widget then broke and left its last line alone on the next one (Doc, 28.10.2026: "Witwen und Waisen")
        g.style.maxWidth = '340px';
        g.style.margin = '0 auto';
        const pbox = div(two, '');
        const p = new Plot(pbox, { x: [0, 12], y: [0, 1000], height: 260, xLabel: 'n', yLabel: '', aria: 'Verlauf der drei Klassen über die Schritte n' });
        const ctr = div(box, 'b-ctrls', '<button type="button" class="b-btn b-go" data-s>1 Schritt</button><button type="button" class="b-btn" data-s10>10 Schritte</button>' +
            '<button type="button" class="b-btn b-hintbtn" data-r>Zurück auf Start</button>');
        ctr.style.margin = '12px 0';
        const out = div(box, 'b-out');
        const id = 'b13u' + (++uid);
        const U = () => mode === 'kunden' ? UEB.kunden.U : [[0, 0, f], [a, 0, 0], [0, b, 0]];
        function setup() { segm.set(mode); sl.style.display = mode === 'kaefer' ? '' : 'none'; render(); }
        function graph(M, names, cols) {
            const P = [[160, 66], [262, 216], [58, 216]], R = 30;
            let s = '<svg viewBox="0 0 320 290" role="img" aria-label="Übergangsgraph mit drei Zuständen und den Übergangsanteilen an den Pfeilen">' +
                '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:#e682be"/></marker></defs>';
            for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
                const v = M[i][j]; if (!v) continue;                     // column j = from, row i = to
                const [x1, y1] = P[j], [x2, y2] = P[i];
                const lab = '<text x="LX" y="LY" text-anchor="middle" style="fill:#e8edf5;font:600 14px Raleway,sans-serif">' + fmt(v, 2) + '</text>';
                if (i === j) {                                           // a loop above or below the node
                    const up = j === 0 ? -1 : 1, cx = x1, cy = y1 + up * (R + 16);
                    s += '<path d="M' + (x1 - 14) + ' ' + (y1 + up * (R - 6)) + ' C' + (x1 - 34) + ' ' + (cy + up * 18) + ' ' + (x1 + 34) + ' ' + (cy + up * 18) + ' ' + (x1 + 14) + ' ' + (y1 + up * (R - 4)) +
                        '" style="fill:none;stroke:#e682be;stroke-width:1.8" marker-end="url(#' + id + ')"/>';
                    s += lab.replace('LX', cx).replace('LY', cy + up * 14 + 5);
                    continue;
                }
                const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, bend = 18;
                const mx = (x1 + x2) / 2 + uy * bend, my = (y1 + y2) / 2 - ux * bend;
                s += '<path d="M' + (x1 + ux * R).toFixed(1) + ' ' + (y1 + uy * R).toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + (x2 - ux * (R + 3)).toFixed(1) + ' ' + (y2 - uy * (R + 3)).toFixed(1) +
                    '" style="fill:none;stroke:#e682be;stroke-width:1.8" marker-end="url(#' + id + ')"/>';
                s += lab.replace('LX', (mx + uy * 6).toFixed(1)).replace('LY', (my - ux * 6 + 5).toFixed(1));
            }
            P.forEach(([x, y], i) => {
                s += '<circle cx="' + x + '" cy="' + y + '" r="' + R + '" style="fill:' + cols[i] + ';fill-opacity:0.18;stroke:' + cols[i] + ';stroke-width:2.2"/>' +
                    '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" style="fill:#e8edf5;font:700 13px Raleway,sans-serif">' + names[i] + '</text>';
            });
            return s + '</svg>';
        }
        function render() {
            const M = U(), C = UEB[mode], N = Math.max(12, steps);
            const xs = [C.x0.slice()];
            for (let k = 0; k < N; k++) xs.push(mvec(M, xs[k]));
            g.innerHTML = graph(M, C.short, C.cols);
            const ymax = Math.max(...xs.flat()) * 1.1;
            p.view([0, N], [0, ymax]);
            const layers = [];
            for (let i = 0; i < 3; i++) {
                for (let k = 0; k < N; k++) layers.push({ seg: [[k, xs[k][i]], [k + 1, xs[k + 1][i]]], color: C.cols[i], width: 2 });
                layers.push({ pts: xs.slice(0, steps + 1).map((v, k) => [k, v[i]]), color: C.cols[i], r: 3.5 });
            }
            layers.push({ vline: steps, color: 'dim' });
            p.draw(layers);
            const x = xs[steps];
            const S = mode === 'kunden' ? 'P' : 'U';
            let r = '<p style="margin:0 0 6px">$' + S + ' = ' + tm(M, 2) + '$, &nbsp; $\\vec{x}_{' + steps + '} = ' + S + '^{' + steps + '} \\cdot \\vec{x}_0 \\approx ' + tv(x, 0) + '$ ' +
                '(' + C.names.map((nm, i) => nm + ' ' + fmt(x[i], 0)).join(', ') + ').</p>';
            if (mode === 'kaefer') {
                const q = a * b * f;
                r += '<p style="margin:0">$U^3 = a \\cdot b \\cdot f \\cdot E = ' + texNum(q, 2) + ' \\cdot E$: Nach jeweils drei Schritten ist jede Klasse ' +
                    (Math.abs(q - 1) < 1e-9 ? '<b>genau so groß wie vorher</b>, die Population schwankt zyklisch.' : q > 1 ? 'um den Faktor ' + fmt(q, 2) + ' <b>gewachsen</b>.' : 'auf das ' + fmt(q, 2) + '-Fache <b>geschrumpft</b>, die Population stirbt langfristig aus.') + '</p>';
            } else {
                const Un = Array.from({ length: Math.max(1, steps) }).reduce(P => mmul(M, P), ident(3));
                // the fixed vector: (U - E) v = 0 with v1 + v2 + v3 = 1
                const S = [[M[0][0] - 1, M[0][1], M[0][2]], [M[1][0], M[1][1] - 1, M[1][2]], [1, 1, 1]], v = mvec(inverse(S), [0, 0, 1]);
                r += '<p style="margin:0 0 6px">$P^{' + Math.max(1, steps) + '} \\approx ' + tm(Un, 3) + '$. Mit wachsendem $n$ werden die Spalten von $P^n$ gleich: Sie nähern sich der <b>Grenzmatrix</b>, deren Spalten alle der <b>Fixvektor</b> sind.</p>' +
                    '<p style="margin:0">Fixvektor aus $P \\cdot \\vec{v} = \\vec{v}$ und $v_1 + v_2 + v_3 = 1$: $\\vec{v} \\approx ' + tv(v, 3) + '$. Langfristig: ' +
                    C.names.map((nm, i) => nm + ' ' + fmt(v[i] * 100, 1) + ' %').join(', ') + ' der Kundschaft, egal wie es anfing.</p>';
            }
            out.innerHTML = r; math(out);
        }
        box.addEventListener('click', e => {
            const bt = e.target.closest('button'); if (!bt || bt.closest('.b-seg')) return;
            if (bt.hasAttribute('data-s')) steps = Math.min(60, steps + 1);
            else if (bt.hasAttribute('data-s10')) steps = Math.min(60, steps + 10);
            else if (bt.hasAttribute('data-r')) steps = 0;
            render();
        });
        fr.set(f);
        setup();
    });
    /* ---------- biquadratic equations: substitution z = x² ---------- */
    W('biquadratisch', function (box) {
        let p = -5, q = 4;
        const sl = div(box, '');
        range(sl, { label: 'Koeffizient $p$', min: -8, max: 6, step: 0.5, value: p, fmt: v => fmt(v, 1), onInput: v => { p = v; render(); } });
        range(sl, { label: 'Koeffizient $q$', min: -4, max: 10, step: 0.5, value: q, fmt: v => fmt(v, 1), onInput: v => { q = v; render(); } });
        math(sl);
        const two = div(box, 'b-grid2');
        const pz = new Plot(div(two, ''), { x: [-5, 9], y: [-8, 12], height: 260, xLabel: 'z', yLabel: '', aria: 'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen' });
        const px = new Plot(div(two, ''), { x: [-3.5, 3.5], y: [-8, 12], height: 260, xLabel: 'x', yLabel: '', aria: 'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen' });
        const out = div(box, 'b-out');
        function render() {
            const D = p * p / 4 - q, zs = [];
            if (D > 1e-12) zs.push(-p / 2 - Math.sqrt(D), -p / 2 + Math.sqrt(D));
            else if (Math.abs(D) <= 1e-12) zs.push(-p / 2);
            const xs = [];
            zs.forEach(z => { if (z > 1e-12) xs.push(-Math.sqrt(z), Math.sqrt(z)); else if (Math.abs(z) <= 1e-12) xs.push(0); });
            const ux = [...new Set(xs.map(v => Math.round(v * 1e9) / 1e9))].sort((a, b) => a - b);
            pz.draw([{ fn: z => z * z + p * z + q, color: 'cyan', label: 'h' }, { vline: 0, color: 'dim' },
                { pts: zs.map(z => [z, 0, z > 1e-12 ? 'phi' : Math.abs(z) <= 1e-12 ? 'lambda' : 'red']), r: 6 }]);
            px.draw([{ fn: x => x ** 4 + p * x * x + q, color: 'lambda', label: 'f' }, { pts: ux.map(x => [x, 0, 'phi']), r: 6 }]);
            const zt = zs.length ? zs.map(z => '$z = ' + texNum(z, 3) + '$' + (z > 1e-12 ? ' liefert $x = \\pm' + texNum(Math.sqrt(z), 3) + '$' : Math.abs(z) <= 1e-12 ? ' liefert $x = 0$' : ' liefert nichts, denn $x^2$ ist nie negativ')).join('; ') : 'keine Lösung $z$, die Diskriminante ist negativ';
            out.innerHTML = '<p style="margin:0 0 6px">$x^4' + B.sgx(p, 'x^2', 1) + B.sg(q, 1) + ' = 0$ wird mit $z = x^2$ zu $z^2' + B.sgx(p, 'z', 1) + B.sg(q, 1) + ' = 0$, Diskriminante $\\tfrac{p^2}{4} - q = ' + texNum(D, 3) + '$.</p>' +
                '<p style="margin:0 0 6px">' + zt + '.</p><p style="margin:0"><b>' + (ux.length === 0 ? 'Keine Lösung' : ux.length === 1 ? 'Eine Lösung' : ux.length + ' Lösungen') + '</b>' +
                (ux.length ? ': $x \\in \\{' + ux.map(v => texNum(v, 3)).join(';\\ ') + '\\}$' : '') + '.</p>';
            math(out);
        }
        render();
    });
})();
