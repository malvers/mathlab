# APK-Builds — git-sichtbares Protokoll

Jede gebaute/installierte Android-APK wird hier als **eine Zeile** festgehalten — damit der
Build-Stand **im Repo prüfbar** ist (für Doc UND die Agenten) statt geraten. Ein git-Commit kann
einen Geräte-Build sonst nicht bezeugen; genau diese Lücke hat hier „APK offen?"-Hedging erzeugt.

**Format:** `JJJJ-MM-TT · <app> · vc<N> · <was nativ neu / Anlass>`
- Nur **native** Änderungen (Plugin, Manifest, Permission) erzwingen einen Build — Web/HTML nicht (das geht live über die Plan-A-URL).
- **versionCode-Quellen** (hier NICHT doppelt pflegen, nur referenzieren): tracker = `tracker-app/android/app/build.gradle` + `HTML/tracker/version.json`; solita = `solita-app/android/app/build.gradle`.
- Tracker-Release zusätzlich nach der Checkliste in `allowance.md` (versionCode bumpen, sonst greift das In-App-Update nicht).

## Builds (neueste zuerst)

- **2026-06-19 · tracker · vc2** *(Bump offen — s. ⚠️ unten)* · native Plugins aus OTWA-Merge `3fa27a3`: Mic/Solita-STT, Kompass (`@capacitor/motion`), Aktivitäts-Indikator (`ActivityRecognition`), Sprach-Navi-TTS (`@capacitor-community/text-to-speech`) — Doc bestätigt gebaut
- **2026-06-19 · krass · —** *(noch kein committed Gradle-Projekt; lokal via `npx cap add android` aus `krass-app/native/`)* · erster Geräte-Build, Vosk-Foreground-Service zählt „krass/solita/solida" — Doc bestätigt gebaut + installiert
- **2026-06-08 · tracker · vc2 / 1.1** · Voice-Spur (natives `capacitor-voice-recorder`, `RECORD_AUDIO`) + In-App-Update (`AppUpdatePlugin`, `REQUEST_INSTALL_PACKAGES`) — dokumentiert in `allowance.md`

> ⚠️ **Offen (von Doc zu klären):** Der 2026-06-19-Tracker-Build mit den nativen Plugins steht im Repo
> weiter auf **versionCode 2** (`build.gradle` + `version.json`). Damit die anderen Geräte (Lenovo) das
> Update per In-App-Banner bekommen, müsste vc auf **3** hoch + `version.json` nachziehen — sonst halten
> sie sich für aktuell. Für Docs eigenes, manuell installiertes Pixel ist es egal.
