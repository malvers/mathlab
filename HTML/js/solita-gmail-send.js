// Solita tool: send_gmail — send a plain-text mail TO DOC HIMSELF (fixed recipient).
//
// Self-contained add-on: registers itself into window.SolitaTools, touches no core (Regel 7), load order
// doesn't matter. The actual send (OAuth gmail.send + Gmail API) lives in the 'gmail-send' Edge Function;
// the recipient is fixed server-side (Env GMAIL_SEND_TO) — this only passes subject + body.
//
// Doc's decision (2026-06-16): recipient = only Doc, and NO confirmation step (direct send), because the
// fixed recipient keeps the blast radius tiny (worst case: a spurious mail to himself).
(function () {
    'use strict';

    const SEND_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/gmail-send';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe

    const spec = {
        name: 'send_gmail',
        description: 'Sende eine E-Mail AN DOC SELBST (fester Empfänger, kein freies To-Feld). Nutze dies, wenn Doc '
            + 'sagt „schick/maile/sende mir … per Mail", „schick mir das als E-Mail", „maile mir die Zusammenfassung". '
            + 'Du gibst nur Betreff und Inhalt; der Empfänger steht fest. Die Mail wird sofort gesendet (keine Rückfrage) — '
            + 'fasse den Inhalt also sauber und vollständig. Nur einsetzen, wenn Doc wirklich um eine Mail bittet.',
        input_schema: {
            type: 'object',
            properties: {
                subject: { type: 'string', description: 'Betreff der Mail, kurz und sprechend.' },
                body: { type: 'string', description: 'Der Mail-Inhalt als Klartext, sauber ausformuliert.' }
            },
            required: ['subject', 'body']
        }
    };

    // Handler — called by solita-core's execTool with (name, input, pwd). Returns { ok, summary }.
    async function handler(input, pwd) {
        try {
            const subject = (input && input.subject) || '(ohne Betreff)';
            const body = (input && input.body) || '';
            if (!String(body).trim()) return { ok: false, summary: 'Kein Inhalt — was soll in der Mail stehen?' };
            const r = await fetch(SEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                body: JSON.stringify({ subject: subject, body: body })
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return { ok: false, summary: 'Senden fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
            return { ok: true, summary: 'Mail an dich gesendet — Betreff „' + subject + '".' };
        } catch (e) {
            return { ok: false, summary: 'Fehler beim Senden: ' + ((e && e.message) || e) };
        }
    }

    function badge(input) { return '✉️ ich sende dir eine Mail' + ((input && input.subject) ? ' („' + input.subject + '")' : '') + ' …'; }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
