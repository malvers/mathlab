#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 16 / KW 51: Aufbau und Aufgaben eines
Datenbanksystems (LB 2, Ustd. 3-4/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("datenbanksystem-aufbau-inf12.pptx")
P = lambda n: os.path.join(IMG, n)
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Das Datenbanksystem",
        "DBMS und Datenbasis, die Drei-Ebenen-Architektur und die ersten Befehle")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Aufbau", "Zwei Teile, klar getrennt")

dia = pap(P("pap-dbs-inf12.png"), 1560, 420, {
    "u": dict(pos=(200, 130), w=320, h=130, kind="io", text="Anwendung oder Nutzer"),
    "m": dict(pos=(760, 130), w=380, h=130, kind="proc",
              text="DBMS: Anfragen, Rechte, Transaktionen"),
    "b": dict(pos=(1320, 130), w=320, h=130, kind="proc", text="Datenbasis auf dem Speicher"),
}, [
    ("u", "m", "SQL"),
    ("m", "b", "Zugriff"),
    ("b", "m", "Daten", [(1320, 300), (760, 300)]),
    ("m", "u", "Ergebnis", [(560, 360), (200, 360)]),
], notes=[("Datenbasis + DBMS = Datenbanksystem", (900, 385))], size=28)
d.picture("Der Aufbau eines Datenbanksystems", dia, [
    ("Keine Anwendung greift **direkt** auf die Dateien zu — nur über das DBMS", 0),
    ("Genau das löst die fünf Probleme der Dateiverwaltung von letzter Woche", 0),
], width=816)

d.table_top("Die Aufgaben des DBMS", [
    ["Aufgabe", "heißt konkret"],
    ["Datendefinition", "Strukturen anlegen und ändern (DDL)"],
    ["Datenmanipulation", "einfügen, ändern, löschen, abfragen (DML)"],
    ["Datenintegrität", "Regeln durchsetzen: Typen, Schlüssel, Beziehungen"],
    ["Datenschutz", "Rechte je Nutzer und je Tabelle (DCL)"],
    ["Transaktionen", "mehrere Schritte ganz oder gar nicht ausführen"],
    ["Mehrbenutzerbetrieb", "gleichzeitige Zugriffe ordnen"],
    ["Datensicherung", "Sicherungskopien und Wiederherstellung"],
], [200, 616], [
    ("**DDL, DML, DCL** sind die drei Sprachteile von SQL — sie kommen in den nächsten Wochen dran", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Drei Ebenen", "Warum Programme Änderungen nicht merken")

d.table_top("Die ANSI-SPARC-Architektur", [
    ["Ebene", "beschreibt", "wer sieht sie"],
    ["externe Ebene", "Sichten je Anwendung", "Programme und Nutzer"],
    ["konzeptionelle Ebene", "das Gesamtschema aller Daten", "Datenbankentwurf"],
    ["interne Ebene", "Speicherung, Dateien, Indexe", "das DBMS"],
], [230, 350, 236], [
    ("**Datenunabhängigkeit**: ändert sich die interne Ebene, merken die Programme nichts", 0),
    ("Das ist der eigentliche Grund für die Trennung — und der größte Unterschied zur Datei", 0),
], font_size=11, bold_cols=(0,), marks={(3, 0): TINT_BLUE})

d.bullets("Was das praktisch bedeutet", [
    ("Ein **Index** wird angelegt: Abfragen werden schneller, kein Programm ändert sich", 0),
    ("Die Datenbank zieht auf einen anderen Server um: die Anwendungen merken nichts", 0),
    ("Eine **Sicht** zeigt dem Sekretariat andere Spalten als der Schulleitung", 0),
    ("Bei Dateien müsste dafür **jedes Programm** angefasst werden", 0),
    ("Deshalb ist die Trennung keine Theorie, sondern die Grundlage der Wartbarkeit", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Erste Schritte", "Eine Datenbank anlegen")

sql("Eine Datenbank und eine Tabelle anlegen", [
    "-- SQLite: die Datenbank ist eine Datei",
    "-- MySQL:  CREATE DATABASE schule;  USE schule;",
    "",
    "CREATE TABLE Schueler (",
    "    snr      INTEGER PRIMARY KEY,",
    "    name     TEXT NOT NULL,",
    "    vorname  TEXT NOT NULL,",
    "    klasse   TEXT,",
    "    geburt   DATE",
    ");",
], size=13.5)

d.bullets("Was in diesen Zeilen alles steckt", [
    ("**CREATE TABLE** gehört zur DDL — es beschreibt die Struktur, nicht die Daten", 0),
    ("**PRIMARY KEY** macht snr eindeutig und legt automatisch einen Index an", 0),
    ("**NOT NULL** ist eine Integritätsregel: das Feld darf nicht leer bleiben", 0),
    ("Die **Datentypen** entscheiden über Sortierung, Rechnen und Speicherbedarf", 0),
    ("Nach diesem Befehl ist die Tabelle **leer, aber fertig definiert**", 0),
])

d.merksatz("Datenbasis plus DBMS ergibt das Datenbanksystem. Und die drei Ebenen "
           "sorgen dafür, dass Änderungen unten oben nicht ankommen.")

d.bullets("Fun Facts: DBMS", [
    ("Das erste kommerzielle relationale DBMS war **Oracle V2** von 1979 — eine V1 gab es nie", 0),
    ("**IBM System R** war der Forschungsprototyp, in dem SQL entstand", 0),
    ("**SQLite** ist das am weitesten verbreitete DBMS der Welt — es steckt in jedem Smartphone", 0),
    ("Die **ANSI-SPARC-Architektur** wurde 1975 vorgeschlagen und gilt bis heute", 0),
    ("Ein DBMS ist eines der komplexesten Programme überhaupt — Millionen Zeilen Code", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Legt eine Datenbank **schule** an (SQLite-Datei oder MySQL)", 0),
    ("Erstellt die Tabelle **Schueler** wie oben", 0),
    ("Erstellt eine zweite Tabelle **Kurs** mit knr, bezeichnung und lehrkraft", 0),
    ("Probiert aus, was bei einem **doppelten Primärschlüssel** passiert", 0),
    ("Notiert zu jeder Aufgabe des DBMS aus Kapitel 1 **ein** Beispiel aus eurer Datenbank", 0),
])

d.save()
