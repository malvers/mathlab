// "todo-mail" Edge Function: the mail button of Doc's to-do list (HTML/todo/) - one item as a mail to Doc
// himself, sent at once, no mail app in between (Doc, 10.11.2026: "dass ich mir dieses Item selber als Mail
// schicken kann, direkt programmatisch aus der To-Do-Liste heraus").
//
// Who may send: whoever can READ the item. The function fetches the row through PostgREST with the caller's
// own login token, so the row-level security of public.todo (only Doc's uid) decides - no password in the
// page, no uid in here. A stranger, or no login, sees no row and nothing is sent. The text comes from the
// database, not from the request, so the function cannot be used to mail anything else. The recipient is
// fixed (GMAIL_SEND_TO, see ../_shared/gmail.ts).
//
// Client contract (POST, Authorization: Bearer <login token>, apikey: <publishable key>):
//   { id: 123 }  ->  { ok: true, id: "<gmail id>" }   |  401 no login  |  404 no such item for this login
//
// Deploy (once, and after changes):
//   supabase functions deploy todo-mail --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
// (--no-verify-jwt: the login token is checked here, by PostgREST, the same way the page's own reads are.)

import { mailDoc } from '../_shared/gmail.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const APP = 'https://doc-todo.pages.dev/';

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const auth = req.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+/.test(auth)) return json({ error: 'nicht angemeldet' }, 401);
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);
  if (!Number.isInteger(id) || id <= 0) return json({ error: 'keine gültige Aufgabe' }, 400);

  // the item, read with the caller's own token - row-level security decides who sees it
  const url = Deno.env.get('SUPABASE_URL');
  const key = req.headers.get('apikey') || Deno.env.get('SUPABASE_ANON_KEY') || '';
  const r = await fetch(`${url}/rest/v1/todo?id=eq.${id}&select=id,text,prio,done,created_at`, {
    headers: { apikey: key, Authorization: auth },
  });
  if (r.status === 401 || r.status === 403) return json({ error: 'nicht angemeldet' }, 401);
  if (!r.ok) return json({ error: 'Liste nicht lesbar (HTTP ' + r.status + ')' }, 502);
  const rows = await r.json().catch(() => []);
  const item = Array.isArray(rows) ? rows[0] : null;
  if (!item || typeof item.text !== 'string') return json({ error: 'Aufgabe nicht gefunden' }, 404);

  // subject = the item's first line (shortened), body = the whole item plus where it comes from
  const text = item.text.trim();
  const first = text.split('\n')[0];
  const subject = 'To-do: ' + (first.length > 120 ? first.slice(0, 117) + '…' : first);
  const made = item.created_at ? new Date(item.created_at).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }) : '';
  const body = text + '\n\n—\nPrio ' + (item.prio || 2) + (made ? ' · angelegt am ' + made : '') + (item.done ? ' · erledigt' : '')
    + '\nAus deiner To-do-Liste: ' + APP;

  try {
    const gid = await mailDoc(subject, body);
    return json({ ok: true, id: gid });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 502);
  }
});
