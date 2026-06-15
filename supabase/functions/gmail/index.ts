// Tracker/Labs — "gmail" Edge Function (SOLITA tool: READ-ONLY Gmail peek).
//
// ⚠️ INERT bis Doc es bewusst deployt UND die GMAIL_*-Secrets setzt. Solange nicht deployt, passiert NICHTS.
//
// Was es tut: liest READ-ONLY (Scope gmail.readonly) den Posteingang und meldet, ob/wie viele ungelesene
// Mails da sind + von wem (Absender + Betreff). Es sendet/löscht/markiert/ändert NICHTS. Blast-Radius: nur Lesen.
// Passwort-Gate wie die anderen Solita-Functions (x-app-pass == LABAI_PASSWORD).
//
// Sicherheit (Regel 18/21): KEIN Secret im Code. Client-ID, Client-Secret und Refresh-Token NUR als
//   Edge-Function-Secrets (Env). Das Refresh-Token + Client-Secret sind echte Secrets — niemals ins (public) Repo.
//
// Client contract:
//   { ping: true }                    -> { ok: true } (Passwort-Check)
//   { query?: "...", max?: 12 }       -> { ok, count, more, senders: [{ name, subject }] }
//   Default-Query: "is:unread in:inbox" (= „neue/ungelesene Mails").
//
// ── EINMALIGE EINRICHTUNG (Doc) ───────────────────────────────────────────────────────────────────
//  1) Google Cloud Console: Projekt wählen/erstellen → "Gmail API" aktivieren.
//  2) APIs & Services → Anmeldedaten → "OAuth-Client-ID erstellen" (Typ: Webanwendung).
//     Autorisierte Redirect-URI hinzufügen: https://developers.google.com/oauthplayground
//  3) OAuth-Zustimmungsbildschirm: Scope ".../auth/gmail.readonly" hinzufügen; Dich selbst als
//     Test-Nutzer eintragen (oder App auf "Produktion" → der "nicht verifiziert"-Hinweis ist als Eigentümer ok;
//     Produktion gibt ein langlebiges Refresh-Token, Test-Modus läuft nach 7 Tagen ab).
//  4) https://developers.google.com/oauthplayground öffnen → Zahnrad (oben rechts) → "Use your own OAuth
//     credentials" anhaken → Client-ID + Secret eintragen → links Scope
//     "https://www.googleapis.com/auth/gmail.readonly" autorisieren → "Exchange authorization code for tokens"
//     → das **refresh_token** kopieren.
//  5) Supabase-Secrets setzen (ein Mal):
//     supabase secrets set GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=... GMAIL_REFRESH_TOKEN=... --project-ref fyfhxzyymmurlaenmzse
//  6) Deploy:
//     supabase functions deploy gmail --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
//  (LABAI_PASSWORD existiert bereits als Secret — dasselbe Gate wie solita-config/solita-note.)

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

// Parse a raw "From" header ("Jane Doe <jane@x.com>" | "jane@x.com") into a friendly display name.
function fromName(raw: string): string {
  const m = String(raw || '').match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return (m[1].trim() || m[2].trim());
  return String(raw || '').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');
  const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GMAIL_REFRESH_TOKEN');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  if (!clientId || !clientSecret || !refreshToken) {
    return json({ error: 'GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN fehlen — als Edge-Function-Secrets setzen.' }, 500);
  }

  const query = (typeof b.query === 'string' && b.query.trim()) ? b.query.trim() : 'is:unread in:inbox';
  const max = Math.max(1, Math.min(25, parseInt(String(b.max), 10) || 12));

  let token: string;
  try {
    token = await getAccessToken(clientId, clientSecret, refreshToken);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 502);
  }
  const G = { 'Authorization': 'Bearer ' + token };

  // 1) list matching message ids (cheap; ids only)
  let ids: string[] = [];
  let estimate = 0;
  try {
    const u = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=' + max + '&q=' + encodeURIComponent(query);
    const r = await fetch(u, { headers: G });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: 'Gmail list ' + r.status + ': ' + (d?.error?.message || '') }, 502);
    ids = (d.messages || []).map((m: { id: string }) => m.id);
    estimate = typeof d.resultSizeEstimate === 'number' ? d.resultSizeEstimate : ids.length;
  } catch (e) {
    return json({ error: 'Gmail list fehlgeschlagen: ' + String((e as Error).message || e) }, 502);
  }

  if (!ids.length) return json({ ok: true, count: 0, more: false, senders: [] });

  // 2) From + Subject per message (parallel, metadata only — no body fetched)
  const senders = await Promise.all(ids.map(async (id) => {
    try {
      const u = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/' + id
        + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject';
      const r = await fetch(u, { headers: G });
      const d = await r.json().catch(() => ({}));
      const hs: Array<{ name: string; value: string }> = d?.payload?.headers || [];
      const from = hs.find((h) => h.name === 'From')?.value || '';
      const subject = hs.find((h) => h.name === 'Subject')?.value || '(kein Betreff)';
      return { name: fromName(from), subject };
    } catch {
      return null;
    }
  }));

  const clean = senders.filter(Boolean);
  const count = Math.max(estimate, clean.length);
  return json({ ok: true, count, more: count > clean.length, senders: clean });
});
