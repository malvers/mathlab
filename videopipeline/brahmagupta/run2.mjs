// Brahmagupta demo — step 2: one continuous take of the lab. No card inserts:
// every one of the fifteen scenes happens inside brahmagupta.html itself.
//
// WHAT THE LAB DICTATES (measured, not guessed):
//
//  1. THE LAB HAS NO STATE OF ITS OWN in localStorage, but the shell has: the UI
//     language (cyber-lab-lang) and whether the coach box is collapsed. Both are
//     cleared before the take, then the box is collapsed on purpose — at 1280x720 it
//     covers the vertex A, and Solita speaks its text anyway. Collapsed it still shows
//     the step title, which is exactly the chapter label the film wants.
//  2. THE PROOF MODE IS DRAGGABLE THROUGHOUT. Dragging C changes the arc v, which
//     reshapes the quadrilateral while the diagonals stay perpendicular — that is what
//     scenes 1 and 4 need. The vertices are SVG circles with data-idx 0..3.
//  3. SCENE 2 BUILDS THE FIGURE UP, and the lab always draws it whole. The take hides
//     parts of its own drawing through one injected <style> and takes the rules back
//     one by one. Nothing is faked: what appears is the lab's own geometry.
//     Safe because draw() only runs on interaction, and scene 2 has none.
//  4. THE ACTION CUES COME OUT OF SOLITA'S OWN MP3 (silencedetect), like in Galton:
//     the long SSML breaks are the stage directions, so the checkbox falls exactly in
//     the gap she left for it.
//  5. dsf 2 / upscale 1 — the page really renders 2560x1440. The angle arcs and the
//     dashed circle are precisely the fine structures an upscale turns to mush.
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait.
import fs from 'fs';
import { spawnSync } from 'child_process';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('brahmagupta');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/brahmagupta.html?lang=de';
const AIR = 1500;                       // breathing room after every scene's narration
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;

/** Where Solita falls silent inside one scene — her own pauses are the cues. */
function cues(scene, minLen = 0.6) {
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'info', '-i', `${OUT}/${scene}.mp3`,
    '-af', `silencedetect=noise=-40dB:d=${minLen}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = (r.stderr || '') + (r.stdout || '');
  const starts = [...out.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => parseFloat(m[1]));
  const ends = [...out.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? s + minLen }));
}

const CUE = {};
for (const k of ['s2', 's3', 's4', 's11', 's13', 's14', 's15']) CUE[k] = cues(k);
for (const [k, v] of Object.entries(CUE)) {
  console.log(k + '-Regiepausen:', v.map((c) => c.start.toFixed(1) + '–' + c.end.toFixed(1)).join(', ') || 'keine');
}
/** the n-th pause of a scene, `end` = the action belongs to the words after it */
const cueAt = (k, n, fallback) => (CUE[k] && CUE[k][n] ? CUE[k][n].end : fallback);

await runScenes([{
  name: 'main',
  url: LAB,
  async run(p, { mark }) {
    let deadline = 0, sceneT0 = 0;

    const scene = async (k) => {
      mark(k);
      sceneT0 = Date.now();
      deadline = sceneT0 + ((durs[k] || 18) * 1000 + AIR) / SPEED;
      if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
    };
    const atSec = async (sec) => {
      const w = sceneT0 + (sec * 1000) / SPEED - Date.now();
      if (w > 20) await p.waitForTimeout(w);
    };
    const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
    const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
    const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${n}.png` }); };

    /* --- the lab, driven through its own DOM --- */
    /** viewBox point (600x600, xMidYMid meet) -> screen point */
    const toScreen = (x, y) => p.evaluate(([x, y]) => {
      const svg = document.getElementById('lab-canvas');
      const r = svg.getBoundingClientRect();
      const s = Math.min(r.width / 600, r.height / 600);
      return { x: r.x + (r.width - 600 * s) / 2 + x * s, y: r.y + (r.height - 600 * s) / 2 + y * s };
    }, [x, y]);
    const onCircle = (degrees) => toScreen(300 + 230 * Math.cos(degrees * Math.PI / 180),
                                           300 - 230 * Math.sin(degrees * Math.PI / 180));
    const vertexBox = (i) => p.evaluate((i) => {
      const r = document.querySelector(`[data-idx="${i}"]`).getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, i);

    /** Grab a vertex and walk it through a list of screen points. */
    const dragThrough = async (i, points, stepMs = 90) => {
      const from = await vertexBox(i);
      await p.mouse.move(from.x, from.y);
      await p.mouse.down();
      for (const q of points) { await p.mouse.move(q.x, q.y, { steps: 6 }); await tick(stepMs); }
      await p.mouse.up();
    };
    /** Swing a vertex around a centre, keeping its distance — that is how the
     *  relaxed model wants to be moved: sliding along the old circle would stretch
     *  the quadrilateral into a sliver. */
    const swingAround = async (i, centre, degs, stepMs = 420) => {
      const from = await vertexBox(i);
      const r = Math.hypot(from.x - centre.x, from.y - centre.y);
      const a0 = Math.atan2(from.y - centre.y, from.x - centre.x);
      await dragThrough(i, degs.map((d) => ({
        x: centre.x + r * Math.cos(a0 + d * Math.PI / 180),
        y: centre.y + r * Math.sin(a0 + d * Math.PI / 180),
      })), stepMs);
    };

    /** Slide a vertex along the circumcircle from one angle to the next. */
    const slide = async (i, degs, stepMs = 110) => {
      const pts = [];
      for (const d of degs) pts.push(await onCircle(d));
      await dragThrough(i, pts, stepMs);
    };

    const vp = (css) => p.evaluate((c) => { document.getElementById('vp-mask').textContent = c; }, css);
    const clickStep = async () => { await p.click('#step-next'); await tick(220); };
    const jumpTo = async (n) => {
      await p.click('#step-jump .dropdown-trigger');
      await tick(260);
      await p.click(`#step-jump .dropdown-option[data-id="${n}"]`);
      await tick(260);
    };
    const rule = async (n) => { await p.click(`#rule-slot .cyber-checkbox-wrapper >> nth=${n}`); await tick(260); };

    /* ------------------------------------------------------------- Startzustand */
    await p.waitForSelector('#mode-slot', { timeout: 20000 });
    await p.evaluate(() => {
      localStorage.removeItem('cyber-lab-lang');
      Object.keys(localStorage).filter((k) => k.startsWith('coach-collapsed')).forEach((k) => localStorage.removeItem(k));
    });
    await p.reload({ waitUntil: 'load' });
    await p.waitForSelector('#mode-slot', { timeout: 20000 });
    await tick(1400);
    await p.evaluate(() => {
      document.getElementById('local-badge')?.remove();      // the red LOCAL sticker is not in the film
      const st = document.createElement('style');
      st.id = 'vp-mask';
      document.head.appendChild(st);
    });
    await p.click('#mode-slot .cyber-radio-wrapper >> nth=1');   // BEWEIS
    await tick(500);
    await p.click('#math-coach-box .coach-title');               // collapse: it covers vertex A
    await tick(700);

    /* -- 1 · Etwas bleibt stehen (Kernszene) ----------------------------------- */
    // C sits at a0+v = 35 degrees. Eight slow positions, none of them near the 14 deg
    // gap the lab clamps at, so the drag never sticks.
    await scene('s1');
    await tick(2600);
    await slide(2, [50, 70, 95, 120, 100, 75, 45, 25, 35], 420);
    await shot('s1_gezogen');
    await rest();

    /* -- 2 · Drei Zutaten, mehr nicht (Kernszene) ------------------------------ */
    // The figure is taken apart and put back together: circle -> quadrilateral ->
    // diagonals -> the right angle. Three cues out of her own pauses.
    const HIDDEN_ALL = '.quad,.diagonal,.perp,.foot-dot,.mid-dot,.p-dot,.right-angle,' +
                       '.quad-side-hot,.quad-side-opp,.node-label';
    const HIDE_CONSTRUCTION = '.perp,.foot-dot,.mid-dot,.mark-e,.lbl-e,.lbl-f,' +
                              '.quad-side-hot,.quad-side-opp';
    await vp(HIDDEN_ALL + '{opacity:0}');
    await scene('s2');
    await atSec(cueAt('s2', 0, 5.0));
    await vp('.diagonal,.p-dot,.right-angle,.lbl-m,' +
             HIDE_CONSTRUCTION + '{opacity:0}');                // the quadrilateral appears
    await atSec(cueAt('s2', 1, 9.5));
    await vp('.right-angle,.p-dot,.lbl-m,' + HIDE_CONSTRUCTION + '{opacity:0}');   // diagonals
    await atSec(cueAt('s2', 2, 12.5));
    await vp(HIDE_CONSTRUCTION + '{opacity:0}');                   // the right angle appears
    await shot('s2_zutaten');
    await rest();

    /* -- 3 · Die Behauptung ---------------------------------------------------- */
    await scene('s3');
    // Her first sentence runs to the first pause at 9.0 s: "die Seite von B nach C"
    // lands at about 20 % of it, "Punkt E" at 45 %, "Punkt F" at 85 %.
    await atSec(1.6);
    await vp('.perp,.foot-dot,.mid-dot,.mark-e,.lbl-e,.lbl-f,.quad-side-opp{opacity:0}');
    await atSec(4.0);
    await vp('.mid-dot,.lbl-f,.quad-side-opp{opacity:0}');   // the perpendicular reaches E
    await atSec(7.6);
    await vp('');                               // ... and on to F: everything is visible
    await shot('s3_behauptung');
    await rest();

    /* -- 4 · Zehn Beispiele sind zehn Beispiele (Kernszene, der Dreh) ---------- */
    // Ten shapes in about twelve seconds, then the figure comes to rest well before
    // she says "und trotzdem ist das kein Beweis".
    await scene('s4');
    await tick(700);
    await slide(2, [70, 110, 140, 90, 55, 30], 280);
    await slide(1, [-80, -35, -95, -55], 280);
    await slide(2, [60, 100, 35], 280);
    await shot('s4_zehn');
    await rest();

    /* -- 5 · Zwei Winkel, ein Grund (Kernszene) -------------------------------- */
    await scene('s5');
    await tick(900);
    await clickStep();                          // step 1
    await shot('s5_peripherie');
    await rest();

    /* -- 6 · Zweimal neunzig Grad ---------------------------------------------- */
    await scene('s6');
    await tick(700);
    await clickStep();                          // step 2
    await shot('s6_innenwinkel');
    await rest();

    /* -- 7 · Derselbe Rest (Kernszene) ----------------------------------------- */
    await scene('s7');
    await tick(700);
    await clickStep();                          // step 3
    await shot('s7_ergaenzung');
    await rest();

    /* -- 8 · Über Kreuz (Notbremse) -------------------------------------------- */
    await scene('s8');
    await tick(700);
    await clickStep();                          // step 4
    await shot('s8_scheitel');
    await rest();

    /* -- 9 · Die Kette schließt sich (Kernszene) ------------------------------- */
    await scene('s9');
    await tick(700);
    await clickStep();                          // step 5
    await shot('s9_kette');
    await rest();

    /* -- 10 · Aus Winkeln werden Längen (Kernszene) ---------------------------- */
    // A short drag while she says "die Winkel ändern sich, die Häkchen bleiben".
    await scene('s10');
    await tick(700);
    await clickStep();                          // step 6
    await tick(6500);
    await slide(2, [50, 25, 35], 420);
    await shot('s10_gleichschenklig');
    await rest();

    /* -- 11 · Die andere Hälfte gehört Dir (Notbremse) ------------------------- */
    await scene('s11');
    await tick(700);
    await clickStep();                          // step 7 — the exercise
    await atSec(cueAt('s11', 2, 12.0));
    await p.click('#step-extra .cyber-checkbox-wrapper');   // LÖSUNG ZEIGEN, ganz zum Schluss
    await tick(400);
    await shot('s11_aufgabe');
    await rest();

    /* -- 12 · q.e.d. (Kernszene) ----------------------------------------------- */
    await scene('s12');
    await tick(600);
    await clickStep();                          // step 8
    await shot('s12_qed');
    await rest();

    /* -- 13 · Welches Glied reißt zuerst (Kernszene) --------------------------- */
    // The right angle goes, B is pulled aside, and step 2 shows where it broke:
    // the triangle at E keeps its right angle, the one at M does not.
    await scene('s13');
    await atSec(cueAt('s13', 0, 3.4));
    await rule(0);                              // DIAGONALEN SENKRECHT off
    await tick(500);
    const Mpos = await p.evaluate(() => {
      const r = document.querySelector('.p-dot').getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await swingAround(1, Mpos, [10, 20, 27, 24]);   // B swings aside, the shape survives
    await atSec(cueAt('s13', 1, 10.5));
    await jumpTo(2);
    await shot('s13_gerissen');
    await rest();

    /* -- 14 · Und ohne Kreis? -------------------------------------------------- */
    await scene('s14');
    await atSec(1.8);
    await rule(0);                              // the right angle comes back
    await tick(400);
    await rule(1);                              // ECKEN AUF DEM KREIS off
    await tick(400);
    // pull D towards M: it leaves the circle, the inscribed angle at A collapses
    const M = await p.evaluate(() => {
      const r = document.querySelector('.p-dot').getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    const Dv = await vertexBox(3);
    await dragThrough(3, [
      { x: M.x + (Dv.x - M.x) * 0.8, y: M.y + (Dv.y - M.y) * 0.8 },
      { x: M.x + (Dv.x - M.x) * 0.55, y: M.y + (Dv.y - M.y) * 0.55 },
    ], 500);
    await atSec(cueAt('s14', 1, 9.0));
    await jumpTo(1);
    await shot('s14_ohnekreis');
    await rest();

    /* -- 15 · Vierzehnhundert Jahre alt ---------------------------------------- */
    // Both rules back on, the clean figure returns, and the film ends on the lab's
    // dark blue with the drawing alive — never on black.
    await scene('s15');
    await tick(500);
    await rule(1);
    await tick(500);
    await jumpTo(0);
    await tick(600);
    await slide(2, [45, 60, 40, 35], 520);
    await shot('s15_abbinder');
    await rest();

    mark('end');
    await tick(1200);
  },
}], { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1, showCursor: true, record: !CHECK });

console.log(CHECK ? 'BRAHMAGUPTA PROBELAUF FERTIG — Bilder in ' + OUT : 'BRAHMAGUPTA ROHMATERIAL in ' + OUT);
