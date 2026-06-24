# Pagode Remote — Capacitor BLE Test-APK

Kleine Standalone-App: **BLE-Fernbedienung** für das DSD TECH 2-Kanal BLE-Relais (SH-HC-08) der Pagode.
Zwei Kanäle, je **EIN / AUS / PULS**. Gesamtkonzept & Elektrik: [`../Solita_goes_Pagode.md`](../Solita_goes_Pagode.md).

Die Web-UI ist **eine einzige Quelle**: [`../HTML/pagode/pagode-remote.html`](../HTML/pagode/pagode-remote.html)
— die läuft auch direkt im **Chrome** (Web Bluetooth). `npm run prep` kopiert sie nach `www/index.html`,
die APK wrappt also **genau die Seite**, die du im Browser testest. Kein zweiter Code.

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

Der **native** BLE-Pfad in der Seite (`nativeBackend`, `Capacitor.Plugins.BluetoothLe`) ist **best-effort**:
das Wert-Encoding von `write` (base64 vs. hex) muss am echten Modul gegengecheckt werden. Falls die Relais
nicht klacken → im Log die TX-Bytes prüfen und ggf. das Encoding in `pagode-remote.html` anpassen.
Der **Web-Bluetooth-Pfad** (Chrome) ist davon unabhängig und der sichere Smoke-Test.

## Plugin

`@capacitor-community/bluetooth-le` — Version muss zu **Capacitor 6** passen. Falls `npm install` meckert:
`npm i @capacitor-community/bluetooth-le@latest` und die Capacitor-Version prüfen.
