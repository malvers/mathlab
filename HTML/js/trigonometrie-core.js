/* trigonometrie-core.js — trigonometry on top of the shared VekLab engine (vektoren-core.js).
 *
 * Adds a 2D stage that can label the x-axis in multiples of π, scale x and y
 * independently (for measured data), refit itself on resize and keep the figure
 * clear of the floating value panel; plus angle helpers, exact values and one
 * unit-circle painter shared by every chapter that shows the circle.
 * Chapter modules (trigonometrie-mod-*.js) register with TrigLab.register().
 */
(function () {
    'use strict';
    const { COL, V, num, Tex } = window.VekLab;

    const PI = Math.PI, TAU = 2 * Math.PI;
    /** The lab's fixed colour meaning: sine orange, cosine blue, tangent pink, angle green. */
    const C = {
        sin: COL.orange, cos: COL.blue, tan: COL.pink, ang: COL.green,
        rad: 'rgba(255, 255, 255, 0.85)', faint: 'rgba(255, 255, 255, 0.35)',
        red: COL.red, green: COL.green, purple: COL.purple, grey: COL.grey,
    };

    // ------------------------------------------------------------------
    // Angles and exact values
    // ------------------------------------------------------------------
    const rad = d => d * PI / 180;
    const deg = x => x * 180 / PI;
    /** Angle in [0, 2π). */
    const wrap = x => ((x % TAU) + TAU) % TAU;

    /** Magnetic snap: multiples of 15° pull within 2.5°, otherwise whole degrees. Radians in, radians out. */
    function snapAngle(x) {
        const d = deg(x);
        const m = Math.round(d / 15) * 15;
        return rad(Math.abs(d - m) < 2.5 ? m : Math.round(d));
    }

    /** x as a reduced fraction of π with denominator up to 12, or null. */
    function piFrac(x) {
        const n = x / (PI / 12);
        const r = Math.round(n);
        if (Math.abs(n - r) > 1e-7) return null;
        let p = r, q = 12;
        const g = gcd(Math.abs(p), q) || 1;
        return { p: p / g, q: q / g };
    }
    function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }

    /** LaTeX for a multiple of π ("\tfrac{\pi}{6}", "2\pi", "0"), or null. */
    function piTex(x) {
        const f = piFrac(x);
        if (!f) return null;
        if (f.p === 0) return '0';
        const s = f.p < 0 ? '-' : '', a = Math.abs(f.p);
        if (f.q === 1) return s + (a === 1 ? '' : a) + '\\pi';
        return s + `\\tfrac{${a === 1 ? '' : a}\\pi}{${f.q}}`;
    }
    /** The same as plain text for the canvas ("π/6", "3π/2", "−π"). */
    function piText(x) {
        const f = piFrac(x);
        if (!f) return num(x, 2);
        if (f.p === 0) return '0';
        const s = f.p < 0 ? '−' : '', a = Math.abs(f.p);
        const top = (a === 1 ? '' : a) + 'π';
        return s + (f.q === 1 ? top : top + '/' + f.q);
    }
    /** Radians for the HUD, relation sign included: "=\tfrac{\pi}{3}\approx 1{,}05" or "\approx 0{,}52". */
    function radTex(x, d = 2) {
        const e = piTex(x);
        const dec = Tex.num(x, d);
        if (e === null) return '\\approx ' + dec;
        if (e === '0') return '=0';
        return '=' + e + '\\approx ' + dec;
    }

    // exact values that turn up at multiples of 30° and 45°
    const EXACT = [
        [0, '0'], [0.5, '\\tfrac{1}{2}'], [Math.SQRT2 / 2, '\\tfrac{\\sqrt{2}}{2}'],
        [Math.sqrt(3) / 2, '\\tfrac{\\sqrt{3}}{2}'], [1, '1'], [Math.sqrt(3), '\\sqrt{3}'],
        [Math.sqrt(3) / 3, '\\tfrac{\\sqrt{3}}{3}'],
    ];
    /** LaTeX of an exact value, or null if the number is none of the school values. */
    function exactTex(v) {
        for (const [x, t] of EXACT) {
            if (Math.abs(Math.abs(v) - x) < 1e-9) return (v < 0 && x !== 0 ? '-' : '') + t;
        }
        return null;
    }
    /** A value for the HUD, relation sign included: "=\tfrac12=0{,}5", "=\tfrac{\sqrt3}{2}\approx 0{,}866", "\approx 0{,}643". */
    function valTex(v, d = 3) {
        const e = exactTex(v), dec = Tex.num(v, d);
        const rel = Math.abs(v - Number(v.toFixed(d))) > 1e-12 ? '\\approx ' : '=';
        if (e === null) return rel + dec;
        return e === dec ? '=' + e : '=' + e + rel + dec;
    }
    /** Degrees as text with the degree sign, one decimal at most. */
    const degText = x => num(deg(x), 1) + '°';
    const degTex = x => Tex.num(deg(x), 1) + '^\\circ';

    // ------------------------------------------------------------------
    // Nice tick steps
    // ------------------------------------------------------------------
    /** Smallest step of the form 1, 2, 5 · 10^k that keeps ticks at least minPx apart. */
    function niceStep(pxPerUnit, minPx) {
        for (let k = -4; k <= 7; k++) {
            for (const m of [1, 2, 5]) {
                const s = m * Math.pow(10, k);
                if (s * pxPerUnit >= minPx) return s;
            }
        }
        return 1e8;
    }
    /** π-steps for the x-axis: π/6, π/4 are avoided on purpose — π/2 is what the class draws. */
    function piStep(pxPerUnit, minPx) {
        for (const s of [PI / 4, PI / 2, PI, TAU, 2 * TAU, 4 * TAU]) if (s * pxPerUnit >= minPx) return s;
        return 8 * TAU;
    }

    // ==================================================================
    // Stage — VekLab.Stage2D plus π-axis, separate y scale and HUD-aware fit
    // ==================================================================
    class TrigStage extends VekLab.Stage2D {
        constructor(canvas) {
            super(canvas);
            this.snap = false;         // chapters snap their own handles
            this.k = 1;                // pixels per y-unit = unit * k
            this.xMode = 'num';        // 'num' | 'pi'
            this.degLabels = false;    // degree sub-label under π ticks
            this.xClip = null;         // no x grid / ticks left of this world x
            this.names = ['x', 'y'];   // axis names
            this.showGrid = true;
            this.box = null;           // last requested fit box, reapplied on resize
            this.moved = false;        // the user zoomed or panned: stop refitting
            this.hudEl = null;         // floating panel to keep clear of
            this.fontScale = 1.25;     // every canvas text, one knob (Doc 26.09.: "tendenziell zu klein")
        }
        /** "600 13px 'Orbitron'" -> the same font at fontScale times the size. */
        _font(f) { return f.replace(/(\d+(?:\.\d+)?)px/, (_, n) => (parseFloat(n) * this.fontScale).toFixed(1) + 'px'); }
        /** All labels go through here — Stage2D's handle names and angle labels included. */
        text(t, p, color, opt = {}) {
            super.text(t, p, color, Object.assign({}, opt, { font: this._font(opt.font || "600 13px 'Orbitron', sans-serif") }));
        }
        /** Back to the chapter's own framing (button bottom right, or double click). */
        resetView() {
            if (!this.box) return;
            this.moved = false;
            this._applyBox();
            this.render();
        }
        get uy() { return this.unit * this.k; }
        w2s(p) { return [this.w / 2 + (p[0] - this.cx) * this.unit, this.h / 2 - (p[1] - this.cy) * this.uy]; }
        s2w(p) { return [this.cx + (p[0] - this.w / 2) / this.unit, this.cy - (p[1] - this.h / 2) / this.uy]; }

        resize() {
            super.resize();
            if (this.box && !this.moved) this._applyBox();
        }

        /**
         * Show the world box [x0,x1]×[y0,y1]. `uniform` keeps circles round;
         * otherwise x and y get their own scale (measured data).
         */
        fitBox(x0, x1, y0, y1, uniform = true) {
            this.box = { x0, x1, y0, y1, uniform };
            this.moved = false;
            if (!this.w || !this.h) this.resize();
            this._applyBox();
        }
        /** Legacy VekLab call: fit points, uniform scale. */
        fit(points, pad = 1.2) {
            const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
            const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
            const mx = (x1 - x0) * (pad - 1) / 2, my = (y1 - y0) * (pad - 1) / 2;
            this.fitBox(x0 - mx, x1 + mx, y0 - my, y1 + my, true);
        }

        /** Free rectangles of the canvas: the whole one, or the parts right of and below the value panel. */
        _regions() {
            const pad = 14, bottom = 26;   // the hint line lives at the bottom left
            const full = { l: pad, t: pad, r: this.w - pad, b: this.h - bottom };
            const h = this.hudEl;
            if (!h || !h.firstElementChild || getComputedStyle(h).position !== 'absolute') return [full];
            const cr = this.cv.getBoundingClientRect(), hr = h.firstElementChild.getBoundingClientRect();
            if (hr.width < 4 || hr.height < 4) return [full];
            const right = hr.right - cr.left + 10, below = hr.bottom - cr.top + 10;
            return [
                { l: Math.max(pad, right), t: pad, r: full.r, b: full.b },
                { l: pad, t: Math.max(pad, below), r: full.r, b: full.b },
            ];
        }

        _applyBox() {
            const B = this.box;
            if (!B || !this.w || !this.h) return;
            const dx = Math.max(1e-6, B.x1 - B.x0), dy = Math.max(1e-6, B.y1 - B.y0);
            let best = null;
            this._regions().forEach(R => {
                const rw = Math.max(40, R.r - R.l), rh = Math.max(40, R.b - R.t);
                let ux = rw / dx, uyv = rh / dy;
                if (B.uniform) ux = uyv = Math.min(ux, uyv);
                const score = B.uniform ? ux : rw * rh;
                if (!best || score > best.score) best = { R, ux, uyv, score };
            });
            const { R, ux, uyv } = best;
            this.unit = ux;
            this.k = uyv / ux;
            // centre of the box sits at the centre of the chosen region
            const mx = (R.l + R.r) / 2, my = (R.t + R.b) / 2;
            this.cx = (B.x0 + B.x1) / 2 - (mx - this.w / 2) / this.unit;
            this.cy = (B.y0 + B.y1) / 2 + (my - this.h / 2) / this.uy;
        }

        // ---- grid and axes -----------------------------------------------
        grid() {
            if (!this.showGrid) return;
            const c = this.ctx;
            const xs = this.xMode === 'pi' ? piStep(this.unit, 44 * this.fontScale) : niceStep(this.unit, 34 * this.fontScale);
            const ys = niceStep(this.uy, 30 * this.fontScale);
            const [x0, y1] = this.s2w([0, 0]);
            const [x1, y0] = this.s2w([this.w, this.h]);
            const xmin = this.xClip == null ? x0 : Math.max(x0, this.xClip);
            const sxClip = this.xClip == null ? 0 : Math.max(0, this.w2s([this.xClip, 0])[0]);
            c.lineWidth = 1;
            c.strokeStyle = COL.grid;
            c.beginPath();
            for (let x = Math.ceil(xmin / xs - 1e-9) * xs; x <= x1; x += xs) {
                const sx = Math.round(this.w2s([x, 0])[0]) + 0.5;
                c.moveTo(sx, 0); c.lineTo(sx, this.h);
            }
            for (let y = Math.ceil(y0 / ys) * ys; y <= y1; y += ys) {
                const sy = Math.round(this.w2s([0, y])[1]) + 0.5;
                c.moveTo(sxClip, sy); c.lineTo(this.w, sy);
            }
            c.stroke();

            // axes
            const o = this.w2s([0, 0]);
            c.strokeStyle = COL.axis; c.lineWidth = 1.4;
            c.beginPath();
            c.moveTo(sxClip, Math.round(o[1]) + 0.5); c.lineTo(this.w, Math.round(o[1]) + 0.5);
            if (o[0] >= sxClip - 1) { c.moveTo(Math.round(o[0]) + 0.5, 0); c.lineTo(Math.round(o[0]) + 0.5, this.h); }
            c.stroke();

            // x labels
            const fs = this.fontScale;
            c.fillStyle = 'rgba(255,255,255,0.55)';
            c.font = this._font('12px Arial, Helvetica, sans-serif');
            c.textAlign = 'center'; c.textBaseline = 'top';
            const ly = Math.min(Math.max(o[1] + 5, 4), this.h - (this.degLabels ? 30 : 16) * fs);
            for (let x = Math.ceil(xmin / xs - 1e-9) * xs; x <= x1; x += xs) {
                if (Math.abs(x) < xs / 2) continue;
                const sx = this.w2s([x, 0])[0];
                c.fillText(this.xMode === 'pi' ? piText(x) : num(x, 3), sx, ly);
                if (this.xMode === 'pi' && this.degLabels) {
                    c.save(); c.fillStyle = 'rgba(255,255,255,0.32)'; c.font = this._font('10px Arial, Helvetica, sans-serif');
                    c.fillText(num(deg(x), 0) + '°', sx, ly + 14 * fs); c.restore();
                }
            }
            // y labels
            if (o[0] >= sxClip - 1) {
                c.textAlign = 'right'; c.textBaseline = 'middle';
                const lx = Math.min(Math.max(o[0] - 6, 26), this.w - 4);
                for (let y = Math.ceil(y0 / ys) * ys; y <= y1; y += ys) {
                    if (Math.abs(y) < ys / 2) continue;
                    c.fillText(num(y, 3), lx, this.w2s([0, y])[1]);
                }
            }
            // axis names
            c.fillStyle = 'rgba(255,255,255,0.75)';
            c.font = this._font("600 12px 'Orbitron', sans-serif");
            c.textAlign = 'right'; c.textBaseline = 'bottom';
            c.fillText(this.names[0], this.w - 6, Math.min(Math.max(o[1] - 5, 14), this.h - 4));
            if (o[0] >= sxClip - 1) {
                c.textAlign = 'left'; c.textBaseline = 'top';
                const top = this.box && !this.moved ? Math.max(6, this.w2s([0, this.box.y1])[1] - 4) : 6;
                c.fillText(this.names[1], Math.min(Math.max(o[0] + 6, 4), this.w - 60), top);
            }
        }

        // ---- extra drawing ---------------------------------------------------
        /** Graph of f over the visible x range (or [from, to]); breaks at poles and gaps. */
        curve(f, color, opt = {}) {
            const c = this.ctx;
            const [vx0] = this.s2w([0, 0]), [vx1] = this.s2w([this.w, 0]);
            const a = Math.max(vx0, opt.from == null ? -Infinity : opt.from);
            const b = Math.min(vx1, opt.to == null ? Infinity : opt.to);
            if (!(b > a)) return;
            const n = Math.max(40, Math.ceil((b - a) * this.unit / 1.5));
            c.save();
            c.strokeStyle = color; c.lineWidth = opt.width || 2.6; c.lineJoin = 'round'; c.lineCap = 'round';
            c.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
            if (opt.dash) c.setLineDash(opt.dash);
            c.beginPath();
            let pen = false, lastY = null;
            for (let i = 0; i <= n; i++) {
                const x = a + (b - a) * i / n;
                const y = f(x);
                if (!isFinite(y)) { pen = false; lastY = null; continue; }
                const s = this.w2s([x, y]);
                // a jump across most of the screen is a pole, not a line
                if (pen && lastY != null && Math.abs(s[1] - lastY) > this.h * 1.2) pen = false;
                if (s[1] < -4 * this.h || s[1] > 5 * this.h) { pen = false; lastY = s[1]; continue; }
                if (pen) c.lineTo(s[0], s[1]); else { c.moveTo(s[0], s[1]); pen = true; }
                lastY = s[1];
            }
            c.stroke();
            c.restore();
        }

        /** Horizontal line y = y0 across the view (optionally only from x0 on). */
        hline(y0, color, opt = {}) {
            const [x0] = this.s2w([0, 0]), [x1] = this.s2w([this.w, 0]);
            this.segment([opt.from == null ? x0 : opt.from, y0], [opt.to == null ? x1 : opt.to, y0], color, opt);
        }
        /** Vertical line x = x0 across the view. */
        vline(x0, color, opt = {}) {
            const [, y1] = this.s2w([0, 0]), [, y0] = this.s2w([0, this.h]);
            this.segment([x0, opt.from == null ? y0 : opt.from], [x0, opt.to == null ? y1 : opt.to], color, opt);
        }

        /** Arc of radius r (world) around m from t0 to t1, mathematical sense (counter-clockwise). */
        arcW(m, r, t0, t1, color, opt = {}) {
            const c = this.ctx, s = this.w2s(m);
            c.save();
            c.strokeStyle = color; c.lineWidth = opt.width || 2; c.lineCap = 'round';
            c.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
            if (opt.dash) c.setLineDash(opt.dash);
            c.beginPath();
            c.ellipse(s[0], s[1], Math.abs(r * this.unit), Math.abs(r * this.uy), 0, -t0, -t1, t1 > t0);
            c.stroke();
            c.restore();
        }
        /** Filled circular sector. */
        sector(m, r, t0, t1, color, alpha = 0.16) {
            const c = this.ctx, s = this.w2s(m);
            c.save();
            c.fillStyle = color; c.globalAlpha = alpha;
            c.beginPath(); c.moveTo(s[0], s[1]);
            c.ellipse(s[0], s[1], r * this.unit, r * this.uy, 0, -t0, -t1, t1 > t0);
            c.closePath(); c.fill();
            c.restore();
        }
        /** Full circle outline. */
        circle(m, r, color, opt = {}) { this.arcW(m, r, 0, TAU, color, opt); }

        /** Dimension line from a to b with end bars and a label beside the middle. */
        dim(a, b, color, label, opt = {}) {
            const c = this.ctx, A = this.w2s(a), B = this.w2s(b);
            const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
            const nx = -dy / L, ny = dx / L, bar = 5;
            c.save();
            c.strokeStyle = color; c.lineWidth = opt.width || 1.5; c.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
            c.beginPath();
            c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]);
            c.moveTo(A[0] + nx * bar, A[1] + ny * bar); c.lineTo(A[0] - nx * bar, A[1] - ny * bar);
            c.moveTo(B[0] + nx * bar, B[1] + ny * bar); c.lineTo(B[0] - nx * bar, B[1] - ny * bar);
            c.stroke();
            c.restore();
            if (label) {
                const off = opt.offset == null ? 14 : opt.offset;
                const mid = [(A[0] + B[0]) / 2 + nx * off, (A[1] + B[1]) / 2 + ny * off];
                this.text(label, this.s2w(mid), color, { font: opt.font || "600 12px 'Orbitron', sans-serif" });
            }
        }

        /** Text in screen pixels, for labels that must not move with zoom. */
        label(t, p, color, opt = {}) { this.text(t, p, color, Object.assign({ font: "600 13px 'Orbitron', sans-serif" }, opt)); }

        // ---- interaction: like Stage2D, but pan and zoom respect the y scale ----
        _wire() {
            const pos = e => {
                const r = this.cv.getBoundingClientRect();
                return [e.clientX - r.left, e.clientY - r.top];
            };
            this.cv.addEventListener('pointerdown', e => {
                const sp = pos(e);
                const i = this._pick(sp);
                if (i >= 0) this.drag = i;
                else this.pan = { sp, cx: this.cx, cy: this.cy };
                this.cv.setPointerCapture(e.pointerId);
                e.preventDefault();
            });
            this.cv.addEventListener('pointermove', e => {
                const sp = pos(e);
                if (this.drag != null) {
                    this.handles[this.drag].set(this.s2w(sp));
                    if (this.onChange) this.onChange();
                    this.render();
                } else if (this.pan) {
                    this.cx = this.pan.cx - (sp[0] - this.pan.sp[0]) / this.unit;
                    this.cy = this.pan.cy + (sp[1] - this.pan.sp[1]) / this.uy;
                    this.moved = true;
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
                this.unit = Math.max(1e-4, Math.min(4000, this.unit * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
                const after = this.s2w(sp);
                this.cx += before[0] - after[0];
                this.cy += before[1] - after[1];
                this.moved = true;
                this.render();
            }, { passive: false });
            // double click / double tap: back to the chapter's own framing
            this.cv.addEventListener('dblclick', () => this.resetView());
        }
    }

    // ==================================================================
    // Unit circle painter — one look for every chapter that shows it
    // ==================================================================
    /**
     * Circle with centre m and radius r, point P at angle x.
     * opt: axes, arc, sector, sin, cos, tri, label ('α' | 'x' | null), pointLabel,
     *      signs (quadrant signs), rad (radius line), coords (dashed lines to the axes)
     */
    function unitCircle(st, m, r, x, opt = {}) {
        const o = Object.assign({ axes: true, arc: true, sin: true, cos: true, rad: true, label: 'α', pointLabel: 'P' }, opt);
        const P = [m[0] + r * Math.cos(x), m[1] + r * Math.sin(x)];
        const F = [P[0], m[1]];              // foot of the sine segment on the horizontal axis
        if (o.axes) {
            // own little axis cross, used when the circle is not at the origin
            const e = r * 1.25;
            st.segment([m[0] - e, m[1]], [m[0] + e, m[1]], 'rgba(255,255,255,0.4)', { width: 1.2 });
            st.segment([m[0], m[1] - e], [m[0], m[1] + e], 'rgba(255,255,255,0.4)', { width: 1.2 });
            if (o.ticks !== false) {
                const f = "11px Arial, Helvetica, sans-serif";
                st.text('1', [m[0] + r, m[1]], 'rgba(255,255,255,0.55)', { dx: 7, dy: 10, font: f });
                st.text('1', [m[0], m[1] + r], 'rgba(255,255,255,0.55)', { dx: -9, dy: -8, font: f });
                st.text('−1', [m[0] - r, m[1]], 'rgba(255,255,255,0.55)', { dx: -11, dy: 10, font: f });
                st.text('−1', [m[0], m[1] - r], 'rgba(255,255,255,0.55)', { dx: -13, dy: 8, font: f });
            }
        }
        st.circle(m, r, 'rgba(255,255,255,0.55)', { width: 1.6 });
        if (o.signs) {
            const q = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
            const names = ['I', 'II', 'III', 'IV'];
            q.forEach((s, i) => {
                const at = [m[0] + s[0] * r * 0.62, m[1] + s[1] * r * 0.62];
                const active = Math.floor(wrap(x) / (PI / 2)) === i;
                st.text(names[i], at, active ? '#fff' : 'rgba(255,255,255,0.32)', { dy: -10, font: "700 12px 'Orbitron', sans-serif" });
                st.text((s[1] > 0 ? 'sin +' : 'sin −'), at, active ? C.sin : 'rgba(245,194,66,0.35)', { dy: 8, font: "600 11px Arial, Helvetica, sans-serif" });
                st.text((s[0] > 0 ? 'cos +' : 'cos −'), at, active ? C.cos : 'rgba(0,210,255,0.35)', { dy: 22, font: "600 11px Arial, Helvetica, sans-serif" });
            });
        }
        if (o.sector) st.sector(m, r, Math.min(0, x), Math.max(0, x), C.ang, 0.12);
        if (o.arc) {
            const ra = Math.min(r * 0.28, 0.45 * r);
            st.arcW(m, ra, 0, x, C.ang, { width: 2 });
            if (o.label) {
                const mid = x / 2;
                st.text(o.label, [m[0] + ra * 1.55 * Math.cos(mid), m[1] + ra * 1.55 * Math.sin(mid)], C.ang,
                    { font: "700 13px 'Orbitron', sans-serif" });
            }
        }
        if (o.arcLen) st.arcW(m, r, 0, x, C.ang, { width: 4.5, alpha: 0.9 });
        if (o.tri) st.polygon([m, F, P], C.sin, null, { alpha: 0.14 });
        if (o.coords) {
            st.segment(P, [m[0], P[1]], C.sin, { dash: [4, 4], width: 1.2, alpha: 0.6 });
        }
        if (o.rad) st.segment(m, P, C.rad, { width: 2.2 });
        if (o.cos) {
            st.segment(m, F, C.cos, { width: 4 });
            if (o.cosLabel !== false) st.text('cos', [(m[0] + F[0]) / 2, m[1]], C.cos, { dy: Math.sin(x) >= 0 ? 14 : -14, font: "700 12px 'Orbitron', sans-serif" });
        }
        if (o.sin) {
            st.segment(F, P, C.sin, { width: 4 });
            if (o.sinLabel !== false) st.text('sin', [F[0], (m[1] + P[1]) / 2], C.sin, { dx: Math.cos(x) >= 0 ? 22 : -22, font: "700 12px 'Orbitron', sans-serif" });
        }
        if (o.rightAngle !== false && Math.abs(Math.sin(x)) > 0.12 && Math.abs(Math.cos(x)) > 0.12 && (o.sin || o.cos)) {
            st.rightAngle(F, [-Math.sign(Math.cos(x)), 0], [0, Math.sign(Math.sin(x))], 'rgba(255,255,255,0.5)');
        }
        return P;
    }

    /**
     * Handle that moves along a circle; get/set speak radians. Without `range` the
     * angle wraps into [0, 2π). With range [lo, hi] it keeps winding (720° is a
     * second turn, not 0°) and stops at the ends — for the chapters with a graph.
     */
    function circleHandle(st, m, r, getX, setX, color, label, range) {
        st.addHandle(
            () => { const x = getX(); return [m[0] + r * Math.cos(x), m[1] + r * Math.sin(x)]; },
            w => {
                const t = Math.atan2(w[1] - m[1], w[0] - m[0]);
                if (!range) { setX(wrap(snapAngle(wrap(t))) % TAU); return; }
                // unwrap: take the turn nearest to the old angle
                const old = getX();
                const x = snapAngle(t + TAU * Math.round((old - t) / TAU));
                setX(Math.max(range[0], Math.min(range[1], x)));
            }, color, label);
    }

    window.TrigLab = Object.assign({}, window.VekLab, {
        PI, TAU, C, rad, deg, wrap, snapAngle, piFrac, piTex, piText, radTex, exactTex, valTex,
        degText, degTex, niceStep, TrigStage, unitCircle, circleHandle,
    });
})();
