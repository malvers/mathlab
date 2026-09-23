#!/usr/bin/env python3
"""Das Zahlensystem der Babylonier - rebuilt from Doc's .pptx as an HTML deck, in German.

    python3 tools/pptx/html_deck.py build_babylonier.py   # -> HTML/decks/zahlensystem-babylonier.html

The original slides were English ("Why has a circle 360 degrees?"); Doc asked for German
(23.09.2026). Figures are inline SVG with HTML labels (rule 23), babylon_svg.py. The
photographs come from Wikimedia Commons with author and licence, never from the .pptx - those
were Google Maps screenshots. The twin deck is build_maya.py, and the two are meant to be
taught one after the other: Maya has a zero, Babylon does not.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
import babylon_svg as F
import zahlsystem_bilder as B

d = Deck("zahlensystem-babylonier.pptx")


def kapitel(num, titel, unter, bild):
    """A chapter divider with a Commons photograph - the licence line comes with the picture."""
    text, url = B.quelle(bild)
    d.chapter(num, titel, unter, image=B.pfad(bild), credit=text, credit_url=url)


d.title("Mathematik — Zahlensysteme", "Das Zahlensystem der Babylonier",
        "Keil und Winkelhaken · Basis 60 · und unsere Uhr")

# ------------------------------------------------------------- Kapitel 01 ---
d.chapter(1, "Drei Fragen zum Anfang", "Die Antwort ist jedes Mal dieselbe")

d.bullets("Warum eigentlich?", [
    ("Warum hat ein **Kreis** $360°$?", 0),
    ("Warum hat eine **Stunde** 60 Minuten?", 0),
    ("Warum hat eine **Minute** 60 Sekunden?", 0),
    ("Warum hat ein **Jahr** 12 Monate und ein **Tag** 24 Stunden?", 0),
    ("Alles Zufall? Nein — alles **eine** Antwort, und sie ist 5000 Jahre alt", 0),
])
d.summary("Einstieg mit vier Fragen: warum hat der Kreis 360 Grad, die Stunde 60 Minuten, die "
          "Minute 60 Sekunden, das Jahr 12 Monate und der Tag 24 Stunden? Alle vier haben "
          "dieselbe Antwort: die Babylonier rechneten zur Basis 60.")

d.figure("Was ist an der 60 so besonders?", *F.teiler())
d.summary("60 = 2^2·3·5 hat zwölf Teiler: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60. Ein Drittel, "
          "Viertel, Fünftel und Sechstel gehen ohne Rest auf. Zum Vergleich: 10 hat nur vier "
          "Teiler, 12 hat sechs.")

d.figure("60 ist die kleinste ihrer Art", *F.teilervergleich())
d.summary("Vergleich der Teileranzahl: 60, 72, 84, 90, 96 und 108 haben je zwölf Teiler, 120 hat "
          "sechzehn. 60 ist die kleinste Zahl mit zwölf Teilern — klein und trotzdem gut teilbar.")

d.bullets("Warum Teiler so wichtig waren", [
    ("Die Babylonier hatten **keine Kommazahlen** wie wir", 0),
    ("Wer teilen musste, brauchte eine Basis, die **ohne Rest** aufgeht", 0),
    ("Mit 60 gelingen $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\frac{1}{5}, \\frac{1}{6}$ "
     "— mit 10 nur $\\frac{1}{2}$ und $\\frac{1}{5}$", 0),
    ("Beim Handel, beim Bauen, beim Verteilen von Getreide zählt genau das", 0),
    ("Die Wahl der Basis ist also **keine Marotte**, sondern ein Werkzeug", 0),
])
d.summary("Warum Teilbarkeit zählte: die Babylonier hatten keine Dezimalbrüche. Mit Basis 60 "
          "gehen 1/2, 1/3, 1/4, 1/5, 1/6 ohne Rest auf, mit Basis 10 nur 1/2 und 1/5. Wichtig "
          "beim Handel, Bauen und Verteilen.")

d.figure("Und daher kommt das Gradmaß", *F.kreis())
d.summary("Sechs gleichseitige Dreiecke passen genau in einen Kreis, jedes mit 60 Grad: "
          "6·60 = 360 Grad. Der Radius lässt sich sechsmal auf dem Kreisrand abtragen — mit "
          "einer Schnur nachprüfbar.")

d.merksatz("**60** ist klein genug zum Zählen und teilbar genug zum Rechnen. Diese Mischung "
           "gibt es bei keiner kleineren Zahl.")

# ------------------------------------------------------------- Kapitel 02 ---
kapitel(2, "Woher es kommt", "Sumer und Babylon, vor rund 5000 Jahren", "bab-ruinen")

d.figure("Das Zweistromland", *F.zweistromland())
d.summary("Sumer und Babylonien lagen zwischen Euphrat und Tigris, im heutigen Irak. Babylon "
          "liegt etwa 90 km südlich von Bagdad; weiter südlich Ur und Basra. Hier entstand vor "
          "5000 Jahren die Keilschrift.")

d.picture_bullets("Das Ischtar-Tor — heute in Berlin", B.pfad("bab-ischtar"), [
    ("Babylon war um 600 v. Chr. vielleicht die **größte Stadt der Welt**", 0),
    ("Das **Ischtar-Tor** stand am Eingang der Prozessionsstraße", 0),
    ("Ausgegraben und nach Berlin gebracht: es steht im **Pergamonmuseum**", 0),
    ("Wer in Berlin davorsteht, steht vor der Kultur, die unsere Uhr erfunden hat", 0),
    (B.credit("bab-ischtar"), 1),
], pic_w=330, side="right")
d.summary("Das Ischtar-Tor aus Babylon steht heute im Pergamonmuseum Berlin. Babylon war um "
          "600 v. Chr. vielleicht die größte Stadt der Welt.")

d.picture_bullets("Geschrieben wurde in Ton", B.pfad("bab-plimpton"), [
    ("Ein Griffel wurde in **weichen Ton** gedrückt — daher die Keilform", 0),
    ("Die Tafel wurde getrocknet oder gebrannt und war dann **haltbar**", 0),
    ("Diese hier — **Plimpton 322** — ist eine **Tabelle rechtwinkliger Dreiecke**", 0),
    ("Sie ist rund **3800 Jahre** alt, älter als Pythagoras", 0),
    (B.credit("bab-plimpton"), 1),
], pic_w=380, side="right")
d.summary("Geschrieben wurde mit einem Griffel in weichen Ton, daher die Keilform. Die Tafel "
          "Plimpton 322 ist rund 3800 Jahre alt und enthält eine Tabelle rechtwinkliger "
          "Dreiecke — lange vor Pythagoras.")

# ------------------------------------------------------------- Kapitel 03 ---
d.chapter(3, "Erst unser eigenes System", "Damit der Vergleich etwas hat, worauf er steht")

d.figure("Das Zehnersystem", *F.dezimal_beispiel())
d.summary("Unser System: zehn Ziffern 0–9, Stellenwerte 10^2=100, 10^1=10, 10^0=1. "
          "327 = 3·100 + 2·10 + 7·1 = 300+20+7. Genau so ist das babylonische System gebaut, "
          "nur mit 60 statt 10.")

d.bullets("Was ein Stellenwertsystem ausmacht", [
    ("Es gibt eine feste Zahl von **Ziffern** — bei uns zehn", 0),
    ("Der Wert einer Ziffer hängt davon ab, **wo** sie steht", 0),
    ("Jede Stelle ist um die **Basis** wertvoller als ihre rechte Nachbarin", 0),
    ("Eine **Null** hält leere Stellen frei", 0),
    ("Genau diesen letzten Punkt hatten die Babylonier **nicht**", 0),
])
d.summary("Ein Stellenwertsystem braucht: feste Ziffernmenge, Wert nach Position, jede Stelle "
          "mal die Basis, und eine Null für leere Stellen. Den letzten Punkt hatten die "
          "Babylonier nicht.")

# ------------------------------------------------------------- Kapitel 04 ---
kapitel(4, "Das babylonische System", "Zwei Zeichen, 59 Ziffern, Basis 60", "bab-plimpton")

d.figure("Zwei Zeichen, mehr nicht", *F.zeichen())
d.summary("Die Keilschrift kennt für Zahlen nur zwei Zeichen: den senkrechten Keil für 1 und "
          "den Winkelhaken für 10. Beide mit demselben Griffel, einmal gerade, einmal schräg.")

d.figure("Die 59 Ziffern", *F.ziffern())
d.summary("Die Ziffern 1 bis 59 werden aus Winkelhaken (je 10) und Keilen (je 1) "
          "zusammengesetzt, zum Beispiel 22 = zwei Winkelhaken und zwei Keile. Eine Null gibt "
          "es nicht.")

d.bullets("Ein System im System", [
    ("**Innerhalb** einer Ziffer wird **zehnerweise** gezählt: bis zu 5 Haken, bis zu 9 Keile", 0),
    ("**Zwischen** den Stellen wird **sechzigerweise** gezählt", 0),
    ("Man nennt das ein **gemischtes** System — 10 im Kleinen, 60 im Großen", 0),
    ("Bei 59 ist eine Stelle voll, ab 60 beginnt die nächste", 0),
    ("Unsere Uhr macht es genauso: 59 Sekunden, dann eine Minute", 0),
])
d.summary("Gemischtes System: innerhalb einer Ziffer zehnerweise (bis 5 Winkelhaken und 9 "
          "Keile), zwischen den Stellen sechzigerweise. Bei 59 ist die Stelle voll. Unsere Uhr "
          "macht es genauso.")

d.figure("Ein kleines Beispiel", *F.klein_beispiel())
d.summary("Kleines Beispiel: ein Keil in der 60er-Stelle und ein Winkelhaken in der Einerstelle "
          "ergeben 1·60 + 1·10 = 70.")

d.figure("Und ein größeres", *F.stellen60())
d.summary("Größeres Beispiel: die Ziffern 10, 11, 22 ergeben 10·3600 + 11·60 + 22·1 = "
          "36000 + 660 + 22 = 36682.")

d.figure("Die Lücke im System", *F.keine_null())
d.summary("Ohne Null ist dasselbe Zeichen mehrdeutig: ein einzelner Keil kann 1, 60 oder 3600 "
          "bedeuten. Welche Stelle gemeint war, musste aus dem Zusammenhang kommen. Erst spät "
          "kam ein Trennzeichen für leere Stellen dazu, nie am Ende einer Zahl.")

d.bullets("Warum das ein Problem ist", [
    ("Ein einzelner Keil kann **1**, **60** oder **3600** heißen", 0),
    ("Im Text half der Zusammenhang: 3 Schafe oder 3 Krüge Öl sind unterschiedlich groß", 0),
    ("Beim reinen **Rechnen** aber wird es gefährlich", 0),
    ("Die **Maya** hatten die Null — die Babylonier nicht", 0),
    ("Unsere **0** kam über Indien und die Araber, erst um 1200 nach Europa", 0),
])
d.summary("Ohne Null: ein Keil kann 1, 60 oder 3600 sein; im Text half der Zusammenhang, beim "
          "Rechnen nicht. Die Maya hatten eine Null, die Babylonier nicht. Unsere Null kam über "
          "Indien und die Araber um 1200 nach Europa.")

# ------------------------------------------------------------- Kapitel 05 ---
d.chapter(5, "Das Erbe", "Was davon heute noch auf deinem Handgelenk sitzt")

d.figure("Babylonisch, bis heute", *F.erbe())
d.summary("Babylonisches Erbe: 360 Grad im Kreis (6·60), 60 Minuten je Stunde, 60 Sekunden je "
          "Minute, 12 Monate und 24 Stunden (2·12). Das Jahr hatte 360 Tage, die fünf übrigen "
          "zählten zwischen den Jahren.")

d.picture_bullets("Sie rechneten damit richtig gut", B.pfad("bab-ybc"), [
    ("Diese Tafel gibt $\\sqrt{2}$ an — auf **sechs Stellen** genau", 0),
    ("In babylonischer Schreibweise: $1; 24, 51, 10$ zur Basis 60", 0),
    ("Das sind $1 + \\frac{24}{60} + \\frac{51}{3600} + \\frac{10}{216000} \\approx 1{,}414213$", 0),
    ("Der wahre Wert ist $1{,}4142135\\ldots$ — Abweichung erst in der **siebten** Stelle", 0),
    (B.credit("bab-ybc"), 1),
], pic_w=300, side="left")
d.summary("Die Tafel YBC 7289 gibt die Wurzel aus 2 als 1;24,51,10 zur Basis 60 an, das sind "
          "etwa 1,414213 — der wahre Wert ist 1,4142135, die Abweichung beginnt erst in der "
          "siebten Stelle.")

d.table_top("Zum Nachschlagen", [
    ["Begriff", "in einem Satz"],
    ["Basis", "die Zahl, mit der jede Stelle wächst — hier 60"],
    ["Sexagesimalsystem", "das Zahlensystem zur Basis 60"],
    ["Keil", "der senkrechte Keil zählt 1"],
    ["Winkelhaken", "der schräge Haken zählt 10"],
    ["Ziffern", "1 bis 59 — eine Null gibt es nicht"],
    ["Stellenwerte", "1, 60, 3600, 216000"],
    ["gemischtes System", "innerhalb der Ziffer 10, zwischen den Stellen 60"],
    ["Keilschrift", "Zeichen, mit dem Griffel in weichen Ton gedrückt"],
    ["Plimpton 322", "Tontafel mit rechtwinkligen Dreiecken, rund 3800 Jahre alt"],
], [210, 606], None, font_size=10.5, row_h=18, bold_cols=(0,))

d.bullets("Die beiden Systeme nebeneinander", [
    ("**Maya**: Basis 20, drei Zeichen, **mit** Null, Stellen übereinander", 0),
    ("**Babylon**: Basis 60, zwei Zeichen, **ohne** Null, Stellen nebeneinander", 0),
    ("Beide sind echte **Stellenwertsysteme** — lange vor unserem", 0),
    ("Beide entstanden aus einem **praktischen** Bedürfnis: Kalender und Handel", 0),
    ("Und beide zeigen: die **10** ist nichts Natürliches, nur eine Gewohnheit", 0),
])
d.summary("Vergleich: Maya haben Basis 20, drei Zeichen, eine Null und schreiben untereinander; "
          "Babylon hat Basis 60, zwei Zeichen, keine Null und schreibt nebeneinander. Beide sind "
          "echte Stellenwertsysteme, entstanden aus Kalender und Handel.")

d.merksatz("Jedes Mal, wenn du auf die Uhr siehst, rechnest du **babylonisch**. "
           "Fünftausend Jahre, und niemand hat es abgeschafft.")

d.save()
