// Conway's Iris demo — step 3: cut the take into scenes, mix the narration, let D-ID
// speak it as Solita, record the outro cards and compose the final 1440p master.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('iris');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const marks = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/main.json`, 'utf8')).map((m) => [m.label, m.t]));
const vdur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', `${OUT}/main.mp4`]).toString());

const order = Object.keys(durs).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const skipped = JSON.parse(fs.readFileSync(`${OUT}/main.json`, 'utf8')).filter((m) => m.label.startsWith('SKIP'));
if (skipped.length) console.log('ACHTUNG, übersprungen:', JSON.stringify(skipped));

// one clip per scene: the footage between its mark and the next, padded if the voice is longer
const scenes = order.map((k, i) => {
  const t0 = marks[k];
  const tEnd = Math.min(i + 1 < order.length ? marks[order[i + 1]] : marks.end + 1.5, vdur);
  const len = Math.max(tEnd - t0, durs[k] + 1.2);          // 0.5 s lead + tail room
  return { name: `iris_${k}`, src: `${OUT}/main.mp4`, segments: [[t0, tEnd]], len,
    audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0) };
});

let off = 0;
for (const s of scenes) {
  const k = s.name.slice(5);
  if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
  if (0.5 + durs[k] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
  off += s.len;
}
console.log('Hauptteil', off.toFixed(1), 's — Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));

// YouTube chapters, straight from the cut — no hand-counted timestamps that go stale
const CHAPTER = {
  s1: 'Die leere Bühne', s3: 'Die Regel', s5: 'Der Satz von Conway', s7: 'Warum ein Kreis?',
  s8: 'Die Iris öffnet sich', s9: 'Die Wischerkurve', s10: 'Konstante Breite',
  s11: 'Das Reuleaux-Dreieck', s12: 'Das Quadrat', s13: 'CMA-ES sucht die Lage',
  s14: 'Die Rotationsbahn', s15: 'Die Heatmap', s16: 'Farbverlauf-Editor',
  s17: 'Vergleichbar und hell', s18: 'Neues Dreieck',
};
let cAt = 0;
const chapters = [];
for (const s of scenes) {
  const k = s.name.slice(5);
  if (CHAPTER[k]) chapters.push({ t: Math.round(cAt), label: CHAPTER[k] });
  cAt += s.len;
}
const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.round(t) % 60).padStart(2, '0');
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join(' · '));
console.log('Kapitel:', chapters.map((c) => `${mmss(c.t)} ${c.label}`).join(' · '));

buildScenes(scenes, { outDir: OUT });

// One D-ID clip per narration block, so Solita's mouth stays in sync across the whole film.
// Split at a scene boundary: a single ~6 min audio script is beyond what the API takes.
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
const narrations = groups.map((g, i) => mixNarration(g, { outDir: OUT, name: `narr${i}` }));
console.log('Sprecherspuren:', narrations.map((n, i) => `${i}: ${n.len.toFixed(1)}s ab ${starts[i].toFixed(1)}s`).join(' · '));

// CUTONLY=1 stops here: check the cut before any D-ID credit is spent
if (process.env.CUTONLY) { console.log('CUTONLY — Schnitt steht, kein D-ID.'); process.exit(0); }

const talks = await makeTalks(PORTRAIT, narrations.map((n) => n.file), { outDir: OUT });
const bubbles = narrations.map((n, i) => ({ talk: talks[n.file], at: starts[i], fade: false }));

const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/irisvis.html' });
compose(scenes.map((s) => s.name), bubbles,
  { outDir: OUT, out: `${OUT}/conways-iris-demo-1440p.mp4`, size: 380, outros,
    music: { file: MUSIC, gain: 0.12 } });
