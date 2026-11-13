// Grading rules for the talks (Vortraege) - ONE place for the weighting and
// the mark scale. Read by informatik/vortraege.js (Doc's mark per talk) and
// bewertungsmatrix.html (the summary on the Coach sheet), so the two can no
// longer drift apart. Exposes window.svpNoten = { WEIGHT, SCALE, SCALE_NP, share,
// combine, note, scaleOf, points, mark }.
(function () {
    'use strict';

    /* Doc's Coach sheet carries three votes, the ONE sheet the three pupils
       fill in together carries three as well - one vote each, pooled (Doc,
       12.09.2026). Until then it was 3 : 1. */
    const WEIGHT = { coach: 3, publikum: 3 };

    /* Lowest share of the maximum for each mark, top mark first. Doc,
       12.09.2026: 95 / 80 / 65 / 45 / 25 % for the Oberschule as well - the
       same as the BGY Klassenstufe 11 (punktetabelle.html) and the Sek I
       table he knows; he still checks it against the Oberschule's own. */
    const SCALE = [[1, 0.95], [2, 0.80], [3, 0.65], [4, 0.45], [5, 0.25], [6, 0]];

    /* Klassenstufe 12 and 13 of the Berufliches Gymnasium are marked in Notenpunkte, 15 to 0 (Doc, 12.11.2026, a talk
       of BGY24 showed only "98 %": "im Gymnasium zählt das Punktesystem ... hier sollten im Wesentlichen die
       Bewertungspunkte stehen"). The table is the one of punktetabelle.html (SCALES[12], "Notenspiegel Klassenstufe 12
       und 13") and of the online tests (gradeScale 'np'): lowest share of the maximum for each point value, top first.
       Nothing new - copied from there; change both or neither. */
    const SCALE_NP = [[15, 0.95], [14, 0.90], [13, 0.85], [12, 0.80], [11, 0.75], [10, 0.70], [9, 0.65], [8, 0.60],
        [7, 0.55], [6, 0.50], [5, 0.45], [4, 0.40], [3, 0.333], [2, 0.283], [1, 0.20], [0, 0]];
    /* The talk plans of Klassenstufe 12 and 13 (svp/informatik/vortraege.js PLANS): inf12 = BGY 12, inf13 = BGY 13.
       BGY 11 (inf11, mathe11), the Oberschule (informatik9) and the FOS keep the 1-6 table above. */
    const NP_PLANS = ['inf12', 'inf13'];
    function scaleOf(plan) { return NP_PLANS.indexOf(String(plan || '')) >= 0 ? 'np' : 'note'; }

    /* Share of its maximum a sheet reached, or null. Shares, not points: the
       two sheets may be filled in different languages, and the German and the
       English sheet do not have the same maximum. */
    function share(s) {
        return s && typeof s.got === 'number' && s.max > 0 ? s.got / s.max : null;
    }

    /* Both sheets -> weighted share, or null while one of them is missing. */
    function combine(coach, publikum) {
        const c = share(coach);
        const p = share(publikum);
        if (c === null || p === null) return null;
        return (c * WEIGHT.coach + p * WEIGHT.publikum) / (WEIGHT.coach + WEIGHT.publikum);
    }

    /* Share -> mark. The small epsilon keeps 0.95 from failing on 0.9499999. */
    function note(p) {
        for (const r of SCALE) if (p >= r[1] - 1e-9) return r[0];
        return SCALE[SCALE.length - 1][0];
    }

    /* Share -> Notenpunkte (same epsilon as note). */
    function points(p) {
        for (const r of SCALE_NP) if (p >= r[1] - 1e-9) return r[0];
        return 0;
    }
    /* Notenpunkte -> the mark they stand for, as punktetabelle.html groups them: 15-13 = 1, 12-10 = 2, 09-07 = 3,
       06-04 = 4, 03-01 = 5, 00 = 6. */
    function noteOfPoints(n) { return n >= 13 ? 1 : n >= 10 ? 2 : n >= 7 ? 3 : n >= 4 ? 4 : n >= 1 ? 5 : 6; }
    /* Share -> what counts for this plan: { np, value, unit, note }. Notenpunkte for BGY 12/13 (value 0-15, unit
       "NP", note = the mark they stand for), the mark 1-6 everywhere else (unit "Note"). */
    function mark(p, plan) {
        if (scaleOf(plan) === 'np') {
            const n = points(p);
            return { np: true, value: n, unit: 'NP', note: noteOfPoints(n) };
        }
        const m = note(p);
        return { np: false, value: m, unit: 'Note', note: m };
    }

    window.svpNoten = { WEIGHT: WEIGHT, SCALE: SCALE, SCALE_NP: SCALE_NP, share: share, combine: combine, note: note,
        scaleOf: scaleOf, points: points, mark: mark };
})();
