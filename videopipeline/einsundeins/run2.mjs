// Assemble the einsundeins demo: mark-anchored cuts → narration mix → one always-on talk → outro.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/e1';
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
const MUSIC = '/Users/malvers/IdeaProjects/forloop/HTML/resources/Infinity_6min.m4a';
const loadedT = (n) => JSON.parse(fs.readFileSync(`${OUT}/s${n}.json`)).find((m) => m.label === 'loaded').t;

const SPEC = [
  [1, 0.4, 14], [2, 1.2, 15], [3, 1.2, 27.5], [4, 0.8, 13], [5, 1.0, 17.5], [6, 0.8, 12.5], [7, 0.8, 12.5],
];
const scenes = SPEC.map(([n, off, len]) => {
  const t0 = loadedT(n) + off;
  return { name: `scene${n}`, src: `${OUT}/s${n}.mp4`, segments: [[t0, t0 + len]], len, audio: `${OUT}/s${n}.mp3` };
});
buildScenes(scenes, { outDir: OUT });

let off = 0; const delays = [];
for (const s of scenes) { delays.push({ audio: s.audio, at: off + 0.5 }); off += s.len; }
const ins = delays.map((d) => ['-i', d.audio]).flat();
const chains = delays.map((d, i) => `[${i}:a]adelay=${Math.round(d.at * 1000)}|${Math.round(d.at * 1000)}[a${i}]`);
const mix = delays.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${delays.length}:normalize=0,apad[a]`;
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...ins, '-filter_complex', [...chains, mix].join(';'),
  '-map', '[a]', '-t', String(off), '-c:a', 'libmp3lame', '-b:a', '128k', `${OUT}/fullnarration.mp3`], { stdio: 'inherit' });
console.log('narration', off, 's');

await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/einsundeinsgleichzwei.html' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/einsundeins-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
