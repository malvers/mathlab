// Scene 6, recorded before the deep zooms: does the Julia plane at zoom 1 actually
// show what the narration claims - connected inside the set, dust outside?
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { workDir } from '../lib/paths.mjs';
const OUT = workDir('fraktal');
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto('http://localhost:8765/mandelbrot.html', { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2200);
await page.evaluate(() => document.getElementById('local-badge')?.remove());
await page.click('#btn-mode-j'); await page.waitForTimeout(500);
await page.click('#btn-plane-fractal'); await page.waitForTimeout(1400);
const setC = (re, im) => page.evaluate(([re, im]) => {
  for (const [m, v] of [['jx-mount', re * 1000], ['jy-mount', im * 1000]]) {
    const i = document.querySelector('#' + m + ' input.cyber-slider');
    i.value = String(Math.round(v)); i.dispatchEvent(new Event('input', { bubbles: true }));
    i.dispatchEvent(new Event('change', { bubbles: true }));
  }
}, [re, im]);
const files = [];
for (const [tag, re, im] of [['d1', 0.5, 0.5], ['d2', 0.6, 0.4], ['d3', -0.2, 1.0], ['d4', 0.35, 0.6]]) {
  await setC(re, im);
  await page.waitForTimeout(1400);
  const f = `${OUT}/probe_julia_${tag}.png`;
  await page.locator('#canvas').screenshot({ path: f });
  const z = await page.evaluate(() => document.getElementById('readout-zoom')?.textContent.trim());
  console.log(tag.padEnd(14), 'c =', re, im, '· Zoom', z);
  files.push(f);
}
await browser.close();
execFileSync('ffmpeg', ['-y', ...files.flatMap(f => ['-i', f]), '-filter_complex',
  '[0][1][2][3]hstack=inputs=4,scale=1800:-1', '-frames:v', '1', '-update', '1', '/tmp/julia4.png']);
console.log('/tmp/julia4.png');
