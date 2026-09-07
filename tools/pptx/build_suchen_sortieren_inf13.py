#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 7 / KW 40: Ausgewaehlte Algorithmen II -
Such- und Sortieralgorithmen (LB 3, Ustd. 15-16/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("suchen-sortieren.pptx")
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Suchen und Sortieren",
        "Sequenziell, binär — und was Vergleiche zählen über den Aufwand verrät")

d.chapter(1, "Suchen", "Zwei Verfahren, ein großer Unterschied")

code("Sequenzielle Suche", [
    "def suche_seq(liste, gesucht):",
    "    for i in range(len(liste)):",
    "        if liste[i] == gesucht:",
    "            return i          # Fundstelle",
    "    return -1                 # nicht gefunden",
], size=14)

code("Binäre Suche — setzt eine sortierte Liste voraus", [
    "def suche_bin(liste, gesucht):",
    "    links, rechts = 0, len(liste) - 1",
    "    while links <= rechts:",
    "        mitte = (links + rechts) // 2",
    "        if liste[mitte] == gesucht:",
    "            return mitte",
    "        elif liste[mitte] < gesucht:",
    "            links = mitte + 1     # rechte Haelfte",
    "        else:",
    "            rechts = mitte - 1    # linke Haelfte",
    "    return -1",
], size=12.5)

d.table_top("Vergleiche im schlechtesten Fall", [
    ["Anzahl Elemente", "sequenziell", "binär"],
    ["100", "100", "7"],
    ["1 000", "1 000", "10"],
    ["1 000 000", "1 000 000", "20"],
], [280, 270, 266], [
    ("Die binäre Suche **halbiert** den Bereich bei jedem Schritt", 0),
    ("Bei einer Million Einträgen genügen **20** Vergleiche statt einer Million", 0),
    ("Der Preis: die Liste muss **sortiert** sein", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(r, 2): TINT_GREEN for r in range(1, 4)} | {(3, 1): TINT_RED})

d.chapter(2, "Sortieren", "Ein Verfahren, gründlich verstanden")

code("Selectionsort: das Minimum nach vorn holen", [
    "def selectionsort(a):",
    "    for i in range(len(a) - 1):",
    "        kleinster = i",
    "        for j in range(i + 1, len(a)):",
    "            if a[j] < a[kleinster]:",
    "                kleinster = j",
    "        a[i], a[kleinster] = a[kleinster], a[i]",
    "    return a",
], size=13.5)

d.table_top("Selectionsort an [5, 3, 8, 1]", [
    ["nach Durchlauf", "Liste", "Vergleiche"],
    ["Start", "5, 3, 8, 1", "—"],
    ["1", "1, 3, 8, 5", "3"],
    ["2", "1, 3, 8, 5", "2"],
    ["3", "1, 3, 5, 8", "1"],
], [200, 350, 266], [
    ("Insgesamt **6** Vergleiche bei 4 Elementen: 3 + 2 + 1", 0),
    ("Allgemein **n(n−1)/2** — bei 1000 Elementen fast eine halbe Million", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 1): TINT_GREEN})

d.bullets("Was das über den Aufwand sagt", [
    ("Verdoppelt man die Elemente, **vervierfacht** sich die Vergleichszahl", 0),
    ("Man sagt: der Aufwand wächst **quadratisch**, geschrieben **O(n²)**", 0),
    ("Bei der binären Suche wächst er **logarithmisch**: **O(log n)**", 0),
    ("Bei der sequenziellen Suche **linear**: **O(n)**", 0),
    ("Gute Sortierverfahren wie Mergesort schaffen **O(n · log n)**", 0),
])

d.chapter(3, "Messen statt schätzen", "Vergleiche zählen")

code("Einen Zähler einbauen", [
    "def suche_bin_gezaehlt(liste, gesucht):",
    "    vergleiche = 0",
    "    links, rechts = 0, len(liste) - 1",
    "    while links <= rechts:",
    "        mitte = (links + rechts) // 2",
    "        vergleiche = vergleiche + 1",
    "        if liste[mitte] == gesucht:",
    "            return mitte, vergleiche",
    "        elif liste[mitte] < gesucht:",
    "            links = mitte + 1",
    "        else:",
    "            rechts = mitte - 1",
    "    return -1, vergleiche",
], size=11.5)

d.merksatz("Die binäre Suche halbiert bei jedem Schritt — deshalb genügen bei "
           "einer Million Einträgen zwanzig Vergleiche. Sortiert muss sie sein.")

d.bullets("Fun Facts: Suchen und Sortieren", [
    ("Die **binäre Suche** ist berüchtigt: Jon Bentley fand, dass 90 % der Programmierer sie fehlerhaft schreiben", 0),
    ("Der häufigste Fehler ist eine falsche Grenze — **mitte + 1** statt **mitte**", 0),
    ("Ein Überlauf bei **(links + rechts)** war jahrelang in Javas Standardbibliothek", 0),
    ("**Bogosort** mischt zufällig, bis es passt — der schlechteste Algorithmus mit eigenem Namen", 0),
    ("Pythons **sorted()** benutzt Timsort, entwickelt 2002 von Tim Peters", 0),
])

d.bullets("Eure Aufgabe", [
    ("Setzt **beide Suchverfahren** um und baut je einen Vergleichszähler ein", 0),
    ("Messt an Listen mit 100, 1 000 und 10 000 Elementen", 0),
    ("Tragt die Messwerte in eine **Tabelle** ein und vergleicht mit der Theorie", 0),
    ("Implementiert **Selectionsort** und zählt die Vergleiche", 0),
    ("Beantwortet: **Ab welcher Listengröße lohnt sich Sortieren vor dem Suchen?**", 0),
])

d.save()
