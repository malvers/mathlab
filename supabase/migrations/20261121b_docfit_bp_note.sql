-- DocFit, part 2 (21.11.2026): blood pressure typed in by hand on the phone (Pressures.java: sys / dia / pulse, a
-- note, source "hand" or "omron", per person) - docfit_bp gets the note and the source "hand". Also tightens
-- docfit_history to read-only for authenticated (RLS already allowed nothing but SELECT; now the grant says so too).
--
-- Apply: SQL editor (Doc). Additive and idempotent (safe to re-run). Needs part 1 (20261121_docfit.sql).

begin;

alter table public.docfit_bp add column if not exists note text;
alter table public.docfit_bp drop constraint if exists docfit_bp_note_check;
alter table public.docfit_bp add constraint docfit_bp_note_check check (note is null or length(note) <= 200);

alter table public.docfit_bp drop constraint if exists docfit_bp_source_check;
alter table public.docfit_bp add constraint docfit_bp_source_check check (source in ('hand', 'omron', 'excel'));
alter table public.docfit_bp alter column source set default 'hand';

revoke insert, update, delete on public.docfit_history from authenticated;

commit;

-- control: the columns and checks of docfit_bp (expected: note text, source default 'hand', 'hand' in the check)
select a.attname, format_type(a.atttypid, a.atttypmod) as type, pg_get_expr(d.adbin, d.adrelid) as default_value
from pg_attribute a left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
where a.attrelid = 'public.docfit_bp'::regclass and a.attnum > 0 and not a.attisdropped
order by a.attnum;
