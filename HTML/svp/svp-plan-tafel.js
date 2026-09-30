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
// svp_plan_edits). The pill opens decks/tafel.html: the working as a deck, one slide per task, with
// Solita to ask about every step (Doc, 27.09.2026: "viel besser ... ein Deck", the PDF is gone).
//
// Doc, 30.09.2026: "ich hätte gern pro Woche Vorrechnen von 10 (20?) Aufgaben zum Thema ... einen Button pro Woche und
// das Deck pro Woche" - only in Mathe BGY 11 ("Ich mache Mathe nur BGY 11 ... dafür!"). A block of vorrechnen.html that
// carries a calendar week (BLOECKE kw) is a pill "Vorrechnen" in that week, before the boards: decks/tafel.html?kw=<week>,
// every task of the week with its solution step by step. A fixed pill as well.
window.svpPlanParts.push(function (P) {
    Object.assign(P, { tafelLinks, vorrechnenKnopf });

    const me = document.querySelector('script[src*="svp-plan-tafel.js"]');
    const TAFEL_URL = new URL('../decks/tafel.html', me ? me.src : location.href).href;
    const WURZEL = new URL('../', me ? me.src : location.href).href;
    const VORRECHNEN_SEITE = /\/svp\/mathe\/mathe11\.html$/;

    let tafeln = [];    /* [{ id, kw, datum, titel }] of this page, this school year */
    let vorrechnen = {};    /* { kw: the titles of its blocks } */

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
        const woche = vorrechnen[String(ref.kw)];
        return (woche ? [{
            label: 'Vorrechnen',
            url: TAFEL_URL + '?kw=' + encodeURIComponent(ref.kw),
            icon: 'tafel',
            titel: 'Vorrechnen der Woche: ' + woche + ' - alle Aufgaben mit Musterlösung Schritt für Schritt, mit Solita'
        }] : []).concat(tafeln.filter(t => String(t.kw) === String(ref.kw)).map(t => ({
            label: 'Tafel ' + tag(t.datum),
            url: TAFEL_URL + '?id=' + encodeURIComponent(t.id),
            icon: 'tafel',
            titel: 'Tafelbild vom ' + tag(t.datum) + ' - die Rechnung aus der Stunde als Deck, mit Solita zu jedem Schritt'
        })));
    }

    /* Doc, 30.09.2026, over the free room left of the week's tabs (Zusatzmaterial | Videos | Aufgaben): "gib mir da
       das Tafelicon. Wenn click: zeig Vorrechnen - das Tool mit den Aufgaben! Genial" - in a week with a Vorrechnen
       block the blackboard stands there and opens vorrechnen.html on that block (?kw=, js/vorrechnen-zustand.js), in
       a tab of its own; in the other weeks nothing. Built with the week's head (svp-plan-rows.js), shown once the
       blocks are read (vorrechnenLaden). */
    const knoepfe = [];
    function knopfZeigen(k) {
        const woche = vorrechnen[String(k.ref.kw)];
        k.b.hidden = !woche;
        if (woche) k.b.title = 'Vorrechnen: ' + woche;
    }
    function vorrechnenKnopf(ref, kopf, vor) {
        if (!VORRECHNEN_SEITE.test(location.pathname) || window.UNTIS_TERMIN || ref.kw == null || ref.kw === '') return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sub-vorrechnen';
        b.setAttribute('aria-label', 'Vorrechnen mit den Aufgaben der Woche');
        b.appendChild(P.tafelIcon());
        b.addEventListener('mousedown', P.keinMausfokus);
        b.addEventListener('click', function (ev) {
            ev.stopPropagation();   /* sonst klappt der Zeilenklick zu */
            window.open(WURZEL + 'vorrechnen.html?kw=' + encodeURIComponent(ref.kw), '_blank', 'noopener');
        });
        kopf.insertBefore(b, vor);
        const k = { ref, b };
        knoepfe.push(k);
        knopfZeigen(k);
    }

    /* the weeks are built by now: draw their material again, pills included */
    function neuZeichnen() {
        knoepfe.forEach(knopfZeigen);
        (P.rendered || []).forEach(r => {
            if (!r.matTd || !tafelLinks(r).length) return;
            P.updateMaterial(r, r.matTd.dataset.src || '');
            if (r.refreshExpandable) r.refreshExpandable();
        });
    }

    /* A school year starts in August: last year's boards of the same calendar week stay out. */
    function schuljahrBeginn() {
        const d = new Date();
        const jahr = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
        return jahr + '-08-01';
    }

    /* Read without a session - the class sees the plan without logging in. Only the
       handful of fields for the pills; the working itself is fetched by decks/tafel.html. */
    (function laden() {
        if (!/\.html$/.test(location.pathname) || !window.svpAuth) return;
        const url = svpAuth.DB_URL + '/rest/v1/svp_tafel?page=eq.' + encodeURIComponent(location.pathname) +
            '&datum=gte.' + schuljahrBeginn() + '&select=id,kw,datum,titel&order=datum';
        fetch(url, { headers: { apikey: svpAuth.DB_KEY } })
            .then(res => (res.ok ? res.json() : []))
            .then(rows => {
                if (!Array.isArray(rows) || !rows.length) return;
                tafeln = rows;
                neuZeichnen();
            })
            .catch(() => { /* offline or no table: the plan stays as it is */ });
    })();

    /* The weeks of the Vorrechnen blocks, from the task files themselves: the list of vorrechnen.html (its
       <script> tags - the one list, decks/tafel.html reads it the same way), the files run together in one
       function of their own, so nothing of them lands in this page's globals. */
    (function vorrechnenLaden() {
        if (!VORRECHNEN_SEITE.test(location.pathname)) return;
        fetch(WURZEL + 'vorrechnen.html')
            .then(res => (res.ok ? res.text() : ''))
            .then(html => Promise.all([...html.matchAll(/<script\s+src="(js\/vorrechnen-aufgaben[\w-]*\.js)"/g)]
                .map(m => fetch(WURZEL + m[1]).then(res => (res.ok ? res.text() : '')))))
            .then(texte => {
                if (!texte.length) return;
                const bloecke = new Function(texte.join('\n;\n') + '\n;return BLOECKE;')();
                const wochen = {};
                bloecke.forEach(b => {
                    if (b.kw == null) return;
                    const k = String(b.kw);
                    wochen[k] = wochen[k] ? wochen[k] + ' + ' + b.titel : b.titel;
                });
                vorrechnen = wochen;
                neuZeichnen();
            })
            .catch(() => { /* offline or a file that does not run: no pill, the plan stays as it is */ });
    })();
});
