/* buch-integral.js — widgets for the chapters on integral calculus (Lernbereich 3, Klasse 13) of the textbook
 * (js/buch.js, js/buch-plot.js). Numerical integration with rectangles and trapezoids lives in js/buch-numerik.js ("flaeche").
 *   titelbild13      the cover of book 13: an area under a curve, a test histogram with its rejection region, a plane
 *   stammfunktion    f and its antiderivatives F + C: the slope of F at x0 is f(x0)
 *   bestand          a rate of change over time and the reconstructed stock (water tank, car journey)
 *   integral         the definite integral between draggable limits: signed pieces and the area
 *   zwischenflaeche  the area between two graphs, from intersection to intersection
 * Looks: js/buch.css (section "Widgets of the calculus and vector chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { texNum, math, range, div, Plot } = B;
    const W = B.widget;
    const num = (x, d = 2) => texNum(Math.abs(x) < 5e-13 ? 0 : x, d);

    // zeros of fn in [a, b] (sign changes, refined by bisection)
    function zeros(fn, a, b, n = 800) {
        const out = [];
        let x0 = a, y0 = fn(a);
        for (let i = 1; i <= n; i++) {
            const x1 = a + (b - a) * i / n, y1 = fn(x1);
            if (isFinite(y0) && isFinite(y1) && y0 * y1 < 0) {
                let lo = x0, hi = x1, flo = y0;
                for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2, fm = fn(m); if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
                out.push((lo + hi) / 2);
            } else if (y1 === 0) out.push(x1);
            x0 = x1; y0 = y1;
        }
        return out;
    }
    // area layers between the graph and the x-axis, split at zeros: above gold, below red
    function signedAreas(f, a, b) {
        const cuts = [a].concat(zeros(f, a, b).filter(z => z > a + 1e-9 && z < b - 1e-9), [b]);
        const out = [];
        for (let i = 0; i < cuts.length - 1; i++) {
            const m = (cuts[i] + cuts[i + 1]) / 2;
            out.push({ area: f, from: cuts[i], to: cuts[i + 1], color: f(m) >= 0 ? 'lambda' : 'red' });
        }
        return { layers: out, cuts };
    }

    /* ---------- the cover of book 13 ---------- */
    W('titelbild13', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const f = x => 0.12 * (x + 2.6) * (x - 1.2) * (x - 5.4) + 1.6;
        let path = '', area = 'M' + X(-0.6) + ' ' + Y(-1.2);
        for (let i = 0; i <= 160; i++) { const x = -3 + 9 * i / 160; path += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
        for (let i = 0; i <= 80; i++) { const x = -0.6 + 4.2 * i / 80; area += 'L' + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
        area += 'L' + X(3.6) + ' ' + Y(-1.2) + 'Z';
        // Riemann strips under the left part of the curve
        let strips = '';
        for (let k = 0; k < 6; k++) { const x = -2.4 + k * 0.3, h = f(x + 0.15) + 1.2; strips += '<rect x="' + X(x).toFixed(1) + '" y="' + Y(-1.2 + h).toFixed(1) + '" width="' + (X(0.27) - X(0)).toFixed(1) + '" height="' + (Y(-1.2) - Y(-1.2 + h)).toFixed(1) + '"/>'; }
        // a test histogram with a red rejection region at the bottom
        let bars = '';
        const n = 12, p = 0.5;
        let c = 1;
        for (let k = 0; k <= n; k++) {
            if (k) c = c * (n - k + 1) / k;
            const P = c * p ** k * (1 - p) ** (n - k), x = -2.7 + k * 0.62, h = P * 9;
            bars += '<rect x="' + X(x).toFixed(1) + '" y="' + Y(-3 + h).toFixed(1) + '" width="' + (X(0.5) - X(0)).toFixed(1) + '" height="' + (Y(-3) - Y(-3 + h)).toFixed(1) + '" rx="2" style="fill:' +
                (k >= 10 ? 'rgba(226,102,90,0.55);stroke:#e2665a' : 'rgba(127,216,238,0.22);stroke:rgba(127,216,238,0.6)') + '"/>';
        }
        // a plane as a tilted parallelogram with its normal
        const P0 = [X(3.2), Y(5.2)], u = [130, -40], v = [60, 70];
        const pl = [P0, [P0[0] + u[0], P0[1] + u[1]], [P0[0] + u[0] + v[0], P0[1] + u[1] + v[1]], [P0[0] + v[0], P0[1] + v[1]]].map(q => q.map(z => z.toFixed(1)).join(',')).join(' ');
        const mid = [P0[0] + (u[0] + v[0]) / 2, P0[1] + (u[1] + v[1]) / 2];
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Fläche unter einer Kurve, ein Testhistogramm und eine Ebene">' +
            '<defs><linearGradient id="tb13-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.97" stop-color="#fff" stop-opacity="0.2"/></linearGradient>' +
            '<mask id="tb13-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tb13-fade)"/></mask></defs>' +
            '<g mask="url(#tb13-mask)">' +
            '<path d="' + area + '" style="fill:rgba(245,194,66,0.28);stroke:none"/>' +
            '<g style="fill:rgba(127,216,238,0.16);stroke:rgba(127,216,238,0.55);stroke-width:1">' + strips + '</g>' +
            '<path d="' + path + '" stroke="#F5C242" stroke-width="12" stroke-opacity="0.13" fill="none"/><path d="' + path + '" stroke="#F5C242" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
            '<polygon points="' + pl + '" style="fill:rgba(184,164,242,0.2);stroke:#B8A4F2;stroke-width:2"/>' +
            '<line x1="' + mid[0] + '" y1="' + mid[1] + '" x2="' + (mid[0] + 28) + '" y2="' + (mid[1] - 95) + '" stroke="#e682be" stroke-width="3.2" stroke-linecap="round"/>' +
            '<circle cx="' + (mid[0] + 28) + '" cy="' + (mid[1] - 95) + '" r="6" fill="#e682be"/>' +
            bars + '</g></svg>';
    });

    /* ---------- antiderivatives ---------- */
    W('stammfunktion', function (box) {
        const F = {
            lin: { k: 'f(x) = x', tex: 'x', Ftex: '\\tfrac12 x^2', f: x => x, F: x => x * x / 2, y: [-3, 6] },
            par: { k: 'f(x) = x² − 1', tex: 'x^2 - 1', Ftex: '\\tfrac13 x^3 - x', f: x => x * x - 1, F: x => x ** 3 / 3 - x, y: [-4, 5] },
            cos: { k: 'f(x) = cos x', tex: '\\cos x', Ftex: '\\sin x', f: Math.cos, F: Math.sin, y: [-3, 4] },
            exp: { k: 'f(x) = eˣ', tex: '\\mathrm{e}^x', Ftex: '\\mathrm{e}^x', f: Math.exp, F: Math.exp, y: [-3, 8] }
        };
        let G = F.par, C = 0, x0 = 1;
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, Object.keys(F).map(k => [k, F[k].k]), 'par', v => { G = F[v]; render(); }, 'Funktion');
        range(div(box, ''), { label: 'Konstante $C$', min: -3, max: 3, step: 0.5, value: C, fmt: v => texNum(v, 1).replace('{,}', ','), onInput: v => { C = v; render(); } });
        div(box, 'b-help').textContent = 'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).';
        const top = new Plot(div(box, ''), { x: [-4, 4], height: 260, yLabel: 'F', aria: 'Schar von Stammfunktionen' });
        const bot = new Plot(div(box, ''), { x: [-4, 4], y: [-3, 4], height: 190, yLabel: 'f', aria: 'Die Funktion f' });
        const out = div(box, 'b-out');
        const hs = [{ x: x0, y: 0, color: 'lambda', fixY: true }];
        top.handles(hs, (i, x) => { x0 = Math.round(x * 10) / 10; render(); });
        function render() {
            const Fc = x => G.F(x) + C, m = G.f(x0), y0 = Fc(x0);
            hs[0].x = x0; hs[0].y = y0;
            top.view([-4, 4], G.y);
            const L = [];
            for (let c = -3; c <= 3; c++) if (c !== C) L.push({ fn: x => G.F(x) + c, color: 'dim', width: 1.1 });
            L.push({ fn: Fc, color: 'lambda', label: 'F' }, { fn: x => y0 + m * (x - x0), color: 'cyan', width: 1.6, domain: [x0 - 1.4, x0 + 1.4] });
            top.draw(L);
            bot.view([-4, 4], G === F.exp ? [-1, 8] : [-3, 4]);
            bot.draw([{ fn: G.f, color: 'phi', label: 'f' }, { pts: [[x0, m]], color: 'cyan', r: 5.5 }, { vline: x0 }]);
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + G.tex + '$ · Stammfunktionen $F(x) = ' + G.Ftex + ' + C$, denn $F\'(x) = f(x)$.</p>' +
                '<p style="margin:0">Bei $x_0 = ' + num(x0, 1) + '$: Steigung von $F$ $= f(' + num(x0, 1) + ') \\approx ' + num(m, 3) + '$, egal welches $C$.</p>';
            math(out);
        }
        render();
    });

    /* ---------- rate of change → reconstructed stock ---------- */
    W('bestand', function (box) {
        const P = {
            tank: { k: 'Wassertank', T: 9, r: t => -0.5 * t * t + 3 * t, R: t => -(t ** 3) / 6 + 1.5 * t * t, B0: 20, ry: [-8, 6], by: [0, 50],
                rl: 'Zuflussrate in l/min', bl: 'Wasser in l', rtex: 'r(t) = -0{,}5t^2 + 3t', unit: 'l', tunit: 'min',
                note: 'Bis $t = 6$ fließt Wasser zu, danach läuft es ab (negative Änderungsrate). Der Bestand ist bei $t = 6$ am größten.' },
            fahrt: { k: 'Autofahrt', T: 12, r: t => 1.2 * t * t - 0.1 * t ** 3, R: t => 0.4 * t ** 3 - 0.025 * t ** 4, B0: 0, ry: [-2, 30], by: [0, 190],
                rl: 'v in m/s', bl: 's in m', rtex: 'v(t) = 1{,}2t^2 - 0{,}1t^3', unit: 'm', tunit: 's',
                note: 'Die Fläche unter dem Geschwindigkeitsgraphen ist der zurückgelegte Weg.' }
        };
        let G = P.tank, t = 4;
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, Object.keys(P).map(k => [k, P[k].k]), 'tank', v => { G = P[v]; t = Math.min(t, G.T); build(); }, 'Beispiel');
        const sl = div(box, '');
        const top = new Plot(div(box, ''), { height: 220, aria: 'Änderungsrate mit Fläche' });
        const bot = new Plot(div(box, ''), { height: 200, aria: 'Rekonstruierter Bestand' });
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            range(sl, { label: 'Zeit $t$', min: 0, max: G.T, step: 0.25, value: t, fmt: v => texNum(v, 2).replace('{,}', ',') + ' ' + G.tunit, onInput: v => { t = v; render(); } });
            math(sl);
            top.opt.yLabel = G.rl; bot.opt.yLabel = G.bl; top.opt.xLabel = bot.opt.xLabel = 't';
            render();
        }
        function render() {
            const Bt = s => G.B0 + G.R(s) - G.R(0);
            top.view([-0.3, G.T + 0.3], G.ry);
            top.draw(signedAreas(G.r, 0, Math.max(t, 1e-6)).layers.concat([{ fn: G.r, color: 'cyan', domain: [0, G.T] }, { vline: t }]));
            bot.view([-0.3, G.T + 0.3], G.by);
            bot.draw([{ fn: Bt, color: 'dim', dash: true, width: 1.2, domain: [0, G.T] }, { fn: Bt, color: 'lambda', domain: [0, t] }, { pts: [[t, Bt(t)]], color: 'lambda', r: 6 }]);
            out.innerHTML = '<p style="margin:0 0 6px">$' + G.rtex + '$ · Anfangsbestand $' + num(G.B0, 0) + '\\,\\text{' + G.unit + '}$</p>' +
                '<p style="margin:0 0 6px">Bestand nach $t = ' + num(t, 2) + '$: $' + num(G.B0, 0) + ' + \\int_0^{' + num(t, 2) + '} ' + G.rtex.split(' = ')[0].replace('(t)', '(s)') + '\\,\\mathrm{d}s \\approx ' + num(Bt(t), 2) + '\\,\\text{' + G.unit + '}$</p>' +
                '<p style="margin:0">' + G.note + '</p>';
            math(out);
        }
        build();
    });

    // functions with antiderivatives for the definite integral
    const FI = {
        par: { k: 'x² − 1', tex: 'x^2 - 1', Ftex: '\\tfrac13 x^3 - x', f: x => x * x - 1, F: x => x ** 3 / 3 - x, x: [-3, 3], y: [-2, 5], a: -0.5, b: 2 },
        cub: { k: '½x³ − 2x', tex: '\\tfrac12 x^3 - 2x', Ftex: '\\tfrac18 x^4 - x^2', f: x => 0.5 * x ** 3 - 2 * x, F: x => x ** 4 / 8 - x * x, x: [-3, 3], y: [-4, 4], a: -2, b: 2 },
        sin: { k: 'sin x', tex: '\\sin x', Ftex: '-\\cos x', f: Math.sin, F: x => -Math.cos(x), x: [-1, 7], y: [-1.6, 1.6], a: 0, b: Math.PI },
        exp: { k: 'eˣ', tex: '\\mathrm{e}^x', Ftex: '\\mathrm{e}^x', f: Math.exp, F: Math.exp, x: [-3, 2.5], y: [-1, 8], a: 0, b: 1 }
    };

    /* ---------- the definite integral ---------- */
    W('integral', function (box) {
        let G = FI.par;
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, Object.keys(FI).map(k => [k, FI[k].k]), 'par', v => { G = FI[v]; hs[0].x = G.a; hs[1].x = G.b; render(); }, 'Funktion');
        const p = new Plot(div(box, ''), { height: 320, aria: 'Bestimmtes Integral zwischen zwei Grenzen' });
        const out = div(box, 'b-out');
        const hs = [{ x: G.a, y: 0, color: 'cyan', fixY: true }, { x: G.b, y: 0, color: 'cyan', fixY: true }];
        p.handles(hs, () => render());
        function render() {
            let a = Math.round(hs[0].x * 20) / 20, b = Math.round(hs[1].x * 20) / 20;
            hs[0].x = a; hs[1].x = b;
            const lo = Math.min(a, b), hi = Math.max(a, b);
            p.view(G.x, G.y);
            const { layers, cuts } = signedAreas(G.f, lo, hi);
            p.draw(layers.concat([{ fn: G.f, color: 'lambda', label: 'f' }, { text: 'a', at: [a, 0], color: 'cyan', dy: 22 }, { text: 'b', at: [b, 0], color: 'cyan', dy: 22 }]));
            const I = G.F(b) - G.F(a);
            const pieces = [];
            for (let i = 0; i < cuts.length - 1; i++) pieces.push(G.F(cuts[i + 1]) - G.F(cuts[i]));
            const A = pieces.reduce((s, v) => s + Math.abs(v), 0);
            out.innerHTML = '<p style="margin:0 0 6px">$\\displaystyle\\int_{' + num(a, 2) + '}^{' + num(b, 2) + '} \\left(' + G.tex + '\\right) \\mathrm{d}x = \\Big[' + G.Ftex + '\\Big]_{' + num(a, 2) + '}^{' + num(b, 2) + '} = F(' + num(b, 2) + ') - F(' + num(a, 2) + ') \\approx ' + num(I, 3) + '$</p>' +
                (pieces.length > 1 ? '<p style="margin:0 0 6px">Teilstücke zwischen den Nullstellen: ' + pieces.map(v => '$' + num(v, 3) + '$').join(' · ') + '</p>' : '') +
                '<p style="margin:0">Flächeninhalt zwischen Graph und $x$-Achse: $A \\approx ' + num(A, 3) + '$' +
                (Math.abs(A - Math.abs(I)) > 1e-6 ? ' · Das Integral ist kleiner, weil Flächen unter der Achse (rot) negativ zählen.' : '') + (a > b ? ' · Achtung: $a > b$ dreht das Vorzeichen.' : '') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- the area between two graphs ---------- */
    W('zwischenflaeche', function (box) {
        const P = {
            pg: { k: 'Parabel und Gerade', ftex: '-x^2 + 4', gtex: 'x + 2', f: x => -x * x + 4, g: x => x + 2, Dtex: '\\left(-x^2 - x + 2\\right)', D: x => -x * x - x + 2, DI: x => -(x ** 3) / 3 - x * x / 2 + 2 * x, x: [-3.5, 2.5], y: [-2, 5] },
            cp: { k: 'Kubik und Parabel', ftex: 'x^3', gtex: 'x^2 + 2x', f: x => x ** 3, g: x => x * x + 2 * x, Dtex: '\\left(x^3 - x^2 - 2x\\right)', D: x => x ** 3 - x * x - 2 * x, DI: x => x ** 4 / 4 - x ** 3 / 3 - x * x, x: [-2, 3], y: [-3, 9] },
            sc: { k: 'Sinus und Kosinus', ftex: '\\sin x', gtex: '\\cos x', f: Math.sin, g: Math.cos, Dtex: '\\left(\\sin x - \\cos x\\right)', D: x => Math.sin(x) - Math.cos(x), DI: x => -Math.cos(x) - Math.sin(x), x: [-0.5, 6.8], y: [-1.6, 1.6], range: [0, 2 * Math.PI] }
        };
        let G = P.pg;
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, Object.keys(P).map(k => [k, P[k].k]), 'pg', v => { G = P[v]; render(); }, 'Funktionen');
        const p = new Plot(div(box, ''), { height: 320, aria: 'Fläche zwischen zwei Graphen' });
        const out = div(box, 'b-out');
        function render() {
            const [lo, hi] = G.range || G.x;
            const xs = zeros(G.D, lo, hi);
            p.view(G.x, G.y);
            const polys = [];
            for (let i = 0; i < xs.length - 1; i++) {
                const a = xs[i], b = xs[i + 1], poly = [];
                for (let k = 0; k <= 60; k++) { const x = a + (b - a) * k / 60; poly.push([x, G.f(x)]); }
                for (let k = 60; k >= 0; k--) { const x = a + (b - a) * k / 60; poly.push([x, G.g(x)]); }
                polys.push(poly);
            }
            p.draw([{ polys, color: 'lambda' }, { fn: G.f, color: 'lambda', label: 'f' }, { fn: G.g, color: 'cyan', label: 'g', labelAt: G.x[0] + (G.x[1] - G.x[0]) * 0.1 },
                { pts: xs.map(x => [x, G.f(x)]), color: 'white', r: 5 }]);
            const pieces = [];
            for (let i = 0; i < xs.length - 1; i++) pieces.push(G.DI(xs[i + 1]) - G.DI(xs[i]));
            const A = pieces.reduce((s, v) => s + Math.abs(v), 0);
            out.innerHTML = '<p style="margin:0 0 6px">$f(x) = ' + G.ftex + '$, $g(x) = ' + G.gtex + '$ · Schnittstellen: ' + xs.map(x => '$' + num(x, 3) + '$').join(', ') + '</p>' +
                '<p style="margin:0">' + (pieces.length ? '$A = ' + pieces.map((v, i) => '\\left|\\int_{' + num(xs[i], 2) + '}^{' + num(xs[i + 1], 2) + '} ' + G.Dtex + '\\,\\mathrm{d}x\\right|').join(' + ') + ' \\approx ' + num(A, 3) + '$' : 'Zu wenige Schnittstellen im Bild.') + '</p>';
            math(out);
        }
        render();
    });
})();
