// The Maya tour as a film for YouTube: the live tour (tours/maya.html, served by tools/tourkritik.py maya) is
// played once in a muted headless browser and recorded at 2560x1440 (record-cdp, dsf 2); every voice start is
// logged, and afterwards Doc's voice (sN.mp3) is laid under the picture at exactly those moments.
//
//     node maya/film.mjs            (from videopipeline/, the tour server must run on :8769)
//     node maya/film.mjs --no-take  (keep the take, only voice, outro and cut again)
//
// Doc, 25.09.2026: "go und danach ein Video für YT". The tour is the approved Drehbuch - Doc reviewed it in the
// critics tool - so nothing is re-staged here. Out: ~/Movies/videopipeline/maya/film/maya-tour-1440p.mp4
import fs from 'fs';
import os from 'os';
import { execFileSync } from 'child_process';
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
import { runScenes } from '../lib/record-cdp.mjs';
import { recordOutros } from '../lib/outro.mjs';

const WORK = os.homedir() + '/Movies/videopipeline/maya';
const OUT = WORK + '/film';
const URL = 'http://127.0.0.1:8769/tours/maya.html';
fs.mkdirSync(OUT, { recursive: true });

// the film shows the tour, not its controls: no player bar, no hint line, no LOCAL badge (also inside the lab)
const CLEAN = '#tour-hud,#tour-live,#local-badge,#tour-start{display:none!important}';
// 1600x900 at dsf 1.6 = a true 2560x1440 - at 1280x720 the lab inside the tour is under its 980x620 minimum and
// shows "Bildschirm zu klein" (first take, 25.09.2026)
const VIEW = { width: 1600, height: 900 }, DSF = 1.6;
const LEAD_IN = 1.0;                                  // the clean title card before the first scene, in seconds
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(page, { mark }) {
    // every voice that starts, in the page's own clock (same machine clock as ours)
    await page.evaluate(() => {
        window.__plays = [];
        const play = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
            if (this.tagName === 'AUDIO') window.__plays.push(Date.now());
            return play.apply(this, arguments);
        };
    });
    await sleep(7000);                                   // prepare(): the lab loads, the voices decode
    for (const f of page.frames()) await f.addStyleTag({ content: CLEAN }).catch(() => { });
    await sleep(1500);                                   // the title card stands a moment
    const ref = Date.now();
    mark('ref');
    await page.keyboard.press('Space');
    const t0 = Date.now();
    // the tour stops itself at a stall ("Ruhezustand") - play on; the end is the title card after the last voice
    for (;;) {
        await sleep(500);
        const st = await page.evaluate(() => ({
            n: window.__plays.length,
            stalled: (document.getElementById('tour-live') || {}).textContent?.includes('Ruhezustand'),
            card: (document.getElementById('tour-card') || {}).className || '',
        }));
        if (st.stalled) { console.log('Ruhezustand - weiter'); await page.keyboard.press('Space'); }
        if (st.n >= 12 && !/\bhide\b/.test(st.card)) break;   // card(true) = the class 'hide' goes
        if (Date.now() - t0 > 330000) { console.log('Zeitüberschreitung'); break; }
    }
    await sleep(2500);                                   // the card at the end
    for (const f of page.frames()) await f.addStyleTag({ content: CLEAN }).catch(() => { });
    const plays = await page.evaluate(() => window.__plays);
    fs.writeFileSync(OUT + '/plays.json', JSON.stringify({ ref, plays }));
}

if (!process.argv.includes('--no-take')) await runScenes([{ name: 'tour', url: URL, run }],
    { outDir: OUT, viewport: VIEW, dsf: DSF, upscale: 1,
      args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'] });

// the voice under the picture: sN.mp3 at the second it started in the take
const log = JSON.parse(fs.readFileSync(OUT + '/tour.json', 'utf8'));
const refT = log.find((m) => m.label === 'ref').t;
const { ref, plays } = JSON.parse(fs.readFileSync(OUT + '/plays.json', 'utf8'));
if (plays.length !== 12) console.log('Achtung: ' + plays.length + ' Stimmen statt 12');
// the take starts at the page load (LOCAL badge, player bar) - the film starts LEAD_IN before the first scene
const START = Math.max(0, refT - LEAD_IN);
const at = plays.slice(0, 12).map((p) => refT + (p - ref) / 1000 - START);
const ins = at.map((_, i) => ['-i', `${WORK}/s${i}.mp3`]).flat();
const chain = at.map((t, i) => `[${i + 1}:a]adelay=${Math.round(t * 1000)}:all=1[a${i}]`).join(';')
    + ';' + at.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${at.length}:normalize=0,apad[a]`;
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-ss', START.toFixed(3), '-i', `${OUT}/tour.mp4`, ...ins,
    '-filter_complex', chain, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest',
    `${OUT}/maya-tour-body.mp4`], { stdio: 'inherit' });

// the end titles every film has: DAS CRAZY! and the logo card with a QR to the lab (Doc: "Abspann fehlt!")
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/maya.html' });
const parts = [`${OUT}/maya-tour-body.mp4`, ...outros];
const cat = '[0:a]aresample=48000,aformat=channel_layouts=mono[a0];' + parts.map((_, i) => i === 0 ? `[0:v][a0]`
    : `[${i}:v]`+`[s${i}]`).join('') + `concat=n=${parts.length}:v=1:a=1[v][a]`;
const silence = outros.map((f, k) => `anullsrc=r=48000:cl=mono,atrim=0:${dur(f).toFixed(3)}[s${k + 1}]`).join(';');
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...parts.map((f) => ['-i', f]).flat(),
    '-filter_complex', silence + ';' + cat, '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
    `${OUT}/maya-tour-1440p.mp4`], { stdio: 'inherit' });
console.log('Stimmen bei', at.map((t) => t.toFixed(2)).join(' '));
console.log('fertig:', `${OUT}/maya-tour-1440p.mp4`);
