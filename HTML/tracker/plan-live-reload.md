# Plan: Fern-Reload „speichern → neu laden → weitermachen"

Status: **geplant, NICHT umgesetzt** (Doc 2026-07-01). Von Doc gewünscht, gemeinsam
umzusetzen — bitte morgen mit ihm zusammen bauen, nicht allein durchziehen.

## Ziel / Szenario

Wir (Entwickler) machen Änderungen und deployen. Die **laufende App auf dem Pixel
(oder im Web) lädt sich selbst neu** und zeigt die neue Version — **ohne** dass Doc
sie schließen und wieder öffnen muss. Und ganz wichtig: **kein Datenverlust** —
bevor neu geladen wird, wird der aktuelle Zustand gesichert und danach wieder
hergestellt.

## Kernidee

Von außen kann man eine passive Seite nicht „pushen". Die laufende Instanz muss
*zuhören* und sich **selbst** neu laden (`location.reload()`). Ablauf bei einem
Reload-Signal:

1. `TrackBuffer.saveNow(state)` → laufende Aufnahme **sofort** in IndexedDB flushen.
2. Nav-Ziel/Route sichern (Nav macht das via `saveLastRoute()` schon).
3. Ein „resume nach reload"-Flag in `localStorage` setzen.
4. **Dann** `location.reload()`.
5. Beim Boot: Flag erkennen → gepufferten Track **automatisch** wiederherstellen
   (statt der heutigen „Wiederherstellen?"-Frage) → Aufnahme läuft weiter.

## Was schon existiert (wiederverwenden, nicht neu bauen)

- **`js/track-buffer.js`** — crash-sicherer Track-Puffer in IndexedDB.
  `save()` (throttled), **`saveNow()` (sofort)**, `load()`, `clear()`. Genau der
  Baustein für „vor dem Reload sichern". Beim Start bietet die App die gepufferte
  Aufnahme heute schon zum Wiederherstellen an.
- **Nav-Persistenz** — `saveLastRoute()` / `restoreLastRoute()` in
  `js/tracker-nav.js` (localStorage `trk_nav_last`). Das **Ziel** überlebt einen
  Reload; die aktive Führung muss einmal neu berechnet werden (1 Fetch), kein
  Datenverlust.
- **Service Worker `tracker/sw.js`** — **network-first mit `cache:'no-store'`** für
  eigene GETs. Dadurch holt ein `location.reload()` hier bereits **frische**
  JS/CSS (der SW umgeht den HTTP-Cache). Deshalb reicht nach dem Reload-Signal ein
  schlichtes `location.reload()`; kein `skipWaiting`-Tanz nötig, solange sich
  `sw.js` selbst nicht ändert.

## Warum nicht Polling

Doc findet dauerndes Polling (z. B. alle 45 s eine `build.json`) nervig. Deshalb:
**Supabase Realtime (WebSocket, Push)** statt Pull. Signal kommt in ~1 s, kein
Gepolle. Konsequenz: eine dauerhaft offene Verbindung (minimal Strom/Daten).
Supabase ist im Projekt bereits vorhanden (Anon-Key public by design, RLS schützt
Daten — kein neues Secret, CLAUDE.md Regel 18).

Optionaler leichter Fallback: nur *wenn* der Realtime-Socket down ist, ein
sehr seltener Poll — aber nur, falls nötig.

## Transport-Design (Supabase Realtime)

- Ein Realtime-Channel (Broadcast) `tracker-control`, Event `reload`.
- Die App abonniert ihn beim Start (nur wenn Supabase erreichbar; headless/cron
  ausgenommen).
- Nachricht kann eine `build`-Kennung mittragen, damit die App einen doppelten
  Reload auf dieselbe Version vermeidet.

## Auslöser auf Entwicklerseite (OFFENE Entscheidung — mit Doc klären)

- **Stufe 1 (schnell):** manueller Auslöser — ein Mini-Kommando oder ein Dev-Knopf
  „alle neu laden" → sendet den Broadcast.
- **Stufe 2 (Vollautomatik):** an den Deploy koppeln — nach Push auf main feuert
  eine GitHub Action das Supabase-Signal → App speichert & lädt automatisch.
  **Achtung Regel 20:** kein automatisches Schreiben/Pushen auf `main` durch Bots
  ohne Docs OK; die Action würde nur ein Signal senden, nichts committen — trotzdem
  vorher mit Doc bestätigen.

Doc bei der Frage „manuell jetzt / gleich an Deploy koppeln": **keine Präferenz
geäußert** — morgen gemeinsam entscheiden.

## Sicherheits-Guard (wichtig)

Ein Reload ist ein voller Seiten-Reload → In-Memory-Zustand weg. Deshalb:

- Während **aktiver Aufnahme/Navigation** nicht einfach reload'en, sondern erst
  Schritt 1–3 (sichern), dann reload. Der Track kommt über den Puffer zurück.
- Hook im Core, um „läuft gerade was?" abzufragen: `trkState !== 'idle'` **oder**
  `navActive()` (beide in `js/tracker.js` vorhanden). Vorschlag: als
  `window.trackerBusy()` global exponieren, damit ein entkoppeltes Reload-Modul
  (`js/live-reload.js`) das abfragen kann.
- Wenn „busy": trotzdem sichern + resume-Flag setzen + reload (Track/Route
  überleben). Nur falls wir uns gegen Auto-Resume der Navigation entscheiden,
  stattdessen einen dezenten „Neue Version – tippen zum Laden"-Hinweis zeigen.

## Grenzen (ehrlich)

- Der **Track** kommt sauber zurück. Die **aktive Navigation** überlebt als Ziel;
  die Route wird einmal neu berechnet.
- Lädt nur den **Web-Inhalt** neu. **Native** (Java/Capacitor) Änderungen brauchen
  weiter ein APK-Update (`js/app-update.js`, `version.json`).
- Ist die App **komplett geschlossen** (Prozess tot), kann nichts sie aufwecken —
  das bräuchte eine echte Push-Notification (nativ), außerhalb dieses Plans.
- `location.reload()` ist generell zickig wegen **Unterressourcen-Cache** (lädt HTML
  frisch, JS/CSS evtl. aus Cache) und das alte Hard-Reload-Boolean wird ignoriert.
  Hier gerettet durch den network-first-SW. Alternative Absicherung, falls je nötig:
  **versionierte Asset-URLs** (`tracker-nav.js?v=<hash>`) — dann kann kein Cache
  Altes liefern.

## Umzusetzende Teile (Checkliste für morgen)

- [ ] `js/live-reload.js` — Realtime-Abo, Reload-Handler (sichern → Flag → reload),
      `window.forceReload()` als manueller/Dev-Trigger. In `tracker/tracker.html`
      in die JS-Liste aufnehmen (nach `tracker-overpass.js`/vor Nutzung).
- [ ] `js/tracker.js` — `window.trackerBusy()` exponieren; beim Boot das
      resume-Flag prüfen und den Track automatisch wiederherstellen.
- [ ] Supabase: Realtime-Channel `tracker-control` (Broadcast `reload`).
- [ ] Auslöser Stufe 1: Mini-Kommando/Knopf, der den Broadcast sendet.
- [ ] (später) Auslöser Stufe 2: Deploy-Kopplung via GitHub Action → Supabase.

## Notizen

- Erst-Analyse + Machbarkeit am 2026-07-01 mit Doc besprochen; Doc war müde und
  wollte **gemeinsam** umsetzen — also nicht vorpreschen, morgen zu zweit.
