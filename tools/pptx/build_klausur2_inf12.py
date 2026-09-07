#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 31 / KW 14: Wiederholung und Klausur 2 (LB 2: Datenbanken)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("wiederholung-klausur2-inf12.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "LB 2 im Überblick",
        "Wiederholung und Klausur 2: SQL, ER-Modell und Normalisierung")

d.chapter(1, "Der Weg durch LB 2", "Vom Text bis zur Auswertung")

d.table_top("Die Kette", [
    ["Stufe", "Ergebnis", "Prüfstein"],
    ["Miniwelt beschreiben", "Zweck und Fragen", "Sind die Fragen konkret?"],
    ["ER-Modell", "Entitäten, Beziehungen, Kardinalitäten", "Beide Fragen je Beziehung gestellt?"],
    ["Relationenschema", "Tabellen mit Schlüsseln", "n:m als eigene Tabelle?"],
    ["Normalisierung", "3NF", "Partiell und transitiv geprüft?"],
    ["Implementierung", "CREATE TABLE mit Constraints", "Reihenfolge der Verweise?"],
    ["Auswertung", "SELECT mit JOIN und GROUP BY", "Beantwortet es die Fragen?"],
], [180, 340, 296], [
    ("In der Klausur kommt die Kette **von beiden Enden**: Text zu Modell und Modell zu SQL", 0),
], font_size=10.5, bold_cols=(0,))

d.chapter(2, "SQL", "Die Bausteine, die geprüft werden")

d.table_top("Was wozu dient", [
    ["Klausel", "Aufgabe", "Falle"],
    ["SELECT", "Projektion, Spalten wählen", "Aggregat ohne GROUP BY"],
    ["WHERE", "Selektion, Zeilen wählen", "= NULL statt IS NULL"],
    ["JOIN … ON", "Tabellen verbinden", "ON vergessen: kartesisches Produkt"],
    ["GROUP BY", "Gruppen bilden", "Spalte fehlt in der Gruppierung"],
    ["HAVING", "Gruppen filtern", "mit WHERE verwechselt"],
    ["ORDER BY", "sortieren", "Zahl im Textfeld"],
], [150, 330, 336], [
    ("Für **n** Tabellen braucht ein JOIN **n − 1** Bedingungen — das wird gern vergessen", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 2): TINT_RED})

sql("Eine Musteraufgabe", [
    "-- Wie viele Schueler je Kurs, nur Kurse mit mindestens 3,",
    "-- absteigend nach Anzahl:",
    "SELECT k.bezeichnung, COUNT(*) AS anzahl",
    "FROM Kurs k",
    "JOIN Belegung b ON k.knr = b.knr",
    "GROUP BY k.bezeichnung",
    "HAVING COUNT(*) >= 3",
    "ORDER BY anzahl DESC;",
], size=13)

d.chapter(3, "Modell und Normalformen", "Der zweite Klausurteil")

d.table_top("Die Regeln in Kurzform", [
    ["Thema", "Regel"],
    ["1:n", "Fremdschlüssel auf der n-Seite"],
    ["n:m", "eigene Tabelle mit beiden Schlüsseln"],
    ["1NF", "atomare Werte, keine Wiederholungsgruppen"],
    ["2NF", "keine partielle Abhängigkeit vom Schlüssel"],
    ["3NF", "keine transitive Abhängigkeit"],
], [130, 686], [
    ("Zu jeder Normalform gehört in der Klausur die **Begründung**, nicht nur das Ergebnis", 0),
    ("Also: **welche** Abhängigkeit war partiell, **welche** transitiv?", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Fremdschlüssel auf der n-Seite, n:m als eigene Tabelle. "
           "Und jede Normalform wird begründet, nicht behauptet.")

d.bullets("So läuft die Klausur", [
    ("Teil A: **Begriffe** — Redundanz, Konsistenz, Integrität, ACID", 0),
    ("Teil B: **Modellieren** — vom Text zum ER-Modell und Relationenschema", 0),
    ("Teil C: **Normalisieren** — mit Begründung je Schritt", 0),
    ("Teil D: **SQL** — Abfragen schreiben und fremde Abfragen lesen", 0),
    ("Erlaubt ist ein Taschenrechner. Zwischenschritte zählen", 0),
])

d.bullets("Vorbereitung heute", [
    ("Normalisiert **eine** Sammeltabelle vollständig und begründet jeden Schritt", 0),
    ("Schreibt **drei Abfragen** mit JOIN, GROUP BY und HAVING", 0),
    ("Lest **eine fremde Abfrage** und beschreibt in Worten, was sie liefert", 0),
    ("Überführt **ein** ER-Modell in ein Relationenschema", 0),
    ("Stellt eure letzten offenen Fragen", 0),
])

d.save()
