# Wake-Word „Solita" zuverlässig erkennen — Optionen

> Notiz von Doc (2026-06-11). **Noch nicht gebaut** (CLAUDE.md Regeln 2/4).
> Hintergrund: Das deutsche Vosk-Modell kennt „krass", aber das Fantasiewort **„Solita"** wird schlecht
> erkannt (oft als „solide" gehört). Relevant für das krass-app-Experiment **und** den künftigen
> Agent-Namen/Weckwort „Solita" (siehe `../HTML/tracker/plan-contact-ai-im-tracker.md`).

## Zwei Wege, das deutlich besser zu machen

### 1. Dem System das Wort gezielt beibringen *(einfach, erster Versuch)*
- Vosk kann mit einer **festen Wortliste/Grammatik** laufen: man gibt dem `Recognizer` eine Liste der
  erlaubten Wörter mit (z. B. `["krass", "solita", "[unk]"]`). Dann **erwartet** es genau diese Wörter
  und matcht „Solita", statt es als „solide" zu verwerfen.
- Bleibt **offline, on-device, keyless** — kein neues System nötig, nur ein Parameter im Service.
- 80/20: oft reicht das schon.

### 2. Auf die eigene Stimme anlernen *(treffsicher, etwas mehr Aufwand)*
- Dedizierte **Wake-Word-Engines**, die man mit **ein paar eigenen Aufnahmen** trainiert (Wort ~10–50×
  einsprechen) → ein winziges Modell erkennt **genau dein Wort in deiner Stimme**, auch Fantasiewörter.
- Optionen: **openWakeWord** (open source, gratis), **Picovoice Porcupine** (Custom-Keyword, kommerziell),
  Edge Impulse Keyword-Spotting. Alle **on-device**.
- Sehr robust gegen Fehlauslöser — der „richtige" Weg für ein echtes, persönliches Weckwort.

## Empfehlung
Erst **Weg 1** (Vosk-Wortliste) — billig, evtl. genug. Wenn's dann immer noch wackelt → **Weg 2**
(openWakeWord/Picovoice) für ein echtes, auf Doc trainiertes Weckwort. Caveat: Weg 1 bleibt im
jetzigen Vosk-Setup; Weg 2 ist eine eigene Komponente.
