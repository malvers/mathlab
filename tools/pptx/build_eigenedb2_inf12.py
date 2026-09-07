#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 28 / KW 11: Eigene Datenbank II - Implementierung
und Abfragen (LB 2, Ustd. 21-22/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("eigene-datenbank-2.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Vom Schema zur laufenden Datenbank",
        "Implementieren, füllen, auswerten — und die Ergebnisse vorstellen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Implementieren", "In der richtigen Reihenfolge")

d.bullets("Warum die Reihenfolge zählt", [
    ("Tabellen mit **Fremdschlüsseln** brauchen die verwiesene Tabelle **vorher**", 0),
    ("Also: erst die Tabellen **ohne** Verweise, dann die abhängigen", 0),
    ("Beim **Löschen** genau umgekehrt — sonst greift die referentielle Integrität", 0),
    ("Beim **Einfügen** ebenso: erst der Kurs, dann die Belegung", 0),
    ("Ein Skript, das in falscher Reihenfolge läuft, bricht mit Constraint-Fehlern ab", 0),
])

sql("Anlege-Skript, Teil 1: die unabhängigen Tabellen", [
    "CREATE TABLE Lehrkraft (",
    "    kuerzel TEXT PRIMARY KEY, name TEXT, raum TEXT);",
    "",
    "CREATE TABLE Schueler (",
    "    snr INTEGER PRIMARY KEY, name TEXT NOT NULL, klasse TEXT);",
], size=14)

sql("Teil 2: erst Verweise, dann Beziehungstabellen", [
    "CREATE TABLE Kurs (",
    "    knr INTEGER PRIMARY KEY, bezeichnung TEXT NOT NULL,",
    "    lehrkraft TEXT REFERENCES Lehrkraft(kuerzel));",
    "",
    "CREATE TABLE Belegung (",
    "    snr  INTEGER REFERENCES Schueler(snr),",
    "    knr  INTEGER REFERENCES Kurs(knr),",
    "    note INTEGER CHECK (note BETWEEN 1 AND 6),",
    "    PRIMARY KEY (snr, knr));",
], size=13)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Beispieldaten", "Genug, damit Auswertungen etwas zeigen")

d.table_top("Wie viele Zeilen wovon", [
    ["Tabelle", "Anzahl", "warum"],
    ["Stammdaten (Lehrkraft, Kurs)", "5 bis 8", "genug für Gruppierungen"],
    ["Hauptentität (Schueler)", "15 bis 25", "genug für Durchschnitte"],
    ["Beziehungstabelle", "40 bis 60", "mehrere je Hauptentität"],
    ["Sonderfälle", "3 bis 5", "NULL-Werte, Randwerte, leere Gruppen"],
], [280, 150, 386], [
    ("Die letzte Zeile ist die wichtigste: **ohne Sonderfälle** merkt ihr Fehler nicht", 0),
    ("Ein Kurs **ohne Belegung** und eine Belegung **ohne Note** gehören unbedingt hinein", 0),
], font_size=11, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

d.bullets("Daten sinnvoll erzeugen", [
    ("**Plausibel** statt zufällig: Namen, Daten und Werte sollen zueinander passen", 0),
    ("**Keine echten personenbezogenen Daten** — erfundene Namen genügen", 0),
    ("Mit **INSERT … VALUES (…), (…), (…)** lassen sich viele Zeilen auf einmal einfügen", 0),
    ("Oder: eine **CSV-Datei** importieren, das Werkzeug kann das", 0),
    ("Nach dem Füllen: **SELECT COUNT(*)** je Tabelle — stimmen die Zahlen?", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Auswerten", "Die fünf Fragen beantworten")

sql("Auswertungsabfragen, die etwas zeigen", [
    "-- 1. Wie viele Schueler belegen welchen Kurs?",
    "SELECT k.bezeichnung, COUNT(*) AS anzahl",
    "FROM Kurs k JOIN Belegung b ON k.knr = b.knr",
    "GROUP BY k.bezeichnung ORDER BY anzahl DESC;",
    "",
    "-- 2. Durchschnittsnote je Kurs, nur wo es Noten gibt",
    "SELECT k.bezeichnung, ROUND(AVG(b.note), 2) AS schnitt",
    "FROM Kurs k JOIN Belegung b ON k.knr = b.knr",
    "WHERE b.note IS NOT NULL",
    "GROUP BY k.bezeichnung HAVING COUNT(*) >= 3;",
], size=11.5)

d.table_top("Die Bausteine einer Auswertung", [
    ["Klausel", "Aufgabe", "wirkt"],
    ["WHERE", "Zeilen auswählen", "vor der Gruppierung"],
    ["GROUP BY", "Zeilen zu Gruppen zusammenfassen", "in der Mitte"],
    ["HAVING", "Gruppen auswählen", "nach der Gruppierung"],
    ["ORDER BY", "Ergebnis sortieren", "zuletzt"],
], [150, 350, 316], [
    ("**WHERE filtert Zeilen, HAVING filtert Gruppen** — das ist der Unterschied", 0),
    ("Eine Bedingung über COUNT oder AVG gehört immer in **HAVING**", 0),
], font_size=11, bold_cols=(0,), marks={(3, 0): TINT_ORANGE})

d.merksatz("WHERE filtert Zeilen, HAVING filtert Gruppen. "
           "Und ohne Sonderfälle in den Testdaten findet man keine Fehler.")

d.bullets("Fun Facts: Implementierung", [
    ("Ein **Anlege-Skript** ist wertvoller als die fertige Datei — es lässt sich wiederholen", 0),
    ("Profis versionieren Schema-Änderungen als **Migrationen**, nummeriert und nachvollziehbar", 0),
    ("**ROUND(AVG(x), 2)** rundet erst am Ende — vorher gerundet wird das Ergebnis falsch", 0),
    ("**HAVING ohne GROUP BY** ist erlaubt: es filtert dann die eine Gesamtgruppe", 0),
    ("Testdaten mit Sonderfällen heißen in der Praxis **Edge Cases** — sie finden die meisten Fehler", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Schema implementieren** — in der richtigen Reihenfolge, mit Constraints", 0),
    ("**Beispieldaten** einpflegen, inklusive drei bis fünf Sonderfällen", 0),
    ("Eure **fünf Fragen** aus der letzten Stunde als Abfragen umsetzen", 0),
    ("Mindestens **eine Abfrage mit GROUP BY** und **eine mit JOIN über drei Tabellen**", 0),
    ("Zum Schluss: **drei Minuten Vorstellung** — Thema, Modell, eine überraschende Auswertung", 0),
])

d.save()
