#!/usr/bin/env python3
"""Vom Webstuhl zum Algorithmus - Informatik-Deck auf dem hellen Design-Template."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import ORANGE, GREEN, RED, CODE_INK, FONT_M, MARGIN, BODY_Y, CONTENT_W, W
from slides import add_greeting
from deck_util import (fill_ph, drop_ph, fill_picture, fit_picture, add_click_build, save_deck)
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
prs = Presentation(os.path.join(HERE, "out", "informatik-vorlage.pptx"))
LAY = {l.name: l for l in prs.slide_layouts}
add = lambda name: prs.slides.add_slide(LAY[name])

add_greeting(prs, LAY, "webstuhl-algorithmus.pptx")   # Auftaktfolie als Folie 0

CC_LOOM = "Foto: Stephencdickson, CC BY-SA 4.0, Wikimedia Commons"
CC_CARDS = "Foto: Robert-brook, CC0, Wikimedia Commons"
CC_PD = "Wikimedia Commons, gemeinfrei"
CC_OWN = "eigene Darstellung"


def content(layout, title, lines, kicker=None, sub=None):
    s = add(layout)
    if title:
        s.shapes.title.text_frame.text = title
    if kicker:
        fill_ph(s, 10, [(kicker, 0)])
    body = fill_ph(s, 1, lines) if lines else None
    return s, body


# 1 - Titel
s = add("Titel")
fill_ph(s, 10, [("Informatik — Jahrgang 9", 0)])
fill_ph(s, 0, [("Vom Webstuhl zum Algorithmus", 0)])
fill_ph(s, 1, [("Wie Maschinen programmierbar wurden — und wie sie heute dich lesen", 0)])

# 2 - Kapitel 01
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 01", 0)])
s.shapes.title.text_frame.text = "Der Jacquard-Webstuhl"
fill_ph(s, 1, [("Lyon, 1805: die erste Maschine, die ihr Programm einliest", 0)])

# 3 - Webstuhl (Foto)
L3 = [("**Jacquard**, Lyon 1804/05: Webstuhl liest sein Muster von **Lochkarten**", 0),
      ("**Loch** = Faden hoch, **kein Loch** = Faden unten", 0),
      ("Neues Muster = neuer **Kartenstapel**, Maschine bleibt gleich", 0),
      ("Erstmals getrennt: **Maschine** und **Programm**", 0)]
s, body = content("Bild rechts", "Die erste programmierbare Maschine", L3)
fill_picture(s, 2, os.path.join(IMG, "loom.jpg"))
fill_ph(s, 11, [(CC_LOOM, 0)])
add_click_build(s, [(body, L3)])

# 4 - Lochkarten (Foto)
L4 = [("Karten als **Endlosschleife** vernäht, laufen im Takt", 0),
      ("Aufwendiges Muster: **Tausende Karten**, von Hand gestanzt", 0),
      ("Fehler in der Karte = Fehler im Stoff: **Debugging** mit Nadel und Faden", 0),
      ("Kein Rechnen, kein Verzweigen: **programmierbar** ist noch kein **Computer**", 0)]
s, body = content("Bild links", "Das Programm besteht aus Pappe", L4)
fill_picture(s, 2, os.path.join(IMG, "cards.jpg"))
fill_ph(s, 11, [(CC_CARDS, 0)])
add_click_build(s, [(body, L4)])

# 5 - Gewebtes Porträt (Fun Fact)
L5 = [("1839: gewebtes **Porträt Jacquards** aus rund **24.000 Lochkarten**", 0),
      ("**Gewebt, nicht gedruckt**: jede Bildzeile steckt in einer Karte", 0),
      ("**Charles Babbage** zeigte sein Exemplar als Kuriosität", 0),
      ("Fun Fact: das erste **Bild aus Daten**, 150 Jahre vor dem **JPEG**", 0)]
s, body = content("Bild links", "24.000 Karten für ein einziges Bild", L5)
fit_picture(s, 2, os.path.join(IMG, "portrait.jpg"))
fill_ph(s, 11, [(CC_PD, 0)])
add_click_build(s, [(body, L5)])

# 6 - Merksatz Lovelace
s = add("Merksatz")
fill_ph(s, 1, [("Die Analytical Engine webt algebraische Muster, so wie der Jacquard-Webstuhl Blumen und Blätter webt.", 0)])
fill_ph(s, 2, [("Ada Lovelace, 1843", 0)])

# 7 - Hollerith / IBM
L7 = [("**Herman Hollerith**, 1890: Lochkarte für die **US-Volkszählung**", 0),
      ("Aus seiner Firma wird **IBM**; Lochkarte bis in die 1970er Standard", 0),
      ("Erst **Muster** gesteuert, dann **Menschen** gezählt", 0),
      ("Unsere Frage: **Wer sammelt was über wen?**", 0)]
s, body = content("Bild rechts", "Von der Karte zur Volkszählung", L7)
# the card is very wide - crop a squarer piece so it fills the frame
from PIL import Image as _IMG
_c = _IMG.open(os.path.join(IMG, "punchcard.png"))
_c.crop((0, 0, int(_c.height * 1.31), _c.height)).save(os.path.join(IMG, "punchcard-crop.png"))
fill_picture(s, 2, os.path.join(IMG, "punchcard-crop.png"))
fill_ph(s, 11, [(CC_PD, 0)])
add_click_build(s, [(body, L7)])

# 8 - Kapitel 02
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 02", 0)])
s.shapes.title.text_frame.text = "Deine Spuren im eigenen Gerät"
fill_ph(s, 1, [("Browserverlauf, Cookies, Standortverlauf — selbst nachsehen", 0)])

# 9 - Selbst nachsehen
L9 = [("**Browserverlauf**: Chrome Cmd + Y (Mac) bzw. Strg + H (Windows)", 0),
      ("Wie weit zurück? Wie viele Einträge von heute?", 1),
      ("**Cookies**: Einstellungen → Datenschutz und Sicherheit → Websitedaten", 0),
      ("Wie viele Websites? Kennst du alle Namen?", 1),
      ("**Standortverlauf**: Google Maps → Zeitachse; iPhone → Wichtige Orte", 0),
      ("Seit wann? Erkennst du deinen gestrigen Weg?", 1),
      ("Notiert **drei Überraschungen**, die brauchen wir gleich", 0)]
s, body = content("Inhalt", "Selbst nachsehen: zehn Minuten", L9)
add_click_build(s, [(body, L9)])

# 10 - Code
s = add("Code")
s.shapes.title.text_frame.text = "Was die Seite über dich weiß, ohne zu fragen"
CODE = [
    [("// kein Login, kein Cookie - reines Auslesen im Browser", GREEN)],
    [("", CODE_INK)],
    [("const", ORANGE), (" spuren = {", CODE_INK)],
    [("  sprache:  ", CODE_INK), ("navigator", ORANGE), (".language,", CODE_INK)],
    [("  zeitzone: ", CODE_INK), ("Intl", ORANGE), (".DateTimeFormat().resolvedOptions().timeZone,", CODE_INK)],
    [("  schirm:   ", CODE_INK), ("screen", ORANGE), (".width + ", CODE_INK), ('" x "', GREEN), (" + ", CODE_INK), ("screen", ORANGE), (".height,", CODE_INK)],
    [("  kerne:    ", CODE_INK), ("navigator", ORANGE), (".hardwareConcurrency,", CODE_INK)],
    [("  cookies:  ", CODE_INK), ("document", ORANGE), (".cookie.split(", CODE_INK), ('"; "', GREEN), (").length,", CODE_INK)],
    [("};", CODE_INK)],
    [("", CODE_INK)],
    [("console", ORANGE), (".table(spuren);   ", CODE_INK), ("// in der Konsole ausprobieren", GREEN)],
]
tf = s.placeholders[1].text_frame
tf.word_wrap = False
for i, parts in enumerate(CODE):
    p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
    for text, color in parts:
        r = p.add_run()
        r.text = text
        r.font.name = FONT_M
        r.font.size = Pt(13.5)
        r.font.color.rgb = RGBColor.from_string(color)

# 11 - Fun Facts Cookies
L11 = [("**1994, Netscape**: Lou Montulli erfindet es, damit der **Warenkorb** den Seitenwechsel überlebt", 0),
       ("Name vom Unix-**„magic cookie“**: kleines Datenpaket, kommt unverändert zurück", 0),
       ("Erkennt dich nur, solange du es behältst: **Löschen wirkt sofort**", 0),
       ("**Third-Party-Cookies**: Safari und Firefox blockieren, Chrome hat das Aus 2025 abgesagt", 0)]
s, body = content("Inhalt", "Fun Facts: das Cookie", L11)
add_click_build(s, [(body, L11)])

# 12 - Kapitel 03
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 03", 0)])
s.shapes.title.text_frame.text = "Wie KI-Systeme Daten sammeln"
fill_ph(s, 1, [("Empfehlungsalgorithmen bei YouTube und TikTok", 0)])

# 13 - Kreislauf (eigene Grafik)
L13 = [("Mehr als der Klick zählt: **Verweildauer**, Teilen, Wegwischen", 0),
       ("Das **Modell** schätzt, wie lange du bleibst, und sortiert danach", 0),
       ("Auch **Nichts-Tun** ist ein Signal: Wie schnell wischst du weiter?", 0),
       ("Du **trainierst** das System mit, ohne etwas einzutippen", 0)]
s, body = content("Bild rechts", "Der Kreislauf hinter dem Feed", L13)
fill_picture(s, 2, os.path.join(IMG, "loop.png"))
fill_ph(s, 11, [(CC_OWN, 0)])
add_click_build(s, [(body, L13)])

# 14 - Fun Facts Empfehlungen
L14 = [("**YouTube** 2018: über **70 %** der Wiedergabezeit aus Empfehlungen", 0),
       ("**Netflix** 2016: rund **80 %** der gesehenen Titel empfohlen", 0),
       ("**TikTok**-Papier 2021: Score = gewichtete Chancen für Like, Kommentar, Wiedergabezeit", 0),
       ("**Kaltstart**: neue Konten bekommen bewusst Streuung", 0)]
s, body = content("Inhalt", "Fun Facts: Empfehlungen", L14)
add_click_build(s, [(body, L14)])

# 15 - Kapitel 04
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 04", 0)])
s.shapes.title.text_frame.text = "Tracking: Nutzen vs. Überwachung"
fill_ph(s, 1, [("Erste Positionierung — mit Argumenten aus dem eigenen Gerät", 0)])

# 16 - Tracking-Kette (eigene Grafik, breit)
s = add("Inhalt")
s.shapes.title.text_frame.text = "Wie du auf Seite B wiedererkannt wirst"
drop_ph(s, 1)
from PIL import Image as _I
iw, ih = _I.open(os.path.join(IMG, "tracking.png")).size
pw = 700.0
ph_ = pw * ih / iw
s.shapes.add_picture(os.path.join(IMG, "tracking.png"),
                     int((W - pw) / 2 * 12700), int(BODY_Y * 12700),
                     int(pw * 12700), int(ph_ * 12700))

# 17 - Zwei Spalten
s = add("Zwei Spalten")
s.shapes.title.text_frame.text = "Nutzen und Preis"
LL = [("Nutzen", 0),
      ("**Vorschläge** ohne langes Suchen", 1),
      ("**Karten, Routen, Wetter** am richtigen Ort", 1),
      ("Dienste **ohne Rechnung**", 1),
      ("**Betrugserkennung** durch auffällige Muster", 1)]
LR = [("Preis", 0),
      ("**Profile**, genauer als das Selbstbild", 1),
      ("Daten **überleben** den Anlass ihrer Erhebung", 1),
      ("Wer **misst**, kann auch **lenken**", 1),
      ("Du kennst die **Sortier-Regeln** nicht", 1)]
left = fill_ph(s, 1, LL)
right = fill_ph(s, 2, LR)
add_click_build(s, [(left, LL), (right, LR)])

# 18 - Merksatz
s = add("Merksatz")
fill_ph(s, 1, [("Jede Empfehlung ist eine Messung — und jede Messung hinterlässt eine Spur.", 0)])
fill_ph(s, 2, [("Merksatz", 0)])

# 19 - Positionierung
L19 = [("**Linie**: von „ist mir egal“ bis „das geht zu weit“", 0),
       ("**Ein Beispiel** aus dem eigenen Gerät als Begründung", 0),
       ("**Seite wechseln**, wenn ein Argument überzeugt, und sagen welches", 0),
       ("Zum Schluss: Welche **eine Einstellung** ändert ihr heute noch?", 0)]
s, body = content("Inhalt", "Deine Positionierung", L19)
add_click_build(s, [(body, L19)])

out = os.path.join(HERE, "out", "webstuhl-algorithmus.pptx")
save_deck(prs, out)
print("deck:", out, len(prs.slides._sldIdLst), "Folien")
