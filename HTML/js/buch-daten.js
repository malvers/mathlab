/* buch-daten.js — data widgets of the book Mathematik · Gymnasium 9, Lernbereich 4 "Auswerten von Daten" (js/buch.js).
 *   mittelwerte  dot plot of a data set with draggable values: mode, median and mean; an outlier on and off
 *   streuung     two data sets with the same mean: range, variance and standard deviation, the spread of B adjustable
 *   histogramm   40 body heights in classes: class width and start adjustable, absolute or relative frequency (data-hero: bars only)
 *   achsentrick  the cut-off axis (bar chart starting at 400 instead of 0) and the picture that grows in two directions
 * Looks: js/buch.css (section "Widgets of the Gymnasium 9 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const f1 = v => (Math.round(v * 10) / 10).toString();

    const sum = xs => xs.reduce((s, x) => s + x, 0);
    const mean = xs => sum(xs) / xs.length;
    function median(xs) {
        const s = xs.slice().sort((a, b) => a - b), n = s.length;
        return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    }
    function modes(xs) {
        const c = new Map(); xs.forEach(x => c.set(x, (c.get(x) || 0) + 1));
        const m = Math.max(...c.values());
        return m < 2 ? [] : [...c.keys()].filter(k => c.get(k) === m).sort((a, b) => a - b);
    }
    const variance = xs => { const m = mean(xs); return sum(xs.map(x => (x - m) ** 2)) / xs.length; };

    // number axis inside an SVG: from a to b, pixel x0..x1 at height y, tick every step
    function axis(a, b, x0, x1, y, step, unit) {
        const X = v => x0 + (v - a) / (b - a) * (x1 - x0);
        let s = '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" class="d-axis"/>';
        for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) {
            s += '<line x1="' + f1(X(v)) + '" y1="' + (y - 4) + '" x2="' + f1(X(v)) + '" y2="' + (y + 4) + '" class="d-tick"/>' +
                '<text x="' + f1(X(v)) + '" y="' + (y + 20) + '" class="d-num" text-anchor="middle">' + fmt(v, 1).replace('-', '−') + '</text>';
        }
        if (unit) s += '<text x="' + x1 + '" y="' + (y + 38) + '" class="d-unit" text-anchor="end">' + unit + '</text>';
        return { s, X };
    }
    function svgX(holder, e) {
        const svg = holder.querySelector('svg'); if (!svg) return null;
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const m = svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()).x : null;
    }

    /* ---------- mode, median, mean ---------- */
    W('mittelwerte', function (box) {
        const BASE = [8, 12, 15, 15, 15, 18, 20, 25, 30], OUT = 75;
        let data = BASE.slice(), outlier = false, drag = -1;
        const ctr = div(box, 'b-ctrls');
        ctr.innerHTML = '<button type="button" class="b-btn b-hintbtn" data-a="out">Ausreißer dazu (75 min)</button><button type="button" class="b-btn" data-a="reset">Zurücksetzen</button>';
        const pic = div(box, 'b-svgbox g-svg d-dots');
        const out = div(box, 'b-out');
        const a = 0, b = 80, x0 = 30, x1 = 610, yA = 170;
        const X = v => x0 + (v - a) / (b - a) * (x1 - x0);
        ctr.addEventListener('click', e => {
            const t = e.target.closest('[data-a]'); if (!t) return;
            if (t.dataset.a === 'reset') { data = BASE.slice(); outlier = false; }
            else { outlier = !outlier; if (outlier) data.push(OUT); else { const i = data.lastIndexOf(OUT); data.splice(i >= 0 ? i : data.length - 1, 1); } }
            render();
        });
        pic.addEventListener('pointerdown', e => {
            const h = e.target.closest('[data-i]'); if (!h) return;
            drag = +h.dataset.i; pic.setPointerCapture(e.pointerId); e.preventDefault();
        });
        pic.addEventListener('pointermove', e => {
            if (drag < 0) return;
            const x = svgX(pic, e); if (x == null) return;
            data[drag] = Math.min(b, Math.max(a, Math.round(a + (x - x0) / (x1 - x0) * (b - a)))); render();
        });
        const end = () => { drag = -1; };
        pic.addEventListener('pointerup', end); pic.addEventListener('pointercancel', end);
        function render() {
            ctr.querySelector('[data-a="out"]').textContent = outlier ? 'Ausreißer weg' : 'Ausreißer dazu (75 min)';
            const ax = axis(a, b, x0, x1, yA, 10, 'Fahrzeit in min');
            let s = ax.s;
            const m = mean(data), md = median(data), mo = modes(data);
            // stacked dots; the one under the pointer keeps its index
            const level = new Map();
            data.forEach((v, i) => {
                const l = level.get(v) || 0; level.set(v, l + 1);
                const cx = X(v), cy = yA - 16 - l * 20;
                s += '<g class="d-dot" data-i="' + i + '"><circle cx="' + f1(cx) + '" cy="' + cy + '" r="16" fill="transparent"/>' +
                    '<circle cx="' + f1(cx) + '" cy="' + cy + '" r="8" class="d-pt' + (i === drag ? ' on' : '') + '"/></g>';
            });
            const mark = (v, col, label, row) => '<line x1="' + f1(X(v)) + '" y1="34" x2="' + f1(X(v)) + '" y2="' + yA + '" style="stroke:' + col + ';stroke-width:2;stroke-dasharray:5 4"/>' +
                '<text x="' + f1(X(v)) + '" y="' + (16 + row * 14) + '" text-anchor="middle" class="d-mark" style="fill:' + col + '">' + label + '</text>';
            const near = Math.abs(X(m) - X(md)) < 60;
            s += mark(md, CY, 'Median', 0) + mark(m, LAM, 'Mittelwert', near ? 1 : 0);
            pic.innerHTML = '<svg viewBox="0 0 640 210" role="img" aria-label="Punktdiagramm der Fahrzeiten mit Median und Mittelwert">' + s + '</svg>';
            const sorted = data.slice().sort((p, q) => p - q), n = sorted.length;
            const midIdx = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
            const list = sorted.map((v, i) => midIdx.includes(i) ? '<b class="g-cy">' + v + '</b>' : String(v)).join(' · ');
            out.innerHTML = '<p style="margin:0">Geordnet ($n = ' + n + '$): ' + list + '</p>' +
                '<p style="margin:0"><span class="g-phi">Modalwert</span> ' + (mo.length ? mo.join(' und ') + ' min' : 'keiner (jeder Wert kommt nur einmal vor)') +
                ' · <span class="g-cy">Median</span> $' + texNum(md, 1) + '$ min · <span class="g-lam">Mittelwert</span> $\\bar{x} = \\tfrac{' + sum(data) + '}{' + n + '} \\approx ' + texNum(m, 2) + '$ min</p>' +
                '<p class="b-help" style="margin:6px 0 0">Zieh die Punkte. Ein einzelner weiter Weg verschiebt den Mittelwert deutlich, den Median kaum.</p>';
            math(out);
        }
        render();
    });

    /* ---------- spread ---------- */
    // monthly mean temperatures in °C of two model towns with the same annual mean (made-up round numbers, not measured)
    const STADT_A = [6, 6, 8, 10, 13, 15, 17, 17, 15, 12, 9, 7];
    const STADT_B = [-1, 1, 6, 11, 16, 20, 23, 22, 17, 12, 6, 2];
    W('streuung', function (box) {
        const S = { f: 1 };
        const sl = div(box, '');
        range(sl, { label: 'Streuung von B', min: 0, max: 1.5, step: 0.05, value: 1, fmt: v => fmt(v * 100, 0) + ' %', onInput: v => { S.f = v; render(); } });
        const pic = div(box, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        function render() {
            const mA = mean(STADT_A), Bv = STADT_B.map(x => mA + S.f * (x - mean(STADT_B)));
            const sets = [['A', 'Stadt am Meer', STADT_A, CY], ['B', 'Stadt im Binnenland', Bv, LAM]];
            const ax = axis(-10, 30, 30, 610, 236, 5, 'Monatsmittel in °C');
            let s = ax.s;
            sets.forEach(([k, name, xs, col], r) => {
                const y = 62 + r * 92, m = mean(xs), sd = Math.sqrt(variance(xs));
                s += '<rect x="' + f1(ax.X(m - sd)) + '" y="' + (y - 26) + '" width="' + f1(ax.X(m + sd) - ax.X(m - sd)) + '" height="52" rx="6" style="fill:' + col + ';opacity:0.12"/>';
                s += '<line x1="' + f1(ax.X(Math.min(...xs))) + '" y1="' + (y + 30) + '" x2="' + f1(ax.X(Math.max(...xs))) + '" y2="' + (y + 30) + '" style="stroke:' + DIM + ';stroke-width:1.4"/>';
                const level = new Map();
                xs.forEach(v => {
                    const key = Math.round(v * 2) / 2, l = level.get(key) || 0; level.set(key, l + 1);
                    s += '<circle cx="' + f1(ax.X(v)) + '" cy="' + (y + 8 - l * 15) + '" r="6.5" style="fill:' + col + ';opacity:0.85"/>';
                });
                s += '<line x1="' + f1(ax.X(m)) + '" y1="' + (y - 30) + '" x2="' + f1(ax.X(m)) + '" y2="' + (y + 30) + '" style="stroke:#fff;stroke-width:2"/>';
                s += '<text x="30" y="' + (y - 34) + '" class="d-mark" style="fill:' + col + '">' + k + ' · ' + name.toUpperCase() + '</text>';
            });
            pic.innerHTML = '<svg viewBox="0 0 640 280" role="img" aria-label="Zwei Datenreihen mit gleichem Mittelwert und unterschiedlicher Streuung">' + s + '</svg>';
            let t = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th></th><th>$\\bar{x}$</th><th>Spannweite</th><th>Varianz $s^2$</th><th>$s$</th></tr>';
            sets.forEach(([k, , xs, col]) => {
                const v = variance(xs);
                t += '<tr><td style="color:' + col + '"><b>' + k + '</b></td><td>' + fmt(mean(xs), 2) + ' °C</td><td>' + fmt(Math.max(...xs) - Math.min(...xs), 1) + ' K</td><td>' + fmt(v, 2) + ' K²</td><td>' + fmt(Math.sqrt(v), 2) + ' K</td></tr>';
            });
            out.innerHTML = t + '</table></div><p class="b-help" style="margin:8px 0 0">Gleiches Jahresmittel, ganz anderes Klima. Der helle Streifen reicht von $\\bar{x} - s$ bis $\\bar{x} + s$. Modellwerte, keine Messdaten.</p>';
            math(out);
        }
        render();
    });

    /* ---------- histogram ---------- */
    // body heights in cm of 40 pupils of a year-9 class (invented sample)
    const GROESSEN = [152, 155, 157, 158, 159, 160, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 167, 168, 168,
        169, 169, 170, 170, 171, 172, 172, 173, 174, 175, 176, 176, 177, 178, 179, 181, 182, 184, 186, 191];
    W('histogramm', function (box) {
        const S = { w: 5, start: 150, rel: false };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['abs', 'absolute Häufigkeit'], ['rel', 'relative Häufigkeit']], 'abs', v => { S.rel = v === 'rel'; render(); }, 'Häufigkeit');
        const sl = div(box, '');
        range(sl, { label: 'Klassenbreite', min: 1, max: 15, step: 1, value: S.w, fmt: v => v + ' cm', onInput: v => { S.w = v; render(); } });
        range(sl, { label: 'Erste Klasse ab', min: 140, max: 152, step: 1, value: S.start, fmt: v => v + ' cm', onInput: v => { S.start = v; render(); } });
        const pic = div(box, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        // data-hero: only the bars (opening of a chapter)
        if (box.dataset.hero != null) { ctr.style.display = 'none'; sl.style.display = 'none'; out.style.display = 'none'; }
        function render() {
            const n = GROESSEN.length, cls = [];
            for (let lo = S.start; lo <= Math.max(...GROESSEN); lo += S.w) cls.push([lo, lo + S.w, GROESSEN.filter(x => x >= lo && x < lo + S.w).length]);
            const top = Math.max(...cls.map(c => c[2]));
            const ax = axis(140, 200, 40, 610, 230, 5, 'Körpergröße in cm');
            const H = 180 / top;
            let s = ax.s;
            cls.forEach(([lo, hi, c]) => {
                if (!c) return;
                s += '<rect x="' + f1(ax.X(lo)) + '" y="' + f1(230 - c * H) + '" width="' + f1(ax.X(hi) - ax.X(lo)) + '" height="' + f1(c * H) + '" class="d-bar"/>';
                if (ax.X(hi) - ax.X(lo) > 22) s += '<text x="' + f1((ax.X(lo) + ax.X(hi)) / 2) + '" y="' + f1(224 - c * H) + '" text-anchor="middle" class="d-num" style="fill:#fff">' +
                    (S.rel ? fmt(c / n * 100, 0) + '%' : c) + '</text>';
            });
            pic.innerHTML = '<svg viewBox="0 0 640 270" role="img" aria-label="Histogramm der Körpergrößen">' + s + '</svg>';
            const best = cls.reduce((p, q) => q[2] > p[2] ? q : p);
            out.innerHTML = '<p style="margin:0">' + cls.length + ' Klassen der Breite ' + S.w + ' cm · häufigste Klasse $[' + best[0] + ';\\,' + best[1] + ')$ mit ' + best[2] + ' von ' + n +
                ' Werten (' + fmt(best[2] / n * 100, 1) + ' %)</p><p class="b-help" style="margin:6px 0 0">Sehr schmale Klassen zeigen fast nur Einzelwerte, sehr breite verwischen alles. Dazwischen erkennt man die Form der Verteilung.</p>';
            math(out);
        }
        render();
    });

    /* ---------- tricks with diagrams ---------- */
    W('achsentrick', function (box) {
        const YEARS = ['2022', '2023', '2024', '2025'], VAL = [412, 418, 431, 437];
        const S = { mode: 'achse', y0: 400 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['achse', 'Abgeschnittene Achse'], ['bild', 'Bild statt Balken']], 'achse', v => { S.mode = v; render(); }, 'Trick');
        const sl = div(box, '');
        const ry = range(sl, { label: 'Achse beginnt bei', min: 0, max: 410, step: 10, value: S.y0, fmt: v => String(v), onInput: v => { S.y0 = v; render(); } });
        const pic = div(box, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        function render() {
            ry.input.closest('.b-range').style.display = S.mode === 'achse' ? '' : 'none';
            let s = '', t = '';
            if (S.mode === 'achse') {
                const y0 = S.y0, top = 440, H = 200 / (top - y0), base = 230;
                for (let v = y0; v <= top; v += (top - y0 > 200 ? 100 : top - y0 > 80 ? 20 : 10)) {
                    const y = base - (v - y0) * H;
                    s += '<line x1="70" y1="' + f1(y) + '" x2="600" y2="' + f1(y) + '" style="stroke:rgba(255,255,255,0.07)"/><text x="62" y="' + f1(y + 5) + '" text-anchor="end" class="d-num">' + v + '</text>';
                }
                s += '<line x1="70" y1="' + base + '" x2="600" y2="' + base + '" class="d-axis"/><line x1="70" y1="20" x2="70" y2="' + base + '" class="d-axis"/>';
                if (y0 > 0) s += '<path d="M62 ' + (base - 8) + ' l16 -6 M62 ' + (base - 2) + ' l16 -6" style="stroke:' + RED + ';stroke-width:2"/>';
                VAL.forEach((v, i) => {
                    const x = 110 + i * 125, h = (v - y0) * H;
                    s += '<rect x="' + x + '" y="' + f1(base - h) + '" width="70" height="' + f1(h) + '" class="d-bar"/>' +
                        '<text x="' + (x + 35) + '" y="' + f1(base - h - 8) + '" text-anchor="middle" class="d-num" style="fill:#fff">' + v + '</text>' +
                        '<text x="' + (x + 35) + '" y="' + (base + 22) + '" text-anchor="middle" class="d-num">' + YEARS[i] + '</text>';
                });
                pic.innerHTML = '<svg viewBox="0 0 640 260" role="img" aria-label="Säulendiagramm Mitglieder eines Sportvereins">' + s + '</svg>';
                const look = (VAL[3] - y0) / (VAL[0] - y0), real = VAL[3] / VAL[0];
                t = '<p style="margin:0">Mitglieder eines Sportvereins. Die letzte Säule <b>wirkt</b> ' + fmt(look, 1) + '-mal so hoch wie die erste.</p>' +
                    '<p style="margin:0">Tatsächlich: $\\tfrac{437}{412} \\approx ' + texNum(real, 3) + '$, also ein Plus von ' + fmt((real - 1) * 100, 1) + ' %.</p>' +
                    (y0 > 0 ? '<p class="g-warn" style="margin:6px 0 0">Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.</p>' : '<p class="g-ok" style="margin:6px 0 0">Achse ab null: Die Höhen sind ehrlich vergleichbar.</p>');
            } else {
                const v0 = 100, v1 = 200, s0 = 70, s1 = s0 * v1 / v0;
                const bag = (x, size, col) => '<rect x="' + x + '" y="' + f1(235 - size) + '" width="' + f1(size) + '" height="' + f1(size) + '" rx="' + f1(size * 0.18) + '" style="fill:' + col + ';opacity:0.3;stroke:' + col + ';stroke-width:2"/>' +
                    '<text x="' + f1(x + size / 2) + '" y="' + f1(235 - size / 2 + 8) + '" text-anchor="middle" class="d-big" style="fill:' + col + '">€</text>';
                s += bag(110, s0, CY) + bag(300, s1, LAM);
                s += '<text x="' + (110 + s0 / 2) + '" y="258" text-anchor="middle" class="d-num">2020: 100 Mio. €</text><text x="' + (300 + s1 / 2) + '" y="258" text-anchor="middle" class="d-num">2025: 200 Mio. €</text>';
                pic.innerHTML = '<svg viewBox="0 0 640 270" role="img" aria-label="Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit">' + s + '</svg>';
                t = '<p style="margin:0">Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.</p>' +
                    '<p style="margin:0">Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.</p>';
            }
            out.innerHTML = t;
            math(out);
        }
        render();
    });
})();
