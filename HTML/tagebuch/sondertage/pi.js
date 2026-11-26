/* Mar 14, Pi Day (and Albert Einstein's birthday): a golden π in the middle of the spread, and from it the digits of π
   unroll as a golden spiral - 3,14159 26535 … - one after the other, each lighting up as it lands; the spiral turns
   slowly, now and then a gleam runs outward along the digits. In the corner, quietly, E = mc² writes itself in. The
   digits are computed (Machin's formula with BigInt), not typed. Endless, from the time since the start (sondertage.js). */
import { util } from '../sondertage.js';
const { TAU, clamp, smooth, canvas, softDot } = util;

/* the first n digits of π as a string "31415…" - Machin: π = 16 arctan(1/5) − 4 arctan(1/239) */
function piDigits(n) {
  const S = 10n ** BigInt(n + 12);
  const atanInv = x => {
    const X = BigInt(x), X2 = X * X;
    let p = S / X, sum = p, k = 1n, sign = -1n;
    for (;;) { p /= X2; if (p === 0n) break; sum += sign * (p / (2n * k + 1n)); sign = -sign; k++; }
    return sum;
  };
  return (16n * atanInv(5) - 4n * atanInv(239)).toString().slice(0, n);
}

const RATE = 14, T0 = 2.2;   /* digits per second, and when the first one lands */
const DIG_FONT = 'Orbitron, "Arial Black", sans-serif', SERIF = '"Times New Roman", Times, serif', HAND = 'Caveat, "Comic Sans MS", cursive';

export function create({ box, seed, veil }) {
  let B = box, cache = null, cacheN = 0, cacheKey = '', glyphs = null, glyphKey = '';
  const veilMax = veil == null ? .5 : veil, glow = softDot('255,210,120', 64, .1);
  try { document.fonts.load(`700 40px ${DIG_FONT}`); document.fonts.load(`500 40px ${HAND}`); } catch (e) { }
  /* the spiral, in parts of its outer radius: an Archimedean spiral from r = .12, the digits a little larger outwards,
     spaced evenly along the curve */
  const D = [], digits = piDigits(720), b = .085 / TAU;
  {
    let th = 0, r = .12;
    const chars = '3,' + digits.slice(1);
    for (let i = 0; i < chars.length; i++) {
      const size = .048 + .03 * r;
      D.push({ ch: chars[i], th, r, size });
      const ds = (chars[i] === ',' ? .45 : .78) * size;
      th += ds / Math.sqrt(r * r + b * b); r = .12 + b * th;
      if (r > 1) break;
    }
  }
  const N = D.length;

  /* the glyphs 0-9 and the comma in gold, at the size of the outermost digit (drawn scaled) */
  function glyphSet(px) {
    const key = Math.round(px), out = {};
    if (key === glyphKey) return glyphs;
    const fontOk = !document.fonts || !document.fonts.check || document.fonts.check(`700 ${key}px ${DIG_FONT}`);
    for (const ch of '0123456789,') {
      const c = canvas(key * 1.1, key * 1.4), x = c.getContext('2d');
      x.font = `700 ${key}px ${fontOk ? DIG_FONT : 'sans-serif'}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      const g = x.createLinearGradient(0, 0, 0, key * 1.4); g.addColorStop(0, '#fff0b8'); g.addColorStop(.5, '#e7bd52'); g.addColorStop(1, '#a8761c');
      x.shadowColor = 'rgba(255,190,90,.6)'; x.shadowBlur = key * .15; x.fillStyle = g; x.fillText(ch, key * .55, key * .72);
      out[ch] = c;
    }
    glyphKey = fontOk ? key : -key; glyphs = out;
    return out;
  }

  function draw(ctx, t, alpha) {
    const A = clamp(alpha == null ? 1 : alpha, 0, 1), W = B.W, H = B.H, wide = B.w > B.h, dpr = Math.min(2, window.devicePixelRatio || 1);
    const R = Math.min(B.h * (wide ? .46 : .4), B.w * .46), cx = B.x + B.w / 2, cy = B.y + B.h * (wide ? .5 : .42), rot = -t * .025;
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const v = A * veilMax * smooth(0, 2, t), vg = ctx.createRadialGradient(cx, cy, R * .3, cx, cy, Math.max(W, H) * .8);
    vg.addColorStop(0, `rgba(10,14,34,${(v * .8).toFixed(3)})`); vg.addColorStop(1, `rgba(6,8,22,${v.toFixed(3)})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    /* a soft golden light behind the spiral */
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = A * .35 * smooth(.5, 3, t); ctx.drawImage(glow, cx - R * 1.1, cy - R * 1.1, R * 2.2, R * 2.2);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    /* the π in the middle */
    const pa = A * smooth(.4, 2, t), ps = R * .2;
    if (pa > 0) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.font = `italic ${Math.round(ps)}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const g = ctx.createLinearGradient(0, -ps / 2, 0, ps / 2); g.addColorStop(0, '#fff3c4'); g.addColorStop(.55, '#e2b64a'); g.addColorStop(1, '#9a6a16');
      ctx.shadowColor = 'rgba(255,200,100,.7)'; ctx.shadowBlur = ps * .25; ctx.globalAlpha = pa; ctx.fillStyle = g; ctx.fillText('π', 0, ps * .04);
      ctx.restore();
    }
    /* the digits that have landed live in a cache (in the spiral's own frame), drawn turned as one image; the few still
       landing are drawn on top, growing in with a flash */
    const n = clamp(Math.floor((t - T0) * RATE), 0, N), size = Math.round(2.2 * R * dpr), gl = glyphSet(R * .078 * dpr);
    const key = size + '|' + glyphKey;
    if (key !== cacheKey) { cache = canvas(size, size); cacheN = 0; cacheKey = key; }
    const settled = Math.max(0, n - 6);
    if (settled > cacheN) {
      const x = cache.getContext('2d'), k = size / 2.2, c0 = size / 2;
      for (let i = cacheN; i < settled; i++) {
        const d = D[i], s = d.size * k / (gl['0'].height / 1.4) * 1.0, img = gl[d.ch];
        x.setTransform(1, 0, 0, 1, 0, 0); x.translate(c0 + Math.cos(d.th) * d.r * k, c0 + Math.sin(d.th) * d.r * k); x.rotate(d.th + Math.PI / 2); x.scale(s, s);
        x.drawImage(img, -img.width / 2, -img.height / 2);
      }
      cacheN = settled;
    }
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.globalAlpha = A; ctx.drawImage(cache, -1.1 * R, -1.1 * R, 2.2 * R, 2.2 * R);
    /* the ones landing now */
    ctx.globalCompositeOperation = 'lighter';
    for (let i = settled; i < n; i++) {
      const d = D[i], age = t - T0 - i / RATE, e = smooth(0, .4, age), img = gl[d.ch], s = d.size * R / (img.height / 1.4) * (1.6 - .6 * e);
      ctx.save(); ctx.translate(Math.cos(d.th) * d.r * R, Math.sin(d.th) * d.r * R); ctx.rotate(d.th + Math.PI / 2); ctx.scale(s, s);
      ctx.globalAlpha = A * e; ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      const fl = (1 - e) * d.size * R * 2.5;
      ctx.globalAlpha = A * (1 - e) * .8; ctx.drawImage(glow, Math.cos(d.th) * d.r * R - fl, Math.sin(d.th) * d.r * R - fl, fl * 2, fl * 2);
    }
    /* a gleam running outward along the landed digits every 9 s */
    if (n > 40) {
      const g0 = ((t - T0) % 9) / 9 * (n + 60) - 30;
      for (let i = Math.max(0, Math.floor(g0 - 14)); i < Math.min(n, g0 + 14); i++) {
        const d = D[i], k = 1 - Math.abs(i - g0) / 14, fl = d.size * R * 1.4;
        ctx.globalAlpha = A * k * .55; ctx.drawImage(glow, Math.cos(d.th) * d.r * R - fl, Math.sin(d.th) * d.r * R - fl, fl * 2, fl * 2);
      }
    }
    ctx.restore();
    /* E = mc², quietly, writing itself in at the foot of the right page */
    const ew = smooth(8, 11, t);
    if (ew > 0) {
      const fs = Math.max(14, B.h * (wide ? .055 : .045)), ex = B.x + B.w * (wide ? .9 : .9), ey = B.y + B.h * (wide ? .9 : .94);
      ctx.save(); ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
      ctx.font = `italic ${Math.round(fs)}px ${SERIF}`;
      const tw = ctx.measureText('E = mc²').width;
      ctx.beginPath(); ctx.rect(ex - tw - 4, ey - fs * 1.2, (tw + 8) * ew, fs * 2.4); ctx.clip();
      ctx.globalAlpha = A * .75; ctx.fillStyle = '#e9cf8a'; ctx.shadowColor = 'rgba(255,200,110,.45)'; ctx.shadowBlur = fs * .2;
      ctx.fillText('E = mc²', ex, ey);
      ctx.font = `500 ${Math.round(fs * .42)}px ${HAND}`; ctx.globalAlpha = A * .6 * smooth(10, 12, t); ctx.shadowBlur = 0;
      ctx.fillText('Albert Einstein, * 14. März 1879', ex, ey + fs * .55);
      ctx.restore();
    }
    ctx.restore();
  }
  return { draw, resize(b) { B = b; }, destroy() { cache = null; glyphs = null; } };
}
