# Tracker — Bug: Regenradar zeigt KEINEN Regen (Deutschland/DWD-Gebiet)

> Beobachtung von Doc, **live unterwegs**: Fahrt bei **Frankfurt durch ein extremes Regengebiet**,
> auf unserer Karte **null Regen / zero**. Dokumentiert, **noch nicht gefixt** (CLAUDE.md Regeln 2/4).
> Stand: 2026-06-10.

## Symptom
Es regnet real stark (Raum Frankfurt), der REGEN-Overlay zeigt aber **gar nichts** an dieser Stelle.

## Warum gerade in Deutschland verdächtig
Frankfurt liegt **innerhalb der deutschen DWD-Radar-Abdeckung**. Der Radar-Composite (`rain-radar.js`)
macht dort bewusst Folgendes (Z. ~141-142):
> „EU wird ÜBERALL gemalt, AUSSER innerhalb der deutschen Radar-Abdeckung; *innerhalb* nie EU."

Heißt: **innerhalb DE kommt ausschließlich die DWD-Quelle** (`dwd:Radar_rv_product_1x1km_ger`), der
RainViewer-Fill ist dort **abgeschaltet**. Ist die DWD-Quelle leer/stale → an genau dieser Stelle
**nichts**, obwohl RainViewer den Regen hätte.

## Verdächtige Ursachen (zu prüfen, grob nach Wahrscheinlichkeit)
1. **DWD liefert Kacheln, aber ohne Regen (stale/leer) — Health-Probe merkt's nicht.**
   `dwdHealthy`/`pickProvider` (Z. ~73-79, 107) fällt nur bei **hartem Ausfall** (HTTP 503/HTML) auf
   RainViewer zurück. „Kacheln laden, zeigen aber 0 Regen" gilt als **healthy** → kein Fallback → DE bleibt leer.
2. **Falscher/lehrer Frame.** Das DWD-Produkt ist ein **Nowcast/Forecast** (+0…+2 h). Der angezeigte
   „now"-Frame (`nowIdx`, `buildFrames('dwd')`, Z. ~455-465) könnte zeitlich danebenliegen oder leer sein.
   (Slider ist aktuell auskommentiert, Z. ~564-566 → man sieht nur den einen Frame.)
3. **Recolour-Schwelle** (`rvToRv` / `compositeDwdRv`, `rain-recolor.js`/`rain-palette.js`) verschluckt
   schwachen/mittleren Regen → Pixel werden transparent statt eingefärbt.
4. DWD-Geoserver-Wartung/Teilausfall (bekannter „REGEN-Bug 2026-06-09", Z. ~73-75) — Variante von (1).

## So eingrenzen (wenn jemand am Gerät ist, NICHT beim Fahren)
- **Taste `d`** im Tracker → erzwingt **RainViewer überall (inkl. DE)** (Z. ~660-664). Erscheint der
  Regen dann → Problem liegt im **DWD-Composite/Coverage-Pfad**, nicht an den Daten.
- **DebugWindow** lesen: „RainRadar: DWD-Probe → OK/DOWN", „… N Frames", „an (DWD +2h / RainViewer)".
- DWD-WMS-Frame direkt im Browser prüfen (`maps.dwd.de/geoserver/dwd/wms`, Layer
  `dwd:Radar_rv_product_1x1km_ger`) — zeigt der DWD selbst Regen über Frankfurt?

## Mögliche Fix-Richtung (noch nicht umgesetzt)
- Health-Check härten: nicht nur 503 prüfen, sondern auch **„DWD-Frame praktisch leer trotz Regen
  anderswo"** → dann auf RainViewer zurückfallen. Oder generell **RainViewer als Sicherheitsnetz
  innerhalb DE** zulassen, wenn DWD nichts/zu wenig liefert.
- Frame-Zeit gegen „echtes now" prüfen (stale-Erkennung).

## Dateien
- `HTML/js/rain-radar.js` (Composite, Coverage-Maske, `pickProvider`/`dwdHealthy`, `buildFrames`)
- `HTML/js/rain-recolor.js`, `HTML/js/rain-palette.js` (Farb-Ramp / Schwellen)
