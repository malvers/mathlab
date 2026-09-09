/* vektoren-core.js — shared engine for the Vektoren lab.
 *
 * Holds everything the eleven modules have in common: vector maths, a 2D canvas
 * stage with draggable points, a three.js stage for the 3D chapters, KaTeX
 * helpers and the exercise accordion. A module (vektoren-mod-*.js) registers
 * itself with VekLab.register() and never touches the shell directly.
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------
    // Palette (project colours)
    // ------------------------------------------------------------------
    const COL = {
        orange: 'rgb(245, 194, 66)',
        red: 'rgb(176, 36, 24)',
        green: 'rgb(121, 158, 49)',
        blue: '#00d2ff',
        purple: '#a86cff',
        pink: '#ff4fa3',
        grey: '#8a97ad',
        axis: 'rgba(255, 255, 255, 0.45)',
        grid: 'rgba(255, 255, 255, 0.07)',
        gridBold: 'rgba(255, 255, 255, 0.14)',
    };

    // ------------------------------------------------------------------
    // Vector maths — arrays of 2 or 3 numbers, dimension-agnostic where it can be
    // ------------------------------------------------------------------
    const V = {
        add: (a, b) => a.map((x, i) => x + b[i]),
        sub: (a, b) => a.map((x, i) => x - b[i]),
        neg: a => a.map(x => -x),
        scale: (a, s) => a.map(x => x * s),
        dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0),
        len: a => Math.hypot(...a),
        len2: a => a.reduce((s, x) => s + x * x, 0),
        dist: (a, b) => Math.hypot(...a.map((x, i) => x - b[i])),
        /** Unit vector; the zero vector has no direction and is returned unchanged. */
        unit: a => { const l = Math.hypot(...a); return l < 1e-12 ? a.slice() : a.map(x => x / l); },
        /** Cross product. In 2D it degenerates to the scalar z-component. */
        cross: (a, b) => a.length === 2
            ? a[0] * b[1] - a[1] * b[0]
            : [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
        /** Angle between two vectors in degrees, 0…180. */
        angle: (a, b) => {
            const d = Math.hypot(...a) * Math.hypot(...b);
            if (d < 1e-12) return NaN;
            return Math.acos(Math.max(-1, Math.min(1, V.dot(a, b) / d))) * 180 / Math.PI;
        },
        lerp: (a, b, t) => a.map((x, i) => x + (b[i] - x) * t),
        eq: (a, b, eps = 1e-9) => a.every((x, i) => Math.abs(x - b[i]) < eps),
        isZero: (a, eps = 1e-9) => a.every(x => Math.abs(x) < eps),
        to3: a => a.length === 3 ? a.slice() : [a[0], a[1], 0],
        /** Are a and b parallel (collinear)? Works in 2D and 3D. */
        parallel: (a, b, eps = 1e-9) => {
            if (V.isZero(a, eps) || V.isZero(b, eps)) return true;
            const c = V.cross(V.to3(a), V.to3(b));
            return V.len(c) < eps * Math.max(1, V.len(a) * V.len(b));
        },
        /** Any vector orthogonal to a (3D), chosen to be numerically safe. */
        anyPerp: a => {
            const h = Math.abs(a[0]) < Math.abs(a[1])
                ? (Math.abs(a[0]) < Math.abs(a[2]) ? [1, 0, 0] : [0, 0, 1])
                : (Math.abs(a[1]) < Math.abs(a[2]) ? [0, 1, 0] : [0, 0, 1]);
            return V.unit(V.cross(a, h));
        },
    };

    // ------------------------------------------------------------------
    // Number and formula formatting
    // ------------------------------------------------------------------
    /** German decimal comma, at most `d` places, trailing zeros dropped. */
    function num(x, d = 2) {
        if (!isFinite(x)) return '—';
        if (Math.abs(x) < 5e-11) x = 0;
        return Number(x).toLocaleString('de-DE', { maximumFractionDigits: d });
    }
    /** Same, but for LaTeX — KaTeX wants a plain comma, not a locale group separator. */
    function tnum(x, d = 2) {
        if (!isFinite(x)) return '?';
        if (Math.abs(x) < 5e-11) x = 0;
        return String(Number(x.toFixed(d))).replace('.', '{,}');
    }
    /** A rational-looking number if it is one, otherwise a decimal. Keeps solutions readable. */
    function frac(x, maxDen = 12, d = 2) {
        if (!isFinite(x)) return '?';
        if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x));
        for (let q = 2; q <= maxDen; q++) {
            const p = x * q;
            if (Math.abs(p - Math.round(p)) < 1e-9) {
                const s = Math.sign(p) < 0 ? '-' : '';
                return `${s}\\tfrac{${Math.abs(Math.round(p))}}{${q}}`;
            }
        }
        return tnum(x, d);
    }

    const Tex = {
        /** Column vector: [1,2,3] -> \begin{pmatrix}1\\2\\3\end{pmatrix} */
        col: (v, d = 2) => `\\begin{pmatrix}${v.map(x => tnum(x, d)).join(' \\\\ ')}\\end{pmatrix}`,
        /** Column vector of arbitrary LaTeX entries — for symbolic work. */
        colRaw: rows => `\\begin{pmatrix}${rows.join(' \\\\ ')}\\end{pmatrix}`,
        vec: name => `\\vec{${name}}`,
        /** "\vec a = (…)" in one go. */
        named: (name, v, d = 2) => `\\vec{${name}} = ${Tex.col(v, d)}`,
        num: tnum,
        frac,
    };

    /** Render every $…$ / $$…$$ inside `root` once KaTeX has arrived. */
    function renderMath(root) {
        if (!root) return;
        const go = () => {
            if (!window.renderMathInElement) return;
            try {
                window.renderMathInElement(root, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                    ],
                    throwOnError: false,
                    trust: true,
                });
            } catch (e) { /* a broken formula must never take the lab down */ }
        };
        if (window.renderMathInElement) go();
        else window.addEventListener('katex-ready', go, { once: true });
    }

    // ==================================================================
    // 2D stage — grid, axes, arrows and draggable points on a plain canvas
    // ==================================================================
    class Stage2D {
        constructor(canvas) {
            this.cv = canvas;
            this.ctx = canvas.getContext('2d');
            this.cx = 0; this.cy = 0;     // world coordinate at the centre of the view
            this.unit = 48;               // pixels per unit
            this.handles = [];            // { get, set, color, label, r }
            this.drag = null;
            this.snap = true;             // snap dragged points to integers
            this.onChange = null;
            this.draw = null;             // set by the active module
            this._wire();
        }

        // ---- geometry ------------------------------------------------
        resize() {
            const r = this.cv.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.w = Math.max(1, Math.round(r.width));
            this.h = Math.max(1, Math.round(r.height));
            this.cv.width = this.w * dpr;
            this.cv.height = this.h * dpr;
            this.cv.style.width = this.w + 'px';
            this.cv.style.height = this.h + 'px';
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        /** world -> screen */
        w2s(p) { return [this.w / 2 + (p[0] - this.cx) * this.unit, this.h / 2 - (p[1] - this.cy) * this.unit]; }
        /** screen -> world */
        s2w(p) { return [this.cx + (p[0] - this.w / 2) / this.unit, this.cy - (p[1] - this.h / 2) / this.unit]; }
        /** Fit the view so that every given world point is comfortably inside. */
        fit(points, pad = 1.4) {
            if (!points.length) return;
            // fit() may run before the first resize — without w/h every scale is NaN
            if (!this.w || !this.h) this.resize();
            const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
            const minX = Math.min(...xs, 0), maxX = Math.max(...xs, 0);
            const minY = Math.min(...ys, 0), maxY = Math.max(...ys, 0);
            this.cx = (minX + maxX) / 2; this.cy = (minY + maxY) / 2;
            const dx = Math.max(2, (maxX - minX) * pad), dy = Math.max(2, (maxY - minY) * pad);
            const u = Math.min(this.w / dx, this.h / dy);
            this.unit = isFinite(u) ? Math.max(14, u) : 48;
        }

        // ---- painting ------------------------------------------------
        clear() { this.ctx.clearRect(0, 0, this.w, this.h); }

        grid() {
            const c = this.ctx;
            // choose a step that keeps grid lines at least ~26 px apart
            let step = 1;
            const nice = [1, 2, 5];
            let k = 0;
            while (step * this.unit < 26) { step = nice[k % 3] * Math.pow(10, Math.floor(k / 3) + 1) / 10; k++; if (k > 40) break; }
            const [x0, y1] = this.s2w([0, 0]);
            const [x1, y0] = this.s2w([this.w, this.h]);
            c.lineWidth = 1;
            c.strokeStyle = COL.grid;
            c.beginPath();
            for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
                const sx = Math.round(this.w2s([x, 0])[0]) + 0.5;
                c.moveTo(sx, 0); c.lineTo(sx, this.h);
            }
            for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
                const sy = Math.round(this.w2s([0, y])[1]) + 0.5;
                c.moveTo(0, sy); c.lineTo(this.w, sy);
            }
            c.stroke();
            this._axes(step, x0, x1, y0, y1);
        }

        _axes(step, x0, x1, y0, y1) {
            const c = this.ctx;
            const o = this.w2s([0, 0]);
            c.strokeStyle = COL.axis; c.lineWidth = 1.4;
            c.beginPath();
            c.moveTo(0, Math.round(o[1]) + 0.5); c.lineTo(this.w, Math.round(o[1]) + 0.5);
            c.moveTo(Math.round(o[0]) + 0.5, 0); c.lineTo(Math.round(o[0]) + 0.5, this.h);
            c.stroke();
            // ticks and numbers
            c.fillStyle = 'rgba(255,255,255,0.5)';
            c.font = '11px Arial, Helvetica, sans-serif';
            c.textAlign = 'center'; c.textBaseline = 'top';
            const ly = Math.min(Math.max(o[1] + 5, 4), this.h - 16);
            for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
                if (Math.abs(x) < step / 2) continue;
                c.fillText(num(x, 3), this.w2s([x, 0])[0], ly);
            }
            c.textAlign = 'right'; c.textBaseline = 'middle';
            const lx = Math.min(Math.max(o[0] - 6, 22), this.w - 4);
            for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
                if (Math.abs(y) < step / 2) continue;
                c.fillText(num(y, 3), lx, this.w2s([0, y])[1]);
            }
            // axis names
            c.fillStyle = 'rgba(255,255,255,0.75)';
            c.font = "600 12px 'Orbitron', sans-serif";
            c.textAlign = 'right'; c.textBaseline = 'bottom';
            c.fillText('x', this.w - 6, Math.min(Math.max(o[1] - 5, 14), this.h - 4));
            c.textAlign = 'left'; c.textBaseline = 'top';
            c.fillText('y', Math.min(Math.max(o[0] + 6, 4), this.w - 16), 6);
        }

        /** An arrow from world point a to world point b. */
        arrow(a, b, color, label, opt = {}) {
            const c = this.ctx;
            const A = this.w2s(a), B = this.w2s(b);
            const dx = B[0] - A[0], dy = B[1] - A[1];
            const L = Math.hypot(dx, dy);
            const width = opt.width || 2.6;
            c.save();
            c.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
            c.strokeStyle = color; c.fillStyle = color;
            c.lineWidth = width; c.lineCap = 'round';
            if (opt.dash) c.setLineDash(opt.dash);
            if (L < 1.5) { // degenerate: just a dot
                c.beginPath(); c.arc(A[0], A[1], width * 1.4, 0, 7); c.fill(); c.restore();
                if (label) this.text(label, b, color, opt);
                return;
            }
            const head = Math.min(13 + width, L * 0.42);
            const ux = dx / L, uy = dy / L;
            const tipX = B[0], tipY = B[1];
            const baseX = B[0] - ux * head, baseY = B[1] - uy * head;
            c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(baseX, baseY); c.stroke();
            c.setLineDash([]);
            const wing = head * 0.42;
            c.beginPath();
            c.moveTo(tipX, tipY);
            c.lineTo(baseX - uy * wing, baseY + ux * wing);
            c.lineTo(baseX + uy * wing, baseY - ux * wing);
            c.closePath(); c.fill();
            c.restore();
            if (label) {
                // offset the name perpendicular to the shaft, in screen pixels
                const off = opt.labelOffset == null ? 15 : opt.labelOffset;
                const mid = [(A[0] + B[0]) / 2 - uy * off, (A[1] + B[1]) / 2 + ux * off];
                this.text(label, this.s2w(mid), color, {
                    overArrow: opt.overArrow !== false, font: opt.labelFont,
                });
            }
        }

        /** Straight line through p with direction d, clipped to the viewport. */
        line(p, d, color, opt = {}) {
            if (V.isZero(d)) return;
            const big = (Math.abs(this.w) + Math.abs(this.h)) / this.unit;
            const a = [p[0] - d[0] * big, p[1] - d[1] * big];
            const b = [p[0] + d[0] * big, p[1] + d[1] * big];
            this.segment(a, b, color, opt);
        }

        segment(a, b, color, opt = {}) {
            const c = this.ctx, A = this.w2s(a), B = this.w2s(b);
            c.save();
            c.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
            c.strokeStyle = color; c.lineWidth = opt.width || 2;
            c.lineCap = 'round';
            if (opt.dash) c.setLineDash(opt.dash);
            c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke();
            c.restore();
        }

        polygon(pts, fill, stroke, opt = {}) {
            if (pts.length < 2) return;
            const c = this.ctx;
            c.save();
            c.beginPath();
            pts.forEach((p, i) => { const s = this.w2s(p); i ? c.lineTo(s[0], s[1]) : c.moveTo(s[0], s[1]); });
            c.closePath();
            if (fill) { c.globalAlpha = opt.alpha == null ? 0.18 : opt.alpha; c.fillStyle = fill; c.fill(); }
            if (stroke) { c.globalAlpha = 1; c.strokeStyle = stroke; c.lineWidth = opt.width || 1.6; if (opt.dash) c.setLineDash(opt.dash); c.stroke(); }
            c.restore();
        }

        dot(p, color, r = 5, opt = {}) {
            const c = this.ctx, s = this.w2s(p);
            c.save();
            c.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
            c.fillStyle = opt.hollow ? '#07111f' : color;
            c.strokeStyle = color; c.lineWidth = 2;
            c.beginPath(); c.arc(s[0], s[1], r, 0, 7);
            c.fill(); c.stroke();
            c.restore();
        }

        text(t, p, color, opt = {}) {
            const c = this.ctx, s = this.w2s(p);
            c.save();
            c.font = opt.font || "600 13px 'Orbitron', sans-serif";
            c.textAlign = opt.align || 'center';
            c.textBaseline = opt.baseline || 'middle';
            const x = s[0] + (opt.dx || 0), y = s[1] + (opt.dy || 0);
            c.lineWidth = 4; c.strokeStyle = 'rgba(4,10,22,0.85)';
            c.strokeText(t, x, y);
            c.fillStyle = color;
            c.fillText(t, x, y);
            if (opt.overArrow) this._overArrow(c, t, x, y, color);
            c.restore();
        }

        /** The little arrow above a vector name — Orbitron has no combining arrow glyph. */
        _overArrow(c, t, x, y, color) {
            const w = c.measureText(t).width;
            const m = c.measureText('M');
            const asc = (m.actualBoundingBoxAscent || 9);
            const left = c.textAlign === 'left' ? x : c.textAlign === 'right' ? x - w : x - w / 2;
            const top = (c.textBaseline === 'top' ? y : c.textBaseline === 'bottom' ? y - asc : y - asc / 2) - 4.5;
            c.save();
            c.strokeStyle = color; c.fillStyle = color;
            c.lineWidth = 1.3; c.lineCap = 'round';
            c.beginPath(); c.moveTo(left + 0.5, top); c.lineTo(left + w - 1.5, top); c.stroke();
            c.beginPath();
            c.moveTo(left + w, top);
            c.lineTo(left + w - 3.4, top - 2.1);
            c.lineTo(left + w - 3.4, top + 2.1);
            c.closePath(); c.fill();
            c.restore();
        }

        /** Angle arc at vertex v between directions a and b, with an optional label. */
        angleArc(v, a, b, color, label, rWorld) {
            const c = this.ctx, s = this.w2s(v);
            const r = (rWorld ? rWorld * this.unit : 32);
            const a0 = Math.atan2(-a[1], a[0]), a1 = Math.atan2(-b[1], b[0]);
            let d = a1 - a0;
            while (d > Math.PI) d -= 2 * Math.PI;
            while (d < -Math.PI) d += 2 * Math.PI;
            c.save();
            c.strokeStyle = color; c.lineWidth = 2; c.globalAlpha = 0.9;
            c.beginPath(); c.arc(s[0], s[1], r, a0, a0 + d, d < 0); c.stroke();
            c.restore();
            if (label) {
                const m = a0 + d / 2;
                this.text(label, this.s2w([s[0] + Math.cos(m) * (r + 16), s[1] + Math.sin(m) * (r + 16)]), color, { font: "600 12px 'Orbitron', sans-serif" });
            }
        }

        /** Small square marking a right angle at v between directions a and b. */
        rightAngle(v, a, b, color) {
            const ua = V.unit(a), ub = V.unit(b);
            const k = 14 / this.unit;
            this.polygon([v, V.add(v, V.scale(ua, k)), V.add(V.add(v, V.scale(ua, k)), V.scale(ub, k)), V.add(v, V.scale(ub, k))],
                null, color, { width: 1.4 });
        }

        // ---- interaction ---------------------------------------------
        /** Register a draggable world point. `get` returns it, `set` writes it back. */
        addHandle(get, set, color, label, over) {
            this.handles.push({ get, set, color, label, over });
        }
        clearHandles() { this.handles = []; }

        /** Paint every registered handle. Call at the end of a module's draw(). */
        paintHandles() {
            this.handles.forEach((h, i) => {
                const p = h.get();
                const hot = this.drag === i || this.hover === i;
                this.dot(p, h.color, hot ? 8 : 6, {});
                if (h.label) this.text(h.label, p, h.color, { dy: -18, font: "700 13px 'Orbitron', sans-serif" });
            });
        }

        _pick(sp) {
            let best = -1, bd = 15;
            this.handles.forEach((h, i) => {
                const s = this.w2s(h.get());
                const d = Math.hypot(s[0] - sp[0], s[1] - sp[1]);
                if (d < bd) { bd = d; best = i; }
            });
            return best;
        }

        _wire() {
            const pos = e => {
                const r = this.cv.getBoundingClientRect();
                return [e.clientX - r.left, e.clientY - r.top];
            };
            this.cv.addEventListener('pointerdown', e => {
                const sp = pos(e);
                const i = this._pick(sp);
                if (i >= 0) {
                    this.drag = i;
                    this.cv.setPointerCapture(e.pointerId);
                } else {
                    this.pan = { sp, cx: this.cx, cy: this.cy };
                    this.cv.setPointerCapture(e.pointerId);
                }
                e.preventDefault();
            });
            this.cv.addEventListener('pointermove', e => {
                const sp = pos(e);
                if (this.drag != null) {
                    let w = this.s2w(sp);
                    if (this.snap) w = [Math.round(w[0] * 2) / 2, Math.round(w[1] * 2) / 2];
                    this.handles[this.drag].set(w);
                    if (this.onChange) this.onChange();
                    this.render();
                } else if (this.pan) {
                    this.cx = this.pan.cx - (sp[0] - this.pan.sp[0]) / this.unit;
                    this.cy = this.pan.cy + (sp[1] - this.pan.sp[1]) / this.unit;
                    this.render();
                } else {
                    const i = this._pick(sp);
                    if (i !== this.hover) { this.hover = i; this.cv.style.cursor = i >= 0 ? 'grab' : 'default'; this.render(); }
                }
            });
            const up = e => {
                if (this.drag != null && this.onChange) this.onChange();
                this.drag = null; this.pan = null;
                try { this.cv.releasePointerCapture(e.pointerId); } catch (_) { }
                this.render();
            };
            this.cv.addEventListener('pointerup', up);
            this.cv.addEventListener('pointercancel', up);
            this.cv.addEventListener('wheel', e => {
                e.preventDefault();
                const sp = pos(e);
                const before = this.s2w(sp);
                this.unit = Math.max(8, Math.min(400, this.unit * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
                const after = this.s2w(sp);
                this.cx += before[0] - after[0];
                this.cy += before[1] - after[1];
                this.render();
            }, { passive: false });
        }

        render() {
            if (!this.w) this.resize();
            this.clear();
            this.grid();
            if (this.draw) this.draw(this);
            this.paintHandles();
        }
    }

    // ==================================================================
    // 3D stage — three.js with axes, arrows, planes and a trackball
    // ==================================================================
    class Stage3D {
        constructor(host) {
            this.host = host;
            this.ready = false;
            this.pending = [];
            this.draw = null;
            if (window.THREE) this._init();
            else window.addEventListener('three-ready', () => this._init(), { once: true });
        }

        _init() {
            const T = window.THREE;
            this.T = T;
            this.scene = new T.Scene();
            this.camera = new T.PerspectiveCamera(45, 1, 0.1, 2000);
            this.camera.position.set(9, 7, 11);
            this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
            this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
            this.host.appendChild(this.renderer.domElement);
            this.renderer.domElement.style.display = 'block';

            this.controls = CyberTrackball.make(T.TrackballControls, this.camera, this.renderer.domElement);

            this.scene.add(new T.AmbientLight(0xffffff, 0.85));
            const dl = new T.DirectionalLight(0xffffff, 0.6);
            dl.position.set(6, 10, 8);
            this.scene.add(dl);

            this.world = new T.Group();       // everything a module draws lives here
            this.scene.add(this.world);
            this.frame = new T.Group();       // axes and grid, rebuilt on range change
            this.scene.add(this.frame);
            this.setRange(5);

            this.ready = true;
            this.resize();
            const loop = () => {
                this._raf = requestAnimationFrame(loop);
                if (this.visible) { this.controls.update(); this.renderer.render(this.scene, this.camera); }
            };
            loop();
            this.pending.forEach(f => f());
            this.pending = [];
        }

        get visible() { return this.host.offsetParent !== null; }

        onReady(f) { this.ready ? f() : this.pending.push(f); }

        resize() {
            if (!this.ready) return;
            const r = this.host.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) return;
            this.camera.aspect = r.width / r.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(r.width, r.height, false);
            this.controls.handleResize();
        }

        /** Axes and floor grid for a cube of half-width n. */
        setRange(n) {
            if (!this.ready) return;
            this.range = n;
            const T = this.T;
            while (this.frame.children.length) {
                const c = this.frame.children.pop();
                if (c.geometry) c.geometry.dispose();
                if (c.material) c.material.dispose();
            }
            const grid = new T.GridHelper(2 * n, 2 * n, 0x2a3c55, 0x18263a);
            grid.rotation.x = Math.PI / 2;   // three's grid is xz; the lab works in xy
            this.frame.add(grid);
            const axes = [
                { d: [1, 0, 0], c: COL.red, n: 'x' },
                { d: [0, 1, 0], c: COL.green, n: 'y' },
                { d: [0, 0, 1], c: COL.blue, n: 'z' },
            ];
            axes.forEach(a => {
                const p = [V.scale(a.d, -n), V.scale(a.d, n)];
                const g = new T.BufferGeometry().setFromPoints(p.map(q => new T.Vector3(...q)));
                this.frame.add(new T.Line(g, new T.LineBasicMaterial({ color: a.c, transparent: true, opacity: 0.55 })));
                const s = this._label(a.n, a.c);
                s.position.set(...V.scale(a.d, n + 0.45));
                this.frame.add(s);
            });
        }

        _label(text, color) {
            const T = this.T;
            const cv = document.createElement('canvas');
            const S = 128;
            cv.width = cv.height = S;
            const c = cv.getContext('2d');
            c.font = "700 62px 'Orbitron', sans-serif";
            c.textAlign = 'center'; c.textBaseline = 'middle';
            c.lineWidth = 8; c.strokeStyle = 'rgba(4,10,22,0.9)';
            c.strokeText(text, S / 2, S / 2);
            c.fillStyle = color;
            c.fillText(text, S / 2, S / 2);
            const tex = new T.CanvasTexture(cv);
            tex.anisotropy = 4;
            const sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
            sp.scale.set(0.5, 0.5, 1);
            sp.renderOrder = 10;
            return sp;
        }

        // ---- module-facing drawing API (all clear on rebuild) ---------
        clear() {
            if (!this.ready) return;
            const kill = o => {
                (o.children || []).slice().forEach(kill);
                if (o.geometry) o.geometry.dispose();
                if (o.material) { const m = o.material; (Array.isArray(m) ? m : [m]).forEach(x => { if (x.map) x.map.dispose(); x.dispose(); }); }
            };
            this.world.children.slice().forEach(c => { kill(c); this.world.remove(c); });
        }

        arrow3(from, to, color, label, opt = {}) {
            const T = this.T;
            const a = new T.Vector3(...V.to3(from)), b = new T.Vector3(...V.to3(to));
            const dir = b.clone().sub(a);
            const len = dir.length();
            if (len < 1e-6) return;
            const head = Math.min(0.42, len * 0.3);
            const h = new T.ArrowHelper(dir.clone().normalize(), a, len, new T.Color(color), head, head * 0.55);
            h.line.material.linewidth = 2;
            if (opt.alpha != null) {
                h.line.material.transparent = true; h.line.material.opacity = opt.alpha;
                h.cone.material.transparent = true; h.cone.material.opacity = opt.alpha;
            }
            this.world.add(h);
            if (label) this.label3(label, b.clone().add(dir.clone().normalize().multiplyScalar(0.34)), color);
        }

        line3(a, b, color, opt = {}) {
            const T = this.T;
            const g = new T.BufferGeometry().setFromPoints([new T.Vector3(...V.to3(a)), new T.Vector3(...V.to3(b))]);
            const m = opt.dash
                ? new T.LineDashedMaterial({ color, dashSize: 0.22, gapSize: 0.16, transparent: true, opacity: opt.alpha == null ? 1 : opt.alpha })
                : new T.LineBasicMaterial({ color, transparent: true, opacity: opt.alpha == null ? 1 : opt.alpha });
            const l = new T.Line(g, m);
            if (opt.dash) l.computeLineDistances();
            this.world.add(l);
            return l;
        }

        /** A full straight line through p with direction d, drawn out to the frame. */
        ray3(p, d, color, opt = {}) {
            const n = (this.range || 5) * 1.8;
            const u = V.unit(V.to3(d));
            return this.line3(V.sub(V.to3(p), V.scale(u, n)), V.add(V.to3(p), V.scale(u, n)), color, opt);
        }

        point3(p, color, label, r = 0.11) {
            const T = this.T;
            const s = new T.Mesh(new T.SphereGeometry(r, 20, 14), new T.MeshBasicMaterial({ color }));
            s.position.set(...V.to3(p));
            this.world.add(s);
            if (label) this.label3(label, new T.Vector3(...V.to3(p)).add(new T.Vector3(0, 0, r + 0.22)), color);
        }

        /** Plane through p spanned by u and v, drawn as a translucent patch with a wire grid. */
        plane3(p, u, v, color, opt = {}) {
            const T = this.T;
            const k = opt.size || (this.range || 5) * 0.9;
            const eu = V.scale(V.unit(V.to3(u)), k), ev = V.scale(V.unit(V.to3(v)), k);
            const P = V.to3(p);
            const c = [
                V.add(V.sub(P, eu), V.neg(ev)), V.add(V.add(P, eu), V.neg(ev)),
                V.add(V.add(P, eu), ev), V.add(V.sub(P, eu), ev),
            ];
            const g = new T.BufferGeometry();
            g.setAttribute('position', new T.Float32BufferAttribute([...c[0], ...c[1], ...c[2], ...c[0], ...c[2], ...c[3]], 3));
            g.computeVertexNormals();
            const m = new T.MeshBasicMaterial({ color, transparent: true, opacity: opt.alpha == null ? 0.17 : opt.alpha, side: T.DoubleSide, depthWrite: false });
            this.world.add(new T.Mesh(g, m));
            // wire grid so the plane's tilt is readable
            const N = opt.lines == null ? 6 : opt.lines;
            const pts = [];
            for (let i = 0; i <= N; i++) {
                const t = -1 + 2 * i / N;
                pts.push(...V.add(V.add(P, V.scale(eu, t)), V.neg(ev)), ...V.add(V.add(P, V.scale(eu, t)), ev));
                pts.push(...V.add(V.sub(P, eu), V.scale(ev, t)), ...V.add(V.add(P, eu), V.scale(ev, t)));
            }
            const lg = new T.BufferGeometry();
            lg.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
            this.world.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })));
        }

        /** Filled triangle or quad from world points. */
        poly3(pts, color, opt = {}) {
            const T = this.T;
            const flat = [];
            for (let i = 1; i + 1 < pts.length; i++) flat.push(...V.to3(pts[0]), ...V.to3(pts[i]), ...V.to3(pts[i + 1]));
            const g = new T.BufferGeometry();
            g.setAttribute('position', new T.Float32BufferAttribute(flat, 3));
            g.computeVertexNormals();
            this.world.add(new T.Mesh(g, new T.MeshBasicMaterial({
                color, transparent: true, opacity: opt.alpha == null ? 0.25 : opt.alpha,
                side: T.DoubleSide, depthWrite: false,
            })));
            if (opt.edge !== false) {
                const e = [];
                pts.forEach((p, i) => { e.push(...V.to3(p), ...V.to3(pts[(i + 1) % pts.length])); });
                const eg = new T.BufferGeometry();
                eg.setAttribute('position', new T.Float32BufferAttribute(e, 3));
                this.world.add(new T.LineSegments(eg, new T.LineBasicMaterial({ color, transparent: true, opacity: 0.85 })));
            }
        }

        label3(text, pos, color) {
            const s = this._label(text, color);
            s.position.copy(pos.isVector3 ? pos : new this.T.Vector3(...V.to3(pos)));
            this.world.add(s);
        }

        resetView() {
            if (!this.ready) return;
            // distance follows the range, so a bigger scene does not run out of frame
            const k = (this.range || 5) * 0.98;
            this.camera.up.set(0, 0, 1);
            this.camera.position.set(k * 1.5, -k * 2.1, k * 1.6);
            this.camera.lookAt(0, 0, 0);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }

        render() {
            if (!this.ready) return;
            this.clear();
            if (this.draw) this.draw(this);
        }
    }

    // ==================================================================
    // Theory and exercise panel
    // ==================================================================
    /** Fill the theory box of a tab. */
    function theory(tab, html) {
        const el = document.getElementById('doc-theory-' + tab);
        if (!el) return;
        el.innerHTML = html;
        renderMath(el);
    }

    /**
     * Build the exercise list of a tab.
     * tasks: [{ q, hint?, sol }] — q and sol may contain HTML and $…$ maths.
     */
    function tasks(tab, list) {
        const el = document.getElementById('doc-tasks-' + tab);
        if (!el) return;
        el.innerHTML = list.map((t, i) => `
            <div class="v-task">
                <div class="v-task-head"><span class="v-task-no">${i + 1}</span><div class="v-task-q">${t.q}</div></div>
                ${t.hint ? `<button class="v-task-btn v-hint" data-i="${i}" data-kind="hint">Tipp</button>` : ''}
                <button class="v-task-btn" data-i="${i}" data-kind="sol">Lösungsweg</button>
                ${t.hint ? `<div class="v-task-body v-hint-body" id="hint-${tab}-${i}">${t.hint}</div>` : ''}
                <div class="v-task-body" id="sol-${tab}-${i}">${t.sol}</div>
            </div>`).join('');
        el.querySelectorAll('.v-task-btn').forEach(b => b.addEventListener('click', () => {
            const id = (b.dataset.kind === 'hint' ? 'hint-' : 'sol-') + tab + '-' + b.dataset.i;
            const body = document.getElementById(id);
            const open = body.classList.toggle('open');
            b.classList.toggle('open', open);
            if (b.dataset.kind === 'sol') b.textContent = open ? 'Lösungsweg verbergen' : 'Lösungsweg';
            else b.textContent = open ? 'Tipp verbergen' : 'Tipp';
        }));
        renderMath(el);
    }

    // ==================================================================
    // Module registry — the shell calls into this
    // ==================================================================
    const modules = {};
    /**
     * A module is { id, title, dim: 2|3, build(ctx), draw(stage), onShow?() }.
     * `build` runs once when the tab is first opened.
     */
    function register(mod) { modules[mod.id] = mod; }

    /**
     * CyberUI.createSlider with a handle back to the DOM, so a module can move
     * the slider itself (e.g. after solving for a parameter).
     */
    function slider(cid, label, min, max, val, step, cb, color, fmt) {
        // NB: `class CyberUI` is a global lexical binding, not a window property
        CyberUI.createSlider(cid, label, min, max, val, step, cb, color, fmt);
        const groups = document.getElementById(cid).querySelectorAll('.cyber-control-group');
        const grp = groups[groups.length - 1];
        const input = grp.querySelector('input[type="range"]');
        const disp = grp.querySelector('.val-display');
        return {
            input, disp,
            set(v) { input.value = v; if (disp) disp.innerText = fmt ? fmt(v) : String(v); },
        };
    }

    /** A row of small buttons inside a sidebar card. */
    function buttons(cid, list) {
        const row = document.createElement('div');
        row.className = 'v-btnrow';
        list.forEach(b => {
            const el = document.createElement('button');
            el.className = 'v-mini';
            el.textContent = b.label;
            el.addEventListener('click', b.run);
            row.appendChild(el);
        });
        document.getElementById(cid).appendChild(row);
        return row;
    }

    window.VekLab = { COL, V, num, Tex, renderMath, Stage2D, Stage3D, theory, tasks, register, modules, slider, buttons };
})();
