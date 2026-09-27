-- Doc, 27.09.2026: "Das darf nie passieren." - after the client fix (0aef4a86) a plan tab open since the morning still
-- ran the old code and wrote the 23.09 state over the restored pill once more (16:08). So the database itself refuses
-- a save from the web that does not name the row it builds on: svpAuth.sicherSpeichern sends basis = the ts it read,
-- an old client sends nothing and gets HTTP 409 (errcode PT409) instead of overwriting. The management API (postgres)
-- is not affected - restoring from <table>_history keeps working.
-- Applied 27.09.2026 ~16:20 through the management API, in this order: the column, the client (4acad8ba), the trigger.
-- Tested as role authenticated: no basis -> refused, wrong basis -> refused, right basis -> written.

alter table public.svp_plan_edits add column if not exists basis timestamptz;
alter table public.svp_plan_notes add column if not exists basis timestamptz;
alter table public.svp_plan_fahrplan add column if not exists basis timestamptz;
create or replace function public.svp_plan_basis_pruefen() returns trigger language plpgsql as $f$
begin
  -- only writes from the web (PostgREST roles); the management API (postgres) may restore freely
  if current_user in ('anon', 'authenticated') and new.basis is distinct from old.ts then
    raise exception 'veralteter Stand - bitte die Seite neu laden' using errcode = 'PT409';
  end if;
  return new;
end $f$;
drop trigger if exists svp_plan_edits_basis on public.svp_plan_edits;
create trigger svp_plan_edits_basis before update on public.svp_plan_edits for each row execute function public.svp_plan_basis_pruefen();
drop trigger if exists svp_plan_notes_basis on public.svp_plan_notes;
create trigger svp_plan_notes_basis before update on public.svp_plan_notes for each row execute function public.svp_plan_basis_pruefen();
drop trigger if exists svp_plan_fahrplan_basis on public.svp_plan_fahrplan;
create trigger svp_plan_fahrplan_basis before update on public.svp_plan_fahrplan for each row execute function public.svp_plan_basis_pruefen();
