// Record the outro cards (crazy text + logo/QR) at native resolution from assets/outro.html.
// Served over a throwaway local HTTP server — the CDP screencast does not paint file:// pages.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runScenes } from './record-cdp.mjs';

const ASSETS = fileURLToPath(new URL('../assets', import.meta.url));   // survives spaces/umlauts in the path
const MIME = { '.html': 'text/html', '.js': 'text/javascript' };

// cards: 'crazy' = the DAS CRAZY! card, 'logo' = the branded end card (with a QR when qrUrl is set).
// Returns the trimmed clips in the order they were requested.
export async function recordOutros({ outDir, qrUrl = null, crazyText = 'DAS CRAZY!', emoji = '😎',
                                     cards = ['crazy', 'logo'], holds = {} }) {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'outro.html';
    const file = path.resolve(ASSETS, rel);
    // Serve only what is really inside assets/ — '..' in the URL must not walk the disk.
    if (file !== ASSETS && !file.startsWith(ASSETS + path.sep)) { res.statusCode = 403; res.end('nope'); return; }
    try {
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.end(fs.readFileSync(file));
    } catch { res.statusCode = 404; res.end('nope'); }
  });
  await new Promise((r) => server.listen(8899, '127.0.0.1', r));

  const PAGE = 'http://127.0.0.1:8899/outro.html';
  const SPEC = {
    crazy: { name: 'outro1', hold: holds.crazy ?? 3.2,
      url: `${PAGE}?text=${encodeURIComponent(crazyText)}&emoji=${encodeURIComponent(emoji)}` },
    logo: { name: 'outro2', hold: holds.logo ?? 6.2,
      url: `${PAGE}?logo=1${qrUrl ? '&qr=' + encodeURIComponent(qrUrl) : ''}` },
  };
  const wanted = cards.map((c) => SPEC[c]).filter(Boolean);
  try {
    await runScenes(wanted.map((c) => ({
      name: c.name, url: c.url, run: async (p) => { await p.waitForTimeout(c.hold * 1000); },
      // dsf 1 EXPLICITLY: the outro page is laid out for a 2560 x 1440 CSS viewport, so
      // one device pixel per CSS pixel already is the 1440p master. Leaving dsf at the
      // recorder's default of 2 rendered 5120 x 2880 cards, and the concat in compose()
      // then refused them against the 2560 x 1440 scenes (ffmpeg exit 234). That default
      // changed on 2026-09-04; this call still assumed the old one.
    })), { outDir, viewport: { width: 2560, height: 1440 }, upscale: 1, dsf: 1 });
  } finally {
    server.close();
  }

  // trim away the page-load lead-in (fonts can take seconds) — keep from just after 'loaded'
  const { execFileSync } = await import('child_process');
  return wanted.map(({ name }) => {
    const log = JSON.parse(fs.readFileSync(`${outDir}/${name}.json`));
    const t0 = (log.find((m) => m.label === 'loaded') || { t: 0 }).t + 0.25;
    execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-ss', String(t0), '-i', `${outDir}/${name}.mp4`,
      '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', `${outDir}/${name}_t.mp4`]);
    return `${outDir}/${name}_t.mp4`;
  });
}
