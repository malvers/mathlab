#!/usr/bin/env python3
"""Wiederholung LB 1 vor Klausur 1: DBMS, ER-Modell, Normalisierung (FOS 12, Woche 10)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import er_diagram, schema_diagram, ORA, RD, GRN, NAVY

d = Deck("wiederholung-lb1.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Wiederholung Lernbereich 1",
        "Datenbanken in 90 Minuten: alles, was in Klausur 1 drankommt")

d.chapter(1, "Der rote Faden", "Von der schlechten Tabelle zur sauberen Datenbank")

d.table_top("Sieben Wochen auf einer Folie", [
    ["Woche", "Thema", "Das musst du können"],
    ["3", "Anforderungen", "Redundanz erkennen, drei Anomalien benennen, vier Integritätsregeln zuordnen"],
    ["4", "DBMS I", "CREATE TABLE mit Datentypen und Regeln, INSERT, UPDATE/DELETE mit WHERE, ORDER BY"],
    ["5", "DBMS II", "SELECT, WHERE mit LIKE/IN/BETWEEN, COUNT und GROUP BY, ein JOIN"],
    ["6", "ER-Modell I", "Text lesen, Entitäten/Attribute/Beziehungen zeichnen, Kardinalität begründen"],
    ["7", "ER-Modell II", "Drei Überführungsregeln, PK/FK markieren, Schema in SQL schreiben"],
    ["8", "Normalisierung", "1NF, 2NF, 3NF prüfen und Verstöße beheben"],
    ["9", "Mini-Datenbank", "Die ganze Kette an einem eigenen Beispiel"],
], [60, 130, 626], [
    ("Die Klausur folgt **genau dieser Kette**: Text → Modell → Tabellen → Abfragen", 0),
], font_size=11, bold_cols=(0, 1))

d.chapter(2, "Übung 1: Anomalien und Integrität", "Die Kursliste, ein letztes Mal")

d.table_top("Übung 1: Was ist hier falsch?", [
    ["BNr", "Datum", "Kunde", "Adresse", "Pizza", "Preis", "Fahrer", "Handy"],
    ["501", "2026-09-01", "Krause", "Ringstr. 4", "Margherita", "7,50", "Ali", "0170-1"],
    ["501", "2026-09-01", "Krause", "Ringstr. 4", "Salami", "8,50", "Ali", "0170-1"],
    ["502", "2026-09-01", "Vogel", "Parkweg 12", "Salami", "8,50", "Ali", "0170-1"],
    ["503", "2026-09-02", "Krause", "Ringstr. 4", "Funghi", "8,00", "Ben", "0171-9"],
    ["504", "2026-09-02", "Hahn", "Am Hang 3", "Salami", "8,50", "NULL", "NULL"],
], [46, 90, 80, 110, 100, 60, 70, 70], [
    ("Nennt **drei Redundanzen** und je **eine** Einfüge-, Änderungs- und Löschanomalie", 0),
    ("Welche **Integritätsregel** verletzt die letzte Zeile, wenn Fahrer Pflicht ist? Und Preis = 'acht'?", 0),
    ("Lösung: Adresse und Handy doppelt; Preis der Salami dreimal; Fahrer ohne Bestellung nicht speicherbar; letzte Zeile: NOT NULL, Preis: Wertebereich", 1),
], font_size=10.5, bold_cols=(0,), marks={(1, 3): TINT_ORANGE, (2, 3): TINT_ORANGE, (4, 3): TINT_ORANGE,
                                           (1, 7): TINT_GREEN, (2, 7): TINT_GREEN, (3, 7): TINT_GREEN,
                                           (5, 6): TINT_RED, (5, 7): TINT_RED})

d.chapter(3, "Übung 2: SQL", "Lesen und schreiben")

d.code("Übung 2a: Was liefern diese Abfragen?", [
    "SELECT Name FROM Schueler WHERE Klasse = 'FO12b' ORDER BY Name;",
    "",
    "SELECT COUNT(*) FROM Belegung WHERE KNr = 3;",
    "",
    "SELECT Klasse, COUNT(*) AS n FROM Schueler GROUP BY Klasse HAVING COUNT(*) > 1;",
    "",
    "SELECT s.Name, k.Fach",
    "FROM   Schueler s JOIN Belegung b ON b.SNr = s.SNr JOIN Kurs k ON k.KNr = b.KNr",
    "WHERE  k.Raum = '204';",
    "",
    "-- und was passiert hier?",
    "DELETE FROM Schueler WHERE SNr = 1001;      -- mit PRAGMA foreign_keys = ON",
])

d.code("Übung 2b: Schreibt die Abfragen", [
    "-- 1  Alle Kurse in Raum 305, nach Fach sortiert",
    "-- 2  Alle Schüler, die 2008 geboren sind (Geburtsdatum als 'JJJJ-MM-TT')",
    "-- 3  Wie viele Kurse leitet jede Lehrkraft? (Lehrkraft-Name und Anzahl)",
    "-- 4  Namen aller Schüler von Frau Berger",
    "-- 5  Die Lehrkraft mit der höchsten Durchwahl",
    "",
    "-- Lösungen (erst selbst versuchen!)",
    "SELECT * FROM Kurs WHERE Raum = '305' ORDER BY Fach;",
    "SELECT * FROM Schueler WHERE Geburtsdatum BETWEEN '2008-01-01' AND '2008-12-31';",
    "SELECT l.Name, COUNT(*) FROM Lehrkraft l JOIN Kurs k ON k.LNr = l.LNr GROUP BY l.LNr;",
    "SELECT s.Name FROM Schueler s JOIN Belegung b ON b.SNr = s.SNr",
    "  JOIN Kurs k ON k.KNr = b.KNr JOIN Lehrkraft l ON l.LNr = k.LNr WHERE l.Name = 'Berger';",
    "SELECT Name FROM Lehrkraft ORDER BY Durchwahl DESC LIMIT 1;",
])

d.chapter(4, "Übung 3: Modell und Tabellen", "Vom Text zur Datenbank")

d.bullets("Übung 3a: Der Auftragstext", [
    ("„Eine **Fahrschule** verwaltet Fahrschüler mit Nummer, Name und Geburtsdatum.“", 0),
    ("„Jeder Fahrschüler nimmt **Fahrstunden**; jede Fahrstunde hat Datum, Dauer und wird von **einem** Fahrlehrer gegeben.“", 0),
    ("„Ein Fahrlehrer (Nummer, Name) gibt **viele** Fahrstunden und fährt **ein** bestimmtes Auto (Kennzeichen, Typ).“", 0),
    ("Aufgabe: **ER-Diagramm** mit Kardinalitäten, dann die **Tabellen** mit PK und FK", 0),
    ("Zusatz: Ist Fahrstunde eine Entität oder eine Beziehung? **Begründet** es", 0),
])

fs = er_diagram(P("er-fahrschule.png"), 1820, 620, {
    "Fahrschüler": {"pos": (300, 380), "color": ORA,
                    "attrs": [("FSNr", True, (-200, -170)), ("Name", False, (0, -210)), ("Geburtsdatum", False, (200, -170))]},
    "Fahrstunde":  {"pos": (910, 380), "color": RD,
                    "attrs": [("StNr", True, (-200, -170)), ("Datum", False, (0, -210)), ("Dauer", False, (200, -170))]},
    "Fahrlehrer":  {"pos": (1520, 380), "color": GRN,
                    "attrs": [("FLNr", True, (-200, -170)), ("Name", False, (0, -210)), ("Auto", False, (200, -170))]},
}, [
    {"name": "nimmt", "pos": (605, 380), "ends": [("Fahrschüler", "1"), ("Fahrstunde", "n")]},
    {"name": "gibt", "pos": (1215, 380), "ends": [("Fahrlehrer", "1"), ("Fahrstunde", "n")]},
], notes=[("Auto (Kennzeichen, Typ) kann eigener Entitätstyp sein: Fahrlehrer fährt 1:1 Auto", (910, 580))])
d.picture("Übung 3a: eine Lösung", fs, [
    ("Fahrstunde ist hier **Entität**: sie hat eigenen Schlüssel und Attribute und hängt an **zwei** 1:n-Beziehungen", 0),
    ("Tabellen: Fahrschüler(FSNr, …), Fahrlehrer(FLNr, …), **Fahrstunde(StNr, Datum, Dauer, FSNr, FLNr)**", 0),
], width=600)

d.table_top("Übung 3b: Normalisieren", [
    ["StNr", "Datum", "FSNr", "FSName", "FLNr", "FLName", "Kennzeichen"],
    ["1", "2026-09-03", "10", "Krause", "2", "Berger", "DD-FS 22"],
    ["2", "2026-09-03", "11", "Vogel", "2", "Berger", "DD-FS 22"],
    ["3", "2026-09-04", "10", "Krause", "3", "Schulze", "DD-FS 31"],
], [50, 100, 60, 110, 60, 110, 120], [
    ("In welcher Normalform ist die Tabelle? Welche **Abhängigkeiten** verletzen 3NF?", 0),
    ("Lösung: 1NF ja, 2NF ja (Schlüssel StNr ist einspaltig), **3NF nein**: FSName hängt von FSNr, FLName und Kennzeichen von FLNr", 1),
    ("Ergebnis: **drei Tabellen** — Fahrschüler, Fahrlehrer, Fahrstunde mit zwei Fremdschlüsseln", 1),
], font_size=11, bold_cols=(0,), marks={(1, 3): TINT_ORANGE, (3, 3): TINT_ORANGE,
                                        (1, 5): TINT_GREEN, (2, 5): TINT_GREEN, (1, 6): TINT_GREEN, (2, 6): TINT_GREEN})

d.two_cols("Klassische Klausurfehler", [
    ("Das passiert oft", 0),
    ("Fremdschlüssel auf der **1-Seite**", 1),
    ("n:m ohne **Beziehungstabelle**", 1),
    ("**= NULL** statt IS NULL, LIKE ohne **%**", 1),
    ("Kardinalität **geraten** statt mit zwei Fragen begründet", 1),
], [
    ("So sammelst du Punkte", 0),
    ("Jede Regel **benennen** (Entitäts-, referentielle, Wertebereichsintegrität)", 1),
    ("PK **unterstreichen**, FK **markieren**", 1),
    ("SQL **vollständig**: SELECT, FROM, WHERE, Semikolon", 1),
    ("Bei Normalformen die **Abhängigkeit nennen**, die verletzt ist", 1),
])

d.merksatz("Text lesen, Modell zeichnen, Regeln anwenden, SQL schreiben — und jede Entscheidung mit einem Satz begründen.")

d.bullets("Bis zur Klausur", [
    ("Die **sieben Wochentests** noch einmal durchklicken — jede Frage, die ihr nicht sicher wisst, nachschlagen", 0),
    ("Die **Pizzeria-Tabelle** komplett durchziehen: Anomalien, ER-Modell, Überführung, 3NF, fünf Abfragen", 0),
    ("Eure **Mini-Datenbank** öffnen und drei neue Fragen in SQL beantworten", 0),
    ("Klausur: **90 Minuten**, ohne Rechner, SQL von Hand — Syntaxfehler kosten weniger als fehlende Logik", 0),
])

d.save()
