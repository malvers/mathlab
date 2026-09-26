// Stoffverteilungsplan renderer, part "tafel": the board of a lesson, sent from vorrechnen.html.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
//
// Doc, 26.09.2026: "das, was wir hier gemacht haben, sollen definitiv alle sehen. Das ist ja
// gerade der Witz. Wir rechnen es gemeinsam und die haben dann die Musterlösung schon vor sich
// liegen." - vorrechnen.html sends what was worked out in class to the table svp_tafel (one row
// per plan page and day: the tasks and their working as LaTeX; everyone reads, only Doc writes).
// Here every board becomes a pill "Tafel 26.09." in the week of its day, next to the
// Formelsammlung: a fixed pill (festePillen), never part of the week's stored material text -
// so no open plan tab can push it away again with an older edit state (the ts trap of
// svp_plan_edits). The pill opens tafel.html, which sets the working and makes the PDF.
window.svpPlanParts.push(function (P) {
    Object.assign(P, { tafelLinks });

    const me = document.querySelector('script[src*="svp-plan-tafel.js"]');
    const TAFEL_URL = new URL('tafel.html', me ? me.src : location.href).href;

    let tafeln = [];    /* [{ id, kw, datum, titel }] of this page, this school year */

    /* "2026-09-26" -> "26.09." */
    function tag(datum) {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(datum || ''));
        return m ? m[3] + '.' + m[2] + '.' : '';
    }

    /* The pills of one week: every board whose day lies in the week's calendar week.
       Pages that count appointments instead of weeks (UNTIS_TERMIN, FO) have no week
       number per row - the board is not placed there rather than placed wrongly. */
    function tafelLinks(ref) {
        if (!ref || window.UNTIS_TERMIN || ref.kw == null || ref.kw === '') return [];
        return tafeln.filter(t => String(t.kw) === String(ref.kw)).map(t => ({
            label: 'Tafel ' + tag(t.datum),
            url: TAFEL_URL + '?id=' + encodeURIComponent(t.id),
            icon: 'tafel',
            titel: 'Tafelbild vom ' + tag(t.datum) + ' - die Rechnung aus der Stunde, als PDF zum Mitnehmen'
        }));
    }

    /* A school year starts in August: last year's boards of the same calendar week stay out. */
    function schuljahrBeginn() {
        const d = new Date();
        const jahr = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
        return jahr + '-08-01';
    }

    /* Read without a session - the class sees the plan without logging in. Only the
       handful of fields for the pills; the working itself is fetched by tafel.html. */
    (function laden() {
        if (!/\.html$/.test(location.pathname) || !window.svpAuth) return;
        const url = svpAuth.DB_URL + '/rest/v1/svp_tafel?page=eq.' + encodeURIComponent(location.pathname) +
            '&datum=gte.' + schuljahrBeginn() + '&select=id,kw,datum,titel&order=datum';
        fetch(url, { headers: { apikey: svpAuth.DB_KEY } })
            .then(res => (res.ok ? res.json() : []))
            .then(rows => {
                if (!Array.isArray(rows) || !rows.length) return;
                tafeln = rows;
                /* the weeks are built by now: draw their material again, pills included */
                (P.rendered || []).forEach(r => {
                    if (!r.matTd || !tafelLinks(r).length) return;
                    P.updateMaterial(r, r.matTd.dataset.src || '');
                    if (r.refreshExpandable) r.refreshExpandable();
                });
            })
            .catch(() => { /* offline or no table: the plan stays as it is */ });
    })();
});
