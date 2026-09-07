#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 11 / KW 46: Operationen II - Sortieren und Filtern
(LB 1, Ustd. 9/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("operationen-sortieren-filtern.pptx")

d.title("Informatik — Klasse 9", "Sortieren und Filtern",
        "Aus tausend Zeilen genau die machen, die man sehen will")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Sortieren", "Dieselben Daten, andere Reihenfolge")

d.bullets("Was beim Sortieren passiert", [
    ("Die Datenbank ordnet die **Zeilen** neu — die Daten selbst ändern sich **nicht**", 0),
    ("**Aufsteigend**: A vor Z, klein vor groß, alt vor neu", 0),
    ("**Absteigend**: genau umgekehrt", 0),
    ("Die Sortierung ist nur eine **Ansicht**; die Tabelle bleibt wie sie ist", 0),
    ("Deshalb kann jeder anders sortieren, ohne dem anderen etwas kaputt zu machen", 0),
])

d.table_top("Nach zwei Feldern sortieren", [
    ["Titel", "Verlag", "Jahr"],
    ["Andor", "Kosmos", "2012"],
    ["Catan", "Kosmos", "1995"],
    ["Exit", "Kosmos", "2016"],
    ["Azul", "Next Move", "2017"],
    ["Carcassonne", "Hans im Glück", "2000"],
], [300, 300, 216], [
    ("Sortiert ist zuerst nach **Verlag**, dann innerhalb jedes Verlags nach **Titel**", 0),
    ("Das zweite Feld entscheidet nur, wenn das erste **gleich** ist", 0),
    ("Hier stimmt die Reihenfolge der Verlage noch nicht — findet den Fehler", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(r, 1): TINT_BLUE for r in range(1, 4)} | {(5, 1): TINT_RED})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Filtern", "Zeilen weglassen, die gerade nicht interessieren")

d.table_top("Filterbedingungen, die ihr braucht", [
    ["Bedingung", "findet", "Beispiel"],
    ["ist gleich", "genau diesen Wert", "Verlag = Kosmos"],
    ["ist nicht gleich", "alle anderen", "USK ist nicht 18"],
    ["kleiner / größer", "Zahlen und Datumsangaben", "Jahr < 2000"],
    ["zwischen", "einen Bereich", "Jahr zwischen 2010 und 2020"],
    ["enthält", "Textstücke", "Titel enthält „Exit“"],
    ["ist leer", "fehlende Angaben", "Verlag ist leer"],
], [180, 280, 356], [
    ("Zwei Bedingungen mit **UND**: beide müssen zutreffen. Mit **ODER**: eine reicht", 0),
    ("„Kosmos **und** vor 2000“ liefert weniger Zeilen als „Kosmos **oder** vor 2000“", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Der häufigste Denkfehler", [
    ("„Alle Spiele von Kosmos **und** von Hans im Glück“ — gemeint ist **ODER**", 0),
    ("Denn **ein** Spiel kann nicht gleichzeitig von zwei Verlagen sein", 0),
    ("**UND** verkleinert die Treffermenge, **ODER** vergrößert sie", 0),
    ("Probe: kommt **null** Zeilen zurück, war es vermutlich ein UND zu viel", 0),
    ("Kommt **alles** zurück, war es ein ODER zu viel", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Ausblick", "Dieselbe Frage als Abfrage")

d.table_top("Was ihr klickt — und wie es geschrieben aussieht", [
    ["geklickt", "geschrieben (SQL)"],
    ["Tabelle: Spiele, alle Spalten", "SELECT * FROM Spiele"],
    ["Filter: Verlag = Kosmos", "WHERE Verlag = 'Kosmos'"],
    ["Sortieren nach Jahr", "ORDER BY Jahr"],
    ["alles zusammen", "SELECT * FROM Spiele WHERE Verlag = 'Kosmos' ORDER BY Jahr"],
], [280, 536], [
    ("**SQL** ist die Sprache, in der Datenbanken gefragt werden — weltweit dieselbe", 0),
    ("Ihr müsst sie noch nicht schreiben können. Aber **lesen** könnt ihr sie ab heute", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

d.merksatz("Sortieren ordnet die Zeilen, Filtern lässt Zeilen weg. Beides ändert "
           "die gespeicherten Daten nicht — nur die Ansicht.")

d.bullets("Fun Facts: Sortieren und Filtern", [
    ("**SQL** gibt es seit 1974 und heißt „Structured Query Language“", 0),
    ("Eine Datenbank sortiert eine Million Zeilen in **Sekundenbruchteilen** — mit klugen Verfahren", 0),
    ("Damit das so schnell geht, legt sie heimlich einen **Index** an, wie ein Stichwortverzeichnis", 0),
    ("Beim Sortieren von Namen ist **Ö** je nach Land mal wie O, mal hinter Z einsortiert", 0),
    ("Der Filter „enthält“ heißt in SQL **LIKE** — mit % als Platzhalter", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Sortiert eure Spielesammlung nach **Jahr**, einmal auf- und einmal absteigend", 0),
    ("Sortiert nach **Verlag, dann Titel** — zwei Felder auf einmal", 0),
    ("Filter 1: alle Spiele **vor 2000**", 0),
    ("Filter 2: alle Spiele von **Kosmos ab 2010** — das ist ein UND", 0),
    ("Denkt euch **zwei eigene Fragen** aus, filtert sie und notiert die Trefferzahl", 0),
])

d.save()
