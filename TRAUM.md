# TRAUM

Cross-Lab Visionen — Dinge die wir noch nicht angegangen sind, aber die das große Ganze zusammenführen würden.

(Unterschied zu IDEAS.md: dort sind neue eigenständige Labs gelistet. Hier sind Verbindungen zwischen bestehenden Labs.)

## Morph ↔ OCR-Bridge

- **OCR-Mapping als Morph-Initialisierung**: das in `equationocr.html` berechnete object↔token-Match (jedes gemalte Object kennt sein zugeordnetes LaTeX-Glyph) direkt an `morph` übergeben. Statt Hungarian/Greedy auf Konturen → fertige semantische Korrespondenz, dann nur noch geometrisch interpolieren.
- **Morph-Korrespondenz visualisieren**: während des Morphs Linien `pixel-object` ↔ `rendered-glyph` einblenden (Object-Farbe = Linien-Farbe). Reuse vom hover-correspondence-toggle aus morph.

## Equation-OCR Verbesserungen

- **Sub/Superscript-Heuristik**: Object oberhalb+rechts mit kleinerer bbox.h → `^token`, unten → `_token`. Würde "c²" als zwei Objects auflösen.
- **Mehrzeilige Formeln**: zweite Zeile detektieren (vertikale Lücke), Tokens pro Zeile gruppieren.
- **Mehrere Formeln in Reihe**: `A = B`, `B = C` nebeneinander → Tokens-Block-Detection.
- **Manual Override**: Chip-Click öffnet Inline-Edit für Label. Bei `?`/error per Hand korrigieren.

## 3D-Erweiterung

- **morph3d ↔ OCR**: Übergebe die gemalte Formel an morph3d, damit der 3D-Stack die echte Handschrift als Source verwendet (nicht nur ein vorgefertigtes LaTeX).

## Tooling / DX

- **Live-Sync zwischen Mac & Tablet**: WebSocket-basierter Hot-Reload statt manuell RELOAD drücken.
- **Replay-Modus für gemalte Formeln**: Aufzeichnen der Strokes mit Timestamps, wiedergeben als Animation.
