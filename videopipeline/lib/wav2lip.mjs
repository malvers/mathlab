// Offline lip sync via a local Wav2Lip install — drop-in replacement for lib/did.mjs (no API, no credits).
// Same signature as did.mjs → makeTalks(face, audios, { outDir }) and the same talk_<name>.mp4 output names,
// so run2.mjs only needs its import swapped.
//
// `face` is either a still PNG (mouth moves, head stays put) or — much nicer — a short idle-loop MP4 of
// Solita with a little head motion. The loop is ping-ponged and repeated to the narration length first,
// so a 6 s loop carries a 90 s take without a visible jump.
//
// Setup: see lib/wav2lip-setup.md. Override paths with WAV2LIP_DIR / WAV2LIP_CKPT if needed.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const DIR = process.env.WAV2LIP_DIR || os.homedir() + '/tools/Wav2Lip';
const CKPT = process.env.WAV2LIP_CKPT || DIR + '/checkpoints/wav2lip_gan.pth';
const PY = fs.existsSync(DIR + '/venv/bin/python') ? DIR + '/venv/bin/python' : 'python3';

const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args]);
const duration = (f) =>
  parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// Forward + reversed copy of the idle loop, so the seam is seamless. Cached next to the source.
function pingPong(video) {
  const out = video.replace(/\.\w+$/, '') + '.pingpong.mp4';
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(video).mtimeMs) {
    ff(['-i', video, '-filter_complex', '[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]',
        '-map', '[v]', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', out]);
  }
  return out;
}

// Repeat the ping-pong loop until it covers the narration.
function stretchTo(video, seconds, outFile) {
  ff(['-stream_loop', '-1', '-i', video, '-t', String(seconds + 0.5),
      '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', outFile]);
  return outFile;
}

export async function makeTalks(face, audios, { outDir, resize = 1, batch = 16 }) {
  if (!fs.existsSync(CKPT)) throw new Error('Wav2Lip checkpoint missing: ' + CKPT + ' (see lib/wav2lip-setup.md)');
  const isStill = /\.(png|jpe?g|webp)$/i.test(face);
  const loop = isStill ? null : pingPong(face);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wav2lip-'));
  const out = {};

  for (const a of audios) {
    const name = path.basename(a).replace(/\.\w+$/, '');
    const target = `${outDir}/talk_${name}.mp4`;
    const src = isStill ? face : stretchTo(loop, duration(a), `${tmp}/${name}_face.mp4`);
    const t0 = Date.now();
    execFileSync(PY, ['inference.py',
      '--checkpoint_path', CKPT,
      '--face', path.resolve(src),
      '--audio', path.resolve(a),
      '--outfile', path.resolve(target),
      '--resize_factor', String(resize),
      '--wav2lip_batch_size', String(batch),
      '--face_det_batch_size', '1',   // CPU/MPS: detection is the memory hog
      '--nosmooth',                   // Solita barely moves; smoothing only blurs the mouth
      ...(isStill ? ['--static', 'True'] : []),
    ], { cwd: DIR, stdio: 'inherit' });
    out[a] = target;
    console.log('lip synced', target, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  return out;
}
