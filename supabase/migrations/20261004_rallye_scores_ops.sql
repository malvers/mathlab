-- Rechen-Rallye: more quizzes earn a ride (Doc, 04.10.2026: "noch zwei Quizze ... Wurzel ... Quadrat", then "das große
-- Einmaleins mit dazu. Als extra Quiz") - the big times table (big), the square numbers (sq) and the square roots (sqrt)
-- join the small times and division tables in the high-score list.
alter table public.rallye_scores drop constraint if exists rallye_scores_op_check;
alter table public.rallye_scores add constraint rallye_scores_op_check check (op in ('mul', 'div', 'big', 'sq', 'sqrt'));
