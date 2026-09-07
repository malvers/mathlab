#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 19 / KW 1: Puffer und Uebung - SQL-Fingeruebungen."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("sql-fingeruebungen.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "SQL-Fingerübungen",
        "Wiederholen, was sitzt — und die Beispieldatenbank kennenlernen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Beispieldatenbank", "Drei Tabellen, mit denen wir weiterarbeiten")

d.table_top("Das Schema", [
    ["Tabelle", "Spalten", "Schlüssel"],
    ["Schueler", "snr, name, vorname, klasse, geburt", "snr"],
    ["Kurs", "knr, bezeichnung, lehrkraft, stunden", "knr"],
    ["Belegung", "snr, knr, note", "snr + knr"],
], [180, 430, 206], [
    ("**Belegung** verbindet die beiden anderen Tabellen — jede Zeile ist ein belegter Kurs", 0),
    ("Ihr Schlüssel ist **zusammengesetzt**: erst beide Spalten zusammen sind eindeutig", 0),
], font_size=11, bold_cols=(0,), marks={(3, 2): TINT_ORANGE})

sql("Die Tabellen anlegen", [
    "CREATE TABLE Kurs (",
    "    knr         INTEGER PRIMARY KEY,",
    "    bezeichnung TEXT NOT NULL,",
    "    lehrkraft   TEXT,",
    "    stunden     INTEGER",
    ");",
    "",
    "CREATE TABLE Belegung (",
    "    snr  INTEGER,",
    "    knr  INTEGER,",
    "    note INTEGER,",
    "    PRIMARY KEY (snr, knr)",
    ");",
], size=12.5)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Fingerübungen", "Zehn Abfragen, steigend im Anspruch")

d.table_top("Aufgaben 1 bis 5", [
    ["Nr", "Gesucht", "braucht"],
    ["1", "Alle Schüler mit allen Spalten", "SELECT *"],
    ["2", "Nur Name und Vorname aller Schüler", "Projektion"],
    ["3", "Alle Schüler der Klasse BGY25", "Selektion"],
    ["4", "Alle Kurse mit mehr als 2 Wochenstunden", "Vergleich"],
    ["5", "Alle Schüler, alphabetisch nach Name", "ORDER BY"],
], [70, 480, 266], [
    ("Schreibt jede Abfrage **erst auf Papier**, dann in das Werkzeug", 0),
], font_size=11, bold_cols=(0,))

d.table_top("Aufgaben 6 bis 10", [
    ["Nr", "Gesucht", "braucht"],
    ["6", "Schüler der BGY25, sortiert nach Geburtsdatum", "WHERE + ORDER BY"],
    ["7", "Alle Kurse, deren Bezeichnung „Info“ enthält", "LIKE"],
    ["8", "Schüler, die 2009 geboren sind", "Bereich oder LIKE"],
    ["9", "Alle Noten der Belegung, absteigend", "ORDER BY DESC"],
    ["10", "Alle Belegungen ohne eingetragene Note", "IS NULL"],
], [70, 480, 266], [
    ("**LIKE 'Info%'** findet alles, was mit Info beginnt. **%** ist der Platzhalter", 0),
    ("**IS NULL** statt **= NULL** — NULL ist kein Wert, sondern die Abwesenheit eines Werts", 0),
], font_size=11, bold_cols=(0,), marks={(5, 2): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Fallen", "Woran es meistens hakt")

sql("Vier Fehler und ihre Korrektur", [
    "-- falsch: Zeichenketten ohne Hochkommata",
    "SELECT * FROM Schueler WHERE klasse = BGY25;",
    "SELECT * FROM Schueler WHERE klasse = 'BGY25';   -- richtig",
    "",
    "-- falsch: NULL mit = vergleichen",
    "SELECT * FROM Belegung WHERE note = NULL;",
    "SELECT * FROM Belegung WHERE note IS NULL;       -- richtig",
    "",
    "-- falsch: Spaltenname im falschen Teil",
    "SELECT name WHERE klasse = 'BGY25' FROM Schueler;",
    "SELECT name FROM Schueler WHERE klasse = 'BGY25';  -- richtig",
], size=11.5)

d.bullets("Die Reihenfolge der Klauseln", [
    ("**SELECT** — welche Spalten?", 0),
    ("**FROM** — aus welcher Tabelle?", 0),
    ("**WHERE** — welche Zeilen?", 0),
    ("**ORDER BY** — in welcher Reihenfolge?", 0),
    ("Diese Reihenfolge ist **fest**. Gelesen wird die Abfrage aber von FROM her", 0),
])

d.merksatz("NULL ist kein Wert, sondern die Abwesenheit eines Werts. "
           "Deshalb prüft man mit IS NULL, nie mit = NULL.")

d.bullets("Fun Facts: SQL üben", [
    ("**SQL-Island** und **SQLZoo** sind kostenlose Übungsumgebungen im Browser", 0),
    ("Der häufigste Anfängerfehler ist das **fehlende Hochkomma** bei Texten", 0),
    ("Der zweithäufigste ist **= NULL** — es liefert nie ein Ergebnis, aber auch keinen Fehler", 0),
    ("Groß- und Kleinschreibung ist bei **Schlüsselwörtern** egal, bei **Daten** nicht", 0),
    ("Üblich ist trotzdem: Schlüsselwörter groß, Namen klein — der Lesbarkeit wegen", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Legt die **drei Tabellen** an und füllt sie mit je fünf bis zehn Zeilen", 0),
    ("Bearbeitet die **zehn Aufgaben** — erst auf Papier, dann am Rechner", 0),
    ("Vergleicht bei jeder Aufgabe die **erwartete** mit der **gelieferten** Zeilenzahl", 0),
    ("Baut absichtlich die **vier Fehler** ein und lest die Fehlermeldungen", 0),
    ("Notiert zwei Fragen für nächste Woche — dann kommen die Abfragen über mehrere Tabellen", 0),
])

d.save()
