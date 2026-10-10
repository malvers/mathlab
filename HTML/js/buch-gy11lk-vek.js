/* buch-gy11lk-vek.js — 3D widgets for the vector chapters 3.1–3.3 of the book "Mathematik · Gymnasium 11 · Leistungskurs".
 * The Leistungskurs meets the scalar product and the normal vector only in Jahrgangsstufe 12 (book GY 12 LK, chapter 8.1),
 * so these widgets reach the coordinate form by eliminating the parameters and never show a normal vector.
 *   koordsys3d   cylindrical and spherical coordinates of a point: sliders, the point with its arcs, the conversion formulas
 *   linabh3d     three vectors: linearly independent or not? The homogeneous system and a non-trivial solution, the spanned plane
 *   varignon3d   a quadrilateral in space, also a skew one: the midpoints of its sides always form a parallelogram
 *   ebenelim     a plane: parametric form → coordinate form by elimination with trace points · point test · line meets plane
 *   ebenenlage   two planes in coordinate form: parallel, identical or intersecting, the line of intersection with a free variable
 * Needs js/buch-vektoren.js (B.Raum, B.vk) before this file. Looks: the vk-* and b-* classes of js/buch.css.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { fmt, texNum, math, div } = B;
    const W = B.widget;
    const { coords, presetRow, vtex, add, sub, mul, dot, len, cross, n2 } = B.vk;
    const PAL = { lambda: 'rgb(245,194,66)', cyan: '#7fd8ee', phi: 'rgb(160,200,90)', red: '#e2665a', violet: '#b8a4f2', white: '#e8edf5', dim: '#6d8199', pink: '#e682be' };
    const col = c => { const v = PAL[c] || c; return window.Farbschema && Farbschema.map ? Farbschema.map(v, 'line') : v; };
    const near0 = x => Math.abs(x) < 1e-9;
    const g3 = v => v.map(x => n2(x)).join(' \\mid ');
    const deg = Math.PI / 180;
    const EX = [1, 0, 0], EY = [0, 1, 0], EZ = [0, 0, 1], O = [0, 0, 0];

    // ---------- small helpers ----------
    // a polyline in the scene layer (cleared with the layer)
    function poly(R, pts, c, o = {}) {
        const T = R.T, geo = new T.BufferGeometry().setFromPoints(pts.map(p => R.v3(p)));
        const m = o.dash ? new T.LineDashedMaterial({ color: new T.Color(col(c)), dashSize: 0.16, gapSize: 0.12, transparent: true, opacity: o.opacity || 0.8 })
            : new T.LineBasicMaterial({ color: new T.Color(col(c)), transparent: true, opacity: o.opacity || 1 });
        const l = new T.Line(geo, m); if (o.dash) l.computeLineDistances();
        R.layer.add(l); return l;
    }
    // points of a circular arc: centre m, unit vectors e1, e2 of its plane, radius r, angles a → b
    function arc(m, e1, e2, r, a, b, n = 64) {
        const pts = [];
        for (let i = 0; i <= n; i++) { const t = a + (b - a) * i / n; pts.push(add(m, add(mul(r * Math.cos(t), e1), mul(r * Math.sin(t), e2)))); }
        return pts;
    }
    // smallest integer multiple of a vector with integer ratios (else unchanged), first non-zero entry positive
    function ints(n) {
        const r = n.map(x => Math.round(x * 1e6) / 1e6);
        if (!r.every(x => Number.isInteger(x))) return n;
        const g = r.filter(x => x).reduce((a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }, 0) || 1;
        const s = (r.find(x => x) || 1) < 0 ? -1 : 1;
        return r.map(x => s * x / g);
    }
    // a linear term in TeX: c0 + c1·v1 + c2·v2 ("4 - 4r - 4s"); coefficient 1 is left out
    function lin(c0, terms) {
        let s = near0(c0) ? '' : n2(c0);
        terms.forEach(([c, v]) => {
            if (near0(c)) return;
            const a = Math.abs(c), body = (Math.abs(a - 1) < 1e-9 ? '' : n2(a)) + v;
            s += s ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body;
        });
        return s || '0';
    }
    // the left side of ax + by + cz = d in TeX
    const lhs = n => lin(0, n.map((c, i) => [c, 'xyz'[i]]));
    // a number in running text: no TeX for a lone number, German comma, real minus sign
    const txt = (x, d = 2) => fmt(near0(x) ? 0 : x, d).replace('-', '−');
    // an integer direction vector parallel to u if a small factor makes all entries whole numbers
    function wholeDir(u) {
        for (const m of [1, 2, 3, 4, 5, 6, 8, 10, 12]) {
            const v = mul(m, u);
            if (v.every(x => Math.abs(x - Math.round(x)) < 1e-9)) return ints(v.map(Math.round));
        }
        return null;
    }
    // where the plane n·x = d cuts the box lo..hi: the corners of that polygon, in order around it
    function planePoly(n, d, lo, hi) {
        const C = [];
        for (let i = 0; i < 8; i++) C.push([i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]]);
        const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
        const pts = [];
        E.forEach(([i, j]) => {
            const f0 = dot(n, C[i]) - d, f1 = dot(n, C[j]) - d;
            if (f0 * f1 > 0 || (near0(f0) && near0(f1))) return;
            const p = near0(f0 - f1) ? C[i] : add(C[i], mul(f0 / (f0 - f1), sub(C[j], C[i])));
            if (!pts.some(q => len(sub(p, q)) < 1e-6)) pts.push(p);
        });
        if (pts.length < 3) return null;
        const m = mul(1 / pts.length, pts.reduce(add, [0, 0, 0]));
        const e1 = sub(pts[0], m), e2 = cross(n, e1);
        return pts.sort((p, q) => Math.atan2(dot(sub(p, m), e2), dot(sub(p, m), e1)) - Math.atan2(dot(sub(q, m), e2), dot(sub(q, m), e1)));
    }
    // the part of the line p + t·u inside the box lo..hi: [t0, t1] or null
    function clipLine(p, u, lo, hi) {
        let t0 = -1e9, t1 = 1e9;
        for (let i = 0; i < 3; i++) {
            if (near0(u[i])) { if (p[i] < lo[i] || p[i] > hi[i]) return null; continue; }
            const a = (lo[i] - p[i]) / u[i], b = (hi[i] - p[i]) / u[i];
            t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
        }
        return t0 < t1 ? [t0, t1] : null;
    }
    const LO = [-3.6, -3.6, -1.2], HI = [3.6, 3.6, 4.6];
    // a plane as a translucent patch with its edge
    function drawPlane(R, n, d, c, opacity = 0.22) {
        const P = planePoly(n, d, LO, HI);
        if (!P) return false;
        R.face(P, c, opacity); poly(R, P.concat([P[0]]), c, { opacity: 0.55 });
        return true;
    }
    // a row "E: [a] x + [b] y + [c] z = [d]" with four number fields
    function eqRow(parent, name, e, onChange, c) {
        const row = div(parent, 'vk-row');
        row.style.flexWrap = 'wrap';
        const inp = (i, lab) => '<input class="b-in vk-in" style="width:54px" type="number" step="1" min="-12" max="12" value="' + e[i] + '" aria-label="' + name + ', ' + lab + '">';
        row.innerHTML = '<span class="vk-name" style="color:' + (PAL[c] || '#fff') + '">' + name + ':</span>' + inp(0, 'Koeffizient von x') + '<span class="vk-par">$x\\,+$</span>' +
            inp(1, 'Koeffizient von y') + '<span class="vk-par">$y\\,+$</span>' + inp(2, 'Koeffizient von z') + '<span class="vk-par">$z\\,=$</span>' + inp(3, 'rechte Seite');
        const ins = Array.from(row.querySelectorAll('input'));
        ins.forEach((el, i) => el.addEventListener('input', () => { const v = parseFloat(el.value.replace(',', '.')); if (isFinite(v)) { e[i] = Math.max(-12, Math.min(12, v)); onChange(); } }));
        return { set(v) { v.forEach((x, i) => { e[i] = x; ins[i].value = x; }); } };
    }

    /* ---------- cylindrical and spherical coordinates ---------- */
    W('koordsys3d', function (box) {
        const S = { mode: box.dataset.mode || 'zylinder', r: 3, phi: 50, z: 2.5, rk: 4, lam: 100, bet: 35 };
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, [['zylinder', 'Zylinderkoordinaten'], ['kugel', 'Kugelkoordinaten']], S.mode, v => { S.mode = v; ui(); draw(); }, 'Welches Koordinatensystem?');
        const inBox = div(box, '');
        const R = new B.Raum(box, { height: 400, aria: 'Ein Punkt im Raum mit seinen Zylinder- oder Kugelkoordinaten' });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function ui() {
            inBox.innerHTML = '';
            if (S.mode === 'zylinder') {
                B.range(inBox, { label: 'Abstand $r$ zur $z$-Achse', min: 0, max: 4.5, step: 0.1, value: S.r, fmt: v => fmt(v, 1), onInput: v => { S.r = v; draw(); } });
                B.range(inBox, { label: 'Winkel $\\varphi$', min: 0, max: 360, step: 5, value: S.phi, fmt: v => fmt(v, 0) + '°', onInput: v => { S.phi = v; draw(); } });
                B.range(inBox, { label: 'Höhe $z$', min: -2, max: 4.5, step: 0.1, value: S.z, fmt: v => fmt(v, 1), onInput: v => { S.z = v; draw(); } });
            } else {
                B.range(inBox, { label: 'Abstand $r$ zum Ursprung', min: 0, max: 4.5, step: 0.1, value: S.rk, fmt: v => fmt(v, 1), onInput: v => { S.rk = v; draw(); } });
                B.range(inBox, { label: 'Länge $\\varphi$', min: -180, max: 180, step: 5, value: S.lam, fmt: v => fmt(v, 0) + '°', onInput: v => { S.lam = v; draw(); } });
                B.range(inBox, { label: 'Breite $\\vartheta$', min: -90, max: 90, step: 5, value: S.bet, fmt: v => fmt(v, 0) + '°', onInput: v => { S.bet = v; draw(); } });
            }
            math(inBox);
        }
        function draw() {
            R.ready.then(() => {
                R.clear();
                let html;
                if (S.mode === 'zylinder') {
                    const { r, z } = S, p = S.phi * deg, F = [r * Math.cos(p), r * Math.sin(p), 0], P = [F[0], F[1], z];
                    if (r > 0.05) {                                                  // the cylinder r = const
                        poly(R, arc(O, EX, EY, r, 0, 2 * Math.PI), 'cyan', { opacity: 0.5 });
                        poly(R, arc([0, 0, z], EX, EY, r, 0, 2 * Math.PI), 'cyan', { opacity: 0.5 });
                        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; R.line([r * Math.cos(a), r * Math.sin(a), 0], [r * Math.cos(a), r * Math.sin(a), z], 'cyan', { opacity: 0.25 }); }
                    }
                    R.rod(O, F, 'phi', 0.04); R.label('r', add(mul(0.5, F), [0, 0, 0.35]), 'phi');
                    if (p > 0.01) { const a = Math.max(0.7, Math.min(1.4, r * 0.45)); poly(R, arc(O, EX, EY, a, 0, p, 48), 'pink'); R.label('φ', mul(a + 0.4, [Math.cos(p / 2), Math.sin(p / 2), 0]), 'pink'); }
                    R.line(F, P, 'lambda', { dash: true }); R.label('z', add(F, [0, 0.3, z / 2]), 'lambda');
                    R.dot(P, 'lambda'); R.label('P', add(P, [0, 0.3, 0.45]), 'lambda');
                    html = '<p style="margin:0 0 6px">Zylinderkoordinaten $(r;\\,\\varphi;\\,z) = (' + texNum(r, 1) + ';\\,' + texNum(S.phi, 0) + '^\\circ;\\,' + texNum(z, 1) + ')$</p>' +
                        '<p style="margin:0 0 6px">$x = r \\cos\\varphi \\approx ' + texNum(P[0], 2) + '$, $\\;y = r \\sin\\varphi \\approx ' + texNum(P[1], 2) + '$, $\\;z = ' + texNum(z, 1) + '$</p>' +
                        '<p style="margin:0">Kartesisch: $P(' + g3(P) + ')$. Alle Punkte mit demselben $r$ liegen auf einem Zylindermantel um die $z$-Achse.</p>';
                } else {
                    const r = S.rk, l = S.lam * deg, b = S.bet * deg, e1 = [Math.cos(l), Math.sin(l), 0];
                    const P = add(mul(r * Math.cos(b), e1), mul(r * Math.sin(b), EZ));
                    if (r > 0.05) {                                                  // the sphere: equator, some meridians, the circle of latitude through P
                        poly(R, arc(O, EX, EY, r, 0, 2 * Math.PI), 'cyan', { opacity: 0.55 });
                        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; poly(R, arc(O, [Math.cos(a), Math.sin(a), 0], EZ, r, 0, 2 * Math.PI), 'cyan', { opacity: k ? 0.15 : 0.4 }); }
                        poly(R, arc([0, 0, r * Math.sin(b)], EX, EY, r * Math.cos(b), 0, 2 * Math.PI), 'violet', { opacity: 0.6 });
                        poly(R, arc(O, e1, EZ, r, -Math.PI / 2, Math.PI / 2), 'violet', { opacity: 0.8 });
                    }
                    R.line(O, mul(r, e1), 'dim', { dash: true });
                    R.rod(O, P, 'phi', 0.04); R.label('r', add(mul(0.55, P), [0, 0, 0.35]), 'phi');
                    if (Math.abs(l) > 0.01) { poly(R, arc(O, EX, EY, 1.2, 0, l, 48), 'pink'); R.label('φ', mul(1.65, [Math.cos(l / 2), Math.sin(l / 2), 0]), 'pink'); }
                    if (Math.abs(b) > 0.01) { poly(R, arc(O, e1, EZ, 1.8, 0, b, 48), 'red'); R.label('ϑ', add(mul(2.2 * Math.cos(b / 2), e1), mul(2.2 * Math.sin(b / 2), EZ)), 'red'); }
                    R.dot(P, 'lambda'); R.label('P', add(P, [0, 0.3, 0.45]), 'lambda');
                    html = '<p style="margin:0 0 6px">Kugelkoordinaten $(r;\\,\\varphi;\\,\\vartheta) = (' + texNum(r, 1) + ';\\,' + texNum(S.lam, 0) + '^\\circ;\\,' + texNum(S.bet, 0) + '^\\circ)$ mit der Länge $\\varphi$ und der Breite $\\vartheta$</p>' +
                        '<p style="margin:0 0 6px">$x = r \\cos\\vartheta \\cos\\varphi \\approx ' + texNum(P[0], 2) + '$, $\\;y = r \\cos\\vartheta \\sin\\varphi \\approx ' + texNum(P[1], 2) + '$, $\\;z = r \\sin\\vartheta \\approx ' + texNum(P[2], 2) + '$</p>' +
                        '<p style="margin:0">Kartesisch: $P(' + g3(P) + ')$. Alle Punkte mit demselben $r$ liegen auf einer Kugel um den Ursprung; auf der Erde sind $\\varphi$ und $\\vartheta$ die geografische Länge und Breite.</p>';
                }
                out.innerHTML = html; math(out);
                R.render();
            });
        }
        ui(); draw();
    });

    /* ---------- three vectors: linearly dependent or independent ---------- */
    W('linabh3d', function (box) {
        const PRE = {
            unab: { k: 'unabhängig', a: [1, 1, 0], b: [0, 1, 1], c: [1, 0, 1] },
            kompl: { k: 'komplanar', a: [2, 0, 1], b: [0, 2, 1], c: [2, 2, 2] },
            koll: { k: 'zwei parallel', a: [1, 2, 1], b: [-2, -4, -2], c: [0, 1, 2] }
        };
        const S = { a: PRE.unab.a.slice(), b: PRE.unab.b.slice(), c: PRE.unab.c.slice() };
        presetRow(box, PRE, pr => { ['a', 'b', 'c'].forEach((k, i) => cs[i].set(pr[k].slice())); draw(); });
        const inBox = div(box, 'vk-inputs');
        const cs = [['a', 'cyan'], ['b', 'phi'], ['c', 'lambda']].map(([k, c]) => coords(inBox, k, S[k], draw, c));
        math(inBox);
        const R = new B.Raum(box, { height: 380, L: 3, R: 8.5, aria: 'Drei Vektoren vom Ursprung aus und die Ebene, die zwei von ihnen aufspannen' });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        // solve x·p + y·q = w from two rows whose 2×2 determinant is not zero
        function two(p, q, w) {
            for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
                const D = p[i] * q[j] - p[j] * q[i];
                if (!near0(D)) return [(w[i] * q[j] - w[j] * q[i]) / D, (p[i] * w[j] - p[j] * w[i]) / D];
            }
            return null;
        }
        function draw() {
            R.ready.then(() => {
                R.clear();
                const { a, b, c } = S;
                [[a, 'cyan', 'a'], [b, 'phi', 'b'], [c, 'lambda', 'c']].forEach(([v, k, nm]) => { if (len(v) > 1e-9) { R.arrow(O, v, k); R.label(nm, add(v, [0, 0, 0.4]), k); } });
                const ab = cross(a, b), D = dot(ab, c);
                if (len(ab) > 1e-9) {                                                // the plane spanned by a and b
                    const s = 1.6, Pl = [mul(-s, add(a, b)), mul(s, sub(a, b)), mul(s, add(a, b)), mul(-s, sub(a, b))];
                    R.face(Pl, 'violet', near0(D) ? 0.26 : 0.13);
                }
                const sys = '\\left(\\begin{array}{ccc|c} ' + [0, 1, 2].map(i => n2(a[i]) + ' & ' + n2(b[i]) + ' & ' + n2(c[i]) + ' & 0').join(' \\\\ ') + ' \\end{array}\\right)';
                let html = '<p style="margin:0 0 6px">$r\\vec{a} + s\\vec{b} + t\\vec{c} = \\vec{o}$ als Gleichungssystem: $' + sys + '$</p>';
                if (!near0(D)) {
                    html += '<p style="margin:0">Das Gauß-Verfahren führt auf die Einheitsmatrix: Nur $r = s = t = 0$ löst das System. Die Vektoren sind <b>linear unabhängig</b>, sie liegen nicht in einer Ebene.</p>';
                } else {
                    let rel;
                    if (len(ab) > 1e-9) { const x = two(a, b, c); rel = x && '\\vec{c} = ' + lin(0, [[x[0], 'a'], [x[1], 'b']]).replace(/([ab])/g, '\\vec{$1}'); }
                    else if (len(a) > 1e-9) { const i = [0, 1, 2].find(k => !near0(a[k])); rel = '\\vec{b} = ' + lin(0, [[b[i] / a[i], 'a']]).replace(/a/g, '\\vec{a}'); }
                    html += '<p style="margin:0">Das System hat auch Lösungen mit Zahlen ungleich null' + (rel ? ', denn $' + rel + '$' : '') + '. Die Vektoren sind <b>linear abhängig</b>: ' +
                        (len(ab) > 1e-9 ? '$\\vec{c}$ liegt in der Ebene von $\\vec{a}$ und $\\vec{b}$ (komplanar).' : '$\\vec{a}$ und $\\vec{b}$ sind parallel (kollinear).') + '</p>';
                }
                out.innerHTML = html; math(out);
                R.render();
            });
        }
        draw();
    });

    /* ---------- Varignon: the midpoints of any quadrilateral form a parallelogram ---------- */
    W('varignon3d', function (box) {
        const PRE = {
            eben: { k: 'eben', p: [[3, -2, 1], [2, 3, 1], [-2, 2, 1], [-1, -3, 1]] },
            raum: { k: 'räumlich', p: [[3, -2, 0], [2, 3, 3], [-2, 2, 0], [-1, -3, 3]] },
            konkav: { k: 'nicht konvex', p: [[3, -3, 1], [1, 0, 1], [3, 3, 1], [-3, 0, 1]] }
        };
        const pts = PRE.raum.p.map(q => q.slice());
        presetRow(box, PRE, pr => { pr.p.forEach((q, i) => cs[i].set(q.slice())); draw(); });
        const inBox = div(box, 'vk-inputs vk-four');
        const cs = ['A', 'B', 'C', 'D'].map((n, i) => coords(inBox, n, pts[i], draw, ['cyan', 'phi', 'pink', 'violet'][i]));
        math(inBox);
        const R = new B.Raum(box, { height: 380, aria: 'Ein Viereck im Raum mit dem Parallelogramm seiner Seitenmitten' });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function draw() {
            R.ready.then(() => {
                R.clear();
                const [A, Bp, C, D] = pts, M = [[A, Bp], [Bp, C], [C, D], [D, A]].map(([p, q]) => mul(0.5, add(p, q)));
                [[A, Bp], [Bp, C], [C, D], [D, A]].forEach(([p, q]) => R.rod(p, q, 'white', 0.03));
                R.line(A, C, 'pink', { dash: true }); R.line(Bp, D, 'violet', { dash: true });
                [A, Bp, C, D].forEach((q, i) => { const k = ['cyan', 'phi', 'pink', 'violet'][i]; R.dot(q, k, 0.11); R.label('ABCD'[i], add(q, [0, 0, 0.45]), k); });
                R.face(M, 'lambda', 0.2);
                M.forEach((q, i) => { R.rod(q, M[(i + 1) % 4], 'lambda', 0.04); R.dot(q, 'lambda', 0.09); });
                R.arrow(M[0], M[1], 'pink', { r: 0.045 }); R.arrow(M[3], M[2], 'pink', { r: 0.045 });
                const v1 = sub(M[1], M[0]), v2 = sub(M[2], M[3]), w1 = sub(M[3], M[0]);
                const flat = near0(dot(cross(sub(Bp, A), sub(C, A)), sub(D, A)));
                out.innerHTML = '<p style="margin:0 0 6px">$\\overrightarrow{M_{AB}M_{BC}} = \\tfrac{1}{2}(\\vec{c} - \\vec{a}) = ' + vtex(v1) + '$, $\\;\\overrightarrow{M_{DA}M_{CD}} = \\tfrac{1}{2}(\\vec{c} - \\vec{a}) = ' + vtex(v2) + '$</p>' +
                    '<p style="margin:0 0 6px">Gleiche Vektoren: Zwei Gegenseiten des Mittenvierecks sind parallel und gleich lang, beide halb so lang wie die Diagonale $AC$. Ebenso $\\overrightarrow{M_{AB}M_{DA}} = \\tfrac{1}{2}(\\vec{d} - \\vec{b}) = ' + vtex(w1) + '$.</p>' +
                    '<p style="margin:0">' + (flat ? 'Die Ecken $A$, $B$, $C$, $D$ liegen in einer Ebene.' : 'Die Ecken liegen <b>nicht</b> in einer Ebene: ein räumliches Viereck.') + ' Das Mittenviereck ist trotzdem immer ein ebenes <b>Parallelogramm</b>.</p>';
                math(out);
                R.render();
            });
        }
        draw();
    });

    /* ---------- a plane: parametric form → coordinate form by elimination; point test; line meets plane ---------- */
    W('ebenelim', function (box) {
        const S = { mode: box.dataset.mode || 'ebene', A: [4, 0, 0], u: [-4, 3, 0], v: [-4, 0, 2], Q: [2, 1.5, 0], P: [3, 3, 3], w: [-1, -1, -1] };
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, [['ebene', 'Koordinatenform'], ['punkt', 'Liegt der Punkt in E?'], ['gerade', 'Gerade und Ebene']], S.mode, v => { S.mode = v; ui(); draw(); }, 'Was wird gezeigt?');
        const inBox = div(box, 'vk-inputs vk-four');
        const R = new B.Raum(box, { height: 400, aria: 'Eine Ebene im Raum mit ihrem Spurdreieck' });
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
                if (len(n0) < 1e-9) { out.innerHTML = '<p style="margin:0">$\\vec{u}$ und $\\vec{v}$ sind linear abhängig. Sie spannen keine Ebene auf.</p>'; math(out); R.render(); return; }
                const n = ints(n0), d = dot(n, A);
                const ax = [0, 1, 2].map(i => near0(n[i]) ? null : d / n[i]);
                if (ax.every(x => x != null && Math.abs(x) <= 6 && !near0(x))) {      // the trace triangle
                    const T = ax.map((x, i) => [0, 1, 2].map(j => (j === i ? x : 0)));
                    R.face(T, 'violet', 0.28); T.forEach((p, i) => { R.rod(p, T[(i + 1) % 3], 'violet', 0.025); R.dot(p, 'violet', 0.08); });
                } else drawPlane(R, n, d, 'violet', 0.24);
                R.dot(A, 'cyan'); R.label('A', add(A, [0, 0.3, 0.4]), 'cyan');
                R.arrow(A, add(A, u), 'violet', { r: 0.035 }); R.arrow(A, add(A, v), 'violet', { r: 0.035 });
                const k = n.map(x => n2(x)), cf = lhs(n) + ' = ' + n2(d);
                const rows = [0, 1, 2].map(i => 'xyz'[i] + ' &= ' + lin(A[i], [[u[i], 'r'], [v[i], 's']]));
                let html = '<p style="margin:0 0 6px">$E\\colon \\vec{x} = ' + vtex(A) + ' + r \\cdot ' + vtex(u) + ' + s \\cdot ' + vtex(v) + '$</p>';
                if (S.mode === 'ebene') {
                    html += '<p style="margin:0 0 6px">Koordinatenweise: $\\begin{aligned} ' + rows.join(' \\\\ ') + ' \\end{aligned}$</p>' +
                        '<p style="margin:0 0 6px">Die Zeilen mit ' + n.slice(0, 2).map(x => txt(x)).join(', ') + ' und ' + txt(n[2]) + ' multiplizieren und addieren. Dann fallen die Parameter weg: $r$-Glieder $' + [0, 1, 2].map(i => '(' + k[i] + ') \\cdot (' + n2(u[i]) + ')').join(' + ') + ' = 0$, ' +
                        '$s$-Glieder $' + [0, 1, 2].map(i => '(' + k[i] + ') \\cdot (' + n2(v[i]) + ')').join(' + ') + ' = 0$.</p>' +
                        '<p style="margin:0">Koordinatenform: <b>$' + cf + '$</b>. Spurpunkte: ' + (ax.some(x => x != null) ? ax.map((x, i) => x == null ? '' : '$S_' + 'xyz'[i] + '(' + g3([0, 1, 2].map(j => (j === i ? x : 0))) + ')$').filter(Boolean).join(', ') : 'keine') + '</p>';
                }
                if (S.mode === 'punkt') {
                    const Q = S.Q, val = dot(n, Q), on = Math.abs(val - d) < 1e-9;
                    R.dot(Q, 'phi', 0.12); R.label('Q', add(Q, [0, 0, 0.45]), 'phi');
                    html += '<p style="margin:0 0 6px">Koordinatenform $' + cf + '$. Einsetzen von $Q(' + g3(Q) + ')$: $' + [0, 1, 2].filter(i => !near0(n[i])).map(i => n2(n[i]) + ' \\cdot (' + n2(Q[i]) + ')').join(' + ') + ' = ' + n2(val) + '$ ' +
                        (on ? '$= ' + n2(d) + '$: <b>$Q$ liegt in $E$</b>.' : '$\\neq ' + n2(d) + '$: <b>$Q$ liegt nicht in $E$</b>.') + '</p>';
                    if (on) {
                        const w = sub(Q, A);
                        for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
                            const D = u[i] * v[j] - u[j] * v[i];
                            if (near0(D)) continue;
                            const r = (w[i] * v[j] - w[j] * v[i]) / D, s = (u[i] * w[j] - u[j] * w[i]) / D;
                            html += '<p style="margin:0">In der Parameterform gehört $Q$ zu $r = ' + texNum(r, 3) + '$ und $s = ' + texNum(s, 3) + '$.</p>';
                            break;
                        }
                    }
                }
                if (S.mode === 'gerade') {
                    const P = S.P, w = S.w;
                    if (len(w) < 1e-9) { out.innerHTML = html + '<p style="margin:0">Der Richtungsvektor $\\vec{w}$ darf nicht der Nullvektor sein.</p>'; math(out); R.render(); return; }
                    const nw = dot(n, w), nP = dot(n, P);
                    const t0 = clipLine(P, w, LO, HI);
                    if (t0) R.rod(add(P, mul(t0[0], w)), add(P, mul(t0[1], w)), 'phi', 0.03);
                    R.dot(P, 'phi', 0.1); R.label('g', add(P, [0, 0, 0.45]), 'phi');
                    const subst = [0, 1, 2].filter(i => !near0(n[i])).map(i => (Math.abs(n[i] - 1) < 1e-9 ? '' : n2(n[i])) + '(' + lin(P[i], [[w[i], 't']]) + ')').join(' + ');
                    html += '<p style="margin:0 0 6px">$g\\colon \\vec{x} = ' + vtex(P) + ' + t \\cdot ' + vtex(w) + '$ in $' + cf + '$ einsetzen: $' + subst + ' = ' + n2(d) + '$, also $' + lin(0, [[nw, 't']]) + ' = ' + n2(d - nP) + '$</p>';
                    if (near0(nw)) html += '<p style="margin:0">' + (Math.abs(nP - d) < 1e-9 ? 'Immer wahr: <b>$g$ liegt in $E$</b>.' : 'Ein Widerspruch: <b>$g$ ist parallel zu $E$</b> und hat keinen Punkt mit ihr gemeinsam.') + '</p>';
                    else {
                        const t = (d - nP) / nw, Sx = add(P, mul(t, w));
                        R.dot(Sx, 'lambda', 0.13); R.label('S', add(Sx, [0, 0.3, 0.4]), 'lambda');
                        html += '<p style="margin:0">Genau eine Lösung $t = ' + texNum(t, 3) + '$: <b>Durchstoßpunkt $S(' + g3(Sx) + ')$</b>.</p>';
                    }
                }
                out.innerHTML = html; math(out); R.render();
            });
        }
        ui(); draw();
    });

    /* ---------- two planes: parallel, identical or intersecting ---------- */
    W('ebenenlage', function (box) {
        const PRE = {
            sch: { k: 'schneidend', e: [[1, 1, 1, 4], [1, -1, 0, 0]] },
            dach: { k: 'Dach', e: [[1, 0, 1, 4], [-1, 0, 1, 4]] },
            spur: { k: 'Spurgerade', e: [[1, 2, 2, 4], [0, 0, 1, 0]] },
            par: { k: 'parallel', e: [[2, -1, 1, 3], [4, -2, 2, 10]] },
            ide: { k: 'identisch', e: [[2, -1, 1, 3], [-4, 2, -2, -6]] }
        };
        const S = { e1: PRE.sch.e[0].slice(), e2: PRE.sch.e[1].slice() };
        presetRow(box, PRE, pr => { rows[0].set(pr.e[0].slice()); rows[1].set(pr.e[1].slice()); draw(); });
        const inBox = div(box, 'vk-inputs');
        const rows = [eqRow(inBox, 'E₁', S.e1, draw, 'cyan'), eqRow(inBox, 'E₂', S.e2, draw, 'phi')];
        math(inBox);
        const R = new B.Raum(box, { height: 400, aria: 'Zwei Ebenen im Raum und ihre Schnittgerade' });
        const out = div(box, 'b-out');
        R.onScheme = () => draw();
        function draw() {
            R.ready.then(() => {
                R.clear();
                const n1 = S.e1.slice(0, 3), d1 = S.e1[3], n2v = S.e2.slice(0, 3), d2 = S.e2[3];
                if (len(n1) < 1e-9 || len(n2v) < 1e-9) { out.innerHTML = '<p style="margin:0">Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.</p>'; math(out); R.render(); return; }
                drawPlane(R, n1, d1, 'cyan'); drawPlane(R, n2v, d2, 'phi');
                const head = '<p style="margin:0 0 6px">$E_1\\colon ' + lhs(n1) + ' = ' + n2(d1) + '$, $\\;E_2\\colon ' + lhs(n2v) + ' = ' + n2(d2) + '$</p>';
                let html;
                if (len(cross(n1, n2v)) < 1e-9) {                                     // the left sides are multiples
                    const i = [0, 1, 2].find(j => !near0(n1[j])), q = n2v[i] / n1[i], same = Math.abs(d2 - q * d1) < 1e-9;
                    html = '<p style="margin:0">Die linke Seite von $E_2$ ist das ' + txt(q, 3) + '-Fache der linken Seite von $E_1$. Rechts: $' + n2(d2) + (same ? ' = ' : ' \\neq ') + texNum(q, 3) + ' \\cdot ' + n2(d1) + '$. ' +
                        (same ? 'Beide Gleichungen sind gleichwertig: <b>identisch</b>.' : 'Das System hat keine Lösung: <b>parallel</b> und verschieden.') + '</p>';
                } else {
                    // a free variable: the one whose two partner columns give a non-zero 2×2 determinant (z first)
                    const k = [2, 1, 0].find(kk => { const [i, j] = [0, 1, 2].filter(x => x !== kk); return !near0(n1[i] * n2v[j] - n1[j] * n2v[i]); });
                    const [i, j] = [0, 1, 2].filter(x => x !== k), D = n1[i] * n2v[j] - n1[j] * n2v[i];
                    const ci = (d1 * n2v[j] - n1[j] * d2) / D, ti = (n1[j] * n2v[k] - n1[k] * n2v[j]) / D;
                    const cj = (n1[i] * d2 - d1 * n2v[i]) / D, tj = (n1[k] * n2v[i] - n1[i] * n2v[k]) / D;
                    const P = [0, 0, 0], u = [0, 0, 0];
                    P[i] = ci; P[j] = cj; u[i] = ti; u[j] = tj; u[k] = 1;
                    const tc = clipLine(P, u, LO, HI);
                    if (tc) { R.rod(add(P, mul(tc[0], u)), add(P, mul(tc[1], u)), 'lambda', 0.055); R.label('g', add(P, mul(Math.max(tc[0], Math.min(tc[1], 0.5 * (tc[0] + tc[1]))), u)).map((x, m) => x + [0, 0.35, 0.45][m]), 'lambda'); }
                    // D ≠ 0, so every row keeps a term in x_i or x_j
                    const X = 'xyz', rest = (n, dd) => lin(0, [[n[i], X[i]], [n[j], X[j]]]) + ' &= ' + lin(dd, [[-n[k], 't']]);
                    const ui = wholeDir(u), scaled = ui && len(sub(ui, u)) > 1e-9;
                    html = '<p style="margin:0 0 6px">Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $' + X[k] + ' = t$, übrig bleibt für $' + X[i] + '$ und $' + X[j] + '$: ' +
                        '$\\begin{aligned} ' + rest(n1, d1) + ' \\\\ ' + rest(n2v, d2) + ' \\end{aligned}$</p>' +
                        '<p style="margin:0 0 6px">Gelöst: $' + X[i] + ' = ' + lin(ci, [[ti, 't']]) + '$, $\\;' + X[j] + ' = ' + lin(cj, [[tj, 't']]) + '$, $\\;' + X[k] + ' = t$</p>' +
                        '<p style="margin:0">Schnittgerade: <b>$g\\colon \\vec{x} = ' + vtex(P) + ' + t \\cdot ' + vtex(u) + '$</b>' + (scaled ? '. Ganzzahliger Richtungsvektor: $' + vtex(ui) + '$.' : '.') + '</p>';
                }
                out.innerHTML = head + html; math(out);
                R.render();
            });
        }
        draw();
    });
})();
