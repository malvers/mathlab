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

    // Audible alert: a short two-tone chime so Doc HEARS the instant a mail send is triggered
    // (catches a misfire — e.g. a misheard word — even when he isn't watching the screen).
    function chime() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const beep = (freq, at, dur) => {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'sine'; o.frequency.value = freq;
                g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
                g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + at + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
                o.connect(g); g.connect(ctx.destination);
                o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + dur + 0.02);
            };
            beep(660, 0, 0.18); beep(990, 0.20, 0.22);          // rising two-tone = "Solita is sending a mail"
            setTimeout(() => { try { ctx.close(); } catch (e) {} }, 700);
        } catch (e) { /* audio is best-effort */ }
    }

    // Record every send trigger to the ONE DebugWindow (Doc keeps it open) + console, with subject + a body preview.
    function logSend(subject, body) {
        const preview = String(body).replace(/\s+/g, ' ').trim().slice(0, 200);
        try { if (window.DebugWindow) DebugWindow.log('✉️ send_gmail AUSGELÖST — Betreff: „' + subject + '" | ' + preview); } catch (e) {}
        try { console.log('[solita] send_gmail triggered:', { subject, body }); } catch (e) {}
    }

    // Handler — called by solita-core's execTool with (name, input, pwd). Returns { ok, summary }.
    async function handler(input, pwd) {
        try {
            const subject = (input && input.subject) || '(ohne Betreff)';
            const body = (input && input.body) || '';
            if (!String(body).trim()) return { ok: false, summary: 'Kein Inhalt — was soll in der Mail stehen?' };
            // Mark the trigger BEFORE the network call — so even a failed/odd send leaves a trace + a sound.
            chime();
            logSend(subject, body);
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
