// Final cut: recorded intro up to the end screen, then OUR clean DOCALVERS.DE starfield
// (no "ZUR ÜBERSICHT" button), music across everything.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { recordOutros } from '../lib/outro.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('intro');

// clean end card: the shared outro recorder in logo mode, no QR (already trimmed at the head)
const [endcard] = await recordOutros({ outDir: OUT, cards: ['logo'], holds: { logo: 7 } });

const marks = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/intro.json`)).map((m) => [m.label, m.t]));
const t0 = marks.play - 0.4, t1 = marks.endscreen - 0.3;   // cut just before the button screen
const mainLen = t1 - t0, endLen = 6.0, total = mainLen + endLen;
execFileSync('ffmpeg', ['-nostdin','-y','-v','error','-i',`${OUT}/intro.mp4`,'-i',endcard,'-i',MUSIC,'-filter_complex',
  [`[0:v]trim=start=${t0}:end=${t1},setpts=PTS-STARTPTS,fps=25[v0]`,
   `[1:v]trim=start=0:end=${endLen},setpts=PTS-STARTPTS,fps=25,fade=t=in:st=0:d=0.7[v1]`,
   `[v0][v1]concat=n=2:v=1[v]`,
   `[2:a]volume=0.5,atrim=0:${total.toFixed(2)},afade=t=in:st=0:d=0.8,afade=t=out:st=${(total - 2.8).toFixed(2)}:d=2.8[a]`].join(';'),
  '-map','[v]','-map','[a]','-t',String(total),'-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-c:a','aac','-b:a','160k',`${OUT}/intro-1440p.mp4`]);
console.log('FERTIG', total.toFixed(1), 's (Hauptteil', mainLen.toFixed(1), '+ Abspann 6.0)');
