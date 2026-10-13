/* buch-os9.js — widgets of the book Mathematik · Oberschule 9 (js/buch.js; plots from js/buch-plot.js, SVG helpers B.geo from
 * js/buch-geometrie.js, both loaded first).
 *   titelbildos9   the cover: a right triangle 3 : 4 : 5 with the squares over its sides, a throw parabola, a cone and a sphere
 *   steigungos9    slope of a road: percent and angle of inclination (tan), the triangle 100 across and p up
 *   parabelos9     quadratic functions with sliders: y = a·x² + c, vertex form y = (x + d)² + e, normal form y = x² + p·x + q with
 *                  completing the square; vertex, range, monotony, zeros (data-mode="ac|de|pq", data-hero)
 *   quadglos9      x² + p·x + q = 0 with the formula: discriminant, two, one or no solution, the parabola and its zeros
 *                  (data-hero: three parabolas with two, one and no zero)
 *   kugelos9       the sphere: surface and volume, the radius back from the volume with the cube root, sphere in a cylinder (2 : 3)
 *   turmos9        composite solids: tower = cylinder + cone, silo = cylinder + hemisphere; volume and outer surface without inner faces
 *   abstandos9     two draggable points: their distance as the hypotenuse of a right triangle with legs parallel to the axes
 *   umkehros9      three sides a, b, c: is a² + b² = c²? the triangle drawn, the angle at C (presets with Pythagorean triples)
 *   rwdreieckos9   a right triangle solved step by step from a side and an angle or from two sides (sin, cos, tan and their inverses)
 *   dachos9        a gable roof: width and pitch → ridge height, rafter length, roof area (two right triangles)
 *   fibonaccios9   Fibonacci numbers and the quotients of neighbours approaching Φ ≈ 1,618
 *   spannweiteos9  range: two groups of long jumps with the same mean, the spread of B adjustable, an outlier for A
 * Looks: inline styles only, no own block in js/buch.css.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;
    const G = B.geo;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;

    /* ---------- small helpers ---------- */
    const isHero = box => box.dataset.hero != null;
    const f1 = G.f1;
    const area = (c, a) => G.hexFill(c, a);
    const sty = (c, w, more) => 'fill:none;stroke:' + c + ';stroke-width:' + (w || 2) + ';stroke-linecap:round;stroke-linejoin:round;' + (more || '');
    const DASH = 'stroke-dasharray:6 5;';
    const halfEll = (cx, cy, rx, ry, front, st) => '<path d="M' + f1(cx - rx) + ' ' + f1(cy) + ' A' + f1(rx) + ' ' + f1(ry) + ' 0 0 ' + (front ? 0 : 1) + ' ' + f1(cx + rx) + ' ' + f1(cy) + '" style="' + st + '"/>';
    const ell = (cx, cy, rx, ry, st) => '<ellipse cx="' + f1(cx) + '" cy="' + f1(cy) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" style="' + st + '"/>';
    // a phone gets a narrower view box, so lines and labels keep a readable size
    function narrowWatch(el, onChange) {
        const st = { narrow: false };
        if (window.ResizeObserver) new ResizeObserver(() => { const nw = el.clientWidth > 0 && el.clientWidth < 480; if (nw !== st.narrow) { st.narrow = nw; onChange(); } }).observe(el);
        return st;
    }
    // signed number in TeX: " + 2", " - 2{,}5", nothing for 0
    const sgn = (v, d) => Math.abs(v) < 1e-12 ? '' : (v < 0 ? ' - ' : ' + ') + texNum(Math.abs(v), d == null ? 2 : d);

    /* ---------- the cover ---------- */
    W('titelbildos9', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dashed) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dashed ? ' stroke-dasharray="' + dashed + '"' : '') + '/>';
        const P = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
        const spot = p => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        let art = '';
        // a throw parabola arching over the whole picture
        const par = []; for (let x = 20; x <= 580; x += 8) par.push([x, 330 + 0.0025 * (x - 300) * (x - 300)]);
        art += glow(P(par), '#F5C242', 2.4, '2 9');
        // a right triangle 3 : 4 : 5 with the squares over its sides
        const A = [120, 640], Bp = [260, 640], C = [120, 535];
        art += '<path d="' + P([A, Bp, C]) + ' Z" fill="#7fd8ee" fill-opacity="0.12"/>' + glow(P([A, Bp, C]) + ' Z', '#7fd8ee', 2.6);
        art += glow(P([C, A, [A[0] - 105, A[1]], [C[0] - 105, C[1]]]) + ' Z', '#A0C85A', 2);
        art += glow(P([A, Bp, [Bp[0], Bp[1] + 140], [A[0], A[1] + 140]]) + ' Z', '#A0C85A', 2);
        art += '<path d="' + P([C, Bp, [Bp[0] + 105, Bp[1] - 140], [C[0] + 105, C[1] - 140]]) + ' Z" fill="#F5C242" fill-opacity="0.07"/>' +
            glow(P([C, Bp, [Bp[0] + 105, Bp[1] - 140], [C[0] + 105, C[1] - 140]]) + ' Z', '#F5C242', 2.2);
        // a cone in the oblique view
        const kx = 470, ky = 770, kr = 80, kry = 24, kh = 200;
        art += '<path d="M' + (kx - kr) + ' ' + ky + ' L' + kx + ' ' + (ky - kh) + ' L' + (kx + kr) + ' ' + ky + ' A' + kr + ' ' + kry + ' 0 0 1 ' + (kx - kr) + ' ' + ky + ' Z" fill="#B8A4F2" fill-opacity="0.08"/>';
        art += glow('M' + (kx - kr) + ' ' + ky + ' A' + kr + ' ' + kry + ' 0 0 1 ' + (kx + kr) + ' ' + ky, '#B8A4F2', 1.6, '8 8');
        art += glow('M' + (kx - kr) + ' ' + ky + ' A' + kr + ' ' + kry + ' 0 0 0 ' + (kx + kr) + ' ' + ky, '#B8A4F2', 3);
        art += glow(P([[kx - kr, ky], [kx, ky - kh], [kx + kr, ky]]), '#B8A4F2', 3) + glow(P([[kx, ky - kh], [kx, ky]]), '#ffffff', 1.4, '6 8');
        // a sphere with its equator
        const sx = 470, sy = 430, sr = 62;
        art += '<circle cx="' + sx + '" cy="' + sy + '" r="' + sr + '" fill="#7fd8ee" fill-opacity="0.07"/>' + glow('M' + (sx - sr) + ' ' + sy + ' a' + sr + ' ' + sr + ' 0 1 0 ' + 2 * sr + ' 0 a' + sr + ' ' + sr + ' 0 1 0 ' + -2 * sr + ' 0', '#7fd8ee', 2.4);
        art += glow('M' + (sx - sr) + ' ' + sy + ' A' + sr + ' 18 0 0 0 ' + (sx + sr) + ' ' + sy, '#7fd8ee', 1.6) + glow('M' + (sx - sr) + ' ' + sy + ' A' + sr + ' 18 0 0 1 ' + (sx + sr) + ' ' + sy, '#7fd8ee', 1.2, '6 7');
        [[kx, ky - kh], [sx, sy], A, [300, 330]].forEach(p => { art += spot(p); });
        const id = 'to9' + Math.random().toString(36).slice(2, 7);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein rechtwinkliges Dreieck mit Quadraten über den Seiten, eine Wurfparabel, ein Kegel und eine Kugel">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.36" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- slope of a road: percent and angle ---------- */
    W('steigungos9', function (box) {
        const S = { p: 12 };
        const sl = div(box, '');
        range(sl, { label: 'Steigung in Prozent', min: 0, max: 120, step: 1, value: S.p, fmt: v => v + ' %', onInput: v => { S.p = v; render(); } });
        const pic = div(box, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        const nw = narrowWatch(pic, () => render());
        function render() {
            const Wv = nw.narrow ? 400 : 640, p = S.p, al = Math.atan(p / 100) / DEG;
            // 100 m across fill the width; a steep road is drawn smaller so that it stays at most 200 px high
            const x0 = 60, y0 = 250, k = Math.min((Wv - 140) / 100, p > 0 ? 200 / p : 99);
            const run = 100 * k, rise = p * k, top = [x0 + run, y0 - rise];
            let s = '<path d="M' + x0 + ' ' + y0 + ' L' + f1(top[0]) + ' ' + y0 + ' L' + f1(top[0]) + ' ' + f1(top[1]) + ' Z" style="' + area(LAM, 0.18) + '"/>';
            s += G.line([x0, y0], top, sty(LAM, 3));
            s += G.txt([x0 + run / 2, y0 + 24], '100 m waagerecht', 'g-lab');
            if (p > 0) {
                s += G.txt([top[0] + 8, y0 - rise / 2 + 5], p + ' m', 'g-lab', 'start');
                s += G.arc([x0, y0], [x0 + 60, y0], top, 44, area(CY, 0.25)) + G.txt([x0 + 62, y0 - 8], 'α', 'g-ang', 'start');
                s += G.rightMark([top[0], y0], [x0, y0], top, 12);
            }
            pic.innerHTML = '<svg viewBox="0 0 ' + Wv + ' 290" role="img" aria-label="Steigungsdreieck einer Straße mit ' + p + ' Prozent Steigung">' + s + '</svg>';
            out.innerHTML = '<p style="margin:0">$' + p + '\\,\\%$ Steigung: auf 100 m waagerecht ' + p + ' m höher, also $\\tan \\alpha = \\dfrac{' + p + '}{100} = ' + texNum(p / 100, 2) + '$.</p>' +
                '<p style="margin:6px 0 0">Steigungswinkel: $\\alpha = \\tan^{-1}(' + texNum(p / 100, 2) + ') \\approx ' + texNum(al, 1) + '^\\circ$</p>' +
                '<p class="b-help" style="margin:8px 0 0">' + (p === 100 ? '100 % sind genau $45^\\circ$: Es geht so weit hoch wie nach vorn.' : p > 100 ? 'Mehr als 100 % ist steiler als $45^\\circ$, das gibt es nur bei Treppen und Bergbahnen.' : 'Die Prozentzahl wächst nicht im gleichen Maß wie der Winkel: Doppelte Prozent sind nicht doppelter Winkel.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- quadratic functions ---------- */
    W('parabelos9', function (box) {
        const hero = isHero(box);
        const S = { mode: ['ac', 'de', 'pq'].includes(box.dataset.mode) ? box.dataset.mode : 'ac', a: 0.5, c: -2, d: -1, e: -3, p: -2, q: -3 };
        const c = hero ? null : div(box, 'b-ctrls');
        const sl = hero ? null : div(box, '');
        if (!hero) seg(c, [['ac', '$y = a x^2 + c$'], ['de', '$y = (x + d)^2 + e$'], ['pq', '$y = x^2 + p x + q$']], S.mode, v => { S.mode = v; build(); }, 'Form');
        if (c) math(c);
        const p = new B.Plot(div(box, ''), { x: [-6, 6], y: [-6, 8], height: hero ? 260 : 340, aria: 'Graph einer quadratischen Funktion mit Scheitelpunkt' });
        const out = hero ? null : div(box, 'b-out');
        function build() {
            if (!sl) return render();
            sl.innerHTML = '';
            const R = (label, key, min, max, step) => range(sl, { label, min, max, step, value: S[key], fmt: v => fmt(v, 2), onInput: v => { S[key] = v; render(); } });
            if (S.mode === 'ac') { R('Streckfaktor $a$', 'a', -3, 3, 0.1); R('Verschiebung $c$', 'c', -5, 5, 0.5); }
            else if (S.mode === 'de') { R('$d$ (nach links, wenn positiv)', 'd', -5, 5, 0.5); R('$e$ (nach oben, wenn positiv)', 'e', -5, 5, 0.5); }
            else { R('$p$', 'p', -6, 6, 0.5); R('$q$', 'q', -6, 6, 0.5); }
            math(sl);
            render();
        }
        function render() {
            if (hero) {
                p.draw([{ fn: x => x * x, color: 'dim', dash: true }, { fn: x => (x - 1.5) * (x - 1.5) - 3, color: 'lambda' }, { fn: x => -0.5 * x * x + 4, color: 'cyan' },
                    { pts: [[1.5, -3], [0, 4]], color: 'white' }]);
                return;
            }
            let f, a, xs, ys, eq, steps = '';
            if (S.mode === 'ac') {
                a = S.a; f = x => a * x * x + S.c; xs = 0; ys = S.c;
                eq = 'y = ' + (Math.abs(a) < 1e-9 ? texNum(S.c, 2) : B.co(a, 2) + 'x^2' + sgn(S.c));
            } else if (S.mode === 'de') {
                a = 1; f = x => (x + S.d) * (x + S.d) + S.e; xs = -S.d; ys = S.e;
                eq = 'y = ' + (Math.abs(S.d) < 1e-9 ? 'x^2' : '(x' + sgn(S.d) + ')^2') + sgn(S.e);
            } else {
                a = 1; f = x => x * x + S.p * x + S.q; xs = -S.p / 2; ys = S.q - S.p * S.p / 4;
                eq = 'y = x^2' + (Math.abs(S.p) < 1e-9 ? '' : (S.p < 0 ? ' - ' : ' + ') + (Math.abs(Math.abs(S.p) - 1) < 1e-9 ? '' : texNum(Math.abs(S.p), 2)) + 'x') + sgn(S.q);
                const h = S.p / 2;
                steps = '<p style="margin:6px 0 0">Quadratische Ergänzung: $y = x^2' + (Math.abs(S.p) < 1e-9 ? '' : (S.p < 0 ? ' - ' : ' + ') + texNum(Math.abs(S.p), 2) + 'x') + ' + ' + texNum(h * h, 4) + ' - ' + texNum(h * h, 4) + sgn(S.q) +
                    ' = (x' + sgn(h, 2) + ')^2' + sgn(ys, 4) + '$</p>';
            }
            const L = [{ fn: x => x * x, color: 'dim', dash: true }, { fn: f, color: 'lambda', label: 'f' }];
            let zeros = [];
            if (Math.abs(a) > 1e-9) {
                const r = -ys / a;                       // (x − xs)² = r
                if (r > 1e-12) zeros = [xs - Math.sqrt(r), xs + Math.sqrt(r)]; else if (Math.abs(r) <= 1e-12) zeros = [xs];
                L.push({ pts: [[xs, ys]], color: 'white' });
            }
            if (zeros.length) L.push({ pts: zeros.map(z => [z, 0]), color: 'cyan' });
            p.draw(L);
            if (Math.abs(a) < 1e-9) {
                out.innerHTML = '<p style="margin:0">$' + eq + '$: Für $a = 0$ ist der Graph keine Parabel mehr, sondern eine waagerechte Gerade.</p>';
                return math(out);
            }
            const up = a > 0, form = Math.abs(Math.abs(a) - 1) < 1e-9 ? 'so weit wie die Normalparabel' : Math.abs(a) > 1 ? 'enger als die Normalparabel (gestreckt)' : 'weiter als die Normalparabel (gestaucht)';
            out.innerHTML = '<p style="margin:0">$' + eq + '$ · Scheitelpunkt $S(' + texNum(xs, 2) + ' \\mid ' + texNum(ys, 2) + ')$ (weiß)</p>' + steps +
                '<p style="margin:6px 0 0">Die Parabel ist nach ' + (up ? 'oben' : 'unten') + ' geöffnet und ' + form + '. Der Scheitelpunkt ist ein <b>' + (up ? 'Minimum' : 'Maximum') + '</b>.</p>' +
                '<p style="margin:6px 0 0">Wertebereich: $y ' + (up ? '\\geq ' : '\\leq ') + texNum(ys, 2) + '$. ' + (up ? 'Fallend' : 'Steigend') + ' für $x &lt; ' + texNum(xs, 2) + '$, ' + (up ? 'steigend' : 'fallend') + ' für $x &gt; ' + texNum(xs, 2) + '$.</p>' +
                '<p style="margin:6px 0 0">Nullstellen (türkis): ' + (zeros.length === 2 ? '$x_1 \\approx ' + texNum(zeros[0], 2) + '$, $x_2 \\approx ' + texNum(zeros[1], 2) + '$' : zeros.length === 1 ? 'genau eine, $x_0 = ' + texNum(zeros[0], 2) + '$' : 'keine, die Parabel trifft die x-Achse nicht') + '.</p>';
            math(out);
        }
        build();
    });

    /* ---------- x² + p·x + q = 0 with the formula ---------- */
    W('quadglos9', function (box) {
        if (isHero(box)) {
            // three parabolas: two zeros, one zero, no zero
            const hp = new B.Plot(div(box, ''), { x: [-5, 5], y: [-5, 7], height: 260, aria: 'Drei Parabeln mit zwei, einer und keiner Nullstelle' });
            hp.draw([{ fn: x => (x + 2.5) * (x + 2.5) - 2.25, color: 'lambda' }, { fn: x => (x - 1) * (x - 1), color: 'cyan' }, { fn: x => (x - 3.5) * (x - 3.5) + 1, color: 'phi' },
                { pts: [[-4, 0], [-1, 0], [1, 0]], color: 'white' }]);
            return;
        }
        const S = { p: -2, q: -8 };
        const sl = div(box, '');
        range(sl, { label: '$p$', min: -10, max: 10, step: 1, value: S.p, fmt: v => String(v), onInput: v => { S.p = v; render(); } });
        range(sl, { label: '$q$', min: -12, max: 12, step: 1, value: S.q, fmt: v => String(v), onInput: v => { S.q = v; render(); } });
        math(sl);
        const p = new B.Plot(div(box, ''), { x: [-8, 8], y: [-12, 12], height: 300, aria: 'Parabel y = x² + p x + q mit ihren Nullstellen' });
        const out = div(box, 'b-out');
        function render() {
            const { p: pp, q } = S, h = -pp / 2, D = h * h - q;
            const L = [{ fn: x => x * x + pp * x + q, color: 'lambda' }];
            let res;
            const eq = 'x^2' + (pp ? (pp < 0 ? ' - ' : ' + ') + (Math.abs(pp) === 1 ? '' : Math.abs(pp)) + 'x' : '') + (q ? (q < 0 ? ' - ' : ' + ') + Math.abs(q) : '') + ' = 0';
            const par = v => v < 0 ? '(' + texNum(v, 2) + ')' : texNum(v, 2);
            let t = '<p style="margin:0">$' + eq + '$ &nbsp; mit $p = ' + pp + '$, $q = ' + q + '$</p>' +
                '<p style="margin:6px 0 0">$x_{1,2} = -\\dfrac{p}{2} \\pm \\sqrt{\\left(\\dfrac{p}{2}\\right)^2 - q} = ' + texNum(h, 2) + ' \\pm \\sqrt{' + par(-h) + '^2 - ' + par(q) + '} = ' + texNum(h, 2) + ' \\pm \\sqrt{' + texNum(D, 2) + '}$</p>';
            if (D > 1e-12) {
                const r = Math.sqrt(D), x1 = h - r, x2 = h + r;
                L.push({ pts: [[x1, 0], [x2, 0]], color: 'cyan' });
                res = '<b>Zwei Lösungen</b>, weil die Diskriminante $D = ' + texNum(D, 2) + ' &gt; 0$ ist: $x_1 ' + (Number.isInteger(r) ? '= ' : '\\approx ') + texNum(x1, 2) + '$, $x_2 ' + (Number.isInteger(r) ? '= ' : '\\approx ') + texNum(x2, 2) + '$.';
            } else if (Math.abs(D) <= 1e-12) {
                L.push({ pts: [[h, 0]], color: 'cyan' });
                res = '<b>Genau eine Lösung</b>, weil $D = 0$ ist: $x = ' + texNum(h, 2) + '$. Der Scheitelpunkt liegt auf der x-Achse.';
            } else {
                res = '<b>Keine Lösung</b>, weil $D = ' + texNum(D, 2) + ' &lt; 0$ ist: Aus einer negativen Zahl zieht man keine Wurzel. Die Parabel liegt ganz über der x-Achse.';
            }
            p.draw(L);
            out.innerHTML = t + '<p style="margin:6px 0 0">' + res + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- the sphere ---------- */
    W('kugelos9', function (box) {
        const S = { mode: 'r', r: 3, V: 113.1 };
        const c = div(box, 'b-ctrls');
        seg(c, [['r', 'Radius gegeben'], ['V', 'Volumen gegeben']], 'r', v => { S.mode = v; build(); }, 'Gegeben');
        const sl = div(box, '');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function build() {
            sl.innerHTML = '';
            if (S.mode === 'r') range(sl, { label: 'Radius $r$', min: 0.5, max: 10, step: 0.5, value: S.r, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.r = v; render(); } });
            else range(sl, { label: 'Volumen $V$', min: 10, max: 4000, step: 10, value: Math.round(S.V / 10) * 10, fmt: v => fmt(v, 0) + ' cm³', onInput: v => { S.V = v; render(); } });
            math(sl);
            render();
        }
        function render() {
            const r = S.mode === 'r' ? S.r : Math.cbrt(3 * S.V / (4 * Math.PI)), V = 4 / 3 * Math.PI * r * r * r, O = 4 * Math.PI * r * r, VZ = 2 * Math.PI * r * r * r;
            const R = 100, C = [160, 150];
            let s = '<rect x="' + (C[0] - R) + '" y="' + (C[1] - R) + '" width="' + 2 * R + '" height="' + 2 * R + '" style="' + area(VIO, 0.06) + ';stroke-dasharray:6 5"/>';
            s += ell(C[0], C[1] - R, R, 18, sty(VIO, 1.4, DASH)) + halfEll(C[0], C[1] + R, R, 18, true, sty(VIO, 1.4, DASH));
            s += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + R + '" style="' + area(CY, 0.16) + '"/>';
            s += halfEll(C[0], C[1], R, 26, true, sty(CY, 1.6)) + halfEll(C[0], C[1], R, 26, false, sty(CY, 1.1, DASH));
            s += G.line(C, [C[0] + R, C[1]], sty(LAM, 2.4)) + G.txt([C[0] + R / 2, C[1] - 8], 'r', 'g-side') + G.dot(C, TXT, 3.5);
            pic.innerHTML = '<svg viewBox="0 0 320 300" role="img" aria-label="Eine Kugel in einem Zylinder, der genau um sie passt">' + s + '</svg>';
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab">' +
                (S.mode === 'V' ? '<tr><td>Radius</td><td>$r = \\sqrt[3]{\\dfrac{3V}{4\\pi}} \\approx ' + texNum(r, 2) + '\\,\\text{cm}$</td></tr>' : '<tr><td>Radius</td><td>$r = ' + texNum(r, 1) + '\\,\\text{cm}$</td></tr>') +
                '<tr><td>Oberfläche</td><td>$O = 4\\pi r^2 \\approx ' + texNum(O, 2) + '\\,\\text{cm}^2$</td></tr>' +
                '<tr><td>Volumen</td><td>$V = \\tfrac{4}{3}\\pi r^3 \\approx ' + texNum(V, 2) + '\\,\\text{cm}^3$</td></tr>' +
                '<tr><td>Zylinder darum</td><td>$V_Z = \\pi r^2 \\cdot 2r \\approx ' + texNum(VZ, 2) + '\\,\\text{cm}^3$</td></tr></table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Die Kugel füllt immer genau $\\tfrac{2}{3}$ des Zylinders, der um sie passt. Das hat Archimedes entdeckt.</p>';
            math(out);
        }
        build();
    });

    /* ---------- composite solids: tower and silo ---------- */
    W('turmos9', function (box) {
        const S = { k: box.dataset.k === 'silo' ? 'silo' : 'turm', r: 3, h: 8, hk: 4 };
        const c = div(box, 'b-ctrls');
        let rk = null;
        seg(c, [['turm', 'Turm: Zylinder + Kegel'], ['silo', 'Silo: Zylinder + Halbkugel']], S.k, v => { S.k = v; rk.input.closest('.b-range').style.display = v === 'turm' ? '' : 'none'; render(); }, 'Körper');
        const sl = div(box, '');
        range(sl, { label: 'Radius $r$', min: 1, max: 6, step: 0.5, value: S.r, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.r = v; render(); } });
        range(sl, { label: 'Höhe des Zylinders $h$', min: 2, max: 15, step: 0.5, value: S.h, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.h = v; render(); } });
        rk = range(sl, { label: 'Höhe des Kegels $h_K$', min: 1, max: 8, step: 0.5, value: S.hk, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.hk = v; render(); } });
        if (S.k === 'silo') rk.input.closest('.b-range').style.display = 'none';
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const { r, h, hk } = S, turm = S.k === 'turm', topH = turm ? hk : r;
            const sc = Math.min(22, 260 / (h + topH), 120 / r), R = r * sc, RY = R * 0.3, H = h * sc, T = topH * sc, cx = 160, yb = 330 - RY - 6, yt = yb - H;
            let s = '<path d="M' + f1(cx - R) + ' ' + f1(yb) + ' L' + f1(cx - R) + ' ' + f1(yt) + ' L' + f1(cx + R) + ' ' + f1(yt) + ' L' + f1(cx + R) + ' ' + f1(yb) + ' A' + f1(R) + ' ' + f1(RY) + ' 0 0 1 ' + f1(cx - R) + ' ' + f1(yb) + ' Z" style="' + area(VIO, 0.12) + ';stroke:none"/>';
            s += halfEll(cx, yb, R, RY, false, sty(VIO, 1.4, DASH)) + halfEll(cx, yb, R, RY, true, sty(VIO, 2.4));
            s += G.line([cx - R, yb], [cx - R, yt], sty(VIO, 2.4)) + G.line([cx + R, yb], [cx + R, yt], sty(VIO, 2.4));
            s += halfEll(cx, yt, R, RY, false, sty(VIO, 1.2, DASH)) + halfEll(cx, yt, R, RY, true, sty(VIO, 1.6));
            if (turm) {
                s += '<path d="M' + f1(cx - R) + ' ' + f1(yt) + ' L' + cx + ' ' + f1(yt - T) + ' L' + f1(cx + R) + ' ' + f1(yt) + ' Z" style="' + area(LAM, 0.16) + '"/>';
                s += G.line([cx, yt - T], [cx, yt], sty(TXT, 1.2, DASH)) + G.txt([cx + 6, yt - T / 2], 'h', 'g-side', 'start');
                s += G.txt([cx + R / 2 + 10, yt - T / 2 - 6], 's', 'g-side', 'start');
            } else {
                s += '<path d="M' + f1(cx - R) + ' ' + f1(yt) + ' A' + f1(R) + ' ' + f1(R) + ' 0 0 1 ' + f1(cx + R) + ' ' + f1(yt) + ' Z" style="' + area(LAM, 0.16) + '"/>';
            }
            s += G.line([cx, yt], [cx + R, yt], sty(LAM, 2)) + G.txt([cx + R / 2, yt + 18], 'r', 'g-side');
            s += G.line([cx + R + 16, yb], [cx + R + 16, yt], sty(PHI, 1.6)) + G.txt([cx + R + 26, (yb + yt) / 2], 'h', 'g-side', 'start');
            pic.innerHTML = '<svg viewBox="0 0 320 340" role="img" aria-label="' + (turm ? 'Turm aus einem Zylinder mit einem Kegeldach' : 'Silo aus einem Zylinder mit einer Halbkugel als Dach') + '">' + s + '</svg>';
            const VZ = Math.PI * r * r * h, AG = Math.PI * r * r, MZ = 2 * Math.PI * r * h;
            let rows;
            if (turm) {
                const sk = Math.sqrt(r * r + hk * hk), VK = Math.PI * r * r * hk / 3, MK = Math.PI * r * sk;
                rows = [['Zylinder', 'V_Z = \\pi r^2 h \\approx ' + texNum(VZ, 2) + '\\,\\text{m}^3'], ['Kegel', 'V_K = \\tfrac{1}{3}\\pi r^2 h_K \\approx ' + texNum(VK, 2) + '\\,\\text{m}^3'],
                    ['<b>Volumen</b>', 'V \\approx ' + texNum(VZ + VK, 2) + '\\,\\text{m}^3'], ['Mantellinie', 's = \\sqrt{r^2 + h_K^2} \\approx ' + texNum(sk, 2) + '\\,\\text{m}'],
                    ['<b>Oberfläche</b>', 'A_G + 2\\pi r h + \\pi r s \\approx ' + texNum(AG + MZ + MK, 2) + '\\,\\text{m}^2']];
            } else {
                const VH = 2 / 3 * Math.PI * r * r * r, OH = 2 * Math.PI * r * r;
                rows = [['Zylinder', 'V_Z = \\pi r^2 h \\approx ' + texNum(VZ, 2) + '\\,\\text{m}^3'], ['Halbkugel', 'V_H = \\tfrac{2}{3}\\pi r^3 \\approx ' + texNum(VH, 2) + '\\,\\text{m}^3'],
                    ['<b>Volumen</b>', 'V \\approx ' + texNum(VZ + VH, 2) + '\\,\\text{m}^3'], ['<b>Oberfläche</b>', 'A_G + 2\\pi r h + 2\\pi r^2 \\approx ' + texNum(AG + MZ + OH, 2) + '\\,\\text{m}^2']];
            }
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab">' + rows.map(q => '<tr><td>' + q[0] + '</td><td>$' + q[1] + '$</td></tr>').join('') + '</table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Zur Oberfläche gehören nur die Außenflächen: Der Deckkreis des Zylinders liegt innen und zählt nicht mit.</p>';
            math(out);
        }
        render();
    });

    /* ---------- Fibonacci numbers and Φ ---------- */
    W('fibonaccios9', function (box) {
        const S = { n: 10 };
        const sl = div(box, '');
        range(sl, { label: 'Anzahl der Fibonacci-Zahlen $n$', min: 3, max: 20, step: 1, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; render(); } });
        math(sl);
        const p = new B.Plot(div(box, ''), { x: [0, 21], y: [0.8, 2.2], height: 240, xLabel: 'n', yLabel: 'Quotient', aria: 'Quotienten benachbarter Fibonacci-Zahlen nähern sich der Zahl 1,618' });
        const out = div(box, 'b-out');
        const PHIv = (1 + Math.sqrt(5)) / 2;
        function render() {
            const F = [1, 1]; while (F.length < S.n) F.push(F[F.length - 1] + F[F.length - 2]);
            const Q = F.slice(1).map((v, i) => [i + 2, v / F[i]]);
            p.draw([{ hline: PHIv, color: 'phi', dash: true }, { pts: Q, color: 'lambda' }]);
            const last = Q.slice(-5);
            out.innerHTML = '<p style="margin:0">Fibonacci-Zahlen: ' + F.join(', ') + '</p>' +
                '<div class="b-table-wrap" style="margin-top:8px"><table class="b-table g-tab"><tr><th>Quotient</th>' + last.map(q => '<td>$\\tfrac{' + F[q[0] - 1] + '}{' + F[q[0] - 2] + '}$</td>').join('') + '</tr>' +
                '<tr><th>Wert</th>' + last.map(q => '<td>$' + texNum(q[1], 4) + '$</td>').join('') + '</tr></table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Jede Zahl ist die Summe der beiden davor. Die Quotienten springen abwechselnd über und unter die grüne Linie $\\Phi \\approx 1{,}618$ und kommen ihr immer näher.</p>';
            math(out);
        }
        render();
    });

    /* ---------- range: two groups with the same mean ---------- */
    // long jump in m of two groups of seven (invented values, both add up to 26,2 m)
    const SPRUNG_A = [3.2, 3.5, 3.6, 3.8, 3.9, 4.0, 4.2], SPRUNG_B = [2.6, 3.0, 3.4, 3.8, 4.2, 4.5, 4.7], SPRUNG_OUT = 5.8;
    W('spannweiteos9', function (box) {
        const S = { f: 1, out: false };
        const ctr = div(box, 'b-ctrls');
        ctr.innerHTML = '<button type="button" class="b-btn b-hintbtn">Ausreißer zu A (5,8 m)</button>';
        const btn = ctr.querySelector('button');
        btn.addEventListener('click', () => { S.out = !S.out; btn.textContent = S.out ? 'Ausreißer weg' : 'Ausreißer zu A (5,8 m)'; render(); });
        const sl = div(box, '');
        range(sl, { label: 'Streuung von B', min: 0, max: 1.5, step: 0.05, value: 1, fmt: v => fmt(v * 100, 0) + ' %', onInput: v => { S.f = v; render(); } });
        const pic = div(box, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        const nw = narrowWatch(pic, () => render());
        const mean = xs => xs.reduce((a, x) => a + x, 0) / xs.length;
        const median = xs => { const o = xs.slice().sort((a, b) => a - b), n = o.length; return n % 2 ? o[(n - 1) / 2] : (o[n / 2 - 1] + o[n / 2]) / 2; };
        function render() {
            const mB = mean(SPRUNG_B);
            const sets = [['A', S.out ? SPRUNG_A.concat(SPRUNG_OUT) : SPRUNG_A.slice(), CY], ['B', SPRUNG_B.map(x => Math.round((mB + S.f * (x - mB)) * 100) / 100), LAM]];
            const w = nw.narrow ? 400 : 640, x0 = 24, x1 = w - 24, lo0 = 1.5, hi0 = 6.5, X = v => x0 + (v - lo0) / (hi0 - lo0) * (x1 - x0), r = nw.narrow ? 4.5 : 6;
            let s = G.line([x0, 226], [x1, 226], 'stroke:' + DIM + ';stroke-width:1.4');
            for (let v = 2; v <= 6; v += 0.5) {
                s += G.line([X(v), 222], [X(v), 230], 'stroke:' + DIM + ';stroke-width:1.2');
                if (Number.isInteger(v)) s += G.txt([X(v), 250], v + ' m', 'g-small');
            }
            sets.forEach(([k, xs, col], i) => {
                const y = 66 + i * 86, lo = Math.min(...xs), hi = Math.max(...xs), m = mean(xs);
                s += '<rect x="' + f1(X(lo) - r) + '" y="' + (y - 30) + '" width="' + f1(X(hi) - X(lo) + 2 * r) + '" height="44" rx="6" style="fill:' + col + ';opacity:0.12"/>';
                // the range as a bracket below the dots
                const st = 'stroke:' + col + ';stroke-width:2;stroke-linecap:round';
                s += G.line([X(lo), y + 24], [X(hi), y + 24], st) + G.line([X(lo), y + 18], [X(lo), y + 30], st) + G.line([X(hi), y + 18], [X(hi), y + 30], st);
                const level = new Map();
                xs.forEach(v => {
                    const key = Math.round(v * 10), l = level.get(key) || 0; level.set(key, l + 1);
                    s += '<circle cx="' + f1(X(v)) + '" cy="' + (y - l * 2.2 * r) + '" r="' + r + '" style="fill:' + col + ';opacity:0.9"/>';
                });
                s += G.line([X(m), y - 30], [X(m), y + 14], 'stroke:#fff;stroke-width:2');
                s += G.txt([x0, y - 38], 'GRUPPE ' + k, 'g-small', 'start');
            });
            pic.innerHTML = '<svg viewBox="0 0 ' + w + ' 262" role="img" aria-label="Weitsprungweiten zweier Gruppen mit Mittelwert und Spannweite">' + s + '</svg>';
            // one row per measure, one column per group: fits a phone
            const rows = [['kleinster Wert', xs => Math.min(...xs)], ['größter Wert', xs => Math.max(...xs)], ['Spannweite', xs => Math.max(...xs) - Math.min(...xs)], ['Mittelwert', mean], ['Zentralwert', median]];
            let t = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th></th>' + sets.map(([k, , col]) => '<th style="color:' + col + '">' + k + '</th>').join('') + '</tr>';
            rows.forEach(([name, f], i) => {
                const b = i === 2 ? ['<b>', '</b>'] : ['', ''];
                t += '<tr><td>' + b[0] + name + b[1] + '</td>' + sets.map(([, xs]) => '<td>' + b[0] + fmt(f(xs), 2) + ' m' + b[1] + '</td>').join('') + '</tr>';
            });
            out.innerHTML = t + '</table></div><p class="b-help" style="margin:8px 0 0">Weiße Linie: Mittelwert. Die Klammer unter den Punkten reicht vom kleinsten bis zum größten Wert, ihre Länge ist die Spannweite. Ausgedachte Werte.</p>';
        }
        render();
    });

    /* ---------- distance of two points in the coordinate system ---------- */
    W('abstandos9', function (box) {
        const h = [{ x: -3, y: -1, color: 'lambda', snap: 0.5 }, { x: 3, y: 3, color: 'cyan', snap: 0.5 }];
        const p = new B.Plot(div(box, ''), { x: [-6, 6], y: [-5, 5], height: 320, equal: true, aria: 'Zwei verschiebbare Punkte und ihr Abstand als Hypotenuse' });
        const out = div(box, 'b-out');
        p.handles(h, () => render());
        function render() {
            const [P, Q] = h, dx = Q.x - P.x, dy = Q.y - P.y, d = Math.hypot(dx, dy);
            p.draw([{ seg: [[P.x, P.y], [Q.x, P.y]], color: 'phi', width: 2.2, dash: true }, { seg: [[Q.x, P.y], [Q.x, Q.y]], color: 'phi', width: 2.2, dash: true },
                { seg: [[P.x, P.y], [Q.x, Q.y]], color: 'lambda', width: 3 },
                { text: 'Δx = ' + fmt(Math.abs(dx), 1), at: [(P.x + Q.x) / 2, P.y], color: 'phi', align: 'center', dy: dy >= 0 ? 20 : -8, italic: false },
                { text: 'Δy = ' + fmt(Math.abs(dy), 1), at: [Q.x, (P.y + Q.y) / 2], color: 'phi', italic: false }]);
            const sq = Number.isInteger(Math.round(d * 1000) / 1000) ? '= ' : '\\approx ';
            out.innerHTML = '<p style="margin:0">$P(' + texNum(P.x, 1) + ' \\mid ' + texNum(P.y, 1) + ')$, $Q(' + texNum(Q.x, 1) + ' \\mid ' + texNum(Q.y, 1) + ')$</p>' +
                '<p style="margin:6px 0 0">$\\overline{PQ} = \\sqrt{\\Delta x^2 + \\Delta y^2} = \\sqrt{' + texNum(Math.abs(dx), 1) + '^2 + ' + texNum(Math.abs(dy), 1) + '^2} = \\sqrt{' + texNum(dx * dx + dy * dy, 2) + '} ' + sq + texNum(d, 2) + '$</p>' +
                '<p class="b-help" style="margin:8px 0 0">Die Strecke ist die Hypotenuse eines rechtwinkligen Dreiecks, die Katheten laufen parallel zu den Achsen.</p>';
            math(out);
        }
        render();
    });

    /* ---------- the converse of Pythagoras: is the triangle right-angled? ---------- */
    W('umkehros9', function (box) {
        const S = { a: 3, b: 4, c: 5 };
        const pre = div(box, 'b-ctrls');
        pre.innerHTML = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [4, 5, 6]].map(t => '<button type="button" class="b-btn" data-t="' + t.join(',') + '">' + t.join(' · ') + '</button>').join('');
        const sl = div(box, '');
        const R = ['a', 'b', 'c'].map(k => range(sl, { label: 'Seite $' + k + '$', min: 1, max: 20, step: 1, value: S[k], fmt: v => String(v), onInput: v => { S[k] = v; render(); } }));
        math(sl);
        pre.addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (!b) return; const t = b.dataset.t.split(',').map(Number); ['a', 'b', 'c'].forEach((k, i) => { S[k] = t[i]; R[i].set(t[i]); }); render(); });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const { a, b, c } = S;
            if (a + b <= c || a + c <= b || b + c <= a) {
                pic.innerHTML = '<svg viewBox="0 0 320 220" role="img" aria-label="Kein Dreieck möglich"><text class="g-lab" x="160" y="110" text-anchor="middle">Aus diesen Seiten entsteht kein Dreieck.</text></svg>';
                out.innerHTML = '<p style="margin:0">Zwei Seiten zusammen müssen länger sein als die dritte.</p>';
                return math(out);
            }
            const x = (b * b - a * a + c * c) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x));
            const sc = Math.min(260 / Math.max(c, x, c - x + 0.01), 150 / y), ox = 30 + Math.max(0, -x) * sc, oy = 190;
            const A = [ox, oy], Bq = [ox + c * sc, oy], C = [ox + x * sc, oy - y * sc];
            const gam = Math.acos(Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b)))) / DEG;
            let s = G.poly([A, Bq, C], area(Math.abs(gam - 90) < 1e-6 ? PHI : CY, 0.18));
            s += G.txt([(A[0] + Bq[0]) / 2, oy + 20], 'c = ' + c, 'g-lab') + G.txt([(Bq[0] + C[0]) / 2 + 10, (Bq[1] + C[1]) / 2], 'a = ' + a, 'g-lab', 'start') + G.txt([(A[0] + C[0]) / 2 - 10, (A[1] + C[1]) / 2], 'b = ' + b, 'g-lab', 'end');
            if (Math.abs(gam - 90) < 1e-6) s += G.rightMark(C, A, Bq, 14); else s += G.arc(C, A, Bq, 22, area(LAM, 0.3));
            s += G.txt([C[0], C[1] - 10], 'C', 'g-pt');
            const W2 = Math.max(320, Bq[0] + 30);
            pic.innerHTML = '<svg viewBox="0 0 ' + f1(W2) + ' 220" role="img" aria-label="Dreieck mit den Seiten ' + a + ', ' + b + ' und ' + c + '">' + s + '</svg>';
            const l = a * a + b * b, r = c * c, ok = l === r;
            out.innerHTML = '<p style="margin:0">$a^2 + b^2 = ' + a * a + ' + ' + b * b + ' = ' + l + '$ und $c^2 = ' + r + '$.</p>' +
                '<p style="margin:6px 0 0">' + (ok ? '<span class="b-res">Gleich: Nach der Umkehrung des Satzes von Pythagoras hat das Dreieck bei $C$ einen rechten Winkel.</span>'
                    : 'Nicht gleich: Der Winkel bei $C$ ist ' + (l > r ? 'kleiner' : 'größer') + ' als $90^\\circ$, nämlich etwa $' + texNum(gam, 1) + '^\\circ$.') + '</p>' +
                '<p class="b-help" style="margin:8px 0 0">Ganze Zahlen mit $a^2 + b^2 = c^2$ heißen pythagoreische Zahlentripel.</p>';
            math(out);
        }
        render();
    });

    /* ---------- solving a right triangle step by step ---------- */
    // γ = 90° at C; given: a side and an angle, or two sides
    const RWD = {
        ca: { l: '$c$ und $\\alpha$', v: { c: 8, al: 35 } },
        ba: { l: '$b$ und $\\alpha$', v: { b: 6, al: 40 } },
        aa: { l: '$a$ und $\\alpha$', v: { a: 5, al: 30 } },
        ab: { l: '$a$ und $b$', v: { a: 5, b: 7 } },
        ac: { l: '$a$ und $c$', v: { a: 6, c: 10 } }
    };
    W('rwdreieckos9', function (box) {
        const S = { k: 'ca', v: Object.assign({}, RWD.ca.v) };
        const c = div(box, 'b-ctrls');
        seg(c, Object.keys(RWD).map(k => [k, RWD[k].l]), S.k, v => { S.k = v; S.v = Object.assign({}, RWD[v].v); build(); }, 'Gegeben');
        math(c);
        const sl = div(box, '');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function build() {
            sl.innerHTML = '';
            Object.keys(S.v).forEach(k => {
                if (k === 'al') range(sl, { label: 'Winkel $\\alpha$', min: 5, max: 85, step: 1, value: S.v.al, fmt: v => v + '°', onInput: v => { S.v.al = v; render(); } });
                else range(sl, { label: 'Seite $' + k + '$', min: 1, max: 12, step: 0.5, value: S.v[k], fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.v[k] = v; render(); } });
            });
            math(sl);
            render();
        }
        const sinD = d => Math.sin(d * DEG), cosD = d => Math.cos(d * DEG), tanD = d => Math.tan(d * DEG);
        function render() {
            const v = S.v, n = (x, d) => texNum(x, d == null ? 2 : d);
            let a, b, cc, al, st = [];
            if (S.k === 'ca') { cc = v.c; al = v.al; a = cc * sinD(al); b = cc * cosD(al);
                st = ['a = c \\cdot \\sin\\alpha = ' + n(cc, 1) + ' \\cdot \\sin ' + al + '^\\circ \\approx ' + n(a), 'b = c \\cdot \\cos\\alpha = ' + n(cc, 1) + ' \\cdot \\cos ' + al + '^\\circ \\approx ' + n(b)]; }
            else if (S.k === 'ba') { b = v.b; al = v.al; a = b * tanD(al); cc = b / cosD(al);
                st = ['a = b \\cdot \\tan\\alpha = ' + n(b, 1) + ' \\cdot \\tan ' + al + '^\\circ \\approx ' + n(a), 'c = \\dfrac{b}{\\cos\\alpha} = \\dfrac{' + n(b, 1) + '}{\\cos ' + al + '^\\circ} \\approx ' + n(cc)]; }
            else if (S.k === 'aa') { a = v.a; al = v.al; cc = a / sinD(al); b = a / tanD(al);
                st = ['c = \\dfrac{a}{\\sin\\alpha} = \\dfrac{' + n(a, 1) + '}{\\sin ' + al + '^\\circ} \\approx ' + n(cc), 'b = \\dfrac{a}{\\tan\\alpha} = \\dfrac{' + n(a, 1) + '}{\\tan ' + al + '^\\circ} \\approx ' + n(b)]; }
            else if (S.k === 'ab') { a = v.a; b = v.b; cc = Math.hypot(a, b); al = Math.atan(a / b) / DEG;
                st = ['\\tan\\alpha = \\dfrac{a}{b} = \\dfrac{' + n(a, 1) + '}{' + n(b, 1) + '}, \\quad \\alpha = \\tan^{-1}\\left(' + n(a / b, 3) + '\\right) \\approx ' + n(al, 1) + '^\\circ', 'c = \\sqrt{a^2 + b^2} \\approx ' + n(cc)]; }
            else { a = v.a; cc = v.c;
                if (a >= cc) { pic.innerHTML = ''; out.innerHTML = '<p style="margin:0">Die Kathete $a$ muss kürzer sein als die Hypotenuse $c$.</p>'; return math(out); }
                b = Math.sqrt(cc * cc - a * a); al = Math.asin(a / cc) / DEG;
                st = ['\\sin\\alpha = \\dfrac{a}{c} = \\dfrac{' + n(a, 1) + '}{' + n(cc, 1) + '}, \\quad \\alpha = \\sin^{-1}\\left(' + n(a / cc, 3) + '\\right) \\approx ' + n(al, 1) + '^\\circ', 'b = \\sqrt{c^2 - a^2} \\approx ' + n(b)]; }
            const be = 90 - al;
            st.push('\\beta = 90^\\circ - \\alpha \\approx ' + n(be, 1) + '^\\circ');
            // drawing: A left, C right angle at the bottom right, B above C
            const sc = Math.min(240 / b, 160 / a), A = [30, 200], Cq = [30 + b * sc, 200], Bq = [30 + b * sc, 200 - a * sc];
            let s = G.poly([A, Cq, Bq], area(CY, 0.15)) + G.rightMark(Cq, A, Bq, 12) + G.arc(A, Cq, Bq, 30, area(LAM, 0.3));
            s += G.txt([A[0] + 36, A[1] - 6], 'α', 'g-ang', 'start') + G.txt([(A[0] + Cq[0]) / 2, A[1] + 20], 'b ≈ ' + fmt(b, 2), 'g-lab');
            s += G.txt([Cq[0] + 8, (Cq[1] + Bq[1]) / 2 + 5], 'a ≈ ' + fmt(a, 2), 'g-lab', 'start') + G.txt([(A[0] + Bq[0]) / 2 - 8, (A[1] + Bq[1]) / 2 - 8], 'c ≈ ' + fmt(cc, 2), 'g-lab', 'end');
            s += G.txt([A[0] - 4, A[1] + 18], 'A', 'g-pt') + G.txt([Cq[0] + 4, Cq[1] + 18], 'C', 'g-pt') + G.txt([Bq[0] + 4, Bq[1] - 6], 'B', 'g-pt');
            pic.innerHTML = '<svg viewBox="0 0 ' + f1(Math.max(320, Cq[0] + 90)) + ' 230" role="img" aria-label="Rechtwinkliges Dreieck mit dem rechten Winkel bei C">' + s + '</svg>';
            out.innerHTML = st.map(t => '<p style="margin:0 0 6px">$' + t + '$</p>').join('') +
                '<p class="b-help" style="margin:4px 0 0">Gegenkathete von $\\alpha$ ist $a$, Ankathete ist $b$, Hypotenuse ist $c$. Der Taschenrechner steht auf DEG.</p>';
            math(out);
        }
        build();
    });

    /* ---------- a gable roof: height, rafter, roof area ---------- */
    W('dachos9', function (box) {
        const S = { b: 9, al: 40, L: 12 };
        const sl = div(box, '');
        range(sl, { label: 'Hausbreite $b$', min: 5, max: 14, step: 0.5, value: S.b, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.b = v; render(); } });
        range(sl, { label: 'Dachneigung $\\alpha$', min: 15, max: 60, step: 1, value: S.al, fmt: v => v + '°', onInput: v => { S.al = v; render(); } });
        range(sl, { label: 'Hauslänge $l$', min: 6, max: 20, step: 0.5, value: S.L, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.L = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const { b, al, L } = S, h = b / 2 * Math.tan(al * DEG), sp = b / 2 / Math.cos(al * DEG), A = 2 * sp * L;
            const sc = Math.min(260 / b, 150 / Math.max(h, 1)), x0 = 160 - b * sc / 2, y0 = 260, top = [160, y0 - h * sc];
            let s = '<rect x="' + f1(x0) + '" y="' + y0 + '" width="' + f1(b * sc) + '" height="40" style="' + area(VIO, 0.12) + '"/>';
            s += G.poly([[x0, y0], top, [x0 + b * sc, y0]], area(LAM, 0.18));
            s += G.line(top, [160, y0], sty(TXT, 1.2, DASH)) + G.rightMark([160, y0], [x0, y0], top, 10);
            s += G.arc([x0, y0], [x0 + 40, y0], top, 34, area(CY, 0.3)) + G.txt([x0 + 40, y0 - 8], 'α', 'g-ang', 'start');
            s += G.txt([168, y0 - h * sc / 2], 'h', 'g-side', 'start') + G.txt([(x0 + 160) / 2 - 10, (y0 + top[1]) / 2 - 8], 's', 'g-side', 'end');
            s += G.txt([160, y0 + 62], 'b = ' + fmt(b, 1) + ' m', 'g-lab');
            pic.innerHTML = '<svg viewBox="0 0 320 320" role="img" aria-label="Querschnitt eines Satteldachs mit Neigung ' + al + ' Grad">' + s + '</svg>';
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab">' +
                '<tr><td>Firsthöhe</td><td>$h = \\tfrac{b}{2} \\cdot \\tan \\alpha = ' + texNum(b / 2, 2) + ' \\cdot \\tan ' + al + '^\\circ \\approx ' + texNum(h, 2) + '\\,\\text{m}$</td></tr>' +
                '<tr><td>Sparrenlänge</td><td>$s = \\dfrac{b/2}{\\cos \\alpha} \\approx ' + texNum(sp, 2) + '\\,\\text{m}$</td></tr>' +
                '<tr><td>Dachfläche</td><td>$2 \\cdot s \\cdot l \\approx ' + texNum(A, 1) + '\\,\\text{m}^2$</td></tr></table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.</p>';
            math(out);
        }
        render();
    });
})();
