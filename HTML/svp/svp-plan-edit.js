// Stoffverteilungsplan renderer, part "edit": edit mode: gate, save, cancel, reset.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        saveEdits, withEditGate, editWeek, cancelEdits
    });

    // Cells that may contain $...$ math (detail lis queried live — edit mode
    // can add new ones via Enter inside the contenteditable ul).
    function mathCellsOf(r) {
        const out = [];
        if (r.topicSpan) out.push(r.topicSpan);
        if (r.remarkTd) out.push(r.remarkTd);
        if (r.ul) r.ul.querySelectorAll('li').forEach(function (li) { out.push(li); });
        return out;
    }
    function eachMathCandidate(fn) {
        for (const r of P.rendered) mathCellsOf(r).forEach(fn);
    }

    /* `nur` = genau diese Woche bearbeiten (der Stift in der Aufklappzeile),
       ohne Angabe die ganze Seite (der Knopf in der Werkzeugleiste). Was eine
       Woche bearbeitbar macht, haengt an ihrer Klasse wk-edit - contenteditable
       hier, und im CSS das ✕ an den Pillen, +/⧉/⇩, der Untis-Chip und die
       Auszeichnungs-Leiste. body.editing bleibt fuer die Werkzeugleiste. */
    function setEditable(on, nur) {
        for (const r of P.rendered) {
            const an = on && (!nur || r === nur);
            const flag = an ? 'true' : 'false';
            /* Every week gets a sub-row while editing, so a note can be written
               anywhere - refreshExpandable takes the empty ones back afterwards. */
            if (an && !r.ferienTd && r.ensureSubRow) r.ensureSubRow();
            /* An empty bullet list has nothing to type into; give it one blank
               line to start from (empty lines are dropped again on save). */
            if (an && r.ul && !r.ul.querySelector('li')) r.ul.appendChild(document.createElement('li'));
            // Material is deliberately NOT edited as raw text here: the pills
            // in the sub-row have their own ✕ while editing, and new links go
            // through the + dialog. A long SharePoint URL in this cell used to
            // blow the table far past the window.
            /* Das Datum bleibt aussen vor (Doc, 09.09.2026: "ausser Datum, das
               kann man mal generell raus nehmen") - es kommt aus dem Schuljahr
               und wird ueber "Verschieben" bewegt, nicht von Hand getippt. Ein
               vertipptes Datum haette lautlos die ganze Wochenfolge verbogen. */
            for (const el of [r.ferienText, r.uTd, r.topicSpan, r.remarkTd, r.ul]) {
                if (el) el.setAttribute('contenteditable', flag);
            }
            /* Eine frueher gesetzte Markierung muss wieder weg, sonst bliebe das
               Datum in einem Browser editierbar, der die Seite schon offen hat. */
            if (r.dateTd) r.dateTd.removeAttribute('contenteditable');
            if (r.markEdit) r.markEdit(an);
        }
        if (!on) for (const r of P.rendered) {
            /* drop the blank starter bullets again, else an untouched week keeps
               an empty list item - and would still look like it had content */
            if (r.ul) r.ul.querySelectorAll('li').forEach(function (li) {
                if (!li.textContent.trim()) li.remove();
            });
            if (r.refreshExpandable) r.refreshExpandable();
        }
        // While editing show the raw $...$ source; on exit re-render from the
        // (possibly edited) text. saveEdits runs before this, so it saves raw.
        // Marks stay real elements in both directions - they are what Doc
        // clicks the little tool strip for, so he must see them while typing.
        /* Den rohen $...$-Text zeigt nur die Woche, die wirklich bearbeitet
           wird - der Rest der Seite bleibt gesetzt. WICHTIG: eine Zeile, die
           schon gesetzt ist, darf NICHT erneut durch setMathText(srcOf(el))
           laufen. srcOf() liest den DOM, und in einer gesetzten Zelle steht
           KaTeX: die unsichtbare MathML-Fassung, der \u0024-Quelltext in
           <annotation> und die sichtbare Formel. Aus "$x^2$" wuerde dabei
           "x2x^2x2". Deshalb merkt sich jede Zeile ihren Zustand und wird nur
           beim WECHSEL angefasst. */
        for (const r of P.rendered) {
            const roh = on && (!nur || r === nur);
            if (!!r.rohModus === roh) continue;
            r.rohModus = roh;
            /* Die Zellen werden hier frisch gesucht: im Bearbeiten koennen
               neue Stichpunkte entstanden sein, die auch zurueckverwandelt
               werden muessen. */
            mathCellsOf(r).forEach(function (el) {
                if (roh) {
                    if (el.dataset.src != null) P.paintSrc(el, el.dataset.src, true);
                } else {
                    P.setMathText(el, P.srcOf(el));
                }
            });
        }
        /* Entering edit mode gives every week a sub-row, leaving it re-renders
           the text - both change what a running search would find. */
        P.planSearchRun();
    }

    /* Quelltext einer Zelle. Steht die Zeile im Bearbeiten, ist das, was da
       steht, der Quelltext. Sonst haelt ihn dataset.src - aus einer gesetzten
       Zelle wuerde srcOf() die KaTeX-Innereien lesen und "$x^2$" als "x2x^2x2"
       speichern. Genau das ist am 09.09.2026 passiert, als der Stift nur noch
       eine Woche bearbeitete: alle anderen Zeilen blieben gesetzt. */
    function quelleVon(r, el) {
        if (r.rohModus) return P.srcOf(el);
        return el.dataset.src != null ? el.dataset.src : P.srcOf(el);
    }

    function saveEdits() {
        const out = {};
        for (const r of P.rendered) {
            if (r.ferienTd) {
                out[r.i] = { ferien: r.ferienText.textContent.trim() };
            } else {
                const entry = {
                    nr: r.nr,
                    kw: r.kw,
                    type: r.type,
                    date: r.dateTd.dataset.src != null
                        ? r.dateTd.dataset.src : r.dateTd.textContent.trim(),
                    u: r.uTd.textContent.trim(),
                    topic: quelleVon(r, r.topicSpan).trim(),
                    remark: quelleVon(r, r.remarkTd).trim()
                };
                /* Material and Bullets are always written, even when empty:
                   a missing key means "not overridden", and the renderer would
                   fall back to the page's PLAN — so an emptied week would get
                   the original row's bullets back (that is what hid the ▲). */
                entry.material = r.matTd ? (r.matTd.dataset.src || '').trim() : '';
                /* same for the MAP-only fields: no form owns them, so carry
                   over whatever a shift last put there */
                const vorher = P.saved[r.i] || {};
                ['ziel', 'mth', 'med', 'lnw'].forEach(function (k) {
                    if (vorher[k] != null) entry[k] = vorher[k];
                });
                entry.details = r.ul
                    ? Array.from(r.ul.querySelectorAll('li'))
                        .map(li => quelleVon(r, li).trim())
                        .filter(t => P.markPlain(t).trim().length)
                    : [];  /* no sub-row rendered = no bullets on screen */
                /* Notizen deliberately NOT in `entry` - see NOTES_KEY above. */
                out[r.i] = entry;
            }
        }
        localStorage.setItem(P.KEY, JSON.stringify(out));
        localStorage.setItem(P.TS_KEY, new Date().toISOString());
        P.pushRemote();
        if (P.notesAllowed()) {
            for (const r of P.rendered) {
                if (!r.notesEl) continue;
                const t = P.notesTextOf(r.notesEl);
                if (t) P.planNotes[r.i] = t; else delete P.planNotes[r.i];
            }
            P.persistNotes();
            P.pushNotes();
        }
    }

    // --- Edit gate: "✎ Bearbeiten" asks for a passphrase once per browser. ---
    // Doc and Liliana each have their own; the accepted hashes AND the dialog
    // live in svp-gate.js (one place, loaded in <head> on every plan page) —
    // this file only calls it. Two copies of the hash had drifted apart before.
    function editUnlocked() {
        return !!(window.svpGate && window.svpGate.unlocked());
    }

    function askEditPwd(onOk) {
        if (window.svpGate) window.svpGate.ask(onOk);
    }

    // Run fn immediately if unlocked, otherwise after a successful password.
    function withEditGate(fn) {
        if (window.svpGate) window.svpGate.run(fn);
    }

    /* After a login from the edit button the page reloads (material tools and cloud
       save are wired at load time) and continues straight into edit mode. */
    const EDIT_AFTER_LOGIN = 'svp-edit-after-login';

    /* Der Stift einer Woche schaltet dasselbe Bearbeiten ein wie der Knopf in
       der Werkzeugleiste - dessen Beschriftung muss also mitwandern, auch wenn
       er den Klick nicht bekommen hat. */
    function planEditButton() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return null;
        return [...bar.querySelectorAll('button')]
            .find(function (b) { return /Bearbeiten|Speichern/.test(b.textContent); }) || null;
    }

    /* opts.woche: nur diese Woche aufklappen statt aller - der Weg des Stifts. */
    window.togglePlanEdit = function (btn, opts) {
        opts = opts || {};
        if (!document.body.classList.contains('editing') && window.svpAuth && !svpAuth.hasSession()) {
            svpAuth.loginDialog(function () {
                try { sessionStorage.setItem(EDIT_AFTER_LOGIN, '1'); } catch (e) { }
                location.reload();
            });
            return;
        }
        if (!document.body.classList.contains('editing') && !editUnlocked()) {
            askEditPwd(() => window.togglePlanEdit(btn, opts));
            return;
        }
        const editing = document.body.classList.toggle('editing');
        /* saveEdits has to run before setEditable(false) - that one re-renders
           the math from the raw text. Opening all weeks runs *after*
           setEditable(true), which is where the missing sub-rows are built. */
        if (!editing) saveEdits();
        setEditable(editing, editing ? opts.woche : null);
        /* Alle Wochen aufzuklappen ist der Weg des Werkzeugleisten-Knopfes; der
           Stift meint genau eine Woche und laesst den Rest, wie er ist. */
        if (editing && opts.woche) opts.woche.openSubRow();
        else if (editing) P.setAllDetails(true);
        if (!editing) P.setShiftMode(false); /* the arrows belong to edit mode */
        /* Der Untis-Chip zeigt sich nur im Bearbeiten (Doc, 07.09.2026) - er
           taucht also gerade erst auf oder verschwindet, und die gemeinsame
           Pillenbreite muss neu gemessen werden. */
        P.equalizeLbCells();
        if (!btn) btn = planEditButton();
        /* Doc, 09.09.2026: "stift raus", dann auch der Haken - der Knopf traegt
           nur noch Text: "Bearbeiten" bzw. "Speichern". */
        if (btn) btn.textContent = editing ? 'Speichern' : 'Bearbeiten';
        if (cancelBtn) cancelBtn.hidden = !editing;
    };

    /* Stift an einer Woche: ins Bearbeiten, diese Woche auf, Cursor ins Thema -
       von dort erreicht die Tabulatortaste den Rest der Zeile. Steht die Seite
       schon im Bearbeiten, bleibt nur das Aufklappen und der Sprung dorthin. */
    function editWeek(ref) {
        if (document.body.classList.contains('editing')) {
            /* Schon im Bearbeiten: die Marke wandert zur angeklickten Woche.
               Getipptes geht dabei nicht verloren - es steht im DOM, und
               saveEdits liest beim Speichern ohnehin ALLE Zeilen. */
            setEditable(true, ref);
            ref.openSubRow();
        } else {
            window.togglePlanEdit(null, { woche: ref });
        }
        if (!document.body.classList.contains('editing')) return;   /* Anmeldung/Passwort abgebrochen */
        const ziel = ref.topicSpan;
        if (!ziel) return;
        ziel.focus();
        const sel = window.getSelection && window.getSelection();
        if (sel && document.createRange) {
            const rg = document.createRange();
            rg.selectNodeContents(ziel);
            rg.collapse(false);          /* Cursor ans Ende, nichts markiert */
            sel.removeAllRanges();
            sel.addRange(rg);
        }
    }

    /* "Abbrechen": leave edit mode WITHOUT saving. Nothing was written yet —
       saveEdits only runs on "Speichern" — so a reload restores the last saved
       state. The unload guard has to stay quiet, otherwise the safety net would
       persist exactly the changes we are throwing away. */
    let cancelBtn = null;
    /* Bearbeiten verlassen, OHNE zu speichern - geschrieben wurde noch nichts
       (saveEdits laeuft nur beim Speichern), ein Neuladen holt also den zuletzt
       gesicherten Stand zurueck. Das Netz beim Schliessen muss dabei still
       bleiben, sonst schriebe es genau das weg, was wir verwerfen. */
    function cancelEdits() {
        P.skipUnloadSave = true;
        location.reload();
    }
    (function () {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const editBtn = [...bar.querySelectorAll('button')]
            .find(function (b) { return /Bearbeiten/.test(b.textContent); });
        cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'action secondary plan-cancel';
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.title = 'Bearbeiten beenden und Änderungen verwerfen';
        cancelBtn.hidden = true;
        cancelBtn.addEventListener('click', cancelEdits);
        if (editBtn) bar.insertBefore(cancelBtn, editBtn.nextSibling);
        else bar.appendChild(cancelBtn);
        /* came back from the login dialog → continue into edit mode */
        let resume = false;
        try { resume = sessionStorage.getItem(EDIT_AFTER_LOGIN) === '1'; sessionStorage.removeItem(EDIT_AFTER_LOGIN); } catch (e) { }
        if (resume && editBtn && window.svpAuth && svpAuth.hasSession()) window.togglePlanEdit(editBtn);
    })();

    // Two-click confirm (no native dialogs): first click arms the button, second click resets.
    // Reset throws away every edit of this page — dates, topics, remarks,
    // bullets, Notizen AND the material links, locally and (when logged in) in the
    // cloud, without any way back. So: only reachable in edit mode, and
    // guarded by two dialogs, the second one asking to type the word out.
    function doReset() {
        P.skipUnloadSave = true; /* mute the beforeunload safety net, see below */
        localStorage.removeItem(P.KEY);
        localStorage.removeItem(P.TS_KEY);
        localStorage.removeItem(P.NOTES_KEY);
        localStorage.removeItem(P.NOTES_TS_KEY);
        P.planNotes = {};
        const done = () => location.reload();
        if (window.svpAuth && svpAuth.hasSession()) {
            const page = encodeURIComponent(location.pathname);
            Promise.all([
                svpAuth.api('svp_plan_edits?page=eq.' + page, { method: 'DELETE' }).catch(() => {}),
                svpAuth.api('svp_plan_notes?page=eq.' + page, { method: 'DELETE' }).catch(() => {})
            ]).then(done, done);
        } else done();
    }

    // What exactly is at stake? Counted from the stored edits object.
    function resetScope() {
        let wochen = 0, links = 0, felder = 0;
        for (const k in P.saved) {
            const e = P.saved[k] || {};
            const keys = Object.keys(e);
            if (!keys.length) continue;
            wochen++;
            felder += keys.length;
            links += ((e.material || '').match(/https?:\/\//g) || []).length;
        }
        /* Notizen sit in their own store, so they need their own count -
           without it the dialog would understate what the reset takes. */
        let notizen = 0;
        for (const k in P.planNotes) if (P.planNotes[k]) notizen++;
        return { wochen, links, felder, notizen };
    }

    // Shared shell for both warning dialogs (same look as the material modal).
    function dangerDialog(titel, bauInhalt) {
        P.closeMatModal();
        const wrap = document.createElement('div');
        wrap.className = 'mat-modal-wrap';
        const box = document.createElement('div');
        box.className = 'mat-modal mm-danger';
        const h = document.createElement('div');
        h.className = 'mm-title mm-warn';
        h.textContent = titel;
        box.appendChild(h);
        bauInhalt(box, function close() { P.closeMatModal(); });
        wrap.addEventListener('click', e => { if (e.target === wrap) P.closeMatModal(); });
        wrap.addEventListener('keydown', e => { if (e.key === 'Escape') P.closeMatModal(); });
        wrap.appendChild(box);
        document.body.appendChild(wrap);
        P.matModal = wrap;
        return box;
    }

    function resetSchritt2() {
        const WORT = 'LÖSCHEN';
        dangerDialog('⚠ Letzte Warnung', function (box) {
            const info = document.createElement('div');
            info.className = 'mm-info';
            info.innerHTML = 'Das lässt sich <b>nicht</b> rückgängig machen — es gibt keine ältere Version.' +
                (window.svpAuth && svpAuth.hasSession()
                    ? '<br>Du bist angemeldet: die Löschung wirkt auch auf deinen anderen Geräten.'
                    : '<br>Du bist abgemeldet: gelöscht wird nur dieser Browser.');
            box.appendChild(info);

            const frage = document.createElement('div');
            frage.className = 'mm-info';
            frage.innerHTML = 'Tippe <b>' + WORT + '</b>, um es wirklich zu tun.';
            box.appendChild(frage);

            const eingabe = document.createElement('input');
            eingabe.type = 'text';
            eingabe.setAttribute('aria-label', 'Zum Bestätigen ' + WORT + ' eintippen');
            eingabe.placeholder = WORT;
            box.appendChild(eingabe);

            const btns = document.createElement('div');
            btns.className = 'mm-btns';
            const ab = document.createElement('button');
            ab.type = 'button';
            ab.className = 'mm-btn';
            ab.textContent = 'Abbrechen';
            ab.addEventListener('click', P.closeMatModal);
            const ok = document.createElement('button');
            ok.type = 'button';
            ok.className = 'mm-btn danger';
            ok.textContent = 'Endgültig löschen';
            ok.disabled = true;
            const pruefe = () => { ok.disabled = eingabe.value.trim().toUpperCase() !== WORT; };
            eingabe.addEventListener('input', pruefe);
            eingabe.addEventListener('keydown', e => { if (e.key === 'Enter' && !ok.disabled) doReset(); });
            ok.addEventListener('click', doReset);
            btns.appendChild(ab);
            btns.appendChild(ok);
            box.appendChild(btns);
            setTimeout(() => eingabe.focus(), 0);
        });
    }

    window.resetPlanEdits = function () {
        const s = resetScope();
        dangerDialog('⚠ Alle Änderungen dieser Seite verwerfen?', function (box) {
            const info = document.createElement('div');
            info.className = 'mm-info';
            info.innerHTML = s.wochen
                ? 'Betroffen: <b>' + s.wochen + (s.wochen === 1 ? ' geänderte Woche' : ' geänderte Wochen') +
                  '</b> mit ' + s.felder + ' bearbeiteten Feldern' +
                  (s.links ? ' und <b>' + s.links + (s.links === 1 ? ' Material-Link' : ' Material-Links') + '</b>' : '') +
                  (s.notizen ? ' sowie <b>' + s.notizen + (s.notizen === 1 ? ' Notiz' : ' Notizen') + '</b>' : '') +
                  '.<br>Danach steht der Plan wieder auf dem einprogrammierten Stand.'
                : 'Auf dieser Seite ist nichts gespeichert — es gibt nichts zu verwerfen.';
            box.appendChild(info);

            const btns = document.createElement('div');
            btns.className = 'mm-btns';
            const ab = document.createElement('button');
            ab.type = 'button';
            ab.className = 'mm-btn';
            ab.textContent = 'Abbrechen';
            ab.addEventListener('click', P.closeMatModal);
            btns.appendChild(ab);
            if (s.wochen) {
                const weiter = document.createElement('button');
                weiter.type = 'button';
                weiter.className = 'mm-btn danger';
                weiter.textContent = 'Weiter …';
                weiter.addEventListener('click', resetSchritt2);
                btns.appendChild(weiter);
            }
            box.appendChild(btns);
        });
    };

    /* The button lives in each page's toolbar; tagging it here keeps the
       pages untouched. CSS shows it only while editing. */
    document.querySelectorAll('button[onclick*="resetPlanEdits"]')
        .forEach(b => b.classList.add('plan-reset'));
});
