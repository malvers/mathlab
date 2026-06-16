// Solita — "solita-sync" Edge Function. Cross-device conversation sync for Solita (single shared log).
// Solita's access is ONE shared password (env LABAI_PASSWORD); browser + Pixel are the same user "Doc".
// This keeps ONE row (id='main') in public.solita_history with the conversation history + rolling summary,
// so the thread follows Doc across devices instead of diverging per localStorage/origin. The table is RLS
// deny-all; ONLY this function (service role) reads/writes it — same password gate as the 'claude' proxy.
//
// Deploy (own password gate + service-role table access → no JWT):
//   supabase functions deploy solita-sync --no-verify-jwt
// Secrets (Dashboard → Edge Functions → Secrets):
//   LABAI_PASSWORD              — the shared Solita login password (already set; same as 'claude'/'deepseek')
//   SUPABASE_URL               — injected automatically into the function runtime
//   SUPABASE_SERVICE_ROLE_KEY  — injected automatically; bypasses RLS for the single private row
//
// Client contract (POST, header x-app-pass):
//   { action:'pull' }                            -> { ok, history, summary, rev }
//   { action:'push', history, summary, baseRev } -> { ok, history, summary, rev }   (server is authoritative)
//     baseRev === server.rev : the client built on the latest revision → its history replaces the row.
//     else (another device wrote meanwhile)      : MERGE = longest common prefix of (server, client),
//        then the server tail, then the client tail → no turn is ever dropped (order between the two
//        divergent tails is best-effort). rev is bumped on every write.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

const ROW = 'main';

type Turn = { role?: string; content?: unknown };

// Two turns are "the same" if role + content match exactly (content may be a string or a block array).
function sameTurn(a: Turn, b: Turn): boolean {
  return !!a && !!b && a.role === b.role && JSON.stringify(a.content) === JSON.stringify(b.content);
}

// Merge that cannot lose a turn: keep the longest common prefix, then the server's tail, then the
// client's divergent tail. Used only when the client's baseRev is stale (another device wrote first).
function mergeHistories(server: Turn[], client: Turn[]): Turn[] {
  let k = 0;
  while (k < server.length && k < client.length && sameTurn(server[k], client[k])) k++;
  return server.concat(client.slice(k));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt — als Edge-Function-Secret setzen.' }, 500);
  const SB_URL = Deno.env.get('SUPABASE_URL');
  const SVC = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SB_URL || !SVC) return json({ error: 'SUPABASE_URL/SERVICE_ROLE_KEY fehlen (Runtime-Injection).' }, 500);

  const b = await req.json().catch(() => ({} as Record<string, unknown>));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);

  const REST = `${SB_URL}/rest/v1/solita_history`;
  const H: Record<string, string> = {
    apikey: SVC,
    Authorization: 'Bearer ' + SVC,
    'Content-Type': 'application/json',
  };

  // Current server state (the single row).
  async function loadRow(): Promise<{ history: Turn[]; summary: string; rev: number }> {
    const rows = await fetch(`${REST}?id=eq.${ROW}&select=history,summary,rev`, { headers: H })
      .then((r) => r.json()).catch(() => []);
    const row = Array.isArray(rows) && rows[0] ? rows[0] : { history: [], summary: '', rev: 0 };
    return {
      history: Array.isArray(row.history) ? row.history : [],
      summary: typeof row.summary === 'string' ? row.summary : '',
      rev: (row.rev | 0),
    };
  }

  const cur = await loadRow();

  if (b.action === 'pull') {
    return json({ ok: true, history: cur.history, summary: cur.summary, rev: cur.rev });
  }

  if (b.action === 'push') {
    const clientHist: Turn[] = Array.isArray(b.history) ? (b.history as Turn[]) : [];
    const baseRev = (typeof b.baseRev === 'number' ? b.baseRev : 0) | 0;
    const clientSummary = (typeof b.summary === 'string') ? b.summary : '';

    function compose(server: { history: Turn[]; summary: string; rev: number }) {
      const history = (baseRev === server.rev) ? clientHist : mergeHistories(server.history, clientHist);
      // Prefer a freshly-regenerated client summary; fall back to the server's.
      const summary = clientSummary.trim() ? clientSummary : server.summary;
      return { history, summary, rev: server.rev + 1 };
    }

    // Compare-and-swap on rev so two devices writing at once can't silently clobber each other.
    async function writeGuarded(server: { history: Turn[]; summary: string; rev: number }) {
      const next = compose(server);
      const res = await fetch(`${REST}?id=eq.${ROW}&rev=eq.${server.rev}`, {
        method: 'PATCH',
        headers: { ...H, Prefer: 'return=representation' },
        body: JSON.stringify({
          history: next.history, summary: next.summary, rev: next.rev,
          updated_at: new Date().toISOString(),
        }),
      });
      const out = await res.json().catch(() => []);
      const ok = Array.isArray(out) && out.length > 0;   // CAS hit exactly the row we read
      return { ok, next };
    }

    let attempt = await writeGuarded(cur);
    if (!attempt.ok) {
      // Lost the CAS race (or the row moved on) → re-read the latest and merge once more, unguarded.
      const fresh = await loadRow();
      const next = compose(fresh);
      await fetch(`${REST}?id=eq.${ROW}`, {
        method: 'PATCH',
        headers: { ...H, Prefer: 'return=minimal' },
        body: JSON.stringify({
          history: next.history, summary: next.summary, rev: next.rev,
          updated_at: new Date().toISOString(),
        }),
      });
      attempt = { ok: true, next };
    }

    return json({ ok: true, history: attempt.next.history, summary: attempt.next.summary, rev: attempt.next.rev });
  }

  return json({ error: 'unknown action' }, 400);
});
