# Solita — Natives Vosk-Weckwort (Stufe B): Stand & Erkenntnisse

**Datum:** 2026-06-16 · alles am Pixel empirisch gemessen (nicht geraten).

## Was kaputt war (und warum „Vosk geht nie")
1. **Fehlende `uuid`-Datei** im gebündelten Modell → `StorageService.unpack` warf
   `FileNotFoundException: model/uuid` → Service machte sofort `stopSelf`. **Das** war der
   Hauptgrund, dass Vosk nie lief — kein Mic-Streit, kein OS-Limit. Fix: `assets/model/uuid` angelegt.
2. **„Solita" ist out-of-vocabulary.** Eine Vosk-Wortlisten-Grammar kann nur *auswählen*, was schon
   im Lexikon steht — sie kann **kein neues Wort hinzufügen**. „solita"/„solida" werden verworfen
   („Ignoring word missing in vocabulary"), die Grammar kollabiert auf `[unk]` → alles wird `[unk]`.

## Was jetzt geht (bewiesen)
- Mit `uuid` entpackt das Modell (91 MB, ~3 s), Vosk **hört** und transkribiert echtes Deutsch sehr gut.
- **Grammar-Trick:** Grammar auf die In-Vokabular-Wörter, zu denen „Solita" wird (`solide`/`solider`)
  → Vosk feuert **bei jeder „Solita"-Äußerung WAKE**. Erkennung = zuverlässig.

## Der fundamentale Haken (adversarial verifiziert)
- „Solita" ≈ „solide" ist **unter der Auflösung** dieses kleinen deutschen Modells
  (vosk-model-small-de, ~28 % WER). Der Grammar-Trick feuert deshalb **auch auf das Alltagswort
  „solide"**. Phonetik-/Levenshtein-Filter helfen NICHT (`solide` hat Köln=852, Lev=1 zu „solita" →
  rutscht durch jeden Filter). Freie Erkennung + Filter wäre sogar *breiter* (mehr Fehlfeuer), nicht enger.

## Blocker (real, fixbar)
- **Selbsthören:** der native Vosk-Dienst (eigener Prozess) hört Solitas **eigene TTS-Stimme** und
  würde selbst auslösen. `ear.suspend()` (JS) mutet ihn NICHT. Fix: `SpeechService.setPause(boolean)`
  existiert im AAR 0.3.47 — muss als `@PluginMethod pause()` durch `SolitaVoicePlugin` verdrahtet
  werden (aktuell nur start/stop/isRunning).

## Echte Lösung (Empfehlung): sherpa-onnx KWS
- Dediziertes Keyword-Spotting statt Diktiermodell: **keyless + offline + Apache-2.0** (kein AccessKey
  wie Porcupine), **open-vocabulary** → „Solita" als Keyword **ohne Training**, Empfindlichkeit einstellbar.
- Modell nur **wenige MB** → schrumpft die **67-MB-APK** drastisch (löst nebenbei das Repo-Größen-Problem).
- Offizielles Android-KWS-Beispiel vorhanden. Fallback: openWakeWord (Training nötig). NICHT Porcupine.

## Technischer Stand / offene Punkte
- `com.alphacephei:vosk-android:0.3.47` (nicht `org.vosk` — das ist das Java-Package).
- APK = **67 MB** wegen gebündeltem Vosk-Modell (Modell ist **gitignored** → NICHT committen!).
  Tracker-APK zum Vergleich: 6,5 MB.
- **Stufe-A-Hirn ist LIVE auf main** (Web-Push 6df9144) — die installierte App lädt es via Plan A.
- **Lokal uncommitted (Test-Stand):** `MainActivity` hat einen **Test-Autostart** des Service
  (Instrumentierung, muss raus); `SolitaVoiceService` hat Diagnose-Logs + den Grammar-Trick;
  `assets/model/uuid` neu. Der echte Service-Start ist web-getrieben via `SolitaVoice.start()`.
- Noch offen für „fertig": (2) Web nutzt nativen Pfad, (3) Frage-Aufnahme nach Wake (Mic-Übergabe),
  (4) `setPause` während TTS, (5) Lockscreen-Dauerbetrieb, (6) APK deployen.
- Research-Workflow-Output: `wf_ba477f2a-7de` (Synthese + adversarialer Verdikt).
