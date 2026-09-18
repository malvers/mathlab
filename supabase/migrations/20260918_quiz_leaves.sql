-- Test guard of the online tests (HTML/js/quiz-engine.js), 18.09.2026.
-- Modelled on the Saxon Kompetenztest (onlinetest.schule): a pupil with a slip
-- code who leaves the running test (other tab/app, lost focus, out of full
-- screen) gets a lock screen, and every leave lands here. The teacher sees
-- them next to the names in HTML/svp/leistungstest.html.
--
-- The table is closed to anon/authenticated; it is reached only through the
-- two functions below. Like quiz_result, the teacher side answers only for
-- codes the caller already knows - nothing lists the codes of a pool.

create table if not exists public.quiz_leaves (
  id bigint generated always as identity primary key,
  quiz text not null,
  code text not null,
  kind text not null,                 -- 'tab' | 'focus' | 'fullscreen'
  left_at timestamptz not null default now(),
  back_at timestamptz                 -- null = still away (or never came back)
);
create index if not exists quiz_leaves_quiz_code on public.quiz_leaves (quiz, code, id);
alter table public.quiz_leaves enable row level security;
revoke all on public.quiz_leaves from anon, authenticated;

-- Pupil side: a leave opens a row, 'back' closes the open one. Durations are
-- taken from the server clock, so the pupil's clock does not matter.
create or replace function public.quiz_leave(p_quiz text, p_code text, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
begin
  if v_code !~ '^[2-9A-HJ-NP-Z]{4}$' or coalesce(length(p_quiz), 0) not between 1 and 80 then
    raise exception 'bad payload';
  end if;
  if p_kind = 'back' then
    update quiz_leaves set back_at = now()
      where id = (select id from quiz_leaves
                  where quiz = p_quiz and code = v_code and back_at is null
                  order by id desc limit 1);
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
end $$;

-- Teacher side: per known code the number of leaves, the seconds away in
-- total and, while the pupil is still away, since when.
create or replace function public.quiz_leaves_for(p_quiz text, p_codes text[])
returns table (code text, n integer, secs integer, away_since timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select l.code,
         count(*)::int,
         coalesce(sum(extract(epoch from (coalesce(l.back_at, now()) - l.left_at))), 0)::int,
         max(l.left_at) filter (where l.back_at is null)
  from quiz_leaves l
  where l.quiz = p_quiz and l.code = any (p_codes[1:60])
  group by l.code;
$$;

revoke execute on function public.quiz_leave(text, text, text) from public;
grant execute on function public.quiz_leave(text, text, text) to anon, authenticated;
revoke execute on function public.quiz_leaves_for(text, text[]) from public;
grant execute on function public.quiz_leaves_for(text, text[]) to anon, authenticated;
