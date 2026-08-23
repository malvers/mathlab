// Record the cinematic intro (intro.html) as a clean 60s video with its own music mixed in post.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { runScenes } from '../lib/record-cdp.mjs';
import { MUSIC, workDir } from '../lib/paths.mjs';

const OUT = workDir('intro');

await runScenes([
  { name: 'intro', url: 'https://docalvers.de/intro.html?lang=de', run: async (p, { mark }) => {
      await p.waitForTimeout(3000);
      await p.evaluate(() => {   // hide player chrome for a clean recording
        const st = document.createElement('style');
        st.textContent = '.intro-top-bar { display: none !important; }';
        document.head.appendChild(st);
      });
      await p.locator('#intro-play-full-line').click();
      mark('play');
      // wait for the final "ZUR ÜBERSICHT" end screen, then hold
      for (let i = 0; i < 320; i++) {
        await p.waitForTimeout(250);
        const done = await p.evaluate(() => {
          const els = Array.from(document.querySelectorAll('a, button'));
          const b = els.find((e) => /ZUR ÜBERSICHT/i.test(e.textContent || ''));
          return !!(b && b.getBoundingClientRect().width > 5 && getComputedStyle(b).opacity > 0.5);
        }).catch(() => false);
        if (done) { mark('endscreen'); break; }
      }
      await p.waitForTimeout(4500);
      mark('end');
  } },
], { outDir: OUT, showCursor: false });

const marks = Object.fromEntries(JSON.parse(fs.readFileSync(`${OUT}/intro.json`)).map((m) => [m.label, m.t]));
console.log('marks', JSON.stringify(marks));
const t0 = marks.play - 0.4, t1 = (marks.end || marks.play + 70) + 0.3;
const len = (t1 - t0).toFixed(2);
execFileSync('ffmpeg', ['-nostdin','-y','-v','error','-i',`${OUT}/intro.mp4`,'-i',MUSIC,'-filter_complex',
  `[0:v]trim=start=${t0}:end=${t1},setpts=PTS-STARTPTS,fps=25[v];[1:a]volume=0.5,atrim=0:${len},afade=t=in:st=0:d=0.8,afade=t=out:st=${(len - 2.5).toFixed(2)}:d=2.5[a]`,
  '-map','[v]','-map','[a]','-t',len,'-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-c:a','aac','-b:a','160k',`${OUT}/intro-1440p.mp4`]);
console.log('FERTIG', len, 's');
