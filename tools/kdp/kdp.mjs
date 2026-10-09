/**
 * kdp.mjs — the two print files Amazon KDP needs for a book of the online textbook (HTML/buch/<buch>/)
 *
 *     node tools/kdp/kdp.mjs mathe11 [zielordner] [--standard]
 *
 * Doc, 09.10.2026: first proof print of "Mathematik · Berufliches Gymnasium 11" through KDP —
 * "Die Scripts, die brauchen wir." The PDFs themselves are made for KDP only and change with every edit of
 * the book, so they never go into the repo (default target: the system temp folder). Readers get their PDF
 * from buch/<buch>/druck.html.
 *
 *   <buch>-innenteil.pdf  the print edition (druck.html on the live site) without its cover page: A4, no bleed,
 *                         canvases frozen at ~300 dpi (deviceScaleFactor 3.2 → 3.2 × 96 dpi)
 *   <buch>-umschlag.pdf   back + spine + front in one sheet with 0.125 in bleed all round; the front is the cover
 *                         of druck.html, the back lists the chapters of kapitel.js with a QR code to the online book;
 *                         the barcode field (bottom right of the back, 2 × 1.2 in) stays empty, KDP prints it
 *
 * Matching KDP settings: trim 8.27 x 11.69 in (A4), No Bleed, Premium Color (spine 0.002347 in per page);
 * --standard for Standard Color or white paper (0.002252 in per page). Needs qpdf (Homebrew) for the page count
 * and to drop the cover page. The interior is ~20 MB: above the 10 MB upload limit of Claude in Chrome, so that
 * one goes up by hand (Cmd+Shift+G in the file dialog).
 */
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2), plain = args.filter(a => !a.startsWith('--'));
const BOOK = plain[0];
if (!BOOK || !/^[a-z0-9-]+$/.test(BOOK)) { console.error('usage: node tools/kdp/kdp.mjs <buch> [zielordner] [--standard]'); process.exit(1); }
const OUT = path.resolve(plain[1] || path.join(os.tmpdir(), 'kdp-' + BOOK));
const PER_PAGE = args.includes('--standard') ? 0.002252 : 0.002347;     // spine thickness per page in inch (KDP)
const BLEED = 0.125, TW = 8.27, TH = 11.69;                             // KDP trim "A4", inch
const BASE = 'https://docalvers.de/buch/' + BOOK + '/';
mkdirSync(OUT, { recursive: true });
const raw = path.join(OUT, BOOK + '-roh.pdf'), interior = path.join(OUT, BOOK + '-innenteil.pdf'), coverPdf = path.join(OUT, BOOK + '-umschlag.pdf');

const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] });
try {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 3.2 });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log('pageerror:', e.message));

    // ---------- interior ----------
    await page.goto(BASE + 'druck.html', { waitUntil: 'load', timeout: 120000 });
    await page.waitForSelector('body.d-ready', { timeout: 300000 });
    console.log('druck.html:', await page.textContent('#d-status'));
    await page.evaluate(() => document.documentElement.classList.remove('d-screen'));   // what "beforeprint" does (js/buch-druck.js)
    await page.pdf({ path: raw, preferCSSPageSize: true, printBackground: true });
    execFileSync('qpdf', [raw, '--pages', raw, '2-z', '--', interior]);               // page 1 is the cover: on KDP it is its own file
    rmSync(raw);
    const pages = +execFileSync('qpdf', ['--show-npages', interior]).toString().trim();

    // the front of the cover is the cover of druck.html, straight from its source (Paged.js has rebuilt the page by now)
    const front = await page.evaluate(async () => {
        const doc = new DOMParser().parseFromString(await (await fetch('druck.html')).text(), 'text/html');
        return doc.querySelector('.d-cover .b-titel').innerHTML;
    });

    // ---------- cover: back | spine | front ----------
    const SPINE = +(pages * PER_PAGE).toFixed(6), BACK = BLEED + TW;
    const W = 2 * BACK + SPINE, H = TH + 2 * BLEED;
    const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Raleway:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../js/buch.css">
<link rel="stylesheet" href="../../js/buch-titel.css">
<style>
@page { size: ${W}in ${H}in; margin: 0; }
html, body { margin: 0; padding: 0; background: #040a18; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.k-sheet { position: relative; width: ${W}in; height: ${H}in; overflow: hidden; background: #081428; }
.k-back, .k-spine, .k-front { position: absolute; top: 0; height: ${H}in; }
.k-back { left: 0; width: ${BACK}in; }
.k-spine { left: ${BACK}in; width: ${SPINE}in; background: linear-gradient(180deg, #0d2042 0%, #081428 55%, #040a18 100%); }
.k-front { left: ${BACK + SPINE}in; width: ${BACK}in; }
.k-sheet .b-titel { max-width: none; width: 100%; height: 100%; aspect-ratio: auto; border-radius: 0; box-shadow: none; }
/* front: the sizes of page 1 of the print edition (js/buch-druck.css .d-cover) */
.k-front .b-titel h1 { font-size: 46pt; }
.k-front .b-titel-sub { font-size: 15pt; }
.k-front .b-titel-kicker, .k-front .b-titel-top { font-size: 9pt; }
.k-front .b-titel-foot { font-size: 8pt; }
.k-front .b-titel-top .b-logo { width: 34px; height: 34px; }
/* back: the glow comes from the spine side */
.k-back .b-titel { background: radial-gradient(110% 70% at 0% 0%, rgba(245, 194, 66, 0.16), transparent 60%),
    linear-gradient(195deg, #10264a 0%, #081428 55%, #040a18 100%); }
.k-in { position: absolute; left: ${BLEED + 0.8}in; right: 0.8in; top: ${BLEED + 0.75}in; bottom: ${BLEED + 0.75}in; color: #dfe8f4; }
.k-top { display: flex; align-items: center; gap: 10px; font-family: 'Orbitron', sans-serif; font-size: 9pt; letter-spacing: 2px; color: rgba(255, 255, 255, 0.82); }
.k-top .b-logo { width: 34px; height: 34px; }
.k-h { margin: 0.55in 0 0.18in; font-family: 'Orbitron', sans-serif; font-weight: 700; font-size: 21pt; line-height: 1.2; color: rgb(245, 194, 66); }
.k-p { margin: 0 0 0.14in; font-family: 'Raleway', sans-serif; font-size: 12pt; line-height: 1.5; }
.k-inh { margin: 0.32in 0 0.12in; font-family: 'Orbitron', sans-serif; font-size: 9pt; letter-spacing: 3px; color: rgb(245, 194, 66); }
.k-list { list-style: none; margin: 0; padding: 0.12in 0 0; border-top: 1px solid rgba(245, 194, 66, 0.45); font-family: 'Raleway', sans-serif; font-size: 10.5pt; line-height: 1.75; }
.k-list b { display: inline-block; width: 0.45in; font-family: 'Orbitron', sans-serif; font-size: 8.5pt; color: rgb(245, 194, 66); }
.k-qr { position: absolute; left: 0; bottom: 0; display: flex; align-items: center; gap: 0.18in; font-family: 'Raleway', sans-serif; font-size: 10pt; line-height: 1.45; }
.k-qr i { display: block; width: 1.05in; height: 1.05in; padding: 0.08in; background: #fff; border-radius: 6px; }
.k-qr i svg { width: 100%; height: 100%; display: block; }
.k-qr span b { font-family: 'Orbitron', sans-serif; font-size: 8.5pt; letter-spacing: 1.5px; color: rgb(245, 194, 66); font-weight: 400; }
.k-sp { position: absolute; left: 50%; top: 50%; width: ${TH - 1}in; transform: translate(-50%, -50%) rotate(90deg);
    display: flex; justify-content: space-between; align-items: center; white-space: nowrap; font-family: 'Orbitron', sans-serif; letter-spacing: 2px; }
.k-sp .t { font-size: 10pt; font-weight: 700; color: #fff; }
.k-sp .t b { color: rgb(245, 194, 66); }
.k-sp .v { font-size: 7pt; color: rgb(245, 194, 66); }
</style></head><body>
<div class="k-sheet">
  <div class="k-back"><div class="b-titel">
    <div class="k-in">
      <div class="k-top"><span class="b-logo" aria-hidden="true"></span><span>DOC ALVERS MATHE-LABOR</span></div>
      <h2 class="k-h">Ein Buch zum Ausprobieren</h2>
      <p class="k-p">Dieses Buch gibt es zweimal: als Online-Buch, in dem du jede Formel ausprobieren, jeden Graphen verschieben und jeden
        Zufallsversuch tausendmal laufen lassen kannst, und als Druckausgabe in deiner Hand. Jedes Kapitel beginnt mit einem QR-Code,
        der direkt zu seiner interaktiven Fassung führt.</p>
      <p class="k-p">Erkundungen, Merkkästen, Beispiele, Aufgaben in drei Stufen, Selbsttests und ein Test in jedem Kapitel,
        alle Lösungen im Anhang.</p>
      <p class="k-inh">INHALT</p>
      <ul class="k-list" id="k-list"></ul>
      <div class="k-qr"><i id="k-qr"></i><span><b>DAS ONLINE-BUCH</b><br>docalvers.de/buch/${BOOK}</span></div>
    </div>
  </div></div>
  <div class="k-spine"><div class="k-sp"><span class="t" id="k-sp"></span><span class="v">DOC ALVERS MATHE-LABOR</span></div></div>
  <div class="k-front"><div class="b-titel">${front}</div></div>
</div>
<script src="../../svp/qrcode.min.js"></script>
<script src="../../js/labs-icons.js"></script>
<script src="kapitel.js"></script>
<script src="../../js/buch.js"></script>
<script src="../../js/buch-plot.js"></script>
<script src="../../js/buch-funktionen.js"></script>
<script>
  document.getElementById('k-list').innerHTML = BUCH.chapters.map(c => '<li><b>' + c.k + '</b>' + c.title + '</li>').join('');
  document.getElementById('k-sp').innerHTML = BUCH.title.toUpperCase().replace(/(\\d+)$/, '<b>$1</b>');
  const q = qrcode(0, 'M'); q.addData('${BASE}index.html'); q.make();
  document.getElementById('k-qr').innerHTML = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
  Buch.render(document.querySelector('.k-front'), { print: true });
</script>
</body></html>`;
    // served under the book's address so the relative links resolve; nothing is written to the server
    const URL = BASE + '__umschlag.html';
    await page.route(URL, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    if (!await page.evaluate(() => !!document.querySelector('.k-front .b-titel-art svg'))) console.log('WARNING: no cover art on the front');
    await page.pdf({ path: coverPdf, preferCSSPageSize: true, printBackground: true });

    console.log('Innenteil:', interior, '·', pages, 'Seiten');
    console.log('Umschlag: ', coverPdf, '·', W.toFixed(3), '×', H.toFixed(3), 'in · Rücken', (SPINE * 25.4).toFixed(1), 'mm');
} finally {
    await browser.close();
}
