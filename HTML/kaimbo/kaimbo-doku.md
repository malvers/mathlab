# KAIMBO STUDIO — Web-Port

Web-Transkription von `~/IdeaProjects/KaimboStudio` (Java/Swing, 88 Klassen, ~18k LOC)
nach Vanilla-JS unter `HTML/kaimbo/kaimbo.html`. Basis: Multi-Agent-Tiefenanalyse
(11 Reader über alle Subsysteme, 2026-07-18).

**Benutzerhandbuch:** [manualito.html](manualito.html) — Kurzanleitung für Doc (auch im Help-Tab der App verlinkt).

## Start

- Live: `kaimbo/kaimbo.html` (lokal: `python3 -m http.server 8765` im `HTML/`-Ordner)
- **Ordner verbinden** (Chip oben rechts oder File → Connect data folder):
  `~/IdeaProjects/KaimboStudio/DataLearnLanguages` wählen → die App liest/schreibt
  **direkt** `Vocabulary.txt`, `mytopics.pnk`, `images/`, `sounds/`, `Infos_*`,
  `backup/` — voll kompatibel zur Java-App (beide können abwechselnd benutzt werden).
- Ohne Ordner: localStorage (Originalformate als Text) + Import/Export-Downloads.

## Struktur

| Datei | Inhalt |
|---|---|
| `kaimbo.html` | Shell: Topbar (Menüs, Suche, Ordner-Chip), Sidebar (Baum/Filter), Content-Tabs, Overlays |
| `kaimbo.css` | Chrome im Doc-Alvers-Look (Orbitron, Navy); Lernfläche + Quiz-Farben originalgetreu |
| `js/kaimbo-core.js` | Datenmodell (exakte Java-Feldnamen), Spaced-Repetition-Leiter 0-1-2-4-7-14-60-180, Selektion, Navigation, Settings (JSON statt `.KaimboSettings.bin`) |
| `js/kaimbo-formats.js` | Parser/Serializer: `Vocabulary.txt` (24-Zeilen-Blöcke), `.pnk`, JSON-Spiegel, `.kaimbo` |
| `js/kaimbo-store.js` | 3 Schichten: localStorage ∥ File-System-Access (Echtordner + Backups) ∥ IndexedDB (Handle, Bilder, Aufnahmen) |
| `js/kaimbo-tree.js` | Themenbaum: AND/OR-Checkboxen (grün/blau), Match-Counts, Kontextmenü, Cut/Copy/Paste (frische UUIDs), Gruppieren, Undo/Redo (Snapshots), pnk-Export/Import |
| `js/kaimbo-search.js` | Suchzeile + Autocomplete (startsWith vor contains, Cap 29, Hover = Live-Filter), Zifferneingabe = Task-Sprung |
| `js/kaimbo-filters.js` | „Select“-Filterliste (Filters.pnk-Namen inkl. Level-Mapping 0,1,2,4,7,14,60,180) + Special-Filters-Panel (5 QA-Filter mit Count) |
| `js/kaimbo-learning.js` | Lernansicht: Bild (Cover + Pan/Zoom je Task), Sprachzeilen mit Auto-Font-Fit, Master-Badges, Cover-Modus + Tipp-Quiz, Hotspots (Löschen/Neu/Info), Clipboard-/Drop-Bilder, InfoBox |
| `js/kaimbo-dialog.js` | Task-Dialog (Master-Feld hellgrün, Enter = Übersetzen → Enter = Speichern an Index 0), Übersetzung |
| `js/kaimbo-audio.js` | Wiedergabe (WAV-Dateien vor TTS), Web-Speech-TTS, Dong, Recorder (Mic → WAV, Original-Namensschema) |
| `js/kaimbo-table.js` | Task-List-Tab + Statistik-Fenster (Fälligkeits-Histogramm) |
| `js/kaimbo-simulator.js` | Phone-Simulator (Canvas): 7-Farb-Menü, Drilldown, Play-Modus mit IT/DE-Bars + TTS + Transport |
| `js/kaimbo-app.js` | Menüleiste, Tabs, Splitter, Tastatur-Dispatcher, Import/Export, Flexi-Chooser, Hilfe, Boot |

## Getestet

Round-trip-Test (Node) gegen die **Echtdaten**: 30/30 PASS, u. a.
- `Vocabulary.txt` (2879 Tasks): Parse → Serialize ist **byte-identisch** zum Original (auch im Strict-Modus)
- `mytopics.pnk`, `Italy/Germany/Times/Filters.pnk`, `Fifty Shades of Grey.txt` (488), `Time.txt` (114): voller Round-trip
- Strict-Parser lehnt beschädigte Dateien ab (verschobene Blöcke), verwaiste pnk-Äste überleben, Ladder-Snap bei Fremdwerten

## Review (Multi-Agent, 2026-07-18)

4 Review-Dimensionen fanden 25 Kandidaten; nach Verifikation ~20 echte gefixt, darunter:
- **Datensicherheit:** Sample-Tree konnte echte `mytopics.pnk` überschreiben, wenn nur der pnk-Read fehlschlug; verwaiste pnk-Äste wurden beim Speichern still gelöscht; Lese**fehler** (≠ fehlt) trennt jetzt den Ordner ab statt stale Daten zurückzuschreiben; `mytopics.pnk` bekommt jetzt auch Backups; Reconnect fragt bei ungespeicherten lokalen Edits (Backup beider Seiten); Saves laufen serialisiert (keine Race-Überholer); beschädigte Ladung → Read-only statt Persistieren.
- **macOS:** Alt-Shortcuts über `e.code` (Option+S komponierte „ß"); Ctrl+Klick im Simulator (= Rechtsklick auf Mac) repariert.
- **Logik:** Enter nach richtiger Quiz-Antwort übersprang einen Task; Übersetzungs-Korrektur im Dialog löschte den Draft; Import eigener Exporte kollidierte über UUIDs; Info-Filter kannte nur bereits gezeigte Tasks; Recorder-Dateiname vs. Lookup bei `/` im Text; Backspace konnte unsichtbare Tasks löschen; Objekt-URL-Leaks bei Sounds.
- Bewusst NICHT „gefixt": Baum-Checkboxen berechnen wie das **Original** die Vereinigung der gecheckten Themen (Java-AND war ebenfalls Union mit Neu-Clear, kein Schnitt).

## Originalgetreu übernommen

24-Zeilen-Blockformat inkl. Füll-`0`-Zeilen · german/spanish/flexi verlieren millis/level
beim Laden (Absicht, wie Java) · `OPEND`-Schreibweise · Einfügen neuer Tasks/Topics an
Index 0 · Suche startsWith-vor-contains, Cap 29, Hover-Live-Filter · Quiz-Farben
(exakt `rgb(146,208,80)`, Präfix, Substring cyan-dunkel) · Repeats-Halbierung bei
Treffer, +1 & Level-Abstieg bei >2 Fehlern · Uncover = Fehlversuch · Simulator-Farben
& „decorative options“ · Modifier-Klicks (LEO/Reverso/Google/Bilder) · Startup springt
in „Show not learned“, wenn Wiederholungen fällig.

## Bewusste Abweichungen (dokumentiert)

- **Italienisch-Hardcodings** (learned-Filter, Statistik, Level-Filter) → auf die
  **Master-Sprache** parametrisiert; Default-Master = italian ⇒ identisches Verhalten.
- Java-Bugs **nicht** portiert: spanish-Fehler inkrementierte `italianRepeats`;
  Aggregat-Zähler-Leck im Baum; `buildTree`-Substring-Matching; `_male/_female`-
  Cache-Mismatch beim TTS-Check.
- Suche case-insensitiv (Original case-sensitiv). Task-List-Zeile klickbar (Sprung).
- Settings als JSON in localStorage — **ohne** Passwort (Original speicherte pwd im Klartext).
- JSON-Spiegel sind valides JSON (Original schrieb unescaped).
- UI-Chrome im Mathe-Labor-Look statt Swing-Grau; Lernfläche originalnah.

## Nicht portiert (totes/entbehrliches Zeug laut Analyse)

Auto-Slideshow (toter Code) · Reverso/LEO/Langenscheidt-Scraper (CORS, tot) ·
Dropbox-Sync, Jar-Copy, Version-Rituale · Firebase-Upload (Admin-SDK, Test-Cap) ·
blast2.py-Alignment + BlastDisplay · JavaFX-Video · „The Makers“-Foto ·
Exp_*/External_*-Experimente.

## Übersetzung & Secrets

- Default: **MyMemory** (frei, ohne Key). Optional Google-v2-Key über
  File → Translate settings — liegt **nur** im localStorage, nie im Code (Regel 18/21).
- ⚠️ Im Java-Projekt liegen ein Google-API-Key im Quellcode
  (`Translator.java`, `KaimboStudioMaster.java:3384`) und ein Service-Account-JSON im
  Datenordner → **rotieren empfohlen**; hier wurde nichts davon übernommen.

## Offen / Ideen

- Sans-Forgetica-Font-Toggle (Ctrl+F) — Font liegt in Docs `DataLearnLanguages/fonts`,
  ließe sich per FontFace aus dem verbundenen Ordner laden.
- Cloud-TTS-Dateierzeugung (WAV-Cache wie Java) bräuchte eine Edge Function.
- Firefox/Safari: kein Folder-Access → dort nur localStorage + Import/Export.
