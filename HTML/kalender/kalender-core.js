/* Doc's calendar - the logic shared by the page (HTML/kalender/index.html) and the reminder watcher on the Mac
   (tools/kalender/waechter.mjs), so both see exactly the same occurrences and reminder times.
   No DOM, no network. Works in the browser (window.KalenderCore) and in node (require).

   All wall-clock arithmetic is done in the local time zone: the page runs on Doc's devices and the watcher sets
   TZ=Europe/Berlin before it computes anything.

   An event (row of public.calendar_event):
     { id, title, starts_at, ends_at, all_day, location, notes, rrule, exdates[], remind[], color }
     starts_at  ISO instant; all-day: local midnight of the first day
     ends_at    exclusive end, or null = start + 1 h (timed) / + 1 day (all-day)
     rrule      RFC 5545 subset: FREQ=DAILY|WEEKLY|MONTHLY|YEARLY, INTERVAL, COUNT, UNTIL, BYDAY (WEEKLY: MO,TU..;
                MONTHLY: 1MO, -1FR ...)
     remind     minutes before the start (all-day: before 00:00, so 360 = 18:00 the day before, -420 = 07:00 that day)
*/
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.KalenderCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const DAY = 86400000;
    const WD = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
    const WD_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const DEFAULT_REMIND = [60, 15];
    const DEFAULT_REMIND_ALLDAY = [360];

    const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes(), d.getSeconds());
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    /* "2026-11-06" in local time */
    const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

    /* ---------- repetition ---------- */

    /* "20261231", "20261231T225959Z", "20261231T235959" -> Date (a bare date counts to the end of that day) */
    function parseUntil(v) {
        const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(v || '');
        if (!m) return null;
        const [, y, mo, d, h, mi, s, z] = m;
        if (h === undefined) return new Date(+y, +mo - 1, +d, 23, 59, 59);
        return z ? new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)) : new Date(+y, +mo - 1, +d, +h, +mi, +s);
    }

    /* "FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH" -> { freq, interval, count, until, byday: [{ n, wd }], other } */
    function parseRule(rrule) {
        if (!rrule) return null;
        const r = { freq: null, interval: 1, count: 0, until: null, byday: [], other: [] };
        for (const part of String(rrule).replace(/^RRULE:/i, '').split(';')) {
            const [k, v] = part.split('=');
            if (!k || v === undefined) continue;
            const key = k.trim().toUpperCase(), val = v.trim().toUpperCase();
            if (key === 'FREQ') r.freq = val;
            else if (key === 'INTERVAL') r.interval = Math.max(1, parseInt(val, 10) || 1);
            else if (key === 'COUNT') r.count = Math.max(0, parseInt(val, 10) || 0);
            else if (key === 'UNTIL') r.until = parseUntil(val);
            else if (key === 'BYDAY') {
                for (const b of val.split(',')) {
                    const m = /^([+-]?\d{1,2})?(SU|MO|TU|WE|TH|FR|SA)$/.exec(b.trim());
                    if (m) r.byday.push({ n: m[1] ? parseInt(m[1], 10) : 0, wd: WD[m[2]] });
                }
            } else if (key !== 'WKST') r.other.push(key);
        }
        return ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(r.freq) ? r : null;
    }

    /* the n-th weekday wd of a month (n < 0 counts from the end, n = 0: every one), at the given time */
    function weekdaysOfMonth(y, m, n, wd, h, mi, s) {
        const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
        const all = [];
        for (let d = 1 + ((wd - first.getDay() + 7) % 7); d <= days; d += 7) all.push(new Date(y, m, d, h, mi, s));
        if (!n) return all;
        const pick = n > 0 ? all[n - 1] : all[all.length + n];
        return pick ? [pick] : [];
    }

    /* length of one occurrence; all-day ones in whole days (a day across a DST switch is 23 or 25 hours) */
    function spanOf(ev) {
        const s = new Date(ev.starts_at);
        if (ev.all_day) {
            const days = ev.ends_at ? Math.max(1, Math.round((startOfDay(new Date(ev.ends_at)) - startOfDay(s)) / DAY)) : 1;
            return { days };
        }
        const ms = ev.ends_at ? new Date(ev.ends_at) - s : 3600000;
        return { ms: ms > 0 ? ms : 3600000 };
    }
    function endOf(start, span) {
        return span.days !== undefined ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + span.days) : new Date(+start + span.ms);
    }

    /* Every occurrence of `ev` that overlaps [from, to): [{ ev, start, end, key }] - key is unique per occurrence */
    function occurrences(ev, from, to) {
        const start = new Date(ev.starts_at);
        const span = spanOf(ev);
        const ex = new Set((ev.exdates || []).map(d => +new Date(d)));
        const out = [];
        const take = s => {
            const e = endOf(s, span);
            if (s < to && e > from && !ex.has(+s)) out.push({ ev, start: s, end: e, key: ev.id + '|' + s.toISOString() });
        };
        const r = parseRule(ev.rrule);
        if (!r) { take(start); return out; }

        const Y = start.getFullYear(), M = start.getMonth(), D = start.getDate();
        const h = start.getHours(), mi = start.getMinutes(), sec = start.getSeconds();
        const until = r.until ? +r.until : Infinity;
        const iv = r.interval;
        const monday = D - ((start.getDay() + 6) % 7);   // day-of-month of the Monday of the first week
        let n = 0;                                        // occurrences so far (COUNT counts the excluded ones too)
        for (let k = 0; k < 40000; k++) {
            let cands;
            if (r.freq === 'DAILY') cands = [new Date(Y, M, D + k * iv, h, mi, sec)];
            else if (r.freq === 'WEEKLY') {
                cands = r.byday.length
                    ? r.byday.map(b => new Date(Y, M, monday + 7 * k * iv + ((b.wd + 6) % 7), h, mi, sec)).sort((a, b) => a - b)
                    : [new Date(Y, M, D + 7 * k * iv, h, mi, sec)];
            } else if (r.freq === 'MONTHLY') {
                if (r.byday.length) {
                    cands = [].concat(...r.byday.map(b => weekdaysOfMonth(Y, M + k * iv, b.n, b.wd, h, mi, sec))).sort((a, b) => a - b);
                } else {
                    const c = new Date(Y, M + k * iv, D, h, mi, sec);
                    cands = c.getDate() === D ? [c] : [];      // no 31 February: that month has none
                }
            } else {
                const c = new Date(Y + k * iv, M, D, h, mi, sec);
                cands = c.getMonth() === M ? [c] : [];          // 29 February only in leap years
            }
            let stop = false;
            for (const c of cands) {
                if (c < start) continue;
                if (+c > until || (r.count && n >= r.count)) { stop = true; break; }
                n++;
                if (c >= to) { stop = true; break; }
                take(c);
            }
            if (stop) break;
        }
        return out;
    }

    /* all occurrences of all events in [from, to), sorted: all-day first per day, then by time */
    function expand(events, from, to) {
        const all = [];
        for (const ev of events) all.push(...occurrences(ev, from, to));
        return all.sort((a, b) => a.start - b.start || (b.ev.all_day ? 1 : 0) - (a.ev.all_day ? 1 : 0) || a.end - b.end);
    }

    /* minutes before the start at which Solita rings for this event */
    function remindOf(ev) {
        if (Array.isArray(ev.remind)) return ev.remind.filter(m => Number.isFinite(m));
        return ev.all_day ? DEFAULT_REMIND_ALLDAY.slice() : DEFAULT_REMIND.slice();
    }
    /* [{ occ, minutes, at }] for every reminder of every occurrence whose time lies in [from, to) */
    function reminders(events, from, to) {
        const out = [];
        const reach = 3 * DAY;   // the longest lead time offered is one day; imported ones may be longer
        for (const ev of events) {
            const lead = Math.max(0, ...remindOf(ev)) * 60000;
            for (const occ of occurrences(ev, new Date(+from - reach), new Date(+to + Math.max(reach, lead)))) {
                for (const m of remindOf(ev)) {
                    const at = new Date(+occ.start - m * 60000);
                    if (at >= from && at < to) out.push({ occ, minutes: m, at });
                }
            }
        }
        return out.sort((a, b) => a.at - b.at);
    }

    /* ---------- import: .ics (Google's export) ---------- */

    const unescapeText = v => v.replace(/\\([\\;,nN])/g, (_, c) => (c === 'n' || c === 'N' ? '\n' : c));

    /* "NAME;P1=a;P2="x:y":VALUE" -> { name, params, value } */
    function splitProp(line) {
        let q = false, cut = -1;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') q = !q;
            else if (c === ':' && !q) { cut = i; break; }
        }
        if (cut < 0) return null;
        const head = line.slice(0, cut), value = line.slice(cut + 1);
        const parts = head.match(/(?:[^;"]+|"[^"]*")+/g) || [head];
        const params = {};
        for (const p of parts.slice(1)) {
            const i = p.indexOf('=');
            if (i > 0) params[p.slice(0, i).toUpperCase()] = p.slice(i + 1).replace(/^"|"$/g, '');
        }
        return { name: parts[0].toUpperCase(), params, value };
    }

    /* offset of time zone tz at instant ms, in ms (Intl; unknown zone -> null) */
    function tzOffset(ms, tz) {
        try {
            const f = new Intl.DateTimeFormat('en-US', {
                timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            const p = {};
            for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
            return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - Math.floor(ms / 1000) * 1000;
        } catch (e) { return null; }
    }

    /* an iCalendar date or date-time -> { date: Date, allDay } */
    function icsTime(prop) {
        const v = prop.value.trim();
        const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(v);
        if (!m) return null;
        const [, y, mo, d, h, mi, s, z] = m;
        if (h === undefined || prop.params.VALUE === 'DATE') return { date: new Date(+y, +mo - 1, +d), allDay: true };
        const parts = [+y, +mo - 1, +d, +h, +mi, +(s || 0)];
        if (z) return { date: new Date(Date.UTC(...parts)), allDay: false };
        const tz = prop.params.TZID;
        const local = new Date(...parts);
        if (!tz || tz === 'Europe/Berlin' || tzOffset(0, tz) === null) return { date: local, allDay: false };
        // the wall time is in another zone: find the instant whose wall time there is `parts`
        const guess = Date.UTC(...parts);
        let ms = guess - tzOffset(guess, tz);
        ms = guess - tzOffset(ms, tz);
        return { date: new Date(ms), allDay: false };
    }

    /* keep only what the calendar understands (FREQ, INTERVAL, COUNT, UNTIL, BYDAY), as written. A part that only
       repeats the start (WKST, BYMONTHDAY = its day, BYMONTH = its month) is dropped; any other part (BYSETPOS = "the
       last Monday", several months ...) would make the series ring on wrong days if left out - then null, and the
       caller keeps the first date only and notes the rule */
    function cleanRule(v, start) {
        const keep = [];
        for (const p of String(v).replace(/^RRULE:/i, '').toUpperCase().split(';').filter(Boolean)) {
            const [k, val] = p.split('=');
            if (/^(FREQ|INTERVAL|COUNT|UNTIL|BYDAY)$/.test(k)) keep.push(p);
            else if (k === 'WKST') continue;
            else if (k === 'BYMONTHDAY' && start && val === String(start.getDate())) continue;
            else if (k === 'BYMONTH' && start && val === String(start.getMonth() + 1)) continue;
            else return null;
        }
        const s = keep.join(';');
        const r = parseRule(s);
        // the expansion knows BYDAY for weekly and monthly series only (DAILY / YEARLY would ignore it)
        return r && !(r.byday.length && (r.freq === 'DAILY' || r.freq === 'YEARLY')) ? s : null;
    }

    /* Read an .ics file: [{ title, starts_at, ends_at, all_day, location, notes, rrule, exdates, remind, color,
       source_uid }], cancelled ones left out. A changed single occurrence of a series (RECURRENCE-ID) becomes its
       own entry, and the series skips that date. `skipped` counts what could not be read. */
    function parseIcs(text, opts) {
        const now = (opts && opts.now) || new Date();
        const lines = String(text).replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '').split('\n');
        const raw = [];
        let cur = null, inAlarm = 0;
        for (const line of lines) {
            if (/^BEGIN:VEVENT$/i.test(line)) { cur = []; continue; }
            if (/^END:VEVENT$/i.test(line)) { if (cur) raw.push(cur); cur = null; continue; }
            if (!cur) continue;
            if (/^BEGIN:/i.test(line)) { inAlarm++; continue; }   // VALARM etc. inside an event: not ours
            if (/^END:/i.test(line)) { inAlarm = Math.max(0, inAlarm - 1); continue; }
            if (inAlarm) continue;
            const p = splitProp(line);
            if (p) cur.push(p);
        }

        const series = new Map(), overrides = [], out = [];
        let skipped = 0;
        for (const props of raw) {
            const one = n => props.find(p => p.name === n);
            const st = one('DTSTART') && icsTime(one('DTSTART'));
            if (!st) { skipped++; continue; }
            const uid = (one('UID') || {}).value || '';
            const status = ((one('STATUS') || {}).value || '').toUpperCase();
            const rid = one('RECURRENCE-ID');
            let end = one('DTEND') && icsTime(one('DTEND'));
            let endDate = end ? end.date : null;
            if (!endDate && one('DURATION')) {
                const d = /^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(one('DURATION').value.trim());
                if (d) {
                    const [, w, dd, hh, mm, ss] = d.map(x => +x || 0);
                    endDate = st.allDay ? new Date(st.date.getFullYear(), st.date.getMonth(), st.date.getDate() + 7 * w + dd)
                        : new Date(+st.date + ((((7 * w + dd) * 24 + hh) * 60 + mm) * 60 + ss) * 1000);
                }
            }
            const exdates = [];
            for (const p of props.filter(q => q.name === 'EXDATE')) {
                for (const v of p.value.split(',')) {
                    const t = icsTime({ name: 'EXDATE', params: p.params, value: v });
                    if (t) exdates.push(t.date.toISOString());
                }
            }
            const rr = one('RRULE');
            // our own export carries the reminders: X-DOC-REMIND:none or a list of minutes ("60,15")
            const own = one('X-DOC-REMIND');
            const ownRemind = own ? (own.value.trim().toLowerCase() === 'none' ? [] : own.value.split(',').map(x => parseInt(x, 10)).filter(Number.isFinite)) : null;
            const ev = {
                title: unescapeText(((one('SUMMARY') || {}).value || '').trim()) || '(ohne Titel)',
                starts_at: st.date.toISOString(),
                ends_at: endDate && endDate > st.date ? endDate.toISOString() : null,
                all_day: st.allDay,
                location: one('LOCATION') ? unescapeText(one('LOCATION').value).trim() || null : null,
                notes: one('DESCRIPTION') ? unescapeText(one('DESCRIPTION').value).trim() || null : null,
                rrule: rr ? cleanRule(rr.value, st.date) : null,
                exdates,
                remind: ownRemind || (st.allDay ? DEFAULT_REMIND_ALLDAY.slice() : DEFAULT_REMIND.slice()),
                color: 2,
                source_uid: uid || null
            };
            if (rid) {
                const t = icsTime(rid);
                overrides.push({ uid, at: t ? t.date.toISOString() : null, ev: status === 'CANCELLED' ? null : ev, rid: rid.value });
                continue;
            }
            if (status === 'CANCELLED') continue;
            if (rr && !ev.rrule) ev.notes = (ev.notes ? ev.notes + '\n\n' : '') + 'Wiederholung (hier nur der erste Termin): ' + rr.value.replace(/^RRULE:/i, '');
            if (uid) series.set(uid, ev);
            out.push(ev);
        }
        for (const o of overrides) {
            const master = series.get(o.uid);
            if (master && o.at && !master.exdates.includes(o.at)) master.exdates.push(o.at);
            if (o.ev) { o.ev.rrule = null; o.ev.source_uid = o.uid ? o.uid + '|' + o.rid : null; out.push(o.ev); }
        }
        // a single past appointment cannot ring any more - still taken, the calendar shows the past too
        return { events: out, skipped, upcoming: out.filter(e => e.rrule || new Date(e.ends_at || e.starts_at) >= startOfDay(now)).length };
    }

    /* ---------- import: Google's export is a .zip of .ics files ---------- */

    /* [{ name, text }] of the .ics files inside a zip (stored or deflated), via DecompressionStream */
    async function unzipIcs(buf) {
        const u8 = new Uint8Array(buf), dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
        let eocd = -1;
        for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        if (eocd < 0) throw new Error('keine ZIP-Datei');
        const count = dv.getUint16(eocd + 10, true);
        let p = dv.getUint32(eocd + 16, true);
        const files = [];
        for (let i = 0; i < count; i++) {
            if (dv.getUint32(p, true) !== 0x02014b50) break;
            const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
            const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
            const local = dv.getUint32(p + 42, true);
            const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen));
            p += 46 + nlen + xlen + clen;
            if (!/\.ics$/i.test(name)) continue;
            const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
            const data = u8.subarray(start, start + csize);
            let bytes;
            if (method === 0) bytes = data;
            else if (method === 8) {
                const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                bytes = new Uint8Array(await new Response(stream).arrayBuffer());
            } else continue;
            files.push({ name: name.split('/').pop(), text: new TextDecoder().decode(bytes) });
        }
        return files;
    }

    /* ---------- quick entry: "morgen 18 Uhr Essen mit Paul" ---------- */

    const MONTHS = ['januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember'];
    const DAYS = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
    const WORDS = { ein: 1, eins: 1, eine: 1, einer: 1, einem: 1, einen: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7,
        acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, dreizehn: 13, vierzehn: 14, fünfzehn: 15, sechzehn: 16, siebzehn: 17,
        achtzehn: 18, neunzehn: 19, zwanzig: 20, einundzwanzig: 21, zweiundzwanzig: 22, dreiundzwanzig: 23, dreißig: 30 };
    const NUM = '(\\d{1,2}|' + Object.keys(WORDS).sort((a, b) => b.length - a.length).join('|') + ')';
    const num = s => (/^\d+$/.test(s) ? parseInt(s, 10) : WORDS[s.toLowerCase()]);
    const B = '(?<![\\p{L}\\d])', E = '(?![\\p{L}\\d])';   // word edges that know ä, ö, ü, ß

    /* Pull a date and a time out of a German sentence; the rest is the title.
       -> { title, date: Date|null (day), start: {h, m}|null, end: {h, m}|null, allDay } */
    function parseQuick(text, now) {
        now = now || new Date();
        let s = ' ' + String(text || '').replace(/\s+/g, ' ') + ' ';
        const cut = re => { const m = re.exec(s); if (m) s = s.slice(0, m.index) + ' ' + s.slice(m.index + m[0].length); return m; };
        let date = null, start = null, end = null, allDay = false;
        const today = startOfDay(now);
        const hm = (h, m) => (h >= 0 && h <= 24 && m >= 0 && m < 60 ? { h: h % 24, m } : null);

        // the time first, so "18.30 Uhr" is never read as a date
        let m = cut(new RegExp(B + '(?:von\\s+|ab\\s+)?' + NUM + '(?:[:.](\\d{2}))?\\s*(?:uhr\\s*)?(?:-|–|bis)\\s*' + NUM + '(?:[:.](\\d{2}))?\\s*uhr' + E, 'iu'))
            || cut(new RegExp(B + '(?:von\\s+)?(\\d{1,2})[:.](\\d{2})\\s*(?:uhr\\s*)?(?:-|–|bis)\\s*(\\d{1,2})[:.](\\d{2})' + E, 'iu'));
        if (m) { start = hm(num(m[1]), +(m[2] || 0)); end = hm(num(m[3]), +(m[4] || 0)); }
        if (!start && (m = cut(new RegExp(B + '(?:um\\s+|ab\\s+|gegen\\s+)?halb\\s+' + NUM + '(?:\\s*uhr)?' + E, 'iu')))) start = hm(num(m[1]) - 1, 30);
        if (!start && (m = cut(new RegExp(B + '(?:um\\s+|ab\\s+|gegen\\s+)?' + NUM + '(?:[:.](\\d{2}))?\\s*uhr(?:\\s+(\\d{2}))?' + E, 'iu')))) start = hm(num(m[1]), +(m[2] || m[3] || 0));
        if (!start && (m = cut(new RegExp(B + '(?:um\\s+|ab\\s+|gegen\\s+)?(\\d{1,2}):(\\d{2})' + E, 'iu')))) start = hm(+m[1], +m[2]);
        if (!start && (m = cut(new RegExp(B + '(?:um|gegen)\\s+' + NUM + E, 'iu')))) start = hm(num(m[1]), 0);
        if (start && /(?<![\p{L}])(abends|nachmittags)(?![\p{L}])/iu.test(s) && start.h < 12) { start.h += 12; if (end && end.h < 12) end.h += 12; }
        cut(/(?<![\p{L}])(morgens|vormittags|nachmittags|abends|früh)(?![\p{L}])/iu);

        if ((m = cut(new RegExp(B + '(ganztägig|ganztags|den ganzen tag)' + E, 'iu')))) allDay = true;

        if ((m = cut(new RegExp(B + 'übermorgen' + E, 'iu')))) date = addDays(today, 2);
        else if ((m = cut(new RegExp(B + 'morgen' + E, 'iu')))) date = addDays(today, 1);
        else if ((m = cut(new RegExp(B + 'heute' + E, 'iu')))) date = today;
        else if ((m = cut(new RegExp(B + 'in\\s+' + NUM + '\\s+(tag|tagen|woche|wochen|monat|monaten)' + E, 'iu')))) {
            const n = num(m[1]), u = m[2].toLowerCase();
            date = u.startsWith('tag') ? addDays(today, n) : u.startsWith('woche') ? addDays(today, 7 * n)
                : new Date(today.getFullYear(), today.getMonth() + n, today.getDate());
        } else if ((m = cut(new RegExp(B + '(?:am\\s+)?(\\d{1,2})\\.\\s?(\\d{1,2})\\.(\\d{2,4})?' + E, 'iu')))) {
            date = dayOf(+m[1], +m[2] - 1, m[3]);
        } else if ((m = cut(new RegExp(B + '(?:am\\s+)?(\\d{1,2})\\.?\\s+(' + MONTHS.join('|') + '|jan|feb|mär|apr|jun|jul|aug|sep|sept|okt|nov|dez)\\.?(?:\\s+(\\d{4}))?' + E, 'iu')))) {
            const mon = MONTHS.findIndex(x => x.startsWith(m[2].toLowerCase().slice(0, 3)));
            date = dayOf(+m[1], mon, m[3]);
        } else if ((m = cut(new RegExp(B + '(?:am\\s+)?(nächsten|nächster|kommenden|kommender)?\\s*(' + DAYS.join('|') + ')' + E, 'iu')))) {
            const wd = DAYS.indexOf(m[2].toLowerCase());
            let diff = (wd - today.getDay() + 7) % 7;
            // "Freitag" said on a Friday: today if the time is still ahead, else next week; "nächsten Freitag": never today
            if (diff === 0 && (m[1] || !start || start.h * 60 + start.m <= now.getHours() * 60 + now.getMinutes())) diff = 7;
            date = addDays(today, diff);
        } else if ((m = cut(new RegExp(B + 'in\\s+' + NUM + '\\s+(stunde|stunden|minute|minuten)' + E, 'iu')))) {
            const n = num(m[1]);
            const at = new Date(+now + n * (m[2].toLowerCase().startsWith('stunde') ? 3600000 : 60000));
            date = startOfDay(at);
            start = { h: at.getHours(), m: Math.round(at.getMinutes() / 5) * 5 % 60 };
            if (Math.round(at.getMinutes() / 5) * 5 === 60) { start.h = (start.h + 1) % 24; }
        }
        function dayOf(d, mon, y) {
            let yr = y ? (+y < 100 ? 2000 + +y : +y) : today.getFullYear();
            let dt = new Date(yr, mon, d);
            if (!y && dt < today) dt = new Date(yr + 1, mon, d);   // "12.3." in November = next March
            return dt.getMonth() === mon ? dt : null;
        }

        if (date && !start) allDay = true;
        if (!date && start) {   // a time without a day: today, or tomorrow when that time has passed
            date = today;
            if (start.h * 60 + start.m <= now.getHours() * 60 + now.getMinutes()) date = addDays(today, 1);
        }
        if (allDay) { start = null; end = null; }

        let title = s.replace(/\s+/g, ' ').trim()
            .replace(/^(?:(?:am|um|ab|von|bis|gegen|termin|ist|habe ich|hab ich|ich habe)\s+)+/i, '')
            .replace(/\s+(?:am|um|ab|von|bis|gegen)$/i, '')
            .replace(/^[,.:;–-]+|[,.:;–-]+$/g, '').trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        return { title, date, start, end, allDay };
    }

    /* ---------- words ---------- */

    const WEEKDAY_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const WEEKDAY_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const MONTH_LONG = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const MONTH_SHORT = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const hhmm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

    /* ISO week number */
    function isoWeek(d) {
        const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
        return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / DAY + 1) / 7);
    }

    /* how Solita says a time: "18 Uhr", "18 Uhr 30" */
    const spokenTime = d => d.getHours() + ' Uhr' + (d.getMinutes() ? ' ' + String(d.getMinutes()).padStart(2, '0') : '');

    /* "in 15 Minuten", "in einer Stunde", "in einer Stunde und 40 Minuten", "in 3 Stunden" */
    function spokenIn(min) {
        if (min <= 1) return 'in einer Minute';
        if (min < 55) return 'in ' + min + ' Minuten';
        if (min <= 65) return 'in einer Stunde';
        if (min < 175) {
            const h = Math.floor(min / 60), rest = Math.round((min % 60) / 5) * 5;
            const hours = h === 1 ? 'einer Stunde' : 'zwei Stunden';
            return rest === 0 ? 'in ' + hours : rest === 60 ? 'in ' + (h === 1 ? 'zwei Stunden' : 'drei Stunden') : 'in ' + hours + ' und ' + rest + ' Minuten';
        }
        return 'in ' + Math.round(min / 60) + ' Stunden';
    }

    /* One sentence for one occurrence - only the time, never the title: the text goes through a cloud voice
       (Doc's rule "Privates nie in den Ruf"); what it is appears on the Mac's screen. */
    function spokenSentence(occ, now) {
        const today = startOfDay(now), day = startOfDay(occ.start);
        const dayDiff = Math.round((day - today) / DAY);
        const dayWord = dayDiff === 0 ? 'heute' : dayDiff === 1 ? 'morgen' : dayDiff === 2 ? 'übermorgen' : 'am ' + WEEKDAY_LONG[day.getDay()];
        if (occ.ev.all_day) {
            if (dayDiff <= 0) return 'Heute hast du einen ganztägigen Termin.';
            return dayWord.charAt(0).toUpperCase() + dayWord.slice(1) + ' hast du einen ganztägigen Termin.';
        }
        const min = Math.round((occ.start - now) / 60000);
        if (min <= 0) return min > -5 ? 'Jetzt beginnt dein Termin um ' + spokenTime(occ.start) + '.' : 'Dein Termin um ' + spokenTime(occ.start) + ' hat schon begonnen.';
        if (min < 6 * 60 && dayDiff === 0) { const w = spokenIn(min); return w.charAt(0).toUpperCase() + w.slice(1) + ', um ' + spokenTime(occ.start) + ', hast du einen Termin.'; }
        return dayWord.charAt(0).toUpperCase() + dayWord.slice(1) + ' um ' + spokenTime(occ.start) + ' hast du einen Termin.';
    }

    /* ---------- the timetable (Untis, HTML/svp/plandaten/w*.json) ---------- */

    const LESSON_MERGE_MIN = 20;   // the same class in the same room again after a short break is one block (as bruecke.mjs)

    /* Untis lessons of one week file -> blocks for calendar_lesson:
       [{ day, starts_at, ends_at, subject, classes, rooms, code, note }] - double lessons and short breaks merged,
       break duties (no subject) left out. Local times, so TZ must be Europe/Berlin. */
    const untisAt = (date, t) => new Date(Math.floor(date / 10000), Math.floor(date / 100) % 100 - 1, date % 100, Math.floor(t / 100), t % 100);
    function lessonBlocks(lessons) {
        const at = untisAt;
        const rows = (lessons || []).filter(l => l && l.subject && l.date && l.endTime > l.startTime)
            .slice().sort((a, b) => a.date - b.date || a.startTime - b.startTime);
        const out = [];
        let last = null;
        for (const l of rows) {
            const start = at(l.date, l.startTime), end = at(l.date, l.endTime);
            const classes = (l.classes || []).map(String), rooms = (l.rooms || []).map(String);
            const key = [l.date, l.subject, classes.join(','), rooms.join(','), l.code || ''].join('|');
            const note = l.substText || l.lstext || l.info || null;
            if (last && last.key === key && start - last.end <= LESSON_MERGE_MIN * 60000) {
                if (end > last.end) last.end = end;
                if (note && !last.note) last.note = note;
                continue;
            }
            last = { key, start, end, subject: String(l.subject), classes, rooms, code: l.code || null, note };
            out.push(last);
        }
        return out.map(b => ({
            day: ymd(b.start), starts_at: b.start.toISOString(), ends_at: b.end.toISOString(),
            subject: b.subject, classes: b.classes, rooms: b.rooms, code: b.code, note: b.note
        }));
    }

    /* Doc's own Untis appointments (plandaten/termine.json) -> the coaching talks as blocks like lessonBlocks: slots
       one after another become one block, the slots go into the note ("11:45 Max (BGY25) · 12:00 …"). Only the public
       first name (publicWho) goes in, never the full name (Doc, 29.10.2026: first names only leave the Mac). */
    function coachingBlocks(termine) {
        const rows = (termine || []).filter(t => t && /coaching/i.test(t.title || '') && t.date && t.endTime > t.startTime)
            .slice().sort((a, b) => a.date - b.date || a.startTime - b.startTime);
        const out = [];
        let last = null;
        for (const t of rows) {
            const start = untisAt(t.date, t.startTime), end = untisAt(t.date, t.endTime);
            const slot = hhmm(start) + (t.publicWho ? ' ' + t.publicWho : '') + (t.info ? ' (' + t.info + ')' : '');
            if (last && sameDay(last.start, start) && start - last.end <= LESSON_MERGE_MIN * 60000) {
                if (end > last.end) last.end = end;
                last.slots.push(slot);
                if (t.info && !last.classes.includes(String(t.info))) last.classes.push(String(t.info));
                continue;
            }
            last = { start, end, classes: t.info ? [String(t.info)] : [], slots: [slot] };
            out.push(last);
        }
        return out.map(b => ({
            day: ymd(b.start), starts_at: b.start.toISOString(), ends_at: b.end.toISOString(),
            subject: 'Coaching', classes: b.classes, rooms: [], code: null, note: b.slots.join(' · ')
        }));
    }

    /* "Inf · FOG25-1" */
    const lessonTitle = l => l.subject + (l.classes && l.classes.length ? ' · ' + l.classes.join(', ') : '');

    /* the subject as Solita says it */
    function subjectSpoken(s) {
        const t = String(s || '').trim();
        if (/^coaching/i.test(t)) return 'dein Coaching';
        if (/^gk\s*inf/i.test(t)) return 'Informatik-Grundkurs';
        if (/^lk\s*inf/i.test(t)) return 'Informatik-Leistungskurs';
        if (/^inf/i.test(t)) return 'Informatik';
        if (/^ma(t|the)?\b/i.test(t)) return 'Mathe';
        if (/^ph/i.test(t)) return 'Physik';
        return t;
    }
    /* "FOG25-1" -> "FOG 25-1", "KÖ411" -> "KÖ 411": letters and digits apart, so the voice does not spell a word */
    const codeSpoken = s => String(s).replace(/(\p{L})(\d)/gu, '$1 $2');

    /* "In 5 Minuten beginnt Informatik, FOG 25-1, in Raum KÖ 411." - class and room are no private matter;
       the note (coaching: the pupils' first names) is never spoken */
    function lessonSentence(l, start, now) {
        const min = Math.round((start - now) / 60000);
        const when = min <= 0 ? 'Jetzt' : (w => w.charAt(0).toUpperCase() + w.slice(1))(spokenIn(min));
        const cls = (l.classes || []).map(codeSpoken);
        const rooms = (l.rooms || []).map(codeSpoken);
        return when + ' beginnt ' + subjectSpoken(l.subject) +
            (cls.length ? ', ' + cls.join(' und ') : '') +
            (rooms.length ? ', in Raum ' + rooms.join(' und ') : '') + '.';
    }

    return {
        DAY, WD_CODES, DEFAULT_REMIND, DEFAULT_REMIND_ALLDAY,
        WEEKDAY_SHORT, WEEKDAY_LONG, MONTH_LONG, MONTH_SHORT,
        startOfDay, addDays, sameDay, ymd, hhmm, isoWeek,
        parseRule, occurrences, expand, remindOf, reminders,
        parseIcs, unzipIcs, parseQuick,
        spokenSentence, spokenTime, spokenIn,
        lessonBlocks, coachingBlocks, lessonTitle, lessonSentence, subjectSpoken
    };
});
