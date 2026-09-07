#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 14 / KW 49: Wiederholung und Klausur 1
(LB 1: Informatische Modellierung)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("wiederholung-klausur1-inf12.pptx")

d.title("Informatik — Grundkurs 12", "LB 1 im Überblick",
        "Wiederholung und Klausur 1: Modellbegriff, Prozessketten, Projektplanung")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Modellbegriff", "Woher alles kommt")

d.table_top("Die Grundlagen aus den ersten Wochen", [
    ["Thema", "was sitzen muss"],
    ["Schrittfolge", "abgrenzen, abstrahieren, modellieren, prüfen — mit Rücksprung"],
    ["Eigenschaften", "Abbildung, Verkürzung, Pragmatik (Stachowiak 1973)"],
    ["Grenzen", "Auflösung, fehlendes Wissen, Sensitivität, Datenqualität"],
    ["Grundsätze", "Richtigkeit, Relevanz, Wirtschaftlichkeit, Klarheit, Vergleichbarkeit"],
], [180, 636], [
    ("Typische Klausuraufgabe: **die drei Eigenschaften an einem gegebenen Modell nachweisen**", 0),
    ("Und: **den Zweck eines Modells benennen und daraus die Verkürzung begründen**", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was ihr an einem fremden Modell erkennen müsst", [
    ("Welchen **Zweck** verfolgt es, und für wen ist es gemacht?", 0),
    ("Welche **Verkürzungen** wurden vorgenommen — und sind sie begründet?", 0),
    ("Wo liegt seine **Grenze**, und welcher der vier Arten gehört sie an?", 0),
    ("Ist es **formal korrekt** in seiner Notation?", 0),
    ("Und: Beantwortet es die Frage, für die es gebaut wurde?", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Prozessmodellierung", "eEPK und BPMN nebeneinander")

d.table_top("Die Regeln, die geprüft werden", [
    ["Notation", "Regel"],
    ["eEPK", "Ereignis und Funktion im Wechsel, Anfang und Ende sind Ereignisse"],
    ["eEPK", "kein XOR-Split nach einem Ereignis — Ereignisse entscheiden nicht"],
    ["eEPK", "Split und Join mit demselben Konnektortyp"],
    ["BPMN", "Sequenzfluss bleibt im Pool, zwischen Pools nur Nachrichtenfluss"],
    ["BPMN", "am exklusiven Gateway stehen Bedingungen an den Pfeilen"],
], [130, 686], [
    ("Häufige Aufgabe: **ein fehlerhaftes Modell korrigieren und die Fehler benennen**", 0),
    ("Zweite Variante: **denselben Ablauf in der anderen Notation** darstellen", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Die drei Konnektoren im Kopf behalten", [
    ("**XOR** — genau einer. Beim Zusammenführen kommt genau einer an", 0),
    ("**UND** — alle. Beim Zusammenführen wird auf alle gewartet", 0),
    ("**ODER** — mindestens einer, auch mehrere", 0),
    ("Merkhilfe: **entweder-oder**, **sowohl-als-auch**, **und/oder**", 0),
    ("Fehler Nummer eins bleibt: UND aufgemacht, XOR zugemacht", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Projektplanung", "Der Rechenteil der Klausur")

d.table_top("Die Rechnung, Schritt für Schritt", [
    ["Schritt", "Regel"],
    ["1. Vorwärts", "FAZ = größtes FEZ der Vorgänger, FEZ = FAZ + Dauer"],
    ["2. Projektdauer", "größtes FEZ aller Vorgänge"],
    ["3. Rückwärts", "SEZ = kleinstes SAZ der Nachfolger, SAZ = SEZ − Dauer"],
    ["4. Puffer", "GP = SAZ − FAZ"],
    ["5. Kritischer Pfad", "alle Vorgänge mit GP = 0, lückenlos verkettet"],
], [160, 656], [
    ("Am Ende **immer die Probe**: die Summe der Dauern auf dem kritischen Pfad = Projektdauer", 0),
    ("Fehlerquelle Nummer eins: beim Rückwärtsrechnen das **größte** statt des kleinsten SAZ nehmen", 0),
], font_size=11, bold_cols=(0,), marks={(3, 1): TINT_ORANGE})

d.bullets("So läuft die Klausur", [
    ("Dauer nach Klausurplan, **keine** Hilfsmittel außer Taschenrechner und Lineal", 0),
    ("Teil A: **Begriffe und Zusammenhänge** — kurze Antworten mit Begründung", 0),
    ("Teil B: **Modell korrigieren oder erstellen** — Notation sauber einhalten", 0),
    ("Teil C: **Netzplan rechnen** — Zwischenschritte aufschreiben, sie zählen", 0),
    ("Punkte gibt es für **Begründungen**. Ein Stichwort ist kein Argument", 0),
])

d.merksatz("In der Klausur zählt der Weg: eine falsche Zahl mit richtigem "
           "Rechenweg bringt mehr als eine richtige Zahl ohne alles.")

d.bullets("Die fünf Sätze, die alles tragen", [
    ("**Ein Modell ist eine Verkürzung für einen Zweck**", 0),
    ("**Geprüft wird gegen den Zweck, nicht gegen die Wirklichkeit**", 0),
    ("**Ereignis und Funktion wechseln sich ab**", 0),
    ("**Was mit UND aufgeht, kommt mit UND zusammen**", 0),
    ("**Der kritische Pfad hat keinen Puffer und bestimmt die Projektdauer**", 0),
])

d.bullets("Vorbereitung heute", [
    ("Geht das **Lernplakat** durch und erklärt euch die Felder gegenseitig", 0),
    ("Rechnet **einen** Netzplan komplett — mit Probe", 0),
    ("Korrigiert **ein** fehlerhaftes eEPK-Modell und benennt die Fehler", 0),
    ("Formuliert zu einem Modell die **drei Eigenschaften** in ganzen Sätzen", 0),
    ("Schreibt eure letzten offenen Fragen auf — wir klären sie vor der Klausur", 0),
])

d.save()
