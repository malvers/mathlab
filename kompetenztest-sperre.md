# Test-Sperre + Mission Control — Referenz für Agenten

Stand 18.09.2026. Für Doc gibt es dieselben Erkenntnisse als PDF auf dem Desktop
(`kompetenztest-sperre-erkenntnisse.pdf`). Diese Datei ist die Arbeitsgrundlage für
jeden, der an der Sperre, an `quiz-engine.js` oder an `svp/leistungstest.html` arbeitet.

## Vorbild: Kompetenztest Sachsen

- Plattform: **onlinetest.schule** vom ISQ Berlin, dieselbe wie VERA (Sachsen: `/vera/sn`).
  Ab 2026/27 wird schrittweise auf reine Online-Durchführung umgestellt.
- Verhalten laut ISQ-Anleitungen (das sächsische Manual liegt hinter dem ktest.de-Login, **nicht gelesen**):
  - Vollbild schalten die SuS selbst ein (F11, Tablet quer); für Klasse 8 nur „empfohlen“.
  - „Bei unerlaubtem Programmwechsel … wird deren Bildschirm gesperrt und der Test unterbrochen.“
  - Die Lehrkraft sieht den Wechsel in der Online-Administration.
  - SuS setzen den Test **selbstständig** fort, es gibt keine Freischaltung durch die Lehrkraft.
  - **Rot** ist der Abbruch-Knopf der Lehrkraft: Test ungültig, Ergebnis wird nicht übertragen.
- Gesperrt wird die **Testansicht**, nicht das Gerät. Eine Webseite kommt nicht ans Betriebssystem heran;
  das Gerät sperren könnte nur eine Kiosk-App (Safe Exam Browser). Doc hat das selbst so eingeordnet;
  nie „Bildschirm sperren“ versprechen.
- Unklar: ob schon das bloße Verlassen des Vollbilds sperrt. Die Anleitungen sagen nur „Programmwechsel“.
  Bei uns sperrt es (bewusste Entscheidung).

## Unser Aufbau

Zentral, gilt für **alle** Online-Tests, sobald ein gültiger Zettel-Code da ist (`CODE_RE`).
Nie in einer einzelnen Testseite patchen.

| Teil | Wo | Was |
|---|---|---|
| Schüler-Seite | `HTML/js/quiz-engine.js`, Abschnitt „Test guard“ | Startschirm, Auslöser, Sperrschirm, Meldung |
| Optik | `HTML/js/quiz.css`, `.guard*` | Start hell (`--bg`), Sperre rot (`--red`), Orbitron |
| Server | `supabase/migrations/20260918_quiz_leaves.sql` + `20260918_quiz_control.sql` | Tabellen + RPCs, **beide live angewendet** |
| Lehrer-Seite | `HTML/svp/leistungstest.html` | Mission Control: Leiste, Status, Verlassen, Abbruch; live alle 5 s |

**Ablauf Schüler:** `guardOffer()` zeigt den Startschirm (verdeckt die Fragen) → „Test starten“ =
`guardGo()`: Vollbild (braucht die User-Geste), Code-Feld gesperrt, `quiz_leave('back')` →
Auslöser → `guardLeave(kind)`: roter Schirm + `quiz_leave(kind)` → „Weiter mit dem Test“ = wieder
`guardGo()` → Abgabe: `guardStop()` beendet alles und verlässt das Vollbild.

**Auslöser:**
- `visibilitychange` mit `document.hidden` → `'tab'` (Tab- und App-Wechsel, auch am Fon)
- `blur`, dann nach 250 ms noch `!document.hasFocus()` → `'focus'` (kurzes Flackern sperrt nicht)
- `fullscreenchange`/`webkitfullscreenchange` ohne Vollbild-Element → `'fullscreen'` (Esc)
- 1,5 s Ruhe nach Start und nach „Weiter“ (`guardQuietUntil`), weil der Wechsel ins Vollbild
  kurz den Fokus kosten kann.

**Nicht aktiv:** ohne Code, Übungsblätter (`submit: false`), `?auswertung`, bereits abgegeben
(`DONE_KEY`), einzelner Test mit `QUIZ.guard = false`. Das versteckte iframe, mit dem
`leistungstest.html` die Testseite liest (`?test`, ohne Code), löst also nichts aus.

**Server (Supabase):**
- `quiz_leaves(id, quiz, code, kind, left_at, back_at)`: RLS an, für anon/authenticated komplett
  dicht. Erreichbar nur über die zwei RPCs (security definer).
- `quiz_leave(p_quiz, p_code, p_kind)`: `'tab'|'focus'|'fullscreen'` öffnet eine Zeile. Ist noch eine
  offen, passiert nichts, also ein Verlassen und nicht zwei. `'back'` schließt die offene. Dauer nach
  **Serveruhr**. Maximal 200 Zeilen pro Code und Test; Code muss `^[2-9A-HJ-NP-Z]{4}$` sein.
- `quiz_leaves_for` gab es kurz; ersetzt durch `quiz_control` (siehe unten) und gedroppt.
- Pool-Id = `QUIZ_ID` der Engine (`id-version-klasse`, im Testmodus `id-test`). `leistungstest.html`
  baut sie mit `poolOf()` genauso.
- Nach neuen Funktionen per Mgmt-API: `notify pgrst, 'reload schema'`, sonst antwortet REST mit 404 (PGRST202).

## Mission Control (Lehrer-Übersicht)

Nach der Online-Administration des Kompetenztests. Sitzt in der Zuordnungsliste von
`svp/leistungstest.html`, also dort, wo die Klarnamen lokal liegen.

- **Herzschlag:** Die Engine ruft `quiz_ping(p_quiz, p_code, p_answered, p_total)` beim Start, alle 15 s
  (`pingTimer`) und 1,5 s nach jeder Antwort (`guardProgress`). Die Antwort ist der Laufzustand
  `'running' | 'aborted'`.
- **Abbruch:** Kommt `'aborted'`, zeigt die Engine den roten Schirm „Test beendet“ ohne Knopf;
  `pick`/`submit`/`guardLeave` sind gesperrt. Kommt später wieder `'running'`, erscheint „Es geht weiter“
  mit „Weiter mit dem Test“ (Vollbild braucht wieder eine User-Geste). Verzögerung: höchstens ein Herzschlag.
- **Tabelle `quiz_runs`** `(quiz, code)` PK: `started_at, seen_at, answered, total, aborted_at`. Für anon und
  authenticated dicht.
- **`quiz_abort(p_quiz, p_code, p_on)`:** nur `authenticated` **und** `auth.uid()` = Plan-Owner (dieselbe UID
  wie in der Policy von `svp_plan_edits`). anon hat kein Execute. Rücknahme mit `p_on = false`.
- **`quiz_vote`** weist abgebrochene Codes mit `'aborted'` ab. Sonst ist die Funktion byte-gleich zur alten
  Fassung; beim Ändern die ganze Funktion aus `pg_get_functiondef` übernehmen.
- **`quiz_control(p_quiz, p_codes[])`** → je bekanntem Code `started, seen_secs, answered, total, aborted,
  leaves, away_secs, away_since, submitted`. Das Alter kommt von der Serveruhr. Codes ohne jede Spur
  fehlen in der Antwort.
- **Seite:** `watchControl()` startet aus `render()`, `fillControl()` alle 5 s bei sichtbarer Seite.
  `statusOf()` in dieser Reihenfolge: abgebrochen → abgegeben → weg (`away_since`) → offline
  (`seen_secs > 45`, drei verpasste Herzschläge) → läuft; ohne Start „—“.
  - `paintControl()` füllt EINE Spalte Status vor „Ergebnis“: Zustand, „12/33“ und rot „2× 4:54“ fürs
    Verlassen (Doc 18.09.: „Status und Verlassen in eine Spalte“).
  - `paintSummary()` füllt die Leiste `#ltMc`: Gestartet x/n, Läuft, Weg, Offline, Abgegeben, Abgebrochen.
  - Frisch abgegeben: Das Ergebnis wird sofort per `quiz_result` nachgeladen, nicht erst auf den Knopf.
- **Abbruch-Knopf:** im Detail eines Kindes (Zeile anklicken), `#ltAbort`, zweiter Klick bestätigt
  (Muster „Alles löschen“, 4 s). `abortShown` merkt sich Code und Zustand, damit der 5-s-Poll einen
  halben Doppelklick nicht zurücksetzt. Ohne svp-Session öffnet `svpAuth.loginDialog`.
- **Kacheln | Liste** (Doc 18.09.: „gefällt mir sehr … haben wollen“): Schalter in der Leiste, Wahl pro
  Browser in `localStorage['svp-leistungstest-view']`, Standard Kacheln. Eine Kachel je Person
  (`#ltTiles`, `paintTile()`) aus denselben Daten wie die Zeilen (`control` + `tileRes`, gefüllt in
  `paintControl` bzw. `paintResult`). Inhalt: Name oder Deckname, Deckname · Code, Zahl oder Punkte,
  Zustand + Note + „N× verlassen“, Fortschrittsbalken. Klick öffnet dasselbe Detail wie eine Zeile
  (`pick()`/`clearSelection()`). Gedruckt wird immer die Liste.
- **Farben** (Doc 18.09. abends): „läuft“ ist **cyan** (Kachel, Status-Spalte, Chip), damit Gelb frei ist für die
  Punktzahl. Abgegebene Kacheln (Rahmen, Punkte, Balken, per `--res`) und die Ergebnis-Spalte haben die Farbe
  von `scoreColor(pct)`, derselben Rampe wie `barColor` in quiz-engine.js: rot 0 %, orange 50 %, grün 100 %.
- **Neubeginn** (nur Vorführklasse GENII, Knopf rechts in der Leiste, zweiter Klick, Docs Session):
  `quiz_reset(p_quiz, p_codes[])` löscht für die Codes **dieser Liste** Abgaben, Status und Verlassen und
  berechnet `quiz_stats` des Pools aus den übrigen Abgaben neu. Die Zähler sind exakt die Summe der
  Abgaben; das wurde vorher geprüft, 0 Abweichungen. Server erzwingt `-GENII$`. Andere Codes desselben
  Pools (die 21 inszenierten DSB-Abgaben auf docalvers.de, eigene Codes dort) bleiben. Den Vermerk
  „schon abgegeben“ im Kind-Browser (`DONE_KEY`) löscht er nicht; zum Testen Inkognito-Fenster nehmen.
- **Alle Zahlen** laufen über `CyberClock.digits` (das eine Ziffern-Widget). Im Druck: kein Blinken,
  keine Leiste.

## Grenzen (auch beim Original)

- Den Wechsel **verhindern** geht nicht (Cmd-Tab, Alt-Tab, Esc), man kann ihn nur bemerken.
- Zweites Gerät: nicht erkennbar.
- iPhone: kein Vollbild für Webseiten, dort nur Tab/App/Fokus. iPad und Android können Vollbild.
- Code von Hand erst am Ende eingetippt: bis dahin keine Überwachung. Der QR-Weg bringt ihn gleich mit.
- Reload mitten im Test: Die Seite meldet beim Verlassen ein `'tab'`, der nächste Start schließt die
  Zeile. Die Antworten sind weg; das war schon vorher so.

## Testen

Lokal (serve.py :8765, Live-Reload), headless mit Playwright aus dem Scratchpad, **nie** Docs Chrome:
- Schüler: `infotest9-leistungstest-9a.html?test&code=ABCD` (Pool `infotest9-lt1-a-test`).
  Headless kann echtes Vollbild; Fokusverlust mit `Document.prototype.hasFocus = () => false` plus
  `blur`-Event nachstellen, Tab-Wechsel über `document.hidden` per `defineProperty` plus
  `visibilitychange`.
- Lehrer: `svp/leistungstest.html?test` (GENII-Vorführklasse, Pool `infotestfos12-eingang-v1-GENII`),
  Codes aus der Tabelle lesen und per RPC Verlassen einspielen.
- Abbruch ohne Docs Passwort testen: im Mgmt-SQL `set local role authenticated; set local
  request.jwt.claims = '{"sub":"<Owner-UID>"}'; select quiz_abort(...)`. Die Engine merkt es beim
  nächsten Herzschlag (≤ 15 s).
- Danach **aufräumen** (Mgmt-SQL): eigene `quiz_leaves`- und `quiz_runs`-Zeilen löschen. Eine Testabgabe in
  `quiz_submissions` löschen **und** die `quiz_stats`-Zähler zurückdrehen.

## Offen

- Doc hat nicht entschieden, ob nach der Sperre ein Lehrer-Code freischalten soll. Jetzt: das Kind
  macht selbst weiter, wie beim Original. Wer echt aufhören soll, bekommt den Abbruch.
- Zeitverlängerung (Kompetenztest hat sie) fehlt, weil unsere Tests gar kein Zeitlimit haben.
- Das Beamer-Dashboard `?auswertung` zeigt keine Wechsel. Es ist anonym, Codes gehören nicht an die Wand.
- Stand 18.09.: uncommittet, Push gated.

## Quellen

- ISQ: VERA 3 2026, Anleitung Onlinetest — https://www.isq.berlin/wordpress/wp-content/uploads/2026/03/VERA-3_2026_Anleitung-Onlinetest.pdf
- ISQ: Kurzanleitung VERA 8 Online 2025 — https://www.isq.berlin/wordpress/wp-content/uploads/2024/11/V8-25_Kurzanleitung-VERA-8-Online-fuer-Schulen_2025.pdf
- Kompetenztest Online Sachsen — https://www.onlinetest.schule/vera/sn
- LaSuB: Kompetenztests 2025/26, Informationen — https://www.schule.sachsen.de/download/Kompetenztests_25_26.pdf
