import fs from 'fs';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('svp');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`));
const marks = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/main.json`)).map((m) => [m.label, m.t]));
const order = ['s1','s2','s3','s4','s5','s6'];
const scenes = [];
for (let i = 0; i < order.length; i++) {
  const k = order[i];
  const t0 = marks[k];
  const tEnd = i + 1 < order.length ? marks[order[i + 1]] : marks.end;
  let len = tEnd - t0;
  if (durs[k] + 0.9 > len) { console.log('WARN', k, 'audio', durs[k], '> len', len); len = durs[k] + 1.0; }
  scenes.push({ name: `svp_${k}`, src: `${OUT}/main.mp4`, segments: [[t0, tEnd]], len, audio: `${OUT}/${k}.mp3`, pad: Math.max(0, len - (tEnd - t0)) });
}
buildScenes(scenes, { outDir: OUT });
mixNarration(scenes, { outDir: OUT });
await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/svp/index.html' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/svp-erklaervideo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
