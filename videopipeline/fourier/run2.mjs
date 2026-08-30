// Fourier demo — step 2: one continuous take of the lab, plus the three inserts.
//
// The film alternates between the lab and cards the lab cannot show (karten.html).
// The lab part is recorded as ONE take in film order, so the state flows the way a
// person would drive it: note -> more circles -> auto-evolve -> square -> heart ->
// the three-way comparison.
//
// Two things about this lab drive every decision below:
//   1. It STOPS BY ITSELF at t = 2*PI (animate() sets paused = true). So a scene never
//      just "runs"; it restarts a lap and waits for the lab to finish it. waitLap()
//      does that, and it is the only reliable clock here.
//   2. N is not a free slider - it snaps to 23 fixed steps, and "+1" means "one step".
//      Every N change therefore goes through adjustNTo(), never through clicks.
//
// VP_CHECK=1 walks the whole choreography WITHOUT recording (lib/record-cdp.mjs,
// record:false) and prints the frame check - seconds instead of minutes, and it
// catches broken selectors and off-stage framing before any footage is written.
// VP_SPEED=6 additionally shortens every wait. ONLY=lab|karten records one half.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { runScenes } from '../lib/record-cdp.mjs';
import { frameWatch } from '../lib/framecheck.mjs';
import { workDir } from '../lib/paths.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = workDir('fourier');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/fourier.html';
const AIR = 1600;                  // breathing room after every scene's narration
const EXTRA = {                    // scenes whose animation needs more than the words
  s4: 1800, s7: 800, s10: 1200, s11: 800,
};
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;
const ONLY = process.env.ONLY || '';

/* the lab scenes, in the order they appear in the film */
const LAB_SCENES = ['s1', 's2', 's3', 's4', 's6', 's7', 's8', 's10', 's11'];
/* the cards, each recorded on its own — the page paces itself to the narration length */
const CARD_SCENES = ['s5', 's9', 's12'];

/* ------------------------------------------------------------------ the overlay
   The lab shows N and the formula, but not how much of the drawing the current
   circles actually carry. That number is the spine of scenes 6, 7, 10 and 11, so
   the recording injects a badge that COMPUTES it from the lab's own state every
   frame - share of the summed squared radii, i.e. energy, not its square root.
   Nothing is passed in from outside; if the lab's numbers ever change, so does
   the badge. */
const ENERGY_BADGE = () => {
  if (window.__vpEnergy) return;
  const el = document.createElement('div');
  el.id = '__vp_energy';
  el.style.cssText = [
    'position:fixed', 'left:calc(var(--vp-left, 0px) + 28px)', 'bottom:28px', 'z-index:9000',
    'pointer-events:none', 'opacity:0', 'transition:opacity .35s ease',
    'font-family:Orbitron,sans-serif', 'padding:10px 18px', 'border-radius:3px',
    'background:rgba(11,24,54,.92)', 'border:1px solid rgba(0,210,255,.35)',
    'box-shadow:0 0 26px rgba(0,0,0,.5)', 'letter-spacing:2px',
  ].join(';');
  el.innerHTML = '<span style="display:block;font-size:12px;font-weight:500;color:#6f88ae">ENERGIE</span>' +
                 '<span id="__vp_energy_v" style="font-size:34px;font-weight:700;color:#ffd700"></span>';
  document.body.appendChild(el);
  const v = el.querySelector('#__vp_energy_v');
  const fmt = (p) => (p >= 99.95 ? '100' : p < 1 && p > 0 ? p.toFixed(1).replace('.', ',')
                                                          : p.toFixed(1).replace('.', ',')) + ' %';
  const tick = () => {
    try {
      const n = parseInt(document.getElementById('n-input').value, 10);
      let part = 0, all = 0;
      for (let i = 0; i < fourierZ.length; i++) {
        const e = fourierZ[i].amp * fourierZ[i].amp;
        all += e;
        if (i < n) part += e;
      }
      v.textContent = all > 0 ? fmt(100 * part / all) : '—';
    } catch (e) { /* the lab has not finished its first transform yet */ }
    requestAnimationFrame(tick);
  };
  tick();
  window.__vpEnergy = (on) => { el.style.opacity = on ? '1' : '0'; };
};

/* ------------------------------------------------------------------- the ghost
   The lab draws the target shape at 5 % white - on a 1280 px stage that is
   invisible, and scene 6 says "now a square" over a picture with no square in it.
   The recording therefore lays a second canvas over the lab's own and redraws that
   outline properly, using the lab's currentShapePoints and its own mapX/mapY, so it
   tracks every pan, zoom and shape change. The lab file itself stays untouched. */
const GHOST_OVERLAY = () => {
  if (window.__vpGhost) return;
  window.__vpGhost = true;
  const base = document.getElementById('canvas');
  const ov = document.createElement('canvas');
  ov.id = '__vp_ghost';
  ov.style.cssText = 'position:absolute;pointer-events:none;z-index:5';
  base.parentNode.appendChild(ov);
  const gg = ov.getContext('2d');
  const tick = () => {
    try {
      const r = base.getBoundingClientRect();
      const pr = base.parentNode.getBoundingClientRect();
      ov.style.left = (r.left - pr.left) + 'px';
      ov.style.top = (r.top - pr.top) + 'px';
      ov.style.width = r.width + 'px';
      ov.style.height = r.height + 'px';
      if (ov.width !== base.width || ov.height !== base.height) { ov.width = base.width; ov.height = base.height; }
      gg.clearRect(0, 0, ov.width, ov.height);
      if (typeof currentShapePoints !== 'undefined' && currentShapePoints.length) {
        gg.save();
        gg.strokeStyle = 'rgba(255,255,255,0.26)';
        gg.lineWidth = Math.max(1.4, base.width / 1280 * 1.6);
        gg.setLineDash([7, 9]);
        gg.beginPath();
        for (let i = 0; i < currentShapePoints.length; i++) {
          gg.lineTo(cc.mapX(currentShapePoints[i].x), cc.mapY(currentShapePoints[i].y));
        }
        gg.closePath();
        gg.stroke();
        gg.restore();
      }
    } catch (e) { /* before the first transform there is nothing to outline */ }
    requestAnimationFrame(tick);
  };
  tick();
};

/* ---------------------------------------------------------------- the lab take */
async function labTake() {
  const watch = frameWatch({
    // the lab's own measure: how far the drawn trace reaches, in world units.
    // The stage runs -600..600, so anything beyond that is off the picture.
    probe: () => {
      let m = 0;
      for (const p of path) m = Math.max(m, Math.abs(p.x), Math.abs(p.y));
      return m;
    },
    limit: 600, probeLabel: 'Radius', minCoverage: 0.002,
  });

  await runScenes([
    { name: 'main', url: LAB, run: async (p, { mark }) => {
        let t0 = 0, deadline = 0;
        const scene = async (k) => {
          mark(k);
          t0 = Date.now();
          deadline = t0 + (durs[k] * 1000 + AIR + (EXTRA[k] || 0)) / SPEED;
          if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
          await watch.take(p, k, { selector: '#canvas' });
        };
        const at = async (ms) => { const w = t0 + ms / SPEED - Date.now(); if (w > 20) await p.waitForTimeout(w); };
        const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
        const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
        const safe = async (label, fn) => { try { await fn(); } catch (e) { mark('SKIP ' + label + ': ' + e.message.slice(0, 70)); } };

        /* ---- the lab's own controls, driven directly ---- */
        const setSpeed = (v) => p.evaluate((v) => {
          const s = document.getElementById('speed-input');
          s.value = String(v);
          s.dispatchEvent(new Event('input', { bubbles: true }));
        }, v);
        const setN = (n) => p.evaluate((n) => adjustNTo(n), n);
        const setShape = (s) => p.evaluate((s) => {
          document.getElementById('shape-select').value = s;
          updateParams();
        }, s);
        const circles = (on) => p.evaluate((on) => {
          showEpicycles = on;
          const cb = document.getElementById('circles-checkbox');
          if (cb) cb.checked = on;
          const tele = document.getElementById('n-telemetry');
          if (tele) tele.style.opacity = on ? '0.9' : '0';
        }, on);
        const badge = (on) => p.evaluate((on) => window.__vpEnergy && window.__vpEnergy(on), on);
        // restart a lap; the lab pauses itself again at t = 2*PI
        const restart = () => p.evaluate(() => { time = 0; path = []; paused = false; });
        // …and this is the only honest clock in this lab
        const waitLap = async (capMs) => {
          await safe('lap', () => p.waitForFunction(() => paused === true, null,
            { timeout: Math.max(1500, (capMs || 12000) / SPEED), polling: 100 }));
        };
        const lap = async (capMs) => { await restart(); await waitLap(capMs); };

        /* ---------- preparation: everything before the first mark stays out of the cut */
        await p.evaluate(() => { const b = document.getElementById('local-badge'); if (b) b.remove(); });
        await p.waitForFunction(() => typeof fourierZ !== 'undefined' && fourierZ.length > 0,
          null, { timeout: 30000 });
        await p.addStyleTag({ content: '#__vp_energy{font-variant-numeric:tabular-nums}' });
        await p.evaluate(ENERGY_BADGE);
        await p.evaluate(GHOST_OVERLAY);
        await tick(2200);                               // Orbitron + KaTeX
        // the film opens on the finished note, so draw it once at full detail first
        await setSpeed(500);
        await setN(1000);
        await lap(20000);
        await circles(false);
        await tick(600);

        /* ---------- s1: the finished drawing, then the thousand circles behind it ---- */
        /* Lap length is 418.9/speed seconds and was measured against the running lab:
           7.00 s at 60, 2.80 at 150, 2.14 at 200, 1.42 at 300, 0.86 at 500. Every cue
           below is built from those numbers, not estimated. */
        await scene('s1');
        await at(2600);
        await circles(true);                            // there they are: a thousand of them
        await at(5600);
        await setN(2);                                  // …and all the way back down
        await at(6400);
        await setSpeed(60);
        await lap(14000);                               // 7.0 s -> ends at 13.4 of 14.4
        await rest();

        /* ---------- s2: two circles can only draw a circle ---------- */
        await scene('s2');
        await at(300);
        await lap(14000);                               // 7.3
        await at(7600);
        await restart();                                // keep it moving under the last words
        await rest();

        /* ---------- s3: the third one runs backwards -> an ellipse ---------- */
        await scene('s3');
        await at(400);
        await setN(3);
        await at(700);
        await lap(14000);                               // 7.7
        await at(8000);
        await lap(14000);                               // 15.0 of 16.9 — a second look
        await rest();

        /* ---------- s4: auto-evolve, all 23 steps ----------
           At speed 100 one lap is ~4.2 s and 23 of them are 96 s. At 500 a lap is
           ~0.84 s, so the whole climb fits in ~19 s. This is the one scene where the
           speed is not cosmetic. */
        await scene('s4');
        await at(300);
        await setSpeed(500);
        await p.evaluate(() => { manualReset(); startEvolution(); });
        await safe('evolution', () => p.waitForFunction(() => isEvolving === false, null,
          { timeout: Math.max(4000, 40000 / SPEED), polling: 200 }));
        await rest();

        /* ---------- s6: the square, two circles, nothing happens ---------- */
        await scene('s6');
        await at(200);
        await p.evaluate(() => { manualReset(); });
        await setShape('QUADRAT');
        await setN(2);
        await circles(true);
        await setSpeed(80);
        await badge(true);                              // 0 %, computed in the page
        await at(1400);
        await restart();
        await rest();

        /* ---------- s7: one more circle - 98.6 % and a circle on screen ---------- */
        await scene('s7');
        await at(500);
        await setN(3);
        await at(900);
        await lap(14000);                               // 7.9
        await at(9000);
        await lap(14000);                               // 16.0 of 18.7
        await rest();

        /* ---------- s8: four, five - nothing. Six dents the flanks ---------- */
        await scene('s8');
        await setSpeed(200);                            // lap 2.14 s
        await at(200);   await setN(4); await lap(9000);
        await at(4200);  await setN(5); await lap(9000);
        await at(8200);  await setN(6); await lap(9000);
        await at(11000); await restart();
        await rest();

        /* ---------- s10: the heart and the direction of travel ---------- */
        await scene('s10');
        await at(200);
        await setShape('HERZ');
        await setN(2);
        await setSpeed(150);                            // lap 2.80 s
        await at(1000);  await lap(12000);              // nothing: 0.8 %
        await at(6000);  await setN(3); await lap(12000);   // one click -> 99.1 %, an ellipse
        await at(13500); await setN(9); await lap(12000);   // the notch arrives
        await at(18000); await restart();
        await rest();

        /* ---------- s11: the same two circles on all three shapes ---------- */
        await scene('s11');
        await setSpeed(300);                            // lap 1.42 s
        await at(200);
        await setShape('NOTE'); await setN(2); await lap(9000);
        await at(5600);
        await setShape('QUADRAT'); await setN(2); await lap(9000);
        await at(11000);
        await setShape('HERZ'); await setN(2); await lap(9000);
        await at(15000); await restart();
        await rest();
        await badge(false);
        mark('end');
    } },
  ], { outDir: OUT, showCursor: true, record: !CHECK });

  const ok = watch.report();
  if (CHECK && !ok) process.exitCode = 1;
}

/* --------------------------------------------------------------- the card inserts */
async function cardTake() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'karten.html';
    const file = path.resolve(HERE, rel);
    if (file !== HERE && !file.startsWith(HERE)) { res.statusCode = 403; res.end('nope'); return; }
    try { res.setHeader('Content-Type', 'text/html'); res.end(fs.readFileSync(file)); }
    catch { res.statusCode = 404; res.end('nope'); }
  });
  await new Promise((r) => server.listen(8899, '127.0.0.1', r));
  try {
    await runScenes(CARD_SCENES.map((k) => {
      const d = durs[k];
      return {
        name: 'card_' + k,
        url: `http://127.0.0.1:8899/karten.html?scene=${k}&dur=${(d / SPEED).toFixed(2)}`,
        run: async (p, { mark }) => {
          await p.waitForFunction(() => window.__vpReady === true, null, { timeout: 20000 });
          mark(k);
          await p.waitForTimeout((d * 1000 + AIR) / SPEED);
          mark('end');
        },
      };
    }), { outDir: OUT, record: !CHECK });
  } finally { server.close(); }
}

if (ONLY !== 'karten') await labTake();
if (ONLY !== 'lab') await cardTake();
console.log(CHECK ? 'FOURIER PROBELAUF DONE' : 'FOURIER RECORD DONE');
