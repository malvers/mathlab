/* Dec 26, Boxing Day (the Dresdner Kreuzchor sings "Ihr Kinderlein, kommet"): quieter than Christmas Day's theatre, no
   curtain. The room sinks into warm candlelight - an amber dusk round the book, two pools of candlelight glowing up from
   below its corners and flickering gently - golden foil stars drift down slowly, turning and now and then catching the
   light, and the star of Christmas Eve stands smaller and quieter beside the book's top corner. Endless, from the time
   since the start (sondertage.js): every star's fall comes from its slot, nothing piles up. */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, slot, canvas, softDot } = util;

/* a five-pointed star of gold foil, drawn once: each point folded into a lit and a shaded half, a fine bright rim */
function starSprite(px, lit, shade) {
  const c = canvas(px, px), x = c.getContext('2d'), m = px / 2, r = px * .46, ri = r * .42;
  const pt = (a, rad) => [m + Math.cos(a) * rad, m + Math.sin(a) * rad];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * TAU / 5, [tx, ty] = pt(a, r), [lx, ly] = pt(a - Math.PI / 5, ri), [rx, ry] = pt(a + Math.PI / 5, ri);
    for (const [vx, vy, col] of [[lx, ly, lit], [rx, ry, shade]]) {
      const g = x.createLinearGradient(m, m, tx, ty);
      g.addColorStop(0, `rgb(${col[0]},${col[1]},${col[2]})`); g.addColorStop(1, `rgb(${col.map(v => Math.round(v * .82)).join(',')})`);
      x.fillStyle = g; x.beginPath(); x.moveTo(m, m); x.lineTo(tx, ty); x.lineTo(vx, vy); x.closePath(); x.fill();
    }
  }
  x.strokeStyle = 'rgba(255,240,190,.9)'; x.lineWidth = px * .018; x.lineJoin = 'round'; x.beginPath();
  for (let i = 0; i < 10; i++) { const [px2, py2] = pt(-Math.PI / 2 + i * Math.PI / 5, i % 2 ? ri : r); if (i) x.lineTo(px2, py2); else x.moveTo(px2, py2); }
  x.closePath(); x.stroke();
  return c;
}

export function create({ box, seed, quality, veil }) {
  let B = box;
  const stars = [starSprite(72, [255, 226, 150], [196, 142, 48]), starSprite(72, [250, 210, 120], [176, 120, 36]), starSprite(72, [255, 236, 186], [210, 160, 70])];
  const glint = softDot('255,236,180', 48, .12), spark = softDot('255,248,225', 64, .1), halo = softDot('255,190,100', 64, .2);
  const veilMax = veil == null ? .5 : veil, N = quality === 0 ? 22 : quality === 1 ? 32 : 40;

  /* one ray of the small star: a thin, soft ellipse from the core outwards (as on Christmas Eve) */
  function ray(ctx, x, y, ang, len, wid, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, wid / len);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
    g.addColorStop(0, `rgba(255,250,232,${a})`); g.addColorStop(.25, `rgba(255,232,182,${a * .45})`); g.addColorStop(1, 'rgba(255,216,150,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, len, 0, TAU); ctx.fill();
    ctx.restore();
  }
  /* the candles' flicker: a few slow and quick waves, the same in every copy */
  const flick = (t, i) => .86 + .06 * Math.sin(t * (6.1 + i) + i * 2) + .05 * Math.sin(t * (11.3 - i * .7) + 1 + i) + .03 * Math.sin(t * 2.3 + i * 4);

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000;
    const cx = B.x + B.w / 2, cy = B.y + B.h / 2, inA = A * smooth(0, 2.5, t);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* the dusk: warm and brown, lighter over the book, deeper towards the window's edges */
    const R = Math.hypot(W, H) * .6, g = ctx.createRadialGradient(cx, cy, Math.min(B.w, B.h) * .3, cx, cy, R);
    g.addColorStop(0, `rgba(30,14,4,${(veilMax * .38 * inA).toFixed(3)})`); g.addColorStop(1, `rgba(20,8,2,${(veilMax * inA).toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    /* candlelight from below the book's two lower corners, flickering a little */
    for (let i = 0; i < 2; i++) {
      const x = B.x + B.w * (i ? .97 : .03), y = Math.min(H, B.y + B.h * 1.02), r = S * .62 * (.97 + .03 * flick(t, i));
      const L = ctx.createRadialGradient(x, y, 0, x, y, r), a = .26 * inA * flick(t, i);
      L.addColorStop(0, `rgba(255,176,82,${a.toFixed(3)})`); L.addColorStop(.35, `rgba(255,150,60,${(a * .45).toFixed(3)})`); L.addColorStop(1, 'rgba(255,130,40,0)');
      ctx.fillStyle = L; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    /* the star of Christmas Eve, smaller and quieter, breathing slowly: on the desk beside the book's top right corner where
       there is room, else above the page's corner, over the tabs - never on the page's heading */
    const gap = W - B.x - B.w, k = .5 * u, rise = smooth(1.5, 6, t), roomy = gap > 120 * u;
    const sx = roomy ? B.x + B.w + Math.min(gap * .4, 110 * u) : B.x + B.w * .86, sy = Math.max(24 * u, B.y * .42);
    if (rise > 0) {
      const a = A * rise * (.9 + .1 * Math.sin(t * .8)), hr = 120 * k;
      ctx.globalAlpha = a * .7; ctx.drawImage(halo, sx - hr, sy - hr, 2 * hr, 2 * hr); ctx.globalAlpha = 1;
      const s1 = 1 + .05 * Math.sin(t * 1.1), s2 = 1 + .06 * Math.sin(t * 1.5 + 2);
      ray(ctx, sx, sy, Math.PI / 2, (roomy ? 260 : 170) * k * s1 * rise, 6 * k, .7 * a);
      ray(ctx, sx, sy, -Math.PI / 2, 130 * k * s2 * rise, 5 * k, .65 * a);
      ray(ctx, sx, sy, 0, 125 * k * s2 * rise, 5 * k, .65 * a);
      ray(ctx, sx, sy, Math.PI, 125 * k * s1 * rise, 5 * k, .65 * a);
      for (let i = 0; i < 4; i++) ray(ctx, sx, sy, Math.PI / 4 + i * Math.PI / 2, 55 * k * (1 + .1 * Math.sin(t * 1.9 + i)) * rise, 3.5 * k, .45 * a);
      const d = 34 * k; ctx.globalAlpha = a; ctx.drawImage(spark, sx - d, sy - d, 2 * d, 2 * d); ctx.globalAlpha = 1;
    }
    /* the golden stars: three depths, slowly falling, swaying and turning; now and then one catches the light */
    if (t > .6) {
      const tt = t - .6, a0 = A * smooth(.6, 3.5, t), U = Math.max(.6, u);
      for (let i = 0; i < N; i++) {
        const z = hash(seed, 700, i), P = 15 + 13 * (1 - z), s = slot(tt, P, -hash(seed, 701, i) * P);
        const h1 = hash(seed + s.k, 702, i), h2 = hash(seed + s.k, 703, i), h3 = hash(seed + s.k, 704, i);
        const y = -24 + s.u * (H + 48), x = h1 * W + Math.sin(tt * (.25 + h2 * .3) + i) * (14 + 26 * z) * U;
        const d = (7 + 13 * z) * U, rot = h3 * TAU + tt * (h2 - .5) * .7;
        const fade = Math.min(1, s.u * 10, (1 - s.u) * 10), aa = a0 * fade * (.45 + .5 * z);
        /* the soft warm light round it, then the foil star itself (not added, so it stays gold) */
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = aa * .35;
        ctx.drawImage(halo, x - d * 1.6, y - d * 1.6, d * 3.2, d * 3.2);
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = aa;
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, .82 + .18 * Math.cos(tt * (.6 + h2) + i));   /* it tilts as it turns */
        ctx.drawImage(stars[i % 3], -d, -d, 2 * d, 2 * d); ctx.restore();
        const gl = Math.max(0, Math.sin(tt * (.7 + h1 * .9) + i * 1.7)) ** 12;
        if (gl > .02) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = aa * gl; const q = d * 1.4; ctx.drawImage(glint, x - q, y - q, 2 * q, 2 * q); }
      }
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
