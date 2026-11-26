/* Nov 11, St Martin: a lantern procession - paper lanterns on sticks, round and pleated, stars and moons, each with a candle
   inside, come in from the left and walk slowly across the foot of the spread, bobbing with the steps and swinging a
   little, their warm light on the page; the night blue above, a few stars. Endless: every lantern that leaves on the right
   comes back on the left as another one (the procession is a loop of slots, sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, softDot } = util;

const PAPER = [[255, 150, 40], [255, 196, 60], [230, 70, 40], [255, 120, 150], [120, 170, 255], [140, 220, 120]];

export function create({ box, seed, quality, veil }) {
  let B = box;
  const glow = softDot('255,178,90', 64, .08), tiny = softDot('225,235,255', 24, .3);
  const veilMax = veil == null ? .6 : veil;
  const N = quality === 0 ? 6 : 8;

  function lantern(ctx, kind, col, r, b, wob) {
    const [R, G, Bc] = col, lit = (k) => `rgba(${Math.min(255, R + 90 * k) | 0},${Math.min(255, G + 80 * k) | 0},${Math.min(255, Bc + 60 * k) | 0},`;
    if (kind === 0) {
      /* a round paper lantern, pleated, with dark rims top and bottom */
      const g = ctx.createRadialGradient(0, r * .15, r * .05, 0, 0, r * 1.05);
      g.addColorStop(0, `rgba(255,248,220,${(.98 * b).toFixed(3)})`); g.addColorStop(.35, lit(.6) + (.95 * b).toFixed(3) + ')');
      g.addColorStop(.8, `rgba(${R},${G},${Bc},${(.9 * b).toFixed(3)})`); g.addColorStop(1, `rgba(${R * .55 | 0},${G * .45 | 0},${Bc * .45 | 0},.95)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r, r * .92, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(${R * .5 | 0},${G * .35 | 0},${Bc * .35 | 0},.35)`; ctx.lineWidth = Math.max(.6, r * .025);
      for (let i = -3; i <= 3; i++) { const yy = i * r * .26, w = Math.sqrt(Math.max(0, 1 - (yy / (r * .92)) ** 2)) * r; ctx.beginPath(); ctx.ellipse(0, yy, w, r * .07, 0, 0, Math.PI); ctx.stroke(); }
      ctx.fillStyle = '#2a1a10';
      ctx.beginPath(); ctx.ellipse(0, -r * .9, r * .42, r * .1, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, r * .86, r * .36, r * .09, 0, 0, TAU); ctx.fill();
    } else if (kind === 1) {
      /* a star lantern: two layers of paper, the front one lit */
      const star = (rr, o) => { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2 + wob * .1, q = i % 2 ? rr * .48 : rr; ctx.lineTo(Math.cos(a) * q + o, Math.sin(a) * q + o * .6); } ctx.closePath(); };
      ctx.fillStyle = `rgba(${R * .45 | 0},${G * .35 | 0},${Bc * .3 | 0},.95)`; star(r * 1.12, r * .08); ctx.fill();
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.1);
      g.addColorStop(0, `rgba(255,250,225,${b.toFixed(3)})`); g.addColorStop(.45, lit(.5) + (.95 * b).toFixed(3) + ')'); g.addColorStop(1, `rgba(${R},${G},${Bc},${(.85 * b).toFixed(3)})`);
      ctx.fillStyle = g; star(r * 1.1, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(60,30,10,.55)'; ctx.lineWidth = Math.max(.7, r * .04); ctx.stroke();
    } else {
      /* a moon lantern */
      ctx.save(); ctx.rotate(-.35 + wob * .1);
      const moon = () => { ctx.beginPath(); ctx.arc(0, 0, r, Math.PI * .28, Math.PI * 1.72, false); ctx.arc(r * .42, -r * .05, r * .78, Math.PI * 1.55, Math.PI * .45, true); ctx.closePath(); };
      const g = ctx.createRadialGradient(-r * .3, 0, 0, -r * .2, 0, r * 1.1);
      g.addColorStop(0, `rgba(255,250,225,${b.toFixed(3)})`); g.addColorStop(.5, lit(.5) + (.95 * b).toFixed(3) + ')'); g.addColorStop(1, `rgba(${R},${G},${Bc},${(.85 * b).toFixed(3)})`);
      ctx.fillStyle = g; moon(); ctx.fill();
      ctx.strokeStyle = 'rgba(60,30,10,.55)'; ctx.lineWidth = Math.max(.7, r * .04); ctx.stroke();
      ctx.restore();
    }
  }

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, wide = B.w > B.h;
    const S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000;
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const v = A * veilMax * smooth(0, 2, t), g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgba(6,10,30,${v.toFixed(3)})`); g.addColorStop(1, `rgba(12,12,28,${(v * .85).toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 36; i++) {
      const x = hash(seed, 1, i) * W, y = hash(seed, 2, i) * (B.y + B.h * .3), tw = .5 + .5 * Math.sin(t * (.7 + hash(seed, 3, i)) + i), d = (3 + 3 * hash(seed, 4, i)) * Math.max(.6, u);
      ctx.globalAlpha = A * smooth(1, 3, t) * (.1 + .4 * tw) * hash(seed, 5, i); ctx.drawImage(tiny, x - d, y - d, 2 * d, 2 * d);
    }
    ctx.globalAlpha = 1;
    /* the procession: N lanterns on a loop a little longer than the spread, walking left to right */
    const r0 = (wide ? .045 : .07) * B.w, gap = (B.w + 4 * r0) / N, len = gap * N, speed = B.w / (wide ? 38 : 30);
    const baseY = B.y + B.h * (wide ? .84 : .82), L = [];
    for (let i = 0; i < N; i++) {
      const pos = t * speed + i * gap + hash(seed, 9, i) * gap * .3, k = Math.floor(pos / len), x = B.x - 2 * r0 + (pos - k * len);
      const h = j => hash(seed + k * 31, j, i), kind = h(1) < .55 ? 0 : h(1) < .8 ? 1 : 2, col = PAPER[Math.floor(h(2) * PAPER.length)];
      const r = r0 * (.75 + .4 * h(3)), step = t * (1.6 + .3 * h(4)) + h(5) * 6, bob = -Math.abs(Math.sin(step * Math.PI)) * r * .18;
      const swing = Math.sin(step * Math.PI + .6) * .12, stickH = r * (2.6 + .8 * h(6));
      const fl = .82 + .1 * Math.sin(t * 13 + i * 3) + .06 * Math.sin(t * 29 + i);
      const fade = Math.min(1, (x - (B.x - 2 * r0)) / (2 * r0), (B.x + B.w + 2 * r0 - x) / (2 * r0));
      L.push({ x, y: baseY + bob - r * (.4 * h(7)), kind, col, r, swing, stickH, fl, fade: clamp(fade, 0, 1) * A * smooth(.5 + i * .15, 2 + i * .15, t), lean: .35 + .2 * h(8) });
    }
    /* the light each lantern throws on the page */
    for (const l of L) {
      if (l.fade <= 0) continue;
      ctx.globalAlpha = l.fade * .55 * l.fl; const d = l.r * 5;
      ctx.drawImage(glow, l.x - d, l.y + l.r * .4 - d, 2 * d, 2 * d);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    for (const l of L) {
      if (l.fade <= 0) continue;
      /* the stick, held from below to the left, and the wire down to the lantern */
      const tx = l.x - l.r * .15, ty = l.y - l.r * 1.9, fx = tx - l.stickH * Math.sin(l.lean), fy = ty + l.stickH * Math.cos(l.lean) * 1.4;
      ctx.globalAlpha = l.fade;
      ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = Math.max(1, l.r * .07); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(l.swing);
      ctx.strokeStyle = 'rgba(40,30,20,.8)'; ctx.lineWidth = Math.max(.6, l.r * .025);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-l.r * .35, l.r * .95); ctx.moveTo(0, 0); ctx.lineTo(l.r * .35, l.r * .95); ctx.stroke();
      ctx.translate(0, l.r * 1.9);
      lantern(ctx, l.kind, l.col, l.r, l.fl, l.swing);
      ctx.restore();
    }
    /* and the glow round the lanterns themselves */
    ctx.globalCompositeOperation = 'lighter';
    for (const l of L) {
      if (l.fade <= 0) continue;
      ctx.globalAlpha = l.fade * .4 * l.fl; const d = l.r * 2.4;
      ctx.drawImage(glow, l.x - d, l.y - d, 2 * d, 2 * d);
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
