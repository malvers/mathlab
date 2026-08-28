// Conway's Iris demo — step 1: Solita speaks the script.
// The measured durations drive the recording (run2), so this always runs first.
//
// Incremental on purpose: the Studio voice has a hard quota (HTTP 429 "RESOURCE_EXHAUSTED"
// after a couple of full runs), so only scenes whose text actually changed are re-sent.
// FORCE=1 re-synthesises everything.
import fs from 'fs';
import { execSync } from 'child_process';
import { synthScenes } from '../lib/tts.mjs';
import { workDir } from '../lib/paths.mjs';
import { NARRATION } from './narration.mjs';

const OUT = workDir('iris');
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

// s13 carries two deliberate breaks: after "… namens CMAES." the recording presses X, and
// after "… in Zeitlupe." the slow-motion replay starts. Measuring the gaps instead of
// guessing keeps picture and voice together even after the text is rewritten.
const log = execSync(`ffmpeg -nostdin -hide_banner -v info -i "${OUT}/s13.mp3" ` +
  '-af silencedetect=noise=-45dB:d=0.4 -f null - 2>&1', { encoding: 'utf8' });
const gaps = [...log.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => parseFloat(m[1]));
const cues = { s13x: gaps[0] ?? null, s13slow: gaps[1] ?? null };
fs.writeFileSync(`${OUT}/cues.json`, JSON.stringify(cues));
console.log('cues s13 — X bei', cues.s13x, 's · Zeitlupe bei', cues.s13slow, 's');

const total = Object.values(durs).reduce((a, b) => a + b, 0);
console.log('---');
console.log('Sprache gesamt', total.toFixed(1), 's über', Object.keys(durs).length, 'Szenen.');
console.log('Musikbett ist 360 s lang — Hauptteil + Abspann muss darunter bleiben.');
