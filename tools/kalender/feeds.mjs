// Doc's Google and Outlook calendars, mirrored one way into his own calendar (HTML/kalender/) - Doc, 07.11.2026:
// "Ich möchte [Google] bitte dauerhaft verknüpfen. Vielleicht trägt mir irgendjemand anderes in den Kalender ein. …
// Und dann müssten wir den Outlook-Kalender auch noch irgendwie mit verbinden."
//
// Each calendar offers a secret iCal address (Google: "Geheime Adresse im iCal-Format"; Outlook on the web: a published
// calendar's ICS link). verknuepfen.mjs puts it into the Mac's keychain - it is a secret and never appears in code,
// logs or chat. The reminder watcher (waechter.mjs) calls syncFeed() every 15 minutes:
//   fetch the feed -> read it with the calendar's own .ics reader (kalender-core.js parseIcs: series, EXDATE,
//   RECURRENCE-ID) -> compare with the rows written before (calendar_feed_rows) -> send only what is new or changed
//   (calendar_add, source_uid 'google:<UID>' / 'outlook:<UID>') -> delete what vanished from the feed
//   (calendar_feed_remove, which reaches nothing but rows with that prefix: Doc's own entries are never touched).
// Google / Outlook stay the source: the calendar shows these rows read-only, with a small G / O.
// Reminders: the calendar's default (60 and 15 minutes; all-day 18:00 the day before).
// SQL: supabase/migrations/20261107_calendar_feeds.sql (+ 20261107_calendar_write.sql for calendar_add).
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const K = require(path.join(REPO, 'HTML', 'kalender', 'kalender-core.js'));

export const FEEDS = {
    google: { prefix: 'google:', service: 'doc-kalender-google', label: 'Google' },
    outlook: { prefix: 'outlook:', service: 'doc-kalender-outlook', label: 'Outlook' }
};
export const FEED_EVERY = 15 * 60000;   // how often the watcher fetches each feed
const BACK_DAYS = 90;                   // single appointments that ended more than 90 days ago are not mirrored
const PAGE = 500;                       // calendar_feed_rows hands out 500 rows per call
const MAX_BYTES = 20 * 1024 * 1024;
const CHUNK = 200;                      // calendar_add takes at most 200 events per call
// the repetition rules calendar_add accepts (same pattern as in the SQL), FREQ first
const RULE_RE = /^FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)(;(INTERVAL=\d{1,3}|COUNT=\d{1,4}|UNTIL=\d{8}(T\d{6}Z?)?|BYDAY=[+-]?\d{0,2}(MO|TU|WE|TH|FR|SA|SU)(,[+-]?\d{0,2}(MO|TU|WE|TH|FR|SA|SU))*))*$/;

/* ---------- the address: only in the keychain ---------- */

export function readFeedUrl(name) {
    try {
        return execFileSync('security', ['find-generic-password', '-s', FEEDS[name].service, '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) { return ''; }
}

/* into the keychain through `security -i` on stdin - so the address never stands in a process list */
export function saveFeedUrl(name, url) {
    if (/[\s"'\\]/.test(url)) throw new Error('Adresse enthält Leer- oder Anführungszeichen');
    const f = FEEDS[name];
    execFileSync('security', ['-i'], {
        input: `add-generic-password -U -a doc -s ${f.service} -l "Kalender ${f.label} (iCal)" -w "${url}"\n`,
        stdio: ['pipe', 'ignore', 'pipe']
    });
    if (readFeedUrl(name) !== url) throw new Error('Schlüsselbund hat die Adresse nicht übernommen');
}

/* a pasted address -> { url } or { err } (a German sentence for Doc) */
export function checkUrl(name, raw) {
    let s = String(raw || '').trim();
    if (/^webcals?:\/\//i.test(s)) s = 'https://' + s.replace(/^webcals?:\/\//i, '');
    if (/[\s"'\\]/.test(s)) return { err: 'In der Adresse stehen Leer- oder Anführungszeichen – bitte nur den Link einfügen.' };
    let u;
    try { u = new URL(s); } catch (e) { return { err: 'Das ist keine Internet-Adresse.' }; }
    if (u.protocol !== 'https:') return { err: 'Die Adresse muss mit https:// beginnen.' };
    if (name === 'google') {
        if (u.hostname !== 'calendar.google.com') return { err: 'Das ist keine Google-Kalender-Adresse (calendar.google.com).' };
        if (!/\/calendar\/ical\/.+\.ics$/.test(u.pathname)) return { err: 'Bitte die „Geheime Adresse im iCal-Format“ nehmen – sie endet auf .ics.' };
    } else {
        if (!/^outlook\.(office365|office|live)\.com$/.test(u.hostname)) return { err: 'Das ist keine Outlook-Adresse (outlook.office365.com).' };
        if (/\.html?$/.test(u.pathname)) return { err: 'Das ist der HTML-Link – bitte den ICS-Link nehmen (endet auf .ics).' };
        if (!/\.ics$/.test(u.pathname)) return { err: 'Bitte den ICS-Link nehmen – er endet auf .ics.' };
    }
    return { url: u.href };
}

/* the feed's text; errors never carry the address */
export async function fetchFeed(url) {
    let res;
    try {
        res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'DocKalender/1.0 (calendar mirror)' }, signal: AbortSignal.timeout(30000) });
    } catch (e) {
        throw new Error('Feed nicht erreichbar (' + ((e.cause && e.cause.code) || e.name || 'Netz') + ')');
    }
    if (!res.ok) throw new Error('Feed antwortet mit HTTP ' + res.status + (res.status === 404 ? ' – Adresse zurückgesetzt?' : ''));
    if (+res.headers.get('content-length') > MAX_BYTES) throw new Error('Feed größer als 20 MB');
    const text = await res.text();
    if (text.length > MAX_BYTES) throw new Error('Feed größer als 20 MB');
    if (!/BEGIN:VCALENDAR/i.test(text.slice(0, 4000))) throw new Error('Feed ist kein Kalender (kein BEGIN:VCALENDAR)');
    return text;
}

/* ---------- feed -> rows ---------- */

const sha1 = s => crypto.createHash('sha1').update(s, 'utf8').digest('hex');
const iso = v => new Date(v).toISOString();
/* trimmed and cut to the database's limit (trimmed again after the cut, so the database's btrim changes nothing) */
const textTo = (s, n) => (s ? s.replace(/\u0000/g, '').trim().slice(0, n).trim() || null : null);   // Postgres refuses NUL

/* Google writes descriptions as HTML ("<b>…</b><br>"): plain text with line breaks, as the calendar shows notes */
function plain(s) {
    if (!s || !/<\/?[a-z][^>]*>/i.test(s)) return s;
    return s.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h\d)>/gi, '\n').replace(/<li[^>]*>/gi, '• ')
        .replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, inner) => {
            const t = inner.replace(/<[^>]+>/g, '').trim();
            return !t || t === href ? href : t + ' (' + href + ')';
        })
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
        .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function freqFirst(rule) {
    const parts = String(rule).replace(/^RRULE:/i, '').toUpperCase().split(';').filter(Boolean);
    return [...parts.filter(p => p.startsWith('FREQ=')), ...parts.filter(p => !p.startsWith('FREQ='))].join(';');
}

/* one event of parseIcs -> exactly the row calendar_add would store (so the next comparison finds no difference) */
function toRow(ev, prefix) {
    const title = ev.title.replace(/\u0000/g, '').replace(/\s+/g, ' ').trim().slice(0, 300).trim() || '(ohne Titel)';
    let notes = plain(ev.notes), rrule = ev.rrule ? freqFirst(ev.rrule) : null;
    if (rrule && !RULE_RE.test(rrule)) {
        notes = (notes ? notes + '\n\n' : '') + 'Wiederholung (hier nur der erste Termin): ' + rrule;
        rrule = null;
    }
    const raw = ev.source_uid || 'h:' + sha1(title + '|' + ev.starts_at);   // no UID: title + start identify it
    const uid = (prefix + raw).length <= 300 ? prefix + raw : prefix + 'sha1:' + sha1(raw);
    return {
        title, starts_at: iso(ev.starts_at), ends_at: ev.ends_at ? iso(ev.ends_at) : null, all_day: !!ev.all_day,
        location: textTo(ev.location, 500), notes: textTo(notes, 10000), rrule,
        exdates: [...new Set((ev.exdates || []).map(iso))].sort(),
        remind: [...new Set(ev.remind || [])].sort((a, b) => b - a), color: 2, source_uid: uid
    };
}

/* the feed's rows (within the mirrored range) and every source_uid it still holds (for deleting what vanished) */
export function feedRows(text, prefix, now = new Date()) {
    const { events, skipped } = K.parseIcs(text, { now });
    const cutoff = +K.addDays(K.startOfDay(now), -BACK_DAYS);
    const rows = new Map(), present = new Set();
    for (const ev of events) {
        const row = toRow(ev, prefix);
        present.add(row.source_uid);
        const r = row.rrule && K.parseRule(row.rrule);
        const alive = r ? !(r.until && +r.until < cutoff) : +new Date(row.ends_at || row.starts_at) >= cutoff;
        if (alive) rows.set(row.source_uid, row);   // the same UID twice: the later one wins
    }
    return { rows: [...rows.values()], present, skipped, total: events.length };
}

const ms = v => (v == null ? null : +new Date(v));
const times = v => (v || []).map(x => +new Date(x)).sort((a, b) => a - b).join();
function same(a, b) {
    return a.title === b.title && ms(a.starts_at) === ms(b.starts_at) && ms(a.ends_at) === ms(b.ends_at) &&
        !!a.all_day === !!b.all_day && (a.location || null) === (b.location || null) && (a.notes || null) === (b.notes || null) &&
        (a.rrule || null) === (b.rrule || null) && times(a.exdates) === times(b.exdates) &&
        (a.remind || []).join() === (b.remind || []).join() && Number(a.color) === Number(b.color);
}

/* what to send (new or changed) and which ids to delete (no longer in the feed) */
export function diffRows(rows, dbRows, present) {
    const byUid = new Map(dbRows.map(r => [r.source_uid, r]));
    const send = rows.filter(r => { const d = byUid.get(r.source_uid); return !d || !same(r, d); });
    const remove = dbRows.filter(d => !present.has(d.source_uid)).map(d => d.id);
    return { send, remove, same: rows.length - send.length };
}

/* ---------- one sync ---------- */

/* rpc(name, body) -> parsed JSON (the watcher's, or testRpc below). Returns a report; dry = compare only. */
export async function syncFeed(name, { rpc, token, text, now = new Date(), dry = false }) {
    const f = FEEDS[name];
    const { rows, present, skipped, total } = feedRows(text, f.prefix, now);
    const db = [];
    for (let after = 0; ;) {
        const page = await rpc('calendar_feed_rows', { p_token: token, p_prefix: f.prefix, p_after: after });
        db.push(...page);
        if (page.length < PAGE) break;
        after = page[page.length - 1].id;
    }
    let { send, remove, same: unchanged } = diffRows(rows, db, present);
    const report = { name, label: f.label, total, mirrored: rows.length, skipped, unchanged, toSend: send, toRemove: remove.length, sent: 0, removed: 0, failed: [], held: 0 };
    // a feed that suddenly lost (almost) everything is more likely broken than emptied: then nothing is deleted
    if (remove.length && (present.size === 0 || (remove.length > 10 && remove.length > db.length / 2))) {
        report.held = remove.length;
        remove = [];
    }
    if (dry) return report;
    for (let i = 0; i < send.length; i += CHUNK) {
        const part = send.slice(i, i + CHUNK);
        try {
            await rpc('calendar_add', { p_token: token, p_events: part });
            report.sent += part.length;
        } catch (e) {
            // one bad entry refuses the whole call: then one by one, so all the others still arrive
            for (const ev of part) {
                try { await rpc('calendar_add', { p_token: token, p_events: [ev] }); report.sent++; }
                catch (e2) { report.failed.push(ev.title + ' (' + ev.starts_at.slice(0, 10) + '): ' + String(e2.message).slice(0, 200)); }
            }
        }
    }
    if (remove.length) report.removed = await rpc('calendar_feed_remove', { p_token: token, p_prefix: f.prefix, p_ids: remove });
    return report;
}

/* one line for the log (titles stay out of it, except the ones that failed) */
export function reportLine(r, dry) {
    const parts = [r.label + ':', r.total + ' im Feed,', r.mirrored + ' gespiegelt,'];
    if (dry) parts.push(r.toSend.length + ' würden eingetragen/geändert,', r.toRemove + ' würden entfernt');
    else parts.push(r.sent + ' eingetragen/geändert,', r.removed + ' entfernt');
    if (r.held) parts.push('– ACHTUNG: ' + r.held + ' Löschungen zurückgehalten (Feed fast leer?)');
    if (r.skipped) parts.push('(' + r.skipped + ' unlesbar)');
    if (r.failed.length) parts.push('– ' + r.failed.length + ' abgelehnt: ' + r.failed.slice(0, 3).join('; '));
    return parts.join(' ');
}

/* ---------- silent test: the database as a JSON file ---------- */

/* the three calls syncFeed makes, against <file> (an array of rows) - KALENDER_TEST only */
export function testRpc(file) {
    const load = () => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return []; } };
    const save = rows => fs.writeFileSync(file, JSON.stringify(rows, null, 1));
    return async (name, body) => {
        const rows = load();
        // times come back the way PostgREST writes timestamptz ("2026-11-12T13:00:00+00:00")
        const pg = v => (v == null ? v : new Date(v).toISOString().replace(/\.\d{3}Z$/, '+00:00'));
        if (name === 'calendar_feed_rows') {
            return rows.filter(r => (r.source_uid || '').startsWith(body.p_prefix) && r.id > (body.p_after || 0)).sort((a, b) => a.id - b.id).slice(0, PAGE)
                .map(r => ({ ...r, starts_at: pg(r.starts_at), ends_at: pg(r.ends_at), exdates: (r.exdates || []).map(pg) }));
        }
        if (name === 'calendar_add') {
            const out = [];
            for (const ev of body.p_events) {
                if (!ev.title || !ev.starts_at || (ev.rrule && !RULE_RE.test(ev.rrule))) throw new Error('calendar_add HTTP 400 bad event');
                const old = rows.find(r => r.source_uid && r.source_uid === ev.source_uid);
                if (old) { Object.assign(old, ev); out.push({ id: old.id, op: 'update' }); }
                else { const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1; rows.push({ id, ...ev }); out.push({ id, op: 'insert' }); }
            }
            save(rows);
            return out;
        }
        if (name === 'calendar_feed_remove') {
            const keep = rows.filter(r => !(body.p_ids.includes(r.id) && (r.source_uid || '').startsWith(body.p_prefix)));
            save(keep);
            return rows.length - keep.length;
        }
        throw new Error('testRpc: unknown ' + name);
    };
}
