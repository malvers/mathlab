// The one question measure2 left open: from zoom 1e4 on the picture flattens out —
// is that the 32-bit shader giving up, or did the view simply slide off the boundary?
// A fine ladder of frames between 1e4 and the 2e5 cap answers it by eye: float32
// breakdown keeps the motif and turns it into hard square tiles, drift loses the motif
// while everything stays smooth.
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';

const TARGET = { re: -0.743643887, im: 0.131825904 };
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await page.goto('http://localhost:8765/mandelbrot.html', { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.evaluate(() => document.getElementById('local-badge')?.remove());
await page.click('#btn-mode-m'); await page.waitForTimeout(400);
await page.click('#btn-plane-fractal'); await page.waitForTimeout(1500);

const box = await page.evaluate(() => { const c = document.getElementById('canvas'); const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, bw: c.width, bh: c.height }; });
const MIN = Math.min(box.bw, box.bh);
const zoomNow = () => page.evaluate(() =>
  parseFloat((document.getElementById('readout-zoom').textContent || '').replace(/\./g, '').replace(',', '.')));

// the zoom is anchored on the cursor, so the c under it is invariant - park it once
await page.mouse.move(box.x + 0.5 * box.w + TARGET.re / 3 * MIN, box.y + 0.5 * box.h - TARGET.im / 3 * MIN);

const MARKS = [1e4, 2e4, 4e4, 7e4, 1.2e5, 2e5];
const files = []; let i = 0;
for (let k = 0; k < 150 && i < MARKS.length; k++) {
  for (let j = 0; j < 3; j++) await page.mouse.wheel(0, -240);
  const z = await zoomNow();
  if (z >= MARKS[i] || (z >= 199999)) {
    await page.waitForTimeout(700);
    const f = `/tmp/lad_${i}.png`;
    // crop the middle, so the HUD and the formula box stay out of the comparison
    await page.locator('#canvas').screenshot({ path: f, clip: { x: box.w * 0.3, y: box.h * 0.3, width: box.w * 0.4, height: box.h * 0.4 } });
    console.log('Zoom', z.toExponential(2), '->', f);
    files.push(f); i++;
    if (z >= 199999) break;
  }
}
await browser.close();
execFileSync('ffmpeg', ['-y', ...files.flatMap(f => ['-i', f]), '-filter_complex',
  `${files.map((_, n) => '[' + n + ']').join('')}hstack=inputs=${files.length},scale=1800:-1`,
  '-frames:v', '1', '-update', '1', '/tmp/leiter.png']);
console.log('Leiter: /tmp/leiter.png');
