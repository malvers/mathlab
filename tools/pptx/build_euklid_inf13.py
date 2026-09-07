#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 6 / KW 39: Ausgewaehlte Algorithmen I -
Euklidischer Algorithmus und Iteration (LB 3, Ustd. 13-14/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm

d = Deck("euklid-iteration.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Der euklidische Algorithmus",
        "Der älteste Algorithmus der Welt — und wie man iterativ denkt")

d.chapter(1, "Die Idee", "Größter gemeinsamer Teiler ohne Probieren")

d.bullets("Der Einfall", [
    ("Gesucht ist der **größte gemeinsame Teiler** zweier Zahlen, kurz ggT", 0),
    ("Naiv: alle Zahlen von 1 bis zur kleineren durchprobieren — das dauert", 0),
    ("Euklid: **jeder gemeinsame Teiler von a und b teilt auch a − b**", 0),
    ("Also darf man die größere Zahl durch die Differenz ersetzen, ohne den ggT zu ändern", 0),
    ("Moderne Fassung: statt zu subtrahieren nimmt man den **Rest der Division**", 0),
])

d.table_top("ggT(48, 18) von Hand", [
    ["Schritt", "a", "b", "a mod b"],
    ["1", "48", "18", "12"],
    ["2", "18", "12", "6"],
    ["3", "12", "6", "0"],
    ["Ergebnis", "", "6", "der letzte Rest ungleich null"],
], [140, 150, 150, 376], [
    ("Man ersetzt **a durch b** und **b durch den Rest** — bis der Rest null ist", 0),
    ("Dann steht der ggT in **b**. Drei Schritte statt achtzehn Versuche", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 2): TINT_GREEN})

code("Der Algorithmus in Python", [
    "def ggt(a, b):",
    "    while b != 0:",
    "        a, b = b, a % b     # gleichzeitige Zuweisung",
    "    return a",
    "",
    "print(ggt(48, 18))          # 6",
    "print(ggt(1071, 462))       # 21",
], size=14)

d.chapter(2, "Iterativ denken", "Vom Einzelfall zur Schleife")

sg = struktogramm(P("sg-euklid-inf13.png"), [
    ("do", "a, b einlesen"),
    ("while", "solange b ungleich 0", [
        ("do", "rest = a mod b"),
        ("do", "a = b"),
        ("do", "b = rest"),
    ]),
    ("do", "Ausgabe: a"),
], W=760, size=25)
d.picture_bullets("Der Algorithmus als Struktogramm", sg, [
    ("Der **Rumpf** verändert a und b — deshalb endet die Schleife", 0),
    ("Der Rest wird bei jedem Durchlauf **kleiner** und ist nie negativ", 0),
    ("Damit ist bewiesen: der Algorithmus **terminiert** immer", 0),
    ("Genau diese Begründung verlangt eine Klausuraufgabe", 0),
], pic_w=400)

d.table_top("Iterative Lösungen systematisch entwickeln", [
    ["Schritt", "Frage"],
    ["1. Zustand", "Welche Variablen beschreiben den Zwischenstand?"],
    ["2. Startwert", "Womit beginnen sie?"],
    ["3. Schritt", "Wie kommt man vom Zustand zum nächsten?"],
    ["4. Abbruch", "Wann ist man fertig?"],
    ["5. Ergebnis", "Wo steht die Antwort am Ende?"],
], [180, 636], [
    ("Beim Euklid: Zustand (a, b), Start die Eingaben, Schritt der Rest, Abbruch b = 0, Ergebnis a", 0),
    ("Diese fünf Fragen tragen **jede** iterative Aufgabe", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

d.chapter(3, "Üben", "Drei iterative Klassiker")

code("Drei Aufgaben zum Selbstbauen", [
    "# 1. Fakultaet iterativ",
    "def fakultaet(n):",
    "    ergebnis = 1",
    "    for i in range(2, n + 1):",
    "        ergebnis = ergebnis * i",
    "    return ergebnis",
    "",
    "# 2. Quersumme  -> selbst schreiben",
    "# 3. kgV mit Hilfe des ggT: a * b // ggt(a, b)",
], size=13)

d.merksatz("Beim Euklid wird der Rest bei jedem Schritt kleiner und nie negativ. "
           "Deshalb endet er — das ist die Begründung, nicht das Gefühl.")

d.bullets("Fun Facts: Euklid", [
    ("Der Algorithmus steht in **Euklids Elementen**, um 300 v. Chr. — er ist über 2300 Jahre alt", 0),
    ("Er gilt als der **älteste noch benutzte** Algorithmus der Welt", 0),
    ("Der schlechteste Fall sind **aufeinanderfolgende Fibonacci-Zahlen**", 0),
    ("Die Anzahl der Schritte wächst nur **logarithmisch** mit der Größe der Zahlen", 0),
    ("Deshalb rechnet er auch mit tausendstelligen Zahlen in Sekundenbruchteilen", 0),
])

d.bullets("Eure Aufgabe", [
    ("Rechnet **ggT(1071, 462)** von Hand in einer Tabelle nach", 0),
    ("Setzt den Algorithmus in Python um und prüft ihn an fünf Paaren", 0),
    ("Schreibt die **Quersumme** iterativ — mit den fünf Fragen aus Kapitel 2", 0),
    ("Berechnet das **kgV** mit Hilfe eures ggT", 0),
    ("Begründet in zwei Sätzen, **warum** der Euklid immer endet", 0),
])

d.save()
