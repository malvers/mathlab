#!/usr/bin/env node
// Reminder watcher for Doc's own calendar (HTML/kalender/). launchd starts it every minute
// (~/Library/LaunchAgents/de.docalvers.kalender-waechter.plist); each run looks for reminders that are due and
// lets Solita call (Doc, 06.11.2026: "dass mich Solita dann immer an Termine erinnern kann").
//
//   node tools/kalender/waechter.mjs           one round: due reminders -> Solita call + dialog on the Mac
//   node tools/kalender/waechter.mjs --dry     what would ring now and in the next 7 days - no call, no state change
//   node tools/kalender/waechter.mjs --setup   create the access token (keychain) and print the SQL line for it
//   node tools/kalender/waechter.mjs --sync    only mirror the timetable into the database (no call)
//   node tools/kalender/waechter.mjs --feeds   only mirror the linked Google / Outlook calendars now (with --dry: compare only)
//
// The timetable (07.11.2026, Doc: "dieser Kalender soll mein zentraler Kalender sein für alles ... fünf Minuten vor
// Stundenbeginn", with a switch): the lessons come from the local Untis files HTML/svp/plandaten/w*.json. Each round
// mirrors them into calendar_lesson (calendar_sync_lessons, only when they changed) so the phone shows them, and rings
// lesson_lead minutes before every lesson that is not cancelled - if the switch in the calendar's settings is on
// (calendar_setting, read through calendar_settings_poll). The switch for appointments sits next to it.
//
// Silent test: KALENDER_TEST=<dir> reads <dir>/events.json (and <dir>/settings.json, <dir>/plandaten/) instead of
// the database, keeps its state in <dir> and writes call, dialog and sync into <dir>/calls.txt instead of ringing;
// KALENDER_NOW=<ISO time> pretends it is that time.
//
// Access: the watcher has no login. It calls calendar_poll(token) (supabase/migrations/20261106_calendar.sql)
// with a random token that lives only in the Mac's keychain (service doc-kalender-waechter); the database keeps
// only its SHA-256. No secret in this file.
//
// Privacy: the spoken text goes through the cloud voice (solita-ruf.mjs -> Supabase -> Google), so for appointments
// it carries only the time ("In 15 Minuten, um 18 Uhr, hast du einen Termin."), never the title (Doc's rule "Privates
// nie in den Ruf"). What it is appears in a dialog on the Mac and in the calendar app. Lessons say subject, class and
// room - the timetable is no private matter.
//
// Google and Outlook (07.11.2026, Doc: "dauerhaft verknüpfen"): every 15 minutes each round also mirrors the calendars
// linked with verknuepfen.mjs (secret iCal address in the keychain) into calendar_event - see feeds.mjs.
// In the silent test the feeds are <dir>/feeds/<google|outlook>.ics and the database is <dir>/feeddb.json.
//
// The occurrences come from HTML/kalender/kalender-core.js - the same code the page uses.
process.env.TZ = 'Europe/Berlin';

import { createRequire } from 'node:module';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEEDS, FEED_EVERY, fetchFeed, readFeedUrl, readHidden, reportLine, syncFeed, testRpc } from './feeds.mjs';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const K = require(path.join(REPO, 'HTML', 'kalender', 'kalender-core.js'));

const KEYCHAIN_SERVICE = 'doc-kalender-waechter';
const NODE = process.execPath;
const SOLITA_RUF = path.join(os.homedir(), '.claude', 'hooks', 'solita-ruf.mjs');
const TEST = process.env.KALENDER_TEST || '';
const STATE_DIR = TEST || path.join(os.homedir(), 'Library', 'Application Support', 'doc-kalender');
const STATE_FILE = path.join(STATE_DIR, 'waechter.json');
const CATCH_UP = 6 * 3600000;        // after the Mac was off: reminders of the last 6 hours still count ...
const LATE_TIMED = 5 * 60000;        // ... as long as the appointment has not begun more than 5 minutes ago
const CACHE_MAX = 24 * 3600000;      // without network the last known list is used for up to a day
const PLAN_DIR = TEST ? path.join(TEST, 'plandaten') : path.join(REPO, 'HTML', 'svp', 'plandaten');
const LESSON_LATE = 2 * 60000;       // a lesson call still goes out up to 2 minutes after its time, never after the start
const SYNC_BACK = 7;                 // the mirror covers last week ...
const SYNC_MAX_DAYS = 390;           // ... up to the end of the Untis files (the function refuses more than 400 days)
const SYNC_AGAIN = 6 * 3600000;      // unchanged lessons are sent again after 6 hours anyway (a lost write heals)
const DEFAULT_SETTINGS = { call_events: true, call_lessons: true, lesson_lead: 5 };

const args = new Set(process.argv.slice(2));
const now = process.env.KALENDER_NOW ? new Date(process.env.KALENDER_NOW) : new Date();
const stamp = () => new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'medium' });
const log = (...a) => console.log(stamp(), ...a);

/* the publishable key - public by design, kept in one place (svp-auth.js) */
function dbConfig() {
    const src = fs.readFileSync(path.join(REPO, 'HTML', 'svp', 'svp-auth.js'), 'utf8');
    const url = (src.match(/DB_URL\s*=\s*'([^']+)'/) || [])[1];
    const key = (src.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0];
    if (!url || !key) throw new Error('DB_URL / publishable key not found in svp-auth.js');
    return { url, key };
}

function readToken() {
    try {
        return execFileSync('security', ['find-generic-password', '-s', KEYCHAIN_SERVICE, '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) { return ''; }
}

function loadState() {
    try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch (e) { return null; }
}
function saveState(st) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(st));
    fs.renameSync(tmp, STATE_FILE);
}

/* an error is logged once an hour, not every minute */
function logError(st, msg) {
    if (st.lastErr === msg && Date.now() - (st.lastErrAt || 0) < 3600000) return;
    st.lastErr = msg;
    st.lastErrAt = Date.now();
    log('Fehler:', msg);
}

async function rpc(name, body) {
    const { url, key } = dbConfig();
    const res = await fetch(url + '/rest/v1/rpc/' + name, {
        method: 'POST',
        headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) throw new Error(name + ' HTTP ' + res.status + ' ' + (await res.text()).slice(0, 160));
    return res.json();
}
const fetchEvents = token => rpc('calendar_poll', { p_token: token });
async function fetchSettings(token) {
    const rows = await rpc('calendar_settings_poll', { p_token: token });
    return Object.assign({}, DEFAULT_SETTINGS, rows && rows[0] || {});
}

/* ---------- the timetable ---------- */

const mondayOf = d => K.addDays(K.startOfDay(d), -((d.getDay() + 6) % 7));
const compact = d => K.ymd(d).replace(/-/g, '');

/* the lesson blocks of the Untis files from `from` on (whole weeks), up to `maxDays` days, with the coaching talks of
   termine.json in the same range (first names only, see K.coachingBlocks) and its other blocks (IA, K.terminBlocks) */
function readLessons(from, maxDays) {
    let files = [];
    try { files = fs.readdirSync(PLAN_DIR).filter(f => /^w\d{8}\.json$/.test(f)).sort(); } catch (e) { return null; }
    const first = 'w' + compact(mondayOf(from)) + '.json';
    const last = 'w' + compact(K.addDays(from, maxDays)) + '.json';
    const out = [];
    for (const f of files) {
        if (f < first || f > last) continue;
        try { out.push(...K.lessonBlocks(JSON.parse(fs.readFileSync(path.join(PLAN_DIR, f), 'utf8')).lessons)); }
        catch (e) { log('Plan-Datei unlesbar:', f, e.message); }
    }
    try {
        const termine = JSON.parse(fs.readFileSync(path.join(PLAN_DIR, 'termine.json'), 'utf8')).termine || [];
        const lo = K.ymd(mondayOf(from)), hi = K.ymd(K.addDays(mondayOf(from), maxDays + 6));
        out.push(...K.coachingBlocks(termine).concat(K.terminBlocks(termine)).filter(c => c.day >= lo && c.day <= hi));
    } catch (e) { if (e.code !== 'ENOENT') log('termine.json unlesbar:', e.message); }
    return out.sort((a, b) => (a.starts_at < b.starts_at ? -1 : a.starts_at > b.starts_at ? 1 : 0));
}

/* mirror the lessons into calendar_lesson when they changed (or after SYNC_AGAIN) - true when sent */
async function syncLessons(st, token, force) {
    const from = K.addDays(mondayOf(now), -SYNC_BACK);
    const lessons = readLessons(from, SYNC_MAX_DAYS);
    if (!lessons) return false;
    const lastDay = lessons.reduce((m, l) => (l.day > m ? l.day : m), K.ymd(from));
    const to = lastDay < K.ymd(from) ? K.ymd(from) : lastDay;
    const body = { p_token: token, p_from: K.ymd(from), p_to: to, p_rows: lessons };
    const hash = crypto.createHash('sha256').update(JSON.stringify([body.p_from, body.p_to, lessons])).digest('hex');
    if (!force && st.lessonHash === hash && Date.now() - (st.lessonAt || 0) < SYNC_AGAIN) return false;
    if (TEST) fs.appendFileSync(path.join(TEST, 'calls.txt'), '[sync] ' + body.p_from + '..' + to + ' ' + lessons.length + '\n');
    else {
        const n = await rpc('calendar_sync_lessons', body);
        if (st.lessonHash !== hash) log('Stundenplan gespiegelt: ' + n + ' Blöcke ' + body.p_from + ' bis ' + to);
    }
    st.lessonHash = hash;
    st.lessonAt = Date.now();
    return true;
}

/* ---------- Google and Outlook ---------- */

/* mirror every linked calendar that is due (force: all of them now); a failure is logged and tried again in 15 min */
async function syncFeeds(st, token, { force = false, dry = false } = {}) {
    st.feeds = st.feeds || {};
    const lines = [];
    for (const name of Object.keys(FEEDS)) {
        const fs0 = st.feeds[name] || (st.feeds[name] = {});
        if (!force && Date.now() - (fs0.at || 0) < FEED_EVERY) continue;
        let text = null;
        if (TEST) { try { text = fs.readFileSync(path.join(TEST, 'feeds', name + '.ics'), 'utf8'); } catch (e) { continue; } }
        else {
            const url = readFeedUrl(name);
            if (!url) continue;   // not linked
            if (!dry) fs0.at = Date.now();
            try { text = await fetchFeed(url); }
            catch (e) { if (!dry) logError(st, FEEDS[name].label + ': ' + e.message); lines.push(FEEDS[name].label + ': ' + e.message); continue; }
        }
        if (!dry) fs0.at = Date.now();
        try {
            const r = await syncFeed(name, { rpc: TEST ? testRpc(path.join(TEST, 'feeddb.json')) : rpc, token, text, now, dry,
                hide: readHidden(path.join(STATE_DIR, 'feed-hide.json')) });
            const line = reportLine(r, dry);
            lines.push(line);
            if (TEST) fs.appendFileSync(path.join(TEST, 'calls.txt'), '[feed] ' + line + '\n');
            else if (!dry && (r.sent || r.removed || r.held || r.failed.length)) log(line);
            if (dry) for (const ev of r.toSend.slice(0, 40)) lines.push('   ' + (new Date(ev.starts_at)).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) + '  ' + ev.title);
        } catch (e) {
            if (!dry) logError(st, FEEDS[name].label + ': ' + e.message);
            lines.push(FEEDS[name].label + ': ' + e.message);
        }
    }
    return lines;
}

/* what Solita says: appointments with their time only, lessons with subject, class and room */
function speech(occs, lessons) {
    const sentences = [...new Set(occs.map(o => K.spokenSentence(o, now)))];
    let body = sentences.length > 3 ? 'Du hast ' + occs.length + ' Termine, die gleich anstehen.' : sentences.join(' ');
    const ls = lessons.map(l => K.lessonSentence(l, new Date(l.starts_at), now));
    body = [body, ...ls].filter(Boolean).join(' ');
    return 'Doc, hier ist Solíta. ' + body + (occs.length ? ' Was es ist, steht im Kalender.' : '');
}

/* what the Mac shows: the details, local only */
function details(occs) {
    return occs.map(o => {
        const when = o.ev.all_day ? (K.sameDay(o.start, now) ? 'Heute, ganztägig' : K.WEEKDAY_LONG[o.start.getDay()] + ' ' + o.start.getDate() + '.' + (o.start.getMonth() + 1) + '., ganztägig')
            : (K.sameDay(o.start, now) ? 'Heute' : K.WEEKDAY_LONG[o.start.getDay()] + ' ' + o.start.getDate() + '.' + (o.start.getMonth() + 1) + '.') + ', ' + K.hhmm(o.start) + '–' + K.hhmm(o.end);
        return when + '\n' + o.ev.title + (o.ev.location ? '\n' + o.ev.location : '');
    }).join('\n\n');
}

function showDialog(text) {
    if (TEST) { fs.appendFileSync(path.join(TEST, 'calls.txt'), '[dialog] ' + text.replace(/\n/g, ' / ') + '\n'); return; }
    // the text goes in as an argument, so no quoting can break it (pattern of the ~/bin/remind-*.sh dialogs);
    // detached: the next round must not wait for Doc to press OK (the plist also sets AbandonProcessGroup)
    const child = spawn('/usr/bin/osascript', ['-e', 'on run argv', '-e',
        'display dialog (item 1 of argv) with title "Kalender" buttons {"OK"} default button "OK" giving up after 3600',
        '-e', 'end run', text], { detached: true, stdio: 'ignore' });
    child.unref();
}

function call(text) {
    if (TEST) { fs.appendFileSync(path.join(TEST, 'calls.txt'), '[ruf ' + K.hhmm(now) + '] ' + text + '\n'); return 'test'; }
    const r = spawnSync(NODE, [SOLITA_RUF, text, 'auto'], { env: { ...process.env, SOLITA_FORCE: '1' }, encoding: 'utf8', timeout: 60000 });
    if (r.status !== 0) throw new Error('solita-ruf: ' + ((r.stderr || r.stdout || '').trim() || 'exit ' + r.status));
    return (r.stdout || '').trim();
}

async function setup() {
    let token = readToken();
    if (!token) {
        token = crypto.randomBytes(32).toString('base64url');
        execFileSync('security', ['add-generic-password', '-U', '-a', 'doc', '-s', KEYCHAIN_SERVICE, '-l', 'Kalender-Wächter (Solita)', '-w', token]);
        console.log('Token neu angelegt (Schlüsselbund: ' + KEYCHAIN_SERVICE + ').');
    } else console.log('Token ist schon im Schlüsselbund.');
    const hash = crypto.createHash('sha256').update(token, 'utf8').digest('hex');
    console.log("insert into public.calendar_poller (token_sha256) values ('" + hash + "') on conflict do nothing;");
}

async function main() {
    if (args.has('--setup')) return setup();
    const dry = args.has('--dry');
    const st = loadState() || {};
    st.sent = st.sent || {};

    const token = TEST ? 'test' : readToken();
    if (!TEST && !token) { logError(st, 'kein Token im Schlüsselbund - einmal --setup laufen lassen'); if (!dry) saveState(st); return; }

    if (args.has('--feeds')) {
        const lines = await syncFeeds(st, token, { force: true, dry });
        /* the 15-minute job (de.docalvers.kalender-feeds) runs only this branch, so it mirrors the timetable too -
           otherwise the phone keeps the lessons of the last full round (no call either way) */
        if (!dry) {
            try { if (await syncLessons(st, token, false)) lines.push('Stundenplan gespiegelt.'); }
            catch (e) { logError(st, e.message); lines.push('Stundenplan: ' + e.message); }
        }
        if (!dry) saveState(st);
        console.log(lines.length ? lines.join('\n') : 'Kein Kalender verknüpft (node tools/kalender/verknuepfen.mjs google|outlook).');
        return;
    }

    if (args.has('--sync')) {
        await syncLessons(st, token, true);
        saveState(st);
        console.log('Stundenplan gespiegelt.');
        return;
    }

    // the switches: from the database, else the last known ones, else on
    let settings = null;
    if (TEST) { try { settings = JSON.parse(fs.readFileSync(path.join(TEST, 'settings.json'), 'utf8')); } catch (e) { settings = {}; } }
    else { try { settings = await fetchSettings(token); } catch (e) { logError(st, e.message); } }
    if (settings) st.settings = settings;
    settings = Object.assign({}, DEFAULT_SETTINGS, st.settings || {});

    let events = null;
    if (TEST) events = JSON.parse(fs.readFileSync(path.join(TEST, 'events.json'), 'utf8'));
    else {
        try {
            events = await fetchEvents(token);
            st.cache = { at: Date.now(), events };
            if (st.lastErr) { log('wieder verbunden'); st.lastErr = null; }
        } catch (e) { logError(st, e.message); }
    }
    if (!events && st.cache && Date.now() - st.cache.at < CACHE_MAX) events = st.cache.events;
    events = events || [];

    // the timetable of today and tomorrow, straight from the Untis files (works without network)
    const days = [K.ymd(now), K.ymd(K.addDays(now, 1))];
    const todays = (readLessons(K.startOfDay(now), 1) || []).filter(l => days.includes(l.day) && l.code !== 'cancelled');
    const lead = Math.max(0, Math.min(60, Number(settings.lesson_lead) || 0)) * 60000;

    if (dry) {
        const soon = settings.call_events === false ? [] : K.reminders(events, new Date(+now - 60000), new Date(+now + 7 * K.DAY));
        console.log(events.length + ' Termine geladen, Erinnerungen in den nächsten 7 Tagen: ' + soon.length +
            (settings.call_events === false ? ' (Schalter „Termine“ aus)' : ''));
        for (const r of soon) console.log('  ' + r.at.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) + '  (' + r.minutes + ' min vorher)  ' + r.occ.ev.title + '\n      → ' + K.spokenSentence(r.occ, r.at));
        const next = todays.filter(l => +new Date(l.starts_at) > +now);
        console.log('Unterricht heute/morgen: ' + next.length + (settings.call_lessons === false ? ' (Schalter „Unterricht“ aus)' : ', Ruf ' + settings.lesson_lead + ' min vorher'));
        for (const l of next) { const s0 = new Date(l.starts_at); console.log('  ' + s0.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) + '  ' + K.lessonTitle(l) + '\n      → ' + K.lessonSentence(l, s0, new Date(+s0 - lead))); }
        return;
    }

    // the mirror for the phone; a failure only costs the phone a stale timetable
    try { await syncLessons(st, token, false); } catch (e) { logError(st, e.message); }

    // due appointments: reminder time already passed (up to 6 hours back, e.g. the Mac was off), not rung yet, and
    // the appointment still ahead or just begun - so a late call still says the right thing ("in 30 Minuten")
    const due = settings.call_events === false ? [] : K.reminders(events, new Date(+now - CATCH_UP), new Date(+now + 1000)).filter(r => {
        const key = r.occ.key + '|' + r.minutes;
        if (st.sent[key]) return false;
        return r.occ.ev.all_day ? r.occ.end > now : +r.occ.start > +now - LATE_TIMED;
    });
    // due lessons: lead minutes before the start, at most 2 minutes late, never once it has begun
    const dueLessons = settings.call_lessons === false ? [] : todays.filter(l => {
        const s0 = +new Date(l.starts_at), at = s0 - lead;
        return at <= +now && at > +now - LESSON_LATE && s0 > +now - (lead ? 0 : 60000) && !st.sent['L|' + l.starts_at + '|' + l.subject];
    });
    if (due.length || dueLessons.length) {
        // one call per round; several reminders of one appointment (after a pause) ring once
        const occs = [...new Map(due.map(r => [r.occ.key, r.occ])).values()];
        for (const r of due) st.sent[r.occ.key + '|' + r.minutes] = +r.at;
        for (const l of dueLessons) st.sent['L|' + l.starts_at + '|' + l.subject] = +new Date(l.starts_at);
        saveState(st);   // first remember, then ring: a crash must never ring twice
        const text = speech(occs, dueLessons);
        if (occs.length) showDialog(details(occs));
        try { log('Ruf: ' + call(text) + ' - ' + occs.length + ' Termin(e), ' + dueLessons.length + ' Stunde(n)'); } catch (e) { log('Ruf fehlgeschlagen:', e.message); }
    }
    // Google / Outlook, every 15 minutes - after the call, so a slow feed never delays a reminder
    try { await syncFeeds(st, token); } catch (e) { logError(st, e.message); }

    // forget what lies more than 3 days back
    for (const [k, t] of Object.entries(st.sent)) if (t < +now - 3 * K.DAY) delete st.sent[k];
    st.last = +now;
    saveState(st);
}

main().catch(e => { log('Abbruch:', e && e.stack || e); process.exit(1); });
