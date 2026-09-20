// Würfelspiel demo — step 3: cut the four takes into 24 scenes, lay Solita's voice under
// them and compose the 1440p master.
//
// NO D-ID in this pass (Doc, 17.09.2026: "mach den Film erstmal ohne D-ID, nur voice, dann
// schau ich ihn mir an"). The narration is the same either way, so a later talking-head
// pass only needs DID=1 - the credits are only spent when that flag is set.
//
// CUTONLY=1 stops after the scene clips — check the cut before the long compose.
// SKIPCUT=1 reuses the clips from an earlier run; only the composition changes.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('wuerfelspiel');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', f]).toString());

// Which take carries which scene — the film's order, not the lab's station order.
const TAKES = {
  takeA: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'],
  takeB: ['s13', 's14', 's15', 's16'],
  takeC: ['s17', 's18', 's19', 's20', 's21'],
  takeD: ['s22', 's23', 's24'],
};
const ORDER = Object.values(TAKES).flat();

const CHAPTER = {
  s1: 'Zwei Würfel, eine Frage', s2: 'Sechs Flächen, nicht drei Zahlen', s3: 'Zählen statt raten',
  s4: 'Zwei Stufen', s5: 'Der wichtigste Trick', s6: 'Stufe 1', s7: 'An jedes Ende',
  s8: 'Die Pfadregel', s9: 'Die Sieben schlägt die Sechs', s10: 'Die Summenregel',
  s11: 'Das Rezept', s12: 'Stimmt das wirklich?', s13: 'Fehler 1: die halbe Wahrheit',
  s14: 'Fehler 2: Wahrscheinlichkeit fünf', s15: 'Fehler 3: der vergessene Weg',
  s16: 'Fehler 4 und 5', s17: 'Eine Fläche, und das Spiel ist fair', s18: 'Tauschen und Zufall',
  s19: 'Gleiche Würfel, kein Halbe-halbe', s20: 'Der Würfel-Kreis',
  s21: 'Das Paradox nachgerechnet', s22: 'Jetzt ihr', s23: 'Die Lösung', s24: 'Abspann',
};

// One clip per scene: from its own mark to the next one inside the same take, padded when
// the voice outlasts the footage. s22 carries the five-second thinking pause with it.
const scenes = [];
for (const [take, keys] of Object.entries(TAKES)) {
  const file = `${OUT}/${take}.mp4`;
  if (!fs.existsSync(file)) throw new Error('Take fehlt: ' + file + ' — run2 mit TAKES=' + take.slice(4).toUpperCase());
  const log = JSON.parse(fs.readFileSync(`${OUT}/${take}.json`, 'utf8'));
  const broken = log.filter((m) => m.label.startsWith('ERROR') || m.label.startsWith('SKIP'));
  if (broken.length) console.log('ACHTUNG in ' + take + ':', JSON.stringify(broken));
  const marks = Object.fromEntries(log.map((m) => [m.label, m.t]));
  for (const k of [...keys, 'end']) if (marks[k] === undefined) throw new Error(`Marke ${k} fehlt in ${take}.json`);
  const takeDur = dur(file);
  keys.forEach((k, i) => {
    const t0 = marks[k];
    const tEnd = Math.min(i + 1 < keys.length ? marks[keys[i + 1]] : marks.end + 1.6, takeDur);
    const len = Math.max(tEnd - t0, durs[k] + 1.2);        // 0.5 s lead + tail room
    scenes.push({ name: `ws_${k}`, key: k, src: file, segments: [[t0, tEnd]], len,
                  audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0) });
  });
}

let at = 0;
const chapters = [];
for (const s of scenes) {
  if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
  if (0.5 + durs[s.key] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
  chapters.push({ t: at, label: CHAPTER[s.key] });
  at += s.len;
}
const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.round(t) % 60).padStart(2, '0');
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join('\n'));
console.log('Hauptteil', mmss(at), '— Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));
console.log('Kapitel:\n' + chapters.map((c) => `  ${mmss(c.t)} ${c.label}`).join('\n'));

if (!process.env.SKIPCUT) buildScenes(scenes, { outDir: OUT });
if (process.env.CUTONLY) { console.log('CUTONLY — der Schnitt steht.'); process.exit(0); }

// The bed: part 1 of Infinity_6min loops seamlessly between these two marks (README),
// so the music is rendered to the length of the film instead of running out at 360 s.
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

// Solita's bubble only when asked for: DID=1 spends credits, the plain run does not.
let bubbles = [];
if (process.env.DID) {
  const { makeTalks } = await import('../lib/did.mjs');
  const { PORTRAIT } = await import('../lib/paths.mjs');
  // D-ID's /audios upload answers 413 "Request Too Long" above roughly 4.7 MB. At 300 s a
  // group reached 4.76 MB and was refused (20.09.2026), while the 17.09. run's 4.61 MB still
  // went through. 200 s keeps every group near 3 MB - well inside, and the credits are billed
  // per 15 s of talk, so splitting finer costs at most one rounded-up credit per group.
  const MAX_TALK = 200;
  const groups = [];
  let cur = [], curLen = 0, walk = 0;
  const starts = [];
  for (const s of scenes) {
    if (cur.length && curLen + s.len > MAX_TALK) { groups.push(cur); cur = []; curLen = 0; }
    if (!cur.length) starts.push(walk);
    cur.push(s); curLen += s.len; walk += s.len;
  }
  groups.push(cur);
  const narrations = groups.map((gr, i) => mixNarration(gr, { outDir: OUT, name: `narr${i}` }));
  const talkFile = (f) => `${OUT}/talk_${f.split('/').pop().replace('.mp3', '')}.mp4`;
  const haveTalks = narrations.every((n) => fs.existsSync(talkFile(n.file)));
  const talks = haveTalks
    ? Object.fromEntries(narrations.map((n) => [n.file, talkFile(n.file)]))
    : await makeTalks(PORTRAIT, narrations.map((n) => n.file), { outDir: OUT });
  if (haveTalks) console.log('D-ID übersprungen — die Talks von vorhin passen noch.');
  bubbles = narrations.map((n, i) => ({ talk: talks[n.file], at: starts[i], fade: false }));
} else {
  console.log('Ohne D-ID — nur Solitas Stimme (DID=1 setzt die Sprechblase dazu).');
}

// The end sequence carries the last frame: never fade to black.
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/wuerfelspiel.html' });
const total = scenes.reduce((a, s) => a + s.len, 0) + outros.reduce((a, f) => a + dur(f), 0);
const out = `${OUT}/wuerfelspiel-${process.env.DID ? 'demo' : 'voice'}-1440p.mp4`;
compose(scenes.map((s) => s.name), bubbles,
  // 0.10 -> 0.06 after the first cut, 0.06 -> 0.05 after the second (Doc at 9:34, 18.09.2026:
  // "Hintergrundmusik im Nachhinein noch einen Tick leiser") - about 1.6 dB down.
  { outDir: OUT, out, size: 380, outros, music: { file: makeBed(total), gain: 0.05 } });
