#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 32 / KW 15: Umsetzung IV - Fertigstellung
(LB 2, Ustd. 9/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("umsetzung-4-fertigstellung.pptx")

d.title("Informatik — Klasse 9", "Fertig heißt fertig",
        "Feinschliff, Restaufgaben — und den Fremdtest vorbereiten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Was heißt fertig?", "Die Anforderungsliste entscheidet")

d.table_top("Der Abgleich", [
    ["Frage", "Antwort heute"],
    ["Sind alle Muss-Punkte erfüllt?", "abhaken, einzeln, mit Probe"],
    ["Läuft es auch ohne euch?", "jemand Fremdes muss es starten können"],
    ["Startet es zuverlässig?", "dreimal hintereinander probieren"],
    ["Gibt es Reste?", "auskommentierter Kram, unbenutzte Figuren, Testausgaben"],
], [300, 516], [
    ("**Fertig** ist keine Gefühlssache — es steht in der Anforderungsliste", 0),
    ("Ein Muss-Punkt, der nicht läuft, wird **entweder** heute fertig **oder** offen dokumentiert", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Feinschliff, der sich lohnt", [
    ("**Startbildschirm** mit Titel und einer Zeile Anleitung", 0),
    ("**Rückmeldung** an den Nutzer: Was ist gerade passiert?", 0),
    ("**Aufräumen**: unbenutzte Objekte und Testausgaben entfernen", 0),
    ("**Namen** vergeben, die man versteht — auch für den Fremdtest", 0),
    ("Was nicht in fünf Minuten geht, kommt auf die **Kann-Liste** und bleibt vielleicht liegen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Fremdtest", "Ein anderes Team probiert es aus")

d.bullets("Warum ihr nicht selbst testen könnt", [
    ("Ihr wisst, **wie** man es bedienen muss — und macht es automatisch richtig", 0),
    ("Ihr kennt die Stellen, die wackeln — und meidet sie unbewusst", 0),
    ("Ein Fremder klickt dorthin, wo ihr nie geklickt habt", 0),
    ("Und genau dort finden sich die Fehler, die in der Präsentation auffallen würden", 0),
    ("Deshalb: **testen lassen**, nicht selbst testen", 0),
])

d.table_top("Was ihr für den Fremdtest vorbereitet", [
    ["Vorbereitung", "warum"],
    ["Eine laufende Fassung", "nicht die, an der gerade jemand baut"],
    ["Eine Zeile Anleitung", "wie startet man, was ist das Ziel?"],
    ["Die Liste der Muss-Punkte", "die Tester wissen, was sie prüfen sollen"],
    ["Ein leeres Fehlerprotokoll", "damit die Funde nicht mündlich verpuffen"],
], [280, 536], [
    ("Sagt den Testern **nicht**, wie sie es bedienen sollen. Genau das wollt ihr herausfinden", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Fehlerprotokoll", "Damit nichts verloren geht")

d.table_top("So wird ein Fehler notiert", [
    ["Nr", "Was passiert", "Wann", "Schwere"],
    ["1", "Punkte bleiben bei 0", "nach Neustart", "hoch"],
    ["2", "Figur läuft aus dem Bild", "am linken Rand", "mittel"],
    ["3", "Schrift überlappt", "bei dreistelliger Punktzahl", "niedrig"],
], [70, 340, 250, 156], [
    ("Wichtig ist die Spalte **Wann** — ein Fehler, den man nicht wiederholen kann, ist schwer zu finden", 0),
    ("**Schwere** entscheidet die Reihenfolge: hoch zuerst, niedrig vielleicht gar nicht", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 3): TINT_RED, (2, 3): TINT_ORANGE, (3, 3): TINT_GREEN})

d.merksatz("Fertig ist, was auf der Anforderungsliste abgehakt ist — "
           "und was jemand Fremdes starten und bedienen kann.")

d.bullets("Fun Facts: Fertigstellen", [
    ("Die **Definition of Done** ist in Profiteams ein aufgeschriebener Satz, kein Gefühl", 0),
    ("**Featuritis** heißt der Drang, kurz vor Schluss noch etwas einzubauen — der Klassiker", 0),
    ("Jede Änderung nach dem letzten Test bedeutet: **noch einmal testen**", 0),
    ("Deshalb gibt es in echten Projekten einen **Feature Freeze** vor dem Abgabetermin", 0),
    ("Bei uns ist das heute: ab jetzt nur noch **Fehler beheben**, nichts Neues", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Muss-Punkte abhaken** — jeden einzeln mit einer Probe", 0),
    ("**Feinschliff**: Startbildschirm, Rückmeldungen, aufräumen", 0),
    ("Eine laufende Fassung als **v3** sichern — das ist die Testfassung", 0),
    ("**Fremdtest vorbereiten**: Anleitung, Muss-Liste, leeres Fehlerprotokoll", 0),
    ("Ab jetzt gilt: **nichts Neues mehr**, nur noch beheben", 0),
])

d.save()
