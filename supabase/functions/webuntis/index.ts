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
      /* lsnumber + end let the page fold a Doppelstunde into ONE box: WebUntis
         keeps one classbook entry for back-to-back periods of the same lesson
         (measured 31.08.2026 - writing 12:00 instantly showed on 12:45). */
      lsnumber: l.lsnumber ?? null,
    }))
    .sort((a: any, b: any) => Number(a.date) - Number(b.date) || a.start.localeCompare(b.start));
}

/* Stored topic + this lesson's own rights. `can` is the honest way to know whether a write is
   allowed (own lesson: WRITE_LESSONTOPIC; a colleague's: read only) instead of trying it out. */
async function periodState(u: Untis, ttIds: number[]) {
  const out: Record<string, { topic: string; can: string[] }> = {};
  for (let i = 0; i < ttIds.length; i += 50) {
    const r = await u.intern('getPeriodData2017', { ttIds: ttIds.slice(i, i + 50) });
    if (r.error) throw new Error(`${r.error.message} (code ${r.error.code})`);
    for (const [id, d] of Object.entries<any>(r.result?.dataByTTId || {})) {
      out[id] = { topic: d?.topic?.text || '', can: Array.isArray(d?.can) ? d.can : [] };
    }
  }
  return out;
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
      const state = lessons.length ? await periodState(u, lessons.map((l: any) => l.ttId)) : {};
      return json({
        lessons: lessons.map((l: any) => ({
          ...l,
          topic: state[String(l.ttId)]?.topic || '',
          writable: (state[String(l.ttId)]?.can || []).includes('WRITE_LESSONTOPIC'),
        })),
      });
    }

    /* Write one lesson topic. Never silently overwrites a DIFFERENT existing text — a correction
       Doc made by hand in WebUntis always wins unless he explicitly forces. */
    if (action === 'write') {
      const ttId = Number(b.ttId);
      const topic = String(b.topic ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_TOPIC);
      if (!Number.isInteger(ttId) || ttId <= 0) return json({ error: 'ttId fehlt' }, 400);
      if (!topic) return json({ error: 'Text ist leer' }, 400);

      const state = (await periodState(u, [ttId]))[String(ttId)];
      if (!state) return json({ error: 'Stunde nicht gefunden (ttId ' + ttId + ')' }, 404);
      if (!state.can.includes('WRITE_LESSONTOPIC')) {
        return json({ error: 'keine Schreibrechte für diese Stunde', previous: state.topic }, 403);
      }
      if (state.topic.trim() === topic) return json({ ok: true, ttId, topic, unchanged: true });
      if (state.topic.trim() && !b.force) {
        return json({ error: 'steht schon etwas anderes drin', previous: state.topic, conflict: true }, 409);
      }

      const w = await u.intern('submitLessonTopic', { ttId, lessonTopic: topic });
      if (w.error) return json({ error: `${w.error.message} (code ${w.error.code})` }, 502);

      /* Read back — a {"success":true} is not proof that the text arrived as sent. */
      const after = (await periodState(u, [ttId]))[String(ttId)]?.topic || '';
      return json({ ok: after.trim() === topic, ttId, topic, stored: after, previous: state.topic });
    }

    return json({ error: 'unbekannte action' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
});
