# Tracker — Feature-Warteschlange (für Subagenten)

> **Zweck:** Konkret **entschiedene/bald-zu-bauende** Features mit genug Spezifikation, dass ein Subagent
> sie als Arbeitsauftrag aufgreifen kann. Abgrenzung: rohes Brainstorm liegt in [`ideen.md`](ideen.md);
> hier steht nur, was **Plan/Prio hat oder schon teilweise gebaut ist**. Erstellt 2026-06-12.
> **Dupliziert nichts** — verlinkt die Plan-Notizen und destilliert den Auftrag.

## ⚡ Kurz-Übersicht
- 🔴 **PRIO 0 — Doc 2026-06-14** (aus `ideen-wunsche.md` (konsolidiert), vor allem anderen):
  - **FEAT-24** Points of Interest (POI)
  - **FEAT-25** Karten-PIN setzen + dorthin navigieren
  - **FEAT-26** Tankstellen/Tankpreise — **nur Server-Aktivierung** (Code ist da)
  - **FEAT-22-Korrektur** Pl@ntNet-Schwelle 10 % → **20 %**
- **FEAT-1** Brotkrumen zurück (offline) · Prio 1
- **FEAT-2** Goldene Stunde & Sonnenstand · Prio 1
- **FEAT-3** Parkplatz automatisch merken
- **FEAT-4** Zurück zum Start/Auto (online)
- **FEAT-5** Regen-Vorwarnung (nach BUG-2)
- **FEAT-6** 🏗️ Navigation Post-MVP (Abbiege-Liste, Verkehr)
- **FEAT-7** 🅿️ Medien → Cloudflare R2
- **FEAT-8** 🅿️ Fotos → Storage-Bucket
- **FEAT-9** 🏗️ GPS-Postproc: Profil-UI, Map-Matching
- **FEAT-10** 🏗️ App live fernsteuern (Remote-Config)
- **FEAT-11** Contact-AI Stufe 1 (Chat/Foto, Solita)
- **FEAT-12** Contact-AI Stufe 2 (Agent ändert Repo)
- **FEAT-13** 🏗️ Navi-Blau + gefahrene Strecke speed-gefärbt · Prio 1
- **FEAT-14** Tracking ↔ Navigation entkoppeln
- **FEAT-16** Live-Broadcast: Zuschauerzähler/Presence
- **FEAT-17** Lane Guidance (Spuranweisungen)
- **FEAT-18** Kleinkram (motion-dbg raus, Notif-Farbe, BG-Test)
- **FEAT-20** OSM-Zoom-Buttons weg/schöner
- **FEAT-21** Instrumente ausblenden → Track mehr Platz
- **FEAT-22** ✅ Pl@ntNet < 10 % ausgeblendet (gebaut + deployed 2026-06-13)
- **FEAT-23** HUD: oberes Element + Genauigkeit zentrieren

## Hausregeln für JEDEN Subagenten (CLAUDE.md)
- **Regel 2/4:** NICHTS bauen ohne Docs „go". Diese Liste priorisiert & spezifiziert — sie startet nichts.
- **Regel 3:** „Neues Tool/Modul" = ein bestehendes kopieren und ausräumen, exakt benennen — nicht von null.
  Vorlage für ein neues Tracker-Modul ist **`HTML/js/tracker-nav.js`** (sauberes `window.TrackerXxx(ctx)`-Muster).
- **Regel 7:** Shared UI/Logik **zentral** (`HTML/js/*`, `tracker.css`) — Banner/Pfeil/Toggle gehören in die
  gemeinsamen Dateien, nie inline in ein Lab.
- **Regel 8:** Orbitron. **Regel 14/15:** Kommentare & Code Englisch. **Regel 16:** responsiv.
- **Regel 18:** NIE Key/Token im Repo. Gratis-Dienste ohne Key bevorzugen (Nominatim/OSRM/Overpass/
  Wikipedia); braucht es einen Key → server-seitig in einer Edge-Function.
- **Regel 20:** Bei Klärung **eine offene Frage**, keine Optionslisten.
- **Module einhängen:** neues `tracker-xyz.js` in die `document.write`-Skriptliste in `tracker.html` und es
  bekommt `map`/Position/`toast`/`showPanel` über den Context wie die anderen Module.

## Status-Legende
`📐 spezifiziert` Plan da, noch nicht gebaut · `🏗️ teils gebaut` MVP steht, Post-MVP offen ·
`🅿️ gebaut-aber-geparkt` Code existiert, wartet auf Integration/Daten · `✅ gebaut` (Referenz)

> ✅ **Quellen:** Die OTWA-Session vom **2026-06-11** wurde **am 2026-06-12 in `main` gemerged**
> (Merge `48dc37e`). Mit `🌿` markierte Pläne/Builds sind jetzt **lokal vorhanden** (das 🌿 zeigt nur die
> Herkunft). **Schon gebauter Code darf nicht doppelt gebaut werden** — vor dem Bauen kurz prüfen, was
> bereits da ist.

---

## Bereits gebaut (Referenz — NICHT neu bauen) ✅
**Session 2026-06-10 (in `main`):**
- **Einfache Navigation** (`HTML/js/tracker-nav.js`): Adresse → Route (Nominatim + OSRM), START
  navigiert **und** trackt, Ziel-Pin, ETA, **Re-Routing** bei Abweichung, **Abbiege-Ansage per Stimme**
  (seit 2026-06-20 über **Cloud-TTS** `SolitaVoice` — Pixel-WebView-Fix, s. bugfixes.md BUG-9;
  `speechSynthesis` nur noch Desktop-Fallback) + On-screen-Banner, Schalter „Sprachansage" (persistiert).
  Karten-Kamera während der Navigation: **dynamischer Reststrecken-Fit** (BUG-10, 2026-06-20).
- **Tempo-Limit-Schild** (`HTML/js/tracker-speedlimit.js`): OSM `maxspeed`, rot bei Übertretung.
- **Tempo-Warnton:** kleine Glocke bei >10 % über Limit.
- **Idle-Auto-Hide**, **Kompass/Nordpfeil**, **Quellen-Status** (DWD/RainViewer) im Debug.
- **Cross-Device-Sync ohne Login** (`archive/sync-sketch.md`, ✅ umgesetzt): deterministisches geteiltes Konto →
  Tracks/Fotos auf mehreren Geräten. Referenz, nicht neu bauen.

**🌿 Session 2026-06-11 (auf dem Branch, NICHT in main):**
- **Live-Config-Demo** (Idee 19): `docalvers.de/config.json` → `HTML/js/tracker-config.js` pollt (~20 s,
  ETag) → CSS-Variablen, **reload-frei**. Fernsteuerbar: Stat-Farbe unter der Uhr, Navi-Banner Farbe/
  z-Order/Süd-Offset. → produktionsreif machen = **FEAT-10**.
- **solita.html (ex-labai) Voice-Modus:** 🎤 Diktat (de-DE, freihändig senden) + 🔊 Antworten vorlesen (TTS).
  Am 2026-06-12 zu **Solita** ausgebaut: Wake-Word „Solita", Claude-`claude`-Edge-Function (Code da, Deploy
  offen), Persona + Kontext-Zusammenfassung. Siehe `archive/plan-contact-ai-im-tracker.md` / FEAT-11.
- **Navi-Banner reicher:** ETA + Straße/Ref + Schild-Ziele, Google-Navi-Grün, unter dem Header.
- **Abbiegepfeile** von Unicode auf saubere **SVG-Pfeile** (`arrowSvg()` in `tracker-nav.js`).
- **Tempolimit-Schild** robuster: nächste Straße, deutsche Zonen-Tags, „c" statt ∞ bei unbegrenzt,
  springt beim Überschreiten nach vorne.
- **FIT-Button = 3-Stufen-Loop** (ganze Route → Reststrecke → aus); Mittig-Zentrieren zurückgenommen.
- **Tempo-abhängiger Zoom** beim Folgen (schnell=raus, langsam=rein).
- **Tempo-Glocke** per Häkchen (Einstellungen→Debug, persistiert) · **mobile Shortcuts d/k/w** im Debug.
- **krass-app** zählt jetzt auch „solita"/„solida".
- Positionspunkt + weißes Richtungs-Dreieck **über** der blauen Navi-Linie.

---

## FEAT-1 — Brotkrumen zurück (offline) 📐 spezifiziert · **Prio 1, BAUEN**
**Warum zuerst:** Doc-Prio 1 und **Sicherheits-Feature** („bring mich heim" im Funkloch).
**Voll-Spezifikation (Pflichtlektüre, fertig ausgearbeitet):** [`archive/plan-brotkrumen.md`](archive/plan-brotkrumen.md)
— enthält Algorithmus (cum[]-Distanz, gefensterter Segment-Snap, Off-Track-Recovery), UX, Touch-Points,
Test-Matrix und Reihenfolge.

**Kurz-Auftrag:** Führt den Nutzer **entlang der eigenen aufgezeichneten Spur** zurück zum Start —
komplett **offline** (kein OSRM, keine Tiles, nur die vorhandenen `track`-Punkte).
**Neues Modul:** `HTML/js/tracker-breadcrumb.js`, **Architektur 1:1 wie `tracker-nav.js`**
(`window.TrackerBreadcrumb(ctx)` mit `start(track)` / `update([lat,lng])` / `stop()`), eigene Leaflet-Layer
(Rest-Spur + „Start"-Pin) + Banner/Pfeil. Toggle im Radial-Menü oder eigener FAB.
**Datenbasis schon da (`tracker.js`):** `track`, `times/alts/speeds`, `posMarker`, `lastFix`,
`bearingBetween()`, `haversine = TrackRender.haversine`.
**Sensorik-Leitplanke (Doc bestätigt):** GPS = Wahrheit; IMU/Beschleunigung **nur Ergänzung**, nie GPS-Ersatz.
**Akzeptanz:** Out-and-back, Schleife, verzweigte Spur, GPS-Jitter, weit off-track→Recovery,
„Start erreicht", langer Track (Perf), geladen vs. live, **Flugmodus**, **App-Reload mitten im Heim-Modus**
(Modus+Snap-Index aus localStorage wiederherstellen). Erst nach Feld-Testmatrix „scharf".

---

## FEAT-2 — Goldene Stunde & Sonnenstand 📐 spezifiziert · **Prio 1**
**Quelle:** [`archive/tracker-ideen.md`](archive/tracker-ideen.md) Idee 13 (Doc: „bestimmt nicht so schwer").
**Auftrag:** Zeigt Sonnenstand + Uhrzeit der goldenen Stunde / des Sonnenuntergangs am aktuellen Standort
(bestes Foto-Licht auf der Wanderung).
**Wiederverwenden:** die **Sonnen-Mathe aus der World Clock** (`HTML/worldclock/`) — erst dort greppen,
nicht neu herleiten (Memory `feedback_check_existing_first`). Position aus `currentLatLng()`.
**Offen für Doc:** Darstellung — eigene HUD-Kachel vs. Eintrag im Radial-Menü vs. Overlay-Panel. **Eine
Rückfrage** stellen, bevor gebaut wird.

---

## FEAT-3 — Parkplatz automatisch merken 📐 spezifiziert · Prio 1 (Vorschlag)
**Quelle:** [`archive/tracker-ideen.md`](archive/tracker-ideen.md) Idee 11 (klein, delightful; verwandt mit FEAT-4).
**Auftrag:** Wechselt die **Activity-Erkennung** von „fahren" → „zu Fuß", setzt der Tracker automatisch
einen Park-Pin. Auto später entspannt wiederfinden.
**Wiederverwenden:** `effectiveActivity()` (Activity-Recognition ist schon da) + Pin-Layer.
**Verbindet mit FEAT-4:** der Park-Pin ist ein natürliches Ziel für „Zurück zum Auto".

---

## FEAT-4 — Zurück zum Start / zum Auto 📐 spezifiziert · Prio 1 (Vorschlag)
**Quelle:** [`archive/tracker-ideen.md`](archive/tracker-ideen.md) Idee 1.
**Auftrag:** Ein Tipp routet **online** (OSRM, baut auf `tracker-nav.js`) zurück zum Startpunkt der
Aufzeichnung oder zum gemerkten Park-Pin (FEAT-3).
**Abgrenzung zu FEAT-1:** FEAT-1 folgt offline der eigenen Spur (Wandern/Funkloch); FEAT-4 routet online auf
Straßen (Auto/Stadt). Gleiche Präsentation (Banner/Pfeil/Voice).

---

## FEAT-5 — Regen-Vorwarnung unterwegs 📐 spezifiziert · Prio 1 (Vorschlag)
**Quelle:** [`archive/tracker-ideen.md`](archive/tracker-ideen.md) Idee 10.
**Auftrag:** Das vorhandene **Regenradar vorausschauend** nutzen: „In ~12 Min Regen an deinem Standort/auf
deiner Route." Besonders für Motorradfahrer.
**Abhängigkeit:** ⚠️ Hängt an **BUG-2** (Regenradar zeigt in DE oft nichts) — eine Vorwarnung auf leeren
Daten ist sinnlos. **BUG-2 zuerst.**
**Wiederverwenden:** `rain-radar.js` (Frames/Nowcast) + Route aus `tracker-nav.js`.

---

## FEAT-6 — Navigation Post-MVP 🏗️ teils gebaut
**Quelle:** [`archive/plan-navigation-einfach.md`](archive/plan-navigation-einfach.md) (MVP + Re-Routing + Voice schon gebaut).
**Noch offen (je ein eigener kleiner Auftrag):**
- **Vollständige Abbiege-Liste** (statt nur nächstes Manöver).
- **„passiert"-Erkennung:** Manöver weiterzählen, wenn man bei schneller Fahrt zwischen zwei Fixes daran
  vorbeikommt.
- **Verkehr/Baustellen:** gratis machbar über **Autobahn-GmbH-API** (DE, kein Key) / DATEX II / Mobilithek;
  farbiger Echtzeit-Stau realistisch nur via TomTom/HERE-Freemium (Recherche in
  [`fahrt-bad-homburg-2026-06-10.md` → archiviert](../../archive.md)).

---

## FEAT-7 — Medien (Foto/Voice/Video) nach Cloudflare R2 🅿️ gebaut-aber-geparkt
**Quelle:** [`plan-r2-media.md`](../../archive.md). Memory `project_tracker_media_r2_migration_parked`.
**Stand:** Neuer R2-Upload-Code liegt schon im Baum. **Blocker:** 228 Alt-Fotos + 5 Voice (~42,7 MB) sind
NICHT migriert — `sb_secret_` ist kein JWT für die gated `media-sign`-Funktion.
**Auftrag (sobald Doc grünes Licht/Key-Lage klärt):** Migrationspfad für Alt-Medien lösen; **kein Secret ins
Repo** (Regel 18). Bis dahin: nur dokumentieren, nicht „aufräumen".

---

## FEAT-8 — Fotos aus der DB in Storage-Bucket auslagern 🅿️ geparkt (Alternative/Vorstufe zu FEAT-7)
**Quelle:** [`plan-fotos-in-storage.md`](../../archive.md). Memory `project_tracker_photos_storage_plan`.
**Stand:** Fotos liegen als base64 in der DB (~28 MB/169 ≈ 5,6 % von 500 MB). Plan: in Supabase-Storage-Bucket.
Renderer/GPX bleiben unberührt (URL lädt wie base64). **Erst mit Doc klären, ob R2 (FEAT-7) das ablöst** —
nicht beide parallel bauen.

---

## FEAT-9 — GPS-Nachbearbeitung: nächste Stufen 🏗️ teils gebaut
**Quelle:** Memory `project_tracker_gps_postproc`. **Gebaut:** Client-Glättung (`track-smooth.js`,
GLÄTTEN-Toggle) + DEM-Höhe (`track-dem.js`, Open-Meteo, `effectiveAlts`-Funnel).
**Offen (NEXT):** Aufstiegs-/Profil-UI (Höhenmeter, Profil-Graph), Map-Matching (nur fürs Auto sinnvoll,
Memory/`tracker-plan.md`).

---

## FEAT-10 — App live fernsteuern (Remote-Config) 🏗️ teils gebaut 🌿 · **Prio 1 (Idee 19)**
**Voll-Spez (Pflichtlektüre, 🌿 Branch):** `archive/plan-fernsteuerung-remote-config.md` — inkl. komplettem,
an echten DOM-Elementen geerdetem **Konfig-Schema** (`config.json` v7: theme/head/fabs/navBanner/speedSign/
compass/route/controls/params).
**Stand:** Demo läuft (s. o., `tracker-config.js` pollt `config.json` → CSS-Variablen, reload-frei).
**Auftrag (ausbauen):** Schema breiter umsetzen (mehr Knoten auf CSS-Variablen + minimal JS für
Sichtbarkeit/z-Index/Position), **Config validieren & clampen** (kaputter Wert darf UI nicht zerlegen,
Defaults als Fallback), **Versionsfeld**, optional **Supabase Realtime** statt Polling (instant-Push;
ETag-Poll als Fallback). **Regel 18:** Config ist public → **keine Secrets**, nur Präsentation/Parameter.
**Verallgemeinerbar** aufs ganze forloop-Projekt (zentrale Theme-Config).

## FEAT-11 — „Contact AI" im Tracker (Solita), Stufe 1: Chat/Foto 📐 spezifiziert 🌿 · **Future Now (Idee 20)**
**Voll-Spez (Pflichtlektüre, 🌿 Branch):** `archive/plan-contact-ai-im-tracker.md`. Name/Weckwort: `archive/agent-name-solita.md`.
**Grundprinzip:** Die App ist **nur Fernbedienung** — KI läuft **server-seitig**. Kein SDK/Key/git im
Browser oder in Capacitor.
**Auftrag Stufe 1:** App → **Supabase Edge Function** → **Claude API** (Key server-seitig, Regel 18) →
Antwort. Kann Q&A, **Foto beschreiben/erkennen (multimodal)**, Sprache→Antwort. **Streaming** fürs
Live-Gefühl. Modelle: `claude-opus-4-8` (1M Kontext), `claude-sonnet-4-6`, `claude-haiku-4-5`,
`claude-fable-5` (neuestes). ⚠️ Dieser Claude kennt das Repo **nicht** und ändert **keinen** Code.
**Caveat:** Opus = 1M Kontext (Modell), aber das Nutzungs-Kontingent ist plan-gedeckelt → vor Bau prüfen.

## FEAT-12 — „Contact AI" Stufe 2: Wunsch einsprechen → Agent ändert Repo + pusht 📐 spezifiziert 🌿 · **Future Now**
**Voll-Spez:** `archive/plan-contact-ai-im-tracker.md` (Stufe 2). Schließt den Kreis mit FEAT-10:
Sprach-Wunsch → Edge Function (hält Token) → Agent editiert `config.json` + push → Live-Config zieht's →
Änderung erscheint live. **Zwei Heimstätten** für den Agenten: (1) **Claude Code Routines**
(Anthropic-gehostet, kein eigener Server; App POSTet, Token in Edge Function) oder (2) **Claude Agent SDK
auf eigenem VPS** (volle Kontrolle). **Edge Functions können den vollen Agent-Loop NICHT hosten**
(Zeitlimit, kein FS/git) — nur Stufe 1 + Routine *feuern*. **Sicherheit:** Token server-seitig,
Agent-Scope/Rechte eng. Status (Routines) = experimentell/Beta → vor Bau verifizieren.
**Voraussetzung:** Solita-Weckwort (`krass-app/wakeword-solita-erkennung.md`): erst Vosk-Wortliste
`["krass","solita","[unk]"]`, bei Bedarf openWakeWord/Picovoice auf Docs Stimme.

## FEAT-13 — Navi-Route: Google-Blau + gefahrene Strecke speed-gefärbt 🏗️ teils gebaut 🌿 · **Prio 1 (Idee 17)**
**Quelle:** `archive/tracker-ideen.md` Idee 17. Code: `COL_ROUTE`/`drawRoute()` in `HTML/js/tracker-nav.js`.
- **(a)** Linie exakt **#4285F4** + helleres/dünneres Casing (der gefühlte Unterschied kommt vom dunklen
  Navy-Casing, nicht vom Blau). Doc schickt Screenshot zum Feinabgleich.
- **(b) WICHTIG:** **blaue Linie nur VORAUS** (ab aktueller Position); der **gefahrene** Teil zeigt die
  **Geschwindigkeit** (leaflet-hotline wie der normale Track), nicht blau. Route an aktueller Position
  trimmen / Speed-Track oben drüber.
- **(c) ✅ erledigt 2026-06-11:** Punkt/Dreieck liegen über der Linie (Ebene `nav-route`, z 350).

## FEAT-14 — Tracking & Navigation entkoppeln 📐 spezifiziert 🌿
**Voll-Spez (Pflichtlektüre, 🌿 Branch):** `archive/plan-tracking-vs-navigation.md`.
**Szenario:** „Track nach Dresden, navigiere hin — Plan ändert sich → **Navigation beenden**, **Track
weiterlaufen** lassen (weiter nach Frankfurt)." Heute reißt STOP die Navi immer mit; „Navigation beenden"
ist als „Ziel löschen" versteckt; Navi wird nur aus `onPosition()` (= nur bei Aufzeichnung) gefüttert.
**Empfehlung:** **C jetzt** (Quick-Win: „Ziel löschen" → **„Navigation beenden"** umbenennen, STOP
entkoppeln, Hinweis „Navi aktiv") → **Ausbau zu A** (persistenter Navi-Chip `→ Dresden · 1:42 ✕`,
**Re-Target** mitten im Track, Navi **ohne** laufende Aufzeichnung). Code: `beginTracking`/
`finishTracking`/`__nav.*` in `tracker.js`.

## FEAT-16 — Live-Broadcast: Presence/Rückkanal 📐 Idee
Aus BUG-5: Zuschauer-Zähler („3 sehen dich") + Empfangs-Bestätigung („zuletzt empfangen vor 2 s").
Macht Sende-Diagnose trivial (0 verbunden = Name/Link; verbunden, kein Empfang = Sendeproblem).
Erst **BUG-5** klären, dann als Feature.

## FEAT-17 — Lane Guidance (Spuranweisungen) 📐 · Prio 2 (Idee 18)
**Quelle:** `archive/tracker-ideen.md` Idee 18. OSRM liefert `step.intersections[].lanes` (`indications` +
`valid`). Kleines Spur-Diagramm unter dem Abbiege-Banner. Nur wo OSM `turn:lanes` getaggt ist
(Autobahn-Ausfahrten meist ja). SVG-Pfeil-Set existiert bereits (FEAT-13c).

---

## FEAT-18 — Kleinere offene Punkte (aus `tracker-plan.md`)
Klein, einzeln greifbar; Voll-Kontext im Backlog [`tracker-plan.md`](../../archive.md):
- **`#motion-dbg`-Readout entfernen** (unten links) — bewusst drin gelassen, **raus auf Zuruf** (Memory
  `feedback_keep_debug`: nicht eigenmächtig strippen).
- **Tracking-Notification farbig** (Akzentfarbe/Icon im Benachrichtigungs-Panel) — nativer Eingriff, offen.
- **Native Background-Test:** START → Screen sperren → laufen → prüfen, dass weiter aufgezeichnet wird.

---

## FEAT-20 — OSM-Zoom-Buttons (+/−): ausblenden oder schöner 📐 · klein
**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 1). **Geklärt:** die +/−-Buttons sind **unsere** (Leaflet-
Default-Control, von uns gesetzt): `tracker.js:18` `zoomControl:false`, dann **`:28`**
`L.control.zoom({position:'bottomright'}).addTo(map)`.
**Optionen (Doc entscheidet):**
- **Weg:** `tracker.js:28` entfernen → keine +/−-Buttons (Pinch-Zoom bleibt).
- **Schöner:** CSS `.leaflet-control-zoom` / `-in` / `-out` in `tracker.css` on-brand (dunkel/orange,
  Orbitron), ggf. Position ändern.

## FEAT-21 — Instrumente ausblenden + Track/Karte mehr Platz 📐
**Quelle:** Fahrt-Notiz 2026-06-12 (Notizen 2 + 6). **Nur Notiz** (Regel 2/4).
- **Note 2:** im **Debug** einen Check/Schalter, ob die **Instrumente (HUD-Kacheln)** ausgeblendet werden.
- **Note 6:** Da die Instrumente **zu ~99 %** ausgeblendet sind (wenn der Haken gesetzt ist), soll der
  **Track / die Karte (FIT) mehr Platz** bekommen — aktuell nimmt der Track zu wenig Fläche ein.
**Richtung:** Instrumente aus → `#hud-top` kollabieren, Karte den frei werdenden Platz nutzen lassen
(volle Höhe). Hängt mit Idle-Auto-Hide + der WIP „d/k/w-Tasten-Toggle" zusammen.

## FEAT-22 — Pl@ntNet-Konfidenz-Schwelle ✅ GEBAUT + DEPLOYED 2026-06-13 (Commit `1762b4f`)
> 🔴 **PRIO-0-Korrektur (Doc 2026-06-14, `ideen-wunsche.md` (konsolidiert)):** Schwelle **10 % → 20 %** —
> alles unter **20 %** komplett ausblenden.
> ✅ **Code geändert 2026-06-14:** `PLANTNET_SHOW_MIN = 0.20` in `supabase/functions/identify/index.ts:21`
> (≥30 % Headline · 20–30 % Zweitmeinung · <20 % ganz weg). **Offen: Deploy durch Doc** →
> `supabase functions deploy identify --no-verify-jwt`.

**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 4). **Nur Notiz.**
**Regel-Idee:** Pl@ntNet-Treffer mit Konfidenz **< ~10 %** gar nicht anzeigen; **besonders nicht**, wenn
**Google/Gemini** ein gutes Ergebnis hat.
**Offen (erst messen, nie raten):** Pl@ntNet-Score und Google/Gemini-Qualität sind verschiedene Skalen —
wie vergleichbar machen? Schwellwert empirisch. Wo: Erkennungs-Pipeline (`supabase/functions/identify/`
+ Foto-Spur-Anzeige `tracker-media.js`).
**✅ Umgesetzt (Commit `1762b4f`, deployed):** neue Schwelle `PLANTNET_SHOW_MIN = 0.10` in
`supabase/functions/identify/index.ts`. **Zwei-Stufen-Modell:** ≥ 30 % → PlantNet schreibt die Überschrift ·
10–30 % → PlantNet als Zweitmeinung (Gemini-Überschrift) · **< 10 % → PlantNet komplett raus** (keine
„PlantNet:"-Zeile, keine Heimat, nur Gemini). Unterdrückte Treffer bleiben im `_diag` als `{low,sci}`;
Client-DEBUG (`tracker-media.js`) zeigt sie als `pn=low <score> <sci>`. Edge Function am 2026-06-13 deployed
(Projekt `fyfhxzyymmurlaenmzse`). **Absolut** umgesetzt (auch wenn Gemini nichts hat) — Variante „nur
verstecken wenn Gemini gut" wäre ein Einzeiler, falls gewünscht.

## FEAT-23 — HUD: oberes Element + Genauigkeit als zentrierte Gruppe 📐
**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 5). **Nur Notiz.**
**Wunsch:** das **obere Element [Diktat unklar — vermutlich POSITION/GPS-Chip oder die Uhr, mit Doc klären]**
+ die **Genauigkeit (±m)** in **eine Gruppe** fassen und die **ganze Gruppe zentrieren**.
**Wo:** `#hud-top` / `#gps-chip` (zeigt schon `gps-src` + `gps-acc ±m`) in `tracker.html` + `tracker.css`.
Knüpft an die alte `tracker-plan.md`-Idee „POSITION oben zentriert, Genauigkeit dahinter" an.

---

## FEAT-24 — Points of Interest (POI) 📐 · 🔴 PRIO 0
**Quelle:** `ideen-wunsche.md` (konsolidiert) (Doc 2026-06-14): „Wir brauchen Points of Interest."
**Wunsch:** POIs am Weg / auf der Karte (Sehenswürdigkeiten, Tankstellen, Aussichtspunkte …).
**Überschneidung (erst prüfen, nicht doppelt bauen):** WegCast Audio-POI [`archive/drivecast-audio-poi-am-weg.md`](archive/drivecast-audio-poi-am-weg.md),
Foto-Spur-Erkennung, **FEAT-26** (Tankstellen sind schon POIs).
**Daten gratis (Regel 18):** Overpass/OSM (`tourism`/`historic`/`natural`), Wikipedia-Geosearch — kein Key.
**Erst klären (eine Rückfrage):** welche Kategorien + Darstellung (Karten-Pins vs. Liste vs. Audio am Weg)?
Dann spezifizieren. **Nur Notiz, nicht bauen ohne „go" (Regel 2/4).**

## FEAT-25 — Karten-PIN setzen + dorthin navigieren 📐 · 🔴 PRIO 0
**Quelle:** `ideen-wunsche.md` (konsolidiert) (Doc 2026-06-14): „Einen PIN auf der Karte setzen,
wo man ggf. wieder hin navigieren kann."
**Auftrag:** Long-Press/Tap auf die Karte → PIN; Tipp auf den PIN → **Navigation dorthin** (baut auf
`HTML/js/tracker-nav.js`, OSRM).
**Verwandt:** FEAT-3 (Parkplatz automatisch) + FEAT-4 (zurück zum Auto) — gleiche „Pin-als-Navi-Ziel"-Logik;
gemeinsam denken, nicht dreimal bauen.
**Wiederverwenden:** `tracker-nav.js` (Route/Banner/Voice), vorhandener Pin-Layer. **Nur Notiz (Regel 2/4).**

## FEAT-26 — Tankstellen / Tankpreise (Tankerkönig) 🅿️ gebaut-aber-inaktiv · 🔴 PRIO 0
**Quelle:** `ideen-wunsche.md` (konsolidiert) (Doc 2026-06-14): „Wie funktioniert das, ist das
eingebaut, was muss ich tun?"
**Stand (verifiziert):** Code ist **vollständig da** — Client `HTML/js/tracker-fuel.js` (`window.TrackerFuel`,
standardmäßig an) + Edge Function `supabase/functions/fuel-prices/index.ts`. Die Function ist auf das Secret
**`TANKERKOENIG_KEY`** gegated (fehlt es → HTTP 500 „TANKERKOENIG_KEY fehlt").
**→ Es fehlt NUR die einmalige Server-Aktivierung (kein Bau):**
  1. Gratis-Key holen: https://creativecommons.tankerkoenig.de/
  2. Als Secret setzen: Supabase Dashboard → Edge Functions → Secrets → `TANKERKOENIG_KEY`
     (**Regel 18:** Key nur server-seitig, nie ins Repo).
  3. Deployen: `supabase functions deploy fuel-prices --no-verify-jwt`
**Danach:** am Gerät prüfen, ob `TrackerFuel` Preise zeigt (Toggle `trk-fuel-on`). Server-Aktion durch Doc.

---

## Nicht-Tracker / Verteilung & Wissen (Kontext, kein Bau-Auftrag)
- **Play-Store-Verteilung** (🌿 `archive/verteilung-playstore-tester.md`): Samsung „Auto Blocker" blockt Sideload;
  Play Store braucht für neue persönliche Konten **12 Tester · 14 Tage**. Firmenkonto (D-U-N-S) umgeht die
  Auflage. **Thema „nächste Woche"** — Entscheidung, kein Code.
- **Wissens-Notiz Lebens-Agent** (🌿 `archive/wissensnotiz-llm-kompression-lebensagent.md`): Tokens/Kompression +
  Memory-Architektur (extern speichern, Retrieval, stufenweise verdichten) für den „Solita/Samantha"-
  Lebensbegleiter. Referenz/Hintergrund, kein Auftrag.

---

## Reihenfolge-Empfehlung (Vorschlag — Doc kippt)
0. **Branch `fit-mode…` nach `main` mergen** (3-Wege) — sonst doppelte/divergente Arbeit.
1. **BUG-1** (Speed) + **BUG-2** (Regenradar) + **BUG-5** (Live-Broadcast) — Vertrauen in die Basis.
2. **FEAT-1 Brotkrumen** (Prio 1, Sicherheit) · **FEAT-2 Goldene Stunde** (klein, Prio 1) ·
   **FEAT-13 Navi-Blau/Speed** (Prio 1) · **FEAT-15 KI-Indikator** (klein, wartet nur auf Variantenwahl).
3. **FEAT-14 Tracking↔Navi entkoppeln** (Quick-Win C) · **FEAT-3 Parkplatz → FEAT-4 Zurück zum Auto**.
4. **FEAT-5 Regen-Vorwarnung** (erst nach BUG-2).
5. **FEAT-10 Remote-Config ausbauen** · **FEAT-11/12 Contact-AI/Solita** (Future Now, größer).
6. Rest nach Doc-Prio.

## FEAT-27 — E2E Phase 0: `tracks`-RLS auf `owner` härten 📐 spezifiziert · **unabhängig, sofort (80/20)**
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` (Stand 2026-06-09), Phase 0 + Aufwand-Schritt 0. Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Warum zuerst:** Billig, **unabhängig** vom restlichen E2E. Heute steht der publishable/anon-Key im public Repo → wer ihn nimmt, kann je nach RLS **alle** Tracks ziehen. RLS-Scope stoppt Zufalls-/Repo-Leser (deckt „nur ich seh die Tracks" zu ~90 % ab). Schützt **nicht** vor DB-/Supabase-Zugriff (das ist erst echtes E2E, FEAT-29ff).
**Auftrag:** `tracks`-RLS pro Sync-Code/Owner scopen. **Owner-Spalte** `owner` = `PBKDF2(syncCode,'tracker-owner-salt-v1')` → hex, **clear** (gibt nichts preis, erlaubt „meine Tracks listen" + RLS-Scope ohne Entschlüsseln). Kein Sync-Code (rein lokal) → Cloud-Sync ohnehin aus.
**Erst messen (Regel „nie raten"):** `pg_policies`-Abfrage laufen lassen, **dann** gezielt scopen (knüpft an Memory `project_tracker_e2e_plan` „offen: pg_policies-Check").
**Caveat (mission-critical, Supabase/R2-Regel):** Policy-Änderung an Live-DB — Backup/Anschauen vor Mutation, reversibel halten, an 1 Track testen+verifizieren. **Nur nach Docs „go" (Regel 2/4).**

## FEAT-28 — E2E Phase 1: geteiltes `HTML/js/crypto-box.js` (aus `vgp-crypto.js`) 📐 spezifiziert · Enabler
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` („VGP-Modell" + „Wiederverwendung" + Aufwand-Schritt 1). **Aufwand: mittel.** Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Audit-Ziel (keine Doppel-Implementierung, Memory `feedback_single_source_of_truth`):** `vgp-crypto.js`-Primitive in ein **geteiltes `HTML/js/crypto-box.js`** ziehen → VGP **und** Tracker teilen eine Krypto-Schicht. Web-Crypto-API, **kein Lib, kein Key am Server** (Regel 18).
**Zu übernehmende Bausteine (`HTML/vgp/js/vgp-crypto.js`):** Schlüssel = Passwort → `PBKDF2` (200 000 Runden, SHA-256, fester Salt) → **AES-GCM-256**, nie am Server · öffentliche Gruppen-ID = `PBKDF2(passwort, group-salt)` → hex, liegt **clear** (Server gruppiert ohne Entschlüsseln) · Text: `encryptText()` → `iv(12)++ct`, base64, Prefix **`ENC:`**; `decryptText()` lässt Nicht-`ENC:` als Klartext durch (Migration nebenbei) · Bilder/Binär: `encryptBytes()/decryptBytes()` → `iv(12)++ct` als `Uint8Array`.
**Tracker-Key (kein neues Passwort):** `trackKey = PBKDF2(syncCode,'tracker-key-salt-v1')` → AES-GCM-256 (nur im Speicher, nie hochgeladen). **Voraussetzung für FEAT-29/30/31/32.** **Nur nach Docs „go" (Regel 2/4).**

## FEAT-29 — E2E Phase 2: Tracks verschlüsseln (Kern) 📐 spezifiziert · Aufwand: mittel
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` (Tabelle „Was wird Ciphertext" + Datenfluss + Aufwand-Schritt 2). **Setzt FEAT-28 voraus.** Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Auftrag:** `points` (Route) · `waypoints` (GPS+Titel+Text) · `name` (als `ENC:`) vor `insert/update` durch `encryptText`/`encryptBytes` (Foto → FEAT-30). `owner` (hex) bleibt **clear** (RLS-Scope); `created_at`/`status`/`id`/`share_id` bleiben **clear** (Metadaten, fürs Funktionieren nötig).
**Datenfluss:** Speichern → vor `insert/update` verschlüsseln, `owner` clear mitschreiben. Laden → nach `select` `decryptText`/`decryptBytes` mit `trackKey`; Alt-Klartext-Zeilen laufen dank `ENC:`-Durchlass weiter.
**⚠️ Trade-off (load-bearing):** die server-seitige **`list_tracks()`-RPC (km/Dauer) entfällt** — Punkte sind Ciphertext → km/Dauer/Foto-Anzahl **client-seitig** aus den entschlüsselten Punkten rechnen (hatten wir gerade erst eingebaut).
**Abwägen + Rückfrage:** `distance_m`/`duration_s`/`photo_count` mitverschlüsseln **oder** als grobe Klartext-Metadaten für die Liste lassen? **Eine offene Frage an Doc** (Regel 20).
**Verlust-Caveat (ehrlich):** Sync-Code verloren → **Tracks sind weg** (kein Server-Recovery, der Preis von echtem E2E). **Nur nach Docs „go" (Regel 2/4).**

## FEAT-30 — E2E Phase 3: Fotos verschlüsseln 📐 spezifiziert · Aufwand: mittel
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` (Foto-Zeile + Datenfluss „Foto-KI" + Aufwand-Schritt 3). **Setzt FEAT-28/29 voraus.** Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Auftrag:** Foto-Bild via `encryptBytes` → `iv(12)++ct`. Ablage **inline base64** **oder** **privater Storage-Bucket** (wie VGPs „media"). **Mit FEAT-7 (R2) / FEAT-8 (Storage-Bucket) gemeinsam denken** — nicht doppelt bauen; der private Bucket ist genau das Storage-Auslagern, nur verschlüsselt.
**Foto-KI bleibt unberührt:** `identify` bekommt das Foto **bei der Aufnahme im Klartext** (geht eh an Google/Pl@ntNet) — **bevor** verschlüsselt gespeichert wird; es speichert nichts → nur die **gespeicherte** Kopie ist E2E.
**⚠️ Konsequenz für „BILDER ANALYSIEREN" (Re-Identify aus der Cloud):** muss die Fotos **erst client-seitig entschlüsseln**, sonst bekommt `identify` nur Ciphertext → Re-Identify-Pfad in `tracker-media.js` anpassen. **Nur nach Docs „go" (Regel 2/4).**

## FEAT-31 — E2E Phase 4: Sharing verschlüsseln (Key im URL-Fragment) 📐 spezifiziert · Aufwand: klein-mittel
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` („Sharing view.html ?s=token" + RLS + Aufwand-Schritt 4). **Setzt FEAT-28/29 voraus.** Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Problem:** Der Empfänger hat den Sync-Code **nicht** → saubere Trennung nötig.
**Auftrag:** Beim Teilen Track unter einem **frischen Zufalls-Share-Key** verschlüsseln, als Share-Zeile ablegen. Link `view.html?s=<token>#k=<share-key-b64>` — das **`#`-Fragment geht NIE an den Server** (Browser sendet es nicht). Viewer holt die Zeile per Token (Ciphertext) und entschlüsselt mit dem Fragment-Key.
**RLS (defense-in-depth):** Share-Zeilen per Token les-, aber nur als Ciphertext + Fragment-Key entschlüsselbar.
**⚠️ Trade-off:** Wer den Link hat, kann lesen (gewollt) → der **Link ist das Geheimnis** (nicht über unsichere Kanäle teilen). Baut auf bestehendem Track-Sharing (`view.html`, Memory `project_tracker_share`). **Nur nach Docs „go" (Regel 2/4).**

## FEAT-32 — E2E Phase 5: Live-Broadcast verschlüsseln (Channel-Key im Fragment) 📐 spezifiziert · Aufwand: klein-mittel
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` („Live-Broadcast" + Aufwand-Schritt 5). **Setzt FEAT-28 voraus.** Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Kontext:** Live-Positionen/Fotos gehen über Supabase-Realtime-Broadcast (Channel = Live-Name).
**Auftrag:** Channel-Key = `PBKDF2(liveSecret, …)`; Payloads vor `channel.send` mit `encryptText/encryptBytes` verschlüsseln. Live-Link trägt das `liveSecret` im **Fragment**: `view.html?live=<name>#k=<secret>` — Viewer entschlüsselt damit (Fragment geht nie an den Server).
**⚠️ Trade-off:** Link = Geheimnis (s. FEAT-31).
**Abhängigkeit:** Erst **BUG-5** (Live-Broadcast geht gerade nicht) klären — E2E auf einem kaputten Broadcast bringt nichts. **Nur nach Docs „go" (Regel 2/4).**

## FEAT-33 — E2E Migration: Alt-Klartext → Ciphertext 📐 spezifiziert · Teil von FEAT-29
**Quelle:** retired `archive/e2e-verschluesselung-plan.md` (Abschnitt „Migration"). Querschnitt zu FEAT-28/29/30. Volltext → [`archive/e2e-verschluesselung-plan.md`](archive/e2e-verschluesselung-plan.md).
**Strategie (migrations-freundlich, à la VGP):** pro Zeile VGPs **`ENC:`-Prefix** als Marker; `decryptText` lässt **Alt-Klartext durch** → kein Big-Bang, Alt-Zeilen laufen weiter. Alt-Tracks werden beim **nächsten Speichern** automatisch zu Ciphertext; reiner Altbestand bleibt lesbar bis dahin. **Optional:** einmaliges **Re-Encrypt aller eigenen Tracks** (Client iteriert: lädt → verschlüsselt → schreibt zurück).
**Caveat (mission-critical):** Re-Encrypt-all mutiert Live-Daten → an 1 Track testen+verifizieren, reversibel/Backup (Supabase/R2-Regel). **Nur nach Docs „go" (Regel 2/4).**

## Querverweise
- Bug-Liste: [`bugfixes.md`](bugfixes.md) · Ideen-Triage: [`ideen.md`](ideen.md)
- Übersicht: [`../../NOTES.md`](../../NOTES.md) · Onboarding: [`agents.md`](agents.md)
