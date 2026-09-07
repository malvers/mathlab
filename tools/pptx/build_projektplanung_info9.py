#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 23 / KW 5: Projektplanung, Qualitaetskreislauf,
Teambildung (LB 2, Ustd. 2/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("projektplanung-team.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Klasse 9", "Planen, machen, prüfen, verbessern",
        "Der Qualitätskreislauf — und wie ein Team sich organisiert")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Qualitätskreislauf", "Vier Schritte, die sich wiederholen")

dia = pap(P("pap-pdca-info9.png"), 1560, 370, {
    "p": dict(pos=(200, 130), w=320, h=120, text="PLANEN: Was, wer, bis wann?"),
    "d": dict(pos=(590, 130), w=320, h=120, text="MACHEN: umsetzen"),
    "c": dict(pos=(980, 130), w=320, h=120, text="PRÜFEN: Klappt es wirklich?"),
    "a": dict(pos=(1370, 130), w=320, h=120, text="VERBESSERN: nachziehen"),
}, [
    ("p", "d", ""), ("d", "c", ""), ("c", "a", ""),
    ("a", "p", "und wieder von vorn", [(1370, 300), (200, 300)]),
], size=30)
d.picture("Planen, machen, prüfen, verbessern", dia, [
    ("Der Kreis dreht sich **mehrmals** im Projekt, nicht nur einmal am Ende", 0),
    ("Wer erst zum Schluss prüft, findet die Fehler dann, wenn keine Zeit mehr ist", 0),
], width=816)

d.bullets("Warum gerade das Prüfen so oft ausfällt", [
    ("Es fühlt sich an, als würde man **nicht vorankommen**", 0),
    ("Es macht Arbeit sichtbar, die man **nachbessern** muss", 0),
    ("Und man muss zugeben, dass etwas **noch nicht** funktioniert", 0),
    ("Genau deshalb steht das Prüfen im Plan — mit einem **festen Termin**", 0),
    ("Faustregel: **nach jeder Doppelstunde einmal ausprobieren**, ob alles noch läuft", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Team", "Rollen, Absprachen, Meilensteine")

d.table_top("Rollen in einem kleinen Team", [
    ["Rolle", "kümmert sich um", "heißt nicht"],
    ["Leitung", "Überblick, Termine, Nachfragen", "macht alles allein"],
    ["Umsetzung", "den Hauptteil des Produkts", "arbeitet ohne Absprache"],
    ["Test", "ausprobieren, Fehler notieren", "darf nichts bauen"],
    ["Doku", "Screenshots, Verlauf, Beschreibung", "schreibt am Ende alles"],
], [140, 340, 336], [
    ("Rollen sind **Zuständigkeiten**, keine Käfige — geholfen wird trotzdem überall", 0),
    ("In einem Dreierteam übernimmt jeder **zwei** Rollen. Das ist normal", 0),
], font_size=11, bold_cols=(0,))

d.table_top("Absprachen, die Streit ersparen", [
    ["Frage", "wird am Anfang geklärt"],
    ["Wo liegen die Dateien?", "ein Ort, den alle erreichen"],
    ["Wie heißen die Dateien?", "projekt-v1, projekt-v2 — nicht „final-final“"],
    ["Wann treffen wir uns?", "fester Termin je Woche, auch kurz"],
    ["Was ist bis wann fertig?", "Meilensteine mit Datum"],
    ["Wer entscheidet im Zweifel?", "vorher festlegen, nicht mittendrin"],
], [280, 536], [
    ("Fünf Minuten am Anfang sparen später **Stunden**", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Meilensteine", "Woran man merkt, dass man im Plan ist")

d.table_top("Unsere Meilensteine bis Mai", [
    ["Wann", "Was steht dann"],
    ["Ende Februar", "Thema und Anforderungsliste stehen"],
    ["Anfang März", "Ablaufskizze und Aufgabenverteilung stehen"],
    ["Ende März", "Grundgerüst läuft"],
    ["Mitte April", "alle Kernfunktionen laufen"],
    ["Ende April", "getestet, Fehler behoben, Doku fertig"],
    ["Mai", "Präsentation"],
], [230, 586], [
    ("Ein Meilenstein ist **erreicht oder nicht** — „fast“ gibt es nicht", 0),
    ("Wer einen Meilenstein reißt, sagt es **sofort**, nicht in der Woche darauf", 0),
], font_size=11.5, bold_cols=(0,), marks={(3, 1): TINT_GREEN, (6, 1): TINT_ORANGE})

d.merksatz("Planen, machen, prüfen, verbessern — und dann wieder von vorn. "
           "Wer das Prüfen weglässt, spart keine Zeit, sondern verschiebt sie.")

d.bullets("Fun Facts: Planen im Team", [
    ("Der Kreislauf heißt in der Fachwelt **PDCA** — plan, do, check, act", 0),
    ("Er stammt von **W. E. Deming**, der damit nach 1950 die japanische Industrie mit prägte", 0),
    ("**Brooks' Gesetz**: mehr Leute in ein verspätetes Projekt zu stecken, macht es noch später", 0),
    ("Grund: jeder Neue muss eingearbeitet werden — und alle müssen sich absprechen", 0),
    ("Profis machen täglich ein **Stand-up**: drei Minuten, im Stehen, drei Fragen", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Teams bilden** — drei Personen, ausnahmsweise auch zwei oder vier", 0),
    ("**Rollen verteilen** und auf einem Blatt festhalten", 0),
    ("Die fünf **Absprachen** aus Kapitel 2 beantworten und aufschreiben", 0),
    ("Aus euren Ideen **drei Themen** auswählen und begründen, warum sie machbar sind", 0),
    ("Nächste Woche fällt die Entscheidung — bringt eure Liste mit", 0),
])

d.save()
