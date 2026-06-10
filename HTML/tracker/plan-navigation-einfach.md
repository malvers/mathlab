# Tracker — Plan: Einfache Navigation (Adresse → Route + Tracking)

> Plan-/Konzept-Notiz. **MVP gebaut am 2026-06-10** (Modul `HTML/js/tracker-nav.js`, Radial-Eintrag
> „ZIEL", Panel `#nav-panel`, START navigiert + trackt, STOP räumt auf). Post-MVP unten offen.
> Stand: 2026-06-10.
> Entstanden auf der Fahrt nach Bad Homburg (siehe `../../fahrt-bad-homburg-2026-06-10.md`).
> Ziel laut Doc: **ganz einfach** — Stadt, Straße, Hausnummer → Route. Kein POI-Auswählen, kein Schnickschnack.

---

## Kernidee (von Doc)
- Man gibt eine **Adresse** ein und drückt **START** → es wird **navigiert UND getrackt** (in einem).
- Kein Ziel gesetzt → START = **nur tracken** (heutiges Verhalten, **unverändert**).
- Bewusst minimal: keine Sehenswürdigkeiten, keine Auswahl-Listen.

## UI / Menü (so machen wir's — bestätigt)
- **Neuer Radial-Eintrag „ZIEL"** im bestehenden Halbkreis-Menü (neben LADEN/SHARE/…).
  - Reiht sich in `#mini-stack` + `trackerMenuLayout()` ein (tracker.js); Style = `mini-btn`.
- Öffnet ein **Overlay-Panel** (`ov-panel`, wie Einstellungen/Live): Adress-Eingabe + „Ziel setzen" + „Ziel löschen".
- Gesetztes Ziel bleibt sichtbar (Ziel-Pin auf der Karte), bis man es löscht oder STOP drückt.

## Ablauf
1. Menü → **ZIEL** → Adresse eintippen → **Ziel setzen** (Geocoding, Ziel-Pin erscheint).
2. **START** drücken:
   - Ziel vorhanden → Route von aktueller Position zum Ziel berechnen + zeichnen, **gleichzeitig Aufzeichnung an**.
   - Kein Ziel → normale Aufzeichnung.
3. **STOP** → Aufzeichnung beenden (wie bisher) **+ Route/Ziel-Pin aufräumen**.

## MVP-Umfang („ganz einfach")
- Zeigt: **Route-Linie** (eigene Farbe), **Ziel-Pin**, **Distanz + Fahrzeit (ETA)**.
- Karte **folgt** der Position (vorhandener Follow-/FIT-Modus reicht).
- **Kein** Re-Routing bei Abweichung, **kein** Verkehr, **keine** POI, **keine** Abbiege-Liste.

## Technik (gratis, kein API-Key, additiv — Regel 18 beachten)
- **Geocoding:** Nominatim (`nominatim.openstreetmap.org/search`) — Adresse → lat/lng.
- **Routing:** OSRM (`router.project-osrm.org`, Profil **driving**) — Geometrie + Distanz/Dauer.
- Neues, isoliertes Modul **`HTML/js/tracker-nav.js`** (in die `document.write`-Liste in tracker.html),
  bekommt `map` / aktuelle Position / `toast` / `showPanel` wie die anderen Module.
- Route als eigene `L.polyline`/`L.geoJSON`-Ebene; Ziel als `L.marker`. Sauber entfernbar bei STOP.

## Offene Punkte (Default gesetzt, kann Doc noch kippen)
1. **Eingabe: drei Felder vs. ein Suchfeld.** *Default:* **drei Felder** (Stadt · Straße · Hausnr.),
   wie Doc es beschrieben hat. Alternative: ein einzelnes Feld („Straße Nr, Stadt") — fehlertoleranter.
2. **Bei Ankunft Tracking automatisch stoppen?** *Default:* **nein** — nur Toast „angekommen",
   Doc drückt STOP selbst (weniger Überraschung mid-trip).
3. **Fahr-Profil:** *Default:* **driving** (Auto). Später ggf. an Activity-Erkennung koppeln.

## Nachgebaut (2026-06-10)
- **Re-Routing bei Abweichung:** Off-Route-Erkennung (Abstand Position↔Route > 45 m) → automatische
  Neuberechnung via `update()` (gedrosselt: max. 1 OSRM-Anfrage / 8 s). Gefüttert vom GPS-Fix in `onPosition()`.

## Post-MVP (bestätigt „cool, aber nicht jetzt")
- **Sprach-Ansage** der Abbiegungen (`speechSynthesis`) — passt zu `../../wunsch-antworten-vorlesen.md`.
- Verkehr (Autobahn-API/TomTom/HERE — siehe Fahrt-Notiz) · Abbiege-Liste.
