// Tracker — "media-sign" Edge Function. Returns a PRESIGNED PUT url for Cloudflare R2 so the client
// uploads media (photo / voice / video) DIRECTLY to R2 (no bytes through this function → no payload
// limits). The R2 credentials live ONLY here as env secrets, never in the public client (Rule 18).
//
// Client POSTs { kind: 'photo'|'voice'|'video', mime, ownerId? }.
// Returns { putUrl, getUrl, key }:
//   putUrl = presigned R2 PUT (≈300 s) → client does `PUT putUrl` with the blob.
//   getUrl = public URL on the custom domain → stored in waypoints[].url, loaded by <img>/<video>/<audio>.
//
// Deploy GATED (only signed-in tracker users):  supabase functions deploy media-sign
//   (i.e. WITHOUT --no-verify-jwt → Supabase verifies the user's Authorization: Bearer JWT first.)
//   For a one-off chain test you may deploy with --no-verify-jwt, then re-deploy gated.
// Secrets (Dashboard → Edge Functions → Secrets):
//   R2_ACCOUNT_ID · R2_ACCESS_KEY_ID · R2_SECRET_ACCESS_KEY · R2_BUCKET · R2_PUBLIC_BASE (e.g. https://media.docalvers.de)

import { AwsClient } from 'https://esm.sh/aws4fetch@1.0.20';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
  'audio/webm': 'weba', 'audio/mp4': 'm4a', 'audio/mpeg': 'mp3', 'audio/aac': 'aac', 'audio/ogg': 'ogg', 'audio/wav': 'wav',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const accountId = Deno.env.get('R2_ACCOUNT_ID');
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
  const bucket = Deno.env.get('R2_BUCKET');
  const publicBase = Deno.env.get('R2_PUBLIC_BASE');
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return json({ error: 'R2_* Secrets fehlen (R2_ACCOUNT_ID/ACCESS_KEY_ID/SECRET_ACCESS_KEY/BUCKET/PUBLIC_BASE).' }, 500);
  }

  const b = await req.json().catch(() => ({}));
  const kind = (b.kind === 'voice' || b.kind === 'video') ? b.kind : 'photo';
  const mime = typeof b.mime === 'string' ? b.mime : '';
  const ext = EXT[mime] || (kind === 'video' ? 'mp4' : kind === 'voice' ? 'm4a' : 'jpg');
  const owner = (typeof b.ownerId === 'string' && /^[a-z0-9_-]{1,64}$/i.test(b.ownerId)) ? b.ownerId : 'anon';
  const key = `${owner}/${kind}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  try {
    const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' });
    const target = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${encodeURI(key)}?X-Amz-Expires=300`;
    const signed = await client.sign(target, { method: 'PUT', aws: { signQuery: true, service: 's3', region: 'auto' } });
    return json({
      putUrl: signed.url,
      getUrl: publicBase.replace(/\/+$/, '') + '/' + key,
      key,
      mime,
    });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
