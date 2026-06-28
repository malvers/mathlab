# BUG (kritisch): Solita hört nach App-Kill / Wegwischen weiter

**Gemeldet von Doc, 2026-06-18.** Einstufung: **kritisch** (Datenschutz/Vertrauen).
Das Mikrofon darf **niemals** aktiv sein, nachdem die App vom Nutzer beendet
(aus „Letzte Apps" gewischt) wurde.

> Doc: „Selbst wenn man sie abkillt / rauswischt — wenn die gar nicht mehr läuft
> und Solita trotzdem noch hört, da ist massiv was faul. Hin und wieder kommt im
> Hintergrund ‚ich höre'. Ich habe jetzt das Update installiert; wenn es **noch
> mal** passiert, ist das Problem reproduziert."

Das ist **nicht** der gewollte Wake-Mechanismus (Vosk-Hintergrund-Wake bei
gesperrtem Screen). Das ist der Fall **App vom Nutzer beendet → trotzdem Mikro
aktiv**. Das muss zu 100 % aufhören.

---

## Symptom
- App wird aus „Letzte Apps" gewischt (Task entfernt) → WebView/Activity ist weg.
- Trotzdem meldet sich Solita gelegentlich im Hintergrund mit „ich höre" / reagiert
  auf das Weckwort → der native Vosk-Dienst hält offenbar weiter das Mikro.

## Wo das herkommt (native, nicht Web)
Das ist ein **nativer/APK-Befund** — der JS-Code (`solita-wake.js`) stoppt den
Dienst nur bei **Logout** (`stopNativeWake()`). Beim Wegwischen läuft **kein JS
mehr** (WebView tot), also kann nur die **native** Seite aufräumen:

- `solita-app/android/app/src/main/java/de/docalvers/tracker/SolitaVoiceService.java`
- (+ `SolitaVoicePlugin.java`, `MainActivity.java`)

### Was der Dienst HEUTE schon richtig macht (Stand Quelltext)
- `onTaskRemoved()` (Z. 346–352): `stopForeground(true)` + `stopSelf()` → beim
  Wegwischen **soll** der Dienst sterben; `onDestroy()` macht den Vosk-Teardown
  (`stopRecognizer()`: SpeechService.shutdown + Recognizer.close → Mikro frei).
- Läuft als **Foreground-Service mit Mikrofon-Typ** und Notification
  (`startForeground(..., FOREGROUND_SERVICE_TYPE_MICROPHONE)`, Z. 327) → solange
  er lauscht, **muss** eine Benachrichtigung sichtbar sein.

### Heißester Verdacht: `START_STICKY` lässt ihn auferstehen
- `onStartCommand(...)` gibt **`START_STICKY`** zurück (Z. 109). Damit darf Android
  den Dienst **nach Prozess-Tod neu starten** (mit `intent == null`). Auch wenn
  `onTaskRemoved` brav `stopSelf()` ruft, kann ein späterer System-Restart (Speicher
  zurückgeben, Sticky-Recreate) den Dienst wiederbeleben.
- Beim Sticky-Restart prüft `onStartCommand`:
  `if (wantListening && !activityResumed && model != null && speech == null) startRecognizer();`
  `wantListening` ist nach Prozess-Neustart per Default `false` (FIX 3) → er
  *sollte* nicht von allein lauschen. ABER: zwischen den FIX-Pfaden / Race-Bedingungen
  bleibt `START_STICKY` das Einfallstor. **Sauberer Fix: `START_NOT_STICKY`** — der
  Dienst wird nur noch **explizit** (Login/Foreground) gestartet, nie vom System.

### Weitere zu prüfende Ursachen (falls es nach dem Update WIEDER passiert)
1. **Update enthält den `onTaskRemoved`-Fix gar nicht** / altes APK lief noch →
   erst sicherstellen, dass das installierte APK diese Service-Version hat.
2. **Lauschen ohne sichtbare Notification** → wäre besonders alarmierend (Android
   verlangt bei Mikro-FGS eine Notification). Wenn im Hintergrund „ich höre" kommt,
   aber **keine** Solita-Benachrichtigung in der Leiste steht, lauscht er regelwidrig.
3. **Zweiter Start-Pfad** (BootReceiver, Plugin-`load()`, `bindService`, AlarmManager,
   WorkManager) der den Dienst unabhängig vom Wisch wieder hochzieht.
4. **Battery-/OEM-Eigenheit** (Pixel: meist sauber; andere OEMs starten Sticky-FGS
   aggressiver neu).

---

## So bestätigen wir es beim nächsten Mal (Doc / Reproduktion)
Nach dem Wegwischen der App:
1. **Mikro-Indikator**: grüner Punkt oben rechts im Pixel-Status — ist das Mikro
   nach dem Wisch noch „in use"?
2. **Notification**: liegt eine Solita-Vordergrund-Benachrichtigung in der Leiste?
   (Wenn er lauscht, MUSS sie da sein. Lauscht er ohne → Regelbruch.)
3. **Settings → Apps → Solita → (Entwickler) laufende Dienste**, oder
   `adb shell dumpsys activity services | grep -i solita`.
4. **Logcat**: `adb logcat -s SolitaVosk` — taucht **nach** dem Wegwischen eine
   Zeile `recognizer STARTED — LISTENING` auf? Das ist der Beweis.
5. **`/trigger` in Solita** (neu): zeigt „Vosk-Wake (Hintergrund/gesperrt)" mit
   Zeitstempel — wenn dort ein Eintrag **nach** dem App-Kill auftaucht, ist es belegt.

---

## Geforderter Fix (native/APK — nur Doc kann bauen)
1. **`onStartCommand` → `return START_NOT_STICKY;`** (kein automatischer
   System-Restart; Start nur explizit aus dem Foreground bei Login).
2. **`onTaskRemoved` hart machen**: Recognizer **synchron** stoppen + Mikro
   freigeben, Notification entfernen, `stopSelf()`. Sicherstellen, dass kein
   nachgelagerter Sticky-Recreate mehr Mikro greift (`wantListening=false` setzen).
3. **Audit aller Start-Pfade**: kein BootReceiver/Alarm/WorkManager/`bindService`,
   der den Dienst ohne Nutzeraktion (er-)startet.
4. **Invariante**: Recognizer-Lauschen ⇒ immer sichtbare Mikro-Notification; nie
   lauschen, wenn die App vom Nutzer entfernt wurde.
5. Optional als Sicherheitsnetz: beim Stoppen das Vosk-Model freigeben und beim
   nächsten **expliziten** Foreground-Start neu laden.

> Web-/Branch-Code kann das **nicht** beheben — sobald die WebView weg ist, läuft
> kein JS mehr. Es ist zwingend ein **APK-Neubau** mit geänderter
> `SolitaVoiceService.java`.

---

## Sofort-Workaround bis zum Fix
- **Logout** in Solita vor dem Schließen (`/logout` / 👂 aus) → `stopNativeWake()`
  beendet den Dienst sauber.
- Oder Android: **Mikrofon-Berechtigung** für Solita auf „nur während der Nutzung"
  bzw. entziehen, bis der Fix im APK ist.

*Stand: 2026-06-18. Quelle: `SolitaVoiceService.java` (onTaskRemoved vorhanden,
aber `START_STICKY`). Nächster Schritt: Doc bestätigt per Logcat/Notification,
dann START_NOT_STICKY + Start-Pfad-Audit im APK.*
