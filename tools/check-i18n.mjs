#!/usr/bin/env node
/**
 * check-i18n.mjs — guard for the Cyber-Labor translation files.
 *
 * Checks (all 9 languages: de en es fr it nl pt sw tr):
 *   1. Every active lab in HTML/js/labs-config.js has a card translation
 *      (title + description) in HTML/js/i18n-index.js — and none is empty.
 *   2. Orphaned card translations (lab id no longer in LABS_DATA) are reported.
 *   3. Suspect copies: a non-DE card whose description is byte-identical to DE.
 *   4. Base dictionaries i18n-<lang>.js have the exact same key set as DE.
 *
 * Usage:  node tools/check-i18n.mjs        (exit 1 on findings, one line per finding)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const JS = join(dirname(fileURLToPath(import.meta.url)), '..', 'HTML', 'js');
const LANGS = ['de', 'en', 'es', 'fr', 'it', 'nl', 'pt', 'sw', 'tr'];
const read = (f) => readFileSync(join(JS, f), 'utf8');

// Minimal browser stubs so the plain <script>-style files run under vm
const ctx = { console };
ctx.window = ctx;
ctx.document = {
    documentElement: { getAttribute: () => null, setAttribute() {}, classList: { add() {} } },
    querySelector: () => null,
    createElement: () => ({ setAttribute() {} }),
    head: { insertBefore() {} },
};
ctx.addEventListener = () => {};
ctx.localStorage = { getItem: () => null, setItem() {} };
ctx.location = { search: '' };
ctx.URLSearchParams = URLSearchParams;
ctx.requestAnimationFrame = () => {};
vm.createContext(ctx);

const run = (f, extra = '') => vm.runInContext(read(f) + extra, ctx, { filename: f });

ctx.LAB_ICONS = new Proxy({}, { get: () => '' }); // icons irrelevant here
const labs = run('labs-config.js', '\nLABS_DATA;');
// top-level `const CyberI18n` stays script-local under vm — capture it into the shared context
ctx.CyberI18n = run('i18n.js', '\nCyberI18n;');
for (const l of LANGS) run(`i18n-${l}.js`);
run('i18n-index.js');

const T = ctx.CyberI18n.translations;
const ids = labs.map((l) => l.id);
// Labs commented out in labs-config.js whose translations are deliberately kept (re-activation planned):
const PARKED = ['happy-birthday-ulf', 'imaginarynumbers'];
const findings = [];

// --- 1..3: lab cards in i18n-index.js ---
for (const lang of LANGS) {
    const cards = T[lang]?.index?.labs ?? {};
    for (const id of ids) {
        const c = cards[id];
        if (!c) findings.push(`${lang}: Karte FEHLT: ${id}`);
        else if (!c.title || !c.description) findings.push(`${lang}: Karte LEER: ${id}`);
        else if (lang !== 'de' && c.description === T.de.index.labs[id]?.description)
            findings.push(`${lang}: Karte = DE-Kopie: ${id}`);
    }
    for (const id of Object.keys(cards))
        if (!ids.includes(id) && !PARKED.includes(id)) findings.push(`${lang}: Karte VERWAIST (Lab inaktiv/geloescht): ${id}`);
}

// --- 4: key parity of the base dictionaries ---
const flat = (o, p = '') =>
    Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [`${p}${k}`]);
const base = new Set(flat(T.de).filter((k) => !k.startsWith('index.')));
for (const lang of LANGS.slice(1)) {
    const cur = new Set(flat(T[lang]).filter((k) => !k.startsWith('index.')));
    for (const k of base) if (!cur.has(k)) findings.push(`${lang}: Basis-Key fehlt: ${k}`);
    for (const k of cur) if (!base.has(k)) findings.push(`${lang}: Basis-Key zu viel (nicht in DE): ${k}`);
}

if (findings.length) {
    for (const f of findings) console.log('✗ ' + f);
    console.log(`\n${findings.length} Befund(e) — ${ids.length} aktive Labs, ${LANGS.length} Sprachen.`);
    process.exit(1);
}
console.log(`✓ i18n vollstaendig: ${ids.length} Labs x ${LANGS.length} Sprachen, Basis-Woerterbuecher deckungsgleich (${base.size} Keys).`);
