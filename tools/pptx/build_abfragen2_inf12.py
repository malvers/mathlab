#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 21 / KW 3: Datenbankauswertung mit Abfragen II -
Verbund von Tabellen (LB 2, Ustd. 9-10/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("abfragen-join.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Tabellen verbinden",
        "JOIN über Fremdschlüssel — und ein Ausblick auf die Aggregatfunktionen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum überhaupt verbinden?", "Weil Daten getrennt liegen")

d.bullets("Der Grund für die Aufteilung", [
    ("Die Tabelle **Belegung** enthält nur **snr** und **knr** — keine Namen", 0),
    ("Der Name steht **einmal** in Schueler, die Kursbezeichnung **einmal** in Kurs", 0),
    ("Das vermeidet **Redundanz**: der Name wird nicht bei jeder Belegung wiederholt", 0),
    ("Der Preis: für eine lesbare Liste müssen die Tabellen **verbunden** werden", 0),
    ("Die Verbindung läuft über den **Fremdschlüssel** — hier snr und knr", 0),
])

d.table_top("Primär- und Fremdschlüssel", [
    ["Begriff", "ist", "Beispiel"],
    ["Primärschlüssel", "macht eine Zeile eindeutig", "Schueler.snr"],
    ["Fremdschlüssel", "verweist auf einen Primärschlüssel", "Belegung.snr"],
    ["referentielle Integrität", "kein Verweis ins Leere", "keine Belegung ohne Schüler"],
], [230, 300, 286], [
    ("Das DBMS kann die **referentielle Integrität** erzwingen — dann scheitert ein falscher Verweis", 0),
    ("Genau darüber läuft später auch das Löschen: was passiert mit den Belegungen?", 0),
], font_size=11, bold_cols=(0,), marks={(3, 0): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der JOIN", "Zwei und drei Tabellen verbinden")

sql("Zwei Tabellen verbinden", [
    "SELECT s.name, s.vorname, b.note",
    "FROM Schueler s",
    "JOIN Belegung b ON s.snr = b.snr;",
    "",
    "-- gleichbedeutend, aeltere Schreibweise:",
    "SELECT s.name, s.vorname, b.note",
    "FROM Schueler s, Belegung b",
    "WHERE s.snr = b.snr;",
], size=13)

sql("Drei Tabellen verbinden", [
    "SELECT s.name, s.vorname, k.bezeichnung, b.note",
    "FROM Schueler s",
    "JOIN Belegung b ON s.snr = b.snr",
    "JOIN Kurs     k ON b.knr = k.knr",
    "WHERE k.bezeichnung = 'Informatik'",
    "ORDER BY s.name;",
], size=13)

d.bullets("Worauf es beim JOIN ankommt", [
    ("Die **ON-Bedingung** sagt, welche Zeilen zusammengehören — sie ist nicht optional", 0),
    ("Fehlt sie, entsteht das **kartesische Produkt**: jede Zeile mit jeder", 0),
    ("Bei 200 Schülern und 300 Belegungen sind das **60 000** Zeilen Unsinn", 0),
    ("**Aliasnamen** (s, b, k) machen die Abfrage lesbar und sind bei gleichen Spaltennamen nötig", 0),
    ("Für **n** Tabellen braucht man **n − 1** Verbindungsbedingungen", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "JOIN-Arten und Ausblick", "INNER, LEFT — und das Zählen")

d.table_top("Die beiden Arten, die ihr braucht", [
    ["Art", "liefert", "typischer Einsatz"],
    ["INNER JOIN", "nur Zeilen mit Partner in beiden Tabellen", "alle belegten Kurse"],
    ["LEFT JOIN", "alle Zeilen links, rechts ggf. NULL", "auch Schüler ohne Belegung"],
], [200, 350, 266], [
    ("**JOIN** allein bedeutet **INNER JOIN** — die Voreinstellung", 0),
    ("Ein **LEFT JOIN** mit **WHERE rechts IS NULL** findet genau die Zeilen **ohne** Partner", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_BLUE})

sql("Ausblick: Aggregatfunktionen", [
    "SELECT COUNT(*) FROM Schueler;",
    "SELECT COUNT(*) FROM Belegung WHERE note IS NOT NULL;",
    "SELECT AVG(note) FROM Belegung WHERE knr = 1;",
    "",
    "SELECT k.bezeichnung, COUNT(*) AS anzahl",
    "FROM Kurs k JOIN Belegung b ON k.knr = b.knr",
    "GROUP BY k.bezeichnung;",
], size=12.5)

d.merksatz("Ein JOIN ohne ON-Bedingung ist kein Fehler für das DBMS — "
           "es liefert klaglos jede Zeile mit jeder. Deshalb immer die Zeilenzahl prüfen.")

d.bullets("Fun Facts: JOIN", [
    ("Der **Verbund** ist eine Operation der Relationenalgebra von **Codd** (1970)", 0),
    ("Das **kartesische Produkt** heißt nach Descartes — es ist der JOIN ohne Bedingung", 0),
    ("**COUNT(*)** zählt Zeilen, **COUNT(spalte)** zählt nur Zeilen mit Wert — NULL fällt heraus", 0),
    ("Deshalb liefern die beiden bei Spalten mit Lücken **verschiedene** Zahlen", 0),
    ("Ein **JOIN über fünf Tabellen** ist in echten Anwendungen völlig normal", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Verbindet **Schueler und Belegung** und gebt Name und Note aus", 0),
    ("Verbindet **alle drei Tabellen** und filtert auf einen Kurs", 0),
    ("Lasst einen JOIN **ohne ON** laufen und zählt die Zeilen — erklärt die Zahl", 0),
    ("Findet mit **LEFT JOIN** alle Schüler **ohne** Belegung", 0),
    ("Zählt mit **COUNT** die Belegungen je Kurs — das brauchen wir in vier Wochen wieder", 0),
])

d.save()
