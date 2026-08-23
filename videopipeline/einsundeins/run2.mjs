// Assemble the einsundeins demo: mark-anchored cuts → narration mix → one always-on talk → outro.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('e1');
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
const loadedT = (n) => JSON.parse(fs.readFileSync(`${OUT}/s${n}.json`)).find((m) => m.label === 'loaded').t;

const SPEC = [
  [1, 0.4, 14], [2, 1.2, 15], [3, 1.2, 27.5], [4, 0.8, 13], [5, 1.0, 17.5], [6, 0.8, 12.5], [7, 0.8, 12.5],
];
const scenes = SPEC.map(([n, off, len]) => {
  const t0 = loadedT(n) + off;
  return { name: `scene${n}`, src: `${OUT}/s${n}.mp4`, segments: [[t0, t0 + len]], len, audio: `${OUT}/s${n}.mp3` };
});
buildScenes(scenes, { outDir: OUT });

mixNarration(scenes, { outDir: OUT });

await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/einsundeinsgleichzwei.html' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/einsundeins-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
