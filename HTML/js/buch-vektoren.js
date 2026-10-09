/* buch-vektoren.js — widgets for the vector chapters (Lernbereich 5, Klasse 12) of the textbook (js/buch.js):
 * real 3D with Three.js (WebGL), loaded on demand from the CDN; drag to turn the coordinate system.
 *   raum-hero     a slowly turning coordinate system with a point and its vector (chapter opener)
 *   raum3d        points and vectors: position and connecting vector, length, midpoint · sum and difference · multiple
 *   skalarprodukt two vectors from the origin: scalar product, lengths, angle, orthogonal or not
 *   viereck3d     a quadrilateral in space: parallelogram, rectangle, rhombus, square? checked with vectors
 * Mathematical axes: x towards the viewer, y to the right, z up (as in the school book); in Three.js that is (y, z, x).
 * Labels are sprites inside the scene, so the frozen print picture (js/buch-druck.js) keeps them.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, div } = B;
    const W = B.widget;
    const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
    let threeP = null;
    const three = () => threeP || (threeP = import(THREE_URL));
    const PAL = { lambda: 'rgb(245,194,66)', cyan: '#7fd8ee', phi: 'rgb(160,200,90)', red: '#e2665a', violet: '#b8a4f2', white: '#e8edf5', dim: '#6d8199', pink: '#e682be', axis: '#8fa3bd' };
    const col = c => { const v = PAL[c] || c; return window.Farbschema && Farbschema.map ? Farbschema.map(v, 'line') : v; };

    // ---------- vector arithmetic on [x, y, z] ----------
    const add = (a, b) => a.map((v, i) => v + b[i]);
    const sub = (a, b) => a.map((v, i) => v - b[i]);
    const mul = (r, a) => a.map(v => r * v);
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const len = a => Math.sqrt(dot(a, a));
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const n2 = x => texNum(Math.abs(x) < 5e-13 ? 0 : x, 2);
    const vtex = a => '\\begin{pmatrix} ' + a.map(v => n2(v)).join(' \\\\ ') + ' \\end{pmatrix}';
    const ptex = (name, a) => name + '(' + a.map(v => n2(v)).join(' \\mid ') + ')';
    // a root written nicely: √12 → 2√3 is too much here; the decimal is enough beside the exact sum of squares
    const rootTex = s => Number.isInteger(Math.round(s * 1e6) / 1e6) && Math.abs(Math.sqrt(s) - Math.round(Math.sqrt(s))) < 1e-9 ? String(Math.round(Math.sqrt(s))) : '\\sqrt{' + n2(s) + '} \\approx ' + texNum(Math.sqrt(s), 3);

    /* ---------- the 3D stage ---------- */
    class Raum {
        constructor(box, opt = {}) {
            this.opt = Object.assign({ height: 360, L: 5, az: 0.62, el: 0.42, R: 13.5, spin: false, aria: 'Räumliches Koordinatensystem' }, opt);
            this.wrap = div(box, 'b-canvasbox vk-stage');
            this.wrap.style.height = this.opt.height + 'px';
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('role', 'img'); this.canvas.setAttribute('aria-label', this.opt.aria);
            this.wrap.appendChild(this.canvas);
            if (!this.opt.spin) { const h = div(this.wrap, 'vk-hint'); h.textContent = 'Ziehen zum Drehen'; }
            this.az = this.opt.az; this.el = this.opt.el;
            this.items = [];
            this.ready = three().then(T => this._init(T));
            B.later(this.ready);
        }
        _init(T) {
            this.T = T;
            this.renderer = new T.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, preserveDrawingBuffer: B.printing() });
            this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
            this.scene = new T.Scene();
            this.camera = new T.PerspectiveCamera(32, 1, 0.1, 200);
            this.scene.add(new T.AmbientLight(0xffffff, 0.75));
            const sun = new T.DirectionalLight(0xffffff, 0.9); sun.position.set(6, 10, 8); this.scene.add(sun);
            this.base = new T.Group(); this.scene.add(this.base);
            this.layer = new T.Group(); this.scene.add(this.layer);
            this._axes();
            this._drag();
            const fit = () => this._size();
            if (window.ResizeObserver) new ResizeObserver(fit).observe(this.wrap);
            addEventListener('resize', fit);
            addEventListener('farbschema', () => { this._clear(this.base); this._axes(); if (this.onScheme) this.onScheme(); this.render(); });
            this._size();
            if (this.opt.spin && !B.printing()) this._spin();
            return this;
        }
        // math (x, y, z) → three (y, z, x)
        v3(p) { return new this.T.Vector3(p[1], p[2], p[0]); }
        _size() {
            const w = this.wrap.clientWidth, h = this.wrap.clientHeight;
            if (!w || !h || !this.renderer) return;
            this.renderer.setSize(w, h, false);
            this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
            this.render();
        }
        _cam() {
            const R = this.opt.R, c = this.camera;
            c.position.set(R * Math.sin(this.az) * Math.cos(this.el), R * Math.sin(this.el), R * Math.cos(this.az) * Math.cos(this.el));
            c.lookAt(0, 1.4, 0);
        }
        render() { if (!this.renderer) return; this._cam(); this.renderer.render(this.scene, this.camera); }
        _drag() {
            const cv = this.canvas;
            cv.style.touchAction = 'pan-y'; cv.style.cursor = 'grab';
            let last = null;
            cv.addEventListener('pointerdown', e => { last = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; this.touched = true; });
            cv.addEventListener('pointermove', e => {
                if (!last) return;
                this.az -= (e.clientX - last[0]) * 0.008;
                this.el = Math.max(-0.2, Math.min(1.45, this.el + (e.clientY - last[1]) * 0.006));
                last = [e.clientX, e.clientY];
                this.render();
            });
            const end = () => { last = null; cv.style.cursor = 'grab'; };
            cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
        }
        _spin() {
            let vis = true;
            if (window.IntersectionObserver) new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(this.wrap);
            const tick = () => { if (vis && !this.touched) { this.az += 0.0035; this.render(); } requestAnimationFrame(tick); };
            requestAnimationFrame(tick);
        }
        _clear(g) { while (g.children.length) { const o = g.children.pop(); o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map) x.material.map.dispose(); x.material.dispose(); } }); } }
        clear() { this._clear(this.layer); }
        // ---- building blocks ----
        _mat(c, o = {}) { return new this.T.MeshStandardMaterial(Object.assign({ color: new this.T.Color(col(c)), roughness: 0.45, metalness: 0.05 }, o)); }
        line(a, b, c, o = {}, g = this.layer) {
            const T = this.T, geo = new T.BufferGeometry().setFromPoints([this.v3(a), this.v3(b)]);
            const m = o.dash ? new T.LineDashedMaterial({ color: new T.Color(col(c)), dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: o.opacity || 0.8 })
                : new T.LineBasicMaterial({ color: new T.Color(col(c)), transparent: true, opacity: o.opacity || 1 });
            const l = new T.Line(geo, m); if (o.dash) l.computeLineDistances();
            g.add(l); return l;
        }
        arrow(a, b, c, o = {}, g = this.layer) {
            const T = this.T, A = this.v3(a), Bv = this.v3(b), d = new T.Vector3().subVectors(Bv, A), L = d.length();
            if (L < 1e-6) return;
            const r = o.r || 0.055, head = Math.min(0.42, L * 0.35), grp = new T.Group();
            const shaft = new T.Mesh(new T.CylinderGeometry(r, r, L - head, 14), this._mat(c));
            shaft.position.y = (L - head) / 2;
            const tip = new T.Mesh(new T.ConeGeometry(r * 3, head, 18), this._mat(c));
            tip.position.y = L - head / 2;
            grp.add(shaft, tip);
            grp.position.copy(A);
            grp.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
            g.add(grp); return grp;
        }
        rod(a, b, c, r = 0.035, g = this.layer) {
            const T = this.T, A = this.v3(a), Bv = this.v3(b), d = new T.Vector3().subVectors(Bv, A), L = d.length();
            if (L < 1e-6) return;
            const m = new T.Mesh(new T.CylinderGeometry(r, r, L, 12), this._mat(c));
            m.position.copy(A).addScaledVector(d, 0.5);
            m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
            g.add(m); return m;
        }
        dot(p, c, r = 0.13, g = this.layer) {
            const m = new this.T.Mesh(new this.T.SphereGeometry(r, 22, 16), this._mat(c, { emissive: new this.T.Color(col(c)), emissiveIntensity: 0.25 }));
            m.position.copy(this.v3(p)); g.add(m); return m;
        }
        face(pts, c, opacity = 0.18, g = this.layer) {
            const T = this.T, geo = new T.BufferGeometry();
            const tri = [];
            for (let i = 1; i < pts.length - 1; i++) tri.push(pts[0], pts[i], pts[i + 1]);
            geo.setFromPoints(tri.map(p => this.v3(p)));
            geo.computeVertexNormals();
            const m = new T.Mesh(geo, new T.MeshBasicMaterial({ color: new T.Color(col(c)), transparent: true, opacity, side: T.DoubleSide, depthWrite: false }));
            g.add(m); return m;
        }
        label(text, p, c, size = 0.42, g = this.layer, italic = true) {
            const T = this.T, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
            const px = 64, font = (italic ? 'italic ' : '') + '600 ' + px + 'px Raleway, system-ui, sans-serif';
            ctx.font = font;
            const w = Math.ceil(ctx.measureText(text).width) + 24;
            cv.width = w; cv.height = px + 24;
            ctx.font = font; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
            ctx.fillStyle = col(c); ctx.fillText(text, w / 2, cv.height / 2);
            const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace;
            const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
            s.scale.set(size * w / cv.height, size, 1);
            s.position.copy(this.v3(p)); s.renderOrder = 10;
            g.add(s); return s;
        }
        // dashed lines from a point down to the x-y plane and over to the axes: the coordinate box
        box(p, c = 'dim', g = this.layer) {
            const [x, y, z] = p;
            this.line([x, y, 0], [x, y, z], c, { dash: true, opacity: 0.7 }, g);
            this.line([x, 0, 0], [x, y, 0], c, { dash: true, opacity: 0.55 }, g);
            this.line([0, y, 0], [x, y, 0], c, { dash: true, opacity: 0.55 }, g);
        }
        _axes() {
            const L = this.opt.L, g = this.base;
            [[[L + 0.8, 0, 0], 'x'], [[0, L + 0.8, 0], 'y'], [[0, 0, L + 0.8], 'z']].forEach(([e, n]) => {
                this.arrow(e.map(v => -v * (n === 'z' ? 0.25 : 0.55)), e, 'axis', { r: 0.022 }, g);
                this.label(n, e.map(v => v * 1.07), 'axis', 0.5, g);
                for (let k = 1; k <= L; k++) {
                    const t = e.map(v => (v ? k : 0));
                    this.dot(t, 'axis', 0.035, g);
                    if (k % (L > 6 ? 2 : 1) === 0) this.label(String(k), t.map((v, i) => v + (n === 'z' ? [0, -0.35, 0][i] : [0, 0, -0.35][i])), 'axis', 0.3, g, false);
                }
            });
            // a faint grid in the x-y plane
            const T = this.T, pts = [];
            for (let k = -L; k <= L; k++) { pts.push(this.v3([k, -L, 0]), this.v3([k, L, 0]), this.v3([-L, k, 0]), this.v3([L, k, 0])); }
            const grid = new T.LineSegments(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: new T.Color(col('cyan')), transparent: true, opacity: 0.07 }));
            g.add(grid);
        }
    }
    B.Raum = Raum;

    // a row of coordinate inputs: "A ( 2 | 1 | 3 )"
    function coords(parent, name, val, onChange, c) {
        const row = div(parent, 'vk-row'), vec = name.length === 1 && name === name.toLowerCase();
        row.innerHTML = '<span class="vk-name" style="color:' + (PAL[c] || '#fff') + '">' + (vec ? '$\\vec{' + name + '}$' : name) + '</span><span class="vk-par">(</span>' +
            val.map((v, i) => '<input class="b-in vk-in" type="number" step="0.5" min="-6" max="6" value="' + v + '" aria-label="' + (vec ? 'Vektor ' : 'Punkt ') + name + ', ' + 'xyz'[i] + '-Koordinate">').join('<span class="vk-par">|</span>') +
            '<span class="vk-par">)</span>';
        const ins = Array.from(row.querySelectorAll('input'));
        ins.forEach((inp, i) => inp.addEventListener('input', () => { const v = parseFloat(inp.value.replace(',', '.')); if (isFinite(v)) { val[i] = Math.max(-6, Math.min(6, v)); onChange(); } }));
        return { set(v) { v.forEach((x, i) => { val[i] = x; ins[i].value = x; }); } };
    }

    /* ---------- chapter opener ---------- */
    W('raum-hero', function (box) {
        const R = new Raum(box, { height: +(box.dataset.h || 240), L: 4, spin: true, R: 11.5, aria: 'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor' });
        R.ready.then(() => {
            const P = [3, 2, 3];
            R.arrow([0, 0, 0], P, 'lambda');
            R.dot(P, 'lambda'); R.label('P', add(P, [0, 0.3, 0.45]), 'lambda');
            R.box(P);
            R.arrow([0, 0, 0], [2, -2, 1], 'cyan');
            R.render();
        });
    });

    /* ---------- points and vectors ---------- */
    W('raum3d', function (box) {
        const S = { mode: box.dataset.mode || 'punkte', A: [2, -1, 1], B: [-1, 3, 4], a: [3, 1, 1], b: [-1, 2, 2], r: 2, minus: false, mid: true };
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, [['punkte', 'Punkte und Verbindungsvektor'], ['summe', 'Summe und Differenz'], ['vielfach', 'Vielfaches']], S.mode, v => { S.mode = v; ui(); draw(); }, 'Was wird gezeigt?');
        const inBox = div(box, 'vk-inputs');
        const R = new Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function ui() {
            inBox.innerHTML = '';
            if (S.mode === 'punkte') {
                coords(inBox, 'A', S.A, draw, 'cyan'); coords(inBox, 'B', S.B, draw, 'phi');
                const t = div(inBox, 'b-ctrls'); t.innerHTML = '<label class="b-ctrl"><input type="checkbox" ' + (S.mid ? 'checked' : '') + '> Mittelpunkt M zeigen</label>';
                t.querySelector('input').addEventListener('change', e => { S.mid = e.target.checked; draw(); });
            } else if (S.mode === 'summe') {
                coords(inBox, 'a', S.a, draw, 'cyan'); coords(inBox, 'b', S.b, draw, 'phi');
                const t = div(inBox, 'b-ctrls');
                B.seg(t, [['0', '$\\vec{a} + \\vec{b}$'], ['1', '$\\vec{a} - \\vec{b}$']], S.minus ? '1' : '0', v => { S.minus = v === '1'; draw(); }, 'Summe oder Differenz');
            } else {
                coords(inBox, 'a', S.a, draw, 'cyan');
                B.range(inBox, { label: 'Faktor $r$', min: -2, max: 3, step: 0.5, value: S.r, fmt: v => fmt(v, 1), onInput: v => { S.r = v; draw(); } });
            }
            math(inBox);
        }
        function draw() {
            R.ready.then(() => {
                R.clear();
                const O = [0, 0, 0];
                let html = '';
                if (S.mode === 'punkte') {
                    const { A, B: Bp } = S, AB = sub(Bp, A), M = mul(0.5, add(A, Bp)), s2 = dot(AB, AB);
                    R.arrow(O, A, 'cyan', { r: 0.03 }); R.arrow(O, Bp, 'phi', { r: 0.03 });
                    R.arrow(A, Bp, 'lambda');
                    R.dot(A, 'cyan'); R.dot(Bp, 'phi'); R.box(A, 'cyan'); R.box(Bp, 'phi');
                    R.label('A', add(A, [0, 0, 0.45]), 'cyan'); R.label('B', add(Bp, [0, 0, 0.45]), 'phi');
                    if (S.mid) { R.dot(M, 'red', 0.1); R.label('M', add(M, [0, 0.35, 0.35]), 'red'); }
                    html = '<p style="margin:0 0 6px">Ortsvektoren $\\vec{OA} = ' + vtex(S.A) + '$, $\\vec{OB} = ' + vtex(Bp) + '$ · Verbindungsvektor $\\vec{AB} = \\vec{OB} - \\vec{OA} = ' + vtex(AB) + '$</p>' +
                        '<p style="margin:0 0 6px">Länge: $|\\vec{AB}| = \\sqrt{' + AB.map(v => '(' + n2(v) + ')^2').join(' + ') + '} = ' + rootTex(s2) + '$</p>' +
                        (S.mid ? '<p style="margin:0">Mittelpunkt: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, also $' + ptex('M', M) + '$</p>' : '');
                } else if (S.mode === 'summe') {
                    const { a, b } = S, bb = S.minus ? mul(-1, b) : b, s = add(a, bb);
                    R.arrow(O, a, 'cyan'); R.arrow(a, s, S.minus ? 'pink' : 'phi');
                    R.arrow(O, b, 'phi', { r: 0.03 });
                    R.arrow(O, s, 'lambda', { r: 0.07 });
                    R.face([O, a, s, bb], 'lambda', 0.1);
                    R.line(bb, s, 'dim', { dash: true }); R.line(O, bb, 'dim', { dash: true });
                    R.label('a', mul(0.5, a).map((v, i) => v + [0, 0, 0.35][i]), 'cyan'); R.label(S.minus ? '−b' : 'b', add(a, mul(0.5, bb)).map((v, i) => v + [0, 0, 0.35][i]), S.minus ? 'pink' : 'phi');
                    R.label(S.minus ? 'a − b' : 'a + b', add(mul(0.55, s), [0, 0, -0.4]), 'lambda');
                    html = '<p style="margin:0 0 6px">$\\vec{a} ' + (S.minus ? '-' : '+') + ' \\vec{b} = ' + vtex(a) + (S.minus ? ' - ' : ' + ') + vtex(b) + ' = ' + vtex(s) + '$</p>' +
                        '<p style="margin:0">' + (S.minus ? 'Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.' : 'Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.') + '</p>';
                } else {
                    const { a, r } = S, ra = mul(r, a);
                    R.arrow(O, a, 'cyan', { r: 0.075 }); R.arrow(O, ra, 'lambda', { r: 0.045 });
                    R.label('a', add(mul(0.5, a), [0, 0, 0.4]), 'cyan'); R.label(fmt(r, 1) + ' · a', add(ra, [0, 0, 0.45]), 'lambda');
                    html = '<p style="margin:0 0 6px">$' + texNum(r, 1) + ' \\cdot ' + vtex(a) + ' = ' + vtex(ra) + '$</p>' +
                        '<p style="margin:0">' + (r < 0 ? 'Ein negativer Faktor dreht die Richtung um.' : r === 0 ? 'Mit $r = 0$ entsteht der Nullvektor.' : '') + ' Die Länge wird mit $|r| = ' + texNum(Math.abs(r), 1) + '$ multipliziert: $|r \\cdot \\vec{a}| \\approx ' + texNum(len(ra), 3) + '$.</p>';
                }
                out.innerHTML = html; math(out);
                R.render();
            });
        }
        ui(); draw();
    });

    /* ---------- scalar product and angle ---------- */
    W('skalarprodukt', function (box) {
        const S = { a: [3, 0, 1], b: [1, 3, 2] };
        const pre = div(box, 'b-ctrls');
        pre.innerHTML = '<span class="b-ctrl">Beispiele:</span>' + [['spitz', 'spitzer Winkel'], ['ortho', 'orthogonal'], ['stumpf', 'stumpfer Winkel'], ['para', 'parallel']]
            .map(([k, t]) => '<button type="button" class="b-btn" data-p="' + k + '">' + t + '</button>').join('');
        const inBox = div(box, 'vk-inputs');
        const ca = coords(inBox, 'a', S.a, draw, 'cyan'), cb = coords(inBox, 'b', S.b, draw, 'phi');
        math(inBox);
        const R = new Raum(box, { height: 360 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        const PRE = { spitz: [[3, 0, 1], [1, 3, 2]], ortho: [[2, 1, 2], [-1, 2, 0]], stumpf: [[3, 1, 0], [-2, 2, 1]], para: [[1, 2, 1], [2, 4, 2]] };
        pre.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; ca.set(PRE[b.dataset.p][0]); cb.set(PRE[b.dataset.p][1]); draw(); });
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { a, b } = S, O = [0, 0, 0], s = dot(a, b), la = len(a), lb = len(b);
                R.arrow(O, a, 'cyan'); R.arrow(O, b, 'phi');
                R.label('a', add(a, [0, 0, 0.4]), 'cyan'); R.label('b', add(b, [0, 0, 0.4]), 'phi');
                let ang = null;
                if (la > 1e-9 && lb > 1e-9) {
                    const c = Math.max(-1, Math.min(1, s / (la * lb)));
                    ang = Math.acos(c) * 180 / Math.PI;
                    // the angle as an arc between the two directions
                    const ua = mul(1 / la, a), n = cross(a, b);
                    const ub = len(n) < 1e-9 ? null : (() => { const w = sub(b, mul(dot(b, ua), ua)); return mul(1 / len(w), w); })();
                    if (ub) {
                        const r = Math.min(1.2, 0.45 * Math.min(la, lb)), phi = Math.acos(c), pts = [];
                        for (let i = 0; i <= 24; i++) { const t = phi * i / 24; pts.push(add(mul(r * Math.cos(t), ua), mul(r * Math.sin(t), ub))); }
                        for (let i = 0; i < 24; i++) R.line(pts[i], pts[i + 1], 'lambda');
                        R.face([O].concat(pts), 'lambda', 0.18);
                        R.label('φ', mul(1.45, pts[12]), 'lambda', 0.38);
                    }
                    // projection of b onto a
                    const proj = mul(s / (la * la), a);
                    R.line(b, proj, 'dim', { dash: true }); R.dot(proj, 'dim', 0.06);
                }
                out.innerHTML = '<p style="margin:0 0 6px">$\\vec{a} \\circ \\vec{b} = ' + a.map((v, i) => n2(v) + ' \\cdot ' + (b[i] < 0 ? '(' + n2(b[i]) + ')' : n2(b[i]))).join(' + ') + ' = ' + n2(s) + '$' +
                    (Math.abs(s) < 1e-9 && ang != null ? ' · <b>orthogonal</b>: $\\vec{a} \\perp \\vec{b}$' : '') + '</p>' +
                    '<p style="margin:0 0 6px">$|\\vec{a}| = ' + rootTex(dot(a, a)) + '$, $|\\vec{b}| = ' + rootTex(dot(b, b)) + '$</p>' +
                    (ang != null ? '<p style="margin:0">$\\cos \\varphi = \\dfrac{\\vec{a} \\circ \\vec{b}}{|\\vec{a}| \\cdot |\\vec{b}|} \\approx ' + texNum(s / (la * lb), 4) + '$, also $\\varphi \\approx ' + texNum(ang, 1) + '^\\circ$' +
                        (ang > 90.05 ? ' (stumpf: das Skalarprodukt ist negativ)' : ang < 89.95 && ang > 0.05 ? ' (spitz: das Skalarprodukt ist positiv)' : ang <= 0.05 ? ' (parallel, gleiche Richtung)' : '') + '</p>' : '<p style="margin:0">Mit dem Nullvektor gibt es keinen Winkel.</p>');
                math(out);
                R.render();
            });
        }
        draw();
    });

    /* ---------- a quadrilateral in space ---------- */
    W('viereck3d', function (box) {
        const PRE = {
            para: { k: 'Parallelogramm', p: [[3, -1, 0], [3, 3, 1], [-1, 4, 3], [-1, 0, 2]] },
            recht: { k: 'Rechteck', p: [[2, -2, 0], [2, 2, 0], [-1, 2, 4], [-1, -2, 4]] },
            raute: { k: 'Raute', p: [[2, 0, 0], [0, 3, 1], [-2, 0, 2], [0, -3, 1]] },
            quadrat: { k: 'Quadrat', p: [[3, -2, 0], [3, 2, 0], [3, 2, 4], [3, -2, 4]] },
            trapez: { k: 'Trapez', p: [[3, -3, 0], [3, 3, 0], [0, 2, 3], [0, -1, 3]] }
        };
        const pts = PRE.para.p.map(q => q.slice());
        const pre = div(box, 'b-ctrls');
        pre.innerHTML = '<span class="b-ctrl">Beispiele:</span>' + Object.keys(PRE).map(k => '<button type="button" class="b-btn" data-p="' + k + '">' + PRE[k].k + '</button>').join('');
        const inBox = div(box, 'vk-inputs vk-four');
        const cs = ['A', 'B', 'C', 'D'].map((n, i) => coords(inBox, n, pts[i], draw, ['cyan', 'phi', 'pink', 'violet'][i]));
        pre.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; PRE[b.dataset.p].p.forEach((q, i) => cs[i].set(q.slice())); draw(); });
        const R = new Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        const yes = (ok, t) => '<li>' + (ok ? '✔' : '✘') + ' ' + t + '</li>';
        function draw() {
            R.ready.then(() => {
                R.clear();
                const [A, Bp, C, D] = pts, AB = sub(Bp, A), DC = sub(C, D), AD = sub(D, A), BC = sub(C, Bp), AC = sub(C, A), BD = sub(D, Bp);
                const eq = (u, v) => len(sub(u, v)) < 1e-9;
                const planar = Math.abs(dot(cross(AB, AD), AC)) < 1e-9;
                const para = eq(AB, DC), right = Math.abs(dot(AB, AD)) < 1e-9, same = Math.abs(len(AB) - len(AD)) < 1e-9, diag = Math.abs(dot(AC, BD)) < 1e-9;
                const parAB = len(cross(AB, DC)) < 1e-9, parAD = len(cross(AD, BC)) < 1e-9;
                const kind = !planar ? 'kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.' :
                    para && right && same ? 'ein <b>Quadrat</b>' : para && right ? 'ein <b>Rechteck</b>' : para && same ? 'eine <b>Raute</b>' : para ? 'ein <b>Parallelogramm</b>' :
                    parAB || parAD ? 'ein <b>Trapez</b> (ein Paar paralleler Seiten)' : 'ein allgemeines Viereck';
                R.face([A, Bp, C, D], planar ? 'lambda' : 'red', 0.16);
                [[A, Bp], [Bp, C], [C, D], [D, A]].forEach(([u, v]) => R.rod(u, v, 'lambda'));
                R.line(A, C, 'dim', { dash: true }); R.line(Bp, D, 'dim', { dash: true });
                [A, Bp, C, D].forEach((q, i) => { const c = ['cyan', 'phi', 'pink', 'violet'][i]; R.dot(q, c); R.label('ABCD'[i], add(q, [0, 0, 0.45]), c); });
                out.innerHTML = '<p style="margin:0 0 6px">$\\vec{AB} = ' + vtex(AB) + '$, $\\vec{DC} = ' + vtex(DC) + '$, $\\vec{AD} = ' + vtex(AD) + '$</p><ul style="margin:0 0 6px;padding-left:1.2em;list-style:none">' +
                    yes(para, '$\\vec{AB} = \\vec{DC}$: gegenüberliegende Seiten parallel und gleich lang') +
                    yes(right, '$\\vec{AB} \\circ \\vec{AD} = ' + n2(dot(AB, AD)) + '$: rechter Winkel bei $A$') +
                    yes(same, '$|\\vec{AB}| \\approx ' + texNum(len(AB), 3) + '$ und $|\\vec{AD}| \\approx ' + texNum(len(AD), 3) + '$: benachbarte Seiten gleich lang') +
                    yes(diag, '$\\vec{AC} \\circ \\vec{BD} = ' + n2(dot(AC, BD)) + '$: Diagonalen senkrecht zueinander') + '</ul>' +
                    '<p style="margin:0">$ABCD$ ist ' + kind + '</p>';
                math(out);
                R.render();
            });
        }
        draw();
    });
})();
