// Every photo of a book loads from R2, in every language given? node imgcheck.mjs <book> [suffix ...]
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';
const PORT = process.env.PORT || 8765;          // a local server on HTML/ (serve.py: 8765)
const [book = 'mathe11', ...sufs] = process.argv.slice(2);
const b = await chromium.launch({ headless: true });
const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/buch/${book}/index.html`);
const plan = await p.evaluate(async () => { await new Promise(r => { const s = document.createElement('script'); s.src = '../../js/buch-fotos.js'; s.onload = r; document.head.appendChild(s); }); return window.BUCH_FOTOS.books; });
for (const suf of ['', ...sufs]) {
  let n = 0, want = 0; const bad = [];
  for (const [f, spots] of Object.entries(plan[book])) {
    want += spots.length;
    await p.goto(`http://localhost:${PORT}/buch/${book}${suf}/${f}`, { waitUntil: 'load' }); await p.waitForTimeout(700);
    const r = await p.evaluate(async () => {
      const imgs = [...document.querySelectorAll('figure.b-foto img')]; imgs.forEach(i => i.loading = 'eager');
      await Promise.all(imgs.map(i => i.decode().catch(() => null)));
      return imgs.map(i => ({ src: i.src, ok: i.naturalWidth > 0 }));
    });
    n += r.length; bad.push(...r.filter(x => !x.ok || !x.src.includes('r2.dev')).map(x => f + ' ' + x.src));
  }
  console.log(`${book}${suf}: ${n}/${want} photos, bad: ${bad.length ? bad.join(' | ') : 'none'}`);
}
console.log('page errors:', errs.length ? errs.slice(0, 3) : 'none'); await b.close();
