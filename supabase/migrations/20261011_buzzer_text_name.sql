-- Buzzer, written feedback with a name if the student wants one (Doc, 11.10.2026: "mach bitte ein Namensfeld (wenn
-- kids das wollen)"). Optional: empty stays anonymous as before (null). At most 40 characters.
alter table public.buzzer_text add column if not exists name text
  check (name is null or char_length(btrim(name)) between 1 and 40);

grant insert (code, text, name) on public.buzzer_text to anon, authenticated;

-- the texts of a claimed code (rueckmeldung.html), now with the name; a new return type needs drop + create
drop function if exists public.buzzer_texte(text, text);
create function public.buzzer_texte(p_code text, p_schluessel text)
returns table (id bigint, text text, name text, created_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  select t.id, t.text, t.name, t.created_at
  from public.buzzer_text t
  join public.buzzer_besitz b on b.code = t.code
  where b.code = p_code
    and b.tag = (now() at time zone 'Europe/Berlin')::date
    and b.schluessel_hash = encode(sha256(convert_to(coalesce(p_schluessel, ''), 'UTF8')), 'hex')
    and t.created_at >= b.created_at
  order by t.id;
$$;

revoke all on function public.buzzer_texte(text, text) from public;
grant execute on function public.buzzer_texte(text, text) to anon, authenticated;
