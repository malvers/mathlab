# Solita — Capacitor-App (Stufe A: Gerüst)

Native Hülle für **Solita**. Plan A wie der Tracker: die App lädt die **Live-HTML von
docalvers.de** (`server.url = https://docalvers.de/solita.html`) — Updates kommen ohne Neu-Build,
einfach über den normalen Solita-Deploy.

## Stand
- **Stufe A (dieses Gerüst):** Chat + Aktionen (Config ändern · Notizen · Wetter/Vorhersage) laufen.
  `appId = de.docalvers.solita` → installiert sich **neben** dem Tracker.
- **Stimme = Stufe B (offen):** Wake-Word + Mic laufen über Web-`SpeechRecognition`, das die
  Android-WebView **nicht** kann → kommt als nativer Schritt (Vosk, wie `krass-app`). `RECORD_AUDIO`
  ist im Manifest schon vorbereitet.

## Noch aufzuräumen (bei Stufe B — die fasst die Plugins eh an)
- Geerbte Tracker-Plugins (`background-geolocation`, `camera`, `voice-recorder`) + deren Permissions/
  `play-services-location` sind noch drin → für Solita strippen (nötig nur `@capacitor/core` + `android`;
  `voice-recorder` evtl. behalten für B). Danach `npx cap sync android`.
- App-Icon ist noch das Tracker-„t" → eigenes Solita-Icon.

## Bauen (auf Docs Rechner)
```bash
cd ~/IdeaProjects/forloop/solita-app
npm install                 # Node muss laufen (sonst nvm LTS, s. tracker-app/README)
npx cap sync android
```
Dann **bauen** — zwei Wege:
- **Android Studio (zuverlässig):** `npx cap open android` → Run ▶ / Build APK(s).
- **CLI:** `cd android && ./gradlew assembleDebug` → `app/build/outputs/apk/debug/app-debug.apk`
  (braucht JBR 21; der Fix steht in `android/gradle.properties`, vom Tracker geerbt).

APK aufs Phone sideloaden. Updates an Solita selbst brauchen **keinen** Neu-Build (lädt live).
