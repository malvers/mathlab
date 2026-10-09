/* buch-plot.js — one function plotter for every chapter of the textbook (js/buch.js).
 *
 *   const p = new Buch.Plot(box, { x: [-5, 5], y: [-3, 3], height: 320, piX: false });
 *   p.draw([
 *     { fn: x => x * x, color: 'lambda', label: 'f' },               // graph (breaks at poles by itself)
 *     { pts: [[1, 1], [2, 4]], color: 'cyan' },                      // points
 *     { seg: [[0, 0], [2, 4]], color: 'dim', dash: true },          // segment
 *     { hline: 1 }, { vline: 2 },                                    // helper lines
 *     { area: x => x * x, from: 0, to: 2, color: 'lambda' },         // area under a graph
 *     { rects: [[x0, x1, h], …], color: 'cyan' },                    // bars (Riemann sums)
 *     { text: 'S', at: [1, 2], color: 'white' }                      // label
 *   ]);
 *   p.handles([{ x: 1, y: 2, color: 'lambda' }], (i, x, y) => …)     // draggable points
 *
 * Colours are names of the book palette (lambda, cyan, phi, red, violet, white, dim) or any CSS colour.
 * The drawing scales with the box and the device pixel ratio and redraws itself on resize.
 */
(function () {
    'use strict';
    const C = {
        lambda: 'rgb(245,194,66)', cyan: '#7fd8ee', phi: 'rgb(160,200,90)', red: '#e2665a',
        violet: '#b8a4f2', white: '#e8edf5', dim: '#6d8199', blue: '#5aa8f0', pink: '#e682be'
    };
    const col = c => C[c] || c || C.lambda;
    const FONT = '"Lab Ziffern", Raleway, system-ui, sans-serif';

    function niceStep(range, target) {
        const raw = range / target, mag = Math.pow(10, Math.floor(Math.log10(raw)));
        return [1, 2, 5, 10].map(f => f * mag).find(s => s >= raw) || raw;
    }
    function num(v) {
        const r = Math.round(v * 1e6) / 1e6;
        return String(r).replace('.', ',').replace('-', '−');
    }
    function piLabel(k) {   // k = multiple of π/2
        if (k === 0) return '0';
        const n = k, sign = n < 0 ? '−' : '', a = Math.abs(n);
        if (a % 2 === 0) return sign + (a / 2 === 1 ? '' : a / 2) + 'π';
        return sign + (a === 1 ? '' : a) + 'π/2';
    }

    class Plot {
        constructor(box, opt = {}) {
            this.opt = Object.assign({ x: [-5, 5], y: [-5, 5], height: 320, grid: true, piX: false, xLabel: 'x', yLabel: 'y', equal: false }, opt);
            this.box = document.createElement('div');
            this.box.className = 'b-canvasbox';
            this.box.style.height = this.opt.height + 'px';
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('role', 'img');
            this.canvas.setAttribute('aria-label', opt.aria || 'Funktionsgraph');
            this.box.appendChild(this.canvas);
            box.appendChild(this.box);
            this.ctx = this.canvas.getContext('2d');
            this.layers = [];
            this.hs = null;
            const redraw = () => this.draw(this.layers);
            addEventListener('resize', redraw);
            if (window.ResizeObserver) new ResizeObserver(redraw).observe(this.box);
            this._dragSetup();
        }
        view(x, y) { if (x) this.opt.x = x; if (y) this.opt.y = y; }
        // world ↔ pixel
        _frame() {
            const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            let [x0, x1] = this.opt.x, [y0, y1] = this.opt.y;
            if (this.opt.equal && w && h) {   // same unit on both axes, centred on the given y-range
                const sx = w / (x1 - x0), ym = (y0 + y1) / 2, half = h / sx / 2;
                y0 = ym - half; y1 = ym + half;
            }
            this.f = { w, h, x0, x1, y0, y1 };
            return this.f;
        }
        X(x) { const f = this.f; return (x - f.x0) / (f.x1 - f.x0) * f.w; }
        Y(y) { const f = this.f; return f.h - (y - f.y0) / (f.y1 - f.y0) * f.h; }
        ix(px) { const f = this.f; return f.x0 + px / f.w * (f.x1 - f.x0); }
        iy(py) { const f = this.f; return f.y0 + (f.h - py) / f.h * (f.y1 - f.y0); }

        draw(layers) {
            if (layers) this.layers = layers;
            const dpr = window.devicePixelRatio || 1, cv = this.canvas, ctx = this.ctx;
            const fr = this._frame();
            if (!fr.w || !fr.h) return;
            cv.width = Math.round(fr.w * dpr); cv.height = Math.round(fr.h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, fr.w, fr.h);
            this._axes();
            for (const L of this.layers) this._layer(L);
            if (this.hs) this.hs.forEach(h => this._dot(h.x, h.y, col(h.color), 7, true));
        }
        _axes() {
            const ctx = this.ctx, { w, h, x0, x1, y0, y1 } = this.f, o = this.opt;
            ctx.font = '13px ' + FONT; ctx.lineWidth = 1;
            const sx = o.xStep || (o.piX ? Math.PI / 2 : niceStep(x1 - x0, w / 70));
            const sy = o.yStep || niceStep(y1 - y0, h / 45);
            const ax = Math.min(Math.max(this.Y(0), 0), h), ay = Math.min(Math.max(this.X(0), 0), w);
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            for (let k = Math.ceil(x0 / sx); k * sx <= x1 + 1e-9; k++) {
                const px = this.X(k * sx);
                if (o.grid) { ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke(); }
                if (k !== 0) {
                    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.moveTo(px, ax - 4); ctx.lineTo(px, ax + 4); ctx.stroke();
                    ctx.fillStyle = '#8fa3bd';
                    const lab = o.piX ? piLabel(k) : num(k * sx);
                    // no number cut off at the edge or under the axis name
                    const half = ctx.measureText(lab).width / 2;
                    if (px - half > 2 && px + half < w - 8 - ctx.measureText(o.xLabel).width) ctx.fillText(lab, px, Math.min(ax + 7, h - 16));
                }
            }
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            for (let k = Math.ceil(y0 / sy); k * sy <= y1 + 1e-9; k++) {
                const py = this.Y(k * sy);
                if (o.grid) { ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke(); }
                if (k !== 0) {
                    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.moveTo(ay - 4, py); ctx.lineTo(ay + 4, py); ctx.stroke();
                    ctx.fillStyle = '#8fa3bd';
                    ctx.textAlign = ay < 40 ? 'left' : 'right';
                    if (py > 22 && py < h - 8) ctx.fillText(num(k * sy), ay < 40 ? ay + 8 : ay - 8, py);
                }
            }
            // axes with arrows
            ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(0, ax); ctx.lineTo(w, ax); ctx.moveTo(ay, 0); ctx.lineTo(ay, h); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.beginPath(); ctx.moveTo(w, ax); ctx.lineTo(w - 9, ax - 4); ctx.lineTo(w - 9, ax + 4); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ay, 0); ctx.lineTo(ay - 4, 9); ctx.lineTo(ay + 4, 9); ctx.fill();
            ctx.fillStyle = '#8fa3bd'; ctx.font = 'italic 14px ' + FONT;
            ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xLabel, w - 4, ax - 6);
            ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(o.yLabel, ay + 8, 2);
        }
        _dot(x, y, c, r = 4.5, ring = false) {
            const ctx = this.ctx, px = this.X(x), py = this.Y(y);
            ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
            if (ring) { ctx.strokeStyle = '#0a1426'; ctx.lineWidth = 2; ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, r + 4, 0, Math.PI * 2); ctx.stroke(); }
        }
        _layer(L) {
            const ctx = this.ctx, { w, h, x0, x1 } = this.f;
            const c = col(L.color);
            ctx.setLineDash(L.dash ? [6, 5] : []);
            if (L.fn) {
                ctx.strokeStyle = c; ctx.lineWidth = L.width || 2.6; ctx.lineJoin = 'round';
                const a = L.domain ? Math.max(L.domain[0], x0) : x0, b = L.domain ? Math.min(L.domain[1], x1) : x1;
                const n = Math.max(2, Math.ceil(this.X(b) - this.X(a)) * 2);
                ctx.beginPath();
                let pen = false, prevPy = 0;
                for (let i = 0; i <= n; i++) {
                    const x = a + (b - a) * i / n, y = L.fn(x);
                    if (!isFinite(y)) { pen = false; continue; }
                    const px = this.X(x), py = this.Y(y);
                    if (pen && Math.abs(py - prevPy) > h * 1.5) pen = false;          // pole: lift the pen
                    if (py < -h * 3 || py > h * 4) { pen = false; prevPy = py; continue; }
                    pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
                    pen = true; prevPy = py;
                }
                ctx.stroke();
                if (L.label) {
                    const lx = L.labelAt != null ? L.labelAt : x0 + (x1 - x0) * 0.86, ly = L.fn(lx);
                    if (isFinite(ly)) {
                        ctx.setLineDash([]); ctx.font = 'italic 600 15px ' + FONT; ctx.fillStyle = c;
                        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
                        ctx.fillText(L.label, this.X(lx) + 6, Math.min(Math.max(this.Y(ly) - 6, 16), h - 4));
                    }
                }
            }
            if (L.area) {
                ctx.fillStyle = L.fill || c.replace('rgb(', 'rgba(').replace(')', ',0.22)');
                if (c.startsWith('#')) ctx.globalAlpha = 0.22;
                const n = 200; ctx.beginPath(); ctx.moveTo(this.X(L.from), this.Y(0));
                for (let i = 0; i <= n; i++) { const x = L.from + (L.to - L.from) * i / n; ctx.lineTo(this.X(x), this.Y(L.area(x))); }
                ctx.lineTo(this.X(L.to), this.Y(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
            }
            if (L.rects) {
                L.rects.forEach(([a, b, hh]) => {
                    const px0 = this.X(a), px1 = this.X(b), py = this.Y(hh), p0 = this.Y(0);
                    ctx.globalAlpha = 0.2; ctx.fillStyle = c; ctx.fillRect(px0, Math.min(py, p0), px1 - px0, Math.abs(p0 - py));
                    ctx.globalAlpha = 0.85; ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.strokeRect(px0, Math.min(py, p0), px1 - px0, Math.abs(p0 - py));
                    ctx.globalAlpha = 1;
                });
            }
            if (L.polys) {   // filled polygons in world coordinates (trapezoids)
                L.polys.forEach(poly => {
                    ctx.beginPath(); poly.forEach(([x, y], i) => i ? ctx.lineTo(this.X(x), this.Y(y)) : ctx.moveTo(this.X(x), this.Y(y)));
                    ctx.closePath(); ctx.globalAlpha = 0.2; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 0.85; ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
                });
            }
            if (L.seg) {
                ctx.strokeStyle = c; ctx.lineWidth = L.width || 1.6;
                ctx.beginPath(); ctx.moveTo(this.X(L.seg[0][0]), this.Y(L.seg[0][1])); ctx.lineTo(this.X(L.seg[1][0]), this.Y(L.seg[1][1])); ctx.stroke();
            }
            if (L.hline != null) { ctx.strokeStyle = L.color ? c : 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(0, this.Y(L.hline)); ctx.lineTo(w, this.Y(L.hline)); ctx.stroke(); }
            if (L.vline != null) { ctx.strokeStyle = L.color ? c : 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(this.X(L.vline), 0); ctx.lineTo(this.X(L.vline), h); ctx.stroke(); }
            ctx.setLineDash([]);
            if (L.pts) L.pts.forEach(p => this._dot(p[0], p[1], p[2] ? col(p[2]) : c, L.r || 4.5));
            if (L.text) {
                ctx.font = (L.italic === false ? '' : 'italic ') + '600 15px ' + FONT; ctx.fillStyle = c;
                ctx.textAlign = L.align || 'left'; ctx.textBaseline = 'bottom';
                ctx.fillText(L.text, this.X(L.at[0]) + (L.dx || 6), this.Y(L.at[1]) + (L.dy || -6));
            }
        }
        // draggable points: list [{x, y, color, fixX, fixY, snap}], callback(i, x, y)
        handles(list, onMove) { this.hs = list; this.onMove = onMove; this.draw(); }
        _dragSetup() {
            const cv = this.canvas;
            cv.style.touchAction = 'pan-y';
            let drag = -1;
            const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
            cv.addEventListener('pointerdown', e => {
                if (!this.hs) return;
                const [px, py] = pos(e);
                drag = this.hs.findIndex(h => Math.hypot(this.X(h.x) - px, this.Y(h.y) - py) < 20);
                if (drag >= 0) { cv.setPointerCapture(e.pointerId); cv.style.touchAction = 'none'; e.preventDefault(); }
            });
            cv.addEventListener('pointermove', e => {
                if (!this.hs) return;
                const [px, py] = pos(e);
                if (drag < 0) { cv.style.cursor = this.hs.some(h => Math.hypot(this.X(h.x) - px, this.Y(h.y) - py) < 20) ? 'grab' : ''; return; }
                const h = this.hs[drag], s = h.snap || 0;
                let x = this.ix(px), y = this.iy(py);
                if (s) { x = Math.round(x / s) * s; y = Math.round(y / s) * s; }
                if (!h.fixX) h.x = Math.min(Math.max(x, this.f.x0), this.f.x1);
                if (!h.fixY) h.y = Math.min(Math.max(y, this.f.y0), this.f.y1);
                if (this.onMove) this.onMove(drag, h.x, h.y);
                this.draw();
            });
            const end = () => { drag = -1; cv.style.touchAction = 'pan-y'; };
            cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
        }
    }

    window.Buch.Plot = Plot;
    window.Buch.color = col;
})();
