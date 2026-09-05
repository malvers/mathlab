#!/usr/bin/env python3
"""Bedienung eines relationalen DBMS I: Eingabe und Sortieren (FOS 12, Woche 4)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import schema_diagram, ORA, RD, GRN, NAVY

d = Deck("dbms1-eingabe-sortieren.pptx")

d.title("Informatik — FOS 12", "Ein DBMS bedienen I",
        "Tabellen anlegen, Daten eingeben, sortieren — mit SQLite")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Werkzeug: SQLite", "Eine Datei, ein Programm — die ganze Datenbank")

d.bullets("Warum SQLite?", [
    ("Die ganze Datenbank ist **eine Datei**: schule.db — kopieren, mailen, fertig", 0),
    ("Kein Server, keine Installation im Netz: läuft **sofort** auf jedem Rechner", 0),
    ("Steckt in **jedem Smartphone** und in jedem Browser — die meistverbreitete Datenbank der Welt", 0),
    ("Grafisch: **DB Browser for SQLite** — Konsole: **sqlite3**", 0),
    ("Die Sprache ist **SQL** — dieselbe wie bei MySQL, PostgreSQL, Oracle", 0),
])

d.two_cols("Zwei Wege, ein Ergebnis", [
    ("Grafische Oberfläche", 0),
    ("Tabelle anlegen per **Dialog**: Spalte, Typ, Häkchen", 1),
    ("Daten **eintippen** wie in einer Tabellenkalkulation", 1),
    ("Sortieren: **Klick** auf den Spaltenkopf", 1),
    ("Gut zum **Ausprobieren** und Nachsehen", 1),
], [
    ("SQL-Befehle", 0),
    ("**CREATE TABLE**, **INSERT**, **ORDER BY**", 1),
    ("**Wiederholbar**: Skript speichern, neu ausführen", 1),
    ("**Kopierbar**: in jedem DBMS fast gleich", 1),
    ("Das lernen wir — die Oberfläche erklärt sich selbst", 1),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Tabellen anlegen", "Erst die Struktur: Spalten, Datentypen, Schlüssel")

schema = schema_diagram(os.path.join(IMG, "schema-schule.png"), [
    ("SCHÜLER", [("SNr", "PK"), ("Name", ""), ("Klasse", ""), ("Geburtsdatum", "")], ORA),
    ("BELEGUNG", [("SNr", "FK"), ("KNr", "FK")], RD),
    ("KURS", [("KNr", "PK"), ("Fach", ""), ("Raum", ""), ("LNr", "FK")], GRN),
    ("LEHRKRAFT", [("LNr", "PK"), ("Name", ""), ("Durchwahl", "")], NAVY),
], Hd=400)
d.picture("Der Plan: vier Tabellen für schule.db", schema, [
    ("Das ist die **aufgeteilte** Kursliste aus der letzten Woche", 0),
    ("Reihenfolge beim Anlegen: erst **Lehrkraft** und **Schüler**, dann Kurs, dann Belegung", 0),
    ("Warum? Ein **Fremdschlüssel** braucht die Tabelle, auf die er zeigt", 0),
])

d.code("Schritt 1: Lehrkraft und Schüler anlegen", [
    "-- schule.db: Tabellen ohne Fremdschlüssel zuerst",
    "CREATE TABLE Lehrkraft (",
    "  LNr        INTEGER PRIMARY KEY,",
    "  Name       TEXT    NOT NULL,",
    "  Durchwahl  INTEGER CHECK (Durchwahl BETWEEN 10 AND 99)",
    ");",
    "",
    "CREATE TABLE Schueler (",
    "  SNr           INTEGER PRIMARY KEY,",
    "  Name          TEXT NOT NULL,",
    "  Klasse        TEXT NOT NULL CHECK (Klasse IN ('FO12a', 'FO12b')),",
    "  Geburtsdatum  TEXT                  -- 'JJJJ-MM-TT', siehe Datentypen",
    ");",
])

d.code("Schritt 2: Kurs und Belegung — mit Fremdschlüsseln", [
    "PRAGMA foreign_keys = ON;              -- SQLite prüft Fremdschlüssel nur auf Wunsch!",
    "CREATE TABLE Kurs (",
    "  KNr   INTEGER PRIMARY KEY,",
    "  Fach  TEXT    NOT NULL,",
    "  Raum  TEXT,",
    "  LNr   INTEGER NOT NULL REFERENCES Lehrkraft(LNr)",
    ");",
    "",
    "CREATE TABLE Belegung (",
    "  SNr INTEGER NOT NULL REFERENCES Schueler(SNr),",
    "  KNr INTEGER NOT NULL REFERENCES Kurs(KNr),",
    "  PRIMARY KEY (SNr, KNr)               -- zusammengesetzter Schlüssel: jedes Paar nur einmal",
    ");",
])

d.table_top("Datentypen: was in eine Spalte darf", [
    ["Typ", "Bedeutung", "Beispiel", "Spalte"],
    ["INTEGER", "ganze Zahl", "1004", "SNr, Durchwahl"],
    ["REAL", "Kommazahl", "1.75", "Größe, Preis"],
    ["TEXT", "Zeichenkette", "'Lena Krause'", "Name, Klasse"],
    ["TEXT als Datum", "'JJJJ-MM-TT'", "'2008-04-17'", "Geburtsdatum"],
], [130, 170, 190, 326], [
    ("Text immer in **einfachen** Anführungszeichen: 'FO12a'", 0),
    ("SQLite hat **keinen** Datumstyp — Datum als Text in **ISO-Form** speichern", 0),
    ("Warum ISO? **'2008-04-17' < '2009-01-03'** — sortiert sich von selbst richtig", 0),
    ("Falle: '17.04.2008' sortiert nach dem **Tag** — nicht nach dem Jahr", 0),
], font_size=12, bold_cols=(0,), mono_cols=(2,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Daten eingeben", "INSERT, UPDATE, DELETE — und was das DBMS ablehnt")

d.code("INSERT: Datensätze eintragen", [
    "-- Reihenfolge der Werte = Reihenfolge der Spalten",
    "INSERT INTO Lehrkraft VALUES (1, 'Alvers', 31);",
    "INSERT INTO Lehrkraft VALUES (2, 'Schulze', 42);",
    "",
    "-- sicherer: Spalten nennen, mehrere Zeilen auf einmal",
    "INSERT INTO Schueler (SNr, Name, Klasse, Geburtsdatum) VALUES",
    "  (1001, 'Lena Krause', 'FO12a', '2008-04-17'),",
    "  (1002, 'Tim Vogel',   'FO12a', '2007-11-02'),",
    "  (1003, 'Mia Hahn',    'FO12b', '2008-09-30');",
    "",
    "INSERT INTO Kurs (KNr, Fach, Raum, LNr) VALUES (3, 'Informatik', '204', 1);",
    "INSERT INTO Belegung VALUES (1001, 3), (1002, 3), (1003, 3);",
])

d.table_top("Was das DBMS ablehnt", [
    ["Versuch", "Antwort von SQLite", "Regel"],
    ["INSERT INTO Schueler VALUES (1001, 'Ali', 'FO12a', NULL)", "UNIQUE constraint failed", "Entität"],
    ["INSERT INTO Schueler VALUES (1005, NULL, 'FO12b', NULL)", "NOT NULL constraint failed", "Entität"],
    ["INSERT INTO Schueler VALUES (1006, 'Jo', 'FO12x', NULL)", "CHECK constraint failed", "Wertebereich"],
    ["INSERT INTO Kurs VALUES (7, 'Chemie', '118', 9)", "FOREIGN KEY constraint failed", "Referenz"],
], [420, 240, 156], [
    ("Das DBMS **prüft jede Zeile** gegen die Regeln aus CREATE TABLE", 0),
    ("Fehlermeldung lesen: sie nennt die **verletzte Regel** — nicht die Zeile", 0),
    ("Fremdschlüssel-Fehler nur, wenn **PRAGMA foreign_keys = ON** gesetzt ist", 0),
], font_size=10.5, mono_cols=(0, 1), marks={(1, 1): TINT_RED, (2, 1): TINT_RED,
                                            (3, 1): TINT_RED, (4, 1): TINT_RED})

d.code("UPDATE und DELETE: nie ohne WHERE", [
    "-- Informatik zieht um: EINE Änderung, weil der Raum nur einmal gespeichert ist",
    "UPDATE Kurs SET Raum = '210' WHERE Fach = 'Informatik';",
    "",
    "-- Ben Roth verlässt die Schule: erst die Belegungen, dann der Schüler",
    "DELETE FROM Belegung WHERE SNr = 1004;",
    "DELETE FROM Schueler WHERE SNr = 1004;",
    "",
    "-- Der Kurs Mathematik bleibt erhalten - keine Löschanomalie mehr",
    "",
    "-- GEFAHR: ohne WHERE trifft es ALLE Zeilen",
    "UPDATE Kurs SET Raum = '210';          -- alle Kurse in Raum 210",
    "DELETE FROM Schueler;                  -- Tabelle leer, keine Rückfrage",
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Sortieren", "ORDER BY — eine Reihenfolge, die das DBMS herstellt")

d.code("ORDER BY: das DBMS sortiert, nicht du", [
    "-- alle Schüler, alphabetisch",
    "SELECT * FROM Schueler ORDER BY Name;",
    "",
    "-- absteigend: die Jüngsten zuerst",
    "SELECT Name, Geburtsdatum FROM Schueler ORDER BY Geburtsdatum DESC;",
    "",
    "-- mehrere Schlüssel: erst Klasse, innerhalb der Klasse nach Name",
    "SELECT Klasse, Name FROM Schueler ORDER BY Klasse, Name;",
    "",
    "-- nur die ersten drei",
    "SELECT Name FROM Schueler ORDER BY Geburtsdatum LIMIT 3;",
])

d.table_bullets("Sortieren mit zwei Schlüsseln", [
    ("**Erster Schlüssel** sortiert grob: Klasse", 0),
    ("**Zweiter Schlüssel** entscheidet bei Gleichstand: Geburtsdatum", 0),
    ("**DESC** = absteigend, ASC = aufsteigend (Standard)", 0),
    ("Die Daten in der Tabelle **bleiben** unsortiert — nur das Ergebnis ist geordnet", 0),
], [
    ["Klasse", "Name", "Geburtsdatum"],
    ["FO12a", "Lena Krause", "2008-04-17"],
    ["FO12a", "Tim Vogel", "2007-11-02"],
    ["FO12b", "Mia Hahn", "2008-09-30"],
    ["FO12b", "Ben Roth", "2008-01-25"],
], [70, 120, 120], marks={1: TINT_ORANGE, 2: TINT_ORANGE, 3: TINT_GREEN, 4: TINT_GREEN},
    font_size=11, mono_cols=(2,))

d.table_bullets("Falle: Zahlen als Text sortieren", [
    ("Als **TEXT** gespeichert, sortiert SQLite **zeichenweise**: '1' kommt vor '9', also '10' vor '9'", 0),
    ("Als **INTEGER** gespeichert, sortiert es **nach Wert**: 9 vor 10", 0),
    ("Deshalb: **Datentyp** beim Anlegen richtig wählen", 0),
    ("Fun Fact: derselbe Fehler lässt in Dateilisten Datei10 vor Datei2 stehen", 0),
], [
    ["Raum als TEXT", "Raum als INTEGER"],
    ["'118'", "9"],
    ["'204'", "10"],
    ["'210'", "118"],
    ["'9'", "204"],
    ["'95'", "210"],
], [150, 150], marks={(1, 0): TINT_RED, (4, 0): TINT_RED, (5, 0): TINT_RED},
    font_size=11, mono_cols=(0, 1), align=["r", "r"])

d.merksatz("Erst die Struktur, dann die Daten. Und nie ein UPDATE oder DELETE ohne WHERE.")

d.bullets("Eure Aufgabe: schule.db anlegen", [
    ("**schule.db** anlegen — mit DB Browser for SQLite oder sqlite3", 0),
    ("Die **vier Tabellen** mit den Regeln aus den Folien erstellen (PRAGMA nicht vergessen)", 0),
    ("Je Tabelle **fünf Datensätze** eintragen — eure eigenen Namen sind erlaubt", 0),
    ("**Drei Sortierungen**: nach Name, nach Geburtsdatum absteigend, nach Klasse und Name", 0),
    ("**Einen Fehlversuch** provozieren: Fehlermeldung notieren und die Regel benennen", 0),
])

d.save()
