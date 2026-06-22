# Tracker — Anleitung für Agents

Kanonische Onboarding-Doku für KI-Agents am **Doc Alvers Tracker**. Vor größeren Änderungen lesen.
Allgemeine Arbeitsregeln stehen in `forloop/CLAUDE.md` + globaler `CLAUDE.md` — hier nur Tracker-Spezifisches.
(Diese Datei ersetzt das frühere `tracker-app/README.md`.)

---

## Was ist das

Schlanker GPS-Tracker (Leaflet-Karte, START → laufen → STOP, GPX). Zwei Wege:

- **Web** — läuft im Browser, aber **kein** Hintergrund-Tracking (Browser friert JS bei gesperrtem Screen ein).
- **Native Android-App** — Capacitor-Wrapper mit Background-Geolocation → zeichnet auch bei gesperrtem Bildschirm auf. Verteilt als **Debug-APK** zum Sideload (kein Play Store).

Design: **standalone** Vollbild (wie `glocken`, KEIN Cyber-Grid). KISS — „Öffnen. Starten. Laufen."

---

## Dateien (Single Source of Truth)

| Pfad | Rolle |
|---|---|
| `HTML/tracker/tracker.html` | **DIE App** — eine Datei (HTML+CSS+JS). Hier wird editiert. |
| `HTML/tracker/index.html` | Landing-Page (VGP-Stil): Header + 2 Kacheln (Im Browser → `tracker.html`, Android-App → APK). |
| `HTML/tracker/icon.svg` | Brand-Icon (dunkelblau, oranger GPS-Trail, grüner Start-, roter Positions-Punkt). |
| `HTML/tracker/doc-alvers-tracker.apk` | Herunterladbare APK (Kopie aus dem Build; **committen**, nicht git-ignored). |
| `HTML/tracker.html` (Root) | Nur **Redirect** → `tracker/tracker.html`. |
| `HTML/tracker/{bugfixes,feature-requests,ideen}.md` | **Die 3 gepflegten Queues** — Bugs / entschiedene Features / Ideen-Triage. Alles andere (Quell-Notizen) liegt archiviert unter `archive/`. |
| `tracker-app/` | Capacitor-Projekt (native APK). **git-ignored**, lokales Build-Projekt. appId `de.docalvers.tracker`, `webDir: www`. |
| `tracker-app/www/` | **Generiert** aus `tracker.html` — NIE von Hand editieren. |
| `tracker-app/sync-web.sh` | Kopiert `HTML/tracker/tracker.html` → `www/index.html` und schreibt `../js`/`../resources` root-relativ um. |

Geteilte Komponente (NICHT im Tracker patchen — zentral): `HTML/js/cyber-clock.js` + `.css` (der Timer).

---

## Build- & Deploy-Flow

**WICHTIG: nicht nach jeder Änderung bauen.** Erst im Browser/HTML testen. APK nur bauen + installieren, wenn Doc es ausdrücklich sagt (jeder Build kostet Zeit + blockiert das Telefon; Doc deployt selbst).

Lokaler Web-Test:
```bash
# im HTML/-Ordner:
python3 -m http.server          # → http://localhost:8000/tracker/
```

APK bauen + aufs Gerät (nur auf Go):
```bash
bash tracker-app/sync-web.sh                 # tracker.html → www/index.html
cd tracker-app && npx cap copy android       # www → android assets
cd android && ./gradlew assembleDebug        # → app/build/outputs/apk/debug/app-debug.apk  (~15-40 s)
adb install -r app/build/outputs/apk/debug/app-debug.apk
cp app/build/outputs/apk/debug/app-debug.apk ../../HTML/tracker/doc-alvers-tracker.apk   # Download aktualisieren
```
Toolchain (Doc's Mac): Android SDK `~/Library/Android/sdk`, `minSdkVersion 22`. APK ist **Debug-signiert** → kein In-place-Update auf einen Release-Build (erst deinstallieren). `adb` findet das Pixel per USB-Debugging.

⚠️ **JDK-Falle:** Gradle 8.2.1 läuft NICHT auf der System-JDK 24 — sobald ein `build.gradle` neu kompiliert werden muss, bricht es mit „Unsupported class file major version 68" ab (vorher liefen Builds nur aus dem Script-Cache). Fix ist **persistent** gesetzt in `android/gradle.properties`: `org.gradle.java.home=/Applications/Android Studio.app/Contents/jbr/Contents/Home` (JBR 21). Da `tracker-app/` git-ignored ist, ist der absolute Pfad da unkritisch. Falls Builds wieder mit „major version …" sterben: diese Zeile prüfen.

Einmaliges Setup (falls Projekt neu aufgesetzt wird): Node via **nvm** (Homebrew-Node v13 auf dem Mac war kaputt) → `nvm install --lts`; dann `cd tracker-app && npm install && npx cap add android`. Capacitor ist auf **6.x** gepinnt (Plugin-Kompatibilität — vor Bump auf 7 prüfen). **iOS** ist nicht eingerichtet (bräuchte `cap add ios` + Xcode).

---

## Native Hintergrund-Bridge (steckt in `tracker.html`)

```js
const BgGeo = window.Capacitor?.Plugins?.BackgroundGeolocation || null;
const useNativeGeo = !!(BgGeo && Capacitor.isNativePlatform?.());
// startGeoWatch(): native → BgGeo.addWatcher({ backgroundTitle, requestPermissions, ... })
//                 web    → navigator.geolocation.watchPosition(...)
```
- Im normalen Browser ist `window.Capacitor` undefiniert → Web-Geolocation wie immer (**keine Web-Regression**).
- START registriert den Background-Watcher; Android zeigt eine **persistente Notification** und liefert auch backgrounded Fixes. STOP entfernt ihn. Der einmalige „locate on load" nutzt `navigator.geolocation` (von der App-Permission gedeckt).
- Permissions: `ACCESS_FINE/COARSE_LOCATION` im Manifest; `FOREGROUND_SERVICE*`, `POST_NOTIFICATIONS` etc. steuert das Plugin per **manifest merge** bei. `ACCESS_BACKGROUND_LOCATION` ist **bewusst weggelassen** (Foreground-Service + Notification → läuft screen-off ohne den strengen „Immer erlauben"-Flow).
- Plugin: `@capacitor-community/background-geolocation` (MIT). Battery: Dauer-GPS zieht mehr — erwartbar.

---

## Konventionen (Tracker-spezifisch; allg. Regeln → `CLAUDE.md`)

- **Orbitron** überall — Ausnahmen: **Sync-Code in Arial** (Lesbarkeit `0/O`, `1/l`), Canvas-Debug-Labels Arial.
- Palette: Orange `rgb(245,194,66)`, Rot `rgb(176,36,24)`, Grün `rgb(121,158,49)`, BG `rgb(8,20,42)`, BG-hell `rgb(14,36,78)`. **Nie Schwarz** — dunkelblau.
- `--btm` (in `:root`) = Unterkante aller fixierten Controls: `calc(env(safe-area-inset-bottom,0px) + clamp(48px,9vw,62px))`. START/Recenter/Tools hängen daran → hält START über der OSM-Attribution (Android-WebView liefert safe-area meist 0 → additiver Sockel statt `max()`).

---

## Mechaniken & Stolperfallen

### Sync (Supabase, Anon-Auth)
- Code → Konto: `email = t-<sha256(code)[:32]>@docalvers.de`, `password = p-<code>` (`syncCreds`). Gleicher Code = gleiches Konto = gleiche Tracks.
- Ohne Code: anonymes Konto (`signInAnonymously`). `connectSync(code)` liest die aktuellen Tracks, loggt ins Code-Konto, persistiert den Code (`localStorage 'tracker.syncCode'`), kopiert Tracks rüber (Dedup per `name`). Tabelle `tracks`: `name, distance_m, points, waypoints`.
- ⚠️ **„Trennen" (`clearSyncCode`)**: löscht Code lokal + `signInAnonymously` (frisches, leeres Konto). Tracks bleiben im Code-Konto (nicht gelöscht!), aber **dieses Gerät ist danach leer**; zurück nur per Wiedereingabe desselben Codes. Anon-Konten sind nicht wiederherstellbar → Code vergessen = Tracks weg. Deshalb **Bestätigungs-Stufe** (`#sync-confirm`) mit Warnung + Code (antippen=kopieren) + rotem „Ja, trennen".
- Sync-Panel **zustandsgesteuert** (`updateSyncStatus()`): `#sync-connected` (Code-Chip + Trennen) / `#sync-disconnected` (Code erzeugen = erzeugt UND verbindet / „oder Code eingeben") / `#sync-confirm`.

### Panels
- `.ov-panel` (track-list, info-panel, sync-panel) — Schließen ist das **X oben rechts** (`.ov-close`, absolut). `.ov-title` hat `padding-right` für das X.

### App-Icon (Android)
- Adaptive Icon als **Vector Drawables**: `tracker-app/android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml` (GPS-Trail aus `icon.svg`), `values/ic_launcher_background.xml` = `#08142A`, `mipmap-anydpi-v26/ic_launcher*.xml` → `@drawable/ic_launcher_foreground`. Überlebt `cap copy/sync` (nativ).
- ⚠️ Legacy-Raster-PNGs (`mipmap-*/ic_launcher.png`, nur Android <8) zeigen noch den Capacitor-Bot — egal für reale Geräte; echter Fix bräuchte SVG-Rasterizer (z. B. `@resvg/resvg-js`) + Rebuild.

### Secrets
- Supabase **Anon-Key** in `tracker.html` ist öffentlich-sicher (RLS) — **kein** Verstoß. NIEMALS `service_role` o. ä. in den Quellcode (Repo public). Vgl. `CLAUDE.md` Regel 18/21.
