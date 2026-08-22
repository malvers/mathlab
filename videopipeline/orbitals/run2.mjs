import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/orb';
const PORTRAIT = '/Users/malvers/IdeaProjects/forloop/HTML/resources/team/team_02.png';
const MUSIC = '/Users/malvers/IdeaProjects/forloop/HTML/resources/Infinity_6min.m4a';
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`));
const marks = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/main.json`)).map((m) => [m.label, m.t]));
const vdur = parseFloat(execFileSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','csv=p=0',`${OUT}/main.mp4`]).toString());

const order = ['s1','s2','s3','s4','s5','s6','s7','s8'];
const scenes = [];
for (let i = 0; i < order.length; i++) {
  const k = order[i];
  const t0 = marks[k];
  const tEnd = i + 1 < order.length ? marks[order[i + 1]] : Math.min(marks.end + 2, vdur);
  let len = tEnd - t0;
  const need = durs[k] + 1.2;                       // audio at +0.5 plus tail room
  if (len < need) len = need;                       // last scene may need padding (tpad below)
  scenes.push({ name: `orb_${k}`, src: `${OUT}/main.mp4`, segments: [[t0, Math.min(tEnd, vdur)]], len, audio: `${OUT}/${k}.mp3`, pad: len - (Math.min(tEnd, vdur) - t0) });
}
// audio-fit check before any D-ID spend
let off = 0;
for (const s of scenes) {
  const end = off + 0.5 + durs[s.name.slice(4)];
  if (end > off + s.len + 3) console.log('WARN overrun', s.name);
  off += s.len;
}
console.log('total main', off.toFixed(1), 's — Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));

// build scene clips; pad the ones whose window is shorter than len by cloning the last frame
for (const s of scenes) {
  const [a, b] = s.segments[0];
  const filters = [`[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,fps=25` + (s.pad > 0.05 ? `,tpad=stop_mode=clone:stop_duration=${s.pad.toFixed(2)}` : '') + `[v]`,
    `[1:a]adelay=500|500,apad[a]`];
  execFileSync('ffmpeg', ['-nostdin','-y','-v','error','-i',s.src,'-i',s.audio,'-filter_complex',filters.join(';'),
    '-map','[v]','-map','[a]','-t',String(s.len),'-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-r','25','-c:a','aac','-b:a','128k','-ar','44100',`${OUT}/${s.name}.mp4`]);
  console.log(s.name, 'ok');
}

let o2 = 0; const delays = [];
for (const s of scenes) { delays.push({ audio: s.audio, at: o2 + 0.5 }); o2 += s.len; }
const ins = delays.map((d) => ['-i', d.audio]).flat();
const chains = delays.map((d, i) => `[${i}:a]adelay=${Math.round(d.at * 1000)}|${Math.round(d.at * 1000)}[a${i}]`);
const mix = delays.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${delays.length}:normalize=0,apad[a]`;
execFileSync('ffmpeg', ['-nostdin','-y','-v','error',...ins,'-filter_complex',[...chains, mix].join(';'),
  '-map','[a]','-t',String(o2),'-c:a','libmp3lame','-b:a','128k',`${OUT}/fullnarration.mp3`], { stdio: 'inherit' });

await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/orbitals.html' });
compose(scenes.map((s) => s.name), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/atomorbitale-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
