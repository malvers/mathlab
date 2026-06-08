# Allowance — was der Agent autonom darf (wenn Doc weg ist)

Wenn Doc „freie Hand für die Ungefährlichen" gibt (unterwegs, keine Freigaben möglich), gilt diese
Grenze. Im Zweifel: NICHT tun, aufschreiben, auf Doc warten.

## ✅ Ungefährlich — autonom erlaubt
- Repo-Dateien editieren/anlegen (Web, native Quellen, Configs) — lokal, reversibel, **uncommitted**.
- Lokal bauen/kompilieren (`./gradlew assembleDebug`), Syntax-/Build-/Lint-Checks.
- Messen/diagnostizieren: CDP, `adb` dumpsys/logcat **lesen**, `curl`-GET.
- Die gebaute APK lokal in `HTML/tracker/` aktualisieren (die Landing-Page-Datei).
- Memory pflegen.

## ⛔ NICHT ohne Doc (gefährlich / outward-facing / irreversibel)
- **committen / pushen** — macht Doc immer selbst.
- **deployen** (Edge Functions, Pages), Secrets rotieren/anfassen.
- **auf Geräte installieren** ohne sein OK.
- Außenwirksames: Mails senden, externe Dienste schreiben, Öffentliches.
- Löschen/Überschreiben von Dingen, die ich nicht angelegt habe.
- Neue **kostenpflichtige** Abhängigkeiten/APIs ohne Rückfrage. (Gratis-OSS-Plugins = ok.)

## Release-Checkliste In-App-Update (WICHTIG)
Damit das Self-Update greift, bei JEDEM neuen APK-Release:
1. `tracker-app/android/app/build.gradle`: `versionCode` +1 (und ggf. `versionName`).
2. `./gradlew assembleDebug` → APK nach `HTML/tracker/doc-alvers-tracker.apk` kopieren.
3. `HTML/tracker/version.json`: `versionCode`/`versionName` auf denselben Stand.
4. Doc: committen + pushen. Geräte sehen beim nächsten App-Öffnen das Banner.

## Log: autonome Session 2026-06-08 (In-App-Update gebaut)
Alles **uncommitted**, nichts gepusht/installiert:
- Nativ: `AppUpdatePlugin` (getInfo + installApk) + `REQUEST_INSTALL_PACKAGES` + in MainActivity registriert; versionCode 1→2 / 1.0→1.1.
- Web: `js/app-update.js` (Banner „Neue Version verfügbar → Installieren") im Loader; `HTML/tracker/version.json`.
- APK gebaut (compile OK, versionCode 2 verifiziert) + nach `HTML/tracker/` kopiert.
- Offen für Doc: committen + pushen; auf den Geräten **einmal** die vc2-APK installieren (danach Self-Update).
