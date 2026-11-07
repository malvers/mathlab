// DocMitschrift bridge: carries the recordings from the Pixel to Doc's Mac without the USB cable
// (Doc, 06.11.2026: "Können wir das nicht über R2 pipen? Es muss ja noch nicht mal da bleiben.").
//
// Everything that passes here is AES-256-GCM ciphertext: the phone encrypts each five-minute piece,
// its status and the Mac encrypts the timetable with a key that only the two devices hold (never here,
// never in the repo). The bucket is private, this Worker is its only door, and the Mac deletes a piece
// as soon as it has it; a lifecycle rule drops anything older than seven days as a backstop.
//
//   phone (PHONE_TOKEN): PUT /stueck/<YYYYMMDD-HHMMSS[-hand].m4a>   PUT /status   GET /plan
//   Mac   (MAC_TOKEN):   GET /stuecke   GET|DELETE /stueck/<name>   GET /status   PUT /plan
//
// Secrets (wrangler secret put): PHONE_TOKEN, MAC_TOKEN - set by docmitschrift-app/bruecke.mjs einrichten.

const PIECE = /^\/stueck\/(\d{8}-\d{6}(?:-hand)?\.m4a)$/;   // -hand: recorded by hand, not a lesson
const MAX_PIECE = 25 * 1024 * 1024;     // a five-minute piece is about 1.2 MB, a long one at most a few MB
const MAX_SMALL = 256 * 1024;           // status and plan

function same(a, b) {
  // constant-time compare of two strings
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

function who(request, env) {
  const h = request.headers.get('Authorization') || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (env.PHONE_TOKEN && same(t, env.PHONE_TOKEN)) return 'phone';
  if (env.MAC_TOKEN && same(t, env.MAC_TOKEN)) return 'mac';
  return null;
}

function reply(status, body) {
  return new Response(body === undefined ? null : body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/octet-stream' },
  });
}

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });
}

async function body(request, max) {
  const n = Number(request.headers.get('Content-Length') || 0);
  if (n > max) return null;
  const buf = await request.arrayBuffer();
  return buf.byteLength > max ? null : buf;
}

async function getObject(env, key) {
  const o = await env.BUCKET.get(key);
  return o ? reply(200, o.body) : reply(404);
}

export default {
  async fetch(request, env) {
    const role = who(request, env);
    if (!role) return reply(401);
    const { pathname } = new URL(request.url);
    const m = PIECE.exec(pathname);
    const method = request.method;

    if (role === 'phone') {
      if (m && method === 'PUT') {
        const data = await body(request, MAX_PIECE);
        if (!data) return reply(413);
        await env.BUCKET.put('stuecke/' + m[1], data);
        return reply(204);
      }
      if (pathname === '/status' && method === 'PUT') {
        const data = await body(request, MAX_SMALL);
        if (!data) return reply(413);
        await env.BUCKET.put('status', data);
        return reply(204);
      }
      if (pathname === '/plan' && method === 'GET') return getObject(env, 'plan');
      return reply(404);
    }

    // role === 'mac'
    if (pathname === '/stuecke' && method === 'GET') {
      const names = [];
      let cursor;
      do {
        const page = await env.BUCKET.list({ prefix: 'stuecke/', cursor });
        for (const o of page.objects) names.push({ name: o.key.slice(8), size: o.size });
        cursor = page.truncated ? page.cursor : undefined;
      } while (cursor);
      return json(names);
    }
    if (m && method === 'GET') return getObject(env, 'stuecke/' + m[1]);
    if (m && method === 'DELETE') {
      await env.BUCKET.delete('stuecke/' + m[1]);
      return reply(204);
    }
    if (pathname === '/status' && method === 'GET') return getObject(env, 'status');
    if (pathname === '/plan' && method === 'PUT') {
      const data = await body(request, MAX_SMALL);
      if (!data) return reply(413);
      await env.BUCKET.put('plan', data);
      return reply(204);
    }
    return reply(404);
  },
};
