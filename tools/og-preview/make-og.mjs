#!/usr/bin/env node
/**
 * Link-preview generator (Open Graph / Twitter cards).
 *
 * For every lab in HTML/js/labs-config.js it
 *   1. shoots the lab head-less (Playwright),
 *   2. renders one central card template (og-card.html) at 1200x630,
 *   3. writes HTML/resources/og/<id>.jpg - a book card (buch-*) goes to the R2 bucket "media" instead (og/<id>.jpg),
 *   4. injects the og:* / twitter:* meta block into the lab's HTML head.
 *
 * The meta block is delimited by OG:BEGIN / OG:END markers and is rewritten in
 * place on every run, so the tool is idempotent.
 *
 * Usage:
 *   node tools/og-preview/make-og.mjs                 # everything
 *   node tools/og-preview/make-og.mjs --only brahmagupta,koerper
 *   node tools/og-preview/make-og.mjs --cards-only    # reuse cached lab shots
 *   node tools/og-preview/make-og.mjs --meta-only     # only rewrite the HTML heads
 *   node tools/og-preview/make-og.mjs --books         # only the textbook cards (combines with the flags above)
 *   node tools/og-preview/make-og.mjs --decks         # only the slide decks (HTML/decks/, cards on R2 as well)
 *   node tools/og-preview/make-og.mjs --dry           # show what would change
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const HTML = path.join(ROOT, 'HTML');
const OUT = path.join(HTML, 'resources', 'og');
const SHOTS = path.join(HERE, 'shots');
const SITE = 'https://docalvers.de';
// The book cards live in R2, not in git: every book in five languages brings ~250 of them and every cover change
// rebuilds them (Doc, 27.10.2026: "mach die R2-Sachen" - 1230 cards, 120 MB of the Pages site). Rendered into R2_DIR
// (ignored), uploaded, read back; the book covers (-cover.jpg) stay in resources/og, the hub shows them.
const MEDIA = 'https://pub-5e3b331002a14e5a8532e12ebae95bf9.r2.dev';   // bucket "media", the same as the book photos
const R2_DIR = path.join(HERE, 'r2');
// the deck cards too: 220 decks, every slide change may call for a new one (Doc, 03.11.2026: "für die einzelnen Bücher
// haben wir noch keine schöne Vorschauen" - the link was the Making-of deck)
const onR2 = (lab) => lab.id.startsWith('buch-') || lab.id.startsWith('deck-');

// Playwright lives in videopipeline/ — reused here instead of a second install.
const { chromium } = require(path.join(ROOT, 'videopipeline', 'node_modules', 'playwright'));

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => {
    const i = argv.indexOf(f);
    return i >= 0 ? argv[i + 1] : null;
};
const ONLY = (val('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
const DRY = has('--dry');
const CARDS_ONLY = has('--cards-only');
const META_ONLY = has('--meta-only');
const BOOKS = has('--books');
const DECKS = has('--decks');

// ---------------------------------------------------------------- lab registry
function readLabs() {
    const src = fs.readFileSync(path.join(HTML, 'js', 'labs-config.js'), 'utf8');
    const fn = new Function('LAB_ICONS', src + '\nreturn LABS_DATA;');
    const labs = fn(new Proxy({}, { get: () => '' }));
    // books (buch/…) get their cards from their own kapitel.js, see readBooks()
    // links into a hub view (index.html#buecher) are no page of their own
    const local = labs.filter((l) => l.href && !/^https?:\/\//i.test(l.href) && !l.href.startsWith('buch/') && !l.href.includes('#'));
    const dead = local.filter((l) => !fs.existsSync(path.join(HTML, l.href)));
    for (const l of dead) console.log(`!! ${l.id}: ${l.href} gibt es nicht — uebersprungen (Eintrag in labs-config.js pruefen)`);
    return local.filter((l) => fs.existsSync(path.join(HTML, l.href)));
}

// The site root itself gets a card too.
const EXTRA = [{
    id: 'index',
    href: 'index.html',
    title: 'Doc Alvers Mathe-Labore',
    tagline: 'Mathematik zum Anfassen',
    description: 'Interaktive Labore fuer Mathematik, Physik und Informatik — von der Grundrechenart bis zum Quantenschluesselaustausch. Alles im Browser, ohne Installation, kostenlos.',
}, {
    // the page about the second check of all teaching material, for the pupils (Doc, 12.10.2026)
    id: 'buch-zweite-pruefung',
    href: 'buch/zweite-pruefung.html',
    title: 'Die zweite Prüfung',
    tagline: '241 Fehler gefunden und korrigiert',
    description: 'Wie KI-Agentinnen alle Lehrbücher, Wochen-Quizze und Arbeitsblätter des Doc Alvers Mathe-Labors ein zweites Mal nachgerechnet und 241 Fehler gefunden haben - mit zehn echten Fehlern zum Selbersuchen.',
    alt: 'Die zweite Prüfung \u2014 Vorschaubild',
}];

// The words of the book cards per language; the chapter description is the one tools/buch-en/wrap.py writes into the page.
const BOOK_WORDS = {
    de: { tagline: (n) => `Interaktives Lehrbuch / ${n} Kapitel`, coverAlt: 'Titelseite des interaktiven Lehrbuchs', chapter: 'Kapitel',
        chapterAlt: 'Vorschaubild aus dem interaktiven Lehrbuch', locale: 'de_DE',
        desc: (c, B) => `${c.sub}. Kapitel ${c.k} des interaktiven Lehrbuchs ${B.title}: Erklärungen, Beispiele, Aufgaben in drei Stufen, Selbsttests und Labs zum Ausprobieren.` },
    en: { tagline: (n) => `Interactive textbook / ${n} chapters`, coverAlt: 'cover of the interactive textbook', chapter: 'Chapter',
        chapterAlt: 'preview from the interactive textbook', locale: 'en_GB',
        desc: (c, B) => `${c.sub}. Chapter ${c.k} of the interactive textbook ${B.title}: explanations, examples, exercises at three levels, self-checks and labs to try out.` },
    es: { tagline: (n) => `Libro de texto interactivo / ${n} capítulos`, coverAlt: 'portada del libro de texto interactivo', chapter: 'Capítulo',
        chapterAlt: 'vista previa del libro de texto interactivo', locale: 'es_ES',
        desc: (c, B) => `${c.sub}. Capítulo ${c.k} del libro de texto interactivo ${B.title}: explicaciones, ejemplos, ejercicios en tres niveles, autoevaluaciones y laboratorios para experimentar.` },
    // the Italian editions (package IT0, 18.10.2026); desc as tools/buch-en/wrap.py --lang it writes it
    it: { tagline: (n) => `Libro di testo interattivo / ${n} capitoli`, coverAlt: 'copertina del libro di testo interattivo', chapter: 'Capitolo',
        chapterAlt: 'anteprima dal libro di testo interattivo', locale: 'it_IT',
        desc: (c, B) => `${c.sub}. Capitolo ${c.k} del libro di testo interattivo ${B.title}: spiegazioni, esempi, esercizi su tre livelli, autoverifiche e laboratori da provare.` },
    // the French editions (package FR0, 22.10.2026); desc as tools/buch-en/wrap.py --lang fr writes it; colon: a no-break
    // space before the colon of the chapter card title ("Chapitre 2 : Équations, formules, figures")
    fr: { tagline: (n) => `Manuel interactif / ${n} chapitres`, coverAlt: 'couverture du manuel interactif', chapter: 'Chapitre',
        chapterAlt: 'aperçu du manuel interactif', locale: 'fr_FR', colon: '\u00a0:',
        desc: (c, B) => `${c.sub}. Chapitre ${c.k} du manuel interactif ${B.title}\u00a0: explications, exemples, exercices sur trois niveaux, autoévaluations et laboratoires à essayer.` },    // the Swahili editions for Kenya (package SW0, 03.11.2026); desc as tools/buch-en/wrap.py --lang sw writes it
    sw: { tagline: (n) => `Kitabu shirikishi cha kiada / sura ${n}`, coverAlt: 'jalada la kitabu shirikishi cha kiada', chapter: 'Sura',
        chapterAlt: 'onyesho kutoka kitabu shirikishi cha kiada', locale: 'sw_KE',
        desc: (c, B) => `${c.sub}. Sura ya ${c.k} ya kitabu shirikishi cha kiada ${B.title}: maelezo, mifano, mazoezi ya viwango vitatu, majaribio ya kujipima na maabara ya kujaribu.` },
    // the Portuguese (Portugal), Dutch and Turkish editions (package arch3, 08.11.2026); desc as tools/buch-en/wrap.py --lang pt / nl / tr
    // writes it (TODO nl / TODO tr: the agents of these languages check their card words)
    pt: { tagline: (n) => `Manual interativo / ${n} capítulos`, coverAlt: 'capa do manual interativo', chapter: 'Capítulo',
        chapterAlt: 'pré-visualização do manual interativo', locale: 'pt_PT',
        desc: (c, B) => `${c.sub}. Capítulo ${c.k} do manual interativo ${B.title}: explicações, exemplos, exercícios em três níveis, autoavaliações e laboratórios para experimentar.` },
    nl: { tagline: (n) => `Interactief leerboek / ${n} hoofdstukken`, coverAlt: 'omslag van het interactieve leerboek', chapter: 'Hoofdstuk',
        chapterAlt: 'voorbeeld uit het interactieve leerboek', locale: 'nl_NL',
        desc: (c, B) => `${c.sub}. Hoofdstuk ${c.k} van het interactieve leerboek ${B.title}: uitleg, voorbeelden, opgaven op drie niveaus, zelftoetsen en labs om uit te proberen.` },
    tr: { tagline: (n) => `Etkileşimli ders kitabı / ${n} bölüm`, coverAlt: 'etkileşimli ders kitabının kapağı', chapter: 'Bölüm',
        chapterAlt: 'etkileşimli ders kitabından önizleme', locale: 'tr_TR',
        desc: (c, B) => `${c.sub}. Bölüm ${c.k}, etkileşimli ders kitabı ${B.title}: açıklamalar, örnekler, üç düzeyde alıştırmalar, öz değerlendirme testleri ve denemek için laboratuvarlar.` },
};

// The textbooks (HTML/buch/<book>/): a card for the cover page and one per chapter. The texts come from the
// book's own kapitel.js (window.BUCH) - the single list of chapters - never from labs-config.js.
function readBooks() {
    const out = [], dir = path.join(HTML, 'buch');
    if (!fs.existsSync(dir)) return out;
    for (const b of fs.readdirSync(dir)) {
        const k = path.join(dir, b, 'kapitel.js');
        if (!fs.existsSync(k)) continue;
        const win = {};
        new Function('window', fs.readFileSync(k, 'utf8'))(win);
        const B = win.BUCH;
        if (!B || !B.chapters) continue;
        // the English, Spanish, Italian, French, Swahili, Portuguese, Dutch and Turkish editions (kapitel.js lang: 'en' / 'es' / 'it' / 'fr' /
        // 'sw' / 'pt' / 'nl' / 'tr') get their card texts
        // in their own language
        // (Doc, 12.10.2026: "Bitte stell sicher, dass alle Bücher auch eine Vorschau haben")
        const lang = B.lang || 'de';
        const W = BOOK_WORDS[lang] || BOOK_WORDS.de;
        out.push({ id: 'buch-' + b, href: `buch/${b}/index.html`, cover: true, lang, title: B.title, tagline: W.tagline(B.chapters.length),
            description: B.description || B.title, alt: B.title + ' \u2014 ' + W.coverAlt });
        for (const c of B.chapters) {
            out.push({ id: `buch-${b}-${c.file.replace(/\.html$/, '')}`, href: `buch/${b}/${c.file}`, lang,
                title: `${W.chapter} ${c.k}${W.colon || ':'} ${c.title}`, tagline: `${B.short || B.title} / ${c.lb}`,
                description: W.desc(c, B), alt: `${W.chapter} ${c.k}${W.colon || ':'} ${c.title} \u2014 ${W.chapterAlt}` });
        }
    }
    return out;
}

// The slide decks (HTML/decks/*.html): one card each, its picture the deck's title slide. The texts are the deck's own
// <title> and description (html_deck.py writes the subtitle there), the kicker of the title slide says which course.
// Left out: a deck behind a password (deck-lock.js) - its title slide would give it away - and a deck without a title
// slide of its own (tafel.html builds its slides from a database row).
function readDecks() {
    const out = [], dir = path.join(HTML, 'decks');
    if (!fs.existsSync(dir)) return out;
    const plain = (s) => unesc(String(s || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
    for (const f of fs.readdirSync(dir).sort()) {
        if (!f.endsWith('.html')) continue;
        const src = fs.readFileSync(path.join(dir, f), 'utf8');
        if (!src.includes('<div id="deck">') || src.includes('deck-lock') || !/<section class="slide title\b/.test(src)) continue;
        const ts = src.slice(src.search(/<section class="slide title\b/));
        const head = src.slice(0, src.indexOf('</head>'));
        const title = plain((head.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]);
        const desc = plain((head.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) || [])[1]);
        const kicker = plain((ts.match(/<p class="kicker">([\s\S]*?)<\/p>/) || [])[1]);
        if (!title) continue;
        out.push({ id: 'deck-' + f.replace(/\.html$/, ''), href: `decks/${f}`, deck: true, title,
            tagline: kicker || desc, description: desc || kicker || title, alt: `${title} — Titelfolie des Decks` });
    }
    return out;
}

// ------------------------------------------------------------------- text bits
// Orbitron has no glyph for these; they would render as empty boxes on the card.
const GLYPH_FIX = [[/[\u00b7\u2022]/g, '/'], [/[\u201e\u201c\u201d]/g, '"'], [/[\u2018\u2019]/g, "'"]];

function forCard(s) {
    let out = String(s || '');
    for (const [re, to] of GLYPH_FIX) out = out.replace(re, to);
    return out.trim();
}

function shorten(s, max) {
    const t = String(s || '').replace(/\s+/g, ' ').trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
    if (stop > max * 0.5) return cut.slice(0, stop + 1);
    return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\u2014-]$/, '') + '\u2026';
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// read back from an HTML file, so esc() does not escape it twice
function unesc(s) {
    return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

function taglineOf(lab) {
    if (lab.tagline) return lab.tagline;
    return shorten(lab.description, 70);
}

// ------------------------------------------------------------- static file serv
const MIME = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
    '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.csv': 'text/csv',
};

// Own throwaway server on a random free port — Doc's serve.py on :8765 stays untouched.
function startServer() {
    const server = http.createServer((req, res) => {
        const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
        let file = path.join(HTML, rel || 'index.html');
        if (!file.startsWith(HTML)) { res.writeHead(403).end(); return; }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        fs.readFile(file, (err, buf) => {
            if (err) { res.writeHead(404).end('not found'); return; }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
            res.end(buf);
        });
    });
    return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })));
}

// ------------------------------------------------------------------ screenshots
const SHOT_VIEWPORT = { width: 1400, height: 880 };

// A deck: its title slide alone, fully built, at 16:9 filling the window - no "Good morning" slide before it, no buttons,
// no Solita ring, no page number; the card shows it edge to edge (og-card.html .full).
async function shootDeck(browser, lab, port) {
    const dest = path.join(SHOTS, lab.id + '.png');
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1.5 });
    const page = await ctx.newPage();
    // the night of the title slide runs live in WebGL (deck-flow.js) - head-less without a GPU that takes minutes a
    // frame; without it the slide shows the still picture deck.css gives it, as the presenter view does
    await page.route('**/deck-flow.js', (r) => r.abort());
    try {
        await page.goto(`http://127.0.0.1:${port}/${lab.href}`, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1000);
        // deck.js: #n opens the n-th slide the class sees, fully built
        const n = await page.evaluate(() => {
            const seen = [...document.querySelectorAll('#deck > section.slide')].filter((s) => !s.classList.contains('skip'));
            return seen.findIndex((s) => s.classList.contains('title')) + 1;
        });
        if (n < 1) throw new Error('no title slide shown');
        await page.evaluate((k) => { location.hash = '#' + k; }, n);
        await page.addStyleTag({ content: 'body>*:not(#stage){display:none!important}#deck .slide .pageno,#deck .slide .foot{visibility:hidden!important}' });
        await page.waitForTimeout(2500);          // fonts, KaTeX and the slide's picture
        await page.screenshot({ path: dest });
        return dest;
    } finally {
        await ctx.close();
    }
}

async function shootLab(browser, lab, port) {
    if (lab.deck) return shootDeck(browser, lab, port);
    const dest = path.join(SHOTS, lab.id + '.png');
    const ctx = await browser.newContext({ viewport: SHOT_VIEWPORT, deviceScaleFactor: 1.5 });
    const page = await ctx.newPage();
    try {
        const url = `http://127.0.0.1:${port}/${lab.href}?lang=de`;
        try {
            await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        } catch {
            // Pages holding a permanent connection never fire 'load' — take what is painted.
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        }
        // The card carries the wordmark itself — hide the lab's own overlay.
        await page.addStyleTag({ content: '.canvas-branding{display:none!important}' }).catch(() => {});
        await page.waitForTimeout(3500);          // let intros, fonts and canvases settle
        // a book page: Solita's box closed and no "Fehler melden" in the head, as on the first book cards - a password field
        // has no place on a preview (Doc, 12.10.2026: "alle Bücher auch eine Vorschau")
        if (lab.href.startsWith('buch/')) {
            await page.evaluate(() => document.querySelectorAll('.b-solita.offen').forEach((e) => e.classList.remove('offen'))).catch(() => {});
            await page.addStyleTag({ content: '.b-meld-rot,.b-solita .sf-in,.b-solita .sf-eye,.b-solita .sf-mic,.b-solita .sf-stop,.b-solita .sf-send,.b-solita-x{display:none!important}' }).catch(() => {});
            // the cover page: the foreword stands above the cover since 27.10.2026 (js/buch.js buildGruss) - the card shows
            // the cover, as the first book cards did (Swahili card, 03.11.2026: the letter filled the whole picture)
            if (lab.cover) await page.addStyleTag({ content: '.b-gruss{display:none!important}' }).catch(() => {});
            await page.waitForTimeout(300);
        }
        await page.screenshot({ path: dest });
        // a book's cover page: its cover also as a picture of its own - the book's card on the hub shows it
        // (Doc, 09.10.2026: "Nimm als Logo tatsächlich das Cover")
        if (lab.cover) {
            const el = await page.$('.b-titel');
            if (el && !DRY) await el.screenshot({ path: path.join(OUT, lab.id + '-cover.jpg'), type: 'jpeg', quality: 88 });
        }
        return dest;
    } finally {
        await ctx.close();
    }
}

// ------------------------------------------------------------------- card render
const dataUri = (file, mime) => `data:${mime};base64,` + fs.readFileSync(file).toString('base64');

async function renderCard(browser, lab, shotFile) {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    try {
        await page.goto(pathToFileURL(path.join(HERE, 'og-card.html')).href, { waitUntil: 'load' });
        await page.evaluate((d) => window.ogFill(d), {
            title: forCard(lab.title),
            tagline: forCard(taglineOf(lab)),
            shot: shotFile ? dataUri(shotFile, 'image/png') : null,
            full: !!lab.deck,                     // the title slide carries its own title: no text panel
            // favicon-live.png: in the repo favicon.png is the red local icon (27.10.2026)
            logo: dataUri(path.join(HTML, 'resources', 'favicon-live.png'), 'image/png'),
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);
        const dest = path.join(onR2(lab) ? R2_DIR : OUT, lab.id + '.jpg');
        await page.screenshot({ path: dest, type: 'jpeg', quality: 90 });
        return dest;
    } finally {
        await ctx.close();
    }
}

// ---------------------------------------------------------------------- R2 upload
// wrangler pinned as in tools/media_publish.mjs (4.152 answers every put with 403 "Please enable R2", 25.10.2026)
async function toR2(file) {
    const key = 'og/' + path.basename(file);
    const r = spawnSync('npx', ['--yes', 'wrangler@4.40.0', 'r2', 'object', 'put', 'media/' + key, '--file', file,
        '--content-type', 'image/jpeg', '--cache-control', 'public, max-age=86400', '--remote'], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error('R2: ' + ((r.stdout || '') + (r.stderr || '')).trim().split('\n').pop());
    // read back before the page links there: same size as the local card, or the upload is not trusted
    const head = await fetch(`${MEDIA}/${key}`, { method: 'HEAD', cache: 'no-store' });
    if (!head.ok || Number(head.headers.get('content-length')) !== fs.statSync(file).size) {
        throw new Error(`R2: read back HTTP ${head.status}, ${head.headers.get('content-length')} bytes`);
    }
}

// -------------------------------------------------------------------- meta block
const BEGIN = '<!-- OG:BEGIN — generated by tools/og-preview/make-og.mjs, do not edit by hand -->';
const END = '<!-- OG:END -->';

function metaBlock(lab) {
    const url = `${SITE}/${lab.href}`;
    const img = onR2(lab) ? `${MEDIA}/og/${lab.id}.jpg` : `${SITE}/resources/og/${lab.id}.jpg`;
    const title = lab.id === 'index' ? 'Doc Alvers Mathe-Labore' : `${lab.title} \u2014 Doc Alvers Mathe-Labore`;
    const desc = shorten(lab.description || taglineOf(lab), 200);
    const L = [
        BEGIN,
        `<meta name="description" content="${esc(desc)}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:site_name" content="Doc Alvers Mathe-Labore">`,
        `<meta property="og:locale" content="${(BOOK_WORDS[lab.lang] || BOOK_WORDS.de).locale}">`,
        `<meta property="og:title" content="${esc(title)}">`,
        `<meta property="og:description" content="${esc(desc)}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta property="og:image" content="${img}">`,
        `<meta property="og:image:type" content="image/jpeg">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta property="og:image:alt" content="${esc(lab.alt || forCard(lab.title) + ' \u2014 Vorschaubild des Labors')}">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${esc(title)}">`,
        `<meta name="twitter:description" content="${esc(desc)}">`,
        `<meta name="twitter:image" content="${img}">`,
        END,
    ];
    return L.map((l, i) => (i === 0 ? '    ' + l : '    ' + l)).join('\n');
}

function injectMeta(lab) {
    const file = path.join(HTML, lab.href);
    if (!fs.existsSync(file)) return 'missing';
    let src = fs.readFileSync(file, 'utf8');
    const block = metaBlock(lab);

    const existing = new RegExp(`[ \\t]*${BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END}`, '');
    let next;
    if (existing.test(src)) {
        next = src.replace(existing, block);
    } else {
        const m = src.match(/<title>[\s\S]*?<\/title>/i);
        if (!m) return 'no-title';
        // A hand-written description would be duplicated by ours — drop it.
        let body = block;
        if (/<meta\s+name=["']description["']/i.test(src)) {
            src = src.replace(/[ \t]*<meta\s+name=["']description["'][^>]*>[ \t]*\n?/gi, '');   // keep the next line's indent
        }
        const mm = src.match(/<title>[\s\S]*?<\/title>/i);
        next = src.slice(0, mm.index + mm[0].length) + '\n' + body + src.slice(mm.index + mm[0].length);
    }
    if (next === src) return 'unchanged';
    if (!DRY) fs.writeFileSync(file, next);
    return 'written';
}

// --------------------------------------------------------------------------- run
const main = async () => {
    let labs = [...EXTRA, ...readBooks(), ...readDecks(), ...readLabs()];
    if (ONLY.length) labs = labs.filter((l) => ONLY.includes(l.id));
    if (BOOKS || DECKS) labs = labs.filter((l) => (BOOKS && l.id.startsWith('buch-')) || (DECKS && l.deck));
    if (!labs.length) { console.error('no labs matched --only'); process.exit(1); }

    fs.mkdirSync(OUT, { recursive: true });
    fs.mkdirSync(R2_DIR, { recursive: true });
    fs.mkdirSync(SHOTS, { recursive: true });

    let browser, srv;
    if (!META_ONLY) {
        browser = await chromium.launch({ args: ['--mute-audio'] });   // tours and labs may talk
        srv = await startServer();
    }

    let n = 0;
    for (const lab of labs) {
        n++;
        const tag = `[${String(n).padStart(2)}/${labs.length}] ${lab.id}`;
        try {
            if (!META_ONLY) {
                const shot = path.join(SHOTS, lab.id + '.png');
                const reuse = CARDS_ONLY && fs.existsSync(shot);
                if (!reuse) await shootLab(browser, lab, srv.port);
                const card = await renderCard(browser, lab, fs.existsSync(shot) ? shot : null);
                if (onR2(lab) && !DRY) await toR2(card);
            }
            const meta = injectMeta(lab);
            console.log(`${tag}  card ok  meta ${meta}`);
        } catch (e) {
            console.log(`${tag}  FAILED  ${e.message.split('\n')[0]}`);
        }
    }

    if (browser) await browser.close();
    if (srv) srv.server.close();
    console.log(DRY ? '\ndry run — HTML heads unchanged' : '\ndone');
};

main();
