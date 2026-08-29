// BB84 demo — step 1: Solita speaks the script.
// The measured durations drive both the recording (run2) and the cut (run3), so this runs first.
//
// Incremental on purpose: the Studio voice has a hard quota (HTTP 429 "RESOURCE_EXHAUSTED"
// after a couple of full runs), so only scenes whose text actually changed are re-sent.
// FORCE=1 re-synthesises everything.
import fs from 'fs';
import { synthScenes } from '../lib/tts.mjs';
import { workDir } from '../lib/paths.mjs';
import { NARRATION } from './narration.mjs';

const OUT = workDir('bb84');
const read = (f, fallback) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return fallback; } };

const oldText = process.env.FORCE ? {} : read(`${OUT}/texts.json`, {});
const durs = read(`${OUT}/durs.json`, {});
const todo = Object.fromEntries(Object.entries(NARRATION).filter(([k, v]) =>
  v !== oldText[k] || !durs[k] || !fs.existsSync(`${OUT}/${k}.mp3`)));

if (!Object.keys(todo).length) {
  console.log('nichts zu tun — alle Szenen sind aktuell.');
} else {
  console.log('neu zu sprechen:', Object.keys(todo).join(' '));
  Object.assign(durs, await synthScenes(todo, { outDir: OUT, rate: 1.0 }));
  fs.writeFileSync(`${OUT}/durs.json`, JSON.stringify(durs));
  fs.writeFileSync(`${OUT}/texts.json`, JSON.stringify(NARRATION));
}

const order = Object.keys(NARRATION);
const total = order.reduce((a, k) => a + (durs[k] || 0), 0);
console.log('---');
for (const k of order) console.log(k.padEnd(4), (durs[k] || 0).toFixed(1) + 's');
console.log('Sprache gesamt', total.toFixed(1), 's über', order.length, 'Szenen.');
console.log('Mit Luft und Abspann landet der Film bei etwa', (total * 1.12 + 12).toFixed(0), 's.');
