# Pagode Remote — Capacitor BLE Test-APK

Kleine Standalone-App: **BLE-Fernbedienung** für das DSD TECH 2-Kanal BLE-Relais (SH-HC-08) der Pagode.
Zwei große Knöpfe **START / STOP** im 230-SL-Look. Gesamtkonzept & Elektrik: [`../Solita_goes_Pagode.md`](../Solita_goes_Pagode.md).

Die gewrappte UI ist **eine einzige Quelle**: [`../HTML/pagode/pagode.html`](../HTML/pagode/pagode.html)
— läuft auch direkt im **Chrome** (Web Bluetooth). Die BLE-Schicht (Protokoll + beide Transporte) liegt
geteilt in [`../HTML/pagode/js/pagode-ble.js`](../HTML/pagode/js/pagode-ble.js) und versorgt beide Pagode-Seiten
**und** die APK. `npm run prep` kopiert Seite, JS **und** Snakeskin-Bild nach `www/`
(→ `www/index.html` + `www/js/pagode-ble.js` + `www/snakeskin.png`),
die APK wrappt also **genau** das, was du im Browser testest. Kein zweiter Code.

## Bauen (auf Docs Mac, JBR 21 — wie Tracker/Krass)

```bash
cd pagode-app
npm install
npm run cap:add      # erzeugt android/ (einmalig) + kopiert die Seite nach www/
#  --> jetzt einmalig die BLE-Permissions eintragen (siehe unten)
npm run cap:sync     # kopiert Web-Assets + Plugin nach android/
npm run cap:open     # Android Studio -> Build -> APK
```

`cap:sync`/`cap:add` rufen vorher automatisch `prep` → `www/` ist immer frisch aus der Single-Source.

## BLE-Permissions (einmalig in `android/app/src/main/AndroidManifest.xml`)

Innerhalb des `<manifest>`, vor `<application>`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<!-- Android <= 11 -->
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
```

## ⚠️ Beim ersten APK-Lauf verifizieren

Der **native** BLE-Pfad (`nativeBackend`, `Capacitor.Plugins.BluetoothLe`) in [`../HTML/pagode/js/pagode-ble.js`](../HTML/pagode/js/pagode-ble.js)
ist **best-effort**: das Wert-Encoding von `write` (base64 vs. hex) muss am echten Modul gegengecheckt werden.
Zum Verifizieren die **Diagnose-Seite** [`../HTML/pagode/pagode-remote.html`](../HTML/pagode/pagode-remote.html) nutzen
(hat ein TX-Log) — sie teilt sich dieselbe BLE-Schicht. Falls die Relais nicht klacken → TX-Bytes im Log prüfen und
ggf. das Encoding in `js/pagode-ble.js` anpassen. Der **Web-Bluetooth-Pfad** (Chrome) ist davon unabhängig und der sichere Smoke-Test.

## Plugin

`@capacitor-community/bluetooth-le` — Version muss zu **Capacitor 6** passen. Falls `npm install` meckert:
`npm i @capacitor-community/bluetooth-le@latest` und die Capacitor-Version prüfen.
