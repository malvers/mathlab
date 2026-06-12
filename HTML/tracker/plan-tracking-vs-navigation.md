# Tracker — Tracking & Navigation entkoppeln (Denkschrift + Vorschläge)

> Aufgabe von Doc (2026-06-11): gründlich überlegen, wie Tracking und Navigation getrennt behandelt
> werden. **Szenario:** „Ich habe einen Track nach Dresden und navigiere dorthin. Plan ändert sich —
> ich will die **Navigation beenden**, aber den **Track weiterlaufen** lassen (z. B. weiter nach
> Frankfurt ins Museum)." **Noch nicht umgesetzt** (Regeln 2/4).

## Ist-Zustand (Kopplung im Code)
- **START** (`beginTracking`, tracker.js): startet Aufzeichnung **und** — wenn ein Ziel gesetzt ist —
  ruft `__nav.startNavigation()`. Beides in einem.
- **STOP** (`finishTracking`/`discardTracking`): beendet Aufzeichnung **und** `__nav.clearRoute()`.
  → Track-Ende reißt die Navigation immer mit.
- **Navigation-Ende einzeln** gibt es schon — aber **versteckt**: ZIEL-Panel → **„Ziel löschen"**
  (`nav-clear` → `clearRoute()`) beendet nur die Navigation, der Track läuft weiter. Nur: es heißt
  „Ziel löschen", nicht „Navigation beenden", und steckt im Panel.
- **Navigation hängt an der Aufzeichnung:** `__nav.update()` wird nur in `onPosition()` gefüttert, und
  `onPosition` feuert nur **während der Aufzeichnung**. Ohne Track also keine Live-Führung.

**Kern des Problems:** Tracking und Navigation sind eigentlich **zwei unabhängige Tätigkeiten**, ihre
Bedienelemente sind aber verflochten (START macht beides, STOP killt Navi, Navi-Ende ist mislabeled/versteckt).

## Designziel
Zwei getrennte „Lebenszyklen", jeder mit eigenem Start/Ende und sichtbarem Status:
- **Aufzeichnung:** START · PAUSE · STOP (wie heute). STOP beendet **nur** die Aufzeichnung.
- **Navigation:** Ziel setzen → navigieren · **„Navigation beenden"** (Route/Führung/ETA weg), Track
  unberührt · **Ziel wechseln** mitten im Track (z. B. Dresden → Frankfurt) ohne Aufzeichnung anzufassen.

## Vorschläge

### A) Persistenter Navi-Chip + Umbenennen *(Empfehlung)*
- Aufzeichnungs-Buttons bleiben unverändert; **STOP räumt die Route NICHT mehr automatisch weg**
  (Entkopplung).
- Solange Navigation läuft: kleiner **dauerhafter Chip** (am Navi-Banner): `→ Dresden · 1:42 ✕`.
  Das **✕ beendet nur die Navigation**; der Track läuft weiter. Immer sichtbar = immer erreichbar.
- **ZIEL-Panel** kontextabhängig: läuft Navi → „Aktuelles Ziel: Dresden" + **„Navigation beenden"** +
  **„Neues Ziel"** (Re-Target mitten im Track). Kein Navi → wie heute „Ziel setzen".
- **Navigation unabhängig von der Aufzeichnung machen:** `nav.update()` auch ohne laufenden Track
  füttern (eigener leichter Positions-Hook / der vorhandene Acquire-Watch), damit „navigieren ohne
  aufzeichnen" und „aufzeichnen ohne navigieren" beide gehen.
- Deckt das Dresden→Frankfurt-Szenario direkt: Chip-✕ (oder „Navigation beenden") → Track läuft weiter
  → neues Ziel Frankfurt setzen → neue Route, **derselbe** Track.

### B) Zwei klar getrennte Steuerungen
- Eigener **NAVI-Block** (Start/Stop) neben dem Track-START/STOP. Maximale Klarheit, aber mehr UI am
  Bildschirm und doppelte „Stop"-Logik. Eher für später, wenn Navigation viel genutzt wird.

### C) Minimal-Quick-Win (wenig Code)
- „Ziel löschen" → **„Navigation beenden"** umbenennen, **STOP entkoppeln** (Route nicht mehr mit-löschen),
  und einen sichtbaren Hinweis „Navi aktiv → beenden" ergänzen. Holt 80 % des Nutzens mit minimalem Eingriff.
  (A ist im Grunde C + Chip + Re-Target + Navi-ohne-Track.)

## Offene Detailfragen (für die Umsetzung)
- Soll **STOP** bei aktiver Navigation nachfragen („Navigation läuft noch — auch beenden?") oder strikt
  nur den Track beenden? → Vorschlag: strikt trennen, Navi bleibt, ist ja per Chip beendbar.
- **Ein Track oder zwei?** Dresden→Frankfurt als **ein** durchgehender Track (Vorschlag) — Navigation ist
  nur eine Overlay-Schicht darüber, der Track ist davon unberührt.
- Bei Ankunft am (alten) Ziel: Navigation automatisch beenden? (Heute: nur „Ziel erreicht"-Ansage.)

## Empfehlung
**C jetzt als schneller Schritt** (entkoppeln + umbenennen), **Ausbau zu A** (Chip + Re-Target +
Navi-ohne-Track) als sauberes Endbild. B nur, falls echte Doppel-Steuerung gewünscht ist.
