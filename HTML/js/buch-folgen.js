/* buch-folgen.js — widgets for sequences, limits and curves in parametric form in the book Mathematik · Gymnasium 10
 * (js/buch.js, js/buch-plot.js).
 *   folge            six sequences, explicit and/or recursive: the terms as points and in a table, monotony, bounds, limit
 *   epsilonschlauch  a strip of width ε around the limit: from which index on do all terms stay inside?
 *   kreisparameter   x = r·cos t, y = r·sin t traces the circle (and x = a·cos t, y = b·sin t an ellipse)
 * Looks: js/buch.css (section "Widgets of the Gymnasium 10 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div, Plot } = B;
    const W = B.widget;

    // same unit on both axes AND the whole box [x] × [y] visible, whatever the width of the canvas
    // (Plot's own "equal" keeps the x-range and cuts y on wide screens): replaces the frame of this one plot
    function fitBoth(p) {
        p._frame = function () {
            const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            let [x0, x1] = this.opt.x, [y0, y1] = this.opt.y;
            if (w && h) {
                const s = Math.min(w / (x1 - x0), h / (y1 - y0)), xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
                x0 = xm - w / s / 2; x1 = xm + w / s / 2; y0 = ym - h / s / 2; y1 = ym + h / s / 2;
            }
            this.f = { w, h, x0, x1, y0, y1 };
            return this.f;
        };
        p.draw();
        return p;
    }

    /* ---------- sequences ---------- */
    // ex: explicit rule (n ≥ 1) · first + next: recursive rule · d: decimals in the table
    const SEQ = {
        arith: { k: 'arithmetisch', ex: n => 3 * n - 1, first: [2], next: a => a[a.length - 1] + 3, expl: 'a_n = 3n - 1', rec: 'a_1 = 2,\\; a_{n+1} = a_n + 3', d: 0,
            mono: 'streng monoton <b>steigend</b>: $a_{n+1} - a_n = 3 > 0$', bound: 'nach unten beschränkt ($a_n \\geq 2$), nach oben <b>nicht</b> beschränkt', lim: 'kein Grenzwert: Die Glieder wachsen über jede Grenze.' },
        geom: { k: 'geometrisch', ex: n => 8 * Math.pow(0.5, n - 1), first: [8], next: a => 0.5 * a[a.length - 1], expl: 'a_n = 8 \\cdot 0{,}5^{\\,n-1}', rec: 'a_1 = 8,\\; a_{n+1} = 0{,}5 \\cdot a_n', d: 4, g: 0,
            mono: 'streng monoton <b>fallend</b>: $\\tfrac{a_{n+1}}{a_n} = 0{,}5 < 1$', bound: 'beschränkt: $0 < a_n \\leq 8$', lim: 'Grenzwert $0$' },
        quot: { k: '(n + 1)/n', ex: n => (n + 1) / n, expl: 'a_n = \\dfrac{n + 1}{n} = 1 + \\dfrac{1}{n}', d: 4, g: 1,
            mono: 'streng monoton <b>fallend</b>: $\\tfrac1n$ wird immer kleiner', bound: 'beschränkt: $1 < a_n \\leq 2$', lim: 'Grenzwert $1$' },
        alt: { k: 'alternierend', ex: n => Math.pow(-1, n) / n, expl: 'a_n = \\dfrac{(-1)^n}{n}', d: 4, g: 0,
            mono: '<b>nicht</b> monoton: Das Vorzeichen wechselt bei jedem Glied', bound: 'beschränkt: $-1 \\leq a_n \\leq \\tfrac12$', lim: 'Grenzwert $0$, von beiden Seiten abwechselnd' },
        fib: { k: 'Fibonacci', first: [1, 1], next: a => a[a.length - 1] + a[a.length - 2], rec: 'a_1 = a_2 = 1,\\; a_{n+2} = a_{n+1} + a_n', d: 0,
            mono: 'ab dem zweiten Glied streng monoton <b>steigend</b>', bound: 'nach oben <b>nicht</b> beschränkt', lim: 'kein Grenzwert. Aber die Quotienten $\\tfrac{a_{n+1}}{a_n}$ nähern sich dem goldenen Schnitt $1{,}618\\ldots$' },
        heron: { k: 'Heron (√2)', first: [1], next: a => { const x = a[a.length - 1]; return (x + 2 / x) / 2; }, rec: 'a_1 = 1,\\; a_{n+1} = \\dfrac12\\left(a_n + \\dfrac{2}{a_n}\\right)', d: 6, g: Math.SQRT2,
            mono: 'ab dem zweiten Glied streng monoton <b>fallend</b>', bound: 'beschränkt: $1 \\leq a_n \\leq 1{,}5$', lim: 'Grenzwert $\\sqrt2 \\approx 1{,}414214$, schon $a_5$ stimmt auf elf Nachkommastellen' }
    };
    function terms(S, N) {
        if (S.ex) return Array.from({ length: N }, (_, i) => S.ex(i + 1));
        const a = S.first.slice(0, N);
        while (a.length < N) a.push(S.next(a));
        return a;
    }
    W('folge', function (box) {
        let key = box.dataset.start || 'arith', N = 12;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(SEQ).map(k => [k, SEQ[k].k]), key, v => { key = v; render(); }, 'Folge');
        const sl = div(box, '');
        range(sl, { label: 'Anzahl der Glieder', min: 5, max: 30, step: 1, value: N, fmt: v => String(v), onInput: v => { N = v; render(); } });
        const p = new Plot(div(box, ''), { height: 280, xLabel: 'n', yLabel: 'aₙ', aria: 'Glieder einer Zahlenfolge als Punkte' });
        const tab = div(box, 'b-table-wrap');
        const out = div(box, 'b-out');
        function render() {
            const S = SEQ[key], a = terms(S, N);
            const lo = Math.min(...a, S.g != null ? S.g : Infinity), hi = Math.max(...a, S.g != null ? S.g : -Infinity), pad = (hi - lo) * 0.1 || 1;
            p.opt.xStep = N <= 15 ? 1 : 5;
            p.view([0, N + 1], [Math.min(0, lo - pad), hi + pad]);
            const L = [];
            if (S.g != null) L.push({ hline: S.g, color: 'violet' });
            L.push({ pts: a.map((v, i) => [i + 1, v]), color: 'lambda', r: 4.2 });
            p.draw(L);
            const show = a.slice(0, 8);
            tab.innerHTML = '<table class="b-table" style="min-width:0"><tr><th>$n$</th>' + show.map((_, i) => '<td>' + (i + 1) + '</td>').join('') + '</tr>' +
                '<tr><th>$a_n$</th>' + show.map(v => '<td>' + fmt(v, S.d) + '</td>').join('') + '</tr></table>';
            out.innerHTML = (S.expl ? '<p style="margin:0 0 6px">explizit: $' + S.expl + '$</p>' : '<p style="margin:0 0 6px">explizit: keine einfache Formel, die Folge ist <b>rekursiv</b> festgelegt.</p>') +
                (S.rec ? '<p style="margin:0 0 6px">rekursiv: $' + S.rec + '$</p>' : '') +
                '<p style="margin:0 0 6px"><b>Monotonie:</b> ' + S.mono + '</p><p style="margin:0 0 6px"><b>Schranken:</b> ' + S.bound + '</p><p style="margin:0"><b>Grenzwert:</b> ' + S.lim + '</p>';
            math(tab); math(out);
        }
        render();
    });

    /* ---------- the epsilon strip ---------- */
    const LIM = {
        quot: { k: '(n + 1)/n', f: n => (n + 1) / n, g: 1, tex: '\\dfrac{n + 1}{n}', d: e => '\\left|a_n - 1\\right| = \\dfrac{1}{n} < \\varepsilon \\iff n > \\dfrac{1}{\\varepsilon} = ' + texNum(1 / e, 3) },
        alt: { k: '(−1)ⁿ/n', f: n => Math.pow(-1, n) / n, g: 0, tex: '\\dfrac{(-1)^n}{n}', d: e => '\\left|a_n - 0\\right| = \\dfrac{1}{n} < \\varepsilon \\iff n > \\dfrac{1}{\\varepsilon} = ' + texNum(1 / e, 3) },
        geo: { k: '2 − 0,8ⁿ', f: n => 2 - Math.pow(0.8, n), g: 2, tex: '2 - 0{,}8^n', d: e => '\\left|a_n - 2\\right| = 0{,}8^n < \\varepsilon \\iff n > \\dfrac{\\lg \\varepsilon}{\\lg 0{,}8} = ' + texNum(Math.log10(e) / Math.log10(0.8), 3) },
        slow: { k: '(2n + 1)/(n + 3)', f: n => (2 * n + 1) / (n + 3), g: 2, tex: '\\dfrac{2n + 1}{n + 3}', d: e => '\\left|a_n - 2\\right| = \\dfrac{5}{n + 3} < \\varepsilon \\iff n > \\dfrac{5}{\\varepsilon} - 3 = ' + texNum(5 / e - 3, 3) }
    };
    W('epsilonschlauch', function (box) {
        let key = 'quot', eps = 0.2;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(LIM).map(k => [k, LIM[k].k]), key, v => { key = v; render(); }, 'Folge');
        const sl = div(box, '');
        range(sl, { label: 'Breite $\\varepsilon$ des Schlauchs', min: 0.02, max: 0.5, step: 0.01, value: eps, fmt: v => fmt(v, 2), onInput: v => { eps = v; render(); } });
        math(sl);
        const p = new Plot(div(box, ''), { height: 290, xLabel: 'n', yLabel: 'aₙ', aria: 'Folgenglieder und ein Streifen um den Grenzwert' });
        const out = div(box, 'b-out');
        function render() {
            const S = LIM[key];
            // |a_n − g| decreases for all four sequences: the first index inside is n0
            let n0 = 1; while (Math.abs(S.f(n0) - S.g) >= eps - 1e-12 && n0 < 100000) n0++;
            const N = Math.min(150, Math.max(25, n0 + 12));
            const a = Array.from({ length: N }, (_, i) => S.f(i + 1));
            const lo = Math.min(...a, S.g - 0.55), hi = Math.max(...a, S.g + 0.55);
            p.opt.xStep = N <= 30 ? 2 : N <= 80 ? 10 : 20;
            p.view([0, N + 1], [lo - 0.1, hi + 0.1]);
            const inn = [], outer = [];
            a.forEach((v, i) => (Math.abs(v - S.g) < eps - 1e-12 ? inn : outer).push([i + 1, v]));
            p.draw([{ polys: [[[0, S.g - eps], [N + 1, S.g - eps], [N + 1, S.g + eps], [0, S.g + eps]]], color: 'phi' }, { hline: S.g, color: 'violet' },
                { vline: n0 - 0.5, color: 'lambda' }, { pts: outer, color: 'red', r: 3.6 }, { pts: inn, color: 'phi', r: 3.6 }]);
            out.innerHTML = '<p style="margin:0 0 6px">$a_n = ' + S.tex + '$ hat den Grenzwert $g = ' + texNum(S.g, 2) + '$. Schlauch: $' + texNum(S.g - eps, 2) + ' < a_n < ' + texNum(S.g + eps, 2) + '$</p>' +
                '<p style="margin:0 0 6px">$' + S.d(eps) + '$</p>' +
                '<p style="margin:0">Ab $n_0 = ' + n0 + '$ liegen <b>alle</b> weiteren Glieder im Schlauch, davor ' + (n0 > 1 ? 'liegen ' + (n0 - 1) + ' außerhalb' : 'keines außerhalb') + '. Mach $\\varepsilon$ kleiner: $n_0$ wird größer, aber es gibt <b>immer</b> eins. Genau das bedeutet „Grenzwert“.</p>';
            math(out);
        }
        render();
    });

    /* ---------- circle in parametric form ---------- */
    W('kreisparameter', function (box) {
        const S = { form: 'kreis', t: 60, r: 2.5, a: 3.2, b: 1.8 };
        let playing = false, raf = 0;
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['kreis', 'Kreis'], ['ellipse', 'Ellipse (Ausblick)']], S.form, v => { S.form = v; build(); }, 'Kurve');
        const play = document.createElement('button'); play.type = 'button'; play.className = 'b-btn b-go'; play.textContent = 'Abspielen'; ctl.appendChild(play);
        const sl = div(box, '');
        let rt = null;
        const p = fitBoth(new Plot(div(box, ''), { x: [-4, 4], y: [-3.4, 3.4], height: 330, aria: 'Ein Punkt läuft auf einem Kreis, gesteuert vom Parameter t' }));
        const out = div(box, 'b-out');
        function build() {
            sl.innerHTML = '';
            rt = range(sl, { label: 'Parameter $t$ (Winkel)', min: 0, max: 360, step: 1, value: S.t, fmt: v => v + '°', onInput: v => { S.t = v; render(); } });
            if (S.form === 'kreis') range(sl, { label: 'Radius $r$', min: 0.5, max: 3.2, step: 0.1, value: S.r, fmt: v => fmt(v, 1), onInput: v => { S.r = v; render(); } });
            else {
                range(sl, { label: 'Halbachse $a$', min: 0.5, max: 3.8, step: 0.1, value: S.a, fmt: v => fmt(v, 1), onInput: v => { S.a = v; render(); } });
                range(sl, { label: 'Halbachse $b$', min: 0.5, max: 3.2, step: 0.1, value: S.b, fmt: v => fmt(v, 1), onInput: v => { S.b = v; render(); } });
            }
            math(sl); render();
        }
        function render() {
            const ax = S.form === 'kreis' ? S.r : S.a, by = S.form === 'kreis' ? S.r : S.b, t = S.t * Math.PI / 180;
            const P = u => [ax * Math.cos(u), by * Math.sin(u)];
            const L = [], n = 90;
            for (let i = 0; i < n; i++) L.push({ seg: [P(i / n * 2 * Math.PI), P((i + 1) / n * 2 * Math.PI)], color: 'dim', width: 1 });
            const k = Math.max(1, Math.round(n * S.t / 360));
            for (let i = 0; i < k; i++) L.push({ seg: [P(i / k * t), P((i + 1) / k * t)], color: 'lambda', width: 3 });
            const [x, y] = P(t);
            L.push({ seg: [[0, 0], [x, y]], color: 'white', width: 1.4 }, { seg: [[x, 0], [x, y]], color: 'cyan', dash: true }, { seg: [[0, y], [x, y]], color: 'phi', dash: true },
                { pts: [[x, y]], color: 'white', r: 6 }, { pts: [[x, 0]], color: 'cyan', r: 4 }, { pts: [[0, y]], color: 'phi', r: 4 });
            p.draw(L);
            const rad = texNum(t, 3);
            out.innerHTML = S.form === 'kreis'
                ? '<p style="margin:0 0 6px">$t = ' + S.t + '^\\circ = ' + rad + '$ im Bogenmaß · <span style="color:#7fd8ee">$x = r\\cos t = ' + texNum(x, 3) + '$</span> · <span style="color:rgb(160,200,90)">$y = r\\sin t = ' + texNum(y, 3) + '$</span></p>' +
                  '<p style="margin:0">Probe: $x^2 + y^2 = r^2(\\cos^2 t + \\sin^2 t) = r^2 = ' + texNum(S.r * S.r, 2) + '$. Jeder Wert von $t$ liefert einen Punkt, der genau $r$ vom Mittelpunkt entfernt ist.</p>'
                : '<p style="margin:0 0 6px">$x = a\\cos t = ' + texNum(x, 3) + '$ · $y = b\\sin t = ' + texNum(y, 3) + '$</p><p style="margin:0">Mit zwei verschiedenen Halbachsen wird der Kreis in einer Richtung gestreckt: eine <b>Ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. So laufen Planeten um die Sonne.</p>';
            math(out);
        }
        function tick() { S.t = (S.t + 1) % 361; if (rt) rt.set(S.t); render(); if (playing) raf = requestAnimationFrame(tick); }
        play.addEventListener('click', () => { playing = !playing; play.textContent = playing ? 'Anhalten' : 'Abspielen'; if (playing) tick(); else cancelAnimationFrame(raf); });
        build();
    });
})();
