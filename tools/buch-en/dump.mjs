// dump.mjs - what every widget of an English (or German) book page shows after clicking through: widget text,
// text attributes and canvas texts, page by page. Math.random is seeded, so two runs can be compared with diff.
// usage: node tools/buch-en/dump.mjs <book> [file1.html …]   (no files: every page of the book)
// needs the local server (python3 serve.py, http://localhost:8765; PORT=… to change)
import pw from '../../videopipeline/node_modules/playwright/index.js';
import fs from 'fs';
const PORT = process.env.PORT || 8765;
const [book, ...given] = process.argv.slice(2);
const dir = new URL('../../HTML/buch/' + book + '/', import.meta.url);
const files = given.length ? given : fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'druck.html').sort();
const b = await pw.chromium.launch({ args: ['--mute-audio', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const f of files) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => {
    let s = 12345; Math.random = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
    window.__cv = new Set(); const C = CanvasRenderingContext2D.prototype, o = C.fillText;
    C.fillText = function (t, ...r) { window.__cv.add(String(t)); return o.call(this, t, ...r); };
  });
  const p = await ctx.newPage();
  await p.goto('http://localhost:' + PORT + '/buch/' + book + '/' + f, { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
  const out = await p.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const seen = new Set(), lines = [];
    const grab = () => document.querySelectorAll('[data-widget]').forEach(w => {
      const c = w.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(e => e.remove());
      c.innerText.split(/\n+/).map(s => s.trim()).filter(Boolean).forEach(s => { if (!seen.has(s)) { seen.add(s); lines.push(s); } });
      w.querySelectorAll('[title],[aria-label],[placeholder]').forEach(e => ['title', 'aria-label', 'placeholder'].forEach(a => { const v = e.getAttribute(a); if (v && !seen.has('@' + v)) { seen.add('@' + v); lines.push('@' + v); } }));
    });
    grab();
    for (const box of document.querySelectorAll('[data-widget]')) {
      for (const bt of [...box.querySelectorAll('button')]) { try { bt.click(); } catch (_) { } await sleep(20); grab(); }
      for (const r of box.querySelectorAll('input[type=range]')) { for (const v of [r.max, r.min, (+r.max + +r.min) / 2]) { r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); await sleep(10); grab(); } }
    }
    // the header (Solita, "Fehler melden") is translated too
    document.querySelectorAll('.b-top [title], .b-top [aria-label], .b-top button').forEach(e => {
      const v = (e.getAttribute('title') || '') + ' | ' + (e.getAttribute('aria-label') || '') + ' | ' + e.innerText.trim();
      if (!seen.has('#' + v)) { seen.add('#' + v); lines.push('# ' + v); }
    });
    return lines.concat(['--- canvas:', [...window.__cv].filter(s => /[A-Za-z]/.test(s)).sort().join(' | ')]);
  });
  console.log('===== ' + f + '\n' + out.map(s => s.slice(0, 260)).join('\n'));
  await ctx.close();
}
await b.close();
