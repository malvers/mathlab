/* buch-os7.js — widgets of the book Mathematik · Oberschule 7 (js/buch.js; SVG helpers Buch.geo from js/buch-geometrie.js,
 * which must be loaded first). Every name ends in os7. The book also uses widgets of the Gymnasium books
 * (js/buch-gy6.js, js/buch-gy7.js, js/buch-gy8.js, js/buch-daten.js, js/buch-finanz.js, js/buch-gleichungen.js) and the tangram
 * of the Oberschule 6 book (js/buch-os6.js) instead of copying them.
 *   titelbildos7   the cover: a hundred square with 25 % lit, a hexagon tiling, a number line from −3 to 3, a prism, a pie chart
 *   tageszinsos7   interest for some days: capital, rate and days as sliders, the year of 360 days as a strip (data-k, data-p, data-t, data-hero)
 *   dichteos7      mass and density: a cuboid of wood, ice, aluminium, iron or gold, m = ρ · V, floats or sinks (data-start)
 *   quadrantos7    the coordinate plane with four quadrants: drag a point, read P(x | y), mirror it at an axis or at the origin
 *   parkettos7     tilings with regular polygons: triangles, squares, hexagons, 4.8.8, 3.6.3.6, and why pentagons leave a gap;
 *                  the angles at one vertex add up to 360° (data-start, data-hero)
 *   escheros7      an Escher tile from a square: what is cut off on one side is added on the opposite side, the tile still fills the plane
 *                  (two handles, data-hero)
 * Colours of drawn parts go into style="" (never fill=""), so js/farbschema.js can translate them — except on the cover,
 * which is dark in every scheme and keeps its colours through presentation attributes, like the Gymnasium covers.
 * Looks: the general classes of js/buch.css (b-ctrls, b-two, b-svgbox, g-svg, b-out).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, math, range, seg, div, texNum } = B;
    const { f1, poly, line, txt, hexFill, handle, dragSVG, ngon } = B.geo;
    const W = B.widget;
    const LAM = '#F5C242', CY = '#7fd8ee', PHI = '#A0C85A', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;
    let uid = 0;
    const fill = (c, a) => hexFill(c, a) + ';stroke-linejoin:round';
    const svg = (w, h, label, body) => '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' + body + '</svg>';
    const path = (d, st) => '<path d="' + d + '" style="' + st + '"/>';
    // hero mode (chapter opener): only the picture, centred
    function heroOnly(box, pic, hide, maxW) {
        if (box.dataset.hero == null) return false;
        hide.forEach(e => { if (e) e.style.display = 'none'; });
        if (pic.parentNode && pic.parentNode.classList.contains('b-two')) pic.parentNode.style.display = 'block';
        pic.style.maxWidth = (maxW || 280) + 'px'; pic.style.margin = '0 auto';
        return true;
    }
    // two decimal places also on English pages, where fmt writes a decimal point
    const euro = v => fmt(v, 2).replace(/(?<=[,.]\d)$/, '0') + ' €';

    /* ---------- the cover ---------- */
    W('titelbildos7', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        // presentation attributes, not style="": js/farbschema.js leaves them alone, the cover stays dark in every scheme
        const A = css => css.split(';').filter(Boolean).map(kv => { const k = kv.indexOf(':'); return ' ' + kv.slice(0, k).trim() + '="' + kv.slice(k + 1).trim() + '"'; }).join('');
        const pth = (d, css) => '<path d="' + d + '"' + A(css) + '/>';
        const ln = (p, q, css) => '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"' + A(css) + '/>';
        const closed = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
        const glow = (d, c, w, dash) => pth(d, 'stroke:' + c + ';stroke-width:12;stroke-opacity:0.12;fill:none;stroke-linejoin:round;stroke-linecap:round') +
            pth(d, 'stroke:' + c + ';stroke-width:' + (w || 3) + ';fill:none;stroke-linejoin:round;stroke-linecap:round' + (dash ? ';stroke-dasharray:' + dash : ''));
        let art = '';
        // a hundred square, 25 cells lit
        const q0 = [392, 352], c = 19;
        for (let i = 0; i < 100; i++) {
            const x = q0[0] + (i % 10) * c, y = q0[1] + Math.floor(i / 10) * c, on = (i % 10) < 5 && Math.floor(i / 10) < 5;
            art += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (c - 3) + '" height="' + (c - 3) + '" rx="2"' +
                A(on ? 'fill:' + LAM + ';fill-opacity:0.55;stroke:' + LAM + ';stroke-width:1.2' : 'fill:#7fd8ee;fill-opacity:0.06;stroke:#7fd8ee;stroke-opacity:0.25;stroke-width:1') + '/>';
        }
        art += glow(closed([q0, [q0[0] + 10 * c, q0[1]], [q0[0] + 10 * c, q0[1] + 10 * c], [q0[0], q0[1] + 10 * c]]), CY, 2.4);
        // a patch of the hexagon tiling
        const a = 38, X0 = 120, Y0 = 408, hx = [[X0, Y0], [X0 + a * Math.sqrt(3), Y0], [X0 + a * Math.sqrt(3) / 2, Y0 + 1.5 * a], [X0 - a * Math.sqrt(3) / 2, Y0 + 1.5 * a],
            [X0 + a * Math.sqrt(3) * 1.5, Y0 + 1.5 * a], [X0, Y0 + 3 * a], [X0 + a * Math.sqrt(3), Y0 + 3 * a]];
        hx.forEach((m, i) => {
            const P = ngon(m, a, 6, -Math.PI / 2), col = [LAM, PHI, CY, VIO, RED, PHI, LAM][i];
            art += pth(closed(P), 'fill:' + col + ';fill-opacity:0.14;stroke:none') + glow(closed(P), col, 2.2);
        });
        // a number line from −3 to 3, the point −2 lit
        const nx = v => 300 + v * 80;
        art += glow('M40 596 L566 596', '#ffffff', 2);
        art += pth('M566 596 L552 588 L552 604 Z', 'fill:#ffffff');
        for (let v = -3; v <= 3; v++) {
            art += ln([nx(v), 586], [nx(v), 606], 'stroke:#ffffff;stroke-opacity:' + (v ? 0.6 : 1) + ';stroke-width:2');
            art += '<text x="' + nx(v) + '" y="632" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="17"' + A('fill:#e8edf5;fill-opacity:0.75') + '>' + (v < 0 ? '−' + -v : v) + '</text>';
        }
        art += pth('M' + nx(0) + ' 576 Q' + nx(-1) + ' 548 ' + (nx(-2) + 6) + ' 574', 'stroke:' + RED + ';stroke-width:2.4;fill:none;stroke-dasharray:6 5');
        art += '<circle cx="' + nx(-2) + '" cy="596" r="15"' + A('fill:' + RED + ';fill-opacity:0.2') + '/><circle cx="' + nx(-2) + '" cy="596" r="7"' + A('fill:' + RED) + '/>';
        // a triangular prism in the oblique view
        const F = [[66, 772], [216, 772], [66, 682]], v = [42, -42], Fb = F.map(p => [p[0] + v[0], p[1] + v[1]]);
        art += pth(closed(F), 'fill:' + PHI + ';fill-opacity:0.12;stroke:none');
        art += pth('M' + f1(F[0][0]) + ' ' + f1(F[0][1]) + ' L' + f1(Fb[0][0]) + ' ' + f1(Fb[0][1]) + ' L' + f1(Fb[1][0]) + ' ' + f1(Fb[1][1]) + ' M' + f1(Fb[0][0]) + ' ' + f1(Fb[0][1]) + ' L' + f1(Fb[2][0]) + ' ' + f1(Fb[2][1]),
            'stroke:' + PHI + ';stroke-opacity:0.7;stroke-width:1.8;fill:none;stroke-dasharray:6 6');
        art += glow(closed(F), PHI, 2.6) + glow('M' + F[1][0] + ' ' + F[1][1] + ' L' + f1(Fb[1][0]) + ' ' + f1(Fb[1][1]) + ' L' + f1(Fb[2][0]) + ' ' + f1(Fb[2][1]) + ' L' + F[2][0] + ' ' + F[2][1], PHI, 2.6);
        // a pie chart: 50 %, 30 %, 20 %
        const M = [452, 714], r = 58;
        let a0 = -Math.PI / 2;
        [[0.5, LAM], [0.3, CY], [0.2, RED]].forEach(([s, col]) => {
            const a1 = a0 + s * 2 * Math.PI, p0 = [M[0] + r * Math.cos(a0), M[1] + r * Math.sin(a0)], p1 = [M[0] + r * Math.cos(a1), M[1] + r * Math.sin(a1)];
            const d = 'M' + M[0] + ' ' + M[1] + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + r + ' ' + r + ' 0 ' + (s > 0.5 ? 1 : 0) + ' 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z';
            art += pth(d, 'fill:' + col + ';fill-opacity:0.22;stroke:none') + glow(d, col, 2.2);
            a0 = a1;
        });
        const id = 'to7' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.96" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
        // the label on its own: the hundred square makes the markup longer than js/buch-en.js and js/buch-es.js translate in one piece
        box.firstChild.setAttribute('aria-label', 'Titelbild: ein Hunderterfeld mit 25 hellen Feldern, ein Parkett aus Sechsecken, ein Zahlenstrahl von minus 3 bis 3, ein Prisma und ein Kreisdiagramm');
    });

    /* ---------- interest for some days ---------- */
    W('tageszinsos7', function (box) {
        const S = { k: +(box.dataset.k || 2400), p: +(box.dataset.p || 3), t: +(box.dataset.t || 90) };
        const ctr = div(box, '');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 320);
        // slider values have no letters, js/buch-en.js leaves them alone: the English order is written here
        range(ctr, { label: 'Kapital $K$', min: 100, max: 10000, step: 100, value: S.k, fmt: v => B.en ? '€' + fmt(v) : fmt(v) + ' €', onInput: v => { S.k = v; render(); } });
        range(ctr, { label: 'Zinssatz $p\\,\\%$', min: 0.5, max: 8, step: 0.25, value: S.p, fmt: v => fmt(v, 2) + (B.en ? '%' : ' %'), onInput: v => { S.p = v; render(); } });
        range(ctr, { label: 'Tage $t$', min: 1, max: 360, step: 1, value: S.t, fmt: v => v + (v === 1 ? ' Tag' : ' Tage'), onInput: v => { S.t = v; render(); } });
        math(ctr);
        function render() {
            const Zj = S.k * S.p / 100, Zt = Zj * S.t / 360;
            const x0 = 20, w = 300, y = 34, h = 28, X = d => x0 + d / 360 * w;
            let s = '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="' + fill(CY, 0.08) + '"/>';
            s += '<rect x="' + x0 + '" y="' + y + '" width="' + f1(X(S.t) - x0) + '" height="' + h + '" rx="6" style="' + fill(LAM, 0.45) + '"/>';
            for (let m = 1; m < 12; m++) s += line([X(30 * m), y + h - 8], [X(30 * m), y + h], 'stroke:' + DIM + ';stroke-width:1.2');
            s += txt([x0, y - 10], '0', 'd-num', 'start') + txt([x0 + w, y - 10], '360 Tage', 'd-num', 'end');
            s += txt([X(S.t), y + h + 22], S.t + (S.t === 1 ? ' Tag' : ' Tage'), 'd-num', S.t < 40 ? 'start' : S.t > 320 ? 'end' : 'middle');
            // the coins: interest of the whole year against the part for t days
            const bh = 80, by = 212, full = Zj > 0 ? bh : 0, part = Zj > 0 ? bh * S.t / 360 : 0;
            s += '<rect x="70" y="' + (by - full) + '" width="60" height="' + full + '" rx="5" style="' + fill(CY, 0.2) + '"/>' +
                '<rect x="200" y="' + f1(by - part) + '" width="60" height="' + f1(part) + '" rx="5" style="' + fill(LAM, 0.5) + '"/>';
            s += line([40, by], [300, by], 'stroke:' + TXT + ';stroke-width:1.6');
            s += txt([100, by + 20], 'Jahr', 'd-num') + txt([230, by + 20], S.t + (S.t === 1 ? ' Tag' : ' Tage'), 'd-num');
            s += txt([100, by - full - 8], euro(Zj), 'd-num') + txt([230, by - part - 8], euro(Zt), 'd-num');
            pic.innerHTML = svg(340, 240, 'Zinsjahr mit 360 Tagen, davon ' + S.t + ' Tage; Jahreszinsen und Tageszinsen als Säulen', s);
            if (hero) return;
            out.innerHTML = '<p style="margin:0">Jahreszinsen: $Z = K \\cdot \\dfrac{p}{100} = ' + fmt(S.k) + ' \\cdot \\dfrac{' + texNum(S.p, 2) + '}{100} = ' + texNum(Zj, 2) + '$ €</p>' +
                '<p style="margin:8px 0 0">für $' + S.t + '$ ' + (S.t === 1 ? 'Tag' : 'Tage') + ': $Z = ' + texNum(Zj, 2) + ' \\cdot \\dfrac{' + S.t + '}{360} \\approx ' + texNum(Zt, 2) + '$ €</p>' +
                '<p class="b-help" style="margin:8px 0 0">Bei Banken hat ein Zinsjahr meist 360 Tage und jeder Monat 30 Tage. Gerundet wird erst am Ende auf ganze Cent.</p>';
            math(out);
        }
        render();
    });

    /* ---------- mass and density ---------- */
    const STOFF = {
        holz: { l: 'Holz', r: 0.5, c: '#d9a066', say: 'Fichtenholz', about: true },
        eis: { l: 'Eis', r: 0.92, c: CY, say: 'Eis' },
        alu: { l: 'Aluminium', r: 2.7, c: '#c6d0dc', say: 'Aluminium' },
        eisen: { l: 'Eisen', r: 7.9, c: DIM, say: 'Eisen' },
        gold: { l: 'Gold', r: 19.3, c: LAM, say: 'Gold' }
    };
    W('dichteos7', function (box) {
        const S = { s: box.dataset.start || 'holz', a: 10, b: 5, c: 4 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(STOFF).map(k => [k, STOFF[k].l]), S.s, v => { S.s = v; render(); }, 'Stoff');
        const sl = div(box, '');
        [['a', 'Länge $a$'], ['b', 'Breite $b$'], ['c', 'Höhe $c$']].forEach(([k, l]) => range(sl, { label: l, min: 1, max: 12, step: 1, value: S[k], fmt: v => v + ' cm', onInput: v => { S[k] = v; render(); } }));
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const St = STOFF[S.s], V = S.a * S.b * S.c, m = St.r * V;
            // the scale shrinks for big cuboids, so the picture always fits into 340 × 230
            const e = Math.min(16, 250 / (S.a + 0.36 * S.b), 170 / (S.c + 0.36 * S.b)), k = 0.5 * e * Math.SQRT1_2, o = [56, 200];
            const P = (x, y, z) => [o[0] + x * e + y * k, o[1] - z * e - y * k];
            const fr = [P(0, 0, 0), P(S.a, 0, 0), P(S.a, 0, S.c), P(0, 0, S.c)], tp = [P(0, 0, S.c), P(S.a, 0, S.c), P(S.a, S.b, S.c), P(0, S.b, S.c)],
                rt = [P(S.a, 0, 0), P(S.a, S.b, 0), P(S.a, S.b, S.c), P(S.a, 0, S.c)];
            let s = poly(fr, fill(St.c, 0.35)) + poly(tp, fill(St.c, 0.5)) + poly(rt, fill(St.c, 0.22));
            s += txt([(fr[0][0] + fr[1][0]) / 2, o[1] + 20], S.a + ' cm', 'd-num') + txt([fr[0][0] - 6, (fr[0][1] + fr[3][1]) / 2 + 5], S.c + ' cm', 'd-num', 'end');
            s += txt([(rt[0][0] + rt[1][0]) / 2 + 12, (rt[0][1] + rt[1][1]) / 2 + 12], S.b + ' cm', 'd-num', 'start');
            pic.innerHTML = svg(340, 230, 'Quader aus ' + St.l + ', ' + S.a + ' cm mal ' + S.b + ' cm mal ' + S.c + ' cm', s);
            const mk = m >= 1000 ? ' = ' + texNum(m / 1000, 5) + '\\text{ kg}' : '';
            out.innerHTML = '<p style="margin:0">Volumen: $V = ' + S.a + ' \\cdot ' + S.b + ' \\cdot ' + S.c + ' = ' + V + '\\text{ cm}^3$</p>' +
                '<p style="margin:8px 0 0">Dichte von ' + St.say + ': $\\varrho ' + (St.about ? '\\approx' : '=') + ' ' + texNum(St.r, 2) + '\\,\\tfrac{\\text{g}}{\\text{cm}^3}$</p>' +
                '<p style="margin:8px 0 0">Masse: $m = \\varrho \\cdot V = ' + texNum(St.r, 2) + ' \\cdot ' + V + ' = ' + texNum(m, 2) + '\\text{ g}' + mk + '$</p>' +
                '<p class="b-help" style="margin:8px 0 0">' + (St.r < 1 ? 'Die Dichte ist kleiner als die von Wasser ($1\\,\\tfrac{\\text{g}}{\\text{cm}^3}$): Der Körper schwimmt.' : 'Die Dichte ist größer als die von Wasser ($1\\,\\tfrac{\\text{g}}{\\text{cm}^3}$): Der Körper geht unter.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- the coordinate plane with four quadrants ---------- */
    W('quadrantos7', function (box) {
        const S = { x: 3, y: 2, m: 'keine' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['keine', 'nur P'], ['x', 'an der x-Achse'], ['y', 'an der y-Achse'], ['o', 'am Ursprung']], S.m, v => { S.m = v; render(); }, 'Spiegeln');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const U = 22, C = [160, 160], X = x => C[0] + x * U, Y = y => C[1] - y * U;
        dragSVG(pic, (h, px, py) => {
            S.x = Math.max(-6, Math.min(6, Math.round((px - C[0]) / U))); S.y = Math.max(-6, Math.min(6, Math.round((C[1] - py) / U)));
            render();
        });
        const quad = (x, y) => x === 0 || y === 0 ? 'auf einer Achse' : x > 0 ? (y > 0 ? 'im I. Quadranten' : 'im IV. Quadranten') : (y > 0 ? 'im II. Quadranten' : 'im III. Quadranten');
        const num = v => v < 0 ? '−' + -v : String(v);
        function render() {
            let s = '';
            for (let v = -6; v <= 6; v++) s += line([X(v), Y(-6.5)], [X(v), Y(6.5)], 'stroke:rgba(127,216,238,' + (v ? 0.1 : 0) + ')') + line([X(-6.5), Y(v)], [X(6.5), Y(v)], 'stroke:rgba(127,216,238,' + (v ? 0.1 : 0) + ')');
            s += line([X(-6.8), C[1]], [X(6.8), C[1]], 'stroke:' + TXT + ';stroke-width:1.6') + line([C[0], Y(-6.8)], [C[0], Y(6.8)], 'stroke:' + TXT + ';stroke-width:1.6');
            s += path('M' + X(6.8) + ' ' + C[1] + ' l-8 -4 l0 8 Z', 'fill:' + TXT) + path('M' + C[0] + ' ' + Y(6.8) + ' l-4 8 l8 0 Z', 'fill:' + TXT);
            [-6, -4, -2, 2, 4, 6].forEach(v => { s += txt([X(v), C[1] + 17], num(v), 'd-num') + txt([C[0] - 6, Y(v) + 5], num(v), 'd-num', 'end'); });
            s += txt([X(6.6), C[1] - 8], 'x', 'g-lab', 'end') + txt([C[0] + 9, Y(6.5)], 'y', 'g-lab', 'start');
            [['I', 3.5, 5.6], ['II', -3.5, 5.6], ['III', -3.5, -5.9], ['IV', 3.5, -5.9]].forEach(([n, x, y]) => { s += '<text class="d-num" x="' + X(x) + '" y="' + Y(y) + '" text-anchor="middle" style="fill:' + DIM + ';fill-opacity:0.7">' + n + '</text>'; });
            const Q = S.m === 'x' ? [S.x, -S.y] : S.m === 'y' ? [-S.x, S.y] : S.m === 'o' ? [-S.x, -S.y] : null;
            if (Q) {
                s += line([X(S.x), Y(S.y)], [X(Q[0]), Y(Q[1])], 'stroke:' + VIO + ';stroke-width:1.6;stroke-dasharray:5 4');
                s += '<circle cx="' + X(Q[0]) + '" cy="' + Y(Q[1]) + '" r="7" style="fill:' + VIO + '"/>' + txt([X(Q[0]) + 12, Y(Q[1]) - 10], "P'", 'g-lab', 'start');
            }
            s += line([X(S.x), Y(S.y)], [X(S.x), C[1]], 'stroke:' + LAM + ';stroke-width:1.4;stroke-dasharray:4 4') + line([X(S.x), Y(S.y)], [C[0], Y(S.y)], 'stroke:' + LAM + ';stroke-width:1.4;stroke-dasharray:4 4');
            s += handle([X(S.x), Y(S.y)], 'P') + txt([X(S.x) + 14, Y(S.y) - 12], 'P', 'g-lab', 'start');
            pic.innerHTML = svg(320, 320, 'Koordinatensystem mit vier Quadranten, Punkt P(' + S.x + ' | ' + S.y + ')', s);
            const t = v => v < 0 ? '-' + -v : String(v);
            out.innerHTML = '<p style="margin:0">$P(' + t(S.x) + ' \\mid ' + t(S.y) + ')$ liegt ' + quad(S.x, S.y) + '.</p>' +
                (Q ? '<p style="margin:8px 0 0">Spiegelpunkt: $P\'(' + t(Q[0]) + ' \\mid ' + t(Q[1]) + ')$ ' + quad(Q[0], Q[1]) + '.</p><p class="b-help" style="margin:6px 0 0">' +
                    (S.m === 'x' ? 'An der x-Achse ändert die y-Koordinate ihr Vorzeichen.' : S.m === 'y' ? 'An der y-Achse ändert die x-Koordinate ihr Vorzeichen.' : 'Am Ursprung ändern beide Koordinaten ihr Vorzeichen.') + '</p>' : '') +
                '<p class="b-help" style="margin:8px 0 0">Ziehe P. Zuerst kommt die x-Koordinate (nach rechts oder links), dann die y-Koordinate (nach oben oder unten).</p>';
            math(out);
        }
        render();
    });

    /* ---------- tilings with regular polygons ---------- */
    const PARK = {
        drei: { l: 'Dreiecke', vx: '6 Dreiecke: $6 \\cdot 60^\\circ = 360^\\circ$' },
        vier: { l: 'Quadrate', vx: '4 Quadrate: $4 \\cdot 90^\\circ = 360^\\circ$' },
        sechs: { l: 'Sechsecke', vx: '3 Sechsecke: $3 \\cdot 120^\\circ = 360^\\circ$' },
        fuenf: { l: 'Fünfecke', vx: '3 Fünfecke: $3 \\cdot 108^\\circ = 324^\\circ$ – es bleibt eine Lücke von $36^\\circ$. 4 Fünfecke: $432^\\circ$, das ist zu viel.' },
        acht: { l: 'Achtecke und Quadrate', vx: '2 Achtecke und 1 Quadrat: $2 \\cdot 135^\\circ + 90^\\circ = 360^\\circ$' },
        dreisechs: { l: 'Sechsecke und Dreiecke', vx: '2 Sechsecke und 2 Dreiecke: $2 \\cdot 120^\\circ + 2 \\cdot 60^\\circ = 360^\\circ$' }
    };
    W('parkettos7', function (box) {
        const S = { k: box.dataset.start || 'sechs' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(PARK).map(k => [k, PARK[k].l]), S.k, v => { S.k = v; render(); }, 'Parkett');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 300);
        const Wd = 320, Ht = 280, cx = Wd / 2, cy = Ht / 2;
        const tile = (P, c, a) => poly(P, fill(c, a || 0.22) + ';stroke-width:1.6');
        const inView = P => P.some(p => p[0] > -40 && p[0] < Wd + 40 && p[1] > -40 && p[1] < Ht + 40);
        function tiles(k) {
            const out = [], a = 40, r3 = Math.sqrt(3);
            if (k === 'vier') {
                for (let i = -1; i <= 9; i++) for (let j = -1; j <= 8; j++) { const x = cx + (i - 4) * a, y = cy + (j - 4) * a; out.push([[[x, y], [x + a, y], [x + a, y + a], [x, y + a]], (i + j) % 2 ? CY : '#5fb6cf']); }
            } else if (k === 'drei') {
                const h = a * r3 / 2;
                for (let j = -1; j <= 8; j++) for (let i = -2; i <= 10; i++) {
                    const x = cx + (i - 4) * a + (j % 2 ? a / 2 : 0), y = cy + (j - 4) * h;
                    out.push([[[x, y + h], [x + a, y + h], [x + a / 2, y]], PHI]);
                    out.push([[[x + a / 2, y], [x + 1.5 * a, y], [x + a, y + h]], '#7fa64a']);
                }
            } else if (k === 'sechs') {
                const s = 30;
                for (let j = -1; j <= 7; j++) for (let i = -1; i <= 7; i++) {
                    const m = [cx + (i - 3) * s * r3 + (j % 2 ? s * r3 / 2 : 0), cy + (j - 3) * 1.5 * s];
                    out.push([ngon(m, s, 6, -Math.PI / 2), [LAM, '#e9b949', '#d9a03a'][(i + 2 * j + 30) % 3]]);
                }
            } else if (k === 'acht') {
                const s = 26, w = s * (1 + Math.SQRT2);
                for (let i = -1; i <= 6; i++) for (let j = -1; j <= 6; j++) {
                    const m = [cx + (i - 2.5) * w, cy + (j - 2.5) * w];
                    out.push([ngon(m, s / (2 * Math.sin(Math.PI / 8)), 8, Math.PI / 8), VIO]);
                    out.push([ngon([m[0] + w / 2, m[1] + w / 2], s / Math.SQRT2, 4, 0), CY]);
                }
            } else if (k === 'dreisechs') {
                const s = 28;
                const L = (i, j) => [cx + (i - 3) * 2 * s + j * s, cy + (j - 3) * s * r3];
                for (let j = -1; j <= 7; j++) for (let i = -4; i <= 8; i++) {
                    const A0 = L(i, j), B0 = L(i + 1, j), C0 = L(i, j + 1), D0 = L(i + 1, j + 1);
                    out.push([ngon(A0, s, 6, 0), LAM]);
                    const M = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
                    out.push([[M(A0, B0), M(B0, C0), M(C0, A0)], PHI]);
                    out.push([[M(B0, C0), M(C0, D0), M(D0, B0)], PHI]);
                }
            }
            return out.filter(t => inView(t[0]));
        }
        function render() {
            let s = '';
            if (S.k === 'fuenf') {
                const R = 62, V = [cx, cy + 10];
                // three regular pentagons around the vertex V, each with one corner at V
                [0, 1, 2].forEach(n => {
                    const dir = (-90 + 54 + n * 108) * DEG, m = [V[0] + R * Math.cos(dir), V[1] + R * Math.sin(dir)];
                    const P = ngon(m, R, 5, dir + Math.PI);
                    s += tile(P, [RED, '#e58a6f', '#c95447'][n], 0.25);
                });
                const g0 = (-90 - 36) * DEG, g1 = g0 + 36 * DEG;   // the gap: the three pentagons cover from −90° round to 234°
                s += path('M' + V[0] + ' ' + V[1] + ' L' + f1(V[0] + 130 * Math.cos(g0)) + ' ' + f1(V[1] + 130 * Math.sin(g0)) + ' L' + f1(V[0] + 130 * Math.cos(g1)) + ' ' + f1(V[1] + 130 * Math.sin(g1)) + ' Z',
                    'fill:' + LAM + ';fill-opacity:0.25;stroke:' + LAM + ';stroke-width:1.6;stroke-dasharray:5 4');
                s += txt([V[0] + 92 * Math.cos(g0 + 18 * DEG), V[1] + 92 * Math.sin(g0 + 18 * DEG) + 5], '36°', 'd-num');
                s += '<circle cx="' + V[0] + '" cy="' + V[1] + '" r="5" style="fill:' + TXT + '"/>';
            } else {
                tiles(S.k).forEach(([P, c]) => { s += tile(P, c); });
                // one vertex near the centre
                const pts = tiles(S.k).flatMap(t => t[0]);
                let best = pts[0], bd = 1e9;
                pts.forEach(p => { const d = (p[0] - cx) ** 2 + (p[1] - cy) ** 2; if (d < bd) { bd = d; best = p; } });
                s += '<circle cx="' + f1(best[0]) + '" cy="' + f1(best[1]) + '" r="13" style="fill:' + TXT + ';fill-opacity:0.15"/><circle cx="' + f1(best[0]) + '" cy="' + f1(best[1]) + '" r="5" style="fill:' + TXT + '"/>';
            }
            pic.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" role="img" aria-label="Parkett: ' + PARK[S.k].l + '"><defs><clipPath id="pk' + (++uid) + '"><rect width="' + Wd + '" height="' + Ht + '" rx="10"/></clipPath></defs>' +
                '<g clip-path="url(#pk' + uid + ')">' + s + '</g></svg>';
            if (hero) return;
            out.innerHTML = '<p style="margin:0"><b>' + PARK[S.k].l + '</b></p><p style="margin:8px 0 0">An einer Ecke: ' + PARK[S.k].vx + '</p>' +
                '<p class="b-help" style="margin:8px 0 0">Ein Parkett bedeckt die Ebene ohne Lücken und ohne Überlappung. Das geht nur, wenn die Winkel an jeder Ecke zusammen genau $360^\\circ$ ergeben. ' +
                'Mit nur einer Sorte regelmäßiger Vielecke klappt das bei Dreiecken, Quadraten und Sechsecken.</p>';
            math(out);
        }
        render();
    });

    /* ---------- an Escher tile from a square ---------- */
    W('escheros7', function (box) {
        // the handles sit in the middle of the curved edges: left edge (bulge to the right, height), bottom edge (position, bulge upwards)
        const S = { L: [-14, 40], Bm: [60, 14] };
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [out], 300);
        const s = 96, o = [64, 52];   // the tile in the middle row and column of a 3 × 3 patch
        dragSVG(pic, (h, px, py) => {
            const x = px - (o[0] + s), y = py - (o[1] + s);
            if (h === 'L') S.L = [Math.max(-24, Math.min(24, x)), Math.max(s / 4, Math.min(3 * s / 4, y))];
            else S.Bm = [Math.max(s / 4, Math.min(3 * s / 4, x)), Math.max(-24, Math.min(24, s - y))];
            render();
        });
        // the outline of the tile with its top-left corner at (x, y): top and bottom share one curve, left and right another
        // a quadratic curve passes through its handle H at t = ½ when the control point is C = 2H − (start + end) / 2
        function outline(x, y) {
            const L = [2 * S.L[0], 2 * S.L[1] - s / 2], Bm = [2 * S.Bm[0] - s / 2, 2 * S.Bm[1]];
            return 'M' + x + ' ' + y +
                ' Q' + f1(x + Bm[0]) + ' ' + f1(y - Bm[1]) + ' ' + (x + s) + ' ' + y +
                ' Q' + f1(x + s + L[0]) + ' ' + f1(y + L[1]) + ' ' + (x + s) + ' ' + (y + s) +
                ' Q' + f1(x + Bm[0]) + ' ' + f1(y + s - Bm[1]) + ' ' + x + ' ' + (y + s) +
                ' Q' + f1(x + L[0]) + ' ' + f1(y + L[1]) + ' ' + x + ' ' + y + ' Z';
        }
        function render() {
            let t = '';
            for (let i = -1; i <= 3; i++) for (let j = -1; j <= 3; j++) {
                const x = o[0] + i * s, y = o[1] + j * s, mid = i === 1 && j === 1;
                t += path(outline(x, y), fill(mid ? LAM : (i + j) % 2 ? CY : PHI, mid ? 0.5 : 0.2) + ';stroke-width:' + (mid ? 2.4 : 1.4));
            }
            const ox = o[0] + s, oy = o[1] + s;
            if (!hero) {
                t += path('M' + ox + ' ' + oy + ' L' + (ox + s) + ' ' + oy + ' L' + (ox + s) + ' ' + (oy + s) + ' L' + ox + ' ' + (oy + s) + ' Z', 'fill:none;stroke:' + TXT + ';stroke-opacity:0.5;stroke-width:1.2;stroke-dasharray:4 4');
                t += handle([ox + S.L[0], oy + S.L[1]], 'L', RED) + handle([ox + S.Bm[0], oy + s - S.Bm[1]], 'B', VIO);
                // the copies of the controls on the opposite sides
                t += '<circle cx="' + f1(ox + s + S.L[0]) + '" cy="' + f1(oy + S.L[1]) + '" r="6" style="fill:none;stroke:' + RED + ';stroke-width:2"/>' +
                    '<circle cx="' + f1(ox + S.Bm[0]) + '" cy="' + f1(oy - S.Bm[1]) + '" r="6" style="fill:none;stroke:' + VIO + ';stroke-width:2"/>';
            }
            pic.innerHTML = '<svg viewBox="0 0 320 300" role="img" aria-label="Parkett aus einer verformten Quadratkachel"><defs><clipPath id="es' + (++uid) + '"><rect width="320" height="300" rx="10"/></clipPath></defs>' +
                '<g clip-path="url(#es' + uid + ')">' + t + '</g></svg>';
            if (hero) return;
            out.innerHTML = '<p style="margin:0">Ziehe den <b>roten</b> Punkt: Die linke Kante biegt sich, die rechte Kante macht genau dieselbe Form. Ziehe den <b>lila</b> Punkt: Unten und oben ändern sich gemeinsam.</p>' +
                '<p style="margin:8px 0 0">Was auf einer Seite weggenommen wird, kommt auf der gegenüberliegenden Seite dazu. Darum hat die Kachel immer denselben Flächeninhalt wie das Quadrat – und sie füllt die Ebene lückenlos.</p>' +
                '<p class="b-help" style="margin:8px 0 0">So arbeitete M. C. Escher: Er veränderte Kanten eines Vielecks, verschob oder drehte die Änderung auf eine andere Kante und malte in die Kachel ein Tier.</p>';
        }
        render();
    });
})();
