// Stoffverteilungsplan renderer, part "keys": all weeks open/closed, ?kw= jump, current week, keyboard.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        setAllDetails, isoWeek, gotoWeek, weekOf
    });

    function setAllDetails(open) {
        document.querySelectorAll('tr.detail-row').forEach(r => {
            r.classList.toggle('open', open);
            r.previousElementSibling.classList.toggle('open', open);
        });
        P.syncOpenWeeks();
    }

    /* Aus dem Stundenplan kommend: ?kw=36 klappt diese Woche auf, scrollt sie
       in die Mitte und laesst sie kurz aufleuchten (Doc, 01.09.2026 - Klick auf
       eine Stunde soll beim richtigen Stoff landen, nicht am Seitenanfang). */
    /* Welche Woche traegt eine Zeile? In der Gruppen-Ansicht die des Termins
       dieser Gruppe (gkw, von paintTerminDates gesetzt), sonst die des Plans. */
    function weekOf(r) { return String(r.gkw != null ? r.gkw : r.kw); }

    /* Zu einer Woche springen: Ferien aufklappen, die Woche oeffnen, in die
       Mitte scrollen, kurz aufleuchten lassen. ?kw= geht so, und seit dem
       20.09.2026 auch ein Klick im Neuigkeiten-Band (svp-plan-news.js) -
       deshalb steht es als eigene Funktion und nicht mehr im URL-Sprung. */
    function gotoWeek(kw) {
        const want = String(Number(kw));
        const hit = P.rendered.find(r => weekOf(r) === want);
        /* ref traegt kein tr - die Zeile haengt an der Datumszelle. */
        const tr = hit && hit.dateTd && hit.dateTd.closest('tr');
        if (!tr) return false;
        P.unfoldFerienFor(tr);
        if (hit.openSubRow) hit.openSubRow();
        tr.scrollIntoView({ block: 'center', behavior: 'smooth' });
        tr.classList.add('kw-jump');
        setTimeout(() => tr.classList.remove('kw-jump'), 2600);
        return true;
    }

    /* Beide Marken laufen noch einmal, sobald die Termine der Gruppe stehen -
       paintTerminDates ruft sie. */
    P.runKwJump = () => false;
    P.runNowMark = () => false;

    (function jumpToWeekFromUrl() {
        let kw = null;
        try { kw = new URLSearchParams(location.search).get('kw'); } catch (e) { return; }
        if (!kw) return;
        let done = false;
        const go = () => {
            if (done) return true;
            done = gotoWeek(kw);
            return done;
        };
        P.runKwJump = go;
        /* Die Zeilen entstehen erst beim Rendern - einmal jetzt, sonst nachfassen.
           In der Gruppen-Ansicht zaehlt die Woche des TERMINS, und die steht erst,
           wenn die Untis-Daten da sind (paintTerminDates ruft dann nach). Kommen
           sie nicht - abgemeldet, offline -, springt der Plan nach 1,5 s eben
           nach seiner eigenen Woche. */
        if (P.GROUP) setTimeout(go, 1500);
        else if (!go()) setTimeout(go, 400);
    })();

    /* Die laufende Kalenderwoche bleibt dauerhaft markiert (Doc, 08.09.2026).
       Innerhalb eines Schuljahres kommt jede KW genau einmal vor, ein Vergleich
       der Nummer genuegt also. In den Ferien trifft nichts zu - die Ferienzeilen
       tragen keine kw, dann bleibt der Plan eben unmarkiert. Zentral hier, damit
       alle Plaene es bekommen. */
    function isoWeek(d) {
        const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));   /* Donnerstag dieser Woche */
        const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
        return Math.ceil(((t - jan1) / 86400000 + 1) / 7);
    }

    (function markCurrentWeek() {
        const now = String(isoWeek(new Date()));
        const go = () => {
            /* Eine frueher gesetzte Marke muss weg: nach dem Umstellen auf die
               Termine der Gruppe sitzt sie in einer anderen Zeile. */
            for (const el of document.querySelectorAll('tr.kw-now, tr.kw-now-sub')) {
                el.classList.remove('kw-now', 'kw-now-sub');
                if (/^(laufende Kalenderwoche|n\u00e4chster Termin)/.test(el.title || '')) el.removeAttribute('title');
            }
            /* ALLE Zeilen der Woche, nicht nur die erste (Doc, 21.09.2026:
               "bei doppelt immer beide gelb"): wo ein Fach zwei Doppelstunden
               in der Woche hat, stehen zwei Planzeilen mit derselben KW
               untereinander - vorher leuchtete davon nur die obere. Fuer die
               Termine der Gruppen-Ansicht gilt dasselbe schon seit dem
               20.09.2026 (markNextTermin in svp-plan-untis.js). */
            let getroffen = false;
            for (const hit of P.rendered.filter(r => weekOf(r) === now)) {
                const tr = hit.dateTd && hit.dateTd.closest('tr');
                if (!tr) continue;
                tr.classList.add('kw-now');
                tr.title = 'laufende Kalenderwoche';
                const sub = tr.nextElementSibling;
                if (sub && sub.classList.contains('detail-row')) sub.classList.add('kw-now-sub');
                getroffen = true;
            }
            return getroffen;
        };
        P.runNowMark = go;
        if (!go()) setTimeout(() => { go(); P.markPastWeeks(); }, 400);
        P.markPastWeeks();
    })();

    // Toolbar helper: expand/collapse all detail rows at once.
    /* The label says what a click does (syncToggleAllLabel): one open week is
       enough for "Wochen zu" - so one open week also means closing, not opening
       the rest (it did the opposite of its label until 18.09.2026). */
    window.togglePlanDetails = function () {
        const rows = Array.from(document.querySelectorAll('tr.detail-row'));
        setAllDetails(!rows.some(r => r.classList.contains('open')));
    };
    /* Doc, 18.09.2026: "gib mir auf W Wochen auf/zu" - the key does what the
       toolbar button does; not while typing in a field or an edited cell */
    /* Doc, 19.09.2026: "Key F alle" - F folds or unfolds all holiday blocks.
       Both keys are listed in the "?" panel of the nav row (svp-nav.js). */
    /* Doc, 19.09.2026: "gute Ideen: go" - J jumps to the current week (H is
       the help menu: "? H zeigen das Menü"), the arrows walk the visible rows
       with a cursor and Enter opens what it marks, E toggles the edit mode. */
    const editBtn = () => document.querySelector('.toolbar button[onclick*="togglePlanEdit"]');
    const canEdit = function () {
        const btn = editBtn();
        return !!(btn && btn.offsetParent !== null && window.svpAuth && svpAuth.hasSession());
    };
    window.svpKeys = (window.svpKeys || []).concat([
        [['W'], 'Alle Wochen auf- oder zuklappen'],
        [['F'], 'Alle Ferienblöcke ein- oder ausklappen'],
        [['J'], 'Zur aktuellen Woche springen (jetzt)'],
        [['↑', '↓'], 'Zeile für Zeile durch den Plan gehen'],
        [['Enter'], 'Mit ↑ ↓ markierte Zeile öffnen/schließen'],
        [['E'], 'Bearbeiten ein- oder ausschalten', canEdit],
        [['L'], 'Lernbereiche und Lehrplan ein- oder ausblenden', () => !!window.toggleLehrplan]
    ]);

    /* The cursor of the arrow keys: week rows and the holiday rows that fold,
       as far as they are showing (folds and a running search hide rows). */
    let kbRow = null;
    function kbRows() {
        return [...document.querySelectorAll(
            '#plan-table thead tr.ferien.foldable, #plan-table tbody tr:not(.detail-row)')]
            .filter(tr => tr.offsetParent !== null
                && (!tr.classList.contains('ferien') || tr.classList.contains('foldable')));
    }
    function kbMark(tr) {
        if (kbRow) kbRow.classList.remove('kb-cursor');
        kbRow = tr;
        if (tr) tr.classList.add('kb-cursor');
    }
    /* Keep the cursor clear of the sticky head: scrollIntoView knows nothing
       about it and would park the row underneath. */
    function kbReveal(tr) {
        const box = tr.getBoundingClientRect();
        let top = 0;
        for (const el of document.querySelectorAll('.plan-sticky, #plan-table thead th:not(.shift-col)')) {
            if (el.offsetParent !== null || el.classList.contains('plan-sticky')) {
                top = Math.max(top, el.getBoundingClientRect().bottom);
            }
        }
        top = Math.min(top, window.innerHeight / 2);   /* not stuck: the head is far down the page */
        if (box.top < top + 6) window.scrollBy(0, box.top - top - 6);
        else if (box.bottom > window.innerHeight - 6) window.scrollBy(0, box.bottom - window.innerHeight + 6);
    }
    function kbStep(dir) {
        const rows = kbRows();
        if (!rows.length) return;
        let at = rows.indexOf(kbRow);
        if (at === -1) {
            /* first press: start at the current week, else at the top */
            const now = rows.find(tr => tr.classList.contains('kw-now'));
            at = now ? rows.indexOf(now) : 0;
        } else {
            at = Math.max(0, Math.min(rows.length - 1, at + dir));
        }
        kbMark(rows[at]);
        kbReveal(rows[at]);
    }
    function jumpToNow() {
        const weeks = [...document.querySelectorAll('#plan-table tbody tr:not(.detail-row):not(.ferien)')];
        /* in the holidays no week is marked - then the next one to come */
        const tr = weeks.find(w => w.classList.contains('kw-now'))
            || weeks.find(w => !w.classList.contains('kw-past'));
        if (!tr) return;
        P.unfoldFerienFor(tr);
        if (tr.offsetParent === null) return;   /* filtered out by a running search */
        kbMark(tr);
        tr.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }

    document.addEventListener('keydown', function (e) {
        if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
        const t = e.target;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        const key = (e.key || '').toLowerCase();
        if (key === 'arrowdown' || key === 'arrowup') {
            e.preventDefault();               /* repeats welcome: hold the key to run */
            kbStep(key === 'arrowdown' ? 1 : -1);
            return;
        }
        if (e.repeat) return;
        if (key === 'w') window.togglePlanDetails();
        else if (key === 'f') window.toggleFerienFolds();
        else if (key === 'j') jumpToNow();
        else if (key === 'escape') { kbMark(null); return; }
        else if (key === 'enter') {
            /* a focused button or link keeps its Enter */
            if (!kbRow || kbRow.offsetParent === null || (t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName))) return;
            kbRow.click();
        }
        else if (key === 'e') { if (!canEdit()) return; editBtn().click(); }
        else if (key === 'l') { if (!window.toggleLehrplan) return; window.toggleLehrplan(); }
        else return;
        e.preventDefault();
    });

    /* Beim Laden koennen Wochen aus dem letzten Besuch offen sein - dann muss
       der Knopf gleich "Wochen zu" heissen, ohne dass jemand geklickt hat. */
    P.syncToggleAllLabel();
});
