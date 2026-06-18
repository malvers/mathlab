// Solita tool: delete_notes — delete Doc's saved notes, but ONLY after he confirms (Doc 2026-06-18).
//
// Self-contained add-on: registers into window.SolitaTools, no core touch (Regel 7). Talks to the private
// 'solita-note' Edge Function (same store as write_note/read_notes). TWO-STEP by design: the first call
// (without confirm) only PREVIEWS what would be deleted and asks Solita to confirm with Doc; deletion happens
// solely on a second call with confirm=true — so a note is never dropped without Doc's explicit "ja, löschen".
(function () {
    'use strict';

    const NOTE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-note';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe

    const spec = {
        name: 'delete_notes',
        description: 'Lösche Docs gespeicherte Solita-Notizen — NUR auf seinen ausdrücklichen Wunsch. '
            + 'WICHTIG (Sicherheits-Regel): Frage IMMER zuerst nach und lösche erst, wenn Doc GENAU JETZT klar bestätigt hat. '
            + 'Ablauf: (1) Rufe das Tool ZUERST OHNE confirm auf — das löscht NICHTS, sondern zeigt nur, was gelöscht würde. '
            + '(2) Sag Doc, was du löschen würdest, und frage „Soll ich das wirklich löschen?". '
            + '(3) Setze confirm=true und rufe erneut auf NUR wenn Doc ausdrücklich „ja/lösch" sagt. Bei Unsicherheit: NICHT löschen. '
            + 'Mit „which": „all" = alle Notizen, „last" = die neueste; oder „query" = nur Notizen, die diesen Text enthalten.',
        input_schema: {
            type: 'object',
            properties: {
                which: { type: 'string', enum: ['all', 'last'], description: '„all" = alle Notizen löschen, „last" = nur die neueste.' },
                query: { type: 'string', description: 'Statt which: nur Notizen löschen, die diesen Text (Teilstring) enthalten.' },
                confirm: { type: 'boolean', description: 'NUR true setzen, NACHDEM Doc ausdrücklich bestätigt hat. Ohne/false = nur Vorschau, löscht nichts.' }
            }
        }
    };

    function H(pwd) { return { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd }; }

    // Count what WOULD be deleted, without touching anything (uses the read-only list).
    async function previewCount(input, pwd) {
        const r = await fetch(NOTE_URL, { method: 'POST', headers: H(pwd), body: JSON.stringify({ action: 'list' }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        const notes = Array.isArray(d.notes) ? d.notes : [];
        const q = (input && input.query || '').trim().toLowerCase();
        if (q) return notes.filter(function (n) { return String(n.text || '').toLowerCase().includes(q); }).length;
        if (input && input.which === 'last') return Math.min(1, notes.length);
        return notes.length; // 'all' (default)
    }

    function targetLabel(input) {
        if (input && input.query) return 'Notizen mit „' + input.query + '"';
        if (input && input.which === 'last') return 'die neueste Notiz';
        return 'ALLE Notizen';
    }

    async function handler(input, pwd) {
        try {
            // ---- Step 1: PREVIEW (no confirm) — never deletes, asks Solita to confirm with Doc. ----
            if (!input || input.confirm !== true) {
                let n;
                try { n = await previewCount(input, pwd); }
                catch (e) { return { ok: false, summary: 'Konnte den Notiz-Bestand nicht prüfen: ' + ((e && e.message) || e) }; }
                if (!n) return { ok: true, summary: 'Es gibt nichts zu löschen — keine passenden Notizen.' };
                return { ok: true, summary:
                    '⚠️ Das würde ' + n + ' ' + (n === 1 ? 'Notiz' : 'Notizen') + ' löschen (' + targetLabel(input) + '). '
                    + 'Ich habe NOCH NICHTS gelöscht. ANWEISUNG AN DICH (Solita): Frage Doc jetzt ausdrücklich, ob du das wirklich '
                    + 'löschen sollst. Lösche NUR, wenn er klar „ja/lösch" sagt — dann rufe delete_notes mit denselben Angaben und '
                    + 'confirm=true erneut auf. Sagt er nein/unsicher: nichts löschen.' };
            }

            // ---- Step 2: CONFIRMED — actually delete. ----
            const body = { action: 'delete' };
            if (input.query) body.query = input.query;
            else body.which = (input.which === 'last') ? 'last' : 'all';
            const r = await fetch(NOTE_URL, { method: 'POST', headers: H(pwd), body: JSON.stringify(body) });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return { ok: false, summary: 'Löschen fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
            const n = d.deleted || 0;
            return { ok: true, summary: n + ' ' + (n === 1 ? 'Notiz' : 'Notizen') + ' gelöscht. ANWEISUNG AN DICH (Solita): Bestätige Doc kurz gesprochen, dass es erledigt ist.' };
        } catch (e) {
            return { ok: false, summary: 'Fehler beim Löschen: ' + ((e && e.message) || e) };
        }
    }

    function badge(input) { return (input && input.confirm === true) ? '🗑️ ich lösche die Notizen …' : '🗑️ ich prüfe, was gelöscht würde …'; }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
