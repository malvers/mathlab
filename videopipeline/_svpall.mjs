import { chromium } from 'playwright';
const pages = ['informatik/fos11','informatik/fos12','informatik/inf11','informatik/inf12',
               'informatik/inf13','informatik/informatik9','mathe/mathe11','mathe/mathe5','wr/wr11'];
const b = await chromium.launch();
for (const p of pages) {
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('https://docalvers.de/svp/' + p + '.html', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(2000);
  const r = await pg.evaluate(() => {
    const tr = document.querySelector('tbody tr');
    const shown = tr ? (tr.querySelector('td:nth-child(7)') || {}).innerText : '';
    return { shown: (shown || '').replace(/\s+/g,' ').trim().slice(0, 38),
             plan: (window.PLAN && window.PLAN[0] && window.PLAN[0].topic || '').slice(0, 38),
             mat: document.querySelectorAll('.mat-label').length };
  });
  console.log(p.padEnd(24), 'Material:' + String(r.mat).padStart(3),
              '| angezeigt:', r.shown, '| HTML:', r.plan, errs.length ? '| FEHLER: ' + errs[0] : '');
  await pg.close();
}
await b.close();
