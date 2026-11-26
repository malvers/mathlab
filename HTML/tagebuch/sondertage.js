/* ---------- sondertage.js: the fixed special days of the gratitude book, whatever the weekday ----------
   Dec 31: a big firework over the open book (Doc, 25.11.2026: "ein tierisches Feuerwerk. Endless, bis man klickt.") -
   rockets with sparkling tails, peonies (bouquets), chrysanthemums, palms, crossettes, rings, strobes, double shells,
   hearts, gold rain (willow, kamuro) and afterglow (embers, crackle, lit smoke), each block of 36 s with a little finale.
   Oct 31 special: two matches - two giant matches come up, strike each other with a spray of sparks, flare and burn with
   two flames that lean together and merge into one; the heads char, the wood blackens below them, fine smoke rises and
   "it's a match" is written in the book's script. It burns on, flickering, until a click.
   Loaded lazily (import()) on these two days only. Everything is computed from the time since the start t, seeded by the
   date: the presenter's window and the beamer's copy of a deck land on the same picture, and nothing piles up - the work
   per frame stays the same for minutes. Silent.
   API: sondertagFor('2026-12-31') -> 'fireworks' | 'match' | ''
        createSondertag(kind, { box, seed, quality, veil }) -> scene, or null for an unknown kind
        scene.draw(ctx, t, alpha)  ctx: the 2D canvas, already scaled to CSS px; t: seconds since the start;
                                   alpha: 0..1 (the host's fade when leaving)
        scene.resize(box)          box = { x, y, w, h, W, H }: the book in CSS px within the canvas of W x H CSS px
        scene.destroy()
   quality: 'auto' (default) or 0 (phone) | 1 | 2 (desktop); it steps down by itself when frames take too long.
   Third-party code: the simplex noise in the flame shader is webgl-noise by Ian McEwan (Ashima Arts) and Stefan
   Gustavson, MIT license (notice below, next to the code). Everything else is written for this book. */

const TAU = Math.PI * 2;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const smooth = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const mix = (a, b, k) => a + (b - a) * k;
/* a seeded generator (mulberry32) and a stateless hash of three integers to 0..1 */
function rng(seed) {
  let a = seed | 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hash(a, b, c) {
  let h = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul((b | 0) + 0x165667b1, 0x85ebca77) ^ Math.imul((c | 0) + 0x61c88647, 0xc2b2ae3d);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}
const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
/* slot i of a recurring element at time t: period P, start delay d -> { k: the cycle, a: age in it, u: a / P } or null before
   it starts; every cycle takes its values from hash(seed, i, k) - the same in every copy, nothing piles up */
const slot = (t, P, d) => { const q = t - d; if (q < 0) return null; const k = Math.floor(q / P); return { k, a: q - k * P, u: (q - k * P) / P }; };
/* a soft round sprite (snow, glow) */
function softDot(rgb, size = 48, core = .25) {
  const c = canvas(size, size), x = c.getContext('2d'), r = size / 2, g = x.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0, `rgba(${rgb},1)`); g.addColorStop(core, `rgba(${rgb},.85)`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  return c;
}
/* gentle snow over the whole canvas: n flakes in three depths, each falling, swaying and drifting; endless by slots */
function snowfall(seed, n, opt = {}) {
  const spr = softDot('255,255,255', 48, .35), speed = opt.speed || 1, tint = opt.alpha == null ? .9 : opt.alpha;
  return (ctx, t, B, A, u) => {
    const W = B.W, H = B.H;
    for (let i = 0; i < n; i++) {
      const z = hash(seed, 400, i), P = (9 + 9 * (1 - z)) / speed, s = slot(t, P, -hash(seed, 401, i) * P);
      const h1 = hash(seed + s.k, 402, i), h2 = hash(seed + s.k, 403, i);
      const y = -20 + s.u * (H + 40), x = h1 * W + Math.sin(t * (.4 + h2 * .5) + i) * (12 + 18 * z) * u + s.u * 40 * u * (h2 - .3);
      const d = (1.2 + 3.4 * z) * u + 1;
      ctx.globalAlpha = A * tint * (.3 + .55 * z) * Math.min(1, s.u * 12, (1 - s.u) * 12);
      ctx.drawImage(spr, x - d, y - d, 2 * d, 2 * d);
    }
    ctx.globalAlpha = 1;
  };
}

const KINDS = { '10-31': 'match', '12-31': 'fireworks' };
/** which special day a date is: 'fireworks' (Dec 31), 'match' (Oct 31) or '' */
/** shared helpers for the scene modules in sondertage/ */
export const util = { TAU, clamp, smooth, mix, rng, hash, canvas, slot, softDot, snowfall, glowSprite: (rgb, size) => glowSprite(rgb, size), governor: q => governor(q) };

export function sondertagFor(iso) {
  const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso || '');
  return m ? KINDS[m[2] + '-' + m[3]] || '' : '';
}

/* the scenes of the other special days, one small module each in sondertage/ - only the day's own is loaded. The keys are
   the ones of the book's day list (sonderKey in index.html), the music hangs on the same keys */
const SCENES = ['neujahr', 'fruehling', 'sommer', 'herbst', 'winter', 'pi', 'mai', 'einheit', 'martin', 'nikolaus', 'heiligabend', 'stephanstag'];
const ALIAS = { silvester: 'fireworks', streichhoelzer: 'match' };

/** a scene for a special day: the key of the day list (or 'fireworks' / 'match'). opts.layer: only a small extra layer
    (a day that falls on a Sunday of Advent keeps the wreath) - for 'nikolaus' and 'heiligabend' */
export function createSondertag(kind, opts = {}) {
  kind = ALIAS[kind] || kind;
  const box = opts.box || { x: 0, y: 0, w: 800, h: 560, W: 800, H: 560 };
  const seed = (opts.seed == null ? 20261231 : opts.seed) >>> 0;
  const q = opts.quality == null || opts.quality === 'auto' ? autoQuality() : clamp(opts.quality | 0, 0, 2);
  if (kind === 'fireworks') return fireworksScene(box, seed, q, opts);
  if (kind === 'match') return matchScene(box, seed, q, opts);
  if (!SCENES.includes(kind)) return null;
  /* the clock runs from the call; until the scene's module is there, nothing is drawn - every copy lands on the same moment */
  let real = null, B = box, dead = false;
  import(new URL('./sondertage/' + kind + '.js', import.meta.url).href)
    .then(m => { if (!dead) real = m.create({ box: B, seed, quality: q, layer: !!opts.layer, veil: opts.veil }); })
    .catch(e => console.warn('sondertage:', kind, e && e.message));
  return {
    kind,
    draw(ctx, t, alpha) { if (real) real.draw(ctx, t, alpha); },
    resize(b) { B = b; if (real) real.resize(b); },
    destroy() { dead = true; if (real) real.destroy(); real = null; },
    get quality() { return real && real.quality != null ? real.quality : q; }
  };
}

/* a first guess from the device; the governor steps down from there when frames run long */
function autoQuality() {
  let coarse = false;
  try { coarse = matchMedia('(pointer: coarse)').matches; } catch (e) { }
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  if (coarse) return cores >= 8 && mem >= 4 ? 1 : 0;
  return cores >= 8 ? 2 : 1;
}
/* frame-time governor: when the average frame takes longer than 24 ms for about 2.5 s, one quality step down (never up,
   so it cannot swing) */
function governor(q0) {
  let q = q0, last = 0, ema = 16.7, slow = 0;
  return {
    get q() { return q; },
    tick(now) {
      if (last) {
        const dt = Math.min(100, now - last);
        ema += (dt - ema) * .05;
        if (ema > 24 && q > 0) { slow += dt; if (slow > 2500) { q--; slow = 0; ema = 16.7; } } else slow = Math.max(0, slow - dt);
      }
      last = now;
    }
  };
}

/* =====================================================================================================================
   Dec 31: the firework
   Shells are planned in blocks of BLOCK seconds from a generator seeded by the date and the block (opening, singles,
   mirrored pairs, fans, quick chains, then a finale salvo and a crown of gold rain). Every star flies on a closed-form
   path with drag and gravity, so its place at any age - and its trail, a few samples back along the same path - comes
   straight from the time. Units: S = the book's scale in px (its width, at most 1.45 times its height); speeds in S per
   second, so a resize or a phone simply scales the picture (on a phone held upright a little larger than the page).
   ===================================================================================================================== */
const FW_COLS = [[255, 70, 56], [80, 255, 128], [96, 146, 255], [200, 104, 255], [255, 192, 88], [238, 244, 255],
  [255, 150, 50], [100, 234, 255], [255, 128, 200], [255, 112, 40], [255, 214, 150]].map(c => c.join(','));
const RED = 0, GOLD = 4, SILVER = 5, PINK = 8, EMBER = 9, KAMURO = 10;
const BRIGHT = [0, 1, 2, 3, 6, 7, 8];
const TYPES = ['peony', 'chrys', 'palm', 'crossette', 'willow', 'ring', 'strobe', 'double', 'kamuro', 'heart'];
const TYPE_W = [16, 15, 9, 10, 9, 8, 8, 11, 6, 3];
const TYPE_R = { palm: 1.15, willow: 1.12, kamuro: 1.15, heart: .9, ring: 1, strobe: .95 };

/* star offset (in S) at age a since it started: linear drag k, gravity g (S/s^2, downwards), a little wind */
function offs(st, k, g, a, wind, out) {
  const e = Math.exp(-k * a), f = (1 - e) / k;
  out[0] = st.ox + st.vx * f + wind * (a + st.t0);
  out[1] = st.oy + st.vy * f + (g / k) * (a - f);
}

function glowSprite(rgb, size = 64) {
  const c = canvas(size, size), x = c.getContext('2d'), r = size / 2, g = x.createRadialGradient(r, r, 0, r, r, r);
  const [R, G, B] = rgb.split(',').map(Number), w = (v, k) => Math.round(v + (255 - v) * k);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(.12, `rgba(${w(R, .7)},${w(G, .7)},${w(B, .7)},1)`);
  g.addColorStop(.28, `rgba(${rgb},.72)`);
  g.addColorStop(.55, `rgba(${rgb},.16)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  return c;
}
/* a lumpy cloud of smoke: a few soft blobs, the same for every shell */
function smokeSprite(seed) {
  const S = 128, c = canvas(S, S), x = c.getContext('2d'), r = rng(seed ^ 0x5eed);
  for (let i = 0; i < 9; i++) {
    const cx = S * (.3 + r() * .4), cy = S * (.3 + r() * .4), rad = S * (.16 + r() * .2), g = x.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, 'rgba(128,124,146,.42)'); g.addColorStop(1, 'rgba(128,124,146,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
  }
  return c;
}

function fireworksScene(box, seed, q0, opts) {
  let B = box;
  const gov = governor(q0), BLOCK = 36, blocks = new Map();
  const sprites = FW_COLS.map(c => glowSprite(c)), smokeSpr = smokeSprite(seed);
  const veilMax = opts.veil == null ? .8 : opts.veil;
  const tmp = [0, 0];
  let buf = new Float32Array(8192);

  const pickType = r => { let s = r() * TYPE_W.reduce((a, b) => a + b, 0), i = 0; while ((s -= TYPE_W[i]) > 0 && i < TYPES.length - 1) i++; return TYPES[i]; };
  const pickCol = (r, type) => {
    if (type === 'willow' || type === 'palm') return GOLD;
    if (type === 'kamuro') return KAMURO;
    if (type === 'strobe') return SILVER;
    if (type === 'heart') return r() < .5 ? RED : PINK;
    const v = r();
    return v < .14 ? GOLD : v < .26 ? SILVER : BRIGHT[Math.floor(r() * BRIGHT.length)];
  };

  /* the plan of block b: [{ tl (launch time), type, fx, fy (burst point in parts of the book), lx (launch x), Tf (flight
     time), R (radius in S), c0, c1 (colour change or -1), wind, seed }] */
  function plan(b) {
    const r = rng((seed ^ Math.imul(b + 11, 0x9E3779B1)) >>> 0), T0 = b * BLOCK, out = [], wind = (r() - .5) * .03;
    const shell = (tl, type, fx, fy, ex = {}) => {
      const c0 = ex.c0 != null ? ex.c0 : pickCol(r, type);
      let c1 = -1;
      if ((type === 'peony' || type === 'chrys' || type === 'ring' || type === 'double') && r() < .45) { c1 = BRIGHT[Math.floor(r() * BRIGHT.length)]; if (c1 === c0) c1 = SILVER; }
      if (type === 'double') c1 = c1 >= 0 ? c1 : SILVER;
      const sh = { tl, type, fx, fy, lx: clamp(fx + (r() - .5) * .12, .04, .96), Tf: 1.05 + r() * .4 + (.45 - fy) * .5,
        R: (.16 + .1 * r()) * (TYPE_R[type] || 1) * (ex.scale || 1), c0, c1, wind, seed: (r() * 4294967296) >>> 0 };
      out.push(sh);
      return sh;
    };
    let t = T0 + (b ? 2.4 : 1.1);
    if (b === 0) {
      /* the opening: a fan of three, then the gold rain behind them */
      const c = BRIGHT[Math.floor(r() * BRIGHT.length)];
      shell(t, 'peony', .24, .32, { c0: c }); shell(t + .08, 'peony', .5, .24, { c0: SILVER }); shell(t + .16, 'peony', .76, .32, { c0: c });
      shell(t + 1.5, 'willow', .5, .2); t += 4.4;
    }
    const end = T0 + BLOCK - 8.6;
    while (t < end) {
      const e = r();
      if (e < .56) shell(t, pickType(r), .14 + r() * .72, .13 + r() * .33);
      else if (e < .8) {
        const type = pickType(r), d = .14 + r() * .22, fy = .16 + r() * .26, a = shell(t, type, .5 - d, fy);
        shell(t, type, .5 + d, fy, { c0: a.c0 });
      } else if (e < .92) {
        const type = r() < .5 ? 'peony' : 'chrys', c = pickCol(r, type);
        [.22, .5, .78].forEach((fx, i) => shell(t + i * .12, type, fx, i === 1 ? .2 : .3, { c0: c }));
      } else {
        const n = 3 + Math.floor(r() * 2);
        for (let i = 0; i < n; i++) shell(t + i * .22, 'peony', .2 + .6 * i / (n - 1), .3 + (r() - .5) * .1, { scale: .7 });
      }
      t += .85 + r() * 1.55;
    }
    /* the finale: a quick salvo, then a crown of gold rain over the whole book and a quiet moment while it falls */
    t = T0 + BLOCK - 7.8;
    const fin = ['peony', 'chrys', 'crossette', 'strobe', 'ring', 'double', 'palm'];
    for (let i = 0; i < 12; i++) { shell(t, fin[Math.floor(r() * fin.length)], .12 + r() * .76, .12 + r() * .34); t += .16 + r() * .24; }
    t = Math.max(t, T0 + BLOCK - 3.3);
    [.2, .5, .8].forEach((fx, i) => shell(t + i * .07, 'kamuro', fx, .15 + r() * .08));
    return out;
  }
  const block = b => { let p = blocks.get(b); if (!p) { p = plan(b); blocks.set(b, p); } return p; };

  /* the stars of a shell, made once at its burst (quality at that moment) */
  function build(sh) {
    const r = rng(sh.seed), q = gov.q, R = sh.R, gs = [], N = a => a[q];
    const star = (vx, vy, ox = 0, oy = 0, t0 = 0) => ({ vx, vy, ox, oy, t0, lj: .86 + r() * .28, ph: r() });
    const sphere = (n, sp, jit = .08) => {
      const out = [], rot = r() * TAU;
      for (let i = 0; i < n; i++) {
        const z = 1 - 2 * (i + .5) / n, rr = Math.sqrt(1 - z * z), ph = i * 2.399963 + rot, s = sp * (1 - jit * r());
        out.push(star(Math.cos(ph) * rr * s, Math.sin(ph) * rr * s));
      }
      return out;
    };
    const G = o => Object.assign({ c0: sh.c0, c1: -1, tc: .55, life: 1.6, k: 1.8, g: .17, trail: .1, segs: 1, lw: 1.3, core: 1,
      glitter: 0, gl: .5, gdrop: .11, tfall: 1, strobe: 0, ember: .25, crackle: false, pop: false, inten: 1 }, o);
    switch (sh.type) {
      case 'peony': { const k = 1.9; gs.push(G({ stars: sphere(N([46, 72, 104]), R * k * 1.08), k, c1: sh.c1, life: 1.55 })); break; }
      case 'chrys': {
        const k = 1.6;
        gs.push(G({ stars: sphere(N([40, 62, 90]), R * k * 1.05), k, c1: sh.c1, life: 1.8, trail: .34, segs: 3, lw: 1.1, core: .8,
          glitter: [0, .075, .05][q], ember: .35, crackle: r() < .4 }));
        break;
      }
      case 'palm': {
        const k = .95, n = N([7, 9, 11]), sp = R * k * 1.5, rot = r() * TAU, st = [];
        for (let i = 0; i < n; i++) { const an = rot + i * TAU / n + (r() - .5) * .3, s = sp * (.9 + r() * .15); st.push(star(Math.cos(an) * s, Math.sin(an) * s - sp * .22)); }
        gs.push(G({ stars: st, k, g: .24, life: 2.5, trail: .8, segs: N([3, 4, 6]), lw: 3.4, core: 1.6, glitter: [.09, .05, .03][q], ember: 1.1, c0: GOLD }));
        break;
      }
      case 'crossette': {
        const k = 1.3, n = N([8, 11, 14]), sp = R * k * .85, rot = r() * TAU, par = [], kids = [], ts = .55;
        for (let i = 0; i < n; i++) {
          const an = rot + i * TAU / n + (r() - .5) * .25, s = sp * (.92 + r() * .14), p = star(Math.cos(an) * s, Math.sin(an) * s);
          p.lj = 1; par.push(p);
          offs(p, k, .17, ts, 0, tmp);
          const e = Math.exp(-k * ts), vx = p.vx * e, vy = p.vy * e + (.17 / k) * (1 - e), base = Math.atan2(vy, vx);
          for (let m = 0; m < 4; m++) { const am = base + Math.PI / 4 + m * Math.PI / 2, cs = R * 1.15; kids.push(star(vx * .35 + Math.cos(am) * cs, vy * .35 + Math.sin(am) * cs, tmp[0], tmp[1], ts)); }
        }
        gs.push(G({ stars: par, k, life: ts, trail: .22, segs: 2, lw: 1.7, core: 1.1, ember: 0, glitter: q ? .06 : 0, pop: true }));
        gs.push(G({ stars: kids, k: 1.9, life: .9, trail: .2, segs: 2, lw: 1.2, core: .85, ember: .2, crackle: q > 0 }));
        break;
      }
      case 'willow': {
        const k = 2.7;
        gs.push(G({ stars: sphere(N([40, 58, 82]), R * k), k, g: .27, life: 4, trail: 3, segs: N([6, 8, 10]), tfall: .55, lw: 1.05, core: .65,
          glitter: [.11, .065, .045][q], gl: .95, gdrop: .05, ember: 1.5, c0: GOLD, inten: .85 }));
        break;
      }
      case 'kamuro': {
        const k = 2.4;
        gs.push(G({ stars: sphere(N([48, 70, 98]), R * k * 1.05), k, g: .25, life: 3.2, trail: 1.05, segs: N([3, 4, 6]), tfall: .75, lw: 1.25, core: .85,
          glitter: [.08, .05, .035][q], gl: .7, gdrop: .07, ember: 1.2, c0: KAMURO, crackle: true }));
        break;
      }
      case 'ring': {
        const k = 1.8, n = N([28, 40, 54]), sp = R * k * 1.05, al = r() * TAU, be = .25 + r() * 1.1, st = [];
        for (let i = 0; i < n; i++) {
          const th = i * TAU / n, x = Math.cos(th), y = Math.sin(th) * Math.cos(be);
          st.push(star((x * Math.cos(al) - y * Math.sin(al)) * sp, (x * Math.sin(al) + y * Math.cos(al)) * sp));
        }
        gs.push(G({ stars: st, k, life: 1.7, trail: .12, c1: sh.c1 }));
        gs.push(G({ stars: sphere(N([8, 12, 16]), sp * .3), k, life: 1.2, c0: SILVER, core: .8 }));
        break;
      }
      case 'strobe': { const k = 1.7; gs.push(G({ stars: sphere(N([36, 56, 80]), R * k), k, life: 2.4, trail: .05, c0: SILVER, strobe: 8 + r() * 4, ember: 0, core: .9 })); break; }
      case 'double': {
        const k = 1.7;
        gs.push(G({ stars: sphere(N([36, 54, 78]), R * k * 1.05), k, life: 1.8, trail: .3, segs: 3, lw: 1.1, core: .8, glitter: [0, .08, .055][q], ember: .3 }));
        gs.push(G({ stars: sphere(N([18, 26, 36]), R * k * .48), k, life: 1.4, c0: sh.c1, core: .9 }));
        break;
      }
      case 'heart': {
        const k = 1.8, n = N([30, 42, 56]), sp = R * k, sq = .55 + r() * .45, st = [];
        for (let i = 0; i < n; i++) {
          const th = i * TAU / n, x = 16 * Math.pow(Math.sin(th), 3) / 17, y = -(13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th)) / 17;
          st.push(star(x * sp * sq, y * sp));
        }
        gs.push(G({ stars: st, k, life: 1.9, trail: .1 }));
        break;
      }
    }
    sh.end = 0;
    for (const g of gs) {
      let t0 = 0;
      for (const s of g.stars) t0 = Math.max(t0, s.t0);
      g.br = new Float32Array(g.stars.length); g.cb = new Uint8Array(g.stars.length);
      sh.end = Math.max(sh.end, t0 + g.life * 1.15 + g.ember + g.trail + (g.crackle ? .7 : 0) + .1);
    }
    return gs;
  }

  function drawRocket(ctx, sh, age, bx, by, S, u, A) {
    const x0 = B.x + sh.lx * B.w, y0 = B.H + 12, Tf = sh.Tf, wob = sh.seed % 10;
    const P = (tt, out) => {
      const v = clamp(tt / Tf, 0, 1), e = 1 - Math.pow(1 - v, 2.2);
      out[0] = x0 + (bx - x0) * e + Math.sin(v * 11 + wob) * 2 * u * (1 - v); out[1] = y0 + (by - y0) * e;
    };
    const palm = sh.type === 'palm', step = palm ? .011 : .02, life = palm ? .55 : .32, sz = (palm ? 2.4 : 1.6) * Math.max(.7, u);
    ctx.beginPath();
    for (let j = Math.max(0, Math.ceil((age - life) / step)); j * step <= age; j++) {
      const te = j * step, da = age - te, h = hash(sh.seed, 99, j), h2 = hash(sh.seed, 98, j);
      P(te, tmp);
      ctx.rect(tmp[0] + (h - .5) * .045 * S * da, tmp[1] + .32 * S * da * da + (h2 - .5) * .01 * S, sz * (1 - da / life * .5), sz * (1 - da / life * .5));
    }
    ctx.fillStyle = `rgba(255,206,130,${.85 * A})`; ctx.fill();
    P(age, tmp);
    const d = (palm ? 22 : 14) * u + 4;
    ctx.globalAlpha = A; ctx.drawImage(sprites[GOLD], tmp[0] - d / 2, tmp[1] - d / 2, d, d); ctx.globalAlpha = 1;
  }

  function drawGroup(ctx, sh, g, a, bx, by, S, u, A) {
    const n = g.stars.length, segs = g.segs, ns = segs + 1, dts = g.trail / segs, br = g.br, cb = g.cb;
    if (buf.length < n * ns * 2) buf = new Float32Array(n * ns * 4);
    const sum = [0, 0, 0], cnt = [0, 0, 0];
    let any = false;
    for (let i = 0; i < n; i++) {
      const st = g.stars[i], aa = a - st.t0, L = g.life * st.lj;
      let b = 0, c = 0;
      if (aa >= 0) {
        b = Math.min(1, aa / .05);
        if (aa > L) {
          const e = g.ember ? (aa - L) / g.ember : 1;
          if (e >= 1) b = 0; else { b *= .5 * (1 - e) * (.65 + .35 * Math.sin(aa * 31 + st.ph * 40)); c = 2; }
        } else {
          if (aa > .7 * L) b *= 1 - .5 * (aa - .7 * L) / (.3 * L);
          if (g.c1 >= 0 && aa > g.tc * L) c = 1;
          if (g.strobe && aa > .2 * L && ((aa * g.strobe + st.ph) % 1) > .45) b *= .06;
        }
      }
      b *= g.inten; br[i] = b; cb[i] = c;
      if (b > 0) {
        any = true; sum[c] += b; cnt[c]++;
        for (let j = 0; j < ns; j++) {
          offs(st, g.k, g.g, Math.max(0, aa - j * dts), sh.wind, tmp);
          const o = (i * ns + j) * 2; buf[o] = bx + tmp[0] * S; buf[o + 1] = by + tmp[1] * S;
        }
      }
    }
    if (!any) return;
    const col = [g.c0, g.c1 >= 0 ? g.c1 : g.c0, EMBER];
    /* trails: one stroke per colour and segment, fading back along the path */
    ctx.lineCap = 'round';
    for (let c = 0; c < 3; c++) {
      if (!cnt[c]) continue;
      const avg = sum[c] / cnt[c];
      const js = c === 2 ? Math.min(segs, 2) : segs;
      for (let j = 0; j < js; j++) {
        ctx.beginPath();
        for (let i = 0; i < n; i++) if (br[i] > 0 && cb[i] === c) { const o = (i * ns + j) * 2; ctx.moveTo(buf[o], buf[o + 1]); ctx.lineTo(buf[o + 2], buf[o + 3]); }
        ctx.strokeStyle = `rgba(${FW_COLS[col[c]]},${(.62 * (1 - g.tfall * j / segs) * A * avg * (c === 2 ? .4 : 1)).toFixed(3)})`;
        ctx.lineWidth = g.lw * u * (1 - .55 * j / segs) + .5;
        ctx.stroke();
      }
    }
    /* glitter: tiny sparks shed along the path, twinkling as they drop */
    if (g.glitter) {
      const D = g.glitter, sl = g.gl, pb = new Path2D(), pd = new Path2D(), sz = Math.max(1, 1.5 * u);
      for (let i = 0; i < n; i++) {
        if (br[i] <= 0 || cb[i] === 2) continue;
        const st = g.stars[i], aa = a - st.t0, L = g.life * st.lj, j1 = Math.floor(Math.min(aa, L) / D);
        for (let j = Math.max(0, Math.ceil((aa - sl) / D)); j <= j1; j++) {
          const te = j * D, da = aa - te, h = hash(sh.seed, i, j), h2 = hash(sh.seed ^ 77, i, j);
          offs(st, g.k, g.g, te, sh.wind, tmp);
          const x = bx + (tmp[0] + (h - .5) * .014 + sh.wind * da) * S, y = by + (tmp[1] + g.gdrop * da * da + (h2 - .5) * .01) * S;
          (((da * 13 + h * 7) % 1) < .5 ? pb : pd).rect(x, y, sz, sz);
        }
      }
      ctx.fillStyle = `rgba(255,236,190,${.9 * A})`; ctx.fill(pb);
      ctx.fillStyle = `rgba(255,190,120,${.35 * A})`; ctx.fill(pd);
    }
    /* the stars themselves */
    for (let i = 0; i < n; i++) {
      if (br[i] <= 0) continue;
      const o = i * ns * 2, d = (g.core * 15 * u + 3) * (cb[i] === 2 ? .6 : 1);
      ctx.globalAlpha = Math.min(1, br[i] * A);
      ctx.drawImage(sprites[col[cb[i]]], buf[o] - d / 2, buf[o + 1] - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
    /* a pop where a crossette star splits, crackle where the gold rain ends */
    if (g.pop || g.crackle) {
      for (let i = 0; i < n; i++) {
        const st = g.stars[i], L = g.life * st.lj, aa = a - st.t0;
        if (aa < L || aa > L + .75) continue;
        const m0 = g.pop ? 0 : 1, m1 = g.crackle ? 4 : 1;
        for (let m = m0; m < m1; m++) {
          const h = hash(sh.seed + 7, i, m), tp = m ? L + .05 + h * .6 : L, da = aa - tp;
          if (da < 0 || da > .07) continue;
          offs(st, g.k, g.g, L, sh.wind, tmp);
          const x = bx + (tmp[0] + (m ? (hash(sh.seed, i, m + 9) - .5) * .03 : 0)) * S, y = by + (tmp[1] + (m ? (hash(sh.seed, i, m + 19) - .5) * .03 : 0)) * S;
          const d = (m ? 10 : 18) * u + 3;
          ctx.globalAlpha = (1 - da / .07) * A; ctx.drawImage(sprites[SILVER], x - d / 2, y - d / 2, d, d);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawShell(ctx, sh, t, S, u, A) {
    const age = t - sh.tl, bx = B.x + sh.fx * B.w, by = B.y + sh.fy * B.h;
    if (age < sh.Tf) { drawRocket(ctx, sh, age, bx, by, S, u, A); return; }
    const a = age - sh.Tf;
    if (!sh.groups) sh.groups = build(sh);
    if (a > sh.end) return;
    /* the sky lights up, and a white flash at the burst */
    if (a < .8) {
      const k = 1 - a / .8, R = sh.R * S * 3.2, gr = ctx.createRadialGradient(bx, by, 0, bx, by, R), c = FW_COLS[sh.groups[0].c0];
      gr.addColorStop(0, `rgba(${c},${(.22 * k * k * A).toFixed(3)})`); gr.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = gr; ctx.fillRect(bx - R, by - R, 2 * R, 2 * R);
    }
    if (a < .16) { const d = sh.R * S * .55 * (1 - a / .16) + 6; ctx.globalAlpha = A; ctx.drawImage(sprites[SILVER], bx - d / 2, by - d / 2, d, d); ctx.globalAlpha = 1; }
    for (const g of sh.groups) drawGroup(ctx, sh, g, a, bx, by, S, u, A);
  }

  function draw(ctx, t, alpha) {
    gov.tick(performance.now());
    const W = B.W, H = B.H, S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000, A = clamp(alpha == null ? 1 : alpha, 0, 1);
    const b1 = Math.floor(t / BLOCK), b0 = Math.max(0, Math.floor((t - 16) / BLOCK));
    for (const k of blocks.keys()) if (k < b0) blocks.delete(k);
    const live = [];
    for (let b = b0; b <= b1; b++) for (const sh of block(b)) if (t >= sh.tl && t < sh.tl + sh.Tf + 12) live.push(sh);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* night falls over the book */
    const v = veilMax * A * smooth(0, 1.4, t);
    if (v > 0) {
      const gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, `rgba(3,5,20,${v.toFixed(3)})`); gr.addColorStop(1, `rgba(8,9,26,${(v * .84).toFixed(3)})`);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    }
    /* smoke of the bursts drifts in the wind and hangs on */
    for (const sh of live) {
      const a = t - sh.tl - sh.Tf;
      if (a < 0 || a > 11) continue;
      const x = B.x + sh.fx * B.w + sh.wind * a * S * .8, y = B.y + sh.fy * B.h - .006 * a * S, r = sh.R * S * (.75 + .09 * a);
      ctx.globalAlpha = .1 * A * smooth(0, .5, a) * (1 - a / 11) * (gov.q ? 1 : .7);
      ctx.drawImage(smokeSpr, x - r, y - r, 2 * r, 2 * r);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    for (const sh of live) drawShell(ctx, sh, t, S, u, A);
    ctx.restore();
  }

  return { kind: 'fireworks', draw, resize(b) { B = b; }, destroy() { blocks.clear(); }, get quality() { return gov.q; } };
}

/* =====================================================================================================================
   Oct 31 special: two matches
   The matches are drawn on the 2D canvas (procedural wood grain, a textured head, charring, a glowing burn line); the
   flames and the smoke are a fragment shader (WebGL) rendered into a small canvas around the flames and laid onto the
   2D canvas: two teardrop temperature fields, bent and eaten away by rising, domain-warped simplex noise, coloured
   like hot soot (deep red, orange, yellow, a pale core) over a blue base, with filaments of smoke above. As the two
   flames merge, their tips lean to the middle and join into one taller flame. Without WebGL a simple 2D flame stands in.
   ===================================================================================================================== */
const FLAME_VS = 'attribute vec2 a; uniform vec2 uRes; varying vec2 vP;\n' +
  'void main() { vP = (a * 0.5 + 0.5) * uRes; vP.y = uRes.y - vP.y; gl_Position = vec4(a, 0.0, 1.0); }';

/* webgl-noise, src/noise3D.glsl - Description: array and textureless GLSL 2D/3D/4D simplex noise functions.
   Author: Ian McEwan, Ashima Arts. Maintainer: stegu. https://github.com/ashima/webgl-noise, https://github.com/stegu/webgl-noise
   Copyright (C) 2011 by Ashima Arts (Simplex noise); Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others)
   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
   documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
   persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
   and this permission notice shall be included in all copies or substantial portions of the Software.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
   WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
   COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
   OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */
const SIMPLEX3 = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/* the flame shader (written for this book). Region coordinates in CSS px, y down. uA, uB: the bases of the two flames;
   uH: flame height; uAmp: size of each (flare, catching); uMerge 0..1; uSmoke; uPuff: (age, strength) of the puff at
   ignition; uFlare: the white flash of the head */
const FLAME_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vP;
uniform vec2 uRes, uA, uB, uAmp, uPuff;
uniform float uH, uMerge, uT, uSmoke, uFlare;
${SIMPLEX3}
/* one flame: x = temperature 0..1, y = share of the blue base. The soot glows only above the base; there, round the
   head, the flame is clear with a thin blue rim. wmul widens it, blueK sets the rim. */
vec2 flame(vec2 q, vec2 base, float h, float tipDx, float ero, float wmul, float blueK) {
  if (h < 1.0) return vec2(0.0);
  float y = (base.y - q.y) / h;
  float yy = (y + 0.16) / 1.16;
  if (yy <= 0.0 || yy >= 1.35) return vec2(0.0);
  float x = (q.x - base.x - tipDx * smoothstep(0.05, 0.95, yy)) / h;
  float prof = pow(clamp(yy, 0.0, 1.0), 0.5) * pow(max(1.0 - 0.78 * yy, 0.0), 1.05);
  float wdt = 0.34 * wmul * prof + 0.004;
  float r = abs(x) / wdt;
  float body = 1.0 - smoothstep(0.25, 1.0, r);
  float top = 1.0 - smoothstep(0.45, 1.02, yy + ero * 0.42 * smoothstep(0.12, 0.8, yy));
  float lum = mix(0.12, 1.0, smoothstep(0.1, 0.32, yy));
  float blue = blueK * (1.0 - smoothstep(0.1, 0.3, yy)) * smoothstep(0.45, 0.85, r) * (1.0 - smoothstep(0.9, 1.2, r));
  return vec2(body * top * lum, blue);
}
void main() {
  vec2 p = vP;
  float H = uH;
  vec2 m = 0.5 * (uA + uB);
  float hy = (m.y - p.y) / H;
  float dx = (p.x - m.x) / H;
  if (hy < -0.5 || abs(dx) > 1.6) { gl_FragColor = vec4(0.0); return; }
  float t = uT;
  vec2 g = p / H;
  float w = clamp(hy + 0.15, 0.0, 1.8);
  /* rising turbulence, the same for both flames, stronger with height */
  float n1 = snoise(vec3(g.x * 2.4, g.y * 1.7 + t * 2.2, t * 0.33));
  float n2 = snoise(vec3(g.x * 5.1, g.y * 3.9 + t * 3.7, t * 0.61 + 7.3));
  vec2 q = p + vec2(n1 * 0.085 + n2 * 0.032, n2 * 0.02) * H * w;
  q.x += snoise(vec3(1.7, t * 0.5, hy * 0.5 - t * 0.35)) * 0.055 * H * w * w;
  float ero = 0.65 * snoise(vec3(g.x * 3.8, g.y * 3.0 + t * 4.0, t * 0.8 + 3.1)) + 0.35 * n2;
  /* two flames lean together; as they merge, one taller flame grows from between them and takes over the top */
  float halfGap = 0.5 * (uB.x - uA.x);
  float shrink = 1.0 - 0.34 * uMerge;
  vec2 fa = flame(q, uA, H * uAmp.x * shrink, halfGap * uMerge * 0.75, ero, 1.0, 1.0);
  vec2 fb = flame(q, uB, H * uAmp.y * shrink, -halfGap * uMerge * 0.75, ero, 1.0, 1.0);
  float wm = smoothstep(0.0, 0.7, uMerge);
  vec2 fm = flame(q, vec2(m.x, m.y - 0.26 * H), H * (0.5 + 0.72 * uMerge) * 0.5 * (uAmp.x + uAmp.y), 0.0, ero, 1.0 + 0.7 * halfGap / H, 0.0);
  float T = 1.0 - (1.0 - fa.x) * (1.0 - fb.x) * (1.0 - fm.x * wm);
  T = clamp(T * (1.0 + 0.3 * fa.x * fb.x) + uFlare * 0.3 * T, 0.0, 1.25);
  float blue = max(fa.y, fb.y);
  /* hot soot: deep red at the rim, orange, yellow, a pale yellow-white core */
  vec3 fire = vec3(1.0, 0.24 + 0.7 * smoothstep(0.18, 0.92, T), 0.03 + 0.72 * smoothstep(0.7, 1.08, T));
  float a = smoothstep(0.02, 0.45, T);
  vec3 col = fire * a * (0.72 + 0.38 * T);
  col += vec3(0.25, 0.42, 1.0) * blue * 0.4 * (1.0 - a);
  a += blue * 0.22 * (1.0 - a);
  /* a soft warm halo */
  float amp = max(uAmp.x, uAmp.y);
  /* feathered to nothing before the early-out above and the sides of the region: no visible edge anywhere */
  float halo = exp(-(dx * dx * 2.2 + (hy - 0.4) * (hy - 0.4) * 0.9)) * 0.16 * amp * smoothstep(-0.5, 0.05, hy) * (1.0 - smoothstep(1.1, 1.6, abs(dx)));
  col += vec3(1.0, 0.5, 0.16) * halo * (1.0 - a);
  a += halo * 0.35 * (1.0 - a);
  /* smoke: thin filaments rising above the tip, meandering and spreading */
  float s = 0.0;
  if (hy > 0.45 && uSmoke > 0.0) {
    float sy = hy - 0.45;
    float mx = snoise(vec3(sy * 0.8 - t * 0.3, t * 0.09, 5.0)) * 0.22 * sy + snoise(vec3(sy * 2.0 - t * 0.55, t * 0.17, 9.0)) * 0.05 * sy;
    float sx = dx - mx;
    float wid = 0.035 + 0.1 * sy;
    float column = exp(-sx * sx / (wid * wid));
    float fil = 1.0 - abs(snoise(vec3(sx * 6.0 / (1.0 + sy * 1.5), sy * 2.6 - t * 1.0, t * 0.2 + 1.0)));
    s = column * (0.2 + 0.8 * pow(fil, 5.0)) * smoothstep(0.45, 1.0, hy) * (1.0 - smoothstep(1.3, 2.8, hy)) * uSmoke;
  }
  /* the puff of the strike */
  if (uPuff.y > 0.0) {
    float cy = 0.15 + uPuff.x * 0.55, rad = 0.22 + uPuff.x * 0.3;
    vec2 d = vec2(dx * 1.1, hy - cy) / rad;
    float n = 0.55 + 0.45 * snoise(vec3(dx * 3.0, hy * 3.0 - t * 1.5, t * 0.4 + 2.0));
    s += exp(-dot(d, d) * 1.6) * n * uPuff.y;
  }
  float sa = clamp(s * 0.6, 0.0, 0.75);
  col += vec3(0.62, 0.6, 0.58) * sa * (1.0 - a);
  a += sa * (1.0 - a);
  gl_FragColor = vec4(col, a);
}
`;

/* one WebGL context for the page, kept for the next time (contexts are limited) */
let FLAME_GL = null;
function flameGL() {
  if (FLAME_GL !== null) return FLAME_GL || null;
  try {
    const cv = canvas(2, 2), gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) { FLAME_GL = false; return null; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, FLAME_VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FLAME_FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr);
    const bufr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufr); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uRes', 'uA', 'uB', 'uAmp', 'uPuff', 'uH', 'uMerge', 'uT', 'uSmoke', 'uFlare'].forEach(n => { U[n] = gl.getUniformLocation(pr, n); });
    gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0);
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); FLAME_GL = false; });
    FLAME_GL = { cv, gl, U };
    return FLAME_GL;
  } catch (e) {
    console.warn('sondertage: flame shader off -', e && e.message);
    FLAME_GL = false;
    return null;
  }
}

/* procedural textures for the matches (made once per scene) */
function woodTexture(w, h, seed) {
  /* w: both sticks side by side (each w / 2 device px wide), h: the stick's length in device px - drawn 1:1 */
  const c = canvas(w, h), x = c.getContext('2d'), r = rng(seed), k = Math.max(.5, w / 2 / 24);
  for (let half = 0; half < 2; half++) {
    const x0 = half * w / 2, ww = w / 2;
    /* a square stick seen at an angle: a lit face and a shaded face meeting at an edge */
    const base = x.createLinearGradient(x0, 0, x0 + ww, 0);
    base.addColorStop(0, '#c8a374'); base.addColorStop(.1, '#e2c698'); base.addColorStop(.44, '#eed8ae');
    base.addColorStop(.5, '#d6b686'); base.addColorStop(.86, '#be9665'); base.addColorStop(1, '#a37d4e');
    x.fillStyle = base; x.fillRect(x0, 0, ww, h);
    x.save(); x.beginPath(); x.rect(x0, 0, ww, h); x.clip();
    for (let i = 0; i < ww * 1.1; i++) {
      const gx = x0 + r() * ww, amp = (.15 + r() * .6) * k, f = (.0006 + r() * .0025) / k, ph = r() * TAU, y0 = r() * h * .3, y1 = h - r() * h * .3;
      x.strokeStyle = `rgba(${110 + r() * 40 | 0},${70 + r() * 30 | 0},${32 + r() * 20 | 0},${(.06 + r() * .18).toFixed(3)})`;
      x.lineWidth = (.3 + r() * .7) * k;
      x.beginPath();
      for (let y = y0; y <= y1; y += 4) { const xx = gx + Math.sin(y * f + ph) * amp; if (y > y0) x.lineTo(xx, y); else x.moveTo(xx, y); }
      x.stroke();
    }
    for (let i = 0; i < ww * .4; i++) {
      const gx = x0 + r() * ww;
      x.strokeStyle = `rgba(255,246,222,${(.04 + r() * .1).toFixed(3)})`; x.lineWidth = (.4 + r() * .8) * k;
      x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx + (r() - .5) * 2 * k, h); x.stroke();
    }
    for (let i = 0; i < ww * h / 60; i++) { x.fillStyle = `rgba(92,56,24,${(r() * .14).toFixed(3)})`; x.fillRect(x0 + r() * ww, r() * h, .7 * k, (1 + r() * 4) * k); }
    x.restore();
  }
  return c;
}
function headTexture(w, h, seed, charred) {
  const c = canvas(w, h), x = c.getContext('2d'), r = rng(seed);
  const g = x.createRadialGradient(w * .36, h * .3, w * .04, w * .5, h * .5, w * .75);
  if (charred) { g.addColorStop(0, '#4a4440'); g.addColorStop(.35, '#2a2523'); g.addColorStop(1, '#0f0c0b'); }
  else { g.addColorStop(0, '#e2553f'); g.addColorStop(.25, '#b8241a'); g.addColorStop(.7, '#7c120c'); g.addColorStop(1, '#3e0705'); }
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const n = w * h / 6;
  for (let i = 0; i < n; i++) {
    const v = r(), px = r() * w, py = r() * h, s = .6 + r() * 1.6;
    x.fillStyle = charred ? (v < .5 ? `rgba(150,140,130,${(r() * .22).toFixed(3)})` : `rgba(0,0,0,${(r() * .35).toFixed(3)})`)
      : (v < .45 ? `rgba(255,170,150,${(r() * .2).toFixed(3)})` : v < .97 ? `rgba(40,0,0,${(r() * .3).toFixed(3)})` : 'rgba(255,255,240,.55)');
    x.fillRect(px, py, s, s);
  }
  if (charred) for (let i = 0; i < 14; i++) {
    x.strokeStyle = `rgba(0,0,0,${(.3 + r() * .4).toFixed(2)})`; x.lineWidth = .6 + r();
    x.beginPath(); let px = r() * w, py = r() * h; x.moveTo(px, py);
    for (let k = 0; k < 4; k++) { px += (r() - .5) * w * .3; py += (r() - .5) * h * .25; x.lineTo(px, py); }
    x.stroke();
  }
  return c;
}
function emberTexture(w, h, seed) {
  const c = canvas(w, h), x = c.getContext('2d'), r = rng(seed);
  for (let i = 0; i < 26; i++) {
    const px = w * (.15 + r() * .7), py = h * (.1 + r() * .8), rad = w * (.04 + r() * .12), g = x.createRadialGradient(px, py, 0, px, py, rad);
    g.addColorStop(0, `rgba(255,${150 + r() * 70 | 0},60,${(.5 + r() * .5).toFixed(2)})`); g.addColorStop(1, 'rgba(255,90,20,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }
  return c;
}

/* a small golden heart (the rain of hearts on Oct 31): a warm gold gradient, a darker rim, a light on the upper left lobe;
   back = the darker gold of its back as it tumbles */
function heartSprite(size, back) {
  const c = canvas(size, size), x = c.getContext('2d'), s = size * .92;
  x.translate(size / 2, size / 2 + size * .06); x.scale(s, s);
  const path = () => { x.beginPath(); x.moveTo(0, .34); x.bezierCurveTo(-.62, -.04, -.4, -.62, 0, -.26); x.bezierCurveTo(.4, -.62, .62, -.04, 0, .34); x.closePath(); };
  const g = x.createLinearGradient(-.4, -.45, .35, .35);
  if (back) { g.addColorStop(0, '#d9a93e'); g.addColorStop(.55, '#a8761f'); g.addColorStop(1, '#6e4a10'); }
  else { g.addColorStop(0, '#fff2b8'); g.addColorStop(.35, '#f2c94e'); g.addColorStop(.75, '#c8901f'); g.addColorStop(1, '#8a5c12'); }
  path(); x.fillStyle = g; x.fill();
  x.lineWidth = .035; x.strokeStyle = back ? 'rgba(70,44,6,.7)' : 'rgba(110,70,10,.65)'; x.stroke();
  if (!back) { const h = x.createRadialGradient(-.2, -.3, 0, -.2, -.3, .2); h.addColorStop(0, 'rgba(255,255,240,.9)'); h.addColorStop(1, 'rgba(255,255,240,0)'); x.fillStyle = h; x.fillRect(-.5, -.6, 1, 1); }
  return c;
}
function matchScene(box, seed, q0, opts) {
  let B = box, dpr = 0;
  const gov = governor(q0), tmp = [0, 0];
  const veilMax = opts.veil == null ? .74 : opts.veil;
  let wood = null, woodKey = '';
  const heads = [headTexture(96, 128, seed ^ 1, false), headTexture(96, 128, seed ^ 2, false)];
  const chars = [headTexture(96, 128, seed ^ 3, true), headTexture(96, 128, seed ^ 4, true)], embers = [emberTexture(96, 128, seed ^ 5), emberTexture(96, 128, seed ^ 6)];
  const spark = glowSprite('255,170,70', 32), sparkW = glowSprite('255,236,190', 32);
  const heartF = heartSprite(48, false), heartB = heartSprite(48, true), glint = glowSprite('255,236,190', 32);
  const charJag = Array.from({ length: 24 }, (_, i) => hash(seed, 31, i) - .5);
  let textImg = null, textKey = '';
  const FONT = '"Great Vibes", "Pinyon Script", cursive', TEXT = 'it’s a match';
  try { document.fonts.load(`64px ${FONT}`); } catch (e) { }

  /* poses: [time, x (U from the middle), y (U from the heads' line), angle (rad, + = the stick's foot to the left)] */
  const R0 = opts.gl === false ? null : flameGL();
  if (R0) { const { cv, gl } = R0; cv.width = cv.height = 8; gl.viewport(0, 0, 8, 8); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); }
  /* after the strike they settle very close together, almost touching, at slightly different heights - the left one about
     a tenth of the stick higher and nearly upright, the right one leaning in */
  const KEY = [
    [[0, -.62, .8, .95], [.3, -.62, .8, .95], [1.55, -.075, .025, .38], [1.98, -.072, .02, .37], [2.12, -.06, .012, .33], [2.95, -.021, -.046, .07]],
    [[0, .62, .8, -.95], [.45, .62, .8, -.95], [1.65, .07, -.03, -.42], [1.9, .035, -.062, -.44], [2.12, -.105, .05, -.3], [2.4, -.01, .02, -.28], [3, .021, 0, -.28]]
  ];
  /* right match a little smaller (stick, head and flame) */
  const SIZE = [1, .87];
  const pose = (k, t, out) => {
    const K = KEY[k];
    let i = 0;
    while (i < K.length - 1 && t > K[i + 1][0]) i++;
    const a = K[i], b = K[Math.min(i + 1, K.length - 1)], s = b[0] > a[0] ? smooth(a[0], b[0], t) : 1;
    out[0] = mix(a[1], b[1], s); out[1] = mix(a[2], b[2], s); out[2] = mix(a[3], b[3], s);
    return out;
  };
  /* the strike: the moment the heads pass closest */
  let TI = 2.03;
  { const pa = [0, 0, 0], pb = [0, 0, 0]; let best = 1e9; for (let t = 1.9; t < 2.2; t += .002) { pose(0, t, pa); pose(1, t, pb); const d = Math.hypot(pa[0] - pb[0], pa[1] - pb[1]); if (d < best) { best = d; TI = t; } } }
  const TI2 = TI + .035;

  const lay = () => {
    const U = Math.min(B.h, B.w * 1.25), L = .46 * U, th = L * .052;
    /* ym, mx: the heads' line and middle - the matches and their flame stand a little low and a little left of the fold,
       the text below their feet a little to the right */
    const yh = B.y + B.h * .5 - .15 * U;
    return { U, cx: B.x + B.w / 2, mx: B.x + B.w * (.5 - .01), yh, ym: yh + .09 * B.h, L, th, hw: th * .86, hl: th * 2.4, H: .2 * U };
  };
  const flick = t => 1 + .05 * Math.sin(t * 11.3) + .035 * Math.sin(t * 17.7 + 1.3) + .025 * Math.sin(t * 29.1 + .7);
  const ampOf = dt => dt <= 0 ? 0 : dt < .1 ? 1.6 * dt / .1 : dt < .55 ? mix(1.6, .6, smooth(.1, .55, dt)) : mix(.6, 1, smooth(.55, 3.2, dt));
  /* the head and its stick in world coordinates */
  const place = (k, t, G, out) => { pose(k, t, out); out[0] = G.mx + out[0] * G.U; out[1] = G.ym + out[1] * G.U; return out; };

  const woodFor = G => {
    const w = Math.max(8, Math.round(G.th * dpr)), h = Math.max(64, Math.round((G.L + G.hl * .1) * dpr)), key = w + 'x' + h;
    if (key !== woodKey) { wood = woodTexture(w * 2, h, seed ^ 0x77); woodKey = key; }
    return wood;
  };
  function stickPath(ctx, G, char) {
    const hw = G.th / 2, nw = hw * .78, L = G.L, c = char, rr = hw * .35;
    ctx.beginPath();
    ctx.moveTo(-nw, -G.hl * .1);
    if (c > 0) {
      for (let i = 0; i <= 12; i++) ctx.lineTo(-nw + charJag[i] * hw * .18, c * i / 12);
      ctx.lineTo(-hw, c + L * .025);
    } else ctx.lineTo(-hw, 0);
    ctx.lineTo(-hw, L - rr); ctx.quadraticCurveTo(-hw, L, -hw + rr, L); ctx.lineTo(hw - rr, L); ctx.quadraticCurveTo(hw, L, hw, L - rr);
    if (c > 0) {
      ctx.lineTo(hw, c + L * .025);
      for (let i = 12; i >= 0; i--) ctx.lineTo(nw + charJag[i + 12] * hw * .18, c * i / 12);
    } else ctx.lineTo(hw, 0);
    ctx.lineTo(nw, -G.hl * .1);
    ctx.closePath();
  }
  function headPath(ctx, G, s) {
    const hw = G.hw * s, top = -.62 * G.hl * s, bot = .42 * G.hl;
    ctx.beginPath();
    ctx.moveTo(0, top);
    ctx.bezierCurveTo(hw * 1.12, top, hw * 1.08, bot * .15, G.th * .52, bot);
    ctx.lineTo(-G.th * .52, bot);
    ctx.bezierCurveTo(-hw * 1.08, bot * .15, -hw * 1.12, top, 0, top);
    ctx.closePath();
  }

  function drawMatch(ctx, k, t, G, P, A, light) {
    const ti = k ? TI2 : TI, burn = t - ti, L = G.L, th = G.th;
    const char = burn > 1.2 ? .17 * L * (1 - Math.exp(-(burn - 1.2) / 14)) : 0;
    const charHead = smooth(0, 2.6, burn), fl = flick(t + k * 1.7);
    ctx.save();
    ctx.translate(P[0], P[1]); ctx.rotate(P[2]);
    if (SIZE[k] !== 1) ctx.scale(SIZE[k], SIZE[k]);
    ctx.globalAlpha = A;
    /* the shadow on the page */
    ctx.save();
    ctx.shadowColor = `rgba(0,0,0,${(.4 * A).toFixed(3)})`; ctx.shadowBlur = th * 1.2; ctx.shadowOffsetX = 10000 + th * .5; ctx.shadowOffsetY = th * .9;
    ctx.translate(-10000, 0); stickPath(ctx, G, char); ctx.fillStyle = '#000'; ctx.fill(); headPath(ctx, G, 1); ctx.fill();
    ctx.restore();
    /* the stick: wood grain, shading across, warm light from the flames above, charring below the head */
    ctx.save();
    stickPath(ctx, G, char); ctx.clip();
    const wd = woodFor(G), ww = wd.width / 2;
    ctx.drawImage(wd, k * ww, 0, ww, wd.height, -th / 2, -G.hl * .1, th, L + G.hl * .1);
    let g = ctx.createLinearGradient(0, 0, 0, L);
    g.addColorStop(0, `rgba(255,150,60,${(.38 * light).toFixed(3)})`); g.addColorStop(.45, 'rgba(255,150,60,0)');
    g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(20,10,0,${(.3 + .25 * light).toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(-th, -G.hl, 2 * th, L + G.hl);
    if (char > 0 || burn > 0) {
      const c = Math.max(char, .02 * L * smooth(0, 1.2, burn)), e = clamp(c / L, 0, 1);
      g = ctx.createLinearGradient(0, 0, 0, c + L * .07);
      const k1 = c / (c + L * .07);
      g.addColorStop(0, 'rgba(14,9,6,1)'); g.addColorStop(Math.max(0, k1 - .12), 'rgba(28,17,10,.97)');
      g.addColorStop(k1 * .985, `rgba(255,${110 + 40 * fl | 0},30,${(.85 * smooth(.5, 2, burn) * (.75 + .25 * fl)).toFixed(3)})`);
      g.addColorStop(Math.min(1, k1 + .03), 'rgba(110,52,16,.6)'); g.addColorStop(1, 'rgba(110,52,16,0)');
      ctx.fillStyle = g; ctx.fillRect(-th, -G.hl, 2 * th, c + L * .07 + G.hl);
      if (e > 0) {
        /* the glowing burn line flickers in the char */
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = A * .5 * smooth(.6, 2, burn) * fl;
        ctx.drawImage(spark, -th * .9, c - th * .7, th * 1.8, th * 1.2);
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = A;
      }
    }
    ctx.restore();
    /* the head: red, then charred, with embers glowing in it */
    const s = 1 - .08 * charHead;
    ctx.save();
    headPath(ctx, G, s); ctx.clip();
    const hx = -G.hw * 1.15, hy = -.65 * G.hl, hW = G.hw * 2.3, hH = G.hl * 1.12;
    ctx.drawImage(heads[k], hx, hy, hW, hH);
    if (charHead > 0) { ctx.globalAlpha = A * charHead; ctx.drawImage(chars[k], hx, hy, hW, hH); }
    if (burn > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = A * smooth(.2, 1.8, burn) * clamp(.55 + .22 * Math.sin(t * 7.3 + k * 2) + .45 * (fl - 1), 0, 1);
      ctx.drawImage(embers[k], hx, hy, hW, hH);
      ctx.globalCompositeOperation = 'source-over';
    }
    g = ctx.createRadialGradient(-G.hw * .4, -G.hl * .35, 0, -G.hw * .4, -G.hl * .35, G.hw * .9);
    g.addColorStop(0, `rgba(255,255,255,${(.35 * (1 - charHead * .8)).toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalAlpha = A; ctx.fillStyle = g; ctx.fillRect(hx, hy, hW, hH);
    ctx.restore();
    ctx.restore();
  }

  /* sparks of the strike and the sputter of the heads, embers rising later - all from fixed seeds and the time */
  function drawSparks(ctx, t, G, A) {
    const U = G.U, pa = [0, 0, 0], pb = [0, 0, 0];
    place(0, TI, G, pa); place(1, TI, G, pb);
    const ox = (pa[0] + pb[0]) / 2, oy = (pa[1] + pb[1]) / 2, sw = Math.atan2(KEY[1][4][2] - KEY[1][3][2], KEY[1][4][1] - KEY[1][3][1]);
    const lines = [new Path2D(), new Path2D(), new Path2D()];
    if (t < TI + .3) {
      const k = 1 - (t - TI) / .3, R = U * .1, g = ctx.createRadialGradient(ox, oy, 0, ox, oy, R);
      g.addColorStop(0, `rgba(255,250,225,${(.9 * k * A).toFixed(3)})`); g.addColorStop(.3, `rgba(255,200,110,${(.35 * k * A).toFixed(3)})`); g.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = g; ctx.fillRect(ox - R, oy - R, 2 * R, 2 * R);
    }
    const N = [60, 90, 130][gov.q], heads = [];
    for (let i = 0; i < N; i++) {
      const h0 = hash(seed, 1, i), h1 = hash(seed, 2, i), h2 = hash(seed, 3, i), h3 = hash(seed, 4, i);
      const te = TI + h0 * .14, a = t - te, life = .25 + h3 * .6;
      if (a < 0 || a > life) continue;
      const an = h1 < .25 ? -Math.PI / 2 + (h2 - .5) * 1.6 : sw + (h1 - .62) * 2.6, sp = (.5 + h2 * 1.3) * U, k = 3.2, gg = 1.5 * U;
      const P = aa => { const e = Math.exp(-k * aa), f = (1 - e) / k; tmp[0] = ox + Math.cos(an) * sp * f; tmp[1] = oy + Math.sin(an) * sp * f + (gg / k) * (aa - f); };
      P(Math.max(0, a - .012 - h0 * .02)); const x0 = tmp[0], y0 = tmp[1]; P(a);
      const b = a / life, li = b < .35 ? 0 : b < .7 ? 1 : 2;
      lines[li].moveTo(x0, y0); lines[li].lineTo(tmp[0], tmp[1]);
      if (li < 2) heads.push(tmp[0], tmp[1], 1 - b);
    }
    /* the heads sputter for a moment after they catch */
    for (let m = 0; m < 2; m++) {
      const ti = m ? TI2 : TI;
      for (let i = 0; i < [10, 16, 24][gov.q]; i++) {
        const h0 = hash(seed, 11 + m, i), h1 = hash(seed, 13 + m, i), h2 = hash(seed, 15 + m, i);
        const te = ti + .05 + h0 * 1.1, a = t - te, life = .2 + h2 * .35;
        if (a < 0 || a > life) continue;
        place(m, te, G, pa);
        const an = -Math.PI / 2 + (h1 - .5) * 2.4, sp = (.25 + h2 * .5) * U, k = 3, gg = 1.2 * U;
        const P = aa => { const e = Math.exp(-k * aa), f = (1 - e) / k; tmp[0] = pa[0] + Math.cos(an) * sp * f; tmp[1] = pa[1] - G.hl * .3 + Math.sin(an) * sp * f + (gg / k) * (aa - f); };
        P(Math.max(0, a - .025)); const x0 = tmp[0], y0 = tmp[1]; P(a);
        const li = a / life < .5 ? 0 : 1;
        lines[li].moveTo(x0, y0); lines[li].lineTo(tmp[0], tmp[1]);
      }
    }
    ctx.lineCap = 'round';
    const lw = Math.max(.8, U * .0022);
    ctx.lineWidth = lw * 1.3; ctx.strokeStyle = `rgba(255,248,220,${A})`; ctx.stroke(lines[0]);
    ctx.lineWidth = lw; ctx.strokeStyle = `rgba(255,190,90,${A * .9})`; ctx.stroke(lines[1]);
    ctx.lineWidth = lw * .8; ctx.strokeStyle = `rgba(230,90,30,${A * .7})`; ctx.stroke(lines[2]);
    const hd = Math.max(4, U * .011);
    for (let i = 0; i < heads.length; i += 3) { ctx.globalAlpha = A * heads[i + 2]; ctx.drawImage(sparkW, heads[i] - hd / 2, heads[i + 1] - hd / 2, hd, hd); }
    ctx.globalAlpha = 1;
    /* embers rising from the flame, without end */
    if (t > TI + 1.5) {
      const mx = (place(0, t, G, pa)[0] + place(1, t, G, pb)[0]) / 2, my = Math.min(pa[1], pb[1]);
      const n = [4, 6, 9][gov.q];
      for (let i = 0; i < n; i++) {
        const P0 = 2.6 + hash(seed, 21, i) * 2.6, d = TI + 1.5 + hash(seed, 22, i) * 3, q = t - d;
        if (q < 0) continue;
        const cyc = Math.floor(q / P0), a = q - cyc * P0, h = hash(seed + cyc, 23, i), h2 = hash(seed + cyc, 24, i), life = 1.2 + h * 1.3;
        if (a > life) continue;
        const x = mx + (h2 - .5) * .12 * U + Math.sin(a * 3 + h * 9) * .015 * U, y = my - G.H * (.2 + h * .4) - a * (.12 + h2 * .12) * U;
        const b = (1 - a / life) * (.6 + .4 * Math.sin(a * 23 + i)), d2 = Math.max(4, U * .012);
        ctx.globalAlpha = A * b; ctx.drawImage(spark, x - d2 / 2, y - d2 / 2, d2, d2);
      }
      ctx.globalAlpha = 1;
    }
  }

  /* the text, rendered once in the book's script, gold */
  function textImage(cssSize, t) {
    const size = Math.round(cssSize * dpr);
    if (size === textKey) return textImg;
    if (document.fonts && document.fonts.check && !document.fonts.check(`${size}px ${FONT}`) && t < TI + 8) return null;
    const m = canvas(10, 10).getContext('2d');
    m.font = `${size}px ${FONT}`;
    const w = Math.ceil(m.measureText(TEXT).width + size * .8), h = Math.ceil(size * 1.7), c = canvas(w, h), x = c.getContext('2d');
    x.font = `${size}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    const g = x.createLinearGradient(0, h * .2, 0, h * .8);
    g.addColorStop(0, '#fbe7a6'); g.addColorStop(.5, '#e2bd5c'); g.addColorStop(1, '#a8761c');
    /* a soft dark halo first, so the letters stay clear over whatever is printed on the page below them */
    x.shadowColor = 'rgba(12,8,4,.9)'; x.shadowBlur = size * .3; x.fillStyle = 'rgba(12,8,4,.85)';
    x.fillText(TEXT, w / 2, h * .68); x.fillText(TEXT, w / 2, h * .68);
    x.shadowColor = 'rgba(255,170,70,.55)'; x.shadowBlur = size * .18;
    x.fillStyle = g; x.fillText(TEXT, w / 2, h * .68);
    x.shadowColor = 'transparent'; x.lineWidth = Math.max(1, size * .012); x.strokeStyle = 'rgba(90,50,10,.35)'; x.strokeText(TEXT, w / 2, h * .68);
    textKey = size; textImg = { c, w: w / dpr, h: h / dpr };
    return textImg;
  }

  function drawFlame2D(ctx, A_, B_, G, amp, merge, A, t) {
    /* stand-in without WebGL: slim flickering teardrops (yellow core, orange rim) that lean together, then one flame */
    const one = (x, y, h, lean, w) => {
      if (h < 1) return;
      const sway = Math.sin(t * 9.1 + x) * h * .03, tip = lean + sway;
      const path = s => { ctx.beginPath(); ctx.moveTo(tip * s, -h * s); ctx.bezierCurveTo(h * w * s + tip * .3, -h * .45 * s, h * w * .8 * s, h * .1 * s, 0, h * .12 * s); ctx.bezierCurveTo(-h * w * .8 * s, h * .1 * s, -h * w * s + tip * .3, -h * .45 * s, tip * s, -h * s); };
      ctx.save(); ctx.translate(x, y);
      ctx.globalAlpha = A * .85; ctx.fillStyle = '#ff8a2a'; path(1); ctx.fill();
      ctx.globalAlpha = A; ctx.fillStyle = '#ffd36a'; path(.78); ctx.fill();
      ctx.globalAlpha = A * .9; ctx.fillStyle = '#fff3c8'; ctx.translate(0, h * .04); path(.45); ctx.fill();
      ctx.restore();
    };
    const half = (B_[0] - A_[0]) / 2, f = flick(t);
    one(A_[0], A_[1], G.H * amp[0] * (1 - .35 * merge) * f, half * merge * .7, .16);
    one(B_[0], B_[1], G.H * amp[1] * (1 - .35 * merge) * flick(t + 2.1), -half * merge * .7, .16);
    if (merge > 0) one((A_[0] + B_[0]) / 2, (A_[1] + B_[1]) / 2 - G.H * .25, G.H * (.5 + .7 * merge) * (amp[0] + amp[1]) / 2 * f, 0, .2 + .3 * half / G.H);
    ctx.globalAlpha = 1;
  }

  function draw(ctx, t, alpha) {
    gov.tick(performance.now());
    if (!dpr) dpr = Math.max(1, Math.min(3, ctx.getTransform ? ctx.getTransform().a : (window.devicePixelRatio || 1)));
    const G = lay(), U = G.U, A = clamp(alpha == null ? 1 : alpha, 0, 1);
    const pa = place(0, t, G, [0, 0, 0]), pb = place(1, t, G, [0, 0, 0]);
    const ampA = ampOf(t - TI), ampB = ampOf(t - TI2), fl = flick(t), lit = Math.max(ampA, ampB);
    const merge = smooth(TI + 1.1, TI + 4.2, t), light = clamp(lit, 0, 1.3) * fl;
    /* the flame bases: just above the head, along the stick */
    const base = (P, k) => { const ti = k ? TI2 : TI, burn = t - ti, c = burn > 1.2 ? .17 * G.L * (1 - Math.exp(-(burn - 1.2) / 14)) * .4 : 0, d = (-G.hl * .3 + c) * SIZE[k]; return [P[0] - Math.sin(P[2]) * d, P[1] + Math.cos(P[2]) * d]; };
    const fa = base(pa, 0), fb = base(pb, 1);
    const mx = (fa[0] + fb[0]) / 2, my = (fa[1] + fb[1]) / 2;
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* the room goes dark a little as they come, more as the flames take over; the flames light the page round them */
    const v = A * veilMax * (.45 * smooth(0, 1.8, t) + .55 * smooth(TI - .1, TI + 1.4, t));
    if (v > 0) {
      const cy = my - G.H * .5, g = ctx.createRadialGradient(mx, cy, 0, mx, cy, U * 1.1), l = clamp(light, 0, 1);
      g.addColorStop(0, `rgba(10,6,3,${(v * (1 - .72 * l)).toFixed(3)})`); g.addColorStop(.25, `rgba(9,6,3,${(v * (1 - .45 * l)).toFixed(3)})`);
      g.addColorStop(.6, `rgba(7,4,2,${(v * (1 - .12 * l)).toFixed(3)})`); g.addColorStop(1, `rgba(5,3,2,${v.toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, B.W, B.H);
    }
    if (lit > 0) {
      ctx.globalCompositeOperation = 'lighter';
      const cy = my - G.H * .45, R = U * .5, g = ctx.createRadialGradient(mx, cy, 0, mx, cy, R);
      g.addColorStop(0, `rgba(255,150,60,${(.17 * A * clamp(light, 0, 1.4)).toFixed(3)})`); g.addColorStop(.5, `rgba(255,120,40,${(.06 * A * clamp(light, 0, 1.4)).toFixed(3)})`); g.addColorStop(1, 'rgba(255,110,30,0)');
      ctx.fillStyle = g; ctx.fillRect(mx - R, cy - R, 2 * R, 2 * R);
      ctx.globalCompositeOperation = 'source-over';
    }
    /* the matches fade in as they come up from below */
    const inA = A * smooth(.3, .7, t), inB = A * smooth(.45, .85, t);
    if (inA > 0) drawMatch(ctx, 0, t, G, pa, inA, light * .9);
    if (inB > 0) drawMatch(ctx, 1, t, G, pb, inB, light * .9);
    /* the flames and the smoke */
    if (t > TI) {
      ctx.globalCompositeOperation = 'lighter';
      drawSparks(ctx, t, G, A);
      ctx.globalCompositeOperation = 'source-over';
      const R = R0 && FLAME_GL ? R0 : null;
      const flare = Math.max(0, 1 - (t - TI) / .6), puffAge = t - TI, puff = puffAge < 3 ? smooth(0, .15, puffAge) * (1 - smooth(1, 3, puffAge)) * .9 : 0;
      const smoke = smooth(TI + .6, TI + 3.2, t);
      if (R) {
        const rw = U * .7, rh = U * .95, rx = mx - rw / 2, ry = my - U * .82;
        const scale = Math.min(1.5, dpr) * [.45, .65, .9][gov.q], cw = Math.max(8, Math.round(rw * scale)), ch = Math.max(8, Math.round(rh * scale));
        const { cv, gl, U: u } = R;
        if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
        gl.viewport(0, 0, cw, ch); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.uRes, rw, rh);
        gl.uniform2f(u.uA, fa[0] - rx, fa[1] - ry); gl.uniform2f(u.uB, fb[0] - rx, fb[1] - ry);
        gl.uniform2f(u.uAmp, ampA * SIZE[0] * (.97 + .06 * fl), ampB * SIZE[1] * (.97 + .06 * flick(t + 2.1)));
        gl.uniform2f(u.uPuff, Math.max(0, puffAge), puff);
        gl.uniform1f(u.uH, G.H); gl.uniform1f(u.uMerge, merge); gl.uniform1f(u.uT, t % 512);
        gl.uniform1f(u.uSmoke, smoke); gl.uniform1f(u.uFlare, flare);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        ctx.globalAlpha = A;
        ctx.drawImage(cv, rx, ry, rw, rh);
        ctx.globalAlpha = 1;
      } else drawFlame2D(ctx, fa, fb, G, [ampA * SIZE[0], ampB * SIZE[1]], merge, A, t);
    }
    /* "it's a match", written in from the left */
    const tw = smooth(TI + 3.6, TI + 6.2, t);
    if (tw > 0) {
      /* free below the feet of the matches at rest, with a little air, and inside the page: smaller only if the page ends
         first. The script's letters reach about .85 of the font size above the baseline and .1 below it; the image holds
         the baseline at 1.156 of the size from its top */
      let foot = 0;
      for (let k = 0; k < 2; k++) { const K = KEY[k][KEY[k].length - 1]; foot = Math.max(foot, G.ym + K[2] * U + (G.L * Math.cos(K[3]) + G.th * .5 * Math.abs(Math.sin(K[3]))) * SIZE[k]); }
      const top = foot + .03 * B.h, size = clamp((B.y + B.h * .975 - top) / .95, U * .055, U * .095);
      const img = textImage(size, t);
      if (img) {
        const x = clamp(G.cx - img.w / 2 + B.w * .015, B.x + B.w * .02, B.x + B.w * .98 - img.w), y = top - .306 * size, edge = img.w * .12, rev = tw * (img.w + edge);
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, Math.max(0, rev - edge), img.h); ctx.clip();
        ctx.globalAlpha = A; ctx.drawImage(img.c, x, y, img.w, img.h);
        ctx.restore();
        const e0 = Math.max(0, rev - edge), e1 = Math.min(img.w, rev);
        if (e1 > e0) {
          ctx.save(); ctx.beginPath(); ctx.rect(x + e0, y, e1 - e0, img.h); ctx.clip();
          ctx.globalAlpha = A * .45; ctx.drawImage(img.c, x, y, img.w, img.h); ctx.restore();
        }
      }
    }
    /* golden hearts raining (Doc, 26.11.2026: "da müssen da noch irgendwie goldene Herzen regnen. Ganz viele. Kleine.") -
       from the moment the words begin, endless: many small hearts fall from above through the whole picture, each from its
       own moment, swaying and tumbling (the width turns with the spin, front gold and back darker, a glint as one faces the
       light); nearer ones larger and faster */
    const HT = TI + 3.6;
    if (t > HT) {
      const NH = gov.q === 0 ? 80 : gov.q === 1 ? 130 : 180, W = B.W, H = B.H, hu = U / 1000;
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < NH; i++) {
        const z = hash(seed, 71, i), P = 5.5 + 6.5 * (1 - z), sl = slot(t, P, HT + hash(seed, 72, i) * P);
        if (!sl) continue;
        const h = j => hash(seed + sl.k * 13, j, i);
        const y = -24 + sl.u * (H + 48), x = h(1) * W + Math.sin(t * (.5 + .6 * h(2)) + i) * (12 + 24 * z) * hu * 1.4;
        const sz = ((3.5 + 6 * z) * hu * 1.4 + 2.5) * (.85 + .3 * h(6)), spin = Math.cos(t * (1.1 + 2.1 * h(3)) + h(4) * TAU), rot = Math.sin(t * (.6 + .8 * h(5)) + i) * .5;
        const a = A * (.62 + .38 * z) * Math.min(1, sl.u * 14, (1 - sl.u) * 10);
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(.18 + .82 * Math.abs(spin), 1);
        ctx.globalAlpha = a; ctx.drawImage(spin >= 0 ? heartF : heartB, -sz, -sz, 2 * sz, 2 * sz);
        ctx.restore();
        if (spin > .96 && z > .4) { const gs = sz * 1.3; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * (spin - .96) / .04 * .8; ctx.drawImage(glint, x - gs * .55, y - gs * .75, gs, gs); ctx.globalCompositeOperation = 'source-over'; }
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  return { kind: 'match', draw, resize(b) { B = b; textKey = ''; dpr = 0; }, destroy() { textImg = null; }, get quality() { return gov.q; } };
}
