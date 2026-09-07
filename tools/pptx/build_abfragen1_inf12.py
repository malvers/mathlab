#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 20 / KW 2: Datenbankauswertung mit Abfragen I -
Selektion und Projektion (LB 2, Ustd. 7-8/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("abfragen-selektion-projektion.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Fragen statt suchen",
        "SQL als deklarative Sprache: Selektion, Projektion und zusammengesetzte Bedingungen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Deklarativ", "Was, nicht wie")

d.table_top("Zwei Arten, dasselbe zu verlangen", [
    ["imperativ", "deklarativ"],
    ["Öffne die Tabelle", "SELECT name"],
    ["Gehe Zeile für Zeile durch", "FROM Schueler"],
    ["Prüfe, ob klasse = BGY25", "WHERE klasse = 'BGY25'"],
    ["Merke dir den Namen", ""],
    ["Wiederhole bis zum Ende", ""],
], [400, 416], [
    ("Bei SQL beschreibt man **das Ergebnis**, nicht den Weg dorthin", 0),
    ("Den Weg sucht der **Abfrageoptimierer** — und er kennt Indexe und Statistiken", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 1): TINT_GREEN for r in range(1, 4)})

d.bullets("Was das praktisch heißt", [
    ("Dieselbe Abfrage läuft auf **100 und auf 100 Millionen** Zeilen — der Text bleibt gleich", 0),
    ("Wird ein **Index** angelegt, wird sie schneller, ohne dass jemand sie ändert", 0),
    ("Man kann nicht steuern, in welcher Reihenfolge das DBMS prüft — und muss es auch nicht", 0),
    ("Aber: eine schlecht formulierte Bedingung kann den Index **unbrauchbar** machen", 0),
    ("Deshalb lohnt es sich, die Abfrage **einfach** zu halten", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Bedingungen", "WHERE in allen Varianten")

sql("Vergleiche und Bereiche", [
    "SELECT * FROM Kurs WHERE stunden > 2;",
    "SELECT * FROM Kurs WHERE stunden BETWEEN 2 AND 4;",
    "SELECT * FROM Schueler WHERE klasse <> 'BGY25';",
    "SELECT * FROM Schueler WHERE klasse IN ('BGY24', 'BGY25');",
    "SELECT * FROM Kurs WHERE bezeichnung LIKE 'Info%';",
    "SELECT * FROM Belegung WHERE note IS NULL;",
], size=12.5)

d.table_top("Die Operatoren im Überblick", [
    ["Operator", "bedeutet", "Beispiel"],
    ["= <> < > <= >=", "Vergleiche", "stunden >= 3"],
    ["BETWEEN … AND", "Bereich, Grenzen eingeschlossen", "note BETWEEN 1 AND 3"],
    ["IN (…)", "einer aus einer Liste", "klasse IN ('BGY24','BGY25')"],
    ["LIKE", "Textmuster, % und _", "name LIKE 'M%'"],
    ["IS NULL", "kein Wert vorhanden", "note IS NULL"],
], [180, 300, 336], [
    ("**%** steht für beliebig viele Zeichen, **_** für genau eines", 0),
    ("**BETWEEN** schließt beide Grenzen ein — das wird oft falsch erinnert", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0, 2), marks={(5, 0): TINT_ORANGE})

sql("Bedingungen verknüpfen", [
    "SELECT name, vorname FROM Schueler",
    "WHERE klasse = 'BGY25' AND geburt < '2010-01-01';",
    "",
    "SELECT * FROM Kurs",
    "WHERE stunden > 3 OR lehrkraft = 'Alvers';",
    "",
    "-- Klammern setzen, sobald AND und OR gemischt werden:",
    "SELECT * FROM Kurs",
    "WHERE (stunden > 3 OR lehrkraft = 'Alvers') AND knr < 100;",
], size=12.5)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Fallen", "AND, OR und die leere Menge")

d.bullets("Warum AND und OR verwechselt werden", [
    ("Umgangssprachlich: „alle Schüler aus **BGY24 und BGY25**“", 0),
    ("In SQL heißt das **OR** — kein Schüler ist in beiden Klassen gleichzeitig", 0),
    ("**AND** verkleinert die Treffermenge, **OR** vergrößert sie", 0),
    ("Null Zeilen zurück? Meist ein **AND** zu viel oder ein Tippfehler im Text", 0),
    ("Alle Zeilen zurück? Meist ein **OR** zu viel oder eine immer wahre Bedingung", 0),
])

d.table_top("Ohne Klammern rechnet SQL so", [
    ["Geschrieben", "gemeint vom DBMS"],
    ["A OR B AND C", "A OR (B AND C) — AND bindet stärker"],
    ["NOT A AND B", "(NOT A) AND B"],
], [330, 486], [
    ("Das ist wie **Punkt vor Strich** — und genauso leicht zu übersehen", 0),
    ("Faustregel: sobald **AND und OR** gemeinsam vorkommen, **Klammern setzen**", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(0,))

d.merksatz("AND verkleinert, OR vergrößert. Und wenn beide vorkommen, "
           "gehören Klammern hin — auch dann, wenn es ohne stimmt.")

d.bullets("Fun Facts: Abfragen", [
    ("SQL ist **deklarativ** — dieselbe Idee steckt in HTML, CSS und Prolog", 0),
    ("Der **Abfrageoptimierer** wählt aus oft Millionen möglicher Ausführungspläne", 0),
    ("Mit **EXPLAIN** vor der Abfrage zeigt das DBMS den gewählten Plan", 0),
    ("**LIKE '%text%'** kann keinen Index nutzen — es muss jede Zeile lesen", 0),
    ("Deshalb gibt es für die Textsuche eigene Verfahren, etwa Volltextindexe", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Formuliert **acht Abfragen** auf der Beispieldatenbank, je eine je Operator", 0),
    ("Schreibt zu jeder **vorher** hin, wie viele Zeilen ihr erwartet", 0),
    ("Baut eine Abfrage mit **AND und OR** und setzt die Klammern bewusst", 0),
    ("Lasst dieselbe Abfrage **ohne** Klammern laufen und erklärt den Unterschied", 0),
    ("Findet eine Abfrage, die **null** Zeilen liefert, und erklärt warum", 0),
])

d.save()
