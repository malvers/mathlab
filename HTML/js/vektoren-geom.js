/* vektoren-geom.js — analytic geometry for chapters 5 to 11.
 *
 * Everything works on plain number arrays. Planes come in two shapes:
 *   parameter form  { A, u, v }        A + r·u + s·v
 *   normal form     { n, d }           n · x = d
 * The lab converts between them constantly, so both live side by side here.
 */
(function () {
    'use strict';
    const { V } = window.VekLab;
    const EPS = 1e-9;

    /** Parameter form -> normal form. */
    function planeFromParam(A, u, v) {
        const n = V.cross(V.to3(u), V.to3(v));
        return { n, d: V.dot(n, V.to3(A)), A: V.to3(A), u: V.to3(u), v: V.to3(v) };
    }

    /** Normal form -> parameter form. Picks a readable point and two spanning vectors. */
    function paramFromNormal(n, d) {
        n = V.to3(n);
        const l2 = V.len2(n);
        if (l2 < EPS) return null;
        const A = V.scale(n, d / l2);           // foot of the perpendicular from the origin
        const u = V.anyPerp(n);
        const v = V.unit(V.cross(n, u));
        return { A, u, v, n, d };
    }

    /** Coordinate form as readable text: 2x + 3y - z = 5 */
    function coordText(n, d, dec = 2) {
        const N = window.VekLab.num;
        const names = ['x', 'y', 'z'];
        let s = '';
        n.forEach((c, i) => {
            if (Math.abs(c) < 1e-9) return;
            const sign = c < 0 ? ' - ' : (s ? ' + ' : '');
            const mag = Math.abs(c);
            s += sign + (Math.abs(mag - 1) < 1e-9 ? '' : N(mag, dec)) + names[i];
        });
        return (s || '0') + ' = ' + N(d, dec);
    }

    // ------------------------------------------------------------------
    // Line and line
    // ------------------------------------------------------------------
    /**
     * g: x = P + t·u,  h: x = Q + s·v
     * -> { kind, t, s, point, dist } with kind identisch | parallel | schneidend | windschief
     */
    function lineLine(P, u, Q, v) {
        P = V.to3(P); u = V.to3(u); Q = V.to3(Q); v = V.to3(v);
        const w = V.sub(Q, P);
        const c = V.cross(u, v);
        const c2 = V.len2(c);
        const scale = Math.max(1, V.len(u) * V.len(v));
        if (c2 < EPS * scale * scale) {                 // directions are parallel
            const onLine = V.len(V.cross(w, u)) < 1e-7 * Math.max(1, V.len(u) * V.len(w));
            return onLine
                ? { kind: 'identisch', dist: 0 }
                : { kind: 'parallel', dist: V.len(V.cross(w, u)) / V.len(u) };
        }
        const t = V.dot(V.cross(w, v), c) / c2;
        const s = V.dot(V.cross(w, u), c) / c2;
        const gap = Math.abs(V.dot(w, c)) / Math.sqrt(c2);
        if (gap < 1e-7 * Math.max(1, V.len(w))) {
            return { kind: 'schneidend', t, s, point: V.add(P, V.scale(u, t)), dist: 0 };
        }
        return { kind: 'windschief', t, s, dist: gap, footG: V.add(P, V.scale(u, t)), footH: V.add(Q, V.scale(v, s)) };
    }

    // ------------------------------------------------------------------
    // Line and plane
    // ------------------------------------------------------------------
    /** g: x = P + t·u against n·x = d -> { kind, t, point } */
    function linePlane(P, u, n, d) {
        P = V.to3(P); u = V.to3(u); n = V.to3(n);
        const nu = V.dot(n, u);
        if (Math.abs(nu) < 1e-9 * Math.max(1, V.len(n) * V.len(u))) {
            return Math.abs(V.dot(n, P) - d) < 1e-7 * Math.max(1, Math.abs(d))
                ? { kind: 'enthalten' }
                : { kind: 'parallel', dist: Math.abs(V.dot(n, P) - d) / V.len(n) };
        }
        const t = (d - V.dot(n, P)) / nu;
        return { kind: 'schneidend', t, point: V.add(P, V.scale(u, t)) };
    }

    // ------------------------------------------------------------------
    // Plane and plane
    // ------------------------------------------------------------------
    /** n1·x = d1 against n2·x = d2 -> { kind, P, u } */
    function planePlane(n1, d1, n2, d2) {
        n1 = V.to3(n1); n2 = V.to3(n2);
        const u = V.cross(n1, n2);
        const u2 = V.len2(u);
        if (u2 < 1e-12 * Math.max(1, V.len2(n1) * V.len2(n2))) {
            // parallel normals: same plane only if the equations are proportional
            const k = V.len2(n1) > EPS ? V.dot(n1, n2) / V.len2(n1) : 0;
            return Math.abs(d2 - k * d1) < 1e-7 * Math.max(1, Math.abs(d2))
                ? { kind: 'identisch' }
                : { kind: 'parallel', dist: Math.abs(d2 / V.len(n2) - d1 / V.len(n1) * Math.sign(k || 1)) };
        }
        const P = V.scale(V.add(V.scale(V.cross(n2, u), d1), V.scale(V.cross(u, n1), d2)), 1 / u2);
        return { kind: 'schneidend', P, u };
    }

    // ------------------------------------------------------------------
    // Distances, feet, mirrors
    // ------------------------------------------------------------------
    const distPointLine = (X, P, u) => V.len(V.cross(V.sub(V.to3(X), V.to3(P)), V.to3(u))) / V.len(V.to3(u));
    const distPointPlane = (X, n, d) => Math.abs(V.dot(V.to3(n), V.to3(X)) - d) / V.len(V.to3(n));

    /** Foot of the perpendicular from X onto g: x = P + t·u. */
    function footOnLine(X, P, u) {
        X = V.to3(X); P = V.to3(P); u = V.to3(u);
        const t = V.dot(V.sub(X, P), u) / V.len2(u);
        return { t, point: V.add(P, V.scale(u, t)) };
    }
    /** Foot of the perpendicular from X onto n·x = d. */
    function footOnPlane(X, n, d) {
        X = V.to3(X); n = V.to3(n);
        const k = (V.dot(n, X) - d) / V.len2(n);
        return { k, point: V.sub(X, V.scale(n, k)) };
    }
    const mirrorInPlane = (X, n, d) => {
        const f = footOnPlane(X, n, d);
        return V.add(V.to3(X), V.scale(V.sub(f.point, V.to3(X)), 2));
    };
    const mirrorInLine = (X, P, u) => {
        const f = footOnLine(X, P, u);
        return V.add(V.to3(X), V.scale(V.sub(f.point, V.to3(X)), 2));
    };
    const mirrorInPoint = (X, Z) => V.sub(V.scale(V.to3(Z), 2), V.to3(X));

    // ------------------------------------------------------------------
    // Angles — always the acute one, as school notation demands
    // ------------------------------------------------------------------
    const deg = r => r * 180 / Math.PI;
    const clamp = x => Math.max(-1, Math.min(1, x));
    /** Between two vectors, 0…180. */
    const angleVec = (a, b) => V.angle(a, b);
    /** Between two lines, 0…90. */
    const angleLines = (u, v) => deg(Math.acos(clamp(Math.abs(V.dot(u, v)) / (V.len(u) * V.len(v)))));
    /** Between a line and a plane, 0…90 — note the sine. */
    const angleLinePlane = (u, n) => deg(Math.asin(clamp(Math.abs(V.dot(u, n)) / (V.len(u) * V.len(n)))));
    /** Between two planes, 0…90. */
    const anglePlanes = (n1, n2) => angleLines(n1, n2);

    // ------------------------------------------------------------------
    // Areas and volumes
    // ------------------------------------------------------------------
    const areaParallelogram = (u, v) => V.len(V.cross(V.to3(u), V.to3(v)));
    const areaTriangle = (u, v) => areaParallelogram(u, v) / 2;
    /** Scalar triple product — signed volume of the parallelepiped. */
    const spat = (a, b, c) => V.dot(V.cross(V.to3(a), V.to3(b)), V.to3(c));
    /** Three vectors lie in one plane exactly when the triple product vanishes. */
    const coplanar = (a, b, c) => Math.abs(spat(a, b, c)) < 1e-7;

    /**
     * Three readable points on n·x = d — the same ones a textbook would pick, so
     * the parameter form derived from a coordinate form has tidy vectors.
     */
    function nicePoints(n, d) {
        n = V.to3(n);
        const cand = [];
        // axis intercepts first, then points with two free coordinates from {0, 1, -1}
        for (let i = 0; i < 3; i++) if (Math.abs(n[i]) > EPS) {
            const p = [0, 0, 0]; p[i] = d / n[i]; cand.push(p);
        }
        const vals = [0, 1, -1, 2];
        for (const i of [2, 1, 0]) {
            if (Math.abs(n[i]) < EPS) continue;
            const o = [0, 1, 2].filter(k => k !== i);
            for (const a of vals) for (const b of vals) {
                const p = [];
                p[o[0]] = a; p[o[1]] = b;
                p[i] = (d - n[o[0]] * a - n[o[1]] * b) / n[i];
                cand.push(p);
            }
        }
        const A = cand[0];
        if (!A) return null;
        let u = null, v = null;
        for (const p of cand.slice(1)) {
            const w = V.sub(p, A);
            if (V.len(w) < 1e-9) continue;
            if (!u) { u = w; continue; }
            if (V.len(V.cross(u, w)) > 1e-6) { v = w; break; }
        }
        return u && v ? { A, u, v } : null;
    }

    window.VekLab.G = {
        nicePoints,
        planeFromParam, paramFromNormal, coordText,
        lineLine, linePlane, planePlane,
        distPointLine, distPointPlane, footOnLine, footOnPlane,
        mirrorInPlane, mirrorInLine, mirrorInPoint,
        angleVec, angleLines, angleLinePlane, anglePlanes,
        areaParallelogram, areaTriangle, spat, coplanar,
    };
})();
