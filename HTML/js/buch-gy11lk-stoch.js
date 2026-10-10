/* buch-gy11lk-stoch.js — stochastics widgets of the book "Mathematik · Gymnasium 11 · Leistungskurs" (chapters 4.1 to 4.3)
 * that js/buch-stochastik.js does not have. Needs js/buch.js, js/buch-plot.js and js/buch-stochastik.js (Buch.treeSVG, Buch.binom).
 *   geburtstag   the birthday problem: P(at least two of n people share a birthday), exact by counting, and simulated classes
 *   umkehrbaum   Bayes: the tree A → B, the four-field table and the inverted tree B → A, all from P(A), P_A(B) and P_Ā(B)
 *   galton       a Galton board as a Bernoulli chain: n rows, probability p to the right, balls fall → frequencies against B(n; p)
 * Looks: the classes of the stochastics widgets in js/buch.css (st-tree, b-two, b-table …), no own CSS.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;
    const int = n => Math.round(n).toLocaleString('de-DE').replace(/\./g, ' ');
    const BAR = '̅';                                   // combining overline: A̅ is "not A" inside the SVG trees

    /* ---------- the birthday problem ---------- */
    W('geburtstag', function (box) {
        const N = 80;
        const q = [1];                                      // q[n] = P(all n birthdays differ) = 365 · 364 · … · (365 − n + 1) / 365^n
        for (let k = 1; k <= N; k++) q[k] = q[k - 1] * (365 - k + 1) / 365;
        let n = +(box.dataset.n || 23), sim = null;
        const ctl = div(box, '');
        range(ctl, { label: 'Personen $n$', min: 2, max: N, step: 1, value: n, fmt: v => String(v), onInput: v => { n = v; sim = null; render(); } });
        math(ctl);
        const p = new Plot(div(box, ''), { height: 250, xLabel: 'n', yLabel: 'P', aria: 'Wahrscheinlichkeit für mindestens zwei gleiche Geburtstage in Abhängigkeit von der Zahl der Personen' });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-sim>1000 Klassen simulieren</button>';
        const out = div(box, 'b-out');
        acts.addEventListener('click', e => { if (e.target.closest('[data-sim]')) simulate(); });
        function simulate() {
            let hit = 0;
            for (let c = 0; c < 1000; c++) {
                const seen = new Uint8Array(365);
                for (let i = 0; i < n; i++) { const d = Math.floor(Math.random() * 365); if (seen[d]) { hit++; break; } seen[d] = 1; }
            }
            sim = hit; render();
        }
        function render() {
            const pn = 1 - q[n], all = [];
            for (let k = 1; k <= N; k++) all.push([k, 1 - q[k]]);
            p.view([0, N], [0, 1.05]);
            p.draw([{ hline: 0.5, color: 'dim' }, { pts: all, color: 'cyan', r: 2.2 }, { seg: [[n, 0], [n, pn]], color: 'dim', dash: true }, { pts: [[n, pn]], color: 'lambda', r: 6 }]);
            const prod = n === 2 ? '365 \\cdot 364' : n === 3 ? '365 \\cdot 364 \\cdot 363' : '365 \\cdot 364 \\cdot \\ldots \\cdot ' + (365 - n + 1);
            out.innerHTML = '<p style="margin:0 0 6px">Alle ' + n + ' Geburtstage verschieden: $' + prod + '$ günstige von $365^{' + n + '}$ gleich wahrscheinlichen Ergebnissen, also $P(\\text{alle verschieden}) \\approx ' + texNum(q[n], 4) + '$.</p>' +
                '<p style="margin:0">$P(\\text{mindestens zwei gleich}) = 1 - ' + texNum(q[n], 4) + ' \\approx ' + texNum(pn, 4) + '$.' +
                (sim != null ? ' In 1000 simulierten Klassen hatten ' + int(sim) + ' einen doppelten Geburtstag.' : '') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- Bayes: the tree and the inverted tree ---------- */
    const PRESETS = {
        test: { name: 'Schnelltest', pa: 0.02, pba: 0.95, pbna: 0.05, A: 'krank', nA: 'gesund', Bn: 'positiv', nB: 'negativ' },
        spam: { name: 'Spamfilter', pa: 0.3, pba: 0.4, pbna: 0.01, A: 'Spam', nA: 'kein Spam', Bn: 'enthält „Gratis“', nB: 'ohne „Gratis“' },
        werk: { name: 'Zwei Maschinen', pa: 0.6, pba: 0.03, pbna: 0.06, A: 'Maschine 1', nA: 'Maschine 2', Bn: 'defekt', nB: 'in Ordnung' }
    };
    W('umkehrbaum', function (box) {
        if (!B.treeSVG) { div(box, 'b-help', 'Dieses Bild braucht js/buch-stochastik.js.'); return; }
        let key = box.dataset.preset || 'test', S = Object.assign({}, PRESETS[key]), abs = true;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(PRESETS).map(k => [k, PRESETS[k].name]), key, v => { key = v; S = Object.assign({}, PRESETS[v]); build(); }, 'Beispiel');
        seg(ctl, [['1', 'von 10 000'], ['0', 'Wahrscheinlichkeiten']], '1', v => { abs = v === '1'; render(); }, 'Darstellung');
        const sl = div(box, '');
        const legend = div(box, 'b-help');
        const two = div(box, 'b-two');
        const t1 = div(two, 'b-svgbox b-scroll'), t2 = div(two, 'b-svgbox b-scroll');
        const tab = div(box, 'b-table-wrap');
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            range(sl, { label: '$P(A)$', min: 0.01, max: 0.99, step: 0.01, value: S.pa, fmt: v => fmt(v, 2), onInput: v => { S.pa = v; render(); } });
            range(sl, { label: '$P_A(B)$', min: 0, max: 1, step: 0.01, value: S.pba, fmt: v => fmt(v, 2), onInput: v => { S.pba = v; render(); } });
            range(sl, { label: '$P_{\\overline{A}}(B)$', min: 0, max: 1, step: 0.01, value: S.pbna, fmt: v => fmt(v, 2), onInput: v => { S.pbna = v; render(); } });
            math(sl); render();
        }
        function tree(first, second, aria, lit) {
            // first: [[key, cls, edge], [key, cls, edge]]; second[i]: two children [[key, cls, edge, leafText, leafValue], …]
            const root = { key: '', children: first.map(([k, cls, e], i) => ({ key: k, cls, edge: e,
                children: second[i].map(([k2, cls2, e2, txt, val]) => ({ key: k + k2, cls: cls2, edge: e2, txt, val })) })) };
            return B.treeSVG(root, {
                stepX: 112, spacing: 44, leafW: 132, minW: 0, aria, on: k => k.length > 0 && lit.startsWith(k),
                leaf: (nd, w) => '<text x="10" y="20">' + nd.txt + '</text><text class="st-leaf-p" x="' + (w - 10) + '" y="20" text-anchor="end">' + nd.val + '</text>'
            });
        }
        function render() {
            const a = S.pa, ba = S.pba, bna = S.pbna;
            const pAB = a * ba, pAnB = a * (1 - ba), pnAB = (1 - a) * bna, pnAnB = (1 - a) * (1 - bna), pB = pAB + pnAB, pnB = 1 - pB;
            const v = x => abs ? int(x * 10000) : fmt(x, 4), e = x => fmt(x, 3), d = (x, y) => y > 1e-12 ? fmt(x / y, 3) : '–';
            const nA = 'A' + BAR, nB = 'B' + BAR;
            legend.innerHTML = '$A$: ' + S.A + ', $\\overline{A}$: ' + S.nA + ', $B$: ' + S.Bn + ', $\\overline{B}$: ' + S.nB + '.';
            math(legend);
            t1.innerHTML = tree([['A', 'r', e(a)], ['N', 'b', e(1 - a)]],
                [[['B', 'r', e(ba), 'A ∩ B', v(pAB)], ['N', 'b', e(1 - ba), 'A ∩ ' + nB, v(pAnB)]],
                 [['B', 'r', e(bna), nA + ' ∩ B', v(pnAB)], ['N', 'b', e(1 - bna), nA + ' ∩ ' + nB, v(pnAnB)]]],
                'Baumdiagramm: erst A, dann B', 'AB');
            t2.innerHTML = tree([['B', 'r', e(pB)], ['N', 'b', e(pnB)]],
                [[['A', 'r', d(pAB, pB), 'B ∩ A', v(pAB)], ['N', 'b', d(pnAB, pB), 'B ∩ ' + nA, v(pnAB)]],
                 [['A', 'r', d(pAnB, pnB), nB + ' ∩ A', v(pAnB)], ['N', 'b', d(pnAnB, pnB), nB + ' ∩ ' + nA, v(pnAnB)]]],
                'Umgekehrtes Baumdiagramm: erst B, dann A', 'BA');
            tab.innerHTML = '<table class="b-table"><tr><th></th><th>$B$</th><th>$\\overline{B}$</th><th>$\\Sigma$</th></tr>' +
                '<tr><th>$A$</th><td class="b-hot">' + v(pAB) + '</td><td>' + v(pAnB) + '</td><td>' + v(a) + '</td></tr>' +
                '<tr><th>$\\overline{A}$</th><td>' + v(pnAB) + '</td><td>' + v(pnAnB) + '</td><td>' + v(1 - a) + '</td></tr>' +
                '<tr><th>$\\Sigma$</th><td>' + v(pB) + '</td><td>' + v(pnB) + '</td><td>' + v(1) + '</td></tr></table>';
            const res = pB > 1e-12 ? pAB / pB : 0;
            out.innerHTML = (pB > 1e-12
                ? '<p style="margin:0">$P_B(A) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{' + texNum(pAB, 4) + '}{' + texNum(pB, 4) + '} \\approx ' + texNum(res, 3) + '$. ' +
                  (abs ? 'In Zahlen: Von ' + int(pB * 10000) + ' Fällen mit „' + S.Bn + '“ sind ' + int(pAB * 10000) + ' „' + S.A + '“.' :
                         'Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.') + '</p>'
                : '<p style="margin:0">$P(B) = 0$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.</p>');
            math(tab); math(out);
        }
        build();
    });

    /* ---------- the Galton board ---------- */
    W('galton', function (box) {
        let n = +(box.dataset.n || 8), p = +(box.dataset.p || 0.5), cnt = [], balls = 0, last = null;
        const ctl = div(box, '');
        range(ctl, { label: 'Nagelreihen $n$', min: 1, max: 12, step: 1, value: n, fmt: v => String(v), onInput: v => { n = v; reset(); } });
        range(ctl, { label: 'nach rechts mit $p$', min: 0.1, max: 0.9, step: 0.05, value: p, fmt: v => fmt(v, 2), onInput: v => { p = v; reset(); } });
        math(ctl);
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = [1, 10, 100, 1000].map(k => '<button type="button" class="b-btn" data-k="' + k + '">+' + int(k) + '</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-reset>Leeren</button>';
        const two = div(box, 'b-two');
        const board = div(two, 'b-svgbox');
        const pl = new Plot(div(two, ''), { height: 250, xLabel: 'k', yLabel: 'h, P', aria: 'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung' });
        const out = div(box, 'b-out');
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-reset')) reset(); else drop(+b.dataset.k);
        });
        function drop(k) {
            for (let j = 0; j < k; j++) {
                const path = [0]; let r = 0;
                for (let i = 0; i < n; i++) { if (Math.random() < p) r++; path.push(r); }
                cnt[r]++; balls++; last = path;
            }
            render();
        }
        function reset() { cnt = new Array(n + 1).fill(0); balls = 0; last = null; render(); }
        function drawBoard() {
            const Wd = 300, gap = Wd / (n + 2), Ht = gap * (n + 1.4), X = (i, j) => Wd / 2 + (j - i / 2) * gap, Y = i => gap * (i + 0.7);
            let s = '<svg class="st-tree" viewBox="0 0 ' + Wd + ' ' + Ht + '" width="100%" role="img" aria-label="Galtonbrett mit ' + n + ' Nagelreihen">';
            if (last) {
                const pts = last.map((r, i) => X(i, r) + ',' + (Y(i) - gap * 0.45)).concat([X(n, last[n]) + ',' + (Y(n) + gap * 0.2)]);
                s += '<polyline points="' + pts.join(' ') + '" class="st-edge on"/>';
            }
            for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) s += '<circle cx="' + X(i, j) + '" cy="' + Y(i) + '" r="' + Math.max(2.2, gap * 0.09) + '" class="st-node-root"/>';
            for (let j = 0; j <= n; j++) s += '<text class="st-p" x="' + X(n, j) + '" y="' + (Y(n) + gap * 0.55) + '" text-anchor="middle" style="font-size:' + Math.min(15, gap * 0.5) + 'px">' + j + '</text>';
            board.innerHTML = s + '</svg>';
        }
        function render() {
            drawBoard();
            const ks = [], top = [];
            for (let k = 0; k <= n; k++) { ks.push(B.binom.pmf(n, p, k)); top.push(balls ? cnt[k] / balls : 0); }
            pl.view([-0.7, n + 0.7], [0, Math.max(...ks, ...top) * 1.15 || 1]);
            pl.draw([{ rects: top.map((h, k) => [k - 0.4, k + 0.4, h]), color: 'cyan' }, { pts: ks.map((h, k) => [k, h]), color: 'lambda', r: 4.5 }]);
            const mean = balls ? cnt.reduce((s, c, k) => s + c * k, 0) / balls : 0;
            out.innerHTML = '<p style="margin:0">' + int(balls) + ' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(' + n + ';\\,' + texNum(p, 2) + ')$. ' +
                (balls ? 'Mittleres Fach $' + texNum(mean, 2) + '$, Erwartungswert $n \\cdot p = ' + texNum(n * p, 2) + '$.' : 'Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.') + '</p>';
            math(out);
        }
        reset();
    });
})();
