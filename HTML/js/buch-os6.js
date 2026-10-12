/* buch-os6.js — widgets of the book Mathematik · Oberschule 6 (js/buch.js; SVG helpers Buch.geo from js/buch-geometrie.js,
 * which must be loaded first). Every name ends in os6. The book also uses widgets of the Gymnasium books
 * (js/buch-gy5.js, js/buch-gy6.js, js/buch-gy8.js) and the dice sums of js/buch-spiele.js instead of copying them.
 *   titelbildos6   the cover: a tangram square, the Tower of Hanoi, a building of unit cubes, a fraction circle, a number line
 *   wuerfelbauos6  a building of unit cubes from its plan (heights in a 3 × 3 grid, tap a cell to change it): oblique view,
 *                  front view, side view from the right, number of cubes, volume and surface (data-start, data-hero)
 *   hanoios6       the Tower of Hanoi (Édouard Lucas, 1883): tap two pegs to move a disc, the least number 2^n − 1,
 *                  the solution move by move (data-n, data-hero)
 *   nimos6         a Nim game against the computer: take 1, 2 or 3 sticks, whoever takes the last one wins; the groups of four (data-n)
 *   tangramos6     the seven tans in the square: tap a piece for its name and its share of the whole, pieces of equal area lit (data-hero)
 *   schiebeos6     the sliding puzzle with 8 or 15 tiles: tap a tile next to the gap, shuffled by legal moves only (data-n 3|4)
 *   augensummeos6  two dice: the 36 outcomes with their sum, roll 1, 10 or 100 times, bars of the relative frequencies
 *                  against the share of the 36 fields
 * Colours of drawn parts go into style="" (never fill=""), so js/farbschema.js can translate them.
 * Looks: the general classes of js/buch.css (b-ctrls, b-two, b-svgbox, g-svg, b-out) and the section "Oberschule 6".
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, math, seg, div, gcd, texNum } = B;
    const { f1, poly, line, txt, hexFill } = B.geo;
    const W = B.widget;
    const LAM = '#F5C242', CY = '#7fd8ee', PHI = '#A0C85A', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    let uid = 0;
    const fill = (c, a) => hexFill(c, a) + ';stroke-linejoin:round';
    const svg = (w, h, label, body) => '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' + body + '</svg>';
    const fr = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : '\\tfrac{' + n + '}{' + d + '}'; };

    // a row of buttons; onClick(key, button)
    function buttons(parent, list, onClick) {
        const box = div(parent, 'b-ctrls');
        box.innerHTML = list.map(([k, l, cls]) => '<button type="button" class="b-btn' + (cls ? ' ' + cls : '') + '" data-a="' + k + '">' + l + '</button>').join('');
        box.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && !b.disabled) onClick(b.dataset.a, b); });
        return box;
    }
    // hero mode (chapter opener): only the picture, centred
    function heroOnly(box, pic, hide, maxW) {
        if (box.dataset.hero == null) return false;
        hide.forEach(e => { if (e) e.style.display = 'none'; });
        if (pic.parentNode && pic.parentNode.classList.contains('b-two')) pic.parentNode.style.display = 'block';
        pic.style.maxWidth = (maxW || 280) + 'px'; pic.style.margin = '0 auto';
        return true;
    }

    /* ---------- the tangram: the seven tans of a 4 × 4 square (counter-clockwise, y up) ---------- */
    const TANS = [
        { n: 'großes Dreieck', p: [[0, 4], [2, 2], [4, 4]], c: LAM },
        { n: 'großes Dreieck', p: [[0, 0], [2, 2], [0, 4]], c: '#e9b949' },
        { n: 'mittleres Dreieck', p: [[2, 0], [4, 0], [4, 2]], c: PHI },
        { n: 'kleines Dreieck', p: [[4, 2], [4, 4], [3, 3]], c: RED },
        { n: 'Quadrat', p: [[2, 2], [3, 1], [4, 2], [3, 3]], c: CY },
        { n: 'kleines Dreieck', p: [[1, 1], [3, 1], [2, 2]], c: '#e59a4f' },
        { n: 'Parallelogramm', p: [[0, 0], [2, 0], [3, 1], [1, 1]], c: VIO }
    ];
    const area2 = p => Math.abs(p.reduce((s, q, i) => { const r = p[(i + 1) % p.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0));  // twice the area

    /* ---------- the cover ---------- */
    W('titelbildos6', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        // presentation attributes, not style="": js/farbschema.js leaves them alone, the cover stays dark in every scheme
        const A = css => css.split(';').filter(Boolean).map(kv => { const k = kv.indexOf(':'); return ' ' + kv.slice(0, k).trim() + '="' + kv.slice(k + 1).trim() + '"'; }).join('');
        const pth = (d, css) => '<path d="' + d + '"' + A(css) + '/>';
        const ln = (p, q, css) => '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"' + A(css) + '/>';
        const pg = (pts, css) => '<polygon points="' + pts.map(q => f1(q[0]) + ',' + f1(q[1])).join(' ') + '"' + A(css) + '/>';
        const closed = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
        const glow = (d, c, w, dash) => pth(d, 'stroke:' + c + ';stroke-width:12;stroke-opacity:0.12;fill:none;stroke-linejoin:round;stroke-linecap:round') +
            pth(d, 'stroke:' + c + ';stroke-width:' + (w || 3) + ';fill:none;stroke-linejoin:round;stroke-linecap:round' + (dash ? ';stroke-dasharray:' + dash : ''));
        let art = '';
        // the tangram square, tilted a little
        const T0 = [372, 352], s = 44, rot = -12 * Math.PI / 180;
        const T = p => { const x = p[0] * s, y = -p[1] * s; return [T0[0] + x * Math.cos(rot) - y * Math.sin(rot), T0[1] + 4 * s + x * Math.sin(rot) + y * Math.cos(rot)]; };
        TANS.forEach(t => { const P = t.p.map(T); art += pth(closed(P), 'fill:' + t.c + ';fill-opacity:0.16;stroke:none') + glow(closed(P), t.c, 2.4); });
        // a fraction circle: three quarters
        const M = [146, 470], r = 84;
        for (let k = 0; k < 4; k++) {
            const a0 = -Math.PI / 2 + k * Math.PI / 2, a1 = a0 + Math.PI / 2;
            const p0 = [M[0] + r * Math.cos(a0), M[1] + r * Math.sin(a0)], p1 = [M[0] + r * Math.cos(a1), M[1] + r * Math.sin(a1)];
            if (k < 3) art += pth('M' + f1(M[0]) + ' ' + f1(M[1]) + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + r + ' ' + r + ' 0 0 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z', 'fill:' + CY + ';fill-opacity:' + (0.2 + 0.07 * k) + ';stroke:none');
            art += ln(M, p0, 'stroke:' + CY + ';stroke-opacity:0.5;stroke-width:1.4');
        }
        art += glow('M' + (M[0] - r) + ' ' + M[1] + ' a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0 Z', CY, 3);
        // the three quarters outlined: from the top clockwise to the left
        art += glow('M' + M[0] + ' ' + M[1] + ' L' + M[0] + ' ' + (M[1] - r) + ' A' + r + ' ' + r + ' 0 1 1 ' + (M[0] - r) + ' ' + M[1] + ' Z', CY, 2.4);
        // a number line with 0, 1/2 and 1
        art += glow('M40 628 L340 628', '#ffffff', 2);
        [0, 1, 2, 3, 4].forEach(k => { const x = 60 + 65 * k; art += ln([x, 620], [x, 636], 'stroke:#ffffff;stroke-opacity:' + (k % 2 ? 0.45 : 0.9) + ';stroke-width:2'); });
        art += '<circle cx="190" cy="628" r="7" fill="' + LAM + '"/><circle cx="190" cy="628" r="15" fill="' + LAM + '" fill-opacity="0.18"/>';
        // the Tower of Hanoi
        const base = 762, pegs = [372, 452, 532];
        art += glow('M330 ' + base + ' L574 ' + base, '#ffffff', 2.4);
        pegs.forEach(x => { art += ln([x, base], [x, base - 120], 'stroke:#ffffff;stroke-opacity:0.6;stroke-width:3;stroke-linecap:round'); });
        [70, 56, 42, 28].forEach((w, i) => {
            const y = base - 18 - 20 * i;
            art += '<rect x="' + (pegs[0] - w / 2) + '" y="' + (y - 7) + '" width="' + w + '" height="16" rx="7"' + A('fill:' + [LAM, PHI, RED, VIO][i] + ';fill-opacity:0.35;stroke:' + [LAM, PHI, RED, VIO][i] + ';stroke-width:2') + '/>';
        });
        // a building of unit cubes in the oblique view
        const c0 = [70, 766], e = 34, k = 0.5 * e * Math.SQRT1_2;
        const P = (x, y, z) => [c0[0] + x * e + y * k, c0[1] - z * e - y * k];
        const cubes = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [0, 0, 2]];
        cubes.sort((a, b) => b[1] - a[1] || a[0] - b[0] || a[2] - b[2]).forEach(([x, y, z]) => {
            const f = [P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)];
            const t = [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)];
            const rr = [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)];
            art += pg(f, 'fill:#13284a;stroke:' + PHI + ';stroke-width:2') + pg(t, 'fill:#1a3560;stroke:' + PHI + ';stroke-width:2') + pg(rr, 'fill:#0f2240;stroke:' + PHI + ';stroke-width:2');
        });
        const id = 'to6' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Tangram-Quadrat aus sieben Teilen, ein Kreis mit drei farbigen Vierteln, ein Zahlenstrahl, der Turm von Hanoi und ein Körper aus Würfeln">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.96" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- a building of unit cubes from its plan ---------- */
    const BAU = {
        treppe: { l: 'Treppe', h: [[0, 0, 0], [3, 2, 1], [3, 2, 1]] },
        turm: { l: 'Turm', h: [[0, 0, 0], [0, 3, 0], [1, 1, 1]] },
        mauer: { l: 'Mauer', h: [[2, 2, 2], [0, 0, 0], [1, 0, 1]] },
        frei: { l: 'Selbst bauen', h: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] }
    };
    W('wuerfelbauos6', function (box) {
        const S = { k: box.dataset.start || 'treppe' };
        S.h = BAU[S.k].h.map(r => r.slice());
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(BAU).map(k => [k, BAU[k].l]), S.k, v => { S.k = v; S.h = BAU[v].h.map(r => r.slice()); render(); }, 'Körper');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 300);
        out.addEventListener('click', e => {
            const c = e.target.closest('[data-cell]'); if (!c) return;
            const [r, k] = c.dataset.cell.split(',').map(Number);
            S.h[r][k] = (S.h[r][k] + 1) % 4; render();
        });
        // rows r = 0 back … 2 front, columns k = 0 left … 2 right; depth d = 2 − r grows to the back (upper right)
        function render() {
            const e = 40, kk = 0.5 * e * Math.SQRT1_2, o = [40, 230];
            const P = (x, d, z) => [o[0] + x * e + d * kk, o[1] - z * e - d * kk];
            const cubes = [];
            for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) for (let z = 0; z < S.h[r][k]; z++) cubes.push([k, 2 - r, z]);
            cubes.sort((a, b) => b[1] - a[1] || a[0] - b[0] || a[2] - b[2]);
            let s = '';
            for (let x = 0; x <= 3; x++) s += line(P(x, 0, 0), P(x, 3, 0), 'stroke:' + DIM + ';stroke-opacity:0.35');
            for (let d = 0; d <= 3; d++) s += line(P(0, d, 0), P(3, d, 0), 'stroke:' + DIM + ';stroke-opacity:0.35');
            // each face first opaque in the colour of the box, then tinted: cubes behind must not shine through
            const face = (q, a) => poly(q, 'fill:#0d1a30;stroke:none') + poly(q, fill(LAM, a));
            cubes.forEach(([x, d, z]) => {
                s += face([P(x, d, z), P(x + 1, d, z), P(x + 1, d, z + 1), P(x, d, z + 1)], 0.42);
                s += face([P(x, d, z + 1), P(x + 1, d, z + 1), P(x + 1, d + 1, z + 1), P(x, d + 1, z + 1)], 0.22);
                s += face([P(x + 1, d, z), P(x + 1, d + 1, z), P(x + 1, d + 1, z + 1), P(x + 1, d, z + 1)], 0.6);
            });
            s += txt([o[0] + 1.5 * e, o[1] + 26], 'vorne', 'd-unit');
            pic.innerHTML = svg(250, 260, 'Körper aus Würfeln im Schrägbild', s);
            if (hero) return;
            const n = cubes.length;
            // surface: every face of a cube that touches no other cube (the ground counts as outside)
            const has = (k, r, z) => k >= 0 && k < 3 && r >= 0 && r < 3 && z >= 0 && z < S.h[r][k];
            let faces = 0;
            for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) for (let z = 0; z < S.h[r][k]; z++)
                [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach(([a, b, c]) => { if (!has(k + a, r + b, z + c)) faces++; });
            const cell = 26;
            let plan = '';
            for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) {
                const v = S.h[r][k];
                plan += '<g data-cell="' + r + ',' + k + '" style="cursor:pointer"><rect x="' + (k * cell + 2) + '" y="' + (r * cell + 2) + '" width="' + (cell - 2) + '" height="' + (cell - 2) + '" rx="3" style="' +
                    (v ? fill(LAM, 0.12 + 0.12 * v) : 'fill:rgba(127,216,238,0.05);stroke:' + DIM + ';stroke-width:1') + '"/>' +
                    (v ? txt([k * cell + 14, r * cell + 20], String(v), 'd-num') : '') + '</g>';
            }
            const view = (cols, label) => {
                let g = '';
                cols.forEach((hgt, i) => { for (let z = 0; z < hgt; z++) g += '<rect x="' + (i * 18 + 2) + '" y="' + (56 - 18 * (z + 1) + 2) + '" width="16" height="16" style="' + fill(CY, 0.25) + '"/>'; });
                return '<figure class="os6-view"><svg viewBox="0 0 58 58" role="img" aria-label="' + label + '">' + g + '<line x1="0" y1="57" x2="58" y2="57" style="stroke:' + DIM + '"/></svg><figcaption>' + label + '</figcaption></figure>';
            };
            const front = [0, 1, 2].map(k => Math.max(S.h[0][k], S.h[1][k], S.h[2][k]));
            const side = [2, 1, 0].map(r => Math.max(...S.h[r]));
            out.innerHTML = '<div class="os6-views"><figure class="os6-view"><svg viewBox="0 0 80 80" role="img" aria-label="Bauplan: Draufsicht mit den Höhen">' + plan + '</svg><figcaption>Bauplan</figcaption></figure>' +
                view(front, 'von vorn') + view(side, 'von rechts') + '</div>' +
                '<p style="margin:10px 0 0"><b>' + n + '</b> Würfel · Volumen $' + n + '\\text{ cm}^3$ · Oberfläche $' + faces + '\\text{ cm}^2$</p>' +
                '<p class="b-help" style="margin:6px 0 0">Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.</p>';
            math(out);
        }
        render();
    });

    /* ---------- the Tower of Hanoi ---------- */
    W('hanoios6', function (box) {
        const S = { n: +(box.dataset.n || 4), pegs: null, sel: -1, moves: 0, msg: '', timer: null };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [3, 4, 5, 6].map(v => [String(v), v + ' Scheiben']), String(S.n), v => { S.n = +v; reset(); }, 'Anzahl der Scheiben');
        buttons(box, [['neu', 'Neu'], ['loesung', 'Lösung zeigen', 'b-go']], a => { if (a === 'neu') reset(); else solve(); });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, ctr.nextElementSibling, out], 340);
        const X = [70, 180, 290], base = 170;
        pic.addEventListener('click', e => {
            if (S.timer) return;
            const g = e.target.closest('[data-peg]'); if (!g) return;
            const p = +g.dataset.peg;
            if (S.sel < 0) { if (S.pegs[p].length) S.sel = p; S.msg = ''; }
            else if (S.sel === p) S.sel = -1;
            else {
                const from = S.pegs[S.sel], to = S.pegs[p], d = from[from.length - 1];
                if (to.length && to[to.length - 1] < d) S.msg = 'Nicht erlaubt: Eine größere Scheibe darf nie auf einer kleineren liegen.';
                else { to.push(from.pop()); S.moves++; S.msg = ''; }
                S.sel = -1;
            }
            render();
        });
        function reset() { if (S.timer) { clearInterval(S.timer); S.timer = null; } S.pegs = [[], [], []]; for (let d = S.n; d >= 1; d--) S.pegs[0].push(d); S.sel = -1; S.moves = 0; S.msg = ''; render(); }
        function solve() {
            reset();
            const list = [];
            (function mv(k, a, b, c) { if (!k) return; mv(k - 1, a, c, b); list.push([a, c]); mv(k - 1, b, a, c); })(S.n, 0, 1, 2);
            let i = 0;
            S.timer = setInterval(() => {
                if (i >= list.length) { clearInterval(S.timer); S.timer = null; render(); return; }
                const [a, c] = list[i++]; S.pegs[c].push(S.pegs[a].pop()); S.moves++; render();
            }, S.n > 5 ? 260 : 480);
        }
        function render() {
            let s = line([10, base], [350, base], 'stroke:' + TXT + ';stroke-width:2.5');
            X.forEach((x, p) => {
                s += '<g data-peg="' + p + '" style="cursor:pointer"><rect x="' + (x - 54) + '" y="20" width="108" height="' + (base - 10) + '" style="fill:transparent;stroke:none"/>' +
                    line([x, base], [x, 44], 'stroke:' + (S.sel === p ? LAM : DIM) + ';stroke-width:4;stroke-linecap:round');
                S.pegs[p].forEach((d, i) => {
                    const w = 22 + 76 * d / S.n, lift = S.sel === p && i === S.pegs[p].length - 1 ? 14 : 0, y = base - 16 * (i + 1) - lift;
                    const col = [LAM, PHI, CY, RED, VIO, '#e59a4f'][(d - 1) % 6];
                    s += '<rect x="' + f1(x - w / 2) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="14" rx="6" style="' + fill(col, 0.45) + '"/>';
                });
                s += '</g>' + txt([x, base + 20], ['A', 'B', 'C'][p], 'g-pt');
            });
            pic.innerHTML = svg(360, 200, 'Turm von Hanoi mit ' + S.n + ' Scheiben', s);
            if (hero) return;
            const min = Math.pow(2, S.n) - 1, done = S.pegs[2].length === S.n;
            out.innerHTML = '<p style="margin:0">Züge: <b>' + S.moves + '</b></p><p style="margin:6px 0 0">Mindestens nötig: $2^{' + S.n + '} - 1 = ' + min + '$</p>' +
                (done ? '<p style="margin:8px 0 0"><b>Geschafft!</b> ' + (S.moves === min ? 'Mit der kleinstmöglichen Zahl von Zügen.' : 'Es geht auch mit ' + min + ' Zügen.') + '</p>' : '') +
                (S.msg ? '<p class="b-help" style="margin:8px 0 0;color:' + RED + '">' + S.msg + '</p>' : '') +
                '<p class="b-help" style="margin:8px 0 0">Bringe alle Scheiben von A nach C. Tippe erst auf den Stab, von dem du nimmst, dann auf den Ziel-Stab. Immer nur eine Scheibe, nie eine größere auf eine kleinere.</p>';
            math(out);
        }
        reset();
    });

    /* ---------- Nim: 1, 2 or 3 sticks, the last one wins ---------- */
    W('nimos6', function (box) {
        const S = { n0: +(box.dataset.n || 21), n: 0, turn: 'du', log: [], help: false, timer: null };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['15', '15 Hölzer'], ['21', '21 Hölzer'], ['30', '30 Hölzer']], String(S.n0), v => { S.n0 = +v; reset(); }, 'Anzahl der Hölzer');
        seg(ctr, [['aus', 'ohne Hilfe'], ['an', 'Vierer zeigen']], 'aus', v => { S.help = v === 'an'; render(); }, 'Hilfe');
        const acts = buttons(box, [['1', 'Nimm 1'], ['2', 'Nimm 2'], ['3', 'Nimm 3'], ['neu', 'Neu']], a => {
            if (a === 'neu') { reset(); return; }
            if (S.turn !== 'du' || S.n === 0) return;
            take('du', Math.min(+a, S.n));
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function reset() { if (S.timer) { clearTimeout(S.timer); S.timer = null; } S.n = S.n0; S.turn = 'du'; S.log = []; render(); }
        function take(who, k) {
            S.n -= k; S.log.push((who === 'du' ? 'Du: ' : 'Computer: ') + k);
            if (S.n === 0) { S.turn = 'ende-' + who; render(); return; }
            S.turn = who === 'du' ? 'pc' : 'du';
            render();
            if (S.turn === 'pc') S.timer = setTimeout(() => { S.timer = null; take('pc', S.n % 4 || 1); }, 700);
        }
        function render() {
            let s = '';
            const per = 15, gap = 22;
            for (let i = 0; i < S.n0; i++) {
                const row = Math.floor(i / per), col = i % per, x = 18 + col * gap, y = 20 + row * 70;
                const alive = i < S.n;
                // groups of four, counted from the end: those are the safe positions
                const grp = S.help && alive && Math.floor((S.n - 1 - i) / 4) % 2 === 0;
                s += line([x, y], [x, y + 52], 'stroke:' + (alive ? (grp ? LAM : '#e2b07a') : DIM) + ';stroke-width:' + (alive ? 5 : 2) + ';stroke-linecap:round;stroke-opacity:' + (alive ? 1 : 0.25));
                if (alive) s += '<circle cx="' + x + '" cy="' + (y + 2) + '" r="4.5" style="fill:' + RED + '"/>';
            }
            const rows = Math.ceil(S.n0 / per);
            pic.innerHTML = svg(340, 20 + rows * 70, S.n + ' Hölzer liegen noch', s);
            [...acts.querySelectorAll('[data-a]')].forEach(b => { if (b.dataset.a !== 'neu') b.disabled = S.turn !== 'du' || +b.dataset.a > S.n || S.n === 0; });
            let msg;
            if (S.turn === 'ende-du') msg = '<b>Du hast das letzte Holz genommen und gewonnen!</b>';
            else if (S.turn === 'ende-pc') msg = '<b>Der Computer hat das letzte Holz genommen.</b> Probier es noch einmal.';
            else if (S.turn === 'pc') msg = 'Der Computer überlegt …';
            else msg = 'Du bist dran: Nimm 1, 2 oder 3 Hölzer.';
            out.innerHTML = '<p style="margin:0">Noch <b>' + S.n + '</b> Hölzer.</p><p style="margin:6px 0 0">' + msg + '</p>' +
                (S.log.length ? '<p class="b-help" style="margin:8px 0 0">' + S.log.join(' · ') + '</p>' : '') +
                '<p class="b-help" style="margin:8px 0 0">Wer das letzte Holz nimmt, gewinnt.' + (S.help ? ' Die Farben zeigen Vierergruppen vom Ende her: Lass dem Computer immer ein Vielfaches von 4 übrig.' : '') + '</p>';
        }
        reset();
    });

    /* ---------- the tangram: shares of the pieces ---------- */
    W('tangramos6', function (box) {
        const S = { sel: 0 };
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [out], 280);
        pic.addEventListener('click', e => { const g = e.target.closest('[data-tan]'); if (!g) return; S.sel = +g.dataset.tan; render(); });
        function render() {
            const s0 = 58, X = p => 14 + p[0] * s0, Y = p => 14 + (4 - p[1]) * s0;
            const a = TANS[S.sel] && area2(TANS[S.sel].p);
            let s = '';
            TANS.forEach((t, i) => {
                const on = i === S.sel, same = !hero && a && area2(t.p) === a;
                s += '<g data-tan="' + i + '" style="cursor:pointer">' + poly(t.p.map(p => [X(p), Y(p)]), 'fill:' + t.c + ';fill-opacity:' + (on ? 0.75 : same ? 0.45 : 0.22) + ';stroke:' + (on ? '#ffffff' : t.c) + ';stroke-width:' + (on ? 3 : 1.8) + ';stroke-linejoin:round') + '</g>';
            });
            pic.innerHTML = svg(260, 260, 'Tangram: sieben Teile in einem Quadrat', s);
            if (hero) return;
            const t = TANS[S.sel], A2 = area2(t.p);
            const twins = TANS.map((u, i) => i).filter(i => i !== S.sel && area2(TANS[i].p) === A2).map(i => TANS[i].n);
            out.innerHTML = '<p style="margin:0"><b>' + t.n + '</b></p>' +
                '<p style="margin:6px 0 0">Anteil am Quadrat: $' + fr(A2, 32) + '$</p>' +
                '<p style="margin:6px 0 0">Ist das Quadrat 4 cm × 4 cm groß, hat das Teil $' + fmt(A2 / 2) + '\\text{ cm}^2$.</p>' +
                (twins.length ? '<p class="b-help" style="margin:8px 0 0">Genauso groß: ' + twins.join(', ') + ' (hell markiert).</p>' : '') +
                '<p class="b-help" style="margin:8px 0 0">Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: $\\tfrac14 + \\tfrac14 + \\tfrac18 + \\tfrac1{16} + \\tfrac18 + \\tfrac1{16} + \\tfrac18 = 1$.</p>';
            math(out);
        }
        render();
    });

    /* ---------- the sliding puzzle: 8 or 15 tiles, shuffled by legal moves only ---------- */
    W('schiebeos6', function (box) {
        const S = { n: +(box.dataset.n || 3), t: [], moves: 0, seed: 7 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['3', '3 × 3 · 8 Steine'], ['4', '4 × 4 · 15 Steine']], String(S.n), v => { S.n = +v; reset(); }, 'Größe');
        buttons(box, [['mix', 'Mischen', 'b-go'], ['ord', 'Ordnen']], a => { if (a === 'mix') shuffle(Math.random); else solved(); render(); });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const rnd = () => { S.seed = (S.seed * 16807) % 2147483647; return S.seed / 2147483647; };  // fixed first picture
        const done = () => S.t.every((v, i) => v === (i + 1) % (S.n * S.n));
        const near = h => { const r = Math.floor(h / S.n), c = h % S.n, a = []; if (r) a.push(h - S.n); if (r < S.n - 1) a.push(h + S.n); if (c) a.push(h - 1); if (c < S.n - 1) a.push(h + 1); return a; };
        function solved() { S.t = []; for (let i = 1; i < S.n * S.n; i++) S.t.push(i); S.t.push(0); S.moves = 0; }
        // random legal moves from the solved state: the puzzle stays solvable
        function shuffle(r) {
            solved();
            let h = S.t.indexOf(0), last = -1;
            for (let k = 0; k < (S.n === 3 ? 40 : 80); k++) {
                const c = near(h).filter(q => q !== last), q = c[Math.floor(r() * c.length)];
                S.t[h] = S.t[q]; S.t[q] = 0; last = h; h = q;
            }
            if (done()) shuffle(r);
            S.moves = 0;
        }
        function reset() { shuffle(rnd); render(); }
        pic.addEventListener('click', e => {
            const g = e.target.closest('[data-i]'); if (!g) return;
            const i = +g.dataset.i, h = S.t.indexOf(0);
            if (!near(h).includes(i)) return;
            S.t[h] = S.t[i]; S.t[i] = 0; S.moves++;
            render();
        });
        function render() {
            const n = S.n, z = 228 / n;
            let s = '';
            S.t.forEach((v, i) => {
                if (!v) return;
                const x = 6 + (i % n) * z, y = 6 + Math.floor(i / n) * z, ok = v === i + 1;
                s += '<g data-i="' + i + '" style="cursor:pointer"><rect x="' + f1(x + 3) + '" y="' + f1(y + 3) + '" width="' + f1(z - 6) + '" height="' + f1(z - 6) + '" rx="8" style="' +
                    fill(ok ? PHI : LAM, 0.28) + ';stroke:' + (ok ? PHI : LAM) + ';stroke-width:2"/>' +
                    '<text class="d-num" x="' + f1(x + z / 2) + '" y="' + f1(y + z / 2 + 8) + '" text-anchor="middle" style="fill:' + TXT + ';font-size:' + (n === 3 ? 26 : 21) + 'px">' + v + '</text></g>';
            });
            pic.innerHTML = svg(240, 240, 'Schiebepuzzle mit ' + (n * n - 1) + ' Steinen', s);
            const fin = done();
            out.innerHTML = '<p style="margin:0">Züge: <b>' + S.moves + '</b></p>' +
                '<p style="margin:6px 0 0">' + (fin ? (S.moves ? '<b>Geschafft in ' + S.moves + ' Zügen!</b>' : 'Geordnet. Tippe auf „Mischen“.') : 'Tippe auf einen Stein neben der Lücke, er rutscht hinein. Ordne die Zahlen der Reihe nach, die Lücke unten rechts.') + '</p>' +
                '<p class="b-help" style="margin:8px 0 0">Grün: Der Stein steht schon richtig. Gemischt wird nur mit erlaubten Zügen, darum ist jedes Puzzle lösbar. Vertauscht man dagegen zwei Steine, geht es nie mehr auf.</p>';
        }
        reset();
    });

    /* ---------- two dice: which sum comes most often? ---------- */
    W('augensummeos6', function (box) {
        const S = { c: [], n: 0, sel: 7, last: null, seed: 11 };
        buttons(box, [['1', '1-mal'], ['10', '10-mal'], ['100', '100-mal', 'b-go'], ['0', 'Löschen']], a => {
            if (a === '0') { S.c = new Array(13).fill(0); S.n = 0; S.last = null; } else roll(+a, Math.random);
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), bars = div(two, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        const rnd = () => { S.seed = (S.seed * 16807) % 2147483647; return S.seed / 2147483647; };  // fixed first picture
        const ways = s => 6 - Math.abs(s - 7);
        function roll(k, r) { for (let i = 0; i < k; i++) { const a = 1 + Math.floor(r() * 6), b = 1 + Math.floor(r() * 6); S.c[a + b]++; S.n++; S.last = [a, b]; } }
        const pick = e => { const g = e.target.closest('[data-s]'); if (g) { S.sel = +g.dataset.s; render(); } };
        pic.addEventListener('click', pick); bars.addEventListener('click', pick);
        function render() {
            const z = 38, x0 = 34, y0 = 34;
            let s = '';
            for (let a = 1; a <= 6; a++) {
                s += txt([x0 - 16, y0 + (a - 0.5) * z + 6], String(a), 'd-num') + txt([x0 + (a - 0.5) * z, y0 - 12], String(a), 'd-num');
                for (let b = 1; b <= 6; b++) {
                    const on = a + b === S.sel, x = x0 + (b - 1) * z, y = y0 + (a - 1) * z;
                    s += '<g data-s="' + (a + b) + '" style="cursor:pointer"><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (z - 4) + '" height="' + (z - 4) + '" rx="5" style="' +
                        fill(on ? LAM : CY, on ? 0.45 : 0.1) + ';stroke:' + (on ? LAM : 'rgba(127,216,238,0.35)') + ';stroke-width:1.5"/>' +
                        '<text class="d-num" x="' + (x + z / 2) + '" y="' + (y + z / 2 + 6) + '" text-anchor="middle">' + (a + b) + '</text></g>';
                }
            }
            pic.innerHTML = svg(270, 270, 'Die 36 Ergebnisse zweier Würfel mit ihrer Augensumme', s);
            const X0 = 34, Y0 = 200, Hh = 160, bw = 26, top = 0.25, Y = v => Y0 - Math.min(v, top) / top * Hh;
            let t = line([X0, Y0], [X0 + 11 * bw + 6, Y0], 'stroke:' + TXT + ';stroke-width:1.6') + line([X0, Y0], [X0, Y0 - Hh - 8], 'stroke:' + TXT + ';stroke-width:1.6');
            [0, 0.1, 0.2].forEach(v => { t += '<text class="d-num" x="' + (X0 - 6) + '" y="' + f1(Y(v) + 5) + '" text-anchor="end">' + fmt(v) + '</text>'; });
            for (let sm = 2; sm <= 12; sm++) {
                const x = X0 + 4 + (sm - 2) * bw, rel = S.n ? S.c[sm] / S.n : 0, on = sm === S.sel;
                t += '<g data-s="' + sm + '" style="cursor:pointer"><rect x="' + x + '" y="' + f1(Y0 - Hh) + '" width="' + (bw - 4) + '" height="' + Hh + '" style="fill:transparent"/>' +
                    '<rect x="' + x + '" y="' + f1(Y(rel)) + '" width="' + (bw - 4) + '" height="' + f1(Y0 - Y(rel)) + '" style="' + fill(on ? LAM : CY, on ? 0.6 : 0.3) + '"/>' +
                    line([x - 2, Y(ways(sm) / 36)], [x + bw - 2, Y(ways(sm) / 36)], 'stroke:' + LAM + ';stroke-width:2;stroke-dasharray:4 3') +
                    txt([x + (bw - 4) / 2, Y0 + 18], String(sm), 'd-num') + '</g>';
            }
            bars.innerHTML = svg(330, 222, 'Säulendiagramm: relative Häufigkeiten der Augensummen', t);
            const k = S.c[S.sel] || 0, w = ways(S.sel);
            out.innerHTML = '<p style="margin:0">' + S.n + ' Würfe' + (S.last ? ' · zuletzt ' + S.last[0] + ' + ' + S.last[1] + ' = ' + (S.last[0] + S.last[1]) : '') + '</p>' +
                '<p style="margin:6px 0 0">Augensumme <b>' + S.sel + '</b>: ' + k + '-mal' + (S.n ? ', relativ $' + fr(k, S.n) + ' \\approx ' + texNum(100 * k / S.n, 1) + '\\,\\%$' : '') +
                ' · im Gitter ' + w + ' von 36 Feldern, also $' + fr(w, 36) + ' \\approx ' + texNum(100 * w / 36, 1) + '\\,\\%$</p>' +
                '<p class="b-help" style="margin:8px 0 0">Tippe auf ein Feld oder eine Säule. Die gestrichelte Linie zeigt den Anteil der Felder. Die 7 hat die meisten Felder (' + [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]].map(q => q[0] + '&nbsp;+&nbsp;' + q[1]).join(', ') + '), die 2 und die 12 nur eins.</p>';
            math(out);
        }
        S.c = new Array(13).fill(0);
        roll(36, rnd);
        render();
    });
})();
