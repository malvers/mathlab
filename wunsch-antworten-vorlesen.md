# Wunsch — Agent-Antworten vorlesen (Hände-frei / beim Autofahren)

> Workflow-Wunsch von Doc, **noch nicht umgesetzt** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.

## Wunsch
„Wenn du mir deine Antworten **vorlesen** könntest — ich fahre nämlich Auto, und Lesen ist
unterwegs nie so safe." Also: Agent-Antworten **als Audio**, damit Doc den Blick auf der Straße lässt.

## Realität (warum es heute nicht von allein geht)
- Claude Code rendert Antworten als **Text**; es gibt keinen eingebauten „sprich"-Kanal.
- Der Remote-Container hat **keine TTS-Engine** (kein espeak/pico/say) und Cloud-TTS bräuchte einen
  **API-Key** → laut Regel 18 **nicht** ins public Repo.

## Optionen (geräteseitig, sofort nutzbar)
1. **Phone-Vorleser (am besten beim Fahren):**
   - iOS: *Einstellungen → Bedienungshilfen → Gesprochene Inhalte → „Bildschirminhalt sprechen"*
     (Zwei-Finger-Wisch von oben liest die Seite vor).
   - Android: *Bedienungshilfen → „Auswählen und vorlesen"* (Select-to-Speak).
2. **Voice/Read-aloud in der Claude-App**, falls vorhanden (Lautsprecher-Symbol an der Nachricht).
3. **Agent erzeugt Audio-Datei:** Container-TTS nachrüsten oder Edge-Function mit server-seitigem
   Key → `.mp3` je Antwort, per Datei an Doc. Funktioniert, aber **Antippen beim Fahren ist unsafe**
   → nur für später/Beifahrer.

## Sofort-Kompromiss (ohne Technik)
Solange das nicht gebaut ist: **Antworten bewusst kurz halten**, wenn Doc fährt — wenige Sätze,
das Wichtigste zuerst, damit ein Blick oder der Phone-Vorleser reicht.

## Verbindung
Passt thematisch zu [`drivecast-audio-poi-am-weg.md`](HTML/tracker/drivecast-audio-poi-am-weg.md)
(Vorlesen unterwegs) — dieselbe TTS-Frage stellt sich dort für die Sehenswürdigkeiten.
