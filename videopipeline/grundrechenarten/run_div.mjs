// Division single video — recorded AFTER the i18n/alignment fixes went live.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { synthScenes } from '../lib/tts.mjs';
import { runScenes } from '../lib/record-cdp.mjs';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('gra');

const NARR = {
  dividieren_a1: 'Schriftliche Division: achttausendfünfhundertsechsundvierzig geteilt durch sieben. Wie oft passt die Sieben? Die goldene Klammer zeigt es — Ziffer für Ziffer.',
  dividieren_a2: 'Multiplizieren, abziehen, nächste Ziffer herunterholen — jede Hilfslinie führt von oben in die Rechnung. Und ganz am Ende bleibt: Rest sechs.',
};
const durs = await synthScenes(NARR, { outDir: OUT });

await runScenes([
  { name: 'div2', url: 'https://docalvers.de/dividieren.html?lang=de', run: async (p, { mark }) => {
      await p.waitForTimeout(2500);
      await p.evaluate(() => { document.getElementById('div-input').value = '8546'; document.getElementById('dsor-input').value = '7'; updateValues(); });
      mark('filled');
      await p.waitForTimeout(1500);
      for (let i = 0; i < 8; i++) { await p.evaluate(() => nextStep()); await p.waitForTimeout(1100); }
      mark('done');
      await p.waitForTimeout(2000);
      await p.evaluate(() => toggleSidebar());
      await p.waitForTimeout(1000);
      mark('wide');
      await p.waitForTimeout(8000);
  } },
], { outDir: OUT });

const D = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/div2.json`)).map((m) => [m.label, m.t]));
const len1 = 10.5, len2 = 10.5, total = len1 + len2;
// audio-fit check BEFORE spending D-ID credits
const fit = (at, d, name) => { if (at + 0.5 + d > total - 0.2) throw new Error(`${name} passt nicht: endet ${(at + 0.5 + d).toFixed(1)} > ${total}`); };
fit(0, durs.dividieren_a1, 'a1'); fit(len1, durs.dividieren_a2, 'a2');
console.log('audio fit OK');

const scenes = [
  { name: 'dividieren_sc0', src: `${OUT}/div2.mp4`, segments: [[D.filled, D.filled + len1]],               len: len1, audio: `${OUT}/dividieren_a1.mp3` },
  { name: 'dividieren_sc1', src: `${OUT}/div2.mp4`, segments: [[D.filled + len1, D.filled + len1 + len2]], len: len2, audio: `${OUT}/dividieren_a2.mp3` },
];
buildScenes(scenes, { outDir: OUT });
let off = 0; const delays = [];
for (const s of scenes) { delays.push({ audio: s.audio, at: off + 0.5 }); off += s.len; }
const ins = delays.map((d) => ['-i', d.audio]).flat();
const chains = delays.map((d, i) => `[${i}:a]adelay=${Math.round(d.at * 1000)}|${Math.round(d.at * 1000)}[a${i}]`);
const mix = delays.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${delays.length}:normalize=0,apad[a]`;
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...ins, '-filter_complex', [...chains, mix].join(';'),
  '-map', '[a]', '-t', String(off), '-c:a', 'libmp3lame', '-b:a', '128k', `${OUT}/dividieren_narr.mp3`], { stdio: 'inherit' });
const talks = await makeTalks(PORTRAIT, [`${OUT}/dividieren_narr.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT + '/dividieren_o', qrUrl: 'https://docalvers.de/dividieren.html' });
compose(scenes.map((s) => s.name), [{ talk: Object.values(talks)[0], at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/dividieren-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
