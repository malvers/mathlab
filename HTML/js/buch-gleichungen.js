/* buch-gleichungen.js — widgets for Lernbereich 2 (equations, formulas, figures) of the textbook (js/buch.js).
 *   waage    equivalence transformations: type "| −3", "| :4", "| −2x" and watch the equation change until x stands alone
 *   binom    (a + b)² as a square of four pieces
 *   koerper  cylinder, cone, sphere: volume and surface with sliders, formulas and a sketch
 *   ungleichung  a·x + b < c step by step (the sign turns when dividing by a negative number), solution set on the number line,
 *                a draggable test point (book Fachoberschule 11)
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { Frac, fmt, texNum, math, range, seg, div, co, sg } = B;
    const W = B.widget;

    /* ---------- equivalence transformations ---------- */
    function frac(s) {   // "3", "-0,5", "2/3" → Frac
        s = String(s).trim().replace(',', '.');
        let m = s.match(/^(-?\d+)\/(\d+)$/);
        if (m) return +m[2] ? new Frac(+m[1], +m[2]) : null;
        m = s.match(/^(-?)(\d*)(?:\.(\d+))?$/);
        if (!m || (m[2] === '' && !m[3])) return null;
        const dec = m[3] || '', den = Math.pow(10, dec.length);
        return new Frac((m[1] ? -1 : 1) * (+(m[2] || 0) * den + +(dec || 0)), den);
    }
    function lin(a, b) {   // TeX of a·x + b with fractions
        const parts = [];
        if (a.n !== 0) parts.push((a.n === a.d ? '' : a.n === -a.d ? '-' : a.tex()) + 'x');
        if (b.n !== 0 || !parts.length) parts.push(b.tex());
        return parts.join(' + ').replace(/\+ -/g, '- ');
    }
    W('waage', function (box) {
        let a, b, c, d, hist;
        box.innerHTML =
            '<div class="b-out" data-eq style="font-size:1.15em;line-height:2.1"></div>' +
            '<div class="b-ctrls" style="margin:12px 0 0"><label class="b-ctrl" for="wg-op">Umformung</label>' +
            '<input class="b-in" id="wg-op" placeholder="z. B. −3 oder :4 oder −2x" autocomplete="off" style="width:230px">' +
            '<button type="button" class="b-btn b-go" data-go>Anwenden</button><button type="button" class="b-btn b-hintbtn" data-tip>Tipp</button>' +
            '<button type="button" class="b-btn" data-undo>Zurück</button><button type="button" class="b-btn" data-new>Neue Gleichung</button></div>' +
            '<p class="b-help" data-msg aria-live="polite"></p>';
        const $ = s => box.querySelector(s);
        function fresh() {
            const r = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
            let s = 0; while (!s) s = r(-6, 6);
            const A = r(2, 7); let C = r(-3, 1); if (C === A) C = 0;
            const Bv = r(-9, 9), D = A * s + Bv - C * s;
            [a, b, c, d] = [new Frac(A), new Frac(Bv), new Frac(C), new Frac(D)];
            hist = [{ a, b, c, d, op: '' }];
            show('');
        }
        function state() { return a.n === 1 && a.d === 1 && b.n === 0 && c.n === 0 ? 'solved' : a.sub(c).n === 0 ? (b.sub(d).n === 0 ? 'all' : 'none') : 'open'; }
        function show(msg) {
            $('[data-eq]').innerHTML = hist.map((h, i) => '$' + lin(h.a, h.b) + ' = ' + lin(h.c, h.d) + '$' +
                (hist[i + 1] ? ' <span style="color:rgb(245,194,66);margin-left:14px">$\\big|\\; ' + hist[i + 1].op + '$</span>' : '')).join('<br>');
            const st = state();
            let m = msg;
            if (st === 'solved') m = '<span class="b-res">Gelöst: $x = ' + d.tex() + '$. Mach die Probe: Setz den Wert in die erste Zeile ein.</span>';
            else if (st === 'all') m = '<span class="b-res">Beide Seiten sind gleich: Jede Zahl ist Lösung, $L = \\mathbb{R}$.</span>';
            else if (st === 'none') m = '<span class="b-res">Widerspruch: Es gibt keine Lösung, $L = \\{\\,\\}$.</span>';
            $('[data-msg]').innerHTML = m || 'Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.';
            math(box);
        }
        function apply(raw) {
            const s = String(raw).trim().replace(/^\|/, '').trim().replace(/[−–]/g, '-').replace(/[·×*]/g, '·').replace(/^[÷/]/, ':').replace(/\s+/g, '');
            const m = s.match(/^([+\-·:])(.*?)(x?)$/);
            if (!m) return show('Das verstehe ich nicht. Beispiele: <code>-3</code>, <code>+2x</code>, <code>:4</code>, <code>·2</code>');
            const op = m[1], hasX = m[3] === 'x';
            const k = m[2] === '' ? (hasX ? new Frac(1) : null) : frac(m[2]);
            if (!k) return show('Hinter dem Rechenzeichen fehlt eine Zahl.');
            if ((op === '·' || op === ':') && hasX) return show('Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.');
            if ((op === '·' || op === ':') && k.n === 0) return show(op === ':' ? 'Durch $0$ darf man nicht teilen.' : 'Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.');
            const sign = op === '-' ? new Frac(-k.n, k.d) : k;
            if (op === '+' || op === '-') {
                if (hasX) { a = a.add(sign); c = c.add(sign); } else { b = b.add(sign); d = d.add(sign); }
            } else {
                const f = op === '·' ? k : new Frac(k.d, k.n);
                [a, b, c, d] = [a.mul(f), b.mul(f), c.mul(f), d.mul(f)];
            }
            const label = (op === '-' ? '-' : op === '+' ? '+' : op === '·' ? '\\cdot ' : ':\\,') + (hasX ? (k.n === 1 && k.d === 1 ? '' : k.tex()) + 'x' : k.tex());
            hist.push({ a, b, c, d, op: label });
            $('#wg-op').value = '';
            show('');
        }
        function tip() {
            const st = state(); if (st !== 'open') return show('');
            let t;
            if (c.n !== 0) t = 'Bring alle $x$ auf eine Seite: $\\big|\\; ' + (c.n > 0 ? '-' : '+') + (Math.abs(c.n) === c.d ? '' : new Frac(Math.abs(c.n), c.d).tex()) + 'x$';
            else if (b.n !== 0) t = 'Bring die Zahl auf die andere Seite: $\\big|\\; ' + (b.n > 0 ? '-' : '+') + new Frac(Math.abs(b.n), b.d).tex() + '$';
            else t = 'Teile durch die Zahl vor dem $x$: $\\big|\\; :' + a.tex() + '$';
            show(t);
        }
        box.addEventListener('click', e => {
            const t = e.target.closest('button'); if (!t) return;
            if (t.hasAttribute('data-go')) apply($('#wg-op').value);
            else if (t.hasAttribute('data-tip')) tip();
            else if (t.hasAttribute('data-new')) fresh();
            else if (t.hasAttribute('data-undo') && hist.length > 1) { hist.pop(); ({ a, b, c, d } = hist[hist.length - 1]); show(''); }
        });
        $('#wg-op').addEventListener('keydown', e => { if (e.key === 'Enter') apply(e.target.value); });
        fresh();
    });

    /* ---------- binomial formula as a square ---------- */
    W('binom', function (box) {
        const S = { a: 5, b: 3 };
        const sl = div(box, '');
        range(sl, { label: 'Länge $a$', min: 1, max: 9, step: 1, value: S.a, fmt: v => String(v), onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Länge $b$', min: 1, max: 9, step: 1, value: S.b, fmt: v => String(v), onInput: v => { S.b = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox'), out = div(two, 'b-out');
        function render() {
            const { a, b } = S, u = 300 / (a + b), A = a * u, Bb = b * u, o = 30;
            const R = (x, y, w, h, fill, txt) => '<rect x="' + (o + x) + '" y="' + (o + y) + '" width="' + w + '" height="' + h + '" fill="' + fill + '" stroke="#0a1426" stroke-width="2"/>' +
                '<text x="' + (o + x + w / 2) + '" y="' + (o + y + h / 2 + 6) + '" text-anchor="middle" style="fill:#08101e;font-weight:700;font-size:' + Math.max(12, Math.min(22, Math.min(w, h) / 2.4)) + 'px">' + txt + '</text>';
            pic.innerHTML = '<svg viewBox="0 0 360 360" width="360" height="360" style="min-width:0" role="img" aria-label="Quadrat mit Seitenlänge a + b">' +
                R(0, 0, A, A, 'rgb(245,194,66)', 'a²') + R(A, 0, Bb, A, '#7fd8ee', 'ab') + R(0, A, A, Bb, '#7fd8ee', 'ab') + R(A, A, Bb, Bb, 'rgb(160,200,90)', 'b²') +
                '<text x="' + (o + A / 2) + '" y="22" text-anchor="middle" style="fill:#cfd8e6;font-size:15px;font-style:italic">a</text>' +
                '<text x="' + (o + A + Bb / 2) + '" y="22" text-anchor="middle" style="fill:#cfd8e6;font-size:15px;font-style:italic">b</text>' +
                '<text x="14" y="' + (o + A / 2 + 5) + '" text-anchor="middle" style="fill:#cfd8e6;font-size:15px;font-style:italic">a</text>' +
                '<text x="14" y="' + (o + A + Bb / 2 + 5) + '" text-anchor="middle" style="fill:#cfd8e6;font-size:15px;font-style:italic">b</text></svg>';
            out.innerHTML = '<p style="margin:0 0 8px">$(a + b)^2 = a^2 + 2ab + b^2$</p>' +
                '<p style="margin:0 0 8px">$(' + a + ' + ' + b + ')^2 = ' + a * a + ' + 2 \\cdot ' + (a * b) + ' + ' + b * b + ' = ' + (a + b) * (a + b) + '$</p>' +
                '<p style="margin:0">Der häufigste Fehler: $(a + b)^2 = a^2 + b^2$. Im Bild fehlen dann die beiden blauen Rechtecke, hier $2 \\cdot ' + (a * b) + ' = ' + 2 * a * b + '$.</p>';
            math(out);
        }
        render();
    });

    /* ---------- cylinder, cone, sphere ---------- */
    W('koerper', function (box) {
        const S = { k: 'zyl', r: 3, h: 8 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['zyl', 'Zylinder'], ['kegel', 'Kegel'], ['kugel', 'Kugel']], 'zyl', v => { S.k = v; render(); }, 'Körper');
        const sl = div(box, '');
        range(sl, { label: 'Radius $r$ in cm', min: 0.5, max: 10, step: 0.5, value: S.r, fmt: v => fmt(v, 1), onInput: v => { S.r = v; render(); } });
        const rh = range(sl, { label: 'Höhe $h$ in cm', min: 0.5, max: 20, step: 0.5, value: S.h, fmt: v => fmt(v, 1), onInput: v => { S.h = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox'), out = div(two, 'b-out');
        function render() {
            const { k, r, h } = S, PI = Math.PI;
            rh.input.closest('.b-range').style.display = k === 'kugel' ? 'none' : '';
            const sc = 150 / Math.max(r * 2, k === 'kugel' ? r * 2 : h, 1), R = r * sc, H = (k === 'kugel' ? 2 * r : h) * sc, cx = 120, top = 30, ry = Math.max(6, R * 0.28);
            let svg = '';
            const st = 'fill:rgba(127,216,238,0.12);stroke:#7fd8ee;stroke-width:2';
            if (k === 'zyl') svg = '<path d="M' + (cx - R) + ' ' + (top + ry) + ' V' + (top + ry + H) + ' A' + R + ' ' + ry + ' 0 0 0 ' + (cx + R) + ' ' + (top + ry + H) + ' V' + (top + ry) + '" style="' + st + '"/>' +
                '<ellipse cx="' + cx + '" cy="' + (top + ry) + '" rx="' + R + '" ry="' + ry + '" style="' + st + '"/>';
            if (k === 'kegel') svg = '<path d="M' + cx + ' ' + top + ' L' + (cx - R) + ' ' + (top + H) + ' A' + R + ' ' + ry + ' 0 0 0 ' + (cx + R) + ' ' + (top + H) + ' Z" style="' + st + '"/>' +
                '<path d="M' + (cx - R) + ' ' + (top + H) + ' A' + R + ' ' + ry + ' 0 0 1 ' + (cx + R) + ' ' + (top + H) + '" style="fill:none;stroke:#7fd8ee;stroke-width:1.2;stroke-dasharray:5 4"/>';
            if (k === 'kugel') svg = '<circle cx="' + cx + '" cy="' + (top + R) + '" r="' + R + '" style="' + st + '"/>' +
                '<ellipse cx="' + cx + '" cy="' + (top + R) + '" rx="' + R + '" ry="' + ry + '" style="fill:none;stroke:#7fd8ee;stroke-width:1.2;stroke-dasharray:5 4"/>';
            const yb = k === 'kugel' ? top + R : top + (k === 'zyl' ? ry + H : H);
            svg += '<line x1="' + cx + '" y1="' + yb + '" x2="' + (cx + R) + '" y2="' + yb + '" stroke="rgb(245,194,66)" stroke-width="2.5"/>' +
                '<text x="' + (cx + R / 2) + '" y="' + (yb - 6) + '" text-anchor="middle" style="fill:rgb(245,194,66);font-style:italic;font-size:16px">r</text>';
            if (k !== 'kugel') svg += '<line x1="' + (cx + R + 18) + '" y1="' + (k === 'zyl' ? top + ry : top) + '" x2="' + (cx + R + 18) + '" y2="' + yb + '" stroke="rgb(160,200,90)" stroke-width="2"/>' +
                '<text x="' + (cx + R + 26) + '" y="' + ((k === 'zyl' ? top + ry : top) + yb) / 2 + '" style="fill:rgb(160,200,90);font-style:italic;font-size:16px">h</text>';
            pic.innerHTML = '<svg viewBox="0 0 300 230" width="300" height="230" style="min-width:0" role="img" aria-label="Skizze des Körpers">' + svg + '</svg>';
            let t = '';
            if (k === 'zyl') {
                const V = PI * r * r * h, M = 2 * PI * r * h, O = 2 * PI * r * r + M;
                t = '$V = \\pi r^2 h \\approx ' + texNum(V, 2) + '\\,\\text{cm}^3$<br>$M = 2\\pi r h \\approx ' + texNum(M, 2) + '\\,\\text{cm}^2$<br>$O = 2\\pi r^2 + 2\\pi r h \\approx ' + texNum(O, 2) + '\\,\\text{cm}^2$';
            } else if (k === 'kegel') {
                const s = Math.hypot(r, h), V = PI * r * r * h / 3, M = PI * r * s, O = PI * r * r + M;
                t = '$V = \\tfrac13 \\pi r^2 h \\approx ' + texNum(V, 2) + '\\,\\text{cm}^3$<br>Mantellinie $s = \\sqrt{r^2 + h^2} \\approx ' + texNum(s, 2) + '\\,\\text{cm}$<br>$O = \\pi r^2 + \\pi r s \\approx ' + texNum(O, 2) + '\\,\\text{cm}^2$';
            } else {
                const V = 4 / 3 * PI * r ** 3, O = 4 * PI * r * r;
                t = '$V = \\tfrac43 \\pi r^3 \\approx ' + texNum(V, 2) + '\\,\\text{cm}^3$<br>$O = 4 \\pi r^2 \\approx ' + texNum(O, 2) + '\\,\\text{cm}^2$';
            }
            out.innerHTML = '<p style="margin:0;line-height:2">' + t + '</p>';
            math(out);
        }
        render();
    });
    /* ---------- linear inequalities on the number line ---------- */
    const REL = { lt: '<', le: '\\le', gt: '>', ge: '\\ge' };
    const FLIP = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' };
    const HOLDS = { lt: (u, v) => u < v - 1e-9, le: (u, v) => u <= v + 1e-9, gt: (u, v) => u > v + 1e-9, ge: (u, v) => u >= v - 1e-9 };
    W('ungleichung', function (box) {
        const S = { a: -2, b: 3, c: -5, rel: 'lt', t: 1 };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['lt', '$<$'], ['le', '$\\le$'], ['gt', '$>$'], ['ge', '$\\ge$']], S.rel, v => { S.rel = v; render(); }, 'Relationszeichen');
        const sl = div(box, '');
        range(sl, { label: '$a$ (Zahl vor dem $x$)', min: -4, max: 4, step: 0.5, value: S.a, onInput: v => { S.a = v; render(); } });
        range(sl, { label: '$b$', min: -8, max: 8, step: 1, value: S.b, onInput: v => { S.b = v; render(); } });
        range(sl, { label: '$c$ (rechte Seite)', min: -8, max: 8, step: 1, value: S.c, onInput: v => { S.c = v; render(); } });
        math(ctl); math(sl);
        const steps = div(box, 'b-out ug-steps');
        const nl = div(box, 'b-svgbox ug-line');
        const test = div(box, 'b-help'); test.setAttribute('aria-live', 'polite');
        const X0 = 30, X1 = 610, px = x => X0 + (x + 10) / 20 * (X1 - X0), wx = p => (p - X0) / (X1 - X0) * 20 - 10;
        const lhs = (a, b) => (Math.abs(a) < 1e-9 ? '0 \\cdot x' : co(a) + 'x') + sg(b, 2);
        function render() {
            const { a, b, c, rel } = S;
            let html, sol;            // sol: null = no solution, 'all' = every x, else { s, rel }
            if (Math.abs(a) < 1e-9) {
                const ok = HOLDS[rel](b, c);
                sol = ok ? 'all' : null;
                html = '$' + lhs(a, b) + ' ' + REL[rel] + ' ' + c + '$ <span class="ug-op">heißt $' + b + ' ' + REL[rel] + ' ' + c + '$</span><br>' +
                    (ok ? 'Das stimmt für jede Zahl: <span class="b-res">$L = \\mathbb{R}$</span>' : 'Das stimmt für keine Zahl: <span class="b-res">$L = \\{\\,\\}$</span>');
            } else {
                const r2 = a < 0 ? FLIP[rel] : rel, s = new Frac(Math.round(2 * (c - b)), Math.round(2 * a));
                sol = { s: s.value, rel: r2 };
                const rows = ['$' + lhs(a, b) + ' ' + REL[rel] + ' ' + c + '$' + (b ? ' <span class="ug-op">$\\big|\\; ' + (b > 0 ? '-' + b : '+' + -b) + '$</span>' : '')];
                if (b) rows.push('$' + co(a) + 'x ' + REL[rel] + ' ' + (c - b) + '$');
                if (Math.abs(a - 1) > 1e-9) {
                    rows[rows.length - 1] += ' <span class="ug-op">$\\big|\\; : ' + (a < 0 ? '(' + texNum(a, 1) + ')' : texNum(a, 1)) + '$</span>' +
                        (a < 0 ? ' <span class="ug-flip">durch eine negative Zahl: Das Zeichen dreht sich um!</span>' : '');
                    rows.push('$x ' + REL[r2] + ' ' + s.tex() + '$');
                }
                html = rows.join('<br>') + '<br><span class="b-res">$L = \\{\\, x \\in \\mathbb{R} \\mid x ' + REL[r2] + ' ' + s.tex() + ' \\,\\}$</span>';
            }
            steps.innerHTML = html;
            math(steps);
            // number line
            let g = '<svg viewBox="0 0 640 112" role="img" aria-label="Zahlenstrahl mit der Lösungsmenge">';
            if (sol === 'all') g += '<line class="ug-ray" x1="' + X0 + '" y1="56" x2="' + X1 + '" y2="56"/>';
            else if (sol) {
                const sx = Math.min(Math.max(px(sol.s), X0 - 20), X1 + 20), right = sol.rel === 'gt' || sol.rel === 'ge';
                const ex = right ? X1 : X0;
                if ((right && sx < X1) || (!right && sx > X0)) g += '<line class="ug-ray" x1="' + Math.min(Math.max(sx, X0), X1) + '" y1="56" x2="' + ex + '" y2="56"/>' +
                    '<path class="ug-head" d="M' + (right ? X1 + 12 : X0 - 12) + ' 56 L' + ex + ' 49 L' + ex + ' 63 Z"/>';
                if (sx >= X0 && sx <= X1) g += '<circle class="ug-end' + (sol.rel === 'le' || sol.rel === 'ge' ? ' in' : '') + '" cx="' + sx + '" cy="56" r="7"/>';
            }
            g += '<line class="ug-axis" x1="' + (X0 - 14) + '" y1="56" x2="' + (X1 + 14) + '" y2="56"/>';
            for (let k = -10; k <= 10; k++) {
                g += '<line class="ug-tick" x1="' + px(k) + '" y1="' + (k % 5 ? 51 : 47) + '" x2="' + px(k) + '" y2="' + (k % 5 ? 61 : 65) + '"/>';
                if (k % 2 === 0) g += '<text class="ug-num" x="' + px(k) + '" y="86" text-anchor="middle">' + String(k).replace('-', '−') + '</text>';
            }
            // the test point: a marker above the line
            const tx = px(S.t), val = a * S.t + b, ok = HOLDS[rel](val, c);
            g += '<g class="ug-test' + (ok ? ' ok' : '') + '"><path d="M' + tx + ' 44 L' + (tx - 9) + ' 26 L' + (tx + 9) + ' 26 Z"/><line x1="' + tx + '" y1="44" x2="' + tx + '" y2="56"/>' +
                '<text x="' + tx + '" y="18" text-anchor="middle">Probe</text></g>';
            nl.innerHTML = g + '</svg>';
            test.innerHTML = 'Zieh die <b>Probe</b> über den Zahlenstrahl. $x = ' + texNum(S.t, 1) + '$: $\\;' + texNum(a, 1) + ' \\cdot ' + (S.t < 0 ? '(' + texNum(S.t, 1) + ')' : texNum(S.t, 1)) +
                (b < 0 ? ' - ' + -b : ' + ' + b) + ' = ' + texNum(val, 2) + ' ' + REL[rel] + ' ' + c + '$ ist ' + (ok ? '<b class="ug-yes">wahr</b>: Die Zahl gehört zur Lösungsmenge.' : '<b class="ug-no">falsch</b>: Die Zahl gehört nicht dazu.');
            math(test);
        }
        // drag the test point (pointer events on the box, the svg inside is redrawn)
        let drag = false;
        nl.style.touchAction = 'pan-y';
        const toX = e => { const svg = nl.querySelector('svg'), r = svg.getBoundingClientRect(); return Math.round(wx((e.clientX - r.left) / r.width * 640) * 2) / 2; };
        nl.addEventListener('pointerdown', e => { drag = true; nl.setPointerCapture(e.pointerId); S.t = Math.min(10, Math.max(-10, toX(e))); render(); });
        nl.addEventListener('pointermove', e => { if (!drag) return; const t = Math.min(10, Math.max(-10, toX(e))); if (t !== S.t) { S.t = t; render(); } });
        const end = () => { drag = false; };
        nl.addEventListener('pointerup', end); nl.addEventListener('pointercancel', end);
        render();
    });
})();
