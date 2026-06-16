# Ideas

> Zwei Sorten Lab-Ideen an einem Ort: **neue eigenständige Labs** (unten „Suggested") und
> **Cross-Lab-Visionen** — Verbindungen zwischen bestehenden Labs (vormals `TRAUM.md`, hier eingefaltet).

## Suggested — neue eigenständige Labs

- Sierpinski / Chaos game (n-gon variants)
- Newton fractal (root basins of complex polynomials)
- Logistic map & bifurcation diagram (period-doubling, Feigenbaum)
- Double pendulum (chaos, phase space trail)
- Magnetic pendulum (fractal basins of attraction)
- Boids / flocking (separation, alignment, cohesion)
- Voronoi & Delaunay (interactive sites, Lloyd relaxation)
- Penrose tiling (P2/P3, deflation)
- Hilbert / Peano / dragon curve (space-filling animation)
- Spirograph / roulette curves (hypocycloid, epicycloid)
- Abelian sandpile (avalanches on a grid)
- Wave interference / ripple tank (double slit, Huygens)
- Phase portrait / vector fields (ODE explorer)
- N-body simulation (2D/3D, Barnes-Hut)
- Brachistochrone / tautochrone race
- Bezier & B-spline playground (de Casteljau)
- Catenary chain (hanging rope, soap film)
- Fourier epicycles (draw → reconstruct from circles)
- Mandelbulb / Quaternion Julia (3D)
- Travelling salesman (nearest neighbour vs 2-opt vs ACO)
- Perlin / Simplex noise visualizer

---

# Cross-Lab-Visionen

Dinge, die wir noch nicht angegangen sind, aber die das große Ganze zusammenführen würden.
(Unterschied zu „Suggested" oben: dort neue eigenständige Labs — hier **Verbindungen zwischen
bestehenden** Labs.)

```
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
WAS ICH WILL:
Nutzer schreibt handschriftlich (auch) Formeln, die sich kaum merkbar in LaTeX morphen.
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
```

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
