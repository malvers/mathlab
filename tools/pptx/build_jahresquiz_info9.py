#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 41 / KW 23: Wiederholung Jahresstoff, Quiz."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("jahresquiz-info9.pptx")

d.title("Informatik — Klasse 9", "Das ganze Jahr in einer Stunde",
        "Wiederholung von LB 1 und LB 2 — und ein Quiz zum Schluss")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "LB 1: Datenbanken", "Von der Frage bis zur Auswertung")

d.table_top("Die Kette, an der alles hängt", [
    ["Schritt", "Kernsatz"],
    ["Frage stellen", "Was will ich aus der Datenbank erfahren?"],
    ["Modell entwerfen", "Dinge, Merkmale, Beziehungen — auf Papier"],
    ["Struktur bauen", "Klasse wird Tabelle, Attribut wird Feld, ein Feld ist Schlüssel"],
    ["Daten erfassen", "über eine Maske, mit Prüfregeln"],
    ["Auswerten", "erst filtern, dann rechnen"],
    ["Beurteilen", "vollständig, aktuell, plausibel"],
], [180, 636], [
    ("Jeder Schritt setzt den vorigen voraus — deshalb geht es nur in dieser Reihenfolge", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Die Fallen, die wir gesehen haben", [
    ("**Postleitzahl als Zahl** — die führende 0 verschwindet", 0),
    ("**UND statt ODER** — null Treffer, obwohl es welche geben müsste", 0),
    ("**Durchschnitt ohne Filterangabe** — die Zahl sagt allein nichts", 0),
    ("**NULL ist nicht 0** — leere Felder zählen bei Auswertungen nicht mit", 0),
    ("**Sortieren ändert die Daten nicht** — nur die Ansicht", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "LB 2: Projektarbeit", "Von der Idee bis zur Auswertung")

d.table_top("Die Phasen und ihre Ergebnisse", [
    ["Phase", "Ergebnis"],
    ["Initiierung", "Thema und Ziel in einem Satz"],
    ["Planung", "Anforderungsliste, Aufgabenplan, Schnittstellen"],
    ["Durchführung", "Grundgerüst, Kernfunktionen, Tests, Sicherungen"],
    ["Abschluss", "Doku, Präsentation, Retrospektive"],
], [200, 616], [
    ("Und dazwischen immer wieder: **planen, machen, prüfen, verbessern**", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Die Sätze des Jahres", [
    ("**Erst denken, dann tippen**", 0),
    ("**Eine Änderung, ein Test**", 0),
    ("**Was man nicht zeichnen kann, kann man nicht programmieren**", 0),
    ("**Eine gute Anforderung kann man abhaken**", 0),
    ("**Die sparsamste Datenbank ist die sicherste**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Jahresquiz", "In Teams, zwanzig Fragen")

d.bullets("So läuft es", [
    ("Teams zu dritt, gemischt aus verschiedenen Projektteams", 0),
    ("Zwanzig Fragen quer durch LB 1 und LB 2", 0),
    ("Je Frage **dreißig Sekunden** — Absprache flüsternd", 0),
    ("Nach jeder Frage die Auflösung, mit kurzer Begründung", 0),
    ("Am Ende gibt es keine Note, sondern Ehre — und eine Lückenliste", 0),
])

d.merksatz("Ein Jahr Informatik in einem Satz: erst die Frage, dann das Modell, "
           "dann das Werkzeug — und immer wieder prüfen.")

d.bullets("Fun Facts: das Jahr in Zahlen", [
    ("Ihr habt in LB 1 mit **fünf Datentypen** gearbeitet und mindestens vier Auswertungen benutzt", 0),
    ("In LB 2 hat jedes Team sein Problem in **drei bis fünf** Teilprobleme zerlegt", 0),
    ("Der häufigste gefundene Fehler war einer an einer **Schnittstelle**", 0),
    ("Die drei Namen, die am häufigsten vorkamen: **Codd**, **Chen** und **Deming**", 0),
    ("Und die Motte von 1947 hat es in jede zweite Stunde geschafft", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Quiz** in gemischten Teams", 0),
    ("Bei jeder falschen Antwort: **notieren, was ihr nicht wusstet**", 0),
    ("Nach dem Quiz: eure **Lückenliste** anschauen", 0),
    ("Fragen, die offen bleiben, kommen an die Tafel", 0),
    ("Nächste Woche klären wir sie — bringt sie mit", 0),
])

d.save()
