/* buch-komplex.js — widgets for the complex numbers (Wahlbereich) in the book Mathematik · Gymnasium 10 (js/buch.js, js/buch-plot.js).
 *   quadkomplex  x² + px + q = 0: the parabola and, beside it, the two solutions in the Gaussian plane - when the
 *                discriminant turns negative they leave the real axis as a conjugate pair
 *   zeiger       a complex number as an arrow: modulus and argument, multiplying by i turns by 90°, squaring doubles the angle
 * Looks: js/buch.css (section "Widgets of the Gymnasium 10 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { texNum, math, range, seg, div, Plot } = B;
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
    const r2 = v => Math.round(v * 1000) / 1000;
    function cx(a, b, d = 3) {                                       // a + bi in TeX
        a = r2(a); b = r2(b);
        if (!b) return texNum(a, d);
        const im = (Math.abs(b) === 1 ? '' : texNum(Math.abs(b), d)) + '\\,\\mathrm{i}';
        if (!a) return (b < 0 ? '-' : '') + im;
        return texNum(a, d) + (b < 0 ? ' - ' : ' + ') + im;
    }
    // a little arc of radius rr from angle 0 to phi as segments (the plotter has no arcs)
    function arc(rr, phi, color) {
        const L = [], n = Math.max(4, Math.round(Math.abs(phi) / 0.12));
        for (let i = 0; i < n; i++) L.push({ seg: [[rr * Math.cos(phi * i / n), rr * Math.sin(phi * i / n)], [rr * Math.cos(phi * (i + 1) / n), rr * Math.sin(phi * (i + 1) / n)]], color, width: 2 });
        return L;
    }
    const argDeg = (a, b) => { let p = Math.atan2(b, a) * 180 / Math.PI; if (p < 0) p += 360; return p; };

    /* ---------- quadratic equations with complex solutions ---------- */
    W('quadkomplex', function (box) {
        const S = { p: 2, q: 5 };
        const sl = div(box, '');
        range(sl, { label: '$p$', min: -6, max: 6, step: 0.5, value: S.p, fmt: v => texNum(v, 1).replace('{,}', ','), onInput: v => { S.p = v; render(); } });
        range(sl, { label: '$q$', min: -6, max: 10, step: 0.5, value: S.q, fmt: v => texNum(v, 1).replace('{,}', ','), onInput: v => { S.q = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const pa = new Plot(div(two, ''), { x: [-7, 7], y: [-6, 10], height: 290, aria: 'Parabel y = x² + px + q' });
        const pc = fitBoth(new Plot(div(two, ''), { x: [-5, 5], y: [-4, 4], height: 290, xLabel: 'Re', yLabel: 'Im', aria: 'Die beiden Lösungen in der Gaußschen Zahlenebene' }));
        const out = div(box, 'b-out');
        function render() {
            const { p, q } = S, D = p * p / 4 - q, h = -p / 2;
            const z = D >= 0 ? [[h + Math.sqrt(D), 0], [h - Math.sqrt(D), 0]] : [[h, Math.sqrt(-D)], [h, -Math.sqrt(-D)]];
            const LA = [{ fn: x => x * x + p * x + q, color: 'lambda' }];
            if (D >= 0) LA.push({ pts: z.map(v => [v[0], 0]), color: 'white', r: 5.5 });
            pa.draw(LA);
            pc.draw([{ seg: [[0, 0], z[0]], color: 'cyan', width: 2.2, arrow: true }, { seg: [[0, 0], z[1]], color: 'cyan', width: 2.2, arrow: true },
                { pts: z, color: 'white', r: 5.5 }, { text: 'z₁', at: z[0], color: 'cyan' }, { text: 'z₂', at: z[1], color: 'cyan', dy: 22 }]);
            const Q = texNum(q, 1);
            const eq = 'x^2' + (p ? (p > 0 ? ' + ' : ' - ') + texNum(Math.abs(p), 1) + 'x' : '') + (q ? (q > 0 ? ' + ' : ' - ') + texNum(Math.abs(q), 1) : '') + ' = 0';
            out.innerHTML = '<p style="margin:0 0 6px">$' + eq + '$ · Diskriminante $D = \\left(\\tfrac{p}{2}\\right)^2 - q = ' + texNum(p * p / 4, 3) + ' - ' + (q < 0 ? '(' + Q + ')' : Q) + ' = ' + texNum(D, 3) + '$</p>' +
                (D > 1e-12 ? '<p style="margin:0 0 6px">$D > 0$: zwei reelle Lösungen $x_{1,2} = ' + texNum(h, 2) + ' \\pm ' + texNum(Math.sqrt(D), 3) + '$, die Parabel schneidet die $x$-Achse zweimal.</p>'
                    : Math.abs(D) <= 1e-12 ? '<p style="margin:0 0 6px">$D = 0$: genau eine Lösung $x = ' + texNum(h, 2) + '$, die Parabel berührt die $x$-Achse.</p>'
                        : '<p style="margin:0 0 6px">$D < 0$: keine reelle Lösung, die Parabel bleibt über der $x$-Achse. In $\\mathbb{C}$: $z_{1,2} = ' + texNum(h, 2) + ' \\pm \\sqrt{' + texNum(D, 3) + '} = ' + texNum(h, 2) + ' \\pm ' + texNum(Math.sqrt(-D), 3) + '\\,\\mathrm{i}$, zwei <b>konjugiert komplexe</b> Zahlen, gespiegelt an der reellen Achse.</p>') +
                '<p style="margin:0">Vieta stimmt auch hier: $z_1 + z_2 = ' + texNum(z[0][0] + z[1][0], 2) + ' = -p$ und $z_1 \\cdot z_2 = ' + texNum(D >= 0 ? z[0][0] * z[1][0] : h * h - D, 2) + ' = q$.</p>';
            math(out);
        }
        render();
    });

    /* ---------- a complex number as an arrow ---------- */
    W('zeiger', function (box) {
        const h = [{ x: 3, y: 2, color: 'lambda', snap: 0.5 }];
        let mode = box.dataset.mode || 'betrag';
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['betrag', 'Betrag und Argument'], ['mali', 'mal $\\mathrm{i}$'], ['quadrat', 'Quadrat $z^2$']], mode, v => { mode = v; render(); }, 'Ansicht');
        math(ctl);
        const p = fitBoth(new Plot(div(box, ''), { x: [-6, 6], y: [-4.6, 4.6], height: 340, xLabel: 'Re', yLabel: 'Im', aria: 'Komplexe Zahl als Pfeil in der Gaußschen Zahlenebene' }));
        const out = div(box, 'b-out');
        p.handles(h, () => render());
        function render() {
            const a = h[0].x, b = h[0].y, r = Math.hypot(a, b), phi = argDeg(a, b);
            const L = [{ seg: [[0, 0], [a, b]], color: 'lambda', width: 3, arrow: true }, { text: 'z', at: [a, b], color: 'lambda' }];
            let txt;
            if (mode === 'betrag') {
                L.push({ seg: [[a, 0], [a, b]], color: 'cyan', dash: true }, { seg: [[0, 0], [a, 0]], color: 'cyan', dash: true }, ...arc(0.9, phi * Math.PI / 180, 'phi'), { text: 'φ', at: [0.9, 0.2], color: 'phi' });
                txt = '<p style="margin:0 0 6px">$z = ' + cx(a, b) + '$ · Realteil $' + texNum(a, 2) + '$, Imaginärteil $' + texNum(b, 2) + '$</p>' +
                    '<p style="margin:0">Betrag $|z| = \\sqrt{' + texNum(a * a, 2) + ' + ' + texNum(b * b, 2) + '} \\approx ' + texNum(r, 3) + '$ (Pythagoras) · Argument $\\varphi \\approx ' + texNum(phi, 1) + '^\\circ$, der Winkel zur positiven reellen Achse</p>';
            } else if (mode === 'mali') {
                const c = -b, d = a;
                L.push({ seg: [[0, 0], [c, d]], color: 'cyan', width: 3, arrow: true }, { text: 'i·z', at: [c, d], color: 'cyan' });
                const mid = [a ? texNum(a, 2) + '\\,\\mathrm{i}' : '', b ? texNum(b, 2) + '\\,\\mathrm{i}^2' : ''].filter(Boolean).join(' + ').replace(/\+ -/g, '- ') || '0';
                txt = '<p style="margin:0 0 6px">$\\mathrm{i} \\cdot z = \\mathrm{i}\\,(' + cx(a, b) + ') = ' + mid + ' = ' + cx(c, d) + '$</p>' +
                    '<p style="margin:0">Wegen $\\mathrm{i}^2 = -1$ wird der Pfeil um $90^\\circ$ <b>gegen den Uhrzeigersinn gedreht</b>, der Betrag bleibt $' + texNum(r, 3) + '$. Viermal mal $\\mathrm{i}$ ergibt eine volle Drehung: $\\mathrm{i}^4 = 1$.</p>';
            } else {
                const c = a * a - b * b, d = 2 * a * b;
                L.push({ seg: [[0, 0], [c, d]], color: 'phi', width: 3, arrow: true }, { text: 'z²', at: [Math.max(-5.6, Math.min(5.4, c)), Math.max(-4.4, Math.min(4.4, d))], color: 'phi' });
                txt = '<p style="margin:0 0 6px">$z^2 = (' + cx(a, b) + ')^2 = ' + texNum(a * a, 2) + ' + ' + texNum(2 * a * b, 2) + '\\,\\mathrm{i} + ' + texNum(b * b, 2) + '\\,\\mathrm{i}^2 = ' + cx(c, d) + '$</p>' +
                    '<p style="margin:0">Der Betrag wird quadriert ($' + texNum(r, 2) + '^2 \\approx ' + texNum(r * r, 2) + '$), das Argument verdoppelt ($\\approx ' + texNum(phi, 1) + '^\\circ \\to ' + texNum((2 * phi) % 360, 1) + '^\\circ$).</p>';
                txt = txt.replace(/\+ -/g, '- ');
            }
            p.draw(L);
            out.innerHTML = txt;
            math(out);
        }
        render();
    });
})();
