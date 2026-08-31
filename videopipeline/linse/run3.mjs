// Linse demo — step 3: cut the take into scenes, mix the narration, let D-ID speak it
// as Solita, record the outro card and compose the final 1440p master.
//
// Two sources: the lab scenes come out of the single continuous take (main.mp4), the
// three cards out of their own clips. The film order interleaves them.
//
// CUTONLY=1 stops before any D-ID credit is spent — check the cut first.
// SKIPCUT=1 reuses the scene clips from an earlier run; only the composition changes.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('linse');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', f]).toString());

const ORDER = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];
const CARDS = new Set(['s2', 's3', 's7', 's10']);
const LAB_ORDER = ORDER.filter((k) => !CARDS.has(k));

const mainLog = JSON.parse(fs.readFileSync(`${OUT}/main.json`, 'utf8'));
const marks = Object.fromEntries(mainLog.map((m) => [m.label, m.t]));
const skipped = mainLog.filter((m) => m.label.startsWith('SKIP') || m.label.startsWith('ERROR'));
if (skipped.length) console.log('ACHTUNG, übersprungen:', JSON.stringify(skipped));
// Scene 6 only works if the breakout to the thin lens is actually IN the take. It is
// stochastic (see run2), so this is checked rather than assumed.
const breakout = mainLog.find((m) => m.label.startsWith('breakout@'));
if (!breakout) {
  console.error('ABBRUCH: Szene 6 zeigt den Ausbruch nicht — run2 noch einmal laufen lassen.');
  process.exit(1);
}
console.log('Ausbruch im Take bei Runde', breakout.label.split('@')[1],
  '—', (breakout.t - marks.s6).toFixed(1) + ' s nach Szenenbeginn.');
const mainDur = dur(`${OUT}/main.mp4`);

// one clip per scene: the footage between its mark and the next, padded if the voice is longer
const scenes = ORDER.map((k) => {
  let src, t0, tEnd;
  if (CARDS.has(k)) {
    src = `${OUT}/card_${k}.mp4`;
    const log = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/card_${k}.json`, 'utf8')).map((m) => [m.label, m.t]));
    t0 = log[k];
    tEnd = Math.min(log.end !== undefined ? log.end : t0 + durs[k] + 1.6, dur(src));
  } else {
    src = `${OUT}/main.mp4`;
    t0 = marks[k];
    const nx = LAB_ORDER[LAB_ORDER.indexOf(k) + 1];
    tEnd = Math.min(nx ? marks[nx] : marks.end + 1.6, mainDur);
  }
  const len = Math.max(tEnd - t0, durs[k] + 1.2);        // 0.5 s lead + tail room
  return { name: `linse_${k}`, src, segments: [[t0, tEnd]], len, audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0) };
});

let off = 0;
for (const s of scenes) {
  const k = s.name.slice(6);
  if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
  if (0.5 + durs[k] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
  off += s.len;
}
console.log('Hauptteil', off.toFixed(1), 's — Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));

// YouTube chapters, straight from the cut — no hand-counted timestamps that go stale
const CHAPTER = {
  s1: 'Ein Klotz Glas', s2: 'Was heißt gut?', s3: 'Zwanzig Vorschläge pro Runde',
  s4: 'Die ersten Runden', s5: 'Bei hundert ist die Linse da', s6: 'Es hört nicht auf',
  s7: 'Erst scharf, dann sparsam', s8: 'Mehr Brechkraft, weniger Glas',
  s9: 'Der Brennpunkt wandert', s10: 'Niemand hat ihm die Linse gezeigt',
};
let cAt = 0;
const chapters = [];
for (const s of scenes) {
  const k = s.name.slice(6);
  if (CHAPTER[k]) chapters.push({ t: Math.round(cAt), label: CHAPTER[k] });
  cAt += s.len;
}
const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.round(t) % 60).padStart(2, '0');
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join(' · '));
console.log('Kapitel:', chapters.map((c) => `${mmss(c.t)} ${c.label}`).join(' · '));

if (!process.env.SKIPCUT) buildScenes(scenes, { outDir: OUT });

// The bed: part 1 of Infinity_6min loops seamlessly between these two marks (see README),
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

// One D-ID clip per narration block, so Solita's mouth stays in sync across the whole film.
const MAX_TALK = 280;
const groups = [];
let cur = [], curLen = 0, at = 0;
const starts = [];
for (const s of scenes) {
  if (cur.length && curLen + s.len > MAX_TALK) { groups.push(cur); cur = []; curLen = 0; }
  if (!cur.length) starts.push(at);
  cur.push(s); curLen += s.len; at += s.len;
}
groups.push(cur);
const narrations = groups.map((gr, i) => mixNarration(gr, { outDir: OUT, name: `narr${i}` }));
console.log('Sprecherspuren:', narrations.map((n, i) => `${i}: ${n.len.toFixed(1)}s ab ${starts[i].toFixed(1)}s`).join(' · '));

if (process.env.CUTONLY) { console.log('CUTONLY — Schnitt steht, kein D-ID.'); process.exit(0); }

// the talking heads cost credits — reuse them unless the narration itself changed
const talkFile = (f) => `${OUT}/talk_${f.split('/').pop().replace('.mp3', '')}.mp4`;
const haveTalks = narrations.every((n) => fs.existsSync(talkFile(n.file)));
const talks = haveTalks
  ? Object.fromEntries(narrations.map((n) => [n.file, talkFile(n.file)]))
  : await makeTalks(PORTRAIT, narrations.map((n) => n.file), { outDir: OUT });
if (haveTalks) console.log('D-ID übersprungen — die Talks von vorhin passen noch.');
const bubbles = narrations.map((n, i) => ({ talk: talks[n.file], at: starts[i], fade: false }));

const outros = await recordOutros({
  outDir: OUT, qrUrl: 'https://docalvers.de/LensStandalone/cmaes_java.html', cards: ['logo'],
});
const total = scenes.reduce((a, s) => a + s.len, 0) + outros.reduce((a, f) => a + dur(f), 0);
compose(scenes.map((s) => s.name), bubbles,
  { outDir: OUT, out: `${OUT}/linse-demo-1440p.mp4`, size: 380, outros,
    music: { file: makeBed(total), gain: 0.12 } });
