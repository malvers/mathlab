// Shared Gmail sender for the functions that mail Doc himself (todo-mail; gmail-send has its own copy
// from before this file and can move here with its next deploy).
//
// Sends a plain-text mail through the Gmail API (scope gmail.send) with the send refresh token that is
// already set up for gmail-send. The recipient is FIXED: env GMAIL_SEND_TO, Doc's own address - a caller
// can set subject and text, never the recipient.
//
// Secrets (rule 18/21): none in code. GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_SEND_REFRESH_TOKEN and
// GMAIL_SEND_TO are Edge-Function secrets of the project, shared by every function in it.

/* UTF-8-safe base64url, for the raw RFC-822 message. */
function b64url(s: string): string {
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* RFC-2047 for a subject with umlauts; plain ASCII stays as it is. */
function encodeSubject(s: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(s)) return s;
  return '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(s))) + '?=';
}

/* The long-lived send refresh token for a short-lived access token. */
async function accessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token',
    }).toString(),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) throw new Error('Token-Refresh fehlgeschlagen: ' + (d.error_description || d.error || 'HTTP ' + r.status));
  return d.access_token as string;
}

/** Mails `text` with `subject` to Doc (GMAIL_SEND_TO). Returns the Gmail message id, throws on any failure. */
export async function mailDoc(subject: string, text: string): Promise<string | null> {
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');
  const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GMAIL_SEND_REFRESH_TOKEN');
  const to = Deno.env.get('GMAIL_SEND_TO');
  if (!clientId || !clientSecret || !refreshToken || !to) {
    throw new Error('GMAIL_CLIENT_ID/SECRET/SEND_REFRESH_TOKEN/SEND_TO fehlen (Edge-Function-Secrets)');
  }
  const mime = [
    'To: ' + to,
    'Subject: ' + encodeSubject(subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
  ].join('\r\n');
  const token = await accessToken(clientId, clientSecret, refreshToken);
  const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: b64url(mime) }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error('Gmail send ' + r.status + ': ' + (d?.error?.message || ''));
  return d.id || null;
}
