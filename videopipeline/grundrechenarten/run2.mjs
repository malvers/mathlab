import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('gra');
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
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

mixNarration(scenes, { outDir: OUT });

await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/grundrechenarten-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
