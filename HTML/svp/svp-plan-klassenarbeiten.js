// Stoffverteilungsplan renderer, part "klassenarbeiten": the written tests of the plan's class in each week.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    Object.assign(P, {
        paintKlassenarbeiten
    });

    /* Doc, 29.10.2026: the school's plans of all Klassenarbeiten and Klausuren (Teams, read by
       tools/klassenarbeiten.py into svp_untis, row _klassenarbeiten - only Doc's account may read it)
       show up in the plan itself: a small line under the topic of a week names the tests the class
       writes that week, so a date for a new one can be chosen right in the plan. Which class the plan
       is for comes from svp-map.json (BGY26-1 + BGY26-2 -> the group "1,2" of BGY26; BGY25 -> all
       Klausuren of the year group, whose courses mix the classes). The full table: klassenarbeiten.html. */
    const ROW = '_klassenarbeiten';
    const TAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    let mine = null;          // the entries of this plan's class, by KW
    let label = '';

    function gruppeFuer(klassen, data) {
        /* "BGY26-1" -> BGY26 and its group containing 1; "BGY25" -> BGY25 without a group */
        const out = [];
        (klassen || []).forEach(function (k) {
            const m = /^(BGY\d{2})(?:-(\d))?$/.exec(k);
            if (!m) return;
            const j = (data.jahrgaenge || []).find(x => x.j === m[1]);
            if (!j) return;
            const g = m[2] ? (j.gruppen || []).find(x => x.split(',').indexOf(m[2]) >= 0) || null : null;
            if (!out.some(o => o.j === j.j && o.g === g)) out.push({ j: j.j, g: g });
        });
        return out;
    }

    function tm(iso) {
        const p = iso.split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2]);
        return TAGE[d.getDay()] + ' ' + String(p[2]).padStart(2, '0') + '.' + String(p[1]).padStart(2, '0') + '.';
    }

    function paintKlassenarbeiten() {
        if (!mine) return;
        P.rendered.forEach(function (ref) {
            if (!ref.topicSpan) return;
            const cell = ref.topicSpan.parentNode;
            const old = cell && cell.querySelector(':scope > .ka-zeile');
            if (old) old.remove();
            const list = ref.kw != null && mine[+ref.kw];
            if (!cell || !list || !list.length) return;
            const box = document.createElement('div');
            box.className = 'ka-zeile';
            if (list.some(e => e.verstoss === 'regel')) box.classList.add('regel');
            const a = document.createElement('a');
            a.className = 'ka-tag';
            a.textContent = label;
            a.href = P.SVP_DIR + 'klassenarbeiten.html';
            a.target = '_blank';
            a.rel = 'noopener';
            a.title = 'Alle Klassenarbeiten und Klausuren BGY';
            a.addEventListener('click', ev => ev.stopPropagation());   /* not the row's detail toggle */
            box.appendChild(a);
            list.forEach(function (e, n) {
                const s = document.createElement('span');
                s.className = 'ka-e' + (e.meins ? ' meins' : '') + (e.verstoss ? ' ' + e.verstoss : '');
                s.textContent = (e.d ? tm(e.d) + (e.unsicher ? '?' : '') + ' ' : '') + (e.fach || '–') +
                    (e.art ? ' (KL)' : '') + (n < list.length - 1 ? ' · ' : '');
                s.title = [e.fach, e.wer, e.art, e.raum && 'Raum ' + e.raum, e.verstoss === 'regel' && 'mehr als BGySO § 17 (4) erlaubt']
                    .filter(Boolean).join(' · ');
                box.appendChild(s);
            });
            box.contentEditable = 'false';
            cell.appendChild(box);
        });
    }

    (function loadKlassenarbeiten() {
        if (!/\.html$/.test(location.pathname)) return;
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        const map = fetch(P.SVP_DIR + 'svp-map.json', { cache: 'no-store' })
            .then(res => (res.ok ? res.json() : null)).catch(() => null);
        const data = svpAuth.api('svp_untis?page=eq.' + ROW + '&select=data')
            .then(res => (res.ok ? res.json() : null)).catch(() => null);
        Promise.all([map, data]).then(function (got) {
            const entry = got[0] && (got[0].pages || []).find(p => location.pathname.endsWith(p.page));
            const rows = got[1];
            if (!entry || !rows || !rows.length || !rows[0].data) return;
            const d = rows[0].data;
            const gruppen = gruppeFuer(entry.classes, d);
            if (!gruppen.length) return;
            label = gruppen.some(g => g.g) ? 'KA' : 'Klausuren';
            mine = {};
            (d.eintraege || []).forEach(function (e) {
                if (!gruppen.some(g => g.j === e.j && (!g.g || g.g === e.g))) return;
                (mine[e.kw] = mine[e.kw] || []).push(e);
            });
            paintKlassenarbeiten();
            /* the table is built again after a shift or a cloud update - paint the new rows too */
            if (P.tbody && window.MutationObserver) {
                let t = null;
                new MutationObserver(function () {
                    clearTimeout(t);
                    t = setTimeout(paintKlassenarbeiten, 50);
                }).observe(P.tbody, { childList: true });
            }
        });
    })();
});
