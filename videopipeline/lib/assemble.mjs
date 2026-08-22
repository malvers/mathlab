// Cut scene clips (video segments + narration at +0.5 s), concat them, then overlay the
// circular talking-head bubbles with alpha fades and a final fade-out.
import { execFileSync } from 'child_process';

const ENC = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-r', '25', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100'];
const ff = (args) => execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...args], { stdio: 'inherit' });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// scenes: [{name, src, segments: [[start,end],...], len, audio}]  — segments are raw-webm times.
export function buildScenes(scenes, { outDir }) {
  for (const s of scenes) {
    const segs = s.segments.map((x, i) => `[0:v]trim=start=${x[0]}:end=${x[1]},setpts=PTS-STARTPTS,fps=25[v${i}]`).join(';');
    const cat = s.segments.map((_, i) => `[v${i}]`).join('') + `concat=n=${s.segments.length}:v=1[v]`;
    ff(['-i', s.src, '-i', s.audio, '-filter_complex', `${segs};${cat};[1:a]adelay=500|500,apad[a]`,
      '-map', '[v]', '-map', '[a]', '-t', String(s.len), ...ENC, `${outDir}/${s.name}.mp4`]);
    console.log(s.name, 'ok');
  }
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
  console.log('FINAL', out, dur(out).toFixed(1) + 's', '(main', mainLen.toFixed(1) + 's + outro)');
}
