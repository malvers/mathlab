/* buch-gy12.js — widgets of the book "Mathematik · Gymnasium 12" (Grundkurs) that the other modules do not have yet
 * (js/buch.js, js/buch-plot.js). The calculus, vector and stochastics widgets of the other books are used as they are;
 * the new 2D and 3D widgets of this book live with their relatives in js/buch-analysis.js and js/buch-vektoren.js.
 *   schaetzen    samples from a filling machine: sample mean and sample variance with 1/(n − 1),
 *                a thousand samples show that 1/n estimates the variance too small on average
 *   summen       strips under a graph: lower and upper sums closing in on the integral (data-mode="ou"), or rectangles
 *                left / right / midpoint and trapezoids with a table of errors for n, 2n, 4n (data-mode="verfahren")
 * Looks: js/buch.css (no own section, only the shared classes).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, div, Plot } = B;
    const W = B.widget;

    /* ---------- estimating mean and variance from samples ---------- */
    W('schaetzen', function (box) {
        const MU = 500, SIG = 4;                                       // the machine: mean 500 ml, standard deviation 4 ml
        const S = { n: 5, xs: [], runs: 0, sMean: 0, sN1: 0, sN: 0 };
        // a fixed seed, so the first sample (and the printed book) always looks the same
        let seed = 12;
        const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return (seed + 0.5) / 2147483648; };
        const normal = () => MU + SIG * Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
        const sample = () => Array.from({ length: S.n }, () => Math.round(normal() * 10) / 10);
        const mean = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
        const ss = xs => { const m = mean(xs); return xs.reduce((a, x) => a + (x - m) ** 2, 0); };
        const sl = div(box, '');
        range(sl, { label: 'Stichprobenumfang $n$', min: 2, max: 30, step: 1, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; reset(); S.xs = sample(); render(); } });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn b-go" data-one>Neue Stichprobe</button><button type="button" class="b-btn" data-many>+1000 Stichproben</button>' +
            '<button type="button" class="b-btn b-hintbtn" data-reset>Zurücksetzen</button>';
        const plot = new Plot(div(box, ''), { height: 190, x: [484, 516], y: [0, 4], xLabel: 'ml', yLabel: 'Anzahl', grid: false, aria: 'Füllmengen der Stichprobe als Punktdiagramm mit ihrem Mittelwert und dem Sollwert' });
        const out = div(box, 'b-out');
        function reset() { S.runs = 0; S.sMean = 0; S.sN1 = 0; S.sN = 0; }
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-reset')) { reset(); S.xs = sample(); }
            else if (b.hasAttribute('data-one')) S.xs = sample();
            else for (let i = 0; i < 1000; i++) { const xs = sample(), q = ss(xs); S.runs++; S.sMean += mean(xs); S.sN1 += q / (S.n - 1); S.sN += q / S.n; S.xs = xs; }
            render();
        });
        function render() {
            const xs = S.xs, m = mean(xs), q = ss(xs), s2 = q / (S.n - 1);
            // a dot plot: values in the same millilitre are stacked, the y-axis counts the bottles
            const seen = {}, pts = xs.map(x => { const b = Math.round(x); seen[b] = (seen[b] || 0) + 1; return [x, seen[b]]; });
            const top = Math.max(4, ...Object.values(seen).map(c => c + 1.6));
            plot.view(null, [0, top]);
            plot.draw([{ vline: MU, color: 'dim', dash: true }, { text: 'Sollwert', at: [MU, top - 0.45], color: 'dim' },
                { pts, color: 'cyan', r: 5 }, { vline: m, color: 'lambda' }, { text: 'x̄', at: [m, top - 1.15], color: 'lambda' }]);
            const list = xs.length <= 10 ? xs.map(x => fmt(x, 1)).join('; ') : xs.slice(0, 8).map(x => fmt(x, 1)).join('; ') + '; … (' + xs.length + ' Werte)';
            let html = '<p style="margin:0 0 6px">Stichprobe: ' + list + ' ml</p>' +
                '<p style="margin:0 0 6px">$\\bar{x} = ' + texNum(m, 2) + '$ ml · $s^2 = \\dfrac{1}{n - 1} \\sum (x_i - \\bar{x})^2 = \\dfrac{' + texNum(q, 2) + '}{' + (S.n - 1) + '} \\approx ' + texNum(s2, 2) + '$ · $s \\approx ' + texNum(Math.sqrt(s2), 2) + '$ ml</p>';
            if (S.runs) html += '<p style="margin:0">Im Mittel über ' + S.runs + ' Stichproben: $\\bar{x} \\approx ' + texNum(S.sMean / S.runs, 2) + '$ (wahr: ' + MU + '), ' +
                '$s^2$ mit $\\tfrac{1}{n-1}$: $' + texNum(S.sN1 / S.runs, 2) + '$, mit $\\tfrac1n$: $' + texNum(S.sN / S.runs, 2) + '$ (wahr: $\\sigma^2 = ' + SIG * SIG + '$). ' +
                'Die Division durch $n$ liegt im Mittel um den Faktor $\\tfrac{n-1}{n} = ' + texNum((S.n - 1) / S.n, 2) + '$ zu tief.</p>';
            else html += '<p style="margin:0">Die Anlage füllt im Mittel $\\mu = ' + MU + '$ ml mit der Standardabweichung $\\sigma = ' + SIG + '$ ml ab. Das weiß die Prüferin aber nicht: Sie schätzt beides aus der Stichprobe.</p>';
            out.innerHTML = html; math(out);
        }
        S.xs = sample();
        render();
    });

    /* ---------- sums of strips: lower and upper sums, or the four numerical rules with their errors ---------- */
    // data-mode="ou": lower sum (smallest value per strip) and upper sum (largest), both close in on the integral
    // data-mode="verfahren": rectangles left, right, midpoint, trapezoids; a table with n, 2n, 4n and the errors
    W('summen', function (box) {
        const FN = {
            par: { k: 'f(x) = x²', tex: 'x^2', f: x => x * x, a: 0, b: 2, I: 8 / 3, Itex: '\\tfrac83', y: [-0.4, 4.6] },
            wurzel: { k: 'f(x) = √x', tex: '\\sqrt{x}', f: x => Math.sqrt(x), a: 0, b: 4, I: 16 / 3, Itex: '\\tfrac{16}{3}', y: [-0.3, 2.4] },
            sinus: { k: 'f(x) = sin x', tex: '\\sin x', f: x => Math.sin(x), a: 0, b: Math.PI, I: 2, Itex: '2', y: [-0.2, 1.3], btex: '\\pi' },
            gauss: { k: 'f(x) = e^(−x²)', tex: '\\mathrm{e}^{-x^2}', f: x => Math.exp(-x * x), a: 0, b: 1, I: 0.746824132812427, Itex: null, y: [-0.1, 1.15] }
        };
        const mode = box.dataset.mode === 'verfahren' ? 'verfahren' : 'ou';
        const keys = mode === 'ou' ? ['par', 'wurzel', 'sinus'] : ['par', 'sinus', 'gauss'];
        let G = FN[keys[0]], n = 4, meth = 'links';
        const METH = { links: 'Rechtecke links', rechts: 'Rechtecke rechts', mitte: 'Rechtecke Mitte', trapez: 'Trapeze' };
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, keys.map(k => [k, FN[k].k]), keys[0], v => { G = FN[v]; render(); }, 'Funktion');
        if (mode === 'verfahren') B.seg(div(box, 'b-ctrls'), Object.keys(METH).map(k => [k, METH[k]]), meth, v => { meth = v; render(); }, 'Verfahren');
        range(div(box, ''), { label: 'Anzahl der Streifen $n$', min: 1, max: 40, step: 1, value: n, fmt: v => String(v), onInput: v => { n = v; render(); } });
        const p = new Plot(div(box, ''), { x: [-0.3, 2.3], y: [-0.4, 4.6], height: 300, aria: 'Streifen unter einem Funktionsgraphen' });
        const out = div(box, 'b-out');
        // the smallest and largest value of f on [x0, x1] (fine sampling; exact enough for the pictures and sums)
        function minmax(f, x0, x1) {
            let lo = Infinity, hi = -Infinity;
            for (let i = 0; i <= 24; i++) { const y = f(x0 + (x1 - x0) * i / 24); lo = Math.min(lo, y); hi = Math.max(hi, y); }
            return [lo, hi];
        }
        function rule(m, k) {                                     // the sum with k strips by rule m
            const { f, a, b } = G, h = (b - a) / k;
            let s = 0;
            for (let i = 0; i < k; i++) {
                const x0 = a + i * h, x1 = x0 + h;
                s += m === 'links' ? f(x0) : m === 'rechts' ? f(x1) : m === 'mitte' ? f(x0 + h / 2) : m === 'trapez' ? (f(x0) + f(x1)) / 2
                    : m === 'unter' ? minmax(f, x0, x1)[0] : minmax(f, x0, x1)[1];
            }
            return s * h;
        }
        const d4 = x => texNum(x, 4);
        function render() {
            const { f, a, b } = G, h = (b - a) / n, pad = (b - a) * 0.12;
            p.view([a - pad, b + pad], G.y);
            const L = [];
            if (mode === 'ou') {
                // green: the lower sum; red on top of it: what the upper sum has in addition (no overlapping colours)
                const extra = [], low = [];
                for (let i = 0; i < n; i++) { const x0 = a + i * h, x1 = x0 + h, [lo, hi] = minmax(f, x0, x1); extra.push([[x0, lo], [x0, hi], [x1, hi], [x1, lo]]); low.push([x0, x1, lo]); }
                L.push({ rects: low, color: 'phi' }, { polys: extra, color: 'red' });
            } else if (meth === 'trapez') {
                const polys = [];
                for (let i = 0; i < n; i++) { const x0 = a + i * h, x1 = x0 + h; polys.push([[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]]); }
                L.push({ polys, color: 'cyan' });
            } else {
                const rects = [];
                for (let i = 0; i < n; i++) { const x0 = a + i * h, x1 = x0 + h; rects.push([x0, x1, meth === 'links' ? f(x0) : meth === 'rechts' ? f(x1) : f(x0 + h / 2)]); }
                L.push({ rects, color: 'cyan' });
            }
            L.push({ fn: f, color: 'lambda', label: 'f' }, { hline: 0 });
            p.draw(L);
            const iv = '\\int_0^{' + (G.btex || texNum(b, 0)) + '} ' + G.tex + '\\,\\mathrm{d}x';
            let html;
            if (mode === 'ou') {
                const U = rule('unter', n), O = rule('ober', n);
                html = '<p style="margin:0 0 6px">Untersumme (grün) $U_{' + n + '} \\approx ' + d4(U) + '$ · Obersumme (rot, darüber) $O_{' + n + '} \\approx ' + d4(O) + '$ · Unterschied $' + d4(O - U) + '$</p>' +
                    '<p style="margin:0">Dazwischen liegt immer $' + iv + ' = ' + G.Itex + ' \\approx ' + d4(G.I) + '$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.</p>';
            } else {
                const ks = [n, 2 * n, 4 * n], vals = ks.map(k => rule(meth, k)), errs = vals.map(v => v - G.I);
                html = '<p style="margin:0 0 6px">' + METH[meth] + ' mit $n = ' + n + '$: $' + d4(vals[0]) + '$ · genauer Wert $' + iv + (G.Itex ? ' = ' + G.Itex : '') + ' \\approx ' + texNum(G.I, 6) + '$' +
                    (G.Itex ? '' : ' (ohne Stammfunktion, nur numerisch)') + '</p>' +
                    '<div class="b-table-wrap"><table class="b-table"><tr><th>$n$</th><th>Näherung</th><th>Fehler</th></tr>' +
                    ks.map((k, i) => '<tr><td>$' + k + '$</td><td>$' + texNum(vals[i], 6) + '$</td><td>$' + texNum(errs[i], 6) + '$</td></tr>').join('') + '</table></div>' +
                    '<p style="margin:6px 0 0">' + (Math.abs(errs[0]) < 1e-12 ? 'Hier ist das Verfahren schon exakt.' : 'Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor $' + texNum(errs[0] / errs[1], 1) + '$ kleiner.') + '</p>';
            }
            out.innerHTML = html; math(out);
        }
        render();
    });
})();
