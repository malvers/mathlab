// Shell demo — step 3: cut the take into scenes, mix the narration, let D-ID speak it
// as Solita, record the outro cards and compose the final 1440p master.
//
// Two sources: the lab scenes come out of the single continuous take (main.mp4), the
// equation card out of its own clip. The film order interleaves them.
//
// CUTONLY=1 stops before any D-ID credit is spent — check the cut first.
// SKIPCUT=1 reuses the scene clips from an earlier run; only the composition changes.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('shell');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', f]).toString());

const ORDER = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11'];
const CARDS = new Set(['s6']);
const LAB_ORDER = ORDER.filter((k) => !CARDS.has(k));

const mainLog = JSON.parse(fs.readFileSync(`${OUT}/main.json`, 'utf8'));
const marks = Object.fromEntries(mainLog.map((m) => [m.label, m.t]));
const skipped = mainLog.filter((m) => m.label.startsWith('SKIP') || m.label.startsWith('ERROR'));
if (skipped.length) console.log('ACHTUNG, übersprungen:', JSON.stringify(skipped));
for (const k of LAB_ORDER) if (marks[k] === undefined) throw new Error('Marke fehlt in main.json: ' + k);
console.log('Marken:', mainLog.map((m) => m.label + ' ' + m.t.toFixed(1)).join(' · '));
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
  return { name: `shell_${k}`, src, segments: [[t0, tEnd]], len, audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0) };
});

let off = 0;
for (const s of scenes) {
  const k = s.name.slice(6);
  if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
  if (0.5 + durs[k] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
  off += s.len;
}
console.log('Hauptteil', off.toFixed(1), 's — Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));

// YouTube chapters, straight from the cut
const CHAPTER = {
  s1: 'Wer malt die Schnecke?', s2: 'Das Bild ist ein Protokoll',
  s3: 'Eine Zelle steckt an: das V', s4: 'Zwei Wellen löschen sich aus',
  s5: 'Der Schatten erklärt es', s6: 'Zwei Gleichungen',
  s7: 'Wenig Vorrat: Keile', s8: 'Ein Drittel mehr: Zelte',
  s9: 'Hunger und Überfluss', s10: 'Jenseits des Reglers: Streifen',
  s11: 'Eine Reihe Zellen, zwei Stoffe',
};
let cAt = 0;
const chapters = [];
for (const s of scenes) {
  const k = s.name.slice(6);
  if (CHAPTER[k]) chapters.push({ t: Math.round(cAt), label: CHAPTER[k] });
  cAt += s.len;
}
const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.round(t) % 60).padStart(2, '0');
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join('\n'));
console.log('Kapitel:\n' + chapters.map((c) => `  ${mmss(c.t)} ${c.label}`).join('\n'));

if (!process.env.SKIPCUT) buildScenes(scenes, { outDir: OUT });

// The bed: part 1 of Infinity_6min loops seamlessly between these two marks (see README).
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

// Full end sequence like the other films: the CRAZY card, then the branded card with
// the QR to the lab. Never fade to black — the last frame carries the card.
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/shell.html' });
const total = scenes.reduce((a, s) => a + s.len, 0) + outros.reduce((a, f) => a + dur(f), 0);
// Solita at 304 px like Jacquard and PinkerFinder (Doc's wish), bed at the standard 0.12
compose(scenes.map((s) => s.name), bubbles,
  { outDir: OUT, out: `${OUT}/shell-demo-1440p.mp4`, size: 304, outros,
    music: { file: makeBed(total), gain: 0.12 } });
