// Generic scene recorder: runs each scene in a fresh Playwright context and saves <name>.webm + <name>.json (event marks).
import { chromium } from 'playwright';
import fs from 'fs';

export async function runScenes(scenes, { outDir, viewport = { width: 1280, height: 720 }, dsf = 2 }) {
  const browser = await chromium.launch();
  const rec = { width: viewport.width * dsf, height: viewport.height * dsf };   // capture true Retina pixels
  const results = {};
  for (const sc of scenes) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf, recordVideo: { dir: outDir, size: rec } });
    const page = await ctx.newPage();
    const t0 = Date.now();
    const log = [];
    const mark = (label) => log.push({ label, t: (Date.now() - t0) / 1000 });
    // wiggle the pointer near the bottom edge — many labs auto-hide their UI after a few idle seconds
    const jiggle = () => page.mouse.move(300 + Math.round(Math.sin(Date.now()) * 40), viewport.height - 40);
    await page.goto(sc.url, { waitUntil: 'load' });
    mark('loaded');
    try { await sc.run(page, { mark, jiggle }); }
    catch (e) { log.push({ label: 'ERROR ' + e.message.slice(0, 120), t: (Date.now() - t0) / 1000 }); }
    const video = page.video();
    await ctx.close();
    fs.renameSync(await video.path(), `${outDir}/${sc.name}.webm`);
    fs.writeFileSync(`${outDir}/${sc.name}.json`, JSON.stringify(log, null, 1));
    console.log(sc.name, JSON.stringify(log));
    results[sc.name] = log;
  }
  await browser.close();
  return results;
}
