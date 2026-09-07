#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 43 / KW 25: Puffer - Reserve fuer Projekttage
oder Wandertag."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("puffer-uebungszirkel.pptx")

d.title("Informatik — Klasse 9", "Reservestunde",
        "Offene Fragen klären — und ein Übungszirkel für alles aus dem Jahr")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Offene Fragen zuerst", "Von der Tafel aus der letzten Stunde")

d.bullets("So gehen wir vor", [
    ("Die Fragen von der Tafel werden **der Reihe nach** abgearbeitet", 0),
    ("Wer eine Frage beantworten kann, erklärt sie — nicht ich", 0),
    ("Erklären ist der beste Test dafür, ob man es **selbst** verstanden hat", 0),
    ("Bleibt eine Frage offen, kommt sie an die Tafel für nächste Woche", 0),
    ("Keine Frage ist zu spät. Das Jahr ist noch nicht vorbei", 0),
])

d.table_top("Die Fragen, die erfahrungsgemäß offen bleiben", [
    ["Frage", "Kurzantwort"],
    ["Wann Text, wann Zahl?", "Womit man nicht rechnet, ist Text"],
    ["UND oder ODER?", "UND verkleinert, ODER vergrößert die Treffermenge"],
    ["Wozu ein Schlüssel?", "Er macht jeden Datensatz eindeutig"],
    ["Warum erst zeichnen?", "Was man nicht zeichnen kann, kann man nicht bauen"],
    ["Warum Zwischenstände?", "Damit man zur letzten laufenden Fassung zurück kann"],
], [280, 536], [
    ("Wenn eine dieser fünf noch unklar ist: **heute** fragen, nicht im nächsten Schuljahr", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Übungszirkel", "Vier Stationen, frei wählbar")

d.table_top("Was an den Stationen liegt", [
    ["Station", "Aufgabe", "Niveau"],
    ["A", "Datentypen zuordnen und begründen", "Grundlage"],
    ["B", "Filter und Auswertungen an der Spieledatenbank", "Grundlage"],
    ["C", "Ein Datenmodell für eine neue Mini-Welt entwerfen", "mittel"],
    ["D", "Ein fremdes Projekt testen und ein Fehlerprotokoll führen", "anspruchsvoll"],
], [110, 500, 206], [
    ("Sucht euch die Station aus, bei der ihr im Jahr am **unsichersten** wart", 0),
    ("Alle Stationen haben ein **Lösungsblatt** zum Selbstkontrollieren", 0),
], font_size=11, bold_cols=(0,), marks={(4, 2): TINT_ORANGE})

d.bullets("Wie ihr am meisten davon habt", [
    ("Erst **allein** versuchen, dann das Lösungsblatt", 0),
    ("Bei einem Fehler: **warum** war es falsch? Das ist die eigentliche Übung", 0),
    ("Wer eine Station sicher schafft, hilft an der Station **einem anderen**", 0),
    ("Erklären zählt als Übung — und zwar als die wirksamste", 0),
    ("Notiert am Ende, welche Station euch am meisten gebracht hat", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Falls diese Stunde ausfällt", "Was ihr allein tun könnt")

d.bullets("Die Stunde ist Reserve — sie kann entfallen", [
    ("Dann steht das Material auf der **Lernplattform**", 0),
    ("Station A und B lassen sich zu Hause bearbeiten", 0),
    ("Für Station C reicht Papier", 0),
    ("Station D braucht ein fremdes Projekt — das geht nur in der Schule", 0),
    ("Fragen dazu kommen in die nächste Stunde", 0),
])

d.merksatz("Wer eine Aufgabe erklären kann, hat sie verstanden. "
           "Wer sie nur lösen kann, vielleicht.")

d.bullets("Fun Facts: Üben", [
    ("**Verteiltes Üben** schlägt Pauken deutlich — fünf Minuten täglich statt einer Stunde", 0),
    ("Der **Testeffekt**: sich abfragen zu lassen wirkt stärker als Wiederlesen", 0),
    ("Fehler, die man **erklärt** bekommt, vergisst man schneller als selbst gefundene", 0),
    ("Deshalb bekommt ihr Lösungsblätter statt Vorträgen", 0),
    ("Und deshalb steht am Ende jeder Station die Frage **warum**", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Zuerst: **offene Fragen** von der Tafel klären", 0),
    ("Dann: **mindestens zwei Stationen** bearbeiten", 0),
    ("Selbst kontrollieren und bei Fehlern das **Warum** notieren", 0),
    ("Wer sicher ist: an einer Station **helfen**", 0),
    ("Am Ende aufschreiben, welche Station am meisten gebracht hat", 0),
])

d.save()
