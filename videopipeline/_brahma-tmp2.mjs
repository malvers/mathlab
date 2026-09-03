import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('file:///Users/malvers/IdeaProjects/forloop/HTML/brahmagupta.html', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => {
  const svg = document.getElementById('lab-canvas');
  const c = svg.querySelector('circle.circum');
  if (!c) return { err: 'no circum', back: document.getElementById('layer-back').innerHTML.slice(0, 200) };
  const cen = { x: +c.getAttribute('cx'), y: +c.getAttribute('cy') }, R = +c.getAttribute('r');
  const v = [...svg.querySelectorAll('.vertex')].map(e => ({
    i: e.getAttribute('data-idx'),
    r: Math.hypot(+e.getAttribute('cx') - cen.x, +e.getAttribute('cy') - cen.y).toFixed(3)
  }));
  const fb = document.getElementById('formula-slot');
  return { R, v, formulaScroll: fb.scrollWidth, formulaClient: fb.clientWidth };
}), null, 1));
await b.close();
