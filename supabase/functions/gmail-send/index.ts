// Tracker/Labs — "gmail-send" Edge Function (SOLITA tool: send a mail TO DOC ONLY).
//
// ⚠️ INERT bis Doc es deployt UND die Send-Secrets setzt. Solange nicht deployt, passiert NICHTS.
//
// Was es tut: baut eine einfache Text-Mail und sendet sie via Gmail-API (Scope gmail.send) — Empfänger
// ist FEST (Env GMAIL_SEND_TO = Doc selbst), Claude kann den Empfänger NICHT setzen, nur Betreff + Inhalt.
// Kein Lesen, kein Löschen. Passwort-Gate wie die anderen Solita-Functions (x-app-pass == LABAI_PASSWORD).
//
// Sicherheit (Regel 18/21): KEIN Secret im Code. Client-ID/Secret/Refresh-Token + Empfänger NUR als
//   Edge-Function-Secrets (Env). Bewusst GETRENNTER Refresh-Token (gmail.send), damit Lesen (readonly)
//   und Senden sauber isoliert bleiben — ein Token kann nicht beides missbrauchen.
//
// Client contract:
//   { ping: true }                       -> { ok: true } (Passwort-Check)
//   { subject: "...", body: "..." }      -> sendet an GMAIL_SEND_TO, returns { ok, id }
//
// ── EINMALIGE EINRICHTUNG (Doc) ───────────────────────────────────────────────────────────────────
//  1) OAuth-Playground (developers.google.com/oauthplayground), Zahnrad → "Use your own OAuth credentials"
//     → DIESELBE Client-ID + Secret wie beim Lesen eintragen.
//  2) Scope-Feld: "https://www.googleapis.com/auth/gmail.send" → Authorize APIs → Konto wählen
//     → "unbestätigt" durchklicken → senden erlauben → "Exchange authorization code for tokens".
//  3) Das **refresh_token** (1//…) kopieren — das ist der SENDE-Token.
//  4) Secrets setzen (Client-ID/Secret existieren schon vom Lesen):
//     supabase secrets set GMAIL_SEND_REFRESH_TOKEN="1//…" GMAIL_SEND_TO="DEINE-GMAIL-ADRESSE" --project-ref fyfhxzyymmurlaenmzse
//  5) Deploy:
//     supabase functions deploy gmail-send --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// Fixed sign-off appended to EVERY outgoing mail, so Solita's mails are always clearly from us.
// Enforced server-side — the model cannot skip, shorten or alter it.
const SIGNATURE = '\n\nLieben Gruß\nSolita\n\n---\nDr. Solita J. Neural\nLead AI-Team\ndocalvers.de';

// UTF-8-safe base64url (for the raw RFC-822 message).
function b64url(s: string): string {
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// RFC-2047-encode a Subject only if it contains non-ASCII (umlauts etc.).
function encodeSubject(s: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(s)) return s;
  return '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(s))) + '?=';
}

// Exchange the long-lived send refresh token for a short-lived access token.
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
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');
  const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GMAIL_SEND_REFRESH_TOKEN');
  const to = Deno.env.get('GMAIL_SEND_TO');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  if (!clientId || !clientSecret || !refreshToken || !to) {
    return json({ error: 'GMAIL_CLIENT_ID/SECRET/SEND_REFRESH_TOKEN/SEND_TO fehlen — als Edge-Function-Secrets setzen.' }, 500);
  }

  const subject = (typeof b.subject === 'string' ? b.subject : '').trim() || '(ohne Betreff)';
  const bodyText = (typeof b.body === 'string' ? b.body : '').trim();
  if (!bodyText) return json({ error: 'kein body (Inhalt) übergeben' }, 400);
  if (subject.length > 300 || bodyText.length > 20000) return json({ error: 'Betreff/Inhalt zu lang' }, 400);

  // Always sign as Solita. Guard against a double sign-off if the model already wrote one.
  const signedBody = bodyText.includes('Dr. Solita J. Neural') ? bodyText : bodyText + SIGNATURE;

  let token: string;
  try {
    token = await getAccessToken(clientId, clientSecret, refreshToken);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 502);
  }

  // Build a minimal plain-text RFC-822 message. From is filled by Gmail (the authenticated account).
  const mime = [
    'To: ' + to,
    'Subject: ' + encodeSubject(subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    signedBody,
  ].join('\r\n');

  try {
    const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: b64url(mime) }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: 'Gmail send ' + r.status + ': ' + (d?.error?.message || '') }, 502);
    return json({ ok: true, id: d.id || null });
  } catch (e) {
    return json({ error: 'Gmail send fehlgeschlagen: ' + String((e as Error).message || e) }, 502);
  }
});
