// Scene 7 fact-check — does the plot's claim about precision hold?
//
// The plot says: the picture survives to 1e-15 (double precision), and the lab then
// switches to perturbation arithmetic and reaches 1e-80. Neither is in the code. The
// fragment shader is `precision highp float` — 32 bit, ~7 decimal digits — the escape
// loop is capped at 512 iterations, and ZOOM_MAX is 200000. There is no second,
// higher-precision path anywhere in mandelbrot.html.
//
// So this script asks the running lab two things instead of trusting the plot:
//   1. how deep the wheel actually gets, read off #readout-zoom
//   2. how wide the flat blocks are on the way down, measured in canvas pixels
//
// A block is a run of neighbouring pixels with identical colour. Once the step in c
// from one pixel to the next falls below one float32 ulp, whole runs of pixels land on
// the same number and the shader hands back the same escape count for all of them.
//
// The zoom is anchored on the cursor (centerKeepingFocalPlane), so the c under the
// mouse is invariant: park the cursor once on the target and never move it again.
// Moving it — as an earlier version did, hunting for contrast — is exactly what makes
// the view drift off into solid black.
import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:8765/mandelbrot.html';
const TARGET = { re: -0.743643887, im: 0.131825904 };   // on the boundary, seahorse valley

const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());        // the lab remembers mode and view
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.evaluate(() => document.getElementById('local-badge')?.remove());
await page.click('#btn-mode-m');                        // shipped default is JULIA, not Mandelbrot
await page.waitForTimeout(400);
await page.click('#btn-plane-fractal');                 // the fractal canvas is sized only when shown
await page.waitForTimeout(1500);

// the two sliders mirror the fractal centre (syncMbJuliaSlidersFromFractalCenter), so
// they are the only readable check that the zoom is still going where it was aimed
const centreNow = () => page.evaluate(() => ['jx-mount', 'jy-mount']
  .map(id => document.querySelector('#' + id + ' .val-display')?.textContent.trim()).join(' / '));
const zoomNow = () => page.evaluate(() =>
  parseFloat((document.getElementById('readout-zoom')?.textContent || '').replace(/\./g, '').replace(',', '.')));
const box = await page.evaluate(() => {
  const c = document.getElementById('canvas');
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, bw: c.width, bh: c.height };
});
console.log('Canvas', box.bw + 'x' + box.bh, '· Zoom beim Laden', await zoomNow());

/* Same mapping the shader uses: uv = (frag - res/2) / min(res), c = center + uv * 3/zoom,
   center starts at (0,0) and zoom at 1. */
const MIN = Math.min(box.bw, box.bh);
const mx = box.x + box.w * ((0.5 * box.bw + TARGET.re / 3 * MIN) / box.bw);
const my = box.y + box.h * ((0.5 * box.bh - TARGET.im / 3 * MIN) / box.bh);

/* Widths of the constant-colour runs along a horizontal line. A row of solid black is
   one run the width of the canvas — that is emptiness, not a block, so rows without
   real structure are reported as such instead of being averaged in. */
const scan = () => page.evaluate(() => {
  const c = document.getElementById('canvas');
  const gl = c.getContext('webgl') || c.getContext('webgl2');
  const px = new Uint8Array(c.width * 4);
  gl.readPixels(0, Math.floor(c.height / 2), c.width, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
  const runs = []; let run = 1;
  for (let i = 1; i < c.width; i++) {
    const same = px[i * 4] === px[(i - 1) * 4] && px[i * 4 + 1] === px[(i - 1) * 4 + 1] && px[i * 4 + 2] === px[(i - 1) * 4 + 2];
    if (same) run++; else { runs.push(run); run = 1; }
  }
  runs.push(run);
  if (runs.length < 8) return { edges: runs.length - 1, median: null };
  const inner = runs.slice(1, -1).sort((a, b) => a - b);
  return { edges: runs.length - 1, median: inner[Math.floor(inner.length / 2)] };
});

await page.mouse.move(mx, my);
console.log('Ziel: c = ' + TARGET.re + ' + ' + TARGET.im + 'i  (auf dem Rand)');
console.log('\n  Zoom          c-Schritt/Pixel   Kanten   Stufenbreite   Mitte');
let last = 0;
for (let round = 0; round < 60; round++) {
  for (let k = 0; k < 4; k++) await page.mouse.wheel(0, -240);   // cursor stays put on purpose
  await page.waitForTimeout(400);
  const z = await zoomNow();
  const s = await scan();
  const step = 3 / z / MIN;                                      // how far apart two pixels are in c
  console.log('  ' + z.toExponential(2).padEnd(12), step.toExponential(2).padEnd(16),
    String(s.edges).padStart(6), String(s.median === null ? '-' : s.median).padStart(12),
    '   Mitte ' + await centreNow());
  // a frame from the middle of the breakdown is what scene 7 has to show
  if (s.median !== null && s.median >= 10 && !global.__shot) {
    global.__shot = true;
    await page.locator('#canvas').screenshot({ path: '/tmp/fraktal_bloecke.png' });
    console.log('  -> Blockbild bei Zoom ' + z.toExponential(2) + ' nach /tmp/fraktal_bloecke.png');
  }
  if (z >= 199999 && last >= 199999) break;
  last = z;
}
console.log('\nDetail-Anzeige:', await page.evaluate(() => document.getElementById('readout-detail')?.textContent.trim()));
console.log('float32-ulp bei 0,74 =', (2 ** -24).toExponential(2), '— darunter sind zwei Nachbarpixel dieselbe Zahl.');
await page.screenshot({ path: '/tmp/fraktal_maxzoom.png' });
await page.locator('#canvas').screenshot({ path: '/tmp/fraktal_canvas.png' });
await browser.close();
