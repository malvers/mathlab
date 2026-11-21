// Raumkrümmung (raumkruemmung.html): a furnished room floating in space, and a dense ball that curves it.
// Doc, Sa 21.11.2026, during the talk on gravitational waves at "Physik am Samstag" (TU Dresden): a three-dimensional room
// somewhere in outer space, a ball of a chosen density pushed through it with the mouse, and the ball distorts the room -
// the furniture bends wherever the ball goes, "aber alles bleibt topologisch, wie es ist, weil sich ja nur der Raum krümmt".
//
// The picture. Every point p at distance r from the ball centre c moves radially to
//     p' = c + (p - c) * m(r),     m(r) = exp(-E * delta(r))
// with delta(r) = -Phi(r)/c^2 the weak-field potential of a homogeneous ball: r_s/(2r) outside, r_s(3R^2 - r^2)/(4R^3)
// inside (continuous with a continuous slope at r = R), r_s = 2GM/c^2, and E a clearly labelled exaggeration.
// m is positive and grows with r (delta falls), so the new radius f(r) = r*m(r) grows strictly:
//     f'(r) = m(r) * (1 - r*E*delta'(r)) > 0.
// A radial map whose radius function grows strictly and whose m stays positive is a C1 diffeomorphism of space: no fold,
// no tear, nothing turns inside out (the Jacobian has the positive eigenvalues m tangentially and f' radially).
// The warp runs in the vertex shader (positions and normals); the room grid is drawn in the fragment shader from the
// UNWARPED position, so its lines follow the warp exactly. The ball lies in the curved space too: it is drawn with f(R).
//
// To first order (E = 1, weak field) the tangential factor m = 1 - delta is how a proper-size object looks in isotropic
// coordinates, where every rod near the mass is longer by the fraction delta - an honest anchor, but a picture, not a
// measurement. The real numbers (mass, r_s, delta at the surface) are shown as they are: invisibly small in a room.
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('[raumkruemmung] ' + msg); } catch (e) { } }
window.addEventListener('error', e => dbg('Fehler: ' + (e && e.message ? e.message : e)));

// ---------------- constants ----------------
const G = 6.674e-11, C_LIGHT = 2.998e8, YEAR = 3.156e7;
const ROOM = { x0: -3, x1: 3, z0: -2.5, z1: 2.5, h: 2.8 };
const SEG = 0.045;                        // longest edge of the subdivided meshes (m) - fine enough to bend smoothly
// k = E*delta at the surface. The ball is drawn with f(R) = R*exp(-k): k = 0.9 keeps it at 40 % and squeezes a chair
// 70 cm away by 40 %; at K_MAX it is down to 20 % (beyond that everything near it shrinks to a dot)
const K_MAX = 1.6;
const K_FIT = 0.9;                        // "SICHTBAR MACHEN" and the start
const K_SEEN = 0.2;                       // from here on the bending is plain to see
const K_HIDDEN = 0.03;                    // below this the picture looks flat
const R_MIN = 0.05, R_MAX = 0.6;
const LAMBDA = 0xf5c242, YPSILON = 0xb02418, PHI = 0x799e31, NEON = 0x00d2ff;
const BG = 0x030b1c;                      // never black - a very dark blue
const TARGET = new THREE.Vector3(0, 0.95, -0.15);
const VIEW_DIR = new THREE.Vector3(0.48, 0.62, 0.72).normalize();

// densities in kg/m^3 (Osmium: CRC Handbook 22.59 g/cm^3; white dwarf and neutron star: typical mean densities)
const MATERIALS = [
    { id: 'wasser', label: 'Wasser', rho: 1000, ball: { color: 0x3d8fe0, metalness: 0.0, roughness: 0.08, emissive: 0x0b2b55, emissiveIntensity: 0.6, transparent: true, opacity: 0.9 } },
    { id: 'eisen', label: 'Eisen', rho: 7874, ball: { color: 0x8a9099, metalness: 0.85, roughness: 0.35 } },
    { id: 'osmium', label: 'Osmium', rho: 22590, ball: { color: 0xaec2dc, metalness: 1.0, roughness: 0.16 } },
    { id: 'zwerg', label: 'Weißer Zwerg', rho: 1e9, ball: { color: 0xffffff, emissive: 0xe9efff, emissiveIntensity: 1.3, roughness: 0.4 }, glow: 0xdfe8ff, light: 3.0 },
    { id: 'neutron', label: 'Neutronenstern', rho: 4e17, ball: { color: 0xd8f7ff, emissive: 0x7fe3ff, emissiveIntensity: 1.7, roughness: 0.3 }, glow: 0x7fe3ff, light: 4.0 },
];
// what a length can be compared with (metres)
const SIZES = [
    { m: 1, like: 'so groß wie ein Meter', less: 'kleiner als ein Meter', note: '1 m' },
    { m: 1e-2, like: 'so groß wie ein Zentimeter', less: 'kleiner als ein Zentimeter', note: '10 mm' },
    { m: 1e-3, like: 'so groß wie ein Millimeter', less: 'kleiner als ein Millimeter', note: '1 mm' },
    { m: 7e-5, like: 'so dick wie ein Haar', less: 'dünner als ein Haar', note: '≈ 0,07 mm' },
    { m: 7.5e-6, like: 'so groß wie ein rotes Blutkörperchen', less: 'kleiner als ein rotes Blutkörperchen', note: '≈ 7,5 µm' },
    { m: 1e-7, like: 'so groß wie ein Grippevirus', less: 'kleiner als ein Grippevirus', note: '≈ 100 nm' },
    { m: 1e-10, like: 'so groß wie ein Atom', less: 'kleiner als ein Atom', note: '≈ 0,1 nm' },
    { m: 1.4e-14, like: 'so groß wie ein Goldatomkern', less: 'kleiner als ein Goldatomkern', note: '≈ 14 fm' },
    { m: 1.7e-15, like: 'so groß wie ein Proton', less: 'kleiner als ein Proton', note: '≈ 1,7 fm' },
];

// ---------------- state ----------------
const st = { x: 0.85, y: 0.95, z: -0.05, R: 0.4, mat: 'neutron', E: 0, k: K_FIT, grid: true, ghost: false, lens: true };
let capped = false;                        // the last material/radius change hit K_MAX
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const matOf = () => MATERIALS.find(m => m.id === st.mat) || MATERIALS[MATERIALS.length - 1];

function physics() {
    const R = st.R, rho = matOf().rho;
    const M = 4 / 3 * Math.PI * R * R * R * rho;
    const rs = 2 * G * M / (C_LIGHT * C_LIGHT);
    return { R, rho, M, rs, delta: rs / (2 * R) };      // delta at the surface = GM/(R c^2)
}
// material or radius changed: E stays (that is the honest comparison), the picture strength k follows
function deriveK() {
    const d = physics().delta;
    let k = st.E * d;
    capped = false;
    if (!(k <= K_MAX)) { k = K_MAX; st.E = K_MAX / d; capped = true; }
    st.k = k;
}
function setK(k) { st.k = clamp(k, 0, K_MAX); st.E = st.k / physics().delta; capped = false; }

// ---------------- the map (JS twin of the shader) ----------------
// E*delta(r), with uK = E*r_s/2 = k*R
function eDelta(r, uK, R) { return r >= R ? uK / r : uK * (3 * R * R - r * r) / (2 * R * R * R); }
function radiusMap(r) { return r * Math.exp(-eDelta(r, st.k * st.R, st.R)); }
function warpPoint(p, out) {
    out = out || new THREE.Vector3();
    const dx = p.x - st.x, dy = p.y - st.y, dz = p.z - st.z;
    const m = Math.exp(-eDelta(Math.hypot(dx, dy, dz), st.k * st.R, st.R));
    return out.set(st.x + dx * m, st.y + dy * m, st.z + dz * m);
}
// f(r) must grow strictly, f'(r) = m(1 - r*E*delta') > 0 - checked numerically on a geometric grid
function checkDiffeo() {
    const uK = st.k * st.R, R = st.R;
    let prev = -1, ok = true, minFp = Infinity;
    for (let i = 0; i <= 600; i++) {
        const r = 1e-4 * Math.pow(30 / 1e-4, i / 600);
        const m = Math.exp(-eDelta(r, uK, R));
        const rdd = r >= R ? -uK / r : -uK * r * r / (R * R * R);    // r * (E*delta)'(r)
        const fp = m * (1 - rdd);
        const f = r * m;
        if (!(f > prev) || !(fp > 0)) ok = false;
        minFp = Math.min(minFp, fp);
        prev = f;
    }
    return { ok, minFp };
}

// ---------------- shader pieces ----------------
const U = {
    uBall: { value: new THREE.Vector3(st.x, st.y, st.z) },
    uK: { value: 0 },
    uR: { value: st.R },
    uGridOn: { value: 1 },
    uGridColor: { value: new THREE.Color(NEON).multiplyScalar(0.65) },
};
const GLSL_WARP = `
uniform vec3 uBall;
uniform float uK;
uniform float uR;
float rkEDelta(float r) { return r >= uR ? uK / r : uK * (3.0 * uR * uR - r * r) / (2.0 * uR * uR * uR); }
float rkREDelta(float r) { return r >= uR ? -uK / r : -uK * r * r / (uR * uR * uR); }
vec3 rkWarp(vec3 p) {
    vec3 d = p - uBall;
    return uBall + d * exp(-rkEDelta(length(d)));
}
// normals go with the inverse transpose of the Jacobian J = m (I - e e^T) + f' e e^T, up to a positive factor
vec3 rkWarpNormal(vec3 p, vec3 n) {
    vec3 d = p - uBall;
    float r = length(d);
    if (r < 1e-5) return n;
    vec3 e = d / r;
    float m = exp(-rkEDelta(r));
    float fp = m * (1.0 - rkREDelta(r));
    vec3 nn = fp * n + (m - fp) * dot(e, n) * e;
    float l2 = dot(nn, nn);
    return (l2 > 1e-20 && l2 < 1e20) ? nn * inversesqrt(l2) : n;
}
`;
const GLSL_GRID_FRAG = `
varying vec3 vRkFlat;
varying vec3 vRkFlatN;
uniform float uGridOn;
uniform vec3 uGridColor;
// one family of grid lines, x in grid units; halfPx = half the line width in pixels; fades where lines crowd
float rkLine(float x, float halfPx) {
    float w = max(fwidth(x), 1e-5);
    float d = abs(fract(x - 0.5) - 0.5) / w;
    float fade = 1.0 - smoothstep(0.12, 0.32, w);
    return (1.0 - smoothstep(halfPx - 0.5, halfPx + 0.5, d)) * fade;
}
float rkGrid(vec3 p, vec3 n) {
    vec3 a = abs(n);
    vec3 on = vec3(step(a.x, 0.5), step(a.y, 0.5), step(a.z, 0.5));
    float minor = max(max(on.x * rkLine(p.x * 2.0, 0.55), on.y * rkLine(p.y * 2.0, 0.55)), on.z * rkLine(p.z * 2.0, 0.55));
    float major = max(max(on.x * rkLine(p.x, 1.0), on.y * rkLine(p.y, 1.0)), on.z * rkLine(p.z, 1.0));
    return max(0.35 * minor, major);
}
`;
const GLSL_NAN_GUARD = `
#include <dithering_fragment>
if (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) gl_FragColor = vec4(0.012, 0.043, 0.11, 1.0);
`;

function warpSurface(mat, grid) {
    mat.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, U);
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\n' + GLSL_WARP + (grid ? 'varying vec3 vRkFlat;\nvarying vec3 vRkFlatN;\n' : ''))
            .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal = rkWarpNormal(position, objectNormal);')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + (grid ? 'vRkFlat = position;\nvRkFlatN = normal;\n' : '') + 'transformed = rkWarp(transformed);');
        let fs = shader.fragmentShader.replace('#include <dithering_fragment>', GLSL_NAN_GUARD);
        if (grid) {
            fs = fs.replace('#include <common>', '#include <common>\n' + GLSL_GRID_FRAG)
                .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGridColor * (rkGrid(vRkFlat, vRkFlatN) * uGridOn);');
        }
        shader.fragmentShader = fs;
    };
    mat.customProgramCacheKey = () => (grid ? 'rk-warp-grid' : 'rk-warp');
    return mat;
}
function warpLine(mat) {
    mat.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, U);
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\n' + GLSL_WARP)
            .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed = rkWarp(transformed);');
    };
    mat.customProgramCacheKey = () => 'rk-warp-line';
    return mat;
}

// ---------------- renderer, scene, camera ----------------
const container = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const coach = document.getElementById('math-coach-box');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(BG, 1);
const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 400);
try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
} catch (e) { dbg('Umgebungslicht fehlt: ' + e.message); }

scene.add(new THREE.HemisphereLight(0xa9c8ff, 0x1a2440, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(4, 7, 5);
scene.add(sun);
const rim = new THREE.DirectionalLight(0x5f86ff, 0.5);
rim.position.set(-5, 3, -6);
scene.add(rim);
const lampLight = new THREE.PointLight(0xffd9a0, 2.4, 0, 2);
scene.add(lampLight);
const LAMP_BULB = new THREE.Vector3(2.35, 1.47, -1.85);

// ---------------- the room (all geometry baked into world space, so the shader sees world positions) ----------------
const SURF = {
    floor: { color: 0x0d2242, roughness: 0.9, grid: true, edge: NEON },
    wall: { color: 0x14294b, roughness: 0.92, grid: true, edge: NEON },
    table: { color: LAMBDA, roughness: 0.55 },
    chair: { color: YPSILON, roughness: 0.6 },
    shelf: { color: PHI, roughness: 0.7 },
    sofa: { color: 0x2c5a86, roughness: 0.85 },
    cushion: { color: 0x3d74a8, roughness: 0.9 },
    lamp: { color: 0xc9d2de, roughness: 0.35, metalness: 0.6 },
    shade: { color: 0xf3e6c8, roughness: 0.8, emissive: 0x7a6236, emissiveIntensity: 0.6, side: THREE.DoubleSide },
    bulb: { color: 0xfff2d0, emissive: 0xffe2a8, emissiveIntensity: 2.2 },
    frame: { color: 0xd8dee8, roughness: 0.5 },
    door: { color: 0x2f6d78, roughness: 0.7 },
    knob: { color: LAMBDA, roughness: 0.3, metalness: 0.7 },
    pot: { color: 0x9c4a2f, roughness: 0.85 },
    leaf: { color: 0x5f8f2a, roughness: 0.8 },
    clockface: { color: 0xeef2f7, roughness: 0.6 },
    hand: { color: 0x0b1a33, roughness: 0.5 },
    sky: { color: 0x2a5d8f, roughness: 0.8 },
    field: { color: PHI, roughness: 0.8 },
    picsun: { color: LAMBDA, roughness: 0.6, emissive: LAMBDA, emissiveIntensity: 0.25 },
};
const BOOK_COLORS = [LAMBDA, YPSILON, PHI, 0x2c5a86, 0xd8dee8, 0x6a3d7a, 0x1f7a8c];
BOOK_COLORS.forEach((c, i) => { SURF['book' + i] = { color: c, roughness: 0.75 }; });

const parts = [];                          // { geo, key, edge (threshold angle in degrees, or null) }
let frameM = new THREE.Matrix4();
const ONE = new THREE.Vector3(1, 1, 1);
const nseg = len => Math.max(1, Math.ceil(len / SEG));
function mat4(x, y, z, rx, ry, rz) {
    return new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), ONE);
}
function inFrame(x, y, z, ry, fn) {
    const old = frameM;
    frameM = old.clone().multiply(mat4(x, y, z, 0, ry, 0));
    fn();
    frameM = old;
}
function place(geo, key, x, y, z, rx, ry, rz, edge) {
    geo.applyMatrix4(frameM.clone().multiply(mat4(x, y, z, rx, ry, rz)));
    parts.push({ geo, key, edge });
}
const box = (key, w, h, d, x, y, z, ry, rz) => place(new THREE.BoxGeometry(w, h, d, nseg(w), nseg(h), nseg(d)), key, x, y, z, 0, ry, rz, 30);
const cyl = (key, rt, rb, h, x, y, z, radial, open, rx, rz) => place(new THREE.CylinderGeometry(rt, rb, h, radial || 24, nseg(h), !!open), key, x, y, z, rx, 0, rz, 50);
const sphere = (key, r, x, y, z) => place(new THREE.SphereGeometry(r, 24, 16), key, x, y, z, 0, 0, 0, null);

let seed = 20261121;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function buildRoom() {
    // floor and walls (front and ceiling open, a window in the back wall, a door in the right wall)
    box('floor', 6.2, 0.08, 5.1, 0, -0.04, -0.05);
    box('wall', 0.1, ROOM.h, 5.1, -3.05, ROOM.h / 2, -0.05);
    box('wall', 0.1, ROOM.h, 5.1, 3.05, ROOM.h / 2, -0.05);
    const wx0 = 0.3, wx1 = 2.1, wy0 = 0.95, wy1 = 2.25, bz = -2.55;
    box('wall', wx0 + 3.1, ROOM.h, 0.1, (-3.1 + wx0) / 2, ROOM.h / 2, bz);
    box('wall', 3.1 - wx1, ROOM.h, 0.1, (wx1 + 3.1) / 2, ROOM.h / 2, bz);
    box('wall', wx1 - wx0, wy0, 0.1, (wx0 + wx1) / 2, wy0 / 2, bz);
    box('wall', wx1 - wx0, ROOM.h - wy1, 0.1, (wx0 + wx1) / 2, (wy1 + ROOM.h) / 2, bz);
    // window frame, cross and sill - the stars show through
    const wcx = (wx0 + wx1) / 2, wcy = (wy0 + wy1) / 2, ww = wx1 - wx0, wh = wy1 - wy0;
    box('frame', 0.06, wh, 0.12, wx0 + 0.03, wcy, bz);
    box('frame', 0.06, wh, 0.12, wx1 - 0.03, wcy, bz);
    box('frame', ww, 0.06, 0.12, wcx, wy0 + 0.03, bz);
    box('frame', ww, 0.06, 0.12, wcx, wy1 - 0.03, bz);
    box('frame', 0.04, wh, 0.06, wcx, wcy, bz);
    box('frame', ww, 0.04, 0.06, wcx, wy0 + wh * 0.62, bz);
    box('frame', ww + 0.12, 0.04, 0.24, wcx, wy0 - 0.02, -2.43);

    // table with four chairs
    inFrame(-0.15, 0, -0.55, 0, () => {
        box('table', 1.6, 0.05, 0.9, 0, 0.745, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) box('table', 0.06, 0.72, 0.06, sx * 0.72, 0.36, sz * 0.37);
    });
    chair(-0.55, -1.22, 0);
    chair(0.3, -1.25, 0.12);
    chair(-0.6, 0.15, Math.PI);
    chair(0.42, 0.32, Math.PI + 0.32);

    // shelf against the left wall, with books
    inFrame(-2.8, 0, -1.1, 0, () => {
        const H = 1.9, Dp = 0.32, W = 1.2;
        box('shelf', Dp, H, 0.025, 0, H / 2, -W / 2 + 0.0125);
        box('shelf', Dp, H, 0.025, 0, H / 2, W / 2 - 0.0125);
        box('shelf', 0.015, H, W, -Dp / 2 + 0.0075, H / 2, 0);
        const levels = [0.03, 0.49, 0.95, 1.41, 1.875];
        levels.forEach(y => box('shelf', Dp, 0.025, W - 0.05, 0, y, 0));
        levels.slice(0, 4).forEach((y, li) => {
            let z = -W / 2 + 0.05;
            const top = y + 0.0125;
            while (z < W / 2 - 0.1) {
                const bw = 0.028 + rnd() * 0.035, bh = 0.18 + rnd() * 0.12, bd = 0.19 + rnd() * 0.06;
                if (rnd() < 0.1 && li !== 1) { z += 0.06 + rnd() * 0.06; continue; }      // a gap now and then
                box('book' + Math.floor(rnd() * BOOK_COLORS.length), bd, bh, bw, -0.01, top + bh / 2, z + bw / 2);
                z += bw + 0.004;
            }
        });
    });

    // floor lamp in the back right corner
    inFrame(LAMP_BULB.x, 0, LAMP_BULB.z, 0, () => {
        cyl('lamp', 0.17, 0.17, 0.03, 0, 0.015, 0, 28);
        cyl('lamp', 0.014, 0.014, 1.5, 0, 0.78, 0, 10);
        cyl('shade', 0.11, 0.22, 0.3, 0, 1.5, 0, 28, true);
        sphere('bulb', 0.05, 0, LAMP_BULB.y, 0);
    });

    // sofa along the left wall, a picture above it
    inFrame(-2.55, 0, 1.15, 0, () => {
        box('sofa', 0.8, 0.4, 1.8, 0, 0.2, 0);
        box('sofa', 0.18, 0.85, 1.8, -0.31, 0.425, 0);
        box('sofa', 0.8, 0.62, 0.15, 0, 0.31, -0.825);
        box('sofa', 0.8, 0.62, 0.15, 0, 0.31, 0.825);
        box('cushion', 0.58, 0.12, 0.74, 0.08, 0.46, -0.38);
        box('cushion', 0.58, 0.12, 0.74, 0.08, 0.46, 0.38);
    });
    inFrame(-2.985, 0, 1.15, 0, () => {
        const pw = 1.2, ph = 0.75, py = 1.67;
        box('frame', 0.03, ph, 0.05, 0, py, -pw / 2 + 0.025);
        box('frame', 0.03, ph, 0.05, 0, py, pw / 2 - 0.025);
        box('frame', 0.03, 0.05, pw, 0, py - ph / 2 + 0.025, 0);
        box('frame', 0.03, 0.05, pw, 0, py + ph / 2 - 0.025, 0);
        box('sky', 0.01, 0.4, pw - 0.1, -0.005, py + 0.13, 0);
        box('field', 0.01, 0.25, pw - 0.1, -0.005, py - 0.195, 0);
        cyl('picsun', 0.09, 0.09, 0.012, 0.004, py + 0.15, 0.25, 32, false, 0, Math.PI / 2);
    });

    // wall clock on the back wall, ten past ten
    inFrame(-1.7, 2.02, -2.485, 0, () => {
        cyl('clockface', 0.24, 0.24, 0.02, 0, 0, 0, 48, false, Math.PI / 2, 0);
        place(new THREE.TorusGeometry(0.25, 0.022, 10, 72), 'frame', 0, 0, 0.012, 0, 0, 0, null);
        for (let i = 0; i < 12; i++) {
            const a = i / 12 * Math.PI * 2;
            box('hand', 0.012, i % 3 ? 0.03 : 0.05, 0.008, Math.sin(a) * 0.2, Math.cos(a) * 0.2, 0.014, 0, -a);
        }
        const hand = (a, L, w) => box('hand', w, L, 0.01, Math.sin(a) * L / 2, Math.cos(a) * L / 2, 0.02, 0, -a);
        hand((10 + 10 / 60) / 12 * Math.PI * 2, 0.13, 0.022);
        hand(10 / 60 * Math.PI * 2, 0.19, 0.016);
    });

    // door in the right wall
    inFrame(2.98, 0, 1.3, 0, () => {
        box('door', 0.04, 2.0, 0.9, 0, 1.0, 0);
        box('frame', 0.05, 2.08, 0.06, -0.01, 1.04, -0.48);
        box('frame', 0.05, 2.08, 0.06, -0.01, 1.04, 0.48);
        box('frame', 0.05, 0.06, 1.02, -0.01, 2.05, 0);
        sphere('knob', 0.035, -0.05, 1.0, -0.33);
    });

    // a plant in the front right corner
    inFrame(2.45, 0, 1.9, 0, () => {
        cyl('pot', 0.17, 0.13, 0.36, 0, 0.18, 0, 28);
        for (let i = 0; i < 9; i++) {
            const a = i * 2.4, rr = 0.05 + rnd() * 0.11;
            sphere('leaf', 0.1 + rnd() * 0.07, Math.cos(a) * rr, 0.5 + rnd() * 0.42, Math.sin(a) * rr);
        }
    });
}

// a chair facing +z (its back at -z), at (x, z) turned by ry
function chair(x, z, ry) {
    inFrame(x, 0, z, ry, () => {
        box('chair', 0.44, 0.04, 0.42, 0, 0.45, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) box('chair', 0.035, 0.43, 0.035, sx * 0.19, 0.215, sz * 0.18);
        for (const sx of [-1, 1]) box('chair', 0.035, 0.52, 0.035, sx * 0.19, 0.73, -0.18);
        box('chair', 0.42, 0.07, 0.025, 0, 0.94, -0.18);
        box('chair', 0.42, 0.035, 0.02, 0, 0.7, -0.18);
        for (const sx of [-0.09, 0, 0.09]) box('chair', 0.035, 0.2, 0.015, sx, 0.81, -0.18);
    });
}

const lighten = (hex, t) => new THREE.Color(hex).lerp(new THREE.Color(0xffffff), t);
const roomMeshes = [], edgeLines = [], ghostLines = [];
function finishRoom() {
    const byKey = new Map();
    parts.forEach(p => { if (!byKey.has(p.key)) byKey.set(p.key, []); byKey.get(p.key).push(p); });
    const ghostMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false });
    let verts = 0;
    byKey.forEach((list, key) => {
        const def = SURF[key];
        const geo = mergeGeometries(list.map(p => p.geo), false);
        verts += geo.attributes.position.count;
        const mat = warpSurface(new THREE.MeshStandardMaterial({
            color: def.color, roughness: def.roughness ?? 0.7, metalness: def.metalness ?? 0,
            emissive: def.emissive ?? 0x000000, emissiveIntensity: def.emissiveIntensity ?? 1,
            side: def.side ?? THREE.FrontSide, envMapIntensity: 0.3,
            polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
        }), !!def.grid);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;                       // the shader moves vertices out of the stored bounds
        scene.add(mesh);
        roomMeshes.push(mesh);
        // edges, each long edge already split by the subdivision, so it bends with the rest
        const segs = [];
        list.forEach(p => {
            if (p.edge == null) return;
            const eg = new THREE.EdgesGeometry(p.geo, p.edge);
            segs.push(eg.attributes.position.array);
            eg.dispose();
        });
        if (!segs.length) return;
        const n = segs.reduce((s, a) => s + a.length, 0);
        const arr = new Float32Array(n);
        let o = 0;
        segs.forEach(a => { arr.set(a, o); o += a.length; });
        const lg = new THREE.BufferGeometry();
        lg.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        const grid = !!def.grid;
        const lm = warpLine(new THREE.LineBasicMaterial({
            color: grid ? new THREE.Color(def.edge) : lighten(def.color, 0.55),
            transparent: true, opacity: grid ? 0.9 : 0.6,
        }));
        const lines = new THREE.LineSegments(lg, lm);
        lines.frustumCulled = false;
        scene.add(lines);
        edgeLines.push(lines);
        const ghost = new THREE.LineSegments(lg, ghostMat);
        ghost.visible = false;
        ghost.renderOrder = 5;
        scene.add(ghost);
        ghostLines.push(ghost);
    });
    dbg('Zimmer: ' + byKey.size + ' Materialien, ' + verts.toLocaleString('de-DE') + ' Ecken');
}

// ---------------- stars (optionally lensed by the ball: primary and secondary image of a point lens) ----------------
const starU = {
    uLens: { value: new THREE.Vector3() },
    uThetaE2: { value: 0 },
    uPx: { value: renderer.getPixelRatio() },
};
const STAR_VS = `
attribute float aSize;
attribute vec3 aColor;
uniform vec3 uLens;
uniform float uThetaE2;
uniform float uPx;
uniform float uImage;
varying vec3 vColor;
void main() {
    vec3 s = normalize(position);
    vec3 L = uLens - cameraPosition;
    float DL = max(length(L), 1e-4);
    vec3 l = L / DL;
    float cosT = clamp(dot(s, l), -1.0, 1.0);
    float th = acos(cosT);
    vec3 dir = s;
    float size = aSize;
    if (uThetaE2 > 0.0 && th > 1e-4 && th < 1.6) {
        // lens equation: beta = theta - thetaE^2/theta, solved for theta (two images)
        float root = sqrt(th * th + 4.0 * uThetaE2);
        float th2 = 0.5 * (th + uImage * root);
        vec3 perp = normalize(s - cosT * l);
        dir = cos(th2) * l + sin(th2) * perp;
        float u = th / sqrt(uThetaE2);
        float mu1 = (u * u + 2.0) / (2.0 * u * sqrt(u * u + 4.0)) + 0.5;
        float mu = uImage > 0.0 ? mu1 : mu1 - 1.0;
        size *= clamp(sqrt(max(mu, 0.0)), 0.0, 3.0);
    } else if (uImage < 0.0) {
        size = 0.0;
    }
    vec4 mv = viewMatrix * vec4(cameraPosition + dir * 150.0, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = size * uPx;
    vColor = aColor;
}`;
const STAR_FS = `
varying vec3 vColor;
void main() {
    vec2 q = gl_PointCoord - 0.5;
    float r2 = dot(q, q);
    if (r2 > 0.25) discard;
    float a = exp(-r2 * 10.0);
    vec3 c = vColor * a;
    if (any(isnan(c))) discard;
    gl_FragColor = vec4(c, a);
}`;
let starsSecondary = null;
function buildStars() {
    const N = 2600, NB = 2600, T = N + NB;
    const pos = new Float32Array(T * 3), col = new Float32Array(T * 3), size = new Float32Array(T);
    const tints = [[1, 1, 1], [0.8, 0.88, 1], [1, 0.95, 0.82], [1, 0.84, 0.72], [0.74, 0.84, 1]];
    const bandN = new THREE.Vector3(0.35, 1, 0.25).normalize();
    const bandA = new THREE.Vector3(1, 0, 0).cross(bandN).normalize(), bandB = bandN.clone().cross(bandA);
    const v = new THREE.Vector3();
    for (let i = 0; i < T; i++) {
        let b, s;
        if (i < N) {
            const u = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), q = Math.sqrt(1 - u * u);
            v.set(q * Math.cos(ph), u, q * Math.sin(ph));
            b = 0.4 + 0.6 * Math.pow(rnd(), 2.5);
            s = 1.7 + 3.0 * Math.pow(rnd(), 4);
        } else {
            // the milky way: a band around a great circle
            const ph = 2 * Math.PI * rnd();
            const off = (rnd() + rnd() + rnd() - 1.5) * 0.16;
            v.copy(bandA).multiplyScalar(Math.cos(ph)).addScaledVector(bandB, Math.sin(ph)).addScaledVector(bandN, off).normalize();
            b = 0.2 + 0.35 * rnd();
            s = 1.3 + 1.0 * rnd();
        }
        pos.set([v.x * 150, v.y * 150, v.z * 150], i * 3);
        const t = tints[Math.floor(rnd() * tints.length)];
        col.set([t[0] * b, t[1] * b, t[2] * b], i * 3);
        size[i] = s;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    const make = image => {
        const m = new THREE.ShaderMaterial({
            uniforms: { ...starU, uImage: { value: image } },
            vertexShader: STAR_VS, fragmentShader: STAR_FS,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        const p = new THREE.Points(g, m);
        p.frustumCulled = false;
        p.renderOrder = -10;
        scene.add(p);
        return p;
    };
    make(1);
    starsSecondary = make(-1);
}

// ---------------- the ball and its handles ----------------
const ballMats = {};
MATERIALS.forEach(m => { ballMats[m.id] = new THREE.MeshStandardMaterial({ envMapIntensity: 1.0, ...m.ball }); });
const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), ballMats[st.mat]);
ball.renderOrder = 2;
scene.add(ball);
const ballLight = new THREE.PointLight(0xffffff, 0, 0, 2);
scene.add(ballLight);
function glowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,0.9)');
    gr.addColorStop(0.25, 'rgba(255,255,255,0.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending }));
scene.add(glow);

// horizontal ring = "drag me across", double arrow above = "drag me up and down"; drawn on top, not warped
const ringMat = new THREE.MeshBasicMaterial({ color: PHI, transparent: true, opacity: 0.55, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
const ring = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.12, 96), ringMat);
ring.rotation.x = -Math.PI / 2;
ring.renderOrder = 30;
scene.add(ring);
const arrowMat = new THREE.MeshBasicMaterial({ color: LAMBDA, transparent: true, opacity: 0.8, depthTest: false, depthWrite: false });
const arrow = new THREE.Group();
const ARROW_LEN = 0.42;
{
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, ARROW_LEN - 0.12, 12), arrowMat);
    shaft.position.y = ARROW_LEN / 2;
    const up = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 20), arrowMat);
    up.position.y = ARROW_LEN - 0.045;
    const down = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 20), arrowMat);
    down.position.y = 0.045;
    down.rotation.x = Math.PI;
    [shaft, up, down].forEach(m => { m.renderOrder = 31; arrow.add(m); });
}
scene.add(arrow);
const handleBase = new THREE.Vector3(), handleTip = new THREE.Vector3();
// with "Ungekrümmt zum Vergleich": the ball at its real radius, as a faint wire sphere
const ghostBall = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.22, depthWrite: false }));
ghostBall.visible = false;
scene.add(ghostBall);

// plumb line to the floor and the ball's footprint - both live in the room, so both are warped
const plumbGeo = new THREE.BufferGeometry();
plumbGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
const plumb = new THREE.Line(plumbGeo, warpLine(new THREE.LineBasicMaterial({ color: PHI, transparent: true, opacity: 0.75 })));
plumb.frustumCulled = false;
scene.add(plumb);
const FOOT_N = 96;
const footGeo = new THREE.BufferGeometry();
footGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FOOT_N * 3), 3));
const foot = new THREE.LineLoop(footGeo, warpLine(new THREE.LineBasicMaterial({ color: PHI, transparent: true, opacity: 0.85 })));
foot.frustumCulled = false;
scene.add(foot);

let rDisp = st.R;                          // the ball's radius in the picture, f(R)
function applyBall() {
    const R = st.R;
    st.x = clamp(st.x, ROOM.x0 + R, ROOM.x1 - R);
    st.z = clamp(st.z, ROOM.z0 + R, ROOM.z1 - R);
    st.y = clamp(st.y, R, ROOM.h - R);
    U.uBall.value.set(st.x, st.y, st.z);
    U.uK.value = st.k * R;
    U.uR.value = R;
    rDisp = radiusMap(R);
    ball.position.set(st.x, st.y, st.z);
    ball.scale.setScalar(rDisp);
    ballLight.position.copy(ball.position);
    glow.position.copy(ball.position);
    glow.scale.setScalar(rDisp * 4.5 + R * 1.2);
    ghostBall.position.copy(ball.position);
    ghostBall.scale.setScalar(R);
    placeHandles();
    const pa = plumbGeo.attributes.position;
    pa.setXYZ(0, st.x, st.y, st.z);
    pa.setXYZ(1, st.x, 0.002, st.z);
    pa.needsUpdate = true;
    const fa = footGeo.attributes.position;
    for (let i = 0; i < FOOT_N; i++) {
        const a = i / FOOT_N * Math.PI * 2;
        fa.setXYZ(i, st.x + Math.cos(a) * R, 0.003, st.z + Math.sin(a) * R);
    }
    fa.needsUpdate = true;
    warpPoint(LAMP_BULB, lampLight.position);
}

// ring and arrow keep a minimum size on screen, so they stay grabbable with a finger on a small, far-away room
function placeHandles() {
    const D = Math.max(0.1, camera.position.distanceTo(ball.position));
    const wpp = stageH > 0 ? 2 * D * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / stageH : 0.002;   // metres per pixel
    ring.position.copy(ball.position);
    ring.scale.setScalar(Math.max(rDisp * 1.3, 0.11, 18 * wpp));
    const s = Math.max(1, 70 * wpp / ARROW_LEN);
    handleBase.set(st.x, st.y + Math.max(rDisp * 1.3, 0.05, 18 * wpp) + Math.max(0.03, 6 * wpp), st.z);
    handleTip.copy(handleBase);
    handleTip.y += ARROW_LEN * s;
    arrow.position.copy(handleBase);
    arrow.scale.setScalar(s);
}

function applyMaterial() {
    const m = matOf();
    ball.material = ballMats[m.id];
    glow.visible = !!m.glow;
    if (m.glow) glow.material.color.set(m.glow);
    ballLight.intensity = m.light || 0;
    if (m.glow) ballLight.color.set(m.glow);
}

// ---------------- camera and trackball ----------------
const controls = CyberTrackball.make(TrackballControls, camera, canvas, { minDistance: 1.5, maxDistance: 60 });
let stageW = 0, stageH = 0;
let free = { x0: 0, y0: 0, x1: 1, y1: 1 };   // the part of the stage the coach box and the status line leave free

// the room fills the free part of the stage, not the part under the coach box
function fitCamera() {
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const fw = Math.max(80, free.x1 - free.x0), fh = Math.max(80, free.y1 - free.y0);
    const d = Math.max(4.0 / (t * fw / stageH), 3.1 / (t * fh / stageH), 6);
    camera.position.copy(TARGET).addScaledVector(VIEW_DIR, d);
    camera.up.set(0, 1, 0);
    controls.target.copy(TARGET);
    camera.lookAt(TARGET);
    if (typeof controls.stopSpin === 'function') controls.stopSpin();
}

// The coach box floats over the stage (beside the room on a wide screen, above it on a phone). A view offset moves the
// picture's centre into the free part, so the room is never hidden under the text; the status line follows.
function measureFree() {
    const W = stageW, H = stageH, f = { x0: 0, y0: 0, x1: W, y1: H };
    if (coach && !coach.classList.contains('collapsed')) {
        const cr = container.getBoundingClientRect(), b = coach.getBoundingClientRect();
        if (b.width > 0 && b.height > 0) {
            const right = b.right - cr.left, bottom = b.bottom - cr.top;
            if (right < W * 0.6) f.x0 = right + 8;
            else f.y0 = Math.min(bottom + 8, H * 0.62);
        }
    }
    f.y1 = Math.max(f.y0 + 80, H - 48);
    return f;
}
let viewKey = '';
function layoutView(force) {
    const b = coach ? coach.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const key = stageW + 'x' + stageH + '|' + (coach && coach.classList.contains('collapsed') ? 'c' : 'o') + '|' +
        Math.round(b.left) + ',' + Math.round(b.top) + ',' + Math.round(b.width) + ',' + Math.round(b.height);
    if (!force && key === viewKey) return;
    viewKey = key;
    free = measureFree();
    const cx = (free.x0 + free.x1) / 2, cy = (free.y0 + free.y1) / 2;
    camera.setViewOffset(stageW, stageH, -(cx - stageW / 2), -(cy - stageH / 2), stageW, stageH);
    const ov = document.getElementById('rk-overlay');
    if (ov) {
        ov.style.left = Math.round(cx) + 'px';
        ov.style.maxWidth = Math.max(160, Math.round(free.x1 - free.x0 - 24)) + 'px';
    }
}

function resize() {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
    if (w === stageW && h === stageH) return;
    const first = stageW === 0;
    stageW = w; stageH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    starU.uPx.value = renderer.getPixelRatio();
    layoutView(true);
    if (first) fitCamera();
}

// ---------------- picking and dragging the ball ----------------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const coarse = window.matchMedia && window.matchMedia('(hover: none)').matches;
function stagePoint(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
}
function pointerRay(e) {
    const p = stagePoint(e);
    ndc.set(p.x / p.w * 2 - 1, -(p.y / p.h) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray;
}
const _v = new THREE.Vector3();
function toScreen(v) {
    _v.copy(v).project(camera);
    return { x: (_v.x + 1) / 2 * stageW, y: (1 - _v.y) / 2 * stageH, z: _v.z };
}
function distToSeg(px, py, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy;
    const t = L2 > 0 ? clamp(((px - a.x) * dx + (py - a.y) * dy) / L2, 0, 1) : 0;
    return Math.hypot(px - a.x - t * dx, py - a.y - t * dy);
}
// what is under the pointer: 'height' (the arrow), 'move' (the ball) or null (the trackball's)
// Both targets get a tolerance; when both are in reach, the nearer one wins (on a phone the arrow sits a few pixels above
// the ball, and a finger on the ball must still move the ball)
function pick(e, isTouch) {
    const p = stagePoint(e);
    let dArrow = Infinity, dBall = Infinity;
    const a = toScreen(handleBase), b = toScreen(handleTip);
    if (a.z < 1 && b.z < 1) {
        const d = distToSeg(p.x, p.y, a, b);
        if (d < (isTouch ? 24 : 12)) dArrow = d;
    }
    const c = toScreen(ball.position);
    if (c.z < 1) {
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(ring.scale.x);
        const e2 = toScreen(_v.copy(ball.position).add(right));
        const ringPx = Math.hypot(e2.x - c.x, e2.y - c.y);           // the ring is the ball's grab zone
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        if (d < Math.max(ringPx * 1.1, isTouch ? 28 : 14)) dBall = Math.max(0, d - ringPx * 0.6);
    }
    if (dArrow === Infinity && dBall === Infinity) return null;
    return dBall <= dArrow ? 'move' : 'height';
}
function planeFor(r) {
    // the horizontal plane through the ball; looking almost level, a vertical plane facing the camera instead
    const plane = new THREE.Plane();
    if (Math.abs(r.direction.y) > 0.12) { plane.set(new THREE.Vector3(0, 1, 0), -st.y); return { plane, level: false }; }
    const n = new THREE.Vector3(r.direction.x, 0, r.direction.z).normalize();
    plane.setFromNormalAndCoplanarPoint(n, ball.position);
    return { plane, level: true };
}
// absolute height of the point on the vertical line through the ball that comes closest to the ray
function lineHeight(r) {
    const b = r.direction.y, w0 = new THREE.Vector3(st.x - r.origin.x, st.y - r.origin.y, st.z - r.origin.z);
    const dd = w0.y, ee = r.direction.dot(w0), den = 1 - b * b;
    if (den < 1e-3) return null;                       // looking straight down the line
    return st.y + (b * ee - dd) / den;
}

let drag = null, hover = null;
function setHover(h) {
    if (h === hover) return;
    hover = h;
    ringMat.opacity = h === 'move' ? 0.95 : 0.55;
    arrowMat.opacity = h === 'height' ? 1 : 0.8;
    arrowMat.color.set(h === 'height' ? 0xffe39a : LAMBDA);
    canvas.style.cursor = h === 'move' ? (drag ? 'grabbing' : 'grab') : h === 'height' ? 'ns-resize' : '';
}
container.addEventListener('pointerdown', e => {
    if (drag) { e.stopPropagation(); e.preventDefault(); return; }      // a second finger while dragging: ignore
    if (e.target !== canvas) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const isTouch = e.pointerType !== 'mouse';
    let mode = pick(e, isTouch);
    if (!mode) return;                                                   // the trackball takes it
    e.stopPropagation();                                                 // keep it from the trackball
    e.preventDefault();
    if (mode === 'move' && e.shiftKey) mode = 'height';
    const r = pointerRay(e);
    drag = { mode, id: e.pointerId };
    if (mode === 'move') {
        const pf = planeFor(r);
        const hit = new THREE.Vector3();
        drag.pf = pf;
        drag.off = r.intersectPlane(pf.plane, hit) ? ball.position.clone().sub(hit) : new THREE.Vector3();
    } else {
        const y = lineHeight(r);
        drag.offY = y === null ? 0 : st.y - y;
    }
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
    hover = null;
    setHover(mode);
    dbg('Ziehen: ' + (mode === 'move' ? 'waagerecht' : 'Höhe') + ' (' + e.pointerType + ')');
}, { capture: true });

window.addEventListener('pointermove', e => {
    if (drag) {
        if (e.pointerId !== drag.id) return;
        const r = pointerRay(e);
        if (drag.mode === 'move') {
            const hit = new THREE.Vector3();
            if (!r.intersectPlane(drag.pf.plane, hit)) return;
            hit.add(drag.off);
            st.x = hit.x; st.z = hit.z;
        } else {
            const y = lineHeight(r);
            if (y === null) return;
            st.y = y + drag.offY;
        }
        applyBall();
        syncHeight();
        return;
    }
    if (e.target === canvas && e.buttons === 0 && e.pointerType === 'mouse') setHover(pick(e, false));
});
function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    dbg('Kugel bei x = ' + st.x.toFixed(2) + ', y = ' + st.y.toFixed(2) + ', z = ' + st.z.toFixed(2) + ' m');
    drag = null;
    hover = null;
    setHover(null);
    updateStatus();
    save();
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => { if (!drag) setHover(null); });

// mouse wheel over the ball = height; anywhere else the trackball zooms
container.addEventListener('wheel', e => {
    if (e.target !== canvas || !pick(e, false)) return;
    e.preventDefault();
    e.stopPropagation();
    const step = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    st.y -= step * 0.0015;
    applyBall();
    syncHeight();
    saveSoon();
}, { capture: true, passive: false });

// keys: arrows move the ball across (relative to the view), Page Up/Down change the height - never with a modifier,
// Cmd-Shift-R stays the browser's
document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = document.activeElement;
    if (el && (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName) || el.isContentEditable)) return;
    const step = e.shiftKey ? 0.2 : 0.05;
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
    fwd.normalize();
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    let d = null;
    if (e.key === 'ArrowUp') d = fwd.multiplyScalar(step);
    else if (e.key === 'ArrowDown') d = fwd.multiplyScalar(-step);
    else if (e.key === 'ArrowRight') d = right.multiplyScalar(step);
    else if (e.key === 'ArrowLeft') d = right.multiplyScalar(-step);
    else if (e.key === 'PageUp') d = new THREE.Vector3(0, step, 0);
    else if (e.key === 'PageDown') d = new THREE.Vector3(0, -step, 0);
    if (!d) return;
    e.preventDefault();
    st.x += d.x; st.y += d.y; st.z += d.z;
    applyBall();
    syncHeight();
    saveSoon();
});

// ---------------- numbers ----------------
const comma = s => s.replace('.', ',');
const fmtInt = n => Math.round(n).toLocaleString('de-DE');
function fmtSig(x, sig) {
    if (x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)));
    return comma(x.toFixed(clamp(sig - 1 - e, 0, 20)));
}
function sciSplit(v, sig) {
    if (v === 0) return { plain: '0' };
    if (!(v > 0) || !isFinite(v)) return { plain: '–' };
    let e = Math.floor(Math.log10(v));
    if (e >= -2 && e < 4) return { plain: fmtSig(v, sig) };
    let ms = (v / Math.pow(10, e)).toFixed(sig - 1);
    if (parseFloat(ms) >= 10) { e += 1; ms = (v / Math.pow(10, e)).toFixed(sig - 1); }
    return { mant: comma(ms), exp: e };
}
// HTML in the LaTeX face (class rk-num): times dot U+22C5, real minus U+2212
function sci(v, sig, unit) {
    const s = sciSplit(v, sig);
    unit = unit || '';
    const body = s.plain !== undefined ? s.plain
        : (s.mant === '1' || s.mant === '1,0' ? '' : s.mant + '⋅') + '10<sup>' + (s.exp < 0 ? '−' : '') + Math.abs(s.exp) + '</sup>';
    return '<span class="rk-num">' + body + unit + '</span>';
}
function fmtLenHTML(m) {
    const units = [[1, 'm'], [1e-2, 'cm'], [1e-3, 'mm'], [1e-6, 'µm'], [1e-9, 'nm'], [1e-12, 'pm'], [1e-15, 'fm']];
    for (const [f, u] of units) if (m >= f) return '<span class="rk-num">' + fmtSig(m / f, 2) + '&nbsp;' + u + '</span>';
    return sci(m, 2, '&nbsp;m');
}
function fmtTimeHTML(s) {
    const units = [[1, 's'], [1e-3, 'ms'], [1e-6, 'µs'], [1e-9, 'ns']];
    for (const [f, u] of units) if (s >= f) return '<span class="rk-num">' + fmtSig(s / f, 2) + '&nbsp;' + u + '</span>';
    return sci(s, 2, '&nbsp;s');
}
function massWords(kg) {
    if (kg < 1) return fmtSig(kg * 1000, 3) + ' g';
    if (kg < 1000) return fmtSig(kg, 3) + ' kg';
    const t = kg / 1000;
    if (t < 1000) return fmtSig(t, 3) + ' t';
    if (t < 1e6) return fmtInt(t) + ' t';
    const names = [[1e18, 'Trillionen'], [1e15, 'Billiarden'], [1e12, 'Billionen'], [1e9, 'Milliarden'], [1e6, 'Millionen']];
    for (const [f, n] of names) if (t >= f) return fmtSig(t / f, 2) + ' ' + n + ' Tonnen';
    return fmtInt(t) + ' t';
}
function compareSize(m) {
    let near = SIZES[0], bl = Infinity;               // the nearest yardstick on a log scale
    SIZES.forEach(s => { const l = Math.abs(Math.log10(m / s.m)); if (l < bl) { bl = l; near = s; } });
    if (m >= near.m * 0.5 && m <= near.m * 2) return 'etwa ' + near.like + ' (' + near.note + ')';
    let next = null;                                  // else: the smallest yardstick that is still bigger
    SIZES.forEach(s => { if (s.m >= m && (!next || s.m < next.m)) next = s; });
    if (!next) return 'größer als ein Meter';
    const f = next.m / m;
    return next.less + ' (' + next.note + ') – um den Faktor ' + (f < 1000 ? fmtInt(f) : sci(f, 1));
}

// ---------------- panel ----------------
const refs = {};
function sliderRef(id) {
    const group = document.getElementById(id).lastElementChild;
    return { input: group.querySelector('input'), display: group.querySelector('.val-display'), group };
}
const fmtR = v => fmtInt(v * 100) + ' cm';
const fmtY = v => comma(v.toFixed(2)) + ' m';
const fmtE = () => '×' + sci(st.E, 2);

function buildPanel() {
    CyberUI.createCard('ui-container', 'Kugel',
        '<div id="rk-mat"></div><div id="rk-r"></div><div id="rk-y"></div>' +
        '<div class="rk-btn-grid one"><button type="button" class="cyber-btn" id="rk-center">IN DIE MITTE</button></div>' +
        '<div class="rk-info">Kugel ziehen: waagerecht. Pfeil ziehen, Mausrad über der Kugel oder Bild auf/ab: Höhe. ' +
        'Pfeiltasten schieben sie im Raum.</div>', '#f5c242');
    CyberUI.createRadioGroup('rk-mat', 'Dichte', MATERIALS.map(m => ({ label: m.label, value: m.id })), st.mat, id => {
        st.mat = id;
        deriveK();
        applyMaterial();
        changed();
        dbg('Material: ' + matOf().label + ', ρ = ' + matOf().rho + ' kg/m³');
    });
    CyberUI.createSlider('rk-r', 'Radius', R_MIN, R_MAX, st.R, 0.01, v => {
        st.R = clamp(v, R_MIN, R_MAX);
        deriveK();
        changed();
    }, 'var(--neon-blue)', fmtR);
    refs.r = sliderRef('rk-r');
    CyberUI.createSlider('rk-y', 'Höhe der Mitte', 0, ROOM.h, st.y, 0.01, v => {
        st.y = v;
        applyBall();
        syncHeight();
        saveSoon();
    }, 'var(--neon-blue)', fmtY);
    refs.y = sliderRef('rk-y');
    document.getElementById('rk-center').addEventListener('click', () => {
        st.x = 0; st.y = 1.3; st.z = 0.2;
        applyBall();
        syncHeight();
        updateStatus();
        save();
    });

    CyberUI.createCard('ui-container', 'Krümmung',
        '<div id="rk-k"></div>' +
        '<div class="rk-note" id="rk-note"></div>' +
        '<div class="rk-btn-grid one"><button type="button" class="cyber-btn" id="rk-fit">SICHTBAR MACHEN</button></div>' +
        '<div id="rk-checks"></div>' +
        '<div class="rk-info">Die echte Krümmung ist in einem Zimmer unsichtbar klein. Der Regler überhöht sie um den angezeigten Faktor; ' +
        'wechselst du Dichte oder Radius, bleibt der Faktor – so siehst du ehrlich, wie verschieden stark die Kugeln krümmen.</div>', '#f5c242');
    CyberUI.createSlider('rk-k', 'Krümmung überhöht', 0, K_MAX, st.k, 0.01, v => {
        setK(v);
        refs.k.display.innerHTML = fmtE();
        changed(true);
    }, 'var(--neon-blue)', () => '');
    refs.k = sliderRef('rk-k');
    refs.k.display.classList.add('rk-num');
    refs.k.display.style.pointerEvents = 'none';          // the slider value is k, the display shows E - no typing here
    document.getElementById('rk-fit').addEventListener('click', fitCurvature);
    const chk = (label, on, fn) => CyberUI.createCheckbox('rk-checks', label, on, fn).querySelector('input');
    refs.grid = chk('Gitterlinien', st.grid, v => { st.grid = v; U.uGridOn.value = v ? 1 : 0; save(); });
    refs.ghost = chk('Ungekrümmt zum Vergleich', st.ghost, v => { st.ghost = v; showGhost(); save(); });
    refs.lens = chk('Sternenlicht ablenken', st.lens, v => { st.lens = v; save(); });

    CyberUI.createCard('ui-container', 'Echte Werte', '<div class="rk-res" id="rk-res"></div>', '#f5c242');

    CyberUI.createCard('ui-container', 'Ansicht',
        '<div class="rk-btn-grid one"><button type="button" class="cyber-btn" id="rk-view">ANSICHT ZURÜCK</button></div>' +
        '<div class="rk-info">Ziehen neben der Kugel dreht das Zimmer (Trackball), Mausrad oder zwei Finger zoomen.</div>', '#f5c242');
    document.getElementById('rk-view').addEventListener('click', () => { fitCamera(); dbg('Ansicht zurück'); });
}

function showGhost() {
    ghostLines.forEach(g => { g.visible = st.ghost; });
    ghostBall.visible = st.ghost;
}

function fitCurvature() {
    setK(K_FIT);
    changed(true);
    dbg('Sichtbar gemacht: ×' + st.E.toExponential(2));
}

function syncHeight() {
    refs.y.input.value = st.y;
    refs.y.display.textContent = fmtY(st.y);
}
function syncSliders() {
    refs.r.input.value = st.R; refs.r.display.textContent = fmtR(st.R);
    refs.k.input.value = st.k; refs.k.display.innerHTML = fmtE();
    syncHeight();
    refs.grid.checked = st.grid; refs.ghost.checked = st.ghost; refs.lens.checked = st.lens;
    document.querySelectorAll('#rk-mat input[type=radio]').forEach(r => { r.checked = r.value === st.mat; });
}

function updateReadout() {
    const P = physics(), m = matOf();
    const el = document.getElementById('rk-res');
    if (!el) return;
    const row = (k, v, small) => '<div class="rk-row"><span class="rk-k">' + k + '</span><span class="rk-v">' + v + '</span>' +
        (small ? '<br><span class="rk-small">' + small + '</span>' : '') + '</div>';
    const rhoBH = 3 * C_LIGHT * C_LIGHT / (8 * Math.PI * G * P.R * P.R);
    el.innerHTML =
        row('Dichte', sci(P.rho, 2, '&nbsp;kg/m³'), m.label + ': 1 cm³ wiegt ' + massWords(P.rho * 1e-6) + '.') +
        row('Masse der Kugel', sci(P.M, 2, '&nbsp;kg'), P.M >= 1000 ? massWords(P.M) : '') +
        row('Schwarzschild-Radius', '<span data-tex="r_s = \\tfrac{2GM}{c^2}"></span> = ' + fmtLenHTML(P.rs), compareSize(P.rs) + '.') +
        row('Krümmung an der Oberfläche', '<span data-tex="\\delta = \\tfrac{r_s}{2R}"></span> = ' + sci(P.delta, 2),
            'Eine Uhr dort geht gegenüber einer fernen Uhr pro Jahr ' + fmtTimeHTML(P.delta * YEAR) + ' nach.') +
        row('Schwarzes Loch wäre sie erst', 'bei ' + sci(rhoBH, 2, '&nbsp;kg/m³'),
            'dem ' + sci(rhoBH / P.rho, 2) + '-Fachen dieser Dichte (dann wäre <span data-tex="r_s = R"></span>).') +
        row('Im Bild', '<span class="rk-hl">Krümmung ' + fmtE() + '</span>',
            'An der Oberfläche <span data-tex="E\\cdot\\delta"></span> = ' + sci(st.k, 3) + ' statt ' + sci(P.delta, 2) + '.');
    renderTex(el);
}

function updateNote() {
    const el = document.getElementById('rk-note');
    if (el) el.innerHTML = capped ? 'Gekappt: Stärker lässt sich das Bild nicht überhöhen – sonst schrumpft alles in die Kugel.' : '';
    const hint = document.getElementById('rk-hint');
    if (!hint) return;
    if (st.k < K_HIDDEN && st.E > 0) {                  // 0 on the slider is a choice, not a problem
        const need = K_SEEN / physics().delta;
        hint.innerHTML = '<span>Bei ' + fmtE() + ' krümmt <b>' + matOf().label + '</b> unsichtbar wenig – sichtbar wird es etwa ab ×' + sci(need, 1) + '.</span>' +
            '<button type="button" class="cyber-btn" id="rk-fit2">SICHTBAR MACHEN</button>';
        hint.hidden = false;
        document.getElementById('rk-fit2').addEventListener('click', fitCurvature);
    } else {
        hint.hidden = true;
        hint.innerHTML = '';
    }
}

function updateStatus() {
    const el = document.getElementById('rk-status');
    if (!el) return;
    const help = coarse ? 'Kugel ziehen • Pfeil: Höhe' : 'Kugel ziehen • Pfeil oder Mausrad: Höhe • daneben: drehen';
    el.innerHTML = '<b>' + matOf().label + '</b><span class="rk-sep">|</span>R = <span class="rk-num">' + fmtInt(st.R * 100) + '&nbsp;cm</span>' +
        '<span class="rk-sep">|</span>Krümmung ' + fmtE() + '<span id="rk-help"><span class="rk-sep">|</span>' + help + '</span>';
}

// ---------------- coach box ----------------
function buildCoach() {
    const body = document.getElementById('coach-content');
    if (!body) return;
    body.innerHTML =
        '<p>Masse krümmt den Raum. Schieb die Kugel durchs Zimmer: Alles rückt zu ihr hin, Möbel und Gitter biegen sich – ' +
        'aber nichts reißt, nichts klappt um. Die Topologie bleibt.</p>' +
        '<p><b>Echt:</b> Der Schwarzschild-Radius <span data-tex="r_s = 2GM/c^2"></span> misst die Masse als Länge; im Abstand ' +
        '<span data-tex="r"></span> ist der Raum um <span data-tex="\\delta = r_s/(2r)"></span> verzerrt. Selbst bei ' +
        'Neutronenstern-Materie (30&nbsp;cm Radius) ist <span data-tex="r_s \\approx 7\\cdot 10^{-11}\\,\\text{m}"></span> – kleiner ' +
        'als ein Atom. Darum die Überhöhung <span data-tex="E"></span> (Regler).</p>' +
        '<p><b>Das Bild:</b> Jeder Punkt im Abstand <span data-tex="r"></span> von der Kugelmitte rückt auf</p>' +
        '<div class="rk-coach-f" data-tex="f(r) = r\\cdot e^{-E\\,\\delta(r)}" data-display="1"></div>' +
        '<p><span data-tex="f"></span> wächst streng (<span data-tex="f\'(r) > 0"></span>): stetig differenzierbar und umkehrbar – ' +
        'ein Diffeomorphismus. Auch die Kugel liegt im gekrümmten Raum und wird kleiner gezeichnet.</p>' +
        '<p class="rk-coach-small">Ein Bild der Krümmung, keine Messung. Die Kugel geht durch die Möbel hindurch – ' +
        'sie ist hier nur die Quelle der Krümmung.</p>';
    renderTex(body);
}

function renderTex(root) {
    if (!window.katex) { dbg('KaTeX fehlt'); return; }
    (root || document).querySelectorAll('[data-tex]').forEach(el => {
        try { katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: !!el.dataset.display }); } catch (e) { dbg('KaTeX: ' + e.message); }
    });
}

// ---------------- flow ----------------
function changed(fromK) {
    applyBall();
    if (!fromK) syncSliders();
    else refs.k.display.innerHTML = fmtE();
    updateReadout();
    updateNote();
    updateStatus();
    const d = checkDiffeo();
    dbg('k = ' + st.k.toFixed(3) + ', E = ' + st.E.toExponential(2) + ', Diffeomorphismus ' + (d.ok ? 'ok' : 'VERLETZT') + ' (min f\u2032 = ' + d.minFp.toFixed(3) + ')');
    saveSoon();
}

// ---------------- settings, kept on this device ----------------
const SAVE_KEY = 'raumkruemmung';
function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, x: st.x, y: st.y, z: st.z, R: st.R, mat: st.mat, E: st.E, grid: st.grid, ghost: st.ghost, lens: st.lens })); } catch (e) { /* no storage */ }
}
let saveTimer = 0;
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); }
function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { s = null; }
    if (!s || s.v !== 1) return false;
    if (MATERIALS.some(m => m.id === s.mat)) st.mat = s.mat;
    if (isFinite(s.R)) st.R = clamp(s.R, R_MIN, R_MAX);
    ['x', 'y', 'z'].forEach(k => { if (isFinite(s[k])) st[k] = s[k]; });
    if (isFinite(s.E) && s.E >= 0) st.E = s.E;
    ['grid', 'ghost', 'lens'].forEach(k => { if (typeof s[k] === 'boolean') st[k] = s[k]; });
    dbg('Einstellungen geladen');
    return true;
}

// ---------------- render loop ----------------
function frame() {
    requestAnimationFrame(frame);
    resize();
    layoutView(false);                     // cheap when nothing moved; follows the coach box gliding open or shut
    controls.update();
    placeHandles();
    // lensing: thetaE^2 = 2 r_s,vis / D_L = 4 uK / D_L (source at infinity), capped at an Einstein ring of about 14 degrees,
    // so the ring stays near the ball and a close camera does not turn the whole sky over
    const DL = camera.position.distanceTo(ball.position);
    starU.uLens.value.copy(ball.position);
    starU.uThetaE2.value = st.lens ? Math.min(4 * U.uK.value / Math.max(DL, 0.5), 0.06) : 0;
    starsSecondary.visible = st.lens && starU.uThetaE2.value > 0;
    renderer.render(scene, camera);
}

// ---------------- start ----------------
try {
    const had = load();
    if (!had || !(st.E > 0)) st.E = K_FIT / physics().delta;
    deriveK();
    buildRoom();
    finishRoom();
    buildStars();
    buildPanel();
    buildCoach();
    applyMaterial();
    U.uGridOn.value = st.grid ? 1 : 0;
    showGhost();
    changed();
    resize();
    layoutView(true);
    fitCamera();
    if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(container);
    requestAnimationFrame(frame);
    dbg('bereit');
} catch (e) {
    dbg('Start fehlgeschlagen: ' + e.message);
    throw e;
}

// debug and tests: probe() renders one frame and samples the drawing buffer (readPixels right after the draw)
window.Raumkruemmung = {
    st, warpPoint, radiusMap, checkDiffeo, physics, fitCamera,
    get camera() { return camera; }, get controls() { return controls; },
    set(o) {
        Object.assign(st, o);
        if ('k' in o) setK(o.k); else if ('mat' in o || 'R' in o) deriveK();
        applyMaterial(); showGhost(); U.uGridOn.value = st.grid ? 1 : 0;
        changed();
    },
    screenOfBall() { const p = toScreen(ball.position); const r = canvas.getBoundingClientRect(); return { x: r.left + p.x, y: r.top + p.y }; },
    screenOfHandle() { const a = toScreen(handleBase), b = toScreen(handleTip); const r = canvas.getBoundingClientRect(); return { x: r.left + (a.x + b.x) / 2, y: r.top + (a.y + b.y) / 2 }; },
    probe(n) {
        n = n || 24;
        resize();
        controls.update();
        renderer.render(scene, camera);
        const gl = renderer.getContext();
        const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(4);
        let lit = 0, sum = 0;
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
            gl.readPixels(Math.floor((i + 0.5) / n * w), Math.floor((j + 0.5) / n * h), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
            const s = px[0] + px[1] + px[2];
            sum += s;
            if (s > 60) lit++;
        }
        return { w, h, samples: n * n, lit, mean: sum / (n * n * 3) };
    },
};
