// Stoffverteilungsplan renderer, part "state": stored edits and notes (localStorage), the merged plan rows.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        notesAllowed, noteOf, persistNotes, heileMathe
    });

    const KEY = P.KEY = 'svp-edits:' + location.pathname;
    /* Notizen live in their OWN store, deliberately not in the edits object:
       svp_plan_edits is readable by anon on purpose (every visitor has to see
       the current plan), so a note in there would be public - Doc, 03.09.2026:
       "die Kids sollen die Notizen nicht sehen". Own key, own table, and the
       tab is not even built while nobody is logged in. */
    const NOTES_KEY = P.NOTES_KEY = 'svp-plan-notes:' + location.pathname;
    P.planNotes = {};
    try { P.planNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') || {}; } catch (e) { P.planNotes = {}; }
    function notesAllowed() { return !!(window.svpAuth && svpAuth.hasSession()); }
    function noteOf(i) { return P.planNotes[i] || ''; }
    function persistNotes() { localStorage.setItem(NOTES_KEY, JSON.stringify(P.planNotes)); }
    P.skipUnloadSave = false; /* set by doReset()/applyShift(), see the beforeunload handler */
    P.saved = {};
    try { P.saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { P.saved = {}; }

    // Per-row references for edit mode and persistence.
    const rendered = P.rendered = [];
    const lbCells = P.lbCells = {};   /* row index -> Bereich cell wrapper (pill + WU chip) */

    // The table is not always as long as the page's PLAN: shiftPlan() can push
    // content past the last week, and those extra weeks live only in the edits
    // object. planRows is PLAN padded out to cover them, so index i means the
    // same row everywhere (render, edits, shift).
    const planRows = P.planRows = window.PLAN.slice();
    /* Vor dem ersten Zeichnen: was in localStorage liegt, kann die zerkauten
       Formeln vom 09.09.2026 enthalten (siehe heileMathe weiter unten). */
    heileMathe(P.saved);
    Object.keys(P.saved).forEach(function (k) {
        const i = Number(k);
        if (!Number.isInteger(i) || i < 0) return;
        while (planRows.length <= i) planRows.push(null);
    });
    for (let j = 0; j < planRows.length; j++) {
        if (!planRows[j]) {
            planRows[j] = { nr: 0, kw: '', date: '', type: 'org', u: '', topic: '', remark: '', details: [] };
        }
    }

    /* --- Reparatur: von KaTeX zerkaute Formeln in den Overrides ------------
       Am 09.09.2026 hat ein Fehler in setEditable/saveEdits beim Speichern den
       DOM einer GESETZTEN Zelle als Quelltext gelesen. KaTeX legt dort drei
       Fassungen uebereinander - die unsichtbare MathML-Fassung, den
       \u0024-Quelltext in <annotation> und die sichtbare Formel -, also wurde aus
       "$x^2$" die Kette "x2x^2x2". Der Fehler ist behoben (siehe quelleVon),
       aber der Schaden steht in localStorage und in der Cloud.

       Erkannt wird er hart: der Plan hat an dieser Stelle \u0024...\u0024, der
       gespeicherte Text hat KEIN \u0024 mehr, enthaelt aber einen Befehl aus genau
       dieser Formel (oder ein Nullbreiten-Leerzeichen, das nur KaTeX setzt).
       Dann gilt der Plan. Eine echte Aenderung von Hand faellt nicht darunter:
       sie behielte die \u0024 oder haette die Befehle nicht mehr. */
    /* KEIN const hier oben in der Datei: heileMathe laeuft schon vor dem ersten
       Zeichnen, also weit vor dieser Stelle. Eine spaeter deklarierte const
       liegt dann noch in der temporalen Todeszone und wirft - und mit ihr
       stirbt das ganze Skript, bevor eine einzige Wochenzeile gebaut ist
       (Doc, 09.09.2026: "irgendwie sind alle Wochen weg?"). Der Wert steht
       deshalb direkt in istZerkaut. */
    function mathBefehle(text) {
        const out = [];
        String(text || '').replace(/\$([^$]+)\$/g, function (_, inner) {
            (inner.match(/\\[a-zA-Z]+|[\^_]/g) || []).forEach(function (t) { out.push(t); });
            return '';
        });
        return out;
    }
    function istZerkaut(gespeichert, plan) {
        if (typeof gespeichert !== 'string' || typeof plan !== 'string') return false;
        if (!plan.includes('$') || gespeichert.includes('$')) return false;
        if (gespeichert.includes('\u200b')) return true;   /* Nullbreiten-Leerzeichen: nur KaTeX setzt das */
        const befehle = mathBefehle(plan);
        if (befehle.some(function (b) { return gespeichert.includes(b); })) return true;
        /* Formeln ohne Befehl, z. B. \u0024y = x\u0024: da hilft kein Erkennungszeichen.
           KaTeX legt die Formel dreifach ab, der zerkaute Text ist also LAENGER
           als der Plantext ohne die \u0024 - und der Teil vor der ersten Formel ist
           unveraendert. Eine Aenderung von Hand faellt nicht darunter: die
           behielte die \u0024 (im Bearbeiten steht der Quelltext da) oder waere
           kuerzer, weil die Formel weg ist. */
        const ohne = plan.split('$').join('');
        const kopf = plan.slice(0, plan.indexOf('$'));
        return gespeichert.length > ohne.length && gespeichert.startsWith(kopf);
    }
    /* Repariert die Karte an Ort und Stelle und meldet, wie viele Felder
       zurueckgeholt wurden. */
    function heileMathe(map) {
        if (!map) return 0;
        let n = 0;
        Object.keys(map).forEach(function (k) {
            const ov = map[k], row = planRows[k];
            if (!ov || !row) return;
            ['topic', 'remark'].forEach(function (feld) {
                if (istZerkaut(ov[feld], row[feld])) { ov[feld] = row[feld]; n++; }
            });
            if (Array.isArray(ov.details) && Array.isArray(row.details)) {
                ov.details.forEach(function (d, i) {
                    if (istZerkaut(d, row.details[i])) { ov.details[i] = row.details[i]; n++; }
                });
            }
        });
        if (n) {
            try { localStorage.setItem(KEY, JSON.stringify(map)); } catch (e) { }
            /* Spaet und abgesichert: beim ersten Lauf steht die Wolken-Anzeige
               noch gar nicht im Dokument. */
            setTimeout(function () {
                try {
                    P.setCloud('\u2601 ' + n + ' Formel' + (n === 1 ? '' : 'n') +
                        ' aus dem Plan geholt \u2014 bitte einmal speichern', false);
                } catch (e) { }
            }, 0);
        }
        return n;
    }
});
