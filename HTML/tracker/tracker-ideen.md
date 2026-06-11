# Tracker — Ideen-Sammlung (Fahrt-Brainstorm)

> Lose Feature-Ideen für Tracker/Navigation, von Doc unterwegs durchgegangen und einzeln freigegeben.
> **Noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.
> Doc: „Im Allgemeinen waren alle Ideen gut, es ging nur um die Priorität."

## Prioritäts-Skizze
„(Doc)" = von Doc festgelegt · „(Vorschlag)" = mein Vorschlag, kann Doc kippen.

- **Prio 1 (bald umsetzen):**
  - 5 Brotkrumen zurück (offline) *(Doc)* · 13 Goldene Stunde & Sonnenstand *(Doc)*
  - 1 Zurück zum Start/Auto *(Vorschlag — klein, baut auf Navi)* · 10 Regen-Vorwarnung *(Vorschlag —
    hoher Nutzen, baut auf Regenradar)* · 11 Parkplatz merken *(Vorschlag — klein, delightful)*
  - 17 Navi-Route: echtes Google-Blau + gefahrene Strecke zeigt Geschwindigkeit *(Doc)*
  - 19 App live fernsteuern (Remote-Config-Demo) *(Doc)*
- **Prio 2 (danach):**
  - 4 Schätz-Spiel *(Doc)* · 7 Heatmap *(Doc)* · 9 Pokédex *(Doc)* · 12 Offline-Karten *(Doc)*
  - 2 Triff mich / Live-ETA *(Vorschlag)* · 3 Auto-Reise-Album *(Vorschlag)* · 8 Geometrie & Stats *(Vorschlag)*
- **Prio 3 (groß / „Wow, aber Aufwand"):**
  - 6 Tour-Generator nach Zeit *(Vorschlag — POI-Routing aufwändig)* · 14 3D-Geländekarte *(Vorschlag —
    neue Map-Engine MapLibre)*
- **Prio 4 (später / Infra):**
  - 15 Live-Video-Broadcast *(Doc)* — Details + Kosten in `plan-live-video-broadcast.md`.
- **Enabler (schaltet mehrere Ideen frei):**
  - 16 Vektor-Karten (MapLibre) — lesbare Labels (Doc-Schmerzpunkt) + ermöglicht 12 (Offline) & 14 (3D).

1. **Zurück zum Start / zum Auto** — ein Tipp routet zurück zum Startpunkt der Aufzeichnung (oder zu
   einem gemerkten Parkplatz-Pin). Baut direkt auf der bestehenden Navigation auf.

2. **„Triff mich" — Live-ETA teilen** — du teilst Position + voraussichtliche Ankunftszeit; der andere
   sieht live, wann ihr euch trefft. Baut auf dem vorhandenen Live-Broadcast auf.
   - **Route blau vor uns** (wie Google Maps) — *ist schon da*: die Navi-Linie ist genau dieses Blau
     (`COL_ROUTE = rgb(66,135,245)`).
   - **ETA am Ziel anzeigen** — als **Ankunfts-Uhrzeit** („da um 15:42"), nicht nur „in X min". Aus
     OSRM-`duration` + jetzt berechnet; bei jedem Reroute aktualisieren.
   - **Für den Live-Zuschauer sichtbar** — die ETA mit in die Live-Broadcast-Nachricht packen, sodass
     wer live mitschaut sieht: „wann ist er/sie hier?".

3. **Auto-Reise-Album** — aus einer Tour automatisch ein Album/PDF: Karte + Fotos + KI-Beschreibungen
   (Pflanzen/Bauwerke), chronologisch am Weg entlang. Ein Tipp → fertige Erinnerung zum Teilen.
   - **Speziell fürs Wandern** gedacht, **schönes Layout** (outstanding!) — nicht nur eine Liste,
     sondern ein gestaltetes Reise-Magazin/Storybook.

4. **Schätz-Spiel unterwegs** *(Prio 2)* — für Kids: „Wie weit bis zur nächsten Abbiegung? Wie schnell
   sind wir?" → schätzen, dann zeigt der Tracker den echten Wert. Distanz/Tempo/Zeit spielerisch
   lernen — die Mathe-Labor-DNA.

5. **Brotkrumen zurück (offline)** *(Prio 1 — BAUEN)* — verläuft man sich beim Wandern ohne Netz,
   führt der Tracker einen der **eigenen aufgezeichneten Spur** zurück. Komplett **offline**: braucht
   keinen Router (OSRM) und keine Karten-Tiles — nur die schon vorhandenen Track-Punkte.
   - Reststrecke **entlang der Spur** bis zum Start (Summe der Segmente), nicht Luftlinie.
   - Richtung zum nächsten Krumen-Punkt Richtung Start; „Start erreicht" am Ziel.
   - Sicherheits-Feature („bring mich heim") → muss zuverlässig sein, daher vor Live-Einsatz testen.

6. **Tour-Generator nach ZEIT** — statt nach Distanz nach **verfügbarer Zeit**: „Ich hab 20 Minuten bis
   zum Meeting — gib mir eine Tour durch die Stadt." Per **Auto oder zu Fuß**, mit **interessanten
   Points of Interest** am Weg, Schleife (Start = Ende), passend ins Zeitbudget.
   - Vorbild: **San Francisco „49-Mile Scenic Drive"** — die kuratierte Stadt-Sightseeing-Runde.
   - Zeit statt Kilometer als Eingabe; POIs aus OSM/Wikipedia (siehe `drivecast-audio-poi-am-weg.md`).

7. **Heatmap „wo war ich überall"** *(Prio 2)* — alle Tracks übereinander als Wärmekarte: oft gelaufene
   Wege leuchten hell. Persönliche Landkarte der besuchten Orte auf einen Blick.

8. **Geometrie & Statistik deiner Route** — mathematische Auswertung des Wegs: Gesamt-Richtungsänderung,
   Kurvigkeit, sogar **fraktale Dimension** der Strecke (Mathe-Labor-Spielerei). Plus **das Übliche**:
   **Max-/Durchschnittsgeschwindigkeit**, Distanz, Dauer, Höhenmeter.

9. **Natur-Sammelalbum / „Pokédex"** *(Prio 2)* — über alle Touren hinweg eine **wachsende, entdoppelte
   Sammlung** aller je erkannten Arten/Bauwerke; „Schon 37 Arten gefunden!". Spielerisch für Kids.
   - **Abgrenzung zu Idee 3:** Idee 3 = Album *pro Tour* (ein Kapitel); diese = *Register über alle
     Touren* (alle Kapitel). **Verbinden** (von Doc bestätigt): am Tour-Ende neue Funde mit
     „neu entdeckt!" ins Sammelalbum; im Album auf eine Art tippen → auf welchen Touren man sie hatte.
   - Noch genauer anschauen / schärfen.

10. **Regen-Vorwarnung unterwegs** — das vorhandene Regenradar **vorausschauend** nutzen: „In ~12 Min
    Regen an deinem Standort / auf deiner Route." Rechtzeitig unterstellen — **besonders für Motorradfahrer**.

11. **Parkplatz automatisch merken** — wechselt die Aktivitätserkennung von „fahren" auf „zu Fuß", setzt
    der Tracker automatisch einen Pin, wo du geparkt hast. Auto später entspannt wiederfinden, ganz ohne
    dran zu denken. (Verwandt mit Idee 1.)

12. **Offline-Karten für die Tour vorladen** *(Prio 2 — meist ist man eh online)* — Kartenausschnitt +
    Route vorab laden, dann läuft alles ohne Netz (Karte, Position, Brotkrumen-Rückweg).
    - **Daten = OpenStreetMap.** Den OSM-Kachelserver **nicht** massenhaft vorab ziehen (Policy).
    - **Klein:** Service-Worker cacht die Kacheln, die man eh anschaut (policy-konform).
    - **Ganze Region:** Vektor-Paket aus OSM — **PMTiles (Protomaps)** oder OpenMapTiles/MapTiler,
      gerendert mit **MapLibre GL**.

13. **Goldene Stunde & Sonnenstand** *(Prio 1 — UMSETZEN)* — zeigt Sonnenstand + wann an deinem Standort
    goldene Stunde / Sonnenuntergang ist (bestes Foto-Licht auf der Wanderung). Nutzt die Sonnen-Mathe
    aus der World Clock. „Bestimmt nicht so schwer."

14. **3D-Geländekarte (statt langweiligem Höhenprofil)** — das klassische Hoch-Runter-Profil ist fad.
    Stattdessen: **Karte kippen & drehen**, Gelände **echt in 3D** aus dem DEM, deine **Spur darübergelegt**
    — live und cool. „Würde ich irrsinnig toll finden."
    - Tech: **MapLibre GL JS** kann 3D-Terrain (DEM-Quelle, Pitch/Bearing, Hillshade); Track als Linie drapiert.
    - Klassische Stats (Max/Avg-Speed, Höhenmeter) bleiben als schlichte Beigabe.

15. **Live-Video-Broadcast** *(Prio 4)* — Video live „durchleiten" statt speichern (ephemer, kein Storage).
    Empfehlung: **WebRTC-P2P + Supabase-Signaling + eigener TURN (coturn)** → kein Pro-Minute.
    - Transport, Kostenmodelle und „was brauche ich dazu" ausführlich in **`plan-live-video-broadcast.md`**.
    - Grobkosten: ~5 €/Mon kleiner VPS (Basis) + Egress nur bei TURN-Relay; bei wenigen Zuschauern faktisch flat.

16. **Vektor-Karten (MapLibre GL) — lesbare Labels + Offline + 3D** *(Enabler)* — die heutigen
    **Raster-Kacheln** (tile.openstreetmap.org) haben die **Städtenamen fest ins Bild gebrannt**: wir
    können Schrift/Größe/Sprache **nicht** beeinflussen. Doc: „Was nützt das, wenn man nie lesen kann,
    wo man gerade ist?" → Hauptmotivation: **gut lesbare Beschriftung** unterwegs.
    - **Umstieg auf Vektor-Kacheln + MapLibre GL** (MapTiler / Protomaps-PMTiles / OpenMapTiles): Labels
      werden client-seitig aus einem Style gezeichnet → volle Kontrolle über **Schriftart (Orbitron!),
      Größe, Kontrast/Halo, Label-Dichte pro Zoom und Sprache (`name:de`)**.
    - **Ein Hebel, drei Features:** ermöglicht zugleich **Idee 12** (Offline-Karten via PMTiles) und
      **Idee 14** (3D-Geländekarte). Daher strategisch wichtiger Enabler.

17. **Navi-Route: echtes Google-Blau + gefahrene Strecke zeigt Geschwindigkeit** *(Prio 1)*
    - **(a) Blau angleichen:** unsere Linie ist `rgb(66,135,245)` ≈ **#4287F5**, Google-Maps ist
      **#4285F4** (`rgb(66,133,244)`) → fast gleich. Der gefühlte Unterschied kommt vermutlich vom
      **dunklen Casing** (Navy-Rand, weight 11) + Deckkraft, nicht vom Blau. Vorschlag: exakt #4285F4 +
      **helleres/dünneres Casing** wie Google (heller blauer Rand statt dunkelblau). Doc schickt
      Screenshot zum Feinabgleich. Code: `COL_ROUTE` / `drawRoute()` in `HTML/js/tracker-nav.js`.
    - **(b) WICHTIG — gefahrene Strecke nicht mehr blau:** der bereits **zurückgelegte** Teil soll die
      **gefahrene Geschwindigkeit** zeigen (Speed-Farbverlauf wie der normale Track, leaflet-hotline),
      **nicht** blau. Also: **blaue Navi-Linie nur VORAUS** (ab aktueller Position), **hinter** dir der
      speed-gefärbte Track. (Wie Google die gefahrene Strecke „aufbraucht" — nur statt grau → unsere
      Speed-Farben.) Umsetzung: Route an der aktuellen Position trimmen / Track-Rendering oben drüber.
    - **(c) erledigt 2026-06-11:** Positionspunkt + weißes Richtungs-Dreieck liegen jetzt **über** der
      blauen Linie (eigene Map-Ebene `nav-route`, z 350 unter Punkt/Track/Markern).

18. **Spuranweisungen (Lane Guidance)** *(Prio 2)* — „Halte dich auf den rechten zwei Spuren." **OSRM
    liefert die Daten**: `step.intersections[].lanes` (jede Spur mit `indications` wie straight/left/
    slight-right + `valid` true/false). Als kleines Spur-Diagramm unter dem Abbiege-Banner anzeigen.
    Verfügbar überall, wo OSM `turn:lanes` getaggt hat (Autobahn-Ausfahrten meist ja, kleine Straßen nein).
    - **Abbiege-Pfeile selbst:** am 2026-06-11 von Unicode-Glyphen auf **saubere SVG-Pfeile** umgestellt
      (straight/left/right/slight/sharp/u-turn/Kreisverkehr/Ziel) in `tracker-nav.js`/`arrowSvg()`.

19. **App live fernsteuern (Remote-Config-Demo)** *(Prio 1)* — vom Auto aus sagen „mach das Navi-Panel
    grün" / „z-Order ganz nach unten" / „Panel ein Stück nach Süden" → passiert **live, ohne
    Neuinstallation**. Aussehen/Parameter (Farben, z-order, Schriftgrößen, Position, Panel-Sichtbarkeit)
    in `config.json`; App pollt (~30 s) oder via **Supabase Realtime** (instant), anwenden über
    **CSS-Variablen** → sofort & reload-frei. Nur Präsentation, keine Logik. Intellektuelle Übung +
    cooler Vorführ-Effekt. Details: `plan-fernsteuerung-remote-config.md`.

## Erledigt (gebaut, diese Session)
- **Live-Config-Demo (Idee 19, Modell 1):** `docalvers.de/config.json` → `tracker-config.js` pollt (~20 s,
  ETag) → CSS-Variablen, ohne Reload. Fernsteuerbar: Stat-Farbe unter der Uhr, Navi-Banner Farbe/z-Order/
  Süd-Offset. Workflow: Wert in `HTML/config.json` ändern → commit + push → App übernimmt es.
- Idle-Auto-Hide blendet auch Header + Start/Stop-Leiste aus.
- Einfache Navigation: Adresse → Route, START navigiert + trackt (Radial-Eintrag „ZIEL").
- Re-Routing bei Routenabweichung (automatische Neuberechnung).
- Abbiege-Navigation mit Sprachansage (de-DE) + saubere SVG-Abbiegepfeile.
- Reicheres Navi-Banner: ETA + Straße/Ref + Schild-Ziele, Google-Navi-Grün, liegt unter dem Header.
- Positionspunkt + weißes Dreieck liegen über der blauen Navi-Linie.
- Tempolimit-Schild (OSM maxspeed via Overpass): nächste Straße, häufiger/robuster, deutsche Zonen-Tags.
- Tempo-Schild: „c" statt ∞ bei unbegrenzt; springt beim Überschreiten nach vorne; Glocken-Warnton bei >10 %.
- Kompass (Nordpfeil) unter dem Header.
- Regenradar-Quellen-Status (DWD/RainViewer) unter Einstellungen → Debug; untere Debug-Leiste folgt dem Debug-Schalter.

## Detail-Notizen (eigene Dokumente, in NOTES.md verlinkt)
- `polish-ki-erkennt-indikator.md` — „KI erkennt"-Roboter (🤖) durch schönen Indikator ersetzen (Vorschläge).
- `plan-tracking-vs-navigation.md` — Navigation beenden ohne den Track zu beenden (Vorschläge A/B/C).
- `bug-regenradar-kein-regen.md` — Regenradar zeigt in DE keinen Regen (DWD leer/stale).
- `plan-navigation-einfach.md` — Navigations-Plan inkl. „Nachgebaut"-Log.
- `plan-live-video-broadcast.md` — Live-Video durchleiten + Kostenmodelle.
- `drivecast-audio-poi-am-weg.md`, `cluster-konvexe-huelle-hover.md`, u. a. — siehe `NOTES.md`.
