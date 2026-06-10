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
