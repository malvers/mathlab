# Tracker — Feature-Warteschlange

> **Zweck:** Entschiedene/bald-zu-bauende Features, jede so spezifiziert, dass ein Subagent sie als Auftrag
> aufgreifen kann. Rohe Ideen: [`ideen.md`](ideen.md) · Bugs: [`bugfixes.md`](bugfixes.md).
> **Jeder Punkt steht genau EINMAL, selbst-tragend.** **Hausregeln: siehe [`../../CLAUDE.md`](../../CLAUDE.md)**
> (wird automatisch in jeden Agenten-Kontext geladen — hier keine Kopie, die veraltet).
> Status: `📐 spezifiziert` · `🏗️ teils gebaut` (MVP steht, Post-MVP offen) · `🅿️ gebaut-aber-geparkt` (Code da, wartet auf Integration/Daten/Server-Aktion).

---

> ## 🔎 Audit 2026-07-04 (Code-Stand)
> Abgleich **aller** Features gegen den echten Code (56 Agenten, adversarial verifiziert). Die Gegenprüfung hat 5 „sah-erledigt-aus" auf **teilweise** heruntergestuft.
> - **✅ fertig:** **FEAT-2** (Goldene Stunde) · **FEAT-20** (Zoom-Buttons) · **FEAT-22** (Pl@ntNet-20 %) · **FEAT-24** (POI-Layer) · **FEAT-26** (Tankstellen) · **FEAT-27** (tracks-RLS-owner).
> - **🏗️ teils gebaut:** **FEAT-3 · FEAT-6 · FEAT-9 · FEAT-12 · FEAT-18 · FEAT-21 · FEAT-23 · FEAT-34** (jeweils MVP/Kern da, Akzeptanz nicht ganz erfüllt — Detail im Eintrag).
> - **📐 offen:** **FEAT-1 · FEAT-4 · FEAT-5 · FEAT-14 · FEAT-16 · FEAT-17 · FEAT-25** + die **E2E-Kette FEAT-28→33** (Verschlüsselung, noch nicht begonnen).

## FEAT-1 — Brotkrumen zurück (offline) 📐 · 🔴 Prio 1, BAUEN
**Warum zuerst:** Doc-Prio 1, **Sicherheits-Feature** („bring mich heim" im Funkloch).
**Auftrag:** Führt den Nutzer **entlang der eigenen aufgezeichneten Spur** zurück zum Start — komplett **offline** (kein OSRM/Tiles, nur die vorhandenen `track`-Punkte).
**Neues Modul:** `HTML/js/tracker-breadcrumb.js`, Architektur 1:1 wie `tracker-nav.js` (`window.TrackerBreadcrumb(ctx)` mit `start(track)`/`update([lat,lng])`/`stop()`), eigene Leaflet-Layer (Rest-Spur + „Start"-Pin) + Banner/Pfeil. Toggle im Radial-Menü oder eigener FAB.
**Algorithmus:** cum[]-Distanz, gefensterter Segment-Snap, Off-Track-Recovery.
**Datenbasis (`tracker.js`):** `track`, `times/alts/speeds`, `posMarker`, `lastFix`, `bearingBetween()`, `haversine = TrackRender.haversine`.
**Sensorik-Leitplanke (Doc):** GPS = Wahrheit; IMU/Beschleunigung nur Ergänzung, nie GPS-Ersatz.
**Akzeptanz:** Out-and-back, Schleife, verzweigte Spur, GPS-Jitter, weit off-track→Recovery, „Start erreicht", langer Track (Perf), geladen vs. live, Flugmodus, App-Reload mitten im Heim-Modus (Modus+Snap-Index aus localStorage). Erst nach Feld-Testmatrix „scharf".

## FEAT-2 — Goldene Stunde & Sonnenstand ✅ gebaut (Feld-Check offen) · 🔴 Prio 1
**Gebaut (2026-07-04):** `HTML/js/tracker-sun.js` — schlanke, tippbare Zeile im HUD-Header (`#sun-line`): aktuelle Phase, nächster Meilenstein mit Countdown, Tap → volle Aufschlüsselung (Auf-/Untergang, beide goldene Stunden, blaue Stunde, live Sonnenhöhe + Himmelsrichtung). Glüht λ-orange während der goldenen Stunde.
**Solarmathe:** eigenständiges NOAA (Lineage wie worldclock `sunPosition()`, aber entkoppelt), auf `window.TrackerSunMath` testbar exponiert. **Verifiziert** gegen Almanach: Berlin-Sonnenwende 04:43/21:33 (exakt), Winter 08:14/15:53, Äquinoktium-Tageslänge 12,17 h (Refraktion), Mittagshöhe 60,9°/Azimut 180°. Goldene Stunde = Sonne −4°…+6°, blaue Stunde −6°…−4°, Auf/Unter −0,833°.
**→ Offen:** nur der **Layout-Feld-Check** am Gerät (Zeile im HUD, goldene-Stunde-Glow). Darstellungsfrage (HUD-Kachel vs. Panel) wurde als **HUD-Header-Zeile** entschieden.

## FEAT-3 — Parkplatz automatisch merken 📐 · Prio 1 (Vorschlag)
**Auftrag:** Wechselt die Activity-Erkennung „fahren"→„zu Fuß", setzt der Tracker automatisch einen Park-Pin. Auto später entspannt wiederfinden.
**Wiederverwenden:** `effectiveActivity()` (Activity-Recognition ist da) + Pin-Layer.
**Verbindet mit FEAT-4:** der Park-Pin ist ein natürliches Ziel für „Zurück zum Auto".

## FEAT-4 — Zurück zum Start / zum Auto 📐 · Prio 1 (Vorschlag)
**Auftrag:** Ein Tipp routet **online** (OSRM, baut auf `tracker-nav.js`) zurück zum Startpunkt der Aufzeichnung oder zum gemerkten Park-Pin (FEAT-3).
**Abgrenzung zu FEAT-1:** FEAT-1 folgt offline der eigenen Spur (Wandern/Funkloch); FEAT-4 routet online auf Straßen (Auto/Stadt). Gleiche Präsentation (Banner/Pfeil/Voice).

## FEAT-5 — Regen-Vorwarnung unterwegs 📐 · Prio 1 (Vorschlag)
**Auftrag:** Das vorhandene **Regenradar vorausschauend** nutzen: „In ~12 Min Regen an deinem Standort/auf deiner Route." Besonders für Motorradfahrer.
**Abhängigkeit:** ⚠️ Hängt an **BUG-2** (Regenradar zeigt in DE oft nichts) — Vorwarnung auf leeren Daten ist sinnlos. **BUG-2 zuerst.**
**Wiederverwenden:** `rain-radar.js` (Frames/Nowcast) + Route aus `tracker-nav.js`.

## FEAT-6 — Navigation Post-MVP 🏗️ teils gebaut
MVP + Re-Routing + Voice sind gebaut. **Noch offen (je ein eigener kleiner Auftrag):**
- **Vollständige Abbiege-Liste** (statt nur nächstes Manöver).
- **„passiert"-Erkennung:** Manöver weiterzählen, wenn man bei schneller Fahrt zwischen zwei Fixes daran vorbeikommt.
- **Verkehr/Baustellen:** gratis über **Autobahn-GmbH-API** (DE, kein Key) / DATEX II / Mobilithek; farbiger Echtzeit-Stau realistisch nur via TomTom/HERE-Freemium. *(Verkehrs-Spur Phase 1 inzwischen gebaut — s. Code `tracker-traffic.js`.)*

## FEAT-9 — GPS-Nachbearbeitung: nächste Stufen 🏗️ teils gebaut
**Gebaut:** Client-Glättung (`track-smooth.js`, GLÄTTEN-Toggle) + DEM-Höhe (`track-dem.js`, Open-Meteo, `effectiveAlts`-Funnel).
**Offen (NEXT):** Aufstiegs-/Profil-UI (Höhenmeter, Profil-Graph), Map-Matching (nur fürs Auto sinnvoll).

## FEAT-12 — „Contact AI" Stufe 2: Wunsch einsprechen → Agent ändert Repo + pusht 📐 · Future Now
Schließt den Kreis mit FEAT-10: Sprach-Wunsch → Edge Function (hält Token) → Agent editiert `config.json` + push → Live-Config zieht's → Änderung erscheint live.
**Zwei Heimstätten:** (1) **Claude Code Routines** (Anthropic-gehostet, kein eigener Server; App POSTet, Token in Edge Function) oder (2) **Claude Agent SDK auf eigenem VPS** (volle Kontrolle). **Edge Functions können den vollen Agent-Loop NICHT hosten** (Zeitlimit, kein FS/git) — nur Stufe 1 + Routine *feuern*. **Sicherheit:** Token server-seitig, Agent-Scope eng. Routines = Beta → vor Bau verifizieren.
**Voraussetzung:** Solita-Weckwort — erst Vosk-Wortliste `["krass","solita","[unk]"]`, bei Bedarf openWakeWord/Picovoice auf Docs Stimme.

## FEAT-14 — Tracking & Navigation entkoppeln 📐
**Szenario:** „Track nach Dresden, navigiere hin — Plan ändert sich → **Navigation beenden**, **Track weiterlaufen** lassen (weiter nach Frankfurt)." Heute reißt STOP die Navi immer mit; „Navigation beenden" ist als „Ziel löschen" versteckt; Navi wird nur aus `onPosition()` (= nur bei Aufzeichnung) gefüttert.
**Empfehlung:** **C jetzt** (Quick-Win: „Ziel löschen" → **„Navigation beenden"** umbenennen, STOP entkoppeln, Hinweis „Navi aktiv") → **Ausbau zu A** (persistenter Navi-Chip `→ Dresden · 1:42 ✕`, **Re-Target** mitten im Track, Navi **ohne** laufende Aufzeichnung). Code: `beginTracking`/`finishTracking`/`__nav.*` in `tracker.js`.

## FEAT-16 — Live-Broadcast: Presence/Rückkanal 📐 Idee
Aus BUG-5: Zuschauer-Zähler („3 sehen dich") + Empfangs-Bestätigung („zuletzt empfangen vor 2 s"). Macht Sende-Diagnose trivial (0 verbunden = Name/Link; verbunden, kein Empfang = Sendeproblem). Erst **BUG-5** klären, dann als Feature.

**📌 Doc 2026-06-27 — „Wissen wir zu 100 %, ob gesendet wird?" (morgen mit den anderen Agenten checken):**
Nein. Der Viewer (`view.html`) ist ein **passiver Broadcast-Abonnent**. „Verbunden" = nur `SUBSCRIBED` (Viewer ↔ Supabase-Server steht, `view.html:523`) — das sagt **nichts** über den Sender aus. Daten kommen nur rein, wenn der Sender von sich aus broadcastet (`view.html:513–518`); der `request`-Rückfrage-Ping (`:524–529`) hilft nur, wenn der Sender überhaupt online ist und antwortet. Es gibt **keine Presence/keinen Heartbeat** → solange `gotData` false ist, kann der Viewer **nicht unterscheiden**: (a) Sender offline / zeichnet nicht auf vs. (b) Sender online, aber gerade still (zwischen zwei Ticks). Deshalb ist die Meldung bewusst eine **Frage** („Läuft die Aufzeichnung von ‚lili' gerade?") und kein Fehler.
**Was es lösen würde:** genau dieses FEAT-16 (Supabase **Presence** — Sender trackt sich im Channel, Viewer liest `presenceState` → echte „Sender ist live"-Gewissheit + Zuschauer-Zähler). Die Sende-Diagnose (`subscribe`-Status + `rx`-Zähler) ist über die `DIAG`-Leiste in `view.html` schon teilweise sichtbar (vgl. BUG-5 „schnellster Pinpoint").

## FEAT-17 — Lane Guidance (Spuranweisungen) 📐 · Prio 2
OSRM liefert `step.intersections[].lanes` (`indications` + `valid`). Kleines Spur-Diagramm unter dem Abbiege-Banner. Nur wo OSM `turn:lanes` getaggt ist (Autobahn-Ausfahrten meist ja). SVG-Pfeil-Set existiert bereits.

## FEAT-18 — Kleinere offene Punkte 📐
- **`#motion-dbg`-Readout entfernen** (unten links) — bewusst drin gelassen, **raus auf Zuruf** (Memory `feedback_keep_debug`: nicht eigenmächtig strippen).
- **Tracking-Notification farbig** (Akzentfarbe/Icon im Benachrichtigungs-Panel) — nativer Eingriff, offen.
- **Native Background-Test:** START → Screen sperren → laufen → prüfen, dass weiter aufgezeichnet wird.

## FEAT-20 — OSM-Zoom-Buttons (+/−): ausblenden oder schöner ✅ fertig (Audit 2026-07-04)
Die +/−-Buttons sind **unsere** (Leaflet-Default-Control): `tracker.js:18` `zoomControl:false`, dann `:28` `L.control.zoom({position:'bottomright'}).addTo(map)`.
**Optionen (Doc entscheidet):** **Weg** — `tracker.js:28` entfernen (Pinch-Zoom bleibt). **Schöner** — CSS `.leaflet-control-zoom`/`-in`/`-out` in `tracker.css` on-brand (dunkel/orange, Orbitron), ggf. Position.

## FEAT-21 — Instrumente ausblenden + Track/Karte mehr Platz 📐
- Im **Debug** ein Schalter, ob die **Instrumente (HUD-Kacheln)** ausgeblendet werden.
- Wenn ausgeblendet, soll **Track/Karte (FIT) mehr Platz** bekommen.
**Richtung:** Instrumente aus → `#hud-top` kollabieren, Karte den frei werdenden Platz nutzen (volle Höhe). Hängt mit Idle-Auto-Hide + dem d/k/w-Tasten-Toggle zusammen.

## FEAT-22 — Pl@ntNet-Schwelle 20 % ✅ fertig (Audit 2026-07-04)
**Stand:** `PLANTNET_SHOW_MIN = 0.20` ist in `supabase/functions/identify/index.ts` gesetzt (≥30 % Headline · 20–30 % Zweitmeinung · <20 % ganz weg).
**→ Offen (kein Bau):** Deploy durch Doc — `supabase functions deploy identify --no-verify-jwt`.

## FEAT-23 — HUD: oberes Element + Genauigkeit als zentrierte Gruppe 📐
**Wunsch:** das **obere Element** [Diktat unklar — vermutlich POSITION/GPS-Chip oder die Uhr, mit Doc klären] + die **Genauigkeit (±m)** in **eine Gruppe** fassen und die **ganze Gruppe zentrieren**.
**Wo:** `#hud-top` / `#gps-chip` (zeigt schon `gps-src` + `gps-acc ±m`) in `tracker.html` + `tracker.css`.

## FEAT-24 — Points of Interest (POI) ✅ fertig (Audit 2026-07-04) · war 🔴 PRIO 0
**Wunsch (Doc 2026-06-14):** POIs am Weg / auf der Karte (Sehenswürdigkeiten, Tankstellen, Aussichtspunkte …).
**Überschneidung (erst prüfen, nicht doppelt bauen):** WegCast Audio-POI, Foto-Spur-Erkennung, **FEAT-26** (Tankstellen sind schon POIs).
**Daten gratis (Regel 18):** Overpass/OSM (`tourism`/`historic`/`natural`), Wikipedia-Geosearch — kein Key.
**Erst klären (eine Rückfrage):** welche Kategorien + Darstellung (Karten-Pins vs. Liste vs. Audio am Weg)? Dann spezifizieren. Nicht bauen ohne „go" (Regel 2/4).

## FEAT-25 — Karten-PIN setzen + dorthin navigieren 📐 · 🔴 PRIO 0
**Wunsch (Doc 2026-06-14):** „Einen PIN auf der Karte setzen, wo man ggf. wieder hin navigieren kann."
**Auftrag:** Long-Press/Tap auf die Karte → PIN; Tipp auf den PIN → **Navigation dorthin** (baut auf `tracker-nav.js`, OSRM).
**Verwandt:** FEAT-3 (Parkplatz) + FEAT-4 (zurück zum Auto) — gleiche „Pin-als-Navi-Ziel"-Logik; gemeinsam denken. Nicht bauen ohne „go".

## FEAT-26 — Tankstellen / Tankpreise (Tankerkönig) ✅ fertig (Audit 2026-07-04) · war 🔴 PRIO 0
**Stand (verifiziert):** Code ist **vollständig da** — Client `HTML/js/tracker-fuel.js` (`window.TrackerFuel`, default an) + Edge Function `supabase/functions/fuel-prices/index.ts`. Die Function ist auf das Secret `TANKERKOENIG_KEY` gegated.
**→ Es fehlt NUR die einmalige Server-Aktivierung (kein Bau):**
1. Gratis-Key: https://creativecommons.tankerkoenig.de/
2. Secret setzen: Supabase Dashboard → Edge Functions → Secrets → `TANKERKOENIG_KEY` (Regel 18: nur server-seitig).
3. Deployen: `supabase functions deploy fuel-prices --no-verify-jwt`
**Danach:** am Gerät prüfen, ob `TrackerFuel` Preise zeigt (Toggle `trk-fuel-on`). *(Hinweis: ein TANKERKOENIG_KEY wurde am 2026-06-21 gesetzt — gegen echten Stand prüfen.)*

## FEAT-27 — E2E Phase 0: `tracks`-RLS auf `owner` härten ✅ fertig (Audit 2026-07-04)
**Warum zuerst:** Billig, unabhängig vom restlichen E2E. Der publishable/anon-Key steht im public Repo → wer ihn nimmt, kann je nach RLS **alle** Tracks ziehen. RLS-Scope stoppt Zufalls-/Repo-Leser (~90 % von „nur ich seh die Tracks"). Schützt **nicht** vor DB-/Supabase-Zugriff (das ist echtes E2E, FEAT-29ff).
**Auftrag:** `tracks`-RLS pro Sync-Code/Owner scopen. **Owner-Spalte** `owner = PBKDF2(syncCode,'tracker-owner-salt-v1')` → hex, **clear** (erlaubt „meine Tracks listen" + RLS-Scope ohne Entschlüsseln).
**Erst messen (nie raten):** `pg_policies`-Abfrage, **dann** gezielt scopen (Memory `project_tracker_e2e_plan`).
**Caveat (mission-critical):** Policy-Änderung an Live-DB — Backup/Anschauen vor Mutation, reversibel, an 1 Track testen. Nur nach „go".

## FEAT-28 — E2E Phase 1: geteiltes `HTML/js/crypto-box.js` (aus `vgp-crypto.js`) 📐 · Enabler · Aufwand mittel
**Audit-Ziel (keine Doppel-Implementierung):** `vgp-crypto.js`-Primitive in ein **geteiltes `HTML/js/crypto-box.js`** ziehen → VGP **und** Tracker teilen eine Krypto-Schicht. Web-Crypto-API, kein Lib, kein Key am Server (Regel 18).
**Bausteine:** Schlüssel = Passwort → `PBKDF2` (200 000 Runden, SHA-256, fester Salt) → **AES-GCM-256**, nie am Server · öffentliche Gruppen-ID = `PBKDF2(passwort, group-salt)` → hex, clear · Text `encryptText()` → `iv(12)++ct` base64, Prefix `ENC:`; `decryptText()` lässt Nicht-`ENC:` als Klartext durch (Migration nebenbei) · Bilder `encryptBytes()/decryptBytes()`.
**Tracker-Key:** `trackKey = PBKDF2(syncCode,'tracker-key-salt-v1')` (nur im Speicher, nie hochgeladen). **Voraussetzung für FEAT-29/30/31/32.** Nur nach „go".

## FEAT-29 — E2E Phase 2: Tracks verschlüsseln (Kern) 📐 · setzt FEAT-28 voraus · Aufwand mittel
**Auftrag:** `points` (Route) · `waypoints` · `name` (als `ENC:`) vor `insert/update` durch `encryptText`/`encryptBytes` (Foto → FEAT-30). `owner` (hex) bleibt clear (RLS-Scope); `created_at`/`status`/`id`/`share_id` bleiben clear (Metadaten).
**Datenfluss:** Speichern → verschlüsseln, `owner` clear; Laden → `decryptText`/`decryptBytes` mit `trackKey`; Alt-Klartext läuft dank `ENC:`-Durchlass weiter.
**⚠️ Trade-off (load-bearing):** die server-seitige `list_tracks()`-RPC (km/Dauer) **entfällt** → km/Dauer/Foto-Anzahl **client-seitig** aus den entschlüsselten Punkten rechnen.
**Rückfrage:** `distance_m`/`duration_s`/`photo_count` mitverschlüsseln **oder** als grobe Klartext-Metadaten lassen? (Regel 20).
**Verlust-Caveat:** Sync-Code verloren → Tracks weg (kein Server-Recovery, der Preis von echtem E2E). Nur nach „go".

## FEAT-30 — E2E Phase 3: Fotos verschlüsseln 📐 · setzt FEAT-28/29 voraus · Aufwand mittel
**Auftrag:** Foto via `encryptBytes` → `iv(12)++ct`. Ablage inline base64 **oder** privater Storage-Bucket. **Mit FEAT-7 (R2) / FEAT-8 (Bucket) gemeinsam denken** — der private Bucket ist genau das Storage-Auslagern, nur verschlüsselt.
**Foto-KI unberührt:** `identify` bekommt das Foto **bei der Aufnahme im Klartext** (geht eh an Google/Pl@ntNet), **bevor** verschlüsselt gespeichert wird → nur die gespeicherte Kopie ist E2E.
**⚠️ Konsequenz für „BILDER ANALYSIEREN":** muss die Fotos erst client-seitig entschlüsseln → Re-Identify-Pfad in `tracker-media.js` anpassen. Nur nach „go".

## FEAT-31 — E2E Phase 4: Sharing verschlüsseln (Key im URL-Fragment) 📐 · setzt FEAT-28/29 voraus
**Problem:** Empfänger hat den Sync-Code nicht → saubere Trennung nötig.
**Auftrag:** Track unter einem **frischen Zufalls-Share-Key** verschlüsseln, als Share-Zeile ablegen. Link `view.html?s=<token>#k=<share-key-b64>` — das **`#`-Fragment geht NIE an den Server**. Viewer holt die Zeile per Token (Ciphertext), entschlüsselt mit dem Fragment-Key.
**⚠️ Trade-off:** Wer den Link hat, kann lesen → der **Link ist das Geheimnis** (nicht über unsichere Kanäle teilen). Baut auf bestehendem Track-Sharing (`view.html`). Nur nach „go".

## FEAT-32 — E2E Phase 5: Live-Broadcast verschlüsseln (Channel-Key im Fragment) 📐 · setzt FEAT-28 voraus
**Auftrag:** Channel-Key = `PBKDF2(liveSecret, …)`; Payloads vor `channel.send` mit `encryptText/encryptBytes` verschlüsseln. Live-Link trägt `liveSecret` im **Fragment**: `view.html?live=<name>#k=<secret>`.
**Abhängigkeit:** Erst **BUG-5** (Live-Broadcast geht gerade nicht) klären — E2E auf einem kaputten Broadcast bringt nichts. Nur nach „go".

## FEAT-33 — E2E Migration: Alt-Klartext → Ciphertext 📐 · Teil von FEAT-29
**Strategie (migrations-freundlich):** pro Zeile `ENC:`-Prefix als Marker; `decryptText` lässt Alt-Klartext durch → kein Big-Bang. Alt-Tracks werden beim **nächsten Speichern** automatisch Ciphertext; reiner Altbestand bleibt lesbar bis dahin. **Optional:** einmaliges Re-Encrypt aller eigenen Tracks (Client: lädt → verschlüsselt → schreibt zurück).
**Caveat (mission-critical):** Re-Encrypt-all mutiert Live-Daten → an 1 Track testen, reversibel/Backup. Nur nach „go".

## FEAT-34 — Off-Route „echtes Sperren" der abgelehnten Route (Avoid-Area-Router) 📐 · folgt auf die gebaute „go B"-Näherung
**Kontext (Doc 2026-06-23):** Bei bewusster Abweichung (Anweisung ignoriert, anderen Weg gewählt) soll das Navi NICHT auf die alte/kürzere Route zurückzwingen. **Variante B ist gebaut** (`tracker-nav.js`: Via-Punkt ~450 m voraus in Fahrtrichtung bei der Off-Route-Neuberechnung → OSRM *committet* auf die eigene Richtung; OSRM-Näherung, kein echtes Sperren). Diese FEAT = **Variante A**, die saubere Lösung.
**Auftrag:** Die abgelehnte Route als **Sperr-Korridor** ans Routing übergeben, sodass der Router sie **gar nicht** nutzen darf (nicht nur „dahin committen" wie B). **Unser OSRM kann das nicht** — `exclude` greift nur auf Build-Zeit-Klassen (Maut/Autobahn/Fähre), keine beliebigen Kanten. Braucht einen **Avoid-Area-fähigen Router**: **GraphHopper** (`block_area`) oder **Valhalla** (`exclude_polygons`/`exclude_locations`) — beide frei nutzbar/hostbar.
**Trade-off:** anderes Routing-Backend (API-Format, Hosting/Key) statt des öffentlichen OSRM. **Erst bauen, wenn B im Feld zu schwach ist.**
**Caveat:** „bewusste Abweichung" sauber erkennen (Anweisung ignoriert + kohärent weitergefahren), nicht bei GPS-Zappeln auslösen.

## FEAT-35 — Schild selbst erfassen (Tap-Panel) + lokaler Override-Store (+ späterer OSM-Export) 📐 · Prio 2 (Doc, „sounds like a plan" 2026-07-04)
**Warum:** OSM kennt **temporäre / Baustellen-Schilder praktisch nie** (Feld 2026-07-04: Kötzschenbroder Str. Dresden-Kaditz — real am Mast „**30**, 200 m, **werktags 6–20h**" am Kran-/Baumaschinenhof, in OSM **nichts** → App zeigt korrekt die dauerhaften 50, unser Fenster-Label bleibt leer, weil es keine Datenquelle gibt). Auch dünn getaggtes (Überholverbot, Schritttempo „5/7") fehlt (→ BUG-16). Doc will beim Fahren fehlende Schilder **selbst antippen**: „hier ist ja gar kein Schild → Tap-Tap → Panel → Auswahl → zack, bleibt bei uns", später in geeigneter Weise an OSM/eigenen Store übergeben.
**Auftrag (MVP):** Tap (auf das Live-Schild `#speed-sign` **oder** eigener FAB) → **großes, fahrbetriebstaugliches Panel** mit den wichtigsten Zeichen: Tempo **5/7/10/30/50/60/70/80/100**, **„Ende der Beschränkung"**, **Tempo-30-Zone**, **Zeitfenster-Beschränkung** (werktags / Mo–Fr / Mo–Sa + von–bis), **Überholverbot**, **Maut**. Auswahl → **sofort** als Override gesetzt und angezeigt (ein/zwei Taps, keine Menütiefe).
**Override-Store:** zunächst `localStorage` (später Supabase-Tabelle für Crowd / geräteübergreifend), verortet an der **nächsten Fahrbahn** (Overpass-Way-ID aus `lastRoad`/Query) **oder** Punkt + Heading + Reichweite/Ende. Zeitbedingtes über **dieselbe `{base,rules}`-Struktur wie OSM** (`parseConditional`), damit `evalLimit` und das neue Fenster-Label 1:1 greifen (Regel 7, eine Wahrheit).
**Integration (`tracker-speedlimit.js`, neu greppen):** Override bekommt **höchste Priorität** — vor `conf` (signiert) und `def` (generisch) in `query()`/`update()`; speist auch `curRaw` (Fenster-Label) und `setAdvisories()`. Muss mit Fahrtrichtung/Reichweite wieder **auslaufen** (nicht ewig kleben).
**Recht/Parser-Notiz:** „**werktags**" = **Mo–Sa** (Samstag zählt, nur Sonn-/Feiertage nicht) — unser Parser macht das bei `Mo-Sa` korrekt (`parseDays`/`ruleActive` verifiziert 2026-07-04); das Panel muss „werktags" also auf **Mo–Sa** mappen, nicht Mo–Fr.
**Später/Export (groß → parken 🅿️):** Übergabe an **OSM** = eigener Changeset via OSM-API + **OAuth2** (Aufwand hoch, Account/Policy/Editier-Etikette klären — kein Massen-Import) — bis dahin eigener **Supabase-Store** als Zwischenschicht.
**Abgrenzung:** **kein** Kamera-/OCR-Auto-Erkennen (separate, große Idee) — hier rein **manuelle Schnell-Erfassung**. Sicherheit: großflächig, blind-tippbar, minimaler Blickkontakt im Fahrbetrieb.
**Akzeptanz:** Tap→Panel→Auswahl setzt Schild < 2 s; Override gewinnt über OSM; zeitbedingter Override zeigt Fenster-Label (aktives Fenster orange); Override läuft nach Reichweite/Richtungswechsel aus; Reload-fest (localStorage); später sauberer Export-Pfad.

---

## Querverweise
- Bugs: [`bugfixes.md`](bugfixes.md) · Ideen: [`ideen.md`](ideen.md) · Onboarding: [`agents.md`](agents.md)
