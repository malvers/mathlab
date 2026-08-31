// Ground truth for every number the lens film says out loud.
//
// Drives the real lab (LensStandalone/cmaes_java.html) headlessly and reads the
// geometry back out of it. Nothing here is estimated: the ray trace below is the
// lab's own Physics.refractRayClosestSurface, called on the lab's own points.
//
//   focusRms / focusMax : how far the twelve outgoing rays miss the focus, in px
//   sagitta             : how deep the back surface bulges out of the straight edge
//   thickness           : centre thickness of the lens body
import { chromium } from 'playwright';

const URL = 'http://localhost:8765/LensStandalone/cmaes_java.html';

/* runs inside the page: trace the rays exactly as the fitness function does */
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
  const rms = d.length ? Math.sqrt(d.reduce((a, b) => a + b * b, 0) / d.length) : null;
  const max = d.length ? Math.max(...d.map(Math.abs)) : null;

  // how far each surface has moved away from the straight block it started as
  const nFront = A.ppsSide;
  let sagFront = 0, sagBack = 0;
  const x0Front = A.basePoints[0].x, x0Back = A.basePoints[nFront].x;
  for (let i = 0; i < nFront; i++) sagFront = Math.max(sagFront, Math.abs(A.points[i].x - x0Front));
  for (let i = 0; i < nFront; i++) sagBack = Math.max(sagBack, Math.abs(A.points[nFront + i].x - x0Back));
  const mid = Math.floor(nFront / 2);
  const thickness = Math.abs(A.points[nFront + (nFront - 1 - mid)].x - A.points[mid].x);

  return {
    gen: A.generation, fitness: A.fitness, penalty: A.penalty, calls: A.calls, sigma: A.sigma,
    rays: ys.length, focusRms: rms, focusMax: max,
    sagFront, sagBack, thickness,
    perimeter: A.perimeter, chord: A.lensChordWidth, n: A.nLens,
    focus: { x: A.focus.x, y: A.focus.y }, offsetX: A.offsetX, offsetY: A.offsetY,
  };
};

const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof App !== 'undefined' && App.points.length > 0, null, { timeout: 30000 });
await page.waitForTimeout(1500);

const probe = () => page.evaluate(PROBE);
const runTo = async (g) => {
  await page.waitForFunction((g) => App.generation >= g, g, { timeout: 180000, polling: 50 });
};

console.log('=== Ausgangslage: der rohe Glasblock ===');
const start = await probe();
console.log(JSON.stringify(start, null, 1));

console.log('\n=== Konvergenz (Standard: n = 1.60, Symmetrie an) ===');
await page.evaluate(() => App.togglePlay());
console.log('  Gen   Fitness      Streuung rms   max     Woelbung hinten   Dicke');
for (const g of [1, 5, 10, 20, 50, 100, 200, 400, 800]) {
  await runTo(g);
  const r = await probe();
  console.log('  ' + String(r.gen).padStart(4),
    r.fitness.toExponential(3).padStart(11),
    (r.focusRms === null ? '   —' : r.focusRms.toFixed(2).padStart(10) + ' px'),
    (r.focusMax === null ? '   —' : r.focusMax.toFixed(2).padStart(8) + ' px'),
    r.sagBack.toFixed(1).padStart(12) + ' px',
    r.thickness.toFixed(1).padStart(9) + ' px');
}
const converged = await probe();

console.log('\n=== Was die Brechzahl mit der Linse macht (je 400 Generationen) ===');
console.log('   n      Fitness      Streuung rms   Woelbung hinten   Dicke');
for (const n of [1.20, 1.60, 2.00]) {
  await page.evaluate((n) => {
    App.reset();
    const s = document.getElementById('slider-n');
    s.value = String(n); s.dispatchEvent(new Event('input', { bubbles: true }));
    App.nLens = n;
    App.togglePlay();
  }, n);
  await runTo(400);
  const r = await probe();
  console.log('  ' + r.n.toFixed(2).padStart(4),
    r.fitness.toExponential(3).padStart(12),
    r.focusRms.toFixed(2).padStart(11) + ' px',
    r.sagBack.toFixed(1).padStart(12) + ' px',
    r.thickness.toFixed(1).padStart(9) + ' px');
  await page.evaluate(() => { App.paused = true; });
}

console.log('\n=== Wandernder Brennpunkt: kann die Evolution folgen? ===');
await page.evaluate(() => {
  App.reset();
  App.nLens = 1.60;
  const s = document.getElementById('slider-n'); if (s) { s.value = '1.60'; s.dispatchEvent(new Event('input', { bubbles: true })); }
  App.togglePlay();
});
await runTo(400);                       // first converge on a standing focus
const beforeOsc = await probe();
console.log('  vor dem Wandern: rms ' + beforeOsc.focusRms.toFixed(2) + ' px bei Generation ' + beforeOsc.gen);
await page.evaluate(() => {
  const cb = document.getElementById('check-oscillate');
  cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true }));
});
const track = [];
for (let i = 0; i < 12; i++) {
  await page.waitForTimeout(1000);
  const r = await probe();
  track.push(r);
  console.log('  +' + (i + 1) + 's  Gen ' + String(r.gen).padStart(5) +
    '  Brennpunkt y ' + r.focus.y.toFixed(0).padStart(4) +
    '  rms ' + r.focusRms.toFixed(2).padStart(7) + ' px');
}
const rmsList = track.map((r) => r.focusRms);
console.log('  Nachlauffehler waehrend des Wanderns: min ' + Math.min(...rmsList).toFixed(2) +
  ' / median ' + rmsList.slice().sort((a, b) => a - b)[Math.floor(rmsList.length / 2)].toFixed(2) +
  ' / max ' + Math.max(...rmsList).toFixed(2) + ' px');
console.log('  Bezugsgroesse: Linsenhoehe ' + beforeOsc.perimeter + ' px, Brennweite ' +
  (beforeOsc.focus.x - beforeOsc.offsetX).toFixed(0) + ' px');

await browser.close();
