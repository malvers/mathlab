#!/usr/bin/env node
/**
 * Default link preview for every page that has no card of its own.
 *
 * make-og.mjs writes a real card (og:image) for each lab, book, deck and the hub. Every other page - and every new lab
 * before anyone runs make-og for it - had no og:image at all, so WhatsApp, Signal and iMessage fell back to the favicon:
 * the small yellow lambda square (Doc, 21.11.2026, the new Raumkrümmung lab in Signal). This script gives such a page the
 * site's default card, resources/og/default.jpg (made by `make-og.mjs --fallback`: the lambda in the middle of a
 * full-bleed background, so a square crop still shows all of it).
 *
 * It runs in the Pages deploy on the staged copy (_site), never on the repo: the pages in git stay as they are, and a
 * page that gets its own card later simply stops getting this one. The output is deterministic - the same page gives the
 * same bytes on every deploy (no build id, no date), so Pages does not have to re-sync every page each time.
 * No dependencies, plain Node.
 *
 * Usage:
 *   node tools/og-preview/og-fallback.mjs _site          # rewrite the staged site in place
 *   node tools/og-preview/og-fallback.mjs HTML --dry     # only count / list what would get the default card
 *   node tools/og-preview/og-fallback.mjs HTML --dry --list
 */

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://docalvers.de';
const IMAGE = `${SITE}/resources/og/default.jpg`;
const NAME = 'Doc Alvers Mathe-Labore';
const BEGIN = '<!-- OG:FALLBACK - added at deploy by tools/og-preview/og-fallback.mjs, this page has no card of its own -->';
const END = '<!-- OG:FALLBACK END -->';

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const LIST = argv.includes('--list');
const ROOT = path.resolve(argv.find((a) => !a.startsWith('--')) || '_site');
const SKIP_DIRS = new Set(['node_modules', '.git', '.idea', 'screenshots_original']);

function* walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (!SKIP_DIRS.has(e.name)) yield* walk(path.join(dir, e.name));
        } else if (e.name.endsWith('.html')) {
            yield path.join(dir, e.name);
        }
    }
}

const unesc = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => unesc(String(s || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

// "DOC ALVERS MATHE-LABORE | Raumkrümmung" -> "Raumkrümmung — Doc Alvers Mathe-Labore", as make-og.mjs writes it
function cardTitle(t) {
    const m = t.match(/^doc alvers mathe-labore?\s*[|–—-]\s*(.+)$/i);
    if (m) return `${m[1].trim()} — ${NAME}`;
    return t || NAME;
}

function block(src, rel, indent) {
    const head = src.slice(0, src.search(/<\/head>/i));
    const has = (re) => re.test(head);
    const title = cardTitle(plain((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]));
    const desc = plain((head.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1]);
    const url = `${SITE}/${rel.split(path.sep).map(encodeURIComponent).join('/')}`;
    const prop = (p, v) => (has(new RegExp(`property=["']${p}["']`, 'i')) ? null : `<meta property="${p}" content="${esc(v)}">`);
    const name = (n, v) => (has(new RegExp(`name=["']${n}["']`, 'i')) ? null : `<meta name="${n}" content="${esc(v)}">`);
    const L = [
        BEGIN,
        prop('og:type', 'website'),
        prop('og:site_name', NAME),
        prop('og:title', title),
        desc ? prop('og:description', desc) : null,
        prop('og:url', url),
        `<meta property="og:image" content="${IMAGE}">`,
        `<meta property="og:image:type" content="image/jpeg">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta property="og:image:alt" content="${NAME}">`,
        name('twitter:card', 'summary_large_image'),
        name('twitter:title', title),
        desc ? name('twitter:description', desc) : null,
        `<meta name="twitter:image" content="${IMAGE}">`,
        END,
    ].filter(Boolean);
    return L.map((l) => indent + l).join('\n');
}

let seen = 0, added = 0;
const list = [];
for (const file of walk(ROOT)) {
    seen++;
    const src = fs.readFileSync(file, 'utf8');
    if (!/<\/head>/i.test(src)) continue;                               // a fragment, no page
    const head = src.slice(0, src.search(/<\/head>/i));
    if (/(property|name)=["'](og:image|twitter:image)["']/i.test(head) || head.includes(END)) continue;   // has its own card
    const rel = path.relative(ROOT, file);
    added++;
    list.push(rel);
    if (DRY) continue;
    const t = src.match(/([ \t]*)<title[^>]*>[\s\S]*?<\/title>/i);
    let next;
    if (t && t.index < head.length) {
        const at = t.index + t[0].length;
        next = src.slice(0, at) + '\n' + block(src, rel, t[1] || '    ') + src.slice(at);
    } else {
        const at = src.search(/<\/head>/i);
        next = src.slice(0, at) + block(src, rel, '    ') + '\n' + src.slice(at);
    }
    fs.writeFileSync(file, next);
}

if (LIST) console.log(list.sort().join('\n'));
console.log(`${DRY ? 'would give' : 'gave'} ${added} of ${seen} pages the default link preview (${IMAGE})`);
