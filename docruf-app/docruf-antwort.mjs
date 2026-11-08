#!/usr/bin/env node
// DocRuf: Doc's answers from the phone (Doc, 05.11.2026: "dass ich dir im Telefon antworten kann").
//
//     node docruf-antwort.mjs [--since 30m] [--once]
//
// The app posts an answer to <topic>-antwort on ntfy.sh, from a call's notification ("Antworten") or from its
// own field. This follows that topic and prints one line per answer, so an agent can watch it (Claude Code's
// Monitor turns every line into a notice). Since 08.11.2026 the Mithörer (docruf-mithoerer.mjs) listens for good,
// keeps the log ~/Library/Logs/docruf-antwort.log and hands every answer to one agent; this is for a look back. The topic is
// the channel's only secret and comes from the Keychain (doc-ruf / ntfy-topic), never from the source; this
// script never prints it. --since reaches back (ntfy.sh keeps 12 h, default 10m), --once stops after the
// first answer.
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, dflt) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : dflt;
};
const since = opt('--since', '10m');
const once = args.includes('--once');

let topic;
try {
    topic = execFileSync('/usr/bin/security', ['find-generic-password', '-s', 'doc-ruf', '-a', 'ntfy-topic', '-w'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
    console.error('kein DocRuf-Kanal in der Keychain (doc-ruf / ntfy-topic)');
    process.exit(1);
}
const url = 'https://ntfy.sh/' + topic + '-antwort/json';

const seen = new Set();
const hhmm = t => new Date(t * 1000).toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });

function answer(m) {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    // one line, the text as Doc dictated it; the call's id only for the log
    const text = String(m.message || '').replace(/\s+/g, ' ').trim();
    console.log('ANTWORT ' + hhmm(m.time) + ': ' + text);
    return true;
}

// the stream drops now and then (keepalive every 45 s); reconnect from the last line seen
let from = since;
let wait = 2;
for (;;) {
    try {
        const r = await fetch(url + '?since=' + encodeURIComponent(from));
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
                if (m.time) from = String(m.time);
                if (m.event === 'message' && answer(m) && once) process.exit(0);
            }
        }
    } catch (e) {
        console.error('Leitung weg (' + String(e.message || e).slice(0, 80) + '), neuer Versuch in ' + wait + ' s');
    }
    await new Promise(ok => setTimeout(ok, wait * 1000));
    wait = Math.min(wait * 2, 30);
}
