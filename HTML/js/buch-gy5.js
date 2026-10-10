/* buch-gy5.js — widgets of the book Mathematik · Gymnasium 5 (js/buch.js; SVG helpers Buch.geo from js/buch-geometrie.js).
 *   titelbildgy5   the cover: a cuboid of unit cubes, a fraction circle, an angle with its scale, a mirrored kite, a number line, Maya digits
 *   stellenwert5   place value table with a digit stepper in every column: the number in digits and in words (data-mode="dezimal": tenths to thousandths)
 *   zahlenstrahl5  rounding on the number line: the two round neighbours, the middle, the point draggable (data-hero)
 *   sieb5          the sieve of Eratosthenes 1–100 step by step; tap a number for its divisors and its prime factors (data-hero)
 *   bruch5         a fraction as circle, rectangle or strip: numerator and denominator, expand and reduce, decimal and percent (data-z, data-n, data-form, data-hero)
 *   bruchstrahl5   two numbers (fraction or decimal) on the number line, compared via a common denominator (data-a, data-b, data-hero)
 *   winkel5        an angle with a draggable arm and a protractor scale, its type; guessing mode with a hidden scale (data-hero)
 *   winkelpaare5   two lines cut by a third: vertical, adjacent, corresponding and alternate angles, the second line parallel or not
 *   spiegel5       a figure on the grid: reflection in a line, translation, rotation, and a quiz "which movement?" (data-mode, data-hero)
 *   rechteck5      a rectangle of unit squares with a draggable corner: area and perimeter; an L-shape by splitting or completing (data-mode, data-hero)
 *   quader5        a cuboid a × b × c: oblique view, net, unit cubes; volume, surface area, edges (data-mode, data-a/b/c, data-hero)
 *   einheiten5     the unit staircase for length, mass, time, area and volume: convert a value step by step (data-kind, data-hero)
 *   zahlschrift5   one number in Egyptian, Roman and Maya numerals and in binary (data-mode, data-v, data-hero)
 *   komma5         multiply and divide by 10, 100, 1000: the digits move in the place value table, the comma stays (data-v)
 *   mittel5        the mean as levelling: five bars with draggable heights, "Ausgleichen" fills the gaps up to the mean (data-v, data-hero)
 *   koord5         the coordinate system: four draggable points, two lines, parallel or perpendicular; "Finde den Punkt" game (data-hero)
 *   symmetrie5     pattern workshop: colour squares, their mirror images appear (vertical axis, horizontal axis, both axes, point) (data-mode)
 *   linien5        Adam Ries' counting board: counters on the lines (1, 10, 100, 1000) and in the spaces (5, 50, 500); add a number and bundle step by step (data-a, data-b, data-hero)
 * Looks: js/buch.css (section "Widgets of the Gymnasium 5 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, math, range, seg, div } = B;
    const W = B.widget;
    const G = B.geo;
    const { f1, pts, poly, line, txt, dot, handle, add, sub, mul, mid, len, svgXY, dragSVG } = G;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;
    let uid = 0;

    /* ---------- numbers ---------- */
    // digits in groups of three with a narrow no-break space: 4 738 216
    const grp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    // decimal with comma and grouped integer part
    const dec = (x, d = 3) => { const s = fmt(x, d); const [i, f] = s.split(','); return grp(i) + (f ? ',' + f : ''); };
    const gcd = B.gcd;
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    // German number words up to 999 999 999 999
    const ONES = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
    const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
    const u100 = n => n < 20 ? ONES[n] : (n % 10 ? ONES[n % 10] + 'und' : '') + TENS[Math.floor(n / 10)];
    const u1000 = n => (n >= 100 ? ONES[Math.floor(n / 100)] + 'hundert' : '') + u100(n % 100);
    function wort(n) {
        if (n === 0) return 'null';
        const mrd = Math.floor(n / 1e9), mio = Math.floor(n / 1e6) % 1000, tsd = Math.floor(n / 1e3) % 1000, r = n % 1000;
        const big = (k, one, many) => k === 1 ? 'eine ' + one : u1000(k).replace(/ein$/, 'eine') + ' ' + many;
        const parts = [];
        if (mrd) parts.push(big(mrd, 'Milliarde', 'Milliarden'));
        if (mio) parts.push(big(mio, 'Million', 'Millionen'));
        let tail = tsd ? u1000(tsd) + 'tausend' : '';
        if (r) tail += u1000(r) + (r % 100 === 1 ? 's' : '');
        if (tail) parts.push(tail);
        return parts.join(' ');
    }
    B.zahlwort = wort;

    /* ---------- SVG bits used by several widgets ---------- */
    // drawn at its natural size at most (never blown up to the column width), smaller on narrow screens
    const svg = (w, h, body, label) => '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" style="max-width:100%;height:auto" role="img"' + (label ? ' aria-label="' + label + '"' : '') + '>' + body + '</svg>';
    const T = (x, y, s, cls, anchor, extra) => '<text class="' + (cls || 'g-lab') + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || 'middle') + '"' + (extra || '') + '>' + s + '</text>';
    const rect = (x, y, w, h, st) => '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" style="' + st + '"/>';
    const rgba = (c, a) => c[0] === '#'
        ? 'rgba(' + (parseInt(c.slice(1, 3), 16)) + ',' + parseInt(c.slice(3, 5), 16) + ',' + parseInt(c.slice(5, 7), 16) + ',' + a + ')'
        : c.replace('rgb(', 'rgba(').replace(')', ',' + a + ')');
    const area = (c, a) => 'fill:' + rgba(c, a) + ';stroke:' + c + ';stroke-width:1.6';
    const isHero = box => box.dataset.hero != null;
    // hero: only the picture, small and centred
    function heroOnly(box, pic, hide) {
        if (!isHero(box)) return;
        hide.forEach(el => { if (el) el.style.display = 'none'; });
        pic.style.maxWidth = '320px'; pic.style.margin = '0 auto';
    }
    // circle sector from angle a0 to a1 (radians, clockwise from the top), as path
    function sector(c, r, a0, a1) {
        const p = a => [c[0] + r * Math.sin(a), c[1] - r * Math.cos(a)];
        if (a1 - a0 >= 2 * Math.PI - 1e-9) return '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + r + '"';
        const s = p(a0), e = p(a1);
        return '<path d="M' + f1(c[0]) + ' ' + f1(c[1]) + ' L' + f1(s[0]) + ' ' + f1(s[1]) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + f1(e[0]) + ' ' + f1(e[1]) + ' Z"';
    }
    // oblique view of a cuboid: front face a × c (x right, z up), depth b at 45° shortened by half; returns 2D point
    const obl = (o, u) => (x, y, z) => [o[0] + u * (x + 0.5 * y * Math.SQRT1_2), o[1] - u * (z + 0.5 * y * Math.SQRT1_2)];
    // unit cubes of an a × b × c cuboid, painted from the back to the front
    function cubes(P, a, b, c, col, alpha) {
        let s = '';
        for (let y = b - 1; y >= 0; y--) for (let z = 0; z < c; z++) for (let x = 0; x < a; x++) {
            const front = [P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)];
            const top = [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)];
            const side = [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)];
            s += poly(front, 'fill:' + rgba(col, alpha) + ';stroke:' + col + ';stroke-width:1.1;stroke-linejoin:round') +
                poly(top, 'fill:' + rgba(col, alpha * 1.7) + ';stroke:' + col + ';stroke-width:1.1;stroke-linejoin:round') +
                poly(side, 'fill:' + rgba(col, alpha * 0.7) + ';stroke:' + col + ';stroke-width:1.1;stroke-linejoin:round');
        }
        return s;
    }
    // Maya digit 0–19: bars and dots, the shell for zero; centred at (cx, cy)
    function mayaDigit(v, cx, cy, s, col) {
        col = col || LAM;
        if (v === 0) {
            return '<ellipse cx="' + f1(cx) + '" cy="' + f1(cy) + '" rx="' + f1(s * 0.9) + '" ry="' + f1(s * 0.45) + '" style="fill:none;stroke:' + col + ';stroke-width:2"/>' +
                '<path d="M' + f1(cx - s * 0.55) + ' ' + f1(cy) + ' Q' + f1(cx) + ' ' + f1(cy - s * 0.35) + ' ' + f1(cx + s * 0.55) + ' ' + f1(cy) + ' M' + f1(cx - s * 0.4) + ' ' + f1(cy + s * 0.18) + ' Q' + f1(cx) + ' ' + f1(cy - s * 0.1) + ' ' + f1(cx + s * 0.4) + ' ' + f1(cy + s * 0.18) + '" style="fill:none;stroke:' + col + ';stroke-width:1.4"/>';
        }
        const bars = Math.floor(v / 5), dots = v % 5, bh = s * 0.22, gap = s * 0.14;
        const h = bars * bh + Math.max(0, bars - 1) * gap + (dots ? s * 0.3 + (bars ? gap : 0) : 0);
        let y = cy - h / 2, out = '';
        if (dots) {
            for (let i = 0; i < dots; i++) out += '<circle cx="' + f1(cx + (i - (dots - 1) / 2) * s * 0.38) + '" cy="' + f1(y + s * 0.15) + '" r="' + f1(s * 0.13) + '" fill="' + col + '"/>';
            y += s * 0.3 + (bars ? gap : 0);
        }
        for (let i = 0; i < bars; i++) { out += rect(cx - s * 0.9, y, s * 1.8, bh, 'fill:' + col + ';stroke:none') ; y += bh + gap; }
        return out;
    }

    /* ---------- the cover ---------- */
    W('titelbildgy5', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const closed = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
        let art = '';
        // number line along the bottom
        const NL = 768;
        art += glow('M30 ' + NL + ' L570 ' + NL, '#ffffff', 2.2);
        for (let i = 0; i <= 10; i++) art += '<line x1="' + (50 + 50 * i) + '" y1="' + (NL - (i % 5 ? 8 : 14)) + '" x2="' + (50 + 50 * i) + '" y2="' + (NL + (i % 5 ? 8 : 14)) + '" stroke="#ffffff" stroke-opacity="0.7" stroke-width="2"/>';
        // a 3 × 2 × 2 cuboid of unit cubes
        art += cubes(obl([70, 700], 52), 3, 2, 2, '#7fd8ee', 0.08);
        const P = obl([70, 700], 52);
        art += glow(closed([P(0, 0, 0), P(3, 0, 0), P(3, 0, 2), P(0, 0, 2)]), '#7fd8ee', 2.4);
        art += glow('M' + pts([P(0, 0, 2), P(0, 2, 2), P(3, 2, 2), P(3, 2, 0), P(3, 0, 0)]).replace(/ /g, ' L'), '#7fd8ee', 2.4);
        art += glow('M' + pts([P(3, 0, 2), P(3, 2, 2)]).replace(/ /g, ' L'), '#7fd8ee', 2.4);
        // fraction circle: three eighths lit
        const FC = [455, 455], fr = 92;
        art += sector(FC, fr, 0, 3 * Math.PI / 4) + ' fill="#F5C242" fill-opacity="0.18"/>';
        for (let i = 0; i < 8; i++) art += '<line x1="' + FC[0] + '" y1="' + FC[1] + '" x2="' + f1(FC[0] + fr * Math.sin(i * Math.PI / 4)) + '" y2="' + f1(FC[1] - fr * Math.cos(i * Math.PI / 4)) + '" stroke="#F5C242" stroke-opacity="0.55" stroke-width="1.6"/>';
        art += glow('M' + (FC[0] - fr) + ' ' + FC[1] + ' a' + fr + ' ' + fr + ' 0 1 0 ' + 2 * fr + ' 0 a' + fr + ' ' + fr + ' 0 1 0 ' + -2 * fr + ' 0', '#F5C242', 3);
        // an angle of 50° with a scale
        const V = [345, 690], r1 = 150;
        let scale = '';
        for (let a = 0; a <= 180; a += 10) {
            const c = Math.cos(a * DEG), s = Math.sin(a * DEG), k = a % 30 ? 0.94 : 0.89;
            scale += '<line x1="' + f1(V[0] + r1 * c) + '" y1="' + f1(V[1] - r1 * s) + '" x2="' + f1(V[0] + r1 * k * c) + '" y2="' + f1(V[1] - r1 * k * s) + '" stroke="#B8A4F2" stroke-opacity="0.7" stroke-width="1.6"/>';
        }
        art += scale + glow('M' + (V[0] - r1) + ' ' + V[1] + ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + (V[0] + r1) + ' ' + V[1], '#B8A4F2', 1.8, '3 7');
        art += glow('M' + (V[0] + 205) + ' ' + V[1] + ' L' + V[0] + ' ' + V[1] + ' L' + f1(V[0] + 205 * Math.cos(50 * DEG)) + ' ' + f1(V[1] - 205 * Math.sin(50 * DEG)), '#ffffff', 2.6);
        art += '<path d="M' + (V[0] + 52) + ' ' + V[1] + ' A52 52 0 0 0 ' + f1(V[0] + 52 * Math.cos(50 * DEG)) + ' ' + f1(V[1] - 52 * Math.sin(50 * DEG)) + '" stroke="#F5C242" stroke-width="3" fill="none"/>';
        // mirror axis with a kite and its image
        const ax = 168, kite = [[150, 352], [118, 410], [138, 520], [154, 470]];
        art += glow('M' + ax + ' 330 L' + ax + ' 560', '#A0C85A', 2, '9 9');
        art += glow(closed(kite), '#A0C85A', 2.6) + glow(closed(kite.map(p => [2 * ax - p[0], p[1]])), '#A0C85A', 2.6);
        // Maya digits for 2026 = 5·400 + 1·20 + 6
        art += mayaDigit(5, 300, 385, 20, '#F5C242') + mayaDigit(1, 300, 435, 20, '#F5C242') + mayaDigit(6, 300, 485, 20, '#F5C242');
        [V, FC, [50, NL], [550, NL]].forEach(p => { art += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        const id = 'tg5' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Quader aus Einheitswürfeln, ein Kreis mit drei Achteln, ein Winkel mit Skala, ein gespiegelter Drachen, ein Zahlenstrahl und Maya-Ziffern">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.88" stop-color="#fff" stop-opacity="1"/><stop offset="0.97" stop-color="#fff" stop-opacity="0.15"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- place value table ---------- */
    W('stellenwert5', function (box) {
        const dezi = box.dataset.mode === 'dezimal';
        const COLS = dezi
            ? [['T', 3], ['H', 2], ['Z', 1], ['E', 0], ['z', -1], ['h', -2], ['t', -3]]
            : [['Mrd', 9], ['HM', 8], ['ZM', 7], ['M', 6], ['HT', 5], ['ZT', 4], ['T', 3], ['H', 2], ['Z', 1], ['E', 0]];
        const GROUPS = dezi ? null : [['MRD.', 1], ['MILLIONEN', 3], ['TAUSENDER', 3], ['EINER', 3]];
        const start = String(box.dataset.v || (dezi ? '3,047' : '4738216'));
        const d = {};
        COLS.forEach(([, p]) => { d[p] = 0; });
        (function set(s) {
            const [i, f = ''] = s.replace('.', ',').split(',');
            [...i].reverse().forEach((c, k) => { if (d[k] != null) d[k] = +c; });
            [...f].forEach((c, k) => { if (d[-k - 1] != null) d[-k - 1] = +c; });
        })(start);
        const ctr = div(box, 'b-ctrls');
        const acts = div(ctr, 'b-ctrl g5-acts');
        acts.innerHTML = '<button type="button" class="b-btn" data-a="zufall">Zufallszahl</button><button type="button" class="b-btn" data-a="null">Alles auf 0</button>';
        acts.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            COLS.forEach(([, p]) => { d[p] = b.dataset.a === 'null' ? 0 : rnd(0, 9); });
            if (!dezi && b.dataset.a === 'zufall') d[9] = rnd(0, 2);
            render();
        });
        const wrap = div(box, 'g5-sw-wrap');
        const out = div(box, 'b-out');
        div(box, 'b-help', 'Tippe auf ▲ oder ▼, um eine Ziffer zu ändern. Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben.');
        wrap.addEventListener('click', e => {
            const b = e.target.closest('[data-p]'); if (!b) return;
            const p = +b.dataset.p; d[p] = (d[p] + (b.dataset.s === '+' ? 1 : 9)) % 10; render();
        });
        function value() { return COLS.reduce((s, [, p]) => s + d[p] * Math.pow(10, p), 0); }
        function render() {
            let h = '<table class="g5-sw' + (dezi ? ' g5-sw-dez' : '') + '">';
            if (GROUPS) h += '<tr class="g5-sw-g">' + GROUPS.map(([g, n]) => '<th colspan="' + n + '">' + g + '</th>').join('') + '</tr>';
            h += '<tr>' + COLS.map(([k, p]) => '<th class="' + (p < 0 ? 'g5-sw-frac' : '') + (p === 0 && dezi ? ' g5-sw-e' : '') + '">' + k + '</th>').join('') + '</tr>';
            h += '<tr>' + COLS.map(([, p]) => '<td><button type="button" data-p="' + p + '" data-s="+" aria-label="plus">▲</button></td>').join('') + '</tr>';
            h += '<tr class="g5-sw-d">' + COLS.map(([, p]) => '<td class="' + (p === 0 && dezi ? 'g5-sw-e' : '') + '">' + d[p] + '</td>').join('') + '</tr>';
            h += '<tr>' + COLS.map(([, p]) => '<td><button type="button" data-p="' + p + '" data-s="-" aria-label="minus">▼</button></td>').join('') + '</tr></table>';
            wrap.innerHTML = h;
            const v = value();
            if (dezi) {
                const t = Math.round(v * 1000), ip = Math.floor(t / 1000), fp = t % 1000;
                const fd = String(fp).padStart(3, '0').replace(/0+$/, '');
                const nn = Math.pow(10, fd.length), zz = fd ? +fd : 0;
                out.innerHTML = '<p class="g5-big">' + dec(v, 3) + '</p>' +
                    '<p>' + (fd ? 'Als Zehnerbruch: $' + (ip ? ip + ' + ' : '') + '\\tfrac{' + zz + '}{' + nn + '}' + (ip ? ' = \\tfrac{' + (ip * nn + zz) + '}{' + nn + '}' : '') + '$' : 'Eine natürliche Zahl, keine Stelle nach dem Komma.') + '</p>' +
                    '<p class="g5-dim">Gesprochen: ' + wort(ip) + (fd ? ' Komma ' + [...fd].map(c => c === '0' ? 'null' : (c === '1' ? 'eins' : ONES[+c])).join(' ') : '') + '</p>';
            } else {
                out.innerHTML = '<p class="g5-big">' + grp(v) + '</p><p class="g5-word">' + wort(v).replace(/(tausend|hundert|und)(?=[a-zäöüß])/g, '$1\u00ad') + '</p>' +
                    '<p class="g5-dim">' + (v ? 'Das sind ' + String(v).length + ' Stellen.' : '') + '</p>';
            }
            math(out);
        }
        render();
    });

    /* ---------- rounding on the number line ---------- */
    W('zahlenstrahl5', function (box) {
        const PLACES = [[10, 'Zehner'], [100, 'Hunderter'], [1000, 'Tausender'], [10000, 'Zehntausender'], [100000, 'Hunderttausender'], [1000000, 'Millionen']];
        const S = { n: +(box.dataset.v || 4738216), p: +(box.dataset.p || 1000) };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, PLACES.map(([p, l]) => [p, l]), S.p, v => { S.p = +v; render(); }, 'Runden auf');
        const acts = div(ctr, 'b-ctrl g5-acts');
        acts.innerHTML = '<button type="button" class="b-btn">Neue Zahl</button>';
        acts.querySelector('button').addEventListener('click', () => { S.n = rnd(1000000, 99999999); render(); });
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        const help = div(box, 'b-help', 'Zieh den Punkt. Liegt er genau in der Mitte oder rechts davon, wird aufgerundet, sonst abgerundet.');
        heroOnly(box, pic, [ctr, out, help]);
        const X0 = 50, X1 = 510, Y = 110;
        dragSVG(pic, (i, x) => {
            const lo = Math.floor(S.n / S.p) * S.p;
            const t = Math.min(Math.max((x - X0) / (X1 - X0), 0), 0.9999);
            S.n = lo + Math.round(t * (S.p - 1)); render();
        });
        function render() {
            const p = S.p, lo = Math.floor(S.n / p) * p, hi = lo + p, up = S.n - lo >= p / 2;
            const xOf = v => X0 + (v - lo) / p * (X1 - X0);
            let s = line([X0 - 20, Y], [X1 + 20, Y], 'stroke:' + TXT + ';stroke-width:2');
            for (let i = 0; i <= 10; i++) {
                const x = X0 + i * (X1 - X0) / 10, big = i === 0 || i === 10, half = i === 5;
                s += line([x, Y - (big ? 14 : half ? 11 : 7)], [x, Y + (big ? 14 : half ? 11 : 7)], 'stroke:' + (half ? LAM : TXT) + ';stroke-width:' + (big ? 2 : 1.3) + (half ? ';stroke-dasharray:3 3' : ''));
            }
            s += T(xOf(lo + p / 2), Y + 34, grp(lo + p / 2), 'g-lab') + T(xOf(lo + p / 2), Y + 52, 'Mitte', 'g-small');
            s += T(X0, Y - 26, grp(lo), 'g-val', 'middle', up ? '' : ' style="fill:' + PHI + ';font-weight:700"');
            s += T(X1, Y - 26, grp(hi), 'g-val', 'middle', up ? ' style="fill:' + PHI + ';font-weight:700"' : '');
            const x = xOf(S.n), tx = Math.min(Math.max(x, 70), 490);
            s += '<path d="M' + f1(x) + ' ' + (Y - 4) + ' L' + f1(up ? X1 : X0) + ' ' + (Y - 4) + '" style="stroke:' + PHI + ';stroke-width:4;opacity:0.55"/>';
            s += T(tx, Y + 84, grp(S.n), 'g-pt');
            s += line([x, Y + 8], [x, Y + 66], 'stroke:' + LAM + ';stroke-width:1;stroke-dasharray:2 3');
            s += handle([x, Y], 0, LAM);
            pic.innerHTML = svg(560, 200, s, 'Zahlenstrahl mit der Zahl ' + grp(S.n) + ' zwischen ' + grp(lo) + ' und ' + grp(hi));
            const name = PLACES.find(q => q[0] === p)[1];
            const digit = Math.floor(S.n / (p / 10)) % 10;
            out.innerHTML = '<p class="g5-big">' + grp(S.n) + ' ≈ ' + grp(up ? hi : lo) + '</p>' +
                '<p>Gerundet auf ' + name + '. Entscheidend ist die Ziffer rechts davon: <b>' + digit + '</b>. ' +
                (digit >= 5 ? 'Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.' : 'Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.') + '</p>';
        }
        render();
    });

    /* ---------- sieve of Eratosthenes ---------- */
    W('sieb5', function (box) {
        const COL = { 2: LAM, 3: CY, 5: PHI, 7: VIO };
        const S = { step: 0, pick: 36 };   // step 0: nothing; 1: 1 out; 2..5: primes 2,3,5,7; 6: done
        const hero = isHero(box);
        if (hero) S.step = 6;
        const ctr = div(box, 'b-ctrls');
        const acts = div(ctr, 'b-ctrl g5-acts');
        acts.innerHTML = '<button type="button" class="b-btn b-go" data-a="next">Nächster Schritt</button><button type="button" class="b-btn" data-a="reset">Von vorn</button>';
        acts.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            S.step = b.dataset.a === 'reset' ? 0 : Math.min(S.step + 1, 6); render();
        });
        const two = div(box, 'b-two');
        const gridBox = div(two, 'g5-sieb'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Tippe auf eine Zahl: Du siehst alle ihre Teiler und ihre Zerlegung in Primfaktoren.');
        if (hero) { [ctr, out, help].forEach(e => { e.style.display = 'none'; }); two.style.display = 'block'; gridBox.style.maxWidth = '300px'; gridBox.style.margin = '0 auto'; }
        gridBox.addEventListener('click', e => {
            const c = e.target.closest('[data-n]'); if (!c) return;
            S.pick = +c.dataset.n; render();
        });
        const PR = [2, 3, 5, 7];
        const struckBy = n => { for (let k = 0; k < Math.min(S.step - 1, 4); k++) { const p = PR[k]; if (n !== p && n % p === 0) return p; } return 0; };
        const isPrime = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
        function factors(n) { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f; }
        function render() {
            let h = '';
            for (let n = 1; n <= 100; n++) {
                const by = struckBy(n), prime = (S.step >= 2 && PR.slice(0, S.step - 1).includes(n)) || (S.step === 6 && isPrime(n));
                const cls = ['g5-cell'];
                if (n === 1 && S.step >= 1) cls.push('g5-out');
                if (by) cls.push('g5-out');
                if (prime) cls.push('g5-prime');
                if (n === S.pick && !hero) cls.push('g5-pick');
                const st = by ? ' style="--c:' + COL[by] + '"' : (prime ? ' style="--c:' + (COL[n] || PHI) + '"' : '');
                h += '<button type="button" class="' + cls.join(' ') + '" data-n="' + n + '"' + st + '>' + n + '</button>';
            }
            gridBox.innerHTML = h;
            const MSG = ['Starte das Sieb mit „Nächster Schritt“.',
                'Die 1 ist <b>keine Primzahl</b>: Sie hat nur einen einzigen Teiler.',
                'Die 2 ist die erste Primzahl. Alle ihre Vielfachen 4, 6, 8, … sind gestrichen.',
                'Die 3 ist die nächste Primzahl. Ihre Vielfachen 6, 9, 12, … sind gestrichen.',
                'Die 5 ist die nächste Primzahl. Gestrichen: 10, 15, 20, …',
                'Die 7 ist die nächste Primzahl. Neu gestrichen: 49, 77, 91 und die anderen Vielfachen.',
                'Fertig! Die nächste Zahl wäre 11, aber 11 · 11 = 121 liegt schon über 100. Alle übrigen Zahlen sind <b>Primzahlen</b>: Es sind 25 Stück.'];
            const n = S.pick, T2 = []; for (let k = 1; k <= n; k++) if (n % k === 0) T2.push(k);
            const f = factors(n);
            out.innerHTML = '<p>' + MSG[S.step] + '</p><hr class="g5-hr">' +
                '<p><b>Teiler von ' + n + ':</b> ' + T2.join(', ') + ' (' + T2.length + ' Stück)</p>' +
                (n === 1 ? '<p>Die 1 hat nur sich selbst als Teiler.</p>' :
                    isPrime(n) ? '<p><span class="g-ok">' + n + ' ist eine Primzahl</span>: genau zwei Teiler, 1 und ' + n + '.</p>' :
                        '<p>' + n + ' = ' + f.join(' · ') + '</p><p class="g5-dim">Zerlegung in Primfaktoren</p>');
        }
        render();
    });

    /* ---------- fractions as pictures ---------- */
    W('bruch5', function (box) {
        const S = { z: +(box.dataset.z || 3), n: +(box.dataset.n || 4), form: box.dataset.form || 'kreis' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['kreis', 'Kreis'], ['rechteck', 'Rechteck'], ['streifen', 'Streifen']], S.form, v => { S.form = v; render(); }, 'Bild');
        const st = div(box, 'b-ctrls');
        const stepper = (label, key) => {
            const c = div(st, 'b-ctrl');
            c.innerHTML = label + ' <span class="b-stepper"><button type="button" data-k="' + key + '" data-d="-1" aria-label="weniger">−</button><output></output><button type="button" data-k="' + key + '" data-d="1" aria-label="mehr">+</button></span>';
            return c.querySelector('output');
        };
        const oz = stepper('Zähler', 'z'), on = stepper('Nenner', 'n');
        const ops = div(st, 'b-ctrl g5-acts');
        ops.innerHTML = '<button type="button" class="b-btn" data-op="e2">Erweitern mit 2</button><button type="button" class="b-btn" data-op="e3">mit 3</button><button type="button" class="b-btn" data-op="k">Kürzen</button>';
        st.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.k) {
                const k = b.dataset.k, dd = +b.dataset.d;
                if (k === 'n') S.n = Math.min(Math.max(S.n + dd, 1), 24);
                else S.z = Math.min(Math.max(S.z + dd, 0), 3 * S.n);
                S.z = Math.min(S.z, 3 * S.n);
            } else if (b.dataset.op === 'k') {
                const g = gcd(S.z, S.n); if (g > 1) { let p = 2; while (g % p) p++; S.z /= p; S.n /= p; }
            } else {
                const k = b.dataset.op === 'e2' ? 2 : 3;
                if (S.n * k <= 48) { S.z *= k; S.n *= k; }
            }
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        heroOnly(box, pic, [ctr, st, out]);
        if (isHero(box)) two.style.display = 'block';
        function picture() {
            const { z, n } = S, wholes = Math.max(1, Math.ceil(z / n));
            let s = '';
            if (S.form === 'kreis') {
                const r = wholes > 2 ? 62 : wholes > 1 ? 78 : 100, W0 = 2 * r + 30, H = 2 * r + 30;
                for (let w = 0; w < wholes; w++) {
                    const c = [r + 15 + w * W0, r + 15], k = Math.min(Math.max(z - w * n, 0), n);
                    if (k) s += sector(c, r, 0, 2 * Math.PI * k / n) + ' style="' + area(LAM, 0.35) + ';stroke-width:0"/>';
                    if (n > 1) for (let i = 0; i < n; i++) s += line(c, [c[0] + r * Math.sin(2 * Math.PI * i / n), c[1] - r * Math.cos(2 * Math.PI * i / n)], 'stroke:' + TXT + ';stroke-width:1.2;opacity:0.75');
                    s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + r + '" style="fill:none;stroke:' + TXT + ';stroke-width:2"/>';
                }
                return svg(wholes * W0, H, s, 'Kreisbild des Bruchs ' + z + '/' + n);
            }
            if (S.form === 'streifen') {
                const Wd = 520, h = 46, gap = 18;
                for (let w = 0; w < wholes; w++) {
                    const y = 10 + w * (h + gap), k = Math.min(Math.max(z - w * n, 0), n);
                    if (k) s += rect(10, y, Wd * k / n, h, area(LAM, 0.35) + ';stroke-width:0');
                    for (let i = 1; i < n; i++) s += line([10 + Wd * i / n, y], [10 + Wd * i / n, y + h], 'stroke:' + TXT + ';stroke-width:1.2;opacity:0.75');
                    s += rect(10, y, Wd, h, 'fill:none;stroke:' + TXT + ';stroke-width:2');
                }
                return svg(540, 20 + wholes * (h + gap) - gap, s, 'Streifenbild des Bruchs ' + z + '/' + n);
            }
            // rectangle: columns = reduced denominator, rows = the factor it was expanded with (hundredths: 10 × 10)
            const g = gcd(z, n) || 1, d0 = n / g;
            let cols, rows, colMajor = false;
            if (d0 <= 12 && g <= 12) { cols = d0; rows = n / d0; }
            else { cols = n % 10 === 0 ? 10 : n; rows = n / cols; colMajor = true; if (n === 100 || n === 1000) { cols = 10; rows = n / 10; } }
            const Wd = 200, H = 200, cw = Wd / cols, rh = H / rows, gapW = 24;
            for (let w = 0; w < wholes; w++) {
                const x0 = 10 + w * (Wd + gapW), k = Math.min(Math.max(z - w * n, 0), n);
                for (let i = 0; i < n; i++) {
                    let cx, cy;
                    if (colMajor) { cx = Math.floor(i / rows); cy = i % rows; } else { cx = Math.floor(i / rows); cy = i % rows; }
                    if (i < k) s += rect(x0 + cx * cw, 10 + cy * rh, cw, rh, 'fill:' + rgba(LAM, 0.35) + ';stroke:none');
                }
                for (let i = 1; i < cols; i++) s += line([x0 + i * cw, 10], [x0 + i * cw, 10 + H], 'stroke:' + TXT + ';stroke-width:1.3;opacity:0.8');
                for (let j = 1; j < rows; j++) s += line([x0, 10 + j * rh], [x0 + Wd, 10 + j * rh], 'stroke:' + TXT + ';stroke-width:' + (colMajor ? 1.1 : 0.9) + ';opacity:' + (colMajor ? 0.7 : 0.55) + (colMajor ? '' : ';stroke-dasharray:4 3'));
                s += rect(x0, 10, Wd, H, 'fill:none;stroke:' + TXT + ';stroke-width:2');
            }
            return svg(20 + wholes * (Wd + gapW) - gapW, H + 20, s, 'Rechteckbild des Bruchs ' + z + '/' + n);
        }
        function render() {
            oz.textContent = S.z; on.textContent = S.n;
            pic.innerHTML = picture();
            const { z, n } = S, g = gcd(z, n) || 1, zr = z / g, nr = n / g;
            let nn = nr; while (nn % 2 === 0) nn /= 2; while (nn % 5 === 0) nn /= 5;
            const exact = nn === 1, v = z / n;
            const lines = ['<p class="g5-big">$\\dfrac{' + z + '}{' + n + '}$' + (g > 1 ? ' $= \\dfrac{' + zr + '}{' + nr + '}$' : '') + '</p>'];
            lines.push('<p>' + (z === 0 ? 'Null Teile: der Bruch hat den Wert 0.' : z < n ? 'Ein <b>echter Bruch</b>: weniger als ein Ganzes.' : z === n ? 'Genau <b>ein Ganzes</b>.' :
                'Ein <b>unechter Bruch</b>: mehr als ein Ganzes' + (z % n ? ', als gemischte Zahl $' + Math.floor(z / n) + '\\tfrac{' + (z % n) + '}{' + n + '}$' : ', genau ' + z / n + ' Ganze') + '.') + '</p>');
            lines.push('<p>' + (g > 1 ? 'Kürzen mit ' + g + ' ergibt $\\tfrac{' + zr + '}{' + nr + '}$.' : 'Der Bruch lässt sich nicht weiter kürzen.') + '</p>');
            lines.push('<p>' + (exact ? 'Als Dezimalzahl: <b>' + fmt(v, 4) + '</b>' + (Math.abs(v * 100 - Math.round(v * 100)) < 1e-9 ? ' · in Prozent: <b>' + fmt(v * 100, 2) + ' %</b>' : '') :
                'Als Dezimalzahl ungefähr ' + fmt(v, 3) + '. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.') + '</p>');
            out.innerHTML = lines.join('');
            math(out);
        }
        render();
    });

    /* ---------- two numbers on the number line ---------- */
    W('bruchstrahl5', function (box) {
        const S = { a: box.dataset.a || '3/4', b: box.dataset.b || '0,7' };
        const ctr = div(box, 'b-ctrls');
        const inp = (label, key, col) => {
            const c = div(ctr, 'b-ctrl');
            c.innerHTML = '<span style="color:' + col + '">' + label + '</span> <input class="b-in g5-in" type="text" inputmode="decimal" value="' + S[key] + '" aria-label="Zahl ' + label + '">';
            c.querySelector('input').addEventListener('input', e => { S[key] = e.target.value; render(); });
        };
        inp('A', 'a', LAM); inp('B', 'b', CY);
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        const help = div(box, 'b-help', 'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.');
        heroOnly(box, pic, [ctr, out, help]);
        // "z/n" → {z, n}; decimals → {z, n = 10^k}
        function frac(s) {
            s = String(s).trim().replace(/\s/g, '').replace('.', ',');
            let m = s.match(/^(\d+)\/(\d+)$/);
            if (m && +m[2] > 0) return { z: +m[1], n: +m[2], dec: false };
            m = s.match(/^(\d+)(?:,(\d{1,3}))?$/);
            if (m) { const f = m[2] || ''; return { z: +(m[1] + f), n: Math.pow(10, f.length), dec: true }; }
            return null;
        }
        function render() {
            const A = frac(S.a), Bv = frac(S.b);
            const ok = A && Bv && A.z / A.n <= 3 && Bv.z / Bv.n <= 3;
            const max = ok ? Math.max(1, Math.ceil(Math.max(A.z / A.n, Bv.z / Bv.n) - 1e-9)) : 1;
            const X0 = 40, X1 = 520, Y = 90, xOf = v => X0 + v / max * (X1 - X0);
            let s = line([X0 - 14, Y], [X1 + 14, Y], 'stroke:' + TXT + ';stroke-width:2');
            for (let k = 0; k <= max; k++) s += line([xOf(k), Y - 16], [xOf(k), Y + 16], 'stroke:' + TXT + ';stroke-width:2') + T(xOf(k), Y + 36, k, 'g-val');
            const ticks = (F, col, dir) => {
                if (!F || F.n > 100 || F.n * max > 120) return '';
                let t = '';
                for (let i = 1; i < F.n * max; i++) if (i % F.n) t += line([xOf(i / F.n), Y], [xOf(i / F.n), Y + dir * 8], 'stroke:' + col + ';stroke-width:1.2;opacity:0.8');
                return t;
            };
            if (ok) {
                s += ticks(A, LAM, -1) + ticks(Bv, CY, 1);
                const pa = xOf(A.z / A.n), pb = xOf(Bv.z / Bv.n);
                s += line([pa, Y], [pa, Y - 42], 'stroke:' + LAM + ';stroke-width:1.4') + dot([pa, Y], LAM, 7) + T(pa, Y - 50, 'A', 'g-pt', 'middle', ' style="fill:' + LAM + '"');
                s += line([pb, Y], [pb, Y + 48], 'stroke:' + CY + ';stroke-width:1.4') + dot([pb, Y], CY, 7) + T(pb, Y + 66, 'B', 'g-pt', 'middle', ' style="fill:' + CY + '"');
            }
            pic.innerHTML = svg(560, 170, s, 'Zahlenstrahl mit zwei Zahlen');
            if (!ok) { out.innerHTML = '<p class="g-warn">Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.</p>'; return; }
            const va = A.z / A.n, vb = Bv.z / Bv.n, rel = Math.abs(va - vb) < 1e-12 ? '=' : va < vb ? '<' : '>';
            const L = A.n * Bv.n / gcd(A.n, Bv.n), za = A.z * L / A.n, zb = Bv.z * L / Bv.n;
            const show = F => F.dec ? fmt(F.z / F.n, 3) : '\\tfrac{' + F.z + '}{' + F.n + '}';
            out.innerHTML = '<p class="g5-big"><span class="g-lam">A</span> ' + rel + ' <span class="g-cy">B</span></p>' +
                (L <= 1000 ? '<p>Auf denselben Nenner ' + L + ' gebracht: $' + show(A) + ' = \\tfrac{' + za + '}{' + L + '}$ und $' + show(Bv) + ' = \\tfrac{' + zb + '}{' + L + '}$. ' +
                    'Jetzt vergleicht man nur die Zähler: ' + za + ' ' + rel + ' ' + zb + '.</p>' : '') +
                '<p class="g5-dim">Als Dezimalzahlen: A ≈ ' + fmt(va, 3) + ', B ≈ ' + fmt(vb, 3) + '. Weiter rechts auf dem Zahlenstrahl heißt größer.</p>';
            math(out);
        }
        render();
    });

    /* ---------- an angle with a protractor ---------- */
    W('winkel5', function (box) {
        const S = { a: +(box.dataset.a || 50), mode: 'messen', scale: true, secret: 0, guessed: false };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['messen', 'Messen'], ['schaetzen', 'Schätzen']], S.mode, v => { S.mode = v; if (v === 'schaetzen') newGuess(); render(); }, 'Modus');
        const pre = div(ctr, 'b-ctrl g5-acts');
        pre.innerHTML = [30, 90, 135, 180, 250, 360].map(v => '<button type="button" class="b-btn" data-v="' + v + '">' + v + '°</button>').join('');
        pre.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; S.a = +b.dataset.v; render(); });
        const guess = div(box, 'b-ctrls');
        guess.innerHTML = '<span class="b-ctrl">Deine Schätzung <input class="b-in g5-in" type="text" inputmode="numeric" aria-label="Schätzung in Grad"> °</span>' +
            '<button type="button" class="b-btn b-go" data-g="ok">Prüfen</button><button type="button" class="b-btn" data-g="neu">Neuer Winkel</button>';
        const gin = guess.querySelector('input');
        guess.addEventListener('click', e => {
            const b = e.target.closest('[data-g]'); if (!b) return;
            if (b.dataset.g === 'neu') newGuess(); else S.guessed = true;
            render();
        });
        gin.addEventListener('keydown', e => { if (e.key === 'Enter') { S.guessed = true; render(); } });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Zieh am Ende des zweiten Schenkels. Gemessen wird gegen den Uhrzeigersinn, vom liegenden Schenkel aus.');
        heroOnly(box, pic, [ctr, guess, out, help]);
        if (isHero(box)) two.style.display = 'block';
        function newGuess() { S.secret = rnd(8, 352); S.guessed = false; gin.value = ''; }
        const V = [200, 190], R = 150;
        dragSVG(pic, (i, x, y) => {
            if (S.mode !== 'messen') return;
            let a = Math.round(Math.atan2(V[1] - y, x - V[0]) / DEG); if (a < 0) a += 360;
            if (S.a >= 300 && a <= 60) a = 360;   // passing 0 from above: stop at the full angle
            S.a = a; render();
        });
        const kind = a => a === 0 ? 'Nullwinkel' : a < 90 ? 'spitzer Winkel' : a === 90 ? 'rechter Winkel' : a < 180 ? 'stumpfer Winkel' : a === 180 ? 'gestreckter Winkel' : a < 360 ? 'überstumpfer Winkel' : 'Vollwinkel';
        const range5 = a => a === 0 ? '' : a < 90 ? '0° < α < 90°' : a === 90 ? 'α = 90°' : a < 180 ? '90° < α < 180°' : a === 180 ? 'α = 180°' : a < 360 ? '180° < α < 360°' : 'α = 360°';
        function render() {
            guess.style.display = S.mode === 'schaetzen' && !isHero(box) ? '' : 'none';
            pre.style.display = S.mode === 'messen' ? '' : 'none';
            const a = S.mode === 'messen' ? S.a : S.secret, showScale = S.mode === 'messen' || S.guessed;
            const E = [V[0] + R * Math.cos(a * DEG), V[1] - R * Math.sin(a * DEG)];
            let s = '';
            if (showScale) {
                s += '<circle cx="' + V[0] + '" cy="' + V[1] + '" r="' + (R - 8) + '" style="fill:rgba(184,164,242,0.05);stroke:' + VIO + ';stroke-width:1;opacity:0.6"/>';
                for (let k = 0; k < 360; k += 5) {
                    const big = k % 10 === 0, c = Math.cos(k * DEG), sn = Math.sin(k * DEG), r0 = R - 8, r1 = r0 - (k % 30 === 0 ? 14 : big ? 9 : 5);
                    s += line([V[0] + r0 * c, V[1] - r0 * sn], [V[0] + r1 * c, V[1] - r1 * sn], 'stroke:' + VIO + ';stroke-width:' + (k % 30 ? 1 : 1.6) + ';opacity:0.8');
                    if (k % 30 === 0) s += T(V[0] + (r0 - 28) * c, V[1] - (r0 - 28) * sn + 5, k, 'g-small');
                }
            }
            const arcR = 46, big = a > 180 ? 1 : 0;
            if (a > 0 && a < 360) s += '<path d="M' + (V[0] + arcR) + ' ' + V[1] + ' A' + arcR + ' ' + arcR + ' 0 ' + big + ' 0 ' + f1(V[0] + arcR * Math.cos(a * DEG)) + ' ' + f1(V[1] - arcR * Math.sin(a * DEG)) + ' Z" style="' + area(LAM, 0.22) + '"/>';
            if (a === 360) s += '<circle cx="' + V[0] + '" cy="' + V[1] + '" r="' + arcR + '" style="' + area(LAM, 0.22) + '"/>';
            if (a === 90) s += '<rect x="' + V[0] + '" y="' + (V[1] - 20) + '" width="20" height="20" style="fill:none;stroke:' + TXT + ';stroke-width:1.4"/><circle cx="' + (V[0] + 8) + '" cy="' + (V[1] - 8) + '" r="2.4" fill="' + TXT + '"/>';
            s += line(V, [V[0] + R + 22, V[1]], 'stroke:' + TXT + ';stroke-width:3;stroke-linecap:round');
            s += line(V, [V[0] + (R + 22) * Math.cos(a * DEG), V[1] - (R + 22) * Math.sin(a * DEG)], 'stroke:' + TXT + ';stroke-width:3;stroke-linecap:round');
            s += dot(V, TXT, 5) + T(V[0] - 14, V[1] + 22, 'S', 'g-pt');
            const am = (a === 360 ? 45 : a / 2) * DEG;
            s += T(V[0] + 66 * Math.cos(am), V[1] - 66 * Math.sin(am) + 6, 'α', 'g-ang');
            if (S.mode === 'messen') s += handle(E, 0, LAM);
            pic.innerHTML = svg(400, 380, s, 'Winkel von ' + a + ' Grad');
            if (S.mode === 'messen') {
                out.innerHTML = '<p class="g5-big">α = ' + a + '°</p><p>Ein <b>' + kind(a) + '</b>' + (range5(a) ? ': ' + range5(a) : '') + '.</p>' +
                    (a > 180 && a < 360 ? '<p class="g5-dim">Tipp zum Messen: Miss den Rest bis zum Vollwinkel, ' + (360 - a) + '°, und rechne 360° − ' + (360 - a) + '°.</p>' : '');
            } else if (!S.guessed) {
                out.innerHTML = '<p>Wie groß ist dieser Winkel? Schätze, ohne zu messen, und tippe auf „Prüfen“.</p>';
            } else {
                const g = parseInt(gin.value, 10), dlt = Math.abs(g - a);
                out.innerHTML = isNaN(g) ? '<p class="g-warn">Bitte eine Zahl eingeben.</p>' :
                    '<p class="g5-big">α = ' + a + '°</p><p>Deine Schätzung: ' + g + '°. ' + (dlt <= 5 ? '<span class="g-ok">Ausgezeichnet</span>, nur ' + dlt + '° daneben!' :
                        dlt <= 15 ? 'Gut, ' + dlt + '° daneben.' : dlt + '° daneben. Vergleiche mit 90° und 180°: Wo liegt der Winkel dazwischen?') + '</p><p>Es ist ein ' + kind(a) + '.</p>';
            }
        }
        newGuess();
        render();
    });

    /* ---------- pairs of angles at two lines and a transversal ---------- */
    W('winkelpaare5', function (box) {
        const S = { t: 62, par: true, kind: 'stufen', pair: 0 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['scheitel', 'Scheitelwinkel'], ['neben', 'Nebenwinkel'], ['stufen', 'Stufenwinkel'], ['wechsel', 'Wechselwinkel']], S.kind, v => { S.kind = v; S.pair = 0; render(); }, 'Winkelpaar');
        const c2 = div(box, 'b-ctrls');
        const tog = div(c2, 'b-ctrl g5-acts');
        tog.innerHTML = '<button type="button" class="b-btn" data-a="pair">Anderes Paar</button><button type="button" class="b-btn" data-a="par">h kippen</button>';
        tog.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            if (b.dataset.a === 'pair') S.pair++; else S.par = !S.par;
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        div(box, 'b-help', 'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.');
        const P1 = [230, 110], DY = 120;
        dragSVG(pic, (i, x, y) => {
            let a = Math.atan2(P1[1] - y, x - P1[0]) / DEG;
            if (a < 0) a += 180;
            S.t = Math.min(Math.max(Math.round(a), 40), 140); render();
        });
        // angle positions at an intersection: 1 = right above, 2 = left above, 3 = left below, 4 = right below
        function render() {
            const tilt = S.par ? 0 : -12;
            const u = [Math.cos(S.t * DEG), -Math.sin(S.t * DEG)];
            // second intersection: line h through (230, 230) rotated by tilt; intersect with s
            const H0 = [230, 110 + DY], hv = [Math.cos(tilt * DEG), -Math.sin(tilt * DEG)];
            // P1 + k u = H0 + m hv
            const det = u[0] * (-hv[1]) - u[1] * (-hv[0]);
            const k = ((H0[0] - P1[0]) * (-hv[1]) - (H0[1] - P1[1]) * (-hv[0])) / det;
            const P2 = add(P1, mul(u, k));
            // directions (SVG): g → (1,0); h → hv; s upwards → u
            const ang = (d) => { let a = Math.atan2(-d[1], d[0]) / DEG; return (a + 360) % 360; };
            const sUp = ang(u), sDn = (sUp + 180) % 360;
            const gR = 0, hR = ang(hv);
            // angle between direction a0 and a1 counterclockwise
            const ccw = (a0, a1) => (a1 - a0 + 360) % 360;
            const at = (P, lineR) => {
                const lineL = (lineR + 180) % 360;
                return {
                    1: { from: lineR, size: ccw(lineR, sUp), P },
                    2: { from: sUp, size: ccw(sUp, lineL), P },
                    3: { from: lineL, size: ccw(lineL, sDn), P },
                    4: { from: sDn, size: ccw(sDn, lineR), P }
                };
            };
            const A = at(P1, gR), Bq = at(P2, hR);
            const PAIRS = {
                scheitel: [[A[1], A[3], 'α₁', 'α₃'], [A[2], A[4], 'α₂', 'α₄'], [Bq[1], Bq[3], 'β₁', 'β₃']],
                neben: [[A[1], A[2], 'α₁', 'α₂'], [A[2], A[3], 'α₂', 'α₃'], [Bq[4], Bq[1], 'β₄', 'β₁']],
                stufen: [[A[1], Bq[1], 'α₁', 'β₁'], [A[2], Bq[2], 'α₂', 'β₂'], [A[3], Bq[3], 'α₃', 'β₃'], [A[4], Bq[4], 'α₄', 'β₄']],
                wechsel: [[A[3], Bq[1], 'α₃', 'β₁'], [A[4], Bq[2], 'α₄', 'β₂']]
            };
            const list = PAIRS[S.kind], pr = list[S.pair % list.length];
            const wedge = (W2, col, r) => {
                const a0 = W2.from * DEG, a1 = (W2.from + W2.size) * DEG;
                return '<path d="M' + f1(W2.P[0]) + ' ' + f1(W2.P[1]) + ' L' + f1(W2.P[0] + r * Math.cos(a0)) + ' ' + f1(W2.P[1] - r * Math.sin(a0)) +
                    ' A' + r + ' ' + r + ' 0 ' + (W2.size > 180 ? 1 : 0) + ' 0 ' + f1(W2.P[0] + r * Math.cos(a1)) + ' ' + f1(W2.P[1] - r * Math.sin(a1)) + ' Z" style="' + area(col, 0.3) + '"/>';
            };
            const lab = (W2, s2, col) => { const m = (W2.from + W2.size / 2) * DEG; return T(W2.P[0] + 50 * Math.cos(m), W2.P[1] - 50 * Math.sin(m) + 6, s2, 'g-ang', 'middle', ' style="fill:' + col + '"'); };
            let s = '';
            s += line([20, P1[1]], [500, P1[1]], 'stroke:' + TXT + ';stroke-width:2.4') + T(490, P1[1] - 10, 'g', 'g-side');
            s += line(sub(H0, mul(hv, 220)), add(H0, mul(hv, 270)), 'stroke:' + TXT + ';stroke-width:2.4') + T(H0[0] + 260 * hv[0], H0[1] + 260 * hv[1] - 10, 'h', 'g-side');
            s += line(add(P1, mul(u, 90)), add(P1, mul(u, k - 90)), 'stroke:' + CY + ';stroke-width:2.4');
            const sh = add(P1, mul(u, 84));
            s += T(sh[0] + 14, sh[1] + 4, 's', 'g-side', 'start', ' style="fill:' + CY + '"');
            s += wedge(pr[0], LAM, 34) + wedge(pr[1], PHI, 34) + lab(pr[0], pr[2], LAM) + lab(pr[1], pr[3], PHI);
            s += dot(P1, TXT, 4) + dot(P2, TXT, 4);
            s += handle(add(P1, mul(u, 64)), 0, CY);
            pic.innerHTML = svg(520, 330, s, 'Zwei Geraden g und h, geschnitten von s');
            const va = Math.round(pr[0].size), vb = Math.round(pr[1].size);
            const RULE = {
                scheitel: 'Scheitelwinkel liegen sich am selben Schnittpunkt gegenüber. Sie sind <b>immer gleich groß</b>.',
                neben: 'Nebenwinkel liegen am selben Schnittpunkt nebeneinander und bilden zusammen einen gestreckten Winkel: Sie ergänzen sich <b>immer zu 180°</b>.',
                stufen: 'Stufenwinkel liegen an verschiedenen Schnittpunkten auf derselben Seite von s und derselben Seite der Geraden. ' + (S.par ? 'An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.' : 'Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.'),
                wechsel: 'Wechselwinkel liegen an verschiedenen Schnittpunkten auf verschiedenen Seiten von s und zwischen den Geraden. ' + (S.par ? 'An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.' : 'Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.')
            };
            out.innerHTML = '<p class="g5-big"><span class="g-lam">' + pr[2] + ' = ' + va + '°</span> &nbsp; <span class="g-phi">' + pr[3] + ' = ' + vb + '°</span></p>' +
                (S.kind === 'neben' ? '<p>' + va + '° + ' + vb + '° = ' + (va + vb) + '°</p>' : '') +
                '<p>' + RULE[S.kind] + '</p><p class="g5-dim">g und h sind ' + (S.par ? 'parallel' : 'nicht parallel') + '.</p>';
        }
        render();
    });

    /* ---------- moving a figure: reflection, translation, rotation, quiz ---------- */
    W('spiegel5', function (box) {
        const FIG = [[2, 1], [5, 1], [5, 3], [3, 4]], NAMES = ['A', 'B', 'C', 'D'];
        const S = { mode: box.dataset.mode || 'spiegel', axis: 'senk', k: 7, v: [5, 1], rot: 90, quiz: null, answer: null };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['spiegel', 'Spiegelung'], ['schieb', 'Verschiebung'], ['dreh', 'Drehung'], ['quiz', 'Rätsel']], S.mode, v => { S.mode = v; if (v === 'quiz') newQuiz(); render(); }, 'Bewegung');
        const c2 = div(box, 'b-ctrls');
        const axSeg = seg(c2, [['senk', 'Achse senkrecht'], ['waag', 'waagerecht'], ['schraeg', 'schräg']], S.axis, v => { S.axis = v; S.k = v === 'senk' ? 7 : v === 'waag' ? 5 : 0; render(); }, 'Achse');
        const rot = range(c2, { label: 'Drehwinkel', min: 0, max: 360, step: 15, value: S.rot, fmt: v => v + '°', onInput: v => { S.rot = v; render(); } });
        const qz = div(c2, 'b-ctrl g5-acts');
        qz.innerHTML = ['Spiegelung', 'Verschiebung', 'Drehung'].map((l, i) => '<button type="button" class="b-btn" data-q="' + i + '">' + l + '</button>').join('') + '<button type="button" class="b-btn b-go" data-q="neu">Neues Rätsel</button>';
        qz.addEventListener('click', e => {
            const b = e.target.closest('[data-q]'); if (!b) return;
            if (b.dataset.q === 'neu') newQuiz(); else S.answer = +b.dataset.q;
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', '');
        heroOnly(box, pic, [ctr, c2, out, help]);
        if (isHero(box)) two.style.display = 'block';
        const U = 34, NX = 14, NY = 9, O = [16, 16 + NY * U];
        const P = p => [O[0] + p[0] * U, O[1] - p[1] * U];
        const back = (x, y) => [(x - O[0]) / U, (O[1] - y) / U];
        dragSVG(pic, (i, x, y) => {
            const q = back(x, y);
            if (S.mode === 'spiegel') {
                if (S.axis === 'senk') S.k = Math.min(Math.max(Math.round(q[0] * 2) / 2, 2.5), 8);
                else if (S.axis === 'waag') S.k = Math.min(Math.max(Math.round(q[1] * 2) / 2, 2.5), 5.5);
                else S.k = Math.min(Math.max(Math.round(q[1] - q[0]), -2), 2);
            } else if (S.mode === 'schieb') {
                S.v = [Math.min(Math.max(Math.round(q[0] - 5), -2), 9), Math.min(Math.max(Math.round(q[1] - 1), -1), 5)];
            }
            render();
        });
        const ZC = [6, 4];   // centre of the rotation
        const mirror = p => S.axis === 'senk' ? [2 * S.k - p[0], p[1]] : S.axis === 'waag' ? [p[0], 2 * S.k - p[1]] : [p[1] - S.k, p[0] + S.k];
        const shift = p => [p[0] + S.v[0], p[1] + S.v[1]];
        const turn = (p, a, Z) => { const c = Math.cos(a * DEG), s = Math.sin(a * DEG), d = sub(p, Z); return [Z[0] + c * d[0] - s * d[1], Z[1] + s * d[0] + c * d[1]]; };
        function newQuiz() {
            const t = rnd(0, 2);
            const base = [[1, 1], [4, 1], [4, 3], [2, 5]].map(p => add(p, [rnd(0, 1), rnd(0, 1)]));
            let img;
            if (t === 0) { const k = rnd(6, 7) + 0.5; img = base.map(p => [2 * k - p[0], p[1]]); }
            else if (t === 1) { const v = [rnd(5, 7), rnd(-1, 2)]; img = base.map(p => add(p, v)); }
            else { const Z = [6, 5], a = [90, 180][rnd(0, 1)]; img = base.map(p => turn(p, a, Z)); }
            S.quiz = { t, base, img }; S.answer = null;
        }
        const label = (p, n, col, dx, dy) => T(P(p)[0] + (dx || 0), P(p)[1] + (dy || 0), n, 'g-pt', 'middle', ' style="fill:' + col + ';font-size:13px"');
        const cxy = p => '(' + fmt(p[0], 1) + ' | ' + fmt(p[1], 1) + ')';
        function render() {
            axSeg.el.style.display = S.mode === 'spiegel' ? '' : 'none';
            rot.input.parentNode.style.display = S.mode === 'dreh' ? '' : 'none';
            qz.style.display = S.mode === 'quiz' ? '' : 'none';
            help.textContent = { spiegel: 'Zieh an der Spiegelachse. Jeder Bildpunkt liegt auf der Senkrechten zur Achse, gleich weit von ihr entfernt.', schieb: 'Zieh an der Pfeilspitze: Jeder Punkt wird um denselben Pfeil verschoben.', dreh: 'Stell den Drehwinkel ein. Gedreht wird gegen den Uhrzeigersinn um den Punkt Z.', quiz: 'Welche Bewegung bringt die gelbe Figur auf die grüne?' }[S.mode];
            let s = '';
            for (let i = 0; i <= NX; i++) s += line(P([i, 0]), P([i, NY]), 'stroke:' + CY + ';stroke-opacity:0.13;stroke-width:1');
            for (let j = 0; j <= NY; j++) s += line(P([0, j]), P([NX, j]), 'stroke:' + CY + ';stroke-opacity:0.13;stroke-width:1');
            s += line(P([0, 0]), P([NX + 0.4, 0]), 'stroke:' + DIM + ';stroke-width:1.4') + line(P([0, 0]), P([0, NY + 0.4]), 'stroke:' + DIM + ';stroke-width:1.4');
            for (let i = 2; i <= NX; i += 2) s += T(P([i, 0])[0], P([i, 0])[1] + 14, i, 'g-small');
            for (let j = 2; j <= NY; j += 2) s += T(P([0, j])[0] - 9, P([0, j])[1] + 5, j, 'g-small');
            let orig = FIG, img;
            if (S.mode === 'quiz') { orig = S.quiz.base; img = S.quiz.img; }
            else if (S.mode === 'spiegel') img = FIG.map(mirror);
            else if (S.mode === 'schieb') img = FIG.map(shift);
            else img = FIG.map(p => turn(p, S.rot, ZC));
            s += poly(orig.map(P), area(LAM, 0.2)) + poly(img.map(P), area(PHI, 0.2));
            if (S.mode !== 'quiz') {
                orig.forEach((p, i) => { s += label(p, NAMES[i], LAM, -10, -8); s += label(img[i], NAMES[i] + '′', PHI, 12, -8); });
            }
            if (S.mode === 'spiegel') {
                orig.forEach((p, i) => { s += line(P(p), P(img[i]), 'stroke:' + TXT + ';stroke-width:1;stroke-dasharray:3 4;opacity:0.6'); });
                let a0, a1, hp;
                if (S.axis === 'senk') { a0 = [S.k, 0]; a1 = [S.k, NY]; hp = [S.k, NY - 0.6]; }
                else if (S.axis === 'waag') { a0 = [0, S.k]; a1 = [NX, S.k]; hp = [NX - 0.6, S.k]; }
                else { a0 = [Math.max(0, -S.k), Math.max(0, S.k)]; a1 = [Math.min(NX, NY - S.k), Math.min(NY, NX + S.k)]; hp = [a1[0] - 0.8, a1[1] - 0.8]; }
                s += line(P(a0), P(a1), 'stroke:' + CY + ';stroke-width:2.6;stroke-dasharray:9 6');
                s += handle(P(hp), 0, CY);
            } else if (S.mode === 'schieb') {
                const from = P(FIG[1]), to = P(add(FIG[1], S.v));
                s += line(from, to, 'stroke:' + CY + ';stroke-width:2.6') + dot(to, CY, 4);
                orig.forEach((p, i) => { if (i) s += line(P(p), P(img[i]), 'stroke:' + CY + ';stroke-width:1;stroke-dasharray:3 4;opacity:0.5'); });
                s += handle(to, 0, CY);
            } else if (S.mode === 'dreh') {
                s += line(P(ZC), P(FIG[2]), 'stroke:' + TXT + ';stroke-width:1;stroke-dasharray:3 4;opacity:0.6') + line(P(ZC), P(img[2]), 'stroke:' + TXT + ';stroke-width:1;stroke-dasharray:3 4;opacity:0.6');
                s += dot(P(ZC), CY, 5) + label(ZC, 'Z', CY, -12, 16);
            }
            pic.innerHTML = svg(NX * U + 40, NY * U + 56, s, 'Figur und Bildfigur im Koordinatensystem');
            if (S.mode === 'spiegel') {
                const ax = S.axis === 'senk' ? 'x = ' + fmt(S.k, 1) : S.axis === 'waag' ? 'y = ' + fmt(S.k, 1) : 'schräg durch (0 | ' + S.k + ')';
                out.innerHTML = '<p>Spiegelachse ' + ax + '</p>' + FIG.map((p, i) => '<p>' + NAMES[i] + cxy(p) + ' → ' + NAMES[i] + '′' + cxy(img[i]) + '</p>').join('') +
                    '<p class="g5-dim">Die Bildfigur ist gleich groß, aber <b>umgeklappt</b>: Der Umlaufsinn A → B → C → D dreht sich um.</p>';
            } else if (S.mode === 'schieb') {
                out.innerHTML = '<p>Jeder Punkt wandert ' + Math.abs(S.v[0]) + ' nach ' + (S.v[0] < 0 ? 'links' : 'rechts') + ' und ' + Math.abs(S.v[1]) + ' nach ' + (S.v[1] < 0 ? 'unten' : 'oben') + '.</p>' +
                    FIG.map((p, i) => '<p>' + NAMES[i] + cxy(p) + ' → ' + NAMES[i] + '′' + cxy(img[i]) + '</p>').join('');
            } else if (S.mode === 'dreh') {
                out.innerHTML = '<p>Drehung um Z' + cxy(ZC) + ' um ' + S.rot + '°.</p><p>Jeder Punkt bleibt gleich weit von Z entfernt. Die Figur wird nicht umgeklappt.</p>';
            } else {
                const NM = ['eine Spiegelung', 'eine Verschiebung', 'eine Drehung'];
                out.innerHTML = S.answer == null ? '<p>Tippe auf deine Antwort.</p>' :
                    S.answer === S.quiz.t ? '<p class="g-ok">Richtig, es ist ' + NM[S.quiz.t] + '.</p>' :
                        '<p class="g-warn">Nicht ganz. Es ist ' + NM[S.quiz.t] + '.</p><p class="g5-dim">Tipp: Ist die Figur umgeklappt, ist es eine Spiegelung. Zeigen alle Seiten in dieselbe Richtung wie vorher, ist es eine Verschiebung.</p>';
            }
        }
        if (S.mode === 'quiz') newQuiz();
        render();
    });

    /* ---------- rectangle: area and perimeter ---------- */
    W('rechteck5', function (box) {
        const S = { a: +(box.dataset.a || 6), b: +(box.dataset.b || 4), mode: box.dataset.mode || 'rechteck', c: 3, d: 2, way: 'zerlegen' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['rechteck', 'Rechteck'], ['l', 'Zusammengesetzte Figur']], S.mode, v => { S.mode = v; if (v === 'l') { S.a = Math.max(S.a, 6); S.b = Math.max(S.b, 4); } render(); }, 'Figur');
        const c2 = div(box, 'b-ctrls');
        const waySeg = seg(c2, [['zerlegen', 'Zerlegen'], ['ergaenzen', 'Ergänzen']], S.way, v => { S.way = v; render(); }, 'Weg');
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.');
        heroOnly(box, pic, [ctr, c2, out, help]);
        if (isHero(box)) two.style.display = 'block';
        const U = 36, O = [20, 20];
        dragSVG(pic, (i, x, y) => {
            const gx = Math.round((x - O[0]) / U), gy = Math.round((y - O[1]) / U);
            if (i === '0') { S.a = Math.min(Math.max(gx, 1), 12); S.b = Math.min(Math.max(gy, 1), 7); }
            else { S.c = Math.min(Math.max(S.a - gx, 1), S.a - 1); S.d = Math.min(Math.max(gy, 1), S.b - 1); }
            if (S.mode === 'l') { S.a = Math.max(S.a, 2); S.b = Math.max(S.b, 2); S.c = Math.min(S.c, S.a - 1); S.d = Math.min(S.d, S.b - 1); }
            render();
        });
        function render() {
            waySeg.el.style.display = S.mode === 'l' ? '' : 'none';
            const { a, b } = S, X = v => O[0] + v * U, Y = v => O[1] + v * U;
            let s = '';
            for (let i = 0; i <= 12; i++) s += line([X(i), Y(0)], [X(i), Y(7)], 'stroke:' + CY + ';stroke-opacity:0.1;stroke-width:1');
            for (let j = 0; j <= 7; j++) s += line([X(0), Y(j)], [X(12), Y(j)], 'stroke:' + CY + ';stroke-opacity:0.1;stroke-width:1');
            if (S.mode === 'rechteck') {
                for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) s += rect(X(i) + 2, Y(j) + 2, U - 4, U - 4, 'fill:' + rgba(LAM, j % 2 === i % 2 ? 0.22 : 0.15) + ';stroke:none');
                s += rect(X(0), Y(0), a * U, b * U, 'fill:none;stroke:' + LAM + ';stroke-width:2.6');
                s += T(X(a / 2), Y(b) + 22, 'a = ' + a + ' cm', 'g-val') + T(X(a) + 10, Y(b / 2) + 5, 'b = ' + b + ' cm', 'g-val', 'start');
                s += handle([X(a), Y(b)], 0, LAM);
                pic.innerHTML = svg(12 * U + 110, 7 * U + 50, s, 'Rechteck aus ' + a * b + ' Einheitsquadraten');
                out.innerHTML = '<p class="g5-big">A = ' + a * b + ' cm²</p><p>$A = a \\cdot b = ' + a + ' \\text{ cm} \\cdot ' + b + ' \\text{ cm} = ' + a * b + ' \\text{ cm}^2$</p>' +
                    '<p>Das sind ' + b + ' Reihen mit je ' + a + ' Kästchen.</p><hr class="g5-hr"><p class="g5-big">u = ' + (2 * a + 2 * b) + ' cm</p>' +
                    '<p>$u = 2 \\cdot a + 2 \\cdot b = 2 \\cdot ' + a + ' \\text{ cm} + 2 \\cdot ' + b + ' \\text{ cm} = ' + (2 * a + 2 * b) + ' \\text{ cm}$</p>' +
                    (a === b ? '<p class="g-ok">Ein Quadrat: alle vier Seiten gleich lang.</p>' : '');
            } else {
                const { c, d } = S;   // the cut-out at the top right: c wide, d high
                const L = [[0, 0], [a - c, 0], [a - c, d], [a, d], [a, b], [0, b]];
                const Lp = L.map(p => [X(p[0]), Y(p[1])]);
                if (S.way === 'zerlegen') {
                    s += rect(X(0), Y(0), (a - c) * U, b * U, area(LAM, 0.2)) + rect(X(a - c), Y(d), c * U, (b - d) * U, area(CY, 0.2));
                    s += T(X((a - c) / 2), Y(b / 2) + 6, '①', 'g-val') + T(X(a - c / 2), Y((b + d) / 2) + 6, '②', 'g-val');
                } else {
                    s += rect(X(0), Y(0), a * U, b * U, area(PHI, 0.12)) + rect(X(a - c), Y(0), c * U, d * U, 'fill:rgba(226,102,90,0.22);stroke:' + RED + ';stroke-width:1.4;stroke-dasharray:5 4');
                    s += T(X(a - c / 2), Y(d / 2) + 6, '−', 'g-pt', 'middle', ' style="fill:' + RED + '"');
                }
                s += poly(Lp, 'fill:none;stroke:' + LAM + ';stroke-width:2.6');
                s += T(X(a / 2), Y(b) + 22, a + ' cm', 'g-val') + T(X(0) - 4, Y(b / 2) + 5, b + ' cm', 'g-val', 'end');
                s += T(X(a - c / 2), Y(d) - 8, c + ' cm', 'g-small') + T(X(a) + 8, Y(d / 2) + 5, d + ' cm', 'g-small', 'start');
                s += handle([X(a), Y(b)], 0, LAM) + handle([X(a - c), Y(d)], 1, CY);
                pic.innerHTML = svg(12 * U + 110, 7 * U + 50, s, 'Zusammengesetzte Figur');
                const A = a * b - c * d;
                out.innerHTML = '<p class="g5-big">A = ' + A + ' cm²</p>' + (S.way === 'zerlegen'
                    ? '<p>Zerlegen in zwei Rechtecke:</p><p>① ' + (a - c) + ' cm · ' + b + ' cm = ' + (a - c) * b + ' cm²</p><p>② ' + c + ' cm · ' + (b - d) + ' cm = ' + c * (b - d) + ' cm²</p><p>Zusammen ' + A + ' cm²</p>'
                    : '<p>Zum großen Rechteck ergänzen und das fehlende Stück abziehen:</p><p>' + a + ' cm · ' + b + ' cm − ' + c + ' cm · ' + d + ' cm = ' + a * b + ' cm² − ' + c * d + ' cm² = ' + A + ' cm²</p>') +
                    '<hr class="g5-hr"><p class="g5-big">u = ' + (2 * a + 2 * b) + ' cm</p><p class="g5-dim">Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.</p>';
            }
            math(out);
        }
        render();
    });

    /* ---------- cuboid: oblique view, net, unit cubes ---------- */
    W('quader5', function (box) {
        const S = { a: +(box.dataset.a || 4), b: +(box.dataset.b || 3), c: +(box.dataset.c || 2), mode: box.dataset.mode || 'schraeg' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['schraeg', 'Schrägbild'], ['netz', 'Netz'], ['wuerfel', 'Einheitswürfel']], S.mode, v => { S.mode = v; render(); }, 'Ansicht');
        const sl = div(box, '');
        const ra = range(sl, { label: 'Länge a (cm)', min: 1, max: 6, step: 1, value: S.a, fmt: v => v, onInput: v => { S.a = v; render(); } });
        const rb = range(sl, { label: 'Breite b (cm)', min: 1, max: 6, step: 1, value: S.b, fmt: v => v, onInput: v => { S.b = v; render(); } });
        const rc = range(sl, { label: 'Höhe c (cm)', min: 1, max: 6, step: 1, value: S.c, fmt: v => v, onInput: v => { S.c = v; render(); } });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        heroOnly(box, pic, [ctr, sl, out]);
        if (isHero(box)) two.style.display = 'block';
        function render() {
            const { a, b, c } = S;
            let s, Wd, Ht;
            if (S.mode === 'netz') {
                const u = Math.min(300 / (2 * c + a), 380 / (2 * c + 2 * b), 34), X = v => 10 + v * u, Y = v => 10 + v * u;
                const F = [
                    [c, 0, a, c, CY, 'hinten'], [c, c, a, b, LAM, 'oben'], [c, c + b, a, c, CY, 'vorn'], [c, 2 * c + b, a, b, LAM, 'unten'],
                    [0, c, c, b, PHI, 'links'], [c + a, c, c, b, PHI, 'rechts']];
                s = F.map(([x, y, w, h, col, n]) => rect(X(x), Y(y), w * u, h * u, area(col, 0.18)) + (w * u > 38 && h * u > 22 ? T(X(x + w / 2), Y(y + h / 2) + 5, n, 'g-small') : '')).join('');
                Wd = X(2 * c + a) + 10; Ht = Y(2 * c + 2 * b) + 10;
            } else {
                const u = Math.min(300 / (a + 0.36 * b), 230 / (c + 0.36 * b), 46);
                const P = obl([16, 16 + u * (c + 0.36 * b)], u);
                s = '';
                if (S.mode === 'wuerfel') s += cubes(P, a, b, c, CY, 0.12);
                const E = (p, q, hid) => line(P(...p), P(...q), 'stroke:' + (hid ? DIM : LAM) + ';stroke-width:' + (hid ? 1.4 : 2.4) + (hid ? ';stroke-dasharray:5 4' : '') + ';stroke-linecap:round');
                if (S.mode === 'schraeg') {
                    s += poly([P(0, 0, 0), P(a, 0, 0), P(a, 0, c), P(0, 0, c)], area(LAM, 0.12));
                    s += E([0, b, 0], [a, b, 0], 1) + E([0, b, 0], [0, b, c], 1) + E([0, 0, 0], [0, b, 0], 1);
                }
                [[[0, 0, 0], [a, 0, 0]], [[a, 0, 0], [a, 0, c]], [[a, 0, c], [0, 0, c]], [[0, 0, c], [0, 0, 0]], [[0, 0, c], [0, b, c]], [[a, 0, c], [a, b, c]], [[a, 0, 0], [a, b, 0]], [[0, b, c], [a, b, c]], [[a, b, 0], [a, b, c]]]
                    .forEach(([p, q]) => { s += E(p, q); });
                const la = P(a / 2, 0, 0), lb = P(a, b / 2, 0), lc = P(0, 0, c / 2);
                s += T(la[0], la[1] + 20, 'a', 'g-side') + T(lb[0] + 12, lb[1] + 12, 'b', 'g-side', 'start') + T(lc[0] - 10, lc[1] + 5, 'c', 'g-side', 'end');
                Wd = P(a, b, 0)[0] + 30; Ht = P(0, 0, 0)[1] + 30;
            }
            pic.innerHTML = svg(Math.ceil(Wd), Math.ceil(Ht), s, 'Quader ' + a + ' mal ' + b + ' mal ' + c);
            const V = a * b * c, O2 = 2 * (a * b + a * c + b * c);
            out.innerHTML = '<p class="g5-big">V = ' + V + ' cm³</p><p>$V = a \\cdot b \\cdot c = ' + a + ' \\cdot ' + b + ' \\cdot ' + c + ' \\text{ cm}^3$</p>' +
                (S.mode === 'wuerfel' ? '<p>' + c + ' Schicht' + (c > 1 ? 'en' : '') + ' mit je ' + a + ' · ' + b + ' = ' + a * b + ' Würfeln.</p>' : '') +
                '<hr class="g5-hr"><p class="g5-big">O = ' + O2 + ' cm²</p><p>$O = 2 \\cdot (ab + ac + bc) = 2 \\cdot (' + a * b + ' + ' + a * c + ' + ' + b * c + ')\\text{ cm}^2$</p>' +
                (S.mode === 'netz' ? '<p class="g5-dim">Gegenüberliegende Flächen haben dieselbe Farbe: Sie sind gleich groß.</p>' : '<p class="g5-dim">Alle 12 Kanten zusammen: 4 · (a + b + c) = ' + 4 * (a + b + c) + ' cm</p>') +
                (a === b && b === c ? '<p class="g-ok">Alle Kanten gleich lang: ein Würfel.</p>' : '');
            math(out);
        }
        render();
    });

    /* ---------- the unit staircase ---------- */
    W('einheiten5', function (box) {
        const KINDS = {
            laenge: { name: 'Länge', u: ['km', 'm', 'dm', 'cm', 'mm'], f: [1000, 10, 10, 10] },
            masse: { name: 'Masse', u: ['t', 'kg', 'g', 'mg'], f: [1000, 1000, 1000] },
            zeit: { name: 'Zeit', u: ['d', 'h', 'min', 's'], f: [24, 60, 60] },
            flaeche: { name: 'Fläche', u: ['km²', 'ha', 'a', 'm²', 'dm²', 'cm²', 'mm²'], f: [100, 100, 100, 100, 100, 100] },
            volumen: { name: 'Volumen', u: ['m³', 'dm³ = l', 'cm³ = ml', 'mm³'], f: [1000, 1000, 1000] }
        };
        const S = { kind: box.dataset.kind || 'laenge', v: '3,5', from: 0, to: 1 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, Object.keys(KINDS).map(k => [k, KINDS[k].name]), S.kind, v => { S.kind = v; S.from = 0; S.to = 1; build(); render(); }, 'Größe');
        const c2 = div(box, 'b-ctrls');
        c2.innerHTML = '<span class="b-ctrl"><input class="b-in g5-in" type="text" inputmode="decimal" value="' + S.v + '" aria-label="Wert"> <select class="b-in g5-sel" data-s="from" aria-label="von Einheit"></select></span>' +
            '<span class="b-ctrl">in <select class="b-in g5-sel" data-s="to" aria-label="in Einheit"></select></span>';
        const vin = c2.querySelector('input'), sf = c2.querySelector('[data-s="from"]'), stt = c2.querySelector('[data-s="to"]');
        vin.addEventListener('input', () => { S.v = vin.value; render(); });
        sf.addEventListener('change', () => { S.from = +sf.value; render(); });
        stt.addEventListener('change', () => { S.to = +stt.value; render(); });
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        heroOnly(box, pic, [ctr, c2, out]);
        function build() {
            const K = KINDS[S.kind];
            const opts = K.u.map((u, i) => '<option value="' + i + '">' + u.split(' ')[0] + '</option>').join('');
            sf.innerHTML = opts; stt.innerHTML = opts; sf.value = S.from; stt.value = S.to;
        }
        function render() {
            const K = KINDS[S.kind], n = K.u.length, sw = Math.min(520 / n, 110), sh = 34;
            const i0 = S.from, i1 = S.to, lo = Math.min(i0, i1), hi = Math.max(i0, i1);
            let s = '';
            for (let i = 0; i < n; i++) {
                const x = 10 + i * sw, y = 20 + i * sh, on = i === i0 || i === i1;
                s += rect(x, y, sw - 6, sh * (n - i) + 6, 'fill:' + rgba(i === i0 ? LAM : i === i1 ? PHI : CY, on ? 0.25 : 0.08) + ';stroke:' + (i === i0 ? LAM : i === i1 ? PHI : CY) + ';stroke-width:' + (on ? 2 : 1));
                s += T(x + (sw - 6) / 2, y + 20, K.u[i].split(' ')[0], 'g-pt', 'middle', on ? ' style="fill:' + (i === i0 ? LAM : PHI) + '"' : '');
                if (i < n - 1) {
                    const act = i >= lo && i < hi;
                    // the factor sits above the next, lower step
                    s += T(x + sw + (sw - 6) / 2, y + sh - 8, (i0 > i1 ? ': ' : '· ') + K.f[i], 'g-small', 'middle', act ? ' style="fill:#fff;font-weight:700"' : '');
                }
            }
            pic.innerHTML = svg(20 + n * sw, 40 + n * sh + 16, s, 'Einheitentreppe ' + K.name);
            const v = B.parseAnswer(S.v);
            if (isNaN(v)) { out.innerHTML = '<p class="g-warn">Bitte eine Zahl eingeben, zum Beispiel 3,5.</p>'; return; }
            let r = v, steps = [];
            if (i1 > i0) for (let i = i0; i < i1; i++) { r *= K.f[i]; steps.push('· ' + K.f[i]); }
            else for (let i = i0 - 1; i >= i1; i--) { r /= K.f[i]; steps.push(': ' + K.f[i]); }
            const unit = i => K.u[i].split(' ')[0];
            out.innerHTML = '<p class="g5-big">' + dec(v, 6) + ' ' + unit(i0) + ' = ' + dec(r, 6) + ' ' + unit(i1) + '</p>' +
                (steps.length ? '<p>Rechnung: ' + dec(v, 6) + ' ' + steps.join(' ') + ' = ' + dec(r, 6) + '</p><p class="g5-dim">' +
                    (i1 > i0 ? 'Treppe hinunter zur kleineren Einheit: Die Maßzahl wird größer, man <b>multipliziert</b>.' : 'Treppe hinauf zur größeren Einheit: Die Maßzahl wird kleiner, man <b>dividiert</b>.') + '</p>' : '<p>Gleiche Einheit, nichts zu tun.</p>') +
                (S.kind === 'flaeche' ? '<p class="g5-dim">Bei Flächen ist die Umrechnungszahl immer 100.</p>' : S.kind === 'volumen' ? '<p class="g5-dim">Bei Volumen ist die Umrechnungszahl immer 1000.</p>' : S.kind === 'zeit' ? '<p class="g5-dim">Achtung: Bei der Zeit gibt es keine Zehnerschritte.</p>' : '');
        }
        build(); render();
    });

    /* ---------- numerals: Egypt, Rome, Maya, binary ---------- */
    W('zahlschrift5', function (box) {
        const S = { v: +(box.dataset.v || 2026), mode: box.dataset.mode || 'maya' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['aegypten', 'Ägypten'], ['rom', 'Rom'], ['maya', 'Maya'], ['binaer', 'Zweiersystem']], S.mode, v => { S.mode = v; render(); }, 'Zahlschrift');
        const sl = div(box, '');
        const rv = range(sl, { label: 'Zahl', min: 1, max: 3999, step: 1, value: S.v, fmt: v => grp(v), onInput: v => { S.v = v; render(); } });
        const st = div(sl, 'b-ctrl');
        st.innerHTML = '<span class="b-stepper"><button type="button" data-d="-1" aria-label="eins weniger">−</button><button type="button" data-d="1" aria-label="eins mehr">+</button></span>';
        st.addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; S.v = Math.min(Math.max(S.v + +b.dataset.d, 1), 3999); rv.set(S.v); render(); });
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        heroOnly(box, pic, [ctr, sl, out]);
        // Egyptian signs drawn as simple strokes: 1 stroke, 10 heel bone, 100 coil of rope, 1000 lotus
        const EG = {
            1: (x, y) => '<path d="M' + x + ' ' + (y - 22) + ' L' + x + ' ' + (y + 22) + '" style="stroke:' + LAM + ';stroke-width:4;stroke-linecap:round"/>',
            10: (x, y) => '<path d="M' + (x - 12) + ' ' + (y + 22) + ' L' + (x - 12) + ' ' + (y - 6) + ' A12 14 0 0 1 ' + (x + 12) + ' ' + (y - 6) + ' L' + (x + 12) + ' ' + (y + 22) + '" style="fill:none;stroke:' + CY + ';stroke-width:3.4;stroke-linecap:round"/>',
            100: (x, y) => '<path d="M' + x + ' ' + (y + 22) + ' L' + x + ' ' + (y + 4) + ' M' + x + ' ' + (y + 4) + ' a12 12 0 1 1 1 0 M' + (x + 1) + ' ' + (y + 4) + ' a7 7 0 1 0 -1 -14 a3 3 0 1 0 2 4" style="fill:none;stroke:' + PHI + ';stroke-width:3;stroke-linecap:round"/>',
            1000: (x, y) => '<path d="M' + x + ' ' + (y + 22) + ' L' + x + ' ' + (y - 4) + ' M' + x + ' ' + (y - 4) + ' Q' + (x - 16) + ' ' + (y - 8) + ' ' + (x - 12) + ' ' + (y - 22) + ' M' + x + ' ' + (y - 4) + ' Q' + (x + 16) + ' ' + (y - 8) + ' ' + (x + 12) + ' ' + (y - 22) + ' M' + x + ' ' + (y - 4) + ' L' + x + ' ' + (y - 24) + ' M' + (x - 10) + ' ' + (y + 22) + ' L' + (x + 10) + ' ' + (y + 22) + '" style="fill:none;stroke:' + VIO + ';stroke-width:3;stroke-linecap:round"/>'
        };
        function roman(n) {
            const T2 = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
            const parts = [];
            T2.forEach(([v, s]) => { while (n >= v) { parts.push([v, s]); n -= v; } });
            return parts;
        }
        function render() {
            const v = S.v;
            let s = '', Wd = 540, Ht = 120, txtOut = '';
            if (S.mode === 'aegypten') {
                const groups = [[1000, Math.floor(v / 1000)], [100, Math.floor(v / 100) % 10], [10, Math.floor(v / 10) % 10], [1, v % 10]].filter(g => g[1]);
                let x = 26;
                groups.forEach(([p, k]) => {
                    const rows = k > 5 ? 2 : 1, perRow = Math.ceil(k / rows), w = p === 1 ? 14 : 32;
                    for (let i = 0; i < k; i++) { const r2 = Math.floor(i / perRow), c = i % perRow; s += EG[p](x + c * w, 46 + r2 * 56); }
                    x += perRow * w + 24;
                });
                Wd = Math.max(200, x); Ht = groups.some(g => g[1] > 5) ? 140 : 90;
                txtOut = '<p>' + groups.map(([p, k]) => k + ' · ' + grp(p)).join(' + ') + ' = ' + grp(v) + '</p>' +
                    '<p class="g5-dim">Jedes Zeichen wird so oft hingeschrieben, wie es gebraucht wird. Die Reihenfolge ist egal, eine Null braucht man nicht. Strich 1, Fessel 10, Seil 100, Lotus 1000.</p>';
            } else if (S.mode === 'rom') {
                const parts = roman(v), str = parts.map(p => p[1]).join('');
                s = T(270, 70, str, 'g5-roman');
                Ht = 100;
                txtOut = '<p>' + parts.map(p => p[1] + ' = ' + grp(p[0])).join(' · ') + '</p>' +
                    '<p class="g5-dim">I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen: IV = 4, XC = 90, CM = 900.</p>';
            } else if (S.mode === 'maya') {
                const lv = [Math.floor(v / 8000) % 20, Math.floor(v / 400) % 20, Math.floor(v / 20) % 20, v % 20];
                let first = lv.findIndex(x => x > 0); if (first < 0) first = 3;
                const used = lv.slice(first), PV = [8000, 400, 20, 1].slice(first);
                const big = isHero(box), step = big ? 96 : 70;
                used.forEach((d, i) => {
                    const y = (big ? 52 : 40) + i * step;
                    if (big) { s += mayaDigit(d, 110, y, 46, LAM); return; }
                    s += line([150, y + 35], [390, y + 35], 'stroke:' + DIM + ';stroke-width:1;stroke-dasharray:3 5;opacity:0.5');
                    s += mayaDigit(d, 270, y, 26, LAM) + T(430, y + 6, d + ' · ' + grp(PV[i]), 'g-lab', 'start');
                });
                Ht = (big ? 20 : 40) + used.length * step;
                if (big) Wd = 220;
                txtOut = '<p>' + used.map((d, i) => d + ' · ' + grp(PV[i])).join(' + ') + ' = ' + grp(v) + '</p>' +
                    '<p class="g5-dim">Die Maya zählten mit Zwanzigern. Punkt = 1, Strich = 5. Von unten nach oben ist jede Stufe zwanzigmal so viel wert. Für eine leere Stufe hatten sie ein Zeichen für die Null, die Muschel.</p>';
            } else {
                const bits = v.toString(2), n = bits.length, w = Math.min(44, 520 / n);
                [...bits].forEach((b2, i) => {
                    const x = 20 + i * w, pv = Math.pow(2, n - 1 - i);
                    s += rect(x, 20, w - 6, w - 6, 'fill:' + (b2 === '1' ? rgba(LAM, 0.35) : 'rgba(0,0,0,0.2)') + ';stroke:' + (b2 === '1' ? LAM : DIM) + ';stroke-width:1.4');
                    s += T(x + (w - 6) / 2, 20 + (w - 6) / 2 + 6, b2, 'g-pt');
                    s += T(x + (w - 6) / 2, 20 + w + 14, grp(pv), 'g-small', 'middle', ' style="font-size:' + (w < 36 ? 10 : 12) + 'px"');
                });
                Wd = 40 + n * w; Ht = w + 50;
                txtOut = '<p class="g5-big">' + bits + '</p><p>' + [...bits].map((b2, i) => b2 === '1' ? grp(Math.pow(2, n - 1 - i)) : null).filter(Boolean).join(' + ') + ' = ' + grp(v) + '</p>' +
                    '<p class="g5-dim">Im Zweiersystem gibt es nur die Ziffern 0 und 1. Jede Stelle ist doppelt so viel wert wie die rechts daneben. So rechnen Computer.</p>';
            }
            pic.innerHTML = svg(Math.ceil(Wd), Math.ceil(Ht), s, 'Die Zahl ' + v + ' in ' + S.mode);
            out.innerHTML = '<p class="g5-big">' + grp(v) + '</p>' + txtOut;
        }
        render();
    });
    /* ---------- moving the digits: · and : by powers of ten ---------- */
    W('komma5', function (box) {
        const P0 = 4, P1 = -3;   // places 10^4 … 10^-3
        let t = Math.round(B.parseAnswer(box.dataset.v || '24,5') * 1000);   // the value in thousandths
        let last = '';
        const ctr = div(box, 'b-ctrls');
        const ops = div(ctr, 'b-ctrl g5-acts');
        ops.innerHTML = [['m', 10], ['m', 100], ['m', 1000], ['d', 10], ['d', 100], ['d', 1000]].map(([o, k]) => '<button type="button" class="b-btn" data-o="' + o + '" data-k="' + k + '">' + (o === 'm' ? '· ' : ': ') + k + '</button>').join('') +
            '<button type="button" class="b-btn" data-o="r">Neu</button>';
        const wrap = div(box, 'g5-sw-wrap'), out = div(box, 'b-out');
        div(box, 'b-help', 'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.');
        ops.addEventListener('click', e => {
            const b = e.target.closest('[data-o]'); if (!b) return;
            const k = +b.dataset.k, o = b.dataset.o;
            if (o === 'r') { t = Math.round(B.parseAnswer(box.dataset.v || '24,5') * 1000); last = ''; }
            else if (o === 'm' && t * k < 1e8) { last = dec(t / 1000, 3) + ' · ' + k; t *= k; }
            else if (o === 'd' && t % k === 0) { last = dec(t / 1000, 3) + ' : ' + k; t /= k; }
            else { last = 'nicht möglich: Die Ziffern würden aus der Tafel fallen.'; }
            render();
        });
        function render() {
            const digits = {};
            for (let p = P0; p >= P1; p--) digits[p] = Math.floor(t / Math.pow(10, p + 3)) % 10;
            let hi = P0; while (hi > 0 && digits[hi] === 0) hi--;
            let lo = P1; while (lo < 0 && digits[lo] === 0) lo++;
            const names = { 4: 'ZT', 3: 'T', 2: 'H', 1: 'Z', 0: 'E', '-1': 'z', '-2': 'h', '-3': 't' };
            let h = '<table class="g5-sw g5-sw-dez"><tr>';
            for (let p = P0; p >= P1; p--) h += '<th class="' + (p < 0 ? 'g5-sw-frac' : '') + (p === 0 ? ' g5-sw-e' : '') + '">' + names[p] + '</th>';
            h += '</tr><tr class="g5-sw-d">';
            for (let p = P0; p >= P1; p--) h += '<td class="' + (p === 0 ? 'g5-sw-e' : '') + (p > hi || p < lo ? ' g5-sw-off' : '') + '">' + digits[p] + '</td>';
            wrap.innerHTML = h + '</tr></table>';
            out.innerHTML = (last && last.indexOf('nicht') < 0 ? '<p>' + last + ' =</p>' : last ? '<p class="g-warn">' + last + '</p>' : '') + '<p class="g5-big">' + dec(t / 1000, 3) + '</p>';
        }
        render();
    });

    /* ---------- the mean as levelling ---------- */
    W('mittel5', function (box) {
        const S = { v: (box.dataset.v || '6,3,8,2,6').split(',').map(Number), even: false };
        const ctr = div(box, 'b-ctrls');
        const acts = div(ctr, 'b-ctrl g5-acts');
        acts.innerHTML = '<button type="button" class="b-btn b-go" data-a="even">Ausgleichen</button><button type="button" class="b-btn" data-a="back">Zurück</button><button type="button" class="b-btn" data-a="rnd">Neue Werte</button>';
        acts.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            if (b.dataset.a === 'even') S.even = true; else if (b.dataset.a === 'back') S.even = false;
            else { S.v = S.v.map(() => rnd(1, 10)); S.even = false; }
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.');
        heroOnly(box, pic, [ctr, out, help]);
        if (isHero(box)) { two.style.display = 'block'; S.even = false; }
        const X0 = 50, BW = 54, GAP = 22, Y0 = 250, U = 20;
        dragSVG(pic, (i, x, y) => { S.v[+i] = Math.min(Math.max(Math.round((Y0 - y) / U), 0), 11); S.even = false; render(); });
        function render() {
            const n = S.v.length, sum = S.v.reduce((a, b) => a + b, 0), m = sum / n;
            let s = line([X0 - 16, Y0], [X0 + n * (BW + GAP), Y0], 'stroke:' + DIM + ';stroke-width:1.6');
            for (let k = 0; k <= 11; k += 1) if (k % 2 === 0) s += T(X0 - 22, Y0 - k * U + 5, k, 'g-small', 'end');
            S.v.forEach((v, i) => {
                const x = X0 + i * (BW + GAP);
                if (S.even) {
                    const keep = Math.min(v, m);
                    s += rect(x, Y0 - keep * U, BW, keep * U, area(CY, 0.25));
                    if (v < m) s += rect(x, Y0 - m * U, BW, (m - v) * U, 'fill:' + rgba(LAM, 0.35) + ';stroke:' + LAM + ';stroke-width:1.4;stroke-dasharray:4 3');
                    if (v > m) s += rect(x, Y0 - v * U, BW, (v - m) * U, 'fill:none;stroke:' + DIM + ';stroke-width:1.2;stroke-dasharray:4 3');
                } else {
                    s += rect(x, Y0 - v * U, BW, v * U, area(CY, 0.25));
                    if (!isHero(box)) s += '<g class="g-handle" data-h="' + i + '"><rect x="' + x + '" y="' + (Y0 - v * U - 14) + '" width="' + BW + '" height="28" fill="transparent"/>' +
                        line([x + 8, Y0 - v * U], [x + BW - 8, Y0 - v * U], 'stroke:' + LAM + ';stroke-width:5;stroke-linecap:round') + '</g>';
                }
                s += T(x + BW / 2, Y0 + 22, v, 'g-val');
            });
            s += line([X0 - 16, Y0 - m * U], [X0 + n * (BW + GAP), Y0 - m * U], 'stroke:' + PHI + ';stroke-width:2;stroke-dasharray:8 5');
            s += T(X0 + n * (BW + GAP) + 6, Y0 - m * U + 5, 'Mittelwert', 'g-small', 'start', ' style="fill:' + PHI + '"');
            pic.innerHTML = svg(X0 + n * (BW + GAP) + 86, Y0 + 36, s, 'Säulen mit dem Mittelwert');
            out.innerHTML = '<p class="g5-big">Mittelwert ' + fmt(m, 2) + '</p><p>Summe: ' + S.v.join(' + ') + ' = ' + sum + '</p><p>Geteilt durch die Anzahl: ' + sum + ' : ' + n + ' = ' + fmt(m, 2) + '</p>' +
                (S.even ? '<p class="g5-dim">Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).</p>' : '');
        }
        render();
    });
    /* ---------- coordinate system: points, lines, parallel and perpendicular ---------- */
    W('koord5', function (box) {
        const S = { P: [[1, 2], [7, 5], [2, 7], [6, 9]], lines: true, goal: null, hit: false };
        const NAMES = ['A', 'B', 'C', 'D'], COLS = [LAM, LAM, CY, CY];
        const ctr = div(box, 'b-ctrls');
        const acts = div(ctr, 'b-ctrl g5-acts');
        acts.innerHTML = '<button type="button" class="b-btn" data-a="lines">Geraden ein/aus</button><button type="button" class="b-btn b-go" data-a="goal">Finde den Punkt</button>';
        acts.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            if (b.dataset.a === 'lines') S.lines = !S.lines;
            else { S.goal = [rnd(0, 10), rnd(0, 10)]; S.hit = false; }
            render();
        });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Zieh die Punkte. Sie rasten auf den Gitterpunkten ein. Erst nach rechts (x), dann nach oben (y).');
        heroOnly(box, pic, [ctr, out, help]);
        if (isHero(box)) two.style.display = 'block';
        const U = 32, N = 10, O = [34, 22 + N * U];
        const P = p => [O[0] + p[0] * U, O[1] - p[1] * U];
        dragSVG(pic, (i, x, y) => {
            S.P[+i] = [Math.min(Math.max(Math.round((x - O[0]) / U), 0), N), Math.min(Math.max(Math.round((O[1] - y) / U), 0), N)];
            if (S.goal && +i === 0 && S.P[0][0] === S.goal[0] && S.P[0][1] === S.goal[1]) S.hit = true;
            render();
        });
        // a line through p and q, clipped to the grid
        function fullLine(p, q, col) {
            const d = sub(q, p); if (!d[0] && !d[1]) return '';
            const ts = [];
            [[0, 0], [0, N], [1, 0], [1, N]].forEach(([ax, v]) => { if (d[ax]) ts.push((v - p[ax]) / d[ax]); });
            const inside = ts.map(t => add(p, mul(d, t))).filter(r => r[0] >= -1e-9 && r[0] <= N + 1e-9 && r[1] >= -1e-9 && r[1] <= N + 1e-9);
            if (inside.length < 2) return '';
            inside.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            return line(P(inside[0]), P(inside[inside.length - 1]), 'stroke:' + col + ';stroke-width:1.6;opacity:0.7');
        }
        function render() {
            let s = '';
            for (let i = 0; i <= N; i++) {
                s += line(P([i, 0]), P([i, N]), 'stroke:' + CY + ';stroke-opacity:0.13;stroke-width:1') + line(P([0, i]), P([N, i]), 'stroke:' + CY + ';stroke-opacity:0.13;stroke-width:1');
                if (i) s += T(P([i, 0])[0], P([i, 0])[1] + 16, i, 'g-small') + T(P([0, i])[0] - 10, P([0, i])[1] + 5, i, 'g-small', 'end');
            }
            s += line(P([0, 0]), P([N + 0.5, 0]), 'stroke:' + TXT + ';stroke-width:1.6') + line(P([0, 0]), P([0, N + 0.5]), 'stroke:' + TXT + ';stroke-width:1.6');
            s += T(P([N + 0.5, 0])[0], P([N + 0.5, 0])[1] - 8, 'x', 'g-side') + T(P([0, N + 0.5])[0] + 12, P([0, N + 0.5])[1] + 4, 'y', 'g-side') + T(O[0] - 10, O[1] + 16, '0', 'g-small', 'end');
            const [A, Bp, C, D] = S.P;
            if (S.lines) { s += fullLine(A, Bp, LAM) + fullLine(C, D, CY); }
            s += line(P(A), P(Bp), 'stroke:' + LAM + ';stroke-width:3') + line(P(C), P(D), 'stroke:' + CY + ';stroke-width:3');
            if (S.goal && S.hit) s += '<circle cx="' + P(S.goal)[0] + '" cy="' + P(S.goal)[1] + '" r="13" style="fill:none;stroke:' + PHI + ';stroke-width:2.4;stroke-dasharray:4 3"/>';
            S.P.forEach((p, i) => { s += handle(P(p), i, COLS[i]) + T(P(p)[0] + 12, P(p)[1] - 12, NAMES[i], 'g-pt', 'start', ' style="fill:' + COLS[i] + '"'); });
            pic.innerHTML = svg(N * U + 70, N * U + 56, s, 'Koordinatensystem mit vier Punkten');
            const u = sub(Bp, A), v = sub(D, C);
            const cross = u[0] * v[1] - u[1] * v[0], dot2 = u[0] * v[0] + u[1] * v[1];
            const deg = (u[0] || u[1]) && (v[0] || v[1]);
            let rel = '';
            if (S.lines && deg) rel = cross === 0 ? '<p class="g-ok">g ∥ h: Die Geraden sind <b>parallel</b>, sie schneiden sich nie.</p>' :
                dot2 === 0 ? '<p class="g-ok">g ⊥ h: Die Geraden stehen <b>senkrecht</b> aufeinander.</p>' : '<p class="g5-dim">g und h sind weder parallel noch senkrecht. Versuche, sie parallel oder senkrecht zu stellen.</p>';
            out.innerHTML = S.P.map((p, i) => '<p><span style="color:' + COLS[i] + '">' + NAMES[i] + '</span>(' + p[0] + ' | ' + p[1] + ')</p>').join('') +
                (S.lines ? '<p class="g5-dim"><span class="g-lam">g</span> geht durch A und B, <span class="g-cy">h</span> durch C und D.</p>' : '') + rel +
                (S.goal ? (S.hit ? '<p class="g-ok">Getroffen! A liegt auf (' + S.goal[0] + ' | ' + S.goal[1] + ').</p>' : '<p><b>Aufgabe:</b> Zieh A auf den Punkt (' + S.goal[0] + ' | ' + S.goal[1] + ').</p>') : '');
        }
        render();
    });
    /* ---------- pattern workshop: symmetric pictures ---------- */
    W('symmetrie5', function (box) {
        const N = 12;
        const S = { mode: box.dataset.mode || 'senk', on: new Set(), col: 0 };
        const PAL = [LAM, CY, PHI, VIO, RED];
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['senk', 'Achse senkrecht'], ['waag', 'Achse waagerecht'], ['zwei', 'zwei Achsen'], ['punkt', 'Punkt']], S.mode, v => { S.mode = v; S.on.clear(); render(); }, 'Symmetrie');
        const c2 = div(box, 'b-ctrls');
        const pal = div(c2, 'b-ctrl g5-acts');
        pal.innerHTML = PAL.map((c, i) => '<button type="button" class="g5-swatch" data-c="' + i + '" style="background:' + c + '" aria-label="Farbe ' + (i + 1) + '"></button>').join('') +
            '<button type="button" class="b-btn" data-a="clear">Leeren</button><button type="button" class="b-btn" data-a="demo">Beispiel</button>';
        pal.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.c) S.col = +b.dataset.c;
            else if (b.dataset.a === 'clear') S.on.clear();
            else demo();
            render();
        });
        const pic = div(box, 'b-svgbox g-svg');
        div(box, 'b-help', 'Tippe auf Kästchen, um sie zu färben. Die gespiegelten Kästchen färben sich von selbst mit.');
        const U = 30, O = 10;
        // all images of a cell under the chosen symmetry
        const images = (x, y) => {
            const L = [[x, y]];
            if (S.mode === 'senk' || S.mode === 'zwei') L.push([N - 1 - x, y]);
            if (S.mode === 'waag' || S.mode === 'zwei') L.push([x, N - 1 - y]);
            if (S.mode === 'zwei') L.push([N - 1 - x, N - 1 - y]);
            if (S.mode === 'punkt') L.push([N - 1 - x, N - 1 - y]);
            return L;
        };
        function demo() {
            S.on.clear();
            const half = S.mode === 'punkt'
                ? [[2, 2], [3, 2], [4, 2], [2, 3], [2, 4], [5, 5], [4, 4], [3, 5], [5, 3]]
                : [[1, 5], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [4, 2], [4, 5], [4, 8], [5, 5], [5, 1], [5, 9], [5, 10]];
            half.forEach(([x, y], k) => images(x, y).forEach(([a, b]) => S.on.add(a + ',' + b + ',' + (k % 3))));
        }
        pic.addEventListener('click', e => {
            const svgEl = pic.querySelector('svg'); if (!svgEl) return;
            const p = svgXY(pic, e); if (!p) return;
            const x = Math.floor((p[0] - O) / U), y = Math.floor((p[1] - O) / U);
            if (x < 0 || y < 0 || x >= N || y >= N) return;
            const key = [...S.on].find(k => k.startsWith(x + ',' + y + ','));
            images(x, y).forEach(([a, b]) => {
                [...S.on].filter(k => k.startsWith(a + ',' + b + ',')).forEach(k => S.on.delete(k));
                if (!key) S.on.add(a + ',' + b + ',' + S.col);
            });
            render();
        });
        function render() {
            pal.querySelectorAll('.g5-swatch').forEach(b => b.classList.toggle('on', +b.dataset.c === S.col));
            let s = '';
            S.on.forEach(k => { const [x, y, c] = k.split(',').map(Number); s += rect(O + x * U + 1, O + y * U + 1, U - 2, U - 2, 'fill:' + rgba(PAL[c], 0.75) + ';stroke:none'); });
            for (let i = 0; i <= N; i++) s += line([O + i * U, O], [O + i * U, O + N * U], 'stroke:' + CY + ';stroke-opacity:0.18;stroke-width:1') + line([O, O + i * U], [O + N * U, O + i * U], 'stroke:' + CY + ';stroke-opacity:0.18;stroke-width:1');
            const M = O + N * U / 2;
            if (S.mode === 'senk' || S.mode === 'zwei') s += line([M, O - 6], [M, O + N * U + 6], 'stroke:' + TXT + ';stroke-width:2.2;stroke-dasharray:8 5');
            if (S.mode === 'waag' || S.mode === 'zwei') s += line([O - 6, M], [O + N * U + 6, M], 'stroke:' + TXT + ';stroke-width:2.2;stroke-dasharray:8 5');
            if (S.mode === 'punkt') s += dot([M, M], TXT, 6) + '<circle cx="' + M + '" cy="' + M + '" r="12" style="fill:none;stroke:' + TXT + ';stroke-width:1.4"/>';
            pic.innerHTML = svg(N * U + 2 * O, N * U + 2 * O, s, 'Muster-Werkstatt');
        }
        demo(); render();
    });
    /* ---------- Adam Ries: reckoning on the lines ---------- */
    W('linien5', function (box) {
        // positions from the bottom: line 1, space 5, line 10, space 50, line 100, space 500, line 1000, space 5000, line 10000
        const VAL = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
        const lay = n => { const c = VAL.map(() => 0); for (let d = 0; d < 5; d++) { const k = Math.floor(n / Math.pow(10, d)) % 10; if (d < 4 && k >= 5) { c[2 * d + 1] = 1; c[2 * d] = k - 5; } else c[2 * d] = k; } return c; };
        const S = { a: +(box.dataset.a || 748), b: +(box.dataset.b || 386), c: null, added: false, msg: '' };
        S.c = lay(S.a);
        const ctr = div(box, 'b-ctrls');
        ctr.innerHTML = '<span class="b-ctrl">Zahl <input class="b-in g5-in" type="text" inputmode="numeric" data-k="a" value="' + S.a + '" aria-label="erste Zahl"></span>' +
            '<span class="b-ctrl">plus <input class="b-in g5-in" type="text" inputmode="numeric" data-k="b" value="' + S.b + '" aria-label="zweite Zahl"></span>';
        const acts = div(box, 'b-ctrl g5-acts');
        acts.innerHTML = '<button type="button" class="b-btn" data-a="lay">Legen</button><button type="button" class="b-btn" data-a="add">Dazulegen</button>' +
            '<button type="button" class="b-btn b-go" data-a="step">Bündeln</button><button type="button" class="b-btn" data-a="all">Alles bündeln</button>';
        acts.style.marginBottom = '12px';
        ctr.addEventListener('input', e => { const k = e.target.dataset.k; if (!k) return; const v = parseInt(e.target.value, 10); if (v >= 0 && v <= 4999) S[k] = v; });
        const pic = div(box, 'b-svgbox g-svg'), out = div(box, 'b-out');
        const help = div(box, 'b-help', 'Fünf Pfennige auf einer Linie werden zu einem Pfennig im Feld darüber, zwei Pfennige in einem Feld zu einem auf der nächsten Linie. So rechnete man vor 500 Jahren.');
        heroOnly(box, pic, [ctr, acts, out, help]);
        function step() {
            for (let i = 0; i < VAL.length - 1; i++) {
                const need = i % 2 === 0 ? 5 : 2;
                if (S.c[i] >= need) { S.c[i] -= need; S.c[i + 1]++; S.msg = (need === 5 ? 'Fünf Pfennige auf der Linie ' + grp(VAL[i]) + ' werden zu einem im Feld ' + grp(VAL[i + 1]) + '.' : 'Zwei Pfennige im Feld ' + grp(VAL[i]) + ' werden zu einem auf der Linie ' + grp(VAL[i + 1]) + '.'); return true; }
            }
            S.msg = 'Fertig gebündelt. Jetzt kann man das Ergebnis ablesen.'; return false;
        }
        acts.addEventListener('click', e => {
            const b = e.target.closest('[data-a]'); if (!b) return;
            const a = b.dataset.a;
            if (a === 'lay') { S.c = lay(S.a); S.added = false; S.msg = grp(S.a) + ' ist gelegt.'; }
            else if (a === 'add') { const d = lay(S.b); S.c = S.c.map((x, i) => x + d[i]); S.added = true; S.msg = grp(S.b) + ' dazugelegt. Jetzt muss gebündelt werden.'; }
            else if (a === 'step') step();
            else { let k = 0; while (step() && k < 50) k++; }
            render();
        });
        function render() {
            const n = VAL.length, H = 34, W0 = 470, X0 = 70;
            const Y = i => 30 + (n - 1 - i) * H;   // positions bottom-up
            let s = '';
            for (let i = 0; i < n; i++) {
                if (i % 2 === 0) s += line([X0 - 10, Y(i)], [W0, Y(i)], 'stroke:' + TXT + ';stroke-width:1.6;opacity:0.85') + (i === 6 ? line([X0 + 6, Y(i) - 7], [X0 + 6, Y(i) + 7], 'stroke:' + TXT + ';stroke-width:2') : '');
                s += T(X0 - 18, Y(i) + 5, grp(VAL[i]), i % 2 ? 'g-small' : 'g-lab', 'end');
                const k = S.c[i], need = i % 2 === 0 ? 5 : 2;
                for (let j = 0; j < k; j++) {
                    const cx = X0 + 30 + j * 30;
                    s += '<circle cx="' + cx + '" cy="' + Y(i) + '" r="11" style="fill:' + rgba(k >= need ? RED : LAM, 0.85) + ';stroke:#0a1426;stroke-width:2"/>';
                }
            }
            pic.innerHTML = svg(W0 + 10, Y(0) + 26, s, 'Linienbrett mit Rechenpfennigen');
            const v = S.c.reduce((t, k, i) => t + k * VAL[i], 0);
            const done = S.c.every((k, i) => k < (i % 2 === 0 ? 5 : 2));
            out.innerHTML = '<p class="g5-big">' + grp(v) + '</p>' + (S.msg ? '<p>' + S.msg + '</p>' : '') +
                (!done ? '<p class="g5-dim">Rot markiert: Hier muss noch gebündelt werden.</p>' : (S.added ? '<p class="g-ok">' + grp(S.a) + ' + ' + grp(S.b) + ' = ' + grp(v) + '</p>' : ''));
        }
        render();
    });
})();
