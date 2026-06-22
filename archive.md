# Archiv — erledigte Ideen, Pläne & Notizen

> Aufgeräumt am 2026-06-22 durch einen Audit-Lauf (jeder Punkt gegen Code/git verifiziert).
> Inhalt verlustfrei erhalten. Diese Datei blendet der IDEEN-Browser aus (Pfad enthält "archive").


## Teil 1 — Aus aktiven Listen entfernte erledigte Punkte

_Die Quelldatei bleibt bestehen; nur diese verifiziert-erledigten Blöcke wurden herausgenommen._


### HTML/tracker/bugfixes.md  · gekürzt 2026-06-22

- ✅ **BUG-10 · gefixt 2026-06-20** — Navigation: Route-Fit jetzt dynamisch (Reststrecken-Fit beim Fahren)
- ✅ **BUG-9 · gefixt 2026-06-20** — Abbiege-Ansagen stumm aufm Pixel → jetzt über Cloud-TTS (`SolitaVoice`)
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

### HTML/tracker/feature-requests.md  · gekürzt 2026-06-22

- **FEAT-15** ✅ „KI erkennt"-Indikator verschönert — 🤖 raus, λ-Spinner (gebaut 2026-06-13)
- **FEAT-19** ✅ SERVER-DOWN-Banner (gebaut)
## FEAT-15 — „KI erkennt"-Indikator verschönern (🤖 raus) ✅ GEBAUT 2026-06-13 (Commit `1762b4f`)
**Voll-Spez (🌿 Branch):** `polish-ki-erkennt-indikator.md`. Doc mag den 🤖-Roboter nicht.
**Ort:** `HTML/js/tracker-media.js:295` (`🤖 KI erkennt …`), CSS `.pd-wait` (`tracker.css:132`); Pin-Text
`PENDING_TITLE='Wird erkannt …'` in `photo-layer.js`.
**Auftrag:** Emoji raus, `.pd-wait` als ruhiger λ-Orange-Spinner, Wording einheitlich **„KI analysiert …"**.
Drei Varianten (Spinner / ✨-Sparkle / „KI"-Badge) — **Doc wählt 1/2/3, dann bauen.** Keine Logik-Änderung.
**✅ Umgesetzt (Variante 1, Commit `1762b4f`):** 🤖 raus; `.pd-wait` bekommt einen ruhigen λ-Orange-CSS-Spinner
(`.pd-spin` + `@keyframes pd-spin` + `prefers-reduced-motion`-Abschaltung), Wording „KI analysiert …". Der
Spinner ist ein **eigenes Kind-Element** → die Fehlermeldung (gleiche `.pd-wait`-Klasse) dreht NICHT mit.
**Bewusst NICHT angefasst:** der Pin-Sentinel `PENDING_TITLE` (treibt 7 `=== PENDING_TITLE`-Vergleiche in 2
Dateien — Umbenennen bräche die Pending-Erkennung). Rein clientseitig, **kein Deploy**. Varianten 2 (✨) /
3 („KI"-Badge) bleiben je ein Einzeiler.

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

### HTML/tracker/ideen.md  · gekürzt 2026-06-22

| **„KI erkennt"-Indikator** | 🤖-Roboter durch schönen λ-Spinner ersetzen | ✅ gebaut 2026-06-13 → FEAT-15 |
| **Erkennung: Pl@ntNet-Schwelle** | < ~10 % Konfidenz ausblenden, v. a. wenn Google/Gemini gut ist | ✅ gebaut+deployed 2026-06-13 → FEAT-22 |

---

### HTML/tracker/pflanzen-datenbanken-enrichment.md  · gekürzt 2026-06-22

## POWO — Plants of the World Online (Kew)
- **Was:** autoritative Taxonomie + Nomenklatur + **Verbreitungsdaten** zu Pflanzenarten.
- **API:** HTTP-API, offiziell zugänglich über Kews **`pykew`** (Python) bzw. **`kewr`** (R).
  Liefert akzeptierten Namen, Synonyme, Distribution. **Halb-offiziell** — keine garantierte
  Stabilität/SLA, Rate-Limits undokumentiert. Unser `identify`-Function ist Deno/TS → wir würden
  den HTTP-Endpoint direkt per `fetch` anfragen (pykew nur als Referenz für die Endpunkt-Struktur).
- **Nutzen im Tracker:** Pl@ntNet/Gemini liefert den Namen → POWO bestätigt den **akzeptierten
  Artnamen** (räumt Synonym-Wirrwarr auf) und liefert das **natürliche Verbreitungsgebiet**.

---

### HTML/tracker/plan-contact-ai-im-tracker.md  · gekürzt 2026-06-22

## ✅ Stufe 1 GEBAUT (2026-06-12) — „Solita" (Client fertig, Backend-Deploy = Doc)
Aus `labai.html` wurde **`HTML/solita.html`** (git-rename, Verlauf erhalten). Gebaut:
- **Claude-Edge-Function** `supabase/functions/claude/index.ts` — Passwort-Gate (`x-app-pass` gegen
  `LABAI_PASSWORD`), übersetzt die OpenAI-förmige Anfrage auf die **Anthropic Messages API** und gibt
  wieder `choices[0].message.content` zurück (Client bleibt fast gleich). **Kein Key im Repo** (nur
  `Deno.env.get('ANTHROPIC_API_KEY')`).
- **solita.html** zeigt jetzt auf `/functions/v1/claude`, Modell-Auswahl **OPUS 4.8 · SONNET 4.6 (default)
  · HAIKU 4.5**, Persona-System-Prompt, **Kontext-Zusammenfassung** (ältere Turns werden per Haiku in eine
  rollende Summary gefaltet statt vergessen), **Wake-Word „Solita"** (Dauer-Zuhören, pausiert beim
  Vorlesen; Web-Vordergrund — echtes Hintergrund-Wecken bleibt nativ/krass), **XSS-Fix** (WP-5: AI-Text
  wird vor dem Markdown-Rendern escaped). Vorlesen (TTS) war schon da.

---

### HTML/tracker/tracker-ideen.md  · gekürzt 2026-06-22

    - **(c) erledigt 2026-06-11:** Positionspunkt + weißes Richtungs-Dreieck liegen jetzt **über** der
      blauen Linie (eigene Map-Ebene `nav-route`, z 350 unter Punkt/Track/Markern).
    - **Abbiege-Pfeile selbst:** am 2026-06-11 von Unicode-Glyphen auf **saubere SVG-Pfeile** umgestellt
      (straight/left/right/slight/sharp/u-turn/Kreisverkehr/Ziel) in `tracker-nav.js`/`arrowSvg()`.
## Erledigt (gebaut, diese Session)
- **Tasten-Shortcuts am Handy:** Buttons d/k/w in Einstellungen → Debug lösen die sonst nur per Tastatur
  erreichbaren Shortcuts aus (d = Regenquelle DWD/RainViewer, k = Karte dunkel, w = Karte weiß).
  → ermöglicht u. a. den `d`-Regentest mobil. (Schönere UX-Idee: Long-Press-Buchstaben-Panel — offen.)
- **Tempo-abhängiger Zoom** beim Folgen: schnell → weiter raus (mehr Vorausblick), langsam → näher dran
  (Stufen 17→13, gedrosselt). Nur im Auto-Folgen-Modus.
- **labai.html Voice-Modus:** 🎤 diktieren (de-DE, sendet freihändig) + 🔊 Antworten vorlesen (TTS).
  Backend unverändert (Edge Function), Key server-seitig. (Claude-Anbindung = eigene Edge Function, offen.)
- **krass-app:** zählt jetzt auch „solita"/„solida" (Trigger-Liste statt nur „krass").
- **Tempo-Glocke** per Häkchen in Einstellungen → Debug an/aus (persistiert).
- **FIT-Button als 3-Stufen-Loop:** 1× = ganze Route fitten · 1× (beim Navigieren) = nur Reststrecke ·
  1× = FIT aus. (Mittig-Zentrieren war Blödsinn, raus.)
- **Steuer-Button-Schrift** weiß + dicker (PAUSE war unlesbar), als Live-Config-Knopf.
- **Live-Config-Demo (Idee 19, Modell 1):** `docalvers.de/config.json` → `tracker-config.js` pollt (~20 s,
  ETag) → CSS-Variablen, ohne Reload. Fernsteuerbar: Stat-Farbe unter der Uhr, Navi-Banner Farbe/z-Order/
  Süd-Offset. Workflow: Wert in `HTML/config.json` ändern → commit + push → App übernimmt es.
- Idle-Auto-Hide blendet auch Header + Start/Stop-Leiste aus.
- Einfache Navigation: Adresse → Route, START navigiert + trackt (Radial-Eintrag „ZIEL").
- Re-Routing bei Routenabweichung (automatische Neuberechnung).
- Abbiege-Navigation mit Sprachansage (de-DE) + saubere SVG-Abbiegepfeile.
- Reicheres Navi-Banner: ETA + Straße/Ref + Schild-Ziele, Google-Navi-Grün, liegt unter dem Header.
- Positionspunkt + weißes Dreieck liegen über der blauen Navi-Linie.
- Tempolimit-Schild (OSM maxspeed via Overpass): nächste Straße, häufiger/robuster, deutsche Zonen-Tags.
- Tempo-Schild: „c" statt ∞ bei unbegrenzt; springt beim Überschreiten nach vorne; Glocken-Warnton bei >10 %.
- Kompass (Nordpfeil) unter dem Header.
- Regenradar-Quellen-Status (DWD/RainViewer) unter Einstellungen → Debug; untere Debug-Leiste folgt dem Debug-Schalter.

---

### IDEAS.md  · gekürzt 2026-06-22

- Fourier epicycles (draw → reconstruct from circles)

---

### URGENT.md  · gekürzt 2026-06-22

## 2. OFFEN: Solita Prompt-Caching-Fix wartet aufs Deploy

- **Was:** `supabase/functions/claude/index.ts` cacht jetzt auch die
  **Gesprächs-Historie** (vorher nur System+Tools). Spart im Tool-Loop und über
  mehrere Turns deutlich Anthropic-Kosten.
- **Branch:** `claude/solita-cache-message-history`.
- **MUSS deployed werden** (siehe §1), sonst greift der Fix nicht.
- **Verifizieren:** In Solitas DEBUG-Fenster die Zeile
  `€ chat: ↑… ↓… · Cache XX% (…r/…w) …` ansehen. Ab dem 2. Turn / bei Tool-Hops
  sollte `Cache %` **> 0** sein (`…r` = cache reads). Bleibt es bei **0 %**, ist
  der gecachte Prefix noch zu klein **oder** die rollende Summary ändert sich zu
  oft → dann Persona (statisch) und Summary (volatil) in **zwei** System-Blöcke
  trennen, damit die Persona gecacht bleibt.

### Kosten-Kontext

---

### allowance.md  · gekürzt 2026-06-22

## Log: autonome Session 2026-06-08 (In-App-Update gebaut)
Alles **uncommitted**, nichts gepusht/installiert:
- Nativ: `AppUpdatePlugin` (getInfo + installApk) + `REQUEST_INSTALL_PACKAGES` + in MainActivity registriert; versionCode 1→2 / 1.0→1.1.
- Web: `js/app-update.js` (Banner „Neue Version verfügbar → Installieren") im Loader; `HTML/tracker/version.json`.
- APK gebaut (compile OK, versionCode 2 verifiziert) + nach `HTML/tracker/` kopiert.
- Offen für Doc: committen + pushen; auf den Geräten **einmal** die vc2-APK installieren (danach Self-Update).

---

### backlog.md  · gekürzt 2026-06-22

- ✅ **Points of Interest** — gebaut (`HTML/js/tracker-poi.js`).
- ✅ **Voice/Navigation** — gebaut (`HTML/js/tracker-nav.js`, Nominatim-Geocoding).
- ✅ **Tankstellen-/Tankpreis-Spur** — gebaut (`HTML/js/tracker-fuel.js`); `TANKERKOENIG_KEY`
  am Server gesetzt + `fuel-prices` deployt.

## Hände-frei / Audio
- ✅/⬜ **Agent-Antworten vorlesen (beim Fahren):** über **Solita** gelöst (Web-SR + TTS,
  `HTML/js/solita-tts.js`) — Solita liest vor und nimmt Diktat. Frühere geräteseitige
  Behelfe (iOS „Bildschirm sprechen" / Android Select-to-Speak) bleiben als Fallback.
  Verwandt: [`HTML/tracker/archive/drivecast-audio-poi-am-weg.md`](HTML/tracker/archive/drivecast-audio-poi-am-weg.md).

## Voicerecorder
- ⬜ **Voicerecorder als Capacitor-App verpacken** (Idee, Doc 2026-06-17). Wenn wir den
  Voicerecorder (`HTML/voicerecorder/`) als Capacitor-App „abmachen" / nativ verpacken — wie
  Tracker/Solita —, hätten wir voraussichtlich Zugriff auf **alles**: volle native Geräte-APIs
  (Mikrofon inkl. Hintergrund-Audio, Dateisystem/Speicher, Berechtigungen, ggf. Whisper/On-Device-
  STT), ohne die Grenzen der Browser-/PWA-Sandbox. Noch zu klären/ausarbeiten.

---

### docs/solita/solita-mail-senden-analyse.md  · gekürzt 2026-06-22

- **„Share" → „teilen":** Das „Share"-Label auf Deutsch umbenennen → „teilen".

---

### notes/notiz-2026-06-14.md  · gekürzt 2026-06-22

1. **Navigations-Track (hinter einem):** Beim Navigieren Richtung Ziel soll der blaue Track
   **hinter** der aktuellen Position komplett verschwinden. Nur der übrige (normale)
   Geschwindigkeitstrack soll dort noch sichtbar sein.
2. **Track-Breite:** Der blaue Track (Navigationstrack) ist breiter als unser eigener Track —
   nicht gut.
3. **ETA anzeigen:** Wenn man navigiert und einen Broadcast hat, soll die Estimated Time of
   Arrival (ETA) im View angezeigt werden. Position noch offen — vielleicht direkt am roten
   Punkt oder oben im Hood, dass dort die ETA steht.
4. **Route neu berechnen früher auslösen:** Die Neuberechnung kommt zu spät — bin bestimmt einen
   halben Kilometer von der Route abgewichen, bevor neu berechnet wurde. Das ist zu viel,
   Schwelle für Reroute deutlich kleiner.
5. **Fullscreen-Button (WICHTIG):** Der View hat keinen Fullscreen-Button — einbauen.
8. **Keine Navigationsansagen auf Pixel/Android:** Auf dem Pixel (wahrscheinlich Android
   allgemein) gibt es beim Navigieren keine Sprach-/Navigationsansagen, obwohl der Haken/Check
   dafür gesetzt ist.
9. **Zoom-Modus „Rest der Route" dynamisch:** Im Modus „fix den Rest der Route" beim Navigieren
   muss der Zoom dynamisch angepasst werden. Aktuell wird er nur einmal gesetzt — während man
   fährt wird die Restroute immer kürzer, aber der Zoom passt sich nicht an.
10. **Live View postet nur Fotos (WICHTIG):** Im Live View werden Fotos gepostet, aber **keine
    Sprachnotizen und keine Videos**. Müssen unbedingt mit in den Live View.
11. **Geschwindigkeitsanzeige immer:** Die Geschwindigkeitsanzeige soll beim Autofahren immer
    sichtbar sein, nicht nur beim Navigieren.
12. **Solita: Internet-/Tool-Zugriff (anderes Thema, NICHT Tracker):** Wie bringe ich Solita
    (`labai.html`) dazu, z. B. die Wettervorhersage zu sagen? Das reine Sprachmodell-API kann das
    nicht (kein Live-Internet). Frage: Was müssen wir tun, damit Solita in vernünftiger Weise auf
    Internet zugreifen und mir Infos zusammensuchen kann? — Lösungsweg: **Tool-Use / Function-
    Calling** im Modell aktivieren und ein paar Tools bereitstellen (z. B. Wetter-API wie
    open-meteo, eine Web-Suche/Fetch-Funktion). Modell ruft Tool auf → unser Code holt die Daten
    live → Ergebnis zurück ins Modell → Antwort. Zu klären: welche APIs, CORS/Proxy, und KEINE
    Keys im public Repo (Regel 18 → Server-/Proxy-seitig).

---


## Teil 2 — Vollständig erledigte / obsolete Dateien (Inhalt archiviert, Datei gelöscht)


### HTML/plan-morgen.md  · obsolet, archiviert 2026-06-22

# Glocken — Plan für morgen

## Was als Nächstes kommt (nach dem Extro)

Nach „THINK THE IMPOSSIBLE!" → Übungs-Modus mit einem AI-Tutor („Khwārizmī"), der adaptiv mit Kids kgVs üben und Brüche addieren/subtrahieren lehrt.

---

## Architektur

### 1. Persona-Prompt (System)
```
Du bist Al-Khwārizmī, ein weiser, geduldiger Mathematiker aus dem 9. Jh.
Du übst mit Kindern (Klasse 5–6) das Finden des kleinsten gemeinsamen
Vielfachen (kgV) und Brüche addieren / subtrahieren.

Regeln:
- Niemals die Lösung sofort verraten. Leite mit Fragen.
- Bei Fehler: ermutigend, einen Hinweis geben.
- Bei Erfolg: feiern und schwerer machen.
- Bei mehrfachem Fehler: leichter machen.
- Sprache: warm, ruhig, kindgerecht. Bagdad-Ton wie im Intro.

Output: JSON nach folgendem Schema.
```

### 2. API
- **Gemini 2.5 Flash** (gleicher Cloud-Account + Key wie der OCR-Pfad und Cloud TTS)
- Vorteil: praktisch null Kosten (<$0.001 / Turn), schnell (~ms-Latenz)
- Bereits vorhandener Vault → API-Key wiederverwenden

### 3. Strukturierte Response (JSON-Schema)
```json
{
  "feedback_text": "Sprich-Text (max 2 Sätze, mit *Betonung* und [break:1s])",
  "next_problem": { "a": 4, "b": 6 },
  "difficulty_change": "up" | "same" | "down",
  "mode": "find_lcm" | "add_fractions" | "subtract_fractions",
  "celebration": false
}
```

### 4. Lokale Validierung (KEINE Mathe vom Agenten!)
- kgV via GCD: `lcm(a,b) = a*b / gcd(a,b)` — deterministisch in JS
- Bruch-Operationen: dezimaler Vergleich, dann Anzeige
- Agent bekommt VOM JS: `{ user_answer, correct_answer, correct, attempts }`
- Agent reagiert nur — er rechnet nicht. Verhindert AI-Rechenfehler komplett.

### 5. UI / Wiederverwendung
- Selbe Glocken + Zeitleiste + Slot-Animation für Visualisierung jedes Problems
- Selbe Bubble + TTS für Khwārizmī-Stimme (Neural2-B oder Chirp3-HD)
- Eingabefeld unten: numerisch für kgV-Antwort, dann Numerator/Denominator-Paar für Brüche
- Großer „Prüfen"-Button + Pfeiltasten Enter

### 6. Schwierigkeitskurve

| Stufe | Beispielpaare | Insight |
|---|---|---|
| 1 | 2 & 4, 3 & 6, 4 & 8 | kgV = größere Zahl (Multiple) |
| 2 | 3 & 5, 4 & 7, 2 & 9 | Teilerfremd → kgV = Produkt |
| 3 | 4 & 6, 6 & 9, 8 & 12 | Echtes kgV-Rätsel |
| 4 | 1/3 + 1/4 | Bruch addieren mit gerade gefundenem kgV |
| 5 | 1/4 + 5/6 | Vermischt — eigene Zähler |
| 6 | 3 Zahlen kgV: 2,3,4 | kgV von drei |

### 7. Flow
```
Extro Ende
   ↓
"Willst du mit mir üben?"  [Ja] / [Nein]
   ↓ Ja
[Stufe 1, Problem 1] Khwārizmī: "Nehmen wir die 2 und die 4 …"
   ↓ Glocken-Visu (a=2, b=4) → Kind tippt kgV ein
   ↓ JS validiert
   ↓ → Gemini: { result: 'correct', attempts: 1 }
   ↓ Gemini Response: { feedback, next: 3 & 6, diff: 'same' }
   ↓ wiederholen
```

### 8. State / Persistenz
- `localStorage.glocken_progress`: aktuelle Stufe, Streak, Last-Session
- Bei Wiederkehr: „Letztes Mal warst du bei Stufe 3 — weiter da?"
- Kein Account / Login. Nur Browser-State. (Später: Profile, Alvers-Preis-Sammelpunkte.)

---

## Tomorrow-Tasks (in Reihenfolge)

1. **Gemini-Vault** — gleiche `saveApiKey` / `gKey` Methodik wie TTS, separater Schlüssel `gemini_api_key_enc`
2. **`askKhwarizmi(state, action)` async Funktion** — schickt POST an Gemini Endpoint, JSON-Schema im Request, parsed Response
3. **Übungs-Scene** — neue Szene nach Scene 16: Eingabefeld + Validierungs-Pipeline
4. **Glocken-Visu mit a/b parametrisierbar** — bereits in `state.small/big` vorhanden, nur Render-Aufruf
5. **Schwierigkeits-Tracker** — Stufe + Streak in localStorage
6. **Feedback-Loop** — TTS spricht Khwārizmī's Response

---

## Offen für morgen früh

- API-Key Vault für Gemini (oder eines wiederverwenden?) — kurz checken
- Genauer JSON-Schema-Aufbau (Gemini structured output)
- Wo das Eingabefeld sitzt (Numeric Keypad? Stepper? Slider?)
- Sound bei richtig/falsch (zusätzlich oder via Khwārizmī-Stimme?)

---

*„Nicht verzagen, Alvers fragen!" — bis morgen.*

---

### HTML/tracker/bug-live-broadcast-funktioniert-nicht.md  · obsolet, archiviert 2026-06-22

# Tracker — Bug: Live-Broadcast funktioniert (gerade) nicht

> Beobachtung von Doc (2026-06-11), **live unterwegs**: Live-Broadcasting scheint im Moment **nicht zu
> funktionieren** — Zuschauer (Screenshots) sehen nichts. **Die Links/Namen (z. B. „vsb") sind korrekt.**
> Dokumentiert, **noch nicht gefixt** (CLAUDE.md Regeln 2/4).

## Wie es funktioniert (kurz)
Sender (`tracker.js`) sendet über **Supabase Realtime Broadcast** auf Kanal `live:<name>`; Viewer
(`view.html`) abonniert denselben Kanal. Kein DB/Token. Sender-Kadenz ~4 s (`pos`), Trail alle ~15 s.

## Verdächtige Ursachen (nach Wahrscheinlichkeit)
1. **Kanalname-Mismatch durch Groß/Klein.** Sender bildet den Kanal **immer kleingeschrieben**:
   `canon = name.trim().toLowerCase()` → `'live:' + canon` (`tracker.js:979,986`). Der **erzeugte Link**
   ist auch lowercase (`tracker.js:1649`). **ABER** wenn ein Zuschauer den Namen **selbst eintippt**,
   wird er **nicht** kleingeschrieben: `location.search = '?live=' + encodeURIComponent(v)`
   (`view.html:466`), und `goLive('live:' + key)` (`view.html:359`) nimmt den Key roh. Tippt also jemand
   „VSB"/„Vsb", landet er auf `live:VSB` ≠ `live:vsb` → **sieht nichts.** → **Fix: view.html den
   `?live=`-Key ebenfalls `.toLowerCase()`.**
2. **Supabase Realtime aus/gedrosselt/Störung** oder Sender & Viewer auf **unterschiedlichem
   Supabase-Projekt/Key** (`SUPABASE_URL/KEY` in tracker.js vs. view.html vergleichen).
3. **Sender startet ohne Track** → `beginLive` bricht mit „Erst aufzeichnen, dann LIVE" ab
   (`tracker.js:982`); `broadcastLive` sendet nur bei `track.length` (`:935`). Wenn Live „an" scheint,
   aber keine Aufzeichnung läuft, kommt nichts an.
4. Sender-`ensureSb()`/`subscribe` schlägt still fehl (catch → Toast „Live fehlgeschlagen").

## Schnell eingrenzen
- Zuschauer den **kopierten Link** (lowercase) öffnen lassen, **nicht** den Namen tippen → wenn's dann
  geht, ist es **Ursache 1**.
- Sender: läuft eine **Aufzeichnung** (Track-Punkte vorhanden)? (Ursache 3)
- DebugWindow/Konsole auf „Live fehlgeschlagen" prüfen.

## Dauerhafter Fix + Diagnose (siehe Rückkanal-Wunsch)
Ein **Rückkanal/Presence** würde genau das sichtbar machen: **Zuschauer-Zähler** („3 sehen dich") +
**Empfangs-Bestätigung** („zuletzt empfangen vor 2 s"). Dann sieht der Sender sofort: 0 verbunden =
Name/Link-Problem, verbunden aber kein Empfang = Sende-Problem. (Eigene Idee — als Feature einplanen.)

## Dateien
- `HTML/js/tracker.js` (`beginLive`/`broadcastLive`/`stopLive`, ~971–1013)
- `HTML/tracker/view.html` (`goLive`, Key aus `?live=`, ~358–367, 466)

## Update 2026-06-11 — eingegrenzt
- **Ursache 1 (Groß/Klein) ausgeschlossen:** Zuschauer öffnen den **kopierten Link** (lowercase), trotzdem nichts.
- **Gleiches Projekt/Key bestätigt:** `tracker.js:1200-1201` und `view.html:220-221` nutzen **identisch**
  `https://fyfhxzyymmurlaenmzse.supabase.co` + denselben **publishable** Key. → „falsches Projekt" raus.
- ⇒ **Es ist Realtime-spezifisch.** Neue Top-Verdächtige:
  1. **Realtime-Authorization/Config geändert** (private-channel-Pflicht / „require authorization") → öffentliches
     Broadcast wird abgelehnt → still nichts. Channel hier ist public (`broadcast:{self:false}`, **kein** `private:true`).
  2. **Key-Format-Umstieg:** Key ist neues Format `sb_publishable_…`. Realtime-Websocket-Auth könnte damit anders
     sein als die DB (PostgREST) → DB/Laden geht, **Realtime nicht**.
  3. **Free-Projekt pausiert** (Inaktivität) oder Realtime-Quota/Connection-Limit.
- **Entscheidende Frage zum Splitten:** Funktioniert **LADEN (Tracks laden)** noch?
  - **Ja** → Projekt lebt, Problem ist **Realtime-only** (Verdacht 1/2).
  - **Nein** → ganzes Projekt down/pausiert (Verdacht 3) / Key.
- **Schnellster Pinpoint:** in `view.html` den **`subscribe`-Status sichtbar machen** (SUBSCRIBED vs.
  CHANNEL_ERROR/TIMED_OUT) + Zähler empfangener Nachrichten. Zeigt sofort, ob's am Abo (Auth) oder am Senden liegt.
  (Aus meiner Sandbox **nicht** testbar — Supabase-Host ist geblockt.)

---

### HTML/tracker/foto-falsch-korrektur-readme.md  · obsolet, archiviert 2026-06-22

# Foto „Falsch"-Korrektur + Session-Notizen (2026-06-17)

> Handoff für andere Agenten: Was in dieser Session gebaut/entschieden wurde,
> wo der Code liegt und was noch offen ist. Audience = Agenten, die am Tracker
> oder an diesen Dateien weiterarbeiten.

## Überblick

Vier Dinge in dieser Session:

1. **Prozent-Umbruch-Fix** in der Foto-Lightbox (PlantNet-Konfidenz „42 %").
2. **„Falsch"-Korrektur mit Sprach-Diktat** (Phase 1) — Hauptfeature.
3. **Idee** „Voicerecorder als Capacitor-App" → in `backlog.md` (auf `main`).
4. **Regel 20** in `CLAUDE.md` geändert (Auto-Commit+Push auf Branch).

Branch-Status siehe ganz unten.

---

## 1. Prozent-Umbruch-Fix

**Problem:** In der Lightbox-Faktentabelle brach „42 %" um — die Zahl in einer
Zeile, das „%" in der nächsten.

**Fix:** In `HTML/js/photo-layer.js` → `renderFacts()` wird beim Rendern der
Tabellenzelle das normale Leerzeichen zwischen Ziffer und `%` durch ein
**geschütztes Leerzeichen** (U+00A0) ersetzt:

```js
const val = esc(r[1]).replace(/(\d)\s+%/g, '$1 %');
```

Bewusst im **Display** (nicht in der Edge-Function / DB): Transport bleibt
plain text, und auch bereits gespeicherte Fotos profitieren.

---

## 2. „Falsch"-Korrektur mit Sprach-Diktat (Phase 1)

**Use-Case:** Die KI (Gemini/PlantNet) liegt bei einem Foto daneben. Doc will
die richtige Antwort dranhängen — am liebsten gesprochen, sofort transkribiert,
am Foto als DB-Eintrag.

### UX-Fluss
1. Lightbox offen, KI-Verdikt sichtbar.
2. **Long-Press (~500 ms)** auf Titel/Fakten → Button **„✗ Falsch"** erscheint
   (bricht bei >10 px Bewegung ab → kein Konflikt mit Swipe-Navigation).
3. „Falsch" → Editor mit **Mikro + Textfeld + Speichern/Abbrechen**.
   Diktat = **Web Speech API**, `de-DE`, One-Shot — exakt das Muster vom
   Navigations-Mikro „Ziel eingeben" (`HTML/js/tracker-nav.js`, `initNavMic`).
   Kein Speech-Support → Mikro versteckt, Tippen bleibt.
4. Speichern → Korrektur wird persistiert, als rote Zeile „✗ Korrektur: …"
   unter den Fakten gezeigt, und der Karten-Pin bekommt einen roten ✗-Marker.

### Scope-Entscheidungen (von Doc)
- **Nur Recorder** (`tracker.html`), nicht der Share-Viewer (`view.html`).
- **Nur transkribierter Text** (kein Original-Audio).
- Korrigiertes Foto **sichtbar markiert**: Pin **und** Lightbox-Zeile.

### Datenmodell
Neues Feld am Waypoint:

```js
wp.correction = { text: "<transkribiert/getippt>", t: "<ISO-Zeit>" }
```

Waypoints sind **keine** eigenen DB-Zeilen — sie liegen als JSON-Array in der
Spalte `tracks.waypoints`. `wpSer()` (`HTML/js/tracker.js`) klont das ganze
`wp`-Objekt, also persistiert `correction` automatisch. **Keine Migration.**

### Persistenz
- `wp._trackId` = Laufzeit-Feld, das die DB-Zeile merkt, in der dieser
  Waypoint steckt. Gesetzt in `saveOnePointTrack` (Einzelfoto bekommt eigene
  Track-Zeile). Fallback: `T.currentTrackId` (Foto im laufenden Track).
- `wpSer()` löscht `_trackId` (wie `_marker`/`_blob`) → wandert **nicht** in
  die DB.
- `saveCorrection(wp)` in `HTML/js/tracker-media.js`: liest die Zeile per
  `_trackId`, findet den Waypoint per Zeitstempel-Key `wp.t`, setzt
  `correction`, schreibt das Array zurück (`update({ waypoints }).eq('id', …)`).
  Read-modify-write → patcht **genau einen** Waypoint, ohne die anderen zu
  überschreiben (funktioniert für Einzelfoto- UND geladene/aktive Tracks).
- Verdrahtung: `PhotoLayer.setCorrectionHandler(saveCorrection)`. Die Lightbox
  schreibt **nie** selbst in die DB — sie ruft nur den injizierten Handler.
  Der Viewer setzt keinen Handler → dort erscheint kein „Falsch"-Button.

### Geänderte Dateien
| Datei | Was |
|---|---|
| `HTML/js/photo-layer.js` | Long-Press, ✗-Button, Mikro (Web-Speech), Korrektur-Render, Pin-Marker, `setCorrectionHandler` (neuer Export) |
| `HTML/js/photo-layer.css` | Styles: Pin-✗, Korrektur-Zeile, Button, Editor (responsive, Orbitron, Palette) |
| `HTML/js/tracker-media.js` | `saveCorrection`, Registrierung, `saveOnePointTrack` merkt `_trackId` |
| `HTML/js/tracker.js` | `wpSer` löscht `_trackId` |

### Wichtige Details / Fallstricke
- Long-Press nur, wenn ein `correctionHandler` gesetzt ist **und** `!wp.type`
  (also nur Foto-Waypoints; Voice/Video übersprungen).
- Keyboard-Guard: Im offenen Editor navigieren ←/→ **nicht** die Fotos, Esc
  bricht nur den Editor ab (statt die Lightbox zu schließen).
- `#lightbox-title`/`#lightbox-text` bekommen `user-select:none`, damit der
  native Long-Press (Textauswahl/Callout) die Geste nicht stört.
- **Persistenz braucht eine `UPDATE`-RLS-Policy auf `tracks`** (dieselbe, die
  „Fotos analysieren"/Nachbrennen nutzt). Fehlt sie, meldet der Toast „nicht
  gespeichert".
- Web Speech läuft v. a. in Chrome/Android; Firefox/Safari ggf. ohne → dann
  nur Tippen.

### Offen (Phase 2 / zu entscheiden)
- Soll „Falsch" das KI-Verdikt (Titel) **ersetzen** oder nur **zusätzlich**
  danebenstehen? Aktuell: zusätzlich (Original bleibt nachvollziehbar).
- Korrektur im Viewer (read-only Share) — bewusst ausgeklammert.
- Noch **nicht** im echten Browser verifiziert (Regel 10: Chrome nur mit
  Docs OK).

---

## 3. Idee: Voicerecorder als Capacitor-App

In `backlog.md` (auf `main`, Commit `c892a60`) festgehalten: Wenn der
Voicerecorder (`HTML/voicerecorder/`) als Capacitor-App nativ verpackt würde
(wie Tracker/Solita), gäbe es voraussichtlich Zugriff auf **alles** — volle
native Geräte-APIs (Mikro inkl. Hintergrund-Audio, Dateisystem, Berechtigungen,
ggf. On-Device-STT) statt Browser/PWA-Sandbox. Noch zu klären.

---

## 4. Regel 20 geändert (Auto-Commit+Push auf Branch)

Neue stehende Policy (Branch `claude/agent-autocommit-branch-rule`, Commit
`5404784`, noch **nicht** auf `main` gemergt):

> **Nach jeder Änderung committen UND auf den Arbeits-Branch pushen** — nie auf
> `main`, nie Force. Grund: flüchtige Container, nur Gepushtes überlebt das
> Recycling. Vorher immer Diff auf Secrets prüfen (Regel 18). `main` nur per
> PR/Merge durch Doc oder nach ausdrücklicher Einzel-Zustimmung.

Hintergrund: In der Remote-Umgebung ist uncommittete **und** committete-aber-
ungepushte Arbeit beim Container-Recycling verloren — nur GitHub (`origin`) ist
dauerhaft.

---

## Branches / Status (Stand 2026-06-17)

| Branch | Inhalt | Auf `main`? |
|---|---|---|
| `claude/plantnet-confidence-formatting-wlur7r` | Prozent-Fix (`661d426`) + Falsch-Button (`06bc8e2`) | nein — wartet auf Merge |
| `claude/agent-autocommit-branch-rule` | Regel-20-Änderung (`5404784`) | nein — wartet auf Merge |
| `main` | Capacitor-Idee in `backlog.md` (`c892a60`) | ja |

Zum Aktivieren der Features/Regel: die zwei Branches nach `main` mergen.

---

### HTML/tracker/plan-fotos-in-storage.md  · obsolet, archiviert 2026-06-22

# Tracker — Plan: Fotos aus der DB in Supabase Storage

> Recherche-/Plan-Notiz, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-09.
> Ziel: die base64-Fotos aus der `waypoints`-Spalte (DB) in einen **Storage-Bucket** verlagern.

## Warum (gemessen 2026-06-09)
- Free-Tier-DB-Cap = **500 MB**. Fotos liegen als **base64 in `waypoints.img`** (jsonb) → der einzige Größentreiber.
- Konto nv7e: **28 MB / 169 Fotos** (~5,6 % von 500 MB), ~**160 KB/Foto** (base64). → **500 MB ≈ ~3.000 Fotos**. ~10× Luft, aber endlich.
- Zweitproblem **Egress** (Free 5 GB/Mon): base64 wird bei **jedem LADEN, jedem Live-Viewer, jedem Autosync-Upsert** komplett mitübertragen.
- base64 bläht zusätzlich **+33 %** ggü. dem rohen JPEG auf.

## Zielbild
- **Bucket** (z. B. `track-photos`) hält die JPEGs **binär**. `waypoints[].img` enthält nur noch die **URL**.
- DB fällt auf **< 1 MB** (nur lat/lng/t/title/text + URL) → 500-MB-Cap praktisch irrelevant.
- Storage Free = **1 GB**, binär statt base64 (~25 % kleiner) → ~**6.000 Fotos**.
- Viewer lädt nur **geöffnete** Bilder per URL (lazy, CDN-cachebar) statt alle base64 → Egress sinkt drastisch.
- Live-Broadcast sendet nur noch die **URL** statt des ganzen base64-Bildes → winzige Realtime-Messages.

## Was sich NICHT ändert (gut!)
- **Renderer** `photo-layer.js` (`img.src = wp.img`, Z. ~80) und das Map-Popup (`<img src="'+wp.img+'">`, tracker.html ~1814): `img.src` lädt `https://`-URL **genauso** wie `data:`-base64 → **rückwärtskompatibel, kein Edit**. Alte Tracks (base64) und neue (URL) funktionieren parallel.
- **GPX-Export** (tracker.html ~1335-1340): bettet das Bild **gar nicht** ein (nur `<name>/<desc>`) → unberührt. (Optional später: `<link href="url"/>`.)

## Touch-Points (gemessen — Zeilen driften)
1. **Capture/Store** — `capturePhoto()` (~1924) + `downscaleSrcToJpeg` (~1722, liefert ~1024px JPEG-dataURL) + `addPhotoAt(img, ll)` (~1951): nach dem Downscale die **Binärdaten in den Bucket uploaden**, `wp.img = öffentliche URL` setzen. base64 **nur im Speicher** für den Identify-Call behalten.
2. **Identify** — `identifyPhoto(wp.img, …)` (~2048) braucht die **Bytes**. Lösung: den in-memory base64 übergeben (nicht die URL), Upload läuft parallel. (Alternative: Edge Fn die URL fetchen lassen — mehr Umbau.)
3. **Persist** — `saveTrack`/`doSync`/`bufferSnapshot` mappen `w.img` unverändert; der Wert ist jetzt nur eine URL → **kein Code-Edit nötig**, Rows schrumpfen automatisch.
4. **Live** — `broadcastPhoto`/`addLivePhoto` (tracker.html ~1171-1172) sendet `img` → künftig die **URL** statt base64. `view.html onLivePhoto` (~338-339) nutzt `p.img` direkt → **kein Edit** (URL lädt).
5. **Renderer / GPX** — kein Edit (siehe oben).

## Offline-Resilienz MUSS erhalten bleiben (Stage 1)
- Foto offline geschossen → Upload scheitert. Dann **base64 in `wp.img` belassen** (zeigt + speichert wie heute), und **später nachladen**: beim nächsten Online-Sync hochladen, `img` auf URL umstellen, Row updaten. Nie ein Foto verlieren.
- Der IndexedDB-Crash-Buffer (`track-buffer.js`) hält den base64 weiter, bis der Upload bestätigt ist.

## Bucket-Setup (nur Supabase-Dashboard, NICHT im Repo)
- **Public Bucket** mit **unrätselbaren Pfaden** (z. B. `<auth.uid>/<t>-<rand>.jpg`). Begründung: geteilte Tracks (`view.html?s=token`) + Live-Viewer laden die Bilder **ohne Auth** → public ist am einfachsten und passt zum bestehenden Token-Share-Modell. Fotos sind nicht geheim; Pfad = unkenntlich.
  - Alternative: **Signed URLs** (laufen ab, müssen neu signiert werden) → mehr Komplexität, nur falls echte Zugriffskontrolle gewünscht.
- Storage-Policies: `insert` nur für den Owner (auth.uid), `select` public read.

## Migration der 169 Bestandsfotos (Einmal-Skript)
- Auth als Code-Konto (`t-<sha256(code)[:32]>@docalvers.de` / `p-<code>`), pro Track: jedes `waypoints[].img` das mit `data:` beginnt → Binär hochladen, `img` durch die URL ersetzen, Row updaten. Bei Upload-Fehler base64 lassen (idempotent, später erneut laufen lassen).
- Läuft lokal (node/python) gegen die REST/Storage-API. Vorher 1 Track testen, dann alle.

## Reihenfolge
1. Bucket + Policies im Dashboard anlegen.
2. Upload-Helper im Client (`uploadPhoto(binary) → url`), Offline-Fallback auf base64.
3. `addPhotoAt`/`capturePhoto` umstellen (Upload → URL; base64 für Identify behalten).
4. `broadcastPhoto` auf URL umstellen.
5. Verifizieren: neuer Track (App), LADEN, Viewer (`?s=`), LIVE, Offline-Foto-Nachladen, GPX.
6. **Bestandsfotos migrieren** (Skript), DB-Schrumpfung gegenmessen.
7. (Optional) GPX `<link>` auf die Foto-URL.

## Risiken / Caveats
- Identify-Pfad nicht brechen (Bytes müssen weiter ankommen).
- CORS am Bucket für `view.html` (andere Origin? docalvers.de servt alles als Root → meist gleiche Origin; trotzdem prüfen).
- Egress entsteht weiter beim **Ansehen** — aber nur für geöffnete Fotos + CDN-Cache statt „alles bei jedem Laden".
- Kein akuter Notfall (10× Luft) — sauberer Umbau, wenn Zeit ist.

Gehört zu [[project_tracker_lab]] / [[project_tracker_fotospur]].

---

### HTML/tracker/plan-r2-media.md  · obsolet, archiviert 2026-06-22

# Tracker — Medien (Foto/Voice/Video) in Cloudflare R2

> Plan + erste additive Bausteine. Stand: 2026-06-09. Ziel: Binärmedien raus aus der DB-`waypoints`-
> Spalte (base64) in **Cloudflare R2** (10 GB frei, **Egress gratis**, S3-kompatibel, CDN+Range).
> Auslöser: **Video-Clips** — die *müssen* in einen Object-Store (zu groß/streaming für DB).

## Architektur — Client lädt DIREKT zu R2, Credentials bleiben server-seitig
```
[App] ──(1) {kind,mime} ──► [Edge Fn media-sign]  (signiert presigned PUT mit R2-Keys, SigV4)
      ◄──(2) {putUrl,getUrl,key}──┘
[App] ──(3) PUT blob ───────► [R2 bucket]          (direkt, KEIN Proxy → keine Size/Time-Limits)
      wp.url = getUrl
[Viewer/Live/Renderer] ──GET──► [R2 via media.docalvers.de + CDN]  (Range, Streaming, 0 € Egress)
```
**Warum presigned:** Edge-Functions haben Payload-/Zeitlimits → Video würde sprengen. Presign = nur
Signatur (winzig), der Blob geht direkt Client→R2.

## Cloudflare-Setup (Dashboard, NICHT im Repo)
1. R2-Bucket `tracker-media`.
2. **Custom Domain** `media.docalvers.de` aufs Bucket (saubere öffentliche GET-URLs + CDN).
3. **CORS** am Bucket: erlaube `PUT` + `GET` von `https://docalvers.de` (Header `content-type`, `*`).
4. **R2 API-Token** (Access Key + Secret). ⚠️ **Secrets — NUR als Supabase-Edge-Secrets**, nie ins
   Repo (Rule 18): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
   `R2_PUBLIC_BASE` (= `https://media.docalvers.de`).

## Code-Bausteine
- **`supabase/functions/media-sign/index.ts`** (GEBAUT): POST `{kind, mime, ownerId?}` → würfelt
  unrätselbaren Key `<owner>/<ts>-<uuid>.<ext>`, presigned PUT-URL (≈300 s) via `aws4fetch` (SigV4,
  service `s3`, region `auto`), liefert `{ putUrl, getUrl, key }`.
- **`HTML/js/upload-media.js`** (GEBAUT): `window.uploadMedia(blob, kind, ownerId) → {url, key, mime}`
  — holt presign, `PUT`tet den Blob, gibt die öffentliche URL. Wirft bei Fehler (→ Offline-Fallback).
- **Noch zu bauen (nach R2-Setup + Commit):** Wegpunkt-Modell `{type,lat,lng,t,url,mime,dur?}`;
  Wiring in `tracker-media.js` (`capturePhoto`/`addPhotoAt`/`addVoiceAt`/`broadcastPhoto`);
  **Video-Capture + `<video>`-Player in der Lightbox + Video-Pin**; Migrations-Skript.

## Sicherheit (Gate gegen fremde Uploads)
- **media-sign WITHOUT `--no-verify-jwt` deployen** → nur Anfragen mit gültigem Supabase-User-JWT
  kommen durch. Der Tracker ist über den Sync-Code als Code-Konto eingeloggt → hat `session.access_token`;
  `uploadMedia` schickt den als `Authorization: Bearer`. Kein Client-Secret nötig (das wäre public).
- Für den ALLERERSTEN Ketten-Test darf man kurz `--no-verify-jwt` nehmen, danach gated re-deployen.
- Key-Pfade unrätselbar; Bucket public-read (passt zum Token-Share-Modell, Bilder/Clips nicht geheim).
  Für E2E später: `encryptBytes` vor dem PUT → R2 sieht nur Ciphertext (Bucket bleibt public, egal).

## Rückwärtskompatibel (kein Renderer-Edit)
`img.src=wp.url` / `<video src=wp.url>` / `<audio>` laden eine `https://`-URL **genauso** wie `data:`-base64
→ alte Tracks (base64) + neue (URL) laufen parallel. GPX bettet kein Bild ein → unberührt.

## Offline-Resilienz (MUSS)
Upload scheitert (offline) → base64 in `wp.url`/`wp.img` belassen (+ IndexedDB-Buffer) → beim nächsten
Online-Sync hochladen, auf URL umstellen, Row updaten. **Nie ein Foto/Clip verlieren.**

## Reihenfolge
1. **Aktuellen Stapel committen** (Refactor liegt uncommitted).
2. Cloudflare: Bucket + Domain + CORS + Token + Supabase-Secrets (Doc).
3. `media-sign` deployen, Kette an **einem Foto** verifizieren (kleinster Fall).
4. **Video**: Capture + Player + Pin.
5. Voice + Bestandsfotos (169) migrieren (idempotentes Skript).
6. (Optional) E2E: `encryptBytes` vor dem PUT.

## Caveats
- Content-Type beim PUT: ob R2 den ungesignt übernimmt → beim Test prüfen (sonst signiert mitgeben).
- CORS am Bucket korrekt (sonst PUT/GET vom Browser blockiert).
- Egress entsteht weiter beim *Ansehen* — aber bei R2 **gratis** + CDN-gecacht.
- DB-Umzug ist NICHT nötig (die `tracks`-Tabelle bleibt; nur `waypoints[].url` statt base64).

Gehört zu [[project_tracker_lab]] / [[project_tracker_fotospur]] / [[project_tracker_photos_storage_plan]].

---

### HTML/tracker/tracker-plan.md  · obsolet, archiviert 2026-06-22

# Tracker — Backlog / offene Punkte (Stand 2026-06-04, nach Web-Test)

## ✅ Erledigt (2026-06-04)
- #1 (Web-Teil): POSITION oben **zentriert**, Genauigkeit **±X m dahinter** im Chip; GENAU-Box unten raus.
- #2: Wort „DAUER" weg, Uhr `0:00:00` bleibt.
- #3: Wort „TEMPO" weg, Geschwindigkeitswert bleibt (Label „KM/H").
- #6: Map-`doubleClickZoom` aus + Tap auf Uhr gekapselt → Doppel-Tap stört die Karte nicht mehr.
- Quellen-Label (geschätzt aus Accuracy): GPS/WLAN/FUNK im POSITION-Chip.
- Status-Zeile entfernt → stattdessen transienter Toast für Aktions-Feedback.
- #4 Supabase: Client + Anon-Auth + Tabelle `tracks` (RLS) → Speichern/Laden/Löschen.
- #5 Kontextmenü: radiales Popup (worldclock-Stil, Orange) per Long-Press/Rechtsklick →
  SPEICHERN · LADEN · VOLLBILD · INFO; + Lade-Liste-Panel + GNSS-Info-Panel.
- (www im Wrapper neu gesynct.)

## ✅ Erledigt (2026-06-04, autonome Session während Doc unterwegs)
- **Zoom/Folgen**: Karte folgt neuen Fixes nur bis der User selbst draggt (`following`-Flag);
  ZENTRIEREN aktiviert Folgen wieder. Roter Punkt wird bei `zoomstart` ausgeblendet, bei `zoomend`
  wieder eingeblendet → „ordentlich zoomen".
- **Menü final**: Halbkreis-Bogen um den Hamburger (worldclock-Stil), 5 gleich breite Buttons:
  SPEICHERN · LADEN · ZENTRIEREN · VOLLBILD · INFO. Export/Löschen raus (Löschen in der Liste).
- **Struktur**: alles nach `HTML/tracker/` (tracker.html, index.html=Landing, icon.svg, tracker-plan.md);
  `HTML/tracker.html` ist jetzt ein **Redirect** → `tracker/tracker.html`. Landing Page mit KISS + USPs.
- **Wrapper**: sync-web.sh zieht jetzt aus `HTML/tracker/tracker.html` und schreibt `../` → root um.
  (APK NICHT neu gebaut — Doc testet die installierte Version; Zoom-Fix kommt beim nächsten Build.)

## ✅ Erledigt (2026-06-05)
- **Track nach Speed eingefärbt** — Leaflet.hotline (CDN), Gradient grün→orange→rot (Marken),
  Farbskala auto-normiert pro Track (`redrawTrack()` setzt min/max). Live + bei geladenen Tracks.
  Fallback auf orange Polyline, falls Lib fehlt. Offen/optional: absolute Schwellen statt relativ;
  Umschalter Speed↔Höhe-Färbung.

## Offen
- **Debug-Readout `#motion-dbg` entfernen** (unten links, „STILL · e=… · step≥…") — bewusst noch
  drin gelassen (Doc, 2026-06-05), **raus auf Zuruf**.
- ✅ **Höhe + Velocity pro Punkt FERTIG (2026-06-05)** — Punkte jetzt `[lat,lng,t,alt,speed]`
  (alts/speeds parallel zu times). **Höhe = GPS+Barometer fusioniert** (eigenes natives Plugin
  `Baro`, ICP20100 im Pixel 8a verifiziert): Baro = präzises relatives Profil, GPS = langsame
  absolute Referenz (altOffset-EMA). Browser → nur GPS-Höhe. **HÖHE-Kachel** im HUD (3. Stat),
  GPX `<ele>` pro `<trkpt>`. Ermöglicht später Höhenprofil + Geschwindigkeitsverlauf.
- ✅ **Bewegungs-Gate FERTIG (2026-06-05, „arbeitet perfekt!")** — DeviceMotion (Beschleunigung):
  dynamische Accel-Energie (EMA, Schwerkraft per Low-Pass raus) → still/bewegt mit Hysterese
  (MOTION_STILL 0.14 / MOTION_MOVE 0.35 m/s²). Still → KM/H 0, keine Punkte, Punkt+Karte
  festgehalten. Adaptiver Mindestschritt = max(4 m, accuracy×0.7). Speed leicht geglättet.
  Enable in startTracking (iOS-Permission via START-Geste), disable in stopTracking. Kleiner
  Debug-Readout #motion-dbg (Arial, unten links) zum Schwellen-Justieren — **noch drin, kann raus**.
- **Tracking-Notification farbig** (Akzentfarbe/Icon im Benachrichtigungs-Panel) — Doc hatte gefragt;
  nativer Eingriff, offen.
- Native App: Background-Test (START → sperren → laufen) durch Doc; ggf. Notification-Farbe.

## UI-Umbau (HUD verschlanken)
1. **POSITION** oben **zentriert**, dahinter die **Genauigkeit** (±X m). Den separaten
   GENAU-Wert unten rechts **entfernen**.
   - Zusätzlich gewünscht: anzeigen, **welche Satelliten/Systeme aktuell zum Fix beitragen**.
   - ⚠️ Im **Web NICHT möglich** — die Geolocation-API liefert keine Satelliten-Daten
     (keine Anzahl, keine Konstellation). Nur in der **nativen App** via Android `GnssStatus`
     (braucht ein kleines Capacitor-Plugin). Web: höchstens „—".
2. **Dauer** komplett entfernen.
3. **TEMPO**: NUR das **Wort „TEMPO"** entfernen — der Geschwindigkeitswert **bleibt**
   (Label dann nur noch „KM/H"). Wert wird wichtig fürs Bewegungs-Gate.
   - **KM (Distanz) bleibt** (nicht zum Entfernen genannt).

## Daten / Backend
4. **Supabase** anbinden (wie VGP: Anonymous Auth) → Tracks **speichern & laden**.
   - Datenmodell: tracks (id, name, created_at, …) + Punkte (oder GPX-Blob).
   - Liste der Tracks + Laden auf die Karte. **Großes Feature, eigene Session.**

## Menü / Interaktion
5. **Kontextmenü** auf **Long-Tap / Rechtsklick** im Stil des **worldclock-Hamburger-Menüs**
   (als Vorlage prüfen): **Load Track**, **Fullscreen**, **Info**.
   - **Info-Text**: Was sind die GNSS-Systeme? GPS (USA, US Space Force), GLONASS (Russland),
     Galileo (EU), BeiDou (China), QZSS (Japan), NavIC (Indien) — wer dahinter steckt, wie's
     grob funktioniert.
6. **Double-Tap auf die Uhr** darf NICHT die Karte mit-triggern (Event-Propagation stoppen).
   - Quick-Fix.

## Bewegungs-Erkennung (aus Frage 1)
- GPS-Speed jittert im Stand → „fährt" obwohl still.
- Idee: **Beschleunigungssensor als Bewegungs-Gate** — DeviceMotion (Web) bzw. Activity
  Recognition (nativ). Wenn Sensor „still" → Speed = 0 und keine Punkte. Mindestschritt
  adaptiv = f(accuracy).

## Map-Matching (aus Frage 2)
- Aktuell: **rohe GPS-Punkte**, KEIN Snap-to-Road. 30 m Versatz trotz „4 m" = GPS-Multipath /
  optimistische Accuracy, **nicht** OSM-Fehler.
- Optional später: Map-Matching (OSRM / Valhalla / Mapbox) — aber für Fuß-/Radwege oft falsch;
  nur fürs Auto sinnvoll. Standard: roh lassen (ehrlich).

---

### HTML/worldclock/clockwise-flip.md  · obsolet, archiviert 2026-06-22

# Clockwise Flip — World Clock

## Status

The world clock currently runs **counter-clockwise (CCW)**: hour 12 is at the top, 13 goes left, 11 goes right. This matches the convention "North Pole view → longitudes increase CCW", but contradicts the standard wall-clock convention.

A toggle to make the numbers go **clockwise (CW)** would require flipping every angle source in a coordinated way.

## What needs to flip

Three coupled angle sources, all relative to `-π/2` (12 o'clock at top):

| What | File:Line | Current (CCW) | Flipped (CW) |
|---|---|---|---|
| Hour ring (1–24 labels) | [worldclock.html:1303](worldclock.html) | `(12 - i) * 2π/24 - π/2` | `(i - 12) * 2π/24 - π/2` |
| City markers (arrows) | [worldclock.html:1210](worldclock.html) | `(-city.lon) * π/180 - π/2` | `(city.lon) * π/180 - π/2` |
| City label / hover angle | [worldclock.html:856](worldclock.html), [:950](worldclock.html), [:1518](worldclock.html) | `-city.lon + mapRotation - 90` | `city.lon + mapRotation - 90` |

All three must flip together — if hour-ring flips but city markers don't, cities no longer stand over the correct hour.

## The map problem

The background world map [resources/worldmap_polar.png](../resources/worldmap_polar.png) is rendered for the CCW convention (continents drawn so Europe sits where it is now). For a clockwise clock, that map is wrong:

- **Option A** — replace the image with a horizontally mirrored version (clean, but a second asset).
- **Option B** — apply `ctx.scale(-1, 1)` around the map draw call. Works for the image, but any text drawn afterwards inside the same transform also flips — needs surgical save/restore.
- **Option C** — generate the polar map at runtime from the geo data and pick direction at draw time. Largest refactor, cleanest end state.

## Suggested approach

Single constant or URL flag (`?dir=cw`), gate the three angle formulas on it, and start with **Option B** (mirror the image inside a save/restore) so no new asset is needed. If text bleeds into the mirrored region, fall back to Option A.

```js
const CLOCKWISE = new URLSearchParams(location.search).get('dir') === 'cw';
const dirSign = CLOCKWISE ? 1 : -1;
// hour ring:
const angle = dirSign * (i - 12) * (Math.PI * 2 / 24) - Math.PI / 2;
// city marker:
const cityAngle = dirSign * city.lon * Math.PI / 180 - Math.PI / 2;
// city label/hover:
const cityAngle = dirSign * city.lon + mapRotation - 90;
```

## Risk

Low if all three formulas flip in lockstep — verify by checking that Dresden (lon 15) ends up under the "13" or "12" slot in CW mode, depending on DST.

---

### agenten-uebergabe-2026-06-18.md  · obsolet, archiviert 2026-06-22

# Agenten-Übergabe — 2026-06-18 (GPS-Tracker + Solita)

Kurzfassung für die nächsten Agenten. Doc hat Feierabend gemacht; hier steht der
volle Stand: offene Branches, was gemerged/deployed werden muss, und das große
wiederkehrende Thema **„native Android-Funktion vs. WebView/APK"**.

> Grundregeln (CLAUDE.md): nach **jeder** Änderung committen **und auf einen
> Branch pushen** — **nie** auf `main`, **nie** Force-Push (Regel 20). Vorher
> Diff auf Secrets prüfen (Regel 18). Jede Aufgabe startet auf einem **frischen**
> Branch von aktuellem `origin/main` (Regel 19). `main` ändert nur Doc per PR/Merge.
> Edge-Functions müssen **separat deployed** werden (siehe unten).

---

## 1. Offene Branches (warten auf Doc: Merge nach `main`)

Alle von `origin/main` gebrancht, getestet (Syntax/Logik), gepusht. **Noch keine PRs**
außer wo Doc ausdrücklich darum bat — Doc merged selbst.

| Branch | Inhalt | Hinweise |
|---|---|---|
| `claude/speed-sign-3digit` | Limit-Schild: 3-stellige Limits (100/120/130) bekommen kleinere, engere Schrift (`s3`-Klasse), damit sie in die Scheibe passen. | rein CSS/JS, risikolos. |
| `claude/speedlimit-implicit-de` | Limit-Schild erscheint jetzt auch auf Straßen **ohne** explizites `maxspeed`-Tag: liest implizite DE-Zonen (`maxspeed:type`/`zone:maxspeed`/`source:maxspeed` → `DE:urban`=50, `DE:rural`=100, `DE:30`=30). Dazu 3 Overpass-Spiegel mit Fallback + DebugWindow-Status („kein Tag" vs „Overpass nicht erreichbar"). | unabhängig vom 3-digit-Branch. |
| `claude/fuel-popup-navigate` | Tankstellen-Popup hat jetzt einen **„Bring mich hin"**-Knopf (gleiche orange CTA wie POI), routet via `tracker-nav.navigateTo`. | hängt am `navigateTo`, das bereits in `main` ist. |
| `claude/feen-add-place` | POI-Panel: Knopf **„+ Feenort hinzufügen"** unter „Feen". Dialog: Name + Adresse (Nominatim-Geocoding, key-frei) **oder** aktuelle Position. Eigene Feen liegen in `localStorage`, erscheinen auf der Feen-Ebene mit „Bring mich hin" + „Entfernen". | zentrales `ov-panel`. |
| `claude/idee-solita-kosten-pro-abfrage` | Nur Doku: `wichtige-idee.md` — pro Solita-Abfrage die Kosten anzeigen (siehe §4). | keine Code-Änderung. |
| `claude/tracker-solita-longpress` | **Aktiver Sammel-Branch** mit mehreren Tracker-Verbesserungen (siehe §2). | enthält Solita-Long-Press, Idle-Uhr, Kompass-Fix + Diagnose. |

> ⚠️ Hinweis: `claude/tracker-solita-longpress` ist entgegen Regel 19 ein
> Sammel-Branch geworden (mehrere kleine Tracker-Aufgaben hintereinander auf Docs
> Wunsch „jetzt hier im Branch"). Beim Mergen die 4 Commits einzeln betrachten.

---

## 2. Commits auf `claude/tracker-solita-longpress` (von alt nach neu)

1. **Solita per Long-Press** (`tracker-solita.js`): Der schwebende **„S"-Knopf**
   oben links (`#solita-fab`) wird **nicht mehr** angezeigt. Solita wacht jetzt
   per **langem Drücken auf die Karte** auf (550 ms, ruhig). Drift > 12 px = Karte
   schieben, zweiter Finger = Pinch → beides bricht ab; Pins/Popups/Lightbox/offene
   Panels werden ignoriert. Die Antwort-Sprechblase bleibt sichtbar; das `btn`-Objekt
   existiert nur noch detached für State-Buchhaltung. CSS `#solita-fab` ist jetzt
   ungenutzt (bewusst **nicht** entfernt — Regel 2).
2. **Idle-Uhr** (`tracker.js`): Oben in der Uhr läuft im **Leerlauf** (weder
   Aufzeichnung noch Navigation) die **echte Uhrzeit** (HH:MM:SS). Während der
   Aufzeichnung weiter die Track-Dauer, pausiert bleibt der eingefrorene Wert,
   bei Navigation unangetastet. Ein-Sekunden-Tick, `trkState==='idle' && !navActive()`.
3. **Kompass-Selbststart** (`tracker-compass.js`): Vorher startete der Kompass
   **nur beim START-Tippen** → im Leerlauf tot. Jetzt: Android/Desktop hören
   **sofort** zu (keine Permission nötig), iOS armiert die **erste Berührung** für
   die Permission. Plus nicht-absoluter Fallback (bis ein echtes Nord-Signal kommt).
4. **Kompass-Diagnose** (`tracker-compass.js`): Loggt das erste Orientierungs-
   Ereignis (`absolute/alpha/webkit`) und einen **Watchdog** „KEINE Sensordaten in
   4 s …", falls nichts ankommt. → siehe §3 (offener Verdacht).

---

## 3. GROSSES THEMA: native Android-Funktion vs. WebView/APK

Mehrere „geht nicht"-Punkte haben **dieselbe Wurzel**: Eine Browser-/JS-API
liefert im **Android-WebView (Capacitor-APK)** keine Daten, weil das passende
**native Plugin im APK fehlt**. Im Chrome am Handy geht es oft, in der App nicht.
Das ist **kein JS-Bug** und **nicht von hier (Branch) lösbar** — es braucht einen
**APK-Neubau auf Docs Seite** mit dem jeweiligen Plugin.

| Funktion | Symptom | Ursache (Verdacht) | Fix |
|---|---|---|---|
| **Kompass** | Nadel bewegt sich nie, zeigt fix nach unten. Widget ist ohnehin **immer sichtbar** (HTML) → sichtbare Nadel sagt nichts, nur Bewegung zählt. | Keine `deviceorientation`-Events im WebView. Diagnose-Watchdog (Commit 4) bestätigt das morgen. | Natives Sensor-Plugin (z. B. `@capacitor/motion`) in den APK, Events an JS durchreichen. |
| **Aktivitäts-Indikator** (🚶🏃🚴🚗🧍 links neben der Uhr) | Reagiert **nur auf Tempo**, nicht auf echte Bewegungsmuster (langsamer Radler = „Fußgänger", Stau = „stehen"). | `effectiveActivity()` nutzt nur dann echte Muster, wenn das `ActivityRecognition`-Capacitor-Plugin da ist **und** Events liefert **und** man **aufzeichnet** (`startActivity()` läuft erst bei START). Sonst reine Speed-Heuristik (`heuristicActivity`): <1,5 still, <7 gehen, <14 laufen, <32 Rad, sonst Auto. | `ActivityRecognition`-Plugin + `ACTIVITY_RECOGNITION`-Permission in den APK. DebugWindow zeigt: `🚶 ActRec: kein natives Plugin (web)` = fehlt. Optional code-seitig: Hysterese gegen Schwellen-Zappeln + Erkennung auch im Leerlauf. |
| **Sprach-Navigation (TTS)** | Abbiege-Ansagen auf dem Pixel stumm, im Browser ok. | `speechSynthesis` im WebView stumm. | Native TTS (`@capacitor-community/text-to-speech`) im APK. (Härtung in `tracker-nav.js` ist schon drin; DebugWindow `tts:`-Logs prüfen.) |
| **Solita STT** | „antippen/lange drücken und sprechen" nutzt Web-Speech-API. | Web `SpeechRecognition` im WebView nicht verfügbar. | Native STT nötig, falls in der App gewünscht. Im Chrome geht es. |

**Merksatz für Agenten:** Bei „Funktion X geht im Handy/App nicht, im Browser
schon" → fast immer WebView/APK-Limit. Erst per DebugWindow bestätigen (alle
Module loggen mit Präfix: `compass:`, `🚶 ActRec`, `tts:`, `fuel:`, `poi:`,
`solita:`), dann klar sagen: **APK-Plugin-Schritt (Doc), nicht Branch-Code.**

---

## 4. Solita-Kostenanzeige (Idee, siehe `wichtige-idee.md`)

Pro Abfrage in Solita die Kosten anzeigen. **Daten liegen schon vor**: die Edge-
Function `supabase/functions/claude/index.ts` gibt `usage` (input/output/
cache_read/cache_creation) ans Frontend zurück. Formel, aktuelle Preise
(Sonnet 4.6 = Default 3/15 $, Opus 4.8 5/25 $, Haiku 4.5 1/5 $ pro 1M) und
Anzeige-Vorschläge stehen ausführlich in `wichtige-idee.md` (Branch
`claude/idee-solita-kosten-pro-abfrage`). Client-seitig rechnen reicht.

---

## 5. Benzinpreise — Serverstatus

Doc meldete „keine Benzinpreise". Kette: App → Supabase-Edge-Function
`fuel-prices` → **Tankerkönig**. Von der Agenten-Umgebung aus ist der Supabase-
Host **nicht erreichbar** (Netzwerk-Egress-Policy blockt externe Hosts) — ein
„Server up/down" lässt sich **von hier nicht** messen. Fehler sind im Client
**still** (`tracker-fuel.js`, „stay quiet"); der genaue Grund steht nur im
DebugWindow als `fuel: ERR …`:
- `TANKERKOENIG_KEY fehlt` → Secret im Supabase-Dashboard setzen.
- `Tankerkönig HTTP 5xx` / `Tankerkönig: <msg>` → Tankerkönig down/rate-limited.
- still/leer → Supabase down, Function nicht deployed, oder kein Internet am Gerät.

Doc wollte **keine** Code-Änderung dafür (Fehler bleibt still). Prüfen kann nur
Doc im Supabase-Dashboard (Key gesetzt? `fuel-prices` deployed?).

---

## 6. Was nur Doc tun kann (nicht vom Branch aus)

- **Branches mergen** (§1) und ggf. PRs.
- **Edge-Functions deployen** (separat, nicht Teil des Web-Deploys):
  - `claude` (Prompt-Caching-Fix aus früherer Session) → `supabase functions deploy claude --no-verify-jwt`.
  - `fuel-prices` prüfen/deployen; `TANKERKOENIG_KEY`-Secret setzen.
- **APK neu bauen** mit nativen Plugins für Kompass / ActivityRecognition / TTS
  (siehe §3), wenn diese Funktionen in der App laufen sollen.
- **Geräte-Tests** (Pixel/Lenovo) — Agenten entwickeln nur auf Branches und
  können nicht auf Docs Geräten testen.

---

*Stand: 2026-06-18. Danke & gute Nacht, Doc. 🌙*

---

### code-metrics.md  · obsolet, archiviert 2026-06-22

# Code-Metriken — Hotspot-Refactor (tracker + solita)

**Datum:** 2026-06-19
**Scope:** Die drei komplexesten Funktionen in `HTML/js/` zerlegt — reines *Extract-Function*, **keine Logikänderung**.
**Methodik:** Komplexität gemessen mit echtem AST-Parser (`acorn`, ES2022+) pro Funktion: zyklomatische (McCabe) + kognitive (SonarSource-Modell) Komplexität, max. Verschachtelung, LOC. Anwendung via AST-Splice (exakte Node-Offsets), danach `node --check` + `eslint` (0 errors) + adversarischer Verify-Workflow (12 Reviewer × 4 Lenses + Schiedsrichter → **SHIP, 0 Divergenzen**).

> Kognitiv-Faustregel: > 25 = Refactor-Kandidat (🔴), > 15 = erhöht (🟠).

## Vorher → Nachher

| Funktion | Datei | kognitiv vorher | nachher (Orchestrator) | max. Nesting |
|---|---|---:|---:|---:|
| `onPosition`  | tracker.js     | **102** 🔴 | **4** | 5 → 1 |
| `sendMessage` | solita-core.js | **53** 🔴 | **4** | (dispatch) → 1 |
| `send`        | solita-brain.js| **50** 🔴 | **2** | 5 → 1 |

Alle drei sind aus der Hotspot-Liste verschwunden. Die Orchestratoren lesen sich jetzt als ~20-zeiliges Inhaltsverzeichnis ihrer Pipeline.

### `onPosition` (tracker.js) — GPS-Watch-Callback, 13 Phasen
| Helfer | kognitiv | zyklo | nest | LOC |
|---|---:|---:|---:|---:|
| updateGpsReal | 3 | 4 | 0 | 7 |
| computeMovementGate | 10 | 11 | 1 | 25 |
| renderInitialFix | 2 | 3 | 1 | 7 |
| rejectNoisyFix | 2 | 3 | 1 | 9 |
| rejectTeleportFix | 9 | 6 | 3 | 18 |
| computeAndDisplaySpeed | 15 | 12 | 3 | 38 |
| computeBearing | 7 | 7 | 2 | 10 |
| recordTrackPoint | 13 | 9 | 3 | 27 |
| updateAutoFollow | 8 | 7 | 2 | 13 |
| **updateFitMode** | **25** 🔴 | 13 | 5 | 19 |
| updateNavigationAndDebug | 4 | 5 | 1 | 7 |
| **onPosition (Orchestrator)** | **4** | 5 | 1 | 21 |

### `sendMessage` (solita-core.js) — Chat-Eingabe-Dispatch
| Helfer | kognitiv | zyklo | nest | LOC |
|---|---:|---:|---:|---:|
| normalizeVoiceCommand | 3 | 3 | 2 | 11 |
| handleBuiltInCommands | 15 | 12 | 2 | 74 |
| checkAuthAndReturnPwd | 1 | 2 | 1 | 8 |
| handleConfigOrUiMode | 17 🟠 | 15 | 2 | 38 |
| postConfigInstruction | 11 | 8 | 3 | 28 |
| executeChatSend | 0 | 1 | 0 | 7 |
| **sendMessage (Orchestrator)** | **4** | 5 | 1 | 21 |

### `send` (solita-brain.js) — Brain-Turn / Tool-Loop
| Helfer | kognitiv | zyklo | nest | LOC |
|---|---:|---:|---:|---:|
| checkDailyCapAtStart | 1 | 2 | 1 | 9 |
| callModel | 15 | 7 | 4 | 15 |
| executeToolRound | 7 | 6 | 2 | 14 |
| runToolUseLoop | 13 | 11 | 2 | 23 |
| finalizeAndSave | 0 | 1 | 0 | 10 |
| **send (Orchestrator)** | **2** | 3 | 1 | 17 |

## Beim Review abgefangene Bugs (in den Auto-Vorschlägen, vor dem Anwenden korrigiert)
1. `rejectTeleportFix` nutzte `accuracy` ohne Parameter → `ReferenceError`. Param ergänzt.
2. `lastFix` wurde fälschlich an `if (recorded)` gekoppelt — Original re-baselined bei **jedem** akzeptierten Fix. Wieder unbedingt.
3. solita-brain: `pwd` pro Iteration neu via `getPwd()` statt einmal gecaptured. Einmal + durchgereicht.
4. solita-core `/ui`: `await renderUiList()` war in detached `.then()` umgewandelt. `await`-Semantik erhalten.

## Noch offen / Kandidaten (nicht angefasst)
- `updateFitMode` (kognitiv 25, nest 5): die bidirektionale FIT-Mode-Hysterese. Ließe sich weiter splitten (`all`- vs `remaining`-Zweig), ist aber eine kohärente Einheit.
- Unberührte Hotspots: `Brain` (Konstruktor, 25), `execTool` (24), `getWeather` (24), `accountUsage` (16) — waren nicht Teil des Auftrags.
- Pre-existing: `fmtDur` doppelt deklariert in tracker.js (Z. 324 `fmtDur(ms)` + Z. 2584 `fmtDur(s)` — verschiedene Signaturen, kein triviales Dedup).

---

### docs/solita/solita-stufe2-aktivierung.md  · obsolet, archiviert 2026-06-22

# Solita Stufe 2 — „smart & actionable" (Tool-Use)

> Gebaut autonom 2026-06-14 auf Branch **`solita-actionable`** (isolierter Worktree, damit die parallele
> Tracker-Session auf `main` ungestört bleibt). **Nicht gemmerged, nicht gepusht** — liegt für dein Review.
> Aktivierung = deine Entscheidung (eine KI committet damit in den public Repo).

## Was Solita jetzt kann (wenn aktiviert)
Aus dem **normalen Gespräch** heraus handeln — keine Spezial-Syntax nötig:
- **„mach die Uhr grün"** / „Banner nach unten" → ändert die Live-Config (`HTML/config.json`) → greift live.
- **„schreib auf: …"** / „notier …" / „merk dir …" → hängt eine datierte Notiz an `solita-notizen.md` + committet.
- Alles andere → ganz normale Antwort (sie nutzt Werkzeuge nur, wenn du klar darum bittest).

Technisch: **Claude Tool-Use** (function-calling). Solita bekommt zwei Werkzeuge (`change_setting`, `write_note`);
Claude entscheidet, ob/wann es eins aufruft; der Client führt es aus und gibt das Ergebnis an Claude zurück.

## Was gebaut wurde (Dateien auf dem Branch)
1. **`supabase/functions/claude/index.ts`** — reicht ein `tools`-Schema durch und gibt zusätzlich die rohen
   Content-Blöcke + `stop_reason` zurück. **Rückwärtskompatibel**: `choices[0].message.content` (Text) bleibt,
   der alte Chat funktioniert unverändert.
2. **`HTML/js/solita-core.js`** — `SOLITA_TOOLS` + ein **begrenzter Tool-Loop** in `sendMessage` (max 6 Runden) +
   `execTool` (ruft `solita-config` / `solita-note`) + Persona kennt ihre Werkzeuge. `conversationHistory` bleibt
   **String-only** (Tool-Blöcke leben nur lokal im Loop → kein Reload-/Persist-Risiko).
3. **`supabase/functions/solita-note/index.ts`** — NEU. Hängt eine Notiz an `solita-notizen.md` + committet via
   GitHub Contents API. **Kein** Claude-Call. Pfad **fest** auf `solita-notizen.md` (Whitelist), Passwort-Gate,
   Secret-Scan (lehnt Secrets ab), nutzt dasselbe `GITHUB_TOKEN` wie `solita-config`.
4. **`solita-notizen.md`** — Ziel-Datei (Seed).

Bereits vorhanden (Stufe 2a, von früher): `supabase/functions/solita-config/index.ts` + `HTML/config.json` v6.

## Sicherheit
- **Kein Secret im Client** (Regel 18). Tokens nur server-seitig als Edge-Function-Secrets.
- **Blast-Radius eng**: die Functions dürfen je **genau eine** Datei schreiben (`HTML/config.json` bzw.
  `solita-notizen.md`). Sonst nichts.
- **Passwort-Gate** (`x-app-pass` / `LABAI_PASSWORD`) auf allen drei Functions.
- **Graceful**: ist die aktualisierte `claude`-Function noch nicht deployt, ignoriert die alte das `tools`-Feld →
  Chat läuft normal weiter (nur ohne Aktionen).

## Aktivierung (deine Schritte, wenn gewollt)
1. **GitHub-Token** (fine-grained PAT): nur Repo `malvers/mathlab`, Permission *Contents: Read and write*.
2. **Secret setzen** (Supabase → Edge Functions → Secrets): `GITHUB_TOKEN = <PAT>`
   (`ANTHROPIC_API_KEY` + `LABAI_PASSWORD` sind schon da).
3. **Deploy:**
   ```
   supabase functions deploy claude        --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
   supabase functions deploy solita-config --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
   supabase functions deploy solita-note   --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
   ```
4. **Branch reviewen + mergen:**
   ```
   git diff main solita-actionable        # alles ansehen
   git switch main && git merge solita-actionable
   ```

## Testen (nach Aktivierung, am Browser)
- „Solita, mach die Uhr grün" → 🔧-Zeile + „erledigt", Uhr wird grün (binnen ~20 s Config-Poll).
- „schreib auf: Idee XY" → 📝-Zeile, `solita-notizen.md` bekommt einen Eintrag.
- „wie geht's?" → normale Antwort, kein Werkzeug.

## Offen / nächste Stufe (mit dir)
- Mehr Werkzeuge (z.B. `read_notes`, `list_settings`, Tracker-Aktionen).
- `change_setting` validiert Grenzen aktuell nur via Prompt (das `_schema` ist Doku) — optional server-seitig hart prüfen.
- Stufe 2b: Solita editiert echten Code (auf `solita/*`-Branches, nie direkt main).

---

### docs/solita/solita-vosk-wakeword.md  · obsolet, archiviert 2026-06-22

# Solita — Natives Vosk-Weckwort (Stufe B): Stand & Erkenntnisse

**Datum:** 2026-06-16 · alles am Pixel empirisch gemessen (nicht geraten).

## Was kaputt war (und warum „Vosk geht nie")
1. **Fehlende `uuid`-Datei** im gebündelten Modell → `StorageService.unpack` warf
   `FileNotFoundException: model/uuid` → Service machte sofort `stopSelf`. **Das** war der
   Hauptgrund, dass Vosk nie lief — kein Mic-Streit, kein OS-Limit. Fix: `assets/model/uuid` angelegt.
2. **„Solita" ist out-of-vocabulary.** Eine Vosk-Wortlisten-Grammar kann nur *auswählen*, was schon
   im Lexikon steht — sie kann **kein neues Wort hinzufügen**. „solita"/„solida" werden verworfen
   („Ignoring word missing in vocabulary"), die Grammar kollabiert auf `[unk]` → alles wird `[unk]`.

## Was jetzt geht (bewiesen)
- Mit `uuid` entpackt das Modell (91 MB, ~3 s), Vosk **hört** und transkribiert echtes Deutsch sehr gut.
- **Grammar-Trick:** Grammar auf die In-Vokabular-Wörter, zu denen „Solita" wird (`solide`/`solider`)
  → Vosk feuert **bei jeder „Solita"-Äußerung WAKE**. Erkennung = zuverlässig.

## Der fundamentale Haken (adversarial verifiziert)
- „Solita" ≈ „solide" ist **unter der Auflösung** dieses kleinen deutschen Modells
  (vosk-model-small-de, ~28 % WER). Der Grammar-Trick feuert deshalb **auch auf das Alltagswort
  „solide"**. Phonetik-/Levenshtein-Filter helfen NICHT (`solide` hat Köln=852, Lev=1 zu „solita" →
  rutscht durch jeden Filter). Freie Erkennung + Filter wäre sogar *breiter* (mehr Fehlfeuer), nicht enger.

## Blocker (real, fixbar)
- **Selbsthören:** der native Vosk-Dienst (eigener Prozess) hört Solitas **eigene TTS-Stimme** und
  würde selbst auslösen. `ear.suspend()` (JS) mutet ihn NICHT. Fix: `SpeechService.setPause(boolean)`
  existiert im AAR 0.3.47 — muss als `@PluginMethod pause()` durch `SolitaVoicePlugin` verdrahtet
  werden (aktuell nur start/stop/isRunning).

## Echte Lösung (Empfehlung): sherpa-onnx KWS
- Dediziertes Keyword-Spotting statt Diktiermodell: **keyless + offline + Apache-2.0** (kein AccessKey
  wie Porcupine), **open-vocabulary** → „Solita" als Keyword **ohne Training**, Empfindlichkeit einstellbar.
- Modell nur **wenige MB** → schrumpft die **67-MB-APK** drastisch (löst nebenbei das Repo-Größen-Problem).
- Offizielles Android-KWS-Beispiel vorhanden. Fallback: openWakeWord (Training nötig). NICHT Porcupine.

## Technischer Stand / offene Punkte
- `com.alphacephei:vosk-android:0.3.47` (nicht `org.vosk` — das ist das Java-Package).
- APK = **67 MB** wegen gebündeltem Vosk-Modell (Modell ist **gitignored** → NICHT committen!).
  Tracker-APK zum Vergleich: 6,5 MB.
- **Stufe-A-Hirn ist LIVE auf main** (Web-Push 6df9144) — die installierte App lädt es via Plan A.
- **Lokal uncommitted (Test-Stand):** `MainActivity` hat einen **Test-Autostart** des Service
  (Instrumentierung, muss raus); `SolitaVoiceService` hat Diagnose-Logs + den Grammar-Trick;
  `assets/model/uuid` neu. Der echte Service-Start ist web-getrieben via `SolitaVoice.start()`.
- Noch offen für „fertig": (2) Web nutzt nativen Pfad, (3) Frage-Aufnahme nach Wake (Mic-Übergabe),
  (4) `setPause` während TTS, (5) Lockscreen-Dauerbetrieb, (6) APK deployen.
- Research-Workflow-Output: `wf_ba477f2a-7de` (Synthese + adversarialer Verdikt).

---

### notes/fahrt-bad-homburg-2026-06-10.md  · obsolet, archiviert 2026-06-22

# Fahrt Bad Homburg — Notizen & Recherche (2026-06-10)

> **Für Agents:** Gedanken/Recherche, die Doc unterwegs (im Auto) diktiert hat. Festgehalten, damit
> nichts verloren geht — **noch nicht gebaut/entschieden** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.

---

## 1. Apple-Patent: Touchscreen 3D/haptisch machen
Frage Doc: erteilt? wann? haben sie beschrieben, *wie*?

- **Ja, erteilt.** Kern-Patent **US 9,600,070 — „User interface having changeable topography"**,
  erteilt **21. März 2017**.
- **Wie (ja, offengelegt):** **elektromechanische Aktuatoren unter dem Display** drücken/ziehen eine
  **verformbare Oberfläche** → echte Grate, Beulen, fühlbare Tasten; Höhe/Textur/3D-Form dynamisch.
- **Ganze Patent-Familie**, nicht nur eins:
  - **Textur + Temperatur** simulieren über Vibrationsmuster (rau/glatt, „warmes Holz vs. kaltes Metall").
  - **Elektromagnete**, die das Deckglas je nach Eingabe anziehen/abstoßen.
  - **MacBook mit morphender Touch-Tastatur** (Tasten heben sich aus dem Glas) — eigenes, ~2022 erteilt.
- **Stand:** alles **Patente/Forschung**, **kein Serienprodukt**. Mechanismen gesichert & beschrieben,
  gebaut/verkauft wird so ein 3D-Screen bisher nicht.
- Quellen: AppleInsider (21.03.2017, 9,600,070) · Cult of Mac (Textur/Temperatur) · Digital Trends
  (morphende MacBook-Tastatur).

## 2. Navigation in den Tracker einbauen (à la Google Maps) — Aufwand
- **Halbe Miete da:** Leaflet-Karte, GPS-Position, OSM-Tiles, Folgen-Modus. Fehlt nur **Routing**.
- **MVP klein (~1–2 Tage):**
  - Routing-Engine **nicht selbst bauen** → Dienst: **OSRM** (gratis/self-host), GraphHopper, Mapbox, Valhalla.
  - Plugin **`leaflet-routing-machine`** → Route zeichnen + Abbiege-Liste fast geschenkt.
  - Ziel-Suche: **Nominatim** (Geocoding).
  - Sprach-Ansagen: **`speechSynthesis`** (passt zum Vorlese-Wunsch, siehe `wunsch-antworten-vorlesen.md`).
- **Teuer/groß (echtes Google-Maps-Niveau):** Live-Re-Routing, Verkehr/Stau, präzise ETA, Spurassistent,
  Offline-Karten, Rate-Limits/Kosten, **Hintergrund-Navi nur nativ** (Web friert bei Sperrbildschirm ein).
- **Fazit:** „Tipp Ziel → Route + Linie + Abbiegehinweise + Sprache" = **klein**; Vollniveau = **groß**.

## 3. Woher Verkehrsinformationen?
- **Echter Live-Fluss (farbiger Stau) = praktisch kommerziell:**
  - **Google**-Traffic proprietär (Crowd-Daten), nicht frei nutzbar.
  - Lizenzierbar: **TomTom**, **HERE** (beliefern Autohersteller), **Mapbox** — alle **Freemium**, dann Bezahl-API.
  - Grund: Fluss-Daten brauchen **Probe-/Flottendaten** → teuer, kaum gratis.
- **Frei/offen — aber nur Ereignisse, kein Fluss:**
  - **Autobahn GmbH (DE):** offene API mit Baustellen, Sperrungen, Verkehrsmeldungen, Webcams — gratis, kein Key.
  - **DATEX II** (EU-Standard): Unfälle/Baustellen vieler Straßenbehörden.
  - **Mobilithek (DE, früher MDM):** offizielle Mobilitäts-/Verkehrsdaten, teils kostenlos.
- **Fazit für uns:** Baustellen/Sperrungen/Meldungen → **gratis machbar**; farbiger Echtzeit-Stau →
  realistisch nur über **TomTom/HERE-Freemium**, Google eher nicht.

---

### Verwandte Notizen aus derselben Session
- `HTML/tracker/drivecast-audio-poi-am-weg.md` — Audio-Sehenswürdigkeiten am Weg (WegCast).
- `wunsch-antworten-vorlesen.md` — Agent-Antworten vorlesen (hände-frei beim Fahren).
- Übersicht aller Ideen/Notizen: `NOTES.md`.

---

### notes/global-check-forloop-2026-06-07.md  · obsolet, archiviert 2026-06-22

# forloop — Audit- & Refactor-Brief

> Ziel dieses Dokuments: ein **klarer, an Sub-Agenten verteilbarer** Auftrag für einen
> gründlichen Projekt-Audit + globalen Refactor-Plan. Noch NICHT ausführen — erst der Brief.

## Worum es geht
Das gesamte Projekt **forloop** (Doc Alvers Mathe-Labor + **Tracker** + **VGP**) auf ein solides
Fundament setzen, BEVOR es weiter wächst. Ich erwarte einen **ehrlichen, realistischen** Befund —
keine Beschönigung. Lieber jetzt Zeit investieren als später ein Wartungs-Problem haben.

## Umfang
- **Alle** Top-Level-Labs/Tools in `HTML/` (~65 `.html`) — die mathematischen Labore.
- **Alle** App-Ordner: `tracker/`, `vgp/`, `glocken/`, `morpheus/`, `planetarium/`, `worldclock/`, … —
  Tracker + VGP sind keine Mathe-Labs, aber **trotzdem gründlich** prüfen.
- Die **geteilte Schicht**: `HTML/js/` (~42 JS) + zentrale CSS.

**Tiefe — zweistufig (sonst wird's entweder oberflächlich oder uferlos):**
1. **Flacher Inventar-Sweep über ALLES** (billig, parallel): Zweck · Größe · Abhängigkeiten · Red Flags.
2. **Tiefe Review nur auf die kritischen/größten**: Tracker, VGP, geteiltes `js/`, komplexeste Labs.

## Die 6 Audit-Dimensionen (jede file:line-belegt, ehrlich)
1. **Labs/Tools-Inventar** — was gibt es, was macht jedes genau? (Name · Zweck · Größe · Abhängigkeiten)
2. **Doppel-Implementierungen & Tests** — wo ist dieselbe Logik mehrfach (Recorder, Branding, Layout,
   Farben, Buttons, Dropdowns, Lightbox, Sync, Utilities)? Test-Abdeckung: **Ist-Zustand** UND
   **was getestet werden sollte**.
3. **Codequalität / Bugs / Wartbarkeit** — echte Bugs, fragile Muster, Komplexitäts-Hotspots, toter Code.
4. **Dokumentation** — READMEs, `CLAUDE.md`, Code-Kommentare, Onboarding für neue Devs.
5. **Performance** — Engpässe, schwere Payloads, blockierende Scripts, Optimierungspotential.
6. **Sicherheit** (Repo ist **public**) — Secrets/Keys im Code/Verlauf, Supabase-RLS, XSS via innerHTML,
   eval, CORS. **Funde adversarisch verifizieren** — nur Bestätigtes als „✅ bestätigt".

## Konkrete Wünsche
- **Zentrales Design-System:** alle Farben zentral (Tokens / CSS-Custom-Props), überall **einheitliche**
  Buttons, Dropdowns, Inputs. → inventarisieren + Vorschlag (Tokens + Komponenten) + **Migrationspfad**.
  Bestehende Palette: λ Orange `rgb(245,194,66)` · Υ Rot `rgb(176,36,24)` · φ Grün `rgb(121,158,49)`.

## Deliverable: ein Bericht `AUDIT.md`
**Ablage:** Ergebnis als `AUDIT.md` (Repo-Root) speichern und auf einem **eigenen Branch** pushen —
**nicht** nach `main`. So lässt es sich per `git diff --stat` prüfen und kontrolliert reinholen.

- **Management-Summary** — Ist-Zustand in 5 Sätzen + die 3 größten Risiken (ehrlich).
- Befunde je Dimension (1–6), file:line-belegt.
- **Globaler Refactor-Plan als dependency-sortierte Work-Packages.** Jedes Paket:
  `ID · Ziel · betroffene Dateien · Risiko (niedrig/mittel/hoch) · Aufwand (Personentage) ·
  Owner-Agent-Typ · Abhängigkeiten (Paket-IDs) · parallelisierbar (ja/nein)`.
- **Design-System-Vorschlag** (Tokens, Komponenten, Migration).
- **Empfohlene Reihenfolge** (Phasen) + Quick-Wins.

## WICHTIG — gebaut für Orchestrierung (Chef-Agent → Sub-Agenten)
Der Plan muss so geschrieben sein, dass ein **Chef-Agent die Arbeit direkt verteilen** kann.
Der Audit selbst zerfällt sauber in parallele, eigenständige Tasks:
- **Inventar-Agenten** (read-only): je ein Bündel Labs / App-Ordner / die `js/`-Schicht.
- **Dimensions-Agenten:** je 1 pro Dimension (Doppel-Code · Design-System · Security · Performance ·
  Qualität · Doku) — strukturierte Funde mit file:line.
- **Deep-Dive-Agenten:** Tracker · VGP · geteiltes `js/`.
- **Verifizier-Agenten:** Security-/Bug-Funde adversarisch gegenprüfen.
- **Synthese-Agent:** alles → `AUDIT.md` inkl. der Work-Packages.

Jeder Task liefert **strukturierte Funde mit file:line**; die Synthese fügt zusammen. Die Work-Packages
im Refactor-Plan sind die Einheiten, die der Chef-Agent danach an Umsetzungs-Agenten verteilt.

---

### notes/notiz-2026-06-13.md  · obsolet, archiviert 2026-06-22

# Notiz — 2026-06-13

> Tages-Notiz (von Doc unterwegs). Wird im Lauf des Tages ergänzt.

## Solita (labai.html) responsive gemacht
- **Problem:** `labai.html` hatte **kein Viewport-Meta** → auf dem Handy in Desktop-Breite gerendert
  (nicht responsive); keine Media Query; Eingabe-Reihe mit den neuen Voice-Buttons (🔊/🎤/GO) auf
  schmalen Schirmen eng.
- **Fix (Regel #16):**
  - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` ergänzt.
  - **Media Query `@media (max-width: 600px)`**: `body`-Padding 24→10 px · `.chat-container` 86 %→100 %,
    Höhe an Viewport angepasst · `.input-area` Padding/Gap kleiner · `.send-button` schmaler · `.message-input`
    Padding kleiner → Textarea + die drei Buttons passen ohne Überlauf.
- Nur Logik/CSS geprüft (kein Browser in der Sandbox) → am Gerät kurz gegenchecken.

## Offen / als Nächstes
- (Platz für weitere Punkte heute.)

---

### notes/notiz-2026-06-16.md  · obsolet, archiviert 2026-06-22

# Notiz — 2026-06-16

> Tages-Notiz (von Doc unterwegs). Wird im Lauf des Tages ergänzt.

## Tracker — Navigation / Fadenkreuz
1. **Punkt mitführen auch ohne Navigation:** Wenn man **nicht** navigiert, wird der Punkt
   (aktuelle Position) **nicht mehr mitgeführt**. Er soll auch im Nicht-Navigations-Modus
   weiter zentriert/mitgeführt werden.
2. **Sofort Fadenkreuz-Navigation:** Sobald man **navigiert**, bitte **sofort** auf
   Fadenkreuz-Navigation umschalten.
3. **Zieleingabe deutlich überarbeiten:** Die Zieleingabe soll deutlich überarbeitet werden.

---

### notes/stand-branch-cleanup-2026-06-16.md  · obsolet, archiviert 2026-06-22

# Stand — Branch-Cleanup 2026-06-16

Vollständige Durchsicht aller Branches: Was lag noch offen, was war schon live?

## Ergebnis
**Kein ungebauter Code lag mehr offen.** Alles war entweder gemerged oder durch
neuere Versionen in `main` überholt. Das einzig wirklich Offene waren zwei reine
Notiz-Dateien mit unerledigten Wünschen — die wurden vor dem Löschen auf `main`
gesichert (Commit `0726650`).

## Gesicherte Notizen (jetzt auf main)
- `notiz-2026-06-16.md` — Tracker-Navigation: Punkt auch ohne Navigation mitführen;
  bei Navigation sofort Fadenkreuz-Modus; Zieleingabe überarbeiten.
- `ideen-und-wuensche-2026-06-14.md` — POIs, Voice Navigation, Karten-PIN,
  Tankstellen-Aktivierung (TANKERKOENIG_KEY), PlantNet <20 % ausblenden, Route Ulfladen.

## Gelöschte Branches (alle 9, remote auf origin)
Leer / voll gemerged:
- `claude/fahrt-notizen-2026-06-12`
- `claude/note-file-todays-date-32a2af`
- `solita-actionable`

Code vorhanden, aber von main überholt:
- `claude/chat-session-LvVM8` — Fullscreen-Toggle + Foto-Sofort-Upload (beides in main).
- `claude/notizfile-nd-mike-delta-c4m8sg` — Fuel-Pille + Blitzer-Layer; main hat die
  neuere Zwei-Panes-Fassung. (Dessen Notiz `notiz-2026-06-15-…` lag schon in main.)
- `claude/global-check-forloop-mPHhm` — PWA-Update-Banner, AUDIT.md, email-notes;
  alles in main gelandet.

Geparkte Fixes — inzwischen in main neu/besser umgesetzt:
- `claude/unclear-request-g5ubA` — „Strich nur bei echtem GPS-Ausfall" + „GPS-Speed
  übersteuert Motion-Gate". Beide jetzt in `HTML/js/tracker.js` (Gap-Strich ~Z.220,
  BUG-1 Doppler-Speed ~Z.640). Der Branch patchte das alte Inline-`tracker.html`
  (vor dem Refactor) → obsolet.

## Bewusst stehen gelassen
- Lokaler Branch `solita-actionable` + Worktree `/private/tmp/forloop-solita`
  (Remote ist gelöscht, lokal bleibt die Arbeitskopie). Doc: „wir lassen das so."
- Branch `solita-vosk-hybrid` mit eigenem Commit `0749584` (KI-Aussprache) —
  unangetastet; steht ahead-1/behind-1 zu origin/main (main hat nur die Notizen voraus).

---

### krass-app/wakeword-solita-erkennung.md  · obsolet, archiviert 2026-06-22

# Wake-Word „Solita" zuverlässig erkennen — Optionen

> Notiz von Doc (2026-06-11). **Noch nicht gebaut** (CLAUDE.md Regeln 2/4).
> Hintergrund: Das deutsche Vosk-Modell kennt „krass", aber das Fantasiewort **„Solita"** wird schlecht
> erkannt (oft als „solide" gehört). Relevant für das krass-app-Experiment **und** den künftigen
> Agent-Namen/Weckwort „Solita" (siehe `../HTML/tracker/plan-contact-ai-im-tracker.md`).

## Zwei Wege, das deutlich besser zu machen

### 1. Dem System das Wort gezielt beibringen *(einfach, erster Versuch)*
- Vosk kann mit einer **festen Wortliste/Grammatik** laufen: man gibt dem `Recognizer` eine Liste der
  erlaubten Wörter mit (z. B. `["krass", "solita", "[unk]"]`). Dann **erwartet** es genau diese Wörter
  und matcht „Solita", statt es als „solide" zu verwerfen.
- Bleibt **offline, on-device, keyless** — kein neues System nötig, nur ein Parameter im Service.
- 80/20: oft reicht das schon.

### 2. Auf die eigene Stimme anlernen *(treffsicher, etwas mehr Aufwand)*
- Dedizierte **Wake-Word-Engines**, die man mit **ein paar eigenen Aufnahmen** trainiert (Wort ~10–50×
  einsprechen) → ein winziges Modell erkennt **genau dein Wort in deiner Stimme**, auch Fantasiewörter.
- Optionen: **openWakeWord** (open source, gratis), **Picovoice Porcupine** (Custom-Keyword, kommerziell),
  Edge Impulse Keyword-Spotting. Alle **on-device**.
- Sehr robust gegen Fehlauslöser — der „richtige" Weg für ein echtes, persönliches Weckwort.

## Empfehlung
Erst **Weg 1** (Vosk-Wortliste) — billig, evtl. genug. Wenn's dann immer noch wackelt → **Weg 2**
(openWakeWord/Picovoice) für ein echtes, auf Doc trainiertes Weckwort. Caveat: Weg 1 bleibt im
jetzigen Vosk-Setup; Weg 2 ist eine eigene Komponente.

---

### wichtige-idee.md  · obsolet, archiviert 2026-06-22

# Wichtige Idee — Solita: Kosten pro Abfrage anzeigen

**Idee (Doc, 2026-06-18):** In Solita nach **jeder** Abfrage in geeigneter Weise
anzeigen, **wie viel diese eine Abfrage gerade gekostet hat**. So sieht man
laufend mit, was der Spaß kostet (vgl. die Anthropic-Kostensorge ~6 $/Tag), und
kann teure Anfragen sofort erkennen.

---

## Warum das einfach geht — die Daten liegen schon vor

Die Edge-Function gibt die Token-Nutzung bereits ans Frontend zurück:

- `supabase/functions/claude/index.ts` antwortet u. a. mit `usage: data.usage`
  (das rohe Anthropic-`usage`-Objekt der jeweiligen Antwort).

Damit hat der Client **pro Antwort** schon alles, was für die Kostenrechnung
nötig ist. Es muss nichts Neues vom Server geholt werden — nur clientseitig
rechnen und anzeigen.

### Die relevanten `usage`-Felder (pro Antwort)

| Feld | Bedeutung | Preisfaktor |
|---|---|---|
| `input_tokens` | ungecachte Eingabe-Token (voller Preis) | 1× Input |
| `cache_read_input_tokens` | aus dem Prompt-Cache gelesen | ~0,1× Input |
| `cache_creation_input_tokens` | frisch in den Cache geschrieben | 1,25× Input (5-Min-TTL); 2× bei 1-h-TTL |
| `output_tokens` | erzeugte Ausgabe-Token | 1× Output |

> Achtung: `input_tokens` ist NUR der ungecachte Rest. Gesamt-Prompt =
> `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`.

---

## Preise pro 1 Mio. Token (Stand 2026-06, bitte gelegentlich prüfen)

| Modell | Model-ID | Input $/1M | Output $/1M |
|---|---|---|---|
| Sonnet 4.6 (Solita-Default) | `claude-sonnet-4-6` | 3,00 | 15,00 |
| Opus 4.8 | `claude-opus-4-8` | 5,00 | 25,00 |
| Haiku 4.5 | `claude-haiku-4-5` | 1,00 | 5,00 |

Solita-Default ist aktuell `claude-sonnet-4-6` (der Client kann opus/haiku
schicken). Die Kostenformel muss also das **tatsächlich benutzte Modell**
berücksichtigen — das Modell steht in der Antwort (bzw. ist das gesendete).

---

## Kostenformel (pro Abfrage)

```
kosten =
    (input_tokens                 / 1e6) * preisInput
  + (cache_read_input_tokens      / 1e6) * preisInput * 0.10
  + (cache_creation_input_tokens  / 1e6) * preisInput * 1.25   // 5-Min-TTL
  + (output_tokens                / 1e6) * preisOutput
```

(Bei 1-h-TTL den Cache-Write-Faktor auf 2.0 setzen. Solita nutzt aktuell den
Standard-TTL → 1,25.)

Eine Mini-Preis-Tabelle im Client (Model-ID → {in, out}) genügt; unbekanntes
Modell → Sonnet-Preise als Fallback und einmal warnen.

---

## Anzeige — „in geeigneter Weise"

Vorschläge, von dezent bis ausführlich:

1. **Pro Antwort ein kleines Badge** unter/neben der Assistenten-Antwort, z. B.
   `≈ 0,012 $` (USD), beim Antippen ausklappbar mit der Aufschlüsselung
   (Input/Cache/Output + Token-Zahlen). Dezent, stört den Lesefluss nicht.
2. **Laufende Sitzungs-Summe** (klein in der Kopf-/Fußzeile): „Sitzung: 0,34 $".
   Reset pro Sitzung; optional Tages-Summe in `localStorage`.
3. **Farbcodierung** wie sonst im Labor: günstig φ-Grün, mittel λ-Orange, teuer
   Υ-Rot — Schwellen frei wählbar (z. B. < 0,01 $ grün, < 0,05 $ orange, sonst rot).
4. **Cache-Hinweis:** wenn `cache_read_input_tokens` hoch ist, ein kleines
   „Cache aktiv"-Zeichen — macht sichtbar, dass das Prompt-Caching greift.

Empfehlung: (1) + (2) zusammen — pro Antwort ein kleines Badge, plus eine
laufende Sitzungs-Summe.

---

## Hinweise / offene Punkte

- **Währung:** Anthropic rechnet in USD. Für eine €-Anzeige bräuchte es einen
  (groben, festen) Umrechnungskurs — oder schlicht bei USD bleiben.
- **Beträge sind winzig** (Bruchteile eines Cents). Format mit genügend
  Nachkommastellen oder in Cent/Tausendstel-Cent anzeigen, damit nicht alles
  „0,00 $" heißt. Für die Sitzungs-Summe lohnt sich USD mit 4 Nachkommastellen.
- **Genauigkeit:** Die Rechnung ist eine sehr gute Schätzung; die echte
  Abrechnung macht Anthropic. Im UI als „≈" kennzeichnen.
- **Single Source of Truth:** Preis-Tabelle an EINER Stelle im Client halten,
  damit Preisänderungen leicht nachzuziehen sind.
- Optional später: die Edge-Function könnte die fertig berechneten Kosten schon
  mitliefern (dann liegt die Preis-Tabelle serverseitig) — fürs Erste reicht
  aber die Client-Rechnung, weil `usage` ohnehin schon ankommt.

---


## Teil 3 — Aus feature-requests.md entfernt 2026-06-22 (Referenz/Ordnung)

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

## Nicht-Tracker / Verteilung & Wissen (Kontext, kein Bau-Auftrag)
- **Play-Store-Verteilung** (🌿 `archive/verteilung-playstore-tester.md`): Samsung „Auto Blocker" blockt Sideload;
  Play Store braucht für neue persönliche Konten **12 Tester · 14 Tage**. Firmenkonto (D-U-N-S) umgeht die
  Auflage. **Thema „nächste Woche"** — Entscheidung, kein Code.
- **Wissens-Notiz Lebens-Agent** (🌿 `archive/wissensnotiz-llm-kompression-lebensagent.md`): Tokens/Kompression +
  Memory-Architektur (extern speichern, Retrieval, stufenweise verdichten) für den „Solita/Samantha"-
  Lebensbegleiter. Referenz/Hintergrund, kein Auftrag.

## Reihenfolge-Empfehlung (Vorschlag — Doc kippt)
0. **Branch `fit-mode…` nach `main` mergen** (3-Wege) — sonst doppelte/divergente Arbeit.
1. **BUG-1** (Speed) + **BUG-2** (Regenradar) + **BUG-5** (Live-Broadcast) — Vertrauen in die Basis.
2. **FEAT-1 Brotkrumen** (Prio 1, Sicherheit) · **FEAT-2 Goldene Stunde** (klein, Prio 1) ·
   **FEAT-13 Navi-Blau/Speed** (Prio 1) · **FEAT-15 KI-Indikator** (klein, wartet nur auf Variantenwahl).
3. **FEAT-14 Tracking↔Navi entkoppeln** (Quick-Win C) · **FEAT-3 Parkplatz → FEAT-4 Zurück zum Auto**.
4. **FEAT-5 Regen-Vorwarnung** (erst nach BUG-2).
5. **FEAT-10 Remote-Config ausbauen** · **FEAT-11/12 Contact-AI/Solita** (Future Now, größer).
6. Rest nach Doc-Prio.
