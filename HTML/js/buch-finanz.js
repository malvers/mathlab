/* buch-finanz.js — widgets for Wahlbereich 2 "Finanzmathematik" of the book Mathematik · Fachoberschule 11 (js/buch.js, js/buch-plot.js).
 *   zins      compound against simple interest: capital year by year as bars, doubling time
 *   tilgung   annuity loan, loan with equal repayments, savings plan: the plan year by year as a table and stacked bars
 *             (data-mode="ann" | "rate" | "spar")
 * Looks: js/buch.css (section "Widgets of the FOS chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;

    // money: "12.345,67 €" in the text, "12\,345{,}67" inside TeX
    const eur = (x, d = 2) => Number(x).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' €';
    function tm(x, d = 2) {
        const neg = x < 0, s = Math.abs(x).toFixed(d), [i, f] = s.split('.');
        const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
        return (neg ? '-' : '') + g + (f ? '{,}' + f : '');
    }

    /* ---------- compound interest ---------- */
    W('zins', function (box) {
        const S = { k: 5000, p: 3, n: 20 };
        const sl = div(box, '');
        range(sl, { label: 'Startkapital $K_0$ in €', min: 500, max: 20000, step: 500, value: S.k, fmt: v => v.toLocaleString('de-DE'), onInput: v => { S.k = v; render(); } });
        range(sl, { label: 'Zinssatz $p$', min: 0.5, max: 10, step: 0.25, value: S.p, fmt: v => fmt(v, 2) + ' %', onInput: v => { S.p = v; render(); } });
        range(sl, { label: 'Laufzeit $n$', min: 1, max: 40, step: 1, value: S.n, fmt: v => v + ' J.', onInput: v => { S.n = v; render(); } });
        math(sl);
        const p = new Plot(div(box, ''), { x: [-0.8, 20.8], y: [0, 10000], height: 300, xLabel: 'Jahre', yLabel: 'Kapital in €', aria: 'Kapital Jahr für Jahr: Zinseszins und einfache Verzinsung' });
        div(box, 'b-help', '<span class="fz-key fz-lambda"></span>mit Zinseszins &nbsp; <span class="fz-key fz-cyan"></span>einfache Verzinsung (die Zinsen werden nicht mitverzinst)');
        const out = div(box, 'b-out');
        function render() {
            const { k, p: ps, n } = S, q = 1 + ps / 100;
            const Kn = k * q ** n, Ks = k * (1 + n * ps / 100), td = Math.log(2) / Math.log(q);
            p.opt.xStep = n <= 12 ? 1 : n <= 24 ? 2 : 5;
            p.view([-0.8, n + 0.8], [0, Kn * 1.14]);
            const rc = [], rs = [];
            for (let j = 0; j <= n; j++) { rc.push([j - 0.4, j, k * q ** j]); rs.push([j, j + 0.4, k * (1 + j * ps / 100)]); }
            const L = [{ rects: rs, color: 'cyan' }, { rects: rc, color: 'lambda' }];
            if (2 * k < Kn * 1.1) L.push({ hline: 2 * k, color: 'dim' }, { text: 'doppeltes Startkapital', at: [-0.6, 2 * k], color: 'dim', italic: false });
            p.draw(L);
            out.innerHTML = '<p style="margin:0 0 6px">Zinseszins: $K_n = K_0 \\cdot q^n = ' + tm(k, 0) + ' \\cdot ' + texNum(q, 4) + '^{' + n + '} \\approx ' + tm(Kn) + '$ €</p>' +
                '<p style="margin:0 0 6px">Einfache Verzinsung: $K_0 \\cdot \\left(1 + n \\cdot \\tfrac{p}{100}\\right) = ' + tm(Ks) + '$ € · Zinseszins bringt <b>' + eur(Kn - Ks) + '</b> mehr</p>' +
                '<p style="margin:0">Verdopplung nach $n = \\dfrac{\\ln 2}{\\ln q} \\approx ' + texNum(td, 1) + '$ Jahren (Faustregel $72 : p \\approx ' + texNum(72 / ps, 1) + '$)</p>';
            math(out);
        }
        render();
    });

    /* ---------- repayment and savings plans ---------- */
    W('tilgung', function (box) {
        const S = { mode: box.dataset.mode || 'ann', s: 10000, r: 1200, p: 6, n: 5 };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['ann', 'Annuitätendarlehen'], ['rate', 'Ratentilgung'], ['spar', 'Sparplan']], S.mode, v => { S.mode = v; setup(); render(); }, 'Modell');
        const sl = div(box, '');
        const rs = range(sl, { label: 'Kredit $S_0$ in €', min: 1000, max: 50000, step: 500, value: S.s, fmt: v => v.toLocaleString('de-DE'), onInput: v => { S.s = v; render(); } });
        const rr = range(sl, { label: 'Sparrate je Jahr $R$ in €', min: 100, max: 6000, step: 100, value: S.r, fmt: v => v.toLocaleString('de-DE'), onInput: v => { S.r = v; render(); } });
        range(sl, { label: 'Zinssatz $p$', min: 0.5, max: 12, step: 0.25, value: S.p, fmt: v => fmt(v, 2) + ' %', onInput: v => { S.p = v; render(); } });
        range(sl, { label: 'Laufzeit $n$', min: 1, max: 30, step: 1, value: S.n, fmt: v => v + ' J.', onInput: v => { S.n = v; render(); } });
        math(sl);
        const p = new Plot(div(box, ''), { x: [0, 6], y: [0, 3000], height: 260, xLabel: 'Jahr', yLabel: '€', aria: 'Zahlungen Jahr für Jahr als gestapelte Säulen' });
        const key = div(box, 'b-help');
        const tab = div(box, 'b-table-wrap b-scroll fz-tab');
        const out = div(box, 'b-out');
        function setup() {
            rs.input.parentNode.style.display = S.mode === 'spar' ? 'none' : '';
            rr.input.parentNode.style.display = S.mode === 'spar' ? '' : 'none';
        }
        const bar = (j, lo, hi) => [[j - 0.34, lo], [j + 0.34, lo], [j + 0.34, hi], [j - 0.34, hi]];
        function render() {
            const { mode, s, r, p: ps, n } = S, q = 1 + ps / 100;
            p.opt.xStep = n <= 12 ? 1 : n <= 24 ? 2 : 5;                 // whole years on the axis
            const rows = [];
            let sumZ = 0, sumT = 0, sumA = 0, txt;
            if (mode === 'spar') {
                let K = 0;
                for (let j = 1; j <= n; j++) { const Z = K * (q - 1), E = K + Z + r; rows.push([j, K, Z, r, E]); sumZ += Z; K = E; }
                const Kn = r * (q ** n - 1) / (q - 1);
                txt = '<p style="margin:0 0 6px">Endkapital: $K_n = R \\cdot \\dfrac{q^n - 1}{q - 1} = ' + tm(r, 0) + ' \\cdot \\dfrac{' + texNum(q, 4) + '^{' + n + '} - 1}{' + texNum(q - 1, 4) + '} \\approx ' + tm(Kn) + '$ €</p>' +
                    '<p style="margin:0">Eingezahlt: ' + eur(n * r) + ' · Zinsen: <b>' + eur(Kn - n * r) + '</b> (Einzahlung jeweils am Jahresende)</p>';
                tab.innerHTML = '<table class="b-table"><tr><th>Jahr</th><th>Kapital am Anfang</th><th>Zinsen</th><th>Einzahlung</th><th>Kapital am Ende</th></tr>' +
                    rows.map(([j, a, z, e, k]) => '<tr><td>' + j + '</td><td>' + eur(a) + '</td><td>' + eur(z) + '</td><td>' + eur(e) + '</td><td>' + eur(k) + '</td></tr>').join('') +
                    '<tr><th>Summe</th><td class="b-sum"></td><td class="b-sum b-hot">' + eur(sumZ) + '</td><td class="b-sum">' + eur(n * r) + '</td><td class="b-sum"></td></tr></table>';
                key.innerHTML = '<span class="fz-key fz-cyan"></span>eingezahlt &nbsp; <span class="fz-key fz-lambda"></span>Zinsen (Kapital am Jahresende)';
                const polys1 = [], polys2 = [];
                rows.forEach(([j, , , , k]) => { polys1.push(bar(j, 0, j * r)); polys2.push(bar(j, j * r, k)); });
                p.view([0.2, n + 0.8], [0, rows[n - 1][4] * 1.12]);
                p.draw([{ polys: polys1, color: 'cyan' }, { polys: polys2, color: 'lambda' }]);
            } else {
                let R = s;
                const A = s * q ** n * (q - 1) / (q ** n - 1), T0 = s / n;
                for (let j = 1; j <= n; j++) {
                    const Z = R * (q - 1), T = mode === 'ann' ? A - Z : T0, rate = Z + T;
                    rows.push([j, R, Z, T, rate, R - T]); sumZ += Z; sumT += T; sumA += rate; R -= T;
                }
                txt = mode === 'ann'
                    ? '<p style="margin:0 0 6px">Annuität (jedes Jahr gleich): $A = S_0 \\cdot \\dfrac{q^n \\cdot (q - 1)}{q^n - 1} = ' + tm(s, 0) + ' \\cdot \\dfrac{' + texNum(q, 4) + '^{' + n + '} \\cdot ' + texNum(q - 1, 4) + '}{' + texNum(q, 4) + '^{' + n + '} - 1} \\approx ' + tm(A) + '$ €</p>' +
                    '<p style="margin:0">Die Zinsen werden jedes Jahr kleiner, die Tilgung wächst. Zinsen insgesamt: <b>' + eur(sumZ) + '</b></p>'
                    : '<p style="margin:0 0 6px">Tilgung (jedes Jahr gleich): $T = \\dfrac{S_0}{n} = \\dfrac{' + tm(s, 0) + '}{' + n + '} = ' + tm(T0) + '$ € · erste Rate ' + eur(rows[0][4]) + ', letzte Rate ' + eur(rows[n - 1][4]) + '</p>' +
                    '<p style="margin:0">Die Rate sinkt, weil die Restschuld und damit die Zinsen sinken. Zinsen insgesamt: <b>' + eur(sumZ) + '</b></p>';
                tab.innerHTML = '<table class="b-table"><tr><th>Jahr</th><th>Restschuld am Anfang</th><th>Zinsen</th><th>Tilgung</th><th>Rate</th><th>Restschuld am Ende</th></tr>' +
                    rows.map(([j, a, z, t, k, e]) => '<tr><td>' + j + '</td><td>' + eur(a) + '</td><td>' + eur(z) + '</td><td>' + eur(t) + '</td><td>' + eur(k) + '</td><td>' + eur(Math.abs(e) < 0.005 ? 0 : e) + '</td></tr>').join('') +
                    '<tr><th>Summe</th><td class="b-sum"></td><td class="b-sum b-hot">' + eur(sumZ) + '</td><td class="b-sum">' + eur(sumT) + '</td><td class="b-sum">' + eur(sumA) + '</td><td class="b-sum"></td></tr></table>';
                key.innerHTML = '<span class="fz-key fz-red"></span>Zinsen &nbsp; <span class="fz-key fz-phi"></span>Tilgung (zusammen: die Rate)';
                const polys1 = [], polys2 = [];
                rows.forEach(([j, , z, , k]) => { polys1.push(bar(j, 0, z)); polys2.push(bar(j, z, k)); });
                p.view([0.2, n + 0.8], [0, Math.max(...rows.map(x => x[4])) * 1.18]);
                p.draw([{ polys: polys1, color: 'red' }, { polys: polys2, color: 'phi' }]);
            }
            out.innerHTML = txt;
            math(out);
        }
        setup();
        render();
    });
})();
