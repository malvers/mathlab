/**
 * make-app-icons.mjs - renders the house lambda (HTML/resources/favicon.svg) into
 * the PNG sizes a web app manifest needs. Run: node tools/make-app-icons.mjs
 *
 * ONE source: the favicon SVG. Two shapes come out of it.
 *   - "any"      : the icon as it is - the orange plate with its rounded corners,
 *                  transparent outside. What a browser tab and a bookmark show.
 *   - "maskable" : the same lambda, but the orange fills the WHOLE square and the
 *                  letter sits in the inner 80 %. An Android launcher cuts its own
 *                  shape (circle, squircle, teardrop) out of an icon marked this
 *                  way - with the rounded plate it would cut the corners off into
 *                  transparency.
 *
 * Rendered by headless Chrome over the DevTools protocol: it is the same engine
 * that shows the SVG everywhere else, so nothing is redrawn by hand and the icon
 * follows the favicon whenever that changes. sips and PIL cannot read SVG.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', 'HTML', 'resources', 'favicon.svg');
const OUT = path.join(HERE, '..', 'HTML', 'resources');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9336;

const svg = fs.readFileSync(SRC, 'utf8');
/* The maskable twin: plate without rounded corners, lambda pulled to 80 % around
   the centre of the 64-unit box. Both numbers are read out of the file, not typed
   here, so a new favicon geometry travels with it. */
const maskable = svg
    .replace(/rx="\d+"/, 'rx="0"')
    .replace(/<g stroke=/, '<g transform="translate(6.4 6.4) scale(0.8)" stroke=');

const JOBS = [
    { name: 'app-192.png', size: 192, body: svg },
    { name: 'app-512.png', size: 512, body: svg },
    { name: 'app-512-maskable.png', size: 512, body: maskable },
    /* iOS has no maskable purpose and puts its own rounded mask on top - it gets
       the plain one, in the size Safari asks for. */
    { name: 'apple-touch-icon.png', size: 180, body: svg }
];

const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT,
    '--user-data-dir=/tmp/chrome-app-icons', '--force-device-scale-factor=1', 'about:blank'],
    { stdio: 'ignore', detached: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws;
try {
    let targets = null;
    for (let i = 0; i < 40 && !targets; i++) {
        await sleep(250);
        try { targets = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); } catch (e) { }
    }
    if (!targets) throw new Error('Chrome nicht erreichbar');
    ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 0; const pending = new Map();
    ws.onmessage = ev => { const m = JSON.parse(ev.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
    const send = (method, params) => new Promise(res => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params: params || {} })); });

    await send('Page.enable');
    for (const job of JOBS) {
        /* The page is the icon: no margin, no scrollbar, transparent behind it. */
        const page = '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}'
            + 'svg{display:block;width:' + job.size + 'px;height:' + job.size + 'px}</style>' + job.body;
        await send('Emulation.setDeviceMetricsOverride', { width: job.size, height: job.size, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(page) });
        await sleep(400);
        const shot = await send('Page.captureScreenshot', {
            format: 'png', captureBeyondViewport: true,
            clip: { x: 0, y: 0, width: job.size, height: job.size, scale: 1 }
        });
        const file = path.join(OUT, job.name);
        fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
        console.log(job.name.padEnd(26) + job.size + ' px, ' + Math.round(fs.statSync(file).size / 102.4) / 10 + ' KB');
    }
} finally {
    try { ws && ws.close(); } catch (e) { }
    try { process.kill(-chrome.pid); } catch (e) { }
}
