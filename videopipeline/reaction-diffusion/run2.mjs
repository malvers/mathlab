// Reaction-Diffusion demo — step 2: one continuous take of the lab, plus three
// title cards injected into the page itself.
//
// WHAT THE LAB DICTATES (measured in Node against a 1:1 copy of its own arithmetic,
// never guessed — the numbers below are why the scenes are paced as they are):
//
//  1. GESCHWINDIGKEIT decides whether anything is visible at all. At speed 1 the
//     preset "Wirbel" needs 5050 steps to cover half the frame = 84 s of dead air.
//     At speed 10 it is 8.4 s. So the film runs at 10 — except where the opposite
//     is true (see 3, 5 and 6).
//  2. A PRESET CHANGE DOES NOT RESET THE GRID. It only swaps F, k, Du, Dv, so the
//     existing pattern MORPHS. Measured settle times out of a finished "Wirbel"
//     at speed 10: Koralle 4.6 s, Gitter 5.8 s, Tupfen 6.7 s, Labyrinth 7.5 s;
//     Chaos and Schlangen never settle, they keep churning.
//  3. SCENE 11 MUST JUMP, NOT RAMP — take 1 got this wrong and the pattern refused to
//     die on camera. A slow ramp lets it adapt: it survives past Dv = 0.140. A jump
//     from 0.080 straight to 0.110 kills it. Measured on 264x180 at speed 1: coverage
//     holds near 62 % for 1.3 s, then 48 % at 1.67 s, 16 % at 2.0 s, gone at 2.7 s.
//     One second of nothing, then everything. That IS the scene.
//  4. GRID SIZE MOVES THE THRESHOLD. The lab computes GRID_W = width/4, so at 1280x720
//     with the panel open it runs 264x180 — not the 160x120 the first measurements used.
//     On the coarser grid a jump to 0.110 still held. Always measure on 264x180.
//  5. LOWERING FEED KILLS IT BELOW ~0.016 (measured: 0.018 still holds at 57.6 %
//     coverage, 0.014 is empty within 120 steps). Scene 7 drags the slider down
//     slowly at speed 3 so the thinning is visible before the collapse.
//  6. THE PAINT SMEAR IN SCENE 8 HEALS IN ABOUT 100 STEPS. At speed 10 that is 0.17 s
//     — invisible. Scene 8 drops to speed 3 so the smear is seen being absorbed.
//  7. THE LAB ITSELF STORES NOTHING in localStorage; the shell stores the UI language
//     and whether the coach box is collapsed. Both are cleared before the take.
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait.
import fs from 'fs';
import { spawnSync } from 'child_process';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('reaction-diffusion');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/reaction-diffusion.html?lang=de';
const AIR = 1400;
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
for (const k of ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's10', 's11', 's12', 's13'])
  CUE[k] = cues(k);
for (const [k, v] of Object.entries(CUE))
  console.log(k + '-Regiepausen:', v.map((c) => c.start.toFixed(1) + '–' + c.end.toFixed(1)).join(', ') || 'keine');
/** the n-th pause of a scene; `end` = the action belongs to the words after it */
const cueAt = (k, n, fallback) => (CUE[k] && CUE[k][n] ? CUE[k][n].end : fallback);

const ORDER = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','s15'];

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

    /* ---- the lab, driven through its own DOM ---------------------------------- */

    /** slider order in the panel: 0 feed · 1 kill · 2 Du · 3 Dv · 4 speed · 5 brush */
    const sliderBox = (i) => p.evaluate((i) => {
      const el = document.querySelectorAll('input[type="range"]')[i];
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y + r.height / 2, w: r.width, min: +el.min, max: +el.max };
    }, i);

    /** Move the real cursor onto the thumb, then set the value and let the lab's own
     *  oninput run — that keeps global, slider and printed label in step. */
    const setSlider = async (i, val, moveMouse = true) => {
      const b = await sliderBox(i);
      if (moveMouse) {
        const frac = (val - b.min) / (b.max - b.min);
        await p.mouse.move(b.x + b.w * frac, b.y, { steps: 6 });
      }
      await p.evaluate(([i, val]) => {
        const el = document.querySelectorAll('input[type="range"]')[i];
        el.value = String(val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, [i, val]);
    };
    /** Drag one slider from its current value to a target, in visible steps. */
    const rampSlider = async (i, from, to, stepCount, msPerStep) => {
      for (let n = 1; n <= stepCount; n++) {
        await setSlider(i, +(from + (to - from) * (n / stepCount)).toFixed(3));
        await tick(msPerStep);
      }
    };
    const setSpeed = (n) => setSlider(4, n, false);

    const preset = async (name) => {
      const box = await p.evaluate(() => {
        const r = document.getElementById('rd-preset').getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
      await p.mouse.move(box.x, box.y, { steps: 5 });
      await p.evaluate((name) => {
        const sel = document.getElementById('rd-preset');
        const opt = [...sel.options].find((o) => o.textContent.trim() === name);
        sel.value = opt.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }, name);
    };
    const button = async (label) => {
      const box = await p.evaluate((label) => {
        const b = [...document.querySelectorAll('button')].find((x) => x.innerText.trim() === label);
        const r = b.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, label);
      await p.mouse.move(box.x, box.y, { steps: 6 });
      await p.mouse.down(); await tick(70); await p.mouse.up();
    };
    const canvasBox = () => p.evaluate(() => {
      const r = document.getElementById('canvas').getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    const steps = () => p.evaluate(() => (typeof stepCount === 'number' ? stepCount : -1));

    const cardShow = (html) => p.evaluate((html) => {
      let el = document.getElementById('vp-card');
      if (!el) { el = document.createElement('div'); el.id = 'vp-card'; document.body.appendChild(el); }
      el.innerHTML = html;
      requestAnimationFrame(() => el.classList.add('on'));
    }, html);
    const cardRow = (n) => p.evaluate((n) => {
      const r = document.querySelectorAll('#vp-card .row')[n];
      if (r) r.classList.add('on');
    }, n);
    const cardHide = () => p.evaluate(() => {
      const el = document.getElementById('vp-card');
      if (el) { el.classList.remove('on'); setTimeout(() => el.remove(), 500); }
    });

    /* ---- startzustand --------------------------------------------------------- */
    await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForFunction(() => typeof stepCount === 'number', null, { timeout: 15000 });
    /* ---- title cards, in the lab's own type and colours ------------------------ */
    await p.addStyleTag({ content: `
      #vp-card { position: fixed; inset: 0; z-index: 900; display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 26px;
        background: rgba(0,6,22,0.90); opacity: 0; transition: opacity .45s ease;
        font-family: Outfit, system-ui, sans-serif; color: #e6eefa; padding: 0 8vw; }
      #vp-card.on { opacity: 1; }
      #vp-card h2 { font-family: Orbitron, sans-serif; font-size: 40px; font-weight: 700;
        color: #00d2ff; margin: 0 0 6px; letter-spacing: .01em; text-align: center; }
      #vp-card .row { font-size: 30px; font-weight: 300; line-height: 1.35; opacity: 0;
        transform: translateY(10px); transition: opacity .5s ease, transform .5s ease;
        max-width: 22ch; text-align: center; }
      #vp-card .row.on { opacity: 1; transform: none; }
      #vp-card .row b { font-weight: 600; color: #ff7a14; }
      #vp-card .num { font-family: Orbitron, sans-serif; color: #ff7a14; }
      #vp-card .small { font-size: 22px; color: #b3c5de; max-width: 36ch; }
    ` });
    await p.evaluate(() => {                       // the coach box covers the canvas corner
      const c = document.getElementById('math-coach-box');
      if (c) c.style.display = 'none';
    });
    await preset('Wirbel');
    await setSlider(5, 8, false);                  // PINSEL 8
    await setSpeed(3);
    await p.evaluate(() => initGrid());
    await tick(600);

    /* -- 1 · Ein Tropfen, sonst nichts ----------------------------------------- */
    await scene('s1');
    await rest();

    /* -- 2 · Es kommt von selbst (Kernszene) ----------------------------------- */
    await scene('s2');
    await setSpeed(10);
    await atSec(cueAt('s2', 0, 6.0));
    await shot('s2_gefuellt');
    await rest();

    /* -- 3 · Zwei Stoffe, einer unsichtbar (Kernszene) ------------------------- */
    await scene('s3');
    await atSec(cueAt('s3', 0, 4.5));
    await button('PAUSE');
    await atSec(cueAt('s3', 1, 11.0));
    await button('PLAY');
    await rest();

    /* -- 4 · Vier Regeln, mehr nicht (Kernszene, Karte) ------------------------ */
    await scene('s4');
    await cardShow(`<h2>Vier Regeln</h2>
      <div class="row"><b>Farbe</b> frisst <b>Nahrung</b> und macht daraus mehr <b>Farbe</b></div>
      <div class="row"><b>Farbe</b> zerfällt von allein</div>
      <div class="row"><b>Nahrung</b> wird nachgefüllt</div>
      <div class="row">beide <b>verlaufen</b></div>`);
    for (let i = 0; i < 4; i++) {
      await atSec(cueAt('s4', i, 3.2 + i * 4.2));
      await cardRow(i);
    }
    await atSec(Math.max(0, (durs.s4 || 24) - 4.5));
    await cardHide();
    await rest();

    /* -- 5 · Die zwei Regler --------------------------------------------------- */
    await scene('s5');
    await atSec(cueAt('s5', 0, 2.6));
    await rampSlider(0, 0.026, 0.032, 4, 130);
    await rampSlider(0, 0.032, 0.026, 4, 130);
    await atSec(cueAt('s5', 1, 7.4));
    await rampSlider(1, 0.058, 0.063, 4, 130);
    await rampSlider(1, 0.063, 0.058, 4, 130);
    await rest();

    /* -- 6 · Zwei Zahlen, sechzehn Welten (Kernszene) -------------------------- */
    await scene('s6');
    const SHOW = ['Schlangen', 'Koralle', 'Gitter', 'Pulsierend', 'Flocken'];
    for (let i = 0; i < SHOW.length; i++) {
      await atSec(cueAt('s6', i, 2.2 + i * 5.4));
      await preset(SHOW[i]);
      await shot('s6_' + SHOW[i]);
    }
    await rest();

    /* -- 7 · Und meistens passiert gar nichts ---------------------------------- */
    await scene('s7');
    await preset('Wirbel');
    await setSpeed(3);
    await atSec(cueAt('s7', 0, 3.0));
    await rampSlider(0, 0.026, 0.012, 14, 420);      // slow drag down, dies on the way
    await shot('s7_leer');
    // Rebuild for scene 8 during her closing sentence: at speed 10 the pattern needs
    // ~8.4 s to cover half the frame, and s8 does not paint before its own 4.4 s mark.
    await atSec(Math.max(0, (durs.s7 || 20) - 3.0));
    await setSlider(0, 0.026);
    await setSpeed(10);
    await button('SÄEN');
    await rest();

    /* -- 8 · Man kann es nicht kaputtmalen (Notbremse) ------------------------- */
    await scene('s8');
    await atSec(cueAt('s8', 0, 4.4));
    await setSpeed(3);                               // healing is 0.17 s at speed 10
    {
      const c = await canvasBox();
      const y = c.y + c.h * 0.5;
      await p.mouse.move(c.x + c.w * 0.15, y, { steps: 4 });
      await p.mouse.down();
      for (let i = 1; i <= 22; i++) {
        await p.mouse.move(c.x + c.w * (0.15 + 0.7 * i / 22), y + Math.sin(i / 3) * 26, { steps: 1 });
        await tick(45);
      }
      await atSec(cueAt('s8', 1, 9.5));
      await p.mouse.up();                            // "und lasse los"
      await shot('s8_spur');
    }
    await rest();

    /* -- 9 · Der Rand ist keiner (Notbremse) ----------------------------------- */
    await scene('s9');
    await setSpeed(10);
    {
      const c = await canvasBox();
      await p.mouse.move(c.x + c.w * 0.5, c.y + 26, { steps: 12 });
      await tick(900);
      await p.mouse.move(c.x + c.w * 0.5, c.y + c.h - 26, { steps: 16 });
    }
    await rest();

    /* -- 10 · Warum überhaupt Muster? (Kernszene, Karte) ----------------------- */
    await scene('s10');
    await cardShow(`<h2>Nah verstärken, weit bremsen</h2>
      <div class="row">Wo <b>Farbe</b> entsteht, entsteht sofort mehr davon —<br>auf ganz kurze Strecke</div>
      <div class="row">Dieselbe Stelle saugt <b>Nahrung</b> aus einem<br>viel größeren Umkreis ab</div>
      <div class="row"><span class="num">Nahrung 0,160</span> &nbsp;·&nbsp; <span class="num">Farbe 0,080</span></div>
      <div class="row small">Doppelt so schnell. Daraus wird ein Abstand —
        und ein Abstand, der sich überall wiederholt, ist ein Muster.</div>`);
    for (let i = 0; i < 4; i++) {
      await atSec(cueAt('s10', i, 3.0 + i * 7.0));
      await cardRow(i);
    }
    await atSec(Math.max(0, (durs.s10 || 32) - 3.5));
    await cardHide();
    await rest();

    /* -- 11 · Die Probe: den Unterschied wegnehmen (Kernszene) ----------------- */
    await scene('s11');
    await setSpeed(1);
    await shot('s11_vorher');
    await atSec(cueAt('s11', 1, 9.5));               // right after she names the two values
    await setSlider(3, 0.110);                       // the JUMP — a ramp would not kill it
    await tick(1300);                                // the second in which nothing happens
    await shot('s11_haelt_noch');
    await tick(1400);
    await shot('s11_tot');
    await rest();

    /* -- 12 · Und zurück ------------------------------------------------------- */
    await scene('s12');
    await atSec(cueAt('s12', 0, 3.0));
    await setSlider(3, 0.080);
    await setSpeed(10);
    await button('SÄEN');
    await atSec(cueAt('s12', 1, 8.0));
    await shot('s12_wieder_da');
    await rest();

    /* -- 13 · 1952 (Kernszene, Karte) ------------------------------------------ */
    await scene('s13');
    await cardShow(`<h2>1952</h2>
      <div class="row">Alan Turing, <span class="num">The Chemical Basis<br>of Morphogenesis</span></div>
      <div class="row">Er hat es nicht beobachtet.<br>Er hat es <b>hergeleitet</b>.</div>
      <div class="row small">Was hier rechnet, ist nicht sein Modell, sondern die Reaktion
        von Gray und Scott, dreißig Jahre jünger.</div>
      <div class="row"><b>38 Jahre</b> bis es im Reagenzglas gelang</div>`);
    for (let i = 0; i < 4; i++) {
      await atSec(cueAt('s13', i, 3.0 + i * 7.5));
      await cardRow(i);
    }
    await atSec(Math.max(0, (durs.s13 || 32) - 3.0));
    await cardHide();
    await rest();

    /* -- 15 · Zum Selberzüchten ------------------------------------------------ */
    await scene('s15');
    await preset('Koralle');
    await setSpeed(10);
    await tick(1200);
    console.log('Schrittzähler am Ende:', await steps());
    await shot('s15_abbinder');
    await rest();

    mark('end');
    await tick(1500);
  },
}], { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1, showCursor: true, record: !CHECK });

console.log(CHECK ? 'REACTION-DIFFUSION PROBELAUF FERTIG — Bilder in ' + OUT
                  : 'REACTION-DIFFUSION ROHMATERIAL in ' + OUT);
console.log('Szenen im Schnitt:', ORDER.join(' '));
