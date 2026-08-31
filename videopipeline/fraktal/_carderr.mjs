import http from 'http'; import fs from 'fs'; import path from 'path';
import { chromium } from 'playwright'; import { fileURLToPath } from 'url';
const HERE = fileURLToPath(new URL('.', import.meta.url));
const server = http.createServer((q, r) => {
  const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || 'karten.html';
  try { r.setHeader('Content-Type', 'text/html'); r.end(fs.readFileSync(path.resolve(HERE, rel))); }
  catch { r.statusCode = 404; r.end('nope'); }
});
await new Promise((r) => server.listen(8898, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
page.on('console', m => console.log('CONSOLE', m.type(), m.text().slice(0, 300)));
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0, 300)));
for (const s of ['s4','s8','s9','s10']) {
  await page.goto(`http://127.0.0.1:8898/karten.html?scene=${s}&dur=6`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  console.log(s, 'ready =', await page.evaluate(() => window.__vpReady),
    '| Zeilen =', await page.evaluate(() => (typeof S9 !== 'undefined' ? JSON.stringify(S9) : 'n/a')).catch(()=>'?'));
}
await browser.close(); server.close();
