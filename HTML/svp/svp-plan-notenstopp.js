// Stoffverteilungsplan renderer, part "notenstopp": the Notenstopp of the plan's school form.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    Object.assign(P, {
        paintNotenstopp
    });

    /* Doc, 04.11.2026: "bring auch in den Stoffverteilungsplan von allen Schulformen den jeweiligen
       Notenstopp. Mit einer roten Pille ... so, dass man es auf jeden Fall klar wahrnimmt. Denn es ist
       ein absolut wichtiges Datum." The next Notenstopp stands as a big Υ-red pill under the heading, in
       the sticky head, so it never scrolls away; a click jumps to its week. Every Notenstopp also stands
       in its week - in the last plan row on or before the day, so a plan that skips weeks (FO 12, group
       view) shows it too. Public: the dates are the school's own calendar, nothing personal. */
    /* School year 2026/27. BGY: our Schuljahresablauf (svp/schuljahr.html, tools/schuljahr.py). OS/GY:
       Jahreskalender_26-27_OSGY.pdf (Teams, Organisatorisches). FOS has no calendar on the Mac - Doc,
       03.11.2026: "wir nehmen einfach den Notenstopp vom BGY", known for the first half only. */
    const SCHULJAHR = 2026;   // KW 31 and later lie in this year, the lower weeks in the next
    const NOTENSTOPP = {
        bgy13: [['2026-12-11', '1. Halbjahr'], ['2027-03-22', '2. Halbjahr']],
        bgy: [['2027-01-18', '1. Halbjahr'], ['2027-06-21', '2. Halbjahr']],
        fos: [['2027-01-18', '1. Halbjahr']],
        os: [['2027-01-22', '1. Halbjahr'], ['2027-06-25', '2. Halbjahr']],
        os10: [['2027-01-22', '1. Halbjahr'], ['2027-04-23', 'Klasse 10']],
        gy: [['2027-01-22', '1. Halbjahr'], ['2027-06-25', '2. Halbjahr']],
        gy12: [['2026-12-11', '12/I']]
    };
    const TAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    /* the school form of a plan page, by its file name */
    function schulform(path) {
        const f = path.replace(/^.*\//, '');
        if (/fos1[12]\.html$/.test(f)) return 'fos';                        // fos11, fos12, mathefos11, mathefos12
        if (/^mathegy12(lk)?\.html$/.test(f)) return 'gy12';
        if (/gy\d+(lk)?\.html$/.test(f)) return 'gy';                       // mathegy5 ... mathegy11lk, phygy10
        if (/^(inf|informatik|mathe)13\.html$/.test(f)) return 'bgy13';
        if (/^((inf|informatik|mathe)1[12]|wr11)\.html$/.test(f)) return 'bgy';
        if (/^mathe10\.html$/.test(f)) return 'os10';
        if (/^(mathe[5-9]|informatik9)\.html$/.test(f)) return 'os';
        return null;
    }

    const list = NOTENSTOPP[schulform(location.pathname)];
    if (!list) return;

    function tag(iso) {
        const p = iso.split('-').map(Number);
        return new Date(p[0], p[1] - 1, p[2]);
    }
    function label(iso) {
        const d = tag(iso), two = n => String(n).padStart(2, '0');
        return TAGE[d.getDay()] + ' ' + two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear();
    }
    /* Monday of a calendar week of this school year */
    function montag(kw) {
        const y = kw >= 31 ? SCHULJAHR : SCHULJAHR + 1;
        const jan4 = new Date(y, 0, 4);
        return new Date(y, 0, 4 - (jan4.getDay() + 6) % 7 + 7 * (kw - 1));
    }

    let rows = [];   // the plan row of each Notenstopp in the list, or null

    function paintNotenstopp() {
        P.rendered.forEach(function (ref) {
            const cell = ref.topicSpan && ref.topicSpan.parentNode;
            const old = cell && cell.querySelector(':scope > .ns-zeile');
            if (old) old.remove();
            if (ref.tr) ref.tr.classList.remove('ns-woche');
        });
        rows = list.map(function (ns) {
            const d = tag(ns[0]);
            let best = null, bestMo = null;
            P.rendered.forEach(function (ref) {
                const w = Number(P.weekOf(ref));
                if (!ref.topicSpan || !w) return;
                const mo = montag(w);
                if (mo <= d && (!bestMo || mo > bestMo)) { best = ref; bestMo = mo; }
            });
            if (!best) return null;
            const box = document.createElement('div');
            box.className = 'ns-zeile';
            box.contentEditable = 'false';   /* beside the topic, never saved with it (as .ka-zeile) */
            const pill = document.createElement('span');
            pill.className = 'ns-pill';
            pill.textContent = 'Notenstopp ' + label(ns[0]);
            pill.title = 'Notenstopp ' + ns[1] + ': Noten nur bis zu diesem Tag';
            box.appendChild(pill);
            best.topicSpan.parentNode.appendChild(box);
            if (best.tr) best.tr.classList.add('ns-woche');
            return best;
        });
        paintKopf();
    }

    /* the next Notenstopp under the heading; none once the last one has passed */
    function paintKopf() {
        const sub = document.querySelector('.page-head .subtitle');
        if (!sub) return;
        const heute = new Date();
        heute.setHours(0, 0, 0, 0);
        const n = list.findIndex(ns => tag(ns[0]) >= heute);
        let btn = sub.querySelector('.ns-kopf');
        if (n < 0) { if (btn) btn.remove(); return; }
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ns-kopf';
            sub.appendChild(btn);
        }
        btn.textContent = 'Notenstopp ' + label(list[n][0]);
        btn.title = 'Notenstopp ' + list[n][1] + ' - zur Woche springen';
        btn.onclick = function () {
            const ref = rows[n];
            if (ref && P.gotoWeek) P.gotoWeek(P.weekOf(ref));
        };
    }

    paintNotenstopp();
    /* the table is built again after a shift or a cloud update - paint the new rows too */
    if (P.tbody && window.MutationObserver) {
        let t = null;
        new MutationObserver(function () {
            clearTimeout(t);
            t = setTimeout(paintNotenstopp, 50);
        }).observe(P.tbody, { childList: true });
    }
    /* in the group view the weeks of the group's own days come later (svp-plan-untis.js) */
    const nowMark = P.runNowMark;
    P.runNowMark = function () {
        paintNotenstopp();
        return nowMark();
    };
});
