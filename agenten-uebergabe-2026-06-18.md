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
