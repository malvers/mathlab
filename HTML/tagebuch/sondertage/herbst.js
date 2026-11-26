/* The first day of autumn (the September equinox): a storm - autumn leaves (maple, oak, beech; red, orange, gold, brown)
   are blown across the spread in gusts, tumbling and turning, swirling up in eddies; faint streaks of wind race past and
   the light goes a little grey. Endless: every leaf that leaves on the right comes back on the left as another one
   (slots, sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, slot, canvas } = util;

const COLS = [['#c2361c', '#7d1d0e'], ['#e0761e', '#9a3f0e'], ['#e9b72c', '#a2711a'], ['#9a5a26', '#5a3214'], ['#c98a1e', '#7a4e12']];

/* a leaf, drawn once per shape and colour: 0 maple, 1 oak, 2 beech - with veins, pointing up */
function leafSprite(px, shape, col, seed) {
  const c = canvas(px, px), x = c.getContext('2d'), s = px / 100, p = new Path2D();
  if (shape === 0) {
    const pts = [[50, 4], [58, 26], [74, 16], [70, 36], [94, 34], [80, 52], [88, 60], [62, 64], [56, 78], [50, 72], [44, 78], [38, 64], [12, 60], [20, 52], [6, 34], [30, 36], [26, 16], [42, 26]];
    p.moveTo(pts[0][0] * s, pts[0][1] * s);
    for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i], [pa, pb] = pts[i - 1]; p.quadraticCurveTo((pa + a) / 2 * s + (hash(seed, 1, i) - .5) * 4 * s, (pb + b) / 2 * s, a * s, b * s); }
    p.closePath();
  } else if (shape === 1) {
    p.moveTo(50 * s, 6 * s);
    for (let i = 0; i <= 10; i++) { const y = 10 + i * 7, w = 18 + 10 * Math.sin(i * 1.3) * (i % 2 ? 1 : .4) + 8 * Math.sin(i / 10 * Math.PI); p.quadraticCurveTo((50 + w + 6) * s, (y - 3) * s, (50 + w) * s, (y + 3) * s); }
    p.lineTo(52 * s, 82 * s); p.lineTo(48 * s, 82 * s);
    for (let i = 10; i >= 0; i--) { const y = 10 + i * 7, w = 18 + 10 * Math.sin(i * 1.3) * (i % 2 ? 1 : .4) + 8 * Math.sin(i / 10 * Math.PI); p.quadraticCurveTo((50 - w - 6) * s, (y + 6) * s, (50 - w) * s, y * s); }
    p.closePath();
  } else {
    p.moveTo(50 * s, 4 * s); p.bezierCurveTo(84 * s, 20 * s, 80 * s, 62 * s, 50 * s, 82 * s); p.bezierCurveTo(20 * s, 62 * s, 16 * s, 20 * s, 50 * s, 4 * s);
  }
  const g = x.createRadialGradient(42 * s, 36 * s, 4 * s, 50 * s, 46 * s, 50 * s);
  g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
  x.fillStyle = g; x.fill(p);
  x.save(); x.clip(p);
  for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(${hash(seed, 2, i) < .5 ? '60,25,5' : '255,220,150'},${(hash(seed, 3, i) * .12).toFixed(3)})`; x.fillRect(hash(seed, 4, i) * px, hash(seed, 5, i) * px, 2 * s, 2 * s); }
  x.restore();
  x.strokeStyle = 'rgba(70,30,10,.45)'; x.lineWidth = 1.4 * s; x.lineCap = 'round';
  x.beginPath(); x.moveTo(50 * s, 96 * s); x.lineTo(50 * s, 10 * s); x.stroke();
  x.lineWidth = .8 * s;
  const veins = shape === 0 ? [[50, 60, 20, 36], [50, 60, 80, 36], [50, 64, 14, 58], [50, 64, 86, 58], [50, 56, 30, 18], [50, 56, 70, 18]] : [[50, 26, 30, 18], [50, 26, 70, 18], [50, 42, 26, 34], [50, 42, 74, 34], [50, 58, 28, 52], [50, 58, 72, 52], [50, 70, 36, 68], [50, 70, 64, 68]];
  for (const [a, b, cc, d] of veins) { x.beginPath(); x.moveTo(a * s, b * s); x.lineTo(cc * s, d * s); x.stroke(); }
  return c;
}

export function create({ box, seed, quality }) {
  let B = box;
  const L = [];
  for (let sh = 0; sh < 3; sh++) for (let ci = 0; ci < COLS.length; ci++) L.push(leafSprite(96, sh, COLS[ci], seed + sh * 7 + ci));
  const N = quality === 0 ? 26 : quality === 1 ? 40 : 54;
  /* the wind: steady with gusts (its integral moves the leaves, so they speed up and slow down together) */
  const gust = t => t * 1 + .35 * Math.sin(t * .45) / .45 + .2 * Math.sin(t * 1.1 + 1) / 1.1;

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, U = Math.min(B.w, B.h * 1.1);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const v = A * smooth(0, 2, t), g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgba(40,38,44,${(.3 * v).toFixed(3)})`); g.addColorStop(1, `rgba(50,36,22,${(.18 * v).toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    /* streaks of wind */
    ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
      const s = slot(t, 2.2 + hash(seed, 80, i) * 1.5, hash(seed, 81, i) * 2);
      if (!s) continue;
      const h = j => hash(seed + s.k * 3, j, i), y = B.y + B.h * (.08 + .84 * h(1)), x = -W * .2 + s.u * W * 1.4, len = W * (.12 + .1 * h(2));
      ctx.strokeStyle = `rgba(255,255,255,${(.16 * A * Math.sin(Math.PI * s.u) * v).toFixed(3)})`; ctx.lineWidth = Math.max(1, U * .0025);
      ctx.beginPath(); ctx.moveTo(x - len, y + Math.sin(i) * U * .01); ctx.quadraticCurveTo(x - len / 2, y - U * .02 * (h(3) - .5) * 2, x, y); ctx.stroke();
    }
    /* the leaves: across the whole width and a little beyond, each in its own loop and tumble */
    const span = W + 0.4 * U;
    for (let i = 0; i < N; i++) {
      const phase = hash(seed, 1, i), sp = .12 + .1 * hash(seed, 2, i), pos = gust(t) * sp + phase, k = Math.floor(pos), u = pos - k;
      const h = j => hash(seed + k * 37, j, i), x = -0.2 * U + u * span, base = B.y + B.h * (.05 + .9 * h(1));
      const loop = U * (.02 + .05 * h(2)), lw = 1.2 + h(3) * 1.6, y = base + Math.sin(t * lw + h(4) * 6) * loop * 1.6 + Math.sin(u * TAU * (1 + h(5))) * U * .05;
      const xx = x + Math.cos(t * lw + h(4) * 6) * loop, img = L[Math.floor(h(6) * L.length)], d = U * (.045 + .04 * h(7));
      ctx.save(); ctx.translate(xx, y); ctx.rotate(t * (h(8) - .5) * 5 + h(9) * 6); ctx.scale(Math.max(.15, Math.abs(Math.cos(t * (1 + 2 * h(10)) + i))), 1);
      ctx.globalAlpha = A * smooth(0, 1.5, t - phase * 2) * Math.min(1, u * 12, (1 - u) * 12);
      ctx.drawImage(img, -d / 2, -d / 2, d, d);
      ctx.restore();
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
