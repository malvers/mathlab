// BB84 demo — step 2: one continuous take of the lab, plus the six inserts.
//
// The film alternates between the lab and cards the lab cannot show (karten.html).
// The lab part is recorded as ONE take in film order, so the state flows the way a
// person would drive it: demo mode → random run → Eve → the trap → a thousand runs.
// Every cue is an ABSOLUTE time inside its scene (at(ms)), so a slow click cannot
// push the following cues out of sync with the voice.
//
// VP_SPEED=8 runs the whole choreography in a fraction of the time — a dry run that
// proves every selector still exists before the real six minutes go to disk.
// VP_SHOTS=1 additionally drops a PNG at the start of every scene.
// ONLY=lab|karten records just one half.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = workDir('bb84');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));

const LAB = 'http://localhost:8765/bb84.html';
const AIR = 1500;                  // breathing room after every scene's narration
const EXTRA = {                    // scenes whose animation needs more than the words
  s10: 1200, s13: 1500, s14: 2500, s15: 1500, s18: 2000,
};
const SPEED = Number(process.env.VP_SPEED || 1);
const SHOTS = !!process.env.VP_SHOTS;
const ONLY = process.env.ONLY || '';

/* the lab scenes, in the order they appear in the film */
const LAB_SCENES = ['s4', 's5', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's18'];
/* the cards, each recorded on its own — the page paces itself to the narration length */
const CARD_SCENES = ['s1', 's2', 's3', 's6', 's16', 's17'];

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
        // one hiccup must not cost the whole take
        const safe = async (label, fn) => { try { await fn(); } catch (e) { mark('SKIP ' + label + ': ' + e.message.slice(0, 60)); } };

        // page coordinates of the centre of column i, on the row band of the stage
        const colPos = (i, row) => p.evaluate(([i, row]) => {
          const r = document.getElementById('canvas').getBoundingClientRect();
          const k = Math.min(i, xs.length - 1);
          return { x: r.left + xs[k] + box / 2, y: r.top + y0 + (row + 0.5) * pitch };
        }, [i, row === undefined ? 1 : row]);
        // hover a column: that is what drives the explanation bar
        const hover = async (i, row) => { const q = await colPos(i, row); await p.mouse.move(q.x, q.y); };
        // walk the pointer across a span of columns, slow enough to read along
        const sweep = async (from, to, ms) => {
          const a = await colPos(from), b = await colPos(to);
          const steps = Math.min(60, Math.max(6, Math.abs(to - from) * 2));
          await p.mouse.move(a.x, a.y);
          for (let s = 1; s <= steps; s++) {
            await p.mouse.move(a.x + (b.x - a.x) * s / steps, a.y + (b.y - a.y) * s / steps);
            await tick(ms / steps);
          }
        };
        const key = (k) => p.keyboard.press(k);

        // the local server injects a red LOCAL badge — it has no business in the film
        await p.evaluate(() => { const b = document.getElementById('local-badge'); if (b) b.remove(); });
        await p.waitForFunction(() => !!(window.bb84 && window.bb84.stats()), null, { timeout: 30000 });
        await p.mouse.move(640, 400);                    // the stage gets the keyboard
        await p.mouse.click(640, 400);
        await tick(2500);                                // Orbitron + KaTeX

        // ---------- s4: what a photon is — the teaching mode shows all four states ----------
        await scene('s4');
        await at(600);
        await key('l');                                  // Lehrmodus: every case exactly once
        await at(3000);
        await hover(0, 2);
        await at(6000);  await sweep(0, 3, 5200);
        await rest();

        // ---------- s5: two filters, two alphabets ----------
        await scene('s5');
        await at(400);  await hover(0);
        await at(4200); await hover(1);
        await at(7200); await hover(2);
        await at(10200); await hover(3);
        await rest();

        // ---------- s7: Alice rolls, Bob rolls — a real random run ----------
        await scene('s7');
        await at(500);
        await key('l');                                  // back to a random run
        await at(1200);
        await key(' ');                                  // and a fresh one
        await at(4000); await sweep(2, 30, 9000);
        await rest();

        // ---------- s8: same basis is certain, the other one is undetermined ----------
        await scene('s8');
        await at(300);
        await safe('find pair', async () => {
          // pick two real columns of this run: one with matching bases, one without
          const idx = await p.evaluate(() => {
            const c = window.bb84.cols();
            const same = c.findIndex((x) => x.aBase === x.bBase);
            const diff = c.findIndex((x) => x.aBase !== x.bBase);
            return [same, diff];
          });
          await hover(idx[0]);
          await at(5000);
          await hover(idx[1]);
          await at(11000);
          await key('z');                                // the original's "0|1" notation
          await at(15000);
          await key('z');
        });
        await rest();

        // ---------- s9: the teaching mode, case by case ----------
        await scene('s9');
        await at(400);
        await key('l');
        await at(3000);  await sweep(0, 3, 4500);
        await at(8500);  await sweep(4, 7, 4500);
        await rest();

        // ---------- s10: sifting — half of it flies out ----------
        await scene('s10');
        await at(400);
        await key('l');                                  // random run again
        await at(1000);
        await key(' ');
        await at(3000);
        await key('k');                                  // key row off …
        await at(6500);
        await key('k');                                  // … and back on, so it is noticed
        await at(9000); await sweep(1, 34, 7000);
        await rest();

        // ---------- s11: Eve enters ----------
        await scene('s11');
        await at(2500);
        await key('e');                                  // three more rows fold out
        await at(6000); await sweep(4, 26, 8000);
        await rest();

        // ---------- s12: the quarter ----------
        await scene('s12');
        await at(400);
        await key('l');                                  // the prepared Eve cases
        await at(2500);  await hover(8);
        await at(6000);  await hover(9);
        await at(9000);  await sweep(10, 13, 8000);
        await rest();

        // ---------- s13: the trap — how many bits do they sacrifice? ----------
        await scene('s13');
        await at(400);
        await key('l');                                  // random run with Eve
        await at(1000);
        await key(' ');
        await at(3000);
        await safe('share slider', async () => {
          const sh = p.locator('#share');
          await sh.evaluate((el) => el.focus());
          for (let v = 30; v <= 65; v += 5) {
            await sh.evaluate((el, val) => {
              el.value = String(val);
              el.dispatchEvent(new Event('input', { bubbles: true }));
            }, v);
            await tick(700);
          }
        });
        await rest();

        // ---------- s14: a thousand runs ----------
        await scene('s14');
        await at(1500);
        await safe('1000 runs', async () => {
          const b = p.locator('#ui-container .cyber-btn', { hasText: 'LÄUFE' }).first();
          await b.scrollIntoViewIfNeeded();
          await b.click({ timeout: 5000 });
        });
        await rest();

        // ---------- s15: twelve photons, then two hundred and fifty six ----------
        await scene('s15');
        await at(600);
        await key('m');                                  // 12 bits — still a dice game
        await at(3200);
        await key(' ');
        await at(5000);
        await key(' ');
        await at(7000);
        await p.keyboard.press('Shift+M');                // 256 bits
        await at(10000); await sweep(20, 200, 2500);
        await rest();

        // ---------- s18: the close — a clean run, and the key fills up gold ----------
        await scene('s18');
        await at(500);
        await key('4');                                  // back to the 42 of the original
        await at(1500);
        await key('e');                                  // no eavesdropper this time
        await at(3000);
        await key(' ');
        await at(6000);  await sweep(1, 40, 9000);
        await at(16000); await hover(20);
        await rest();
        mark('end');
    } },
  ], { outDir: OUT, showCursor: true });
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
  await new Promise((r) => server.listen(8898, '127.0.0.1', r));
  try {
    await runScenes(CARD_SCENES.map((k) => {
      // the card is paced to the narration, and the recording adds the same tail as the lab
      const d = durs[k];
      return {
        name: 'card_' + k,
        url: `http://127.0.0.1:8898/karten.html?scene=${k}&dur=${(d / SPEED).toFixed(2)}`,
        run: async (p, { mark }) => {
          await p.waitForFunction(() => window.__vpReady === true, null, { timeout: 20000 });
          mark(k);
          await p.waitForTimeout((d * 1000 + AIR) / SPEED);
          mark('end');
        },
      };
    }), { outDir: OUT });
  } finally { server.close(); }
}

if (ONLY !== 'karten') await labTake();
if (ONLY !== 'lab') await cardTake();
console.log('BB84 RECORD DONE');
