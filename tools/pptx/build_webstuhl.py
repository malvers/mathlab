#!/usr/bin/env python3
"""Vom Webstuhl zum Algorithmus - Informatik-Deck auf dem hellen Design-Template."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import ORANGE, GREEN, RED, CODE_INK, FONT_M, MARGIN, BODY_Y, CONTENT_W, W
from deck_util import (fill_ph, drop_ph, fill_picture, fit_picture, add_click_build, save_deck)
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
prs = Presentation(os.path.join(HERE, "out", "informatik-vorlage.pptx"))
LAY = {l.name: l for l in prs.slide_layouts}
add = lambda name: prs.slides.add_slide(LAY[name])

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
L3 = [("Joseph-Marie Jacquard baut 1804/05 in Lyon einen Webstuhl, der sein Muster von Lochkarten liest", 0),
      ("Loch = Faden wird gehoben, kein Loch = Faden bleibt unten", 0),
      ("Ein neues Muster heißt: neuer Kartenstapel. Die Maschine selbst bleibt unverändert", 0),
      ("Damit trennt Jacquard zum ersten Mal Maschine und Programm", 0)]
s, body = content("Bild rechts", "Die erste programmierbare Maschine", L3)
fill_picture(s, 2, os.path.join(IMG, "loom.jpg"))
fill_ph(s, 11, [(CC_LOOM, 0)])
add_click_build(s, [(body, L3)])

# 4 - Lochkarten (Foto)
L4 = [("Die Karten sind zu einer Endlosschleife vernäht und laufen im Takt durch die Maschine", 0),
      ("Ein aufwendiges Muster braucht Tausende Karten — gestanzt von Hand", 0),
      ("Ein Fehler in einer Karte ist ein Fehler im Stoff: Debugging mit Nadel und Faden", 0),
      ("Rechnen oder verzweigen kann der Webstuhl nicht — programmierbar heißt noch nicht Computer", 0)]
s, body = content("Bild links", "Das Programm besteht aus Pappe", L4)
fill_picture(s, 2, os.path.join(IMG, "cards.jpg"))
fill_ph(s, 11, [(CC_CARDS, 0)])
add_click_build(s, [(body, L4)])

# 5 - Gewebtes Porträt (Fun Fact)
L5 = [("1839 weben Lyoner Seidenweber ein Porträt Jacquards — gesteuert von rund 24.000 Lochkarten", 0),
      ("Das Bild ist gewebt, nicht gedruckt: jede Zeile des Bildes steckt in einer Karte", 0),
      ("Charles Babbage besaß ein Exemplar und zeigte es seinen Gästen als Kuriosität", 0),
      ("Fun Fact: das erste Bild aus Daten hing im Salon — rund 150 Jahre vor dem ersten JPEG", 0)]
s, body = content("Bild links", "24.000 Karten für ein einziges Bild", L5)
fit_picture(s, 2, os.path.join(IMG, "portrait.jpg"))
fill_ph(s, 11, [(CC_PD, 0)])
add_click_build(s, [(body, L5)])

# 6 - Merksatz Lovelace
s = add("Merksatz")
fill_ph(s, 1, [("Die Analytical Engine webt algebraische Muster, so wie der Jacquard-Webstuhl Blumen und Blätter webt.", 0)])
fill_ph(s, 2, [("Ada Lovelace, 1843", 0)])

# 7 - Hollerith / IBM
L7 = [("Herman Hollerith überträgt die Lochkarte 1890 auf die US-Volkszählung", 0),
      ("Aus seiner Firma wird später IBM; die Lochkarte bleibt bis in die 1970er ein Standard-Speicher", 0),
      ("Erst wurden Muster gesteuert, dann Menschen gezählt — dieselbe Technik, neue Frage", 0),
      ("Genau an dieser Stelle beginnt unser Thema: Wer sammelt was über wen?", 0)]
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
L9 = [("Browserverlauf öffnen — Chrome: Cmd + Y (Mac) bzw. Strg + H (Windows)", 0),
      ("Wie weit zurück reicht er? Wie viele Einträge stehen allein von heute darin?", 1),
      ("Cookies ansehen — Einstellungen → Datenschutz und Sicherheit → Cookies und andere Websitedaten", 0),
      ("Wie viele Websites haben Daten gespeichert? Kennst du alle Namen?", 1),
      ("Standortverlauf prüfen — Google Maps → Zeitachse, iPhone → Ortungsdienste → Systemdienste → Wichtige Orte", 0),
      ("Seit wann wird das gespeichert? Erkennst du deinen gestrigen Weg wieder?", 1),
      ("Notiert drei Dinge, die euch überrascht haben — die brauchen wir gleich noch", 0)]
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
L11 = [("Das Cookie entsteht 1994 bei Netscape — Lou Montulli baut es, damit ein Warenkorb den Seitenwechsel überlebt", 0),
       ("Der Name kommt vom „magic cookie“ aus der Unix-Welt: ein kleines Datenpaket, das unverändert zurückkommt", 0),
       ("Ein Cookie erkennt dich nur wieder, solange du es behältst — Löschen wirkt sofort", 0),
       ("Google hat das Aus für Third-Party-Cookies in Chrome mehrfach verschoben und 2025 abgesagt; Safari und Firefox blockieren sie längst", 0)]
s, body = content("Inhalt", "Fun Facts: das Cookie", L11)
add_click_build(s, [(body, L11)])

# 12 - Kapitel 03
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 03", 0)])
s.shapes.title.text_frame.text = "Wie KI-Systeme Daten sammeln"
fill_ph(s, 1, [("Empfehlungsalgorithmen bei YouTube und TikTok", 0)])

# 13 - Kreislauf (eigene Grafik)
L13 = [("Gezählt wird nicht nur der Klick: Verweildauer, erneutes Ansehen, Weiterschicken, Wegwischen", 0),
       ("Das Modell schätzt für jedes Video, wie lange du bleibst — und sortiert danach", 0),
       ("Auch Nichts-Tun ist ein Signal: wie schnell du weiterwischst, sagt oft am meisten", 0),
       ("Du trainierst das System bei jeder Nutzung mit — ohne je etwas einzutippen", 0)]
s, body = content("Bild rechts", "Der Kreislauf hinter dem Feed", L13)
fill_picture(s, 2, os.path.join(IMG, "loop.png"))
fill_ph(s, 11, [(CC_OWN, 0)])
add_click_build(s, [(body, L13)])

# 14 - Fun Facts Empfehlungen
L14 = [("YouTube gab 2018 an, dass über 70 % der Wiedergabezeit aus Empfehlungen stammt", 0),
       ("Netflix nannte 2016 rund 80 % der gesehenen Titel als Ergebnis der Empfehlungen", 0),
       ("Aus einem 2021 an die New York Times gelangten TikTok-Papier: der Score addiert gewichtete Wahrscheinlichkeiten für Like, Kommentar und Wiedergabezeit", 0),
       ("Kaltstart: neuen Konten zeigt das System bewusst Streuung — es sucht erst deine Vorlieben", 0)]
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
      ("Vorschläge, ohne lange zu suchen", 1),
      ("Karten, Routen und Wetter am richtigen Ort", 1),
      ("Dienste ohne Rechnung", 1),
      ("Betrugserkennung: auffällige Muster fallen auf", 1)]
LR = [("Preis", 0),
      ("Profile, die genauer sind als das Selbstbild", 1),
      ("Daten überleben den Anlass ihrer Erhebung", 1),
      ("Wer misst, kann auch lenken", 1),
      ("Du kennst die Regeln nicht, nach denen sortiert wird", 1)]
left = fill_ph(s, 1, LL)
right = fill_ph(s, 2, LR)
add_click_build(s, [(left, LL), (right, LR)])

# 18 - Merksatz
s = add("Merksatz")
fill_ph(s, 1, [("Jede Empfehlung ist eine Messung — und jede Messung hinterlässt eine Spur.", 0)])
fill_ph(s, 2, [("Merksatz", 0)])

# 19 - Positionierung
L19 = [("Stellt euch auf einer Linie auf: von „ist mir egal“ bis „das geht zu weit“", 0),
       ("Begründet euren Platz mit genau einem Beispiel aus eurem eigenen Gerät", 0),
       ("Wechselt die Seite, wenn euch ein Argument überzeugt hat — und sagt, welches es war", 0),
       ("Am Ende: Welche eine Einstellung ändert ihr heute noch?", 0)]
s, body = content("Inhalt", "Deine Positionierung", L19)
add_click_build(s, [(body, L19)])

out = os.path.join(HERE, "out", "webstuhl-algorithmus.pptx")
save_deck(prs, out)
print("deck:", out, len(prs.slides._sldIdLst), "Folien")
