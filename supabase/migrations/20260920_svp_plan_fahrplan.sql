-- Fahrplan der Stunde (Doc 2026-09-20): der Ablauf einer Stunde, je Planwoche ein Punkt-Zettel.
-- Er lag zuerst nur im localStorage des Browsers, in dem er getippt wurde - in der Schule getippt
-- war er zu Hause weg. Doc: "und ja, so behandeln wie Notizen bitte".
--
-- Bewusst eine eigene Tabelle, genau wie svp_plan_notes: svp_plan_edits bleibt fuer jeden lesbar,
-- damit Besucher den aktuellen Plan sehen - ein Fahrplan hat darin nichts verloren. Eine Zeile je
-- Planseite, die Fahrplaene als { wochenIndex: text }.
--
-- Nur Docs Sitzung, dieselbe uid wie in der svp_plan_edits-Policy. Die UUID ist kein Geheimnis,
-- sondern eine Benutzerkennung (GitGuardian hat das am 17.09. schon einmal falsch gemeldet).
--
-- Additiv und umkehrbar (drop table macht es rueckgaengig). Solange die Tabelle fehlt, bleibt der
-- Fahrplan lokal: der Client faengt 404 ab und arbeitet weiter.
--
-- Anwenden: in Supabase → SQL Editor einfuegen → Run. Mehrfach ausfuehrbar.

create table if not exists public.svp_plan_fahrplan (
  page     text        primary key,                      -- location.pathname der Planseite
  fahrplan jsonb       not null default '{}'::jsonb,      -- { "3": "Einstieg …\nErarbeitung …", … }
  ts       timestamptz not null default now()             -- Stand, fuer den Abgleich mit dem Browser
);

alter table public.svp_plan_fahrplan enable row level security;

drop policy if exists svp_plan_fahrplan_select on public.svp_plan_fahrplan;
drop policy if exists svp_plan_fahrplan_insert on public.svp_plan_fahrplan;
drop policy if exists svp_plan_fahrplan_update on public.svp_plan_fahrplan;
drop policy if exists svp_plan_fahrplan_delete on public.svp_plan_fahrplan;

create policy svp_plan_fahrplan_select on public.svp_plan_fahrplan
  for select using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy svp_plan_fahrplan_insert on public.svp_plan_fahrplan
  for insert with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy svp_plan_fahrplan_update on public.svp_plan_fahrplan
  for update using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
              with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy svp_plan_fahrplan_delete on public.svp_plan_fahrplan
  for delete using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
