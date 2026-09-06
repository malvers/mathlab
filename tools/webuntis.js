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

// The browser's own text builders, evaluated straight out of svp-plan.js.
// untisPlain  - LaTeX to readable plain text (WebUntis cannot render $...$)
// untisFit    - fit to 250 chars in three stages (full / abbreviated / drop whole steps)
// untisSpread - one step per lesson, per learning group, "Festigung: ..." for the rest
// untisBlocks - fold gapless periods of one lesson into ONE classbook entry
let browserFns = null;
function browser() {
  if (browserFns) return browserFns;
  const src = fs.readFileSync(ABBREV_SRC, 'utf8');
  const names = ['untisAbbrev', 'untisPlain', 'untisFit', 'untisSpread', 'untisBlocks'];
  const parts = names.map(n => {
    const f = extractFunction(src, n);
    if (!f) throw new Error(`${n}() nicht in ${path.relative(REPO, ABBREV_SRC)} gefunden - Namen geaendert?`);
    return f;
  });
  const table = extractLiteral(src, 'SVP_ABBREV', '[', ']') || [];
  browserFns = new Function('SVP_ABBREV', 'UNTIS_MAX', `
    const window = { SVP_ABBREV };
    let abbrevRules = null;
    ${parts.join('\n')}
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
      /* The page needs the code: a cancelled lesson must not count as "still to write", and in
         Termin mode a day that fell away entirely must not eat an appointment (Doc's rule
         "a holiday only shifts the group it hits" only works if the page can see it). */
      code: l.code || '',
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
    const outW = path.join(REPO, 'HTML', 'svp', 'untis-written.json');
    fs.writeFileSync(outW, JSON.stringify({ generated: new Date().toISOString(), written }, null, 1));
    console.log(`${path.relative(REPO, outW)}: ${written.length} Stunden mit Stoff`);
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
    // Since 06.09.2026 this also handles Termin-mode pages (block teaching, fos12) and builds
    // its text with the browser's own functions, so both ways write the same line.
    const args = process.argv.slice(3);
    const dry = args.includes('--dry');
    const force = args.includes('--force');
    const line = args.includes('--line');
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
    const all = (await myLessons(year.startDate, year.endDate, session)).filter(l => pageFor(l, pages));
    const lessons = all.filter(l => Number(l.date) >= Number(from) && Number(l.date) <= Number(to));
    if (!lessons.length) {
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
      const groups = [...new Set(open.map(p => p.l.klassen.join(',')))];
      if (dry || !open.length) {
        console.log('KLASSENBUCH: ' + (open.length
          ? `${open.length} Stunde${open.length === 1 ? '' : 'n'} ohne Lernstoff` + (groups.length ? ' \u00b7 ' + groups.join(', ') : '')
          : 'alles eingetragen'));
        process.exitCode = open.length ? 1 : 0;
        return;
      }
      // Writing: report AFTER the fact, otherwise the caller shows the state from before its own
      // click. Every entry is read back; only a confirmed one counts.
      let done = 0; const bad = [];
      for (const p of open) {
        const label = `${p.l.date.slice(6)}.${p.l.date.slice(4, 6)}. ${p.l.start} ${p.l.klassen.join(',')}`;
        try {
          await writeTopic(p.l.ttId, p.text);
          const back = (await readTopics([p.l.ttId]))[String(p.l.ttId)] || '';
          if (back.trim() === p.text.trim()) done++; else bad.push(label);
        } catch (e) { bad.push(`${label} (${e.message})`); }
      }
      await runStatus(session);
      console.log('KLASSENBUCH: ' + `${done} Stunde${done === 1 ? '' : 'n'} eingetragen`
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

    let written = 0;
    for (const p of open) {
      const label = `${p.l.date} ${p.l.start} ${p.l.subject} ${p.l.klassen.join(',')}`;
      if (dry) { say(`${label}: WUERDE schreiben (${p.why}) -> ${p.text}`); continue; }
      await writeTopic(p.l.ttId, p.text);
      const back = (await readTopics([p.l.ttId]))[String(p.l.ttId)] || '';
      const ok = back.trim() === p.text.trim();
      if (ok) written++;
      say(`${label}: ${ok ? 'eingetragen' : 'FEHLER, Rueckgelesenes weicht ab'} -> ${back}`);
    }
    if (!open.length) say('Nichts offen - alles steht schon im Klassenbuch.');
    if (unmapped.size) say(`Ohne Planseite (in ${path.basename(MAP_FILE)} nachtragen): ${[...unmapped].join(', ')}`);
    if (written) { say('Badge-Daten aktualisieren:'); await runStatus(session); }
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
  console.error(`Unknown command "${cmd}". Try: whoami | timetable [VON] [BIS] | topic <ttId> "<Text>" | plan [YYYYMMDD] [--dry] [--force] | status | ${Object.keys(map).join(' | ')}`);
  process.exit(1);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => { if (cookies) rpc('logout').catch(() => {}); });
