/* Dec 24, Christmas Eve ("Stille Nacht"): the night falls blue over the book, the star of Bethlehem rises above the spread -
   a bright core, a soft halo and long rays, the longest pointing down onto the book - with a faint cone of light, a few
   small stars twinkling round it and snow falling gently. Endless, from the time since the start (sondertage.js).
   layer: on a Sunday of Advent the wreath keeps the page - then only a smaller star in the top right corner. */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, softDot, snowfall } = util;

export function create({ box, seed, layer, veil }) {
  let B = box;
  const snow = snowfall(seed, 90, { speed: .65, alpha: .85 });
  const spark = softDot('255,248,225', 64, .1), tiny = softDot('225,235,255', 24, .3);
  const veilMax = veil == null ? .64 : veil;

  /* one ray: a thin, soft ellipse from the core outwards */
  function ray(ctx, x, y, ang, len, wid, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, wid / len);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
    g.addColorStop(0, `rgba(255,252,236,${a})`); g.addColorStop(.25, `rgba(255,236,190,${a * .45})`); g.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, len, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000;
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (!layer) {
      /* the night: deep blue, a touch lighter low down */
      const v = A * veilMax * smooth(0, 2.2, t), g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgba(4,8,26,${v.toFixed(3)})`); g.addColorStop(1, `rgba(10,16,40,${(v * .82).toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'lighter';
    /* small stars, twinkling (only round the star and above the book, never over the questions' middle) */
    if (!layer) {
      for (let i = 0; i < 46; i++) {
        const x = hash(seed, 1, i) * W, y = hash(seed, 2, i) * Math.max(B.y + B.h * .35, H * .3);
        const tw = .5 + .5 * Math.sin(t * (.8 + hash(seed, 3, i) * 1.6) + i * 2.1), d = (3 + 4 * hash(seed, 4, i)) * Math.max(.6, u);
        ctx.globalAlpha = A * smooth(1.5, 4, t) * (.15 + .5 * tw) * hash(seed, 5, i); ctx.drawImage(tiny, x - d, y - d, 2 * d, 2 * d);
      }
      ctx.globalAlpha = 1;
    }
    /* the star of Bethlehem: rises in over the first seconds, breathes slowly */
    const sx = B.x + B.w * (layer ? .86 : B.w > B.h ? .64 : .62), sy = B.y + B.h * (layer ? .1 : .15);
    const k = (layer ? .55 : 1) * u, rise = smooth(1, 5, t), br = rise * (.9 + .1 * Math.sin(t * .9) + .04 * Math.sin(t * 2.7 + 1));
    if (br > 0) {
      const a = A * br;
      if (!layer) {
        /* a faint cone of light down onto the book */
        const g = ctx.createLinearGradient(sx, sy, sx, B.y + B.h);
        g.addColorStop(0, `rgba(255,236,190,${(.09 * a).toFixed(3)})`); g.addColorStop(1, 'rgba(255,236,190,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - B.w * .2, B.y + B.h); ctx.lineTo(sx + B.w * .12, B.y + B.h); ctx.closePath(); ctx.fill();
      }
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, 150 * k);
      halo.addColorStop(0, `rgba(255,244,214,${(.5 * a).toFixed(3)})`); halo.addColorStop(.3, `rgba(255,224,170,${(.16 * a).toFixed(3)})`); halo.addColorStop(1, 'rgba(255,210,150,0)');
      ctx.fillStyle = halo; ctx.fillRect(sx - 150 * k, sy - 150 * k, 300 * k, 300 * k);
      const s1 = 1 + .06 * Math.sin(t * 1.3), s2 = 1 + .08 * Math.sin(t * 1.7 + 2);
      ray(ctx, sx, sy, Math.PI / 2, 380 * k * s1 * rise, 7 * k, .85 * a);    /* down, the longest */
      ray(ctx, sx, sy, -Math.PI / 2, 170 * k * s2 * rise, 6 * k, .8 * a);
      ray(ctx, sx, sy, 0, 160 * k * s2 * rise, 6 * k, .8 * a);
      ray(ctx, sx, sy, Math.PI, 160 * k * s1 * rise, 6 * k, .8 * a);
      for (let i = 0; i < 4; i++) ray(ctx, sx, sy, Math.PI / 4 + i * Math.PI / 2, 70 * k * (1 + .1 * Math.sin(t * 2.1 + i)) * rise, 4 * k, .55 * a);
      const d = 40 * k;
      ctx.globalAlpha = a; ctx.drawImage(spark, sx - d, sy - d, 2 * d, 2 * d); ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
    if (!layer && t > .8) snow(ctx, t - .8, B, A * smooth(.8, 3, t), Math.max(.6, u));
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
