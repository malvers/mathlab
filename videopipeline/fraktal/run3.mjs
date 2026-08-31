// Fraktal demo — step 3: cut the take into scenes, mix the narration, let D-ID speak it
// as Solita, record the outro card and compose the final 1440p master.
//
// Two sources: the lab scenes come out of the single continuous take (main.mp4), the
// four cards out of their own clips. The film order interleaves them.
//
// THE ONE THING TO KNOW ABOUT THIS CUT: the take was NOT shot in the order of the
// script. Scene 6 (the Julia sets) is recorded second, right after scene 1, because the
// zoom survives a mode switch — coming out of scene 7 the Julia plane inherits zoom
// 200 000 and renders solid black, and #btn-reset does not rescue it (it is animated,
// takes over two and a half seconds, and then climbs back up on its own). So the take
// runs s1 · s6 · s2 · s3 · s5 · s7 and this file puts the scenes back in order. Cutting
// by "the next mark in the film" would hand scene 1 the footage of scene 6.
//
// CUTONLY=1 stops before any D-ID credit is spent — check the cut first.
// SKIPCUT=1 reuses the scene clips from an earlier run; only the composition changes.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('fraktal');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', f]).toString());

const ORDER = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];
const CARDS = new Set(['s4', 's8', 's9', 's10']);
const REC_ORDER = ['s1', 's6', 's2', 's3', 's5', 's7'];      // the order the camera saw them

const mainLog = JSON.parse(fs.readFileSync(`${OUT}/main.json`, 'utf8'));
const marks = Object.fromEntries(mainLog.map((m) => [m.label, m.t]));
const skipped = mainLog.filter((m) => m.label.startsWith('SKIP') || m.label.startsWith('ERROR'));
if (skipped.length) console.log('ACHTUNG, übersprungen:', JSON.stringify(skipped));
for (const k of REC_ORDER) if (marks[k] === undefined) throw new Error('Marke fehlt in main.json: ' + k);
console.log('Marken:', mainLog.map((m) => m.label + ' ' + m.t.toFixed(1)).join(' · '));
const mainDur = dur(`${OUT}/main.mp4`);

// one clip per scene: the footage between its mark and the next ONE IT WAS SHOT BEFORE
const scenes = ORDER.map((k) => {
  let src, t0, tEnd;
  if (CARDS.has(k)) {
    src = `${OUT}/${k}.mp4`;
    const log = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/${k}.json`, 'utf8')).map((m) => [m.label, m.t]));
    t0 = log[k];
    tEnd = Math.min(t0 + durs[k] + 1.6, dur(src));
  } else {
    src = `${OUT}/main.mp4`;
    t0 = marks[k];
    /* NOT up to the next mark: the setup for the next scene - the mode switch, the
       sliders, the zoom-out - happens BEFORE its mark and therefore inside this
       scene's window. Cutting that way put a Julia dust at the end of scene 1 and
       scene 3's starting position at the end of scene 2. The tail is the spoken
       length plus a breath, and the next mark is only the hard ceiling. */
    const nx = REC_ORDER[REC_ORDER.indexOf(k) + 1];
    tEnd = Math.min(nx ? marks[nx] : mainDur, mainDur, t0 + durs[k] + 1.9);
  }
  const len = Math.max(tEnd - t0, durs[k] + 1.2);        // 0.5 s lead + tail room
  return { name: `fraktal_${k}`, src, segments: [[t0, tEnd]], len, audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0) };
});

let off = 0;
for (const s of scenes) {
  const k = s.name.slice(8);
  if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
  if (0.5 + durs[k] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
  off += s.len;
}
console.log('Hauptteil', off.toFixed(1), 's — Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));

// YouTube chapters, straight from the cut — no hand-counted timestamps that go stale
const CHAPTER = {
  s1: 'Niemand hat das gezeichnet', s2: 'Die Frage an einen Punkt',
  s3: 'Einen Fingerbreit weiter', s4: 'Die Farbe ist die Wartezeit',
  s5: 'Der Rand hört nicht auf', s6: 'Jeder Punkt eine eigene Welt',
  s7: 'Wo das Werkzeug endet', s8: 'Immer näher an eine Stelle',
  s9: 'Da ist Pi', s10: 'Was das heißt — und was nicht',
};
let cAt = 0;
const chapters = [];
for (const s of scenes) {
  const k = s.name.slice(8);
  if (CHAPTER[k]) chapters.push({ t: Math.round(cAt), label: CHAPTER[k] });
  cAt += s.len;
}
const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.round(t) % 60).padStart(2, '0');
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join('\n'));
console.log('Kapitel:\n' + chapters.map((c) => `  ${mmss(c.t)} ${c.label}`).join('\n'));

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
  outDir: OUT, qrUrl: 'https://docalvers.de/mandelbrot.html', cards: ['logo'],
});
const total = scenes.reduce((a, s) => a + s.len, 0) + outros.reduce((a, f) => a + dur(f), 0);
compose(scenes.map((s) => s.name), bubbles,
  { outDir: OUT, out: `${OUT}/fraktal-demo-1440p.mp4`, size: 380, outros,
    music: { file: makeBed(total), gain: 0.12 } });
