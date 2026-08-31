// Follow-up measurements for the lens film. Two questions the first pass raised:
//
//   1. Around generation 800 the fitness drops again (12.05 -> 4.39) and the lens
//      becomes thin and strongly curved. WHEN does that happen, and is it real?
//      The fitness has two parts: focus quality plus 0.25 * path length in glass.
//      Once the focus is exact, only the glass term is left to improve.
//   2. Does the refractive index really change the required curvature, or was that
//      just two runs landing in different regimes? Repeated, same horizon.
import { chromium } from 'playwright';

const URL = 'http://localhost:8765/LensStandalone/cmaes_java.html';
const PROBE = () => {
  const A = App, fare = Physics.FARE, back = A.ppsSide;
  const space = A.perimeter / (A.ppsSide - 1);
  const ys = [];
  for (let i = 0; i < A.ppsSide - 1; i++) {
    const rayIn = { x1: 0, y1: A.offsetY + i * space + space / 2, x2: fare, y2: A.offsetY + i * space + space / 2 };
    const r1 = Physics.refractRayClosestSurface(rayIn, A.points, 0, A.ppsSide - 1, A.nAir, A.nLens, fare);
    if (!r1) continue;
    const r2 = Physics.refractRayClosestSurface(r1.refracted, A.points, back, A.ppsSide - 1, A.nLens, A.nAir, fare);
    if (!r2) continue;
    const r = r2.refracted, dx = r.x2 - r.x1, dy = r.y2 - r.y1;
    if (Math.abs(dx) < 1e-9) continue;
    ys.push(r.y1 + (A.focus.x - r.x1) / dx * dy);
  }
  const d = ys.map((y) => y - A.focus.y);
  const nF = A.ppsSide;
  let sagBack = 0;
  const x0Back = A.basePoints[nF].x;
  for (let i = 0; i < nF; i++) sagBack = Math.max(sagBack, Math.abs(A.points[nF + i].x - x0Back));
  const mid = Math.floor(nF / 2);
  return {
    gen: A.generation, fitness: A.fitness, penalty: A.penalty,
    rms: d.length ? Math.sqrt(d.reduce((a, b) => a + b * b, 0) / d.length) : null,
    sagBack, thickness: Math.abs(A.points[nF + (nF - 1 - mid)].x - A.points[mid].x),
    perimeter: A.perimeter,
  };
};

const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof App !== 'undefined' && App.points.length > 0, null, { timeout: 30000 });
await page.waitForTimeout(1200);
const probe = () => page.evaluate(PROBE);
const runTo = (g) => page.waitForFunction((g) => App.generation >= g, g, { timeout: 240000, polling: 50 });
const restart = (n) => page.evaluate((n) => {
  App.reset();
  const s = document.getElementById('slider-n');
  if (s) { s.value = String(n); s.dispatchEvent(new Event('input', { bubbles: true })); }
  App.nLens = n;
  App.togglePlay();
}, n);

console.log('=== 1. Der zweite Sprung: erst scharf, dann sparsam (n = 1.60) ===');
console.log('   Gen   Fitness    Strahlfehler   Woelbung   Dicke');
await restart(1.60);
for (const g of [100, 300, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000]) {
  await runTo(g);
  const r = await probe();
  console.log('  ' + String(r.gen).padStart(5), r.fitness.toFixed(3).padStart(9),
    r.rms.toFixed(2).padStart(10) + ' px', r.sagBack.toFixed(1).padStart(9) + ' px',
    r.thickness.toFixed(1).padStart(8) + ' px');
}
await page.evaluate(() => { App.paused = true; });

console.log('\n=== 2. Brechzahl, je zwei Laeufe ueber 1500 Generationen ===');
console.log('   n    Lauf   Fitness   Strahlfehler   Woelbung   Dicke');
for (const n of [1.20, 1.60, 2.00]) {
  for (let k = 1; k <= 2; k++) {
    await restart(n);
    await runTo(1500);
    const r = await probe();
    console.log('  ' + n.toFixed(2), '   ' + k + '  ', r.fitness.toFixed(3).padStart(8),
      r.rms.toFixed(2).padStart(10) + ' px', r.sagBack.toFixed(1).padStart(9) + ' px',
      r.thickness.toFixed(1).padStart(8) + ' px');
    await page.evaluate(() => { App.paused = true; });
  }
}
await browser.close();
