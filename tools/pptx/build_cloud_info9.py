#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 40 / KW 22: Vertiefung - kollaboratives,
cloudbasiertes Arbeiten."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("cloud-zusammenarbeit.pptx")

d.title("Informatik — Klasse 9", "Alle im selben Dokument",
        "Cloudbasiertes Arbeiten — wie das geht und was dahintersteckt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Was heißt Cloud?", "Der Rechner steht woanders")

d.bullets("Nüchtern betrachtet", [
    ("**Cloud** heißt: die Datei liegt nicht bei euch, sondern auf einem **fremden Rechner**", 0),
    ("Dieser Rechner heißt **Server** und steht in einem Rechenzentrum", 0),
    ("Ihr seht sie im Browser — bearbeitet wird sie **dort**, nicht bei euch", 0),
    ("Deshalb sehen alle sofort dieselbe Fassung", 0),
    ("Und deshalb ist ohne Netz auch nichts zu machen", 0),
])

d.table_top("Datei per Mail gegen Datei in der Cloud", [
    ["", "Mail-Anhang", "Cloud-Dokument"],
    ["Fassungen", "jeder hat eine andere", "es gibt genau eine"],
    ["Gleichzeitig arbeiten", "geht nicht", "geht"],
    ["Wer hat was geändert?", "unklar", "steht im Verlauf"],
    ["Ohne Netz", "geht", "geht kaum"],
    ["Wo liegen die Daten?", "bei euch", "beim Anbieter"],
], [200, 300, 316], [
    ("Die letzten beiden Zeilen sind die **Kehrseite** — dafür sind die ersten drei stark", 0),
], font_size=11, bold_cols=(0,),
   marks={(r, 2): TINT_GREEN for r in range(1, 4)} | {(4, 2): TINT_ORANGE, (5, 2): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Gleichzeitig schreiben", "Wie der Server das schafft")

d.bullets("Das Grundproblem", [
    ("Zwei Leute ändern **dieselbe Stelle** im selben Moment", 0),
    ("Ohne Regel gewinnt der Zufall — und eine Änderung ist weg", 0),
    ("Der Server bringt die Änderungen deshalb in eine **Reihenfolge**", 0),
    ("Er rechnet aus, wie die zweite Änderung nach der ersten **noch passt**", 0),
    ("Genau dasselbe Problem hatte das DBMS bei gleichzeitigen Zugriffen — erinnert ihr euch?", 0),
])

d.table_top("Was ihr davon seht", [
    ["Erscheinung", "was dahintersteckt"],
    ["Farbige Cursor der anderen", "der Server meldet, wo jeder gerade ist"],
    ["Text erscheint zeichenweise", "jede Eingabe wird sofort weitergereicht"],
    ["Versionsverlauf", "jede Änderung wird mit Zeit und Person gespeichert"],
    ["Kommentare am Rand", "Anmerkungen, die den Text nicht verändern"],
], [280, 536], [
    ("Der **Versionsverlauf** ist der wichtigste Knopf: er holt Gelöschtes zurück", 0),
], font_size=11.5, bold_cols=(0,), marks={(3, 0): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Regeln fürs Miteinander", "Technik allein reicht nicht")

d.bullets("Fünf Absprachen, die Streit ersparen", [
    ("**Nicht im Text der anderen löschen** — kommentieren statt überschreiben", 0),
    ("**Abschnitte aufteilen**, damit nicht zwei an derselben Stelle sitzen", 0),
    ("**Kommentare beantworten und dann erledigen**, nicht einfach löschen", 0),
    ("Vor dem großen Umbau: **Bescheid sagen**", 0),
    ("Und: **Rechte** bewusst vergeben. Nicht jeder braucht Bearbeitungsrechte", 0),
])

d.merksatz("In der Cloud gibt es nur eine Fassung — das ist der Vorteil "
           "und die Gefahr. Der Versionsverlauf ist die Rückfahrkarte.")

d.bullets("Fun Facts: Cloud", [
    ("Das Wolkensymbol stammt aus alten **Netzplänen**: „irgendwo da draußen im Netz“", 0),
    ("Ein großes Rechenzentrum verbraucht so viel Strom wie eine **Kleinstadt**", 0),
    ("Die Technik hinter gleichzeitigem Schreiben heißt **operationale Transformation**", 0),
    ("Google Docs startete 2006 — davor galt gleichzeitiges Schreiben als kaum machbar", 0),
    ("Und: „Cloud“ heißt immer, dass die Daten auf **fremden Rechnern** liegen", 0),
])

d.bullets("Eure Aufgabe: die Cloud-Übung", [
    ("Zu viert **ein** gemeinsames Dokument anlegen", 0),
    ("Jeder schreibt **einen Abschnitt** zum Thema „Unser Projektjahr“", 0),
    ("Danach: **kommentiert** je einen Abschnitt der anderen, ohne zu löschen", 0),
    ("Probiert den **Versionsverlauf** aus: löscht etwas und holt es zurück", 0),
    ("Schreibt zum Schluss auf: **welche zwei Vorteile und welche zwei Risiken** habt ihr gemerkt?", 0),
])

d.save()
