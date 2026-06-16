# Tracker — Plan: Points of Interest (POI) · FEAT-24

> Quelle: [`../../ideen-wunsche.md`](../../ideen-wunsche.md) (Doc 2026-06-14): „Wir brauchen Points of Interest." 🔴 PRIO 0.
> **Noch NICHT gebaut** (CLAUDE.md Regeln 2/4) — erst bestätigt Doc Kategorien + Darstellung (offene Frage unten).

## ES — der Kern
POIs am Weg / auf der Karte (Sehenswürdigkeiten, Aussichtspunkte, Historisches, Natur …) als **Karten-Pins**,
antippbar → Info + Button **„Navi hierhin"**. Daten **gratis & keyless** über Overpass/OSM + Wikipedia (Regel 18).
Tankstellen sind **schon** ein POI-Layer (`tracker-fuel.js`, FEAT-26) → Vorbild + bleiben vorerst separat.

## Neues Modul: `HTML/js/tracker-poi.js`
**Vorlage 1:1 kopieren: `tracker-fuel.js`** — das ist bereits ein POI-Overlay (nearby holen → Pins → Toggle →
throttled `.update(here)`). Tankerkönig-Spezifika rausräumen, auf Overpass-Kategorien generalisieren.
- `window.TrackerPoi(ctx)`, `ctx = { map, toast, COL_GREEN, COL_ORANGE, COL_RED }` (wie fuel).
- Einhängen: in die `document.write`-Skriptliste in `tracker.html` (neben `tracker-fuel.js`);
  `__poi = TrackerPoi({ ... })` in `tracker.js` (wie `__fuel`/`__nav`, ~Z. 1849);
  `if (__poi) __poi.update(here)` in `onPosition()` (wie `__fuel.update`, ~Z. 718), throttled.

## Datenquellen (gratis, kein Key — Regel 18)
- **Overpass/OSM** (nutzt `tracker-speedlimit.js` schon): POIs in der sichtbaren Karten-BBox bzw. Radius um die
  Position. Tags:
  - `tourism` = attraction · viewpoint · museum · artwork · picnic_site
  - `historic` = monument · memorial · castle · ruins · archaeological_site
  - `natural`  = peak · waterfall · spring
  - (`amenity=fuel` = Tankstellen → schon `tracker-fuel.js`, separat lassen)
- **Wikipedia Geosearch/Extract** (wie die `identify`-Edge-Fn, aber **client-seitig**: `api.php?...&origin=*`,
  CORS-offen, keyless): beim Antippen eines POI einen Intro-Absatz nachladen.

## Lade-Strategie (Overpass schonen)
- Trigger: `map.on('moveend')` debounced **oder** `__poi.update(here)` throttled — wie fuel (`REFRESH_MS` +
  `REFRESH_MOVE_M`) bzw. wie speedlimit (`MIN_INTERVAL_MS`).
- BBox/Radius-Query, **Top-N** nach Wichtigkeit (OSM-Tag-Rang / Wikipedia-Treffer) → kein Pin-Teppich.
- Cache je BBox; Anti-Reflow: nur neu zeichnen, wenn sich das Set ändert.

## Darstellung
- **Karten-Pins** im Tracker-Stil (Pin-Layer wie `photo-layer.js` / fuel-Marker), Kategorie-Icon + Farbe (λ/φ/Υ).
- Tap → kleines Panel/Popup: **Name · Typ · Entfernung** · (Wikipedia-Absatz, Stufe 2) · **Button „Navi hierhin"**.
- Toggle **„POI an/aus" im Radial-Menü** (`mb-poi`, grün wenn an, persistiert `trk-poi-on`) — exakt wie REGEN/SMOOTH.
- Kategorie-Filter (Geschichte / Natur / Sehenswürdig / Aussicht): Stufe 2.

## Geteiltes Primitiv mit FEAT-25 / 3 / 4: „Pin → Navi-Ziel"
„Navi hierhin" braucht einen **public Einstieg in `tracker-nav.js`**, der heute fehlt — Navigation ist aktuell nur
adressbasiert (`setDestination`, `nav-set`-Button). Return ist `{ openPanel, hasDestination, startNavigation,
clearRoute, update, remainingBounds }`.
→ **Einmal** `navigateTo([lat,lng], name)` ergänzen (Route via OSRM + Banner/Voice wie gehabt) und exportieren.
Das bedient dann **POI-Tap (FEAT-24)**, **manuellen Pin (FEAT-25)**, **Parkplatz (FEAT-3)** und
**Zurück-zum-Auto (FEAT-4)** — nicht viermal bauen.

## MVP → Ausbau
- **MVP (Stufe 1):** `tracker-poi.js`, Overpass-BBox (debounced/throttled, Top-N), Pins im Stil, Tap→Panel
  (Name/Typ/Distanz) + „Navi hierhin" (via neues `navigateTo`), Radial-Toggle persistiert. Keyless.
- **Stufe 2:** Kategorie-Filter-UI, Wikipedia-Absatz im Panel, Clustering/Ranking, „voraus im Fahrt-Korridor"
  (Bearing aus zwei Fixes) statt nur BBox, Tankstellen als Kategorie einfügen.
- **Stufe 3:** **Audio am Weg = WegCast** ([`drivecast-audio-poi-am-weg.md`](drivecast-audio-poi-am-weg.md), eigenes
  Feature), eigene alte Foto-/Voice-Waypoints als POI-Quelle.

## Akzeptanz/Test
POI-Toggle an → in einer Stadt erscheinen sinnvolle Pins (nicht überladen); Tap zeigt Name/Typ/Distanz;
„Navi hierhin" routet (Banner/Voice); Toggle aus = Pins weg; Overpass-Last gedeckelt (DEBUG zeigt Query-Takt);
**kein Key im Client** (Regel 18).

## Offene Frage an Doc (vor dem Bauen)
**Kategorien + Darstellung.** Empfehlung: **Karten-Pins** + Default-Kategorien *Sehenswürdigkeiten /
Aussichtspunkte / Historisches / Natur* (Tankstellen separat über das vorhandene Modul). Passt das — oder eher
eine **Liste** „POIs in der Nähe", oder zielst Du auf **Audio am Weg** (= WegCast, größeres Stufe-3-Thema)?

## Andockpunkte (verifiziert 2026-06-14)
- Skelett: `tracker-fuel.js` — `window.TrackerFuel(ctx)`, `ensureLayer()` (L.layerGroup), Throttle
  (`REFRESH_MS`/`REFRESH_MOVE_M`), Toggle `trk-fuel-on`, `.update(here)`.
- Overpass + Throttle + Geometrie-Pick: `tracker-speedlimit.js`.
- Pins/Marker: `photo-layer.js` / fuel-Marker.
- Navigation: `tracker-nav.js` (Return s. o.) — **`navigateTo` ergänzen**.
- Mount/Update: `__fuel = TrackerFuel({...})` (~`tracker.js:1849`), `__fuel.update(here)` (~`:718`);
  Radial-Toggle wie `mb-smooth` / `mb-rain` (`.classList.toggle('active', on)`).
