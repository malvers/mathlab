/**
 * seitenbilder.mjs — pictures of every page of a book's print edition, for the overview of the online book
 * (key O / "Seiten" in the header, druck.html?uebersicht, js/buch-druck.js).
 * Doc, 27.10.2026, on the phone: "Die lädt sehr langsam" - the overview set all 164 pages of Mathe 11 with Paged.js on
 * every opening (20 s on the Mac, ~40 s on a phone). Now the pages are set once, here, and the overview shows pictures.
 *
 *     node tools/buch-seiten/seitenbilder.mjs mathe11 [mathe12 …]     render, upload to R2, read back
 *     node tools/buch-seiten/seitenbilder.mjs --alle                   every book whose pictures are out of date
 *     --basis http://localhost:8765   render another site than https://docalvers.de (a test: the pictures then show that state)
 *     --nur-lokal                     no upload, the files stay in the temp folder
 *     --letter | --a4                 the other page format (druck.html?format=…) into buch/seiten/<buch>-letter|-a4/; a book's
 *                                     own format (kapitel.js format, default A4) goes into buch/seiten/<buch>/ as always
 *
 * In the R2 bucket "media" (as the book photos, tools/media_publish.mjs), folder buch/seiten/<buch>/:
 *   seiten.json   page size, fingerprint, sprite layout, and per page the jump targets (data-ziel) of its blocks
 *   s.webp        all pages small (200 px wide) in one sprite: the grid at its normal size, one request
 *   l-<k>.webp    nine pages at a time at full size (794 px), 3 × 3: loaded only when + makes the tiles bigger
 *   <buch>.pdf    the whole print edition as a PDF, behind "PDF herunterladen" on the book's start page (js/buch.js).
 *                 Doc, 27.10.2026: a pupil printed druck.html to PDF herself and got a blank page after every page -
 *                 Safari, and every browser on an iPad or iPhone, breaks an A4 sheet in two on Letter paper. Made here
 *                 by Chrome from the same set pages, it is right on every device.
 * The pages are rendered from the live site, so they show what readers see. Out of date = the fingerprint differs
 * from the one in seiten.json: a hash over the live files the pages are made of (kapitel.js, druck.html, the chapters,
 * the layout files of the print edition) and the book's entry in js/buch-fotos.js.
 * Run it after every push that changes a book (it waits for a running Pages deploy). Without pictures the overview
 * sets the pages itself, as before.
 */
import { chromium } from '../../videopipeline/node_modules/playwright/index.mjs';
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MEDIA = 'https://pub-5e3b331002a14e5a8532e12ebae95bf9.r2.dev/';        // the same bucket as MEDIA in js/buch.js
const FORCE = process.argv.includes('--letter') ? 'letter' : process.argv.includes('--a4') ? 'a4' : '';
const own = book => /format:\s*'letter'/.test(readFileSync(path.join(ROOT, 'HTML/buch', book, 'kapitel.js'), 'utf8')) ? 'letter' : 'a4';
const other = book => FORCE && FORCE !== own(book) ? FORCE : '';          // the format asked for, when it is not the book's own
const KEY = book => 'buch/seiten/' + book + (other(book) ? '-' + other(book) : '') + '/';
// what changes the pages besides the book itself
const LAYOUT = ['js/buch.css', 'js/buch-titel.css', 'js/buch-druck.css', 'js/buch-druck.js', 'js/buch-gruss.js'];
const SW = 200;                                 // width of a page in the small sprite, px
const PER = 9, LC = 3;                          // pages per large picture, and its columns
const FORMAT = 2;                               // raise it when the pictures change their make: every book is then out of date (2: + the PDF)

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const BASE = (opt('--basis') || 'https://docalvers.de').replace(/\/$/, '');
const LIVE = BASE === 'https://docalvers.de', LOCAL = args.includes('--nur-lokal');
const named = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--basis');

// every book with a print edition
function books() {
    return readdirSync(path.join(ROOT, 'HTML/buch')).filter(b => existsSync(path.join(ROOT, 'HTML/buch', b, 'druck.html'))).sort();
}

// a request on the Mac's network fails now and then (mathe6, 27.10.2026: "fetch failed" while reading back):
// three tries before a book counts as failed
async function fetchRetry(url, init) {
    for (let k = 1; ; k++) {
        try { return await fetch(url, init); } catch (e) { if (k === 3) throw e; await new Promise(r => setTimeout(r, 2000 * k)); }
    }
}
async function get(p) {
    const r = await fetchRetry(BASE + '/' + p + '?t=' + Date.now());
    if (!r.ok) throw new Error(p + ': HTTP ' + r.status);
    return r.text();
}
async function fingerprint(book) {
    const h = createHash('sha256');
    h.update(FORMAT + '|' + SW + '|' + PER + '|' + LC);
    const kap = await get('buch/' + book + '/kapitel.js'), ctx = { window: {} };
    vm.runInNewContext(kap, ctx);
    const files = ['kapitel.js', 'druck.html', ...ctx.window.BUCH.chapters.map(c => c.file)].map(f => 'buch/' + book + '/' + f);
    for (const f of [...files, ...LAYOUT]) h.update(f + '\n' + (f.endsWith('kapitel.js') ? kap : await get(f)));
    // the photos: only this book's places and the credits of its photos - a photo in another book changes nothing here
    const fx = { window: {} };
    vm.runInNewContext(await get('js/buch-fotos.js'), fx);
    const F = fx.window.BUCH_FOTOS, base = book.replace(/-(en|es|it|fr)$/, ''), mine = F && F.books[base] || {};
    // and the pictures in white space (js/buch-druck.js fillGaps): this book's gaps and the front pages of every book
    const gaps = (F && F.luecken && F.luecken[base]) || {}, vorn = (F && F.vorn) || {};
    const used = [...new Set([...Object.values(mine).flat().map(p => p.foto),
        ...Object.values(gaps).flatMap(m => Object.values(m)).flat(2), ...Object.values(vorn).flat(2)])].sort();
    h.update(JSON.stringify(mine) + JSON.stringify(gaps) + JSON.stringify(vorn) + JSON.stringify(used.map(n => F.fotos[n] || null)));
    return h.digest('hex').slice(0, 16);
}

// right after a push the live site is still the old one: wait for the Pages deploy (needs gh; without it, go on)
function deploying() {
    try {
        const runs = JSON.parse(execFileSync('gh', ['run', 'list', '--workflow', 'deploy-pages.yml', '--limit', '3', '--json', 'status'], { cwd: ROOT, encoding: 'utf8' }));
        return runs.some(r => r.status !== 'completed');
    } catch (_) { return false; }
}

async function online(book) {
    try {
        const r = await fetchRetry(MEDIA + KEY(book) + 'seiten.json?t=' + Date.now());
        return r.ok ? await r.json() : null;
    } catch (_) { return null; }
}

// ---------- render: druck.html, every sheet as a screenshot, put together into the sprites in a second tab ----------
async function render(browser, book, v, out) {
    // twice the pixels for the figures that druck.html freezes into pictures, so they stay sharp in the PDF;
    // the screenshots for the sprites stay at one pixel per CSS pixel (scale: 'css')
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 2 });
    try {
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(BASE + '/buch/' + book + '/druck.html' + (other(book) ? '?format=' + other(book) : ''), { waitUntil: 'load', timeout: 120000 });
        await page.waitForSelector('body.d-ready', { timeout: 600000 });
        // the status bar and the LOCAL badge must not land on a sheet
        await page.addStyleTag({ content: '.d-bar, #local-badge { display: none !important; }' });
        const meta = await page.evaluate(() => {
            const pages = [...document.querySelectorAll('.pagedjs_page')];
            const r = pages[0].getBoundingClientRect();
            // per page the jump targets of its blocks, in document order: the overview answers "where is the reader"
            // with the same queries as on the set pages (js/buch-druck.js, zeige)
            const seiten = pages.map(p => {
                const zs = [];
                p.querySelectorAll('[data-ziel]').forEach(e => { if (zs[zs.length - 1] !== e.dataset.ziel) zs.push(e.dataset.ziel); });
                return zs;
            });
            return { w: Math.round(r.width), h: Math.round(r.height), seiten, kurz: (window.BUCH && window.BUCH.short) || '' };
        });
        const n = meta.seiten.length, sh = Math.round(SW * meta.h / meta.w);
        const scols = Math.ceil(Math.sqrt(n * meta.h / meta.w * 0.75)), srows = Math.ceil(n / scols);   // a sprite a bit wider than tall

        const comp = await ctx.newPage();
        await comp.evaluate(([n, W, H, sw, sh, scols, srows, PER, LC]) => {
            const S = new OffscreenCanvas(scols * sw, srows * sh), sx = S.getContext('2d');
            sx.fillStyle = '#fff'; sx.fillRect(0, 0, S.width, S.height);
            sx.imageSmoothingQuality = 'high';
            const half = new OffscreenCanvas(Math.round(W / 2), Math.round(H / 2)), hx = half.getContext('2d');
            hx.imageSmoothingQuality = 'high';
            let L = null, lx = null;
            const b64 = async c => {
                const buf = new Uint8Array(await (await c.convertToBlob({ type: 'image/webp', quality: 0.8 })).arrayBuffer());
                let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
                return btoa(s);
            };
            window.put = async (png, i) => {
                const img = await createImageBitmap(await (await fetch('data:image/png;base64,' + png)).blob());
                const j = i % PER;
                if (j === 0) {
                    const rows = Math.ceil(Math.min(PER, n - i) / LC);
                    L = new OffscreenCanvas(LC * W, rows * H); lx = L.getContext('2d');
                    lx.fillStyle = '#fff'; lx.fillRect(0, 0, L.width, L.height);
                }
                lx.drawImage(img, (j % LC) * W, Math.floor(j / LC) * H, W, H);
                // small: in two halvings, a single step from 794 to 200 px loses the thin lines
                hx.fillStyle = '#fff'; hx.fillRect(0, 0, half.width, half.height);
                hx.drawImage(img, 0, 0, half.width, half.height);
                sx.drawImage(half, (i % scols) * sw, Math.floor(i / scols) * sh, sw, sh);
                return j === PER - 1 || i === n - 1 ? b64(L) : null;
            };
            window.small = () => b64(S);
        }, [n, meta.w, meta.h, SW, sh, scols, srows, PER, LC]);

        const sheets = page.locator('.pagedjs_page');
        for (let i = 0; i < n; i++) {
            const png = (await sheets.nth(i).screenshot({ type: 'png', animations: 'disabled', scale: 'css' })).toString('base64');
            const big = await comp.evaluate(([p, i]) => window.put(p, i), [png, i]);
            if (big) writeFileSync(path.join(out, 'l-' + Math.floor(i / PER) + '.webp'), Buffer.from(big, 'base64'));
            if (i % 20 === 19) process.stdout.write('  ' + (i + 1) + '/' + n + '\r');
        }
        writeFileSync(path.join(out, 's.webp'), Buffer.from(await comp.evaluate(() => window.small()), 'base64'));
        // the PDF from the same pages, as tools/kdp/kdp.mjs does it (with the cover: readers get the whole book)
        await page.evaluate(() => document.documentElement.classList.remove('d-screen'));   // what "beforeprint" does (js/buch-druck.js)
        const pdf = book + '.pdf';
        await page.pdf({ path: path.join(out, pdf), preferCSSPageSize: true, printBackground: true });
        const json = {
            v, buch: book, erstellt: new Date().toISOString(), w: meta.w, h: meta.h,
            s: { w: SW, h: sh, cols: scols, rows: srows }, l: { per: PER, cols: LC, n: Math.ceil(n / PER) },
            pdf: { datei: pdf, bytes: statSync(path.join(out, pdf)).size, name: dateiname(meta.kurz || book) + ' - Doc Alvers Mathe-Labor.pdf' },
            seiten: meta.seiten,
        };
        writeFileSync(path.join(out, 'seiten.json'), JSON.stringify(json));
        if (errors.length) console.log('  Fehler auf der Seite: ' + errors.slice(0, 3).join(' | '));
        return json;
    } finally { await ctx.close(); }
}

// the name a saved PDF gets (content-disposition): plain ASCII, accents to their letters - "Mathématiques 11" → "Mathematiques 11"
const dateiname = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^\w .-]/g, '').trim();

// ---------- upload: wrangler (pinned as in tools/media_publish.mjs), a few at a time, seiten.json last ----------
// three tries as in fetchRetry: one PDF of the 27.10.2026 run got "401: Unauthorized" while the uploads around it went
// through - wrangler renewing its login while six uploads run at once
async function put(file, key, type, cache, more = []) {
    for (let k = 1; ; k++) {
        try { return await putOnce(file, key, type, cache, more); }
        catch (e) { if (k === 3) throw e; await new Promise(r => setTimeout(r, 3000 * k)); }
    }
}
function putOnce(file, key, type, cache, more) {
    return new Promise((done, fail) => {
        const p = spawn('npx', ['--yes', 'wrangler@4.40.0', 'r2', 'object', 'put', 'media/' + key, '--file', file,
            '--content-type', type, '--cache-control', cache, ...more, '--remote'], { stdio: ['ignore', 'pipe', 'pipe'] });
        let log = '';
        p.stdout.on('data', d => log += d); p.stderr.on('data', d => log += d);
        p.on('close', code => code === 0 ? done() : fail(new Error(key + ': ' + log.trim().split('\n').slice(-3).join(' '))));
    });
}
async function upload(book, out, json) {
    // the PDF first: the largest file, it goes up while the pictures follow
    const files = [json.pdf.datei, ...readdirSync(out).filter(f => f.endsWith('.webp'))];
    // the pictures carry ?v=<fingerprint> in the overview (the PDF on the start page), so the browser may keep them for a year
    const queue = files.slice();
    await Promise.all(Array.from({ length: 6 }, async () => {
        for (let f; (f = queue.shift());) {
            if (f === json.pdf.datei) await put(path.join(out, f), KEY(book) + f, 'application/pdf', 'public, max-age=31536000, immutable',
                ['--content-disposition', 'inline; filename="' + json.pdf.name + '"']);
            else await put(path.join(out, f), KEY(book) + f, 'image/webp', 'public, max-age=31536000, immutable');
        }
    }));
    // read back before seiten.json points to them
    for (const f of files) {
        const r = await fetchRetry(MEDIA + KEY(book) + f + '?v=' + json.v, { method: 'HEAD' });
        if (!r.ok || +r.headers.get('content-length') !== statSync(path.join(out, f)).size) throw new Error('Rücklesen ' + f + ': HTTP ' + r.status);
    }
    await put(path.join(out, 'seiten.json'), KEY(book) + 'seiten.json', 'application/json', 'public, max-age=60');
    const back = await online(book);
    if (!back || back.v !== json.v) throw new Error('seiten.json ist online noch nicht die neue');
}

// ---------- which books ----------
let todo = named.length ? named : null;
if (!todo && !args.includes('--alle')) {
    console.error('node tools/buch-seiten/seitenbilder.mjs <buch> [<buch> …] | --alle   [--basis URL] [--nur-lokal] [--letter | --a4]');
    process.exit(1);
}
if (LIVE) for (let k = 0; deploying(); k++) {
    if (k === 40) { console.error('Der Pages-Lauf läuft seit 10 Minuten - später noch einmal.'); process.exit(1); }
    if (k === 0) console.log('Pages-Lauf läuft noch, ich warte …');
    await new Promise(r => setTimeout(r, 15000));
}
const all = books();
if (todo) {
    const bad = todo.filter(b => !all.includes(b));
    if (bad.length) { console.error('kein Buch mit Druckausgabe: ' + bad.join(', ')); process.exit(1); }
} else {
    todo = [];
    for (const b of all) {
        const j = await online(b);
        try { if (!j || j.v !== await fingerprint(b)) todo.push(b); } catch (e) { console.log(b + ': ' + e.message + ' (nicht online?)'); }
    }
    console.log(todo.length ? 'veraltet: ' + todo.join(', ') : 'Alle ' + all.length + ' Bücher sind aktuell.');
}

const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] });
let failed = 0;
try {
    for (const book of todo) {
        const t0 = Date.now();
        // the fingerprint before the pages: a deploy during the run leaves the old one, and the next --alle comes back
        let v;
        try { v = await fingerprint(book); } catch (e) { failed++; console.error(book + ': ' + e.message); continue; }
        const out = path.join(os.tmpdir(), 'seitenbilder', book + (other(book) ? '-' + other(book) : ''));
        mkdirSync(out, { recursive: true });
        try {
            console.log(book + ': setzen …');
            const json = await render(browser, book, v, out);
            const kb = readdirSync(out).filter(f => f.endsWith('.webp')).reduce((s, f) => s + statSync(path.join(out, f)).size, 0) / 1024;
            console.log(book + ': ' + json.seiten.length + ' Seiten, ' + Math.round(kb) + ' KB Bilder, PDF ' + (json.pdf.bytes / 1048576).toFixed(1) + ' MB, ' +
                Math.round((Date.now() - t0) / 1000) + ' s' + (LOCAL ? '  → ' + out : ''));
            if (!LOCAL) { await upload(book, out, json); console.log(book + ': online ' + MEDIA + KEY(book) + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); }
        } catch (e) { failed++; console.error(book + ': ' + e.message); }
    }
} finally { await browser.close(); }
process.exit(failed ? 1 : 0);
