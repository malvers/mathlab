#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 5 / KW 38: Tabelle, Datensatz, Datenfeld
(LB 1, Ustd. 4/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("tabelle-datensatz-datenfeld.pptx")

d.title("Informatik — Klasse 9", "Tabelle, Datensatz, Datenfeld",
        "Drei Wörter, die ihr ab heute jede Stunde braucht")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Alles ist eine Tabelle", "Zeilen und Spalten, mehr braucht es nicht")

d.table_top("Eine Datenbank-Tabelle: unsere Spielesammlung", [
    ["Nr", "Titel", "Verlag", "Jahr", "USK"],
    ["1", "Die Siedler von Catan", "Kosmos", "1995", "10"],
    ["2", "Carcassonne", "Hans im Glück", "2000", "8"],
    ["3", "Die Legenden von Andor", "Kosmos", "2012", "10"],
    ["4", "Exit — Das Verlies", "Kosmos", "2016", "12"],
], [80, 300, 220, 110, 106], [
    ("Eine **Zeile** ist ein Spiel — in der Datenbank heißt sie **Datensatz**", 0),
    ("Eine **Spalte** ist ein Merkmal — sie heißt **Datenfeld**", 0),
    ("Eine einzelne Zelle ist der **Wert** eines Feldes für einen Datensatz", 0),
], font_size=11.5, bold_cols=(0,), marks={(2, c): TINT_GREEN for c in range(5)} |
   {(r, 2): TINT_ORANGE for r in range(1, 5)})

d.table_top("Die Begriffe im Überblick", [
    ["Begriff", "ist", "in der Spielesammlung"],
    ["Tabelle", "die ganze Sammlung", "alle Spiele zusammen"],
    ["Datensatz", "eine Zeile", "Carcassonne mit allen Angaben"],
    ["Datenfeld", "eine Spalte", "Verlag"],
    ["Wert", "eine Zelle", "„Hans im Glück“"],
], [180, 250, 386], [
    ("Merkt euch das Bild: **Zeile = Datensatz**, **Spalte = Datenfeld**", 0),
    ("Im Alltag sagt man „Eintrag“ — in der Informatik sagt man **Datensatz**", 0),
], font_size=12, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Regeln für gute Tabellen", "Vier Punkte, die später viel Ärger sparen")

d.bullets("So baut man eine Tabelle richtig", [
    ("**Eine Sache pro Tabelle**: Spiele in die Spieletabelle, Personen in eine eigene", 0),
    ("**Ein Merkmal pro Spalte**: nicht „Kosmos 1995“ in ein Feld, sondern zwei Felder", 0),
    ("**Jede Zeile einmal**: kein Spiel zweimal in der Liste", 0),
    ("**Ein Feld, das eindeutig ist**: die Nummer — daran erkennt man jede Zeile sicher", 0),
    ("Dieses eindeutige Feld heißt **Schlüssel**. Mehr dazu in ein paar Wochen", 0),
])

d.table_top("Warum „ein Merkmal pro Spalte“ wichtig ist", [
    ["so nicht", "warum nicht", "besser"],
    ["Kosmos 1995", "man kann nicht nach Jahr sortieren", "Verlag | Jahr"],
    ["Anna Meier", "man findet keine Nachnamen", "Vorname | Nachname"],
    ["12 Jahre", "man kann nicht rechnen", "Alter (Zahl)"],
], [230, 340, 246], [
    ("Faustregel: **Was man einzeln suchen will, gehört in eine eigene Spalte**", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 0): TINT_RED for r in range(1, 4)} |
   {(r, 2): TINT_GREEN for r in range(1, 4)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Fehlersuche", "Was in echten Tabellen schiefgeht")

d.table_top("Findet die vier Fehler", [
    ["Nr", "Titel", "Verlag", "Jahr", "USK"],
    ["5", "Zug um Zug", "Days of Wonder", "2004", "8"],
    ["5", "Zug um Zug", "Days of Wonder", "2004", "8"],
    ["6", "Azul", "", "2017", "8"],
    ["7", "Uno", "Mattel", "zweitausend", "0"],
    ["8", "Dixit", "Libellud", "2008", "acht"],
], [80, 280, 240, 130, 86], [
    ("Zeile 2 und 3: **derselbe Datensatz zweimal** — und dazu dieselbe Nummer", 0),
    ("Zeile 4: ein **leeres Feld** — der Verlag fehlt", 0),
    ("Zeile 5 und 6: **Text, wo eine Zahl hingehört** — damit lässt sich nicht sortieren", 0),
], font_size=11, bold_cols=(0,),
   marks={(2, c): TINT_RED for c in range(5)} | {(3, 2): TINT_ORANGE,
          (4, 3): TINT_ORANGE, (5, 4): TINT_ORANGE})

d.bullets("Warum das gefährlich ist", [
    ("Ein Datensatz **doppelt** — welcher ist der richtige, wenn einer geändert wird?", 0),
    ("Ein **leeres Feld** taucht bei keiner Suche nach Verlagen auf", 0),
    ("**„zweitausend“** landet beim Sortieren irgendwo hinter „2016“, weil es Text ist", 0),
    ("Ein **Tippfehler** im Namen macht ein zweites Spiel daraus, das es nicht gibt", 0),
    ("Das DBMS kann helfen — wenn man ihm vorher sagt, was in ein Feld gehört", 0),
])

d.merksatz("Eine Zeile ist ein Datensatz, eine Spalte ist ein Datenfeld. "
           "Und was man einzeln suchen will, bekommt eine eigene Spalte.")

d.bullets("Fun Facts: Tabellen", [
    ("Die **Keilschrifttafeln** aus Mesopotamien vor 5000 Jahren waren schon Tabellen — "
     "Listen von Getreide und Vieh", 0),
    ("Der Fachbegriff für so eine Tabelle ist **Relation** — daher „relationale Datenbank“", 0),
    ("Eine Tabelle in einer echten Datenbank darf **Millionen** Zeilen haben, ohne langsam zu werden", 0),
    ("**Excel** ist keine Datenbank: es passt nicht auf, was in eine Spalte kommt", 0),
    ("Das Wort **Datensatz** ist die deutsche Übersetzung von **record** — „Aufzeichnung“", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Legt in LibreOffice Base eine Tabelle **Spielesammlung** an", 0),
    ("Felder: **Nr, Titel, Verlag, Jahr, USK** — die Typen kommen nächste Woche dran", 0),
    ("Tragt **fünf** Spiele ein, die ihr kennt", 0),
    ("Baut absichtlich **einen** Fehler ein und lasst ihn vom Nachbarn suchen", 0),
    ("Schreibt zum Schluss auf: **Wie viele Datensätze und wie viele Datenfelder** hat eure Tabelle?", 0),
])

d.save()
