// Galton demo — step 2: one continuous take of the lab plus the five card inserts.
//
// WHAT THE LAB MEASUREMENTS DICTATE (nothing here is guessed — measure.mjs, measure2.mjs):
//
//  1. THE LAB STARTS RUNNING. sim.running is true from the first frame at tempo 1, and
//     the sliders remember their last state in localStorage. So: clear storage, reload,
//     set the sliders, THEN reset — otherwise the take opens with balls nobody ordered.
//  2. sim IS UNREACHABLE (it lives in a closure in the load handler). Every state change
//     is an input event on a slider or a click on a button. No page.evaluate shortcuts
//     like Fourier or Linse have.
//  3. FLIGHT TIME per ball: tempo 5 -> 2.0 s, 2 -> 4.2 s, 1 -> 7.5 s, 0.5 -> 14.1 s,
//     0.04 -> 2:40. Scene 1 therefore runs at 0.5 (0.78 s per peg, the whole ball in
//     14 s), not at the slow end of the slider.
//  4. THE COUNTER NEVER STOPS and pause freezes ~120 balls in mid-air at full tilt.
//     To hold a clean thousand: at 1000 set maxballs to 1 (no new ball until the board
//     is empty), then pause at 1001 — the new ball is still invisible above the board.
//     Only waitForFunction with raf polling is quick enough: a 120 ms poll lands at 1004.
//  5. THE ROW SLIDER COUNTS BINS (11..29, odd), and changing it wipes the statistics.
//     Scene 7 therefore shows 15 bins (14 rows) and 29 bins (28 rows) one after the
//     other, each collecting its own thousand — not side by side.
//  6. explorerEvery is 0 since 2026-09-04, so no ball is steered into an empty bin.
//     The outer bins stay empty and that is the point of scene 6.
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait. VP_ONLY=lab|karten records just one half.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = workDir('galton');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

/**
 * The long SSML breaks are stage directions, and this is how the choreography finds
 * them: measure where Solita actually falls silent in her own MP3, instead of adding
 * up guessed word rates. Returns one {start, end} per pause longer than `minLen`.
 *
 * Take `end` when the action belongs to the words that FOLLOW the pause (the switch in
 * scene 7 happens as she says "und jetzt achtundzwanzig"), and `start` when it belongs
 * to the words before it (the curve in scene 10 arrives on "…die Kurve dazu"). Using
 * the wrong one puts the action a whole sentence away from its cue.
 */
function cues(scene, minLen = 1.0) {
  // silencedetect reports on STDERR, so spawnSync and read stderr - execFileSync hands
  // back stdout, which is empty here and cost one whole take to find out.
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'info', '-i', `${OUT}/${scene}.mp3`,
    '-af', `silencedetect=noise=-40dB:d=${minLen}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = (r.stderr || '') + (r.stdout || '');
  const starts = [...out.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => parseFloat(m[1]));
  const ends = [...out.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? s + minLen }));
}

const LAB = 'http://localhost:8765/galtonboard.html';
const AIR = 1600;                        // breathing room after every scene's narration
const EXTRA = { s3: 1400, s7: 2000 };    // balls still falling when Solita is done
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;
const ONLY = process.env.VP_ONLY || '';

const CARD_SCENES = ['s4', 's5', 's6', 's8', 's9'];

/* ------------------------------------------------------------------ the lab take */
async function labTake() {
  // Measured BEFORE the camera rolls: calling ffmpeg between two scenes froze the
  // board for ten seconds and those seconds landed inside scene 3.
  const CUE = { s7: cues('s7'), s10: cues('s10') };
  for (const [k, list] of Object.entries(CUE)) {
    console.log(k + '-Regiepausen:', list.map((c) => c.start.toFixed(1) + '–' + c.end.toFixed(1)).join(', ') || 'keine');
  }

  await runScenes([{
    name: 'main',
    url: LAB,
    async run(p, { mark }) {
      let deadline = 0;

      let sceneT0 = 0;
      const scene = async (k) => {
        mark(k);
        sceneT0 = Date.now();
        deadline = sceneT0 + ((durs[k] || 20) * 1000 + AIR + (EXTRA[k] || 0)) / SPEED;
        if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
      };
      /** wait until `sec` seconds into the current scene - the cue Solita hands us */
      const atSec = async (sec) => {
        const w = sceneT0 + (sec * 1000) / SPEED - Date.now();
        if (w > 20) await p.waitForTimeout(w);
      };
      const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
      const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
      const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${n}.png` }); };

      /* --- the lab, driven the only way it can be: through its DOM --- */
      const set = (id, v) => p.evaluate(([id, v]) => {
        const s = document.getElementById(id);
        s.value = String(v);
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('change', { bubbles: true }));
      }, [id, v]);
      const click = (id) => p.evaluate((id) => document.getElementById(id).click(), id);
      const counter = () => p.evaluate(() => parseInt(
        document.getElementById('balls-counter-widget').textContent.replace(/\D/g, ''), 10) || 0);
      /** raf polling: a 120 ms interval would overshoot by seven balls at full tilt.
       *  The timeout is NOT divided by VP_SPEED — balls fall in real time whatever
       *  the dry run does to the waits, and 1000 of them need their 17 s either way. */
      const waitBalls = (n, ms = 90000) => p.waitForFunction((n) => (parseInt(
        document.getElementById('balls-counter-widget').textContent.replace(/\D/g, ''), 10) || 0) >= n,
        n, { timeout: ms, polling: 'raf' });
      /** the freeze recipe from the plot: a full board with nothing in the air */
      const holdAt = async (n) => {
        const t0 = Date.now();
        try {
          await waitBalls(n);
          await set('slider-maxballs', 1);        // no new ball until the board is empty
          await waitBalls(n + 1);                 // the next one is still above the board
        } catch (err) {
          // A stall here is always the same question: was the board running at all?
          // Say so instead of leaving a bare timeout in the log.
          const s = await p.evaluate(() => ({
            n: parseInt(document.getElementById('balls-counter-widget').textContent.replace(/\D/g, ''), 10) || 0,
            knopf: document.getElementById('btn-play-pause').textContent.trim(),
            faecher: document.getElementById('slider-rows').value,
            maxKugeln: document.getElementById('slider-maxballs').value,
          }));
          console.error(`holdAt(${n}) haengt nach ${((Date.now() - t0) / 1000).toFixed(1)} s:`, JSON.stringify(s));
          throw err;
        }
        await click('btn-play-pause');
        await tick(250);
      };
      const runFresh = async (bins, spawn, speed, maxb) => {
        if (bins) await set('slider-rows', bins);
        await set('slider-spawn', spawn);
        await set('slider-speed', speed);
        await set('slider-maxballs', maxb);
        await click('btn-reset');
        // Wait for the counter to actually SHOW the reset. resetStats() zeroes
        // droppedCount, but the widget is only redrawn on the next animation frame -
        // and waitForFunction evaluates its predicate the moment it is installed. So a
        // following waitBalls(500) could read the previous scene's 1001, return at
        // once, and holdAt would then sit out its whole timeout waiting for a board
        // that had barely started. That is what killed two of four lab takes.
        await p.waitForFunction(() => (parseInt(
          document.getElementById('balls-counter-widget').textContent.replace(/\D/g, ''), 10) || 0) < 5,
          null, { timeout: 10000, polling: 'raf' });
      };

      /* ------------------------------------------------------------- Startzustand */
      await p.waitForSelector('#btn-curve', { timeout: 20000 });
      await p.evaluate(() => {
        localStorage.removeItem('galtonboard-slider-settings-v2');
        localStorage.removeItem('coach-collapsed:/galtonboard.html');
      });
      await p.reload({ waitUntil: 'load' });
      await p.waitForSelector('#btn-curve', { timeout: 20000 });
      await tick(1200);
      await p.evaluate(() => {
        document.getElementById('local-badge')?.remove();   // the red LOCAL sticker is not in the film
      });
      // The lab is already dropping balls at tempo 1 while we set up. Stop it, so
      // scene 1 opens on an empty board rather than on somebody else's leftovers.
      await click('btn-play-pause');
      await tick(400);

      /* -- 1 · Eine Kugel, achtzehn Münzwürfe (Kernszene) ------------------------- */
      // maxballs 1 and tempo 0.5: one ball, 14.1 s, 0.78 s per peg. Long enough to
      // see every single left-or-right, short enough to fit under 20 s of narration.
      await runFresh(19, 10, 0.5, 1);
      await click('btn-play-pause');                        // start it again, now empty
      await scene('s1');
      await tick(6000);
      await shot('s1_unterwegs');
      await rest();

      /* -- 2 · Ein Dutzend Kugeln: nichts ---------------------------------------- */
      // One ball every 0.8 s at tempo 3 (~3.2 s in flight, so four in the air at most).
      // Twelve balls plus the last one landing is 12.8 s, which is what Solita needs -
      // at one ball a second and tempo 2 the picture stood still for nine seconds
      // after her last word.
      await scene('s2');
      await runFresh(0, 800, 3.0, 12);
      await tick(400);
      await holdAt(12);
      await shot('s2_dutzend');
      await rest();

      /* -- 3 · Tausend Kugeln: die Glocke (Kernszene) ----------------------------- */
      // Full tilt: 60 balls a second, so 100 after 1.7 s, 300 after 5 s, 1000 after
      // 16.7 s — the counter runs a beat ahead of Solita, never behind.
      await scene('s3');
      await runFresh(0, 10, 5.0, 500);
      await click('btn-play-pause');
      await waitBalls(300);
      await shot('s3_300');
      await holdAt(1000);                                   // held at 1001, nothing in the air
      await shot('s3_1000');
      await rest();

      /* -- 7 · Doppelt so viele Nägel (Notbremse) --------------------------------- */
      // A row change wipes the statistics, so the two boards are collected one after
      // the other: 15 bins = 14 rows, then 29 bins = 28 rows. Width 1.87 -> 2.65 bins,
      // a factor of exactly sqrt(2).
      // FIVE HUNDRED balls each, not a thousand: at 60/s a thousand takes 17 s, and
      // twice that would give 40 s of picture for 16 s of narration — the shortest
      // scene would become the longest. 500 is 8.3 s per board and the width, which
      // is all this scene compares, reads just as well.
      // The switch happens on her SECOND pause, measured out of her own audio.
      const c7 = CUE.s7;
      await scene('s7');
      await runFresh(15, 10, 5.0, 500);
      await click('btn-play-pause');
      await holdAt(500);
      await shot('s7_14reihen');
      // the END of the first pause: that is the moment she says "Und jetzt achtundzwanzig"
      await atSec(c7[0] ? c7[0].end : 8.6);
      await runFresh(29, 10, 5.0, 500);
      await click('btn-play-pause');
      await holdAt(500);
      await shot('s7_28reihen');
      await rest();
      // Scene 7 ends HERE. What follows is scene 10's board being filled, and run3
      // must not hang those seventeen seconds onto the end of scene 7.
      mark('s7ende');

      /* -- 10 · Achtzehn Münzwürfe ------------------------------------------------ */
      // The board is filled BEFORE the scene is marked: Solita says "und jetzt die
      // Kurve dazu" four seconds in, and waiting out a fresh thousand first would have
      // left her announcing it fifteen seconds early. The fill is cut out above.
      await runFresh(19, 10, 5.0, 500);
      await click('btn-play-pause');
      await holdAt(1000);
      const c10 = CUE.s10;
      await scene('s10');
      // the START of the pause: the curve arrives on "… und jetzt die Kurve dazu"
      await atSec(c10[0] ? c10[0].start : 4.2);
      await click('btn-curve');                             // the curve lays itself over
      await tick(1400);
      await shot('s10_kurve');
      await rest();
      mark('end');
      await tick(900);
    },
    // dsf 2 / upscale 1: the page really renders 2560 x 1440. The pegs and the thin
    // curve are exactly the fine structures an upscale eats.
  }], { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1, record: !CHECK });
}

/* --------------------------------------------------------------- the card inserts */
async function cardTake() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'karten.html';
    const file = path.resolve(HERE, rel);
    if (file !== HERE && !file.startsWith(HERE)) { res.statusCode = 403; res.end('nope'); return; }
    const type = file.endsWith('.js') ? 'text/javascript' : 'text/html';
    try { res.setHeader('Content-Type', type); res.end(fs.readFileSync(file)); }
    catch { res.statusCode = 404; res.end('nope'); }
  });
  await new Promise((r) => server.listen(8898, '127.0.0.1', r));
  try {
    await runScenes(CARD_SCENES.map((k) => {
      const d = durs[k];
      return {
        name: 'card_' + k,
        url: `http://127.0.0.1:8898/karten.html?scene=${k}&dur=${(d / SPEED).toFixed(2)}`,
        run: async (p, { mark }) => {
          await p.waitForFunction(() => window.__vpReady === true, null, { timeout: 20000 });
          mark(k);
          if (SHOTS) {
            await p.waitForTimeout((d * 1000 * 0.75) / SPEED);
            await p.screenshot({ path: `${OUT}/shot_card_${k}.png` });
            await p.waitForTimeout((d * 1000 * 0.25 + AIR) / SPEED);
          } else {
            await p.waitForTimeout((d * 1000 + AIR) / SPEED);
          }
          mark('end');
        },
      };
    }), { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1, record: !CHECK });
  } finally { server.close(); }
}

if (ONLY !== 'karten') await labTake();
if (ONLY !== 'lab') await cardTake();
console.log(CHECK ? 'GALTON PROBELAUF FERTIG — Bilder in ' + OUT : 'GALTON ROHMATERIAL in ' + OUT);
