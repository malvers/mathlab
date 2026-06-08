# Tracker — Geo-gestützte Erkennung & Voice-Spur (Konzept)

> Ideen-/Spec-Notiz, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Zwei Erweiterungen der
> Foto-Spur: (A) bessere Objekt-/Ort-Erkennung durch Standort-Kontext, (B) Sprach-Nachrichten,
> die wie Fotos an den Track gepinnt werden.
> Stand: 2026-06-08.

---

## A. Geo-gestützte Erkennung („wo ich stehe, fließt die Elbe")

### Problem
Beim Foto von der Brücke fotografiert man eine *Aussicht*, kein einzelnes Objekt — ein breiter
Fluss sieht aus wie jeder Fluss. Reine Bilderkennung kann da kaum gewinnen. Gemini erkennt
Markantes (Frauenkirche) manchmal, Generisches (Elbe, eine konkrete Brücke, das „rote" Schloss
Moritzburg) zu unzuverlässig.

**Kernerkenntnis:** Der Tracker kennt bei jedem Foto den exakten Standort
(`tracker.html:1522` `currentLatLng()`), schickt ihn aber **nicht** mit
(`tracker.html:1569` sendet nur `{ image, mime }`). Gemini rät also blind. Sobald wir den Ort
als Kontext mitgeben, muss das Modell das Bild nur noch der Umgebung zuordnen statt zu raten.

### Lösung: Standort an den `identify`-Edge-Function mitgeben, Umgebung anreichern

**Zwei kostenlose, key-freie APIs** liefern den Orts-Kontext:

| API | Endpoint | Liefert | Deckt ab |
|---|---|---|---|
| **Wikipedia GeoSearch** | `https://de.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=LAT%7CLON&gsradius=600&gslimit=8&format=json` | geo-getaggte Artikel im Umkreis, nach Distanz sortiert | Schloss Moritzburg, Frauenkirche, Denkmäler, **Kunstwerke**, bekannte Bauten |
| **Overpass / OpenStreetMap** | `https://overpass-api.de/api/interpreter` (POST, kleine Query) | benannte Flüsse (`waterway=river`), Brücken (`man_made=bridge`/`bridge=yes`), Straßen, `tourism=artwork`, `historic=*` im Umkreis ~150 m | **„Elbe"**, konkrete **Brückennamen**, Straßen, Skulpturen |

Beide: gratis, kein API-Key, anonym. Wikipedia kennt das *Markante*, Overpass das *Benannte
direkt unter dir* (Fluss/Brücke), was Wikipedia oft nicht als eigenen Artikel hat.

### Datenfluss (neu)
1. **Client** (`identifyPhoto`, `tracker.html:1556`): `lat`/`lng` aus `currentLatLng()` mit in den
   POST-Body (`tracker.html:1569`) → `{ image, mime, lat, lng }`. **~3 Zeilen.**
2. **Edge-Function** (`supabase/functions/identify/index.ts`):
   - wenn `lat`/`lng` vorhanden → parallel Wikipedia-GeoSearch **und** eine kleine Overpass-Query
     feuern (beide mit `Promise.allSettled`, hartes Timeout ~2,5 s, Fehler = einfach weglassen).
   - aus den Treffern einen **deutschen Standort-Kontext** bauen, z. B.:
     > „Foto aufgenommen bei 51.0566, 13.7390. Direkt am/über dem Fluss **Elbe**; auf der
     > **Augustusbrücke**. In der Nähe: Frauenkirche (80 m), Brühlsche Terrasse (150 m),
     > Katholische Hofkirche (120 m)."
   - diesen Block **vor** `PROMPT_GENERIC` setzen, plus eine Zeile: *„Berücksichtige diesen
     Standort bei der Erkennung; wenn das Hauptmotiv ein benannter Fluss, eine Brücke, ein
     Bauwerk oder Kunstwerk aus der Liste ist, benenne es konkret."*
   - **Pl@ntNet-/Gemini-Logik bleibt unangetastet** — der Kontext erweitert nur den Prompt.

### Beispiele (die der Nutzer genannt hat)
- **Brücke über der Elbe** → Overpass findet `waterway=Elbe` + Brückenname → Gemini: „Du stehst
  auf der Augustusbrücke über der Elbe."
- **Rotes Schloss Moritzburg** → Wikipedia-GeoSearch liefert „Schloss Moritzburg" auf ~20 m.
- **Frauenkirche** → funktionierte teils, wird durch den Kontext zuverlässig.
- **Kunstwerke/Skulpturen** → Wikipedia + Overpass `tourism=artwork`.

### Aufwand
Client ~3 Zeilen, Server ~40 Zeilen (2 `fetch` + Kontext-Bau + Prompt-Erweiterung). Keine neue
Abhängigkeit, kein neuer Key.

### Notizen / Edge-Cases
- **Radius:** Wikipedia 600 m / Overpass ~150 m als Start; ggf. nachjustieren (Stadt vs. Land).
- **Sprache:** `de.wikipedia` für deutsche Namen; Fallback `en` bei 0 Treffern denkbar.
- **Robustheit:** beide Quellen optional — fällt eine aus, läuft die Erkennung wie heute weiter.
- **Caching (optional, später):** Treffer pro grobem Geo-Raster (~3 Nachkommastellen) kurz cachen
  → spart Calls, wenn man an einem Ort mehrere Fotos macht.
- **Privatsphäre:** an Wikipedia/OSM gehen nur anonyme Koordinaten (kein Bild, keine ID). Das Foto
  geht weiterhin nur an die eigene Edge-Function + Google/Pl@ntNet wie bisher.
- **Bonus ohne APIs:** schon das bloße Mitsenden von „lat, lon, Stadt" verbessert Gemini spürbar
  (das Modell hat Geo-Wissen) — die zwei APIs sind die zuverlässige Ausbaustufe.

### Kostenpflichtige Alternative
**Google Places Nearby** — sehr reiche POI-Daten, Google-Key ist vorhanden. Aber: Kosten pro Call
zusätzlich zu Gemini. Wikipedia + OSM decken Dresden/Sachsen exzellent ab → erst bei Lücken nehmen.

---

## B. Voice-Spur — Sprach-Nachrichten an den Track pinnen

> Wunsch: nicht nur **Fotos** an der aktuellen Position auf den Track setzen, sondern auch
> **Sprach-Nachrichten** aufnehmen und genauso als Wegpunkt anheften. (Doc: „Das ist toll.")

### Idee
Analog zur Foto-Spur ein zweiter Wegpunkt-Typ: an deiner aktuellen Position eine kurze Audio-Notiz
aufnehmen → Pin auf dem Track → antippen spielt sie ab. Perfekt für unterwegs: „Hier roch es nach
Bärlauch", „schöner Blick, später wiederkommen", Gedanken zur Tour — freihändig, ohne Tippen.

### UX
- **Zweiter FAB** neben der Kamera (`tracker.html:88` ist der Kamera-FAB `#cam-fab`): ein
  Mikrofon-FAB `#mic-fab`.
- **Aufnahme:** Tap startet, Tap stoppt (oder Push-to-talk via Long-Press). Während der Aufnahme
  ein kleiner Pegel/Timer. Stop → Wegpunkt wird an `currentLatLng()` gesetzt.
- **Pin:** eigenes Mikrofon-Icon (analog `CAM_PIN_SVG`, `tracker.html:1518`), damit Foto- und
  Voice-Pins auf der Karte unterscheidbar sind.
- **Abspielen:** Tap auf den Pin öffnet das Popup mit einem ▶︎-Player (+ Dauer); im View-Modus
  (`view.html`) genauso abspielbar.

### Datenmodell
Die Wegpunkte sind schon generisch (`tracker.html:372`
`waypoints = [{lat, lng, t, img, title, text, _marker}]`). Erweitern um:
- `type: 'photo' | 'voice'` (Default `'photo'` für Abwärtskompatibilität),
- `audio` (Base64/Opus-Data-URL) statt/neben `img`,
- `dur` (Sekunden), optional `text` = **Transkript** (s. u.).

Betroffene Stellen, die `img/title/text` schon durchreichen — dort `type/audio/dur` ergänzen:
`addWaypoint` (`tracker.html:964`, `:1451`), Speichern (`tracker.html:956`),
Live-Broadcast (`broadcastPhoto`/`broadcastPhotos`, `tracker.html:1044`/`:1047`),
Pin-Renderer `PhotoLayer.pinIcon` (`../js/photo-layer.js`).

### Wiederverwendung — es gibt schon einen Recorder im Repo!
`HTML/voicerecorder/js/` hat fertige, standalone Module: `recording.js` (MediaRecorder-Logik),
`idb.js` (IndexedDB-Speicherung), `webspeech.js` + `whisper.js` (Transkription). Statt neu zu bauen,
die Aufnahme-Logik daraus in ein kleines geteiltes Modul (`js/voice-note.js`) ziehen — Tracker und
voicerecorder teilen sich dann einen Recorder (passt zum Audit-Ziel „keine Doppel-Implementierung").

### Transkription (optional, aber stark)
Aufnahme durch **WebSpeech** (on-device, gratis) oder **Whisper** transkribieren → Transkript ins
`text`-Feld. Vorteile:
- Voice-Wegpunkte werden **durchsuchbar** und in der Track-Liste lesbar.
- Barrierearm + schneller Überblick, ohne jede Notiz abspielen zu müssen.

### Sync & Live
- **Sync:** wie Foto-Wegpunkte über Supabase. **Achtung:** Audio ist größer als ein
  herunterskaliertes JPEG → vor dem Upload als **Opus** kodieren + Länge begrenzen (z. B. ≤ 60 s),
  damit Storage/Bandbreite im Rahmen bleiben.
- **Live-Broadcast:** Voice-Notizen wie Fotos an Live-Viewer senden (`broadcastPhoto`-Pfad,
  `tracker.html:1044`).
- **RLS-Hinweis:** gleicher Storage-Bucket wie Fotos → dieselben Policies
  (`supabase/setup.sql`) gelten; im Audit als „world-writable, by-design E2E" notiert — bei
  Audio mitbedenken.

### Aufwand (grob)
Mittel: UI-FAB + Recorder-Einbindung (wiederverwendet) + Wegpunkt-Typ + Sync-Anpassung. Transkription
ist additiv und kann später kommen.

---

## Reihenfolge-Vorschlag
1. **A — Geo-Erkennung** zuerst (kleiner Eingriff, sofort spürbarer Nutzen unterwegs).
2. **B — Voice-Spur** als eigenes Feature danach; Recorder aus `voicerecorder/` wiederverwenden.

> Beides erst nach Doc's **go** umsetzen.
