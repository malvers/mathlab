// VGP — push-on-message Edge Function.
// Triggered by a Database Webhook on `messages` INSERT. Sends a CONTENT-LESS web-push ping
// ("you have a new message") to the recipients' subscriptions. E2E: the server can't read the
// message, so nothing decryptable is ever sent — just a wakeup that makes the SW show a generic
// notification. VAPID is signed here with Web Crypto (ES256); no external dependency.
//
// Secrets to set (dashboard → Edge Functions → Secrets):
//   VAPID_PUBLIC   – base64url of the 65-byte public point (same one the client uses)
//   VAPID_PRIVATE  – base64url of the 32-byte private scalar (SERVER ONLY)
//   VAPID_SUBJECT  – a contact URI, e.g. "mailto:you@example.com"
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from 'jsr:@supabase/supabase-js@2';

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

// Send one content-less push. Returns the HTTP status (404/410 = subscription is dead).
async function sendPush(endpoint: string): Promise<number> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: await vapidAuthHeader(endpoint), TTL: '60', 'Content-Length': '0' },
  });
  return res.status;
}

Deno.serve(async (req) => {
  const body = await req.json().catch(() => null);
  const msg = body?.record;                                            // Database Webhook payload
  console.log('WEBHOOK in:', JSON.stringify({ has_record: !!msg, room_id: msg?.room_id, recipient: msg?.recipient_pubkey, sender: msg?.pubkey }));
  if (!msg) return new Response('no record', { status: 200 });

  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Who should be pinged?
  let subs: { endpoint: string; pubkey: string }[] = [];
  if (msg.room_id) {                                                   // "an alle" → every member of the room
    const { data, error } = await supa.from('push_subscriptions').select('endpoint,pubkey').contains('rooms', [msg.room_id]);
    if (error) console.log('QUERY error (room):', error.message);
    subs = (data || []).filter((s) => s.pubkey !== msg.pubkey);        // not the sender
  } else if (msg.recipient_pubkey) {                                   // 1:1 → just the recipient's device(s)
    const { data, error } = await supa.from('push_subscriptions').select('endpoint,pubkey').eq('pubkey', msg.recipient_pubkey);
    if (error) console.log('QUERY error (1:1):', error.message);
    subs = data || [];
  }
  console.log('RECIPIENTS found:', subs.length);

  let sent = 0;
  for (const s of subs) {
    try {
      const status = await sendPush(s.endpoint);
      console.log('PUSH', s.endpoint.slice(-16), '→ status', status);
      if (status === 404 || status === 410) {
        await supa.from('push_subscriptions').delete().eq('endpoint', s.endpoint);   // prune dead subscription
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
