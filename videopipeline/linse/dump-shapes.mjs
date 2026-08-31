// Pulls the real lens outlines out of the running lab at four moments, so the
// inserts can draw what the optimiser actually produced instead of a drawing that
// merely looks like it. Writes linse/shapes.json.
import fs from 'fs';
import { chromium } from 'playwright';

const LAB_URL = 'http://localhost:8765/LensStandalone/cmaes_java.html';
const GRAB = () => {
  const A = App, fare = Physics.FARE, back = A.ppsSide;
  const space = A.perimeter / (A.ppsSide - 1);
  const rays = [];
  for (let i = 0; i < A.ppsSide - 1; i++) {
    const y = A.offsetY + i * space + space / 2;
    const rayIn = { x1: 0, y1: y, x2: fare, y2: y };
    const r1 = Physics.refractRayClosestSurface(rayIn, A.points, 0, A.ppsSide - 1, A.nAir, A.nLens, fare);
    if (!r1) continue;
    const r2 = Physics.refractRayClosestSurface(r1.refracted, A.points, back, A.ppsSide - 1, A.nLens, A.nAir, fare);
    if (!r2) continue;
    const o = r2.refracted;
    rays.push({ y0: y, entry: { x: r1.hit.x, y: r1.hit.y }, exit: { x: r2.hit.x, y: r2.hit.y },
                dir: { x: o.x2 - o.x1, y: o.y2 - o.y1 } });
  }
  return {
    gen: A.generation, fitness: A.fitness,
    points: A.points.map((p) => ({ x: p.x, y: p.y })),
    ppsSide: A.ppsSide, offsetX: A.offsetX, offsetY: A.offsetY, perimeter: A.perimeter,
    focus: { x: A.focus.x, y: A.focus.y }, n: A.nLens, rays,
  };
};

const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto(LAB_URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof App !== 'undefined' && App.points.length > 0, null, { timeout: 30000 });
await page.waitForTimeout(1200);

const out = {};
out.g0 = await page.evaluate(GRAB);
await page.evaluate(() => App.togglePlay());
for (const [key, g] of [['g20', 20], ['g100', 100], ['g600', 600]]) {
  await page.waitForFunction((g) => App.generation >= g, g, { timeout: 120000, polling: 30 });
  out[key] = await page.evaluate(GRAB);
  console.log(key, 'Generation', out[key].gen, 'Bewertung', out[key].fitness.toFixed(3), out[key].rays.length, 'Strahlen');
}
await browser.close();
fs.writeFileSync(new URL('./shapes.json', import.meta.url), JSON.stringify(out));
console.log('geschrieben: linse/shapes.json');
