// Grading rules for the talks (Vortraege) - ONE place for the weighting and
// the mark scale. Read by informatik/vortraege.js (Doc's mark per talk) and
// bewertungsmatrix.html (the summary on the Coach sheet), so the two can no
// longer drift apart. Exposes window.svpNoten = { WEIGHT, SCALE, share,
// combine, note }.
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

    window.svpNoten = { WEIGHT: WEIGHT, SCALE: SCALE, share: share, combine: combine, note: note };
})();
