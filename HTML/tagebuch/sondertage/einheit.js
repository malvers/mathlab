/* Oct 3, Day of German Unity: a festive, quiet night - warm lights rise slowly from the foot of the book like little
   lanterns, fine golden sparks climb faster between them and a few deep red embers glow; a soft warm light along the
   foot of the page. Black, red and gold only as the night, the embers and the light - never as a flag. Endless, from the
   time since the start (slots, sondertage.js). */
import { util } from '../sondertage.js';
const { clamp, smooth, hash, slot, softDot } = util;

export function create({ box, seed, quality, veil }) {
  let B = box;
  const gold = softDot('255,206,110', 64, .12), core = softDot('255,246,220', 32, .3), red = softDot('220,70,30', 48, .25);
  const veilMax = veil == null ? .66 : veil;
  const nL = quality === 0 ? 10 : 16, nS = quality === 0 ? 50 : 90, nE = quality === 0 ? 8 : 14;

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H;
    const S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000, top = B.y - B.h * .1, bot = B.y + B.h * 1.02;
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const v = A * veilMax * smooth(0, 2, t), g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgba(4,4,8,${v.toFixed(3)})`); g.addColorStop(1, `rgba(14,6,6,${(v * .9).toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    /* a warm light along the foot of the page */
    const f = A * smooth(.5, 3, t) * (.85 + .15 * Math.sin(t * .7)), lg = ctx.createLinearGradient(0, B.y + B.h * .7, 0, B.y + B.h * 1.05);
    lg.addColorStop(0, 'rgba(200,60,20,0)'); lg.addColorStop(.7, `rgba(200,70,24,${(.1 * f).toFixed(3)})`); lg.addColorStop(1, `rgba(255,170,60,${(.16 * f).toFixed(3)})`);
    ctx.fillStyle = lg; ctx.fillRect(B.x - B.w * .05, B.y + B.h * .7, B.w * 1.1, B.h * .35);
    /* the lights: slow, swaying, a bright core in a wide glow */
    for (let i = 0; i < nL; i++) {
      const P = 16 + hash(seed, 1, i) * 10, s = slot(t, P, .6 + hash(seed, 2, i) * P * .9);
      if (!s) continue;
      const h = j => hash(seed + s.k * 17, j, i), y = bot - s.u * (bot - top), x = B.x + B.w * (.06 + .88 * h(3)) + Math.sin(s.a * (.5 + h(4) * .4) + i) * B.w * .015;
      const r = (14 + 14 * h(5)) * u + 4, fl = .85 + .15 * Math.sin(t * (5 + 3 * h(6)) + i), a = A * fl * Math.min(1, s.u * 6, (1 - s.u) * 5) * (.6 + .4 * h(7));
      ctx.globalAlpha = a * .7; ctx.drawImage(gold, x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4);
      ctx.globalAlpha = a; ctx.drawImage(core, x - r * .45, y - r * .45, r * .9, r * .9);
    }
    /* golden sparks, climbing faster and flickering */
    const pb = new Path2D(), sz = Math.max(1, 1.8 * u);
    for (let i = 0; i < nS; i++) {
      const P = 5 + hash(seed, 11, i) * 5, s = slot(t, P, .3 + hash(seed, 12, i) * P);
      if (!s) continue;
      const h = j => hash(seed + s.k * 13, j, i), y = bot - s.u * (bot - top) * (.6 + .4 * h(3)), x = B.x + B.w * (.04 + .92 * h(4)) + Math.sin(s.a * 2 + i) * 6 * u;
      if (Math.sin(t * (9 + 6 * h(5)) + i * 3) > -.2 && s.u < .92) pb.rect(x, y, sz, sz * 2.2);
    }
    ctx.globalAlpha = A * smooth(.3, 2, t) * .85; ctx.fillStyle = 'rgba(255,214,130,1)'; ctx.fill(pb);
    /* a few deep red embers */
    for (let i = 0; i < nE; i++) {
      const P = 10 + hash(seed, 21, i) * 8, s = slot(t, P, 1 + hash(seed, 22, i) * P);
      if (!s) continue;
      const h = j => hash(seed + s.k * 19, j, i), y = bot - s.u * (bot - top) * .8, x = B.x + B.w * (.05 + .9 * h(3)) + Math.sin(s.a + i) * B.w * .01;
      const r = (2.5 + 3 * h(4)) * u + 1.2;
      ctx.globalAlpha = A * Math.min(1, s.u * 5, (1 - s.u) * 4) * (.3 + .25 * Math.sin(t * 4 + i)); ctx.drawImage(red, x - r * 2, y - r * 2, r * 4, r * 4);
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
