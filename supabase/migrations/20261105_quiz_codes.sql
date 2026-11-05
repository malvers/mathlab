-- Only codes of the teacher's list may start a coded test (Doc, 05.11.2026, after
-- the Leistungstest KI BGY25: E965 typed for E9G5 and ZWTZ for 2WTZ ran unseen,
-- "die Codes nehmen wir gar nicht an"). On top of 20261102_quiz_release.sql.
--
-- Mission Control (svp/leistungstest.html, Doc's session) puts the codes of the
-- chosen list on the server - codes only, never names; the mapping stays in Doc's
-- browser. The test page asks quiz_code_ok before "Test starten" turns green:
-- 'ok' starts, 'unknown' is a typo, 'nolist' means Mission Control has not been
-- opened for this test yet (the page asks again every few seconds).

create table if not exists public.quiz_codes (
  quiz text not null,
  code text not null,
  created_at timestamptz not null default now(),
  primary key (quiz, code)
);
alter table public.quiz_codes enable row level security;
revoke all on public.quiz_codes from anon, authenticated;

-- the list of one pool, replaced as a whole (a pupil taken off the list loses the code)
create or replace function public.quiz_codes_set(p_quiz text, p_codes text[])
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_codes text[];
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  if coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  select coalesce(array_agg(distinct c), '{}') into v_codes
    from (select upper(trim(x)) as c from unnest(coalesce(p_codes, '{}'::text[])) as x) s
    where c ~ '^[2-9A-HJ-NP-Z]{4}$';
  if cardinality(v_codes) = 0 or cardinality(v_codes) > 60 then
    raise exception 'bad payload';
  end if;
  delete from quiz_codes where quiz = p_quiz and code <> all (v_codes);
  insert into quiz_codes (quiz, code)
    select p_quiz, unnest(v_codes)
    on conflict do nothing;
  return cardinality(v_codes);
end $function$;

revoke execute on function public.quiz_codes_set(text, text[]) from public, anon;
grant execute on function public.quiz_codes_set(text, text[]) to authenticated, service_role;

-- asked by the pupil's page: 'ok' | 'unknown' | 'nolist'
create or replace function public.quiz_code_ok(p_quiz text, p_code text)
returns text
language sql
stable
security definer
set search_path to 'public'
as $function$
  select case
    when not exists (select 1 from quiz_codes where quiz = p_quiz) then 'nolist'
    when exists (select 1 from quiz_codes
                 where quiz = p_quiz and code = upper(trim(coalesce(p_code, '')))) then 'ok'
    else 'unknown'
  end;
$function$;

revoke execute on function public.quiz_code_ok(text, text) from public;
grant execute on function public.quiz_code_ok(text, text) to anon, authenticated, service_role;
