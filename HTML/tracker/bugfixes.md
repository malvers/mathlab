# Tracker — Bugfix-Warteschlange

> **Zweck:** Dokumentierte, **offene** Fehler im Tracker. Jeder Eintrag selbst-tragend: Symptom · Ursache (belegt) · Fundstelle · Fix-Richtung · Akzeptanz · was NICHT zu tun ist.
> **Hausregeln: siehe [`../../CLAUDE.md`](../../CLAUDE.md)** (wird automatisch geladen). Insbes.: nichts ohne Docs „go" (2/4) · **erst messen, dann fixen** (Logs ins DEBUG-Fenster `DebugWindow.log(...)`, NIE `console.log`) · vor jedem Edit die genannten Zeilen **neu greppen** (Code wandert).
> Status: `🐞 offen` · `🅿️ geparkt` (Fix existiert, nicht integriert) · `🔍 erst messen` (Ursache braucht Live-Messung).

---

> ## 🔎 Audit 2026-07-04 (Code-Stand)
> Automatischer Abgleich **aller** Bugs gegen den echten Code — 56 Agenten, jede „erledigt/teilweise"-Behauptung adversarial gegengeprüft.
> - **✅ gebaut:** **BUG-8** (Blickrichtung/Sichtkegel — nur `identify`-Deploy + Feld-Check offen).
> - **⚠️ teilweise:** **BUG-5** (Diagnose/Härtung da, Broadcast-Kern offen) · **BUG-7** (alle Fixes gebaut, nur Mess-Log + Geräte-Bestätigung offen) · **BUG-12** (nativ/APK) · **BUG-13** (Code da, Geräte-Test offen) · **BUG-14** (Marken-Suche gebaut, ein Teilfall offen) · **BUG-15** (Variante B gebaut).
> - **🐞 wirklich offen:** **BUG-2** (Regenradar-DE) · **BUG-6** (Activity-Erkennung).

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

## BUG-8 — Erkennung verwechselt Nachbar-Bauwerke (keine Blickrichtung) ✅ gebaut (Deploy + Feld-Check offen)
**Gebaut (2026-07-04):** Client schickt die Kamera-**Blickrichtung** (Kompass `getHeading()`) mit dem Foto (`tracker-media.js` → `tracker-compass.js` → `tracker.js`); `identify` bevorzugt POIs im **±55°-Sichtkegel** voraus (`bearingTo`/`angDiff`, Overpass `out center`) statt reiner Nähe. Ohne Kompass byte-identisch zum alten Verhalten. **→ Offen:** `supabase functions deploy identify --no-verify-jwt` (Doc) + Feld-Check Zwinger/Schloss.
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

## BUG-13 — Solita „mach ein Foto" (take_photo) geht noch nicht 🐞 offen · 🔍 erst am Gerät messen
**Gemeldet:** Doc 2026-06-22 (im **Solita-APK** getestet). Ziel: „Solita, mach ein Foto" → Kamera auf → Bild im Chat → (später) KI-Analyse. **Kein** Button-UI gewollt, rein per Zuruf (Tool).
**Symptom:** „mach ein Foto" öffnet keine Kamera; Solita/Claude antwortet direkt. Anfangs waren auch **andere** neue Tools „weg".
**Ursache 1 — Cache (GEFIXT, Commit `34e4802`):** `solita.html` lud die JS **ohne `?v=`** → die APK (live-load von `docalvers.de`, **kein** Service-Worker) servierte aus dem WebView-HTTP-Cache ein **altes `solita-core.js` ohne `take_photo`** → Claude hatte das Tool gar nicht. Fix: `window.__ASSET_V` aus `document.lastModified` + Loader-Array (wie `tracker.html`). **Greift erst, wenn die alte `solita.html` aus dem ~10-min-Geräte-Cache fällt** → warten ODER Android: App-Daten/Cache von „Solita" leeren.
**Ursache 2 — Kamera aus async Tool-Call (OFFEN, noch nicht belegt):** `take_photo` ruft `PhotoCapture.capture()` **innerhalb des async Tool-Loops** auf (nach der Modell-Antwort). Verdacht: fehlender **User-Gesten-Kontext** und/oder **Kamera-Permission** im WebView → `NativeCam.getPhoto` öffnet nicht. APK hat `@capacitor/camera` (`solita-app/package.json`) → nativer Pfad sollte greifen.
**Fundstellen (neu greppen):** `HTML/js/solita-core.js` (`take_photo` in `SOLITA_TOOLS` + `execTool` + `toolBadge`, `lastPhoto`) · `HTML/js/photo-capture.js` (`capture`, `isNative` via Capacitor) · `HTML/solita/solita.html` (Loader) · `solita-app/capacitor.config.json` (`server.url` live-load).
**Erst messen (DebugWindow, auf CLAUDE — DeepSeek hat KEINE Tools):** Wird `take_photo` überhaupt aufgerufen (Badge „📷")? Loggt `NativeCam.getPhoto` Start/Fehler? Permission-Prompt? → entscheidet Gesten- vs. Permission- vs. Plugin-Problem.
**Fix-Richtung (falls Gesten/async):** Kamera **innerhalb des User-Send-Taps** öffnen — Keyword-Pre-Intercept im Send-Handler (Foto-Absicht erkennen → `PhotoCapture.capture()` sofort, dann Bild dem Modell anhängen) statt erst im Tool nach dem Round-Trip.
**Akzeptanz:** „mach ein Foto" (Claude) → native Kamera auf → Bild im Chat (`lastPhoto` gesetzt). **Inhaltliche Bildanalyse = separates Feature** (generischer `gemini`-Proxy, multimodal).
**NICHT:** auf **DeepSeek** testen (Tools feuern dort nie) · nicht in **Solita-im-Tracker** suchen (anderer Code `tracker-solita.js`, Tool dort nicht eingebaut).

## BUG-14 — „nächste Tankstelle/Aldi/Lidl/Hornbach" führt NICHT zum nächstgelegenen 🐞 offen
**Gemeldet:** Doc 2026-06-23 (am Gerät, funktioniert nicht). „Ich sage Aldi / Lidl / Hornbach und er führt mich nicht zum Nächstgelegenen."
**Versucht (Commit `7c842d6`, wirkungslos):** `geocode()` holt mit GPS `limit=10` Kandidaten + weichem viewbox-Bias und wählt den **geografisch nächsten** (Haversine) statt Nominatims importance-Top.
**Warum's nicht reicht (Verdacht):** **Nominatim `/search` ist ADRESS-orientiert, kein POI-/Marken-Finder.** Für Markennamen liefert es den **nahen Filial-Eintrag oft gar nicht** in den Top-10 (global nach „importance" gerankt) — dann kann „nächster aus 10" ihn nicht wählen, weil er **nicht in der Liste** ist. Markennamen sind als POI (`shop=`/`name`) getaggt, nicht als Adresse.
**Fundstelle:** `HTML/js/tracker-nav.js` → `geocode()`.
**Fix-Richtung (richtig, noch nicht gebaut):** Für „nächstes X" (Marke/Kategorie) eine **Overpass-Query um die aktuelle Position** (`node/way[shop=…]` bzw. `[amenity=fuel]`, `[name~"Aldi",i]`) im wachsenden Radius, **nach Distanz sortiert** → echtes „nearest". Nominatim nur für echte Adressen. Heuristik: sieht die Eingabe wie Marke/Kategorie aus → Overpass-Pfad; sonst Nominatim.
**NICHT:** weiter an `limit`/`viewbox` drehen — löst das POI-Problem nicht.

## BUG-15 — Off-Route: Reroute „zieht zurück" / Chaos 🐞 offen · 🔍 erst am Gerät messen
**Gemeldet:** Doc 2026-06-23: „absolutes Chaos und Desaster." Beim Abweichen soll **sauber eine neue Route VORWÄRTS** berechnet werden, statt auf die alte zurückzuführen.
**Versucht (Commit `7c842d6`, hilft nicht / macht's evtl. chaotischer):** off-route alte Abbiegeansagen unterdrücken + Banner „Route wird neu berechnet" + Reroute von der aktuellen Position (`update()` / `computeRoute(here,true)`).
**Warum's nicht reicht (Verdacht):** (a) **Kein Bearing-Constraint:** OSRM nimmt von `here` den **kürzesten** Weg zum Ziel — das ist oft ein **U-Turn zurück** auf die alte Route → genau das „zieht zurück". (b) **Flapping:** `OFFROUTE_M=30 m` + `REROUTE_COOLDOWN_MS=6000` → wiederholte Neuberechnungen, „Route wird neu berechnet" im Loop. (c) die neue Route deviiert evtl. sofort wieder.
**Fundstelle:** `HTML/js/tracker-nav.js` → `update()`, `computeRoute()` (OSRM-URL baut nur `coords`, **keine** `bearings`).
**Fix-Richtung (Docs „Trick mit Navigationspunkten"):** OSRM **`bearings=`** mit dem aktuellen GPS-**Heading** an der Startkoordinate → erzwingt Abfahrt in Fahrtrichtung, **kein sofortiger U-Turn**. Alternativ ein **Via-Punkt ~50–100 m voraus** in Fahrtrichtung. Plus **Flapping dämpfen** (Hysterese: Reroute erst nach N aufeinanderfolgenden Off-Route-Fixes, längeres Debounce).
**Akzeptanz:** eigene Abzweigung nehmen → **eine ruhige** Neuberechnung vorwärts, kein U-Turn-zurück, kein „neu berechnen"-Loop.
**NICHT:** nur die Ansagen unterdrücken (Symptom) — der Kern ist die **Routing-Richtung** (bearings/via). Erwägen, den wirkungslosen Teil von `7c842d6` zurückzunehmen, bis es richtig gebaut ist.
**Update 2026-06-30 (Doc „A"):** Widerspruch gefunden — die 2026-06-25-Notiz „Google reroutet **plain**" (`USE_DEPART_BEARING=false`) galt nur für die OSRM-**Fallback**, der **Default-Motor ORS** bekam beim Reroute weiter das Heading (`computeRoute(...,travelBrg)` → `fetchRerouteORS` → `bearings:[[hdg,60],[0,180]]`). Der Cone zwingt „vorwärts-ish" → fährt weiter und wendet später = das „zieht zurück". **Fix:** `computeRoute()` schickt jetzt auch an ORS `null` als Heading → ORS reroutet plain, Roadgraph + U-Turn-Penalty entscheiden (wie Google). **Noch offen am Gerät zu prüfen:** (b) der Re-Reroute-Loop, solange man bewusst off-line bleibt (`offRouteCount` nullt nur *auf* der Linie) — hier vorerst KEINE Änderung (Doc wählte nur „A").

## BUG-16 — Überholverbot-Badge erscheint im Feld nie (+ Schritttempo „5/7" fehlt) 🔍 erst messen
**Priorität:** niedrig-mittel (Feld 2026-07-04, Doc: „Überholverbot habe ich im Tracker praktisch **noch nie** gesehen — wir haben nicht mal das Schild dafür"). Ebenfalls beobachtet: ein reales „**5**"-Schild (Schrittgeschwindigkeit) tauchte nicht auf.
**Symptom:** Das Überholverbot-Icon (und Maut) wird zwar gerendert (`setAdvisories()`), erscheint live aber so gut wie nie. Ein Schritttempo-Schild wurde nicht angezeigt.
**Vermutete Ursache (noch zu belegen — erst messen):**
- (a) **OSM taggt dünn:** Überholverbot meist `overtaking:forward/backward=no`, selten `overtaking=no`; wir lesen beide Formen, aber die Basisdaten fehlen oft schlicht.
- (b) **Advisory hängt an der gewählten Fahrbahn:** `advTags = conf.tags || def.tags` — wenn der Heading-Filter / „nur-signiert" eine andere Fahrbahn wählt (oder keine), gehen die `overtaking*`-Tags verloren.
- (c) **„5" vs. 7:** verkehrsberuhigter Bereich = `living_street` → wir zeigen **7**, nicht 5. Ein echtes `maxspeed=5` sollte als Zahl durchgehen — prüfen, ob es an Alignment/Query lag oder ob OSM dort schlicht nichts hatte.
**Fundstellen (`HTML/js/tracker-speedlimit.js`, neu greppen):** `setAdvisories()` · `NO_OVERTAKE_SVG` · `advTags = conf.tags || def.tags` · `overtaking` / `overtaking:forward` / `overtaking:backward` · `parseMax()` (`walk`/`living_street` → 7).
**Erst messen (DebugWindow, NICHT beim Fahren):** auf einer bekannten Überholverbot-Strecke prüfen, ob Overpass die `overtaking*`-Tags überhaupt liefert und ob `advTags` gesetzt wird — erst dann fixen (Regel: erst messen).
**Bezug:** Motivation für **FEAT-35** (manuelles Nachtragen, wenn OSM leer/dünn ist).

---

## Querverweise
- Features: [`feature-requests.md`](feature-requests.md) · Ideen: [`ideen.md`](ideen.md) · Onboarding: [`agents.md`](agents.md)
