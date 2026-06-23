# Tracker — Feature-Warteschlange

> **Zweck:** Entschiedene/bald-zu-bauende Features, jede so spezifiziert, dass ein Subagent sie als Auftrag
> aufgreifen kann. Rohe Ideen: [`ideen.md`](ideen.md) · Bugs: [`bugfixes.md`](bugfixes.md).
> **Jeder Punkt steht genau EINMAL, selbst-tragend.** **Hausregeln: siehe [`../../CLAUDE.md`](../../CLAUDE.md)**
> (wird automatisch in jeden Agenten-Kontext geladen — hier keine Kopie, die veraltet).
> Status: `📐 spezifiziert` · `🏗️ teils gebaut` (MVP steht, Post-MVP offen) · `🅿️ gebaut-aber-geparkt` (Code da, wartet auf Integration/Daten/Server-Aktion).

---

## FEAT-1 — Brotkrumen zurück (offline) 📐 · 🔴 Prio 1, BAUEN
**Warum zuerst:** Doc-Prio 1, **Sicherheits-Feature** („bring mich heim" im Funkloch).
**Auftrag:** Führt den Nutzer **entlang der eigenen aufgezeichneten Spur** zurück zum Start — komplett **offline** (kein OSRM/Tiles, nur die vorhandenen `track`-Punkte).
**Neues Modul:** `HTML/js/tracker-breadcrumb.js`, Architektur 1:1 wie `tracker-nav.js` (`window.TrackerBreadcrumb(ctx)` mit `start(track)`/`update([lat,lng])`/`stop()`), eigene Leaflet-Layer (Rest-Spur + „Start"-Pin) + Banner/Pfeil. Toggle im Radial-Menü oder eigener FAB.
**Algorithmus:** cum[]-Distanz, gefensterter Segment-Snap, Off-Track-Recovery.
**Datenbasis (`tracker.js`):** `track`, `times/alts/speeds`, `posMarker`, `lastFix`, `bearingBetween()`, `haversine = TrackRender.haversine`.
**Sensorik-Leitplanke (Doc):** GPS = Wahrheit; IMU/Beschleunigung nur Ergänzung, nie GPS-Ersatz.
**Akzeptanz:** Out-and-back, Schleife, verzweigte Spur, GPS-Jitter, weit off-track→Recovery, „Start erreicht", langer Track (Perf), geladen vs. live, Flugmodus, App-Reload mitten im Heim-Modus (Modus+Snap-Index aus localStorage). Erst nach Feld-Testmatrix „scharf".

## FEAT-2 — Goldene Stunde & Sonnenstand 📐 · 🔴 Prio 1
**Auftrag:** Zeigt Sonnenstand + Uhrzeit der goldenen Stunde / des Sonnenuntergangs am aktuellen Standort (bestes Foto-Licht auf der Wanderung).
**Wiederverwenden:** die Sonnen-Mathe aus der **World Clock** (`HTML/worldclock/`) — erst dort greppen, nicht neu herleiten (Memory `feedback_check_existing_first`). Position aus `currentLatLng()`.
**Offen (eine Rückfrage):** Darstellung — eigene HUD-Kachel vs. Radial-Menü vs. Overlay-Panel? Vor dem Bau klären.

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

## FEAT-11 — „Contact AI" im Tracker (Solita), Stufe 1: Chat/Foto 📐 · Future Now
**Grundprinzip:** Die App ist **nur Fernbedienung** — KI läuft **server-seitig**. Kein SDK/Key/git im Browser/Capacitor.
**Auftrag Stufe 1:** App → **Supabase Edge Function** → **Claude API** (Key server-seitig, Regel 18) → Antwort. Q&A, **Foto beschreiben/erkennen (multimodal)**, Sprache→Antwort, **Streaming** fürs Live-Gefühl. Modelle: `claude-opus-4-8` (1M Kontext), `claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-fable-5`. ⚠️ Dieser Claude kennt das Repo **nicht** und ändert **keinen** Code.
**Caveat:** Opus = 1M Kontext (Modell), aber das Nutzungs-Kontingent ist plan-gedeckelt → vor Bau prüfen. *(Solita ist inzwischen weit gebaut — diesen Eintrag gegen den echten Stand prüfen.)*

## FEAT-12 — „Contact AI" Stufe 2: Wunsch einsprechen → Agent ändert Repo + pusht 📐 · Future Now
Schließt den Kreis mit FEAT-10: Sprach-Wunsch → Edge Function (hält Token) → Agent editiert `config.json` + push → Live-Config zieht's → Änderung erscheint live.
**Zwei Heimstätten:** (1) **Claude Code Routines** (Anthropic-gehostet, kein eigener Server; App POSTet, Token in Edge Function) oder (2) **Claude Agent SDK auf eigenem VPS** (volle Kontrolle). **Edge Functions können den vollen Agent-Loop NICHT hosten** (Zeitlimit, kein FS/git) — nur Stufe 1 + Routine *feuern*. **Sicherheit:** Token server-seitig, Agent-Scope eng. Routines = Beta → vor Bau verifizieren.
**Voraussetzung:** Solita-Weckwort — erst Vosk-Wortliste `["krass","solita","[unk]"]`, bei Bedarf openWakeWord/Picovoice auf Docs Stimme.

## FEAT-13 — Navi-Route: Google-Blau + gefahrene Strecke speed-gefärbt 🏗️ teils gebaut · 🔴 Prio 1
Code: `COL_ROUTE`/`drawRoute()` in `HTML/js/tracker-nav.js`. (c) ist erledigt (Punkt/Dreieck über der Linie, Ebene `nav-route` z350). Offen:
- **(a)** Linie exakt **#4285F4** + helleres/dünneres Casing (der gefühlte Unterschied kommt vom dunklen Navy-Casing, nicht vom Blau). Doc schickt Screenshot zum Feinabgleich.
- **(b) WICHTIG:** **blaue Linie nur VORAUS** (ab aktueller Position); der **gefahrene** Teil zeigt die **Geschwindigkeit** (leaflet-hotline wie der normale Track), nicht blau. Route an aktueller Position trimmen / Speed-Track oben drüber.

## FEAT-14 — Tracking & Navigation entkoppeln 📐
**Szenario:** „Track nach Dresden, navigiere hin — Plan ändert sich → **Navigation beenden**, **Track weiterlaufen** lassen (weiter nach Frankfurt)." Heute reißt STOP die Navi immer mit; „Navigation beenden" ist als „Ziel löschen" versteckt; Navi wird nur aus `onPosition()` (= nur bei Aufzeichnung) gefüttert.
**Empfehlung:** **C jetzt** (Quick-Win: „Ziel löschen" → **„Navigation beenden"** umbenennen, STOP entkoppeln, Hinweis „Navi aktiv") → **Ausbau zu A** (persistenter Navi-Chip `→ Dresden · 1:42 ✕`, **Re-Target** mitten im Track, Navi **ohne** laufende Aufzeichnung). Code: `beginTracking`/`finishTracking`/`__nav.*` in `tracker.js`.

## FEAT-16 — Live-Broadcast: Presence/Rückkanal 📐 Idee
Aus BUG-5: Zuschauer-Zähler („3 sehen dich") + Empfangs-Bestätigung („zuletzt empfangen vor 2 s"). Macht Sende-Diagnose trivial (0 verbunden = Name/Link; verbunden, kein Empfang = Sendeproblem). Erst **BUG-5** klären, dann als Feature.

## FEAT-17 — Lane Guidance (Spuranweisungen) 📐 · Prio 2
OSRM liefert `step.intersections[].lanes` (`indications` + `valid`). Kleines Spur-Diagramm unter dem Abbiege-Banner. Nur wo OSM `turn:lanes` getaggt ist (Autobahn-Ausfahrten meist ja). SVG-Pfeil-Set existiert bereits.

## FEAT-18 — Kleinere offene Punkte 📐
- **`#motion-dbg`-Readout entfernen** (unten links) — bewusst drin gelassen, **raus auf Zuruf** (Memory `feedback_keep_debug`: nicht eigenmächtig strippen).
- **Tracking-Notification farbig** (Akzentfarbe/Icon im Benachrichtigungs-Panel) — nativer Eingriff, offen.
- **Native Background-Test:** START → Screen sperren → laufen → prüfen, dass weiter aufgezeichnet wird.

## FEAT-20 — OSM-Zoom-Buttons (+/−): ausblenden oder schöner 📐 · klein
Die +/−-Buttons sind **unsere** (Leaflet-Default-Control): `tracker.js:18` `zoomControl:false`, dann `:28` `L.control.zoom({position:'bottomright'}).addTo(map)`.
**Optionen (Doc entscheidet):** **Weg** — `tracker.js:28` entfernen (Pinch-Zoom bleibt). **Schöner** — CSS `.leaflet-control-zoom`/`-in`/`-out` in `tracker.css` on-brand (dunkel/orange, Orbitron), ggf. Position.

## FEAT-21 — Instrumente ausblenden + Track/Karte mehr Platz 📐
- Im **Debug** ein Schalter, ob die **Instrumente (HUD-Kacheln)** ausgeblendet werden.
- Wenn ausgeblendet, soll **Track/Karte (FIT) mehr Platz** bekommen.
**Richtung:** Instrumente aus → `#hud-top` kollabieren, Karte den frei werdenden Platz nutzen (volle Höhe). Hängt mit Idle-Auto-Hide + dem d/k/w-Tasten-Toggle zusammen.

## FEAT-22 — Pl@ntNet-Schwelle 20 % 🅿️ Code da, Server-Aktion offen
**Stand:** `PLANTNET_SHOW_MIN = 0.20` ist in `supabase/functions/identify/index.ts` gesetzt (≥30 % Headline · 20–30 % Zweitmeinung · <20 % ganz weg).
**→ Offen (kein Bau):** Deploy durch Doc — `supabase functions deploy identify --no-verify-jwt`.

## FEAT-23 — HUD: oberes Element + Genauigkeit als zentrierte Gruppe 📐
**Wunsch:** das **obere Element** [Diktat unklar — vermutlich POSITION/GPS-Chip oder die Uhr, mit Doc klären] + die **Genauigkeit (±m)** in **eine Gruppe** fassen und die **ganze Gruppe zentrieren**.
**Wo:** `#hud-top` / `#gps-chip` (zeigt schon `gps-src` + `gps-acc ±m`) in `tracker.html` + `tracker.css`.

## FEAT-24 — Points of Interest (POI) 📐 · 🔴 PRIO 0
**Wunsch (Doc 2026-06-14):** POIs am Weg / auf der Karte (Sehenswürdigkeiten, Tankstellen, Aussichtspunkte …).
**Überschneidung (erst prüfen, nicht doppelt bauen):** WegCast Audio-POI, Foto-Spur-Erkennung, **FEAT-26** (Tankstellen sind schon POIs).
**Daten gratis (Regel 18):** Overpass/OSM (`tourism`/`historic`/`natural`), Wikipedia-Geosearch — kein Key.
**Erst klären (eine Rückfrage):** welche Kategorien + Darstellung (Karten-Pins vs. Liste vs. Audio am Weg)? Dann spezifizieren. Nicht bauen ohne „go" (Regel 2/4).

## FEAT-25 — Karten-PIN setzen + dorthin navigieren 📐 · 🔴 PRIO 0
**Wunsch (Doc 2026-06-14):** „Einen PIN auf der Karte setzen, wo man ggf. wieder hin navigieren kann."
**Auftrag:** Long-Press/Tap auf die Karte → PIN; Tipp auf den PIN → **Navigation dorthin** (baut auf `tracker-nav.js`, OSRM).
**Verwandt:** FEAT-3 (Parkplatz) + FEAT-4 (zurück zum Auto) — gleiche „Pin-als-Navi-Ziel"-Logik; gemeinsam denken. Nicht bauen ohne „go".

## FEAT-26 — Tankstellen / Tankpreise (Tankerkönig) 🅿️ gebaut-aber-inaktiv · 🔴 PRIO 0
**Stand (verifiziert):** Code ist **vollständig da** — Client `HTML/js/tracker-fuel.js` (`window.TrackerFuel`, default an) + Edge Function `supabase/functions/fuel-prices/index.ts`. Die Function ist auf das Secret `TANKERKOENIG_KEY` gegated.
**→ Es fehlt NUR die einmalige Server-Aktivierung (kein Bau):**
1. Gratis-Key: https://creativecommons.tankerkoenig.de/
2. Secret setzen: Supabase Dashboard → Edge Functions → Secrets → `TANKERKOENIG_KEY` (Regel 18: nur server-seitig).
3. Deployen: `supabase functions deploy fuel-prices --no-verify-jwt`
**Danach:** am Gerät prüfen, ob `TrackerFuel` Preise zeigt (Toggle `trk-fuel-on`). *(Hinweis: ein TANKERKOENIG_KEY wurde am 2026-06-21 gesetzt — gegen echten Stand prüfen.)*

## FEAT-27 — E2E Phase 0: `tracks`-RLS auf `owner` härten 📐 · **unabhängig, sofort (80/20)**
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

---

## Querverweise
- Bugs: [`bugfixes.md`](bugfixes.md) · Ideen: [`ideen.md`](ideen.md) · Onboarding: [`agents.md`](agents.md)
