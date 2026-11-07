#!/usr/bin/env node
// Write access to Doc's own calendar (HTML/kalender/) for the agents on his Mac (Doc, 07.11.2026: "nee, ihr dürft
// schreiben! Zwingend" - e.g. "trag mal die Termine ein"). The Supabase MCP stays read-only; this is the one narrow
// write path, and it reaches nothing but Doc's appointments (calendar_event).
//
//   node tools/kalender/eintragen.mjs add events.json         events from a file (an array, or one object)
//   node tools/kalender/eintragen.mjs add --title "…" --start "2026-11-14 10:00" --end "2026-11-14 12:30"
//        [--location …] [--notes …] [--remind 100,60] [--uid …]   one event from flags
//   node tools/kalender/eintragen.mjs remove <id>             delete one event (its old version stays in the history)
//   --dry                                                     show what would be sent - nothing is sent, no token read
//
// Times are Europe/Berlin wall-clock time ("2026-11-14 10:00" or "2026-11-14T10:00"); this tool turns them into ISO
// times with the right offset (+01:00 in winter, +02:00 in summer). A time that already carries an offset or Z is kept.
// A bare date as --start makes an all-day event, and --end is then the LAST day (inclusive, like the calendar's form).
// In a file the fields are those of the table (supabase/migrations/20261106_calendar.sql): title, starts_at, ends_at,
// all_day, location, notes, rrule, exdates, remind, color, source_uid - there an all-day ends_at is the exclusive end
// (the day after the last). With a source_uid that already exists the event is replaced, so the same file can be sent
// again after a correction without doubling anything. Without remind the calendar's default applies (60,15 minutes;
// all-day: 18:00 the day before).
//
// Access: like the reminder watcher (waechter.mjs) this has no login. It calls calendar_add / calendar_remove
// (supabase/migrations/20261107_calendar_write.sql) with the random token that lives only in the Mac's keychain
// (service doc-kalender-waechter); the database keeps only its SHA-256 and refuses every call without it. The token
// is never printed. No secret in this file.
process.env.TZ = 'Europe/Berlin';

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const KEYCHAIN_SERVICE = 'doc-kalender-waechter';
const FIELDS = ['title', 'starts_at', 'ends_at', 'all_day', 'location', 'notes', 'rrule', 'exdates', 'remind', 'color', 'source_uid'];
const WEEKDAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const DAY = 86400000;

class UsageError extends Error {}
const fail = msg => { throw new UsageError(msg); };

/* the publishable key - public by design, kept in one place (svp-auth.js); same source as waechter.mjs */
function dbConfig() {
    const src = fs.readFileSync(path.join(REPO, 'HTML', 'svp', 'svp-auth.js'), 'utf8');
    const url = (src.match(/DB_URL\s*=\s*'([^']+)'/) || [])[1];
    const key = (src.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0];
    if (!url || !key) throw new Error('DB_URL / publishable key not found in svp-auth.js');
    return { url, key };
}

/* the watcher's token from the keychain (as in waechter.mjs) - only read when something is really sent */
function readToken() {
    try {
        return execFileSync('security', ['find-generic-password', '-s', KEYCHAIN_SERVICE, '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) { return ''; }
}

async function rpc(name, body, token) {
    const { url, key } = dbConfig();
    const res = await fetch(url + '/rest/v1/rpc/' + name, {
        method: 'POST',
        headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000)
    });
    const text = await res.text();
    if (!res.ok) {
        let msg = text;
        try { const j = JSON.parse(text); msg = [j.message, j.details, j.hint].filter(Boolean).join(' - '); } catch (e) { /* keep the raw text */ }
        // the token must never show up in a message, whatever the server answers
        throw new Error(name + ' HTTP ' + res.status + ': ' + msg.split(token).join('***').slice(0, 600));
    }
    return text ? JSON.parse(text) : null;
}

/* ---------- times ---------- */

const pad = n => String(n).padStart(2, '0');
const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const OFFSET_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?\s*(Z|[+-]\d{2}(:?\d{2})?)$/;

/* a Date -> "2026-11-14T10:00:00+01:00" (Berlin wall clock with its offset) */
function isoBerlin(d) {
    const off = -d.getTimezoneOffset();
    const sign = off >= 0 ? '+' : '-';
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' +
        pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + sign + pad(Math.floor(Math.abs(off) / 60)) + ':' + pad(Math.abs(off) % 60);
}

/* "2026-11-14 10:00" (Berlin), "2026-11-14T10:00:00+01:00", or - only for all-day - "2026-11-14" -> Date */
function parseTime(value, what, allDay) {
    if (typeof value !== 'string') fail(what + ': Text erwartet');
    const s = value.trim();
    if (OFFSET_RE.test(s)) {
        // JS reads only "+01:00" and "Z": "+01" and "+0100" are brought into that form first
        const d = new Date(s.replace(' ', 'T').replace(/\s+/g, '').replace(/([+-]\d{2})$/, '$1:00').replace(/([+-]\d{2})(\d{2})$/, '$1:$2'));
        if (isNaN(d)) fail(what + ': „' + s + '“ ist keine gültige Zeit');
        return d;
    }
    const m = LOCAL_RE.exec(s);
    if (!m) fail(what + ': „' + s + '“ nicht verstanden (erwartet z. B. 2026-11-14 10:00)');
    const [, y, mo, da, h, mi, se] = m;
    if (h === undefined && !allDay) fail(what + ': nur ein Datum, aber kein ganztägiger Termin - bitte eine Uhrzeit angeben');
    const d = new Date(+y, +mo - 1, +da, +(h || 0), +(mi || 0), +(se || 0));
    // 2026-02-30 rolls over into March, 02:30 on the spring-forward night does not exist - both are refused
    if (d.getFullYear() !== +y || d.getMonth() !== +mo - 1 || d.getDate() !== +da || d.getHours() !== +(h || 0) || d.getMinutes() !== +(mi || 0))
        fail(what + ': „' + s + '“ gibt es in Berlin nicht (falsches Datum oder Zeitumstellung)');
    return d;
}

/* ---------- events ---------- */

/* one entry of a file (table fields) -> the object that goes to calendar_add, times as ISO with offset */
function normalize(ev, i) {
    const what = 'Termin ' + (i + 1);
    if (!ev || typeof ev !== 'object' || Array.isArray(ev)) fail(what + ': Objekt erwartet');
    for (const k of Object.keys(ev)) if (!FIELDS.includes(k)) fail(what + ': unbekanntes Feld „' + k + '“ (erlaubt: ' + FIELDS.join(', ') + ')');
    if (typeof ev.title !== 'string' || !ev.title.trim()) fail(what + ': title fehlt');
    if (ev.all_day != null && typeof ev.all_day !== 'boolean') fail(what + ': all_day muss true oder false sein');
    const allDay = ev.all_day === true;
    const out = { title: ev.title.replace(/\s+/g, ' ').trim() };
    if (ev.all_day != null) out.all_day = ev.all_day;
    if (ev.starts_at == null) fail(what + ': starts_at fehlt');
    const s = parseTime(ev.starts_at, what + ' starts_at', allDay);
    out.starts_at = isoBerlin(s);
    if (ev.ends_at != null) {
        const e = parseTime(ev.ends_at, what + ' ends_at', allDay);
        if (+e <= +s) fail(what + ': ends_at liegt nicht nach starts_at');
        out.ends_at = isoBerlin(e);
    }
    for (const k of ['location', 'notes', 'rrule', 'source_uid']) {
        if (ev[k] == null) continue;
        if (typeof ev[k] !== 'string') fail(what + ': ' + k + ' muss Text sein');
        out[k] = ev[k];
    }
    if (ev.exdates != null) {
        if (!Array.isArray(ev.exdates)) fail(what + ': exdates muss eine Liste sein');
        out.exdates = ev.exdates.map((x, j) => isoBerlin(parseTime(x, what + ' exdates[' + j + ']', allDay)));
    }
    if (ev.remind != null) {
        if (!Array.isArray(ev.remind) || ev.remind.some(m => !Number.isInteger(m) || m < -1440 || m > 40320))
            fail(what + ': remind muss eine Liste ganzer Minuten sein (z. B. [100, 60])');
        out.remind = ev.remind;
    }
    if (ev.color != null) {
        if (![1, 2, 3].includes(ev.color)) fail(what + ': color muss 1, 2 oder 3 sein');
        out.color = ev.color;
    }
    return out;
}

/* the flags of `add --title …` -> one file-style entry */
function fromFlags(f) {
    if (!f.title) fail('--title fehlt');
    if (!f.start) fail('--start fehlt');
    const allDay = /^\d{4}-\d{2}-\d{2}$/.test(f.start.trim());
    const ev = { title: f.title, starts_at: f.start };
    if (allDay) {
        ev.all_day = true;
        if (f.end) {
            // the form's "last day" -> the table's exclusive end (midnight after the last day)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(f.end.trim())) fail('--end: bei einem ganztägigen Termin nur ein Datum (der letzte Tag)');
            const last = parseTime(f.end, '--end', true);
            const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
            ev.ends_at = isoBerlin(next);
        }
    } else if (f.end) ev.ends_at = f.end;
    if (f.location) ev.location = f.location;
    if (f.notes) ev.notes = f.notes;
    if (f.uid) ev.source_uid = f.uid;
    if (f.remind != null) {
        const parts = f.remind.trim() === '' || f.remind.trim() === 'none' ? [] : f.remind.split(',').map(x => x.trim());
        if (parts.some(x => !/^-?\d+$/.test(x))) fail('--remind: Minuten mit Komma, z. B. 100,60 (oder none)');
        ev.remind = parts.map(Number);
    }
    return ev;
}

/* a readable line per event for the dry run (and after sending) */
function describe(ev, i) {
    const s = new Date(ev.starts_at);
    const e = ev.ends_at ? new Date(ev.ends_at) : null;
    const date = d => WEEKDAY[d.getDay()] + ' ' + pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
    const hm = d => pad(d.getHours()) + ':' + pad(d.getMinutes());
    const utc = d => d.toISOString().slice(0, 16).replace('T', ' ');
    const lines = [(i + 1) + '. ' + ev.title];
    if (ev.all_day) {
        const last = e ? new Date(+e - DAY / 2) : s;   // exclusive end -> the last day
        lines.push('   ' + date(s) + (e && date(last) !== date(s) ? ' bis ' + date(last) : '') + ', ganztägig');
    } else {
        const endTxt = e ? (date(e) === date(s) ? hm(e) : date(e) + ' ' + hm(e)) : '(ohne Ende = 1 Std)';
        lines.push('   ' + date(s) + ' ' + hm(s) + '–' + endTxt + ' Berlin   =   ' + utc(s) + (e ? ' – ' + utc(e) : '') + ' UTC');
    }
    if (ev.location) lines.push('   Ort: ' + ev.location);
    const remind = ev.remind || (ev.all_day ? [360] : [60, 15]);
    lines.push('   Erinnerung: ' + (remind.length ? remind.map(m => m + ' min' + (ev.all_day ? '' : ' (' + hm(new Date(+s - m * 60000)) + ')')).join(', ') : 'keine') + (ev.remind ? '' : ' (Standard)'));
    if (ev.rrule) lines.push('   Wiederholung: ' + ev.rrule);
    if (ev.source_uid) lines.push('   source_uid: ' + ev.source_uid);
    if (ev.notes) lines.push('   Notiz: ' + ev.notes.replace(/\n/g, ' / '));
    return lines.join('\n');
}

/* ---------- command line ---------- */

function parseArgs(argv) {
    const flags = {}, pos = [];
    const VALUE_FLAGS = ['title', 'start', 'end', 'location', 'notes', 'remind', 'uid'];
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--dry') { flags.dry = true; continue; }
        if (a === '-h' || a === '--help') { flags.help = true; continue; }
        if (a.startsWith('--')) {
            let name = a.slice(2), val;
            if (name.includes('=')) [name, val] = [name.slice(0, name.indexOf('=')), name.slice(name.indexOf('=') + 1)];
            if (!VALUE_FLAGS.includes(name)) fail('unbekannte Option --' + name);
            if (val === undefined) {
                if (i + 1 >= argv.length) fail('--' + name + ' braucht einen Wert');
                val = argv[++i];
            }
            flags[name] = val;
            continue;
        }
        pos.push(a);
    }
    return { flags, pos };
}

const USAGE = [
    'node tools/kalender/eintragen.mjs add events.json [--dry]',
    'node tools/kalender/eintragen.mjs add --title "…" --start "2026-11-14 10:00" --end "2026-11-14 12:30" [--location …] [--notes …] [--remind 100,60] [--uid …] [--dry]',
    'node tools/kalender/eintragen.mjs remove <id> [--dry]'
].join('\n');

function needToken() {
    const token = readToken();
    if (!token) fail('kein Token im Schlüsselbund (' + KEYCHAIN_SERVICE + ') - einmal: node tools/kalender/waechter.mjs --setup');
    return token;
}

async function main() {
    const { flags, pos } = parseArgs(process.argv.slice(2));
    const cmd = pos[0];
    if (flags.help || !cmd) { console.log(USAGE); return; }

    if (cmd === 'add') {
        const flagMode = ['title', 'start', 'end', 'location', 'notes', 'remind', 'uid'].some(k => k in flags);
        let raw;
        if (pos.length > 2) fail('zu viele Angaben: ' + pos.slice(2).join(' '));
        if (pos[1]) {
            if (flagMode) fail('entweder eine Datei oder --title/--start, nicht beides');
            let text;
            try { text = fs.readFileSync(path.resolve(pos[1]), 'utf8'); } catch (e) { fail('Datei nicht lesbar: ' + pos[1]); }
            try { raw = JSON.parse(text); } catch (e) { fail('kein gültiges JSON in ' + pos[1] + ': ' + e.message); }
            raw = Array.isArray(raw) ? raw : [raw];
        } else if (flagMode) raw = [fromFlags(flags)];
        else fail('add braucht eine Datei oder --title/--start\n' + USAGE);
        if (!raw.length || raw.length > 200) fail('1 bis 200 Termine erwartet, nicht ' + raw.length);
        const events = raw.map(normalize);

        console.log((flags.dry ? 'TROCKENLAUF - nichts gesendet. ' : '') + 'calendar_add mit ' + events.length + ' Termin(en):\n');
        console.log(events.map(describe).join('\n\n'));
        if (flags.dry) {
            console.log('\nGesendet würde p_events =\n' + JSON.stringify(events, null, 2));
            return;
        }
        const token = needToken();
        const rows = await rpc('calendar_add', { p_token: token, p_events: events }, token);
        console.log('');
        rows.forEach((r, i) => console.log((r.op === 'update' ? 'ersetzt' : 'eingetragen') + ': id ' + r.id + ' - ' + events[i].title));
        return;
    }

    if (cmd === 'remove') {
        if (pos.length !== 2 || !/^\d+$/.test(pos[1])) fail('remove braucht genau eine id (Zahl)\n' + USAGE);
        const id = Number(pos[1]);
        if (flags.dry) { console.log('TROCKENLAUF - nichts gesendet. calendar_remove würde den Termin mit id ' + id + ' löschen.'); return; }
        const token = needToken();
        const rows = await rpc('calendar_remove', { p_token: token, p_id: id }, token);
        if (!rows || !rows.length) { console.error('Kein Termin mit id ' + id + ' - nichts gelöscht.'); process.exitCode = 1; return; }
        const r = rows[0];
        console.log('gelöscht: id ' + r.id + ' - ' + r.title + ' (' + new Date(r.starts_at).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) + '); die alte Fassung bleibt in calendar_event_history.');
        return;
    }

    fail('unbekannter Befehl „' + cmd + '“\n' + USAGE);
}

main().catch(e => {
    console.error(e instanceof UsageError ? 'Fehler: ' + e.message : 'Abbruch: ' + (e && e.message || e));
    process.exit(1);
});
