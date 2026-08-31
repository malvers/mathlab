import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
await p.goto('file:///Users/malvers/IdeaProjects/forloop/HTML/drehbuch/fourier.html');
await p.waitForTimeout(1400);
console.log(JSON.stringify(await p.evaluate(() => ({
  scenes: document.querySelectorAll('.scene').length,
  say: document.querySelectorAll('.say').length,
  budget: [...document.querySelectorAll('.budget dd')].map(d => d.firstChild.textContent),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
}))));
console.log(errs.length ? errs.join('\n') : 'no errors');
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(400);
console.log('mobile overflow:', await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1));
await b.close();
