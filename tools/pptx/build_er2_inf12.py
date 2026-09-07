#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 23 / KW 5: ER-Modell II - vom ER-Diagramm zum
Relationenschema (LB 2, Ustd. 13-14/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("er-modell-2-inf12.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Vom Diagramm zu den Tabellen",
        "Die Überführungsregeln — und warum n:m eine eigene Tabelle braucht")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Überführungsregeln", "Vier Regeln, mehr braucht es nicht")

d.table_top("Vom ER-Modell zum Relationenschema", [
    ["Im ER-Modell", "wird zu"],
    ["Entitätstyp", "eine Tabelle, Attribute werden Spalten"],
    ["Schlüsselattribut", "Primärschlüssel der Tabelle"],
    ["1:n-Beziehung", "Fremdschlüssel auf der n-Seite"],
    ["n:m-Beziehung", "eigene Tabelle mit beiden Schlüsseln"],
    ["1:1-Beziehung", "Fremdschlüssel auf einer der beiden Seiten"],
    ["Beziehungsattribut", "Spalte in der Beziehungstabelle"],
], [230, 586], [
    ("Die dritte und vierte Zeile sind die Kernregeln — sie werden in jeder Klausur geprüft", 0),
    ("Merksatz: **der Fremdschlüssel steht immer auf der n-Seite**", 0),
], font_size=11.5, bold_cols=(0,), marks={(3, 0): TINT_GREEN, (4, 0): TINT_ORANGE})

d.bullets("Warum der Fremdschlüssel auf der n-Seite steht", [
    ("Eine Klasse hat **viele** Schüler, ein Schüler hat **eine** Klasse", 0),
    ("In der Tabelle **Schueler** passt genau **ein** Klassenverweis in eine Zeile", 0),
    ("Umgekehrt müsste in Klasse eine **Liste** von Schülern stehen — das geht in einer Spalte nicht", 0),
    ("Eine Spalte enthält **einen** Wert. Das ist die erste Normalform, kommt in drei Wochen", 0),
    ("Deshalb: **eins steht bei viele**, nicht viele bei eins", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der n:m-Fall", "Die Beziehungstabelle")

d.bullets("Warum n:m nicht direkt geht", [
    ("Ein Schüler belegt **viele** Kurse, ein Kurs hat **viele** Schüler", 0),
    ("In Schueler passt keine Kursliste, in Kurs keine Schülerliste", 0),
    ("Also entsteht eine **dritte** Tabelle: **Belegung**", 0),
    ("Sie enthält **beide** Fremdschlüssel — und beide zusammen sind der Primärschlüssel", 0),
    ("Attribute der Beziehung — die **Note** — gehören genau dorthin", 0),
])

sql("Das Relationenschema als SQL", [
    "CREATE TABLE Schueler (",
    "    snr INTEGER PRIMARY KEY, name TEXT, vorname TEXT, klasse TEXT);",
    "",
    "CREATE TABLE Kurs (",
    "    knr INTEGER PRIMARY KEY, bezeichnung TEXT, stunden INTEGER);",
    "",
    "CREATE TABLE Belegung (",
    "    snr  INTEGER REFERENCES Schueler(snr),",
    "    knr  INTEGER REFERENCES Kurs(knr),",
    "    note INTEGER,",
    "    PRIMARY KEY (snr, knr)",
    ");",
], size=12),

d.table_top("Die Schreibweise für die Klausur", [
    ["Relation", "Schema"],
    ["Schueler", "Schueler(snr, name, vorname, klasse)"],
    ["Kurs", "Kurs(knr, bezeichnung, stunden)"],
    ["Belegung", "Belegung(snr, knr, note)"],
], [200, 616], [
    ("Primärschlüssel werden **unterstrichen**, Fremdschlüssel **kursiv** oder mit Pfeil markiert", 0),
    ("In Belegung ist **snr, knr** zusammen Primärschlüssel **und** je einzeln Fremdschlüssel", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(1,), marks={(3, 1): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Referentielle Integrität", "Verweise, die nicht ins Leere gehen")

d.table_top("Was beim Löschen passieren kann", [
    ["Regel", "Verhalten beim Löschen eines Schülers"],
    ["RESTRICT / NO ACTION", "Löschen wird abgelehnt, solange Belegungen bestehen"],
    ["CASCADE", "die Belegungen werden mitgelöscht"],
    ["SET NULL", "der Verweis wird auf NULL gesetzt"],
], [230, 586], [
    ("Die Voreinstellung ist meist **RESTRICT** — sicher, aber unbequem", 0),
    ("**CASCADE** ist bequem und gefährlich: ein Löschbefehl räumt halbe Datenbestände ab", 0),
], font_size=11.5, bold_cols=(0,), marks={(2, 0): TINT_RED})

d.bullets("Der Weg im Überblick", [
    ("**Text** — die Anforderungen der Miniwelt", 0),
    ("**ER-Modell** — semantisch, systemunabhängig", 0),
    ("**Relationenschema** — logisch, für relationale Datenbanken", 0),
    ("**CREATE TABLE** — physisch, im konkreten DBMS", 0),
    ("Jede Stufe ist überprüfbar. Wer direkt von Text zu CREATE TABLE springt, rät", 0),
])

d.merksatz("Der Fremdschlüssel steht auf der n-Seite. "
           "Und eine n:m-Beziehung wird immer zu einer eigenen Tabelle.")

d.bullets("Fun Facts: Relationenmodell", [
    ("**Edgar F. Codd** veröffentlichte das Relationenmodell 1970 bei IBM", 0),
    ("Der Titel des Aufsatzes: „A Relational Model of Data for Large Shared Data Banks“", 0),
    ("Codd formulierte später **zwölf Regeln** dafür, wann ein DBMS relational heißen darf", 0),
    ("Kaum ein DBMS erfüllt alle zwölf — auch heute nicht", 0),
    ("Der Begriff **Relation** meint die Tabelle, nicht die Beziehung — eine ewige Verwechslung", 0),
])

d.bullets("Eure Aufgabe: das eigene Modell umsetzen", [
    ("Überführt euer **ER-Modell** von letzter Woche in ein Relationenschema", 0),
    ("Schreibt es in der **Klausurschreibweise** auf, mit unterstrichenen Schlüsseln", 0),
    ("Setzt es als **CREATE TABLE** um, mit REFERENCES für die Fremdschlüssel", 0),
    ("Füllt jede Tabelle mit **fünf** Zeilen", 0),
    ("Probiert aus, was beim Löschen eines referenzierten Datensatzes passiert", 0),
])

d.save()
