/* buch-gy8.js — widgets of the book Mathematik · Gymnasium 8 (js/buch.js). Every name ends in 8: four books are built side by side.
 *   titelbildgy8   the cover: a central dilation with its rays, (a + b)² as four pieces, two lines meeting in one point, a tree diagram
 *   termbaum8      the calculation tree of a term: the last operation names the term, values flow from the leaves up to the root (data-t, data-hero)
 *   binomformeln8  the three binomial formulas as areas: square, square minus two strips, L-shape turned into a rectangle (data-mode 1|2|3, data-hero)
 *   gluecksrad8    a wheel with n fields: tap fields to form an event, P(E) = |E| / |Ω|, spin and count; unequal fields are no Laplace experiment (data-hero)
 *   wegzeit8       distance-time graph of a way to school: one slider moves the time, the dot on the graph and on the road move together (data-hero)
 *   lgs8           a 2×2 linear system solved step by step: equating, substitution or addition, the two lines at the end
 *   streckung8     central dilation: centre Z and triangle ABC draggable, factor k as a slider, ratios of lengths, angles and areas (data-k, data-hero)
 *   aehnlich8      build a similar triangle on the grid: angles and ratios of the sides compared, main similarity theorem (data-hero)
 *   gulliver8      lengths times k, areas times k², volumes times k³: a cube of k³ unit cubes, Gulliver among the Lilliputians (k = 12)
 *   schatten8      heights from shadows (Thales) and with the forester's triangle (data-mode="schatten|foerster")
 *   rueckwaerts8   "think of a number": a chain of operations, guess the start or work backwards with the inverse operations (data-hero)
 *   sammel8        a sticker album: how many packs until it is full? one album pack by pack or a thousand albums at once
 *   mcpi8          Monte Carlo: random points in a square, the share inside the quarter circle times 4 approaches π (data-hero)
 *   ziffern8       a table of random digits read as a coin or a die (simulating by hand)
 * SVG helpers come from js/buch-geometrie.js (Buch.geo): load it before this file. Colours of drawn parts go into style="" (never fill=""),
 * so js/farbschema.js can translate them. Looks: js/buch.css (section "Gymnasium 8").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { Frac, fmt, texNum, math, range, seg, div, Plot, co, sgx } = B;
    const G = B.geo;
    const W = B.widget;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;
    const rnd = n => Math.floor(Math.random() * n);
    const rint = (lo, hi) => lo + rnd(hi - lo + 1);
    const pick = arr => arr[rnd(arr.length)];
    const isHero = box => box.dataset.hero != null;
    const int = n => Math.round(n).toLocaleString('de-DE').replace(/\./g, '\u202f');
    // the same inside TeX: thin space only from five digits on (1728, but 10\,000)
    const ti = n => { const s = String(Math.round(n)); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s; };
    const f1 = v => (Math.round(v * 10) / 10).toString();
    const mod = (a, m) => ((a % m) + m) % m;
    // a fixed random sequence: pictures in the chapter openers and the print edition look the same every time
    function seeded(s) {
        return function () {
            s = (s + 0x6D2B79F5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const rect = (x, y, w, h, st) => '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" style="' + st + '"/>';
    const lab = (x, y, s, cls) => '<text class="' + (cls || 'g8-lab') + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="middle" dominant-baseline="middle">' + s + '</text>';
    const area = (c, a) => c[0] === '#' ? G.hexFill(c, a) : G.fill(c, a);
    const pts = list => list.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ');

    /* ---------- the cover ---------- */
    W('titelbildgy8', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const closed = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
        const spot = p => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        const word = (x, y, s, size) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="middle" fill="#fff" fill-opacity="0.85" font-family="Times New Roman, serif" font-style="italic" font-size="' + size + '">' + s + '</text>';
        let art = '';
        // two lines meeting in one point: a linear system, far behind everything
        art += '<path d="M0 560 L600 445" stroke="#B8A4F2" stroke-width="2.4" stroke-opacity="0.6" fill="none" stroke-dasharray="10 9"/>';
        art += '<path d="M0 440 L600 560" stroke="#E682BE" stroke-width="2.4" stroke-opacity="0.6" fill="none" stroke-dasharray="10 9"/>';
        const xs = 120 / (115 / 600 + 120 / 600), S = [xs, 440 + 0.2 * xs];
        // (a + b)² as four pieces
        const X0 = 395, Y0 = 452, a = 110, b = 66;
        const sq = (x, y, w, h, c, op) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '" fill-opacity="' + op + '" stroke="' + c + '" stroke-opacity="0.8" stroke-width="1.6"/>';
        art += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (a + b) + '" height="' + (a + b) + '" fill="#081428" fill-opacity="0.9"/>';   // keeps the lines behind out of the square
        art += sq(X0, Y0, a, a, '#F5C242', 0.16) + sq(X0 + a, Y0, b, a, '#7fd8ee', 0.14) + sq(X0, Y0 + a, a, b, '#7fd8ee', 0.14) + sq(X0 + a, Y0 + a, b, b, '#A0C85A', 0.2);
        art += glow(closed([[X0, Y0], [X0 + a + b, Y0], [X0 + a + b, Y0 + a + b], [X0, Y0 + a + b]]), '#F5C242', 2.6);
        art += word(X0 + a / 2, Y0 + a / 2, 'a²', 34) + word(X0 + a + b / 2, Y0 + a / 2, 'ab', 24) + word(X0 + a / 2, Y0 + a + b / 2, 'ab', 24) + word(X0 + a + b / 2, Y0 + a + b / 2, 'b²', 24);
        // a central dilation: centre Z, a small triangle and its image with k = 2.6
        const Z = [50, 772], T = [[118, 728], [160, 748], [140, 692]], k = 2.6;
        const T2 = T.map(p => [Z[0] + k * (p[0] - Z[0]), Z[1] + k * (p[1] - Z[1])]);
        T.forEach(p => { const e = [Z[0] + 2.95 * (p[0] - Z[0]), Z[1] + 2.95 * (p[1] - Z[1])]; art += '<path d="M' + f1(Z[0]) + ' ' + f1(Z[1]) + ' L' + f1(e[0]) + ' ' + f1(e[1]) + '" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1.6" stroke-dasharray="6 7" fill="none"/>'; });
        art += '<path d="' + closed(T2) + '" fill="#F5C242" fill-opacity="0.1"/>' + glow(closed(T2), '#F5C242', 3);
        art += '<path d="' + closed(T) + '" fill="#7fd8ee" fill-opacity="0.18"/>' + glow(closed(T), '#7fd8ee', 2.4);
        // a tree diagram: two stages
        const R = [430, 724], K = [[495, 682], [495, 766]], L = [[560, 660], [560, 704], [560, 744], [560, 788]];
        const edge = (p, q) => '<path d="M' + p[0] + ' ' + p[1] + ' L' + q[0] + ' ' + q[1] + '" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2" fill="none"/>';
        art += edge(R, K[0]) + edge(R, K[1]) + edge(K[0], L[0]) + edge(K[0], L[1]) + edge(K[1], L[2]) + edge(K[1], L[3]);
        const node = (p, c, r) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '" fill="' + c + '" fill-opacity="0.9"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r + 6) + '" fill="' + c + '" fill-opacity="0.14"/>';
        art += node(K[0], '#F5C242', 8) + node(K[1], '#7fd8ee', 8) + L.map((p, i) => node(p, i % 2 ? '#7fd8ee' : '#F5C242', 6)).join('');
        art += spot(R) + spot(Z) + spot(S);
        const id = 't8' + Math.random().toString(36).slice(2, 7);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- the calculation tree of a term ---------- */
    const N = n => ({ n }), X = () => ({ v: 'x' }), O = (o, l, r) => ({ o, l, r });
    const TERMS = {
        a: () => ({ k: '3(x + 4)', t: O('·', N(3), O('+', X(), N(4))) }),
        b: () => ({ k: '3x + 4', t: O('+', O('·', N(3), X()), N(4)) }),
        c: () => ({ k: '(x + 2)(x − 3)', t: O('·', O('+', X(), N(2)), O('−', X(), N(3))) }),
        d: () => ({ k: '5 − 2(x − 1)', t: O('−', N(5), O('·', N(2), O('−', X(), N(1)))) }),
        e: () => ({ k: '(2x − 1)²', t: O('^', O('−', O('·', N(2), X()), N(1)), N(2)) }),
        f: () => ({ k: '(x + 6) : 2', t: O(':', O('+', X(), N(6)), N(2)) })
    };
    const PREC = { '+': 1, '−': 1, '·': 2, ':': 2, '^': 3 };
    const TNAME = { '+': ['eine', 'Summe', 'addiert', 'Summanden'], '−': ['eine', 'Differenz', 'subtrahiert', 'Minuend und Subtrahend'],
        '·': ['ein', 'Produkt', 'multipliziert', 'Faktoren'], ':': ['ein', 'Quotient', 'dividiert', 'Dividend und Divisor'], '^': ['eine', 'Potenz', 'potenziert', 'Basis und Exponent'] };
    const prec = t => t.o ? PREC[t.o] : 9;
    function ttex(t) {
        if (t.n != null) return String(t.n);
        if (t.v) return t.v;
        const w = (c, need) => need ? '(' + ttex(c) + ')' : ttex(c);
        switch (t.o) {
            case '+': return w(t.l, false) + ' + ' + w(t.r, false);
            case '−': return w(t.l, false) + ' - ' + w(t.r, prec(t.r) <= 1);
            case '·': { const l = w(t.l, prec(t.l) < 2), r = w(t.r, prec(t.r) < 2); return t.r.n != null ? l + ' \\cdot ' + r : l + r; }
            case ':': return w(t.l, prec(t.l) < 2) + ' : ' + w(t.r, prec(t.r) <= 2);
            default: return w(t.l, prec(t.l) < 9) + '^{' + ttex(t.r) + '}';
        }
    }
    function tval(t, x) {
        if (t.n != null) return t.n;
        if (t.v) return x;
        const a = tval(t.l, x), b = tval(t.r, x);
        return t.o === '+' ? a + b : t.o === '−' ? a - b : t.o === '·' ? a * b : t.o === ':' ? a / b : Math.pow(a, b);
    }
    W('termbaum8', function (box) {
        const hero = isHero(box);
        const S = { key: box.dataset.t || 'a', x: 2, sel: null };
        let T, nodes, leaves, depth;
        function load() {
            T = TERMS[S.key](); nodes = []; leaves = 0; depth = 0; S.sel = null;
            (function walk(n, d, parent) {
                n.d = d; n.parent = parent; n.id = nodes.length; nodes.push(n); depth = Math.max(depth, d);
                if (n.o) { walk(n.l, d + 1, n); walk(n.r, d + 1, n); n.x = (n.l.x + n.r.x) / 2; } else n.x = leaves++;
            })(T.t, 0, null);
        }
        let out = null;
        if (!hero) {
            const ctr = div(box, 'b-ctrls');
            seg(ctr, Object.keys(TERMS).map(k => [k, TERMS[k]().k]), S.key, v => { S.key = v; load(); render(); }, 'Term');
            const sl = div(box, '');
            range(sl, { label: 'Wert für $x$', min: -5, max: 5, step: 1, value: S.x, fmt: String, onInput: v => { S.x = v; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg tb8-pic');
        if (!hero) out = div(box, 'b-out');
        pic.addEventListener('click', e => {
            const g = e.target.closest('[data-id]'); if (!g || hero) return;
            const n = nodes[+g.dataset.id]; S.sel = S.sel === n ? null : n; render();
        });
        const inSub = (n, top) => { for (let m = n; m; m = m.parent) if (m === top) return true; return false; };
        const val = v => isFinite(v) ? (Number.isInteger(v) ? String(v).replace('-', '−') : fmt(v, 2).replace('-', '−')) : '–';
        const vtex = v => Number.isInteger(v) ? String(v) : texNum(v, 2);
        function render() {
            const SX = 78, SY = 74, pad = 44, w = Math.max(leaves * SX + 2 * pad - SX, 320), h = depth * SY + 2 * pad - 6;
            const off = (w - (leaves - 1) * SX) / 2, P = n => [off + n.x * SX, pad - 6 + n.d * SY];
            let s = '';
            nodes.forEach(n => { if (n.parent) { const p = P(n.parent), q = P(n), on = S.sel && inSub(n, S.sel) && n !== S.sel;
                s += G.line(p, q, 'stroke:' + (on ? CY : DIM) + ';stroke-width:' + (on ? 3 : 1.6)); } });
            nodes.forEach(n => {
                const p = P(n), on = S.sel && inSub(n, S.sel), root = !n.parent;
                const stroke = on ? CY : root ? LAM : DIM;
                s += '<g class="tb8-node" data-id="' + n.id + '">';
                if (n.o) {
                    s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="21" style="' + (root ? 'fill:rgba(245,194,66,0.22)' : 'fill:rgba(127,216,238,0.10)') + ';stroke:' + stroke + ';stroke-width:' + (on || root ? 2.6 : 1.4) + '"/>';
                    s += n.o === '·' ? '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="4.2" style="fill:' + LAM + '"/>'
                        : lab(p[0], p[1] + 1, n.o === '^' ? '( )²' : n.o, n.o === '^' ? 'tb8-op tb8-pow' : 'tb8-op');
                } else {
                    s += rect(p[0] - 22, p[1] - 15, 44, 30, 'fill:rgba(255,255,255,0.05);stroke:' + stroke + ';stroke-width:' + (on ? 2.6 : 1.4)) + lab(p[0], p[1] + 1, n.v ? '<tspan font-style="italic">x</tspan>' : String(n.n), 'tb8-leaf');
                }
                if (!hero) s += lab(p[0], p[1] + (n.o ? 33 : 28), '= ' + val(tval(n, S.x)), 'tb8-val');
                s += '</g>';
            });
            pic.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" style="max-width:100%" role="img" aria-label="Rechenbaum des Terms ' + T.k + '">' + s + '</svg>';
            if (!out) return;
            const r = T.t, nm = TNAME[r.o];
            let t = '<p style="margin:0 0 6px">Der Term $' + ttex(r) + '$ ist ' + nm[0] + ' <b>' + nm[1] + '</b>: Zuletzt wird ' + nm[2] + '. ' +
                (r.o === '^' ? 'Basis $' + ttex(r.l) + '$, Exponent $' + ttex(r.r) + '$.' : nm[3] + ': $' + ttex(r.l) + '$ und $' + ttex(r.r) + '$.') + '</p>';
            t += '<p style="margin:0 0 6px">Für $x = ' + S.x + '$ hat er den Wert <span class="b-res">$' + vtex(tval(r, S.x)) + '$</span>. Gerechnet wird von unten nach oben.</p>';
            if (S.sel && S.sel !== r) {
                const n = S.sel;
                t += '<p style="margin:0">Ausgewählt: ' + (n.o ? 'der Teilterm $' + ttex(n) + '$, ' + TNAME[n.o][0] + ' ' + TNAME[n.o][1] + ' mit dem Wert $' + vtex(tval(n, S.x)) + '$.'
                    : n.v ? 'die Variable $x$ mit dem Wert $' + S.x + '$.' : 'die Zahl $' + n.n + '$.') + '</p>';
            } else t += '<p class="b-help" style="margin:0">Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.</p>';
            out.innerHTML = t;
            math(out);
        }
        if (hero) { pic.style.maxWidth = '280px'; pic.style.margin = '0 auto'; }
        load();
        render();
    });

    /* ---------- the three binomial formulas as areas ---------- */
    W('binomformeln8', function (box) {
        const hero = isHero(box);
        const S = { m: box.dataset.mode || '1', a: 6, b: 3 };
        let rb = null, out = null;
        if (!hero) {
            const ctr = div(box, 'b-ctrls');
            seg(ctr, [['1', '1. Formel'], ['2', '2. Formel'], ['3', '3. Formel']], S.m, v => { S.m = v; fix(); render(); }, 'Binomische Formel');
            const sl = div(box, '');
            range(sl, { label: 'Länge $a$', min: 2, max: 9, step: 1, value: S.a, fmt: String, onInput: v => { S.a = v; fix(); render(); } });
            rb = range(sl, { label: 'Länge $b$', min: 1, max: 8, step: 1, value: S.b, fmt: String, onInput: v => { S.b = v; fix(); render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg bf8-pic');
        if (!hero) out = div(box, 'b-out');
        function fix() { if (S.m !== '1' && S.b >= S.a) { S.b = S.a - 1; if (rb) rb.set(S.b); } }
        const side = (x, y, s) => lab(x, y, s, 'bf8-side');
        function render() {
            const { m, a, b } = S;
            let s = '';
            if (m === '1') {
                const u = 280 / (a + b), A = a * u, Bb = b * u, ox = 180, oy = 34;
                s += rect(ox, oy, A, A, area(LAM, 0.32)) + rect(ox + A, oy, Bb, A, area(CY, 0.26)) + rect(ox, oy + A, A, Bb, area(CY, 0.26)) + rect(ox + A, oy + A, Bb, Bb, area(PHI, 0.32));
                s += lab(ox + A / 2, oy + A / 2, 'a²', 'bf8-in') + lab(ox + A + Bb / 2, oy + A / 2, 'ab', 'bf8-in') + lab(ox + A / 2, oy + A + Bb / 2, 'ab', 'bf8-in') + lab(ox + A + Bb / 2, oy + A + Bb / 2, 'b²', 'bf8-in');
                s += side(ox + A / 2, oy - 16, 'a') + side(ox + A + Bb / 2, oy - 16, 'b') + side(ox - 16, oy + A / 2, 'a') + side(ox - 16, oy + A + Bb / 2, 'b');
            } else if (m === '2') {
                const u = 280 / a, A = a * u, Bb = b * u, C = A - Bb, ox = 180, oy = 34;
                s += rect(ox, oy, A, A, 'fill:none;stroke:' + DIM + ';stroke-width:1.6;stroke-dasharray:6 5');
                s += rect(ox, oy, C, C, area(LAM, 0.34));
                s += rect(ox + C, oy, Bb, A, 'fill:rgba(226,102,90,0.22);stroke:' + RED + ';stroke-width:1.6');
                s += rect(ox, oy + C, A, Bb, 'fill:rgba(226,102,90,0.22);stroke:' + RED + ';stroke-width:1.6');
                s += rect(ox + C, oy + C, Bb, Bb, area(PHI, 0.45));
                s += lab(ox + C / 2, oy + C / 2, '(a − b)²', 'bf8-in') + lab(ox + C + Bb / 2, oy + C / 2, 'ab', 'bf8-in bf8-red') + lab(ox + C / 2, oy + C + Bb / 2, 'ab', 'bf8-in bf8-red') + lab(ox + C + Bb / 2, oy + C + Bb / 2, 'b²', 'bf8-in');
                s += side(ox + C / 2, oy - 16, 'a − b') + side(ox + C + Bb / 2, oy - 16, 'b') + side(ox - 26, oy + C / 2, 'a − b') + side(ox - 16, oy + C + Bb / 2, 'b');
            } else {
                const u = Math.min(260 / a, 470 / (2 * a + b)), A = a * u, Bb = b * u, C = A - Bb, ox = 40, oy = 40, rx = ox + A + 70;
                // left: the square a² without the corner b²
                s += rect(ox + C, oy + C, Bb, Bb, 'fill:none;stroke:' + DIM + ';stroke-width:1.4;stroke-dasharray:5 5') + lab(ox + C + Bb / 2, oy + C + Bb / 2, 'b²', 'bf8-in bf8-dim');
                s += rect(ox, oy, A, C, area(LAM, 0.32)) + rect(ox, oy + C, C, Bb, area(CY, 0.3));
                s += side(ox + A / 2, oy - 16, 'a') + side(ox - 16, oy + A / 2, 'a');
                // the arrow and the right picture: the cyan piece turned and put on the right
                s += '<path d="M' + f1(ox + A + 14) + ' ' + f1(oy + C / 2) + ' h' + 40 + '" style="stroke:' + TXT + ';stroke-width:2;fill:none"/><path d="M' + f1(ox + A + 54) + ' ' + f1(oy + C / 2) + ' l-9 -6 v12 z" style="fill:' + TXT + '"/>';
                s += rect(rx, oy, A, C, area(LAM, 0.32)) + rect(rx + A, oy, Bb, C, area(CY, 0.3));
                s += side(rx + A / 2, oy - 16, 'a') + side(rx + A + Bb / 2, oy - 16, 'b') + side(rx + A + Bb + 30, oy + C / 2, 'a − b');
                s += lab(rx + (A + Bb) / 2, oy + C + 24, '(a + b)(a − b)', 'bf8-in');
            }
            const vb = hero ? (m === '3' ? '20 10 620 320' : '150 8 320 320') : '0 0 640 ' + (m === '3' ? 330 : 340);
            pic.innerHTML = '<svg viewBox="' + vb + '" role="img" aria-label="Binomische Formel als Flächenbild">' + s + '</svg>';
            if (!out) return;
            let t;
            if (m === '1') t = '<p style="margin:0 0 6px">$(a + b)^2 = a^2 + 2ab + b^2$</p><p style="margin:0 0 6px">$(' + a + ' + ' + b + ')^2 = ' + a * a + ' + 2 \\cdot ' + a * b + ' + ' + b * b + ' = ' + (a + b) ** 2 + '$</p>' +
                '<p style="margin:0">Das große Quadrat besteht aus vier Teilen: $a^2$, zweimal $ab$ und $b^2$. Wer nur $a^2 + b^2$ rechnet, vergisst die beiden blauen Rechtecke.</p>';
            else if (m === '2') t = '<p style="margin:0 0 6px">$(a - b)^2 = a^2 - 2ab + b^2$</p><p style="margin:0 0 6px">$(' + a + ' - ' + b + ')^2 = ' + a * a + ' - 2 \\cdot ' + a * b + ' + ' + b * b + ' = ' + (a - b) ** 2 + '$</p>' +
                '<p style="margin:0">Vom Quadrat $a^2$ nimmst du die beiden roten Streifen $ab$ weg. Das grüne Eckquadrat $b^2$ steckt in beiden Streifen, du hast es also zweimal weggenommen. Einmal kommt es zurück: $+\\,b^2$.</p>';
            else t = '<p style="margin:0 0 6px">$(a + b)(a - b) = a^2 - b^2$</p><p style="margin:0 0 6px">$(' + a + ' + ' + b + ')(' + a + ' - ' + b + ') = ' + (a + b) + ' \\cdot ' + (a - b) + ' = ' + (a * a - b * b) + ' = ' + a * a + ' - ' + b * b + '$</p>' +
                '<p style="margin:0">Aus dem Quadrat $a^2$ wird die Ecke $b^2$ herausgeschnitten. Das blaue Stück wird gedreht und rechts angelegt: Es entsteht ein Rechteck mit den Seiten $a + b$ und $a - b$.</p>';
            out.innerHTML = t;
            math(out);
        }
        if (hero) { pic.style.maxWidth = '300px'; pic.style.margin = '0 auto'; }
        fix();
        render();
    });

    /* ---------- a wheel of fortune: Laplace or not ---------- */
    const WEIGHTS = [3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 2, 3];
    W('gluecksrad8', function (box) {
        const hero = isHero(box);
        const S = { n: 8, eq: true, E: new Set([1, 2, 3]), rot: 0, spins: 0, hits: 0, last: null, busy: false };
        let nOut = null, stats = null, out = null;
        if (!hero) {
            const c1 = div(box, 'b-ctrls');
            c1.innerHTML = '<div class="b-ctrl">Felder <span class="b-stepper"><button type="button" data-d="-1" aria-label="ein Feld weniger">−</button><output></output><button type="button" data-d="1" aria-label="ein Feld mehr">+</button></span></div>';
            nOut = c1.querySelector('output');
            seg(c1, [['1', 'gleich groß'], ['0', 'verschieden groß']], '1', v => { S.eq = v === '1'; reset(); }, 'Größe der Felder');
            c1.addEventListener('click', e => {
                const b = e.target.closest('[data-d]'); if (!b || S.busy) return;
                S.n = Math.min(12, Math.max(2, S.n + +b.dataset.d)); S.E.forEach(k => { if (k > S.n) S.E.delete(k); }); reset();
            });
            div(box, 'b-help', 'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.').style.margin = '0 0 10px';
            math(box.querySelector('.b-help'));
        }
        const pic = div(box, 'b-svgbox g-svg gr8-pic');
        if (!hero) {
            const c2 = div(box, 'b-ctrls');
            c2.style.margin = '12px 0';
            c2.innerHTML = '<button type="button" class="b-btn b-go" data-spin>Drehen</button>' + [10, 100, 1000].map(k => '<button type="button" class="b-btn" data-k="' + k + '">+' + int(k) + '</button>').join('') +
                '<button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>';
            c2.addEventListener('click', e => {
                const b = e.target.closest('button'); if (!b || S.busy) return;
                if (b.hasAttribute('data-spin')) spin();
                else if (b.dataset.k) bulk(+b.dataset.k);
                else reset();
            });
            out = div(box, 'b-out');
            stats = div(box, 'b-out');
        }
        pic.addEventListener('click', e => {
            const p = e.target.closest('[data-k]'); if (!p || S.busy || hero) return;
            const k = +p.dataset.k; S.E.has(k) ? S.E.delete(k) : S.E.add(k); S.spins = 0; S.hits = 0; render();
        });
        const weights = () => Array.from({ length: S.n }, (_, i) => S.eq ? 1 : WEIGHTS[i]);
        function sectors() {
            const w = weights(), T = w.reduce((x, y) => x + y, 0); let s0 = 0;
            return w.map((wi, i) => { const s = { k: i + 1, w: wi, s: s0, e: s0 + 360 * wi / T }; s0 = s.e; return s; });
        }
        function draw() {
            const R = 128, c = [160, 168], at = (t, r) => [c[0] + r * Math.sin(t * DEG), c[1] - r * Math.cos(t * DEG)];
            let g = '';
            sectors().forEach((q, i) => {
                const p0 = at(q.s, R), p1 = at(q.e, R), big = q.e - q.s > 180 ? 1 : 0, inE = S.E.has(q.k);
                const fillS = inE ? 'fill:rgba(245,194,66,0.55)' : 'fill:rgba(127,216,238,' + (i % 2 ? 0.10 : 0.22) + ')';
                const d = S.n === 1 ? '' : 'M' + c[0] + ' ' + c[1] + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z';
                g += '<path class="gr8-sec" data-k="' + q.k + '" d="' + d + '" style="' + fillS + ';stroke:' + (S.last === q.k ? LAM : TXT) + ';stroke-width:' + (S.last === q.k ? 3.5 : 1.4) + '"/>';
                const m = at((q.s + q.e) / 2, R * 0.72);
                g += '<text class="gr8-num" x="' + f1(m[0]) + '" y="' + f1(m[1]) + '" text-anchor="middle" dominant-baseline="middle" transform="rotate(' + f1(-S.rot) + ' ' + f1(m[0]) + ' ' + f1(m[1]) + ')">' + q.k + '</text>';
            });
            const pointer = '<path d="M' + (c[0] - 13) + ' ' + (c[1] - R - 22) + ' L' + (c[0] + 13) + ' ' + (c[1] - R - 22) + ' L' + c[0] + ' ' + (c[1] - R + 8) + ' Z" style="fill:' + RED + ';stroke:#0a1426;stroke-width:2"/>';
            pic.innerHTML = '<svg viewBox="0 0 320 320" role="img" aria-label="Glücksrad mit ' + S.n + ' Feldern"><g data-wheel transform="rotate(' + f1(S.rot) + ' ' + c[0] + ' ' + c[1] + ')">' + g + '</g>' +
                '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="9" style="fill:' + TXT + ';stroke:#0a1426;stroke-width:2"/>' + pointer + '</svg>';
        }
        function prob() {
            const q = sectors(), T = q.reduce((x, s) => x + s.w, 0), inE = q.filter(s => S.E.has(s.k)).reduce((x, s) => x + s.w, 0);
            return new Frac(inE, T);
        }
        function render() {
            draw();
            if (nOut) nOut.textContent = S.n;
            if (!out) return;
            const Ek = Array.from(S.E).sort((a, b) => a - b), P = prob();
            let t = '<p style="margin:0 0 6px">$\\Omega = \\{' + (S.n <= 4 ? Array.from({ length: S.n }, (_, i) => i + 1).join('; ') : '1; 2; \\ldots; ' + S.n) + '\\}$ · $E = \\{' + Ek.join('; ') + '\\}$</p>';
            if (S.eq) t += '<p style="margin:0">Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. <span class="b-res">$P(E) = \\dfrac{|E|}{|\\Omega|} = \\dfrac{' + Ek.length + '}{' + S.n + '}' + (P.d !== S.n && Ek.length ? ' = ' + P.tex() : '') + '$</span></p>';
            else t += '<p style="margin:0">Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. $\\tfrac{|E|}{|\\Omega|} = \\tfrac{' + Ek.length + '}{' + S.n + '}$ wäre falsch. ' +
                'Es zählt der Anteil am ganzen Rad: <span class="b-res">$P(E) = ' + P.tex() + '$</span></p>';
            out.innerHTML = t;
            const rel = S.spins ? S.hits / S.spins : NaN;
            stats.innerHTML = '<p style="margin:0">' + (S.last ? 'Zuletzt: Feld <b>' + S.last + '</b>' + (S.E.has(S.last) ? ', $E$ ist eingetreten.' : ', $E$ ist nicht eingetreten.') + '<br>' : '') +
                'Gedreht: $' + ti(S.spins) + '$-mal · $E$ eingetreten: $' + ti(S.hits) + '$-mal · relative Häufigkeit ' + (S.spins ? '$h(E) = \\tfrac{' + S.hits + '}{' + S.spins + '} \\approx ' + texNum(rel, 3) + '$' : '–') +
                ' · Wahrscheinlichkeit $P(E) \\approx ' + texNum(P.value, 3) + '$</p>';
            math(out); math(stats);
        }
        function draw1() {
            const q = sectors(), T = q.reduce((x, s) => x + s.w, 0);
            let r = Math.random() * T;
            for (const s of q) { r -= s.w; if (r < 0) return s; }
            return q[q.length - 1];
        }
        const target = s => S.rot + 360 * 4 + mod(-(s.s + (0.15 + 0.7 * Math.random()) * (s.e - s.s)) - S.rot, 360);
        function count(s) { S.spins++; if (S.E.has(s.k)) S.hits++; S.last = s.k; }
        function spin() {
            const s = draw1(), R1 = target(s), R0 = S.rot, t0 = performance.now(), dur = 1700;
            S.busy = true; S.last = null; render();
            const g = pic.querySelector('[data-wheel]');
            (function frame(now) {
                const u = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - u, 3);
                g.setAttribute('transform', 'rotate(' + f1(R0 + (R1 - R0) * e) + ' 160 168)');
                if (u < 1) return requestAnimationFrame(frame);
                S.rot = mod(R1, 360); S.busy = false; count(s); render();
            })(t0);
        }
        function bulk(k) {
            let s; for (let i = 0; i < k; i++) { s = draw1(); count(s); }
            S.rot = mod(target(s), 360); render();
        }
        function reset() { S.spins = 0; S.hits = 0; S.last = null; render(); }
        if (hero) { pic.style.maxWidth = '260px'; pic.style.margin = '0 auto'; }
        render();
    });

    /* ---------- distance-time graph of a way to school ---------- */
    W('wegzeit8', function (box) {
        const hero = isHero(box);
        const P = [[0, 0], [5, 400], [8, 400], [16, 2800], [20, 3000]];
        const s = t => { for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const [t0, s0] = P[i - 1], [t1, s1] = P[i]; return s0 + (s1 - s0) * (t - t0) / (t1 - t0); } return 3000; };
        const PH = [
            [5, 'geht zu Fuß zur Haltestelle', 80, 'Der Graph steigt gleichmäßig.'],
            [8, 'wartet an der Haltestelle', 0, 'Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.'],
            [16, 'fährt mit dem Bus', 300, 'Hier steigt der Graph am steilsten.'],
            [20, 'geht das letzte Stück zur Schule', 50, 'Der Graph steigt flacher als beim ersten Fußweg.']
        ];
        const S = { t: hero ? 12 : 3 };
        let out = null;
        if (!hero) {
            const sl = div(box, '');
            range(sl, { label: 'Zeit $t$ in min', min: 0, max: 20, step: 0.5, value: S.t, fmt: v => fmt(v, 1) + ' min', onInput: v => { S.t = v; render(); } });
            math(sl);
        }
        const p = new Plot(div(box, ''), { x: [0, 21], y: [0, 3300], height: hero ? 210 : 300, xLabel: 't in min', yLabel: 's in m', aria: 'Weg-Zeit-Diagramm des Schulwegs' });
        const road = div(box, 'b-svgbox wz8-road');
        if (!hero) out = div(box, 'b-out');
        const X = v => 40 + v / 3000 * 560;
        function render() {
            const t = S.t, v = s(t);
            p.draw([{ fn: s, color: 'lambda', domain: [0, 20] }, { seg: [[t, 0], [t, v]], color: 'dim', dash: true }, { pts: [[t, v]], color: 'white', r: 6 }]);
            const ph = PH.find(q => t <= q[0]) || PH[3], bus = t > 8 && t < 16;
            let g = '<line x1="30" y1="52" x2="610" y2="52" style="stroke:' + DIM + ';stroke-width:6;stroke-linecap:round;opacity:0.45"/>';
            g += '<path d="M24 52 v-18 l16 -13 l16 13 v18 z" style="fill:rgba(127,216,238,0.2);stroke:' + CY + ';stroke-width:1.6"/>' + lab(40, 78, 'Zuhause', 'wz8-lab');
            g += '<line x1="' + f1(X(400)) + '" y1="52" x2="' + f1(X(400)) + '" y2="18" style="stroke:' + TXT + ';stroke-width:2"/><circle cx="' + f1(X(400)) + '" cy="16" r="8" style="fill:' + PHI + '"/>' + lab(X(400), 78, 'Haltestelle', 'wz8-lab');
            g += '<path d="M586 52 v-26 h28 v26 z M586 26 l14 -10 l14 10" style="fill:rgba(245,194,66,0.18);stroke:' + LAM + ';stroke-width:1.6"/>' + lab(600, 78, 'Schule', 'wz8-lab');
            if (bus) g += rect(X(v) - 20, 36, 40, 18, 'fill:rgba(127,216,238,0.35);stroke:' + CY + ';stroke-width:1.6;rx:5');
            g += '<circle cx="' + f1(X(v)) + '" cy="' + (bus ? 45 : 52) + '" r="8" style="fill:' + LAM + ';stroke:#0a1426;stroke-width:2"/>';
            road.innerHTML = '<svg viewBox="0 0 640 92" role="img" aria-label="Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist">' + g + '</svg>';
            if (!out) return;
            out.innerHTML = '<p style="margin:0 0 6px">Nach $t = ' + texNum(t, 1) + '$ min ist Mia <span class="b-res">$' + int(v) + '$ m</span> von zu Hause entfernt.</p>' +
                '<p style="margin:0">' + (t >= 20 ? 'Mia ist in der Schule angekommen.' : 'Sie ' + ph[1] + (ph[2] ? ': $' + ph[2] + '$ m pro Minute. ' : '. ') + ph[3]) + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- linear systems step by step ---------- */
    W('lgs8', function (box) {
        const V = ['x', 'y'];
        let S, steps = [], shown = 0, method = 'ein';
        const nz = (lo, hi) => { let v = 0; while (!v) v = rint(lo, hi); return v; };
        function fresh() {
            for (let i = 0; i < 400; i++) {
                const x = nz(-4, 5), y = nz(-4, 5), a1 = nz(-3, 4), b1 = nz(-3, 3), a2 = nz(-4, 4), b2 = nz(-4, 4);
                if (a1 * b2 - a2 * b1 === 0) continue;
                if (Math.abs(a1) !== 1 && Math.abs(b1) !== 1 && Math.random() < 0.75) continue;
                S = { I: [a1, b1, a1 * x + b1 * y], II: [a2, b2, a2 * x + b2 * y], sol: [x, y] };
                return;
            }
            S = { I: [1, 1, 5], II: [2, -1, 1], sol: [2, 3] };
        }
        const F = v => v instanceof Frac ? v : new Frac(v);
        const coF = m => { m = F(m); return m.n === m.d ? '' : m.n === -m.d ? '-' : m.tex(); };
        const sgnF = n => { n = F(n); return n.n === 0 ? '' : n.n > 0 ? ' + ' + n.tex() : ' - ' + new Frac(-n.n, n.d).tex(); };
        const lin = (m, n, w) => { m = F(m); n = F(n); if (m.n === 0) return n.tex(); return coF(m) + w + sgnF(n); };
        const par = v => v < 0 ? '(' + v + ')' : String(v);
        const eqTex = E => co(E[0]) + 'x' + sgx(E[1], 'y') + ' = ' + E[2];
        const probe = () => {
            const [x, y] = S.sol, chk = E => par(E[0]) + ' \\cdot ' + par(x) + ' + ' + par(E[1]) + ' \\cdot ' + par(y) + ' = ' + E[2];
            return ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '\\text{I: } ' + chk(S.I) + ' \\;\\checkmark \\qquad \\text{II: } ' + chk(S.II) + ' \\;\\checkmark',
                'L = \\{(' + x + ' \\mid ' + y + ')\\}'];
        };
        function build() {
            const [x0, y0] = S.sol, I = S.I, II = S.II;
            steps = [];
            if (method === 'ein') {
                const v = Math.abs(I[1]) === 1 ? 1 : Math.abs(I[0]) === 1 ? 0 : 1, w = 1 - v;
                const m = new Frac(-I[w], I[v]), n = new Frac(I[2], I[v]);
                steps.push(['Löse Gleichung I nach $' + V[v] + '$ auf.', V[v] + ' = ' + lin(m, n, V[w])]);
                const put = '\\left(' + lin(m, n, V[w]) + '\\right)';
                const partV = (c, first) => (first ? (c === 1 ? '' : c === -1 ? '-' : c) : (c > 0 ? ' + ' + (c === 1 ? '' : c) : ' - ' + (c === -1 ? '' : -c))) + put;
                const partW = (c, first) => first ? co(c) + V[w] : sgx(c, V[w]);
                const II2 = v === 1 ? partW(II[0], true) + partV(II[1], false) : partV(II[0], true) + partW(II[1], false);
                steps.push(['Setze das für $' + V[v] + '$ in Gleichung II ein.', II2 + ' = ' + II[2]]);
                const A = F(II[w]).add(F(II[v]).mul(m)), K = F(II[v]).mul(n);
                steps.push(['Klammer auflösen und zusammenfassen.', lin(A, K, V[w]) + ' = ' + II[2]]);
                const R = F(II[2]).sub(K);
                steps.push(['Nach $' + V[w] + '$ auflösen.', coF(A) + V[w] + ' = ' + R.tex() + ' \\quad\\Rightarrow\\quad ' + V[w] + ' = ' + S.sol[w]]);
                const wv = S.sol[w];
                steps.push(['Setze $' + V[w] + ' = ' + wv + '$ in die umgestellte Gleichung ein.', V[v] + ' = ' + (m.n === m.d ? '' : m.n === -m.d ? '-' : m.tex() + ' \\cdot ') + par(wv) + sgnF(n) + ' = ' + S.sol[v]]);
            } else if (method === 'gleich') {
                const m1 = new Frac(-I[0], I[1]), n1 = new Frac(I[2], I[1]), m2 = new Frac(-II[0], II[1]), n2 = new Frac(II[2], II[1]);
                steps.push(['Löse beide Gleichungen nach $y$ auf.', '\\text{I: } y = ' + lin(m1, n1, 'x') + ' \\qquad \\text{II: } y = ' + lin(m2, n2, 'x')]);
                steps.push(['Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.', lin(m1, n1, 'x') + ' = ' + lin(m2, n2, 'x')]);
                const A = m1.sub(m2), R = n2.sub(n1);
                steps.push(['Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.', coF(A) + 'x = ' + R.tex() + ' \\quad\\Rightarrow\\quad x = ' + x0]);
                steps.push(['Setze $x = ' + x0 + '$ in Gleichung I (umgestellt) ein.', 'y = ' + (m1.n === m1.d ? '' : m1.n === -m1.d ? '-' : m1.tex() + ' \\cdot ') + par(x0) + sgnF(n1) + ' = ' + y0]);
            } else {
                const g = B.gcd(I[1], II[1]), f1v = II[1] / g, f2v = -I[1] / g;
                const I2 = I.map(c => c * f1v), II2 = II.map(c => c * f2v);
                const mul = (f, r) => f === 1 ? '' : ' \\quad | \\cdot ' + par(f);
                steps.push(['Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.', '\\text{I: } ' + eqTex(I2) + mul(f1v) + ' \\qquad \\text{II: } ' + eqTex(II2) + mul(f2v)]);
                const A = I2[0] + II2[0], R = I2[2] + II2[2];
                steps.push(['Addiere die beiden Gleichungen: $y$ fällt weg.', co(A) + 'x = ' + R]);
                steps.push(['Nach $x$ auflösen.', 'x = \\dfrac{' + R + '}{' + A + '} = ' + x0]);
                const r2 = I[2] - I[0] * x0;
                steps.push(['Setze $x = ' + x0 + '$ in Gleichung I ein.', par(I[0]) + ' \\cdot ' + par(x0) + sgx(I[1], 'y') + ' = ' + I[2] + ' \\quad\\Rightarrow\\quad ' + co(I[1]) + 'y = ' + r2 + ' \\quad\\Rightarrow\\quad y = ' + y0]);
            }
            steps.push(probe());
        }
        const c1 = div(box, 'b-ctrls');
        seg(c1, [['ein', 'Einsetzungsverfahren'], ['gleich', 'Gleichsetzungsverfahren'], ['add', 'Additionsverfahren']], method, v => { method = v; build(); shown = 0; render(); }, 'Verfahren');
        const sys = div(box, 'b-out lg8-sys');
        const list = div(box, 'lg8-steps');
        const c2 = div(box, 'b-ctrls');
        c2.style.margin = '12px 0';
        c2.innerHTML = '<button type="button" class="b-btn b-go" data-next>Nächster Schritt</button><button type="button" class="b-btn" data-all>Alle Schritte</button><button type="button" class="b-btn b-hintbtn" data-new>Neues Gleichungssystem</button>';
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-7, 7], y: [-7, 7], height: 300, aria: 'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt' });
        c2.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-next')) shown = Math.min(steps.length, shown + 1);
            else if (b.hasAttribute('data-all')) shown = steps.length;
            else { fresh(); build(); shown = 0; }
            render();
        });
        function render() {
            sys.innerHTML = '<p style="margin:0">$\\begin{aligned} \\text{I:}&\\quad {' + eqTex(S.I) + '} \\\\ \\text{II:}&\\quad {' + eqTex(S.II) + '}\\end{aligned}$</p>';
            list.innerHTML = '<ol>' + steps.slice(0, shown).map(st => '<li><p>' + st[0] + '</p>' + st.slice(1).map(m => '<p class="lg8-m">$' + m + '$</p>').join('') + '</li>').join('') + '</ol>' +
                (shown < steps.length ? '<p class="b-help" style="margin:0">Schritt ' + (shown + 1) + ' von ' + steps.length + ': erst selbst überlegen, dann aufdecken.</p>' : '');
            const done = shown >= steps.length;
            plotBox.style.display = done ? '' : 'none';
            if (done) {
                const line = (E, col) => E[1] ? { fn: x => (E[2] - E[0] * x) / E[1], color: col, label: E === S.I ? 'I' : 'II' } : { vline: E[2] / E[0], color: col };
                p.draw([line(S.I, 'lambda'), line(S.II, 'cyan'), { pts: [S.sol], color: 'white', r: 6 }]);
            }
            math(sys); math(list);
        }
        if (B.printing()) { S = { I: [2, 1, 7], II: [1, -3, -7], sol: [2, 3] }; build(); shown = steps.length; }
        else { fresh(); build(); }
        render();
    });

    /* ---------- central dilation ---------- */
    W('streckung8', function (box) {
        const hero = isHero(box), U = 40;
        const P = [[80, 320], [160, 280], [240, 300], [180, 220]];          // Z, A, B, C in px (one grid unit = 40 px = 1 cm)
        const S = { k: +(box.dataset.k || 2) };
        let out = null;
        if (!hero) {
            const sl = div(box, '');
            range(sl, { label: 'Streckfaktor $k$', min: -2, max: 3, step: 0.1, value: S.k, fmt: v => fmt(v, 1), onInput: v => { S.k = Math.round(v * 10) / 10; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg st8-pic');
        if (!hero) {
            out = div(box, 'b-out');
            G.dragSVG(pic, (i, x, y) => { P[+i] = [Math.min(620, Math.max(20, Math.round(x / 20) * 20)), Math.min(380, Math.max(20, Math.round(y / 20) * 20))]; render(); });
        }
        let grid = '';
        for (let x = 0; x <= 640; x += U) grid += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="400" style="stroke:rgba(127,216,238,0.08);stroke-width:1"/>';
        for (let y = 0; y <= 400; y += U) grid += '<line x1="0" y1="' + y + '" x2="640" y2="' + y + '" style="stroke:rgba(127,216,238,0.08);stroke-width:1"/>';
        const away = (p, c, d) => { const v = G.sub(p, c), l = G.len(v) || 1; return G.add(p, G.mul(v, d / l)); };
        const ang = (V, P1, P2) => { const u = G.sub(P1, V), w = G.sub(P2, V); return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (G.len(u) * G.len(w) || 1)))) / DEG; };
        const ar = t => Math.abs((t[1][0] - t[0][0]) * (t[2][1] - t[0][1]) - (t[2][0] - t[0][0]) * (t[1][1] - t[0][1])) / 2;
        function render() {
            const k = S.k, [Z, A, Bp, C] = P, T = [A, Bp, C], I = T.map(p => G.add(Z, G.mul(G.sub(p, Z), k)));
            let s = grid;
            T.forEach(p => {
                const a = k >= 0 ? Z : G.add(Z, G.mul(G.sub(p, Z), k - 0.3)), e = G.add(Z, G.mul(G.sub(p, Z), Math.max(1, k) + 0.3));
                s += G.line(a, e, 'stroke:' + DIM + ';stroke-width:1.3;stroke-dasharray:6 6');
            });
            s += G.poly(T, area(CY, 0.18)) + G.poly(I, area(LAM, 0.2));
            if (Math.abs(k) > 0.05) s += G.arc(A, Bp, C, 20, 'fill:rgba(160,200,90,0.3);stroke:' + PHI + ';stroke-width:1.2') + G.arc(I[0], I[1], I[2], 20 * Math.min(2, Math.abs(k) || 1), 'fill:rgba(160,200,90,0.3);stroke:' + PHI + ';stroke-width:1.2');
            const g1 = [(A[0] + Bp[0] + C[0]) / 3, (A[1] + Bp[1] + C[1]) / 3], g2 = [(I[0][0] + I[1][0] + I[2][0]) / 3, (I[0][1] + I[1][1] + I[2][1]) / 3];
            ['A', 'B', 'C'].forEach((n, j) => {
                s += G.txt(away(T[j], g1, 18), n, 'g-pt');
                if (Math.abs(k - 1) > 0.05 && Math.abs(k) > 0.05) s += G.txt(away(I[j], g2, 20), n + '′', 'g-pt st8-img');
            });
            s += G.txt(G.add(Z, [-14, 20]), 'Z', 'g-pt');
            if (hero) s += G.dot(Z, TXT, 5);
            else s += G.handle(Z, 0, TXT) + T.map((p, j) => G.handle(p, j + 1, CY)).join('');
            const all = [Z].concat(T, I), bx = all.map(q => q[0]), by = all.map(q => q[1]);
            const vb = hero ? [Math.min(...bx) - 40, Math.min(...by) - 40, Math.max(...bx) - Math.min(...bx) + 80, Math.max(...by) - Math.min(...by) + 80].map(f1).join(' ') : '0 0 640 400';
            pic.innerHTML = '<svg viewBox="' + vb + '" role="img" aria-label="Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ' + fmt(k, 1) + '">' + s + '</svg>';
            if (!out) return;
            const L = (p, q) => G.len(G.sub(q, p)) / U, rows = [['\\overline{ZA}', L(Z, A), L(Z, I[0])], ['\\overline{ZB}', L(Z, Bp), L(Z, I[1])], ['\\overline{AB}', L(A, Bp), L(I[0], I[1])],
                ['\\overline{BC}', L(Bp, C), L(I[1], I[2])], ['\\overline{CA}', L(C, A), L(I[2], I[0])]];
            const cm = v => texNum(v, 2) + '\\,\\text{cm}', q = (a, b) => a > 1e-9 ? texNum(b / a, 2) : '–';
            let t = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th></th><th>Original</th><th>Bild</th><th>Verhältnis</th></tr>' +
                rows.map(r => '<tr><td>$' + r[0] + '$</td><td>$' + cm(r[1]) + '$</td><td>$' + cm(r[2]) + '$</td><td>$' + q(r[1], r[2]) + '$</td></tr>').join('') +
                '<tr><td>Winkel bei $A$</td><td>$' + texNum(ang(A, Bp, C), 1) + '^\\circ$</td><td>$' + (Math.abs(k) > 1e-9 ? texNum(ang(I[0], I[1], I[2]), 1) + '^\\circ' : '–') + '$</td><td>gleich</td></tr>' +
                '<tr><td>Fläche</td><td>$' + texNum(ar(T) / U / U, 2) + '\\,\\text{cm}^2$</td><td>$' + texNum(ar(I) / U / U, 2) + '\\,\\text{cm}^2$</td><td>$' + q(ar(T), ar(I)) + '$</td></tr></table></div>';
            let w;
            if (Math.abs(k) < 1e-9) w = 'Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.';
            else if (Math.abs(k - 1) < 1e-9) w = 'Mit $k = 1$ bleibt jeder Punkt, wo er ist.';
            else if (Math.abs(k + 1) < 1e-9) w = 'Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.';
            else if (k < 0) w = 'Bei negativem $k$ liegt jeder Bildpunkt auf der anderen Seite von $Z$. Die Bildstrecken sind $|k| = ' + texNum(-k, 1) + '$-mal so lang.';
            else w = (k > 1 ? 'Eine <b>Vergrößerung</b>' : '<b>Eine Verkleinerung</b>') + ': Jede Strecke wird $' + texNum(k, 1) + '$-mal so lang, die Fläche $k^2 = ' + texNum(k * k, 2) + '$-mal so groß.';
            out.innerHTML = '<p style="margin:0 0 8px">' + w + ' Alle Winkel bleiben gleich.</p>' + t +
                '<p class="b-help" style="margin:8px 0 0">Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.</p>';
            math(out);
        }
        if (hero) { pic.style.maxWidth = '360px'; pic.style.margin = '0 auto'; }
        render();
    });

    /* ---------- similar triangles on the grid ---------- */
    W('aehnlich8', function (box) {
        const hero = isHero(box), U = 30;
        const T = [[0, 0], [4, 0], [1, 2]], L0 = [40, 270], R0 = [300, 300];
        let Q = [[1, 1], [7, 1], [3, 5]];
        const toL = p => [L0[0] + p[0] * U, L0[1] - p[1] * U], toR = p => [R0[0] + p[0] * U, R0[1] - p[1] * U];
        const angles = t => [0, 1, 2].map(i => { const V = t[i], P1 = t[(i + 1) % 3], P2 = t[(i + 2) % 3], u = G.sub(P1, V), w = G.sub(P2, V);
            return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (G.len(u) * G.len(w) || 1)))) / DEG; });
        const sides = t => [0, 1, 2].map(i => G.len(G.sub(t[(i + 1) % 3], t[i])));
        const ar2 = t => Math.abs((t[1][0] - t[0][0]) * (t[2][1] - t[0][1]) - (t[2][0] - t[0][0]) * (t[1][1] - t[0][1])) / 2;
        let out = null;
        if (!hero) {
            const c = div(box, 'b-ctrls');
            c.innerHTML = '<button type="button" class="b-btn" data-ex>Ein Beispiel zeigen</button><button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>';
            c.addEventListener('click', e => {
                const b = e.target.closest('button'); if (!b) return;
                Q = b.hasAttribute('data-ex') ? [[2, 0], [2, 8], [-2, 2]].map(p => [p[0] + 3, p[1]]) : [[1, 1], [7, 1], [3, 5]];
                render();
            });
        }
        const pic = div(box, 'b-svgbox g-svg ae8-pic');
        if (!hero) {
            out = div(box, 'b-out');
            G.dragSVG(pic, (i, x, y) => {
                const gx = Math.round((x - R0[0]) / U), gy = Math.round((R0[1] - y) / U);
                Q[+i] = [Math.min(10, Math.max(0, gx)), Math.min(9, Math.max(0, gy))]; render();
            });
        }
        function render() {
            let s = '';
            if (!hero) {
                for (let gx = 0; gx <= 10; gx++) for (let gy = 0; gy <= 9; gy++) { const p = toR([gx, gy]); s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" style="fill:rgba(127,216,238,0.35)"/>'; }
                for (let gx = 0; gx <= 6; gx++) for (let gy = 0; gy <= 4; gy++) { const p = toL([gx, gy]); s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" style="fill:rgba(127,216,238,0.35)"/>'; }
                s += '<line x1="262" y1="20" x2="262" y2="310" style="stroke:' + DIM + ';stroke-width:1;stroke-dasharray:4 6"/>';
                s += lab(130, 300, 'gegeben', 'g8-lab') + lab(450, 330, 'dein Dreieck', 'g8-lab');
            }
            const TL = T.map(toL);
            let QR;
            if (hero) {
                const c = Math.cos(28 * DEG), sn = Math.sin(28 * DEG);
                QR = T.map(p => [330 + 1.9 * U * (p[0] * c - p[1] * sn) * 1.0, 260 - 1.9 * U * (p[0] * sn + p[1] * c)]);
            } else QR = Q.map(toR);
            s += G.poly(TL, area(CY, 0.2)) + G.poly(QR, area(LAM, 0.2));
            const arcs = (t, r) => [0, 1, 2].map(i => G.arc(t[i], t[(i + 1) % 3], t[(i + 2) % 3], r, ['fill:rgba(160,200,90,0.35);stroke:' + PHI, 'fill:rgba(184,164,242,0.35);stroke:' + VIO, 'fill:rgba(226,102,90,0.3);stroke:' + RED][i] + ';stroke-width:1.2')).join('');
            s += arcs(TL, 16);
            if (hero) s += arcs(QR, 22);
            else s += Q.map((p, i) => G.handle(toR(p), i, LAM)).join('');
            pic.innerHTML = '<svg viewBox="' + (hero ? '26 116 524 172' : '0 0 640 340') + '" role="img" aria-label="Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen">' + s + '</svg>';
            if (!out) return;
            const a1 = angles(T).sort((x, y) => x - y), a2 = angles(Q).sort((x, y) => x - y), s1 = sides(T).sort((x, y) => x - y), s2 = sides(Q).sort((x, y) => x - y);
            const flat = ar2(Q) < 1e-9;
            const same = a1.map((v, i) => Math.abs(v - a2[i]) < 0.5);
            const nSame = same.filter(Boolean).length, sim = !flat && nSame === 3, r = s2.map((v, i) => v / s1[i]);
            const deg = v => texNum(v, 1) + '^\\circ';
            let t = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th></th><th>klein</th><th>mittel</th><th>groß</th></tr>' +
                '<tr><td>Winkel, gegeben</td>' + a1.map(v => '<td>$' + deg(v) + '$</td>').join('') + '</tr>' +
                '<tr><td>Winkel bei dir</td>' + a2.map((v, i) => '<td' + (same[i] && !flat ? ' class="b-hot"' : '') + '>$' + (flat ? '–' : deg(v)) + '$</td>').join('') + '</tr>' +
                '<tr><td>Seiten­verhältnis</td>' + r.map(v => '<td>$' + (flat ? '–' : texNum(v, 2)) + '$</td>').join('') + '</tr></table></div>';
            let msg;
            if (flat) msg = 'Die drei Punkte liegen auf einer Geraden: Das ist kein Dreieck.';
            else if (sim) msg = '<b class="g-ok">Ähnlich!</b> Alle Winkel stimmen überein, und alle Seiten sind mit demselben Faktor $k \\approx ' + texNum(r[0], 2) + '$ gestreckt.' + (Math.abs(r[0] - 1) < 0.01 ? ' Mit $k = 1$ sind die Dreiecke sogar kongruent.' : '');
            else msg = 'Noch nicht ähnlich: ' + (nSame ? 'Nur ein Winkel stimmt.' : 'Kein Winkel stimmt.') + ' Die Seitenverhältnisse sind verschieden.';
            out.innerHTML = '<p style="margin:0 0 8px">' + msg + '</p>' + t + '<p class="b-help" style="margin:8px 0 0">Zieh die gelben Ecken auf die Gitterpunkte. Schaffst du ein Dreieck, das ähnlich zum gegebenen ist, aber anders liegt?</p>';
            math(out);
        }
        if (hero) { pic.style.maxWidth = '380px'; pic.style.margin = '0 auto'; }
        render();
    });

    /* ---------- k, k², k³: a cube of unit cubes ---------- */
    W('gulliver8', function (box) {
        const S = { k: 3 };
        const c = div(box, 'b-ctrls');
        seg(c, [1, 2, 3, 4, 5, 12].map(k => [String(k), k === 12 ? 'k = 12 (Gulliver)' : 'k = ' + k]), '3', v => { S.k = +v; render(); }, 'Streckfaktor');
        const pic = div(box, 'b-svgbox g-svg gu8-pic'), out = div(box, 'b-out');
        function cube(C, k, s, grid) {
            const ex = [0.866 * s, 0.5 * s], ey = [-0.866 * s, 0.5 * s], ez = [0, -s];
            const P = (i, j, l) => [C[0] + i * ex[0] + j * ey[0] + l * ez[0], C[1] + i * ex[1] + j * ey[1] + l * ez[1]];
            const face = (q, st) => '<polygon points="' + pts(q) + '" style="' + st + '"/>';
            let g = face([P(0, 0, k), P(k, 0, k), P(k, k, k), P(0, k, k)], area(LAM, 0.22)) +
                face([P(k, 0, 0), P(k, k, 0), P(k, k, k), P(k, 0, k)], area(CY, 0.18)) +
                face([P(0, k, 0), P(k, k, 0), P(k, k, k), P(0, k, k)], area(PHI, 0.18));
            if (grid) for (let t = 1; t < k; t++) {
                const st = 'stroke:' + TXT + ';stroke-opacity:0.45;stroke-width:' + (k > 6 ? 0.6 : 1);
                g += G.line(P(t, 0, k), P(t, k, k), st) + G.line(P(0, t, k), P(k, t, k), st) +
                    G.line(P(k, t, 0), P(k, t, k), st) + G.line(P(k, 0, t), P(k, k, t), st) +
                    G.line(P(t, k, 0), P(t, k, k), st) + G.line(P(0, k, t), P(k, k, t), st);
            }
            return g;
        }
        function render() {
            const k = S.k, s = Math.min(300 / (1.732 * k), 135 / k), sz = Math.min(s, 34);
            let g = cube([90, 190], 1, sz, false) + lab(90, 250, 'Einheitswürfel', 'g8-lab');
            g += cube([420, 160], k, s, true) + lab(420, 312, k + ' × ' + k + ' × ' + k, 'g8-lab');
            pic.innerHTML = '<svg viewBox="0 0 640 330" role="img" aria-label="Ein Einheitswürfel und ein Würfel aus ' + k + ' hoch drei Einheitswürfeln">' + g + '</svg>';
            let t = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th></th><th>Einheitswürfel</th><th>großer Würfel</th><th>Faktor</th></tr>' +
                '<tr><td>Kantenlänge</td><td>$1$</td><td>$' + k + '$</td><td>$k = ' + k + '$</td></tr>' +
                '<tr><td>Oberfläche</td><td>$6$</td><td>$6 \\cdot ' + k + '^2 = ' + ti(6 * k * k) + '$</td><td>$k^2 = ' + ti(k * k) + '$</td></tr>' +
                '<tr><td>Volumen</td><td>$1$</td><td>$' + k + '^3 = ' + ti(k ** 3) + '$</td><td>$k^3 = ' + ti(k ** 3) + '$</td></tr></table></div>';
            if (k === 12) t += '<p style="margin:10px 0 0">Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. ' +
                'Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.</p>';
            else t += '<p style="margin:10px 0 0">Alle Längen werden $' + k + '$-mal so groß, jede Fläche $' + k + '^2 = ' + k * k + '$-mal so groß, das Volumen $' + k + '^3 = ' + k ** 3 + '$-mal so groß.</p>';
            out.innerHTML = t;
            math(out);
        }
        render();
    });

    /* ---------- heights from shadows and with the forester's triangle ---------- */
    W('schatten8', function (box) {
        const M = 12, GY = 262;                         // 12 px per metre, ground line
        const S = { mode: box.dataset.mode || 'schatten', th: 40, H: 14, d: 8, show: false };
        const c = div(box, 'b-ctrls');
        seg(c, [['schatten', 'Schattenmethode'], ['foerster', 'Försterdreieck']], S.mode, v => { S.mode = v; S.show = false; sync(); render(); }, 'Methode');
        const sl = div(box, '');
        const rth = range(sl, { label: 'Sonnenhöhe', min: 25, max: 70, step: 1, value: S.th, fmt: v => v + '°', onInput: v => { S.th = v; S.show = false; render(); } });
        const rd = range(sl, { label: 'Abstand $d$ zum Baum', min: 2, max: 30, step: 0.2, value: S.d, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.d = v; render(); } });
        math(sl);
        const pic = div(box, 'b-svgbox g-svg sc8-pic');
        const acts = div(box, 'b-ctrls');
        acts.style.margin = '12px 0';
        acts.innerHTML = '<button type="button" class="b-btn b-go" data-calc>Höhe ausrechnen</button><button type="button" class="b-btn b-hintbtn" data-new>Neuer Baum</button>';
        const out = div(box, 'b-out');
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-calc')) S.show = true;
            else { S.H = rint(16, 36) / 2; S.show = false; }
            render();
        });
        function sync() {
            rth.input.closest('.b-range').style.display = S.mode === 'schatten' ? '' : 'none';
            rd.input.closest('.b-range').style.display = S.mode === 'foerster' ? '' : 'none';
            acts.querySelector('[data-calc]').style.display = S.mode === 'schatten' ? '' : 'none';
        }
        const tree = (x, H) => rect(x - 4, GY - H * M * 0.45, 8, H * M * 0.45, 'fill:rgba(160,120,80,0.6);stroke:none') +
            '<ellipse cx="' + x + '" cy="' + f1(GY - H * M * 0.66) + '" rx="' + f1(Math.max(16, H * M * 0.2)) + '" ry="' + f1(H * M * 0.34) + '" style="' + area(PHI, 0.35) + '"/>';
        function render() {
            const H = S.H;
            let g = '<line x1="0" y1="' + GY + '" x2="640" y2="' + GY + '" style="stroke:' + DIM + ';stroke-width:2"/>';
            let t;
            if (S.mode === 'schatten') {
                const tn = Math.tan(S.th * DEG), xs = 40, xt = 150, h = 2, s = h / tn, Sh = H / tn;
                const sunX = Math.max(22, xt - (GY - H * M - 24) / tn);
                g += '<circle cx="' + f1(sunX) + '" cy="24" r="14" style="fill:' + LAM + '"/>' + G.line([sunX, 24], [xt, GY - H * M], 'stroke:' + LAM + ';stroke-width:1;stroke-opacity:0.5;stroke-dasharray:2 6');
                g += rect(xs, GY - 3, s * M, 6, 'fill:rgba(20,20,40,0.55);stroke:none') + rect(xt, GY - 3, Sh * M, 6, 'fill:rgba(20,20,40,0.55);stroke:none');
                g += tree(xt, H) + G.line([xs, GY], [xs, GY - h * M], 'stroke:' + RED + ';stroke-width:5;stroke-linecap:round');
                g += G.line([xs, GY - h * M], [xs + s * M, GY], 'stroke:' + LAM + ';stroke-width:1.4;stroke-dasharray:5 4') + G.line([xt, GY - H * M], [xt + Sh * M, GY], 'stroke:' + LAM + ';stroke-width:1.4;stroke-dasharray:5 4');
                g += G.poly([[xs, GY], [xs, GY - h * M], [xs + s * M, GY]], area(CY, 0.18)) + G.poly([[xt, GY], [xt, GY - H * M], [xt + Sh * M, GY]], area(LAM, 0.08));
                g += lab(xs + s * M / 2, GY + 18, 's', 'g8-lab sc8-it') + lab(xt + Sh * M / 2, GY + 18, 'S', 'g8-lab sc8-it') + lab(xs - 8, GY - h * M - 14, 'Stab 2 m', 'g8-lab');
                g += lab(xt - 12, GY - H * M / 2, 'H', 'g8-lab sc8-it');
                const sr = Math.round(s * 100) / 100, Sr = Math.round(Sh * 10) / 10;
                t = '<p style="margin:0 0 6px">Gemessen: Der Stab ist $2$ m hoch, sein Schatten ist $s \\approx ' + texNum(sr, 2) + '$ m lang. Der Schatten des Baums ist $S \\approx ' + texNum(Sr, 1) + '$ m lang.</p>' +
                    '<p style="margin:0">Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.</p>' +
                    (S.show ? '<p style="margin:8px 0 0"><span class="b-res">$H = 2\\,\\text{m} \\cdot \\dfrac{' + texNum(Sr, 1) + '}{' + texNum(sr, 2) + '} \\approx ' + texNum(2 * Sr / sr, 1) + '$ m</span>. Tatsächlich ist der Baum $' + texNum(H, 1) + '$ m hoch.</p>' : '');
            } else {
                const xt = 590, eye = 1.6, xp = xt - S.d * M, hit = eye + S.d;
                g += tree(xt, H);
                g += G.line([xp, GY], [xp, GY - eye * M], 'stroke:' + CY + ';stroke-width:4;stroke-linecap:round') + '<circle cx="' + f1(xp) + '" cy="' + f1(GY - eye * M - 8) + '" r="7" style="fill:' + CY + '"/>';
                const tri = 1.0;
                g += G.poly([[xp + 4, GY - eye * M], [xp + 4 + tri * M, GY - eye * M], [xp + 4 + tri * M, GY - (eye + tri) * M]], area(LAM, 0.35));
                const top = Math.min(hit, 21);
                g += G.line([xp + 4, GY - eye * M], [xt, GY - top * M], 'stroke:' + LAM + ';stroke-width:1.6;stroke-dasharray:6 5');
                g += G.line([xp + 4, GY - eye * M], [xt, GY - eye * M], 'stroke:' + DIM + ';stroke-width:1.2;stroke-dasharray:3 5');
                g += lab((xp + xt) / 2, GY - eye * M + 14, 'd', 'g8-lab sc8-it');
                if (hit <= 21) g += '<circle cx="' + xt + '" cy="' + f1(GY - hit * M) + '" r="5" style="fill:' + LAM + '"/>';
                const ok = Math.abs(hit - H) < 0.25;
                t = '<p style="margin:0 0 6px">Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1{,}6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ' +
                    'Auf $d = ' + texNum(S.d, 1) + '$ m steigt sie um $' + texNum(S.d, 1) + '$ m.</p>' +
                    '<p style="margin:0">' + (ok ? '<b class="g-ok">Treffer!</b> Du siehst genau die Spitze. <span class="b-res">$H = d + 1{,}6\\,\\text{m} = ' + texNum(hit, 1) + '$ m</span>'
                        : hit < H ? 'Du siehst den Baum in $' + texNum(hit, 1) + '$ m Höhe, unter der Spitze: Geh weiter zurück.' : 'Deine Peillinie geht über die Spitze hinweg: Geh näher heran.') + '</p>';
            }
            pic.innerHTML = '<svg viewBox="0 0 640 290" role="img" aria-label="' + (S.mode === 'schatten' ? 'Baum und Stab mit ihren Schatten' : 'Höhenmessung mit dem Försterdreieck') + '">' + g + '</svg>';
            out.innerHTML = t;
            math(out);
        }
        sync();
        render();
    });

    /* ---------- work backwards: think of a number ---------- */
    const INV = { '+': '−', '−': '+', '·': ':', ':': '·' };
    const ap = (v, o, a) => o === '+' ? v + a : o === '−' ? v - a : o === '·' ? v * a : v / a;
    W('rueckwaerts8', function (box) {
        const hero = isHero(box);
        let Z, start, vals, back = 0, guess = null;
        function fresh() {
            for (let t = 0; t < 500; t++) {
                const s0 = rint(2, 15), ops = []; let v = s0;
                while (ops.length < 4) {
                    const o = pick(['+', '−', '·', ':']);
                    let a;
                    if (o === '+') a = rint(2, 12);
                    else if (o === '−') { a = rint(2, 12); if (v - a < 1) continue; }
                    else if (o === '·') { a = rint(2, 5); if (v * a > 200) continue; }
                    else { const ds = [2, 3, 4, 5].filter(d => v % d === 0); if (!ds.length) continue; a = pick(ds); }
                    if (ops.length && ops[ops.length - 1][0] === o) continue;
                    ops.push([o, a]); v = ap(v, o, a);
                }
                if (!ops.some(q => q[0] === '·' || q[0] === ':')) continue;
                Z = ops; start = s0; vals = [s0]; ops.forEach(q => vals.push(ap(vals[vals.length - 1], q[0], q[1])));
                back = 0; guess = null; return;
            }
        }
        const cnum = v => String(v).replace('-', '−');
        const row = div(box, 'rw8-chain');
        const brow = div(box, 'rw8-chain rw8-back');
        let out = null;
        if (!hero) {
            const c = div(box, 'b-ctrls');
            c.style.margin = '12px 0';
            c.innerHTML = '<button type="button" class="b-btn b-go" data-back>Rückwärts: ein Schritt</button><button type="button" class="b-btn" data-all>Alle Schritte</button><button type="button" class="b-btn b-hintbtn" data-new>Neues Rätsel</button>';
            c.addEventListener('click', e => {
                const b = e.target.closest('button'); if (!b) return;
                if (b.hasAttribute('data-back')) back = Math.min(Z.length, back + 1);
                else if (b.hasAttribute('data-all')) back = Z.length;
                else fresh();
                render();
            });
            out = div(box, 'b-out');
            row.addEventListener('input', e => { if (e.target.matches('input')) { const v = B.parseAnswer(e.target.value); guess = isFinite(v) ? v : null; render(true); } });
        }
        function render(keep) {
            const fw = guess == null ? null : [guess];
            if (fw) Z.forEach(q => fw.push(ap(fw[fw.length - 1], q[0], q[1])));
            if (!keep || hero) {
                let h = '<span class="rw8-box rw8-start">' + (hero ? cnum(start) : '<input class="b-in" inputmode="decimal" aria-label="Startzahl" placeholder="?">') + '</span>';
                Z.forEach((q, i) => {
                    h += '<span class="rw8-op">' + q[0] + ' ' + q[1] + '</span>';
                    h += '<span class="rw8-box' + (i === Z.length - 1 ? ' rw8-end' : '') + '" data-i="' + (i + 1) + '">' + (i === Z.length - 1 ? cnum(vals[i + 1]) : '') + '</span>';
                });
                row.innerHTML = h;
            }
            Z.forEach((q, i) => {
                const b = row.querySelector('[data-i="' + (i + 1) + '"]');
                if (i < Z.length - 1) b.textContent = fw ? (Number.isInteger(fw[i + 1]) ? cnum(fw[i + 1]) : fmt(fw[i + 1], 2)) : hero ? cnum(vals[i + 1]) : '';
            });
            const n = hero ? Z.length : back;
            let h = '';
            for (let i = 0; i <= Z.length; i++) {
                const known = i >= Z.length - n;
                h += '<span class="rw8-box' + (known ? ' rw8-known' : '') + '">' + (known ? cnum(vals[i]) : '') + '</span>';
                if (i < Z.length) h += '<span class="rw8-op rw8-inv' + (i >= Z.length - n ? '' : ' rw8-hide') + '">← ' + INV[Z[i][0]] + ' ' + Z[i][1] + '</span>';
            }
            brow.innerHTML = h;
            if (!out) return;
            const end = vals[Z.length];
            let t = '<p style="margin:0 0 6px">Ich denke mir eine Zahl und rechne: ' + Z.map(q => ({ '+': 'plus', '−': 'minus', '·': 'mal', ':': 'geteilt durch' })[q[0]] + ' ' + q[1]).join(', dann ') + '. Heraus kommt $' + end + '$. Welche Zahl war es?</p>';
            if (fw) {
                const got = fw[Z.length], ok = Math.abs(got - end) < 1e-9;
                t += '<p style="margin:0 0 6px">Mit $' + texNum(guess, 2) + '$ kommt $' + texNum(got, 2) + '$ heraus. ' + (ok ? '<b class="g-ok">Richtig!</b>' : 'Das passt nicht.') + '</p>';
            }
            t += '<p class="b-help" style="margin:0">' + (back >= Z.length ? 'Rückwärts von $' + end + '$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>' + start + '</b>.' :
                'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.') + '</p>';
            out.innerHTML = t;
            math(out);
        }
        if (hero || B.printing()) { Z = [['·', 3], ['+', 5], [':', 2], ['−', 4]]; start = 7; vals = [7, 21, 26, 13, 9]; back = Z.length; }
        else fresh();
        render();
    });

    /* ---------- the sticker album ---------- */
    W('sammel8', function (box) {
        const S = { n: 10, have: [], packs: 0, runs: null };
        const c = div(box, 'b-ctrls');
        seg(c, [6, 10, 20, 50].map(n => [String(n), n + ' Bilder']), '10', v => { S.n = +v; S.runs = null; clear(); render(); }, 'Größe des Albums');
        const album = div(box, 'sm8-album');
        const c2 = div(box, 'b-ctrls');
        c2.style.margin = '12px 0';
        c2.innerHTML = '<button type="button" class="b-btn b-go" data-one>Eine Tüte öffnen</button><button type="button" class="b-btn" data-full>Bis das Album voll ist</button>' +
            '<button type="button" class="b-btn" data-many>1000 Alben</button><button type="button" class="b-btn b-hintbtn" data-r>Neues Album</button>';
        const out = div(box, 'b-out');
        const hist = div(box, 'b-svgbox sm8-hist');
        const full = () => S.have.every(h => h > 0);
        function clear() { S.have = new Array(S.n).fill(0); S.packs = 0; }
        function one() { S.have[rnd(S.n)]++; S.packs++; }
        function run(n) { const seen = new Uint8Array(n); let got = 0, k = 0; while (got < n) { const i = rnd(n); k++; if (!seen[i]) { seen[i] = 1; got++; } } return k; }
        c2.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-one')) { if (full()) clear(); one(); }
            else if (b.hasAttribute('data-full')) { if (full()) clear(); while (!full()) one(); }
            else if (b.hasAttribute('data-many')) S.runs = Array.from({ length: 1000 }, () => run(S.n));
            else { clear(); S.runs = null; }
            render();
        });
        function render() {
            album.innerHTML = S.have.map((h, i) => '<span class="sm8-slot' + (h ? ' on' : '') + '" title="Bild ' + (i + 1) + '">' + (i + 1) + (h > 1 ? '<sup>' + h + '</sup>' : '') + '</span>').join('');
            const got = S.have.filter(h => h > 0).length, dup = S.packs - got;
            let t = '<p style="margin:0 0 6px">' + (S.packs ? 'Geöffnet: $' + S.packs + '$ Tüten · im Album: $' + got + '$ von $' + S.n + '$ Bildern · doppelt: $' + dup + '$' +
                (full() ? ' · <b class="g-ok">Voll!</b>' : '') : 'Jede Tüte enthält ein Bild. Alle ' + S.n + ' Bilder sind gleich häufig. Wie viele Tüten brauchst du, bis das Album voll ist?') + '</p>';
            if (S.runs) {
                const r = S.runs, mean = r.reduce((x, y) => x + y, 0) / r.length;
                let hn = 0; for (let k = 1; k <= S.n; k++) hn += 1 / k;
                t += '<p style="margin:0">1000 Alben: Im Mittel brauchte man <span class="b-res">$' + texNum(mean, 1) + '$ Tüten</span> (am wenigsten $' + Math.min(...r) + '$, am meisten $' + Math.max(...r) + '$). ' +
                    'Man kann es auch ausrechnen, mit Mitteln aus der Oberstufe: $' + S.n + ' \\cdot \\left(1 + \\tfrac12 + \\ldots + \\tfrac1{' + S.n + '}\\right) \\approx ' + texNum(S.n * hn, 1) + '$.</p>';
                const lo = Math.min(...r), hi = Math.max(...r), bins = 24, wdt = Math.max(1, Math.ceil((hi - lo + 1) / bins)), cnt = new Array(Math.ceil((hi - lo + 1) / wdt)).fill(0);
                r.forEach(v => cnt[Math.floor((v - lo) / wdt)]++);
                const mx = Math.max(...cnt), bw = 580 / cnt.length;
                let g = '';
                cnt.forEach((n, i) => { const hgt = n / mx * 150; g += rect(40 + i * bw + 1, 170 - hgt, bw - 2, hgt, 'fill:rgba(127,216,238,0.3);stroke:' + CY + ';stroke-width:1'); });
                const xm = 40 + (mean - lo) / (cnt.length * wdt) * 580;
                g += G.line([xm, 12], [xm, 172], 'stroke:' + LAM + ';stroke-width:2.4;stroke-dasharray:6 4') + lab(xm, 8, 'Mittelwert', 'g8-lab sc8-lam');
                g += G.line([40, 170], [620, 170], 'stroke:' + DIM + ';stroke-width:1.4') + lab(40, 188, String(lo), 'g8-lab') + lab(620, 188, String(lo + cnt.length * wdt - 1), 'g8-lab') + lab(330, 206, 'Anzahl der Tüten bis zum vollen Album', 'g8-lab');
                hist.innerHTML = '<svg viewBox="0 0 640 214" role="img" aria-label="Histogramm: wie viele Tüten 1000 Alben gebraucht haben">' + g + '</svg>';
            } else hist.innerHTML = '';
            out.innerHTML = t;
            math(out);
        }
        clear();
        if (B.printing()) { S.runs = Array.from({ length: 1000 }, () => run(S.n)); while (!full()) one(); }
        render();
    });

    /* ---------- Monte Carlo: π from random points ---------- */
    W('mcpi8', function (box) {
        const hero = isHero(box);
        const P = [];
        let hits = 0;
        const rand = hero || B.printing() ? seeded(2026) : Math.random;
        if (!hero) {
            const c = div(box, 'b-ctrls');
            c.innerHTML = [100, 1000, 10000].map(k => '<button type="button" class="b-btn" data-k="' + k + '">+' + int(k) + ' Punkte</button>').join('') + '<button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button>';
            c.addEventListener('click', e => {
                const b = e.target.closest('button'); if (!b) return;
                if (b.dataset.k) add(+b.dataset.k); else { P.length = 0; hits = 0; }
                render();
            });
        }
        const wrap = div(box, 'mc8-wrap');
        const cv = document.createElement('canvas');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Zufallspunkte in einem Quadrat, Treffer im Viertelkreis gelb');
        wrap.appendChild(cv);
        const out = hero ? null : div(box, 'b-out');
        function add(k) { for (let i = 0; i < k; i++) { const x = rand(), y = rand(), h = x * x + y * y <= 1; if (h) hits++; P.push(x, y, h ? 1 : 0); } }
        function draw() {
            const w = wrap.clientWidth || 300, dpr = window.devicePixelRatio || 1;
            cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr);
            const ctx = cv.getContext('2d'), m = 14, s = w - 2 * m, X = x => m + x * s, Y = y => m + (1 - y) * s;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, w);
            ctx.strokeStyle = '#8fa3bd'; ctx.lineWidth = 1.4; ctx.strokeRect(X(0), Y(1), s, s);
            const r = P.length > 30000 ? 1.1 : P.length > 3000 ? 1.5 : 2.4;
            for (let i = 0; i < P.length; i += 3) { ctx.fillStyle = P[i + 2] ? 'rgb(245,194,66)' : 'rgba(143,163,189,0.6)'; ctx.fillRect(X(P[i]) - r / 2, Y(P[i + 1]) - r / 2, r, r); }
            ctx.strokeStyle = '#7fd8ee'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(X(0), Y(0), s, -Math.PI / 2, 0); ctx.stroke();
        }
        function render() {
            draw();
            if (!out) return;
            const n = P.length / 3, est = n ? 4 * hits / n : NaN;
            out.innerHTML = n ? '<p style="margin:0">Von $' + ti(n) + '$ Punkten liegen $' + ti(hits) + '$ im Viertelkreis, das ist der Anteil $' + texNum(hits / n, 4) + '$. ' +
                'Der Viertelkreis bedeckt $\\tfrac{\\pi}{4}$ des Quadrats, also ist <span class="b-res">$\\pi \\approx 4 \\cdot ' + texNum(hits / n, 4) + ' = ' + texNum(est, 4) + '$</span> ' +
                '(Abweichung $' + texNum(Math.abs(est - Math.PI), 4) + '$).</p>' : '<p style="margin:0">Noch keine Punkte. Lass es regnen!</p>';
            math(out);
        }
        if (hero) add(500); else if (B.printing()) add(2000);
        if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(wrap);
        render();
    });

    /* ---------- a table of random digits ---------- */
    W('ziffern8', function (box) {
        const S = { mode: 'wuerfel', d: [] };
        const c = div(box, 'b-ctrls');
        seg(c, [['muenze', 'als Münze'], ['wuerfel', 'als Würfel']], S.mode, v => { S.mode = v; render(); }, 'Lesart');
        const nb = document.createElement('button'); nb.type = 'button'; nb.className = 'b-btn b-hintbtn'; nb.textContent = 'Neue Tabelle'; c.appendChild(nb);
        nb.addEventListener('click', () => { fill(Math.random); render(); });
        const tab = div(box, 'zf8-tab');
        const out = div(box, 'b-out');
        function fill(r) { S.d = Array.from({ length: 200 }, () => Math.floor(r() * 10)); }
        function render() {
            const coin = S.mode === 'muenze';
            // groups of five digits that wrap on narrow screens
            const cell = v => '<span class="zf8-d' + (coin ? (v % 2 ? ' zf8-b' : ' zf8-a') : v >= 1 && v <= 6 ? ' zf8-a' : ' zf8-skip') + '">' + v + '</span>';
            tab.innerHTML = Array.from({ length: S.d.length / 5 }, (_, g) => '<span class="zf8-grp">' + S.d.slice(5 * g, 5 * g + 5).map(cell).join('') + '</span>').join('');
            let t;
            if (coin) {
                const w = S.d.filter(v => v % 2 === 0).length;
                t = '<p style="margin:0 0 6px">Gerade Ziffer (0, 2, 4, 6, 8) = Wappen, ungerade = Zahl. Jede Ziffer ist ein Münzwurf.</p>' +
                    '<p style="margin:0">Wappen: $' + w + '$ · Zahl: $' + (200 - w) + '$ · relative Häufigkeit von Wappen: $' + texNum(w / 200, 3) + '$</p>';
            } else {
                const used = S.d.filter(v => v >= 1 && v <= 6), cnt = [1, 2, 3, 4, 5, 6].map(k => used.filter(v => v === k).length);
                t = '<p style="margin:0 0 6px">Ziffern 1 bis 6 sind Augenzahlen, 0, 7, 8 und 9 werden übersprungen (grau). So entstehen ' + used.length + ' Würfe.</p>' +
                    '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th>Augenzahl</th>' + cnt.map((_, i) => '<th>' + (i + 1) + '</th>').join('') + '</tr>' +
                    '<tr><td>absolut</td>' + cnt.map(v => '<td>' + v + '</td>').join('') + '</tr><tr><td>relativ</td>' + cnt.map(v => '<td>' + fmt(v / used.length, 2) + '</td>').join('') + '</tr></table></div>';
            }
            out.innerHTML = t;
            math(out);
        }
        fill(B.printing() ? seeded(8) : Math.random);
        render();
    });
})();
