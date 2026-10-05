// Loads the task files as vorrechnen.html lists them (plus extra files given), renders every formula of the
// blocks that carry a week (or the ones named) with KaTeX 0.16.8 strictly, and writes them as JSON for pruef.py.
// usage: node bloecke.mjs out.json [kw ...]   (then: python3 pruef.py out.json) - or both at once: ./pruefe.sh [kw ...]
import fs from 'fs';
import vm from 'vm';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WURZEL = new URL('../../HTML/', import.meta.url).pathname;
const katex = require(WURZEL + 'morpheus/vendor/katex/katex.min.js');
const html = fs.readFileSync(WURZEL + 'vorrechnen.html', 'utf8');
const dateien = [...html.matchAll(/<script\s+src="(js\/vorrechnen-aufgaben[\w-]*\.js)"/g)].map(m => m[1]);
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(WURZEL + 'js/formel-satz.js', 'utf8'), ctx);
vm.runInContext(dateien.map(d => fs.readFileSync(WURZEL + d, 'utf8')).join('\n;\n') +
    '\n;this.R = { AUFGABEN, BLOECKE, LOESUNGEN, ERKLAERUNGEN, TEXTE, KOEPFE };', ctx);
const { AUFGABEN, BLOECKE, LOESUNGEN, ERKLAERUNGEN, TEXTE, KOEPFE } = ctx.R;
let ohneText = 0;
const wochen = process.argv.slice(3).map(Number);
const fehler = [];
const satz = (tex, wo) => {
    try { katex.renderToString(ctx.alsDisplay(tex), { throwOnError: true, strict: 'error' }); }
    catch (e) { fehler.push(wo + ': ' + e.message.split('\n')[0] + '  [' + tex + ']'); }
};
const raus = [];
BLOECKE.forEach(b => {
    if (b.kw == null || (wochen.length && !wochen.includes(b.kw))) return;
    const block = { titel: b.titel, kw: b.kw, kopf: b.kopf || null, aufgaben: [] };
    for (let i = b.ab; i < b.bis; i++) {
        const [slug, latex, nach] = AUFGABEN[i];
        const l = LOESUNGEN[slug];
        if (!l) fehler.push(slug + ': keine Lösung');
        satz(latex, slug + ' Aufgabe');
        (l || []).forEach(([st, op], k) => { satz(st, slug + ' Schritt ' + (k + 1)); if (op) satz(op, slug + ' Op ' + (k + 1)); });
        const erk = ERKLAERUNGEN[slug];
        if (erk) (erk.match(/\$\$?[^$]+\$\$?/g) || []).forEach(f => satz(f.replace(/^\$+|\$+$/g, '').split(' | ')[0], slug + ' Erklärung'));
        if (!TEXTE[slug]) ohneText++;
        block.aufgaben.push({ slug, latex, nach, kopf: KOEPFE[slug] || b.kopf || null, schritte: (l || []).map(s => s[0]), ops: (l || []).map(s => s[1]) });
    }
    raus.push(block);
});
const slugs = AUFGABEN.map(a => a[0]);
slugs.forEach((s, i) => { if (slugs.indexOf(s) !== i) fehler.push('doppelter Slug: ' + s); });
Object.keys(TEXTE).forEach(k => { if (!slugs.includes(k)) fehler.push('Text ohne Aufgabe: ' + k); });
Object.keys(LOESUNGEN).forEach(k => { if (!slugs.includes(k)) fehler.push('Lösung ohne Aufgabe: ' + k); });
Object.keys(ERKLAERUNGEN).forEach(k => { if (!slugs.includes(k)) fehler.push('Erklärung ohne Aufgabe: ' + k); });
Object.keys(KOEPFE).forEach(k => { if (!slugs.includes(k)) fehler.push('Kopf ohne Aufgabe: ' + k); });
fs.writeFileSync(process.argv[2], JSON.stringify(raus, null, 1));
console.log('Blöcke:', raus.map(b => 'KW' + b.kw + ' ' + b.aufgaben.length).join(', '));
console.log('KaTeX/Format-Fehler:', fehler.length, '· Aufgaben ohne Text:', ohneText);
fehler.forEach(f => console.log('  ' + f));
