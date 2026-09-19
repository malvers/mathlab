// YouTube thumbnail for a finished film: one film frame + title in Orbitron -> 1280x720 PNG.
// The layout lives centrally in lib/thumbnail.html; a film only says WHICH frame and WHAT to cut out of it.
//
//   await makeThumbnail({ film, at: 90, ytTitle })                       // hero: whole frame under a scrim
//   await makeThumbnail({ film, at: 90, title: ['Die ganze Klasse', '*im Blick*'], sub: '…',
//                         erase: [{ x, y, w, h }], pieces: [{ sx, sy, sw, sh, x, y, w, border, fadeBottom, fadeSides }] })
//
// All source coordinates (erase, sx/sy/sw/sh) are pixels of the film frame, x/y/w are pixels of the
// 1280x720 thumbnail; a piece keeps its aspect ratio. *…* in a title line = accent colour.
// lib/youtube.mjs calls this for every upload, so no film goes out with YouTube's random frame.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const TEMPLATE = fileURLToPath(new URL('./thumbnail.html', import.meta.url));
const BRAND = 'DOC ALVERS MATHE-LABOR';
const MAX_BYTES = 2 * 1024 * 1024;          // YouTube Studio's limit for custom thumbnails

// 'Film title — what it shows | Doc Alvers Mathe-Labor'  ->  title lines + subtitle
export function thumbText(ytTitle) {
  const [head, ...rest] = ytTitle.split(' | ')[0].split(' — ');
  const words = head.trim().split(/\s+/);
  let lines = [head.trim()];
  if (words.length > 2) {                    // two lines, as even as possible, the last one in the accent colour
    let best = 1;
    const len = i => Math.max(words.slice(0, i).join(' ').length, words.slice(i).join(' ').length);
    for (let i = 2; i < words.length; i++) if (len(i) < len(best)) best = i;
    lines = [words.slice(0, best).join(' '), '*' + words.slice(best).join(' ') + '*'];
  }
  return { title: lines, sub: rest.join(' — ').trim() };
}

function duration(film) {
  return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', film]).toString());
}

export async function makeThumbnail({ film, at, frame, out, ytTitle, title, sub, pieces, erase, textWidth, brand = BRAND }) {
  out = out || path.join(path.dirname(film), path.basename(film).replace(/\.[^.]+$/, '') + '-thumbnail.png');
  if (!frame) {                              // grab the frame from the finished film
    frame = out.replace(/\.png$/, '-frame.png');
    const t = at ?? duration(film) / 3;
    /* No colour tags in the PNG: with cICP/gAMA (bt709) Chrome converts the picture and the red of the film
       turns darker and more saturated. The matrix stays - dropping colorspace too would decode as BT.601. */
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', film, '-frames:v', '1',
      '-vf', 'setparams=color_primaries=unknown:color_trc=unknown', frame]);
  }
  const auto = ytTitle ? thumbText(ytTitle) : {};
  const cfg = {
    frame: 'data:image/png;base64,' + fs.readFileSync(frame).toString('base64'),   // a file:// image would taint the canvas
    title: [].concat(title || auto.title), sub: sub ?? auto.sub, pieces, erase, textWidth, brand,
  };
  if (!cfg.title[0]) throw new Error('makeThumbnail: no title (pass title or ytTitle)');

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    await page.goto('file://' + TEMPLATE);
    const info = await page.evaluate(c => window.build(c), cfg);
    if (!info.orbitron) throw new Error('makeThumbnail: Orbitron did not load (network?) - refusing to render a fallback font');
    await page.screenshot({ path: out });
    if (fs.statSync(out).size > MAX_BYTES) {   // busy frames: PNG gets too heavy for YouTube -> JPEG
      fs.unlinkSync(out);
      out = out.replace(/\.png$/, '.jpg');
      await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
    }
    console.log(`  ✓ thumbnail: ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB, title ${info.titlePx}px, text ends y=${info.textBottom})`);
  } finally {
    await browser.close();
  }
  return out;
}
