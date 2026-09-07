#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 36 / KW 19: Wahlbereich KI II - Risiken von
KI-Anwendungen (WB, Ustd. 3-4/4)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ki-risiken.pptx")

d.title("Informatik — Grundkurs 12", "Risiken von KI-Anwendungen",
        "Spracherkennung, Spiele, Sicherheitssysteme — und eine Positionierung")

d.chapter(1, "Drei Anwendungsfelder", "Wo KI heute wirklich arbeitet")

d.table_top("Anwendung, Verfahren, Risiko", [
    ["Anwendung", "Verfahren", "Risiko"],
    ["Spracherkennung", "gelerntes Modell auf Audiodaten", "Dialekte und Störgeräusche"],
    ["Computerspiele", "Suchen, Planen, Lernen", "gering — Fehler kosten nichts"],
    ["Aktive Sicherheitssysteme", "Bilderkennung, Regeln, Sensorfusion", "Fehler kosten Leben"],
], [200, 300, 316], [
    ("Dasselbe Verfahren ist in einem Spiel harmlos und im Auto **sicherheitskritisch**", 0),
    ("Deshalb ist nicht das Verfahren riskant, sondern der **Einsatzzweck**", 0),
], font_size=11, bold_cols=(0,), marks={(3, 2): TINT_RED, (2, 2): TINT_GREEN})

d.bullets("Warum Sicherheitssysteme besonders sind", [
    ("Die Entscheidung fällt in **Millisekunden** — kein Mensch prüft sie nach", 0),
    ("Der **seltene Fall** ist der gefährliche: der ungewöhnliche Gegenstand auf der Fahrbahn", 0),
    ("Genau davon gab es in den Trainingsdaten **wenige** Beispiele", 0),
    ("Und das Modell antwortet auch dort mit hoher **Zuversicht**", 0),
    ("Deshalb arbeiten solche Systeme mehrstufig: **Regeln über dem gelernten Modell**", 0),
])

d.chapter(2, "Die typischen Risiken", "Fünf, die immer wiederkehren")

d.table_top("Risiko, Ursache, Gegenmittel", [
    ["Risiko", "Ursache", "Gegenmittel"],
    ["Schieflage", "unausgewogene Trainingsdaten", "Daten prüfen, Quoten messen"],
    ["Fehlende Erklärbarkeit", "das Modell hat keine Regeln", "Verfahren wählen, das erklärt"],
    ["Übertragung", "Modell für A wird auf B benutzt", "Einsatzbereich festschreiben"],
    ["Automatisierungsvertrauen", "Menschen prüfen nicht mehr nach", "Zufallskontrollen, Schulung"],
    ["Verantwortungslücke", "niemand ist zuständig", "Verantwortlichen benennen"],
], [200, 320, 296], [
    ("Nur das erste ist ein **technisches** Problem — die anderen vier sind organisatorisch", 0),
    ("Genau deshalb reicht bessere Technik als Antwort nicht aus", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 0): TINT_ORANGE})

d.bullets("Drei Fälle zum Nachdenken", [
    ("**Arbeitswelt**: ein Modell sortiert Bewerbungen vor. Wer prüft die Aussortierten?", 0),
    ("**Autonomer Verkehr**: das Fahrzeug entscheidet. Wer haftet bei einem Unfall?", 0),
    ("**Autonome Waffen**: ein System wählt Ziele. Darf ein Verfahren das überhaupt?", 0),
    ("Die dritte Frage ist keine technische — sie ist eine **ethische und rechtliche**", 0),
    ("Und sie lässt sich nicht dadurch beantworten, dass die Technik besser wird", 0),
])

d.chapter(3, "Positionierung", "Eine begründete Meinung entwickeln")

d.table_top("Der Aufbau einer Positionierung", [
    ["Teil", "Inhalt"],
    ["These", "eine klare Aussage in einem Satz"],
    ["Argument 1", "Begründung mit konkretem Beispiel"],
    ["Argument 2", "Begründung aus einer anderen Richtung"],
    ["Gegenargument", "das stärkste Gegenargument, ernsthaft entkräftet"],
    ["Bedingung", "wann würdet ihr eure Position ändern?"],
], [200, 616], [
    ("Das **Gegenargument** entscheidet über die Qualität — wer keines nennt, hat keine Position", 0),
    ("Und die **Bedingung** unterscheidet eine Position von einer Überzeugung", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 0): TINT_BLUE, (5, 0): TINT_GREEN})

d.merksatz("Nicht das Verfahren ist riskant, sondern der Zweck, für den es "
           "eingesetzt wird — und die Frage, wer die Entscheidung noch prüft.")

d.bullets("Fun Facts: Risiken", [
    ("Die **EU-KI-Verordnung** von 2024 stuft Anwendungen nach Risiko ein — von minimal bis verboten", 0),
    ("Biometrische Fernidentifizierung im öffentlichen Raum gilt dort als **Hochrisiko**", 0),
    ("Der **Uber-Unfall** von 2018 gilt als Lehrstück: das System erkannte, klassifizierte aber falsch", 0),
    ("**Automatisierungsvertrauen** ist aus der Luftfahrt gut untersucht — es steigt mit der Zuverlässigkeit", 0),
    ("Und genau deshalb ist ein System, das **fast** immer stimmt, gefährlicher als eines, das oft irrt", 0),
])

d.bullets("Eure Aufgabe: die Positionierung", [
    ("Wählt **einen** der drei Fälle: Arbeitswelt, autonomer Verkehr oder autonome Waffen", 0),
    ("Schreibt eine Positionierung nach dem **fünfteiligen Aufbau**", 0),
    ("Das Gegenargument muss **echt** sein — nicht die schwächste Variante", 0),
    ("Nennt am Ende **eine Bedingung**, unter der ihr die Position ändern würdet", 0),
    ("Zwei Minuten Vortrag, danach eine Rückfrage aus der Klasse", 0),
])

d.save()
