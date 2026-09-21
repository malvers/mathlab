// SVP — "webuntis" Edge Function: write the classbook lesson topic straight from a plan page.
//
// Why a proxy at all: WebUntis sends no CORS headers, so the browser can never talk to
// ibb-ggmbh.webuntis.com itself, and the Untis-Mobile app secret (a TOTP seed) must never sit in a
// public page (CLAUDE.md rule 18). Both problems disappear server-side — the secret lives in the
// function's environment, the browser only ever sees this function.
//
// This mirrors tools/webuntis.js (Node, Doc's machine) one-to-one; the hard-won details are the same:
//   • writing goes through the MOBILE api (jsonrpc_intern.do) — the public jsonrpc.do has no write
//     methods at all
//   • the id field of submitLessonTopic is `ttId`, NOT `periodId` ("period 0 not found")
//   • `lessonTopic` is a FLAT string — a nested object trips the server's Jackson parser
//   • the server rejects a drifting clientTime, so the offset is measured at login
//   • verification reads getPeriodData2017 (plural `ttIds`), because getLessonTopic2017 only ever
//     returns the suggestion list, never the stored text
//
// DSGVO: getPeriodData2017 also returns `referencedStudents` — full names and dates of birth, for
// foreign lessons too. Nothing from that field ever leaves this function; we read `topic` and `can`.
//
// Deploy (JWT verification is done in code against the caller's Supabase session, not by the
// platform, so the browser can send its own Bearer token):
//   supabase secrets set WEBUNTIS_USER=... WEBUNTIS_SECRET=... --project-ref fyfhxzyymmurlaenmzse
//   supabase functions deploy webuntis --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse

const SCHOOL = 'ibb-ggmbh';
const BASE = 'https://ibb-ggmbh.webuntis.com';

/* Who may write into the school's classbook. One address by default; SVP_EDITOR_EMAILS (comma
   separated) overrides it without a redeploy of this file. A 403 names the address it actually saw,
   so a mismatch is obvious instead of mysterious. */
const DEFAULT_EDITORS = ['info@docalvers.de'];

const MAX_TOPIC = 250;          // WebUntis truncates beyond this anyway

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// ---------- TOTP (RFC 6238, HMAC-SHA1, 30 s step) ----------

function base32Decode(s: string): Uint8Array {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of s.toUpperCase().replace(/[=\s]/g, '')) {
    const i = A.indexOf(c);
    if (i < 0) continue;
    bits += i.toString(2).padStart(5, '0');
  }
  const out: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2));
  return new Uint8Array(out);
}

async function totp(secret: string, timeMs: number): Promise<number> {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setBigUint64(0, BigInt(Math.floor(timeMs / 1000 / 30)));
  const key = await crypto.subtle.importKey(
    'raw', base32Decode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf));
  const off = sig[sig.length - 1] & 0x0f;
  return ((sig[off] & 0x7f) << 24 | sig[off + 1] << 16 | sig[off + 2] << 8 | sig[off + 3]) % 1000000;
}

// ---------- transport: one WebUntis session per request ----------

class Untis {
  cookies = '';
  drift = 0;
  user = '';
  secret = '';

  async post(url: string, body: unknown, raw = false): Promise<any> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(this.cookies ? { Cookie: this.cookies } : {}) },
      body: JSON.stringify(body),
    });
    /* getSetCookie() is the only way to see more than one Set-Cookie; fall back for older runtimes. */
    const raws = typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [res.headers.get('set-cookie') || ''];
    for (const c of raws) {
      const kv = c.split(';')[0];
      if (/^(JSESSIONID|schoolname|traceId)=/.test(kv)) this.cookies = this.cookies ? `${this.cookies}; ${kv}` : kv;
    }
    const j = await res.json();
    if (raw) return j;
    if (j.error) throw new Error(`${j.error.message} (code ${j.error.code})`);
    return j.result;
  }

  rpc(method: string, params: unknown) {
    return this.post(`${BASE}/WebUntis/jsonrpc.do?school=${SCHOOL}`,
      { id: 'r', method, params: params ?? {}, jsonrpc: '2.0' });
  }

  /* Every intern call carries its own fresh OTP — the session cookie alone is not enough. */
  async intern(method: string, params: Record<string, unknown>) {
    const now = Date.now() + this.drift;
    const auth = { clientTime: now, user: this.user, otp: await totp(this.secret, now) };
    return this.post(`${BASE}/WebUntis/jsonrpc_intern.do?m=${method}&school=${SCHOOL}&v=i2.2`,
      { id: 'i', method, params: [{ auth, ...params }], jsonrpc: '2.0' }, true);
  }

  async login(user: string, secret: string) {
    /* Probe with a deliberately invalid OTP: the error carries the server's own clock, which is what
       every later clientTime has to be based on. */
    const probe = await fetch(`${BASE}/WebUntis/jsonrpc_intern.do?m=getUserData2017&school=${SCHOOL}&v=i2.2`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 't', method: 'getUserData2017', jsonrpc: '2.0',
        params: [{ auth: { clientTime: 0, user, otp: 0 } }],
      }),
    }).then(r => r.json()).catch(() => ({}));
    const now = probe?.error?.data?.serverTime ?? Date.now();
    const result = await this.post(`${BASE}/WebUntis/jsonrpc_intern.do?m=getUserData2017&school=${SCHOOL}&v=i2.2`, {
      id: 'a', method: 'getUserData2017', jsonrpc: '2.0',
      params: [{ auth: { clientTime: now, user, otp: await totp(secret, now) } }],
    });
    const sn = `schoolname="${btoa('_' + SCHOOL)}"`;
    this.cookies = this.cookies ? `${this.cookies}; ${sn}` : sn;
    this.drift = now - Date.now();
    this.user = user;
    this.secret = secret;
    return result.userData;
  }
}

// ---------- lessons ----------

const ELEM_TYPE: Record<string, number> = { CLASS: 1, KLASSE: 1, TEACHER: 2, SUBJECT: 3, ROOM: 4, STUDENT: 5 };

function hhmm(t: unknown) { return String(t).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'); }

/* My own lessons in a date range, with the ttId that writing needs. The secret login reports
   elemType as a STRING ("TEACHER"), the password login as a number — unmapped, getTimetable
   silently returns nothing. */
async function myLessons(u: Untis, userData: any, from: string, to: string) {
  const id = userData?.elemId ?? userData?.personId;
  const rawType = userData?.elemType ?? userData?.personType ?? 2;
  const type = typeof rawType === 'string' ? (ELEM_TYPE[rawType.toUpperCase()] ?? 2) : rawType;
  const tt = await u.rpc('getTimetable', {
    options: {
      element: { id, type }, startDate: Number(from), endDate: Number(to),
      klasseFields: ['id', 'name'], subjectFields: ['id', 'name'], roomFields: ['id', 'name'],
    },
  });
  return (tt || [])
    .filter((l: any) => (l.kl || []).length && l.su?.[0])
    .map((l: any) => ({
      ttId: l.id, date: String(l.date), start: hhmm(l.startTime), end: hhmm(l.endTime),
      subject: l.su[0].name, klassen: l.kl.map((k: any) => k.name), code: l.code || '',
      /* end lets the page fold a Doppelstunde into ONE box: WebUntis keeps one
         classbook entry for back-to-back periods of the same lesson (measured
         31.08.2026 - writing 12:00 instantly showed on 12:45). lsnumber would
         sharpen the fold but this RPC returns it as null in practice. */
      lsnumber: l.lsnumber ?? null,
    }))
    .sort((a: any, b: any) => Number(a.date) - Number(b.date) || a.start.localeCompare(b.start));
}

/* The stored classbook text of ONE period - the clean way, measured 06.09.2026.
   `getPeriodData2017` used to do this and was switched off on 02.09.2026 because it also carries
   `referencedStudents` (full names, dates of birth, even for foreign lessons). This endpoint
   answers with nothing but the lesson's own data:
     {"data":{"lessonTopic":{id,date,startTime,endTime,subject,teacher,klasse,text,attachments}}}
   HTTP 500 is not an error here, it is how WebUntis says "no entry for this period"; an entry
   with an empty text comes back as 200 with text:"". A single GET per period, so the caller
   paces them. This restores BOTH the overwrite protection and the read-back verification. */
async function readTopic(u: Untis, ttId: number): Promise<string | null> {
  const res = await fetch(`${BASE}/WebUntis/api/classreg/lessontopic?periodId=${ttId}`, {
    headers: { Cookie: u.cookies, Accept: 'application/json' },
  });
  const text = await res.text();
  /* Belt and braces: should this endpoint ever start carrying student data, stop rather than
     quietly pass it on (Doc, 02.09.2026). */
  if (/"(referencedStudents|students|studentIds)"/.test(text)) {
    throw new Error('Unerwartete Schuelerdaten in der Antwort - Abbruch.');
  }
  if (res.status !== 200) return null;
  try { return JSON.parse(text)?.data?.lessonTopic?.text ?? ''; } catch { return null; }
}

/* Same for a list of periods, gently paced. Returns '' for "no entry". */
async function readTopics(u: Untis, ttIds: number[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const id of ttIds) {
    out[String(id)] = (await readTopic(u, id)) ?? '';
    await new Promise(r => setTimeout(r, 110));
  }
  return out;
}

/* "Anwesenheit kontrolliert" (14.09.2026, Doc: "Freitag NICHT gesetzt"): a topic sent from the SVP
   dialog now also sets the tick - but only for a lesson that has already begun and was not
   cancelled (attendance is taken at the start; a topic typed in ahead of time must not claim it).
   Measured 14.09.2026: submitAbsencesChecked2017 (BetterUntis' call) answers {} but changes
   nothing on this server. What works is the web UI's own button, the legacy class register form
   POST /WebUntis/classregpage.do?ttid=X (reload, ttid, _csrf, absencechecked=absencechecked); the
   session-wide CSRF token comes from the EMPTY embedded.do shell, so the class register page with
   its student list is never loaded. Read back through classreg/open-periods (no student fields).
   Mirrors markAbsencesChecked() in tools/webuntis.js. The function runs in UTC, the timetable in
   Dresden time - hence berlinNow(). */
function berlinNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { ymd: `${p.year}${p.month}${p.day}`, hm: `${p.hour}:${p.minute}` };
}

/* Die eine Stunde unter Docs eigenen heraussuchen. Eigene Funktion, seit der Schreibweg sie
   zweimal braucht - einmal fuer den Haken, einmal fuer die Marke auf der Stundenplan-Kachel;
   zwei Abrufe des ganzen Schuljahres je Klick waeren Verschwendung.
   The range must stay inside ONE school year - WebUntis rejects anything across the boundary
   ("startDate and endDate are not within a single school year", code -8507). Measured
   15.09.2026: the old "200 days back" died on exactly that, so the first live writes set no
   tick at all. Same lookup as the CLI's `anwesenheit`. */
async function ownLesson(u: Untis, userData: any, ttId: number) {
  const now = berlinNow();
  const todayN = Number(now.ymd);
  const year = ((await u.rpc('getSchoolyears', {})) || [])
    .find((y: any) => Number(y.startDate) <= todayN && Number(y.endDate) >= todayN);
  const from = year ? String(year.startDate) : now.ymd;
  return (await myLessons(u, userData, from, now.ymd)).find((x: any) => x.ttId === ttId) || null;
}

async function tickIfBegun(u: Untis, userData: any, ttId: number, known?: any): Promise<true | string> {
  const now = berlinNow();
  const l = known ?? await ownLesson(u, userData, ttId);
  if (!l) return 'nicht unter den eigenen Stunden bis heute';
  if (l.code === 'cancelled') return 'Stunde ausgefallen';
  if (l.date === now.ymd && l.start > now.hm) return 'Stunde hat noch nicht begonnen';

  /* CSRF token from the empty shell page - never from the class register page itself */
  const shell = await fetch(`${BASE}/WebUntis/embedded.do?isEmbeddedInModal=true`, { headers: { Cookie: u.cookies } });
  const sc = typeof shell.headers.getSetCookie === 'function' ? shell.headers.getSetCookie() : [];
  for (const c of sc) u.cookies += '; ' + c.split(';')[0];
  const csrf = ((await shell.text()).match(/"csrfToken":"([^"]+)"/) || [])[1];
  if (!csrf) return 'csrfToken nicht gefunden';

  const res = await fetch(`${BASE}/WebUntis/classregpage.do?ttid=${ttId}`, {
    method: 'POST',
    headers: { Cookie: u.cookies, 'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'X-CSRF-TOKEN': csrf },
    body: new URLSearchParams({ reload: '0', ttid: String(ttId), _csrf: csrf, absencechecked: 'absencechecked' }),
  });
  await res.text();   /* ~100 bytes {args, method, success, onSuccessCall} - not passed on */
  if (!res.ok) return `classregpage.do HTTP ${res.status}`;

  /* read back: is the period still listed as "Abwesenheit offen"? */
  const jwt = (await (await fetch(`${BASE}/WebUntis/api/token/new`, { headers: { Cookie: u.cookies } })).text()).trim();
  const iso = `${l.date.slice(0, 4)}-${l.date.slice(4, 6)}-${l.date.slice(6, 8)}`;
  const op = await fetch(`${BASE}/WebUntis/api/rest/view/v1/classreg/open-periods`, {
    method: 'POST',
    headers: { Cookie: u.cookies, Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ teacherId: userData?.elemId, filter: 'ABSENCE_OPEN', dateRange: { start: iso, end: iso } }),
  }).then(r => r.json());
  const still = (op.periods || []).some((p: any) => p.period?.id === ttId && p.absCheckNeeded && !p.absChecked);
  return still ? 'WebUntis hat den Haken nicht uebernommen' : true;
}

/* Die Marken der Stundenplan-Kacheln nachtragen (Doc, 21.09.2026: "wenn ich den heute druecke,
   wird dann A auch gesetzt? Bitte!"). stundenplan.html zeichnet sein L (Lehrstoff steht im
   Klassenbuch) und sein A (Anwesenheit kontrolliert) aus der Zeile `_written` in svp_untis. Die
   schrieb bisher NUR tools/webuntis.js - nach einem Klick im Plan blieb die Kachel darum bis zum
   naechsten Abgleich (06:00/12:30 oder "WebUntis holen") ohne Marke stehen, obwohl in WebUntis
   laengst beides stand. Also traegt diese Funktion ihren eigenen Schreibvorgang gleich dort ein.
   Nur HINZUFUEGEN, nie streichen: sie sieht immer nur die eine Stunde, die sie gerade schreibt -
   aufraeumen bleibt Sache des vollen status-Laufs, der alle Stunden kennt.
   Und: das hier darf NIE den Schreibweg kippen. Faellt es aus, fehlt hoechstens eine Marke bis
   zum naechsten Abgleich; der Eintrag in WebUntis steht so oder so. */
async function noteMark(lesson: any, hasTopic: boolean, ticked: boolean) {
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!url || !key || !lesson) return;
  if (!hasTopic && !ticked) return;
  const mark = `${lesson.date}|${lesson.start}|${(lesson.klassen || []).join(',')}`;
  const head = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
  const res = await fetch(`${url}/rest/v1/svp_untis?page=eq._written&select=data`, { headers: head });
  if (!res.ok) return;
  const rows = await res.json().catch(() => []);
  if (!Array.isArray(rows) || !rows.length) return;   /* noch nie gebaut - der status-Lauf legt sie an */
  const data = rows[0].data || {};
  const written = new Set<string>(data.written || []);
  const checked = new Set<string>(data.checked || []);
  const vorher = written.size + checked.size;
  if (hasTopic) written.add(mark);
  if (ticked) checked.add(mark);
  if (written.size + checked.size === vorher) return;   /* stand beides schon drin */
  const generated = new Date().toISOString();
  data.written = [...written].sort();
  data.checked = [...checked].sort();
  data.generated = generated;
  await fetch(`${url}/rest/v1/svp_untis?page=eq._written`, {
    method: 'PATCH',
    headers: { ...head, Prefer: 'return=minimal' },
    body: JSON.stringify({ data, generated }),
  });
}

// ---------- handler ----------

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST erwartet' }, 405);

  const supaUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const wuUser = Deno.env.get('WEBUNTIS_USER') ?? '';
  const wuSecret = Deno.env.get('WEBUNTIS_SECRET') ?? '';
  if (!wuUser || !wuSecret) {
    return json({ error: 'WEBUNTIS_USER / WEBUNTIS_SECRET fehlen — als Edge-Function-Secrets setzen.' }, 500);
  }

  // --- gate: only Doc's logged-in svp session may touch the classbook ---
  const editors = (Deno.env.get('SVP_EDITOR_EMAILS') || DEFAULT_EDITORS.join(','))
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const userRes = await fetch(supaUrl + '/auth/v1/user', {
    headers: { apikey: anonKey, Authorization: req.headers.get('Authorization') ?? '' },
  });
  const caller = await userRes.json().catch(() => ({}));
  const email = String((caller as { email?: string }).email || '').toLowerCase();
  if (!userRes.ok || !email || !editors.includes(email)) {
    return json({ error: 'nicht autorisiert' + (email ? ` (${email})` : ''), seen: email || null }, 403);
  }

  const b = await req.json().catch(() => ({}));
  const action = String(b.action || '');

  const u = new Untis();
  let userData: any;
  try {
    userData = await u.login(wuUser, wuSecret);
  } catch (e) {
    return json({ error: 'WebUntis-Login fehlgeschlagen: ' + (e as Error).message }, 502);
  }

  try {
    /* List my lessons of a day/range together with what already stands in the classbook. */
    if (action === 'lessons') {
      const from = /^\d{8}$/.test(String(b.from)) ? String(b.from) : '';
      const to = /^\d{8}$/.test(String(b.to)) ? String(b.to) : from;
      if (!from) return json({ error: 'from/to als YYYYMMDD erwartet' }, 400);
      const lessons = await myLessons(u, userData, from, to);
      /* Der Stand aus WebUntis, wieder ohne Schuelerdaten (readTopic, 06.09.2026). Damit sieht
         der Dialog erneut, wo schon etwas steht, und der Ueberschreibschutz greift.
         `writable` bleibt true: myLessons liefert nur DOCS EIGENE Stunden, und das `can` der
         Stunde kam nur aus getPeriodData2017. Fehlt das Recht doch, antwortet WebUntis beim
         Schreiben selbst mit einem Fehler. */
      const topics = await readTopics(u, lessons.map((l: any) => l.ttId));
      return json({
        lessons: lessons.map((l: any) => ({ ...l, topic: topics[String(l.ttId)] || '', writable: true })),
      });
    }

    /* Write one lesson topic. Never silently overwrites a DIFFERENT existing text — a correction
       Doc made by hand in WebUntis always wins unless he explicitly forces. */
    if (action === 'write') {
      const ttId = Number(b.ttId);
      const topic = String(b.topic ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_TOPIC);
      if (!Number.isInteger(ttId) || ttId <= 0) return json({ error: 'ttId fehlt' }, 400);
      if (!topic) return json({ error: 'Text ist leer' }, 400);

      /* Ueberschreibschutz: steht schon ein ANDERER Text drin, gewinnt die Handkorrektur -
         geschrieben wird dann nur mit force. Wieder moeglich seit dem sauberen Leseweg
         (06.09.2026); zwischen dem 02. und dem 06.09. war dieser Schutz weg. */
      const before = await readTopic(u, ttId);
      if (before !== null && before.trim() && before.trim() !== topic && !b.force) {
        return json({ ok: false, conflict: true, ttId, topic, stored: before,
          error: 'In WebUntis steht bereits ein anderer Text.' });
      }
      /* Einmal heraussuchen, zweimal gebraucht: fuer den Haken und fuer die Marke. */
      const lesson = await ownLesson(u, userData, ttId).catch(() => null);

      if (before !== null && before.trim() === topic) {
        const absenceChecked = await tickIfBegun(u, userData, ttId, lesson).catch(e => (e as Error).message);
        await noteMark(lesson, true, absenceChecked === true).catch(() => { });
        return json({ ok: true, ttId, topic, stored: before, unchanged: true, absenceChecked });
      }

      const w = await u.intern('submitLessonTopic', { ttId, lessonTopic: topic });
      if (w.error) return json({ error: `${w.error.message} (code ${w.error.code})` }, 502);

      /* Zurueckelesen statt glauben: WebUntis antwortet auch dann success, wenn es den Text
         verwirft oder kappt. Was hier als `stored` zurueckgeht, steht wirklich drin. */
      const after = await readTopic(u, ttId);
      const stored = after ?? '';
      /* the lesson was held either way - the tick does not depend on the read-back */
      const absenceChecked = await tickIfBegun(u, userData, ttId, lesson).catch(e => (e as Error).message);
      /* L nur, wenn wirklich etwas drinsteht - sonst leuchtete die Kachel fuer ein leeres
         Klassenbuch, genau wie der Chip im Plan es vermeidet. */
      await noteMark(lesson, !!stored.trim(), absenceChecked === true).catch(() => { });
      return json({ ok: stored.trim() === topic.trim(), ttId, topic, stored, absenceChecked });
    }

    return json({ error: 'unbekannte action' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
});
