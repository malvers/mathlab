/**
 * seitenbilder.mjs — pictures of every page of a book's print edition, for the overview of the online book
 * (key O / "Seiten" in the header, druck.html?uebersicht, js/buch-druck.js).
 * Doc, 27.10.2026, on the phone: "Die lädt sehr langsam" - the overview set all 164 pages of Mathe 11 with Paged.js on
 * every opening (20 s on the Mac, ~40 s on a phone). Now the pages are set once, here, and the overview shows pictures.
 *
 * THE RULE (Doc, 12.11.2026: "Wir sollen nie wieder die ganzen Bücher neu rendern"): set again only what changed.
 *   - One page changed and nothing moved (a front page, a picture, a line that keeps its length): --seite N.
 *   - A change that leaves the pages as they are but is part of the fingerprint (a layout file used by other editions only):
 *     --umstempeln for exactly those books.
 *   - A whole book only when its pages shift (a new chapter, text that reflows) - --seite refuses then and says so.
 *   - Never a blanket --alle run: it sets every book whose fingerprint differs, and one central file (js/buch-gruss.js, the
 *     print CSS) is in all 116 fingerprints, so it means hours for pages that did not change. --alle stays for a single
 *     book that is not online yet or for a check, and only on Doc's word.
 *
 *     node tools/buch-seiten/seitenbilder.mjs mathe11 [mathe12 …]     render, upload to R2, read back
 *     node tools/buch-seiten/seitenbilder.mjs --seite 3 mathe11 …      only sheet 3 into the online set (see seiteTauschen)
 *     node tools/buch-seiten/seitenbilder.mjs --umstempeln mathe11-en …  only the new fingerprint into seiten.json (see umstempeln)
 *     node tools/buch-seiten/seitenbilder.mjs --alle                   every book whose pictures are out of date (see the rule)
 *     node tools/buch-seiten/seitenbilder.mjs --alle --pruefen         only the list of books out of date, nothing is set
 *     --basis http://localhost:8765   render another site than https://docalvers.de (a test: the pictures then show that state)
 *     --nur-lokal                     no upload, the files stay in the temp folder (with --seite: a check, "unverändert" or not)
 *     --parallel N                    set N books at a time (default 3: the M3 has four fast cores, one stays for the Mac)
 *     --letter | --a4                the other page format (druck.html?format=…) into buch/seiten/<buch>-letter|-a4/; a book's
 *                                     own format (kapitel.js format, default US Letter since 07.11.2026) goes into buch/seiten/<buch>/ as always
 *
 * In the R2 bucket "media" (as the book photos, tools/media_publish.mjs), folder buch/seiten/<buch>/, uploaded with a key
 * for that bucket alone from the keychain (see upload below):
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
import { execFileSync } from 'node:child_process';
import { createHash, createHmac } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MEDIA = 'https://pub-5e3b331002a14e5a8532e12ebae95bf9.r2.dev/';        // the same bucket as MEDIA in js/buch.js
const FORCE = process.argv.includes('--letter') ? 'letter' : process.argv.includes('--a4') ? 'a4' : '';
// a book's own format: US Letter unless kapitel.js says format: 'a4' (Doc, 07.11.2026: "nie wieder A4, sondern immer Letter")
const own = book => /format:\s*'a4'/.test(readFileSync(path.join(ROOT, 'HTML/buch', book, 'kapitel.js'), 'utf8')) ? 'a4' : 'letter';
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
const JOBS = Math.max(1, +opt('--parallel') || 3);
const SEITE = Math.max(0, Math.floor(+opt('--seite') || 0)), UMSTEMPELN = args.includes('--umstempeln');
const named = args.filter((a, i) => !a.startsWith('--') && !['--basis', '--parallel', '--seite'].includes(args[i - 1]));

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

// ---------- the print edition laid out by Paged.js in a tab, and what the sprites need to know about its pages ----------
// twice the pixels for the figures that druck.html freezes into pictures, so they stay sharp in the PDF;
// the screenshots for the sprites stay at one pixel per CSS pixel (scale: 'css')
async function setzen(ctx, book) {
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
    return { page, meta, errors };
}

// ---------- render: druck.html, every sheet as a screenshot, put together into the sprites in a second tab ----------
async function render(browser, book, v, out) {
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 2 });
    try {
        const { page, meta, errors } = await setzen(ctx, book);
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
            if (JOBS === 1 && i % 20 === 19) process.stdout.write('  ' + (i + 1) + '/' + n + '\r');   // books set side by side would mix their counts
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

// ---------- upload: R2's S3 interface with a key for the bucket "media" alone, a few at a time, seiten.json last ----------
// Until 02.11.2026 wrangler: a process and a login check per file, 22 per book. Six at a time ran into Cloudflare's rate
// limit (10429) and the login died mid-run (01.11.2026); even two at a time took 2.5 h for 116 books (Doc: "intelligentere
// Lösung"). The key: Cloudflare → R2 → API tokens → Object Read & Write, bucket media only. Into the keychain, never the repo:
//     security add-generic-password -U -s r2-media -a key-id -w
//     security add-generic-password -U -s r2-media -a secret -w
//     security add-generic-password -U -s r2-media -a account -w        (the account ID, as wrangler whoami shows it)
// -w at the end asks for the value, so it lands in no shell history.
let R2 = null;
function r2() {
    if (R2) return R2;
    const read = a => { try { return execFileSync('security', ['find-generic-password', '-s', 'r2-media', '-a', a, '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (_) { return ''; } };
    const [id, secret, account] = ['key-id', 'secret', 'account'].map(read);
    if (!id || !secret || !account) throw new Error('kein R2-Schlüssel im Schlüsselbund (security … -s r2-media), siehe upload in seitenbilder.mjs');
    return (R2 = { id, secret, host: account + '.r2.cloudflarestorage.com' });
}
// one PUT, signed with AWS Signature V4 as R2 wants it (region "auto"); the body itself is not hashed into the signature
// (UNSIGNED-PAYLOAD), the read back in upload checks it
async function putOnce(file, key, type, cache, disposition) {
    const { id, secret, host } = r2();
    const now = new Date().toISOString().replace(/[-:]|\.\d+/g, ''), day = now.slice(0, 8);     // 20261102T180500Z
    const url = '/media/' + key.split('/').map(encodeURIComponent).join('/');
    const h = { 'cache-control': cache, 'content-type': type, host, 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD', 'x-amz-date': now };
    if (disposition) h['content-disposition'] = disposition;
    const names = Object.keys(h).sort(), scope = day + '/auto/s3/aws4_request';
    const canon = ['PUT', url, '', ...names.map(n => n + ':' + h[n]), '', names.join(';'), 'UNSIGNED-PAYLOAD'].join('\n');
    const hmac = (k, s) => createHmac('sha256', k).update(s).digest();
    const sign = hmac(hmac(hmac(hmac('AWS4' + secret, day), 'auto'), 's3'), 'aws4_request');
    const sig = createHmac('sha256', sign).update(['AWS4-HMAC-SHA256', now, scope, createHash('sha256').update(canon).digest('hex')].join('\n')).digest('hex');
    delete h.host;                                                      // fetch sets it itself
    h.authorization = 'AWS4-HMAC-SHA256 Credential=' + id + '/' + scope + ', SignedHeaders=' + names.join(';') + ', Signature=' + sig;
    const r = await fetch('https://' + host + url, { method: 'PUT', headers: h, body: readFileSync(file) });
    if (!r.ok) throw new Error(key + ': HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
}
// three tries as in fetchRetry
async function put(file, key, type, cache, disposition) {
    for (let k = 1; ; k++) {
        try { return await putOnce(file, key, type, cache, disposition); }
        catch (e) { if (k === 3) throw e; await new Promise(r => setTimeout(r, 3000 * k)); }
    }
}
// a picture whose bytes are already online stays: a new book changes only the page with the wall of covers, the other
// pictures come out the same (R2's ETag of a single PUT is the MD5 of the file)
async function same(file, key) {
    try {
        const r = await fetchRetry(MEDIA + key + '?t=' + Date.now(), { method: 'HEAD' });
        return r.ok && r.headers.get('etag') === '"' + createHash('md5').update(readFileSync(file)).digest('hex') + '"';
    } catch (_) { return false; }
}
async function upload(book, out, json) {
    // the PDF first: the largest file, it goes up while the pictures follow
    const files = [json.pdf.datei, ...readdirSync(out).filter(f => f.endsWith('.webp'))];
    // the pictures carry ?v=<fingerprint> in the overview (the PDF on the start page), so the browser may keep them for a year
    const queue = files.slice();
    let kept = 0;
    await Promise.all(Array.from({ length: 6 }, async () => {
        for (let f; (f = queue.shift());) {
            if (f === json.pdf.datei) await put(path.join(out, f), KEY(book) + f, 'application/pdf', 'public, max-age=31536000, immutable',
                'inline; filename="' + json.pdf.name + '"');
            else if (await same(path.join(out, f), KEY(book) + f)) kept++;
            else await put(path.join(out, f), KEY(book) + f, 'image/webp', 'public, max-age=31536000, immutable');
        }
    }));
    if (kept) console.log(book + ': ' + kept + ' von ' + (files.length - 1) + ' Bildern waren schon so online');
    // read back before seiten.json points to them
    for (const f of files) {
        const r = await fetchRetry(MEDIA + KEY(book) + f + '?v=' + json.v, { method: 'HEAD' });
        if (!r.ok || +r.headers.get('content-length') !== statSync(path.join(out, f)).size) throw new Error('Rücklesen ' + f + ': HTTP ' + r.status);
    }
    await put(path.join(out, 'seiten.json'), KEY(book) + 'seiten.json', 'application/json', 'public, max-age=60');
    const back = await online(book);
    if (!back || back.v !== json.v) throw new Error('seiten.json ist online noch nicht die neue');
}

// ---------- --seite N: one sheet into the online set, the rest stays as it is ----------
// Doc, 12.11.2026, when the acknowledgement filled the empty back of the dedication in every German edition: "wieso dauert
// das ein paar Stunden? Bis man dann nur eine Seite einfügen … Nicht die ganzen PDFs neu rendern lassen". The book is laid
// out once as for a full run (Paged.js, about half a minute), but only sheet N is shot and printed. The online set is
// downloaded and only that page goes in: into the PDF with qpdf, into s.webp and its l-<k>.webp, into seiten.json (its jump
// targets, the new fingerprint). It refuses when anything else moved - another number of pages, another page size, other
// jump targets on any other page - because then the whole book has to be set. After the swap pdftotext compares the text
// of every other page with the old PDF: same number of pages, same order.
// Whether sheet N changed is told by its pixels against the large picture online: big counts the pixels that differ by
// more than STARK in a colour channel. The WebP of the old picture stays below that; a moved line does not (12.11.2026:
// two lines of the acknowledgement moved down a few px - the mean difference was only 1.28, so a mean alone cannot tell).
// Not a single such pixel: the page did not change, only the fingerprint goes up, as with --umstempeln. diff, the mean
// difference per channel (0-255), is shown as well. With --nur-lokal nothing goes up at all - a check.
const STARK = 160;
async function seiteTauschen(browser, book, v, out, N) {
    const alt = await online(book);
    if (!alt) throw new Error('nicht online - das Buch muss ganz gesetzt werden');
    const n0 = alt.seiten.length;
    if (N > n0) throw new Error('Seite ' + N + ' gibt es nicht (' + n0 + ' Seiten)');
    const lname = 'l-' + Math.floor((N - 1) / PER) + '.webp';
    // the online set: the PDF and the two pictures that hold sheet N
    mkdirSync(path.join(out, 'alt'), { recursive: true });
    for (const f of [alt.pdf.datei, 's.webp', lname]) {
        const r = await fetchRetry(MEDIA + KEY(book) + f + '?t=' + Date.now());
        if (!r.ok) throw new Error('laden ' + f + ': HTTP ' + r.status);
        writeFileSync(path.join(out, 'alt', f), Buffer.from(await r.arrayBuffer()));
    }
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 2 });
    try {
        const { page, meta, errors } = await setzen(ctx, book);
        const n = meta.seiten.length;
        if (n !== n0 || meta.w !== alt.w || meta.h !== alt.h) throw new Error(n + ' statt ' + n0 + ' Seiten oder ein anderes Format - das Buch muss ganz gesetzt werden');
        const moved = meta.seiten.map((z, i) => (i !== N - 1 && JSON.stringify(z) !== JSON.stringify(alt.seiten[i]) ? i + 1 : 0)).filter(Boolean);
        if (moved.length) throw new Error('auch Seite ' + moved.slice(0, 5).join(', ') + (moved.length > 5 ? ' …' : '') + ' hat sich verschoben - das Buch muss ganz gesetzt werden');
        const png = (await page.locator('.pagedjs_page').nth(N - 1).screenshot({ type: 'png', animations: 'disabled', scale: 'css' })).toString('base64');

        // the pictures, in a second tab as in render: the sheet at its place in l-<k>, and in two halvings into s.webp
        const comp = await ctx.newPage();
        const b64 = f => readFileSync(path.join(out, 'alt', f)).toString('base64');
        const res = await comp.evaluate(async ([png, sB, lB, i, W, H, s, PER, LC, STARK]) => {
            const bmp = async (b, type) => createImageBitmap(await (await fetch('data:' + type + ';base64,' + b)).blob());
            const img = await bmp(png, 'image/png'), Sold = await bmp(sB, 'image/webp'), Lold = await bmp(lB, 'image/webp');
            const j = i % PER, x = (j % LC) * W, y = Math.floor(j / LC) * H;
            const L = new OffscreenCanvas(Lold.width, Lold.height), lx = L.getContext('2d');
            lx.drawImage(Lold, 0, 0);
            const T = new OffscreenCanvas(W, H), tx = T.getContext('2d');
            tx.fillStyle = '#fff'; tx.fillRect(0, 0, W, H); tx.drawImage(img, 0, 0, W, H);
            const a = lx.getImageData(x, y, W, H).data, b = tx.getImageData(0, 0, W, H).data;
            let d = 0, big = 0;
            for (let q = 0; q < a.length; q += 4) {
                const r = Math.abs(a[q] - b[q]), g = Math.abs(a[q + 1] - b[q + 1]), u = Math.abs(a[q + 2] - b[q + 2]);
                d += r + g + u;
                if (Math.max(r, g, u) > STARK) big++;
            }
            lx.fillStyle = '#fff'; lx.fillRect(x, y, W, H); lx.drawImage(img, x, y, W, H);
            const S = new OffscreenCanvas(Sold.width, Sold.height), sx = S.getContext('2d');
            sx.drawImage(Sold, 0, 0);
            sx.imageSmoothingQuality = 'high';
            const half = new OffscreenCanvas(Math.round(W / 2), Math.round(H / 2)), hx = half.getContext('2d');
            hx.imageSmoothingQuality = 'high';
            hx.fillStyle = '#fff'; hx.fillRect(0, 0, half.width, half.height); hx.drawImage(img, 0, 0, half.width, half.height);
            const sxp = (i % s.cols) * s.w, syp = Math.floor(i / s.cols) * s.h;
            sx.fillStyle = '#fff'; sx.fillRect(sxp, syp, s.w, s.h); sx.drawImage(half, sxp, syp, s.w, s.h);
            const enc = async c => {
                const u = new Uint8Array(await (await c.convertToBlob({ type: 'image/webp', quality: 0.8 })).arrayBuffer());
                let t = ''; for (let p = 0; p < u.length; p += 0x8000) t += String.fromCharCode.apply(null, u.subarray(p, p + 0x8000));
                return btoa(t);
            };
            return { diff: d / (W * H * 3), big, l: await enc(L), s: await enc(S) };
        }, [png, b64('s.webp'), b64(lname), N - 1, meta.w, meta.h, alt.s, PER, LC, STARK]);

        // the PDF: sheet N alone from the same pages, then qpdf puts it in place of the old one
        await page.evaluate(() => document.documentElement.classList.remove('d-screen'));   // what "beforeprint" does (js/buch-druck.js)
        const one = path.join(out, 'seite.pdf'), oldPdf = path.join(out, 'alt', alt.pdf.datei), newPdf = path.join(out, alt.pdf.datei);
        await page.pdf({ path: one, preferCSSPageSize: true, printBackground: true, pageRanges: String(N) });
        if (execFileSync('qpdf', ['--show-npages', one], { encoding: 'utf8' }).trim() !== '1') throw new Error('PDF: Seite ' + N + ' allein ist nicht eine Seite');
        const parts = [];
        if (N > 1) parts.push(oldPdf, '1-' + (N - 1));
        parts.push(one, '1');
        if (N < n) parts.push(oldPdf, (N + 1) + '-z');
        execFileSync('qpdf', [oldPdf, '--pages', ...parts, '--', newPdf]);
        const texts = f => execFileSync('pdftotext', ['-layout', f, '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\f');
        const ta = texts(oldPdf), tb = texts(newPdf);
        if (ta.length !== tb.length || ta.length - 1 !== n) throw new Error('PDF: ' + (tb.length - 1) + ' Seiten, vorher ' + (ta.length - 1) + ', gesetzt ' + n);
        const off = ta.findIndex((t, i) => i !== N - 1 && t !== tb[i]);
        if (off >= 0) throw new Error('PDF: Seite ' + (off + 1) + ' ist nicht mehr dieselbe');

        writeFileSync(path.join(out, lname), Buffer.from(res.l, 'base64'));
        writeFileSync(path.join(out, 's.webp'), Buffer.from(res.s, 'base64'));
        const json = { ...alt, v, erstellt: new Date().toISOString(), pdf: { ...alt.pdf, bytes: statSync(newPdf).size }, seiten: meta.seiten };
        writeFileSync(path.join(out, 'seiten.json'), JSON.stringify(json));
        if (errors.length) console.log('  ' + book + ': Fehler auf der Seite: ' + errors.slice(0, 3).join(' | '));
        return { json, diff: res.diff, big: res.big, text: tb[N - 1].replace(/\s+/g, ' ').trim().slice(0, 60) };
    } finally { await ctx.close(); }
}

// ---------- --umstempeln: the live fingerprint into seiten.json, nothing else ----------
// For a change that is in a book's fingerprint but provably leaves its pages as they are (12.11.2026: js/buch-gruss.js is
// in all 116 fingerprints, the acknowledgement goes into the German editions only). Only for books named one by one, never
// with --alle: the proof that the pages stayed is the caller's - e.g. --seite N --nur-lokal on two of them, "unverändert".
async function umstempeln(book, v, out) {
    const alt = await online(book);
    if (!alt) throw new Error('nicht online - das Buch muss ganz gesetzt werden');
    if (alt.v === v) return 'schon aktuell';
    if (LOCAL) return 'würde umgestempelt: ' + alt.v + ' → ' + v;
    mkdirSync(out, { recursive: true });
    writeFileSync(path.join(out, 'seiten.json'), JSON.stringify({ ...alt, v, umgestempelt: new Date().toISOString() }));
    await put(path.join(out, 'seiten.json'), KEY(book) + 'seiten.json', 'application/json', 'public, max-age=60');
    const back = await online(book);
    if (!back || back.v !== v) throw new Error('seiten.json ist online noch nicht die neue');
    return 'umgestempelt: ' + alt.v + ' → ' + v;
}

// ---------- which books ----------
let todo = named.length ? named : null;
if (!todo && !args.includes('--alle')) {
    console.error('node tools/buch-seiten/seitenbilder.mjs <buch> [<buch> …] | --alle   [--seite N | --umstempeln] [--basis URL] [--nur-lokal] [--letter | --a4]');
    process.exit(1);
}
// --seite and --umstempeln work on books named one by one (the rule in the head of this file)
if ((SEITE || UMSTEMPELN) && (!named.length || args.includes('--alle'))) { console.error('--seite und --umstempeln nur mit einzeln genannten Büchern, nie mit --alle'); process.exit(1); }
if (SEITE && UMSTEMPELN) { console.error('--seite oder --umstempeln, nicht beides'); process.exit(1); }
if (args.includes('--seite') && !SEITE) { console.error('--seite braucht eine Seitenzahl ab 1 (Seite 1 = der Einband)'); process.exit(1); }
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
    if (args.includes('--pruefen')) process.exit(todo.length ? 1 : 0);   // --alle --pruefen: only this list, nothing is set
}

if (!LOCAL && todo.length) try { r2(); } catch (e) { console.error(e.message); process.exit(1); }   // before hours of setting, not after

let failed = 0;
// a fresh folder per run for the one-page swap: only what it writes goes up (upload takes every .webp in it)
const outOf = book => SEITE ? path.join(os.tmpdir(), 'seitenbilder-seite', book + (other(book) ? '-' + other(book) : '') + '-' + Date.now())
    : path.join(os.tmpdir(), 'seitenbilder', book + (other(book) ? '-' + other(book) : ''));
if (UMSTEMPELN) {
    // no browser, no pictures: one seiten.json after the other
    for (const book of todo) {
        try { console.log(book + ': ' + await umstempeln(book, await fingerprint(book), outOf(book) + '-stempel')); }
        catch (e) { failed++; console.error(book + ': ' + e.message); }
    }
    process.exit(failed ? 1 : 0);
}

const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] });
const queue = todo.slice();
try {
    // several books at a time, each in its own tab: setting a book keeps about one core busy (measured 02.11.2026:
    // 83 s a book, 28 of them Paged.js, 45 the screenshots)
    await Promise.all(Array.from({ length: Math.min(JOBS, todo.length) }, async () => { for (let book; (book = queue.shift());) {
        const t0 = Date.now();
        // the fingerprint before the pages: a deploy during the run leaves the old one, and the next --alle comes back
        let v;
        try { v = await fingerprint(book); } catch (e) { failed++; console.error(book + ': ' + e.message); continue; }
        const out = outOf(book);
        mkdirSync(out, { recursive: true });
        if (SEITE) {
            try {
                const r = await seiteTauschen(browser, book, v, out, SEITE);
                const s = Math.round((Date.now() - t0) / 1000), was = r.big + ' Pixel anders, im Mittel ' + r.diff.toFixed(2) + ', „' + r.text + '“';
                if (!r.big) console.log(book + ': Seite ' + SEITE + ' unverändert (' + was + '), ' + s + ' s'
                    + (LOCAL ? '' : ' - ' + await umstempeln(book, v, out + '-stempel')));
                else if (LOCAL) console.log(book + ': Seite ' + SEITE + ' neu (' + was + '), ' + s + ' s  → ' + out);
                else { await upload(book, out, r.json); console.log(book + ': Seite ' + SEITE + ' getauscht (' + was + '), online in ' + Math.round((Date.now() - t0) / 1000) + ' s'); }
            } catch (e) { failed++; console.error(book + ': ' + e.message); }
            continue;
        }
        try {
            console.log(book + ': setzen …');
            const json = await render(browser, book, v, out);
            const kb = readdirSync(out).filter(f => f.endsWith('.webp')).reduce((s, f) => s + statSync(path.join(out, f)).size, 0) / 1024;
            console.log(book + ': ' + json.seiten.length + ' Seiten, ' + Math.round(kb) + ' KB Bilder, PDF ' + (json.pdf.bytes / 1048576).toFixed(1) + ' MB, ' +
                Math.round((Date.now() - t0) / 1000) + ' s' + (LOCAL ? '  → ' + out : ''));
            if (!LOCAL) { await upload(book, out, json); console.log(book + ': online ' + MEDIA + KEY(book) + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); }
        } catch (e) { failed++; console.error(book + ': ' + e.message); }
    } }));
} finally { await browser.close(); }
process.exit(failed ? 1 : 0);
