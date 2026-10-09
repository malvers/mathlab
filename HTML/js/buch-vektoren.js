/* buch-vektoren.js — widgets for the vector chapters (Lernbereich 5, Klasse 12) of the textbook (js/buch.js):
 * real 3D with Three.js (WebGL), loaded on demand from the CDN; drag to turn the coordinate system.
 *   raum-hero     a slowly turning coordinate system with a point and its vector (chapter opener)
 *   raum3d        points and vectors: position and connecting vector, length, midpoint · sum and difference · multiple
 *   skalarprodukt two vectors from the origin: scalar product, lengths, angle, orthogonal or not
 *   viereck3d     a quadrilateral in space: parallelogram, rectangle, rhombus, square? checked with vectors
 *   gerade3d      a line in space: parametric equation, moving point, point test, trace points (Klasse 13)
 *   geradenlage   two lines: identical, parallel, intersecting (with S) or skew (with the shortest distance)
 *   ebene3d       a plane: parametric form → normal vector (cross product) → coordinate equation, trace triangle;
 *                 point test; line through the plane with intersection point and angle
 *   pyramide      pyramid and (oblique) prism: base, volume, lateral surface with cross products
 *   kreuzprodukt  the cross product of two vectors: normal vector, area of parallelogram and triangle (book FOS 12)
 *   lot3d         the perpendicular from a point to a plane: foot, distance, mirror point (book FOS 12)
 *   zentralprojektion  a box and a row of posts in central projection with a draggable vanishing point, 2D (book FOS 12)
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
    /* =========================== Klasse 13: lines and planes (Wahlpflicht 1) =========================== */
    const near0 = x => Math.abs(x) < 1e-9;
    const g3 = v => v.map(x => n2(x)).join(' \\mid ');
    function presetRow(parent, items, onPick) {
        const row = div(parent, 'b-ctrls');
        row.innerHTML = '<span class="b-ctrl">Beispiele:</span>' + Object.keys(items).map(k => '<button type="button" class="b-btn" data-p="' + k + '">' + items[k].k + '</button>').join('');
        row.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b) onPick(items[b.dataset.p]); });
        return row;
    }

    /* ---------- a line in space: parametric equation, point test, trace points ---------- */
    W('gerade3d', function (box) {
        const S = { P: [1, 2, 1], u: [1, -1, 2], Q: [3, 0, 5], t: 1 };
        const inBox = div(box, 'vk-inputs');
        coords(inBox, 'P', S.P, draw, 'cyan'); coords(inBox, 'u', S.u, draw, 'pink'); coords(inBox, 'Q', S.Q, draw, 'violet');
        math(inBox);
        B.range(div(box, ''), { label: 'Parameter $t$', min: -3, max: 3, step: 0.25, value: S.t, fmt: v => fmt(v, 2), onInput: v => { S.t = v; draw(); } });
        const R = new Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { P, u, Q, t } = S;
                if (len(u) < 1e-9) { out.innerHTML = '<p style="margin:0">Der Richtungsvektor darf nicht der Nullvektor sein.</p>'; R.render(); return; }
                R.line(add(P, mul(-5, u)), add(P, mul(5, u)), 'lambda');
                R.arrow(P, add(P, u), 'pink'); R.dot(P, 'cyan'); R.label('P', add(P, [0, 0, 0.45]), 'cyan');
                const X = add(P, mul(t, u)); R.dot(X, 'lambda', 0.11); R.label('X', add(X, [0, 0.35, 0.4]), 'lambda');
                // trace points with the coordinate planes
                const tr = [[2, 'S_{xy}', 'xy'], [1, 'S_{xz}', 'xz'], [0, 'S_{yz}', 'yz']].filter(([i]) => !near0(u[i])).map(([i, tex, nm]) => { const tt = -P[i] / u[i]; return [add(P, mul(tt, u)), tex, nm]; });
                tr.forEach(([pt, , nm]) => { if (pt.every(v => Math.abs(v) <= 7)) { R.dot(pt, 'red', 0.08); R.label('S' + nm, add(pt, [0, 0.3, -0.35]), 'red', 0.3); } });
                // point test for Q
                const ts = [0, 1, 2].filter(i => !near0(u[i])).map(i => (Q[i] - P[i]) / u[i]);
                const on = ts.length && ts.every(x => Math.abs(x - ts[0]) < 1e-9) && [0, 1, 2].every(i => !near0(u[i]) || near0(Q[i] - P[i]));
                R.dot(Q, 'violet', 0.1); R.label('Q', add(Q, [0, 0, 0.45]), 'violet');
                out.innerHTML = '<p style="margin:0 0 6px">$g\\colon \\vec{x} = ' + vtex(P) + ' + t \\cdot ' + vtex(u) + '$ · $t = ' + texNum(t, 2) + '$: $X(' + g3(X) + ')$</p>' +
                    '<p style="margin:0 0 6px">Punktprobe für $Q(' + g3(Q) + ')$: ' + (on ? 'Alle Zeilen liefern $t = ' + texNum(ts[0], 3) + '$, also <b>$Q \\in g$</b>.' : 'Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.') + '</p>' +
                    '<p style="margin:0">Spurpunkte: ' + (tr.length ? tr.map(([pt, tex]) => '$' + tex + '(' + g3(pt) + ')$').join(' · ') : 'keine') + '</p>';
                math(out); R.render();
            });
        }
        draw();
    });

    /* ---------- two lines: identical, parallel, intersecting or skew ---------- */
    W('geradenlage', function (box) {
        const PRE = {
            sch: { k: 'schneidend', P: [1, 0, 1], u: [1, 1, 0], Q: [2, 3, 0], v: [1, -1, 1] },
            par: { k: 'parallel', P: [1, 0, 1], u: [1, 1, 0], Q: [0, 2, 3], v: [2, 2, 0] },
            ide: { k: 'identisch', P: [1, 0, 1], u: [1, 1, 0], Q: [4, 3, 1], v: [-1, -1, 0] },
            win: { k: 'windschief', P: [1, 0, 1], u: [1, 1, 0], Q: [0, 0, 4], v: [0, 1, -1] }
        };
        const S = { P: PRE.sch.P.slice(), u: PRE.sch.u.slice(), Q: PRE.sch.Q.slice(), v: PRE.sch.v.slice() };
        presetRow(box, PRE, pr => { ['P', 'u', 'Q', 'v'].forEach((k, i) => cs[i].set(pr[k].slice())); draw(); });
        const inBox = div(box, 'vk-inputs vk-four');
        const cs = [['P', 'P', 'cyan'], ['u', 'u', 'cyan'], ['Q', 'Q', 'phi'], ['v', 'v', 'phi']].map(([key, nm, c]) => coords(inBox, nm, S[key], draw, c));
        math(inBox);
        const R = new Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { P, u, Q, v } = S;
                if (len(u) < 1e-9 || len(v) < 1e-9) { out.innerHTML = '<p style="margin:0">Richtungsvektoren dürfen nicht der Nullvektor sein.</p>'; R.render(); return; }
                R.line(add(P, mul(-6 / len(u) * 2, u)), add(P, mul(6 / len(u) * 2, u)), 'cyan');
                R.line(add(Q, mul(-6 / len(v) * 2, v)), add(Q, mul(6 / len(v) * 2, v)), 'phi');
                R.dot(P, 'cyan', 0.1); R.label('g', add(P, [0, 0, 0.45]), 'cyan'); R.dot(Q, 'phi', 0.1); R.label('h', add(Q, [0, 0, 0.45]), 'phi');
                let html;
                const cr = cross(u, v);
                if (len(cr) < 1e-9) {
                    const same = len(cross(sub(Q, P), u)) < 1e-9;
                    html = 'Die Richtungsvektoren sind parallel ($\\vec{v} = ' + texNum(v.find(x => !near0(x)) / u[v.findIndex(x => !near0(x))], 3) + ' \\cdot \\vec{u}$). ' +
                        (same ? 'Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.' : 'Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.');
                } else {
                    const w0 = sub(P, Q), a = dot(u, u), b = dot(u, v), c = dot(v, v), d = dot(u, w0), e = dot(v, w0), den = a * c - b * b;
                    const t = (b * e - c * d) / den, s2 = (a * e - b * d) / den, Pc = add(P, mul(t, u)), Qc = add(Q, mul(s2, v)), dist = len(sub(Pc, Qc));
                    if (dist < 1e-7) {
                        R.dot(Pc, 'lambda', 0.14); R.label('S', add(Pc, [0, 0.3, 0.45]), 'lambda');
                        html = 'Nicht parallel. Gleichsetzen ergibt $t = ' + texNum(t, 3) + '$, $s = ' + texNum(s2, 3) + '$: <b>schneidend</b> im Punkt $S(' + g3(Pc) + ')$.';
                    } else {
                        R.line(Pc, Qc, 'red', { dash: true }); R.dot(Pc, 'red', 0.07); R.dot(Qc, 'red', 0.07);
                        html = 'Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ' + texNum(dist, 3) + '$.';
                    }
                }
                out.innerHTML = '<p style="margin:0 0 6px">$g\\colon \\vec{x} = ' + vtex(P) + ' + t \\cdot ' + vtex(u) + '$, $\\;h\\colon \\vec{x} = ' + vtex(Q) + ' + s \\cdot ' + vtex(v) + '$</p><p style="margin:0">' + html + '</p>';
                math(out); R.render();
            });
        }
        draw();
    });

    /* ---------- a plane: parametric form, normal vector, coordinate equation, point test, line through the plane ---------- */
    function ints(n) {                                         // smallest integer multiple, if the vector has integer ratios
        const r = n.map(x => Math.round(x * 1e6) / 1e6);
        if (!r.every(x => Number.isInteger(x))) return n;
        const g = r.filter(x => x).reduce((a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }, 0) || 1;
        return r.map(x => x / g);
    }
    W('ebene3d', function (box) {
        const S = { mode: box.dataset.mode || 'ebene', A: [4, 0, 0], u: [-4, 3, 0], v: [-4, 0, 2], Q: [2, 1.5, 0], P: [3, 3, 3], w: [-1, -1, -1] };
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, [['ebene', 'Ebene und Normalenvektor'], ['punkt', 'Liegt der Punkt in E?'], ['gerade', 'Gerade schneidet Ebene']], S.mode, v => { S.mode = v; ui(); draw(); }, 'Was wird gezeigt?');
        const inBox = div(box, 'vk-inputs vk-four');
        const R = new Raum(box, { height: 400 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function ui() {
            inBox.innerHTML = '';
            coords(inBox, 'A', S.A, draw, 'cyan'); coords(inBox, 'u', S.u, draw, 'violet'); coords(inBox, 'v', S.v, draw, 'violet');
            if (S.mode === 'punkt') coords(inBox, 'Q', S.Q, draw, 'phi');
            if (S.mode === 'gerade') { coords(inBox, 'P', S.P, draw, 'phi'); coords(inBox, 'w', S.w, draw, 'phi'); }
            math(inBox);
        }
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { A, u, v } = S, n0 = cross(u, v);
                if (len(n0) < 1e-9) { out.innerHTML = '<p style="margin:0">$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.</p>'; math(out); R.render(); return; }
                const n = ints(n0), d = dot(n, A);
                // the patch: the trace triangle if the plane cuts all three axes in the picture, else a parallelogram around A
                const ax = [0, 1, 2].map(i => near0(n[i]) ? null : d / n[i]);
                if (ax.every(x => x != null && Math.abs(x) <= 6 && !near0(x))) {
                    const T = ax.map((x, i) => [0, 1, 2].map(j => (j === i ? x : 0)));
                    R.face(T, 'violet', 0.28); T.forEach((p, i) => { R.rod(p, T[(i + 1) % 3], 'violet', 0.025); R.dot(p, 'violet', 0.08); });
                } else {
                    const c = [add(A, add(mul(-2, u), mul(-2, v))), add(A, add(mul(2, u), mul(-2, v))), add(A, add(mul(2, u), mul(2, v))), add(A, add(mul(-2, u), mul(2, v)))];
                    R.face(c, 'violet', 0.22);
                }
                R.dot(A, 'cyan'); R.label('A', add(A, [0, 0.3, 0.4]), 'cyan');
                R.arrow(A, add(A, u), 'violet', { r: 0.035 }); R.arrow(A, add(A, v), 'violet', { r: 0.035 });
                const nu = mul(2 / len(n), n);
                R.arrow(A, add(A, nu), 'pink'); R.label('n', add(A, mul(1.15, nu)), 'pink');
                const cf = n.map((x, i) => ({ x, v: 'xyz'[i] })).filter(o => !near0(o.x)).map((o, i) => (i ? (o.x < 0 ? ' - ' : ' + ') : (o.x < 0 ? '-' : '')) + (Math.abs(Math.abs(o.x) - 1) < 1e-9 ? '' : n2(Math.abs(o.x))) + o.v).join('');
                let html = '<p style="margin:0 0 6px">$E\\colon \\vec{x} = ' + vtex(A) + ' + r \\cdot ' + vtex(u) + ' + s \\cdot ' + vtex(v) + '$</p>' +
                    '<p style="margin:0 0 6px">Normalenvektor $\\vec{n} = \\vec{u} \\times \\vec{v} = ' + vtex(n0) + (len(sub(n, n0)) > 1e-9 ? ' \\parallel ' + vtex(n) : '') + '$ · Koordinatenform: $' + cf + ' = ' + n2(d) + '$</p>';
                if (S.mode === 'ebene') html += '<p style="margin:0">Spurpunkte mit den Achsen: ' + ax.map((x, i) => x == null ? '' : '$S_' + 'xyz'[i] + '(' + g3([0, 1, 2].map(j => (j === i ? x : 0))) + ')$').filter(Boolean).join(' · ') + '</p>';
                if (S.mode === 'punkt') {
                    const Q = S.Q, val = dot(n, Q), on = Math.abs(val - d) < 1e-9;
                    R.dot(Q, 'phi', 0.12); R.label('Q', add(Q, [0, 0, 0.45]), 'phi');
                    html += '<p style="margin:0">Punktprobe: $' + cf.replace(/x/, '(' + n2(Q[0]) + ')').replace(/y/, '(' + n2(Q[1]) + ')').replace(/z/, '(' + n2(Q[2]) + ')') + ' = ' + n2(val) + '$ ' + (on ? '$= ' + n2(d) + '$: <b>$Q$ liegt in $E$</b>.' : '$\\neq ' + n2(d) + '$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ' + texNum(Math.abs(val - d) / len(n), 3) + '$.') + '</p>';
                }
                if (S.mode === 'gerade') {
                    const P = S.P, w = S.w, nw = dot(n, w);
                    R.line(add(P, mul(-4, w)), add(P, mul(4, w)), 'phi'); R.dot(P, 'phi', 0.1); R.label('g', add(P, [0, 0, 0.45]), 'phi');
                    if (near0(nw)) html += '<p style="margin:0">$\\vec{n} \\circ \\vec{w} = 0$: Die Gerade ist parallel zur Ebene ' + (Math.abs(dot(n, P) - d) < 1e-9 ? 'und liegt in ihr.' : 'und schneidet sie nicht.') + '</p>';
                    else {
                        const t = (d - dot(n, P)) / nw, Sx = add(P, mul(t, w)), sinp = Math.abs(nw) / (len(n) * len(w));
                        R.dot(Sx, 'lambda', 0.13); R.label('S', add(Sx, [0, 0.3, 0.4]), 'lambda');
                        html += '<p style="margin:0">Einsetzen von $g$ in $E$: $t = ' + texNum(t, 3) + '$, Schnittpunkt $S(' + g3(Sx) + ')$ · Schnittwinkel: $\\sin \\varphi = \\dfrac{|\\vec{n} \\circ \\vec{w}|}{|\\vec{n}| \\cdot |\\vec{w}|} \\approx ' + texNum(sinp, 4) + '$, $\\varphi \\approx ' + texNum(Math.asin(sinp) * 180 / Math.PI, 1) + '^\\circ$</p>';
                    }
                }
                out.innerHTML = html; math(out); R.render();
            });
        }
        ui(); draw();
    });

    /* ---------- pyramid and prism: volume and surface with vectors ---------- */
    W('pyramide', function (box) {
        const S = { kind: 'pyr', a: 4, h: 4, sx: 2, sy: 2 };
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, [['pyr', 'Pyramide'], ['pri', 'Prisma (schief möglich)']], S.kind, v => { S.kind = v; draw(); }, 'Körper');
        const sl = div(box, '');
        B.range(sl, { label: 'Grundkante $a$', min: 2, max: 5, step: 0.5, value: S.a, fmt: v => fmt(v, 1), onInput: v => { S.a = v; draw(); } });
        B.range(sl, { label: 'Höhe $h$', min: 1, max: 5, step: 0.5, value: S.h, fmt: v => fmt(v, 1), onInput: v => { S.h = v; draw(); } });
        B.range(sl, { label: 'Verschiebung der Spitze in $x$', min: 0, max: 4, step: 0.5, value: S.sx, fmt: v => fmt(v, 1), onInput: v => { S.sx = v; draw(); } });
        math(sl);
        const R = new Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        const tri = (p, q, r) => len(cross(sub(q, p), sub(r, p))) / 2;
        function draw() {
            R.ready.then(() => {
                R.clear();
                const a = S.a, A = [0, 0, 0], Bp = [a, 0, 0], C = [a, a, 0], D = [0, a, 0], base = [A, Bp, C, D];
                R.face(base, 'cyan', 0.18); base.forEach((p, i) => R.rod(p, base[(i + 1) % 4], 'cyan', 0.03));
                let html;
                const G = len(cross(sub(Bp, A), sub(D, A)));
                if (S.kind === 'pyr') {
                    const Sp = [S.sx * a / 4, a / 2, S.h];
                    base.forEach((p, i) => { R.rod(p, Sp, 'lambda', 0.025); R.face([p, base[(i + 1) % 4], Sp], 'lambda', 0.12); });
                    R.dot(Sp, 'lambda', 0.1); R.label('S', add(Sp, [0, 0, 0.45]), 'lambda');
                    R.line(Sp, [Sp[0], Sp[1], 0], 'red', { dash: true });
                    const M = base.reduce((s2, p, i) => s2 + tri(p, base[(i + 1) % 4], Sp), 0);
                    html = '<p style="margin:0 0 6px">Grundfläche $G = |\\vec{AB} \\times \\vec{AD}| = ' + n2(G) + '$, Spitze $S(' + g3(Sp) + ')$, Höhe $h = ' + n2(S.h) + '$ (rot)</p>' +
                        '<p style="margin:0 0 6px">Volumen $V = \\tfrac13 \\cdot G \\cdot h \\approx ' + texNum(G * S.h / 3, 3) + '$ · Mantel (4 Dreiecke, je $\\tfrac12 |\\vec{a} \\times \\vec{b}|$) $\\approx ' + texNum(M, 3) + '$</p>' +
                        '<p style="margin:0">Oberfläche $O = G + M \\approx ' + texNum(G + M, 3) + '$ · Verschiebst du die Spitze waagerecht, bleibt das Volumen gleich, der Mantel nicht.</p>';
                } else {
                    const w = [S.sx - 2, 0, S.h], top = base.map(p => add(p, w));
                    R.face(top, 'cyan', 0.18); top.forEach((p, i) => { R.rod(p, top[(i + 1) % 4], 'cyan', 0.03); R.rod(base[i], p, 'lambda', 0.025); R.face([base[i], base[(i + 1) % 4], top[(i + 1) % 4], p], 'lambda', 0.1); });
                    const M = base.reduce((s2, p, i) => s2 + len(cross(sub(base[(i + 1) % 4], p), w)), 0);
                    html = '<p style="margin:0 0 6px">Grundfläche $G = ' + n2(G) + '$, Verschiebung der Deckfläche $\\vec{w} = ' + vtex(w) + '$, Höhe $h = ' + n2(S.h) + '$</p>' +
                        '<p style="margin:0 0 6px">Volumen $V = G \\cdot h = ' + texNum(G * S.h, 3) + '$ (Prinzip von Cavalieri: auch schief) · Mantel (4 Parallelogramme, je $|\\vec{a} \\times \\vec{w}|$) $\\approx ' + texNum(M, 3) + '$</p>' +
                        '<p style="margin:0">Oberfläche $O = 2G + M \\approx ' + texNum(2 * G + M, 3) + '$</p>';
                }
                out.innerHTML = html; math(out); R.render();
            });
        }
        draw();
    });

    /* =========================== Book FOS 12: cross product, perpendicular foot, central projection =========================== */
    // a coordinate equation "x + 2y + 2z" from a normal vector (the same writing as in ebene3d)
    const coordTex = n => n.map((x, i) => ({ x, v: 'xyz'[i] })).filter(o => !near0(o.x)).map((o, i) => (i ? (o.x < 0 ? ' - ' : ' + ') : (o.x < 0 ? '-' : '')) + (Math.abs(Math.abs(o.x) - 1) < 1e-9 ? '' : n2(Math.abs(o.x))) + o.v).join('') || '0';
    const par = x => (x < 0 ? '(' + n2(x) + ')' : n2(x));
    // two unit vectors in the plane with normal n (for patches and right-angle marks)
    function inPlane(n) {
        const nh = mul(1 / len(n), n), a = Math.abs(nh[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
        const e1 = (() => { const c = cross(nh, a); return mul(1 / len(c), c); })();
        return [e1, cross(nh, e1)];
    }

    /* ---------- the cross product: a normal vector and the area of parallelogram and triangle ---------- */
    W('kreuzprodukt', function (box) {
        const PRE = {
            schief: { k: 'zwei Vektoren', u: [2, 1, 0], v: [1, 3, 2] },
            dach: { k: 'Dachfläche', u: [0, 4, 0], v: [-2, 0, 2] },
            achsen: { k: 'in der x-y-Ebene', u: [3, 0, 0], v: [0, 2, 0] },
            para: { k: 'parallel', u: [1, 2, 1], v: [2, 4, 2] }
        };
        const S = { u: PRE.schief.u.slice(), v: PRE.schief.v.slice(), tri: false };
        presetRow(box, PRE, pr => { cu.set(pr.u.slice()); cv.set(pr.v.slice()); draw(); });
        const inBox = div(box, 'vk-inputs');
        const cu = coords(inBox, 'u', S.u, draw, 'cyan'), cv = coords(inBox, 'v', S.v, draw, 'phi');
        B.seg(div(inBox, 'b-ctrls'), [['0', 'Parallelogramm'], ['1', 'Dreieck']], '0', v => { S.tri = v === '1'; draw(); }, 'Welche Fläche?');
        math(inBox);
        const R = new Raum(box, { height: 380 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        const IJ = [[1, 2], [2, 0], [0, 1]];
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { u, v } = S, O = [0, 0, 0], n = cross(u, v), A = len(n), s = add(u, v);
                R.face(S.tri ? [O, u, v] : [O, u, s, v], 'lambda', 0.22);
                if (S.tri) R.rod(u, v, 'lambda', 0.025);
                else { R.line(u, s, 'dim', { dash: true }); R.line(v, s, 'dim', { dash: true }); }
                R.arrow(O, u, 'cyan'); R.arrow(O, v, 'phi');
                R.label('u', add(u, [0, 0, 0.4]), 'cyan'); R.label('v', add(v, [0, 0, 0.4]), 'phi');
                const comp = IJ.map(([i, j]) => n2(u[i]) + ' \\cdot ' + par(v[j]) + ' - ' + par(u[j]) + ' \\cdot ' + par(v[i]));
                let html = '<p style="margin:0 0 6px">$\\vec{u} \\times \\vec{v} = \\begin{pmatrix} ' + comp.join(' \\\\ ') + ' \\end{pmatrix} = ' + vtex(n) + '$</p>';
                if (A < 1e-9) {
                    html += '<p style="margin:0">$\\vec{u}$ und $\\vec{v}$ sind parallel: Das Vektorprodukt ist der Nullvektor, sie spannen keine Fläche auf.</p>';
                } else {
                    // the normal drawn at most 4 units long, so it stays in the picture
                    const nn = A > 4 ? mul(4 / A, n) : n;
                    R.arrow(O, nn, 'pink', { r: 0.06 }); R.label('u × v', add(nn, [0, 0, 0.45]), 'pink', 0.36);
                    const q = 0.4, nh = mul(q / A, n), uh = mul(q / len(u), u);
                    R.line(uh, add(uh, nh), 'white', { opacity: 0.7 }); R.line(add(uh, nh), nh, 'white', { opacity: 0.7 });
                    html += '<p style="margin:0 0 6px">Probe: $(\\vec{u} \\times \\vec{v}) \\circ \\vec{u} = ' + n2(dot(n, u)) + '$ und $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = ' + n2(dot(n, v)) + '$: Das Vektorprodukt steht senkrecht auf beiden Vektoren' +
                        (A > 4 ? ' (im Bild verkürzt gezeichnet)' : '') + '.</p>' +
                        '<p style="margin:0">' + (S.tri ? 'Dreieck: $A = \\tfrac12\\,|\\vec{u} \\times \\vec{v}| = \\tfrac12 \\cdot ' + rootTex(dot(n, n)).split(' \\approx ')[0] + ' \\approx ' + texNum(A / 2, 3) + '$'
                            : 'Parallelogramm: $A = |\\vec{u} \\times \\vec{v}| = ' + rootTex(dot(n, n)) + '$') + ' Flächeneinheiten</p>';
                }
                out.innerHTML = html; math(out); R.render();
            });
        }
        draw();
    });

    /* ---------- the perpendicular from a point to a plane: foot, distance, mirror point ---------- */
    W('lot3d', function (box) {
        const PRE = {
            std: { k: 'Punkt über E', n: [1, 2, 2], d: 6, P: [3, 3, 3] },
            ursprung: { k: 'Ursprung', n: [2, 1, 2], d: 9, P: [0, 0, 0] },
            unten: { k: 'Punkt unter E', n: [2, 2, 1], d: 8, P: [0, 1, -1] },
            in: { k: 'Punkt in E', n: [1, 2, 2], d: 6, P: [2, 1, 1] }
        };
        const S = { n: PRE.std.n.slice(), d: PRE.std.d, P: PRE.std.P.slice(), mirror: false };
        presetRow(box, PRE, pr => { cn.set(pr.n.slice()); cP.set(pr.P.slice()); S.d = pr.d; rd.set(pr.d); draw(); });
        const inBox = div(box, 'vk-inputs');
        const cn = coords(inBox, 'n', S.n, draw, 'pink'), cP = coords(inBox, 'P', S.P, draw, 'cyan');
        const t = div(inBox, 'b-ctrls');
        t.innerHTML = '<label class="b-ctrl"><input type="checkbox"> Spiegelpunkt P′ zeigen</label>';
        t.querySelector('input').addEventListener('change', e => { S.mirror = e.target.checked; draw(); });
        math(inBox);
        const rd = B.range(div(box, ''), { label: 'Konstante $d$ in $\\vec{n} \\circ \\vec{x} = d$', min: -12, max: 12, step: 1, value: S.d, fmt: v => String(v).replace('-', '−'), onInput: v => { S.d = v; draw(); } });
        const R = new Raum(box, { height: 400 });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { n, d, P } = S, nn = dot(n, n);
                if (nn < 1e-9) { out.innerHTML = '<p style="margin:0">Der Normalenvektor darf nicht der Nullvektor sein.</p>'; R.render(); return; }
                const nP = dot(n, P), t = (d - nP) / nn, F = add(P, mul(t, n)), dist = Math.abs(t) * Math.sqrt(nn), nh = mul(1 / Math.sqrt(nn), n);
                // the plane: its trace triangle if the axis intercepts lie in the picture, else a square around F
                const ax = [0, 1, 2].map(i => near0(n[i]) ? null : d / n[i]);
                if (ax.every(x => x != null && Math.abs(x) <= 7 && !near0(x))) {
                    const T = ax.map((x, i) => [0, 1, 2].map(j => (j === i ? x : 0)));
                    R.face(T, 'violet', 0.26); T.forEach((p, i) => R.rod(p, T[(i + 1) % 3], 'violet', 0.022));
                } else {
                    const [e1, e2] = inPlane(n), c = [[-3, -3], [3, -3], [3, 3], [-3, 3]].map(([a, b]) => add(F, add(mul(a, e1), mul(b, e2))));
                    R.face(c, 'violet', 0.22);
                }
                const [e1n] = inPlane(n);
                R.label('E', add(F, add(mul(-1.8, e1n), [0, 0, 0.2])), 'violet', 0.42);
                // the perpendicular line through P and F, the distance in red, the normal at F
                const lo = Math.min(0, t * Math.sqrt(nn)) - 1.3, hi = Math.max(0, t * Math.sqrt(nn)) + 1.3;
                R.line(add(P, mul(lo, nh)), add(P, mul(hi, nh)), 'dim', { dash: true });
                if (dist > 1e-9) R.rod(P, F, 'red', 0.04);
                const up = t <= 0 ? 1 : -1;                                  // the side of the plane where P lies
                const foot = add(F, mul(1.4, e1n)), nUp = mul(1.3 * (dist > 1e-9 ? up : 1), nh);   // the normal beside the foot, not hidden by PF
                R.arrow(foot, add(foot, nUp), 'pink', { r: 0.04 }); R.label('n', add(foot, mul(1.25, nUp)), 'pink', 0.36);
                if (dist > 1e-9) {                                          // a right-angle mark at the foot
                    const [e1] = inPlane(n), q = 0.32, a1 = mul(q, e1), a2 = mul(q * up, nh);
                    R.line(add(F, a1), add(F, add(a1, a2)), 'white', { opacity: 0.8 }); R.line(add(F, add(a1, a2)), add(F, a2), 'white', { opacity: 0.8 });
                }
                R.dot(P, 'cyan'); R.label('P', add(P, [0, 0, 0.45]), 'cyan');
                R.dot(F, 'lambda', 0.11); R.label('F', add(F, [0, 0.35, -0.4]), 'lambda');
                let html = '<p style="margin:0 0 6px">$E\\colon ' + coordTex(n) + ' = ' + n2(d) + '$ · Lotgerade $l\\colon \\vec{x} = ' + vtex(P) + ' + t \\cdot ' + vtex(n) + '$</p>' +
                    '<p style="margin:0 0 6px">$l$ in $E$ einsetzen: $' + n2(nP) + sgn(nn) + 't = ' + n2(d) + '$, also $t = ' + texNum(t, 3) + '$ · Lotfußpunkt $F(' + g3(F) + ')$</p>';
                if (dist < 1e-9) html += '<p style="margin:0">$t = 0$: Der Punkt $P$ liegt selbst in der Ebene, sein Abstand ist $0$.</p>';
                else {
                    const exact = Math.abs(dist - Math.round(dist)) < 1e-9, dTex = (exact ? ' = ' : ' \\approx ') + texNum(dist, 3), nTex = rootTex(nn).split(' \\approx ')[0];
                    html += '<p style="margin:0' + (S.mirror ? ' 0 6px' : '') + '">Abstand: $|\\vec{PF}| = |t| \\cdot |\\vec{n}| = ' + texNum(Math.abs(t), 3) + ' \\cdot ' + nTex + dTex + '$ · ohne Lotfußpunkt: $\\dfrac{|' + n2(nP) + ' - ' + par(d) + '|}{' + nTex + '}' + dTex + '$</p>';
                    if (S.mirror) {
                        const Pm = add(P, mul(2 * t, n));
                        R.line(F, Pm, 'violet', { dash: true }); R.dot(Pm, 'violet', 0.11); R.label('P′', add(Pm, [0, 0, -0.45]), 'violet');
                        html += '<p style="margin:0">Spiegelpunkt: $t$ verdoppeln, $\\vec{OP\'} = \\vec{OP} + 2t \\cdot \\vec{n}$, also $P\'(' + g3(Pm) + ')$</p>';
                    }
                }
                out.innerHTML = html; math(out); R.render();
            });
        }
        const sgn = x => ' ' + (x < 0 ? '-' : '+') + ' ' + n2(Math.abs(x));
        draw();
    });

    /* ---------- central projection: one vanishing point, posts that shrink with the depth ---------- */
    W('zentralprojektion', function (box) {
        const S = { ex: 5, ey: 2.4, f: 6, show: true };
        const sl = div(box, '');
        B.range(sl, { label: 'Abstand des Auges $a$', min: 2, max: 14, step: 0.5, value: S.f, fmt: v => fmt(v, 1), onInput: v => { S.f = v; draw(); } });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<label class="b-ctrl"><input type="checkbox" checked> Fluchtlinien zeigen</label>';
        acts.querySelector('input').addEventListener('change', e => { S.show = e.target.checked; draw(); });
        div(box, 'b-help').textContent = 'Zieh den Fluchtpunkt V. Er liegt auf dem Horizont in Augenhöhe.';
        const holder = div(box, '');
        const p = new B.Plot(holder, { x: [0.5, 9.5], y: [-0.3, 3.8], equal: true, height: 340, grid: false, aria: 'Zentralprojektion eines Quaders und einer Pfostenreihe mit Fluchtpunkt' });
        // equal units on both axes: the height follows the width, so the ground and the horizon both stay in the picture
        const fit = () => { const w = holder.clientWidth; if (w) p.box.style.height = Math.round(Math.max(240, Math.min(480, w * 0.46))) + 'px'; };
        if (window.ResizeObserver) new ResizeObserver(fit).observe(holder);
        fit();
        const out = div(box, 'b-out');
        const hs = [{ x: S.ex, y: S.ey, color: 'red' }];
        p.handles(hs, (i, x, y) => { S.ex = Math.round(Math.max(1, Math.min(9, x)) * 10) / 10; S.ey = Math.round(Math.max(0.3, Math.min(3.5, y)) * 10) / 10; draw(); });
        // world: picture plane z = 0, the eye at (ex, ey, -a); a point behind the plane is pulled towards the vanishing point
        const pr = ([x, y, z]) => { const k = S.f / (S.f + z); return [S.ex + (x - S.ex) * k, S.ey + (y - S.ey) * k]; };
        const BOX = [[5.8, 0, 0], [8, 0, 0], [8, 1.6, 0], [5.8, 1.6, 0]], DEPTH = 3;
        function draw() {
            hs[0].x = S.ex; hs[0].y = S.ey;
            const L = [{ hline: S.ey, color: 'dim' }];
            const front = BOX.map(pr), back = BOX.map(([x, y, z]) => pr([x, y, z + DEPTH]));
            // the box: front face parallel to the picture keeps its shape, its depth edges run into V
            L.push({ polys: [front], color: 'lambda' });
            front.forEach((q, i) => { L.push({ seg: [q, front[(i + 1) % 4]], color: 'lambda', width: 2.2 }, { seg: [back[i], back[(i + 1) % 4]], color: 'lambda', width: 1.4 }, { seg: [q, back[i]], color: 'lambda', width: 1.6 }); });
            // the road and a row of equal posts every 2 units of depth
            const road = [[1.6, 0], [3.6, 0]];
            road.forEach(([x]) => L.push({ seg: [pr([x, 0, 0]), pr([x, 0, 400])], color: 'cyan', width: 1.6 }));
            const posts = [0, 2, 4, 6, 8, 10].map(z => [pr([1.2, 0, z]), pr([1.2, 1.8, z])]);
            posts.forEach(([a, b]) => L.push({ seg: [a, b], color: 'phi', width: 2.4 }));
            if (S.show) {
                front.forEach(q => L.push({ seg: [q, [S.ex, S.ey]], color: 'red', dash: true, width: 1 }));
                L.push({ seg: [posts[0][1], [S.ex, S.ey]], color: 'red', dash: true, width: 1 });
            }
            L.push({ text: 'V', at: [S.ex, S.ey], color: 'red', dx: 10, dy: -10 }, { text: 'Horizont', at: [0.55, S.ey], color: 'dim', dy: -8 });
            p.draw(L);
            const k8 = S.f / (S.f + 8);
            out.innerHTML = '<p style="margin:0 0 6px">Fluchtpunkt $V(' + texNum(S.ex, 1) + ' \\mid ' + texNum(S.ey, 1) + ')$ · Bildebene vor dem Quader, Auge im Abstand $a = ' + texNum(S.f, 1) + '$ davor</p>' +
                '<p style="margin:0 0 6px">Alle Kanten, die in die Tiefe laufen, treffen sich in $V$. Kanten parallel zur Bildebene bleiben parallel und behalten ihr Verhältnis.</p>' +
                '<p style="margin:0">Ein Pfosten in der Tiefe $z$ erscheint mit dem Faktor $\\dfrac{a}{a + z}$: bei $z = 8$ also $\\dfrac{' + texNum(S.f, 1) + '}{' + texNum(S.f + 8, 1) + '} \\approx ' + texNum(k8, 2) + '$ so hoch wie vorn.</p>';
            math(out);
        }
        draw();
    });
})();
