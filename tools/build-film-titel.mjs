/**
 * build-film-titel.mjs — builds HTML/svp/film-titel.json
 *
 * Ein Film in der Materialzeile ist nur unter dem Etikett auffindbar, das Doc
 * getippt hat. Der ECHTE Titel steht bei YouTube: die Pille "Enigma gebrochen"
 * heisst dort "The Most Important Decryption Machine Ever Built", die Pille
 * 'Der Film "Her"' ist "Her Official Trailer #1 (2013) …". Doc, 22.09.2026:
 * "Game wird nur einmal gefunden (nicht das)" - genau daran lag es.
 *
 * Deshalb werden die Titel HIER geholt und nicht im Browser: sonst pingte
 * jeder Schuelerbrowser bei jeder Suche YouTube an. So spricht nur diese
 * Maschine einmal mit YouTube, die Seite liest danach eine kleine Datei.
 * Gebraucht wird kein Schluessel - die oEmbed-Schnittstelle ist oeffentlich.
 *
 * Quellen der Film-Adressen: der gebaute Plan-Stand (plan-suchindex.json) und
 * die Cloud (svp_plan_edits, anon lesbar - derselbe Lesezugriff, den jede
 * Planseite macht).
 *
 * Run:  node tools/build-film-titel.mjs [--force]
 *       ohne --force werden nur unbekannte Filme geholt.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SVP = path.join(HERE, '..', 'HTML', 'svp');
const OUT = path.join(SVP, 'film-titel.json');
const force = process.argv.includes('--force');

/* Die Zugangsdaten stehen in svp-auth.js - der anon-Schluessel ist der
   oeffentliche Lese-Schluessel der Seite, kein Geheimnis. */
const auth = fs.readFileSync(path.join(SVP, 'svp-auth.js'), 'utf8');
const DB_URL = (auth.match(/DB_URL = '([^']+)'/) || [])[1];
const DB_KEY = (auth.match(/DB_KEY = '([^']+)'/) || [])[1];

/* Die Kennung eines Films - youtu.be/<id> und youtube.com/watch?v=<id>
   fuehren auf dasselbe Video, also auch auf denselben Titel. */
function filmId(u) {
    let m = String(u).match(/youtu\.be\/([\w-]{6,})/i);
    if (m) return m[1];
    m = String(u).match(/[?&]v=([\w-]{6,})/i);
    if (m) return m[1];
    return '';
}

function ausMaterial(text, raus) {
    (String(text || '').match(/https?:\/\/\S+/g) || []).forEach(function (u) {
        const id = filmId(u.replace(/[),.;]+$/, ''));
        if (id) raus.add(id);
    });
}

const ids = new Set();

/* 1. der gebaute Plan-Stand */
const idxDatei = path.join(SVP, 'plan-suchindex.json');
if (fs.existsSync(idxDatei)) {
    const idx = JSON.parse(fs.readFileSync(idxDatei, 'utf8'));
    idx.plaene.forEach(p => p.wochen.forEach(w => ausMaterial(w.material, ids)));
}

/* 2. die Cloud - dort steht, was Doc im Browser eingetragen hat */
if (DB_URL && DB_KEY) {
    const res = await fetch(DB_URL + '/rest/v1/svp_plan_edits?select=page,edits',
        { headers: { apikey: DB_KEY, Authorization: 'Bearer ' + DB_KEY } });
    if (res.ok) {
        const rows = await res.json();
        rows.forEach(function (r) {
            Object.values(r.edits || {}).forEach(function (e) {
                if (e && typeof e === 'object') ausMaterial(e.material, ids);
            });
        });
        console.log(rows.length + ' Cloud-Zeilen gelesen');
    } else {
        console.error('Cloud nicht lesbar (' + res.status + ') - nur der Plan-Stand');
    }
}

const alt = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { filme: {} };
const neu = force ? {} : Object.assign({}, alt.filme || {});
const offen = [...ids].filter(id => !neu[id]);
console.log(ids.size + ' Filme verlinkt, ' + offen.length + ' noch ohne Titel');

/* Hoeflich der Reihe nach, nicht alle auf einmal: es sind ein paar Dutzend,
   und ein Schwall gleichzeitiger Anfragen ist bei YouTube der schnellste Weg
   zu einer Abfuhr. */
let geholt = 0, futsch = 0;
for (const id of offen) {
    const ziel = 'https://www.youtube.com/oembed?url='
        + encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json';
    try {
        const r = await fetch(ziel, { signal: AbortSignal.timeout(15000) });
        if (!r.ok) { futsch++; console.log('  ' + id + ': HTTP ' + r.status); continue; }
        const d = await r.json();
        neu[id] = { titel: d.title || '', kanal: d.author_name || '' };
        geholt++;
        console.log('  ' + id + ': ' + (d.author_name ? d.author_name + ' — ' : '') + (d.title || ''));
    } catch (e) { futsch++; console.log('  ' + id + ': ' + e.message); }
    await new Promise(r => setTimeout(r, 120));
}

/* Ein Film pro Zeile, nach Kennung sortiert: so zeigt der git-Diff genau den
   einen Film, der dazugekommen ist. */
const keys = Object.keys(neu).sort();
fs.writeFileSync(OUT, '{\n "gebaut": ' + JSON.stringify(new Date().toISOString().slice(0, 10))
    + ',\n "filme": {\n'
    + keys.map(k => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(neu[k])).join(',\n')
    + '\n }\n}\n');
console.log('\n' + geholt + ' neu geholt, ' + futsch + ' nicht erreichbar, '
    + keys.length + ' Titel insgesamt -> ' + path.relative(path.join(HERE, '..'), OUT)
    + ' (' + Math.round(fs.statSync(OUT).size / 1024) + ' KB)');
