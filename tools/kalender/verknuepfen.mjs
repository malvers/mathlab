#!/usr/bin/env node
// Link Doc's Google or Outlook calendar with his own calendar (HTML/kalender/) - Doc, 07.11.2026: "Ich möchte
// [Google] bitte dauerhaft verknüpfen … Und dann müssten wir den Outlook-Kalender auch noch irgendwie mit verbinden."
//
//   node tools/kalender/verknuepfen.mjs google     a dialog on the Mac asks for Google's "Privatadresse im iCal-Format"
//   node tools/kalender/verknuepfen.mjs outlook    the same for the ICS link of a calendar published in Outlook on the web
//   ... google|outlook --clipboard                 take the address from the clipboard instead (an agent copied it from
//                                                  the settings page in Doc's browser); the clipboard is emptied after
//   node tools/kalender/verknuepfen.mjs --status   which calendars are linked and how many appointments they hold
//
// The address is a secret (whoever has it reads the whole calendar): Doc pastes it into a hidden field, it is checked
// (does it answer with a calendar?) and then kept only in the Mac's keychain (services doc-kalender-google /
// doc-kalender-outlook). It is never printed, logged or written into a file. To unlink, delete that keychain entry.
// From then on the reminder watcher mirrors the calendar every 15 minutes (feeds.mjs); at once:
// node tools/kalender/waechter.mjs --feeds [--dry]
process.env.TZ = 'Europe/Berlin';

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEEDS, checkUrl, fetchFeed, readFeedUrl, saveFeedUrl } from './feeds.mjs';

const require = createRequire(import.meta.url);
const K = require(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'HTML', 'kalender', 'kalender-core.js'));

const HOW = {
    google: 'Google Kalender (im Browser) → Zahnrad → Einstellungen → links deinen Kalender wählen → „Kalender integrieren“ → bei „Privatadresse im iCal-Format“ auf das Kopier-Symbol rechts neben den Punkten → hier einfügen.',
    outlook: 'Outlook im Web → Zahnrad → Kalender → Freigegebene Kalender → „Kalender veröffentlichen“: Kalender wählen, „Kann alle Details anzeigen“, Veröffentlichen → den ICS-Link kopieren und hier einfügen.'
};

/* the hidden-answer dialog; the text goes in as an argument, the answer comes back on stdout (never echoed) */
function askAddress(name) {
    const r = spawnSync('/usr/bin/osascript', ['-e', 'on run argv', '-e', 'activate', '-e',
        'display dialog (item 1 of argv) default answer "" with hidden answer with title (item 2 of argv) ' +
        'buttons {"Abbrechen", "Verknüpfen"} default button "Verknüpfen" cancel button "Abbrechen"',
        '-e', 'return text returned of result', '-e', 'end run',
        HOW[name], 'Kalender: ' + FEEDS[name].label + ' verknüpfen'], { encoding: 'utf8' });
    if (r.status !== 0) return null;   // "Abbrechen" or closed
    return (r.stdout || '').replace(/\n$/, '');
}

/* the address straight from the clipboard - never echoed, and the clipboard is emptied after use */
function fromClipboard() {
    const r = spawnSync('/usr/bin/pbpaste', [], { encoding: 'utf8' });
    return r.status === 0 && r.stdout.trim() ? r.stdout.trim() : null;
}
const emptyClipboard = () => spawnSync('/usr/bin/pbcopy', [], { input: '' });

/* how many appointments the feed holds, and how many of them still lie ahead (or repeat) */
function count(text) {
    const { events, upcoming } = K.parseIcs(text, { now: new Date() });
    return events.length + ' Termine, davon ' + upcoming + ' anstehend oder wiederkehrend';
}

async function status() {
    for (const [name, f] of Object.entries(FEEDS)) {
        const url = readFeedUrl(name);
        if (!url) { console.log(f.label + ': nicht verknüpft'); continue; }
        try { console.log(f.label + ': verknüpft – ' + count(await fetchFeed(url))); }
        catch (e) { console.log(f.label + ': verknüpft, aber: ' + e.message); }
    }
}

async function link(name, clip) {
    const raw = clip ? fromClipboard() : askAddress(name);
    if (clip) emptyClipboard();
    if (raw === null) { console.log(clip ? 'Zwischenablage leer – nichts gespeichert.' : 'Abgebrochen – nichts gespeichert.'); return; }
    const { url, err } = checkUrl(name, raw);
    if (err) { console.error('Nicht gespeichert: ' + err); process.exitCode = 1; return; }
    let text;
    try { text = await fetchFeed(url); }
    catch (e) { console.error('Nicht gespeichert: ' + e.message); process.exitCode = 1; return; }
    saveFeedUrl(name, url);
    console.log(FEEDS[name].label + ' verknüpft (Adresse im Schlüsselbund: ' + FEEDS[name].service + ') – ' + count(text) + '.');
    console.log('Erster Abgleich: node tools/kalender/waechter.mjs --feeds --dry  (zeigt nur), dann ohne --dry.');
}

const arg = process.argv[2];
if (arg === '--status') await status();
else if (FEEDS[arg]) await link(arg, process.argv.includes('--clipboard'));
else {
    console.log('node tools/kalender/verknuepfen.mjs google|outlook [--clipboard]   oder   --status');
    process.exitCode = arg ? 1 : 0;
}
