-- Buzzer, the written feedback for colleagues without a login (Doc, 07.10.2026: rueckmeldung.html for every
-- subject, the texts "will ich definitiv haben" - "Ja, bitte Supabase anpassen").
-- buzzer_text is read with a teacher's svpAuth session only; colleagues have none, and opening it by the 4-digit
-- code would let anyone read what every class wrote. So a page that wants the texts without a session claims its
-- code for the day with a random key that stays on its device: the first claim of a code wins, and only that key
-- reads the texts of that code written since the claim. The table itself is closed; both ways in are functions.
create table if not exists public.buzzer_besitz (
  code text not null check (code ~ '^[0-9]{4}$'),
  tag date not null default (now() at time zone 'Europe/Berlin')::date,
  schluessel_hash text not null,
  created_at timestamptz not null default now(),
  primary key (code, tag)
);

alter table public.buzzer_besitz enable row level security;
revoke all on public.buzzer_besitz from anon, authenticated;

-- claim a code for today: true when it is (now, or already) this key's, false when another key has it
create or replace function public.buzzer_anmelden(p_code text, p_schluessel text) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h text;
  heute date := (now() at time zone 'Europe/Berlin')::date;
begin
  if p_code is null or p_code !~ '^[0-9]{4}$' or p_schluessel is null or length(p_schluessel) < 32 then
    return false;
  end if;
  h := encode(sha256(convert_to(p_schluessel, 'UTF8')), 'hex');
  delete from public.buzzer_besitz where tag < heute - 2;              -- old claims are of no use any more
  insert into public.buzzer_besitz (code, tag, schluessel_hash) values (p_code, heute, h)
    on conflict (code, tag) do nothing;
  return exists (select 1 from public.buzzer_besitz where code = p_code and tag = heute and schluessel_hash = h);
end $$;

-- the texts of a claimed code, written since the claim; nothing without the right key
create or replace function public.buzzer_texte(p_code text, p_schluessel text)
returns table (id bigint, text text, created_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  select t.id, t.text, t.created_at
  from public.buzzer_text t
  join public.buzzer_besitz b on b.code = t.code
  where b.code = p_code
    and b.tag = (now() at time zone 'Europe/Berlin')::date
    and b.schluessel_hash = encode(sha256(convert_to(coalesce(p_schluessel, ''), 'UTF8')), 'hex')
    and t.created_at >= b.created_at
  order by t.id;
$$;

revoke all on function public.buzzer_anmelden(text, text) from public;
revoke all on function public.buzzer_texte(text, text) from public;
grant execute on function public.buzzer_anmelden(text, text) to anon, authenticated;
grant execute on function public.buzzer_texte(text, text) to anon, authenticated;
