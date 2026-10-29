-- Sprechstunde: pupils write to Doc from the students' plan (Doc, 29.10.2026: a red phone behind his name on
-- meinplan.html, "wer mich chatten will", anonymous, answered in VGP on his phone - not Teams).
--
-- Nobody but the two ends can read a word: a pupil's message is sealed in the browser against Doc's public key
-- (svp_vortrag_key, svp-crypto.js), Doc's reply against the public key the pupil's device made for this chat.
-- The database holds ciphertext only.
--
-- Pupils have no account and never touch the VGP tables (those are open to every signed-in device). Their device
-- keeps a random key; the thread is found by its hash, so the key itself never reaches the database. Both tables
-- are closed to anon - the two ways in are functions. Doc (his account only, not every authenticated user, and not
-- the anonymous VGP devices) reads and answers through RLS.
-- Everything goes 30 days after the last message.

create table if not exists public.chat_thread (
  id          uuid primary key default gen_random_uuid(),
  nr          bigint generated always as identity,                            -- "Chat 7" in Doc's view, stable
  key_hash    text not null unique check (key_hash ~ '^[0-9a-f]{64}$'),
  pub         text not null check (char_length(pub) between 80 and 400),     -- the pupil's P-256 public key (JWK)
  created_at  timestamptz not null default now(),
  last_at     timestamptz not null default now(),
  doc_seen_at timestamptz not null default 'epoch',                           -- Doc has read up to here
  blocked     boolean not null default false
);

create table if not exists public.chat_msg (
  id               bigint generated always as identity primary key,
  thread           uuid not null references public.chat_thread (id) on delete cascade,
  from_doc         boolean not null default false,
  body_enc         text not null check (char_length(body_enc) between 60 and 8000),  -- sealed for the reader
  copy_enc         text check (copy_enc is null or char_length(copy_enc) between 60 and 8000), -- Doc's copy of a reply
  recipient_pubkey text,       -- pupil messages: Doc's VGP device, so the VGP push function (dynamic-responder) finds it
  created_at       timestamptz not null default now()
);
create index if not exists chat_msg_thread on public.chat_msg (thread, id);

-- key/value for Doc's settings; 'push_pubkey' = the VGP identity whose push subscription gets the ping
create table if not exists public.chat_config (
  key   text primary key check (key ~ '^[a-z_]{1,40}$'),
  value text not null check (char_length(value) <= 400)
);

alter table public.chat_thread enable row level security;
alter table public.chat_msg enable row level security;
alter table public.chat_config enable row level security;

-- since 30.10.2026 new tables get no automatic grants - and before that they got ALL, so revoke first
revoke all on public.chat_thread from anon, authenticated;
revoke all on public.chat_msg from anon, authenticated;
revoke all on public.chat_config from anon, authenticated;
grant select, update, delete on public.chat_thread to authenticated;
grant select, insert on public.chat_msg to authenticated;
grant select, insert, update on public.chat_config to authenticated;
grant select, insert, update, delete on public.chat_thread to service_role;
grant select, insert, update, delete on public.chat_msg to service_role;
grant select, insert, update, delete on public.chat_config to service_role;

-- Doc's account only (the same uid that alone may write svp_public_plan)
drop policy if exists "chat thread doc" on public.chat_thread;
drop policy if exists "chat msg doc read" on public.chat_msg;
drop policy if exists "chat msg doc reply" on public.chat_msg;
drop policy if exists "chat config doc" on public.chat_config;
create policy "chat thread doc" on public.chat_thread for all to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy "chat msg doc read" on public.chat_msg for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy "chat msg doc reply" on public.chat_msg for insert to authenticated
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and from_doc);
create policy "chat config doc" on public.chat_config for all to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- Server time whatever the client sends; a reply moves the thread up and counts as read; a pupil message
-- is addressed to Doc's VGP device for the push.
create or replace function public.chat_msg_neu() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  new.created_at := now();
  new.recipient_pubkey := case when new.from_doc then null
                               else (select value from public.chat_config where key = 'push_pubkey') end;
  update public.chat_thread set last_at = now(),
    doc_seen_at = case when new.from_doc then now() else doc_seen_at end
    where id = new.thread;
  return new;
end $$;

drop trigger if exists chat_msg_neu on public.chat_msg;
create trigger chat_msg_neu before insert on public.chat_msg
  for each row execute function public.chat_msg_neu();

-- A pupil writes. The first message opens the thread (and brings the device's public key for the replies).
-- Flood guards: 30 messages an hour per thread, 60 new threads a day for the whole school.
create or replace function public.chat_send(p_key text, p_pub text, p_body text) returns bigint
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h text;
  t public.chat_thread;
  new_id bigint;
begin
  if p_key is null or length(p_key) < 32 or length(p_key) > 128 then
    raise exception 'ungültiger Schlüssel' using errcode = '22023';
  end if;
  if p_body is null or char_length(p_body) not between 60 and 8000 then
    raise exception 'ungültige Nachricht' using errcode = '22023';
  end if;
  h := encode(sha256(convert_to(p_key, 'UTF8')), 'hex');
  delete from public.chat_thread where last_at < now() - interval '30 days';   -- the 30-day rule
  select * into t from public.chat_thread where key_hash = h;
  if not found then
    if p_pub is null or char_length(p_pub) not between 80 and 400 then
      raise exception 'ungültiger Schlüssel' using errcode = '22023';
    end if;
    if (select count(*) from public.chat_thread where created_at > now() - interval '1 day') >= 60 then
      raise exception 'heute zu viele neue Chats' using errcode = 'PT429';
    end if;
    insert into public.chat_thread (key_hash, pub) values (h, p_pub) returning * into t;
  end if;
  if t.blocked then
    raise exception 'dieser Chat ist gesperrt' using errcode = 'PT403';
  end if;
  if (select count(*) from public.chat_msg where thread = t.id and not from_doc
        and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'zu viele Nachrichten in dieser Stunde' using errcode = 'PT429';
  end if;
  insert into public.chat_msg (thread, from_doc, body_enc) values (t.id, false, p_body) returning id into new_id;
  return new_id;
end $$;

-- A pupil reads the own thread: own messages (sealed for Doc - the device keeps its own copy) and Doc's replies.
create or replace function public.chat_read(p_key text)
returns table (id bigint, from_doc boolean, body_enc text, created_at timestamptz, blocked boolean)
language sql stable security definer set search_path = public, pg_temp as $$
  select m.id, m.from_doc, case when m.from_doc then m.body_enc else null end, m.created_at, t.blocked
  from public.chat_msg m
  join public.chat_thread t on t.id = m.thread
  where t.key_hash = encode(sha256(convert_to(coalesce(p_key, ''), 'UTF8')), 'hex')
  order by m.id;
$$;

-- Doc's unread count for the Sprechstunde row in VGP (security invoker: RLS decides, so 0 for anyone else)
create or replace function public.chat_unread() returns integer
language sql stable security invoker set search_path = public, pg_temp as $$
  select count(*)::int from public.chat_msg m join public.chat_thread t on t.id = m.thread
  where not m.from_doc and m.created_at > t.doc_seen_at;
$$;

revoke all on function public.chat_send(text, text, text) from public;
revoke all on function public.chat_read(text) from public;
revoke all on function public.chat_unread() from public;
grant execute on function public.chat_send(text, text, text) to anon, authenticated;
grant execute on function public.chat_read(text) to anon, authenticated;
grant execute on function public.chat_unread() to authenticated;

-- Push: the same webhook VGP uses for its messages (dynamic-responder), now also for pupil messages.
-- The webhook's arguments - URL, method, headers WITH the service key, params, timeout - are copied from
-- the existing trigger inside the database, so no key ever has to be written into this file.
do $$
declare
  a text[];
begin
  select string_to_array(encode(t.tgargs, 'escape'), '\000') into a
  from pg_trigger t join pg_class c on c.oid = t.tgrelid
  where c.relname = 'messages' and t.tgname = 'ping-on-message';
  if a is null or array_length(a, 1) < 5 or a[1] not like 'https://%/functions/v1/dynamic-responder' then
    raise notice 'ping-on-message not found - no push for the Sprechstunde';
    return;
  end if;
  execute 'drop trigger if exists "ping-on-sprechstunde" on public.chat_msg';
  execute format('create trigger "ping-on-sprechstunde" after insert on public.chat_msg for each row '
                 'when (not new.from_doc and new.recipient_pubkey is not null) '
                 'execute function supabase_functions.http_request(%L, %L, %L, %L, %L)',
                 a[1], a[2], a[3], a[4], a[5]);
end $$;

-- let the Data API see the new tables right away
notify pgrst, 'reload schema';
