// Stoffverteilungsplan renderer, part "shift": moving the content by a week ("Verschieben").
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        contentOf, setShiftMode, runShift, structurallyDiffers
    });

    // --- Verschieben: move the plan's contents by whole weeks --------------
    // Klassenfahrt, Praktikum, Ausfall: the calendar stays where it is — KW,
    // Datum and the date-bound remarks belong to the week, not to the subject
    // matter. Only the content travels. Whatever is pushed past the last week
    // is appended as extra weeks; that stuff lands in the next school year,
    // and saying so out loud beats dropping it silently.

    /* Remarks are a mixed bag: some describe the calendar ("Mi 18.11. Buß- und
       Bettag", "nur Mo/Di", "Fr 09.07. letzter Schultag"), others the content
       ("LB 2 abgeschlossen", "Termin nach Klausurplan"). Calendar ones stay on
       their week, the rest travels with the topic. Split first: a remark that
       carries both halves ("nur Mi–Fr; Termin nach Klausurplan") is classified
       per part, otherwise the calendar half would pin the content half down and
       shifting back would not restore the original. */
    const CAL_REMARK = /\d{1,2}\.\d{1,2}\.|ferien|unterrichtsfrei|feiertag|zeugnis|schultag|^nur\s/i;
    const NEXT_YEAR = '→ nächstes Schuljahr';

    function effVal(i, key) {
        const ov = P.saved[i] || {}, row = P.planRows[i] || {};
        return ov[key] != null ? ov[key] : row[key];
    }
    function isFerienRow(i) { return !!effVal(i, 'ferien'); }

    function weekSlots() {
        const out = [];
        for (let i = 0; i < P.planRows.length; i++) if (!isFerienRow(i)) out.push(i);
        return out;
    }

    function splitRemark(text) {
        const teile = String(text || '').split(/\s*[·;]\s*/).map(function (t) { return t.trim(); });
        const bleibt = [], wandert = [];
        teile.forEach(function (t) { if (t) (CAL_REMARK.test(t) ? bleibt : wandert).push(t); });
        return { bleibt: bleibt.join(' · '), wandert: wandert.join(' · ') };
    }

    function contentOf(i) {
        const ov = P.saved[i] || {}, row = P.planRows[i] || {};
        return {
            type: effVal(i, 'type') || 'org',
            u: effVal(i, 'u') || '',
            topic: effVal(i, 'topic') || '',
            remark: effVal(i, 'remark') || '',
            details: (ov.details || row.details || []).slice(),
            notes: P.noteOf(i),
            material: (ov.material != null ? ov.material : row.material) || '',
            /* The exercise set belongs to the topic, not to the calendar week:
               without this a shifted plan showed the tasks of the week before
               (Doc, 01.09.2026 - Mathe 11 stood one week off). */
            quiz: Object.prototype.hasOwnProperty.call(ov, 'quiz') ? ov.quiz : (row.quiz || null),
            /* MAP-only fields (Modulablaufplan): not shown in the table, but
               they describe the content, so they travel with it */
            ziel: effVal(i, 'ziel'),
            mth: effVal(i, 'mth'),
            med: effVal(i, 'med'),
            lnw: effVal(i, 'lnw')
        };
    }
    /* A freed week is really empty: every field is cleared, nothing of the
       old content stays visible and nothing can creep back from the page's
       PLAN (a missing key would mean "not overridden"). */
    function emptyContent() {
        return {
            type: 'org', u: '', topic: '', remark: '', details: [], notes: '', material: '',
            quiz: null,
            ziel: '', mth: '', med: '', lnw: ''
        };
    }
    /* A remark that only says "free" is not content - it is how an empty week
       describes itself, and it must not block the up arrow that pulls a later
       week onto this slot. Every part has to be such a word: "Schuljahresbeginn
       Mo 17.08. · frei" carries a real date and stays occupied, and a topic like
       "verlustfrei vs. verlustbehaftet" only contains "frei" as a syllable. */
    const FREE_REMARK = /^(?:frei|schulfrei|unterrichtsfrei|ferien|ferientag)$/i;
    function remarkIsFree(text) {
        const parts = String(text || '').split(/\s*[·;]\s*/)
            .map(function (t) { return t.trim(); })
            .filter(Boolean);
        return parts.every(function (t) { return FREE_REMARK.test(t); });
    }

    function isEmptyContent(c) {
        if (!c) return true;
        return !(c.details || []).length && !c.notes && !c.material && !c.u && remarkIsFree(c.remark) &&
            (!c.topic || c.topic === '—' || c.topic === '-');
    }

    // Fired by the dialog. Either way the *selected* week is the one that
    // moves: delta > 0 pushes it (and everything after it) to a later week and
    // frees its slot, delta < 0 pulls it back onto the free week(s) in front of
    // it. Returns null on success, else a reason to show in the dialog.
    function applyShift(fromIndex, delta) {
        const slots = weekSlots();
        const pos = slots.indexOf(fromIndex);
        if (pos < 0 || !delta) return 'Woche nicht gefunden.';

        const teile = slots.map(function (i) { return splitRemark(contentOf(i).remark); });
        const stay = teile.map(function (t) { return t.bleibt; });
        const moving = slots.map(function (i, k) {
            const c = contentOf(i);
            c.remark = teile[k].wandert;
            return c;
        });

        let next;
        if (delta > 0) {
            next = moving.slice(0, pos);
            for (let d = 0; d < delta; d++) next.push(emptyContent());
            next = next.concat(moving.slice(pos));
        } else {
            /* Pulling up swallows the weeks in front of the cursor — only
               allowed when they are empty, otherwise a topic would quietly
               disappear. */
            const raus = -delta;
            if (pos - raus < 0) return 'Davor liegen nicht genug Wochen.';
            for (let d = 1; d <= raus; d++) {
                if (!isEmptyContent(moving[pos - d])) {
                    return 'Die Woche davor ist nicht leer — dorthin l\u00e4sst sich nichts hochziehen.';
                }
            }
            next = moving.slice(0, pos - raus).concat(moving.slice(pos));
            while (next.length < moving.length) next.push(emptyContent());
        }

        /* Content ran past the last week: grow the table. Those rows exist only
           in the edits object, planRows covers them on the next load. */
        let angehaengt = 0;
        while (next.length > slots.length) {
            const idx = P.planRows.length;
            P.planRows.push({ nr: 0, kw: '', date: NEXT_YEAR, type: 'org', u: '', topic: '', remark: '', details: [] });
            slots.push(idx);
            angehaengt++;
        }

        let nr = 0;
        const nextNotes = {};
        slots.forEach(function (i, k) {
            const c = next[k] || emptyContent();
            const remark = [stay[k] || '', c.remark || ''].filter(Boolean).join(' · ');
            const entry = {
                nr: ++nr,
                kw: effVal(i, 'kw') != null ? effVal(i, 'kw') : '',
                date: effVal(i, 'date') != null ? effVal(i, 'date') : '',
                type: c.type,
                u: c.u,
                topic: c.topic,
                remark: remark,
                details: c.details
            };
            nextNotes[i] = c.notes || '';
            entry.material = c.material || '';
            entry.quiz = c.quiz || null;   /* null = this week has no exercises */
            /* always written, even empty — see emptyContent() */
            ['ziel', 'mth', 'med', 'lnw'].forEach(function (k) {
                entry[k] = c[k] != null ? c[k] : '';
            });
            P.saved[i] = entry;
        });

        /* Undo case: trailing extra weeks that ended up empty go away again. */
        for (let i = P.planRows.length - 1; i >= window.PLAN.length; i--) {
            if (isEmptyContent(P.saved[i])) delete P.saved[i]; else break;
        }

        P.planNotes = {};
        for (const k in nextNotes) if (nextNotes[k]) P.planNotes[k] = nextNotes[k];
        P.persistNotes();
        if (P.notesAllowed()) P.pushNotes();
        localStorage.setItem(P.KEY, JSON.stringify(P.saved));
        localStorage.setItem(P.TS_KEY, new Date().toISOString());
        P.skipUnloadSave = true; /* the reload must not resurrect the old table */
        const done = function () { location.reload(); };
        const p = P.pushRemote();
        if (p && p.then) p.then(done, done); else done();
        return null;
    }

    /* Is the week before this one free? Only then may a week be pulled up. */
    function freeSlotBefore(i) {
        const slots = weekSlots();
        const pos = slots.indexOf(i);
        return pos > 0 && isEmptyContent(contentOf(slots[pos - 1]));
    }

    let shiftMode = false;

    /* The arrows live in an extra leading column. It is part of the table all
       the time (simpler than rebuilding rows), so switching the mode only
       toggles visibility — plus the colSpans of the rows that span everything:
       holiday rows and the spacer of the detail rows. */
    function setShiftMode(on) {
        shiftMode = !!on;
        /* Shifting with a running filter would be a trap: "the week above" is
           not the row above on screen while half the plan is hidden. */
        if (shiftMode) P.planSearchClear();
        document.body.classList.toggle('shifting', shiftMode);
        document.querySelectorAll('#plan-table tr.ferien > td')
            .forEach(function (td) { td.colSpan = shiftMode ? 8 : 7; });
        document.querySelectorAll('#plan-table tr.detail-row > td:first-child')
            .forEach(function (td) { td.colSpan = shiftMode ? 8 : 7; });
        P.rendered.forEach(function (r) {
            if (r.upBtn) r.upBtn.hidden = !(shiftMode && freeSlotBefore(r.i));
        });
        if (shiftBtn) shiftBtn.classList.toggle('on', shiftMode);
        if (!shiftMode) setShiftMsg('');
    }

    let shiftMsgEl = null;
    function setShiftMsg(text) {
        if (!shiftMsgEl) return;
        shiftMsgEl.textContent = text || '';
        shiftMsgEl.hidden = !text;
    }

    function runShift(i, delta) {
        const grund = applyShift(i, delta);
        if (grund) setShiftMsg(grund); /* applyShift reloads on success */
    }

    /* Same deal as the reset button: only reachable in edit mode, and built
       here so the plan pages themselves stay untouched. */
    let shiftBtn = null;
    (function () {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        shiftBtn = document.createElement('button');
        shiftBtn.type = 'button';
        shiftBtn.className = 'action plan-shift';
        /* tiny stacked ▲▼ instead of an arrow glyph — same symbols as the
           column, so the button shows what it switches on */
        shiftBtn.innerHTML = '<span class="shift-ico"><i>▲</i><i>▼</i></span>Verschieben';
        shiftBtn.title = 'Wochen verschieben: Pfeile vor der Nr.';
        shiftBtn.addEventListener('click', function () { setShiftMode(!shiftMode); });
        shiftMsgEl = document.createElement('span');
        shiftMsgEl.className = 'shift-msg';
        shiftMsgEl.hidden = true;
        const reset = bar.querySelector('button.plan-reset');
        if (reset) { bar.insertBefore(shiftBtn, reset); bar.insertBefore(shiftMsgEl, reset); }
        else { bar.appendChild(shiftBtn); bar.appendChild(shiftMsgEl); }
    })();

    function structurallyDiffers(map) {
        for (const k in map) if (Number(k) >= P.planRows.length) return true;
        for (const r of P.rendered) {
            if (r.ferienTd) continue;
            const ov = map[r.i] || {};
            if (ov.type && ov.type !== r.type) return true;
            if (ov.nr != null && String(ov.nr) !== String(r.nr)) return true;
        }
        return false;
    }
});
