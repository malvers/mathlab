# Tracker — Feature-Warteschlange (für Subagenten)

> **Zweck:** Konkret **entschiedene/bald-zu-bauende** Features mit genug Spezifikation, dass ein Subagent
> sie als Arbeitsauftrag aufgreifen kann. Abgrenzung: rohes Brainstorm liegt in [`ideen.md`](ideen.md);
> hier steht nur, was **Plan/Prio hat oder schon teilweise gebaut ist**. Erstellt 2026-06-12.
> **Dupliziert nichts** — verlinkt die Plan-Notizen und destilliert den Auftrag.

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
  (`speechSynthesis` de-DE) + On-screen-Banner, Schalter „Sprachansage" (persistiert).
- **Tempo-Limit-Schild** (`HTML/js/tracker-speedlimit.js`): OSM `maxspeed`, rot bei Übertretung.
- **Tempo-Warnton:** kleine Glocke bei >10 % über Limit.
- **Idle-Auto-Hide**, **Kompass/Nordpfeil**, **Quellen-Status** (DWD/RainViewer) im Debug.
- **Cross-Device-Sync ohne Login** (`sync-sketch.md`, ✅ umgesetzt): deterministisches geteiltes Konto →
  Tracks/Fotos auf mehreren Geräten. Referenz, nicht neu bauen.

**🌿 Session 2026-06-11 (auf dem Branch, NICHT in main):**
- **Live-Config-Demo** (Idee 19): `docalvers.de/config.json` → `HTML/js/tracker-config.js` pollt (~20 s,
  ETag) → CSS-Variablen, **reload-frei**. Fernsteuerbar: Stat-Farbe unter der Uhr, Navi-Banner Farbe/
  z-Order/Süd-Offset. → produktionsreif machen = **FEAT-10**.
- **solita.html (ex-labai) Voice-Modus:** 🎤 Diktat (de-DE, freihändig senden) + 🔊 Antworten vorlesen (TTS).
  Am 2026-06-12 zu **Solita** ausgebaut: Wake-Word „Solita", Claude-`claude`-Edge-Function (Code da, Deploy
  offen), Persona + Kontext-Zusammenfassung. Siehe `plan-contact-ai-im-tracker.md` / FEAT-11.
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
**Voll-Spezifikation (Pflichtlektüre, fertig ausgearbeitet):** [`plan-brotkrumen.md`](plan-brotkrumen.md)
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
**Quelle:** [`tracker-ideen.md`](tracker-ideen.md) Idee 13 (Doc: „bestimmt nicht so schwer").
**Auftrag:** Zeigt Sonnenstand + Uhrzeit der goldenen Stunde / des Sonnenuntergangs am aktuellen Standort
(bestes Foto-Licht auf der Wanderung).
**Wiederverwenden:** die **Sonnen-Mathe aus der World Clock** (`HTML/worldclock/`) — erst dort greppen,
nicht neu herleiten (Memory `feedback_check_existing_first`). Position aus `currentLatLng()`.
**Offen für Doc:** Darstellung — eigene HUD-Kachel vs. Eintrag im Radial-Menü vs. Overlay-Panel. **Eine
Rückfrage** stellen, bevor gebaut wird.

---

## FEAT-3 — Parkplatz automatisch merken 📐 spezifiziert · Prio 1 (Vorschlag)
**Quelle:** [`tracker-ideen.md`](tracker-ideen.md) Idee 11 (klein, delightful; verwandt mit FEAT-4).
**Auftrag:** Wechselt die **Activity-Erkennung** von „fahren" → „zu Fuß", setzt der Tracker automatisch
einen Park-Pin. Auto später entspannt wiederfinden.
**Wiederverwenden:** `effectiveActivity()` (Activity-Recognition ist schon da) + Pin-Layer.
**Verbindet mit FEAT-4:** der Park-Pin ist ein natürliches Ziel für „Zurück zum Auto".

---

## FEAT-4 — Zurück zum Start / zum Auto 📐 spezifiziert · Prio 1 (Vorschlag)
**Quelle:** [`tracker-ideen.md`](tracker-ideen.md) Idee 1.
**Auftrag:** Ein Tipp routet **online** (OSRM, baut auf `tracker-nav.js`) zurück zum Startpunkt der
Aufzeichnung oder zum gemerkten Park-Pin (FEAT-3).
**Abgrenzung zu FEAT-1:** FEAT-1 folgt offline der eigenen Spur (Wandern/Funkloch); FEAT-4 routet online auf
Straßen (Auto/Stadt). Gleiche Präsentation (Banner/Pfeil/Voice).

---

## FEAT-5 — Regen-Vorwarnung unterwegs 📐 spezifiziert · Prio 1 (Vorschlag)
**Quelle:** [`tracker-ideen.md`](tracker-ideen.md) Idee 10.
**Auftrag:** Das vorhandene **Regenradar vorausschauend** nutzen: „In ~12 Min Regen an deinem Standort/auf
deiner Route." Besonders für Motorradfahrer.
**Abhängigkeit:** ⚠️ Hängt an **BUG-2** (Regenradar zeigt in DE oft nichts) — eine Vorwarnung auf leeren
Daten ist sinnlos. **BUG-2 zuerst.**
**Wiederverwenden:** `rain-radar.js` (Frames/Nowcast) + Route aus `tracker-nav.js`.

---

## FEAT-6 — Navigation Post-MVP 🏗️ teils gebaut
**Quelle:** [`plan-navigation-einfach.md`](plan-navigation-einfach.md) (MVP + Re-Routing + Voice schon gebaut).
**Noch offen (je ein eigener kleiner Auftrag):**
- **Vollständige Abbiege-Liste** (statt nur nächstes Manöver).
- **„passiert"-Erkennung:** Manöver weiterzählen, wenn man bei schneller Fahrt zwischen zwei Fixes daran
  vorbeikommt.
- **Verkehr/Baustellen:** gratis machbar über **Autobahn-GmbH-API** (DE, kein Key) / DATEX II / Mobilithek;
  farbiger Echtzeit-Stau realistisch nur via TomTom/HERE-Freemium (Recherche in
  [`../../fahrt-bad-homburg-2026-06-10.md`](../../fahrt-bad-homburg-2026-06-10.md)).

---

## FEAT-7 — Medien (Foto/Voice/Video) nach Cloudflare R2 🅿️ gebaut-aber-geparkt
**Quelle:** [`plan-r2-media.md`](plan-r2-media.md). Memory `project_tracker_media_r2_migration_parked`.
**Stand:** Neuer R2-Upload-Code liegt schon im Baum. **Blocker:** 228 Alt-Fotos + 5 Voice (~42,7 MB) sind
NICHT migriert — `sb_secret_` ist kein JWT für die gated `media-sign`-Funktion.
**Auftrag (sobald Doc grünes Licht/Key-Lage klärt):** Migrationspfad für Alt-Medien lösen; **kein Secret ins
Repo** (Regel 18). Bis dahin: nur dokumentieren, nicht „aufräumen".

---

## FEAT-8 — Fotos aus der DB in Storage-Bucket auslagern 🅿️ geparkt (Alternative/Vorstufe zu FEAT-7)
**Quelle:** [`plan-fotos-in-storage.md`](plan-fotos-in-storage.md). Memory `project_tracker_photos_storage_plan`.
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
**Voll-Spez (Pflichtlektüre, 🌿 Branch):** `plan-fernsteuerung-remote-config.md` — inkl. komplettem,
an echten DOM-Elementen geerdetem **Konfig-Schema** (`config.json` v7: theme/head/fabs/navBanner/speedSign/
compass/route/controls/params).
**Stand:** Demo läuft (s. o., `tracker-config.js` pollt `config.json` → CSS-Variablen, reload-frei).
**Auftrag (ausbauen):** Schema breiter umsetzen (mehr Knoten auf CSS-Variablen + minimal JS für
Sichtbarkeit/z-Index/Position), **Config validieren & clampen** (kaputter Wert darf UI nicht zerlegen,
Defaults als Fallback), **Versionsfeld**, optional **Supabase Realtime** statt Polling (instant-Push;
ETag-Poll als Fallback). **Regel 18:** Config ist public → **keine Secrets**, nur Präsentation/Parameter.
**Verallgemeinerbar** aufs ganze forloop-Projekt (zentrale Theme-Config).

## FEAT-11 — „Contact AI" im Tracker (Solita), Stufe 1: Chat/Foto 📐 spezifiziert 🌿 · **Future Now (Idee 20)**
**Voll-Spez (Pflichtlektüre, 🌿 Branch):** `plan-contact-ai-im-tracker.md`. Name/Weckwort: `agent-name-solita.md`.
**Grundprinzip:** Die App ist **nur Fernbedienung** — KI läuft **server-seitig**. Kein SDK/Key/git im
Browser oder in Capacitor.
**Auftrag Stufe 1:** App → **Supabase Edge Function** → **Claude API** (Key server-seitig, Regel 18) →
Antwort. Kann Q&A, **Foto beschreiben/erkennen (multimodal)**, Sprache→Antwort. **Streaming** fürs
Live-Gefühl. Modelle: `claude-opus-4-8` (1M Kontext), `claude-sonnet-4-6`, `claude-haiku-4-5`,
`claude-fable-5` (neuestes). ⚠️ Dieser Claude kennt das Repo **nicht** und ändert **keinen** Code.
**Caveat:** Opus = 1M Kontext (Modell), aber das Nutzungs-Kontingent ist plan-gedeckelt → vor Bau prüfen.

## FEAT-12 — „Contact AI" Stufe 2: Wunsch einsprechen → Agent ändert Repo + pusht 📐 spezifiziert 🌿 · **Future Now**
**Voll-Spez:** `plan-contact-ai-im-tracker.md` (Stufe 2). Schließt den Kreis mit FEAT-10:
Sprach-Wunsch → Edge Function (hält Token) → Agent editiert `config.json` + push → Live-Config zieht's →
Änderung erscheint live. **Zwei Heimstätten** für den Agenten: (1) **Claude Code Routines**
(Anthropic-gehostet, kein eigener Server; App POSTet, Token in Edge Function) oder (2) **Claude Agent SDK
auf eigenem VPS** (volle Kontrolle). **Edge Functions können den vollen Agent-Loop NICHT hosten**
(Zeitlimit, kein FS/git) — nur Stufe 1 + Routine *feuern*. **Sicherheit:** Token server-seitig,
Agent-Scope/Rechte eng. Status (Routines) = experimentell/Beta → vor Bau verifizieren.
**Voraussetzung:** Solita-Weckwort (`krass-app/wakeword-solita-erkennung.md`): erst Vosk-Wortliste
`["krass","solita","[unk]"]`, bei Bedarf openWakeWord/Picovoice auf Docs Stimme.

## FEAT-13 — Navi-Route: Google-Blau + gefahrene Strecke speed-gefärbt 🏗️ teils gebaut 🌿 · **Prio 1 (Idee 17)**
**Quelle:** `tracker-ideen.md` Idee 17. Code: `COL_ROUTE`/`drawRoute()` in `HTML/js/tracker-nav.js`.
- **(a)** Linie exakt **#4285F4** + helleres/dünneres Casing (der gefühlte Unterschied kommt vom dunklen
  Navy-Casing, nicht vom Blau). Doc schickt Screenshot zum Feinabgleich.
- **(b) WICHTIG:** **blaue Linie nur VORAUS** (ab aktueller Position); der **gefahrene** Teil zeigt die
  **Geschwindigkeit** (leaflet-hotline wie der normale Track), nicht blau. Route an aktueller Position
  trimmen / Speed-Track oben drüber.
- **(c) ✅ erledigt 2026-06-11:** Punkt/Dreieck liegen über der Linie (Ebene `nav-route`, z 350).

## FEAT-14 — Tracking & Navigation entkoppeln 📐 spezifiziert 🌿
**Voll-Spez (Pflichtlektüre, 🌿 Branch):** `plan-tracking-vs-navigation.md`.
**Szenario:** „Track nach Dresden, navigiere hin — Plan ändert sich → **Navigation beenden**, **Track
weiterlaufen** lassen (weiter nach Frankfurt)." Heute reißt STOP die Navi immer mit; „Navigation beenden"
ist als „Ziel löschen" versteckt; Navi wird nur aus `onPosition()` (= nur bei Aufzeichnung) gefüttert.
**Empfehlung:** **C jetzt** (Quick-Win: „Ziel löschen" → **„Navigation beenden"** umbenennen, STOP
entkoppeln, Hinweis „Navi aktiv") → **Ausbau zu A** (persistenter Navi-Chip `→ Dresden · 1:42 ✕`,
**Re-Target** mitten im Track, Navi **ohne** laufende Aufzeichnung). Code: `beginTracking`/
`finishTracking`/`__nav.*` in `tracker.js`.

## FEAT-15 — „KI erkennt"-Indikator verschönern (🤖 raus) 📐 spezifiziert 🌿 · klein
**Voll-Spez (🌿 Branch):** `polish-ki-erkennt-indikator.md`. Doc mag den 🤖-Roboter nicht.
**Ort:** `HTML/js/tracker-media.js:295` (`🤖 KI erkennt …`), CSS `.pd-wait` (`tracker.css:132`); Pin-Text
`PENDING_TITLE='Wird erkannt …'` in `photo-layer.js`.
**Auftrag:** Emoji raus, `.pd-wait` als ruhiger λ-Orange-Spinner, Wording einheitlich **„KI analysiert …"**.
Drei Varianten (Spinner / ✨-Sparkle / „KI"-Badge) — **Doc wählt 1/2/3, dann bauen.** Keine Logik-Änderung.

## FEAT-16 — Live-Broadcast: Presence/Rückkanal 📐 Idee
Aus BUG-5: Zuschauer-Zähler („3 sehen dich") + Empfangs-Bestätigung („zuletzt empfangen vor 2 s").
Macht Sende-Diagnose trivial (0 verbunden = Name/Link; verbunden, kein Empfang = Sendeproblem).
Erst **BUG-5** klären, dann als Feature.

## FEAT-17 — Lane Guidance (Spuranweisungen) 📐 · Prio 2 (Idee 18)
**Quelle:** `tracker-ideen.md` Idee 18. OSRM liefert `step.intersections[].lanes` (`indications` +
`valid`). Kleines Spur-Diagramm unter dem Abbiege-Banner. Nur wo OSM `turn:lanes` getaggt ist
(Autobahn-Ausfahrten meist ja). SVG-Pfeil-Set existiert bereits (FEAT-13c).

---

## FEAT-18 — Kleinere offene Punkte (aus `tracker-plan.md`)
Klein, einzeln greifbar; Voll-Kontext im Backlog [`tracker-plan.md`](tracker-plan.md):
- **`#motion-dbg`-Readout entfernen** (unten links) — bewusst drin gelassen, **raus auf Zuruf** (Memory
  `feedback_keep_debug`: nicht eigenmächtig strippen).
- **Tracking-Notification farbig** (Akzentfarbe/Icon im Benachrichtigungs-Panel) — nativer Eingriff, offen.
- **Native Background-Test:** START → Screen sperren → laufen → prüfen, dass weiter aufgezeichnet wird.

## FEAT-19 — „SERVER DOWN / OFFLINE"-Banner ✅ GEBAUT 2026-06-12 (Commit 578c12a)
**Warum:** Der SW (`tracker/sw.js`) ist **network-first mit Offline-Fallback** — ist der Server weg
(Dev: vergessen zu starten · Feld: Funkloch), liefert er **still die letzte gecachte Kopie**. Man sah
dann eine **alte Seite statt eines Fehlers** (die „BUILD 09.06 trotz 12.06"-Verwirrung, bot Doc 2×).
**Umgesetzt (Probe statt postMessage — race-frei):**
- `tracker.html`: eine ehrliche **Frische-Probe** (`fetch('…?_fresh='+ts, {method:'HEAD', cache:'no-store'})`)
  bei `load` + alle 30 s. Schlägt sie fehl → rotes Fix-Banner `#offline-banner`
  „⚠ SERVER DOWN / OFFLINE — gecachte Version (BUILD …)". `file://` wird übersprungen (immer frisch).
- `sw.js`: `?_fresh=`-Requests **bypassen den SW** (gehen direkt ans Netz), sonst würde der Cache den toten
  Server maskieren und das Banner nie feuern.
- Orbitron, Υ-Rot, kein Schwarz (Hausregeln). Banner inline-gestylt (kein tracker.css-Eingriff).
**Hinweis:** greift erst, wenn der **neue SW aktiv** ist (Update-Banner akzeptieren / kalter Neustart) —
der alte SW maskiert `?_fresh=` noch. Danach dauerhaft. Nützt Dev (Server vergessen) **und** Feld (Funkloch).

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

## FEAT-22 — Pl@ntNet-Konfidenz-Schwelle 📐
**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 4). **Nur Notiz.**
**Regel-Idee:** Pl@ntNet-Treffer mit Konfidenz **< ~10 %** gar nicht anzeigen; **besonders nicht**, wenn
**Google/Gemini** ein gutes Ergebnis hat.
**Offen (erst messen, nie raten):** Pl@ntNet-Score und Google/Gemini-Qualität sind verschiedene Skalen —
wie vergleichbar machen? Schwellwert empirisch. Wo: Erkennungs-Pipeline (`supabase/functions/identify/`
+ Foto-Spur-Anzeige `tracker-media.js`).

## FEAT-23 — HUD: oberes Element + Genauigkeit als zentrierte Gruppe 📐
**Quelle:** Fahrt-Notiz 2026-06-12 (Notiz 5). **Nur Notiz.**
**Wunsch:** das **obere Element [Diktat unklar — vermutlich POSITION/GPS-Chip oder die Uhr, mit Doc klären]**
+ die **Genauigkeit (±m)** in **eine Gruppe** fassen und die **ganze Gruppe zentrieren**.
**Wo:** `#hud-top` / `#gps-chip` (zeigt schon `gps-src` + `gps-acc ±m`) in `tracker.html` + `tracker.css`.
Knüpft an die alte `tracker-plan.md`-Idee „POSITION oben zentriert, Genauigkeit dahinter" an.

---

## Nicht-Tracker / Verteilung & Wissen (Kontext, kein Bau-Auftrag)
- **Play-Store-Verteilung** (🌿 `verteilung-playstore-tester.md`): Samsung „Auto Blocker" blockt Sideload;
  Play Store braucht für neue persönliche Konten **12 Tester · 14 Tage**. Firmenkonto (D-U-N-S) umgeht die
  Auflage. **Thema „nächste Woche"** — Entscheidung, kein Code.
- **Wissens-Notiz Lebens-Agent** (🌿 `wissensnotiz-llm-kompression-lebensagent.md`): Tokens/Kompression +
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

## Querverweise
- Bug-Liste: [`bugfixes.md`](bugfixes.md) · Ideen-Triage: [`ideen.md`](ideen.md)
- Übersicht: [`../../NOTES.md`](../../NOTES.md) · Onboarding: [`agents.md`](agents.md)
