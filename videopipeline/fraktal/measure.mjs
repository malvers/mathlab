// Ground truth for the fractal film. The escape times are exact arithmetic (no lab
// needed); the lab is then asked what it can actually do — which globals a recording
// can reach, and how deep the zoom goes before double precision would give up.
import { chromium } from 'playwright';

/* --- exact: how many steps until |z| > 2, for points the film will actually show --- */
function escape(cx, cy, cap = 100000) {
  let x = 0, y = 0;
  for (let i = 0; i < cap; i++) {
    const x2 = x * x, y2 = y * y;
    if (x2 + y2 > 4) return i;
    const nx = x2 - y2 + cx;
    y = 2 * x * y + cy;
    x = nx;
  }
  return null;                       // bounded as far as we looked
}
const PTS = [
  ['Mitte der Kardioide', -0.2, 0.0],
  ['Kopf des Apfelmaennchens', -1.0, 0.0],
  ['knapp ausserhalb', 0.3, 0.0],
  ['deutlich draussen', 1.0, 0.0],
  ['Seepferdchental', -0.75, 0.1],
  ['direkt am Rand', -0.75, 0.0],
  ['Misiurewicz-Punkt', -0.1010963, 0.9562865],
];
console.log('=== Fluchtzeit: wie viele Schritte bis |z| > 2 ===');
for (const [name, cx, cy] of PTS) {
  const e = escape(cx, cy);
  console.log('  ' + name.padEnd(28), '(' + cx + ', ' + cy + ')',
    e === null ? 'bleibt beschraenkt (100 000 Schritte geprueft)' : e + ' Schritte');
}

/* --- how the escape time explodes as you approach the boundary --- */
console.log('\n=== Annaeherung an den Rand bei c = -0,75 + i*eps ===');
console.log('   eps         Schritte');
for (const eps of [0.1, 0.03, 0.01, 0.003, 0.001, 0.0003, 0.0001]) {
  const e = escape(-0.75, eps, 2000000);
  console.log('  ' + String(eps).padEnd(10), e === null ? 'beschraenkt' : String(e).padStart(9));
}

/* --- what a recording can reach in the lab --- */
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:8765/mandelbrot.html', { waitUntil: 'load' });
await page.waitForTimeout(3500);
const probe = await page.evaluate(() => {
  const reach = (n) => { try { return typeof eval(n); } catch (e) { return 'unreachable'; } };
  const ids = ['btn-mode-m', 'btn-mode-j', 'btn-plane-fractal', 'btn-plane-orbit',
               'btn-flight', 'btn-reset', 'readout-detail', 'readout-zoom',
               'orbit-view-wrap', 'orbit-hud', 'mb-fractal-formula-tex'];
  return {
    globals: Object.fromEntries(['mode', 'zoom', 'maxIter', 'juliaX', 'juliaY', 'centerX', 'centerY']
      .map((n) => [n, reach(n)])),
    dom: Object.fromEntries(ids.map((i) => [i, !!document.getElementById(i)])),
    detail: (document.getElementById('readout-detail') || {}).textContent,
    zoom: (document.getElementById('readout-zoom') || {}).textContent,
    flightDisabled: (document.getElementById('btn-flight') || {}).disabled,
    webgl: !!document.querySelector('canvas'),
  };
});
console.log('\n=== Was die Aufnahme im Lab erreichen kann ===');
console.log('  Globale Namen:', JSON.stringify(probe.globals));
console.log('  DOM-Griffe   :', JSON.stringify(probe.dom));
console.log('  Detail /', probe.detail, ' Zoom /', probe.zoom, ' Flug-Knopf gesperrt:', probe.flightDisabled);
if (errs.length) console.log('  Seitenfehler:', errs.slice(0, 3).join(' | '));
await browser.close();

/* --- and now the thing this film is going to be built around ---------------
   At c = -0.75 + i*eps the escape count N times eps converges to pi. That is not
   a coincidence and not folklore: it is measured below to five decimals. */
console.log('\n=== c = -0,75 + i*eps : N mal eps ===');
console.log('   eps          N            N * eps');
for (const eps of [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7]) {
  const N = escape(-0.75, eps, 200000000);
  console.log('  ' + eps.toExponential(0).padEnd(9), String(N).padStart(11), '   ' + (N * eps).toFixed(6));
}
console.log('  pi         =              3.141593');
