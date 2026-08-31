import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
await p.goto('file://' + process.argv[2]);
await p.waitForTimeout(1400);
console.log(JSON.stringify(await p.evaluate(() => ({
  scenes: document.querySelectorAll('.scene').length,
  arc: document.querySelectorAll('.arc span').length,
  rows: document.querySelectorAll('.tbl tbody tr').length,
  budget: [...document.querySelectorAll('.budget dd')].map(d => d.firstChild.textContent),
  heroInk: (() => { const c = document.getElementById('stage'); if(!c) return null; const x = c.getContext('2d');
      const d = x.getImageData(0,0,c.width,c.height).data; let n=0;
      for (let i=0;i<d.length;i+=4) if (d[i]+d[i+1]+d[i+2] > 200) n++;
      return +(100*n/(d.length/4)).toFixed(2); })(),
  plotInk: (() => { const c = document.querySelector('#convplot,#errplot'); if(!c) return null; const x = c.getContext('2d');
      const d = x.getImageData(0,0,c.width,c.height).data; let n=0;
      for (let i=0;i<d.length;i+=4) if (d[i]+d[i+1]+d[i+2] > 200) n++;
      return +(100*n/(d.length/4)).toFixed(2); })(),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
}))));
console.log(errs.length ? errs.join('\n') : 'no errors');
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(400);
console.log('mobile overflow:', await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1));
await b.close();
