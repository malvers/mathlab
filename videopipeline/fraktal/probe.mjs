// What the orbit view can actually be driven to do — scenes 2, 3 and 8 live there.
// The lab's state sits in a closure (measure.mjs: mode, zoom, maxIter, centerX/Y and
// juliaX/Y are all unreachable), so the recording has only the DOM sliders, the
// segment buttons and the mouse. This probe finds out what each of them does and
// leaves one screenshot per step to look at.
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

console.log('Regler und Schalter im Panel:');
console.log(await page.evaluate(() => [...document.querySelectorAll('#side-panel input')].map(i => ({
  id: i.id || i.closest('[id]')?.id, type: i.type, min: i.min, max: i.max, step: i.step, value: i.value,
}))));
console.log('Checkboxen:', await page.evaluate(() =>
  [...document.querySelectorAll('input[type=checkbox]')].map(c => c.id + '=' + c.checked)));

// scene 2/3/8 setting: Mandelbrot, orbit plane, worked chain shown
await page.click('#btn-mode-m'); await page.waitForTimeout(300);
await page.click('#btn-plane-orbit'); await page.waitForTimeout(800);
await page.evaluate(() => {
  const cb = document.getElementById('orbit-show-worked-checkbox');
  if (cb && !cb.checked) cb.click();
});
await page.waitForTimeout(600);

/** Drive one of the c sliders; they run in thousandths (-2000 … 2000). */
const setC = async (re, im) => {
  await page.evaluate(([re, im]) => {
    for (const [mount, v] of [['jx-mount', re], ['jy-mount', im]]) {
      const inp = document.querySelector('#' + mount + ' input.cyber-slider');
      if (!inp) return;
      inp.value = String(Math.round(v * 1000));
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [re, im]);
  await page.waitForTimeout(900);
};

const hud = () => page.evaluate(() => (document.getElementById('orbit-hud')?.innerText || '').replace(/\s+/g, ' ').slice(0, 220));

for (const [tag, re, im] of [['s2', -0.2, 0], ['s3', 0.3, 0], ['s8', -0.75, 0.1]]) {
  await setC(re, im);
  console.log('\n' + tag, 'c =', re, im, '\n  HUD:', await hud());
  await page.screenshot({ path: `${OUT}/probe_orbit_${tag}.png` });
}
console.log('\nBilder in', OUT);
await browser.close();
