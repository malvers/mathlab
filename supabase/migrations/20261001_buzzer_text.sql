-- Buzzer, written feedback (Doc, 01.10.2026: "mach unten ein Feld. Für Feedback. Wo die mir also tatsächlich
-- irgendwas schreiben können ... bei mir im Mission Control ... zeigen", then "go").
-- Anonymous like the buzzer: a phone inserts its class code and the text only. Unlike buzzer and buzzer_tempo
-- only a signed-in teacher reads it (Vorrechnen's mission control through svpAuth) - with a 4-digit code
-- anyone could otherwise read what a class wrote. At most 280 characters, at most 20 a minute per code.
create table if not exists public.buzzer_text (
  id bigint generated always as identity primary key,
  code text not null check (code ~ '^[0-9]{4}$'),
  text text not null check (char_length(btrim(text)) between 1 and 280),
  created_at timestamptz not null default now()
);

alter table public.buzzer_text enable row level security;
revoke all on public.buzzer_text from anon, authenticated;
grant insert (code, text) on public.buzzer_text to anon, authenticated;
grant select on public.buzzer_text to authenticated;

create policy "text insert" on public.buzzer_text for insert to anon, authenticated with check (true);
create policy "text read teacher" on public.buzzer_text for select to authenticated
  using (created_at > now() - interval '7 days');

create or replace function public.buzzer_text_bremse() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.buzzer_text where code = new.code and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'buzzer_text: zu viele in einer Minute';
  end if;
  return new;
end $$;

create trigger buzzer_text_bremse before insert on public.buzzer_text
  for each row execute function public.buzzer_text_bremse();
