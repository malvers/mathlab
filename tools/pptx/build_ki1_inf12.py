#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 35 / KW 18: Wahlbereich Kuenstliche Intelligenz I -
Teilgebiete und Methoden (WB, Ustd. 1-2/4)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ki-teilgebiete-methoden.pptx")

d.title("Informatik — Grundkurs 12", "Künstliche Intelligenz",
        "Teilgebiete und Methoden — Suchen, Planen, Optimieren, Schließen, Lernen")

d.chapter(1, "Was KI meint", "Ein Sammelbegriff, kein Verfahren")

d.bullets("Eine brauchbare Arbeitsdefinition", [
    ("**KI** ist der Sammelbegriff für Verfahren, die Aufgaben lösen, für die man beim Menschen "
     "Intelligenz voraussetzt", 0),
    ("Der Begriff verschiebt sich: was funktioniert, heißt bald **nur noch Software**", 0),
    ("Das nennt man den **KI-Effekt** — Schach galt einst als Prüfstein für Intelligenz", 0),
    ("Wichtiger als die Definition ist die Frage: **welches Verfahren** steckt dahinter?", 0),
    ("Denn die Verfahren sind sehr verschieden — und haben verschiedene Grenzen", 0),
])

d.table_top("Teilgebiete", [
    ["Teilgebiet", "beschäftigt sich mit", "Beispiel"],
    ["Wissensrepräsentation", "Wissen so speichern, dass man darauf schließen kann", "Ontologien"],
    ["Suchen und Planen", "Wege zu einem Ziel finden", "Routenplaner, Spiele"],
    ["Maschinelles Lernen", "Muster aus Beispielen ableiten", "Bilderkennung"],
    ["Sprachverarbeitung", "Texte verstehen und erzeugen", "Übersetzung"],
    ["Bildverarbeitung", "aus Pixeln Bedeutung gewinnen", "Gesichtserkennung"],
    ["Robotik", "wahrnehmen und handeln in der Welt", "autonome Fahrzeuge"],
], [200, 380, 236], [
    ("Die ersten beiden heißen **symbolische** KI, die anderen arbeiten meist **statistisch**", 0),
], font_size=10.5, bold_cols=(0,))

d.chapter(2, "Vier Methoden", "Wie KI-Verfahren arbeiten")

d.table_top("Suchen, Planen, Optimieren, Schließen", [
    ["Methode", "Idee", "Beispiel"],
    ["Suchen", "Zustandsraum durchsuchen, bewerten, auswählen", "Schach, Navigation"],
    ["Planen", "Folge von Handlungen zu einem Ziel finden", "Roboterarm, Logistik"],
    ["Optimieren", "unter vielen Lösungen die beste finden", "Stundenplan, Routen"],
    ["Logisches Schließen", "aus Fakten und Regeln Neues ableiten", "Diagnosesysteme"],
], [180, 380, 256], [
    ("Diese vier kommen **ohne Trainingsdaten** aus — sie brauchen ein Modell der Welt", 0),
    ("**Maschinelles Lernen** ist die fünfte: es leitet die Regeln aus Beispielen ab", 0),
], font_size=10.5, bold_cols=(0,), marks={(r, 0): TINT_BLUE for r in range(1, 5)})

d.bullets("Der entscheidende Unterschied", [
    ("**Symbolische Verfahren** kennen Regeln — man kann sie **lesen und begründen**", 0),
    ("**Lernende Verfahren** kennen nur Muster — die Begründung fehlt", 0),
    ("Ein Routenplaner kann sagen, **warum** diese Strecke: sie ist kürzer", 0),
    ("Ein Bildklassifikator kann das nicht — er sagt nur: **zu 93 % eine Katze**", 0),
    ("Deshalb ist die **Erklärbarkeit** ein eigenes Forschungsfeld geworden", 0),
])

d.chapter(3, "Das Experiment", "Ein Modell selbst trainieren")

d.table_top("Der Versuchsaufbau", [
    ["Schritt", "was ihr tut", "worauf achten"],
    ["1. Klassen wählen", "zwei bis drei unterscheidbare Dinge", "nicht zu ähnlich"],
    ["2. Beispiele sammeln", "je 50 Bilder über die Kamera", "gleich viele je Klasse"],
    ["3. Trainieren", "einen Knopf drücken", "dauert Sekunden"],
    ["4. Testen", "zehn Versuche, Trefferquote notieren", "auch mit fremden Objekten"],
    ["5. Austricksen", "Hintergrund, Licht, Person wechseln", "das ist das Ergebnis"],
], [180, 350, 286], [
    ("Schritt 5 ist der eigentliche Erkenntnisgewinn — **wo** und **warum** versagt das Modell?", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 0): TINT_ORANGE})

d.merksatz("Symbolische Verfahren kennen Regeln und können sie begründen. "
           "Lernende Verfahren kennen nur Muster — und antworten trotzdem immer.")

d.bullets("Fun Facts: KI", [
    ("Der Begriff entstand **1956** auf der Dartmouth-Konferenz — als Antrag auf Forschungsgeld", 0),
    ("**Deep Blue** schlug 1997 Kasparow — mit Suchen und Bewerten, nicht mit Lernen", 0),
    ("**AlphaGo** gewann 2016 in Go — dort half reines Durchsuchen nicht mehr", 0),
    ("Zwischen den Wellen lagen zwei **KI-Winter**: Erwartungen weit über den Ergebnissen", 0),
    ("Der **KI-Effekt**: „Sobald es funktioniert, nennt es niemand mehr KI“", 0),
])

d.bullets("Eure Aufgabe", [
    ("Ordnet **acht Anwendungen** vom Arbeitsblatt einem Teilgebiet und einer Methode zu", 0),
    ("Trainiert zu zweit ein Modell mit **zwei Klassen**", 0),
    ("Notiert die **Trefferquote** aus zehn Versuchen", 0),
    ("Findet **zwei Wege**, das Modell zu täuschen, und erklärt sie", 0),
    ("Schreibt auf: **Welche Frage kann euer Modell nicht beantworten?**", 0),
])

d.save()
