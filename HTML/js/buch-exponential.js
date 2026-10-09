/* buch-exponential.js — widgets for growth, logarithms and the overview of functions in the book Mathematik · Gymnasium 10
 * (js/buch.js, js/buch-plot.js).
 *   wachstumsmodell   linear, exponential, bounded and logistic growth step by step: recursive and explicit rule, table
 *   logfunktion       f(x) = log_a(x − d) + e with its asymptote, zero and the mirrored exponential function
 *   rechenschieber    a slide rule: adding lengths on the log scale multiplies, lg a + lg b = lg(a·b)
 *   verkettung        f + g, f − g, f · g, f / g, f(g(x)) and g(f(x)) for basic functions, with the term and the domain
 *   expanwendung      N0 · b^(t/T) = Z solved by the logarithm: savings, carbon-14, medicine, bacteria
 *   funktionsklassen  the classes of real functions side by side: typical graphs and a profile (domain, range, zeros …)
 *   skizze            sketching without a calculator: characteristic points and asymptotes one step after the other
 * Looks: js/buch.css (section "Widgets of the Gymnasium 10 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;
    const T2 = (x, d = 2) => texNum(x, d);

    /* ---------- growth models ---------- */
    const MODELS = {
        lin: { k: 'linear', ex: 'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.', B0: 50, p: 20, S: 0, N: 20, t: 'Wochen', y: 'Betrag in €',
            pl: ['Zunahme $d$ pro Schritt', -20, 60, 1], b0: [0, 300, 5] },
        exp: { k: 'exponentiell', ex: 'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.', B0: 200, p: 1.3, S: 0, N: 16, t: 'Stunden', y: 'Anzahl',
            pl: ['Wachstumsfaktor $q$', 0.5, 1.8, 0.01], b0: [10, 1000, 10] },
        bes: { k: 'beschränkt', ex: 'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.', B0: 6, p: 0.15, S: 22, N: 30, t: 'Minuten', y: 'Temperatur in °C',
            pl: ['Anteil $k$ des Abstands pro Schritt', 0.02, 0.6, 0.01], b0: [0, 40, 1], sr: [5, 40, 1] },
        log: { k: 'logistisch', ex: 'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.', B0: 10, p: 0.0008, S: 800, N: 20, t: 'Tage', y: 'kennen es',
            pl: ['Wachstumskonstante $k$', 0.0001, 0.002, 0.0001], b0: [1, 200, 1], sr: [200, 1500, 50] }
    };
    W('wachstumsmodell', function (box) {
        let key = box.dataset.start || 'lin', M, V = {};
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(MODELS).map(k => [k, MODELS[k].k]), key, v => { key = v; build(); }, 'Modell');
        const help = div(box, 'b-help');
        const sl = div(box, '');
        const p = new Plot(div(box, ''), { height: 280, aria: 'Bestand Schritt für Schritt' });
        const out = div(box, 'b-out');
        function step(b) {
            if (key === 'lin') return b + V.p;
            if (key === 'exp') return b * V.p;
            if (key === 'bes') return b + V.p * (V.S - b);
            return b + V.p * b * (V.S - b);
        }
        function build() {
            M = MODELS[key]; V = { B0: M.B0, p: M.p, S: M.S, N: M.N };
            help.textContent = M.ex;
            sl.innerHTML = '';
            range(sl, { label: 'Anfangsbestand $B_0$', min: M.b0[0], max: M.b0[1], step: M.b0[2], value: M.B0, fmt: v => fmt(v, 1), onInput: v => { V.B0 = v; render(); } });
            range(sl, { label: M.pl[0], min: M.pl[1], max: M.pl[2], step: M.pl[3], value: M.p, fmt: v => fmt(v, key === 'log' ? 4 : 2), onInput: v => { V.p = v; render(); } });
            if (M.sr) range(sl, { label: 'Schranke $S$', min: M.sr[0], max: M.sr[1], step: M.sr[2], value: M.S, fmt: v => fmt(v, 0), onInput: v => { V.S = v; render(); } });
            range(sl, { label: 'Anzahl der Schritte', min: 5, max: 40, step: 1, value: M.N, fmt: v => String(v), onInput: v => { V.N = v; render(); } });
            math(sl);
            p.opt.xLabel = 'n'; p.opt.yLabel = M.y;
            render();
        }
        function render() {
            const vals = [V.B0];
            for (let n = 1; n <= V.N; n++) vals.push(step(vals[n - 1]));
            const lo = Math.min(0, ...vals), hi = Math.max(...vals, M.sr ? V.S : 0);
            p.opt.xStep = V.N <= 20 ? 2 : 5;
            p.view([-0.5, V.N + 0.5], [lo - (hi - lo) * 0.05, hi * 1.1 + 1e-6]);
            const L = [];
            for (let n = 1; n <= V.N; n++) L.push({ seg: [[n - 1, vals[n - 1]], [n, vals[n]]], color: 'dim', width: 1.2 });
            if (M.sr) L.push({ hline: V.S, color: 'violet' }, { text: 'S', at: [V.N * 0.02, V.S], color: 'violet' });
            L.push({ pts: vals.map((v, n) => [n, v]), color: 'lambda', r: 3.6 });
            p.draw(L);
            const b = T2(V.B0, 1), q = T2(V.p, key === 'log' ? 4 : 2), S = T2(V.S, 0);
            let rec, expl, say;
            if (key === 'lin') { rec = 'B_{n+1} = B_n ' + (V.p < 0 ? '- ' + T2(-V.p) : '+ ' + q); expl = 'B_n = ' + b + (V.p < 0 ? ' - ' + T2(-V.p) : ' + ' + q) + ' \\cdot n'; say = 'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.'; }
            else if (key === 'exp') { rec = 'B_{n+1} = ' + q + ' \\cdot B_n'; expl = 'B_n = ' + b + ' \\cdot ' + q + '^{\\,n}'; say = 'Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ' + (V.p > 1 ? '+' + fmt((V.p - 1) * 100, 1) + ' % pro Schritt.' : V.p < 1 ? '−' + fmt((1 - V.p) * 100, 1) + ' % pro Schritt (Abnahme).' : 'Der Bestand bleibt gleich.'); }
            else if (key === 'bes') { rec = 'B_{n+1} = B_n + ' + q + ' \\cdot (' + S + ' - B_n)'; expl = 'B_n = ' + S + ' - (' + S + ' - ' + b + ') \\cdot ' + T2(1 - V.p) + '^{\\,n}'; say = 'Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ' + T2(1 - V.p) + '$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.'; }
            else { rec = 'B_{n+1} = B_n + ' + q + ' \\cdot B_n \\cdot (' + S + ' - B_n)'; expl = ''; say = 'Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ' + T2(V.S / 2, 0) + '$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.' + (V.p * V.S > 1.5 ? ' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.' : ''); }
            const show = [0, 1, 2, 3, 4, 5, V.N].filter((n, i, a) => n <= V.N && a.indexOf(n) === i);
            out.innerHTML = '<p style="margin:0 0 6px">rekursiv: $B_0 = ' + b + '$, $\\;' + rec + '$</p>' + (expl ? '<p style="margin:0 0 6px">explizit: $' + expl + '$</p>' : '') +
                '<p style="margin:0 0 8px">' + say + '</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0"><tr><th>$n$</th>' + show.map(n => '<td>' + n + '</td>').join('') + '</tr>' +
                '<tr><th>$B_n$</th>' + show.map(n => '<td class="b-hot">' + fmt(vals[n], 1) + '</td>').join('') + '</tr></table></div>';
            math(out);
        }
        build();
    });

    /* ---------- logarithm functions ---------- */
    W('logfunktion', function (box) {
        const S = { a: 2, d: 0, e: 0 };
        const sl = div(box, '');
        range(sl, { label: 'Basis $a$', min: 0.2, max: 5, step: 0.1, value: S.a, fmt: v => fmt(v, 1), onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Verschiebung $d$ nach rechts', min: -3, max: 3, step: 0.5, value: S.d, fmt: v => fmt(v, 1), onInput: v => { S.d = v; render(); } });
        range(sl, { label: 'Verschiebung $e$ nach oben', min: -3, max: 3, step: 0.5, value: S.e, fmt: v => fmt(v, 1), onInput: v => { S.e = v; render(); } });
        math(sl);
        const p = new Plot(div(box, ''), { x: [-4, 8], y: [-4, 5], height: 340, aria: 'Logarithmusfunktion mit Asymptote' });
        const out = div(box, 'b-out');
        function render() {
            const { a, d, e } = S;
            if (Math.abs(a - 1) < 1e-9) {
                p.draw([{ vline: d }]);
                out.innerHTML = 'Die Basis $a = 1$ ist nicht erlaubt: $1^y$ ist immer $1$, man kann also nicht nach $y$ auflösen.';
                math(out); return;
            }
            const f = x => (x > d ? Math.log(x - d) / Math.log(a) + e : NaN);
            const L = [];
            if (!d && !e) L.push({ fn: x => x, color: 'dim', dash: true, width: 1.2, label: 'y = x', labelAt: 4.3 }, { fn: x => Math.pow(a, x), color: 'cyan', dash: true, width: 1.6, label: 'aˣ', labelAt: a > 1 ? 1.2 : -1.8 });
            L.push({ vline: d, color: 'red' }, { fn: f, color: 'lambda', label: 'f', labelAt: 6.6 }, { pts: [[d + 1, e], [d + a, e + 1]], color: 'white', r: 5 });
            p.draw(L);
            const arg = d ? 'x' + (d > 0 ? ' - ' + T2(d, 1) : ' + ' + T2(-d, 1)) : 'x';
            const lg = '\\log_{' + T2(a, 1) + '}', term = d ? lg + '(' + arg + ')' : lg + ' x';
            const x0 = d + Math.pow(a, -e);
            const zero = !e ? term + ' = 0 \\Rightarrow ' + arg + ' = 1 \\Rightarrow x = ' + T2(d + 1, 1)
                : term + ' = ' + T2(-e, 1) + ' \\Rightarrow ' + arg + ' = ' + T2(a, 1) + '^{' + T2(-e, 1) + '} \\Rightarrow x \\approx ' + T2(x0, 3);
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + term + (e ? (e > 0 ? ' + ' : ' - ') + T2(Math.abs(e), 1) : '') + '$ · ' + (a > 1 ? 'streng monoton <b>steigend</b> ($a > 1$)' : 'streng monoton <b>fallend</b> ($0 < a < 1$)') + '</p>' +
                '<p style="margin:0 0 6px">Definitionsbereich $x > ' + T2(d, 1) + '$ · Wertebereich: alle reellen Zahlen · <span style="color:#e2665a">senkrechte Asymptote</span> $x = ' + T2(d, 1) + '$</p>' +
                '<p style="margin:0">Nullstelle: $' + zero + '$ · weiße Punkte: $(' + T2(d + 1, 1) + ' \\mid ' + T2(e, 1) + ')$ und $(' + T2(d + a, 1) + ' \\mid ' + T2(e + 1, 1) + ')$' +
                (!d && !e ? ' · Gespiegelt an $y = x$ wird daraus die Exponentialfunktion $y = ' + T2(a, 1) + '^x$.' : '') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- slide rule ---------- */
    W('rechenschieber', function (box) {
        const S = { a: 2, b: 3 };
        const sl = div(box, '');
        range(sl, { label: 'Faktor $a$', min: 1, max: 10, step: 0.1, value: S.a, fmt: v => fmt(v, 1), onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Faktor $b$', min: 1, max: 10, step: 0.1, value: S.b, fmt: v => fmt(v, 1), onInput: v => { S.b = v; render(); } });
        math(sl);
        const svgBox = div(box, 'b-svgbox ex-rule');
        const out = div(box, 'b-out');
        const X0 = 40, L = 560, pos = v => L * Math.log10(v);
        const TICKS = [];
        for (let v = 1; v < 10.001; v = Math.round((v + (v < 2 ? 0.1 : v < 5 ? 0.2 : 0.5)) * 10) / 10) TICKS.push(v);
        function scale(off, y, up, name) {
            let s = '<g transform="translate(' + (X0 + off).toFixed(1) + ' 0)"><rect class="ex-tongue' + (up ? ' up' : '') + '" x="-14" y="' + (up ? y - 44 : y) + '" width="' + (L + 28) + '" height="44" rx="6"/>';
            TICKS.forEach(v => {
                const major = Math.abs(v - Math.round(v)) < 1e-9, x = pos(v).toFixed(1), len = major ? 16 : (Math.abs(v * 2 - Math.round(v * 2)) < 1e-9 ? 11 : 7);
                s += '<line class="ex-tick" x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (up ? y - len : y + len) + '"/>';
                if (major) s += '<text class="ex-num" x="' + x + '" y="' + (up ? y - 22 : y + 32) + '" text-anchor="middle">' + v + '</text>';
            });
            return s + '<text class="ex-name" x="-30" y="' + (up ? y - 18 : y + 26) + '" text-anchor="middle">' + name + '</text></g>';
        }
        function render() {
            const { a, b } = S, over = a * b > 10 + 1e-9;
            const off = over ? pos(a) - L : pos(a), xb = X0 + off + pos(b), res = over ? a * b / 10 : a * b;
            let s = '<svg viewBox="0 0 640 200" role="img" aria-label="Rechenschieber: verschiebbare Zunge über einer festen Skala">';
            s += scale(0, 112, false, 'D') + scale(off, 104, true, 'C');
            s += '<line class="ex-cursor" x1="' + xb.toFixed(1) + '" y1="38" x2="' + xb.toFixed(1) + '" y2="176"/>';
            s += '<line class="ex-index" x1="' + (X0 + pos(a)).toFixed(1) + '" y1="52" x2="' + (X0 + pos(a)).toFixed(1) + '" y2="132"/>';
            // the two lengths that are added
            s += '<line class="ex-len a" x1="' + X0 + '" y1="186" x2="' + (X0 + pos(a)).toFixed(1) + '" y2="186"/>';
            if (!over) s += '<line class="ex-len b" x1="' + (X0 + pos(a)).toFixed(1) + '" y1="192" x2="' + xb.toFixed(1) + '" y2="192"/>';
            svgBox.innerHTML = s + '</svg>';
            out.innerHTML = '<p style="margin:0 0 6px">Der Anfang der oberen Skala steht über $a = ' + T2(a, 1) + '$, der Läufer über $b = ' + T2(b, 1) + '$ auf der oberen Skala. Unten liest man ab: <b>$' + T2(res, 2) + '$</b>' + (over ? ' · Weil $a \\cdot b > 10$ ist, steht hier der <b>rechte</b> Index über $a$, man liest $\\tfrac{a \\cdot b}{10}$ ab: $a \\cdot b = ' + T2(a * b, 2) + '$.' : '') + '</p>' +
                '<p style="margin:0">Längen auf der Skala sind Logarithmen: $\\lg ' + T2(a, 1) + ' + \\lg ' + T2(b, 1) + ' = ' + texNum(Math.log10(a), 4) + ' + ' + texNum(Math.log10(b), 4) + ' = ' + texNum(Math.log10(a * b), 4) + ' = \\lg ' + T2(a * b, 2) + '$. Aus dem Addieren der Längen wird ein Multiplizieren der Zahlen.</p>';
            math(out);
        }
        render();
    });

    /* ---------- combining functions ---------- */
    const atom = a => /^[a-z]$/.test(a);                                // a single variable needs no brackets
    const par = a => (atom(a) ? a : '(' + a + ')');
    const FN = {
        lin: { k: 'x + 2', f: x => x + 2, t: a => a + ' + 2' },
        dop: { k: '2x', f: x => 2 * x, t: a => '2' + par(a) },
        sq: { k: 'x²', f: x => x * x, t: a => par(a) + '^2' },
        wur: { k: '√x', f: Math.sqrt, t: a => '\\sqrt{' + a + '}', dom: 'Unter der Wurzel darf keine negative Zahl stehen.' },
        inv: { k: '1/x', f: x => 1 / x, t: a => '\\dfrac{1}{' + a + '}', dom: 'Ein Nenner darf nicht null werden.' },
        exp: { k: '2ˣ', f: x => Math.pow(2, x), t: a => '2^{' + a + '}' },
        sin: { k: 'sin x', f: Math.sin, t: a => '\\sin' + (atom(a) ? ' ' + a : '\\left(' + a + '\\right)') }
    };
    const OPS = [['sum', 'f + g'], ['dif', 'f − g'], ['pro', 'f · g'], ['quo', 'f / g'], ['fg', 'f(g(x))'], ['gf', 'g(f(x))']];
    W('verkettung', function (box) {
        const S = { f: 'sq', g: 'lin', op: 'fg' };
        const r1 = div(box, 'b-ctrls'); r1.innerHTML = '<span class="b-ctrl">$f(x)$:</span>';
        seg(r1, Object.keys(FN).map(k => [k, FN[k].k]), S.f, v => { S.f = v; render(); }, 'Funktion f');
        const r2 = div(box, 'b-ctrls'); r2.innerHTML = '<span class="b-ctrl">$g(x)$:</span>';
        seg(r2, Object.keys(FN).map(k => [k, FN[k].k]), S.g, v => { S.g = v; render(); }, 'Funktion g');
        const r3 = div(box, 'b-ctrls'); r3.innerHTML = '<span class="b-ctrl">Verknüpfung:</span>';
        seg(r3, OPS, S.op, v => { S.op = v; render(); }, 'Verknüpfung');
        math(r1); math(r2);
        const p = new Plot(div(box, ''), { x: [-5, 5], y: [-4, 6], height: 320, aria: 'Zwei Funktionen und ihre Verknüpfung' });
        math(div(box, 'b-help', '<span class="ex-key cyan"></span>$f$ &nbsp; <span class="ex-key violet"></span>$g$ &nbsp; <span class="ex-key lambda"></span>Ergebnis'));
        const out = div(box, 'b-out');
        const wrap = t => (/[+-]/.test(t.replace(/^-/, '')) ? '(' + t + ')' : t);
        function render() {
            const F = FN[S.f], G = FN[S.g], f = F.f, g = G.f;
            const R = { sum: x => f(x) + g(x), dif: x => f(x) - g(x), pro: x => f(x) * g(x), quo: x => f(x) / g(x), fg: x => f(g(x)), gf: x => g(f(x)) }[S.op];
            const ft = F.t('x'), gt = G.t('x');
            const tex = { sum: ft + ' + ' + gt, dif: ft + ' - ' + wrap(gt), pro: wrap(ft) + ' \\cdot ' + wrap(gt), quo: '\\dfrac{' + ft + '}{' + gt + '}', fg: F.t(gt), gf: G.t(ft) }[S.op];
            const name = { sum: '(f + g)(x)', dif: '(f - g)(x)', pro: '(f \\cdot g)(x)', quo: '\\left(\\tfrac{f}{g}\\right)(x)', fg: 'f(g(x))', gf: 'g(f(x))' }[S.op];
            p.draw([{ fn: f, color: 'cyan', dash: true, width: 1.6 }, { fn: g, color: 'violet', dash: true, width: 1.6 }, { fn: R, color: 'lambda', width: 3 }]);
            const notes = [];
            if (S.op === 'fg' || S.op === 'gf') {
                const inner = S.op === 'fg' ? G : F, outer = S.op === 'fg' ? F : G;
                notes.push('Innere Funktion: $' + (S.op === 'fg' ? 'g' : 'f') + '(x) = ' + inner.t('x') + '$, äußere Funktion: $' + (S.op === 'fg' ? 'f' : 'g') + '(u) = ' + outer.t('u') + '$. Man setzt die innere in die äußere ein.');
                if (outer.dom) notes.push(outer.dom + ' Darum muss man prüfen, für welche $x$ die innere Funktion einen erlaubten Wert liefert.');
                else if (inner.dom) notes.push(inner.dom);
            } else {
                [F, G].forEach(H => { if (H.dom && notes.indexOf(H.dom) < 0) notes.push(H.dom); });
                if (S.op === 'quo') notes.push('Beim Quotienten fallen außerdem alle Stellen weg, an denen $g(x) = 0$ ist.');
                notes.push('Der Definitionsbereich ist der Bereich, in dem <b>beide</b> Funktionen definiert sind.');
            }
            if (S.op === 'fg' && S.f !== S.g) notes.push('Im Allgemeinen ist $f(g(x)) \\neq g(f(x))$: Probier die andere Reihenfolge.');
            out.innerHTML = '<p style="margin:0 0 6px">$' + name + ' = ' + tex + '$</p>' + notes.map(n => '<p style="margin:0 0 4px" class="b-help">' + n + '</p>').join('');
            math(out);
        }
        render();
    });

    /* ---------- exponential equations in context ---------- */
    const APPS = {
        zins: { k: 'Sparen', N0: 2000, b: 1.03, T: 1, t: 'Jahre', u: '€', say: '2000 € werden mit 3 % pro Jahr verzinst.', q: 'Wann ist das Kapital auf', Z: 3000, zr: [2100, 8000, 100], x: 50 },
        c14: { k: 'C-14', N0: 100, b: 0.5, T: 5730, t: 'Jahre', u: '%', say: 'Kohlenstoff-14 zerfällt mit einer Halbwertszeit von 5730 Jahren.', q: 'Wann ist der Anteil auf', Z: 30, zr: [1, 99, 1], x: 40000 },
        med: { k: 'Medikament', N0: 400, b: 0.8, T: 1, t: 'Stunden', u: 'mg', say: '400 mg eines Wirkstoffs, der Körper baut pro Stunde 20 % ab.', q: 'Wann sind nur noch', Z: 50, zr: [5, 390, 5], x: 24 },
        bak: { k: 'Bakterien', N0: 500, b: 2, T: 3, t: 'Stunden', u: '', say: '500 Bakterien, die Anzahl verdoppelt sich alle 3 Stunden.', q: 'Wann sind es', Z: 100000, zr: [1000, 1000000, 1000], x: 40 }
    };
    W('expanwendung', function (box) {
        let key = box.dataset.start || 'zins', A = APPS[key], Z = A.Z;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(APPS).map(k => [k, APPS[k].k]), key, v => { key = v; A = APPS[v]; Z = A.Z; build(); }, 'Sachverhalt');
        const help = div(box, 'b-help');
        const sl = div(box, '');
        const p = new Plot(div(box, ''), { height: 280, aria: 'Wachstums- oder Zerfallskurve mit Zielwert' });
        const out = div(box, 'b-out');
        const big = v => (v >= 10000 ? Math.round(v).toLocaleString('de-DE') : fmt(v, 2));
        const bigT = v => (v >= 10000 ? Math.round(v).toLocaleString('de-DE').replace(/\./g, '\\,') : texNum(v, 2));
        function build() {
            help.textContent = A.say;
            sl.innerHTML = '';
            range(sl, { label: 'Zielwert $Z$', min: A.zr[0], max: A.zr[1], step: A.zr[2], value: Z, fmt: v => big(v) + (A.u ? ' ' + A.u : ''), onInput: v => { Z = v; render(); } });
            math(sl);
            p.opt.xLabel = 't in ' + A.t; p.opt.yLabel = A.u ? 'in ' + A.u : 'Anzahl';
            render();
        }
        function render() {
            const f = t => A.N0 * Math.pow(A.b, t / A.T), t = A.T * Math.log(Z / A.N0) / Math.log(A.b);
            const xmax = Math.max(A.x, t * 1.25);
            p.view([0, xmax], [0, Math.max(A.N0, Z) * (A.b > 1 ? 1.6 : 1.12)]);
            p.draw([{ fn: f, color: 'lambda' }, { hline: Z, color: 'cyan' }, { vline: t, color: 'dim' }, { pts: [[t, Z]], color: 'white', r: 6 }]);
            const bt = T2(A.b, 2), ex = A.T === 1 ? 't' : '\\frac{t}{' + A.T + '}', N0 = bigT(A.N0), Zs = bigT(Z);
            out.innerHTML = '<p style="margin:0 0 6px">' + A.q + ' ' + big(Z) + (A.u ? ' ' + A.u : '') + (A.k === 'Medikament' ? ' übrig' : '') + '?</p>' +
                '<p style="margin:0 0 6px">$' + N0 + ' \\cdot ' + bt + '^{' + ex + '} = ' + Zs + ' \\;\\Rightarrow\\; ' + bt + '^{' + ex + '} = \\dfrac{' + Zs + '}{' + N0 + '} \\approx ' + texNum(Z / A.N0, 4) + '$</p>' +
                '<p style="margin:0">$' + (A.T === 1 ? 't' : '\\dfrac{t}{' + A.T + '}') + ' = \\log_{' + bt + '} ' + texNum(Z / A.N0, 4) + ' = \\dfrac{\\lg ' + texNum(Z / A.N0, 4) + '}{\\lg ' + bt + '} \\approx ' + texNum(t / A.T, 3) + '$' +
                (A.T === 1 ? '' : ' $\\;\\Rightarrow\\; t \\approx ' + texNum(t, 1) + '$') + ' ' + A.t + '</p>';
            math(out);
        }
        build();
    });

    /* ---------- classes of functions ---------- */
    const CLASSES = {
        ganz: { k: 'ganzrational', x: [-4, 4], y: [-4, 5], fns: [[x => x * x, 'x²', -1.85], [x => x * x * x - 3 * x, 'x³ − 3x', 2.05], [x => -0.25 * x ** 4 + 2 * x * x - 1, '', 0]],
            rows: [['Term', '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$'], ['Definitionsbereich', 'alle reellen Zahlen'], ['Nullstellen', 'höchstens $n$ Stück (Grad $n$)'],
                ['Verlauf', 'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten'], ['Symmetrie', 'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung']] },
        bruch: { k: 'gebrochenrational', x: [-4, 4], y: [-4, 5], fns: [[x => 1 / x, '1/x', 0.35], [x => 1 / (x * x), '1/x²', -0.65], [x => 2 / (x - 1) + 1, '', 0]],
            rows: [['Term', 'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$'], ['Definitionsbereich', 'alle reellen Zahlen außer den Nullstellen des Nenners'],
                ['Besonderheit', '<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote'], ['Beispiel', 'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke']] },
        wurzel: { k: 'Wurzel', x: [-3, 7], y: [-3, 4], fns: [[x => Math.sqrt(x), '√x', 5], [x => Math.sqrt(x + 2), '', 0], [x => -Math.sqrt(x), '', 0]],
            rows: [['Term', '$\\sqrt{x}$, verschoben oder gestreckt'], ['Definitionsbereich', '$x \\geq 0$ (beim Grundtyp)'], ['Wertebereich', '$y \\geq 0$ (beim Grundtyp)'],
                ['Besonderheit', 'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote']] },
        exp: { k: 'exponentiell', x: [-4, 4], y: [-1, 6], fns: [[x => Math.pow(2, x), '2ˣ', 2.2], [x => Math.pow(0.5, x), '0,5ˣ', -2.6], [x => Math.exp(x), '', 0]],
            rows: [['Term', '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$'], ['Definitionsbereich', 'alle reellen Zahlen'], ['Wertebereich', '$y > 0$ (für $a > 0$), also keine Nullstelle'],
                ['Asymptote', 'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$'], ['Beispiel', 'Wachstum und Zerfall, Zinseszins']] },
        log: { k: 'logarithmisch', x: [-1, 8], y: [-3, 3.5], fns: [[x => Math.log2(x), 'log₂ x', 6], [x => Math.log10(x), 'lg x', 6.6], [x => Math.log(x) / Math.log(0.5), '', 0]],
            rows: [['Term', '$\\log_a x$ mit $a > 0$, $a \\neq 1$'], ['Definitionsbereich', '$x > 0$'], ['Wertebereich', 'alle reellen Zahlen'],
                ['Nullstelle und Asymptote', 'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse'], ['Beispiel', 'Richterskala, Dezibel, pH-Wert']] },
        trig: { k: 'trigonometrisch', x: [-0.3, 2 * Math.PI + 0.3], y: [-3, 3], pi: true, fns: [[Math.sin, 'sin', 1.3], [Math.cos, 'cos', 5.9], [Math.tan, 'tan', 1.05]],
            rows: [['Term', '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$'], ['Definitionsbereich', 'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$'],
                ['Wertebereich', 'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen'], ['Besonderheit', '<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens'], ['Beispiel', 'Schwingungen, Gezeiten, Tageslänge']] }
    };
    W('funktionsklassen', function (box) {
        let key = 'ganz';
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(CLASSES).map(k => [k, CLASSES[k].k]), key, v => { key = v; render(); }, 'Funktionsklasse');
        const p = new Plot(div(box, ''), { height: 290, aria: 'Typische Graphen der gewählten Funktionsklasse' });
        const tab = div(box, 'b-table-wrap');
        const COL = ['lambda', 'cyan', 'phi'];
        function render() {
            const C = CLASSES[key];
            p.opt.piX = !!C.pi; p.view(C.x, C.y);
            p.draw(C.fns.map(([f, lab, at], i) => ({ fn: f, color: COL[i], label: lab, labelAt: at, width: i ? 2 : 2.8 })));
            tab.innerHTML = '<table class="b-table ex-steck">' + C.rows.map(([k, v]) => '<tr><th>' + k + '</th><td>' + v + '</td></tr>').join('') + '</table>';
            math(tab);
        }
        render();
    });

    /* ---------- sketching without a calculator ---------- */
    const SK = [
        { tex: 'f(x) = 2^x - 4', f: x => Math.pow(2, x) - 4, x: [-4, 4], y: [-5, 5], steps: [
            ['Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.', [{ hline: -4, color: 'red' }]],
            ['Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.', [{ pts: [[0, -3]], color: 'cyan', r: 5 }]],
            ['Nullstelle: $2^x = 4 \\Rightarrow x = 2$.', [{ pts: [[2, 0]], color: 'cyan', r: 5 }]],
            ['Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.', [{ pts: [[3, 4]], color: 'cyan', r: 5 }]]] },
        { tex: 'f(x) = -(x - 1)^2 + 4', f: x => -((x - 1) ** 2) + 4, x: [-3, 5], y: [-3, 5], steps: [
            ['Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.', [{ pts: [[1, 4]], color: 'cyan', r: 5 }]],
            ['Nullstellen: $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, also $x = -1$ und $x = 3$.', [{ pts: [[-1, 0], [3, 0]], color: 'cyan', r: 5 }]],
            ['Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.', [{ pts: [[0, 3], [2, 3]], color: 'cyan', r: 5 }, { vline: 1 }]]] },
        { tex: 'f(x) = \\dfrac{1}{x - 2} + 1', f: x => 1 / (x - 2) + 1, x: [-3, 7], y: [-4, 5], steps: [
            ['Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.', [{ vline: 2, color: 'red' }]],
            ['Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.', [{ hline: 1, color: 'red' }]],
            ['Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.', [{ pts: [[1, 0]], color: 'cyan', r: 5 }]],
            ['$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.', [{ pts: [[0, 0.5], [3, 2]], color: 'cyan', r: 5 }]]] },
        { tex: 'f(x) = \\log_2(x + 1)', f: x => (x > -1 ? Math.log2(x + 1) : NaN), x: [-2, 8], y: [-3, 4], steps: [
            ['Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.', [{ vline: -1, color: 'red' }]],
            ['Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.', [{ pts: [[0, 0]], color: 'cyan', r: 5 }]],
            ['Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.', [{ pts: [[1, 1], [3, 2], [7, 3]], color: 'cyan', r: 5 }]]] },
        { tex: 'f(x) = 2\\sin x + 1', f: x => 2 * Math.sin(x) + 1, x: [-0.4, 2 * Math.PI + 0.4], y: [-2, 4], pi: true, steps: [
            ['Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.', [{ hline: 1, color: 'violet' }, { hline: 3 }, { hline: -1 }]],
            ['Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.', [{ pts: [[Math.PI / 2, 3], [3 * Math.PI / 2, -1]], color: 'cyan', r: 5 }]],
            ['Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.', [{ pts: [[0, 1], [Math.PI, 1], [2 * Math.PI, 1]], color: 'cyan', r: 5 }]]] },
        { tex: 'f(x) = x^3 - 4x', f: x => x ** 3 - 4 * x, x: [-3.2, 3.2], y: [-5, 5], steps: [
            ['Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.', [{ pts: [[-2, 0], [0, 0], [2, 0]], color: 'cyan', r: 5 }]],
            ['Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.', []],
            ['Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.', [{ pts: [[1, -3], [-1, 3]], color: 'cyan', r: 5 }]]] }
    ];
    W('skizze', function (box) {
        let k = 0, n = B.printing() ? 99 : 0;                          // on paper: all steps and the graph
        const head = div(box, 'b-out ex-sk-head');
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn b-go" data-a="step">Nächster Schritt</button><button type="button" class="b-btn" data-a="all">Graph zeigen</button>' +
            '<button type="button" class="b-btn b-hintbtn" data-a="next">Andere Funktion</button>';
        const p = new Plot(div(box, ''), { height: 300, aria: 'Skizze: charakteristische Punkte und Asymptoten' });
        const out = div(box, 'b-out');
        function render() {
            const T = SK[k];
            n = Math.min(n, T.steps.length + 1);
            p.opt.piX = !!T.pi; p.view(T.x, T.y);
            const L = [];
            T.steps.slice(0, n).forEach(s => L.push(...s[1]));
            if (n > T.steps.length) L.push({ fn: T.f, color: 'lambda' });
            p.draw(L);
            head.innerHTML = '<b>Skizziere ohne Taschenrechner:</b> $' + T.tex + '$ <span class="b-help">(Funktion ' + (k + 1) + ' von ' + SK.length + ')</span>';
            out.innerHTML = n ? T.steps.slice(0, n).map((s, i) => '<p style="margin:0 0 6px"><span class="tg-step">' + (i + 1) + '</span> ' + s[0] + '</p>').join('') + (n > T.steps.length ? '<p style="margin:0">Jetzt die Punkte glatt verbinden und die Asymptoten beachten. So sieht der Graph aus.</p>' : '')
                : 'Überleg zuerst selbst: Welche Grundfunktion steckt darin? Wie ist sie verschoben oder gestreckt? Dann Schritt für Schritt aufdecken.';
            acts.querySelector('[data-a="step"]').disabled = n > T.steps.length;
            math(head); math(out);
        }
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            const T = SK[k];
            if (b.dataset.a === 'step') n = Math.min(n + 1, T.steps.length + 1);
            else if (b.dataset.a === 'all') n = T.steps.length + 1;
            else { k = (k + 1) % SK.length; n = 0; }
            render();
        });
        render();
    });
})();
