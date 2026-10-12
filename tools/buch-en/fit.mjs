// fit.mjs - SVG text that sticks out of the box it sits on (a <text> and a <rect> in the same <g>) on translated pages.
// Widgets that size a box from the German label ("Trapez") leave the longer translation ("Trapezium") hanging out;
// the geometry check does not see that, because the box is the same in both languages (vierecke6, 12.10.2026).
// usage: node tools/buch-en/fit.mjs [lang=en] [book-lang …]   (no books: every HTML/buch/*-<lang>)
// needs the local server (python3 serve.py, http://localhost:8765; PORT=… to change)
import pw from '../../videopipeline/node_modules/playwright/index.js';
import fs from 'fs';
const [lang = 'en', ...only] = process.argv.slice(2);
const PORT = process.env.PORT || 8765;
const H = new URL('../../HTML/buch/', import.meta.url);
const books = only.length ? only : fs.readdirSync(H).filter(d => d.endsWith('-' + lang));
const jobs = [];
for (const tr of books) for (const f of fs.readdirSync(new URL(tr + '/', H)).filter(f => f.endsWith('.html') && f !== 'druck.html')) jobs.push(tr + '/' + f);
const b = await pw.chromium.launch({ args: ['--mute-audio'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
let i = 0, flagged = 0;
async function worker() {
    while (i < jobs.length) {
        const j = jobs[i++]; const p = await ctx.newPage();
        try {
            await p.goto(`http://localhost:${PORT}/buch/${j}`, { waitUntil: 'networkidle', timeout: 45000 }); await p.waitForTimeout(1200);
            const bad = await p.evaluate(() => {
                const out = [];
                document.querySelectorAll('.b-main svg g').forEach(g => {
                    const rect = [...g.children].find(c => c.tagName === 'rect'); if (!rect) return;
                    const R = rect.getBBox(); if (R.width < 8 || R.height < 8) return;
                    [...g.children].filter(c => c.tagName === 'text' && c.textContent.trim()).forEach(t => {
                        const T = t.getBBox();
                        if (T.x < R.x - 1 || T.x + T.width > R.x + R.width + 1) out.push(t.textContent.trim().slice(0, 40) + ' (' + Math.round(T.width) + ' > ' + Math.round(R.width) + ')');
                    });
                });
                return [...new Set(out)];
            });
            if (bad.length) { flagged++; console.log('✗ ' + j + ': ' + bad.slice(0, 6).join(' · ')); }
        } catch (e) { console.log('✗ ' + j + ' ERR ' + e.message.slice(0, 60)); } finally { await p.close(); }
    }
}
await Promise.all([worker(), worker(), worker(), worker()]);
await b.close();
console.log(`${flagged ? '✗' : '✓'} ${jobs.length} pages, ${flagged} with text outside its box (labels placed outside a frame on purpose show up here too)`);
