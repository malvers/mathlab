#!/usr/bin/env node
// Score the handwriting corpus: for every saved probe, run the current grouping
// on its strokes, set its LaTeX with KaTeX, and check whether the symbols pair
// with the atoms one for one. This is the table we optimise against.
//
//   node tools/handschrift_auswerten.mjs            # all probes
//   node tools/handschrift_auswerten.mjs 03 07      # only these
//
// Needs serve.py on :8765 (the page supplies KaTeX and the modules) and a
// headless Chrome. No API call: each probe carries the LaTeX Gemini returned
// when it was recorded, and that is what we pair against.
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('../HTML/morpheus/handschrift-proben/', import.meta.url).pathname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9341;
const only = process.argv.slice(2);

const files = readdirSync(DIR).filter(f => /^probe-.*\.json$/.test(f)).sort()
    .filter(f => !only.length || only.some(o => f.includes(o)));
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
    return r.result?.exceptionDetails ? { ERROR: JSON.stringify(r.result.exceptionDetails).slice(0, 200) } : r.result?.result?.value;
};
await send('Runtime.enable');
await send('Page.navigate', { url: 'http://localhost:8765/vorrechnen.html' });
await sleep(4500);

let ok = 0;
const rows = [];
for (const f of files) {
    const d = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
    const latex = d.latex || (d.vorlage && d.vorlage.latex) || '';
    const r = await ev_(`(async () => {
        try { localStorage.removeItem('vorrechnen-striche'); } catch (_) {}
        strokes.length = 0;
        ${JSON.stringify(d.strokes)}.forEach(s => strokes.push(s));
        recompute();
        const zeilen = analysis.lines.filter(l => !zuKlein(l));
        if (!zeilen.length) return { symbole: 0, atome: 0, passt: false, zeilen: 0, roh: analysis.lines.length, hinweis: 'keine Zeile' };
        const line = zeilen[0];
        const latex = ${JSON.stringify(latex)};
        if (!latex) return { symbole: line.symbols.length, atome: 0, passt: false, zeilen: zeilen.length, roh: analysis.lines.length, hinweis: 'kein LaTeX gespeichert' };
        const m = await KatexAtome.atomeAusLatex(latex, messHost(), { fontSize: 100 });
        let zu = FormelErkennen.ordneZu(line.symbols, m.atome);
        let nach = false;
        if (!zu.passt) {
            const neu = StrokeSymbols.nachjustieren(line, strokes, m.atome.length, opts);
            if (neu.length === m.atome.length) { zu = FormelErkennen.ordneZu(neu, m.atome); nach = true; }
        }
        return { symbole: line.symbols.length, atome: m.atome.length, passt: zu.passt, nach, svg: m.svg,
                 zeilen: zeilen.length, roh: analysis.lines.length,
                 folge: zu.paare.map(p => p.token.art === 'line' ? '—' : p.token.text).join(' ') };
    })()`);
    const name = f.replace(/^probe-|\.json$/g, '');
    if (r && r.ERROR) { rows.push(`${name.padEnd(22)} FEHLER ${r.ERROR}`); continue; }
    const status = r.passt ? (r.nach ? 'ok (nachjustiert)' : 'ok') : ('FEHLT' + (r.hinweis ? ' – ' + r.hinweis : ''));
    if (r.passt) ok++;
    rows.push(`${name.padEnd(22)} ${String(r.symbole).padStart(2)} Symbole / ${String(r.atome).padStart(2)} Zeichen` +
        `  Zeilen ${r.zeilen}/${r.roh}  ${r.svg ? 'SVG ' : ''}${status.padEnd(18)} ${((d.vorlage && d.vorlage.latex) || latex).slice(0, 40)}`);
}
console.log(rows.join('\n'));
console.log(`\n${ok} von ${files.length} passen`);
ws.close(); chrome.kill(); process.exit(0);
