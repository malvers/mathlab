#!/usr/bin/env python3
"""Adds demo slides that show the design system in action (content is placeholder material)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import ORANGE, GREEN, MUTED, BODY, CODE_INK, FONT_M
from deck_util import save_deck
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "out", "informatik-vorlage.pptx")
dst = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "out", "informatik-design.pptx")
prs = Presentation(src)
LAY = {l.name: l for l in prs.slide_layouts}


def fill_ph(slide, idx, lines):
    """lines: list of (text, level)"""
    tf = slide.placeholders[idx].text_frame
    tf.word_wrap = True
    for i, (text, level) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = text
        p.level = level


# 1 - Titel
s = prs.slides.add_slide(LAY["Titel"])
fill_ph(s, 10, [("Informatik — Jahrgang 11", 0)])
fill_ph(s, 0, [("Daten & Überwachung", 0)])
fill_ph(s, 1, [("Wie viel weiß dein Gerät über dich?", 0)])

# 2 - Kapitel
s = prs.slides.add_slide(LAY["Kapitel"])
fill_ph(s, 10, [("Kapitel 01", 0)])
fill_ph(s, 0, [("Spurensuche im eigenen Gerät", 0)])
fill_ph(s, 1, [("Browserverlauf, Cookies, Standortverlauf — was liegt da eigentlich?", 0)])

# 3 - Inhalt
s = prs.slides.add_slide(LAY["Inhalt"])
s.shapes.title.text_frame.text = "Was das Gerät über dich speichert"
fill_ph(s, 1, [
    ("Browserverlauf, Cookies, Standortverlauf im eigenen Gerät ansehen", 0),
    ("Chrome: Einstellungen → Datenschutz → Verlauf", 1),
    ("Wie sammeln KI-Systeme Daten? Empfehlungsalgorithmen (YouTube/TikTok)", 0),
    ("Klick, Verweildauer, Abbruch — jede Reaktion ist ein Signal", 1),
    ("Kurzdiskussion: Nutzen vs. Überwachung — erste Positionierung", 0),
])

# 4 - Zwei Spalten
s = prs.slides.add_slide(LAY["Zwei Spalten"])
s.shapes.title.text_frame.text = "Nutzen vs. Überwachung"
fill_ph(s, 1, [("Nutzen", 0),
               ("Passende Vorschläge ohne langes Suchen", 1),
               ("Karten, Routen und Wetter am richtigen Ort", 1),
               ("Kostenlose Dienste ohne Rechnung", 1)])
fill_ph(s, 2, [("Preis", 0),
               ("Profile, die genauer sind als das Selbstbild", 1),
               ("Daten überleben den Anlass ihrer Erhebung", 1),
               ("Wer misst, kann auch lenken", 1)])

# 5 - Code
s = prs.slides.add_slide(LAY["Code"])
s.shapes.title.text_frame.text = "Was der Browser von sich aus verrät"
CODE = [
    [("// jede Zeile ist ein Datenpunkt über dich", GREEN)],
    [("", CODE_INK)],
    [("const", ORANGE), (" spuren = {", CODE_INK)],
    [("  sprache:  ", CODE_INK), ("navigator", ORANGE), (".language,", CODE_INK)],
    [("  zeitzone: ", CODE_INK), ("Intl", ORANGE), (".DateTimeFormat().resolvedOptions().timeZone,", CODE_INK)],
    [("  schirm:   ", CODE_INK), ("screen", ORANGE), (".width + ", CODE_INK), ('" x "', GREEN), (" + ", CODE_INK), ("screen", ORANGE), (".height,", CODE_INK)],
    [("  cookies:  ", CODE_INK), ("document", ORANGE), (".cookie.split(", CODE_INK), ('"; "', GREEN), (").length,", CODE_INK)],
    [("};", CODE_INK)],
    [("", CODE_INK)],
    [("console", ORANGE), (".table(spuren);", CODE_INK)],
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

# 6 - Merksatz
s = prs.slides.add_slide(LAY["Merksatz"])
fill_ph(s, 1, [("Jede Empfehlung ist eine Messung — und jede Messung hinterlässt eine Spur.", 0)])
fill_ph(s, 2, [("Merksatz", 0)])

save_deck(prs, dst)
print("demo written:", dst, len(prs.slides.__iter__.__self__._sldIdLst), "slides")
