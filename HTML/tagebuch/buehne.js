/* ---------- buehne.js: Christmas Day in the gratitude book - the finale of the Christmas Oratorio as theatre ----------
   (Doc, 25.11.2026: "Können wir Weihnachten das Finale vom Weihnachtsoratorium spielen, so richtig mit Pomp und Theater?")
   On arrival a red velvet stage curtain hangs closed over the book - a valance of swags with gold fringe and tassels above,
   "Frohe Weihnachten" in gold on it and a quiet "Klick". The click (the gesture the sound needs) gathers the two halves to
   the sides on gold tiebacks, a warm spotlight falls on the middle, and as soon as the middle is clear the framed YouTube
   player of the oratorio fades in there and plays the closing chorale, no. 64 "Nun seid ihr wohl gerochen" with trumpets and
   drums. Gold stars and sparks fall, rays of a great Christmas star shine round the frame, a little gold firework now and then
   and a bigger one on the final chord. Everything follows the music's own clock (the player's time), so the presenter's
   window and the beamer's copy of a deck - which plays muted - keep together. When the music ends the stage stays open
   until a click (not on Bach or the drums, which still play and pause) or a page turn.
   Nothing ever lies over the video: the curtain is above the book only while it is closed; from the click on it sits below
   the player, like the light, the star and the sparks, and the drapes and the valance keep clear of the frame. Drawn from
   the time alone (slots seeded by their number and cycle): nothing piles up, the work per frame stays the same.
   Reduced motion: the curtain fades instead of moving, no rain, no firework, the light stands still.
   The curtain is drawn by a WebGL shader (velvet with folds, sheen, gold trim, fringe and tassels), with a plain 2D fallback.
   Loaded lazily (import()) on these two days only. Written for this book.
   API: createBuehne(host) -> { destroy(), place(), get state() }
        host.measure() lays the player's frame out (hidden or not) and returns its outer rect {l, t, r, b} in CSS px
        host.frame()   the same rect as last laid out (cheap, every frame)
        host.prepare() the click came: start loading the player's script
        host.play()    shows the framed player and plays (called once the middle is clear)
        host.time()    { t: the video's time in s or -1, st: the YouTube player state or -1 }
        host.art(on)   Bach and the drums shown (true) or hidden while the curtain is closed
        host.leave()   the stage goes (after the music, a click): the player goes with it
        host.done()    the stage has gone
        host.spec      { s, e, fin } start, end and the final chord of the piece in the video (s)
        host.reduced   prefers-reduced-motion */

const TAU = Math.PI * 2;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const smooth = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const easeIO = u => u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
/* a stateless hash of three integers to 0..1 */
function hash(a, b, c) {
  let h = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul((b | 0) + 0x165667b1, 0x85ebca77) ^ Math.imul((c | 0) + 0x61c88647, 0xc2b2ae3d);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}
const OPEN_DUR = 3.2;   /* s: the curtain gathering to the sides */

/* ---------- the curtain shader ---------- */
const VS = 'attribute vec2 a; varying vec2 vP; void main() { vP = vec2(a.x * .5 + .5, .5 - a.y * .5); gl_Position = vec4(a, 0., 1.); }';
const FS = `
precision highp float;
varying vec2 vP;
uniform vec2 uRes;                    /* canvas, device px */
uniform float uPx, uTime, uOpen, uSide, uTieY, uLift, uLiftY, uValH, uValOff, uSwags, uFade, uTie;
#define PI 3.14159265
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
/* velvet: dark in the light's face, bright along the turning edges (its pile catches the light at a grazing angle) */
vec3 velvet(vec3 N, float ao, float grain) {
  vec3 L = normalize(vec3(-.28, -.55, .8));
  float dif = max(dot(N, L), 0.);
  float rim = pow(1. - clamp(N.z, 0., 1.), 1.7);
  vec3 c = vec3(.30, .012, .03) * (.16 + 1.4 * dif) + vec3(.60, .10, .11) * rim * (.3 + .7 * dif);
  return c * ao * (.88 + .24 * grain);
}
vec3 gold(float s) {
  vec3 c = mix(vec3(.30, .17, .04), vec3(.80, .57, .20), smoothstep(0., .62, s));
  return mix(c, vec3(1., .91, .60), smoothstep(.62, 1., s));
}
/* a gold strand pattern (fringe): s across, 0..1 */
float strands(float x, float w) { float f = fract(x / w); return smoothstep(.5, .15, abs(f - .5)); }
/* the inner edge of a drape at height y, measured from its outer side */
float edgeAt(float y, float W, float H) {
  float yT = uTieY, s = uSide, eo;
  if (y < yT) eo = s * (1. - .42 * smoothstep(0., yT, y));
  else eo = s * (.58 + .62 * pow(clamp((y - yT) / max(1., H - yT), 0., 1.), 1.4));
  return mix(W * .5 + 2. * uPx, eo, uOpen);
}
/* one drape (the left; the right is mirrored with sg = -1) - premultiplied colour */
vec4 drape(float x, float y, float W, float H, float sg) {
  float e = edgeAt(y, W, H);
  float hem = max(10. * uPx, .026 * H), fr = hem * .6;
  vec4 o = vec4(0.);
  float u0 = clamp(x / max(e, 1.), 0., 1.);
  float u = u0 + .035 * sin(u0 * 13.7 + 1.3) + .025 * sin(u0 * 29.1 + 4.1);   /* folds of uneven width */
  float c = clamp(1. - e / (W * .5), 0., 1.);                /* how far it is gathered */
  float tw = exp(-pow((y - uTieY) / (.08 * H), 2.)) * c * uTie;
  float ph = 2. * PI * (u * 7. + .25) + .9 * vnoise(vec2(u * 3., y / H * 2.)) + .22 * sin(uTime * .7 + y / H * 3. + u * 5.) + tw * 1.6 * sin(u * 23.);
  /* the hem (lifted on a narrow screen) follows the folds a little */
  float yb = mix(H + 4. * uPx, uLiftY, uLift * uOpen) + cos(ph) * 3. * uPx;
  if (x > e) {                                                /* its shadow on the stage */
    float sw = .035 * W;
    float a = .55 * pow(clamp(1. - (x - e) / sw, 0., 1.), 2.) * smoothstep(0., .15, uOpen) * step(y, yb);
    return vec4(0., 0., 0., a);
  }
  if (y > yb) return o;
  float depth = .6 + .75 * hash(vec2(floor(u * 7. + .25), 3.1));   /* each fold as deep as it likes */
  float A = mix(.55, 1.3, c) * depth * (1. + .25 * (1. - smoothstep(0., .3 * H, y)));
  float slope = cos(ph) * A + 1.2 * smoothstep(.93, 1., u0);
  float ny = tw * .7 * sin((y - uTieY) / (.011 * H) + u * 6.);
  vec3 N = normalize(vec3(slope * sg, ny, 1.));
  float ao = mix(.22, 1., pow(.5 + .5 * sin(ph), .7));
  ao *= .7 + .3 * smoothstep(uValH * .8, uValH * 1.7, y - uValOff);   /* in the valance's shade */
  /* the house light falls on the middle: the outer parts and the foot lie darker */
  float gx = sg > 0. ? x : W - x;
  ao *= .5 + .62 * exp(-pow((gx / W - .5) * 1.8, 2.) - pow((y / H - .38) * 1.6, 2.));
  float grain = .55 * vnoise(gl_FragCoord.xy * .8) + .45 * vnoise(vec2(x * .02, y * .0016) / uPx);
  vec3 col = velvet(N, ao, grain);
  /* the gold rope along the inner edge */
  float tr = max(3. * uPx, .0042 * W), d = e - x;
  if (d < tr) { float k = d / tr, pat = fract((y + d * 1.7) / (6. * uPx));
    col = gold((.35 + .55 * sin(pat * PI)) * (.45 + .55 * sin(k * PI))); }
  /* the hem: a gold braid, then the fringe */
  if (y > yb - hem) {
    float yy = y - (yb - hem);
    if (yy < hem - fr) col = gold(.4 + .45 * abs(sin((x + yy * 1.4) / (4. * uPx))) * (.55 + .45 * sin(yy / (hem - fr) * PI)));
    else { float len = fr * (.78 + .22 * hash(vec2(floor(x / (3. * uPx)), 7.)));
      float a = strands(x, 3. * uPx) * step(yy - (hem - fr), len);
      return vec4(gold(.35 + .5 * strands(x + 1., 3. * uPx)) * a, a); }
  }
  /* the tieback: a gold cord round the drape and a tassel at its inner edge */
  float cw = .011 * H, ty = uTieY;
  float tieA = smoothstep(.72, .98, uOpen) * uTie;
  if (tieA > 0. && abs(y - ty) < cw * .5) {
    float k = (y - ty) / (cw * .5);
    col = mix(col, gold((.5 + .5 * sin((x * .8 + y * 2.4) / (2. * uPx))) * sqrt(1. - k * k)), tieA);
  }
  return vec4(col, 1.);
}
/* the tassel hanging from a tieback (left drape coordinates) */
vec4 tassel(float x, float y, float cx, float cy, float s) {
  vec2 q = vec2((x - cx) / (s * .55), (y - cy) / (s * .9));
  float r = length(q);
  if (r < 1.) { float sh = sqrt(1. - r * r) * (.6 + .4 * (-q.x * .5 - q.y * .5 + .5)); return vec4(gold(sh), 1.); }
  float y0 = cy + s * .7, y1 = cy + s * 3.;
  if (y > y0 && y < y1) { float k = (y - y0) / (y1 - y0), w = s * (.45 + .55 * k);
    if (abs(x - cx) < w) { float a = strands(x - cx, 2.2 * uPx) * (1. - smoothstep(.92, 1., k) * hash(vec2(floor(x / (2.2 * uPx)), 3.)));
      return vec4(gold(.3 + .6 * (1. - abs(x - cx) / w)) * a, a); } }
  return vec4(0.);
}
/* the valance: a pelmet with a gold border, swags with folds that follow their curve, fringe, tassels between */
vec4 valance(float x, float y, float W) {
  float Hv = uValH; y -= uValOff;
  if (Hv < 1. || y > Hv * 1.25 || y < 0.) return vec4(0.);
  float top = Hv * .3, grain = vnoise(gl_FragCoord.xy * .8);
  float nS = uSwags, sw = W / nS, i = floor(x / sw), q = (x - (i + .5) * sw) / (sw * .5);
  /* the tassels at the joins (over everything) */
  float jx = floor(x / sw + .5) * sw;
  vec4 ts = tassel(x, y, jx, top + Hv * .32, Hv * .09);
  if (ts.a > 0. && jx > 1. && jx < W - 1.) return ts;
  if (y < top) {
    vec3 c = velvet(normalize(vec3(0., (y / top - .5) * .6, 1.)), .85, grain);
    if (y > top - Hv * .075) c = gold(.45 + .4 * sin(x / (5. * uPx)) * sin((y - top) / (Hv * .075) * PI + 1.));
    return vec4(c, 1.);
  }
  float ys = top + Hv * .62 * pow(max(0., 1. - q * q), .55);
  if (y < ys) {
    float v = (y - top) / max(1., ys - top), ph = v * 4.5 * 2. * PI + q * .8;
    vec3 N = normalize(vec3(q * .35 * sin(ph), cos(ph) * .9, 1.));
    float ao = mix(.5, 1., pow(.5 + .5 * sin(ph), .5)) * (.78 + .22 * (1. - abs(q)));
    return vec4(velvet(N, ao, grain), 1.);
  }
  float bw = Hv * .035;
  if (y < ys + bw) return vec4(gold(.4 + .5 * abs(sin((x - y) / (3. * uPx)))), 1.);
  float len = Hv * .13 * (.8 + .2 * hash(vec2(floor(x / (3. * uPx)), 5.)));
  float a = strands(x, 3. * uPx) * step(y - ys - bw, len);
  return vec4(gold(.35 + .5 * strands(x + 1., 3. * uPx)) * a, a);
}
void main() {
  float W = uRes.x, H = uRes.y, x = vP.x * W, y = vP.y * H;
  vec4 l = drape(x, y, W, H, 1.), r = drape(W - x, y, W, H, -1.);
  vec4 col = r + l * (1. - r.a);
  if (x < W * .5) col = l + r * (1. - l.a);
  if (uTie > 0. && uOpen > .72) {                             /* the tassels on the tiebacks */
    float s = .022 * H, ta = smoothstep(.72, .98, uOpen);
    float ex = edgeAt(uTieY, W, H) - s * .4;
    vec4 t1 = tassel(x, y, ex, uTieY + s * .9, s), t2 = tassel(W - x, y, ex, uTieY + s * .9, s);
    vec4 t = (t1 + t2 * (1. - t1.a)) * ta;
    col = t + col * (1. - t.a);
  }
  vec4 v = valance(x, y, W);
  col = v + col * (1. - v.a);
  gl_FragColor = col * uFade;
}`;

function makeGL(cv) {
  let gl = null;
  try { gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' }); } catch (e) { }
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('buehne shader:', gl.getShaderInfoLog(s)); return null; } return s; };
  const v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
  if (!v || !f) return null;
  const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ['uRes', 'uPx', 'uTime', 'uOpen', 'uSide', 'uTieY', 'uLift', 'uLiftY', 'uValH', 'uValOff', 'uSwags', 'uFade', 'uTie'].forEach(n => { U[n] = gl.getUniformLocation(p, n); });
  return { gl, U, prog: p, buf: b };
}

/* the plain fallback without WebGL: two gradient drapes with folds and the valance as a band */
function draw2D(c, W, H, g) {
  c.clearRect(0, 0, W, H);
  c.globalAlpha = g.fade;
  for (const sg of [1, -1]) {
    c.save(); if (sg < 0) { c.translate(W, 0); c.scale(-1, 1); }
    const e = W * .5 + (g.side - W * .5) * g.open, yb = H + (g.liftY - H) * g.lift * g.open;
    const gr = c.createLinearGradient(0, 0, e, 0), n = 7;
    for (let i = 0; i <= n * 2; i++) gr.addColorStop(i / (n * 2), i % 2 ? '#3d0408' : '#8e1018');
    c.fillStyle = gr; c.fillRect(0, 0, e, yb);
    c.fillStyle = '#c99a3a'; c.fillRect(e - 3, 0, 3, yb); c.fillRect(0, yb - 8, e, 8);
    c.restore();
  }
  if (g.valH > 1) { c.fillStyle = '#6a0a10'; c.fillRect(0, g.valOff, W, g.valH); c.fillStyle = '#c99a3a'; c.fillRect(0, g.valOff + g.valH - 5, W, 5); }
  c.globalAlpha = 1;
}

/* small gold sprites for the fx canvas: a soft glow and a four-pointed sparkle */
function sprite(size, draw) { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); return c; }
const GLOW = () => sprite(64, (c, s) => { const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,246,214,1)'); g.addColorStop(.25, 'rgba(255,212,120,.55)'); g.addColorStop(1, 'rgba(255,180,60,0)'); c.fillStyle = g; c.fillRect(0, 0, s, s); });
const SPARKLE = () => sprite(96, (c, s) => {
  const m = s / 2; c.translate(m, m);
  const g = c.createRadialGradient(0, 0, 0, 0, 0, m * .45); g.addColorStop(0, 'rgba(255,248,220,1)'); g.addColorStop(1, 'rgba(255,200,90,0)');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, m * .45, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,232,160,.95)';
  for (const [l, w] of [[m, m * .085], [m * .55, m * .06]]) for (let k = 0; k < 4; k++) {
    c.save(); c.rotate(k * Math.PI / 2 + (l < m ? Math.PI / 4 : 0)); c.beginPath(); c.moveTo(0, -w); c.lineTo(l, 0); c.lineTo(0, w); c.closePath(); c.fill(); c.restore(); }
});
const STAR5 = () => sprite(80, (c, s) => {
  const m = s / 2; c.translate(m, m); c.beginPath();
  for (let k = 0; k < 10; k++) { const r = k % 2 ? m * .36 : m * .86, a = -Math.PI / 2 + k * Math.PI / 5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  c.closePath(); const g = c.createLinearGradient(-m, -m, m, m); g.addColorStop(0, '#fff2c0'); g.addColorStop(.45, '#f5c242'); g.addColorStop(1, '#a8741c');
  c.fillStyle = g; c.shadowColor = 'rgba(255,210,110,.9)'; c.shadowBlur = m * .3; c.fill();
});

export function createBuehne(host) {
  const reduced = !!host.reduced, spec = host.spec, fin = (spec.fin || spec.e || spec.s) - spec.s;
  /* the stage: curtain (WebGL), title and hint; above the book while closed */
  const stage = document.createElement('div'); stage.className = 'wo wo-stage closed';
  stage.setAttribute('role', 'button'); stage.setAttribute('aria-label', 'Frohe Weihnachten – Klick: Vorhang auf');
  const cv = document.createElement('canvas'); cv.className = 'wo-curtain'; stage.appendChild(cv);
  const words = document.createElement('div'); words.className = 'wo-xwords'; stage.appendChild(words);
  const title = document.createElement('div'); title.className = 'wo-xmas'; title.textContent = 'Frohe Weihnachten'; words.appendChild(title);
  const hint = document.createElement('div'); hint.className = 'wo-xhint';
  hint.textContent = matchMedia('(pointer: coarse)').matches ? 'Tippen' : 'Klick'; words.appendChild(hint);
  /* light, star and sparks: below the player, above the curtain */
  const fx = document.createElement('canvas'); fx.className = 'wo wo-fx';
  document.body.appendChild(stage); document.body.appendChild(fx);
  const ctx = fx.getContext('2d');
  const G = makeGL(cv), c2 = G ? null : cv.getContext('2d');
  const glow = GLOW(), sparkle = SPARKLE(), star5 = STAR5();
  let W = 0, H = 0, dpr = 1, gdpr = 1, geo = null, raf = 0, dead = false;
  let state = 'closed', t0 = performance.now(), tOpen = -1, played = false, tLeave = -1, nFrame = 0;
  /* the music's clock: the player's time, carried on between its updates */
  let mLast = -1, mWall = 0, mVal = -1, mPlaying = false;

  /* geometry from the frame: how far the drapes go aside, where the tiebacks sit, the valance's height */
  function place() {
    dpr = Math.min(2, window.devicePixelRatio || 1); gdpr = Math.min(1.5, dpr);
    W = innerWidth; H = innerHeight;
    fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr); fx.style.width = W + 'px'; fx.style.height = H + 'px';
    cv.width = Math.round(W * gdpr); cv.height = Math.round(H * gdpr); cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const f = host.measure() || { l: W * .2, t: H * .2, r: W * .8, b: H * .75 }, m = 6;
    /* the drapes at most a fifth of the width each and never into the frame (their foot flares to 1.2 x) */
    let side = Math.min(W * .19, (f.l - m) / 1.2), lift = 0, liftY = H;
    if (side < W * .07) { side = Math.max(W * .1, side); lift = 1; liftY = Math.max(H * .06, f.t - m - H * .02); }   /* too narrow: the curtain flies up */
    const tieY = clamp(f.t + (f.b - f.t) * .45, H * .35, H * .7);
    /* the valance as high as the room above the frame allows (its fringe included), on a big screen a seventh */
    let valH = Math.min(H * .15, (f.t - 10) / 1.25);
    let valOff = 0;
    if (valH < H * .06) { valH = H * .07; valOff = -1; }   /* no room: it rises out of sight as the curtain opens */
    const swags = clamp(Math.round(W / (valH * 2.9)), 3, 9);
    geo = { f, side, lift, liftY, tieY, valH, valOff, swags };
  }

  function curtainOpen(now) {
    if (state === 'closed') return 0;
    if (reduced) return 0;   /* reduced motion: it fades instead */
    return easeIO((now - tOpen) / 1000 / OPEN_DUR);
  }
  function drawCurtain(now, fade) {
    const p = curtainOpen(now), g = geo, s = gdpr;
    const valOff = g.valOff < 0 ? -g.valH * 1.3 * p : 0;
    if (G) {
      const { gl, U } = G;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uPx, s);
      gl.uniform1f(U.uTime, reduced ? 0 : (now - t0) / 1000); gl.uniform1f(U.uOpen, p);
      gl.uniform1f(U.uSide, g.side * s); gl.uniform1f(U.uTieY, g.tieY * s); gl.uniform1f(U.uLift, g.lift);
      gl.uniform1f(U.uLiftY, g.liftY * s); gl.uniform1f(U.uValH, g.valH * s); gl.uniform1f(U.uValOff, valOff * s);
      gl.uniform1f(U.uSwags, g.swags); gl.uniform1f(U.uFade, fade); gl.uniform1f(U.uTie, g.lift ? 0 : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      c2.setTransform(s, 0, 0, s, 0, 0);
      draw2D(c2, W, H, { open: p, side: g.side, lift: g.lift, liftY: g.liftY, valH: g.valH, valOff, fade });
    }
    return p;
  }
  /* is the frame clear of the drapes at this opening? (then the player may show) */
  function clearAt(p) {
    const g = geo, f = g.f, m = 4;
    if (g.lift) return H + (g.liftY - H) * p <= f.t - m && (g.valOff < 0 || g.valH * 1.25 <= f.t - m);
    return W * .5 + (g.side * 1.2 - W * .5) * p <= f.l - m;
  }

  /* the music's time in s from the piece's start (-1 before it plays) */
  function music(now) {
    const tm = host.time();
    if (tm.t >= 0 && tm.t !== mLast) { mLast = tm.t; mWall = now; }
    mPlaying = tm.st === 1;
    if (mLast < 0) return -1;
    mVal = mLast - spec.s + (mPlaying ? Math.min(.6, (now - mWall) / 1000) : 0);
    return mVal;
  }

  /* ---- the effects (fx canvas), all from the time ---- */
  function spot(c, a, f) {
    if (a <= 0) return;
    const cx = (f.l + f.r) / 2, cy = (f.t + f.b) / 2, rx = (f.r - f.l) * .78, ry = (f.b - f.t) * .9;
    c.fillStyle = 'rgba(8, 4, 2, ' + (.58 * a).toFixed(3) + ')'; c.fillRect(0, 0, W, H);
    c.save(); c.globalCompositeOperation = 'destination-out';
    c.translate(cx, cy); c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, rx * .35, 0, 0, rx * 1.15); g.addColorStop(0, 'rgba(0,0,0,' + (.9 * a) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx * 1.15, 0, TAU); c.fill(); c.restore();
    /* the cone of light from above */
    c.save(); c.globalCompositeOperation = 'lighter';
    const w0 = W * .025, w1 = (f.r - f.l) * .62, lg = c.createLinearGradient(0, 0, 0, f.b);
    lg.addColorStop(0, 'rgba(255, 226, 160, ' + (.16 * a) + ')'); lg.addColorStop(1, 'rgba(255, 210, 130, ' + (.03 * a) + ')');
    c.fillStyle = lg; c.beginPath(); c.moveTo(cx - w0, 0); c.lineTo(cx + w0, 0); c.lineTo(cx + w1, f.b + 30); c.lineTo(cx - w1, f.b + 30); c.closePath(); c.fill();
    c.restore();
  }
  /* the great star behind the frame: its rays come out round the frame */
  function rays(c, a, f, rot) {
    if (a <= 0) return;
    const cx = (f.l + f.r) / 2, cy = (f.t + f.b) / 2, R0 = Math.hypot(f.r - f.l, f.b - f.t) * .38, R1 = R0 * (1.55 + .25 * a);
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(cx, cy); c.rotate(rot);
    const g = c.createRadialGradient(0, 0, R0 * .5, 0, 0, R1);
    g.addColorStop(0, 'rgba(255, 236, 180, ' + (.5 * a) + ')'); g.addColorStop(.55, 'rgba(255, 200, 100, ' + (.22 * a) + ')'); g.addColorStop(1, 'rgba(255, 180, 60, 0)');
    c.fillStyle = g;
    const n = 32;
    for (let k = 0; k < n; k++) {
      const an = k / n * TAU, len = k % 4 === 0 ? 1 : k % 2 === 0 ? .82 : .66, hw = (k % 4 === 0 ? .045 : .028);
      c.beginPath(); c.moveTo(Math.cos(an - hw) * R0 * .5, Math.sin(an - hw) * R0 * .5);
      c.lineTo(Math.cos(an) * R1 * len, Math.sin(an) * R1 * len); c.lineTo(Math.cos(an + hw) * R0 * .5, Math.sin(an + hw) * R0 * .5); c.closePath(); c.fill();
    }
    c.restore();
  }
  /* a slot layer: slot i starts after d, repeats with period P; each cycle k gets its own values from the hash */
  function slots(n, P, t, seed, fn) {
    for (let i = 0; i < n; i++) {
      const Pi = P * (.75 + .5 * hash(seed, i, 1)), d = hash(seed, i, 2) * Pi, q = t - d;
      if (q < 0) continue;
      const k = Math.floor(q / Pi); fn(i, k, (q - k * Pi) / Pi, Pi);
    }
  }
  function rain(c, t, amount, u) {
    if (amount <= 0) return;
    c.save(); c.globalCompositeOperation = 'lighter';
    const nStar = Math.round(clamp(W * H / 26000, 18, 60)), nSpark = nStar * 2;
    slots(nStar, 9, t, 11, (i, k, a) => {
      if (hash(i, k, 3) > amount) return;
      const x = hash(i, k, 4) * W + Math.sin(a * TAU * (1 + hash(i, k, 5)) + i) * W * .02, y = -40 + a * (H + 80);
      const s = (10 + 22 * Math.pow(hash(i, k, 6), 2)) * u, tw = .55 + .45 * Math.sin(t * (2 + 3 * hash(i, k, 7)) + i);
      const al = Math.min(1, a * 8, (1 - a) * 6) * tw;
      c.globalAlpha = al; c.save(); c.translate(x, y); c.rotate(a * TAU * (hash(i, k, 8) - .5) * 2);
      const img = hash(i, k, 9) < .35 ? star5 : sparkle; c.drawImage(img, -s / 2, -s / 2, s, s); c.restore();
    });
    slots(nSpark, 5, t, 23, (i, k, a) => {
      if (hash(i, k, 3) > amount) return;
      const x = hash(i, k, 4) * W + Math.sin(a * 9 + i) * 6 * u, y = -10 + a * (H + 20), s = (4 + 7 * hash(i, k, 6)) * u;
      c.globalAlpha = Math.min(1, a * 10, (1 - a) * 5) * (.5 + .5 * Math.sin(t * 13 + i * 1.7));
      c.drawImage(glow, x - s / 2, y - s / 2, s, s);
    });
    c.restore(); c.globalAlpha = 1;
  }
  /* a gold firework burst at (x, y), its age a in s, size r */
  function burst(c, x, y, a, r, seed, big) {
    if (a < 0 || a > 3.2) return;
    const n = big ? 64 : 40, g = r * .55;
    c.save(); c.globalCompositeOperation = 'lighter';
    if (a < .18) { c.globalAlpha = 1 - a / .18; const s = r * (big ? 1.2 : .8); c.drawImage(glow, x - s / 2, y - s / 2, s, s); }
    for (let j = 0; j < n; j++) {
      const an = j / n * TAU + hash(seed, j, 1) * .2, sp = r * (.75 + .25 * hash(seed, j, 2));
      for (let tr = 0; tr < 4; tr++) {
        const aa = Math.max(0, a - tr * .07), dist = sp * (1 - Math.exp(-aa * 2.6)), px = x + Math.cos(an) * dist, py = y + Math.sin(an) * dist + g * aa * aa * .5;
        const al = clamp(1 - a / 3, 0, 1) * (1 - tr * .24) * (a > 1.6 ? .55 + .45 * Math.sin(a * 30 + j) : 1), s = (big ? 7 : 5) * (1 - tr * .18);
        c.globalAlpha = al; c.drawImage(glow, px - s / 2, py - s / 2, s, s);
      }
    }
    c.restore(); c.globalAlpha = 1;
  }
  /* the bursts: small ones now and then during the chorale, a bouquet on the final chord - placed beside the frame */
  const SMALL = [21, 47, 74, 101, 127, 151], BIG = [0, .35, .7, 1.05, 1.5, 2.1, 2.8];
  function fireworks(c, m, f, u) {
    const L = f.l, R = W - f.r, sideOK = Math.max(L, R) > 90 * u;
    const at = (j, big) => {
      const h1 = hash(j, big ? 9 : 4, 1), h2 = hash(j, big ? 9 : 4, 2), left = j % 2 === 0;
      if (sideOK) {
        const room = left ? L : R, x = left ? room * (.25 + .5 * h1) : f.r + room * (.25 + .5 * h1);
        return [x, H * (.14 + .45 * h2), Math.min(room * .45, H * .18) * (big ? 1.2 : .8)];
      }
      return [W * (.2 + .6 * h1), Math.max(30, f.t * (.35 + .3 * h2)), Math.max(30, Math.min(f.t * .5, W * .18)) * (big ? 1.1 : .75)];
    };
    SMALL.forEach((ts, j) => { if (ts < fin - 4) { const [x, y, r] = at(j, false); burst(c, x, y, m - ts, r, 100 + j, false); } });
    BIG.forEach((ts, j) => { const [x, y, r] = at(j, true); burst(c, x, y, m - fin - ts, r, 200 + j, true); });
  }
  /* how strong things are at music time m (none before it plays) */
  function level(m) {
    if (m < 0) return { rain: 0, rays: 0 };
    const inn = smooth(0, 4, m), peak = m >= fin ? Math.exp(-(m - fin) / 4) : 0;
    return { rain: Math.min(1, .3 * inn + .1 * Math.sin(m * .21) * inn + .7 * peak), rays: .55 * inn + .45 * peak };
  }

  function frame(now) {
    raf = 0;
    if (dead) return;
    if (document.hidden) return;   /* paused in a tab in the background (visibilitychange below) */
    const tw = (now - t0) / 1000;
    /* the curtain */
    let fade = state === 'closed' ? Math.min(1, tw / .6) : 1;
    if (reduced && state !== 'closed') fade = Math.max(0, 1 - (now - tOpen) / 700);
    if (state === 'leaving') fade = Math.max(0, 1 - (now - tLeave) / 1000);
    /* the drapes hanging at the sides only sway a little: drawn every third frame then (the canvas keeps its picture) */
    const still = (state === 'open' || state === 'after') && (reduced || fade <= 0 || now - tOpen > OPEN_DUR * 1000 + 100);
    const p = still && (nFrame++ % 3) ? 1 : drawCurtain(now, fade);
    if (state === 'opening' && (reduced ? now - tOpen > 500 : p >= 1)) { state = 'open'; host.art(true); stage.classList.remove('moving'); }
    if (!played && state !== 'closed' && (reduced ? now - tOpen > 350 : clearAt(p))) { played = true; host.play(); }
    /* the light and the rest */
    const c = ctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    if (state !== 'closed') {
      const f = host.frame() || geo.f, u = clamp(Math.min(W, H) / 800, .55, 1.4);
      if (reduced && fade <= 0 && cv.style.display !== 'none') cv.style.display = 'none';
      let m = music(now);
      const tm = host.time();
      if (state === 'open' && played && (tm.st === 0 || (m >= 0 && spec.e && m >= spec.e - spec.s - .2))) state = 'after';
      if (state === 'after' && tm.st === 1 && m < spec.e - spec.s - 1) state = 'open';   /* played again (Bach / the drums) */
      const out = state === 'leaving' ? Math.max(0, 1 - (now - tLeave) / 1000) : 1;
      const sp = (reduced ? 1 : smooth(0, 1.4, (now - tOpen) / 1000)) * out;
      c.globalAlpha = 1;
      spot(c, sp, f);
      const lv = level(m), calm = state === 'after' ? .12 : 0;
      rays(c, Math.max(lv.rays, state === 'after' ? .35 : 0) * out, f, reduced ? 0 : tw * .025);
      if (!reduced) {
        rain(c, tw, Math.max(lv.rain, calm) * out, u);
        if (m >= 0 && out > 0) { c.globalAlpha = out; fireworks(c, m, f, u); c.globalAlpha = 1; }
      }
      if (state === 'leaving' && out <= 0) { destroy(); host.done(); return; }
    }
    raf = requestAnimationFrame(frame);
  }
  function onVis() { if (!dead && !raf && !document.hidden) raf = requestAnimationFrame(frame); }
  document.addEventListener('visibilitychange', onVis);
  function onResize() { place(); }
  window.addEventListener('resize', onResize);

  /* the click on the curtain opens it (a click alone counts too: the deck replays the presenter's clicks as clicks) */
  function open(e) {
    if (state !== 'closed') return;
    if (e) { e.preventDefault(); e.stopPropagation(); }
    place();
    state = 'opening'; tOpen = performance.now();
    stage.classList.remove('closed'); stage.classList.add('moving');
    if (host.prepare) host.prepare();
  }
  stage.addEventListener('click', open);
  stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(e); });
  stage.tabIndex = 0;
  /* after the music: the next click (not on Bach or the drums) takes the stage away */
  function onDown(e) {
    if (state !== 'after') return;
    if (e.target && e.target.closest && e.target.closest('.wo')) return;
    state = 'leaving'; tLeave = performance.now();
    if (host.leave) host.leave();
  }
  document.addEventListener('pointerdown', onDown, true);
  document.addEventListener('click', onDown, true);

  function destroy() {
    if (dead) return; dead = true;
    cancelAnimationFrame(raf); raf = 0;
    document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize);
    document.removeEventListener('pointerdown', onDown, true); document.removeEventListener('click', onDown, true);
    if (G) { try { G.gl.deleteBuffer(G.buf); G.gl.deleteProgram(G.prog); const x = G.gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } catch (e) { } }
    stage.remove(); fx.remove();
  }

  place();
  host.art(false);
  requestAnimationFrame(() => stage.classList.add('on'));
  fx.classList.add('on');
  raf = requestAnimationFrame(frame);
  return { destroy, place, get state() { return state; } };
}
