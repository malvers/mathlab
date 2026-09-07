#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 17 / KW 52: Relationales DBMS - Eingabe und Sortieren
von Daten (LB 2, Ustd. 5-6/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("dbms-eingabe-sortieren.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Daten hinein, sortiert heraus",
        "INSERT, SELECT und ORDER BY — die ersten Abfragen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Daten einfügen", "INSERT und die Integritätsregeln")

sql("Datensätze einfügen", [
    "INSERT INTO Schueler (snr, name, vorname, klasse, geburt)",
    "VALUES (1, 'Meier', 'Anna', 'BGY25', '2009-04-17');",
    "",
    "-- mehrere auf einmal",
    "INSERT INTO Schueler (snr, name, vorname, klasse, geburt) VALUES",
    "  (2, 'Schulz', 'Ben',    'BGY25', '2009-11-02'),",
    "  (3, 'Krause', 'Chiara', 'BGY25', '2010-01-25');",
], size=13)

d.table_top("Was das DBMS beim Einfügen prüft", [
    ["Regel", "wird verletzt durch", "Reaktion"],
    ["Primärschlüssel eindeutig", "snr 1 ein zweites Mal", "Fehler, nichts wird gespeichert"],
    ["NOT NULL", "name weggelassen", "Fehler"],
    ["Datentyp", "geburt = 'morgen'", "Fehler oder Umwandlung"],
    ["Fremdschlüssel", "Kurs, den es nicht gibt", "Fehler (später)"],
], [230, 250, 336], [
    ("Diese Prüfungen heißen **Integritätsbedingungen** — sie stehen in der Tabellendefinition", 0),
    ("Sie greifen bei **jedem** Zugriff, egal welches Programm einfügt", 0),
], font_size=11, bold_cols=(0,), marks={(r, 2): TINT_RED for r in range(1, 5)})

d.bullets("Ändern und Löschen", [
    ("**UPDATE Schueler SET klasse = 'BGY24' WHERE snr = 2;**", 0),
    ("**DELETE FROM Schueler WHERE snr = 3;**", 0),
    ("Die **WHERE-Klausel** ist der wichtigste Teil: ohne sie trifft es **alle** Zeilen", 0),
    ("Ein vergessenes WHERE bei UPDATE ist der Klassiker unter den teuren Fehlern", 0),
    ("Deshalb: erst als **SELECT** schreiben, prüfen, dann in UPDATE umwandeln", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Daten ausgeben", "SELECT in seiner Grundform")

sql("Die Grundform der Abfrage", [
    "SELECT *                       -- alle Spalten",
    "FROM Schueler;                 -- aus dieser Tabelle",
    "",
    "SELECT name, vorname           -- Projektion: nur diese Spalten",
    "FROM Schueler;",
    "",
    "SELECT name, vorname",
    "FROM Schueler",
    "WHERE klasse = 'BGY25';        -- Selektion: nur diese Zeilen",
], size=13)

d.table_top("Die beiden Grundoperationen", [
    ["Operation", "wählt aus", "im SQL"],
    ["Projektion", "Spalten", "die Liste hinter SELECT"],
    ["Selektion", "Zeilen", "die Bedingung hinter WHERE"],
], [200, 300, 316], [
    ("Die Begriffe stammen aus der **Relationenalgebra** und werden in der Klausur verlangt", 0),
    ("Beides zusammen ergibt einen **Ausschnitt** der Tabelle — waagerecht und senkrecht", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Sortieren", "ORDER BY und seine Tücken")

sql("Sortiert ausgeben", [
    "SELECT name, vorname, klasse",
    "FROM Schueler",
    "ORDER BY name;                      -- aufsteigend ist Standard",
    "",
    "SELECT name, vorname, geburt",
    "FROM Schueler",
    "ORDER BY geburt DESC;               -- juengste zuerst",
    "",
    "SELECT klasse, name, vorname",
    "FROM Schueler",
    "ORDER BY klasse ASC, name ASC;      -- zwei Kriterien",
], size=12.5)

d.bullets("Worauf man beim Sortieren achtet", [
    ("**ASC** ist die Voreinstellung, **DESC** kehrt die Reihenfolge um", 0),
    ("Bei zwei Kriterien entscheidet das zweite nur bei **Gleichstand** im ersten", 0),
    ("Eine Zahl im **Textfeld** sortiert als Text: „10“ steht vor „2“", 0),
    ("**NULL-Werte** landen je nach DBMS am Anfang oder am Ende — nachsehen lohnt", 0),
    ("Sortiert wird nur die **Ausgabe** — die gespeicherte Reihenfolge ist ohnehin nicht garantiert", 0),
])

d.merksatz("Ohne WHERE trifft UPDATE und DELETE jede Zeile. "
           "Deshalb jede Änderung zuerst als SELECT schreiben und ansehen.")

d.bullets("Fun Facts: SQL", [
    ("SQL entstand ab **1974** bei IBM und hieß zuerst **SEQUEL** — der Name war markenrechtlich belegt", 0),
    ("Deshalb sprechen viele bis heute „Sequel“ statt „Es-Ku-El“", 0),
    ("SQL ist eine **deklarative** Sprache: man sagt **was**, nicht **wie**", 0),
    ("Den **wie**-Teil bestimmt der Abfrageoptimierer des DBMS — oft besser als ein Mensch", 0),
    ("Ein vergessenes WHERE bei UPDATE hat schon ganze Kundendatenbanken gleichgemacht", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Fügt **zehn Schüler** und **drei Kurse** ein", 0),
    ("Provoziert absichtlich einen Fehler bei **Primärschlüssel** und bei **NOT NULL**", 0),
    ("Gebt alle Schüler einer Klasse aus, **sortiert nach Name**", 0),
    ("Sortiert nach **Geburtsdatum absteigend** und erklärt die Reihenfolge", 0),
    ("Schreibt ein **UPDATE** zuerst als SELECT, prüft es und führt es dann aus", 0),
])

d.save()
