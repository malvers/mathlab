# Ideas

> Zwei Sorten Lab-Ideen an einem Ort: **neue eigenständige Labs** (unten „Suggested") und
> **Cross-Lab-Visionen** — Verbindungen zwischen bestehenden Labs (vormals `TRAUM.md`, hier eingefaltet).

## Suggested — neue eigenständige Labs

- **★ WICHTIG (Doc, 2026-07-20) — „Vom Strom zum Code": didaktische Mini-Software, die ein für alle Mal klarmacht, dass Computer auf 0/1 (on/off) beruhen.** Die ganze Kette *richtig, richtig klar* zeichnen: Strom/„Blitz" (Spannung an/aus) → Bit → Byte → Hex → Maschinencode → Assembler → Hochsprache. Jede Ebene interaktiv, mit sichtbarem Übergang zur nächsten (dieselbe Information, andere Abstraktion). Ziel: der „Aha"-Weg von der Physik bis zur Programmiersprache.
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
- Mandelbulb / Quaternion Julia (3D)
- Travelling salesman (nearest neighbour vs 2-opt vs ACO)
- Perlin / Simplex noise visualizer
- Historische Zahlsysteme (Ifrah, „Universalgeschichte der Zahlen"): Dezimalzahl eingeben → Anzeige in babylonisch (Basis 60), Maya (Basis 20), ägyptisch, römisch, indisch-arabisch; Entwicklung von Null & Stellenwertsystem interaktiv

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

---

# Distribution / App-Stores (Capacitor + Plan-A live-HTML)

Der Capacitor-Ansatz (native Shell + WebView lädt live HTML von docalvers.de) = Features/Fixes
**ohne Neuinstallation**. Frage 2026-06-20: „hat Google/Apple was dagegen?" → Notiz, damit's nicht verloren geht.

**Android — heute (sideload):** Google hat **keine Handhabe** (kein Play-Store-Listing = keine Policy).
Beim Install evtl. nur eine Play-Protect-Warnung. Plan A ist hier völlig sauber. So weiterfahren.

**iPhone für Freunde OHNE App-Store-Listing — GEHT:**
- **TestFlight (empfohlen):** Apple Developer Account ($99/Jahr); bis **10.000 Tester** per Einladungs-Link;
  sie installieren die TestFlight-App → dein Build. Nur der *erste* Build je Version kriegt einen *leichten*
  Beta-Review (kein öffentliches Listing). Builds **laufen nach 90 Tagen ab** → ab und zu Shell neu hochladen
  (Features kommen eh übers Web). Braucht **Mac + Xcode** (M3 Air reicht) + einmal `npx cap add ios`.
- **Ad-Hoc:** bis **100 iPhones** per UDID registriert, **kein Review**, dafür UDID-Sammeln fummelig + gedeckelt.
- **Nicht geeignet:** Enterprise-Programm ($299) ist nur für eigene Mitarbeiter, nicht für Freunde (Sperr-Risiko).

**Falls mal ÖFFENTLICHES Listing (App Store / Play Store):** Grauzone „dynamic code" (Google Device-&-Network-
Abuse) bzw. Apple **2.5.2** (Apple ist strenger). Linie = **Inhalt vs. Feature**: remote *Content* im WebView
aktualisieren ist toleriert; ein *neues natives Feature* remote nachschieben (am Review vorbei) bzw.
Bait-and-Switch nicht. Plus „minimum functionality" (kein reiner Webview-Wrapper — haben wir nicht: GNSS/Baro/
Offline). **Safe pattern dafür: Kern-HTML/JS in die Binary bündeln, nur Daten/Config/Tiles remote** → Update-
Komfort UND Review-Sicherheit; nur neue native Features brauchen dann ein Review. Bei ernsthaftem Listing den
aktuellen Policy-Wortlaut frisch prüfen (ändert sich).

---

- Historische Zahlsysteme (Ifrah, „Universalgeschichte der Zahlen"): Dezimalzahl eingeben → Anzeige in babylonisch (Basis 60), Maya (Basis 20), ägyptisch, römisch, indisch-arabisch; Entwicklung von Null & Stellenwertsystem interaktiv *(gerettet aus Branch kennst-du, 2026-06-27)*
