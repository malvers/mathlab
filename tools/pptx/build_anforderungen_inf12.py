#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 26 / KW 9: Anforderungen an Datenbanken -
Redundanz, Konsistenz, Integritaet (LB 2, Ustd. 17-18/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("anforderungen-integritaet.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Was eine Datenbank leisten muss",
        "Redundanz, Konsistenz, Integrität — und wie man sie im DBMS erzwingt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Begriffe", "Drei Wörter, die oft verwechselt werden")

d.table_top("Redundanz, Konsistenz, Integrität", [
    ["Begriff", "bedeutet", "Gegenbeispiel"],
    ["Redundanz", "dieselbe Angabe mehrfach gespeichert", "Adresse in drei Tabellen"],
    ["Konsistenz", "die Daten widersprechen sich nicht", "zwei verschiedene Adressen"],
    ["Integrität", "die Daten erfüllen alle festgelegten Regeln", "Note 7, Kurs ohne Lehrkraft"],
], [180, 330, 306], [
    ("**Redundanz** ist die Ursache, **Inkonsistenz** die Folge — nicht umgekehrt", 0),
    ("**Integrität** ist der Oberbegriff für alle Regeln, die das DBMS durchsetzt", 0),
], font_size=11, bold_cols=(0,), marks={(1, 0): TINT_ORANGE, (2, 0): TINT_RED})

d.bullets("Kontrollierte Redundanz", [
    ("Nicht jede Redundanz ist ein Fehler — manche ist **beabsichtigt**", 0),
    ("Ein **Index** ist Redundanz: dieselben Werte noch einmal, sortiert", 0),
    ("Eine **Sicherungskopie** ist Redundanz — und lebensrettend", 0),
    ("Entscheidend ist, dass das **DBMS** sie pflegt, nicht der Mensch", 0),
    ("Gefährlich ist nur die **unkontrollierte** Redundanz in den Nutzdaten", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Integritätsarten", "Vier Ebenen, vier Regeln")

d.table_top("Welche Integrität wovor schützt", [
    ["Art", "Regel", "im SQL"],
    ["Domänenintegrität", "der Wert passt zum Datentyp und Wertebereich", "Datentyp, CHECK"],
    ["Entitätsintegrität", "jede Zeile ist eindeutig, Schlüssel nicht NULL", "PRIMARY KEY"],
    ["Referentielle Integrität", "jeder Verweis zeigt auf eine vorhandene Zeile", "FOREIGN KEY"],
    ["Semantische Integrität", "fachliche Regeln der Miniwelt", "CHECK, Trigger"],
], [220, 350, 246], [
    ("Die ersten drei kann jedes DBMS **automatisch** durchsetzen", 0),
    ("Die vierte muss man **formulieren** — sie steht in keinem Standard", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 0): TINT_BLUE})

sql("Constraints im DBMS setzen", [
    "CREATE TABLE Belegung (",
    "    snr  INTEGER NOT NULL REFERENCES Schueler(snr),",
    "    knr  INTEGER NOT NULL REFERENCES Kurs(knr),",
    "    note INTEGER CHECK (note BETWEEN 1 AND 6),",
    "    PRIMARY KEY (snr, knr)",
    ");",
    "",
    "ALTER TABLE Kurs",
    "  ADD CONSTRAINT stunden_positiv CHECK (stunden > 0);",
], size=12.5)

d.bullets("Regeln gehören in die Datenbank", [
    ("Auf dieselbe Datenbank greifen **mehrere** Programme zu", 0),
    ("Eine Regel im Programm gilt nur für **dieses** Programm", 0),
    ("Eine Regel im DBMS gilt für **jeden** Zugriff, auch für den von Hand", 0),
    ("Und sie überlebt den Austausch der Anwendung", 0),
    ("Faustregel: **fachliche Regeln so nah wie möglich an den Daten**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Transaktionen", "Konsistenz über mehrere Schritte")

d.table_top("Die ACID-Eigenschaften", [
    ["Buchstabe", "steht für", "heißt"],
    ["A", "Atomarität", "ganz oder gar nicht"],
    ["C", "Konsistenz", "vorher gültig, nachher gültig"],
    ["I", "Isolation", "gleichzeitige Transaktionen stören sich nicht"],
    ["D", "Dauerhaftigkeit", "bestätigte Änderungen überleben einen Absturz"],
], [130, 250, 436], [
    ("Klassisches Beispiel: **Umbuchen** — abbuchen und gutschreiben gehören zusammen", 0),
    ("Bricht der Rechner dazwischen ab, macht **COMMIT/ROLLBACK** die Sache ganz oder gar nicht", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Fallbeispiele zur Analyse", [
    ("Eine Note 7 steht in der Datenbank — **welche** Integrität fehlt?", 0),
    ("Ein Kurs verweist auf eine gelöschte Lehrkraft — **welche**?", 0),
    ("Zwei Schüler haben dieselbe SNr — **welche**?", 0),
    ("Ein Schüler ist in Klasse „BGY99“, die es nicht gibt — **welche**?", 0),
    ("Zu jedem Fall: **welches Constraint** hätte es verhindert?", 0),
])

d.merksatz("Redundanz ist die Ursache, Inkonsistenz die Folge. "
           "Und jede fachliche Regel gehört so nah wie möglich an die Daten.")

d.bullets("Fun Facts: Integrität", [
    ("**ACID** wurde 1983 von Härder und Reuter geprägt — beide aus Deutschland", 0),
    ("Manche verteilten Systeme geben Konsistenz bewusst auf: das nennt man **BASE**", 0),
    ("Der **CAP-Satz** sagt: von Konsistenz, Verfügbarkeit und Partitionstoleranz gibt es nur zwei", 0),
    ("Ein **Trigger** ist Programmcode, den das DBMS bei bestimmten Änderungen selbst ausführt", 0),
    ("Trigger sind mächtig und gefürchtet: sie wirken unsichtbar, wenn niemand sie dokumentiert", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Setzt an eurer Datenbank **PRIMARY KEY**, **FOREIGN KEY** und mindestens zwei **CHECK**", 0),
    ("Versucht, jede Regel zu **verletzen**, und notiert die Fehlermeldung", 0),
    ("Analysiert die **vier Fallbeispiele** aus Kapitel 3", 0),
    ("Findet in eurer Datenbank eine **kontrollierte** und eine **unkontrollierte** Redundanz", 0),
    ("Formuliert eine fachliche Regel eurer Miniwelt als **CHECK**", 0),
])

d.save()
