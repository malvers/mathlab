// Record the outro frames (crazy + logo/QR) at native resolution from assets/outro.html.
// Served over a throwaway local HTTP server — the CDP screencast does not paint file:// pages.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { runScenes } from './record-cdp.mjs';

const ASSETS = new URL('../assets', import.meta.url).pathname;
const MIME = { '.html': 'text/html', '.js': 'text/javascript' };

export async function recordOutros({ outDir, qrUrl, crazyText = 'DAS CRAZY!', emoji = '😎' }) {
  const server = http.createServer((req, res) => {
    const file = path.join(ASSETS, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'outro.html');
    try {
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.end(fs.readFileSync(file));
    } catch { res.statusCode = 404; res.end('nope'); }
  });
  await new Promise((r) => server.listen(8899, '127.0.0.1', r));
  try {
    const PAGE = 'http://127.0.0.1:8899/outro.html';
    await runScenes([
      { name: 'outro1', url: `${PAGE}?text=${encodeURIComponent(crazyText)}&emoji=${encodeURIComponent(emoji)}`,
        run: async (p) => { await p.waitForTimeout(3200); } },
      { name: 'outro2', url: `${PAGE}?logo=1&qr=${encodeURIComponent(qrUrl)}`,
        run: async (p) => { await p.waitForTimeout(6200); } },
    ], { outDir, viewport: { width: 2560, height: 1440 }, upscale: 1 });
  } finally {
    server.close();
  }
  // trim away the page-load lead-in (fonts can take seconds) — keep from just after 'loaded'
  for (const name of ['outro1', 'outro2']) {
    const log = JSON.parse(fs.readFileSync(`${outDir}/${name}.json`));
    const t0 = (log.find((m) => m.label === 'loaded') || { t: 0 }).t + 0.25;
    const { execFileSync } = await import('child_process');
    execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-ss', String(t0), '-i', `${outDir}/${name}.mp4`,
      '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', `${outDir}/${name}_t.mp4`]);
  }
  return [`${outDir}/outro1_t.mp4`, `${outDir}/outro2_t.mp4`];
}
