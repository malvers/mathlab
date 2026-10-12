// encheck.mjs - check of an English edition in the browser: JS errors, KaTeX errors, raw $, empty widgets, overflow
// (1280 + 390), and German left over - in the visible text, in title/aria-label/placeholder, and on the canvases.
// With --poke every widget button is clicked once and every slider moved.
// usage: node tools/buch-en/encheck.mjs <book> [--poke] [file1.html …]   (no files: every page of the book)
// A Spanish edition (<book>-es, package ES0) is checked the same way; there a decimal comma on a canvas is right.
// needs the local server (python3 serve.py, http://localhost:8765)
import pw from '../../videopipeline/node_modules/playwright/index.js';
import fs from 'fs';
const args = process.argv.slice(2);
const book = args.shift();
const poke = args.includes('--poke');
const given = args.filter(a => !a.startsWith('--'));
const files = given.length ? given : fs.readdirSync(new URL('../../HTML/buch/' + book + '/', import.meta.url)).filter(f => f.endsWith('.html') && f !== 'druck.html').sort();
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const LANG = book.endsWith('-es') ? 'es' : 'en';
// Spanish: the names of the other editions, and Spanish words with ü (pingüino, bilingüe), are not German
const ALLOW_ES = /Doc Alvers Mathe-Labor|Edición alemana|English edition|Berufliches Gymnasium|Gauß|Mathe-Labor|Doc Alvers|Möbius|Schütz|Müller|[a-záéíóúñ]*gü[ei][a-záéíóúñ]*/g;
const ALLOW = LANG === 'es' ? ALLOW_ES : /Doc Alvers Mathe-Labor|Deutsche Ausgabe|Berufliches Gymnasium|Gauß|Mathe-Labor|Doc Alvers|Würfel(?=\b)|Möbius|Schütz|Müller/g;
const GERMAN = /[äöüÄÖÜß]|\b(der|die|das|und|nicht|ist|mit|von|für|auf|eine?|einer|wird|sind|oder|zum|zur|bei|wie|auch|noch|nach|aus|Lösung|Aufgabe|Ergebnis|Zeile|Schritt|Funktion|Gerade|Seite|Zurück|Neue|keine|Anzahl|Summe|Wahrscheinlichkeit)\b/;
for (const f of files) {
  for (const w of [1280, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
    await ctx.addInitScript(() => {
      window.__cv = new Set();
      const C = CanvasRenderingContext2D.prototype, o = C.fillText;
      C.fillText = function (s, ...r) { try { window.__cv.add(String(s)); } catch (_) { } return o.call(this, s, ...r); };
    });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/favicon|404|ERR_/.test(m.text())) errs.push(m.text()); });
    await page.goto('http://localhost:8765/buch/' + book + '/' + f, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    if (poke && w === 1280) {
      await page.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        for (const box of document.querySelectorAll('[data-widget]')) {
          const btns = [...box.querySelectorAll('button')].filter(b => !b.closest('.b-titel'));
          for (const b of btns) { try { b.click(); } catch (_) { } await sleep(15); }
          for (const r of box.querySelectorAll('input[type=range]')) { r.value = r.max; r.dispatchEvent(new Event('input', { bubbles: true })); await sleep(10); r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true })); }
        }
        // tasks and self-checks: open everything
        document.querySelectorAll('.b-reveal').forEach(x => x.classList.add('open'));
        await sleep(400);
      });
    }
    const r = await page.evaluate((src) => {
      const GERMAN = new RegExp(src.g), ALLOW = new RegExp(src.a, 'g');
      const empty = [...document.querySelectorAll('[data-widget]')].filter(el => !el.children.length && !el.closest('.b-titel')).map(el => el.dataset.widget);
      const wide = [...document.querySelectorAll('.b-main *')].filter(el => { const b = el.getBoundingClientRect(); return b.right > innerWidth + 1 && b.width > 0 && !el.closest('.katex-display, .b-table-wrap, .b-svgbox, .katex, .b-scroll'); }).slice(0, 3).map(el => el.tagName + '.' + el.className);
      // visible text without the MathML copies of KaTeX
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll('.katex-mathml, script, style, .b-meld, .b-solita-panel').forEach(e => e.remove());
      const lines = clone.innerText.split(/\n+/).map(s => s.trim()).filter(Boolean);
      const de = [...new Set(lines.filter(l => GERMAN.test(l.replace(ALLOW, ''))))];
      const attrs = [...document.querySelectorAll('[title],[aria-label],[placeholder],[alt]')].flatMap(e => ['title', 'aria-label', 'placeholder', 'alt'].map(a => e.getAttribute(a)).filter(Boolean))
        .filter(v => GERMAN.test(v.replace(ALLOW, '')));
      const cv = [...window.__cv].filter(v => GERMAN.test(v) || (src.en && /\d,\d/.test(v)));
      return { kerr: document.querySelectorAll('.katex-error').length, raw$: (document.querySelector('.b-main')?.innerText.match(/\$[^$\n]{1,40}\$/g) || []).slice(0, 2), empty, sw: document.documentElement.scrollWidth, wide, de, attrs: [...new Set(attrs)], cv };
    }, { g: GERMAN.source, a: ALLOW.source, en: LANG === 'en' });
    const bad = r.kerr || r.raw$.length || r.empty.length || r.sw > w + 1 || errs.length;
    console.log((bad ? 'XX ' : 'ok ') + f + ' @' + w, JSON.stringify({ kerr: r.kerr, raw$: r.raw$, empty: r.empty, sw: r.sw, wide: r.wide }), errs.slice(0, 3).join(' | ').slice(0, 300));
    if (w === 1280) {
      if (r.de.length) console.log('   DE text:\n     ' + r.de.slice(0, 60).map(s => s.slice(0, 170)).join('\n     '));
      if (r.attrs.length) console.log('   DE attr: ' + r.attrs.slice(0, 30).join(' | '));
      if (r.cv.length) console.log('   DE canvas: ' + r.cv.slice(0, 30).join(' | '));
    }
    await ctx.close();
  }
}
await browser.close();
