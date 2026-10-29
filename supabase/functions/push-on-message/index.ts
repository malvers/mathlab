// VGP — push-on-message Edge Function (deployed under the slug "dynamic-responder").
// Triggered by a Database Webhook on `messages` INSERT. Sends a CONTENT-LESS web-push ping
// ("you have a new message") to the recipients' subscriptions. E2E: the server can't read the
// message, so nothing decryptable is ever sent — just a wakeup that makes the SW show a generic
// notification. VAPID is signed here with Web Crypto (ES256); no external dependency.
//
// Kontakt (the pupils' chat, webhook "ping-on-sprechstunde" on `chat_msg`): goes to Doc's Kontakt app
// (HTML/kontakt/), not to VGP - the device that tapped the app's bell, kept in chat_config (push_endpoint,
// push_key, push_auth). The ping carries a fixed label, sealed for the device (encrypt.ts, RFC 8291), so
// the phone says "Nachricht vom Stundenplan". Still nothing from the message itself.
//
// Secrets to set (dashboard → Edge Functions → Secrets):
//   VAPID_PUBLIC   – base64url of the 65-byte public point (same one the client uses)
//   VAPID_PRIVATE  – base64url of the 32-byte private scalar (SERVER ONLY)
//   VAPID_SUBJECT  – a contact URI, e.g. "mailto:you@example.com"
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { encryptPush } from './encrypt.ts';

// What the service worker (HTML/sw.js) shows for a Kontakt message.
const KONTAKT = { title: 'Nachricht vom Stundenplan', body: 'Kontakt' };
const KONTAKT_KEYS = ['push_endpoint', 'push_key', 'push_auth'];

const b64urlToBytes = (s: string): Uint8Array => {
  const b64 = (s + '='.repeat((4 - (s.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
};
const bytesToB64url = (b: Uint8Array): string =>
  btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// Import the VAPID private key (raw scalar + public point → JWK) as an ECDSA P-256 signing key.
let signKeyPromise: Promise<CryptoKey> | null = null;
function vapidSignKey(): Promise<CryptoKey> {
  if (!signKeyPromise) {
    const pub = b64urlToBytes(Deno.env.get('VAPID_PUBLIC')!);          // 0x04 || X(32) || Y(32)
    const jwk = {
      kty: 'EC', crv: 'P-256',
      x: bytesToB64url(pub.slice(1, 33)),
      y: bytesToB64url(pub.slice(33, 65)),
      d: Deno.env.get('VAPID_PRIVATE')!,
    };
    signKeyPromise = crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  }
  return signKeyPromise;
}

// Build the "Authorization: vapid t=<jwt>, k=<pub>" header for a given push endpoint.
async function vapidAuthHeader(endpoint: string): Promise<string> {
  const header = bytesToB64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = bytesToB64url(new TextEncoder().encode(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@vgp.local',
  })));
  const signingInput = `${header}.${payload}`;
  const sig = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, await vapidSignKey(), new TextEncoder().encode(signingInput)));
  return `vapid t=${signingInput}.${bytesToB64url(sig)}, k=${Deno.env.get('VAPID_PUBLIC')}`;
}

type Sub = { endpoint: string; pubkey: string; p256dh?: string; auth?: string };

// Send one push: content-less, or with `note` sealed for this subscription (falls back to content-less
// when the subscription has no keys). Returns the HTTP status (404/410 = subscription is dead).
// `urgent` (Kontakt): Urgency high wakes a locked, sleeping phone at once (FCM high priority), and a day
// of TTL keeps the ping waiting while it is offline - with 60 s it was often gone before Doze let it in.
async function sendPush(s: Sub, note?: object, urgent = false): Promise<number> {
  const headers: Record<string, string> = { Authorization: await vapidAuthHeader(s.endpoint), TTL: urgent ? '86400' : '60' };
  if (urgent) headers['Urgency'] = 'high';
  let body: Uint8Array | undefined;
  if (note && s.p256dh && s.auth) {
    body = await encryptPush(new TextEncoder().encode(JSON.stringify(note)), b64urlToBytes(s.p256dh), b64urlToBytes(s.auth));
    headers['Content-Encoding'] = 'aes128gcm';
    headers['Content-Type'] = 'application/octet-stream';
  }
  headers['Content-Length'] = String(body ? body.length : 0);
  const res = await fetch(s.endpoint, { method: 'POST', headers, body });
  return res.status;
}

Deno.serve(async (req) => {
  const body = await req.json().catch(() => null);
  const msg = body?.record;                                            // Database Webhook payload
  console.log('WEBHOOK in:', JSON.stringify({ table: body?.table, has_record: !!msg, room_id: msg?.room_id, recipient: msg?.recipient_pubkey, sender: msg?.pubkey }));
  if (!msg) return new Response('no record', { status: 200 });

  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const kontakt = body.table === 'chat_msg';                          // Kontakt → labelled ping to the app
  const note = kontakt ? KONTAKT : undefined;

  // Who should be pinged?
  let subs: Sub[] = [];
  if (kontakt) {                                                       // the Kontakt app's device
    const { data, error } = await supa.from('chat_config').select('key,value').in('key', KONTAKT_KEYS);
    if (error) console.log('QUERY error (kontakt):', error.message);
    const v = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
    if (v.push_endpoint) subs = [{ endpoint: v.push_endpoint, pubkey: '', p256dh: v.push_key, auth: v.push_auth }];
  } else if (msg.room_id) {                                            // "an alle" → every member of the room
    const { data, error } = await supa.from('push_subscriptions').select('endpoint,pubkey,p256dh,auth').contains('rooms', [msg.room_id]);
    if (error) console.log('QUERY error (room):', error.message);
    subs = (data || []).filter((s) => s.pubkey !== msg.pubkey);        // not the sender
  } else if (msg.recipient_pubkey) {                                   // 1:1 → just the recipient's device(s)
    const { data, error } = await supa.from('push_subscriptions').select('endpoint,pubkey,p256dh,auth').eq('pubkey', msg.recipient_pubkey);
    if (error) console.log('QUERY error (1:1):', error.message);
    subs = data || [];
  }
  console.log('RECIPIENTS found:', subs.length);

  let sent = 0;
  for (const s of subs) {
    try {
      const status = await sendPush(s, note, kontakt);
      console.log('PUSH', s.endpoint.slice(-16), '→ status', status);
      if (status === 404 || status === 410) {                          // prune dead subscription
        if (kontakt) await supa.from('chat_config').delete().in('key', KONTAKT_KEYS);
        else await supa.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
      } else if (status >= 200 && status < 300) {
        sent++;
      }
    } catch (e) { console.log('PUSH error:', (e && (e as Error).message) || e); }
  }
  console.log('DONE. sent:', sent);
  return new Response(JSON.stringify({ recipients: subs.length, sent }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
