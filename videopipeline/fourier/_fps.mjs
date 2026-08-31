import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await p.goto('http://localhost:8765/fourier.html', { waitUntil: 'load' });
await p.waitForFunction(() => typeof fourierZ !== 'undefined' && fourierZ.length > 0, null, { timeout: 30000 });
await p.waitForTimeout(2000);
const fps = async (label, n, vis, speed) => {
  await p.evaluate(([n, vis, speed]) => {
    adjustNTo(n);
    showEpicycles = vis;
    const s = document.getElementById('speed-input');
    s.value = String(speed); s.dispatchEvent(new Event('input', { bubbles: true }));
    time = 0; path = []; paused = false;
    window.__f = 0;
    const t = () => { window.__f++; requestAnimationFrame(t); };
    t();
  }, [n, vis, speed]);
  await p.waitForTimeout(2000);
  const f = await p.evaluate(() => window.__f);
  console.log(label.padEnd(28), (f / 2).toFixed(1), 'fps');
};
await fps('N=2 Kreise an', 2, true, 60);
await fps('N=20 Kreise an', 20, true, 100);
await fps('N=1000 Kreise an', 1000, true, 500);
await fps('N=1000 Kreise aus', 1000, false, 500);
// real lap time at the speeds the film uses
for (const sp of [60, 150, 200, 300, 500]) {
  const t0 = Date.now();
  await p.evaluate((sp) => {
    const s = document.getElementById('speed-input');
    s.value = String(sp); s.dispatchEvent(new Event('input', { bubbles: true }));
    adjustNTo(20); time = 0; path = []; paused = false;
  }, sp);
  await p.waitForFunction(() => paused === true, null, { timeout: 30000, polling: 50 });
  console.log(('Runde bei Tempo ' + sp).padEnd(28), ((Date.now() - t0) / 1000).toFixed(2), 's');
}
await b.close();
