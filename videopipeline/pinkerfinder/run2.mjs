// Pinker-Finder demo — step 2: one continuous take of the app window, cut apart in run3.
//
// Native, not a browser: tools/screcord films ONE window through ScreenCaptureKit (works
// while other windows cover it), tools/axdrive drives the app — toolbar buttons and the two
// sidebar tabs through AX actions, rows, facets and path segments through real mouse clicks
// on the AX centre of the element. So the app has to be in front and the display awake
// (caffeinate). The marks (label, t) land in main.json exactly like the browser recorder's.
//
// Doc's rules for this film (04.09.2026): no "Find a picture", no icon/gallery view, no
// preview pane — names and numbers only; the exclude list is on (checked at the start).
//
// VP_CHECK=1 walks the choreography without recording and drops a screenshot per scene.
// VP_SPEED=6 shortens every wait. VP_WID=<id> uses that window instead of the first big one.
import fs from 'fs';
import { execFileSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('pinkerfinder');
fs.mkdirSync(OUT, { recursive: true });
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const TOOLS = fileURLToPath(new URL('./tools/', import.meta.url));
const CHECK = !!process.env.VP_CHECK;
const SPEED = Number(process.env.VP_SPEED || 1);
const AIR = 1.6;                                   // breathing room after every scene's narration
const EXTRA = { s4: 1.5, s6: 1.0, s9: 1.0 };

const pid = Number(execFileSync('pgrep', ['-x', 'PinkerFinder']).toString().trim().split('\n')[0]);
if (!pid) throw new Error('PinkerFinder läuft nicht');
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(15, ms / SPEED)));
const drive = (...steps) => {
  const out = execFileSync(`${TOOLS}axdrive`, [String(pid), ...steps]).toString();
  process.stdout.write(out.split('\n').filter(Boolean).map((l) => '   ' + l).join('\n') + '\n');
  if (/not found|no table|only \d+ rows|only \d+ segments/.test(out)) log.push({ label: 'ERROR ' + steps.join(' '), t: now() });
  return out;
};
const windowId = () => {
  if (process.env.VP_WID) return process.env.VP_WID;
  const lines = execFileSync(`${TOOLS}wpid`).toString().split('\n');
  for (const l of lines) {
    const f = l.split('\t');
    if (f[2] === 'Pinker-Finder' && f[3] === 'L0' && /\d+x\d+/.test(f[7] || '')) {
      const w = Number(f[7].split(' ')[1].split('x')[0]);
      if (w > 900) return f[0];
    }
  }
  throw new Error('kein Pinker-Finder-Fenster gefunden');
};
const shot = (name) => {
  const wid = windowId();
  execFileSync('screencapture', ['-x', '-o', '-l', wid, `${OUT}/shot_${name}.png`]);
};

/* --- the clock: every scene lasts as long as Solita needs, plus air --- */
const log = [];
let t0 = Date.now();
const now = () => (Date.now() - t0) / 1000;
let deadline = 0;
const scene = async (k) => {
  log.push({ label: k, t: now() });
  console.log(`-- ${k} @ ${now().toFixed(1)}s`);
  deadline = Date.now() + ((durs[k] || 15) * 1000 + AIR * 1000 + (EXTRA[k] || 0) * 1000) / SPEED;
  if (CHECK) { await sleep(600); shot(k); }
};
const rest = async () => { const w = deadline - Date.now(); if (w > 20) await new Promise((r) => setTimeout(r, w)); };

/* ---------------------------------------------------------------- Startzustand */
// the exclude list must be on: 157k objects, not 277k — read through the index dump if present
try {
  const n = fs.readFileSync('/tmp/pf_index.txt', 'utf8').split('\n').length;
  console.log('Index-Dump:', n, 'Einträge');
  if (n > 200000) throw new Error('Sperrliste greift nicht (' + n + ' Einträge) — Abbruch');
} catch (e) { if (/Sperrliste/.test(e.message)) throw e; console.log('(kein Index-Dump, Sperrliste nicht geprüft)'); }

// keep display and system awake for the whole take (caffeinate ends with this process)
const caff = spawn('caffeinate', ['-d', '-i', '-w', String(process.pid)], { stdio: 'ignore' });
caff.unref();                                       // otherwise node waits for caffeinate, which waits for node
drive('activate', 'window:215,60,1280,720', 'sleep:0.5');
// clear a leftover search and start in Folders/Home, list view, no facets
drive('press:Folders', 'press:Home', 'sleep:0.6');
drive('hidkey:19+cmd', 'sleep:0.4');                       // ⌘2 = list view (⌘1 is icons — thumbnails, never in this film)
drive('press:Semantics', 'sleep:0.5');
// facets that may still be on from an earlier session: the pills carry a ⓧ button. AXPress on it
// returns success and does nothing — a real click on it does the job.
for (let i = 0; i < 6; i++) { const o = drive('click:Remove this filter'); if (/not found/.test(o)) break; await sleep(500); }
drive('press:Semantics', 'sbar:0', 'press:Folders', 'press:Home', 'sleep:1.0');
if (CHECK) shot('start');

/* ---------------------------------------------------------------- Aufnahme */
let rec = null;
if (!CHECK) {
  const wid = windowId();
  rec = spawn(`${TOOLS}screcord`, [wid, '400', `${OUT}/main.mp4`, '2'], { stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((resolve, reject) => {
    rec.stdout.on('data', (d) => {
      const s = d.toString(); process.stdout.write('   rec: ' + s);
      if (/recording started/.test(s)) resolve();
      if (/failed|not found/.test(s)) reject(new Error(s));
    });
    rec.on('exit', (c) => reject(new Error('recorder ended early ' + c)));
  });
  t0 = Date.now();
  await sleep(800);
}

/* ---------------------------------------------------------------- Szenen */
// s1 — the window, still
await scene('s1');
await rest();

// s2 — Home → Desktop → Schule, back, forward, sort by Date Modified
await scene('s2');
// spoken: Home. [1.4] Ein Projektordner. [1.5] Zurück, [1.1] und wieder vor. [1.1] Ein Klick auf Date Modified
// (not the Desktop and not 'Schule': that folder lists Doc's legal correspondence by name)
await sleep(700); drive('click:Home'); await sleep(1900);
drive('dblclick:pinkerfinder'); await sleep(2600);
drive('press:Back'); await sleep(1900);
drive('press:Forward'); await sleep(2200);
drive('press:Date Modified'); await sleep(1200);
await rest();

// s3 — a OneDrive folder with sync badges
await scene('s3');
await sleep(600); drive('click:OneDrive-PrivateSchuleIBBgGmbHDresden'); await sleep(2200);
drive('dblclick:UNTERRICHT'); await sleep(2500);
await rest();

// s4 — the second tab
await scene('s4');
await sleep(2400);                                   // 'Und jetzt der zweite Reiter.' [0.9] Semantics.
drive('press:Semantics'); await sleep(1500);
await rest();

// s5 — Images: one cut through every folder
await scene('s5');
await sleep(4200);                                   // '…Bilder. [0.7] Ein Klick,' → the click in the 1.2 s pause
drive('click:Images'); await sleep(2500);
await rest();

// s6 — plus a year: the other numbers shrink too
await scene('s6');
drive('sbar:0.35'); await sleep(1200);               // Period sits below the visible sidebar (measured: 0.35 puts it mid-screen)
drive('click:30 days'); await sleep(2500);            // in the 1.5 s pause after 'die letzten dreißig Tage.'
await rest();

// s7 — clear, then ≥ 1 GB
await scene('s7');
drive('click:30 days'); await sleep(600);             // 'Alles wieder weg.' → the two facets off again (second click = off)
drive('sbar:0'); await sleep(500);
drive('click:Images'); await sleep(1200);
// with no facet on, '≥ 1 GB' is back (zero counts are hidden while Images is on)
drive('click:≥ 1 GB'); await sleep(2500);
await rest();

// (s8, image content, is not in the film: the label index was empty on the day)

// s9 — one of the four big files (the film in its own folder), its folder, the Folders tab, the file marked
await scene('s9');
await sleep(900);                                    // 'Eine davon.' → row in the 1.2 s pause
drive('row:2'); await sleep(2600);                   // row 2 = the iTunes film: its folder holds one file, nothing private
// the path bar now shows the clicked file's own path; its last segment is the file's name
const segOut = drive('pathseg:2'); await sleep(2300);   // 'Ein Klick auf ihren Ordner,' → segment in the 1.4 s pause
const segs = (segOut.match(/of \[(.*)\]/) || [])[1];
const name = segs ? segs.split('", "').pop().replace(/^"|"$/g, '') : null;
// the folder is browsed, but the size facet still slices the list — its pill goes, then the tab
drive('click:Remove this filter'); await sleep(900);
drive('press:Folders'); await sleep(1200);            // '…springt zurück auf Folders:' → tab in the 1.0 s pause
if (name && name !== '?') drive(`click:${name}`);
await sleep(1000);
await rest();

// the card scene comes from card10.mp4, not the take — but a fresh shot of the window as it
// stands now is the right-hand half of that card
log.push({ label: 'end', t: now() });
await sleep(1500);
shot('today');

/* ---------------------------------------------------------------- Ende */
if (rec) {
  rec.kill('SIGINT');
  await new Promise((r) => rec.on('exit', r));
}
fs.writeFileSync(`${OUT}/main.json`, JSON.stringify(log, null, 1));
console.log('Marken:', log.map((m) => `${m.label} ${m.t.toFixed(1)}`).join(' · '));
execFileSync('python3', [fileURLToPath(new URL('./card10.py', import.meta.url)), `${OUT}/shot_today.png`,
  String((durs.s10 || 15) + AIR), OUT], { stdio: 'inherit' });
console.log(CHECK ? 'Probelauf fertig — Screenshots in ' + OUT : 'Take fertig: ' + OUT + '/main.mp4');
caff.kill();
