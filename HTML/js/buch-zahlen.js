/* buch-zahlen.js — widgets for numbers and logic in the book Mathematik · Fachoberschule 11 (js/buch.js, js/buch-plot.js).
 *   titelbildfos11  the cover of the FOS 11 book: two lines with their intersection, a parabola, a cubic with its zeros, Bernoulli bars
 *   zahlenbereiche  N ⊂ Z ⊂ Q ⊂ R as nested sets: a number appears, pick the smallest set it belongs to, it lands in the diagram
 *   komplex         two complex numbers as arrows in the Gaussian plane: sum, difference, product, conjugate (Wahlbereich 1)
 *   schaltung       two switches in series (AND), in parallel (OR) or as a two-way switch: lamp, truth table, term (Wahlbereich 3)
 * Looks: js/buch.css (section "Widgets of the FOS chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { texNum, math, seg, div } = B;
    const W = B.widget;
    let uid = 0;

    /* ---------- the cover ---------- */
    W('titelbildfos11', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const path = (f, a, b, n = 160) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x); d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); }
            return d;
        };
        const cubic = x => 0.16 * (x + 1.6) * (x - 1.2) * (x - 4.4);
        const curves = [
            [x => 0.8 * x + 0.6, -3, 6, '#B8A4F2'],                        // line g
            [x => -0.6 * x + 3.4, -3, 6, '#7fd8ee', '7 9'],                 // line h
            [x => 0.42 * (x - 2.6) ** 2 - 1.2, -1.2, 6, '#F5C242'],         // parabola
            [cubic, -2.6, 5.4, '#A0C85A']                                    // cubic with three zeros
        ];
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        let art = '';
        // Bernoulli chain B(6; 0,5) as faint bars along the bottom
        const bin = [1, 6, 15, 20, 15, 6, 1];
        bin.forEach((c, k) => {
            const x0 = X(-2.4 + k * 1.15), w = X(0.85) - X(0), h = c / 20 * 150;
            art += '<rect x="' + x0.toFixed(1) + '" y="' + (Y(-2.7) - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" fill="#7fd8ee" fill-opacity="0.10" stroke="#7fd8ee" stroke-opacity="0.32"/>';
        });
        curves.forEach(([f, a, b, c, dash]) => {
            const d = path(f, a, b);
            art += '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.13" fill="none" stroke-linecap="round"/>' +
                '<path d="' + d + '" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        });
        // marked points lie exactly on their curves: the intersection of g and h, the vertex, the three zeros of the cubic
        const xs = 2.8 / 1.4;
        const pts = [[xs, 0.8 * xs + 0.6], [2.6, -1.2], [-1.6, 0], [1.2, 0], [4.4, 0]];
        pts.forEach(([x, y]) => { art += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="6" fill="#fff"/><circle cx="' + X(x) + '" cy="' + Y(y) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        const id = 'tf' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: zwei Geraden mit Schnittpunkt, eine Parabel, eine Funktion dritten Grades mit drei Nullstellen und ein Säulendiagramm">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' +
            '<line x1="0" y1="' + Y(0) + '" x2="' + Wd + '" y2="' + Y(0) + '" stroke="#7fd8ee" stroke-opacity="0.22" stroke-width="1.4"/>' + art + '</g></svg>';
    });

    /* ---------- number sets ---------- */
    // [TeX, plain label for the diagram, smallest set 0 = N, 1 = Z, 2 = Q, 3 = R, why]
    const NUMS = [
        ['7', '7', 0, 'eine natürliche Zahl'],
        ['-3', '−3', 1, 'eine negative ganze Zahl'],
        ['\\sqrt{9}', '√9', 0, '$\\sqrt{9} = 3$'],
        ['-\\tfrac{8}{4}', '−8/4', 1, '$-\\tfrac{8}{4} = -2$'],
        ['\\tfrac{3}{4}', '3/4', 2, 'ein Bruch, der keine ganze Zahl ist'],
        ['0{,}25', '0,25', 2, '$0{,}25 = \\tfrac14$'],
        ['0{,}\\overline{3}', '0,3̅', 2, 'periodisch: $0{,}\\overline{3} = \\tfrac13$'],
        ['-1{,}5', '−1,5', 2, '$-1{,}5 = -\\tfrac32$'],
        ['\\sqrt{2}', '√2', 3, '$\\sqrt{2}$ ist irrational: nicht abbrechend und nicht periodisch'],
        ['\\pi', 'π', 3, '$\\pi = 3{,}14159\\ldots$ ist irrational'],
        ['\\sqrt{2} \\cdot \\sqrt{8}', '√2·√8', 0, '$\\sqrt{2 \\cdot 8} = \\sqrt{16} = 4$'],
        ['0{,}1010010001\\ldots', '0,10100…', 3, 'nicht abbrechend und nicht periodisch, also irrational'],
        ['\\tfrac{12}{3}', '12/3', 0, '$\\tfrac{12}{3} = 4$'],
        ['-\\sqrt{16}', '−√16', 1, '$-\\sqrt{16} = -4$'],
        ['\\sqrt{0{,}49}', '√0,49', 2, '$\\sqrt{0{,}49} = 0{,}7$'],
        ['2^{-1}', '2⁻¹', 2, '$2^{-1} = \\tfrac12$'],
        ['10^{3}', '10³', 0, '$10^3 = 1000$'],
        ['\\sqrt{5}', '√5', 3, '$5$ ist keine Quadratzahl, also ist $\\sqrt{5}$ irrational'],
        ['-0{,}\\overline{6}', '−0,6̅', 2, '$-0{,}\\overline{6} = -\\tfrac23$'],
        ['|-12|', '|−12|', 0, 'der Betrag: $|-12| = 12$']
    ];
    const SETS = ['\\mathbb{N}', '\\mathbb{Z}', '\\mathbb{Q}', '\\mathbb{R}'];
    const SET_PLAIN = ['ℕ', 'ℤ', 'ℚ', 'ℝ'];
    const SET_NAME = ['natürliche Zahlen', 'ganze Zahlen', 'rationale Zahlen', 'reelle Zahlen'];
    W('zahlenbereiche', function (box) {
        // nested rings: each ring keeps a free column on its right (150 wide) and a band on top for its name
        const R = [[8, 8, 624, 404], [20, 50, 460, 350], [30, 92, 300, 296], [40, 134, 140, 242]];   // R, Q, Z, N as x, y, w, h
        const ring = [3, 2, 1, 0];
        // one column of slots per set (N inside its own ring, the others in their free column)
        const COL = [[110, 200, 5], [255, 160, 6], [405, 118, 8], [555, 78, 9]];                      // centre x, first y, count
        const SLOTS = COL.map(([x, y0, n]) => Array.from({ length: n }, (_, i) => [x, y0 + 38 * i]));
        const placed = [{ lab: '5', set: 0 }, { lab: '−2', set: 1 }, { lab: '3/4', set: 2 }, { lab: 'π', set: 3 }];
        let pool = NUMS.slice(), cur = null, right = 0, tries = 0;
        const card = div(box, 'b-out zb-card');
        const pick = div(box, 'b-ctrls');
        pick.innerHTML = '<span class="b-ctrl">Kleinster Bereich:</span>' + SETS.map((s, i) => '<button type="button" class="b-btn" data-set="' + i + '">$' + s + '$</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-next>Nächste Zahl</button>';
        const svgBox = div(box, 'b-svgbox zb-svg');
        const msg = div(box, 'b-help'); msg.setAttribute('aria-live', 'polite');
        function draw() {
            let s = '<svg viewBox="0 0 640 420" role="img" aria-label="Zahlenbereiche als ineinander liegende Mengen: N in Z in Q in R">';
            R.forEach(([x, y, w, h], i) => {
                const k = ring[i];
                s += '<g class="zb-ring zb-r' + k + '" data-set="' + k + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="18"/>' +
                    '<text class="zb-name" x="' + (x + 14) + '" y="' + (y + 31) + '">' + SET_PLAIN[k] + '</text></g>';
            });
            const used = [0, 0, 0, 0];
            placed.forEach(p => {
                const sl = SLOTS[p.set][used[p.set]++], w = Math.min(132, 22 + 8.6 * [...p.lab].length);
                s += '<g class="zb-chip' + (p.fresh ? ' zb-new' : '') + '" pointer-events="none"><rect x="' + (sl[0] - w / 2) + '" y="' + (sl[1] - 16) + '" width="' + w + '" height="30" rx="15"/>' +
                    '<text x="' + sl[0] + '" y="' + (sl[1] + 5) + '" text-anchor="middle">' + p.lab + '</text></g>';
            });
            svgBox.innerHTML = s + '</svg>';
        }
        function next() {
            if (!pool.length) pool = NUMS.slice();
            cur = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            card.innerHTML = '<span class="zb-k">DIE ZAHL</span> <span class="zb-num">$' + cur[0] + '$</span> <span class="zb-q">In welchen <b>kleinsten</b> Zahlenbereich gehört sie? Tippe auf einen Knopf oder ins Bild.</span>';
            msg.innerHTML = right || tries ? 'Richtig: ' + right + ' von ' + tries : '';
            math(card);
        }
        function answer(k) {
            if (!cur) return;
            tries++;
            if (k === cur[2]) {
                right++;
                placed.forEach(p => { p.fresh = false; });
                // a full column drops its oldest number
                if (placed.filter(p => p.set === cur[2]).length >= SLOTS[cur[2]].length) placed.splice(placed.findIndex(p => p.set === cur[2]), 1);
                placed.push({ lab: cur[1], set: cur[2], fresh: true });
                msg.innerHTML = '<b>Richtig!</b> $' + cur[0] + '$ liegt in $' + SETS[k] + '$: ' + cur[3] + '. Damit liegt sie auch in jedem größeren Bereich. · Richtig: ' + right + ' von ' + tries;
                cur = null;
                draw();
                setTimeout(next, B.printing() ? 0 : 1400);
            } else if (k > cur[2]) {
                msg.innerHTML = 'Sie liegt zwar in $' + SETS[k] + '$, aber es gibt einen <b>kleineren</b> Bereich. · Richtig: ' + right + ' von ' + tries;
            } else {
                msg.innerHTML = 'Nein, $' + cur[0] + '$ gehört nicht zu den ' + SET_NAME[k] + '. Tipp: ' + (cur[2] === 3 ? 'Lässt sie sich als Bruch schreiben?' : 'Rechne sie zuerst aus.') + ' · Richtig: ' + right + ' von ' + tries;
            }
            math(msg);
        }
        pick.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.next != null) next(); else answer(+b.dataset.set);
        });
        svgBox.addEventListener('click', e => {
            const g = e.target.closest('.zb-ring'); if (g) answer(+g.dataset.set);
        });
        math(pick);
        draw();
        next();
    });

    /* ---------- complex numbers ---------- */
    // a + bi in TeX
    function cx(a, b) {
        const r = v => Math.round(v * 100) / 100;
        a = r(a); b = r(b);
        if (!b) return texNum(a, 2);
        const im = (Math.abs(b) === 1 ? '' : texNum(Math.abs(b), 2)) + '\\,\\mathrm{i}';
        if (!a) return (b < 0 ? '-' : '') + im;
        return texNum(a, 2) + (b < 0 ? ' - ' : ' + ') + im;
    }
    const par = (a, b) => (b ? '(' + cx(a, b) + ')' : cx(a, b));
    W('komplex', function (box) {
        const h = [{ x: 2, y: 1, color: 'lambda', snap: 0.5 }, { x: 1, y: 2, color: 'cyan', snap: 0.5 }];
        let op = 'sum';
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['sum', '$z_1 + z_2$'], ['diff', '$z_1 - z_2$'], ['prod', '$z_1 \\cdot z_2$'], ['conj', '$\\overline{z_1}$']], op, v => { op = v; render(); }, 'Rechenart');
        math(ctl);
        const p = new B.Plot(div(box, ''), { x: [-6, 6], y: [-5, 5.5], height: 340, equal: true, xLabel: 'Re', yLabel: 'Im', aria: 'Gaußsche Zahlenebene mit zwei komplexen Zahlen als Pfeile' });
        const out = div(box, 'b-out');
        p.handles(h, () => render());
        function render() {
            const [a, b] = [h[0].x, h[0].y], [c, d] = [h[1].x, h[1].y];
            let re, im, line;
            if (op === 'sum') { re = a + c; im = b + d; line = 'z_1 + z_2 = ' + par(a, b) + ' + ' + par(c, d) + ' = ' + cx(re, im); }
            else if (op === 'diff') { re = a - c; im = b - d; line = 'z_1 - z_2 = ' + par(a, b) + ' - ' + par(c, d) + ' = ' + cx(re, im); }
            else if (op === 'prod') {
                re = a * c - b * d; im = a * d + b * c;
                line = 'z_1 \\cdot z_2 = ' + par(a, b) + par(c, d) + ' = ' + texNum(a * c, 2) + ' + ' + texNum(a * d, 2) + '\\,\\mathrm{i} + ' + texNum(b * c, 2) + '\\,\\mathrm{i} + ' + texNum(b * d, 2) + '\\,\\mathrm{i}^2 = ' + cx(re, im);
                line = line.replace(/\+ -/g, '- ');
            } else { re = a; im = -b; line = '\\overline{z_1} = ' + cx(re, im) + '\\quad\\text{(an der reellen Achse gespiegelt)}'; }
            const L = [
                { seg: [[0, 0], [a, b]], color: 'lambda', width: 2.6, arrow: true }, { text: 'z₁', at: [a, b], color: 'lambda' }
            ];
            if (op !== 'conj') L.push({ seg: [[0, 0], [c, d]], color: 'cyan', width: 2.6, arrow: true }, { text: 'z₂', at: [c, d], color: 'cyan' });
            if (op === 'sum') L.push({ seg: [[a, b], [re, im]], color: 'cyan', dash: true }, { seg: [[c, d], [re, im]], color: 'lambda', dash: true });
            if (op === 'diff') L.push({ seg: [[c, d], [a, b]], color: 'phi', dash: true });
            if (op === 'conj') L.push({ seg: [[a, b], [a, -b]], color: 'dim', dash: true });
            L.push({ seg: [[0, 0], [re, im]], color: 'phi', width: 3, arrow: true }, { text: op === 'conj' ? 'z̄₁' : 'Ergebnis', at: [re, im], color: 'phi', italic: op === 'conj' });
            p.draw(L);
            const abs = Math.hypot(a, b);
            out.innerHTML = '<p style="margin:0 0 6px">$z_1 = ' + cx(a, b) + '$ · $z_2 = ' + cx(c, d) + '$ · Betrag $|z_1| = \\sqrt{' + texNum(a * a, 2) + ' + ' + texNum(b * b, 2) + '} \\approx ' + texNum(abs, 3) + '$</p>' +
                '<p style="margin:0">$' + line + '$</p>' + (op === 'prod' ? '<p style="margin:6px 0 0" class="b-help">Wegen $\\mathrm{i}^2 = -1$ wird aus dem letzten Summanden eine reelle Zahl. Die Beträge multiplizieren sich, die Winkel addieren sich.</p>' : '');
            math(out);
        }
        render();
    });

    /* ---------- switching algebra ---------- */
    const CIRCUITS = {
        and: { k: 'Reihe (UND)', f: (a, b) => a && b, tex: 'a \\wedge b', say: 'Die Lampe leuchtet nur, wenn <b>beide</b> Schalter geschlossen sind.' },
        or: { k: 'Parallel (ODER)', f: (a, b) => a || b, tex: 'a \\vee b', say: 'Die Lampe leuchtet, wenn <b>mindestens einer</b> der Schalter geschlossen ist.' },
        wechsel: { k: 'Wechselschaltung', f: (a, b) => a === b, tex: '(a \\wedge b) \\vee (\\overline{a} \\wedge \\overline{b})', say: 'Treppenhaus: Jeder der beiden Schalter kann die Lampe ein- und ausschalten. Sie leuchtet, wenn beide Schalter <b>gleich</b> stehen.' }
    };
    W('schaltung', function (box) {
        let mode = box.dataset.mode || 'and', a = false, b = false;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(CIRCUITS).map(k => [k, CIRCUITS[k].k]), mode, v => { mode = v; render(); }, 'Schaltung');
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-s="a">Schalter $a$ umlegen</button><button type="button" class="b-btn" data-s="b">Schalter $b$ umlegen</button>';
        math(acts);
        const wrap = div(box, 'b-two');
        const svgBox = div(wrap, 'b-svgbox'), tab = div(wrap, 'b-table-wrap');
        const out = div(box, 'b-out');
        const flip = s => { if (s === 'a') a = !a; else b = !b; render(); };
        acts.addEventListener('click', e => { const t = e.target.closest('[data-s]'); if (t) flip(t.dataset.s); });
        svgBox.addEventListener('click', e => { const t = e.target.closest('[data-s]'); if (t) flip(t.dataset.s); });
        // an on/off switch from (x, y) to (x + 56, y); closed = lever down on the contact
        function sw(x, y, on, name) {
            const ex = on ? x + 56 : x + 48, ey = on ? y : y - 28;
            return '<g class="sc-sw" data-s="' + name + '" role="button" aria-label="Schalter ' + name + '"><rect x="' + (x - 8) + '" y="' + (y - 40) + '" width="72" height="52" fill="transparent"/>' +
                '<line class="sc-lever' + (on ? ' on' : '') + '" x1="' + x + '" y1="' + y + '" x2="' + ex + '" y2="' + ey + '"/>' +
                '<circle class="sc-pin" cx="' + x + '" cy="' + y + '" r="4.5"/><circle class="sc-pin" cx="' + (x + 56) + '" cy="' + y + '" r="4.5"/>' +
                '<text class="sc-name" x="' + (x + 28) + '" y="' + (y + 24) + '" text-anchor="middle">' + name + '</text></g>';
        }
        // a two-way switch: common contact at (x, y), the lever goes to the upper or the lower wire at (x + dir·56, y ∓ 30)
        function sw2(x, y, up, name, dir) {
            const tx = x + dir * 56;
            return '<g class="sc-sw" data-s="' + name + '" role="button" aria-label="Schalter ' + name + '"><rect x="' + (Math.min(x, tx) - 10) + '" y="' + (y - 40) + '" width="76" height="80" fill="transparent"/>' +
                '<line class="sc-lever on" x1="' + x + '" y1="' + y + '" x2="' + tx + '" y2="' + (up ? y - 30 : y + 30) + '"/>' +
                '<circle class="sc-pin" cx="' + x + '" cy="' + y + '" r="4.5"/><circle class="sc-pin" cx="' + tx + '" cy="' + (y - 30) + '" r="4.5"/><circle class="sc-pin" cx="' + tx + '" cy="' + (y + 30) + '" r="4.5"/>' +
                '<text class="sc-name" x="' + (x + dir * 18) + '" y="' + (y + 52) + '" text-anchor="middle">' + name + ' ' + (up ? '= 1' : '= 0') + '</text></g>';
        }
        const wire = pts => '<polyline class="sc-wire" points="' + pts.map(p => p.join(',')).join(' ') + '"/>';
        function render() {
            const C = CIRCUITS[mode], lit = C.f(a, b);
            let s = '<svg viewBox="0 0 520 250" role="img" aria-label="Stromkreis mit zwei Schaltern und einer Lampe">';
            // battery left, lamp right, bottom wire
            s += wire([[40, 150], [40, 220], [480, 220], [480, 150]]);
            s += '<line class="sc-bat" x1="22" y1="110" x2="58" y2="110"/><line class="sc-bat sc-bat-s" x1="30" y1="124" x2="50" y2="124"/>' +
                wire([[40, 110], [40, 70]]) + wire([[40, 124], [40, 150]]) + '<text class="sc-name" x="66" y="122">Quelle</text>';
            if (mode === 'and') {
                s += wire([[40, 70], [130, 70]]) + sw(130, 70, a, 'a') + wire([[186, 70], [280, 70]]) + sw(280, 70, b, 'b') + wire([[336, 70], [480, 70], [480, 108]]);
            } else if (mode === 'or') {
                s += wire([[40, 70], [150, 70]]) + wire([[150, 40], [150, 110]]) + wire([[150, 40], [220, 40]]) + sw(220, 40, a, 'a') + wire([[276, 40], [360, 40]]) +
                    wire([[150, 110], [220, 110]]) + sw(220, 110, b, 'b') + wire([[276, 110], [360, 110]]) + wire([[360, 40], [360, 110]]) + wire([[360, 70], [480, 70], [480, 108]]);
            } else {
                s += wire([[40, 70], [150, 70]]) + sw2(150, 70, a, 'a', 1) + wire([[206, 40], [314, 40]]) + wire([[206, 100], [314, 100]]) + sw2(370, 70, b, 'b', -1) + wire([[370, 70], [480, 70], [480, 108]]);
            }
            s += '<g class="sc-lamp' + (lit ? ' on' : '') + '"><circle class="sc-glow" cx="480" cy="130" r="40"/><circle class="sc-bulb" cx="480" cy="130" r="22"/>' +
                '<line x1="465" y1="115" x2="495" y2="145"/><line x1="495" y1="115" x2="465" y2="145"/></g>';
            svgBox.innerHTML = s + '</svg>';
            const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
            tab.innerHTML = '<table class="b-table" style="min-width:0"><tr><th>$a$</th><th>$b$</th><th>$' + C.tex + '$</th></tr>' +
                rows.map(([x, y]) => '<tr' + ((x === 1) === a && (y === 1) === b ? ' class="sc-row-on"' : '') + '><td>' + x + '</td><td>' + y + '</td><td' + (C.f(x === 1, y === 1) ? ' class="b-hot"' : '') + '>' + (C.f(x === 1, y === 1) ? 1 : 0) + '</td></tr>').join('') + '</table>';
            out.innerHTML = '<p style="margin:0 0 6px">' + C.say + '</p><p style="margin:0">Term: $L = ' + C.tex + '$ · jetzt: $a = ' + (a ? 1 : 0) + '$, $b = ' + (b ? 1 : 0) + '$ → Lampe <b>' + (lit ? 'an' : 'aus') + '</b> ($L = ' + (lit ? 1 : 0) + '$)</p>';
            math(tab); math(out);
        }
        render();
    });
})();
