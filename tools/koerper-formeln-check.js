// Check every TeX formula on formelsammlung.html against geometry computed
// independently: plane figures by shoelace / arc-length over dense polygons,
// solids by the divergence theorem / triangle areas over dense meshes.
const fs = require('fs');
const SRC = '/Users/malvers/IdeaProjects/forloop/HTML/formelsammlung.html';
const PI = Math.PI, D = PI / 180;

// ---------- TeX -> JS -------------------------------------------------
function braceArg(s, i) {           // s[i] === '{' -> [content, indexAfter]
    let d = 0;
    for (let j = i; j < s.length; j++) {
        if (s[j] === '{') d++;
        else if (s[j] === '}') { d--; if (!d) return [s.slice(i + 1, j), j + 1]; }
    }
    throw new Error('unbalanced: ' + s);
}
function cmdWithArgs(s, cmd, n, fmt) {
    let out = '', i = 0;
    while (i < s.length) {
        if (s.startsWith(cmd, i) && s[i + cmd.length] === '{') {
            let k = i + cmd.length, args = [];
            for (let t = 0; t < n; t++) { const [a, nx] = braceArg(s, k); args.push(cmdAll(a)); k = nx; }
            out += fmt(...args); i = k;
        } else out += s[i++];
    }
    return out;
}
function cmdAll(s) {
    s = cmdWithArgs(s, '\\tfrac', 2, (a, b) => `((${a})/(${b}))`);
    s = cmdWithArgs(s, '\\frac', 2, (a, b) => `((${a})/(${b}))`);
    s = cmdWithArgs(s, '\\sqrt', 1, a => `Math.sqrt(${a})`);
    return s;
}
function tex2js(t, varNames) {
    let s = cmdAll(t);
    s = s.replace(/\\left|\\right|\\!/g, '');
    s = s.replace(/\\cdot|\\,|\;|\\quad/g, ' ');
    s = s.replace(/\^\\circ/g, '');
    // trig first (before \alpha is rewritten), always with a bracketed argument
    s = s.replace(/\\(sin|cos|tan)\s*\\(alpha|gamma)/g, (m, f, g) => `${f.toUpperCase()}(${g})`);
    s = s.replace(/\\(sin|cos|tan)\s*\(/g, (m, f) => `${f.toUpperCase()}(`);
    s = s.replace(/\\alpha_\{\\mathrm\{rad\}\}/g, 'arad');   // the angle in radians
    s = s.replace(/\\pi/g, 'PI').replace(/\\alpha/g, 'alpha').replace(/\\gamma/g, 'gamma');
    s = s.replace(/(\d)\{,\}(\d)/g, '$1.$2');            // German decimal comma: 1{,}6075
    s = s.replace(/\^\{([^{}]*)\}/g, (m, e) => `**(${e})`);  // ^{1/p}
    s = s.replace(/\^(-?\d+|[A-Za-z])/g, '**$1');           // ^2, ^p
    // mask every known name by a single private-use char, longest first
    const fnNames = ['Math.sqrt', 'SIN', 'COS', 'TAN'];
    const mask = [];
    fnNames.forEach((n, i) => { const ch = String.fromCharCode(0xE100 + i); mask.push([ch, n]); s = s.split(n).join(ch); });
    ['PI', ...varNames].sort((a, b) => b.length - a.length)
        .forEach(n => { const ch = String.fromCharCode(0xE000 + mask.length); mask.push([ch, n]); s = s.split(n).join(ch); });
    const leftover = s.match(/[A-Za-z_][A-Za-z0-9_]*/g);
    if (leftover) throw new Error('unknown symbol(s): ' + [...new Set(leftover)].join(', '));
    // implicit multiplication between two operands (masked name, number or bracket)
    // left operand: variable, digit or ')'   right operand: variable, function, digit or '('
    for (let i = 0; i < 4; i++) {
        s = s.replace(/([\uE000-\uE0FF0-9.\)])\s*([\uE000-\uE1FF0-9\(])/g, (m, a, b) =>
            (/[0-9.]/.test(a) && /[0-9.]/.test(b)) ? m : `${a}*${b}`);
    }
    mask.forEach(([ch, n]) => { s = s.split(ch).join(n === 'SIN' ? 'sind' : n === 'COS' ? 'cosd' : n === 'TAN' ? 'tand' : n); });
    return s;
}
const ENV = { PI, sind: x => Math.sin(x * D), cosd: x => Math.cos(x * D), tand: x => Math.tan(x * D), Math };
function evalTex(t, vars) {
    const js = tex2js(t, Object.keys(vars));
    const all = Object.assign({}, ENV, vars);
    const keys = Object.keys(all);
    return { js, val: Function(...keys, `return (${js});`)(...keys.map(k => all[k])) };
}

// ---------- geometry references ---------------------------------------
const N = 60000;
function shoelace(p) { let s = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; s += p[i][0] * q[1] - q[0] * p[i][1]; } return Math.abs(s) / 2; }
function perim(p, closed = true) { let s = 0; for (let i = 0; i < p.length - (closed ? 0 : 1); i++) { const q = p[(i + 1) % p.length]; s += Math.hypot(q[0] - p[i][0], q[1] - p[i][1]); } return s; }
const arc = (r, a0, a1, m = N) => Array.from({ length: m + 1 }, (_, k) => { const t = a0 + (a1 - a0) * k / m; return [r * Math.cos(t), r * Math.sin(t)]; });

// --- solids: flat faces (exact) and surfaces of revolution (integrals) ---
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = a => Math.hypot(a[0], a[1], a[2]);
function faceArea(poly) {                       // planar polygon in 3D
    let s = [0, 0, 0];
    for (let i = 0; i < poly.length; i++) { const c = cross(poly[i], poly[(i + 1) % poly.length]); s = [s[0] + c[0], s[1] + c[1], s[2] + c[2]]; }
    return norm(s) / 2;
}
const faceSum = faces => faces.reduce((a, f) => a + faceArea(f), 0);
function solidVolume(faces) {                   // convex, origin inside: V = Σ A·d/3
    let V = 0;
    for (const f of faces) {
        const n = cross(sub(f[1], f[0]), sub(f[2], f[0])), L = norm(n);
        V += faceArea(f) * Math.abs(dot(n, f[0])) / L / 3;
    }
    return V;
}
function simpson(f, a, b, n = 200000) {         // n even
    const h = (b - a) / n; let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return s * h / 3;
}
/** Surface of revolution from a parametrised profile r(t), z(t), t in [0,1].
 *  V = π∫r² z' dt (shell integral), M = 2π∫ r √(r'² + z'²) dt — no formula reused. */
function revolution(r, z, t0 = 0, t1 = 1) {
    const e = 1e-7, dr = t => (r(Math.min(t1, t + e)) - r(Math.max(t0, t - e))) / (Math.min(t1, t + e) - Math.max(t0, t - e));
    const dz = t => (z(Math.min(t1, t + e)) - z(Math.max(t0, t - e))) / (Math.min(t1, t + e) - Math.max(t0, t - e));
    const V = Math.abs(simpson(t => PI * r(t) ** 2 * dz(t), t0, t1, 20000));
    const M = simpson(t => 2 * PI * r(t) * Math.hypot(dr(t), dz(t)), t0, t1, 20000);
    return { V, M };
}
const boxFaces = (a, b, c) => {                 // centred box a×b×c, z is the height
    const X = a / 2, Y = b / 2, Z = c / 2;
    const bot = [[-X, -Y, -Z], [X, -Y, -Z], [X, Y, -Z], [-X, Y, -Z]];
    const top = bot.map(p => [p[0], p[1], Z]);
    const side = [];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; side.push([bot[i], bot[j], top[j], top[i]]); }
    return { all: [bot, top, ...side], side, caps: [bot, top] };
};
const prismFaces = (base, h) => {               // base = 2D polygon (centred), height h
    const bot = base.map(p => [p[0], p[1], -h / 2]), top = base.map(p => [p[0], p[1], h / 2]), side = [];
    for (let i = 0; i < base.length; i++) { const j = (i + 1) % base.length; side.push([bot[i], bot[j], top[j], top[i]]); }
    return { all: [bot, top, ...side], side, caps: [bot, top] };
};
const pyramidFaces = (base, h) => {             // apex over the centroid, base in z = 0
    const bot = base.map(p => [p[0], p[1], 0]), apex = [0, 0, h], side = [];
    for (let i = 0; i < base.length; i++) side.push([bot[i], bot[(i + 1) % base.length], apex]);
    return { all: [bot, ...side], side, caps: [bot] };
};
const ngonPts = (n, a) => { const ru = a / (2 * Math.sin(PI / n)); return Array.from({ length: n }, (_, k) => [ru * Math.cos(2 * PI * k / n), ru * Math.sin(2 * PI * k / n)]); };
const near = (x, y, tol) => Math.abs(x - y) <= tol * Math.max(1, Math.abs(y));


// ---------- figures: values + independently computed reference ---------
const CASES = {};
{   // ---- plane figures
    const a = 1.7; CASES['Quadrat'] = { v: { a }, ref: { A: shoelace([[0, 0], [a, 0], [a, a], [0, a]]), U: perim([[0, 0], [a, 0], [a, a], [0, a]]), d: Math.hypot(a, a) } };
}
{   const a = 2.3, b = 1.4, p = [[0, 0], [a, 0], [a, b], [0, b]];
    CASES['Rechteck'] = { v: { a, b }, ref: { A: shoelace(p), U: perim(p), d: Math.hypot(a, b) } };
}
{   const a = 2.1, b = 1.3, al = 63, p = [[0, 0], [a, 0], [a + b * Math.cos(al * D), b * Math.sin(al * D)], [b * Math.cos(al * D), b * Math.sin(al * D)]];
    CASES['Parallelogramm'] = { v: { a, b, alpha: al, h_a: b * Math.sin(al * D) }, ref: { A: shoelace(p), U: perim(p) } };
}
{   const a = 1.9, al = 71, r = al * D, p = [[0, 0], [a, 0], [a + a * Math.cos(r), a * Math.sin(r)], [a * Math.cos(r), a * Math.sin(r)]];
    const d1 = Math.hypot(a + a * Math.cos(r), a * Math.sin(r)), d2 = Math.hypot(a - a * Math.cos(r), a * Math.sin(r));
    CASES['Raute'] = { v: { a, h: a * Math.sin(r), d_1: d1, d_2: d2 }, ref: { A: shoelace(p), U: perim(p) } };
}
{   const a = 3.1, c = 1.7, h = 1.2, b = Math.hypot(h, (a - c) / 2), p = [[0, 0], [a, 0], [(a + c) / 2, h], [(a - c) / 2, h]];
    CASES['Trapez'] = { v: { a, b, c, d: b, h, m: (a + c) / 2 }, ref: { A: shoelace(p), U: perim(p), m: (a + c) / 2 } };
}
{   const w = 1.1, t = 0.8, H = 2.9, p = [[0, 0], [w, t], [0, H], [-w, t]];
    const a = Math.hypot(w, t), b = Math.hypot(w, H - t);
    CASES['Drachenviereck'] = { v: { a, b, d_1: 2 * w, d_2: H }, ref: { A: shoelace(p), U: perim(p) } };
}
{   const a = 3, b = 4.2, c = 5.1, s = (a + b + c) / 2;                      // sides a,b,c opposite A,B,C
    const Cx = (b * b + c * c - a * a) / (2 * c), Cy = Math.sqrt(b * b - Cx * Cx), p = [[0, 0], [c, 0], [Cx, Cy]];
    const ga = Math.acos((a * a + b * b - c * c) / (2 * a * b)) / D;
    CASES['Dreieck'] = { v: { a, b, c, gamma: ga, s }, ref: { A: shoelace(p), U: perim(p), s, h_c: 2 * shoelace(p) / c } };
}
{   const a = 3.3, b = 4.7, c = Math.hypot(a, b), p = [[0, 0], [b, 0], [0, a]];
    CASES['Rechtwinkliges Dreieck'] = { v: { a, b, c }, ref: { A: shoelace(p), c, h_c: 2 * shoelace(p) / c } };
}
{   const a = 2.6, h = Math.sqrt(3) / 2 * a, p = [[0, 0], [a, 0], [a / 2, h]];
    CASES['Gleichseitiges Dreieck'] = { v: { a }, ref: { A: shoelace(p), U: perim(p), h } };
}
{   const n = 7, a = 1.3, p = ngonPts(n, a);
    CASES['Regelmäßiges n-Eck'] = { v: { n, a }, ref: { A: shoelace(p), U: perim(p), r_u: Math.hypot(p[0][0], p[0][1]) } };
}
{   const r = 2.4, p = arc(r, 0, 2 * PI);
    CASES['Kreis'] = { v: { r, d: 2 * r }, ref: { A: shoelace(p.slice(0, -1)), U: perim(p.slice(0, -1)) } };
}
{   const R = 3.1, r = 1.4;
    CASES['Kreisring'] = { v: { R, r }, ref: { A: shoelace(arc(R, 0, 2 * PI).slice(0, -1)) - shoelace(arc(r, 0, 2 * PI).slice(0, -1)), U: perim(arc(R, 0, 2 * PI).slice(0, -1)) + perim(arc(r, 0, 2 * PI).slice(0, -1)) } };
}
{   const r = 2.2, al = 117, p = [[0, 0]].concat(arc(r, 0, al * D));
    CASES['Kreissektor'] = { v: { r, alpha: al }, ref: { A: shoelace(p), b: perim(arc(r, 0, al * D), false), U: perim(arc(r, 0, al * D), false) + 2 * r } };
}
{   const r = 2.2, al = 134, p = arc(r, 0, al * D);
    CASES['Kreissegment'] = { v: { r, alpha: al, arad: al * D }, ref: { A: shoelace(p), s: Math.hypot(p[p.length - 1][0] - p[0][0], p[p.length - 1][1] - p[0][1]) } };
}
{   const a = 3.4, b = 1.9, p = Array.from({ length: N }, (_, k) => { const t = 2 * PI * k / N; return [a * Math.cos(t), b * Math.sin(t)]; });
    const hh = ((a - b) / (a + b)) ** 2;
    CASES['Ellipse'] = { v: { a, b, h: hh }, ref: { A: shoelace(p), U: perim(p) }, tol: { U: 1e-4 } };
}
{   // ---- solids
    const a = 1.8, F = boxFaces(a, a, a);
    CASES['Würfel'] = { v: { a }, ref: { V: solidVolume(F.all), O: faceSum(F.all), M: faceSum(F.side), d: Math.sqrt(3) * a } };
}
{   const a = 2.2, b = 1.5, c = 3.1, F = boxFaces(a, b, c);
    CASES['Quader'] = { v: { a, b, c }, ref: { V: solidVolume(F.all), O: faceSum(F.all), M: faceSum(F.side), d: Math.sqrt(a * a + b * b + c * c) } };
}
{   const n = 6, a = 1.2, h = 2.7, base = ngonPts(n, a), F = prismFaces(base, h);
    CASES['Prisma'] = { v: { G: shoelace(base), u: perim(base), h }, ref: { V: solidVolume(F.all), O: faceSum(F.all), M: faceSum(F.side) } };
}
{   const r = 1.6, h = 3.2, R = revolution(() => r, t => t * h);
    CASES['Zylinder'] = { v: { r, h }, ref: { V: R.V, M: R.M, O: R.M + 2 * PI * r * r } };
}
{   const a = 2.4, h = 3.0, base = [[-a / 2, -a / 2], [a / 2, -a / 2], [a / 2, a / 2], [-a / 2, a / 2]], F = pyramidFaces(base, h);
    const hs = Math.sqrt(h * h + a * a / 4);
    const V = solidVolume(F.all.map(f => f.map(p => [p[0], p[1], p[2] - h / 4])));   // origin inside
    CASES['Pyramide'] = { v: { G: a * a, u: 4 * a, h, h_s: hs }, ref: { V, M: faceSum(F.side), O: faceSum(F.all) } };
    CASES['Quadratische Pyramide'] = { v: { a, h, h_s: hs }, ref: { V, M: faceSum(F.side), O: faceSum(F.all), h_s: hs } };
}
{   const r = 1.7, h = 2.9, R = revolution(t => r * (1 - t), t => t * h);
    CASES['Kegel'] = { v: { r, h }, ref: { V: R.V, M: R.M, O: R.M + PI * r * r, s: Math.hypot(r, h) } };
}
{   const R1 = 2.3, r = 1.1, h = 2.5, Rv = revolution(t => R1 + (r - R1) * t, t => t * h);
    CASES['Kegelstumpf'] = { v: { R: R1, r, h }, ref: { V: Rv.V, M: Rv.M, s: Math.hypot(R1 - r, h) } };
}
{   const a = 2.6, b = 1.4, h = 2.0;                       // square frustum
    const bot = [[-a / 2, -a / 2, 0], [a / 2, -a / 2, 0], [a / 2, a / 2, 0], [-a / 2, a / 2, 0]];
    const top = [[-b / 2, -b / 2, h], [b / 2, -b / 2, h], [b / 2, b / 2, h], [-b / 2, b / 2, h]];
    const side = []; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; side.push([bot[i], bot[j], top[j], top[i]]); }
    const all = [bot, top, ...side].map(f => f.map(p => [p[0], p[1], p[2] - h / 2]));
    CASES['Pyramidenstumpf'] = { v: { G_1: a * a, G_2: b * b, h }, ref: { V: solidVolume(all) } };
}
{   const r = 2.1, R = revolution(t => r * Math.sin(PI * t), t => r * Math.cos(PI * t));
    CASES['Kugel'] = { v: { r }, ref: { V: R.V, O: R.M } };
}
{   const r = 2.1, R = revolution(t => r * Math.sin(PI / 2 * t), t => r * Math.cos(PI / 2 * t));
    CASES['Halbkugel'] = { v: { r }, ref: { V: R.V, M: R.M, O: R.M + PI * r * r } };
}
{   const r = 2.4, h = 1.3, t1 = Math.acos((r - h) / r);   // cap of height h on a sphere of radius r
    const R = revolution(t => r * Math.sin(t1 * t), t => r * Math.cos(t1 * t));
    CASES['Kugelkappe'] = { v: { r, h }, ref: { V: R.V, M: R.M } };
}
{   const R1 = 2.6, r = 0.9;
    // V from disc integration, O from |P_u × P_v| = r(R + r cos v) — differential geometry, not Guldin
    const V = simpson(z => 4 * PI * R1 * Math.sqrt(Math.max(0, r * r - z * z)), -r, r, 400000);
    const O = 2 * PI * simpson(v => r * (R1 + r * Math.cos(v)), 0, 2 * PI, 200000);
    CASES['Torus'] = { v: { R: R1, r }, ref: { V, O }, tol: { V: 1e-4 } };
}
{   const a = 2.3, b = 1.6, c = 3.4, pp = 1.6075;      // the page carries Thomsen's approximation for O
    // V from disc integration, O from the exact surface integral |P_u x P_v| over the parametrisation
    const V = simpson(z => PI * a * b * (1 - z * z / (c * c)), -c, c, 200000);
    const O = simpson(v => simpson(u => Math.sqrt(
        (b * c * Math.sin(u) ** 2 * Math.cos(v)) ** 2 +
        (a * c * Math.sin(u) ** 2 * Math.sin(v)) ** 2 +
        (a * b * Math.sin(u) * Math.cos(u)) ** 2), 0, PI, 800), 0, 2 * PI, 800);
    CASES['Ellipsoid'] = { v: { a, b, c, p: pp }, ref: { V, O, p: pp }, tol: { V: 1e-6, O: 1.1e-2 } };
}
{   const a = 2.2, e = a / Math.sqrt(8);                   // regular tetrahedron, edge a
    const P = [[e, e, e], [e, -e, -e], [-e, e, -e], [-e, -e, e]];
    const F = [[P[0], P[1], P[2]], [P[0], P[1], P[3]], [P[0], P[2], P[3]], [P[1], P[2], P[3]]];
    CASES['Tetraeder'] = { v: { a }, ref: { V: solidVolume(F), O: faceSum(F), h: Math.sqrt(2 / 3) * a } };
}

// ---------- pull the formulas out of the page and check ----------------
const html = fs.readFileSync(SRC, 'utf8');
const blocks = [...html.matchAll(/\{\s*n:\s*'([^']+)',[\s\S]*?f:\s*\[([\s\S]*?)\]\s*(?:,\s*note:[^\n]*)?\}/g)];
let checked = 0, skipped = [], bad = [];
for (const [, name, arr] of blocks) {
    const formulas = [...arr.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => m[1].replace(/\\\\/g, '\\'));
    const C = CASES[name];
    if (!C) { skipped.push(`${name}: no reference case`); continue; }
    for (const f of formulas) {
        const parts = f.split(/=|\\approx/).map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) { skipped.push(`${name}: "${f}" (no equation)`); continue; }
        const lhsRaw = parts[0];
        const lhs = lhsRaw.replace(/\\/g, '').replace(/[{}]/g, '').replace(/\s+/g, '');
        // multi-symbol lines like "M = 2a h_s,\quad O = a^2 + M" are split on the comma first
        const chunks = f.split(/,\\quad|,\s*\;/).map(s => s.trim()).filter(Boolean);
        for (const ch of chunks) {
            const ps = ch.split(/=|\\approx/).map(s => s.trim()).filter(Boolean);
            if (ps.length < 2) { skipped.push(`${name}: "${ch}"`); continue; }
            const sym = ps[0].replace(/\\/g, '').replace(/[{}]/g, '').replace(/\s+/g, '');
            const want = C.ref[sym];
            if (want === undefined) { skipped.push(`${name}: ${sym} (no reference value)`); continue; }
            for (const rhs of ps.slice(1)) {
                let got;
                try { got = evalTex(rhs, Object.assign({}, C.ref, C.v)); } catch (e) { bad.push(`${name}: ${sym} = ${rhs}  → ${e.message}`); continue; }
                const tol = (C.tol && C.tol[sym]) || 1e-6;
                checked++;
                if (!Number.isFinite(got.val) || !near(got.val, want, tol))
                    bad.push(`${name}: ${sym} = ${rhs}\n     js: ${got.js}\n     got ${got.val}  ref ${want}  Δrel ${(Math.abs(got.val - want) / Math.abs(want)).toExponential(2)}`);
            }
        }
    }
}
console.log(`checked ${checked} formula evaluations`);
if (bad.length) { console.log(`\n!! ${bad.length} MISMATCH:`); bad.forEach(b => console.log('  - ' + b)); }
else console.log('all matched');
if (skipped.length) { console.log(`\n(${skipped.length} not checked:`); skipped.forEach(s => console.log('   · ' + s)); console.log(')'); }

// ---------- the button in the lab must name the right number ----------
{
    const lab = fs.readFileSync('/Users/malvers/IdeaProjects/forloop/HTML/koerper.html', 'utf8');
    const m = lab.match(/const FS_TILES = (\d+);/);
    const tiles = (html.match(/\{ n: '/g) || []).length;
    if (!m) console.log(`\n!! koerper.html: FS_TILES not found`);
    else if (+m[1] !== tiles) console.log(`\n!! koerper.html says FS_TILES = ${m[1]}, the sheet has ${tiles} tiles`);
    else console.log(`button label ok: ${tiles} tiles`);
}
