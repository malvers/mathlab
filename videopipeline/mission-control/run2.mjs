// Die ganze Klasse im Blick (Mission Control) — step 2: film teacher and pupil side by side.
//
// ONE TAKE on ONE page: stage.html holds the teacher's svp/leistungstest.html (left, as tiles)
// and the pupil's infotestfos12.html in a phone frame (right). Recording the stage means both
// halves share one clock - no two recordings to line up. Eight more pupils work in a second,
// unrecorded browser, so Mission Control fills up for real.
//
// WHAT THE PAGES DICTATE (measured 18.09.2026, not guessed):
//  1. THE POOL: the demo class GENII writes into infotestfos12-eingang-v1-GENII. Doc's 21 staged
//     submissions live there and would show up in the live dashboard (s11) - they are parked
//     under ...-GENII-PARKED for the shoot and restored afterwards (see the memory note).
//  2. TWO DEVICES ON ONE PAGE: a click in the teacher frame takes the focus from the pupil frame,
//     and the test guard would count that as leaving. On two real devices that cannot happen, so
//     document.hasFocus() answers true everywhere; the pupil leaves the way a tab switch does it
//     (document.hidden + visibilitychange), which runs the guard's real code path.
//  3. HEARTBEAT 15 s -> 3 s: an abort reaches the pupil with the next heartbeat. In the film the
//     wait would be cut anyway; a shorter beat keeps it in sync with Solita's sentence.
//  4. THE ABORT CLICK needs Doc's svp session, which the recording does not have. The first click
//     ("Wirklich? Nochmal klicken") is real; for the second, run2 calls quiz_abort on the server
//     with Doc's uid (Mgmt API, simulated JWT) and the page's svpAuth.api answers ok. Everything
//     the page shows afterwards comes from the server. Doc accepted this in the plot (18.09.).
//  5. OUR OWN CURSOR: the recorder's cursor cannot follow the mouse into iframes, so stage.html
//     draws one and run2 moves it to every target before the real click.
//  6. LIVE-RELOAD is held off in every frame (__liveReloadBusy) - a save elsewhere must not
//     reload a page mid-take.
//  7. ACTIONS SIT IN SOLITA'S PAUSES: silencedetect d=1.0 on each MP3 finds the 1.3 s breaks;
//     the audio starts 0.5 s after each scene mark (buildScenes' adelay), so atSec adds that.
//
// VP_CHECK=1 walks everything without recording and drops a screenshot per scene.
// Cleanup after every run (check or take): the film's rows in the GENII pool (see run3 notes).
import fs from 'fs';
import http from 'http';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('mission-control');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const CHECK = !!process.env.VP_CHECK;
const SHOTS = CHECK || !!process.env.VP_SHOTS;

const SITE = 'http://localhost:8765';
const STAGE_PORT = 8898;
const STAGE = `http://127.0.0.1:${STAGE_PORT}/stage.html`;
const POOL = 'infotestfos12-eingang-v1-GENII';
const OWNER = '2889073e-cbb8-4ca1-ad48-5234abe40585';   // the plan owner, as in the RLS policies
const AIR = 1500;                                        // room after every scene's narration
const LEAD = 500;                                        // buildScenes delays the voice by 0.5 s
const END_HOLD = 5200;                                   // the end card with the class and the cheer (3.8 s)
const WRONG = new Set([4, 11, 19, 27]);                  // the pupil's four mistakes: 29/33, Note 2

// the dashboard's gate hash, read from the gate itself (public by design, never the passphrase)
const GATE_HASH = (fs.readFileSync(`${REPO}/HTML/svp/svp-gate.js`, 'utf8').match(/const HASHES = \[\s*'([0-9a-f]{64})'/) || [])[1];
if (!GATE_HASH) throw new Error('Gate-Hash nicht gefunden in svp-gate.js');

/* ---------------------------------------------------------------- server side */
const TOKEN = fs.readFileSync(`${process.env.HOME}/.supabase/access-token`, 'utf8').trim();
async function sql(query) {
  const r = await fetch('https://api.supabase.com/v1/projects/fyfhxzyymmurlaenmzse/database/query', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json',
               // Cloudflare answers the default node UA with 403 / error 1010
               'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' },
    body: JSON.stringify({ query }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error('SQL ' + r.status + ' ' + t.slice(0, 200));
  return t;
}
const asOwner = (call) => sql(`begin; set local role authenticated; set local request.jwt.claims = ` +
  `'{"sub":"${OWNER}","role":"authenticated"}'; select ${call}; commit;`);
const abortRun = (code, on) => asOwner(`quiz_abort('${POOL}', '${code}', ${on})`);

const parked = JSON.parse(await sql(`select count(*)::int n from quiz_submissions where quiz = '${POOL}'`))[0].n;
if (parked) throw new Error(`Pool ${POOL} ist nicht leer (${parked} Abgaben) - erst parken bzw. aufräumen`);

/* ------------------------------------------------------------------- cues */
function cues(scene, minLen = 1.0) {
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'info', '-i', `${OUT}/${scene}.mp3`,
    '-af', `silencedetect=noise=-40dB:d=${minLen}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = (r.stderr || '') + (r.stdout || '');
  const starts = [...out.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => parseFloat(m[1]));
  const ends = [...out.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? s + minLen }));
}
const CUE = {};
for (let i = 1; i <= 12; i++) CUE['s' + i] = cues('s' + i);
console.log('Regiepausen:', Object.entries(CUE).map(([k, c]) => k + ' ' + c.map((x) => x.start.toFixed(1)).join('/')).join(' · '));
const cueStart = (k, n, fb) => (CUE[k][n] ? CUE[k][n].start : fb);
const cueEnd = (k, n, fb) => (CUE[k][n] ? CUE[k][n].end : fb);

/* ------------------------------------------------------ every frame, every page */
const INIT = () => {
  Document.prototype.hasFocus = function () { return true; };          // two devices, see note 2
  const si = window.setInterval;                                       // heartbeat, note 3
  window.setInterval = function (fn, ms, ...a) { return si.call(window, fn, ms === 15000 ? 3000 : ms, ...a); };
  window.__liveReloadBusy = () => true;                                // note 6
  // zoom, never transform: the text is drawn at its final size and stays sharp (stage.html)
  const Z = { pupil: '0.74872', teacher: '0.8', teacher2: '0.8' }[window.name];
  if (Z) {
    const zoom = () => { document.documentElement.style.zoom = Z; };
    if (document.documentElement) zoom();
    document.addEventListener('DOMContentLoaded', zoom);
  }
};

/* ------------------------------------------------------- the stage's own server */
const server = http.createServer((req, res) => {
  const file = path.join(HERE, 'stage.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(STAGE_PORT, '127.0.0.1', r));

/* ------------------------------------------------- the class in the background */
const bgBrowser = await chromium.launch({ channel: 'chromium' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function bgOpen(code) {
  const ctx = await bgBrowser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(INIT);
  const pg = await ctx.newPage();
  await pg.goto(`${SITE}/infotestfos12.html?klasse=GENII&code=${code}`, { waitUntil: 'load' });
  await pg.waitForSelector('.guard-start .guard-btn', { timeout: 20000 });
  return { code, ctx, pg, stop: null };
}
const bgAnswer = (b, n, p) => b.pg.evaluate(({ n, p }) => {
  const Q = window.QUIZ.questions;
  let done = 0;
  for (let i = 0; i < Q.length && done < n; i++) {
    if (document.querySelector('.opt.sel[data-q="' + i + '"]')) continue;
    let o = Q[i].solution;
    if (Math.random() > p) o = (o + 1 + Math.floor(Math.random() * 3)) % 4;
    const btn = document.querySelector('.opt[data-q="' + i + '"][data-o="' + o + '"]');
    if (btn) { btn.click(); done++; }
  }
}, { n, p }).catch(() => {});
function bgDrip(b, every, p) {
  let on = true;
  (async () => {
    while (on) {
      await sleep(every * (0.7 + Math.random() * 0.6));
      if (on) await bgAnswer(b, 1, p);
    }
  })();
  b.stop = () => { on = false; };
}
async function bgFinish(b, p) {
  if (b.stop) b.stop();
  await bgAnswer(b, 99, p);
  await b.pg.evaluate(() => document.getElementById('submitBtn').click()).catch(() => {});
}

/* ------------------------------------------------------------------ the take */
const TAKE = {
  name: 'take',
  url: STAGE,
  async run(p, { mark }) {
    await p.addInitScript(INIT);
    await p.reload({ waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);

    let sceneT0 = 0, deadline = 0;
    const tick = (ms) => p.waitForTimeout(Math.max(15, ms));
    const fr = (name) => p.frame({ name });
    const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${n}.png` }); };
    const scene = async (k, n, title) => {
      mark(k);
      sceneT0 = Date.now();
      deadline = sceneT0 + LEAD + durs[k] * 1000 + AIR;
      await p.evaluate(([n, t]) => window.stage.caption(n, t), [n, title]);
    };
    const atSec = async (sec) => { const w = sceneT0 + LEAD + sec * 1000 - Date.now(); if (w > 20) await p.waitForTimeout(w); };
    const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
    async function waitIn(name, sel, timeout = 20000) {
      const t0 = Date.now();
      while (Date.now() - t0 < timeout) {
        const f = fr(name);
        if (f) { try { if (await f.locator(sel).count()) return f; } catch (e) { /* navigating */ } }
        await p.waitForTimeout(200);
      }
      throw new Error(`timeout: ${name} ${sel}`);
    }
    const unbadge = (name) => fr(name).evaluate(() => document.getElementById('local-badge')?.remove()).catch(() => {});
    /** Move the stage cursor onto the target, ripple, then click it. The point is computed
        here: with dsf 2 Playwright maps coordinates into a scaled iframe wrong (measured:
        x 453 instead of 365, the 1/0.8 of the scale) and its click lands next to the target.
        So: the element's centre in frame coordinates, times the iframe's visual scale, plus
        the iframe's place on the stage; the click itself is the element's own click(). */
    async function tap(name, sel) {
      const [x, y] = await point(name, sel);
      await p.evaluate(([x, y]) => window.stage.ripple(x, y), [x, y]);
      await fr(name).evaluate((sel) => document.querySelector(sel).click(), sel);
      await tick(250);
    }
    /** only move the cursor onto the target (and wait for the glide); returns the stage point */
    async function point(name, sel) {
      const f = fr(name);
      const inView = await f.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const ok = b.top >= 0 && b.bottom <= innerHeight;
        if (!ok) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return ok;
      }, sel);
      if (inView === null) throw new Error('kein Ziel: ' + sel);
      if (!inView) await tick(650);
      const c = await f.evaluate((sel) => {
        const b = document.querySelector(sel).getBoundingClientRect();
        return [b.x + b.width / 2, b.y + b.height / 2];
      }, sel);
      const [x, y] = await p.evaluate(([name, cx, cy]) => {
        const el = document.getElementById(name);
        const R = el.getBoundingClientRect();
        const s = R.width / el.offsetWidth;
        return [R.left + cx * s, R.top + cy * s];
      }, [name, c[0], c[1]]);
      await p.evaluate(([x, y]) => window.stage.cursor(x, y), [x, y]);
      await tick(620);
      return [x, y];
    }
    const callout = (text, xy) => p.evaluate(([t, x, y]) => window.stage.callout(t, x, y), [text, xy ? xy[0] : 0, xy ? xy[1] : 0]);
    const tEval = (fn, arg) => fr('teacher').evaluate(fn, arg);
    const tScroll = (sel, block = 'start') => tEval(([s, b]) =>
      document.querySelector(s)?.scrollIntoView({ behavior: 'smooth', block: b }), [sel, block]);
    /* an earlier poll: the page asks every 5 s anyway; this only saves the wait */
    const tRefresh = () => tEval(() => document.getElementById('ltResults')?.click()).catch(() => {});
    const tile = (code) => `.lt-tile[data-code="${code}"]`;
    let next = 0;                                        // the pupil's next question
    async function answer(withCursor) {
      const i = next++;
      const f = fr('pupil');
      const sol = await f.evaluate((i) => window.QUIZ.questions[i].solution, i);
      const sel = `.opt[data-q="${i}"][data-o="${WRONG.has(i) ? (sol + 1) % 4 : sol}"]`;
      if (withCursor) { await tap('pupil', sel); return; }
      await f.evaluate((s) => {
        const b = document.querySelector(s);
        b.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(() => b.click(), 300);
      }, sel);
    }
    const hidePupil = (on) => fr('pupil').evaluate((on) => {
      if (on) Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      else delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    }, on);

    /* ------------------------------------------------------------ Startzustand */
    await p.evaluate(() => { window.stage.title(true); window.stage.openCard(); });   // the class, silent
    await p.evaluate((u) => window.stage.load('teacher', u), `${SITE}/svp/leistungstest.html?test`);
    await waitIn('teacher', '.lt-tile[data-code]');
    await tick(1500);
    await unbadge('teacher');
    const codes = await tEval(() => [...document.querySelectorAll('.lt-tile[data-code]')].map((t) => t.dataset.code));
    if (codes.length !== 24) throw new Error('GENII-Liste hat ' + codes.length + ' Codes');
    const A = codes[0];
    await tEval((h) => {
      localStorage.setItem('svp-edit-gate', h);          // the live dashboard's gate (s11)
      svpAuth.hasSession = () => true;                   // note 4: the server call is run2's
      svpAuth.api = async () => ({ ok: true, status: 204 });
      svpAuth.whoami = () => 'Doc';
    }, GATE_HASH);
    await tScroll('#ltMc');
    const bg = await Promise.all(codes.slice(1, 9).map(bgOpen));
    console.log('Klasse bereit:', A, '+', bg.map((b) => b.code).join(' '));
    await tick(1200);
    await shot('s0');

    /* -- 1 · Die ganze Klasse im Blick (title card) ----------------------------- */
    await scene('s1', '', '');
    await rest();
    await tEval(() => window.scrollTo(0, 0));
    await p.evaluate(() => window.stage.title(false));
    await tick(900);
    await p.evaluate(() => window.stage.resetCard());    // the end card slides in again, with the cheer

    /* -- 2 · Die Zettel ---------------------------------------------------------- */
    await scene('s2', '02', 'Die Zettel');
    await atSec(0.6);
    await tScroll('#ltMc');
    await shot('s2a');
    await atSec(cueStart('s2', 0, 7.7));
    await tScroll('#ltName', 'center');
    await tick(800);
    await tap('teacher', '#ltName');                      // "Zettel ohne Klarname"
    await tick(600);
    await tScroll('#ltSlipCard');
    await tick(1400);
    // one card grows - as a copy on top (the grid stays put) and by ZOOM, stepped per frame, so the
    // text and the QR are drawn anew at every size instead of blowing up a picture (Doc: "unscharf")
    await tEval(() => {
      const s = document.querySelector('#ltSlips .lt-slip');
      if (!s) return;
      // layout values, not screen values: inside the zoomed page they are the ones CSS understands
      const box = s.parentNode;
      if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
      const c = s.cloneNode(true);
      c.id = 'vp-bigslip';
      Object.assign(c.style, { position: 'absolute', left: s.offsetLeft + 'px', top: s.offsetTop + 'px',
        width: s.offsetWidth + 'px', zIndex: 50, margin: 0, boxShadow: '0 12px 40px rgba(0,0,0,0.55)' });
      box.appendChild(c);
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3);
        c.style.zoom = String(1 + 0.55 * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    await shot('s2b');
    await rest();
    await tEval(() => document.getElementById('vp-bigslip')?.remove());

    /* -- 3 · QR scannen ------------------------------------------------------------ */
    await scene('s3', '03', 'QR scannen');
    await p.evaluate((u) => window.stage.load('pupil', u), `${SITE}/infotestfos12.html?klasse=GENII&code=${A}`);
    await tScroll('#ltMc');
    await waitIn('pupil', '.guard-start .guard-btn');
    await unbadge('pupil');
    await shot('s3');
    await rest();

    /* -- 4 · Die Klasse legt los (Kernszene) ------------------------------------- */
    await scene('s4', '04', 'Die Klasse legt los');
    await atSec(cueStart('s4', 0, 1.5));
    await tap('pupil', '.guard-btn');                     // Test starten
    await tick(700);
    await answer(true);
    await tick(500);
    await answer(true);
    await tick(1200);
    await tRefresh();
    await tick(1800);
    await answer(false);
    await atSec(cueStart('s4', 1, 13.0));
    for (let i = 0; i < bg.length; i++) {                 // the others start, one by one
      await bg[i].pg.click('.guard-btn').catch(() => {});
      bgDrip(bg[i], 3200 + i * 250, i === 6 ? 0.55 : 0.75);
      await tick(450);
    }
    // s7: the WLAN goes, the page stays - no leave is reported, only the heartbeat stops
    // (closing the page would report a leave and read "weg" for another 90 s)
    await bgAnswer(bg[7], 2, 0.75);
    setTimeout(() => { bg[7].stop(); bg[7].ctx.setOffline(true).catch(() => {}); }, 6000);
    await tick(900);
    await tRefresh();
    await answer(false);
    await tick(2500);
    await tRefresh();
    await answer(false);
    await shot('s4');
    await rest();

    /* -- 5 · Kurz mal weg (Kernszene) --------------------------------------------- */
    await scene('s5', '05', 'Kurz mal weg');
    await atSec(cueStart('s5', 0, 3.1));
    await hidePupil(true);                                // another window: the guard's own path
    await tick(1800);
    await tRefresh();
    await shot('s5');
    await rest();

    /* -- 6 · Weiter ---------------------------------------------------------------- */
    await scene('s6', '06', 'Weiter');
    await atSec(0.2);
    await hidePupil(false);
    await tap('pupil', '.guard-btn');                     // Weiter mit dem Test
    await atSec(cueStart('s6', 0, 5.3));
    await answer(true);
    await tick(1800);
    await tRefresh();
    await shot('s6');
    await rest();

    /* -- 7 · Funkstille ------------------------------------------------------------ */
    await scene('s7', '07', 'Funkstille');
    await atSec(0.3);
    await tRefresh();
    await atSec(3.5);
    await answer(false);
    await shot('s7');
    await rest();

    /* -- 8 · Der rote Knopf (Kernszene) ------------------------------------------- */
    // Doc's review (18.09., 2:28): taking the abort back was unclear - every button of this scene gets
    // a label next to the cursor, and Solita names "Abbruch zurücknehmen" while the cursor is on it.
    await scene('s8', '08', 'Der rote Knopf');
    await atSec(1.5);
    await answer(false);
    await atSec(4.2);
    await tap('teacher', tile(A));                        // the detail with the red button
    await tick(500);
    await tScroll('#ltMc');                               // tiles AND detail in the picture
    await tick(900);
    let xy = await point('teacher', '#ltAbort .lt-btn');
    await callout('Test abbrechen', xy);
    await tick(500);
    await tap('teacher', '#ltAbort .lt-btn');             // -> "Wirklich? Nochmal klicken"
    await callout('Nochmal klicken = bestätigen', xy);
    await atSec(cueStart('s8', 0, 8.7) - 0.9);
    await abortRun(A, true);                              // note 4
    await tap('teacher', '#ltAbort .lt-btn');             // the second click
    await callout(null);
    await tick(400);
    await tScroll('#ltMc');
    await shot('s8a');
    await atSec(cueStart('s8', 1, 15.4) + 0.2);
    xy = await point('teacher', '#ltAbort .lt-btn');      // "Abbruch zurücknehmen", while Solita names it
    await callout('Abbruch zurücknehmen', xy);
    await atSec(cueStart('s8', 2, 20.7) - 0.4);
    await abortRun(A, false);
    await tap('teacher', '#ltAbort .lt-btn');
    await shot('s8b');
    await tick(1200);
    await callout(null);
    await waitIn('pupil', '.guard-start:not([hidden]) .guard-btn', 6000).catch(() => {});
    await tick(1600);                                     // "Es geht weiter" stays in the picture a moment
    await tap('pupil', '.guard-btn');                     // Weiter mit dem Test
    await rest();

    /* -- 9 · Abgabe ------------------------------------------------------------------ */
    await scene('s9', '09', 'Abgabe');
    await atSec(0.3);
    bg.slice(0, 6).forEach((b, i) => setTimeout(() => bgFinish(b, 0.75), 900 + i * 1400));
    while (next < 33) { await answer(false); await tick(170); }
    await tick(400);
    await tap('pupil', '#submitBtn');
    await tick(1800);
    await tRefresh();
    await tScroll('#ltMc');
    await tick(2500);
    await tRefresh();
    await shot('s9');
    await rest();

    /* -- 10 · Frage für Frage -------------------------------------------------------- */
    await scene('s10', '10', 'Frage für Frage');
    await atSec(0.2);
    await tEval(() => { document.querySelectorAll('.lt-tile.sel').forEach((t) => t.classList.remove('sel'));
      document.getElementById('ltDetail').hidden = true; });
    await p.evaluate((u) => window.stage.load('teacher2', u), `${SITE}/infotestfos12.html?klasse=GENII&auswertung`);
    await tRefresh();
    await atSec(cueStart('s10', 0, 2.2));
    await tap('teacher', tile(A));
    await tick(500);
    await tScroll('#ltMc');
    await shot('s10');
    await rest();

    /* -- 11 · Die Klasse als Ganzes (Kernszene) --------------------------------------- */
    await scene('s11', '11', 'Die Klasse als Ganzes');
    await unbadge('teacher2');
    await atSec(cueStart('s11', 0, 2.8));
    await p.evaluate(() => window.stage.show('teacher2', true));
    await atSec(7.5);
    await fr('teacher2').evaluate(() => document.getElementById('dashquestions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })).catch(() => {});
    await shot('s11');
    await rest();

    /* -- 12 · Kein Name auf dem Server ------------------------------------------------ */
    await scene('s12', '12', 'Kein Name auf dem Server');
    await p.evaluate(() => window.stage.show('teacher2', false));
    await tEval(() => { document.querySelectorAll('.lt-tile.sel').forEach((t) => t.classList.remove('sel'));
      document.getElementById('ltDetail').hidden = true; });
    await tScroll('#ltMc');
    await p.evaluate(() => window.stage.hideCursor());
    await shot('s12');
    await atSec(cueStart('s12', 0, 7.8));
    await p.evaluate(() => window.stage.title(true));
    await rest();
    // Doc's review (18.09., 3:28): the title moves up, the class from the intro comes in below it - run3
    // lays the intro's cheer (kids.wav) exactly here: durs.s12 + AIR after the scene's voice starts
    await p.evaluate(() => window.stage.endCard());
    await tick(END_HOLD);

    mark('end');
    await tick(1600);
    for (const b of bg) { if (b.stop) b.stop(); }
  },
};

try {
  await runScenes([TAKE], { outDir: OUT, viewport: { width: 1280, height: 720 }, dsf: 2, upscale: 1,
    showCursor: false, record: !CHECK });
} finally {
  await bgBrowser.close().catch(() => {});
  server.close();
}
console.log(CHECK ? 'PROBELAUF FERTIG — Bilder in ' + OUT : 'ROHMATERIAL in ' + OUT + '/take.mp4');
