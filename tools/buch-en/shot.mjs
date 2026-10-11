// shot.mjs - screenshot of one element of a page, to look at a widget.
// usage: node tools/buch-en/shot.mjs <url> <selector> <out.png> [width]
import pw from '../../videopipeline/node_modules/playwright/index.js';
const [url, sel, out, w] = process.argv.slice(2);
const b = await pw.chromium.launch({ args: ['--mute-audio'] });
const p = await (await b.newContext({ viewport: { width: +(w || 1280), height: 900 }, deviceScaleFactor: 1 })).newPage();
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.locator(sel).first().screenshot({ path: out });
await b.close();
