/* buch-numerik.js — widgets for Wahlbereich 3 (numerical methods and simulations) of the textbook (js/buch.js, js/buch-plot.js).
 *   bisektion    halve the interval until the zero is caught
 *   flaeche      area under a graph with left / midpoint rectangles or trapezoids
 *   mc-flaeche   area by random points (Monte Carlo)
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;

    /* ---------- bisection ---------- */
    W('bisektion', function (box) {
        const F = {
            a: { k: 'x³ − x − 2', tex: 'x^3 - x - 2', f: x => x ** 3 - x - 2, I: [1, 2], v: [-0.5, 2.5, -3, 5] },
            b: { k: 'x² − 2', tex: 'x^2 - 2', f: x => x * x - 2, I: [1, 2], v: [-0.5, 2.5, -2.5, 3] },
            c: { k: 'cos x − x', tex: '\\cos x - x', f: x => Math.cos(x) - x, I: [0, 1], v: [-0.5, 1.6, -1.5, 1.5] },
            d: { k: '2ˣ − 3x', tex: '2^x - 3x', f: x => 2 ** x - 3 * x, I: [0, 1], v: [-0.5, 4, -2, 3] }
        };
        let cur = F.a, steps = [];
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(F).map(k => [k, F[k].k]), 'a', v => { cur = F[v]; reset(); }, 'Funktion');
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-0.5, 2.5], y: [-3, 5], height: 300, aria: 'Bisektionsverfahren' });
        const acts = div(box, 'b-ctrls', '<button type="button" class="b-btn b-go" data-s>Intervall halbieren</button><button type="button" class="b-btn" data-s5>5 Schritte</button><button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>');
        acts.style.marginTop = '10px';
        const out = div(box, 'b-table-wrap b-scroll');
        function reset() { steps = [{ a: cur.I[0], b: cur.I[1] }]; render(); }
        function step() {
            const { a, b } = steps[steps.length - 1], m = (a + b) / 2, fm = cur.f(m);
            if (fm === 0) steps.push({ a: m, b: m });
            else steps.push(Math.sign(fm) === Math.sign(cur.f(a)) ? { a: m, b } : { a, b: m });
        }
        function render() {
            const { a, b } = steps[steps.length - 1];
            p.view([cur.v[0], cur.v[1]], [cur.v[2], cur.v[3]]);
            p.draw([{ fn: cur.f, color: 'lambda', label: 'f' }, { vline: a, color: 'cyan' }, { vline: b, color: 'cyan' },
                { seg: [[a, 0], [b, 0]], color: 'cyan', width: 5 }, { pts: [[(a + b) / 2, cur.f((a + b) / 2)]], color: 'white' }]);
            out.innerHTML = '<p style="margin:0 0 8px">$f(x) = ' + cur.tex + '$ · Startintervall $[' + cur.I[0] + ';\\,' + cur.I[1] + ']$ mit $f(' + cur.I[0] + ') ' + (cur.f(cur.I[0]) < 0 ? '<' : '>') + ' 0$ und $f(' + cur.I[1] + ') ' + (cur.f(cur.I[1]) < 0 ? '<' : '>') + ' 0$</p>' +
                '<table class="b-table"><thead><tr><th>Schritt</th><th>$a$</th><th>$b$</th><th>Mitte $m$</th><th>$f(m)$</th><th>Breite</th></tr></thead><tbody>' +
                steps.map((s, i) => { const m = (s.a + s.b) / 2; return '<tr><td>' + i + '</td><td>' + fmt(s.a, 6) + '</td><td>' + fmt(s.b, 6) + '</td><td class="b-hot">' + fmt(m, 6) + '</td><td>' + fmt(cur.f(m), 5) + '</td><td>' + fmt(s.b - s.a, 6) + '</td></tr>'; }).join('') +
                '</tbody></table>';
            math(out);
        }
        acts.addEventListener('click', e => {
            const t = e.target.closest('button'); if (!t) return;
            if (t.hasAttribute('data-s')) step(); else if (t.hasAttribute('data-s5')) for (let i = 0; i < 5; i++) step(); else reset();
            render();
        });
        reset();
    });

    /* ---------- area with rectangles and trapezoids ---------- */
    W('flaeche', function (box) {
        const F = {
            q: { k: 'x² auf [0; 2]', tex: '\\int_0^2 x^2\\,dx', f: x => x * x, a: 0, b: 2, ex: 8 / 3, ext: '\\tfrac83', v: [-0.3, 2.3, -0.5, 4.5] },
            w: { k: '√x auf [0; 4]', tex: '\\int_0^4 \\sqrt{x}\\,dx', f: Math.sqrt, a: 0, b: 4, ex: 16 / 3, ext: '\\tfrac{16}{3}', v: [-0.3, 4.3, -0.5, 2.5] },
            s: { k: 'sin x auf [0; π]', tex: '\\int_0^{\\pi} \\sin x\\,dx', f: Math.sin, a: 0, b: Math.PI, ex: 2, ext: '2', v: [-0.3, 3.5, -0.4, 1.4] }
        };
        let cur = F.q, meth = 'links', n = 4;
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(F).map(k => [k, F[k].k]), 'q', v => { cur = F[v]; render(); }, 'Funktion');
        seg(ctr, [['links', 'Rechtecke links'], ['mitte', 'Rechtecke Mitte'], ['trapez', 'Trapeze']], 'links', v => { meth = v; render(); }, 'Verfahren');
        const sl = div(box, '');
        range(sl, { label: 'Anzahl der Streifen $n$', min: 1, max: 50, step: 1, value: n, fmt: v => String(v), onInput: v => { n = v; render(); } });
        math(sl);
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-0.3, 2.3], y: [-0.5, 4.5], height: 300, aria: 'Flächeninhalt mit Streifen angenähert' });
        const out = div(box, 'b-out');
        function render() {
            const { f, a, b } = cur, h = (b - a) / n;
            let A = 0; const rects = [], polys = [];
            for (let i = 0; i < n; i++) {
                const x0 = a + i * h, x1 = x0 + h;
                if (meth === 'trapez') { polys.push([[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]]); A += h * (f(x0) + f(x1)) / 2; }
                else { const y = meth === 'links' ? f(x0) : f(x0 + h / 2); rects.push([x0, x1, y]); A += h * y; }
            }
            p.view([cur.v[0], cur.v[1]], [cur.v[2], cur.v[3]]);
            p.draw([rects.length ? { rects, color: 'cyan' } : { polys, color: 'cyan' }, { fn: f, color: 'lambda', domain: [cur.v[0], cur.v[1]] }]);
            const err = A - cur.ex;
            out.innerHTML = 'Näherung mit $n = ' + n + '$: $A \\approx ' + texNum(A, 5) + '$ · genauer Wert $' + cur.tex + ' = ' + cur.ext + ' \\approx ' + texNum(cur.ex, 5) + '$ · Fehler $' + texNum(err, 5) + '$';
            math(out);
        }
        render();
    });

    /* ---------- Monte Carlo area ---------- */
    W('mc-flaeche', function (box) {
        const f = x => x * x, X = 2, Y = 4, exact = 8 / 3;
        let inside = [], outside = [], hits = 0, total = 0;
        const acts = div(box, 'b-ctrls', [100, 1000, 10000].map(k => '<button type="button" class="b-btn" data-k="' + k + '">+' + k.toLocaleString('de-DE').replace('.', ' ') + ' Punkte</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>');
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-0.2, 2.2], y: [-0.3, 4.3], height: 320, aria: 'Zufallspunkte im Rechteck, Treffer unter der Parabel' });
        const out = div(box, 'b-out');
        function render() {
            p.draw([{ seg: [[0, Y], [X, Y]], color: 'dim' }, { seg: [[X, 0], [X, Y]], color: 'dim' },
                { pts: outside, color: 'rgba(143,163,189,0.55)', r: 1.8 }, { pts: inside, color: 'rgb(245,194,66)', r: 1.8 }, { fn: f, color: 'cyan', domain: [0, 2.05] }]);
            const est = total ? hits / total * X * Y : NaN;
            out.innerHTML = total ? 'Von $' + total + '$ Punkten liegen $' + hits + '$ unter der Parabel. Rechteck: $2 \\cdot 4 = 8$. ' +
                'Schätzwert: $A \\approx \\tfrac{' + hits + '}{' + total + '} \\cdot 8 \\approx ' + texNum(est, 4) + '$ · genau: $\\tfrac83 \\approx ' + texNum(exact, 4) + '$'
                : 'Wirf Zufallspunkte in das Rechteck $0 \\leq x \\leq 2$, $0 \\leq y \\leq 4$. Der Anteil der Treffer unter $y = x^2$ schätzt den Anteil der Fläche.';
            math(out);
        }
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-r')) { inside = []; outside = []; hits = 0; total = 0; }
            else for (let i = 0; i < +b.dataset.k; i++) {
                const x = Math.random() * X, y = Math.random() * Y, ok = y < f(x);
                total++; if (ok) hits++;
                const arr = ok ? inside : outside; if (arr.length < 2500) arr.push([x, y]);
            }
            render();
        });
        render();
    });
})();
