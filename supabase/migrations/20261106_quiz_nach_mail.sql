-- Who has been sent the re-sit mail (Doc, 06.11.2026: "wir müssen uns irgendwie merken, dass ich
-- die E-Mail für das Nachschreiben geschickt habe"). On top of 20261105_quiz_codes.sql.
--
-- Mission Control (svp/leistungstest.html, Doc's session) opens the mail as an Outlook draft; Doc
-- reads it and presses Send himself. The school Outlook takes drafts from the Mac but cannot be
-- read back (no sent folder via AppleScript, Graph only after the IT release), so after sending
-- Doc clicks "Abgeschickt" and this table keeps when - per code, never a name or an address; the
-- mapping code -> name stays in Doc's browser. Same pool as quiz_codes (test id, version, class).

create table if not exists public.quiz_nach_mail (
  quiz text not null,
  code text not null,
  kind text not null check (kind in ('must', 'clear')),  -- 'must' = absent, 'clear' = present, no submission
  first_at timestamptz not null default now(),           -- the first mail
  last_at timestamptz not null default now(),            -- the latest one (a reminder moves it)
  primary key (quiz, code)
);
alter table public.quiz_nach_mail enable row level security;
revoke all on public.quiz_nach_mail from anon, authenticated;

-- "Abgeschickt": the codes of one mail, stamped now
create or replace function public.quiz_nach_mail_set(p_quiz text, p_kind text, p_codes text[])
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
  if coalesce(length(p_quiz), 0) not between 1 and 80 or p_kind not in ('must', 'clear') then
    raise exception 'bad payload';
  end if;
  select coalesce(array_agg(distinct c), '{}') into v_codes
    from (select upper(trim(x)) as c from unnest(coalesce(p_codes, '{}'::text[])) as x) s
    where c ~ '^[2-9A-HJ-NP-Z]{4}$';
  if cardinality(v_codes) = 0 or cardinality(v_codes) > 60 then
    raise exception 'bad payload';
  end if;
  insert into quiz_nach_mail (quiz, code, kind)
    select p_quiz, unnest(v_codes), p_kind
    on conflict (quiz, code) do update set kind = excluded.kind, last_at = now();
  return cardinality(v_codes);
end $function$;

-- "zurücknehmen": a click by mistake, before the mail really went out
create or replace function public.quiz_nach_mail_unset(p_quiz text, p_codes text[])
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_n integer;
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  delete from quiz_nach_mail
    where quiz = p_quiz and code = any (select upper(trim(x)) from unnest(coalesce(p_codes, '{}'::text[])) as x);
  get diagnostics v_n = row_count;
  return v_n;
end $function$;

-- what Mission Control shows: per code the kind and when
create or replace function public.quiz_nach_mail_get(p_quiz text)
returns table (code text, kind text, first_at timestamptz, last_at timestamptz)
language plpgsql
stable
security definer
set search_path to 'public'
as $function$
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed';
  end if;
  return query select m.code, m.kind, m.first_at, m.last_at from quiz_nach_mail m where m.quiz = p_quiz order by m.code;
end $function$;

revoke execute on function public.quiz_nach_mail_set(text, text, text[]) from public, anon;
revoke execute on function public.quiz_nach_mail_unset(text, text[]) from public, anon;
revoke execute on function public.quiz_nach_mail_get(text) from public, anon;
grant execute on function public.quiz_nach_mail_set(text, text, text[]) to authenticated, service_role;
grant execute on function public.quiz_nach_mail_unset(text, text[]) to authenticated, service_role;
grant execute on function public.quiz_nach_mail_get(text) to authenticated, service_role;
