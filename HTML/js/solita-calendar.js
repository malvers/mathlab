// Solita tool: check_calendar — READ-ONLY peek at Doc's Google Calendar (upcoming events).
//
// Self-contained add-on: it registers itself into window.SolitaTools and solita-core picks it up at
// send-time, so this file touches nothing in core (Regel 7) and load order does not matter. The heavy
// lifting (OAuth, Calendar API) lives in the 'calendar' Edge Function — this only calls it + formats.
(function () {
    'use strict';

    const CAL_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/calendar';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe

    // Tool spec handed to Claude. The description is rich enough that Claude calls it without persona help.
    const spec = {
        name: 'check_calendar',
        description: 'Prüfe Docs Google-Kalender READ-ONLY und melde die ANSTEHENDEN Termine (Titel + Zeit + Ort). '
            + 'Nutze dies bei JEDER Frage Richtung Kalender/Termine, z.B. „was steht heute/morgen an?", „habe ich Termine?", '
            + '„wie sieht mein Kalender aus?", „wann ist mein nächster Termin?", „was habe ich diese Woche?". '
            + 'Liest NUR — legt nichts an, ändert/löscht nichts. Optional „days" (Zeitraum in Tagen ab jetzt, Standard 7) '
            + 'und „query" (Stichwort-Filter, z.B. ein Name oder Ort).',
        input_schema: {
            type: 'object',
            properties: {
                days: {
                    type: 'number',
                    description: 'Zeitraum in Tagen ab jetzt (1–60). Standard 7. „heute" ≈ 1, „diese Woche" ≈ 7, „diesen Monat" ≈ 31.'
                },
                query: {
                    type: 'string',
                    description: 'Optionaler Stichwort-Filter (Titel/Ort), z.B. „Zahnarzt" oder „Altea". Leer = alle Termine im Zeitraum.'
                }
            }
        }
    };

    // Format an ISO start/date into a warm German line in Doc's local time. All-day → date only.
    function fmtWhen(ev) {
        if (!ev.start) return '';
        try {
            const d = new Date(ev.start);
            if (ev.allDay) {
                return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }) + ' (ganztägig)';
            }
            const day = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
            const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            return day + ' ' + time + ' Uhr';
        } catch (e) { return ev.start; }
    }

    // Handler — called by solita-core's execTool with (name, input, pwd). Returns { ok, summary }.
    async function handler(input, pwd) {
        try {
            const body = {};
            if (input && typeof input.days === 'number') body.days = input.days;
            if (input && input.query) body.query = input.query;
            const r = await fetch(CAL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                body: JSON.stringify(body)
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) {
                // Surface the RAW edge-fn error in DEBUG — Claude only shows a softened paraphrase to the user.
                // e.g. "GCAL_REFRESH_TOKEN fehlt" / "Token-Refresh fehlgeschlagen" / "Calendar list 403".
                if (window.DebugWindow) DebugWindow.log('📅 calendar ERR ' + r.status + ': ' + (d.error || '(kein Text)'));
                return { ok: false, summary: 'Kalender-Abfrage fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
            }
            if (!d.count) return { ok: true, summary: 'Keine anstehenden Termine im gewählten Zeitraum.' };
            const lines = (d.events || []).map(function (ev) {
                let line = '• ' + fmtWhen(ev) + ' — ' + ev.title;
                if (ev.location) line += ' (' + ev.location + ')';
                return line;
            }).join('\n');
            return { ok: true, summary: d.count + ' anstehende Termin(e):\n' + lines };
        } catch (e) {
            return { ok: false, summary: 'Fehler bei der Kalender-Abfrage: ' + ((e && e.message) || e) };
        }
    }

    // Short chat line shown while the tool runs.
    function badge() { return '📅 ich schaue in deinen Kalender …'; }

    // Register into the shared Solita tool registry (idempotent — works whether core loaded first or not).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
