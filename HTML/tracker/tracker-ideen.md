# Tracker — Ideen-Sammlung (Fahrt-Brainstorm)

> Lose Feature-Ideen für Tracker/Navigation, von Doc unterwegs durchgegangen und einzeln freigegeben.
> **Noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.

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
