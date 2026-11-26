/* Dec 6, St Nicholas: a polished leather boot stands on the book, filled overnight - a mandarin, walnuts, a gold-foil
   chocolate St Nicholas, a candy cane, a small parcel with a red ribbon and a sprig of fir - and little gold stars drift
   down and twinkle round it, a few flakes of snow in the dark. Endless, from the time since the start (sondertage.js).
   layer: on a Sunday of Advent the wreath keeps the middle - then only a smaller boot beside it, on the right page. */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, canvas, softDot, snowfall } = util;

/* a five-pointed star path */
function star5(c, x, y, r, rot) {
  c.beginPath();
  for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  c.closePath();
}

/* the boot and what is in it, drawn once into a canvas (unit: the boot's height s; origin under the heel's middle) */
function bootSprite(s, seed) {
  const pad = s * .45, W = s * 1.25 + 2 * pad, H = s * 1.55 + pad, c = canvas(W, H), x = c.getContext('2d');
  const ox = pad + s * .3, oy = H - pad * .35, P = (px, py) => [ox + px * s, oy + py * s];
  /* the shadow on the page */
  x.save(); x.filter = `blur(${(s * .03).toFixed(1)}px)`; x.fillStyle = 'rgba(20,10,4,.45)';
  x.beginPath(); x.ellipse(...P(.2, .01), s * .5, s * .045, 0, 0, TAU); x.fill(); x.restore();
  const top = -1, rx = .23, ry = .055;
  /* inside the opening, dark */
  x.fillStyle = '#140904'; x.beginPath(); x.ellipse(...P(0, top), rx * s, ry * s, 0, 0, TAU); x.fill();
  /* what sticks out: drawn before the boot, so its front rim covers their lower ends */
  const fir = (px, py, ang, len) => {
    x.save(); x.translate(...P(px, py)); x.rotate(ang);
    x.strokeStyle = '#4a3418'; x.lineWidth = s * .008; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -len * s); x.stroke();
    for (let i = 0; i < 26; i++) {
      const yy = -len * s * (i / 26), l = s * (.05 + .025 * Math.sin(i)), sd = i % 2 ? 1 : -1;
      x.strokeStyle = i % 3 ? '#1f5a2a' : '#2f7a38'; x.lineWidth = s * .007;
      x.beginPath(); x.moveTo(0, yy); x.lineTo(sd * l, yy - l * .5); x.stroke();
    }
    x.restore();
  };
  fir(-.14, top + .04, -.45, .42);
  /* candy cane: white with red stripes */
  x.save(); x.translate(...P(.12, top + .02)); x.rotate(.18);
  const cane = new Path2D(); cane.moveTo(0, 0); cane.lineTo(0, -.42 * s); cane.arc(-.07 * s, -.42 * s, .07 * s, 0, Math.PI, true);
  x.lineCap = 'round'; x.lineWidth = s * .045; x.strokeStyle = '#f5f1ea'; x.stroke(cane);
  x.setLineDash([s * .03, s * .03]); x.strokeStyle = '#c4161c'; x.stroke(cane); x.setLineDash([]);
  x.lineWidth = s * .012; x.strokeStyle = 'rgba(255,255,255,.55)'; x.translate(-s * .012, 0); x.stroke(cane);
  x.restore();
  /* the chocolate St Nicholas in gold foil */
  x.save(); x.translate(...P(-.02, top - .06));
  const gold = x.createLinearGradient(-s * .08, 0, s * .08, 0);
  gold.addColorStop(0, '#7a5a14'); gold.addColorStop(.35, '#f7e08a'); gold.addColorStop(.55, '#c9982c'); gold.addColorStop(1, '#6a4a10');
  x.fillStyle = gold;
  x.beginPath(); x.moveTo(0, -s * .3); x.quadraticCurveTo(s * .05, -s * .26, s * .045, -s * .2); x.quadraticCurveTo(s * .1, -s * .1, s * .085, s * .06);
  x.lineTo(-s * .085, s * .06); x.quadraticCurveTo(-s * .1, -s * .1, -s * .045, -s * .2); x.quadraticCurveTo(-s * .05, -s * .26, 0, -s * .3); x.fill();
  x.strokeStyle = 'rgba(90,60,10,.6)'; x.lineWidth = s * .004;
  for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(-s * .06 + i * s * .02, -s * .15); x.lineTo(-s * .07 + i * s * .022, s * .05); x.stroke(); }
  x.fillStyle = '#b3171c'; x.fillRect(-s * .05, -s * .12, s * .1, s * .025);
  x.restore();
  /* a mandarin with its leaf */
  const mand = (px, py, r) => {
    const [cx, cy] = P(px, py), g = x.createRadialGradient(cx - r * .35, cy - r * .35, r * .1, cx, cy, r);
    g.addColorStop(0, '#ffc266'); g.addColorStop(.5, '#f28a12'); g.addColorStop(1, '#a8460a');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
    const rr = (a, b) => hash(seed, a, b);
    for (let i = 0; i < 90; i++) { const a = rr(1, i) * TAU, d = Math.sqrt(rr(2, i)) * r * .92; x.fillStyle = `rgba(120,50,0,${(.08 + rr(3, i) * .12).toFixed(2)})`; x.beginPath(); x.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r * .03, 0, TAU); x.fill(); }
    x.fillStyle = 'rgba(255,240,210,.5)'; x.beginPath(); x.ellipse(cx - r * .38, cy - r * .42, r * .18, r * .1, -.6, 0, TAU); x.fill();
    x.fillStyle = '#2f6e2a'; x.beginPath(); x.ellipse(cx + r * .25, cy - r * .95, r * .32, r * .12, -.5, 0, TAU); x.fill();
  };
  mand(.09, top - .1, s * .1);
  /* walnuts */
  const nut = (px, py, r) => {
    const [cx, cy] = P(px, py), g = x.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r);
    g.addColorStop(0, '#c99a5b'); g.addColorStop(1, '#6b4420');
    x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, r, r * .85, .3, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(70,40,15,.6)'; x.lineWidth = r * .08;
    for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(cx + (hash(seed, 7, i) - .5) * r, cy + (hash(seed, 8, i) - .5) * r, r * (.25 + hash(seed, 9, i) * .3), hash(seed, 10, i) * TAU, hash(seed, 10, i) * TAU + 2.2); x.stroke(); }
    x.beginPath(); x.moveTo(cx - r * .9, cy); x.lineTo(cx + r * .9, cy - r * .1); x.stroke();
  };
  nut(-.12, top - .03, s * .055); nut(.18, top - .02, s * .05);
  /* the small parcel */
  x.save(); x.translate(...P(-.1, top - .1)); x.rotate(-.25);
  const pg = x.createLinearGradient(-s * .07, 0, s * .07, 0); pg.addColorStop(0, '#1d3c6e'); pg.addColorStop(.5, '#3563a8'); pg.addColorStop(1, '#162e55');
  x.fillStyle = pg; x.fillRect(-s * .065, -s * .065, s * .13, s * .13);
  x.fillStyle = '#c4161c'; x.fillRect(-s * .012, -s * .065, s * .024, s * .13); x.fillRect(-s * .065, -s * .012, s * .13, s * .024);
  x.beginPath(); x.ellipse(-s * .025, -s * .075, s * .028, s * .014, -.5, 0, TAU); x.ellipse(s * .025, -s * .075, s * .028, s * .014, .5, 0, TAU); x.fill();
  x.restore();
  /* the boot: shaft, instep, toe and heel - polished leather, side-lit */
  const boot = new Path2D();
  boot.moveTo(...P(-rx, top));
  boot.bezierCurveTo(...P(-rx - .01, -.6), ...P(-.25, -.25), ...P(-.24, -.08));
  boot.quadraticCurveTo(...P(-.24, 0), ...P(-.18, 0));
  boot.lineTo(...P(.48, 0));
  boot.bezierCurveTo(...P(.66, 0), ...P(.68, -.12), ...P(.56, -.2));
  boot.bezierCurveTo(...P(.46, -.26), ...P(.3, -.28), ...P(.22, -.4));
  boot.bezierCurveTo(...P(.2, -.6), ...P(rx + .01, -.8), ...P(rx, top));
  boot.ellipse(...P(0, top), rx * s, ry * s, 0, 0, Math.PI, false);
  boot.closePath();
  const lg = x.createLinearGradient(...P(-.3, 0), ...P(.7, 0));
  lg.addColorStop(0, '#2a1208'); lg.addColorStop(.18, '#6e3418'); lg.addColorStop(.3, '#8a4522'); lg.addColorStop(.5, '#4a210e'); lg.addColorStop(1, '#1e0c05');
  x.fillStyle = lg; x.fill(boot);
  x.save(); x.clip(boot);
  /* a darker sole and heel */
  x.fillStyle = '#120804'; x.fillRect(...P(-.3, -.035), s, s * .05);
  x.beginPath(); x.moveTo(...P(-.27, -.11)); x.lineTo(...P(-.07, -.11)); x.quadraticCurveTo(...P(-.06, -.04), ...P(-.07, .002)); x.lineTo(...P(-.27, .002)); x.closePath(); x.fill();
  /* the shine: a soft highlight down the shaft and on the toe */
  x.filter = `blur(${(s * .012).toFixed(1)}px)`;
  x.strokeStyle = 'rgba(255,225,190,.55)'; x.lineWidth = s * .03; x.lineCap = 'round';
  x.beginPath(); x.moveTo(...P(-.12, top + .1)); x.bezierCurveTo(...P(-.13, -.55), ...P(-.13, -.3), ...P(-.1, -.12)); x.stroke();
  x.lineWidth = s * .025; x.beginPath(); x.moveTo(...P(.42, -.17)); x.quadraticCurveTo(...P(.55, -.19), ...P(.6, -.12)); x.stroke();
  x.filter = 'none';
  /* stitching along the vamp */
  x.setLineDash([s * .012, s * .012]); x.strokeStyle = 'rgba(210,170,120,.45)'; x.lineWidth = s * .004;
  x.beginPath(); x.moveTo(...P(.2, -.06)); x.bezierCurveTo(...P(.3, -.2), ...P(.45, -.2), ...P(.6, -.1)); x.stroke(); x.setLineDash([]);
  x.restore();
  /* the front rim of the opening */
  x.strokeStyle = 'rgba(160,90,50,.7)'; x.lineWidth = s * .01;
  x.beginPath(); x.ellipse(...P(0, top), rx * s, ry * s, 0, 0, Math.PI); x.stroke();
  return { c, ox, oy };
}

export function create({ box, seed, layer, veil }) {
  let B = box, spr = null, sprKey = '';
  const snow = snowfall(seed, layer ? 0 : 40, { speed: .6, alpha: .7 }), glow = softDot('255,214,120', 48, .15);
  const veilMax = veil == null ? .5 : veil;
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, wide = B.w > B.h;
    const s = layer ? Math.min(B.h * .2, B.w * (wide ? .1 : .2)) : Math.min(B.h * .42, B.w * (wide ? .3 : .55));
    const bx = B.x + B.w * (layer ? (wide ? .8 : .82) : (wide ? .5 : .46)), by = B.y + B.h * (layer ? .95 : .93);
    const key = Math.round(s * dpr());
    if (key !== sprKey) { spr = bootSprite(s * dpr(), seed); sprKey = key; }
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (!layer) {
      const v = A * veilMax * smooth(0, 2, t), g = ctx.createRadialGradient(bx, by - s * .6, s * .3, bx, by - s * .6, Math.max(W, H) * .8);
      g.addColorStop(0, `rgba(30,14,6,${(v * .45).toFixed(3)})`); g.addColorStop(.4, `rgba(14,8,6,${(v * .9).toFixed(3)})`); g.addColorStop(1, `rgba(8,6,10,${v.toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    /* the boot comes up softly */
    const inA = A * smooth(.4, 1.8, t), d = dpr();
    ctx.globalAlpha = inA;
    ctx.drawImage(spr.c, bx - spr.ox / d, by - spr.oy / d + (1 - smooth(.4, 1.8, t)) * s * .08, spr.c.width / d, spr.c.height / d);
    ctx.globalAlpha = 1;
    /* little gold stars: they drift down round the boot and twinkle, some come to rest in the opening */
    const n = layer ? 7 : 16, u = s / 400;
    for (let i = 0; i < n; i++) {
      const P = 6 + hash(seed, 20, i) * 5, q = t - 1 - hash(seed, 21, i) * P;
      if (q < 0) continue;
      const k = Math.floor(q / P), a = q - k * P, uu = a / P, h1 = hash(seed + k, 22, i), h2 = hash(seed + k, 23, i);
      const x0 = bx + (h1 - .5) * s * (layer ? 1.4 : 2.2), y0 = by - s * (layer ? 2.2 : 2.6), x1 = bx + (h2 - .5) * s * .35, y1 = by - s * 1.02;
      const e = uu * uu * (3 - 2 * uu), x = x0 + (x1 - x0) * e + Math.sin(a * 1.4 + i) * s * .05, y = y0 + (y1 - y0) * e;
      const r = s * (.025 + .02 * h2), tw = .6 + .4 * Math.sin(t * 3 + i * 1.7), fade = Math.min(1, uu * 8) * (uu > .85 ? (1 - uu) / .15 : 1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = A * fade * .55 * tw; ctx.drawImage(glow, x - r * 3, y - r * 3, r * 6, r * 6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = A * fade;
      const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r); g.addColorStop(0, '#fff3b0'); g.addColorStop(.5, '#e2b23c'); g.addColorStop(1, '#9a6c12');
      ctx.fillStyle = g; star5(ctx, x, y, r, a * .6 + h1 * 3); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!layer) snow(ctx, t, B, A * smooth(1, 4, t), Math.max(.6, u * 2));
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { spr = null; } };
}
