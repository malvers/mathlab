#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 29 / KW 12: Pruefungsvorbereitung II -
Algorithmen und Programme."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("pruefungsvorbereitung-2.pptx")
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Prüfungsvorbereitung II",
        "Grundstrukturen, Algorithmen und die Grenzen — unter Zeitvorgabe")

d.chapter(1, "Der Überblick", "Was aus LB 3 geprüft wird")

d.table_top("Themen und Kernsätze", [
    ["Thema", "Kernsatz"],
    ["Grundstrukturen", "Folge, Auswahl, Wiederholung genügen für jeden Algorithmus"],
    ["Schleifenwahl", "for wenn die Anzahl feststeht, sonst while"],
    ["Schreibtischtest", "Wertetabelle: eine Spalte je Variable, eine Zeile je Durchlauf"],
    ["Modularisierung", "Parameter hinein, return hinaus"],
    ["Euklid", "a, b durch b, a mod b — endet, weil der Rest kleiner wird"],
    ["Suche", "sequenziell O(n), binär O(log n), sortiert nötig"],
    ["Sortieren", "Selectionsort O(n²), n(n−1)/2 Vergleiche"],
    ["Rekursion", "Basisfall und kleiner werdendes Problem"],
    ["Grenzen", "prinzipiell, zeitlich, numerisch"],
], [180, 636], [
    ("Zu jedem Algorithmus gehört: **warum endet er** und **wie viele Schritte**", 0),
], font_size=9.5, bold_cols=(0,))

d.chapter(2, "Der Schreibtischtest", "Der sicherste Punktelieferant")

code("Was gibt dieses Programm aus?", [
    "zahlen = [4, 7, 2, 9, 5]",
    "max_wert = zahlen[0]",
    "summe = 0",
    "",
    "for z in zahlen:",
    "    summe = summe + z",
    "    if z > max_wert:",
    "        max_wert = z",
    "",
    "print(summe, max_wert, summe / len(zahlen))",
], size=13)

d.table_top("Die Wertetabelle", [
    ["Durchlauf", "z", "summe nachher", "max_wert nachher"],
    ["1", "4", "4", "4"],
    ["2", "7", "11", "7"],
    ["3", "2", "13", "7"],
    ["4", "9", "22", "9"],
    ["5", "5", "27", "9"],
    ["Ausgabe", "—", "27", "9, Mittelwert 5.4"],
], [150, 130, 280, 256], [
    ("Punkte gibt es **je korrekt geführter Zeile** — auch wenn das Ende nicht stimmt", 0),
    ("Deshalb die Tabelle **immer vollständig** ausfüllen, nie im Kopf rechnen", 0),
], font_size=10.5, bold_cols=(0,), marks={(6, 2): TINT_GREEN, (6, 3): TINT_GREEN})

d.chapter(3, "Programmieren unter Zeitvorgabe", "Fünf Aufgaben, 45 Minuten")

d.table_top("Die Aufgaben", [
    ["Nr", "Aufgabe", "Zeit"],
    ["1", "Schreibtischtest zu einem gegebenen Programm", "10 min"],
    ["2", "Struktogramm zu einer Beschreibung", "10 min"],
    ["3", "Funktion schreiben: Quersumme einer Zahl", "8 min"],
    ["4", "Binäre Suche ergänzen (drei Lücken)", "10 min"],
    ["5", "Begründen, warum ein Algorithmus endet", "7 min"],
], [70, 570, 176], [
    ("Aufgabe **5** wird am häufigsten weggelassen — dabei ist sie die kürzeste", 0),
    ("Zwei Sätze genügen: **was wird kleiner** und **wo ist die Grenze**", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 1): TINT_ORANGE})

d.bullets("Auf Papier programmieren", [
    ("**Einrückung** sauber zeichnen — sie ist in Python die Struktur", 0),
    ("**Variablennamen** sprechend wählen, das spart Kommentare", 0),
    ("Syntaxfehler kosten **keine** Punkte, Denkfehler schon", 0),
    ("Bei Unsicherheit: **Kommentar** dazuschreiben, was gemeint ist", 0),
    ("Und am Ende **einmal von Hand durchlaufen** — das findet die meisten Fehler", 0),
])

d.merksatz("Zu jedem Algorithmus gehören zwei Sätze: warum er endet und "
           "wie viele Schritte er im schlechtesten Fall braucht.")

d.bullets("Fun Facts: Programmieren in Prüfungen", [
    ("Auf Papier fällt auf, was die Entwicklungsumgebung sonst verdeckt", 0),
    ("Der häufigste Fehler beim Schreibtischtest: die **erste Zeile** vergessen", 0),
    ("Der zweithäufigste: bei while die **Bedingung nach dem letzten Durchlauf** nicht prüfen", 0),
    ("**O-Notation** verlangt keine Rechnung, nur die Größenordnung", 0),
    ("Und: eine Wertetabelle mit fünf Spalten schlägt jede Erklärung in Prosa", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Die **fünf Aufgaben** unter Zeitvorgabe bearbeiten", 0),
    ("Selbst korrigieren und **Punkte vergeben**", 0),
    ("Zu jedem Fehler die **Ursache** notieren, nicht nur die Korrektur", 0),
    ("Das **Merkblatt** von letzter Woche ergänzen", 0),
    ("Nächstes Mal: Komplexaufgaben und mündliches Prüfen", 0),
])

d.save()
