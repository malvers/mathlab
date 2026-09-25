#!/usr/bin/env node
// Score the handwriting corpus. For every probe, two separate questions:
//
//   READ   - did Gemini read what Doc copied? Its LaTeX and the template are
//            both set with KaTeX and their glyph sequences compared. A misread
//            is Gemini's fault and must not count against the grouping.
//   GROUP  - does the grouping in js/stroke-symbols.js turn the strokes into
//            exactly the glyphs of the TEMPLATE (the ground truth), in one row,
//            and in the right order?
//
// "Right order" is checked, not assumed: equal counts only mean the lists are
// equally long. Both the handwriting and the typeset template are normalised
// to their own bounding box; each pair (symbol, glyph) should then sit in
// roughly the same place. A pair far apart means the order is wrong there.
//
//   node tools/handschrift_auswerten.mjs              # all probes
//   node tools/handschrift_auswerten.mjs 17 21        # only these
//   node tools/handschrift_auswerten.mjs --detail 21  # per-pair table
//   node tools/handschrift_auswerten.mjs --bild 11    # + a picture per probe (boxes, glyphs, stroke numbers)
//
// Needs serve.py on :8765 and headless Chrome. No API call.
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('../HTML/morpheus/handschrift-proben/', import.meta.url).pathname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9341;
const args = process.argv.slice(2);
const detail = args.includes('--detail');
const bild = args.includes('--bild');
const only = args.filter(a => !a.startsWith('--'));
const BILDER = '/tmp/handschrift-bilder';
if (bild) mkdirSync(BILDER, { recursive: true });
const GRENZE = 0.35;              // normalised distance above which a pair counts as misplaced

const files = readdirSync(DIR).filter(f => /^probe-\d+-.*\.json$/.test(f)).sort()
    .filter(f => !only.length || only.some(o => f.startsWith('probe-' + o.padStart(2, '0') + '-') || f.includes(o)));
if (!files.length) { console.log('keine Proben'); process.exit(0); }

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--mute-audio',
    '--no-first-run', '--no-default-browser-check', '--user-data-dir=/tmp/cdp-auswerten',
    '--window-size=1600,1100', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let t;
for (let i = 0; i < 40; i++) {
    try { t = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (t.length) break; } catch {}
    await sleep(250);
}
const ws = new WebSocket((t.find(x => x.type === 'page') || t[0]).webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.addEventListener('message', ev => {
    const m = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
await new Promise(r => ws.addEventListener('open', r, { once: true }));
const send = (method, params = {}, ms = 60000) => new Promise(res => {
    const mid = ++id;
    const to = setTimeout(() => { pending.delete(mid); res({ TIMEOUT: true }); }, ms);
    pending.set(mid, m => { clearTimeout(to); res(m); });
    ws.send(JSON.stringify({ id: mid, method, params }));
});
const ev_ = async (e, ms = 60000) => {
    const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }, ms);
    if (r.TIMEOUT) return { ERROR: 'Zeit' };
    return r.result?.exceptionDetails ? { ERROR: JSON.stringify(r.result.exceptionDetails).slice(0, 240) } : r.result?.result?.value;
};
await send('Runtime.enable');
await send('Page.navigate', { url: 'http://localhost:8765/vorrechnen.html' });
await sleep(4500);

const zeilen = [];
const summe = { n: 0, gelesen: 0, roh: 0, nach: 0 };
for (const f of files) {
    const d = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
    const vorlage = (d.vorlage && d.vorlage.latex) || d.latex || '';
    const erkannt = d.latex || '';
    const r = await ev_(`(async () => {
        try { localStorage.removeItem('vorrechnen-striche'); } catch (_) {}
        strokes.length = 0;
        ${JSON.stringify(d.strokes)}.forEach(s => strokes.push(s));
        recompute();
        const txt = a => a.art === 'line' ? '—' : a.text;
        const mSoll = await KatexAtome.atomeAusLatex(${JSON.stringify(vorlage)}, messHost(), { fontSize: 100 });
        const soll = mSoll.atome;
        const gelesen = ${JSON.stringify(erkannt)}
            ? (await KatexAtome.atomeAusLatex(${JSON.stringify(erkannt)}, messHost(), { fontSize: 100 })).atome : [];
        const leseOk = gelesen.map(txt).join(' ') === soll.map(txt).join(' ');

        const echte = analysis.lines.filter(l => !zuKlein(l));
        window.__syms = analysis.symbols; window.__soll = soll;
        const res = { soll: soll.length, svg: mSoll.svg, leseOk, gelesen: gelesen.map(txt).join(' '),
                      sollText: soll.map(txt).join(' '), zeilen: echte.length,
                      proZeile: echte.map(l => l.symbols.length).join('+') };
        if (echte.length !== 1) return res;
        const line = echte[0];
        res.roh = line.symbols.length === soll.length;
        let syms = line.symbols;
        if (!res.roh) {
            const neu = StrokeSymbols.nachjustieren(line, strokes, soll.length, opts);
            if (neu.length === soll.length) { syms = neu; res.nach = true; }
        }
        window.__syms = syms; window.__soll = soll;
        if (syms.length !== soll.length) return res;

        // order check: both sides normalised to their own box
        const box = bs => { let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
            bs.forEach(b => { x0=Math.min(x0,b.x); y0=Math.min(y0,b.y); x1=Math.max(x1,b.x+b.w); y1=Math.max(y1,b.y+b.h); });
            return { x0, y0, w: Math.max(1, x1-x0), h: Math.max(1, y1-y0) }; };
        const hs = box(syms.map(s => s.bbox)), ts = box(soll.map(a => a.box));
        const mitte = (b, r) => [ (b.x + b.w/2 - r.x0) / r.w, (b.y + b.h/2 - r.y0) / r.h ];
        res.paare = syms.map((s, i) => {
            const a = mitte(s.bbox, hs), b = mitte(soll[i].box, ts);
            return { sym: i, glyph: txt(soll[i]), d: Math.hypot(a[0]-b[0], a[1]-b[1]), striche: s.strokeIdxs.join(',') };
        });
        res.maxD = Math.max(...res.paare.map(p => p.d));
        return res;
    })()`);
    const name = f.replace(/^probe-|\.json$/g, '');
    if (bild) {
        // boxes per symbol, the glyph it was paired with above, its stroke numbers below
        await ev_(`(() => {
            view.boxes = true; morphT = 0; redraw();
            const syms = window.__syms || [], soll = window.__soll || [];
            const farben = ['#00d2ff', 'rgb(245,194,66)', 'rgb(121,158,49)', '#c77dff', '#ff9e64', '#ff5c8a'];
            ctx.save();
            syms.forEach((s, i) => {
                const b = s.bbox, c = farben[i % farben.length];
                ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash([]);
                ctx.strokeRect(b.x - 5, b.y - 5, b.w + 10, b.h + 10);
                ctx.fillStyle = c;
                ctx.font = '700 17px Arial';
                const g = soll[i] ? (soll[i].art === 'line' ? '—' : soll[i].text) : '?';
                ctx.fillText(i + ':' + g, b.x - 4, b.y - 10);
                ctx.font = '11px Arial';
                ctx.fillText('[' + s.strokeIdxs.join(',') + ']', b.x - 4, b.y + b.h + 18);
            });
            ctx.restore();
        })()`);
        const box = await ev_(`(() => { const r = document.getElementById('canvas').getBoundingClientRect();
            let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; strokes.forEach(s => s.points.forEach(p => {
              x0=Math.min(x0,p.x); y0=Math.min(y0,p.y); x1=Math.max(x1,p.x); y1=Math.max(y1,p.y); }));
            return { x: Math.max(0, r.left + x0 - 60), y: Math.max(0, r.top + y0 - 60),
                     width: Math.min(r.width, x1 - x0 + 120), height: Math.min(r.height, y1 - y0 + 120) }; })()`);
        const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } });
        if (shot?.result?.data) writeFileSync(`${BILDER}/${name}.png`, Buffer.from(shot.result.data, 'base64'));
    }
    summe.n++;
    if (r && r.ERROR) { zeilen.push(`${name.padEnd(18)} FEHLER ${r.ERROR}`); continue; }
    if (r.leseOk) summe.gelesen++;
    const gruppe = r.zeilen !== 1 ? `${r.zeilen} Zeilen(${r.proZeile})` :
        r.roh ? 'ok' : r.nach ? 'nachjustiert' : `${r.proZeile}/${r.soll}`;
    const ordnungOk = r.maxD !== undefined && r.maxD <= GRENZE;
    if (r.roh && ordnungOk) summe.roh++;
    if ((r.roh || r.nach) && ordnungOk) summe.nach++;
    const ord = r.maxD === undefined ? '–' : (ordnungOk ? 'ok ' : 'FALSCH ') + r.maxD.toFixed(2);
    zeilen.push(`${name.padEnd(18)} ${String(r.soll).padStart(2)} Z.  ` +
        `Lesen ${r.leseOk ? 'ok    ' : 'FALSCH'}  Gruppe ${gruppe.padEnd(16)} Reihenfolge ${ord.padEnd(11)}` +
        `${r.svg ? ' SVG' : ''}`);
    if (detail && r.paare) {
        r.paare.forEach(p => zeilen.push(`      #${String(p.sym).padStart(2)} ${p.glyph.padEnd(4)} Striche ${String(p.striche).padEnd(8)} ` +
            `Abstand ${p.d.toFixed(2)}${p.d > GRENZE ? '  <--' : ''}`));
    }
    if (detail && !r.leseOk) zeilen.push(`      Vorlage : ${r.sollText}\n      gelesen : ${r.gelesen}`);
}
console.log(zeilen.join('\n'));
if (bild) console.log(`\nBilder: ${BILDER}/`);
console.log(`\n${summe.n} Proben   Gemini liest richtig: ${summe.gelesen}   ` +
    `Gruppierung auf Anhieb richtig: ${summe.roh}   mit Nachjustieren: ${summe.nach}`);
ws.close(); chrome.kill(); process.exit(0);
