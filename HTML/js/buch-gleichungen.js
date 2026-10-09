/* buch-gleichungen.js — widgets for Lernbereich 2 (equations, formulas, figures) of the textbook (js/buch.js).
 *   waage    equivalence transformations: type "| −3", "| :4", "| −2x" and watch the equation change until x stands alone
 *   binom    (a + b)² as a square of four pieces
 *   koerper  cylinder, cone, sphere: volume and surface with sliders, formulas and a sketch
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { Frac, fmt, texNum, math, range, seg, div } = B;
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
})();
