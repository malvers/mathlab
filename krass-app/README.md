# KRASS Zähler

Standalone Android app that counts how often you say **„krass"** per day — **on-device, offline,
keyless** (Vosk speech recognition). A native foreground service does the listening; the web UI
([www/index.html](www/index.html), Orbitron) is just a dashboard.

No microphone audio ever leaves the phone. Nothing is stored but the per-day counts.

---

## Build (you compile — I only wrote the code)

Prereqs: Node + Android Studio (the same toolchain as `tracker-app`).

```bash
cd krass-app
npm install
npx cap add android          # generates krass-app/android/
```

### 1) Drop in the native files
Source files live in [native/](native/). Copy them into the generated project:

| from `native/`                | to                                                              |
|-------------------------------|----------------------------------------------------------------|
| `KrassListenerService.java`   | `android/app/src/main/java/de/docalvers/krass/`                |
| `KrassCounterPlugin.java`     | `android/app/src/main/java/de/docalvers/krass/`                |
| `MainActivity.java`           | `android/app/src/main/java/de/docalvers/krass/` (overwrite)    |

(The two `.kt` files in `native/` are an earlier draft — **delete them**, we use the `.java`.)

### 2) Manifest + Gradle
- Merge [native/AndroidManifest-additions.xml](native/AndroidManifest-additions.xml) into
  `android/app/src/main/AndroidManifest.xml` (permissions + the `<service>`).
- Add the Vosk dependency per [native/build.gradle-additions.txt](native/build.gradle-additions.txt)
  to `android/app/build.gradle`.

### 3) The German model (~45 MB, not in git)
1. Download **`vosk-model-small-de-0.15.zip`** from <https://alphacephei.com/vosk/models>.
2. Unzip it. Copy the **contents** (the `am/`, `conf/`, `graph/`, `ivector/`, … folders) into:
   `android/app/src/main/assets/model/`
   → so `android/app/src/main/assets/model/conf/model.conf` exists.

This folder is `.gitignore`d (public repo + size). The app unpacks it to internal storage on first run.

### 4) Build & run
```bash
npx cap sync android
npx cap open android         # → Build / Run in Android Studio
```
On the phone: grant **Mikrofon** + **Benachrichtigungen**, tap **START**, say „krass". The count rises
and the ongoing notification shows today's total.

### 5) For real 24/7
Settings → Apps → *KRASS Zähler* → Battery → **Unrestricted** — otherwise Android Doze may kill the
service when the phone is idle.

---

## Notes / limits (honest)
- Counts the **exact word** „krass" (not „krasse/krasser/krass!"). Easy to widen later if you want.
- Mic always-on costs a few %/h battery; the „läuft & hört zu" notification is unavoidable on modern Android.
- Day rollover is automatic (counts are keyed by date); no server, no account.
- Orbitron loads from Google Fonts (online); offline it falls back to a system font. Bundling the `.ttf`
  for full-offline is a later nicety.
- Native speech code is **untested on device** — expect one round of build fixes.
