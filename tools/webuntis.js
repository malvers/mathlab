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

// "Anwesenheit kontrolliert" - the tick means "I looked who is missing", so it only ever rides on
// Doc's own click (Eintragen in "WebUntis holen", `plan`, `anwesenheit`), never on a dry run
// (Doc, 09.09.2026: "klar! an Eintragen"). Since 14.09.2026 it concerns EVERY own lesson that has
// begun and was not cancelled, no matter who wrote the topic - before, a lesson filled through the
// SVP dialog never got it and the app offered no button (Doc: "Freitag NICHT gesetzt").
// READING, measured 14.09.2026 - the web UI's own "Offene Stunden" list:
//   POST /WebUntis/api/rest/view/v1/classreg/open-periods   (Bearer JWT from /api/token/new)
//   {teacherId, filter:"ABSENCE_OPEN", dateRange:{start,end}} -> periods[] with period.id (= ttId),
//   absCheckNeeded, absChecked - no student field in sight, so getPeriodData2017 stays switched off.
// WRITING, measured 14.09.2026: submitAbsencesChecked2017 (same shape as BetterUntis'
// postAbsencesChecked) answers {} on this server but CHANGES NOTHING. What works is what the web
// UI's button does - the legacy class register form:
//   POST /WebUntis/classregpage.do?ttid=X   reload=0, ttid=X, _csrf, absencechecked=absencechecked
// The CSRF token is session-wide and sits as "csrfToken" in the EMPTY embedded.do shell, so the
// class register page itself (it carries the student list) is never loaded. The answer is a tiny
// {args, method, success, onSuccessCall}. One POST ticks the whole block (double lesson), so the
// open list is re-read after every send and a ticked partner is skipped. Every tick is read back;
// one that did not stick is reported as failed, never as done.
async function openAbsencePeriods(session, from, to) {
  const iso = d => `${String(d).slice(0, 4)}-${String(d).slice(4, 6)}-${String(d).slice(6, 8)}`;
  const jwt = (await (await fetch(`${BASE}/WebUntis/api/token/new`, { headers: { Cookie: cookies } })).text()).trim();
  const res = await fetch(`${BASE}/WebUntis/api/rest/view/v1/classreg/open-periods`, {
    method: 'POST',
    headers: { Cookie: cookies, Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ teacherId: session.user?.elemId, filter: 'ABSENCE_OPEN', dateRange: { start: iso(from), end: iso(to) } }),
  });
  const text = await res.text();
  // Belt and braces, as in readTopic: should this list ever carry student data, stop.
  if (/"(referencedStudents|students|studentIds|stAbsences)"/.test(text)) throw new Error('Unerwartete Schuelerdaten in open-periods - Abbruch.');
  if (!res.ok) throw new Error(`open-periods HTTP ${res.status}`);
  return new Set((JSON.parse(text).periods || []).filter(p => p.absCheckNeeded && !p.absChecked).map(p => String(p.period.id)));
}

async function markAbsencesChecked(session, lessons) {
  if (!lessons.length) return;
  const shellRes = await fetch(`${BASE}/WebUntis/embedded.do?isEmbeddedInModal=true`, { headers: { Cookie: cookies } });
  for (const c of (shellRes.headers.getSetCookie ? shellRes.headers.getSetCookie() : [])) cookies += '; ' + c.split(';')[0];
  const csrf = ((await shellRes.text()).match(/"csrfToken":"([^"]+)"/) || [])[1];
  if (!csrf) throw new Error('csrfToken nicht gefunden (embedded.do)');
  const dates = lessons.map(l => l.date).sort();
  let open = await openAbsencePeriods(session, dates[0], dates[dates.length - 1]);
  for (const l of lessons) {
    if (!open.has(String(l.ttId))) continue;              // already ticked, e.g. with its block partner
    const res = await fetch(`${BASE}/WebUntis/classregpage.do?ttid=${l.ttId}`, {
      method: 'POST',
      headers: { Cookie: cookies, 'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'X-CSRF-TOKEN': csrf },
      body: new URLSearchParams({ reload: '0', ttid: String(l.ttId), _csrf: csrf, absencechecked: 'absencechecked' }),
    });
    const text = await res.text();                         // never printed or stored
    let ok = res.ok;
    try { if (JSON.parse(text).success === false) ok = false; } catch { ok = false; }
    if (!ok) throw new Error(`classregpage.do ${res.status} bei ${l.date} ${l.start}`);
    await new Promise(r => setTimeout(r, 150));
    open = await openAbsencePeriods(session, dates[0], dates[dates.length - 1]);
  }
  const still = open;
  const stuck = lessons.filter(l => still.has(String(l.ttId)));
  if (stuck.length) throw new Error(`WebUntis hat den Haken nicht uebernommen (${stuck.length} von ${lessons.length} weiter offen)`);
}

// Lessons attendance can have been taken in at all: they have begun - it is taken at the start -
// and were not cancelled. Everything that asks about the tick starts here, so the answer cannot
// drift between the two callers.
function begunLessons(lessons) {
  const now = new Date(), today = ymd(now);
  const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return lessons.filter(l => l.code !== 'cancelled' && (l.date < today || (l.date === today && l.start <= hm)));
}

// Own lessons (from myLessons) that have begun, were not cancelled, and that WebUntis itself
// still lists as "Abwesenheit offen".
async function ticksOpen(session, lessons) {
  const begun = begunLessons(lessons);
  if (!begun.length) return [];
  const dates = begun.map(l => l.date).sort();
  const open = await openAbsencePeriods(session, dates[0], dates[dates.length - 1]);
  return begun.filter(l => open.has(String(l.ttId)));
}

// The other side of the same question, for the A on the Stundenplan tiles (Doc, 21.09.2026:
// "mach bitte neben das U noch ain A wenn Anwesenheit kontrolliert steht"). WebUntis answers only
// what is still OPEN, so "kontrolliert" is what is not on that list.
//
// GEMESSEN am 21.09.2026 (`anwesenheit --filter`, der Messknopf steht weiter unten):
//   - open-periods nimmt NUR filter "ABSENCE_OPEN" - ALL, ABSENCE_CHECKED, LESSONTOPIC_OPEN und
//     ein fehlender Filter enden in HTTP 400. Ein "zeig mir die abgehakten" gibt es also nicht.
//   - Die Liste enthaelt auch Stunden, die noch gar nicht begonnen haben: am 21.09. um 10:10
//     standen die Stunden von 13:45, 14:30 und 15:30 darin, und die des 28.09. alle sieben.
//     "Nicht auf der Liste" heisst darum wirklich "Haken gesetzt" und nicht "ist noch nicht dran".
// Der Haken kaeme also auch fuer spaetere Stunden schon an: Doc setzt ihn immer fuer den ganzen
// Block ("Ich kann aber nur fuer den ganzen Block setzen"), die 10:30-Stunde war am 21.09. um
// 10:10 laengst abgehakt. ENTSCHIEDEN (Doc, 21.09.2026): trotzdem erst ab Stundenbeginn -
// "macht Sinn, wenn sie noch nicht angefangen hat ... lassen wir so". Ein A an einer Stunde, die
// noch gar nicht lief, behauptet mehr, als der Tag hergibt. Darum steht der Begonnen-Filter hier
// mit Absicht und nicht aus Unwissen. Ausgefallene Stunden bleiben ohnehin draussen: fuer sie
// wird keine Anwesenheit gefuehrt.
async function ticksDone(session, lessons) {
  const begun = begunLessons(lessons);
  if (!begun.length) return new Set();
  const dates = begun.map(l => l.date).sort();
  const open = await openAbsencePeriods(session, dates[0], dates[dates.length - 1]);
  return new Set(begun.filter(l => !open.has(String(l.ttId))).map(l => String(l.ttId)));
}

// Die Haken holen und in die kurze Liste eintragen, aus der stundenplan.html sein A zeichnet
// (Doc, 21.09.2026: "Bau das Abfragen der A ueberall ein"). Jeder Weg, der ohnehin mit WebUntis
// spricht und seine Stunden kennt, ruft das hier - dann bringt auch "WebUntis holen" die A mit
// und nicht erst der naechste status-Lauf.
// VEREINIGUNG, kein Abzug: dieser Aufruf sieht immer nur einen Ausschnitt der Stunden, ein
// fehlender Haken darin heisst also nicht "abgehakt und wieder zurueckgenommen". Die Liste
// aufzuraeumen ist Sache von runStatus, das alle Stunden des Schuljahres kennt.
async function refreshChecked(session, lessons) {
  let done;
  try { done = await ticksDone(session, lessons); }
  catch (e) { console.log(`Anwesenheits-Haken nicht gelesen (${e.message}) - kein neues A.`); return; }
  const outW = untisCacheFile(WRITTEN_ROW);
  let cache;
  /* Erst den STAND IN SUPABASE holen, nicht den lokalen Abzug: seit dem 21.09.2026 traegt auch
     die Edge Function dort ein, wenn Doc im Plan auf den Klassenbuch-Knopf drueckt. Der lokale
     Abzug weiss davon nichts - wer ihn als Grundlage nimmt, schriebe dessen frische L wieder
     weg. Antwortet Supabase nicht, ist der Abzug die zweitbeste Wahrheit. */
  try {
    const rows = await supaQuery(`select data from public.svp_untis where page = '${WRITTEN_ROW}'`);
    if (rows.length && rows[0].data) cache = rows[0].data;
  } catch (e) { /* offline oder kein Token - unten kommt der lokale Abzug */ }
  try { if (!cache) cache = JSON.parse(fs.readFileSync(outW, 'utf8')); }
  catch (e) { console.log(`${WRITTEN_ROW} fehlt - die Haken kommen mit dem naechsten status-Lauf.`); return; }
  const set = new Set(cache.checked || []);
  const vorher = set.size;
  for (const l of lessons) {
    if (done.has(String(l.ttId))) set.add(`${l.date}|${l.start}|${l.klassen.join(',')}`);
  }
  if (set.size === vorher) { console.log(`Anwesenheits-Haken: ${vorher}, nichts Neues.`); return; }
  cache.checked = [...set].sort();
  cache.generated = new Date().toISOString();
  await saveUntis([{ page: WRITTEN_ROW, data: cache }]);
  console.log(`Anwesenheits-Haken: ${cache.checked.length} (${set.size - vorher} neu)`);
}

// Read the stored classbook text of one period - WITHOUT any student data.
// History: this used to be getPeriodData2017, switched off on 02.09.2026 on Doc's call
// ("Schuelernamen? Neeee") because that answer also carries `referencedStudents` with full names
// and dates of birth, even for a colleague's lessons. Nothing of it was ever stored, but it came
// over the wire, and that was reason enough. The overwrite protection and the WU chip's dots hung
// on it, so both went blind between 02.09. and 06.09.
// Measured 06.09.2026, the clean replacement - one plain web-API GET per period:
//   GET /WebUntis/api/classreg/lessontopic?periodId=<ttId>
//   200 -> {"data":{"lessonTopic":{id,date,startTime,endTime,subject,teacher,klasse,text,...}}}
//   500 -> this period has no entry at all (NOT a failure); an empty entry is 200 with text:''.
// Session cookies from the app-secret login are enough; no student field in sight.
async function readTopic(ttId) {
  const res = await fetch(`${BASE}/WebUntis/api/classreg/lessontopic?periodId=${ttId}`,
    { headers: { Cookie: cookies, Accept: 'application/json' } });
  const text = await res.text();
  // Belt and braces: if this endpoint ever starts carrying student data, stop instead of
  // quietly passing it on.
  if (/"(referencedStudents|students|studentIds)"/.test(text)) {
    throw new Error('Unerwartete Schuelerdaten in der Antwort von /api/classreg/lessontopic - Abbruch.');
  }
  if (res.status !== 200) return null;                 // no entry
  try { return JSON.parse(text)?.data?.lessonTopic?.text ?? ''; } catch (e) { return null; }
}

// Same for many periods. One request each, gently paced - 110 ms is enough for a whole school
// year (about 700 lessons, roughly two minutes).
async function readTopics(ttIds) {
  const out = {};
  let i = 0;
  for (const id of ttIds) {
    out[String(id)] = (await readTopic(id)) ?? '';
    if (++i % 100 === 0) process.stderr.write(`  ... ${i}/${ttIds.length} Stundeninhalte gelesen\n`);
    await new Promise(r => setTimeout(r, 110));
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
// Local copy of what goes to Supabase: svp_untis is the only place the pages read, this cache is
// what patchStatus() patches and what `untis-push` resends. It sits in plandaten/, which is
// gitignored - the status data (dates, lesson topics) must never be in the public repo again.
const UNTIS_CACHE = path.join(REPO, 'HTML', 'svp', 'plandaten', 'untis');
const WRITTEN_ROW = '_written';   // svp_untis row stundenplan.html reads for its orange L and A

function loadMap() {
  if (!fs.existsSync(MAP_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  return (raw.pages || []).filter(e => (e.classes || []).length).map(e => ({
    page: e.page,
    subject: String(e.subject || '').toLowerCase(),
    classes: new Set(e.classes || []),
  }));
}

// The plan page for one lesson, or null when nothing is mapped for it.
// Entries in webuntis-svp-map.json with fixed "groups" and no classes: pages whose Vortrag page
// needs its Lerngruppen although none of Doc's lessons belong to it (fos11 since SJ 2026/27).
function loadStaticGroups() {
  if (!fs.existsSync(MAP_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  return (raw.pages || []).filter(e => e.groups && !(e.classes || []).length)
    .map(e => ({ page: '/' + e.page.replace(/^HTML\//, ''), classes: [], subjects: [], groups: e.groups }));
}

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

// Lift a named top-level function out of svp-plan.js by brace counting - same trick as
// extractLiteral, and for the same reason: the text a lesson gets must be built by ONE piece of
// code, not by two that drift apart. The abbreviation table was already read from there; since
// 06.09.2026 the text builders are too, so the button and this tool write character-identical
// lines and neither mistakes the other's output for a hand correction.
function extractFunction(src, name) {
  const at = src.search(new RegExp('\\bfunction\\s+' + name + '\\s*\\('));
  if (at < 0) return null;
  const start = src.indexOf('{', at);
  if (start < 0) return null;
  let depth = 0, inStr = null, esc = false, inLine = false, inBlock = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i], next = src[i + 1];
    if (inLine) { if (c === '\n') inLine = false; continue; }
    if (inBlock) { if (c === '*' && next === '/') { inBlock = false; i++; } continue; }
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && next === '/') { inLine = true; i++; continue; }
    if (c === '/' && next === '*') { inBlock = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(at, i + 1);
  }
  return null;
}

// The browser's own text builders, evaluated straight out of the plan renderer
// (HTML/svp/svp-plan-*.js, see planSource()).
// markPlain   - strips the inline marks (<b>, <i>, <c1> ...) that untisPlain drops first
// untisPlain  - LaTeX to readable plain text (WebUntis cannot render $...$)
// untisFit    - fit to 250 chars in three stages (full / abbreviated / drop whole steps)
// untisSpread - one step per lesson, per learning group, "Festigung: ..." for the rest
// untisBlocks - fold gapless periods of one lesson into ONE classbook entry
let browserFns = null;
function browser() {
  if (browserFns) return browserFns;
  const src = planSource();
  const names = ['markPlain', 'untisAbbrev', 'untisPlain', 'untisFit', 'untisSpread', 'untisBlocks'];
  const parts = names.map(n => {
    const f = extractFunction(src, n);
    if (!f) throw new Error(`${n}() nicht in ${PLAN_SRC_LABEL} gefunden - Namen geaendert?`);
    return f;
  });
  const table = extractLiteral(src, 'SVP_ABBREV', '[', ']') || [];
  // markPlain() reads the tag regex next to it; lifted verbatim so the CLI recognises exactly
  // the tags the browser does (without it every plan call died: "markPlain is not defined").
  const markRe = (src.match(/const MARK_RE = (\/[^\n]*?\/[a-z]*);/) || [])[1];
  if (!markRe) throw new Error(`MARK_RE nicht in ${PLAN_SRC_LABEL} gefunden - Namen geaendert?`);
  // The renderer lives in parts; a function of one part calls another part's
  // as P.name (untisPlain -> P.markPlain) - P holds the lifted ones here.
  browserFns = new Function('SVP_ABBREV', 'UNTIS_MAX', `
    const window = { SVP_ABBREV };
    let abbrevRules = null;
    const MARK_RE = ${markRe};
    ${parts.join('\n')}
    const P = { ${names.join(', ')} };
    return { untisPlain, untisFit, untisSpread, untisBlocks };
  `)(table, TOPIC_MAX);
  return browserFns;
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
// Must stay character-identical to untisTopicText()/untisFit() in the plan
// renderer - otherwise each side thinks the other's text is a hand correction
// and the overwrite protection fires for nothing. That is also why the
// abbreviation table is NOT duplicated here but read out of the renderer:
// one list, one behaviour.
const TOPIC_MAX = 250;
// The renderer is split into parts since 19.09.2026: HTML/svp/svp-plan.js only
// loads HTML/svp/svp-plan-<part>.js. All parts together are the source the
// functions and SVP_ABBREV are lifted from - it does not matter which part
// holds them.
const PLAN_DIR = path.join(REPO, 'HTML/svp');
const PLAN_SRC_LABEL = 'HTML/svp/svp-plan-*.js';
let planSrc = null;
function planSource() {
  if (planSrc === null) {
    planSrc = fs.readdirSync(PLAN_DIR).filter(f => /^svp-plan(-[a-z-]+)?\.js$/.test(f)).sort()
      .map(f => fs.readFileSync(path.join(PLAN_DIR, f), 'utf8')).join('\n');
  }
  return planSrc;
}

let abbrevRules = null;
function abbrevate(t) {
  if (!abbrevRules) {
    const table = extractLiteral(planSource(), 'SVP_ABBREV', '[', ']') || [];
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
  return normLessons(tt);
}

// Die Stundenform, mit der hier ueberall gerechnet wird. Eigene Funktion, seit `year` dieselben
// Stunden fuer die Anwesenheits-Haken braucht: zwei Abschriften waeren zwei Wahrheiten, und der
// Schluessel Datum|Beginn|Klassen haengt an genau diesen Feldern.
function normLessons(tt) {
  return (tt || [])
    .filter(l => (l.kl || []).length && l.su?.[0])
    .map(l => ({ ttId: l.id, date: String(l.date), start: hhmm(l.startTime), end: hhmm(l.endTime),
                 subject: l.su[0].name, klassen: l.kl.map(k => k.name), code: l.code || '',
                 lsnumber: l.lsnumber ?? null }))
    .sort((a, b) => a.date - b.date || a.start.localeCompare(b.start));
}

// ---------- what belongs in which lesson ----------
// The one place that decides which plan line a lesson gets, for BOTH kinds of page. Everything
// here mirrors HTML/svp/svp-plan.js; the text builders are literally that file's functions
// (see browser()), so there is nothing left to drift.

const groupKey = (l) => (l.klassen || []).slice().sort().join(',');

// Topic and steps of one plan row, ready for untisFit - the CLI twin of untisTopicParts().
function topicParts(row, badge) {
  const B = browser();
  const lb = (badge[row.type] || [])[1];
  const head = [lb, row.u].filter(Boolean).join(', ');
  // A placeholder topic means "propose nothing" - better an empty lesson than a dash in the
  // classbook.
  const topic = (row.topic === '\u2014' || row.topic === '-') ? '' : (row.topic || '');
  return {
    base: topic ? B.untisPlain(topic + (head ? ` (${head})` : '')).replace(/\s+/g, ' ').trim() : '',
    details: (row.details || []).filter(Boolean).map(d => B.untisPlain(d).replace(/\s+/g, ' ').trim()),
  };
}

// Termin mode (block teaching, see the comment on TERMIN in svp-plan.js): a group comes every
// other week for four periods, so the plan row is NOT chosen by calendar week but by which
// appointment it is for THAT group. Row 2k carries the first Doppelstunde, row 2k+1 the second.
// Measured 06.09.2026: WebUntis mirrors a topic only across gapless periods, so the two halves
// of a day really are two separate entries.
function terminRowIndex(rows, block, half) {
  let n = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].ferien) continue;
    if (n === block * 2 + half) return i;
    n++;
  }
  return -1;
}

// For every lesson in `lessons`: which plan row, and what would be written.
// `all` is the whole school year of my lessons - needed to count a group's appointments and to
// spread a week's steps over its lessons. Returns one entry per lesson, `text` null when the
// plan has nothing to say for it (the reason is then in `why`).
async function proposals(lessons, all, pages, plans) {
  const B = browser();
  const out = [];
  for (const l of lessons) {
    const page = pageFor(l, pages);
    if (!page) { out.push({ l, page: null, text: null, why: 'keine Planseite' }); continue; }
    if (!plans[page]) plans[page] = await loadPlan(page);
    const { rows, badge, termin } = plans[page];
    let text = null, why = '';
    if (termin) {
      const key = groupKey(l);
      const group = all.filter(x => groupKey(x) === key && x.subject === l.subject);
      const days = [...new Set(group.map(x => x.date))].sort();
      const block = days.indexOf(l.date);
      const day = group.filter(x => x.date === l.date).sort((a, b) => a.start.localeCompare(b.start));
      // Fewer than four periods (a cancellation): everything goes to the first half rather than
      // guessing - no proposal is better than the wrong one.
      const half = day.length >= 4 ? (day.findIndex(x => x.ttId === l.ttId) >= 2 ? 1 : 0) : 0;
      const ri = terminRowIndex(rows, block, half);
      if (ri < 0) { out.push({ l, page, text: null, why: `kein Termin-Slot (Termin ${block + 1})` }); continue; }
      const p = topicParts(rows[ri], badge);
      text = B.untisFit(p.base, p.details);
      why = `Termin ${block + 1}, ${half ? '2.' : '1.'} Doppelstunde -> Zeile ${rows[ri].nr}`;
    } else {
      const kw = isoWeek(parseYmd(l.date));
      const ri = rows.findIndex(r => !r.ferien && Number(r.kw) === kw);
      if (ri < 0) { out.push({ l, page, text: null, why: `keine Planzeile fuer KW ${kw}` }); continue; }
      const p = topicParts(rows[ri], badge);
      // Week mode: the dialog spreads the week's steps over that group's blocks, one step each,
      // so five lessons do not all get the same lump of text.
      const week = all.filter(x => isoWeek(parseYmd(x.date)) === kw && pageFor(x, pages) === page
                                   && x.code !== 'cancelled');
      const blocks = B.untisBlocks(week.map(x => ({ ...x, writable: true, topic: '' })));
      const mine = blocks.find(bl => bl.periods.some(x => x.ttId === l.ttId));
      const spread = B.untisSpread(p.base, p.details, blocks);
      text = mine ? spread.get(mine) : B.untisFit(p.base, p.details);
      why = `KW ${kw} -> Zeile ${rows[ri].nr}`;
    }
    if (!text || !text.trim()) { out.push({ l, page, text: null, why: 'Planzeile ohne Thema' }); continue; }
    out.push({ l, page, text, why });
  }
  return out;
}

// Regenerate the <plan>.untis.json files the SVP badges read - the FULL rebuild, one GET per
// lesson of the school year (768 in 2026/27, about two and a half minutes). Runs as its own
// command, i.e. from the 06:00/12:30 LaunchAgent, and also catches hand edits and deletions
// made in WebUntis itself. After a write, `plan` only patches what it wrote: patchStatus().
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
      /* The page needs the code: a cancelled lesson must not count as "still to write", and in
         Termin mode a day that fell away entirely must not eat an appointment (Doc's rule
         "a holiday only shifts the group it hits" only works if the page can see it). */
      code: l.code || '',
      written: !!(topics[String(l.ttId)] || '').trim(),
      text: topics[String(l.ttId)] || '',
    });
  }
  const mapIndex = [];
  const untisRows = [];
  const generated = new Date().toISOString();
  for (const [page, data] of Object.entries(byPage)) {
    const pagePath = '/' + page.replace(/^HTML\//, '');
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
    /* Lerngruppen so, wie die Vortragsseiten sie brauchen: e.klasse ungeteilt, gekoppelte
       Klassen also als EINE Gruppe ("FOG25-2,FOW25-2"). Nur Kuerzel - die gehen in die
       oeffentliche svp-map.json, alles andere nach Supabase. */
    const groups = [...new Set(Object.values(data.weeks).flat().map(e => e.klasse).filter(Boolean))].sort();
    untisRows.push({ page: pagePath, data: {
      generated, page: pagePath,
      webuntis: `${BASE}/WebUntis/?school=${SCHOOL}#/basic/mytimetable`,
      classes, subjects, weeks: data.weeks,
    } });
    console.log(`${pagePath}: ${done}/${n} Stunden eingetragen, ${Object.keys(data.weeks).length} Wochen`);
    mapIndex.push({ page: pagePath, classes, subjects, groups });
  }

  /* Zweiter kleiner Index fuer stundenplan.html: WELCHE Stunde traegt schon Stoff.
     Der Stundenplan soll ein orangenes U zeigen, sobald im Klassenbuch etwas steht (Doc,
     06.09.2026) - er kann die sechs <plan>.untis.json nicht einzeln laden und wuesste auch
     nicht welche. Nur die gefuellten Stunden stehen drin, das sind wenige; Schluessel ist
     Datum|Beginn|Klassen, damit zwei parallele Stunden nicht verwechselt werden. */
  {
    const written = [];
    for (const data of Object.values(byPage)) {
      for (const list of Object.values(data.weeks)) {
        for (const e of list) if (e.written) written.push(`${e.date}|${e.start}|${e.klasse}`);
      }
    }
    written.sort();
    /* Daneben, seit 21.09.2026: wo sitzt der Haken "Anwesenheit kontrolliert". Der Stundenplan
       macht daraus ein A neben dem U. Gleicher Schluessel, ein Abruf mehr - die Stunden selbst
       sind schon gelesen. Faellt der Abruf aus, bleibt das A weg und das U steht wie bisher. */
    let checked = [];
    try {
      const done = await ticksDone(session, lessons);
      checked = lessons.filter(l => done.has(String(l.ttId)))
        .map(l => `${l.date}|${l.start}|${l.klassen.join(',')}`).sort();
    } catch (e) {
      console.log(`Anwesenheits-Haken nicht gelesen (${e.message}) - kein A im Stundenplan.`);
    }
    untisRows.push({ page: WRITTEN_ROW, data: { generated, written, checked } });
    console.log(`${WRITTEN_ROW}: ${written.length} Stunden mit Stoff, ${checked.length} mit Anwesenheits-Haken`);
  }
  await saveUntis(untisRows);

  /* Kleiner Index fuer stundenplan.html: welche Stunde gehoert zu welchem
     Stoffverteilungsplan. Der Browser kommt an tools/webuntis-svp-map.json
     nicht heran (liegt ausserhalb des Web-Roots), und plandaten/ ist
     gitignored - deshalb hier, neben den Planseiten. Erzeugt, nicht gepflegt:
     die eine Quelle bleibt webuntis-svp-map.json. */
  for (const st of loadStaticGroups()) if (!mapIndex.some(m => m.page === st.page)) mapIndex.push(st);
  if (mapIndex.length) {
    const mapOut = path.join(REPO, 'HTML', 'svp', 'svp-map.json');
    const pages = mapIndex.sort((a, b) => a.page.localeCompare(b.page));
    /* This one file stays in the public repo (class codes only, no dates, no topics), so it is
       only rewritten when something in it changed - a fresh timestamp alone used to leave it
       "modified" after every single run. */
    let old = null;
    try { old = JSON.parse(fs.readFileSync(mapOut, 'utf8')).pages; } catch (e) { /* first run */ }
    if (JSON.stringify(old) !== JSON.stringify(pages)) {
      fs.writeFileSync(mapOut, JSON.stringify({ generated, pages }, null, 1));
      console.log(`${path.relative(REPO, mapOut)}: ${pages.length} Planseiten`);
    } else console.log(`${path.relative(REPO, mapOut)}: unveraendert`);
  }
  if (!Object.keys(byPage).length) console.log('Keine Stunde passt zu einer Planseite - webuntis-svp-map.json pruefen.');
}

// After a write only the lessons just written have changed, so the badge files get exactly
// those entries patched in instead of a full re-read (Doc, 08.09.2026: "liest er alle 768
// Stunden zurueck ... warum?" - the button took two and a half minutes for four lessons).
// `entries` = [{ page, l, text }] where `text` is what was READ BACK, not what was sent: the
// files must show what WebUntis really holds. Whatever this cannot place - a missing file, a
// lesson that is not in it (moved since the last full run) - hands over to runStatus(), so the
// files are never left half-right. WebUntis mirrors a topic across gapless periods; a mirrored
// neighbour that was not itself written stays as it was until the next full run.
// `ticked` = die Stunden, bei denen der Haken "Anwesenheit kontrolliert" gerade gesetzt wurde;
// sie wandern in dieselbe kurze Liste, damit das A sofort steht und nicht erst nach dem
// naechsten status-Lauf (Doc, 21.09.2026).
async function patchStatus(session, entries, ticked = []) {
  const byPage = {};
  for (const e of entries) (byPage[e.page] ||= []).push(e);
  let stale = null;
  const rows = [];
  for (const [page, list] of Object.entries(byPage)) {
    const pagePath = '/' + page.replace(/^HTML\//, '');
    const out = untisCacheFile(pagePath);
    let data;
    try { data = JSON.parse(fs.readFileSync(out, 'utf8')); } catch (e) { stale = `${path.relative(REPO, out)} fehlt`; break; }
    for (const e of list) {
      const kw = String(isoWeek(parseYmd(e.l.date)));
      const klasse = e.l.klassen.join(',');
      const hit = ((data.weeks || {})[kw] || []).find(x => x.date === e.l.date && x.start === e.l.start && x.klasse === klasse);
      if (!hit) { stale = `${e.l.date} ${e.l.start} ${klasse} steht nicht in ${path.relative(REPO, out)}`; break; }
      hit.written = !!(e.text || '').trim();
      hit.text = e.text || '';
    }
    if (stale) break;
    data.generated = new Date().toISOString();
    rows.push({ page: pagePath, data });
    const flat = Object.values(data.weeks).flat();
    console.log(`${path.relative(REPO, out)}: ${list.length} Stunde${list.length === 1 ? '' : 'n'} nachgetragen, ${flat.filter(x => x.written).length}/${flat.length} eingetragen`);
  }
  if (stale) {
    console.log(`${stale} - Badge-Daten werden komplett neu gebaut.`);
    await runStatus(session);
    return;
  }
  // The short list stundenplan.html reads: add what now carries text, drop what lost it.
  const outW = untisCacheFile(WRITTEN_ROW);
  let written = [], checked = [], hadCache = false;
  try {
    const cache = JSON.parse(fs.readFileSync(outW, 'utf8'));
    written = cache.written || [];
    checked = cache.checked || [];
    hadCache = true;
  } catch (e) { /* starts empty */ }
  /* Nur Haken gesetzt und keine Liste da? Dann NICHT schreiben - eine frisch gebaute Zeile
     haette kein `written` mehr, und alle U waeren weg. Das A kommt dann beim naechsten
     status-Lauf (06:00/12:30). */
  if (!entries.length && !hadCache) {
    console.log(`${WRITTEN_ROW} fehlt - das A kommt beim naechsten status-Lauf.`);
    if (rows.length) await saveUntis(rows);
    return;
  }
  const set = new Set(written);
  for (const e of entries) {
    const key = `${e.l.date}|${e.l.start}|${e.l.klassen.join(',')}`;
    if ((e.text || '').trim()) set.add(key); else set.delete(key);
  }
  written = [...set].sort();
  const cset = new Set(checked);
  for (const l of ticked) cset.add(`${l.date}|${l.start}|${l.klassen.join(',')}`);
  checked = [...cset].sort();
  rows.push({ page: WRITTEN_ROW, data: { generated: new Date().toISOString(), written, checked } });
  console.log(`${WRITTEN_ROW}: ${written.length} Stunden mit Stoff, ${checked.length} mit Anwesenheits-Haken`);
  await saveUntis(rows);
}

// ---------- svp_untis (Supabase) ----------
// Until 10.09.2026 the status went into <plan>.untis.json next to each plan page - public on
// GitHub Pages, lesson topics and dates included. Now it goes into the table svp_untis, which
// only Doc can read (RLS). Writing uses the Management API with the Supabase CLI token
// (~/.supabase/access-token), exactly like tools/svp-material.py: no key in the repo, and the
// table needs no write policy at all.

function untisCacheFile(page) {
  if (page === WRITTEN_ROW) return path.join(UNTIS_CACHE, 'untis-written.json');
  return path.join(UNTIS_CACHE, page.replace(/^\/svp\//, '').replace(/\.html$/, '.untis.json'));
}

async function supaQuery(sql) {
  const tokFile = path.join(os.homedir(), '.supabase', 'access-token');
  if (!fs.existsSync(tokFile)) throw new Error(`${tokFile} fehlt (supabase login)`);
  const authSrc = fs.readFileSync(path.join(REPO, 'HTML/svp/svp-auth.js'), 'utf8');
  const ref = (authSrc.match(/DB_URL\s*=\s*'https:\/\/([a-z0-9]+)\.supabase\.co'/) || [])[1];
  if (!ref) throw new Error('Projekt-Ref nicht in svp-auth.js gefunden');
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + fs.readFileSync(tokFile, 'utf8').trim(),
      'Content-Type': 'application/json',
      // Cloudflare in front of api.supabase.com answers a bare client with 403 "error code: 1010"
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text || '[]');
}

// Upsert rows [{ page, data }] into svp_untis and keep the local cache in step. The cache is
// written first: if Supabase is unreachable the run still has its result, and `untis-push`
// sends it later. Never throws - a failed upload must not take the rest of the run down.
async function saveUntis(rows) {
  for (const r of rows) {
    const file = untisCacheFile(r.page);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(r.data, null, 1));
  }
  try {
    const tag = '$u' + crypto.randomBytes(6).toString('hex') + '$';
    const values = rows.map(r => {
      const json = JSON.stringify(r.data);
      if (json.includes(tag)) throw new Error('dollar-quote tag collision');
      const ts = r.data.generated ? `'${String(r.data.generated).replace(/'/g, '')}'::timestamptz` : 'now()';
      return `('${r.page.replace(/'/g, "''")}', ${tag}${json}${tag}::jsonb, ${ts})`;
    });
    const back = await supaQuery('insert into public.svp_untis (page, data, generated) values ' + values.join(', ') +
      ' on conflict (page) do update set data = excluded.data, generated = excluded.generated returning page');
    console.log(`Supabase svp_untis: ${back.length}/${rows.length} Zeilen geschrieben`);
  } catch (e) {
    console.error(`Supabase svp_untis NICHT geschrieben (${e.message}). Lokal liegt alles in ${path.relative(REPO, UNTIS_CACHE)} - nachholen mit: node tools/webuntis.js untis-push`);
  }
}

// untis-push: resend the local cache to Supabase without asking WebUntis (after an offline run).
async function pushUntisCache() {
  const rows = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        rows.push({ page: data.page || WRITTEN_ROW, data });
      }
    }
  };
  if (fs.existsSync(UNTIS_CACHE)) walk(UNTIS_CACHE);
  if (!rows.length) { console.log(`Nichts in ${path.relative(REPO, UNTIS_CACHE)} - erst: node tools/webuntis.js status`); return; }
  await saveUntis(rows);
}

// Publish Doc's own lessons for the students (meinplan.html): exactly the rows the
// "Veröffentlichen" button in stundenplan.html writes, now also at the end of every `year` run
// (Doc, 10.09.2026: "automatisch frueh und abends") - so the 06:00/12:30 LaunchAgent and the
// 18:00 app keep the students' page fresh without a click. Reads what `year` just wrote into
// plandaten/; only the lessons of index.teacher leave the machine, slimmed like the button's
// slim(). Keep both in step. Never throws - a failed upload must not take the rest of the run down.
const PUBLIC_TEACHER = 'Dr. Michael R. Alvers';   // Untis says "Alvers, Michael" - the students' page carries the full name (Doc)
async function publishPlan(dir = path.join(REPO, 'HTML', 'svp', 'plandaten')) {
  try {
    const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
    if (!index.teacher) throw new Error('index.json ohne teacher');
    // WebUntis has no rooms for the Fachoberschule courses; raeume.json fills that gap, Untis wins.
    let rooms = {};
    try { rooms = JSON.parse(fs.readFileSync(path.join(REPO, 'HTML', 'svp', 'raeume.json'), 'utf8')).byClass || {}; } catch (e) { /* optional */ }
    const fallbackRoom = l => {
      for (const c of l.classes || []) {
        const hit = rooms[c + '|' + l.subject] || rooms[c];
        if (hit) return [hit];
      }
      return [];
    };
    const slim = l => ({
      date: l.date, startTime: l.startTime, endTime: l.endTime,
      subject: l.subject, classes: l.classes || [],
      rooms: (l.rooms && l.rooms.length) ? l.rooms : fallbackRoom(l),
      code: l.code || null, info: l.info || null,
      substText: l.substText || null, lstext: l.lstext || null,
    });
    const rows = index.weeks.map(wk => {
      const d = JSON.parse(fs.readFileSync(path.join(dir, `w${wk}.json`), 'utf8'));
      return { week: String(wk), payload: {
        week: wk, teacher: PUBLIC_TEACHER, school: index.school, generatedAt: index.generatedAt,
        timegrid: d.timegrid,
        lessons: d.lessons.filter(l => (l.teachers || []).includes(index.teacher)).map(slim),
      } };
    });
    const tag = '$p' + crypto.randomBytes(6).toString('hex') + '$';
    let written = 0;
    for (let i = 0; i < rows.length; i += 10) {   // ten weeks per statement keeps each request small
      const values = rows.slice(i, i + 10).map(r => {
        const json = JSON.stringify(r.payload);
        if (json.includes(tag)) throw new Error('dollar-quote tag collision');
        return `('${r.week.replace(/'/g, "''")}', ${tag}${json}${tag}::jsonb, now())`;
      });
      const back = await supaQuery('insert into public.svp_public_plan (week, payload, updated_at) values ' + values.join(', ') +
        ' on conflict (week) do update set payload = excluded.payload, updated_at = excluded.updated_at returning week');
      written += back.length;
    }
    const lessons = rows.reduce((s, r) => s + r.payload.lessons.length, 0);
    console.log(`Supabase svp_public_plan: ${written}/${rows.length} Wochen, ${lessons} Stunden veroeffentlicht (meinplan.html)`);
  } catch (e) {
    console.error(`Supabase svp_public_plan NICHT geschrieben (${e.message}) - nachholen mit: node tools/webuntis.js publish`);
  }
}

async function main() {
  const cmd = process.argv[2] || 'whoami';
  // Needs no WebUntis login: resends the local status cache to Supabase.
  if (cmd === 'untis-push') { await pushUntisCache(); return; }
  // Needs no WebUntis login either: publishes the students' plan from the local plandaten/.
  if (cmd === 'publish') { await publishPlan(); return; }
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

    const timegrid = await rpc('getTimegridUnits');
    const holidays = await rpc('getHolidays');
    const byWeek = new Map();
    let total = 0;

    // Standard seit 02.09.2026 (Doc: "eigentlich reicht mein plan"): NUR der
    // eigene Stundenplan. Frueher lief hier immer die Schleife ueber alle 80
    // Klassen - die holte rund 3100 Stunden je Woche und die Kuerzel von 140
    // Kolleg:innen auf die private Platte. Der Weg ist nicht geloescht, er
    // haengt an --alle: EIN Schalter zurueck, falls der Optimierer den ganzen
    // Schulplan wieder braucht. Ohne den Schalter kommen nur Docs Stunden.
    const ALLE = process.argv.includes('--alle');
    let meine = [];          // eigene Stunden mit ttId, fuer die Anwesenheits-Haken
    if (ALLE) {
      console.log('--alle: holt den GANZEN Schulplan inkl. fremder Lehrkraft-Kuerzel.');
      const classes = await rpc('getKlassen');
      const seen = new Set();
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
    } else {
      const ELEM_TYPE = { CLASS: 1, KLASSE: 1, TEACHER: 2, SUBJECT: 3, ROOM: 4, STUDENT: 5 };
      const myId = session.user?.elemId ?? session.user?.personId;
      const rawType = session.user?.elemType ?? session.user?.personType ?? 2;
      const myType = typeof rawType === 'string' ? (ELEM_TYPE[rawType.toUpperCase()] ?? 2) : rawType;
      process.stderr.write('  eigener Plan wird geholt …');
      const tt = await rpc('getTimetable', { options: { element: { id: myId, type: myType }, startDate: sy.startDate, endDate: sy.endDate, ...fields } });
      for (const l of tt) {
        const monday = parseYmd(l.date);
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
        const wk = ymd(monday);
        if (!byWeek.has(wk)) byWeek.set(wk, []);
        byWeek.get(wk).push(norm(l));
        total++;
      }
      /* Dieselben Stunden noch einmal in der Form mit ttId - daraus holt refreshChecked die
         Anwesenheits-Haken. Kein zusaetzlicher Abruf beim Stundenplan, nur der eine bei
         open-periods. Mit --alle bleibt es aus: dort stecken auch fremde Stunden in `tt`. */
      meine = normLessons(tt);
    }
    process.stderr.write('\r' + ' '.repeat(44) + '\r');

    const weeks = [...byWeek.keys()].sort();
    for (const wk of weeks) {
      const lessons = byWeek.get(wk).sort((a, b) => a.date - b.date || a.startTime - b.startTime);
      const monday = parseYmd(wk);
      const friday = new Date(monday); friday.setDate(monday.getDate() + 4);
      fs.writeFileSync(path.join(outDir, `w${wk}.json`),
        JSON.stringify({ scope: ALLE ? 'all' : 'me', week: { from: Number(wk), to: Number(ymd(friday)) }, timegrid, lessons }));
    }

    const teachers = {};
    for (const list of byWeek.values()) for (const l of list) for (const n of l.teachers) teachers[n] = (teachers[n] || 0) + 1;
    /* Klarnamen aller Kolleg:innen kommen nicht mehr mit (Doc, 02.09.2026):
    const names = {};
    for (const t of session.masterData?.teachers || []) {
      const full = [t.lastName, t.firstName].filter(Boolean).join(', ');
      if (t.name && full) names[t.name] = full;
    }
    */
    const names = {};
    fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify({
      school: session.user?.schoolName ?? SCHOOL, teacher: session.user?.displayName ?? null, names,
      schoolyear: { name: sy.name, from: sy.startDate, to: sy.endDate },
      weeks, timegrid, holidays,
      teachers: Object.keys(teachers).sort((a, b) => a.localeCompare(b, 'de')).map(n => ({ name: n, lessons: teachers[n] })),
      totalLessons: total, generatedAt: new Date().toISOString(),
    }, null, 1));

    const mb = weeks.reduce((s, w) => s + fs.statSync(path.join(outDir, `w${w}.json`)).size, 0) / 1048576;
    console.log(`${total} Stunden, ${weeks.length} Wochen, ${Object.keys(teachers).length} Lehrkräfte -> ${outDir} (${mb.toFixed(1)} MB)`);
    /* Die Haken "Anwesenheit kontrolliert" gleich mitnehmen (Doc, 21.09.2026) - so bringt
       "WebUntis holen" das A mit, statt bis zum naechsten status-Lauf zu warten. */
    if (meine.length) await refreshChecked(session, meine);
    // Keep the students' page (meinplan.html) in step with every fetch - morning job and evening app.
    await publishPlan(outDir);
    return;
  }
  if (cmd === 'names') {
    // STILLGELEGT am 02.09.2026 (Doc): schrieb die Klarnamen ALLER ~173
    // Kolleg:innen in index.json. Seit "nur mein Plan" braucht das niemand
    // mehr. Kein Fehler-Exit, damit der taegliche LaunchAgent sauber
    // durchlaeuft - er ruft `year && names` auf.
    if (!process.argv.includes('--alle')) {
      console.log('names ist stillgelegt (Datenschutz, 02.09.2026) — es werden keine Kolleg:innen-Namen mehr gespeichert.'
        + ' Mit --alle wieder einschalten.');
      return;
    }
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
    // Carry the SVP over into the classbook.
    //   plan [YYYYMMDD]            one day (default: today)
    //   plan --bis YYYYMMDD        a range, starting at the given day
    //   plan --offen               school year start .. today - "what is still missing"
    //   --dry    report only, write nothing
    //   --force  overwrite a DIFFERENT existing text (a hand correction) as well
    //   --line   one summary line plus exit code 1 when something is open (for the app)
    //   --nur-stoff  write the topic only, leave "Anwesenheit kontrolliert" alone (default: the
    //            tick goes to every own lesson of the range that has begun - see markAbsencesChecked)
    // Since 06.09.2026 this also handles Termin-mode pages (block teaching, fos12) and builds
    // its text with the browser's own functions, so both ways write the same line.
    const args = process.argv.slice(3);
    const dry = args.includes('--dry');
    const force = args.includes('--force');
    const line = args.includes('--line');
    const nurStoff = args.includes('--nur-stoff');
    const offen = args.includes('--offen');
    const say = (...a) => { if (!line) console.log(...a); };

    const years = await rpc('getSchoolyears');
    const todayN = Number(ymd(new Date()));
    const year = years.find(y => Number(y.startDate) <= todayN && Number(y.endDate) >= todayN)
      || years[years.length - 1];

    const days = args.filter(a => /^\d{8}$/.test(a));
    const bisAt = args.indexOf('--bis');
    let from, to;
    if (offen) { from = String(year.startDate); to = ymd(new Date()); }
    else {
      from = days[0] || ymd(new Date());
      to = bisAt >= 0 ? (args[bisAt + 1] || from) : (days[1] || from);
    }
    if (Number(to) < Number(from)) { console.error('--bis liegt vor dem Startdatum.'); process.exit(2); }

    const pages = loadMap();
    const plans = {};
    // The whole year is needed anyway: Termin mode counts a group's appointments from it, and
    // week mode spreads the steps over the week's lessons.
    const mine = await myLessons(year.startDate, year.endDate, session);
    const all = mine.filter(l => pageFor(l, pages));
    const inRange = l => Number(l.date) >= Number(from) && Number(l.date) <= Number(to);
    const lessons = all.filter(inRange);
    // The tick belongs to every own lesson of the range, with or without a plan page.
    const tickable = nurStoff ? [] : await ticksOpen(session, mine.filter(inRange));
    if (!lessons.length && !tickable.length) {
      if (line) console.log('KLASSENBUCH: keine eigenen Stunden im Zeitraum');
      else console.log(`Keine Stunden mit Planseite zwischen ${from} und ${to}.`);
      return;
    }
    say(`${lessons.length} Stunden ${from}..${to} (Schuljahr ${year.name})`);

    const props = await proposals(lessons, all, pages, plans);
    const unmapped = new Set(props.filter(p => !p.page).map(p => `${p.l.subject} ${p.l.klassen.join(',')}`));

    // Read the current classbook state in ONE pass - the clean way, no student data.
    const askable = props.filter(p => p.text && p.l.code !== 'cancelled');
    const current = await readTopics(askable.map(p => p.l.ttId));

    const open = [], conflicts = [];
    for (const p of askable) {
      const now = current[String(p.l.ttId)] || '';
      if (now.trim() === p.text.trim()) continue;              // already exactly this
      if (now.trim() && !force) { conflicts.push({ ...p, now }); continue; }
      open.push(p);
    }

    if (line) {
      // One line for "WebUntis holen" - and the exit code says whether anything is open.
      // Only EMPTY lessons belong in this line. A lesson whose text differs from today's plan is
      // not a gap - it has content, usually because the plan was edited afterwards - and would
      // otherwise nag every single day for the rest of the school year.
      if (dry || (!open.length && !tickable.length)) {
        // The app ("WebUntis holen", deliberately not rebuilt - a rebuild resets its macOS
        // permissions) shows the Eintragen button only for a line containing "ohne Lernstoff" or
        // "FEHLGESCHLAGEN". So an open tick is reported together with the (true) "0 Stunden ohne
        // Lernstoff", otherwise there would be no button to set it.
        const parts = [];
        if (open.length || tickable.length) parts.push(`${open.length} Stunde${open.length === 1 ? '' : 'n'} ohne Lernstoff`);
        if (tickable.length) parts.push(`Anwesenheit offen: ${tickable.length} Stunde${tickable.length === 1 ? '' : 'n'}`);
        const groups = [...new Set([...open.map(p => p.l.klassen.join(',')), ...tickable.map(l => l.klassen.join(','))])];
        console.log('KLASSENBUCH: ' + (parts.length
          ? parts.join(' \u00b7 ') + (groups.length ? ' \u00b7 ' + groups.join(', ') : '')
          : 'alles eingetragen'));
        process.exitCode = parts.length ? 1 : 0;
        return;
      }
      // Writing: report AFTER the fact, otherwise the caller shows the state from before its own
      // click. Every entry is read back; only a confirmed one counts.
      let done = 0; const bad = [], patched = [], ticked = [];
      for (const p of open) {
        const label = `${p.l.date.slice(6)}.${p.l.date.slice(4, 6)}. ${p.l.start} ${p.l.klassen.join(',')}`;
        try {
          await writeTopic(p.l.ttId, p.text);
          const back = (await readTopics([p.l.ttId]))[String(p.l.ttId)] || '';
          patched.push({ page: p.page, l: p.l, text: back });
          if (back.trim() === p.text.trim()) { done++; ticked.push(p.l.ttId); } else bad.push(label);
        } catch (e) { bad.push(`${label} (${e.message})`); }
      }
      if (patched.length) await patchStatus(session, patched);
      // the tick rides on the same click - for every lesson of the range that has begun, not only
      // for the ones just written (see markAbsencesChecked)
      let tick = '';
      if (tickable.length) {
        const ids = tickable.map(l => l.ttId);
        try { await markAbsencesChecked(session, tickable); tick = ` \u00b7 Anwesenheit kontrolliert: ${ids.length}`; }
        catch (e) { bad.push(`Anwesenheit kontrolliert (${e.message})`); }
      }
      console.log('KLASSENBUCH: ' + `${done} Stunde${done === 1 ? '' : 'n'} eingetragen` + tick
        + (bad.length ? ` \u00b7 ${bad.length} FEHLGESCHLAGEN: ${bad.join(', ')}` : ''));
      process.exitCode = bad.length ? 1 : 0;
      return;
    }

    for (const p of props.filter(p => p.page && !p.text)) {
      say(`${p.l.date} ${p.l.start} ${p.l.subject} ${p.l.klassen.join(',')}: ${p.why}`);
    }
    for (const c of conflicts) {
      say(`${c.l.date} ${c.l.start} ${c.l.subject} ${c.l.klassen.join(',')}: STEHT SCHON ANDERS DRIN, nicht angefasst (--force ueberschreibt)`);
      say(`    ist:  ${c.now}`);
      say(`    waer: ${c.text}`);
    }

    const patched = [], ticked = [];
    for (const p of open) {
      const label = `${p.l.date} ${p.l.start} ${p.l.subject} ${p.l.klassen.join(',')}`;
      if (dry) { say(`${label}: WUERDE schreiben (${p.why}) -> ${p.text}`); continue; }
      await writeTopic(p.l.ttId, p.text);
      const back = (await readTopics([p.l.ttId]))[String(p.l.ttId)] || '';
      const ok = back.trim() === p.text.trim();
      if (ok) ticked.push(p.l.ttId);
      patched.push({ page: p.page, l: p.l, text: back });
      say(`${label}: ${ok ? 'eingetragen' : 'FEHLER, Rueckgelesenes weicht ab'} -> ${back}`);
    }
    let getickt = [];        // wirklich gesetzt - das gibt dem Stundenplan sein A
    if (tickable.length) {
      const ids = tickable.map(l => l.ttId);
      if (dry) say(`WUERDE "Anwesenheit kontrolliert" setzen: ${ids.length} Stunde${ids.length === 1 ? '' : 'n'} (--nur-stoff laesst es)`);
      else {
        try { await markAbsencesChecked(session, tickable); getickt = tickable; say(`"Anwesenheit kontrolliert" gesetzt: ${ids.length} Stunde${ids.length === 1 ? '' : 'n'}`); }
        catch (e) { say(`"Anwesenheit kontrolliert" FEHLGESCHLAGEN: ${e.message}`); }
      }
    }
    if (!open.length) say('Nichts offen - alles steht schon im Klassenbuch.');
    if (unmapped.size) say(`Ohne Planseite (in ${path.basename(MAP_FILE)} nachtragen): ${[...unmapped].join(', ')}`);
    if (patched.length || getickt.length) { say('Badge-Daten aktualisieren:'); await patchStatus(session, patched, getickt); }
    return;
  }

  if (cmd === 'anwesenheit' && process.argv.includes('--filter')) {
    /* Messknopf, bleibt drin: WELCHE Filter kennt open-periods, und liefert einer davon auch
       die schon kontrollierten Stunden? Gemessen wird mit dem heutigen Tag, ausgegeben werden
       nur Zahlen und die beiden Flaggen - keine Stunden-, schon gar keine Schuelerdaten.
       Hintergrund (Doc, 21.09.2026): "Ich kann aber nur fuer den ganzen Block setzen" - solange
       wir nur die offene Liste kennen, muss "kontrolliert" aus ihrem Fehlen geraten werden. */
    const tag = process.argv[process.argv.indexOf('--filter') + 1] || ymd(new Date());
    const iso = d => `${String(d).slice(0, 4)}-${String(d).slice(4, 6)}-${String(d).slice(6, 8)}`;
    const jwt = (await (await fetch(`${BASE}/WebUntis/api/token/new`, { headers: { Cookie: cookies } })).text()).trim();
    for (const filter of ['ABSENCE_OPEN', 'ALL', 'ABSENCE_CHECKED', 'LESSONTOPIC_OPEN', '']) {
      const body = { teacherId: session.user?.elemId, dateRange: { start: iso(tag), end: iso(tag) } };
      if (filter) body.filter = filter;
      let res, text;
      try {
        res = await fetch(`${BASE}/WebUntis/api/rest/view/v1/classreg/open-periods`, {
          method: 'POST',
          headers: { Cookie: cookies, Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        });
        text = await res.text();
      } catch (e) { console.log(`${filter || '(ohne)'}: FEHLER ${e.message}`); continue; }
      if (/"(referencedStudents|students|studentIds|stAbsences)"/.test(text)) {
        console.log(`${filter || '(ohne)'}: SCHUELERDATEN in der Antwort - abgebrochen.`); continue;
      }
      if (!res.ok) { console.log(`${(filter || '(ohne)').padEnd(16)} HTTP ${res.status}`); continue; }
      let periods = [];
      try { periods = JSON.parse(text).periods || []; } catch (e) { /* keine Liste */ }
      const zahl = (f) => periods.filter(f).length;
      console.log(`${(filter || '(ohne)').padEnd(16)} ${String(periods.length).padStart(3)} Stunden`
        + ` | absCheckNeeded ${zahl(p => p.absCheckNeeded)}`
        + ` | absChecked ${zahl(p => p.absChecked)}`);
      if (!periods.length) continue;
      /* Gegenprobe: welche Stunde des Tages ist offen, welche nicht. Nur so laesst sich
         sagen, ob "nicht offen" wirklich "kontrolliert" heisst - und ob eine Stunde, die
         noch gar nicht begonnen hat, ueberhaupt in der Liste steht. */
      const offen = new Set(periods.map(p => String(p.period?.id ?? p.id)));
      for (const l of await myLessons(tag, tag, session)) {
        console.log(`    ${l.start}  ${(l.subject || '').padEnd(8)} ${l.klassen.join(',').padEnd(18)}`
          + (offen.has(String(l.ttId)) ? 'OFFEN' : 'nicht offen') + (l.code ? `  [${l.code}]` : ''));
      }
    }
    return;
  }

  if (cmd === 'anwesenheit') {
    // "Anwesenheit kontrolliert" for every own lesson of the school year that has begun, was not
    // cancelled and is still "Abwesenheit offen" in WebUntis. --dry only lists them.
    const dry = process.argv.includes('--dry');
    const years = await rpc('getSchoolyears');
    const todayN = Number(ymd(new Date()));
    const year = years.find(y => Number(y.startDate) <= todayN && Number(y.endDate) >= todayN)
      || years[years.length - 1];
    const open = await ticksOpen(session, await myLessons(year.startDate, todayN, session));
    for (const l of open) console.log(`${l.date} ${l.start} ${l.subject} ${l.klassen.join(',')}`);
    if (!open.length) { console.log('Nichts offen.'); return; }
    if (dry) { console.log(`WUERDE "Anwesenheit kontrolliert" setzen: ${open.length} Stunden`); return; }
    await markAbsencesChecked(session, open);
    console.log(`"Anwesenheit kontrolliert" gesetzt: ${open.length} Stunden`);
    /* Damit der Stundenplan sein A sofort zeigt und nicht erst nach dem naechsten
       status-Lauf (Doc, 21.09.2026). Ohne Badge-Cache passiert hier nichts. */
    await patchStatus(session, [], open);
    return;
  }

  if (cmd === 'status') { await runStatus(session); return; }

  const map = { klassen: 'getKlassen', subjects: 'getSubjects', teachers: 'getTeachers', rooms: 'getRooms', timegrid: 'getTimegridUnits', holidays: 'getHolidays', years: 'getSchoolyears' };
  if (map[cmd]) { console.log(JSON.stringify(await rpc(map[cmd]), null, 2)); return; }

  // Machine-local commands hook in here: tools/webuntis.local.js (gitignored)
  // may export { commands: { name: async (toolbox) => {} } }. The public repo
  // carries only this hook, never those commands.
  const LOCAL_CMDS = path.join(__dirname, 'webuntis.local.js');
  if (fs.existsSync(LOCAL_CMDS)) {
    const local = require(LOCAL_CMDS);
    if (local.commands && local.commands[cmd]) {
      await local.commands[cmd]({ session, rpc, intern, post, ymd, parseYmd, REPO, args: process.argv.slice(3) });
      return;
    }
  }
  console.error(`Unknown command "${cmd}". Try: whoami | timetable [VON] [BIS] | topic <ttId> "<Text>" | plan [YYYYMMDD] [--dry] [--force] [--nur-stoff] | anwesenheit [--dry] | status | untis-push | ${Object.keys(map).join(' | ')}`);
  process.exit(1);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => { if (cookies) rpc('logout').catch(() => {}); });
