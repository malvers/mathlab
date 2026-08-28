// Conway's Iris demo — step 2: one continuous take of the whole lab.
//
// Everything the lab can do, in the order the narration explains it: empty stage →
// triangle → the extension rule → Conway's circle → incentre → proof → the iris →
// the wiper curve → constant width → Reuleaux → the square → CMA-ES → rotation path →
// heatmap → gradient editor → fixed scale + bright stage → a fresh triangle.
//
// A fresh browser context has an empty localStorage, so the lab really starts with every
// switch off — which is exactly the "die Bühne ist leer" opening.
//
// Every cue is given as an ABSOLUTE time inside its scene (at(ms)), so the latency of a
// click or a drag cannot push the following cues out of sync with the voice.
import fs from 'fs';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('iris');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const cues = JSON.parse(fs.readFileSync(`${OUT}/cues.json`, 'utf8'));

const AIR = 1800;                 // breathing room after every scene's narration
const EXTRA = {                   // scenes whose animation needs more than the words
  s8: 1500, s9: 1500, s12: 2500, s14: 2000, s15: 2500, s16: 3500, s18: 2500,
};
const VOICE = 500;                // the cut gives the voice a 500 ms head start (assemble.mjs)
// VP_SPEED=8 runs the same choreography in a fraction of the time — a dry run that proves
// every selector still exists before the real five-minute take is committed to disk.
// VP_SHOTS=1 additionally drops a PNG at the start of every scene.
const SPEED = Number(process.env.VP_SPEED || 1);
const SHOTS = !!process.env.VP_SHOTS;

await runScenes([
  { name: 'main', url: 'https://docalvers.de/irisvis.html?lang=de', run: async (p, { mark }) => {
      // ---------- helpers ----------
      let t0 = 0, deadline = 0;
      const scene = async (k) => {
        mark(k);
        t0 = Date.now();
        deadline = t0 + (durs[k] * 1000 + AIR + (EXTRA[k] || 0)) / SPEED;
        if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
      };
      const at = async (ms) => { const w = t0 + ms / SPEED - Date.now(); if (w > 20) await p.waitForTimeout(w); };
      const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
      const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
      // one hiccup must not cost the whole five-minute take
      const safe = async (label, fn) => { try { await fn(); } catch (e) { mark('SKIP ' + label + ': ' + e.message.slice(0, 60)); } };
      const chk = (label) => p.locator('#ui-container .cyber-checkbox-wrapper', { hasText: label }).first();
      const coach = () => p.click('#math-coach-box .coach-title');
      // page coordinates of a point of the construction (the canvas fills its container)
      const pt = (name) => p.evaluate((n) => {
        const g = geometry(state.d);
        const S = toScreen({ A: A, B: B, C: C, I: g.I }[n]);
        const r = document.getElementById('canvas').getBoundingClientRect();
        return { x: S.x + r.left, y: S.y + r.top };
      }, name);
      // page coordinates of the middle of the rotation path — that is where the search happens
      const pathCentre = () => p.evaluate(() => {
        const n = rotPath.length || 1;
        const S = toScreen({ x: rotPath.reduce((a, q) => a + q.x, 0) / n, y: rotPath.reduce((a, q) => a + q.y, 0) / n });
        const r = document.getElementById('canvas').getBoundingClientRect();
        return { x: S.x + r.left, y: S.y + r.top };
      });
      // drag `steps` small mouse moves from a page point — slow enough to be followed
      const dragBy = async (from, dx, dy, steps = 20, ms = 45) => {
        await p.mouse.move(from.x, from.y);
        await p.mouse.down();
        for (let i = 1; i <= steps; i++) { await p.mouse.move(from.x + dx * i / steps, from.y + dy * i / steps); await tick(ms); }
        await p.mouse.up();
      };

      await p.waitForSelector('#mw td', { timeout: 30000 }).catch(() => {});
      await tick(2500);                                  // Orbitron + KaTeX

      // ---------- s1: the empty stage, then T ----------
      await scene('s1');
      await at(5600);
      await p.mouse.move(1150, 660);
      await p.mouse.click(1150, 660);                    // put the keyboard on the stage
      await p.keyboard.press('t');
      await rest();

      // ---------- s2: labels, and the three side colours ----------
      await scene('s2');
      await at(300);
      await p.keyboard.press('a');
      await at(7600);
      await safe('fold', coach);                         // the stage is needed free now
      await rest();

      // ---------- s3: the rule, shown at A alone ----------
      await scene('s3');
      await at(6200);
      await safe('extA', () => chk('Verlängerung A').click());
      await rest();

      // ---------- s4: the same at B and C — six points ----------
      await scene('s4');
      await at(1400);
      await safe('extB', () => chk('Verlängerung B').click());
      await at(5200);
      await safe('extC', () => chk('Verlängerung C').click());
      await rest();

      // ---------- s5: Conway's circle, and it survives a dragged vertex ----------
      await scene('s5');
      await at(600);
      await p.keyboard.press('c');
      await at(5600);
      await safe('drag C', async () => dragBy(await pt('C'), 40, -30));
      await at(8600);
      await safe('fit', () => p.click('#btn-fit'));      // the drag switched auto-fit off
      await rest();

      // ---------- s6: the centre is the incentre ----------
      await scene('s6');
      await at(2600);
      await p.keyboard.press('i');
      await rest();

      // ---------- s7: the proof — perpendiculars, chords, and the formula ----------
      await scene('s7');
      await at(1600);
      await p.keyboard.press('g');                       // the three perpendiculars, length r
      await at(7800);
      await p.keyboard.press('l');                       // chords + perpendicular bisectors
      await at(14600);
      await safe('unfold', coach);                       // R = sqrt(r² + (s+d)²) and the error
      await rest();

      // ---------- s8: the iris opens (d) ----------
      await scene('s8');
      await at(200);
      await safe('fold', coach);
      await at(600);
      await p.keyboard.press('g');                       // clear the proof lines again
      await p.keyboard.press('l');
      await at(2400);
      await safe('breathe', () => p.evaluate(async (ms) => {
        // Fix the scale to the WIDEST state first, then let d breathe. With auto-fit on, the
        // circle would keep its size and only the triangle would shrink — that reads like
        // zooming out instead of a pupil opening.
        const amp = Math.round(geometry(0).s * 0.75);
        state.d = amp; fit(geometry(amp)); view.auto = false; state.d = 0; render();
        await new Promise((res) => {
          const start = performance.now();
          const step = () => {
            const u = Math.min(1, (performance.now() - start) / ms);
            state.d = Math.round((1 - Math.cos(u * 2 * Math.PI)) / 2 * amp);
            showD(); render();
            if (u >= 1) { state.d = 0; showD(); view.auto = true; fitAndRender(); return res(); }
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, 9200 / SPEED));
      await rest();

      // ---------- s9: the wiper curve, drawing itself ----------
      await scene('s9');
      await at(4600);
      await p.keyboard.press('w');
      await at(10200);
      await p.keyboard.press('d');                       // build it up like a windscreen wiper
      await rest();

      // ---------- s10: constant width — the measured value and the formula ----------
      await scene('s10');
      await at(2400);
      await safe('width row', async () => {
        await p.locator('#mw').scrollIntoViewIfNeeded();
        const row = await p.locator('#mw tr').nth(6).boundingBox();      // "Breite der Kurve"
        await p.mouse.move(row.x + row.width - 30, row.y + row.height / 2);
      });
      await at(8000);
      await safe('unfold', coach);                       // b = 2(s+d)
      await at(15500);
      await safe('fold', coach);
      await rest();

      // ---------- s11: equilateral + d to the floor = the Reuleaux triangle ----------
      await scene('s11');
      await at(1200);
      await safe('equilateral', () => p.click('#btn-eq'));
      await at(3600);
      await safe('reuleaux', () => p.evaluate(async (ms) => {
        const g0 = geometry(0);
        const target = -Math.min(g0.a, g0.b, g0.c);      // the small arcs shrink to points
        await new Promise((res) => {
          const start = performance.now();
          const step = () => {
            const u = Math.min(1, (performance.now() - start) / ms);
            state.d = target * u; showD(); fitAndRender();
            if (u >= 1) return res();
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, 4200 / SPEED));
      await rest();

      // ---------- s12: the square — the Reuleaux triangle turning inside it ----------
      await scene('s12');
      await at(1600);
      await safe('box', () => chk('Quadrat zeigen').click());
      await at(4400);
      await safe('autorot', () => chk('Auto-Rotation').click());
      await rest();

      // ---------- s13: CMA-ES — at full speed first, then in slow motion ----------
      await scene('s13');
      await at(200);
      await safe('autorot off', () => chk('Auto-Rotation').click());
      await at(500);
      await safe('back to d=0', () => p.evaluate(async (ms) => {
        const from = state.d;
        await new Promise((res) => {
          const start = performance.now();
          const step = () => {
            const u = Math.min(1, (performance.now() - start) / ms);
            state.d = Math.round(from * (1 - u)); state.angle = 0;
            showD(); showAngle(); fitAndRender();
            if (u >= 1) return res();
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, 1700 / SPEED));
      await at((cues.s13x ?? 9.4) * 1000 + VOICE);
      await p.keyboard.press('x');                       // the real thing — over in under a second
      let zoomAt = { x: 780, y: 360 };
      await safe('locate search', async () => { zoomAt = await pathCentre(); });
      // The population sits within a few world units of the optimum: at the fitted view the
      // ten candidates collapse into one blob, so the slow motion is shot as a close-up.
      await at((cues.s13slow ?? 18.0) * 1000 + VOICE - 800);
      await safe('zoom in', async () => {
        await p.mouse.move(zoomAt.x, zoomAt.y);
        for (let i = 0; i < 11; i++) { await p.mouse.wheel(0, -110); await tick(90); }   // ≈ 6×
      });
      await at((cues.s13slow ?? 18.0) * 1000 + VOICE + 1100);
      await safe('slow sweep', () => p.evaluate(async (ms) => {
        // Same 46 steps the key press just ran, but one per `ms/46` instead of one per frame,
        // so the population and the growing path can actually be followed.
        const g = geometry(state.d);
        state.box = true; state.path = true; rotPath = []; evals = 0; state.angle = 0;
        boxC = boxOptimal(curvePoints(g, 24), 0).c;
        sweepRun = { deg: 0 };
        const per = ms / 46;
        while (sweepRun) { stepSweep(); showAngle(); render(); await new Promise((r) => setTimeout(r, per)); }
      }, 19000 / SPEED));
      await at(40800);
      await safe('fit', () => p.click('#btn-fit'));      // back to the whole picture
      await rest();

      // ---------- s14: the path of the centre — zoomed in ----------
      await scene('s14');
      await at(3200);
      await safe('zoom on path', async () => {
        const P = await pathCentre();
        await p.mouse.move(P.x, P.y);
        for (let i = 0; i < 13; i++) { await p.mouse.wheel(0, -110); await tick(95); }   // ≈ 8×
      });
      await at(9500);
      await safe('cma readout', async () => {
        await p.locator('#cma-info').scrollIntoViewIfNeeded();
        const ci = await p.locator('#cma-info').boundingBox();
        await p.mouse.move(ci.x + ci.width * 0.5, ci.y + ci.height * 0.75);
      });
      await at(18500);
      await safe('fit', () => p.click('#btn-fit'));
      await rest();

      // ---------- s15: the quality landscape, turning with the square ----------
      await scene('s15');
      await at(900);
      await safe('heat', () => chk('Heatmap').click());
      await at(13000);
      await safe('autorot', () => chk('Auto-Rotation').click());
      await rest();

      // ---------- s16: the gradient editor drives the heatmap ----------
      await scene('s16');
      await at(200);
      await safe('autorot off', () => chk('Auto-Rotation').click());
      await at(500);
      await safe('room', () => p.evaluate(() => {
        // shrink and lower the figure so the editor window can sit above it
        const r = document.getElementById('canvas-container').getBoundingClientRect();
        const k = 0.72, cx = r.width / 2, cy = r.height / 2;
        view.auto = false;
        view.s *= k;
        view.ox = cx - (cx - view.ox) * k;
        view.oy = cy - (cy - view.oy) * k + 95;
        render();
      }));
      await at(1400);
      await p.keyboard.press('Meta+c');                  // the gradient window
      await at(3500);
      await safe('move window', async () => {
        const grip = await p.locator('#grad-win .grad-grip').boundingBox();
        await p.mouse.move(grip.x + grip.width / 2, grip.y + 7);
        await p.mouse.down();
        await p.mouse.move(grip.x + grip.width / 2 - 40, 22, { steps: 24 });
        await p.mouse.up();
      });
      await at(7000);
      await safe('drag stop', async () => {
        const pin = await p.locator('#grad-win .cg-pin').nth(1).boundingBox();
        const from = { x: pin.x + pin.width / 2, y: pin.y + pin.height / 2 };
        await p.mouse.move(from.x, from.y);
        await p.mouse.down();
        for (let i = 1; i <= 16; i++) { await p.mouse.move(from.x + i * 8, from.y); await tick(45); }
        for (let i = 16; i >= 0; i--) { await p.mouse.move(from.x + i * 8, from.y); await tick(35); }
        await p.mouse.up();
      });
      await at(11000);
      await safe('add stop', async () => {
        const strip = await p.locator('#grad-win .cg-strip').boundingBox();
        await p.mouse.dblclick(strip.x + strip.width * 0.24, strip.y + strip.height / 2);
      });
      await at(12600);
      await safe('recolour', () => p.evaluate(() => {
        // the OS colour picker never opens in a headless browser — set the well directly
        const inB = document.querySelector('#grad-win .cg-b');
        inB.value = '#00d2ff';
        inB.dispatchEvent(new Event('input', { bubbles: true }));
      }));
      await rest();

      // ---------- s17: comparable scale, and the bright stage ----------
      await scene('s17');
      await at(200);
      await p.keyboard.press('Escape');                  // close the gradient window
      await at(900);
      await safe('fit', () => p.click('#btn-fit'));
      await at(2000);
      await safe('absScale', () => chk('Skala fest').click());
      await at(8500);
      await p.keyboard.press('Meta+b');                  // helle Bühne
      await rest();

      // ---------- s18: a fresh triangle, the key table, reset ----------
      await scene('s18');
      await at(300);
      await p.keyboard.press('Meta+b');                  // back to the dark stage
      await at(900);
      await safe('random', () => p.click('#btn-rnd'));
      await at(4600);
      await p.keyboard.press('h');                       // the help overlay
      await at(5400);
      await safe('help scroll', () => p.evaluate(async (ms) => {
        // the card is taller than 86 vh — let the whole key table pass by
        const card = document.querySelector('#help-overlay .help-card');
        if (!card) return;
        const max = card.scrollHeight - card.clientHeight;
        if (max <= 4) return;
        await new Promise((res) => {
          const start = performance.now();
          const step = () => {
            const u = Math.min(1, (performance.now() - start) / ms);
            card.scrollTop = max * u;
            if (u >= 1) return res();
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, 4000 / SPEED));
      await at(10200);
      await p.keyboard.press('h');
      await at(11200);
      await p.keyboard.press('0');                       // theGreatReset
      await rest();
      mark('end');
  } },
], { outDir: OUT, showCursor: true });

console.log('IRIS RECORD DONE');
