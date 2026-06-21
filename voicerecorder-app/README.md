# Voice Recorder — Capacitor-App

Native Hülle für den **Voice Recorder** (`HTML/voicerecorder/`). Plan A wie Tracker/Solita:
die App lädt die **Live-HTML von docalvers.de**
(`server.url = https://docalvers.de/voicerecorder/voicerecorder.html`) — Updates am Web-Code
kommen ohne Neu-Build, einfach über den normalen Deploy.

`appId = de.docalvers.voicerecorder` → installiert sich **neben** Tracker und Solita.

## Spracherkennung — was wo läuft

Die Web Speech API gibt es **nicht** in der Capacitor-WebView (weder iOS WKWebView noch
Android WebView). Deshalb spricht die Web-App im nativen Container das Plugin
**`@capacitor-community/speech-recognition`** an (über `Capacitor.Plugins.SpeechRecognition`,
ganz ohne Bundler), und im Web bleibt alles bei der Web Speech API.

| Plattform            | Engine                          | Backend                          |
|----------------------|---------------------------------|----------------------------------|
| Web auf Mac (Chrome) | `webspeech` (Web Speech API)    | Google-Server                    |
| Web auf Mac (Safari) | `webspeech` (Web Speech API)    | Apple-Server                     |
| iPad / iPhone (App)  | `native` (Plugin)               | iOS `SFSpeechRecognizer`         |
| Android (App)        | `native` (Plugin)               | Android `SpeechRecognizer`       |

Engine-Auswahl ist automatisch (App → `native`, Web → `webspeech`); über das Radial-Menü
(`ENGINE`-Button) lässt sich pro Gerät auf `WHISPER` (On-Device-WASM) umschalten und zurück.

> **Wichtig:** Die native Bridge (`HTML/voicerecorder/js/native-speech.js`) ist nur **best effort**
> und muss auf echten Geräten getestet werden — vor allem das Neustart-Verhalten von Androids
> einmaligem `SpeechRecognizer` (stoppt bei Stille) gegenüber iOS' kontinuierlichem Modus.

## Bauen (auf Docs Mac)

```bash
cd ~/IdeaProjects/forloop/voicerecorder-app   # Pfad ggf. anpassen
npm install                     # Node muss laufen (sonst nvm LTS)
./sync-web.sh                   # lokale www/-Kopie (Pflicht-Fallback) erzeugen

# Native Projekte EINMALIG generieren (liegen nicht im Repo):
npx cap add android
npx cap add ios

npx cap sync                    # Plugins + www/ in die nativen Projekte spiegeln
```

Dann bauen:
- **Android:** `npx cap open android` → Run ▶ / Build APK(s). Oder CLI:
  `cd android && ./gradlew assembleDebug`.
- **iOS:** `npx cap open ios` → in Xcode signieren (Team wählen) → Run ▶ auf iPad/iPhone.

Updates am Voice Recorder selbst brauchen **keinen** Neu-Build (lädt live). Nur Änderungen an
Plugins/Permissions oder ein neues `sync-web.sh` erfordern `npx cap sync` + Neu-Build.

## Nötige Permissions (nach `npx cap add` einmal eintragen)

### iOS — `ios/App/App/Info.plist`
Zwei Usage-Strings, sonst stürzt die App beim ersten Zugriff ab:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Für die Sprachaufnahme.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Für die Spracherkennung der Aufnahme.</string>
```

### Android — `android/app/src/main/AndroidManifest.xml`
`RECORD_AUDIO` steuert das Plugin schon per Manifest-Merge bei; `INTERNET` setzt Capacitor
selbst. Falls nötig zusätzlich von Hand:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```
Auf Android 11+ braucht die App außerdem eine `<queries>`-Erlaubnis für die System-
Spracherkennung — das Plugin bringt sie über Manifest-Merge mit. Auf manchen Geräten muss in
Einstellungen → Apps → Standard-Apps eine **Spracherkennungs-/Assistent-App** (z. B. Google)
aktiv sein, sonst hat `SpeechRecognizer` kein Backend.

## App-Icon
Noch das Capacitor-Default. Eigenes Voice-Recorder-Icon später ergänzen (wie solita-icon.svg).
