-- Buzzer, tempo (Doc, 01.10.2026: "Das soll mir Feedback geben, ob ich zu schnell erkläre oder zu langsam
-- erkläre"): the class's phones send "zu schnell" / "zu langsam", Vorrechnen's mission control shows it.
-- A table of its own and not a column of buzzer: a tab still open with the old code counts every row of
-- buzzer as "nicht verstanden".
-- Same rules as buzzer: anyone inserts a code and the kind only, reads the last day only, at most 40 a
-- minute per code (buzzer_tempo_bremse); realtime for the teacher's side.
create table if not exists public.buzzer_tempo (
  id bigint generated always as identity primary key,
  code text not null check (code ~ '^[0-9]{4}$'),
  art text not null check (art in ('schnell', 'langsam')),
  created_at timestamptz not null default now()
);

alter table public.buzzer_tempo enable row level security;
revoke all on public.buzzer_tempo from anon, authenticated;
grant select on public.buzzer_tempo to anon, authenticated;
grant insert (code, art) on public.buzzer_tempo to anon, authenticated;

create policy "tempo insert" on public.buzzer_tempo for insert to anon, authenticated with check (true);
create policy "tempo read today" on public.buzzer_tempo for select to anon, authenticated
  using (created_at > now() - interval '1 day');

create or replace function public.buzzer_tempo_bremse() returns trigger
language plpgsql set search_path = public as $$
begin
  if (select count(*) from public.buzzer_tempo where code = new.code and created_at > now() - interval '1 minute') >= 40 then
    raise exception 'buzzer_tempo: zu viele in einer Minute';
  end if;
  return new;
end $$;

create trigger buzzer_tempo_bremse before insert on public.buzzer_tempo
  for each row execute function public.buzzer_tempo_bremse();

alter publication supabase_realtime add table public.buzzer_tempo;
