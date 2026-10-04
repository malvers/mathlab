// DOCPAD — "rallye-scores" Edge Function: the Rechen-Rallye's high-score list (Doc, 04.10.2026: "ein Spieler gibt sich
// einen Namen, und wir machen dann eine Hitliste"). The game (docpad/web/rallye.js) asks for the list after a ride and,
// when the score makes the top ten, sends a nickname with it. The table (migrations/20261004_rallye_scores.sql) is
// closed to the browser; only this function reads and writes it, with the service role.
//
//   POST { action: 'top' }                                   -> { top: [{ id, name, score, op }] }   (the ten best)
//   POST { action: 'add', name, score, op, seconds }         -> { top, id, rank }                    (only into the top ten)
//   op: the quiz that earned the ride - mul (1⋅1), div (1÷1), big (big 1⋅1), sq (square numbers), sqrt (square roots)
//
// What it checks, as far as a browser game can be checked: a nickname of 1 to 12 letters, digits, space . _ - without
// rude words (also spelled with digits: 4 = a, 3 = e ...); a whole score that fits the time played (at most 60 points a
// second - the game makes about 50 at full speed with every bonus); 'mul' or 'div'. A determined cheat with the browser's
// tools still gets in - entries can be deleted in the table at any time.
//
// No secret in here (CLAUDE.md rule 18). Public like overpass - the game calls it without a login:
//   supabase functions deploy rallye-scores --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
import { guard } from '../_shared/guard.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const TOP = 10;
const NAME = /^[A-Za-zÄÖÜäöüß0-9 ._-]{1,12}$/;
// rude words, German and English, as stems - checked against the name lowercased, without spaces and signs, digits
// read as letters (a nickname is shown to the whole class)
const RUDE = ['arsch', 'fick', 'fotze', 'hure', 'wichs', 'schwanz', 'penis', 'vagina', 'sex', 'porn', 'nazi', 'hitler',
  'nigg', 'neger', 'spast', 'behindert', 'schlampe', 'kack', 'scheis', 'scheiß', 'opfer', 'idiot', 'bitch', 'fuck',
  'shit', 'cunt', 'dick', 'pussy', 'asshole', 'missgeburt', 'mongo', 'schwul', 'homo', 'tunte', 'jude', 'kanake'];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}
// and as a skeleton without vowels, for spellings like "F4ck" or "fikk" - only skeletons no harmless name carries
// (not "rsch": Hirsch)
const SKELETON = ['fck', 'fk', 'btch'];
function rude(name: string): boolean {
  const flat = name.toLowerCase().replace(/[0-9]/g, (d) => ({ 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b' } as Record<string, string>)[d] || '')
    .replace(/[^a-zäöüß]/g, '');
  const bones = name.toLowerCase().replace(/[^a-zß]/g, '').replace(/[aeiouyäöü]/g, '').replace(/(.)\1+/g, '$1');
  return RUDE.some((w) => flat.includes(w)) || SKELETON.some((w) => bones === w || (w.length > 2 && bones.includes(w)));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  /* public, login-less - see ../_shared/guard.ts; a whole class behind one school IP: up to 600 in five minutes */
  const blocked = guard(req, { maxBytes: 2_000, limit: 600 });
  if (blocked) return blocked;
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const SB = Deno.env.get('SUPABASE_URL'), SVC = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SB || !SVC) return json({ error: 'SUPABASE_URL/SERVICE_ROLE_KEY fehlen' }, 500);
  const rest = (path: string, init: RequestInit = {}) => fetch(SB + '/rest/v1/' + path, {
    ...init, headers: { apikey: SVC, Authorization: 'Bearer ' + SVC, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const top = async () => {
    const r = await rest('rallye_scores?select=id,name,score,op&order=score.desc,created_at.asc&limit=' + TOP);
    if (!r.ok) throw new Error('Tabelle ' + r.status);
    return await r.json();
  };
  // how many have more points: the place a score would take
  const better = async (score: number) => {
    const r = await rest('rallye_scores?select=id&score=gt.' + score, { headers: { Prefer: 'count=exact', Range: '0-0' } });
    const total = (r.headers.get('content-range') || '*/0').split('/')[1];
    await r.body?.cancel();
    return Number(total) || 0;
  };

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* no body */ }
  try {
    if (body.action === 'top') return json({ top: await top() });
    if (body.action !== 'add') return json({ error: 'action: top | add' }, 400);

    const name = String(body.name || '').replace(/\s+/g, ' ').trim();
    const score = Number(body.score), seconds = Math.round(Number(body.seconds)), op = String(body.op || '');
    if (!NAME.test(name)) return json({ error: 'Spitzname: 1 bis 12 Buchstaben oder Ziffern' }, 400);
    if (rude(name)) return json({ error: 'Bitte einen anderen Spitznamen' }, 400);
    if (!['mul', 'div', 'big', 'sq', 'sqrt'].includes(op)) return json({ error: 'op: mul | div | big | sq | sqrt' }, 400);
    if (!Number.isInteger(score) || score < 0 || score > 100000) return json({ error: 'Punkte?' }, 400);
    if (!(seconds >= 3 && seconds <= 7200) || score > 60 * seconds + 200) return json({ error: 'Punkte passen nicht zur Spielzeit' }, 400);

    const rank = (await better(score)) + 1;
    if (rank > TOP) return json({ error: 'nicht unter den besten ' + TOP, rank, top: await top() }, 409);
    const ins = await rest('rallye_scores', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ name, score, op, seconds }) });
    if (!ins.ok) return json({ error: 'Eintragen fehlgeschlagen ' + ins.status }, 500);
    const [row] = await ins.json();
    return json({ top: await top(), id: row.id, rank });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
