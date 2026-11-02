-- Only the teacher lets a pupil go on after a leave (Doc, 02.11.2026, after the
-- trial run of the KA KI FOG/FOW25-2: "Weitermachen nur ich!"). On top of
-- 20260918_quiz_leaves.sql and 20260918_quiz_control.sql.
--
-- Until now the pupil's page closed its own leave ('back') with the button
-- "Weiter mit dem Test". Now 'back' does nothing; a leave stays open until the
-- teacher releases it in Mission Control (quiz_release, plan owner's session
-- only). quiz_ping tells the page 'away' while a leave is open, so a lock
-- survives a reload and the page learns of the release within one beat.

create or replace function public.quiz_leave(p_quiz text, p_code text, p_kind text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
begin
  if v_code !~ '^[2-9A-HJ-NP-Z]{4}$' or coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  if p_kind = 'back' then
    -- the pupil can no longer close a leave - quiz_release does, for the teacher
    return;
  elsif p_kind in ('tab', 'focus', 'fullscreen') then
    -- still away from an earlier trigger: one leave, not two
    if exists (select 1 from quiz_leaves
               where quiz = p_quiz and code = v_code and back_at is null) then
      return;
    end if;
    -- flood cap per pupil and test
    if (select count(*) from quiz_leaves where quiz = p_quiz and code = v_code) >= 200 then
      return;
    end if;
    insert into quiz_leaves (quiz, code, kind) values (p_quiz, v_code, p_kind);
  else
    raise exception 'bad kind';
  end if;
end $function$;

create or replace function public.quiz_ping(p_quiz text, p_code text, p_answered integer, p_total integer)
returns text
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_aborted timestamptz;
begin
  if v_code !~ '^[2-9A-HJ-NP-Z]{4}$' or coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  insert into quiz_runs (quiz, code, started_at, seen_at, answered, total)
    values (p_quiz, v_code, now(), now(), least(greatest(coalesce(p_answered, 0), 0), 50),
            least(greatest(coalesce(p_total, 0), 0), 50))
    on conflict (quiz, code) do update
      set started_at = coalesce(quiz_runs.started_at, now()),
          seen_at = now(),
          answered = excluded.answered,
          total = excluded.total
    returning aborted_at into v_aborted;
  if v_aborted is not null then
    return 'aborted';
  end if;
  -- a leave the teacher has not released yet
  if exists (select 1 from quiz_leaves
             where quiz = p_quiz and code = v_code and back_at is null) then
    return 'away';
  end if;
  return 'running';
end $function$;

create or replace function public.quiz_release(p_quiz text, p_code text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  if v_code !~ '^[2-9A-HJ-NP-Z]{4}$' or coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  update quiz_leaves set back_at = now()
    where quiz = p_quiz and code = v_code and back_at is null;
end $function$;

revoke execute on function public.quiz_release(text, text) from public, anon;
grant execute on function public.quiz_release(text, text) to authenticated, service_role;
