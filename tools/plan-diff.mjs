#!/usr/bin/env node
/*
 * plan-diff — what changed in the timetable since the last look?
 *
 * The Mac app rewrites HTML/svp/stundenplan-data.json and the weekly files in
 * HTML/svp/plandaten/. Both are out of the repo (personal data), so git cannot
 * answer "did anything move?". This does: it keeps a compact snapshot of every
 * lesson outside the repo and reports the real differences — lessons added or
 * dropped, and rooms, teachers, times or cancellations that changed.
 *
 *   node tools/plan-diff.mjs            report against the last snapshot
 *   node tools/plan-diff.mjs --save     report, then remember the new state
 *   node tools/plan-diff.mjs --init     only remember the current state
 *   node tools/plan-diff.mjs --mine     only lessons of one teacher (default: Doc)
 *   node tools/plan-diff.mjs --json     machine readable, for scripting
 *   node tools/plan-diff.mjs --line     exactly one line, for the "WebUntis holen" app
 *
 * Exit code: 0 = nothing changed, 1 = there are changes, 2 = no snapshot yet.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'HTML', 'svp');
const SNAP = join(homedir(), '.svp-plan-snapshot.json');
const TEACHER = 'AlvMic';

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const MODE = { save: has('--save'), init: has('--init'), mine: has('--mine'), json: has('--json'), line: has('--line') };

/* ---------- reading ---------------------------------------------------- */

/* One line per lesson. The key is what identifies a lesson across exports:
   day, start, classes, subject. Everything that may legitimately change about
   that lesson — room, teacher, end, cancellation — is the value, so a moved
   room shows up as a change and not as "one gone, one new". */
function lessonKey(l) {
    return [l.date, l.startTime, (l.classes || []).join('+'), l.subject || '–'].join('|');
}

function lessonValue(l) {
    return {
        room: (l.rooms || []).join('+'),
        teacher: (l.teachers || []).join('+'),
        end: l.endTime,
        code: l.code || '',
        text: l.substText || l.lstext || ''
    };
}

function sourceFiles() {
    const files = [];
    const single = join(ROOT, 'stundenplan-data.json');
    if (existsSync(single)) files.push(single);
    const weeks = join(ROOT, 'plandaten');
    if (existsSync(weeks)) {
        for (const f of readdirSync(weeks).sort()) {
            if (/^w\d+\.json$/.test(f)) files.push(join(weeks, f));
        }
    }
    return files;
}

function collect() {
    const lessons = {};
    const files = sourceFiles();
    for (const file of files) {
        let data;
        try { data = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { continue; }
        for (const l of data.lessons || []) lessons[lessonKey(l)] = lessonValue(l);
    }
    return { at: new Date().toISOString(), files: files.length, lessons };
}

/* ---------- comparing --------------------------------------------------- */

const FIELDS = { room: 'Raum', teacher: 'Lehrkraft', end: 'Ende', code: 'Status', text: 'Hinweis' };

function compare(before, after) {
    const added = [], dropped = [], changed = [];
    for (const key of Object.keys(after.lessons)) {
        if (!(key in before.lessons)) { added.push({ key, now: after.lessons[key] }); continue; }
        const a = before.lessons[key], b = after.lessons[key];
        const fields = Object.keys(FIELDS).filter((f) => String(a[f]) !== String(b[f]));
        if (fields.length) changed.push({ key, fields, was: a, now: b });
    }
    for (const key of Object.keys(before.lessons)) {
        if (!(key in after.lessons)) dropped.push({ key, was: before.lessons[key] });
    }
    return { added, dropped, changed };
}

/* ---------- rendering --------------------------------------------------- */

const pad = (n) => String(n).padStart(2, '0');
const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function human(key) {
    const [date, start, classes, subject] = key.split('|');
    const y = date.slice(0, 4), m = date.slice(4, 6), d = date.slice(6, 8);
    const day = DAYS[new Date(`${y}-${m}-${d}T12:00:00`).getDay()];
    const t = String(start).padStart(4, '0');
    return `${day} ${d}.${m}. ${t.slice(0, 2)}:${t.slice(2)}  ${subject}  ${classes}`;
}

function mineOnly(list, snap) {
    return list.filter((e) => ((e.now || e.was || {}).teacher || '').includes(TEACHER));
}

function report(diff, before, after) {
    const total = diff.added.length + diff.dropped.length + diff.changed.length;
    if (!total) {
        console.log(`Keine Änderung. ${Object.keys(after.lessons).length} Stunden aus ${after.files} Dateien,`
            + ` verglichen mit dem Stand vom ${new Date(before.at).toLocaleString('de-DE')}.`);
        return;
    }
    console.log(`Stand vorher: ${new Date(before.at).toLocaleString('de-DE')}`);
    console.log(`Jetzt: ${Object.keys(after.lessons).length} Stunden aus ${after.files} Dateien`);
    console.log(`Änderungen: ${diff.added.length} neu, ${diff.dropped.length} entfallen, ${diff.changed.length} geändert\n`);

    const show = (title, list, fmt) => {
        const rows = MODE.mine ? mineOnly(list) : list;
        if (!rows.length) return;
        console.log(`${title} (${rows.length})`);
        for (const e of rows.slice(0, 60)) console.log('  ' + fmt(e));
        if (rows.length > 60) console.log(`  … und ${rows.length - 60} weitere`);
        console.log('');
    };

    show('NEU', diff.added, (e) => `${human(e.key)}  ${e.now.room}  ${e.now.teacher}`
        + (e.now.code ? `  [${e.now.code}]` : ''));
    show('ENTFALLEN', diff.dropped, (e) => `${human(e.key)}  ${e.was.room}  ${e.was.teacher}`);
    show('GEÄNDERT', diff.changed, (e) => `${human(e.key)}  `
        + e.fields.map((f) => `${FIELDS[f]}: ${e.was[f] || '–'} → ${e.now[f] || '–'}`).join(', '));

    /* Docs own lessons are the ones that reach the Stoffverteilungspläne. */
    if (!MODE.mine) {
        const mine = [...mineOnly(diff.added), ...mineOnly(diff.dropped), ...mineOnly(diff.changed)];
        console.log(mine.length
            ? `Davon betreffen ${mine.length} deine eigenen Stunden (${TEACHER}) — mit --mine nur diese.`
            : `Deine eigenen Stunden (${TEACHER}) sind nicht betroffen.`);
    }
}

/* One line, parsed by the "WebUntis holen" app: it colours the result and puts
   it under the progress bar. Keep the two prefixes stable. */
function oneLine(diff) {
    const n = diff.added.length + diff.dropped.length + diff.changed.length;
    if (!n) return 'KEINE ÄNDERUNGEN';
    const mine = mineOnly(diff.added).length + mineOnly(diff.dropped).length + mineOnly(diff.changed).length;
    const parts = [];
    if (diff.added.length) parts.push(diff.added.length + ' neu');
    if (diff.dropped.length) parts.push(diff.dropped.length + ' entfallen');
    if (diff.changed.length) parts.push(diff.changed.length + ' geändert');
    return 'ÄNDERUNGEN: ' + parts.join(', ') + (mine ? ' · ' + mine + ' bei dir' : '');
}

/* ---------- main -------------------------------------------------------- */

function save(state) {
    const tmp = SNAP + '.tmp';
    writeFileSync(tmp, JSON.stringify(state));
    renameSync(tmp, SNAP);          /* atomic: a crash never leaves half a snapshot */
}

const after = collect();
if (!after.files) {
    console.error(`Keine Plandaten gefunden unter ${ROOT} — läuft das Skript im richtigen Repo?`);
    process.exit(2);
}

if (MODE.init || !existsSync(SNAP)) {
    save(after);
    const n = Object.keys(after.lessons).length;
    if (MODE.line) console.log(`ERSTER LAUF: ${n} Stunden gemerkt, Vergleich ab dem nächsten Mal`);
    else if (MODE.init) console.log(`Stand gemerkt: ${n} Stunden aus ${after.files} Dateien.`);
    else console.log(`Noch kein Vergleichsstand vorhanden — ${n} Stunden gemerkt. Beim nächsten Lauf gibt es einen Vergleich.`);
    process.exit(MODE.init ? 0 : 2);
}

const before = JSON.parse(readFileSync(SNAP, 'utf8'));
const diff = compare(before, after);

if (MODE.line) {
    console.log(oneLine(diff));
} else if (MODE.json) {
    console.log(JSON.stringify({ before: before.at, now: after.at, ...diff }, null, 1));
} else {
    report(diff, before, after);
}

if (MODE.save) save(after);
process.exit(diff.added.length + diff.dropped.length + diff.changed.length ? 1 : 0);
