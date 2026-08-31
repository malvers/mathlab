import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('console', m => { if (/error/i.test(m.type())) console.log('PAGE', m.text().slice(0,120)); });
await page.goto('http://localhost:8765/mandelbrot.html', { waitUntil: 'load' });
await page.waitForTimeout(3000);
console.log(await page.evaluate(() => [...document.querySelectorAll('canvas')].map(c => {
  const r = c.getBoundingClientRect();
  return { id: c.id, cls: c.className, css: Math.round(r.width)+'x'+Math.round(r.height), buf: c.width+'x'+c.height, vis: r.width>0 };
})));
console.log('plane buttons', await page.evaluate(() => ['btn-plane-fractal','btn-plane-orbit'].map(i=>{const e=document.getElementById(i);return i+':'+(e?e.className:'MISSING');})));
await browser.close();
