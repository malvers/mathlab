/* buch-spiele.js — widgets for random variables and games in the book Mathematik · Gymnasium 10 (js/buch.js, js/buch-plot.js).
 *   verteilung     two dice, 36 outcomes: pick a random variable (sum, difference, maximum, number of sixes), the grid
 *                  shows its value on every outcome, the bar chart its distribution
 *   spielstreuung  three fair games with the same expected value and different standard deviations: eight players,
 *                  a hundred rounds each, the balances fan out like ±σ·√n
 *   fairesspiel    the dice game at the school fair: stake and two prizes, expected gain, the fair stake, a thousand games
 * Looks: js/buch.css (section "Widgets of the Gymnasium 10 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot, gcd } = B;
    const W = B.widget;
    const rnd = n => Math.floor(Math.random() * n);
    const frac = (k, n) => { const g = gcd(k, n); return k % n === 0 ? String(k / n) : '\\tfrac{' + k / g + '}{' + n / g + '}'; };

    /* ---------- a random variable on two dice ---------- */
    const RV = {
        sum: { k: 'Augensumme', f: (a, b) => a + b, say: 'die Summe der beiden Augenzahlen' },
        diff: { k: 'Differenz', f: (a, b) => Math.abs(a - b), say: 'der Abstand der beiden Augenzahlen, die größere minus die kleinere' },
        max: { k: 'Maximum', f: (a, b) => Math.max(a, b), say: 'die größere der beiden Augenzahlen' },
        six: { k: 'Anzahl Sechsen', f: (a, b) => (a === 6) + (b === 6), say: 'wie viele der beiden Würfel eine Sechs zeigen' }
    };
    W('verteilung', function (box) {
        let key = box.dataset.start || 'sum', sel = null;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(RV).map(k => [k, RV[k].k]), key, v => { key = v; sel = null; render(); }, 'Zufallsgröße');
        const help = div(box, 'b-help');
        const two = div(box, 'b-two');
        const grid = div(two, 'b-svgbox sp-grid');
        const p = new Plot(div(two, ''), { height: 300, yLabel: 'P', aria: 'Wahrscheinlichkeitsverteilung als Stabdiagramm' });
        const tab = div(box, 'b-table-wrap');
        const out = div(box, 'b-out');
        grid.addEventListener('click', e => { const c = e.target.closest('[data-v]'); if (c) { sel = +c.dataset.v; render(); } });
        tab.addEventListener('click', e => { const c = e.target.closest('[data-v]'); if (c) { sel = +c.dataset.v; render(); } });
        function render() {
            const R = RV[key], count = new Map();
            for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) { const v = R.f(a, b); count.set(v, (count.get(v) || 0) + 1); }
            const vals = [...count.keys()].sort((x, y) => x - y);
            if (sel == null || !count.has(sel)) sel = vals.reduce((m, v) => (count.get(v) > count.get(m) ? v : m), vals[0]);
            help.innerHTML = '$X$ = ' + R.say + '. Tippe auf ein Feld oder einen Wert.';
            let s = '<svg viewBox="0 0 330 330" role="img" aria-label="Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße">';
            for (let i = 1; i <= 6; i++) {
                s += '<text class="sp-head" x="' + (30 + 46 * i - 23) + '" y="20" text-anchor="middle">' + i + '</text><text class="sp-head" x="14" y="' + (30 + 46 * i - 18) + '" text-anchor="middle">' + i + '</text>';
            }
            for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
                const v = R.f(a, b), x = 30 + 46 * (b - 1), y = 30 + 46 * (a - 1);
                s += '<g class="sp-cell' + (v === sel ? ' on' : '') + '" data-v="' + v + '"><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="42" height="42" rx="7"/>' +
                    '<text x="' + (x + 23) + '" y="' + (y + 29) + '" text-anchor="middle">' + v + '</text></g>';
            }
            grid.innerHTML = s + '<text class="sp-axis" x="168" y="328" text-anchor="middle">2. Würfel →</text></svg>';
            const lo = vals[0], hi = vals[vals.length - 1];
            const ym = Math.max(...vals.map(v => count.get(v))) / 36;
            p.view([lo - 0.8, hi + 0.8], [-ym * 0.16, ym * 1.25]);
            p.opt.xStep = 1;
            p.draw(vals.map(v => ({ seg: [[v, 0], [v, count.get(v) / 36]], color: v === sel ? 'lambda' : 'cyan', width: 6 })).concat([{ pts: vals.map(v => [v, count.get(v) / 36]), color: 'cyan', r: 3.5 }]));
            tab.innerHTML = '<table class="b-table sp-tab" style="min-width:0"><tr><th>$x_i$</th>' + vals.map(v => '<td data-v="' + v + '"' + (v === sel ? ' class="b-hot"' : '') + '>' + v + '</td>').join('') + '</tr>' +
                '<tr><th>$P(X = x_i)$</th>' + vals.map(v => '<td data-v="' + v + '"' + (v === sel ? ' class="b-hot"' : '') + '>$\\tfrac{' + count.get(v) + '}{36}$</td>').join('') + '</tr></table>';
            const k = count.get(sel);
            out.innerHTML = '$P(X = ' + sel + ') = \\dfrac{' + k + '}{36}' + (frac(k, 36) !== '\\tfrac{' + k + '}{36}' ? ' = ' + frac(k, 36).replace('\\tfrac', '\\dfrac') : '') + ' \\approx ' + texNum(k / 36 * 100, 1) + '\\,\\%$ · ' + k + ' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.';
            math(help); math(tab); math(out);
        }
        render();
    });

    /* ---------- the same expected value, different risk ---------- */
    const GAMES = {
        a: { k: 'Münzwette', say: 'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.', v: [1, -1], p: [1 / 2, 1 / 2], pt: ['\\tfrac12', '\\tfrac12'] },
        b: { k: 'Glücksrad', say: 'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.', v: [9, -1], p: [1 / 10, 9 / 10], pt: ['\\tfrac{1}{10}', '\\tfrac{9}{10}'] },
        c: { k: 'Los', say: 'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.', v: [99, -1], p: [1 / 100, 99 / 100], pt: ['\\tfrac{1}{100}', '\\tfrac{99}{100}'] }
    };
    W('spielstreuung', function (box) {
        let key = 'a', runs = [];
        const ROUNDS = 100, PLAYERS = 8;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(GAMES).map(k => [k, GAMES[k].k]), key, v => { key = v; play(); }, 'Spiel');
        const again = document.createElement('button'); again.type = 'button'; again.className = 'b-btn b-go'; again.textContent = 'Noch einmal spielen'; ctl.appendChild(again);
        const help = div(box, 'b-help');
        const p = new Plot(div(box, ''), { x: [0, ROUNDS], y: [-40, 40], height: 300, xLabel: 'Runde', yLabel: 'Kontostand in €', aria: 'Kontostände von acht Spielern über hundert Runden' });
        const out = div(box, 'b-out');
        const COL = ['lambda', 'cyan', 'phi', 'violet', 'pink', 'blue', 'red', 'white'];
        function sd(G) { const mu = G.v.reduce((s, x, i) => s + x * G.p[i], 0); return Math.sqrt(G.v.reduce((s, x, i) => s + (x - mu) ** 2 * G.p[i], 0)); }
        function play() {
            const G = GAMES[key];
            runs = [];
            for (let j = 0; j < PLAYERS; j++) {
                const r = [0];
                for (let i = 1; i <= ROUNDS; i++) r.push(r[i - 1] + (Math.random() < G.p[0] ? G.v[0] : G.v[1]));
                runs.push(r);
            }
            render();
        }
        function render() {
            const G = GAMES[key], s = sd(G);
            help.innerHTML = G.say;
            const ext = Math.max(12, ...runs.map(r => Math.max(...r.map(Math.abs)))) * 1.1;
            p.view([0, ROUNDS], [-ext, ext]);
            const L = [{ fn: x => s * Math.sqrt(x), color: 'dim', dash: true, width: 1.4, domain: [0, ROUNDS] }, { fn: x => -s * Math.sqrt(x), color: 'dim', dash: true, width: 1.4, domain: [0, ROUNDS] }];
            runs.forEach((r, j) => { for (let i = 1; i <= ROUNDS; i++) L.push({ seg: [[i - 1, r[i - 1]], [i, r[i]]], color: COL[j], width: 1.5 }); });
            p.draw(L);
            const fin = runs.map(r => r[ROUNDS]);
            out.innerHTML = '<p style="margin:0 0 6px">Gewinn $X$ pro Spiel: $' + G.v[0] + '$ € mit $' + G.pt[0] + '$, $' + G.v[1] + '$ € mit $' + G.pt[1] + '$ · $E(X) = ' + G.v[0] + ' \\cdot ' + G.pt[0] + ' + (' + G.v[1] + ') \\cdot ' + G.pt[1] + ' = 0$: Das Spiel ist <b>fair</b>.</p>' +
                '<p style="margin:0 0 6px">Standardabweichung $\\sigma = \\sqrt{V(X)} \\approx ' + texNum(s, 2) + '$ € · gestrichelt: $\\pm\\sigma\\sqrt{n}$, nach 100 Runden $\\pm ' + texNum(s * 10, 1) + '$ €</p>' +
                '<p style="margin:0">Kontostände nach 100 Runden: ' + fin.map(v => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), 0)).join(' · ') + ' €. Gleicher Erwartungswert, aber je größer $\\sigma$, desto weiter liegen Gewinner und Verlierer auseinander: <b>$\\sigma$ misst das Risiko.</b></p>';
            math(help); math(out);
        }
        again.addEventListener('click', play);
        play();
    });

    /* ---------- a fair game ---------- */
    W('fairesspiel', function (box) {
        const S = { e: 2, x: 6, y: 3 };
        let n = 0, sum = 0;
        div(box, 'b-help', 'Beim Schulfest wirft man zwei Würfel. Ein <b>Pasch</b> (zwei gleiche Augenzahlen) bringt den ersten Preis, die <b>Augensumme 7</b> den zweiten, alles andere nichts. Der Einsatz ist in jedem Fall weg.');
        const sl = div(box, '');
        const re = range(sl, { label: 'Einsatz $e$', min: 0.5, max: 5, step: 0.1, value: S.e, fmt: v => fmt(v, 2) + ' €', onInput: v => { S.e = v; reset(); render(); } });
        range(sl, { label: 'Auszahlung bei Pasch', min: 0, max: 20, step: 0.5, value: S.x, fmt: v => fmt(v, 2) + ' €', onInput: v => { S.x = v; reset(); render(); } });
        range(sl, { label: 'Auszahlung bei Summe 7', min: 0, max: 20, step: 0.5, value: S.y, fmt: v => fmt(v, 2) + ' €', onInput: v => { S.y = v; reset(); render(); } });
        math(sl);
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-a="fair">Fairen Einsatz einstellen</button><button type="button" class="b-btn" data-a="sim">1000 Spiele</button><button type="button" class="b-btn b-hintbtn" data-a="reset">Zurücksetzen</button>';
        const tab = div(box, 'b-table-wrap');
        const out = div(box, 'b-out');
        function reset() { n = 0; sum = 0; }
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.a === 'fair') { S.e = Math.min(5, Math.max(0.5, Math.round((S.x + S.y) / 6 * 10) / 10)); re.set(S.e); reset(); }
            else if (b.dataset.a === 'sim') { for (let i = 0; i < 1000; i++) { const a = 1 + rnd(6), c = 1 + rnd(6); sum += (a === c ? S.x : a + c === 7 ? S.y : 0) - S.e; n++; } }
            else reset();
            render();
        });
        function render() {
            const { e, x, y } = S, E = (x + y) / 6 - e, fair = (x + y) / 6;
            const eur = v => (Math.round(v * 100) / 100).toFixed(2).replace('.', '{,}').replace(/^-0\{,\}00$/, '0{,}00');
            const g = v => texNum(v, 2), m = v => (v < 0 ? '(' + eur(v) + ')' : eur(v)), txt = v => eur(v).replace('{,}', ',');
            tab.innerHTML = '<table class="b-table" style="min-width:0"><tr><th>Ergebnis</th><td>Pasch</td><td>Summe 7</td><td>sonst</td></tr>' +
                '<tr><th>Gewinn $x_i$ in €</th><td>$' + eur(x - e) + '$</td><td>$' + eur(y - e) + '$</td><td>$' + eur(-e) + '$</td></tr>' +
                '<tr><th>$P(X = x_i)$</th><td>$\\tfrac{6}{36} = \\tfrac16$</td><td>$\\tfrac{6}{36} = \\tfrac16$</td><td>$\\tfrac{24}{36} = \\tfrac23$</td></tr></table>';
            const verdict = Math.abs(E) < 0.005 ? 'Das Spiel ist <b>fair</b>.' : E < 0 ? 'Für die Spielerin oder den Spieler <b>ungünstig</b>: Die Klasse verdient im Mittel ' + txt(-E) + ' € pro Spiel.' : 'Für die Spielerin oder den Spieler <b>günstig</b>: Die Klasse verliert im Mittel ' + txt(E) + ' € pro Spiel.';
            out.innerHTML = '<p style="margin:0 0 6px">$E(X) = ' + m(x - e) + ' \\cdot \\tfrac16 + ' + m(y - e) + ' \\cdot \\tfrac16 + ' + m(-e) + ' \\cdot \\tfrac23 = \\tfrac{' + g(x) + ' + ' + g(y) + '}{6} - ' + eur(e) + ' \\approx ' + eur(E) + '$ €</p>' +
                '<p style="margin:0 0 6px">' + verdict + ' Fair wäre der Einsatz $e = \\tfrac{' + g(x) + ' + ' + g(y) + '}{6} \\approx ' + eur(fair) + '$ €.</p>' +
                '<p style="margin:0">' + (n ? 'Gespielt: ' + n.toLocaleString('de-DE') + ' Spiele, mittlerer Gewinn <b>' + fmt(sum / n, 3) + ' €</b> pro Spiel (Erwartungswert ' + fmt(E, 3) + ' €).' : 'Lass das Spiel 1000-mal laufen und vergleiche den mittleren Gewinn mit dem Erwartungswert.') + '</p>';
            math(tab); math(out);
        }
        render();
    });
})();
