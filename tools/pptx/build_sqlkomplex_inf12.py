#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 40 / KW 22: Vertiefung - SQL-Komplexuebungen auf
realistischen Datensaetzen."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("sql-komplexuebungen.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Größere Abfragen",
        "Unterabfragen, Mengenoperationen und Auswertungen auf echten Datensätzen")

d.chapter(1, "Der Datensatz", "Größer als das Übungsbeispiel")

d.table_top("Die Ausleihdatenbank der Stadtbibliothek", [
    ["Tabelle", "Zeilen", "Inhalt"],
    ["Medium", "ca. 4 000", "Signatur, Titel, Autor, Jahr, Kategorie"],
    ["Leser", "ca. 900", "Lesernummer, Ort, Altersgruppe"],
    ["Ausleihe", "ca. 25 000", "Signatur, Lesernummer, von, bis, zurück"],
], [180, 150, 486], [
    ("Bei dieser Größe merkt man **Denkfehler an der Zeilenzahl**, nicht mehr am Augenschein", 0),
    ("Und ein JOIN ohne Bedingung liefert hier **über 20 Millionen** Zeilen", 0),
], font_size=11, bold_cols=(0,), marks={(3, 1): TINT_ORANGE})

d.bullets("Arbeitsweise bei großen Datensätzen", [
    ("Erst **COUNT(*)** je Tabelle — kennt man die Größenordnung, erkennt man Unsinn", 0),
    ("Abfragen **schrittweise** aufbauen: erst der JOIN, dann der Filter, dann die Gruppierung", 0),
    ("Zwischendurch **LIMIT 20** anhängen, um schnell zu sehen, ob die Form stimmt", 0),
    ("Erst am Ende die Aggregate — sonst sieht man die Zwischenergebnisse nie", 0),
    ("Und **immer** vorher aufschreiben, was herauskommen soll", 0),
])

d.chapter(2, "Unterabfragen", "Eine Abfrage in der Abfrage")

sql("Drei Bauformen der Unterabfrage", [
    "-- 1. skalar: liefert genau einen Wert",
    "SELECT titel FROM Medium",
    "WHERE jahr > (SELECT AVG(jahr) FROM Medium);",
    "",
    "-- 2. Mengenvergleich mit IN",
    "SELECT name FROM Leser",
    "WHERE lesernummer IN (SELECT lesernummer FROM Ausleihe",
    "                      WHERE zurueck IS NULL);",
    "",
    "-- 3. korreliert: bezieht sich auf die aeussere Zeile",
    "SELECT m.titel FROM Medium m",
    "WHERE (SELECT COUNT(*) FROM Ausleihe a",
    "       WHERE a.signatur = m.signatur) > 10;",
], size=11.5)

d.table_top("Wann welche Bauform", [
    ["Bauform", "liefert", "Achtung"],
    ["skalar", "einen einzelnen Wert", "muss wirklich einen liefern"],
    ["mit IN", "eine Wertemenge", "NULL in der Menge macht NOT IN unbrauchbar"],
    ["korreliert", "je äußerer Zeile ein Ergebnis", "kann langsam werden"],
], [150, 300, 366], [
    ("Vieles davon geht auch mit **JOIN und GROUP BY** — oft lesbarer und schneller", 0),
    ("Die Unterabfrage lohnt, wenn sie die Absicht **klarer** ausdrückt", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 2): TINT_RED})

d.chapter(3, "Komplexübungen", "Sechs Aufgaben, steigend")

d.table_top("Die Aufgaben", [
    ["Nr", "Gesucht", "braucht"],
    ["1", "Anzahl Medien je Kategorie", "GROUP BY"],
    ["2", "Kategorien mit mehr als 200 Medien", "HAVING"],
    ["3", "Leser mit noch nicht zurückgegebenen Medien", "JOIN oder IN"],
    ["4", "Das am häufigsten ausgeliehene Medium", "GROUP BY + ORDER BY + LIMIT"],
    ["5", "Medien, die nie ausgeliehen wurden", "LEFT JOIN + IS NULL"],
    ["6", "Durchschnittliche Ausleihdauer je Kategorie", "Datumsdifferenz + GROUP BY"],
], [70, 480, 266], [
    ("Aufgabe **5** ist die lehrreichste: das Fehlen von etwas findet man nur mit LEFT JOIN", 0),
    ("Aufgabe **6** braucht Datumsrechnung — die Schreibweise unterscheidet sich je DBMS", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 2): TINT_GREEN})

d.merksatz("Bei großen Datensätzen prüft nicht mehr das Auge, sondern die "
           "Zeilenzahl. Deshalb vor jeder Abfrage die Erwartung notieren.")

d.bullets("Fun Facts: große Abfragen", [
    ("**NOT IN** mit einer Unterabfrage, die NULL enthält, liefert **nie** ein Ergebnis", 0),
    ("Grund: der Vergleich mit NULL ist weder wahr noch falsch, sondern **unbekannt**", 0),
    ("Deshalb nehmen Profis dort **NOT EXISTS** oder einen LEFT JOIN", 0),
    ("**LIMIT** heißt in manchen Systemen **TOP** oder **FETCH FIRST** — der Standard kam spät", 0),
    ("Eine Abfrage über Millionen Zeilen läuft mit passendem Index oft in **Millisekunden**", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Verschafft euch mit **COUNT(*)** einen Überblick über die drei Tabellen", 0),
    ("Bearbeitet die **sechs Aufgaben**, jede mit vorher notierter Erwartung", 0),
    ("Schreibt **eine** Aufgabe sowohl mit Unterabfrage als auch mit JOIN", 0),
    ("Vergleicht beide: welche ist **lesbarer**, welche vermutlich schneller?", 0),
    ("Formuliert **zwei eigene** Fragen an den Datensatz und beantwortet sie", 0),
])

d.save()
