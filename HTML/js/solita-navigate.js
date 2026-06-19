// Solita tool: navigate_to — let Doc say a destination in plain words and get routed there.
//
// Self-contained add-on: registers itself into window.SolitaTools (spec/handler/badge), touches no core
// (Regel 7), load-order independent. The DIVISION OF LABOUR is the whole point (Doc 2026-06-19):
//   - The LLM (Solita) understands the colloquial name ("Mensa TU Dresden", "MDC Berlin") and turns it
//     into the most precise ADDRESS it knows — that is knowledge, not a web search.
//   - This tool geocodes that address via Nominatim/OpenStreetMap (keyless, CORS-OK) → exact, verified
//     coordinates, and hands them to the tracker's navigation (window.__trackerNav, set by tracker-nav.js).
//   - The LLM must NOT invent coordinates (it hallucinates lat/lng) — it passes an address string only.
//
// Lives ONLY in the tracker (navigation exists nowhere else), so it is loaded from tracker.html, not
// solita.html. Attribution (ODbL): geocoding data © OpenStreetMap contributors — keep visible in the UI.
(function () {
    'use strict';

    const SEARCH_URL = 'https://nominatim.openstreetmap.org/search'; // keyless, CORS-OK; data © OpenStreetMap contributors (ODbL)

    const spec = {
        name: 'navigate_to',
        description: 'Starte die Navigation/Route zu einem Ziel. Nutze dieses Werkzeug bei JEDER Bitte, irgendwohin '
            + 'gebracht/gefahren zu werden oder eine Route zu bekommen, in JEDER Formulierung — z.B. „bring/fahr/navigier '
            + 'mich zu/nach X", „wie komme ich zu X?", „Route zu X", „los zu X", „ich will zu X". '
            + 'WICHTIG — die Arbeitsteilung: DU löst den (oft umgangssprachlichen) Ort aus deinem EIGENEN Wissen zu einer '
            + 'möglichst GENAUEN Adresse auf und übergibst sie als `address` — am besten Straße + Hausnummer + PLZ + Ort '
            + '(z.B. „Mensa TU Dresden" → „Alte Mensa, Mommsenstraße 13, 01069 Dresden"; „MDC Berlin" → '
            + '„Max-Delbrück-Centrum, Robert-Rössle-Straße 10, 13125 Berlin"). Kennst du die genaue Straße nicht, übergib '
            + 'die beste eindeutige Form MIT Stadt/Land (z.B. „Spitzhaus, Radebeul"). Übergib NIEMALS Koordinaten und '
            + 'ERFINDE keine — nur einen Adress-/Ortstext; das Werkzeug geocodiert ihn selbst. Gib zusätzlich `label`: '
            + 'einen kurzen, gesprochenen Namen fürs Bestätigen (z.B. „Mensa TU Dresden"). NACH dem Werkzeug bestätigst du '
            + 'Doc in EINEM kurzen Satz, WOHIN du ihn routest (den erkannten Ort nennen) — die Formulierung steht im Ergebnis.',
        input_schema: {
            type: 'object',
            properties: {
                address: { type: 'string', description: 'Die von dir aufgelöste, möglichst genaue Zieladresse (Straße, Nr., PLZ, Ort) oder eindeutiger Ortsname mit Stadt. KEINE Koordinaten.' },
                label: { type: 'string', description: 'Kurzer gesprochener Name des Ziels fürs Bestätigen, z.B. „Mensa TU Dresden".' }
            },
            required: ['address']
        }
    };

    // "Straße 12, Ort, Land, …" → just the first one or two parts, for a tidy spoken confirmation.
    function shortName(s) { return (s || '').split(',').slice(0, 2).join(',').trim(); }

    // Handler — called by the brain's execTool as ext(input, pwd). Returns { ok, summary }; the summary
    // steers Solita's spoken reply (same convention as where_am_i).
    async function handler(input) {
        const bridge = window.__trackerNav;
        if (!bridge || !bridge.navigateTo) {
            return { ok: false, summary: 'Die Navigation ist hier gerade nicht verfügbar. Sag Doc gesprochen, dass du ihn momentan nicht navigieren kannst.' };
        }
        const address = ((input && input.address) || '').toString().trim();
        const label = ((input && input.label) || '').toString().trim();
        if (!address) {
            return { ok: false, summary: 'Es wurde kein Ziel genannt. Frag Doc gesprochen kurz, wohin er navigiert werden möchte.' };
        }

        // Best-effort position bias: same ±0.6° viewbox tracker-nav.js uses, so a thin query resolves to the
        // NEARBY place, not the globally most prominent. The LLM address usually carries a city anyway, so a
        // missing fix is no problem — geocode without the bias then.
        let viewbox = '';
        try {
            const pos = await new Promise(function (res, rej) {
                navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000, maximumAge: 600000 });
            });
            const la = pos.coords.latitude, lo = pos.coords.longitude, d = 0.6;
            viewbox = '&viewbox=' + [lo - d, la + d, lo + d, la - d].join(',');
        } catch (e) { /* no fix → no bias */ }

        // Geocode. Do NOT set User-Agent (forbidden header); the browser Origin satisfies Nominatim.
        let hit = null;
        try {
            const url = SEARCH_URL + '?format=jsonv2&limit=1&accept-language=de&q=' + encodeURIComponent(address) + viewbox;
            const r = await fetch(url, { headers: { Accept: 'application/json' } });
            if (r.ok) { const arr = await r.json().catch(function () { return null; }); hit = (arr && arr.length) ? arr[0] : null; }
        } catch (e) {
            return { ok: false, summary: 'Die Adress-Suche hat gerade nicht geklappt — vielleicht offline. Sag Doc gesprochen, dass du das Ziel gerade nicht finden konntest, und er es gleich nochmal versuchen soll.' };
        }
        if (!hit) {
            return { ok: false, summary: 'Ich konnte „' + (label || address) + '" auf der Karte nicht finden. Sag Doc gesprochen, dass du den Ort nicht gefunden hast, und schlag vor, es genauer zu sagen (z.B. mit Stadt) oder das Ziel direkt auf der Karte zu wählen.' };
        }

        const lat = parseFloat(hit.lat), lon = parseFloat(hit.lon);
        const where = shortName(hit.display_name);
        const spoken = label || where || address;
        try { bridge.navigateTo([lat, lon], spoken); }
        catch (e) { return { ok: false, summary: 'Das Ziel ist gefunden, aber die Navigation ließ sich nicht starten. Sag Doc das gesprochen.' }; }

        return { ok: true, summary:
            'Navigation gestartet zu: ' + (where || spoken) + '. ANWEISUNG AN DICH (Solita): Bestätige Doc in EINEM '
            + 'kurzen gesprochenen Satz, wohin du ihn jetzt routest — nenne den erkannten Ort „' + (where || spoken) + '", '
            + 'damit er merkt, falls du etwas falsch verstanden hast. Keine Koordinaten, keine Aufzählung.' };
    }

    function badge(input) {
        return '🧭 ich suche die Route zu „' + ((input && input.label) || (input && input.address) || 'deinem Ziel') + '" …';
    }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
