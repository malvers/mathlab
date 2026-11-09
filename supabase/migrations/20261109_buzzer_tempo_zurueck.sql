-- Buzzer, tempo taken back (Doc, 09.11.2026: "dass man das so schnell zu langsam auch zurücknehmen kann ... auf dem
-- Phone"). Built like the "verstanden" of the table buzzer (column bezug, 01.10.2026): a take-back is a row of its
-- own that refers to the "zu schnell" / "zu langsam" it takes back - of the same code and kind, from the last day,
-- not a take-back itself, and only once (unique index). The teacher's side (js/buzzer.js) counts the referred row
-- out again. Still no device and no name: the phone keeps the id of its own row, nothing else.
-- Run once in the SQL editor; the last select must show the column, the index and the new policy.

alter table public.buzzer_tempo
  add column if not exists bezug bigint references public.buzzer_tempo(id) on delete cascade;

create unique index if not exists buzzer_tempo_bezug_einmal on public.buzzer_tempo (bezug) where bezug is not null;

grant insert (code, art, bezug) on public.buzzer_tempo to anon, authenticated;

drop policy if exists "tempo insert" on public.buzzer_tempo;
create policy "tempo insert" on public.buzzer_tempo for insert to anon, authenticated with check (
  bezug is null or exists (
    select 1 from public.buzzer_tempo t
    where t.id = buzzer_tempo.bezug and t.code = buzzer_tempo.code and t.art = buzzer_tempo.art
      and t.bezug is null and t.created_at > now() - interval '1 day'
  )
);

-- check: three rows (column, index, policy)
select 'column' as was, column_name as name from information_schema.columns
  where table_schema = 'public' and table_name = 'buzzer_tempo' and column_name = 'bezug'
union all
select 'index', indexname from pg_indexes where tablename = 'buzzer_tempo' and indexname = 'buzzer_tempo_bezug_einmal'
union all
select 'policy', policyname from pg_policies where tablename = 'buzzer_tempo' and policyname = 'tempo insert'
  and with_check like '%bezug%';
