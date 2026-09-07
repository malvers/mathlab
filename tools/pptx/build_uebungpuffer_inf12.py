#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 39 / KW 21: Uebung und Puffer - SQL und Modellierung
nach Bedarf."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("uebung-puffer-inf12.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Üben nach Bedarf",
        "Vier Stationen zu SQL und Modellierung — jeder da, wo es hakt")

d.chapter(1, "Selbsteinschätzung", "Erst prüfen, dann üben")

d.table_top("Fünf Fragen an euch selbst", [
    ["Kann ich …", "wenn nein, Station"],
    ["… zu einem Text ein ER-Modell mit begründeten Kardinalitäten zeichnen?", "A"],
    ["… ein ER-Modell in ein Relationenschema überführen?", "A"],
    ["… eine Sammeltabelle bis zur 3NF normalisieren und begründen?", "B"],
    ["… eine Abfrage über drei Tabellen mit Gruppierung schreiben?", "C"],
    ["… eine fremde Abfrage in Worten beschreiben?", "D"],
], [560, 256], [
    ("Seid ehrlich — die Station, die weh tut, ist die richtige", 0),
], font_size=11, bold_cols=(0,))

d.chapter(2, "Die Stationen", "Mit Lösungsblatt zur Selbstkontrolle")

d.table_top("Was wo liegt", [
    ["Station", "Inhalt", "Umfang"],
    ["A — Modellieren", "drei Texte, je ER-Modell und Relationenschema", "40 min"],
    ["B — Normalisieren", "zwei Sammeltabellen bis 3NF, mit Begründung", "30 min"],
    ["C — SQL schreiben", "sechs Aufgaben, davon zwei mit GROUP BY", "40 min"],
    ["D — SQL lesen", "fünf fremde Abfragen beschreiben", "20 min"],
], [180, 430, 206], [
    ("**D** ist die unterschätzte Station: Abfragen lesen kommt in jeder Klausur vor", 0),
    ("Und es ist die einzige Station, die man ohne Rechner bearbeiten kann", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

sql("Eine Aufgabe aus Station D", [
    "SELECT s.klasse, COUNT(DISTINCT b.knr) AS kurse",
    "FROM Schueler s",
    "JOIN Belegung b ON s.snr = b.snr",
    "WHERE b.note IS NOT NULL",
    "GROUP BY s.klasse",
    "HAVING COUNT(DISTINCT b.knr) > 2",
    "ORDER BY kurse DESC;",
], size=13)

d.bullets("So beschreibt man eine fremde Abfrage", [
    ("**Von innen nach außen** lesen: erst FROM und JOIN, dann WHERE, dann GROUP BY", 0),
    ("Zuerst sagen, **welche Zeilen** überhaupt betrachtet werden", 0),
    ("Dann, **wonach gruppiert** wird — das bestimmt die Zeilen des Ergebnisses", 0),
    ("Dann, **was gerechnet** wird und welche Gruppen übrig bleiben", 0),
    ("Zum Schluss ein Satz: **„Die Abfrage liefert je Klasse …“**", 0),
])

d.chapter(3, "Selbstkontrolle", "Woran ihr merkt, dass es stimmt")

d.table_top("Die Proben", [
    ["Bereich", "Probe"],
    ["ER-Modell", "Lassen sich alle Fragen der Miniwelt beantworten?"],
    ["Relationenschema", "Hat jede Tabelle einen Schlüssel, jede n:m eine eigene Tabelle?"],
    ["Normalisierung", "Steht jede Angabe genau einmal?"],
    ["SQL", "Stimmt die Zeilenzahl mit der Erwartung?"],
    ["SQL lesen", "Passt die Beschreibung auch auf ein anderes Beispiel?"],
], [200, 616], [
    ("Wer bei jeder Aufgabe **vorher** eine Erwartung notiert, findet Fehler von allein", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Übt an der Station, die weh tut. Die leichte Aufgabe bestätigt nur, "
           "was ihr schon könnt.")

d.bullets("Fun Facts: gezielt üben", [
    ("**Deliberate Practice**: gezielt an der Schwachstelle üben schlägt Wiederholen des Ganzen", 0),
    ("Wichtig dabei ist die **sofortige Rückmeldung** — deshalb die Lösungsblätter", 0),
    ("Wer eine Aufgabe **erklären** kann, hat sie sicher verstanden", 0),
    ("**Verteiltes Üben** schlägt Pauken: zwanzig Minuten täglich statt drei Stunden am Vorabend", 0),
    ("Und: Aufgaben **mischen** ist wirksamer als thematisch sortiert zu üben", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Selbsteinschätzung** ausfüllen — fünf Fragen, ehrlich", 0),
    ("Mindestens **zwei Stationen** bearbeiten, davon eine aus dem Bereich mit „nein“", 0),
    ("Zu jeder Aufgabe **vorher** die Erwartung notieren", 0),
    ("Selbst kontrollieren und bei Fehlern die **verletzte Regel** aufschreiben", 0),
    ("Station D machen alle — Abfragen lesen kommt in jeder Klausur", 0),
])

d.save()
