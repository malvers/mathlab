// Stoffverteilungsplan renderer, part "search": search in the plan.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        planSearchRun, planSearchClear
    });

    /* ---- Suche im Plan ---------------------------------------------------
       Doc, 08.09.2026: a search box between the toolbar buttons and the legend,
       "auch ueber Inhalte" - so it must not stop at the topic line.

       Searched is exactly what the page shows: SW, KW, Woche, the Bereich pill,
       Ustd., Thema, the bullets and Notizen of the sub-row, the Material- and
       Aufgaben pills. Deliberately NOT searched:
         - Bemerkungen: that column is gone since 07.09. (see headRow above), so
           a hit there would flag a row for a reason nobody can see;
         - rendered formulas (.katex): the KaTeX markup carries the source a
           second time, every hit would be found and painted twice;
         - the fixed captions of the sub-row (Inhalt/Notizen/Zusatzmaterial):
           they stand in every week and would match all of them at once.

       Hits are painted with the CSS Custom Highlight API, exactly like the
       search in notes.html: it draws over the text without writing into the
       DOM, so the contenteditable cells - and everything saveEdits reads back
       out of them - stay untouched. */
    const SEARCH_SKIP = '.sub-head, .katex, .shift-col, .sub-tools, .chev';
    const SEARCH_UML = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };

    /* Folding recipe from js/labs-search.js - including its trap: FIRST spell
       the umlauts out, THEN strip the remaining accents. The other way round
       "würfel" becomes "wurfel" and never finds "wuerfel" again. */
    function planFold(value) {
        return String(value == null ? '' : value)
            .normalize('NFC')
            .toLowerCase()
            .replace(/[äöüß]/g, function (ch) { return SEARCH_UML[ch]; })
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    /* The same folding per character, so a position in the folded text can be
       mapped back onto the original text node: at[k] is where folded character
       k started ("Würfel" folds to "wuerfel", 7 characters over 6). */
    function planFoldMap(src) {
        let folded = '';
        const at = [];
        for (let i = 0; i < src.length; i++) {
            const piece = planFold(src[i]);
            for (let k = 0; k < piece.length; k++) at.push(i);
            folded += piece;
        }
        at.push(src.length);
        return { folded: folded, at: at };
    }

    /* Every searchable text node of a row, already folded. Rebuilt on each
       keystroke - 40 weeks are a few thousand characters, and a cache would
       only go stale the moment Doc types in the plan. */
    function planSearchParts(root) {
        const out = [];
        if (!root) return out;
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                if (!n.data.trim()) return NodeFilter.FILTER_REJECT;
                const el = n.parentElement;
                if (!el || el.closest(SEARCH_SKIP)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
            const fm = planFoldMap(n.data);
            out.push({ node: n, folded: fm.folded, at: fm.at });
        }
        return out;
    }

    let searchInput = null;
    let searchCount = null;
    let searchOpened = [];   /* sub-rows this search opened - closed again on clear */

    function planSearchRun() {
        if (!searchInput) return;
        const terms = planFold(searchInput.value.trim()).split(/\s+/).filter(Boolean);
        searchOpened.forEach(function (tr) {
            tr.classList.remove('open');
            const s = tr.nextElementSibling;
            if (s && s.classList.contains('detail-row')) s.classList.remove('open');
        });
        searchOpened = [];
        /* A running search looks into folded holiday blocks too (svp.css lifts
           the fold while this class is set); the fold returns with the clear. */
        document.body.classList.toggle('plan-searching', terms.length > 0);
        if (window.CSS && CSS.highlights) CSS.highlights.delete('plan-find');
        const ranges = [];
        let hits = 0, total = 0;

        /* the Sommerferien row in the thead is searched like any plan row */
        for (const r of (P.preFerien ? [P.preFerien].concat(P.rendered) : P.rendered)) {
            const tr = r.ferienTd ? r.ferienTd.parentElement
                : (r.dateTd ? r.dateTd.parentElement : null);
            if (!tr) continue;
            const next = tr.nextElementSibling;
            const detail = next && next.classList.contains('detail-row') ? next : null;
            total++;
            if (!terms.length) {
                tr.classList.remove('plan-miss');
                if (detail) detail.classList.remove('plan-miss');
                continue;
            }
            /* Every word has to be found somewhere in the row (AND), the parts
               are joined with a line break so nothing matches across two cells. */
            const parts = planSearchParts(tr).concat(planSearchParts(detail));
            const hay = parts.map(function (p) { return p.folded; }).join('\n');
            const ok = terms.every(function (t) { return hay.includes(t); });
            tr.classList.toggle('plan-miss', !ok);
            if (detail) detail.classList.toggle('plan-miss', !ok);
            if (!ok) continue;
            hits++;

            let deep = false, inNotes = false;
            for (const p of parts) {
                for (const t of terms) {
                    for (let k = p.folded.indexOf(t); k !== -1; k = p.folded.indexOf(t, k + t.length)) {
                        const range = document.createRange();
                        range.setStart(p.node, p.at[k]);
                        range.setEnd(p.node, p.at[k + t.length]);
                        ranges.push(range);
                        if (!detail || !detail.contains(p.node)) continue;
                        deep = true;
                        if (p.node.parentElement.closest('[data-pane="notizen"]')) inNotes = true;
                    }
                }
            }
            /* A hit in the bullets or in the Notizen is invisible while the week
               is folded up, so the search opens it - and folds it back when the
               query goes away. openWeeks stays untouched on purpose: this is the
               search's doing, not Doc's own open state. */
            if (deep && detail && !detail.classList.contains('open')) {
                tr.classList.add('open');
                detail.classList.add('open');
                searchOpened.push(tr);
            }
            if (inNotes && r.showPane) r.showPane('notizen');
        }

        /* The counter keeps its slot even while empty - otherwise the field
           would jump narrower the moment the first letter is typed. */
        searchCount.textContent = terms.length ? hits + ' von ' + total : '';
        searchCount.classList.toggle('none', terms.length > 0 && hits === 0);
        if (ranges.length && window.CSS && CSS.highlights && window.Highlight) {
            CSS.highlights.set('plan-find', new Highlight(...ranges));
        }
    }

    function planSearchClear() {
        if (!searchInput || !searchInput.value) return;
        searchInput.value = '';
        planSearchRun();
    }

    (function buildPlanSearch() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.id = 'plan-search';
        searchInput.className = 'svp-search plan-search';
        searchInput.placeholder = 'Suchen …';
        searchInput.autocomplete = 'off';
        searchInput.setAttribute('aria-label', 'Im Plan suchen');
        searchInput.title = 'Sucht in Woche, Bereich, Thema, Stichpunkten, Notizen und Material';
        searchCount = document.createElement('span');
        searchCount.className = 'svp-search-count';
        /* At the right end of the toolbar: the pill legend that used to sit
           there is gone (the pills live in the Lernbereich cards now), so the
           field simply takes the rest of the line. */
        const anchor = P.legend && P.legend.parentNode === bar ? P.legend : null;
        bar.insertBefore(searchInput, anchor);
        bar.insertBefore(searchCount, anchor);

        /* Doc, 09.09.2026: "LP doch da hoch" + "vor Eingangstest" - der
           Lehrplan-Knopf bleibt oben im Kopf und steht direkt hinter dem Titel,
           VOR dem Eingangstest, statt ganz rechts allein. Verschoben, nicht neu
           gebaut, damit jede Seite ihren eigenen PDF-Link behaelt. */
        /* An der Beschriftung erkannt, nicht an der Farbe: der Knopf traegt seit
           dem 09.09.2026 denselben Stil wie der Eingangstest (Doc: "Stil wie
           ET"), also .action.secondary statt .action.orange. */
        const lehrplan = [...document.querySelectorAll('.page-head .head-row button.action')]
            .find(function (b) { return /Lehrplan/i.test(b.textContent); });
        const titleGroup = document.querySelector('.page-head .head-row .title-group');
        if (lehrplan && titleGroup) {
            const firstBtn = [...titleGroup.children]
                .find(function (el) { return el !== lehrplan && el.tagName !== 'H1'; });
            titleGroup.insertBefore(lehrplan, firstBtn || null);
        }
        searchInput.addEventListener('input', planSearchRun);
        searchInput.addEventListener('search', planSearchRun);   /* the native ✕ */
        searchInput.addEventListener('keydown', function (e) {
            e.stopPropagation();   /* the rows listen for keys as well */
            if (e.key !== 'Escape') return;
            searchInput.value = '';
            planSearchRun();
        });
    })();
});
