/**
 * build-labs-terms.mjs — builds HTML/js/labs-terms.js
 *
 * Harvests the terms that actually appear inside every lab (solid names, shape
 * catalogues, control labels, chapter headings, i18n strings) so the hub search
 * on index.html / tools.html finds a lab by any word it contains — "Würfel"
 * finds Körper, "Glider" finds Game of Life, "Bagdad" finds the world clock.
 *
 * Sources per lab: its own HTML (visible control/heading text), the lab-specific
 * JS it loads (catalogue literals like `name: 'Würfel (Hexaeder)'`), inline
 * i18n fallbacks (`getOr('key', 'Deutscher Text')`) and every German i18n key
 * the lab uses — including whole namespaces behind a `T('…')` helper.
 *
 * Run:  node tools/build-labs-terms.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', 'HTML');
const OUT = path.join(ROOT, 'js', 'labs-terms.js');

// ---------------------------------------------------------------- i18n (de)
/** German translation table as a flat "ns.key" -> string map. */
function flatI18n(lang) {
    const ctx = { CyberI18n: { translations: {} } };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(ROOT, `js/i18n-${lang}.js`), 'utf8'), ctx);
    const flat = {};
    (function walk(node, prefix) {
        for (const k of Object.keys(node || {})) {
            const v = node[k];
            const key = prefix ? prefix + '.' + k : k;
            if (v && typeof v === 'object') walk(v, key);
            else if (typeof v === 'string') flat[key] = v;
        }
    })(ctx.CyberI18n.translations[lang], '');
    return flat;
}
const I18N = flatI18n('de');

// ---------------------------------------------------------------- lab list
const cfg = fs.readFileSync(path.join(ROOT, 'js/labs-config.js'), 'utf8');
const LABS = [...cfg.matchAll(/"id":\s*"([^"]+)",\s*\n\s*"href":\s*"([^"]+)"/g)]
    .map(m => ({ id: m[1], href: m[2] }));

/** Shared modules — their strings belong to every lab, so they say nothing about one. */
const SHARED = /^(branding|i18n|ui\.js|cyber-|main\.js|guard|events|config\.js|labs-|app-update|debug-window|photo-|supa-|solita-|quiz-|coach-|chat-|TS\.js|color-gradient|forloop-canvas|radial-menu|rain-|track-|explanations|app\.js)/;

/** Chrome that appears in many labs and would only pad the drop-down. */
const STOP = new Set([
    'ein labor adoptieren!', 'labor reset', 'labor zurücksetzen', 'view reset', 'reset view',
    'ansicht reset', 'ansicht zurücksetzen', 'reset', 'start', 'stop', 'stopp', 'play', 'pause',
    'weiter', 'zurück', 'vor', 'schritt', 'hilfe', 'info', 'close', 'schliessen', 'schließen',
    'abbrechen', 'neu', 'löschen', 'speichern', 'laden', 'export', 'import', 'einstellungen',
    'parameter', 'werte', 'optionen', 'anzeige', 'ansicht', 'menü', 'menü umschalten', 'vollbild',
    'sprache', 'tasten', 'tastatur', 'tastatur/maus', 'legende', 'steuerung', 'gitter an',
    'gitter anzeigen', 'achsen an', 'achsen anzeigen', 'achsenbeschriftung', 'koordinaten',
    'beschreibung der schritte', 'drehbuch', 'doc alvers mathe-labor', 'zum index', 'mac-app',
    'im browser', 'android-app', 'no folder', 'help', 'bereit', 'anwenden', 'beispiel',
    'labor-steuerung', 'e-mail', 'analytik', 'analyse', 'modus', 'variante', 'kapitel',
    'auto-rotation', 'beschriftung', 'geschwindigkeit', 'tempo', 'zufall', 'normal', 'gleich',
]);

const ENTITIES = {
    auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß',
    amp: '&', nbsp: ' ', shy: '', quot: '"', apos: '\'', deg: '°', times: '×', minus: '−',
};
const decode = s => s
    .replace(/&#(\d+);?/g, (_, d) => String.fromCharCode(+d))
    .replace(/&([a-zA-Z]+);?/g, (m, n) => (n in ENTITIES ? ENTITIES[n] : m));

const clean = s => decode(s)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\s\-–—•·*:,.]+|[\s\-–—•·*:,;.]+$/g, '')
    .trim();

/** A term is worth indexing when it reads like a word, not like code or chrome. */
function usable(s) {
    if (!s) return false;
    if (s.length < 3 || s.length > 46) return false;
    if (/[<>{}$=\\|#@`]/.test(s)) return false;                 // code fragments
    if (/\+|&[a-zA-Z]+;|\bfunction\b|\breturn\b|https?:/.test(s)) return false;
    if (/['"]/.test(s)) return false;                            // broken template literal
    if (!/^[\p{L}(\[]/u.test(s)) return false;                   // must start with a letter
    if (!/[A-Za-zÄÖÜäöüß]{3}/.test(s)) return false;
    if (STOP.has(s.toLowerCase())) return false;
    return true;
}

/** Lab-specific scripts a lab pulls in (shared modules filtered out). */
function localScripts(html, href) {
    const out = [];
    for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)) {
        const src = m[1].replace(/^\.\//, '');
        if (/^https?:|^\/\//.test(src)) continue;
        if (SHARED.test(path.basename(src))) continue;
        const p = path.join(ROOT, path.dirname(href), src);
        if (fs.existsSync(p)) out.push(p);
    }
    return out;
}

function termsFor(lab) {
    const file = path.join(ROOT, lab.href);
    if (!/\.html?$/i.test(lab.href) || !fs.existsSync(file)) return [];
    const html = fs.readFileSync(file, 'utf8');
    const bodies = [html, ...localScripts(html, lab.href).map(p => fs.readFileSync(p, 'utf8'))];

    const terms = new Set();
    const add = raw => { const t = clean(raw); if (usable(t)) terms.add(t); };

    // Visible text of controls and headings
    for (const m of html.matchAll(/<(button|option|h1|h2|h3|h4|summary|legend|label|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
        add(m[2].replace(/<[^>]*>/g, ''));
    }

    for (const body of bodies) {
        // Catalogue and option literals: name: 'Würfel (Hexaeder)', "name":"Dreieckige Kuppel"
        for (const m of body.matchAll(/["']?\b(?:name|label|title|caption)\b["']?\s*:\s*(['"])((?:(?!\1)[^\\\n])*)\1/g)) add(m[2]);
        // Card / slider / button headings built through CyberUI
        for (const m of body.matchAll(/create(?:Card|Slider|Button|Toggle|Checkbox)\s*\(\s*[^,()]+,\s*(['"])((?:(?!\1)[^\\\n])*)\1/g)) add(m[2]);
        // German fallbacks next to an i18n key
        for (const m of body.matchAll(/getOr\s*\(\s*['"][^'"]+['"]\s*,\s*(['"])((?:(?!\1)[^\\\n])*)\1/g)) add(m[2]);
        // i18n keys the lab uses
        for (const m of body.matchAll(/CyberI18n\.(?:get|getOr)\s*\(\s*['"]([a-zA-Z0-9_.-]+)['"]/g)) {
            if (I18N[m[1]]) add(I18N[m[1]]);
        }
        // Whole namespace behind a helper: const T = k => CyberI18n.get('ascii.' + k)
        for (const m of body.matchAll(/CyberI18n\.(?:get|getOr)\s*\(\s*['"]([a-zA-Z0-9_-]+)\.['"]\s*\+/g)) {
            const ns = m[1] + '.';
            for (const k of Object.keys(I18N)) if (k.startsWith(ns)) add(I18N[k]);
        }
    }
    return [...terms].sort((a, b) => a.localeCompare(b, 'de'));
}

const index = {};
let total = 0;
for (const lab of LABS) {
    const t = termsFor(lab);
    if (!t.length) continue;
    index[lab.id] = t;
    total += t.length;
}

const stamp = new Date().toISOString().slice(0, 10);
const lines = Object.keys(index).sort().map(id =>
    `    ${JSON.stringify(id)}: [${index[id].map(t => JSON.stringify(t)).join(', ')}]`
);

fs.writeFileSync(OUT, `/* @generated by tools/build-labs-terms.mjs — do not edit by hand. */
/**
 * Terms that live inside each lab — solid names, shape catalogues, control
 * labels, chapter headings, i18n strings. The hub search (js/labs-search.js)
 * matches against these so a lab is found by any word it contains.
 *
 * Rebuild after changing a lab's wording:  node tools/build-labs-terms.mjs
 * ${Object.keys(index).length} labs, ${total} terms, ${stamp}
 */
const LABS_TERMS = {
${lines.join(',\n')}
};

if (typeof module !== 'undefined' && module.exports) module.exports = { LABS_TERMS };
`, 'utf8');

console.log(`labs-terms.js: ${Object.keys(index).length} labs, ${total} terms -> ${path.relative(process.cwd(), OUT)}`);
