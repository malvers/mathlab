/* buch-gy11lk.js — widgets of the book "Mathematik · Gymnasium 11 · Leistungskurs" that the other modules do not have
 * (js/buch.js, js/buch-plot.js). The calculus, matrix, vector and stochastics widgets of the other books are used as they are.
 *   titelbildgy11lk  the cover: a curve with its tangent, the ε-δ box around a point, a fixed-point iteration as a cobweb
 *   epsdelta         the ε-δ definition of a limit: pick ε, the widget finds the largest δ that works (or shows that none exists)
 *   stetigkeit       functions defined piece by piece: a parameter glues the pieces together - left and right limit, function value
 *   linapprox        the tangent as the best linear approximation: zoom in until curve and tangent coincide, error and relative error
 *   ablnachdef       the derivative of a^x by definition: (a^h − 1)/h tends to ln a, and only for a = e to 1
 *   produktregel     the product rule as a growing rectangle u · v: two strips u·Δv and v·Δu, the corner Δu·Δv vanishes faster than h
 *   randextrema      local and global extrema on an interval [a; b]: the candidates are the zeros of f' inside and the two ends
 *   drehraum         rotation in space: a house turned about the x-, y- or z-axis with its rotation matrix, in real 3D (B.Raum, js/buch-vektoren.js)
 *   verflechtung     a two-stage production as a Gozinto graph: raw materials → intermediate → end products, C = A · B and r = C · e
 *   rettung          the lifeguard problem: the quickest way over sand and water, time T(x) with its minimum, and the law of refraction
 *   fixpunkt         the fixed-point iteration x(n+1) = φ(x(n)) as a cobweb: attracting, repelling, a 2-cycle, Heron/Newton, with |φ′(x*)|
 * Looks: js/buch.css (section "Widgets of the Gymnasium 11 Leistungskurs chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;
    let uid = 0;
    // a single number in running text: text font with a real minus sign, never TeX (TeX only for formulas)
    const num = (v, d) => fmt(Math.abs(v) < 5e-13 ? 0 : v, d).replace('-', '−');

    /* ---------- the cover ---------- */
    W('titelbildgy11lk', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const path = (f, a, b, n = 200) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
            return d;
        };
        const glow = (d, c, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.13" fill="none" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const dot = (x, y) => '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="6" fill="#fff"/><circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        let art = '';
        // a curve with its tangent at x0 = 1 (the art lives in the band −1.7 < y < 3.2)
        const f = x => 0.18 * x * x * x - 0.75 * x * x + 0.2 * x + 2.2, df = x => 0.54 * x * x - 1.5 * x + 0.2;
        const x0 = 1, y0 = f(x0), m = df(x0);
        // the ε-δ box around the point: a horizontal band of half-height ε, a vertical band of half-width δ
        const eps = 0.42, del = 0.62;
        art += '<rect x="0" y="' + Y(y0 + eps).toFixed(1) + '" width="' + Wd + '" height="' + (Y(y0 - eps) - Y(y0 + eps)).toFixed(1) + '" fill="#F5C242" fill-opacity="0.07"/>';
        art += '<rect x="' + X(x0 - del).toFixed(1) + '" y="' + Y(5).toFixed(1) + '" width="' + (X(x0 + del) - X(x0 - del)).toFixed(1) + '" height="' + (Y(-3) - Y(5)).toFixed(1) + '" fill="#7fd8ee" fill-opacity="0.06"/>';
        [y0 + eps, y0 - eps].forEach(y => { art += '<line x1="0" y1="' + Y(y).toFixed(1) + '" x2="' + Wd + '" y2="' + Y(y).toFixed(1) + '" stroke="#F5C242" stroke-opacity="0.35" stroke-width="1.4" stroke-dasharray="5 7"/>'; });
        [x0 - del, x0 + del].forEach(x => { art += '<line x1="' + X(x).toFixed(1) + '" y1="' + Y(5).toFixed(1) + '" x2="' + X(x).toFixed(1) + '" y2="' + Ht + '" stroke="#7fd8ee" stroke-opacity="0.32" stroke-width="1.4" stroke-dasharray="5 7"/>'; });
        // a fixed-point iteration x -> g(x) as a cobweb on the right, converging to the fixed point on y = x (shifted into the band)
        const ox = 2.9, oy = -1.75, g = x => 1.3 + 0.95 * Math.sin(-0.8 * (x - 1.3));          // slope −0.76 at the fixed point: the web spirals in
        art += '<line x1="' + X(ox).toFixed(1) + '" y1="' + Y(oy).toFixed(1) + '" x2="' + X(ox + 2.6).toFixed(1) + '" y2="' + Y(oy + 2.6).toFixed(1) + '" stroke="#e8edf5" stroke-opacity="0.3" stroke-width="1.6" stroke-dasharray="4 7"/>';
        art += glow(path(x => oy + g(x - ox), ox, ox + 2.6), '#B8A4F2');
        let xn = 0.1, web = '';
        for (let i = 0; i < 14; i++) {
            const yn = g(xn);
            web += (i ? 'L' : 'M') + X(ox + xn).toFixed(1) + ' ' + Y(oy + (i ? xn : 0)).toFixed(1) + 'L' + X(ox + xn).toFixed(1) + ' ' + Y(oy + yn).toFixed(1) + 'L' + X(ox + yn).toFixed(1) + ' ' + Y(oy + yn).toFixed(1);
            xn = yn;
        }
        art += '<path d="' + web + '" stroke="#A0C85A" stroke-width="2.2" fill="none" stroke-opacity="0.9"/>';
        // curve and tangent last, so they lie on top
        art += glow(path(x => y0 + m * (x - x0), -1.5, 3.0), '#7fd8ee', '7 9');
        art += glow(path(f, -2.6, 2.9), '#F5C242');
        art += dot(x0, y0);
        const id = 'tl' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: eine Kurve mit Tangente, der Epsilon-Delta-Streifen um einen Punkt und eine Fixpunktiteration als Spinnennetz">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' +
            '<line x1="0" y1="' + Y(0) + '" x2="' + Wd + '" y2="' + Y(0) + '" stroke="#7fd8ee" stroke-opacity="0.16" stroke-width="1.4"/>' + art + '</g></svg>';
    });

    /* ---------- the epsilon-delta definition ---------- */
    // f, the point x0, the claimed limit L, plot window, TeX, a hole at x0?, an exact delta (TeX) if there is a neat one
    const ED = {
        sq: { k: 'x² bei 1', f: x => x * x, x0: 1, L: 1, x: [-0.6, 2.6], y: [-0.4, 3.2], tex: 'f(x) = x^2', hole: false,
            exact: e => '\\delta = \\sqrt{1 + \\varepsilon} - 1 \\approx ' + texNum(Math.sqrt(1 + e) - 1, 4) },
        luecke: { k: '(x² − 4)/(x − 2) bei 2', f: x => (Math.abs(x - 2) < 1e-12 ? NaN : (x * x - 4) / (x - 2)), x0: 2, L: 4, x: [0, 4], y: [1.5, 6.5], tex: 'f(x) = \\dfrac{x^2 - 4}{x - 2}', hole: true,
            exact: e => '\\delta = \\varepsilon = ' + texNum(e, 3) },
        sinx: { k: 'sin x / x bei 0', f: x => (Math.abs(x) < 1e-12 ? NaN : Math.sin(x) / x), x0: 0, L: 1, x: [-3.2, 3.2], y: [-0.3, 1.5], tex: 'f(x) = \\dfrac{\\sin x}{x}', hole: true },
        wurzel: { k: '√x bei 4', f: x => (x >= 0 ? Math.sqrt(x) : NaN), x0: 4, L: 2, x: [0, 8], y: [0, 3.2], tex: 'f(x) = \\sqrt{x}', hole: false,
            exact: e => '\\delta = (2 + \\varepsilon)^2 - 4 = 4\\varepsilon + \\varepsilon^2 \\text{ rechts, } 4\\varepsilon - \\varepsilon^2 \\text{ links, also } \\delta \\approx ' + texNum(4 * e - e * e, 4) },
        sprung: { k: 'Sprung bei 0', f: x => (x >= 0 ? 1 : -1), x0: 0, L: 1, x: [-2, 2], y: [-1.6, 1.8], tex: 'f(x) = \\begin{cases} -1 & x < 0 \\\\ 1 & x \\geq 0 \\end{cases}', hole: false, jump: true }
    };
    W('epsdelta', function (box) {
        let key = box.dataset.start || 'sq', eps = 0.5;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(ED).map(k => [k, ED[k].k]), key, v => { key = v; render(); }, 'Funktion');
        const sl = div(box, '');
        range(sl, { label: 'Streifenbreite $\\varepsilon$', min: 0.05, max: 1, step: 0.01, value: eps, fmt: v => fmt(v, 2), onInput: v => { eps = v; render(); } });
        math(sl);
        const p = new Plot(div(box, ''), { height: 320, aria: 'Graph mit einem waagerechten Streifen der Breite Epsilon um den Grenzwert und einem senkrechten Streifen der Breite Delta um die Stelle' });
        const out = div(box, 'b-out');
        // the largest delta: walk away from x0 on both sides until a value leaves the epsilon strip
        function delta(S) {
            const span = Math.max(S.x[1] - S.x0, S.x0 - S.x[0]), n = 4000;
            let best = span;
            for (const dir of [-1, 1]) {
                for (let i = 1; i <= n; i++) {
                    const d = span * i / n, v = S.f(S.x0 + dir * d);
                    if (isNaN(v)) continue;
                    if (Math.abs(v - S.L) >= eps) { best = Math.min(best, span * (i - 1) / n); break; }
                }
            }
            return best;
        }
        function render() {
            const S = ED[key], d = delta(S);
            p.view(S.x, S.y);
            const L = [{ polys: [[[S.x[0], S.L - eps], [S.x[1], S.L - eps], [S.x[1], S.L + eps], [S.x[0], S.L + eps]]], color: 'lambda' }];
            if (d > 1e-9) L.push({ polys: [[[S.x0 - d, S.y[0]], [S.x0 + d, S.y[0]], [S.x0 + d, S.y[1]], [S.x0 - d, S.y[1]]]], color: 'cyan' });
            L.push({ hline: S.L, color: 'dim' }, { vline: S.x0, color: 'dim' });
            if (S.jump) L.push({ fn: S.f, color: 'phi', domain: [S.x[0], -1e-9] }, { fn: S.f, color: 'phi', domain: [0, S.x[1]] }, { pts: [[0, 1]], color: 'phi', r: 5 });
            else L.push({ fn: S.f, color: 'phi' });
            if (S.hole) L.push({ pts: [[S.x0, S.L]], color: 'white', r: 5.5 }, { pts: [[S.x0, S.L]], color: '#0a1426', r: 3.2 });
            p.draw(L);
            const lim = '\\lim\\limits_{x \\to ' + texNum(S.x0, 2) + '} f(x) = ' + texNum(S.L, 2);
            out.innerHTML = '<p style="margin:0 0 6px">$' + S.tex + '$, Behauptung: $' + lim + '$. Orange: alle $y$ mit $|y - ' + texNum(S.L, 2) + '| < \\varepsilon = ' + texNum(eps, 2) + '$.</p>' +
                (d > 1e-9
                    ? '<p style="margin:0">Blau: Für alle $x \\neq ' + texNum(S.x0, 2) + '$ mit $|x - ' + texNum(S.x0, 2) + '| < \\delta$ liegt $f(x)$ im orangen Streifen. Das größte passende $\\delta$ ist hier etwa <b>$' + texNum(d, 3) + '$</b>' +
                      (S.exact ? ' (exakt: $' + S.exact(eps) + '$)' : '') + '. Mach $\\varepsilon$ kleiner: Es gibt immer noch ein $\\delta > 0$. Genau das heißt „Grenzwert“.</p>'
                    : '<p style="margin:0"><b>Kein $\\delta$ passt:</b> So nah man der 0 von links auch kommt, dort ist $f(x) = -1$, also mindestens 2 vom behaupteten Grenzwert entfernt. Für $\\varepsilon < 2$ scheitert jede Wahl. Die Funktion hat bei 0 keinen Grenzwert, nur einseitige.</p>');
            math(out);
        }
        render();
    });

    /* ---------- continuity of functions defined piece by piece ---------- */
    const ST = {
        a: { k: 'zwei Parabel- und Geradenstücke', x0: 1, x: [-2, 4], y: [-2, 9], p: ['Parameter $a$', -2, 6, 0.25, 1], need: 3,
            left: (x, a) => x * x + 1, right: (x, a) => a * x - 1, tex: a => 'f(x) = \\begin{cases} x^2 + 1 & x \\leq 1 \\\\ ' + B.co(a) + 'x - 1 & x > 1 \\end{cases}', closed: 'left' },
        b: { k: 'Gerade und Wurzel', x0: 2, x: [-1, 7], y: [-1, 5], p: ['Parameter $a$', 0, 6, 0.25, 2], need: 3,
            left: (x, a) => -x + a, right: (x, a) => Math.sqrt(x - 2) + 1, tex: a => 'f(x) = \\begin{cases} -x' + B.sg(a, 2) + ' & x < 2 \\\\ \\sqrt{x - 2} + 1 & x \\geq 2 \\end{cases}', closed: 'right' },
        c: { k: 'Lücke füllen', x0: 1, x: [-1.5, 3.5], y: [-1, 5], p: ['Funktionswert $b$ an der Stelle 1', 0, 4, 0.25, 1], need: 2, gap: true,
            left: x => x + 1, right: x => x + 1, tex: b => 'f(x) = \\begin{cases} \\dfrac{x^2 - 1}{x - 1} & x \\neq 1 \\\\ ' + texNum(b, 2) + ' & x = 1 \\end{cases}' }
    };
    W('stetigkeit', function (box) {
        let key = box.dataset.start || 'a', S = ST[key], a = S.p[4];
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(ST).map(k => [k, ST[k].k]), key, v => { key = v; S = ST[v]; a = S.p[4]; build(); }, 'Beispiel');
        const sl = div(box, '');
        const p = new Plot(div(box, ''), { height: 300, aria: 'Abschnittsweise definierte Funktion mit Übergangsstelle' });
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            range(sl, { label: S.p[0], min: S.p[1], max: S.p[2], step: S.p[3], value: a, fmt: v => fmt(v, 2), onInput: v => { a = v; render(); } });
            math(sl); render();
        }
        function render() {
            const x0 = S.x0, lv = S.left(x0, a), rv = S.right(x0, a);
            const fx0 = S.gap ? a : S.closed === 'left' ? lv : rv;
            const ok = Math.abs(lv - rv) < 1e-9 && Math.abs(fx0 - lv) < 1e-9;
            p.view(S.x, S.y);
            const L = [{ fn: x => S.left(x, a), color: 'lambda', domain: [S.x[0], x0] }, { fn: x => S.right(x, a), color: 'cyan', domain: [x0, S.x[1]] }, { vline: x0 }];
            // open circles where the piece does not include x0, a filled dot for the function value
            const hollow = (y, c) => { L.push({ pts: [[x0, y]], color: c, r: 5.5 }, { pts: [[x0, y]], color: '#0a1426', r: 3.2 }); };
            if (S.gap) hollow(lv, 'lambda');
            else if (S.closed === 'left') hollow(rv, 'cyan'); else hollow(lv, 'lambda');
            L.push({ pts: [[x0, fx0]], color: 'white', r: 5.5 });
            p.draw(L);
            const T = v => texNum(v, 3);
            let say;
            if (ok) say = '<b>Stetig an der Stelle ' + x0 + ':</b> linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.';
            else if (Math.abs(lv - rv) > 1e-9) say = '<b>Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ' + num(Math.abs(rv - lv), 3) + '. Stetig wird $f$ nur für $' + (S.gap ? 'b' : 'a') + ' = ' + T(S.need) + '$.';
            else say = '<b>Hebbare Unstetigkeit:</b> Der Grenzwert ' + num(lv, 3) + ' existiert, aber der Funktionswert ist ' + num(fx0, 3) + '. Mit $b = ' + T(S.need) + '$ wird die Lücke geschlossen.';
            out.innerHTML = '<p style="margin:0 0 6px">$' + S.tex(a) + '$</p>' +
                '<p style="margin:0 0 6px">$\\lim\\limits_{x \\to ' + x0 + '^-} f(x) = ' + T(lv) + '$, &nbsp; $\\lim\\limits_{x \\to ' + x0 + '^+} f(x) = ' + T(rv) + '$, &nbsp; $f(' + x0 + ') = ' + T(fx0) + '$</p>' +
                '<p style="margin:0">' + say + '</p>';
            math(out);
        }
        build();
    });

    /* ---------- the tangent as linear approximation ---------- */
    const LA = {
        wurzel: { k: '√x bei 4', f: Math.sqrt, df: x => 0.5 / Math.sqrt(x), x0: 4, tex: '\\sqrt{x}', t: 't(x) = 2 + \\tfrac14 (x - 4)' },
        exp: { k: 'eˣ bei 0', f: Math.exp, df: Math.exp, x0: 0, tex: 'e^x', t: 't(x) = 1 + x' },
        sin: { k: 'sin x bei 0', f: Math.sin, df: Math.cos, x0: 0, tex: '\\sin x', t: 't(x) = x' },
        ln: { k: 'ln x bei 1', f: Math.log, df: x => 1 / x, x0: 1, tex: '\\ln x', t: 't(x) = x - 1' },
        quad: { k: 'x² bei 1', f: x => x * x, df: x => 2 * x, x0: 1, tex: 'x^2', t: 't(x) = 1 + 2(x - 1)' }
    };
    W('linapprox', function (box) {
        let key = 'wurzel', z = 2;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(LA).map(k => [k, LA[k].k]), key, v => { key = v; render(); }, 'Funktion');
        const sl = div(box, '');
        range(sl, { label: 'Ausschnitt: halbe Breite $r$', min: 0.01, max: 3, step: 0.01, value: z, fmt: v => fmt(v, 2), onInput: v => { z = v; render(); } });
        math(sl);
        const p = new Plot(div(box, ''), { height: 300, aria: 'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt' });
        const out = div(box, 'b-out');
        function render() {
            const S = LA[key], x0 = S.x0, y0 = S.f(x0), m = S.df(x0), t = x => y0 + m * (x - x0);
            const lo = x0 - z, hi = x0 + z;
            // the vertical window follows the tangent, with room for the curve
            let ymin = Infinity, ymax = -Infinity;
            for (let i = 0; i <= 200; i++) { const x = lo + (hi - lo) * i / 200, a = S.f(x), b = t(x); if (isFinite(a)) { ymin = Math.min(ymin, a, b); ymax = Math.max(ymax, a, b); } }
            const pad = (ymax - ymin) * 0.15 || z * 0.2;
            p.view([lo, hi], [ymin - pad, ymax + pad]);
            p.draw([{ fn: t, color: 'cyan', width: 2, dash: true, label: 't', labelAt: lo + (hi - lo) * 0.85 }, { fn: S.f, color: 'lambda', label: 'f', labelAt: lo + (hi - lo) * 0.12 },
                { pts: [[x0, y0]], color: 'white', r: 5.5 }]);
            const err = Math.max(Math.abs(S.f(hi) - t(hi)), isFinite(S.f(lo)) ? Math.abs(S.f(lo) - t(lo)) : 0);
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + S.tex + '$, Tangente in $x_0 = ' + x0 + '$: $' + S.t + '$, also $f(x_0 + h) \\approx f(x_0) + f\'(x_0) \\cdot h$.</p>' +
                '<p style="margin:0">Am Rand des Ausschnitts ($h = \\pm' + texNum(z, 2) + '$) weicht die Tangente höchstens um ' + num(err, 6) + ' ab, das sind ' + num(err / z, 4) +
                ' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.</p>';
            math(out);
        }
        render();
    });

    /* ---------- the derivative of a^x by definition ---------- */
    W('ablnachdef', function (box) {
        let a = 2, k = 1;
        const sl = div(box, '');
        const ra = range(sl, { label: 'Basis $a$', min: 0.5, max: 5, step: 0.01, value: a, fmt: v => fmt(v, 2), onInput: v => { a = v; render(); } });
        range(sl, { label: 'Schrittweite $h = 10^{-k}$', min: 0, max: 6, step: 1, value: k, fmt: v => 'k = ' + v, onInput: v => { k = v; render(); } });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn b-hintbtn">$a = e$ setzen</button>';
        math(sl); math(acts);
        const p = new Plot(div(box, ''), { x: [-2.5, 2.5], y: [-0.5, 4.5], height: 280, aria: 'Graph von a hoch x mit Sekante durch (0|1) und Tangente' });
        const out = div(box, 'b-out');
        acts.addEventListener('click', () => { a = Math.E; ra.set(a); render(); });
        function render() {
            const h = Math.pow(10, -k), q = (Math.pow(a, h) - 1) / h, L = Math.log(a);
            p.draw([{ fn: x => Math.pow(a, x), color: 'lambda', label: 'aˣ', labelAt: 1.5 }, { fn: x => 1 + L * x, color: 'cyan', dash: true, width: 1.6, label: 'Tangente', labelAt: -2.2 },
                { fn: x => 1 + q * x, color: 'phi', width: 1.6 }, { pts: [[0, 1], [h, Math.pow(a, h)]], color: 'white', r: 4.5 }]);
            const rows = [1, 0.1, 0.01, 0.001, 0.0001, 0.000001];
            out.innerHTML = '<p style="margin:0 0 6px">$\\dfrac{a^{x + h} - a^x}{h} = a^x \\cdot \\dfrac{a^h - 1}{h}$: Es genügt, den Grenzwert von $\\dfrac{a^h - 1}{h}$ für $h \\to 0$ zu kennen, den Anstieg in $(0 \\mid 1)$.</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0"><tr><th>$h$</th>' + rows.map(v => '<td>' + num(v, 6) + '</td>').join('') + '</tr>' +
                '<tr><th>$\\frac{a^h - 1}{h}$</th>' + rows.map(v => '<td' + (Math.abs(v - h) < 1e-12 ? ' class="b-hot"' : '') + '>' + num((Math.pow(a, v) - 1) / v, 5) + '</td>').join('') + '</tr></table></div>' +
                '<p style="margin:8px 0 0">Für $a = ' + texNum(a, 3) + '$ geht der Quotient gegen $\\ln a \\approx ' + texNum(L, 5) + '$, also $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. ' +
                (Math.abs(a - Math.E) < 0.005 ? '<b>Für $a = e$ ist der Grenzwert genau 1: $\\left(e^x\\right)\' = e^x$.</b>' : 'Bei welcher Basis ist der Grenzwert genau 1?') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- the product rule as a rectangle ---------- */
    W('produktregel', function (box) {
        const u = x => x + 1, du = () => 1, v = x => 0.5 * x * x + 1, dv = x => x;
        const x0 = 1.5;
        let h = 0.6;
        const sl = div(box, '');
        range(sl, { label: 'Zuwachs $h$ von $x$', min: 0.02, max: 1, step: 0.01, value: h, fmt: v => fmt(v, 2), onInput: v => { h = v; render(); } });
        math(sl);
        const svgBox = div(box, 'b-svgbox lk-prod');
        const out = div(box, 'b-out');
        function render() {
            const U = u(x0), V = v(x0), dU = u(x0 + h) - U, dV = v(x0 + h) - V;
            const k = 80, ox = 110, oy = 350;                      // 1 unit = 80 px, origin bottom left
            const R = (x, y, w, hh, cls) => '<rect class="' + cls + '" x="' + (ox + k * x).toFixed(1) + '" y="' + (oy - k * (y + hh)).toFixed(1) + '" width="' + (k * w).toFixed(1) + '" height="' + (k * hh).toFixed(1) + '"/>';
            const T = (x, y, t, cls) => '<text class="' + (cls || 'lk-lab') + '" x="' + (ox + k * x).toFixed(1) + '" y="' + (oy - k * y).toFixed(1) + '" text-anchor="middle">' + t + '</text>';
            let s = '<svg viewBox="0 0 560 380" role="img" aria-label="Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke">';
            s += R(0, 0, U, V, 'lk-uv') + R(U, 0, dU, V, 'lk-du') + R(0, V, U, dV, 'lk-dv') + R(U, V, dU, dV, 'lk-dd');
            s += T(U / 2, V / 2, 'u · v') + T(U + dU / 2, V / 2 - 0.2, 'v·Δu', 'lk-lab lk-small') + T(U / 2, V + dV / 2 - 0.08, 'u·Δv', 'lk-lab lk-small');
            s += T(U / 2, -0.25, 'u = ' + fmt(U, 2), 'lk-axis') + T(-0.6, V / 2, 'v = ' + fmt(V, 2), 'lk-axis');
            svgBox.innerHTML = s + '</svg>';
            const dA = (U + dU) * (V + dV) - U * V;
            out.innerHTML = '<p style="margin:0 0 6px">$u(x) = x + 1$, $v(x) = \\tfrac12 x^2 + 1$ bei $x = 1{,}5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:</p>' +
                '<p style="margin:0 0 6px">$\\dfrac{\\Delta(uv)}{h} = u \\cdot \\dfrac{\\Delta v}{h} + v \\cdot \\dfrac{\\Delta u}{h} + \\Delta u \\cdot \\dfrac{\\Delta v}{h} = ' +
                texNum(U * dV / h, 3) + ' + ' + texNum(V * dU / h, 3) + ' + ' + texNum(dU * dV / h, 3) + ' = ' + texNum(dA / h, 3) + '$</p>' +
                '<p style="margin:0">Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $u\\,v\' + u\'\\,v = ' + texNum(U * dv(x0) + du() * V, 3) + '$: die <b>Produktregel</b>.</p>';
            math(out);
        }
        render();
    });

    /* ---------- local and global extrema on an interval ---------- */
    const RE = {
        kub: { k: 'x³ − 3x', f: x => x ** 3 - 3 * x, df: x => 3 * x * x - 3, tex: 'x^3 - 3x', a: -2, b: 3, view: [-3, 4], y: [-5, 20] },
        quart: { k: 'x⁴ − 2x²', f: x => x ** 4 - 2 * x * x, df: x => 4 * x ** 3 - 4 * x, tex: 'x^4 - 2x^2', a: -1.5, b: 2, view: [-2.5, 2.5], y: [-2, 9] },
        xex: { k: 'x · e⁻ˣ', f: x => x * Math.exp(-x), df: x => (1 - x) * Math.exp(-x), tex: 'x\\,e^{-x}', a: -0.5, b: 4, view: [-1, 6], y: [-1.8, 0.8] },
        sin: { k: 'sin x + x/2', f: x => Math.sin(x) + x / 2, df: x => Math.cos(x) + 0.5, tex: '\\sin x + \\tfrac{x}{2}', a: 0, b: 6, view: [-0.5, 7], y: [-0.8, 4.5] }
    };
    W('randextrema', function (box) {
        let key = 'kub', S = RE[key], a = S.a, b = S.b;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(RE).map(k => [k, RE[k].k]), key, v => { key = v; S = RE[v]; a = S.a; b = S.b; build(); }, 'Funktion');
        const sl = div(box, '');
        const p = new Plot(div(box, ''), { height: 300, aria: 'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema' });
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            range(sl, { label: 'linker Rand $a$', min: S.view[0], max: S.view[1], step: 0.1, value: a, fmt: v => fmt(v, 1), onInput: v => { a = Math.min(v, b - 0.2); render(); } });
            range(sl, { label: 'rechter Rand $b$', min: S.view[0], max: S.view[1], step: 0.1, value: b, fmt: v => fmt(v, 1), onInput: v => { b = Math.max(v, a + 0.2); render(); } });
            math(sl); render();
        }
        // zeros of f' with a sign change inside ]a; b[ (scan and bisect); grid points where f' is exactly 0
        // are skipped, the bracket runs from the last point with a nonzero sign
        function crit() {
            const out = [], n = 600;
            let xl = a, sl = Math.sign(S.df(a));
            for (let i = 1; i <= n; i++) {
                const xi = a + (b - a) * i / n, si = Math.sign(S.df(xi));
                if (!si) continue;
                if (sl && si !== sl) {
                    let x0 = xl, x1 = xi;
                    for (let k = 0; k < 50; k++) { const m = (x0 + x1) / 2; if (Math.sign(S.df(m)) === sl) x0 = m; else x1 = m; }
                    const x = (x0 + x1) / 2;
                    if (x > a + 1e-9 && x < b - 1e-9) out.push({ x, y: S.f(x), kind: sl > 0 ? 'lokales Maximum' : 'lokales Minimum' });
                }
                xl = xi; sl = si;
            }
            return out;
        }
        function render() {
            const C = crit(), cands = C.concat([{ x: a, y: S.f(a), kind: 'Rand' }, { x: b, y: S.f(b), kind: 'Rand' }]);
            const ymax = Math.max(...cands.map(c => c.y)), ymin = Math.min(...cands.map(c => c.y));
            p.view(S.view, S.y);
            const L = [{ polys: [[[a, S.y[0]], [b, S.y[0]], [b, S.y[1]], [a, S.y[1]]]], color: 'cyan' }, { fn: S.f, color: 'dim', width: 1.4 }, { fn: S.f, color: 'lambda', domain: [a, b], width: 3 },
                { pts: cands.map(c => [c.x, c.y]), color: 'white', r: 4.5 }];
            cands.filter(c => Math.abs(c.y - ymax) < 1e-9).forEach(c => L.push({ pts: [[c.x, c.y]], color: 'red', r: 7 }));
            cands.filter(c => Math.abs(c.y - ymin) < 1e-9).forEach(c => L.push({ pts: [[c.x, c.y]], color: 'phi', r: 7 }));
            p.draw(L);
            const T = v => texNum(v, 3);
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + S.tex + '$ auf $[' + T(a) + ';\\, ' + T(b) + ']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.</p>' +
                '<div class="b-table-wrap"><table class="b-table" style="min-width:0"><tr><th>$x$</th>' + cands.map(c => '<td>' + num(c.x, 3) + '</td>').join('') + '</tr>' +
                '<tr><th>$f(x)$</th>' + cands.map(c => '<td' + (Math.abs(c.y - ymax) < 1e-9 || Math.abs(c.y - ymin) < 1e-9 ? ' class="b-hot"' : '') + '>' + num(c.y, 3) + '</td>').join('') + '</tr>' +
                '<tr><th>Art</th>' + cands.map(c => '<td>' + c.kind + '</td>').join('') + '</tr></table></div>' +
                '<p style="margin:8px 0 0"><span style="color:#e2665a">Globales Maximum</span> ' + num(ymax, 3) + ', <span style="color:rgb(160,200,90)">globales Minimum</span> ' + num(ymin, 3) + ' auf dem Intervall. ' +
                (cands.some(c => c.kind === 'Rand' && (Math.abs(c.y - ymax) < 1e-9 || Math.abs(c.y - ymin) < 1e-9)) ? 'Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.' : 'Hier liegen beide globalen Extrema im Inneren.') + '</p>';
            math(out);
        }
        build();
    });

    /* ---------- rotation in space ---------- */
    const HOUSE = {
        v: [[1, 0, 0], [3, 0, 0], [3, 2, 0], [1, 2, 0], [1, 0, 2], [3, 0, 2], [3, 2, 2], [1, 2, 2], [1, 1, 3], [3, 1, 3]],
        e: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [7, 8], [5, 9], [6, 9], [8, 9]],
        f: [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 9, 8], [7, 6, 9, 8], [4, 8, 7], [5, 9, 6]],
        P: 6                                                       // the marked corner (3 | 2 | 2)
    };
    W('drehraum', function (box) {
        if (!B.Raum) { div(box, 'b-help', 'Dieses Bild braucht js/buch-vektoren.js.'); return; }
        let axis = box.dataset.axis || 'z', phi = 90;
        const ctl = div(box, 'b-ctrls');
        ctl.innerHTML = '<span class="b-ctrl">Drehachse:</span>';
        seg(ctl, [['x', 'x-Achse'], ['y', 'y-Achse'], ['z', 'z-Achse']], axis, v => { axis = v; draw(); }, 'Drehachse');
        const sl = div(box, '');
        range(sl, { label: 'Drehwinkel $\\varphi$', min: 0, max: 360, step: 15, value: phi, fmt: v => v + '°', onInput: v => { phi = v; draw(); } });
        math(sl);
        const R = new B.Raum(box, { height: 380, aria: 'Ein Haus wird im Raum um eine Koordinatenachse gedreht' });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function matrix() {
            const r = phi * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
            if (axis === 'x') return [[1, 0, 0], [0, c, -s], [0, s, c]];
            if (axis === 'y') return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
            return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
        }
        function draw() {
            const D = matrix(), rot = p => D.map(row => row[0] * p[0] + row[1] * p[1] + row[2] * p[2]);
            const V = HOUSE.v, V2 = V.map(rot), P = V[HOUSE.P], P2 = V2[HOUSE.P];
            R.ready.then(() => {
                R.clear();
                const ax = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[axis];
                R.line(ax.map(v => -5.6 * v), ax.map(v => 5.6 * v), 'red', { dash: true, opacity: 0.9 });
                HOUSE.e.forEach(([i, j]) => R.line(V[i], V[j], 'lambda', { opacity: 0.85 }));
                HOUSE.f.forEach(f => R.face(f.map(i => V[i]), 'lambda', 0.08));
                HOUSE.e.forEach(([i, j]) => R.rod(V2[i], V2[j], 'cyan', 0.03));
                HOUSE.f.forEach(f => R.face(f.map(i => V2[i]), 'cyan', 0.2));
                R.dot(P, 'lambda', 0.12); R.dot(P2, 'cyan', 0.12);
                R.label('P', P.map((v, i) => v + [0.2, 0.25, 0.35][i]), 'lambda');
                R.label('P′', P2.map((v, i) => v + [0.2, 0.25, 0.35][i]), 'cyan');
                R.render();
            });
            const n = v => texNum(Math.abs(v) < 1e-9 ? 0 : v, 3);
            const mt = M => '\\begin{pmatrix} ' + M.map(r => r.map(n).join(' & ')).join(' \\\\ ') + ' \\end{pmatrix}';
            const vt = a => '\\begin{pmatrix} ' + a.map(n).join(' \\\\ ') + ' \\end{pmatrix}';
            out.innerHTML = '<p style="margin:0 0 6px">Drehung um die ' + axis + '-Achse um ' + phi + '°: $D_' + axis + ' = ' + mt(D) + '$</p>' +
                '<p style="margin:0">$D_' + axis + ' \\cdot \\vec{P} = ' + mt(D) + ' \\cdot ' + vt(P) + ' = ' + vt(P2) + '$. Die Koordinate längs der Drehachse bleibt gleich, ' +
                'die beiden anderen werden wie in der Ebene gedreht.</p>';
            math(out);
        }
        draw();
    });

    /* ---------- a two-stage production (Gozinto graph) ---------- */
    const GZ = {
        r: ['Kakao', 'Zucker', 'Milch'], z: ['Zartbitter', 'Vollmilch'], e: ['Classic', 'Mix'],
        A: [[3, 1], [1, 2], [0, 2]],                               // raw material per intermediate product
        B: [[2, 1], [1, 3]]                                        // intermediate per end product
    };
    W('verflechtung', function (box) {
        const q = [10, 5];
        const sl = div(box, '');
        range(sl, { label: 'Tafeln „Classic“ $e_1$', min: 0, max: 30, step: 1, value: q[0], onInput: v => { q[0] = v; render(); } });
        range(sl, { label: 'Boxen „Mix“ $e_2$', min: 0, max: 30, step: 1, value: q[1], onInput: v => { q[1] = v; render(); } });
        math(sl);
        const stage = div(box, 'b-svgbox lk-gz');
        const out = div(box, 'b-out');
        const mul = (P, Q) => P.map(row => Q[0].map((_, j) => row.reduce((s, a, t) => s + a * Q[t][j], 0)));
        const C = mul(GZ.A, GZ.B);
        const id = 'lkgz' + (++uid);
        const RX = 78, ZX = 290, EX = 500, RY = [55, 150, 245], ZY = [95, 205], EY = [95, 205];
        function edge(x1, y1, x2, y2, k) {
            // from the right side of one box to the left side of the next; the number chip sits near the start,
            // in the middle the chips of two crossing arrows would cover each other
            const a = [x1 + 56, y1], b = [x2 - 60, y2], m = [a[0] + (b[0] - a[0]) * 0.3, a[1] + (b[1] - a[1]) * 0.3];
            return '<line class="lk-gz-edge" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" marker-end="url(#' + id + ')"/>' +
                '<circle class="lk-gz-chip" cx="' + m[0] + '" cy="' + m[1] + '" r="12"/><text class="lk-gz-num" x="' + m[0] + '" y="' + (m[1] + 5) + '">' + k + '</text>';
        }
        const node = (x, y, cls, name, sub, qty) => '<rect class="lk-gz-node ' + cls + '" x="' + (x - 56) + '" y="' + (y - 26) + '" width="112" height="52" rx="12"/>' +
            '<text class="lk-gz-name" x="' + x + '" y="' + (y - 4) + '">' + name + '</text><text class="lk-gz-sub" x="' + x + '" y="' + (y + 16) + '">' + sub + '</text>' +
            (qty === undefined ? '' : '<text class="lk-gz-qty" x="' + x + '" y="' + (y + 46) + '">' + qty + ' ME</text>');
        function render() {
            const z = mul(GZ.B, [[q[0]], [q[1]]]).map(r => r[0]), r = mul(GZ.A, [[z[0]], [z[1]]]).map(v => v[0]);
            let svg = '<svg viewBox="0 0 580 300" role="img" aria-label="Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen">' +
                '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="lk-gz-tip"/></marker></defs>';
            GZ.A.forEach((row, i) => row.forEach((k, j) => { if (k) svg += edge(RX, RY[i], ZX, ZY[j], k); }));
            GZ.B.forEach((row, i) => row.forEach((k, j) => { if (k) svg += edge(ZX, ZY[i], EX, EY[j], k); }));
            GZ.r.forEach((n, i) => { svg += node(RX, RY[i], 'lk-gz-r', 'R' + (i + 1), n, r[i]); });
            GZ.z.forEach((n, i) => { svg += node(ZX, ZY[i], 'lk-gz-z', 'Z' + (i + 1), n, z[i]); });
            GZ.e.forEach((n, i) => { svg += node(EX, EY[i], 'lk-gz-e', 'E' + (i + 1), n, q[i]); });
            stage.innerHTML = svg + '</svg>';
            const mt = M => '\\begin{pmatrix} ' + M.map(row => row.join(' & ')).join(' \\\\ ') + ' \\end{pmatrix}';
            const vt = a => '\\begin{pmatrix} ' + a.join(' \\\\ ') + ' \\end{pmatrix}';
            out.innerHTML = '<p style="margin:0 0 6px">Zwischenprodukte: $\\vec{z} = B \\cdot \\vec{e} = ' + mt(GZ.B) + ' \\cdot ' + vt(q) + ' = ' + vt(z) + '$, ' +
                'Rohstoffe: $\\vec{r} = A \\cdot \\vec{z} = ' + mt(GZ.A) + ' \\cdot ' + vt(z) + ' = ' + vt(r) + '$</p>' +
                '<p style="margin:0">In einem Schritt: $C = A \\cdot B = ' + mt(C) + '$ gibt den Rohstoffbedarf je Endprodukt an, und $C \\cdot \\vec{e} = ' + vt(r) + '$. ' +
                'Für ' + q[0] + ' Tafeln und ' + q[1] + ' Boxen braucht man <b>' + r[0] + ' ME Kakao, ' + r[1] + ' ME Zucker und ' + r[2] + ' ME Milch</b>.</p>';
            math(out);
        }
        render();
    });

    /* ---------- the lifeguard: the quickest way over sand and water ---------- */
    W('rettung', function (box) {
        const A = [0, 30], Bp = [50, -20];
        let v1 = 6, v2 = 2, x = 30;
        const sl = div(box, '');
        range(sl, { label: 'Tempo im Sand $v_1$ (m/s)', min: 3, max: 8, step: 0.5, value: v1, fmt: v => fmt(v, 1), onInput: v => { v1 = v; render(); } });
        range(sl, { label: 'Tempo im Wasser $v_2$ (m/s)', min: 1, max: 4, step: 0.5, value: v2, fmt: v => fmt(v, 1), onInput: v => { v2 = v; render(); } });
        math(sl);
        const grid = div(box, 'b-grid2');
        const p = new Plot(div(grid, ''), { x: [-6, 56], y: [-26, 36], height: 300, aria: 'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B' });
        const q = new Plot(div(grid, ''), { x: [-2, 52], y: [0, 40], height: 300, yLabel: 'T in s', aria: 'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht' });
        const out = div(box, 'b-out');
        const hs = [{ x, y: 0, color: 'white', fixY: true, snap: 0.5 }];
        p.handles(hs, (i, nx) => { x = Math.min(50, Math.max(0, nx)); hs[0].x = x; render(); });
        const T = u => Math.hypot(u - A[0], A[1]) / v1 + Math.hypot(Bp[0] - u, Bp[1]) / v2;
        function best() {                                          // T is convex: ternary search
            let lo = 0, hi = 50;
            for (let k = 0; k < 80; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (T(m1) < T(m2)) hi = m2; else lo = m1; }
            return (lo + hi) / 2;
        }
        function render() {
            const xb = best(), Tb = T(xb), Tmax = Math.max(T(0), T(50));
            p.draw([
                { polys: [[[-6, 0], [56, 0], [56, 36], [-6, 36]]], color: 'lambda' },
                { polys: [[[-6, 0], [56, 0], [56, -26], [-6, -26]]], color: 'cyan' },
                { seg: [A, [xb, 0]], color: 'phi', dash: true, width: 1.4 }, { seg: [[xb, 0], Bp], color: 'phi', dash: true, width: 1.4 },
                { seg: [A, [x, 0]], color: 'white', width: 2.6 }, { seg: [[x, 0], Bp], color: 'white', width: 2.6 },
                { pts: [A, Bp], color: 'red', r: 6 },
                { text: 'A', at: [A[0] + 1, A[1] - 2], color: 'red' }, { text: 'B', at: Bp, color: 'red' }, { text: 'P', at: [x + 1, 2], color: 'white' },
                { text: 'Sand', at: [40, 30], color: 'lambda', italic: false }, { text: 'Wasser', at: [2, -18], color: 'cyan', italic: false }
            ]);
            q.view([-2, 52], [0, Math.ceil(Tmax / 5) * 5 + 5]);
            q.draw([
                { fn: T, color: 'lambda', label: 'T(x)', domain: [0, 50] },
                { pts: [[xb, Tb]], color: 'phi', r: 6 }, { pts: [[x, T(x)]], color: 'white', r: 5 }
            ]);
            const al = Math.atan2(x - A[0], A[1]), be = Math.atan2(Bp[0] - x, -Bp[1]);
            const ab = Math.atan2(xb, A[1]), bb = Math.atan2(Bp[0] - xb, -Bp[1]);
            const d = (v, k) => texNum(v, k === undefined ? 1 : k), deg = r => texNum(r * 180 / Math.PI, 1) + '°';
            out.innerHTML = '<p style="margin:0 0 6px">$T(x) = \\dfrac{\\sqrt{30^2 + x^2}}{' + d(v1) + '} + \\dfrac{\\sqrt{20^2 + (50 - x)^2}}{' + d(v2) + '}$. ' +
                'Bei $x = ' + d(x) + '$ m braucht sie ' + num(T(x), 2) + ' s, am schnellsten ist sie bei <b>$x \\approx ' + d(xb) + '$ m</b> mit ' + num(Tb, 2) + ' s (grün).</p>' +
                '<p style="margin:0">Winkel zum Lot: im Sand $\\alpha = ' + deg(al) + '$, im Wasser $\\beta = ' + deg(be) + '$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ' +
                '$\\dfrac{\\sin ' + deg(ab) + '}{' + d(v1) + '} \\approx ' + d(Math.sin(ab) / v1, 4) + '$ und $\\dfrac{\\sin ' + deg(bb) + '}{' + d(v2) + '} \\approx ' + d(Math.sin(bb) / v2, 4) + '$, das Brechungsgesetz.</p>';
            math(out);
        }
        render();
    });

    /* ---------- fixed-point iteration as a cobweb ---------- */
    const FP = {
        cos: { k: 'cos x', tex: '\\cos x', f: Math.cos, d: x => -Math.sin(x), fix: 0.7390851332151607, x0: 1, v: [-0.2, 1.6, -0.2, 1.3] },
        wurzel: { k: '√(x + 2)', tex: '\\sqrt{x + 2}', f: x => Math.sqrt(x + 2), d: x => 0.5 / Math.sqrt(x + 2), fix: 2, x0: 0, v: [-0.5, 3.2, -0.3, 2.6] },
        langsam: { k: 'x − (x² − 2)/4', tex: 'x - \\tfrac{x^2 - 2}{4}', f: x => x - (x * x - 2) / 4, d: x => 1 - x / 2, fix: Math.SQRT2, x0: 0.6, v: [-0.15, 2.6, -0.2, 1.9] },
        zyklus: { k: '2/x', tex: '\\tfrac{2}{x}', f: x => 2 / x, d: x => -2 / (x * x), fix: Math.SQRT2, x0: 1, v: [-0.15, 3, -0.25, 2.6] },
        heron: { k: '(x + 2/x)/2', tex: '\\tfrac12\\left(x + \\tfrac{2}{x}\\right)', f: x => (x + 2 / x) / 2, d: x => 0.5 - 1 / (x * x), fix: Math.SQRT2, x0: 0.7, v: [-0.15, 3, -0.25, 2.6] },
        weg: { k: 'x² − 2', tex: 'x^2 - 2', f: x => x * x - 2, d: x => 2 * x, fix: 2, x0: 2.05, v: [-2.5, 3.2, -2.5, 3.2] }
    };
    W('fixpunkt', function (box) {
        let S = FP.cos, xs = [S.x0];
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(FP).map(k => [k, 'φ = ' + FP[k].k]), 'cos', v => { S = FP[v]; xs = [S.x0]; render(); }, 'Funktion φ');
        const p = new Plot(div(box, ''), { x: S.v.slice(0, 2), y: S.v.slice(2), height: 340, aria: 'Fixpunktiteration: Spinnennetz zwischen dem Graphen von φ und der Geraden y = x' });
        const hs = [{ x: xs[0], y: 0, color: 'white', fixY: true, snap: 0.05 }];
        p.handles(hs, (i, x) => { xs = [x]; render(); });
        const acts = div(box, 'b-ctrls', '<button type="button" class="b-btn b-go" data-s>Nächster Schritt</button><button type="button" class="b-btn" data-s10>10 Schritte</button><button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>');
        acts.style.marginTop = '10px';
        const out = div(box, 'b-out');
        function step() {
            const x = xs[xs.length - 1], y = S.f(x);
            if (!isFinite(y) || Math.abs(y) > 1e6) return false;
            xs.push(y); return true;
        }
        acts.addEventListener('click', e => {
            if (e.target.closest('[data-s]')) step();
            else if (e.target.closest('[data-s10]')) { for (let k = 0; k < 10 && step(); k++); }
            else if (e.target.closest('[data-r]')) xs = [xs[0]];
            else return;
            render();
        });
        function render() {
            hs[0].x = xs[0];
            p.view(S.v.slice(0, 2), S.v.slice(2));
            const L = [{ fn: x => x, color: 'dim', label: 'y = x', width: 1.4 }, { fn: S.f, color: 'lambda', label: 'φ' }];
            // the cobweb: up (or down) to the graph, across to the diagonal, ...
            L.push({ seg: [[xs[0], 0], [xs[0], xs.length > 1 ? xs[1] : S.f(xs[0])]], color: 'cyan', dash: true, width: 1.4 });
            for (let i = 1; i < xs.length; i++) {
                const a = xs[i - 1], b = xs[i];
                L.push({ seg: [[a, b], [b, b]], color: 'cyan', width: 1.8 });
                if (i + 1 < xs.length) L.push({ seg: [[b, b], [b, xs[i + 1]]], color: 'cyan', width: 1.8 });
            }
            L.push({ pts: [[S.fix, S.fix]], color: 'phi', r: 5.5 });
            p.draw(L);
            const n = v => texNum(v, 6), k = Math.abs(S.d(S.fix));
            const last = xs.slice(-8), off = xs.length - last.length;
            const verdict = k < 1e-9 ? 'Hier ist $\\varphi\'(x^*) = 0$: Die Folge konvergiert extrem schnell, die Zahl der richtigen Stellen verdoppelt sich etwa bei jedem Schritt (das ist das Newton-Verfahren für $x^2 - 2 = 0$).'
                : k < 1 - 1e-9 ? 'Wegen $|\\varphi\'(x^*)| < 1$ ist der Fixpunkt <b>anziehend</b>: Nahe bei $x^*$ schrumpft der Fehler bei jedem Schritt etwa um diesen Faktor.' + (S.d(S.fix) < 0 ? ' Weil $\\varphi\' < 0$ ist, springt die Folge um den Fixpunkt herum (Spirale).' : ' Weil $\\varphi\' > 0$ ist, nähert sie sich von einer Seite (Treppe).')
                : k < 1 + 1e-9 ? 'Hier ist $|\\varphi\'(x^*)| = 1$: Der Satz sagt nichts. Bei $\\varphi(x) = \\tfrac2x$ springt die Folge ewig zwischen zwei Werten hin und her, ein Zyklus.'
                : 'Wegen $|\\varphi\'(x^*)| > 1$ ist der Fixpunkt <b>abstoßend</b>: Selbst ganz nahe bei $x^*$ wächst der Fehler, die Folge läuft weg.';
            out.innerHTML = '<p style="margin:0 0 6px">$x_{n+1} = \\varphi(x_n)$ mit $\\varphi(x) = ' + S.tex + '$, Fixpunkt $x^* \\approx ' + texNum(S.fix, 4) + '$ (grün), $|\\varphi\'(x^*)| \\approx ' + texNum(k, 3) + '$.</p>' +
                '<p style="margin:0 0 6px">' + last.map((v, i) => '$x_{' + (off + i) + '} = ' + (Math.abs(v) > 1e5 ? '\\text{sehr groß}' : n(v)) + '$').join(', ') + '</p>' +
                '<p style="margin:0">' + verdict + '</p>';
            math(out);
        }
        render();
    });
})();
