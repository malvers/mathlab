// Fraktal demo — step 2: one continuous take of the lab, plus the four inserts.
//
// FIVE MEASURED FACTS ABOUT THIS LAB DRIVE EVERY DECISION BELOW (fraktal/measure.mjs,
// measure2.mjs, probe.mjs — none of this is guessed):
//
//  1. Nothing is reachable from outside. mode, zoom, maxIter, centerX/Y and juliaX/Y
//     all live in a closure. So the whole choreography runs on DOM buttons, the two
//     c sliders, the arrow keys and the wheel — there is no App object to talk to.
//  2. The shipped default is JULIA, not Mandelbrot, and the fractal canvas is sized
//     only once its plane has been shown. Every take therefore starts with
//     localStorage.clear(), a reload, #btn-mode-m and #btn-plane-fractal.
//  3. The orbit view draws at most ORBIT_LEG_MAX = 10 legs. That is why scene 3 uses
//     c = 0.35 (escapes after 8) and not the plotted c = 0.3 (needs 12) — see the
//     note in narration.mjs.
//  4. At the default orbit scale the view reaches to about x = 1.9, and the eighth
//     link of scene 3 sits at 2.21 — just off the edge. Six wheel clicks out bring
//     both the escaping link and the dashed |z| = 2 circle into one frame.
//  5. ZOOM_MAX = 200000, and the wheel really does stop there. Scene 7 is that fact:
//     the counter climbs, sticks at 200.000, and the wheel keeps turning.
//
// TWO THINGS DECIDE SCENE 6, both found by looking rather than by reasoning:
//   - The lab's OWN default Julia c is -0.7 + 0.27015i, which escapes after 96 steps
//     and so lies OUTSIDE the set: its Julia set is a dust. Using it to illustrate
//     "connected" would have been exactly wrong.
//   - c = 0.4 + 0.4i is outside too, but at this scale it still RENDERS as one solid
//     cluster - the narration would have claimed a break-up the picture does not show.
//     c = 0.5 + 0.5i falls into separate clumps you cannot miss (_juliacheck.mjs).
// So scene 6 runs c = -0.2 (fat and connected) -> c = -1 (the basilica, still
// connected) -> c = 0.5 + 0.5i (dust).
//
// AND IT IS RECORDED BEFORE THE DEEP ZOOMS, out of order, because the zoom SURVIVES
// the mode switch: coming out of scene 7 the Julia plane inherits zoom 200 000 and is
// solid black. #btn-reset does not rescue it - the reset is animated, takes over two
// and a half seconds to unwind, and then climbs back to zoom 234 on its own. Recording
// scene 6 while the lab is still at zoom 1 avoids all of it; run3 puts the scenes back
// into the order of the script.
//
// VP_CHECK=1 walks the choreography without recording. VP_SPEED=6 shortens waits.
// ONLY=lab|karten records one half, CARDS=s9 a single insert.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = workDir('fraktal');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/mandelbrot.html';
const AIR = 1600;
const EXTRA = { s5: 1200, s7: 1200 };
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;
const ONLY = process.env.ONLY || '';

const ALL_CARDS = ['s4', 's8', 's9', 's10'];
const CARD_SCENES = process.env.CARDS ? process.env.CARDS.split(',') : ALL_CARDS;

/* The point scene 5 flies to: on the boundary, in the seahorse valley. The wheel zoom
   is anchored on the cursor (centerKeepingFocalPlane), so the c under the mouse stays
   put — park the cursor there once and leave it. */
const SEAHORSE = { re: -0.743643887, im: 0.131825904 };

/* ---------------------------------------------------------------- the lab take */
async function labTake() {
  await runScenes([
    { name: 'main', url: LAB, run: async (p, { mark }) => {
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
        const left = () => deadline - Date.now();
        const safe = async (label, fn) => { try { await fn(); } catch (e) { mark('SKIP ' + label + ': ' + e.message.slice(0, 70)); } };

        /* --- the lab's controls; there is no other way in --- */
        const mode = async (m) => { await p.click(m === 'J' ? '#btn-mode-j' : '#btn-mode-m'); await tick(500); };
        const plane = async (v) => { await p.click(v === 'ORBIT' ? '#btn-plane-orbit' : '#btn-plane-fractal'); await tick(700); };
        /** The two sliders run in thousandths (-2000 … 2000). In Mandelbrot orbit view
         *  they set the point c; in Julia mode they set the Julia parameter. */
        const setC = async (re, im) => p.evaluate(([re, im]) => {
          for (const [mount, v] of [['jx-mount', re], ['jy-mount', im]]) {
            const inp = document.querySelector('#' + mount + ' input.cyber-slider');
            if (!inp) return;
            inp.value = String(Math.round(v * 1000));
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, [re, im]);
        /** Glide c from one point to another, so the film shows a journey, not a jump. */
        const glideC = async (from, to, ms, steps) => {
          const n = Math.max(2, steps || Math.round(ms / 70));
          for (let i = 1; i <= n; i++) {
            const u = i / n;
            await setC(from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u);
            await tick(ms / n);
          }
        };
        const legs = async (n, gapMs) => {                 // grow the chain link by link
          for (let i = 0; i < 12; i++) await p.keyboard.press('ArrowDown');
          await tick(260);
          for (let i = 0; i < n; i++) { await p.keyboard.press('ArrowUp'); await tick(gapMs); }
        };
        const zoomRead = () => p.evaluate(() =>
          parseFloat((document.getElementById('readout-zoom')?.textContent || '').replace(/\./g, '').replace(',', '.')));
        const canvasBox = (sel) => p.evaluate((s) => {
          const c = document.querySelector(s), r = c.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height, bw: c.width, bh: c.height };
        }, sel);
        /** The HUD box is a help text for a human at the keyboard, not for the film. */
        const hud = async (on) => {
          const vis = await p.evaluate(() => !document.getElementById('orbit-hud')?.classList.contains('orbit-hud-hidden'));
          if (vis !== on) { await p.keyboard.press('Control+d'); await tick(250); }
        };

        /* ---------- preparation: everything before the first mark stays out of the cut */
        await p.evaluate(() => localStorage.clear());
        await p.reload({ waitUntil: 'load' });
        await tick(2200);
        await p.evaluate(() => document.getElementById('local-badge')?.remove());
        await mode('M');                                   // shipped default is JULIA
        await plane('FRACTAL');                            // and the canvas is sized only when shown
        await tick(1800);                                  // Orbitron, and the first render

        /* ---------- s1: nobody drew this ---------- */
        await scene('s1');
        await rest();

        /* ---------- s6: every point its own world (recorded here, at zoom 1) ---------- */
        await mode('J');
        await tick(1200);
        await setC(-0.2, 0);                                // inside the set: connected
        await tick(1000);
        await scene('s6');
        await at(1600);
        await glideC([-0.2, 0], [-1.0, 0], Math.max(1500, durs.s6 * 340));    // still inside
        await at(durs.s6 * 640);
        await glideC([-1.0, 0], [0.5, 0.5], Math.max(1800, durs.s6 * 400));   // outside: dust
        await rest();

        /* ---------- s2: the question, asked of one point that stays ---------- */
        await mode('M');
        await plane('ORBIT');
        await safe('hud aus', () => hud(false));
        await setC(-0.2, 0);
        await legs(0, 0);
        await tick(600);
        await scene('s2');
        await at(3200);
        await legs(10, Math.max(240, (durs.s2 * 1000 - 5200) / 10));   // one link at a time
        await rest();

        /* ---------- s3: one fingerbreadth further, and it runs away ---------- */
        await setC(0.35, 0);
        await legs(0, 0);
        {
          /* six clicks out, so the |z| = 2 circle and the escaping link share a frame */
          const b = await canvasBox('#orbit-canvas');
          await p.mouse.move(b.x + b.w * 0.5, b.y + b.h * 0.5);
          for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 240); await tick(70); }
        }
        await tick(700);
        await scene('s3');
        await at(3600);
        await legs(8, Math.max(300, (durs.s3 * 1000 - 6000) / 8));
        await rest();

        /* ---------- s5: the boundary does not stop ---------- */
        await safe('hud an', () => hud(true));
        await plane('FRACTAL');
        await tick(900);
        const fb = await canvasBox('#canvas');
        {
          /* same mapping as the shader: uv = (frag - res/2) / min(res), c = centre + uv*3/zoom,
             and at this moment the centre is (0,0) and the zoom is 1 */
          const MIN = Math.min(fb.bw, fb.bh);
          await p.mouse.move(fb.x + fb.w * 0.5 + SEAHORSE.re / 3 * MIN,
                             fb.y + fb.h * 0.5 - SEAHORSE.im / 3 * MIN);
        }
        await tick(500);
        await scene('s5');
        /* Scene 5 has to LAND somewhere, not just zoom for a while: past about 4e4 the
           seahorses wash out into flat water (measure2's ladder), and at 1e2 there is
           nothing to see yet. Hand-tuning the click rate got it wrong twice - the lab
           damps the wheel at depth, so a fixed rate lands wherever it lands. This aims
           instead: every pass reads the zoom, works out how many clicks are still
           missing and spreads them over the time that is left. */
        const S5_TARGET = 1.2e4;
        while (left() > 900) {
          const z = await zoomRead();
          const need = Math.log(S5_TARGET / Math.max(1, z)) / Math.log(1.08);
          if (need <= 0) { await tick(300); continue; }
          const passes = Math.max(1, Math.round(left() / 500));
          const per = Math.max(1, Math.min(8, Math.ceil(need / passes)));
          for (let i = 0; i < per; i++) await p.mouse.wheel(0, -240);
          await tick(460);
        }
        await rest();
        mark('s5 zoom=' + (await zoomRead()));

        /* ---------- s7: where the tool ends (and the boundary does not) ---------- */
        await scene('s7');
        let stuckAt = null;
        while (left() > 700) {
          for (let i = 0; i < 3; i++) await p.mouse.wheel(0, -240);
          await tick(340);
          const z = await zoomRead();
          if (z >= 199999 && stuckAt === null) { stuckAt = (Date.now() - t0) / 1000; mark('s7 Anschlag bei ' + stuckAt.toFixed(1) + 's'); }
        }
        await rest();
      } },
  ], { outDir: OUT, showCursor: true, record: !CHECK });
}

/* ------------------------------------------------------------------ the inserts */
async function cardTake() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'karten.html';
    const file = path.resolve(HERE, rel);
    if (file !== HERE && !file.startsWith(HERE)) { res.statusCode = 403; res.end('nope'); return; }
    try { res.setHeader('Content-Type', 'text/html'); res.end(fs.readFileSync(file)); }
    catch { res.statusCode = 404; res.end('nope'); }
  });
  await new Promise((r) => server.listen(8897, '127.0.0.1', r));
  await runScenes(CARD_SCENES.map((k) => ({
    name: k,
    url: `http://127.0.0.1:8897/karten.html?scene=${k}&dur=${durs[k].toFixed(2)}`,
    run: async (p, { mark }) => {
      await p.waitForFunction(() => window.__vpReady === true, null, { timeout: 30000 });
      mark(k);
      await p.waitForTimeout((durs[k] * 1000 + 900) / SPEED);
    },
  })), { outDir: OUT, record: !CHECK });
  server.close();
}

if (ONLY !== 'karten') await labTake();
if (ONLY !== 'lab') await cardTake();
console.log(CHECK ? '\nProbelauf fertig — nichts aufgenommen.' : '\nAufnahme fertig in ' + OUT);
