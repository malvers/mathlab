#!/usr/bin/env node
// DocRuf: sends one call to Doc's phone and waits for the phone's receipt.
//
//     node docruf-send.mjs "Doc, hier ist Solíta. ..." [solita.mp3] [--wait 20]
//
// The topic on ntfy.sh is the channel's only secret and lives in the Keychain (service doc-ruf, account
// ntfy-topic), never in the source. With an MP3 the phone plays Solita's own voice, without one it reads the
// text itself. The app posts the message id to <topic>-ok as soon as the call is on the phone.
// Exit 0 with a receipt, 2 without one in time, 1 on errors: ~/.claude/hooks/solita-ruf-waechter.sh falls back
// to the Mac's speakers on anything but 0.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const args = process.argv.slice(2);
let wait = 20;
const w = args.indexOf('--wait');
if (w >= 0) {
    wait = Number(args[w + 1]) || wait;
    args.splice(w, 2);
}
const [text, mp3] = args;
if (!text) {
    console.error('usage: docruf-send.mjs "text" [file.mp3] [--wait seconds]');
    process.exit(1);
}

let topic;
try {
    topic = execFileSync('/usr/bin/security', ['find-generic-password', '-s', 'doc-ruf', '-a', 'ntfy-topic', '-w'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
    console.error('kein DocRuf-Kanal in der Keychain (doc-ruf / ntfy-topic)');
    process.exit(1);
}
const base = 'https://ntfy.sh/' + topic;

// the text rides in the query, which keeps umlauts intact; with an MP3 the body is the attachment
const sent = Math.floor(Date.now() / 1000);
const r = await fetch(base + '?' + new URLSearchParams({ title: 'Solita', message: text }), {
    method: mp3 ? 'PUT' : 'POST',
    headers: mp3 ? { Filename: 'solita.mp3' } : {},
    body: mp3 ? fs.readFileSync(mp3) : '',
    signal: AbortSignal.timeout(20000),
}).catch(e => ({ ok: false, status: 0, text: async () => String(e) }));
if (!r.ok) {
    console.error('ntfy.sh: HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
    process.exit(1);
}
const { id } = await r.json();

// reading the receipt topic from shortly before the send also catches a phone that answered very fast
let ok = false;
const stop = new AbortController();
const timer = setTimeout(() => stop.abort(), wait * 1000);
try {
    const s = await fetch(base + '-ok/json?since=' + (sent - 5), { signal: stop.signal });
    const dec = new TextDecoder();
    let buf = '';
    for await (const chunk of s.body) {
        buf += dec.decode(chunk, { stream: true });
        for (let n; (n = buf.indexOf('\n')) >= 0; buf = buf.slice(n + 1)) {
            try {
                const m = JSON.parse(buf.slice(0, n));
                if (m.event === 'message' && m.message === id) ok = true;
            } catch { /* half a line */ }
        }
        if (ok) break;
    }
} catch { /* timeout or line dropped: no receipt */ }
clearTimeout(timer);
stop.abort();
console.log(ok ? 'Phone hat quittiert: ' + id : 'keine Quittung vom Phone nach ' + wait + ' s: ' + id);
process.exit(ok ? 0 : 2);
