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
const box = await page.evaluate(() => { const c=document.getElementById('canvas'); const r=c.getBoundingClientRect();
  return {x:r.x,y:r.y,w:r.width,h:r.height,bw:c.width,bh:c.height}; });
const MIN = Math.min(box.bw, box.bh);
const mx = box.x + 0.5*box.w + TARGET.re/3*MIN, my = box.y + 0.5*box.h - TARGET.im/3*MIN;
const zoomNow = () => page.evaluate(() => parseFloat((document.getElementById('readout-zoom').textContent||'').replace(/\./g,'').replace(',','.')));
await page.mouse.move(mx, my);
const marks = [1e3, 1e4, 5e4, 2e5]; let i = 0; const files = [];
for (let k = 0; k < 120 && i < marks.length; k++) {
  for (let j = 0; j < 3; j++) await page.mouse.wheel(0, -240);
  const z = await zoomNow();
  if (z >= marks[i]) {
    await page.waitForTimeout(600);
    const f = `/tmp/strip_${i}.png`;
    await page.locator('#canvas').screenshot({ path: f });
    console.log('Zoom', z.toExponential(2), '->', f);
    files.push(f); i++;
  }
  if (z >= 199999 && i < marks.length) { await page.waitForTimeout(600);
    const f=`/tmp/strip_${i}.png`; await page.locator('#canvas').screenshot({path:f});
    console.log('Zoom', z.toExponential(2), '(Deckel) ->', f); files.push(f); break; }
}
await browser.close();
execFileSync('ffmpeg', ['-y', ...files.flatMap(f=>['-i',f]), '-filter_complex',
  `[0][1][2][3]hstack=inputs=${files.length},scale=1600:-1`, '/tmp/strip.png']);
console.log('Streifen: /tmp/strip.png');
