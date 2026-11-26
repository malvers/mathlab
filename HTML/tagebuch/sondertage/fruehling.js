/* The first day of spring (the March equinox): two branches of cherry blossom grow in from the corners of the book -
   twigs reaching out, buds swelling and opening into pale pink blossoms - swaying a little in the air; butterflies (a
   brimstone, a small tortoiseshell, a common blue) flutter over the pages, petals drift. Endless: once grown, the branches
   stay and sway, the butterflies keep flying, from the time since the start (sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, rng, slot, canvas } = util;

function blossomSprite(px, open) {
  const c = canvas(px, px), x = c.getContext('2d'), r = px * .48, cx = px / 2, cy = px / 2;
  if (open) {
    for (let i = 0; i < 5; i++) {
      x.save(); x.translate(cx, cy); x.rotate(i * TAU / 5);
      const g = x.createRadialGradient(0, -r * .5, r * .05, 0, -r * .45, r * .6);
      g.addColorStop(0, '#fffafb'); g.addColorStop(.6, '#fbe1e8'); g.addColorStop(1, '#efb3c5');
      x.fillStyle = g; x.beginPath(); x.moveTo(0, -r * .08);
      x.bezierCurveTo(r * .42, -r * .3, r * .38, -r * .95, r * .1, -r * .98); x.lineTo(0, -r * .86); x.lineTo(-r * .1, -r * .98);
      x.bezierCurveTo(-r * .38, -r * .95, -r * .42, -r * .3, 0, -r * .08); x.fill();
      x.strokeStyle = 'rgba(200,110,140,.25)'; x.lineWidth = Math.max(.5, px * .006); x.beginPath(); x.moveTo(0, -r * .12); x.lineTo(0, -r * .7); x.stroke();
      x.restore();
    }
    x.strokeStyle = 'rgba(190,60,90,.75)'; x.lineWidth = Math.max(.5, px * .008);
    for (let i = 0; i < 18; i++) { const a = i * TAU / 18, l = r * (.28 + .1 * (i % 3)); x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l); x.stroke(); x.fillStyle = '#e9c040'; x.beginPath(); x.arc(cx + Math.cos(a) * l, cy + Math.sin(a) * l, px * .012, 0, TAU); x.fill(); }
    x.fillStyle = '#c9d85a'; x.beginPath(); x.arc(cx, cy, r * .09, 0, TAU); x.fill();
  } else {
    x.fillStyle = '#5e7f2e';
    for (let i = 0; i < 3; i++) { x.save(); x.translate(cx, cy + r * .2); x.rotate((i - 1) * .7); x.beginPath(); x.ellipse(0, r * .1, r * .12, r * .3, 0, 0, TAU); x.fill(); x.restore(); }
    const g = x.createRadialGradient(cx - r * .1, cy - r * .2, r * .02, cx, cy - r * .05, r * .4);
    g.addColorStop(0, '#fbd0dc'); g.addColorStop(1, '#d9708e');
    x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy - r * .08, r * .22, r * .34, 0, 0, TAU); x.fill();
  }
  return c;
}

/* one side of a butterfly (fore- and hindwing), pointing right from the body; kinds: 0 brimstone, 1 small tortoiseshell,
   2 common blue */
function wingSprite(px, kind) {
  const c = canvas(px, px), x = c.getContext('2d'), s = px / 100;
  const fore = new Path2D(), hind = new Path2D();
  fore.moveTo(2 * s, 48 * s); fore.bezierCurveTo(20 * s, 10 * s, 70 * s, 2 * s, 92 * s, 14 * s); fore.bezierCurveTo(90 * s, 34 * s, 70 * s, 50 * s, 2 * s, 54 * s); fore.closePath();
  hind.moveTo(2 * s, 54 * s); hind.bezierCurveTo(40 * s, 52 * s, 72 * s, 66 * s, 64 * s, 86 * s); hind.bezierCurveTo(48 * s, 98 * s, 18 * s, 86 * s, 2 * s, 60 * s); hind.closePath();
  const col = [['#f2ea5a', '#d8cf3c', '#b9b032'], ['#e9762a', '#c9531c', '#7a2b10'], ['#7fa6ef', '#5d7fd8', '#3b56a8']][kind];
  for (const [p, g0, g1] of [[hind, col[1], col[2]], [fore, col[0], col[1]]]) {
    const g = x.createLinearGradient(0, 0, 90 * s, 60 * s); g.addColorStop(0, g1); g.addColorStop(.4, g0); g.addColorStop(1, g1);
    x.fillStyle = g; x.fill(p);
  }
  if (kind === 0) { x.fillStyle = '#e48a2a'; x.beginPath(); x.arc(44 * s, 30 * s, 3 * s, 0, TAU); x.arc(36 * s, 70 * s, 2.5 * s, 0, TAU); x.fill(); }
  if (kind === 1) {
    x.fillStyle = '#1d120c'; [[40, 22, 7], [58, 18, 6], [30, 38, 5], [74, 14, 5]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a * s, b * s, r * s, 0, TAU); x.fill(); });
    x.fillStyle = '#f3d24a'; x.beginPath(); x.arc(66 * s, 26 * s, 4 * s, 0, TAU); x.fill();
    x.strokeStyle = '#1d120c'; x.lineWidth = 5 * s; x.stroke(fore); x.stroke(hind);
    x.fillStyle = '#6ab0ff'; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc((20 + i * 8) * s, (88 - i * 4.5) * s, 1.8 * s, 0, TAU); x.fill(); }
  }
  if (kind === 2) { x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 2.5 * s; x.stroke(fore); x.stroke(hind); }
  x.strokeStyle = 'rgba(30,20,10,.35)'; x.lineWidth = .8 * s;
  for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(3 * s, 50 * s); x.lineTo((30 + i * 14) * s, (12 + i * 4) * s); x.stroke(); }
  return c;
}

export function create({ box, seed, quality }) {
  let B = box;
  const R = rng(seed ^ 0x5a17), SEGS = [], BLOS = [];
  /* the branches, in units of U (the book's smaller side) from their anchor; anchor 0 top left, 1 bottom right */
  function grow(a, x, y, ang, len, w, depth, tb) {
    const n = 4, dur = len * 9;
    let px = x, py = y, pa = ang;
    for (let i = 0; i < n; i++) {
      pa += (R() - .5) * .35;
      const nx = px + Math.cos(pa) * len / n, ny = py + Math.sin(pa) * len / n, t0 = tb + dur * i / n;
      SEGS.push({ a, x0: px, y0: py, x1: nx, y1: ny, w: w * (1 - .55 * i / n), t0, t1: t0 + dur / n });
      if (depth > 0 && i > 0 && R() < .8) grow(a, nx, ny, pa + (R() < .5 ? 1 : -1) * (.45 + R() * .5), len * (.45 + R() * .2), w * .55, depth - 1, t0 + dur / n);
      if (i > 0 && R() < (depth ? .45 : .9)) BLOS.push({ a, x: nx + (R() - .5) * .02, y: ny + (R() - .5) * .02, r: .022 + R() * .014, rot: R() * TAU, tb: t0 + .4, to: t0 + 1.4 + R() * 3 });
      px = nx; py = ny;
    }
    BLOS.push({ a, x: px, y: py, r: .026 + R() * .012, rot: R() * TAU, tb: tb + dur + .2, to: tb + dur + 1.2 + R() * 2.5 });
  }
  grow(0, 0, 0, .55, .5, .016, 3, .4);
  grow(1, 0, 0, Math.PI + .5, .44, .014, 3, 1.2);
  const flower = blossomSprite(96, true), bud = blossomSprite(64, false);
  const wings = [wingSprite(96, 0), wingSprite(96, 1), wingSprite(96, 2)];
  const NB = quality === 0 ? 2 : 3, NP = quality === 0 ? 10 : 18;

  function anchor(a, U) {
    const wide = B.w > B.h;
    return a === 0 ? { x: B.x + B.w * .01, y: B.y + B.h * (wide ? .06 : .05), s: U } : { x: B.x + B.w * .99, y: B.y + B.h * (wide ? .93 : .9), s: U * .9 };
  }

  function butterfly(ctx, i, t, A) {
    const h = j => hash(seed, 50 + j, i), w1 = .11 + .05 * h(1), w2 = .17 + .06 * h(2), w3 = .37 + .1 * h(3);
    const pos = tt => [B.x + B.w * (.5 + .4 * Math.sin(w1 * tt + h(4) * 6) + .06 * Math.sin(w3 * tt * 2.1)), B.y + B.h * (.45 + .3 * Math.sin(w2 * tt + h(5) * 6) + .05 * Math.cos(w3 * tt * 1.7))];
    const [x, y] = pos(t), [x2, y2] = pos(t + .05), head = Math.atan2(y2 - y, x2 - x);
    const glide = Math.sin(t * .6 + i * 2) > .7, flap = glide ? .55 + .1 * Math.sin(t * 3) : Math.abs(Math.cos(t * (7 + i) + i));
    const sz = Math.min(B.w, B.h) * (.05 + .012 * i), img = wings[i % 3];
    ctx.save(); ctx.translate(x, y + Math.sin(t * 8 + i) * sz * .03); ctx.rotate(head + Math.PI / 2);
    ctx.globalAlpha = A;
    for (const side of [1, -1]) {
      ctx.save(); ctx.scale(side * Math.max(.12, flap), 1); ctx.drawImage(img, 0, -sz * .55, sz, sz); ctx.restore();
    }
    ctx.fillStyle = '#2a1e14'; ctx.beginPath(); ctx.ellipse(0, -sz * .02, sz * .05, sz * .32, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#2a1e14'; ctx.lineWidth = Math.max(.6, sz * .015);
    ctx.beginPath(); ctx.moveTo(0, -sz * .3); ctx.quadraticCurveTo(sz * .1, -sz * .5, sz * .14, -sz * .58); ctx.moveTo(0, -sz * .3); ctx.quadraticCurveTo(-sz * .1, -sz * .5, -sz * .14, -sz * .58); ctx.stroke();
    ctx.restore();
  }

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), U = Math.min(B.w, B.h * 1.1);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* a breath of soft spring light */
    const lg = ctx.createRadialGradient(B.x + B.w * .5, B.y + B.h * .2, 0, B.x + B.w * .5, B.y + B.h * .2, B.w * .7);
    lg.addColorStop(0, `rgba(255,250,225,${(.12 * A * smooth(0, 2, t)).toFixed(3)})`); lg.addColorStop(1, 'rgba(255,250,225,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, B.W, B.H);
    /* the branches: bark, darker below, grown as far as their time */
    for (let a = 0; a < 2; a++) {
      const an = anchor(a, U), sway = Math.sin(t * .7 + a * 2) * .012;
      ctx.save(); ctx.translate(an.x, an.y); ctx.rotate(sway); ctx.scale(an.s, an.s);
      ctx.lineCap = 'round';
      for (const pass of [0, 1]) for (const g of SEGS) {
        if (g.a !== a || t < g.t0) continue;
        const p = smooth(g.t0, g.t1, t), x1 = g.x0 + (g.x1 - g.x0) * p, y1 = g.y0 + (g.y1 - g.y0) * p;
        ctx.strokeStyle = pass ? 'rgba(150,110,90,.55)' : '#4a2e22'; ctx.lineWidth = pass ? g.w * .35 : g.w;
        ctx.globalAlpha = A;
        ctx.beginPath(); ctx.moveTo(g.x0 + (pass ? -g.w * .15 : 0), g.y0 + (pass ? -g.w * .15 : 0)); ctx.lineTo(x1 + (pass ? -g.w * .15 : 0), y1 + (pass ? -g.w * .15 : 0)); ctx.stroke();
      }
      for (const b of BLOS) {
        if (b.a !== a || t < b.tb) continue;
        const pb = smooth(b.tb, b.tb + .6, t), po = smooth(b.to, b.to + 1.4, t), d = b.r * 2 * (.5 + .5 * pb) * (1 + .25 * po);
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot + Math.sin(t * 1.3 + b.rot) * .05);
        if (po < 1) { ctx.globalAlpha = A * pb * (1 - po); ctx.drawImage(bud, -d * .6, -d * .6, d * 1.2, d * 1.2); }
        if (po > 0) { ctx.globalAlpha = A * po; const dd = d * (.6 + .4 * po); ctx.drawImage(flower, -dd / 2, -dd / 2, dd, dd); }
        ctx.restore();
      }
      ctx.restore();
    }
    /* petals drifting down from the branches */
    for (let i = 0; i < NP; i++) {
      const P = 8 + hash(seed, 70, i) * 6, s = slot(t, P, 4 + hash(seed, 71, i) * P);
      if (!s) continue;
      const h = j => hash(seed + s.k * 29, j, i), x = B.x + B.w * (h(1) < .5 ? .05 + .3 * h(2) : .65 + .3 * h(2)) + Math.sin(s.a * 1.3 + i) * U * .03 + s.u * U * .08;
      const y = B.y + B.h * (h(1) < .5 ? .1 : .4) + s.u * B.h * .7, r = U * (.007 + .004 * h(3));
      ctx.save(); ctx.translate(x, y); ctx.rotate(s.a * (h(4) - .5) * 3); ctx.scale(1, Math.max(.2, Math.abs(Math.cos(s.a * 2 + i))));
      ctx.globalAlpha = A * Math.min(1, s.u * 8, (1 - s.u) * 6); ctx.fillStyle = '#f7d5df'; ctx.beginPath(); ctx.ellipse(0, 0, r * .8, r, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    /* the butterflies */
    for (let i = 0; i < NB; i++) { const inA = smooth(3 + i * 2.5, 5 + i * 2.5, t); if (inA > 0) butterfly(ctx, i, t, A * inA); }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
