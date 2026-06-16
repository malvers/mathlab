# Stand — Branch-Cleanup 2026-06-16

Vollständige Durchsicht aller Branches: Was lag noch offen, was war schon live?

## Ergebnis
**Kein ungebauter Code lag mehr offen.** Alles war entweder gemerged oder durch
neuere Versionen in `main` überholt. Das einzig wirklich Offene waren zwei reine
Notiz-Dateien mit unerledigten Wünschen — die wurden vor dem Löschen auf `main`
gesichert (Commit `0726650`).

## Gesicherte Notizen (jetzt auf main)
- `notiz-2026-06-16.md` — Tracker-Navigation: Punkt auch ohne Navigation mitführen;
  bei Navigation sofort Fadenkreuz-Modus; Zieleingabe überarbeiten.
- `ideen-und-wuensche-2026-06-14.md` — POIs, Voice Navigation, Karten-PIN,
  Tankstellen-Aktivierung (TANKERKOENIG_KEY), PlantNet <20 % ausblenden, Route Ulfladen.

## Gelöschte Branches (alle 9, remote auf origin)
Leer / voll gemerged:
- `claude/fahrt-notizen-2026-06-12`
- `claude/note-file-todays-date-32a2af`
- `solita-actionable`

Code vorhanden, aber von main überholt:
- `claude/chat-session-LvVM8` — Fullscreen-Toggle + Foto-Sofort-Upload (beides in main).
- `claude/notizfile-nd-mike-delta-c4m8sg` — Fuel-Pille + Blitzer-Layer; main hat die
  neuere Zwei-Panes-Fassung. (Dessen Notiz `notiz-2026-06-15-…` lag schon in main.)
- `claude/global-check-forloop-mPHhm` — PWA-Update-Banner, AUDIT.md, email-notes;
  alles in main gelandet.

Geparkte Fixes — inzwischen in main neu/besser umgesetzt:
- `claude/unclear-request-g5ubA` — „Strich nur bei echtem GPS-Ausfall" + „GPS-Speed
  übersteuert Motion-Gate". Beide jetzt in `HTML/js/tracker.js` (Gap-Strich ~Z.220,
  BUG-1 Doppler-Speed ~Z.640). Der Branch patchte das alte Inline-`tracker.html`
  (vor dem Refactor) → obsolet.

## Bewusst stehen gelassen
- Lokaler Branch `solita-actionable` + Worktree `/private/tmp/forloop-solita`
  (Remote ist gelöscht, lokal bleibt die Arbeitskopie). Doc: „wir lassen das so."
- Branch `solita-vosk-hybrid` mit eigenem Commit `0749584` (KI-Aussprache) —
  unangetastet; steht ahead-1/behind-1 zu origin/main (main hat nur die Notizen voraus).
