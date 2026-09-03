import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('https://docalvers.de/index.html', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(2500);
for (const f of ['neu', 'geometrie', 'hot']) {
  await p.evaluate(k => window.showFilter(k), f);
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => (x.getAttribute('href') || '').includes('brahmagupta'));
    if (!a) return { found: false };
    const box = a.getBoundingClientRect();
    return { found: true, visible: box.width > 0 && box.height > 0, w: Math.round(box.width), h: Math.round(box.height), text: a.innerText.split('\n')[0] };
  });
  console.log(f, JSON.stringify(r));
}
await b.close();
