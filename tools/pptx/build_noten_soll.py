#!/usr/bin/env python3
"""Wie viele Noten muss ich geben? - Doc's minimum and maximum of grades, school year 2026/27.

Doc, 04.11.2026: "Rechne mir mal bitte aus, wie viele Noten minimal und maximal ich für alle Klassen ... im
Schulhalbjahr und im Schuljahr vergeben müsste" - then "mach daraus mal bitte ein kleines Slide-Deck" and
"auch eine Folie, wo die Voraussetzungen stehen ... wer das beschließt".

Rules from svp/bewertungen.html (BGY), notenvergabe-fos.html, notenvergabe-osgy.html and the BGySO mail of
29.10.2026; pupil counts are the Untis class lists of 01.11.2026 (counts only, no names).

    python3 tools/pptx/html_deck.py build_noten_soll.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
import noten_soll_svg as F

d = MathDeck("noten-soll-2026-27.pptx")

d.title("Schuljahr 2026/27",
        "Wie viele Noten muss ich geben?",
        "Alle meine Kurse · Minimum und Maximum je Halbjahr und Schuljahr")

d.figure("Drei Zahlen – nicht verwechseln", *F.drei())

d.figure("Die Voraussetzungen", *F.voraussetzungen())

d.table_top("Leistungserhebungen: Termine je Lerngruppe", [
    ["Kurs", "Lerngruppen", "1. Halbjahr", "2. Halbjahr", "Schuljahr"],
    ["Mathe 11 · BGY26-1/2", "1", "5–7", "5–7", "10–14"],
    ["Info 11 · BGY26-1/2", "1", "3–5", "3–5", "6–10"],
    ["Info 12 GK · BGY25", "1", "3–5", "3–5", "6–10"],
    ["Info 13 GK · BGY24", "1", "3–5", "3–5", "6–10"],
    ["Info FO 12 · 6 Klassen", "5", "15", "10", "25"],
    ["Info 9a · 9b", "2", "4", "4", "8"],
    ["**Summe**", "**11**", "**33–41**", "**28–36**", "**61–77**"],
], [256, 140, 140, 140, 140], [
    ("Eine Erhebung = ein Termin für die ganze Lerngruppe", 0),
    ("FO 12: FOG25-2 und FOW25-2 schreiben zusammen, darum 5 Gruppen für 6 Klassen", 1),
], font_size=15, align=[None, "c", "c", "c", "c"], marks={7: "EEF2F8"})

d.table_top("Noten: Erhebungen mal Schüler", [
    ["Kurs", "Schüler", "je Schüler/Hj", "1. Halbjahr", "2. Halbjahr", "Schuljahr"],
    ["Mathe 11 · BGY26-1/2", "21", "5–7", "105–147", "105–147", "210–294"],
    ["Info 11 · BGY26-1/2", "21", "3–5", "63–105", "63–105", "126–210"],
    ["Info 12 GK · BGY25", "27", "3–5", "81–135", "81–135", "162–270"],
    ["Info 13 GK · BGY24", "12", "3–5", "36–60", "36–60", "72–120"],
    ["Info FO 12 · 6 Klassen", "115", "3 / 2", "345", "230", "575"],
    ["Info 9a · 9b", "41", "2", "82", "82", "164"],
    ["**Summe**", "**237**", "", "**712–874**", "**597–759**", "**1.309–1.633**"],
], [216, 96, 126, 126, 126, 126], [
    ("237 Notenempfänger, aber 216 Köpfe: die 21 aus BGY26 haben bei mir Mathe **und** Info", 0),
], font_size=15, align=[None, "c", "c", "c", "c", "c"], marks={7: "EEF2F8"})

d.figure("Ein Beispiel", *F.beispiel())

d.bullets("Annahmen", [
    ("**Info 12 · 13:** „mindestens 1 Klausur“ – gerechnet mit genau 1", 0),
    ("eine komplexe Leistung ginge zusätzlich, ist aber keine Pflicht – nicht im Maximum", 1),
    ("**Info 9:** kein Maximum vorgeschrieben – gerechnet mit meinen 2 pro Halbjahr", 0),
    ("**Info FO 12:** feste Zahl, 3 und dann 2 – keine Spanne", 0),
    ("**Vorträge:** die Noten kommen über mehrere Termine, zählen aber als eine Erhebung", 0),
    ("**Schülerzahlen:** Klassenlisten aus Untis, Stand 01.11.2026", 0),
])

d.merksatz("61–77 Termine planen – daraus werden 1.309–1.633 Noten.", label="Schuljahr 2026/27")

d.save()
