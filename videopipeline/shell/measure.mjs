// Shell film — the measurements every number in the narration rests on.
//
//     cd videopipeline && node shell/measure.mjs
//
// Runs the real lab headless at the film's viewport (1280x720) and prints: the layout
// (where the stage, the sidebar and the coach box sit), the row count and fill time of
// every chapter, the collision line of chapter 3, what a line looks like at the ends of
// the VORRAT slider, and how fast the ring buffer follows a slider move. Screenshots
// land in ~/Movies/videopipeline/shell/measure/.
//
// Results on 2026-09-04 (Chromium, 1280x720):
//   stage x 287 w 993 h 720 · sidebar 44..286 · coach box 311,471 400x225 (hidden in the film)
//   raumzeit ROWS 78 @3/s   full after 26.0 s
//   welle    ROWS 183 @14/s full after 13.1 s
//   stoss    ROWS 183 @14/s collision at line 81 = 5.78 s, full after 13.3 s
//   schatten ROWS 183 @9/s  collision at 9.0 s, full after 20.4 s
//   zickzack/zelte ROWS 275 @34/s, the ring buffer holds 8.1 s (11.5 s at the film's 24/s)
//   VORRAT 0.3  a line carries 2-8 % pigment, 2-10 sparks that die at once
//   VORRAT 0.6  3-15 %, 3-8 short wedges
//   VORRAT 0.8  up to 43 %, up to 12 waves running until they meet: tents
//   VORRAT 1.1  few broad waves, lines up to 59 %
//   VORRAT 1.3  lines alternate 100 % / 0 %: the whole edge fires at once, horizontal bands
//   sigma 0.020 (s_max 1.33) after 14 s: 88 % of the shell brown - the homogeneous regime
import fs from 'fs';
import { chromium } from 'playwright';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('shell') + '/measure';
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8765/shell.html';

const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof applyChapter === 'function' && !!document.getElementById('sel-chapter'), null, { timeout: 20000 });
await page.waitForTimeout(1200);

const rect = (id) => page.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); }, id);
console.log('stage', await rect('canvas-container'), 'sidebar', await rect('side-panel'), 'coach', await rect('math-coach-box'),
  'badge', await page.evaluate(() => !!document.getElementById('local-badge')));
await page.evaluate(() => { document.getElementById('local-badge')?.remove(); document.getElementById('math-coach-box').style.display = 'none'; });

const state = () => page.evaluate(() => ({ chapter: chapter.id, ROWS, rowPx, lps: linesPerSecond, smax: +(P.sigma / P.mus).toFixed(2), nuc: P.nuc, lineCount, finished }));
/** the line the edge wrote last: pigment fraction and number of active fronts */
const rowStats = () => page.evaluate(() => {
  const y = (head - 1 + ROWS) % ROWS;
  const d = offCtx.getImageData(0, y, N, 1).data;
  let brown = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200) brown++;
  let fronts = 0, inside = false;
  for (let i = 0; i < N; i++) { const on = a[i] > 0.15; if (on && !inside) fronts++; inside = on; }
  return { row: +(brown / N).toFixed(2), fronts, lineCount };
});
const setV = (v) => page.evaluate((v) => { const s = document.getElementById('sl-smax'); if (+v > +s.max) s.max = String(v); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); return +(P.sigma).toFixed(4); }, v);

for (const id of ['raumzeit', 'welle', 'stoss', 'schatten']) {
  await page.evaluate((id) => applyChapter(id), id);
  const st = await state();
  const t0 = Date.now();
  let lastF = -1, coll = null;
  while (Date.now() - t0 < 45000) {
    await page.waitForTimeout(100);
    const r = await rowStats();
    if (lastF === 4 && r.fronts < 4 && coll === null) coll = { line: r.lineCount, t: +((Date.now() - t0) / 1000).toFixed(2) };
    lastF = r.fronts;
    if (await page.evaluate(() => finished)) break;
  }
  console.log(id.padEnd(9), `ROWS ${st.ROWS} (${st.rowPx} px) @${st.lps}/s  voll nach ${((Date.now() - t0) / 1000).toFixed(1)} s`,
    coll ? `Kollision Linie ${coll.line} = ${coll.t} s` : '');
  await page.screenshot({ path: `${OUT}/${id}.png` });
}

// the slider, in the running ring buffer of chapter 6
await page.evaluate(() => applyChapter('zelte'));
console.log('zelte', JSON.stringify(await state()));
for (const v of [0.8, 0.3, 0.6, 0.8, 1.1, 1.3]) {
  console.log(`VORRAT ${v} (sigma ${await setV(v)})`);
  const rows = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 12000) { await page.waitForTimeout(1500); rows.push(await rowStats()); }
  console.log('   Zeile: Pigment/Fronten alle 1,5 s:', rows.map((r) => `${r.row}/${r.fronts}`).join('  '));
  await page.screenshot({ path: `${OUT}/vorrat_${v}.png` });
}
await browser.close();
console.log('Bilder in', OUT);
