# Tracker — Bugfix-Warteschlange

> **Zweck:** Dokumentierte, **offene** Fehler im Tracker. Jeder Eintrag selbst-tragend: Symptom · Ursache (belegt) · Fundstelle · Fix-Richtung · Akzeptanz · was NICHT zu tun ist.
> **Hausregeln: siehe [`../../CLAUDE.md`](../../CLAUDE.md)** (wird automatisch geladen). Insbes.: nichts ohne Docs „go" (2/4) · **erst messen, dann fixen** (Logs ins DEBUG-Fenster `DebugWindow.log(...)`, NIE `console.log`) · vor jedem Edit die genannten Zeilen **neu greppen** (Code wandert).
> Status: `🐞 offen` · `🅿️ geparkt` (Fix existiert, nicht integriert) · `🔍 erst messen` (Ursache braucht Live-Messung).

---

## BUG-2 — Regenradar zeigt in Deutschland keinen Regen 🐞 offen
**Priorität:** mittel-hoch (live bei Frankfurt-Starkregen reproduziert: Karte zeigte 0 Regen).
**Symptom:** Innerhalb der deutschen DWD-Abdeckung zeigt der REGEN-Overlay nichts, obwohl es real stark regnet.
**Ursache (Architektur-Falle):** Das Composite malt EU (RainViewer) **überall AUSSER innerhalb der deutschen Radar-Abdeckung**; innen kommt **ausschließlich DWD**. Ist die DWD-Quelle leer/stale, bleibt DE leer, obwohl RainViewer den Regen hätte. Der Health-Check kippt nur bei **hartem Ausfall** (HTTP 503/HTML), nicht bei „Kacheln laden, zeigen aber 0 Regen".
**Fundstellen (`HTML/js/rain-radar.js`, neu greppen):** `DWD_RV_LAYER` / `GERMANY`-Box · `dwdHealthy` · `pickProvider()` (`(dwdEnabled && dwdHealthy && germanyInView()) ? 'dwd' : 'rv'`) · DWD-Probe · Composite-Logik (DWD innen / RainViewer außen, Coverage-Maske `cov`). Recolour-Schwellen in `rain-recolor.js` + `rain-palette.js`.
**Erst eingrenzen (am Gerät, NICHT beim Fahren):** Taste **`d`** erzwingt RainViewer überall (inkl. DE) — erscheint dann Regen → Problem liegt im **DWD-Composite/Coverage-Pfad**, nicht an den Daten. DebugWindow lesen (DWD-Probe OK/DOWN, N Frames, Quelle); DWD-WMS-Frame direkt prüfen (`maps.dwd.de/geoserver/dwd/wms`).
**Fix-Richtung (mit Doc):** Health-Check härten (auch „DWD-Frame praktisch leer trotz Regen anderswo" → RainViewer-Fallback **innerhalb** DE), Frame-Zeit gegen „echtes now" (stale-Erkennung). Bekannt: scheinbarer Ost-Versatz = DWD-**Vorhersage**-Frame (rv-Produkt +0…+2 h) → Observations-Layer oder „now"-Frame per GetCapabilities wählen.
**Akzeptanz:** Bei real-Regen über DE zeigt der Overlay Regen; bei DWD-Ausfall sichtbarer RainViewer-Fallback statt leerer Karte; kein Doppel-Rendern an der DWD/RV-Naht.

## BUG-5 — Live-Broadcast funktioniert (gerade) nicht 🐞 offen
**Priorität:** mittel (live reproduziert: Zuschauer sehen nichts; Links/Namen korrekt).
**Symptom:** Sender sendet Position über Supabase-Realtime-Broadcast auf Kanal `live:<name>`, Viewer (`view.html`) sieht nichts.
**Eingegrenzt:** ✅ Groß/Klein-Mismatch ausgeschlossen *(trotzdem als Robustheit: `view.html` den `?live=`-Key zusätzlich `.toLowerCase()`)* · ✅ gleiches Projekt/Key bestätigt (`tracker.js` == `view.html`, identische URL + publishable Key) ⇒ **Realtime-spezifisch.**
**Top-Verdächtige:** (1) **Realtime-Authorization** auf „require authorization"/private-channel umgestellt → public Broadcast (`broadcast:{self:false}`, kein `private:true`) wird abgelehnt. (2) **Key-Format-Umstieg** (`sb_publishable_…`) — Realtime-Websocket-Auth ggf. anders als DB/PostgREST. (3) Free-Projekt pausiert / Realtime-Quota.
**Splitting-Test (entscheidend):** Funktioniert **Tracks LADEN** noch? Ja → Projekt lebt, Realtime-only (V1/2). Nein → Projekt down/pausiert (V3).
**Schnellster Pinpoint:** in `view.html` den **`subscribe`-Status** sichtbar machen (SUBSCRIBED vs. CHANNEL_ERROR/TIMED_OUT) + Zähler empfangener Nachrichten → zeigt Abo-(Auth-) vs. Sende-Problem. ⚠️ Aus der Agent-Sandbox nicht testbar (Supabase-Host geblockt) → Doc/lokal nötig.
**Dateien:** `HTML/js/tracker.js` (`beginLive`/`broadcastLive`/`stopLive`) · `HTML/tracker/view.html`. **Folge-Idee → FEAT-16** (Presence/Rückkanal).

## BUG-6 — Activity-Erkennung wirkt nur speed-basiert 🐞 · 🔍 erst messen
**Priorität:** mittel (untergräbt FEAT-3 Parkplatz, WegCast-Radius, Reisemodus-Icon).
**Symptom:** Das Reisemodus-Icon (laufen/fahren) reagiert offenbar **nur auf die Geschwindigkeit**, nicht auf die echte Play-Services-Activity-Recognition.
**Struktur vollständig (verifiziert):** Dependency `play-services-location:21.3.0`, Manifest-Permission `ACTIVITY_RECOGNITION`, Plugin registriert (`MainActivity.java:12`), JS-Start `startActivity()` (`tracker.html`), Permission am Gerät erteilt → „nie gefragt" ausgeschlossen.
**Erst messen (DEBUG-Window, `🚶`-Zeilen):** `requestPermission → granted`, `ActRec.start ✓ / FEHLER`, `ActRec event: type=… conf=…`. Pushen → Pixel **kalt** neu starten → ein Stück (auch langsam) fahren → lesen.
**Drei Befunde → Fix:** (1) `start ✓` aber NIE ein `event` → API streamt nicht; wahrscheinlich nativ `RECEIVER_NOT_EXPORTED` in `ActivityRecognitionPlugin.java:100` blockt den Broadcast (Android 14+) → nativer Fix + APK-Build. (2) Events kommen, aber `on_bicycle/walking` beim Autofahren → JS-Speed-Korrektur (>25 km/h über X s → `in_vehicle`). (3) `FEHLER: …` nennt die Ursache direkt.
**NICHT raten:** zuerst die Log-Zeilen, dann entscheiden ob nativer oder JS-Fix.

## BUG-7 — Tempolimit-Schild zeigt falschen Wert 🐞 · 🔍 erst messen
**Symptom:** Die angezeigte Geschwindigkeits**begrenzung** (rundes Schild) stimmt offenbar nicht.
**Wo:** `HTML/js/tracker-speedlimit.js` — Overpass `way(around:35,…)[highway][maxspeed]`, nimmt den nächsten Weg per Geometrie, maxspeed-Parser, Throttle `MIN_INTERVAL_MS=5000` (neu greppen).
**Verdächtige (erst messen):** (1) **falscher Weg** — „nächster binnen 35 m" ist evtl. Nebenstraße/Gegenfahrbahn statt Hauptstraße. (2) **maxspeed-Tag** fehlt/uneindeutig → Nachbar greift. (3) **stale** durch Throttle/Overpass-Latenz. (4) Zonen-/`maxspeed:conditional`-Tags (DE) falsch interpretiert.
**Erst messen:** pro Abfrage ins DEBUG-Fenster: gewählter Weg (name/ref), roher maxspeed-Tag, Distanz, Kandidatenliste → zeigt, ob's die Wegwahl oder das Parsing ist.

## BUG-8 — Erkennung verwechselt Nachbar-Bauwerke (keine Blickrichtung) 🐞 offen
**Symptom:** Am Dresdner Standort sagt die Erkennung **immer „Stadtschloss"**, egal wohin die Kamera zeigt — tatsächlich ist es der **Zwinger** (beide dicht beieinander).
**Ursache (belegt):** Es gibt **keine Blickrichtung** — Client `HTML/js/tracker-media.js` schickt kein heading/bearing mit dem Foto; Edge Function `supabase/functions/identify/index.ts` gründet rein auf **lat/lng** (Wikipedia geosearch `gsradius=600`, Overpass `around:130-160 m`). Im Radius liegen Zwinger UND Schloss → ohne Heading rät es nach Nähe.
**Fix-Richtung (noch nicht bauen):** (1) **Client:** Heading erfassen (GPS `coords.heading` bei Tempo>0, sonst Kompass/DeviceOrientation) und beim Foto mitschicken. (2) **identify:** POIs im **Sichtkegel voraus** (Bearing Standort→POI ≈ Heading ±X°) bevorzugen statt nur Nähe.
**Caveat:** Heading im Stehen unzuverlässig (Kompass-Jitter) → breiter Kegel / Fallback auf Nähe.

## BUG-12 — Solita-Mikro hört nach App-Kill / Wegwischen weiter 🐞 **kritisch** (Datenschutz) · nativ/APK
**Gemeldet:** Doc 2026-06-18. Das Mikro darf **NIE** aktiv sein, nachdem die App aus „Letzte Apps" gewischt wurde.
**Symptom:** App weggewischt (WebView/Activity tot) → trotzdem meldet sich Solita gelegentlich im Hintergrund mit „ich höre" / reagiert aufs Weckwort. NICHT der gewollte Vosk-Wake bei gesperrtem Screen — sondern App vom Nutzer beendet, Mikro trotzdem an.
**Ursache (heißester Verdacht, code-belegt):** `SolitaVoiceService.onStartCommand` liefert **`START_STICKY`** (`solita-app/android/…/SolitaVoiceService.java` ~Z.109) → Android darf den Dienst nach Prozess-Tod neu starten (intent==null), auch wenn `onTaskRemoved` (~Z.346) `stopSelf()` ruft. Race/Sticky-Recreate = das Einfallstor. JS (`solita-wake.js`) kann's NICHT fixen — bei toter WebView läuft kein JS; nur die native Seite räumt auf.
**Fix-Richtung (nur Doc, APK-Rebuild):** (1) `onStartCommand` → **`START_NOT_STICKY`** (Start nur explizit aus Foreground/Login). (2) `onTaskRemoved` hart: Recognizer **synchron** stoppen + Mikro frei + Notification weg + `wantListening=false`. (3) **Audit aller Start-Pfade** (kein BootReceiver/Alarm/WorkManager/`bindService` ohne Nutzeraktion). (4) Invariante: Lauschen ⇒ immer sichtbare Mikro-Notification; nie nach App-Entfernen.
**Akzeptanz/Repro:** Nach Wegwischen `adb logcat -s SolitaVosk` → erscheint `recognizer STARTED — LISTENING` = belegt. Auch: grüner Mikro-Punkt + ob eine Solita-FGS-Notification liegt (lauscht er OHNE = Regelbruch).
**Workaround:** vor dem Schließen Logout (👂 aus → `stopNativeWake()`), oder Mikro-Recht „nur während Nutzung".
**NICHT:** im JS/Web fixen wollen — zwingend `SolitaVoiceService.java` + APK-Rebuild.

---

## Querverweise
- Features: [`feature-requests.md`](feature-requests.md) · Ideen: [`ideen.md`](ideen.md) · Onboarding: [`agents.md`](agents.md)
