#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 28 / KW 11: Umsetzung I - Grundgeruest bauen
(LB 2, Ustd. 6/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("umsetzung-1-grundgeruest.pptx")

d.title("Informatik — Klasse 9", "Das Grundgerüst",
        "Die kleinste Fassung zum Laufen bringen — und sichern")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Heute wird gebaut", "Ziel: etwas, das startet")

d.bullets("Was am Ende dieser Stunde stehen soll", [
    ("Das Produkt **startet** und macht das Wichtigste — mehr nicht", 0),
    ("Beim Spiel: die Figur bewegt sich. Bei der Robotik: der Sensor liefert Werte", 0),
    ("Es darf **hässlich** sein. Es darf **wenig** können. Es muss **laufen**", 0),
    ("Denn ab jetzt könnt ihr jede Änderung **sofort ausprobieren**", 0),
    ("Wer heute nichts Laufendes hat, baut nächste Woche im Blindflug weiter", 0),
])

d.table_top("Die Startaufgaben je Richtung", [
    ["Richtung", "Grundgerüst heißt hier"],
    ["Spiel", "Figur erscheint und lässt sich steuern"],
    ["Simulation", "ein Objekt bewegt sich nach einer einfachen Regel"],
    ["Robotik", "Sensorwert wird gelesen und angezeigt"],
    ["Grafik", "ein Bild wird gezeichnet und verändert sich auf Knopfdruck"],
], [200, 616], [
    ("Alle vier haben gemeinsam: **eine Eingabe, eine sichtbare Wirkung**", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Zwischenstände sichern", "Die Versicherung gegen den Frust")

d.table_top("So heißen eure Dateien", [
    ["Zeitpunkt", "Dateiname"],
    ["heute, es läuft", "fangspiel-v1.sb3"],
    ["nächste Woche, Punkte drin", "fangspiel-v2.sb3"],
    ["nach dem Test", "fangspiel-v3.sb3"],
    ["Abgabe", "fangspiel-abgabe.sb3"],
], [330, 486], [
    ("**Niemals** die alte Datei überschreiben, sobald etwas Neues gebaut wird", 0),
    ("Namen wie **final-final-2** helfen niemandem — Nummern schon", 0),
    ("Speichert am Ende jeder Stunde eine Fassung, die **läuft**", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(1,))

d.bullets("Warum das so wichtig ist", [
    ("Wenn etwas kaputtgeht, könnt ihr zur **letzten laufenden Fassung** zurück", 0),
    ("Ohne Sicherung heißt „kaputt“ oft: **die Arbeit von zwei Stunden ist weg**", 0),
    ("Profis machen das automatisch — das Werkzeug dafür heißt **Versionsverwaltung**", 0),
    ("Ihr macht es von Hand, mit Nummern. Das reicht für dieses Projekt völlig", 0),
    ("Legt die Dateien dorthin, wo **alle** im Team sie erreichen", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wenn es klemmt", "Vier Handgriffe vor dem Handheben")

d.table_top("Erste Hilfe bei Fehlern", [
    ["Symptom", "erster Verdacht"],
    ["Gar nichts passiert", "das Startsignal fehlt, oder das Skript hängt am falschen Objekt"],
    ["Bewegung ist zu schnell", "keine Wartezeit in der Schleife"],
    ["Es reagiert nur einmal", "die Wiederholung fehlt"],
    ["Nur bei mir geht es nicht", "andere Datei geöffnet als gedacht"],
], [230, 586], [
    ("Vor dem Handheben: **Was habe ich zuletzt geändert?** Das ist fast immer die Ursache", 0),
    ("Und: eine Änderung zur Zeit — sonst weiß niemand, welche geholfen hat", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Am Ende jeder Stunde steht eine Fassung, die läuft — mit einer neuen "
           "Nummer im Dateinamen. Alles andere ist Glücksspiel.")

d.bullets("Fun Facts: Bauen", [
    ("Der erste Rat jedes Profis lautet: **immer eine laufende Fassung haben**", 0),
    ("Das Werkzeug **Git** von 2005 macht genau das automatisch — erfunden für den Linux-Kern", 0),
    ("Der Ausdruck **„es lief gestern noch“** ist der meistgehörte Satz der Softwareentwicklung", 0),
    ("Beim Ändern einer Sache zur Zeit spricht man von **kleinen Schritten** — die Profistrategie", 0),
    ("Und: der Fehler sitzt fast nie da, wo man ihn zuerst sucht", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Baut das **Grundgerüst** eures Produkts, bis es startet und etwas tut", 0),
    ("Speichert am Ende eine laufende Fassung als **v1**", 0),
    ("Tragt in den Aufgabenplan ein, was **fertig** ist", 0),
    ("Notiert **zwei Fragen**, die ihr nächste Woche klären wollt", 0),
    ("Wer früh fertig ist: dem Nachbarteam beim Grundgerüst helfen", 0),
])

d.save()
