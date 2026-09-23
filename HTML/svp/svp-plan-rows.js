// Stoffverteilungsplan renderer, part "rows": open weeks, holiday folds, the table rows themselves.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        syncToggleAllLabel, syncOpenWeeks, unfoldFerienFor, equalizeLbCells,
        /* the termin view moves the holiday rows to where the group's dates
           put them - the fold cascade has to run again afterwards */
        applyFerienFolds
    });

    // Open/closed state of the week sub-rows is remembered per page and
    // browser (same idea as the LB panels). Not touched while editing —
    // edit mode force-opens everything only temporarily.
    const OPEN_KEY = 'svp-week-open:' + location.pathname;
    let openWeeks;
    try { openWeeks = new Set(JSON.parse(localStorage.getItem(OPEN_KEY) || '[]')); }
    catch (e) { openWeeks = new Set(); }
    /* Doc, 09.09.2026: "wenn zu -> Wochen auf, wenn auf Wochen zu" - der Knopf
       heisst nicht mehr "Alle auf/zu", sondern sagt, was ein Klick tut. Steht
       auch nur eine Woche offen, ist die naechste Tat das Zuklappen. */
    function syncToggleAllLabel() {
        const btn = document.querySelector('.toolbar button[onclick*="togglePlanDetails"]');
        if (!btn) return;
        const anyOpen = !!document.querySelector('tr.detail-row.open');
        btn.textContent = anyOpen ? 'Wochen zu' : 'Wochen auf';
        btn.title = anyOpen ? 'Alle Wochen zuklappen (W)' : 'Alle Wochen aufklappen (W)';
    }

    function syncOpenWeeks() {
        syncToggleAllLabel();   /* auch im Bearbeiten-Modus, der Knopf bleibt sichtbar */
        if (document.body.classList.contains('editing')) return;
        openWeeks.clear();
        document.querySelectorAll('tr.expandable.open[data-i]').forEach(function (row) {
            openWeeks.add(Number(row.dataset.i));
        });
        try { localStorage.setItem(OPEN_KEY, JSON.stringify([...openWeeks])); } catch (e) { }
    }

    // Snapshot for the restore pass: syncOpenWeeks rebuilds the live set from
    // the DOM, which is still incomplete while the table is being built.
    const initialOpen = new Set(openWeeks);

    /* Doc, 19.09.2026: "mach an die Ferien auch ein Dreieck so dass die Wochen
       danach eingeklappt werden können. Key F alle ... also alle Wochen nicht
       sichtbar" - a holiday row folds the weeks behind it, up to the next
       holiday row: those weeks vanish completely, not just their sub-rows.
       Remembered per page and browser, like the open weeks. The set holds the
       row index of every folded holiday row. */
    const FOLD_KEY = 'svp-ferien-fold:' + location.pathname;
    let foldedFerien;
    try { foldedFerien = new Set(JSON.parse(localStorage.getItem(FOLD_KEY) || '[]')); }
    catch (e) { foldedFerien = new Set(); }
    const foldableFerien = [];   /* row index of every holiday row with weeks behind it */

    /* One pass over the table: every row takes the state of the holiday row
       above it. Cheap enough to run on each toggle, and it also catches
       sub-rows that were built after the fold. */
    /* Doc, 19.09.2026: "mach ganz oben über den Header SW KW Woche noch
       Sommerferien ... die sollen weg scrollen" - the holidays BEFORE the school
       year head the table, so the first block of weeks folds like the others.
       It is the first row of the thead, but a td: only the th cells are sticky,
       so this row scrolls away and the column heads stay. Central here, no plan
       page carries it; PRE_I is its place in the fold set. */
    /* Doc, 19.09.2026: "schreib nur Sommerferien 2026" - no dates, no KW */
    const PRE_FERIEN = 'Sommerferien 2026';
    const PRE_I = -1;
    P.preFerien = null;   /* { ferienTd } - the search walks it like a plan row */

    /* Cell of a holiday row: chevron (only where weeks follow) + text. The text
       lives in its own span: it is what edit mode makes editable and what is
       saved - the chevron stays out of both. */
    function buildFerienCell(tr, label, i) {
        const td = document.createElement('td');
        td.colSpan = 7;
        const text = document.createElement('span');
        text.className = 'ferien-text';
        text.textContent = label;
        /* the Sommerferien at the end of the plan have nothing to fold */
        const next = P.planRows[i + 1];
        if (next && !next.ferien) {
            foldableFerien.push(i);
            tr.classList.add('foldable');
            const chev = document.createElement('span');
            chev.className = 'chev';
            chev.textContent = '▸';
            chev.title = 'Wochen bis zu den nächsten Ferien ein- oder ausklappen (F: alle)';
            td.appendChild(chev);
            /* While editing a click into the text sets the cursor, then only
               the chevron folds - same rule as for the week rows. */
            tr.addEventListener('click', function (e) {
                if (text.isContentEditable && e.target !== chev) return;
                toggleFerienFold(i);
            });
        }
        td.appendChild(text);
        tr.appendChild(td);
        return { td, text };
    }

    (function buildPreFerien() {
        const thead = document.querySelector('#plan-table thead');
        if (!thead || !P.planRows.length || P.planRows[0].ferien) return;
        const tr = document.createElement('tr');
        tr.className = 'ferien';
        tr.dataset.i = PRE_I;
        P.preFerien = { ferienTd: buildFerienCell(tr, PRE_FERIEN, PRE_I).td };
        thead.insertBefore(tr, thead.firstChild);
    })();

    /* Doc, 23.09.2026: "wenn ein Ferienjunk offen ist waere es toll wenn er
       direkt ueber den Junk auftaucht" - der Spaltenkopf gehoert ueber die
       Wochen, die er beschriftet, nicht nur an den Anfang der Tabelle. Der Kopf
       im thead beschriftet den ersten Block; jeder weitere offene Block bekommt
       eine Kopie direkt unter sein Ferienband.
       Eine Kopie je Block statt eines umgehaengten Kopfes, weil mehrere offene
       Bloecke mit zugeklappten dazwischen der Normalfall sind (Doc, 23.09.2026:
       "vorsicht, sind zwei nicht aufeinanderfolgende offen").
       Die Kopien sind reine Anzeige und werden bei jedem Falten neu gesetzt:
       Suche, Verschieben und Papier zeigen den Plan am Stueck und blenden sie
       aus (svp-detail.css, svp-print.css). */
    function syncColHeads(table) {
        const master = table.querySelector('thead tr:not(.ferien)');
        if (!master) return;
        /* Die Wochen ueber der ersten Ferienzeile haengen am Kopf im thead. */
        let prevFolded = P.preFerien ? foldedFerien.has(PRE_I) : true;
        for (const tr of [...P.tbody.children]) {
            if (!tr.classList.contains('ferien')) continue;
            const folded = foldedFerien.has(Number(tr.dataset.i));
            /* Eine Kopie nur, wo sonst keine mehr ueber den Wochen steht:
               laufen die Wochen des Blocks darueber direkt in dieses Band, ist
               der Kopf schon dort gelesen - ein offener Plan sieht deshalb aus
               wie bisher, mit einem einzigen Kopf ganz oben. */
            if (!folded && prevFolded && tr.classList.contains('foldable')) {
                const copy = master.cloneNode(true);
                copy.classList.add('col-head');
                tr.after(copy);
            }
            /* Ein Ferienband ohne Wochen dahinter bringt nichts mit - der Block
               darueber bleibt der, an dem sich das naechste Band misst. */
            if (tr.classList.contains('foldable')) prevFolded = folded;
        }
    }

    function applyFerienFolds() {
        const table = document.getElementById('plan-table');
        /* Die Kopf-Kopien zuerst weg: die Schleife unten laeuft ueber alle
           Kinder des tbody und hielte sie sonst fuer Wochenzeilen. */
        if (table) for (const old of [...table.querySelectorAll('tr.col-head')]) old.remove();
        let folded = !!P.preFerien && foldedFerien.has(PRE_I);
        if (P.preFerien) P.preFerien.ferienTd.parentElement.classList.toggle('folded', folded);
        for (const tr of P.tbody.children) {
            if (tr.classList.contains('ferien')) {
                folded = foldedFerien.has(Number(tr.dataset.i));
                tr.classList.toggle('folded', folded);
                continue;
            }
            tr.classList.toggle('ferien-folded', folded);
        }
        if (!table) return;
        /* Doc, 19.09.2026: "wenn alle zu auch den Header weg" - der Kopf im
           thead beschriftet die Wochen direkt unter sich. Sind die zugeklappt -
           oder beginnt der Plan mit Ferien, dann stehen dort gar keine -, dann
           beschriftet er nichts und geht mit. "Alle zu" ist davon nur der
           Sonderfall, in dem auch keine Kopie mehr uebrig bleibt. */
        const first = P.tbody.firstElementChild;
        table.classList.toggle('head-folded', P.preFerien
            ? foldedFerien.has(PRE_I)
            : !!(first && first.classList.contains('ferien')));
        syncColHeads(table);
    }
    function setFerienFolds(set) {
        foldedFerien = set;
        applyFerienFolds();
        try { localStorage.setItem(FOLD_KEY, JSON.stringify([...foldedFerien])); } catch (e) { }
    }
    function toggleFerienFold(i) {
        const next = new Set(foldedFerien);
        if (!next.delete(i)) next.add(i);
        setFerienFolds(next);
    }
    /* A jump to a week (?kw=) must not land on an invisible row. */
    function unfoldFerienFor(tr) {
        if (!tr.classList.contains('ferien-folded')) return;
        let head = tr.previousElementSibling;
        while (head && !head.classList.contains('ferien')) head = head.previousElementSibling;
        /* no holiday row above it in the tbody: the block under the thead row */
        toggleFerienFold(head ? Number(head.dataset.i) : PRE_I);
    }
    /* Key F - same logic as W for the weeks: as long as one block is still
       showing, the next act is folding them all. */
    window.toggleFerienFolds = function () {
        const anyShowing = foldableFerien.some(i => !foldedFerien.has(i));
        setFerienFolds(new Set(anyShowing ? foldableFerien : []));
    };

    P.planRows.forEach((row, i) => {
        const ov = P.saved[i] || {};
        const tr = document.createElement('tr');
        tr.dataset.i = i;

        if (row.ferien) {
            tr.className = 'ferien';
            const cell = buildFerienCell(tr, ov.ferien || row.ferien, i);
            P.tbody.appendChild(tr);
            P.rendered.push({ i, ferienTd: cell.td, ferienText: cell.text });
            return;
        }

        /* Shift arrows, first cell of the row. Built for every week, shown
           only in shift mode; the ▲ additionally only when the week above is
           free (setShiftMode decides, it needs helpers defined further down). */
        const shiftTd = document.createElement('td');
        shiftTd.className = 'shift-col';
        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'shift-btn';
        upBtn.textContent = '▲';
        upBtn.title = 'Diese Woche auf die freie Woche davor ziehen';
        upBtn.setAttribute('aria-label', 'Woche eine Woche früher');
        upBtn.hidden = true;
        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'shift-btn';
        downBtn.textContent = '▼';
        downBtn.title = 'Diese Woche und alles danach eine Woche nach hinten schieben';
        downBtn.setAttribute('aria-label', 'Woche eine Woche später');
        upBtn.addEventListener('click', function (e) { e.stopPropagation(); P.runShift(i, -1); });
        downBtn.addEventListener('click', function (e) { e.stopPropagation(); P.runShift(i, 1); });
        shiftTd.appendChild(upBtn);
        shiftTd.appendChild(downBtn);
        tr.appendChild(shiftTd);

        /* type belongs to the edits too — a shift moves the Bereich along with
           the topic, otherwise the badges stay behind on the old week. */
        const rowType = ov.type || row.type || 'org';
        /* row.leer: a week that stays in the plan but has nothing in it. It
           keeps its SW, KW, date and its Gedanke der Woche - those hang on the
           row - and shows nothing else, not even a Bereich pill (Doc,
           20.09.2026: "nimm da alles raus ... GDW drin lassen"). It looks like
           the empty weeks of the group view, so it wears their class. */
        const leer = !!(ov.leer != null ? ov.leer : row.leer);
        if (leer) tr.classList.add('leerwoche');
        const [badgeClass, badgeLabel] = window.BADGE[rowType] || window.BADGE.org;
        const tds = [];
        const values = [
            ['num', String(ov.nr != null ? ov.nr : row.nr)],
            ['num', String(ov.kw != null ? ov.kw : row.kw)],
            ['date', ov.date != null ? ov.date : row.date],
            ['', null],
            ['num', ov.u != null ? ov.u : row.u],
            ['topic', null],
            ['remark', ov.remark != null ? ov.remark : row.remark]
        ];
        values.forEach(([cls, text], idx) => {
            const td = document.createElement('td');
            if (cls) td.className = cls;
            if (idx === 3) {
                td.classList.add('lb');
                /* Pille und WebUntis-Chip stehen nebeneinander in einer Zeile
                   (Doc, 07.09.2026) - siehe .lb-cell in svp.css. Die Zelle gibt
                   es auch in einer leeren Woche, nur ohne Pille: der Chip und
                   equalizeLbCells rechnen mit ihr. */
                const cell = document.createElement('div');
                cell.className = 'lb-cell';
                if (!leer) {
                    const span = document.createElement('span');
                    span.className = 'badge ' + badgeClass;
                    span.textContent = badgeLabel;
                    P.linkBadge(span, rowType);
                    cell.appendChild(span);
                }
                td.appendChild(cell);
                P.lbCells[i] = cell;
            } else if (idx === 2) {
                P.setDateText(td, text);
            } else if (idx === 4) {
                td.classList.add('ustd');
                td.textContent = text;
            } else if (idx !== 5 && idx !== 6) {
                td.textContent = text;
            }
            tds.push(td);
            if (idx !== 6) tr.appendChild(td);   /* 6 = Bemerkungen, nicht mehr sichtbar */
        });
        P.setMathText(tds[6], values[6][1]);
        /* Eine leere Woche hat nichts aufzuklappen und bekaeme deshalb kein
           Chevron - ihre Nummer stuende dann weiter links als die der Wochen
           darum herum (Doc, 20.09.2026: "zahlen untereinander pls"). Also ein
           leerer Platzhalter, wie ihn die Leerwochen der Gruppen-Ansicht auch
           haben (siehe tr.leerwoche .chev in svp.css). */
        if (leer) {
            const spacer = document.createElement('span');
            spacer.className = 'chev';
            spacer.setAttribute('aria-hidden', 'true');
            tds[0].insertBefore(spacer, tds[0].firstChild);
        }

        // Material cell (week row): only a compact 📎 marker + quick-add;
        // the pills themselves live in the expandable sub-row (more room).
        const matTd = document.createElement('td');
        matTd.className = 'mat';
        tr.appendChild(matTd);

        // Topic cell: optional chevron + editable text span.
        const topicSpan = document.createElement('span');
        topicSpan.className = 'topic-text';
        P.setMathText(topicSpan, ov.topic != null ? ov.topic : row.topic);
        tds[5].appendChild(topicSpan);
        P.tbody.appendChild(tr);

        const ref = {
            i, dateTd: tds[2], uTd: tds[4], topicSpan, remarkTd: tds[6], matTd, ul: null,
            lbTd: tds[3], lbCell: P.lbCells[i], tr: tr,
            /* structural fields: never edited by hand, but carried through every
               save so a shifted plan keeps its Bereich, Nummer and KW */
            type: rowType, nr: ov.nr != null ? ov.nr : row.nr, kw: ov.kw != null ? ov.kw : row.kw,
            upBtn: upBtn,
            /* optional red button left of the Aufgaben pill: row.redBtn = 'Label'
               or { label, title, items } - items open as a list under it */
            redBtn: row.redBtn || null
        };

        // Expandable sub-row, created on demand: bullets under the topic
        // column, materials in the free area under Bemerkungen/Material.
        let detailTr = null, subMain = null, subSide = null, rPanes = null, chev = null;
        /* Markiert genau diese Woche als "wird gerade bearbeitet". Beide Zeilen
           tragen die Klasse: die Wochenzeile fuer +/⧉/⇩ und den Untis-Chip, die
           Aufklappzeile fuer das ✕ an den Pillen und die Auszeichnungs-Leiste. */
        ref.markEdit = function (an) {
            tr.classList.toggle('wk-edit', !!an);
            if (detailTr) detailTr.classList.toggle('wk-edit', !!an);
        };
        function ensureSubRow() {
            if (detailTr) return { main: subMain, side: subSide, panes: rPanes };
            /* ref.ul / ref.notesEl are created below, together with the tabs */
            detailTr = document.createElement('tr');
            detailTr.className = 'detail-row';
            /* Die Aufklappzeile entsteht spaeter als die Markierung - hier
               holt sie sie nach, sonst fehlte ihr das ✕ an den Pillen. */
            if (tr.classList.contains('wk-edit')) detailTr.classList.add('wk-edit');
            subMain = document.createElement('td');
            /* Doc, 07.09.2026: the week row shows the topic on one line, so the full
               title stands here - and the whole row width is used: the old layout kept
               an empty 370 px block under Nr/KW/Woche and squeezed the materials into
               a 298 px side cell, where five pills stacked into five lines. */
            /* Doc, 20.09.2026: "MAt rechtsbuendig bitte" - die Zeile deckte sieben der
               acht Spalten ab und endete damit VOR der Bilderspalte; Material und
               Reiter hoerten 8 px vor den Vorschaubildern auf. Ueber alle acht
               Spalten endet sie genau auf deren Kante, beide Zellen polstern 6 px. */
            subMain.colSpan = 8;
            /* Doc, 07.09.2026: Text links auf 60 % der Breite, das Material wieder
               rechts daneben statt darunter - der Platz rechts der Stichpunkte lag
               sonst brach. Die Aufgaben-Pille bleibt direktes Kind der Zelle, sie
               haengt absolut oben rechts. */
            /* Kopfzeile ueber beide Haelften: links die Reiter, rechts "Zusatzmaterial"
               (Doc, 07.09.2026). Jede Haelfte traegt ihre eigene Linie, dazwischen
               bleibt derselbe Abstand wie zwischen den Spalten darunter. */
            const subHead = document.createElement('div');
            subHead.className = 'sub-head';
            const subHeadL = document.createElement('div');
            subHeadL.className = 'sub-head-l';
            const subHeadR = document.createElement('div');
            subHeadR.className = 'sub-head-r';
            subHead.appendChild(subHeadL);
            subHead.appendChild(subHeadR);
            subMain.appendChild(subHead);
            ref.subHeadL = subHeadL;
            /* Der Fahrplan-Stapel steht vor allem anderen in dieser Haelfte, also
               vor "Inhalt" (Doc, 20.09.2026). Die Reiter kommen erst danach dazu. */
            P.fahrplanBtn(ref, subHeadL);
            const subBody = document.createElement('div');
            subBody.className = 'sub-body';
            const subLeft = document.createElement('div');
            subLeft.className = 'sub-left';
            subBody.appendChild(subLeft);
            ref.ul = document.createElement('ul');
            /* Two tabs in the sub-row (Doc, 03.09.2026): "Inhalt" holds the
               bullet list as before, "Notizen" a free text field that Doc
               fills in edit mode. Notes stay out of both exports and out of
               the Untis text - they belong to the lesson, not to the plan.
               Logged out there is no tab strip and no Notizen element at all,
               so a visitor's DOM looks exactly as it did before. */
            if (!P.notesAllowed()) {
                /* Ohne Anmeldung gibt es keine Reiter. Dann steht links dieselbe
                   gemalte Beschriftung wie rechts, sonst haengt da eine nackte
                   Linie und beide Haelften sehen ungleich aus (Doc, 07.09.2026). */
                const inhLabel = document.createElement('span');
                inhLabel.className = 'sub-tab sub-tab-mat';
                inhLabel.textContent = 'Inhalt';
                subHeadL.appendChild(inhLabel);
                subLeft.appendChild(ref.ul);
            } else {
                const tabs = document.createElement('div');
                tabs.className = 'sub-tabs';
                subHeadL.appendChild(tabs);
                const panes = {};
                const showPane = function (name) {
                    for (const k in panes) {
                        panes[k].btn.classList.toggle('on', k === name);
                        panes[k].pane.hidden = k !== name;
                    }
                    /* the mark strip belongs to the bullets, not to the notes */
                    tabs.classList.toggle('on-notizen', name === 'notizen');
                };
                [['inhalt', 'Inhalt'], ['notizen', 'Notizen']].forEach(function (t, k) {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'sub-tab' + (k ? '' : ' on');
                    b.textContent = t[1];
                    b.addEventListener('mousedown', P.keinMausfokus);
                    b.addEventListener('click', function (ev) { ev.stopPropagation(); showPane(t[0]); });
                    tabs.appendChild(b);
                    const pane = document.createElement('div');
                    pane.className = 'sub-pane';
                    pane.dataset.pane = t[0];
                    pane.hidden = !!k;
                    subLeft.appendChild(pane);
                    panes[t[0]] = { btn: b, pane: pane };
                });
                panes.inhalt.pane.appendChild(ref.ul);
                /* Styles right of the tabs, visible only while editing
                   (Doc, 06.09.2026: "damit ich Sachen hervorheben kann"). */
                tabs.appendChild(P.buildMarkTools(ref));
                const notesEl = document.createElement('div');
                notesEl.className = 'notes-body';
                notesEl.dataset.ph = 'Notizen …';
                P.setNotesText(notesEl, P.noteOf(i));
                /* Doc, 07.09.2026: "wenn es Notizen gibt, schreib Notizen in Gruen" -
                   so sieht man einer zugeklappten Woche an, dass dort etwas steht. */
                ref.markNotes = function () {
                    panes.notizen.btn.classList.toggle('has-notes',
                        P.notesTextOf(notesEl).length > 0);
                };
                ref.markNotes();
                /* Doc, 03.09.2026: "die Anforderung nur in Bearbeiten ist
                   hinfaellig" - the field is live as soon as he is logged in,
                   saving itself like the notes page does. The Bearbeiten mode
                   stays what it always was: for the plan itself. */
                notesEl.setAttribute('contenteditable', 'true');
                let noteTimer = null;
                const stashNote = function () {
                    const t = P.notesTextOf(notesEl);
                    if (t) P.planNotes[i] = t; else delete P.planNotes[i];
                    P.persistNotes();
                    P.pushNotes();
                };
                notesEl.addEventListener('input', function () {
                    ref.markNotes();
                    clearTimeout(noteTimer);
                    noteTimer = setTimeout(stashNote, 700);
                });
                notesEl.addEventListener('blur', function () {
                    clearTimeout(noteTimer);
                    stashNote();
                });
                /* typing must not fold the week away under the cursor */
                notesEl.addEventListener('keydown', function (ev) { ev.stopPropagation(); });
                panes.notizen.pane.appendChild(notesEl);
                ref.notesEl = notesEl;
                ref.showPane = showPane;
            }
            /* Rechte Haelfte der Kopfzeile: zwei echte Reiter wie links (Doc,
               08.09.2026: "neben Zusatzm noch Videos als tab wie links").
               Anders als links haengen sie NICHT an der Anmeldung - das Material
               ist oeffentlich, die Klasse soll die Filme sehen. "Videos" wird in
               updateMaterial ein- und ausgeblendet: hat die Woche keinen Film,
               steht dort nur "Zusatzmaterial" und es sieht aus wie vorher. */
            const rTabs = document.createElement('div');
            rTabs.className = 'sub-tabs';
            subHeadR.appendChild(rTabs);
            subSide = document.createElement('div');
            subSide.className = 'sub-side';
            rPanes = {};
            const showR = function (name) {
                for (const k in rPanes) {
                    rPanes[k].btn.classList.toggle('on', k === name);
                    rPanes[k].pane.hidden = k !== name;
                }
                P.equalizeMatPills();
            };
            /* Doc, 20.09.2026: "bring SVP Aufgaben da als Tab" - die Aufgaben
               der Woche stehen als dritter Reiter neben Zusatzmaterial und
               Videos. Er fuellt sich aus derselben Quelle wie die Pille in der
               Wochenzeile (Wochenquiz + Aufgabenblaetter) und ist wie Videos
               gesperrt, solange die Woche keine hat. */
            [['zusatz', 'Zusatzmaterial'], ['videos', 'Videos'],
             ['aufgaben', 'Aufgaben']].forEach(function (t, k) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'sub-tab' + (k ? '' : ' on');
                b.textContent = t[1];
                const count = document.createElement('span');   /* filled by setVideoReiter */
                count.className = 'sub-count';
                b.appendChild(count);
                b.addEventListener('mousedown', P.keinMausfokus);
                b.addEventListener('click', function (ev) { ev.stopPropagation(); showR(t[0]); });
                rTabs.appendChild(b);
                const pane = document.createElement('div');
                pane.className = 'sub-pane';
                pane.dataset.pane = t[0];
                pane.hidden = !!k;
                subSide.appendChild(pane);
                rPanes[t[0]] = { btn: b, pane: pane, count: count };
            });
            /* Stift am rechten Ende derselben Zeile (Doc, 09.09.2026: "gib mir
               da bitte einen Stift zum bearbeiten dieser Woche"). Er schaltet
               dasselbe Bearbeiten ein wie der Knopf in der Werkzeugleiste,
               klappt aber NUR diese Woche auf statt alle - genau das macht ihn
               hier oben nuetzlich. Nur fuer Angemeldete; ein Besucher sieht
               dieselbe Kopfzeile wie bisher. */
            if (P.CAN_EDIT_MAT) {
                const stift = document.createElement('button');
                stift.type = 'button';
                stift.className = 'sub-edit';
                stift.textContent = '\u270e';
                stift.title = 'Diese Woche bearbeiten';
                stift.setAttribute('aria-label', 'Diese Woche bearbeiten');
                stift.addEventListener('mousedown', P.keinMausfokus);
                stift.addEventListener('click', function (ev) {
                    ev.stopPropagation();   /* sonst klappt der Zeilenklick zu */
                    P.editWeek(ref);
                });
                subHeadR.appendChild(stift);
                /* Solange DIESE Woche bearbeitet wird, steht an derselben Stelle
                   das Paar Speichern/Abbrechen (Doc, 09.09.2026: "wenn editmode
                   mach da zwei kleine SPEICHERN ABBRECHEN"). Das ist der Weg
                   heraus, ohne dass der Blick in die Werkzeugleiste wandert. */
                const fertig = document.createElement('div');
                fertig.className = 'sub-done';
                /* Links im selben Kasten: die Materialwerkzeuge dieser Woche.
                   Sie erscheinen und verschwinden mit Speichern/Abbrechen, es
                   gibt also nur eine Sichtbarkeitsregel fuer beides. */
                ref.matTools = document.createElement('div');
                ref.matTools.className = 'sub-mat-tools';
                fertig.appendChild(ref.matTools);
                /* Der Untis-Chip kann schon da sein - decorateUntis laeuft nach
                   einem fetch und weiss nicht, wann eine Woche aufgeklappt
                   wird. Dann wandert er hier an seinen Platz. */
                if (ref.untisChip) ref.matTools.appendChild(ref.untisChip);
                const mach = function (klasse, text, titel, fn) {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.className = klasse;
                    b.textContent = text;
                    b.title = titel;
                    b.addEventListener('mousedown', P.keinMausfokus);
                    b.addEventListener('click', function (ev) {
                        ev.stopPropagation();
                        fn();
                    });
                    fertig.appendChild(b);
                };
                mach('sub-done-btn sub-save', 'Speichern', 'Änderungen dieser Woche speichern',
                    function () { window.togglePlanEdit(null); });
                mach('sub-done-btn sub-cancel', 'Abbrechen', 'Bearbeiten beenden und Änderungen verwerfen',
                    function () { P.cancelEdits(); });
                subHeadR.appendChild(fertig);
                /* Die Knoepfe selbst baut decorateMatCell - beim ersten Lauf
                   gab es die Leiste noch nicht, also hier nachziehen. */
                P.decorateMatCell(ref);
            }
            ref.showRechts = showR;
            ref.rPanes = rPanes;
            const src0 = ref.matTd ? (ref.matTd.dataset.src || '') : '';
            const alle0 = P.parseMat(src0);
            P.setVideoReiter(ref, alle0.filter(P.isVideoEntry).length,
                alle0.filter(en => !P.isExerciseEntry(en) && !P.isVideoEntry(en)).length || (P.matTail(src0) ? 1 : 0),
                /* fuellt den Aufgaben-Reiter und liefert die Zahl dahinter -
                   die Aufklappzeile kann auch spaeter entstehen (Notiz,
                   Bearbeiten), dann lief updateMaterial laengst. */
                P.fillAufgabenPane(ref, src0, alle0.filter(P.isExerciseEntry)));
            subBody.appendChild(subSide);
            subMain.appendChild(subBody);
            detailTr.appendChild(subMain);
            tr.after(detailTr);
            /* built late (edit mode, first note) inside a folded holiday block */
            if (tr.classList.contains('ferien-folded')) detailTr.classList.add('ferien-folded');
            tr.classList.add('expandable');
            chev = document.createElement('span');
            chev.className = 'chev';
            chev.textContent = '▸';
            /* While editing the row click is dead (the cells are contenteditable),
               so the chevron itself has to open the sub-row - otherwise a week
               that was closed when Doc hit "Bearbeiten" can never take a note. */
            chev.addEventListener('click', function (ev) {
                if (!tr.classList.contains('wk-edit')) return;
                ev.stopPropagation();
                toggleSubRow();
            });
            /* Doc, 07.09.2026: "mach die Chevis ganz nach vorn" - der Pfeil steht
               jetzt vor der Wochennummer, nicht mehr vor dem Thema. */
            tds[0].insertBefore(chev, tds[0].firstChild);
            if (ref.talk) P.paintTalk(ref);
            return { main: subMain, side: subSide, panes: rPanes };
        }
        function toggleSubRow() {
            if (!detailTr) return;
            tr.classList.toggle('open');
            detailTr.classList.toggle('open');
            P.equalizeRefPills(ref);
            syncOpenWeeks();
        }
        /* The chevron promises content. An empty sub-row only exists because
           edit mode builds one for every week, so hide the promise again as
           soon as editing ends and nothing was written. */
        ref.refreshExpandable = function () {
            if (!detailTr) return;
            const has = ref.ul.querySelectorAll('li').length > 0
                || (ref.notesEl && P.notesTextOf(ref.notesEl).length > 0)
                || !!subSide.querySelector('.mat-pill, a, button');
            /* logged in every week stays openable - that is the only way to
               reach the Notizen of a week that has no bullets */
            const show = has || P.notesAllowed() || tr.classList.contains('wk-edit');
            tr.classList.toggle('expandable', show);
            if (chev) chev.hidden = !show;
            if (!show) { tr.classList.remove('open'); detailTr.classList.remove('open'); }
        };
        ref.ensureSubRow = ensureSubRow;
        ref.openSubRow = function () {
            if (!detailTr) return;
            tr.classList.add('open');
            detailTr.classList.add('open');
            P.equalizeRefPills(ref);
            syncOpenWeeks();
        };

        tr.addEventListener('click', () => {
            /* Nur die Woche im Bearbeiten laesst den Zeilenklick liegen (ihre
               Zellen sind contenteditable, ein Klick setzt den Cursor). Alle
               anderen Wochen bleiben auf- und zuklappbar - beim Stift ist das
               der Normalfall, denn die Seite bleibt sonst, wie sie war. */
            if (tr.classList.contains('wk-edit')) return;
            if (!detailTr || !tr.classList.contains('expandable')) return;
            toggleSubRow();
        });

        const detailItems = ov.details || row.details;
        if ((detailItems && detailItems.length) || P.notesAllowed()) {
            ensureSubRow();
            P.buildDetailList(ref.ul, detailItems || []);
        }

        ref.quizBtn = P.buildQuizBtn(P.quizSource(ov, row));
        ref.matBlock = document.createElement('div');
        ref.matBlock.className = 'mat-block';
        ref.vidBlock = document.createElement('div');
        ref.vidBlock.className = 'mat-block';
        P.updateMaterial(ref, ov.material != null ? ov.material : row.material);
        P.wireMaterialDrop(ref);
        if (initialOpen.has(i)) ref.openSubRow(); /* restore remembered state */
        P.rendered.push(ref);
    });
    applyFerienFolds();   /* restore the remembered holiday folds */
    P.loadTalks();

    /* Alle Bereich-Pillen gleich breit. Ohne das misst jede Zeile ihre eigene
       Breite aus - "LB 1" schmal, "LEISTUNG" breit - und die Spalte springt.
       Mass ist die breiteste Zelle: schmaler ginge nur, indem man den laengsten
       Text abschneidet. Erst nach dem Laden von Orbitron messen, vorher steht
       dort die Ersatzschrift mit anderen Breiten. */
    function equalizeLbCells() {
        const cells = Object.keys(P.lbCells).map(k => P.lbCells[k]);
        if (!cells.length) return;
        /* Doc, 07.09.2026: "alle Pillen so breit wie ORGA" - Bereichspille und
           Untis-Chip bekommen dieselbe Breite. Gemessen statt fest verdrahtet,
           denn Orbitron laedt spaeter als das erste Layout und veraendert sie. */
        const pills = [];
        cells.forEach(c => { c.style.width = ''; for (const k of c.children) pills.push(k); });
        if (!pills.length) return;
        pills.forEach(p => { p.style.width = ''; });
        let w = 0;
        pills.forEach(p => { w = Math.max(w, p.getBoundingClientRect().width); });
        if (w) pills.forEach(p => { p.style.width = w + 'px'; });
    }

    function equalizeAll() {
        equalizeLbCells();
        P.equalizeMatPills();
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(equalizeAll);
    } else {
        equalizeAll();
    }
    /* Auf Resize auch die Materialpillen neu messen: sie stehen in einer
       schmaleren Spalte als die Bereichspillen und schneiden ihren Text ab,
       sobald der Platz nicht reicht - dann ist das alte Mass falsch. */
    window.addEventListener('resize', equalizeAll);
});
