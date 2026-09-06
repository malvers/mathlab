# Eine Unterrichtsreihe bauen — von der Planzeile bis zum Link

So entsteht eine komplette Reihe aus Foliensätzen und Wochentests: aus dem
Stoffverteilungsplan heraus, geprüft, in OneDrive abgelegt und wieder im Plan
verlinkt. Erprobt an Informatik FOS 12, Wochen 3–32 (30 Decks, 30 Tests).

Der rote Faden sind die Schritte **3** und **6**. Beide heißen *nachmessen statt
annehmen*, und genau an beiden ist es beim ersten Mal schiefgegangen.

---

## Voraussetzungen

| | |
|---|---|
| Python | `python-pptx`, `Pillow`, `fontTools` |
| Werkzeuge | `pdftotext`, `pdftoppm` (Poppler, in `/usr/local/bin`) |
| Schriften | Orbitron, Raleway, Outfit in `~/Library/Fonts/` |
| Apps | Microsoft PowerPoint (zum Rendern), OneDrive (Sync) |

---

## 1 · Auftrag klären

Die Wochennummern **gegen den Plan prüfen, bevor gebaut wird**. Der Plan hat eine
Spalte `Nr.` und eine Spalte `KW` — die sind nicht dasselbe, und Ferienzeilen
zählen mit. „Bis KW 32“ meinte die Planzeile 32, nicht die Kalenderwoche 32.

Themen und Stichpunkte stehen im Plan selbst:

```
HTML/svp/informatik/<klasse>.html   →   Felder `topic` und `details` je Zeile
```

Bei einer Zweideutigkeit die eigene Lesart **ansagen und loslegen** — nicht
nachfragen und warten.

## 2 · Decks bauen

Ein Generator je Woche, `tools/pptx/build_<thema>_<klasse>.py`. Als Muster einen
bestehenden Generator kopieren, nicht bei null anfangen.

Zentrale Bausteine in `tools/pptx/` — hier wird geändert, nie im einzelnen Deck:

| Modul | wofür |
|---|---|
| `slides.py` | `Deck`-Klasse, ein Aufruf je Folienart; Syntaxfärbung für SQL, Python, HTML, CSS, JavaScript, PHP |
| `tables.py` | native PowerPoint-Tabellen im Design |
| `er_diagrams.py` | ER-Diagramme (Chen) und Tabellenschemata |
| `flow_diagrams.py` | Struktogramm, Programmablaufplan, GRAFCET, CSS-Box-Modell |
| `uml_diagrams.py` | UML-Klassendiagramme mit Vererbung |

Aufbau eines Decks, durchgehend gleich:

> Titel → Kapitel → Inhaltsfolien → Merksatz → **Fun Facts** → **Eure Aufgabe**

**Fallen:**

- Raleway hat kein `☐` und kein `→`, Orbitron kein `·` und kein `„`. Vorher prüfen:
  ```python
  from fontTools.ttLib import TTFont
  ord(zeichen) in TTFont(pfad).getBestCmap()
  ```
- Keine HTML-Entities (`&lt;`) in Folientext — python-pptx maskiert selbst, sonst
  steht das Entity wörtlich auf der Folie. In *Code*zeilen ist `&lt;` dagegen richtig,
  wenn genau das gezeigt werden soll.
- `code()` verkleinert zu lange Blöcke selbst, warnt aber ab unter 9 pt mit
  `BITTE AUFTEILEN`. Dann die Folie teilen, nicht die Warnung ignorieren.

## 3 · Messen statt hoffen

Schätzer sehen nicht alles. Jedes Deck nach PDF rendern und **jede Seite** vermessen:

```bash
pdftotext -bbox deck.pdf -      # Codefolien: max. y ≤ 440 pt · Textfolien: ≤ 492 pt
```

Das fand elf überlaufende Codefolien, die beim Bauen keine Warnung erzeugt hatten.

Gerendert wird über PowerPoint (AppleScript, in dessen Container speichern — die App
ist gesandboxt). Zusätzlich Kontaktbögen ansehen:

```bash
pdftoppm -png -r 48 deck.pdf seite    # dann mit PIL zu einem Bogen kacheln
```

Die Zahlen finden Überläufe, das Auge findet alles andere. Beides machen.

## 4 · Wochentests

`tools/build_infotest12*.py` erzeugt `HTML/infotest12-<slug>.html` auf der gemeinsamen
`js/quiz-engine.js` — je 10 Fragen, die Lösungsposition per Hash über A–D gestreut.

Danach prüfen:

- JSON parst, genau 10 Fragen, 4 **verschiedene** Optionen, 2 Erklärschritte
- kein `</script>` irgendwo im Fragetext (bricht sonst den Script-Block auf)
- das Gerüst ist byte-identisch zu einer bereits abgenommenen Datei

## 5 · Hochladen — und warten

Decks nach `~/Library/CloudStorage/OneDrive-…/UNTERRICHT/<Kurs>/` kopieren, dann den
Sync **abwarten**. Sonst liefert jeder Link `404`, obwohl der Pfad stimmt.

- Kreispfeile im Finder = läuft noch · Wolke mit Haken = oben
- die erweiterten Attribute (`ls -l@`) verraten es **nicht**
- ein anonymer `curl` taugt nicht als Probe: SharePoint antwortet Fremden **immer**
  mit `403`, egal ob die Datei existiert

Bleiben die Dateien lange stabil **und** verbraucht der OneDrive-Prozess kaum CPU,
steht die Warteschlange. Dann hilft: OneDrive beenden und neu starten.

## 6 · Freigabelinks holen

Damit der Foliensatz **im Plan selbst** angezeigt wird statt in einem eigenen Fenster,
braucht es einen echten Freigabelink der Form `…/:p:/g/…`.

**Zielgruppe „Jeder mit dem Link“, Berechtigung „Ansehen“.**

Ein organisationsinterner Link funktioniert im eingebetteten Viewer **nicht**: dort ist
das SharePoint-Cookie ein Drittanbieter-Cookie und wird vom Browser blockiert, also
landet der Betrachter auf der Anmeldeseite — und die lässt sich nicht einbetten. Die
eigene Anmeldung hilft nichts.

Ebenso wenig taugt ein **Pfad**-Link (`…/Documents/…/x.pptx`): blank lädt er die Datei
herunter, mit `web=1` öffnet er SharePoints eigene Oberfläche, und die verbietet das
Einbetten per `SAMEORIGIN`.

Abnahme, eine Zeile je Link:

```bash
curl -sS -o /dev/null -L -w '%{http_code}' "<link>&action=embedview"
```

`200` heißt einbettbar. `403` heißt organisationsintern und damit im Viewer tot.

Als Nebeneffekt verrät die Endziel-URL bei einem „Jeder“-Link `&file=<dateiname>` —
damit lässt sich die Zuordnung Datei → Link von außen belegen.

## 7 · In den Plan hängen

```bash
python3 tools/svp-material.py get /svp/informatik/<klasse>.html <index>
python3 tools/svp-material.py set /svp/informatik/<klasse>.html <index> \
        "Label <url> «Kurzbeschreibung»"
```

Der **Index ist die 0-basierte Planzeile inklusive Ferienzeilen** — nicht die
Wochennummer. Immer erst `get`: der Befehl druckt Woche und Thema, damit sieht man
sofort, ob man die richtige Zeile trifft.

Die Tests kommen direkt in die Planzeile im HTML:

```js
quiz: { href: '../../infotest12-<slug>.html', label: '10 Fragen' }
```

Zum Schluss in Supabase gegenlesen: wie viele Zeilen tragen einen Link, und ist kein
Pfad-Link mehr übrig?

## 8 · Abschluss

- Secret-Scan über alle Dateien, die in den Commit gehen
- **Fremde Änderungen im Arbeitsbaum ausnehmen** — aber prüfen, ob eine davon
  Voraussetzung ist. `deck_util.py` mit der `**fett**`-Auszeichnung war es: ohne sie
  zeigen alle Decks Sternchen.
  ```bash
  git add -A -- ':!fremde/datei.html'
  ```
- Push auf `main` nur nach ausdrücklicher Freigabe, und die gilt einmalig.

---

## Was am meisten Zeit kostet

| Symptom | Ursache | Prüfung |
|---|---|---|
| Text läuft aus der Folie | Schätzer statt Messung | `pdftotext -bbox` je Seite |
| Link liefert `404` | Sync noch nicht durch | Finder-Symbol ansehen |
| „refused to connect“ im Viewer | org-interner Link, Drittanbieter-Cookie | `curl` muss `200` liefern |
| Datei wird heruntergeladen | Pfad-Link statt Freigabelink | Linkform auf `/:p:/g/` prüfen |
| leere Antworten der Bedienungshilfen | App nicht aktiviert | `tell application "X" to activate` |
