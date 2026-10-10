/* buch-gy7.js — widgets of the book Mathematik · Gymnasium 7 (js/buch.js; SVG helpers B.geo from js/buch-geometrie.js,
 * which must be loaded first; Three.js from the CDN for the bodies in 3D).
 *   titelbildgy7    the cover: Thales circle with its right triangle, a pyramid in the oblique view, an icosahedron, a pie chart, a number line
 *   kreisgerade7    a circle and a draggable line: passant, tangent or secant by comparing the distance d with the radius r (data-hero: all three)
 *   dreieckkreise7  a triangle with draggable corners: circumcircle from the perpendicular bisectors, incircle from the angle bisectors (data-mode="um|in")
 *   kreiswinkel7    angles at the circle: Thales, inscribed and central angle, cyclic quadrilateral, each with a proof idea (data-mode="thales|peri|sehnen", data-hero)
 *   konstruktion7   constructions step by step: tangents from an outside point, triangle from c, α, β, common tangents of two circles (data-mode, data-hero)
 *   zahlengerade7   rational numbers on the number line: order, opposite number, absolute value · adding and subtracting as moves (data-mode="ordnen|rechnen", data-hero)
 *   zahlbereiche7   N, Z, Q+ and Q in one set diagram: where does the number belong? subset, intersection, union
 *   vorzeichen7     the sign rules from a pattern: 3·3, 3·2, … 3·(−3), then (−3)·… · powers of −2 (data-mode="mal|potenz", data-hero)
 *   waagebild7      a balanced pair of scales with boxes and weights (picture for the chapter opener)
 *   umstellen7      formulas rearranged step by step, the same operation on both sides, with a check in numbers
 *   prozent7        percent: hundred square and percent strip for G, p and W · increase "um" and "auf" with the factor (data-mode="grund|steigerung", data-hero)
 *   diagramm7       one data set as bar, line or pie chart, values adjustable; shares and angles (data-set="schulweg|wahl|sonnenblume", data-type, data-hero)
 *   schraegbild7    prisms, pyramids, frustum: oblique view (45°, ½), two-view drawing with order lines, true length of a lateral edge;
 *                   with data-calc base, lateral surface, surface, volume and mass (data-mode, data-k, data-hero)
 *   faltnetz7       a net folds into its body in 3D: prisms, pyramids, frustum, the five Platonic solids; vertices, edges, faces, Euler (data-set="prismen|platon", data-k, data-hero)
 *   drittel7        three equal pyramids fill a cube, in 3D: V = ⅓ · G · h (data-hero)
 *   eckenwinkel7    regular polygons around one vertex: why there are exactly five Platonic solids
 * Looks: js/buch.css (section "Gymnasium 7").
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, range, seg, div } = B;
    const W = B.widget;
    const { f1, pts, poly, line, txt, dot, handle, fill, hexFill, add, sub, mul, mid, len, rightMark, arc, dragSVG } = B.geo;
    const LAM = 'rgb(245,194,66)', CY = '#7fd8ee', PHI = 'rgb(160,200,90)', RED = '#e2665a', VIO = '#b8a4f2', PINK = '#e682be', TXT = '#e8edf5', DIM = '#8fa3bd';
    const PAL = [LAM, CY, PHI, VIO, RED, PINK, '#f0a35e', '#9ad0c2'];
    const DEG = Math.PI / 180;

    /* ---------- small helpers ---------- */
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const isHero = box => box.dataset.hero != null;
    const svgTag = (w, h, aria, s) => '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + aria + '">' + s + '</svg>';
    const unit = p => mul(p, 1 / (len(p) || 1));
    const dot2 = (p, q) => p[0] * q[0] + p[1] * q[1];
    const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
    // point on a circle at the maths angle th (counter-clockwise, y up) and back
    const onC = (M, R, th) => [M[0] + R * Math.cos(th), M[1] - R * Math.sin(th)];
    const angOf = (M, P) => Math.atan2(M[1] - P[1], P[0] - M[0]);
    const norm = a => { a %= 2 * Math.PI; return a < 0 ? a + 2 * Math.PI : a; };
    // angle at V between VP and VQ in degrees (0 … 180)
    const angle = (V, P, Q) => { const a = sub(P, V), b = sub(Q, V); return Math.acos(clamp(dot2(a, b) / (len(a) * len(b) || 1), -1, 1)) / DEG; };
    const sty = (c, w, more) => 'fill:none;stroke:' + c + ';stroke-width:' + (w || 2) + ';stroke-linecap:round;' + (more || '');
    const DASH = 'stroke-dasharray:6 5;';
    const circ = (M, r, style) => '<circle cx="' + f1(M[0]) + '" cy="' + f1(M[1]) + '" r="' + f1(r) + '" style="' + style + '"/>';
    const path = (d, style) => '<path d="' + d + '" style="' + style + '"/>';
    const colTxt = (p, s, cls, c, anchor) => txt(p, s, cls, anchor).replace('class="', 'style="fill:' + c + '" class="');
    // the part of the line through p with direction u inside the rectangle 0…w × 0…h
    function clipLine(p, u, w, h) {
        let t0 = -1e9, t1 = 1e9;
        const lim = [[u[0], -p[0]], [-u[0], p[0] - w], [u[1], -p[1]], [-u[1], p[1] - h]];
        for (const [a, b] of lim) {
            if (Math.abs(a) < 1e-12) { if (b > 0) return null; continue; }
            const t = b / a; if (a > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
        }
        return t0 <= t1 ? [add(p, mul(u, t0)), add(p, mul(u, t1))] : null;
    }
    const fullLine = (p, q, w, h, style) => { const c = clipLine(p, unit(sub(q, p)), w, h); return c ? line(c[0], c[1], style) : ''; };
    // arc (or sector) counter-clockwise from the maths angle th0 to th1
    function arcPath(M, r, th0, th1, sector) {
        let d = norm(th1 - th0); if (d < 1e-6) d = 2 * Math.PI - 1e-3;
        const s = onC(M, r, th0), e = onC(M, r, th0 + d);
        return (sector ? 'M' + f1(M[0]) + ' ' + f1(M[1]) + ' L' : 'M') + f1(s[0]) + ' ' + f1(s[1]) + ' A' + f1(r) + ' ' + f1(r) + ' 0 ' + (d > Math.PI ? 1 : 0) + ' 0 ' + f1(e[0]) + ' ' + f1(e[1]) + (sector ? ' Z' : '');
    }
    // a point label pushed away from a centre C
    const labelAway = (P, C, s, d, cls) => txt(add(P, add(mul(unit(sub(P, C)), d || 18), [0, 5])), s, cls || 'g-pt');
    // the two intersection points of two circles (or null)
    function cc(M1, r1, M2, r2) {
        const d = len(sub(M2, M1)); if (d < 1e-9 || d > r1 + r2 || d < Math.abs(r1 - r2)) return null;
        const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
        const u = mul(sub(M2, M1), 1 / d), P = add(M1, mul(u, a)), n = [-u[1], u[0]];
        return [add(P, mul(n, h)), sub(P, mul(n, h))];
    }
    const tdeg = v => texNum(v, 1) + '^\\circ';
    const tcm = (v, d) => texNum(v, d == null ? 1 : d) + '\\,\\text{cm}';
    const tn = (v, d) => (v < 0 ? '-' : '') + texNum(Math.abs(v), d == null ? 2 : d);      // a signed number in TeX
    const tp = (v, d) => v < 0 ? '(' + tn(v, d) + ')' : tn(v, d);                          // in brackets when negative
    function buttons(parent, list) {
        const row = div(parent, 'b-ctrl');
        row.innerHTML = list.map(([k, l, go]) => '<button type="button" class="b-btn' + (go ? ' b-go' : '') + '" data-k="' + k + '">' + l + '</button>').join('');
        return row;
    }

    /* ---------- 3D: vectors, convex bodies, a small Three.js stage ---------- */
    const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const vmul = (k, a) => [k * a[0], k * a[1], k * a[2]];
    const vdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const vlen = a => Math.sqrt(vdot(a, a));
    const vunit = a => vmul(1 / (vlen(a) || 1), a);
    // v turned about the unit axis k by the angle a (Rodrigues)
    const vrot = (v, k, a) => vadd(vadd(vmul(Math.cos(a), v), vmul(Math.sin(a), vcross(k, v))), vmul(vdot(k, v) * (1 - Math.cos(a)), k));
    // the faces of a convex body: vertex indices counter-clockwise seen from outside, outward normal
    function hull(V) {
        const n = V.length, faces = [], seen = new Set();
        let size = 0; V.forEach(p => { size = Math.max(size, vlen(p)); });
        const eps = 1e-7 * Math.max(1, size);
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
            let nn = vcross(vsub(V[j], V[i]), vsub(V[k], V[i]));
            if (vlen(nn) < eps) continue;
            nn = vunit(nn);
            const d = vdot(nn, V[i]);
            let pos = false, neg = false; const on = [];
            for (let m = 0; m < n; m++) {
                const s = vdot(nn, V[m]) - d;
                if (s > 1e-6 * Math.max(1, size)) pos = true; else if (s < -1e-6 * Math.max(1, size)) neg = true; else on.push(m);
            }
            if (pos && neg) continue;
            if (pos) nn = vmul(-1, nn);
            const key = on.join(',');
            if (seen.has(key)) continue;
            seen.add(key);
            const c = vmul(1 / on.length, on.reduce((s, m) => vadd(s, V[m]), [0, 0, 0]));
            const e1 = vunit(vsub(V[on[0]], c)), e2 = vcross(nn, e1);
            on.sort((a, b) => Math.atan2(vdot(vsub(V[a], c), e2), vdot(vsub(V[a], c), e1)) - Math.atan2(vdot(vsub(V[b], c), e2), vdot(vsub(V[b], c), e1)));
            faces.push({ v: on, n: nn, c });
        }
        return faces;
    }
    function edgesOf(faces) {
        const E = new Map();
        faces.forEach((f, fi) => f.v.forEach((a, i) => {
            const b = f.v[(i + 1) % f.v.length], key = Math.min(a, b) + '-' + Math.max(a, b);
            if (!E.has(key)) E.set(key, { a: Math.min(a, b), b: Math.max(a, b), f: [] });
            E.get(key).f.push(fi);
        }));
        return Array.from(E.values());
    }
    const PHIG = (1 + Math.sqrt(5)) / 2;
    const BODY = {
        wuerfel: 'Würfel', quader: 'Quader', prisma3: 'Dreiecksprisma', prisma6: 'Sechseckprisma', pyramide4: 'Quadratische Pyramide',
        pyramide3: 'Dreieckspyramide', stumpf: 'Pyramidenstumpf', tetraeder: 'Tetraeder', oktaeder: 'Oktaeder', dodekaeder: 'Dodekaeder', ikosaeder: 'Ikosaeder'
    };
    // a body in maths coordinates (x to the right, y to the back, z up), base on z = 0 with its front edge parallel to the x axis
    function solid(k, a, b, h) {
        const ring = (n, s, z) => {
            const r = s / (2 * Math.sin(Math.PI / n)), a0 = (-90 - 180 / n) * DEG;
            return Array.from({ length: n }, (_, i) => [r * Math.cos(a0 + 2 * Math.PI * i / n), r * Math.sin(a0 + 2 * Math.PI * i / n), z]);
        };
        const L = 'ABCDEFGHIJKL'.split('');
        if (k === 'wuerfel' || k === 'quader') {
            if (k === 'wuerfel') { b = a; h = a; }
            const V = [[-a / 2, -b / 2, 0], [a / 2, -b / 2, 0], [a / 2, b / 2, 0], [-a / 2, b / 2, 0]];
            return { V: V.concat(V.map(p => [p[0], p[1], h])), names: L.slice(0, 8), kind: 'prisma', n: 4 };
        }
        if (k === 'prisma3' || k === 'prisma6') {
            const n = k === 'prisma3' ? 3 : 6, V = ring(n, a, 0);
            return { V: V.concat(ring(n, a, h)), names: L.slice(0, 2 * n), kind: 'prisma', n };
        }
        if (k === 'pyramide4' || k === 'pyramide3') {
            const n = k === 'pyramide4' ? 4 : 3;
            return { V: ring(n, a, 0).concat([[0, 0, h]]), names: L.slice(0, n).concat(['S']), kind: 'pyramide', n };
        }
        if (k === 'stumpf') return { V: ring(4, a, 0).concat(ring(4, b, h)), names: L.slice(0, 8), kind: 'stumpf', n: 4 };
        // the Platonic solids: standard coordinates, then one face turned down onto z = 0
        let V;
        if (k === 'tetraeder') V = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
        else if (k === 'oktaeder') V = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
        else if (k === 'ikosaeder') { V = []; [-1, 1].forEach(s => [-1, 1].forEach(t => { V.push([0, s, t * PHIG], [s, t * PHIG, 0], [t * PHIG, 0, s]); })); }
        else if (k === 'dodekaeder') {
            V = []; const q = 1 / PHIG;
            [-1, 1].forEach(x => [-1, 1].forEach(y => [-1, 1].forEach(z => V.push([x, y, z]))));
            [-1, 1].forEach(s => [-1, 1].forEach(t => { V.push([0, s * q, t * PHIG], [s * q, t * PHIG, 0], [s * PHIG, 0, t * q]); }));
        } else V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
        const f0 = hull(V)[0], down = [0, 0, -1], ax = vcross(f0.n, down);
        if (vlen(ax) > 1e-9) { const k2 = vunit(ax), an = Math.acos(clamp(vdot(f0.n, down), -1, 1)); V = V.map(p => vrot(p, k2, an)); }
        else if (vdot(f0.n, down) < 0) V = V.map(p => [p[0], -p[1], -p[2]]);
        const R = Math.max(...V.map(vlen)), z0 = Math.min(...V.map(p => p[2]));
        V = V.map(p => [p[0] * a / R, p[1] * a / R, (p[2] - z0) * a / R]);
        return { V, names: null, kind: 'platon', n: f0.v.length };
    }

    const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
    let threeP = null;
    const three = () => threeP || (threeP = import(THREE_URL));
    const col3 = c => window.Farbschema && Farbschema.map ? Farbschema.map(c, 'line') : c;
    // a 3D stage without axes: drag to turn, optional slow spin; maths (x, y, z) becomes three (x, z, −y)
    class Stage7 {
        constructor(box, opt = {}) {
            this.opt = Object.assign({ height: 340, az: 0.5, el: 0.5, spin: false, aria: 'Körper in 3D' }, opt);
            this.wrap = div(box, 'b-canvasbox vk-stage');
            this.wrap.style.height = this.opt.height + 'px';
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('role', 'img'); this.canvas.setAttribute('aria-label', this.opt.aria);
            this.wrap.appendChild(this.canvas);
            const h = div(this.wrap, 'vk-hint'); h.textContent = 'Ziehen zum Drehen';
            this.az = this.opt.az; this.el = this.opt.el;
            this.target = [0, 0, 0]; this.dist = 8;
            this.ready = three().then(T => this._init(T));
        }
        _init(T) {
            this.T = T;
            this.renderer = new T.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, preserveDrawingBuffer: B.printing() });
            this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
            this.scene = new T.Scene();
            this.camera = new T.PerspectiveCamera(30, 1, 0.1, 400);
            this.scene.add(new T.AmbientLight(0xffffff, 0.8));
            const sun = new T.DirectionalLight(0xffffff, 0.95); sun.position.set(5, 9, 7); this.scene.add(sun);
            const back = new T.DirectionalLight(0xffffff, 0.35); back.position.set(-6, -3, -5); this.scene.add(back);
            this.root = new T.Group(); this.scene.add(this.root);
            this._drag();
            const fit = () => this._size();
            if (window.ResizeObserver) new ResizeObserver(fit).observe(this.wrap);
            addEventListener('resize', fit);
            addEventListener('farbschema', () => { if (this.onScheme) this.onScheme(); this.render(); });
            this._size();
            if (!B.printing()) this._loop();
            return this;
        }
        v3(p) { return new this.T.Vector3(p[0], p[2], -p[1]); }
        // look at the point c (maths coordinates) so that a ball of radius r fills the picture
        view(c, r) { this.target = c; this.dist = r / Math.sin(15 * DEG) * 0.86; }
        _size() {
            const w = this.wrap.clientWidth, h = this.wrap.clientHeight;
            if (!w || !h || !this.renderer) return;
            this.renderer.setSize(w, h, false);
            this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
            this.render();
        }
        render() {
            if (!this.renderer) return;
            const c = this.camera, t = this.v3(this.target), asp = Math.max(0.6, Math.min(1, this.camera.aspect)), d = this.dist / asp;
            c.position.set(t.x + d * Math.sin(this.az) * Math.cos(this.el), t.y + d * Math.sin(this.el), t.z + d * Math.cos(this.az) * Math.cos(this.el));
            c.lookAt(t);
            this.renderer.render(this.scene, c);
        }
        _drag() {
            const cv = this.canvas;
            cv.style.touchAction = 'pan-y'; cv.style.cursor = 'grab';
            let last = null;
            cv.addEventListener('pointerdown', e => { last = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; this.touched = true; });
            cv.addEventListener('pointermove', e => {
                if (!last) return;
                this.az -= (e.clientX - last[0]) * 0.008;
                this.el = clamp(this.el + (e.clientY - last[1]) * 0.006, -0.3, 1.5);
                last = [e.clientX, e.clientY];
                this.render();
            });
            const end = () => { last = null; cv.style.cursor = 'grab'; };
            cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
        }
        // one animation loop per stage: onFrame(dt) may change the scene; spin turns the camera until the stage is touched
        _loop() {
            let vis = true, t0 = performance.now();
            if (window.IntersectionObserver) new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(this.wrap);
            const tick = now => {
                const dt = Math.min(0.1, (now - t0) / 1000); t0 = now;
                if (vis) {
                    let dirty = false;
                    if (this.opt.spin && !this.touched) { this.az += 0.25 * dt; dirty = true; }
                    if (this.onFrame && this.onFrame(dt)) dirty = true;
                    if (dirty) this.render();
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
        mat(c, o = {}) {
            const T = this.T;
            return new T.MeshStandardMaterial(Object.assign({ color: new T.Color(col3(c)), roughness: 0.55, metalness: 0.02, side: T.DoubleSide,
                transparent: true, opacity: 0.86, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }, o));
        }
        // a flat polygon (maths coordinates) with its outline, as one group
        face(p, c, edge, g) {
            const T = this.T, geo = new T.BufferGeometry(), tri = [];
            for (let i = 1; i < p.length - 1; i++) tri.push(p[0], p[i], p[i + 1]);
            geo.setFromPoints(tri.map(q => this.v3(q))); geo.computeVertexNormals();
            const grp = new T.Group();
            grp.add(new T.Mesh(geo, this.mat(c)));
            const lg = new T.BufferGeometry().setFromPoints(p.concat([p[0]]).map(q => this.v3(q)));
            grp.add(new T.Line(lg, new T.LineBasicMaterial({ color: new T.Color(col3(edge || TXT)), transparent: true, opacity: 0.95 })));
            (g || this.root).add(grp);
            return grp;
        }
        clear() {
            while (this.root.children.length) {
                const o = this.root.children.pop();
                o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); });
            }
        }
    }

    /* ---------- the cover ---------- */
    W('titelbildgy7', function (box) {
        const Wd = 600, Ht = 850;
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="300" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 300; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        const glow = (d, c, w, dashed) => '<path d="' + d + '" stroke="' + c + '" stroke-width="12" stroke-opacity="0.12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + d + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + (dashed ? ' stroke-dasharray="' + dashed + '"' : '') + '/>';
        const P = list => 'M' + list.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
        const closed = list => P(list) + ' Z';
        const spot = p => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="6" fill="#fff"/><circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="12" fill="#fff" fill-opacity="0.12"/>';
        let art = '';
        // a pie chart behind everything
        const PM = [112, 392], pr = 56;
        let th = 90 * DEG;
        [[0.45, '#F5C242'], [0.3, '#7fd8ee'], [0.25, '#A0C85A']].forEach(([s, c]) => {
            const w = s * 2 * Math.PI;
            art += '<path d="' + arcPath(PM, pr, th - w, th, true) + '" fill="' + c + '" fill-opacity="0.16" stroke="' + c + '" stroke-opacity="0.75" stroke-width="2"/>';
            th -= w;
        });
        // Thales: the circle, its diameter and a right triangle
        const M = [180, 560], r = 112, A = [M[0] - r, M[1]], Bv = [M[0] + r, M[1]], C = onC(M, r, 118 * DEG);
        art += glow('M' + (M[0] - r) + ' ' + M[1] + ' a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0', '#B8A4F2', 3);
        art += '<path d="' + closed([A, Bv, C]) + '" fill="#fff" fill-opacity="0.05"/>' + glow(closed([A, Bv, C]), '#ffffff', 2.6);
        art += rightMark(C, A, Bv, 16);
        // a square pyramid in the oblique view (hidden edges dashed)
        const a = 140, q = 0.5 * Math.SQRT1_2 * a, b0 = [392, 700];
        const pA = b0, pB = [b0[0] + a, b0[1]], pC = [b0[0] + a + q, b0[1] - q], pD = [b0[0] + q, b0[1] - q], pS = [b0[0] + a / 2 + q / 2, b0[1] - q / 2 - 250];
        art += '<path d="' + closed([pA, pB, pS]) + '" fill="#F5C242" fill-opacity="0.08"/><path d="' + closed([pB, pC, pS]) + '" fill="#F5C242" fill-opacity="0.04"/>';
        art += glow(P([pA, pD, pC]), '#F5C242', 1.8, '8 8') + glow(P([pD, pS]), '#F5C242', 1.8, '8 8');
        art += glow(P([pS, pA, pB, pS, pC, pB]), '#F5C242', 3);
        // an icosahedron as a wire model
        const IM = [482, 356], IR = 64, tilt = 0.42, turn = 0.35, V = [];
        [-1, 1].forEach(s => [-1, 1].forEach(t => { V.push([0, s, t * PHIG], [s, t * PHIG, 0], [t * PHIG, 0, s]); }));
        const prj = V.map(p => {
            const x1 = p[0] * Math.cos(turn) + p[2] * Math.sin(turn), z1 = -p[0] * Math.sin(turn) + p[2] * Math.cos(turn);
            const y2 = p[1] * Math.cos(tilt) - z1 * Math.sin(tilt), z2 = p[1] * Math.sin(tilt) + z1 * Math.cos(tilt);
            return [IM[0] + x1 * IR / 1.9, IM[1] - y2 * IR / 1.9, z2];
        });
        for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
            if (Math.abs(vlen(vsub(V[i], V[j])) - 2) > 1e-6) continue;
            const back = prj[i][2] + prj[j][2] < 0;
            art += back ? '<line x1="' + f1(prj[i][0]) + '" y1="' + f1(prj[i][1]) + '" x2="' + f1(prj[j][0]) + '" y2="' + f1(prj[j][1]) + '" stroke="#7fd8ee" stroke-opacity="0.35" stroke-width="1.4"/>'
                : glow(P([prj[i], prj[j]]), '#7fd8ee', 2.2);
        }
        // a number line with a number and its opposite
        const y = 752, x0 = 300, u = 48;
        art += glow(P([[24, y], [576, y]]), '#ffffff', 2);
        art += '<path d="M576 ' + y + ' l-14 -7 v14 z" fill="#fff"/>';
        for (let k = -5; k <= 5; k++) art += '<line x1="' + (x0 + k * u) + '" y1="' + (y - (k ? 7 : 12)) + '" x2="' + (x0 + k * u) + '" y2="' + (y + (k ? 7 : 12)) + '" stroke="#fff" stroke-opacity="0.75" stroke-width="2"/>';
        art += glow('M' + (x0 - 3 * u) + ' ' + y + ' A' + 3 * u + ' 50 0 0 1 ' + (x0 + 3 * u) + ' ' + y, '#A0C85A', 2.4, '9 9');
        [A, Bv, C, M, pS, [x0 - 3 * u, y], [x0 + 3 * u, y]].forEach(p => { art += spot(p); });
        const id = 'tg7' + Math.random().toString(36).slice(2, 7);
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Titelbild: ein Kreis mit rechtwinkligem Dreieck über dem Durchmesser, eine Pyramide im Schrägbild, ein Ikosaeder, ein Kreisdiagramm und eine Zahlengerade mit einer Zahl und ihrer Gegenzahl">' +
            '<defs><linearGradient id="' + id + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/>' +
            '<stop offset="0.9" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>' +
            '<mask id="' + id + '-mask"><rect width="' + Wd + '" height="' + Ht + '" fill="url(#' + id + '-fade)"/></mask></defs>' +
            '<g mask="url(#' + id + '-mask)"><g stroke="#7fd8ee" stroke-opacity="0.07" stroke-width="1">' + grid + '</g>' + art + '</g></svg>';
    });

    /* ---------- circle and line ---------- */
    W('kreisgerade7', function (box) {
        const Wd = 440, Ht = 340, M = [220, 170], R = 105, CM = 35;   // 1 cm = 35 px, r = 3 cm
        const hero = isHero(box);
        const S = { p: [60, 262], q: [390, 205] };
        const pic = div(box, 'b-svgbox g-svg');
        const out = hero ? null : div(box, 'b-out');
        if (hero) { pic.style.maxWidth = '320px'; pic.style.margin = '0 auto'; }
        else {
            const help = div(box, 'b-help', 'Zieh an den beiden Punkten der Geraden. Kommt der Abstand $d$ nahe an den Radius $r$, rastet die Gerade als Tangente ein.');
            math(help);
        }
        const geo = () => {
            const u = unit(sub(S.q, S.p)), n = [-u[1], u[0]];
            return { u, n, d: dot2(sub(M, S.p), n) };
        };
        if (!hero) dragSVG(pic, (i, x, y) => {
            const old = S[i];
            S[i] = [clamp(x, 14, Wd - 14), clamp(y, 14, Ht - 14)];
            if (len(sub(S.p, S.q)) < 50) { S[i] = old; return; }
            const g = geo();
            if (Math.abs(Math.abs(g.d) - R) < 6) {              // snap: move the line parallel until d = r exactly
                const k = g.d - Math.sign(g.d) * R;
                S.p = add(S.p, mul(g.n, k)); S.q = add(S.q, mul(g.n, k));
            }
            render();
        });
        function drawLine(p, u, c) { const e = clipLine(p, u, Wd, Ht); return e ? line(e[0], e[1], sty(c, 3.2)) : ''; }
        function render() {
            let s = circ(M, R, 'fill:rgba(127,216,238,0.05);stroke:' + DIM + ';stroke-width:1.8');
            if (hero) {
                const rows = [[M[1] - R - 34, VIO, 'Passante'], [M[1] - 30, CY, 'Sekante'], [M[1] + R, LAM, 'Tangente']];
                rows.forEach(([y, c, name]) => { s += drawLine([0, y], [1, 0], c) + colTxt([24, y - 10], name, 'g-pt', c, 'start'); });
                const w = Math.sqrt(R * R - 30 * 30);
                s += dot([M[0] - w, M[1] - 30], TXT) + dot([M[0] + w, M[1] - 30], TXT) + dot([M[0], M[1] + R], LAM, 5.5) + dot(M, TXT, 4);
                pic.innerHTML = svgTag(Wd, Ht, 'Ein Kreis mit einer Passante, einer Sekante und einer Tangente', s);
                return;
            }
            const g = geo(), ad = Math.abs(g.d), F = sub(M, mul(g.n, g.d));
            const kind = Math.abs(ad - R) < 0.5 ? 'tan' : ad > R ? 'pas' : 'sek';
            const c = { pas: VIO, tan: LAM, sek: CY }[kind];
            s += drawLine(S.p, g.u, c);
            if (ad > 8) s += line(M, F, sty(TXT, 1.4, DASH)) + txt(add(mid(M, F), mul(g.u, 14)), 'd', 'g-side');
            let chord = 0;
            if (kind === 'sek') {
                const w = Math.sqrt(R * R - ad * ad), S1 = add(F, mul(g.u, -w)), S2 = add(F, mul(g.u, w));
                chord = 2 * w / CM;
                s += line(S1, S2, sty(LAM, 5, 'opacity:0.75')) + dot(S1, TXT, 5) + dot(S2, TXT, 5);
                s += labelAway(S1, M, 'S₁', 20) + labelAway(S2, M, 'S₂', 20);
            }
            if (kind === 'tan') s += line(M, F, sty(TXT, 1.8)) + rightMark(F, M, add(F, g.u), 11) + dot(F, LAM, 5.5) + labelAway(F, M, 'B', 20);
            if (ad > 8 && kind !== 'tan') s += rightMark(F, M, add(F, g.u), 9);
            s += dot(M, TXT, 4) + txt(add(M, [-12, -8]), 'M', 'g-pt');
            s += txt(add(M, rot([R / 2, -6], -0.9)), 'r', 'g-side') + line(M, onC(M, R, 0.9), sty(DIM, 1.2));
            s += handle(S.p, 'p', c) + handle(S.q, 'q', c);
            pic.innerHTML = svgTag(Wd, Ht, 'Kreis mit einer verschiebbaren Geraden', s);
            const d = ad / CM;
            let t = '$r = 3\\,\\text{cm}$ · Abstand der Geraden vom Mittelpunkt: $d \\approx ' + tcm(d) + '$<br>';
            if (kind === 'pas') t += '$d > r$: Die Gerade hat <b>keinen</b> Punkt mit dem Kreis gemeinsam. Sie ist eine <b class="g-lam" style="color:' + VIO + '">Passante</b>.';
            else if (kind === 'tan') t += '$d = r$: Die Gerade hat <b>genau einen</b> Punkt $B$ mit dem Kreis gemeinsam, den Berührungspunkt. Sie ist eine <b class="g-lam">Tangente</b>. Der Radius $\\overline{MB}$ steht senkrecht auf ihr.';
            else t += '$d < r$: Die Gerade schneidet den Kreis in <b>zwei</b> Punkten $S_1$ und $S_2$. Sie ist eine <b class="g-cy">Sekante</b>. Die Strecke $\\overline{S_1S_2}$ ist eine <b>Sehne</b>, hier etwa $' + tcm(chord) + '$ lang.' +
                (ad < 3 ? ' Die Sekante geht durch $M$: Die Sehne ist ein Durchmesser.' : '');
            out.innerHTML = '<p style="margin:0">' + t + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- circumcircle and incircle ---------- */
    W('dreieckkreise7', function (box) {
        const Wd = 440, Ht = 380, CM = 40;
        const S = { P: [[80, 300], [360, 312], [196, 92]], mode: box.dataset.mode || 'um' };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['um', 'Umkreis'], ['in', 'Inkreis']], S.mode, v => { S.mode = v; render(); }, 'Kreis');
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const help = div(box, 'b-help', 'Zieh an den Ecken. In der Nähe von $90^\\circ$ rastet der Winkel an der gezogenen Ecke als rechter Winkel ein.');
        math(help);
        dragSVG(pic, (i, x, y) => {
            i = +i;
            let V = [clamp(x, 16, Wd - 16), clamp(y, 16, Ht - 16)];
            const P = S.P[(i + 1) % 3], Q = S.P[(i + 2) % 3];
            if (Math.abs(angle(V, P, Q) - 90) < 2.5) { const m = mid(P, Q), rr = len(sub(P, Q)) / 2; V = add(m, mul(unit(sub(V, m)), rr)); }
            S.P[i] = V; render();
        });
        function render() {
            const [A, Bv, C] = S.P, G = mul(add(add(A, Bv), C), 1 / 3);
            const area = Math.abs((Bv[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (Bv[1] - A[1])) / 2;
            const a = len(sub(Bv, C)), b = len(sub(C, A)), c = len(sub(A, Bv));
            const al = angle(A, Bv, C), be = angle(Bv, C, A), ga = angle(C, A, Bv), mx = Math.max(al, be, ga);
            let s = '', t = '';
            const ok = area > 600;
            if (ok && S.mode === 'um') {
                const D = 2 * (A[0] * (Bv[1] - C[1]) + Bv[0] * (C[1] - A[1]) + C[0] * (A[1] - Bv[1]));
                const sq = p => p[0] * p[0] + p[1] * p[1];
                const U = [(sq(A) * (Bv[1] - C[1]) + sq(Bv) * (C[1] - A[1]) + sq(C) * (A[1] - Bv[1])) / D, (sq(A) * (C[0] - Bv[0]) + sq(Bv) * (A[0] - C[0]) + sq(C) * (Bv[0] - A[0])) / D];
                const R = len(sub(U, A));
                s += circ(U, R, 'fill:rgba(245,194,66,0.06);stroke:' + LAM + ';stroke-width:2.4');
                [[A, Bv], [Bv, C], [C, A]].forEach(([P, Q]) => {
                    const m = mid(P, Q), n = [-(Q[1] - P[1]), Q[0] - P[0]];
                    s += fullLine(m, add(m, n), Wd, Ht, sty(CY, 1.4, DASH)) + rightMark(m, P, add(m, n), 8) + dot(m, CY, 3.5);
                });
                s += line(U, A, sty(LAM, 1.4, 'opacity:0.8')) + dot(U, LAM, 5) + txt(add(U, [12, -10]), 'U', 'g-pt');
                const where = Math.abs(mx - 90) < 0.6 ? 'Das Dreieck ist <b>rechtwinklig</b>: $U$ liegt genau in der Mitte der längsten Seite. Das ist der Satz des Thales von der anderen Seite gesehen.'
                    : mx > 90 ? 'Das Dreieck ist <b>stumpfwinklig</b>: $U$ liegt <b>außerhalb</b> des Dreiecks.' : 'Das Dreieck ist <b>spitzwinklig</b>: $U$ liegt <b>innerhalb</b> des Dreiecks.';
                t = '<p style="margin:0">Die drei <span class="g-cy">Mittelsenkrechten</span> schneiden sich in einem Punkt $U$. Er ist von allen drei Ecken gleich weit entfernt:</p>' +
                    '<p style="margin:0">$\\overline{UA} = \\overline{UB} = \\overline{UC} = r \\approx ' + tcm(R / CM) + '$</p><p style="margin:6px 0 0">' + where + '</p>';
            } else if (ok) {
                const I = mul(add(add(mul(A, a), mul(Bv, b)), mul(C, c)), 1 / (a + b + c)), rho = 2 * area / (a + b + c);
                s += circ(I, rho, 'fill:rgba(160,200,90,0.08);stroke:' + PHI + ';stroke-width:2.4');
                [[A, Bv, C, b, c], [Bv, C, A, c, a], [C, A, Bv, a, b]].forEach(([V, P, Q, lp, lq]) => {
                    // the bisector from V meets PQ in the point that divides PQ in the ratio of the adjacent sides
                    const Dp = mul(add(mul(P, lq), mul(Q, lp)), 1 / (lp + lq));
                    s += line(V, Dp, sty(CY, 1.4, DASH));
                    s += arc(V, P, I, 24, 'fill:rgba(127,216,238,0.14);stroke:' + CY + ';stroke-width:1') + arc(V, I, Q, 30, 'fill:rgba(127,216,238,0.08);stroke:' + CY + ';stroke-width:1');
                });
                const u = unit(sub(Bv, A)), F = add(A, mul(u, dot2(sub(I, A), u)));
                s += line(I, F, sty(PHI, 1.8)) + rightMark(F, I, Bv, 8) + dot(I, PHI, 5) + txt(add(I, [12, -8]), 'I', 'g-pt');
                t = '<p style="margin:0">Die drei <span class="g-cy">Winkelhalbierenden</span> schneiden sich in einem Punkt $I$. Er hat von allen drei <b>Seiten</b> denselben Abstand:</p>' +
                    '<p style="margin:0">$\\rho \\approx ' + tcm(rho / CM) + '$</p><p style="margin:6px 0 0">Der Inkreis berührt jede Seite. $I$ liegt immer innerhalb des Dreiecks.</p>';
            } else t = '<p style="margin:0">Die drei Ecken liegen fast auf einer Geraden. Zieh eine Ecke weiter weg.</p>';
            s += poly([A, Bv, C], 'fill:rgba(232,237,245,0.07);stroke:' + TXT + ';stroke-width:2.4;stroke-linejoin:round');
            s += labelAway(A, G, 'A', 22) + labelAway(Bv, G, 'B', 22) + labelAway(C, G, 'C', 22);
            S.P.forEach((p, i) => { s += handle(p, i, LAM); });
            pic.innerHTML = svgTag(Wd, Ht, 'Dreieck mit ' + (S.mode === 'um' ? 'Umkreis' : 'Inkreis'), s);
            out.innerHTML = '<p style="margin:0 0 6px">$a \\approx ' + tcm(a / CM) + '$ · $b \\approx ' + tcm(b / CM) + '$ · $c \\approx ' + tcm(c / CM) + '$<br>' +
                '$\\alpha \\approx ' + tdeg(al) + '$ · $\\beta \\approx ' + tdeg(be) + '$ · $\\gamma \\approx ' + tdeg(ga) + '$</p>' + t;
            math(out);
        }
        render();
    });

    /* ---------- angles at the circle ---------- */
    W('kreiswinkel7', function (box) {
        const Wd = 440, Ht = 400, M = [220, 200], R = 150;
        const hero = isHero(box);
        const S = { mode: box.dataset.mode || 'thales', c: 122 * DEG, a: 212 * DEG, b: 328 * DEG, p: 104 * DEG, q: [25, 118, 205, 292].map(v => v * DEG), proof: false };
        let ctr = null, pbtn = null;
        if (!hero) {
            ctr = div(box, 'b-ctrls');
            seg(ctr, [['thales', 'Thales'], ['peri', 'Peripheriewinkel'], ['sehnen', 'Sehnenviereck']], S.mode, v => { S.mode = v; render(); }, 'Satz');
            pbtn = buttons(ctr, [['proof', 'Beweisidee zeigen']]).querySelector('button');
            pbtn.addEventListener('click', () => { S.proof = !S.proof; pbtn.classList.toggle('b-go', S.proof); render(); });
        }
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = hero ? null : div(two, 'b-out');
        if (hero) { two.style.display = 'block'; pic.style.maxWidth = '300px'; pic.style.margin = '0 auto'; }
        const sep = (x, y) => Math.min(norm(x - y), norm(y - x)) / DEG;
        dragSVG(pic, (i, x, y) => {
            const th = norm(angOf(M, [x, y]));
            if (i === 'c') { if (sep(th, 0) > 8 && sep(th, Math.PI) > 8) S.c = th; }
            else if (i === 'a' || i === 'b') { const o = i === 'a' ? S.b : S.a; if (sep(th, o) > 20 && sep(th, S.p) > 10) S[i] = th; }
            else if (i === 'p') { if (sep(th, S.a) > 10 && sep(th, S.b) > 10) S.p = th; }
            else {
                const k = +i, prev = S.q[(k + 3) % 4], next = S.q[(k + 1) % 4];
                const dt = norm(th - prev), span = norm(next - prev);
                if (dt > 12 * DEG && dt < span - 12 * DEG) S.q[k] = th;
            }
            render();
        });
        const cyS = a => 'rgba(127,216,238,' + a + ')';
        function render() {
            let s = circ(M, R, 'fill:rgba(127,216,238,0.04);stroke:' + DIM + ';stroke-width:1.8') + dot(M, TXT, 4) + txt(add(M, [0, S.mode === 'peri' ? -12 : 22]), 'M', 'g-pt');
            let t = '';
            if (S.mode === 'thales') {
                const A = onC(M, R, Math.PI), Bv = onC(M, R, 0), C = onC(M, R, S.c);
                const al = angle(A, Bv, C), be = angle(Bv, A, C), ga = angle(C, A, Bv);
                s += line(A, Bv, sty(DIM, 1.6));
                if (S.proof) {
                    s += arc(A, Bv, C, 34, 'fill:rgba(245,194,66,0.22);stroke:' + LAM + ';stroke-width:1.2') + arc(C, A, M, 34, 'fill:rgba(245,194,66,0.22);stroke:' + LAM + ';stroke-width:1.2');
                    s += arc(Bv, A, C, 34, 'fill:' + cyS(0.22) + ';stroke:' + CY + ';stroke-width:1.2') + arc(C, M, Bv, 40, 'fill:' + cyS(0.22) + ';stroke:' + CY + ';stroke-width:1.2');
                    s += line(M, C, sty(TXT, 1.8, DASH));
                    s += colTxt(add(A, rot([50, 0], -(al / 2) * DEG * (C[1] < M[1] ? 1 : -1))), 'α', 'g-ang', LAM) + colTxt(add(Bv, rot([-50, 0], (be / 2) * DEG * (C[1] < M[1] ? 1 : -1))), 'β', 'g-ang', CY);
                } else s += rightMark(C, A, Bv, 24);
                s += poly([A, Bv, C], 'fill:rgba(232,237,245,0.07);stroke:' + TXT + ';stroke-width:2.4;stroke-linejoin:round');
                s += dot(A, TXT) + dot(Bv, TXT) + labelAway(A, M, 'A', 20) + labelAway(Bv, M, 'B', 20) + labelAway(C, M, 'C', 22);
                s += handle(C, 'c', LAM);
                if (!hero) t = '<p style="margin:0">$\\alpha \\approx ' + tdeg(al) + '$ · $\\beta \\approx ' + tdeg(be) + '$ · $\\gamma = ' + tdeg(Math.round(ga * 10) / 10) + '$</p>' +
                    '<p style="margin:6px 0 0"><b>Satz des Thales:</b> Liegt $C$ auf dem Kreis über dem Durchmesser $\\overline{AB}$, so ist der Winkel bei $C$ ein rechter Winkel.</p>' +
                    (S.proof ? '<p style="margin:6px 0 0">Die Strecke $\\overline{MC}$ teilt das Dreieck in zwei <b>gleichschenklige</b> Dreiecke, denn $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. ' +
                        'Ihre Basiswinkel sind gleich: <span class="g-lam">$\\alpha$ bei $A$ und bei $C$</span>, <span class="g-cy">$\\beta$ bei $B$ und bei $C$</span>. ' +
                        'Winkelsumme: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, also $\\gamma = \\alpha + \\beta = 90^\\circ$.</p>' : '');
            } else if (S.mode === 'peri') {
                const A = onC(M, R, S.a), Bv = onC(M, R, S.b), P = onC(M, R, S.p);
                const phi = angle(P, A, Bv), inArc = norm(S.p - S.a) < norm(S.b - S.a);
                const from = inArc ? S.b : S.a, to = inArc ? S.a : S.b, zentri = norm(to - from) / DEG;
                s += path(arcPath(M, R, from, to), sty(CY, 5, 'opacity:0.8'));
                s += path(arcPath(M, 34, from, to, true), 'fill:' + cyS(0.18) + ';stroke:' + CY + ';stroke-width:1.3');
                s += line(M, A, sty(CY, 1.8)) + line(M, Bv, sty(CY, 1.8));
                s += arc(P, A, Bv, 36, 'fill:rgba(245,194,66,0.22);stroke:' + LAM + ';stroke-width:1.3');
                if (S.proof) { const P2 = onC(M, R, S.p + Math.PI); s += line(P, P2, sty(TXT, 1.6, DASH)) + dot(P2, DIM, 3.5); }
                s += line(A, Bv, sty(DIM, 1.4)) + line(P, A, sty(TXT, 2.2)) + line(P, Bv, sty(TXT, 2.2));
                s += labelAway(A, M, 'A', 20) + labelAway(Bv, M, 'B', 20) + labelAway(P, M, 'P', 22);
                s += handle(A, 'a', CY) + handle(Bv, 'b', CY) + handle(P, 'p', LAM);
                t = '<p style="margin:0"><span class="g-lam">Peripheriewinkel</span> $\\angle APB \\approx ' + tdeg(phi) + '$<br><span class="g-cy">Zentriwinkel</span> $\\angle AMB \\approx ' + tdeg(zentri) + '$</p>' +
                    '<p style="margin:6px 0 0"><b>Zentri-Peripheriewinkelsatz:</b> Der Zentriwinkel ist doppelt so groß wie jeder Peripheriewinkel über demselben Bogen. ' +
                    '<b>Peripheriewinkelsatz:</b> Alle Peripheriewinkel über demselben Bogen sind gleich groß. Zieh $P$ auf seinem Bogen hin und her.</p>' +
                    (S.proof ? '<p style="margin:6px 0 0">Beweisidee: Der Durchmesser durch $P$ zerlegt die Figur in gleichschenklige Dreiecke mit der Spitze $M$. ' +
                        'An jedem ist der Außenwinkel bei $M$ doppelt so groß wie ein Basiswinkel. Liegt $M$ nicht zwischen den Schenkeln, braucht der Beweis eine Fallunterscheidung.</p>' : '');
            } else {
                const Q = S.q.map(th => onC(M, R, th)), names = ['A', 'B', 'C', 'D'], gr = ['α', 'β', 'γ', 'δ'];
                const ang = Q.map((V, i) => angle(V, Q[(i + 3) % 4], Q[(i + 1) % 4]));
                if (S.proof) Q.forEach(V => { s += line(M, V, sty(TXT, 1.3, DASH)); });
                Q.forEach((V, i) => {
                    const c = i % 2 ? CY : LAM;
                    s += arc(V, Q[(i + 3) % 4], Q[(i + 1) % 4], 30, 'fill:' + (i % 2 ? cyS(0.2) : 'rgba(245,194,66,0.2)') + ';stroke:' + c + ';stroke-width:1.2');
                    const bis = unit(add(unit(sub(Q[(i + 3) % 4], V)), unit(sub(Q[(i + 1) % 4], V))));
                    s += colTxt(add(V, add(mul(bis, 46), [0, 6])), gr[i], 'g-ang', c);
                });
                s += poly(Q, 'fill:rgba(232,237,245,0.07);stroke:' + TXT + ';stroke-width:2.4;stroke-linejoin:round');
                Q.forEach((V, i) => { s += labelAway(V, M, names[i], 22) + handle(V, i, i % 2 ? CY : LAM); });
                t = '<p style="margin:0"><span class="g-lam">$\\alpha + \\gamma \\approx ' + tdeg(ang[0]) + ' + ' + tdeg(ang[2]) + ' = ' + tdeg(ang[0] + ang[2]) + '$</span><br>' +
                    '<span class="g-cy">$\\beta + \\delta \\approx ' + tdeg(ang[1]) + ' + ' + tdeg(ang[3]) + ' = ' + tdeg(ang[1] + ang[3]) + '$</span></p>' +
                    '<p style="margin:6px 0 0"><b>Satz über die Gegenwinkel im Sehnenviereck:</b> In einem Viereck, dessen Ecken auf einem Kreis liegen, ergänzen sich gegenüberliegende Winkel zu $180^\\circ$.</p>' +
                    (S.proof ? '<p style="margin:6px 0 0">Beweisidee: Die vier Radien zerlegen das Viereck in vier gleichschenklige Dreiecke. Jeder Winkel des Vierecks besteht aus zwei Basiswinkeln. ' +
                        '$\\alpha + \\gamma$ enthält jeden der vier verschiedenen Basiswinkel genau einmal, ebenso $\\beta + \\delta$. Beide Summen sind also gleich, zusammen $360^\\circ$, jede $180^\\circ$. ' +
                        '(So einfach geht es, wenn $M$ im Viereck liegt.)</p>' : '');
            }
            pic.innerHTML = svgTag(Wd, Ht, { thales: 'Satz des Thales: Dreieck über dem Durchmesser', peri: 'Peripheriewinkel und Zentriwinkel über einem Kreisbogen', sehnen: 'Sehnenviereck mit seinen vier Winkeln' }[S.mode], s);
            if (out) { out.innerHTML = t; math(out); }
        }
        render();
    });

    /* ---------- constructions step by step ---------- */
    W('konstruktion7', function (box) {
        const Wd = 440, Ht = 360, CM = 35;
        const hero = isHero(box);
        const S = { mode: box.dataset.mode || 'tangente', step: 0, P: [372, 128], M2: [330, 196], al: 50, be: 65 };
        let ctr = null, sl = null, stepRow = null;
        if (!hero) {
            ctr = div(box, 'b-ctrls');
            seg(ctr, [['tangente', 'Tangenten von P'], ['dreieck', 'Dreieck aus c, α, β'], ['zweikreise', 'Tangenten an zwei Kreise']], S.mode, v => { S.mode = v; S.step = 0; sync(); render(); }, 'Konstruktion');
            stepRow = buttons(div(box, 'b-ctrls'), [['-1', '◀ Zurück'], ['1', 'Weiter ▶', true], ['all', 'Alle Schritte'], ['0', 'Von vorn']]);
            stepRow.addEventListener('click', e => {
                const b = e.target.closest('button'); if (!b) return;
                const n = STEPS[S.mode].length - 1, k = b.dataset.k;
                S.step = k === 'all' ? n : k === '0' ? 0 : clamp(S.step + (+k), 0, n);
                render();
            });
            sl = div(box, '');
            range(sl, { label: 'Winkel $\\alpha$', min: 20, max: 130, step: 5, value: S.al, fmt: v => v + '°', onInput: v => { S.al = v; render(); } });
            range(sl, { label: 'Winkel $\\beta$', min: 20, max: 130, step: 5, value: S.be, fmt: v => v + '°', onInput: v => { S.be = v; render(); } });
            math(sl);
        }
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = hero ? null : div(two, 'b-out');
        if (hero) { two.style.display = 'block'; pic.style.maxWidth = '340px'; pic.style.margin = '0 auto'; }
        const sync = () => { if (sl) sl.style.display = S.mode === 'dreieck' ? '' : 'none'; };
        if (hero || B.printing()) S.step = 99;
        dragSVG(pic, (i, x, y) => {
            const p = [clamp(x, 16, Wd - 16), clamp(y, 16, Ht - 16)];
            if (i === 'P') { const M = [140, 190], d = len(sub(p, M)); S.P = d < 70 + 40 ? add(M, mul(unit(sub(p, M)), 110)) : p; }
            if (i === 'M2') { const M1 = [140, 190], d = len(sub(p, M1)); S.M2 = d < 120 ? add(M1, mul(unit(sub(p, M1)), 120)) : p; }
            render();
        });
        const on = (k, cur) => k === cur;
        const thin = (c, k, cur) => sty(on(k, cur) ? LAM : c, on(k, cur) ? 2.4 : 1.4);
        // ---- tangents from an outside point ----
        function tangente(st) {
            const M = [140, 190], r = 70, P = S.P, H = mid(M, P), rho = len(sub(P, M)) / 2;
            const X = cc(M, rho * 1.45, P, rho * 1.45), Bp = cc(M, r, H, rho);
            let s = circ(M, r, 'fill:rgba(127,216,238,0.05);stroke:' + CY + ';stroke-width:2.2') + dot(M, TXT, 4) + txt(add(M, [-14, -8]), 'M', 'g-pt') + txt(add(M, [-r * 0.7, -r * 0.82]), 'k', 'g-side');
            if (st >= 1) s += line(M, P, thin(TXT, 1, st));
            if (st >= 2 && X) {
                [M, P].forEach(C => X.forEach(Xp => { const th = angOf(C, Xp); s += path(arcPath(C, rho * 1.45, th - 0.22, th + 0.22), thin(DIM, 2, st)); }));
                s += fullLine(X[0], X[1], Wd, Ht, sty(on(2, st) ? LAM : DIM, 1.2, DASH)) + dot(H, on(2, st) ? LAM : TXT, 4.5) + txt(add(H, [10, 18]), 'H', 'g-pt');
            }
            if (st >= 3) s += circ(H, rho, sty(on(3, st) ? LAM : VIO, on(3, st) ? 2.2 : 1.5, DASH));
            if (st >= 4 && Bp) Bp.forEach((Q, i) => { s += line(M, Q, sty(TXT, 1.5)) + rightMark(Q, M, P, 10) + dot(Q, on(4, st) ? LAM : TXT, 5) + labelAway(Q, M, i ? 'B₂' : 'B₁', 20); });
            if (st >= 5 && Bp) Bp.forEach(Q => { s += fullLine(P, Q, Wd, Ht, sty(LAM, 3)); });
            s += dot(P, TXT, 4.5) + txt(add(P, [14, -8]), 'P', 'g-pt', 'start');
            if (!hero) s += handle(P, 'P', LAM);
            return s;
        }
        // ---- triangle from c, α, β (WSW) ----
        function dreieck(st) {
            const c = 6, al = S.al * DEG, be = S.be * DEG, ok = S.al + S.be < 180;
            let C = null;
            if (ok) { const hC = c * Math.tan(al) * Math.tan(be) / (Math.tan(al) + Math.tan(be)); C = [hC / Math.tan(al), hC]; }
            // fit the drawing: A = (0, 0), B = (c, 0), C in cm, y up
            const xs = [0, c].concat(C ? [C[0]] : []), ys = [0].concat(C ? [C[1]] : [3]);
            const k = Math.min(CM * 1.15, (Wd - 80) / (Math.max(...xs) - Math.min(...xs)), (Ht - 70) / (Math.max(...ys) + 0.01));
            const ox = (Wd - k * (Math.max(...xs) + Math.min(...xs))) / 2, oy = Ht - 36;
            const T = p => [ox + k * p[0], oy - k * p[1]];
            const A = T([0, 0]), Bv = T([c, 0]), ray = 30;
            let s = '';
            if (st >= 1) s += line(A, Bv, sty(on(1, st) ? LAM : TXT, 2.6)) + txt(add(mid(A, Bv), [0, 24]), 'c = 6 cm', 'g-lab');
            if (st >= 2) {
                const e = T([ray * Math.cos(al), ray * Math.sin(al)]);
                s += line(A, add(A, mul(unit(sub(e, A)), 900)), sty(on(2, st) ? LAM : DIM, 1.5));
                s += arc(A, Bv, add(A, unit(sub(e, A))), 34, 'fill:rgba(245,194,66,0.2);stroke:' + LAM + ';stroke-width:1.2') + colTxt(add(A, rot([50, 0], -al / 2)), 'α', 'g-ang', LAM);
            }
            if (st >= 3) {
                const e = T([c - ray * Math.cos(be), ray * Math.sin(be)]);
                s += line(Bv, add(Bv, mul(unit(sub(e, Bv)), 900)), sty(on(3, st) ? LAM : DIM, 1.5));
                s += arc(Bv, A, add(Bv, unit(sub(e, Bv))), 34, 'fill:rgba(127,216,238,0.2);stroke:' + CY + ';stroke-width:1.2') + colTxt(add(Bv, rot([-50, 0], be / 2)), 'β', 'g-ang', CY);
            }
            if (st >= 4 && C) s += dot(T(C), on(4, st) ? LAM : TXT, 5.5) + txt(add(T(C), [0, -14]), 'C', 'g-pt');
            if (st >= 5 && C) {
                const Cp = T(C);
                s += poly([A, Bv, Cp], 'fill:rgba(232,237,245,0.08);stroke:' + TXT + ';stroke-width:2.4;stroke-linejoin:round');
                s += arc(Cp, A, Bv, 28, 'fill:rgba(160,200,90,0.22);stroke:' + PHI + ';stroke-width:1.2');
            }
            s += dot(A, TXT, 4) + dot(Bv, TXT, 4) + txt(add(A, [-12, 18]), 'A', 'g-pt') + txt(add(Bv, [12, 18]), 'B', 'g-pt');
            return s;
        }
        // ---- common outer tangents of two circles ----
        function zweikreise(st) {
            const M1 = [140, 190], r1 = 70, M2 = S.M2, r2 = 35, d = len(sub(M2, M1)), u = unit(sub(M2, M1));
            const bt = Math.acos((r1 - r2) / d), E = [rot(u, bt), rot(u, -bt)];
            let s = circ(M1, r1, 'fill:rgba(127,216,238,0.05);stroke:' + CY + ';stroke-width:2.2') + circ(M2, r2, 'fill:rgba(127,216,238,0.05);stroke:' + CY + ';stroke-width:2.2');
            s += dot(M1, TXT, 4) + dot(M2, TXT, 4) + txt(add(M1, [-16, -8]), 'M₁', 'g-pt') + txt(add(M2, [16, -8]), 'M₂', 'g-pt', 'start');
            if (st >= 1) s += circ(M1, r1 - r2, sty(on(1, st) ? LAM : VIO, 1.6, DASH)) + txt(add(M1, [0, r1 - r2 + 18]), 'h', 'g-side');
            if (st >= 2) {
                s += line(M1, M2, sty(DIM, 1.2)) + circ(mid(M1, M2), d / 2, sty(on(2, st) ? LAM : DIM, 1.3, DASH));
                E.forEach((e, i) => { const Tp = add(M1, mul(e, r1 - r2)); s += line(M2, Tp, sty(on(2, st) ? LAM : TXT, 1.5)) + dot(Tp, on(2, st) ? LAM : TXT, 4.5) + labelAway(Tp, M1, i ? 'T₂' : 'T₁', 16, 'g-lab'); });
            }
            if (st >= 3) E.forEach((e, i) => { const B1 = add(M1, mul(e, r1)); s += line(M1, B1, sty(on(3, st) ? LAM : TXT, 1.6)) + dot(B1, on(3, st) ? LAM : TXT, 5) + labelAway(B1, M1, i ? 'B₂' : 'B₁', 18); });
            if (st >= 4) E.forEach(e => {
                const B1 = add(M1, mul(e, r1)), B2 = add(M2, mul(e, r2));
                s += fullLine(B1, B2, Wd, Ht, sty(LAM, 3)) + line(M2, B2, sty(TXT, 1.3)) + rightMark(B2, M2, B1, 8) + dot(B2, LAM, 4.5);
            });
            if (!hero) s += handle(M2, 'M2', LAM);
            return s;
        }
        const STEPS = {
            tangente: ['Gegeben sind ein Kreis $k$ um $M$ mit $r = 2$ cm und ein Punkt $P$ außerhalb von $k$.', 'Verbinde $M$ und $P$.',
                'Konstruiere die Mittelsenkrechte von $\\overline{MP}$: zwei Kreisbögen um $M$ und $P$ mit demselben Radius. Sie schneidet $\\overline{MP}$ im Mittelpunkt $H$.',
                'Zeichne den Kreis um $H$ durch $M$ und $P$, den Thaleskreis über $\\overline{MP}$.',
                'Er schneidet $k$ in $B_1$ und $B_2$. Nach dem Satz des Thales sind die Winkel $\\angle MB_1P$ und $\\angle MB_2P$ rechte Winkel.',
                'Die Geraden $PB_1$ und $PB_2$ stehen in $B_1$ und $B_2$ senkrecht auf dem Radius: Das sind die beiden Tangenten von $P$ an $k$.'],
            dreieck: ['Fertige eine Planfigur an und markiere, was gegeben ist: $c = 6$ cm, $\\alpha$ und $\\beta$. Das ist der Fall WSW.', 'Zeichne die Strecke $\\overline{AB}$ mit $c = 6$ cm.',
                'Trage in $A$ den Winkel $\\alpha$ an.', 'Trage in $B$ den Winkel $\\beta$ an.', 'Die freien Schenkel schneiden sich im Punkt $C$.',
                'Zeichne das Dreieck $ABC$. Probe: Miss $\\gamma$ und vergleiche mit $180^\\circ - \\alpha - \\beta$.'],
            zweikreise: ['Gegeben sind $k_1$ um $M_1$ mit $r_1 = 2$ cm und $k_2$ um $M_2$ mit $r_2 = 1$ cm. Gesucht sind die beiden gemeinsamen äußeren Tangenten.',
                'Zeichne den Hilfskreis $h$ um $M_1$ mit dem Radius $r_1 - r_2 = 1$ cm.',
                'Konstruiere die Tangenten von $M_2$ an $h$ wie bei „Tangenten von P“: Der Thaleskreis über $\\overline{M_1M_2}$ schneidet $h$ in $T_1$ und $T_2$.',
                'Verlängere $M_1T_1$ und $M_1T_2$ bis zum Kreis $k_1$: die Berührungspunkte $B_1$ und $B_2$.',
                'Verschiebe die Hilfstangenten um $r_2$ nach außen: Die Parallelen durch $B_1$ und $B_2$ sind die gemeinsamen Tangenten. Sie berühren $k_2$ dort, wo der Radius senkrecht auf ihnen steht.']
        };
        function render() {
            const list = STEPS[S.mode], st = Math.min(S.step, list.length - 1);
            const s = S.mode === 'tangente' ? tangente(st) : S.mode === 'dreieck' ? dreieck(st) : zweikreise(st);
            pic.innerHTML = svgTag(Wd, Ht, { tangente: 'Konstruktion der Tangenten von einem Punkt an einen Kreis', dreieck: 'Konstruktion eines Dreiecks aus einer Seite und zwei Winkeln', zweikreise: 'Konstruktion der gemeinsamen Tangenten an zwei Kreise' }[S.mode], s);
            if (!out) return;
            let t = '<p class="b-help" style="margin:0 0 6px">SCHRITT ' + (st + 1) + ' VON ' + list.length + '</p><ol style="margin:0;padding-left:1.3em">' +
                list.slice(0, st + 1).map((x, i) => '<li style="margin:0 0 4px' + (i === st ? ';color:#fff' : ';opacity:0.75') + '">' + x + '</li>').join('') + '</ol>';
            if (S.mode === 'dreieck') {
                if (S.al + S.be >= 180) t += '<p style="margin:8px 0 0" class="g-warn">$\\alpha + \\beta = ' + (S.al + S.be) + '^\\circ$: Die freien Schenkel schneiden sich nicht. Ein solches Dreieck gibt es nicht, denn die Winkelsumme im Dreieck beträgt $180^\\circ$.</p>';
                else if (st >= 5) t += '<p style="margin:8px 0 0" class="g-ok">$\\gamma = 180^\\circ - ' + S.al + '^\\circ - ' + S.be + '^\\circ = ' + (180 - S.al - S.be) + '^\\circ$</p>';
            }
            if (S.mode === 'tangente' && st === 0) t += '<p class="b-help" style="margin:8px 0 0">Du kannst $P$ verschieben, in jedem Schritt.</p>';
            if (S.mode === 'zweikreise' && st === 0) t += '<p class="b-help" style="margin:8px 0 0">Du kannst $M_2$ verschieben, in jedem Schritt.</p>';
            out.innerHTML = t;
            math(out);
        }
        sync();
        render();
    });

    /* ---------- the number line ---------- */
    W('zahlengerade7', function (box) {
        const hero = isHero(box), mode = box.dataset.mode || 'ordnen';
        const Wd = 640, Ht = hero ? 170 : 190, X0 = 320, U = 29, Y = hero ? 110 : 120;
        const xs = v => X0 + v * U;
        const S = { a: hero ? -3 : -3.5, b: 2, op: '+' };
        let ctr = null;
        if (!hero && mode === 'rechnen') {
            S.a = -3; S.b = 4;
            ctr = div(box, '');
            seg(div(ctr, 'b-ctrls'), [['+', 'Addieren'], ['-', 'Subtrahieren']], '+', v => { S.op = v; render(); }, 'Rechenart');
            range(ctr, { label: 'erste Zahl $a$', min: -6, max: 6, step: 0.5, value: S.a, fmt: v => (v < 0 ? '−' : '') + fmt(Math.abs(v), 1), onInput: v => { S.a = v; render(); } });
            range(ctr, { label: 'zweite Zahl $b$', min: -4, max: 4, step: 0.5, value: S.b, fmt: v => (v < 0 ? '−' : '') + fmt(Math.abs(v), 1), onInput: v => { S.b = v; render(); } });
            math(ctr);
        }
        const pic = div(box, 'b-svgbox g-svg zg7-svg'), out = hero ? null : div(box, 'b-out');
        if (!hero && mode === 'ordnen') {
            dragSVG(pic, (i, x) => { S[i] = clamp(Math.round((x - X0) / U * 2) / 2, -10, 10); render(); });
            const help = div(box, 'b-help', 'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.'); math(help);
        }
        function axis() {
            let s = line([14, Y], [Wd - 18, Y], sty(TXT, 2)) + '<path d="M' + (Wd - 8) + ' ' + Y + ' l-14 -7 v14 z" fill="' + TXT + '"/>';
            const every = (pic.clientWidth || Wd) < 520 ? 5 : 2;          // on the phone the numbers are larger, so fewer of them
            for (let k = -10; k <= 10; k++) {
                const x = xs(k);
                s += line([x, Y - (k % every ? 6 : 9)], [x, Y + (k % every ? 6 : 9)], sty(TXT, k ? 1.3 : 2.2, 'opacity:0.8'));
                if (k % every === 0) s += '<text class="zg7-num" x="' + x + '" y="' + (Y + 30) + '" text-anchor="middle">' + (k < 0 ? '−' + -k : k) + '</text>';
            }
            return s;
        }
        const nTex = v => v < 0 ? '−' + fmt(-v, 1) : fmt(v, 1);
        function render() {
            let s = axis();
            if (mode === 'ordnen' || hero) {
                const a = S.a, b = S.b, xa = xs(a), xm = xs(-a);
                if (a !== 0) {
                    const r = Math.abs(xa - xm) / 2;
                    s += path('M' + f1(Math.min(xa, xm)) + ' ' + Y + ' A' + f1(r) + ' ' + f1(Math.min(r, 52)) + ' 0 0 1 ' + f1(Math.max(xa, xm)) + ' ' + Y, sty(PHI, 1.8, DASH));
                    s += circ([xm, Y], 7, 'fill:#0a1426;stroke:' + PHI + ';stroke-width:2.4') + colTxt([xm + (xm > xa ? 12 : -12), Y - 14], hero ? '3' : '−a', 'zg7-lab', PHI, xm > xa ? 'start' : 'end');
                }
                if (!hero) {
                    // |a| as a bracket under the line
                    const yb = Y + 46;
                    s += line([xs(0), yb], [xa, yb], sty(LAM, 3, 'opacity:0.7')) + line([xs(0), yb - 6], [xs(0), yb + 6], sty(LAM, 2)) + line([xa, yb - 6], [xa, yb + 6], sty(LAM, 2));
                    s += colTxt([(xs(0) + xa) / 2, yb + 22], '|a| = ' + fmt(Math.abs(a), 1), 'zg7-lab', LAM);
                    s += handle([xs(b), Y], 'b', CY) + colTxt([xs(b), Y - 22], 'b', 'zg7-lab', CY);
                }
                s += hero ? circ([xa, Y], 8, 'fill:' + LAM) + colTxt([xa - 12, Y - 14], '−3', 'zg7-lab', LAM, 'end') + colTxt([X0, Y - 62], 'Gegenzahlen', 'zg7-lab', PHI)
                    : handle([xa, Y], 'a', LAM) + colTxt([xa, Y - 22], 'a', 'zg7-lab', LAM);
                if (hero) s += circ([xs(-7.5), Y], 6, 'fill:' + CY) + colTxt([xs(-7.5), Y - 16], '−7,5', 'zg7-lab', CY) + circ([xs(6), Y], 6, 'fill:' + CY) + colTxt([xs(6), Y - 16], '6', 'zg7-lab', CY);
                pic.innerHTML = svgTag(Wd, Ht, 'Zahlengerade mit rationalen Zahlen', s.replace(/r="22" fill="transparent"/g, 'r="40" fill="transparent"'));
                if (!out) return;
                const rel = a < b ? '<' : a > b ? '>' : '=';
                out.innerHTML = '<p style="margin:0"><span class="g-lam">$a = ' + tn(a, 1) + '$</span> · <span class="g-cy">$b = ' + tn(b, 1) + '$</span> · ' +
                    '$a ' + rel + ' b$' + (a !== b ? ', denn ' + (a < b ? '$a$' : '$b$') + ' liegt weiter <b>links</b>.' : '.') + '</p>' +
                    '<p style="margin:0">Betrag: <span class="g-lam">$\\lvert ' + tn(a, 1) + ' \\rvert = ' + texNum(Math.abs(a), 1) + '$</span>, der Abstand von der Null · ' +
                    'Gegenzahl: <span class="g-phi">$' + tn(-a, 1) + '$</span>, gespiegelt an der Null</p>' +
                    '<p style="margin:0">Abstand von $a$ und $b$: $' + texNum(Math.abs(a - b), 1) + '$</p>';
                math(out);
                return;
            }
            // adding and subtracting as moves along the line
            const a = S.a, b = S.b, e = S.op === '+' ? b : -b, r = a + e, xa = xs(a), xr = xs(r), yA = Y - 34;
            if (e !== 0) {
                const c = e > 0 ? PHI : RED;
                s += line([xa, Y], [xa, yA], sty(DIM, 1.2, 'stroke-dasharray:3 4;')) + line([xr, Y], [xr, yA], sty(DIM, 1.2, 'stroke-dasharray:3 4;'));
                s += line([xa, yA], [xr - Math.sign(e) * 8, yA], sty(c, 3.5)) + '<path d="M' + f1(xr) + ' ' + yA + ' l' + (-Math.sign(e) * 13) + ' -7 v14 z" fill="' + c + '"/>';
                s += colTxt([(xa + xr) / 2, yA - 12], (e > 0 ? '+' : '−') + fmt(Math.abs(e), 1), 'zg7-lab', c);
            }
            s += circ([xa, Y], 7, 'fill:' + LAM) + colTxt([xa, Y + 52], 'Start', 'zg7-lab', LAM) + circ([xr, Y], 8, 'fill:#fff;stroke:' + LAM + ';stroke-width:2');
            pic.innerHTML = svgTag(Wd, Ht, 'Rechnen als Bewegung auf der Zahlengeraden', s);
            let t = '$' + tn(a, 1) + (S.op === '+' ? ' + ' : ' - ') + tp(b, 1) + (S.op === '-' && b !== 0 ? ' = ' + tn(a, 1) + ' + ' + tp(-b, 1) : '') + ' = ' + tn(r, 1) + '$';
            const dir = e > 0 ? 'nach <b>rechts</b>' : e < 0 ? 'nach <b>links</b>' : 'gar nicht';
            t = '<p style="margin:0;font-size:1.1em">' + t + '</p><p style="margin:6px 0 0">Start bei $' + tn(a, 1) + '$, dann $' + texNum(Math.abs(e), 1) + '$ ' + dir + '.</p>';
            if (S.op === '-') t += '<p style="margin:6px 0 0">Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ' + (b < 0 ? 'Minus mal minus: Wer $' + tp(b, 1) + '$ abzieht, geht nach rechts.' : '') + '</p>';
            else t += '<p style="margin:6px 0 0">Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.</p>';
            out.innerHTML = t; math(out);
        }
        render();
        let wide = (pic.clientWidth || Wd) >= 520;
        if (window.ResizeObserver) new ResizeObserver(() => { const w = (pic.clientWidth || Wd) >= 520; if (w !== wide) { wide = w; render(); } }).observe(pic);
    });

    /* ---------- N, Z, Q+ and Q ---------- */
    W('zahlbereiche7', function (box) {
        // regions: 0 = N (both), 1 = Z only, 2 = Q+ only, 3 = Q only
        const NUMS = [
            ['7', '7', 0, 'eine natürliche Zahl'], ['\\tfrac{12}{4}', '12/4', 0, '$\\tfrac{12}{4} = 3$, also natürlich'], ['-(-5)', '−(−5)', 0, '$-(-5) = 5$'], ['|-4|', '|−4|', 0, 'der Betrag von $-4$ ist $4$'],
            ['-3', '−3', 1, 'ganz und negativ'], ['-\\tfrac{10}{5}', '−10/5', 1, '$-\\tfrac{10}{5} = -2$'], ['2 - 9', '2 − 9', 1, '$2 - 9 = -7$'], ['-15', '−15', 1, 'ganz und negativ'],
            ['\\tfrac34', '3/4', 2, 'ein Bruch ohne Minuszeichen'], ['2{,}5', '2,5', 2, '$2{,}5 = \\tfrac52$'], ['0{,}1', '0,1', 2, '$0{,}1 = \\tfrac{1}{10}$'], ['\\tfrac73', '7/3', 2, 'zwischen 2 und 3, nicht ganz'],
            ['-\\tfrac12', '−1/2', 3, 'negativ und nicht ganz'], ['-0{,}75', '−0,75', 3, '$-0{,}75 = -\\tfrac34$'], ['-2{,}5', '−2,5', 3, 'negativ und nicht ganz'], ['-\\tfrac43', '−4/3', 3, 'negativ und nicht ganz']
        ];
        const NAME = ['$\\mathbb{N}$', '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$', 'nur $\\mathbb{Q}$'];
        // two layouts: side by side (wide) and one above the other (narrow boxes, phone)
        // Q is the frame, Z and Q+ are rounded rectangles whose overlap is N; slots hold the placed numbers per region
        const LAY = {
            wide: { W: 640, H: 460, Q: [8, 8, 624, 444], Z: [30, 100, 350, 310], P: [260, 100, 350, 310],
                names: [[26, 44, 'ℚ', 'zb-name'], [56, 42, 'rationale Zahlen'], [48, 140, 'ℤ', 'zb-name'], [78, 138, 'ganze Zahlen'],
                    [592, 140, 'ℚ⁺', 'zb-name', 'end'], [548, 160, 'gebrochene Zahlen', '', 'end'], [320, 140, 'ℕ', 'zb-name', 'middle'], [320, 164, 'natürliche', '', 'middle']],
                sub: [320, 198, 'middle'],
                slots: [[[320, 230], [320, 275], [320, 320], [320, 365]],
                    [[110, 210], [185, 210], [110, 260], [185, 260], [110, 310], [185, 310], [110, 360], [185, 360]],
                    [[455, 210], [530, 210], [455, 260], [530, 260], [455, 310], [530, 310], [455, 360], [530, 360]],
                    [[300, 52], [390, 52], [480, 52], [570, 52], [130, 432], [230, 432], [410, 432], [510, 432]]] },
            tall: { W: 400, H: 580, Q: [8, 8, 384, 564], Z: [24, 70, 352, 250], P: [24, 230, 352, 250],
                names: [[26, 44, 'ℚ', 'zb-name'], [56, 42, 'rationale Zahlen'], [42, 106, 'ℤ', 'zb-name'], [72, 104, 'ganze Zahlen'],
                    [42, 468, 'ℚ⁺', 'zb-name'], [80, 466, 'gebrochene Zahlen'], [42, 262, 'ℕ', 'zb-name'], [72, 260, 'natürliche']],
                sub: [360, 260, 'end'],
                slots: [[[100, 296], [180, 296], [260, 296], [336, 296]],
                    [[80, 150], [160, 150], [240, 150], [320, 150], [80, 196], [160, 196], [240, 196], [320, 196]],
                    [[80, 356], [160, 356], [240, 356], [320, 356], [80, 404], [160, 404], [240, 404], [320, 404]],
                    [[80, 524], [160, 524], [240, 524], [320, 524], [270, 40], [340, 40]]] }
        };
        const S = { placed: [], cur: null, right: 0, tries: 0, show: 'none' }, cid = 'zb7' + Math.random().toString(36).slice(2, 8);
        let pool = NUMS.slice();
        const card = div(box, 'b-out zb-card');
        const pick = div(box, 'b-ctrls');
        pick.innerHTML = '<span class="b-ctrl">Wohin gehört die Zahl?</span>' + NAME.map((n, i) => '<button type="button" class="b-btn" data-r="' + i + '">' + n + '</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-next>Nächste Zahl</button>';
        math(pick);
        const pic = div(box, 'b-svgbox zb-svg');
        const msg = div(box, 'b-help'); msg.setAttribute('aria-live', 'polite');
        const ops = div(box, 'b-ctrls');
        seg(ops, [['none', 'Nur das Bild'], ['sub', 'Teilmengen'], ['cap', 'Schnittmenge'], ['cup', 'Vereinigung']], 'none', v => { S.show = v; draw(); }, 'Mengen');
        const opOut = div(box, 'b-out');
        let lay = null;
        function draw() {
            const L = LAY[(pic.clientWidth || 640) < 520 ? 'tall' : 'wide'];
            lay = L;
            const hi = S.show === 'cup' ? 0.2 : 0.07, rect = (r, st, extra) => '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" rx="' + (r === L.Q ? 20 : 40) + '"' + (extra || '') + (st ? ' style="' + st + '"' : '') + '/>';
            let s = '<g class="zb-ring zb-r3" data-r="3">' + rect(L.Q) + '</g>';
            s += rect(L.Z, 'fill:rgba(160,200,90,' + hi + ');stroke:rgb(160,200,90);stroke-width:1.8', ' data-r="1" class="zb-ring"');
            s += rect(L.P, 'fill:rgba(127,216,238,' + hi + ');stroke:#7fd8ee;stroke-width:1.8', ' data-r="2" class="zb-ring"');
            s += '<defs><clipPath id="' + cid + '">' + rect(L.Z) + '</clipPath></defs>';
            s += rect(L.P, 'fill:rgba(245,194,66,' + (S.show === 'cap' ? 0.34 : 0.14) + ');stroke:none', ' clip-path="url(#' + cid + ')" data-r="0" class="zb-ring"');
            L.names.forEach(([x, y, t, cls, anchor]) => { s += '<text class="' + (cls || 'zg7-set') + '" x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + t + '</text>'; });
            if (S.show === 'sub') s += '<text class="zg7-set" x="' + L.sub[0] + '" y="' + L.sub[1] + '" text-anchor="' + L.sub[2] + '" style="fill:' + LAM + '">ℕ ⊂ ℤ, ℕ ⊂ ℚ⁺</text>';
            const used = [0, 0, 0, 0];
            S.placed.forEach(p => {
                const sl = L.slots[p.r][used[p.r]++ % L.slots[p.r].length], w = Math.min(76, 22 + 9 * [...p.lab].length);
                s += '<g class="zb-chip' + (p.fresh ? ' zb-new' : '') + '" pointer-events="none"><rect x="' + (sl[0] - w / 2) + '" y="' + (sl[1] - 16) + '" width="' + w + '" height="30" rx="15"/>' +
                    '<text x="' + sl[0] + '" y="' + (sl[1] + 5) + '" text-anchor="middle">' + p.lab + '</text></g>';
            });
            pic.innerHTML = svgTag(L.W, L.H, 'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen', s);
            opOut.innerHTML = {
                none: '<p style="margin:0">Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.</p>',
                sub: '<p style="margin:0"><b>Teilmenge:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}$.</p>',
                cap: '<p style="margin:0"><b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.</p>',
                cup: '<p style="margin:0"><b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.</p>'
            }[S.show];
            math(opOut);
        }
        function next() {
            if (!pool.length) pool = NUMS.slice();
            S.cur = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            card.innerHTML = '<span class="zb-k">DIE ZAHL</span> <span class="zb-num">$' + S.cur[0] + '$</span> <span class="zb-q">In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.</span>';
            msg.innerHTML = S.tries ? 'Richtig: ' + S.right + ' von ' + S.tries : '';
            math(card);
        }
        function answer(r) {
            if (!S.cur) return;
            S.tries++;
            if (r === S.cur[2]) {
                S.right++;
                S.placed.forEach(p => { p.fresh = false; });
                if (S.placed.filter(p => p.r === r).length >= LAY.tall.slots[r].length) S.placed.splice(S.placed.findIndex(p => p.r === r), 1);
                S.placed.push({ lab: S.cur[1], r, fresh: true });
                msg.innerHTML = '<b>Richtig!</b> $' + S.cur[0] + '$: ' + S.cur[3] + '. · Richtig: ' + S.right + ' von ' + S.tries;
                S.cur = null; draw();
                setTimeout(next, B.printing() ? 0 : 1400);
            } else msg.innerHTML = 'Noch nicht. Tipp: ' + (S.cur[2] % 2 ? 'Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?' : 'Rechne die Zahl zuerst aus. Ist sie ganz?') + ' · Richtig: ' + S.right + ' von ' + S.tries;
            math(msg);
        }
        pick.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.next != null) next(); else answer(+b.dataset.r);
        });
        pic.addEventListener('click', e => { const g = e.target.closest('[data-r]'); if (g) answer(+g.dataset.r); });
        [['5', 0], ['−2', 1], ['3/4', 2], ['−1/2', 3]].forEach(([lab, r]) => S.placed.push({ lab, r }));
        draw();
        if (window.ResizeObserver) new ResizeObserver(() => { if (lay !== LAY[(pic.clientWidth || 640) < 520 ? 'tall' : 'wide']) draw(); }).observe(pic);
        next();
    });

    /* ---------- sign rules from a pattern ---------- */
    W('vorzeichen7', function (box) {
        const S = { mode: box.dataset.mode || 'mal', a: 3, k: 4 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['mal', 'Multiplizieren'], ['potenz', 'Potenzen']], S.mode, v => { S.mode = v; S.k = v === 'mal' ? 4 : 2; sync(); render(); }, 'Muster');
        const aSeg = seg(ctr, [['3', '$3 \\cdot \\ldots$'], ['-3', '$(-3) \\cdot \\ldots$']], '3', v => { S.a = +v; S.k = 4; render(); }, 'erster Faktor');
        math(aSeg.el);
        const nav = buttons(ctr, [['next', 'Nächste Zeile', true], ['reset', 'Von vorn']]);
        const two = div(box, 'b-two'), out = div(two, 'b-out'), pic = div(two, 'b-svgbox g-svg');
        const sync = () => { aSeg.el.style.display = S.mode === 'mal' ? '' : 'none'; pic.style.display = S.mode === 'mal' ? '' : 'none'; };
        // data-hero: only the number line with all seven results (opening of a chapter)
        if (isHero(box)) { S.k = 7; ctr.style.display = 'none'; out.style.display = 'none'; two.style.display = 'block'; pic.style.maxWidth = '360px'; pic.style.margin = '0 auto'; }
        nav.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            const n = S.mode === 'mal' ? 7 : 6;
            S.k = b.dataset.k === 'reset' ? (S.mode === 'mal' ? 4 : 2) : Math.min(n, S.k + 1);
            render();
        });
        if (B.printing()) S.k = 7;
        function render() {
            if (S.mode === 'potenz') {
                const k = Math.min(S.k, 6);
                let t = '';
                for (let n = 1; n <= 6; n++) {
                    const v = Math.pow(-2, n), shown = n <= k;
                    t += '<p class="vz7-row' + (n === k ? ' on' : '') + '">$(-2)^{' + n + '} = ' + (n > 1 ? Array(n).fill('(-2)').join(' \\cdot ') + ' = ' : '') + (shown ? tn(v, 0) : '\\;?') + '$' +
                        (shown ? ' <span class="vz7-sign" style="color:' + (v > 0 ? PHI : RED) + '">' + (v > 0 ? 'positiv' : 'negativ') + '</span>' : '') + '</p>';
                }
                if (k >= 4) t += '<p style="margin:10px 0 0" class="g-ok">Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.</p>' +
                    '<p class="b-help" style="margin:6px 0 0">Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.</p>';
                out.innerHTML = t; math(out);
                return;
            }
            const a = S.a, F = [3, 2, 1, 0, -1, -2, -3], k = Math.min(S.k, 7);
            let t = '';
            F.forEach((f, i) => {
                const shown = i < k;
                t += '<p class="vz7-row' + (i === k - 1 ? ' on' : '') + '">$' + tp(a, 0) + ' \\cdot ' + tp(f, 0) + ' = ' + (shown ? tn(a * f, 0) : '\\;?') + '$' +
                    (i && shown ? ' <span class="vz7-step">' + (a > 0 ? '−3' : '+3') + '</span>' : '') + '</p>';
            });
            if (k === 4) t += '<p class="b-help" style="margin:10px 0 0">Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.</p>';
            else if (k < 7) t += '<p style="margin:10px 0 0">Von Zeile zu Zeile wird das Ergebnis um 3 ' + (a > 0 ? 'kleiner' : 'größer') + '. Damit das Muster weitergeht, muss $' + tp(a, 0) + ' \\cdot (-1) = ' + tn(-a, 0) + '$ sein.</p>';
            else t += '<p style="margin:10px 0 0" class="g-ok">' + (a > 0 ? 'Plus mal minus ergibt minus.' : 'Minus mal minus ergibt plus. Minus mal plus ergibt minus.') + '</p>';
            out.innerHTML = t; math(out);
            // the results on a number line from −9 to 9
            const Wd = 400, X0 = 200, U = 20, Y = 70;
            let s = line([10, Y], [Wd - 14, Y], sty(TXT, 2)) + '<path d="M' + (Wd - 6) + ' ' + Y + ' l-12 -6 v12 z" fill="' + TXT + '"/>';
            for (let v = -9; v <= 9; v++) {
                s += line([X0 + v * U, Y - (v ? 5 : 9)], [X0 + v * U, Y + (v ? 5 : 9)], sty(TXT, v ? 1.2 : 2, 'opacity:0.8'));
                if (v % 3 === 0) s += '<text class="zg7-num" x="' + (X0 + v * U) + '" y="' + (Y + 28) + '" text-anchor="middle">' + (v < 0 ? '−' + -v : v) + '</text>';
            }
            for (let i = 0; i < k; i++) {
                const v = a * F[i], x = X0 + v * U, last = i === k - 1;
                if (i) { const x0 = X0 + a * F[i - 1] * U; s += path('M' + f1(x0) + ' ' + Y + ' Q' + f1((x0 + x) / 2) + ' ' + (Y - 34) + ' ' + f1(x) + ' ' + Y, sty(last ? LAM : DIM, last ? 2.2 : 1.2)); }
                s += circ([x, Y], last ? 7 : 5, 'fill:' + (v < 0 ? RED : v > 0 ? PHI : TXT));
            }
            pic.innerHTML = svgTag(Wd, 120, 'Die Ergebnisse auf der Zahlengeraden', s);
        }
        sync();
        render();
    });

    /* ---------- a balanced pair of scales (picture) ---------- */
    W('waagebild7', function (box) {
        const Wd = 420, Ht = 300, mx = 210;
        let s = '<path d="M' + (mx - 60) + ' 286 L' + (mx + 60) + ' 286 L' + (mx + 18) + ' 262 L' + (mx - 18) + ' 262 Z" style="fill:rgba(232,237,245,0.12);stroke:' + DIM + ';stroke-width:1.6"/>';
        s += line([mx, 262], [mx, 92], sty(DIM, 5)) + line([40, 92], [380, 92], sty(TXT, 4)) + circ([mx, 92], 9, 'fill:' + LAM);
        const pan = x => line([x, 92], [x - 62, 196], sty(DIM, 1.4)) + line([x, 92], [x + 62, 196], sty(DIM, 1.4)) + path('M' + (x - 78) + ' 196 Q' + x + ' 236 ' + (x + 78) + ' 196 Z', 'fill:rgba(127,216,238,0.12);stroke:' + CY + ';stroke-width:2');
        s += pan(90) + pan(330);
        const xbox = (x, y) => '<rect x="' + (x - 17) + '" y="' + (y - 34) + '" width="34" height="34" rx="5" style="fill:rgba(245,194,66,0.28);stroke:' + LAM + ';stroke-width:2"/>' + colTxt([x, y - 11], 'x', 'g-area', LAM);
        const wt = (x, y) => '<path d="M' + (x - 11) + ' ' + y + ' L' + (x + 11) + ' ' + y + ' L' + (x + 8) + ' ' + (y - 20) + ' L' + (x - 8) + ' ' + (y - 20) + ' Z" style="fill:rgba(160,200,90,0.3);stroke:' + PHI + ';stroke-width:1.8"/>' +
            '<text class="g-lab" x="' + x + '" y="' + (y - 5) + '" text-anchor="middle" style="fill:#fff;font-size:12px">1</text>';
        s += xbox(52, 200) + xbox(90, 200) + xbox(128, 200) + wt(64, 166) + wt(116, 166);
        s += xbox(282, 200) + wt(316, 200) + wt(340, 200) + wt(364, 200) + wt(388, 199) + wt(328, 179) + wt(352, 179);
        box.innerHTML = '<div class="b-svgbox g-svg" style="max-width:320px;margin:0 auto">' + svgTag(Wd, Ht, 'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte', s) + '</div>';
    });

    /* ---------- rearranging formulas ---------- */
    W('umstellen7', function (box) {
        const SW = '⇄ Seiten tauschen';
        const F = [
            { tex: 'A = a \\cdot b', name: 'Rechteck', t: {
                b: [['A = a \\cdot b', ':a'], ['\\dfrac{A}{a} = b', SW], ['b = \\dfrac{A}{a}']],
                a: [['A = a \\cdot b', ':b'], ['\\dfrac{A}{b} = a', SW], ['a = \\dfrac{A}{b}']] },
                check: { b: '$A = 24\\,\\text{cm}^2$, $a = 4\\,\\text{cm}$: $b = \\dfrac{24}{4}\\,\\text{cm} = 6\\,\\text{cm}$. Probe: $4 \\cdot 6 = 24$ ✓', a: '$A = 24\\,\\text{cm}^2$, $b = 6\\,\\text{cm}$: $a = \\dfrac{24}{6}\\,\\text{cm} = 4\\,\\text{cm}$' } },
            { tex: 'u = 2a + 2b', name: 'Umfang', t: {
                b: [['u = 2a + 2b', '-2a'], ['u - 2a = 2b', ':2'], ['\\dfrac{u - 2a}{2} = b', SW], ['b = \\dfrac{u - 2a}{2}']] },
                check: { b: '$u = 20\\,\\text{cm}$, $a = 6\\,\\text{cm}$: $b = \\dfrac{20 - 12}{2}\\,\\text{cm} = 4\\,\\text{cm}$. Probe: $12 + 8 = 20$ ✓' } },
            { tex: 'V = a \\cdot b \\cdot c', name: 'Quader', t: {
                c: [['V = a \\cdot b \\cdot c', ':(a \\cdot b)'], ['\\dfrac{V}{a \\cdot b} = c', SW], ['c = \\dfrac{V}{a \\cdot b}']] },
                check: { c: '$V = 60\\,\\text{cm}^3$, $a = 5\\,\\text{cm}$, $b = 3\\,\\text{cm}$: $c = \\dfrac{60}{15}\\,\\text{cm} = 4\\,\\text{cm}$' } },
            { tex: 'v = \\dfrac{s}{t}', name: 'Geschwindigkeit', t: {
                s: [['v = \\dfrac{s}{t}', '\\cdot t'], ['v \\cdot t = s', SW], ['s = v \\cdot t']],
                t: [['v = \\dfrac{s}{t}', '\\cdot t'], ['v \\cdot t = s', ':v'], ['t = \\dfrac{s}{v}']] },
                check: { s: '$v = 80\\,\\tfrac{\\text{km}}{\\text{h}}$, $t = 1{,}5\\,\\text{h}$: $s = 80 \\cdot 1{,}5\\,\\text{km} = 120\\,\\text{km}$', t: '$s = 120\\,\\text{km}$, $v = 80\\,\\tfrac{\\text{km}}{\\text{h}}$: $t = \\dfrac{120}{80}\\,\\text{h} = 1{,}5\\,\\text{h}$' } },
            { tex: '\\varrho = \\dfrac{m}{V}', name: 'Dichte', t: {
                m: [['\\varrho = \\dfrac{m}{V}', '\\cdot V'], ['\\varrho \\cdot V = m', SW], ['m = \\varrho \\cdot V']],
                V: [['\\varrho = \\dfrac{m}{V}', '\\cdot V'], ['\\varrho \\cdot V = m', ':\\varrho'], ['V = \\dfrac{m}{\\varrho}']] },
                check: { m: 'Stahl, $\\varrho = 7{,}85\\,\\tfrac{\\text{g}}{\\text{cm}^3}$, $V = 10\\,\\text{cm}^3$: $m = 78{,}5\\,\\text{g}$', V: 'Wasser, $\\varrho = 1\\,\\tfrac{\\text{g}}{\\text{cm}^3}$, $m = 250\\,\\text{g}$: $V = 250\\,\\text{cm}^3$' } },
            { tex: 'V = \\tfrac13 \\cdot G \\cdot h', name: 'Pyramide', t: {
                h: [['V = \\tfrac13 \\cdot G \\cdot h', '\\cdot 3'], ['3V = G \\cdot h', ':G'], ['\\dfrac{3V}{G} = h', SW], ['h = \\dfrac{3V}{G}']],
                G: [['V = \\tfrac13 \\cdot G \\cdot h', '\\cdot 3'], ['3V = G \\cdot h', ':h'], ['\\dfrac{3V}{h} = G', SW], ['G = \\dfrac{3V}{h}']] },
                check: { h: '$V = 32\\,\\text{cm}^3$, $G = 16\\,\\text{cm}^2$: $h = \\dfrac{96}{16}\\,\\text{cm} = 6\\,\\text{cm}$', G: '$V = 32\\,\\text{cm}^3$, $h = 6\\,\\text{cm}$: $G = \\dfrac{96}{6}\\,\\text{cm}^2 = 16\\,\\text{cm}^2$' } }
        ];
        const S = { f: +(box.dataset.f || 0), t: null, k: 1 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, F.map((f, i) => [String(i), f.name]), String(S.f), v => { S.f = +v; S.t = null; S.k = 1; build(); }, 'Formel');
        const tRow = div(box, 'b-ctrls');
        const nav = buttons(div(box, 'b-ctrls'), [['next', 'Nächster Schritt', true], ['all', 'Alle Schritte'], ['reset', 'Von vorn']]);
        const out = div(box, 'b-out um7-out');
        nav.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            const n = F[S.f].t[S.t].length;
            S.k = b.dataset.k === 'reset' ? 1 : b.dataset.k === 'all' ? n : Math.min(n, S.k + 1);
            render();
        });
        function build() {
            const f = F[S.f], keys = Object.keys(f.t);
            if (!S.t || !f.t[S.t]) S.t = keys[0];
            tRow.innerHTML = '';
            const ts = seg(tRow, keys.map(k => [k, 'nach $' + k + '$']), S.t, v => { S.t = v; S.k = 1; render(); }, 'umstellen nach');
            math(ts.el);
            if (B.printing()) S.k = f.t[S.t].length;
            render();
        }
        function render() {
            const f = F[S.f], st = f.t[S.t], k = Math.min(S.k, st.length);
            let t = '<p class="b-help" style="margin:0 0 4px">Die Formel $' + f.tex + '$ nach $' + S.t + '$ umstellen: auf <b>beiden</b> Seiten dasselbe tun, bis $' + S.t + '$ allein steht.</p>';
            st.slice(0, k).forEach((row, i) => {
                const op = i < k - 1 ? row[1] : null;
                t += '<p class="um7-row' + (i === k - 1 ? ' on' : '') + '">$' + row[0] + '$' + (op ? ' <span class="um7-op">' + (op === SW ? op : '$\\big|\\; ' + op + '$') + '</span>' : '') + '</p>';
            });
            if (k === st.length) t += '<p class="g-ok" style="margin:10px 0 0">Fertig. Mit Zahlen: ' + f.check[S.t] + '</p>';
            out.innerHTML = t; math(out);
        }
        build();
    });

    /* ---------- percent ---------- */
    W('prozent7', function (box) {
        const hero = isHero(box), mode = box.dataset.mode || 'grund';
        const S = { G: +(box.dataset.g || 80), p: +(box.dataset.p || 35), k: 20, back: false };
        const unitTxt = box.dataset.unit || '€';
        let sl = null;
        if (!hero) {
            sl = div(box, '');
            range(sl, { label: 'Grundwert $G$', min: 10, max: 400, step: 10, value: S.G, fmt: v => v + ' ' + unitTxt, onInput: v => { S.G = v; render(); } });
            if (mode === 'grund') range(sl, { label: 'Prozentsatz $p\\,\\%$', min: 0, max: 100, step: 1, value: S.p, fmt: v => v + ' %', onInput: v => { S.p = v; render(); } });
            else {
                range(sl, { label: 'Änderung um', min: -50, max: 100, step: 5, value: S.k, fmt: v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + ' %', onInput: v => { S.k = v; render(); } });
                const b = buttons(div(sl, 'b-ctrls'), [['back', 'Danach um denselben Prozentsatz zurück']]).querySelector('button');
                b.addEventListener('click', () => { S.back = !S.back; b.classList.toggle('b-go', S.back); render(); });
            }
            math(sl);
        }
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = hero ? null : div(two, 'b-out');
        if (hero) { two.style.display = 'block'; pic.style.maxWidth = '300px'; pic.style.margin = '0 auto'; }
        const money = v => texNum(v, 2) + '\\,\\text{' + unitTxt + '}';
        function render() {
            if (mode === 'grund' || hero) {
                const p = S.p, G = S.G, Wv = G * p / 100, c = 22;
                let s = '';
                for (let i = 0; i < 100; i++) {
                    const x = 12 + (i % 10) * c, y = 12 + Math.floor(i / 10) * c, on = i < p;
                    s += '<rect x="' + x + '" y="' + y + '" width="' + (c - 3) + '" height="' + (c - 3) + '" rx="3" style="fill:' + (on ? 'rgba(245,194,66,0.75)' : 'rgba(127,216,238,0.10)') + ';stroke:' + (on ? LAM : 'rgba(127,216,238,0.35)') + ';stroke-width:1"/>';
                }
                s += txt([122, 258], p + ' von 100 Feldern', 'g-lab');
                if (!hero) {
                    // the percent strip: percent on the left, values on the right
                    const x = 300, y0 = 12, H = 217, yp = y0 + H * (1 - p / 100);
                    s += '<rect x="' + x + '" y="' + y0 + '" width="40" height="' + H + '" style="fill:rgba(127,216,238,0.10);stroke:' + CY + ';stroke-width:1.4"/>';
                    s += '<rect x="' + x + '" y="' + f1(yp) + '" width="40" height="' + f1(H * p / 100) + '" style="fill:rgba(245,194,66,0.6);stroke:' + LAM + ';stroke-width:1.4"/>';
                    [[0, y0 + H], [100, y0]].forEach(([v, y]) => { s += txt([x - 8, y + 5], v + ' %', 'g-lab', 'end') + txt([x + 48, y + 5], fmt(v / 100 * G, 2), 'g-lab', 'start'); });
                    if (p > 6 && p < 94) s += colTxt([x - 8, yp + 5], p + ' %', 'g-lab', LAM, 'end') + colTxt([x + 48, yp + 5], fmt(Wv, 2), 'g-lab', LAM, 'start');
                }
                pic.innerHTML = svgTag(hero ? 244 : 440, 270, 'Hunderterfeld mit ' + p + ' gefärbten Feldern' + (hero ? '' : ' und Prozentstreifen'), s);
                if (!out) return;
                out.innerHTML = '<p style="margin:0">Grundwert $G = ' + money(G) + '$ · Prozentsatz $p\\,\\% = ' + p + '\\,\\%$</p>' +
                    '<p style="margin:0">Prozentwert <span class="g-lam">$W = ' + p + '\\,\\% \\text{ von } ' + money(G) + ' = ' + texNum(p / 100, 2) + ' \\cdot ' + texNum(G, 0) + ' = ' + money(Wv) + '$</span></p>' +
                    '<p class="b-help" style="margin:8px 0 0">Die drei Grundaufgaben:<br>$W = p\\,\\% \\cdot G$ · $p\\,\\% = \\dfrac{W}{G}$ · $G = \\dfrac{W}{p\\,\\%}$</p>' +
                    (p ? '<p class="b-help" style="margin:4px 0 0">Probe: $\\dfrac{' + texNum(Wv, 2) + '}{' + texNum(G, 0) + '} = ' + texNum(p / 100, 2) + ' = ' + p + '\\,\\%$</p>' : '');
                math(out);
                return;
            }
            const G = S.G, k = S.k, q = 1 + k / 100, N = G * q, R = N * (1 - k / 100), sc = 400 / Math.max(G, N), X = 16;
            let s = '';
            const bar = (y, v, label, c, part) => {
                let r = '<rect x="' + X + '" y="' + y + '" width="' + f1(v * sc) + '" height="30" rx="4" style="fill:' + c.replace('rgb(', 'rgba(').replace(')', ',0.35)') + ';stroke:' + c + ';stroke-width:1.6"/>';
                if (part) r += part;
                return r + colTxt([X, y - 9], label + ' · ' + fmt(v, 2) + ' ' + unitTxt, 'pz7-lab', TXT, 'start');
            };
            s += bar(36, G, 'vorher 100 %', 'rgb(127,216,238)');
            const d = (N - G) * sc;
            const part = k > 0 ? '<rect x="' + f1(X + G * sc) + '" y="104" width="' + f1(d) + '" height="30" style="fill:rgba(160,200,90,0.75)"/>'
                : k < 0 ? '<rect x="' + f1(X + N * sc) + '" y="104" width="' + f1(-d) + '" height="30" style="fill:none;stroke:' + RED + ';stroke-width:1.6;stroke-dasharray:4 3"/>' : '';
            s += bar(104, N, 'nachher ' + (100 + k) + ' %', LAM, part);
            if (S.back && k) s += bar(172, R, 'zurück ' + (100 - k) + ' %', 'rgb(184,164,242)');
            pic.innerHTML = svgTag(440, S.back && k ? 214 : 146, 'Balken vor und nach der Änderung', s);
            const um = k >= 0 ? 'Steigerung um $' + k + '\\,\\%$' : 'Senkung um $' + -k + '\\,\\%$';
            let t = '<p style="margin:0">' + um + ' heißt ' + (k >= 0 ? 'Steigerung' : 'Senkung') + ' <b>auf</b> $' + (100 + k) + '\\,\\%$. Der Faktor ist $' + texNum(q, 2) + '$.</p>' +
                '<p style="margin:0">Neuer Wert: <span class="g-lam">$' + texNum(q, 2) + ' \\cdot ' + money(G) + ' = ' + money(N) + '$</span></p>' +
                '<p style="margin:0">Zurückrechnen auf den Grundwert: $' + money(N) + ' : ' + texNum(q, 2) + ' = ' + money(G) + '$</p>';
            if (S.back && k) t += '<p style="margin:8px 0 0">Danach ' + (k > 0 ? 'um $' + k + '\\,\\%$ senken' : 'um $' + -k + '\\,\\%$ erhöhen') + ': $' + texNum(1 - k / 100, 2) + ' \\cdot ' + money(N) + ' = ' + money(R) + '$. ' +
                '<b class="g-warn">Nicht</b> der alte Wert! Die zweiten $' + Math.abs(k) + '\\,\\%$ beziehen sich auf einen anderen Grundwert.</p>';
            out.innerHTML = t; math(out);
        }
        render();
    });

    /* ---------- diagrams ---------- */
    W('diagramm7', function (box) {
        const SETS = {
            schulweg: { title: 'Wie kommst du zur Schule? Umfrage in einer Klasse', unit: 'Antworten', step: 1, kind: 'teile', rows: [['zu Fuß', 6], ['Fahrrad', 9], ['Bus, Bahn', 8], ['Auto', 5]] },
            wahl: { title: 'Klassensprecherwahl: Stimmen', unit: 'Stimmen', step: 1, kind: 'teile', rows: [['Anna', 12], ['Ben', 8], ['Cem', 6], ['Dana', 4]] },
            sonnenblume: { title: 'Höhe einer Sonnenblume, jede Woche gemessen', unit: 'cm', step: 5, kind: 'zeit', rows: [['1', 8], ['2', 15], ['3', 27], ['4', 44], ['5', 70], ['6', 98], ['7', 125], ['8', 140]] }
        };
        const hero = isHero(box), D = SETS[box.dataset.set || 'schulweg'];
        const S = { type: box.dataset.type || (hero ? 'kreis' : 'saeule'), rows: D.rows.map(r => r.slice()) };
        let ctr = null;
        if (!hero) { ctr = div(box, 'b-ctrls'); seg(ctr, [['saeule', 'Säulendiagramm'], ['linie', 'Liniendiagramm'], ['kreis', 'Kreisdiagramm']], S.type, v => { S.type = v; render(); }, 'Diagramm'); }
        const pic = div(box, 'b-svgbox g-svg dg7-svg'), out = hero ? null : div(box, 'b-out');
        if (hero) { pic.style.maxWidth = '280px'; pic.style.margin = '0 auto'; }
        if (out) out.addEventListener('click', e => {
            const b = e.target.closest('[data-i]'); if (!b) return;
            const r = S.rows[+b.dataset.i]; r[1] = Math.max(0, Math.min(D.step === 1 ? 40 : 300, r[1] + (+b.dataset.d) * D.step)); render();
        });
        function render() {
            const rows = S.rows, sum = rows.reduce((s, r) => s + r[1], 0) || 1, mx = Math.max(1, ...rows.map(r => r[1]));
            let s = '';
            const Wd = hero ? 300 : S.type === 'kreis' ? 470 : 520, Ht = 300;
            if (S.type === 'kreis') {
                const M = [hero ? 150 : 150, 150], r = 118;
                let th = 90 * DEG;
                rows.forEach((row, i) => {
                    const w = row[1] / sum * 2 * Math.PI, c = PAL[i % PAL.length];
                    if (row[1] <= 0) return;
                    s += row[1] >= sum ? circ(M, r, 'fill:' + hexA(c, 0.55) + ';stroke:#0a1426;stroke-width:2')
                        : path(arcPath(M, r, th - w, th, true), 'fill:' + hexA(c, 0.55) + ';stroke:#0a1426;stroke-width:2');
                    if (w > 0.3) s += txt(onC(M, r * 0.62, th - w / 2), fmt(row[1] / sum * 100, 0) + ' %', 'g-val');
                    th -= w;
                });
                if (!hero) rows.forEach((row, i) => {
                    const y = 70 + i * 40;
                    s += '<rect x="300" y="' + (y - 14) + '" width="18" height="18" rx="3" style="fill:' + hexA(PAL[i % PAL.length], 0.7) + '"/>' + txt([326, y], row[0], 'dg7-leg', 'start');
                });
            } else {
                const x0 = 56, y0 = 262, w = Wd - x0 - 16, h = 228, n = rows.length, top = niceTop(mx);
                for (let k = 0; k <= 4; k++) {
                    const y = y0 - h * k / 4;
                    s += line([x0, y], [x0 + w, y], 'stroke:rgba(255,255,255,' + (k ? 0.08 : 0.5) + ');stroke-width:1') + txt([x0 - 8, y + 5], fmt(top * k / 4, 0), 'd-num', 'end');
                }
                s += line([x0, y0], [x0, y0 - h - 10], 'stroke:rgba(255,255,255,0.6);stroke-width:1.6');
                const bw = w / n;
                const P = rows.map((row, i) => [x0 + bw * (i + 0.5), y0 - h * row[1] / top]);
                if (S.type === 'saeule') rows.forEach((row, i) => {
                    s += '<rect x="' + f1(x0 + bw * (i + 0.18)) + '" y="' + f1(P[i][1]) + '" width="' + f1(bw * 0.64) + '" height="' + f1(y0 - P[i][1]) + '" rx="3" style="fill:' + hexA(PAL[i % PAL.length], 0.4) + ';stroke:' + PAL[i % PAL.length] + ';stroke-width:1.5"/>';
                });
                else s += '<polyline points="' + pts(P) + '" style="' + sty(LAM, 2.6) + '"/>' + P.map(p => circ(p, 5, 'fill:' + LAM)).join('');
                rows.forEach((row, i) => { s += txt([P[i][0], y0 + 20], row[0], 'd-num'); });
                s += txt([x0, y0 - h - 18], D.unit, 'd-unit', 'start');
                if (D.kind === 'zeit') s += txt([x0 + w, y0 + 34], 'Woche', 'd-unit', 'end');
            }
            pic.innerHTML = svgTag(Wd, hero ? 300 : 305, D.title + ' als ' + { saeule: 'Säulendiagramm', linie: 'Liniendiagramm', kreis: 'Kreisdiagramm' }[S.type], s);
            if (!out) return;
            let t = '<p style="margin:0 0 6px"><b>' + D.title + '</b></p><div class="b-table-wrap"><table class="b-table dg7-tab"><tr><th>' + (D.kind === 'zeit' ? 'Woche' : '') + '</th><th>' + D.unit + '</th>' +
                (D.kind === 'teile' ? '<th>Anteil</th><th>Winkel</th>' : '') + '</tr>';
            rows.forEach((row, i) => {
                t += '<tr><td>' + row[0] + '</td><td><span class="b-stepper"><button type="button" data-i="' + i + '" data-d="-1" aria-label="weniger">−</button><output>' + row[1] + '</output>' +
                    '<button type="button" data-i="' + i + '" data-d="1" aria-label="mehr">+</button></span></td>' +
                    (D.kind === 'teile' ? '<td>' + fmt(row[1] / sum * 100, 1) + ' %</td><td>' + fmt(row[1] / sum * 360, 1) + '°</td>' : '') + '</tr>';
            });
            t += '</table></div>';
            if (D.kind === 'teile') t += '<p class="b-help" style="margin:8px 0 0">Zusammen: ' + sum + ' ' + D.unit + ' = 100 % = 360°. Im Kreisdiagramm gehören zu 1 % genau 3,6°.</p>';
            if (D.kind === 'teile' && S.type === 'linie') t += '<p class="g-warn" style="margin:6px 0 0">Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.</p>';
            if (D.kind === 'zeit' && S.type === 'kreis') t += '<p class="g-warn" style="margin:6px 0 0">Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.</p>';
            if (D.kind === 'zeit' && S.type === 'linie') t += '<p class="g-ok" style="margin:6px 0 0">Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.</p>';
            out.innerHTML = t;
        }
        function niceTop(m) { const st = [5, 10, 20, 25, 50, 100]; for (const x of st) if (m <= x * 4) return x * 4; return Math.ceil(m / 100) * 100; }
        function hexA(c, a) { return hexFill(c, a).split(';')[0].replace('fill:', ''); }
        render();
    });

    /* ---------- oblique view, two-view drawing, true length ---------- */
    W('schraegbild7', function (box) {
        const hero = isHero(box), calc = box.dataset.calc != null;
        const BODIES = [['quader', 'Quader'], ['prisma3', 'Dreiecksprisma'], ['prisma6', 'Sechseckprisma'], ['pyramide4', 'Quadr. Pyramide'], ['pyramide3', 'Dreieckspyramide'], ['stumpf', 'Pyramidenstumpf']];
        const STOFF = [['0.5', 'Fichtenholz'], ['2.5', 'Glas'], ['7.85', 'Stahl']];
        const S = { k: box.dataset.k || 'pyramide4', mode: box.dataset.mode || 'schraeg', a: +(box.dataset.a || 4), b: 3, h: +(box.dataset.h || 5), rho: 0.5 };
        if (S.k === 'stumpf') S.b = 2;
        let modeSeg = null, bodySeg = null, bRow = null, bR = null;
        if (!hero) {
            modeSeg = seg(div(box, 'b-ctrls'), [['schraeg', 'Schrägbild'], ['zweitafel', 'Zweitafelbild'], ['wahr', 'Wahre Länge']], S.mode, v => {
                S.mode = v;
                if (v === 'wahr' && !/^pyramide/.test(S.k)) { S.k = 'pyramide4'; bodySeg.set('pyramide4'); }
                sync(); render();
            }, 'Darstellung');
            bodySeg = seg(div(box, 'b-ctrls'), BODIES, S.k, v => {
                S.k = v;
                if (S.mode === 'wahr' && !/^pyramide/.test(v)) { S.mode = 'schraeg'; modeSeg.set('schraeg'); }
                if (v === 'stumpf' && S.b >= S.a) { S.b = Math.max(1, S.a - 1.5); bR.set(S.b); }
                sync(); render();
            }, 'Körper');
            const sl = div(box, '');
            range(sl, { label: 'Grundkante $a$', min: 1, max: 5, step: 0.5, value: S.a, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.a = v; render(); } });
            bRow = div(sl, '');
            bR = range(bRow, { label: 'Kante $b$', min: 0.5, max: 5, step: 0.5, value: S.b, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.b = v; render(); } });
            range(sl, { label: 'Höhe $h$', min: 1, max: 6, step: 0.5, value: S.h, fmt: v => fmt(v, 1) + ' cm', onInput: v => { S.h = v; render(); } });
            if (calc) seg(div(sl, 'b-ctrls'), STOFF, String(S.rho), v => { S.rho = +v; render(); }, 'Stoff');
            math(sl);
        }
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg sb7-svg'), out = hero ? null : div(two, 'b-out');
        if (hero) { two.style.display = 'block'; pic.style.maxWidth = '300px'; pic.style.margin = '0 auto'; }
        function sync() {
            if (!bRow) return;
            bRow.style.display = S.k === 'quader' || S.k === 'stumpf' ? '' : 'none';
            bRow.querySelector('label').innerHTML = S.k === 'stumpf' ? 'Deckkante $b$' : 'Breite $b$';
            math(bRow);
        }
        const q = 0.5 * Math.SQRT1_2;                                  // depth: 45°, halved
        const VIEW = [-q, 1, -q];                                       // the direction of the oblique projection
        function render() {
            if (S.k === 'stumpf' && S.b >= S.a) S.b = S.a - 0.5;
            const body = solid(S.k, S.a, S.b, S.h), V = body.V, F = hull(V), E = edgesOf(F), N = body.names;
            let s = '', Wd = 440, Ht = 340;
            const lab = (i, mark) => N[i] + (mark || '');
            if (S.mode === 'schraeg' || hero) {
                const P2 = V.map(p => [p[0] + q * p[1], p[2] + q * p[1]]);
                const xs = P2.map(p => p[0]), ys = P2.map(p => p[1]);
                const k = Math.min(36, (Wd - 70) / (Math.max(...xs) - Math.min(...xs)), (Ht - 50) / (Math.max(...ys) - Math.min(...ys)));
                const ox = Wd / 2 - k * (Math.max(...xs) + Math.min(...xs)) / 2, oy = Ht / 2 + k * (Math.max(...ys) + Math.min(...ys)) / 2;
                const T = p => [ox + k * p[0], oy - k * p[1]], Q = P2.map(T);
                const vis = F.map(f => vdot(f.n, VIEW) < -1e-9);
                F.forEach((f, i) => { if (vis[i]) s += poly(f.v.map(j => Q[j]), 'fill:rgba(127,216,238,0.08);stroke:none'); });
                E.filter(e => !e.f.some(i => vis[i])).forEach(e => { s += line(Q[e.a], Q[e.b], sty(DIM, 1.6, 'stroke-dasharray:6 5;')); });
                E.filter(e => e.f.some(i => vis[i])).forEach(e => { s += line(Q[e.a], Q[e.b], sty(TXT, 2.4)); });
                if (body.kind === 'pyramide') {
                    const top = Q[V.length - 1], foot = T([0, 0]);
                    s += line(foot, top, sty(LAM, 1.6, 'stroke-dasharray:4 4;')) + dot(foot, LAM, 3) + colTxt(add(mid(foot, top), [10, 4]), 'h', 'g-side', LAM, 'start');
                }
                // the 45° mark at A between the front edge and the edge to the back
                const A = Q[0], Bq = Q[1], back = Q[body.n - 1];
                if (!hero) s += arc(A, Bq, back, 26, 'fill:rgba(245,194,66,0.18);stroke:' + LAM + ';stroke-width:1') + colTxt(add(A, [34, -6]), '45°', 'g-lab', LAM, 'start');
                const c2 = mul(Q.reduce((a, p) => add(a, p), [0, 0]), 1 / Q.length);
                if (!hero) Q.forEach((p, i) => { s += labelAway(p, c2, lab(i), 16, 'g-lab'); });
                pic.innerHTML = svgTag(Wd, Ht, BODY[S.k] + ' im Schrägbild', s);
            } else {
                // two-view drawing: front view above the axis x12, top view below
                const minY = Math.min(...V.map(p => p[1])), maxY = Math.max(...V.map(p => p[1])), maxZ = Math.max(...V.map(p => p[2]));
                const gz = 0.8, gy = 0.8, yP = maxY + gy;
                const xs = V.map(p => p[0]);
                Ht = 470;
                const k = Math.min(30, (Wd - 90) / (Math.max(...xs) - Math.min(...xs)), (Ht - 60) / (maxZ + gz + (yP - minY)));
                const ox = Wd / 2 - k * (Math.max(...xs) + Math.min(...xs)) / 2, ax = 30 + k * (maxZ + gz);
                const Af = p => [ox + k * p[0], ax - k * (p[2] + gz)], Gr = p => [ox + k * p[0], ax + k * (yP - p[1])];
                const QA = V.map(Af), QG = V.map(Gr);
                s += line([20, ax], [Wd - 20, ax], sty(TXT, 1.4)) + txt([Wd - 22, ax + 20], 'x₁₂', 'g-lab', 'end');
                const done = new Set();
                V.forEach((p, i) => { const key = f1(QA[i][0]); if (done.has(key)) return; done.add(key); s += line(QG[i], QA[i], 'stroke:' + DIM + ';stroke-width:0.9;stroke-dasharray:2 4;opacity:0.8'); });
                const draw = (Q, visFn) => {
                    const vis = F.map(f => visFn(f.n));
                    let r = '';
                    E.filter(e => !e.f.some(i => vis[i])).forEach(e => { r += line(Q[e.a], Q[e.b], sty(DIM, 1.5, 'stroke-dasharray:6 5;')); });
                    E.filter(e => e.f.some(i => vis[i])).forEach(e => { r += line(Q[e.a], Q[e.b], sty(TXT, 2.3)); });
                    return r;
                };
                s += draw(QA, n => n[1] < -1e-9) + draw(QG, n => n[2] > 1e-9);
                // labels: front base corners and the top in the front view, all base corners in the top view
                const front = V.map((p, i) => i).filter(i => V[i][2] === 0 && Math.abs(V[i][1] - minY) < 1e-9);
                front.forEach(i => { s += txt(add(QA[i], [V[i][0] < 0 ? -10 : 10, 5]), lab(i, '″'), 'g-lab', V[i][0] < 0 ? 'end' : 'start'); });
                if (body.kind === 'pyramide') s += txt(add(QA[V.length - 1], [0, -10]), 'S″', 'g-lab');
                const cG = mul(QG.reduce((a, p) => add(a, p), [0, 0]), 1 / QG.length);
                V.forEach((p, i) => { if (p[2] === 0) s += labelAway(QG[i], cG, lab(i, '′'), 16, 'g-lab'); });
                if (body.kind === 'pyramide') s += txt(add(QG[V.length - 1], [12, -6]), 'S′', 'g-lab', 'start');
                s += colTxt([24, 28], 'AUFRISS', 'd-mark', DIM, 'start') + colTxt([24, ax + 26], 'GRUNDRISS', 'd-mark', DIM, 'start');
                if (S.mode === 'wahr') {
                    const iS = V.length - 1, iB = 1, Sg = QG[iS], Bg = QG[iB], rr = len(sub(Bg, Sg)), B0 = add(Sg, [rr, 0]);
                    const B0a = [B0[0], ax - k * gz];
                    s += path('M' + f1(Bg[0]) + ' ' + f1(Bg[1]) + ' A' + f1(rr) + ' ' + f1(rr) + ' 0 0 0 ' + f1(B0[0]) + ' ' + f1(B0[1]), sty(RED, 1.6, 'stroke-dasharray:5 4;'));
                    s += line(Sg, B0, sty(RED, 1.6)) + line(B0, B0a, sty(RED, 1.2, 'stroke-dasharray:3 4;'));
                    s += line(QA[iS], B0a, sty(LAM, 3.4)) + dot(B0, RED, 4) + dot(B0a, LAM, 4.5);
                    s += txt(add(B0, [8, 16]), 'B₀′', 'g-lab', 'start') + txt(add(B0a, [8, -8]), 'B₀″', 'g-lab', 'start');
                    s += line(QA[iS], QA[iB], sty(CY, 3)) + line(Sg, Bg, sty(CY, 3));
                }
                pic.innerHTML = svgTag(Wd, Ht, BODY[S.k] + ' im Zweitafelbild', s);
            }
            if (!out) return;
            const nE = V.length, nK = E.length, nF = F.length;
            let t = '<p style="margin:0"><b>' + BODY[S.k] + '</b> · Ecken $' + nE + '$ · Kanten $' + nK + '$ · Flächen $' + nF + '$</p>';
            if (S.mode === 'schraeg') t += '<p style="margin:6px 0 0"><b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.</p>';
            else if (S.mode === 'zweitafel') t += '<p style="margin:6px 0 0"><b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ' +
                'Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.</p>';
            else {
                const sl = vlen(vsub(V[V.length - 1], V[1]));
                t += '<p style="margin:6px 0 0">Die Seitenkante <span class="g-cy">$\\overline{SB}$</span> liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ' +
                    'Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke <span class="g-lam">$\\overline{S\'\'B_0\'\'}$</span> zeigt die <b>wahre Länge</b>.</p><p style="margin:6px 0 0">Gemessen: $\\overline{SB} \\approx ' + tcm(sl) + '$</p>';
            }
            if (calc) t += calcText(body);
            out.innerHTML = t; math(out);
        }
        function calcText(body) {
            const a = S.a, b = S.b, h = S.h, n = body.n;
            let G, M, u, t, V, O, hs = 0, extra = '';
            const ngonA = s => n * s * s / (4 * Math.tan(Math.PI / n));
            if (S.k === 'quader') { G = a * b; u = 2 * a + 2 * b; M = u * h; O = 2 * G + M; V = G * h; t = '$G = a \\cdot b$ · $M = u \\cdot h$ · $O = 2G + M$ · $V = G \\cdot h$'; }
            else if (body.kind === 'prisma') { G = ngonA(a); u = n * a; M = u * h; O = 2 * G + M; V = G * h; t = '$M = u \\cdot h$ · $O = 2G + M$ · $V = G \\cdot h$'; }
            else if (body.kind === 'pyramide') {
                G = ngonA(a); const ri = a / (2 * Math.tan(Math.PI / n)); hs = Math.sqrt(h * h + ri * ri);
                M = n * a * hs / 2; O = G + M; V = G * h / 3; t = '$M = ' + n + ' \\cdot \\tfrac12 \\cdot a \\cdot h_s$ · $O = G + M$ · $V = \\tfrac13 \\cdot G \\cdot h$';
                extra = '<p class="b-help" style="margin:4px 0 0">$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ' + tcm(hs, 2) + '$.</p>';
            } else {
                const H = h * a / (a - b), G2 = b * b; G = a * a; hs = Math.sqrt(h * h + ((a - b) / 2) ** 2);
                M = 4 * (a + b) / 2 * hs; O = G + G2 + M; V = (G * H - G2 * (H - h)) / 3;
                t = '$V = V_{\\text{groß}} - V_{\\text{klein}}$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $' + texNum(H, 2) + '$ cm) und ziehe die kleine Spitze ab.';
                extra = '<p class="b-help" style="margin:4px 0 0">Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ' + tcm(hs, 2) + '$.</p>';
            }
            const m = S.rho * V;
            return '<p style="margin:10px 0 0">' + t + '</p>' + extra +
                '<p style="margin:6px 0 0">$G \\approx ' + texNum(G, 2) + '\\,\\text{cm}^2$ · $M \\approx ' + texNum(M, 2) + '\\,\\text{cm}^2$<br>$O \\approx ' + texNum(O, 2) + '\\,\\text{cm}^2$ · <span class="g-lam">$V \\approx ' + texNum(V, 2) + '\\,\\text{cm}^3$</span></p>' +
                '<p style="margin:6px 0 0">Masse aus ' + STOFF.find(x => +x[0] === S.rho)[1] + ' ($\\varrho = ' + texNum(S.rho, 2) + '\\,\\tfrac{\\text{g}}{\\text{cm}^3}$): $m = \\varrho \\cdot V \\approx ' + texNum(m, 1) + '\\,\\text{g}$</p>';
        }
        sync();
        render();
    });

    /* ---------- nets folding into bodies (3D) ---------- */
    W('faltnetz7', function (box) {
        const hero = isHero(box), set = box.dataset.set || 'prismen';
        const LIST = set === 'platon' ? ['tetraeder', 'wuerfel', 'oktaeder', 'dodekaeder', 'ikosaeder'] : ['wuerfel', 'quader', 'prisma3', 'prisma6', 'pyramide4', 'pyramide3', 'stumpf'];
        const S = { k: box.dataset.k || LIST[0], t: B.printing() ? 0.55 : hero ? 0 : 0.35, play: 0 };
        let tR = null, playBtn = null;
        if (!hero) {
            seg(div(box, 'b-ctrls'), LIST.map(k => [k, BODY[k]]), S.k, v => { S.k = v; build(); }, 'Körper');
            const row = div(box, '');
            tR = range(row, { label: 'Falten', min: 0, max: 100, step: 1, value: S.t * 100, fmt: v => v + ' %', onInput: v => { S.t = v / 100; S.play = 0; pose(); } });
            playBtn = buttons(div(row, 'b-ctrls'), [['play', '▶ Zusammenfalten', true]]).querySelector('button');
            playBtn.addEventListener('click', () => { S.play = S.t >= 0.999 ? -1 : 1; });
        }
        const stage = new Stage7(box, { height: hero ? 300 : 360, spin: hero, az: 0.55, el: 0.62, aria: 'Ein Netz faltet sich zu einem Körper' });
        const out = hero ? null : div(box, 'b-out');
        let net = null, hold = 0, dir = 1;
        function build() {
            const T = stage.T; if (!T) return;
            stage.clear();
            const plat = set === 'platon';
            const body = plat ? solid(S.k, 1.7) : solid(S.k, S.k === 'quader' ? 2.4 : 2, S.k === 'quader' ? 1.5 : 1.1, S.k === 'quader' ? 1.2 : S.k === 'wuerfel' ? 2 : /^pyr/.test(S.k) ? 2.1 : 1.8);
            const V = body.V, F = hull(V), E = edgesOf(F);
            // the base: the face lying on z = 0
            let root = F.findIndex(f => f.n[2] < -0.999);
            if (root < 0) root = 0;
            const par = new Array(F.length).fill(-1), order = [root], hinge = [], seen = new Set([root]);
            for (let i = 0; i < order.length; i++) {
                const f = order[i];
                E.forEach(e => {
                    if (!e.f.includes(f)) return;
                    const g = e.f[0] === f ? e.f[1] : e.f[0];
                    if (g == null || seen.has(g)) return;
                    seen.add(g); par[g] = f; hinge[g] = [e.a, e.b]; order.push(g);
                });
            }
            const info = F.map((f, i) => {
                if (i === root) return null;
                const p = F[par[i]], P = V[hinge[i][0]], Q = V[hinge[i][1]], u = vunit(vsub(Q, P));
                const th = Math.acos(clamp(vdot(f.n, p.n), -1, 1));
                const sgn = vlen(vsub(vrot(f.n, u, th), p.n)) < vlen(vsub(vrot(f.n, u, -th), p.n)) ? 1 : -1;
                return { P, u, a: sgn * th };
            });
            const groups = F.map((f, i) => {
                const flat = Math.abs(f.n[2]) > 0.999 && !plat;
                const g = stage.face(f.v.map(j => V[j]), i === root ? LAM : flat ? LAM : plat ? (i % 2 ? CY : VIO) : CY, TXT);
                g.matrixAutoUpdate = false;
                return g;
            });
            net = { V, F, E, order, par, info, groups, body };
            pose();
            if (out) {
                const types = {};
                F.forEach(f => { types[f.v.length] = (types[f.v.length] || 0) + 1; });
                const nm = { 3: ['Dreieck', 'Dreiecke'], 4: ['Viereck', 'Vierecke'], 5: ['Fünfeck', 'Fünfecke'], 6: ['Sechseck', 'Sechsecke'] };
                const parts = Object.keys(types).map(n => types[n] + ' ' + nm[n][types[n] > 1 ? 1 : 0]).join(', ');
                const e = V.length, k = E.length, f = F.length;
                let t = '<p style="margin:0"><b>' + BODY[S.k] + '</b>: ' + parts + '</p><p style="margin:0">Ecken $e = ' + e + '$ · Kanten $k = ' + k + '$ · Flächen $f = ' + f + '$</p>' +
                    '<p style="margin:0" class="g-ok">$e - k + f = ' + e + ' - ' + k + ' + ' + f + ' = ' + (e - k + f) + '$</p>';
                if (plat) {
                    const deg = E.filter(x => x.a === 0 || x.b === 0).length;
                    t += '<p class="b-help" style="margin:6px 0 0">Alle Flächen sind gleiche regelmäßige ' + nm[F[0].v.length][1] + ', an jeder Ecke stoßen ' + deg + ' zusammen.</p>';
                }
                out.innerHTML = t; math(out);
            }
        }
        function pose() {
            if (!net) return;
            const T = stage.T, M = new Array(net.F.length);
            const mx = [Infinity, Infinity, Infinity], Mx = [-Infinity, -Infinity, -Infinity], all = [];
            net.order.forEach(i => {
                if (i === net.order[0]) M[i] = new T.Matrix4();
                else {
                    const f = net.info[i], P = stage.v3(f.P), u = stage.v3(f.u).normalize();
                    const R = new T.Matrix4().makeTranslation(P.x, P.y, P.z).multiply(new T.Matrix4().makeRotationAxis(u, f.a * (1 - S.t))).multiply(new T.Matrix4().makeTranslation(-P.x, -P.y, -P.z));
                    M[i] = M[net.par[i]].clone().multiply(R);
                }
                net.groups[i].matrix.copy(M[i]);
                net.F[i].v.forEach(j => { const p = stage.v3(net.V[j]).applyMatrix4(M[i]); all.push(p); });
            });
            all.forEach(p => { mx[0] = Math.min(mx[0], p.x); mx[1] = Math.min(mx[1], p.y); mx[2] = Math.min(mx[2], p.z); Mx[0] = Math.max(Mx[0], p.x); Mx[1] = Math.max(Mx[1], p.y); Mx[2] = Math.max(Mx[2], p.z); });
            const c3 = [(mx[0] + Mx[0]) / 2, (mx[1] + Mx[1]) / 2, (mx[2] + Mx[2]) / 2];
            let r = 0; all.forEach(p => { r = Math.max(r, Math.hypot(p.x - c3[0], p.y - c3[1], p.z - c3[2])); });
            stage.view([c3[0], -c3[2], c3[1]], Math.max(r, 1.2));
            stage.render();
            if (playBtn) playBtn.textContent = S.t >= 0.999 ? '◀ Auffalten' : '▶ Zusammenfalten';
        }
        stage.onFrame = dt => {
            if (hero) {
                if (hold > 0) { hold -= dt; return false; }
                S.t = clamp(S.t + dir * dt * 0.28, 0, 1);
                if (S.t === 1 || S.t === 0) { dir = -dir; hold = 1.6; }
                pose(); return false;
            }
            if (!S.play) return false;
            S.t = clamp(S.t + S.play * dt * 0.45, 0, 1);
            if (S.t === 0 || S.t === 1) S.play = 0;
            if (tR) tR.set(Math.round(S.t * 100));
            pose(); return false;
        };
        stage.onScheme = build;
        B.later(stage.ready.then(build));
    });

    /* ---------- three pyramids make a cube (3D) ---------- */
    W('drittel7', function (box) {
        const hero = isHero(box);
        const S = { t: B.printing() ? 0.55 : 0, play: 0 };
        let tR = null, playBtn = null;
        if (!hero) {
            const row = div(box, '');
            tR = range(row, { label: 'Zusammenschieben', min: 0, max: 100, step: 1, value: 0, fmt: v => v + ' %', onInput: v => { S.t = v / 100; S.play = 0; pose(); } });
            playBtn = buttons(div(row, 'b-ctrls'), [['play', '▶ Zusammenschieben', true]]).querySelector('button');
            playBtn.addEventListener('click', () => { S.play = S.t >= 0.999 ? -1 : 1; });
        }
        const stage = new Stage7(box, { height: hero ? 300 : 340, spin: true, az: 0.75, el: 0.5, aria: 'Drei gleiche Pyramiden ergeben einen Würfel' });
        if (!hero) {
            const out = div(box, 'b-out');
            out.innerHTML = '<p style="margin:0">Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.</p>' +
                '<p style="margin:6px 0 0">Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also <span class="g-lam">$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$</span>.</p>';
            math(out);
        }
        let parts = null, hold = 0, dir = 1;
        function build() {
            if (!stage.T) return;
            stage.clear();
            const a = 2, Sx = [0, a, a];                                      // the common top: corner x = 0, y = a (back), z = a (top)
            const C = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0], [0, 0, a], [a, 0, a], [a, a, a], [0, a, a]];
            const bases = [[[1, 2, 6, 5], [1, 0, 0], LAM], [[0, 1, 5, 4], [0, -1, 0], CY], [[0, 1, 2, 3], [0, 0, -1], PHI]];
            parts = bases.map(([q, dirv, c]) => {
                const grp = new stage.T.Group();
                const Bq = q.map(i => C[i]);
                stage.face(Bq, c, TXT, grp);
                Bq.forEach((p, i) => stage.face([p, Bq[(i + 1) % 4], Sx], c, TXT, grp));
                stage.root.add(grp);
                return { grp, dirv };
            });
            pose();
        }
        function pose() {
            if (!parts) return;
            parts.forEach(p => { const d = stage.v3(vmul(1.5 * (1 - S.t), p.dirv)); p.grp.position.copy(d); });
            stage.view([1, 1, 1], 2.1 + 1.6 * (1 - S.t));
            stage.render();
            if (playBtn) playBtn.textContent = S.t >= 0.999 ? '◀ Auseinander' : '▶ Zusammenschieben';
        }
        stage.onFrame = dt => {
            if (hero) {
                if (hold > 0) { hold -= dt; return false; }
                S.t = clamp(S.t + dir * dt * 0.35, 0, 1);
                if (S.t === 1 || S.t === 0) { dir = -dir; hold = 1.4; }
                pose(); return false;
            }
            if (!S.play) return false;
            S.t = clamp(S.t + S.play * dt * 0.5, 0, 1);
            if (S.t === 0 || S.t === 1) S.play = 0;
            if (tR) tR.set(Math.round(S.t * 100));
            pose(); return false;
        };
        stage.onScheme = build;
        B.later(stage.ready.then(build));
    });

    /* ---------- regular polygons around one vertex ---------- */
    W('eckenwinkel7', function (box) {
        const S = { m: 3, n: 3 };
        const ctr = div(box, 'b-ctrls');
        seg(ctr, [['3', 'Dreiecke'], ['4', 'Quadrate'], ['5', 'Fünfecke'], ['6', 'Sechsecke']], '3', v => { S.m = +v; render(); }, 'Vieleck');
        const st = div(ctr, 'b-ctrl');
        st.innerHTML = '<span>Anzahl an der Ecke</span><span class="b-stepper"><button type="button" data-d="-1" aria-label="weniger">−</button><output></output><button type="button" data-d="1" aria-label="mehr">+</button></span>';
        st.addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; S.n = clamp(S.n + (+b.dataset.d), 3, 6); render(); });
        const two = div(box, 'b-two'), pic = div(two, 'b-svgbox g-svg'), out = div(two, 'b-out');
        const SOLID = { '3,3': 'Tetraeder', '3,4': 'Oktaeder', '3,5': 'Ikosaeder', '4,3': 'Würfel', '5,3': 'Dodekaeder' };
        function render() {
            st.querySelector('output').textContent = S.n;
            const m = S.m, n = S.n, beta = 180 * (m - 2) / m, sum = n * beta;
            const a0 = 90 - sum / 2;                       // symmetric about the vertical
            // the polygons with the vertex at (0, 0) and side 1, then scaled and moved to fill the picture
            const polys = [];
            for (let i = 0; i < n; i++) {
                const P = [[0, 0]];
                let p = [0, 0], dir = (a0 + i * beta) * DEG;
                for (let j = 1; j < m; j++) { p = [p[0] + Math.cos(dir), p[1] - Math.sin(dir)]; P.push(p); dir += (180 - beta) * DEG; }
                polys.push(P);
            }
            const all = polys.flat().concat([[0, 0], onC([0, 0], 0.9, (a0 + 360 - (360 - sum) / 2) * DEG)]);
            const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
            const k = Math.min(130, 380 / (Math.max(...xs) - Math.min(...xs) || 1), 340 / (Math.max(...ys) - Math.min(...ys) || 1));
            const ox = 220 - k * (Math.max(...xs) + Math.min(...xs)) / 2, oy = 200 - k * (Math.max(...ys) + Math.min(...ys)) / 2;
            const T = p => [ox + k * p[0], oy + k * p[1]], V = T([0, 0]);
            let s = '';
            polys.forEach((P, i) => {
                const over = (i + 1) * beta > 360 + 1e-9;
                s += poly(P.map(T), 'fill:' + (over ? 'rgba(226,102,90,0.25)' : i % 2 ? 'rgba(127,216,238,0.22)' : 'rgba(245,194,66,0.22)') + ';stroke:' + (over ? RED : i % 2 ? CY : LAM) + ';stroke-width:2;stroke-linejoin:round');
            });
            if (sum < 360 - 1e-9) {
                const g0 = (a0 + sum) * DEG, g1 = (a0 + 360) * DEG, rg = Math.min(60, 0.55 * k);
                s += path(arcPath(V, rg, g0, g1, true), 'fill:rgba(143,163,189,0.12);stroke:' + DIM + ';stroke-width:1;stroke-dasharray:4 4');
                s += txt(onC(V, rg + 26, (g0 + g1) / 2), 'Lücke ' + fmt(360 - sum, 0) + '°', 'g-lab');
            }
            s += dot(V, TXT, 5);
            pic.innerHTML = svgTag(440, 400, n + ' regelmäßige ' + m + '-Ecke an einer Ecke', s);
            let t = '<p style="margin:0">Jeder Innenwinkel: $' + fmt(beta, 0) + '^\\circ$ · an der Ecke: $' + n + ' \\cdot ' + fmt(beta, 0) + '^\\circ = ' + fmt(sum, 0) + '^\\circ$</p>';
            if (sum < 360 - 1e-9) t += '<p class="g-ok" style="margin:6px 0 0">Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. So ist ' + (m === 4 ? 'der' : 'das') + ' <b>' + SOLID[m + ',' + n] + '</b> gebaut.</p>';
            else if (Math.abs(sum - 360) < 1e-9) t += '<p style="margin:6px 0 0">Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.</p>';
            else t += '<p class="g-warn" style="margin:6px 0 0">Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.</p>';
            t += '<div class="b-table-wrap"><table class="b-table g-tab ew7-tab"><tr><th></th><th>3</th><th>4</th><th>5</th><th>6</th></tr>';
            [3, 4, 5, 6].forEach(mm => {
                const bb = 180 * (mm - 2) / mm;
                t += '<tr><th>' + { 3: 'Dreiecke', 4: 'Quadrate', 5: 'Fünfecke', 6: 'Sechsecke' }[mm] + '</th>';
                [3, 4, 5, 6].forEach(nn => {
                    const ss = nn * bb, here = mm === m && nn === n;
                    t += '<td class="' + (here ? 'b-hot' : '') + '">' + (ss < 360 - 1e-9 ? '✓' : Math.abs(ss - 360) < 1e-9 ? 'flach' : '–') + '</td>';
                });
                t += '</tr>';
            });
            t += '</table></div><p class="b-help" style="margin:6px 0 0">Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.</p>';
            out.innerHTML = t; math(out);
        }
        render();
    });
})();
