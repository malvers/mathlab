# forloop — Audit- & Refactor-Brief

> Ziel dieses Dokuments: ein **klarer, an Sub-Agenten verteilbarer** Auftrag für einen
> gründlichen Projekt-Audit + globalen Refactor-Plan. Noch NICHT ausführen — erst der Brief.

## Worum es geht
Das gesamte Projekt **forloop** (Doc Alvers Mathe-Labor + **Tracker** + **VGP**) auf ein solides
Fundament setzen, BEVOR es weiter wächst. Ich erwarte einen **ehrlichen, realistischen** Befund —
keine Beschönigung. Lieber jetzt Zeit investieren als später ein Wartungs-Problem haben.

## Umfang
- **Alle** Top-Level-Labs/Tools in `HTML/` (~65 `.html`) — die mathematischen Labore.
- **Alle** App-Ordner: `tracker/`, `vgp/`, `glocken/`, `morpheus/`, `planetarium/`, `worldclock/`, … —
  Tracker + VGP sind keine Mathe-Labs, aber **trotzdem gründlich** prüfen.
- Die **geteilte Schicht**: `HTML/js/` (~42 JS) + zentrale CSS.

**Tiefe — zweistufig (sonst wird's entweder oberflächlich oder uferlos):**
1. **Flacher Inventar-Sweep über ALLES** (billig, parallel): Zweck · Größe · Abhängigkeiten · Red Flags.
2. **Tiefe Review nur auf die kritischen/größten**: Tracker, VGP, geteiltes `js/`, komplexeste Labs.

## Die 6 Audit-Dimensionen (jede file:line-belegt, ehrlich)
1. **Labs/Tools-Inventar** — was gibt es, was macht jedes genau? (Name · Zweck · Größe · Abhängigkeiten)
2. **Doppel-Implementierungen & Tests** — wo ist dieselbe Logik mehrfach (Recorder, Branding, Layout,
   Farben, Buttons, Dropdowns, Lightbox, Sync, Utilities)? Test-Abdeckung: **Ist-Zustand** UND
   **was getestet werden sollte**.
3. **Codequalität / Bugs / Wartbarkeit** — echte Bugs, fragile Muster, Komplexitäts-Hotspots, toter Code.
4. **Dokumentation** — READMEs, `CLAUDE.md`, Code-Kommentare, Onboarding für neue Devs.
5. **Performance** — Engpässe, schwere Payloads, blockierende Scripts, Optimierungspotential.
6. **Sicherheit** (Repo ist **public**) — Secrets/Keys im Code/Verlauf, Supabase-RLS, XSS via innerHTML,
   eval, CORS. **Funde adversarisch verifizieren** — nur Bestätigtes als „✅ bestätigt".

## Konkrete Wünsche
- **Zentrales Design-System:** alle Farben zentral (Tokens / CSS-Custom-Props), überall **einheitliche**
  Buttons, Dropdowns, Inputs. → inventarisieren + Vorschlag (Tokens + Komponenten) + **Migrationspfad**.
  Bestehende Palette: λ Orange `rgb(245,194,66)` · Υ Rot `rgb(176,36,24)` · φ Grün `rgb(121,158,49)`.

## Deliverable: ein Bericht `AUDIT.md`
**Ablage:** Ergebnis als `AUDIT.md` (Repo-Root) speichern und auf einem **eigenen Branch** pushen —
**nicht** nach `main`. So lässt es sich per `git diff --stat` prüfen und kontrolliert reinholen.

- **Management-Summary** — Ist-Zustand in 5 Sätzen + die 3 größten Risiken (ehrlich).
- Befunde je Dimension (1–6), file:line-belegt.
- **Globaler Refactor-Plan als dependency-sortierte Work-Packages.** Jedes Paket:
  `ID · Ziel · betroffene Dateien · Risiko (niedrig/mittel/hoch) · Aufwand (Personentage) ·
  Owner-Agent-Typ · Abhängigkeiten (Paket-IDs) · parallelisierbar (ja/nein)`.
- **Design-System-Vorschlag** (Tokens, Komponenten, Migration).
- **Empfohlene Reihenfolge** (Phasen) + Quick-Wins.

## WICHTIG — gebaut für Orchestrierung (Chef-Agent → Sub-Agenten)
Der Plan muss so geschrieben sein, dass ein **Chef-Agent die Arbeit direkt verteilen** kann.
Der Audit selbst zerfällt sauber in parallele, eigenständige Tasks:
- **Inventar-Agenten** (read-only): je ein Bündel Labs / App-Ordner / die `js/`-Schicht.
- **Dimensions-Agenten:** je 1 pro Dimension (Doppel-Code · Design-System · Security · Performance ·
  Qualität · Doku) — strukturierte Funde mit file:line.
- **Deep-Dive-Agenten:** Tracker · VGP · geteiltes `js/`.
- **Verifizier-Agenten:** Security-/Bug-Funde adversarisch gegenprüfen.
- **Synthese-Agent:** alles → `AUDIT.md` inkl. der Work-Packages.

Jeder Task liefert **strukturierte Funde mit file:line**; die Synthese fügt zusammen. Die Work-Packages
im Refactor-Plan sind die Einheiten, die der Chef-Agent danach an Umsetzungs-Agenten verteilt.
