/* buch-os10.js — widgets of the book Mathematik · Oberschule 10 (Realschulbildungsgang) (js/buch.js). Every name ends in os10:
 * the Oberschule books 6 to 10 are built side by side.
 *   titelbildos10  the cover: a general triangle with its angles, a sine wave, an exponential curve, a frustum, a die
 *   stumpfos10     frustum of a cone or a square pyramid in axial section: R, r and h as sliders, the volume by the formula and as
 *                  the difference of two whole bodies, the lateral surface, the mass for a chosen material (data-mode="kegel|pyramide")
 *   lohnos10       a simple payslip: gross pay as a slider, assumed rates for the social insurance and an assumed income tax rate,
 *                  net pay and what the employer pays on top, as a stacked bar
 * Colours of drawn parts go into style="" (never fill=""), so js/farbschema.js can translate them; the cover is exempt
 * (buch-titel.css is data-fs-skip). Looks: only the shared classes of js/buch.css - no own CSS block.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, math, range, seg, div } = B;
    const W = B.widget;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const f1 = v => (Math.round(v * 10) / 10).toString();
    // numbers in the German way: comma, thin space from five digits on
    const de = (v, n) => {
        const s = Math.abs(v).toFixed(n == null ? 1 : n).split('.');
        const int = s[0].length > 4 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : s[0];
        return (v < 0 ? '−' : '') + int + (s[1] ? ',' + s[1] : '');
    };
    const tex = (v, n) => de(v, n).replace(/\u202f/g, '\\,').replace(',', '{,}').replace('−', '-');
    // the same without trailing zeros: 25 instead of 25,00, 6,25 stays
    const texs = (v, n) => tex(v, n).replace(/\{,\}(\d*?)0+$/, (m, d) => d ? '{,}' + d : '');
    const txt = (x, y, s, st, anchor) => '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle" style="' + (st || '') + '">' + s + '</text>';
    const line = (p, q, st) => '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '" style="' + st + '"/>';
    const poly = (pts, st) => '<polygon points="' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ') + '" style="' + st + '"/>';

    /* ---------- the cover ---------- */
    W('titelbildos10', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        const word = (x, y, s, size, c) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="middle" fill="' + (c || '#fff') + '" fill-opacity="0.88" font-family="Times New Roman, serif" font-style="italic" font-size="' + size + '">' + s + '</text>';
        const spot = p => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        let art = '';
        // a sine wave right across the page, far behind everything
        let d = '';
        for (let x = 0; x <= Wd; x += 6) d += (x ? ' L' : 'M') + x + ' ' + f1(520 + 52 * Math.sin((x - 20) / 62));
        art += '<path d="' + d + '" stroke="#B8A4F2" stroke-width="2.6" stroke-opacity="0.75" fill="none"/>';
        // an exponential curve rising to the upper right
        let e = '';
        for (let x = 300; x <= 552; x += 6) e += (x > 300 ? ' L' : 'M') + x + ' ' + f1(770 - 18 * Math.pow(1.0125, x - 300));
        art += glow(e, '#A0C85A', 2.6, '9 7');
        // a general triangle with the three angles marked: law of sines and cosines
        const A = [70, 738], Bp = [330, 738], C = [205, 526];
        art += '<path d="M' + A + ' L' + Bp + ' L' + C + ' Z" fill="#F5C242" fill-opacity="0.08"/>' + glow('M' + A + ' L' + Bp + ' L' + C + ' Z', '#F5C242', 3);
        const arc = (P, Q, R, r, c) => {
            const a1 = Math.atan2(Q[1] - P[1], Q[0] - P[0]), a2 = Math.atan2(R[1] - P[1], R[0] - P[0]);
            const p1 = [P[0] + r * Math.cos(a1), P[1] + r * Math.sin(a1)], p2 = [P[0] + r * Math.cos(a2), P[1] + r * Math.sin(a2)];
            return '<path d="M' + f1(p1[0]) + ' ' + f1(p1[1]) + ' A' + r + ' ' + r + ' 0 0 ' + (((a2 - a1 + 2 * Math.PI) % (2 * Math.PI)) < Math.PI ? 1 : 0) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]) + '" stroke="' + c + '" stroke-width="2.4" fill="none"/>';
        };
        art += arc(A, Bp, C, 34, '#7fd8ee') + arc(Bp, C, A, 34, '#7fd8ee') + arc(C, A, Bp, 30, '#7fd8ee');
        art += word(116, 720, 'α', 30, '#7fd8ee') + word(287, 720, 'β', 30, '#7fd8ee') + word(205, 578, 'γ', 28, '#7fd8ee');
        art += word(200, 764, 'c', 30) + word(286, 618, 'a', 30) + word(122, 618, 'b', 30);
        // a frustum of a cone, upper right
        const cx = 470, top = 380, bot = 480, R = 78, r = 40;
        art += '<ellipse cx="' + cx + '" cy="' + bot + '" rx="' + R + '" ry="18" fill="#7fd8ee" fill-opacity="0.1" stroke="#7fd8ee" stroke-width="2.4" stroke-dasharray="8 6"/>';
        art += glow('M' + (cx - R) + ' ' + bot + ' L' + (cx - r) + ' ' + top + ' M' + (cx + R) + ' ' + bot + ' L' + (cx + r) + ' ' + top, '#7fd8ee', 2.6);
        art += '<ellipse cx="' + cx + '" cy="' + top + '" rx="' + r + '" ry="10" fill="#7fd8ee" fill-opacity="0.16" stroke="#7fd8ee" stroke-width="2.6"/>';
        art += '<path d="M' + (cx - r) + ' ' + top + ' L' + cx + ' ' + (top - 100) + ' L' + (cx + r) + ' ' + top + '" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.6" stroke-dasharray="6 6" fill="none"/>';
        // a die with a six: expectation and chance
        const dx = 470, dy = 640, s = 70;
        art += '<rect x="' + (dx - s / 2) + '" y="' + (dy - s / 2) + '" width="' + s + '" height="' + s + '" rx="12" fill="#E682BE" fill-opacity="0.14" stroke="#E682BE" stroke-width="2.6"/>';
        [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]].forEach(q => { art += '<circle cx="' + (dx + q[0] * 18) + '" cy="' + (dy + q[1] * 18) + '" r="6" fill="#fff" fill-opacity="0.9"/>'; });
        art += spot(A) + spot(Bp) + spot(C);
        const id = 'tos10' + Math.random().toString(36).slice(2, 7);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Dreieck mit den Winkeln α, β und γ, eine Sinuskurve, eine Exponentialkurve, ein Kegelstumpf und ein Würfel">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- frustum of a cone or a pyramid ---------- */
    const STOFF = [['holz', 'Holz', 0.6], ['beton', 'Beton', 2.4], ['stahl', 'Stahl', 7.85]];
    W('stumpfos10', function (box) {
        const S = { mode: box.dataset.mode === 'pyramide' ? 'pyramide' : 'kegel', R: 5, r: 2, h: 4, stoff: 'holz' };
        const c = div(box, 'b-ctrls');
        seg(c, [['kegel', 'Kegelstumpf'], ['pyramide', 'Pyramidenstumpf']], S.mode, v => { S.mode = v; names(); render(); }, 'Körper');
        const sl = div(box, '');
        const rR = range(sl, { label: '', min: 1, max: 8, step: 0.5, value: S.R, fmt: v => de(v, 1) + ' cm', onInput: v => { S.R = v; if (S.r > S.R) { S.r = S.R; rr.set(S.r); } render(); } });
        const rr = range(sl, { label: '', min: 0, max: 8, step: 0.5, value: S.r, fmt: v => de(v, 1) + ' cm', onInput: v => { S.r = Math.min(v, S.R); if (v > S.R) rr.set(S.r); render(); } });
        range(sl, { label: 'Höhe $h$', min: 1, max: 10, step: 0.5, value: S.h, fmt: v => de(v, 1) + ' cm', onInput: v => { S.h = v; render(); } });
        const c2 = div(box, 'b-ctrls');
        seg(c2, STOFF.map(s => [s[0], s[1]]), S.stoff, v => { S.stoff = v; render(); }, 'Material');
        const pic = div(box, 'b-svgbox g-svg os10-pic');
        const out = div(box, 'b-out');
        function names() {
            const k = S.mode === 'kegel';
            rR.input.closest('.b-range').querySelector('label').innerHTML = k ? 'Radius unten $R$' : 'Kante unten $a_1$';
            rr.input.closest('.b-range').querySelector('label').innerHTML = k ? 'Radius oben $r$' : 'Kante oben $a_2$';
            math(sl);
        }
        function render() {
            const k = S.mode === 'kegel', R = S.R, r = S.r, h = S.h;
            // axial section: for the pyramid the half edges play the part of the radii
            const hR = k ? R : R / 2, hr = k ? r : r / 2;
            const sc = Math.min(22, 210 / Math.max(2 * hR, 1), 190 / Math.max(h, 1));
            // on a narrow box (phone) only the axial section, drawn larger; the small view of the body is left out
            const narrow = box.clientWidth < 480, VW = narrow ? 420 : 600;
            const cx = 210, by = 250, ty = by - h * sc;
            let g = '';
            const tip = hR > hr ? h * hR / (hR - hr) : null;
            if (tip != null && tip * sc < 420) {
                const py = by - tip * sc;
                g += line([cx - hr * sc, ty], [cx, py], 'stroke:' + DIM + ';stroke-width:1.4;stroke-dasharray:6 5') + line([cx + hr * sc, ty], [cx, py], 'stroke:' + DIM + ';stroke-width:1.4;stroke-dasharray:6 5');
            }
            g += poly([[cx - hR * sc, by], [cx + hR * sc, by], [cx + hr * sc, ty], [cx - hr * sc, ty]], 'fill:rgba(127,216,238,0.16);stroke:' + CY + ';stroke-width:2.6;stroke-linejoin:round');
            g += line([cx, by], [cx, ty], 'stroke:' + LAM + ';stroke-width:2;stroke-dasharray:5 4');
            g += line([cx, by], [cx + hR * sc, by], 'stroke:' + RED + ';stroke-width:3') + line([cx, ty], [cx + hr * sc, ty], 'stroke:' + PHI + ';stroke-width:3');
            const lab = 'font:italic 17px Times New Roman,serif;fill:' + TXT;
            g += txt(cx + hR * sc / 2, by + 16, k ? 'R' : 'a₁ : 2', lab) + txt(cx + hr * sc / 2 + (hr ? 0 : 12), ty - 13, k ? 'r' : 'a₂ : 2', lab) + txt(cx - 12, (by + ty) / 2, 'h', lab, 'end');
            // a small view of the whole body on the right
            const vx = 470, vy = 205, s2 = Math.min(14, 120 / Math.max(2 * hR, 1), 120 / Math.max(h, 1));
            if (narrow) { /* no side view */ } else if (k) {
                g += '<ellipse cx="' + vx + '" cy="' + f1(vy + h * s2 / 2) + '" rx="' + f1(R * s2) + '" ry="' + f1(R * s2 * 0.28) + '" style="fill:rgba(127,216,238,0.12);stroke:' + CY + ';stroke-width:2"/>';
                g += line([vx - R * s2, vy + h * s2 / 2], [vx - r * s2, vy - h * s2 / 2], 'stroke:' + CY + ';stroke-width:2') + line([vx + R * s2, vy + h * s2 / 2], [vx + r * s2, vy - h * s2 / 2], 'stroke:' + CY + ';stroke-width:2');
                g += '<ellipse cx="' + vx + '" cy="' + f1(vy - h * s2 / 2) + '" rx="' + f1(Math.max(r * s2, 0.5)) + '" ry="' + f1(Math.max(r * s2 * 0.28, 0.5)) + '" style="fill:rgba(127,216,238,0.2);stroke:' + CY + ';stroke-width:2"/>';
            } else {
                const q = (a, y) => [[vx - a * s2 / 2, y + a * s2 * 0.18], [vx + a * s2 / 2 - a * s2 * 0.25, y + a * s2 * 0.18], [vx + a * s2 / 2, y - a * s2 * 0.12], [vx - a * s2 / 2 + a * s2 * 0.25, y - a * s2 * 0.12]];
                const Q1 = q(R, vy + h * s2 / 2), Q2 = q(r, vy - h * s2 / 2);
                g += poly(Q1, 'fill:rgba(127,216,238,0.12);stroke:' + CY + ';stroke-width:2') + poly(Q2, 'fill:rgba(127,216,238,0.2);stroke:' + CY + ';stroke-width:2');
                for (let i = 0; i < 4; i++) g += line(Q1[i], Q2[i], 'stroke:' + CY + ';stroke-width:2');
            }
            pic.innerHTML = '<svg viewBox="0 0 ' + VW + ' 290" role="img" aria-label="' + (k ? 'Kegelstumpf' : 'Pyramidenstumpf') + ' im Achsenschnitt und als Körper">' + g + '</svg>';
            // numbers
            const G1 = k ? Math.PI * R * R : R * R, G2 = k ? Math.PI * r * r : r * r;
            const V = h / 3 * (G1 + Math.sqrt(G1 * G2) + G2);
            const rho = STOFF.find(s => s[0] === S.stoff);
            let html;
            if (k) {
                const sLen = Math.sqrt(h * h + (R - r) * (R - r)), M = Math.PI * sLen * (R + r);
                html = '<p>$V = \\dfrac{\\pi h}{3}\\,(R^2 + R r + r^2) = \\dfrac{\\pi \\cdot ' + tex(h, 1) + '}{3}\\,(' + texs(R * R, 2) + ' + ' + texs(R * r, 2) + ' + ' + texs(r * r, 2) + ') \\approx ' + tex(V, 1) + '\\ \\text{cm}^3$</p>';
                html += '<p>Mantellinie $s = \\sqrt{h^2 + (R - r)^2} \\approx ' + tex(sLen, 2) + '$ cm, Mantel $M = \\pi s (R + r) \\approx ' + tex(M, 1) + '\\ \\text{cm}^2$</p>';
            } else {
                html = '<p>$V = \\dfrac{h}{3}\\,\\bigl(G_1 + \\sqrt{G_1 G_2} + G_2\\bigr) = \\dfrac{' + tex(h, 1) + '}{3}\\,(' + texs(G1, 2) + ' + ' + texs(Math.sqrt(G1 * G2), 2) + ' + ' + texs(G2, 2) + ') \\approx ' + tex(V, 1) + '\\ \\text{cm}^3$</p>';
            }
            if (tip != null) {
                const Vb = (k ? Math.PI * R * R : R * R) * tip / 3, Vs = (k ? Math.PI * r * r : r * r) * (tip - h) / 3;
                html += '<p>Als Differenz: ganze ' + (k ? 'Kegel' : 'Pyramide') + ' (Höhe $' + tex(tip, 2) + '$ cm) $\\approx ' + tex(Vb, 1) + '$ cm³ minus abgeschnittene Spitze $\\approx ' + tex(Vs, 1) + '$ cm³ $= ' + tex(Vb - Vs, 1) + '$ cm³</p>';
            } else {
                html += '<p>Oben und unten gleich groß: das ist ein ' + (k ? 'Zylinder' : 'Quader mit quadratischer Grundfläche') + ', $V = G \\cdot h$.</p>';
            }
            html += '<p>' + rho[1] + ' ($' + tex(rho[2], 2) + '$ g/cm³): Masse $\\approx ' + tex(V * rho[2], 0) + '$ g</p>';
            out.innerHTML = html;
            math(out);
        }
        names(); render();
        let wasNarrow = box.clientWidth < 480;
        window.addEventListener('resize', () => { const n = box.clientWidth < 480; if (n !== wasNarrow) { wasNarrow = n; render(); } });
    });

    /* ---------- a simple payslip ---------- */
    // assumed rates (employee share = employer share): pension, health, long-term care, unemployment. Simplified and fixed on
    // purpose - the legal rates change every year, the book says "angenommen" next to every number.
    const SV = [['Rentenversicherung', 9.3], ['Krankenversicherung', 8.1], ['Pflegeversicherung', 1.8], ['Arbeitslosen­versicherung', 1.3]];
    W('lohnos10', function (box) {
        const S = { brutto: 2400, st: 10 };
        const sl = div(box, '');
        range(sl, { label: 'Bruttolohn im Monat', min: 600, max: 5000, step: 50, value: S.brutto, fmt: v => de(v, 0) + ' €', onInput: v => { S.brutto = v; render(); } });
        range(sl, { label: 'Lohnsteuer (angenommen)', min: 0, max: 25, step: 0.5, value: S.st, fmt: v => de(v, 1) + ' %', onInput: v => { S.st = v; render(); } });
        const pic = div(box, 'b-svgbox');
        // the amounts as an HTML legend under the bar: SVG text would shrink to 7 px on a phone
        const leg = div(box, '');
        leg.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 18px;margin:10px 0 14px;font-size:0.95rem';
        const tab = div(box, 'b-table-wrap');
        const out = div(box, 'b-out');
        function render() {
            const b = S.brutto, sv = SV.map(([n, p]) => [n, p, b * p / 100]), svSum = sv.reduce((s, x) => s + x[2], 0);
            const st = b * S.st / 100, netto = b - svSum - st, ag = svSum, kosten = b + ag;
            const W0 = 580, x0 = 10, sc = W0 / kosten;
            const parts = [['Netto', netto, 'rgba(160,200,90,0.8)'], ['Lohnsteuer', st, 'rgba(226,102,90,0.8)'], ['Sozialabgaben', svSum, 'rgba(184,164,242,0.8)'], ['Arbeitgeberanteil', ag, 'rgba(127,216,238,0.6)']];
            let x = x0, g = '';
            parts.forEach(([n, v, c]) => { g += '<rect x="' + f1(x) + '" y="6" width="' + f1(Math.max(v * sc, 0)) + '" height="34" style="fill:' + c + ';stroke:none"/>'; x += v * sc; });
            g += line([x0 + b * sc, 0], [x0 + b * sc, 46], 'stroke:' + TXT + ';stroke-width:2.5;stroke-dasharray:4 3');
            pic.innerHTML = '<svg viewBox="0 0 600 46" role="img" aria-label="Bruttolohn aufgeteilt in Netto, Lohnsteuer und Sozialabgaben, rechts der gestrichelten Linie der Anteil des Arbeitgebers">' + g + '</svg>';
            leg.innerHTML = parts.map(([n, v, c]) => '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:14px;border-radius:3px;background:' + c + '"></span>' + n + '\u00a0' + de(v, 0) + '\u00a0€</span>').join('') +
                '<span style="color:' + DIM + '">gestrichelt: Ende des Bruttolohns ' + de(b, 0) + ' €</span>';
            tab.innerHTML = '<table class="b-table"><tr><th>Posten</th><th>Satz</th><th>Betrag</th></tr>' +
                sv.map(([n, p, v]) => '<tr><td>' + n + '</td><td>' + de(p, 1) + '\u00a0%</td><td>' + de(v, 2) + '\u00a0€</td></tr>').join('') +
                '<tr><td>Lohnsteuer</td><td>' + de(S.st, 1) + '\u00a0%</td><td>' + de(st, 2) + '\u00a0€</td></tr>' +
                '<tr><th>Nettolohn</th><td></td><th>' + de(netto, 2) + '\u00a0€</th></tr></table>';
            out.innerHTML = '<p>Alle Sätze sind angenommen und vereinfacht. Abzüge zusammen ' + de(svSum + st, 2) + ' €, das sind ' + de((svSum + st) / b * 100, 1) + ' % des Bruttolohns. ' +
                'Der Betrieb zahlt die Sozialabgaben noch einmal als Arbeitgeberanteil: Die Stelle kostet ihn ' + de(kosten, 2) + ' € im Monat.</p>';
        }
        render();
    });
})();
