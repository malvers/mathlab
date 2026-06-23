# Tracker — Ideen-Triage (für Subagenten)

> **Zweck:** Das prioritisierte Ideen-Board. **Die kanonische Volltext-Beschreibung jeder Idee liegt (archiviert)
> in [`archive/tracker-ideen.md`](archive/tracker-ideen.md)** (16 Ideen, von Doc unterwegs durchgegangen) und in
> den verlinkten Konzept-Notizen — diese Datei **dupliziert nicht**, sondern sortiert nach Prio/Status und
> sagt, wohin eine Idee gewandert ist (z. B. „→ als Arbeitsauftrag in `feature-requests.md`").
> Erstellt 2026-06-12. Doc zu allen 16: „Im Allgemeinen waren alle Ideen gut, es ging nur um die Priorität."

## ⚡ Kurz-Übersicht — offene Ideen (noch nicht zu Features promotet)
- 2 Live-ETA · 3 Reise-Album (PDF) · 4 Schätz-Spiel · 6 Tour-Generator nach Zeit · 7 Heatmap
- 8 Routen-Geometrie/Statistik · 9 Pokédex · 12 Offline-Karten · 14 3D-Geländekarte · 15 Live-Video
- 16 Vektor-Karten (Enabler) · WegCast (Audio-POI) · Cluster-Hülle-Hover · Antworten vorlesen
- Geo-Erkennung+Voice · Pflanzen-DB · E2E-Verschlüsselung · Update-Hinweis · Solita-Name/Weckwort
- Lebens-Agent/Kompression · Play-Store-Verteilung
> (Prio-Board + Status-Tabelle unten; Volltext in `archive/tracker-ideen.md`. Ideen 1/5/10/11/13/17/19/20 sind schon Features.)

## Für Subagenten
- Eine Idee ist **noch kein Bau-Auftrag** (CLAUDE.md Regel 2/4). Ideen reifen hier → werden bei Doc-„go" zu
  Einträgen in [`feature-requests.md`](feature-requests.md).
- Soll eine Idee **geschärft** werden (Recherche/Spez), das Ergebnis in **ihre** Notiz schreiben (single
  source of truth, Memory `feedback_single_source_of_truth`), nicht hier duplizieren.
- „(Doc)" = Prio von Doc gesetzt · „(Vorschlag)" = Agenten-Vorschlag, Doc kann kippen.

> ✅ **Quellen:** Ideen 17–20 + die neuen Notizen (Solita, Remote-Config, Contact-AI, Play-Store,
> Lebens-Agent) aus der OTWA-Session **2026-06-11** wurden **am 2026-06-12 in `main` gemerged**
> (Merge `48dc37e`) — die mit `🌿` markierten Notizen sind jetzt **lokal vorhanden**.

## Prioritäts-Skizze (aus `archive/tracker-ideen.md`)
| Prio | Ideen |
|---|---|
| **1 — bald** | 5 Brotkrumen *(Doc)* · 13 Goldene Stunde *(Doc)* · 1 Zurück zum Start · 10 Regen-Vorwarnung · 11 Parkplatz merken · **17 Navi-Blau+Speed** *(Doc)* · **19 App live fernsteuern** *(Doc)* |
| **2 — danach** | 4 Schätz-Spiel *(Doc)* · 7 Heatmap *(Doc)* · 9 Pokédex *(Doc)* · 12 Offline-Karten *(Doc)* · 2 Live-ETA · 3 Reise-Album · 8 Geometrie & Stats · **18 Lane Guidance** |
| **3 — groß/Wow** | 6 Tour-Generator nach Zeit · 14 3D-Geländekarte |
| **4 — später/Infra** | 15 Live-Video-Broadcast *(Doc)* |
| **Future Now** | **20 Contact AI** (Agent direkt aus der App, „Solita") |
| **Enabler** | 16 Vektor-Karten (MapLibre) — schaltet 12 + 14 frei |

---

## Status der 16 Ideen
> Volltext je Idee: [`archive/tracker-ideen.md`](archive/tracker-ideen.md) (gleiche Nummerierung).

| # | Idee | Prio | Status / wohin |
|---|---|---|---|
| 1 | Zurück zum Start / zum Auto | 1 | **→ `feature-requests.md` FEAT-4** (online OSRM) |
| 2 | „Triff mich" / Live-ETA teilen | 2 | 💡 offen — baut auf Live-Broadcast; ETA als Ankunfts-Uhrzeit |
| 3 | Auto-Reise-Album (PDF/Storybook, Wandern) | 2 | 💡 offen — schönes Layout; mit #9 verbinden |
| 4 | Schätz-Spiel unterwegs (Kids/Mathe) | 2 | 💡 offen — Mathe-Labor-DNA |
| 5 | Brotkrumen zurück (offline) | 1 | **→ `feature-requests.md` FEAT-1** + Voll-Spez [`archive/plan-brotkrumen.md`](archive/plan-brotkrumen.md) |
| 6 | Tour-Generator nach ZEIT (49-Mile-Drive) | 3 | 💡 offen — POI-Routing aufwändig; nutzt `drivecast-…`-POIs |
| 7 | Heatmap „wo war ich überall" | 2 | 💡 offen — alle Tracks als Wärmekarte |
| 8 | Geometrie & Statistik der Route | 2 | 💡 offen — Kurvigkeit/fraktale Dim. + Max/Avg-Speed, Höhenmeter (teils via FEAT-9) |
| 9 | Natur-Sammelalbum „Pokédex" | 2 | 💡 offen — Register über alle Touren; mit #3 verbinden |
| 10 | Regen-Vorwarnung unterwegs | 1 | **→ `feature-requests.md` FEAT-5** (hängt an BUG-2!) |
| 11 | Parkplatz automatisch merken | 1 | **→ `feature-requests.md` FEAT-3** |
| 12 | Offline-Karten vorladen (PMTiles) | 2 | 💡 offen — braucht Enabler #16; OSM-Policy beachten |
| 13 | Goldene Stunde & Sonnenstand | 1 | **→ `feature-requests.md` FEAT-2** (World-Clock-Sonnenmathe) |
| 14 | 3D-Geländekarte (MapLibre + DEM) | 3 | 💡 offen — braucht Enabler #16 |
| 15 | Live-Video-Broadcast | 4 | 📐 Konzept → [`archive/plan-live-video-broadcast.md`](archive/plan-live-video-broadcast.md) (WebRTC-P2P + coturn) |
| 16 | Vektor-Karten (MapLibre GL) — **Enabler** | — | 💡 strategisch: lesbare Labels (Orbitron!) + schaltet #12 & #14 frei |
| 17 | Navi-Route Google-Blau + gefahrene Strecke speed-gefärbt | 1 | **→ `feature-requests.md` FEAT-13** 🌿 (c erledigt; a/b offen) |
| 18 | Lane Guidance (Spuranweisungen) | 2 | **→ `feature-requests.md` FEAT-17** 🌿 (OSRM `lanes`; SVG-Pfeile schon da) |
| 19 | App live fernsteuern (Remote-Config) | 1 | **→ `feature-requests.md` FEAT-10** 🌿 (Demo gebaut → ausbauen) |
| 20 | „Contact AI" — Agent direkt aus der App (Solita) | Future Now | **→ `feature-requests.md` FEAT-11/12** 🌿 |

---

## Weitere Konzept-Notizen (nicht in der 16er-Liste)
| Idee | Worum | Status / Notiz |
|---|---|---|
| **WegCast** (Audio-Sehenswürdigkeiten am Weg) | Standort-getriggerter Audio-Reiseführer, vorgelesen; Vorbild Blitzer.de DriveCast | 💡 [`archive/drivecast-audio-poi-am-weg.md`](archive/drivecast-audio-poi-am-weg.md) — MVP: Wikipedia-Geosearch + `speechSynthesis`; nutzt `effectiveActivity()` für Radius/Tiefe |
| **Cluster-Hülle beim Hover** | konvexe Außenhülle um Pin-Cluster beim Maus-Hover | 💡 [`archive/cluster-konvexe-huelle-hover.md`](archive/cluster-konvexe-huelle-hover.md) — Desktop-only, reines Overlay in `photo-layer.js` |
| **Agent-Antworten vorlesen** | hände-frei beim Fahren; Antworten als Audio | 💡 [`../../wunsch-antworten-vorlesen.md`](../../wunsch-antworten-vorlesen.md) — heute via Phone-Vorleser; Cloud-TTS nur server-seitig (Regel 18). Sofort-Kompromiss: Antworten kurz halten |
| Geo-Erkennung + Voice-Spur | Foto-Erkennung geo-gestützt + Sprach-Wegpunkte | 📐 `archive/geo-erkennung-und-voice-spur.md` |
| Pflanzen-DB-Enrichment | POWO/GBIF/iNaturalist zur Veredelung der Erkennung | 🔬 `archive/pflanzen-datenbanken-enrichment.md` |
| GPS-Nachbearbeitung PPK/PPP | GPS nachträglich verbessern | 🔬 `archive/gps-nachbearbeitung-ppk-ppp.md` (Stufe 1 schon gebaut → FEAT-9) |
| E2E-Verschlüsselung | Tracks + Fotos nur als Ciphertext (à la VGP) | 📐 `archive/e2e-verschluesselung-plan.md` |
| Update-Hinweis für installierte App | „neue Version verfügbar" ohne Re-Install | 📐 `archive/update-hinweis-installierte-app.md` |
| **Solita — Name & Weckwort** | freundlicher Rundum-Agent („Samantha"-Bezug); Name „Solita" (Sol-Kern, voice-tauglich) | 🌿 `archive/agent-name-solita.md` — Tagline „Solita — weiß alles, bleibt nah." |
| **Weckwort „Solita" erkennen** | Vosk-Wortliste vs. eigene Stimme trainieren | 🌿 `../../krass-app/wakeword-solita-erkennung.md` — erst Vosk-Liste, dann openWakeWord/Picovoice |
| **Remote-Config / Fernsteuerung** | App live umfärben/umlayouten ohne Re-Install (CSS-Variablen + Realtime) | 🌿 `archive/plan-fernsteuerung-remote-config.md` (Idee 19, Demo gebaut) |
| **Contact AI im Tracker** | Stufe 1 Chat/Foto + Stufe 2 Agent editiert Repo & pusht | 🌿 `archive/plan-contact-ai-im-tracker.md` (Idee 20) |
| **Tracking ↔ Navigation entkoppeln** | Navi beenden ohne Track zu beenden (Dresden→Frankfurt) | 🌿 `archive/plan-tracking-vs-navigation.md` → FEAT-14 |
| **Play-Store-Verteilung** | Sideload blockt (Samsung); Play Store = 12 Tester·14 Tage / Firmenkonto | 🌿 `archive/verteilung-playstore-tester.md` — „nächste Woche" |
| **Lebens-Agent / Kompression** | Tokens vs. Kompression + Memory-Architektur für „Solita/Samantha" | 🌿 `archive/wissensnotiz-llm-kompression-lebensagent.md` — Referenz |
| **Activity-Erkennung schärfen** | Reisemodus laufen/fahren wirkt nur speed-basiert; Play-Services-Events prüfen | `archive/activity-debug-morgen.md` → Bug/Debug in `bugfixes.md` BUG-6 (Enabler für Parkplatz/WegCast) |
| **Erkennung: Blickrichtung nutzen** | Heading an die Foto-Erkennung → Nachbar-Bauwerke unterscheiden (Zwinger ≠ Schloss) | Fahrt-Notiz 12.06 → `bugfixes.md` BUG-8; verwandt `archive/geo-erkennung-und-voice-spur.md` |

---

## Querverweise
- Voll-Ideen: [`archive/tracker-ideen.md`](archive/tracker-ideen.md) · Features: [`feature-requests.md`](feature-requests.md) ·
  Bugs: [`bugfixes.md`](bugfixes.md) · Übersicht: [`../../NOTES.md`](../../NOTES.md)
