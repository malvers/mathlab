-- Kontakt push (29.10.2026): "ping-on-sprechstunde" fires for every pupil message again.
-- 20261029_chat.sql let it fire only when recipient_pubkey was set, i.e. when a VGP identity stood in
-- chat_config.push_pubkey. Doc's Kontakt app (HTML/kontakt/) keeps its own push target instead
-- (push_endpoint/push_key/push_auth, set by the bell), so the webhook never ran and no ping came.
-- The webhook's arguments - URL, method, headers WITH the service key, params, timeout - are copied from
-- the existing trigger inside the database, so no key ever has to be written into this file.
do $$
declare
  a text[];
begin
  select string_to_array(encode(t.tgargs, 'escape'), '\000') into a
  from pg_trigger t join pg_class c on c.oid = t.tgrelid
  where c.relname = 'chat_msg' and t.tgname = 'ping-on-sprechstunde';
  if a is null or array_length(a, 1) < 5 or a[1] not like 'https://%/functions/v1/dynamic-responder' then
    raise exception 'ping-on-sprechstunde not found - nothing changed';
  end if;
  execute 'drop trigger "ping-on-sprechstunde" on public.chat_msg';
  execute format('create trigger "ping-on-sprechstunde" after insert on public.chat_msg for each row '
                 'when (not new.from_doc) '
                 'execute function supabase_functions.http_request(%L, %L, %L, %L, %L)',
                 a[1], a[2], a[3], a[4], a[5]);
end $$;
