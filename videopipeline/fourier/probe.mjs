// Contact sheet of the three inserts: five moments per scene, so a beat that lands on
// top of another one is visible before the take is committed.
//   node videopipeline/fourier/probe.mjs [s5,s9,s12]
import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { workDir } from '../lib/paths.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = workDir('fourier');
const PORT = 8899;
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'karten.html';
  const file = path.resolve(HERE, rel);
  if (file !== HERE && !file.startsWith(HERE)) { res.statusCode = 403; res.end('nope'); return; }
  try { res.setHeader('Content-Type', 'text/html'); res.end(fs.readFileSync(file)); }
  catch { res.statusCode = 404; res.end('nope'); }
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

// the real spoken lengths, so the beats are checked at the pace they will run at
let durs = {};
try { durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8')); } catch (e) { /* not spoken yet */ }

const SCENES = process.argv[2] ? process.argv[2].split(',') : ['s5', 's9', 's12'];
const AT = [0.15, 0.35, 0.55, 0.75, 0.97];

const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
for (const s of SCENES) {
  const DUR = durs[s] || 18;
  await page.goto(`http://127.0.0.1:${PORT}/karten.html?scene=${s}&dur=${DUR.toFixed(2)}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__vpReady === true, null, { timeout: 20000 });
  const t0 = Date.now();
  for (const u of AT) {
    const wait = t0 + u * DUR * 1000 - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: `${OUT}/probe_${s}_${Math.round(u * 100)}.png` });
  }
  console.log(s, DUR.toFixed(1) + 's ok');
}
await browser.close();
server.close();

// one sheet per scene: five moments stacked, downscaled so the whole column is readable
for (const s of SCENES) {
  const row = AT.map((u) => `${OUT}/probe_${s}_${Math.round(u * 100)}.png`);
  execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...row.flatMap((f) => ['-i', f]),
    '-filter_complex', `${row.map((_, i) => `[${i}:v]scale=560:-1[v${i}]`).join(';')};${row.map((_, i) => `[v${i}]`).join('')}vstack=inputs=${row.length}`,
    `${OUT}/sheet_${s}.png`]);
  console.log('sheet', `${OUT}/sheet_${s}.png`);
}
