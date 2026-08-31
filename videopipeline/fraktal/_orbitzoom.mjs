// Scene 3 needs the escaping link AND the dashed |z| = 2 circle in one frame. At the
// default orbit scale the view reaches to about x = 1.9, and the eighth link sits at
// 2.21 - just outside. So: wheel out on the orbit canvas first, then step up to 8.
import { chromium } from 'playwright';
import { workDir } from '../lib/paths.mjs';
const OUT = workDir('fraktal');
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await page.goto('http://localhost:8765/mandelbrot.html', { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2200);
await page.evaluate(() => document.getElementById('local-badge')?.remove());
await page.click('#btn-mode-m'); await page.waitForTimeout(300);
await page.click('#btn-plane-orbit'); await page.waitForTimeout(800);
await page.evaluate(() => {
  for (const [m, v] of [['jx-mount', 350], ['jy-mount', 0]]) {
    const i = document.querySelector('#' + m + ' input.cyber-slider');
    i.value = String(v); i.dispatchEvent(new Event('input', { bubbles: true }));
    i.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
await page.waitForTimeout(700);
const box = await page.evaluate(() => { const r = document.getElementById('orbit-canvas').getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height }; });
for (const OUTTICKS of [6, 10]) {
  await page.keyboard.press('ArrowDown'); // reset chain low
  await page.mouse.move(box.x + box.w * 0.5, box.y + box.h * 0.5);
  for (let i = 0; i < OUTTICKS; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(60); }
  await page.waitForTimeout(600);
  for (let k = 0; k < 12; k++) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(40); }
  for (let k = 0; k < 8; k++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(180); }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/probe_zoomout_${OUTTICKS}.png` });
  console.log('herausgezoomt', OUTTICKS, 'Ticks ->', `${OUT}/probe_zoomout_${OUTTICKS}.png`);
}
await browser.close();
