#!/usr/bin/env python3
"""Puffer / Programmieruebung zum Jahresausklang (Woche 17, nur Mo/Di)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("programmieruebung-jahresausklang.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Programmierübung",
        "Jahresausklang: alles zusammen, was wir bisher können")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Standortbestimmung", "Was sitzt schon — und was noch nicht?")

d.table_top("Selbstcheck: das könnt ihr seit November", [
    ["Thema", "Ich kann …", "Woche", "sitzt"],
    ["Folge", "ein EVA-Programm schreiben und testen", "14", "______"],
    ["Datentypen", "input umwandeln, mit // und % rechnen", "13", "______"],
    ["Auswahl", "if / elif / else mit zusammengesetzter Bedingung", "15", "______"],
    ["Zählschleife", "for mit range und über eine Liste", "16", "______"],
    ["Bedingte Schleife", "while mit sicherer Abbruchbedingung", "16", "______"],
    ["Muster", "Zähler, Summierer, Extremwert, Sucher", "16", "______"],
], [160, 340, 100, 100], [
    ("Kreuzt ehrlich an — die Lücken von heute sind die Klausurfehler im Februar", 0),
    ("Zu jedem offenen Kästchen findet ihr unten eine passende Aufgabe", 0),
], font_size=11.5, bold_cols=(0,), align="lllc")

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Aufwärmen", "Drei Programme, die sofort etwas zeigen")

code("Aufgabe 1 — der Weihnachtsbaum", [
    "hoehe = int(input('Wie hoch? '))",
    "",
    "for i in range(1, hoehe + 1):",
    "    print(' ' * (hoehe - i) + '*' * (2 * i - 1))",
    "",
    "print(' ' * (hoehe - 1) + '|')",
    "",
    "#     *          hoehe = 4",
    "#    ***",
    "#   *****",
    "#  *******",
    "#     |",
], size=13)

d.bullets("Was in diesen vier Zeilen steckt", [
    ("**Zählschleife** mit berechneten Grenzen — range(1, hoehe + 1)", 0),
    ("**Zeichenketten multiplizieren**: '*' * 5 ergibt '*****'", 0),
    ("Ein kleiner **Zusammenhang zwischen i und der Breite**: 2·i − 1 ist immer ungerade", 0),
    ("Die Leerzeichen davor sind die **Gegenrechnung** — zusammen ergibt es die Mitte", 0),
    ("Probiert es aus: Was passiert bei hoehe = 1? Bei hoehe = 0?", 0),
])

code("Aufgabe 2 — FizzBuzz, der Klassiker", [
    "# 1 bis 100: durch 3 teilbar -> Fizz, durch 5 -> Buzz, durch beide -> FizzBuzz",
    "",
    "for i in range(1, 101):",
    "    if i % 3 == 0 and i % 5 == 0:",
    "        print('FizzBuzz')",
    "    elif i % 3 == 0:",
    "        print('Fizz')",
    "    elif i % 5 == 0:",
    "        print('Buzz')",
    "    else:",
    "        print(i)",
    "",
    "# Die Reihenfolge der Bedingungen ist hier die ganze Aufgabe.",
], size=12.5)

code("Aufgabe 3 — der Countdown mit Abbruch", [
    "import time",
    "",
    "sekunden = int(input('Countdown ab: '))",
    "",
    "while sekunden > 0:",
    "    print(sekunden)",
    "    sekunden = sekunden - 1",
    "    time.sleep(1)",
    "",
    "print('Frohe Weihnachten!')",
    "",
    "# Frage: Was passiert, wenn die Zeile mit sekunden - 1 fehlt?",
], size=13)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Fehler suchen", "Debuggen ist eine eigene Fertigkeit")

code("Drei Fehler stecken in diesem Programm", [
    "# Mittelwert von fuenf Noten - findet die Fehler!",
    "",
    "summe = 0",
    "",
    "for i in range(5):",
    "    note = input('Note: ')",
    "    summe = note",
    "",
    "mittel = summe / 6",
    "",
    "print('Mittelwert:', mittel)",
], size=13.5)

d.table_top("Auflösung", [
    ["Zeile", "Fehler", "Fehlerart", "Korrektur"],
    ["note = input(...)", "Text statt Zahl", "Laufzeitfehler (TypeError)", "int(input(...))"],
    ["summe = note", "überschreibt statt addiert", "Logikfehler", "summe = summe + note"],
    ["summe / 6", "durch 6 statt durch 5", "Logikfehler", "summe / 5"],
], [190, 200, 220, 206], [
    ("Der **erste** Fehler meldet sich laut — die beiden anderen **schweigen** und liefern Unsinn", 0),
    ("Werkzeug dagegen: **Testfall mit bekanntem Ergebnis**, z. B. fünfmal die Note 2 → Mittelwert 2.0", 0),
    ("Zweites Werkzeug: **print()** an der verdächtigen Stelle — oder den Debugger Schritt für Schritt", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0, 3),
   marks={(1, 2): TINT_ORANGE, (2, 2): TINT_RED, (3, 2): TINT_RED})

d.bullets("Vorgehen beim Fehlersuchen", [
    ("**Lest die Fehlermeldung** — die letzte Zeile sagt, was, die vorletzte, wo", 0),
    ("**Halbiert das Problem**: an welcher Stelle stimmen die Werte noch?", 0),
    ("**Gebt Zwischenwerte aus** — print(summe) in der Schleife zeigt sofort, was passiert", 0),
    ("**Rechnet den Testfall von Hand** — wer das Ergebnis nicht kennt, sucht ins Blaue", 0),
    ("**Erklärt den Code laut** einem Mitschüler; sehr oft findet man den Fehler beim Erzählen", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Zum Knobeln", "Aufgaben für die Ferien — freiwillig, aber lohnend")

d.table_top("Aufgabenkatalog", [
    ["Aufgabe", "worum es geht", "braucht", "Stufe"],
    ["Primzahltest", "Zahl einlesen, prüfen, ob prim", "Schleife + Modulo", "leicht"],
    ["Quersumme", "Ziffern einer Zahl addieren", "while, // und %", "leicht"],
    ["Passwortprüfer", "Länge, Ziffer, Großbuchstabe prüfen", "Schleife + Bedingungen", "mittel"],
    ["Würfelstatistik", "1000 Würfe zählen und auswerten", "random + Liste", "mittel"],
    ["Zahlenraten mit KI", "der Rechner rät in max. 7 Schritten", "Intervallhalbierung", "schwer"],
], [180, 260, 200, 116], [
    ("Alle Aufgaben lassen sich mit dem lösen, was wir haben — **keine** neuen Sprachmittel nötig", 0),
    ("Bringt eure Lösungen im Januar mit: wir schauen sie uns im **Codereview** gemeinsam an", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 3): TINT_GREEN, (2, 3): TINT_GREEN, (3, 3): TINT_ORANGE, (4, 3): TINT_ORANGE,
          (5, 3): TINT_RED})

d.bullets("Fun Facts zum Jahresausklang", [
    ("**FizzBuzz** ist seit 2007 die berühmteste Bewerbungsfrage der Branche — und siebt erstaunlich viele aus", 0),
    ("Weil 31 **oktal** = 25 **dezimal** ist, gilt unter Informatikern: **Oct 31 == Dec 25**", 0),
    ("Der **Advent of Code** läuft jeden Dezember: 25 Aufgaben, jeden Tag eine, weltweit über 300.000 Teilnehmende", 0),
    ("Das erste Computerspiel der Welt, **Tennis for Two** (1958), lief auf einem Analogrechner mit Oszilloskop", 0),
])

d.bullets("Wie es weitergeht", [
    ("**Woche 18**: Modularisierung — große Probleme in kleine Funktionen zerlegen", 0),
    ("**Woche 19**: Komplexübung, die ganze Kette Problem → Struktogramm → Programm → Test", 0),
    ("**Wochen 20/21**: Wahlbereich objektorientierte Programmierung", 0),
    ("**Woche 22**: Wiederholung und **Klausur 2** über LB 2 und OOP", 0),
    ("Schöne Ferien — und wer mag, knobelt weiter!", 0),
])

d.save()
