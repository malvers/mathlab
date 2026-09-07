#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 28 / KW 11: Pruefungsvorbereitung I -
Modellierung und Datenbanken."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("pruefungsvorbereitung-1.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Prüfungsvorbereitung I",
        "Modellierung und Datenbanken — im Prüfungsformat geübt")

d.chapter(1, "Der Überblick", "Was aus Jahrgangsstufe 12 geprüft wird")

d.table_top("Die Themen und ihre Kernsätze", [
    ["Thema", "Kernsatz"],
    ["Modellbegriff", "Verkürzung für einen Zweck — geprüft wird gegen den Zweck"],
    ["eEPK", "Ereignis und Funktion im Wechsel, Split und Join gleicher Typ"],
    ["BPMN", "Sequenzfluss im Pool, zwischen Pools nur Nachrichten"],
    ["Projektplanung", "kritischer Pfad hat Puffer null und bestimmt die Dauer"],
    ["ER-Modell", "Kardinalität mit zwei Fragen bestimmen"],
    ["Überführung", "Fremdschlüssel auf der n-Seite, n:m eigene Tabelle"],
    ["Normalisierung", "atomar, ganzer Schlüssel, kein Nichtschlüssel vom Nichtschlüssel"],
    ["SQL", "WHERE filtert Zeilen, HAVING filtert Gruppen"],
], [180, 636], [
    ("Acht Zeilen — wer sie erklären kann, hat den halben Prüfungsteil sicher", 0),
], font_size=10, bold_cols=(0,))

d.chapter(2, "Aufgabentypen", "Was in der Prüfung wirklich verlangt wird")

d.table_top("Die vier Typen", [
    ["Typ", "Aufgabenstellung", "Fallstrick"],
    ["Beschreiben", "Begriff erklären und abgrenzen", "Stichworte statt Sätze"],
    ["Anwenden", "aus einem Text ein Modell entwickeln", "Kardinalität nicht begründet"],
    ["Analysieren", "ein gegebenes Modell prüfen und korrigieren", "Fehler nicht benannt"],
    ["Beurteilen", "zwei Möglichkeiten abwägen und entscheiden", "keine Entscheidung getroffen"],
], [150, 350, 316], [
    ("Die **Operatoren** in der Aufgabenstellung sagen, was verlangt ist", 0),
    ("**Beurteilen** verlangt am Ende ein klares Urteil — nicht nur ein Für und Wider", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 2): TINT_RED})

sql("Eine typische Prüfungsaufgabe zu SQL", [
    "-- Gegeben: Verein(vnr, name, ort), Mitglied(mnr, name, vnr), ",
    "--          Beitrag(mnr, jahr, betrag)",
    "",
    "-- a) Alle Vereine aus Dresden, alphabetisch",
    "-- b) Anzahl der Mitglieder je Verein",
    "-- c) Vereine mit mehr als 20 Mitgliedern",
    "-- d) Vereine ohne ein einziges Mitglied",
    "-- e) Summe der Beitraege je Verein fuer 2026",
], size=12)

d.bullets("Die Lösungswege in Stichworten", [
    ("a) **WHERE ort = 'Dresden' ORDER BY name**", 0),
    ("b) **JOIN Mitglied, GROUP BY vnr, COUNT(*)**", 0),
    ("c) wie b, zusätzlich **HAVING COUNT(*) > 20**", 0),
    ("d) **LEFT JOIN** und dann **WHERE m.mnr IS NULL**", 0),
    ("e) **JOIN über drei Tabellen**, WHERE jahr = 2026, **SUM(betrag)**, GROUP BY", 0),
])

d.chapter(3, "Übung im Prüfungsformat", "Unter Zeitvorgabe")

d.table_top("Die Übungsaufgaben heute", [
    ["Nr", "Aufgabe", "Zeit"],
    ["1", "Aus einem Text ein ER-Modell mit Kardinalitäten entwickeln", "20 min"],
    ["2", "Das Modell in ein Relationenschema überführen", "10 min"],
    ["3", "Eine Sammeltabelle bis 3NF normalisieren, mit Begründung", "20 min"],
    ["4", "Fünf SQL-Abfragen wie oben", "20 min"],
    ["5", "Ein fehlerhaftes eEPK-Modell korrigieren", "15 min"],
], [70, 570, 176], [
    ("Haltet die **Zeiten** ein — auch wenn ihr nicht fertig werdet", 0),
    ("In der Prüfung ist die Zeiteinteilung die Hälfte des Erfolgs", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 2): TINT_ORANGE})

d.merksatz("Die Operatoren sagen, was verlangt ist. „Beurteilen“ endet mit "
           "einem Urteil, „analysieren“ mit benannten Fehlern.")

d.bullets("Fun Facts: Prüfungstechnik", [
    ("Wer die Aufgabe **zuerst ganz liest**, macht messbar weniger Flüchtigkeitsfehler", 0),
    ("Mit der **leichtesten** Teilaufgabe anzufangen bringt Punkte und Ruhe", 0),
    ("Bei SQL lohnt sich, die Abfrage **erst in Worten** zu formulieren", 0),
    ("Ein **Rechenweg ohne Ergebnis** bringt mehr Punkte als ein Ergebnis ohne Weg", 0),
    ("Die letzten Minuten sind zum **Lesen**, nicht zum Schreiben", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Alle **fünf Aufgaben** unter Zeitvorgabe bearbeiten", 0),
    ("Danach mit dem Lösungsblatt vergleichen und **Punkte selbst vergeben**", 0),
    ("Zu jedem Punktverlust die **verletzte Regel** notieren", 0),
    ("Die drei häufigsten eigenen Fehler auf ein **Merkblatt** schreiben", 0),
    ("Nächste Woche: Algorithmen und Programme", 0),
])

d.save()
