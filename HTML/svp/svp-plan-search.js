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
       Was NICHT im DOM steht, aber trotzdem gesucht wird: Dateiname und
       Beschreibung einer Material-Pille und der Text der verlinkten Seite -
       siehe den Volltext-Block weiter unten.

       Hits are painted with the CSS Custom Highlight API, exactly like the
       search in notes.html: it draws over the text without writing into the
       DOM, so the contenteditable cells - and everything saveEdits reads back
       out of them - stay untouched. */
    const SEARCH_SKIP = '.sub-head, .katex, .shift-col, .sub-tools, .chev';

    /* Die Faltung (Umlaute ausschreiben, dann Akzente abwerfen) und ihre
       Zeichen-Zuordnung stehen in svp-falten.js: die Suche ueber alle Plaene
       unter dem Laufband braucht genau dieselbe, und zwei Kopien waeren zwei
       Gelegenheiten, die Reihenfolge zu verdrehen. */
    const planFold = window.svpFalten;
    const planFoldMap = window.svpFaltenMap;

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

    /* ---- Volltext im verlinkten Material ---------------------------------
       Doc, 22.09.2026: "also werden unsere Decks (HTML) nicht durchsucht?" -
       bis dahin nicht. Die Suche sah nur, was im DOM steht, also die
       BESCHRIFTUNG der Pille; ein Wort von Folie 14 fand nichts.

       Gemessen am 22.09.2026: 216 Decks, 3,05 MB HTML zusammen, ~1,2 MB reiner
       Text, im Schnitt 14 KB je Deck. Deshalb KEIN gebauter Index, sondern faul
       nachgeladen: die Seite holt genau die Seiten, auf die ihre eigenen Pillen
       zeigen, faltet sie EINMAL und behaelt sie; jeder weitere Tastendruck ist
       dann ein includes() ueber den gefalteten Text. Ein Index (wie
       js/labs-terms.js fuer die Labs) waere nach jedem Speichern im
       Deck-Editor veraltet - so ist der Text immer der von jetzt.

       Geholt wird erst ab VT_MIN Zeichen: auf dem Fon sind das einmalig ein
       paar hundert KB, und die ersten zwei Buchstaben treffen ohnehin alles. */
    const VT_MIN = 3;
    const vtText = new Map();   /* Adresse -> gefalteter Text; '' = laeuft noch, leer oder unerreichbar */
    const vtNeed = new Set();   /* in diesem Lauf gebraucht, noch nicht geholt */
    let vtOffen = 0;            /* laufende Ladungen - der Zaehler sagt es mit " …" */
    let vtPainted = [];         /* markierte Pillen - beim naechsten Lauf abgeraeumt */

    /* Adresse einer Material-Pille, wenn wir ihren Text lesen duerfen und
       sollen - sonst ''. Gelesen wird nur die EIGENE Seite (fetch kommt an
       einen fremden Host gar nicht heran) und dort nur, was Inhalt TRAEGT:
       Foliensaetze in /decks/, Aufgabenblaetter in /aufgaben/ und die
       Aufgaben-/Testseiten. Die Labs bleiben draussen: ihr sichtbarer Text
       sind Bedienknoepfe ("Start", "Zufall"), die in jedem Lab stehen und
       jede Woche mit einem Lab-Link zum Treffer machen wuerden - dieselbe
       Ueberlegung, mit der tools/build-labs-terms.mjs die gemeinsamen Module
       aus dem Lab-Index haelt. */
    /* Der eigene Host - mit und ohne "www" und lokal. Das ist kein Luxus:
       parseMat erkennt nur ABSOLUTE Links, und in der Materialzeile stehen sie
       mal als docalvers.de, mal als www.docalvers.de. Verglichen mit
       location.origin waere die eine Schreibweise auf der Seite der anderen ein
       fremder Host - fetch kaeme nicht heran, und der Volltext waere je nach
       Schreibweise mal da und mal nicht. Geholt wird darum IMMER ueber den Host
       dieser Seite (lokal liefert serve.py HTML/ als Wurzel, live docalvers.de
       dasselbe - der Pfad passt auf beiden Seiten). */
    const VT_EIGEN = /^(?:(?:www\.)?docalvers\.de|localhost|127\.0\.0\.1)$/i;
    function vtAdresse(url) {
        let u;
        try { u = new URL(String(url == null ? '' : url), location.href); }
        catch (e) { return ''; }
        if (u.origin !== location.origin && !VT_EIGEN.test(u.hostname)) return '';
        if (!/\.html?$/i.test(u.pathname)) return '';
        const ok = /^\/decks\//i.test(u.pathname)
            || /^\/aufgaben\//i.test(u.pathname)
            || /test[\w-]*\.html$/i.test(u.pathname);
        return ok ? location.origin + u.pathname + u.search : '';
    }

    /* Das Material einer Woche - aus derselben Zeile, aus der auch die Pillen
       gebaut werden (matTd.dataset.src), nicht aus dem DOM: so zaehlt auch,
       was in einem zugeklappten Reiter haengt.
       Jeder Eintrag bringt zweierlei mit: seine "meta" - Beschreibung und
       Dateiname, beides steht nirgends im Text der Seite - und, wenn wir sie
       lesen duerfen, seine Adresse fuer den Volltext. */
    function vtEintraege(r) {
        const src = r.matTd ? (r.matTd.dataset.src || '') : '';
        if (!src || !P.parseMat) return [];
        return P.parseMat(src).map(function (en) {
            return { url: en.url, adresse: vtAdresse(en.url), meta: vtMeta(en) };
        });
    }

    /* Dateiname aus einer Adresse - und nur dann, wenn es wirklich einer ist.
       Ein SharePoint-Freigabelink endet auf einem Zufalls-Token ohne Punkt
       ("ETc4xLk9..."); der waere im Heuhaufen reines Rauschen, weil er jede
       Buchstabenfolge treffen kann. Punkt, Strich und Unterstrich werden zu
       Leerzeichen, sonst findet "begriffe" das ai-begriffe.html nicht. */
    function vtDateiname(pfad) {
        let s = String(pfad == null ? '' : pfad).split(/[?#]/)[0].replace(/\/+$/, '');
        s = s.slice(s.lastIndexOf('/') + 1);
        try { s = decodeURIComponent(s); } catch (e) { /* kaputt kodiert - nimm es roh */ }
        if (!/\.[a-z0-9]{2,5}$/i.test(s) || s.length > 80) return '';
        return s.replace(/[._-]+/g, ' ');
    }

    /* Was an einer Pille haengt, aber nirgends geschrieben steht: die
       Beschreibung (sie erscheint erst beim Darueberfahren) und der Dateiname -
       aus [[datei:...]], wenn es ihn gibt, sonst aus der Adresse selbst
       (Doc, 22.09.2026: "go" auf beides). */
    function vtMeta(en) {
        return planFold([en.desc || '', vtDateiname(en.datei || ''), vtDateiname(en.url || '')]
            .filter(Boolean).join(' '));
    }

    /* Sichtbarer Text einer geholten Seite, schon gefaltet. Geparst wird mit
       dem DOMParser statt mit einer Regex: das Dokument ist untaetig (kein
       Skript laeuft, kein Bild wird geladen), und &auml; kommt als Umlaut
       heraus - eine Regex ueber die Entities wuerde genau die Woerter
       verstuemmeln, die Doc sucht. */
    function vtFalten(html) {
        let doc = null;
        try { doc = new DOMParser().parseFromString(html, 'text/html'); } catch (e) { return ''; }
        if (!doc || !doc.body) return '';
        doc.body.querySelectorAll('script, style').forEach(function (el) { el.remove(); });
        const titel = doc.querySelector('title');
        /* Jede Folie einzeln dazu: nur so kann der Treffer sagen, auf WELCHER
           Folie das Wort steht (Doc, 22.09.2026: "der Link auf die Seite im
           Deck"). Ein Deck springt per #<nr> dorthin - fromHash in
           decks/deck.js, 1-basiert. Eine Seite ohne Folien (Aufgabenblatt)
           hat eben keine. */
        const folien = [];
        doc.querySelectorAll('section.slide').forEach(function (sec) {
            folien.push(planFold((sec.textContent || '').replace(/\s+/g, ' ')));
        });
        return {
            text: planFold(((titel ? titel.textContent + ' ' : '') + doc.body.textContent)
                .replace(/\s+/g, ' ')),
            folien: folien
        };
    }

    /* Was dieser Lauf gebraucht haette, holen - einmal je Adresse. Ist alles
       da, laeuft die Suche noch einmal, jetzt mit dem Volltext. */
    function vtLade() {
        if (!vtNeed.size) return;
        const urls = [...vtNeed];
        vtNeed.clear();
        urls.forEach(function (u) {
            if (vtText.has(u)) return;
            vtText.set(u, '');   /* Platzhalter: keine zweite Ladung derselben Seite */
            vtOffen++;
            fetch(u, { credentials: 'same-origin' })
                .then(function (res) { return res.ok ? res.text() : ''; })
                .then(function (html) { if (html) vtText.set(u, vtFalten(html)); })
                .catch(function () { /* nicht erreichbar - bleibt leer */ })
                .then(function () {
                    vtOffen--;
                    if (!vtOffen) planSearchRun();
                });
        });
    }

    /* Die Seiten einer Woche, die JEDES Suchwort hergeben - ein Wort darf aus
       der Zeile kommen, der Rest aus DERSELBEN Seite. Zwei Woerter aus zwei
       verschiedenen Decks sind kein Treffer: das waere genau die
       Zufalls-Kombination, die das UND innerhalb der Zeile vermeidet. */
    function vtTreffer(r, terms, hay, tief) {
        const out = [];
        for (const en of vtEintraege(r)) {
            let txt = en.meta;
            let seite = null;
            /* Der Volltext kommt nur ab VT_MIN Zeichen dazu - Beschreibung und
               Dateiname kosten nichts und zaehlen ab dem ersten Buchstaben. */
            if (tief && en.adresse) {
                if (!vtText.has(en.adresse)) vtNeed.add(en.adresse);
                else if (vtText.get(en.adresse)) { seite = vtText.get(en.adresse); txt += ' ' + seite.text; }
            }
            if (!txt) continue;
            /* Mindestens EIN Wort muss in DIESER Datei stehen. Ohne diese Zeile
               bekam jede Pille einer treffenden Zeile den Ring - auch das
               PowerPoint, das gar nicht gelesen werden kann (Doc, 22.09.2026:
               "alle Pillen die umrandet sind enthalten Turing?" - nein, taten
               sie nicht). Die ZEILE darf weiter ueber beides zusammen treffen;
               der Ring aber behauptet etwas ueber die Datei. */
            if (!terms.some(function (t) { return txt.includes(t); })) continue;
            if (!terms.every(function (t) { return txt.includes(t) || hay.includes(t); })) continue;
            en.folie = seite ? vtFolie(seite, terms) : 0;
            out.push(en);
        }
        return out;
    }

    /* Die erste Folie, auf der ALLE Suchwoerter stehen - sonst die erste mit
       irgendeinem. 0 heisst: keine Folien (Aufgabenblatt) oder nur im Rahmen
       des Decks gefunden. */
    function vtFolie(seite, terms) {
        const f = seite.folien || [];
        for (let i = 0; i < f.length; i++) {
            if (terms.every(function (t) { return f[i].includes(t); })) return i + 1;
        }
        for (let i = 0; i < f.length; i++) {
            if (terms.some(function (t) { return f[i].includes(t); })) return i + 1;
        }
        return 0;
    }

    /* Ein Treffer im Deck fuehrt auf SEINE Folie (Doc, 22.09.2026). Der eigene
       Klick der Pille oeffnet das Deck im kleinen Fenster und kennt nur die
       nackte Adresse - deshalb faengt dieser Horcher den Klick in der
       Capture-Phase ab, solange eine Folie gesetzt ist. Mittelklick und
       Cmd-Klick bleiben dem Browser: fuer sie steht die Foliennummer im href.
       Wird die Suche geleert, verschwinden beide wieder. */
    function vtAnkern(pill, en) {
        const folie = en.folie || 0;
        if (!folie) return;
        pill.dataset.vtFolie = String(folie);
        if (!pill.dataset.vtHref) pill.dataset.vtHref = pill.getAttribute('href') || '';
        pill.setAttribute('href', pill.dataset.vtHref.replace(/#.*$/, '') + '#' + folie);
        pill.title = 'Treffer auf Folie ' + folie;
        if (pill.vtWired) return;
        pill.vtWired = true;
        pill.addEventListener('click', function (e) {
            const f = pill.dataset.vtFolie;
            if (!f) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            P.openMat(String(en.url).replace(/#.*$/, '') + '#' + f, null);
        }, true);
    }

    /* Die Pille dieses Eintrags. Erst am href verglichen, den renderMaterial
       genauso schreibt (siteHref), sonst an der aufgeloesten Adresse - lokal
       schneidet siteHref den eigenen Host ab, live nicht. */
    function vtPille(detail, en) {
        if (!detail) return null;
        const href = P.siteHref(en.url || '');
        for (const a of detail.querySelectorAll('a.badge')) {
            const h = a.getAttribute('href') || '';
            if (h === href) return a;
            if (en.adresse && vtAdresse(h) === en.adresse) return a;
        }
        return null;
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
        vtPainted.forEach(function (pill) {
            pill.classList.remove('vt-hit');
            /* Die Folie gilt nur, solange gesucht wird: ohne Suchwort fuehrt
               die Pille wieder auf die erste Folie. */
            delete pill.dataset.vtFolie;
            if (pill.dataset.vtHref) { pill.setAttribute('href', pill.dataset.vtHref); delete pill.dataset.vtHref; }
        });
        vtPainted = [];
        vtNeed.clear();
        /* Der Volltext kommt erst ab VT_MIN Zeichen dazu (Leerzeichen zaehlen
           nicht mit, die Umlaute sind hier schon gefaltet). */
        const tief = terms.join('').length >= VT_MIN;
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
            const vtHits = vtTreffer(r, terms, hay, tief);
            const ok = terms.every(function (t) { return hay.includes(t); }) || vtHits.length > 0;
            tr.classList.toggle('plan-miss', !ok);
            if (detail) detail.classList.toggle('plan-miss', !ok);
            if (!ok) continue;
            hits++;

            let deep = false, inNotes = false;
            /* Welcher rechte Reiter den Treffer traegt: liegt er in einem
               zugeklappten (Videos, Aufgaben), holt die Suche ihn nach vorn -
               sonst zaehlt der Treffer, und vorne steht Zusatzmaterial. */
            let rechtsZu = null, rechtsOffen = false;
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
                        const rp = p.node.parentElement.closest('.sub-side [data-pane]');
                        if (rp && rp.hidden) rechtsZu = rechtsZu || rp.dataset.pane;
                        else if (rp) rechtsOffen = true;
                    }
                }
            }
            /* Im Deck selbst kann die Suche nichts anmalen - also traegt die
               Pille den Treffer, die dorthin fuehrt. */
            vtHits.forEach(function (en) {
                const pill = vtPille(detail, en);
                if (!pill) return;
                pill.classList.add('vt-hit');
                vtAnkern(pill, en);
                vtPainted.push(pill);
                deep = true;
                const rp = pill.closest('.sub-side [data-pane]');
                if (rp && rp.hidden) rechtsZu = rechtsZu || rp.dataset.pane;
                else if (rp) rechtsOffen = true;
            });
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
            if (!rechtsOffen && rechtsZu && r.showRechts) r.showRechts(rechtsZu);
        }

        /* The counter keeps its slot even while empty - otherwise the field
           would jump narrower the moment the first letter is typed. */
        vtLade();
        /* Das " …" ist keine Zierde: solange Seiten unterwegs sind, ist die
           Zahl vorlaeufig und springt gleich noch. */
        searchCount.textContent = terms.length
            ? hits + ' von ' + total + (vtOffen ? ' …' : '') : '';
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
        searchInput.title = 'Sucht in Woche, Bereich, Thema, Stichpunkten, Notizen und Material - samt Dateiname und Beschreibung, ab drei Zeichen auch IM verlinkten Material (Decks, Aufgabenblaetter)';
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

        /* Doc, 20.09.2026: "rechts neben Eingangstest, rechtsbuendig" - the one
           formula sheet allowed in the Abitur, straight from the IQB server so it
           is always the current edition. Built here and not in each page's markup
           because the link is the same everywhere; the pages listed below are the
           ones where it belongs. .head-row is space-between, so this second child
           lands at the right edge by itself - no CSS needed. */
        /* Adresse und Seitenliste stehen bei den festen Material-Links
           (svp-plan-material.js): dieselbe Quelle fuer diesen Knopf, die
           Pille in der Zusatzmaterial-Zeile und die im Fahrplan-Blatt. */
        const FORMELN_URL = P.FORMELN_URL;
        const FORMELN_ON = P.FORMELN_ON;
        const headRow = document.querySelector('.page-head .head-row');
        const page = location.pathname.replace(/.*\//, '').replace(/\.html$/, '');
        if (headRow && FORMELN_ON.includes(page)) {
            const b = document.createElement('button');
            b.className = 'action secondary';
            b.textContent = 'Formelsammlung';
            b.title = 'Mathematisch-Naturwissenschaftliche Formelsammlung (IQB/KMK) - ' +
                'das einzige zugelassene Hilfsmittel der Abiturpruefung';
            b.addEventListener('click', function () {
                window.open(FORMELN_URL, '_blank', 'noopener');
            });
            headRow.appendChild(b);
        }
        /* Aus der Suche unter dem Laufband kommend: ?q=<wort> fuellt das Feld und
           laesst die Suche laufen, damit der Treffer hier auch angemalt ist -
           der Sprung ?kw= bringt nur die Woche, nicht das Wort (Doc,
           22.09.2026). Erst nach dem Aufbau, damit die Zeilen stehen. */
        (function () {
            let q = null;
            try { q = new URLSearchParams(location.search).get('q'); } catch (e) { return; }
            if (!q) return;
            searchInput.value = q;
            setTimeout(planSearchRun, 0);
        })();
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
