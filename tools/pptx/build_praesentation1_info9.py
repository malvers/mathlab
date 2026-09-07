#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 36 / KW 19: Praesentation der Projekte I
(LB 2, Ustd. 12/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("praesentation-projekte-1.pptx")

d.title("Informatik — Klasse 9", "Zeigt, was ihr gebaut habt",
        "Präsentationen Teams 1 bis 3 — mit Bewertungsbogen und Feedback")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Ablauf", "Zehn Minuten je Team, dann Feedback")

d.table_top("So läuft die Stunde", [
    ["Zeit", "was passiert"],
    ["0–5", "Aufbau: Datei öffnen, Ton prüfen, Reihenfolge klären"],
    ["5–15", "Team 1 präsentiert, danach 3 Minuten Feedback"],
    ["18–28", "Team 2 präsentiert, danach Feedback"],
    ["31–41", "Team 3 präsentiert, danach Feedback"],
    ["41–45", "Kurzauswertung, Ausblick auf nächste Woche"],
], [130, 686], [
    ("Die Teams 4 und 5 kommen nächste Woche — die Reihenfolge steht an der Tafel", 0),
    ("Wer nicht präsentiert, **füllt den Bewertungsbogen aus**. Das ist keine Pause", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Vor dem Start, in dieser Reihenfolge", [
    ("Datei **auf dem Vorführrechner** öffnen — nicht erst suchen", 0),
    ("Einmal **starten** und wieder schließen: läuft es?", 0),
    ("**Fenstergröße** prüfen: sieht man es von hinten?", 0),
    ("**Reihenfolge** klären: wer beginnt, wer übernimmt wann?", 0),
    ("Und: **nichts mehr ändern**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Bewertungsbogen", "Produkt, Doku, Vortrag")

d.table_top("Was bewertet wird", [
    ["Bereich", "Kriterium", "Punkte"],
    ["Produkt", "Muss-Anforderungen erfüllt und lauffähig", "0–10"],
    ["Produkt", "sinnvoll gelöst, sauber aufgebaut", "0–5"],
    ["Doku", "vollständig, Probleme nachvollziehbar beschrieben", "0–8"],
    ["Vortrag", "verständlich, alle beteiligt, Zeit gehalten", "0–7"],
    ["gesamt", "", "0–30"],
], [130, 500, 186], [
    ("Das **Produkt** wiegt am schwersten — aber ohne Doku und Vortrag fehlt die Hälfte", 0),
    ("**Offen dokumentierte** Fehler kosten keine Punkte. Verschwiegene schon", 0),
], font_size=11, bold_cols=(0,), marks={(5, c): TINT_GREEN for c in range(3)})

d.bullets("Was ihr als Zuhörer tut", [
    ("**Zusehen**, nicht am eigenen Rechner weiterbauen", 0),
    ("Auf dem Bogen mitschreiben: **eine Sache, die gut war**", 0),
    ("Und **eine Frage**, die euch beim Zusehen gekommen ist", 0),
    ("Im Feedback: **beschreiben vor bewerten** — wie beim Zwischenstand", 0),
    ("Keine Vergleiche zwischen Teams. Jedes Projekt wird für sich beurteilt", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Vortragen", "Vier Dinge, die den Unterschied machen")

d.bullets("Kurz und praktisch", [
    ("**Zum Publikum sprechen**, nicht zum Bildschirm", 0),
    ("Beim Vorführen **sagen, was man gerade tut**: „Ich starte jetzt und fange drei Sterne“", 0),
    ("Bei einem Fehler **nicht entschuldigen** — erklären, dass er im Protokoll steht", 0),
    ("Am Ende **eine Sache nennen, die ihr gelernt habt**. Das bleibt hängen", 0),
    ("Und: langsamer sprechen, als sich richtig anfühlt", 0),
])

d.merksatz("Ein offen benannter Fehler wirkt souverän. Ein verschwiegener, "
           "der in der Vorführung auffällt, wirkt doppelt schlecht.")

d.bullets("Fun Facts: Vorführen", [
    ("Der Ausdruck **Demo-Effekt** heißt: was nie kaputtging, geht genau jetzt kaputt", 0),
    ("Deshalb hat jeder Profi einen **Screenshot** als Notfallplan", 0),
    ("**Steve Jobs** probte seine Vorführungen tagelang — jede Bewegung", 0),
    ("Zuhörer erinnern sich vor allem an den **Anfang** und das **Ende**", 0),
    ("Und an das, was **schiefging** — deshalb ruhig damit umgehen", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Teams 1 bis 3: **präsentieren** nach dem geplanten Ablauf", 0),
    ("Alle anderen: **Bewertungsbogen** ausfüllen, je eine Stärke und eine Frage", 0),
    ("Im Feedback: erst **beschreiben**, dann **loben**, dann **eine** Anregung", 0),
    ("Teams 4 und 5: heute Abend den **Trockenlauf** machen", 0),
    ("Alle: Abgabe **hochladen**, falls noch nicht geschehen", 0),
])

d.save()
