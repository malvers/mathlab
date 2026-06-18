// Solita tool: read_notes — fetch Doc's saved Solita notes so Solita can email / read aloud / summarize them.
//
// Self-contained add-on: registers into window.SolitaTools, no core touch (Regel 7). Notes now live in a
// PRIVATE Supabase table (Doc 2026-06-18) — read via the password-gated 'solita-note' Edge Function, NOT the
// public repo. The WRITE side is write_note (same function); DELETE is delete_notes. Each note's time comes
// from created_at and is shown in Doc's LOCAL time here.
(function () {
    'use strict';

    const NOTE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-note';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe
    const MAX_CHARS = 24000; // safety cap so the tool result stays sane

    const spec = {
        name: 'read_notes',
        description: 'Hole Docs gespeicherte Solita-Notizen (alles, was du je mit write_note aufgeschrieben hast). '
            + 'Nutze dies, wenn Doc nach seinen/deinen Notizen fragt — z.B. „schick mir deine Notizen (als Mail)", '
            + '„lies mir deine Notizen vor", „was hast du dir notiert?", „zeig mir meine Notizen". Das Werkzeug LIEST nur '
            + '(kein Schreiben/Löschen) und braucht keine Parameter. Danach machst DU, was Doc wollte: per Mail → ruf send_gmail '
            + 'mit den Notizen als Inhalt; vorlesen → fasse sie natürlich gesprochen zusammen; nur fragen → sag ihm, was drinsteht.',
        input_schema: { type: 'object', properties: {}, required: [] }
    };

    // Format an ISO created_at into a German local-time stamp ("Mi 18.06. 08:15 Uhr").
    function fmtTime(iso) {
        try {
            const d = new Date(iso);
            const day = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
            const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            return day + ' ' + time + ' Uhr';
        } catch (e) { return iso || ''; }
    }

    async function handler(input, pwd) {
        let notes = null, netFail = false;
        try {
            const r = await fetch(NOTE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                body: JSON.stringify({ action: 'list' })
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return { ok: false, summary: 'Ich konnte deine Notizen gerade nicht laden: ' + (d.error || ('HTTP ' + r.status)) };
            notes = Array.isArray(d.notes) ? d.notes : [];
        } catch (e) {
            netFail = true;
        }

        if (netFail) {
            return { ok: false, summary: 'Ich komme gerade nicht an deine Notizen — keine Internet-Verbindung. '
                + 'Probier es gleich nochmal, dann hole ich sie.' };
        }
        if (!notes || !notes.length) {
            return { ok: true, summary: 'Es sind noch keine Notizen gespeichert. ANWEISUNG AN DICH (Solita): Sag Doc gesprochen, '
                + 'dass du bisher nichts notiert hast — und dass er dir jederzeit „notier …" sagen kann, dann hältst du es fest.' };
        }

        let content = notes.map(function (n) { return '## ' + fmtTime(n.created_at) + '\n' + (n.text || ''); }).join('\n\n');
        let truncated = false;
        if (content.length > MAX_CHARS) { content = content.slice(0, MAX_CHARS); truncated = true; }

        return { ok: true, summary:
            'Hier sind Docs gespeicherte Solita-Notizen' + (truncated ? ' (gekürzt — sehr lang)' : '') + ':\n\n'
            + content + '\n\n'
            + 'ANWEISUNG AN DICH (Solita): Mach damit, was Doc wollte. Wollte er sie PER MAIL → ruf send_gmail auf, Betreff z.B. '
            + '„Deine Solita-Notizen", Inhalt = diese Notizen (sauber formatiert). Wollte er sie VORGELESEN → fasse sie natürlich '
            + 'und gesprochen zusammen (bei vielen Einträgen die wichtigsten, nicht stur alles). Hat er nur gefragt, WAS drinsteht '
            + '→ sag es ihm knapp. Erfinde nichts dazu, was nicht in den Notizen steht.' };
    }

    function badge() { return '📒 ich hole deine Notizen …'; }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
