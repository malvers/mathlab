// Solita tool: read_notes — fetch Doc's saved Solita notes so Solita can email / read aloud / summarize them.
//
// Self-contained add-on: registers into window.SolitaTools, no core touch (Regel 7). Reads solita-notizen.md
// from GitHub raw — PUBLIC repo, keyless, CORS-OK (verified: access-control-allow-origin:*). The WRITE side is
// the solita-note Edge Function; this is the READ side. The notes are public (public repo) — nothing secret.
//
// Note: GitHub raw has a ~5 min CDN cache (max-age=300), so a note written seconds ago may lag a few minutes.
(function () {
    'use strict';

    const NOTES_URL = 'https://raw.githubusercontent.com/malvers/mathlab/main/solita-notizen.md';
    const MAX_CHARS = 24000; // safety cap so the tool result stays sane (file is small today; this is headroom)

    const spec = {
        name: 'read_notes',
        description: 'Hole Docs gespeicherte Solita-Notizen (alles, was du je mit write_note aufgeschrieben hast). '
            + 'Nutze dies, wenn Doc nach seinen/deinen Notizen fragt — z.B. „schick mir deine Notizen (als Mail)", '
            + '„lies mir deine Notizen vor", „was hast du dir notiert?", „zeig mir meine Notizen". Das Werkzeug LIEST nur '
            + '(kein Schreiben) und braucht keine Parameter. Danach machst DU, was Doc wollte: per Mail → ruf send_gmail mit '
            + 'den Notizen als Inhalt; vorlesen → fasse sie natürlich gesprochen zusammen; nur fragen → sag ihm, was drinsteht.',
        input_schema: { type: 'object', properties: {}, required: [] }
    };

    async function handler() {
        let text = null, httpFail = false, netFail = false, status = 0;
        try {
            const r = await fetch(NOTES_URL, { headers: { 'Accept': 'text/plain' }, cache: 'no-store' });
            status = r.status;
            if (r.status === 404) { /* no notes file created yet */ }
            else if (!r.ok) httpFail = true;
            else text = await r.text();
        } catch (e) {
            netFail = true;   // offline / "Failed to fetch"
        }

        if (netFail) {
            return { ok: false, summary: 'Ich komme gerade nicht an deine Notizen — keine Internet-Verbindung. '
                + 'Probier es gleich nochmal, dann hole ich sie.' };
        }
        if (status === 404 || (text != null && !text.trim())) {
            return { ok: true, summary: 'Es sind noch keine Notizen gespeichert. ANWEISUNG AN DICH (Solita): Sag Doc gesprochen, '
                + 'dass du bisher nichts notiert hast — und dass er dir jederzeit „notier …" sagen kann, dann hältst du es fest.' };
        }
        if (httpFail || text == null) {
            return { ok: false, summary: 'Ich konnte deine Notizen gerade nicht laden (der Server antwortet nicht). '
                + 'Versuch es gleich nochmal.' };
        }

        let content = text;
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
