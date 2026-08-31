// Repeatability. The first pass measured ONE run; the card dump produced a different
// value at round 20 (43.6 px against 38.9 px). Before the narration commits to a
// number, find out which milestones are stable across runs and which are not.
import { chromium } from 'playwright';
const LAB_URL = 'http://localhost:8765/LensStandalone/cmaes_java.html';
const RMS = () => {
  const A = App, fare = Physics.FARE, back = A.ppsSide;
  const space = A.perimeter / (A.ppsSide - 1);
  const d = [];
  for (let i = 0; i < A.ppsSide - 1; i++) {
    const y = A.offsetY + i * space + space / 2;
    const r1 = Physics.refractRayClosestSurface({ x1: 0, y1: y, x2: fare, y2: y }, A.points, 0, A.ppsSide - 1, A.nAir, A.nLens, fare);
    if (!r1) continue;
    const r2 = Physics.refractRayClosestSurface(r1.refracted, A.points, back, A.ppsSide - 1, A.nLens, A.nAir, fare);
    if (!r2) continue;
    const r = r2.refracted, dx = r.x2 - r.x1;
    if (Math.abs(dx) < 1e-9) continue;
    d.push(r.y1 + (A.focus.x - r.x1) / dx * (r.y2 - r.y1) - A.focus.y);
  }
  return d.length ? Math.sqrt(d.reduce((a, b) => a + b * b, 0) / d.length) : null;
};
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto(LAB_URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof App !== 'undefined' && App.points.length > 0, null, { timeout: 30000 });
await page.waitForTimeout(1200);

const RUNS = 5;
const at = { 20: [], 50: [], 100: [], 200: [] };
const jump = [];
console.log('Lauf   r20      r50      r100     r200    Ausbruch bei Runde');
for (let k = 0; k < RUNS; k++) {
  await page.evaluate(() => { App.reset(); App.togglePlay(); });
  for (const g of [20, 50, 100, 200]) {
    await page.waitForFunction((g) => App.generation >= g, g, { timeout: 60000, polling: 20 });
    at[g].push(await page.evaluate(RMS));
  }
  // the breakout: first round whose fitness is below 6 (it sits at ~12.4 before, ~4.4 after)
  const j = await page.evaluate(() => new Promise((res) => {
    const t0 = App.generation;
    const iv = setInterval(() => {
      if (App.fitness < 6) { clearInterval(iv); res(App.generation); }
      if (App.generation - t0 > 4000) { clearInterval(iv); res(null); }
    }, 16);
  }));
  jump.push(j);
  await page.evaluate(() => { App.paused = true; });
  console.log('  ' + (k + 1) + '  ' +
    [20, 50, 100, 200].map((g) => at[g][k].toFixed(2).padStart(8)).join(' ') +
    '   ' + String(j).padStart(6));
}
const stat = (a) => 'min ' + Math.min(...a).toFixed(2) + '  max ' + Math.max(...a).toFixed(2);
console.log('\nStreuung:');
for (const g of [20, 50, 100, 200]) console.log('  Runde ' + String(g).padStart(3) + ':  ' + stat(at[g]) + ' px');
console.log('  Ausbruch: min ' + Math.min(...jump) + '  max ' + Math.max(...jump));
await browser.close();
