# Solita goes Pagode 🚗

**Ziel:** Doc startet & stoppt seinen **Mercedes 230 SL „Pagode" (W113, Baujahr 1964)** per Sprache über Solita —
*„Solita, let's go, starte mal die Engine …"* → Anlasser dreht → Motor läuft. Und *„mach den Motor aus"* → Pagode aus.

Alte Technik, **keine Elektronik** im Auto → Batterie trennen/schalten ist gefahrlos (kein Steuergerät, das spinnt).
12 V, Minus an Masse (W113 ist negativ geerdet).

---

## 1. Die Elektrik — wo fließen die „enormen Ströme" wirklich?

Beim Anlassen fließen kurz **200–500 A**. ABER: durch den **eigenen Magnetschalter des Anlassers**, **nicht**
durch den Draht, den wir schalten. Zwei getrennte Kreise:

```
   Batterie + ──dickes Kabel──► [Klemme 30]
                                    │
                            ┌───────┴────────┐
                            │  MAGNETSCHALTER │   Spule zieht Plunger
                            │  (am Anlasser)  │   → Hauptkontakt schließt
                            └───────┬────────┘
   Zündschloss "Start" ──dünn──► [Klemme 50]   (= die SPULE)
                                    │
                                    ▼
                              Anlassermotor ──► Masse
```

- **200–500 A:** Batterie → Kl.30 → **Hauptkontakt im Magnetschalter** → Motor → Masse.
  Geschaltet vom **Magnetschalter selbst**. **Den fassen wir nie an.**
- **Klemme 50** ist nur die **Spule** dieses Magnetschalters — genau das, was der Schlüssel in Stellung „Start" macht.
  Der Schlüssel hat **noch nie** 500 A geschaltet, immer nur diesen Trigger.

**Wie groß ist der Trigger wirklich?**
- Einzugswicklung, Inrush: **~30–50 A** für wenige **Millisekunden**
- Haltestrom während des Orgelns: **~10–20 A** für die paar Sekunden

→ Das winzige 10-A-Relais im BT-Modul ist zu schwach. Ein billiges „40 A"-Relais ist grenzwertig.
→ **Ein dediziertes Startrelais / 70-A-Bosch-Relais** packt den Inrush mit Reserve.
Das **500-A-Solenoid** bräuchte man **nur**, wenn man statt Klemme 50 das **dicke Hauptkabel** selbst auftrennt
(Wegfahrsperren-Logik) — für diesen Plan **nicht** nötig.

---

## 2. Der Plan: Schlüssel auf ON, Start/Stopp per App

Der Zündschlüssel bleibt in Stellung **ON** (Zündung + Benzinpumpe laufen). Die App macht nur zwei Dinge:

| Aktion | Was passiert | Kanal |
|--------|--------------|-------|
| **START** | kurzer Impuls auf **Klemme 50** → Anlasser dreht, Motor springt an | Kanal 1, Tast-Modus |
| **STOPP** | **Zündspule** kurz stromlos → Motor geht aus | Kanal 2, normally-closed |

---

## 3. Hardware — Einkaufsliste

### 3.1 Das Gehirn — 2-Kanal **BLE**-Relaismodul ✅ BESTELLT (2026-06-24)
[DSD TECH 2-Kanal Bluetooth 4.0 BLE Relay-Modul (12V)](https://www.amazon.de/2-Channel-Bluetooth-Module-iPhone-Android/dp/B0DPLCRJ98) — €16,99
*(alte ASIN B07MCBX6F1 war ausgelistet → diese ist die aktuelle.)*
- Echtes **BLE 4.0** (kein SPP/Classic) → von Chrome (Web Bluetooth) **und** von einem nativen BLE-Plugin ansprechbar.
- Verbauter Chip: **SH-HC-08** (DSD TECHs HM-10-BLE-Modul) → bekanntes Protokoll:
  - Service-UUID **0xFFE0**, Write-Characteristic **0xFFE1**
  - Relais-Befehle (A0-Serie): `A0 01 01 A2` = K1 ein, `A0 01 00 A1` = K1 aus, `A0 02 01 A3` = K2 ein, `A0 02 00 A2` = K2 aus — **am echten Modul gegenchecken**
  - kein Pairing-PIN, keine Verschlüsselung
- 2 Kanäle mit **NO / COM / NC** → START über NO (Kanal 1), STOPP über NC (Kanal 2).
- Onboard-Relais 10 A — reicht, weil es nur das Bosch-Relais *ansteuert* (~0,2 A) bzw. die Zündspule schaltet (~4 A).

### 3.2 Der Muskel für Klemme 50 — Startrelais 70 A
[Bosch 0986332002 Mini-Relais 12 V 70 A (Schließer)](https://www.amazon.de/Bosch-0986332002-10331651-Relais-Arbeitsstrom/dp/B00BHKEFNK)
- Markenware, IP5K4 — bewusst **nicht** das No-Name-„80 A" (laut Rezensionen oft geschönt, stirbt unter Last).

### 3.3 Stromversorgung (Tisch-Test) ✅ BESTELLT (2026-06-24, Lieferung 25.06.)
Nur für den Bench-Test — **nicht** fürs Auto (da kommen die 12 V aus der Bordbatterie). 12 V DC genügt, das Modul zieht < 0,15 A.
- [Sunload 12 V / 2 A Steckernetzteil](https://www.amazon.de/Sunload-Steckernetzteil-2000mA-Hohlstecker-Netzteil/dp/B00J4RVN24) (Hohlstecker 5,5×2,1 mm)
- [Hohlstecker → 2-Pin-Schraubklemmen-Adapter](https://www.amazon.de/Stecker-Hohlstecker-Terminal-Netzteil-Schraubbar-DC-Block-2-Pin/dp/B08LYPN3JK)
- Anschluss: Netzteil → Adapter → zwei Drähte in die **DC+ / DC−**-Klemmen des Moduls (Polung beachten).

> **Nicht** gebraucht: das 500-A-Self-Starter-Relais (Vikye o.ä.) — war für die alte „Hauptstrom schalten"-Idee.

---

## 4. Verdrahtung (Kaskade)

```
START:  App →BLE→ DSD Kanal 1 (NO) → treibt Spule Bosch-70A → Bosch schaltet 12V auf Klemme 50 → Anlasser dreht
STOPP:  App →BLE→ DSD Kanal 2 (NC, in Reihe mit Zündspule) → öffnet kurz → Motor aus
```

DSD-Kanal 1 fasst den dicken Trigger nie selbst an — er weckt nur das Bosch-Relais, und das steckt den
40–50-A-Inrush weg.

---

## 5. Software — Solita-Tool `solita-engine.js`

Self-registering Add-on im bewährten Muster (`window.SolitaTools`, kein Core-Eingriff, Regel 7).
Registriert **zwei Werkzeuge**:

- **`start_engine`** — pulst Kanal 1 (Klemme 50) ~0,9 s = Anlasser.
- **`stop_engine`** — pulst Kanal 2 (Zündung) ~1,5 s = Motor aus.

**Web Bluetooth — wichtige Randbedingung:** `navigator.bluetooth.requestDevice()` braucht eine **User-Geste**
(Tap/Klick), läuft also **nicht** aus einem sprach-getriggerten Handler. Lösung: einmaliges **Koppeln per Knopf**
(`window.SolitaPagode.pair()`); danach bleibt die Verbindung stehen und die Sprach-Tools schreiben ohne neue Geste.

**Sicherheit:** Einen echten Motor per Sprache anzulassen ist heikel (Gang!). Im **Real-Modus** ist `start_engine`
deshalb **zweistufig** — erst Rückfrage „Soll ich die Pagode wirklich starten?", erst bei `confirmed=true` dreht
der Anlasser. (Im Testmodus übersprungen, damit der Flow schnell durchläuft.)

**Testmodus (`CONFIG.SIM_MODE = true`):** ohne Hardware. Solita läuft den ganzen Sprach-Flow trocken durch und
bestätigt „Pagode gestartet (Testmodus)". → **Genau das können wir JETZT schon testen**, bevor das BT-Modul da ist.

**Wenn die Hardware da ist:**
1. Protokoll am echten Modul gegenchecken (sollte SH-HC-08-Standard sein: Service **0xFFE0**, Char **0xFFE1**,
   A0-Befehle) — Datenblatt oder kurz mit *nRF Connect*.
2. Werte in den `CONFIG`-Block von `solita-engine.js` (bzw. die APK-BLE-Schicht) eintragen, `SIM_MODE = false`.
3. Koppel-Knopf einbauen (User-Geste → Pairing/Connect).

### 5.1 App-Architektur — entschieden 2026-06-24

Zwei BLE-Transporte, **gleiche** Befehls-Bytes + Timing:
- **Web Bluetooth** (`navigator.bluetooth`) — nur im **Chrome-Browser** (Android/Desktop). Schneller Smoke-Test
  ohne Build. **Geht NICHT** im APK-WebView.
- **Capacitor + natives BLE-Plugin** (`@capacitor-community/bluetooth-le`, `BleClient`) — für die **APK**.
  Capacitor bleibt, der ganze Web-/Solita-Code bleibt; nur der BT-Aufruf geht durch die native Brücke.
  **Nicht** voll nativ (kein Kotlin-Neuschrieb, kein Android-Studio-from-scratch).

Vorgehen:
1. **Test-APK** (Capacitor) mit zwei Knöpfen **ON / OFF** → beweist Modul + Protokoll isoliert. Manuelle Fernbedienung.
2. **Solita** erbt **dieselbe** BLE-Schicht (connect + `BleClient.write` mit A0-Befehlen). `start_engine` /
   `stop_engine` lösen per Stimme genau das aus, was die Knöpfe tun. Solita = Sprach-Fernbedienung desselben Moduls.

Beide reden mit **einem** Modul über **eine** BLE-Funktion — die APK ist der Prüfstand, dessen BLE-Teil Solita 1:1 übernimmt.

### 5.2 Startschutz + Sim-Modus (2026-07-09)

Optionaler **Startschutz** vor START (STOP bleibt immer ungated — Motor-aus muss sofort gehen). Zentrales
Modul `HTML/pagode/js/pagode-auth.js` (Single-Source wie `pagode-ble.js`), Zahnrad oben rechts in `pagode.html`.
Drei per Zahnrad wählbare Modi (gemerkt in `localStorage`):
- **Aus** — kein Schutz (Default)
- **PIN** — app-eigene PIN, nur **salted SHA-256** im `localStorage` (nie die PIN selbst); überall (Chrome + APK)
- **Biometrie** — System-`BiometricPrompt` via `@aparajita/capacitor-biometric-auth` (Finger *oder* Gesicht,
  das Handy entscheidet — die App kann keins erzwingen). **Nur APK**; im Browser als „nur in der App" gemeldet.

**Sim-Modus** (hardware-frei, Chrome + APK): Fake-Modul, das sofort „verbindet" und die Relais-Befehle nur
quittiert → ganzer Ablauf connect → Gate → halten → START/STOP ohne echtes Modul testbar. An per `?sim=1` / `#sim`
oder Knopf **Simulation** im Blauzahn-Dialog (Lämpchen antippen). Im Sim zeigt **Biometrie** einen
**Fake-Fingerabdruck** (antippen = entsperrt) statt der „nur in der App"-Meldung.

**APK-Neubau nötig, damit Biometrie echt greift** (die alte `doc-alvers-pagode.apk` vom 7.7. ist noch ohne).
Plugin (`package.json`, `^8` für Capacitor 6) + `USE_BIOMETRIC` im Manifest sind schon eingetragen — auf dem Mac:

```bash
cd pagode-app
git pull origin main   # holt diesen Stand auf den Mac (pull = Hol-Richtung; kein PR nötig)
npm install            # holt Biometrie-Plugin + Capacitor
npm run cap:sync       # kopiert Seite + js (auch pagode-auth.js) + Plugin nach android/
npm run cap:open       # Android Studio → Build → APK
```

---

## 6. Status

- [x] Elektrik-Konzept geklärt (Klemme 50 statt Hauptstrom)
- [x] Hardware ausgewählt (DSD BLE 2-Kanal + Bosch 70 A)
- [x] `solita-engine.js` gebaut — `start_engine` / `stop_engine`, **SIM_MODE an**
- [x] in `solita.html` eingebunden → **im Testmodus sprechbar**
- [x] **BT-Modul bestellt** (2026-06-24 — DSD TECH 2-Kanal BLE, B0DPLCRJ98, SH-HC-08-Chip)
- [x] **Stromversorgung bestellt** (2026-06-24 — Sunload 12 V/2 A + Klemmen-Adapter, Lieferung 25.06.)
- [x] **Test-Seite** `HTML/pagode/pagode-remote.html` gebaut (Web Bluetooth + Plugin, FFE0/FFE1/A0)
- [x] **Capacitor-Scaffold** `pagode-app/` gebaut (BLE-Plugin, Single-Source via `npm run prep`)
- [x] **Startschutz** (Aus / PIN / Biometrie) + **Sim-Modus** + Fake-Fingerabdruck gebaut (2026-07-09, siehe §5.2)
- [ ] **Pagode-APK neu bauen** auf dem Mac → Biometrie echt (git pull → npm install → cap:sync → Build)
- [ ] BT-Modul + Netzteil eingetroffen *(Doc, ~25.06.)*
- [ ] im **Chrome** testen: Modul an 12 V → Connect → PULS Kanal 1 → Relais klackt → Protokoll FFE0/FFE1/A0 gegenchecken
- [ ] **Test-APK** bauen (`pagode-app`: npm install → cap:add → BLE-Permissions → cap:sync → Build)
- [x] **Solita auf die gemeinsame BLE-Schicht umgestellt**: `solita-engine.js` nutzt `window.PagodeBLE`
  (`js/pagode-ble.js`) — dasselbe Modul/Protokoll (FFE0/FFE1/A0) wie die START/STOPP-Knöpfe; die alte
  Doppel-Kopie ist raus, `SIM_MODE` default **false** (echt nur solange gekoppelt, sonst Trockenlauf). Die
  Sicherheits-Gates (deliberate Phrase „ja"+Verb+„Pagode" + GPS-Motion-Gate) bleiben.
- [ ] **Koppel-Knopf** in `solita.html`: Web Bluetooth braucht eine **User-Geste** zum Koppeln (geht nicht aus
  einem Sprach-Handler); bisher nur per `SolitaPagode.pair()` aus der Konsole. Kleiner „Pagode koppeln"-Knopf,
  der `pair()` auf Tap aufruft.
- [ ] **BLE-Plugin in die Solita-APK**: der native Pfad (`@capacitor-community/bluetooth-le`) steckt bisher nur
  in `pagode-app`, nicht in `solita-app`. In **Chrome** läuft Solita→Modul; in der **Solita-APK** erst nach Einbau.
- [ ] im Auto verdrahten (Bosch-70A an Klemme 50, Kanal-2-NC in die Zündung)
- [ ] erster echter Start 🎉

> **Reihenfolge fürs nächste Mal:** erst Hardware in Chrome gegenchecken (Modul an 12 V, Protokoll
> FFE0/FFE1/A0 bestätigen) → **Koppel-Knopf** → **BLE-Plugin in die Solita-APK** → im Auto verdrahten.
