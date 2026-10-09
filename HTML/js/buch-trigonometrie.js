/* buch-trigonometrie.js — widgets for triangles, periodic processes and the tangent in the book Mathematik · Gymnasium 10
 * (js/buch.js, js/buch-plot.js).
 *   titelbildgy10    the cover of the Gymnasium 10 book: a sine wave, an exponential curve, a general triangle with its
 *                    circumcircle and a sequence that settles on its limit
 *   dreieck-hero     decorative figure for a chapter opener (data-motiv="dreieck" | "vermessung" | "pyramide")
 *   messkurve        periodic measurements (tides, Ferris wheel, ECG, sunspots): two markers measure the period,
 *                    amplitude and centre line from the curve
 *   sinussatz        a triangle with draggable corners: a/sin α = b/sin β = c/sin γ, with the height h_c or the circumcircle
 *   kosinussatz      squares on the three sides: c² = a² + b² − 2ab·cos γ, Pythagoras as the special case γ = 90°
 *   dreieckloeser    SSS, SWS, WSW, SSW: which theorem when, all steps, the ambiguous case with two triangles
 *   dreiecksflaeche  A = ½·a·b·sin γ with the height drawn in
 *   tangensfunktion  tan α as a segment on the tangent at the unit circle, beside the graph with its poles
 *   pyramidekegel    square pyramid and cone: the right triangles inside, heights, edges, angles, volume and surface
 * Geometry is drawn by a small canvas helper (Geo, below): same unit on both axes, no coordinate axes, draggable points.
 * Looks: js/buch.css (section "Widgets of the Gymnasium 10 chapters").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;
    const col = c => (B.color ? B.color(c) : c);
    const FONT = '"Lab Ziffern", Raleway, system-ui, sans-serif';
    const RAD = Math.PI / 180;
    const dg = (x, d = 1) => texNum(x, d) + '^\\circ';          // degrees in TeX (never \,^\circ: KaTeX error)
    const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
    function angleAt(P, Q, R) {                                    // angle at P between PQ and PR, radians
        const v = [Q[0] - P[0], Q[1] - P[1]], w = [R[0] - P[0], R[1] - P[1]];
        const c = (v[0] * w[0] + v[1] * w[1]) / (Math.hypot(v[0], v[1]) * Math.hypot(w[0], w[1]) || 1);
        return Math.acos(Math.max(-1, Math.min(1, c)));
    }
    let uid = 0;

    /* ---------- Geo: geometry on a canvas, equal scale, no axes ---------- */
    class Geo {
        constructor(box, o = {}) {
            this.o = Object.assign({ x: [-5, 5], y: [-3, 3], height: 320 }, o);
            this.box = div(box, 'b-canvasbox');
            this.box.style.height = this.o.height + 'px';
            this.cv = document.createElement('canvas');
            this.cv.setAttribute('role', 'img');
            this.cv.setAttribute('aria-label', o.aria || 'Geometrische Figur');
            this.box.appendChild(this.cv);
            this.ctx = this.cv.getContext('2d');
            this.layers = []; this.hs = null;
            const redraw = () => this.draw();
            addEventListener('resize', redraw);
            if (window.ResizeObserver) new ResizeObserver(redraw).observe(this.box);
            this._drag();
        }
        view(x, y) { if (x) this.o.x = x; if (y) this.o.y = y; }
        _frame() {                                                  // the whole box [x] × [y] visible, centred
            const w = this.cv.clientWidth, h = this.cv.clientHeight, [x0, x1] = this.o.x, [y0, y1] = this.o.y;
            this.w = w; this.h = h;
            this.s = Math.min(w / (x1 - x0), h / (y1 - y0));
            this.ox = w / 2 - this.s * (x0 + x1) / 2; this.oy = h / 2 + this.s * (y0 + y1) / 2;
        }
        X(x) { return this.ox + this.s * x; }
        Y(y) { return this.oy - this.s * y; }
        ix(px) { return (px - this.ox) / this.s; }
        iy(py) { return (this.oy - py) / this.s; }
        draw(layers) {
            if (layers) this.layers = layers;
            this._frame();
            if (!this.w || !this.h) return;
            const dpr = window.devicePixelRatio || 1, ctx = this.ctx;
            this.cv.width = Math.round(this.w * dpr); this.cv.height = Math.round(this.h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, this.w, this.h);
            ctx.lineJoin = 'round'; ctx.lineCap = 'round';
            for (const L of this.layers) this._layer(L);
            if (this.hs) this.hs.forEach(h => {
                if (h.hidden) return;
                const px = this.X(h.x), py = this.Y(h.y), c = col(h.color || 'white');
                ctx.setLineDash([]); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px, py, 6.5, 0, 7); ctx.fill();
                ctx.strokeStyle = '#0a1426'; ctx.lineWidth = 2; ctx.stroke();
                ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, 11, 0, 7); ctx.stroke();
            });
        }
        _layer(L) {
            const ctx = this.ctx, c = col(L.color || 'white');
            ctx.setLineDash(L.dash ? [6, 5] : []);
            ctx.lineWidth = L.width || 2;
            if (L.poly) {
                ctx.beginPath(); L.poly.forEach(([x, y], i) => i ? ctx.lineTo(this.X(x), this.Y(y)) : ctx.moveTo(this.X(x), this.Y(y))); ctx.closePath();
                ctx.globalAlpha = L.fill != null ? L.fill : 0.14; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1;
                if (L.stroke !== false) { ctx.strokeStyle = c; ctx.stroke(); }
            }
            if (L.seg) {
                ctx.strokeStyle = c; ctx.beginPath();
                ctx.moveTo(this.X(L.seg[0][0]), this.Y(L.seg[0][1])); ctx.lineTo(this.X(L.seg[1][0]), this.Y(L.seg[1][1])); ctx.stroke();
            }
            if (L.path) {                                           // open polyline in world coordinates
                ctx.strokeStyle = c; ctx.beginPath();
                L.path.forEach(([x, y], i) => i ? ctx.lineTo(this.X(x), this.Y(y)) : ctx.moveTo(this.X(x), this.Y(y))); ctx.stroke();
            }
            if (L.circle) {
                ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(this.X(L.circle[0]), this.Y(L.circle[1]), L.r * this.s, 0, Math.PI * 2); ctx.stroke();
            }
            if (L.arc) {                                            // angle mark at P between the rays to Q and R (radius in px)
                const [P, Q, R] = L.arc, r = L.r || 26;
                const a1 = Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]);
                let d = Math.atan2(-(R[1] - P[1]), R[0] - P[0]) - a1;
                while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
                const px = this.X(P[0]), py = this.Y(P[1]);
                ctx.setLineDash([]);
                ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, r, a1, a1 + d, d < 0); ctx.closePath();
                ctx.globalAlpha = 0.22; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1;
                ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(px, py, r, a1, a1 + d, d < 0); ctx.stroke();
            }
            if (L.right) {                                          // right-angle mark at P (rays to Q and R)
                const [P, Q, R] = L.right, k = 13;
                const u = [this.X(Q[0]) - this.X(P[0]), this.Y(Q[1]) - this.Y(P[1])], v = [this.X(R[0]) - this.X(P[0]), this.Y(R[1]) - this.Y(P[1])];
                const lu = Math.hypot(u[0], u[1]) || 1, lv = Math.hypot(v[0], v[1]) || 1, px = this.X(P[0]), py = this.Y(P[1]);
                const a = [px + u[0] / lu * k, py + u[1] / lu * k], b = [px + v[0] / lv * k, py + v[1] / lv * k];
                ctx.setLineDash([]); ctx.strokeStyle = c; ctx.lineWidth = 1.4;
                ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + b[0] - px, a[1] + b[1] - py); ctx.lineTo(b[0], b[1]); ctx.stroke();
                ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px + (a[0] + b[0] - 2 * px) * 0.45, py + (a[1] + b[1] - 2 * py) * 0.45, 1.6, 0, 7); ctx.fill();
            }
            if (L.dot) { ctx.setLineDash([]); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(this.X(L.dot[0]), this.Y(L.dot[1]), L.r || 4.5, 0, 7); ctx.fill(); }
            if (L.text != null) {
                ctx.setLineDash([]);
                ctx.font = (L.italic ? 'italic ' : '') + (L.bold === false ? '' : '600 ') + (L.size || 16) + 'px ' + FONT;
                ctx.fillStyle = c; ctx.textAlign = L.align || 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(L.text, this.X(L.at[0]) + (L.dx || 0), this.Y(L.at[1]) + (L.dy || 0));
            }
            ctx.setLineDash([]);
        }
        handles(list, onMove) { this.hs = list; this.onMove = onMove; this.draw(); }
        _drag() {
            const cv = this.cv; let drag = -1;
            cv.style.touchAction = 'pan-y';
            const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
            const near = (px, py) => this.hs ? this.hs.findIndex(h => !h.hidden && Math.hypot(this.X(h.x) - px, this.Y(h.y) - py) < 22) : -1;
            cv.addEventListener('pointerdown', e => {
                const [px, py] = pos(e); drag = near(px, py);
                if (drag >= 0) { cv.setPointerCapture(e.pointerId); cv.style.touchAction = 'none'; e.preventDefault(); }
            });
            cv.addEventListener('pointermove', e => {
                const [px, py] = pos(e);
                if (drag < 0) { cv.style.cursor = near(px, py) >= 0 ? 'grab' : ''; return; }
                const h = this.hs[drag], s = h.snap || 0, m = 8 / this.s;
                let x = this.ix(px), y = this.iy(py);
                if (s) { x = Math.round(x / s) * s; y = Math.round(y / s) * s; }
                const old = [h.x, h.y];
                if (!h.fixX) h.x = Math.min(Math.max(x, this.ix(0) + m), this.ix(this.w) - m);
                if (!h.fixY) h.y = Math.min(Math.max(y, this.iy(this.h) + m), this.iy(0) - m);
                if (this.onMove && this.onMove(drag, h.x, h.y) === false) { h.x = old[0]; h.y = old[1]; }
                this.draw();
            });
            const end = () => { drag = -1; cv.style.touchAction = 'pan-y'; };
            cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
        }
    }
    B.Geo = Geo;

    // a labelled triangle as layers: corners A, B, C (world points), the colours of the sides a, b, c
    const SIDE = { a: 'lambda', b: 'cyan', c: 'phi' };
    function triLayers(A, Bp, C, o = {}) {
        const G = [(A[0] + Bp[0] + C[0]) / 3, (A[1] + Bp[1] + C[1]) / 3];
        const out = (P, k) => { const d = Math.hypot(P[0] - G[0], P[1] - G[1]) || 1; return [P[0] + (P[0] - G[0]) / d * k, P[1] + (P[1] - G[1]) / d * k]; };
        const mid = (P, Q, k) => {                                  // label of side PQ, pushed away from the triangle
            const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], d = Math.hypot(M[0] - G[0], M[1] - G[1]) || 1;
            return [M[0] + (M[0] - G[0]) / d * k, M[1] + (M[1] - G[1]) / d * k];
        };
        const k = o.k || 0.42;
        const L = [{ poly: [A, Bp, C], color: 'cyan', fill: 0.07, stroke: false }];
        if (o.arcs !== false) L.push({ arc: [A, Bp, C], color: 'violet', r: o.r || 24 }, { arc: [Bp, C, A], color: 'violet', r: o.r || 24 }, { arc: [C, A, Bp], color: 'violet', r: o.r || 24 });
        L.push({ seg: [Bp, C], color: SIDE.a, width: 3 }, { seg: [C, A], color: SIDE.b, width: 3 }, { seg: [A, Bp], color: SIDE.c, width: 3 });
        const n = o.names || ['A', 'B', 'C'];
        L.push({ text: n[0], at: out(A, k), color: 'white' }, { text: n[1], at: out(Bp, k), color: 'white' }, { text: n[2], at: out(C, k), color: 'white' });
        if (o.sides !== false) {
            const s = o.sideNames || ['a', 'b', 'c'];
            L.push({ text: s[0], at: mid(Bp, C, k * 0.8), color: SIDE.a, italic: true }, { text: s[1], at: mid(C, A, k * 0.8), color: SIDE.b, italic: true },
                { text: s[2], at: mid(A, Bp, k * 0.8), color: SIDE.c, italic: true });
        }
        return L;
    }
    // sides and angles of the triangle ABC
    function measure(A, Bp, C) {
        return { a: dist(Bp, C), b: dist(C, A), c: dist(A, Bp), al: angleAt(A, Bp, C), be: angleAt(Bp, C, A), ga: angleAt(C, A, Bp) };
    }
    const area2 = (A, Bp, C) => (Bp[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (Bp[1] - A[1]);

    /* ---------- the cover ---------- */
    W('titelbildgy10', function (box) {
        const Wd = 600, Ht = 850, X = x => (x + 3) / 9 * Wd, Y = y => (10 - y) / 13 * Ht;
        const path = (f, a, b, n = 180) => {
            let d = '';
            for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
            return d;
        };
        const glow = (d, c, dash) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.13" fill="none" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
        let grid = '';
        for (let x = -3; x <= 6; x++) grid += '<line x1="' + X(x) + '" y1="' + Y(5.8) + '" x2="' + X(x) + '" y2="' + Ht + '" />';
        for (let y = -3; y <= 5; y++) grid += '<line x1="0" y1="' + Y(y) + '" x2="' + Wd + '" y2="' + Y(y) + '" />';
        let art = '';
        // a general triangle with its circumcircle (the theorem of sines: a / sin α = 2r)
        const A = [-1.9, -1.75], Bq = [3.3, -1.75], C = [0.2, 1.35];
        const d2 = 2 * (A[0] * (Bq[1] - C[1]) + Bq[0] * (C[1] - A[1]) + C[0] * (A[1] - Bq[1]));
        const sq = P => P[0] * P[0] + P[1] * P[1];
        const M = [(sq(A) * (Bq[1] - C[1]) + sq(Bq) * (C[1] - A[1]) + sq(C) * (A[1] - Bq[1])) / d2, (sq(A) * (C[0] - Bq[0]) + sq(Bq) * (A[0] - C[0]) + sq(C) * (Bq[0] - A[0])) / d2];
        const r = Math.hypot(A[0] - M[0], A[1] - M[1]);
        art += '<ellipse cx="' + X(M[0]).toFixed(1) + '" cy="' + Y(M[1]).toFixed(1) + '" rx="' + (r / 9 * Wd).toFixed(1) + '" ry="' + (r / 13 * Ht).toFixed(1) + '" fill="none" stroke="#B8A4F2" stroke-opacity="0.38" stroke-width="2" stroke-dasharray="6 9"/>';
        const tri = 'M' + [A, Bq, C].map(P => X(P[0]).toFixed(1) + ' ' + Y(P[1]).toFixed(1)).join('L') + 'Z';
        art += '<path d="' + tri + '" fill="#A0C85A" fill-opacity="0.08" stroke="#A0C85A" stroke-width="12" stroke-opacity="0.12" stroke-linejoin="round"/>' +
            '<path d="' + tri + '" fill="none" stroke="#A0C85A" stroke-width="3.2" stroke-linejoin="round"/>';
        // a sequence that settles on its limit (dashed line)
        const lim = -0.4;
        art += '<line x1="' + X(-2.9) + '" y1="' + Y(lim) + '" x2="' + X(5.9) + '" y2="' + Y(lim) + '" stroke="#e8edf5" stroke-opacity="0.28" stroke-width="1.6" stroke-dasharray="4 8"/>';
        for (let n = 1; n <= 13; n++) {
            const x = -2.75 + 0.66 * (n - 1), y = lim + 2.1 * Math.pow(-0.72, n);
            art += '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="4.2" fill="#e8edf5" fill-opacity="' + (0.35 + 0.04 * n).toFixed(2) + '"/>';
        }
        // exponential growth and a sine wave
        art += glow(path(x => 0.22 * Math.pow(1.62, x + 1.2) - 2.6, -3, 5.7), '#7fd8ee', '7 9');
        art += glow(path(x => 1.05 * Math.sin(1.45 * x + 0.5) + 2.15, -3, 6), '#F5C242');
        // marked points lie exactly on their figures: the corners of the triangle and two crests of the wave
        [A, Bq, C].forEach(([x, y]) => { art += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="6" fill="#fff"/><circle cx="' + X(x) + '" cy="' + Y(y) + '" r="12" fill="#fff" fill-opacity="0.12"/>'; });
        [(Math.PI / 2 - 0.5) / 1.45, (Math.PI / 2 - 0.5 + 2 * Math.PI) / 1.45].forEach(x => {
            const y = 3.2; art += '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="6" fill="#fff"/><circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        });
        const id = 'tg' + (++uid);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="0.95" stop-color="#fff" stop-opacity="0.12"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.08" stroke-width="1">' + grid + '</g>' +
            '<line x1="0" y1="' + Y(0) + '" x2="' + Wd + '" y2="' + Y(0) + '" stroke="#7fd8ee" stroke-opacity="0.18" stroke-width="1.4"/>' + art + '</g></svg>';
    });

    /* ---------- decorative opener figure ---------- */
    W('dreieck-hero', function (box) {
        const m = box.dataset.motiv || 'dreieck';
        const g = new Geo(box, { x: [-0.6, 7.2], y: [-0.9, 4.4], height: +(box.dataset.h || 240), aria: box.dataset.aria || 'Dreieck' });
        if (m === 'vermessung') {
            // a baseline AB measured on the ground, the angles to a tower top C
            const A = [0, 0], Bp = [4.2, 0], C = [6.2, 3.6];
            g.draw([{ poly: [A, Bp, C], color: 'cyan', fill: 0.06, stroke: false }, { seg: [A, Bp], color: 'phi', width: 3 }, { seg: [A, C], color: 'cyan', width: 2, dash: true },
                { seg: [Bp, C], color: 'lambda', width: 2, dash: true }, { seg: [C, [6.2, 0]], color: 'white', width: 3 }, { seg: [[-0.4, 0], [7, 0]], color: 'dim', width: 1.2 },
                { arc: [A, Bp, C], color: 'violet', r: 34 }, { arc: [Bp, [7, 0], C], color: 'violet', r: 30 },
                { text: 'A', at: [0, -0.45] }, { text: 'B', at: [4.2, -0.45] }, { text: 'C', at: [6.55, 3.8] }, { text: '50 m', at: [2.1, 0.3], color: 'phi', size: 14 },
                { text: 'α', at: [1.1, 0.33], color: 'violet', italic: true }, { text: 'β', at: [5.15, 0.33], color: 'violet', italic: true }]);
        } else if (m === 'pyramide') {
            const P = (x, y, z) => [x + 0.42 * y, z + 0.32 * y];
            const a = 4.4, h = 3.6, s = a / 2, o = 1.4;
            const b1 = P(o - s + s, -s, 0), b2 = P(o + s + s, -s, 0), b3 = P(o + s + s, s, 0), b4 = P(o - s + s, s, 0), S = P(o + s, 0, h), Mm = P(o + s, 0, 0), F = P(o + s, -s, 0);
            g.draw([{ poly: [b1, b2, S], color: 'cyan', fill: 0.08, stroke: false }, { poly: [b2, b3, S], color: 'cyan', fill: 0.05, stroke: false },
                { seg: [b1, b2], color: 'cyan' }, { seg: [b2, b3], color: 'cyan' }, { seg: [b3, b4], color: 'cyan', dash: true }, { seg: [b4, b1], color: 'cyan', dash: true },
                { seg: [b1, S], color: 'cyan' }, { seg: [b2, S], color: 'cyan' }, { seg: [b3, S], color: 'cyan' }, { seg: [b4, S], color: 'cyan', dash: true },
                { poly: [S, Mm, F], color: 'lambda', fill: 0.2 }, { seg: [S, Mm], color: 'lambda', width: 2.6, dash: true }, { right: [Mm, S, F], color: 'lambda' },
                { text: 'h', at: [(S[0] + Mm[0]) / 2 - 0.28, (S[1] + Mm[1]) / 2], color: 'lambda', italic: true },
                { text: 'hₐ', at: [(S[0] + F[0]) / 2 + 0.34, (S[1] + F[1]) / 2], color: 'lambda', italic: true }]);
        } else {
            const A = [0, 0], Bp = [6.4, 0], C = [2.2, 3.7];
            const H = [2.2, 0];
            g.draw(triLayers(A, Bp, C, { r: 30 }).concat([{ seg: [C, H], color: 'white', dash: true, width: 1.6 }, { right: [H, Bp, C], color: 'white' },
                { text: 'h', at: [2.45, 1.4], color: 'white', italic: true }]));
        }
    });

    /* ---------- periodic measurements ---------- */
    // deterministic small wiggle so the curves look measured but stay the same on every load
    const wig = (t, k) => 0.6 * Math.sin(2.1 * t + k) + 0.4 * Math.sin(3.7 * t + 2 * k);
    const ECG = t => {                                              // one heartbeat per 0.8 s: P wave, QRS complex, T wave
        const u = ((t % 0.8) + 0.8) % 0.8, gs = (m, s, a) => a * Math.exp(-((u - m) ** 2) / (2 * s * s));
        return gs(0.12, 0.025, 0.15) + gs(0.235, 0.008, -0.12) + gs(0.255, 0.010, 1.1) + gs(0.278, 0.009, -0.25) + gs(0.48, 0.045, 0.3);
    };
    const MESS = {
        tide: { k: 'Ebbe und Flut', x: 't in h', y: 'Wasserstand in m', t: [0, 50], yr: [-2.4, 2.6], f: t => 1.55 * Math.sin(2 * Math.PI / 12.4 * (t - 2.3)) + 0.06 * wig(t, 1),
            m: [5.4, 17.8], say: 'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).', unit: 'h', yu: 'm' },
        rad: { k: 'Riesenrad', x: 't in min', y: 'Höhe in m', t: [0, 45], yr: [-2, 58], f: t => 27 - 25 * Math.cos(2 * Math.PI * t / 20),
            m: [10, 30], say: 'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.', unit: 'min', yu: 'm' },
        ekg: { k: 'EKG', x: 't in s', y: 'Spannung in mV', t: [0, 3.2], yr: [-0.5, 1.4], f: ECG, m: [0.255, 1.055],
            say: 'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.', unit: 's', yu: 'mV' },
        sonne: { k: 'Sonnenflecken', x: 'Jahr', y: 'Fleckenzahl', t: [1985, 2030], yr: [-10, 230], f: t => Math.max(2, 100 - 90 * Math.cos(2 * Math.PI * (t - 1986.7) / 11) + 12 * wig(t / 3, 2)),
            m: [1992.2, 2003.2], say: 'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).', unit: 'Jahre', yu: '' }
    };
    W('messkurve', function (box) {
        let key = box.dataset.start || 'tide', S = MESS[key];
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(MESS).map(k => [k, MESS[k].k]), key, v => { key = v; S = MESS[v]; load(); }, 'Messreihe');
        const auto = document.createElement('button'); auto.type = 'button'; auto.className = 'b-btn b-hintbtn'; auto.textContent = 'Marker auf zwei Hochpunkte'; ctl.appendChild(auto);
        const help = div(box, 'b-help');
        const p = new B.Plot(div(box, ''), { height: 300, aria: 'Messkurve mit zwei verschiebbaren Markern' });
        const out = div(box, 'b-out');
        const h = [{ x: 0, y: 0, color: 'lambda', fixY: true }, { x: 0, y: 0, color: 'cyan', fixY: true }];
        function peak(x) {                                          // the nearest crest of the curve around x
            const w = (S.t[1] - S.t[0]) / 40; let bx = x, by = -Infinity;
            for (let i = -60; i <= 60; i++) { const t = x + w * i / 30; if (t < S.t[0] || t > S.t[1]) continue; const y = S.f(t); if (y > by) { by = y; bx = t; } }
            return bx;
        }
        function load() {
            help.textContent = S.say;
            p.opt.xLabel = S.x; p.opt.yLabel = S.y; p.opt.xStep = null; p.opt.yStep = null;
            p.view(S.t, S.yr);
            h[0].x = S.m[0] - (S.t[1] - S.t[0]) * 0.03; h[1].x = S.m[1] + (S.t[1] - S.t[0]) * 0.04;
            p.handles(h, () => render());
            render();
        }
        function render() {
            h.forEach(q => { q.y = S.f(q.x); });
            let mx = -Infinity, mn = Infinity;
            for (let i = 0; i <= 2000; i++) { const y = S.f(S.t[0] + (S.t[1] - S.t[0]) * i / 2000); mx = Math.max(mx, y); mn = Math.min(mn, y); }
            p.draw([{ fn: S.f, color: 'phi', width: 2.2 }, { hline: mx, color: 'dim' }, { hline: mn, color: 'dim' }, { hline: (mx + mn) / 2, color: 'violet' },
                { vline: h[0].x, color: 'lambda' }, { vline: h[1].x, color: 'cyan' }]);
            const dt = Math.abs(h[1].x - h[0].x), dec = S.unit === 's' ? 2 : 1, pn = v => (v < 0 ? '(' + texNum(v, 2) + ')' : texNum(v, 2));
            out.innerHTML = '<p style="margin:0 0 6px">Abstand der Marker: <b>$' + texNum(dt, dec + 1) + '$ ' + S.unit + '</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.</p>' +
                '<p style="margin:0">Größter Wert $' + texNum(mx, 2) + '$, kleinster Wert $' + texNum(mn, 2) + '$ · <span style="color:#b8a4f2">Mittellage</span> $\\tfrac{' + texNum(mx, 2) + ' + ' + pn(mn) + '}{2} \\approx ' + texNum((mx + mn) / 2, 2) + '$ · Amplitude $\\tfrac{' + texNum(mx, 2) + ' - ' + pn(mn) + '}{2} \\approx ' + texNum((mx - mn) / 2, 2) + '$' + (S.yu ? ' ' + S.yu : '') + '</p>';
            math(out);
        }
        auto.addEventListener('click', () => { h[0].x = peak(S.m[0]); h[1].x = peak(S.m[1]); p.draw(); render(); });
        load();
    });

    /* ---------- theorem of sines ---------- */
    function circum(A, Bp, C) {
        const d = 2 * (A[0] * (Bp[1] - C[1]) + Bp[0] * (C[1] - A[1]) + C[0] * (A[1] - Bp[1]));
        const s = P => P[0] * P[0] + P[1] * P[1];
        const M = [(s(A) * (Bp[1] - C[1]) + s(Bp) * (C[1] - A[1]) + s(C) * (A[1] - Bp[1])) / d, (s(A) * (C[0] - Bp[0]) + s(Bp) * (A[0] - C[0]) + s(C) * (Bp[0] - A[0])) / d];
        return { M, r: dist(M, A) };
    }
    function foot(P, A, Bp) {                                       // foot of the perpendicular from P onto line AB
        const v = [Bp[0] - A[0], Bp[1] - A[1]], t = ((P[0] - A[0]) * v[0] + (P[1] - A[1]) * v[1]) / (v[0] * v[0] + v[1] * v[1]);
        return { F: [A[0] + t * v[0], A[1] + t * v[1]], t };
    }
    W('sinussatz', function (box) {
        const h = [{ x: -2.6, y: -1.4, snap: 0.1 }, { x: 3.4, y: -1.4, snap: 0.1 }, { x: 0.4, y: 2.2, snap: 0.1 }];
        let mode = box.dataset.mode || 'hoehe';
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['hoehe', 'Höhe $h_c$'], ['umkreis', 'Umkreis']], mode, v => { mode = v; render(); }, 'Hilfslinie');
        math(ctl);
        const g = new Geo(div(box, ''), { x: [-4.6, 5.4], y: [-2.6, 3.4], height: 340, aria: 'Dreieck mit verschiebbaren Ecken' });
        const out = div(box, 'b-out');
        const P = () => h.map(q => [q.x, q.y]);
        g.handles(h, () => {
            const [A, Bp, C] = P(), ok = Math.abs(area2(A, Bp, C)) > 0.6;   // no degenerate triangle
            if (ok) render();
            return ok;
        });
        const draw0 = L => g.draw(L);
        function render() {
            const [A, Bp, C] = P(), m = measure(A, Bp, C);
            const L = [];
            if (mode === 'hoehe') {
                const { F, t } = foot(C, A, Bp);
                if (t < 0 || t > 1) L.push({ seg: [t < 0 ? F : Bp, t < 0 ? A : F], color: 'dim', dash: true, width: 1.4 });
                L.push({ seg: [C, F], color: 'white', dash: true, width: 1.8 }, { right: [F, dist(F, A) > 0.01 ? A : Bp, C], color: 'white' },
                    { text: 'hc', at: [(C[0] + F[0]) / 2, (C[1] + F[1]) / 2], dx: 14, color: 'white', italic: true, size: 15 });
            } else {
                const { M, r } = circum(A, Bp, C);
                L.push({ circle: M, r, color: 'violet', width: 1.6, dash: true }, { dot: M, color: 'violet' }, { seg: [M, A], color: 'violet', width: 1.2 },
                    { text: 'r', at: [(M[0] + A[0]) / 2, (M[1] + A[1]) / 2], dy: -10, color: 'violet', italic: true });
            }
            draw0(triLayers(A, Bp, C).concat(L));
            const ra = m.a / Math.sin(m.al), rb = m.b / Math.sin(m.be), rc = m.c / Math.sin(m.ga);
            const hc = m.b * Math.sin(m.al);
            out.innerHTML = '<p style="margin:0 0 6px">$a = ' + texNum(m.a, 2) + '$, $b = ' + texNum(m.b, 2) + '$, $c = ' + texNum(m.c, 2) + '$, $\\alpha = ' + dg(m.al / RAD) + '$, $\\beta = ' + dg(m.be / RAD) + '$, $\\gamma = ' + dg(m.ga / RAD) + '$</p>' +
                '<p style="margin:0 0 6px">$\\dfrac{a}{\\sin\\alpha} = ' + texNum(ra, 2) + '$, &nbsp; $\\dfrac{b}{\\sin\\beta} = ' + texNum(rb, 2) + '$, &nbsp; $\\dfrac{c}{\\sin\\gamma} = ' + texNum(rc, 2) + '$</p>' +
                (mode === 'hoehe'
                    ? '<p style="margin:0">Die Höhe aus zwei Richtungen: $h_c = b \\cdot \\sin\\alpha = ' + texNum(m.b, 2) + ' \\cdot ' + texNum(Math.sin(m.al), 3) + ' \\approx ' + texNum(hc, 2) + '$ und $h_c = a \\cdot \\sin\\beta \\approx ' + texNum(m.a * Math.sin(m.be), 2) + '$. Gleichsetzen und teilen ergibt $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.</p>'
                    : '<p style="margin:0">Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ' + texNum(2 * circum(A, Bp, C).r, 2) + '$.</p>');
            math(out);
        }
        render();
    });

    /* ---------- theorem of cosines ---------- */
    W('kosinussatz', function (box) {
        const h = [{ x: -2, y: -1.3, snap: 0.1 }, { x: 2.6, y: -1.3, snap: 0.1 }, { x: -0.8, y: 1.9, snap: 0.1 }];
        const g = new Geo(div(box, ''), { x: [-6.6, 7.6], y: [-6.2, 6.8], height: 400, aria: 'Dreieck mit Quadraten über den drei Seiten' });
        const out = div(box, 'b-out');
        const P = () => h.map(q => [q.x, q.y]);
        g.handles(h, () => { const [A, Bp, C] = P(), ok = Math.abs(area2(A, Bp, C)) > 0.5; if (ok) render(); return ok; });
        const draw0 = L => g.draw(L);
        function square(P1, P2, G, color) {                         // the square on side P1P2, outside the triangle
            const v = [P2[0] - P1[0], P2[1] - P1[1]];
            let n = [-v[1], v[0]];
            const M = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2];
            if ((G[0] - M[0]) * n[0] + (G[1] - M[1]) * n[1] > 0) n = [-n[0], -n[1]];
            return { poly: [P1, P2, [P2[0] + n[0], P2[1] + n[1]], [P1[0] + n[0], P1[1] + n[1]]], color, fill: 0.12, width: 1.4 };
        }
        function render() {
            const [A, Bp, C] = P(), m = measure(A, Bp, C), G = [(A[0] + Bp[0] + C[0]) / 3, (A[1] + Bp[1] + C[1]) / 3];
            const L = [square(Bp, C, G, SIDE.a), square(C, A, G, SIDE.b), square(A, Bp, G, SIDE.c)];
            const right = Math.abs(m.ga / RAD - 90) < 0.5;
            draw0(L.concat(triLayers(A, Bp, C, { arcs: false })).concat(right ? [{ right: [C, A, Bp], color: 'violet' }] : [{ arc: [C, A, Bp], color: 'violet', r: 26 }]));
            const corr = 2 * m.a * m.b * Math.cos(m.ga);
            const a2 = m.a * m.a, b2 = m.b * m.b, c2 = m.c * m.c;
            out.innerHTML = '<p style="margin:0 0 6px">$a^2 = ' + texNum(a2, 2) + '$, $b^2 = ' + texNum(b2, 2) + '$, $c^2 = ' + texNum(c2, 2) + '$, $\\gamma = ' + dg(m.ga / RAD) + '$</p>' +
                '<p style="margin:0 0 6px">$c^2 = a^2 + b^2 - 2ab\\cos\\gamma = ' + texNum(a2 + b2, 2) + ' - ' + (corr < 0 ? '(' + texNum(corr, 2) + ')' : texNum(corr, 2)) + ' = ' + texNum(a2 + b2 - corr, 2) + '$</p>' +
                '<p style="margin:0">' + (right ? '$\\gamma = 90^\\circ$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.'
                    : m.ga < Math.PI / 2 ? '$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.'
                        : '$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.') + ' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.</p>';
            math(out);
        }
        render();
    });

    /* ---------- solving a triangle: which theorem when ---------- */
    const CASES = {
        sss: { k: 'SSS', say: 'drei Seiten', sl: [['a', 'Seite $a$', 2, 9, 0.1, 5], ['b', 'Seite $b$', 2, 9, 0.1, 6], ['c', 'Seite $c$', 2, 9, 0.1, 7]] },
        sws: { k: 'SWS', say: 'zwei Seiten und der eingeschlossene Winkel', sl: [['b', 'Seite $b$', 2, 9, 0.1, 5], ['c', 'Seite $c$', 2, 9, 0.1, 7], ['al', 'Winkel $\\alpha$', 5, 170, 1, 50]] },
        wsw: { k: 'WSW', say: 'eine Seite und die beiden anliegenden Winkel', sl: [['c', 'Seite $c$', 2, 9, 0.1, 7], ['al', 'Winkel $\\alpha$', 5, 170, 1, 45], ['be', 'Winkel $\\beta$', 5, 170, 1, 60]] },
        ssw: { k: 'SSW', say: 'zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', sl: [['a', 'Seite $a$', 1, 9, 0.1, 4.5], ['b', 'Seite $b$', 2, 9, 0.1, 6], ['al', 'Winkel $\\alpha$ (gegenüber von $a$)', 5, 170, 1, 40]] }
    };
    W('dreieckloeser', function (box) {
        let ck = box.dataset.start || 'sss';
        const V = {};
        const ctl = div(box, 'b-ctrls');
        seg(ctl, Object.keys(CASES).map(k => [k, CASES[k].k]), ck, v => { ck = v; build(); }, 'Gegeben');
        const help = div(box, 'b-help');
        const sl = div(box, '');
        const g = new Geo(div(box, ''), { x: [-1, 10], y: [-1, 6], height: 300, aria: 'Das berechnete Dreieck' });
        const out = div(box, 'b-out');
        function build() {
            const C0 = CASES[ck];
            help.innerHTML = 'Gegeben: ' + C0.say + '. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.';
            sl.innerHTML = '';
            C0.sl.forEach(([id, lab, mn, mx, st, v]) => {
                V[id] = v;
                range(sl, { label: lab, min: mn, max: mx, step: st, value: v, fmt: x => id.length === 2 ? x + '°' : fmt(x, 1), onInput: x => { V[id] = x; render(); } });
            });
            math(help); math(sl); render();
        }
        const T = x => texNum(x, 2), Dg = x => dg(x, 1);
        function render() {
            const steps = [], sols = [];
            let msg = '';
            if (ck === 'sss') {
                const { a, b, c } = V;
                if (a + b <= c || a + c <= b || b + c <= a) msg = 'Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).';
                else {
                    const al = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / RAD, be = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / RAD;
                    steps.push(['Kosinussatz', '\\cos\\alpha = \\dfrac{b^2 + c^2 - a^2}{2bc} = \\dfrac{' + T(b * b) + ' + ' + T(c * c) + ' - ' + T(a * a) + '}{' + T(2 * b * c) + '} \\Rightarrow \\alpha \\approx ' + Dg(al)]);
                    steps.push(['Kosinussatz', '\\cos\\beta = \\dfrac{a^2 + c^2 - b^2}{2ac} \\Rightarrow \\beta \\approx ' + Dg(be)]);
                    steps.push(['Winkelsumme', '\\gamma = 180^\\circ - \\alpha - \\beta \\approx ' + Dg(180 - al - be)]);
                    sols.push({ b, c, al });
                }
            } else if (ck === 'sws') {
                const { b, c, al } = V;
                const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(al * RAD));
                const be = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / RAD;
                steps.push(['Kosinussatz', 'a^2 = b^2 + c^2 - 2bc\\cos\\alpha = ' + T(b * b) + ' + ' + T(c * c) + ' - ' + T(2 * b * c) + ' \\cdot ' + texNum(Math.cos(al * RAD), 4) + ' \\Rightarrow a \\approx ' + T(a)]);
                steps.push(['Kosinussatz', '\\cos\\beta = \\dfrac{a^2 + c^2 - b^2}{2ac} \\Rightarrow \\beta \\approx ' + Dg(be)]);
                steps.push(['Winkelsumme', '\\gamma = 180^\\circ - \\alpha - \\beta \\approx ' + Dg(180 - al - be)]);
                sols.push({ b, c, al });
            } else if (ck === 'wsw') {
                const { c, al, be } = V;
                if (al + be >= 180) msg = 'Kein Dreieck: Die beiden Winkel sind zusammen schon $' + (al + be) + '^\\circ$, für $\\gamma$ bleibt nichts übrig.';
                else {
                    const ga = 180 - al - be, a = c * Math.sin(al * RAD) / Math.sin(ga * RAD), b = c * Math.sin(be * RAD) / Math.sin(ga * RAD);
                    steps.push(['Winkelsumme', '\\gamma = 180^\\circ - ' + al + '^\\circ - ' + be + '^\\circ = ' + Dg(ga)]);
                    steps.push(['Sinussatz', 'a = \\dfrac{c \\cdot \\sin\\alpha}{\\sin\\gamma} = \\dfrac{' + T(c) + ' \\cdot \\sin ' + al + '^\\circ}{\\sin ' + texNum(ga, 1) + '^\\circ} \\approx ' + T(a)]);
                    steps.push(['Sinussatz', 'b = \\dfrac{c \\cdot \\sin\\beta}{\\sin\\gamma} \\approx ' + T(b)]);
                    sols.push({ b, c, al });
                }
            } else {
                const { a, b, al } = V;
                const sb = b * Math.sin(al * RAD) / a;
                steps.push(['Sinussatz', '\\sin\\beta = \\dfrac{b \\cdot \\sin\\alpha}{a} = \\dfrac{' + T(b) + ' \\cdot \\sin ' + al + '^\\circ}{' + T(a) + '} \\approx ' + texNum(sb, 4)]);
                if (sb > 1 + 1e-9) msg = '$\\sin\\beta > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>';
                else {
                    const b1 = Math.asin(Math.min(1, sb)) / RAD, cand = [b1];
                    if (Math.abs(b1 - 90) > 1e-6) cand.push(180 - b1);
                    cand.forEach((be, i) => {
                        const ga = 180 - al - be;
                        if (ga <= 1e-6) { if (i) steps.push(['Winkelsumme', '\\beta_2 = 180^\\circ - ' + texNum(b1, 1) + '^\\circ = ' + Dg(be) + ': \\text{ zu groß, } \\alpha + \\beta_2 \\geq 180^\\circ']); return; }
                        const c = a * Math.sin(ga * RAD) / Math.sin(al * RAD);
                        const tag = cand.length > 1 ? '_' + (i + 1) : '';
                        steps.push(['Sinussatz', '\\beta' + tag + ' \\approx ' + Dg(be) + ',\\; \\gamma' + tag + ' \\approx ' + Dg(ga) + ',\\; c' + tag + ' = \\dfrac{a \\cdot \\sin\\gamma' + tag + '}{\\sin\\alpha} \\approx ' + T(c)]);
                        sols.push({ b, c, al });
                    });
                    msg = sols.length === 2 ? '<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (die gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).'
                        : sols.length === 1 ? (a >= b ? 'Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.' : 'Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.') : '';
                }
            }
            // draw: A at the origin, c along the x-axis
            const L = [], all = [[0, 0]];
            sols.forEach((s, i) => {
                const A = [0, 0], Bp = [s.c, 0], C = [s.b * Math.cos(s.al * RAD), s.b * Math.sin(s.al * RAD)];
                all.push(Bp, C);
                if (i === 0) L.push(...triLayers(A, Bp, C, { r: 22 }));
                else L.push({ poly: [A, Bp, C], color: 'violet', fill: 0.08, dash: true, width: 2 }, { text: 'B₂', at: [Bp[0], Bp[1] - 0.45], color: 'violet' }, { text: 'c₂', at: [Bp[0] / 2, -0.35], color: 'violet', italic: true });
            });
            const xs = all.map(q => q[0]), ys = all.map(q => q[1]);
            g.view([Math.min(...xs) - 1, Math.max(...xs) + 1], [Math.min(...ys) - 0.9, Math.max(...ys) + 0.9]);
            g.draw(L);
            out.innerHTML = steps.map(([k, t]) => '<p style="margin:0 0 6px"><span class="tg-step">' + k.toUpperCase() + '</span> $' + t + '$</p>').join('') + (msg ? '<p style="margin:0">' + msg + '</p>' : '');
            math(out);
        }
        build();
    });

    /* ---------- area of a triangle ---------- */
    W('dreiecksflaeche', function (box) {
        const S = { a: 6, b: 4, ga: 50 };
        const sl = div(box, '');
        range(sl, { label: 'Seite $a$', min: 1, max: 8, step: 0.1, value: S.a, fmt: v => fmt(v, 1), onInput: v => { S.a = v; render(); } });
        range(sl, { label: 'Seite $b$', min: 1, max: 6, step: 0.1, value: S.b, fmt: v => fmt(v, 1), onInput: v => { S.b = v; render(); } });
        range(sl, { label: 'eingeschlossener Winkel $\\gamma$', min: 1, max: 179, step: 1, value: S.ga, fmt: v => v + '°', onInput: v => { S.ga = v; render(); } });
        math(sl);
        const g = new Geo(div(box, ''), { x: [-6.4, 8.6], y: [-0.9, 6.4], height: 300, aria: 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel' });
        const out = div(box, 'b-out');
        function render() {
            const { a, b, ga } = S, C = [0, 0], Bp = [a, 0], A = [b * Math.cos(ga * RAD), b * Math.sin(ga * RAD)], H = [A[0], 0];
            const L = [];
            if (A[0] < 0 || A[0] > a) L.push({ seg: [A[0] < 0 ? H : Bp, A[0] < 0 ? C : H], color: 'dim', dash: true, width: 1.4 });
            L.push({ seg: [A, H], color: 'white', dash: true, width: 1.8 }, { right: [H, Math.abs(H[0]) > 0.05 ? C : Bp, A], color: 'white' },
                { text: 'h', at: [A[0], A[1] / 2], dx: 12, color: 'white', italic: true });
            g.draw(triLayers(A, Bp, C, { names: ['A', 'B', 'C'], arcs: false }).concat([{ arc: [C, Bp, A], color: 'violet', r: 30 }, { text: 'γ', at: C, dx: 44, dy: -14, color: 'violet', italic: true }]).concat(L));
            const Ar = 0.5 * a * b * Math.sin(ga * RAD);
            out.innerHTML = '<p style="margin:0 0 6px">Höhe $h = b \\cdot \\sin\\gamma = ' + texNum(b, 1) + ' \\cdot \\sin ' + ga + '^\\circ \\approx ' + texNum(b * Math.sin(ga * RAD), 2) + '$</p>' +
                '<p style="margin:0">$A = \\tfrac12 \\cdot a \\cdot h = \\tfrac12 \\cdot a \\cdot b \\cdot \\sin\\gamma = \\tfrac12 \\cdot ' + texNum(a, 1) + ' \\cdot ' + texNum(b, 1) + ' \\cdot \\sin ' + ga + '^\\circ \\approx ' + texNum(Ar, 2) + '$ Flächeneinheiten' +
                (ga === 90 ? ' · Bei $90^\\circ$ ist die Fläche am größten.' : ' · Derselbe Flächeninhalt bei $' + (180 - ga) + '^\\circ$, denn $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.') + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- the tangent function ---------- */
    W('tangensfunktion', function (box) {
        let deg = 50;
        const sl = div(box, '');
        range(sl, { label: 'Winkel $\\alpha$', min: 0, max: 360, step: 1, value: deg, fmt: v => v + '°', onInput: v => { deg = v; render(); } });
        math(sl);
        const two = div(box, 'b-two');
        const g = new Geo(div(two, ''), { x: [-1.25, 1.55], y: [-2.3, 2.3], height: 300, aria: 'Einheitskreis mit Tangente an der Stelle 1' });
        const p = new B.Plot(div(two, ''), { x: [-0.3, 2 * Math.PI + 0.3], y: [-4, 4], height: 300, piX: true, aria: 'Graph der Tangensfunktion mit Polstellen' });
        const out = div(box, 'b-out');
        function render() {
            const a = deg * RAD, c = Math.cos(a), s = Math.sin(a), pole = Math.abs(c) < 1e-9, t = s / c;
            const ring = []; for (let i = 0; i <= 72; i++) ring.push([Math.cos(i / 72 * 2 * Math.PI), Math.sin(i / 72 * 2 * Math.PI)]);
            const L = [{ seg: [[-1.2, 0], [1.5, 0]], color: 'dim', width: 1 }, { seg: [[0, -2.25], [0, 2.25]], color: 'dim', width: 1 }, { path: ring, color: 'cyan', width: 1.6 },
                { seg: [[1, -2.25], [1, 2.25]], color: 'dim', width: 1.4, dash: true }, { arc: [[0, 0], [1, 0], [c, s]], color: 'phi', r: 22 }];
            if (!pole) {
                const T0 = [1, Math.max(-2.25, Math.min(2.25, t))];
                L.push({ seg: c > 0 ? [[0, 0], T0] : [[c, s], T0], color: 'white', width: 1.4, dash: c < 0 });
                L.push({ seg: [[1, 0], T0], color: 'lambda', width: 3.4 });
                if (Math.abs(t) <= 2.25) L.push({ dot: [1, t], color: 'lambda' }, { text: 'tan α', at: [1, t / 2], dx: 30, color: 'lambda', italic: true, size: 14 });
            }
            L.push({ seg: [[0, 0], [c, s]], color: 'white', width: 2 }, { seg: [[c, 0], [c, s]], color: 'lambda', width: 1.4, dash: true }, { dot: [c, s], color: 'white' });
            g.draw(L);
            const PL = [{ fn: Math.tan, color: 'lambda' }, { vline: Math.PI / 2 }, { vline: 3 * Math.PI / 2 }, { fn: Math.sin, color: 'dim', dash: true, width: 1.2 }];
            if (!pole) PL.push({ pts: [[a, t]], color: 'white', r: 6 });
            p.draw(PL);
            out.innerHTML = pole
                ? '$\\alpha = ' + deg + '^\\circ$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\tan\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.'
                : '$\\tan ' + deg + '^\\circ = \\dfrac{\\sin ' + deg + '^\\circ}{\\cos ' + deg + '^\\circ} = \\dfrac{' + texNum(s, 4) + '}{' + texNum(c, 4) + '} \\approx ' + texNum(t, 3) + '$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$' + (t < 0 ? ' (nach unten, also negativ)' : '') + '.';
            math(out);
        }
        render();
    });

    /* ---------- pyramid and cone ---------- */
    W('pyramidekegel', function (box) {
        const S = { form: box.dataset.form || 'pyr', a: 6, h: 5, tri: 'ha' };
        const ctl = div(box, 'b-ctrls');
        seg(ctl, [['pyr', 'Quadratische Pyramide'], ['kegel', 'Kegel']], S.form, v => { S.form = v; S.tri = v === 'pyr' ? 'ha' : 's'; build(); render(); }, 'Körper');
        const ctl2 = div(box, 'b-ctrls');
        const sl = div(box, '');
        const svgBox = div(box, 'b-svgbox tg-svg');
        const out = div(box, 'b-out');
        function build() {
            ctl2.innerHTML = '';
            if (S.form === 'pyr') seg(ctl2, [['ha', 'Höhe – Seitenhöhe'], ['s', 'Höhe – Seitenkante']], S.tri, v => { S.tri = v; render(); }, 'Rechtwinkliges Dreieck');
            else seg(ctl2, [['s', 'Höhe – Mantellinie']], 's', () => render(), 'Rechtwinkliges Dreieck');
            sl.innerHTML = '';
            range(sl, { label: S.form === 'pyr' ? 'Grundkante $a$' : 'Radius $r$', min: 1, max: S.form === 'pyr' ? 10 : 5, step: 0.5, value: S.form === 'pyr' ? S.a : Math.min(S.a / 2, 5), fmt: v => fmt(v, 1), onInput: v => { S.a = S.form === 'pyr' ? v : 2 * v; render(); } });
            range(sl, { label: 'Höhe $h$', min: 1, max: 10, step: 0.5, value: S.h, fmt: v => fmt(v, 1), onInput: v => { S.h = v; render(); } });
            if (S.form === 'kegel') S.a = Math.min(S.a, 10);
            math(sl);
        }
        function render() {
            const pyr = S.form === 'pyr', a = S.a, r = a / 2, h = S.h;
            // oblique view: depth y goes up and to the right
            const q = pyr ? 0.45 : 0.0, d = pyr ? 0.3 : 0.3;
            const P0 = (x, y, z) => [x + q * y, -(z + d * y)];
            // fit the body into the picture: bounding box of the base and the apex, then scale and centre
            const ext = [P0(-r, -r, 0), P0(r, -r, 0), P0(r, r, 0), P0(-r, r, 0), P0(0, 0, h)];
            const bx = ext.map(v => v[0]), by = ext.map(v => v[1]);
            const k = Math.min(34, 380 / (Math.max(...bx) - Math.min(...bx)), 250 / (Math.max(...by) - Math.min(...by)));
            const ox = 260 - k * (Math.max(...bx) + Math.min(...bx)) / 2, oy = 160 - k * (Math.max(...by) + Math.min(...by)) / 2;
            const P = (x, y, z) => { const v = P0(x, y, z); return [ox + k * v[0], oy + k * v[1]]; };
            const pt = v => v[0].toFixed(1) + ',' + v[1].toFixed(1);
            const line = (u, v, cls, dash) => '<line class="' + cls + '" x1="' + u[0].toFixed(1) + '" y1="' + u[1].toFixed(1) + '" x2="' + v[0].toFixed(1) + '" y2="' + v[1].toFixed(1) + '"' + (dash ? ' stroke-dasharray="6 5"' : '') + '/>';
            const txt = (v, s, cls, dx = 0, dy = 0) => '<text class="' + cls + '" x="' + (v[0] + dx).toFixed(1) + '" y="' + (v[1] + dy).toFixed(1) + '" text-anchor="middle">' + s + '</text>';
            let s = '<svg viewBox="0 0 520 330" role="img" aria-label="' + (pyr ? 'Schrägbild einer quadratischen Pyramide' : 'Schrägbild eines Kegels') + ' mit einem rechtwinkligen Dreieck">';
            const Sp = P(0, 0, h), M = P(0, 0, 0);
            let F, rows;
            if (pyr) {
                const c1 = P(-r, -r, 0), c2 = P(r, -r, 0), c3 = P(r, r, 0), c4 = P(-r, r, 0);
                s += '<polygon class="tg-face" points="' + [c1, c2, Sp].map(pt).join(' ') + '"/><polygon class="tg-face tg-face2" points="' + [c2, c3, Sp].map(pt).join(' ') + '"/>';
                s += line(c1, c2, 'tg-edge') + line(c2, c3, 'tg-edge') + line(c3, c4, 'tg-edge', true) + line(c4, c1, 'tg-edge', true) +
                    line(c1, Sp, 'tg-edge') + line(c2, Sp, 'tg-edge') + line(c3, Sp, 'tg-edge') + line(c4, Sp, 'tg-edge', true) + line(c1, c3, 'tg-aux', true) + line(c2, c4, 'tg-aux', true);
                F = S.tri === 'ha' ? P(0, -r, 0) : c2;
                const ha = Math.hypot(h, r), sk = Math.hypot(h, r * Math.SQRT2);
                rows = S.tri === 'ha'
                    ? ['Seitenhöhe $h_a = \\sqrt{h^2 + \\left(\\tfrac{a}{2}\\right)^2} = \\sqrt{' + texNum(h * h, 2) + ' + ' + texNum(r * r, 2) + '} \\approx ' + texNum(ha, 2) + '$',
                        'Neigungswinkel der Seitenfläche: $\\tan\\varepsilon = \\dfrac{h}{a/2} = \\dfrac{' + texNum(h, 1) + '}{' + texNum(r, 2) + '} \\Rightarrow \\varepsilon \\approx ' + dg(Math.atan(h / r) / RAD) + '$']
                    : ['Seitenkante $s = \\sqrt{h^2 + \\left(\\tfrac{d}{2}\\right)^2}$ mit der Diagonale $d = a\\sqrt2 \\approx ' + texNum(a * Math.SQRT2, 2) + '$: $s \\approx ' + texNum(sk, 2) + '$',
                        'Neigungswinkel der Seitenkante: $\\tan\\varphi = \\dfrac{h}{d/2} \\Rightarrow \\varphi \\approx ' + dg(Math.atan(h / (r * Math.SQRT2)) / RAD) + '$'];
                rows.push('Volumen $V = \\tfrac13 a^2 h = \\tfrac13 \\cdot ' + texNum(a * a, 2) + ' \\cdot ' + texNum(h, 1) + ' \\approx ' + texNum(a * a * h / 3, 2) + '$ · Oberfläche $O = a^2 + 4 \\cdot \\tfrac12 a h_a = a^2 + 2a\\,h_a \\approx ' + texNum(a * a + 2 * a * ha, 2) + '$');
            } else {
                // front half solid, back half dashed (points with y > 0 lie behind)
                const front = []; for (let i = 36; i <= 72; i++) { const t = i / 72 * 2 * Math.PI; front.push(P(r * Math.cos(t), r * Math.sin(t), 0)); }
                const rear = []; for (let i = 0; i <= 36; i++) { const t = i / 72 * 2 * Math.PI; rear.push(P(r * Math.cos(t), r * Math.sin(t), 0)); }
                s += '<polygon class="tg-face" points="' + [P(-r, 0, 0)].concat(front, [P(r, 0, 0), Sp]).map(pt).join(' ') + '"/>';
                s += '<polyline class="tg-edge" fill="none" points="' + front.map(pt).join(' ') + '"/><polyline class="tg-edge" fill="none" stroke-dasharray="6 5" points="' + rear.map(pt).join(' ') + '"/>';
                s += line(P(-r, 0, 0), Sp, 'tg-edge') + line(P(r, 0, 0), Sp, 'tg-edge');
                F = P(r, 0, 0);
                const sm = Math.hypot(h, r);
                rows = ['Mantellinie $s = \\sqrt{h^2 + r^2} = \\sqrt{' + texNum(h * h, 2) + ' + ' + texNum(r * r, 2) + '} \\approx ' + texNum(sm, 2) + '$',
                    'halber Öffnungswinkel: $\\tan\\delta = \\dfrac{r}{h} \\Rightarrow \\delta \\approx ' + dg(Math.atan(r / h) / RAD) + '$ · Öffnungswinkel $2\\delta \\approx ' + dg(2 * Math.atan(r / h) / RAD) + '$',
                    'Volumen $V = \\tfrac13 \\pi r^2 h \\approx ' + texNum(Math.PI * r * r * h / 3, 2) + '$ · Mantel $M = \\pi r s \\approx ' + texNum(Math.PI * r * sm, 2) + '$ · Oberfläche $O = \\pi r^2 + \\pi r s \\approx ' + texNum(Math.PI * r * r + Math.PI * r * sm, 2) + '$'];
            }
            // the right triangle: apex, foot of the height, point on the base
            s += '<polygon class="tg-tri" points="' + [Sp, M, F].map(pt).join(' ') + '"/>' + line(Sp, M, 'tg-h') + line(M, F, 'tg-h') + line(Sp, F, 'tg-h');
            const u = [Sp[0] - M[0], Sp[1] - M[1]], v = [F[0] - M[0], F[1] - M[1]], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]), m = 11;
            const ra = [M[0] + u[0] / lu * m, M[1] + u[1] / lu * m], rb = [M[0] + v[0] / lv * m, M[1] + v[1] / lv * m];
            s += '<polyline class="tg-h" fill="none" points="' + pt(ra) + ' ' + pt([ra[0] + rb[0] - M[0], ra[1] + rb[1] - M[1]]) + ' ' + pt(rb) + '"/>';
            const side = F[0] < M[0] ? -1 : 1;                     // the slanted side lies left or right of the height
            s += txt([(Sp[0] + M[0]) / 2, (Sp[1] + M[1]) / 2], 'h', 'tg-lab', -side * 13, 4) + txt([(M[0] + F[0]) / 2, (M[1] + F[1]) / 2], pyr ? (S.tri === 'ha' ? 'a/2' : 'd/2') : 'r', 'tg-lab', side * 10, 25) +
                txt([(Sp[0] + F[0]) / 2, (Sp[1] + F[1]) / 2], pyr ? (S.tri === 'ha' ? 'hₐ' : 's') : 's', 'tg-lab', side * 16, 0) + '<circle class="tg-dot" cx="' + Sp[0].toFixed(1) + '" cy="' + Sp[1].toFixed(1) + '" r="4"/>' + txt(Sp, 'S', 'tg-name', 0, -12);
            svgBox.innerHTML = s + '</svg>';
            out.innerHTML = rows.map(t => '<p style="margin:0 0 6px">' + t + '</p>').join('');
            math(out);
        }
        build(); render();
    });
})();
