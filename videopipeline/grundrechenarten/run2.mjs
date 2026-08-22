import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/gra';
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
const MUSIC = '/Users/malvers/IdeaProjects/forloop/HTML/resources/Infinity_6min.m4a';
const mk = (f) => Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/${f}.json`)).map((m) => [m.label, m.t]));
const A = mk('add'), S = mk('sub'), M = mk('mult'), D = mk('div');

const SPEC = [
  ['scene1', 'add',  A.intro,       9.3, 's1'],
  ['scene2', 'add',  A.filled,     15.5, 's2'],
  ['scene3', 'sub',  S.filled,     16.5, 's3'],
  ['scene4', 'mult', M.start,      17.0, 's4'],
  ['scene5', 'div',  D.filled,     12.8, 's5'],
  ['scene6', 'div',  D.wide,        8.0, 's6'],
];
const scenes = SPEC.map(([name, src, t0, len, aud]) => ({
  name, src: `${OUT}/${src}.mp4`, segments: [[t0, t0 + len]], len, audio: `${OUT}/${aud}.mp3`,
}));
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
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/grundrechenarten-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
