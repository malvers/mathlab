// Solita tool: where_am_i — tell Doc where he is (GPS + reverse-geocode), then offer to tell about the place.
//
// Self-contained add-on: registers itself into window.SolitaTools (spec/handler/badge), touches no core
// (Regel 7), load order independent. GPS via navigator.geolocation (same pattern/options as getWeather);
// reverse-geocoding via Nominatim/OpenStreetMap — keyless, CORS-OK, no second secret.
//
// Flow: Doc asks "Wo bin ich?" → handler gets GPS + place name → the result steers Solita to STATE the
// location in one spoken sentence and OFFER „Soll ich dir was über den Ort erzählen?". Only on Doc's „ja"
// does Claude tell about the place from its OWN knowledge (no further tool call).
//
// Attribution (ODbL): reverse-geocode data © OpenStreetMap contributors — when shown, that line should be
// visible somewhere in the Solita UI (footer/about). Flagged so it isn't silently omitted.
(function () {
    'use strict';

    const REV_URL = 'https://nominatim.openstreetmap.org/reverse'; // keyless, CORS-OK; data © OpenStreetMap contributors (ODbL)

    const spec = {
        name: 'where_am_i',
        description: 'Bestimme Docs aktuellen Standort per GPS und nenne ihn in Worten (Straße/Stadtteil, Stadt, Land) '
            + 'durch Reverse-Geocoding der Koordinaten. Nutze dieses Werkzeug bei JEDER Frage nach dem eigenen Aufenthaltsort, '
            + 'in JEDER Formulierung — z.B. „wo bin ich (hier gerade)?", „wo bin ich grade?", „an welchem Ort bin ich?", '
            + '„wo sind wir?", „wo stehe ich?", „in welcher Stadt/Gegend bin ich?", „was ist das hier für ein Ort?". '
            + 'Beantworte den Standort NIEMALS aus eigenem Wissen oder aus dem Gesprächsverlauf — immer dieses Werkzeug '
            + 'aufrufen, denn nur GPS kennt den echten Ort. Das Werkzeug holt NUR den Ortsnamen (kein Faktenwissen) und '
            + 'braucht keine Parameter. Nachdem das Ergebnis den Ort genannt hat, bietest DU Doc an, ihm aus deinem EIGENEN '
            + 'Wissen etwas über den Ort zu erzählen — die genaue Formulierung steht im Werkzeug-Ergebnis. Erzähle die Fakten '
            + 'erst NACH Docs ausdrücklichem „ja" und dann aus deinem eigenen Wissen (kein weiteres Werkzeug, keine API dafür).',
        input_schema: { type: 'object', properties: {}, required: [] }
    };

    // Friendly spoken-German text for a geolocation error (PERMISSION_DENIED=1, POSITION_UNAVAILABLE=2, TIMEOUT=3).
    function gpsErrText(err) {
        if (err && err.code === 1) return 'Ich darf gerade nicht auf deinen Standort zugreifen — die Ortungs-Freigabe ist aus. '
            + 'Wenn du in den Einstellungen den Standort für mich freigibst, sage ich dir gleich, wo du bist.';
        if (err && err.code === 3) return 'Ich bekomme gerade keinen GPS-Fix — vielleicht bist du drinnen oder das Signal ist schwach. '
            + 'Geh kurz ans Fenster oder nach draußen und frag mich gleich nochmal, dann finde ich dich.';
        if (err && err.code === 2) return 'Dein Gerät kann mir gerade keinen Standort liefern — die Ortung scheint nicht zu funktionieren. '
            + 'Schalt einmal GPS aus und wieder an oder versuch es gleich nochmal, dann probiere ich es erneut.';
        return 'Ich konnte deinen Standort gerade nicht bestimmen — versuch es gleich nochmal.';
    }

    // Handler — called by solita-core's execTool. Returns { ok, summary }. The summary steers Claude (Solita).
    async function handler() {
        // (1) GPS — same options as getWeather.
        if (!navigator.geolocation) {
            return { ok: false, summary: 'Auf diesem Gerät steht mir leider keine Ortung zur Verfügung — ich kann deinen '
                + 'Standort nicht bestimmen. Sag mir einfach den Ort in Worten, dann erzähle ich dir trotzdem gern etwas darüber.' };
        }
        let pos;
        try {
            pos = await new Promise(function (res, rej) {
                navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000, maximumAge: 600000 });
            });
        } catch (err) {
            return { ok: false, summary: gpsErrText(err) };   // permission / timeout / unavailable → no place, no offer
        }
        const lat = pos.coords.latitude, lon = pos.coords.longitude;
        const accuracy = (pos.coords && pos.coords.accuracy != null) ? Math.round(pos.coords.accuracy) : null;
        const coarse = accuracy != null && accuracy > 1000;            // cell/wifi, not real GPS
        const accuracyHinweis = coarse ? ' (grobe Schätzung)' : '';
        const coords = 'Lat ' + lat.toFixed(5) + ', Lon ' + lon.toFixed(5);

        // (2) reverse-geocode → German place string (graceful). Do NOT set User-Agent (forbidden header).
        let j = null, httpFail = false, netFail = false;
        try {
            const r = await fetch(REV_URL + '?format=jsonv2&lat=' + lat + '&lon=' + lon + '&accept-language=de&zoom=18&addressdetails=1',
                { headers: { 'Accept': 'application/json' } });
            if (!r.ok) httpFail = true;                                // 4xx/5xx incl. 429 rate-limit
            else j = await r.json().catch(function () { httpFail = true; return null; });
        } catch (e) {
            netFail = true;                                            // offline / "Failed to fetch"
        }

        // (E) offline — GPS fine, lookup not.
        if (netFail) {
            return { ok: true, summary: 'Position per GPS bekommen (' + coords + '), aber gerade keine Internet-Verbindung für '
                + 'den Ortsnamen. ANWEISUNG AN DICH (Solita): Sag Doc gesprochen, dass du seine Position hast, ihm den Ortsnamen '
                + 'aber erst nennen kannst, wenn er wieder online ist. Kein Faktenwissen, kein Angebot.' };
        }
        // (D) reverse-geocode HTTP error / rate-limit.
        if (httpFail || !j) {
            return { ok: true, summary: 'GPS-Position liegt vor (' + coords + '), aber der Karten-Dienst antwortet gerade nicht, '
                + 'also kein Ortsname. ANWEISUNG AN DICH (Solita): Sag Doc gesprochen, dass du ihn auf der Karte hast, den Namen '
                + 'der Gegend momentan aber nicht nennen kannst, und biete an, es gleich nochmal zu versuchen.' };
        }

        // parse graceful-by-omission (never guess a missing part; drop it).
        const a = j.address || {};
        const street = a.road || a.pedestrian || a.footway || a.path || '';
        const houseNo = a.house_number || '';
        const streetPart = street ? (street + (houseNo ? ' ' + houseNo : '')) : '';
        const city = a.city || a.town || a.village || a.municipality || a.suburb || '';
        const state = a.state || a.region || '';
        const country = a.country || '';
        const seen = {};
        const clean = [streetPart, city, state, country].filter(Boolean).filter(function (p) {
            const k = p.toLowerCase(); if (seen[k]) return false; seen[k] = true; return true;   // dedupe e.g. Berlin/Berlin
        });
        const hasNamedPlace = clean.length > 0;
        const standortsatz = hasNamedPlace ? clean.join(', ') : null;
        const kurzerOrtsname = streetPart || city || state || country || null;
        const accStr = accuracy != null ? (', Genauigkeit ca. ' + accuracy + ' m' + accuracyHinweis) : '';

        // (F) no named place — ocean/desert: offer to describe the region, not "tell about the place".
        if (!hasNamedPlace) {
            return { ok: true, summary: 'Position gefunden (' + coords + '), aber dort ist kein benannter Ort hinterlegt — '
                + 'wahrscheinlich abseits von Straßen/Ortschaften. ANWEISUNG AN DICH (Solita): Sag Doc gesprochen ungefähr, wo das '
                + 'liegt (nächstgelegenes Land/Region ' + (country || 'unbekannt') + ', falls bekannt), sonst dass es eine unbenannte '
                + 'Gegend ist. Biete hier NICHT „über den Ort erzählen" an — biete stattdessen an, die Region grob zu beschreiben.' };
        }

        // (3) success: state the location AND offer exactly one follow-up. Facts only after Doc says „ja".
        const coarseSteer = coarse ? ' Baue beim Vorlesen ein „ungefähr/grob" ein (z.B. „Du bist ungefähr in '
            + (city || kurzerOrtsname) + '").' : '';
        return { ok: true, summary:
            'Standort bestimmt: Doc ist ' + standortsatz + '. ' + coords + accStr + '. '
            + 'ANWEISUNG AN DICH (Solita): Sag Doc jetzt in EINEM natürlichen, gesprochenen Satz, wo er ist — flüssig, OHNE '
            + 'Koordinaten/Klammern/Aufzählung (z.B. „Du bist gerade in der ' + kurzerOrtsname + '").' + coarseSteer
            + ' Hänge danach GENAU EINE kurze Rückfrage an: „Soll ich dir was über den Ort erzählen?". '
            + 'Erzähle JETZT NOCH NICHTS über den Ort — keine Geschichte, keine Sehenswürdigkeiten, keine Fakten. Erst wenn Doc '
            + 'mit „ja" o.ä. antwortet, erzählst du ihm aus deinem EIGENEN Wissen über den Ort — OHNE dieses oder ein anderes '
            + 'Werkzeug erneut aufzurufen.' };
    }

    function badge() { return '📍 ich schaue, wo du gerade bist …'; }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
