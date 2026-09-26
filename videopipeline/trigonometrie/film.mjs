// The Trigonometrie tour as a film of the LAB: the live tour (tours/trigonometrie.html, served by tools/tourkritik.py
// trigonometrie 8772) plays once in a muted headless browser and is recorded at 2560x1440 (record-cdp); every voice
// start is logged, and afterwards Solita's voice (sN.mp3) is laid under the picture at exactly those moments.
//
//     node trigonometrie/film.mjs            (from videopipeline/, the tour server must run on :8772)
//     node trigonometrie/film.mjs --no-take  (keep the take, only voice, outro, music and cut again)
//
// Doc, 26.09.2026: "mach bitte von dem Lab ein Video nach diesem Drehbuch ... aber nicht von der Tour, sondern
// wirklich vom Lab". So the tour page is only the director here: title card, chapter line, subtitles and player bar
// are hidden, the lab fills the whole frame; what stays of the tour is its cursor. Pattern: maya/film.mjs.
// Out: ~/Movies/videopipeline/trigonometrie/film/trigonometrie-1440p.mp4 (+ chapters.txt for YouTube)
import fs from 'fs';
import os from 'os';
import { execFileSync } from 'child_process';
import { runScenes } from '../lib/record-cdp.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { buildBed } from '../lib/musicbed.mjs';

const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const WORK = os.homedir() + '/Movies/videopipeline/trigonometrie';
const OUT = WORK + '/film';
const URL = 'http://127.0.0.1:8772/tours/trigonometrie.html';
const DREHBUCH = new globalThis.URL('../../HTML/tours/trigonometrie.js', import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

// the scenes as the Drehbuch names them - the chapters of the film
const SCENES = [...fs.readFileSync(DREHBUCH, 'utf8').matchAll(/id: 's(\d+)', n: '(\d+)', title: '([^']+)'/g)]
    .map((m) => ({ id: 's' + m[1], n: m[2], title: m[3] }));
const N = SCENES.length;

// nothing of the tour but its cursor: the lab alone, edge to edge
const CLEAN = '#tour-hud,#tour-live,#local-badge,#tour-start,#tour-cap,#tour-sub,#tour-card,#tour-veil{display:none!important}' +
    '.tour-stage{padding:0!important;gap:0!important}.tour-pane{border:0!important;border-radius:0!important}' +
    '#tour-view{border-radius:0!important}';
// 1600x900 at dsf 1.6 = a true 2560x1440 (the lab's layout at 1600x900 is what the headless runs checked)
const VIEW = { width: 1600, height: 900 }, DSF = 1.6;
const LEAD_IN = 1.0;                                  // the lab stands a moment before the first scene, in seconds
const LEAD = 0.5;                                     // cyber-tour starts a voice this long after its scene mark

async function run(page, { mark }) {
    await page.addStyleTag({ content: CLEAN });
    // every voice that starts, in the page's own clock (same machine clock as ours)
    await page.evaluate(() => {
        window.__plays = [];
        const play = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
            if (this.tagName === 'AUDIO') window.__plays.push(Date.now());
            return play.apply(this, arguments);
        };
    });
    // prepare(): the lab loads behind the (hidden) card, the voices decode
    await page.waitForFunction(() => window.CyberTour && CyberTour.log.some((l) => l.includes('Bühne vorbereitet')),
        null, { timeout: 60000 });
    for (const f of page.frames()) await f.addStyleTag({ content: CLEAN }).catch(() => { });
    await sleep(1500);
    const ref = Date.now();
    mark('ref');
    await page.keyboard.press('Space');
    const t0 = Date.now();
    // the tour stops itself at a stall ("Ruhezustand") - play on; the end is card(true) after the last voice
    for (;;) {
        await sleep(500);
        const st = await page.evaluate(() => ({
            n: window.__plays.length,
            stalled: (document.getElementById('tour-live') || {}).textContent?.includes('Ruhezustand'),
            card: (document.getElementById('tour-card') || {}).className || '',
            error: CyberTour.state.error,
        }));
        if (st.error) { console.log('FEHLER in der Tour:', st.error); break; }
        if (st.stalled) { console.log('Ruhezustand - weiter'); await page.keyboard.press('Space'); }
        if (st.n >= N && !/\bhide\b/.test(st.card)) break;   // card(true) = the class 'hide' goes
        if (Date.now() - t0 > 400000) { console.log('Zeitüberschreitung'); break; }
    }
    await sleep(1500);                                   // the last picture stands a moment
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
if (plays.length !== N) console.log('Achtung: ' + plays.length + ' Stimmen statt ' + N);
const START = Math.max(0, refT - LEAD_IN);
const at = plays.slice(0, N).map((p) => refT + (p - ref) / 1000 - START);
const ins = at.map((_, i) => ['-i', `${WORK}/s${i}.mp3`]).flat();
const chain = at.map((t, i) => `[${i + 1}:a]adelay=${Math.round(t * 1000)}:all=1[a${i}]`).join(';')
    + ';' + at.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${at.length}:normalize=0,apad[a]`;
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-ss', START.toFixed(3), '-i', `${OUT}/tour.mp4`, ...ins,
    '-filter_complex', chain, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest',
    `${OUT}/body.mp4`], { stdio: 'inherit' });

// the end titles every film has: DAS CRAZY! and the logo card with a QR to the lab
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/trigonometrie.html' });
const parts = [`${OUT}/body.mp4`, ...outros];
const cat = '[0:a]aresample=48000,aformat=channel_layouts=mono[a0];' + parts.map((_, i) => i === 0 ? `[0:v][a0]`
    : `[${i}:v]` + `[s${i}]`).join('') + `concat=n=${parts.length}:v=1:a=1[v][a]`;
const silence = outros.map((f, k) => `anullsrc=r=48000:cl=mono,atrim=0:${dur(f).toFixed(3)}[s${k + 1}]`).join(';');
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', ...parts.map((f) => ['-i', f]).flat(),
    '-filter_complex', silence + ';' + cat, '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
    `${OUT}/cut.mp4`], { stdio: 'inherit' });

// the music bed every film has (Infinity, lib/musicbed.mjs), gain 0.05 as in the Würfelspiel and Maya films
const total = dur(`${OUT}/cut.mp4`);
buildBed(total, `${OUT}/bed.m4a`);
execFileSync('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-i', `${OUT}/cut.mp4`, '-i', `${OUT}/bed.m4a`,
    '-filter_complex', `[1:a]aresample=48000,aformat=channel_layouts=mono,volume=0.05,afade=t=in:st=0:d=1.5,` +
    `afade=t=out:st=${(total - 2.5).toFixed(2)}:d=2.5[mus];[0:a][mus]amix=inputs=2:normalize=0,atrim=0:${total.toFixed(2)}[a]`,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    `${OUT}/trigonometrie-1440p.mp4`], { stdio: 'inherit' });

// YouTube chapters: every scene from its mark (its voice minus the lead), the first one at 0:00
const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const chapters = SCENES.map((sc, i) => (i === 0 ? '0:00' : mmss(Math.max(0, at[i] - LEAD))) + ' ' +
    (sc.n === '00' ? '' : 'Kapitel ' + Number(sc.n) + ' · ') + sc.title);
chapters.push(mmss(dur(`${OUT}/body.mp4`)) + ' Abspann');
fs.writeFileSync(OUT + '/chapters.txt', chapters.join('\n') + '\n');
console.log(chapters.join('\n'));
console.log('Stimmen bei', at.map((t) => t.toFixed(2)).join(' '));
console.log('fertig:', `${OUT}/trigonometrie-1440p.mp4`, mmss(total));
