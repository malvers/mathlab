/**
 * druckcheck.mjs — checks the print edition of a book (HTML/buch/<buch>/druck.html) against tools/kdp/druckregeln.md
 *
 *     node tools/kdp/druckcheck.mjs mathe11 [basis-url]        (default https://docalvers.de, e.g. http://localhost:8765)
 *
 * Doc, 24.10.2026, after the first KDP proof: "Das wir das in Zukunft nicht wieder haben." Run it before every upload.
 * Reports, by printed page number (the cover does not count):
 *   rule 1  a heading as the last content of a page (the KEEP list of js/buch-druck.js)
 *   rule 3  an element wider than the page area
 * plus Paged.js errors ("Layout repeated") and script errors. Exit code 1 when something was found.
 * Rules 2 (dark on dark) and 4 (empty boxes) still need eyes: look at the pages.
 */
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';

const [BOOK, BASE = 'https://docalvers.de'] = process.argv.slice(2);
if (!BOOK || !/^[a-z0-9-]+$/.test(BOOK)) { console.error('usage: node tools/kdp/druckcheck.mjs <buch> [basis-url]'); process.exit(1); }

const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] });
let found = 0;
try {
    const page = await (await browser.newContext({ viewport: { width: 1200, height: 900 } })).newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && /Layout repeated|Overflow/i.test(m.text())) errors.push(m.text()); });
    await page.goto(BASE.replace(/\/$/, '') + '/buch/' + BOOK + '/druck.html', { waitUntil: 'load', timeout: 120000 });
    await page.waitForSelector('body.d-ready', { timeout: 400000 });
    const r = await page.evaluate(() => {
        const KEEP = 'h1, h2, h3, h4, .b-band, .d-loes-h, .d-loes-t';             // the same list as in js/buch-druck.js
        const pages = [...document.querySelectorAll('.pagedjs_page')];
        const orphans = [], wide = new Set();
        pages.forEach((p, k) => {
            const no = k;                                                       // printed number: the cover is not counted
            const area = p.querySelector('.pagedjs_area');
            const w = document.createTreeWalker(area, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
                acceptNode: n => (n.nodeType === 3 ? n.data.trim() : n.matches('img, svg, canvas, hr')) ? 1 : 3
            });
            let last = null;
            while (w.nextNode()) last = w.currentNode;
            if (last && k < pages.length - 1) {
                const h = (last.nodeType === 3 ? last.parentElement : last).closest(KEEP);
                if (h) orphans.push('S. ' + no + ': „' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 50) + '“');
            }
            // the content wrapper of Paged.js runs into hidden columns by design; MathML and SVG insides are not drawn
            const ar = area.getBoundingClientRect();
            area.querySelectorAll('.pagedjs_page_content > div *').forEach(e => {
                if (e.closest('.katex-mathml') || (e.closest('svg') && e.tagName.toLowerCase() !== 'svg')) return;
                const b = e.getBoundingClientRect();
                if (b.width && b.right > ar.right + 2) wide.add('S. ' + no + ': ' + e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : '') + ' +' + Math.round(b.right - ar.right) + ' px');
            });
        });
        return { n: pages.length, orphans, wide: [...wide] };
    });
    console.log(BOOK + ': ' + r.n + ' Seiten (mit Einband)');
    const list = (title, xs) => { if (!xs.length) return; found += xs.length; console.log('\n' + title); xs.forEach(x => console.log('  ' + x)); };
    list('Regel 1 · Überschrift allein am Seitenende:', r.orphans);
    list('Regel 3 · breiter als der Satzspiegel:', r.wide);
    list('Fehler beim Setzen:', errors);
    if (!found) console.log('Regeln 1 und 3: alles in Ordnung. Regeln 2 und 4 bitte ansehen (tools/kdp/druckregeln.md).');
} finally {
    await browser.close();
}
process.exit(found ? 1 : 0);
