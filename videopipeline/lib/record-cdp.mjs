// High-quality scene recorder: CDP screencast delivers per-frame JPEGs (q95, ~40-60 fps) with
// timestamps — no low-bitrate VP8 pass like Playwright's recordVideo. Each scene is assembled
// into a CFR 25fps H.264 mp4, optionally upscaled (Lanczos) for a 1440p master.
import { chromium } from 'playwright';
import fs from 'fs';
import { execFileSync } from 'child_process';

// Visible mouse cursor + click ripple (YouTuber style), injected into the page so the
// CDP screencast records it. Follows real input events dispatched by Playwright.
const CURSOR_JS = () => {
  if (window.__vpCursor) return;
  window.__vpCursor = true;
  const cur = document.createElement('div');
  cur.id = '__vp_cursor';
  cur.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;width:26px;height:38px;transform:translate(-4px,-2px);transition:none;';
  cur.innerHTML = '<svg viewBox="0 0 26 38" width="26" height="38"><path d="M2 2 L2 30 L9.5 23.5 L14 34 L18.5 32 L14 21.5 L24 21 Z" fill="#fff" stroke="#000" stroke-width="2.2" stroke-linejoin="round"/></svg>';
  const style = document.createElement('style');
  style.textContent = '@keyframes __vp_rip { from { transform: translate(-50%,-50%) scale(0.25); opacity: 0.85; } to { transform: translate(-50%,-50%) scale(1.9); opacity: 0; } }';
  const attach = () => { document.body.appendChild(cur); document.head.appendChild(style); };
  if (document.body) attach(); else document.addEventListener('DOMContentLoaded', attach);
  document.addEventListener('mousemove', (e) => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }, { capture: true, passive: true });
  document.addEventListener('mousedown', (e) => {
    cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
    const r = document.createElement('div');
    r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:64px;height:64px;border-radius:50%;' +
      'border:4px solid #ffd93d;box-shadow:0 0 18px rgba(255,217,61,0.8);left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
      'transform:translate(-50%,-50%);animation:__vp_rip 0.55s ease-out forwards;';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }, { capture: true, passive: true });
};

// record:false walks the same choreography without capturing anything - a preflight
// that catches broken selectors, wrong timings and off-stage framing in seconds
// instead of after a full take. Everything else behaves identically.
export async function runScenes(scenes, { outDir, viewport = { width: 1280, height: 720 }, upscale = 2, showCursor = false, record = true }) {
  const browser = await chromium.launch({ channel: 'chromium' });
  const results = {};
  for (const sc of scenes) {
    const frameDir = `${outDir}/${sc.name}_frames`;
    if (record) {
      fs.rmSync(frameDir, { recursive: true, force: true });
      fs.mkdirSync(frameDir, { recursive: true });
    }
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    const t0 = Date.now();
    const log = [];
    const mark = (label) => log.push({ label, t: (Date.now() - t0) / 1000 });
    const jiggle = () => page.mouse.move(300 + Math.round(Math.sin(Date.now()) * 40), viewport.height - 40);

    const cdp = await ctx.newCDPSession(page);
    const stamps = [];
    let pending = 0;
    cdp.on('Page.screencastFrame', (f) => {
      const i = stamps.length;
      stamps.push(f.metadata && f.metadata.timestamp ? f.metadata.timestamp * 1000 - t0 : Date.now() - t0);
      pending++;
      fs.promises.writeFile(`${frameDir}/f_${String(i).padStart(6, '0')}.jpg`, Buffer.from(f.data, 'base64'))
        .finally(() => pending--);
      cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
    });
    if (record) await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: viewport.width, maxHeight: viewport.height });

    if (showCursor) await page.addInitScript(CURSOR_JS);
    await page.goto(sc.url, { waitUntil: 'load' });
    mark('loaded');
    if (showCursor) await page.evaluate(CURSOR_JS).catch(() => {});
    try { await sc.run(page, { mark, jiggle }); }
    catch (e) { log.push({ label: 'ERROR ' + e.message.slice(0, 120), t: (Date.now() - t0) / 1000 }); }
    const endT = (Date.now() - t0) / 1000;   // wall-clock scene end — the last (static) frame lasts until here
    if (record) {
      await cdp.send('Page.stopScreencast').catch(() => {});
      while (pending > 0) await new Promise((r) => setTimeout(r, 50));
    }
    await ctx.close();

    if (!record) {
      fs.writeFileSync(`${outDir}/${sc.name}.check.json`, JSON.stringify(log, null, 1));
      console.log(sc.name, '(Probelauf, keine Aufnahme)', JSON.stringify(log));
      results[sc.name] = log;
      continue;
    }

    // frames (VFR, wall-clock stamps) → CFR 25fps mp4, upscaled in the same single encode
    const rel = stamps.map((t) => t / 1000);
    const lines = [];
    for (let i = 0; i < rel.length; i++) {
      lines.push(`file 'f_${String(i).padStart(6, '0')}.jpg'`);
      lines.push(`duration ${(i + 1 < rel.length ? Math.max(0.001, rel[i + 1] - rel[i]) : Math.max(0.04, endT - rel[i])).toFixed(4)}`);
    }
    // ffmpeg concat demuxer quirk: the final 'duration' only applies if the last file is listed again
    if (rel.length) lines.push(`file 'f_${String(rel.length - 1).padStart(6, '0')}.jpg'`);
    fs.writeFileSync(`${frameDir}/list.txt`, lines.join('\n') + '\n');
    const W = viewport.width * upscale, H = viewport.height * upscale;
    execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${frameDir}/list.txt`,
      '-vf', `fps=25,scale=${W}:${H}:flags=lanczos`, '-c:v', 'libx264', '-crf', '16', '-preset', 'medium',
      '-pix_fmt', 'yuv420p', `${outDir}/${sc.name}.mp4`], { stdio: 'inherit' });
    fs.rmSync(frameDir, { recursive: true, force: true });
    fs.writeFileSync(`${outDir}/${sc.name}.json`, JSON.stringify(log, null, 1));
    console.log(sc.name, 'frames:', stamps.length, JSON.stringify(log));
    results[sc.name] = log;
  }
  await browser.close();
  return results;
}
