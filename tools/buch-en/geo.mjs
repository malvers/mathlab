// geo.mjs - the SVG geometry of every translated page against its German page. A dictionary rule that runs over the
// whole innerHTML can change coordinates ("88.4,664.6" → "88.4664.6", GY 5 cover, 12.10.2026); the text checks do not see that.
// The German page is loaded twice, so elements that differ between two German loads (random widgets) are skipped.
// usage: node tools/buch-en/geo.mjs [lang=en] [book-lang …]   (no books: every HTML/buch/*-<lang>)
// needs the local server (python3 serve.py, http://localhost:8765; PORT=… to change)
import pw from '../../videopipeline/node_modules/playwright/index.js';
import fs from 'fs';
const [lang = 'en', ...only] = process.argv.slice(2);
const PORT = process.env.PORT || 8765;
const H = new URL('../../HTML/buch/', import.meta.url);
const books = only.length ? only : fs.readdirSync(H).filter(d => d.endsWith('-' + lang));
const jobs = [];
for (const tr of books) for (const f of fs.readdirSync(new URL(tr + '/', H)).filter(f => f.endsWith('.html') && f !== 'druck.html')) jobs.push([tr.slice(0, -lang.length - 1), tr, f]);
const b = await pw.chromium.launch({ args: ['--mute-audio'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
async function geo(url) {
    const p = await ctx.newPage();
    try {
        await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); await p.waitForTimeout(1500);
        // KaTeX draws its own SVGs (brackets, arrows) whose order follows the text - not geometry of the widgets
        return await p.evaluate(() => [...document.querySelectorAll('.b-main svg *')].filter(e => !e.closest('.katex')).map(e => {
            const a = ['d', 'points', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'transform', 'viewBox'].map(n => e.getAttribute(n)).filter(v => v != null);
            return a.length ? e.tagName + ':' + a.join('|') : null;
        }).filter(Boolean));
    } catch (e) { return ['ERR ' + e.message.slice(0, 80)]; } finally { await p.close(); }
}
let i = 0, flagged = 0;
async function worker() {
    while (i < jobs.length) {
        const [de, tr, f] = jobs[i++];
        const base = `http://localhost:${PORT}/buch/`;
        const [a, a2, t] = await Promise.all([geo(base + de + '/' + f), geo(base + de + '/' + f), geo(base + tr + '/' + f)]);
        let bad = 0, ex = '';
        for (let k = 0; k < Math.max(a.length, t.length); k++) if (a[k] === a2[k] && a[k] !== t[k]) { bad++; if (!ex) ex = (a[k] || '∅').slice(0, 90) + '  →  ' + (t[k] || '∅').slice(0, 90); }
        if (bad) { flagged++; console.log(`✗ ${tr}/${f}  differ=${bad}\n     ${ex}`); }
    }
}
await Promise.all([worker(), worker(), worker()]);
await b.close();
console.log(`${flagged ? '✗' : '✓'} ${jobs.length} pages, ${flagged} with different SVG geometry`);
