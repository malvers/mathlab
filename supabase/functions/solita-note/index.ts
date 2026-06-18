// Tracker/Labs — "solita-note" Edge Function (Solita writes / lists / deletes Doc's PRIVATE notes).
//
// PRIVACY (Doc 2026-06-18): notes moved OFF the public repo into a PRIVATE Supabase table
// public.solita_notes — RLS deny-all, so ONLY this function (service role) can read/write it, exactly like
// the chat history (solita_history). No GitHub, nothing public anymore. Each note's time lives in the
// created_at column; the client formats it in Doc's local time on read.
//
// ⚠️ INERT bis Doc die Tabelle anlegt (SQL unten) UND deployt. Solange nicht da, kommt ein klarer Fehler.
//
// Client contract (POST, header x-app-pass == LABAI_PASSWORD):
//   { ping:true }                        -> { ok:true }
//   { note:"<text>" }                    -> insert → { ok, id }
//   { action:'list' }                    -> { ok, count, notes:[{id, created_at, text}] }  (oldest first)
//   { action:'delete', which:'all' }     -> delete ALL → { ok, deleted }
//   { action:'delete', which:'last' }    -> delete the most recent → { ok, deleted }
//   { action:'delete', query:'<text>' }  -> delete notes whose text contains <text> (case-insensitive) → { ok, deleted }
//
// Deploy: supabase functions deploy solita-note --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
// Secrets: LABAI_PASSWORD (exists). SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are auto-injected at runtime.
//
// Table — run ONCE in the Supabase SQL editor (see supabase/solita_notes.sql):
//   create table if not exists public.solita_notes (
//     id uuid primary key default gen_random_uuid(),
//     created_at timestamptz not null default now(),
//     text text not null
//   );
//   alter table public.solita_notes enable row level security;   -- no policies = deny-all to anon

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  const SB_URL = Deno.env.get('SUPABASE_URL');
  const SVC = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  if (!SB_URL || !SVC) return json({ error: 'SUPABASE_URL/SERVICE_ROLE_KEY fehlen (Runtime-Injection).' }, 500);

  const b = await req.json().catch(() => ({} as Record<string, unknown>));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  const REST = `${SB_URL}/rest/v1/solita_notes`;
  const H: Record<string, string> = {
    apikey: SVC,
    Authorization: 'Bearer ' + SVC,
    'Content-Type': 'application/json',
  };

  const action = typeof b.action === 'string' ? b.action : '';

  // ---- LIST: oldest first (reads as a chronological log) ----
  if (action === 'list') {
    const r = await fetch(`${REST}?select=id,created_at,text&order=created_at.asc`, { headers: H });
    const data = await r.json().catch(() => []);
    if (!r.ok) return json({ error: 'list ' + r.status + ': ' + (data?.message || '') }, 502);
    const notes = Array.isArray(data) ? data : [];
    return json({ ok: true, count: notes.length, notes });
  }

  // ---- DELETE: all | last | by query (case-insensitive substring). Returns how many were removed. ----
  if (action === 'delete') {
    const which = typeof b.which === 'string' ? b.which : '';
    const query = typeof b.query === 'string' ? b.query.trim() : '';
    let url = '';
    if (which === 'all') {
      url = `${REST}?id=not.is.null`;                 // matches every row
    } else if (which === 'last') {
      // newest row id, then delete exactly that one
      const lr = await fetch(`${REST}?select=id&order=created_at.desc&limit=1`, { headers: H });
      const ld = await lr.json().catch(() => []);
      if (!lr.ok) return json({ error: 'delete(last) lookup ' + lr.status }, 502);
      if (!Array.isArray(ld) || !ld.length) return json({ ok: true, deleted: 0 });
      url = `${REST}?id=eq.${ld[0].id}`;
    } else if (query) {
      url = `${REST}?text=ilike.*${encodeURIComponent(query)}*`;
    } else {
      return json({ error: 'delete: which (all|last) oder query nötig' }, 400);
    }
    const r = await fetch(url, { method: 'DELETE', headers: { ...H, Prefer: 'return=representation' } });
    const out = await r.json().catch(() => []);
    if (!r.ok) return json({ error: 'delete ' + r.status + ': ' + (out?.message || '') }, 502);
    return json({ ok: true, deleted: Array.isArray(out) ? out.length : 0 });
  }

  // ---- ADD (default): insert one note (time = created_at default). ----
  const note = typeof b.note === 'string' ? b.note.trim() : '';
  if (!note) return json({ error: 'keine note übergeben' }, 400);
  if (note.length > 4000) return json({ error: 'note zu lang (max 4000 Zeichen)' }, 400);

  const r = await fetch(REST, {
    method: 'POST',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify({ text: note }),
  });
  const out = await r.json().catch(() => []);
  if (!r.ok) return json({ error: 'insert ' + r.status + ': ' + (out?.message || '') }, 502);
  return json({ ok: true, id: Array.isArray(out) && out[0] ? out[0].id : null });
});
