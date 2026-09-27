// The ISO week number of a date - the number the Stoffverteilungsplan numbers its rows by.
// Refactor audit 27.09.2026 (Doc's step 5): the same lines lived in svp-plan-keys.js, fahrplan.html,
// meinplan.html and js/vorrechnen-tafel.js. One copy now; svp-plan.js loads it before the plan parts,
// fahrplan.html, meinplan.html and vorrechnen.html carry the tag themselves.
// Works on the calendar date only (UTC noon trick), so the hour and the time zone cannot shift the week.
function svpIsoWeek(d) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));   // Thursday of this week decides the year
    const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - jan1) / 86400000 + 1) / 7);
}
window.svpIsoWeek = svpIsoWeek;
