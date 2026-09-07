#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 32 / KW 15: Kursabschluss - offene Fragen,
Feinschliff, Rueckblick 11 bis 13."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("kursabschluss-inf13.pptx")

d.title("Informatik — Grundkurs 13", "Kursabschluss",
        "Letzte Fragen, Unterlagen ordnen — und ein Rückblick über drei Jahre")

d.chapter(1, "Unterlagen ordnen", "Was ihr für die Prüfung braucht")

d.table_top("Die Mappe für die Prüfung", [
    ["Bereich", "was hineingehört"],
    ["Modellierung", "Schrittfolge, drei Eigenschaften, eEPK- und BPMN-Regeln"],
    ["Projektplanung", "Netzplanformeln, kritischer Pfad, ein gerechnetes Beispiel"],
    ["Datenbanken", "ER-Regeln, Überführung, drei Normalformen, SQL-Klauseln"],
    ["Algorithmen", "Grundstrukturen, Euklid, Suche, Sortieren, Rekursion"],
    ["Web und Sicherheit", "Schichten, Statuscodes, prepare, Maskierung, Hashing"],
    ["Grenzen und Ethik", "drei Grenzen, Zuverlässigkeit und Zulässigkeit"],
], [180, 636], [
    ("Je Bereich **eine Seite**, handschriftlich — Abschreiben ist die halbe Wiederholung", 0),
    ("Dazu je ein **gerechnetes Beispiel**: eine Normalisierung, ein Netzplan, eine Abfrage", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Was ihr sonst noch sichern solltet", [
    ("Euer **Webprojekt** mit Dokumentation — ein gutes Beispiel für Bewerbungen", 0),
    ("Das **Anlege-Skript** eurer Datenbank aus Jahrgangsstufe 12", 0),
    ("Die **Merkblätter** aus der Prüfungsvorbereitung", 0),
    ("Eure **Lückenliste** — sie sagt, woran ihr zuletzt arbeiten solltet", 0),
    ("Und: alles vom Schulrechner herunterladen, bevor er zurückgesetzt wird", 0),
])

d.chapter(2, "Rückblick 11 bis 13", "Wie die drei Jahre zusammenhängen")

d.table_top("Der rote Faden", [
    ["Jahrgang", "Thema", "was blieb"],
    ["11", "Informationsgesellschaft, IT-Sicherheit, Wissenschaftsbereiche", "der weite Blick"],
    ["12, LB 1", "Modellierung von Prozessen und Projekten", "erst denken, dann bauen"],
    ["12, LB 2", "Datenbanken von der Miniwelt bis SQL", "Struktur schafft Auswertbarkeit"],
    ["13, LB 3", "Algorithmen, Grenzen, Ethik", "wissen, was nicht geht"],
    ["13, LB 4", "Webprojekt mit Datenbankanbindung", "alles zusammen anwenden"],
], [130, 400, 286], [
    ("Der Bogen ist immer derselbe: **verstehen, modellieren, bauen, prüfen**", 0),
    ("Im Webprojekt kamen alle vier Schritte in einem Vorhaben zusammen", 0),
], font_size=10, bold_cols=(0,), marks={(5, 2): TINT_GREEN})

d.bullets("Die Sätze, die über den Kurs hinaus gelten", [
    ("**Ein Modell ist eine Verkürzung für einen Zweck**", 0),
    ("**Was man nicht zeichnen kann, kann man nicht programmieren**", 0),
    ("**Redundanz ist die Ursache, Inkonsistenz die Folge**", 0),
    ("**Traue niemals Eingaben**", 0),
    ("**Zuverlässig heißt nicht zulässig**", 0),
])

d.chapter(3, "Offene Fragen", "Die letzte Gelegenheit")

d.table_top("Was erfahrungsgemäß offen bleibt", [
    ["Frage", "Kurzantwort"],
    ["Wann UND, wann ODER im Filter?", "UND verkleinert, ODER vergrößert"],
    ["Wann WHERE, wann HAVING?", "Zeilen vor, Gruppen nach der Gruppierung"],
    ["Warum endet der Euklid?", "der Rest wird kleiner und ist nie negativ"],
    ["Wozu prepare?", "Werte können nie zu Befehlen werden"],
    ["Was heißt zustandslos?", "der Server erinnert sich nicht an die vorige Anfrage"],
], [330, 486], [
    ("Wenn eine dieser fünf noch wackelt: **heute** fragen", 0),
    ("Danach gibt es nur noch Konsultationen", 0),
], font_size=10.5, bold_cols=(0,))

d.merksatz("Drei Jahre in einem Satz: verstehen, modellieren, bauen, prüfen — "
           "und wissen, wo die Grenzen liegen.")

d.bullets("Fun Facts: zum Abschied", [
    ("Ihr habt in drei Jahren **fünf Modellarten**, **eine Datenbank**, **einen Algorithmenkasten** "
     "und **ein Webprojekt** gebaut", 0),
    ("Die drei Namen, die am häufigsten fielen: **Codd**, **Chen** und **Turing**", 0),
    ("Der häufigste Fehler über alle drei Jahre: der **Fremdschlüssel auf der falschen Seite**", 0),
    ("Und der häufigste Satz: **erst denken, dann tippen**", 0),
    ("Vieles davon werdet ihr vergessen. Das **Vorgehen** nicht", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Mappe** anlegen: je Bereich eine handschriftliche Seite", 0),
    ("Je ein **gerechnetes Beispiel** dazulegen", 0),
    ("**Offene Fragen** stellen — heute ist die beste Gelegenheit", 0),
    ("Unterlagen und Projekte vom Schulrechner **sichern**", 0),
    ("Termine für die **Konsultationen** vereinbaren", 0),
])

d.save()
