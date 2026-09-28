// The appointments of a plan in termin mode (window.UNTIS_TERMIN - today only FO 12): which plan row a
// learning group has on which day. One copy for the plan page (svp-plan-untis.js, the group view ?g=) and
// the Fahrplan app (fahrplan.html), so the two can never count differently (Doc, 28.09.2026: the app showed
// FOG25-1's Fahrplan a week off - it knew only the calendar week of the row, not the group's appointment).
//
// The rule (Doc, 01.09.2026): a group comes every other week for four lessons in a row. One appointment =
// two plan rows of two lessons each - the first double lesson carries one row, the second the next.
// Holiday rows do not count. A holiday deletes the appointment in WebUntis, so the counting shifts by
// itself, for that group only; a cancelled lesson (code "cancelled") is no appointment either.
// Needs svp-woche.js (svpIsoWeek) for kwOf().
(function (global) {
    'use strict';

    /* Is a lesson from this group? Coupled classes are "FOG25-2,FOW25-2" in svp_untis, "FOG25-2_FOW25-2"
       in the slug and an array in the live call - no order can be relied on, so both sides are sorted. */
    function groupKey(v) {
        return (Array.isArray(v) ? v : String(v || '').split(/[,_]/))
            .map(x => x.trim()).filter(Boolean).sort().join('_');
    }

    /* Per class (as svp_untis names it) the ordered list of its appointment days, each day the lessons of
       that day sorted by their start. data = the `data` of a svp_untis row: { weeks: { kw: [entry] } }. */
    function termine(data) {
        const byClass = new Map();
        for (const kw of Object.keys((data && data.weeks) || {})) {
            for (const e of data.weeks[kw]) {
                if (e.code === 'cancelled') continue;
                const k = e.klasse || '';
                if (!byClass.has(k)) byClass.set(k, new Map());
                const days = byClass.get(k);
                if (!days.has(e.date)) days.set(e.date, []);
                days.get(e.date).push(e);
            }
        }
        const out = new Map();
        for (const [k, days] of byClass) {
            out.set(k, [...days.keys()].sort().map(d =>
                days.get(d).slice().sort((a, b) => String(a.start).localeCompare(String(b.start)))));
        }
        return out;
    }

    /* Which appointment (block) and which double lesson (half: 0 = first, 1 = second) plan row i is.
       rows: the plan rows in order, a holiday row carries `ferien` (window.PLAN, or the weeks of
       plan-suchindex.json - both keep the row index i and the flag). */
    function slot(rows, i) {
        let n = 0;
        for (let k = 0; k < i && k < rows.length; k++) if (!rows[k].ferien) n++;
        return { block: Math.floor(n / 2), half: n % 2 };
    }

    /* "20260928" -> the ISO week of that day */
    function kwOf(ymd) {
        const s = String(ymd);
        return global.svpIsoWeek(new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)));
    }

    global.svpTermine = { groupKey, termine, slot, kwOf };
})(window);
