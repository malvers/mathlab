// Shell demo — step 2: one continuous take of the lab plus the equation card.
//
// WHAT THE LAB MEASUREMENTS DICTATE (nothing here is guessed — shell/measure.mjs):
//
//  1. EVERYTHING IS REACHABLE. The lab's script is a classic top-level script, so
//     applyChapter(), P, running, lineCount … are plain names for page.evaluate.
//     The sliders are real inputs (sl-lps, sl-smax, sl-da, sl-nuc) and an 'input'
//     event on them is exactly what a hand on the slider does.
//  2. THE LAB STARTS RUNNING chapter 1 on load. Scene 1 wants the finished tents of
//     chapter 6, so chapter 6 is pre-rolled for 9.5 s before the first mark (the ring
//     buffer holds 275 lines = 8.1 s at 34 lines/s).
//  3. A CLICK IN THE CANVAS IGNITES the cell under the cursor (mousedown, x only).
//     Scene 2 clicks into the living cell row (y = 162 at 1280x720: edgeH 170 minus
//     half a cell) so the cursor points at the cells that fire.
//  4. CHAPTER 3 IS DETERMINISTIC: both seeds are placed from ROWS, the fronts meet at
//     line 81 = 5.78 s after applyChapter('stoss') at 14 lines/s. The chapter is
//     started so that this moment lands at the end of Solita's 2.2 s pause.
//  5. CHAPTERS 5/6 RUN AT 24 LINES/S HERE (lab default 34): the ring buffer then keeps
//     11.5 s of history, so when the slider moves in scene 8 the old regime is still
//     on the upper half of the picture while the new one appears below — that is the
//     whole point of "Protokoll".
//  6. THE SLIDER ENDS AT 1.1; scene 10 raises its max to 1.4 and sets 1.3. The label
//     shows 1.30, P.sigma follows (v * mu_s), and Solita says that this lies beyond
//     the lab's slider.
//  7. THE COACH BOX covers a third of the shell; it is hidden for the take. Solita is
//     the coach in this film. The red LOCAL badge goes too.
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
const OUT = workDir('shell');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

/** Where Solita really falls silent in her own MP3 - the stage directions. */
function cues(scene, minLen = 1.0) {
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'info', '-i', `${OUT}/${scene}.mp3`,
    '-af', `silencedetect=noise=-40dB:d=${minLen}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = (r.stderr || '') + (r.stdout || '');
  const starts = [...out.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => parseFloat(m[1]));
  const ends = [...out.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? s + minLen, len: (ends[i] ?? s + minLen) - s }));
}
/** the n-th pause of at least `minLen` seconds - SSML breaks are picked by their length,
 *  so a short natural breath never steals the slot of a stage direction */
function pick(list, minLen, nth = 0) {
  const hits = list.filter((c) => c.len >= minLen);
  return hits[nth] || null;
}

const LAB = 'http://localhost:8765/shell.html';
const AIR = 1600;                        // breathing room after every scene's narration
const LEAD = 0.5;                        // the cut starts the voice 0.5 s after the mark
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;
const ONLY = process.env.VP_ONLY || '';

const CARD_SCENES = ['s6'];
const COLLISION = 5.78;                  // s after applyChapter('stoss'), line 81 at 14 lines/s
const STAGE_X = 287, STAGE_W = 993;      // #canvas-container at 1280x720 (measured)
const CELL_Y = 162;                      // the living cell row inside the edge panel

/* ------------------------------------------------------------------ the lab take */
async function labTake() {
  const CUE = {};
  for (const k of ['s2', 's4', 's8', 's9', 's10', 's11']) {
    CUE[k] = cues(k);
    console.log(k + '-Regiepausen:', CUE[k].map((c) => `${c.start.toFixed(1)}–${c.end.toFixed(1)} (${c.len.toFixed(1)})`).join(', ') || 'keine');
  }

  await runScenes([{
    name: 'main',
    url: LAB,
    async run(p, { mark }) {
      let deadline = 0, sceneT0 = 0;
      const scene = async (k) => {
        mark(k);
        sceneT0 = Date.now();
        deadline = sceneT0 + ((durs[k] || 20) * 1000 + AIR) / SPEED;
        if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
      };
      /** wait until `sec` seconds into the current scene */
      const atSec = async (sec) => { const w = sceneT0 + (sec * 1000) / SPEED - Date.now(); if (w > 20) await p.waitForTimeout(w); };
      const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
      const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
      const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${n}.png` }); };

      const chapter = (id) => p.evaluate((id) => applyChapter(id), id);
      const setSlider = (id, v) => p.evaluate(([id, v]) => {
        const s = document.getElementById(id);
        if (+v > +s.max) s.max = String(v);          // scene 10 goes beyond the lab's end stop
        s.value = String(v);
        s.dispatchEvent(new Event('input', { bubbles: true }));
        return s.value;
      }, [id, v]);
      const cursor = (on) => p.evaluate((on) => { const c = document.getElementById('__vp_cursor'); if (c) c.style.display = on ? '' : 'none'; }, on);
      const state = () => p.evaluate(() => ({ chapter: chapter.id, lines: lineCount, smax: +(P.sigma / P.mus).toFixed(2), lps: linesPerSecond, finished }));

      /* ------------------------------------------------------------- Startzustand */
      await p.waitForFunction(() => typeof applyChapter === 'function' && !!document.getElementById('sel-chapter'), null, { timeout: 20000 });
      await tick(1200);
      await p.evaluate(() => {
        document.getElementById('local-badge')?.remove();                  // the red LOCAL sticker is not in the film
        document.getElementById('math-coach-box').style.display = 'none';  // Solita is the coach here
      });
      await cursor(false);

      /* -- 1 · Wer malt die Schnecke? -------------------------------------------- */
      // chapter 6, pre-rolled until the ring buffer is full, then the mark
      await chapter('zelte');
      await tick(9500);
      await scene('s1');
      await rest();

      /* -- 2 · Das Bild ist ein Protokoll (Kernszene) ---------------------------- */
      // chapter 1 at 3 lines/s; two clicks into the cell row, each at the START of a
      // 1.5 s pause - the wedge must begin while she is still silent
      const c2a = pick(CUE.s2, 1.2, 0), c2b = pick(CUE.s2, 1.2, 1);
      const x1 = STAGE_X + STAGE_W * 0.25, x2 = STAGE_X + STAGE_W * 0.75;
      await scene('s2');
      await chapter('raumzeit');
      // the pointer appears only just before it moves - in the first take it stood
      // parked on the shell for twelve seconds before the first click
      await p.mouse.move(x1, CELL_Y + 260);
      await atSec(LEAD + (c2a ? c2a.start : 9.0) - 2.2);
      await cursor(true);
      await atSec(LEAD + (c2a ? c2a.start : 9.0) - 1.0);
      await p.mouse.move(x1, CELL_Y, { steps: 24 });
      await atSec(LEAD + (c2a ? c2a.start : 9.0) + 0.1);
      await p.mouse.click(x1, CELL_Y);
      await atSec(LEAD + (c2b ? c2b.start : 11.6) - 1.0);
      await p.mouse.move(x2, CELL_Y, { steps: 32 });
      await atSec(LEAD + (c2b ? c2b.start : 11.6) + 0.1);
      await p.mouse.click(x2, CELL_Y);
      await tick(1400);
      await shot('s2_klicks');
      await p.mouse.move(x2, 690, { steps: 20 });
      await cursor(false);
      await rest();

      /* -- 3 · Eine Zelle steckt an: das V (Kernszene) --------------------------- */
      await scene('s3');
      await chapter('welle');
      await rest();

      /* -- 4 · Zwei Wellen löschen sich aus (Kernszene) -------------------------- */
      // the collision (5.78 s after the chapter starts) lands at the END of her 2.2 s
      // pause, a hair before "und beim Treffen sind beide weg"
      const c4 = pick(CUE.s4, 1.6, 0);
      const startAt = LEAD + (c4 ? c4.end : 6.4) - 0.35 - COLLISION;
      await scene('s4');
      if (startAt < 0) console.log('WARN s4: Kollision kommt', (-startAt).toFixed(1), 's zu spät - Pause zu kurz');
      await atSec(Math.max(0, startAt));
      await chapter('stoss');
      await atSec(Math.max(0, startAt) + COLLISION + 0.6);
      await shot('s4_kollision');
      await rest();

      /* -- 5 · Der Schatten (Kernszene) ------------------------------------------ */
      await scene('s5');
      await chapter('schatten');
      await atSec(12);
      await shot('s5_schatten');
      await rest();

      /* (6 is the equation card, recorded separately) */

      /* -- 7 · Wenig Vorrat: Keile ----------------------------------------------- */
      await scene('s7');
      await chapter('zickzack');
      await setSlider('sl-lps', 24);
      await atSec(14);
      await shot('s7_keile');
      await rest();

      /* -- 8 · Ein Drittel mehr: Zelte (Kernszene) ------------------------------- */
      // slider to 0.8 at the START of the 4.5 s pause; the old regime stays above
      const c8 = pick(CUE.s8, 3.0, 0);
      await scene('s8');
      await atSec(LEAD + (c8 ? c8.start : 2.8));
      await setSlider('sl-smax', 0.8);
      await atSec(LEAD + (c8 ? c8.start : 2.8) + 6.5);
      await shot('s8_wechsel');
      await rest();

      /* -- 9 · Hunger und Überfluss (Kernszene) ---------------------------------- */
      // back to the lab's 34 lines/s: three regimes in a row need the faster history,
      // and the 1.1 tents must have formed by "Große Zelte" (first burst 4 s after the
      // switch at 34/s, measured)
      const c9a = pick(CUE.s9, 2.4, 0), c9b = pick(CUE.s9, 3.4, 0);
      await scene('s9');
      await setSlider('sl-lps', 34);
      await atSec(LEAD + (c9a ? c9a.start : 4.0));
      await setSlider('sl-smax', 0.3);
      await atSec(LEAD + (c9a ? c9a.start : 4.0) + 5);
      await shot('s9_hunger');
      await atSec(LEAD + (c9b ? c9b.start : 12.5));
      await setSlider('sl-smax', 1.1);
      await atSec(LEAD + (c9b ? c9b.start : 12.5) + 8);
      await shot('s9_ueberfluss');
      await rest();

      /* -- 10 · Jenseits des Reglers (Kernszene) --------------------------------- */
      const c10 = pick(CUE.s10, 2.4, 0);
      await scene('s10');
      await atSec(LEAD + (c10 ? c10.start : 5.5));
      await setSlider('sl-smax', 1.3);
      await atSec(LEAD + (c10 ? c10.start : 5.5) + 7);
      await shot('s10_streifen');
      await rest();

      /* -- 11 · Eine Reihe Zellen, zwei Stoffe ----------------------------------- */
      const c11 = pick(CUE.s11, 2.0, 0);
      await scene('s11');
      await atSec(LEAD + (c11 ? c11.start : 2.2));
      await setSlider('sl-smax', 0.8);
      await atSec(LEAD + (c11 ? c11.start : 2.2) + 12);
      await shot('s11_ende');
      console.log('Endzustand:', JSON.stringify(await state()));
      await rest();
      mark('end');
      await tick(900);
    },
  }], { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1, showCursor: true, record: !CHECK });
}

/* --------------------------------------------------------------- the card insert */
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
            await p.waitForTimeout((d * 1000 * 0.9) / SPEED);
            await p.screenshot({ path: `${OUT}/shot_card_${k}.png` });
            await p.waitForTimeout((d * 1000 * 0.1 + AIR) / SPEED);
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
console.log(CHECK ? 'SHELL PROBELAUF FERTIG — Bilder in ' + OUT : 'SHELL ROHMATERIAL in ' + OUT);
