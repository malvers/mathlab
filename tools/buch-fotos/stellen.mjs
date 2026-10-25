// Does every planned spot exist? node selcheck.mjs <plan.json> <book> [lang-suffix...]
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';
const PORT = process.env.PORT || 8765;          // a local server on HTML/ (serve.py: 8765)
import { readFileSync } from 'node:fs';
const [plan, book, ...langs] = process.argv.slice(2);
const P = JSON.parse(readFileSync(plan, 'utf8'));
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
for (const suf of ['', ...langs]) for (const [file, spots] of Object.entries(P)) {
  await p.goto(`http://localhost:${PORT}/buch/${book}${suf}/${file}`, { waitUntil: 'domcontentloaded' });
  for (const [name, sel] of spots) { const n = await p.locator(sel).count(); if (n !== 1) console.log(`${book}${suf}/${file} ${name}: ${sel} → ${n}`); }
}
console.log('done'); await b.close();
