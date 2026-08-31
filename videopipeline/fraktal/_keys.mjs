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
const setC = async (re, im) => { await page.evaluate(([re,im]) => {
  for (const [m,v] of [['jx-mount',re],['jy-mount',im]]) {
    const i = document.querySelector('#'+m+' input.cyber-slider');
    i.value = String(Math.round(v*1000));
    i.dispatchEvent(new Event('input',{bubbles:true}));
    i.dispatchEvent(new Event('change',{bubbles:true}));
  }}, [re,im]); await page.waitForTimeout(700); };
// the top formula bar carries N and |z^2| - that is the counter the film needs
const bar = () => page.evaluate(() => (document.getElementById('mb-fractal-formula-tex')?.innerText||'').replace(/\s+/g,' ').trim());
for (const [tag, re, im, n] of [['s2',-0.2,0,10],['s3',0.35,0,10]]) {
  await setC(re, im);
  await page.click('#orbit-canvas', { position: { x: 5, y: 5 } }).catch(()=>{});
  console.log('\n'+tag, 'c =', re, im, '| N am Anfang:', await bar());
  for (let k = 0; k < n; k++) {
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(120);
    if (k % 5 === 4 || k === n-1) console.log('  nach', k+1, 'x Pfeil-hoch:', await bar());
  }
  await page.screenshot({ path: `${OUT}/probe_keys_${tag}.png` });
}
await browser.close();
