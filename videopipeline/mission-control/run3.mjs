// Die ganze Klasse im Blick (Mission Control / Test-Sperre) — step 3: cut the ONE take into
// twelve scenes, lay Solita's voice under them, add the music bed and the end card, and
// compose the 1440p master.
//
// Voice only: this film has no talking head, so there is no D-ID branch at all (no credits
// can be spent from here). The end sequence is the branded logo card alone — no
// "DAS CRAZY!" card; the film is for teachers.
//
// Needs from the steps before: run1 -> s1..s12.mp3 + durs.json, run2 -> take.mp4 + take.json
// (marks s1..s12 and end).
//
// CUTONLY=1 stops after the scene clips — check the cut before the long compose.
// SKIPCUT=1 reuses the clips from an earlier run; only the composition changes.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('mission-control');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', f]).toString());

// One take carries the whole film, in the film's order.
const TAKE = 'take';
const ORDER = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'];

const CHAPTER = {
  s1: 'Die ganze Klasse im Blick', s2: 'Die Zettel', s3: 'QR scannen', s4: 'Die Klasse legt los',
  s5: 'Kurz mal weg', s6: 'Weiter', s7: 'Funkstille', s8: 'Der rote Knopf', s9: 'Abgabe',
  s10: 'Frage für Frage', s11: 'Die Klasse als Ganzes', s12: 'Kein Name auf dem Server',
};

// One clip per scene: from its own mark to the next one, padded when the voice outlasts the
// footage. The last scene runs to the "end" mark plus a short tail.
const file = `${OUT}/${TAKE}.mp4`;
if (!fs.existsSync(file)) throw new Error('Take fehlt: ' + file + ' — erst run2 laufen lassen');
for (const k of ORDER) {
  if (durs[k] === undefined) throw new Error(`Sprechzeit für ${k} fehlt in durs.json — erst run1 laufen lassen`);
  if (!fs.existsSync(`${OUT}/${k}.mp3`)) throw new Error(`Ton fehlt: ${OUT}/${k}.mp3 — erst run1 laufen lassen`);
}
const log = JSON.parse(fs.readFileSync(`${OUT}/${TAKE}.json`, 'utf8'));
const broken = log.filter((m) => m.label.startsWith('ERROR') || m.label.startsWith('SKIP'));
if (broken.length) console.log('ACHTUNG in ' + TAKE + ':', JSON.stringify(broken));
const marks = Object.fromEntries(log.map((m) => [m.label, m.t]));
for (const k of [...ORDER, 'end']) if (marks[k] === undefined) throw new Error(`Marke ${k} fehlt in ${TAKE}.json`);
const takeDur = dur(file);

const scenes = ORDER.map((k, i) => {
  const t0 = marks[k];
  const tEnd = Math.min(i + 1 < ORDER.length ? marks[ORDER[i + 1]] : marks.end + 1.6, takeDur);
  if (tEnd <= t0) throw new Error(`Marke ${k} liegt nicht vor der nächsten (${t0} >= ${tEnd}) — Reihenfolge in ${TAKE}.json prüfen`);
  const len = Math.max(tEnd - t0, durs[k] + 1.2);          // 0.5 s lead + tail room
  return { name: `mc_${k}`, key: k, src: file, segments: [[t0, tEnd]], len,
           audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0) };
});

// The end card (Doc's review, 18.09.2026, 3:28): run2 lets the class from the intro come in right after
// Solita's last word, AIR (1.5 s) after it plus the picture's 0.35 s fade delay - the intro's cheer
// (resources/kids.wav, mean -10.9 dB against the voice's -18.4 dB, hence 0.3) lands on that moment.
{
  const KIDS = MUSIC.replace(/Infinity_6min\.m4a$/, 'kids.wav');
  const at12 = Math.round((durs.s12 + 1.5 + 0.4) * 1000);
  execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-i', `${OUT}/s12.mp3`, '-i', KIDS, '-filter_complex',
    `[1:a]aresample=24000,volume=0.3,adelay=${at12}|${at12}[k];[0:a][k]amix=inputs=2:normalize=0:duration=longest[a]`,
    '-map', '[a]', '-c:a', 'libmp3lame', '-b:a', '128k', `${OUT}/s12fx.mp3`], { stdio: 'inherit' });
  const s12 = scenes.find((x) => x.key === 's12');
  s12.audio = `${OUT}/s12fx.mp3`;
  // safety net (forloop-9c): buildScenes cuts hard at len - should the take ever hold the picture too
  // briefly, the last frame is held until the cheer is over instead of cutting it off
  const need = 0.5 + dur(s12.audio) + 0.4;                 // lead + voice + cheer + a breath
  if (need > s12.len) { s12.pad += need - s12.len; s12.len = need; }
}

let at = 0;
const chapters = [];
for (const s of scenes) {
  if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
  if (0.5 + durs[s.key] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
  chapters.push({ t: at, label: CHAPTER[s.key] });
  at += s.len;
}
// round first: 179.9 s must read 3:00, not 2:00 (the old form rounded only the seconds)
const mmss = (t) => { const r = Math.round(t); return Math.floor(r / 60) + ':' + String(r % 60).padStart(2, '0'); };
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join('\n'));
console.log('Hauptteil', mmss(at), '— Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));
console.log('Kapitel:\n' + chapters.map((c) => `  ${mmss(c.t)} ${c.label}`).join('\n'));

if (!process.env.SKIPCUT) buildScenes(scenes, { outDir: OUT });
if (process.env.CUTONLY) { console.log('CUTONLY — der Schnitt steht.'); process.exit(0); }

// The bed: part 1 of Infinity_6min loops seamlessly between these two marks (README),
// so the music is rendered to the length of the film instead of running out at 360 s.
// NOTE: third copy of this function (wuerfelspiel/run3, vektoren/run3) — it belongs into lib/.
function makeBed(total) {
  const LOOP_A = 21.220, LOOP_B = 163.998;
  const ff = (a) => execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...a], { stdio: 'inherit' });
  ff(['-i', MUSIC, '-ss', '0', '-to', String(LOOP_A), '-c:a', 'pcm_s16le', `${OUT}/bed_intro.wav`]);
  ff(['-i', MUSIC, '-ss', String(LOOP_A), '-to', String(LOOP_B), '-c:a', 'pcm_s16le', `${OUT}/bed_loop.wav`]);
  const n = Math.max(1, Math.ceil((total - LOOP_A) / (LOOP_B - LOOP_A)));
  ff(['-i', `${OUT}/bed_intro.wav`, '-stream_loop', String(n - 1), '-i', `${OUT}/bed_loop.wav`,
    '-filter_complex', `[0:a][1:a]concat=n=2:v=0:a=1,atrim=0:${total.toFixed(2)}[a]`,
    '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', `${OUT}/bed.m4a`]);
  console.log('Musikbett', dur(`${OUT}/bed.m4a`).toFixed(1) + 's aus', n, 'Durchläufen');
  return `${OUT}/bed.m4a`;
}

// The end sequence carries the last frame: never fade to black. Logo card only, with the QR
// to the teacher's page.
const outros = await recordOutros({ outDir: OUT, cards: ['logo'],
  qrUrl: 'https://docalvers.de/svp/leistungstest.html' });
const total = scenes.reduce((a, s) => a + s.len, 0) + outros.reduce((a, f) => a + dur(f), 0);
const out = `${OUT}/mission-control-voice-1440p.mp4`;
// 0.06 as in the Würfelspiel film. Doc's review of that film (18.09.2026, 9:34): "die Hintergrundmusik
// noch ein Tick leiser" — BED_GAIN=0.045 tries that without touching the file.
const gain = parseFloat(process.env.BED_GAIN || '0.06');
compose(scenes.map((s) => s.name), [],
  { outDir: OUT, out, outros, music: { file: makeBed(total), gain } });
console.log('Fertig:', out);
