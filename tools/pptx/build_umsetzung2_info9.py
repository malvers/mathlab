#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 29 / KW 12: Umsetzung II - Kernfunktionen
(LB 2, Ustd. 7/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("umsetzung-2-kernfunktionen.pptx")

d.title("Informatik — Klasse 9", "Die Kernfunktionen",
        "Aus dem Grundgerüst wird ein Produkt — und das Stand-up hilft dabei")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Stand-up", "Drei Minuten am Anfang jeder Stunde")

d.table_top("Drei Fragen, reihum, im Stehen", [
    ["Frage", "Beispielantwort"],
    ["Was habe ich geschafft?", "Die Figur bewegt sich jetzt auch nach oben"],
    ["Was mache ich heute?", "Ich baue die Punktanzeige"],
    ["Wo hakt es?", "Ich finde die Variable von Chiara nicht"],
], [280, 536], [
    ("Keine Diskussion im Stand-up — Probleme werden **notiert** und danach geklärt", 0),
    ("Drei Minuten insgesamt, nicht pro Person. Deshalb im Stehen", 0),
], font_size=11.5, bold_cols=(0,), marks={(3, 0): TINT_ORANGE})

d.bullets("Warum das mehr bringt als es kostet", [
    ("Jeder weiß, **woran die anderen sitzen** — doppelte Arbeit fällt sofort auf", 0),
    ("Wer feststeckt, sagt es nach **einer Woche**, nicht nach vier", 0),
    ("Man merkt früh, ob der **Plan** noch stimmt", 0),
    ("Und man sieht, was schon geschafft ist — das motiviert mehr als jede Note", 0),
    ("Profis machen das täglich, wir jede Doppelstunde", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Kernfunktionen", "Alles, was zum Muss gehört")

d.table_top("Was heute dazukommt", [
    ["Richtung", "Kernfunktion dieser Stunde"],
    ["Spiel", "Punkte zählen, Treffer erkennen, Ende erkennen"],
    ["Simulation", "die Regel mehrfach anwenden und den Verlauf zeigen"],
    ["Robotik", "auf einen Sensorwert reagieren, nicht nur messen"],
    ["Grafik", "die Veränderung wiederholen und steuerbar machen"],
], [200, 616], [
    ("Prüft danach eure **Anforderungsliste**: welche Muss-Punkte könnt ihr abhaken?", 0),
    ("Was heute nicht klappt, kommt in die **Fragenliste** — nicht ins Vergessen", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Die drei häufigsten Klemmer in dieser Phase", [
    ("**Die Teile passen nicht zusammen** — meist ein anderer Variablenname als abgesprochen", 0),
    ("**Es passiert zu viel gleichzeitig** — eine Wartezeit in der Schleife hilft", 0),
    ("**Eine Änderung macht etwas anderes kaputt** — die letzte laufende Fassung holen und vergleichen", 0),
    ("In allen drei Fällen: **eine Änderung zur Zeit**, dann testen", 0),
    ("Und immer erst fragen: **Was habe ich zuletzt geändert?**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Testen im Kleinen", "Nicht erst in vier Wochen")

d.table_top("Nach jeder Kernfunktion kurz prüfen", [
    ["Anforderung", "Probe", "läuft?"],
    ["Punkte werden gezählt", "dreimal fangen, steht dann 3?", ""],
    ["Ende nach drei Fehlern", "dreimal daneben, kommt Game over?", ""],
    ["Anzeige stimmt", "Zahl auf dem Bildschirm mit gezählten Treffern vergleichen", ""],
], [230, 440, 146], [
    ("Diese Tabelle wächst mit jeder Stunde — sie ist später euer **Testplan**", 0),
    ("Eine Anforderung, die nie geprüft wurde, gilt als **nicht erfüllt**", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Eine Änderung, ein Test. Wer fünf Dinge gleichzeitig ändert, "
           "weiß hinterher nicht, welches davon geholfen hat.")

d.bullets("Fun Facts: Bauen im Team", [
    ("Der Ausdruck **Stand-up** kommt aus der agilen Entwicklung der 1990er Jahre", 0),
    ("Im Stehen, damit niemand es gemütlich findet und es lang wird", 0),
    ("**Pair Programming**: zwei an einem Rechner, einer tippt, einer denkt mit", 0),
    ("Klingt nach halber Geschwindigkeit — liefert aber messbar weniger Fehler", 0),
    ("Der teuerste Fehler ist der, den man erst am **Abgabetag** findet", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Stand-up** zu Beginn: drei Fragen, reihum, drei Minuten", 0),
    ("Baut die **Kernfunktionen** aus eurer Muss-Liste", 0),
    ("Nach jeder Funktion: **einmal ausprobieren** und in die Testtabelle eintragen", 0),
    ("Am Ende eine laufende Fassung als **v2** sichern", 0),
    ("Und den Aufgabenplan **aktualisieren** — was ist fertig, was rutscht?", 0),
])

d.save()
