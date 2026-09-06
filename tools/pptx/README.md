# pptx — Doc Alvers' Folien-Design als Werkzeug

Ein PowerPoint-Design, das **eine** Quelle hat: diese Skripte. Der Footer, die Farben,
die Layouts stehen genau an einer Stelle — nicht in jeder Datei einzeln.

PowerPoint selbst kennt keine lebende Verknüpfung zu einer Vorlage: beim Anlegen wird
kopiert, danach ist jede `.pptx` autark. Deshalb bekommt hier **jedes gebaute Deck einen
unsichtbaren Stempel** (eine OOXML-Custom-Property). `restyle.py` findet die Decks später
daran wieder und zieht ein geändertes Design durch sie hindurch — auch durch Decks, die
du zwischendurch von Hand bearbeitet hast.

## Einrichtung

```sh
pip3 install python-pptx pillow lxml
```

Schriften müssen installiert sein: **Orbitron** (Überschriften), **Raleway** (Text),
**Menlo** (Code, ist auf jedem Mac dabei).

## Das Design bauen

```sh
python3 build_design.py                 # -> out/informatik-vorlage.pptx (leer, 9 Layouts)
python3 build_demo.py                   # -> out/informatik-design.pptx (6 Musterfolien)
```

Layouts: **Titel · Kapitel · Inhalt · Zwei Spalten · Code · Merksatz · Frei ·
Bild rechts · Bild links · Begrüßung**. Alles Sichtbare steckt im Master bzw. in den
Layouts — nichts wird pro Folie gepatcht.

Die Vorlage kann in PowerPoints Galerie wandern; dann bietet „Neu aus Vorlage" das
Design an:

```sh
cp out/informatik-vorlage.pptx \
   ~/Library/Group\ Containers/UBF8T346G9.Office/User\ Content.localized/Templates.localized/Informatik.potx
```

## Ein Deck bauen

`build_webstuhl.py` ist das ausgearbeitete Beispiel (19 Folien, „Vom Webstuhl zum
Algorithmus"):

```sh
python3 fetch_images.py                 # Bilder von Wikimedia Commons -> img/
python3 diagrams.py                     # eigene Grafiken -> img/
python3 build_webstuhl.py               # -> out/webstuhl-algorithmus.pptx
```

Bequemer geht es über `slides.Deck`: eine Methode je Folienart, mit Höhen- und
Breitenmessung und automatischer Auftaktfolie.

```python
from omml import MathDeck            # = slides.Deck, versteht zusätzlich $…$
d = MathDeck("mathe11-nichtlinear.pptx")
d.title("Kicker", "Titel", "Untertitel")
d.bullets("Folientitel", [("Ein **fetter** Begriff und $x^2 = 49$", 0)])
d.two_cols("Titel", links, rechts)
d.merksatz("Ein Satz, der hängen bleibt.")
d.save()
```

Für ein Deck ohne `Deck` `build_webstuhl.py` kopieren. Die Bausteine:

| Datei | wofür |
|---|---|
| `design_lib.py` | Palette, Maße, Hintergrundbild, XML-Helfer, **Design-ID + Version** |
| `build_design.py` | Master, Theme, Layouts — hier wird das Aussehen geändert |
| `deck_util.py` | Platzhalter füllen, Bilder einpassen, **Klick-Aufbau** (Fade, ein Klick pro Bullet) |
| `slides.py` | `Deck` — eine Methode je Folienart, misst Titel- und Textlängen, legt die Auftaktfolie an |
| `omml.py` | **LaTeX → echte PowerPoint-Formeln**, `MathDeck` mit formeltauglicher Höhenmessung |
| `tables.py` | native PowerPoint-Tabellen, `text_width_pt` zum Messen |
| `extract_morning.py` | die Motive der Auftaktfolie aus `Stift.pptx` nach `img/morning/` holen |
| `diagrams.py` | eigene Schaubilder in der Deck-Palette (Pillow) |
| `stamp.py` | den unsichtbaren Design-Stempel lesen/schreiben |
| `restyle.py` | gestempelte Decks finden und das Design nachziehen |
| `check_pptx.py` | Paketprüfung, bevor PowerPoint meckert |

## Formeln

`$…$` in einem Bullet wird zu einer **echten, in PowerPoint bearbeitbaren Formel** —
kein Bild. `deck_util.set_runs` leitet jeden Text mit `$` an `omml.py` weiter, das gilt
also für alle Decks, nicht nur für Mathematik.

```python
d.bullets("Weg-Zeit-Gesetz", [
    ("Gegeben $s = \\dfrac{a}{2}\\,t^2$, gesucht $t$", 0),
    ("Wurzel ziehen: $t = \\sqrt{\\dfrac{2s}{a}}$", 0),
])
```

Unterstützt: `\frac \dfrac \sqrt \sqrt[n] ^ _ \left \right \text \mathrm
\mathbb \vec \begin{pmatrix}` und Geschwister, griechische Buchstaben und die
üblichen Relations- und Rechenzeichen. Unbekanntes wird angezeigt statt zu krachen.

**Die Falle, die eine Folie leert:** ein blankes `<a14:m><m:oMath>` lässt jeden
Renderer außer PowerPoint den **kompletten Textkörper** weg — keine Fehlermeldung,
die Folie ist einfach leer. Deshalb schreibt `omath()` immer
`<mc:AlternateContent>` mit einem lesbaren Text-Fallback, genau wie PowerPoint selbst.
Den Fallback baut `math_plain()`; er ist es, was QuickLook, Keynote und die
SharePoint-Vorschau anzeigen.

## Die Auftaktfolie

Jedes Deck beginnt mit dem Layout **„Begrüßung"**: Motiv randlos links, Gruß in
Raleway Light, Zitat, unser Footer hell auf dunklem Grund. `Deck.__init__` legt sie
automatisch an (`greeting=False` schaltet ab); Skripte ohne `Deck` rufen
`slides.add_greeting(prs, LAY, "<dateiname>.pptx")`.

Die Motive liegen in `img/morning/` und sind **fremdes Material** — sie gehören nicht
in dieses öffentliche Repo. `extract_morning.py` holt sie jederzeit aus `Stift.pptx`
zurück. Welches Deck welches Motiv trägt, steht in `morning-zuordnung.json`; zum
Tauschen die Zeile ändern und neu bauen.

## Design ändern und nachziehen

Das ist der eigentliche Zweck. Beispiel: „docalvers.de soll in den Footer."

```sh
# 1. eine Zeile in design_lib.py: FOOTER_TEXT = "... · docalvers.de"
#    und TEMPLATE_VERSION hochzählen
python3 build_design.py

# 2. schauen, welche Decks das Design tragen
python3 restyle.py --scan ~/Desktop ~/Library/CloudStorage/OneDrive-*/UNTERRICHT

# 3. nachziehen (legt .bak-Sicherungen an)
python3 restyle.py --apply ~/Desktop/webstuhl-algorithmus.pptx \
                   --template out/informatik-vorlage.pptx
```

`--apply` tauscht Master, Layouts, Theme und die Design-Bilder aus; Folien, Text,
Bilder und Animationen bleiben. `--dry-run` zeigt nur, was passieren würde.

**Grenzen, die man kennen muss:**

- Inhalt in **Platzhaltern** zieht mit. Frei auf eine Folie gesetzte Textfelder nicht —
  die haben ihre eigenen Koordinaten.
- Layouts nur **anhängen, nie umsortieren**. Folien zeigen per Nummer auf ihr Layout;
  eine Umsortierung hängt sie an das falsche. `restyle.py` bricht ab, wenn ein Deck ein
  Layout benutzt, das die Vorlage nicht hat.
- Vorlage und Deck müssen dieselbe **Foliengröße** haben (hier 16:9, 960 × 540 pt).

## Fallen, die hier schon eingebaut sind

- **Nur ein `<p:bg>` pro Master.** Ein zweites lässt PowerPoint „Reparieren?" fragen.
- **Bullets: Arial `▪` (U+25AA) zeichnet PowerPoint nicht** — unsichtbar, ohne Fehler.
  Deshalb Wingdings `n`. Orbitron hat fast keine Sonderzeichen (kein `·`, kein `▪`).
- **`spcBef` immer schreiben, auch mit 0**, sonst erbt die Folie den Master-Abstand
  und der Text läuft aus der Box.
- **Wikimedia Commons** verweigert erfundene Thumbnail-Größen und den Standard-User-Agent
  von `urllib` — `fetch_images.py` nimmt die URL, die die API zurückgibt.
- **Keine geraden Anführungszeichen in deutschen Zitaten.** `„wie rechne ich das"`
  beendet den Python-String — die schließende Form ist `“`. Kostet sonst einen
  Syntaxfehler je Vorkommen; und ein pauschales Regex darüber frisst echte
  String-Begrenzer mit. Nach jeder solchen Änderung `python3 -m py_compile build_*.py`.
- **Überschriften messen lassen:** `Deck` warnt, wenn ein Titel breiter als der
  Satzspiegel (816 pt) wird oder der Text aus der Box läuft. Die Warnungen ernst nehmen.
- Vor dem Ausliefern `python3 check_pptx.py out/*.pptx` laufen lassen.
- **Eine Folie ansehen, ohne PowerPoint zu öffnen:** `qlmanage -t -s 1600 -o <ordner>
  deck.pptx` rendert **Folie 1**. Für eine andere Folie ein Wegwerf-Deck bauen, das
  genau diese Folie als erste hat. QuickLook zeigt allerdings den Formel-Fallback,
  nicht das OMML — echte Formeln sieht man nur in PowerPoint.

## Bildnachweise

`fetch_images.py` lädt aus Wikimedia Commons; die Nachweise stehen auch klein unter
jedem Bild im Deck:

| Datei | Bild | Lizenz |
|---|---|---|
| `loom.jpg` | Jacquard-Webstuhl, National Museum of Scotland | Stephencdickson, **CC BY-SA 4.0** |
| `cards.jpg` | Lochkartenkette | Robert-brook, **CC0** |
| `portrait.jpg` | gewebtes Jacquard-Porträt (1839) | gemeinfrei |
| `punchcard.png` | IBM-Lochkarte | gemeinfrei |
| `ada.jpg` | Ada Lovelace | gemeinfrei |

`out/` und `img/` sind git-ignoriert — erzeugte Decks und geladene Bilder gehören
nicht ins Repo.
