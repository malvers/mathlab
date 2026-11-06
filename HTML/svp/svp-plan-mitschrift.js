// Stoffverteilungsplan renderer, part "mitschrift": the "Notizen" button of a week opens what Doc said in
// its lessons (DocMitschrift) in a new tab.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        mitschriftBtn, mitschriftRefresh
    });

    /* Doc, 06.11.2026: "Inhalt und Notizen sind ja ein Tab. Wir machen das Notizen als Button. Und wenn
       man Notizen klickt fuer die jeweilige Unterrichtsstunde, oeffnet sich in einem neuen Tab die
       Mitschriftenseite" - "die Notizen koennen weg". The Mitschrift is school data and lives only on
       Doc's Mac (~/Documents/mitschrift), so the button exists only on pages of the local server, which
       builds the page (serve.py /__mitschrift/, docmitschrift-app/mitschrift_seite.py). On docalvers.de
       and on the phone there is no button. Which lessons a week has comes from WebUntis (part "untis",
       r.untisEntries): a lesson counts when its date and class match a written-down block and its start
       lies inside it - mitschrift.py joins a double lesson into one block. */
    const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    let index = null;   // the written-down lessons from the server, null until they are there

    function classesOf(e) {
        return String(e.klasse || '').split(',').map(function (c) { return c.trim(); }).filter(Boolean);
    }

    /* The Untis lessons of a week that have a Mitschrift. */
    function lessonsOf(r) {
        if (!index || !r.untisEntries) return [];
        return r.untisEntries.filter(function (e) {
            const date = String(e.date), start = String(e.start || ''), cls = classesOf(e);
            return index.some(function (b) {
                return b.date === date && b.start <= start && start < b.end
                    && cls.some(function (c) { return b.classes.indexOf(c) >= 0; });
            });
        });
    }

    /* Green and alive when the week has a Mitschrift, grey and dead when not - like the Fahrplan stack
       and the old "Notizen" tab, which turned green when something stood in it (Doc, 07.09.2026). */
    function mitschriftRefresh(r) {
        const b = r && r.mitschriftBtn;
        if (!b) return;
        const n = lessonsOf(r).length;
        b.disabled = !n;
        b.classList.toggle('has-notes', n > 0);
        b.title = n ? 'Mitschrift dieser Woche in einem neuen Tab öffnen'
            : index ? 'Für diese Woche gibt es keine Mitschrift' : 'Mitschrift wird gesucht …';
    }

    function mitschriftBtn(ref, tabs) {
        if (!LOCAL) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sub-tab sub-mitschrift';
        b.textContent = 'Notizen';
        /* the small arrow says: this opens a new tab, it is not a tab of its own */
        b.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 10 10" aria-hidden="true">'
            + '<path d="M3.5 1.5h5v5M8.5 1.5 1.5 8.5"/></svg>');
        b.addEventListener('mousedown', P.keinMausfokus);
        b.addEventListener('click', function (ev) {
            ev.stopPropagation();               /* the row click would fold the week away */
            const hits = lessonsOf(ref);
            if (!hits.length) return;
            const s = hits.map(function (e) {
                return String(e.date) + '-' + String(e.start).replace(':', '') + '-' + classesOf(e).join('+');
            }).join(',');
            window.open('/__mitschrift/woche?s=' + encodeURIComponent(s), '_blank', 'noopener');
        });
        tabs.appendChild(b);
        ref.mitschriftBtn = b;
        mitschriftRefresh(ref);
        loadIndex();
    }

    /* Only Doc's eyes: the plan asks the local server once which lessons are written down - on the
       first button, which only a logged-in page builds (part "rows"). Not while this part runs: the
       login helper (part "state") does not exist yet then. */
    let asked = false;
    function loadIndex() {
        if (asked) return;
        asked = true;
        fetch('/__mitschrift/stunden.json', { cache: 'no-store' })
            .then(function (res) { return res.ok ? res.json() : []; })
            .catch(function () { return []; })
            .then(function (list) {
                index = Array.isArray(list) ? list : [];
                (P.rendered || []).forEach(mitschriftRefresh);
            });
    }
});
