/**
 * koerper-geom.js — convex polyhedron toolkit for the "Körper" lab.
 *
 * Pipeline: vertex generator (permutation / sign specs) → convex hull
 * (supporting-plane enumeration, robust for n ≤ ~150) → polygon faces,
 * edges, metrics (A, V, radii, dihedral angles) → optional dual by polar
 * reciprocation (Catalan solids from Archimedean ones).
 *
 * Plain script (global `KoerperGeom`) with a CommonJS export so the same
 * file can be unit-tested in Node.
 */
(function (root) {
    'use strict';

    const PHI = (1 + Math.sqrt(5)) / 2;
    const SQ2 = Math.SQRT2;
    const EPS = 1e-7;

    // ------------------------------------------------------------------
    // Vertex generators
    // ------------------------------------------------------------------

    /** All sign combinations of v. opts.parity: 'evenMinus' | 'oddMinus' | 'evenPlus' | 'oddPlus' | undefined */
    function signCombos(v, parity) {
        const out = [];
        for (let m = 0; m < 8; m++) {
            const p = [v[0], v[1], v[2]];
            let minus = 0, plus = 0;
            for (let k = 0; k < 3; k++) {
                if (m & (1 << k)) { p[k] = -p[k]; minus++; } else plus++;
            }
            if (parity === 'evenMinus' && minus % 2) continue;
            if (parity === 'oddMinus' && !(minus % 2)) continue;
            if (parity === 'evenPlus' && plus % 2) continue;
            if (parity === 'oddPlus' && !(plus % 2)) continue;
            out.push(p);
        }
        return out;
    }

    /** Permutations of a 3-vector. kind: 'all' | 'even' | 'odd' */
    function permutations(v, kind) {
        const even = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
        const odd = [[1, 0, 2], [0, 2, 1], [2, 1, 0]];
        const idx = kind === 'even' ? even : kind === 'odd' ? odd : even.concat(odd);
        return idx.map(ix => [v[ix[0]], v[ix[1]], v[ix[2]]]);
    }

    /**
     * spec: { v:[x,y,z], perm:'all'|'even'|'odd', parity:'evenMinus'|... }
     * Returns de-duplicated vertex list.
     */
    function generate(specs) {
        const pts = [];
        for (const s of specs) {
            for (const p of permutations(s.v, s.perm || 'all')) {
                for (const q of signCombos(p, s.parity)) pts.push(q);
            }
        }
        return dedupe(pts);
    }

    function dedupe(pts) {
        const out = [];
        const seen = new Set();
        for (const p of pts) {
            const key = p.map(x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(6)).join(',');
            if (!seen.has(key)) { seen.add(key); out.push(p); }
        }
        return out;
    }

    // ------------------------------------------------------------------
    // Vector helpers
    // ------------------------------------------------------------------
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const len = a => Math.sqrt(dot(a, a));
    const norm = a => { const l = len(a); return l > 0 ? scale(a, 1 / l) : [0, 0, 0]; };

    // ------------------------------------------------------------------
    // Convex hull by supporting-plane enumeration
    // ------------------------------------------------------------------

    /**
     * Returns { verts, faces, edges, normals, dists } where faces are index
     * loops ordered counter-clockwise seen from outside, normals point
     * outward and dists are the plane offsets (n·x = d). Assumes the origin
     * lies strictly inside the solid (true for every solid in this lab).
     * Interior / non-hull points are dropped.
     */
    function hull(points) {
        const n = points.length;
        const planes = [];          // { n, d, key }
        const planeKeys = new Set();
        const tol = 1e-6 * maxAbs(points);

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const ab = sub(points[j], points[i]);
                for (let k = j + 1; k < n; k++) {
                    const ac = sub(points[k], points[i]);
                    let nn = cross(ab, ac);
                    const l = len(nn);
                    if (l < 1e-9) continue;               // collinear
                    nn = scale(nn, 1 / l);
                    let d = dot(nn, points[i]);
                    if (d < 0) { nn = scale(nn, -1); d = -d; }
                    // coarse string key as a fast reject, exact geometric compare as the real dedupe
                    const key = nn.map(x => x.toFixed(4)).join(',') + '|' + d.toFixed(4);
                    if (planeKeys.has(key)) continue;
                    planeKeys.add(key);
                    if (planes.some(pl => Math.abs(pl.d - d) < tol && dot(pl.n, nn) > 1 - 1e-6)) continue;
                    // supporting plane? all points must satisfy n·p ≤ d
                    let ok = true;
                    for (let m = 0; m < n; m++) {
                        if (dot(nn, points[m]) > d + tol) { ok = false; break; }
                    }
                    if (ok) planes.push({ n: nn, d });
                }
            }
        }

        // collect vertices per plane and order them around the face centroid
        const usedVert = new Set();
        const faces = [];
        for (const pl of planes) {
            const idx = [];
            for (let m = 0; m < n; m++) {
                if (Math.abs(dot(pl.n, points[m]) - pl.d) < tol) idx.push(m);
            }
            if (idx.length < 3) continue;
            const c = idx.reduce((acc, i) => add(acc, points[i]), [0, 0, 0]);
            const cen = scale(c, 1 / idx.length);
            const u = norm(sub(points[idx[0]], cen));
            const v = cross(pl.n, u);
            idx.sort((a, b) => {
                const pa = sub(points[a], cen), pb = sub(points[b], cen);
                return Math.atan2(dot(pa, v), dot(pa, u)) - Math.atan2(dot(pb, v), dot(pb, u));
            });
            faces.push({ idx, n: pl.n, d: pl.d });
            idx.forEach(i => usedVert.add(i));
        }

        // compact vertex indices (drop interior points)
        const remap = new Map();
        const verts = [];
        for (let m = 0; m < n; m++) {
            if (usedVert.has(m)) { remap.set(m, verts.length); verts.push(points[m]); }
        }
        const faceLoops = faces.map(f => f.idx.map(i => remap.get(i)));
        const normals = faces.map(f => f.n);
        const dists = faces.map(f => f.d);

        // edges: unique unordered pairs + the two faces they belong to
        const edgeMap = new Map();
        faceLoops.forEach((loop, fi) => {
            for (let k = 0; k < loop.length; k++) {
                const a = loop[k], b = loop[(k + 1) % loop.length];
                const key = a < b ? a + '_' + b : b + '_' + a;
                if (!edgeMap.has(key)) edgeMap.set(key, { a: Math.min(a, b), b: Math.max(a, b), faces: [] });
                edgeMap.get(key).faces.push(fi);
            }
        });
        const edges = Array.from(edgeMap.values());

        return { verts, faces: faceLoops, normals, dists, edges };
    }

    function maxAbs(points) {
        let m = 0;
        for (const p of points) for (const x of p) m = Math.max(m, Math.abs(x));
        return m || 1;
    }

    // ------------------------------------------------------------------
    // Transformations
    // ------------------------------------------------------------------

    /** Uniformly scale a polyhedron in place so that its longest edge equals `a`. Returns the factor. */
    function normalizeEdge(P, a = 1) {
        let maxE = 0;
        for (const e of P.edges) maxE = Math.max(maxE, len(sub(P.verts[e.a], P.verts[e.b])));
        const s = a / maxE;
        P.verts = P.verts.map(v => scale(v, s));
        P.dists = P.dists.map(d => d * s);
        return s;
    }

    /**
     * Polar reciprocation about the unit sphere: every face plane n·x = d
     * becomes the point n/d. For solids with a midsphere (Platonic,
     * Archimedean) this yields the exact dual (Catalan) — just re-hull.
     */
    function dualPoints(P) {
        return P.normals.map((n, i) => scale(n, 1 / P.dists[i]));
    }

    // ------------------------------------------------------------------
    // Metrics
    // ------------------------------------------------------------------

    function polygonArea(P, loop) {
        let acc = [0, 0, 0];
        for (let k = 0; k < loop.length; k++) {
            acc = add(acc, cross(P.verts[loop[k]], P.verts[loop[(k + 1) % loop.length]]));
        }
        return 0.5 * len(acc);
    }

    /** Distinct values (within tol) of an array, sorted ascending. */
    function distinct(arr, tol = 1e-5) {
        const out = [];
        for (const x of arr.slice().sort((p, q) => p - q)) {
            if (!out.length || Math.abs(x - out[out.length - 1]) > tol) out.push(x);
        }
        return out;
    }

    function metrics(P) {
        const V = P.verts.length, E = P.edges.length, F = P.faces.length;
        const faceTypes = {};
        let A = 0, Vol = 0;
        P.faces.forEach((loop, i) => {
            faceTypes[loop.length] = (faceTypes[loop.length] || 0) + 1;
            const ar = polygonArea(P, loop);
            A += ar;
            Vol += ar * P.dists[i] / 3;            // pyramid over each face, apex at origin
        });
        const edgeLengths = P.edges.map(e => len(sub(P.verts[e.a], P.verts[e.b])));
        const vertR = P.verts.map(v => len(v));
        const midR = P.edges.map(e => len(scale(add(P.verts[e.a], P.verts[e.b]), 0.5)));
        const dihedrals = P.edges.map(e => {
            const [f1, f2] = e.faces;
            const c = Math.max(-1, Math.min(1, dot(P.normals[f1], P.normals[f2])));
            return Math.PI - Math.acos(c);
        });
        return {
            V, E, F, euler: V - E + F,
            faceTypes,                                  // { 3: 20, 5: 12, ... }
            area: A, volume: Vol,
            edgeLengths: distinct(edgeLengths),
            rU: distinct(vertR),
            rK: distinct(midR),
            rI: distinct(P.dists),
            dihedrals: distinct(dihedrals, 1e-6),       // radians
        };
    }

    // ------------------------------------------------------------------
    // Catalogue: vertex specs (unit-free, edge length arbitrary; the lab
    // rescales to the requested edge length).
    // ------------------------------------------------------------------
    const t3 = 1.839286755214161;   // tribonacci constant (snub cube)
    const xi = 1.7155614657;         // real root of x^3 - 2x = φ (snub dodecahedron)
    const al = xi - 1 / xi;
    const be = xi * PHI + PHI * PHI + PHI / xi;

    const PLATONIC = {
        tetraeder: { name: 'Tetraeder', specs: [{ v: [1, 1, 1], parity: 'evenMinus' }] },
        wuerfel: { name: 'Würfel (Hexaeder)', specs: [{ v: [1, 1, 1] }] },
        oktaeder: { name: 'Oktaeder', specs: [{ v: [1, 0, 0] }] },
        dodekaeder: { name: 'Dodekaeder', specs: [{ v: [1, 1, 1] }, { v: [0, 1 / PHI, PHI], perm: 'even' }] },
        ikosaeder: { name: 'Ikosaeder', specs: [{ v: [0, 1, PHI], perm: 'even' }] },
    };

    const ARCHIMEDEAN = {
        tetraederstumpf: { name: 'Tetraederstumpf', specs: [{ v: [1, 1, 3], parity: 'evenMinus' }] },
        kuboktaeder: { name: 'Kuboktaeder', specs: [{ v: [0, 1, 1] }] },
        hexaederstumpf: { name: 'Hexaederstumpf', specs: [{ v: [SQ2 - 1, 1, 1] }] },
        oktaederstumpf: { name: 'Oktaederstumpf', specs: [{ v: [0, 1, 2] }] },
        rhombenkuboktaeder: { name: 'Rhombenkuboktaeder', specs: [{ v: [1, 1, 1 + SQ2] }] },
        kuboktaederstumpf: { name: 'Kuboktaederstumpf', specs: [{ v: [1, 1 + SQ2, 1 + 2 * SQ2] }] },
        abgeschraegtes_hexaeder: {
            name: 'Abgeschrägtes Hexaeder (Cubus simus)', chiral: true,
            specs: [{ v: [1, 1 / t3, t3], perm: 'even', parity: 'evenPlus' }, { v: [1, 1 / t3, t3], perm: 'odd', parity: 'oddPlus' }]
        },
        ikosidodekaeder: { name: 'Ikosidodekaeder', specs: [{ v: [0, 0, PHI], perm: 'even' }, { v: [0.5, PHI / 2, PHI * PHI / 2], perm: 'even' }] },
        dodekaederstumpf: {
            name: 'Dodekaederstumpf',
            specs: [{ v: [0, 1 / PHI, 2 + PHI], perm: 'even' }, { v: [1 / PHI, PHI, 2 * PHI], perm: 'even' }, { v: [PHI, 2, PHI + 1], perm: 'even' }]
        },
        ikosaederstumpf: {
            name: 'Ikosaederstumpf (Fußball)',
            specs: [{ v: [0, 1, 3 * PHI], perm: 'even' }, { v: [1, 2 + PHI, 2 * PHI], perm: 'even' }, { v: [PHI, 2, 2 * PHI + 1], perm: 'even' }]
        },
        rhombenikosidodekaeder: {
            name: 'Rhombenikosidodekaeder',
            specs: [{ v: [1, 1, PHI ** 3], perm: 'even' }, { v: [PHI * PHI, PHI, 2 * PHI], perm: 'even' }, { v: [2 + PHI, 0, PHI * PHI], perm: 'even' }]
        },
        ikosidodekaederstumpf: {
            name: 'Ikosidodekaederstumpf',
            specs: [
                { v: [1 / PHI, 1 / PHI, 3 + PHI], perm: 'even' },
                { v: [2 / PHI, PHI, 1 + 2 * PHI], perm: 'even' },
                { v: [1 / PHI, PHI * PHI, 3 * PHI - 1], perm: 'even' },
                { v: [2 * PHI - 1, 2, 2 + PHI], perm: 'even' },
                { v: [PHI, 3, 2 * PHI], perm: 'even' },
            ]
        },
        abgeschraegtes_dodekaeder: {
            name: 'Abgeschrägtes Dodekaeder (Dodecaedron simum)', chiral: true,
            specs: [
                { v: [2 * al, 2, 2 * be], perm: 'even', parity: 'evenPlus' },
                { v: [al + be / PHI + PHI, -al * PHI + be + 1 / PHI, al / PHI + be * PHI - 1], perm: 'even', parity: 'evenPlus' },
                { v: [al + be / PHI - PHI, al * PHI - be + 1 / PHI, al / PHI + be * PHI + 1], perm: 'even', parity: 'evenPlus' },
                { v: [-al / PHI + be * PHI + 1, -al + be / PHI - PHI, al * PHI + be - 1 / PHI], perm: 'even', parity: 'evenPlus' },
                { v: [-al / PHI + be * PHI - 1, al - be / PHI - PHI, al * PHI + be + 1 / PHI], perm: 'even', parity: 'evenPlus' },
            ]
        },
    };

    /** Catalan solids = duals of the Archimedean ones (same key order). */
    const CATALAN = {
        triakistetraeder: { name: 'Triakistetraeder', dualOf: 'tetraederstumpf' },
        rhombendodekaeder: { name: 'Rhombendodekaeder', dualOf: 'kuboktaeder' },
        triakisoktaeder: { name: 'Triakisoktaeder', dualOf: 'hexaederstumpf' },
        tetrakishexaeder: { name: 'Tetrakishexaeder', dualOf: 'oktaederstumpf' },
        deltoidalikositetraeder: { name: 'Deltoidalikositetraeder', dualOf: 'rhombenkuboktaeder' },
        hexakisoktaeder: { name: 'Hexakisoktaeder', dualOf: 'kuboktaederstumpf' },
        pentagonikositetraeder: { name: 'Pentagonikositetraeder', dualOf: 'abgeschraegtes_hexaeder', chiral: true },
        rhombentriakontaeder: { name: 'Rhombentriakontaeder', dualOf: 'ikosidodekaeder' },
        triakisikosaeder: { name: 'Triakisikosaeder', dualOf: 'dodekaederstumpf' },
        pentakisdodekaeder: { name: 'Pentakisdodekaeder', dualOf: 'ikosaederstumpf' },
        deltoidalhexakontaeder: { name: 'Deltoidalhexakontaeder', dualOf: 'rhombenikosidodekaeder' },
        hexakisikosaeder: { name: 'Hexakisikosaeder', dualOf: 'ikosidodekaederstumpf' },
        pentagonhexakontaeder: { name: 'Pentagonhexakontaeder', dualOf: 'abgeschraegtes_dodekaeder', chiral: true },
    };

    /** n-gonal prism / antiprism / pyramid / bipyramid generators (edge a = 1, height h). */
    function prismPoints(n, h) {
        const R = 1 / (2 * Math.sin(Math.PI / n));
        const pts = [];
        for (let k = 0; k < n; k++) {
            const ang = 2 * Math.PI * k / n;
            pts.push([R * Math.cos(ang), h / 2, R * Math.sin(ang)]);
            pts.push([R * Math.cos(ang), -h / 2, R * Math.sin(ang)]);
        }
        return pts;
    }
    function antiprismPoints(n, h) {
        const R = 1 / (2 * Math.sin(Math.PI / n));
        const pts = [];
        for (let k = 0; k < n; k++) {
            const a1 = 2 * Math.PI * k / n, a2 = a1 + Math.PI / n;
            pts.push([R * Math.cos(a1), h / 2, R * Math.sin(a1)]);
            pts.push([R * Math.cos(a2), -h / 2, R * Math.sin(a2)]);
        }
        return pts;
    }
    /** Height of the uniform (all edges equal) antiprism with edge 1. */
    function uniformAntiprismHeight(n) {
        return Math.sqrt(1 - 1 / (4 * Math.cos(Math.PI / (2 * n)) ** 2));
    }
    function pyramidPoints(n, h) {
        const R = 1 / (2 * Math.sin(Math.PI / n));
        const pts = [[0, 0.75 * h, 0]];
        for (let k = 0; k < n; k++) {
            const ang = 2 * Math.PI * k / n;
            pts.push([R * Math.cos(ang), -0.25 * h, R * Math.sin(ang)]);
        }
        return pts;
    }
    function bipyramidPoints(n, h) {
        const R = 1 / (2 * Math.sin(Math.PI / n));
        const pts = [[0, h, 0], [0, -h, 0]];
        for (let k = 0; k < n; k++) {
            const ang = 2 * Math.PI * k / n;
            pts.push([R * Math.cos(ang), 0, R * Math.sin(ang)]);
        }
        return pts;
    }

    /** Build a fully analysed polyhedron from a catalogue key. */
    function build(key) {
        let P;
        if (PLATONIC[key]) P = hull(generate(PLATONIC[key].specs));
        else if (ARCHIMEDEAN[key]) P = hull(generate(ARCHIMEDEAN[key].specs));
        else if (CATALAN[key]) {
            const base = hull(generate(ARCHIMEDEAN[CATALAN[key].dualOf].specs));
            P = hull(dualPoints(base));
        } else throw new Error('unknown solid ' + key);
        normalizeEdge(P, 1);
        return P;
    }

    const api = {
        PHI, generate, hull, normalizeEdge, dualPoints, metrics, build, distinct,
        PLATONIC, ARCHIMEDEAN, CATALAN,
        prismPoints, antiprismPoints, uniformAntiprismHeight, pyramidPoints, bipyramidPoints,
        vec: { sub, add, scale, dot, cross, len, norm },
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.KoerperGeom = api;
})(typeof window !== 'undefined' ? window : globalThis);
