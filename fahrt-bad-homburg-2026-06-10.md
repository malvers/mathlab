# Fahrt Bad Homburg — Notizen & Recherche (2026-06-10)

> **Für Agents:** Gedanken/Recherche, die Doc unterwegs (im Auto) diktiert hat. Festgehalten, damit
> nichts verloren geht — **noch nicht gebaut/entschieden** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.

---

## 1. Apple-Patent: Touchscreen 3D/haptisch machen
Frage Doc: erteilt? wann? haben sie beschrieben, *wie*?

- **Ja, erteilt.** Kern-Patent **US 9,600,070 — „User interface having changeable topography"**,
  erteilt **21. März 2017**.
- **Wie (ja, offengelegt):** **elektromechanische Aktuatoren unter dem Display** drücken/ziehen eine
  **verformbare Oberfläche** → echte Grate, Beulen, fühlbare Tasten; Höhe/Textur/3D-Form dynamisch.
- **Ganze Patent-Familie**, nicht nur eins:
  - **Textur + Temperatur** simulieren über Vibrationsmuster (rau/glatt, „warmes Holz vs. kaltes Metall").
  - **Elektromagnete**, die das Deckglas je nach Eingabe anziehen/abstoßen.
  - **MacBook mit morphender Touch-Tastatur** (Tasten heben sich aus dem Glas) — eigenes, ~2022 erteilt.
- **Stand:** alles **Patente/Forschung**, **kein Serienprodukt**. Mechanismen gesichert & beschrieben,
  gebaut/verkauft wird so ein 3D-Screen bisher nicht.
- Quellen: AppleInsider (21.03.2017, 9,600,070) · Cult of Mac (Textur/Temperatur) · Digital Trends
  (morphende MacBook-Tastatur).

## 2. Navigation in den Tracker einbauen (à la Google Maps) — Aufwand
- **Halbe Miete da:** Leaflet-Karte, GPS-Position, OSM-Tiles, Folgen-Modus. Fehlt nur **Routing**.
- **MVP klein (~1–2 Tage):**
  - Routing-Engine **nicht selbst bauen** → Dienst: **OSRM** (gratis/self-host), GraphHopper, Mapbox, Valhalla.
  - Plugin **`leaflet-routing-machine`** → Route zeichnen + Abbiege-Liste fast geschenkt.
  - Ziel-Suche: **Nominatim** (Geocoding).
  - Sprach-Ansagen: **`speechSynthesis`** (passt zum Vorlese-Wunsch, siehe `wunsch-antworten-vorlesen.md`).
- **Teuer/groß (echtes Google-Maps-Niveau):** Live-Re-Routing, Verkehr/Stau, präzise ETA, Spurassistent,
  Offline-Karten, Rate-Limits/Kosten, **Hintergrund-Navi nur nativ** (Web friert bei Sperrbildschirm ein).
- **Fazit:** „Tipp Ziel → Route + Linie + Abbiegehinweise + Sprache" = **klein**; Vollniveau = **groß**.

## 3. Woher Verkehrsinformationen?
- **Echter Live-Fluss (farbiger Stau) = praktisch kommerziell:**
  - **Google**-Traffic proprietär (Crowd-Daten), nicht frei nutzbar.
  - Lizenzierbar: **TomTom**, **HERE** (beliefern Autohersteller), **Mapbox** — alle **Freemium**, dann Bezahl-API.
  - Grund: Fluss-Daten brauchen **Probe-/Flottendaten** → teuer, kaum gratis.
- **Frei/offen — aber nur Ereignisse, kein Fluss:**
  - **Autobahn GmbH (DE):** offene API mit Baustellen, Sperrungen, Verkehrsmeldungen, Webcams — gratis, kein Key.
  - **DATEX II** (EU-Standard): Unfälle/Baustellen vieler Straßenbehörden.
  - **Mobilithek (DE, früher MDM):** offizielle Mobilitäts-/Verkehrsdaten, teils kostenlos.
- **Fazit für uns:** Baustellen/Sperrungen/Meldungen → **gratis machbar**; farbiger Echtzeit-Stau →
  realistisch nur über **TomTom/HERE-Freemium**, Google eher nicht.

---

### Verwandte Notizen aus derselben Session
- `HTML/tracker/drivecast-audio-poi-am-weg.md` — Audio-Sehenswürdigkeiten am Weg (WegCast).
- `wunsch-antworten-vorlesen.md` — Agent-Antworten vorlesen (hände-frei beim Fahren).
- Übersicht aller Ideen/Notizen: `NOTES.md`.
