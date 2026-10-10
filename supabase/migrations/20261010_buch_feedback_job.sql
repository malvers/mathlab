-- buch_feedback, part 2: Doc's page and the fix job (Doc, 10.10.2026: "bitte eine Seite, wo die Meldungen auflaufen und
-- wo ich sie priorisieren kann. Unten einen button 'Fix please' der ruft Dich auf den Plan. Lass uns das täglich 18:10
-- machen").
--   * prio on every report: 3 hoch, 2 normal (default), 1 niedrig, 0 ignorieren - set on HTML/buch/meldungen.html
--   * buch_feedback_lauf: one row per fix run - "Fix please" on the page inserts one, the 18:10 run makes its own
--   * the job on Doc's Mac (tools/buch-feedback/runner.sh) calls three functions with a token of its own; only the
--     token's sha256 lives in the database (schema privat, not served by PostgREST), the token itself only in the Mac's
--     keychain. It can read the open reports and write their results - nothing else.
--
-- The token's hash is NOT in this file: it goes in once by hand (insert into privat.job_token …).
-- Additive + reversible: drop the three functions, table buch_feedback_lauf, schema privat; alter table … drop column prio.
-- Idempotent.

-- ---------- priority ----------
alter table public.buch_feedback add column if not exists prio smallint not null default 2 check (prio between 0 and 3);
grant update (prio, status, bearbeitet_at, notiz, commit_sha) on public.buch_feedback to authenticated;   -- RLS: Doc only

-- ---------- the runs ----------
create table if not exists public.buch_feedback_lauf (
  id             bigint      generated always as identity primary key,
  angefordert_at timestamptz not null default now(),
  anlass         text        not null default 'knopf' check (anlass in ('knopf', '18:10')),
  gestartet_at   timestamptz,
  fertig_at      timestamptz,
  bericht        text
);
alter table public.buch_feedback_lauf enable row level security;
drop policy if exists buch_feedback_lauf_doc_read on public.buch_feedback_lauf;
drop policy if exists buch_feedback_lauf_doc_insert on public.buch_feedback_lauf;
create policy buch_feedback_lauf_doc_read on public.buch_feedback_lauf for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy buch_feedback_lauf_doc_insert on public.buch_feedback_lauf for insert to authenticated
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and anlass = 'knopf' and gestartet_at is null);
revoke all on public.buch_feedback_lauf from anon, authenticated;
grant select, insert (anlass) on public.buch_feedback_lauf to authenticated;

-- ---------- the job's token (hash only) ----------
create schema if not exists privat;
revoke all on schema privat from public, anon, authenticated;
create table if not exists privat.job_token (
  name       text        primary key,
  hash       text        not null,                 -- hex sha256 of the token
  created_at timestamptz not null default now()
);
revoke all on privat.job_token from public, anon, authenticated;
-- RLS on as well (the SQL editor asked, Doc ran "Run and enable RLS"): no policy, so no client role sees a row; the
-- security definer function below reads it as the table's owner
alter table privat.job_token enable row level security;

create or replace function privat.buch_feedback_token_ok(p_token text) returns boolean
language sql stable security definer set search_path = privat, public as $$
  select exists (select 1 from privat.job_token
                 where name = 'buch-feedback' and hash = encode(sha256(convert_to(coalesce(p_token, ''), 'UTF8')), 'hex'));
$$;
revoke all on function privat.buch_feedback_token_ok(text) from public, anon, authenticated;

-- ---------- the job's three calls ----------
-- 1) polled every minute: is a run waiting? (a "Fix please" not yet started)
create or replace function public.buch_feedback_job_anstehend(p_token text) returns bigint
language plpgsql stable security definer set search_path = public, privat as $$
begin
  if not privat.buch_feedback_token_ok(p_token) then raise exception 'buch_feedback_job: bad token' using errcode = '28000'; end if;
  return (select min(id) from public.buch_feedback_lauf where gestartet_at is null);
end $$;

-- 2) start: every waiting run collapses into one (or the 18:10 run is made); returns it with the open reports, highest
--    priority first, then oldest first; "ignorieren" (prio 0) and finished reports stay out
create or replace function public.buch_feedback_job_start(p_token text, p_anlass text) returns jsonb
language plpgsql security definer set search_path = public, privat as $$
declare v_lauf bigint;
begin
  if not privat.buch_feedback_token_ok(p_token) then raise exception 'buch_feedback_job: bad token' using errcode = '28000'; end if;
  select min(id) into v_lauf from public.buch_feedback_lauf where gestartet_at is null;
  if v_lauf is null then
    insert into public.buch_feedback_lauf (anlass) values (case when p_anlass = '18:10' then '18:10' else 'knopf' end)
      returning id into v_lauf;
  end if;
  update public.buch_feedback_lauf set gestartet_at = now() where gestartet_at is null;
  return jsonb_build_object('lauf', v_lauf, 'meldungen', coalesce((
    select jsonb_agg(jsonb_build_object('id', f.id, 'created_at', f.created_at, 'buch', f.buch, 'seite', f.seite,
             'abschnitt', f.abschnitt, 'ziel', f.ziel, 'stelle', f.stelle, 'body', f.body, 'gesprochen', f.gesprochen,
             'prio', f.prio, 'status', f.status, 'notiz', f.notiz) order by f.prio desc, f.created_at)
    from (select * from public.buch_feedback where status in ('neu', 'unklar') and prio > 0
          order by prio desc, created_at limit 40) f), '[]'::jsonb));
end $$;

-- 3) results: [{id, status, notiz, commit}] for the reports, a report for the run, and the run is done
create or replace function public.buch_feedback_job_ergebnis(p_token text, p_lauf bigint, p_ergebnisse jsonb, p_bericht text)
returns integer
language plpgsql security definer set search_path = public, privat as $$
declare v_n integer := 0; e jsonb;
begin
  if not privat.buch_feedback_token_ok(p_token) then raise exception 'buch_feedback_job: bad token' using errcode = '28000'; end if;
  for e in select * from jsonb_array_elements(coalesce(p_ergebnisse, '[]'::jsonb)) loop
    if e->>'status' in ('neu', 'korrigiert', 'abgelehnt', 'unklar') then
      update public.buch_feedback
         set status = e->>'status', notiz = left(e->>'notiz', 2000), commit_sha = left(nullif(e->>'commit', ''), 64),
             bearbeitet_at = now()
       where id = (e->>'id')::bigint;
      v_n := v_n + 1;
    end if;
  end loop;
  update public.buch_feedback_lauf set fertig_at = now(), bericht = left(p_bericht, 8000) where id = p_lauf;
  return v_n;
end $$;

revoke all on function public.buch_feedback_job_anstehend(text) from public;
revoke all on function public.buch_feedback_job_start(text, text) from public;
revoke all on function public.buch_feedback_job_ergebnis(text, bigint, jsonb, text) from public;
grant execute on function public.buch_feedback_job_anstehend(text) to anon, authenticated;
grant execute on function public.buch_feedback_job_start(text, text) to anon, authenticated;
grant execute on function public.buch_feedback_job_ergebnis(text, bigint, jsonb, text) to anon, authenticated;
