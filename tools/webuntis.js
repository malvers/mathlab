#!/usr/bin/env node
// Read-only WebUntis client for "Private Schule IBB gGmbH" (Dresden).
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

async function post(url, body) {
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
  if (json.error) throw new Error(`${json.error.message} (code ${json.error.code})`);
  return json.result;
}

async function rpc(method, params) {
  return post(`${BASE}/WebUntis/jsonrpc.do?school=${SCHOOL}`, { id: 'r', method, params: params ?? {}, jsonrpc: '2.0' });
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
    // Export one week as JSON for the local timetable view.
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
  const map = { klassen: 'getKlassen', subjects: 'getSubjects', teachers: 'getTeachers', rooms: 'getRooms', timegrid: 'getTimegridUnits', holidays: 'getHolidays', years: 'getSchoolyears' };
  if (map[cmd]) { console.log(JSON.stringify(await rpc(map[cmd]), null, 2)); return; }
  console.error(`Unknown command "${cmd}". Try: whoami | timetable [YYYYMMDD] [YYYYMMDD] | ${Object.keys(map).join(' | ')}`);
  process.exit(1);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => { if (cookies) rpc('logout').catch(() => {}); });
