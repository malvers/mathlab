// Screenshot every photo spot of a book (light scheme, desktop): node spots.mjs <book>
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';
const PORT = process.env.PORT || 8765;          // a local server on HTML/ (serve.py: 8765)
import { mkdirSync } from 'node:fs';
const book = process.argv[2] || 'mathe11';
mkdirSync('ansicht', { recursive: true });
const b = await chromium.launch({ headless: true });
const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/buch/${book}/index.html`); await p.waitForTimeout(500);
const plan = await p.evaluate(async () => { await new Promise(r => { const s = document.createElement('script'); s.src = '../../js/buch-fotos.js'; s.onload = r; document.head.appendChild(s); }); return window.BUCH_FOTOS.books; });
let k = 0;
for (const [file, spots] of Object.entries(plan[book])) {
  await p.goto(`http://localhost:${PORT}/buch/${book}/${file}?farbschema=light`, { waitUntil: 'load' }); await p.waitForTimeout(1200);
  for (const s of spots) {
    const el = s.put === 'after' ? p.locator(`figure.b-foto:has(img[src$="/${s.foto}.jpg"])`) : p.locator(s.at).first();
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    await el.screenshot({ path: `ansicht/${String(++k).padStart(2, '0')}-${s.foto}.png` });
  }
}
console.log(k, 'spots, errors:', errs.length ? errs : 'none'); await b.close();
