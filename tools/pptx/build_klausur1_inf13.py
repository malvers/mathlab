#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 12 / KW 47: Wiederholung und Klausur 1
(LB 3: Algorithmen und Programme)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("wiederholung-klausur1-inf13.pptx")
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "LB 3 im Überblick",
        "Grundstrukturen, Algorithmen, Rekursion — und die Klausur")

d.chapter(1, "Grundstrukturen", "Die Basis, auf der alles steht")

d.table_top("Was sitzen muss", [
    ["Thema", "Kern"],
    ["Grundstrukturen", "Folge, Auswahl, Wiederholung — mehr braucht kein Algorithmus"],
    ["Schleifenarten", "for wenn die Anzahl feststeht, while wenn nicht"],
    ["Schreibtischtest", "Wertetabelle: eine Spalte je Variable, eine Zeile je Durchlauf"],
    ["Modularisierung", "Parameter hinein, return hinaus, keine globalen Variablen"],
    ["Visualisierung", "Struktogramm und PAP lesen und erstellen"],
], [180, 636], [
    ("Häufigste Klausuraufgabe: **ein gegebenes Programm von Hand durchlaufen**", 0),
    ("Zweithäufigste: **aus einer Beschreibung ein Struktogramm entwickeln**", 0),
], font_size=11, bold_cols=(0,))

code("Ein Testkandidat für den Schreibtischtest", [
    "a, b = 18, 48",
    "while b != 0:",
    "    rest = a % b",
    "    a = b",
    "    b = rest",
    "print(a)",
], size=14)

d.table_top("Die Wertetabelle dazu", [
    ["Durchlauf", "a vorher", "b vorher", "rest", "a nachher", "b nachher"],
    ["1", "18", "48", "18", "48", "18"],
    ["2", "48", "18", "12", "18", "12"],
    ["3", "18", "12", "6", "12", "6"],
    ["4", "12", "6", "0", "6", "0"],
    ["—", "6", "0", "—", "Ausgabe: 6", ""],
], [130, 130, 130, 110, 160, 156], [
    ("Der erste Durchlauf **tauscht** a und b — das übersehen die meisten", 0),
    ("Ausgabe ist **6**, der ggT von 18 und 48", 0),
], font_size=10.5, bold_cols=(0,), marks={(1, 3): TINT_ORANGE, (5, 4): TINT_GREEN})

d.chapter(2, "Algorithmen", "Die vier, die drankommen")

d.table_top("Die Algorithmen des Halbjahres", [
    ["Algorithmus", "Idee", "Aufwand"],
    ["Euklid", "a, b durch b, a mod b ersetzen", "logarithmisch"],
    ["sequenzielle Suche", "jedes Element prüfen", "linear, O(n)"],
    ["binäre Suche", "Bereich halbieren, braucht sortierte Liste", "logarithmisch, O(log n)"],
    ["Selectionsort", "kleinstes Element nach vorn", "quadratisch, O(n²)"],
], [180, 380, 256], [
    ("Zu jedem Algorithmus gehört die **Begründung, warum er endet**", 0),
    ("Und die Frage: **wie viele Vergleiche** im schlechtesten Fall?", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Rekursion in der Klausur", [
    ("**Basisfall** und **Rekursionsschritt** benennen können", 0),
    ("Einen rekursiven Aufruf **schrittweise auflösen** — wie fak_rek(4)", 0),
    ("Den Unterschied **Rekursion und Iteration** begründen", 0),
    ("Erklären, warum **fib rekursiv** so teuer ist", 0),
    ("Und wissen, was ein **Stapelüberlauf** ist", 0),
])

d.chapter(3, "Die Klausur", "Aufbau und Hinweise")

d.table_top("Die vier Teile", [
    ["Teil", "Aufgabe", "Hinweis"],
    ["A", "Begriffe und Zusammenhänge", "ganze Sätze, mit Beispiel"],
    ["B", "Schreibtischtest mit Wertetabelle", "jede Spalte ausfüllen"],
    ["C", "Struktogramm oder PAP erstellen", "Notation sauber einhalten"],
    ["D", "Programm schreiben oder ergänzen", "Kommentare zählen als Begründung"],
], [110, 400, 306], [
    ("Teil **B** ist der sicherste Punktelieferant — wenn man die Tabelle vollständig führt", 0),
    ("Teil **D** wird auf Papier geschrieben: Syntaxfehler kosten dort **keine** Punkte", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_GREEN})

d.merksatz("Im Schreibtischtest gibt es Punkte für jede korrekt geführte Zeile — "
           "auch dann, wenn das Endergebnis am Ende nicht stimmt.")

d.bullets("Fun Facts: Wiederholen", [
    ("**Verteiltes Üben** schlägt Pauken deutlich — auch in der Oberstufe", 0),
    ("Der **Testeffekt**: sich abfragen zu lassen wirkt stärker als Wiederlesen", 0),
    ("Programmieraufgaben **von Hand** zu lösen deckt Denkfehler auf, die die IDE versteckt", 0),
    ("Deshalb steht in der Klausur kein Rechner auf dem Tisch", 0),
    ("Und deshalb übt man am besten **auf Papier**", 0),
])

d.bullets("Vorbereitung heute", [
    ("Führt **zwei Schreibtischtests** vollständig durch", 0),
    ("Zeichnet zu **einer Beschreibung** ein Struktogramm", 0),
    ("Löst **fak_rek(5)** schrittweise auf, wie in der Tabelle aus KW 41", 0),
    ("Begründet zu drei Algorithmen, **warum sie enden**", 0),
    ("Stellt eure letzten Fragen", 0),
])

d.save()
