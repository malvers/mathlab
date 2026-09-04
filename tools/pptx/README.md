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
Bild rechts · Bild links**. Alles Sichtbare steckt im Master bzw. in den Layouts —
nichts wird pro Folie gepatcht.

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

Für ein neues Deck `build_webstuhl.py` kopieren, Inhalte ersetzen. Die Bausteine:

| Datei | wofür |
|---|---|
| `design_lib.py` | Palette, Maße, Hintergrundbild, XML-Helfer, **Design-ID + Version** |
| `build_design.py` | Master, Theme, Layouts — hier wird das Aussehen geändert |
| `deck_util.py` | Platzhalter füllen, Bilder einpassen, **Klick-Aufbau** (Fade, ein Klick pro Bullet) |
| `diagrams.py` | eigene Schaubilder in der Deck-Palette (Pillow) |
| `stamp.py` | den unsichtbaren Design-Stempel lesen/schreiben |
| `restyle.py` | gestempelte Decks finden und das Design nachziehen |
| `check_pptx.py` | Paketprüfung, bevor PowerPoint meckert |

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
- Vor dem Ausliefern `python3 check_pptx.py out/*.pptx` laufen lassen.

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
