// Linse demo — step 2: one continuous take of the lab, plus the four inserts.
//
// THREE THINGS ABOUT THIS LAB DRIVE EVERY DECISION BELOW:
//
//  1. Every mousedown ON THE CANVAS moves the focus point, with no hit radius
//     (cmaes_java.js: this.canvas.onmousedown -> handleMouseDown sets focus = click).
//     So the recording NEVER clicks the stage. The dock buttons are safe (they are
//     DOM elements outside the canvas), everything else goes through App directly.
//  2. The evolution is far too fast to watch: one round per animation frame, so
//     60 per second - the whole convergence to round 100 would be over in 1.7 s.
//     The recording brings its own metronome (PACER) that calls App.step() at a
//     chosen rate. The arithmetic is identical, only the pace is ours.
//  3. The lab shows FITNESS, which is a sum of focus quality, glass path and three
//     penalties. The film talks about the focus alone, so the recording injects a
//     badge that recomputes it live from App.points with the lab's own Physics.
//
// And one measured fact that shapes scene 6: the breakout to the thin lens is NOT
// guaranteed. Over five runs it came at 498, 512, 615, 869 - and once not at all
// within 4000 rounds (linse/measure3.mjs). Scene 6 therefore waits for the EVENT
// and escalates the pace if it is late, then marks it. A take without the mark is
// unusable, and run3 says so.
//
// VP_CHECK=1 walks the choreography without recording. VP_SPEED=6 shortens waits.
// ONLY=lab|karten records one half.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = workDir('linse');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/LensStandalone/cmaes_java.html';
const AIR = 1600;
const EXTRA = { s6: 2000, s9: 1500 };
const SPEED = Number(process.env.VP_SPEED || 1);
const CHECK = !!process.env.VP_CHECK;
const SHOTS = !!process.env.VP_SHOTS || CHECK;
const ONLY = process.env.ONLY || '';

const LAB_SCENES = ['s1', 's4', 's5', 's6', 's8', 's9'];
const CARD_SCENES = ['s2', 's3', 's7', 's10'];

/* ---------------------------------------------------------------- the metronome */
const PACER = () => {
  if (window.__vpPace) return;
  window.__vpRate = 0;
  window.__vpPace = (perSec) => { window.__vpRate = perSec || 0; };
  let acc = 0, last = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.2, (now - last) / 1000); last = now;
    if (window.__vpRate > 0 && App.es) {
      acc += dt * window.__vpRate;
      const n = Math.floor(acc);
      if (n > 0) {
        acc -= n;
        const keep = App.paused;
        App.paused = false;
        for (let i = 0; i < n; i++) App.step();
        App.paused = keep;
        App.updateTelemetry();
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/* -------------------------------------------------------------------- the badge
   Ray error and lens thickness, recomputed every frame from the lab's own state.
   The lab's own FITNESS mixes in the glass path and three penalties; the film
   talks about the focus alone, so this has to be its own number. */
const BADGE = () => {
  if (window.__vpBadge) return;
  const el = document.createElement('div');
  el.id = '__vp_badge';
  /* A flat bar in the strip above the lens (the glass body starts at y = 145) - a
     stacked box on the left covered exactly the thing the film is about. */
  el.style.cssText = [
    'position:fixed', 'left:220px', 'top:14px', 'z-index:9000', 'pointer-events:none',
    'opacity:0', 'transition:opacity .35s ease', 'font-family:Orbitron,sans-serif',
    'padding:9px 20px', 'border-radius:4px', 'background:rgba(11,26,52,.92)',
    'border:1px solid rgba(0,242,255,.35)', 'box-shadow:0 0 26px rgba(0,0,0,.55)',
    'font-variant-numeric:tabular-nums', 'display:flex', 'align-items:baseline', 'gap:26px',
  ].join(';');
  const lab = 'font-size:11px;font-weight:500;letter-spacing:2px;color:#8199bd;margin-right:9px';
  el.innerHTML =
    '<span><span style="' + lab + '">STRAHLFEHLER</span>' +
    '<span id="__vp_err" style="font-size:30px;font-weight:700;color:#ffcc00">—</span></span>' +
    '<span><span style="' + lab + '">DICKE</span>' +
    '<span id="__vp_thk" style="font-size:24px;font-weight:700;color:#00f2ff">—</span></span>';
  document.body.appendChild(el);
  const errEl = el.querySelector('#__vp_err'), thkEl = el.querySelector('#__vp_thk');
  const tick = () => {
    try {
      const A = App, fare = Physics.FARE, back = A.ppsSide;
      const space = A.perimeter / (A.ppsSide - 1);
      const d = [];
      for (let i = 0; i < A.ppsSide - 1; i++) {
        const y = A.offsetY + i * space + space / 2;
        const r1 = Physics.refractRayClosestSurface({ x1: 0, y1: y, x2: fare, y2: y },
          A.points, 0, A.ppsSide - 1, A.nAir, A.nLens, fare);
        if (!r1) continue;
        const r2 = Physics.refractRayClosestSurface(r1.refracted, A.points, back,
          A.ppsSide - 1, A.nLens, A.nAir, fare);
        if (!r2) continue;
        const r = r2.refracted, dx = r.x2 - r.x1;
        if (Math.abs(dx) < 1e-9) continue;
        d.push(r.y1 + (A.focus.x - r.x1) / dx * (r.y2 - r.y1) - A.focus.y);
      }
      const rms = d.length ? Math.sqrt(d.reduce((a, b) => a + b * b, 0) / d.length) : null;
      errEl.textContent = rms === null ? '—' : rms.toFixed(1).replace('.', ',') + ' px';
      const nF = A.ppsSide, mid = Math.floor(nF / 2);
      thkEl.textContent = Math.abs(A.points[nF + (nF - 1 - mid)].x - A.points[mid].x).toFixed(0) + ' px';
    } catch (e) { /* before the first trace there is nothing to show */ }
    requestAnimationFrame(tick);
  };
  tick();
  window.__vpBadge = (on) => { el.style.opacity = on ? '1' : '0'; };
};

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
        const safe = async (label, fn) => { try { await fn(); } catch (e) { mark('SKIP ' + label + ': ' + e.message.slice(0, 70)); } };

        /* --- the lab's controls, never through the canvas --- */
        const pace = (r) => p.evaluate((r) => window.__vpPace(r), r);
        const badge = (on) => p.evaluate((on) => window.__vpBadge(on), on);
        const armed = () => p.evaluate(() => {                    // create the optimiser, keep it still
          if (!App.es) App.togglePlay();
          App.paused = true;
          const ind = document.getElementById('running-indicator');
          if (ind) ind.classList.remove('hidden');                // we are stepping it, so say so
        });
        const freeRun = (on) => p.evaluate((on) => {
          window.__vpPace(0);
          if (!App.es) App.togglePlay();
          App.paused = !on;
          const ind = document.getElementById('running-indicator');
          if (ind) ind.classList.toggle('hidden', !on);
        }, on);
        const restart = (n) => p.evaluate((n) => {
          window.__vpPace(0);
          App.reset();
          if (n) {
            const s = document.getElementById('slider-n');
            if (s) { s.value = String(n); s.dispatchEvent(new Event('input', { bubbles: true })); }
            App.nLens = n;
          }
        }, n);
        const points = (on) => p.evaluate((on) => {
          const cb = document.getElementById('check-points');
          if (cb) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); }
          App.showPoints = on;
        }, on);
        const oscillate = (on) => p.evaluate((on) => {
          const cb = document.getElementById('check-oscillate');
          if (cb) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); }
        }, on);
        const gen = () => p.evaluate(() => App.generation);
        const untilGen = (g, capMs) => safe('gen ' + g, () => p.waitForFunction(
          (g) => App.generation >= g, g, { timeout: Math.max(2000, (capMs || 40000) / SPEED), polling: 60 }));

        /* ---------- preparation: everything before the first mark stays out of the cut */
        await p.evaluate(() => { const b = document.getElementById('local-badge'); if (b) b.remove(); });
        await p.waitForFunction(() => typeof App !== 'undefined' && App.points && App.points.length > 0,
          null, { timeout: 30000 });
        await p.evaluate(PACER);
        await p.evaluate(BADGE);
        await tick(2200);                                  // Orbitron
        await badge(true);
        await tick(800);

        /* ---------- s1: a block of glass, and twelve rays that miss ---------- */
        await scene('s1');
        await at(11000);
        await points(false);                               // the dots are what will move later
        await at(15500);
        await points(true);
        await rest();

        /* ---------- s4: the first rounds, slow enough to see each one ---------- */
        await scene('s4');
        await at(400);
        await armed();
        await pace(3);                                     // ~55 rounds across the scene
        await rest();

        /* ---------- s5: ten a second - and the lens is there ---------- */
        await scene('s5');
        await pace(10);
        await rest();

        /* ---------- s6: it does not stop ----------
           The breakout is stochastic (498 / 512 / 615 / 869 / never over five runs),
           so this waits for the EVENT and pushes the pace if it is late. */
        await scene('s6');
        await pace(40);
        await safe('breakout', async () => {
          const t = Date.now();
          const budget = (durs.s6 * 1000 + EXTRA.s6) / SPEED;
          let escalated = false;
          while (Date.now() - t < budget * 0.86) {
            const f = await p.evaluate(() => App.fitness);
            if (f < 6) { mark('breakout@' + (await gen())); return; }
            if (!escalated && Date.now() - t > budget * 0.5) { await pace(220); escalated = true; }
            await p.waitForTimeout(120);
          }
          mark('NOBREAKOUT');
        });
        await rest();

        /* ---------- s8: the refractive index ---------- */
        await scene('s8');
        for (const [i, n] of [1.20, 1.60, 2.00].entries()) {
          await at(200 + i * 5200);
          await restart(n);
          await armed();
          await pace(500);
          await untilGen(700, 12000);
          await pace(0);
        }
        await rest();

        /* ---------- s9: the focus starts to wander ---------- */
        await scene('s9');
        await restart(1.60);
        await armed();
        await pace(600);
        await untilGen(700, 14000);
        await pace(0);
        await freeRun(true);                               // from here the lab runs at its own speed
        await at(3500);
        await oscillate(true);
        await rest();
        await oscillate(false);
        await badge(false);
        mark('end');
    } },
  ], { outDir: OUT, showCursor: true, record: !CHECK });
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
  await new Promise((r) => server.listen(8897, '127.0.0.1', r));
  try {
    await runScenes(CARD_SCENES.map((k) => {
      const d = durs[k];
      return {
        name: 'card_' + k,
        url: `http://127.0.0.1:8897/karten.html?scene=${k}&dur=${(d / SPEED).toFixed(2)}`,
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
console.log(CHECK ? 'LINSE PROBELAUF DONE' : 'LINSE RECORD DONE');
