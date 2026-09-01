#!/usr/bin/env node
// WebUntis client for "Private Schule IBB gGmbH" (Dresden).
// Reading uses the public JSON-RPC API; writing the classbook lesson topic
// goes through the mobile API (jsonrpc_intern.do), which is the only one that
// has write methods at all. Writes never overwrite an existing topic unless
// --force is given, so a correction made by hand in WebUntis always wins.
// Credentials are NEVER stored here - they are read at runtime from ~/.webuntis-cred (chmod 600).
// Supports two login methods:
//   A) password  -> classic JSON-RPC authenticate
//   B) app secret -> TOTP login like the official Untis Mobile app (revocable, no password needed)

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const SCHOOL = 'ibb-ggmbh';
const BASE = 'https://ibb-ggmbh.webuntis.com';
const CRED_FILE = path.join(os.homedir(), '.webuntis-cred');

// ---------- credentials ----------

function loadCred() {
  if (!fs.existsSync(CRED_FILE)) {
    console.error(`Missing ${CRED_FILE}. Create it (chmod 600) with WEBUNTIS_USER and either WEBUNTIS_PASS or WEBUNTIS_SECRET.`);
    process.exit(2);
  }
  const mode = fs.statSync(CRED_FILE).mode & 0o777;
  if (mode & 0o077) console.error(`Warning: ${CRED_FILE} is readable by others (mode ${mode.toString(8)}). Run: chmod 600 ${CRED_FILE}`);
  const cred = {};
  for (const line of fs.readFileSync(CRED_FILE, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) cred[m[1]] = m[2];
  }
  if (!cred.WEBUNTIS_USER) { console.error('WEBUNTIS_USER missing in cred file.'); process.exit(2); }
  return cred;
}

// ---------- TOTP (RFC 6238, HMAC-SHA1, 30s step) for the app-secret login ----------

function base32Decode(s) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of s.toUpperCase().replace(/[=\s]/g, '')) {
    const i = A.indexOf(c);
    if (i < 0) continue;
    bits += i.toString(2).padStart(5, '0');
  }
  const out = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(out);
}

function totp(secret, timeMs) {
  const counter = Math.floor(timeMs / 1000 / 30);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(buf).digest();
  const off = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[off] & 0x7f) << 24 | hmac[off + 1] << 16 | hmac[off + 2] << 8 | hmac[off + 3]) % 1000000;
  return code;
}

// ---------- transport ----------

let cookies = '';

async function post(url, body, raw) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookies ? { Cookie: cookies } : {}) },
    body: JSON.stringify(body),
  });
  const setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of setCookie) {
    const kv = c.split(';')[0];
    if (/^(JSESSIONID|schoolname|traceId)=/.test(kv)) cookies = cookies ? `${cookies}; ${kv}` : kv;
  }
  const json = await res.json();
  if (raw) return json;                 // caller inspects error/result itself
  if (json.error) throw new Error(`${json.error.message} (code ${json.error.code})`);
  return json.result;
}

async function rpc(method, params) {
  return post(`${BASE}/WebUntis/jsonrpc.do?school=${SCHOOL}`, { id: 'r', method, params: params ?? {}, jsonrpc: '2.0' });
}

// ---------- mobile API (jsonrpc_intern.do) - the only one that can write ----------
// Every intern call carries its own fresh TOTP; the server rejects a clientTime
// that drifts, so we keep the offset measured at login.
let drift = 0, secret = '', user = '';

function internAuth() {
  const now = Date.now() + drift;
  return { clientTime: now, user, otp: totp(secret, now) };
}

async function intern(method, params) {
  if (!secret) { console.error(`${method} braucht den App-Schluessel-Login (WEBUNTIS_SECRET).`); process.exit(1); }
  const json = await post(`${BASE}/WebUntis/jsonrpc_intern.do?m=${method}&school=${SCHOOL}&v=i2.2`,
    { id: 'i', method, params: [{ auth: internAuth(), ...params }], jsonrpc: '2.0' }, true);
  return json;
}

// Write the classbook lesson topic of one period.
// The id field is called ttId here (periodId gives "period 0 not found") and
// lessonTopic is a flat string - a nested object trips the server's parser.
async function writeTopic(ttId, text) {
  const r = await intern('submitLessonTopic', { ttId, lessonTopic: text });
  if (r.error) throw new Error(`${r.error.message} (code ${r.error.code})`);
  return r.result;
}

// Read back what is actually stored. getLessonTopic2017 only returns previous
// topics as suggestions, so the real state comes from getPeriodData2017.
async function readTopics(ttIds) {
  const out = {};
  for (let i = 0; i < ttIds.length; i += 50) {
    const r = await intern('getPeriodData2017', { ttIds: ttIds.slice(i, i + 50) });
    if (r.error) throw new Error(`${r.error.message} (code ${r.error.code})`);
    for (const [id, d] of Object.entries(r.result?.dataByTTId || {})) out[id] = (d.topic?.text || '');
  }
  return out;
}

// ---------- login ----------

async function login(cred) {
  if (cred.WEBUNTIS_SECRET) {
    // App-secret login: server rejects a clientTime that drifts, so use its own clock.
    const probe = await fetch(`${BASE}/WebUntis/jsonrpc_intern.do?m=getUserData2017&school=${SCHOOL}&v=i2.2`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 't', method: 'getUserData2017', params: [{ auth: { clientTime: 0, user: cred.WEBUNTIS_USER, otp: 0 } }], jsonrpc: '2.0' }),
    }).then(r => r.json());
    const now = probe?.error?.data?.serverTime ?? Date.now();
    const result = await post(`${BASE}/WebUntis/jsonrpc_intern.do?m=getUserData2017&school=${SCHOOL}&v=i2.2`, {
      id: 'a', method: 'getUserData2017',
      params: [{ auth: { clientTime: now, user: cred.WEBUNTIS_USER, otp: totp(cred.WEBUNTIS_SECRET, now) } }],
      jsonrpc: '2.0',
    });
    const sn = `schoolname="${Buffer.from('_' + SCHOOL).toString('base64')}"`;
    cookies = cookies ? `${cookies}; ${sn}` : sn;
    drift = now - Date.now();
    secret = cred.WEBUNTIS_SECRET;
    user = cred.WEBUNTIS_USER;
    return { mode: 'secret', user: result.userData, masterData: result.masterData };
  }
  if (!cred.WEBUNTIS_PASS) { console.error('Neither WEBUNTIS_PASS nor WEBUNTIS_SECRET set.'); process.exit(2); }
  const r = await rpc('authenticate', { user: cred.WEBUNTIS_USER, password: cred.WEBUNTIS_PASS, client: 'docalvers-read' });
  cookies = `JSESSIONID=${r.sessionId}; schoolname="${Buffer.from('_' + SCHOOL).toString('base64')}"`;
  return { mode: 'password', user: r };
}

// ---------- read-only commands ----------

function ymd(d) { return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`; }
function parseYmd(s) { const t = String(s); return new Date(+t.slice(0, 4), +t.slice(4, 6) - 1, +t.slice(6, 8)); }
function hhmm(t) { return String(t).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'); }

// ---------- Stoffverteilungsplan (SVP) ----------
// Which lessons belong to which plan page. Kept in a file so a new course only
// needs an entry there, not a code change. Subject AND class have to match:
// Doc teaches several subjects in the same class, and a Literatur lesson must
// not be filled with the Informatik plan.
const MAP_FILE = path.join(__dirname, 'webuntis-svp-map.json');
const REPO = path.join(__dirname, '..');

function loadMap() {
  if (!fs.existsSync(MAP_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  return (raw.pages || []).map(e => ({
    page: e.page,
    subject: String(e.subject || '').toLowerCase(),
    classes: new Set(e.classes || []),
  }));
}

// The plan page for one lesson, or null when nothing is mapped for it.
function pageFor(lesson, pages) {
  const subject = String(lesson.subject || '').toLowerCase();
  const hit = pages.find(p => p.subject === subject && lesson.klassen.some(k => p.classes.has(k)));
  return hit ? hit.page : null;
}

// ISO week number - the plan rows are keyed by kw, which is far more robust
// than parsing "24.-28.08.26" date strings.
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - jan1) / 86400000 + 1) / 7);
}

// Pull "window.PLAN = [ ... ];" and "window.BADGE = { ... };" out of a plan
// page by bracket counting, then evaluate just that literal.
function extractLiteral(src, name, open, close) {
  const at = src.indexOf('window.' + name);
  if (at < 0) return null;
  const start = src.indexOf(open, at);
  if (start < 0) return null;
  let depth = 0, inStr = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close && --depth === 0) {
      return new Function('return ' + src.slice(start, i + 1))();
    }
  }
  return null;
}

// The published plan state: the HTML is only the base - once a page has been
// edited, a complete copy of every row lives in Supabase and masks it.
async function loadPlan(pageRel) {
  const file = path.join(REPO, pageRel);
  const src = fs.readFileSync(file, 'utf8');
  const rows = extractLiteral(src, 'PLAN', '[', ']') || [];
  const badge = extractLiteral(src, 'BADGE', '{', '}') || {};
  const pagePath = '/' + pageRel.replace(/^HTML\//, '');
  let overrides = {}, ts = null;
  try {
    const authSrc = fs.readFileSync(path.join(REPO, 'HTML/svp/svp-auth.js'), 'utf8');
    const key = (authSrc.match(/'(sb_publishable_[^']+)'/) || [])[1];
    const url = (authSrc.match(/DB_URL\s*=\s*'([^']+)'/) || [])[1];
    if (key && url) {
      const res = await fetch(`${url}/rest/v1/svp_plan_edits?page=eq.${encodeURIComponent(pagePath)}&select=edits,ts`,
        { headers: { apikey: key, Authorization: 'Bearer ' + key } });
      if (res.ok) { const j = await res.json(); if (j.length) { overrides = j[0].edits || {}; ts = j[0].ts; } }
    }
  } catch (e) { console.error('  (Overrides nicht erreichbar: ' + e.message + ')'); }
  const merged = rows.map((r, i) => ({ ...r, ...(overrides[String(i)] || {}) }));
  /* Seiten im Termin-Modus (Blockunterricht) binden ihre Zeilen NICHT an die
     Kalenderwoche - siehe svp-plan.js. Dieses Kommando kann das (noch) nicht,
     also fasst es sie gar nicht erst an, statt die falsche Zeile zu schreiben. */
  const termin = /window\.UNTIS_TERMIN\s*=\s*true/.test(src);
  return { rows: merged, badge, overrideTs: ts, pagePath, termin };
}

// One line for the classbook: topic, Lernbereich, Ustd. and the planned steps,
// capped at 250 chars WITHOUT mutilating anything. Three stages, each only when
// the previous one did not fit, so as little as possible is lost:
//   1. the full text, spelled out
//   2. abbreviations (Wiederholung -> Wdh.) - costs readability, not content
//   3. drop WHOLE steps from the end, a trailing " ..." says more would follow
// A plain slice(250) used to cut mid-word.
// Must stay character-identical to untisTopicText()/untisFit() in
// HTML/svp/svp-plan.js - otherwise each side thinks the other's text is a hand
// correction and the overwrite protection fires for nothing. That is also why
// the abbreviation table is NOT duplicated here but read out of svp-plan.js:
// one list, one behaviour.
const TOPIC_MAX = 250;
const ABBREV_SRC = path.join(REPO, 'HTML/svp/svp-plan.js');

let abbrevRules = null;
function abbrevate(t) {
  if (!abbrevRules) {
    const table = extractLiteral(fs.readFileSync(ABBREV_SRC, 'utf8'), 'SVP_ABBREV', '[', ']') || [];
    abbrevRules = table
      .slice()
      .sort((a, b) => b[0].length - a[0].length)
      .map(([long, short]) => [
        // whole words only - \b knows ASCII only and "Ueberblick" starts with a non-word char
        new RegExp('(?<!\\p{L})' + long.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?!\\p{L})', 'gu'),
        short,
      ]);
  }
  for (const [re, short] of abbrevRules) t = t.replace(re, short);
  return t;
}

function fitTopic(base, details) {
  const build = (b, d, n) => (n ? `${b}: ${d.slice(0, n).join(' \u00b7 ')}` : b);

  const full = build(base, details, details.length);
  if (full.length <= TOPIC_MAX) return full;                    // 1

  const aBase = abbrevate(base), aDet = details.map(abbrevate);
  const aFull = build(aBase, aDet, aDet.length);
  if (aFull.length <= TOPIC_MAX) return aFull;                  // 2

  let t = aBase, used = 0;                                      // 3
  for (let k = 0; k < aDet.length; k++) {
    const cand = build(aBase, aDet, k + 1);
    if (cand.length > TOPIC_MAX) break;
    t = cand; used = k + 1;
  }
  if (used < aDet.length) t += ' \u2026';
  if (t.length > TOPIC_MAX) {                 // safety net: the topic alone is too long
    t = t.slice(0, TOPIC_MAX - 2);
    t = t.slice(0, Math.max(t.lastIndexOf(' '), 1)).trim() + ' \u2026';
  }
  return t;
}

function topicText(row, badge) {
  const lb = (badge[row.type] || [])[1];
  const head = [lb, row.u].filter(Boolean).join(', ');
  const base = `${row.topic || ''}${head ? ` (${head})` : ''}`.replace(/\s+/g, ' ').trim();
  const details = (row.details || []).filter(Boolean).map(d => String(d).replace(/\s+/g, ' ').trim());
  return fitTopic(base, details);
}

// My lessons on a day / in a range, with the ttId needed for writing.
async function myLessons(from, to, session) {
  const ELEM_TYPE = { CLASS: 1, KLASSE: 1, TEACHER: 2, SUBJECT: 3, ROOM: 4, STUDENT: 5 };
  const id = session.user?.elemId ?? session.user?.personId;
  const rawType = session.user?.elemType ?? session.user?.personType ?? 2;
  const type = typeof rawType === 'string' ? (ELEM_TYPE[rawType.toUpperCase()] ?? 2) : rawType;
  const tt = await rpc('getTimetable', { options: {
    element: { id, type }, startDate: Number(from), endDate: Number(to),
    klasseFields: ['id', 'name'], subjectFields: ['id', 'name'], roomFields: ['id', 'name'],
  } });
  return (tt || [])
    .filter(l => (l.kl || []).length && l.su?.[0])
    .map(l => ({ ttId: l.id, date: String(l.date), start: hhmm(l.startTime),
                 subject: l.su[0].name, klassen: l.kl.map(k => k.name), code: l.code || '' }))
    .sort((a, b) => a.date - b.date || a.start.localeCompare(b.start));
}

// Regenerate the <plan>.untis.json files the SVP badges read. Runs as its own
// command and automatically after 'plan' wrote something, so the badges never
// show a state older than the last write.
async function runStatus(session) {
  const pages = loadMap();
  const years = await rpc('getSchoolyears');
  const today = Number(ymd(new Date()));
  const year = years.find(y => Number(y.startDate) <= today && Number(y.endDate) >= today) || years[years.length - 1];
  console.log(`Schuljahr ${year.name}: ${year.startDate}..${year.endDate}`);
  const lessons = (await myLessons(year.startDate, year.endDate, session))
    .filter(l => pageFor(l, pages));
  const topics = await readTopics(lessons.map(l => l.ttId));
  const byPage = {};
  for (const l of lessons) {
    const page = pageFor(l, pages);
    const kw = String(isoWeek(parseYmd(l.date)));
    const b = (byPage[page] ||= { weeks: {} });
    (b.weeks[kw] ||= []).push({
      date: l.date, start: l.start, klasse: l.klassen.join(','), subject: l.subject || '',
      written: !!(topics[String(l.ttId)] || '').trim(),
      text: topics[String(l.ttId)] || '',
    });
  }
  const mapIndex = [];
  for (const [page, data] of Object.entries(byPage)) {
    const out = path.join(REPO, page.replace(/\.html$/, '.untis.json'));
    /* e.klasse is the display name of a lesson and joins coupled classes
       ("BGY26-1,BGY26-2"). The page matches this list against single class
       names, so split it again - otherwise a course whose lessons are all
       coupled matches nothing and the dialog says "Keine passende Stunde". */
    const classes = [...new Set(Object.values(data.weeks).flat()
      .flatMap(e => e.klasse.split(',')).map(s => s.trim()).filter(Boolean))].sort();
    /* The dialog fetches the week LIVE and has to narrow it down itself. Class
       alone is not enough: Doc teaches Mat and Inf in BGY26-1/2, so the Mathe
       page was offering his Informatik lessons as well (Doc, 31.08.2026). */
    const subjects = [...new Set(Object.values(data.weeks).flat()
      .map(e => e.subject).filter(Boolean))].sort();
    const n = Object.values(data.weeks).flat().length;
    const done = Object.values(data.weeks).flat().filter(e => e.written).length;
    fs.writeFileSync(out, JSON.stringify({
      generated: new Date().toISOString(), page: '/' + page.replace(/^HTML\//, ''),
      webuntis: `${BASE}/WebUntis/?school=${SCHOOL}#/basic/mytimetable`,
      classes, subjects, weeks: data.weeks,
    }, null, 1));
    console.log(`${path.relative(REPO, out)}: ${done}/${n} Stunden eingetragen, ${Object.keys(data.weeks).length} Wochen`);
    mapIndex.push({ page: '/' + page.replace(/^HTML\//, ''), classes, subjects });
  }

  /* Kleiner Index fuer stundenplan.html: welche Stunde gehoert zu welchem
     Stoffverteilungsplan. Der Browser kommt an tools/webuntis-svp-map.json
     nicht heran (liegt ausserhalb des Web-Roots), und plandaten/ ist
     gitignored - deshalb hier, neben den Planseiten. Erzeugt, nicht gepflegt:
     die eine Quelle bleibt webuntis-svp-map.json. */
  if (mapIndex.length) {
    const mapOut = path.join(REPO, 'HTML', 'svp', 'svp-map.json');
    fs.writeFileSync(mapOut, JSON.stringify({
      generated: new Date().toISOString(), pages: mapIndex.sort((a, b) => a.page.localeCompare(b.page)),
    }, null, 1));
    console.log(`${path.relative(REPO, mapOut)}: ${mapIndex.length} Planseiten`);
  }
  if (!Object.keys(byPage).length) console.log('Keine Stunde passt zu einer Planseite - webuntis-svp-map.json pruefen.');
}

async function main() {
  const cmd = process.argv[2] || 'whoami';
  const cred = loadCred();
  const session = await login(cred);

  if (cmd === 'whoami') {
    console.log(`Logged in via ${session.mode}:`, JSON.stringify(session.user, null, 2).slice(0, 1200));
    return;
  }
  if (cmd === 'timetable') {
    const from = process.argv[3] || ymd(new Date());
    const to = process.argv[4] || from;
    // The secret login returns elemType as a string ("TEACHER"), the password login as a number.
    const ELEM_TYPE = { CLASS: 1, KLASSE: 1, TEACHER: 2, SUBJECT: 3, ROOM: 4, STUDENT: 5 };
    const id = session.user?.elemId ?? session.user?.personId;
    const rawType = session.user?.elemType ?? session.user?.personType ?? 2;
    const type = typeof rawType === 'string' ? (ELEM_TYPE[rawType.toUpperCase()] ?? 2) : rawType;
    const tt = await rpc('getTimetable', { options: {
      element: { id, type }, startDate: Number(from), endDate: Number(to),
      showLsText: true, showStudentgroup: true, showInfo: true, showSubstText: true,
      klasseFields: ['id', 'name'], subjectFields: ['id', 'name'], teacherFields: ['id', 'name'], roomFields: ['id', 'name'],
    } });
    tt.sort((a, b) => a.date - b.date || a.startTime - b.startTime);
    for (const l of tt) {
      const s = l.su?.[0]?.name ?? '?', k = (l.kl ?? []).map(x => x.name).join(','), r = (l.ro ?? []).map(x => x.name).join(',');
      console.log(`${l.date}  ${hhmm(l.startTime)}-${hhmm(l.endTime)}  ${s.padEnd(12)} ${k.padEnd(14)} ${r}${l.code ? '  [' + l.code + ']' : ''}`);
    }
    console.log(`\n${tt.length} lessons ${from}..${to}`);
    return;
  }
  if (cmd === 'dump') {
    // Ad-hoc one-week export. NOTE: this does NOT feed HTML/svp/stundenplan.html
    // any more - that page reads plandaten/, which "year" writes. The default
    // target below stays stundenplan-data.json on purpose: dumping into
    // plandaten/ would replace a full week (every class) with whatever scope
    // was asked for, so "dump me" would silently shrink the plan to 25 lessons.
    // "me" = own timetable, "all" = every class (that is how the full school plan
    // becomes visible - getTeachers is denied for teacher accounts, class
    // timetables are not and carry the teacher short names).
    const scope = process.argv[3] || 'me';
    // Default range: the Monday..Friday of the week the given day falls into.
    const anchor = process.argv[4] ? parseYmd(process.argv[4]) : new Date();
    const monday = new Date(anchor);
    monday.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const from = Number(process.argv[4] && process.argv[5] ? process.argv[4] : ymd(monday));
    const to = Number(process.argv[5] || ymd(friday));
    const out = process.argv[6] || path.join(__dirname, '..', 'HTML', 'svp', 'stundenplan-data.json');

    const ELEM_TYPE = { CLASS: 1, KLASSE: 1, TEACHER: 2, SUBJECT: 3, ROOM: 4, STUDENT: 5 };
    const rawType = session.user?.elemType ?? session.user?.personType ?? 2;
    const myType = typeof rawType === 'string' ? (ELEM_TYPE[rawType.toUpperCase()] ?? 2) : rawType;
    const myId = session.user?.elemId ?? session.user?.personId;

    const fields = { showLsText: true, showStudentgroup: true, showInfo: true, showSubstText: true,
      klasseFields: ['id', 'name'], subjectFields: ['id', 'name'], teacherFields: ['id', 'name'], roomFields: ['id', 'name'] };
    const norm = l => ({
      date: l.date, startTime: l.startTime, endTime: l.endTime,
      subject: l.su?.[0]?.name ?? null, subjectId: l.su?.[0]?.id ?? null,
      classes: (l.kl ?? []).map(x => x.name), classIds: (l.kl ?? []).map(x => x.id),
      rooms: (l.ro ?? []).map(x => x.name), teachers: (l.te ?? []).map(x => x.name).filter(n => n && n !== '---'),
      code: l.code ?? null, lstext: l.lstext || null, info: l.info || null, substText: l.substText || null,
      studentGroup: l.sg || null, lsnumber: l.lsnumber ?? null,
    });

    const timegrid = await rpc('getTimegridUnits');
    let lessons = [];
    if (scope === 'all') {
      const classes = await rpc('getKlassen');
      const seen = new Set();
      for (let i = 0; i < classes.length; i++) {
        const k = classes[i];
        process.stderr.write(`\r  ${i + 1}/${classes.length}  ${k.name.padEnd(12)}`);
        try {
          for (const l of await rpc('getTimetable', { options: { element: { id: k.id, type: 1 }, startDate: from, endDate: to, ...fields } })) {
            // The same lesson shows up in every class that attends it - dedupe by lesson id + slot.
            const key = `${l.id ?? l.lsnumber}|${l.date}|${l.startTime}`;
            if (seen.has(key)) continue;
            seen.add(key);
            lessons.push(norm(l));
          }
        } catch (e) { process.stderr.write(`  [${k.name}: ${e.message}]\n`); }
        await new Promise(r => setTimeout(r, 120)); // be gentle on the school server
      }
      process.stderr.write('\r' + ' '.repeat(40) + '\r');
    } else {
      lessons = (await rpc('getTimetable', { options: { element: { id: myId, type: myType }, startDate: from, endDate: to, ...fields } })).map(norm);
    }
    lessons.sort((a, b) => a.date - b.date || a.startTime - b.startTime);

    const data = { school: session.user?.schoolName ?? SCHOOL, scope, teacher: session.user?.displayName ?? null,
      week: { from, to }, timegrid, lessons, generatedAt: new Date().toISOString() };
    fs.writeFileSync(out, JSON.stringify(data, null, 1));
    console.log(`${lessons.length} Stunden -> ${out}`);
    if (out.endsWith('stundenplan-data.json'))
      console.log('Hinweis: stundenplan.html liest das NICHT. Fuer die Seite: node tools/webuntis.js year');
    return;
  }
  if (cmd === 'year') {
    // Pull the whole school year in one request per class (the server happily
    // returns 12 months at once), then write one file per calendar week plus an
    // index. The page loads a single week, not the whole year.
    const outDir = process.argv[3] || path.join(__dirname, '..', 'HTML', 'svp', 'plandaten');
    fs.mkdirSync(outDir, { recursive: true });

    const years = await rpc('getSchoolyears');
    const today = Number(ymd(new Date()));
    const sy = years.find(y => y.startDate <= today && today <= y.endDate) || years[years.length - 1];
    console.log(`Schuljahr ${sy.name}: ${sy.startDate} – ${sy.endDate}`);

    const fields = { showLsText: true, showStudentgroup: true, showInfo: true, showSubstText: true,
      klasseFields: ['id', 'name'], subjectFields: ['id', 'name'], teacherFields: ['id', 'name'], roomFields: ['id', 'name'] };
    const norm = l => ({
      date: l.date, startTime: l.startTime, endTime: l.endTime,
      subject: l.su?.[0]?.name ?? null,
      classes: (l.kl ?? []).map(x => x.name),
      rooms: (l.ro ?? []).map(x => x.name),
      teachers: (l.te ?? []).map(x => x.name).filter(n => n && n !== '---'),
      code: l.code ?? null, lstext: l.lstext || null, info: l.info || null, substText: l.substText || null,
    });

    const classes = await rpc('getKlassen');
    const timegrid = await rpc('getTimegridUnits');
    const holidays = await rpc('getHolidays');
    const seen = new Set();
    const byWeek = new Map();
    let total = 0;

    for (let i = 0; i < classes.length; i++) {
      const k = classes[i];
      process.stderr.write(`\r  ${i + 1}/${classes.length}  ${k.name.padEnd(12)}`);
      try {
        const tt = await rpc('getTimetable', { options: { element: { id: k.id, type: 1 }, startDate: sy.startDate, endDate: sy.endDate, ...fields } });
        for (const l of tt) {
          // A lesson attended by several classes comes back once per class.
          const key = `${l.id ?? l.lsnumber}|${l.date}|${l.startTime}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const monday = parseYmd(l.date);
          monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
          const wk = ymd(monday);
          if (!byWeek.has(wk)) byWeek.set(wk, []);
          byWeek.get(wk).push(norm(l));
          total++;
        }
      } catch (e) { process.stderr.write(`  [${k.name}: ${e.message}]\n`); }
      await new Promise(r => setTimeout(r, 150)); // be gentle on the school server
    }
    process.stderr.write('\r' + ' '.repeat(44) + '\r');

    const weeks = [...byWeek.keys()].sort();
    for (const wk of weeks) {
      const lessons = byWeek.get(wk).sort((a, b) => a.date - b.date || a.startTime - b.startTime);
      const monday = parseYmd(wk);
      const friday = new Date(monday); friday.setDate(monday.getDate() + 4);
      fs.writeFileSync(path.join(outDir, `w${wk}.json`),
        JSON.stringify({ scope: 'all', week: { from: Number(wk), to: Number(ymd(friday)) }, timegrid, lessons }));
    }

    const teachers = {};
    for (const list of byWeek.values()) for (const l of list) for (const n of l.teachers) teachers[n] = (teachers[n] || 0) + 1;
    const names = {};
    for (const t of session.masterData?.teachers || []) {
      const full = [t.lastName, t.firstName].filter(Boolean).join(', ');
      if (t.name && full) names[t.name] = full;
    }
    fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify({
      school: session.user?.schoolName ?? SCHOOL, teacher: session.user?.displayName ?? null, names,
      schoolyear: { name: sy.name, from: sy.startDate, to: sy.endDate },
      weeks, timegrid, holidays,
      teachers: Object.keys(teachers).sort((a, b) => a.localeCompare(b, 'de')).map(n => ({ name: n, lessons: teachers[n] })),
      totalLessons: total, generatedAt: new Date().toISOString(),
    }, null, 1));

    const mb = weeks.reduce((s, w) => s + fs.statSync(path.join(outDir, `w${w}.json`)).size, 0) / 1048576;
    console.log(`${total} Stunden, ${weeks.length} Wochen, ${Object.keys(teachers).length} Lehrkräfte -> ${outDir} (${mb.toFixed(1)} MB)`);
    return;
  }
  if (cmd === 'names') {
    // Full teacher names. getTeachers is denied for teacher accounts, but the
    // app master data (secret login) lists every teacher with first/last name.
    if (!session.masterData) { console.error('names braucht den App-Schlüssel-Login (WEBUNTIS_SECRET).'); process.exit(1); }
    const outDir = process.argv[3] || path.join(__dirname, '..', 'HTML', 'svp', 'plandaten');
    const idxFile = path.join(outDir, 'index.json');
    const names = {};
    for (const t of session.masterData.teachers || []) {
      const full = [t.lastName, t.firstName].filter(Boolean).join(', ');
      if (t.name && full) names[t.name] = full;
    }
    if (fs.existsSync(idxFile)) {
      const idx = JSON.parse(fs.readFileSync(idxFile, 'utf8'));
      idx.names = names;
      fs.writeFileSync(idxFile, JSON.stringify(idx, null, 1));
      const known = idx.teachers.filter(t => names[t.name]).length;
      console.log(`${Object.keys(names).length} Namen -> ${idxFile} (${known} von ${idx.teachers.length} Kürzeln im Plan aufgelöst)`);
    } else {
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'namen.json'), JSON.stringify(names, null, 1));
      console.log(`${Object.keys(names).length} Namen -> namen.json (kein index.json gefunden)`);
    }
    return;
  }
  if (cmd === 'read') {
    const ids = process.argv.slice(3).map(Number).filter(Boolean);
    console.log(JSON.stringify(await readTopics(ids), null, 1));
    return;
  }

  if (cmd === 'topic') {
    // Raw write: webuntis.js topic <ttId> "<Text>"
    const ttId = Number(process.argv[3]);
    const text = process.argv[4];
    if (!ttId || text == null) { console.error('Aufruf: webuntis.js topic <ttId> "<Text>"'); process.exit(2); }
    await writeTopic(ttId, text);
    const back = await readTopics([ttId]);
    console.log(`${ttId}: ${JSON.stringify(back[String(ttId)])}`);
    return;
  }

  if (cmd === 'plan') {
    // Carry the SVP over into the classbook: webuntis.js plan [YYYYMMDD] [--dry] [--force]
    const args = process.argv.slice(3);
    const dry = args.includes('--dry');
    const force = args.includes('--force');
    const day = args.find(a => /^\d{8}$/.test(a)) || ymd(new Date());
    const pages = loadMap();
    const lessons = await myLessons(day, day, session);
    if (!lessons.length) { console.log(`Keine Stunden am ${day}.`); return; }
    const plans = {};   // page -> loaded plan, one fetch per page
    const unmapped = new Set();
    let written = 0;
    for (const l of lessons) {
      const page = pageFor(l, pages);
      if (!page) { unmapped.add(`${l.subject} ${l.klassen.join(',')}`); continue; }
      if (!plans[page]) plans[page] = await loadPlan(page);
      const { rows, badge, termin } = plans[page];
      if (termin) {
        if (!plans[page]._warned) {
          console.log(`${page}: Termin-Modus (Blockunterricht) - hier bitte den WebUntis-Knopf auf der Planseite benutzen, die Kalenderwoche trifft die falsche Zeile.`);
          plans[page]._warned = true;
        }
        continue;
      }
      const kw = isoWeek(parseYmd(l.date));
      const row = rows.find(r => !r.ferien && Number(r.kw) === kw);
      const label = `${l.date} ${l.start} ${l.subject} ${l.klassen.join(',')}`;
      if (!row) { console.log(`${label}: keine Planzeile fuer KW ${kw} in ${page}`); continue; }
      const text = topicText(row, badge);
      if (!text) { console.log(`${label}: Planzeile KW ${kw} hat kein Thema`); continue; }
      const current = (await readTopics([l.ttId]))[String(l.ttId)] || '';
      if (current && current !== text && !force) {
        console.log(`${label}: STEHT SCHON ANDERS DRIN, nicht angefasst (--force ueberschreibt)`);
        console.log(`    ist:  ${current}`);
        console.log(`    waer: ${text}`);
        continue;
      }
      if (current === text) { console.log(`${label}: schon eingetragen`); continue; }
      if (dry) { console.log(`${label}: WUERDE schreiben -> ${text}`); continue; }
      await writeTopic(l.ttId, text);
      const back = (await readTopics([l.ttId]))[String(l.ttId)] || '';
      if (back === text) written++;
      console.log(`${label}: ${back === text ? 'eingetragen' : 'FEHLER, Rueckgelesenes weicht ab'} -> ${back}`);
    }
    if (unmapped.size) console.log(`Ohne Planseite (in ${path.basename(MAP_FILE)} nachtragen): ${[...unmapped].join(', ')}`);
    if (written) { console.log('Badge-Daten aktualisieren:'); await runStatus(session); }
    return;
  }

  if (cmd === 'status') { await runStatus(session); return; }

  const map = { klassen: 'getKlassen', subjects: 'getSubjects', teachers: 'getTeachers', rooms: 'getRooms', timegrid: 'getTimegridUnits', holidays: 'getHolidays', years: 'getSchoolyears' };
  if (map[cmd]) { console.log(JSON.stringify(await rpc(map[cmd]), null, 2)); return; }
  console.error(`Unknown command "${cmd}". Try: whoami | timetable [VON] [BIS] | topic <ttId> "<Text>" | plan [YYYYMMDD] [--dry] [--force] | status | ${Object.keys(map).join(' | ')}`);
  process.exit(1);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => { if (cookies) rpc('logout').catch(() => {}); });
