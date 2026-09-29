// Stoffverteilungsplan renderer, part "sync": cloud sync of edits and notes.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        cloudErr, setCloud, pushRemote, pushNotes, pushFahrplan, fetchPublicEdits, einarbeiten
    });

    /* Doc, 27.09.2026: "Das darf nie passieren. Dann stehe ich am Montag im Unterricht und alles ist weg." - a plan tab
       open since the morning (its P.saved and table from then) saved at 15:15 over a pill added at 13:24: every save
       wrote the whole row, the last write won. Now:
       - BASE_KEY holds the cloud row the local edits were built on ({ ts, daten }, ts exactly as the database gave it);
         a save only lands on that row (svpAuth.sicherSpeichern: PATCH ts=eq.<base>), else it is merged week by week
         and field by field (planMerge) and written on the new row - pills of both sides always stay.
       - PENDING_KEY marks local edits not in the cloud yet (a failed save, a tab closed mid-write): the next load
         merges them in instead of dropping them or pushing them blindly.
       - P.domBasis is what the table on screen was drawn from: saving the table (saveEdits) takes only what was
         changed on screen since then onto the newest state (einarbeiten), so an old table cannot bring back old weeks.
       The database keeps every former row besides (svp_plan_edits_history). */
    const BASE_KEY = 'svp-edits-basis:' + location.pathname, PENDING_KEY = 'svp-edits-offen:' + location.pathname;
    const klon = o => JSON.parse(JSON.stringify(o || {}));
    /* The base belongs to THIS tab: two tabs on one computer share localStorage, and a base another tab stored would
       let this tab's old table through again. localStorage only carries it over a reload (open edits). */
    let tabBasis = null;
    function basis() {
        if (tabBasis) return tabBasis;
        try { return JSON.parse(localStorage.getItem(BASE_KEY) || 'null'); } catch (e) { return null; }
    }
    function basisSetzen(ts, daten) {
        tabBasis = { ts: ts, daten: klon(daten) };
        try { localStorage.setItem(BASE_KEY, JSON.stringify(tabBasis)); } catch (e) { }
    }
    function lokal() { try { return JSON.parse(localStorage.getItem(P.KEY) || '{}') || {}; } catch (e) { return {}; } }
    P.domBasis = klon(P.saved);

    /* A shift moves the content of the weeks to other rows (svp-plan-shift.js: topic, material, bullets, type travel;
       number, week and date stay with the row): then a week index no longer means the same content on both sides.
       Seen as: a holiday row or a number/week that differs, a row past the page's PLAN that came or went, or at
       least two topics that moved together by the same number of rows. */
    function strukturGeaendert(a, b) {
        a = a || {}; b = b || {};
        const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
        for (const k of keys) {
            const x = a[k], y = b[k];
            if (!x || !y) { if (Number(k) >= window.PLAN.length) return true; continue; }
            if ((x.ferien != null) !== (y.ferien != null)) return true;
            for (const f of ['nr', 'kw']) if (x[f] != null && y[f] != null && String(x[f]) !== String(y[f])) return true;
        }
        const thema = (o, k) => { const w = o[k]; const t = w && w.topic != null ? String(w.topic).trim() : ''; return t && t !== '—' && t !== '-' ? t : ''; };
        for (const d of [-3, -2, -1, 1, 2, 3]) {
            let gewandert = 0;
            for (const k of keys) {
                const i = Number(k), t = thema(a, k);
                if (!Number.isInteger(i) || !t || t === thema(b, k)) continue;
                if (t === thema(b, String(i - d))) gewandert++;
            }
            if (gewandert >= 2) return true;
        }
        return false;
    }
    /* Material: pill by pill (by its link) - added on either side: in; deleted on one side and untouched on the other:
       out; changed on one side: that one. Without a base both sides' pills are kept. */
    function materialMerge(b, l, c) {
        if (!P.parseMat || !P.matToSrc) return b === null ? (c || l) : l;
        const bl = b === null ? null : P.parseMat(b || ''), ll = P.parseMat(l || ''), cl = P.parseMat(c || '');
        if (!ll.length && !cl.length) return b === null ? (c || l) : l;          /* free text, no links */
        const bei = (liste, u) => liste && liste.find(e => e.url === u), g = svpAuth.gleich, out = [];
        ll.forEach(e => {
            const ce = bei(cl, e.url), be = bei(bl, e.url);
            if (ce) out.push(be && g(e, be) ? ce : e);
            else if (!be || !g(e, be)) out.push(e);                              /* added here, or changed here */
        });
        cl.forEach(e => {
            if (bei(ll, e.url)) return;
            const be = bei(bl, e.url);
            if (!be || !g(e, be)) out.push(e);                                   /* added there, or changed there */
        });
        const rest = P.matTail ? P.matTail(l || '') : '';
        return (P.matToSrc(out) + (rest ? ' ' + rest : '')).trim();
    }
    /* base (null: unknown), this tab, the cloud -> { daten, konflikte } or { stop } */
    function planMerge(base, lok, cloud) {
        const g = svpAuth.gleich;
        lok = lok || {}; cloud = cloud || {};
        if (base) {
            const sL = strukturGeaendert(base, lok), sC = strukturGeaendert(base, cloud);
            if (((sL && !g(cloud, base)) || (sC && !g(lok, base))) && !(sL && sC && g(lok, cloud))) {
                return { stop: 'der Plan wurde verschoben, und zugleich hat sich auf einem anderen Gerät etwas geändert' };
            }
        } else if (strukturGeaendert(lok, cloud)) {
            return { stop: 'dieser Browser kennt den Plan anders verschoben als die Cloud' };
        }
        const bekannt = !!base, out = {}, konflikte = [];
        for (const k of new Set([...Object.keys(lok), ...Object.keys(cloud), ...Object.keys(base || {})])) {
            const b = bekannt ? base[k] : null, l = lok[k], c = cloud[k];
            if (g(l, c)) { if (l !== undefined) out[k] = l; continue; }
            if (bekannt && g(l, b)) { if (c !== undefined) out[k] = c; continue; }
            if (bekannt && g(c, b)) { if (l !== undefined) out[k] = l; continue; }
            if (!l || !c || l.ferien != null || c.ferien != null) {
                const w = bekannt ? (l !== undefined ? l : c) : (c !== undefined ? c : l);
                if (w !== undefined) out[k] = w;
                konflikte.push({ woche: k, feld: '' });
                continue;
            }
            const w = {};
            for (const f of new Set([...Object.keys(l), ...Object.keys(c), ...Object.keys(b || {})])) {
                const bf = bekannt ? (b ? b[f] : undefined) : null, lf = l[f], cf = c[f];
                if (g(lf, cf)) { if (lf !== undefined) w[f] = lf; continue; }
                if (bekannt && g(lf, bf)) { if (cf !== undefined) w[f] = cf; continue; }
                if (bekannt && g(cf, bf)) { if (lf !== undefined) w[f] = lf; continue; }
                if (f === 'material') { w[f] = materialMerge(bekannt ? (bf || '') : null, lf, cf); continue; }   /* nothing lost */
                const sieger = bekannt ? (lf !== undefined ? lf : cf) : (cf !== undefined ? cf : lf);
                if (sieger !== undefined) w[f] = sieger;
                konflikte.push({ woche: k, feld: f });
            }
            out[k] = w;
        }
        return { daten: out, konflikte: konflikte };
    }
    /* saveEdits: what was changed on screen (against the table as drawn) onto the newest state of this tab */
    function einarbeiten(ausTabelle) {
        if (svpAuth.gleich(P.domBasis, P.saved)) return ausTabelle;
        const m = planMerge(P.domBasis, ausTabelle, P.saved);
        return m.stop ? ausTabelle : m.daten;
    }
    /* "Woche 7 Thema" - the week as the plan counts it */
    function stelle(k) {
        const r = (P.saved && P.saved[k]) || (P.planRows && P.planRows[k]) || {};
        return (r.nr != null ? 'Woche ' + r.nr : 'Zeile ' + (Number(k) + 1)) + (r.kw != null ? ' (KW ' + r.kw + ')' : '');
    }
    const FELD = { topic: 'Thema', remark: 'Bemerkung', details: 'Stichpunkte', date: 'Datum', u: 'Stunden', material: 'Material', ferien: 'Ferien' };

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
        /* 409: the database refused the save - this tab builds on an older state than the cloud (trigger
           svp_plan_*_basis, 27.09.2026). Nothing is lost: the change stays in this browser and comes in after a reload. */
        if (status === 409) return '☁ Nicht gespeichert: diese Seite ist nicht mehr aktuell — bitte neu laden, deine Änderung bleibt hier gesichert';
        if (status !== 403) return '☁ Fehler: HTTP ' + status;
        const who = window.svpAuth && svpAuth.whoami ? svpAuth.whoami() : '';
        return '☁ Fehler: HTTP 403 — diese Seite gehört einem anderen Konto' +
            (who ? ' (angemeldet als ' + who + ')' : '');
    }

    /* A merge is news, not an error: a green note bottom right (the error banner's place and look, the palette's
       green), a tap closes it; with a conflict it stays until then. */
    function hinweis(text, bleibt) {
        let box = document.getElementById('svp-cloud-hinweis');
        if (!text) { if (box) box.remove(); return; }
        if (!box) {
            box = document.createElement('div');
            box.id = 'svp-cloud-hinweis';
            box.title = 'Tippen: schließen';
            box.addEventListener('click', () => box.remove());
            document.body.appendChild(box);
        }
        box.textContent = text;
        clearTimeout(box._uhr);
        if (!bleibt) box._uhr = setTimeout(() => box.remove(), 9000);
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
        P.domBasis = klon(map);
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

    /* One save at a time: a second one waits for the first, else both would build on the same base. */
    let schreibt = Promise.resolve();
    function pushRemote() {
        /* Frueher ein stilles return - Doc speicherte mit abgelaufener Session,
           nichts ging in die Cloud, und niemand hat es ihm gesagt (01.09.2026:
           die Kids sahen den alten Cloud-Stand, er seinen neuen lokalen). */
        localStorage.setItem(PENDING_KEY, '1');
        if (!window.svpAuth || !svpAuth.hasSession()) {
            setCloud('☁ NICHT in der Cloud gespeichert — bitte neu anmelden!', false);
            return null;
        }
        const lauf = schreibt.then(speichernJetzt, speichernJetzt);
        schreibt = lauf;
        return lauf;
    }
    async function speichernJetzt() {
        const gesendet = lokal();
        let r;
        try {
            r = await svpAuth.sicherSpeichern({ tabelle: 'svp_plan_edits', spalte: 'edits', seite: location.pathname,
                lokal: gesendet, basis: basis(), mergen: planMerge });
        } catch (e) { setCloud('☁ ' + e.message, false); return; }
        if (!r.ok) {
            if (r.stop) {
                setCloud('☁ NICHT gespeichert: ' + r.stop + '. Deine Änderung bleibt in diesem Browser. ' +
                    '„?cloud“ an der URL holt den Cloud-Stand', false);
            } else setCloud(cloudErr(r.status), false);
            return;
        }
        basisSetzen(r.ts, r.daten);
        localStorage.setItem(TS_KEY, r.ts);
        const jetzt = lokal();
        if (svpAuth.gleich(jetzt, gesendet)) {
            /* nothing new here meanwhile: the cloud's state is this tab's state */
            P.saved = r.daten;
            localStorage.setItem(P.KEY, JSON.stringify(r.daten));
            localStorage.removeItem(PENDING_KEY);
        } else if (r.gemischt) {
            /* this tab saved again while the merge ran: its newer change goes onto the merged state, the queued save
               carries it (PENDING stays) */
            const m = planMerge(gesendet, jetzt, r.daten);
            if (!m.stop) { P.saved = m.daten; localStorage.setItem(P.KEY, JSON.stringify(m.daten)); }
        }
        setCloud('☁ synchron', true);
        if (r.gemischt) {
            /* the table shows the merged weeks - not while editing: the cells hold what is being typed */
            if (!document.body.classList.contains('editing')) applyEdits(P.saved);
            const k = r.konflikte || [];
            hinweis(k.length
                ? 'Zusammengeführt: ein anderes Gerät hatte inzwischen gespeichert. Beide hatten geändert: ' +
                  k.slice(0, 4).map(x => stelle(x.woche) + (x.feld ? ' ' + (FELD[x.feld] || x.feld) : '')).join(', ') +
                  (k.length > 4 ? ' …' : '') + ' – hier gilt deine Fassung, die andere ist in der Sicherung.'
                : 'Zusammengeführt: ein anderes Gerät hatte inzwischen gespeichert – beides ist jetzt drin.', k.length > 0);
        }
    }

    /* --- Notizen sync (own table svp_plan_notes, RLS owner-only) ---------
       Deliberately a second table: svp_plan_edits has to stay anon-readable so
       every visitor sees the current plan, and a note must not ride along in
       it. One row per plan page, the notes as a { weekIndex: text } object.
       As long as the table does not exist the notes simply stay local - the
       feature degrades, nothing breaks and nothing leaks. */
    const NOTES_TS_KEY = P.NOTES_TS_KEY = 'svp-plan-notes-ts:' + location.pathname;
    let notesTableMissing = false;

    /* Notes and Fahrplan are saved the same safe way (27.09.2026): on the row they were built on, else merged week
       by week (svpAuth.merge3) - never the whole object over a newer one. */
    const NOTES_BASE = 'svp-plan-notes-basis:' + location.pathname, FAHR_BASE = 'svp-plan-fahrplan-basis:' + location.pathname;
    const tabBasen = {};   /* per tab, as the edits' base above */
    function basisVon(key) {
        if (tabBasen[key]) return tabBasen[key];
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
    }
    function basisNach(key, ts, daten) {
        tabBasen[key] = { ts: ts, daten: klon(daten) };
        try { localStorage.setItem(key, JSON.stringify(tabBasen[key])); } catch (e) { }
    }

    function pushNotes() {
        if (!P.notesAllowed() || notesTableMissing) return null;
        localStorage.setItem(NOTES_TS_KEY, new Date().toISOString());
        const gesendet = klon(P.planNotes);
        return svpAuth.sicherSpeichern({ tabelle: 'svp_plan_notes', spalte: 'notes', seite: location.pathname,
            lokal: gesendet, basis: basisVon(NOTES_BASE) }).then(function (r) {
            if (r.status === 404) { notesTableMissing = true; return; }
            if (!r.ok) { setCloud('☁ Notizen nicht gespeichert — HTTP ' + r.status, false); return; }
            basisNach(NOTES_BASE, r.ts, r.daten);
            localStorage.setItem(NOTES_TS_KEY, r.ts);
            if (r.gemischt && svpAuth.gleich(P.planNotes, gesendet)) {
                P.planNotes = r.daten || {};
                P.persistNotes();
                applyNotes();
            }
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
            /* newer here (typed offline): merged in by pushNotes on the row it came from */
            if (remoteTs < localTs) { pushNotes(); return; }
            basisNach(NOTES_BASE, rows[0].ts, rows[0].notes);
            if (remoteTs === localTs) return;
            P.planNotes = rows[0].notes || {};
            P.persistNotes();
            localStorage.setItem(NOTES_TS_KEY, rows[0].ts);
            applyNotes();
        } catch (e) { /* offline: the local copy stays */ }
    }

    /* --- Fahrplan sync (own table svp_plan_fahrplan, RLS owner-only) -----
       Doc, 20.09.2026: "so behandeln wie Notizen". Dieselbe Bauart wie oben, nur
       eine eigene Tabelle: der Fahrplan einer Stunde geht niemanden ausser Doc
       etwas an, und die Notizen sollen davon unberuehrt bleiben. Solange die
       Tabelle fehlt, bleibt der Fahrplan einfach lokal - nichts bricht. */
    const FAHR_TS_KEY = P.FAHR_TS_KEY = 'svp-plan-fahrplan-ts:' + location.pathname;
    let fahrTableMissing = false;

    function pushFahrplan() {
        if (!P.notesAllowed() || fahrTableMissing) return null;
        localStorage.setItem(FAHR_TS_KEY, new Date().toISOString());
        const gesendet = klon(P.fahrplaene());
        return svpAuth.sicherSpeichern({ tabelle: 'svp_plan_fahrplan', spalte: 'fahrplan', seite: location.pathname,
            lokal: gesendet, basis: basisVon(FAHR_BASE) }).then(function (r) {
            if (r.status === 404) { fahrTableMissing = true; return; }
            if (!r.ok) { setCloud('\u2601 Fahrplan nicht gespeichert \u2014 HTTP ' + r.status, false); return; }
            basisNach(FAHR_BASE, r.ts, r.daten);
            localStorage.setItem(FAHR_TS_KEY, r.ts);
            if (r.gemischt && svpAuth.gleich(P.fahrplaene(), gesendet)) {
                P.replaceFahrplaene(r.daten || {});
                P.markFahrplaene();
            }
        }).catch(function () { /* offline: the local copy stays */ });
    }

    async function pullFahrplan() {
        if (!P.notesAllowed()) return;
        try {
            const res = await svpAuth.api('svp_plan_fahrplan?page=eq.' +
                encodeURIComponent(location.pathname) + '&select=fahrplan,ts');
            if (res.status === 404) { fahrTableMissing = true; return; }
            if (!res.ok) return;
            const rows = await res.json();
            const localTs = Date.parse(localStorage.getItem(FAHR_TS_KEY) || '') || 0;
            if (!rows.length) { if (Object.keys(P.fahrplaene()).length) pushFahrplan(); return; }
            const remoteTs = Date.parse(rows[0].ts) || 0;
            if (remoteTs < localTs) { pushFahrplan(); return; }
            basisNach(FAHR_BASE, rows[0].ts, rows[0].fahrplan);
            if (remoteTs === localTs) return;
            P.replaceFahrplaene(rows[0].fahrplan || {});
            localStorage.setItem(FAHR_TS_KEY, rows[0].ts);
            P.markFahrplaene();
        } catch (e) { /* offline: the local copy stays */ }
    }

    /* Doc, 29.09.2026: "mach den sichtbar für die Kids aber block edit!" - without a login the Fahrplan is read
       like the plan edits below: public to READ (RLS select for anon since migration 20260929), written by Doc
       alone. It replaces whatever this browser held; nothing is ever sent from here. */
    async function fetchPublicFahrplan() {
        try {
            const res = await fetch(svpAuth.DB_URL + '/rest/v1/svp_plan_fahrplan?page=eq.' +
                encodeURIComponent(location.pathname) + '&select=fahrplan', {
                headers: { apikey: svpAuth.DB_KEY, Authorization: 'Bearer ' + svpAuth.DB_KEY }
            });
            if (!res.ok) return;
            const rows = await res.json();
            P.replaceFahrplaene((rows[0] && rows[0].fahrplan) || {});
            P.markFahrplaene();
        } catch (e) { /* offline: no Fahrplan for the class */ }
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

    /* The cloud row came in: take it - unless local edits are still open (PENDING), those are merged in by a save.
       A browser from before 27.09. has no base: if its local state is newer than the cloud (typed offline), it counts
       as open with the base unknown - the merge then keeps what the cloud has and adds this browser's pills. */
    function cloudZeile(row) {
        const neu = row.edits || {};
        let offen = localStorage.getItem(PENDING_KEY) === '1';
        if (!offen && !basis() && localStorage.getItem(P.KEY)) {
            const localTs = Date.parse(localStorage.getItem(TS_KEY) || '') || 0;
            if (localTs > (Date.parse(row.ts) || 0) && !svpAuth.gleich(lokal(), neu)) {
                localStorage.setItem(PENDING_KEY, '1');
                offen = true;
            }
        }
        if (offen) {
            if (!tabBasis) { const b = basis(); if (b) tabBasis = b; }
            return true;
        }
        basisSetzen(row.ts, neu);
        localStorage.setItem(TS_KEY, row.ts);
        if (!svpAuth.gleich(neu, P.saved)) {
            P.saved = neu;
            localStorage.setItem(P.KEY, JSON.stringify(neu));
            applyEdits(neu);
        }
        return false;
    }

    async function syncFromRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        try {
            const res = await svpAuth.api(
                'svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname) + '&select=edits,ts');
            if (!res.ok) { setCloud(cloudErr(res.status), false); return; }
            const rows = await res.json();
            if (!rows.length) {
                /* nothing in the cloud yet — seed it from local edits if any */
                if (localStorage.getItem(P.KEY)) pushRemote();
                else setCloud('☁ synchron', true);
                return;
            }
            /* open local edits: merged onto the cloud row (the base says what changed here) */
            if (cloudZeile(rows[0])) pushRemote();
            else setCloud('☁ synchron', true);
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
                    localStorage.removeItem(BASE_KEY);
                    localStorage.removeItem(PENDING_KEY);
                    const u = new URL(location.href);
                    u.searchParams.delete('cloud');
                    history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
                }
            } catch (e) { }
            try {
                const row = await fetchPublicEdits(location.pathname);
                if (row) cloudZeile(row);
            } catch (e) { /* offline: local state stays */ }
            if (svpAuth.hasSession()) { syncFromRemote(); pullNotes(); pullFahrplan(); }
            else fetchPublicFahrplan();
        })();
    }
});
