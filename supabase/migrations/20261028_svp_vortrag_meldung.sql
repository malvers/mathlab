-- "Stimmt was nicht?" on the talks pages (Doc, 28.10.2026: "Oft kommen SuS zu mir und sagen 'alles' sei falsch").
-- Pupils can change their entry only in the first ten minutes; after that they ask here instead of in Teams.
-- The request text (name + what is wrong) is sealed in the browser against Doc's public key, exactly like the
-- names in svp_vortrag_namen - anon may INSERT and may see THAT a card has an open request, never what it says.
create table if not exists public.svp_vortrag_meldung (
  id       uuid primary key default gen_random_uuid(),
  plan     text not null check (plan ~ '^[a-z0-9]{1,24}$'),
  klasse   text not null check (klasse ~ '^[A-Za-z0-9_-]{1,40}$'),
  idx      int check (idx is null or idx between 0 and 999),      -- the card (svp_vortrag_namen.idx), null = general
  art      text not null check (art in ('austragen', 'wechseln', 'wunsch', 'name', 'sonst')),
  msg_enc  text not null check (char_length(msg_enc) between 100 and 4000),
  ts       timestamptz not null default now(),
  done     boolean not null default false,
  done_at  timestamptz
);
create index if not exists svp_vortrag_meldung_gruppe on public.svp_vortrag_meldung (plan, klasse, ts desc);

alter table public.svp_vortrag_meldung enable row level security;

-- since 30.10.2026 new tables get no automatic grants - and before that they got ALL, so revoke first
revoke all on public.svp_vortrag_meldung from anon, authenticated;
grant select (id, plan, klasse, idx, art, ts, done, done_at) on public.svp_vortrag_meldung to anon;
grant insert (plan, klasse, idx, art, msg_enc) on public.svp_vortrag_meldung to anon;
grant select, insert, update on public.svp_vortrag_meldung to authenticated;
grant select, insert, update, delete on public.svp_vortrag_meldung to service_role;

drop policy if exists "vt meldung anon read" on public.svp_vortrag_meldung;
drop policy if exists "vt meldung anon insert" on public.svp_vortrag_meldung;
drop policy if exists "vt meldung auth all" on public.svp_vortrag_meldung;
create policy "vt meldung anon read" on public.svp_vortrag_meldung for select to anon using (true);
create policy "vt meldung anon insert" on public.svp_vortrag_meldung for insert to anon with check (not done);
create policy "vt meldung auth all" on public.svp_vortrag_meldung for all to authenticated using (true) with check (true);

-- Server time and a fresh state on every insert, whatever the client sends; and a flood guard: one
-- Lerngruppe gets at most 30 requests an hour (a class of 30 all at once is the worst real case).
create or replace function public.svp_vortrag_meldung_neu() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  new.ts := now();
  new.done := false;
  new.done_at := null;
  if (select count(*) from public.svp_vortrag_meldung
       where plan = new.plan and klasse = new.klasse and ts > now() - interval '1 hour') >= 30 then
    raise exception 'zu viele Meldungen in dieser Stunde' using errcode = 'PT429';
  end if;
  return new;
end $$;

drop trigger if exists svp_vortrag_meldung_neu on public.svp_vortrag_meldung;
create trigger svp_vortrag_meldung_neu before insert on public.svp_vortrag_meldung
  for each row execute function public.svp_vortrag_meldung_neu();

-- let the Data API see the new table right away
notify pgrst, 'reload schema';
