#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 11 / KW 46: Ethische Fragen der Nutzung von
IT-Systemen (LB 3, Ustd. 23-24/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ethik-it-systeme.pptx")

d.title("Informatik — Grundkurs 13", "Was man darf, was man kann",
        "Zulässigkeit und Zuverlässigkeit von Ergebnissen — und eine Debatte")

d.chapter(1, "Zwei Fragen", "Zuverlässig und zulässig")

d.table_top("Der Unterschied", [
    ["", "Zuverlässigkeit", "Zulässigkeit"],
    ["Frage", "Stimmt das Ergebnis?", "Darf man so entscheiden?"],
    ["prüfbar durch", "Tests, Messungen, Statistik", "Recht, Ethik, Abwägung"],
    ["zuständig", "Fachleute", "Gesellschaft und Gesetzgeber"],
    ["Beispiel", "Trefferquote 97 %", "Darf eine Maschine kündigen?"],
], [160, 330, 326], [
    ("Ein zuverlässiges System kann **unzulässig** sein — und ein zulässiges unzuverlässig", 0),
    ("Die beiden Fragen werden ständig verwechselt: **„es funktioniert doch“** beantwortet nur eine", 0),
], font_size=11, bold_cols=(0,), marks={(1, 2): TINT_ORANGE})

d.bullets("Warum 97 % nicht beruhigen", [
    ("Bei **1000 Fällen** sind das 30 Fehlentscheidungen", 0),
    ("Wen sie treffen, ist nicht zufällig — meist die **seltenen Fälle**", 0),
    ("Und die seltenen Fälle sind oft **dieselben Gruppen**, die schon vorher benachteiligt waren", 0),
    ("Die Frage ist deshalb nicht nur **wie oft**, sondern **wen** ein Fehler trifft", 0),
    ("Diese Frage beantwortet keine Trefferquote", 0),
])

d.chapter(2, "Vier Fälle", "Konkret statt allgemein")

d.table_top("Fälle für die Debatte", [
    ["Fall", "Was das System tut", "Streitfrage"],
    ["Bewerbungsfilter", "sortiert Bewerbungen vor", "Wer prüft die Aussortierten?"],
    ["Kreditvergabe", "berechnet eine Ausfallwahrscheinlichkeit", "Muss die Ablehnung begründet werden?"],
    ["Predictive Policing", "sagt Einsatzorte vorher", "Verstärkt es bestehende Muster?"],
    ["Autonomes Fahren", "entscheidet in Millisekunden", "Wer haftet bei einem Unfall?"],
], [180, 320, 316], [
    ("In allen vier Fällen ist die Technik **nicht** die Streitfrage", 0),
    ("Gestritten wird über **Verantwortung**, **Nachprüfbarkeit** und **Folgen**", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Wiederkehrende Argumentmuster", [
    ("**Effizienz**: schneller, billiger, gleichmäßiger als Menschen", 0),
    ("**Objektivität**: „die Maschine hat keine Vorurteile“ — sie hat die der Daten", 0),
    ("**Verantwortung**: wer haftet, wenn niemand die Entscheidung getroffen hat?", 0),
    ("**Nachprüfbarkeit**: kann ein Betroffener erfahren, warum?", 0),
    ("**Folgenverteilung**: wen trifft ein Fehler, und wie schwer?", 0),
])

d.chapter(3, "Die Debatte", "Regeln und Bewertung")

d.table_top("So läuft die Debatte", [
    ["Phase", "Ablauf", "Zeit"],
    ["Vorbereitung", "je Gruppe drei Argumente mit Beispiel", "15 min"],
    ["Eröffnung", "je Seite zwei Minuten", "4 min"],
    ["Freie Debatte", "abwechselnd, direkt aufeinander eingehen", "12 min"],
    ["Schlusswort", "je Seite eine Minute", "2 min"],
    ["Auswertung", "Wer hat überzeugt und warum?", "8 min"],
], [160, 430, 226], [
    ("Bewertet wird **nicht** die Position, sondern die **Qualität der Begründung**", 0),
    ("Der stärkste Punkt ist meist der, der das **Gegenargument ernst nimmt**", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 0): TINT_GREEN})

d.bullets("Was ein starkes Argument ausmacht", [
    ("Es nennt einen **konkreten Fall**, keine allgemeine Behauptung", 0),
    ("Es sagt, **wer** betroffen ist und **wie stark**", 0),
    ("Es unterscheidet **Zuverlässigkeit** und **Zulässigkeit**", 0),
    ("Es nennt eine **Bedingung**, unter der es nicht mehr gilt", 0),
    ("Und es kommt ohne den Satz „das ist eben so“ aus", 0),
])

d.merksatz("Dass ein System zuverlässig arbeitet, sagt nichts darüber, "
           "ob es eingesetzt werden darf. Das sind zwei verschiedene Fragen.")

d.bullets("Fun Facts: Ethik in der Informatik", [
    ("Die **Gesellschaft für Informatik** hat ethische Leitlinien — seit 1994, mehrfach überarbeitet", 0),
    ("Der **ACM Code of Ethics** verpflichtet Mitglieder ausdrücklich auf das Gemeinwohl", 0),
    ("Die **DSGVO** gibt ein Recht auf Erklärung bei automatisierten Einzelentscheidungen", 0),
    ("Das **Trolley-Problem** wird beim autonomen Fahren gern zitiert — es beschreibt die Praxis aber schlecht", 0),
    ("Denn in der Praxis entscheidet nicht die Maschine im Moment, sondern der **Entwickler vorher**", 0),
])

d.bullets("Eure Aufgabe", [
    ("Wählt **einen** der vier Fälle für die Debatte", 0),
    ("Bereitet je Gruppe **drei Argumente** mit konkretem Beispiel vor", 0),
    ("Benennt in jedem Argument, ob es um **Zuverlässigkeit** oder **Zulässigkeit** geht", 0),
    ("Nach der Debatte: schreibt eure **eigene** Position in fünf Sätzen auf", 0),
    ("Pflichtsatz darin: **eine Bedingung**, unter der ihr sie ändern würdet", 0),
])

d.save()
