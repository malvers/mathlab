/* buch-bgy13lk.js — widgets of the book "Mathematik · Berufliches Gymnasium 13 · Leistungskurs" that the other modules do not have
 * (js/buch.js, js/buch-plot.js). Calculus, stochastics, vector and matrix widgets of the other books are used as they are.
 *   titelbildbgy13lk  cover art: trapezoids under a curve, the bell curve with its rejection region, a population cycle egg → larva → beetle
 * Looks: js/buch.css (shared classes only).
 */
(function () {
    'use strict';
    const B = window.Buch;
    const W = B.widget;

    /* ---------- cover art ---------- */
    W('titelbildbgy13lk', function (box) {
        const Wd = 600, Ht = 850, n1 = v => v.toFixed(1);
        let grid = '';
        for (let x = 0; x <= Wd; x += 66.7) grid += '<line x1="' + n1(x) + '" y1="0" x2="' + n1(x) + '" y2="' + Ht + '" />';
        for (let y = 0; y <= Ht; y += 65.4) grid += '<line x1="0" y1="' + n1(y) + '" x2="' + Wd + '" y2="' + n1(y) + '" />';
        // middle: a curve with trapezoids under it (numerical integration) and a dashed second curve that closes an area
        const X = t => 60 + 480 * t, base = 600, f = t => base - (60 + 115 * Math.exp(-((t - 0.36) ** 2) / 0.06) + 50 * t * t), g = t => base - (32 + 42 * t);
        let strips = '';
        const n = 8;
        for (let i = 0; i < n; i++) {
            const a = i / n, b = (i + 1) / n;
            strips += '<path d="M' + n1(X(a)) + ' ' + base + 'L' + n1(X(a)) + ' ' + n1(f(a)) + 'L' + n1(X(b)) + ' ' + n1(f(b)) + 'L' + n1(X(b)) + ' ' + base + 'Z"/>';
        }
        let curve = '', lower = '';
        for (let i = 0; i <= 120; i++) { const t = i / 120; curve += (i ? 'L' : 'M') + n1(X(t)) + ' ' + n1(f(t)); lower += (i ? 'L' : 'M') + n1(X(t)) + ' ' + n1(g(t)); }
        let mid = '<g fill="#F5C242" fill-opacity="0.12" stroke="#F5C242" stroke-opacity="0.5" stroke-width="1.2">' + strips + '</g>';
        mid += '<path d="' + lower + '" stroke="#7fd8ee" stroke-opacity="0.7" stroke-width="2" fill="none" stroke-dasharray="7 6"/>';
        mid += '<path d="' + curve + '" stroke="#F5C242" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#tbb13lk-glow)"/>';
        mid += '<line x1="40" y1="' + base + '" x2="566" y2="' + base + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2"/>';
        // lower left: the bell curve, the right tail red as a rejection region
        const bx = z => 130 + z * 48, by = 770, sc = 260;
        const dens = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
        let bell = '', tail = 'M' + n1(bx(1.65)) + ' ' + by;
        for (let i = 0; i <= 100; i++) { const z = -2.5 + 5 * i / 100; bell += (i ? 'L' : 'M') + n1(bx(z)) + ' ' + n1(by - dens(z) * sc); }
        for (let i = 0; i <= 30; i++) { const z = 1.65 + 0.85 * i / 30; tail += 'L' + n1(bx(z)) + ' ' + n1(by - dens(z) * sc); }
        tail += 'L' + n1(bx(2.5)) + ' ' + by + 'Z';
        let stat = '<path d="' + bell + 'L' + n1(bx(2.5)) + ' ' + by + 'L' + n1(bx(-2.5)) + ' ' + by + 'Z" fill="#A0C85A" fill-opacity="0.16"/>';
        stat += '<path d="' + tail + '" fill="#e2665a" fill-opacity="0.75"/>';
        stat += '<path d="' + bell + '" stroke="#A0C85A" stroke-width="2.6" fill="none" filter="url(#tbb13lk-glow)"/>';
        stat += '<line x1="' + n1(bx(1.65)) + '" y1="' + (by - 104) + '" x2="' + n1(bx(1.65)) + '" y2="' + by + '" stroke="#e2665a" stroke-width="1.6" stroke-dasharray="4 4"/>';
        stat += '<line x1="' + n1(bx(-2.6)) + '" y1="' + (by + 0.5) + '" x2="' + n1(bx(2.6)) + '" y2="' + (by + 0.5) + '" stroke="#cfe4f5" stroke-opacity="0.35" stroke-width="1.2"/>';
        // lower right: a population cycle egg → larva → beetle → egg (Wahlpflicht 2), three nodes on a triangle with curved arrows
        const NODES = [[455, 652], [532, 742], [378, 742]], COL = ['#F5C242', '#7fd8ee', '#B8A4F2'], R = 24;
        let cyc = '';
        for (let i = 0; i < 3; i++) {
            const [x1, y1] = NODES[i], [x2, y2] = NODES[(i + 1) % 3], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
            const ux = dx / L, uy = dy / L, bend = 22, mx = (x1 + x2) / 2 + uy * bend, my = (y1 + y2) / 2 - ux * bend;
            cyc += '<path d="M' + n1(x1 + ux * (R + 4)) + ' ' + n1(y1 + uy * (R + 4)) + ' Q' + n1(mx) + ' ' + n1(my) + ' ' + n1(x2 - ux * (R + 10)) + ' ' + n1(y2 - uy * (R + 10)) +
                '" fill="none" stroke="#e682be" stroke-width="2.4" marker-end="url(#tbb13lk-arr)"/>';
        }
        NODES.forEach(([x, y], i) => { cyc += '<circle cx="' + x + '" cy="' + y + '" r="' + R + '" fill="' + COL[i] + '" fill-opacity="0.18" stroke="' + COL[i] + '" stroke-width="2.4"/>'; });
        // a little beetle in the beetle node, an egg and a larva as plain shapes
        cyc += '<ellipse cx="455" cy="652" rx="7" ry="10" fill="#F5C242" fill-opacity="0.85"/>';
        cyc += '<path d="M518 745 q7 -9 14 0 t14 0" stroke="#7fd8ee" stroke-width="5" fill="none" stroke-linecap="round"/>';
        cyc += '<ellipse cx="378" cy="745" rx="9" ry="12" fill="#B8A4F2" fill-opacity="0.9"/><line x1="378" y1="733" x2="378" y2="757" stroke="#2a2440" stroke-width="1.4"/>';
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer">' +
            '<defs><linearGradient id="tbb13lk-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="tbb13lk-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#tbb13lk-fade)"/></mask>' +
            '<marker id="tbb13lk-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#e682be"/></marker>' +
            '<filter id="tbb13lk-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Wd + '" height="' + Ht + '"><feGaussianBlur stdDeviation="5" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g mask="url(#tbb13lk-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' + mid + stat + '</g>' + cyc + '</svg>';
    });
})();
