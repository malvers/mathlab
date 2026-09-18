-- Test Mission Control (HTML/svp/leistungstest.html), 18.09.2026 - on top of
-- 20260918_quiz_leaves.sql. Modelled on the teacher view of the Saxon
-- Kompetenztest: per pupil not started / working (answered x of n) / away /
-- offline / submitted / aborted, plus the teacher's red button that ends one
-- pupil's test (undoable).
--
-- quiz_runs is closed to anon/authenticated like quiz_leaves. Pupils reach it
-- only through quiz_ping (by their own code), the teacher reads through
-- quiz_control (codes already known, like quiz_result) and aborts through
-- quiz_abort, which only the plan owner's session may call.

create table if not exists public.quiz_runs (
  quiz text not null,
  code text not null,
  started_at timestamptz,             -- first ping after "Test starten"
  seen_at timestamptz,                -- last ping (heartbeat every 15 s)
  answered integer not null default 0,
  total integer not null default 0,
  aborted_at timestamptz,             -- set by the teacher, null = running
  primary key (quiz, code)
);
alter table public.quiz_runs enable row level security;
revoke all on public.quiz_runs from anon, authenticated;

-- Pupil heartbeat: progress in, run state out ('running' | 'aborted').
create or replace function public.quiz_ping(p_quiz text, p_code text, p_answered integer, p_total integer)
returns text
language plpgsql
security definer
set search_path = public
as $$
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
  return case when v_aborted is null then 'running' else 'aborted' end;
end $$;

-- Teacher: end one pupil's test (p_on = true) or take that back (false).
-- Only the plan owner's session - the same uid the svp_plan_edits policy uses.
create or replace function public.quiz_abort(p_quiz text, p_code text, p_on boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  if v_code !~ '^[2-9A-HJ-NP-Z]{4}$' or coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  insert into quiz_runs (quiz, code, aborted_at)
    values (p_quiz, v_code, case when p_on then now() end)
    on conflict (quiz, code) do update
      set aborted_at = case when p_on then now() end;
end $$;

-- Teacher view: one row per known code that has anything to show. Ages are
-- computed on the server clock, so the teacher's clock does not matter.
create or replace function public.quiz_control(p_quiz text, p_codes text[])
returns table (code text, started boolean, seen_secs integer, answered integer, total integer,
               aborted boolean, leaves integer, away_secs integer, away_since timestamptz,
               submitted boolean)
language sql
stable
security definer
set search_path = public
as $$
  with c as (select distinct unnest(p_codes[1:60]) as code),
  -- a leave still open counts only up to the pupil's last heartbeat: a closed
  -- page must not keep adding minutes (Doc, 18.09.2026)
  l as (
    select q.code,
           count(*)::int as n,
           coalesce(sum(extract(epoch from (coalesce(q.back_at,
               greatest(q.left_at, coalesce(rr.seen_at, now()))) - q.left_at))), 0)::int as secs,
           max(q.left_at) filter (where q.back_at is null) as away_since
    from quiz_leaves q
    left join quiz_runs rr on rr.quiz = q.quiz and rr.code = q.code
    where q.quiz = p_quiz and q.code in (select code from c)
    group by q.code
  ),
  s as (
    select distinct x.code from quiz_submissions x
    where x.quiz = p_quiz and x.code in (select code from c)
  )
  select c.code,
         r.started_at is not null,
         extract(epoch from (now() - r.seen_at))::int,
         coalesce(r.answered, 0),
         coalesce(r.total, 0),
         r.aborted_at is not null,
         coalesce(l.n, 0),
         coalesce(l.secs, 0),
         l.away_since,
         s.code is not null
  from c
  left join quiz_runs r on r.quiz = p_quiz and r.code = c.code
  left join l on l.code = c.code
  left join s on s.code = c.code
  where r.code is not null or l.code is not null or s.code is not null;
$$;

-- quiz_control replaces it (not yet used by any committed page)
drop function if exists public.quiz_leaves_for(text, text[]);

-- quiz_vote: unchanged except that an aborted run can no longer submit.
create or replace function public.quiz_vote(p_quiz text, p_answers integer[], p_score integer, p_total integer, p_code text default null::text)
returns setof quiz_stats
language plpgsql
security definer
set search_path to 'public'
as $function$
declare i int; idx int; v_code text; v_id bigint;
begin
  if array_length(p_answers,1) is null or array_length(p_answers,1) > 50
     or p_score < 0 or p_score > p_total or p_total > 50 then
    raise exception 'bad payload';
  end if;
  v_code := left(nullif(upper(regexp_replace(coalesce(p_code,''), '[^A-Za-z0-9-]', '', 'g')), ''), 20);
  -- the teacher ended this pupil's test (quiz_abort): nothing is stored
  if v_code is not null and exists (select 1 from quiz_runs r
      where r.quiz = p_quiz and r.code = v_code and r.aborted_at is not null) then
    raise exception 'aborted';
  end if;
  insert into quiz_submissions(quiz, answers, score, total, code)
    values (p_quiz, p_answers, p_score, p_total, v_code)
    on conflict (quiz, code) where code is not null do nothing
    returning id into v_id;
  -- duplicate code = second submit: keep the first, do not double-count stats
  if v_id is not null then
    for i in 1..array_length(p_answers,1) loop
      idx := case when p_answers[i] between 0 and 3 then p_answers[i] + 1 else 5 end;
      insert into quiz_stats(quiz,q) values (p_quiz, i-1)
        on conflict (quiz,q) do nothing;
      update quiz_stats set counts[idx] = counts[idx] + 1
        where quiz = p_quiz and q = i-1;
    end loop;
  end if;
  return query select * from quiz_stats where quiz = p_quiz order by q;
end $function$;

revoke execute on function public.quiz_ping(text, text, integer, integer) from public;
grant execute on function public.quiz_ping(text, text, integer, integer) to anon, authenticated;
revoke execute on function public.quiz_abort(text, text, boolean) from public, anon;
grant execute on function public.quiz_abort(text, text, boolean) to authenticated;
revoke execute on function public.quiz_control(text, text[]) from public;
grant execute on function public.quiz_control(text, text[]) to anon, authenticated;

-- Neubeginn (Doc, 18.09.2026): for testing, the demo class only (pool ending in
-- -GENII). Wipes the given codes - submission, status, leaves - and rebuilds the
-- pool's per-question counters from the submissions that are left, so other
-- codes of the same pool (the staged DSB demo on docalvers.de) keep theirs.
-- Plan owner only, like quiz_abort.
create or replace function public.quiz_reset(p_quiz text, p_codes text[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_codes text[] := p_codes[1:60];
  v_n integer;
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  if p_quiz !~ '-GENII$' then
    raise exception 'only the demo class';
  end if;
  delete from quiz_submissions where quiz = p_quiz and code = any (v_codes);
  get diagnostics v_n = row_count;
  delete from quiz_runs where quiz = p_quiz and code = any (v_codes);
  delete from quiz_leaves where quiz = p_quiz and code = any (v_codes);
  delete from quiz_stats where quiz = p_quiz;
  insert into quiz_stats (quiz, q, counts)
    select p_quiz, u.i - 1,
           array[count(*) filter (where u.a = 0), count(*) filter (where u.a = 1),
                 count(*) filter (where u.a = 2), count(*) filter (where u.a = 3),
                 count(*) filter (where u.a is null or u.a not between 0 and 3)]::int[]
    from quiz_submissions s, unnest(s.answers) with ordinality as u(a, i)
    where s.quiz = p_quiz
    group by u.i;
  return v_n;   -- submissions removed
end $$;

revoke execute on function public.quiz_reset(text, text[]) from public, anon;
grant execute on function public.quiz_reset(text, text[]) to authenticated;

notify pgrst, 'reload schema';
