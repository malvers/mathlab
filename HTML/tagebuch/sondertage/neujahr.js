/* Jan 1, New Year: the first morning of the year, quiet after the night (Doc, 26.11.2026, about the three ribbons that went
   round the book: "nicht ganz so doll ... etwas subtiler. Und nicht immer nur im Kreis, sondern ... ein bisschen
   schöner") - gold dust floating in the first light: fine motes rise slowly and meander, each on its own unhurried path
   (two slow sways of unrelated periods, so no mote ever runs a circle), now and then one catches the light and glints;
   a few large out-of-focus lights drift far behind them, a warm glow of dawn breathes from below, a little snow falls.
   No trails, nothing chasing. Endless, from the time since the start (sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, canvas, softDot, snowfall } = util;

/* a glint: a small four-pointed star of light (two thin crossing rays and a bright core) */
function glintSprite(size) {
  const c = canvas(size, size), x = c.getContext('2d'), r = size / 2;
  x.globalCompositeOperation = 'lighter';
  for (const [dx, dy, len] of [[1, 0, 1], [0, 1, 1], [.7071, .7071, .45], [.7071, -.7071, .45]]) {
    const g = x.createLinearGradient(r - dx * r * len, r - dy * r * len, r + dx * r * len, r + dy * r * len);
    g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,248,225,.95)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    x.strokeStyle = g; x.lineWidth = Math.max(1, size / 40); x.lineCap = 'round';
    x.beginPath(); x.moveTo(r - dx * r * len, r - dy * r * len); x.lineTo(r + dx * r * len, r + dy * r * len); x.stroke();
  }
  const g = x.createRadialGradient(r, r, 0, r, r, r * .22);
  g.addColorStop(0, 'rgba(255,255,245,1)'); g.addColorStop(1, 'rgba(255,230,170,0)');
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  return c;
}
/* an out-of-focus light: an even soft disc with a slightly brighter rim, like a lens renders a distant lamp */
function bokehSprite(rgb, size) {
  const c = canvas(size, size), x = c.getContext('2d'), r = size / 2, g = x.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0, `rgba(${rgb},.55)`); g.addColorStop(.78, `rgba(${rgb},.62)`); g.addColorStop(.9, `rgba(${rgb},.8)`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  return c;
}

export function create({ box, seed, quality, veil }) {
  let B = box;
  const N = quality === 0 ? 70 : quality === 1 ? 110 : 150, NB = quality === 0 ? 5 : 8;
  const snow = snowfall(seed, quality === 0 ? 30 : 46, { speed: .45, alpha: .55 });
  const mote = softDot('255,222,150', 32, .3), glint = glintSprite(64);
  const bokeh = [bokehSprite('255,206,120', 96), bokehSprite('255,170,140', 96), bokehSprite('255,236,200', 96)];
  const veilMax = veil == null ? .6 : veil;

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H;
    const S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000, rise = smooth(.3, 3.5, t);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* the veil of the night, lifting a little towards the bottom where the light comes */
    const v = A * veilMax * smooth(0, 2, t), g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgba(8,14,38,${v.toFixed(3)})`); g.addColorStop(1, `rgba(22,22,46,${(v * .75).toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    /* dawn: a warm glow from below the book, breathing slowly */
    const breath = .8 + .2 * Math.sin(TAU * t / 9), cx = B.x + B.w / 2, cy = B.y + B.h * 1.05, R = Math.max(B.w, B.h) * .75;
    const dg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    dg.addColorStop(0, `rgba(255,170,110,${(A * rise * .2 * breath).toFixed(3)})`); dg.addColorStop(.45, `rgba(255,140,120,${(A * rise * .07 * breath).toFixed(3)})`);
    dg.addColorStop(1, 'rgba(255,140,120,0)');
    ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);
    /* the far lights: large, faint, drifting slowly - depth behind the dust */
    for (let i = 0; i < NB; i++) {
      const h = j => hash(seed, 60 + j, i), r = (40 + 60 * h(1)) * u + 10;
      const x = B.x + B.w * (.08 + .84 * h(2)) + Math.sin(t * (.05 + .05 * h(3)) + h(4) * TAU) * 60 * u + Math.sin(t * (.13 + .06 * h(5)) + h(6) * TAU) * 22 * u;
      const y = B.y + B.h * (.1 + .8 * h(7)) + Math.sin(t * (.04 + .04 * h(8)) + h(9) * TAU) * 40 * u;
      ctx.globalAlpha = A * rise * (.05 + .05 * h(10)) * (.7 + .3 * Math.sin(t * (.2 + .2 * h(11)) + i));
      ctx.drawImage(bokeh[i % 3], x - r, y - r, 2 * r, 2 * r);
    }
    /* the gold dust: each mote rises slowly through the whole picture (a new place each time round), swaying on two
       unrelated slow periods; nearer ones (z) larger, brighter and a touch faster. A mote twinkles now and then, and
       at the height of a twinkle a near one glints */
    const HH = H + 40;
    for (let i = 0; i < N; i++) {
      const z = hash(seed, 1, i), vy = (5 + 12 * z) * u + 2, y0 = hash(seed, 2, i) * HH, lap = Math.floor((y0 + vy * t) / HH);
      const fy = ((y0 + vy * t) % HH) / HH, y = H + 20 - fy * HH;
      const h = j => hash(seed + lap * 131, j, i);
      const x = h(3) * W + Math.sin(t * (.07 + .1 * h(4)) + h(5) * TAU) * (20 + 40 * z) * u + Math.sin(t * (.23 + .17 * h(6)) + h(7) * TAU) * (6 + 12 * z) * u;
      const tw = Math.pow(.5 + .5 * Math.sin(t * (.6 + 1.1 * h(8)) + h(9) * TAU), 8);
      const edge = Math.min(1, fy * 10, (1 - fy) * 10), a = A * rise * edge * (.18 + .3 * z + .5 * tw);
      const d = (.8 + 2.4 * z) * u + .7;
      ctx.globalAlpha = a; ctx.drawImage(mote, x - d, y - d, 2 * d, 2 * d);
      if (z > .72 && tw > .55) {
        const s = (10 + 16 * z) * u * (tw - .55) / .45 + 2;
        ctx.globalAlpha = A * rise * edge * .9 * (tw - .55) / .45; ctx.drawImage(glint, x - s, y - s, 2 * s, 2 * s);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    snow(ctx, t, B, A * smooth(.5, 3, t), Math.max(.6, u));
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { } };
}
