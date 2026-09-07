#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 43 / KW 25: Vertiefung - Modellierungs-Komplexaufgabe."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("modellierung-komplexaufgabe.pptx")

d.title("Informatik — Grundkurs 12", "Alles in einer Aufgabe",
        "Prozessmodell, Datenmodell und Projektplan zu einem Szenario")

d.chapter(1, "Das Szenario", "Der Schulsanitätsdienst")

d.table_top("Die Ausgangslage", [
    ["Angabe", "Beschreibung"],
    ["Einsatz", "Ein Notfall wird gemeldet, ein Team rückt aus"],
    ["Beteiligte", "Sekretariat, Sanitätsteam, Schulleitung, Rettungsdienst"],
    ["Heute", "Meldung per Telefon, Protokoll auf Papier im Ordner"],
    ["Probleme", "Protokolle unvollständig, Dienstplan von Hand, keine Auswertung"],
    ["Wunsch", "Digitale Erfassung, Dienstplan, Auswertung je Halbjahr"],
], [180, 636], [
    ("Personenbezogene Gesundheitsdaten — das macht den Datenschutz zum **Kernthema**", 0),
], font_size=11, bold_cols=(0,), marks={(5, 0): TINT_GREEN})

d.bullets("Was die Aufgabe verlangt", [
    ("**Teil 1**: Ist-Prozess vom Notruf bis zur Ablage als eEPK oder BPMN", 0),
    ("**Teil 2**: Soll-Prozess mit dem geplanten System — in derselben Notation", 0),
    ("**Teil 3**: Datenmodell als ER-Diagramm, überführt und bis 3NF normalisiert", 0),
    ("**Teil 4**: Projektplan mit Arbeitspaketen, Netzplan und kritischem Pfad", 0),
    ("**Teil 5**: eine Seite zum Datenschutz — welche Daten, wie lange, wer darf lesen?", 0),
])

d.chapter(2, "Der Zusammenhang", "Warum die Teile zusammengehören")

d.table_top("Wie ein Teil den nächsten bestimmt", [
    ["Aus …", "folgt …"],
    ["Ist- und Soll-Prozess", "der Projektumfang: die Differenz"],
    ["Soll-Prozess", "welche Daten überhaupt entstehen"],
    ["Datenentstehung", "die Entitäten des Datenmodells"],
    ["Datenmodell", "welche Auswertungen möglich sind"],
    ["Projektumfang", "Arbeitspakete, Dauer, kritischer Pfad"],
], [280, 536], [
    ("Wer die Teile getrennt bearbeitet, bekommt ein Datenmodell, das nicht zum Prozess passt", 0),
    ("**Probe**: taucht jedes Attribut irgendwo im Prozess auf? Und umgekehrt?", 0),
], font_size=11, bold_cols=(0,), marks={(1, 1): TINT_ORANGE})

d.bullets("Die Prüfschleife am Ende", [
    ("Beantwortet das Datenmodell die **Auswertungsfragen** aus dem Wunsch?", 0),
    ("Sind alle **Rollen** aus dem Prozess im Berechtigungskonzept berücksichtigt?", 0),
    ("Enthält der Projektplan ein Arbeitspaket für **jeden** Teil des Soll-Prozesses?", 0),
    ("Ist der **kritische Pfad** lückenlos und rechnerisch geprüft?", 0),
    ("Steht zu jedem gespeicherten Datum ein **Zweck**?", 0),
])

d.chapter(3, "Bewertung", "Woran gemessen wird")

d.table_top("Die Kriterien", [
    ["Teil", "Punkte", "entscheidend ist"],
    ["Ist- und Soll-Prozess", "12", "Notation korrekt, Differenz erkennbar"],
    ["Datenmodell", "12", "Kardinalitäten begründet, 3NF nachgewiesen"],
    ["Projektplan", "10", "Netzplan rechnerisch richtig"],
    ["Datenschutz", "6", "Zweckbindung und Fristen konkret"],
    ["Zusammenhang", "5", "die Teile passen zueinander"],
], [230, 130, 456], [
    ("Die letzte Zeile gibt es nur, wenn man die Aufgabe **als Ganzes** bearbeitet", 0),
    ("Sie ist erfahrungsgemäß die Zeile, die den Unterschied macht", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 0): TINT_GREEN})

d.merksatz("Prozess, Daten und Projekt sind drei Sichten auf dieselbe Sache. "
           "Passen sie nicht zueinander, stimmt mindestens eine nicht.")

d.bullets("Fun Facts: Komplexaufgaben", [
    ("In der Praxis heißt diese Kombination **Fachkonzept** — sie ist die Grundlage des Angebots", 0),
    ("Sie entsteht **vor** jeder Programmierung und wird vom Auftraggeber abgenommen", 0),
    ("Große Ausschreibungen der öffentlichen Hand verlangen genau diese Bestandteile", 0),
    ("Bei Gesundheitsdaten kommt eine **Datenschutz-Folgenabschätzung** dazu", 0),
    ("Die ist in der DSGVO für riskante Verarbeitungen ausdrücklich vorgeschrieben", 0),
])

d.bullets("Eure Aufgabe", [
    ("In Teams zu dritt, zwei Stunden Zeit", 0),
    ("Alle **fünf Teile** bearbeiten — lieber knapp als einen weglassen", 0),
    ("Am Ende die **Prüfschleife** aus Kapitel 2 durchgehen", 0),
    ("Abgabe als **ein** Dokument mit allen Teilen", 0),
    ("Nächste Woche gibt es Rückmeldung und den Jahresrückblick", 0),
])

d.save()
