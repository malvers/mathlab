// Assembly for the Retina take: cut scenes, build the full narration track, one always-on
// D-ID talk over the whole video, compose at 2560x1440.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/wc1440';
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;
const marks = (n) => Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/s${n}.json`)).map((m) => [m.label.split(' ')[0], m.t]));

// scene 7 windows from the recorded marks: a caption-free lapse bite + the ISS pass.
// cap-* marks log every slomo-caption change; pick the first 'clean' stretch >= 3.8 s.
const log7 = JSON.parse(fs.readFileSync(`${OUT}/s7.json`));
const m7 = marks(7);
const capMarks = log7.filter((m) => m.label.startsWith('cap-'));
let A = null;
for (let i = 0; i < capMarks.length; i++) {
  if (capMarks[i].label !== 'cap-clean') continue;
  const start = Math.max(capMarks[i].t, m7.lapse + 0.2);
  const end = Math.min(i + 1 < capMarks.length ? capMarks[i + 1].t : Infinity, m7.isspass - 1.5);
  if (end - start >= 3.8) { A = [start + 0.1, start + 3.6]; break; }
}
if (!A) throw new Error('no clean 3.5s lapse window found — check s7.json caption marks');
const B = [m7.isspass - 1.3, m7.isspass + 13.2];                // 14.5 s — rise, zoom-follow, glide
console.log('s7 cuts', A, B);

// single-segment scenes are anchored at the END of their recording (loads vary between takes)
const vdur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const endCut = (n, len) => { const D = vdur(`${OUT}/s${n}.mp4`); return [[Math.max(0, D - len - 0.1), D - 0.1]]; };
const D2 = vdur(`${OUT}/s2.mp4`);
const scenes = [
  { name: 'scene1', src: `${OUT}/s1.mp4`, segments: endCut(1, 14.5),   len: 14.5, audio: `${OUT}/s1.mp3` },
  { name: 'scene2', src: `${OUT}/s2.mp4`, segments: [[8, 16], [D2 - 6.6, D2 - 0.1]], len: 14.5, audio: `${OUT}/s2.mp3` },
  { name: 'scene3', src: `${OUT}/s3.mp4`, segments: endCut(3, 16.5),   len: 16.5, audio: `${OUT}/s3.mp3` },
  { name: 'scene4', src: `${OUT}/s4.mp4`, segments: endCut(4, 15),     len: 15,   audio: `${OUT}/s4.mp3` },
  { name: 'scene5', src: `${OUT}/s5.mp4`, segments: endCut(5, 13.5),   len: 13.5, audio: `${OUT}/s5.mp3` },
  { name: 'scene6', src: `${OUT}/s6.mp4`, segments: endCut(6, 15.5),   len: 15.5, audio: `${OUT}/s6.mp3` },
  { name: 'scene7', src: `${OUT}/s7.mp4`, segments: [A, B],            len: 18,   audio: `${OUT}/s7.mp3` },
  { name: 'scene8', src: `${OUT}/s8.mp4`, segments: endCut(8, 10),     len: 10,   audio: `${OUT}/s8.mp3` },
];
console.log('cuts', JSON.stringify(scenes.map(s => s.segments)));
buildScenes(scenes, { outDir: OUT });

// full narration track (each scene audio at its offset + 0.5 s) → one D-ID talk for an always-on Solita
let off = 0; const delays = [];
for (const s of scenes) { delays.push({ audio: s.audio, at: off + 0.5 }); off += s.len; }
const ins = delays.map((d) => ['-i', d.audio]).flat();
const chains = delays.map((d, i) => `[${i}:a]adelay=${Math.round(d.at * 1000)}|${Math.round(d.at * 1000)}[a${i}]`);
const mix = delays.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${delays.length}:normalize=0,apad[a]`;
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...ins, '-filter_complex', [...chains, mix].join(';'),
  '-map', '[a]', '-t', String(off), '-c:a', 'libmp3lame', '-b:a', '128k', `${OUT}/fullnarration.mp3`], { stdio: 'inherit' });
console.log('full narration', off, 's');

await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });

compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/weltzeituhr-demo-1440p.mp4`, size: 520 });
console.log('ASSEMBLE DONE');
