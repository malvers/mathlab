# Tracker — Cluster-Badge: konvexe Außenhülle beim Hover (Idee)

> Ideen-Notiz von Doc, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.

## Idee
Wenn Foto-/Voice-/Video-Pins auf dem Bildschirm übereinanderliegen, fassen wir sie heute zu einem
**Cluster** zusammen und setzen oben auf den Stapel ein **kleines Zahlen-Badge** (wie viele Pins
zusammenliegen). Vorschlag: Fährt man mit der **Maus** über dieses Badge (Hover), zeichnen wir eine
**konvexe Außenhülle** (convex hull) um genau die Pins dieser Gruppe. Doc: „Das wäre, glaube ich,
sehr intuitiv." — man sieht sofort, *welche* Punkte zum Stapel gehören und wie weit sie streuen,
ohne den Cluster erst auffächern zu müssen.

## Wo das andocken würde
- Clustering + Badge: `HTML/js/photo-layer.js` → `applyStackBadges(markers, map)`.
  - Gruppenbildung = Connected Components (BFS) über **Dot-Centre-Pixelabstand**, Schwelle `STACK_PX`.
  - Jede Gruppe liegt fertig auf jedem Mitglieds-Marker als **`m._stack`** (dieselbe Partition, die
    auch die Auffächerung nutzt) → die Hülle bekäme die Punkte **gratis**, ohne neues Clustering.
  - Das Badge sitzt auf dem Top-Pin (`m._badge`, `pinIcon()`).

## Skizze der Umsetzung (für später)
- Hülle nur sinnvoll ab **3 Punkten**; bei 2 → Linie, bei 1 → nichts (passiert ohnehin nie, Badge ≥ 2).
- Hull-Berechnung: Andrew's Monotone Chain / Graham Scan über die **Layer-Points** der `m._stack`
  (dieselbe optische Position wie fürs Clustering — `dotPoint()` in photo-layer.js), dann zurück nach
  LatLng (`dotPointToLatLng()`) und als `L.polygon` auf einem eigenen Pane/Overlay zeichnen.
- Trigger: `mouseover`/`mouseout` auf dem Icon-Element des **gebadgten** Pins → Hülle ein-/ausblenden.
  Sauber wieder entfernen bei Move/Zoom (Pixelgeometrie ändert sich) und beim Auffächern.
- Style: dezente Füllung + Rand in der Akzentfarbe (λ Orange / φ Grün), leichte Transition.
- **Nur Desktop/Hover** — Touch hat kein Hover; dort bleibt die Auffächerung der Weg (nichts ändern).
- „Nichts anderes": reines visuelles Overlay, keine Änderung an Clustering, Badge oder Fan-out.
