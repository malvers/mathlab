// Würfelspiel demo — step 2: film the lab. Everything the film shows happens inside
// wuerfelspiel.html; there are no card inserts (the outro cards come from run3).
//
// FOUR TAKES instead of one: the film is eleven minutes long, and a broken selector in
// minute nine would otherwise cost the whole take. Each take is its own browser context
// and its own mp4; run3 cuts every scene out of the take it belongs to.
//   A  s1-s12   Rundgang: spielen, zählen, Baum, Pfad- und Summenregel, Simulation
//   B  s13-s16  Rundgang: die typischen Fehler
//   C  s17-s21  Labor: eigene Würfel, normale Würfel, Efron
//   D  s22-s24  Rundgang: Zwillingsaufgabe, Lösung, Abbinder
// TAKES=A,C films only those. Every take opens on the picture the previous one ended on,
// so the cut has no jump.
//
// WHAT THE LAB DICTATES (measured 17.09.2026, not guessed):
//  1. THE SHELL KEEPS STATE in localStorage: the UI language (cyber-lab-lang) and whether
//     the coach box is collapsed. Both are cleared, then the box is COLLAPSED on purpose:
//     at 1280x720 it eats the upper half of the stage, and Solita says its text anyway.
//     Collapsed it still shows the station title. Measured: the views grow by 25-40 %.
//  2. THE SCRIPT IS TOP LEVEL, so page.evaluate reaches S, STATIONS, gotoStep, setMode,
//     setView, setPreset, toggleMerge, pickEfron, simRun, simToggle, render and hits.
//  3. TAPS ON THE CANVAS go through the lab's own hit list. For the face picker in s17 the
//     hit is taken from `hits` (stage hit first, then die A's six faces, then die B's) and
//     converted with VIEW - guessing pixel coordinates would break on any relayout.
//  4. CHANCE IS SEEDED: Math.random is replaced before load, so probe and take roll the
//     same dice. __vpSeed() re-seeds where the frame rate would otherwise shift the
//     sequence (the simulation eats random numbers per frame).
//  5. THE ACTION CUES COME OUT OF SOLITA'S OWN MP3 (silencedetect, d = 1.0): every break of
//     1200 ms or more in narration.mjs is a stage direction, and the action falls into it.
//     The 400 ms sentence pauses Doc asked for stay below that, so they are not mistaken
//     for cues - that is why the threshold moved from 0.8 to 1.0.
//  6. dsf 2 / upscale 1 - the page renders real 2560x1440. The tree's thin branches and the
//     KaTeX fractions on the canvas are exactly what an upscale turns to mush.
//  7. THE BOTTOM RIGHT CORNER STAYS FREE: this cut has no talking head, but a later D-ID
//     pass would put Solita's bubble there.
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait.
import fs from 'fs';
import { spawnSync } from 'child_process';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('wuerfelspiel');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/wuerfelspiel.html?lang=de';
const AIR = 1500;                        // breathing room after every scene's narration
const THINK = 5000;                      // the class thinks about the twin task (s22)
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;
const SEED = 20260917;                   // scene 1 rolls, seeded so probe and take agree
const SEED_RANDOM = 4711;                // the "ZUFÄLLIG" pair in s18

/** Where Solita falls silent inside one scene — her own pauses are the cues. */
function cues(scene, minLen = 1.0) {
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'info', '-i', `${OUT}/${scene}.mp3`,
    '-af', `silencedetect=noise=-40dB:d=${minLen}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = (r.stderr || '') + (r.stdout || '');
  const starts = [...out.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => parseFloat(m[1]));
  const ends = [...out.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? s + minLen }));
}

const CUE = {};
for (const k of ['s1', 's2', 's3', 's4', 's5', 's8', 's9', 's11', 's12', 's16', 's17', 's18', 's20', 's21']) {
  CUE[k] = cues(k);
  console.log(k + '-Regiepausen:', CUE[k].map((c) => c.start.toFixed(1) + '–' + c.end.toFixed(1)).join(', ') || 'keine');
}
/** the n-th pause of a scene; `end` = the action belongs to the words after it */
const cueAt = (k, n, fallback) => (CUE[k] && CUE[k][n] ? CUE[k][n].end : fallback);
const cueFrom = (k, n, fallback) => (CUE[k] && CUE[k][n] ? CUE[k][n].start : fallback);

/** Seeded Math.random, installed before the page runs. */
const SEED_JS = (seed) => {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  window.__vpSeed = (n) => { s = n >>> 0; };
  Math.random = next;
};

/** Everything a take needs before its first mark. */
function makeTake(name, scenes, opening) {
  return {
    name,
    url: LAB,
    async run(p, { mark }) {
      let deadline = 0, sceneT0 = 0;

      const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
      const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${n}.png` }); };
      const scene = async (k) => {
        mark(k);
        sceneT0 = Date.now();
        deadline = sceneT0 + ((durs[k] || 18) * 1000 + AIR) / SPEED;
      };
      /** wait until `sec` seconds into the current scene's narration */
      const atSec = async (sec) => {
        const w = sceneT0 + (sec * 1000) / SPEED - Date.now();
        if (w > 20) await p.waitForTimeout(w);
      };
      const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
      const ev = (fn, arg) => p.evaluate(fn, arg);
      const click = async (sel) => { await p.click(sel, { timeout: 8000 }); await tick(200); };
      const press = async (key) => { await p.keyboard.press(key); await tick(250); };

      /* --------------------------------------------------------------- Startzustand */
      await p.addInitScript(SEED_JS, SEED);
      await p.evaluate(() => {
        localStorage.removeItem('cyber-lab-lang');
        Object.keys(localStorage).filter((k) => k.startsWith('coach-collapsed')).forEach((k) => localStorage.removeItem(k));
      });
      await p.reload({ waitUntil: 'load' });
      await p.waitForSelector('#ws-solita, #ws-preset', { timeout: 20000 });
      await tick(2200);                                   // fonts, KaTeX and the 3D dice
      const ready = await p.evaluate(() => !!(window.Dice3D && Dice3D.ok));
      if (!ready) console.log('WARNUNG: kein WebGL — die Würfel wären flach!');
      await p.evaluate(() => document.getElementById('local-badge')?.remove());
      await click('#math-coach-box .coach-title');        // collapse: it covers half the stage
      await tick(500);
      await opening({ p, ev, tick, click, press });
      await tick(900);
      await shot(name + '_start');

      await scenes({ p, ev, scene, atSec, rest, tick, shot, click, press, mark });

      mark('end');
      await tick(1200);
    },
  };
}

/* ------------------------------------------------------------------ the four takes */
const TAKE_A = makeTake('takeA',
  async ({ p, ev, scene, atSec, rest, tick, shot, click }) => {
    /* -- 1 · Zwei Würfel, eine Frage ---------------------------------------- */
    await scene('s1');
    await tick(2200);
    await click('#ws-roll');
    await atSec(cueAt('s1', 0, 8.0));
    await click('#ws-roll');
    await atSec(cueAt('s1', 1, 16.0));
    await click('#ws-roll');
    await shot('s1');
    await rest();

    /* -- 2 · Sechs Flächen, nicht drei Zahlen -------------------------------- */
    await ev(() => gotoStep(1));
    await scene('s2');
    await atSec(cueAt('s2', 0, 14.0));
    await click('#ws-roll');
    await shot('s2');
    await rest();

    /* -- 3 · Zählen statt raten (Kernszene) ---------------------------------- */
    await ev(() => { gotoStep(3); S.focus = 'A'; render(); });
    await scene('s3');
    await atSec(cueAt('s3', 0, 11.1));
    await ev(() => { S.focus = 'B'; render(); });
    await atSec(cueAt('s3', 0, 11.1) + 7.0);
    await ev(() => { S.countHi = { A: null, B: 4 }; render(); });
    await shot('s3');
    await rest();

    /* -- 4 · Zwei Stufen ------------------------------------------------------ */
    await ev(() => { gotoStep(2); });
    await scene('s4');
    await atSec(cueAt('s4', 0, 9.0));
    await click('#ws-roll');
    await atSec(cueAt('s4', 1, 14.0));
    await click('#ws-roll');
    await shot('s4');
    await rest();

    /* -- 5 · Der wichtigste Trick --------------------------------------------- */
    // The station opens with Mia's branches already spread out, so the merge itself
    // happens inside her first pause.
    await ev(() => { gotoStep(4); S.merge = { die: 'B', grouped: false, u: 0, t0: 0, from: 0 }; render(); });
    await scene('s5');
    await atSec(cueAt('s5', 0, 9.5));
    await ev(() => toggleMerge(true));
    await atSec(cueFrom('s5', 1, 19.0));
    await ev(() => { S.merge = { die: 'A', grouped: false, u: 0, t0: 0, from: 0 }; render(); });
    await atSec(cueAt('s5', 1, 20.0));
    await ev(() => toggleMerge(true));
    await shot('s5');
    await rest();

    /* -- 6 · Stufe 1 (Notbremse) ---------------------------------------------- */
    await ev(() => gotoStep(5));
    await scene('s6');
    await shot('s6');
    await rest();

    /* -- 7 · An jedes Ende ----------------------------------------------------- */
    await ev(() => gotoStep(6));
    await scene('s7');
    await shot('s7');
    await rest();

    /* -- 8 · Die Pfadregel (Kernszene) ----------------------------------------- */
    await ev(() => { gotoStep(7); S.sel = 0; render(); });
    await scene('s8');
    await atSec(cueAt('s8', 0, 24.0));
    await ev(() => { S.sel = 1; render(); });
    await shot('s8');
    await rest();

    /* -- 9 · Die Sieben schlägt die Sechs -------------------------------------- */
    await ev(() => { gotoStep(8); S.sel = 0; render(); });
    await scene('s9');
    await atSec(cueAt('s9', 0, 7.0));
    await ev(() => { S.sel = 2; render(); });
    await atSec(cueAt('s9', 0, 7.0) + 2.6);
    await ev(() => { S.sel = 4; render(); });
    await atSec(cueAt('s9', 1, 14.0));
    await ev(() => { S.sel = 5; render(); });
    await shot('s9');
    await rest();

    /* -- 10 · Die Summenregel (Kernszene) -------------------------------------- */
    await ev(() => gotoStep(9));
    await scene('s10');
    await shot('s10');
    await rest();

    /* -- 11 · Das Rezept -------------------------------------------------------- */
    await ev(() => gotoStep(11));
    await scene('s11');
    await atSec(cueAt('s11', 0, 10.0));
    for (let i = 0; i < 5; i++) {
      await ev((i) => { S.recipeHi = i; render(); }, i);
      await tick(1100);
    }
    await shot('s11');
    await rest();

    /* -- 12 · Stimmt das wirklich? (Kernszene) ---------------------------------- */
    await ev(() => gotoStep(12));
    await scene('s12');
    await atSec(cueAt('s12', 0, 5.0));
    await click('#ws-sim1');
    await atSec(cueAt('s12', 1, 8.0));
    await click('#ws-sim100');
    await atSec(cueAt('s12', 2, 12.0));
    await click('#ws-sim1000');
    await atSec(cueAt('s12', 3, 16.0));
    await click('#ws-simrun');                       // Dauerlauf
    try {
      await p.waitForFunction(() => S.sim.n >= 200000, null, { timeout: 30000 / SPEED });
    } catch (e) { console.log('Simulation: 200 000 nicht erreicht —', await p.evaluate(() => S.sim.n)); }
    await click('#ws-simrun');                       // anhalten
    console.log('Simulation gestoppt bei', await p.evaluate(() => S.sim.n), 'Runden,',
      await p.evaluate(() => (S.sim.a / Math.max(1, S.sim.n)).toFixed(4)), 'für Lena');
    await shot('s12');
    await rest();
  },
  async ({ ev }) => { await ev(() => gotoStep(0)); });

const TAKE_B = makeTake('takeB',
  async ({ ev, scene, rest, shot, atSec, tick }) => {
    const setErr = async (i) => { await ev((i) => { S.err = i; refreshErrRadio(); render(); }, i); await tick(200); };

    /* -- 13 · Fehler 1: die halbe Wahrheit ------------------------------------- */
    await ev(() => gotoStep(10));
    await setErr(0);
    await scene('s13');
    await shot('s13');
    await rest();

    /* -- 14 · Fehler 2: Wahrscheinlichkeit fünf (Kernszene) --------------------- */
    await scene('s14');
    await setErr(1);
    await shot('s14');
    await rest();

    /* -- 15 · Fehler 3: der vergessene Weg -------------------------------------- */
    await scene('s15');
    await setErr(2);
    await shot('s15');
    await rest();

    /* -- 16 · Fehler 4 und 5 (Notbremse) ---------------------------------------- */
    await scene('s16');
    await setErr(3);
    await atSec(cueAt('s16', 0, 14.0));
    await setErr(4);
    await shot('s16');
    await rest();
  },
  async ({ ev }) => { await ev(() => gotoStep(12)); });   // opens on the simulation, where take A ended

const TAKE_C = makeTake('takeC',
  async ({ p, ev, scene, atSec, rest, tick, shot, click, press }) => {
    /* -- 17 · Eine Fläche, und das Spiel ist fair (Kernszene) -------------------- */
    await scene('s17');
    await atSec(2.4);
    await press('m');                                   // ins Labor
    await atSec(cueAt('s17', 0, 8.0));
    await ev(() => setView('netze'));
    await tick(600);
    // Mia's first face, taken from the lab's own hit list: stage hit, then A's six, then B's.
    const cell = await p.evaluate(() => {
      const r = document.getElementById('canvas').getBoundingClientRect();
      const faces = hits.filter((h) => h.w < 250);
      const h = faces[6];                                // die B, face index 0
      return { x: r.left + VIEW.ox + (h.x + h.w / 2) * VIEW.sc, y: r.top + VIEW.oy + (h.y + h.h / 2) * VIEW.sc };
    });
    await p.mouse.move(cell.x, cell.y);
    await tick(400);
    await p.mouse.click(cell.x, cell.y);                 // die Zahlenauswahl öffnet sich
    await tick(700);
    await shot('s17_picker');
    await atSec(cueFrom('s17', 1, 10.7));                // sie sagt "wird eine Sechs"
    await click('#ws-pick button >> nth=6');             // die 6
    await tick(500);
    const mia = await p.evaluate(() => S.lab.b.faces.slice().sort().join(','));
    console.log('Mias Würfel nach dem Tipp:', mia, mia === '4,4,4,6,6,6' ? 'ok' : 'FALSCHES FELD!');
    await atSec(cueAt('s17', 2, 24.0));
    await ev(() => setView('summe'));
    await shot('s17');
    await rest();

    /* -- 18 · Tauschen und Zufall (Notbremse) ------------------------------------ */
    await scene('s18');
    await ev(() => window.__vpSeed(4711));
    await atSec(1.6);
    await click('#ws-random');
    await atSec(cueAt('s18', 0, 8.0));
    await click('#ws-swap');
    await shot('s18');
    await rest();

    /* -- 19 · Gleiche Würfel, trotzdem kein Halbe-halbe -------------------------- */
    await scene('s19');
    await atSec(1.6);
    await ev(() => setPreset('normal'));
    await shot('s19');
    await rest();

    /* -- 20 · Der Würfel-Kreis (Kernszene) --------------------------------------- */
    await scene('s20');
    await atSec(1.2);
    await ev(() => { setMode('rundgang'); gotoStep(13); S.efron = 'AB'; render(); });
    await atSec(cueAt('s20', 0, 8.0) + 2.6);
    await ev(() => { S.efron = 'BC'; render(); });
    await atSec(cueAt('s20', 0, 8.0) + 4.6);
    await ev(() => { S.efron = 'CD'; render(); });
    await atSec(cueAt('s20', 1, 18.0));
    await ev(() => { S.efron = 'DA'; render(); });
    await shot('s20');
    await rest();

    /* -- 21 · Das Paradox nachgerechnet ------------------------------------------ */
    await scene('s21');
    await atSec(1.0);
    await ev(() => { setMode('labor'); setView('efron'); });
    await tick(700);
    const arrow = await p.evaluate(() => {
      const r = document.getElementById('canvas').getBoundingClientRect();
      const h = hits[hits.length - 1];                   // arrows are added last: AB, BC, CD, DA
      return { x: r.left + VIEW.ox + (h.x + h.w / 2) * VIEW.sc, y: r.top + VIEW.oy + (h.y + h.h / 2) * VIEW.sc };
    });
    await p.mouse.move(arrow.x, arrow.y);
    await tick(300);
    await p.mouse.click(arrow.x, arrow.y);               // Pfeil D → A lädt das Paar
    await tick(500);
    console.log('Efron-Paar im Labor:', await p.evaluate(() => S.labPreset));
    await atSec(cueAt('s21', 0, 6.0));
    await ev(() => { setView('pfad'); S.sel = 3; render(); });   // Weg (5|4)
    await atSec(cueAt('s21', 1, 16.0));
    await ev(() => setView('summe'));
    await shot('s21');
    await rest();
  },
  async ({ ev }) => { await ev(() => { gotoStep(10); S.err = 4; refreshErrRadio(); render(); }); });

const TAKE_D = makeTake('takeD',
  async ({ ev, scene, rest, tick, shot, click, press }) => {
    /* -- 22 · Jetzt ihr ---------------------------------------------------------- */
    await scene('s22');
    await shot('s22');
    await rest();
    await tick(THINK);                                   // Denkpause, Bild steht

    /* -- 23 · Die Lösung (Kernszene) --------------------------------------------- */
    await scene('s23');
    await tick(400);
    await press('l');                                    // LÖSUNG ZEIGEN
    await shot('s23');
    await rest();

    /* -- 24 · Abspann ------------------------------------------------------------- */
    await ev(() => gotoStep(0));
    await scene('s24');
    await tick(3000);
    await click('#ws-roll');
    await shot('s24');
    await rest();
  },
  async ({ ev }) => { await ev(() => gotoStep(14)); });   // the twin task, where take C's story leads

const ALL = { A: TAKE_A, B: TAKE_B, C: TAKE_C, D: TAKE_D };
const want = (process.env.TAKES || 'A,B,C,D').split(',').map((s) => s.trim().toUpperCase());
const takes = want.map((k) => ALL[k]).filter(Boolean);
console.log('Takes:', want.join(' '), CHECK ? '(Probelauf)' : '(Aufnahme)');

await runScenes(takes, {
  outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1,
  showCursor: true, record: !CHECK,
});

console.log(CHECK ? 'WÜRFELSPIEL PROBELAUF FERTIG — Bilder in ' + OUT : 'WÜRFELSPIEL ROHMATERIAL in ' + OUT);
