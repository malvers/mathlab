#!/usr/bin/env node
// DocCall Mithörer: the Mac always listens to Doc's answers from the phone (Doc, 08.11.2026: "absolut brillante
// Idee"). Runs for good as the launchd agent de.docalvers.docruf-mithoerer, so nothing Doc says on the phone goes
// unheard because no agent happened to run docruf-antwort.mjs.
//
// For every answer on <topic>-antwort it
//   1. appends a line to ~/Library/Logs/docruf-antwort.log (time, call id, text),
//   2. drops it into the inbox ~/.claude/docruf/eingang/ as one JSON file, from where the hook
//      ~/.claude/hooks/docruf-eingang.sh hands it to the agent Doc works with (or, after a short grace, to any
//      other agent) - claimed once, so exactly one agent gets it,
//   3. lets Solita say "Angekommen" on the phone (her recorded MP3, no TTS cost per answer).
//
// The topic is the channel's only secret and comes from the Keychain (doc-ruf / ntfy-topic), never from the
// source; this script never prints it.
import { execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HOME = os.homedir();
const DIR = path.join(HOME, '.claude/docruf');
const INBOX = path.join(DIR, 'eingang');
const STATE = path.join(DIR, 'stand.json');
const MP3 = path.join(DIR, 'angekommen.mp3');
const LOG = path.join(HOME, 'Library/Logs/docruf-antwort.log');
const SEND = path.join(path.dirname(new URL(import.meta.url).pathname), 'docruf-send.mjs');
const NODE = process.execPath;

fs.mkdirSync(path.join(INBOX, '.neu'), { recursive: true });

let topic;
try {
    topic = execFileSync('/usr/bin/security', ['find-generic-password', '-s', 'doc-ruf', '-a', 'ntfy-topic', '-w'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
    console.error('kein DocRuf-Kanal in der Keychain (doc-ruf / ntfy-topic)');
    process.exit(1);
}
const url = 'https://ntfy.sh/' + topic + '-antwort/json';

// where to pick up after a restart: the time of the last answer handled, and its recent ids against doubles
let state = { since: Math.floor(Date.now() / 1000), ids: [] };
try {
    state = { ...state, ...JSON.parse(fs.readFileSync(STATE, 'utf8')) };
} catch { /* first start: from now on */ }
const save = () => fs.writeFileSync(STATE, JSON.stringify(state));

const stamp = () => new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

function handle(m) {
    if (state.ids.includes(m.id)) return;
    state.ids = [m.id, ...state.ids].slice(0, 50);
    state.since = Math.max(state.since, m.time);
    save();
    const text = String(m.message || '').replace(/\s+/g, ' ').trim();
    const call = m.title || '';
    try {
        fs.appendFileSync(LOG, new Date(m.time * 1000).toISOString() + '\t' + call + '\t' + text + '\n');
    } catch { /* the log is a convenience */ }
    // write beside the inbox, then rename: the hook never sees a half file
    const name = m.time + '-' + m.id + '.json';
    fs.writeFileSync(path.join(INBOX, '.neu', name), JSON.stringify({ id: m.id, time: m.time, call, text }));
    fs.renameSync(path.join(INBOX, '.neu', name), path.join(INBOX, name));
    console.log(stamp() + ' Antwort ' + m.id + ' im Eingang');
    confirm();
}

// Solita's "Angekommen" on the phone; several answers in a row get one confirmation
let pending = null;
function confirm() {
    clearTimeout(pending);
    pending = setTimeout(() => {
        const args = [SEND, 'Angekommen.'];
        if (fs.existsSync(MP3)) args.push(MP3);
        args.push('--wait', '30');
        execFile(NODE, args, { timeout: 60000 }, (err, out, errOut) => {
            console.log(stamp() + ' Angekommen: ' + (err ? 'keine Quittung (' + (errOut || err.message).trim().slice(0, 120) + ')'
                : out.trim().split('\n').pop()));
        });
    }, 1500);
}

// the stream drops now and then (keepalive every 45 s); reconnect from the last answer handled
let wait = 2;
for (;;) {
    try {
        const r = await fetch(url + '?since=' + state.since);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        wait = 2;
        const dec = new TextDecoder();
        let buf = '';
        for await (const chunk of r.body) {
            buf += dec.decode(chunk, { stream: true });
            let nl;
            while ((nl = buf.indexOf('\n')) >= 0) {
                const line = buf.slice(0, nl).trim();
                buf = buf.slice(nl + 1);
                if (!line) continue;
                const m = JSON.parse(line);
                if (m.event === 'message') handle(m);
            }
        }
    } catch (e) {
        console.error(stamp() + ' Leitung weg (' + String(e.message || e).slice(0, 80) + '), neuer Versuch in ' + wait + ' s');
    }
    await new Promise(ok => setTimeout(ok, wait * 1000));
    wait = Math.min(wait * 2, 30);
}
