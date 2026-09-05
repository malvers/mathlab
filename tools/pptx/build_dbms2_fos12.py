#!/usr/bin/env python3
"""Bedienung eines relationalen DBMS II: Suchen und Auswerten (FOS 12, Woche 5)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("dbms2-suchen-auswerten.pptx")

d.title("Informatik — FOS 12", "Ein DBMS bedienen II",
        "Fragen an die Datenbank: SELECT, WHERE — und ein bisschen Rechnen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Frage stellen: SELECT", "Spalten wählen, Zeilen filtern, Ergebnis sortieren")

d.code("Anatomie einer Abfrage", [
    "SELECT   Name, Klasse          -- WELCHE SPALTEN?   (* = alle)",
    "FROM     Schueler              -- AUS WELCHER TABELLE?",
    "WHERE    Klasse = 'FO12a'      -- WELCHE ZEILEN?    (Bedingung)",
    "ORDER BY Name;                 -- IN WELCHER REIHENFOLGE?",
    "",
    "-- Die Reihenfolge der Klauseln ist fest: SELECT, FROM, WHERE, ORDER BY",
    "-- Das Ergebnis ist immer wieder eine Tabelle - auch wenn sie nur eine Zelle hat",
    "",
    "SELECT * FROM Schueler;                 -- alles",
    "SELECT Name FROM Schueler;              -- eine Spalte",
    "SELECT DISTINCT Klasse FROM Schueler;   -- jede Klasse nur einmal",
])

d.table_bullets("Spalten wählen: die Projektion", [
    ("**SELECT** nennt die Spalten — in der Reihenfolge, in der du sie sehen willst", 0),
    ("Der **Stern** (*) heißt: alle Spalten, so wie die Tabelle angelegt ist", 0),
    ("**DISTINCT** wirft doppelte Zeilen aus dem Ergebnis", 0),
    ("Aus 4 Spalten werden 2: das Ergebnis ist **schmaler**, aber genauso lang", 0),
], [
    ["Name", "Klasse"],
    ["Lena Krause", "FO12a"],
    ["Tim Vogel", "FO12a"],
    ["Mia Hahn", "FO12b"],
    ["Ben Roth", "FO12b"],
], [130, 80], font_size=11)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Zeilen filtern: WHERE", "Bedingungen, Vergleiche, Muster")

d.code("WHERE: nur die Zeilen, die passen", [
    "SELECT * FROM Schueler WHERE Klasse = 'FO12b';",
    "SELECT * FROM Schueler WHERE Geburtsdatum < '2008-01-01';   -- vor 2008 geboren",
    "SELECT * FROM Schueler WHERE Name LIKE 'M%';                 -- beginnt mit M",
    "SELECT * FROM Kurs     WHERE Raum IN ('204', '210');",
    "SELECT * FROM Kurs     WHERE Raum IS NULL;                   -- Raum noch offen",
    "",
    "-- Bedingungen verknüpfen",
    "SELECT * FROM Schueler",
    "WHERE  Klasse = 'FO12a' AND Geburtsdatum >= '2008-01-01';",
    "",
    "SELECT * FROM Schueler",
    "WHERE  NOT (Klasse = 'FO12a' OR Name LIKE '%Hahn');",
])

d.table_top("Vergleichen und verknüpfen", [
    ["Operator", "Bedeutung", "Beispiel"],
    ["=   <>", "gleich, ungleich", "Klasse = 'FO12a'"],
    ["<  <=  >  >=", "kleiner, größer", "Durchwahl >= 30"],
    ["BETWEEN a AND b", "im Bereich, Grenzen inklusive", "Geburtsdatum BETWEEN '2008-01-01' AND '2008-12-31'"],
    ["IN (…)", "einer von mehreren Werten", "Raum IN ('204', '210')"],
    ["LIKE", "Textmuster mit % und _", "Name LIKE 'L%'"],
    ["IS NULL", "Feld ist leer", "Raum IS NULL"],
    ["AND  OR  NOT", "Bedingungen verknüpfen", "Klasse = 'FO12a' AND NOT Raum IS NULL"],
], [160, 226, 430], [
    ("**AND** bindet stärker als **OR** — im Zweifel **Klammern** setzen", 0),
    ("Ein Vergleich mit **NULL** ist nie wahr: deshalb **IS NULL**, nicht = NULL", 0),
], font_size=11, mono_cols=(0, 2))

d.table_bullets("LIKE: Muster statt Wort", [
    ("**%** steht für beliebig viele Zeichen — auch keins", 0),
    ("**_** steht für **genau ein** Zeichen", 0),
    ("'M%' = beginnt mit M — '%n' = endet auf n — '%au%' = enthält au", 0),
    ("Groß/Klein: SQLite ignoriert den Unterschied bei LIKE — andere DBMS **nicht**", 0),
], [
    ["Muster", "Trifft", "Trifft nicht"],
    ["'M%'", "Mia Hahn", "Tim Vogel"],
    ["'%n'", "Mia Hahn", "Ben Roth"],
    ["'%Vogel'", "Tim Vogel", "Ben Roth"],
    ["'B_n%'", "Ben Roth", "Berta Roth"],
    ["'%au%'", "Lena Krause", "Tim Vogel"],
], [80, 110, 100], font_size=11, mono_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Auswerten", "Zählen, rechnen, gruppieren — Fragen an viele Zeilen auf einmal")

d.code("Aggregatfunktionen: aus vielen Zeilen wird eine", [
    "SELECT COUNT(*)           FROM Schueler;                -- wie viele Schüler?",
    "SELECT COUNT(*)           FROM Schueler WHERE Klasse = 'FO12b';",
    "SELECT MIN(Geburtsdatum)  FROM Schueler;                -- die/der Älteste",
    "SELECT MAX(Durchwahl), MIN(Durchwahl) FROM Lehrkraft;",
    "SELECT AVG(Durchwahl)     FROM Lehrkraft;               -- Durchschnitt",
    "",
    "-- eine Zeile PRO GRUPPE: GROUP BY",
    "SELECT Klasse, COUNT(*) AS Anzahl",
    "FROM   Schueler",
    "GROUP BY Klasse;",
    "",
    "-- Gruppen filtern: HAVING (WHERE filtert Zeilen VOR dem Gruppieren)",
    "SELECT Klasse, COUNT(*) AS Anzahl FROM Schueler",
    "GROUP BY Klasse HAVING COUNT(*) >= 2;",
])

d.table_bullets("GROUP BY: eine Zeile pro Gruppe", [
    ("Alle Zeilen mit **gleichem** Klasse-Wert bilden eine Gruppe", 0),
    ("Pro Gruppe rechnet die Funktion: **COUNT**, SUM, AVG, MIN, MAX", 0),
    ("**AS** gibt der Ergebnisspalte einen Namen", 0),
    ("Im SELECT dürfen nur die **Gruppenspalte** und **Funktionen** stehen", 0),
], [
    ["Klasse", "Anzahl"],
    ["FO12a", "2"],
    ["FO12b", "2"],
], [80, 80], marks={1: TINT_ORANGE, 2: TINT_GREEN}, font_size=11, align=["l", "r"])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Mehrere Tabellen: JOIN", "Die aufgeteilte Kursliste wieder zusammensetzen — nur zum Lesen")

d.code("JOIN: Tabellen über den Fremdschlüssel verbinden", [
    "-- Wer belegt welchen Kurs? Drei Tabellen, zwei Verbindungen",
    "SELECT   s.Name, k.Fach, k.Raum",
    "FROM     Schueler s",
    "JOIN     Belegung b ON b.SNr = s.SNr",
    "JOIN     Kurs     k ON k.KNr = b.KNr",
    "ORDER BY k.Fach, s.Name;",
    "",
    "-- Welche Lehrkraft unterrichtet wen?",
    "SELECT   l.Name AS Lehrkraft, s.Name AS Schueler",
    "FROM     Lehrkraft l",
    "JOIN     Kurs     k ON k.LNr = l.LNr",
    "JOIN     Belegung b ON b.KNr = k.KNr",
    "JOIN     Schueler s ON s.SNr = b.SNr",
    "WHERE    l.Name = 'Alvers';",
])

d.table_bullets("Das Ergebnis sieht aus wie die alte Kursliste", [
    ("Genau die **Kursliste** von Woche 3 — aber nur als **Ergebnis**, nicht als Speicher", 0),
    ("**ON** sagt, welche Spalten zusammengehören: Fremdschlüssel = Primärschlüssel", 0),
    ("**s**, **b**, **k** sind Kurznamen für die Tabellen", 0),
    ("Die Redundanz entsteht **beim Lesen** — gespeichert ist alles genau einmal", 0),
], [
    ["Name", "Fach", "Raum"],
    ["Lena Krause", "Informatik", "210"],
    ["Mia Hahn", "Informatik", "210"],
    ["Tim Vogel", "Informatik", "210"],
    ["Ben Roth", "Mathematik", "118"],
    ["Lena Krause", "Physik", "305"],
    ["Tim Vogel", "Physik", "305"],
], [120, 110, 60], font_size=11, align=["l", "l", "r"])

d.bullets("Fun Facts: SQL", [
    ("**1970**: Edgar F. Codd (IBM) beschreibt das relationale Modell — Tabellen statt Zeigerketten", 0),
    ("**1974**: Chamberlin und Boyce nennen ihre Sprache **SEQUEL** — der Name war schon vergeben, es wurde SQL", 0),
    ("Seit **1986/87** ist SQL ANSI- und ISO-**Standard** — und bis heute nicht abgelöst", 0),
    ("Jede App auf deinem Handy stellt SQL-Abfragen an ihre **SQLite**-Datei — Nachrichten, Fotos, Kontakte", 0),
])

d.merksatz("SELECT wählt die Spalten, WHERE wählt die Zeilen — und das Ergebnis ist immer wieder eine Tabelle.")

d.bullets("Eure Aufgabe: sieben Fragen an schule.db", [
    ("Alle Schüler der **FO12b**, alphabetisch", 0),
    ("Alle, die **vor 2008** geboren sind — nur Name und Geburtsdatum", 0),
    ("Alle, deren Name mit **L** beginnt oder auf **n** endet", 0),
    ("**Wie viele** Schüler pro Klasse? Welche Klasse hat mehr?", 0),
    ("Das **älteste** Geburtsdatum — und dann der Name dazu", 0),
    ("Alle Schüler von **Alvers** — über drei Tabellen", 0),
    ("Bonus: Welche Kurse haben **weniger als zwei** Teilnehmer?", 0),
])

d.save()
