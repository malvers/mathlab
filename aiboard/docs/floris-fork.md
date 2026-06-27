# Phase 0 — FlorisBoard forken & bauen

Ziel von P0: eine **eigene** Tastatur „AI Board" auf dem Pixel, die ganz normal
tippt. Noch **kein** KI-Code. Das beweist nur, dass die Build-Kette steht.

> Diese Datei ist die Schritt-Liste für P0. Noch nicht ausgeführt — sie wartet auf
> dein „los" (Projektregel: keine Änderungen/Builds ohne dein OK).

## Voraussetzungen

- Android Studio + Android SDK.
- JDK passend zur Floris-Version.
- Ein Pixel (deins) mit aktiviertem Entwicklermodus / USB-Debugging.

## Schritte (Entwurf)

1. **Fork holen.** FlorisBoard-Quellen klonen (Apache-2.0). Stand/Version festhalten,
   damit wir spätere Upstream-Updates nachziehen können.
2. **Bauen, unverändert.** Erst den unveränderten Floris bauen und aufs Pixel
   installieren → als Tastatur aktivieren → tippt? Dann steht die Toolchain.
3. **Umbenennen.** App-Name → „AI Board", eigenes Package (z. B.
   `de.docalvers.aiboard`), eigenes Icon. So kollidiert nichts mit einem
   evtl. installierten Original-Floris.
4. **Vorschlags-Pipeline finden.** Die Stelle lokalisieren, an der Floris seine
   Vorschläge erzeugt/anzeigt — dort klinkt sich in P1 unsere Quelle ein.
5. **Sauberer Commit.** Fork-Stand + Umbenennung als eigene, nachvollziehbare
   Commits (Datei-Umzüge per `git mv`, Projektregel 19).

## Ergebnis von P0

- „AI Board" als auswählbare Tastatur auf dem Gerät, tippt normal.
- Bekannte Einklink-Stelle für die Vorschläge → bereit für P1 (Cloud-Gehirn).

## Danach

→ `../plan.md`, Phase 1: Edge-Fn `keyboard` + Phrasen bei Tipp-Pause.
