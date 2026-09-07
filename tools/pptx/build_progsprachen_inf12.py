#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 32 / KW 15: Programmiersprachen als Schnittstelle
Mensch-Maschine (LB 3, Ustd. 1-2/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("programmiersprachen-grundbegriffe.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Die Schnittstelle Mensch–Maschine",
        "Syntax und Semantik, Compiler und Interpreter — und ein Blick zurück")

d.chapter(1, "Zwei Begriffe", "Syntax und Semantik")

d.table_top("Der Unterschied", [
    ["", "Syntax", "Semantik"],
    ["regelt", "welche Zeichenfolgen erlaubt sind", "was sie bedeuten"],
    ["Vergleich", "Rechtschreibung und Grammatik", "der Sinn des Satzes"],
    ["Fehler heißt", "Syntaxfehler", "Logikfehler"],
    ["fällt auf", "vor dem Start", "erst am falschen Ergebnis"],
], [180, 320, 316], [
    ("„Der Hund fliegt das Fahrrad“ ist syntaktisch korrekt und semantisch Unsinn", 0),
    ("Der Rechner tut, was **dasteht** — nicht, was gemeint war", 0),
], font_size=11, bold_cols=(0,), marks={(4, 2): TINT_RED})

d.bullets("Die drei Fehlerarten", [
    ("**Syntaxfehler**: das Programm startet nicht. Harmlos, weil er sofort auffällt", 0),
    ("**Laufzeitfehler**: das Programm bricht mitten drin ab — Division durch null, fehlende Datei", 0),
    ("**Logikfehler**: es läuft durch und liefert das **falsche** Ergebnis", 0),
    ("Nur der dritte ist gefährlich — ihn findet kein Übersetzer, nur ein **Test**", 0),
    ("Deshalb gehört zu jedem Programm ein Testfall mit **bekanntem Sollwert**", 0),
])

d.chapter(2, "Übersetzen", "Compiler, Interpreter und die Ebenen dazwischen")

dia = pap(P("pap-ebenen-inf12.png"), 1560, 330, {
    "h": dict(pos=(230, 130), w=380, h=120, text="Hochsprache: Python, Java"),
    "a": dict(pos=(780, 130), w=340, h=120, text="Assembler: MOV, ADD"),
    "m": dict(pos=(1330, 130), w=340, h=120, text="Maschinencode: 10110000"),
}, [("h", "a", "übersetzen"), ("a", "m", "assemblieren")], size=28)
d.picture("Von der Hochsprache zur Maschine", dia, [
    ("Jede Ebene nach rechts ist **maschinennäher**, jede nach links **menschennäher**", 0),
    ("Unten steht immer die **CPU** — sie kennt nur Zahlen", 0),
], width=816)

d.table_top("Compiler und Interpreter", [
    ["", "Compiler", "Interpreter"],
    ["übersetzt", "einmal das ganze Programm", "Zeile für Zeile beim Ausführen"],
    ["Ergebnis", "eine ausführbare Datei", "keine Datei, direkte Ausführung"],
    ["Fehler zeigt er", "vor dem Start, alle auf einmal", "wenn die Zeile erreicht wird"],
    ["Geschwindigkeit", "schneller beim Laufen", "langsamer, dafür sofort startbar"],
    ["Beispiel", "C, Java (in Bytecode)", "Python, JavaScript"],
], [180, 320, 316], [
    ("Die Grenze ist unscharf: **Java** übersetzt in Bytecode, den dann eine virtuelle Maschine ausführt", 0),
    ("Moderne Systeme übersetzen zur Laufzeit nach — das heißt **Just-in-Time**", 0),
], font_size=10.5, bold_cols=(0,))

d.chapter(3, "Ein Blick zurück", "Wie die Sprachen wurden, was sie sind")

d.table_top("Meilensteine", [
    ["Jahr", "Sprache", "brachte"],
    ["1957", "Fortran", "die erste verbreitete Hochsprache"],
    ["1959", "COBOL", "Sprache für kaufmännische Anwendungen"],
    ["1972", "C", "systemnah und trotzdem portabel"],
    ["1991", "Python", "Lesbarkeit als Entwurfsziel"],
    ["1995", "Java", "einmal schreiben, überall ausführen"],
], [110, 200, 506], [
    ("**Grace Hopper** entwickelte 1952 den ersten Compiler — und prägte den Gedanken der Hochsprache", 0),
    ("Der Trend über 70 Jahre: **weg von der Maschine, hin zum Menschen**", 0),
], font_size=11, bold_cols=(0,))

code("Dieselbe Rechnung, zwei Ebenen", [
    "# Hochsprache",
    "summe = a + b",
    "",
    "# Assembler (sinngemaess)",
    "# MOV AX, a",
    "# ADD AX, b",
    "# MOV summe, AX",
], size=14)

d.merksatz("Syntax ist die Form, Semantik der Sinn. "
           "Ein Syntaxfehler kostet Minuten, ein Logikfehler kostet Vertrauen.")

d.bullets("Fun Facts: Programmiersprachen", [
    ("**Grace Hopper** schrieb 1952 den ersten Compiler — viele hielten die Idee für unmöglich", 0),
    ("**COBOL** läuft bis heute in Banken — Milliarden Zeilen sind noch im Einsatz", 0),
    ("**Python** ist nach Monty Python benannt, nicht nach der Schlange", 0),
    ("Es gibt über **700** dokumentierte Programmiersprachen — benutzt werden ein paar Dutzend", 0),
    ("Der **Hello-World**-Vergleich ist der älteste Sport der Informatik", 0),
])

d.bullets("Eure Aufgabe", [
    ("Ordnet fünf Fehlermeldungen den **drei Fehlerarten** zu", 0),
    ("Findet je ein Beispiel für einen **syntaktisch korrekten, semantisch falschen** Satz", 0),
    ("Erklärt an einem Beispiel den Unterschied **Compiler und Interpreter**", 0),
    ("Recherchiert **eine** Sprache aus der Zeitleiste: wofür wurde sie gebaut?", 0),
    ("Schreibt drei Sätze: **Warum gibt es überhaupt so viele Sprachen?**", 0),
])

d.save()
