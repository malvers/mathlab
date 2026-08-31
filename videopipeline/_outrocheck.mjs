import http from 'http'; import fs from 'fs'; import path from 'path';
import { chromium } from 'playwright'; import { fileURLToPath } from 'url';
const ASSETS = fileURLToPath(new URL('./assets', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => {
  const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || 'outro.html';
  const f = path.resolve(ASSETS, rel);
  if (!f.startsWith(ASSETS)) { r.statusCode = 403; r.end(); return; }
  try { r.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream'); r.end(fs.readFileSync(f)); }
  catch { r.statusCode = 404; r.end(); }
});
await new Promise((x) => srv.listen(8896, '127.0.0.1', x));
const b = await chromium.launch({ channel: 'chromium' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await p.goto('http://127.0.0.1:8896/outro.html?logo=1&qr=' + encodeURIComponent('https://docalvers.de/LensStandalone/cmaes_java.html'), { waitUntil: 'load' });
await p.waitForTimeout(4000);
await p.screenshot({ path: '/Users/malvers/Movies/videopipeline/outro_probe.png' });
const s = await p.evaluate(() => {
  const c = document.getElementById('stars'), x = c.getContext('2d');
  const pick = (px, py) => { const d = x.getImageData(px * (c.width / innerWidth), py * (c.height / innerHeight), 1, 1).data; return [d[0], d[1], d[2]]; };
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let sum = 0; for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  return { ecke: pick(6, 6), mitte: pick(640, 330), unten: pick(640, 700), mittel: +(sum / (d.length / 4)).toFixed(1) };
});
console.log('Abbinder-Hintergrund:', JSON.stringify(s));
await b.close(); srv.close();
