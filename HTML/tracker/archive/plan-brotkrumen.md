# Tracker — Plan: Brotkrumen zurück (offline) · Idee #5, Prio 1

> Plan-Notiz, **noch nicht gebaut** (CLAUDE.md 2/4). Stand 2026-06-10.
> Sicherheits-Feature („bring mich heim") → **muss zuverlässig sein**, vor Live-Einsatz testen.

## Ziel
Verläuft man sich beim Wandern **ohne Netz**, führt der Tracker einen entlang der **eigenen aufgezeichneten Spur** zurück zum Start. Komplett **offline**: kein Router (OSRM), keine Karten-Tiles — nur die schon vorhandenen Track-Punkte.

## Abgrenzung zu Idee #1 (Zurück zum Start / Auto)
- **#1** routet *online* (OSRM) auf Straßen zu einem Ziel — gut im Auto/Stadt.
- **#5 (dies)** folgt der *eigenen Spur* rückwärts, **offline** — gut beim Wandern/im Funkloch. Andere Datenquelle, gleiche Präsentation (Banner/Pfeil/Voice) wie `tracker-nav.js`.

## Datenbasis (ist schon da, tracker.js)
- `track = [[lat,lng], …]` (Z. 184) — die Brotkrumen. Parallel: `times/alts/speeds`.
- `posMarker` = Live-Position; `lastFix = {lat,lng,t}`; `bearing` aus `bearingBetween(...)` (Z. 520).
- `haversine = TrackRender.haversine` (Z. 352) — Segment-/Luftlinien-Distanz.
- Funktioniert für **laufende Aufzeichnung** *und* **geladenen Track** (Start = `track[0]`).

## Algorithmus (offline, ~O(1) pro Fix)
1. **Vorberechnen (einmal beim Aktivieren):** kumulative Distanz `cum[i] = Σ haversine(track[0..i])`. Damit ist „Reststrecke entlang der Spur" in O(1).
2. **Snap pro Fix:** nächsten Punkt auf der Spur zur aktuellen Position finden. Genauer: nächster Punkt auf dem nächsten *Segment* (Projektion), nicht nur nächster Vertex. Suche **fenstern** um den letzten Snap-Index (±N) → O(1) amortisiert statt O(n).
3. **Reststrecke** = `cum[snapIdx]` + Teilstück bis zum projizierten Punkt (Richtung `track[0]` = Start). Anzeige: „↩ 320 m zurück".
4. **Nächste Krume** = Punkt ~15–30 m *zurück* entlang der Spur (Index Richtung 0), nicht der direkt nächste Vertex → stabiler Pfeil, kein Zittern.
5. **Richtung** = `bearingBetween(pos, nächste-Krume)` → Pfeil (Kompass-Nadel-Stil wiederverwenden) + optional Voice.
6. **Off-Track-Sicherung:** ist die Snap-Distanz > ~30 m, erst „zurück auf die Spur" (Pfeil zum nächsten Spurpunkt), dann normale Rückführung. *Das* ist der Sicherheits-Teil.
7. **„Start erreicht"** wenn `haversine(pos, track[0]) < ~15 m` (oder Rest < Schwelle): Banner/Voice „Start erreicht", Modus aus.

## UX
- **Toggle** „🏠 Heim / Brotkrumen" — im Radial-Menü (oder eigener FAB, links unten passend zur Spalte).
- **Banner** wie `#nav-banner`: „↩ 320 m · zurück zum Start" + Richtungspfeil.
- **Rest-Spur hervorheben** (eigene Farbe, z. B. Brotkrumen-Gelb/`COL_ROUTE`-Blau) über der normalen Track-Linie.
- **Voice** optional (speechSynthesis wie Navi) — an/aus; Hinweis: manche Android-TTS brauchen Daten → offline ggf. stumm, Pfeil+Distanz tragen die Funktion allein.

## Neues Modul + Touch-Points
- **`HTML/js/tracker-breadcrumb.js`** — `window.TrackerBreadcrumb(ctx)`, **Architektur 1:1 wie `tracker-nav.js`**: eigene Leaflet-Layer (Rest-Spur + „Start"-Pin), eigenes Banner/UI, `start(track)`, `update([lat,lng])`, `stop()`. Kein Fetch, keine Tiles.
- **tracker.html:** Script in die Ladeliste; Toggle-Button + Banner-Element.
- **tracker.css:** Banner/Pfeil/Toggle (zentral, Regel 7).
- **tracker.js (Core):** beim Toggle `TrackerBreadcrumb.start(track)`, pro Fix `update(here)` füttern (analog zu `TrackerNav.update`).
- **Renderer/GPX:** unberührt.

## Sensorik: GPS vs. Beschleunigung (Doc-Frage 2026-06-10)
- **GPS ist Pflicht und die Wahrheit.** Die Brotkrumen *sind* GPS-Punkte; ohne GPS keine Spur und keine absolute Position zum Snappen.
- **Rein aus Beschleunigung geht NICHT:** Position = zweifach integriert → Bias/Rauschen wächst quadratisch, nach ~1 min schon zig–hunderte Meter Drift → für „bring mich heim" unbrauchbar.
- **IMU nur als Ergänzung:** Jitter im Stand glätten (Motion-Gate, schon da) · kurze GPS-Lücken per Pedestrian Dead Reckoning (Schritte × Schrittlänge + Kompass-Heading) überbrücken (v2, optional) · Kompass liefert die Pfeilrichtung. **Nie** als GPS-Ersatz.

## Zuverlässigkeit / Tests (Doc: Sicherheits-Feature!)
Vor Live-Einsatz durchgehen:
- Out-and-back gerade · Schleife (Start=Ende) · verzweigte/überkreuzte Spur (Snap darf nicht „springen") · GPS-Jitter im Stand · weit **off-track** → Recovery · „Start erreicht"-Schwelle · sehr langer Track (Performance) · geladener vs. live aufgezeichneter Track · komplett offline (Flugmodus).
- Fallback nie „kein Foto/keine Richtung verlieren": bei leerem/zu kurzem Track → Toggle deaktiviert + Hinweis.
- **App-Reload mitten im Heim-Modus** → Modus + Snap-Index wiederherstellen (aktiv-Flag + Index in Crash-Buffer/localStorage); ein Sicherheits-Feature darf einen Neustart nicht „vergessen".

## Offene Fragen / Optionen
- Snap: nur Vertex (einfach) vs. Segment-Projektion (genauer) — **Segment** empfohlen für Genauigkeit.
- Pfeil: relativ zur Geh-Richtung (braucht Heading/Kompass) vs. absoluter Nord-Bezug. Heading ist beim Stehen unzuverlässig → Pfeil zum Zielpunkt absolut + Karte nordrichtig lassen.
- Reicht „entlang der eigenen Spur", oder später optional „Luftlinie abkürzen, wenn sichtbar näher"? (V1: strikt entlang der Spur = sicher.)

## Reihenfolge
1. Modul-Gerüst (`TrackerBreadcrumb`), Toggle, Banner.
2. `cum[]` + Snap (Segment, gefenstert) + Reststrecke.
3. Nächste-Krume + Pfeil + „Start erreicht".
4. Off-Track-Recovery.
5. Rest-Spur-Highlight + (optional) Voice.
6. **Testmatrix** (oben) im Feld, dann erst „scharf".

Gehört zu [[project_tracker_lab]]; verwandt mit Idee #1 (online Navi, `plan-navigation-einfach.md`) und #12 (Offline-Karten).
