// Solita tool: check_gmail — READ-ONLY peek at Gmail (count + senders of unread mail).
//
// Self-contained add-on: it registers itself into window.SolitaTools and solita-core picks it up at
// send-time, so this file touches nothing in core (Regel 7) and load order does not matter.
// The heavy lifting (OAuth, Gmail API) lives in the 'gmail' Edge Function — this only calls it.
(function () {
    'use strict';

    const GMAIL_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/gmail';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe

    // Tool spec handed to Claude. The description is rich enough that Claude calls it without persona help.
    const spec = {
        name: 'check_gmail',
        description: 'Prüfe Gmail READ-ONLY auf neue/ungelesene Mails im Posteingang und melde Anzahl + Absender '
            + '(und Betreff). Nutze dies bei JEDER Frage Richtung Postfach/E-Mail, z.B. „habe ich neue Mails?", '
            + '„guck mal ins Postfach", „wer hat mir geschrieben?", „ist was Wichtiges reingekommen?". '
            + 'Setze read_body=true, wenn Doc den INHALT/Text einer Mail wissen will — vorlesen, zusammenfassen, '
            + '„was steht in der Mail von …", „lies mir die neueste vor", „worum geht es?". Dann kommt der Mail-Text mit. '
            + 'Sendet/löscht/markiert NICHTS und markiert keine Mail als gelesen — nur lesen. '
            + 'Optional eine Gmail-Suchanfrage (Standard: ungelesen im Posteingang).',
        input_schema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Optionale Gmail-Suchsyntax, z.B. "is:unread in:inbox" oder "newer_than:2d from:chef@firma.de". Leer = ungelesene Posteingangs-Mails.'
                },
                read_body: {
                    type: 'boolean',
                    description: 'true = den vollen Text/Inhalt der Mails mitliefern (zum Vorlesen/Zusammenfassen). false/leer = nur Absender + Betreff (+ kurze Vorschau).'
                }
            }
        }
    };

    // Handler — called by solita-core's execTool with (name, input, pwd). Returns { ok, summary }.
    async function handler(input, pwd) {
        try {
            const r = await fetch(GMAIL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                body: JSON.stringify({ query: (input && input.query) || '', bodies: !!(input && input.read_body) })
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return { ok: false, summary: 'Gmail-Abfrage fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
            if (!d.count) return { ok: true, summary: 'Keine neuen (ungelesenen) Mails im Posteingang.' };
            const who = (d.senders || []).map(function (s) {
                let line = '• Von: ' + s.name + (s.subject ? ' — Betreff: „' + s.subject + '"' : '');
                if (s.body) line += '\n  Inhalt: ' + s.body;              // read_body → voller Text
                else if (s.snippet) line += '\n  Vorschau: ' + s.snippet; // sonst die kurze Vorschau
                return line;
            }).join('\n\n');
            const more = d.more ? ' (und weitere)' : '';
            return { ok: true, summary: d.count + ' ungelesene Mail(s)' + more + ':\n' + who };
        } catch (e) {
            return { ok: false, summary: 'Fehler bei der Gmail-Abfrage: ' + ((e && e.message) || e) };
        }
    }

    // Short chat line shown while the tool runs.
    function badge() { return '📬 ich schaue in dein Postfach …'; }

    // Register into the shared Solita tool registry (idempotent — works whether core loaded first or not).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
