// check.mjs - quick check of the English editions without a browser (well under a second), before every push.
// Doc, 11.10.2026: the architecture for translating more books.
//
//   1. pages      every English page has its German twin (HTML/buch/<book>/ for HTML/buch/<book>-en/) and the same
//                 answers and structure: data-ans, data-tol, data-mc, data-widget, data-lab, … in the same order
//                 (decimal comma = decimal point) - a correction in one edition that the other one is missing shows up here
//   2. scripts    the English page loads the same widget modules as the German one, each followed by its dictionary
//                 js/buch-en/<module>.js
//   3. sentences  every string in the source of the widgets the English pages use (and of the helpers of their modules)
//                 is put through the translation (js/buch-en.js + the dictionaries of that page); what still looks German
//                 and is not in known.json under "<module>/<widget>" or "<module>/*" is reported - a German widget
//                 sentence that was changed or added after the translation. For a NEW book this is not enough: there
//                 the browser check encheck.mjs --poke is the test, check.mjs only keeps the result from drifting.
//   4. conflicts  two dictionaries that translate the same German differently
//
// usage: node tools/buch-en/check.mjs [book-en …]     (no books: every HTML/buch/*-en/)
//        node tools/buch-en/check.mjs [book-en] --accept   stores the strings that look German but are fine
//                                                     (keys, parts of a rule, never shown). Only after
//                                                     node tools/buch-en/encheck.mjs <book-en> --poke shows no German.
//        node tools/buch-en/check.mjs --lang es [book-es …]   the same for the Spanish editions (HTML/buch/*-es/,
//                                                     js/buch-es.js, js/buch-es/<module>.js, tools/buch-es/known.json);
//                                                     unknown words are measured against /usr/share/dict/spanish if there
//                                                     is one, else against the words of the Spanish dictionaries only
import fs from 'fs';
import vm from 'vm';
import path from 'path';

// BUCH_EN_ROOT: another HTML/ tree, for testing the check itself on a copy
const ROOT = process.env.BUCH_EN_ROOT ? path.resolve(process.env.BUCH_EN_ROOT) + '/' : new URL('../../HTML/', import.meta.url).pathname;
const args = process.argv.slice(2);
// the language of the editions: en (default) or es (package ES0, 12.10.2026)
const LANG = args.includes('--lang') ? args.splice(args.indexOf('--lang'), 2)[1] : 'en';
if (!['en', 'es'].includes(LANG)) { console.log('✗ unknown language ' + LANG); process.exit(1); }
const NAME = { en: 'English', es: 'Spanish' }[LANG];
const KNOWN = new URL(LANG === 'en' ? 'known.json' : '../buch-' + LANG + '/known.json', import.meta.url).pathname;
const accept = args.includes('--accept');
const books = args.filter(a => !a.startsWith('--'));
const all = fs.readdirSync(ROOT + 'buch').filter(d => d.endsWith('-' + LANG) && fs.statSync(ROOT + 'buch/' + d).isDirectory()).sort();
const BOOKS = books.length ? books : all;
const read = p => fs.readFileSync(p, 'utf8');
const problems = [];
const bad = (where, msg) => problems.push(where + '  ' + msg);

// ---------- 1. pages: answers and structure ----------
// attributes that carry words (placeholders, tables of contents, labels) are translated and stay out of the comparison
const TEXT = new Set(['data-ph', 'data-toc', 'data-toc-short', 'data-toc-k', 'data-aria', 'data-labels', 'data-yl', 'data-xl',
    'data-h', 'data-unit', 'data-lat', 'data-body', 'data-motiv', 'data-al', 'data-t', 'data-fs-force']);
function attrs(src) {
    const out = {};
    const body = src.slice(src.indexOf('<body'));
    for (const m of body.matchAll(/\s(data-[a-z0-9-]+)="([^"]*)"/g)) {
        if (TEXT.has(m[1])) continue;
        (out[m[1]] = out[m[1]] || []).push(m[2].replace(/(\d),(\d)/g, '$1.$2'));
    }
    return out;
}
const MODULE = /<script src="\.\.\/\.\.\/js\/buch-([a-z0-9-]+)\.js"><\/script>/g;
const DICT = new RegExp('<script src="\\.\\./\\.\\./js/buch-' + LANG + '/([a-z0-9-]+)\\.js"></script>', 'g');
const NOT_WIDGETS = new Set(['en', 'es', 'druck']);

// the widgets of every module: W('name', …) up to its closing bracket; everything outside them are the helpers
const modules = {};
function moduleOf(name) {
    if (modules[name]) return modules[name];
    const file = ROOT + 'js/buch-' + name + '.js';
    const src = fs.existsSync(file) ? read(file) : '';
    const widgets = {};
    for (const m of src.matchAll(/^[ \t]*W\('([^']+)'/gm)) {
        const from = m.index + m[0].indexOf('(') + 1, { lits, end } = walk(src, from, src.length);
        widgets[m[1]] = { from, end, lits };
    }
    const inside = at => Object.values(widgets).some(w => at >= w.from && at < w.end);
    const helpers = walk(src, 0, src.length, true).lits.filter(l => !inside(l.at));
    return (modules[name] = { name, file, src, widgets, helpers });
}

// ---------- string literals of a piece of JavaScript ----------
// '…', "…" and the text parts of `…${…}…`; comments and regular expressions are skipped. The walk ends at the first
// closing bracket without its opening one (the end of W( … )) or, with whole, at the end of the source.
function walk(src, from, to, whole) {
    const out = [];
    let i = from, prev = '';
    const lineAt = k => src.slice(0, k).split('\n').length;
    const unescape = s => s.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (m, c) =>
        c[0] === 'u' && c.length > 1 ? String.fromCodePoint(parseInt(c.replace(/[u{}]/g, ''), 16)) :
        c[0] === 'x' && c.length === 3 ? String.fromCharCode(parseInt(c.slice(1), 16)) :
        ({ n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' })[c] ?? c);
    function template() {
        // i is just after the opening backtick
        let start = i, text = '';
        while (i < to) {
            const c = src[i];
            if (c === '\\') { text += src.slice(i, i + 2); i += 2; continue; }
            if (c === '`') { out.push({ s: unescape(text), line: lineAt(start), at: start }); i++; return; }
            if (c === '$' && src[i + 1] === '{') {
                out.push({ s: unescape(text), line: lineAt(start), at: start });
                i += 2; code(); i++; start = i; text = ''; continue;
            }
            text += c; i++;
        }
    }
    function code(top) {
        let depth = 0;
        while (i < to) {
            const c = src[i];
            if (c === '(' || c === '[' || c === '{') depth++;
            else if (c === ')' || c === ']' || c === '}') { if (depth === 0 && !top) return; depth--; }
            if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) i = to; continue; }
            if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 2; if (i < 2) i = to; continue; }
            if (c === '\'' || c === '"') {
                const start = i; let j = i + 1;
                while (j < to && src[j] !== c) { if (src[j] === '\\') j++; if (src[j] === '\n') break; j++; }
                out.push({ s: unescape(src.slice(i + 1, j)), line: lineAt(start), at: start });
                i = j + 1; prev = 'a'; continue;
            }
            if (c === '`') { i++; template(); prev = 'a'; continue; }
            if (c === '/' && (prev === '' || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev) || /\b(return|typeof|case)$/.test(src.slice(Math.max(0, i - 7), i).trimEnd()))) {
                // a regular expression: up to the closing slash outside a character class
                let j = i + 1, cls = false;
                while (j < to && src[j] !== '\n') {
                    if (src[j] === '\\') { j += 2; continue; }
                    if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false;
                    else if (src[j] === '/' && !cls) break;
                    j++;
                }
                i = j + 1; while (/[a-z]/.test(src[i] || '')) i++;
                prev = 'a'; continue;
            }
            if (!/\s/.test(c)) prev = c;
            i++;
        }
    }
    code(whole);
    return { lits: out, end: i };
}

// ---------- the translation, as an English page does it ----------
const engines = {};
function engine(dicts) {
    const key = dicts.join(',');
    if (engines[key]) return engines[key];
    class Node { } class Element extends Node { } class HTMLElement extends Element { }
    class HTMLInputElement extends HTMLElement { } class HTMLTextAreaElement extends HTMLElement { } class CanvasRenderingContext2D { }
    const ctx = { document: { documentElement: { lang: LANG } }, location: { search: '' }, console, URLSearchParams,
        Node, Element, HTMLElement, HTMLInputElement, HTMLTextAreaElement, CanvasRenderingContext2D };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(read(ROOT + 'js/buch-' + LANG + '.js'), ctx, { filename: 'buch-' + LANG + '.js' });
    for (const d of dicts) {
        const f = ROOT + 'js/buch-' + LANG + '/' + d + '.js';
        if (fs.existsSync(f)) vm.runInContext(read(f), ctx, { filename: 'buch-' + LANG + '/' + d + '.js' });
    }
    return (engines[key] = LANG === 'en' ? ctx.BuchEN : ctx.BuchES);
}

// what counts as German: umlauts, frequent small words, typical words of the widgets - outside of tags and maths
const GERMAN = /[äöüÄÖÜß]|\b(der|die|das|den|dem|des|und|oder|nicht|ist|sind|mit|von|für|auf|ein|eine|einer|wird|zum|zur|bei|wie|auch|noch|nach|aus|im|am|vom|kein|keine|Lösung|Aufgabe|Ergebnis|Zeile|Schritt|Funktion|Gerade|Seite|Zurück|Neue|Neuer|Anzahl|Summe|Wahrscheinlichkeit|Punkt|Punkte|Wähle|Klick|Klicke|Zeige|Ziehe|Würfel|Treffer|Versuch|Versuche|richtig|falsch|Nullstelle|Steigung|Fläche|Höhe|Breite|Länge|Winkel|Kreis|Dreieck|Schritte|Tage|Jahre)\b/;
// the words a reader sees: tags out (their title, aria-label, placeholder, alt stay), TeX commands out, maths out -
// but "$ und $" is not maths, a dollar pair counts as maths only without a word of three letters inside
const visible = s => s.replace(/<[^>]*>/g, t => ' ' + [...t.matchAll(/\s(?:title|aria-label|placeholder|alt)="([^"]*)"/g)].map(m => m[1]).join(' ') + ' ')
    .replace(/\\[a-zA-Z]+/g, ' ').replace(/\$([^$]*)\$/g, (m, x) => /[A-Za-zÄÖÜäöüß]{3}/.test(x) ? ' ' + x + ' ' : ' ')
    .replace(/&[a-z]+;/g, ' ');
// a word the translation left as it was and that is no English word (macOS /usr/share/dict/words) is German as well:
// "richtig – weiter so" → "correct – weiter so". Names and code words that stay are English enough: SAFE, and every
// word of the English dictionaries.
// Spanish: the words of /usr/share/dict/spanish if there is one; else none, and only the Spanish dictionaries count
const WORDLIST = LANG === 'en' ? '/usr/share/dict/words' : '/usr/share/dict/spanish';
const ENGLISH = fs.existsSync(WORDLIST) ? new Set(read(WORDLIST).toLowerCase().split('\n')) : LANG === 'en' ? null : new Set();
const SAFE = new Set('orbitron raleway rgba hsla svg viewbox katex px em rem nbsp xmidymid pagerank anscombe dresden gauss jordan monty hall use strict'.split(' '));
function englishWords(B) {
    const set = new Set();
    const add = v => String(v).toLowerCase().split(/[^a-zäöüßáéíóúñ]+/).forEach(w => w && set.add(w));
    for (const d of B.dicts) { Object.values(d.word).forEach(add); d.phrase.forEach(([, en]) => add(en)); }
    return set;
}
let EN_WORDS = null;
// code, not words: attributes, CSS, colours, selectors, TeX left over from a cut formula
const CODE = /="|[{};|]|:\S|\brgba?\(|#[0-9a-fA-F]{3}|\dpx|\[data-/;
function looksGerman(r, s) {
    const v = visible(r);
    if (GERMAN.test(v)) return true;
    if (!ENGLISH || CODE.test(v)) return false;
    // Spanish: accented letters belong to the word ("están" is not "est" + "n", and "est" is found in "gestrichelt")
    const words = v.match(LANG === 'es' ? /[A-Za-zÄÖÜäöüßÁÉÍÓÚÑáéíóúñ]{3,}/g : /[A-Za-zÄÖÜäöüß]{3,}/g) || [];
    // one lowercase word on its own is a key, a class or a value inside the widget ("wurf", "b-ctrls", "oben"), not text
    if (words.length < 2 && !/[A-ZÄÖÜ]/.test(v)) return false;
    // one identifier: "baum-hero", "AnB", "b_go"
    if (/^\s*[A-Za-z][A-Za-z0-9_-]*\s*$/.test(v) && /[-_0-9]|.[A-Z]/.test(v.trim())) return false;
    return words.some(w => {
        const l = w.toLowerCase();
        return s.includes(w) && !ENGLISH.has(l) && !SAFE.has(l) && !EN_WORDS.has(l) && !/^[a-z]+[A-Z]/.test(w);
    });
}

// ---------- run ----------
const known = fs.existsSync(KNOWN) ? JSON.parse(read(KNOWN)) : {};
const found = {};          // module → Set of strings that still look German (for --accept)
let nPages = 0, nWidgets = 0;
const reported = new Set();
const usedDicts = new Set();

EN_WORDS = englishWords(engine(fs.readdirSync(ROOT + 'js/buch-' + LANG).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)).sort()));
for (const book of BOOKS) {
    const enDir = ROOT + 'buch/' + book + '/', deDir = ROOT + 'buch/' + book.replace(new RegExp('-' + LANG + '$'), '') + '/';
    if (!fs.existsSync(enDir)) { bad(book, 'no such book'); continue; }
    const pages = fs.readdirSync(enDir).filter(f => f.endsWith('.html')).sort();
    for (const page of pages) {
        nPages++;
        const where = book + '/' + page;
        const en = read(enDir + page);
        if (!en.includes('<html lang="' + LANG + '"')) bad(where, 'is not <html lang="' + LANG + '">');
        // 1. answers and structure
        if (!fs.existsSync(deDir + page)) bad(where, 'has no German twin ' + path.relative(ROOT, deDir + page));
        else {
            const de = read(deDir + page);
            const a = attrs(de), b = attrs(en);
            for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
                const x = a[k] || [], y = b[k] || [];
                if (x.length !== y.length) { bad(where, k + ': ' + x.length + ' in German, ' + y.length + ' in ' + NAME); continue; }
                x.forEach((v, i) => { if (v !== y[i]) bad(where, k + ' #' + (i + 1) + ': German "' + v + '" · ' + NAME + ' "' + y[i] + '"'); });
            }
            // 2. scripts
            const mods = s => [...s.matchAll(MODULE)].map(m => m[1]).filter(m => !NOT_WIDGETS.has(m));
            const dm = mods(de), em = mods(en);
            dm.filter(m => !em.includes(m)).forEach(m => bad(where, 'loads no js/buch-' + m + '.js (the German page does)'));
            em.filter(m => !dm.includes(m)).forEach(m => bad(where, 'loads js/buch-' + m + '.js, the German page does not'));
        }
        if (!new RegExp('js/buch-' + LANG + '\\.js"></script>\\s*<script src="\\.\\./\\.\\./js/buch\\.js">').test(en) && /js\/buch\.js"/.test(en))
            bad(where, 'js/buch-' + LANG + '.js must come right before js/buch.js');
        const em = [...en.matchAll(MODULE)].map(m => m[1]).filter(m => !NOT_WIDGETS.has(m));
        const dicts = [...en.matchAll(DICT)].map(m => m[1]);
        for (const m of em) {
            if (!Object.keys(moduleOf(m).widgets).length) continue;          // no widgets, nothing to translate (buch-plot.js)
            if (!fs.existsSync(ROOT + 'js/buch-' + LANG + '/' + m + '.js')) { bad(where, 'there is no dictionary js/buch-' + LANG + '/' + m + '.js'); continue; }
            if (!new RegExp('js/buch-' + m + '\\.js"></script>\\s*<script src="\\.\\./\\.\\./js/buch-' + LANG + '/' + m + '\\.js">').test(en))
                bad(where, 'js/buch-' + LANG + '/' + m + '.js must come right after js/buch-' + m + '.js');
        }
        dicts.forEach(d => usedDicts.add(d));
        // 3. sentences of the widgets on this page
        const BuchEN = engine(dicts);
        const names = [...new Set([...en.matchAll(/data-widget="([^"]+)"/g)].map(m => m[1]))];
        for (const w of names) {
            const mod = em.map(moduleOf).find(m => m.widgets[w]);
            if (!mod) { bad(where, 'widget ' + w + ' is in none of the modules the page loads'); continue; }
            nWidgets++;
            // the widget itself, and the helpers of its module (code outside every widget), each with their own known strings
            for (const [key, lits] of [[mod.name + '/' + w, mod.widgets[w].lits], [mod.name + '/*', mod.helpers]]) {
                for (const { s, line } of lits) {
                    if (!/[A-Za-zÄÖÜäöüß]{2}/.test(s)) continue;
                    const r = BuchEN.tr(s);
                    if (!looksGerman(r, s)) continue;
                    (found[key] = found[key] || new Set()).add(s);
                    if ((known[key] || []).includes(s) || reported.has(key + s)) continue;
                    reported.add(key + s);
                    bad(key + ' (js/buch-' + mod.name + '.js:' + line + ')', 'still German: "' + s.slice(0, 140) + '"' + (r !== s ? ' → "' + r.slice(0, 140) + '"' : ''));
                }
            }
        }
    }
}

// 4. two dictionaries, one German word, two different translations
{
    const files = fs.readdirSync(ROOT + 'js/buch-' + LANG).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)).sort();
    const B = engine(files);
    const word = {}, phrase = {};
    for (const d of B.dicts) {
        for (const [k, v] of Object.entries(d.word)) { if (k in word && word[k][1] !== v) bad('js/buch-' + LANG + '/' + d.name + '.js', 'word "' + k + '": "' + v + '", but ' + word[k][0] + ' says "' + word[k][1] + '"'); else word[k] = [d.name, v]; }
        for (const [k, v] of d.phrase) { if (k in phrase && phrase[k][1] !== v) bad('js/buch-' + LANG + '/' + d.name + '.js', 'phrase "' + k + '": "' + v + '", but ' + phrase[k][0] + ' says "' + phrase[k][1] + '"'); else phrase[k] = [d.name, v]; }
    }
}

if (accept) {
    // with books named, the strings of these books are added to known.json and everything else stays (two agents
    // translating two books at the same time must not delete each other's entries); without, known.json is written anew
    const out = {};
    const base = books.length ? known : {};
    [...new Set([...Object.keys(base), ...Object.keys(found)])].sort()
        .forEach(m => { out[m] = [...new Set([...(base[m] || []), ...(found[m] || [])])].sort(); });
    fs.writeFileSync(KNOWN, JSON.stringify(out, null, 1) + '\n');
    console.log('known.json: ' + Object.entries(out).map(([m, l]) => m + ' ' + l.length).join(', '));
    const rest = problems.filter(p => !/still German/.test(p));
    rest.forEach(p => console.log('✗ ' + p));
    process.exit(rest.length ? 1 : 0);
}
problems.forEach(p => console.log('✗ ' + p));
console.log((problems.length ? '✗ ' + problems.length + ' problem' + (problems.length > 1 ? 's' : '') : '✓ ok') + ' · ' +
    BOOKS.join(', ') + ': ' + nPages + ' pages, ' + nWidgets + ' widgets, dictionaries ' + [...usedDicts].sort().join(', '));
process.exit(problems.length ? 1 : 0);
