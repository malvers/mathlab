// Jacquard demo — step 2: one continuous take of the lab, cut apart in run3.
//
// WHAT THE LAB MEASUREMENTS DICTATE (nothing here is guessed):
//
//  1. THE FRAME. The loom asks ONE point per cell (patternBit), so a cell that is half
//     ink is a coin toss. Over the whole drawing 45 threads give a cell purity of 0.25 —
//     confetti. The film's frame (winX .28 winY .63 winW .14 winH .284) comes to 0.81,
//     and the cloth reads. Scenes 1 to 6 and 13 run on it: 45 threads, 45 x 56 cards.
//  2. RESOLUTION IS ONLY VISIBLE IN THE CLOTH. Both pattern maps render the design as a
//     function at screen resolution — the circle is smooth there even at 16 threads. So
//     scenes 10 to 12 are WEBSTUHL scenes; the excerpt bottom right is the evidence and
//     its caption carries the thread count.
//  3. ONE ROW = 2.42 s / tempo (swap .85 + card .45 + shed .35 + fly .55 + beat .22), and
//     SCHRITT caps the tempo at 2x. Scene 3 therefore steps at 0.35 (6.9 s per row, slow
//     enough to watch a needle being pushed aside), scene 5 at 1x, and above tempo 8 the
//     loom drops the animation and just fills the cloth — that is scene 6.
//  4. THE CARD UNDER THE POINTER exists only on the big pattern map (makeMap big=true).
//     And it is unreadable until the map is zoomed: nine wheel notches of -120 give
//     z = 1.0015^1080 ~ 5x, where the 0.14 wide frame fills the picture.
//  5. The sidebar stays shut for the whole take. Everything is driven through the lab's
//     own state and the SCHRITT button, so the picture shows the machine, not the panel.
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait. VP_SHOTS=1 also shoots stills during a real take.
import fs from 'fs';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('jacquard');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/jacquard.html';
const WIN = [0.28, 0.63, 0.14, 0.284];   // the film's frame, purity 0.81 at 45 threads
const FULL = [0, 0, 1, 1];
const AIR = 1600;                        // breathing room after every scene's narration
const EXTRA = { s6: 1200, s10: 2000, s11: 1500 };
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;

await runScenes([{
  name: 'main',
  url: LAB,
  async run(p, { mark }) {
    let t0 = 0, deadline = 0;

    /* --- the clock: every scene lasts as long as Solita needs, plus air --- */
    const scene = async (k) => {
      mark(k);
      t0 = Date.now();
      deadline = t0 + ((durs[k] || 20) * 1000 + AIR + (EXTRA[k] || 0)) / SPEED;
      if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
    };
    const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
    const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
    const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${n}.png` }); };

    /* --- the lab, driven through its own state --- */
    const look = (cam, tgt, time = 1.4) => p.evaluate(([c, t, s]) => {
      controls.smoothTime = s;
      controls.setLookAt(c[0], c[1], c[2], t[0], t[1], t[2], true);
    }, [cam, tgt, time]);
    const jump = (cam, tgt) => p.evaluate(([c, t]) =>
      controls.setLookAt(c[0], c[1], c[2], t[0], t[1], t[2], false), [cam, tgt]);
    const setup = (o) => p.evaluate((o) => {
      if (o.design) S.design = o.design;
      if (o.threads) S.threads = o.threads;
      if (o.win) [S.winX, S.winY, S.winW, S.winH] = o.win;
      if (o.speed !== undefined) S.speed = o.speed;
      rebuildPattern();
      if (o.reset !== false) reset();
    }, o);
    const tempo = (v) => p.evaluate((v) => { S.speed = v; syncSpeedSlider(); }, v);
    const preweave = (frac) => p.evaluate((f) => {
      for (let k = 0, n = Math.floor(S.rows * f); k < n; k++) weaveRowInstant();
      S.sel = 0; S.shedT = 0; S.swapT = 0;
      for (let i = 0; i < S.n; i++) S.lift[i] = 0;
    }, frac);
    /** One animated row at the given tempo, waited out. SCHRITT caps at 2x. */
    const step = async (sp) => {
      await p.evaluate((s) => { S.speed = s; document.getElementById('jq-step').click(); }, sp);
      await tick(2420 / Math.min(sp, 2) + 250);
    };
    /** Fill the cloth in fast mode (tempo > 8 skips the shed animation), then stand still. */
    const fill = async (ms = 2000) => { await tempo(12); await tick(ms); await tempo(0); };
    const tab = async (name) => { await p.click(`.tab-btn[data-tab="${name}"]`); await tick(900); };

    /* ---------------------------------------------------------------- Startzustand */
    await p.waitForFunction(
      'typeof controls !== "undefined" && controls && typeof S !== "undefined" && S.n > 0',
      null, { timeout: 20000 });
    await p.evaluate(() => {
      localStorage.removeItem('jacquard-prefs-3');
      localStorage.removeItem('coach-collapsed:/jacquard.html');
    });
    await p.reload({ waitUntil: 'load' });
    await p.waitForFunction(
      'typeof controls !== "undefined" && controls && typeof S !== "undefined" && S.n > 0',
      null, { timeout: 20000 });
    await p.evaluate(() => {
      document.getElementById('local-badge')?.remove();   // the red LOCAL sticker is not in the film
      toggleSidebar();                                    // panel out of the picture, for good
      // Doc's note from the first take: both readouts stood there from second one, while
      // the film had not mentioned either. The counter arrives with the card (scene 3),
      // the excerpt with the design (scene 7). Nothing on screen before it is spoken of.
      document.getElementById('card-readout').style.display = 'none';
      document.getElementById('pattern-hud').style.display = 'none';
    });
    await tick(900);
    await setup({ design: 'stoff', threads: 45, win: WIN, speed: 0 });
    await preweave(0.45);                                 // a piece of cloth is already done
    await jump([2.6, 4.2, 6.2], [0.4, 2.4, -1.4]);        // close on card, needles, hooks
    await tick(1200);

    /* -- 1 · Kalter Start: eine Maschine, kein Rechner ------------------------------ */
    await scene('s1');
    await look([0, 10.5, 19.3], [0, 0, 0], 4.2);          // the lab's own establishing view
    await rest();

    /* -- 2 · Ein Faden, eine Nadel, ein Haken --------------------------------------- */
    await scene('s2');
    await look([1.8, 4.6, 4.2], [0.2, 2.9, -2.2], 2.6);   // into the heddle / needle forest
    await tick(3200);
    await shot('s2_nah');
    await rest();

    /* -- 3 · Die Entscheidung (Kernszene) ------------------------------------------- */
    // Slow single rows: the card drops, blocked needles are pushed down, the knife lifts
    // what is left standing. 0.35x makes one row last 6.9 s.
    await scene('s3');
    await p.evaluate(() => { document.getElementById('card-readout').style.display = ''; });
    await look([1.2, 4.0, 3.4], [0.0, 3.1, -2.6], 1.8);
    await step(0.35);
    await shot('s3_messer');
    await step(0.35);
    await step(0.35);
    await rest();

    /* -- 4 · Fach, Schiffchen, Anschlag --------------------------------------------- */
    await scene('s4');
    await look([3.0, 2.6, 5.6], [0.0, 0.7, -0.8], 1.8);   // low, on the shed and the fell
    await step(0.5);
    await shot('s4_schuss');
    await step(0.5);
    await rest();

    /* -- 5 · Eine Karte, eine Zeile ------------------------------------------------- */
    // The card change alone takes 0.85 s / tempo — at 1x it is there long enough to name.
    await scene('s5');
    await look([2.2, 5.4, 3.0], [0.2, 3.6, -3.0], 1.6);   // the card magazine on top
    await step(1);
    await shot('s5_karte');
    await step(1);
    await rest();

    /* -- 6 · Das Tuch wächst (Notbremse) -------------------------------------------- */
    await scene('s6');
    await look([0, 8.6, 15.5], [0, 0.5, 1.5], 2.4);       // back out, cloth in the frame
    await tempo(4);
    await tick(6000);
    await tempo(9);                                       // above 8 the loom stops animating
    await tick(4000);
    await tempo(0);
    await shot('s6_tuch');
    await rest();

    /* -- 7 · Umkehrung: die Zeichnung ----------------------------------------------- */
    await scene('s7');
    await p.evaluate(() => { document.getElementById('pattern-hud').style.display = ''; });
    await tab('muster');
    await rest();

    /* -- 8 · Die Karte ist die Zeichnung, in Löchern (Kernszene) --------------------- */
    await scene('s8');
    const box = await p.locator('#map-canvas').boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    const fx = box.x + box.width * (WIN[0] + WIN[2] / 2);
    const fy = box.y + box.height * (WIN[1] + WIN[3] / 2);
    await p.mouse.move(fx, fy);
    for (let i = 0; i < 9; i++) { await p.mouse.wheel(0, -120); await tick(140); }   // z ~ 5x
    // The wheel keeps the point under the cursor put, so the frame stays wherever the
    // pointer was - down and to the left. Pull it into the middle; above z = 1 the map
    // pans on a drag, and the gesture reads well on camera.
    await p.mouse.down();
    await p.mouse.move(cx, cy, { steps: 22 });
    await p.mouse.up();
    await tick(600);
    await p.evaluate(() => {                              // start see-through, then cover
      const s = document.getElementById('overlay-alpha-in');
      s.value = '10'; s.dispatchEvent(new Event('input', { bubbles: true }));
      const cb = document.getElementById('overlay-cb');
      if (!cb.checked) cb.click();
    });
    await tick(900);
    await shot('s8_durchsichtig');
    for (let v = 10; v <= 100; v += 6) {
      await p.evaluate((v) => {
        const s = document.getElementById('overlay-alpha-in');
        s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true }));
      }, v);
      await tick(360);
    }
    await shot('s8_deckend');
    await rest();

    /* -- 9 · Diese eine Pappe -------------------------------------------------------- */
    // The pointer rests on the card layer; the caption then reads KARTE n / 56 · m LÖCHER.
    await scene('s9');
    for (const dy of [-70, -35, 0, 35, 70, 35]) {
      await p.mouse.move(cx, cy + dy, { steps: 12 });
      await tick(900);
    }
    await shot('s9_karte');
    await rest();

    /* -- 10 · Motiv und Maschine sind zwei Dinge (Kernszene) -------------------------- */
    // The circle is a formula; only the sampling changes. The staircase lives in the cloth.
    await scene('s10');
    await tab('webstuhl');
    await jump([0, 8.6, 15.5], [0, 0.5, 1.5]);
    for (const t of [16, 48, 140]) {
      await setup({ design: 'kreis', threads: t, win: FULL });
      await fill(t > 100 ? 2200 : 1400);
      await shot('s10_' + t);
      await tick(4200);
    }
    await rest();

    /* -- 11 · Wo die Maschine etwas erfindet (Notbremse) ------------------------------ */
    // 40 threads over the whole drawing: purity 0.25. The cloth is confetti while the
    // excerpt beside it shows the fine drawing — that side-by-side IS the scene.
    await scene('s11');
    await setup({ design: 'stoff', threads: 40, win: FULL });
    await fill(1600);
    await shot('s11_konfetti');
    await rest();

    /* -- 12 · Tausend Fäden ----------------------------------------------------------- */
    await scene('s12');
    await setup({ threads: 1000 });
    await fill(2600);
    await shot('s12_1000');
    await rest();

    /* -- 13 · Finale: ein Loch, ein Faden --------------------------------------------- */
    await scene('s13');
    await setup({ design: 'stoff', threads: 45, win: WIN, speed: 0 });
    await preweave(1.0);
    await look([1.0, 3.8, 2.6], [-0.2, 3.0, -2.6], 3.0);   // back to a single needle
    await rest();
    mark('end');
    await tick(800);
  },
  // dsf 2 / upscale 1: the page really renders 2560 x 1440, so the master carries four
  // times the detail of the old upscaled take - which mattered here, because the cloth at
  // 1000 threads and the punched holes are exactly the fine structures an upscale eats.
}], { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1, record: !CHECK });

console.log(CHECK ? 'Probelauf fertig — Bilder in ' + OUT : 'Rohmaterial: ' + OUT + '/main.mp4');
