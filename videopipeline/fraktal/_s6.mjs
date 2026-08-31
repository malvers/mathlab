// Scene 6 came out black in the dry run. Find out what the Julia plane actually needs
// after a deep Mandelbrot zoom: is it the zoom that survives the mode switch, is the
// reset animated and still running, or is c simply not being applied?
import { chromium } from 'playwright';
import { workDir } from '../lib/paths.mjs';
const OUT = workDir('fraktal');
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto('http://localhost:8765/mandelbrot.html', { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2200);
await page.evaluate(() => document.getElementById('local-badge')?.remove());
await page.click('#btn-mode-m'); await page.waitForTimeout(400);
await page.click('#btn-plane-fractal'); await page.waitForTimeout(1200);

const read = async (tag) => {
  const r = await page.evaluate(() => ({
    zoom: document.getElementById('readout-zoom')?.textContent.trim(),
    detail: document.getElementById('readout-detail')?.textContent.trim(),
    cre: document.querySelector('#jx-mount .val-display')?.textContent.trim(),
    cim: document.querySelector('#jy-mount .val-display')?.textContent.trim(),
    dark: (() => {                       // share of the canvas that is pure black
      const c = document.getElementById('canvas');
      const gl = c.getContext('webgl') || c.getContext('webgl2');
      const px = new Uint8Array(c.width * c.height * 4);
      gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let n = 0;
      for (let i = 0; i < px.length; i += 4 * 37) if (px[i] + px[i+1] + px[i+2] < 24) n++;
      return (n / Math.ceil(px.length / (4 * 37)) * 100).toFixed(1) + '% schwarz';
    })(),
  }));
  console.log(tag.padEnd(34), 'Zoom', String(r.zoom).padEnd(9), 'c =', r.cre, '/', r.cim, '·', r.dark);
};

// get deep, the way scene 5 and 7 leave the lab
const box = await page.evaluate(() => { const c = document.getElementById('canvas'); const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, bw: c.width, bh: c.height }; });
const MIN = Math.min(box.bw, box.bh);
await page.mouse.move(box.x + box.w * 0.5 + (-0.743643887) / 3 * MIN, box.y + box.h * 0.5 - 0.131825904 / 3 * MIN);
for (let i = 0; i < 160; i++) await page.mouse.wheel(0, -240);
await page.waitForTimeout(1200);
await read('nach dem Tiefzoom (Mandelbrot)');

await page.click('#btn-mode-j'); await page.waitForTimeout(1200);
await read('nach Umschalten auf JULIA');
await page.click('#btn-reset');
for (const ms of [400, 1200, 2500, 4000]) {
  await page.waitForTimeout(ms === 400 ? 400 : 800);
  await read('  RESET + ' + ms + ' ms');
}
await page.evaluate(() => {
  for (const [m, v] of [['jx-mount', -200], ['jy-mount', 0]]) {
    const i = document.querySelector('#' + m + ' input.cyber-slider');
    i.value = String(v); i.dispatchEvent(new Event('input', { bubbles: true }));
    i.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
await page.waitForTimeout(1200);
await read('c = -0,2 gesetzt');
await page.screenshot({ path: `${OUT}/probe_s6.png` });
await browser.close();
