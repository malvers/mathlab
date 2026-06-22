# „Solita hört alles und immer" — always-on Vosk-Hybrid (Übergabe)

**Branch:** `solita-vosk-hybrid` (NICHT auf main — live Solita unberührt). Autonom gebaut + verifiziert, während Doc weg war (2026-06-16). Pixel war weg → **auf der Lenovo (TB330FU/Android 15) getestet**, der finale Sprech-Test bleibt für den Pixel.

## ES
Der always-on-Vosk-Hybrid ist **implementiert + strukturell autonom verifiziert**. Der Kern-Mechanismus („Vosk hört im Lock, Web-SR im Vordergrund") **funktioniert nachweislich** — inkl. einem akustischen Wake-Test im gesperrten Zustand. Vier Dinge brauchen **deine Stimme am Pixel**, bevor das auf main/live geht.

## Architektur (native-lifecycle-getrieben — robust)
- **Vosk-FGS bleibt die ganze Session am Leben** (Android 14 verbietet FGS-Mic-Neustart aus dem Hintergrund → nie stop/start des Service, nur des Recognizers).
- **Mic-Besitz per Activity-Lifecycle, nativ gesteuert:**
  - `MainActivity.onResume` → `setListening(false)`: Recognizer **stop** (echtes `SpeechService.stop()`+`shutdown()`+`Recognizer.close()`), AudioRecord **frei** → Vordergrund-**Web-SR** besitzt das Mic + fährt die bewährte Konversation.
  - `MainActivity.onPause` → `setListening(true)`: Recognizer **start** (neuer AudioRecord **im schon laufenden FGS** — erlaubt) → **Vosk lauscht im Lock**.
- **Wake im Lock:** `wakeUpApp()` holt die App über den Lockscreen (full-screen-Intent + `canUseFullScreenIntent`-Check + `setShowWhenLocked/TurnScreenOn`), stoppt Vosk **vor** `emitWake` (kein TTS-Selbsttrigger), Web-SR übernimmt die Frage.
- **Kein Mic-Streit:** zu jedem Zeitpunkt hört genau EINER (Vosk **oder** Web-SR).

## Fixes (aus 2 adversarialen Verdikten, beide angewandt + re-verifiziert)
1. **Recognizer-Leak** → als Feld gehalten + `close()` in `stopRecognizer` (sonst nativer Heap-Klau über den Tag → FGS-Kill).
2. **onPause-Mic-Race** → `startRecognizer` retried bei „mic in use" (4×250 ms) statt still tot zu bleiben.
3. **`wantListening=false` + `activityResumed`-Gate** → kein Mic-Steal im Vordergrund nach Login / OS-Restart.
4. **TTS-Belt** → `stopRecognizer()` vor `emitWake`; + `setListening(false)` in `speakReply`.
5. **ear.js Generations-Token + `visibilityState`-Guard** → kein Web-SR-Restart-Storm im Hintergrund.
6. **Login-Order** → `setListening(false)` direkt nach Service-Start (onResume feuert beim Login nicht neu).

## Autonom verifiziert auf der Lenovo (OHNE Sprechen)
| Test | Ergebnis |
|---|---|
| FGS hoch + Modell lädt | ✅ |
| Foreground-Gate (kein Mic-Steal im VG) | ✅ `wantListening=false`, Mic=0 |
| Lock → `onPause` → Recognizer STARTED + Mic aktiv (Dozing) | ✅ |
| Unlock → `onResume` → Recognizer STOPPED + Mic frei | ✅ |
| 60 Lock/Unlock-Zyklen | ✅ **0 FAILED**, Race vom Retry gefangen |
| Leak (Heap vor/nach 60 Zyklen) | ✅ +2,9 MB = **kein Leak** |
| **Akustik-Wake im Lock** (`say "Solita"` → Mic) | ✅ **`heard:"solider"` → WAKE** |

## Braucht DICH (Pixel-Sprech-Test)
1. **Echte Wake-Zuverlässigkeit** — deine Stimme, „Solita", verschiedene Distanzen/Lautstärken.
2. **Konversations-Handoff** — Hintergrund-Wake → App kommt nach vorn → „Ja?" → du sagst eine Frage → Web-SR fängt sie → Antwort.
3. **FSI über Lockscreen** — kommt die App auf dem **gesperrten** Pixel wirklich nach vorn? (Android 14 kann den full-screen-Intent zu einer Heads-up-Notification degradieren — die load-bearing Unbekannte. Falls ja: in den App-Einstellungen „Vollbild-Benachrichtigungen" erlauben.)
4. **Doze-Lock-Dauer** — sperren, weglegen, Minuten später „Solita" — überlebt Vosk Doze/Battery-Throttling über echte Zeit?

## Bekannte Grenze (akzeptiert für v1 = dein „A")
Die **„solide"-Fehlauslösung ist fundamental:** „Solita" ist OOV, die Grammar kollabiert JEDES „solide"-Audio (auch im Satz „eine solide Lösung") auf das Token „solide" → WAKE. Der Single-Token-Gate hilft nicht (Vosk gibt eh nur 1 Token aus). **Echter Fix:** dediziertes KWS = **sherpa-onnx** (keyless, open-vocab, kleine Modelle) — siehe [solita-vosk-wakeword.md](../../archive.md).

## Bauen / Installieren / Testen
```bash
git switch solita-vosk-hybrid
# Vosk-App MIT Modell bauen (Hybrid braucht Vosk):
solita-app/android/gradlew -p solita-app/android assembleDebug
adb install -r solita-app/android/app/build/outputs/apk/debug/app-debug.apk
# Lifecycle live mitlesen:
adb logcat -s SolitaVosk     # onResume/onPause, STARTED/STOPPED, heard/WAKE
```
Der **Service startet web-getrieben beim Login** (`SolitaVoice.start()` in solita-wake.js). Für reinen Mechanik-Test ohne Login: `Capacitor.Plugins.SolitaVoice.start()` per CDP, dann `adb shell input keyevent 26` (lock) / `224` (wake).

## Nächste Schritte
- Pixel-Sprech-Test (die 4 Punkte) → wenn gut: Branch reviewen → auf main mergen → live + APK neu (mit Modell, ~59 MB; Modell bleibt gitignored → APK-Hosting via CDN überlegen, vgl. gh-size).
- Wenn „solide"-Fehlauslöser nerven: **sherpa-onnx KWS** als durable Lösung.
