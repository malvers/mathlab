#!/usr/bin/env node
/**
 * Link-preview generator (Open Graph / Twitter cards).
 *
 * For every lab in HTML/js/labs-config.js it
 *   1. shoots the lab head-less (Playwright),
 *   2. renders one central card template (og-card.html) at 1200x630,
 *   3. writes HTML/resources/og/<id>.jpg,
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
 *   node tools/og-preview/make-og.mjs --dry           # show what would change
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const HTML = path.join(ROOT, 'HTML');
const OUT = path.join(HTML, 'resources', 'og');
const SHOTS = path.join(HERE, 'shots');
const SITE = 'https://docalvers.de';

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

// ---------------------------------------------------------------- lab registry
function readLabs() {
    const src = fs.readFileSync(path.join(HTML, 'js', 'labs-config.js'), 'utf8');
    const fn = new Function('LAB_ICONS', src + '\nreturn LABS_DATA;');
    const labs = fn(new Proxy({}, { get: () => '' }));
    const local = labs.filter((l) => l.href && !/^https?:\/\//i.test(l.href));
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
}];

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

async function shootLab(browser, lab, port) {
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
        await page.screenshot({ path: dest });
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
            logo: dataUri(path.join(HTML, 'resources', 'favicon.png'), 'image/png'),
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);
        const dest = path.join(OUT, lab.id + '.jpg');
        await page.screenshot({ path: dest, type: 'jpeg', quality: 90 });
        return dest;
    } finally {
        await ctx.close();
    }
}

// -------------------------------------------------------------------- meta block
const BEGIN = '<!-- OG:BEGIN — generated by tools/og-preview/make-og.mjs, do not edit by hand -->';
const END = '<!-- OG:END -->';

function metaBlock(lab) {
    const url = `${SITE}/${lab.href}`;
    const img = `${SITE}/resources/og/${lab.id}.jpg`;
    const title = lab.id === 'index' ? 'Doc Alvers Mathe-Labore' : `${lab.title} \u2014 Doc Alvers Mathe-Labore`;
    const desc = shorten(lab.description || taglineOf(lab), 200);
    const L = [
        BEGIN,
        `<meta name="description" content="${esc(desc)}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:site_name" content="Doc Alvers Mathe-Labore">`,
        `<meta property="og:locale" content="de_DE">`,
        `<meta property="og:title" content="${esc(title)}">`,
        `<meta property="og:description" content="${esc(desc)}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta property="og:image" content="${img}">`,
        `<meta property="og:image:type" content="image/jpeg">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta property="og:image:alt" content="${esc(forCard(lab.title))} \u2014 Vorschaubild des Labors">`,
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
            src = src.replace(/[ \t]*<meta\s+name=["']description["'][^>]*>\s*\n?/gi, '');
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
    let labs = [...EXTRA, ...readLabs()];
    if (ONLY.length) labs = labs.filter((l) => ONLY.includes(l.id));
    if (!labs.length) { console.error('no labs matched --only'); process.exit(1); }

    fs.mkdirSync(OUT, { recursive: true });
    fs.mkdirSync(SHOTS, { recursive: true });

    let browser, srv;
    if (!META_ONLY) {
        browser = await chromium.launch();
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
                await renderCard(browser, lab, fs.existsSync(shot) ? shot : null);
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
