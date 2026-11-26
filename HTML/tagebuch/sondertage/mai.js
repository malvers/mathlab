/* May 1 ("Der Mai ist gekommen"): a maypole stands in the fold - a slim birch trunk under a green wreath - and its coloured
   ribbons reach out over the spread to dancers we do not see, circling slowly round the pole (the ribbons in front pass
   over it, the ones behind under it, darker), fluttering; apple blossom petals drift down over the pages. Endless, from the
   time since the start (sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, hash, slot, canvas } = util;

const RIB = [[200, 30, 40], [250, 250, 245], [40, 90, 190], [60, 150, 70], [245, 196, 40], [200, 30, 40], [250, 250, 245], [40, 90, 190], [60, 150, 70], [245, 196, 40]];

/* a wreath of leaves and a few flowers, drawn once */
function wreathSprite(w, seed) {
  const c = canvas(w, w * .5), x = c.getContext('2d'), cx = w / 2, cy = w * .25, rx = w * .4, ry = w * .1;
  for (let i = 0; i < 70; i++) {
    const a = hash(seed, 1, i) * TAU, px = cx + Math.cos(a) * rx * (.9 + .2 * hash(seed, 2, i)), py = cy + Math.sin(a) * ry * (.9 + .3 * hash(seed, 3, i));
    x.save(); x.translate(px, py); x.rotate(a + Math.PI / 2 + (hash(seed, 4, i) - .5));
    const l = w * (.05 + .03 * hash(seed, 5, i)), g = x.createLinearGradient(0, -l, 0, l);
    g.addColorStop(0, '#5fa043'); g.addColorStop(1, '#2c6a26');
    x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, l * .38, l, 0, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(20,60,20,.5)'; x.lineWidth = Math.max(.5, w * .002); x.beginPath(); x.moveTo(0, -l); x.lineTo(0, l); x.stroke();
    x.restore();
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU + .3, px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry, r = w * .018;
    for (let p = 0; p < 5; p++) { x.fillStyle = i % 2 ? '#fdf5f7' : '#f6c7d3'; x.beginPath(); x.arc(px + Math.cos(p * TAU / 5) * r, py + Math.sin(p * TAU / 5) * r, r * .8, 0, TAU); x.fill(); }
    x.fillStyle = '#e8b830'; x.beginPath(); x.arc(px, py, r * .55, 0, TAU); x.fill();
  }
  return c;
}

export function create({ box, seed, quality }) {
  let B = box, wreath = null, wKey = 0;
  const N = quality === 0 ? 6 : 10, NP = quality === 0 ? 30 : 55, SEG = 22;

  function petal(ctx, x, y, r, a, f, pink) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(1, Math.max(.15, Math.abs(Math.cos(f))));
    const g = ctx.createRadialGradient(-r * .2, -r * .3, r * .1, 0, 0, r * 1.2);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.6, pink ? '#fbe0e6' : '#fbf6f2'); g.addColorStop(1, pink ? '#eaa6b8' : '#e9d9d3');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, r); ctx.bezierCurveTo(r * 1.1, r * .5, r * .9, -r * .9, r * .2, -r); ctx.lineTo(0, -r * .75); ctx.lineTo(-r * .2, -r);
    ctx.bezierCurveTo(-r * .9, -r * .9, -r * 1.1, r * .5, 0, r); ctx.fill();
    ctx.restore();
  }

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), wide = B.w > B.h;
    const S = Math.min(Math.max(B.w, B.h * .85), B.h * 1.45), u = S / 1000;
    const cx = B.x + B.w / 2, top = B.y + B.h * .06, foot = B.y + B.h * .98, R = B.w * (wide ? .44 : .46), endY = B.y + B.h * .86, ry = B.h * .05;
    const ww = Math.round(B.w * (wide ? .2 : .42));
    if (ww !== wKey) { wreath = wreathSprite(ww, seed); wKey = ww; }
    const grow = smooth(.2, 2.2, t);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* the ribbons: from the wreath to the hands of the dancers, circling slowly; behind the pole first */
    const om = TAU / 24, rib = [];
    for (let i = 0; i < N; i++) {
      const ph = om * t + i * TAU / N, depth = Math.sin(ph);
      rib.push({ i, ph, depth, ex: cx + Math.cos(ph) * R * grow, ey: endY + depth * ry });
    }
    const pole = () => {
      const pw = Math.max(3, B.w * .008), g = ctx.createLinearGradient(cx - pw, 0, cx + pw, 0);
      g.addColorStop(0, '#c9c3b6'); g.addColorStop(.4, '#f4f1ea'); g.addColorStop(1, '#a8a296');
      ctx.globalAlpha = A * smooth(0, 1, t); ctx.fillStyle = g; ctx.fillRect(cx - pw, top, 2 * pw, foot - top);
      ctx.fillStyle = 'rgba(30,30,30,.75)';
      for (let k = 0; k < 26; k++) { const y = top + (foot - top) * hash(seed, 60, k), l = pw * (.6 + 1.2 * hash(seed, 61, k)); ctx.fillRect(cx - pw + hash(seed, 62, k) * pw, y, l, Math.max(1, pw * .35)); }
      ctx.globalAlpha = 1;
    };
    const band = r => {
      const col = RIB[r.i % RIB.length], wdt = Math.max(3, B.w * .012), x0 = cx + (r.ex > cx ? 1 : -1) * B.w * .01, y0 = top + B.h * .02;
      const sag = B.h * .12 * (1 - .3 * Math.abs(Math.cos(r.ph))), pts = [];
      for (let j = 0; j <= SEG; j++) {
        const s = j / SEG, x = x0 + (r.ex - x0) * s, y = y0 + (r.ey - y0) * s + Math.sin(s * Math.PI) * sag + Math.sin(s * 9 - t * 3 + r.i) * wdt * .6 * s;
        pts.push([x, y]);
      }
      const shade = r.depth < 0 ? .72 : 1;
      for (let j = 0; j < SEG; j++) {
        const [ax, ay] = pts[j], [bx, by] = pts[j + 1], dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1, nx = -dy / l * wdt / 2, ny = dx / l * wdt / 2;
        const tw = .74 + .26 * Math.cos(j * .7 - t * 2.2 + r.i * 1.3), k = tw * shade;
        ctx.fillStyle = `rgb(${col[0] * k | 0},${col[1] * k | 0},${col[2] * k | 0})`;
        ctx.beginPath(); ctx.moveTo(ax + nx, ay + ny); ctx.lineTo(bx + nx, by + ny); ctx.lineTo(bx - nx, by - ny); ctx.lineTo(ax - nx, ay - ny); ctx.closePath(); ctx.fill();
      }
    };
    ctx.globalAlpha = A * grow;
    rib.filter(r => r.depth < 0).forEach(band);
    pole();
    ctx.globalAlpha = A * grow;
    rib.filter(r => r.depth >= 0).forEach(band);
    /* the wreath on top */
    ctx.globalAlpha = A * smooth(0, 1, t);
    ctx.drawImage(wreath, cx - ww / 2, top - ww * .18, ww, ww * .5);
    /* apple blossom petals drifting down */
    for (let i = 0; i < NP; i++) {
      const P = 9 + hash(seed, 70, i) * 7, s = slot(t, P, -hash(seed, 71, i) * P + .5);
      if (!s) continue;
      const h = j => hash(seed + s.k * 23, j, i), y = B.y - B.h * .1 + s.u * B.h * 1.2, x = B.x + B.w * (-.05 + 1.1 * h(1)) + Math.sin(s.a * (.8 + h(2)) + i) * 30 * u + s.u * 60 * u;
      ctx.globalAlpha = A * Math.min(1, s.u * 10, (1 - s.u) * 10) * smooth(.5, 2.5, t);
      petal(ctx, x, y, (7 + 5 * h(3)) * u + 2, s.a * (h(4) - .5) * 2 + h(5) * 6, s.a * (1.5 + h(6) * 2), h(7) < .4);
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { wreath = null; } };
}
