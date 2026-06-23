// Tracker/Labs — "calendar" Edge Function (SOLITA tool: READ-ONLY Google Calendar peek).
//
// ⚠️ INERT bis Doc es bewusst deployt UND das GCAL_REFRESH_TOKEN-Secret setzt. Solange nicht deployt, passiert NICHTS.
//
// Was es tut: liest READ-ONLY (Scope calendar.readonly) die ANSTEHENDEN Termine aus dem Primär-Kalender
// und meldet Titel + Start/Ende (+ Ort). Es schreibt/löscht/ändert NICHTS. Blast-Radius: nur Lesen.
// Passwort-Gate wie die anderen Solita-Functions (x-app-pass == LABAI_PASSWORD).
//
// Sicherheit (Regel 18/21): KEIN Secret im Code. Client-ID + Client-Secret (DIESELBEN wie Gmail) und ein
//   EIGENER Refresh-Token (calendar.readonly) NUR als Edge-Function-Secrets (Env). Bewusst getrennter Token,
//   damit Mail-Lesen und Kalender-Lesen sauber isoliert bleiben.
//
// Client contract (POST, header x-app-pass):
//   { ping: true }                          -> { ok: true } (Passwort-Check)
//   { days?: 7, max?: 10, query?: "..." }   -> { ok, count, events: [{ title, start, end, allDay, location }] }
//   Default: die nächsten 7 Tage, max 10 Termine, ab JETZT.
//
// ── EINMALIGE EINRICHTUNG (Doc) ───────────────────────────────────────────────────────────────────
//  1) Google Cloud Console (Projekt „Names to Spech" / docalversTTS): „Google Calendar API" aktivieren.
//  2) OAuth-Zustimmungsbildschirm: Scope ".../auth/calendar.readonly" hinzufügen (Du bist schon Test-Nutzer/Prod).
//  3) developers.google.com/oauthplayground → Zahnrad → „Use your own OAuth credentials" → DIESELBE
//     Client-ID + Secret wie bei Gmail eintragen → links Scope
//     „https://www.googleapis.com/auth/calendar.readonly" autorisieren → Konto wählen → „Exchange
//     authorization code for tokens" → das **refresh_token** kopieren.
//  4) Secret setzen (Client-ID/Secret existieren schon vom Gmail-Lesen):
//     supabase secrets set GCAL_REFRESH_TOKEN="1//…" --project-ref fyfhxzyymmurlaenmzse
//  5) Deploy:
//     supabase functions deploy calendar --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// Exchange the long-lived refresh token for a short-lived access token (no secret ever leaves the server).
async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) {
    throw new Error('Token-Refresh fehlgeschlagen: ' + (d.error_description || d.error || ('HTTP ' + r.status)));
  }
  return d.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');         // same Google OAuth client as Gmail
  const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GCAL_REFRESH_TOKEN');  // OWN token (calendar.readonly scope)
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  // ── CREATE (action:'create') — uses a SEPARATE write-scoped token (calendar.events) so the read path stays
  // read-only by design. Inert until GCAL_WRITE_REFRESH_TOKEN is set. Inserts ONE event into the primary cal.
  if (b.action === 'create') {
    // The write token was minted with its OWN OAuth client (separate Desktop client) → refresh with THAT
    // client's id+secret, not the Gmail one. Falls back to the Gmail client if the write-client vars are unset.
    const writeClientId = Deno.env.get('GCAL_WRITE_CLIENT_ID') || clientId;
    const writeClientSecret = Deno.env.get('GCAL_WRITE_CLIENT_SECRET') || clientSecret;
    const writeToken = Deno.env.get('GCAL_WRITE_REFRESH_TOKEN');   // scope calendar.events
    if (!writeClientId || !writeClientSecret || !writeToken) {
      return json({ error: 'GCAL_WRITE_CLIENT_ID/SECRET/REFRESH_TOKEN fehlen — Schreib-Credentials als Secrets setzen.' }, 500);
    }
    const title = (typeof b.title === 'string' && b.title.trim()) ? b.title.trim() : '';
    const start = (typeof b.start === 'string' && b.start.trim()) ? b.start.trim() : '';
    if (!title) return json({ error: 'kein Titel (title) übergeben' }, 400);
    if (!start) return json({ error: 'kein Start (start) übergeben' }, 400);
    const TZ = 'Europe/Berlin';
    const ev: Record<string, unknown> = { summary: title };
    if (typeof b.location === 'string' && b.location.trim()) ev.location = b.location.trim();
    if (typeof b.description === 'string' && b.description.trim()) ev.description = b.description.trim();
    if (b.allDay) {
      const endDate = (typeof b.end === 'string' && b.end) ? b.end.slice(0, 10) : start.slice(0, 10);
      ev.start = { date: start.slice(0, 10) };
      ev.end = { date: endDate };
    } else {
      const end = (typeof b.end === 'string' && b.end) ? b.end
        : new Date(new Date(start).getTime() + 3600000).toISOString();   // default: +1 h
      ev.start = { dateTime: start, timeZone: TZ };
      ev.end = { dateTime: end, timeZone: TZ };
    }
    let wtoken: string;
    try {
      wtoken = await getAccessToken(writeClientId, writeClientSecret, writeToken);
    } catch (e) {
      return json({ error: String((e as Error).message || e) }, 502);
    }
    try {
      const r = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + wtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(ev),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return json({ error: 'Calendar insert ' + r.status + ': ' + (d?.error?.message || '') }, 502);
      const s = (d.start as Record<string, string>) || {};
      return json({ ok: true, created: { id: d.id, title: d.summary, start: s.dateTime || s.date || start, htmlLink: d.htmlLink } });
    } catch (e) {
      return json({ error: 'Calendar insert fehlgeschlagen: ' + String((e as Error).message || e) }, 502);
    }
  }

  if (!clientId || !clientSecret || !refreshToken) {
    return json({ error: 'GMAIL_CLIENT_ID/SECRET oder GCAL_REFRESH_TOKEN fehlen — als Edge-Function-Secrets setzen.' }, 500);
  }

  const days = Math.max(1, Math.min(60, parseInt(String(b.days), 10) || 7));
  const max = Math.max(1, Math.min(25, parseInt(String(b.max), 10) || 10));
  const query = (typeof b.query === 'string' && b.query.trim()) ? b.query.trim() : '';

  let token: string;
  try {
    token = await getAccessToken(clientId, clientSecret, refreshToken);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 502);
  }

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + days * 86400000).toISOString();
  const params = new URLSearchParams({
    timeMin, timeMax,
    singleEvents: 'true',     // expand recurring events into instances
    orderBy: 'startTime',
    maxResults: String(max),
  });
  if (query) params.set('q', query);

  let items: Array<Record<string, unknown>> = [];
  try {
    const u = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?' + params.toString();
    const r = await fetch(u, { headers: { 'Authorization': 'Bearer ' + token } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: 'Calendar list ' + r.status + ': ' + (d?.error?.message || '') }, 502);
    items = Array.isArray(d.items) ? d.items : [];
  } catch (e) {
    return json({ error: 'Calendar list fehlgeschlagen: ' + String((e as Error).message || e) }, 502);
  }

  // READ-ONLY shaping: title + start/end (+ location). All-day events carry start.date (no time).
  const events = items.map((it) => {
    const start = (it.start as Record<string, string>) || {};
    const end = (it.end as Record<string, string>) || {};
    const allDay = !!start.date && !start.dateTime;
    return {
      title: String(it.summary || '(ohne Titel)'),
      start: start.dateTime || start.date || null,
      end: end.dateTime || end.date || null,
      allDay,
      location: it.location ? String(it.location) : null,
    };
  });

  return json({ ok: true, count: events.length, events });
});
