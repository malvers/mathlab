# Reroute-Recherche: Wie Google & Co. das „Zurückziehen auf die alte Route" vermeiden

**Anlass (Doc 2026-06-25):** Beim absichtlichen Abweichen zog das Navi auf die alte Route zurück
(„bitte wenden" / 2,3 km vor und dann wenden). Frage: Wie macht Google das? Gesuchter Fachbegriff
war „prohibited area (?)".

**Kurzantwort zum Begriff:** Der Begriff heißt je nach Engine **„avoid area / exclude polygon"**
(ORS `avoid_polygons`, Valhalla `exclude_polygons` / `exclude_locations`, GraphHopper `block_area`).
ABER: Avoid-Area ist eigentlich für **Sperrungen** (Hochwasser, Baustelle) gedacht — es ist **nicht**
der eigentliche Mechanismus gegen das Zurückziehen. Das Zurückziehen lösen echte Navi-Engines mit
drei anderen Dingen (siehe unten).

---

## 1. Wie Google / Waze / Mapbox / TomTom es wirklich machen

**(a) Frische Route von der AKTUELLEN Position zum Ziel — nie „zurück auf die alte Linie".**
Mapbox/Google-SDK: „if a user is off-route, a new route is generated from their current location to
the next waypoint." Es wird **kein** Zurückführen auf die verworfene Polylinie versucht — immer neu
zum Ziel. (Das macht unser Tracker seit dem Bearing-Aus auch schon: `computeRoute(here → dest)`.)

**(b) Abfahrtsrichtung mit Toleranz (Heading + Heading-Tolerance), NICHT als harter Kegel.**
Valhalla: `heading` + `heading_tolerance` (**Default 60°**, nicht 90°). Damit fährt die neue Route in
Fahrtrichtung ab → kein sofortiger U-Turn auf dieselbe Straße. Wichtig: 60° ist enger als unser
früherer ±90°-Kegel, der am Kreisverkehr kippte (zwang „vorwärts" statt sofort rum).

**(c) „Initial Maneuver Avoidance Radius" — DER Schlüssel gegen abrupte U-Turns.**
Mapbox SDK: `initialManeuverAvoidanceRadius` = Radius um die aktuelle Position, in dem die Reroute
**kein** nennenswertes Manöver zurückgibt. **Default = 8 Sekunden × aktuelle Geschwindigkeit**
(bei 50 km/h ≈ 110 m, bei 100 km/h ≈ 220 m). Begründung im Mapbox-Issue #34: „if a user was driving
at high speed and missed a turn, the SDK would trigger a re-route requiring another turn or U-turn
almost immediately, which would be too much to act on at that speed." → Genau unser Problem.
Die neue Route darf also erst NACH diesem Radius das erste Manöver haben.

**(d) U-Turn-/Manöver-Strafkosten im Straßengraphen.**
Valhalla auto-costing: `maneuver_penalty` (Default 5 s) u. a. Wenden ist teuer, aber erlaubt, wenn es
deutlich besser ist (Sackgasse) → die Engine entscheidet, statt mit einem starren Kegel.

**(e) Side-of-road / U-Turn-Vermeidung am Ziel.**
Google Route-Optimization: `avoidUTurns` + `sideOfRoad` → nähert sich dem Ziel von der richtigen
Seite, spart das Wenden direkt am Ziel. „Best-effort" (Sackgasse erzwingt trotzdem Wenden).

**(f) Map-Matching (HMM) als Grundlage.**
Vor jedem Reroute wird die Rohposition per Hidden-Markov-Map-Matching auf das **richtige
Straßensegment + Richtung** gesnappt. Erst auf dieser sauberen Basis wird neu geroutet → keine
Phantom-U-Turns durch GPS-Rauschen.

---

## 2. Engine-Vergleich (für unseren Stack relevant)

| Feature | OSRM (FOSSGIS, was wir nutzen) | Valhalla | GraphHopper | OpenRouteService |
|---|---|---|---|---|
| Avoid area / „prohibited area" | **❎ nein** | ✔ `exclude_polygons` | ✔ `block_area` / custom_model | ✔ `avoid_polygons` |
| Einzelne Straßen ausschließen | ❎ (nur Klassen via `exclude=`) | ✔ `exclude_locations` (schnell) | ✔ | (begrenzt) |
| Abfahrtsrichtung | `bearings=value,range;` (harter Kegel) | `heading` + `heading_tolerance` (Default 60°) | `heading` | `bearings` |
| U-Turn-/Manöver-Strafe | begrenzt (`continue_straight`) | ✔ `maneuver_penalty` u. a. | ✔ | ✔ |
| Initial-Maneuver-Radius | ❎ (selbst nachbauen) | — (über heading/penalty) | — | — |

**Fazit Stack:** Auf der öffentlichen **OSRM**-Instanz fehlt das Entscheidende (Avoid-Area,
Heading-Tolerance, U-Turn-Kosten, Initial-Maneuver-Radius). Wir haben nur den groben Bearing-Kegel —
genau der kippte am Kreisverkehr.

---

## 3. Empfehlung für unseren Tracker (priorisiert)

**A. Sofort, ohne Infra (OSRM behalten) — `initialManeuverAvoidanceRadius` nachbauen.**
Bei Off-Route nicht nur `here → dest` routen, sondern einen **kurzen Via-Punkt** ~`8 s × v` (≈ 80–200 m)
**auf der Straße, auf der man fährt** voraus setzen, dann zum Ziel. Effekt: die neue Route MUSS den
ersten Abschnitt vorwärts fahren → kein sofortiges Wenden, kein „2,3 km dann U-Turn" am Kreisverkehr.
*Achtung:* der frühere Via-Versuch (Commit 5453259, revertet) nahm **450 m entlang der GPS-Peilung** und
snappte oft auf die falsche Straße. Richtig: **kurz** (speed-abhängig) und über OSRM `nearest`/die
gefahrene Geometrie an die echte Straße snappen, nicht die Luftlinien-Peilung. **Muss im Feld getestet
werden** (mit dem Sim reproduzierbar).

**B. Richtig (Google-nah) — Reroute auf Valhalla oder ORS umstellen.**
Über eine **Supabase-Edge-Function als Proxy** (Key bleibt serverseitig, kein Secret im Repo — wie bei
Tankerkönig/TomTom). Dann nutzbar:
- `heading` + `heading_tolerance≈60°` → saubere Abfahrtsrichtung ohne Kegel-Kippen,
- `maneuver_penalty` → Wenden nur wenn wirklich besser,
- `exclude_polygons` / `exclude_locations` → die gerade **abgelehnte Straße** gezielt sperren, damit der
  Reroute eine echte Alternative vorwärts sucht statt zurück (das ist der „prohibited area"-Hebel,
  wenn man ihn DOCH will).
Kandidaten-Endpunkte: Valhalla (Stadia Maps / FOSSGIS), ORS (eigener Key, großzügiges Free-Tier).

**C. Map-Matching vorschalten** (mittel-aufwändig): Position vor dem Reroute snappen (OSRM hat einen
`/match`-Service) → weniger Phantom-Reroutes durch Rauschen.

**Reihenfolge:** erst **A** (billig, im Feld/Sim testen) → wenn nicht gut genug, **B** (der echte Fix).

---

## 4. Bezug zum aktuellen Code
- `HTML/js/tracker-nav.js`: `computeRoute(from, reroute, brg)` + `update()`. Bearing-Kegel steckt hinter
  `USE_DEPART_BEARING` (aktuell **false**, weil er am Kreisverkehr kippte). Für Variante A käme der
  kurze Via-Punkt in `computeRoute`.
- Testbar am Tisch mit `HTML/js/tracker-navsim.js` (`?sim=1`, „Abweichen"-Klick).
- Siehe auch `HTML/tracker/bugfixes.md` → BUG-15.

## 5. Quellen
- Mapbox, „Prevent abrupt re-routing / immediate u-turns" (Issue #34) + Rerouting-Guide
  (`initialManeuverAvoidanceRadius`, 8 s × v).
- Mapbox/Google/TomTom Navigation-SDK-Docs: „off-route → new route from current location to next waypoint".
- Valhalla API-Reference: `exclude_polygons`, `exclude_locations`, `heading`/`heading_tolerance` (Def. 60°),
  `maneuver_penalty`.
- OpenRouteService Routing-Options: `avoid_polygons`.
- gis-ops „FOSS routing engines overview": OSRM ❎ Avoid-Area; Valhalla/GraphHopper/ORS ✔.
- Google Route-Optimization: `avoidUTurns`, `sideOfRoad`.
- OSRM Issues #4011/#3944/#5963/#1827: bearings vs continue_straight, U-Turn-Kontrolle begrenzt.
