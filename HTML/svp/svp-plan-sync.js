// Stoffverteilungsplan renderer, part "sync": cloud sync of edits and notes.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        cloudErr, setCloud, pushRemote, pushNotes, fetchPublicEdits
    });

    // Safety net: persist pending edits when the tab closes mid-edit.
    // Skipped while resetting/shifting: those reload out of edit mode, and
    // saving there would write the old table straight back (locally and to the
    // cloud) — which is what made "Zurücksetzen" a no-op.
    window.addEventListener('beforeunload', () => {
        if (P.skipUnloadSave) return;
        if (document.body.classList.contains('editing')) P.saveEdits();
    });

    // --- Supabase sync (table svp_plan_edits, RLS owner-only) ------------
    // Reuses the svp-session login from notes.html (shared svp-auth.js).
    // Logged out: local-only, exactly as before. Logged in: whole edits
    // object is synced per page, last write wins by timestamp (TS_KEY).
    const TS_KEY = P.TS_KEY = 'svp-edits-ts:' + location.pathname;
    const cloudEl = document.createElement(window.svpAuth && svpAuth.hasSession() ? 'span' : 'a');
    cloudEl.className = 'cloud';
    (function () {
        if (cloudEl.tagName === 'A') {
            cloudEl.href = '../notes.html';
            cloudEl.textContent = '☁ lokal';
            cloudEl.title = 'Edits nur in diesem Browser — für Cloud-Sync über die Notizen-Seite anmelden';
        }
        // Deliberately NOT placed in the quick-nav any more (Doc, 23.08.2026):
        // the status pill said little that the Login/Logout pill does not
        // already tell. The element stays alive so setCloud() keeps working —
        // appending it somewhere is all it takes to bring the display back.
    })();

    /* A failed cloud read or write used to be invisible - the status pill is no
       longer placed in the page, so an expired session swallowed edits without
       a word (Doc, 31.08.2026). Errors now raise a small banner; success stays
       as quiet as before. */
    function showCloudError(text) {
        let box = document.getElementById('svp-cloud-err');
        if (!text) { if (box) box.remove(); return; }
        if (!box) {
            box = document.createElement('div');
            box.id = 'svp-cloud-err';
            document.body.appendChild(box);
        }
        box.textContent = '';
        const msg = document.createElement('span');
        msg.textContent = text + ' — ';
        const link = document.createElement('a');
        /* notes.html sits in the svp root, the plan pages one level below it */
        const root = location.pathname.lastIndexOf('/svp/');
        link.href = root >= 0 ? location.pathname.slice(0, root + 5) + 'notes.html' : 'notes.html';
        link.textContent = 'neu anmelden';
        box.appendChild(msg);
        box.appendChild(link);
    }

    /* Ein 403 auf svp_plan_edits heisst IMMER: die Zeile dieser Seite gehoert
       einem anderen Konto. Der Primaerschluessel ist die Seite allein, es gibt
       also je Plan genau einen Besitzer - Doc hat alle ausser mathe5, die
       gehoert der Kollegin. Ohne Kontonamen ist die Meldung ein Raetsel
       (Doc, 01.09.2026). */
    function cloudErr(status) {
        if (status !== 403) return '☁ Fehler: HTTP ' + status;
        const who = window.svpAuth && svpAuth.whoami ? svpAuth.whoami() : '';
        return '☁ Fehler: HTTP 403 — diese Seite gehört einem anderen Konto' +
            (who ? ' (angemeldet als ' + who + ')' : '');
    }

    function setCloud(text, ok) {
        showCloudError(ok ? '' : text);
        if (cloudEl.tagName === 'A') return; /* logged out: keep the login hint */
        cloudEl.textContent = text;
        cloudEl.classList.toggle('on', !!ok);
    }

    // Re-applies an edits object to the already rendered table (remote wins).
    function applyEdits(map) {
        P.heileMathe(map);
        /* Badges, numbers and the row count are baked into the DOM at render
           time, so a structurally different state — someone shifted the plan on
           another device — needs a real reload, not a text update. */
        if (P.structurallyDiffers(map)) { P.skipUnloadSave = true; location.reload(); return; }
        for (const r of P.rendered) {
            const ov = map[r.i] || {};
            const row = P.planRows[r.i] || {};
            if (r.ferienTd) {
                r.ferienText.textContent = ov.ferien || row.ferien;
                continue;
            }
            P.setDateText(r.dateTd, ov.date != null ? ov.date : row.date);
            r.uTd.textContent = ov.u != null ? ov.u : row.u;
            P.setMathText(r.topicSpan, ov.topic != null ? ov.topic : row.topic);
            P.setMathText(r.remarkTd, ov.remark != null ? ov.remark : row.remark);
            if (r.matTd) {
                /* rebuilt first: updateMaterial re-appends whatever pill r holds,
                   and the cloud state may carry a different one than the render */
                r.quizBtn = P.buildQuizBtn(P.quizSource(ov, row));
                P.updateMaterial(r, ov.material != null ? ov.material : row.material);
            }
            if (r.ul) P.buildDetailList(r.ul, ov.details || row.details || []);
            if (r.refreshExpandable) r.refreshExpandable();
        }
        /* setDateText hat die Wochenspalte neu gesetzt - in der Gruppen-Ansicht
           gehoert der Termin der Gruppe wieder darueber. */
        P.paintTerminDates(null);
        /* The rows carry new text now - a running search has to judge them again. */
        P.planSearchRun();
    }

    function pushRemote() {
        /* Frueher ein stilles return - Doc speicherte mit abgelaufener Session,
           nichts ging in die Cloud, und niemand hat es ihm gesagt (01.09.2026:
           die Kids sahen den alten Cloud-Stand, er seinen neuen lokalen). */
        if (!window.svpAuth || !svpAuth.hasSession()) {
            setCloud('☁ NICHT in der Cloud gespeichert — bitte neu anmelden!', false);
            return null;
        }
        const ts = localStorage.getItem(TS_KEY) || new Date().toISOString();
        return svpAuth.api('svp_plan_edits', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify([{
                page: location.pathname,
                edits: JSON.parse(localStorage.getItem(P.KEY) || '{}'),
                ts: ts
            }])
        }).then(res => setCloud(res.ok ? '☁ synchron' : cloudErr(res.status), res.ok))
            .catch(e => setCloud('☁ ' + e.message, false));
    }

    /* --- Notizen sync (own table svp_plan_notes, RLS owner-only) ---------
       Deliberately a second table: svp_plan_edits has to stay anon-readable so
       every visitor sees the current plan, and a note must not ride along in
       it. One row per plan page, the notes as a { weekIndex: text } object.
       As long as the table does not exist the notes simply stay local - the
       feature degrades, nothing breaks and nothing leaks. */
    const NOTES_TS_KEY = P.NOTES_TS_KEY = 'svp-plan-notes-ts:' + location.pathname;
    let notesTableMissing = false;

    function pushNotes() {
        if (!P.notesAllowed() || notesTableMissing) return null;
        const ts = new Date().toISOString();
        localStorage.setItem(NOTES_TS_KEY, ts);
        return svpAuth.api('svp_plan_notes', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify([{ page: location.pathname, notes: P.planNotes, ts: ts }])
        }).then(function (res) {
            if (res.status === 404) { notesTableMissing = true; return; }
            if (!res.ok) setCloud('☁ Notizen nicht gespeichert — HTTP ' + res.status, false);
        }).catch(function () { /* offline: the local copy stays */ });
    }

    async function pullNotes() {
        if (!P.notesAllowed()) return;
        try {
            const res = await svpAuth.api('svp_plan_notes?page=eq.' +
                encodeURIComponent(location.pathname) + '&select=notes,ts');
            if (res.status === 404) { notesTableMissing = true; return; }
            if (!res.ok) return;
            const rows = await res.json();
            const localTs = Date.parse(localStorage.getItem(NOTES_TS_KEY) || '') || 0;
            if (!rows.length) { if (Object.keys(P.planNotes).length) pushNotes(); return; }
            const remoteTs = Date.parse(rows[0].ts) || 0;
            if (remoteTs <= localTs) { if (localTs > remoteTs) pushNotes(); return; }
            P.planNotes = rows[0].notes || {};
            P.persistNotes();
            localStorage.setItem(NOTES_TS_KEY, rows[0].ts);
            applyNotes();
        } catch (e) { /* offline: the local copy stays */ }
    }

    /* Paint the current planNotes into the table (after a cloud pull). */
    function applyNotes() {
        for (const r of P.rendered) {
            const t = P.noteOf(r.i);
            if (!r.notesEl && t && r.ensureSubRow) r.ensureSubRow();
            if (r.notesEl) P.setNotesText(r.notesEl, t);
            if (r.markNotes) r.markNotes();
            if (r.refreshExpandable) r.refreshExpandable();
        }
    }

    /* Read-only fetch without login: plan edits are public to READ
       (RLS: select for anon), writing still needs the owner session.
       So every visitor sees the current plan state. */
    async function fetchPublicEdits(page) {
        const res = await fetch(svpAuth.DB_URL + '/rest/v1/svp_plan_edits?page=eq.' +
            encodeURIComponent(page) + '&select=edits,ts', {
            headers: { apikey: svpAuth.DB_KEY, Authorization: 'Bearer ' + svpAuth.DB_KEY }
        });
        if (!res.ok) return null;
        const rows = await res.json();
        return rows.length ? rows[0] : null;
    }

    async function syncFromRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        try {
            const res = await svpAuth.api(
                'svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname) + '&select=edits,ts');
            if (!res.ok) { setCloud(cloudErr(res.status), false); return; }
            const rows = await res.json();
            const localTs = Date.parse(localStorage.getItem(TS_KEY) || '') || 0;
            if (!rows.length) {
                /* nothing in the cloud yet — seed it from local edits if any */
                if (localStorage.getItem(P.KEY)) pushRemote();
                else setCloud('☁ synchron', true);
                return;
            }
            const remoteTs = Date.parse(rows[0].ts) || 0;
            if (remoteTs > localTs) {
                P.saved = rows[0].edits || {};
                localStorage.setItem(P.KEY, JSON.stringify(P.saved));
                localStorage.setItem(TS_KEY, rows[0].ts);
                applyEdits(P.saved);
                setCloud('☁ synchron', true);
            } else if (localTs > remoteTs) {
                /* Bevor der Automatik-Push die Cloud ueberschreibt: hat der
                   lokale Stand ueberhaupt so viel Substanz wie die Cloud?
                   Ein Browser mit altem Inhalt aber neuerem Zeitstempel haette
                   heute (01.09.2026) beim naechsten Laden alle Material-Links
                   der Cloud plattgemacht. Weniger Zeilen oder weniger Links
                   -> nicht pushen, laut sagen, Doc entscheidet (?cloud holt
                   die Cloud, bewusstes Speichern pusht weiter normal). */
                const weigh = o => {
                    let rows = 0, links = 0;
                    for (const k in (o || {})) {
                        rows++;
                        const m = (o[k] && o[k].material) || '';
                        links += (String(m).match(/https?:\/\//g) || []).length;
                    }
                    return { rows, links };
                };
                const L = weigh(P.saved), R = weigh(rows[0].edits);
                if (L.rows < R.rows || L.links < R.links) {
                    setCloud('☁ Konflikt: lokal weniger Inhalt als die Cloud (' +
                        L.links + ' statt ' + R.links + ' Links) — NICHT überschrieben. ' +
                        '„?cloud" an der URL holt die Cloud.', false);
                } else {
                    pushRemote(); /* offline edits from this browser win */
                }
            } else {
                setCloud('☁ synchron', true);
            }
        } catch (e) { setCloud('☁ ' + e.message, false); }
    }

    /* The published state is read anonymously in EVERY case, logged in or not:
       a stale session used to make the authenticated read fail with 401 and the
       page then showed the bare HTML - no edits, no shifts, no material
       (Doc, 31.08.2026). The authenticated sync runs afterwards and wins. */
    if (window.svpAuth) {
        (async function () {
            /* ?cloud = Rettungsanker: verwirft den lokalen Stand DIESER Seite,
               damit die Cloud wieder reinkommt. Noetig, wenn ein Browser einen
               alten Stand mit NEUEREM Zeitstempel festhaelt - dann laesst die
               ts-Regel die Cloud nie mehr rein, und ein Speichern wuerde sie
               sogar ueberschreiben (Doc, 01.09.2026: die Kids sahen alle
               Materialien, Doc selbst nicht). Der Parameter raeumt nur auf und
               nimmt sich selbst aus der URL, damit ein Bookmark nicht bei
               jedem Laden loescht. */
            try {
                if (new URLSearchParams(location.search).has('cloud')) {
                    localStorage.removeItem(P.KEY);
                    localStorage.removeItem(TS_KEY);
                    const u = new URL(location.href);
                    u.searchParams.delete('cloud');
                    history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
                }
            } catch (e) { }
            try {
                const row = await fetchPublicEdits(location.pathname);
                if (row) {
                    const localTs = Date.parse(localStorage.getItem(TS_KEY) || '') || 0;
                    if ((Date.parse(row.ts) || 0) > localTs) {
                        P.saved = row.edits || {};
                        localStorage.setItem(P.KEY, JSON.stringify(P.saved));
                        localStorage.setItem(TS_KEY, row.ts);
                        applyEdits(P.saved);
                    }
                }
            } catch (e) { /* offline: local state stays */ }
            if (svpAuth.hasSession()) { syncFromRemote(); pullNotes(); }
        })();
    }
});
