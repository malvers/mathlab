-- Mission Control: the grade to expect while a test is still running (Doc, 11.11.2026: "auch während des Tests schon
-- die Note einblenden, die zu erwarten ist"). Until now the heartbeat (quiz_ping) told the teacher only "12 of 20
-- answered"; whether the answers are right came with the submission (quiz_vote). Now the page also sends how many of
-- its answers are right, counted by the same rule as the submission's score (quiz-engine.js: answers[qi] ===
-- solution), and only the teacher can read it back (quiz_live). On top of 20260918_quiz_control.sql and
-- 20261102_quiz_release.sql. Only adds: the old functions stay as they are.
--
-- Why a second quiz_ping and not a new argument with a default: PostgREST picks a function by the names of the
-- arguments a call gives. Today's pages call quiz_ping with four names (p_quiz, p_code, p_answered, p_total) - they
-- keep finding exactly the old function, since the new one needs a fifth name, p_correct, and has NO default. A new
-- page calls with five names and finds exactly the new one. A default on p_correct would make the four-name call fit
-- both - "could not choose the best candidate function" - and every heartbeat of a running test would fail.
--
-- Why quiz_live and not one more column in quiz_control: quiz_control is open to anyone who knows a test and its codes
-- (the pages call it with the public key). Live correctness must not be readable by a classmate who knows a code;
-- quiz_live answers the plan owner's session only, like quiz_release.

begin;

alter table public.quiz_runs add column if not exists correct integer;

create or replace function public.quiz_ping(p_quiz text, p_code text, p_answered integer, p_total integer, p_correct integer)
returns text
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_answered integer := least(greatest(coalesce(p_answered, 0), 0), 50);
  v_aborted timestamptz;
begin
  if v_code !~ '^[2-9A-HJ-NP-Z]{4}$' or coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  insert into quiz_runs (quiz, code, started_at, seen_at, answered, total, correct)
    values (p_quiz, v_code, now(), now(), v_answered,
            least(greatest(coalesce(p_total, 0), 0), 50),
            -- never more right than answered
            least(greatest(coalesce(p_correct, 0), 0), v_answered))
    on conflict (quiz, code) do update
      set started_at = coalesce(quiz_runs.started_at, now()),
          seen_at = now(),
          answered = excluded.answered,
          total = excluded.total,
          correct = excluded.correct
    returning aborted_at into v_aborted;
  if v_aborted is not null then
    return 'aborted';
  end if;
  -- a leave the teacher has not released yet (as in 20261102_quiz_release.sql)
  if exists (select 1 from quiz_leaves
             where quiz = p_quiz and code = v_code and back_at is null) then
    return 'away';
  end if;
  return 'running';
end $function$;

grant execute on function public.quiz_ping(text, text, integer, integer, integer) to anon, authenticated, service_role;

-- The teacher's view: how many answers are right so far, per code. Plan owner only.
create or replace function public.quiz_live(p_quiz text, p_codes text[])
returns table (code text, correct integer)
language plpgsql
stable
security definer
set search_path to 'public'
as $function$
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  return query
    select r.code, r.correct
    from quiz_runs r
    where r.quiz = p_quiz and r.code = any (p_codes[1:60]) and r.correct is not null;
end $function$;

revoke execute on function public.quiz_live(text, text[]) from public, anon;
grant execute on function public.quiz_live(text, text[]) to authenticated, service_role;

notify pgrst, 'reload schema';

commit;

-- check: two quiz_ping (4 and 5 arguments, neither with a default), quiz_live for authenticated only, the new column
select p.proname, pg_get_function_identity_arguments(p.oid) as args, p.pronargdefaults as defaults,
       has_function_privilege('anon', p.oid, 'execute') as anon_may
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('quiz_ping', 'quiz_live')
order by p.proname, p.pronargs;
