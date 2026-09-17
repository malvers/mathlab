#!/usr/bin/env node
// Screenshots of the labs and 3D dice on deck slides, for the presenter view (Doc, 17.09.2026: "kann man in den
// Thumb einen screenshot packen?"). The previews and the slide strip never run a lab live (one more WebGL context
// each) - they show a stand-in, and that stand-in now wears a real picture of the lab.
//
//   node tools/pptx/deck_shots.mjs                      # every deck with a lab, only missing pictures
//   node tools/pptx/deck_shots.mjs mathe11-wuerfelspiel # one deck (name or path)
//   node tools/pptx/deck_shots.mjs --force ...          # take them again (a lab changed its look)
//
// A picture is named by shotKey() in deck.js (lab address + size, not its place on the slide), so moving a lab
// or reordering slides keeps it. Missing pictures are simply not shown. Only missing ones are written by
// default: every rewrite would add a new binary to the git history.
//
// Headless Chrome over CDP (Node's built-in WebSocket, no packages) against a throwaway `python3 -m http.server`
// - not serve.py, whose LOCAL badge and live reload would end up in the pictures.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const HTML = join(ROOT, 'HTML'), DECKS = join(HTML, 'decks');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HTTP_PORT = 8797, CDP_PORT = 9352;
const SCALE = 2;            // pixels per slide pixel: sharp in the "Nächste Folie" preview on a retina screen
const SETTLE_MS = 3500;     // after the frames have loaded: WebGL, fonts and the labs' own start-up

const args = process.argv.slice(2);
const force = args.includes('--force');
let decks = args.filter(a => !a.startsWith('--')).map(a => join(DECKS, basename(a).replace(/\.html$/, '') + '.html'));
if (!decks.length) decks = readdirSync(DECKS).filter(f => f.endsWith('.html')).map(f => join(DECKS, f))
  .filter(f => /<iframe\b/.test(readFileSync(f, 'utf8')));
for (const d of decks) if (!existsSync(d)) { console.error('no such deck: ' + d); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
const kids = [];
function cleanup() { kids.forEach(k => { try { k.kill(); } catch (e) { } }); }
process.on('exit', cleanup);

async function until(what, fn, ms = 15000) {
  const t0 = Date.now();
  for (;;) {
    try { const v = await fn(); if (v) return v; } catch (e) { }
    if (Date.now() - t0 > ms) throw new Error('timeout: ' + what);
    await sleep(200);
  }
}

kids.push(spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1', '--directory', HTML], { stdio: 'ignore' }));
await until('http server', async () => (await fetch('http://127.0.0.1:' + HTTP_PORT + '/decks/deck.css')).ok);

const profile = mkdtempSync(join(tmpdir(), 'deck-shots-'));
kids.push(spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + profile,
  '--no-first-run', '--hide-scrollbars', '--mute-audio', '--use-gl=angle', '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader', 'about:blank'], { stdio: 'ignore' }));
const target = await until('chrome', async () =>
  (await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list')).json()).find(t => t.type === 'page'));
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
let seq = 0;
const waiting = {};
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && waiting[d.id]) { waiting[d.id](d); delete waiting[d.id]; } };
const cmd = (method, params = {}) => new Promise((ok, no) => {
  const id = ++seq;
  waiting[id] = d => d.error ? no(new Error(method + ': ' + d.error.message)) : ok(d.result);
  ws.send(JSON.stringify({ id, method, params }));
});
const run = async expr => {
  const r = await cmd('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text);
  return r.result.value;
};

// the stage exactly one slide large: the deck scales itself to 1
await cmd('Emulation.setDeviceMetricsOverride', { width: 960, height: 540, deviceScaleFactor: SCALE, mobile: false });
await cmd('Page.enable');
// nothing of the deck's chrome over a lab: HUD, page turner, Solita, edit pencil, big play buttons
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `
  if (window === top) addEventListener('DOMContentLoaded', function () {
    const s = document.createElement('style');
    s.textContent = 'body > *:not(#stage), #stage > *:not(#deck), .play-big, .play-big-label { visibility: hidden !important }';
    document.head.appendChild(s);
  });` });

const out = join(DECKS, 'img', 'shots');
mkdirSync(out, { recursive: true });
let made = 0, kept = 0;
for (const file of decks) {
  const name = basename(file);
  await cmd('Page.navigate', { url: 'http://127.0.0.1:' + HTTP_PORT + '/decks/' + name });
  await until(name + ' loaded', () => run(`document.readyState === 'complete' && typeof shotKey === 'function'`));
  const plan = await run(`slides.map(function (s, i) {
    return { i: i, keys: [].map.call(s.querySelectorAll('iframe'), shotKey) };
  }).filter(function (p) { return p.keys.length; })`);
  for (const p of plan) {
    const todo = p.keys.filter(k => force || !existsSync(join(DECKS, k)));
    if (!todo.length) { kept += p.keys.length; continue; }
    await run(`si = ${p.i}; step = groups(slides[si]); paint(); 1`);
    await until(name + ' slide ' + (p.i + 1) + ' frames', () => run(`[].every.call(slides[${p.i}].querySelectorAll('iframe'),
      function (f) { try { return f.contentDocument && f.contentDocument.readyState === 'complete' && f.contentDocument.URL !== 'about:blank'; } catch (e) { return true; } })`), 30000);
    await sleep(SETTLE_MS);
    // the stand-in's box: a lab's frame fills its .labframe, a die keeps the iframe's own place
    const boxes = await run(`[].map.call(slides[${p.i}].querySelectorAll('iframe'), function (f) {
      const b = (f.parentElement.classList.contains('labframe') ? f.parentElement : f).getBoundingClientRect();
      return { key: shotKey(f), x: b.left, y: b.top, width: b.width, height: b.height };
    })`);
    for (const b of boxes) {
      if (!force && existsSync(join(DECKS, b.key))) { kept++; continue; }
      const shot = await cmd('Page.captureScreenshot', { format: 'webp', quality: 82,
        clip: { x: b.x, y: b.y, width: b.width, height: b.height, scale: 1 } });
      writeFileSync(join(DECKS, b.key), Buffer.from(shot.data, 'base64'));
      made++;
      console.log(name + ' slide ' + (p.i + 1) + ': ' + b.key + ' (' + Math.round(shot.data.length * 3 / 4 / 1024) + ' KB)');
    }
  }
}
console.log(made + ' taken, ' + kept + ' already there');
ws.close();
cleanup();
try { rmSync(profile, { recursive: true, force: true }); } catch (e) { }
process.exit(0);
