/* The first day of summer (the June solstice): the sun stands just beyond the top right corner of the book, its rays
   fall slowly turning over the spread with dust glinting in them; a dandelion clock stands at the foot of the left page
   and lets its seeds go, one by one, drifting up and away on the warm air; at the foot of the pages the air shimmers in
   the heat. Endless, from the time since the start (slots, sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, slot, canvas, softDot } = util;

/* the seed head of a dandelion, drawn once: fine white parachutes round a pale dome */
function clockSprite(px, seed) {
  const c = canvas(px, px), x = c.getContext('2d'), cx = px / 2, cy = px / 2, r = px * .46;
  x.lineCap = 'round';
  for (let i = 0; i < 150; i++) {
    const a = hash(seed, 1, i) * TAU, z = hash(seed, 2, i), rr = r * (.8 + .2 * z), ex = cx + Math.cos(a) * rr, ey = cy + Math.sin(a) * rr * (.9 + .1 * z);
    if (hash(seed, 3, i) < .12) continue;   /* some already flown */
    x.strokeStyle = 'rgba(110,100,80,.28)'; x.lineWidth = Math.max(.8, px * .007);
    x.beginPath(); x.moveTo(cx + Math.cos(a) * r * .12, cy + Math.sin(a) * r * .12); x.lineTo(ex, ey); x.stroke();
    for (let k = 0; k < 9; k++) { const b = a + (k - 4) * .16, l = r * .14; x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex + Math.cos(b) * l, ey + Math.sin(b) * l); x.stroke(); }
    x.strokeStyle = `rgba(240,236,220,${(.35 + .3 * z).toFixed(2)})`; x.lineWidth = Math.max(.4, px * .003);
    x.beginPath(); x.moveTo(cx + Math.cos(a) * r * .12, cy + Math.sin(a) * r * .12); x.lineTo(ex, ey); x.stroke();
    x.strokeStyle = `rgba(255,255,255,${(.4 + .4 * z).toFixed(2)})`; x.lineWidth = Math.max(.3, px * .002);
    for (let k = 0; k < 9; k++) { const b = a + (k - 4) * .16, l = r * .14; x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex + Math.cos(b) * l, ey + Math.sin(b) * l); x.stroke(); }
  }
  const g = x.createRadialGradient(cx - r * .03, cy - r * .03, 0, cx, cy, r * .13);
  g.addColorStop(0, '#d9d0a8'); g.addColorStop(1, '#8a7a4a');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r * .12, 0, TAU); x.fill();
  return c;
}
function seedSprite(px) {
  const c = canvas(px, px * 1.6), x = c.getContext('2d'), cx = px / 2;
  x.lineCap = 'round';
  for (const [st, lw] of [['rgba(110,100,80,.3)', .05], ['rgba(255,255,255,.9)', .02]]) for (let k = 0; k < 13; k++) { x.strokeStyle = st; x.lineWidth = Math.max(.4, px * lw); const b = -Math.PI / 2 + (k - 6) * .2; x.beginPath(); x.moveTo(cx, px * .5); x.lineTo(cx + Math.cos(b) * px * .45, px * .5 + Math.sin(b) * px * .45); x.stroke(); }
  if (0) for (let k = 0; k < 13; k++) { const b = -Math.PI / 2 + (k - 6) * .2; x.beginPath(); x.moveTo(cx, px * .5); x.lineTo(cx + Math.cos(b) * px * .45, px * .5 + Math.sin(b) * px * .45); x.stroke(); }
  x.strokeStyle = 'rgba(235,230,210,.8)'; x.beginPath(); x.moveTo(cx, px * .5); x.lineTo(cx, px * 1.3); x.stroke();
  x.fillStyle = '#7a5a30'; x.beginPath(); x.ellipse(cx, px * 1.38, px * .05, px * .12, 0, 0, TAU); x.fill();
  return c;
}

export function create({ box, seed, quality }) {
  let B = box, clock = null, clockKey = 0;
  const seedImg = seedSprite(48), mote = softDot('255,244,200', 24, .3), sun = softDot('255,246,210', 96, .08);
  const NS = quality === 0 ? 8 : 14, NM = quality === 0 ? 24 : 44;

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, wide = B.w > B.h, U = Math.min(B.w, B.h * 1.1);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* warm summer air over everything */
    ctx.fillStyle = `rgba(255,214,140,${(.07 * A * smooth(0, 2, t)).toFixed(3)})`; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const sx = B.x + B.w * 1.02, sy = B.y - B.h * .1, rise = smooth(0, 3, t);
    /* the sun's glow and its rays, turning slowly */
    ctx.globalAlpha = A * rise * .9; const sd = U * .55; ctx.drawImage(sun, sx - sd, sy - sd, 2 * sd, 2 * sd);
    for (let i = 0; i < 8; i++) {
      const ang = Math.PI * .62 + (i - 3.5) * .085 + Math.sin(t * .05 + i * 1.7) * .02, len = Math.hypot(B.w, B.h) * 1.1, wid = .02 + .025 * hash(seed, 1, i);
      const a = A * rise * (.06 + .05 * hash(seed, 2, i)) * (.75 + .25 * Math.sin(t * .3 + i * 2));
      const g = ctx.createLinearGradient(sx, sy, sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
      g.addColorStop(0, `rgba(255,240,190,${a.toFixed(3)})`); g.addColorStop(.6, `rgba(255,236,180,${(a * .45).toFixed(3)})`); g.addColorStop(1, 'rgba(255,236,180,0)');
      ctx.fillStyle = g; ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(ang - wid) * len, sy + Math.sin(ang - wid) * len); ctx.lineTo(sx + Math.cos(ang + wid) * len, sy + Math.sin(ang + wid) * len); ctx.closePath(); ctx.fill();
    }
    /* dust glinting in the light */
    for (let i = 0; i < NM; i++) {
      const P = 14 + hash(seed, 10, i) * 10, s = slot(t, P, -hash(seed, 11, i) * P);
      const h = j => hash(seed + s.k * 7, j, i), x = B.x + B.w * (.3 + .7 * h(1)) + Math.sin(s.a * .4 + i) * U * .04, y = B.y + B.h * (.05 + .8 * h(2)) + s.u * U * .06;
      const gl = Math.max(0, Math.sin(t * (1.5 + h(3) * 2) + i * 3)), d = (1.5 + 2 * h(4)) * U / 1000 + 1;
      ctx.globalAlpha = A * rise * (.25 + .7 * gl * gl) * Math.min(1, s.u * 6, (1 - s.u) * 6); ctx.drawImage(mote, x - d * 2, y - d * 2, d * 4, d * 4);
    }
    ctx.globalCompositeOperation = 'source-over';
    /* the heat shimmering at the foot of the pages */
    ctx.lineWidth = Math.max(1, U * .002);
    for (let i = 0; i < 7; i++) {
      const s = slot(t, 3.5, i * .5);
      if (!s) continue;
      const y = B.y + B.h * (1.0 - .2 * s.u), a = A * .08 * Math.sin(Math.PI * s.u) * rise;
      ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`; ctx.beginPath();
      for (let x = B.x; x <= B.x + B.w; x += 8) { const yy = y + Math.sin(x * .03 + t * 3 + i) * U * .004 + Math.sin(x * .011 - t * 2) * U * .003; if (x === B.x) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
      ctx.stroke();
    }
    /* the dandelion: stem from below the page, the clock, and its seeds flying off */
    const hx = B.x + B.w * (wide ? .14 : .2), hy = B.y + B.h * (wide ? .64 : .68), cr = U * (wide ? .085 : .11), grow = smooth(.3, 2, t);
    const cpx = Math.round(cr * 2 * Math.min(2, window.devicePixelRatio || 1));
    if (cpx !== clockKey) { clock = clockSprite(cpx, seed); clockKey = cpx; }
    const sw = Math.sin(t * .8) * cr * .08;
    ctx.globalAlpha = A * grow;
    ctx.strokeStyle = '#6f8a3a'; ctx.lineWidth = Math.max(2, cr * .06); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - cr * .2, B.y + B.h * 1.02); ctx.quadraticCurveTo(hx - cr * .3, hy + (B.y + B.h - hy) * .5, hx + sw, hy + cr * .1); ctx.stroke();
    ctx.drawImage(clock, hx + sw - cr, hy - cr, cr * 2, cr * 2);
    for (let i = 0; i < NS; i++) {
      const P = 9 + hash(seed, 30, i) * 6, s = slot(t, P, 2 + hash(seed, 31, i) * P);
      if (!s) continue;
      const h = j => hash(seed + s.k * 11, j, i), a0 = -Math.PI * (.15 + .6 * h(1));
      const x = hx + sw + Math.cos(a0) * cr * .8 + s.a * U * (.035 + .02 * h(2)) + Math.sin(s.a * .9 + i) * U * .02;
      const y = hy + Math.sin(a0) * cr * .8 - s.a * U * (.02 + .02 * h(3)) - s.a * s.a * U * .0015;
      const d = U * (.022 + .008 * h(4));
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(s.a * 1.2 + i) * .4);
      ctx.globalAlpha = A * Math.min(1, s.u * 10, (1 - s.u) * 4); ctx.drawImage(seedImg, -d / 2, -d * .5, d, d * 1.6);
      ctx.restore();
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { clock = null; } };
}
