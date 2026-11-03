// The tests of Doc's plans as pills on the timetable (Doc, 01.11.2026: "dass ich im Stundenplan sofort sehe,
// wait a minute, da ist eine Klassenarbeit"). One copy for stundenplan.html and meinplan.html; the plan pages
// load it for pruefArt and buttonText.
// The Stoffverteilungsplan stays the only source, nothing is kept twice. A test is a row with a button
// (row.redBtn), or a row whose unit column says KA, KL or LK and whose topic names the test. Its date: in
// termin mode the group's own appointment (svp-termine.js), otherwise the class's first day of that calendar
// week, or the day the button names (redBtn.am = 'YYYY-MM-DD').
// The appointments come from svp_untis, which only Doc's account can read - without a login there are no pills.
// Needs svp-auth.js, svp-termine.js and svp-timetable.js.
(function (global) {
    'use strict';

    /* ---- Which colour does a test button wear? --------------------------
       Doc, 22.09.2026: "leistungsnachweis bitte -> immer so,
       Klassenarbeiten/Klausuren machen wir rot". Red is kept for the big
       tests; a Leistungsnachweis wears orange with navy, the tone of
       important material (--g-wichtig, svp-tokens.css). The word decides,
       so a new plan row needs nothing extra: red only where "Klausur",
       "Klassenarbeit" or "Schulaufgabe" stands. redBtn.art = 'klausur' or
       'nachweis' overrides the rule. */
    const RED_WORD = /klausur|klassenarbeit|schulaufgabe/i;
    function pruefArt(cfg) {
        if (cfg && (cfg.art === 'klausur' || cfg.art === 'nachweis')) return cfg.art;
        const word = (cfg && (cfg.title || cfg.label)) || '';
        return RED_WORD.test(word) ? 'klausur' : 'nachweis';
    }

    /* The text on a plan's button. With redBtn.am it names the day, from the same field the pill reads:
       a class that meets several times a week has to know which day (Doc, 01.11.2026, Mathe: "dass die
       auch wissen, an welchem Tag das passiert"). A dated test (redBtn.ab) passes the group's own day as
       ymd ('YYYYMMDD'). */
    function buttonText(cfg, ymd) {
        const day = (ymd ? String(ymd).replace(/^(\d{4})(\d\d)(\d\d)$/, '$1-$2-$3') : String(cfg.am || '')).split('-');
        return cfg.label + (day.length === 3 ? ' ' + +day[2] + '.' + +day[1] + '.' : '');
    }

    /* From which day a dated test counts for one group, as 'YYYYMMDD' ('' = no date). redBtn.ab holds for
       every group; redBtn.abGruppe = { 'FOG25-2_FOW25-2': 'YYYY-MM-DD' } moves single groups (Doc, 02.11.2026:
       the KA of that group goes to its appointment two weeks later). The plan page and the timetable both
       read it here. */
    function abFor(cfg, group) {
        const own = cfg && cfg.abGruppe && group
            && Object.keys(cfg.abGruppe).find(k => svpTermine.groupKey(k) === svpTermine.groupKey(group));
        return String((own && cfg.abGruppe[own]) || (cfg && cfg.ab) || '').replace(/-/g, '');
    }

    /* The day a dated test falls on for one group, from Doc's published timetable (svp_public_plan, which
       anyone may read - meinplan.html shows it): the group's first lesson of the plan's subjects on or after
       abFor(). The plan's own group dates come from svp_untis and need Doc's login, so without this a
       pupil's button names no day (Doc, 03.11.2026: FOG25-2 took two buttons in past weeks for two tests
       already written). Resolves 'YYYYMMDD', or '' when the published weeks do not say. */
    async function publicDay(cfg, group, subjects) {
        const from = abFor(cfg, group);
        if (!from || !group || !global.svpAuth) return '';
        const d = new Date(+from.slice(0, 4), +from.slice(4, 6) - 1, +from.slice(6, 8));
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);            /* a published week is keyed by its Monday */
        const monday = String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0')
            + String(d.getDate()).padStart(2, '0');
        const res = await fetch(svpAuth.DB_URL + '/rest/v1/svp_public_plan?select=payload&order=week.asc&limit=8'
            + '&week=gte.' + monday, { headers: { apikey: svpAuth.DB_KEY } });
        if (!res.ok) return '';
        const want = svpTermine.groupKey(group);
        for (const row of await res.json()) {
            const day = ((row.payload && row.payload.lessons) || [])
                .filter(l => l.code !== 'cancelled' && String(l.date) >= from
                    && svpTermine.groupKey(l.classes) === want
                    && (!subjects || !subjects.length || subjects.includes(l.subject)))
                .map(l => String(l.date)).sort()[0];
            if (day) return day;
        }
        return '';
    }

    const TEST_WORD = /klausur|klassenarbeit|leistungs(test|kontrolle|nachweis|erhebung)/i;
    const pills = new Map();        // date|start|subject|group -> { short, title, ... }

    const keyOf = (date, start, subject, classes) =>
        [date, start, subject, svpTermine.groupKey(classes)].join('|');
    const mark = (e, test) => pills.set(keyOf(e.date, e.start, e.subject, e.klasse), test);

    /* The page's own data: its inline script only assigns window.PLAN and the like, so it runs here
       against a stand-in window. */
    async function pageData(page) {
        const res = await fetch(page, { cache: 'no-cache' });
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const script = [...doc.scripts].find(s => /window\.PLAN\s*=/.test(s.textContent));
        const data = {};
        new Function('window', script.textContent)(data);
        return data;
    }

    /* The test of a row, cloud edits already over it. "Wiederholung vor Klassenarbeit 1" is none. */
    function testOf(row) {
        const btn = typeof row.redBtn === 'string' ? { label: row.redBtn } : row.redBtn;
        const cfg = btn || (/^(KA|KL|LK)\b/.test(row.u || '') && TEST_WORD.test(row.topic || '')
            && !/\bvor\b/i.test(row.topic) ? { label: row.topic } : null);
        if (!cfg) return null;
        const red = pruefArt(cfg) === 'klausur';
        return {
            short: !red ? 'LT' : /klausur/i.test(cfg.title || cfg.label) ? 'KL' : 'KA',
            title: cfg.label,
            cfg,
            on: cfg.am && cfg.am.replace(/-/g, ''),
            list: cfg.src || cfg.title || cfg.label,
        };
    }

    /* Each group its own date, counted as in the plan's group view. A test with `ab` stands on several rows,
       and of those only the group's first one from that day on counts (redBtnShown in svp-plan-aufgaben.js). */
    function inTerminPlan(rows, raw, untis) {
        for (const [klasse, days] of svpTermine.termine(untis)) {
            const taken = new Set();
            rows.forEach((row, i) => {
                const test = testOf(row);
                if (!test) return;
                const s = svpTermine.slot(raw, i), day = days[s.block];
                if (!day) return;
                const from = abFor(test.cfg, klasse);
                if (from) {
                    if (day[0].date < from || taken.has(test.list)) return;
                    taken.add(test.list);
                }
                svpTermine.halfOf(day, s.half).forEach(e => mark(e, test));
            });
        }
    }

    function inWeekPlan(rows, untis) {
        for (const row of rows) {
            const test = testOf(row), week = untis.weeks[row.kw];
            if (!test || !week) continue;
            for (const days of svpTermine.termine({ weeks: { [row.kw]: week } }).values()) {
                const day = test.on ? days.find(d => d[0].date === test.on) : days[0];
                (day || []).forEach(e => mark(e, test));
            }
        }
    }

    /* Resolves true when there is something to paint. */
    async function load(pages) {
        if (!global.svpAuth || !svpAuth.hasSession()) return false;
        const paths = (pages || []).filter(p => (p.classes || []).length).map(p => p.page);
        const filter = 'page=in.(' + encodeURIComponent(paths.map(p => '"' + p + '"').join(',')) + ')';
        const read = path => svpAuth.api(path + '&' + filter).then(r => (r.ok ? r.json() : []));
        const [edits, untis] = await Promise.all([read('svp_plan_edits?select=page,edits'), read('svp_untis?select=page,data')]);
        await Promise.allSettled(paths.map(async path => {
            const plan = (untis.find(z => z.page === path) || {}).data;
            if (!plan || !plan.weeks) return;
            const data = await pageData(path);
            const over = (edits.find(z => z.page === path) || {}).edits || {};
            const rows = data.PLAN.map((row, i) => ({ ...row, ...over[i] }));
            if (data.UNTIS_TERMIN) inTerminPlan(rows, data.PLAN, plan);
            else inWeekPlan(rows, plan);
        }));
        return pills.size > 0;
    }

    /* The pill of a tile. A double period is one tile, a test on either of its periods marks it. */
    function pill(l) {
        for (const p of l.parts || [l]) {
            const test = pills.get(keyOf(p.date, SvpTimetable.hhmm(p.startTime), p.subject, p.classes));
            if (test) {
                return '<span class="tt-pruef ' + test.short.toLowerCase() + '" title="'
                    + String(test.title).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
                    + '">' + test.short + '</span>';
            }
        }
        return '';
    }

    global.svpPruefungen = { pruefArt, buttonText, abFor, publicDay, load, pill };
})(window);
