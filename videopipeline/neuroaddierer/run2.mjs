import { execFileSync } from 'child_process';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/na';
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
const MUSIC = '/Users/malvers/IdeaProjects/forloop/HTML/resources/Infinity_6min.m4a';

// all segments cut from the ONE continuous recording (marks: A 2.9, B 13.5, C 22.8, D 32.8,
// solved 63.9, E 66.9, chain 73.1, F 77.1, G 100.4)
const SPEC = [
  ['scene1', 2.9, 12],   ['scene2', 13.6, 10],  ['scene3', 22.9, 11], ['scene4', 60.5, 7],
  ['scene5', 66.9, 12.1], ['scene6', 79.0, 12], ['scene7', 100.3, 7],
];
const scenes = SPEC.map(([name, t0, len], i) => ({
  name, src: `${OUT}/main.mp4`, segments: [[t0, t0 + len]], len, audio: `${OUT}/s${i + 1}.mp3`,
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
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/neuroaddierer.html' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/neuroaddierer-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
