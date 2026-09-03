import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
await p.goto('file:///Users/malvers/IdeaProjects/forloop/HTML/brahmagupta.html', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(1800);

const read = () => p.evaluate(() => {
  const cards = [...document.querySelectorAll('#data-container .stats-card')]
    .map(c => c.querySelector('.stats-label').textContent.trim() + ' = ' + c.querySelector('.stats-val').textContent.trim());
  return {
    cards,
    verts: document.querySelectorAll('#layer-nodes .vertex').length,
    mids: document.querySelectorAll('.mid-dot').length,
    perps: document.querySelectorAll('.perp').length,
    coachTitle: document.getElementById('coach-title-slot')?.textContent,
    coachHasToggle: !!document.querySelector('#math-coach-box .coach-toggle'),
    katex: !!document.querySelector('#formula-slot .katex'),
    rows: document.getElementById('measure-rows')?.innerText.replace(/\n/g, ' | '),
    subtitle: document.querySelector('#sidebar-header')?.innerText.split('\n').slice(0,3).join(' / ')
  };
});
console.log('--- SATZ (default) ---');
console.log(JSON.stringify(await read(), null, 1));

// drag vertex C somewhere else
const box = await p.locator('#lab-canvas').boundingBox();
const toScreen = (x, y) => ({ x: box.x + box.width * x / 600, y: box.y + box.height * y / 600 });
async function dragTo(idx, vx, vy) {
  const h = await p.locator(`#layer-nodes .vertex[data-idx="${idx}"]`).boundingBox();
  const t = toScreen(vx, vy);
  await p.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await p.mouse.down();
  await p.mouse.move(t.x, t.y, { steps: 12 });
  await p.mouse.up();
  await p.waitForTimeout(120);
}
await dragTo(2, 560, 420);
await dragTo(1, 500, 90);
console.log('--- SATZ after dragging B and C ---');
console.log(JSON.stringify((await read()).cards, null, 1));
await p.screenshot({ path: process.argv[2] + '/satz.png' });

// all four perpendiculars
await p.locator('#opt-slot .cyber-checkbox').check();
await p.waitForTimeout(200);
console.log('perp count with ALL:', (await read()).perps, 'mids:', (await read()).mids);
await p.screenshot({ path: process.argv[2] + '/satz-all.png' });

// switch mode
await p.locator('#mode-slot input[value="formel"]').check();
await p.waitForTimeout(400);
console.log('--- FORMEL ---');
console.log(JSON.stringify(await read(), null, 1));
await p.screenshot({ path: process.argv[2] + '/formel.png' });

// take vertices off the circle
await p.locator('#opt-slot .cyber-checkbox').uncheck();
await p.waitForTimeout(200);
await dragTo(3, 300, 380);
console.log('--- FORMEL off-circle ---');
console.log(JSON.stringify((await read()).cards, null, 1));
await p.screenshot({ path: process.argv[2] + '/formel-frei.png' });

// mobile
await p.setViewportSize({ width: 1100, height: 760 });
await p.waitForTimeout(400);
console.log('overflow:', await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1));

console.log(errs.length ? '\nERRORS:\n' + errs.join('\n') : '\nno errors');
await b.close();
