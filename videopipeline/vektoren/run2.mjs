// Vektoren demo — step 2: film the lab. Everything happens inside vektoren.html; the
// outro cards come from run3.
//
// TWO TAKES: A covers the flat chapters (s1-s7), B the ones in space (s8-s14). TAKES=B
// films only that one. Take B opens on the chapter take A ended in, so the cut has no jump.
//
// WHAT THE LAB DICTATES (measured 17.09.2026, not guessed):
//  1. THE SLIDERS GET A NEW ID ON EVERY LOAD (`slider-<random>`), so nothing may be
//     addressed by id. Controls are picked by their label inside #ui-container, sliders by
//     their position in the active chapter's panel.
//  2. THE STAGES ARE TOP LEVEL: `stage2` (canvas, world <-> screen through w2s/s2w) and
//     `stage3` (three.js with a trackball). Dragging a point therefore uses the lab's own
//     w2s instead of guessed pixels, exactly like the dice lab's hit list.
//  3. THE 3D CHAPTERS NEED MOTION. A still render of a plane and its normal is hard to
//     read, so the camera orbits slowly while Solita talks - TrackballControls keeps
//     looking at its target, so only the position is animated.
//  4. THE ACTION CUES COME OUT OF SOLITA'S OWN MP3 (silencedetect, d = 1.0): every break of
//     1200 ms or more in narration.mjs is a stage direction.
//  5. dsf 2 / upscale 1 - real 2560x1440. Thin arrows and dashed helper lines are exactly
//     what an upscale destroys.
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait.
import fs from 'fs';
import { spawnSync } from 'child_process';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('vektoren');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/vektoren.html?lang=de';
const AIR = 1500;
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;

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
for (const k of Object.keys(durs)) {
  CUE[k] = cues(k);
  console.log(k + '-Regiepausen:', CUE[k].map((c) => c.start.toFixed(1) + '–' + c.end.toFixed(1)).join(', ') || 'keine');
}
const cueAt = (k, n, fallback) => (CUE[k] && CUE[k][n] ? CUE[k][n].end : fallback);

function makeTake(name, opening, scenes) {
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
        deadline = sceneT0 + ((durs[k] || 20) * 1000 + AIR) / SPEED;
      };
      const atSec = async (sec) => {
        const w = sceneT0 + (sec * 1000) / SPEED - Date.now();
        if (w > 20) await p.waitForTimeout(w);
      };
      const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };

      /* --- the lab, driven through its own API --------------------------------- */
      const tab = async (id) => { await p.evaluate((id) => switchTab(id), id); await tick(900); };

      /** Click a button or checkbox by the text on it, inside the visible panel. */
      const hit = async (text) => {
        // :visible matters - every chapter leaves its cards in the DOM, only one set is shown
        const sel = `#ui-container :is(button, .cyber-checkbox-wrapper):has-text("${text}"):visible`;
        try { await p.locator(sel).first().click({ timeout: 6000 }); }
        catch (e) { console.log('NICHT GEFUNDEN:', text, '—', e.message.split('\n')[0]); }
        await tick(500);
      };

      /** Tick a checkbox by its label and make sure it IS ticked. hit() only clicked the label's middle, and in
       *  the first cut "Repräsentanten" stayed off while Solita talked about the pale arrows (seen 18.09.2026). */
      const check = async (text) => {
        const box = p.locator(`#ui-container .cyber-checkbox-wrapper:has-text("${text}"):visible input`).first();
        try { await box.check({ timeout: 6000 }); }
        catch (e) { console.log('NICHT ANGEHAKT:', text, '—', e.message.split('\n')[0]); }
        console.log('  Haken', text, ':', await box.isChecked().catch(() => '?'));
        await tick(500);
      };

      /** Open the n-th dropdown of the panel and choose an option by index. */
      const choose = async (nth, optionIndex) => {
        const trig = p.locator('#ui-container .dropdown-trigger:visible').nth(nth);
        await trig.click({ timeout: 6000 });
        await tick(320);
        const opts = p.locator('#ui-container .dropdown-option:visible');
        const labels = await opts.allTextContents();
        console.log('  Auswahl', nth, ':', labels.map((s) => s.trim()).join(' · '));
        await opts.nth(optionIndex).click({ timeout: 6000 });
        await tick(600);
      };

      /** Move a slider of the panel in visible steps (its id changes on every load). */
      const slide = async (nth, to, steps = 10) => {
        const from = await p.evaluate((nth) => {
          const el = [...document.querySelectorAll('#ui-container input[type=range]')].filter((e) => e.offsetParent)[nth];
          return el ? Number(el.value) : null;
        }, nth);
        if (from === null) { console.log('Regler fehlt:', nth); return; }
        for (let i = 1; i <= steps; i++) {
          await p.evaluate(({ nth, v }) => {
            const el = [...document.querySelectorAll('#ui-container input[type=range]')].filter((e) => e.offsetParent)[nth];
            el.value = v;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, { nth, v: from + (to - from) * (i / steps) });
          await tick(90);
        }
      };

      /** Drag a registered 2D handle to a world position, through the lab's own mapping. */
      const dragTo = async (handle, target, stepMs = 70) => {
        const path = await p.evaluate(({ handle, target }) => {
          const cv = document.getElementById('canvas');
          const r = cv.getBoundingClientRect();
          const h = stage2.handles[handle];
          if (!h) return null;
          const from = h.get();
          const pts = [];
          for (let i = 0; i <= 12; i++) {
            const u = i / 12;
            const w = [from[0] + (target[0] - from[0]) * u, from[1] + (target[1] - from[1]) * u];
            const s = stage2.w2s(w);
            pts.push({ x: r.left + s[0], y: r.top + s[1] });
          }
          return pts;
        }, { handle, target });
        if (!path) { console.log('Griff fehlt:', handle); return; }
        await p.mouse.move(path[0].x, path[0].y);
        await p.mouse.down();
        for (const q of path.slice(1)) { await p.mouse.move(q.x, q.y); await tick(stepMs); }
        await p.mouse.up();
        await tick(250);
      };

      /** Swing the 3D camera around the scene - depth is what makes a plane readable. */
      const orbit = (deg, ms) => p.evaluate(({ deg, ms }) => new Promise((done) => {
        const cam = stage3 && stage3.camera;
        if (!cam) return done();
        const r = Math.hypot(cam.position.x, cam.position.z);
        const a0 = Math.atan2(cam.position.z, cam.position.x);
        const t0 = performance.now();
        const step = () => {
          const u = Math.min(1, (performance.now() - t0) / ms);
          const a = a0 + (deg * Math.PI / 180) * u;
          cam.position.x = r * Math.cos(a);
          cam.position.z = r * Math.sin(a);
          if (u < 1) requestAnimationFrame(step); else done();
        };
        step();
      }), { deg, ms: ms / SPEED });

      /* --------------------------------------------------------------- Startzustand */
      await p.evaluate(() => {
        localStorage.removeItem('cyber-lab-lang');
        Object.keys(localStorage).filter((k) => k.startsWith('coach-collapsed')).forEach((k) => localStorage.removeItem(k));
      });
      await p.reload({ waitUntil: 'load' });
      await p.waitForSelector('#ui-container .cyber-card, #ui-container .dropdown-trigger', { timeout: 20000 });
      await tick(2500);                                  // fonts, KaTeX, three.js
      await p.evaluate(() => document.getElementById('local-badge')?.remove());
      // Class 9b, 18.09.2026 (0:20): "die Box da oben ist zu groß, sonst sieht man das Koordinatensystem nicht
      // so richtig ... die Formeln entsprechend mit anpassen" - the lab's HUD card shrinks as a whole, formulas
      // included; at dsf 2 it stays sharp. Only in the film, the lab itself is untouched.
      await p.addStyleTag({ content: '#v-hud{transform:scale(.72);transform-origin:top left}' });
      await opening({ p, tab, hit, choose, slide, dragTo, orbit, tick });
      await tick(900);
      await shot(name + '_start');

      await scenes({ p, scene, atSec, rest, tick, shot, tab, hit, check, choose, slide, dragTo, orbit });

      mark('end');
      await tick(1200);
    },
  };
}

/* ------------------------------------------------------------------- Take A: die Ebene */
const TAKE_A = makeTake('takeA',
  async ({ tab }) => { await tab('grundlagen'); },
  async ({ scene, atSec, rest, tick, shot, tab, hit, check, choose, slide, dragTo }) => {
    /* -- 1 · Punkt oder Pfeil? (Kernszene) ----------------------------------- */
    await scene('s1');
    await atSec(cueAt('s1', 0, 9.0));
    await dragTo(0, [5, 3]);                    // P wandert
    await dragTo(0, [2, 4]);
    await atSec(cueAt('s1', 1, 17.0));
    await check('Repräsentanten');              // die blassen Kopien
    await shot('s1');
    await rest();

    /* -- 2 · Spitze minus Fuß -------------------------------------------------- */
    await scene('s2');
    // Class 9b, 18.09.2026 (0:47): "sieht ziemlich durcheinander aus ... den Winkel von dem grünen Vektor
    // verändern" - A(-2|-3) -> B(2|3) ran straight through the origin and over P's arrow. Now both stay in the
    // lower left: B drops by 6 (AB becomes (3|-3)), then A drops by the same 6 and AB is (3|3) again -
    // the same arrow as at the start, which is exactly what Solita says.
    await atSec(cueAt('s2', 0, 6.0));
    await dragTo(2, [-1, -5]);                  // B ziehen
    await atSec(cueAt('s2', 1, 13.0));
    await dragTo(1, [-4, -8]);                  // A hinterher, gleiche Verschiebung: der Pfeil ist wieder derselbe
    await shot('s2');
    await rest();

    /* -- 3 · Spitze an Fuß (Kernszene) ----------------------------------------- */
    await tab('rechnen');
    await scene('s3');
    await atSec(cueAt('s3', 0, 9.0));
    await dragTo(1, [2, 4]);                    // b verändern, das Parallelogramm folgt
    await atSec(cueAt('s3', 1, 19.0));
    await choose(0, 1);                         // Ansicht: Subtraktion
    await shot('s3');
    await rest();

    /* -- 4 · Strecken und spiegeln (Notbremse) --------------------------------- */
    await scene('s4');
    await choose(0, 2);                         // Ansicht: Vielfaches r · a
    await atSec(cueAt('s4', 0, 3.0));
    await hit('r = 2');
    await atSec(cueAt('s4', 1, 7.0));
    await hit('r = 0');
    await atSec(cueAt('s4', 2, 11.0));
    await hit('r = −1');
    await shot('s4');
    await rest();

    /* -- 5 · Wie lang ist ein Pfeil? -------------------------------------------- */
    await tab('betrag');
    await scene('s5');
    await atSec(2.0);
    await hit('Einheitskreis');
    await atSec(cueAt('s5', 0, 13.0));
    await hit('Einheitsvektor');
    await tick(600);
    await dragTo(0, [6, 2]);                    // a hinausziehen, der Einheitsvektor bleibt
    await dragTo(0, [4, 3]);
    await shot('s5');
    await rest();

    /* -- 6 · Jeden Punkt erreichen (Kernszene) ---------------------------------- */
    await tab('linkomb');
    await scene('s6');
    await atSec(cueAt('s6', 0, 7.0));
    await slide(0, 2);                          // r
    await slide(1, -1);                         // s
    await atSec(cueAt('s6', 1, 15.0));
    await hit('Ziel treffen');
    await shot('s6');
    await rest();

    /* -- 7 · Wenn beide dasselbe sagen (Kernszene, der Bruch) ------------------- */
    await scene('s7');
    await atSec(cueAt('s7', 0, 5.0));
    await hit('a ∥ b machen');
    await tick(1200);
    await slide(0, 2);                          // alles bleibt auf der Geraden
    await shot('s7');
    await rest();
  });

/* -------------------------------------------------------------------- Take B: der Raum */
const TAKE_B = makeTake('takeB',
  async ({ tab }) => { await tab('linkomb'); },   // hier endete Take A
  async ({ scene, atSec, rest, tick, shot, tab, hit, choose, slide, dragTo, orbit }) => {
    /* -- 8 · Ab in den Raum ----------------------------------------------------- */
    await tab('geraden');
    await scene('s8');
    await orbit(28, 6000);
    await atSec(cueAt('s8', 1, 14.0));
    await slide(6, 2);                           // r schiebt den Punkt auf der Geraden
    await slide(6, 0);
    await atSec(cueAt('s8', 2, 22.0));
    await hit('Punktprobe mit T');
    await hit('T auf g');
    await atSec(cueAt('s8', 2, 22.0) + 5.0);
    await hit('T daneben');
    await shot('s8');
    await rest();

    /* -- 9 · Der Winkelmesser (Kernszene) --------------------------------------- */
    await tab('skalar');
    await scene('s9');
    await orbit(20, 8000);
    await atSec(cueAt('s9', 0, 14.0));
    await hit('Projektion von b auf a');
    await atSec(cueAt('s9', 1, 20.0));
    await hit('orthogonal machen');
    await shot('s9');
    await rest();

    /* -- 10 · Der Pfeil, der auf beiden steht ----------------------------------- */
    await tab('kreuz');
    await scene('s10');
    await orbit(30, 9000);
    await atSec(cueAt('s10', 1, 16.0));
    await orbit(-20, 6000);
    await shot('s10');
    await rest();

    /* -- 11 · Ebenen lesen ------------------------------------------------------- */
    await tab('ebenen');
    await scene('s11');
    await orbit(26, 8000);                        // edge-on a plane is unreadable
    await atSec(cueAt('s11', 0, 8.0));
    await hit('Normalenvektor');
    await hit('Spurpunkte');
    await atSec(cueAt('s11', 1, 16.0));
    await slide(1, 1);                            // Koeffizient ändern: die Ebene kippt
    await slide(1, 3);
    await shot('s11');
    await rest();

    /* -- 12 · Trifft sie oder nicht? --------------------------------------------- */
    await tab('lage');
    await scene('s12');
    await orbit(22, 7000);
    await atSec(cueAt('s12', 1, 12.0));
    // The chapter offers only two views, so the parallel case is made by hand: the third
    // component of the direction goes to 0, which makes n o u = 0 (plane z = 0).
    await slide(5, 0);
    await shot('s12');
    await rest();

    /* -- 13 · Wie weit ist weg? (Kernszene) -------------------------------------- */
    await tab('abstand');
    await scene('s13');
    await orbit(24, 8000);
    await atSec(cueAt('s13', 1, 16.0));
    await choose(0, 1);                           // Punkt und Ebene
    await orbit(-18, 6000);
    await shot('s13');
    await rest();

    /* -- 14 · Abspann -------------------------------------------------------------- */
    await tab('grundlagen');
    await scene('s14');
    await tick(2500);
    await dragTo(0, [4, 2]);
    await shot('s14');
    await rest();
  });

const ALL = { A: TAKE_A, B: TAKE_B };
const want = (process.env.TAKES || 'A,B').split(',').map((s) => s.trim().toUpperCase());
const takes = want.map((k) => ALL[k]).filter(Boolean);
console.log('Takes:', want.join(' '), CHECK ? '(Probelauf)' : '(Aufnahme)');

await runScenes(takes, {
  outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1,
  showCursor: true, record: !CHECK,
});

console.log(CHECK ? 'VEKTOREN PROBELAUF FERTIG — Bilder in ' + OUT : 'VEKTOREN ROHMATERIAL in ' + OUT);
