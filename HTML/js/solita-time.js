// Solita tool: get_time — tell Doc the current time (his local time, or the time in a named place).
//
// Self-contained add-on: registers into window.SolitaTools, no core touch (Regel 7). NO API / NO key / NO
// network — the time comes from the device clock (new Date()), and the built-in Intl engine formats it for
// any IANA time zone (DST-correct). Claude knows the IANA zone for a city (San Francisco → America/Los_Angeles)
// and passes it in; the tool computes the exact wall-clock time there. Claude has no clock of its own, so the
// time question MUST go through this tool — never guessed.
(function () {
    'use strict';

    // Format a Date for a given IANA time zone → { time: "14:35", date: "Montag, 16. Juni 2026" }. Throws on bad tz.
    function fmt(date, tz) {
        const time = new Intl.DateTimeFormat('de-DE', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
        const day = new Intl.DateTimeFormat('de-DE', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
        return { time: time, date: day };
    }

    const spec = {
        name: 'get_time',
        description: 'Sag Doc die aktuelle Uhrzeit. OHNE Ort → seine lokale Zeit. MIT Ort (z.B. „in San Francisco", '
            + '„in Tokio", „in New York") → die Zeit DORT: dazu gibst du den IANA-Zeitzonen-Namen mit (du kennst die '
            + 'Zeitzonen der Welt — San Francisco = America/Los_Angeles, Tokio = Asia/Tokyo, New York = America/New_York, '
            + 'Berlin = Europe/Berlin usw.) sowie den gesprochenen Ortsnamen. Nutze dies bei JEDER Zeitfrage — „wie spät '
            + 'ist es (in …)?", „wie viel Uhr ist es (in …)?", „welche Uhrzeit haben wir?". Beantworte die Uhrzeit NIEMALS '
            + 'aus eigenem Wissen — du hast keine Uhr; immer dieses Werkzeug. Es liefert Uhrzeit + Datum + Wochentag '
            + '(wichtig, weil in anderen Zeitzonen ein anderer Tag/anderes Datum sein kann).',
        input_schema: {
            type: 'object',
            properties: {
                timezone: { type: 'string', description: 'IANA-Zeitzone des gefragten Ortes, z.B. „America/Los_Angeles" (San Francisco), „Asia/Tokyo" (Tokio). Leer lassen für Docs lokale Zeit.' },
                place: { type: 'string', description: 'Der gesprochene Ortsname, z.B. „San Francisco" — nur zur schönen Formulierung. Leer bei lokaler Zeit.' }
            }
        }
    };

    async function handler(input) {
        const now = new Date();
        const localTz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'Europe/Berlin';
        const reqTz = (input && input.timezone && String(input.timezone).trim()) ? String(input.timezone).trim() : '';
        const place = (input && input.place && String(input.place).trim()) ? String(input.place).trim() : '';

        let local;
        try { local = fmt(now, localTz); } catch (e) { local = fmt(now, 'UTC'); }

        // no place → local time only
        if (!reqTz) {
            return { ok: true, summary: 'Aktuelle lokale Zeit: ' + local.time + ' Uhr, ' + local.date + ' (Zeitzone ' + localTz + '). '
                + 'ANWEISUNG AN DICH (Solita): Sag Doc gesprochen die Uhrzeit (z.B. „Es ist 14 Uhr 35."). Datum/Wochentag nur, '
                + 'wenn er danach fragt.' };
        }

        // place given → time there (+ local for reference)
        let there;
        try { there = fmt(now, reqTz); }
        catch (e) {
            return { ok: false, summary: 'Ich bin mir bei der Zeitzone für „' + (place || reqTz) + '" nicht sicher. '
                + 'Sag mir die Stadt nochmal — oder ich nenne dir deine eigene Uhrzeit: ' + local.time + ' Uhr.' };
        }
        const ortLabel = place || reqTz;
        const anderesDatum = there.date !== local.date;
        return { ok: true, summary: 'In ' + ortLabel + ' ist es ' + there.time + ' Uhr (' + there.date + '). Bei Doc ist es '
            + local.time + ' Uhr (' + local.date + '). '
            + (anderesDatum ? 'ACHTUNG: dort ist ein anderer Tag/anderes Datum als bei Doc — erwähne das, wenn es relevant ist. ' : '')
            + 'ANWEISUNG AN DICH (Solita): Sag Doc gesprochen, wie spät es in ' + ortLabel + ' ist, natürlich formuliert; '
            + 'bei großem Unterschied kurz seine eigene Zeit zum Vergleich.' };
    }

    function badge(input) { return '🕐 ich schaue auf die Uhr' + ((input && input.place) ? ' in ' + input.place : '') + ' …'; }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
