#!/usr/bin/env python3
"""Das Lehrbuch Mathe BGY 11 - what is in it and what it cost (0,49 EUR).

Doc, 09.10.2026: "Mach mir aus dem Inhalt vom PDF noch ein Deck. Es gibt jetzt auch eine Titelseite vom
Mathebuch, das muss da auch rein." - the PDF was ~/Desktop/lehrbuch-mathe11-kosten.pdf (the usage screenshots
before/after, the chapter list, the cost calculation). The cover is shot from buch/mathe11/index.html at 2x
into tools/pptx/img/lehrbuch-mathe11-titel.png. Only HTML:

    python3 tools/pptx/html_deck.py build_lehrbuch_mathe11.py

Initial only - after the first build HTML/decks/mathe11-lehrbuch.html is the source.
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from omml import MathDeck
from mathe11_lehrbuch_svg import svg

COVER = os.path.join(HERE, "img", "lehrbuch-mathe11-titel.png")

d = MathDeck("mathe11-lehrbuch.pptx")

d.title("Mathematik · Berufliches Gymnasium 11",
        "Lehrbuch Mathe BGY 11",
        "Ein ganzes Lehrbuch in einem Rutsch — und was es gekostet hat")
d.summary("Titel: Lehrbuch Mathe BGY 11, ein ganzes interaktives Lehrbuch in einem Rutsch, Kosten 0,49 Euro")

d.picture_bullets("Das Lehrbuch", COVER, [
    ("**11 Kapitel** plus Inhaltsseite", 0),
    ("**179 Aufgaben** mit Tipp und Lösung", 0),
    ("**192 Selbsttests** mit sofortiger Rückmeldung", 0),
    ("**24 Widgets** zum Ausprobieren", 0),
], pic_w=250)
d.summary("Titelseite des Buchs; 11 Kapitel plus Inhaltsseite, 179 Aufgaben mit Tipp und Lösung, "
          "192 Selbsttests mit sofortiger Rückmeldung, 24 interaktive Widgets")

d.table_top("Die Kapitel", [
    ["Kapitel", "Inhalt", "Exkursion"],
    ["2", "Gleichungen, Formeln, Figuren", "Diophantos’ Grabrätsel"],
    ["3.1", "Funktionen und Eigenschaften", "Kurven, die keine Funktionen sind"],
    ["3.2", "Wachstum und Zerfall", "Fibonacci"],
    ["3.3", "Quadratische Funktionen und Gleichungen", "Galileis Fallrinne"],
    ["3.4", "Sinusfunktionen", "Fourier und Klänge"],
    ["3.5", "Regression", "Anscombe-Quartett"],
    ["3.6", "Umkehrfunktion und Logarithmus", "Benford"],
    ["3.7", "Graphen und Parameter", "Projekt Achterbahn"],
    ["4", "Gleichungssysteme und Matrizen", "PageRank"],
    ["1", "Wahrscheinlichkeit", "Ziegenproblem"],
    ["W", "Numerik und Simulation", "Hilberts Hotel"],
], [90, 390, 336], [("In der Reihenfolge des **Stoffverteilungsplans**", 0)], font_size=13, bold_cols=(0,))
d.summary("Kapitel in Reihenfolge des Stoffverteilungsplans: 2 Gleichungen, 3.1 Funktionen, 3.2 Wachstum, "
          "3.3 Quadratische Funktionen, 3.4 Sinus, 3.5 Regression, 3.6 Umkehrfunktion und Logarithmus, "
          "3.7 Graphen und Parameter, 4 Gleichungssysteme und Matrizen, 1 Wahrscheinlichkeit, W Numerik; "
          "je eine Exkursion (Diophantos, Fibonacci, Galilei, Fourier, Anscombe, Benford, PageRank, Ziegenproblem, Hilberts Hotel)")

d.bullets("Zum Ausprobieren", [
    ("**24 Widgets** im Buch, zum Beispiel", 0),
    ("Umformungs-Trainer, Parabel-Werkstatt, Einheitskreis", 1),
    ("Regressions-Labor, Gauß-Werkstatt, Bisektion", 1),
    ("Rund **25 Labs** von docalvers.de verlinkt", 0),
    ("Alle passenden **mathetest11**-Quizze", 0),
])
d.summary("24 Widgets (Umformungs-Trainer, Parabel-Werkstatt, Einheitskreis, Regressions-Labor, Gauß-Werkstatt, "
          "Bisektion), rund 25 Labs von docalvers.de, alle passenden mathetest11-Quizze")

fig, labels = svg("usage")
d.figure("Vorher und nachher", fig, labels)
d.summary("Wochenlimit vor dem Buch 37 Prozent (08:36 Uhr), danach 39 Prozent (10:04 Uhr): das ganze Lehrbuch = 2 Prozent")

fig, labels = svg("rechnung")
d.figure("Was hat das gekostet?", fig, labels)
d.summary("107 Euro im Monat : 4,33 Wochen ≈ 24,71 Euro pro Woche; 2 Prozent davon ≈ 0,49 Euro für das ganze Buch")

d.bullets("Einordnung", [
    ("Ein **Anteil an der Pauschale**, keine Zusatzkosten", 0),
    ("Die **107 €** im Monat fallen ohnehin an", 0),
    ("Genau **0,49 €** nur, wenn jede Woche das **ganze Limit** ausgeschöpft wird", 0),
])
d.summary("0,49 Euro sind ein Anteil an der Pauschale, keine Zusatzkosten; die 107 Euro fallen ohnehin an")

d.merksatz("Ein ganzes Lehrbuch — 11 Kapitel, 179 Aufgaben, 24 Widgets — für **<m1>0,49 €</m1>**.", label="Fazit")
d.summary("Fazit: ein ganzes Lehrbuch mit 11 Kapiteln, 179 Aufgaben und 24 Widgets für 0,49 Euro")

d.lab("Das Buch live", "buch/mathe11/index.html", note="docalvers.de/buch/mathe11")
d.summary("Das Buch live: docalvers.de/buch/mathe11")

d.save()
