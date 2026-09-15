#!/usr/bin/env python3
"""Informatik 11 (BGY), live plan KW 26: Puffer - mixed review across the whole school year
(ORGA week, reserve for project days / excursion). Deliberately short.

Facts line up with the worksheet HTML/inf11test-puffer.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-puffer.pptx")

d.title("Informatik — Grundkurs 11", "Quer durchs Jahr",
        "Puffer: gemischte Wiederholung aus allen Lernbereichen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Informatik und Information", "Lernbereiche 1 und 2",
          image="img/puffer-abakus.jpg",
          credit="Abakus — Foto: D Coetzee, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Closeup_of_Soda_Hall_abacus_(1).jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Projektnachlese — Portfolios, Best-of, Retrospektive", 0),
    ("Diese Stunde ist **Puffer**: Zeit zum Wiederholen, je nach Bedarf", 0),
    ("Wir ziehen Stichproben quer durchs Jahr — von der Berechenbarkeit bis zur Präsentation", 0),
    ("Leitfrage: Was sitzt — und **wo habe ich noch Lücken**?", 0),
])

d.table_top("Stichproben aus Lernbereich 1 und 2", [
    ["Frage", "Kernaussage"],
    ["Wer fragt, was überhaupt berechenbar ist?", "die theoretische Informatik — bekanntestes Ergebnis: das Halteproblem"],
    ["Was betrifft das Abtasten?", "die Zeit- bzw. Ortsachse — beim Bild sind es die Bildpunkte"],
    ["Woran erkennt man eine glaubwürdige Quelle?", "nachvollziehbare Belege und eine verantwortliche Stelle"],
    ["Grundprinzip eines CMS?", "Inhalt, Struktur und Gestaltung werden getrennt gehalten"],
], [330, 486], [
    ("Reichweite, Trefferplatz oder schickes Design sagen über den Inhalt einer Quelle **nichts**", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Zahlen, die sitzen müssen", [
    ("Mit $n$ Bit lassen sich $2^{n}$ Werte darstellen", 0),
    ("8 Bit ergeben $2^{8} = 256$ Werte — genau **ein Byte**", 0),
    ("128 Werte wären nur 7 Bit: $2^{7} = 128$", 0),
    ("**Abtasten** betrifft die Zeit- bzw. Ortsachse, **Quantisieren** die Werteachse", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Sicherheit und Datenschutz", "Lernbereich 3",
          image="img/puffer-enigma.jpg",
          credit="Enigma-Chiffriermaschine — Foto: Rama, CC BY-SA 2.0 fr, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Enigma-IMG_0487-black.jpg")

d.table_top("Schutzziele, Schlüssel, Prüfsummen", [
    ["Frage", "Antwort"],
    ["Offene Kundendatei: welches Schutzziel?",
     "die Vertraulichkeit: Daten unverändert und erreichbar, aber für Unberechtigte lesbar"],
    ["Womit signiert man eine Nachricht?", "mit dem eigenen privaten Schlüssel — geprüft wird mit dem öffentlichen"],
    ["ABC mit Caesar und Schlüssel 2?", "CDE — jeder Buchstabe rückt zwei Stellen weiter"],
    ["Was leistet eine Prüfsumme?", "sie zeigt, ob sich Daten verändert haben — geheim macht sie nichts"],
], [330, 486], [
    ("Verschlüsselt wird umgekehrt: mit dem **öffentlichen** Schlüssel des Empfängers", 0),
], font_size=11, bold_cols=(0,), marks={(1, 0): TINT_RED})

d.table_top("Sichern, schützen, Recht", [
    ["Stichwort", "Kernaussage"],
    ["3-2-1-Regel", "drei Kopien, zwei Medien, eine außer Haus"],
    ["Datenminimierung", "nur die für den Zweck nötigen Daten erheben"],
    ["Zeugnis", "Rechtsgrundlage: Erfüllung einer rechtlichen Verpflichtung — keine Einwilligung"],
    ["Zutritt, Zugang, Zugriff", "Räume, Systeme, Daten — jede Ebene hat eigene Maßnahmen"],
    ["wirksamste Einzelmaßnahme", "Systeme aktuell halten — die meisten Angriffe nutzen bekannte Lücken"],
], [230, 586], [
    ("Was nicht erhoben wird, kann nicht abfließen", 0),
], font_size=11, bold_cols=(0,), marks={(1, 0): TINT_BLUE, (2, 0): TINT_GREEN, (5, 0): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Codes, Projekt, Folien", "Wahlbereich und Lernbereich 4",
          image="img/puffer-cd.jpg",
          credit="CD, Datenseite — Foto: Kent Madsen, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:1,_CD-Rom,_Backside.jpg")

d.bullets("Codes und Fehler", [
    ("**Lauflängencodierung**: AABBBB wird zu 2A4B — Anzahl vor Zeichen", 0),
    ("**Gerade Parität**: 1101 hat drei Einsen, also Prüfbit 1 — dann sind es vier", 0),
    ("**Bündelfehler**: mehrere aufeinanderfolgende gestörte Bits, etwa durch einen Kratzer", 0),
    ("Einfache Parität versagt dabei — CRC und Interleaving sind dafür gemacht", 0),
])

d.bullets("Projekt und Präsentation", [
    ("**Leitfrage**: die eine Frage, die das Projekt am Ende beantwortet", 0),
    ("Ohne Leitfrage wird das Projekt eine Materialsammlung", 0),
    ("Gute Inhaltsfolie: **eine Aussage als Überschrift** und wenige stützende Elemente", 0),
    ("Der Sprechtext gehört in die Notizen, nicht auf die Folie", 0),
    ("Vor jeder Digitalisierung: **Welches Problem soll gelöst werden — und für wen?**", 0),
])

d.merksatz("Wiederholen heißt nicht alles noch einmal lesen: Stichprobe ziehen, Lücke finden, "
           "gezielt schließen.")

d.bullets("Fun Facts", [
    ("Alan Turing bewies 1936: Kein Verfahren kann für **jedes** Programm entscheiden, ob es anhält", 0),
    ("Caesar mit Schlüssel 13 heißt **ROT13** — zweimal angewendet ergibt sich wieder der Klartext", 0),
    ("Die letzte Ziffer einer ISBN oder EAN ist eine **Prüfziffer**", 0),
    ("Audio-CDs verschränken ihre Daten: So wird aus einem Kratzer eine Reihe kleiner, **korrigierbarer** Fehler", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Lückencheck**: Markiert die drei Stichproben, bei denen es gewackelt hat", 0),
    ("**Übung nach Bedarf**: genau diese Themen in Paaren mit den Arbeitsblättern nacharbeiten", 0),
    ("**Selbst rechnen**: eine Caesar-Nachricht, eine Lauflängencodierung, ein Paritätsbit — der Partner prüft", 0),
    ("Fällt die Stunde auf einen Projekttag oder eine Exkursion: die Übung zu Hause nachholen", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
