-- SVP audit 27.09.2026: "any authenticated user may do anything" -> only Doc (and Liliana where she edits).
-- Why: anonymous sign-in and open sign-up are enabled on this project, so the role `authenticated` is
-- effectively everybody. Anon (pupils, no login) keeps exactly what it has today: read the public plan,
-- write sealed names, buzz. Nothing changes for the class.
--
-- Apply: management API (curl with ~/.supabase/access-token, {"query": "<this file>"}) or the SQL editor.
-- Then run the control select at the end and put this file into supabase/migrations/ as
-- 20260927_svp_rls_only_doc.sql (after Doc's GO).

begin;

-- 1  plan notes: no user_id column, so pin to the two editors
drop policy if exists own_all on public.svp_plan_notes;
create policy svp_plan_notes_editors on public.svp_plan_notes for all to authenticated
  using (auth.uid() in ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, '20a05914-5e89-4b12-b0b7-7f66683bda10'::uuid))
  with check (auth.uid() in ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, '20a05914-5e89-4b12-b0b7-7f66683bda10'::uuid));

-- 2  the talk-name key pair: only Doc may read the wrapped private key or touch the row
drop policy if exists "vt key owner write" on public.svp_vortrag_key;
create policy "vt key doc all" on public.svp_vortrag_key for all to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

drop policy if exists "vt keyhist auth read" on public.svp_vortrag_key_history;
create policy "vt keyhist doc read" on public.svp_vortrag_key_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- 3  talk names and ratings: the anon policies (pupils) stay; the "authenticated may do all" becomes Doc only
drop policy if exists "vt namen auth all" on public.svp_vortrag_namen;
create policy "vt namen doc all" on public.svp_vortrag_namen for all to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

drop policy if exists "vt hist auth read" on public.svp_vortrag_namen_history;
create policy "vt hist doc read" on public.svp_vortrag_namen_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

drop policy if exists "vt bew auth all" on public.svp_vortrag_bewertung;
create policy "vt bew doc all" on public.svp_vortrag_bewertung for all to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

drop policy if exists "vt bewhist auth read" on public.svp_vortrag_bewertung_history;
create policy "vt bewhist doc read" on public.svp_vortrag_bewertung_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- 4  plan rows: no squatting of pages without a row. Doc keeps "plan owner writes all";
--    Liliana keeps her own rows (mathe5). Nobody else may insert.
drop policy if exists "owner only" on public.svp_plan_edits;
create policy "svp_plan_edits lili own" on public.svp_plan_edits for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '20a05914-5e89-4b12-b0b7-7f66683bda10'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '20a05914-5e89-4b12-b0b7-7f66683bda10'::uuid);

commit;

-- control: every svp_* policy for `authenticated` must now name a uid (or user_id = auth.uid())
select tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public' and tablename like 'svp_%'
order by tablename, policyname;
