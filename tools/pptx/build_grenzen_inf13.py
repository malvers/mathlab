#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 10 / KW 45: Grenzen der Algorithmierbarkeit
(LB 3, Ustd. 21-22/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("grenzen-algorithmierbarkeit.pptx")
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Wo Algorithmen aufhören",
        "Nicht berechenbar, nicht in vernünftiger Zeit, nicht genau genug")

d.chapter(1, "Drei Arten von Grenzen", "Prinzipiell, zeitlich, numerisch")

d.table_top("Die drei Grenzen", [
    ["Grenze", "heißt", "Beispiel"],
    ["prinzipiell", "es gibt beweisbar keinen Algorithmus", "Halteproblem"],
    ["zeitlich", "es gibt einen, aber er dauert zu lange", "alle Rundreisen prüfen"],
    ["numerisch", "der Rechner kann die Zahl nicht genau darstellen", "0.1 + 0.2"],
], [160, 350, 306], [
    ("Nur die erste ist **endgültig** — die zweite verschiebt sich mit schnelleren Rechnern", 0),
    ("Die dritte ist die, die im Alltag am häufigsten zuschlägt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_RED, (2, 0): TINT_ORANGE, (3, 0): TINT_BLUE})

d.chapter(2, "Das Halteproblem", "Anschaulich, ohne Beweisformalismus")

d.bullets("Die Frage", [
    ("Gibt es ein Programm **H**, das für jedes Programm P und jede Eingabe E entscheidet, "
     "ob P mit E jemals anhält?", 0),
    ("Das wäre nützlich: kein Endlosschleifen-Absturz mehr", 0),
    ("**Alan Turing** bewies 1936: ein solches H kann es **nicht** geben", 0),
    ("Der Beweis führt die Annahme zum Widerspruch — mit einem Selbstbezug", 0),
    ("Es ist also keine Frage der Rechenleistung, sondern eine **prinzipielle Grenze**", 0),
])

code("Der Widerspruch, in Pseudocode", [
    "# Annahme: haelt_an(P, E) existiert und ist immer richtig",
    "",
    "def gemein(P):",
    "    if haelt_an(P, P):",
    "        while True:        # dann laufe ewig",
    "            pass",
    "    else:",
    "        return             # sonst halte an",
    "",
    "# Und nun: was macht gemein(gemein)?",
], size=13)

d.bullets("Der Widerspruch aufgelöst", [
    ("Hält **gemein(gemein)** an, dann läuft es laut Definition ewig", 0),
    ("Läuft es ewig, dann hält es laut Definition an", 0),
    ("Beides ist unmöglich — also war die **Annahme** falsch", 0),
    ("Es kann **haelt_an** nicht geben. Punkt", 0),
    ("Praktische Folge: kein Werkzeug kann alle Endlosschleifen im Voraus finden", 0),
])

d.chapter(3, "Numerische Grenzen", "Die Grenze, die täglich zuschlägt")

code("Zwei Zeilen, die jeden überraschen", [
    "print(0.1 + 0.2)          # 0.30000000000000004",
    "print(0.1 + 0.2 == 0.3)   # False",
    "",
    "# Grund: 0.1 ist im Binaersystem eine unendliche Zahl,",
    "# genau wie 1/3 im Dezimalsystem.",
    "",
    "# richtig vergleichen:",
    "print(abs((0.1 + 0.2) - 0.3) < 1e-9)   # True",
], size=13)

d.table_top("Numerische Fallen", [
    ["Falle", "was passiert", "Gegenmittel"],
    ["Rundungsfehler", "Nachkommastellen sind ungenau", "mit Toleranz vergleichen"],
    ["Auslöschung", "Differenz fast gleicher Zahlen verliert Stellen", "Formel umstellen"],
    ["Überlauf", "das Ergebnis passt nicht in den Datentyp", "größeren Typ wählen"],
    ["Geld in float", "Cent-Beträge werden ungenau", "in Cent als Ganzzahl rechnen"],
], [180, 350, 286], [
    ("Python hat **beliebig große Ganzzahlen** — der Überlauf trifft dort nur Gleitkommazahlen", 0),
    ("In C, Java und auf Mikrocontrollern ist der **Integer-Überlauf** ein echtes Problem", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

d.merksatz("Nicht jede Frage hat einen Algorithmus. Und nicht jeder Algorithmus "
           "liefert in vernünftiger Zeit ein genaues Ergebnis.")

d.bullets("Fun Facts: Grenzen", [
    ("**Turing** war 24, als er 1936 das Halteproblem löste — vor dem ersten gebauten Computer", 0),
    ("Die **Ariane 5** explodierte 1996 nach 37 Sekunden wegen eines Zahlenüberlaufs", 0),
    ("Ein **Patriot-Flugabwehrsystem** verfehlte 1991 sein Ziel wegen aufsummierter Rundungsfehler", 0),
    ("Das **Problem des Handlungsreisenden** mit 20 Städten hat über 60 Billiarden Rundreisen", 0),
    ("Deshalb sucht man dort **gute** Lösungen statt der besten — das nennt man Heuristik", 0),
])

d.bullets("Eure Aufgabe", [
    ("Probiert **0.1 + 0.2** aus und erklärt das Ergebnis in drei Sätzen", 0),
    ("Schreibt einen **richtigen** Gleitkommavergleich mit Toleranz", 0),
    ("Rechnet aus, wie viele Rundreisen es bei **10** Städten gibt", 0),
    ("Erklärt in eigenen Worten, warum es **haelt_an** nicht geben kann", 0),
    ("Ordnet fünf Beispiele vom Arbeitsblatt einer der **drei Grenzen** zu", 0),
])

d.save()
