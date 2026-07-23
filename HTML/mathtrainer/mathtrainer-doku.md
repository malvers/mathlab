# MATHTRAINER — Web-Port

Web-Transkription von `~/IdeaProjects/MathTrainer` (Java/Swing „SchoolTrainer", 28 Klassen)
nach Vanilla-JS unter `HTML/mathtrainer/mathtrainer.html`. Basis: Multi-Agent-Tiefenanalyse
(6 Reader + Completeness-Critic, 2026-07-21).

**Benutzerhandbuch:** [manualito.html](manualito.html) — Kurzanleitung für den Unterricht
(auch in der App über die Hilfe-Seite verlinkt).

## Start

- `mathtrainer.html` öffnen (lokal: Server im `HTML/`-Ordner → `/mathtrainer/mathtrainer.html`).
- **Ordner verbinden** (Chip oben rechts): `MathTrainer/resources` wählen (der Projekt-Root
  geht auch — `resources/` wird automatisch gefunden). Dann kommen **Teams, Schülerfotos,
  Namens-WAVs, Aufgaben-Dateien und die 1x1-Hintergrundbilder** direkt aus Deinem Ordner.
- Ohne Ordner: Demo-Team (Ada Lovelace & Co.) + 1x1-Generator + Datei-Import — voll lauffähig.
- Ablauf wie gewohnt: `↓` startet, Frage → `↓` Antwort → `↓` nächster Schüler; `→` = falsch
  (+10 s Strafe); Countdown 10 s mit Auto-Aufdecken; Ende = Teamzeit + Zeit/Aufgabe.

## Struktur

| Datei | Inhalt |
|---|---|
| `mathtrainer.html` / `.css` | Eine Full-Screen-Stage wie das Swing-Panel; Original-Farben (darkBlue rgb(0,0,40), niceGreen, Countdown cyan→orange→rot), Raleway-Splash „School is cool!", KaTeX via CDN |
| `js/mt-core.js` | Konstanten, 4 Farbschemata, Settings als **localStorage-JSON** (ersetzt `MatheTrainer.binary.settings`) |
| `js/mt-store.js` | File-System-Access auf `resources/` (photos/sound/teams/tasks/images), Foto-/Sound-Lookup, 9x10-Bildermatrix, Demo-Daten |
| `js/mt-people.js` | Teams (Label↔Roster **per Index** gepaart wie im Java-Original), Anwesenheit, Zufalls-Picker (Pool ohne Wiederholung, Runden) |
| `js/mt-tasks.js` | 1x1-Generator (exakte MathTask-Semantik: Serie wirkt auf Zahl 1, `÷`/`−` via `n1=n2·n1` → ganzzahlig/nie negativ, Glyph `∙`), `::`-Parser, Zuteilung + „nicht zweimal derselbe Schüler nacheinander" |
| `js/mt-audio.js` | Namens-Audio (Ordner-WAV, sonst **SpeechSynthesis de-DE** — es braucht gar keine WAVs mehr), Fragen-Vorlesen (en-US, 1111 ms Delay), Musik, Lautstärke; **zwei** Audio-Kanäle (Java teilte einen Clip) |
| `js/mt-render.js` | Alle Screens: Splash, Task/Antwort (KaTeX orange + Shrink-to-fit wie JLaTeXMath), Schülerfoto/-name, Countdown-Quadrat 68px, Seiten Help/Students/Series/End, Stoppuhr |
| `js/mt-app.js` | Spielfluss-State-Machine, komplette Tastatur-Map, Rechtsklick-Menü, Datei-Öffnen/Drag&Drop, Picker-Overlay, Boot |

## Getestet (Node, gegen Echtdaten)

- Generator-Invarianten über 20 000 Samples: Operanden 2–9, Division immer ganzzahlig,
  Minus nie negativ, Serien-Filter greift, deaktivierte Operationen kommen nie dran.
- Parser: **alle 14 realen Task-Dateien** (1141 Paare) inkl. LaTeX-Zeilen.
- LaTeX-Join-Logik (`=\)` → `\;`, sonst `\quad`) wie `getProperLatex()`.

## Originalgetreu

Frage/Antwort-Parität pro Schüler · Countdown 10 s (cyan / orange <4 / rot <2, Auto-Aufdecken
bei 0) · `→` = +10 s Strafe · Endscreen „Gesamtzeit für das Team [mit N s Strafe]" +
„Time per task per student" · Serien-Seite (E) + Limit-Modus (L) · Studenten-Seite mit
Anwesenheit (Abwesende bekommen keine Aufgaben) · Team-Wechsel mischt nicht, „New game"
mischt · Ops-Klickleiste (×-Zwang wenn alles aus) · 4 Farbschemata (0) · Transparenz (T) ·
Bildermatrix [kleiner][größer] bzw. [Quotient][Divisor] · Musik nur aus dem Ordner
(Copyright — bleibt lokal).

## Bewusste Abweichungen (dokumentiert)

- **Gefixte Java-Bugs:** Hilfe-Texte für Tasten 1/2 waren vertauscht; Operationen waren nie
  initialisiert (alle AUS beim Erststart → hier alle AN); nach 10 Fehlversuchen konnte eine
  **deaktivierte** Operation gewählt werden (hier: nie); „New game" schaltete nebenbei den
  Countdown um; die Namens-Checkbox las das Countdown-Flag; falsche/Timeout-Antworten zählten
  als „right solution" (hier: nur manuelles Aufdecken zählt); Schüler „Michael" startete
  hartkodiert abwesend (entfernt).
- Countdown bleibt sichtbar, auch wenn Namen ausgeblendet sind (Java koppelte beides).
- Zufalls-Picker ist ein sichtbarer Button 🎲 + Taste **P** statt des globalen jnativehook-Hooks.
- Cmd+N (Chrome-reserviert) → Name-Learning jetzt **Alt+N**; Shift+±-Fontgröße → `*` / `_`.
- Settings als JSON; der zuletzt geladene Aufgabensatz wird **inhaltlich** persistiert
  (Browser können keine Dateipfade erneut lesen).
- WolframAlpha-Modus, GPT-LaTeX-Chat, ElevenLabs: **nicht portiert** (Keys/Proxy nötig;
  GPT-Chat war ohnehin nie in die App verdrahtet).

## Review (Multi-Agent, 2026-07-21)

4 Review-Dimensionen fanden 31 Kandidaten (viele Mehrfachfunde); nach Verifikation gefixt:
- **Spielfluss:** Task-Regeneration mid-run (Ops/±/L/Serien) ging in einen leeren Zustand →
  jetzt sauber zurück zum Splash; Esc→↓ startete den kompletten Run neu (Timer/Strafe weg,
  Doppelzählung) → jetzt **Resume**; Picker-Schließtaste feuerte zusätzlich ihre Spielaktion
  → Taste wird konsumiert; Countdown überlebte Modus-/Team-/Dateiwechsel und C-Toggle →
  wird gestoppt; Countdown hinter offenen Seiten (Help/Students/…) → **pausiert und läuft
  weiter** statt unsichtbar zu verfallen.
- **macOS/Browser:** Cmd/Ctrl-Kombis (Cmd+C!) triggerten App-Aktionen → Guard; Hilfe sagte
  „Cmd+N" (öffnet in Chrome ein neues Fenster) → Alt+N; Anwesenheits-Toggle regeneriert
  im laufenden Spiel nicht mehr (wie Java).
- **Daten/Rendering:** **NFD/NFC-Umlaute** — macOS-Dateinamen (NFD) matchten Roster-Namen
  (NFC) nicht → 38 Schüler ohne Foto/Sound → normalisiert; LaTeX-Antworten mit Suffix nach
  `\)` („✓" in CheckFile.txt) brachen KaTeX → Inner/Trail-Extraktion; ÷-Hintergrundbild
  nutzt jetzt [min][max] wie Java; Render-Race bei schnellem Blättern (Generation-Token);
  lange Namen shrink-to-fit; Taste 2 ohne Datei lädt sichtbar den Demo-Satz; diverse
  Guards (leere Task-Datei aus dem Ordner-Menü, Objekt-URL-Leaks, Picker-Resize).
- Bekannt & akzeptiert: KaTeX kommt vom CDN — offline fällt die Anzeige auf Roh-LaTeX
  zurück (lokales Bundling auf Wunsch). Hinweis: `resources/tasks/English.txt` Zeile 1 ist
  ein GPT-Präambel-Rest („Of course! Here is …") und würde als Aufgabe gezogen — Zeile
  löschen oder mit `//` auskommentieren.

## Sicherheit & Datenschutz

- ⚠️ **Im Java-Projekt liegen drei hartkodierte Keys im Quellcode:**
  `WolframAlphaSolver.java:32` (WolframAlpha, LIVE benutzt), `ElevenLabsTTS.java:19`,
  `chatgpt/OpenAIUsageHelper.java:13` — plus Kopien im kompilierten `out/`.
  **Rotation empfohlen**, bevor das Projekt je geteilt wird.
  (`WolframAlphaKey.txt` ist toter Code — wird nirgends gelesen.)
- **Schülerdaten** (193 Fotos, 406 Namens-WAVs, 8 Kurslisten, `teamNames.txt`, `matches.txt`)
  bleiben **ausschließlich folder-lokal** — nichts davon liegt im (öffentlichen) Repo, die
  Web-App liest sie nur zur Laufzeit über die File-System-Access-API.
- In die Web-Version ist **kein** Key geflossen; TTS läuft über die Browser-SpeechSynthesis.

## Offen / Ideen

- Wolfram-Lösungsschritte via Edge-Function-Proxy (W-Taste), falls gewünscht.
- KaTeX kommt vom CDN — für Offline-Unterricht ließe es sich lokal bundeln.
- Kaimbo-Muster „Manualito" auf Wunsch auch hier.
