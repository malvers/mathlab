#!/usr/bin/env python3
"""Grundstrukturen I: Folge / Sequenz - vom Struktogramm zum Programm (Woche 14)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("grundstruktur-folge.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Grundstruktur I: die Folge",
        "Ein Schritt nach dem anderen — vom Struktogramm zum laufenden Programm")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei reichen", "Der Satz, auf dem die ganze Programmierung steht")

d.table_top("Die drei Grundstrukturen", [
    ["Struktur", "Frage", "Schlüsselwort in Python", "diese Woche"],
    ["Folge", "Was kommt als Nächstes?", "(nichts — Zeile für Zeile)", "ja"],
    ["Auswahl", "Welcher Weg?", "if / elif / else", "Woche 15"],
    ["Wiederholung", "Wie oft?", "for / while", "Woche 16"],
], [160, 250, 240, 166], [
    ("**Böhm & Jacopini bewiesen 1966**: mit diesen drei Strukturen lässt sich **jeder** Algorithmus schreiben", 0),
    ("Kein GOTO, keine Sprünge — das ist der Kern der **strukturierten Programmierung**", 0),
    ("Alles Weitere (Funktionen, Objekte) ist Ordnung und Bequemlichkeit, keine neue Macht", 0),
], font_size=11.5, bold_cols=(0,), marks={(1, c): TINT_GREEN for c in range(4)})

d.bullets("Die Folge — unscheinbar und unverzichtbar", [
    ("Anweisungen stehen **untereinander** und laufen **von oben nach unten**", 0),
    ("Die **Reihenfolge** ist das Entscheidende: erst der Wert, dann die Rechnung damit", 0),
    ("Typischer Fehler: mit einer Variablen rechnen, **bevor** sie einen Wert hat", 0),
    ("Im Struktogramm: Kästen **untereinander**, kein Rahmen, kein Dreieck", 0),
    ("In Python: eine Anweisung pro Zeile, **keine** Einrückung", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "EVA", "Eingabe — Verarbeitung — Ausgabe")

sg = struktogramm(P("sg-eva.png"), [
    ("do", "Eingabe: Spannung U in Volt"),
    ("do", "Eingabe: Stromstärke I in Ampere"),
    ("do", "R = U / I"),
    ("do", "P = U * I"),
    ("do", "Ausgabe: R und P"),
], W=880, size=26, caption="EVA - der Bauplan fast jedes kleinen Programms")
d.picture_bullets("Der Bauplan jedes Programms", sg, [
    ("**E**ingabe: Werte holen — von der Tastatur, aus einer Datei, von einem Sensor", 0),
    ("**V**erarbeitung: rechnen, prüfen, umformen — hier passiert die eigentliche Arbeit", 0),
    ("**A**usgabe: Ergebnis zeigen — Bildschirm, Datei, Anzeige", 0),
    ("Die drei Teile **nicht mischen**: erst alles einlesen, dann rechnen, dann ausgeben", 0),
], pic_w=400)

code("Dasselbe in Python", [
    "# ohm.py - Widerstand und Leistung berechnen",
    "",
    "# E - Eingabe",
    "u = float(input('Spannung U in V: '))",
    "i = float(input('Stromstaerke I in A: '))",
    "",
    "# V - Verarbeitung",
    "r = u / i",
    "p = u * i",
    "",
    "# A - Ausgabe",
    "print('Widerstand R =', r, 'Ohm')",
    "print('Leistung   P =', p, 'W')",
], size=13.5)

d.bullets("Vom Kasten zur Zeile — die Übersetzung", [
    ("Jeder **Kasten** des Struktogramms wird **eine Zeile** Python — in derselben Reihenfolge", 0),
    ("„Eingabe: x“ → **x = float(input('...'))**", 0),
    ("Eine Rechnung → eine **Zuweisung** mit dem Ergebnis links vom Gleichheitszeichen", 0),
    ("„Ausgabe: x“ → **print(x)**", 0),
    ("Deshalb lohnt das Zeichnen: der Code schreibt sich danach fast von allein", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Sauber ausgeben", "Zahlen lesbar machen")

code("f-Strings und runden", [
    "r = 4.666666666666667",
    "",
    "print(r)                       # 4.666666666666667  - unlesbar",
    "print(round(r, 2))             # 4.67",
    "print(f'R = {r:.2f} Ohm')      # R = 4.67 Ohm",
    "print(f'R = {r:8.2f} Ohm')     # R =     4.67 Ohm  (rechtsbuendig)",
    "",
    "name = 'Lena'",
    "punkte = 47",
    "print(f'{name} hat {punkte} von 60 Punkten ({punkte/60:.1%})')",
    "# Lena hat 47 von 60 Punkten (78.3%)",
], size=13)

d.table_top("Rechenzeichen, die man kennen muss", [
    ["Zeichen", "Bedeutung", "Beispiel", "Ergebnis"],
    ["+  -  *", "plus, minus, mal", "3 * 4", "12"],
    ["/", "Division (immer float)", "7 / 2", "3.5"],
    ["//", "ganzzahlige Division", "7 // 2", "3"],
    ["%", "Rest (Modulo)", "7 % 2", "1"],
    ["**", "Potenz", "2 ** 10", "1024"],
], [110, 260, 220, 226], [
    ("**Punkt vor Strich** gilt wie in der Mathematik — Klammern setzen, wenn es eng wird", 0),
    ("**%** ist der heimliche Star: gerade/ungerade, Vielfache, Uhrzeit, Prüfziffern", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(0, 2, 3))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Testen", "Ein Programm, das läuft, ist noch lange nicht richtig")

d.table_top("Testfälle für den Ohm-Rechner", [
    ["Eingabe U", "Eingabe I", "erwartet R", "erwartet P", "Ergebnis"],
    ["12", "2", "6.0", "24.0", "passt"],
    ["230", "0.5", "460.0", "115.0", "passt"],
    ["12", "0", "Fehler", "0.0", "Absturz: ZeroDivisionError"],
    ["zwoelf", "2", "Fehler", "Fehler", "Absturz: ValueError"],
], [140, 140, 150, 150, 236], [
    ("Testfälle werden **vorher** aufgeschrieben — mit dem Ergebnis, das man **erwartet**", 0),
    ("Immer dabei: ein **normaler** Fall, ein **Randfall** (0) und ein **Unsinn**-Fall", 0),
    ("Was das Programm bei Unsinn tun soll, entscheidet ihr — abstürzen ist die schlechteste Antwort", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 4): TINT_GREEN, (2, 4): TINT_GREEN, (3, 4): TINT_RED, (4, 4): TINT_RED})

d.merksatz("Erst den Testfall, dann das Programm. Wer nicht weiß, was herauskommen "
           "soll, merkt nie, dass etwas Falsches herauskommt.")

d.bullets("Fun Facts: die Folge", [
    ("**Böhm und Jacopini** veröffentlichten ihren Beweis 1966 auf Italienisch — die Welt las ihn erst Jahre später", 0),
    ("**EVA** heißt im Englischen **IPO** (Input-Process-Output) und stammt aus der Lochkartenzeit", 0),
    ("Das erste **„Hallo Welt“** stammt von Brian Kernighan, 1972 — heute in über 400 Sprachen nachgebaut", 0),
    ("**Mars Climate Orbiter**, 1999: ein Team rechnete in Pfund, das andere in Newton — 125 Mio. $ verglüht", 0),
    ("Die Reihenfolge zählt: **a, b = b, a** tauscht in Python zwei Werte in **einer** Zeile", 0),
])

d.bullets("Eure Aufgabe: drei kleine EVA-Programme", [
    ("**Kreis**: Radius einlesen, Umfang und Fläche ausgeben, beides auf 2 Stellen gerundet", 0),
    ("**Rabatt**: Preis und Rabatt in Prozent einlesen, Endpreis mit f-String ausgeben", 0),
    ("**Zeit**: eine Sekundenzahl einlesen und als Stunden : Minuten : Sekunden ausgeben (Tipp: // und %)", 0),
    ("Zeichnet zu **jedem** Programm zuerst das Struktogramm, dann tippt ihr", 0),
    ("Schreibt je **drei Testfälle** in eine Tabelle — vor dem ersten Programmstart", 0),
])

d.save()
