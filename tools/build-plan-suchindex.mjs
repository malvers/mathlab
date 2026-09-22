/**
 * build-plan-suchindex.mjs — builds HTML/svp/plan-suchindex.json
 *
 * The search line under the ticker (HTML/svp/svp-suche.js) looks through ALL
 * plans at once. It cannot read the plans themselves: every plan page carries
 * its weeks as a JS literal (`window.PLAN = [ { nr: 1, kw: 34, … } ]`, with
 * unquoted keys), and a literal like that is not JSON - only a JS engine can
 * read it. So it is read HERE, once, and written out as JSON.
 *
 * What this index is NOT: the current state of a plan. Everything Doc changes
 * in the browser - topic, material, bullets - lives in the cloud table
 * svp_plan_edits and is fetched live by the search, keyed by the row index `i`
 * that every week carries here. Static plan -> index, living plan -> cloud.
 * That is why this file may age quietly: it only has to be rebuilt when a plan
 * HTML itself changes.
 *
 * Run:  node tools/build-plan-suchindex.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SVP = path.join(HERE, '..', 'HTML', 'svp');
const OUT = path.join(SVP, 'plan-suchindex.json');

/* The list of pages - and their short labels for the hit list - comes from the
   quick-nav, which is the one place where every svp page is written down. Which
   of them is a PLAN is decided by the file itself: it has a window.PLAN. */
const NAV_RE = /\[\s*'([^']+\.html[^']*)',\s*'([^']*)',\s*'[^']*',\s*'([^']*)'\s*\]/g;
const nav = fs.readFileSync(path.join(SVP, 'svp-nav.js'), 'utf8');
const seiten = [];
for (const m of nav.matchAll(NAV_RE)) {
    const href = m[1];
    if (href.includes('?') || href.startsWith('..')) continue;
    if (seiten.some(s => s.href === href)) continue;
    seiten.push({ href: href, kurz: m[2], lang: m[3] });
}

/* The literal from `window.PLAN = [` to its closing bracket. Counted, not
   matched by a regex: the entries hold brackets, apostrophes ("Fahrplan durch
   Kl. 11") and comments of their own, and each of those would end a lazy
   regex in the wrong place. */
function planLiteral(src, name, auf) {
    const start = src.indexOf(name || 'window.PLAN');
    if (start < 0) return null;
    const open = src.indexOf(auf || '[', start);
    if (open < 0) return null;
    let tiefe = 0, quote = null;
    for (let i = open; i < src.length; i++) {
        const c = src[i], n = src[i + 1];
        if (quote) {
            if (c === '\\') { i++; continue; }
            if (c === quote) quote = null;
            continue;
        }
        if (c === '\'' || c === '"' || c === '`') { quote = c; continue; }
        if (c === '/' && n === '/') { i = src.indexOf('\n', i); if (i < 0) return null; continue; }
        if (c === '/' && n === '*') { i = src.indexOf('*/', i); if (i < 0) return null; i++; continue; }
        if (c === '[' || c === '{') tiefe++;
        else if (c === ']' || c === '}') { tiefe--; if (!tiefe) return src.slice(open, i + 1); }
    }
    return null;
}

/* Only what the plan SHOWS is searched, so only that is written down: the
   week's numbers, its Bereich, the topic, the bullets of the sub-row and the
   material line. mth/med stay out - they appear in the Fahrplan sheet, not in
   the plan, and the local search does not see them either. */
function woche(row, i, badge) {
    if (!row) return null;
    const w = { i: i };
    /* Der Bereich steht im Plan als Pille - und zwar mit der Beschriftung aus
       window.BADGE ("LB 1", "ORGA"), nicht als Schluessel ("lb1"). Gesucht wird,
       was man SIEHT: sonst findet "LB 1" hier nichts und in der Seite alles. */
    const b = badge && row.type ? badge[row.type] : null;
    if (b && b[1]) w.bereich = b[1];   /* Stand des Plans; die Cloud kann den Typ aendern */
    if (row.nr) w.nr = row.nr;
    if (row.kw) w.kw = row.kw;
    if (row.date) w.datum = row.date;
    if (row.type) w.typ = row.type;
    if (row.u) w.u = String(row.u);
    if (row.topic) w.thema = row.topic;
    if (row.ferien) w.ferien = row.ferien;
    if (Array.isArray(row.details) && row.details.length) w.punkte = row.details;
    if (row.material) w.material = row.material;
    return w;
}

const plaene = [];
let wochen = 0;
for (const s of seiten) {
    const datei = path.join(SVP, s.href);
    if (!fs.existsSync(datei)) continue;
    const src = fs.readFileSync(datei, 'utf8');
    const lit = planLiteral(src);
    if (!lit) continue;   /* keine Planseite */
    let rows;
    try { rows = vm.runInNewContext('(' + lit + ')'); }
    catch (e) { console.error(s.href + ': PLAN nicht lesbar - ' + e.message); continue; }
    if (!Array.isArray(rows) || !rows.length) continue;
    let badge = null;
    const bLit = planLiteral(src, 'window.BADGE', '{');
    if (bLit) { try { badge = vm.runInNewContext('(' + bLit + ')'); } catch (e) { badge = null; } }
    const list = rows.map(function (r, i) { return woche(r, i, badge); }).filter(Boolean);
    wochen += list.length;
    /* Die ganze Beschriftungstabelle wandert mit: aendert die Cloud den Typ einer
       Woche, muss die Suche die neue Pille benennen koennen - und window.BADGE
       der gerade offenen Seite gilt nur fuer DIESEN Plan. */
    const labels = {};
    if (badge) Object.keys(badge).forEach(function (k) { if (badge[k] && badge[k][1]) labels[k] = badge[k][1]; });
    plaene.push({ href: s.href, kurz: s.kurz, lang: s.lang, marken: labels, wochen: list });
    console.log(s.kurz.padEnd(8) + s.href.padEnd(32) + list.length + ' Wochen');
}

/* Eine Woche pro Zeile: so bleibt der git-Diff lesbar, wenn Doc eine Zeile im
   Plan aendert - JSON.stringify mit Einrueckung blaeht die Datei auf das
   Dreifache, ohne dass man mehr sieht. */
const teile = plaene.map(p => '  {\n'
    + '   "href": ' + JSON.stringify(p.href) + ',\n'
    + '   "kurz": ' + JSON.stringify(p.kurz) + ',\n'
    + '   "lang": ' + JSON.stringify(p.lang) + ',\n'
    + '   "marken": ' + JSON.stringify(p.marken) + ',\n'
    + '   "wochen": [\n'
    + p.wochen.map(w => '    ' + JSON.stringify(w)).join(',\n')
    + '\n   ]\n  }');
fs.writeFileSync(OUT, '{\n "gebaut": ' + JSON.stringify(new Date().toISOString().slice(0, 10))
    + ',\n "plaene": [\n' + teile.join(',\n') + '\n ]\n}\n');
console.log('\n' + plaene.length + ' Plaene, ' + wochen + ' Wochen -> '
    + path.relative(path.join(HERE, '..'), OUT) + ' ('
    + Math.round(fs.statSync(OUT).size / 1024) + ' KB)');
