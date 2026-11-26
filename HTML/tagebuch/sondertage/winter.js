/* The first day of winter (the December solstice): frost grows in from the edges of the book like ice on a window - fine
   ferns of crystals branching at sixty degrees, reaching inwards over twenty seconds and then staying, glinting here and
   there; a cold blue breath lies along the edges, and a few large snow crystals drift down, turning. Endless, from the time
   since the start (sondertage.js); once grown, the frost is kept as one image. */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, rng, slot, canvas, softDot } = util;

/* a six-armed snow crystal, drawn once */
function crystalSprite(px, seed) {
  const c = canvas(px, px), x = c.getContext('2d'), cx = px / 2, r = px * .46;
  x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineCap = 'round';
  for (let a = 0; a < 6; a++) {
    x.save(); x.translate(cx, cx); x.rotate(a * TAU / 6);
    x.lineWidth = px * .025; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r); x.stroke();
    for (let k = 1; k <= 3; k++) {
      const y = -r * (.25 + k * .2), l = r * (.32 - k * .06) * (.8 + .4 * hash(seed, 1, k));
      x.lineWidth = px * .018; x.beginPath(); x.moveTo(0, y); x.lineTo(l * .87, y - l * .5); x.moveTo(0, y); x.lineTo(-l * .87, y - l * .5); x.stroke();
    }
    x.restore();
  }
  x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(cx, cx, px * .05, 0, TAU); x.fill();
  return c;
}

export function create({ box, seed, quality }) {
  let B = box, done = null, doneKey = '';
  const R = rng(seed ^ 0x1ce), F = [];
  const crystals = [crystalSprite(96, seed), crystalSprite(96, seed + 1), crystalSprite(96, seed + 2)], glint = softDot('235,245,255', 32, .2);
  /* the frost, in parts of the book: ferns from points along the four edges, each segment with the time it is reached */
  function fern(x, y, ang, len, lvl, t0) {
    const n = Math.max(3, Math.round(len / .009)), speed = .02;
    let px = x, py = y, pa = ang, tt = t0;
    for (let i = 0; i < n; i++) {
      pa += (R() - .5) * .14;
      const step = len / n, nx = px + Math.cos(pa) * step, ny = py + Math.sin(pa) * step, t1 = tt + step / speed;
      F.push([px, py, nx, ny, lvl, tt, t1]);
      if (lvl < 3 && i > 0) {
        const side = i % 2 ? 1 : -1, l = len * (.4 - .3 * i / n) * (.75 + .5 * R());
        if (l > .006) fern(nx, ny, pa + side * Math.PI / 3, l, lvl + 1, t1);
      }
      px = nx; py = ny; tt = t1;
    }
  }
  const nE = quality === 0 ? 12 : 20;
  for (let e = 0; e < 4; e++) {
    for (let k = 0; k < nE; k++) {
      const s = (k + .2 + .6 * R()) / nE, t0 = .5 + R() * 9, len = .05 + R() * .09, j = (R() - .5) * .6;
      if (e === 0) fern(s, 0, Math.PI / 2 + j, len, 0, t0);
      if (e === 1) fern(s, 1, -Math.PI / 2 + j, len, 0, t0);
      if (e === 2) fern(0, s, j, len * .75, 0, t0);
      if (e === 3) fern(1, s, Math.PI + j, len * .75, 0, t0);
    }
  }
  const TEND = Math.max(...F.map(f => f[6]));
  const tips = F.filter((f, i) => hash(seed, 9, i) < .03);

  function frost(ctx, t, ox, oy, sx, sy, lw) {
    ctx.lineCap = 'round';
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? 'rgba(255,255,255,.92)' : 'rgba(80,120,170,.32)';
      for (let lv = 0; lv < 4; lv++) {
        ctx.lineWidth = lw * [1, .62, .42, .3][lv] * (pass ? 1 : 1.9); ctx.beginPath();
        for (const f of F) {
          if (f[4] !== lv || t < f[5]) continue;
          const p = Math.min(1, (t - f[5]) / (f[6] - f[5]));
          ctx.moveTo(ox + f[0] * sx, oy + f[1] * sy); ctx.lineTo(ox + (f[0] + (f[2] - f[0]) * p) * sx, oy + (f[1] + (f[3] - f[1]) * p) * sy);
        }
        ctx.stroke();
      }
    }
  }

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), U = Math.min(B.w, B.h * 1.1), dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* the cold along the edges */
    const c = A * smooth(0, 3, t), e = Math.min(B.w, B.h) * .22;
    for (const [x0, y0, x1, y1, rx, ry, rw, rh] of [[0, 0, 0, e, 0, 0, B.w, e], [0, B.h, 0, B.h - e, 0, B.h - e, B.w, e], [0, 0, e, 0, 0, 0, e, B.h], [B.w, 0, B.w - e, 0, B.w - e, 0, e, B.h]]) {
      const g = ctx.createLinearGradient(B.x + x0, B.y + y0, B.x + x1, B.y + y1);
      g.addColorStop(0, `rgba(150,190,235,${(.3 * c).toFixed(3)})`); g.addColorStop(1, 'rgba(150,190,235,0)');
      ctx.fillStyle = g; ctx.fillRect(B.x + rx, B.y + ry, rw, rh);
    }
    /* the frost: grown live, then kept as one image */
    const lw = Math.max(.7, U * .0019);
    ctx.globalAlpha = A;
    if (t < TEND) frost(ctx, t, B.x, B.y, B.w, B.h, lw);
    else {
      const key = Math.round(B.w * dpr) + 'x' + Math.round(B.h * dpr);
      if (key !== doneKey) {
        done = canvas(B.w * dpr + 8, B.h * dpr + 8); const x = done.getContext('2d');
        frost(x, TEND + 1, 4, 4, B.w * dpr, B.h * dpr, lw * dpr); doneKey = key;
      }
      ctx.drawImage(done, B.x - 4 / dpr, B.y - 4 / dpr, done.width / dpr, done.height / dpr);
    }
    /* glints on the grown frost */
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < tips.length; i++) {
      const f = tips[i]; if (t < f[6]) continue;
      const g = Math.max(0, Math.sin(t * (.9 + hash(seed, 10, i)) + i * 2.3)), d = U * .012 * (.5 + g);
      ctx.globalAlpha = A * g * g * .9; ctx.drawImage(glint, B.x + f[2] * B.w - d, B.y + f[3] * B.h - d, 2 * d, 2 * d);
    }
    ctx.globalCompositeOperation = 'source-over';
    /* snow crystals drifting down, turning */
    for (let i = 0; i < (quality === 0 ? 6 : 10); i++) {
      const P = 14 + hash(seed, 20, i) * 10, s = slot(t, P, 1 + hash(seed, 21, i) * P);
      if (!s) continue;
      const h = j => hash(seed + s.k * 13, j, i), x = B.x + B.w * (.08 + .84 * h(1)) + Math.sin(s.a * .5 + i) * U * .04, y = B.y - U * .05 + s.u * (B.h + U * .1);
      const d = U * (.025 + .03 * h(2));
      ctx.save(); ctx.translate(x, y); ctx.rotate(s.a * (h(3) - .5) * .8);
      ctx.globalAlpha = A * Math.min(1, s.u * 8, (1 - s.u) * 8) * (.6 + .3 * h(4)); ctx.drawImage(crystals[i % 3], -d / 2, -d / 2, d, d);
      ctx.restore();
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; doneKey = ''; }, destroy() { done = null; } };
}
