# Tracker — Bugfix-Warteschlange (für Subagenten)

> **Zweck:** Eine Arbeitsliste dokumentierter, **offener** Fehler im Tracker. Jeder Eintrag ist so
> geschrieben, dass ein Subagent ihn allein abarbeiten kann: Symptom · Ursache (belegt) · genaue
> Fundstelle · Fix-Richtung · Akzeptanz/Test · was NICHT zu tun ist.
> Erstellt 2026-06-12 als Dispatch-Schicht über den bestehenden Tiefen-Notizen. **Diese Datei dupliziert
> nichts** — sie verlinkt und destilliert. Stand der Code-Zeilen: 2026-06-12 (nach dem inline→module-Refactor).

## ⚡ Kurz-Übersicht
- ✅ **BUG-10 · gefixt 2026-06-20** — Navigation: Route-Fit jetzt dynamisch (Reststrecken-Fit beim Fahren)
- ✅ **BUG-9 · gefixt 2026-06-20** — Abbiege-Ansagen stumm aufm Pixel → jetzt über Cloud-TTS (`SolitaVoice`)
- **BUG-1** Speed-Anzeige km/h falsch · 🏗️ Fix gebaut (Anzeige vom Gate entkoppelt + Debug) · Feld-Test + Push offen
- **BUG-2** Regenradar zeigt in DE keinen Regen
- **BUG-3** 🅿️ Track strichelt bei Aufnahme-Pause
- **BUG-4** 🅿️ geparkte Tracker-Fixes sichten
- **BUG-5** Live-Broadcast geht nicht (Realtime/Usage-Limit)
- **BUG-6** Activity-Erkennung nur speed-basiert
- **BUG-7** Tempolimit-Schild falscher Wert
- **BUG-8** Erkennung ohne Blickrichtung (Zwinger↔Schloss)

## Hausregeln für JEDEN Subagenten (CLAUDE.md)
- **Regel 2/4:** NICHTS bauen/ändern/aufräumen ohne Docs ausdrückliches „go". Diese Liste ist Vorbereitung,
  kein Freibrief. Bei Unklarheit **eine offene Rückfrage**, keine Optionslisten (Regel 20).
- **Regel 7:** Shared UI/Logik nur in den **zentralen Dateien** ändern (`HTML/js/*`, `HTML/tracker/tracker.css`),
  nie pro-Lab patchen.
- **Regel „nie raten":** Werte/Verhalten **erst messen** (DebugWindow-Log), dann fixen. Logs gehen ins
  **DEBUG-Fenster** (`DebugWindow.log(...)`), NIE `console.log` (Doc hat DevTools nicht offen).
- **Regel 14/15:** Kommentare & Code auf Englisch.
- Vor jedem Edit die genannten Zeilen **neu greppen** — der Code wandert (Refactor).

## Status-Legende
`🐞 offen` dokumentiert, nicht gefixt · `🅿️ geparkt` Fix existiert auf einem Branch, nicht integriert ·
`🔍 erst messen` Ursache braucht noch eine Live-Messung

> ✅ **Quellen:** Die OTWA-Session vom 2026-06-11 (31 Commits) wurde **am 2026-06-12 in `main` gemerged**
> (Merge `48dc37e`). Die mit `🌿` markierten Notizen/Builds sind jetzt **lokal in `main` vorhanden** — das
> 🌿 zeigt nur noch ihre Herkunft an.

---

## BUG-1 — Geschwindigkeitsanzeige (km/h) ist unzuverlässig 🏗️ Fix gebaut (lokal) · Feld-Test offen
> **✅ Stand 2026-06-13 — lokal gebaut, NOCH NICHT gepusht/feldgetestet** (`HTML/js/tracker.js`):
> Die km/h-Anzeige ist vom `still`-Gate **entkoppelt** — sie zeigt jetzt den rohen GPS-Doppler
> `coords.speed × 3.6` unabhängig vom Gate; nur wenn kein Doppler kommt, greift der alte Distanz/Zeit-
> Fallback (regressionsfrei). Floor `SPEED_ZERO_KMH = 1.0` killt Doppler-Rauschen im Stand. Das Gate
> steuert weiterhin nur die **Aufzeichnung**, nicht mehr die Anzeige-Zahl. **Debug in vorhandene Surfaces
> (kein neues):** `#motion-dbg`-Leiste live `spd:<dop|calc|gate0>=<roh>→<shown>`, + einmal im DebugWindow,
> ob `coords.speed` überhaupt geliefert wird. **Offen:** 10 s stehen / 20 m gehen → je nach Doppler-Befund
> finalisieren (Floor justieren oder Fallback-Pfad fixen), dann committen+pushen. Doc-Entscheid: „gleich
> entkoppeln", Messen-zuerst durch das Live-Debug ersetzt.

**Priorität:** hoch (Doc-Schmerzpunkt, betrifft Live-Anzeige UND gespeichertes Speed-Profil).
**Tiefen-Notiz (Pflichtlektüre):** [`bug-geschwindigkeitsanzeige.md`](bug-geschwindigkeitsanzeige.md)
— enthält die volle, gegen den Code verifizierte Analyse + den beschlossenen Plan.

**Symptom:** Beim langsamen **Gehen** zeigt der Tracker oft **0 oder zu niedrig**; bei fehlendem
Doppler-Speed dagegen **Spikes/zu hoch**. Der Fehler wird zusätzlich **pro Punkt gespeichert** → das
Speed-Profil der Aufzeichnung erbt ihn.

**Ursache (belegt, 3 Mechanismen):**
1. **Speed hängt am Aufzeichnungs-Gate.** `shownSpeed = still ? 0 : …` nullt die Anzeige, obwohl das
   Gate eigentlich nur Positions-Jitter im Stand unterdrücken soll → Konstruktionsfehler.
2. **`posStill`-Band zu groß beim Gehen:** `band = max(MIN_MOVE_M, accuracy·ACC_STEP_FACTOR)` → bei ±20 m
   schon 14 m, bei ±50 m → 35 m. Langsame Schritte bleiben im Band → `still=true` → Speed 0.
3. **Sub-4-km/h überschreibt das Gate nicht** (`SPEED_MOVE_KMH=4`); Gehen ≈ 3–5 km/h.

**Aktuelle Fundstellen (2026-06-12, `HTML/js/tracker.js`):**
- `:489` `gpsMoving` / `SPEED_MOVE_KMH`
- `:490` `sensorStill` · `:496-500` `posStill` + `band` (`ACC_STEP_FACTOR`) · `:502` `still = sensorStill || posStill`
- `:546` **Speed-Kill** `shownSpeed = still ? 0 : (0.6*shownSpeed + 0.4*kmh)`  ← Kern
- `:563` `minStep` (Aufzeichnungs-Granularität, **getrennt** vom Anzeige-Fix behandeln)
- Konstanten (`MIN_MOVE_M`, `MAX_ACC_M`, `MAX_JUMP_KMH`, `ACC_STEP_FACTOR`, `SPEED_MOVE_KMH`) im
  Konstanten-Block oben in `tracker.js` — neu greppen.

**Schritt 1 — ZUERST messen (Regel „nie raten"):** Pro Fix ins DEBUG-Fenster loggen: roher
`coords.speed`, abgeleitetes `kmh`, `still`/`posStill`/`sensorStill`, `accuracy`, `band`, `dt`. 30 s gehen.
**Die eine offene Frage:** Liefert Pixel 8a / Lenovo überhaupt `coords.speed` (Doppler)?

**Schritt 2 — fixen je nach Befund:**
- **Doppler vorhanden →** Anzeige vom Gate **entkoppeln**: `coords.speed × 3.6` direkt zeigen, unabhängig
  von `still`. Im Stand ist Doppler ≈ 0, die Zahl fällt von selbst → harter Gate-Kill überflüssig.
  Regressionsfrei: fehlt Doppler, bleibt heutiges Verhalten.
- **Doppler null →** Fallback-Pfad fixen: `posStill` von der Speed-Logik lösen, `SPEED_MOVE_KMH` ~2,
  EMA **zeitbasiert** (Gewicht aus `dt` statt pro Fix).

**Akzeptanz/Test:** Langsam (~3 km/h) gehen → Anzeige folgt plausibel statt 0/Sprünge; stehen → fällt auf 0;
gespeicherter `spdVal` pro Punkt erbt den korrigierten Wert (Profil wird automatisch korrekt).
Danach Debug-Logging wieder raus **oder** hinter ein Debug-Flag.

**NICHT tun:** die Aufzeichnungs-Granularität (`minStep`, `posStill` fürs Punkte-Setzen) im selben Schritt
anfassen — Risiko, Jitter im echten Stand wieder reinzuholen. Erst Display, dann separat entscheiden.

> **Hinweis:** Auf Branch `claude/unclear-request-g5ubA` (Commit `f4ee3a1`) liegt bereits ein Teil-Fix
> „GPS speed overrides the motion gate". Vor Neubau prüfen, ob er den Doppler-Fall schon löst → ggf.
> cherry-picken statt neu schreiben (siehe BUG-4).

---

## BUG-2 — Regenradar zeigt in Deutschland keinen Regen 🐞 offen
**Priorität:** mittel-hoch (live unterwegs bei Frankfurt-Starkregen reproduziert: Karte zeigte 0 Regen).
**Tiefen-Notiz (Pflichtlektüre):** [`bug-regenradar-kein-regen.md`](bug-regenradar-kein-regen.md)

**Symptom:** Innerhalb der deutschen DWD-Abdeckung zeigt der REGEN-Overlay nichts, obwohl es real stark regnet.

**Ursache (Architektur-Falle):** Composite malt EU (RainViewer) **überall AUSSER innerhalb der deutschen
Radar-Abdeckung**; innen kommt **ausschließlich DWD**. Ist die DWD-Quelle leer/stale, bleibt DE leer,
obwohl RainViewer den Regen hätte. Der Health-Check kippt nur bei **hartem Ausfall** (HTTP 503/HTML), nicht
bei „Kacheln laden, zeigen aber 0 Regen".

**Aktuelle Fundstellen (2026-06-12, `HTML/js/rain-radar.js`):**
- `:30` `DWD_RV_LAYER = 'dwd:Radar_rv_product_1x1km_ger'` · `:32` `GERMANY`-Box
- `:78` `dwdHealthy` · `:89-90` `pickProvider()` (`return (dwdEnabled && dwdHealthy && germanyInView()) ? 'dwd' : 'rv'`)
- `:97-107` DWD-Probe (setzt `dwdHealthy`) · `:124` `status()`
- `:145-175` Composite-Logik (DWD innen / RainViewer außen, Coverage-Maske `cov`)
- Recolour-Schwellen in `HTML/js/rain-recolor.js` + `HTML/js/rain-palette.js`

**Erst eingrenzen (am Gerät, NICHT beim Fahren):**
- Taste **`d`** im Tracker erzwingt RainViewer überall (inkl. DE). Erscheint dann Regen → Problem liegt im
  **DWD-Composite/Coverage-Pfad**, nicht an den Daten.
- DebugWindow lesen (DWD-Probe OK/DOWN, N Frames, Quelle). DWD-WMS-Frame direkt prüfen
  (`maps.dwd.de/geoserver/dwd/wms`, Layer `dwd:Radar_rv_product_1x1km_ger`).

**Fix-Richtung (zur Entscheidung mit Doc):**
- Health-Check härten: nicht nur HTTP-503, sondern auch „DWD-Frame praktisch leer trotz Regen anderswo" →
  RainViewer-Fallback **innerhalb** DE. Oder generell RainViewer als Sicherheitsnetz in DE zulassen, wenn DWD
  zu wenig liefert.
- Frame-Zeit gegen „echtes now" prüfen (stale-Erkennung).

**Akzeptanz/Test:** Bei real-Regen über DE zeigt der Overlay Regen; bei DWD-Ausfall sichtbarer
RainViewer-Fallback statt leerer Karte; kein Doppel-Rendern an der DWD/RV-Naht.

**🌿 Branch-Update 2026-06-11 (in der Notiz, kommt mit dem Merge):**
- **Zeit/UTC-Versatz ausgeschlossen** — Request stellt korrektes UTC, Anzeige lokal; Ursache bleibt DWD-seitig.
- **Ost-Versatz erklärt:** der scheinbare räumliche Versatz ist der **DWD-Vorhersage-Frame** (rv-Produkt
  +0…+2 h), keine Geometrie. Fix-Optionen: **Observations-Layer** statt Vorhersage-Produkt, oder den
  echten „now"-Frame per **GetCapabilities-Zeit** wählen.
- **Mobiler `d`-Test jetzt möglich:** Buttons d/k/w in Einstellungen → Debug (am Handy ohne Tastatur).

---

## BUG-5 — Live-Broadcast funktioniert (gerade) nicht 🐞 offen
**Priorität:** mittel (live unterwegs reproduziert: Zuschauer sehen nichts; Links/Namen korrekt).
**Tiefen-Notiz (🌿 Branch):** `bug-live-broadcast-funktioniert-nicht.md` — inkl. Eingrenzung vom 2026-06-11.

**Symptom:** Sender sendet Position über Supabase-Realtime-Broadcast auf Kanal `live:<name>`, Viewer
(`view.html`) sieht nichts.

**Eingegrenzt (2026-06-11):**
- ✅ **Groß/Klein-Mismatch ausgeschlossen** (Zuschauer öffneten den kopierten lowercase-Link).
  *Trotzdem als Robustheit drinlassen:* `view.html` den `?live=`-Key zusätzlich `.toLowerCase()`
  (`view.html:~466`, `goLive` `~358-367`).
- ✅ **Gleiches Projekt/Key bestätigt** (`tracker.js:1200-1201` == `view.html:220-221`, identische URL +
  publishable Key).
- ⇒ **Realtime-spezifisch.** Top-Verdächtige:
  1. **Realtime-Authorization** auf „require authorization"/private-channel-Pflicht umgestellt → public
     Broadcast (`broadcast:{self:false}`, kein `private:true`) wird abgelehnt.
  2. **Key-Format-Umstieg** (`sb_publishable_…`) — Realtime-Websocket-Auth ggf. anders als DB/PostgREST.
  3. **Free-Projekt pausiert** (Inaktivität) oder Realtime-Quota/Connection-Limit.

**Splitting-Test (entscheidend):** Funktioniert **LADEN (Tracks laden)** noch?
- **Ja** → Projekt lebt, Problem ist **Realtime-only** (Verdacht 1/2).
- **Nein** → ganzes Projekt down/pausiert (Verdacht 3).

**Schnellster Pinpoint:** in `view.html` den **`subscribe`-Status** sichtbar machen (SUBSCRIBED vs.
CHANNEL_ERROR/TIMED_OUT) + Zähler empfangener Nachrichten → zeigt sofort Abo-(Auth-) vs. Sende-Problem.
⚠️ Aus der Agent-Sandbox **nicht** testbar (Supabase-Host geblockt) → Doc/lokal nötig.

**Folge-Idee (Feature):** Rückkanal/Presence — Zuschauer-Zähler („3 sehen dich") + „zuletzt empfangen vor
2 s". Macht künftige Diagnose trivial. → in `feature-requests.md` aufnehmen.

**Dateien:** `HTML/js/tracker.js` (`beginLive`/`broadcastLive`/`stopLive`, ~971–1013) ·
`HTML/tracker/view.html` (~358–367, 466).

---

## BUG-3 — Track strichelt bei Aufnahme-Pause (nicht nur bei echtem GPS-Ausfall) 🅿️ geparkt
**Priorität:** niedrig (kosmetisch), aber Fix liegt schon vor.
**Wo:** Branch `claude/unclear-request-g5ubA`, Commit `d79cd74` „only dash the track on a real GPS dropout,
not a recording pause". **UN-integriert.**
**Aufgabe:** `git diff main..origin/claude/unclear-request-g5ubA -- <track-render>` ansehen; sauber
cherry-picken/integrieren. **Achtung (Memory `project_tracker_dashfix_parked`):** braucht ein neues
Punkt-Feld `gaps[]`, das **überall** mitgezogen werden muss (Renderer, Speichern, GPX). Branch **NICHT löschen**.
**Erst Doc fragen**, ob jetzt integrieren.

---

## BUG-4 — Geparkte Tracker-Fixes auf `claude/unclear-request-g5ubA` sichten 🅿️ geparkt
Auf dem Branch liegen drei `fix(tracker)`-Commits gegenüber main:
- `f4ee3a1` GPS-Speed überschreibt das Motion-Gate (→ relevant für **BUG-1**).
- `d79cd74` Strichel-Linie nur bei echtem GPS-Dropout (→ **BUG-3**).
- `efab4a9` Activity-Icon vertikal zentriert neben KM/H (kleiner UI-Fix).

**Aufgabe für den Sichtungs-Subagenten:** `git log --oneline main..origin/claude/unclear-request-g5ubA`
+ `git diff --stat`. Pro Commit beurteilen: noch relevant nach dem Refactor? Konfliktfrei? Empfehlung
(cherry-pick / neu schreiben / verwerfen) je Commit zurückmelden. **Nicht** blind mergen (Memory
`feedback_uwa_integration`). Branch **NICHT löschen** (Memory).

---

## BUG-6 — Activity-Erkennung wirkt nur speed-basiert 🐞 offen · 🔍 erst messen
**Priorität:** mittel (untergräbt alle Activity-abhängigen Features: FEAT-3 Parkplatz, WegCast-Radius, Reisemodus-Icon).
**Tiefen-Notiz (Pflichtlektüre):** [`activity-debug-morgen.md`](activity-debug-morgen.md)

**Symptom:** Das Reisemodus-Icon (laufen/fahren) reagiert offenbar **nur auf die Geschwindigkeit**, nicht
auf die echte Play-Services-Activity-Recognition.

**Struktur ist vollständig** (verifiziert): Dependency `play-services-location:21.3.0`, Manifest-Permission
`ACTIVITY_RECOGNITION`, Plugin registriert (`MainActivity.java:12`), JS-Start `startActivity()`
(`tracker.html:~1805` / `~2886`), Permission am Gerät erteilt. → „nie gefragt" ausgeschlossen.

**Erst messen (DEBUG-Window, `🚶`-Zeilen):** `requestPermission → granted`, `ActRec.start ✓ / FEHLER`,
`ActRec event: type=… conf=…`. Pushen → Pixel **kalt** neu starten → ein Stück (auch langsam) fahren → lesen.

**Drei mögliche Befunde → Fix:**
1. **`start ✓` aber NIE ein `event`** → API streamt nicht. Wahrscheinlich nativ: `RECEIVER_NOT_EXPORTED`
   in `ActivityRecognitionPlugin.java:100` blockt den Play-Services-Broadcast (Android 14+) → nativer Fix
   → gezielter APK-Build.
2. **Events kommen, aber `on_bicycle/walking` beim Autofahren** → JS-Speed-Korrektur (z. B. >25 km/h über
   X s → `in_vehicle`).
3. **`FEHLER: …`** → Meldung nennt die Ursache direkt.

**NICHT raten:** zuerst die Log-Zeilen, dann entscheiden ob nativer oder JS-Fix.

---

## BUG-7 — Tempolimit-Schild zeigt falschen Wert 🐞 offen · 🔍 erst messen
**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 7). **Nur dokumentiert, noch nicht gefixt** (Regel 2/4).
**Symptom:** Die angezeigte Geschwindigkeits**begrenzung** (rundes Schild) stimmt offenbar nicht.
**Wo:** `HTML/js/tracker-speedlimit.js` — Overpass `way(around:35,…)[highway][maxspeed]`, nimmt den
**nächsten** Weg per Geometrie (`:136-138`), maxspeed-Parser (`:92`), Throttle `MIN_INTERVAL_MS=5000` (`:11`).
**Verdächtige (erst messen):**
1. **Falscher Weg gewählt** — bei parallelen Straßen/Kreuzungen ist „nächster binnen 35 m" evtl. die
   falsche (Nebenstraße statt Hauptstraße, Gegenfahrbahn).
2. **maxspeed-Tag** fehlt/uneindeutig am richtigen Weg → es greift ein Nachbar.
3. **Stale** durch Throttle/Overpass-Latenz → Schild hinkt der aktuellen Straße hinterher.
4. Zonen-/`maxspeed:conditional`-Tags (DE) falsch interpretiert.
**Erst messen (Regel „nie raten"):** pro Abfrage ins DEBUG-Fenster: gewählter Weg (name/ref), roher
maxspeed-Tag, Distanz, Kandidatenliste → zeigt, ob's die Wegwahl oder das Parsing ist.

---

## BUG-8 — Erkennung verwechselt Nachbar-Bauwerke (keine Blickrichtung) 🐞 offen
**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 3). **Nur dokumentiert** (Regel 2/4).
**Symptom:** Am Dresdner Standort sagt die Erkennung **immer „Stadtschloss"**, egal wohin die Kamera
zeigt — tatsächlich ist es der **Zwinger** (beide liegen dicht beieinander).
**Ursache (belegt):** Es gibt **keine Blickrichtung**:
- Client `HTML/js/tracker-media.js` schickt **kein** heading/bearing mit dem Foto (0 Treffer).
- Edge Function `supabase/functions/identify/index.ts` gründet rein auf **lat/lng** (`geoContext`: Wikipedia
  geosearch `gsradius=600` `:167`, Overpass `around:130-160 m` `:176`, STANDORT-KONTEXT `:198`). Im Radius
  liegen Zwinger UND Schloss → ohne Heading keine Unterscheidung → es rät nach Nähe.
**Fix-Richtung (noch nicht bauen):**
1. **Client:** Heading erfassen (GPS `coords.heading` bei Tempo>0, sonst Kompass/DeviceOrientation) und beim
   Foto mitschicken.
2. **identify:** Heading nutzen — POIs im **Sichtkegel voraus** (Bearing Standort→POI ≈ Heading ±X°)
   bevorzugen statt nur nach Nähe. Passt zu `geo-erkennung-und-voice-spur.md`.
**Caveat:** Heading im Stehen unzuverlässig (Kompass-Jitter) → breiter Kegel / Fallback auf Nähe.

---

## BUG-9 — Voice-Navigation: Abbiege-Ansagen stumm auf dem Pixel ✅ gefixt 2026-06-20
**Quelle:** [`../../ideen-wunsche.md`](../../ideen-wunsche.md) (Doc 2026-06-14): „Warum haben wir keine Voice
Navigation? …" → am 2026-06-20 von Doc präzisiert: die **gesprochenen Abbiege-Ansagen** („In 120 Metern
rechts abbiegen") kommen auf dem **Pixel** nicht.

**✅ Ursache gefunden + gefixt (2026-06-20):** Die Ansagen liefen über **`window.speechSynthesis`** (on-device
Web-Speech-TTS). Im **Android-System-WebView** (die Pixel-APK ist Capacitor, lädt die Seite als WebView)
bleibt `speechSynthesis` **stumm** — keine Voice-Engine gebunden, `getVoices()` leer. **Beweis:** Solita
selbst spricht auf dem Gerät sehr wohl — aber über einen ANDEREN Kanal: Cloud-TTS via `tts`-Edge-Function
(Google) → mp3 über ein `<audio>`-Element (`HTML/js/solita-voice.js`, `window.SolitaVoice`). `tracker-nav.js`
war die **einzige** Stelle, die noch `speechSynthesis` nutzte.

**Fix (`HTML/js/tracker-nav.js`):** `speak()` ruft jetzt **primär `SolitaVoice.speak(text)`** (denselben
Cloud-Weg, der auf dem Pixel schon spricht); `speechSynthesis` bleibt nur als **Fallback** (`speakSynth()`,
für Desktop/Standalone ohne `SolitaVoice`). Neue Helfer `stopSpeech()` stoppt BEIDE Engines — in
`clearRoute()` und beim Voice-Toggle. Logs ins DEBUG-Window (`tts: SolitaVoice ▶ "…"`).

**Für andere Agenten — WICHTIG:** Nie wieder `speechSynthesis` für neue Sprachausgabe im Tracker/WebView —
immer `window.SolitaVoice.speak()` (Cloud-TTS) nutzen. Kostet Netz (kurze Sätze, ok); offline schweigt sie.
Ein gemeinsamer `<audio>`-Kanal → neue Ansage unterbricht die laufende (gewollt, kein Überlappen).

**Akzeptanz/Test (Doc, am Gerät):** Ziel setzen → START → fahren: Ansage kommt; DEBUG zeigt `SolitaVoice ▶`.
**Offen (separat):** Vollständige Voice-*Steuerung* per Sprachbefehl bleibt ein eigenes Thema (Solita-STT).

---

## BUG-10 — Navigation: Route-Fit passt sich beim Fahren nicht an ✅ gefixt 2026-06-20 · Nachtrag 2026-06-21
**Quelle:** Doc 2026-06-20 (mündlich, zusammen mit dem Sprachansage-Fix): „Das Fit der Route muss
**dynamisch** passieren. Das wird einmal gemacht beim Einschalten, aber dann nicht angepasst."
**Priorität:** mittel (Komfort beim Navigieren — die Reststrecke läuft aus dem Bild).

**✅ Nachtrag-Fix (2026-06-21, `HTML/js/tracker.js` `updateFitMode`):** Doc meldete, der Reststrecken-Fit
sei *immer noch* nicht dynamisch. Ursache war NICHT die Aktivierung (die lief), sondern der Re-Fit-Loop
selbst: er bewegte die Karte **nur** bei einem Zoom-Hysterese-Wechsel (`grew || shrank`, Cooldown 4 s).
Dazwischen wurde **nie gepannt** → die Reststrecke nicht nachzentriert; und mit `zoomSnap:1` (ganze
Zoom-Stufen) liegt `rb` nach einem Fit oft bequem im Rahmen → weder `grew` noch `shrank` → Kamera steht.
**Korrektur:** Pan und Zoom **entkoppelt** — **Zoom** weiter bidirektional mit Hysterese+Cooldown
(`-0.12`/`-0.30`), aber **Pan auf den Rest-Mittelpunkt bei JEDEM Fix** (`map.panTo(rb.getCenter())`), sodass
der Ausschnitt der schrumpfenden Reststrecke laufend folgt. Hand-Pan/CENTER/FIT setzen `fitMode=false` und
übersteuern weiterhin. (`-0.40`→`-0.30` zieht den Zoom etwas früher nach.)

**✅ Fix (2026-06-20, `HTML/js/tracker.js`):** Nach dem einmaligen Routen-Overview schaltet der Nav-Start
jetzt automatisch in den **dynamischen Reststrecken-Fit** (`fitMode = 'remaining'`) statt in den reinen
Crosshair-Follow — der vorhandene bidirektionale Re-Fit-Loop (`:751-758`, mit Hysterese + Cooldown) rahmt
die schrumpfende Reststrecke dann bei JEDEM Fix nach. Fundstelle: der `navOverviewTimer`-Callback im
START-Handler (vorher `centerOnPosition()`; jetzt `remainingBounds` → `fitMode='remaining'`, Fallback auf
`centerOnPosition()` falls noch keine Route-Geometrie da ist). Hand-Pan/CENTER/FIT übersteuern weiterhin
(canceln den Overview-Timer bzw. setzen `fitMode`/`following` selbst).
**Für andere Agenten:** Der 3-State der FIT-Taste (aus → 'all' → 'remaining') bleibt unverändert; START
springt nur direkt auf 'remaining'. In 'remaining' besitzt der Fit den Zoom (Speed-Zoom pausiert, `:732-735`).

**Symptom:** Beim Nav-Start wird die **ganze** Route **einmal** ins Bild gerahmt; danach gleitet die Karte
in die Crosshair-Follow-Ansicht. Beim Weiterfahren wird der Kartenausschnitt **nicht** an die schrumpfende
**Reststrecke** angepasst — er folgt nur der Position (speed-zoom), das Ziel/der Rest bleibt außerhalb.

**Ursache (belegt):** Der dynamische Reststrecken-Fit **existiert schon**, wird beim Navigieren aber
**nicht automatisch aktiviert**:
- Nav-Start macht **genau einen** `frameRoute()` (ganze Route), dann nach `NAV_OVERVIEW_MS` (3 s)
  `centerOnPosition()` → reiner `following`-Modus. `fitMode` wird sogar explizit auf `false` gesetzt
  (`HTML/js/tracker.js:1094`, `:1100-1106`).
- Der bidirektionale Re-Fit auf die Reststrecke (`fitMode === 'remaining'` → `__nav.remainingBounds(here)`,
  mit Hysterese + Cooldown) ist vorhanden in `HTML/js/tracker.js:751-758`, aber nur per **manuellem**
  Durchschalten der FIT-Taste erreichbar (3-State: aus → 'all' → 'remaining').
- `remainingBounds(here)` liefert bereits „aktuelle Position + alles voraus + Ziel" (`HTML/js/tracker-nav.js`).

**Fix-Richtung (zur Entscheidung mit Doc — NICHT ungefragt bauen, Regel 2/4):** Beim Nav-Start nach dem
einmaligen Overview statt (oder zusätzlich zu) `following` den **`fitMode = 'remaining'`** automatisch
einschalten, sodass die Reststrecke laufend nachgerahmt wird (die Logik bei `:751-758` greift dann jeden Fix).
Manuelles Übernehmen (Hand-Modus) / die FIT-Taste müssen das weiterhin überstimmen können.

**Akzeptanz/Test:** Route setzen → START → losfahren: der sichtbare Ausschnitt zieht sich mit der
Reststrecke zusammen, Ziel bleibt im Bild; kein Flattern (Hysterese/Cooldown); ZENTRIEREN/FIT/Hand-Pan
übersteuern weiterhin sauber.

**NICHT tun:** den Speed-Zoom der normalen Follow-Ansicht und den Reststrecken-Fit gleichzeitig am Zoom
zerren lassen (in 'remaining' besitzt der Fit den Zoom — siehe `:732-735`).

---

## Verwandt / Querverweise
- Übersicht aller Notizen: [`../../NOTES.md`](../../NOTES.md)
- Feature-Arbeitsliste: [`feature-requests.md`](feature-requests.md) · Ideen-Triage: [`ideen.md`](ideen.md)
- Tracker-Onboarding/Regeln: [`agents.md`](agents.md)
