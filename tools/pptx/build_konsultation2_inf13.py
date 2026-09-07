#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 37: Konsultationen, der Pruefungszeitraum beginnt."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("konsultation-2-inf13.pptx")

d.title("Informatik — Grundkurs 13", "Der Prüfungszeitraum beginnt",
        "Letzte Konsultationen, Ablauf am Prüfungstag, und alles Gute")

d.chapter(1, "Der Prüfungstag", "Was ihr wissen solltet")

d.table_top("Der Ablauf", [
    ["Schritt", "was zu beachten ist"],
    ["Ankunft", "früh genug da sein, Raum vorher wissen"],
    ["Zugelassene Mittel", "nach Plan der Schule — vorher prüfen, nichts anderes mitnehmen"],
    ["Arbeitsphase", "erst alles lesen, dann Zeiten je Aufgabe festlegen"],
    ["Bearbeitung", "mit dem Sicheren beginnen, Teilergebnisse aufschreiben"],
    ["Letzte Minuten", "lesen statt schreiben, Aufgabennummern prüfen"],
], [180, 636], [
    ("**Teilergebnisse** bringen Punkte — eine leere Seite bringt keine", 0),
    ("Und: eine Aufgabe, die auf einer vorigen aufbaut, darf mit einer **benannten Annahme** weitergehen", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 0): TINT_GREEN})

d.bullets("Die letzten Tage", [
    ("**Nichts Neues** mehr anfangen — jetzt zählt das Sichere", 0),
    ("Die **Merkblätter** durchgehen und laut erklären", 0),
    ("Je Bereich **eine** vollständige Aufgabe rechnen, nicht zehn angefangene", 0),
    ("**Schlaf** ist Teil der Vorbereitung, nicht deren Gegenteil", 0),
    ("Und am Vorabend: Sachen packen, dann aufhören", 0),
])

d.chapter(2, "Die Konsultation heute", "Letzte offene Punkte")

d.table_top("Womit ihr kommen könnt", [
    ["Anliegen", "was wir tun"],
    ["Eine Aufgabe, die nicht aufgeht", "gemeinsam durchrechnen, Fehlerstelle benennen"],
    ["Eine Regel, die nicht sitzt", "an zwei Beispielen anwenden"],
    ["Mündliche Prüfung", "eine Simulation mit Rückmeldung"],
    ["Zeiteinteilung", "an einer alten Aufgabe planen und durchziehen"],
    ["Nervosität", "darüber reden hilft mehr, als man denkt"],
], [280, 536], [
    ("Auch der letzte Punkt gehört dazu — er ist bei vielen der eigentliche Bremsklotz", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 0): TINT_BLUE})

d.bullets("Für die mündliche Prüfung", [
    ("Sagt zu Beginn, **worüber ihr sprecht** — ein Satz genügt als Gliederung", 0),
    ("Bringt **ein Beispiel aus eurem Projekt** — das bleibt hängen", 0),
    ("Stellt **Zusammenhänge** her: das Modell hängt am Prozess, die Abfrage am Modell", 0),
    ("Bei einer Lücke: **sagen**, was ihr nicht wisst, und wie ihr es herausfinden würdet", 0),
    ("Und: langsamer sprechen, als sich richtig anfühlt", 0),
])

d.chapter(3, "Zum Schluss", "Was bleibt")

d.bullets("Nach drei Jahren Informatik", [
    ("Ihr könnt einen **Ablauf modellieren** und ein **Projekt planen**", 0),
    ("Ihr könnt eine **Datenbank entwerfen**, normalisieren, füllen und befragen", 0),
    ("Ihr könnt **Algorithmen lesen, schreiben und beurteilen**", 0),
    ("Ihr habt eine **Webanwendung mit Datenbank** gebaut — vom Modell bis zur Sicherheit", 0),
    ("Und ihr wisst, wo die **Grenzen** liegen: technisch, rechtlich und ethisch", 0),
])

d.merksatz("Vieles aus diesem Kurs werdet ihr vergessen. Das Vorgehen nicht: "
           "verstehen, modellieren, bauen, prüfen.")

d.bullets("Fun Facts: zum Abschied", [
    ("Der **Euklid** ist über 2300 Jahre alt und läuft in eurem Code weiter", 0),
    ("**Codds** Aufsatz von 1970 steckt in jeder Datenbank, die ihr je benutzen werdet", 0),
    ("**Turings** Frage von 1936 ist bis heute unbeantwortbar — und das ist bewiesen", 0),
    ("Und die Motte von 1947 klebt immer noch im Logbuch des Harvard Mark II", 0),
    ("Ihr steht in einer ziemlich langen Reihe", 0),
])

d.bullets("Alles Gute", [
    ("Kommt zu den Konsultationen — auch mit kleinen Fragen", 0),
    ("Nutzt die letzten Tage für das **Sichere**, nicht für Neues", 0),
    ("Schlaft genug und packt am Vorabend", 0),
    ("Am Prüfungstag: **erst lesen, dann einteilen, dann schreiben**", 0),
    ("Viel Erfolg — ihr könnt das", 0),
])

d.save()
