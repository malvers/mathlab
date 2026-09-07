#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 21 / KW 3: Leistungskontrolle 2 (LB 1 gesamt)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("wiederholung-lk2-info9.pptx")

d.title("Informatik — Klasse 9", "LB 1 im Ganzen",
        "Wiederholungsquiz und Leistungskontrolle 2")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der ganze Lernbereich", "Vier Bausteine, aufeinander gestapelt")

d.table_top("Was ihr seit August gelernt habt", [
    ["Baustein", "Kernsatz"],
    ["Aufbau", "Datenbasis und DBMS ergeben ein Datenbanksystem"],
    ["Struktur", "Zeile ist Datensatz, Spalte ist Datenfeld, ein Feld ist Schlüssel"],
    ["Entwurf", "erst die Frage, dann die Dinge, dann die Merkmale"],
    ["Arbeiten", "einfügen, sortieren, filtern, auswerten"],
    ["Beurteilen", "vollständig, aktuell, plausibel"],
    ["Verantwortung", "so wenig Daten wie möglich, so viele wie nötig"],
], [200, 616], [
    ("Wer diese sechs Sätze erklären kann, hat LB 1 verstanden", 0),
], font_size=11.5, bold_cols=(0,))

d.table_top("Die Begriffe, die drankommen können", [
    ["Bereich", "Begriffe"],
    ["Aufbau", "Datenbasis, DBMS, Datenbanksystem, Rechte, Sicherung"],
    ["Struktur", "Tabelle, Datensatz, Datenfeld, Wert, Schlüssel"],
    ["Typen", "Text, Zahl, Datum, Währung, Ja/Nein"],
    ["Modell", "Mini-Welt, Klasse, Objekt, Attribut"],
    ["Abfragen", "sortieren, filtern, UND, ODER, Anzahl, Summe, Durchschnitt"],
    ["Recht", "informationelle Selbstbestimmung, DSGVO, Zweckbindung"],
], [160, 656], [
    ("Zu jedem Begriff **ein** Satz und **ein** Beispiel — das reicht für die volle Punktzahl", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Wiederholungsquiz", "15 Minuten, in Teams")

d.bullets("So läuft es", [
    ("Teams zu dritt, ein Blatt je Team", 0),
    ("Zehn Fragen, jede wird **einmal** vorgelesen", 0),
    ("Absprache **flüsternd** — die anderen Teams hören sonst mit", 0),
    ("Nach jeder Frage die Auflösung: ihr korrigiert selbst", 0),
    ("Wer unter acht Punkten bleibt, weiß genau, was heute Abend dran ist", 0),
])

d.table_top("Die typischen Stolperstellen", [
    ["Stolperstelle", "richtig ist"],
    ["Postleitzahl als Zahl", "Text - sonst fehlt die führende 0"],
    ["„Kosmos UND Hans im Glück“", "ODER - ein Spiel hat einen Verlag"],
    ["Durchschnitt ohne Filterangabe", "die Zahl gilt nur für ihren Filter"],
    ["Sortieren ändert die Daten", "es ändert nur die Ansicht"],
    ["NULL ist gleich 0", "NULL heißt unbekannt"],
], [330, 486], [
    ("Diese fünf kommen in jeder Klasse — deshalb stehen sie hier noch einmal", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 0): TINT_RED for r in range(1, 6)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Leistungskontrolle 2", "Etwa 30 Minuten")

d.bullets("Was verlangt wird", [
    ("**Begriffe** erklären — in ganzen Sätzen, mit Beispiel", 0),
    ("**Datentypen** zuordnen und die Wahl begründen", 0),
    ("Einen kleinen **Entwurf** zeichnen: Kästen, Merkmale, ein Schlüssel", 0),
    ("Eine **Abfrage** in Worten beschreiben: welcher Filter, welche Auswertung?", 0),
    ("Ein Ergebnis **beurteilen**: vollständig, aktuell, plausibel?", 0),
])

d.merksatz("Punkte gibt es für Begründungen, nicht für Stichworte. "
           "Ein Satz mit „weil“ ist mehr wert als drei Wörter.")

d.bullets("Fun Facts: Prüfungen", [
    ("Wer eine Aufgabe zuerst **ganz liest**, macht messbar weniger Flüchtigkeitsfehler", 0),
    ("Mit der leichtesten Aufgabe anzufangen, bringt Punkte **und** Ruhe", 0),
    ("Eine durchgestrichene falsche Antwort kostet nichts — eine leere Zeile schon", 0),
    ("Die letzten fünf Minuten sind zum **Lesen**, nicht zum Schreiben", 0),
    ("Und: Handschrift zählt indirekt doch — was niemand lesen kann, bekommt keine Punkte", 0),
])

d.bullets("Nach der Leistungskontrolle", [
    ("Ab nächster Woche beginnt **LB 2: Projektarbeit**", 0),
    ("Ihr baut in Teams ein eigenes Produkt: Spiel, Simulation, Robotik oder Grafik", 0),
    ("Denkt bis dahin über **Themen** nach, die euch wirklich interessieren", 0),
    ("Und über die Frage: **mit wem** arbeitet ihr gut zusammen?", 0),
    ("Beides entscheidet mehr über das Ergebnis als jedes Werkzeug", 0),
])

d.save()
