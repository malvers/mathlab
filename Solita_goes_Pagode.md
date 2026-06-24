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

### 3.1 Das Gehirn — 2-Kanal **BLE**-Relaismodul
[DSD TECH 2-Kanal Bluetooth 4.0 BLE Relay-Modul](https://www.amazon.de/-/en/2-channel-Bluetooth-module-iPhone-Android/dp/B07MCBX6F1)
- Echtes **BLE** → Web-Bluetooth-App im Handy-Browser kann direkt drauf (SPP-Module können das nicht).
- 2 Kanäle mit **NO / COM / NC** → START über NO, STOPP über NC.
- Onboard-Relais 10 A — reicht, weil es nur das Bosch-Relais *ansteuert* (~0,2 A) bzw. die Zündspule schaltet (~4 A).

### 3.2 Der Muskel für Klemme 50 — Startrelais 70 A
[Bosch 0986332002 Mini-Relais 12 V 70 A (Schließer)](https://www.amazon.de/Bosch-0986332002-10331651-Relais-Arbeitsstrom/dp/B00BHKEFNK)
- Markenware, IP5K4 — bewusst **nicht** das No-Name-„80 A" (laut Rezensionen oft geschönt, stirbt unter Last).

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
1. BLE-Protokoll des DSD-Moduls ermitteln (Datenblatt oder mit *nRF Connect* sniffen): `SERVICE_UUID`,
   `CHAR_UUID`, Kommando-Bytes für Kanal 1/2 ON/OFF.
2. Diese Werte in den `CONFIG`-Block von `solita-engine.js` eintragen.
3. `CONFIG.SIM_MODE = false`.
4. Koppel-Knopf einbauen (ruft `window.SolitaPagode.pair()` in einer User-Geste).

---

## 6. Status

- [x] Elektrik-Konzept geklärt (Klemme 50 statt Hauptstrom)
- [x] Hardware ausgewählt (DSD BLE 2-Kanal + Bosch 70 A)
- [x] `solita-engine.js` gebaut — `start_engine` / `stop_engine`, **SIM_MODE an**
- [x] in `solita.html` eingebunden → **im Testmodus sprechbar**
- [ ] BT-Modul bestellt / eingetroffen *(Doc)*
- [ ] BLE-Protokoll eintragen, `SIM_MODE=false`, Koppel-Knopf
- [ ] im Auto verdrahten (Bosch-70A an Klemme 50, Kanal-2-NC in die Zündung)
- [ ] erster echter Start 🎉
