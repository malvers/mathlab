#!/usr/bin/env python3
"""Programmierumgebung und Datentypen - erste Schritte in Python (Woche 13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("python-umgebung-datentypen.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Werkstatt und Werkstoff",
        "Programmierumgebung, Variablen und Datentypen in Python")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Werkstatt", "Vier Werkzeuge, und wozu jedes gut ist")

d.table_top("Was in einer Programmierumgebung steckt", [
    ["Werkzeug", "Aufgabe", "was ihr davon habt"],
    ["Editor", "Programmtext schreiben", "Farben, Einrückhilfe, Fehler schon beim Tippen"],
    ["Interpreter", "Zeile für Zeile ausführen", "das Programm läuft"],
    ["Konsole (REPL)", "einzelne Zeilen sofort testen", "ausprobieren ohne Datei"],
    ["Debugger", "Schritt für Schritt anhalten", "sehen, was die Variablen gerade enthalten"],
], [160, 240, 416], [
    ("Wir arbeiten mit **Thonny** (schlank, mit sichtbaren Variablen) oder **VS Code**", 0),
    ("Eine Programmdatei endet auf **.py** und ist reiner **Text** — kein Word-Dokument", 0),
    ("Der **Debugger** ist das unterschätzteste Werkzeug: er beantwortet „warum tut es das?“", 0),
], font_size=11.5, bold_cols=(0,))

code("Das erste Programm", [
    "# hallo.py - ausfuehren mit F5",
    "print('Hallo FOS 12!')",
    "",
    "name = input('Wie heisst du? ')",
    "print('Guten Morgen,', name)",
    "",
    "# Die Konsole zeigt:",
    "#   Hallo FOS 12!",
    "#   Wie heisst du? Lena",
    "#   Guten Morgen, Lena",
], size=14)

d.bullets("Drei Regeln, die Python ernst meint", [
    ("**Einrückung** ist Syntax: vier Leerzeichen, immer gleich viele — nicht Geschmack, sondern Struktur", 0),
    ("**Groß- und Kleinschreibung** zählt: **Name** und **name** sind zwei verschiedene Variablen", 0),
    ("Ein **Doppelpunkt** kündigt einen eingerückten Block an: nach if, else, for, while, def", 0),
    ("Kommentare beginnen mit **#** — sie sind für Menschen, der Interpreter überliest sie", 0),
    ("Fehlermeldungen **von unten nach oben** lesen: die letzte Zeile sagt, was los ist", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Variablen", "Ein Name für einen Platz im Speicher")

d.two_cols("Zuweisung ist keine Gleichung", [
    ("**In der Mathematik**", 0),
    ("x = x + 1 ist eine falsche Aussage", 1),
    ("Das Gleichheitszeichen behauptet etwas", 1),
    ("x steht für einen festen Wert", 1),
], [
    ("**Im Programm**", 0),
    ("x = x + 1 ist ein Befehl", 1),
    ("Rechte Seite ausrechnen, links hineinlegen", 1),
    ("x ist ein Behälter, sein Inhalt ändert sich", 1),
])

code("Was beim Zuweisen passiert", [
    "punkte = 40        # in punkte liegt jetzt 40",
    "punkte = punkte + 12   # rechts 52 ausrechnen, links hineinlegen",
    "print(punkte)      # 52",
    "",
    "a = 3",
    "b = a              # b bekommt eine Kopie des Wertes",
    "a = 99             # b bleibt 3 !",
    "print(a, b)        # 99 3",
], size=13.5)

d.table_top("Namen vergeben — Regeln und guter Stil", [
    ["Regel", "erlaubt", "verboten / schlecht"],
    ["Zeichen", "Buchstaben, Ziffern, _", "Leerzeichen, Umlaute, Bindestrich"],
    ["Anfang", "Buchstabe oder _", "Ziffer: 2note"],
    ["Schlüsselwörter", "note, summe, anzahl", "if, for, class, print"],
    ["Stil", "sprechend: mittelwert", "nichtssagend: x1, aaa, wert2"],
], [190, 290, 336], [
    ("Ein guter Name spart einen Kommentar: **anzahl_schueler** statt **n**", 0),
    ("Python-Konvention: **klein_mit_unterstrich**", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 2): TINT_RED for r in range(1, 5)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Einfache Datentypen", "Vier Sorten Werte — und ihre Fallen")

d.table_top("Die vier Grundtypen", [
    ["Typ", "wofür", "Beispiel", "typische Falle"],
    ["int", "ganze Zahlen", "punkte = 47", "7 / 2 ergibt 3.5, nicht 3"],
    ["float", "Kommazahlen", "note = 2.3", "0.1 + 0.2 ist nicht genau 0.3"],
    ["str", "Text", "name = 'Lena'", "'2' + '3' ergibt '23'"],
    ["bool", "wahr / falsch", "bestanden = True", "True und true sind nicht dasselbe"],
], [90, 190, 240, 296], [
    ("Python kennt den Typ **automatisch** — abfragen mit **type(x)**", 0),
    ("Umwandeln nennt man **Typkonvertierung**: int('42'), str(7), float('2.5')", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(2,), marks={(r, 3): TINT_ORANGE for r in range(1, 5)})

code("Die Falle bei jeder Eingabe", [
    "alter = input('Wie alt bist du? ')   # input liefert IMMER Text!",
    "print(alter + 1)                     # TypeError: can only concatenate str",
    "",
    "alter = int(input('Wie alt bist du? '))   # so ist es richtig",
    "print(alter + 1)                     # 18",
    "",
    "print(7 / 2)    # 3.5   normale Division, immer float",
    "print(7 // 2)   # 3     ganzzahlige Division",
    "print(7 % 2)    # 1     Rest - erkennt gerade/ungerade",
    "print(2 ** 10)  # 1024  Potenz",
], size=12.5)

d.merksatz("input() liefert immer Text. Wer damit rechnen will, muss ihn erst "
           "mit int() oder float() umwandeln.")

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Strukturierte Typen", "Wenn ein Wert nicht mehr reicht")

d.table_top("Vier Behälter für viele Werte", [
    ["Typ", "Schreibweise", "Eigenschaft", "wofür in unseren Aufgaben"],
    ["Liste", "noten = [2, 1, 3]", "geordnet, änderbar", "Messreihen, Namen, Punkte"],
    ["Tupel", "punkt = (3, 7)", "geordnet, unveränderlich", "Koordinaten, feste Paare"],
    ["Dictionary", "d = {'Lena': 2}", "Schlüssel → Wert", "Zuordnungen wie Name → Note"],
    ["Menge", "m = {1, 2, 3}", "ohne Reihenfolge, ohne Doppelte", "Doppelte entfernen"],
], [120, 210, 220, 266], [
    ("**Index ab 0**: noten[0] ist die erste Note, noten[-1] die letzte", 0),
    ("Länge mit **len()**, anhängen mit **.append()**", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

code("Listen in Aktion", [
    "noten = [2, 1, 3, 2, 4]",
    "print(len(noten))        # 5",
    "print(noten[0], noten[-1])   # 2 4",
    "",
    "noten.append(1)          # ans Ende anhaengen",
    "print(sum(noten) / len(noten))   # Mittelwert: 2.1666...",
    "print(round(sum(noten) / len(noten), 2))   # 2.17",
    "",
    "print(min(noten), max(noten), sorted(noten))",
    "# 1 4 [1, 1, 2, 2, 3, 4]",
], size=13)

d.bullets("Fun Facts: Datentypen", [
    ("**0.1 + 0.2 == 0.3** ist in fast jeder Sprache **False** — Kommazahlen werden binär gespeichert und passen nicht genau", 0),
    ("Deshalb rechnen Banken mit **Ganzzahlen in Cent**, nicht mit float", 0),
    ("Der **Ariane-5**-Absturz 1996 (370 Mio. $) entstand, weil eine 64-Bit-Kommazahl in 16 Bit gequetscht wurde", 0),
    ("Python-Ganzzahlen haben **keine Obergrenze** — 2**1000 rechnet es klaglos aus", 0),
    ("Das Wort **Bug** für Programmfehler ist älter als der Computer: Edison benutzte es 1878 für Störungen in Geräten", 0),
])

d.bullets("Eure Aufgabe: Notenrechner, Stufe 1", [
    ("Programm **noten.py**: fragt fünf Punktzahlen ab und speichert sie in einer **Liste**", 0),
    ("Gebt **Summe**, **Mittelwert** (auf 2 Stellen gerundet), **Minimum** und **Maximum** aus", 0),
    ("Achtet auf die **Typkonvertierung** bei jeder Eingabe", 0),
    ("Testet mit 0, 0, 0, 0, 0 und mit 100, 100, 100, 100, 100 — kommt Sinnvolles heraus?", 0),
    ("Zusatz: Lasst euch mit **type()** zu jedem Wert den Typ ausgeben und erklärt das Ergebnis", 0),
])

d.save()
