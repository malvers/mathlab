#!/usr/bin/env node
// Solita's short receipts on the phone after Doc spoke through DocCall - a different one each time, never the same
// twice in a row (Doc, 15.11.2026: "du sagst immer ich habe dich gehört, kann man das ein bisschen variieren" -
// "ein bisschen abwechslungsreicher machen, 10, 20 verschiedene Reaktionsmöglichkeiten"). Not "Angekommen": Doc did
// not want that one (08.11.2026).
//
// Each receipt is recorded once in Solita's voice (de-DE-Studio-C, the way ~/.claude/hooks/solita-ruf.mjs speaks)
// into ~/.claude/docruf/quittung/<first 12 hex of SHA-256 of the spoken text>.mp3, so the phone gets it at once and
// no answer costs a voice request. The Mithörer (docruf-mithoerer.mjs) picks one.
//
//     node quittungen.mjs --render       records the ones that are missing (needs network; one request every 5 s)
//     node quittungen.mjs --probe 40     40 picks as the Mithörer would make them, and whether each file is there
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// text: what the phone shows; say: what she speaks, where the voice needs it written differently
export const QUITTUNGEN = [
    { text: 'Ich habe dich gehört.' },
    { text: 'Alles klar, ist notiert.' },
    { text: 'Verstanden, ich kümmere mich.' },
    { text: 'Hab ich.' },
    { text: 'Ist bei mir.' },
    { text: 'Okay, kommt gleich.' },
    { text: 'Geht klar.' },
    { text: 'Bin dran.' },
    { text: 'Wird erledigt.' },
    { text: 'Klar und deutlich.' },
    { text: 'Läuft.' },
    { text: 'Schon unterwegs.' },
    { text: 'Sehr gern, ich mach das.' },
    { text: 'Mit Vergnügen.' },
    { text: 'Wird gemacht, Doc.', say: 'Wird gemacht, Dock.' },
    { text: 'Gehört und für gut befunden.' },
    { text: 'Notiert. Ich vergesse nichts.' },
    { text: 'Alles mitgeschrieben.' },
];

export const DIR = path.join(os.homedir(), '.claude/docruf/quittung');
const LAST = path.join(DIR, 'letzte.txt');

export function file(q) {
    return path.join(DIR, createHash('sha256').update(q.say || q.text, 'utf8').digest('hex').slice(0, 12) + '.mp3');
}

/** A receipt at random, never the one said last (remembered across restarts). */
export function pick(random = Math.random) {
    let last = '';
    try { last = fs.readFileSync(LAST, 'utf8').trim(); } catch { /* none yet */ }
    const choice = QUITTUNGEN.filter(q => q.text !== last);
    const q = choice[Math.floor(random() * choice.length)];
    try { fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(LAST, q.text); } catch { /* a repeat is no harm */ }
    return q;
}

async function render() {
    const src = fs.readFileSync('/Users/malvers/IdeaProjects/forloop/videopipeline/lib/tts.mjs', 'utf8');
    const key = (src.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0];
    if (!key) throw new Error('kein Anon-Key in videopipeline/lib/tts.mjs');
    fs.mkdirSync(DIR, { recursive: true });
    let made = 0;
    for (const q of QUITTUNGEN) {
        if (fs.existsSync(file(q))) continue;
        if (made) await new Promise(ok => setTimeout(ok, 5000));     // the voice's per-minute limit
        const r = await fetch('https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key },
            body: JSON.stringify({ text: q.say || q.text, voice: 'de-DE-Studio-C', languageCode: 'de-DE', speakingRate: 1.0 }),
        });
        if (!r.ok) throw new Error(q.text + ': HTTP ' + r.status + ' ' + (await r.text()).slice(0, 120));
        fs.writeFileSync(file(q), Buffer.from((await r.json()).audioContent, 'base64'));
        made++;
        console.log(path.basename(file(q)), q.text);
    }
    console.log(QUITTUNGEN.length + ' Quittungen, ' + made + ' neu aufgenommen, in ' + DIR);
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(new URL(import.meta.url).pathname)) {
    const args = process.argv.slice(2);
    if (args[0] === '--render') await render();
    else if (args[0] === '--probe') {
        const n = Number(args[1]) || 20;
        let prev = '', repeats = 0, missing = 0;
        const seen = new Set();
        for (let i = 0; i < n; i++) {
            const q = pick();
            if (q.text === prev) repeats++;
            if (!fs.existsSync(file(q))) missing++;
            seen.add(q.text);
            prev = q.text;
        }
        console.log(n + ' picks: ' + seen.size + ' different, ' + repeats + ' twice in a row, ' + missing + ' without a recording');
    } else console.log('usage: node quittungen.mjs --render | --probe [n]');
}
