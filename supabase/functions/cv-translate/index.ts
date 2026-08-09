// CV — "cv-translate" Edge Function. After Doc edits cv.html in the browser, the client sends ONLY
// the changed fields ({ src, changes: [{ path, text }] }); we translate them with Gemini Flash into
// the four other CV languages and patch exactly those paths in their cv_content rows — everything
// else (including hand-polished wording) stays untouched. The Gemini key lives ONLY here as the
// env secret GEMINI_API_KEY (same secret identify/gemini use).
//
// Auth: deployed with --no-verify-jwt, but the function itself REQUIRES a logged-in Supabase user
// whose email is EDITOR_EMAIL — the same gate the cv_content RLS policies use. Everyone else: 403.
//
// Deploy: supabase functions deploy cv-translate --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse

const EDITOR_EMAIL = 'info@docalvers.de';
const LANGS = ['de', 'en', 'es', 'fr', 'it'];
const LANG_NAMES: Record<string, string> = {
  de: 'German', en: 'English (British)', es: 'Spanish', fr: 'French', it: 'Italian',
};
const MODEL = 'gemini-2.5-flash';
// Only section content is translatable — never name/contact (structures differ per language).
const PATH_RE = /^sections\.\d+\.(h|p|items\.\d+|jobs\.\d+\.(r|o|d|b\.\d+))$/;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function getByPath(obj: unknown, path: string): unknown {
  let o: unknown = obj;
  for (const part of path.split('.')) {
    if (o === null || typeof o !== 'object') return undefined;
    o = (o as Record<string, unknown>)[part];
  }
  return o;
}

function setByPath(obj: unknown, path: string, value: string): boolean {
  const parts = path.split('.');
  let o: unknown = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (o === null || typeof o !== 'object') return false;
    o = (o as Record<string, unknown>)[parts[i]];
  }
  if (o === null || typeof o !== 'object') return false;
  const leaf = parts[parts.length - 1];
  if (typeof (o as Record<string, unknown>)[leaf] !== 'string') return false; // structure mismatch
  (o as Record<string, unknown>)[leaf] = value;
  return true;
}

// Same cost logging as the identify/gemini functions — feeds the daily infra mail.
async function logGeminiCost(um: Record<string, number> | undefined) {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !svc || !um) return;
    await fetch(url + '/rest/v1/ai_cost_log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        provider: 'gemini', model: MODEL,
        in_tok: um.promptTokenCount || 0,
        out_tok: um.candidatesTokenCount || 0,
        cache_read: um.cachedContentTokenCount || 0,
        cache_write: 0,
        label: 'cv-translate',
      }),
    });
  } catch (_) { /* logging must never affect the response */ }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const supaUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const svcKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const gemKey = Deno.env.get('GEMINI_API_KEY');
  if (!gemKey) return json({ error: 'GEMINI_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

  // --- gate: caller must be the logged-in editor account ---
  const authHeader = req.headers.get('Authorization') ?? '';
  const userRes = await fetch(supaUrl + '/auth/v1/user', {
    headers: { apikey: anonKey, Authorization: authHeader },
  });
  const user = await userRes.json().catch(() => ({}));
  if (!userRes.ok || (user as { email?: string }).email !== EDITOR_EMAIL) {
    return json({ error: 'nicht autorisiert' }, 403);
  }

  // --- input ---
  const b = await req.json().catch(() => ({}));
  const src = typeof b.src === 'string' ? b.src : '';
  const rawChanges = Array.isArray(b.changes) ? b.changes : [];
  if (!LANGS.includes(src)) return json({ error: 'ungültige Quellsprache' }, 400);
  const changes: { path: string; text: string }[] = [];
  const skippedPaths: string[] = [];
  for (const c of rawChanges.slice(0, 200)) {
    if (c && typeof c.path === 'string' && typeof c.text === 'string' &&
        PATH_RE.test(c.path) && c.text.length <= 4000) changes.push({ path: c.path, text: c.text });
    else if (c && typeof c.path === 'string') skippedPaths.push(c.path);
  }
  if (!changes.length) return json({ error: 'keine übersetzbaren Änderungen', skippedPaths }, 400);

  // --- load all language rows (service role) ---
  const rowsRes = await fetch(supaUrl + '/rest/v1/cv_content?select=lang,data', {
    headers: { apikey: svcKey, Authorization: 'Bearer ' + svcKey },
  });
  if (!rowsRes.ok) return json({ error: 'cv_content nicht lesbar' }, 502);
  const rows = (await rowsRes.json()) as { lang: string; data: Record<string, unknown> }[];
  const byLang: Record<string, Record<string, unknown>> = {};
  for (const r of rows) byLang[r.lang] = r.data;
  const targets = LANGS.filter((l) => l !== src && byLang[l]);
  const skippedLangs = LANGS.filter((l) => l !== src && !byLang[l]);
  if (!targets.length) return json({ error: 'keine Zielsprachen mit DB-Row', skippedLangs }, 400);

  // --- one Gemini call for everything; current target texts anchor style & terminology ---
  const items = changes.map((c, i) => ({
    id: i,
    new_text: c.text,
    current_translations: Object.fromEntries(
      targets.map((l) => [l, getByPath(byLang[l], c.path)]).filter(([, v]) => typeof v === 'string'),
    ),
  }));
  const prompt =
    'You update translations of a professional CV. The source language is ' + LANG_NAMES[src] + '.\n' +
    'For every item, "new_text" is the updated source text; "current_translations" holds the existing ' +
    'translations before the update. Produce the updated translation for each listed target language: ' +
    'natural CV register, keep established terminology and style of the current translation where the ' +
    'change is partial, keep date/number formats appropriate for each language. Do not add or drop facts.\n' +
    'Target languages: ' + targets.map((l) => l + ' = ' + LANG_NAMES[l]).join(', ') + '.\n' +
    'Return ONLY JSON of the shape {"<lang>": {"<id>": "<translated text>", ...}, ...} covering every ' +
    'item id for every target language.\n\nItems:\n' + JSON.stringify(items);

  const gRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent?key=' + gemKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    },
  );
  const gData = await gRes.json().catch(() => ({}));
  if (!gRes.ok) return json({ error: 'Gemini-Fehler', detail: gData }, 502);
  try {
    const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
    const p = logGeminiCost((gData as { usageMetadata?: Record<string, number> }).usageMetadata);
    if (er?.waitUntil) er.waitUntil(p);
  } catch (_) { /* logging must never affect the response */ }

  let translated: Record<string, Record<string, string>>;
  try {
    translated = JSON.parse(
      (gData as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
        .candidates?.[0]?.content?.parts?.[0]?.text ?? '',
    );
  } catch (_) {
    return json({ error: 'Gemini-Antwort kein JSON' }, 502);
  }

  // --- patch exactly the changed paths per target language and upsert ---
  const updated: Record<string, number> = {};
  for (const lang of targets) {
    const perLang = translated[lang];
    if (!perLang || typeof perLang !== 'object') continue;
    let n = 0;
    changes.forEach((c, i) => {
      const t = perLang[String(i)];
      if (typeof t === 'string' && t.trim() && setByPath(byLang[lang], c.path, t.trim())) n++;
    });
    if (!n) continue;
    const up = await fetch(supaUrl + '/rest/v1/cv_content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', apikey: svcKey, Authorization: 'Bearer ' + svcKey,
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({ lang, data: byLang[lang], updated_at: new Date().toISOString() }),
    });
    if (up.ok) updated[lang] = n;
  }

  return json({ ok: true, updated, skippedLangs, skippedPaths });
});
