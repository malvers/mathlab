# Tracker — Ideen-Triage

> **Zweck:** Das prioritisierte Board **roher, noch offener** Ideen — noch **kein** Bau-Auftrag (Regel 2/4).
> Reift eine Idee zur Entscheidung, wird sie zu einem Eintrag in [`feature-requests.md`](feature-requests.md) **und verschwindet hier** (jede Idee lebt genau an EINER Stelle). Gebautes ist still im Archiv, wird hier nicht verlinkt.
> **Hausregeln: siehe [`../../CLAUDE.md`](../../CLAUDE.md)** (wird automatisch geladen).
> `(Doc)` = Prio von Doc gesetzt · `(Vorschlag)` = Agenten-Vorschlag, Doc kann kippen.

---

> ## 🔎 Audit 2026-07-04 (Code-Stand)
> Ideen gegen den echten Code abgeglichen — **2 waren schon gebaut** und sind hier raus (leben still im Archiv):
> „Triff mich / Live-ETA" (ETA-Pille in `view.html`) · „Agent-Antworten vorlesen" (Solita-TTS).
> **Teilweise:** Route-Statistik (dist/Ø/max + Höhenmeter da, Kurvigkeit/fraktal fehlt) · 3D-Gelände (DEM verdrahtet, aber kein MapLibre-Relief). Rest offen wie gelistet.

## Prio 2 — als Nächstes
- **Schätz-Spiel unterwegs** *(Doc)* — Kids/Mathe: Entfernung / Zeit / Tempo schätzen lassen; Mathe-Labor-DNA.
- **Heatmap „wo war ich überall"** *(Doc)* — alle gespeicherten Tracks als Wärmekarte.
- **Natur-Sammelalbum „Pokédex"** *(Doc)* — Register aller erkannten Arten/POIs über alle Touren; mit dem Reise-Album verzahnen.
- **Offline-Karten vorladen (PMTiles)** *(Doc)* — Karten für Funklöcher cachen; braucht den Vektor-Karten-Enabler; OSM-Tile-Policy beachten.
- **Auto-Reise-Album (PDF/Storybook)** — Tour als schön gesetztes PDF/Album (v. a. Wandern); mit „Pokédex" verzahnen.
- **Geometrie & Statistik der Route** — Kurvigkeit / fraktale Dimension + Max/Avg-Speed; Höhenmeter teils schon via FEAT-9.

## Prio 3 — groß / Wow
- **Tour-Generator nach ZEIT** — „gib mir eine 2-h-Runde ab hier" (49-Mile-Drive-Idee); POI-Routing, aufwändig.
- **3D-Geländekarte (MapLibre + DEM)** — Relief/3D-Ansicht der Strecke; braucht den Vektor-Karten-Enabler.

## Prio 4 — später / Infra
- **Live-Video-Broadcast** *(Doc)* — Zuschauer sehen Live-**Video** statt nur den Punkt; WebRTC-P2P + coturn; hängt am Live-Broadcast (BUG-5).

## Enabler (schaltet anderes frei)
- **Vektor-Karten (MapLibre GL)** — strategisch: lesbare Labels (Orbitron!) + schaltet **Offline-Karten** und **3D-Gelände** frei.

## Weitere offene Ideen
- **WegCast — Audio-Sehenswürdigkeiten am Weg** — standort-getriggerter Audio-Reiseführer (vorgelesen), Vorbild Blitzer.de „DriveCast"; MVP = Wikipedia-Geosearch + `speechSynthesis`, Radius/Tiefe via `effectiveActivity()`. **Überschneidet FEAT-24 (POI) — gemeinsam denken.**
- **Cluster-Hülle beim Hover** — konvexe Außenhülle um einen Pin-Cluster beim Maus-Hover; Desktop-only, reines Overlay in `photo-layer.js`.
- **Pflanzen-DB-Enrichment** — POWO / GBIF / iNaturalist zur Veredelung der Pflanzen-Erkennung (Foto-Spur).
- **GPS-Nachbearbeitung PPK/PPP** — GPS nachträglich verbessern; Stufe 1 (Glättung + DEM-Höhe) ist FEAT-9, echtes PPK/PPP ist die nächste Stufe.
- **Play-Store-Verteilung** — Sideload blockt teils (Samsung); Play Store braucht 12 Tester · 14 Tage / Firmenkonto.
- **Lebens-Agent / Kompression** — Memory-Architektur + Token-vs-Kompression für Solita („Samantha"); Referenz-Idee.

---

## Querverweise
- Features: [`feature-requests.md`](feature-requests.md) · Bugs: [`bugfixes.md`](bugfixes.md) · Onboarding: [`agents.md`](agents.md)
