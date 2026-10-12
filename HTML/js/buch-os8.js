/* buch-os8.js — widgets of the book Mathematik · Oberschule 8 (js/buch.js; SVG helpers B.geo from js/buch-geometrie.js,
 * which must be loaded first).
 *   titelbildos8     the cover: two lines crossing (a linear system), a cylinder in the oblique view, a central dilation, a tree diagram, a chainring
 *   kreisflaecheos8  the area of the circle: n sectors laid head to tail form almost a rectangle r × π·r (data-n, data-hero)
 *   zylinderos8      circular and hollow cylinder: oblique view or net, radius, inner radius and height as sliders; base, lateral surface,
 *                    surface, volume and mass (data-k="voll|hohl", data-view="schraeg|netz", data-hero)
 *   stromos8         the yearly electricity bill: consumption, unit price, standing charge and monthly instalment → back payment or credit
 *   fahrrados8       the bicycle: tyre size in inches, chainring and sprocket, cadence → gear ratio, distance per crank turn, speed (data-hero)
 *   termwertos8      substitute x into two terms, value table from −3 to 3: equal in every row or not (data-p = pair)
 *   linearos8        y = m · x + n with sliders: slope triangle, y-intercept, zero, value table (data-mode="prop": only y = m · x; data-m, data-n, data-hero)
 *   lgsgrafos8       a linear system solved graphically in three steps: solve for y, draw both lines, read off the intersection (or parallel / identical)
 *   tarifos8         two tariffs as lines, sliders for both: break-even point and which tariff is cheaper (data-set="handy|strom|auto")
 *   rosetteos8       a rosette with the compass: n petals, each made of two arcs with the radius r; construction lines, second ring (data-n, data-hero)
 *   zaehlenos8       counting: all orders of n people (listed up to n = 4, n!) or the counting principle (lock, menu, outfit) (data-mode="produkt")
 *   raumos8          renovating a room: floor plan and the four walls unrolled with doors and windows; floor with waste, paint, packs and tins rounded up (data-hero)
 *   reifenos8        tyre size: ETRTO marking width-rim, wheel diameter, inches, circumference, turns per km
 *   flaecheos8       a · (b + c) and a · (b − c) as the area of a rectangle: multiplying out and factoring, with numbers or with x (data-op, data-v, data-hero)
 * Looks: js/buch.css (section "Oberschule 8").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;
    const G = B.geo;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', TXT = '#e8edf5', DIM = '#8fa3bd';
    const DEG = Math.PI / 180;
    const range0 = n => Array.from({ length: n }, (_, i) => i);

    /* ---------- small helpers ---------- */
    const isHero = box => box.dataset.hero != null;
    const f1 = G.f1;
    const area = (c, a) => G.hexFill(c, a);
    const sty = (c, w, more) => 'fill:none;stroke:' + c + ';stroke-width:' + (w || 2) + ';stroke-linecap:round;stroke-linejoin:round;' + (more || '');
    const DASH = 'stroke-dasharray:6 5;';
    const ell = (cx, cy, rx, ry, st) => '<ellipse cx="' + f1(cx) + '" cy="' + f1(cy) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" style="' + st + '"/>';
    // half of an ellipse: the front (lower) half or the back (upper) half
    const halfEll = (cx, cy, rx, ry, front, st) => '<path d="M' + f1(cx - rx) + ' ' + f1(cy) + ' A' + f1(rx) + ' ' + f1(ry) + ' 0 0 ' + (front ? 0 : 1) + ' ' + f1(cx + rx) + ' ' + f1(cy) + '" style="' + st + '"/>';
    const cm = (v, d) => texNum(v, d == null ? 2 : d) + '\\,\\text{cm}';
    const euro = v => fmt(v, 2).replace(/,(\d)$/, ',$10') + ' €';
    const euroT = v => texNum(v, 2).replace(/\{,\}(\d)$/, '{,}$10') + '\\,\\text{€}';

    /* ---------- the cover ---------- */
    W('titelbildos8', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dashed) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dashed ? ' stroke-dasharray="' + dashed + '"' : '') + '/>';
        const P = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
        const spot = p => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        let art = '';
        // two lines crossing in the upper part: a linear system with its solution
        const L1 = [[40, 470], [560, 330]], L2 = [[60, 330], [560, 500]];
        art += glow(P(L1), '#7fd8ee', 2.6) + glow(P(L2), '#F5C242', 2.6);
        const den = (L1[1][0] - L1[0][0]) * (L2[1][1] - L2[0][1]) - (L1[1][1] - L1[0][1]) * (L2[1][0] - L2[0][0]);
        const t = ((L2[0][0] - L1[0][0]) * (L2[1][1] - L2[0][1]) - (L2[0][1] - L1[0][1]) * (L2[1][0] - L2[0][0])) / den;
        const X = [L1[0][0] + t * (L1[1][0] - L1[0][0]), L1[0][1] + t * (L1[1][1] - L1[0][1])];
        // a cylinder in the oblique view
        const cx = 150, yb = 735, r = 82, ry = 28, h = 190;
        art += '<path d="M' + (cx - r) + ' ' + yb + ' L' + (cx - r) + ' ' + (yb - h) + ' A' + r + ' ' + ry + ' 0 0 1 ' + (cx + r) + ' ' + (yb - h) + ' L' + (cx + r) + ' ' + yb + ' A' + r + ' ' + ry + ' 0 0 1 ' + (cx - r) + ' ' + yb + ' Z" fill="#B8A4F2" fill-opacity="0.08"/>';
        art += glow('M' + (cx - r) + ' ' + yb + ' A' + r + ' ' + ry + ' 0 0 1 ' + (cx + r) + ' ' + yb, '#B8A4F2', 1.6, '8 8');
        art += glow('M' + (cx - r) + ' ' + yb + ' A' + r + ' ' + ry + ' 0 0 0 ' + (cx + r) + ' ' + yb, '#B8A4F2', 3);
        art += glow(P([[cx - r, yb], [cx - r, yb - h]]), '#B8A4F2', 3) + glow(P([[cx + r, yb], [cx + r, yb - h]]), '#B8A4F2', 3);
        art += glow('M' + (cx - r) + ' ' + (yb - h) + ' a' + r + ' ' + ry + ' 0 1 0 ' + 2 * r + ' 0 a' + r + ' ' + ry + ' 0 1 0 ' + -2 * r + ' 0', '#B8A4F2', 3);
        art += glow(P([[cx, yb - h], [cx + r, yb - h]]), '#ffffff', 1.8);
        // a central dilation: centre Z, a small and a big triangle, rays through the corners
        const Z = [330, 790], T = [[370, 700], [430, 730], [395, 655]], k = 2.1;
        const I = T.map(p => [Z[0] + k * (p[0] - Z[0]), Z[1] + k * (p[1] - Z[1])]);
        I.forEach(p => { art += glow(P([Z, p]), '#ffffff', 1.4, '6 8'); });
        art += '<path d="' + P(T) + ' Z" fill="#7fd8ee" fill-opacity="0.12"/>' + glow(P(T) + ' Z', '#7fd8ee', 2.4);
        art += '<path d="' + P(I) + ' Z" fill="#F5C242" fill-opacity="0.08"/>' + glow(P(I) + ' Z', '#F5C242', 2.8);
        // a tree diagram in the upper right
        const R0 = [420, 360], ends1 = [[480, 320], [480, 400]];
        ends1.forEach(e => {
            art += glow(P([R0, e]), '#A0C85A', 2.2);
            [[540, e[1] - 22], [540, e[1] + 22]].forEach(f => { art += glow(P([e, f]), '#A0C85A', 1.8); art += spot(f).replace(/r="6"/, 'r="4"'); });
        });
        // a chainring with teeth
        const Kc = [96, 380], Kr = 44;
        let teeth = '';
        for (let i = 0; i < 24; i++) {
            const a = i * 15 * DEG;
            teeth += P([[Kc[0] + Kr * Math.cos(a), Kc[1] + Kr * Math.sin(a)], [Kc[0] + (Kr + 9) * Math.cos(a), Kc[1] + (Kr + 9) * Math.sin(a)]]) + ' ';
        }
        art += glow('M' + (Kc[0] - Kr) + ' ' + Kc[1] + ' a' + Kr + ' ' + Kr + ' 0 1 0 ' + 2 * Kr + ' 0 a' + Kr + ' ' + Kr + ' 0 1 0 ' + -2 * Kr + ' 0', '#F5C242', 2.4);
        art += '<path d="' + teeth + '" stroke="#F5C242" stroke-width="2" stroke-opacity="0.8" fill="none"/>';
        [X, Z, R0, Kc, [cx, yb - h]].forEach(p => { art += spot(p); });
        const id = 'to8' + Math.random().toString(36).slice(2, 7);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.36" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- the area of the circle ---------- */
    W('kreisflaecheos8', function (box) {
        const hero = isHero(box);
        const S = { n: +(box.dataset.n || (hero ? 16 : 8)) };
        if (!hero) {
            const sl = div(box, '');
            range(sl, { label: 'Anzahl der Stücke $n$', min: 4, max: 48, step: 2, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        const R = 92;
        let C, x0, yb, narrow = false;
        function sector(ax, ay, w, h, up, st) {
            const s = up ? [ax - w / 2, ay - h] : [ax - w / 2, ay + h], e = up ? [ax + w / 2, ay - h] : [ax + w / 2, ay + h];
            return '<path d="M' + f1(ax) + ' ' + f1(ay) + ' L' + f1(s[0]) + ' ' + f1(s[1]) + ' A' + R + ' ' + R + ' 0 0 ' + (up ? 1 : 0) + ' ' + f1(e[0]) + ' ' + f1(e[1]) + ' Z" style="' + st + '"/>';
        }
        // side by side on wide boxes; on a phone the circle sits above the strip, so the labels stay readable
        if (window.ResizeObserver) new ResizeObserver(() => { const nw = pic.clientWidth > 0 && pic.clientWidth < 480; if (nw !== narrow) { narrow = nw; render(); } }).observe(pic);
        function render() {
            const n = S.n, a = 2 * Math.PI / n, w = 2 * R * Math.sin(a / 2), h = R * Math.cos(a / 2);
            const L = (n / 2) * w + w / 2;
            let vbW, vbH;
            if (narrow) {
                vbW = Math.max(360, L + 70); C = [vbW / 2, R + 14]; x0 = (vbW - L) / 2 + 10; yb = 2 * R + 44 + h; vbH = yb + 52;
            } else {
                C = [118, 150]; x0 = 250; yb = 238; vbW = Math.max(640, x0 + L + 20); vbH = 290;
            }
            const cA = area(LAM, 0.28), cB = area(CY, 0.28);
            let s = '';
            // the circle cut into n sectors
            for (let i = 0; i < n; i++) {
                const p = [C[0] + R * Math.cos(i * a - Math.PI / 2), C[1] + R * Math.sin(i * a - Math.PI / 2)];
                const q = [C[0] + R * Math.cos((i + 1) * a - Math.PI / 2), C[1] + R * Math.sin((i + 1) * a - Math.PI / 2)];
                s += '<path d="M' + f1(C[0]) + ' ' + f1(C[1]) + ' L' + f1(p[0]) + ' ' + f1(p[1]) + ' A' + R + ' ' + R + ' 0 0 1 ' + f1(q[0]) + ' ' + f1(q[1]) + ' Z" style="' + (i % 2 ? cB : cA) + '"/>';
            }
            s += G.line(C, [C[0] + R, C[1]], sty(TXT, 2)) + G.txt([C[0] + R / 2, C[1] - 8], 'r', 'g-lab');
            // the same sectors laid head to tail
            for (let j = 0; j < n / 2; j++) {
                s += sector(x0 + w / 2 + j * w, yb, w, h, true, cA);
                s += sector(x0 + w + j * w, yb - h, w, h, false, cB);
            }
            // braces: height r, length π·r
            s += G.line([x0 - 12, yb], [x0 - 12, yb - h], sty(TXT, 1.6)) + G.txt([x0 - 22, yb - h / 2 + 5], 'r', 'g-lab', 'end');
            s += G.line([x0 + w / 2, yb + 16], [x0 + w / 2 + (n / 2) * w, yb + 16], sty(LAM, 1.8)) + G.txt([x0 + w / 2 + (n / 4) * w, yb + 40], 'u : 2 = π · r', 'g-lab');
            pic.innerHTML = '<svg viewBox="0 0 ' + f1(vbW) + ' ' + f1(vbH) + '" role="img" aria-label="Ein Kreis in ' + n + ' Stücke geschnitten und die Stücke abwechselnd nebeneinandergelegt">' + s + '</svg>';
            if (!out) return;
            out.innerHTML = '<p style="margin:0">Die ' + n + ' Stücke bilden fast ein Rechteck. Seine Höhe ist fast der Radius $r$ (hier $' + texNum(Math.cos(a / 2) * 100, 1) + '\\,\\%$ von $r$), ' +
                'seine Länge ist der halbe Umfang $\\dfrac{u}{2} = \\pi \\cdot r$. Je mehr Stücke, desto genauer stimmt es:</p>' +
                '<p style="margin:8px 0 0">$A = r \\cdot \\pi \\cdot r = \\pi \\cdot r^2$</p>';
            math(out);
        }
        render();
    });

    /* ---------- circular and hollow cylinder ---------- */
    const RHO = { holz: ['Holz', 0.7], alu: ['Aluminium', 2.7], stahl: ['Stahl', 7.8] };
    W('zylinderos8', function (box) {
        const hero = isHero(box);
        const S = { k: box.dataset.k === 'hohl' ? 'hohl' : 'voll', view: box.dataset.view === 'netz' ? 'netz' : 'schraeg', r: 3, ri: 2, h: 8, m: 'stahl' };
        let rRi = null;
        if (!hero) {
            const c = div(box, 'b-ctrls');
            let kk = null, vw = null;
            kk = seg(c, [['voll', 'Kreiszylinder'], ['hohl', 'Hohlzylinder']], S.k, v => { S.k = v; if (v === 'hohl' && S.view === 'netz') { S.view = 'schraeg'; vw.set('schraeg'); } sync(); render(); }, 'Körper');
            vw = seg(c, [['schraeg', 'Schrägbild'], ['netz', 'Netz']], S.view, v => { S.view = v; if (v === 'netz' && S.k === 'hohl') { S.k = 'voll'; kk.set('voll'); sync(); } render(); }, 'Darstellung');
            seg(c, Object.keys(RHO).map(k => [k, RHO[k][0]]), S.m, v => { S.m = v; render(); }, 'Material');
            const sl = div(box, '');
            range(sl, { label: 'Radius $r$', min: 1, max: 6, step: 0.5, value: S.r, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.r = v; sync(); render(); } });
            rRi = range(sl, { label: 'Innenradius $r_i$', min: 0.5, max: 5.5, step: 0.5, value: S.ri, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.ri = v; sync(); render(); } });
            range(sl, { label: 'Höhe $h$', min: 1, max: 12, step: 0.5, value: S.h, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.h = v; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        function sync() {
            if (!rRi) return;
            rRi.input.max = S.r - 0.5;
            if (S.ri > S.r - 0.5) { S.ri = S.r - 0.5; rRi.set(S.ri); }
            rRi.input.closest('.b-range').style.display = S.k === 'hohl' ? '' : 'none';
        }
        // on a phone the drawing gets a narrower view box, so lines and labels keep a readable size
        let narrow = false;
        const VW = () => narrow ? 400 : 640;
        if (window.ResizeObserver) new ResizeObserver(() => { const nw = pic.clientWidth > 0 && pic.clientWidth < 480; if (nw !== narrow) { narrow = nw; render(); } }).observe(pic);
        function drawSchraeg(r, ri, h, hohl) {
            const sc = Math.min(30, (VW() / 2 - 50) / r, 300 / (h + 0.8 * r)), R = r * sc, RY = R * 0.35, H = h * sc, Ri = ri * sc, RYi = Ri * 0.35;
            const cx = VW() / 2 - 20, yb = 345 - RY - 8, yt = yb - H;
            let s = '<path d="M' + f1(cx - R) + ' ' + f1(yb) + ' L' + f1(cx - R) + ' ' + f1(yt) + ' A' + f1(R) + ' ' + f1(RY) + ' 0 0 1 ' + f1(cx + R) + ' ' + f1(yt) +
                ' L' + f1(cx + R) + ' ' + f1(yb) + ' A' + f1(R) + ' ' + f1(RY) + ' 0 0 1 ' + f1(cx - R) + ' ' + f1(yb) + ' Z" style="' + area(VIO, 0.12) + ';stroke:none"/>';
            s += halfEll(cx, yb, R, RY, false, sty(VIO, 1.6, DASH)) + halfEll(cx, yb, R, RY, true, sty(VIO, 2.4));
            s += G.line([cx - R, yb], [cx - R, yt], sty(VIO, 2.4)) + G.line([cx + R, yb], [cx + R, yt], sty(VIO, 2.4));
            s += ell(cx, yt, R, RY, sty(VIO, 2.4) + 'fill:rgba(184,164,242,0.16)');
            if (hohl) {
                s += ell(cx, yt, Ri, RYi, sty(VIO, 2) + 'fill:rgba(10,20,38,0.55)');
                s += halfEll(cx, yb, Ri, RYi, false, sty(DIM, 1.2, DASH)) + halfEll(cx, yb, Ri, RYi, true, sty(DIM, 1.2, DASH));
                s += G.line([cx, yt], [cx - Ri, yt], sty(CY, 2)) + G.txt([cx - Ri / 2, yt - 6], 'rᵢ', 'g-lab');
            }
            s += G.line([cx, yt], [cx + R, yt], sty(LAM, 2.2)) + G.txt([cx + R / 2, yt - 6], 'r', 'g-lab');
            s += G.line([cx + R + 18, yb], [cx + R + 18, yt], sty(PHI, 1.8)) + G.txt([cx + R + 30, (yb + yt) / 2 + 5], 'h', 'g-lab', 'start');
            s += G.dot([cx, yt], TXT, 3.5);
            return s;
        }
        function drawNetz(r, h) {
            const cx = VW() / 2, sc = Math.min(30, (VW() - 60) / (2 * Math.PI * r), 330 / (h + 4 * r)), R = r * sc, H = h * sc, Wm = 2 * Math.PI * R;
            const x0 = cx - Wm / 2, y0 = 175 - H / 2;
            let s = '<rect x="' + f1(x0) + '" y="' + f1(y0) + '" width="' + f1(Wm) + '" height="' + f1(H) + '" style="' + area(VIO, 0.16) + '"/>';
            s += '<circle cx="' + f1(cx) + '" cy="' + f1(y0 - R) + '" r="' + f1(R) + '" style="' + area(LAM, 0.2) + '"/>';
            s += '<circle cx="' + f1(cx) + '" cy="' + f1(y0 + H + R) + '" r="' + f1(R) + '" style="' + area(LAM, 0.2) + '"/>';
            s += G.txt([cx, y0 + H / 2 + 6], 'Mantel', 'g-lab');
            s += G.line([x0 + 8, y0 + H - 12], [x0 + Wm - 8, y0 + H - 12], sty(CY, 1.6)) + G.txt([x0 + Wm * 0.8, y0 + H - 20], 'u = 2πr', 'g-lab');
            s += G.line([x0 - 12, y0], [x0 - 12, y0 + H], sty(PHI, 1.6)) + G.txt([x0 - 20, y0 + H / 2 + 5], 'h', 'g-lab', 'end');
            return s;
        }
        function render() {
            const { r, h } = S, hohl = S.k === 'hohl', ri = hohl ? S.ri : 0;
            const s = S.view === 'netz' && !hohl ? drawNetz(r, h) : drawSchraeg(r, ri, h, hohl);
            pic.innerHTML = '<svg viewBox="0 0 ' + VW() + ' 350" role="img" aria-label="' + (hohl ? 'Hohlzylinder' : 'Kreiszylinder') + ' mit dem Radius ' + fmt(r, 1) + ' cm und der Höhe ' + fmt(h, 1) + ' cm">' + s + '</svg>';
            if (!out) return;
            const Gf = Math.PI * (r * r - ri * ri), Ma = 2 * Math.PI * r * h, Mi = 2 * Math.PI * ri * h, O = 2 * Gf + Ma + Mi, V = Gf * h, rho = RHO[S.m][1], m = rho * V;
            const mass = m >= 1000 ? texNum(m / 1000, 2) + '\\,\\text{kg}' : texNum(m, 0) + '\\,\\text{g}';
            const rows = hohl ? [
                ['Grundfläche (Kreisring)', 'A_G = \\pi \\cdot (r^2 - r_i^2)', texNum(Gf, 2) + '\\,\\text{cm}^2'],
                ['Außenmantel', 'A_{M} = 2\\pi \\cdot r \\cdot h', texNum(Ma, 2) + '\\,\\text{cm}^2'],
                ['Innenmantel', 'A_{Mi} = 2\\pi \\cdot r_i \\cdot h', texNum(Mi, 2) + '\\,\\text{cm}^2'],
                ['Oberfläche', 'O = 2 A_G + A_M + A_{Mi}', texNum(O, 2) + '\\,\\text{cm}^2'],
                ['Volumen', 'V = A_G \\cdot h', texNum(V, 2) + '\\,\\text{cm}^3']
            ] : [
                ['Grundfläche', 'A_G = \\pi \\cdot r^2', texNum(Gf, 2) + '\\,\\text{cm}^2'],
                ['Mantel', 'A_M = 2\\pi \\cdot r \\cdot h', texNum(Ma, 2) + '\\,\\text{cm}^2'],
                ['Oberfläche', 'O = 2 A_G + A_M', texNum(O, 2) + '\\,\\text{cm}^2'],
                ['Volumen', 'V = \\pi \\cdot r^2 \\cdot h', texNum(V, 2) + '\\,\\text{cm}^3']
            ];
            rows.push(['Masse (' + RHO[S.m][0] + ', $' + texNum(rho, 1) + '\\,\\tfrac{\\text{g}}{\\text{cm}^3}$)', 'm = \\varrho \\cdot V', mass]);
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th>Größe</th><th>Formel und Wert</th></tr>' +
                rows.map(q => '<tr><td>' + q[0] + '</td><td>$' + q[1] + '$ $\\approx ' + q[2] + '$</td></tr>').join('') + '</table></div>' +
                '<p class="b-help" style="margin:8px 0 0">' + (S.view === 'netz' ? 'Der Mantel ist ein Rechteck: so breit wie der Umfang des Grundkreises, so hoch wie der Zylinder.'
                    : 'Im Schrägbild wird der Grundkreis zur flachen Ellipse. Verdeckte Linien sind gestrichelt.') + '</p>';
            math(out);
        }
        sync();
        render();
    });

    /* ---------- the yearly electricity bill ---------- */
    W('stromos8', function (box) {
        const S = { kwh: 2500, ap: 32, gp: 12.5, ab: 70 };
        const sl = div(box, '');
        range(sl, { label: 'Verbrauch im Jahr', min: 1000, max: 6000, step: 100, value: S.kwh, fmt: v => fmt(v, 0) + ' kWh', onInput: v => { S.kwh = v; render(); } });
        range(sl, { label: 'Arbeitspreis in ct/kWh', min: 20, max: 45, step: 0.5, value: S.ap, fmt: v => fmt(v, 1), onInput: v => { S.ap = v; render(); } });
        range(sl, { label: 'Grundpreis im Monat', min: 5, max: 20, step: 0.5, value: S.gp, fmt: v => euro(v), onInput: v => { S.gp = v; render(); } });
        range(sl, { label: 'Abschlag im Monat', min: 30, max: 200, step: 1, value: S.ab, fmt: v => fmt(v, 0) + ' €', onInput: v => { S.ab = v; render(); } });
        const pic = div(box, 'b-svgbox g-svg');
        const out = div(box, 'b-out');
        // a narrower view box on a phone keeps the bar labels readable
        let narrow = false;
        if (window.ResizeObserver) new ResizeObserver(() => { const nw = pic.clientWidth > 0 && pic.clientWidth < 480; if (nw !== narrow) { narrow = nw; render(); } }).observe(pic);
        function render() {
            const arbeit = S.kwh * S.ap / 100, grund = 12 * S.gp, summe = arbeit + grund, paid = 12 * S.ab, diff = summe - paid, neu = Math.ceil(summe / 12);
            const Wv = narrow ? 400 : 640, x0 = 90, mx = Math.max(summe, paid, 1), sc = (Wv - x0 - 30) / mx;
            let s = '';
            s += '<rect x="' + x0 + '" y="30" width="' + f1(arbeit * sc) + '" height="44" style="' + area(LAM, 0.35) + '"/>';
            s += '<rect x="' + f1(x0 + arbeit * sc) + '" y="30" width="' + f1(grund * sc) + '" height="44" style="' + area(VIO, 0.35) + '"/>';
            s += '<rect x="' + x0 + '" y="100" width="' + f1(paid * sc) + '" height="44" style="' + area(CY, 0.35) + '"/>';
            s += G.txt([x0 - 10, 59], 'Kosten', 'g-lab', 'end') + G.txt([x0 - 10, 129], 'gezahlt', 'g-lab', 'end');
            s += G.line([x0 + summe * sc, 20], [x0 + summe * sc, 156], sty(diff > 0 ? RED : PHI, 1.6, DASH));
            pic.innerHTML = '<svg viewBox="0 0 ' + Wv + ' 166" role="img" aria-label="Balken: Jahreskosten aus Arbeitspreis und Grundpreis gegen die gezahlten Abschläge">' + s + '</svg>';
            const res = Math.abs(diff) < 0.005 ? 'Kosten und Abschläge sind genau gleich.' :
                diff > 0 ? '<b>Nachzahlung</b>: $' + euroT(diff) + '$. Die Abschläge waren zu niedrig.' : '<b>Guthaben</b>: $' + euroT(-diff) + '$ werden zurückgezahlt.';
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab">' +
                '<tr><td>Arbeitspreis</td><td>$' + texNum(S.kwh, 0) + ' \\cdot ' + texNum(S.ap / 100, 3) + '\\,\\text{€}$ $= ' + euroT(arbeit) + '$</td></tr>' +
                '<tr><td>Grundpreis</td><td>$12 \\cdot ' + euroT(S.gp) + '$ $= ' + euroT(grund) + '$</td></tr>' +
                '<tr><td><b>Jahreskosten</b></td><td>$' + euroT(summe) + '$</td></tr>' +
                '<tr><td>Abschläge</td><td>$12 \\cdot ' + euroT(S.ab) + '$ $= ' + euroT(paid) + '$</td></tr></table></div>' +
                '<p style="margin:8px 0 0">' + res + ' Ein passender neuer Abschlag wäre etwa $' + texNum(neu, 0) + '\\,\\text{€}$ im Monat.</p>';
            math(out);
        }
        render();
    });

    /* ---------- the bicycle: gear ratio and speed ---------- */
    const TYRES = { 20: 50.8, 24: 60.96, 26: 66.04, 28: 71.12 };
    W('fahrrados8', function (box) {
        const hero = isHero(box);
        const S = { z: 28, kb: 44, rz: 16, f: 70 };
        if (!hero) {
            const c = div(box, 'b-ctrls');
            seg(c, Object.keys(TYRES).map(k => [k, k + ' Zoll']), String(S.z), v => { S.z = +v; render(); }, 'Reifengröße');
            const sl = div(box, '');
            range(sl, { label: 'Kettenblatt vorn (Zähne)', min: 24, max: 52, step: 1, value: S.kb, fmt: v => String(v), onInput: v => { S.kb = v; render(); } });
            range(sl, { label: 'Ritzel hinten (Zähne)', min: 11, max: 34, step: 1, value: S.rz, fmt: v => String(v), onInput: v => { S.rz = v; render(); } });
            range(sl, { label: 'Trittfrequenz (pro Minute)', min: 40, max: 110, step: 5, value: S.f, fmt: v => String(v), onInput: v => { S.f = v; render(); } });
        }
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        function gear(c, n, rad, col) {
            let s = '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(rad) + '" style="' + area(col, 0.12) + '"/>';
            let d = '';
            for (let i = 0; i < n; i++) {
                const a = i * 2 * Math.PI / n;
                d += 'M' + f1(c[0] + rad * Math.cos(a)) + ' ' + f1(c[1] + rad * Math.sin(a)) + ' L' + f1(c[0] + (rad + 6) * Math.cos(a)) + ' ' + f1(c[1] + (rad + 6) * Math.sin(a)) + ' ';
            }
            return s + '<path d="' + d + '" style="' + sty(col, 2.2) + '"/>' + G.dot(c, col, 4);
        }
        function render() {
            const K = [175, 190], Rk = S.kb * 2.1, Hb = [485, 190], Rr = S.rz * 2.1, Rw = 150;
            let s = '<circle cx="' + Hb[0] + '" cy="' + Hb[1] + '" r="' + Rw + '" style="' + sty(DIM, 2.4) + '"/>';
            for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; s += G.line(Hb, [Hb[0] + Rw * Math.cos(a), Hb[1] + Rw * Math.sin(a)], sty(DIM, 0.8) + 'opacity:0.6'); }
            // the chain: upper and lower outer tangents of the two circles
            const dx = Hb[0] - K[0], ang = Math.asin((Rk - Rr) / dx);
            // unit normals of the upper and the lower tangent, pointing from each centre to its touching point
            const nU = [Math.sin(ang), -Math.cos(ang)], nD = [Math.sin(ang), Math.cos(ang)];
            s += G.line([K[0] + Rk * nU[0], K[1] + Rk * nU[1]], [Hb[0] + Rr * nU[0], Hb[1] + Rr * nU[1]], sty(TXT, 2.4));
            s += G.line([K[0] + Rk * nD[0], K[1] + Rk * nD[1]], [Hb[0] + Rr * nD[0], Hb[1] + Rr * nD[1]], sty(TXT, 2.4));
            s += gear(K, S.kb, Rk, LAM) + gear(Hb, S.rz, Rr, CY);
            s += G.line(K, [K[0] - 20, K[1] + 70], sty(LAM, 5)) + G.txt([K[0], K[1] + Rk + 36], 'Kettenblatt ' + S.kb, 'g-lab') + G.txt([Hb[0], Hb[1] - Rr - 18], 'Ritzel ' + S.rz, 'g-lab');
            pic.innerHTML = '<svg viewBox="0 0 640 360" role="img" aria-label="Kettenantrieb: Kettenblatt mit ' + S.kb + ' Zähnen, Ritzel mit ' + S.rz + ' Zähnen und das Hinterrad">' + s + '</svg>';
            if (!out) return;
            const i = S.kb / S.rz, d = TYRES[S.z], u = Math.PI * d / 100, e = i * u, v = S.f * e * 60 / 1000, perKm = 1000 / e;
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab">' +
                '<tr><td>Übersetzung</td><td>$i = \\dfrac{' + S.kb + '}{' + S.rz + '} \\approx ' + texNum(i, 2) + '$</td></tr>' +
                '<tr><td>Radumfang</td><td>$u = \\pi \\cdot ' + texNum(d, 2) + '\\,\\text{cm} \\approx ' + texNum(u, 2) + '\\,\\text{m}$</td></tr>' +
                '<tr><td>Weg pro Kurbelumdrehung</td><td>$i \\cdot u \\approx ' + texNum(e, 2) + '\\,\\text{m}$</td></tr>' +
                '<tr><td>Geschwindigkeit</td><td>$' + S.f + ' \\cdot ' + texNum(e, 2) + '\\,\\text{m} \\approx ' + texNum(S.f * e, 0) + '\\,\\tfrac{\\text{m}}{\\text{min}}$ $\\approx ' + texNum(v, 1) + '\\,\\tfrac{\\text{km}}{\\text{h}}$</td></tr>' +
                '<tr><td>Kurbelumdrehungen pro km</td><td>$\\approx ' + texNum(perKm, 0) + '$</td></tr></table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Vereinfacht ist hier der Raddurchmesser die Zollangabe mal $2{,}54\\,\\text{cm}$. Großes Kettenblatt und kleines Ritzel: schnell, aber schwer zu treten.</p>';
            math(out);
        }
        render();
    });

    /* ---------- term values: substitute, table, equal terms ---------- */
    // a term as a template: @ = x, * = a multiplication dot that is hidden in the term (3*@ → 3x) and shown after substituting (3 · (−2))
    const TPAIRS = [
        ['3*(@ + 2)', x => 3 * (x + 2), '3*@ + 6', x => 3 * x + 6],
        ['3*(@ + 2)', x => 3 * (x + 2), '3*@ + 2', x => 3 * x + 2],
        ['2*@ + 5*@', x => 7 * x, '7*@', x => 7 * x],
        ['@ \\cdot @', x => x * x, '2*@', x => 2 * x],
        ['5 - (@ - 3)', x => 8 - x, '8 - @', x => 8 - x],
        ['4*@ - 2*(@ - 1)', x => 2 * x + 2, '2*@ + 2', x => 2 * x + 2],
        ['2*(@ + 1)', x => 2 * x + 2, '2*@ + 1', x => 2 * x + 1]
    ];
    const tSym = t => t.replace(/\*/g, '').replace(/@/g, 'x');
    // a negative number gets its own brackets, except right behind an opening bracket: 3 · (−2 + 2)
    const tSub = (t, v) => t.replace(/\*/g, ' \\cdot ').replace(/\(@/g, '(' + texNum(v, 2)).replace(/@/g, v < 0 ? '(' + texNum(v, 2) + ')' : texNum(v, 2));
    W('termwertos8', function (box) {
        const S = { p: +(box.dataset.p || 0), x: -2 };
        const c = div(box, 'b-ctrls');
        seg(c, TPAIRS.map((q, i) => [String(i), '$' + tSym(q[0]) + '$ | $' + tSym(q[2]) + '$']), String(S.p), v => { S.p = +v; render(); }, 'Termpaar');
        math(c);
        const sl = div(box, '');
        range(sl, { label: 'Einsetzen: $x$', min: -5, max: 5, step: 0.5, value: S.x, fmt: v => fmt(v, 1), onInput: v => { S.x = v; render(); } });
        math(sl);
        const out = div(box, 'b-out');
        function render() {
            const [ta, fa, tb, fb] = TPAIRS[S.p], x = S.x;
            let rows = '', same = 0, first = null;
            for (let v = -3; v <= 3; v++) {
                const a = fa(v), b = fb(v), eq = Math.abs(a - b) < 1e-9;
                if (eq) same++; else if (first == null) first = v;
                rows += '<tr><td>$' + v + '$</td><td>$' + texNum(a, 2) + '$</td><td>$' + texNum(b, 2) + '$</td><td class="' + (eq ? 'g-ok' : 'g-warn') + '">' + (eq ? '=' : '≠') + '</td></tr>';
            }
            const verdict = same === 7
                ? 'In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.'
                : 'Für $x = ' + first + '$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig</b>.' + (same ? ' Dass sie in ' + same + (same === 1 ? ' Zeile' : ' Zeilen') + ' übereinstimmen, reicht nicht.' : '');
            out.innerHTML =
                '<p style="margin:0">Für $x = ' + texNum(x, 2) + '$ ist $' + tSym(ta) + ' = ' + tSub(ta, x) + ' = ' + texNum(fa(x), 2) + '$</p>' +
                '<p style="margin:4px 0 0">und $' + tSym(tb) + ' = ' + tSub(tb, x) + ' = ' + texNum(fb(x), 2) + '$.</p>' +
                '<div class="b-table-wrap" style="margin-top:10px"><table class="b-table g-tab"><tr><th>$x$</th><th>$' + tSym(ta) + '$</th><th>$' + tSym(tb) + '$</th><th></th></tr>' + rows + '</table></div>' +
                '<p class="b-help" style="margin:8px 0 0">' + verdict + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- a · (b + c) as the area of a rectangle ---------- */
    W('flaecheos8', function (box) {
        const hero = isHero(box);
        const S = { op: box.dataset.op === 'minus' ? 'minus' : 'plus', v: hero || box.dataset.v === 'x', a: 3, b: 5, c: 2 };
        let rc = null;
        if (!hero) {
            const c = div(box, 'b-ctrls');
            seg(c, [['plus', '$a \\cdot (b + c)$'], ['minus', '$a \\cdot (b - c)$']], S.op, v => { S.op = v; sync(); render(); }, 'Term');
            seg(c, [['zahl', 'mit Zahlen'], ['var', 'mit x']], S.v ? 'var' : 'zahl', v => { S.v = v === 'var'; render(); }, 'Darstellung');
            math(c);
            const sl = div(box, '');
            range(sl, { label: 'Faktor $a$', min: 1, max: 6, step: 1, value: S.a, fmt: v => String(v), onInput: v => { S.a = v; render(); } });
            range(sl, { label: 'Länge $b$', min: 2, max: 9, step: 1, value: S.b, fmt: v => String(v), onInput: v => { S.b = v; sync(); render(); } });
            rc = range(sl, { label: 'Länge $c$', min: 1, max: 6, step: 1, value: S.c, fmt: v => String(v), onInput: v => { S.c = v; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        function sync() {
            if (!rc) return;
            const mx = S.op === 'minus' ? S.b - 1 : 6;
            rc.input.max = mx;
            if (S.c > mx) { S.c = mx; rc.set(mx); }
        }
        function render() {
            const { a, b, c } = S, minus = S.op === 'minus', bl = S.v ? 'x' : String(b);
            const tot = minus ? b : b + c, sc = Math.min(48, 380 / tot, 170 / a);
            const x0 = 60, y0 = 46, H = a * sc, Wb = b * sc, Wc = c * sc;
            // the products written into the parts: 3 · 5 = 15 with numbers, 3x with x
            const prod = (w, label) => w > 70 ? label : '';
            const ab = S.v ? (a === 1 ? 'x' : a + 'x') : a + ' · ' + b + ' = ' + a * b, ac = a + ' · ' + c + ' = ' + a * c;
            let s = '';
            if (!minus) {
                s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + f1(Wb) + '" height="' + f1(H) + '" style="' + area(LAM, 0.28) + '"/>';
                s += '<rect x="' + f1(x0 + Wb) + '" y="' + y0 + '" width="' + f1(Wc) + '" height="' + f1(H) + '" style="' + area(CY, 0.28) + '"/>';
                s += G.txt([x0 + Wb / 2, y0 + H / 2 + 6], prod(Wb, ab), 'g-val') + G.txt([x0 + Wb + Wc / 2, y0 + H / 2 + 6], prod(Wc, ac), 'g-val');
                s += G.txt([x0 + Wb / 2, y0 - 12], bl, 'g-side') + G.txt([x0 + Wb + Wc / 2, y0 - 12], String(c), 'g-side');
                s += G.line([x0, y0 + H + 16], [x0 + Wb + Wc, y0 + H + 16], sty(TXT, 1.4)) + G.txt([x0 + (Wb + Wc) / 2, y0 + H + 38], bl + ' + ' + c, 'g-side');
            } else {
                const Wk = Wb - Wc;
                s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + f1(Wk) + '" height="' + f1(H) + '" style="' + area(LAM, 0.28) + '"/>';
                s += '<rect x="' + f1(x0 + Wk) + '" y="' + y0 + '" width="' + f1(Wc) + '" height="' + f1(H) + '" style="fill:rgba(226,102,90,0.10);stroke:' + RED + ';stroke-width:1.8;stroke-dasharray:6 5"/>';
                // hatching of the strip that is taken away, clipped to the strip
                const cid = 'fo8c' + Math.random().toString(36).slice(2, 7);
                s += '<clipPath id="' + cid + '"><rect x="' + f1(x0 + Wk) + '" y="' + y0 + '" width="' + f1(Wc) + '" height="' + f1(H) + '"/></clipPath><g clip-path="url(#' + cid + ')">';
                for (let k = 0; k < Wc + H; k += 14) s += G.line([x0 + Wk + k, y0], [x0 + Wk + k - H, y0 + H], sty(RED, 1) + 'opacity:0.45');
                s += '</g>';
                s += G.txt([x0 + Wk / 2, y0 + H / 2 + 6], prod(Wk, a + ' · (' + bl + ' − ' + c + ')'), 'g-val') + G.txt([x0 + Wk + Wc / 2, y0 + H / 2 + 6], prod(Wc, ac), 'g-val');
                s += G.line([x0, y0 - 18], [x0 + Wb, y0 - 18], sty(TXT, 1.4)) + G.txt([x0 + Wb / 2, y0 - 26], bl, 'g-side');
                s += G.txt([x0 + Wk + Wc / 2, y0 + H + 26], String(c), 'g-side');
            }
            s += G.line([x0 - 16, y0], [x0 - 16, y0 + H], sty(TXT, 1.4)) + G.txt([x0 - 26, y0 + H / 2 + 6], String(a), 'g-side', 'end');
            pic.innerHTML = '<svg viewBox="0 0 480 ' + f1(Math.max(150, y0 + H + 50)) + '" role="img" aria-label="Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal ' + (minus ? '(b minus c)' : '(b plus c)') + '">' + s + '</svg>';
            if (!out) return;
            const sign = minus ? ' - ' : ' + ', val = minus ? a * (b - c) : a * (b + c);
            let tex;
            if (S.v) {
                const ax = a === 1 ? 'x' : a + 'x';
                tex = '$' + a + ' \\cdot (x' + sign + c + ') = ' + ax + sign + a * c + '$';
                out.innerHTML = '<p style="margin:0">Ausmultiplizieren: ' + tex + '</p>' +
                    '<p style="margin:6px 0 0">Ausklammern, von rechts nach links gelesen: $' + ax + sign + a * c + ' = ' + a + ' \\cdot (x' + sign + c + ')$</p>' +
                    '<p class="b-help" style="margin:8px 0 0">Probe mit $x = ' + b + '$: $' + a + ' \\cdot (' + b + sign + c + ') = ' + val + '$ und $' + a + ' \\cdot ' + b + sign + a * c + ' = ' + val + '$.</p>';
            } else {
                out.innerHTML = '<p style="margin:0">$' + a + ' \\cdot (' + b + sign + c + ') = ' + a + ' \\cdot ' + b + sign + a + ' \\cdot ' + c + ' = ' + a * b + sign + a * c + ' = ' + val + '$</p>' +
                    '<p class="b-help" style="margin:8px 0 0">' + (minus ? 'Vom ganzen Rechteck $a \\cdot b$ wird der schraffierte Streifen $a \\cdot c$ abgezogen.' : 'Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.') +
                    ' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.</p>';
            }
            math(out);
        }
        sync();
        render();
    });

    /* ---------- linear functions y = m · x + n ---------- */
    W('linearos8', function (box) {
        const hero = isHero(box), prop = box.dataset.mode === 'prop';
        const S = { m: +(box.dataset.m || (prop ? 0.5 : 2)), n: prop ? 0 : +(box.dataset.n || -1) };
        if (!hero) {
            const sl = div(box, '');
            range(sl, { label: 'Steigung $m$', min: -3, max: 3, step: 0.25, value: S.m, fmt: v => fmt(v, 2), onInput: v => { S.m = v; render(); } });
            if (!prop) range(sl, { label: 'y-Achsenabschnitt $n$', min: -5, max: 5, step: 0.5, value: S.n, fmt: v => fmt(v, 1), onInput: v => { S.n = v; render(); } });
            math(sl);
        }
        const p = new B.Plot(div(box, ''), { x: [-6, 6], y: [-6, 6], height: hero ? 300 : 340, aria: prop ? 'Graph einer proportionalen Funktion mit Steigungsdreieck' : 'Graph einer linearen Funktion mit Steigungsdreieck' });
        const out = hero ? null : div(box, 'b-out');
        const eq = (m, n) => 'y = ' + (Math.abs(m) < 1e-12 ? (Math.abs(n) < 1e-12 ? '0' : B.sg(n, 2, true)) : B.co(m, 2) + 'x' + B.sg(n, 2));
        function render() {
            if (hero) {
                p.draw([[2, 1, 'lambda'], [0.5, 1, 'cyan'], [-1, 1, 'phi'], [-0.25, -3, 'violet']].map(([m, n, c]) => ({ fn: x => m * x + n, color: c }))
                    .concat([{ pts: [[0, 1]], color: 'white' }]));
                return;
            }
            const { m, n } = S, f = x => m * x + n;
            // the slope triangle starts at x = 1 (or at x = −2 if the line leaves the picture there)
            const a = Math.abs(f(1)) < 5 && Math.abs(f(2)) < 5.5 ? 1 : -2;
            const L = [{ fn: f, color: 'lambda', label: 'f' }];
            if (Math.abs(m) > 1e-12) {
                L.push({ seg: [[a, f(a)], [a + 1, f(a)]], color: 'phi', width: 2.4 }, { seg: [[a + 1, f(a)], [a + 1, f(a + 1)]], color: 'phi', width: 2.4 },
                    { text: '1', at: [a + 0.5, f(a)], color: 'phi', align: 'center', dy: m > 0 ? 20 : -8, italic: false },
                    { text: 'm = ' + fmt(m, 2), at: [a + 1.25, f(a) + m / 2], color: 'phi', italic: false });
                const x0 = -n / m;
                if (Math.abs(x0) <= 6) L.push({ pts: [[x0, 0]], color: 'cyan' });
            }
            L.push({ pts: [[0, n]], color: 'white' });
            p.draw(L);
            const xs = [-2, -1, 0, 1, 2];
            const trend = Math.abs(m) < 1e-12 ? 'Der Graph verläuft <b>waagerecht</b>.' : m > 0 ? 'Der Graph <b>steigt</b>: Geht man 1 nach rechts, geht es ' + fmt(m, 2) + ' nach oben.'
                : 'Der Graph <b>fällt</b>: Geht man 1 nach rechts, geht es ' + fmt(-m, 2) + ' nach unten.';
            const zero = Math.abs(m) < 1e-12 ? (Math.abs(n) < 1e-12 ? 'Jede Stelle ist eine Nullstelle.' : 'Es gibt keine Nullstelle.')
                : 'Nullstelle (türkis): $0 = ' + B.co(m, 2) + 'x' + B.sg(n, 2) + '$, also $x_0 = ' + texNum(-n / m, 2) + '$.';
            out.innerHTML = '<p style="margin:0 0 6px">$' + eq(m, n) + '$ · ' + trend + '</p>' +
                (prop ? '<p style="margin:0 0 8px">Der Graph ist eine Gerade durch den Ursprung $(0 \\mid 0)$.</p>'
                    : '<p style="margin:0 0 8px">Schnittpunkt mit der y-Achse (weiß): $(0 \\mid ' + texNum(n, 2) + ')$. ' + zero + '</p>') +
                '<div class="b-table-wrap"><table class="b-table g-tab"><tr><th>$x$</th>' + xs.map(x => '<td>$' + x + '$</td>').join('') + '</tr>' +
                '<tr><th>$y$</th>' + xs.map(x => '<td>$' + texNum(f(x), 2) + '$</td>').join('') + '</tr></table></div>';
            math(out);
        }
        render();
    });

    /* ---------- solving a linear system graphically, step by step ---------- */
    // a·x + b·y = c for I and II (b never 0, so both can be solved for y)
    const LGS8 = [
        { l: 'I: x + y = 5', e: [1, 1, 5, 2, -1, 1] },
        { l: 'I: 2x + y = 4', e: [2, 1, 4, 1, -2, 7] },
        { l: 'I: 3x + 2y = 6', e: [3, 2, 6, 1, -1, -3] },
        { l: 'parallel', e: [-2, 1, -1, -2, 1, 2] },
        { l: 'identisch', e: [1, 2, 4, 2, 4, 8] }
    ];
    W('lgsgrafos8', function (box) {
        const Fr = B.Frac;
        const S = { k: 0, step: 1 };
        const c = div(box, 'b-ctrls');
        seg(c, LGS8.map((q, i) => [String(i), 'Beispiel ' + (i + 1)]), '0', v => { S.k = +v; S.step = 1; render(); }, 'Gleichungssystem');
        const nav = div(box, 'b-ctrls');
        nav.innerHTML = '<button type="button" class="b-btn b-go" data-s="next">Nächster Schritt</button><button type="button" class="b-btn" data-s="all">Alle Schritte</button><button type="button" class="b-btn" data-s="reset">Von vorn</button>';
        nav.addEventListener('click', e => {
            const b = e.target.closest('[data-s]'); if (!b) return;
            S.step = b.dataset.s === 'reset' ? 1 : b.dataset.s === 'all' ? 3 : Math.min(3, S.step + 1);
            render();
        });
        const p = new B.Plot(div(box, ''), { x: [-6, 6], y: [-6, 6], height: 320, aria: 'Zwei Geraden eines Gleichungssystems im Koordinatensystem' });
        const out = div(box, 'b-out');
        const coF = m => m.n === m.d ? '' : m.n === -m.d ? '-' : m.tex();
        const sgnF = n => n.n === 0 ? '' : n.n > 0 ? ' + ' + n.tex() : ' - ' + new Fr(-n.n, n.d).tex();
        const linF = (m, n) => m.n === 0 ? n.tex() : coF(m) + 'x' + sgnF(n);
        const eqT = (a, b, cc) => B.co(a, 2) + 'x' + B.sgx(b, 'y') + ' = ' + cc;
        function render() {
            const [a1, b1, c1, a2, b2, c2] = LGS8[S.k].e;
            const m1 = new Fr(-a1, b1), n1 = new Fr(c1, b1), m2 = new Fr(-a2, b2), n2 = new Fr(c2, b2);
            const det = a1 * b2 - a2 * b1;
            let t = '<p style="margin:0 0 6px">$\\text{I: } ' + eqT(a1, b1, c1) + ' \\qquad \\text{II: } ' + eqT(a2, b2, c2) + '$</p>';
            t += '<p style="margin:0 0 6px"><b>Schritt 1:</b> Beide Gleichungen nach $y$ umstellen: $y = ' + linF(m1, n1) + '$ und $y = ' + linF(m2, n2) + '$</p>';
            const L = [];
            if (S.step >= 2) {
                L.push({ fn: x => m1.value * x + n1.value, color: 'lambda', label: 'I' }, { fn: x => m2.value * x + n2.value, color: 'cyan', label: 'II', labelAt: -4.5 });
                t += '<p style="margin:0 0 6px"><b>Schritt 2:</b> Beide Geraden zeichnen: Start bei $(0 \\mid n)$, dann mit dem Steigungsdreieck weiter.</p>';
            }
            if (S.step >= 3) {
                if (det !== 0) {
                    const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det;
                    L.push({ pts: [[x, y]], color: 'white', r: 6 });
                    const par = v => v < 0 ? '(' + texNum(v, 2) + ')' : texNum(v, 2);
                    t += '<p style="margin:0 0 6px"><b>Schritt 3:</b> Schnittpunkt ablesen: $S(' + texNum(x, 2) + ' \\mid ' + texNum(y, 2) + ')$. Probe: $\\text{I: } ' +
                        B.co(a1, 2) + (Math.abs(a1) === 1 ? '' : ' \\cdot ') + par(x) + (b1 < 0 ? ' - ' : ' + ') + (Math.abs(b1) === 1 ? '' : Math.abs(b1) + ' \\cdot ') + par(y) + ' = ' + c1 + '$ ✓, $\;\\text{II: } ' +
                        B.co(a2, 2) + (Math.abs(a2) === 1 ? '' : ' \\cdot ') + par(x) + (b2 < 0 ? ' - ' : ' + ') + (Math.abs(b2) === 1 ? '' : Math.abs(b2) + ' \\cdot ') + par(y) + ' = ' + c2 + '$ ✓</p>' +
                        '<p style="margin:0" class="b-res">Genau eine Lösung: $L = \\{(' + texNum(x, 2) + ' \\mid ' + texNum(y, 2) + ')\\}$</p>';
                } else if (n1.n * n2.d === n2.n * n1.d) {
                    t += '<p style="margin:0 0 6px"><b>Schritt 3:</b> Beide Gleichungen beschreiben <b>dieselbe Gerade</b>. Jeder Punkt auf ihr erfüllt beide Gleichungen.</p>' +
                        '<p style="margin:0" class="b-res">Unendlich viele Lösungen.</p>';
                } else {
                    t += '<p style="margin:0 0 6px"><b>Schritt 3:</b> Gleiche Steigung, verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b> und schneiden sich nie.</p>' +
                        '<p style="margin:0" class="b-res">Keine Lösung: $L = \\{\\,\\}$</p>';
                }
            }
            p.draw(L);
            out.innerHTML = t;
            math(out);
        }
        render();
    });

    /* ---------- comparing two tariffs ---------- */
    const TARIFE = {
        handy: { l: 'Handy', unit: 'Minuten', u: 'min', per: '€ pro Minute', xmax: 200, ymax: 25, A: [4.99, 0.09], B: [9.99, 0.04], step: [0.01, 0.01] },
        strom: { l: 'Strom', unit: 'kWh im Jahr', u: 'kWh', per: '€ pro kWh', xmax: 3000, ymax: 1300, A: [100, 0.38], B: [160, 0.34], step: [5, 0.01] },
        auto: { l: 'Carsharing', unit: 'Kilometer', u: 'km', per: '€ pro km', xmax: 300, ymax: 120, A: [0, 0.39], B: [29, 0.19], step: [1, 0.01] }
    };
    W('tarifos8', function (box) {
        const S = { k: box.dataset.set && TARIFE[box.dataset.set] ? box.dataset.set : 'handy' };
        let T, R = [];
        const c = div(box, 'b-ctrls');
        seg(c, Object.keys(TARIFE).map(k => [k, TARIFE[k].l]), S.k, v => { S.k = v; load(); }, 'Beispiel');
        const sl = div(box, '');
        const plotBox = div(box, '');
        let p = null;
        const out = div(box, 'b-out');
        function load() {
            T = TARIFE[S.k];
            S.A = T.A.slice(); S.B = T.B.slice();
            sl.innerHTML = '';
            const e = v => fmt(v, 2).replace(/,(\d)$/, ',$10') + ' €';
            R = [
                range(sl, { label: 'Tarif A: Grundgebühr', min: 0, max: T.A[0] * 2 + T.step[0] * 20, step: T.step[0], value: S.A[0], fmt: e, onInput: v => { S.A[0] = v; render(); } }),
                range(sl, { label: 'Tarif A: ' + T.per, min: T.step[1], max: 0.6, step: T.step[1], value: S.A[1], fmt: e, onInput: v => { S.A[1] = v; render(); } }),
                range(sl, { label: 'Tarif B: Grundgebühr', min: 0, max: T.B[0] * 2 + T.step[0] * 20, step: T.step[0], value: S.B[0], fmt: e, onInput: v => { S.B[0] = v; render(); } }),
                range(sl, { label: 'Tarif B: ' + T.per, min: T.step[1], max: 0.6, step: T.step[1], value: S.B[1], fmt: e, onInput: v => { S.B[1] = v; render(); } })
            ];
            plotBox.innerHTML = '';
            p = new B.Plot(plotBox, { x: [0, T.xmax], y: [0, T.ymax], height: 320, xLabel: T.u, yLabel: '€', aria: 'Kosten der Tarife A und B in Abhängigkeit vom Verbrauch' });
            render();
        }
        function render() {
            const [nA, mA] = S.A, [nB, mB] = S.B, fA = x => nA + mA * x, fB = x => nB + mB * x;
            const L = [{ fn: fA, color: 'lambda', label: 'A' }, { fn: fB, color: 'cyan', label: 'B', labelAt: T.xmax * 0.15 }];
            const E = v => texNum(v, 2).replace(/\{,\}(\d)$/, '{,}$10');
            let t = '<p style="margin:0 0 6px">Tarif A: $y = ' + E(mA) + 'x + ' + E(nA) + '$ &nbsp;·&nbsp; Tarif B: $y = ' + E(mB) + 'x + ' + E(nB) + '$ &nbsp; ($x$ in ' + T.unit + ', $y$ in €)</p>';
            if (Math.abs(mA - mB) < 1e-9) {
                t += '<p style="margin:0">Beide Tarife kosten gleich viel pro Einheit, die Geraden sind parallel. ' + (Math.abs(nA - nB) < 1e-9 ? 'Die Tarife sind gleich teuer.' : 'Tarif ' + (nA < nB ? 'A' : 'B') + ' ist immer günstiger.') + '</p>';
            } else {
                const x = (nB - nA) / (mA - mB), y = fA(x);
                if (x > 0) {
                    L.push({ pts: [[x, y]], color: 'white', r: 6 }, { vline: x, color: 'dim', dash: true });
                    const first = fA(0) <= fB(0) ? 'A' : 'B', second = first === 'A' ? 'B' : 'A';
                    t += '<p style="margin:0 0 6px">Gleichsetzen: $' + E(mA) + 'x + ' + E(nA) + ' = ' + E(mB) + 'x + ' + E(nB) + '$ ergibt $x \\approx ' + texNum(x, 1) + '$. Dann kosten beide etwa $' + E(y) + '\\,\\text{€}$.</p>' +
                        '<p style="margin:0"><span class="b-res">Bis etwa ' + fmt(x, 0) + ' ' + T.u + ' ist Tarif ' + first + ' günstiger, darüber Tarif ' + second + '.</span></p>';
                } else {
                    t += '<p style="margin:0">Die Geraden schneiden sich nicht bei positivem Verbrauch: Tarif ' + (fA(1) < fB(1) ? 'A' : 'B') + ' ist immer günstiger.</p>';
                }
            }
            p.draw(L);
            out.innerHTML = t;
            math(out);
        }
        load();
    });

    /* ---------- circle ornaments: a rosette with the compass ---------- */
    W('rosetteos8', function (box) {
        const hero = isHero(box);
        const S = { n: +(box.dataset.n || 6), help: !hero, ring: hero };
        if (!hero) {
            const c = div(box, 'b-ctrls');
            c.innerHTML = '<button type="button" class="b-btn" data-a="help">Hilfslinien ein/aus</button><button type="button" class="b-btn" data-a="ring">Zweiter Ring ein/aus</button>';
            c.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; S[b.dataset.a] = !S[b.dataset.a]; render(); });
            const sl = div(box, '');
            range(sl, { label: 'Anzahl der Blätter $n$', min: 3, max: 16, step: 1, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        const M = [230, 230], R = 110;
        // one petal from the centre to P: two arcs with the radius r (the lens of two circles through M and P)
        const petal = (C, P, r, st) => '<path d="M' + f1(C[0]) + ' ' + f1(C[1]) + ' A' + f1(r) + ' ' + f1(r) + ' 0 0 1 ' + f1(P[0]) + ' ' + f1(P[1]) +
            ' A' + f1(r) + ' ' + f1(r) + ' 0 0 1 ' + f1(C[0]) + ' ' + f1(C[1]) + ' Z" style="' + st + '"/>';
        function render() {
            const n = S.n, pts = range0(n).map(k => [M[0] + R * Math.cos(2 * Math.PI * k / n - Math.PI / 2), M[1] + R * Math.sin(2 * Math.PI * k / n - Math.PI / 2)]);
            let s = '';
            if (S.help) {
                s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="' + R + '" style="' + sty(DIM, 1.2, DASH) + '"/>';
                if (n === 6) pts.forEach(P => { s += '<circle cx="' + f1(P[0]) + '" cy="' + f1(P[1]) + '" r="' + R + '" style="' + sty(CY, 0.9) + 'opacity:0.35"/>'; });
            }
            if (S.ring) {
                // a second, larger ring of petals between the first ones
                pts.forEach((P, k) => {
                    const a = 2 * Math.PI * (k + 0.5) / n - Math.PI / 2, Q = [M[0] + 1.55 * R * Math.cos(a), M[1] + 1.55 * R * Math.sin(a)];
                    s += petal(M, Q, 1.55 * R, area(VIO, 0.10));
                });
            }
            pts.forEach((P, k) => { s += petal(M, P, R, area(k % 2 && n % 2 === 0 ? CY : LAM, 0.22)); });
            if (S.help) pts.forEach(P => { s += G.dot(P, TXT, 3.5); });
            s += G.dot(M, TXT, 4);
            pic.innerHTML = '<svg viewBox="0 0 460 460" role="img" aria-label="Rosette mit ' + n + ' Blättern, mit dem Zirkel konstruiert">' + s + '</svg>';
            if (!out) return;
            out.innerHTML = '<p style="margin:0">' + (n === 6
                ? 'Bei 6 Blättern passt alles genau: Der Radius lässt sich sechsmal auf der Kreislinie abtragen. Jeder Bogen um einen der Punkte geht durch den Mittelpunkt und die beiden Nachbarpunkte. Die Blätter berühren sich gerade.'
                : 'Jedes Blatt besteht aus zwei Kreisbögen mit dem Radius $r$ vom Mittelpunkt zu einem Punkt auf der Kreislinie. Die Punkte teilen den Kreis in ' + n + ' gleiche Teile von je $' + texNum(360 / n, 1) + '^\\circ$. ' +
                  (n < 6 ? 'Weil jedes Blatt $60^\\circ$ breit ist, bleiben bei weniger als 6 Blättern Lücken.' : 'Weil jedes Blatt $60^\\circ$ breit ist, überlappen sich die Blätter bei mehr als 6.')) + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- counting: the counting principle and n! ---------- */
    const ZAEHL = {
        schloss: { l: 'Zahlenschloss', st: [['1. Ring', 10], ['2. Ring', 10], ['3. Ring', 10]], what: 'Kombinationen', guess: true },
        menue: { l: 'Menü', st: [['Vorspeise', 3], ['Hauptgericht', 4], ['Nachtisch', 2]], what: 'Menüs' },
        outfit: { l: 'Outfit', st: [['T-Shirt', 4], ['Hose', 3], ['Schuhe', 2]], what: 'Outfits' }
    };
    const CHIPC = [LAM, CY, PHI, VIO, RED, '#f0a8d0', '#9fd8c0'];
    W('zaehlenos8', function (box) {
        const S = { mode: box.dataset.mode === 'produkt' ? 'produkt' : 'anordnung', n: 3, k: 'schloss', v: null };
        const c = div(box, 'b-ctrls');
        seg(c, [['anordnung', 'Anordnungen'], ['produkt', 'Zählprinzip']], S.mode, v => { S.mode = v; build(); }, 'Art');
        const ctl = div(box, ''), out = div(box, 'b-out');
        const chip = (i) => '<span style="display:inline-block;min-width:1.7em;margin:2px;padding:2px 6px;border-radius:6px;text-align:center;font-weight:700;color:#0a1426;background:' + CHIPC[i % CHIPC.length] + '">' + String.fromCharCode(65 + i) + '</span>';
        function perms(a) { if (a.length <= 1) return [a]; const r = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(p => r.push([x].concat(p)))); return r; }
        const fact = n => n <= 1 ? 1 : n * fact(n - 1);
        function build() {
            ctl.innerHTML = '';
            if (S.mode === 'anordnung') {
                range(ctl, { label: 'Anzahl der Personen $n$', min: 2, max: 8, step: 1, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; render(); } });
            } else {
                const cc = div(ctl, 'b-ctrls');
                seg(cc, Object.keys(ZAEHL).map(k => [k, ZAEHL[k].l]), S.k, v => { S.k = v; build(); }, 'Beispiel');
                S.v = ZAEHL[S.k].st.map(q => q[1]);
                ZAEHL[S.k].st.forEach((q, i) => range(ctl, { label: q[0] + ': Möglichkeiten', min: 1, max: 10, step: 1, value: S.v[i], fmt: v => String(v), onInput: v => { S.v[i] = v; render(); } }));
            }
            math(ctl);
            render();
        }
        function render() {
            if (S.mode === 'anordnung') {
                const n = S.n, f = fact(n), prod = Array.from({ length: n }, (_, i) => n - i).join(' \\cdot ');
                let list = '';
                if (n <= 4) list = '<div style="margin:10px 0 0;line-height:2">' + perms(Array.from({ length: n }, (_, i) => i)).map(p => '<span style="display:inline-block;margin:0 10px 6px 0;padding:2px 4px;border:1px solid rgba(127,216,238,0.25);border-radius:8px">' + p.map(chip).join('') + '</span>').join('') + '</div>';
                out.innerHTML = '<p style="margin:0">' + n + ' Personen auf ' + n + ' Plätzen: Für den ersten Platz gibt es ' + n + ' Möglichkeiten, für den zweiten noch ' + (n - 1) + ', und so weiter bis zum letzten Platz.</p>' +
                    '<p style="margin:8px 0 0">$' + n + '! = ' + prod + ' = ' + texNum(f, 0) + '$</p>' +
                    (list || '<p class="b-help" style="margin:8px 0 0">Das sind zu viele, um sie alle aufzuschreiben. Bei 4 Personen sind es noch 24.</p>') +
                    '<p class="b-help" style="margin:8px 0 0">Die Wahrscheinlichkeit, dass eine zufällige Sitzordnung genau die alphabetische ist: $\\tfrac{1}{' + texNum(f, 0) + '}$.</p>';
            } else {
                const Z = ZAEHL[S.k], N = S.v.reduce((a, b) => a * b, 1);
                out.innerHTML = '<p style="margin:0">' + Z.st.map((q, i) => q[0] + ': ' + S.v[i]).join(' · ') + '</p>' +
                    '<p style="margin:8px 0 0">$' + S.v.join(' \\cdot ') + ' = ' + texNum(N, 0) + '$ ' + Z.what + '</p>' +
                    '<p class="b-help" style="margin:8px 0 0">Für jede Wahl im ersten Schritt gibt es alle Möglichkeiten des zweiten, für jede dieser Kombinationen alle des dritten: Die Anzahlen werden multipliziert.' +
                    (Z.guess ? ' Wer die Kombination rät, trifft beim ersten Versuch mit der Wahrscheinlichkeit $\\tfrac{1}{' + texNum(N, 0) + '}$.' : '') + '</p>';
            }
            math(out);
        }
        build();
    });

    /* ---------- renovating a room: floor, walls, paint ---------- */
    const RAUM = { pak: 2.22, pakPreis: 21.9, tuer: 1.8, fenster: 1.56, deckt: 7, anstriche: 2, eimer: 5, eimerPreis: 24.95 };
    W('raumos8', function (box) {
        const hero = isHero(box);
        const S = { a: 4.2, b: 3.5, h: 2.5, t: 1, f: 2, v: 10 };
        if (!hero) {
            const sl = div(box, '');
            range(sl, { label: 'Länge $a$', min: 2, max: 8, step: 0.1, value: S.a, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.a = v; render(); } });
            range(sl, { label: 'Breite $b$', min: 2, max: 6, step: 0.1, value: S.b, fmt: v => fmt(v, 1) + ' m', onInput: v => { S.b = v; render(); } });
            range(sl, { label: 'Raumhöhe $h$', min: 2.2, max: 3.2, step: 0.05, value: S.h, fmt: v => fmt(v, 2) + ' m', onInput: v => { S.h = v; render(); } });
            range(sl, { label: 'Türen', min: 0, max: 3, step: 1, value: S.t, fmt: v => String(v), onInput: v => { S.t = v; render(); } });
            range(sl, { label: 'Fenster', min: 0, max: 4, step: 1, value: S.f, fmt: v => String(v), onInput: v => { S.f = v; render(); } });
            range(sl, { label: 'Verschnitt beim Boden', min: 0, max: 15, step: 1, value: S.v, fmt: v => v + ' %', onInput: v => { S.v = v; render(); } });
            math(sl);
        }
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        let narrow = false;
        if (window.ResizeObserver) new ResizeObserver(() => { const nw = pic.clientWidth > 0 && pic.clientWidth < 480; if (nw !== narrow) { narrow = nw; render(); } }).observe(pic);
        function render() {
            const { a, b, h, t, f, v } = S, Wv = narrow ? 400 : 640;
            // the floor plan
            const sf = Math.min(34, (Wv - 120) / a, 150 / b), fx = (Wv - a * sf) / 2, fy = 30;
            let s = '<rect x="' + f1(fx) + '" y="' + fy + '" width="' + f1(a * sf) + '" height="' + f1(b * sf) + '" style="' + area(LAM, 0.18) + '"/>';
            // floorboards as thin lines
            for (let x = fx + 0.6 * sf; x < fx + a * sf; x += 0.6 * sf) s += G.line([x, fy], [x, fy + b * sf], sty(LAM, 0.6) + 'opacity:0.35');
            s += G.txt([fx + a * sf / 2, fy - 8], 'a = ' + fmt(a, 1) + ' m', 'g-lab') + G.txt([fx - 8, fy + b * sf / 2 + 5], 'b = ' + fmt(b, 1) + ' m', 'g-lab', 'end');
            // the walls unrolled: a, b, a, b side by side
            const per = 2 * (a + b), sw = Math.min((Wv - 40) / per, 30), wx = (Wv - per * sw) / 2, wy = fy + b * sf + 40, H = h * sw;
            let x = wx, doors = t, wins = f;
            [a, b, a, b].forEach((w, i) => {
                s += '<rect x="' + f1(x) + '" y="' + f1(wy) + '" width="' + f1(w * sw) + '" height="' + f1(H) + '" style="' + area(CY, 0.14) + '"/>';
                // one door per wall from the first wall on, windows on the walls after
                if (doors > 0 && (i === 0 || (i === 2 && doors > 1) || (i === 3 && doors > 2))) {
                    s += '<rect x="' + f1(x + 0.4 * sw) + '" y="' + f1(wy + H - 2 * sw) + '" width="' + f1(0.9 * sw) + '" height="' + f1(2 * sw) + '" style="fill:#0a1426;stroke:' + TXT + ';stroke-width:1.2"/>';
                }
                const nw = i === 1 ? Math.min(wins, 2) : i === 2 ? Math.max(0, Math.min(wins - 2, 2)) : 0;
                for (let k = 0; k < nw; k++) {
                    const cx = x + w * sw * (k + 1) / (nw + 1);
                    s += '<rect x="' + f1(cx - 0.6 * sw) + '" y="' + f1(wy + 0.7 * sw) + '" width="' + f1(1.2 * sw) + '" height="' + f1(1.3 * sw) + '" style="fill:#0a1426;stroke:' + TXT + ';stroke-width:1.2"/>';
                }
                x += w * sw;
            });
            s += G.txt([Wv / 2, wy + H + 22], 'Wände abgewickelt: ' + fmt(per, 1) + ' m lang, ' + fmt(h, 2) + ' m hoch', 'g-lab');
            const vbH = wy + H + 34;
            pic.innerHTML = '<svg viewBox="0 0 ' + Wv + ' ' + f1(vbH) + '" role="img" aria-label="Grundriss eines Zimmers und seine vier Wände nebeneinander, mit Türen und Fenstern">' + s + '</svg>';
            if (!out) return;
            const A = a * b, Av = A * (1 + v / 100), pak = Math.ceil(Av / RAUM.pak - 1e-9), kBoden = pak * RAUM.pakPreis;
            const Aw = per * h - t * RAUM.tuer - f * RAUM.fenster, liter = Aw * RAUM.anstriche / RAUM.deckt, eimer = Math.ceil(liter / RAUM.eimer - 1e-9), kFarbe = eimer * RAUM.eimerPreis;
            const E = v2 => texNum(v2, 2).replace(/\{,\}(\d)$/, '{,}$10') + '\\,\\text{€}';
            out.innerHTML = '<div class="b-table-wrap"><table class="b-table g-tab">' +
                '<tr><td>Bodenfläche</td><td>$' + texNum(a, 1) + ' \\cdot ' + texNum(b, 1) + ' = ' + texNum(A, 2) + '\\,\\text{m}^2$</td></tr>' +
                '<tr><td>mit ' + v + ' % Verschnitt</td><td>$' + texNum(Av, 2) + '\\,\\text{m}^2$ → ' + pak + ' Pakete zu $' + texNum(RAUM.pak, 2) + '\\,\\text{m}^2$ → $' + E(kBoden) + '$</td></tr>' +
                '<tr><td>Wandfläche</td><td>$' + texNum(per, 1) + ' \\cdot ' + texNum(h, 2) + (t ? ' - ' + t + ' \\cdot ' + texNum(RAUM.tuer, 1) : '') + (f ? ' - ' + f + ' \\cdot ' + texNum(RAUM.fenster, 2) : '') + ' \\approx ' + texNum(Aw, 2) + '\\,\\text{m}^2$</td></tr>' +
                '<tr><td>Farbe (2 Anstriche)</td><td>$' + texNum(Aw * 2, 1) + '\\,\\text{m}^2 : 7 \\approx ' + texNum(liter, 1) + '\\,\\ell$ → ' + eimer + (eimer === 1 ? ' Eimer' : ' Eimer') + ' zu 5 ℓ → $' + E(kFarbe) + '$</td></tr>' +
                '<tr><td><b>Material zusammen</b></td><td>$' + E(kBoden + kFarbe) + '$</td></tr>' +
                '<tr><td>Luftraum des Zimmers</td><td>$' + texNum(A * h, 2) + '\\,\\text{m}^3$</td></tr></table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Annahmen: Laminat im Paket zu ' + fmt(RAUM.pak, 2) + ' m² für 21,90 €, Tür 1,8 m², Fenster 1,56 m², 1 ℓ Farbe reicht für 7 m², Eimer zu 5 ℓ für 24,95 €. Pakete und Eimer gibt es nur ganz: Es wird aufgerundet.</p>';
            math(out);
        }
        render();
    });

    /* ---------- tyre size: ETRTO width-rim, diameter, circumference ---------- */
    const REIFEN = [['20', 47, 406], ['24', 47, 507], ['26', 54, 559], ['28', 37, 622], ['29', 57, 622]];
    W('reifenos8', function (box) {
        const S = { k: 3, b: 37 };
        const c = div(box, 'b-ctrls');
        let rb = null;
        seg(c, REIFEN.map((q, i) => [String(i), q[0] + ' Zoll']), String(S.k), v => { S.k = +v; S.b = REIFEN[S.k][1]; rb.set(S.b); render(); }, 'Reifen');
        const sl = div(box, '');
        rb = range(sl, { label: 'Reifenbreite', min: 23, max: 65, step: 1, value: S.b, fmt: v => v + ' mm', onInput: v => { S.b = v; render(); } });
        const two = div(box, 'b-two');
        const pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        function render() {
            const felge = REIFEN[S.k][2], d = felge + 2 * S.b, u = Math.PI * d, zoll = d / 25.4;
            const C = [150, 140], sc = 240 / 760, Ro = d / 2 * sc, Ri = felge / 2 * sc;
            let s = '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + f1((Ro + Ri) / 2) + '" style="fill:none;stroke:#3a4556;stroke-width:' + f1(Ro - Ri) + '"/>';
            s += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + f1(Ro) + '" style="' + sty(TXT, 1.6) + '"/><circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + f1(Ri) + '" style="' + sty(CY, 2) + '"/>';
            for (let k = 0; k < 18; k++) { const a = k * Math.PI / 9; s += G.line(C, [C[0] + Ri * Math.cos(a), C[1] + Ri * Math.sin(a)], sty(DIM, 0.8) + 'opacity:0.6'); }
            s += G.line([C[0] - Ro, C[1] + Ro + 16], [C[0] + Ro, C[1] + Ro + 16], sty(LAM, 1.8)) + G.txt([C[0], C[1] + Ro + 36], 'd = ' + d + ' mm', 'g-lab');
            s += G.line([C[0] + Ri, C[1]], [C[0] + Ro, C[1]], sty(LAM, 2.4)) + G.txt([C[0] + Ro + 6, C[1] - 6], S.b + ' mm', 'g-lab', 'start');
            s += G.dot(C, TXT, 3.5);
            pic.innerHTML = '<svg viewBox="0 0 330 310" role="img" aria-label="Laufrad mit Felge ' + felge + ' mm und Reifen ' + S.b + ' mm breit">' + s + '</svg>';
            out.innerHTML = '<p style="margin:0 0 8px">Aufschrift auf dem Reifen: <b>' + S.b + '-' + felge + '</b> (Breite in mm, dann Felgendurchmesser in mm)</p>' +
                '<div class="b-table-wrap"><table class="b-table g-tab">' +
                '<tr><td>Raddurchmesser</td><td>$' + felge + ' + 2 \\cdot ' + S.b + ' = ' + d + '\\,\\text{mm}$</td></tr>' +
                '<tr><td>in Zoll</td><td>$' + d + ' : 25{,}4 \\approx ' + texNum(zoll, 1) + '$</td></tr>' +
                '<tr><td>Radumfang</td><td>$\\pi \\cdot ' + d + '\\,\\text{mm} \\approx ' + texNum(u, 0) + '\\,\\text{mm}$</td></tr>' +
                '<tr><td>Umdrehungen pro km</td><td>$1\\,000\\,000 : ' + texNum(u, 0) + ' \\approx ' + texNum(1e6 / u, 0) + '$</td></tr></table></div>' +
                '<p class="b-help" style="margin:8px 0 0">Die Zollangabe ist eher ein Name: Ein „' + REIFEN[S.k][0] + '-Zoll-Rad“ hat hier $' + texNum(zoll, 1) + '$ Zoll. Genauer ist die Millimeterangabe.</p>';
            math(out);
        }
        render();
    });
})();
