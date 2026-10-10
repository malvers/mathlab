/* buch-gy6.js — widgets of the book Mathematik · Gymnasium 6 (js/buch.js; the SVG helpers come from js/buch-geometrie.js,
 * Buch.geo, so that file loads first). Every name ends in 6: the books of grades 5 to 8 are built at the same time.
 *   titelbildgy6    the cover: a fraction circle, the primes up to 30, a triangle with the parallel of the angle-sum proof,
 *                   a triangular prism in cavalier perspective, a hyperbola far behind
 *   bruchbild6      a fraction as circle or strip, as decimal (finite or periodic, and why) and in percent (data-hero)
 *   mengen6         numbers into the set diagram N ⊂ Q+: natural, or only a fraction?
 *   bruchop6        the four basic operations with fractions, each with its picture (data-op, data-hero)
 *   vorrang6        order of operations step by step, the part that comes next is marked
 *   probieren6      equations and inequalities solved by trying: substitute, compare, the number line keeps score
 *   pfeile6         arrow diagrams: ambiguous, unique or one-to-one?
 *   zufall6         coin, die, wheel of fortune: absolute and relative frequencies
 *   darstellung6    one assignment four ways: in words, as a table, as a diagram, as an equation (a candle, a day's temperature, a bike rental)
 *   proportional6   directly or inversely proportional or neither: table with quotient or product, graph (data-mode, data-hero)
 *   dreisatz6       rule of three step by step, direct and inverse
 *   winkelsumme6    triangle with draggable corners, the angles add up to 180°, with the figure of the proof (data-hero)
 *   konstruktion6   which three pieces fix a triangle: sss, sws, wsw, SsW, www - none, one or two solutions
 *   seitenwinkel6   three sticks: triangle inequality, the longest side faces the largest angle, base angles
 *   linien6         special lines of a triangle: perpendicular bisectors, angle bisectors, altitudes, medians (data-mode, data-hero)
 *   flaeche6        parallelogram, triangle, trapezium and kite turned into shapes we know (data-mode, data-hero)
 *   vierecke6       the house of quadrilaterals: pick one, see what it inherits
 *   prisma6         prisms in cavalier perspective and as nets: base, lateral area, surface, volume (data-start, data-view, data-a, data-h, data-hero)
 *   kreisdiagramm6  a survey as a pie chart: share as fraction, percent and angle (data-hero)
 *   sieb6           the sieve of Eratosthenes up to 100, prime by prime (data-hero and print: finished)
 *   primfaktor6     factor tree, prime factorisation, gcd and lcm of two numbers
 * Looks: js/buch.css (section "Gymnasium 6") and the g-/d- classes of the Gymnasium 9 widgets.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, gcd, Frac } = B;
    const { f1, poly, line, txt, dot, handle, hexFill, add, sub, mul, mid, len, rightMark, arc, dragSVG } = B.geo;
    const W = B.widget;
    const LAM = '#F5C242', CY = '#7fd8ee', PHI = '#A0C85A', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;
    let uid = 0;
    const printing = () => !!(B.printing && B.printing());
    const fill = (c, a) => hexFill(c, a) + ';stroke-linejoin:round';
    const svg = (w, h, label, body, extra) => '<svg viewBox="0 0 ' + f1(w) + ' ' + f1(h) + '" role="img" aria-label="' + label + '"' + (extra || '') + '>' + body + '</svg>';

    /* ---------- fractions ---------- */
    const lcm = (a, b) => a / gcd(a, b) * b;
    function fr(n, d) { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : '\\tfrac{' + n + '}{' + d + '}'; }
    function mixed(n, d) {
        const g = gcd(n, d); n /= g; d /= g;
        if (d === 1 || n < d) return fr(n, d);
        return Math.floor(n / d) + '\\tfrac{' + (n % d) + '}{' + d + '}';
    }
    // n/d as a decimal: integer part, digits before the period, the period (long division, n ≥ 0, d > 0)
    function expand(n, d) {
        const ip = Math.floor(n / d), digits = [], seen = new Map();
        let r = n % d;
        while (r !== 0 && !seen.has(r) && digits.length < 60) { seen.set(r, digits.length); r *= 10; digits.push(Math.floor(r / d)); r %= d; }
        if (r === 0) return { ip, pre: digits.join(''), per: '' };
        const k = seen.get(r);
        return { ip, pre: digits.slice(0, k).join(''), per: digits.slice(k).join('') };
    }
    function decTex(n, d) {
        const e = expand(n, d);
        return e.ip + (e.pre || e.per ? '{,}' + e.pre + (e.per ? '\\overline{' + e.per + '}' : '') : '');
    }
    function primeFactors(n) {
        const f = [];
        for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; }
        if (n > 1) f.push(n);
        return f;
    }
    function powers(f) {   // [2,2,2,3,3,5] → "2^3 \cdot 3^2 \cdot 5"
        const c = new Map(); f.forEach(p => c.set(p, (c.get(p) || 0) + 1));
        return [...c.entries()].map(([p, e]) => e > 1 ? p + '^' + e : String(p)).join(' \\cdot ');
    }

    /* ---------- a +/− stepper: label, value, onChange (min/max may be functions) ---------- */
    function stepper(parent, label, o) {
        const d = div(parent, 'b-ctrl');
        d.innerHTML = label + ' <span class="b-stepper"><button type="button" data-d="-1" aria-label="' + o.aria + ' kleiner">−</button><output></output>' +
            '<button type="button" data-d="1" aria-label="' + o.aria + ' größer">+</button></span>';
        const out = d.querySelector('output'), val = x => typeof x === 'function' ? x() : x;
        let v = o.value;
        const show = () => { out.textContent = o.fmt ? o.fmt(v) : String(v); };
        d.addEventListener('click', e => {
            const b = e.target.closest('button[data-d]'); if (!b) return;
            const nv = Math.min(val(o.max), Math.max(val(o.min), v + (+b.dataset.d) * (o.step || 1)));
            if (nv === v) return;
            v = nv; show(); o.onChange(v);
        });
        show();
        return { el: d, get: () => v, set: x => { v = x; show(); } };
    }
    // a row of buttons; returns the box
    function buttons(parent, list, onClick) {
        const box = div(parent, 'b-ctrls');
        box.innerHTML = list.map(([k, l, cls]) => '<button type="button" class="b-btn' + (cls ? ' ' + cls : '') + '" data-a="' + k + '">' + l + '</button>').join('');
        box.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && !b.disabled) onClick(b.dataset.a, b); });
        return box;
    }
    // hero mode: only the picture, centred
    function heroOnly(box, pic, hide, maxW) {
        if (box.dataset.hero == null) return false;
        hide.forEach(e => { if (e) e.style.display = 'none'; });
        if (pic.parentNode && pic.parentNode.classList.contains('b-two')) pic.parentNode.style.display = 'block';
        pic.style.maxWidth = (maxW || 280) + 'px'; pic.style.margin = '0 auto';
        return true;
    }
    // a sector of a circle (centre M, radius r, from angle a0 to a1 in radians, clockwise on screen)
    function sector(M, r, a0, a1) {
        if (a1 - a0 >= 2 * Math.PI - 1e-9) return 'M' + f1(M[0] - r) + ' ' + f1(M[1]) + ' a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0 Z';
        const p0 = [M[0] + r * Math.cos(a0), M[1] + r * Math.sin(a0)], p1 = [M[0] + r * Math.cos(a1), M[1] + r * Math.sin(a1)];
        return 'M' + f1(M[0]) + ' ' + f1(M[1]) + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z';
    }
    const circle = (M, r, st) => '<circle cx="' + f1(M[0]) + '" cy="' + f1(M[1]) + '" r="' + f1(r) + '" style="' + st + '"/>';
    // the edges of a prism in cavalier perspective: front face F (screen coordinates, convex), back face F + v
    function prismEdges(F, v) {
        const n = F.length, Bk = F.map(p => add(p, v));
        const c = mul(F.reduce((s, p) => add(s, p), [0, 0]), 1 / n);
        const vis = F.map((p, i) => {
            const q = F[(i + 1) % n], d = sub(q, p);
            let nr = [d[1], -d[0]];
            if ((mid(p, q)[0] - c[0]) * nr[0] + (mid(p, q)[1] - c[1]) * nr[1] < 0) nr = mul(nr, -1);
            return nr[0] * v[0] + nr[1] * v[1] > 1e-9;
        });
        const solid = [], dashed = [];
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            solid.push([F[i], F[j]]);
            (vis[i] ? solid : dashed).push([Bk[i], Bk[j]]);
            (vis[i] || vis[(i + n - 1) % n] ? solid : dashed).push([F[i], Bk[i]]);
        }
        return { back: Bk, solid, dashed, vis };
    }
    // seeded random numbers: the first state of a widget is the same on every screen and in print
    function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

    /* ---------- the cover ---------- */
    W('titelbildgy6', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const closed = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
        const seg2 = (p, q) => 'M' + f1(p[0]) + ' ' + f1(p[1]) + ' L' + f1(q[0]) + ' ' + f1(q[1]);
        let art = '';
        // a hyperbola far behind everything: inversely proportional
        let hd = '';
        for (let i = 0; i <= 120; i++) { const t = 0.45 + 6 * i / 120, x = 10 + t * 95, y = 850 - 230 / t; hd += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
        art += '<path d="' + hd + '" stroke="#B8A4F2" stroke-width="2.4" stroke-opacity="0.5" fill="none" stroke-dasharray="8 10"/>';
        // three eighths of a circle
        const M = [150, 520], r = 92;
        for (let k = 0; k < 8; k++) {
            const a0 = -Math.PI / 2 + k * Math.PI / 4;
            if (k < 3) art += '<path d="' + sector(M, r, a0, a0 + Math.PI / 4) + '" fill="#F5C242" fill-opacity="' + (0.1 + 0.05 * k) + '"/>';
            art += line(M, [M[0] + r * Math.cos(a0), M[1] + r * Math.sin(a0)], 'stroke:#F5C242;stroke-opacity:0.45;stroke-width:1.4');
        }
        art += glow(sector(M, r, 0, 2 * Math.PI), '#F5C242', 3);
        art += glow(sector(M, r, -Math.PI / 2, -Math.PI / 2 + 3 * Math.PI / 4), '#F5C242', 2.4);
        // the numbers 1 to 30, the primes lit
        const prime = n => n > 1 && primeFactors(n).length === 1;
        for (let n = 1; n <= 30; n++) {
            const c = [352 + ((n - 1) % 6) * 42, 446 + Math.floor((n - 1) / 6) * 34];
            art += prime(n) ? '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="15" fill="#7fd8ee" fill-opacity="0.12"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="6.5" fill="#7fd8ee"/>'
                : '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="3" fill="#8fa3bd" fill-opacity="0.55"/>';
        }
        // a triangle with its three angles, and the parallel through C of the proof
        const A = [300, 770], Bv = [536, 770], C = [446, 610], dl = [1, 0];
        art += line([282, 610], [566, 610], 'stroke:#ffffff;stroke-opacity:0.55;stroke-width:1.6;stroke-dasharray:7 7');
        art += arc(A, Bv, C, 38, fill(LAM, 0.22)) + arc(Bv, C, A, 38, fill(CY, 0.22)) + arc(C, A, Bv, 32, fill(PHI, 0.22));
        art += arc(C, add(C, mul(dl, -50)), A, 32, fill(LAM, 0.22)) + arc(C, Bv, add(C, mul(dl, 50)), 32, fill(CY, 0.22));
        art += glow(closed([A, Bv, C]), '#ffffff', 2.4);
        // a triangular prism in cavalier perspective
        const F = [[62, 784], [222, 784], [62, 664]], v = [48, -48], P = prismEdges(F, v);
        art += '<path d="' + closed(F) + '" fill="#A0C85A" fill-opacity="0.1"/>';
        P.dashed.forEach(([p, q]) => { art += '<path d="' + seg2(p, q) + '" stroke="#A0C85A" stroke-opacity="0.7" stroke-width="1.8" stroke-dasharray="6 6" fill="none"/>'; });
        P.solid.forEach(([p, q]) => { art += glow(seg2(p, q), '#A0C85A', 2.4); });
        // marked points
        [A, Bv, C, M].forEach(p => { art += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        const id = 'tg6' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- a fraction: picture, decimal, percent ---------- */
    W('bruchbild6', function (box) {
        const S = { z: +(box.dataset.z || 3), n: +(box.dataset.n || 8), form: box.dataset.form || 'kreis' };
        const ctr = div(box, 'b-ctrls');
        const sz = stepper(ctr, 'Zähler', { min: 0, max: () => 2 * S.n, value: S.z, aria: 'Zähler', onChange: v => { S.z = v; render(); } });
        stepper(ctr, 'Nenner', { min: 1, max: 12, value: S.n, aria: 'Nenner', onChange: v => { S.n = v; if (S.z > 2 * v) { S.z = 2 * v; sz.set(S.z); } render(); } });
        seg(ctr, [['kreis', 'Kreis'], ['streifen', 'Streifen']], S.form, v => { S.form = v; render(); }, 'Bild');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 260);
        function render() {
            const { z, n } = S, wholes = Math.max(1, Math.ceil(z / n));
            let s = '', w0, h0;
            if (S.form === 'kreis') {
                const r = 70, gap = 18;
                w0 = wholes * 2 * r + (wholes - 1) * gap + 20; h0 = 2 * r + 20;
                for (let w = 0; w < wholes; w++) {
                    const M = [10 + r + w * (2 * r + gap), 10 + r];
                    for (let k = 0; k < n; k++) {
                        const on = w * n + k < z, a0 = -Math.PI / 2 + 2 * Math.PI * k / n;
                        s += '<path d="' + sector(M, r, a0, a0 + 2 * Math.PI / n) + '" style="' + (on ? fill(LAM, 0.42) : 'fill:rgba(127,216,238,0.05);stroke:' + DIM + ';stroke-width:1.4') + '"/>';
                    }
                    s += circle(M, r, 'fill:none;stroke:' + TXT + ';stroke-width:2');
                }
            } else {
                const U = 280, H = 44;
                w0 = U + 20; h0 = wholes * (H + 14) + 6;
                for (let w = 0; w < wholes; w++) {
                    const y = 10 + w * (H + 14);
                    for (let k = 0; k < n; k++) {
                        const on = w * n + k < z;
                        s += '<rect x="' + f1(10 + k * U / n) + '" y="' + y + '" width="' + f1(U / n) + '" height="' + H + '" style="' + (on ? fill(LAM, 0.42) : 'fill:rgba(127,216,238,0.05);stroke:' + DIM + ';stroke-width:1.4') + '"/>';
                    }
                    s += '<rect x="10" y="' + y + '" width="' + U + '" height="' + H + '" style="fill:none;stroke:' + TXT + ';stroke-width:2"/>';
                }
            }
            pic.innerHTML = svg(w0, h0, 'Bild des Bruches ' + z + ' durch ' + n, s);
            if (hero) return;
            const g = gcd(z, n), nk = n / g, f = primeFactors(nk), only25 = f.every(p => p === 2 || p === 5);
            let o = '<p style="margin:0">Bruch: $\\tfrac{' + z + '}{' + n + '}' + (g > 1 && z ? ' = ' + fr(z, n) : '') + (z > n && n / g > 1 ? ' = ' + mixed(z, n) : '') + '$</p>';
            o += '<p style="margin:0">Dezimalzahl: $' + decTex(z, n) + '$</p>';
            o += '<p style="margin:0">Prozent: $' + decTex(100 * z, n) + '\\,\\%$</p>';
            if (z === 0) o += '<p class="b-help" style="margin:8px 0 0">Null Teile von ' + n + ' sind nichts: $0$.</p>';
            else if (nk === 1) o += '<p class="b-help" style="margin:8px 0 0">Der Bruch ist eine natürliche Zahl.</p>';
            else if (only25) {
                const e2 = f.filter(p => p === 2).length, e5 = f.length - e2, m = Math.max(e2, e5), T = Math.pow(10, m), k = T / nk;
                o += '<p class="b-help" style="margin:8px 0 0">Der gekürzte Nenner ' + (f.length > 1 ? '$' + nk + ' = ' + f.join(' \\cdot ') + '$' : '$' + nk + '$') +
                    ' hat nur die Primfaktoren 2 und 5. Erweitern mit $' + k + '$: $' + fr(z, n) + ' = \\tfrac{' + (z / g * k) + '}{' + T + '}$. Die Dezimalzahl <b>bricht ab</b>.</p>';
            } else {
                const bad = f.find(p => p !== 2 && p !== 5);
                o += '<p class="b-help" style="margin:8px 0 0">Der gekürzte Nenner $' + nk + (f.length > 1 ? ' = ' + f.join(' \\cdot ') : '') + '$ enthält den Primfaktor $' + bad +
                    '$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.</p>';
            }
            out.innerHTML = o;
            math(out);
        }
        render();
    });

    /* ---------- the set diagram N ⊂ Q+ ---------- */
    const MENGE = [   // TeX, label in the picture, natural?, why
        ['5', '5', true, '5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: $5 = \\tfrac51$.'],
        ['\\tfrac34', '3/4', false, '$\\tfrac34$ liegt zwischen 0 und 1. Das ist keine natürliche Zahl.'],
        ['0{,}5', '0,5', false, '$0{,}5 = \\tfrac12$ liegt zwischen 0 und 1.'],
        ['\\tfrac{12}{4}', '12/4', true, '$\\tfrac{12}{4} = 3$. Der Bruch sieht nur anders aus als die 3.'],
        ['0', '0', true, 'In der Schule zählt die 0 zu den natürlichen Zahlen.'],
        ['2{,}5', '2,5', false, '$2{,}5$ liegt zwischen 2 und 3.'],
        ['\\tfrac{10}{5}', '10/5', true, '$\\tfrac{10}{5} = 2$.'],
        ['\\tfrac13', '1/3', false, '$\\tfrac13 = 0{,}\\overline{3}$ liegt zwischen 0 und 1.'],
        ['100\\,\\%', '100 %', true, '$100\\,\\% = \\tfrac{100}{100} = 1$.'],
        ['4{,}0', '4,0', true, '$4{,}0 = 4$. Die Null nach dem Komma ändert nichts.'],
        ['\\tfrac92', '9/2', false, '$\\tfrac92 = 4{,}5$ liegt zwischen 4 und 5.'],
        ['\\tfrac77', '7/7', true, '$\\tfrac77 = 1$.']
    ];
    W('mengen6', function (box) {
        const SLOT_N = [[100, 128], [150, 128], [84, 164], [182, 164], [132, 164], [106, 198], [156, 198]];
        const SLOT_Q = [[150, 56], [232, 66], [292, 124], [262, 178], [210, 226], [62, 92]];
        const S = { i: 2, placed: [0, 1], firstTry: 0, tried: false, msg: '' };
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), right = div(two, '');
        const ask = div(right, 'b-out'), out = div(right, 'b-out');
        if (printing() || box.dataset.hero != null) { S.placed = MENGE.map((_, k) => k); S.i = MENGE.length; }
        heroOnly(box, pic, [right], 340);
        ask.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            if (b.dataset.a === 'neu') { S.i = 2; S.placed = [0, 1]; S.firstTry = 0; S.tried = false; S.msg = ''; render(); return; }
            const it = MENGE[S.i], sayN = b.dataset.a === 'n';
            if (sayN === it[2]) {
                if (!S.tried) S.firstTry++;
                S.placed.push(S.i); S.msg = '<p style="margin:0"><span class="g-ok">Richtig.</span> ' + it[3] + '</p><p style="margin:0">$' + it[0] + ' \\in \\mathbb{Q}^+$' +
                    (it[2] ? ' und $' + it[0] + ' \\in \\mathbb{N}$' : ', aber $' + it[0] + ' \\notin \\mathbb{N}$') + '</p>';
                S.i++; S.tried = false;
            } else {
                S.tried = true;
                S.msg = '<p style="margin:0"><span class="g-warn">Noch nicht.</span> ' + (it[2] ? 'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?' : 'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?') + '</p>';
            }
            render();
        });
        function render() {
            let s = '<ellipse cx="170" cy="138" rx="160" ry="122" style="fill:rgba(127,216,238,0.06);stroke:' + CY + ';stroke-width:2"/>' +
                '<ellipse cx="124" cy="160" rx="90" ry="66" style="' + fill(LAM, 0.1) + '"/>' +
                '<text class="g-pt" x="292" y="84" text-anchor="middle" style="fill:' + CY + '">ℚ⁺</text>' +
                '<text class="g-pt" x="50" y="166" text-anchor="middle" style="fill:' + LAM + '">ℕ</text>';
            let kn = 0, kq = 0;
            S.placed.forEach(k => {
                const it = MENGE[k], p = it[2] ? SLOT_N[kn++ % SLOT_N.length] : SLOT_Q[kq++ % SLOT_Q.length];
                s += txt([p[0], p[1] + 5], it[1], 'g-val');
            });
            pic.innerHTML = svg(340, 270, 'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen', s);
            if (S.i < MENGE.length) {
                const it = MENGE[S.i];
                ask.innerHTML = '<p style="margin:0 0 10px">Zahl ' + (S.i - 1) + ' von ' + (MENGE.length - 2) + ': Wohin gehört <b>$' + it[0] + '$</b>?</p>' +
                    '<div class="b-ctrls" style="margin:0"><button type="button" class="b-btn" data-a="n">in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)</button>' +
                    '<button type="button" class="b-btn" data-a="q">nur in $\\mathbb{Q}^+$</button></div>';
            } else {
                ask.innerHTML = '<p style="margin:0 0 10px">Alle Zahlen sind einsortiert' + (S.placed.length > 2 && !printing() ? ', ' + S.firstTry + ' von ' + (MENGE.length - 2) + ' gleich beim ersten Versuch richtig' : '') + '.</p>' +
                    '<div class="b-ctrls" style="margin:0"><button type="button" class="b-btn" data-a="neu">Noch einmal</button></div>';
            }
            out.innerHTML = S.msg || '<p style="margin:0">$\\mathbb{N}$: die natürlichen Zahlen $0, 1, 2, 3, \\dots$<br>$\\mathbb{Q}^+$: die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $\\tfrac{p}{q}$ schreiben kann.<br>' +
                'Jede natürliche Zahl ist auch eine gebrochene Zahl: $\\mathbb{N} \\subset \\mathbb{Q}^+$.</p>';
            math(ask); math(out);
        }
        render();
    });

    /* ---------- the four operations with fractions ---------- */
    const OPS = { '+': [1, 2, 1, 3], '-': [3, 4, 1, 6], '*': [2, 3, 3, 4], ':': [3, 2, 1, 4] };
    W('bruchop6', function (box) {
        const S = { op: box.dataset.op || '+' };
        let [a, b, c, d] = OPS[S.op];
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['+', 'plus'], ['-', 'minus'], ['*', 'mal'], [':', 'durch']], S.op, v => { S.op = v; [a, b, c, d] = OPS[v]; st.forEach((x, i) => x.set([a, b, c, d][i])); render(); }, 'Rechenart');
        const ctr2 = div(box, 'b-ctrls');
        const st = [
            stepper(ctr2, 'Zähler 1', { min: 0, max: 12, value: a, aria: 'erster Zähler', onChange: v => { a = v; render(); } }),
            stepper(ctr2, 'Nenner 1', { min: 1, max: 12, value: b, aria: 'erster Nenner', onChange: v => { b = v; render(); } }),
            stepper(ctr2, 'Zähler 2', { min: 0, max: 12, value: c, aria: 'zweiter Zähler', onChange: v => { c = v; render(); } }),
            stepper(ctr2, 'Nenner 2', { min: 1, max: 12, value: d, aria: 'zweiter Nenner', onChange: v => { d = v; render(); } })
        ];
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, ctr2, out], 300);
        const note = (w, h, t) => svg(w, h, t, '<text class="g-lab" x="' + w / 2 + '" y="' + h / 2 + '" text-anchor="middle">' + t + '</text>');
        // a row of the bar model: value p/q, scale U per whole, cells of size 1/L
        function bar(y, p, q, L, U, wholes, col, label) {
            let s = '<text class="g-lab" x="4" y="' + (y + 22) + '">' + label + '</text>';
            const x0 = 70, H = 30, cells = L * wholes <= 72;
            s += '<rect x="' + f1(x0) + '" y="' + y + '" width="' + f1(Math.min(p / q, wholes) * U) + '" height="' + H + '" style="' + fill(col, 0.4) + ';stroke:none"/>';
            if (cells) for (let k = 1; k < L * wholes; k++) if (k % L) s += line([x0 + k * U / L, y], [x0 + k * U / L, y + H], 'stroke:' + DIM + ';stroke-width:0.8;opacity:0.6');
            for (let w = 0; w <= wholes; w++) s += line([x0 + w * U, y - 4], [x0 + w * U, y + H + 4], 'stroke:' + TXT + ';stroke-width:2');
            s += '<rect x="' + x0 + '" y="' + y + '" width="' + f1(wholes * U) + '" height="' + H + '" style="fill:none;stroke:' + TXT + ';stroke-width:1.6"/>';
            return s;
        }
        function render() {
            let s = '', o = '';
            const A = new Frac(a, b), C = new Frac(c, d), T1 = '\\tfrac{' + a + '}{' + b + '}', T2 = '\\tfrac{' + c + '}{' + d + '}';
            if (S.op === '+' || S.op === '-') {
                const L = lcm(b, d), ka = L / b, kc = L / d, sum = S.op === '+' ? a * ka + c * kc : a * ka - c * kc, sym = S.op === '+' ? '+' : '-';
                if (sum < 0) {
                    pic.innerHTML = note(320, 80, 'Das Ergebnis wäre kleiner als null.');
                    o = '<p style="margin:0">$' + T1 + ' < ' + T2 + '$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.</p>';
                } else {
                    const maxV = Math.max(A.value, C.value, sum / L), wholes = Math.max(1, Math.ceil(maxV - 1e-9));
                    if (wholes > 3) pic.innerHTML = note(320, 80, 'Für das Bild sind die Zahlen zu groß.');
                    else {
                        const U = 240 / wholes;
                        s = bar(10, a, b, L, U, wholes, LAM, '1. Bruch') + bar(56, c, d, L, U, wholes, CY, '2. Bruch') + bar(110, sum, L, L, U, wholes, PHI, 'Ergebnis');
                        s += line([10, 100], [320, 100], 'stroke:' + DIM + ';stroke-width:1;stroke-dasharray:4 4');
                        pic.innerHTML = svg(320, 150, 'Streifenbild der Rechnung', s);
                    }
                    o = '<p style="margin:0">Hauptnenner: $' + L + '$ (das kleinste gemeinsame Vielfache von $' + b + '$ und $' + d + '$)</p>' +
                        '<p style="margin:0">$' + T1 + ' ' + sym + ' ' + T2 + ' = \\tfrac{' + a * ka + '}{' + L + '} ' + sym + ' \\tfrac{' + c * kc + '}{' + L + '} = \\tfrac{' + sum + '}{' + L + '}' +
                        (gcd(sum, L) > 1 || sum === 0 ? ' = ' + fr(sum, L) : '') + (sum > L && L / gcd(sum, L) > 1 ? ' = ' + mixed(sum, L) : '') + '$</p>' +
                        '<p class="b-help" style="margin:8px 0 0">Erst gleichnamig machen, dann die Zähler ' + (S.op === '+' ? 'addieren' : 'subtrahieren') + '. Der Nenner bleibt.</p>';
                }
            } else if (S.op === '*') {
                const P = A.mul(C);
                if (a > b || c > d || !a || !c) pic.innerHTML = note(320, 80, a && c ? 'Das Bild zeigt nur Brüche bis 1.' : 'Mal null ist null.');
                else {
                    const Q = 200, x0 = 70, y0 = 14;
                    for (let i = 0; i < b; i++) for (let j = 0; j < d; j++) {
                        const inA = i < a, inC = j < c;
                        s += '<rect x="' + f1(x0 + i * Q / b) + '" y="' + f1(y0 + j * Q / d) + '" width="' + f1(Q / b) + '" height="' + f1(Q / d) + '" style="' +
                            (inA && inC ? fill(PHI, 0.55) : inA ? fill(LAM, 0.22) : inC ? fill(CY, 0.22) : 'fill:none;stroke:' + DIM + ';stroke-width:0.8') + '"/>';
                    }
                    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + Q + '" height="' + Q + '" style="fill:none;stroke:' + TXT + ';stroke-width:2"/>';
                    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + f1(a * Q / b) + '" height="' + f1(c * Q / d) + '" style="fill:none;stroke:' + PHI + ';stroke-width:3"/>';
                    s += txt([x0 + a * Q / b / 2, y0 + Q + 20], a + '/' + b, 'g-val') + '<text class="g-val" x="' + (x0 - 30) + '" y="' + f1(y0 + c * Q / d / 2 + 5) + '">' + c + '/' + d + '</text>';
                    pic.innerHTML = svg(300, 244, 'Rechteckbild: ein Teil von einem Teil', s);
                }
                o = '<p style="margin:0">$' + T1 + ' \\cdot ' + T2 + ' = \\tfrac{' + a + ' \\cdot ' + c + '}{' + b + ' \\cdot ' + d + '} = \\tfrac{' + a * c + '}{' + b * d + '}' +
                    (gcd(a * c, b * d) > 1 || !(a * c) ? ' = ' + P.tex() : '') + (P.n > P.d && P.d > 1 ? ' = ' + mixed(P.n, P.d) : '') + '$</p>' +
                    (a <= b && c <= d && a && c ? '<p style="margin:0"><span class="g-phi">Grün</span>: $' + a * c + '$ von $' + b * d + '$ Kästchen. Das ist $' + T1 + '$ von $' + T2 + '$.</p>' : '') +
                    '<p class="b-help" style="margin:8px 0 0">Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.</p>';
            } else {
                if (!c) {
                    pic.innerHTML = note(320, 80, 'Durch null kann man nicht teilen.');
                    o = '<p style="margin:0">$' + T2 + ' = 0$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.</p>';
                } else {
                    const Q = A.mul(new Frac(d, c)), maxV = Math.max(A.value, C.value), wholes = Math.max(1, Math.ceil(maxV - 1e-9)), pieces = Math.ceil(Q.value - 1e-9);
                    if (wholes > 3 || pieces > 24) pic.innerHTML = note(320, 80, 'Für das Bild sind die Zahlen zu groß.');
                    else {
                        const U = 240 / wholes, x0 = 70, L = lcm(b, d);
                        s = bar(10, a, b, L, U, wholes, LAM, '1. Bruch');
                        for (let k = 0; k < pieces; k++) {
                            const xa = x0 + k * C.value * U, w = Math.min(C.value * U, x0 + A.value * U - xa);
                            s += '<rect x="' + f1(xa) + '" y="66" width="' + f1(Math.max(w, 0)) + '" height="30" style="' + fill(k % 2 ? CY : VIO, 0.35) + '"/>';
                            if (w < C.value * U - 0.5) s += '<rect x="' + f1(xa) + '" y="66" width="' + f1(C.value * U) + '" height="30" style="fill:none;stroke:' + CY + ';stroke-width:1.4;stroke-dasharray:4 4"/>';
                        }
                        s += '<text class="g-lab" x="4" y="88">' + c + '/' + d + '</text>';
                        pic.innerHTML = svg(320, 110, 'Wie oft passt der zweite Bruch in den ersten?', s);
                    }
                    const nd = a * d, dd = b * c;
                    o = '<p style="margin:0">$' + T1 + ' : ' + T2 + ' = ' + T1 + ' \\cdot \\tfrac{' + d + '}{' + c + '} = \\tfrac{' + nd + '}{' + dd + '}' +
                        (gcd(nd, dd) > 1 || !nd ? ' = ' + Q.tex() : '') + (Q.n > Q.d && Q.d > 1 ? ' = ' + mixed(Q.n, Q.d) : '') + '$</p>' +
                        '<p style="margin:0">$' + T2 + '$ passt $' + mixed(Q.n, Q.d) + '$-mal in $' + T1 + '$.</p>' +
                        '<p class="b-help" style="margin:8px 0 0">Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.</p>';
                }
            }
            if (hero) return;
            out.innerHTML = o;
            math(out);
        }
        render();
    });

    /* ---------- order of operations ---------- */
    const HL = s => '\\underline{\\textcolor{#e39b2d}{' + s + '}}';
    const VOR = [
        { k: 'punkt', l: 'Punkt vor Strich', s: [
            ['\\tfrac12 + ' + HL('\\tfrac13 \\cdot \\tfrac34'), 'Punktrechnung zuerst: $\\tfrac13 \\cdot \\tfrac34 = \\tfrac{3}{12} = \\tfrac14$'],
            [HL('\\tfrac12 + \\tfrac14'), 'Hauptnenner 4: $\\tfrac24 + \\tfrac14 = \\tfrac34$'],
            ['\\tfrac34', 'Fertig.']] },
        { k: 'klammer', l: 'Klammern zuerst', s: [
            ['\\left(' + HL('\\tfrac12 + \\tfrac13') + '\\right) \\cdot \\tfrac34', 'Die Klammer zuerst: $\\tfrac36 + \\tfrac26 = \\tfrac56$'],
            [HL('\\tfrac56 \\cdot \\tfrac34'), '$\\tfrac{5 \\cdot 3}{6 \\cdot 4} = \\tfrac{15}{24} = \\tfrac58$'],
            ['\\tfrac58', 'Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.']] },
        { k: 'komma', l: 'Mit Komma', s: [
            ['2{,}5 - ' + HL('0{,}5 \\cdot 3'), 'Punkt vor Strich: $0{,}5 \\cdot 3 = 1{,}5$'],
            [HL('2{,}5 - 1{,}5'), '$2{,}5 - 1{,}5 = 1$'],
            ['1', 'Fertig. Wer von links rechnet, erhält falsch $6$.']] },
        { k: 'links', l: 'Von links nach rechts', s: [
            [HL('3{,}6 : 0{,}4') + ' + 1{,}2 \\cdot 5', 'Zwei Punktrechnungen: die linke zuerst. $3{,}6 : 0{,}4 = 36 : 4 = 9$'],
            ['9 + ' + HL('1{,}2 \\cdot 5'), '$1{,}2 \\cdot 5 = 6$'],
            [HL('9 + 6'), 'Jetzt die Strichrechnung.'],
            ['15', 'Fertig.']] },
        { k: 'vorteil', l: 'Rechenvorteil', s: [
            [HL('\\tfrac25 \\cdot 7 + \\tfrac25 \\cdot 3'), 'Distributivgesetz: $\\tfrac25$ ausklammern.'],
            ['\\tfrac25 \\cdot \\left(' + HL('7 + 3') + '\\right)', 'Die Klammer zuerst: $7 + 3 = 10$'],
            [HL('\\tfrac25 \\cdot 10'), '$\\tfrac{2 \\cdot 10}{5} = \\tfrac{20}{5} = 4$'],
            ['4', 'Fertig. Ohne Ausklammern: $\\tfrac{14}{5} + \\tfrac65 = \\tfrac{20}{5} = 4$, mehr Arbeit.']] }
    ];
    W('vorrang6', function (box) {
        const S = { t: 0, step: 0 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, VOR.map((v, i) => [String(i), v.l]), '0', v => { S.t = +v; S.step = 0; render(); }, 'Aufgabe');
        const btn = buttons(box, [['next', 'Nächster Schritt', 'b-go'], ['reset', 'Von vorn']], a => {
            if (a === 'next') S.step = Math.min(S.step + 1, VOR[S.t].s.length - 1); else S.step = 0;
            render();
        });
        const out = div(box, 'b-out');
        if (printing()) S.step = VOR[0].s.length - 1;
        function render() {
            const T = VOR[S.t].s;
            let o = '';
            for (let i = 0; i <= S.step; i++) {
                const tex = i === S.step ? T[i][0] : T[i][0].replace(/\\underline\{\\textcolor\{#e39b2d\}\{/g, '{{');
                o += '<p style="margin:0;font-size:1.12em">$' + (i ? '= ' : '') + tex + '$</p>';
            }
            o += '<p class="b-help" style="margin:10px 0 0">' + (S.step < T.length - 1 ? '<b>Jetzt:</b> ' : '') + T[S.step][1] + '</p>';
            out.innerHTML = o;
            btn.querySelector('[data-a="next"]').disabled = S.step >= T.length - 1;
            math(out);
        }
        render();
    });

    /* ---------- equations and inequalities by trying ---------- */
    const PROB = [
        { l: '$\\tfrac95 \\cdot a = 1$', v: 'a', den: 9, k0: 0, k1: 18, start: 9, L: x => new Frac(9, 5).mul(x), R: new Frac(1), rel: '=', tex: x => '\\tfrac95 \\cdot ' + x },
        { l: '$x + \\tfrac34 = 2$', v: 'x', den: 4, k0: 0, k1: 12, start: 2, L: x => x.add(new Frac(3, 4)), R: new Frac(2), rel: '=', tex: x => x + ' + \\tfrac34' },
        { l: '$12 : v = 3$', v: 'v', den: 1, k0: 1, k1: 12, start: 2, L: x => new Frac(12).mul(new Frac(x.d, x.n)), R: new Frac(3), rel: '=', tex: x => '12 : ' + x },
        { l: '$4 \\cdot x < 3$', v: 'x', den: 8, k0: 0, k1: 16, start: 8, L: x => new Frac(4).mul(x), R: new Frac(3), rel: '<', tex: x => '4 \\cdot ' + x },
        { l: '$2{,}5 + y > 4$', v: 'y', den: 2, k0: 0, k1: 10, start: 2, dec: true, L: x => new Frac(5, 2).add(x), R: new Frac(4), rel: '>', tex: x => '2{,}5 + ' + x }
    ];
    W('probieren6', function (box) {
        const S = { p: 0, k: PROB[0].start, tried: new Set([PROB[0].start]) };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, PROB.map((p, i) => [String(i), p.l]), '0', v => {
            S.p = +v; const P = PROB[S.p]; S.k = P.start; S.tried = new Set([S.k]);
            rk.input.min = P.k0; rk.input.max = P.k1; rk.set(S.k); render();
        }, 'Aufgabe');
        math(ctr);
        const show = k => { const P = PROB[S.p]; return P.dec ? fmt(k / P.den) : P.den === 1 ? String(k) : (gcd(k, P.den) === P.den ? String(k / P.den) : (k / gcd(k, P.den)) + '/' + (P.den / gcd(k, P.den))); };
        const sl = div(box, '');
        const rk = range(sl, { label: 'Einsetzen', min: PROB[0].k0, max: PROB[0].k1, step: 1, value: S.k, fmt: show, onInput: v => { S.k = v; S.tried.add(v); render(); } });
        buttons(box, [['all', 'Alle Werte prüfen'], ['reset', 'Von vorn']], a => {
            const P = PROB[S.p];
            if (a === 'all') for (let k = P.k0; k <= P.k1; k++) S.tried.add(k); else S.tried = new Set([S.k]);
            render();
        });
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        const holds = (P, k) => { const d = P.L(new Frac(k, P.den)).sub(P.R).n; return P.rel === '=' ? d === 0 : P.rel === '<' ? d < 0 : d > 0; };
        if (printing()) for (let k = PROB[0].k0; k <= PROB[0].k1; k++) S.tried.add(k);
        function render() {
            const P = PROB[S.p], x = new Frac(S.k, P.den), Lv = P.L(x), d = Lv.sub(P.R).n, ok = holds(P, S.k);
            const xt = P.dec ? texNum(x.value) : x.tex(), lt = P.dec ? texNum(Lv.value) : Lv.tex(), rt = P.dec ? texNum(P.R.value) : P.R.tex();
            const relNow = d === 0 ? '=' : d < 0 ? '<' : '>';
            // number line
            const x0 = 24, x1 = 316, n = P.k1 - P.k0, X = k => x0 + (k - P.k0) / n * (x1 - x0);
            let s = line([x0 - 8, 40], [x1 + 8, 40], 'stroke:' + TXT + ';stroke-width:1.6');
            for (let k = P.k0; k <= P.k1; k++) {
                const big = (k * 1 / P.den) % 1 === 0;
                s += line([X(k), big ? 32 : 35], [X(k), big ? 48 : 45], 'stroke:' + DIM + ';stroke-width:1.2');
                if (big) s += txt([X(k), 68], String(k / P.den), 'd-num');
                if (S.tried.has(k)) s += circle([X(k), 40], k === S.k ? 7 : 5, 'fill:' + (holds(P, k) ? PHI : RED) + ';stroke:#0a1426;stroke-width:1.5');
            }
            s += '<path d="M' + f1(X(S.k)) + ' 22 l-6 -10 h12 z" fill="' + LAM + '"/>';
            pic.innerHTML = svg(340, 80, 'Zahlenstrahl: grün erfüllt, rot nicht', s);
            const good = [...S.tried].filter(k => holds(P, k)).sort((u, v) => u - v);
            out.innerHTML = '<p style="margin:0">$' + P.v + ' = ' + xt + '$: &nbsp; $' + P.tex(xt) + ' = ' + lt + '$, und $' + lt + ' ' + relNow + ' ' + rt + '$</p>' +
                '<p style="margin:0">' + (ok ? '<span class="g-ok">Passt.</span> ' : '<span class="g-warn">Passt nicht.</span> ') +
                (P.rel === '=' ? (ok ? 'Probe: Einsetzen ergibt eine wahre Aussage.' : d < 0 ? 'Die linke Seite ist zu klein.' : 'Die linke Seite ist zu groß.') :
                    'Gesucht sind alle Zahlen, für die die linke Seite ' + (P.rel === '<' ? 'kleiner' : 'größer') + ' als $' + rt + '$ ist.') + '</p>' +
                '<p class="b-help" style="margin:8px 0 0">Geprüft: ' + S.tried.size + ' von ' + (n + 1) + ' Werten. ' + (good.length ? 'Es passen: ' + good.map(show).join(', ') + '.' : 'Bisher passt keiner.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- arrow diagrams ---------- */
    const PFEILE = [
        { l: 'Schüler → Vorname', L: ['Lena Berg', 'Tom Klein', 'Lena Roth', 'Max Vogel'], R: ['Lena', 'Max', 'Tom'], a: [[0, 0], [1, 2], [2, 0], [3, 1]] },
        { l: 'Vorname → Schüler', L: ['Lena', 'Max', 'Tom'], R: ['Lena Berg', 'Tom Klein', 'Lena Roth', 'Max Vogel'], a: [[0, 0], [0, 2], [1, 3], [2, 1]] },
        { l: 'Schüler → Sitzplatz', L: ['Lena Berg', 'Tom Klein', 'Lena Roth', 'Max Vogel'], R: ['Platz 1', 'Platz 2', 'Platz 3', 'Platz 4'], a: [[0, 2], [1, 0], [2, 3], [3, 1]] },
        { l: 'Zahl → Teiler', L: ['4', '6', '9'], R: ['1', '2', '3', '4', '6', '9'], a: [[0, 0], [0, 1], [0, 3], [1, 0], [1, 1], [1, 2], [1, 4], [2, 0], [2, 2], [2, 5]] },
        { l: 'Zahl → Doppeltes', L: ['1', '2', '3', '4'], R: ['2', '4', '6', '8'], a: [[0, 0], [1, 1], [2, 2], [3, 3]] },
        { l: 'Zahl → Rest bei : 3', L: ['5', '6', '7', '8'], R: ['0', '1', '2'], a: [[0, 2], [1, 0], [2, 1], [3, 2]] }
    ];
    function pfeilArt(P) {
        const out = P.L.map(() => 0), inn = P.R.map(() => 0);
        P.a.forEach(([i, j]) => { out[i]++; inn[j]++; });
        const many = out.findIndex(x => x > 1);
        if (many >= 0) return { t: 'mehr', why: 'Von „' + P.L[many] + '“ gehen ' + out[many] + ' Pfeile aus.' };
        const twice = inn.findIndex(x => x > 1);
        if (twice >= 0) return { t: 'ein', why: 'Von jedem Element links geht genau ein Pfeil aus. Bei „' + P.R[twice] + '“ kommen aber ' + inn[twice] + ' Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig.' };
        return { t: 'einein', why: 'Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.' };
    }
    W('pfeile6', function (box) {
        const S = { p: 0, msg: '' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, PFEILE.map((p, i) => [String(i), p.l]), '0', v => { S.p = +v; S.msg = ''; render(); }, 'Zuordnung');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), right = div(two, '');
        const ask = div(right, 'b-out'), out = div(right, 'b-out');
        ask.innerHTML = '<p style="margin:0 0 10px">Welche Art von Zuordnung ist das?</p><div class="b-ctrls" style="margin:0">' +
            '<button type="button" class="b-btn" data-a="mehr">mehrdeutig</button><button type="button" class="b-btn" data-a="ein">eindeutig</button>' +
            '<button type="button" class="b-btn" data-a="einein">eineindeutig</button></div>';
        heroOnly(box, pic, [ctr, right], 320);
        const NAME = { mehr: 'mehrdeutig', ein: 'eindeutig, aber nicht eineindeutig', einein: 'eineindeutig' };
        ask.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            const r = pfeilArt(PFEILE[S.p]);
            S.msg = (b.dataset.a === r.t ? '<span class="g-ok">Richtig:</span> ' : '<span class="g-warn">Nicht ganz.</span> Die Zuordnung ist ' + NAME[r.t] + '. ') + r.why;
            render();
        });
        function render() {
            const P = PFEILE[S.p], n = Math.max(P.L.length, P.R.length), H = n * 36 + 30, xl = 78, xr = 262;
            const yL = i => 15 + (H - 30) * (i + 0.5) / P.L.length, yR = j => 15 + (H - 30) * (j + 0.5) / P.R.length;
            const id = 'pf6-' + (++uid);
            let s = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="' + CY + '"/></marker></defs>';
            s += '<ellipse cx="' + xl + '" cy="' + H / 2 + '" rx="70" ry="' + (H / 2 - 4) + '" style="' + fill(LAM, 0.06) + '"/>';
            s += '<ellipse cx="' + xr + '" cy="' + H / 2 + '" rx="70" ry="' + (H / 2 - 4) + '" style="' + fill(VIO, 0.06) + '"/>';
            P.a.forEach(([i, j]) => { s += '<line x1="' + (xl + 44) + '" y1="' + f1(yL(i)) + '" x2="' + (xr - 46) + '" y2="' + f1(yR(j)) + '" style="stroke:' + CY + ';stroke-width:1.8" marker-end="url(#' + id + ')"/>'; });
            P.L.forEach((t, i) => { s += txt([xl, yL(i) + 5], t, 'g-val'); });
            P.R.forEach((t, j) => { s += txt([xr, yR(j) + 5], t, 'g-val'); });
            pic.innerHTML = svg(340, H, 'Pfeildarstellung: ' + P.l, s);
            out.innerHTML = '<p style="margin:0">' + (S.msg || '<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.') + '</p>';
        }
        render();
    });

    /* ---------- coin, die, wheel of fortune: frequencies ---------- */
    const ZUF = {
        muenze: { l: 'Münze', o: ['Kopf', 'Zahl'], p: [1 / 2, 1 / 2] },
        wuerfel: { l: 'Würfel', o: ['1', '2', '3', '4', '5', '6'], p: [1, 1, 1, 1, 1, 1].map(x => x / 6) },
        rad: { l: 'Glücksrad', o: ['Rot', 'Blau', 'Grün'], p: [1 / 2, 1 / 3, 1 / 6] }
    };
    const RADCOL = [RED, CY, PHI];
    W('zufall6', function (box) {
        const S = { e: box.dataset.start || 'wuerfel', counts: null };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(ZUF).map(k => [k, ZUF[k].l]), S.e, v => { S.e = v; reset(); render(); }, 'Versuch');
        buttons(box, [['1', '1-mal'], ['10', '10-mal'], ['100', '100-mal', 'b-go'], ['0', 'Löschen']], a => {
            if (a === '0') S.counts = ZUF[S.e].o.map(() => 0); else throwN(+a, Math.random);
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function throwN(n, rnd) {
            const E = ZUF[S.e];
            for (let i = 0; i < n; i++) { let u = rnd(), k = 0; while (k < E.p.length - 1 && u >= E.p[k]) { u -= E.p[k]; k++; } S.counts[k]++; }
        }
        function reset() { S.counts = ZUF[S.e].o.map(() => 0); throwN(20, seeded(6)); }
        function render() {
            const E = ZUF[S.e], n = S.counts.reduce((s, x) => s + x, 0), m = E.o.length;
            const x0 = 40, y0 = 190, Hh = 160, bw = 260 / m, Y = v => y0 - v * Hh;
            let s = line([x0, y0], [x0 + 270, y0], 'stroke:' + TXT + ';stroke-width:1.6') + line([x0, y0], [x0, y0 - Hh - 10], 'stroke:' + TXT + ';stroke-width:1.6');
            [0, 0.25, 0.5, 0.75, 1].forEach(v => { s += line([x0 - 4, Y(v)], [x0, Y(v)], 'stroke:' + DIM) + '<text class="d-num" x="' + (x0 - 7) + '" y="' + f1(Y(v) + 5) + '" text-anchor="end">' + fmt(v) + '</text>'; });
            E.o.forEach((o, k) => {
                const rel = n ? S.counts[k] / n : 0, xa = x0 + 8 + k * bw, w = bw - 16, col = S.e === 'rad' ? RADCOL[k] : CY;
                s += '<rect x="' + f1(xa) + '" y="' + f1(Y(rel)) + '" width="' + f1(w) + '" height="' + f1(rel * Hh) + '" style="' + fill(col, 0.3) + '"/>';
                s += line([xa - 4, Y(E.p[k])], [xa + w + 4, Y(E.p[k])], 'stroke:' + LAM + ';stroke-width:2;stroke-dasharray:5 4');
                s += txt([xa + w / 2, y0 + 20], o, 'd-num');
            });
            pic.innerHTML = svg(320, 220, 'Säulendiagramm der relativen Häufigkeiten', s);
            let tab = '<div class="b-table-wrap"><table class="b-table g-tab g6-tab"><tr><th>Ergebnis</th><th>absolut</th><th>relativ</th><th>in %</th></tr>';
            E.o.forEach((o, k) => {
                tab += '<tr><td>' + o + '</td><td>' + S.counts[k] + '</td><td>' + (n ? '$\\tfrac{' + S.counts[k] + '}{' + n + '} ' + (Math.abs(Math.round(100 * S.counts[k] / n) - 100 * S.counts[k] / n) < 1e-9 ? '=' : '\\approx') + ' ' + texNum(S.counts[k] / n, 2) + '$' : '–') + '</td><td>' + (n ? fmt(100 * S.counts[k] / n, 1) + ' %' : '–') + '</td></tr>';
            });
            tab += '</table></div>';
            out.innerHTML = '<p style="margin:0">' + n + ' Versuche</p>' + tab +
                '<p class="b-help" style="margin:8px 0 0">Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. Die gestrichelte Linie zeigt die Chance' +
                (S.e === 'rad' ? ' (Rot ist das halbe Rad, Blau ein Drittel, Grün ein Sechstel)' : '') + '. Je mehr Versuche, desto näher kommen die Säulen meistens heran.</p>';
            math(out);
        }
        reset();
        render();
    });

    /* ---------- one assignment, four representations ---------- */
    const DAR = {
        kerze: { l: 'Kerze', wort: 'Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', xl: 'Zeit in h', yl: 'Höhe in cm', xs: [0, 1, 2, 3, 4, 5, 6, 7, 8], f: x => 20 - 2.5 * x,
            gl: 'h = 20 - 2{,}5 \\cdot t', xv: 't', yv: 'h', ymax: 20, line: true },
        temp: { l: 'Temperatur', wort: 'An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', xl: 'Uhrzeit', yl: 'Temperatur in °C', xs: [6, 8, 10, 12, 14, 16, 18, 20], ys: [4, 6, 10, 14, 15, 13, 9, 7],
            gl: null, xv: 'Uhrzeit', yv: 'Temperatur', ymax: 16, line: false, x0: 6 },
        rad: { l: 'Fahrradverleih', wort: 'Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', xl: 'Leihzeit in h', yl: 'Preis in €', xs: [1, 2, 3, 4, 5, 6], f: x => 3 * x,
            gl: 'p = 3 \\cdot t', xv: 't', yv: 'p', ymax: 20, line: false }
    };
    W('darstellung6', function (box) {
        const S = { k: box.dataset.start || 'kerze', i: 2 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(DAR).map(k => [k, DAR[k].l]), S.k, v => { S.k = v; S.i = 2; rs.input.max = DAR[v].xs.length - 1; rs.set(S.i); render(); }, 'Zuordnung');
        const sl = div(box, '');
        const rs = range(sl, { label: 'Zeile wählen', min: 0, max: DAR[S.k].xs.length - 1, step: 1, value: S.i, fmt: v => String(DAR[S.k].xs[v]), onInput: v => { S.i = v; render(); } });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const D = DAR[S.k], ys = D.ys || D.xs.map(D.f), x0 = D.x0 || 0, xmax = D.xs[D.xs.length - 1];
            const X0 = 46, Y0 = 200, WX = 260, HY = 170, X = x => X0 + (x - x0) / (xmax - x0) * WX, Y = y => Y0 - y / D.ymax * HY;
            let s = '';
            D.xs.forEach(x => { s += line([X(x), Y0], [X(x), Y0 - HY], 'stroke:rgba(127,216,238,0.08)') + txt([X(x), Y0 + 18], String(x), 'd-num'); });
            for (let gy = 0; gy <= D.ymax; gy += 4) s += line([X0, Y(gy)], [X0 + WX, Y(gy)], 'stroke:rgba(127,216,238,0.08)') + '<text class="d-num" x="' + (X0 - 7) + '" y="' + f1(Y(gy) + 5) + '" text-anchor="end">' + gy + '</text>';
            s += line([X0, Y0], [X0 + WX + 8, Y0], 'stroke:' + TXT + ';stroke-width:1.6') + line([X0, Y0], [X0, Y0 - HY - 8], 'stroke:' + TXT + ';stroke-width:1.6');
            s += '<text class="d-unit" x="' + (X0 + WX) + '" y="' + (Y0 + 36) + '" text-anchor="end">' + D.xl + '</text><text class="d-unit" x="' + (X0 + 4) + '" y="' + (Y0 - HY - 12) + '">' + D.yl + '</text>';
            if (D.line) s += line([X(D.xs[0]), Y(ys[0])], [X(xmax), Y(ys[ys.length - 1])], 'stroke:' + VIO + ';stroke-width:2;stroke-dasharray:6 5');
            else if (S.k === 'temp') s += '<polyline points="' + D.xs.map((x, i) => f1(X(x)) + ',' + f1(Y(ys[i]))).join(' ') + '" style="fill:none;stroke:' + VIO + ';stroke-width:1.6;stroke-dasharray:4 5"/>';
            D.xs.forEach((x, i) => { s += circle([X(x), Y(ys[i])], i === S.i ? 7 : 4.5, 'fill:' + (i === S.i ? LAM : CY) + ';stroke:#0a1426;stroke-width:1.5'); });
            pic.innerHTML = svg(330, 240, 'Diagramm: ' + D.wort, s);
            // on paper a long table loses every second column, so it fits the narrow column of the page
            const cols = D.xs.map((_, i) => i).filter(i => !printing() || D.xs.length <= 6 || i % 2 === 0);
            let tab = '<div class="b-table-wrap"><table class="b-table g-tab g6-tab"><tr><th>' + D.xv + '</th>' + cols.map(i => '<td' + (i === S.i ? ' class="b-hot"' : '') + '>' + fmt(D.xs[i]) + '</td>').join('') + '</tr>' +
                '<tr><th>' + D.yv + '</th>' + cols.map(i => '<td' + (i === S.i ? ' class="b-hot"' : '') + '>' + fmt(ys[i], 2) + '</td>').join('') + '</tr></table></div>';
            out.innerHTML = '<p style="margin:0"><b>Wortform:</b> ' + D.wort + '</p><p style="margin:8px 0 4px"><b>Tabelle:</b></p>' + tab +
                '<p style="margin:8px 0 0"><b>Gleichung:</b> ' + (D.gl ? '$' + D.gl + '$' : 'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.') + '</p>' +
                '<p class="b-help" style="margin:8px 0 0">Gewählt: ' + D.xv + ' ' + fmt(D.xs[S.i]) + ' → ' + D.yv + ' ' + fmt(ys[S.i], 2) + '. ' +
                (D.line ? 'Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.' : S.k === 'temp' ? 'Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.' : 'Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- proportional or not ---------- */
    const PROP = {
        direkt: { l: 'direkt proportional', ask: 'Äpfel: 1 kg kostet 2,50 €', xl: 'Masse in kg', yl: 'Preis in €', xmax: 8, ymax: 20, step: 0.5, x: 3, f: x => 2.5 * x, rows: [1, 2, 4, 6], col: 'q' },
        indirekt: { l: 'indirekt proportional', ask: '24 Stück Kuchen werden gerecht verteilt', xl: 'Personen', yl: 'Stück pro Person', xmax: 12, ymax: 24, step: 1, x: 4, f: x => 24 / x, rows: [1, 2, 3, 6], col: 'p', xmin: 1 },
        weder: { l: 'keins von beiden', ask: 'Taxi: 3 € Grundgebühr und 2 € pro km', xl: 'Strecke in km', yl: 'Preis in €', xmax: 8, ymax: 20, step: 0.5, x: 3, f: x => 3 + 2 * x, rows: [1, 2, 4, 6], col: 'q' }
    };
    W('proportional6', function (box) {
        const S = { m: box.dataset.mode || 'direkt' };
        S.x = PROP[S.m].x;
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['direkt', 'Äpfel'], ['indirekt', 'Kuchen'], ['weder', 'Taxi']], S.m, v => { S.m = v; S.x = PROP[v].x; render(); }, 'Beispiel');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 320);
        const X0 = 46, Y0 = 210, WX = 260, HY = 180;
        dragSVG(pic, (i, x) => {
            const P = PROP[S.m], v = Math.round((x - X0) / WX * P.xmax / P.step) * P.step;
            S.x = Math.min(P.xmax, Math.max(P.xmin || 0, v)); render();
        });
        function render() {
            const P = PROP[S.m], X = x => X0 + x / P.xmax * WX, Y = y => Y0 - y / P.ymax * HY;
            let s = '';
            for (let gx = 0; gx <= P.xmax; gx += P.xmax > 10 ? 2 : 1) s += line([X(gx), Y0], [X(gx), Y0 - HY], 'stroke:rgba(127,216,238,0.08)') + txt([X(gx), Y0 + 18], String(gx), 'd-num');
            for (let gy = 0; gy <= P.ymax; gy += 4) s += line([X0, Y(gy)], [X0 + WX, Y(gy)], 'stroke:rgba(127,216,238,0.08)') + '<text class="d-num" x="' + (X0 - 7) + '" y="' + f1(Y(gy) + 5) + '" text-anchor="end">' + gy + '</text>';
            s += line([X0, Y0], [X0 + WX + 8, Y0], 'stroke:' + TXT + ';stroke-width:1.6') + line([X0, Y0], [X0, Y0 - HY - 8], 'stroke:' + TXT + ';stroke-width:1.6');
            s += '<text class="d-unit" x="' + (X0 + WX) + '" y="' + (Y0 + 36) + '" text-anchor="end">' + P.xl + '</text><text class="d-unit" x="' + (X0 + 4) + '" y="' + (Y0 - HY - 12) + '">' + P.yl + '</text>';
            let d = '';
            const a = P.xmin || 0;
            for (let i = 0; i <= 80; i++) { const x = a + (P.xmax - a) * i / 80; d += (i ? 'L' : 'M') + f1(X(x)) + ' ' + f1(Y(P.f(x))); }
            s += '<path d="' + d + '" style="fill:none;stroke:' + VIO + ';stroke-width:2;stroke-dasharray:6 5"/>';
            P.rows.forEach(x => { s += circle([X(x), Y(P.f(x))], 5, 'fill:' + CY + ';stroke:#0a1426;stroke-width:1.5'); });
            s += handle([X(S.x), Y(P.f(S.x))], 0, LAM);
            pic.innerHTML = svg(330, 250, 'Graph der Zuordnung ' + P.ask, s, ' class="g6-graph"');
            if (hero) return;
            const xs = [...new Set(P.rows.concat([S.x]))].sort((u, v) => u - v);
            const k = P.col === 'q' ? 'y : x' : 'x \\cdot y';
            let tab = '<div class="b-table-wrap"><table class="b-table g-tab g6-tab"><tr><th>$x$</th><th>$y$</th><th>$' + k + '$</th></tr>';
            xs.forEach(x => {
                const y = P.f(x), c = P.col === 'q' ? (x ? y / x : NaN) : x * y;
                tab += '<tr' + (x === S.x ? ' class="on"' : '') + '><td>' + fmt(x, 2) + '</td><td>' + fmt(y, 2) + '</td><td>' + (isNaN(c) ? '–' : fmt(c, 2)) + '</td></tr>';
            });
            tab += '</table></div>';
            const verdict = S.m === 'direkt' ? 'Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.' :
                S.m === 'indirekt' ? 'Das Produkt $x \\cdot y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.' :
                    'Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.';
            out.innerHTML = '<p style="margin:0">' + P.ask + '. Zieh den gelben Punkt.</p>' + tab + '<p class="b-help" style="margin:8px 0 0">' + verdict + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- rule of three ---------- */
    const DREI = [
        { l: 'Äpfel', q: '3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?', u: ['kg', '€'], r: [[3, 7.5], [1, 2.5], [5, 12.5]], op: [[': 3', ': 3'], ['· 5', '· 5']], kind: 'direkt', a: '5 kg Äpfel kosten 12,50 €.', d: 2 },
        { l: 'Pumpen', q: '4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?', u: ['Pumpen', 'h'], r: [[4, 6], [1, 24], [3, 8]], op: [[': 4', '· 4'], ['· 3', ': 3']], kind: 'indirekt', a: '3 Pumpen brauchen 8 Stunden.' },
        { l: 'Hefte', q: '5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?', u: ['Hefte', '€'], r: [[5, 4], [1, 0.8], [8, 6.4]], op: [[': 5', ': 5'], ['· 8', '· 8']], kind: 'direkt', a: '8 Hefte kosten 6,40 €.', d: 2 },
        { l: 'Futter', q: 'Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?', u: ['Kaninchen', 'Tage'], r: [[12, 10], [1, 120], [8, 15]], op: [[': 12', '· 12'], ['· 8', ': 8']], kind: 'indirekt', a: 'Für 8 Kaninchen reicht das Futter 15 Tage.' }
    ];
    W('dreisatz6', function (box) {
        const S = { t: 0, step: 0 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, DREI.map((t, i) => [String(i), t.l]), '0', v => { S.t = +v; S.step = 0; render(); }, 'Aufgabe');
        const btn = buttons(box, [['next', 'Nächster Schritt', 'b-go'], ['reset', 'Von vorn']], a => { S.step = a === 'next' ? Math.min(S.step + 1, 3) : 0; render(); });
        const out = div(box, 'b-out');
        if (printing()) S.step = 3;
        function render() {
            const T = DREI[S.t], money = v => T.d ? v.toFixed(2).replace('.', ',') : fmt(v);
            let g = '<div class="g6-ds">';
            for (let i = 0; i <= Math.min(S.step, 2); i++) {
                if (i) g += '<span class="g6-ds-op">↓ ' + T.op[i - 1][0] + '</span><span></span><span></span><span class="g6-ds-op">↓ ' + T.op[i - 1][1] + '</span>';
                g += '<span></span><span class="g6-ds-v">' + fmt(T.r[i][0]) + ' ' + T.u[0] + '</span><span class="g6-ds-v' + (i === 2 ? ' g6-ds-res' : '') + '">' + money(T.r[i][1]) + ' ' + T.u[1] + '</span><span></span>';
            }
            g += '</div>';
            const why = T.kind === 'direkt' ? 'direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.' : 'indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.';
            out.innerHTML = '<p style="margin:0 0 8px"><b>' + T.q + '</b></p>' + g +
                '<p class="b-help" style="margin:8px 0 0">' + ['Schritt 1: Schreib auf, was du weißt.', 'Schritt 2: Rechne auf eins zurück. ' + why, 'Schritt 3: Rechne auf die gesuchte Menge hoch.', '<b>Antwort:</b> ' + T.a][S.step] + '</p>';
            btn.querySelector('[data-a="next"]').disabled = S.step >= 3;
        }
        render();
    });

    /* ---------- triangle geometry helpers ---------- */
    const ang = (V, P, Q) => { const u = sub(P, V), w = sub(Q, V); return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (len(u) * len(w))))) / DEG; };
    // round three angles that add up to 180° so that the rounded ones do too (largest remainder)
    function round180(a) {
        const fl = a.map(Math.floor), rest = 180 - fl.reduce((s, x) => s + x, 0);
        a.map((x, i) => [x - Math.floor(x), i]).sort((p, q) => q[0] - p[0]).slice(0, rest).forEach(([, i]) => fl[i]++);
        return fl;
    }
    // the label of a vertex, pushed away from the centroid
    function vlabel(P, Cn, s, d) { const v = sub(P, Cn), l = len(v) || 1; return txt([P[0] + v[0] / l * (d || 18), P[1] + v[1] / l * (d || 18) + 5], s, 'g-pt'); }
    function slabel(P, Q, Cn, s) { const m = mid(P, Q), v = sub(m, Cn), l = len(v) || 1; return txt([m[0] + v[0] / l * 14, m[1] + v[1] / l * 14 + 5], s, 'g-side'); }
    const clampPt = (x, y, w, h) => [Math.max(14, Math.min(w - 14, x)), Math.max(14, Math.min(h - 14, y))];

    /* ---------- the angle sum ---------- */
    W('winkelsumme6', function (box) {
        const S = { P: [[44, 220], [300, 220], [196, 64]], proof: box.dataset.hero != null || box.dataset.mode === 'beweis' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['0', 'Dreieck'], ['1', 'Beweisfigur']], S.proof ? '1' : '0', v => { S.proof = v === '1'; render(); }, 'Ansicht');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 320);
        dragSVG(pic, (i, x, y) => {
            const old = S.P[i];
            S.P[i] = clampPt(x, y, 340, 260);
            const [A, Bv, C] = S.P, area = Math.abs((Bv[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (Bv[1] - A[1])) / 2;
            if (area < 400) S.P[i] = old;
            render();
        });
        function render() {
            const [A, Bv, C] = S.P, Cn = mul(add(add(A, Bv), C), 1 / 3);
            const al = ang(A, Bv, C), be = ang(Bv, C, A), ga = 180 - al - be, [ra, rb, rg] = round180([al, be, ga]);
            let s = '';
            if (S.proof) {
                const d = mul(sub(Bv, A), 1 / len(sub(Bv, A)));
                s += line(add(C, mul(d, -400)), add(C, mul(d, 400)), 'stroke:' + TXT + ';stroke-width:1.4;stroke-dasharray:7 6;opacity:0.7');
                s += arc(C, add(C, mul(d, -50)), A, 30, fill(LAM, 0.28)) + arc(C, Bv, add(C, mul(d, 50)), 30, fill(CY, 0.28));
            }
            s += arc(A, Bv, C, 34, fill(LAM, 0.28)) + arc(Bv, C, A, 34, fill(CY, 0.28)) + arc(C, A, Bv, 26, fill(PHI, 0.32));
            s += poly([A, Bv, C], 'fill:rgba(127,216,238,0.05);stroke:' + TXT + ';stroke-width:2.2;stroke-linejoin:round');
            s += vlabel(A, Cn, 'A') + vlabel(Bv, Cn, 'B') + vlabel(C, Cn, 'C', 22);
            const inA = (V, P, Q, r) => { const u = sub(P, V), w = sub(Q, V), b = add(mul(u, 1 / len(u)), mul(w, 1 / len(w))); return add(V, mul(b, r / (len(b) || 1))); };
            s += txt(add(inA(A, Bv, C, 52), [0, 6]), 'α', 'g-ang') + txt(add(inA(Bv, C, A, 52), [0, 6]), 'β', 'g-ang') + txt(add(inA(C, A, Bv, 44), [0, 6]), 'γ', 'g-ang');
            if (S.proof) {
                const d = mul(sub(Bv, A), 1 / len(sub(Bv, A)));
                s += txt(add(inA(C, add(C, mul(d, -50)), A, 46), [0, 6]), 'α′', 'g-ang') + txt(add(inA(C, Bv, add(C, mul(d, 50)), 46), [0, 6]), 'β′', 'g-ang');
            }
            S.P.forEach((p, i) => { s += handle(p, i, [LAM, CY, PHI][i]); });
            pic.innerHTML = svg(340, 260, 'Dreieck mit seinen Innenwinkeln' + (S.proof ? ' und der Parallelen durch C' : ''), s);
            if (hero) return;
            out.innerHTML = '<p style="margin:0"><span class="g-lam">$\\alpha \\approx ' + ra + '^\\circ$</span> &nbsp; <span class="g-cy">$\\beta \\approx ' + rb + '^\\circ$</span> &nbsp; <span class="g-phi">$\\gamma \\approx ' + rg + '^\\circ$</span></p>' +
                '<p style="margin:0">$\\alpha + \\beta + \\gamma = 180^\\circ$</p>' +
                '<p class="b-help" style="margin:8px 0 0">' + (S.proof ? 'Die gestrichelte Linie ist parallel zu $\\overline{AB}$. $\\alpha\'$ und $\\alpha$ sind Wechselwinkel an Parallelen, also gleich groß. Ebenso $\\beta\'$ und $\\beta$. ' +
                    'Zusammen mit $\\gamma$ bilden $\\alpha\'$ und $\\beta\'$ einen gestreckten Winkel: $180^\\circ$.' : 'Zieh an den Ecken. Die Winkel ändern sich, ihre Summe bleibt. Die Werte sind auf ganze Grad gerundet.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- which pieces fix a triangle ---------- */
    const KON = {
        sss: { l: 'sss', p: [['a', 'Seite $a$', 1, 9, 0.5, 5, 'cm'], ['b', 'Seite $b$', 1, 9, 0.5, 4, 'cm'], ['c', 'Seite $c$', 1, 9, 0.5, 6, 'cm']] },
        sws: { l: 'sws', p: [['b', 'Seite $b$', 1, 7, 0.5, 4, 'cm'], ['al', 'Winkel $\\alpha$', 5, 175, 5, 50, '°'], ['c', 'Seite $c$', 1, 9, 0.5, 6, 'cm']] },
        wsw: { l: 'wsw', p: [['al', 'Winkel $\\alpha$', 5, 175, 5, 50, '°'], ['c', 'Seite $c$', 1, 9, 0.5, 6, 'cm'], ['be', 'Winkel $\\beta$', 5, 175, 5, 60, '°']] },
        ssw: { l: 'SsW', p: [['c', 'Seite $c$', 1, 9, 0.5, 5, 'cm'], ['a', 'Seite $a$ gegenüber $\\alpha$', 1, 9, 0.5, 6, 'cm'], ['al', 'Winkel $\\alpha$', 5, 175, 5, 40, '°']] },
        www: { l: 'www', p: [['al', 'Winkel $\\alpha$', 5, 175, 5, 50, '°'], ['be', 'Winkel $\\beta$', 5, 175, 5, 60, '°']] }
    };
    W('konstruktion6', function (box) {
        const S = { k: box.dataset.start || 'sss', v: {} };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(KON).map(k => [k, KON[k].l]), S.k, v => { S.k = v; build(); render(); }, 'Gegeben');
        const sl = div(box, '');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function build() {
            sl.innerHTML = ''; S.v = {};
            KON[S.k].p.forEach(([k, l, mn, mx, st, v0, u]) => {
                S.v[k] = v0;
                range(sl, { label: l, min: mn, max: mx, step: st, value: v0, fmt: v => fmt(v, 1) + (u === '°' ? '°' : ' ' + u), onInput: v => { S.v[k] = v; render(); } });
            });
            math(sl);
        }
        const k = 28, O = [36, 222];
        const P = p => [O[0] + p[0] * k, O[1] - p[1] * k];
        const pol = (r, a) => [r * Math.cos(a * DEG), r * Math.sin(a * DEG)];
        function tri(A, Bv, C, col, a) { return poly([P(A), P(Bv), P(C)], fill(col, a == null ? 0.18 : a) + ';stroke-width:2.2'); }
        function render() {
            const v = S.v;
            let s = '', o = '', n = 0;
            const ray = (from, deg, st) => line(P(from), P(add(from, pol(30, deg))), st || 'stroke:' + DIM + ';stroke-width:1.4;stroke-dasharray:6 5');
            const circ = (M, r) => circle(P(M), r * k, 'fill:none;stroke:' + CY + ';stroke-width:1.4;stroke-dasharray:5 5');
            const lab = (A, Bv, C) => { const Cn = mul(add(add(P(A), P(Bv)), P(C)), 1 / 3); return vlabel(P(A), Cn, 'A') + vlabel(P(Bv), Cn, 'B') + vlabel(P(C), Cn, 'C'); };
            if (S.k === 'sss') {
                const A = [0, 0], Bv = [v.c, 0], x = (v.b * v.b + v.c * v.c - v.a * v.a) / (2 * v.c), h2 = v.b * v.b - x * x;
                s += circ(A, v.b) + circ(Bv, v.a);
                if (h2 > 1e-9) { const C = [x, Math.sqrt(h2)]; s += tri(A, Bv, C, LAM) + lab(A, Bv, C); n = 1; }
                else s += line(P(A), P(Bv), 'stroke:' + TXT + ';stroke-width:2.2');
                const big = Math.max(v.a, v.b, v.c), rest = v.a + v.b + v.c - big;
                o = n ? '<p style="margin:0"><span class="g-ok">Genau ein Dreieck.</span> Die Kreise um $A$ mit $r = b$ und um $B$ mit $r = a$ schneiden sich oberhalb von $c$ in genau einem Punkt.</p>' :
                    '<p style="margin:0"><span class="g-warn">Kein Dreieck.</span> Die beiden kürzeren Seiten sind zusammen ' + fmt(rest, 1) + ' cm lang, die längste ' + fmt(big, 1) + ' cm. Die Kreise treffen sich nicht.</p>';
                o += '<p class="b-help" style="margin:8px 0 0"><b>Kongruenzsatz sss:</b> Wenn zwei Dreiecke in allen drei Seiten übereinstimmen, dann sind sie kongruent.</p>';
            } else if (S.k === 'sws') {
                const A = [0, 0], Bv = [v.c, 0], C = pol(v.b, v.al);
                s += ray(A, v.al) + tri(A, Bv, C, LAM) + lab(A, Bv, C); n = 1;
                o = '<p style="margin:0"><span class="g-ok">Genau ein Dreieck.</span> Auf dem Schenkel von $\\alpha$ trägt man $b$ ab. Der Endpunkt ist $C$.</p>' +
                    '<p class="b-help" style="margin:8px 0 0"><b>Kongruenzsatz sws:</b> Wenn zwei Dreiecke in zwei Seiten und dem eingeschlossenen Winkel übereinstimmen, dann sind sie kongruent.</p>';
            } else if (S.k === 'wsw') {
                const A = [0, 0], Bv = [v.c, 0];
                s += ray(A, v.al) + ray(Bv, 180 - v.be);
                if (v.al + v.be < 180) {
                    const ga = 180 - v.al - v.be, b = v.c * Math.sin(v.be * DEG) / Math.sin(ga * DEG), C = pol(b, v.al);
                    s += tri(A, Bv, C, LAM) + lab(A, Bv, C); n = 1;
                    o = '<p style="margin:0"><span class="g-ok">Genau ein Dreieck.</span> Die freien Schenkel der Winkel schneiden sich in $C$. $\\gamma = 180^\\circ - ' + v.al + '^\\circ - ' + v.be + '^\\circ = ' + ga + '^\\circ$</p>';
                } else {
                    s += line(P(A), P(Bv), 'stroke:' + TXT + ';stroke-width:2.2');
                    o = '<p style="margin:0"><span class="g-warn">Kein Dreieck.</span> $\\alpha + \\beta = ' + (v.al + v.be) + '^\\circ$. Für $\\gamma$ bleibt nichts übrig, die Schenkel laufen auseinander.</p>';
                }
                o += '<p class="b-help" style="margin:8px 0 0"><b>Kongruenzsatz wsw:</b> Wenn zwei Dreiecke in einer Seite und den beiden anliegenden Winkeln übereinstimmen, dann sind sie kongruent.</p>';
            } else if (S.k === 'ssw') {
                const A = [0, 0], Bv = [v.c, 0], ca = Math.cos(v.al * DEG), sa = Math.sin(v.al * DEG), disc = v.a * v.a - v.c * v.c * sa * sa;
                s += ray(A, v.al) + circ(Bv, v.a);
                const ts = disc < -1e-9 ? [] : disc < 1e-9 ? [v.c * ca] : [v.c * ca + Math.sqrt(disc), v.c * ca - Math.sqrt(disc)];
                const good = ts.filter(t => t > 1e-6);
                good.forEach((t, i) => { const C = pol(t, v.al); s += tri(A, Bv, C, i ? VIO : LAM, i ? 0.14 : 0.2) + vlabel(P(C), P(mul(add(add(A, Bv), C), 1 / 3)), good.length > 1 ? 'C' + (i ? '₂' : '₁') : 'C'); });
                s += vlabel(P(A), [P(A)[0] + 1, P(A)[1] - 1], 'A') + vlabel(P(Bv), [P(Bv)[0] - 1, P(Bv)[1] - 1], 'B');
                n = good.length;
                o = '<p style="margin:0">' + (n === 2 ? '<span class="g-warn">Zwei Dreiecke.</span> Der Kreis um $B$ schneidet den Schenkel zweimal. Die Angaben legen das Dreieck nicht fest.' :
                    n === 1 ? '<span class="g-ok">Genau ein Dreieck.</span>' + (v.a >= v.c ? ' Die gegenüberliegende Seite $a$ ist die größere: $a \\geq c$.' : ' Der Kreis berührt den Schenkel nur.') :
                        '<span class="g-warn">Kein Dreieck.</span> Der Kreis um $B$ erreicht den Schenkel nicht.') + '</p>' +
                    '<p class="b-help" style="margin:8px 0 0"><b>Kongruenzsatz SsW:</b> Wenn zwei Dreiecke in zwei Seiten und dem Winkel übereinstimmen, der der <b>größeren</b> Seite gegenüberliegt, dann sind sie kongruent.</p>';
            } else {
                if (v.al + v.be < 180) {
                    const ga = 180 - v.al - v.be;
                    [[6, VIO, 0.08], [4, LAM, 0.2]].forEach(([c, col, a]) => {
                        const b = c * Math.sin(v.be * DEG) / Math.sin(ga * DEG);
                        s += tri([0, 0], [c, 0], pol(b, v.al), col, a);
                    });
                    n = Infinity;
                    o = '<p style="margin:0"><span class="g-warn">Unendlich viele Dreiecke.</span> Alle haben dieselbe Form, aber verschiedene Größen. Drei Winkel legen kein Dreieck fest.</p>';
                } else o = '<p style="margin:0"><span class="g-warn">Kein Dreieck.</span> $\\alpha + \\beta$ ist schon $' + (v.al + v.be) + '^\\circ$.</p>';
                o += '<p class="b-help" style="margin:8px 0 0">Den dritten Winkel kennt man ohnehin: $\\gamma = 180^\\circ - \\alpha - \\beta$. Es fehlt eine Länge.</p>';
            }
            pic.innerHTML = svg(340, 250, 'Konstruktion aus ' + KON[S.k].l, s);
            out.innerHTML = o;
            math(out);
        }
        build();
        render();
    });

    /* ---------- three sticks: sides and angles ---------- */
    W('seitenwinkel6', function (box) {
        const S = { a: 4, b: 5, c: 7 };
        const sl = div(box, '');
        [['a', 'Seite $a$'], ['b', 'Seite $b$'], ['c', 'Seite $c$']].forEach(([k, l]) =>
            range(sl, { label: l, min: 1, max: 10, step: 0.5, value: S[k], fmt: v => fmt(v, 1) + ' cm', onInput: v => { S[k] = v; render(); } }));
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const { a, b, c } = S, sides = [['a', a], ['b', b], ['c', c]];
            const ok = a + b > c && a + c > b && b + c > a;
            let s = '', o = '';
            const chk = (p, q, r, P, Q, R) => '<p style="margin:0">$' + p + ' + ' + q + ' = ' + texNum(P + Q, 1) + (P + Q > R ? ' > ' : P + Q === R ? ' = ' : ' < ') + texNum(R, 1) + ' = ' + r + '$ ' +
                (P + Q > R ? '<span class="g-ok">✓</span>' : '<span class="g-warn">✗</span>') + '</p>';
            o += chk('a', 'b', 'c', a, b, c) + chk('a', 'c', 'b', a, c, b) + chk('b', 'c', 'a', b, c, a);
            if (ok) {
                const k = Math.min(30, 270 / c, 200 / Math.max(a, b)), x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(b * b - x * x);
                const A = [36, 214], Bv = [36 + c * k, 214], C = [36 + x * k, 214 - y * k];
                const minX = Math.min(A[0], C[0]); if (minX < 20) { const dx = 20 - minX; A[0] += dx; Bv[0] += dx; C[0] += dx; }
                const al = ang(A, Bv, C), be = ang(Bv, C, A), ga = 180 - al - be, ws = [al, be, ga];
                const iMax = ws.indexOf(Math.max(...ws)), iMin = ws.indexOf(Math.min(...ws));
                const iso = Math.abs(a - b) < 1e-9 || Math.abs(b - c) < 1e-9 || Math.abs(a - c) < 1e-9;
                const col = i => i === iMax ? LAM : i === iMin ? CY : DIM;
                const V = [A, Bv, C], opp = [[Bv, C], [C, A], [A, Bv]];
                s += arc(A, Bv, C, 30, fill(col(0), 0.3)) + arc(Bv, C, A, 30, fill(col(1), 0.3)) + arc(C, A, Bv, 26, fill(col(2), 0.3));
                s += poly(V, 'fill:none;stroke:' + TXT + ';stroke-width:1.4');
                opp.forEach(([p, q], i) => { if (i === iMax || i === iMin) s += line(p, q, 'stroke:' + col(i) + ';stroke-width:4;stroke-linecap:round'); });
                const Cn = mul(add(add(A, Bv), C), 1 / 3);
                s += vlabel(A, Cn, 'A') + vlabel(Bv, Cn, 'B') + vlabel(C, Cn, 'C') + slabel(Bv, C, Cn, 'a') + slabel(C, A, Cn, 'b') + slabel(A, Bv, Cn, 'c');
                const r = round180(ws), nm = ['\\alpha', '\\beta', '\\gamma'], sn = ['a', 'b', 'c'];
                o += '<p style="margin:8px 0 0">$\\alpha \\approx ' + r[0] + '^\\circ$, $\\beta \\approx ' + r[1] + '^\\circ$, $\\gamma \\approx ' + r[2] + '^\\circ$</p>' +
                    '<p class="b-help" style="margin:8px 0 0">' + (iMax !== iMin ? 'Der <span class="g-lam">längsten Seite $' + sn[iMax] + '$</span> liegt der <span class="g-lam">größte Winkel $' + nm[iMax] + '$</span> gegenüber, der <span class="g-cy">kürzesten $' + sn[iMin] + '$</span> der kleinste. ' : 'Alle Seiten gleich lang: alle Winkel $60^\\circ$. ') +
                    (iso && iMax !== iMin ? 'Zwei Seiten sind gleich lang: Das Dreieck ist gleichschenklig, und die Basiswinkel sind gleich groß.' : '') + '</p>';
            } else {
                const order = sides.slice().sort((p, q) => q[1] - p[1]), big = order[0][1], p = order[1][1], q = order[2][1], k = Math.min(30, 280 / big);
                const A = [30, 150], Bv = [30 + big * k, 150];
                s += line(A, Bv, 'stroke:' + TXT + ';stroke-width:3;stroke-linecap:round') + txt([mid(A, Bv)[0], 176], order[0][0], 'g-side');
                s += line(A, [A[0] + p * k, 150 - 30], 'stroke:' + LAM + ';stroke-width:3;stroke-linecap:round') + txt([A[0] + p * k / 2, 122], order[1][0], 'g-side');
                s += line(Bv, [Bv[0] - q * k, 150 - 30], 'stroke:' + CY + ';stroke-width:3;stroke-linecap:round') + txt([Bv[0] - q * k / 2, 122], order[2][0], 'g-side');
                s += dot(A) + dot(Bv);
                o += '<p class="b-help" style="margin:8px 0 0">' + (p + q === big ? 'Die beiden kürzeren Stäbe sind zusammen genau so lang wie der längste: Sie liegen flach auf ihm. Das ist kein Dreieck.' :
                    'Die beiden kürzeren Stäbe reichen nicht bis zueinander, egal wie man sie dreht.') + ' <b>Dreiecksungleichung:</b> Zwei Seiten zusammen müssen immer länger sein als die dritte.</p>';
            }
            pic.innerHTML = svg(340, 240, ok ? 'Dreieck aus drei Stäben' : 'Die Stäbe ergeben kein Dreieck', s);
            out.innerHTML = o;
            math(out);
        }
        render();
    });

    /* ---------- special lines of a triangle ---------- */
    const LIN = {
        ms: { l: 'Mittelsenkrechten', pt: 'U', what: 'Umkreismittelpunkt' },
        wh: { l: 'Winkelhalbierende', pt: 'I', what: 'Inkreismittelpunkt' },
        hh: { l: 'Höhen', pt: 'H', what: 'Höhenschnittpunkt' },
        sh: { l: 'Seitenhalbierende', pt: 'S', what: 'Schwerpunkt' }
    };
    W('linien6', function (box) {
        const S = { P: [[50, 216], [296, 216], [130, 60]], m: box.dataset.mode || 'ms' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(LIN).map(k => [k, LIN[k].l]), S.m, v => { S.m = v; render(); }, 'Linien');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 320);
        dragSVG(pic, (i, x, y) => {
            const old = S.P[i];
            S.P[i] = clampPt(x, y, 340, 270);
            const [A, Bv, C] = S.P;
            if (Math.abs((Bv[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (Bv[1] - A[1])) < 800) S.P[i] = old;
            render();
        });
        const longLine = (p, d, st) => { const u = mul(d, 900 / (len(d) || 1)); return line(sub(p, u), add(p, u), st); };
        const perp = d => [-d[1], d[0]];
        function render() {
            const [A, Bv, C] = S.P, Cn = mul(add(add(A, Bv), C), 1 / 3);
            const a = len(sub(C, Bv)), b = len(sub(A, C)), c = len(sub(Bv, A));
            const al = ang(A, Bv, C), be = ang(Bv, C, A), ga = 180 - al - be, obtuse = Math.max(al, be, ga) > 90.05, right = Math.abs(Math.max(al, be, ga) - 90) <= 0.05;
            const D = 2 * (A[0] * (Bv[1] - C[1]) + Bv[0] * (C[1] - A[1]) + C[0] * (A[1] - Bv[1]));
            const sq = p => p[0] * p[0] + p[1] * p[1];
            const U = [(sq(A) * (Bv[1] - C[1]) + sq(Bv) * (C[1] - A[1]) + sq(C) * (A[1] - Bv[1])) / D, (sq(A) * (C[0] - Bv[0]) + sq(Bv) * (A[0] - C[0]) + sq(C) * (Bv[0] - A[0])) / D];
            const st = 'stroke:' + CY + ';stroke-width:1.6', V = [A, Bv, C], opp = [[Bv, C], [C, A], [A, Bv]];
            let s = '', X, o = '';
            if (S.m === 'ms') {
                opp.forEach(([p, q]) => { s += longLine(mid(p, q), perp(sub(q, p)), st) + rightMark(mid(p, q), q, add(mid(p, q), perp(sub(q, p))), 9); });
                s += circle(U, len(sub(A, U)), 'fill:none;stroke:' + VIO + ';stroke-width:1.8;stroke-dasharray:6 5');
                X = U;
                o = 'Jeder Punkt der Mittelsenkrechten ist von den beiden Ecken gleich weit entfernt. Ihr Schnittpunkt $U$ ist von <b>allen drei Ecken</b> gleich weit entfernt: der Mittelpunkt des Umkreises.' +
                    (obtuse ? ' Bei einem stumpfwinkligen Dreieck liegt $U$ außerhalb.' : right ? ' Beim rechtwinkligen Dreieck liegt $U$ genau auf der längsten Seite.' : ' Bei einem spitzwinkligen Dreieck liegt $U$ innen.');
            } else if (S.m === 'wh') {
                V.forEach((P, i) => { const Q = V[(i + 1) % 3], R = V[(i + 2) % 3]; s += longLine(P, add(mul(sub(Q, P), 1 / len(sub(Q, P))), mul(sub(R, P), 1 / len(sub(R, P)))), st); });
                const I = mul(add(add(mul(A, a), mul(Bv, b)), mul(C, c)), 1 / (a + b + c));
                const area = Math.abs((Bv[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (Bv[1] - A[1])) / 2;
                s += circle(I, 2 * area / (a + b + c), 'fill:none;stroke:' + VIO + ';stroke-width:1.8;stroke-dasharray:6 5');
                X = I;
                o = 'Jeder Punkt einer Winkelhalbierenden ist von den beiden Schenkeln gleich weit entfernt. Ihr Schnittpunkt $I$ ist von <b>allen drei Seiten</b> gleich weit entfernt: der Mittelpunkt des Inkreises. Er liegt immer innen.';
            } else if (S.m === 'hh') {
                V.forEach((P, i) => {
                    const [p, q] = opp[i], d = sub(q, p), t = ((P[0] - p[0]) * d[0] + (P[1] - p[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]), F = add(p, mul(d, t));
                    if (t < 0 || t > 1) s += longLine(p, d, 'stroke:' + DIM + ';stroke-width:1.2;stroke-dasharray:5 5');
                    s += longLine(P, perp(d), st) + (len(sub(P, F)) > 12 ? rightMark(F, P, len(sub(q, F)) > len(sub(p, F)) ? q : p, 8) : '');
                });
                X = [A[0] + Bv[0] + C[0] - 2 * U[0], A[1] + Bv[1] + C[1] - 2 * U[1]];
                o = 'Eine Höhe ist das Lot von einer Ecke auf die gegenüberliegende Seite. Die drei Höhen schneiden sich in einem Punkt $H$.' +
                    (obtuse ? ' Beim stumpfwinkligen Dreieck liegt $H$ außerhalb: Man muss die Seiten verlängern (gestrichelt).' : right ? ' Beim rechtwinkligen Dreieck ist $H$ die Ecke mit dem rechten Winkel.' : '');
            } else {
                V.forEach((P, i) => { const [p, q] = opp[i]; s += line(P, mid(p, q), st) + dot(mid(p, q), CY, 3.5); });
                X = Cn;
                o = 'Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Ihr Schnittpunkt $S$ ist der Schwerpunkt: Ein Dreieck aus Pappe kann man dort auf einer Nadelspitze balancieren.';
            }
            s += poly(V, 'fill:rgba(245,194,66,0.08);stroke:' + TXT + ';stroke-width:2.2;stroke-linejoin:round');
            s += vlabel(A, Cn, 'A') + vlabel(Bv, Cn, 'B') + vlabel(C, Cn, 'C', 22);
            if (X && isFinite(X[0])) s += dot(X, LAM, 5.5) + txt([X[0] + 13, X[1] - 9], LIN[S.m].pt, 'g-pt');
            V.forEach((p, i) => { s += handle(p, i, [LAM, CY, PHI][i]); });
            pic.innerHTML = svg(340, 270, 'Dreieck mit seinen ' + LIN[S.m].l, s);
            if (hero) return;
            out.innerHTML = '<p style="margin:0"><b>' + LIN[S.m].l + '</b> · Schnittpunkt $' + LIN[S.m].pt + '$: ' + LIN[S.m].what + '</p><p class="b-help" style="margin:8px 0 0">' + o + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- areas by cutting and moving ---------- */
    const FL = {
        para: { l: 'Parallelogramm', p: [['g', 'Grundseite $g$', 6], ['h', 'Höhe $h$', 3]] },
        drei: { l: 'Dreieck', p: [['g', 'Grundseite $g$', 6], ['h', 'Höhe $h$', 4]] },
        trap: { l: 'Trapez', p: [['a', 'Seite $a$', 6], ['c', 'Seite $c$', 3], ['h', 'Höhe $h$', 3]] },
        drach: { l: 'Drachenviereck', p: [['e', 'Diagonale $e$', 5], ['f', 'Diagonale $f$', 6]] }
    };
    W('flaeche6', function (box) {
        const S = { m: box.dataset.mode || 'para', t: printing() || box.dataset.hero != null ? 0.6 : 0.5, v: {} };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(FL).map(k => [k, FL[k].l]), S.m, v => { S.m = v; build(); render(); }, 'Figur');
        const sl = div(box, ''), slT = div(box, '');
        range(slT, { label: 'Zerlegen und verschieben', min: 0, max: 1, step: 0.01, value: S.t, fmt: v => Math.round(v * 100) + ' %', onInput: v => { S.t = v; render(); } });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, sl, slT, out], 320);
        function build() {
            sl.innerHTML = ''; S.v = {};
            FL[S.m].p.forEach(([k, l, v0]) => { S.v[k] = v0; range(sl, { label: l, min: 1, max: 8, step: 0.5, value: v0, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.v[k] = v; render(); } }); });
            math(sl);
        }
        const rot = (P, M, th) => { const d = sub(P, M), c = Math.cos(th), s = Math.sin(th); return [M[0] + c * d[0] - s * d[1], M[1] + s * d[0] + c * d[1]]; };
        // the shapes at time t in cm (y up): fixed parts and moving parts
        function shapes(t) {
            const v = S.v, out = { fix: [], mov: [], ghost: [] };
            if (S.m === 'para') {
                const s = 2, g = v.g, h = v.h, F = [s, 0];
                out.fix.push([[s, 0], [g, 0], [g + s, h], [s, h]]);
                out.mov.push([[0, 0], F, [s, h]].map(p => add(p, [t * g, 0])));
                out.ghost.push([[0, 0], [g, 0], [g + s, h], [s, h]]);
            } else if (S.m === 'drei') {
                const g = v.g, h = v.h, A = [0, 0], Bv = [g, 0], C = [g * 0.3, h], M = mid(Bv, C);
                out.fix.push([A, Bv, C]);
                out.mov.push([A, Bv, C].map(p => rot(p, M, t * Math.PI)));
            } else if (S.m === 'trap') {
                const a = v.a, c = Math.min(v.c, 8), h = v.h, s = (a - c) / 2, A = [0, 0], Bv = [a, 0], C = [s + c, h], D = [s, h], M = mid(Bv, C);
                out.fix.push([A, Bv, C, D]);
                out.mov.push([A, Bv, C, D].map(p => rot(p, M, t * Math.PI)));
            } else {
                const e = v.e, f = v.f, p = f * 0.35, K = [[e / 2, 0], [e, p], [e / 2, f], [0, p]];
                out.fix.push(K);
                out.ghost.push([[0, 0], [e, 0], [e, f], [0, f]]);
                // the four corners of the rectangle are copies of the four inner triangles: flip them out
                const Mk = [e / 2, p];
                [[K[0], K[1]], [K[1], K[2]], [K[2], K[3]], [K[3], K[0]]].forEach(([P, Q]) => {
                    const m = mid(P, Q);
                    out.mov.push([P, Q, Mk].map(X => rot(X, m, t * Math.PI)));
                });
            }
            return out;
        }
        function render() {
            const v = S.v;
            // one scale for the whole movement: the box around every state
            let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
            for (let i = 0; i <= 10; i++) { const sh = shapes(i / 10); [].concat(sh.fix, sh.mov, sh.ghost).forEach(pl => pl.forEach(([x, y]) => { mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); })); }
            const k = Math.min(300 / (mxx - mnx), 190 / (mxy - mny), 40), Wd = 340, Ht = (mxy - mny) * k + 50;
            const T = p => [20 + (p[0] - mnx) * k + (300 - (mxx - mnx) * k) / 2, 25 + (mxy - p[1]) * k];
            const sh = shapes(S.t);
            let s = '';
            sh.ghost.forEach(pl => { s += poly(pl.map(T), 'fill:none;stroke:' + DIM + ';stroke-width:1.2;stroke-dasharray:5 5'); });
            sh.fix.forEach(pl => { s += poly(pl.map(T), fill(LAM, 0.24) + ';stroke-width:2'); });
            sh.mov.forEach(pl => { s += poly(pl.map(T), fill(CY, 0.24) + ';stroke-width:2'); });
            pic.innerHTML = svg(Wd, Ht, FL[S.m].l + ': zerlegen und verschieben', s);
            if (hero) return;
            let o = '';
            if (S.m === 'para') o = 'Das abgeschnittene Dreieck rückt nach rechts. Aus dem Parallelogramm wird ein Rechteck mit derselben Grundseite und derselben Höhe.' +
                '<br>$A = g \\cdot h = ' + texNum(v.g, 1) + ' \\cdot ' + texNum(v.h, 1) + ' = ' + texNum(v.g * v.h, 2) + '\\,\\text{cm}^2$';
            else if (S.m === 'drei') o = 'Eine Kopie des Dreiecks dreht sich um die Mitte einer Seite. Zusammen ergeben beide ein Parallelogramm. Das Dreieck ist die Hälfte davon.' +
                '<br>$A = \\tfrac12 \\cdot g \\cdot h = \\tfrac12 \\cdot ' + texNum(v.g, 1) + ' \\cdot ' + texNum(v.h, 1) + ' = ' + texNum(v.g * v.h / 2, 2) + '\\,\\text{cm}^2$';
            else if (S.m === 'trap') o = 'Eine Kopie des Trapezes dreht sich um die Mitte eines Schenkels. Zusammen ergeben beide ein Parallelogramm mit der Grundseite $a + c$.' +
                '<br>$A = \\tfrac12 \\cdot (a + c) \\cdot h = \\tfrac12 \\cdot ' + texNum(v.a + Math.min(v.c, 8), 1) + ' \\cdot ' + texNum(v.h, 1) + ' = ' + texNum((v.a + Math.min(v.c, 8)) * v.h / 2, 2) + '\\,\\text{cm}^2$';
            else o = 'Die vier Dreiecke im Drachen klappen nach außen. Sie füllen das Rechteck aus den beiden Diagonalen genau zur Hälfte.' +
                '<br>$A = \\tfrac12 \\cdot e \\cdot f = \\tfrac12 \\cdot ' + texNum(v.e, 1) + ' \\cdot ' + texNum(v.f, 1) + ' = ' + texNum(v.e * v.f / 2, 2) + '\\,\\text{cm}^2$';
            out.innerHTML = '<p style="margin:0">' + o + '</p>';
            math(out);
        }
        build();
        render();
    });

    /* ---------- the house of quadrilaterals ---------- */
    const VK = {
        Q: { l: ['Quadrat'], p: [170, 26], up: ['R', 'Ra'], f: [[0, 0], [1, 0], [1, 1], [0, 1]],
             pr: ['2 Paare', 'alle vier', 'alle vier', '4', 'ja', 'ja', 'ja'] },
        R: { l: ['Rechteck'], p: [96, 82], up: ['P', 'GT'], f: [[0, 0], [1.6, 0], [1.6, 0.9], [0, 0.9]],
             pr: ['2 Paare', 'je zwei gegenüber', 'alle vier', '2', 'ja', 'nein', 'ja'] },
        Ra: { l: ['Raute'], fem: true, p: [244, 82], up: ['P', 'D'], f: [[0, 0], [1, 0], [1.5, 0.866], [0.5, 0.866]],
              pr: ['2 Paare', 'alle vier', 'keine nötig', '2', 'ja', 'ja', 'nein'] },
        P: { l: ['Parallelogramm'], p: [170, 140], up: ['T'], f: [[0, 0], [1.4, 0], [1.9, 0.8], [0.5, 0.8]],
             pr: ['2 Paare', 'je zwei gegenüber', 'keine nötig', '0', 'ja', 'nein', 'nein'] },
        GT: { l: ['gleichschenkliges', 'Trapez'], p: [72, 196], up: ['T'], f: [[0, 0], [1.8, 0], [1.3, 0.8], [0.5, 0.8]],
              pr: ['1 Paar', 'die beiden Schenkel', 'keine nötig', '1', 'nein', 'nein', 'ja'] },
        D: { l: ['Drachenviereck'], p: [272, 196], up: ['V'], f: [[0.6, 0], [1.2, 0.45], [0.6, 1.4], [0, 0.45]],
             pr: ['keins nötig', 'je zwei benachbarte', 'keine nötig', '1', 'nur eine die andere', 'ja', 'nein'] },
        T: { l: ['Trapez'], p: [150, 252], up: ['V'], f: [[0, 0], [1.9, 0], [1.4, 0.8], [0.3, 0.8]],
             pr: ['mindestens 1', 'keine nötig', 'keine nötig', '0', 'nein', 'nein', 'nein'] },
        V: { l: ['Viereck'], p: [170, 306], up: [], f: [[0, 0], [1.7, 0.15], [1.3, 0.95], [0.25, 0.7]],
             pr: ['keins nötig', 'keine nötig', 'keine nötig', '0', 'nein', 'nein', 'nein'] }
    };
    const VK_PROPS = ['parallele Seiten', 'gleich lange Seiten', 'rechte Winkel', 'Symmetrieachsen', 'Diagonalen halbieren sich', 'Diagonalen senkrecht', 'Diagonalen gleich lang'];
    W('vierecke6', function (box) {
        const S = { n: box.dataset.start || 'R' };
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), right = div(two, '');
        const shape = div(right, 'b-svgbox g-svg'), out = div(right, 'b-out');
        pic.addEventListener('click', e => { const g = e.target.closest('[data-n]'); if (g) { S.n = g.dataset.n; render(); } });
        pic.addEventListener('keydown', e => { const g = e.target.closest('[data-n]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); S.n = g.dataset.n; render(); } });
        const ancestors = n => { const set = new Set([n]); const go = m => VK[m].up.forEach(u => { if (!set.has(u)) { set.add(u); go(u); } }); go(n); return set; };
        function render() {
            const anc = ancestors(S.n);
            let s = '';
            Object.keys(VK).forEach(n => VK[n].up.forEach(u => { s += line(VK[n].p, VK[u].p, 'stroke:' + (anc.has(n) && anc.has(u) ? LAM : DIM) + ';stroke-width:' + (anc.has(n) && anc.has(u) ? 2.4 : 1.2) + ';opacity:' + (anc.has(n) && anc.has(u) ? 1 : 0.5)); }));
            Object.keys(VK).forEach(n => {
                const N = VK[n], on = anc.has(n), me = n === S.n, w = Math.max(...N.l.map(t => t.length)) * 6.8 + 18, h = N.l.length * 16 + 12;
                s += '<g class="g6-node" data-n="' + n + '" tabindex="0" role="button" aria-label="' + N.l.join(' ') + '"><rect x="' + f1(N.p[0] - w / 2) + '" y="' + f1(N.p[1] - h / 2) + '" width="' + f1(w) + '" height="' + h + '" rx="8" style="' +
                    (me ? fill(LAM, 0.35) : on ? fill(LAM, 0.12) : 'fill:#0d1a30;stroke:' + DIM + ';stroke-width:1') + '"/>';
                N.l.forEach((t, i) => { s += '<text class="g6-nodetxt" x="' + N.p[0] + '" y="' + f1(N.p[1] - h / 2 + 20 + i * 16) + '" text-anchor="middle">' + t + '</text>'; });
                s += '</g>';
            });
            pic.innerHTML = svg(340, 330, 'Haus der Vierecke', s);
            const N = VK[S.n], xs = N.f.map(p => p[0]), ys = N.f.map(p => p[1]), k = Math.min(160 / (Math.max(...xs) - Math.min(...xs)), 90 / (Math.max(...ys) - Math.min(...ys)));
            const T = p => [20 + (p[0] - Math.min(...xs)) * k + (160 - (Math.max(...xs) - Math.min(...xs)) * k) / 2, 105 - (p[1] - Math.min(...ys)) * k];
            const F = N.f.map(T);
            shape.innerHTML = svg(200, 120, N.l.join(' '), line(F[0], F[2], 'stroke:' + CY + ';stroke-width:1.2;stroke-dasharray:4 4') + line(F[1], F[3], 'stroke:' + CY + ';stroke-width:1.2;stroke-dasharray:4 4') +
                poly(F, fill(LAM, 0.22) + ';stroke-width:2.2'));
            shape.style.maxWidth = '240px'; shape.style.margin = '0 auto 10px';
            const also = Object.keys(VK).filter(n => anc.has(n) && n !== S.n).map(n => (VK[n].fem ? 'eine ' : 'ein ') + VK[n].l.join(' '));
            let tab = '<div class="b-table-wrap"><table class="b-table g-tab g-props g6-props">';
            VK_PROPS.forEach((p, i) => { tab += '<tr><th>' + p + '</th><td>' + N.pr[i] + '</td></tr>'; });
            tab += '</table></div>';
            out.innerHTML = '<p style="margin:0">' + (also.length ? (N.fem ? 'Jede' : 'Jedes') + ' <b>' + N.l.join(' ') + '</b> ist auch ' + also.join(', ') + '.' :
                'Das <b>Viereck</b> steht ganz unten: Es braucht nur vier Ecken und vier Seiten, sonst nichts.') + '</p>' + tab +
                '<p class="b-help" style="margin:8px 0 0">Tipp auf ein Viereck im Haus. Was weiter unten steht, ist allgemeiner, was weiter oben steht, hat mehr Eigenschaften.</p>';
        }
        render();
    });

    /* ---------- prisms: cavalier perspective and net ---------- */
    const PRI = {
        drei: { l: 'Dreiecksprisma', base: a => [[0, 0], [a, 0], [0, 0.75 * a]], G: a => 0.375 * a * a },
        quader: { l: 'Quader', base: a => [[0, 0], [a, 0], [a, 0.5 * a], [0, 0.5 * a]], G: a => 0.5 * a * a },
        trapez: { l: 'Trapezprisma', base: a => [[0, 0], [a, 0], [0.75 * a, 0.5 * a], [0.25 * a, 0.5 * a]], G: a => 0.375 * a * a },
        // regular hexagon with side a / 2, flat at the bottom
        sechs: { l: 'Sechseckprisma', base: a => { const s = a / 2, r3 = Math.sqrt(3); return [[0.5 * s, 0], [1.5 * s, 0], [2 * s, r3 / 2 * s], [1.5 * s, r3 * s], [0.5 * s, r3 * s], [0, r3 / 2 * s]]; }, G: a => 3 * Math.sqrt(3) / 2 * (a / 2) * (a / 2) }
    };
    W('prisma6', function (box) {
        const S = { b: box.dataset.start || 'drei', view: box.dataset.view || 'schraeg', a: +(box.dataset.a || 4), h: +(box.dataset.h || 6) };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(PRI).map(k => [k, PRI[k].l]), S.b, v => { S.b = v; render(); }, 'Prisma');
        seg(ctr, [['schraeg', 'Schrägbild'], ['netz', 'Netz']], S.view, v => { S.view = v; render(); }, 'Ansicht');
        const sl = div(box, '');
        range(sl, { label: 'Grundkante $a$', min: 2, max: 8, step: 1, value: S.a, fmt: v => v + ' cm', onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Höhe $h$ des Prismas', min: 1, max: 10, step: 1, value: S.h, fmt: v => v + ' cm', onInput: v => { S.h = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, sl, out], 300);
        function render() {
            const P = PRI[S.b], a = S.a, h = S.h, base = P.base(a), n = base.length;
            const sides = base.map((p, i) => len(sub(base[(i + 1) % n], p))), u = sides.reduce((s, x) => s + x, 0), G = P.G(a);
            let s = '';
            if (S.view === 'schraeg') {
                const xs = base.map(p => p[0]), ys = base.map(p => p[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys), dq = h * 0.5 * Math.SQRT1_2;
                const k = Math.min(300 / (bw + dq), 210 / (bh + dq), 40), ox = 20 - Math.min(...xs) * k, oy = 230 + Math.min(...ys) * k;
                const F = base.map(p => [ox + p[0] * k, oy - p[1] * k]), v = [dq * k, -dq * k], E = prismEdges(F, v);
                s += poly(F, fill(LAM, 0.22) + ';stroke:none');
                E.dashed.forEach(([p, q]) => { s += line(p, q, 'stroke:' + DIM + ';stroke-width:1.5;stroke-dasharray:5 5'); });
                E.solid.forEach(([p, q]) => { s += line(p, q, 'stroke:' + TXT + ';stroke-width:2;stroke-linecap:round'); });
                s += txt([mid(F[0], F[1])[0], F[0][1] + 18], 'a', 'g-side');
                const r = E.back[1], m = mid(F[1], r);
                s += txt([m[0] + 12, m[1] + 14], 'h', 'g-side') + txt(mul(F.reduce((s2, p) => add(s2, p), [0, 0]), 1 / n), 'G', 'g-area');
                pic.innerHTML = svg(340, 250, P.l + ' im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang', s);
            } else {
                // mantle strip, the two bases attached to the first rectangle (cm, y up)
                const xsS = [0]; sides.forEach((L, i) => xsS.push(xsS[i] + L));
                const P0 = base[0], e = mul(sub(base[1], P0), 1 / sides[0]), nr = [-e[1], e[0]];
                const top = base.map(X => [(X[0] - P0[0]) * e[0] + (X[1] - P0[1]) * e[1], h + (X[0] - P0[0]) * nr[0] + (X[1] - P0[1]) * nr[1]]);
                const bot = top.map(p => [p[0], h - p[1]]);
                const all = top.concat(bot, [[0, 0], [u, h]]), mnx = Math.min(...all.map(p => p[0])), mxx = Math.max(...all.map(p => p[0])), mny = Math.min(...all.map(p => p[1])), mxy = Math.max(...all.map(p => p[1]));
                const k = Math.min(310 / (mxx - mnx), 230 / (mxy - mny), 30), Ht = (mxy - mny) * k + 20;
                const T = p => [15 + (p[0] - mnx) * k, 10 + (mxy - p[1]) * k];
                sides.forEach((L, i) => { s += poly([[xsS[i], 0], [xsS[i + 1], 0], [xsS[i + 1], h], [xsS[i], h]].map(T), fill(i % 2 ? CY : VIO, 0.16) + ';stroke-width:1.6'); });
                s += poly(top.map(T), fill(LAM, 0.26) + ';stroke-width:1.8') + poly(bot.map(T), fill(LAM, 0.26) + ';stroke-width:1.8');
                s += txt(add(T(mul(top.reduce((q, p) => add(q, p), [0, 0]), 1 / n)), [0, 7]), 'G', 'g-area') + txt(add(T(mul(bot.reduce((q, p) => add(q, p), [0, 0]), 1 / n)), [0, 7]), 'G', 'g-area');
                s += txt(add(T([u / 2, h / 2]), [0, 7]), 'M', 'g-area');
                pic.innerHTML = svg(340, Ht, 'Netz des ' + P.l + 's: zwei Grundflächen und der Mantel aus Rechtecken', s);
            }
            if (hero) return;
            // "=" when the value is exact to two decimals, "≈" when it was rounded (the hexagon, the trapezium's legs)
            const r = x => (Math.abs(Math.round(x * 100) - x * 100) < 1e-6 ? '= ' : '\\approx ') + texNum(x, 2);
            out.innerHTML = '<p style="margin:0">Grundfläche $G ' + r(G) + '\\,\\text{cm}^2$, Umfang der Grundfläche $u ' + r(u) + '\\,\\text{cm}$</p>' +
                '<p style="margin:0">Mantel $M = u \\cdot h ' + r(u * h) + '\\,\\text{cm}^2$</p>' +
                '<p style="margin:0">Oberfläche $O = 2 \\cdot G + M ' + r(2 * G + u * h) + '\\,\\text{cm}^2$</p>' +
                '<p style="margin:0">Volumen $V = G \\cdot h ' + r(G * h) + '\\,\\text{cm}^3$</p>' +
                '<p class="b-help" style="margin:8px 0 0">' + (S.view === 'schraeg' ? 'Kavalierperspektive: Die Grundfläche liegt vorn in wahrer Größe. Die Kanten nach hinten laufen unter $45^\\circ$ und sind halb so lang. Verdeckte Kanten sind gestrichelt.' :
                    'Das Netz besteht aus den beiden Grundflächen und dem Mantel. Der Mantel ist ein Rechteck: so breit wie der Umfang $u$, so hoch wie $h$.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- pie chart ---------- */
    W('kreisdiagramm6', function (box) {
        const CAT = [['zu Fuß', 6, LAM], ['Fahrrad', 8, CY], ['Bus oder Bahn', 7, PHI], ['Auto', 4, VIO]];
        const S = { c: CAT.map(x => x[1]) };
        const ctr = div(box, 'b-ctrls');
        CAT.forEach(([l, , col], i) => stepper(ctr, '<span class="g6-dot" style="background:' + col + '"></span>' + l, { min: 0, max: 30, value: S.c[i], aria: l, onChange: v => { S.c[i] = v; render(); } }));
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [ctr, out], 260);
        // on paper the table needs the whole width: picture above, table below
        if (printing() && !hero) { two.style.display = 'block'; pic.style.maxWidth = '200px'; pic.style.margin = '0 auto 10px'; }
        function render() {
            const n = S.c.reduce((s, x) => s + x, 0), M = [130, 130], r = 112;
            let s = '', a = -Math.PI / 2;
            if (!n) s = circle(M, r, 'fill:none;stroke:' + DIM + ';stroke-width:1.5;stroke-dasharray:5 5');
            S.c.forEach((x, i) => {
                if (!x) return;
                const da = 2 * Math.PI * x / n;
                s += '<path d="' + sector(M, r, a, a + da) + '" style="' + fill(CAT[i][2], 0.45) + ';stroke:#0a1426;stroke-width:2"/>';
                if (x / n >= 0.06) s += txt([M[0] + 0.62 * r * Math.cos(a + da / 2), M[1] + 0.62 * r * Math.sin(a + da / 2) + 5], fmt(100 * x / n, 0) + ' %', 'g-val');
                a += da;
            });
            pic.innerHTML = svg(260, 260, 'Kreisdiagramm: Wie kommst du zur Schule?', s);
            if (hero) return;
            let tab = '<div class="b-table-wrap"><table class="b-table g-tab g6-tab"><tr><th></th><th>Anzahl</th><th>Anteil</th><th>Prozent</th><th>Winkel</th></tr>';
            CAT.forEach(([l], i) => {
                tab += '<tr><td style="text-align:left">' + l + '</td><td>' + S.c[i] + '</td><td>' + (n ? '$' + fr(S.c[i], n) + '$' : '–') + '</td><td>' + (n ? fmt(100 * S.c[i] / n, 1) + ' %' : '–') + '</td><td>' + (n ? fmt(360 * S.c[i] / n, 1) + '°' : '–') + '</td></tr>';
            });
            tab += '<tr><td style="text-align:left"><b>zusammen</b></td><td>' + n + '</td><td>' + (n ? '$1$' : '–') + '</td><td>' + (n ? '100 %' : '–') + '</td><td>' + (n ? '360°' : '–') + '</td></tr></table></div>';
            out.innerHTML = '<p style="margin:0">Umfrage in einer Klasse: Wie kommst du zur Schule?</p>' + tab +
                '<p class="b-help" style="margin:8px 0 0">Winkel = Anteil · 360°. ' + (n ? 'Eine Person entspricht hier $' + texNum(360 / n, 2) + '^\\circ$.' : '') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- the sieve of Eratosthenes ---------- */
    const SIEBCOL = { 2: CY, 3: PHI, 5: VIO, 7: RED };
    W('sieb6', function (box) {
        const S = { mark: [], last: null, msg: '' };
        const btn = buttons(box, [['next', 'Nächste Primzahl', 'b-go'], ['all', 'Alle Schritte'], ['reset', 'Von vorn']], a => {
            if (a === 'reset') reset(); else if (a === 'all') { while (step()) { } } else step();
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const hero = heroOnly(box, pic, [btn, out], 340);
        function reset() { S.mark = Array(101).fill(0); S.mark[1] = 'eins'; S.last = null; S.msg = '1 ist keine Primzahl: Sie hat nur einen Teiler. Tipp auf „Nächste Primzahl“.'; }
        function step() {
            let p = 2; while (p <= 100 && S.mark[p]) p++;
            if (p > 100) return false;
            if (p * p > 100) {
                const rest = []; for (let k = p; k <= 100; k++) if (!S.mark[k]) { S.mark[k] = 'p'; rest.push(k); }
                S.last = 'fertig'; S.msg = 'Schon $' + p + ' \\cdot ' + p + ' = ' + p * p + '$ ist größer als 100. Alles, was noch übrig ist, ist eine Primzahl. <b>Fertig: 25 Primzahlen bis 100.</b>';
                return false;
            }
            S.mark[p] = 'p';
            const gone = []; for (let k = p * p; k <= 100; k += p) if (!S.mark[k]) { S.mark[k] = p; gone.push(k); }
            S.last = p;
            S.msg = 'Die $' + p + '$ ist nicht gestrichen, also eine Primzahl. Gestrichen werden ihre Vielfachen ab $' + p + ' \\cdot ' + p + ' = ' + p * p + '$: ' + gone.length + ' Zahlen (' + gone.slice(0, 5).join(', ') + (gone.length > 5 ? ', …' : '') + ').' +
                (p > 2 ? ' Kleinere Vielfache wie $' + 2 * p + '$ waren schon weg.' : '');
            return true;
        }
        function render() {
            const c = 33, x0 = 5, y0 = 5;
            let s = '';
            for (let k = 1; k <= 100; k++) {
                const x = x0 + ((k - 1) % 10) * c, y = y0 + Math.floor((k - 1) / 10) * c, m = S.mark[k], cx = x + c / 2, cy = y + c / 2;
                if (m === 'p') s += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (c - 4) + '" height="' + (c - 4) + '" rx="6" style="' + fill(LAM, k === S.last ? 0.55 : 0.25) + '"/>';
                s += '<text class="g6-sieb' + (m && m !== 'p' ? ' off' : '') + '" x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle">' + k + '</text>';
                if (m && m !== 'p') s += line([x + 6, y + c - 7], [x + c - 6, y + 7], 'stroke:' + (SIEBCOL[m] || DIM) + ';stroke-width:2;opacity:0.85');
            }
            pic.innerHTML = svg(340, 340, 'Sieb des Eratosthenes: die Zahlen von 1 bis 100', s);
            if (hero) return;
            const found = S.mark.filter(m => m === 'p').length;
            out.innerHTML = '<p style="margin:0">' + S.msg + '</p><p class="b-help" style="margin:8px 0 0">Gefunden: ' + found + ' Primzahlen. Gestrichen: ' +
                '<span class="g-cy">Vielfache von 2</span>, <span class="g-phi">von 3</span>, <span style="color:' + VIO + '">von 5</span>, <span class="g-warn">von 7</span>.</p>';
            btn.querySelector('[data-a="next"]').disabled = S.last === 'fertig';
            btn.querySelector('[data-a="all"]').disabled = S.last === 'fertig';
            math(out);
        }
        reset();
        if (printing() || box.dataset.hero != null) { while (step()) { } }
        render();
    });

    /* ---------- prime factors, gcd and lcm ---------- */
    W('primfaktor6', function (box) {
        const ctr = div(box, 'b-ctrls');
        ctr.innerHTML = '<label class="b-ctrl">Zahl $a$ <input class="b-in" type="text" inputmode="numeric" value="' + (box.dataset.a || 360) + '" style="width:90px"></label>' +
            '<label class="b-ctrl">Zahl $b$ <input class="b-in" type="text" inputmode="numeric" value="' + (box.dataset.b || 84) + '" style="width:90px"></label>';
        math(ctr);
        const [ia, ib] = ctr.querySelectorAll('input');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        [ia, ib].forEach(i => i.addEventListener('input', render));
        const read = i => { const v = +String(i.value).trim(); return Number.isInteger(v) && v >= 2 && v <= 9999 ? v : null; };
        function tree(n) {
            const f = primeFactors(n), dx = 42, dy = 40;
            let s = '', cur = n, w = 0;
            const node = (p, t, prime) => {
                const wd = String(t).length * 9 + 16;
                return '<rect x="' + f1(p[0] - wd / 2) + '" y="' + f1(p[1] - 14) + '" width="' + wd + '" height="28" rx="14" style="' + (prime ? fill(LAM, 0.3) : 'fill:#0d1a30;stroke:' + CY + ';stroke-width:1.6') + '"/>' +
                    txt([p[0], p[1] + 5], String(t), 'g-val');
            };
            const pos = i => [44 + i * dx, 22 + i * dy];
            f.forEach((p, i) => {
                if (i === f.length - 1) { s += node(pos(i), cur, true); return; }
                const P = pos(i), L = [P[0] - 24, P[1] + dy], R = pos(i + 1);
                s += line(P, L, 'stroke:' + DIM + ';stroke-width:1.4') + line(P, R, 'stroke:' + DIM + ';stroke-width:1.4');
                s += node(P, cur, false) + node(L, p, true);
                cur /= p;
            });
            w = 44 + (f.length - 1) * dx + 50;
            return svg(Math.max(w, 160), 22 + (f.length - 1) * dy + 40, 'Faktorbaum von ' + n, s);
        }
        function render() {
            const a = read(ia), b = read(ib);
            ia.classList.toggle('ok', !!a); ib.classList.toggle('ok', !!b);
            if (!a) { pic.innerHTML = ''; out.innerHTML = '<p style="margin:0">Gib für $a$ eine natürliche Zahl von 2 bis 9999 ein.</p>'; math(out); return; }
            pic.innerHTML = tree(a);
            const fa = primeFactors(a);
            let o = '<p style="margin:0">$' + a + (fa.length === 1 ? '$ ist eine <b>Primzahl</b>.' : ' = ' + fa.join(' \\cdot ') + (powers(fa) !== fa.join(' \\cdot ') ? ' = ' + powers(fa) : '') + '$') + '</p>';
            if (b) {
                const fb = primeFactors(b), g = gcd(a, b), l = a / g * b;
                o += '<p style="margin:0">$' + b + (fb.length === 1 ? '$ ist eine <b>Primzahl</b>.' : ' = ' + fb.join(' \\cdot ') + (powers(fb) !== fb.join(' \\cdot ') ? ' = ' + powers(fb) : '') + '$') + '</p>' +
                    '<p style="margin:8px 0 0"><span class="g-lam">ggT</span>$(' + a + ', ' + b + ') = ' + g + '$ &nbsp; <span class="g-cy">kgV</span>$(' + a + ', ' + b + ') = ' + l + '$</p>' +
                    '<p class="b-help" style="margin:8px 0 0">Der ggT besteht aus den Primfaktoren, die in <b>beiden</b> Zerlegungen vorkommen. Das kgV enthält jeden Primfaktor so oft, wie er <b>höchstens</b> vorkommt. ' +
                    (g > 1 ? 'Damit kürzt man: $\\tfrac{' + Math.min(a, b) + '}{' + Math.max(a, b) + '} = \\tfrac{' + Math.min(a, b) / g + '}{' + Math.max(a, b) / g + '}$.' : 'Die beiden Zahlen haben keinen gemeinsamen Teiler außer 1.') + '</p>';
            }
            out.innerHTML = o;
            math(out);
        }
        render();
    });
})();
