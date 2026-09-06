// Renders the lake canvas frame by frame at exact timestamps. Pulling the pixels straight
// out of the canvas (instead of screenshotting the page) keeps the loop mathematically exact.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// playwright lives in videopipeline/node_modules - resolved from this file's own location so
// the repo can be moved or cloned elsewhere
const require = createRequire(import.meta.url);
const pw = require(path.join(fileURLToPath(new URL('../../../videopipeline/', import.meta.url)),
                             'node_modules', 'playwright'));
const { chromium } = pw;

const OUT = process.argv[2];
const FPS = 25;
const dir = path.join(OUT, 'frames');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(OUT, process.argv[3] || 'photo.html'));
await page.evaluate(() => window.ready);
const LOOP = await page.evaluate(() => window.LOOP);
const N = Math.round(LOOP * FPS);
console.log(`loop ${LOOP}s -> ${N} frames @ ${FPS}fps`);

for (let i = 0; i < N; i++) {
  const t = (i * LOOP) / N;
  // a file:// photo taints the canvas, so toDataURL is out - screenshot the viewport instead
  await page.evaluate((tt) => window.renderFrame(tt), t);
  await page.screenshot({ path: path.join(dir, String(i).padStart(4, '0') + '.jpg'),
                          type: 'jpeg', quality: 96 });
  if (i % 30 === 0) console.log(`  frame ${i}/${N}`);
}
await browser.close();
console.log('done', N);
