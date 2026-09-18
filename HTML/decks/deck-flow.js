// deck-flow.js - the title slide's background: glowing code flows through a canyon of dark stone blocks and
// pours down a cliff (Doc, 18.09.2026, rebuilt from a picture: "HG Folien first page").
// deck.js imports it in the beamer window only. It runs while the title slide is on screen and sleeps otherwise.
// Everywhere else (presenter previews, overview, no WebGL, offline) the slide wears the still picture
// img/flow-title.webp from deck.css - window.__deckFlow.shot() renders exactly that picture.
// jsDelivr's +esm builds resolve the addons' bare 'three' import themselves: deck pages carry no importmap.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js/+esm';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js/+esm';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js/+esm';
import { OutputPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/OutputPass.js/+esm';

// ------------------------------------------------------------------ world ---
// one cell = one block; the camera looks from +z (in front of the cliff) down to -z (the far end of the canyon)
const EDGE = 4;                         // z of the cliff: the plateau ends here and the stream falls
const BOTTOM = -44;                     // blocks reach down to here - the cliff shows them as tall pillars
const X0 = -40, X1 = 30, Z0 = -78;      // plateau cells: x in [X0, X1), z in [Z0, EDGE)
const GAP = 0.075;                      // dark slit between two blocks
const BG = new THREE.Color(0x03101c);   // night blue, never black (fog and sky)
const GREEN = new THREE.Color(0.30, 1.0, 0.52);
const PATH = new THREE.CatmullRomCurve3([
  [-9, -86], [-3, -66], [5, -52], [7, -40], [2, -30], [-3, -21], [-2, -13], [2, -6], [3.5, -1], [3.5, EDGE]
].map(p => new THREE.Vector3(p[0], 0, p[1])), false, 'centripetal');
const SAMPLES = 1024;
const LANES = 15;                       // parallel lines of text in the stream
const CHAR = 0.15;                      // distance between two characters on a line
const FALL = 30;                        // how far a line falls before it starts again at the far end

// the stream widens towards the cliff, like the picture
const halfWidth = s => 1.05 + 0.85 * THREE.MathUtils.smoothstep(s, 0.55, 1.0);

function rng(seed) {                    // mulberry32: every deck gets the same landscape, the poster matches
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise2(x, z) {                 // value noise for the block heights
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz), b = hash2(ix + 1, iz), c = hash2(ix, iz + 1), d = hash2(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// the path, sampled at equal arc length: position and direction per sample
function samplePath() {
  const pts = PATH.getSpacedPoints(SAMPLES - 1);
  const px = new Float32Array(SAMPLES), pz = new Float32Array(SAMPLES);
  const tx = new Float32Array(SAMPLES), tz = new Float32Array(SAMPLES);
  for (let i = 0; i < SAMPLES; i++) {
    px[i] = pts[i].x; pz[i] = pts[i].z;
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(SAMPLES - 1, i + 1)];
    const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1;
    tx[i] = dx / l; tz[i] = dz / l;
  }
  return { px, pz, tx, tz, length: PATH.getLength() };
}

function nearest(P, x, z) {             // distance to the path and where on it (0..1)
  let best = 1e9, bi = 0;
  for (let i = 0; i < SAMPLES; i += 2) {
    const d = (P.px[i] - x) ** 2 + (P.pz[i] - z) ** 2;
    if (d < best) { best = d; bi = i; }
  }
  return { d: Math.sqrt(best), s: bi / (SAMPLES - 1) };
}

// ----------------------------------------------------------------- blocks ---
const STONE_VS = /* glsl */`
attribute vec4 aEdge;                   // glowing seams on the top edges: +x, -x, +z, -z
attribute float aTone;
varying vec3 vPos; varying vec3 vN; varying vec3 vLocal; varying vec3 vScale;
varying vec4 vEdge; varying float vTone; varying float vDist;
void main() {
  mat4 m = modelMatrix * instanceMatrix;
  vec4 wp = m * vec4(position, 1.0);
  vPos = wp.xyz;
  vN = normalize(mat3(m) * normal);     // boxes stay axis-aligned: the scaled normal only needs its length back
  vLocal = position;
  vScale = vec3(length(m[0].xyz), length(m[1].xyz), length(m[2].xyz));
  vEdge = aEdge; vTone = aTone;
  vec4 mv = viewMatrix * wp;
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const STONE_FS = /* glsl */`
#define NL ${64}
uniform vec4 uL[NL];                    // the stream as light: xyz, strength
uniform vec3 uGreen; uniform vec3 uBg; uniform vec3 uMoonDir; uniform float uFog; uniform float uTime;
varying vec3 vPos; varying vec3 vN; varying vec3 vLocal; varying vec3 vScale;
varying vec4 vEdge; varying float vTone; varying float vDist;
float h3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float n3(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { return 0.55 * n3(p) + 0.28 * n3(p * 2.1) + 0.17 * n3(p * 4.3); }
void main() {
  vec3 N = normalize(vN);
  // rough stone: a bumpy normal from the noise's slope on screen (three's perturbNormalArb - one noise, not four),
  // pits darken the rock
  float f0 = fbm(vPos * 2.4);
  vec3 dpx = dFdx(vPos), dpy = dFdy(vPos);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det) * (dFdx(f0) * r1 + dFdy(f0) * r2);
  vec3 n = normalize(abs(det) * N - 0.16 * grad);
  float alb = (0.07 + 0.13 * f0) * vTone;
  vec3 stone = vec3(alb * 0.92, alb, alb * 1.04);
  // a worn bevel along the top edges catches the light: every block stands on its own
  vec3 fromEdge = (0.5 - abs(vLocal - vec3(0.0, 0.5, 0.0))) * vScale;
  float rim = N.y > 0.5 ? min(fromEdge.x, fromEdge.z) : fromEdge.y;
  float bevel = 1.0 + 1.6 * smoothstep(0.07, 0.0, rim);
  // moonlight from the far side, dimmer down in the chasm
  float depth = smoothstep(-16.0, 1.5, vPos.y);
  vec3 col = stone * (vec3(0.16, 0.2, 0.26) * max(dot(n, uMoonDir), 0.0) * depth * bevel + vec3(0.01, 0.014, 0.02));
  // the stream lights whatever faces it
  float acc = 0.0;
  for (int i = 0; i < NL; i++) {
    vec3 d = uL[i].xyz - vPos;
    float r2 = dot(d, d);
    if (r2 > 90.0) continue;             // beyond ~9.5 units a light adds < 1 %: skipping it halves the frame time
    acc += uL[i].w * max(dot(n, d * inversesqrt(r2)), 0.0) / (1.0 + r2 * 0.9);
  }
  col += stone * uGreen * acc * 1.8;
  // seams: thin glowing lines along some top edges (and just under them on the sides)
  float seam = 0.0;
  if (N.y > 0.5) {
    vec2 q = vLocal.xz; vec2 s = vScale.xz;
    seam = vEdge.x * smoothstep(0.035, 0.0, (0.5 - q.x) * s.x) + vEdge.y * smoothstep(0.035, 0.0, (q.x + 0.5) * s.x)
         + vEdge.z * smoothstep(0.035, 0.0, (0.5 - q.y) * s.y) + vEdge.w * smoothstep(0.035, 0.0, (q.y + 0.5) * s.y);
  } else {
    float top = (1.0 - vLocal.y) * vScale.y;
    float w = N.x > 0.5 ? vEdge.x : N.x < -0.5 ? vEdge.y : N.z > 0.5 ? vEdge.z : vEdge.w;
    seam = w * smoothstep(0.05, 0.0, top) + w * 0.18 * exp(-top * 1.4);
  }
  seam *= 0.75 + 0.25 * sin(uTime * 1.3 + vPos.x * 0.7 + vPos.z * 0.4);
  col += uGreen * seam * 1.5;
  float fog = 1.0 - exp(-pow(vDist * uFog, 2.0));
  gl_FragColor = vec4(mix(col, uBg, fog), 1.0);
}`;

function buildBlocks(P, R) {
  const cells = [];
  const add = (x, z, top, tone, edge) => cells.push({ x, z, top, tone, edge });
  const seams = (near) => {
    const e = [0, 0, 0, 0];
    if (R() < (near ? 0.2 : 0.045)) {
      const k = 1 + (R() < 0.35 ? 1 : 0);
      for (let j = 0; j < k; j++) e[Math.floor(R() * 4)] = 0.45 + 0.55 * R();
    }
    return e;
  };
  // the plateau, cut by the canyon
  for (let z = Z0; z < EDGE; z++) {
    for (let x = X0; x < X1; x++) {
      const cx = x + 0.5, cz = z + 0.5;
      const nr = nearest(P, cx, cz);
      const w = halfWidth(nr.s);
      if (nr.d < w) { add(cx, cz, 0, 0.3 + 0.1 * R(), [0, 0, 0, 0]); continue; }    // canyon floor, dark under the stream
      let top = 1.0 + 0.9 * noise2(cx * 0.19, cz * 0.19) + 0.35 * R();
      if (R() < 0.06) top -= 0.5;                                                    // a sunken block now and then
      if (nr.d < w + 1.2) top += 0.25 * R();                                         // ragged canyon walls
      add(cx, cz, top, 0.75 + 0.5 * R(), seams(nr.d < w + 3));
    }
  }
  // lower terraces left and right of the fall, stepping down towards the camera
  const end = { x: P.px[SAMPLES - 1] };
  for (let z = EDGE; z < EDGE + 12; z++) {
    for (let x = X0; x < X1; x++) {
      const cx = x + 0.5, cz = z + 0.5, dz = cz - EDGE;
      if (Math.abs(cx - end.x) < 2.6 + dz * 0.55) continue;                          // the slot the stream falls into
      const top = -2.2 - Math.floor(dz / 3) * 2.4 - 0.9 * R() - 0.8 * noise2(cx * 0.3, cz * 0.3);
      add(cx, cz, top, 0.75 + 0.5 * R(), seams(false));
    }
  }
  // front to back: the depth test then skips the hidden faces of the tall pillars instead of shading them all
  cells.sort((a, b) => b.z - a.z || Math.abs(a.x - 4) - Math.abs(b.x - 4));
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);             // y from 0 (bottom) to 1 (top)
  const mat = new THREE.ShaderMaterial({
    vertexShader: STONE_VS, fragmentShader: STONE_FS,
    uniforms: {
      uL: { value: Array.from({ length: 64 }, () => new THREE.Vector4()) },
      uGreen: { value: GREEN }, uBg: { value: BG },
      uMoonDir: { value: new THREE.Vector3(-0.35, 1.0, -0.55).normalize() },
      uFog: { value: 0.021 }, uTime: { value: 0 }
    }
  });
  const mesh = new THREE.InstancedMesh(geo, mat, cells.length);
  const edge = new Float32Array(cells.length * 4), tone = new Float32Array(cells.length);
  const m = new THREE.Matrix4();
  cells.forEach((c, i) => {
    m.makeScale(1 - GAP, c.top - BOTTOM, 1 - GAP).setPosition(c.x, BOTTOM, c.z);
    mesh.setMatrixAt(i, m);
    edge.set(c.edge, i * 4); tone[i] = c.tone;
  });
  geo.setAttribute('aEdge', new THREE.InstancedBufferAttribute(edge, 4));
  geo.setAttribute('aTone', new THREE.InstancedBufferAttribute(tone, 1));
  mesh.frustumCulled = false;
  return mesh;
}

// ----------------------------------------------------------------- stream ---
// characters small enough to read as dots, big enough to be code when you look closely
const GLYPHS = '01λφΥ∑π∫√Δαβθμ{}[]()<>=+-*/;:#&|%$!?01xyzifnrt01ABCDEF0123456789';

function glyphAtlas() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 44px Menlo, Consolas, monospace';
  for (let i = 0; i < 64; i++) g.fillText(GLYPHS[i % GLYPHS.length], (i % 8) * 64 + 32, Math.floor(i / 8) * 64 + 34);
  const t = new THREE.CanvasTexture(c);
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4;
  return t;
}

const CODE_VS = /* glsl */`
attribute vec3 aDir; attribute vec4 aInfo;     // glyph, brightness, flicker rate, fade
uniform float uPx; uniform float uTime; uniform vec2 uView;
varying float vGlyph; varying float vBright; varying float vAngle;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(${CHAR * 1.05} * uPx / -mv.z, 1.5, 64.0);
  vec4 b = projectionMatrix * modelViewMatrix * vec4(position + aDir * 0.1, 1.0);
  vec2 d = (b.xy / b.w - gl_Position.xy / gl_Position.w) * uView;
  vAngle = atan(d.y, d.x);                   // the line's direction on screen: characters sit on it
  vGlyph = mod(aInfo.x + floor(uTime * aInfo.z), 64.0);
  vBright = aInfo.y * aInfo.w;
}`;

const CODE_FS = /* glsl */`
uniform sampler2D uAtlas; uniform vec3 uGreen;
varying float vGlyph; varying float vBright; varying float vAngle;
void main() {
  if (vBright < 0.01) discard;
  vec2 p = vec2(gl_PointCoord.x - 0.5, 0.5 - gl_PointCoord.y);
  float c = cos(vAngle), s = sin(vAngle);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
  if (abs(q.x) > 0.5 || abs(q.y) > 0.5) discard;
  vec2 cell = vec2(mod(vGlyph, 8.0), 7.0 - floor(vGlyph / 8.0));
  float a = texture2D(uAtlas, (cell + q + 0.5) / 8.0).r;
  vec3 col = mix(uGreen, vec3(0.85, 1.0, 0.9), clamp(vBright - 1.0, 0.0, 1.0));
  gl_FragColor = vec4(col * a * vBright * 0.75, 1.0);
}`;

function buildStream(P, R) {
  // each lane is a ring of text (words and gaps) that runs down the canyon and then down the cliff
  const total = P.length + FALL;
  const slots = Math.floor(total / CHAR);
  const parts = [];
  for (let j = 0; j < LANES; j++) {
    const u = -1 + 2 * j / (LANES - 1);
    const speed = 1.5 * (0.88 + 0.24 * R());
    let k = Math.floor(R() * 6);
    while (k < slots) {
      const word = 2 + Math.floor(R() * 8);
      for (let c = 0; c < word && k < slots; c++, k++) {
        parts.push({ u: u, p0: k * CHAR, speed, glyph: Math.floor(R() * 64),
                     bright: c === word - 1 ? 1.6 : 0.35 + 0.55 * R(), flick: R() < 0.3 ? 2 + 6 * R() : 0 });
      }
      k += 1 + Math.floor(R() * 4);
    }
  }
  const n = parts.length;
  const pos = new Float32Array(n * 3), dir = new Float32Array(n * 3), info = new Float32Array(n * 4);
  parts.forEach((q, i) => { info[i * 4] = q.glyph; info[i * 4 + 1] = q.bright; info[i * 4 + 2] = q.flick; });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aDir', new THREE.BufferAttribute(dir, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aInfo', new THREE.BufferAttribute(info, 4).setUsage(THREE.DynamicDrawUsage));
  const mat = new THREE.ShaderMaterial({
    vertexShader: CODE_VS, fragmentShader: CODE_FS,
    uniforms: { uAtlas: { value: glyphAtlas() }, uGreen: { value: GREEN }, uPx: { value: 1000 },
                uTime: { value: 0 }, uView: { value: new THREE.Vector2(1, 1) } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const L = P.length, last = SAMPLES - 1;
  const ex = P.px[last], ez = P.pz[last], enx = -P.tz[last], enz = P.tx[last];
  const wEnd = halfWidth(1);
  function update(t) {
    for (let i = 0; i < n; i++) {
      const q = parts[i];
      const at = (q.p0 + t * q.speed) % total;
      let x, y, z, fade;
      if (at < L) {                                          // on the canyon floor, following the bends
        const f = at / L * last, i0 = Math.floor(f), i1 = Math.min(last, i0 + 1), a = f - i0;
        const cx = P.px[i0] + (P.px[i1] - P.px[i0]) * a, cz = P.pz[i0] + (P.pz[i1] - P.pz[i0]) * a;
        const tx = P.tx[i0], tz = P.tz[i0];
        const w = halfWidth(at / L) * q.u;
        x = cx - tz * w; z = cz + tx * w;
        y = 0.1 + 0.025 * Math.sin(at * 1.7 + q.u * 5 + t * 1.1);
        dir[i * 3] = tx; dir[i * 3 + 1] = 0; dir[i * 3 + 2] = tz;
        fade = Math.min(1, at / 12);                         // born in the fog far away
      } else {                                               // over the edge and down the cliff, faster and faster
        const f = at - L;
        x = ex + enx * wEnd * q.u; z = ez + enz * wEnd * q.u + 0.3 + 0.55 * (1 - Math.exp(-f * 1.6));
        y = 0.1 - f * (1 + f * 0.045);
        dir[i * 3] = 1; dir[i * 3 + 1] = 0; dir[i * 3 + 2] = 0;
        fade = Math.max(0, 1 - f / FALL) ** 1.5;
      }
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      info[i * 4 + 3] = fade;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aDir.needsUpdate = true;
    geo.attributes.aInfo.needsUpdate = true;
  }
  return { points, update };
}

// the stream as 64 lights for the stone: 44 along the canyon, 20 down the cliff
function streamLights(P, uL, t) {
  const last = SAMPLES - 1;
  for (let i = 0; i < 44; i++) {
    const k = Math.round((0.12 + 0.88 * i / 43) * last);
    uL[i].set(P.px[k], 0.45, P.pz[k], 0.9 * (0.85 + 0.15 * Math.sin(t * 2.3 + i * 1.7)));
  }
  for (let i = 0; i < 20; i++) {
    uL[44 + i].set(P.px[last], -0.6 - i * 1.25, P.pz[last] + 1.1, 0.85 * Math.exp(-i * 0.09) * (0.85 + 0.15 * Math.sin(t * 2.9 + i)));
  }
}

// ------------------------------------------------------------------ scene ---
// the landscape itself: plain data, no WebGL - it outlives any number of contexts
function buildScene() {
  const scene = new THREE.Scene();
  scene.background = BG;
  const R = rng(20260918);
  const P = samplePath();
  const blocks = buildBlocks(P, R);
  const stream = buildStream(P, R);
  scene.add(blocks, stream.points);
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.5, 220);
  return { scene, camera, P, blocks, stream };
}

// a WebGL context on one canvas, drawing the scene; release() hands the context back to the browser
function attach(canvas, S) {
  const { scene, camera, P, blocks, stream } = S;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance',
                                             preserveDrawingBuffer: false });
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const rt = new THREE.WebGLRenderTarget(16, 9, { type: THREE.HalfFloatType, samples: 2 });   // 4 cost 3 ms, the glow hides the difference
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(16, 9), 1.0, 0.5, 0.28);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const look = new THREE.Vector3();
  function size(w, h) {
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const u = stream.points.material.uniforms;
    u.uPx.value = h / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    u.uView.value.set(w, h);
  }
  function draw(t) {
    // a slow drift, as if hovering over the cliff
    camera.position.set(P.px[SAMPLES - 1] + 1.2 + 0.8 * Math.sin(t * 0.045), 15.5 + 0.5 * Math.sin(t * 0.031), EDGE + 15.5);
    look.set(P.px[SAMPLES - 1] - 1.0 + 0.4 * Math.sin(t * 0.037), -3.2, EDGE - 9);
    camera.lookAt(look);
    camera.filmOffset = -9;             // the stream sits right of the middle, the title has the left
    camera.updateProjectionMatrix();
    streamLights(P, blocks.material.uniforms.uL.value, t);
    blocks.material.uniforms.uTime.value = t;
    stream.points.material.uniforms.uTime.value = t;
    stream.update(t);
    composer.render();
  }
  function release() {
    try { bloom.dispose(); composer.dispose(); renderer.dispose(); renderer.forceContextLoss(); } catch (e) { }
  }
  return { renderer, size, draw, release };
}

// ------------------------------------------------------------------- slide ---
// Chrome keeps only about 16 WebGL contexts and takes the oldest away when a new one comes - with many decks, labs
// and 3D dice open, that was this one: black, the still picture of the start, then the scene back ("nach 2-3 min
// ein Break", Doc 18.09.2026). So a context exists only while the title slide is on screen and goes back 15 s
// after it left; one taken away anyway fades to the still picture and a fresh one continues at the same moment.
const RELEASE_MS = 15000;

export function start(slide) {
  const host = document.createElement('div');
  host.className = 'flow';
  host.setAttribute('aria-hidden', 'true');
  slide.insertBefore(host, slide.firstChild);
  const S = buildScene();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const log = [];                       // what happened to the context, for __deckFlow.log
  const note = what => { log.push(new Date().toLocaleTimeString('de-DE') + ' ' + what); if (log.length > 50) log.shift(); };
  let gl = null, canvas = null, raf = 0, last = 0, t = 30, w = 0, h = 0, idle = 0, retry = 0;
  function open() {
    if (gl) return true;
    const c = document.createElement('canvas');
    c.addEventListener('webglcontextlost', lost, false);
    host.appendChild(c);
    try { gl = attach(c, S); } catch (e) { c.remove(); note('no WebGL: ' + e.message); return false; }   // the still picture stays
    canvas = c; w = h = 0;
    note('context opened');
    return true;
  }
  function close() {
    stop();
    if (!gl) return;
    const c = canvas;
    gl.release(); gl = null; canvas = null;
    c.remove();
    note('context given back');
  }
  function lost(e) {
    if (e.target !== canvas) return;    // our own release, or an old canvas
    e.preventDefault();
    stop();
    const c = canvas;
    gl = null; canvas = null;
    c.classList.remove('on');           // fades out over the still picture instead of staying black
    setTimeout(function () { c.remove(); }, 900);
    note('context taken away by the browser');
    clearTimeout(retry);
    retry = setTimeout(wake, 1000);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function fit() {
    const r = slide.getBoundingClientRect();
    if (!r.width || !gl) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    const k = Math.min(1, 1920 / W);   // a soft background: full HD is plenty, also on a Retina or 4K screen
    W = Math.round(W * k); H = Math.round(H * k);
    if (W !== w || H !== h) { w = W; h = H; gl.size(w, h); }
    return true;
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    t += Math.min(0.05, (now - last) / 1000);
    last = now;
    gl.draw(t);
    canvas.classList.add('on');
  }
  function wake() {
    const on = slide.classList.contains('on') && !document.hidden;
    if (on) {
      clearTimeout(idle); idle = 0;
      if (raf) return;
      if (!open() || !fit()) return;
      if (still) { gl.draw(t); canvas.classList.add('on'); return; }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else {
      stop();
      if (gl && !idle) idle = setTimeout(function () { idle = 0; close(); }, RELEASE_MS);   // back within 15 s: still there
    }
  }
  new MutationObserver(wake).observe(slide, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', wake);
  addEventListener('resize', function () { if (raf || (still && gl)) { fit(); if (still) gl.draw(t); } });
  wake();
  // debug: __deckFlow.shot(1920, 1080) -> data URL (webp) of the scene at t, the still picture for deck.css;
  // __deckFlow.bench(n) -> ms per frame, GPU included (readPixels waits for it); __deckFlow.log -> the context's story
  window.__deckFlow = {
    log: log,
    shot: function (W, H, at) {
      if (!open()) return null;
      gl.size(W || 1920, H || 1080);
      gl.draw(at == null ? 30 : at);
      const url = canvas.toDataURL('image/webp', 0.86);
      w = h = 0;
      if (!fit()) wake();
      return url;
    },
    bench: function (n) {
      if (!open()) return -1;
      const c = gl.renderer.getContext();
      const px = new Uint8Array(4);
      n = n || 30; c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, px);
      const t0 = performance.now();
      for (let i = 0; i < n; i++) { gl.draw(t + i / 60); c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, px); }
      return +((performance.now() - t0) / n).toFixed(2);
    }
  };
  return window.__deckFlow;
}
