// Three single-lab videos from the existing recordings (division follows after the bugfix push).
import fs from 'fs';
import { execFileSync } from 'child_process';
import { synthScenes } from '../lib/tts.mjs';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('gra');
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
const mk = (f) => Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/${f}.json`)).map((m) => [m.label, m.t]));
const A = mk('add'), S = mk('sub'), M = mk('mult');

const LABS = [
  { id: 'addition', src: 'add', qr: 'https://docalvers.de/addition.html',
    narr: {
      a1: 'Schriftliche Addition im Doc Alvers Mathe-Labor — jeder Schritt erklärt sich selbst. Nehmen wir zwei richtig große Zahlen.',
      a2: 'Einer plus Einer: Wird es zweistellig, wandert die goldene Eins als Übertrag in die nächste Spalte — Spalte für Spalte durch die ganze Rechnung.',
      a3: 'Und ganz vorn wächst das Ergebnis sogar um eine Stelle — auf über eine Million.',
    },
    spec: [['a1', A.intro + 0.2, 9.3], ['a2', A.filled, 12.0], ['a3', A.filled + 12.0, 4.8]] },
  { id: 'subtraktion', src: 'sub', qr: 'https://docalvers.de/subtraktion.html',
    narr: {
      a1: 'Schriftliche Subtraktion: hunderttausend minus eins. Null minus eins geht nicht — also borgen wir uns zehn. Und wieder. Und wieder.',
      a2: 'Ein Domino aus geborgten Einsen, durch alle Spalten — übrig bleibt: fünfmal die Neun. Neunundneunzigtausendneunhundertneunundneunzig.',
    },
    spec: [['a1', S.filled, 8.5], ['a2', S.filled + 8.5, 9.5]] },
  { id: 'multiplikation', src: 'mult', qr: 'https://docalvers.de/multiplikation.html',
    narr: {
      a1: 'Schriftliche Multiplikation: vierhundertsechsundfünfzig mal siebenhundertneunundachtzig. Jede Ziffer des Multiplikators bekommt ihre eigene Farbe — und ihre eigene Zeile.',
      a2: 'Gold, Lila, Grün: drei Teilprodukte, sauber versetzt — und zusammen ergeben sie das Ergebnis: dreihundertneunundfünfzigtausendsiebenhundertvierundachtzig.',
    },
    spec: [['a1', M.start, 8.8], ['a2', M.goldrow - 1.0, 10.8]] },
];

for (const lab of LABS) {
  const items = Object.fromEntries(Object.entries(lab.narr).map(([k, v]) => [`${lab.id}_${k}`, v]));
  await synthScenes(items, { outDir: OUT });
  const scenes = lab.spec.map(([aud, t0, len], i) => ({
    name: `${lab.id}_sc${i}`, src: `${OUT}/${lab.src}.mp4`, segments: [[t0, t0 + len]], len,
    audio: `${OUT}/${lab.id}_${aud}.mp3`,
  }));
  buildScenes(scenes, { outDir: OUT });
  let off = 0; const delays = [];
  for (const s of scenes) { delays.push({ audio: s.audio, at: off + 0.5 }); off += s.len; }
  const ins = delays.map((d) => ['-i', d.audio]).flat();
  const chains = delays.map((d, i) => `[${i}:a]adelay=${Math.round(d.at * 1000)}|${Math.round(d.at * 1000)}[a${i}]`);
  const mix = delays.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${delays.length}:normalize=0,apad[a]`;
  execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...ins, '-filter_complex', [...chains, mix].join(';'),
    '-map', '[a]', '-t', String(off), '-c:a', 'libmp3lame', '-b:a', '128k', `${OUT}/${lab.id}_narr.mp3`], { stdio: 'inherit' });
  const talks = await makeTalks(PORTRAIT, [`${OUT}/${lab.id}_narr.mp3`], { outDir: OUT });
  const talk = Object.values(talks)[0];
  const outros = await recordOutros({ outDir: OUT + '/' + lab.id + '_o', qrUrl: lab.qr }).catch(async (e) => {
    fs.mkdirSync(OUT + '/' + lab.id + '_o', { recursive: true }); throw e;
  });
  compose(scenes.map((s) => s.name), [{ talk, at: 0, fade: false }],
    { outDir: OUT, out: `${OUT}/${lab.id}-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
}
console.log('SINGLES DONE');
