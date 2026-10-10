/* buch-geometrie.js — geometry widgets of the book Mathematik · Gymnasium 9 (js/buch.js).
 *   titelbildgy9     the cover of the GY 9 book: Pythagoras with unit squares, a golden rectangle with its spiral, a circle between two hexagons, a parabola
 *   pythagoras       right triangle on the Thales circle, C draggable: squares over the sides (Pythagoras), cathetus theorem, altitude theorem (data-mode, data-hero)
 *   trigo            right triangle with angle slider: sine, cosine and tangent as ratios of sides (degrees only; data-al, data-hero)
 *   kreisteil        circular arc and sector: radius and angle, the end of the arc draggable (data-hero: picture only)
 *   vieleck          regular n-gon inside and outside the circle: π between two bounds as Archimedes did (6, 12, 24, 48, 96)
 *   goldenerschnitt  golden section: divide a segment, golden rectangle with spiral, pentagram (data-mode="strecke|rechteck|pentagramm", data-hero)
 *   spitzkoerper     square pyramid and circular cone in an oblique view: height, slant height, edge by Pythagoras, surface and volume (data-k, data-hero)
 * Looks: js/buch.css (section "Widgets of the Gymnasium 9 chapters").
 * B.geo exports the SVG helpers for other modules (js/buch-gy7.js and the books of the other grades).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;
    let uid = 0;

    /* ---------- small SVG helpers ---------- */
    const f1 = v => (Math.round(v * 10) / 10).toString();
    const pts = list => list.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ');
    const poly = (list, st) => '<polygon points="' + pts(list) + '" style="' + st + '"/>';
    const line = (p, q, st) => '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '" style="' + st + '"/>';
    const txt = (p, s, cls, anchor) => '<text class="' + (cls || 'g-lab') + '" x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>';
    const dot = (p, c, r) => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (r || 4.5) + '" fill="' + (c || TXT) + '"/>';
    const handle = (p, i, c) => '<g class="g-handle" data-h="' + i + '"><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="22" fill="transparent"/>' +
        '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="8" fill="' + (c || LAM) + '" stroke="#0a1426" stroke-width="2"/>' +
        '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="13" fill="none" stroke="' + (c || LAM) + '" stroke-width="1.2"/></g>';
    const fill = (c, a) => 'fill:' + c.replace('rgb(', 'rgba(').replace(')', ',' + a + ')') + ';stroke:' + c + ';stroke-width:1.8';
    const hexFill = (c, a) => {   // '#7fd8ee' → rgba
        if (c[0] !== '#') return fill(c, a);
        const n = parseInt(c.slice(1), 16);
        return 'fill:rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ');stroke:' + c + ';stroke-width:1.8';
    };
    const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
    const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
    const mul = (p, k) => [p[0] * k, p[1] * k];
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const len = p => Math.hypot(p[0], p[1]);
    // square over PQ on the side away from point far
    function squareOut(P, Q, far) {
        const d = sub(Q, P);
        let n = [d[1], -d[0]];
        if ((far[0] - P[0]) * n[0] + (far[1] - P[1]) * n[1] > 0) n = mul(n, -1);
        return [P, Q, add(Q, n), add(P, n)];
    }
    // right-angle mark at V between the directions to P and Q
    function rightMark(V, P, Q, s) {
        const u = mul(sub(P, V), s / len(sub(P, V))), w = mul(sub(Q, V), s / len(sub(Q, V)));
        return '<polyline points="' + pts([add(V, u), add(add(V, u), w), add(V, w)]) + '" style="fill:none;stroke:' + TXT + ';stroke-width:1.3;opacity:0.8"/>';
    }
    // angle arc at V from direction P to direction Q (shorter way)
    function arc(V, P, Q, r, st) {
        const a0 = Math.atan2(P[1] - V[1], P[0] - V[0]), a1 = Math.atan2(Q[1] - V[1], Q[0] - V[0]);
        let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const s = [V[0] + r * Math.cos(a0), V[1] + r * Math.sin(a0)], e = [V[0] + r * Math.cos(a0 + d), V[1] + r * Math.sin(a0 + d)];
        return '<path d="M' + f1(V[0]) + ' ' + f1(V[1]) + ' L' + f1(s[0]) + ' ' + f1(s[1]) + ' A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + f1(e[0]) + ' ' + f1(e[1]) + ' Z" style="' + st + '"/>';
    }
    // pointer position in the coordinates of the SVG inside holder
    function svgXY(holder, e) {
        const svg = holder.querySelector('svg'); if (!svg) return null;
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const m = svg.getScreenCTM(); if (!m) return null;
        const p = pt.matrixTransform(m.inverse());
        return [p.x, p.y];
    }
    // handles (elements with data-h) inside a holder whose SVG is redrawn on every move
    function dragSVG(holder, onMove) {
        let drag = null;
        holder.addEventListener('pointerdown', e => {
            const h = e.target.closest('[data-h]'); if (!h) return;
            drag = h.dataset.h; holder.setPointerCapture(e.pointerId); e.preventDefault();
        });
        holder.addEventListener('pointermove', e => {
            if (drag == null) return;
            const p = svgXY(holder, e); if (p) onMove(drag, p[0], p[1]);
        });
        const end = () => { drag = null; };
        holder.addEventListener('pointerup', end); holder.addEventListener('pointercancel', end);
    }
    // regular n-gon around centre c with radius r, first corner at angle a0 (radians, SVG orientation)
    const ngon = (c, r, n, a0) => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos(a0 + 2 * Math.PI * i / n), c[1] + r * Math.sin(a0 + 2 * Math.PI * i / n)]);
    // golden rectangle cut into squares: the squares and the quarter arcs of the spiral (see the cover and goldenerschnitt)
    function goldSquares(x, y, w, h, steps) {
        const sq = [];
        for (let k = 0; k < steps; k++) {
            let s, q, c, a, b;
            switch (k % 4) {
                case 0: s = h; q = [x, y]; c = [x + s, y + s]; a = [x, y + s]; b = [x + s, y]; x += s; w -= s; break;
                case 1: s = w; q = [x, y]; c = [x, y + s]; a = [x, y]; b = [x + s, y + s]; y += s; h -= s; break;
                case 2: s = h; q = [x + w - s, y]; c = [x + w - s, y]; a = [x + w, y]; b = [x + w - s, y + s]; w -= s; break;
                default: s = w; q = [x, y + h - s]; c = [x + s, y + h - s]; a = [x + s, y + h]; b = [x, y + h - s]; h -= s;
            }
            sq.push({ x: q[0], y: q[1], s, from: a, to: b });
        }
        return sq;
    }
    const spiral = sq => sq.map((t, i) => (i ? '' : 'M' + f1(t.from[0]) + ' ' + f1(t.from[1])) + ' A' + f1(t.s) + ' ' + f1(t.s) + ' 0 0 1 ' + f1(t.to[0]) + ' ' + f1(t.to[1])).join('');

    /* ---------- the cover ---------- */
    W('titelbildgy9', function (box) {
        const Wd = 600, Ht = 850, u = 34;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        let art = '';
        const glow = (d, c, w, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const closed = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
        // a parabola far behind everything
        let pd = '';
        for (let i = 0; i <= 120; i++) { const x = -20 + 640 * i / 120, y = 832 - 0.0047 * (x - 300) ** 2; pd += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
        art += '<path d="' + pd + '" stroke="#B8A4F2" stroke-width="2.4" stroke-opacity="0.55" fill="none" stroke-dasharray="8 10"/>';
        // Pythagoras 3 · 4 · 5 with the unit squares
        const C = [130, 640], Bv = [130 + 4 * u, 640], A = [130, 640 - 3 * u];
        const sqA = squareOut(C, Bv, A), sqB = squareOut(A, C, Bv), sqC = squareOut(A, Bv, C);
        const cells = (q, n, c) => {
            let s = '';
            const e1 = sub(q[1], q[0]), e2 = sub(q[3], q[0]);
            for (let i = 1; i < n; i++) {
                s += line(add(q[0], mul(e1, i / n)), add(q[3], mul(e1, i / n)), 'stroke:' + c + ';stroke-opacity:0.35;stroke-width:1');
                s += line(add(q[0], mul(e2, i / n)), add(q[1], mul(e2, i / n)), 'stroke:' + c + ';stroke-opacity:0.35;stroke-width:1');
            }
            return s;
        };
        [[sqA, 4, '#F5C242'], [sqB, 3, '#7fd8ee'], [sqC, 5, '#A0C85A']].forEach(([q, n, c]) => {
            art += '<path d="' + closed(q) + '" fill="' + c + '" fill-opacity="0.09"/>' + cells(q, n, c) + glow(closed(q), c, 2.6);
        });
        art += glow(closed([A, Bv, C]), '#ffffff', 2.4);
        art += rightMark(C, A, Bv, 15);
        // golden rectangle with its spiral
        const gw = 200, gh = gw / ((1 + Math.sqrt(5)) / 2), gx = 386, gy = 424;
        const gs = goldSquares(gx, gy, gw, gh, 7);
        gs.forEach(t => { art += '<rect x="' + f1(t.x) + '" y="' + f1(t.y) + '" width="' + f1(t.s) + '" height="' + f1(t.s) + '" fill="none" stroke="#F5C242" stroke-opacity="0.38" stroke-width="1.2"/>'; });
        art += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + f1(gh) + '" fill="#F5C242" fill-opacity="0.05" stroke="#F5C242" stroke-opacity="0.7" stroke-width="1.6"/>';
        art += glow(spiral(gs), '#F5C242', 3);
        // circle between an inner and an outer hexagon (Archimedes' first step)
        const M = [478, 694], r = 88;
        art += glow('M' + (M[0] - r) + ' ' + M[1] + ' a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0', '#B8A4F2', 3);
        art += glow(closed(ngon(M, r, 6, -Math.PI / 2)), '#7fd8ee', 2.2);
        art += glow(closed(ngon(M, r / Math.cos(Math.PI / 6), 6, -Math.PI / 2)), '#7fd8ee', 1.8, '7 8');
        // marked points
        [A, Bv, C, M, [300, 832]].forEach(p => { art += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        const id = 'tg' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- Pythagoras, cathetus and altitude theorem ---------- */
    // hypotenuse AB fixed (c = 5 cm), C on the Thales circle; a = BC, b = AC, foot of the altitude H, p = HB, q = AH
    W('pythagoras', function (box) {
        const CL = 5, c = 180, A = [130, 240], Bv = [310, 240], M = [220, 240], k = CL / c;
        const S = { phi: 2 * Math.asin(0.6), mode: box.dataset.mode || 'pyth' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['pyth', 'Pythagoras'], ['kath', 'Kathetensatz'], ['hoehe', 'Höhensatz']], S.mode, v => { S.mode = v; render(); }, 'Satz');
        const pre = div(ctr, 'b-ctrl');
        pre.innerHTML = '<button type="button" class="b-btn" data-p="345">3 · 4 · 5</button><button type="button" class="b-btn" data-p="iso">gleichschenklig</button>';
        pre.addEventListener('click', e => {
            const b = e.target.closest('[data-p]'); if (!b) return;
            S.phi = b.dataset.p === 'iso' ? Math.PI / 2 : 2 * Math.asin(0.6); render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Zieh am Punkt $C$. Er bleibt auf dem Thaleskreis über $\\overline{AB}$, deshalb ist der Winkel bei $C$ immer ein rechter.');
        math(help);
        // data-hero: only the picture (opening of a chapter), C stays draggable
        if (box.dataset.hero != null) { ctr.style.display = 'none'; out.style.display = 'none'; help.style.display = 'none'; two.style.display = 'block'; pic.style.maxWidth = '300px'; pic.style.margin = '0 auto'; }
        dragSVG(pic, (i, x, y) => {
            let phi = Math.atan2(M[1] - y, x - M[0]);
            phi = Math.min(Math.max(phi, 10 * DEG), 170 * DEG);
            S.phi = phi; render();
        });
        function render() {
            const C = [M[0] + c / 2 * Math.cos(S.phi), M[1] - c / 2 * Math.sin(S.phi)];
            const H = [C[0], A[1]];
            const a = len(sub(Bv, C)) * k, b = len(sub(A, C)) * k, p = (Bv[0] - H[0]) * k, q = (H[0] - A[0]) * k, h = (A[1] - C[1]) * k;
            const sqA = squareOut(C, Bv, A), sqB = squareOut(A, C, Bv), sqC = [A, Bv, add(Bv, [0, c]), add(A, [0, c])];
            let s = '<path d="M' + (M[0] - c / 2) + ' ' + M[1] + ' A' + c / 2 + ' ' + c / 2 + ' 0 0 1 ' + (M[0] + c / 2) + ' ' + M[1] + '" style="fill:none;stroke:' + DIM + ';stroke-width:1.2;stroke-dasharray:4 5"/>';
            const area = (q2, label, val, col) => {
                const m = mul(add(add(q2[0], q2[1]), add(q2[2], q2[3])), 0.25), side = len(sub(q2[1], q2[0]));
                if (side < 34) return '';
                return txt([m[0], m[1] - (side > 58 ? 4 : -5)], label, 'g-area', 'middle').replace('class="g-area"', 'class="g-area" style="fill:' + col + '"') +
                    (side > 58 ? txt([m[0], m[1] + 16], fmt(val, 2), 'g-val') : '');
            };
            if (S.mode === 'pyth') {
                s += poly(sqA, fill(LAM, 0.16)) + poly(sqB, hexFill(CY, 0.16)) + poly(sqC, fill(PHI, 0.14));
                s += area(sqA, 'a²', a * a, LAM) + area(sqB, 'b²', b * b, CY) + area(sqC, 'c²', CL * CL, PHI);
            } else if (S.mode === 'kath') {
                const left = [A, H, add(H, [0, c]), add(A, [0, c])], right = [H, Bv, add(Bv, [0, c]), add(H, [0, c])];
                s += poly(sqA, fill(LAM, 0.16)) + poly(sqB, hexFill(CY, 0.16)) + poly(left, hexFill(CY, 0.16)) + poly(right, fill(LAM, 0.16));
                s += line(C, add(H, [0, c]), 'stroke:' + TXT + ';stroke-width:1.2;stroke-dasharray:5 4');
                s += area(sqA, 'a²', a * a, LAM) + area(sqB, 'b²', b * b, CY);
                if (q * 36 > 30) s += txt(add(mid(A, H), [0, c / 2 + 6]), 'c·q', 'g-area').replace('class="g-area"', 'class="g-area" style="fill:' + CY + '"');
                if (p * 36 > 30) s += txt(add(mid(H, Bv), [0, c / 2 + 6]), 'c·p', 'g-area').replace('class="g-area"', 'class="g-area" style="fill:' + LAM + '"');
                if (q * 36 > 18) s += txt(add(mid(A, H), [0, 18]), 'q', 'g-side');
                if (p * 36 > 18) s += txt(add(mid(H, Bv), [0, 18]), 'p', 'g-side');
            } else {
                // both below the hypotenuse, side by side at the foot H: the square over h to the left, the rectangle p · q to the right
                const hs = h / k, sqH = [H, add(H, [-hs, 0]), add(H, [-hs, hs]), add(H, [0, hs])], rect = [H, Bv, add(Bv, [0, q / k]), add(H, [0, q / k])];
                s += poly(sqH, fill(PHI, 0.18)) + poly(rect, fill(PHI, 0.18));
                s += line(H, add(H, [0, Math.max(hs, q / k)]), 'stroke:' + DIM + ';stroke-width:1;stroke-dasharray:4 4');
                s += line(C, H, 'stroke:' + TXT + ';stroke-width:1.6;stroke-dasharray:5 4');
                s += area(sqH, 'h²', h * h, PHI);
                if (p / k > 40 && q / k > 30) s += txt(mul(add(add(rect[0], rect[1]), add(rect[2], rect[3])), 0.25), 'p·q', 'g-area').replace('class="g-area"', 'class="g-area" style="fill:' + PHI + '"');
                if (q * 36 > 18) s += txt(add(mid(A, H), [0, -8]), 'q', 'g-side');
                if (p * 36 > 18) s += txt(add(mid(H, Bv), [0, -8]), 'p', 'g-side');
                s += txt(add(mid(C, H), [7, 4]), 'h', 'g-side', 'start');
            }
            s += poly([A, Bv, C], 'fill:rgba(232,237,245,0.08);stroke:' + TXT + ';stroke-width:2.4;stroke-linejoin:round');
            s += rightMark(C, A, Bv, 13);
            if (S.mode !== 'pyth') s += rightMark(H, A, C, 9);
            s += txt(add(A, [-12, 18]), 'A', 'g-pt') + txt(add(Bv, [12, 18]), 'B', 'g-pt');
            const nC = mul(sub(C, M), 1 / len(sub(C, M)));
            s += txt(add(C, mul(nC, 24)), 'C', 'g-pt');
            s += handle(C, 0, LAM);
            pic.innerHTML = '<svg viewBox="0 0 440 450" role="img" aria-label="Rechtwinkliges Dreieck mit Quadraten über den Seiten">' + s + '</svg>';
            let t = '$c = 5\\,\\text{cm}$ · $a \\approx ' + texNum(a, 2) + '\\,\\text{cm}$ · $b \\approx ' + texNum(b, 2) + '\\,\\text{cm}$<br>';
            if (S.mode === 'pyth') t += '$a^2 + b^2 \\approx ' + texNum(a * a, 2) + ' + ' + texNum(b * b, 2) + ' = ' + texNum(a * a + b * b, 2) + '$<br>$c^2 = 25$<br>' +
                '<span class="g-ok">Die beiden Kathetenquadrate haben zusammen genau den Flächeninhalt des Hypotenusenquadrats.</span>';
            else if (S.mode === 'kath') t += '$p \\approx ' + texNum(p, 2) + '\\,\\text{cm}$ · $q \\approx ' + texNum(q, 2) + '\\,\\text{cm}$<br>' +
                '$a^2 \\approx ' + texNum(a * a, 2) + '$ und $c \\cdot p \\approx 5 \\cdot ' + texNum(p, 2) + ' = ' + texNum(CL * p, 2) + '$<br>' +
                '$b^2 \\approx ' + texNum(b * b, 2) + '$ und $c \\cdot q \\approx 5 \\cdot ' + texNum(q, 2) + ' = ' + texNum(CL * q, 2) + '$<br>' +
                '<span class="g-ok">Jedes Kathetenquadrat ist so groß wie das Rechteck darunter.</span>';
            else t += '$h \\approx ' + texNum(h, 2) + '\\,\\text{cm}$ · $p \\approx ' + texNum(p, 2) + '\\,\\text{cm}$ · $q \\approx ' + texNum(q, 2) + '\\,\\text{cm}$<br>' +
                '$h^2 \\approx ' + texNum(h * h, 2) + '$ und $p \\cdot q \\approx ' + texNum(p * q, 2) + '$<br>' +
                '<span class="g-ok">Das Höhenquadrat ist so groß wie das Rechteck aus den beiden Hypotenusenabschnitten.</span>';
            out.innerHTML = '<p style="margin:0">' + t + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- sine, cosine, tangent ---------- */
    W('trigo', function (box) {
        const S = { al: +(box.dataset.al || 35), c: 6, fn: 'sin' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['sin', 'Sinus'], ['cos', 'Kosinus'], ['tan', 'Tangens']], 'sin', v => { S.fn = v; render(); }, 'Verhältnis');
        const sl = div(box, '');
        range(sl, { label: 'Winkel $\\alpha$', min: 1, max: 89, step: 1, value: S.al, fmt: v => v + '°', onInput: v => { S.al = v; render(); } });
        range(sl, { label: 'Hypotenuse $c$', min: 2, max: 10, step: 0.5, value: S.c, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.c = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        // data-hero: only the triangle (opening of a chapter)
        if (box.dataset.hero != null) { ctr.style.display = 'none'; sl.style.display = 'none'; out.style.display = 'none'; two.style.display = 'block'; pic.style.maxWidth = '380px'; pic.style.margin = '0 auto'; }
        function render() {
            const al = S.al * DEG, c = S.c, a = c * Math.sin(al), b = c * Math.cos(al);
            const k = Math.min(34, 330 / b, 230 / a);
            const A = [50, 265], C = [50 + b * k, 265], Bv = [50 + b * k, 265 - a * k];
            const on = { sin: ['a', 'c'], cos: ['b', 'c'], tan: ['a', 'b'] }[S.fn];
            const st = (key, col) => 'stroke:' + col + ';stroke-width:' + (on.includes(key) ? 5 : 2) + ';stroke-linecap:round;opacity:' + (on.includes(key) ? 1 : 0.45);
            let s = poly([A, C, Bv], 'fill:rgba(232,237,245,0.06);stroke:none');
            s += arc(A, C, Bv, Math.min(46, b * k * 0.45), 'fill:rgba(245,194,66,0.18);stroke:' + LAM + ';stroke-width:1.2');
            s += line(Bv, C, st('a', LAM)) + line(A, C, st('b', CY)) + line(A, Bv, st('c', VIO));
            s += rightMark(C, A, Bv, 13);
            const nm = { a: 'Gegenkathete a', b: 'Ankathete b', c: 'Hypotenuse c' };
            s += txt(add(mid(Bv, C), [10, 4]), (a * k > 70 ? nm.a : 'a'), 'g-side' + (on.includes('a') ? ' g-on' : ''), 'start').replace('class="', 'style="fill:' + LAM + '" class="');
            s += txt(add(mid(A, C), [0, 24]), (b * k > 120 ? nm.b : 'b'), 'g-side' + (on.includes('b') ? ' g-on' : '')).replace('class="', 'style="fill:' + CY + '" class="');
            const nrm = [-(Bv[1] - A[1]), Bv[0] - A[0]], nl = len(nrm);
            const cp = add(mid(A, Bv), mul(nrm, -12 / nl));
            s += '<text class="g-side' + (on.includes('c') ? ' g-on' : '') + '" style="fill:' + VIO + '" x="' + f1(cp[0]) + '" y="' + f1(cp[1]) + '" text-anchor="middle" transform="rotate(' + f1(-S.al) + ' ' + f1(cp[0]) + ' ' + f1(cp[1]) + ')">' + (c * k > 130 ? nm.c : 'c') + '</text>';
            const ra = Math.min(46, b * k * 0.45) + 14;
            s += txt([A[0] + ra * Math.cos(al / 2), A[1] - ra * Math.sin(al / 2) + 6], 'α', 'g-ang');
            s += txt(add(A, [-12, 16]), 'A', 'g-pt') + txt(add(C, [12, 16]), 'C', 'g-pt') + txt(add(Bv, [12, -4]), 'B', 'g-pt');
            pic.innerHTML = '<svg viewBox="0 0 440 300" role="img" aria-label="Rechtwinkliges Dreieck mit Winkel alpha">' + s + '</svg>';
            const row = (key, name, num, den, nv, dv, v) => '<p class="g-trig' + (S.fn === key ? ' on' : '') + '">$\\' + name + ' ' + S.al + '^\\circ = \\dfrac{' + num + '}{' + den + '} \\approx \\dfrac{' +
                texNum(nv, 2) + '}{' + texNum(dv, 2) + '} \\approx ' + texNum(v, 4) + '$</p>';
            out.innerHTML = row('sin', 'sin', '\\text{Gegenkathete}', '\\text{Hypotenuse}', a, c, Math.sin(al)) +
                row('cos', 'cos', '\\text{Ankathete}', '\\text{Hypotenuse}', b, c, Math.cos(al)) +
                row('tan', 'tan', '\\text{Gegenkathete}', '\\text{Ankathete}', a, b, Math.tan(al)) +
                '<p class="b-help" style="margin:8px 0 0">Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.</p>';
            math(out);
        }
        render();
    });

    /* ---------- arc and sector ---------- */
    W('kreisteil', function (box) {
        const S = { r: 4, al: 120 };
        const sl = div(box, '');
        range(sl, { label: 'Radius $r$', min: 1, max: 10, step: 0.5, value: S.r, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.r = v; render(); } });
        const ra = range(sl, { label: 'Mittelpunktswinkel $\\alpha$', min: 0, max: 360, step: 5, value: S.al, fmt: v => v + '°', onInput: v => { S.al = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const M = [160, 160], R = 125;
        dragSVG(pic, (i, x, y) => {
            let a = Math.atan2(M[1] - y, x - M[0]) / DEG; if (a < 0) a += 360;
            S.al = Math.round(a); if (S.al === 0 && S.al !== 360 && x > M[0] && y > M[1] - 3) S.al = 360;
            ra.set(S.al); render();
        });
        function frac(al) {
            const g = (x, y) => y ? g(y, x % y) : x, d = g(al, 360);
            return al === 0 ? '0' : al === 360 ? '1' : '\\tfrac{' + al / d + '}{' + 360 / d + '}';
        }
        function render() {
            const al = S.al, r = S.r, E = [M[0] + R * Math.cos(-al * DEG), M[1] + R * Math.sin(-al * DEG)], P0 = [M[0] + R, M[1]];
            let s = '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="' + R + '" style="fill:rgba(127,216,238,0.04);stroke:' + DIM + ';stroke-width:1.4"/>';
            if (al >= 360) s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="' + R + '" style="' + fill(LAM, 0.2) + ';stroke:none"/>' +
                '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="' + R + '" style="fill:none;stroke:' + CY + ';stroke-width:5"/>';
            else if (al > 0) {
                const big = al > 180 ? 1 : 0;
                s += '<path d="M' + M[0] + ' ' + M[1] + ' L' + P0[0] + ' ' + P0[1] + ' A' + R + ' ' + R + ' 0 ' + big + ' 0 ' + f1(E[0]) + ' ' + f1(E[1]) + ' Z" style="' + fill(LAM, 0.2) + ';stroke:none"/>';
                s += '<path d="M' + P0[0] + ' ' + P0[1] + ' A' + R + ' ' + R + ' 0 ' + big + ' 0 ' + f1(E[0]) + ' ' + f1(E[1]) + '" style="fill:none;stroke:' + CY + ';stroke-width:5;stroke-linecap:round"/>';
                s += arc(M, P0, E, 30, 'fill:none;stroke:' + LAM + ';stroke-width:1.4').replace(/ 0 0 [01] /, ' 0 ' + big + ' 0 ');
            }
            s += line(M, P0, 'stroke:' + TXT + ';stroke-width:2') + line(M, E, 'stroke:' + TXT + ';stroke-width:2');
            s += txt(add(M, [R / 2, 18]), 'r', 'g-side');
            const ma = -al / 2 * DEG;
            if (al > 20) s += txt([M[0] + 46 * Math.cos(ma), M[1] + 46 * Math.sin(ma) + 5], 'α', 'g-ang');
            s += dot(M, TXT, 4) + handle(E, 0, CY);
            pic.innerHTML = '<svg viewBox="0 0 320 320" role="img" aria-label="Kreis mit Kreisausschnitt und Kreisbogen">' + s + '</svg>';
            const b = al / 360 * 2 * Math.PI * r, A = al / 360 * Math.PI * r * r;
            out.innerHTML = '<p style="margin:0">Anteil am Vollkreis: $\\tfrac{\\alpha}{360^\\circ} = ' + frac(al) + '$</p>' +
                '<p style="margin:0"><span class="g-cy">Kreisbogen</span> $b = \\tfrac{\\alpha}{360^\\circ} \\cdot 2\\pi r \\approx ' + texNum(b, 2) + '\\,\\text{cm}$</p>' +
                '<p style="margin:0"><span class="g-lam">Kreisausschnitt</span> $A = \\tfrac{\\alpha}{360^\\circ} \\cdot \\pi r^2 \\approx ' + texNum(A, 2) + '\\,\\text{cm}^2$</p>' +
                '<p class="b-help" style="margin:8px 0 0">Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ' + texNum(2 * Math.PI * r, 2) + '\\,\\text{cm}$, $A \\approx ' + texNum(Math.PI * r * r, 2) + '\\,\\text{cm}^2$.</p>';
            math(out);
        }
        // data-hero: only the picture (opening of a chapter), the end of the arc stays draggable
        if (box.dataset.hero != null) { sl.style.display = 'none'; out.style.display = 'none'; two.style.display = 'block'; pic.style.maxWidth = '250px'; pic.style.margin = '0 auto'; }
        render();
    });

    /* ---------- π with polygons (Archimedes) ---------- */
    W('vieleck', function (box) {
        const S = { n: 6 };
        const ctr = div(box, 'b-ctrls');
        ctr.innerHTML = '<button type="button" class="b-btn b-hintbtn" data-a="dbl">Ecken verdoppeln</button><button type="button" class="b-btn" data-a="six">Zurück auf 6</button>';
        const sl = div(box, '');
        const rn = range(sl, { label: 'Anzahl der Ecken $n$', min: 3, max: 100, step: 1, value: 6, fmt: v => String(v), onInput: v => { S.n = v; render(); } });
        math(sl);
        ctr.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            S.n = b.dataset.a === 'six' ? 6 : Math.min(S.n * 2, 96 * (S.n < 96 ? 1 : 0) || 96);
            rn.set(S.n); render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const M = [160, 160], R = 118;
        function render() {
            const n = S.n, lo = n * Math.sin(Math.PI / n), hi = n * Math.tan(Math.PI / n);
            const inner = ngon(M, R, n, -Math.PI / 2), outer = ngon(M, R / Math.cos(Math.PI / n), n, -Math.PI / 2);
            let s = poly(outer, 'fill:rgba(127,216,238,0.06);stroke:' + CY + ';stroke-width:1.6;stroke-dasharray:6 4;stroke-linejoin:round');
            s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="' + R + '" style="fill:rgba(184,164,242,0.08);stroke:' + VIO + ';stroke-width:2.2"/>';
            s += poly(inner, fill(LAM, 0.12) + ';stroke-linejoin:round');
            if (n <= 24) s += line(M, inner[0], 'stroke:' + TXT + ';stroke-width:1.2;opacity:0.7') + line(M, inner[1], 'stroke:' + TXT + ';stroke-width:1.2;opacity:0.7');
            s += dot(M, TXT, 3.5);
            pic.innerHTML = '<svg viewBox="0 0 320 320" role="img" aria-label="Kreis mit einbeschriebenem und umbeschriebenem Vieleck">' + s + '</svg>';
            let tab = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th>$n$</th><th>innen</th><th>außen</th></tr>';
            [6, 12, 24, 48, 96].forEach(m => {
                tab += '<tr' + (m === n ? ' class="on"' : '') + '><td>' + m + '</td><td>' + fmt(m * Math.sin(Math.PI / m), 5) + '</td><td>' + fmt(m * Math.tan(Math.PI / m), 5) + '</td></tr>';
            });
            tab += '</table></div>';
            out.innerHTML = '<p style="margin:0">Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:</p>' +
                '<p style="margin:0"><span class="g-lam">innen</span> $n \\cdot \\sin\\tfrac{180^\\circ}{n} \\approx ' + texNum(lo, 5) + '$</p>' +
                '<p style="margin:0"><span class="g-cy">außen</span> $n \\cdot \\tan\\tfrac{180^\\circ}{n} \\approx ' + texNum(hi, 5) + '$</p>' +
                '<p style="margin:0">Also $' + texNum(lo, 5) + ' < \\pi < ' + texNum(hi, 5) + '$, Abstand $' + texNum(hi - lo, 5) + '$.</p>' + tab;
            math(out);
        }
        render();
    });

    /* ---------- golden section ---------- */
    const PHI_G = (1 + Math.sqrt(5)) / 2;
    W('goldenerschnitt', function (box) {
        const S = { mode: box.dataset.mode || 'strecke', t: 0.5, steps: 5 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['strecke', 'Strecke teilen'], ['rechteck', 'Goldenes Rechteck'], ['pentagramm', 'Pentagramm']], S.mode, v => { S.mode = v; render(); }, 'Ansicht');
        const act = div(ctr, 'b-ctrl');
        act.innerHTML = '<button type="button" class="b-btn b-hintbtn" data-a="gold">Golden teilen</button>';
        act.addEventListener('click', () => { S.t = 1 / PHI_G; render(); });
        const sl = div(box, '');
        const rs = range(sl, { label: 'Quadrate abschneiden', min: 1, max: 9, step: 1, value: S.steps, fmt: v => String(v), onInput: v => { S.steps = v; render(); } });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        // data-hero: only the picture (opening of a chapter)
        const hero = box.dataset.hero != null;
        if (hero) { S.steps = 7; ctr.style.display = 'none'; out.style.display = 'none'; two.style.display = 'block'; pic.style.maxWidth = '380px'; pic.style.margin = '0 auto'; }
        const X0 = 40, X1 = 400, Y = 110;
        dragSVG(pic, (i, x) => { S.t = Math.min(Math.max((x - X0) / (X1 - X0), 0.05), 0.95); render(); });
        function render() {
            act.style.display = S.mode === 'strecke' ? '' : 'none';
            sl.style.display = S.mode === 'rechteck' && !hero ? '' : 'none';
            let s = '', t = '';
            if (S.mode === 'strecke') {
                const T = [X0 + S.t * (X1 - X0), Y], AB = 10, x = S.t * AB, y = AB - x, g = Math.max(x, y), kk = Math.min(x, y);
                const r1 = AB / g, r2 = g / kk, gold = Math.abs(r1 - r2) < 0.02;
                s += line([X0, Y], T, 'stroke:' + LAM + ';stroke-width:6;stroke-linecap:round') + line(T, [X1, Y], 'stroke:' + CY + ';stroke-width:6;stroke-linecap:round');
                s += txt([X0, Y + 30], 'A', 'g-pt') + txt([X1, Y + 30], 'B', 'g-pt') + txt([T[0], Y + 30], 'T', 'g-pt');
                s += txt([(X0 + T[0]) / 2, Y - 18], fmt(x, 2), 'g-val').replace('class="g-val"', 'class="g-val" style="fill:' + LAM + '"');
                s += txt([(T[0] + X1) / 2, Y - 18], fmt(y, 2), 'g-val').replace('class="g-val"', 'class="g-val" style="fill:' + CY + '"');
                // two bars: whole : major and major : minor
                const bw = 300, mx = Math.max(r1, r2, 2);
                s += txt([X0, 190], 'Ganzes : größerer Teil', 'g-small', 'start') + '<rect x="' + X0 + '" y="198" width="' + f1(bw * r1 / mx) + '" height="14" rx="4" fill="' + VIO + '" opacity="0.8"/>';
                s += txt([X0, 238], 'größerer : kleinerer Teil', 'g-small', 'start') + '<rect x="' + X0 + '" y="246" width="' + f1(Math.min(bw * r2 / mx, bw * 1.25)) + '" height="14" rx="4" fill="' + PHI + '" opacity="0.8"/>';
                s += handle(T, 0, TXT);
                pic.innerHTML = '<svg viewBox="0 0 440 280" role="img" aria-label="Strecke AB mit Teilungspunkt T">' + s + '</svg>';
                t = '<p style="margin:0">$\\overline{AB} = 10$ · größerer Teil $' + texNum(g, 3) + '$ · kleinerer Teil $' + texNum(kk, 3) + '$</p>' +
                    '<p style="margin:0">$\\tfrac{\\text{Ganzes}}{\\text{größerer Teil}} \\approx ' + texNum(r1, 3) + '$ &nbsp; $\\tfrac{\\text{größerer Teil}}{\\text{kleinerer Teil}} \\approx ' + texNum(r2, 3) + '$</p>' +
                    (gold ? '<p class="g-ok" style="margin:6px 0 0">Beide Verhältnisse sind gleich: goldener Schnitt, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.</p>'
                        : '<p class="b-help" style="margin:6px 0 0">Zieh den Punkt $T$, bis beide Verhältnisse gleich sind.</p>');
            } else if (S.mode === 'rechteck') {
                const w = 360, h = w / PHI_G, x0 = 40, y0 = 30;
                const sq = goldSquares(x0, y0, w, h, S.steps);
                s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + f1(h) + '" style="' + fill(LAM, 0.06) + '"/>';
                const cols = [LAM, CY, PHI, VIO];
                sq.forEach((q, i) => { s += '<rect x="' + f1(q.x) + '" y="' + f1(q.y) + '" width="' + f1(q.s) + '" height="' + f1(q.s) + '" style="' + (cols[i % 4][0] === '#' ? hexFill(cols[i % 4], 0.1) : fill(cols[i % 4], 0.1)) + ';stroke-width:1.2"/>'; });
                s += '<path d="' + spiral(sq) + '" style="fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round"/>';
                pic.innerHTML = '<svg viewBox="0 0 440 290" role="img" aria-label="Goldenes Rechteck, in Quadrate zerlegt, mit Spirale">' + s + '</svg>';
                t = '<p style="margin:0">Seiten $' + texNum(PHI_G, 3) + ' : 1$. Schneidet man das Quadrat über der kurzen Seite ab, bleibt wieder ein goldenes Rechteck übrig, um den Faktor $\\Phi$ verkleinert.</p>' +
                    '<p style="margin:6px 0 0">Nach ' + S.steps + ' Schnitt' + (S.steps > 1 ? 'en' : '') + ' ist die lange Seite nur noch $\\tfrac{1}{\\Phi^{' + S.steps + '}} \\approx ' + texNum(Math.pow(PHI_G, -S.steps) * 100, 1) + '\\,\\%$ so lang. Die Viertelkreise bilden die <b>goldene Spirale</b>.</p>';
            } else {
                const M = [220, 150], R = 125, P = ngon(M, R, 5, -Math.PI / 2);
                s += poly(P, 'fill:rgba(127,216,238,0.05);stroke:' + CY + ';stroke-width:2.2;stroke-linejoin:round');
                s += '<polygon points="' + pts([P[0], P[2], P[4], P[1], P[3]]) + '" style="fill:rgba(245,194,66,0.07);stroke:' + DIM + ';stroke-width:1.4;stroke-linejoin:round"/>';
                // diagonal P1P4 (from the lower-right … ) highlighted, cut by the diagonals from P0 at two points
                const D0 = P[1], D1 = P[4];
                const inter = (p1, p2, p3, p4) => {
                    const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
                    const u = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d;
                    return [p1[0] + u * (p2[0] - p1[0]), p1[1] + u * (p2[1] - p1[1])];
                };
                const Q1 = inter(D0, D1, P[0], P[2]), Q2 = inter(D0, D1, P[0], P[3]);
                s += line(D0, Q2, 'stroke:' + LAM + ';stroke-width:5;stroke-linecap:round;opacity:0.9');
                s += line(Q2, D1, 'stroke:' + PHI + ';stroke-width:5;stroke-linecap:round;opacity:0.9');
                s += line(P[0], P[1], 'stroke:' + CY + ';stroke-width:5;stroke-linecap:round');
                [D0, D1, Q2, P[0]].forEach(p => { s += dot(p, TXT, 3.5); });
                pic.innerHTML = '<svg viewBox="0 0 440 290" role="img" aria-label="Regelmäßiges Fünfeck mit Pentagramm">' + s + '</svg>';
                t = '<p style="margin:0"><span class="g-cy">Seite</span> $s$ und Diagonale $d$ des regelmäßigen Fünfecks: $\\tfrac{d}{s} = \\Phi \\approx 1{,}618$.</p>' +
                    '<p style="margin:6px 0 0">Jede Diagonale wird von einer anderen im goldenen Schnitt geteilt: <span class="g-lam">größerer Teil</span> : <span class="g-phi">kleinerer Teil</span> $= \\Phi$, und der größere Teil ist genau so lang wie die Seite.</p>';
            }
            out.innerHTML = t;
            math(out);
        }
        render();
    });

    /* ---------- pyramid and cone ---------- */
    W('spitzkoerper', function (box) {
        const S = { k: box.dataset.k || 'pyr', a: 6, h: 8, show: 'hs' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['pyr', 'Quadratische Pyramide'], ['kegel', 'Kreiskegel']], S.k, v => { S.k = v; render(); }, 'Körper');
        const tri = seg(ctr, [['hs', 'Seitenhöhe'], ['s', 'Seitenkante']], 'hs', v => { S.show = v; render(); }, 'Hilfsdreieck');
        const sl = div(box, '');
        const ra = range(sl, { label: 'Grundkante $a$', min: 1, max: 10, step: 0.5, value: S.a, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Höhe $h$', min: 1, max: 15, step: 0.5, value: S.h, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.h = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        // data-hero: only the picture (opening of a chapter)
        if (box.dataset.hero != null) { ctr.style.display = 'none'; sl.style.display = 'none'; out.style.display = 'none'; two.style.display = 'block'; pic.style.maxWidth = '320px'; pic.style.margin = '0 auto'; }
        function render() {
            const pyr = S.k === 'pyr', a = S.a, h = S.h;
            tri.el.style.display = pyr ? '' : 'none';
            ra.input.closest('.b-range').querySelector('label').innerHTML = pyr ? 'Grundkante $a$' : 'Radius $r$';
            math(ra.input.closest('.b-range'));
            // oblique view: depth at 45°, shortened by 1/2
            const w = pyr ? a : 2 * a, k = Math.min(250 / (w + 0.36 * w), 230 / (h + 0.36 * w), 30);
            const ox = 60, oy = 268;
            const P = (x, y, z) => [ox + (x + 0.354 * y) * k, oy - (z + 0.354 * y) * k];   // x right, y back, z up
            let s = '';
            const hl = 'stroke:' + LAM + ';stroke-width:3.4;stroke-linecap:round';
            if (pyr) {
                const A = P(0, 0, 0), Bq = P(a, 0, 0), Cq = P(a, a, 0), Dq = P(0, a, 0), Mb = P(a / 2, a / 2, 0), Sp = P(a / 2, a / 2, h), F = P(a / 2, 0, 0);
                const back = 'stroke:' + DIM + ';stroke-width:1.4;stroke-dasharray:5 4';
                s += line(A, Dq, back) + line(Dq, Cq, back) + line(Dq, Sp, back);
                s += poly([A, Bq, Sp], 'fill:rgba(127,216,238,0.10);stroke:none') + poly([Bq, Cq, Sp], 'fill:rgba(127,216,238,0.06);stroke:none');
                const edge = 'stroke:' + CY + ';stroke-width:2.2;stroke-linejoin:round';
                s += line(A, Bq, edge) + line(Bq, Cq, edge) + line(A, Sp, edge) + line(Bq, Sp, edge) + line(Cq, Sp, edge);
                s += line(Mb, Sp, 'stroke:' + PHI + ';stroke-width:2.4;stroke-dasharray:6 4');
                if (S.show === 'hs') {
                    s += line(Mb, F, hl) + line(F, Sp, hl) + poly([Mb, F, Sp], 'fill:rgba(245,194,66,0.16);stroke:none') + rightMark(Mb, F, Sp, 9);
                    s += txt(add(mid(F, Sp), [-8, 4]), 'hₛ', 'g-side g-on', 'end').replace('class="', 'style="fill:' + LAM + '" class="');
                    s += txt(add(mid(Mb, F), [12, 14]), 'a/2', 'g-small', 'start');
                } else {
                    s += line(Mb, Bq, hl) + line(Bq, Sp, hl) + poly([Mb, Bq, Sp], 'fill:rgba(245,194,66,0.16);stroke:none') + rightMark(Mb, Bq, Sp, 9);
                    s += txt(add(mid(Bq, Sp), [8, 4]), 's', 'g-side g-on', 'start').replace('class="', 'style="fill:' + LAM + '" class="');
                    s += txt(add(mid(Mb, Bq), [6, 16]), 'd/2', 'g-small', 'middle');
                }
                s += txt(add(mid(Mb, Sp), S.show === 'hs' ? [8, 0] : [-8, 0]), 'h', 'g-side', S.show === 'hs' ? 'start' : 'end').replace('class="', 'style="fill:' + PHI + '" class="');
                s += txt(add(add(A, mul(sub(Bq, A), 0.25)), [0, 22]), 'a', 'g-side').replace('class="', 'style="fill:' + CY + '" class="');
                s += dot(Sp, TXT, 3.5) + dot(Mb, TXT, 3);
            } else {
                const Mb = P(a, a, 0), rx = a * k, ry = a * k * 0.354, Sp = P(a, a, h), R = [Mb[0] + rx, Mb[1]], L = [Mb[0] - rx, Mb[1]];
                s += '<path d="M' + f1(L[0]) + ' ' + f1(Mb[1]) + ' A' + f1(rx) + ' ' + f1(ry) + ' 0 0 1 ' + f1(R[0]) + ' ' + f1(Mb[1]) + '" style="fill:none;stroke:' + DIM + ';stroke-width:1.4;stroke-dasharray:5 4"/>';
                s += '<path d="M' + f1(L[0]) + ' ' + f1(Mb[1]) + ' L' + f1(Sp[0]) + ' ' + f1(Sp[1]) + ' L' + f1(R[0]) + ' ' + f1(Mb[1]) + ' A' + f1(rx) + ' ' + f1(ry) + ' 0 0 1 ' + f1(L[0]) + ' ' + f1(Mb[1]) + ' Z" style="fill:rgba(127,216,238,0.10);stroke:' + CY + ';stroke-width:2.2;stroke-linejoin:round"/>';
                s += line(Mb, Sp, 'stroke:' + PHI + ';stroke-width:2.4;stroke-dasharray:6 4');
                s += line(Mb, R, hl) + line(R, Sp, hl) + poly([Mb, R, Sp], 'fill:rgba(245,194,66,0.16);stroke:none') + rightMark(Mb, R, Sp, 9);
                s += txt(add(mid(R, Sp), [8, 4]), 's', 'g-side g-on', 'start').replace('class="', 'style="fill:' + LAM + '" class="');
                s += txt(add(mid(Mb, R), [0, 18]), 'r', 'g-side');
                s += txt(add(mid(Mb, Sp), [-8, 0]), 'h', 'g-side', 'end').replace('class="', 'style="fill:' + PHI + '" class="');
                s += dot(Sp, TXT, 3.5) + dot(Mb, TXT, 3);
            }
            pic.innerHTML = '<svg viewBox="0 0 360 290" role="img" aria-label="' + (pyr ? 'Quadratische Pyramide' : 'Kreiskegel') + ' im Schrägbild mit Hilfsdreieck">' + s + '</svg>';
            let t;
            if (pyr) {
                const hs = Math.hypot(h, a / 2), se = Math.hypot(h, a / Math.SQRT2), G = a * a, Mf = 2 * a * hs;
                t = '$h_s = \\sqrt{h^2 + \\left(\\tfrac{a}{2}\\right)^2} \\approx ' + texNum(hs, 2) + '\\,\\text{cm}$<br>' +
                    '$s = \\sqrt{h^2 + \\left(\\tfrac{d}{2}\\right)^2} = \\sqrt{h^2 + \\tfrac{a^2}{2}} \\approx ' + texNum(se, 2) + '\\,\\text{cm}$<br>' +
                    '$G = a^2 = ' + texNum(G, 2) + '\\,\\text{cm}^2$ · $M = 4 \\cdot \\tfrac12 a\\,h_s \\approx ' + texNum(Mf, 2) + '\\,\\text{cm}^2$<br>' +
                    '$O = G + M \\approx ' + texNum(G + Mf, 2) + '\\,\\text{cm}^2$<br>$V = \\tfrac13\\,G\\,h \\approx ' + texNum(G * h / 3, 2) + '\\,\\text{cm}^3$';
            } else {
                const se = Math.hypot(h, a), G = Math.PI * a * a, Mf = Math.PI * a * se;   // here a is the radius
                t = '$s = \\sqrt{r^2 + h^2} \\approx ' + texNum(se, 2) + '\\,\\text{cm}$<br>' +
                    '$G = \\pi r^2 \\approx ' + texNum(G, 2) + '\\,\\text{cm}^2$ · $M = \\pi r s \\approx ' + texNum(Mf, 2) + '\\,\\text{cm}^2$<br>' +
                    '$O = \\pi r^2 + \\pi r s \\approx ' + texNum(G + Mf, 2) + '\\,\\text{cm}^2$<br>$V = \\tfrac13 \\pi r^2 h \\approx ' + texNum(G * h / 3, 2) + '\\,\\text{cm}^3$';
            }
            out.innerHTML = '<p style="margin:0;line-height:2">' + t + '</p>';
            math(out);
        }
        render();
    });

    B.geo = { f1, pts, poly, line, txt, dot, handle, fill, hexFill, add, sub, mul, mid, len, squareOut, rightMark, arc, svgXY, dragSVG, ngon };
})();
