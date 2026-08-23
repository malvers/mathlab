// Cut scene clips (video segments + narration at +0.5 s), concat them, then overlay the
// circular talking-head bubbles with alpha fades and a final fade-out.
import { execFileSync } from 'child_process';
import { mkdirSync as fsMkdir } from 'fs';
import { VIDEO_LIB } from './paths.mjs';

const ENC = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-r', '25', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100'];
const ff = (args) => execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...args], { stdio: 'inherit' });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// scenes: [{name, src, segments: [[start,end],...], len, audio, pad?}] — segments are raw-webm times.
// `pad` freezes the last frame for that many seconds when the narration outlasts the footage (the
// 500 ms audio delay below is the same head start mixNarration gives the voice).
export function buildScenes(scenes, { outDir }) {
  for (const s of scenes) {
    const segs = s.segments.map((x, i) => `[0:v]trim=start=${x[0]}:end=${x[1]},setpts=PTS-STARTPTS,fps=25[v${i}]`).join(';');
    const freeze = s.pad > 0.05 ? `,tpad=stop_mode=clone:stop_duration=${s.pad.toFixed(2)}` : '';
    const cat = s.segments.map((_, i) => `[v${i}]`).join('') + `concat=n=${s.segments.length}:v=1${freeze}[v]`;
    ff(['-i', s.src, '-i', s.audio, '-filter_complex', `${segs};${cat};[1:a]adelay=500|500,apad[a]`,
      '-map', '[v]', '-map', '[a]', '-t', String(s.len), ...ENC, `${outDir}/${s.name}.mp4`]);
    console.log(s.name, 'ok');
  }
}

// One MP3 carrying every scene's narration at its position in the finished cut. The talking-head
// bubble is generated from this single file, so Solita's mouth stays in sync over the whole video
// instead of restarting per scene. scenes: [{audio, len}] in playback order; `lead` is the same
// head start the scene cuts give the voice (buildScenes uses 0.5 s).
export function mixNarration(scenes, { outDir, lead = 0.5, name = 'fullnarration' }) {
  let at = 0;
  const parts = scenes.map((s) => { const d = { audio: s.audio, at: at + lead }; at += s.len; return d; });
  const ins = parts.map((d) => ['-i', d.audio]).flat();
  const chains = parts.map((d, i) => `[${i}:a]adelay=${Math.round(d.at * 1000)}|${Math.round(d.at * 1000)}[a${i}]`);
  const mix = parts.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${parts.length}:normalize=0,apad[a]`;
  ff([...ins, '-filter_complex', [...chains, mix].join(';'),
    '-map', '[a]', '-t', String(at), '-c:a', 'libmp3lame', '-b:a', '128k', `${outDir}/${name}.mp3`]);
  console.log('narration', at.toFixed(1) + 's', `${outDir}/${name}.mp3`);
  return { file: `${outDir}/${name}.mp3`, len: at };
}

// bubbles: [{talk, at}] — talk video overlaid bottom-right as a circle, fading in/out.
// crop: face region of the (square) talk video, default tuned for a centred portrait.
export function compose(sceneNames, bubbles, { outDir, out, crop = '760:760:132:20', size = 260, outros = [], music = null }) {
  const sceneFiles = sceneNames.map((n) => `${outDir}/${n}.mp4`);
  const allFiles = [...sceneFiles, ...outros];
  const mainLen = sceneFiles.reduce((a, f) => a + dur(f), 0);
  const total = allFiles.reduce((a, f) => a + dur(f), 0);
  const nS = sceneFiles.length, nAll = allFiles.length;
  const r = size / 2;
  const circ = `crop=${crop},scale=${size}:${size},fps=25,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte((X-${r})*(X-${r})+(Y-${r})*(Y-${r}),${r * r}),alpha(X,Y),0)'`;
  const ins = [...allFiles, ...bubbles.map((b) => b.talk)].map((f) => ['-i', f]).flat();
  if (music) ins.push('-i', music.file);
  const mIdx = nAll + bubbles.length;
  const parts = [];
  parts.push(allFiles.map((_, i) => `[${i}:v]`).join('') + `concat=n=${nAll}:v=1:a=0[base]`);
  parts.push(sceneFiles.map((_, i) => `[${i}:a]`).join('') + `concat=n=${nS}:v=0:a=1,apad[anarr]`);
  bubbles.forEach((b, i) => {
    const fades = b.fade === false ? '' : `,fade=t=in:st=0:d=0.4:alpha=1,fade=t=out:st=${(dur(b.talk) - 0.5).toFixed(2)}:d=0.5:alpha=1`;
    parts.push(`[${nAll + i}:v]${circ}${fades},setpts=PTS+${b.at}/TB[b${i}]`);
  });
  bubbles.forEach((_, i) => {
    const src = i === 0 ? '[base]' : `[o${i - 1}]`;
    const dst = i === bubbles.length - 1 ? `[v]` : `[o${i}]`;
    parts.push(`${src}[b${i}]overlay=x=W-w-24:y=H-h-24:eof_action=pass${dst}`);
  });
  if (!bubbles.length) parts.push(`[base]null[v]`);
  if (music) {
    parts.push(`[${mIdx}:a]volume=${music.gain ?? 0.12},atrim=0:${total.toFixed(2)},afade=t=in:st=0:d=1.5,afade=t=out:st=${(total - 2.5).toFixed(2)}:d=2.5[mus]`);
    parts.push(`[anarr][mus]amix=inputs=2:normalize=0,atrim=0:${total.toFixed(2)}[a]`);
  } else {
    parts.push(`[anarr]atrim=0:${total.toFixed(2)}[a]`);
  }
  ff([...ins, '-filter_complex', parts.join(';'),
    '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
    '-c:a', 'aac', '-b:a', '160k', out]);
  // central video library — every final lands here as well (Desktop alias points at it)
  const lib = VIDEO_LIB;
  try {
    fsMkdir(lib, { recursive: true });
    execFileSync('cp', [out, lib + out.split('/').pop()]);
    console.log('→ Bibliothek:', lib + out.split('/').pop());
  } catch (e) { console.log('Bibliothek-Kopie fehlgeschlagen:', e.message); }
  console.log('FINAL', out, dur(out).toFixed(1) + 's', '(main', mainLen.toFixed(1) + 's + outro)');
}
