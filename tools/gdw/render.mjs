// Renders tools/gdw/arbeit/blaetter.html: one PDF for printing plus one PNG per sheet, 1200 px wide
// (the same size pdftoppm -r 160 gave for the "Weisheiten der Welt"). Called by gdw.py, not by hand.
//
//     node tools/gdw/render.mjs <blaetter.html> <out-dir>
//
// It refuses to pass a sheet whose sentence runs into the picture or whose picture runs into the source line.
import fs from 'fs';
import path from 'path';
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';

const [html, out] = process.argv.slice(2);
if (!html || !out) { console.error('Aufruf: node render.mjs <blaetter.html> <out-dir>'); process.exit(1); }
fs.mkdirSync(path.join(out, 'png'), { recursive: true });

const b = await chromium.launch({ args: ['--mute-audio'] });
// 190.5 mm = 720 CSS px; 1200 / 720 gives the 1200 px the plan pages expect
const p = await b.newPage({ deviceScaleFactor: 1200 / 720 });
await p.goto('file://' + path.resolve(html));
await p.evaluate(() => document.fonts.ready);
await p.waitForFunction(() => [...document.images].every((i) => i.complete));

const info = await p.evaluate(() => ({
    font: getComputedStyle(document.querySelector('.spruch')).fontFamily,
    outfit: document.fonts.check('20px Outfit'),
    fehlendeBilder: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')),
    eng: [...document.querySelectorAll('.blatt')].filter((s) => {
        const q = s.querySelector('.spruch').getBoundingClientRect();
        const m = s.querySelector('.bild').getBoundingClientRect();
        const c = (s.querySelector('.quelle') || s.querySelector('.bildquelle')).getBoundingClientRect();
        return q.bottom > m.top + 2 || m.bottom > c.top + 2;
    }).map((s) => s.dataset.nr),
}));
console.log(JSON.stringify(info));

await p.pdf({ path: path.join(out, 'blaetter.pdf'), width: '190.5mm', height: '275.2mm', printBackground: true });
for (const el of await p.$$('.blatt')) {
    const nr = await el.getAttribute('data-nr');
    await el.screenshot({ path: path.join(out, 'png', nr + '.png') });
}
await b.close();
if (!info.outfit || info.fehlendeBilder.length || info.eng.length) process.exit(2);
