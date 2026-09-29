-- Doc, 29.09.2026: "mach den sichtbar für die Kids aber block edit!" - the Fahrplan of a lesson is shown to the
-- class on the (public) plan pages, read-only. So everybody may READ svp_plan_fahrplan; insert, update and delete
-- keep their owner-only policies from 20260920_svp_plan_fahrplan.sql - the block on editing sits here, on the server,
-- not only in the page. Doc agreed that this makes every week's Fahrplan readable by anyone with the link.

drop policy if exists svp_plan_fahrplan_select_public on public.svp_plan_fahrplan;
create policy svp_plan_fahrplan_select_public on public.svp_plan_fahrplan
  for select to anon, authenticated using (true);

grant select on public.svp_plan_fahrplan to anon, authenticated;
