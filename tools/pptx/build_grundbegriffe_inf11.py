#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 6 / KW 39 (live plan): Grundbegriffe - Signale, Nachrichten,
Informationen, Daten; Digitalisierung (LB 2 "Persoenliches Informationsmanagement", Ustd. 1-2/16).

Facts line up with the worksheet HTML/inf11test-grundbegriffe.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-grundbegriffe.pptx")

d.title("Informatik — Grundkurs 11", "Vom Signal zur Information",
        "Signal, Nachricht, Information, Daten — und wie aus der Welt Bits werden")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vier Begriffe, eine Kette", "Signal, Nachricht, Information, Daten",
          image="img/grundbegriffe-ampel.png",
          credit="Ampel auf Rot — Momiji-Penguin, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Japanese_horizontal_traffic_light_at_red_light.svg")

d.bullets("Wo wir stehen", [
    ("Lernbereich 1 ist geschafft — von der Rechenuhr bis zum Mikroprozessor", 0),
    ("Heute beginnt **Lernbereich 2**: Persönliches Informationsmanagement", 0),
    ("Zuerst die Wörter, mit denen die Informatik arbeitet — im Alltag gehen sie wild durcheinander", 0),
    ("Leitfrage: Speichert ein Rechner **Daten** oder **Information** — und ist das dasselbe?", 0),
])

d.table_top("Die Begriffskette an der Ampel", [
    ["Begriff", "Was es ist", "an der Ampel"],
    ["Signal", "der physikalische Träger der Nachricht", "das rote Licht"],
    ["Nachricht", "Zeichen, nach Regeln zusammengesetzt", "„Rot“ im Code der Ampel"],
    ["Information", "die Bedeutung für den Empfänger", "„halten!“"],
    ["Daten", "Zeichen, festgehalten zur Verarbeitung", "Schaltprotokoll der Ampelsteuerung"],
], [150, 360, 306], [
    ("Die Kette gilt überall: Schall, Licht, Strom — erst der **Empfänger** macht daraus Information", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_RED, (4, 0): TINT_BLUE})

d.bullets("Nachricht ist nicht Information", [
    ("Dieselbe Nachricht „Morgen um 8“ bedeutet für jeden Empfänger etwas anderes", 0),
    ("Wer den Code nicht kennt, empfängt Zeichen — aber **keine Information**", 0),
    ("**Redundanz**: Anteile einer Nachricht, die keine zusätzliche Information tragen", 0),
    ("Redundanz ist nicht nutzlos: Sie lässt eine Nachricht **Störungen überstehen**", 0),
    ("Deshalb ist „Daten sind Information“ ungenau: Daten werden erst **durch Deutung** zu Information", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Analog und digital", "Stufenlos gegen abzählbar",
          image="img/grundbegriffe-abtastung.png",
          credit="Abgetastetes Signal — CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Signal_Sampling.svg")

d.two_cols("Zwei Arten, eine Größe darzustellen", [
    ("**Analog**", 0),
    ("stufenlos — jeder Zwischenwert ist möglich", 1),
    ("Beispiele: Schallplatte, Zeigeruhr, Quecksilberthermometer", 1),
    ("jede Kopie fügt Rauschen hinzu", 1),
    ("die Kopie der Kopie wird schlechter", 1),
], [
    ("**Digital**", 0),
    ("nur abzählbar viele Werte, feste Stufen", 1),
    ("Beispiele: Musikdatei, Digitaluhr, Fieberthermometer mit Display", 1),
    ("die Stufen werden eindeutig wiedererkannt", 1),
    ("deshalb ist jede Kopie **verlustfrei**", 1),
])

d.bullets("Das Bit", [
    ("Das **Bit** ist die kleinste Informationseinheit: genau zwei Zustände, 0 oder 1", 0),
    ("Rechner arbeiten binär, weil sich **zwei Zustände technisch sicher** unterscheiden lassen", 0),
    ("Mit $n$ Bit lassen sich $2^{n}$ verschiedene Werte darstellen", 0),
    ("10 Bit ergeben $2^{10} = 1024$ Werte", 0),
    ("Für 200 verschiedene Zeichen reichen 7 Bit nicht ($2^{7} = 128$) — man braucht **8 Bit** ($2^{8} = 256$)", 0),
])

d.table_top("Wie viele Bit brauche ich?", [
    ["Bit", "Werte", "reicht zum Beispiel für"],
    ["1", "2", "ja oder nein, an oder aus"],
    ["4", "16", "eine Hexadezimalziffer"],
    ["7", "128", "den ASCII-Zeichensatz"],
    ["8", "256", "ein Byte — 200 verschiedene Zeichen"],
    ["16", "65 536", "Messwerte einer Musik-CD"],
    ["24", "16 777 216", "Farben eines Bildpunkts (3 × 8 Bit)"],
], [120, 180, 516], [
    ("Jedes Bit mehr **verdoppelt** die Zahl der möglichen Werte", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Digitalisieren", "Abtasten, quantisieren, codieren",
          image="img/grundbegriffe-aliasing.png",
          credit="Aliasing: zu selten abgetastet — Laurens R. Krol, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Signal_aliasing_demonstration.svg")

d.bullets("Drei Schritte, immer in dieser Reihenfolge", [
    ("**Abtasten**: das analoge Signal in festen Zeitabständen messen", 0),
    ("**Quantisieren**: jeden Messwert auf eine feste Anzahl von Stufen runden", 0),
    ("**Codieren**: jede Stufe als Bitfolge schreiben", 0),
    ("Unwiderruflich verloren sind dabei die Werte **zwischen** zwei Messpunkten und zwei Stufen", 0),
    ("Mehr Messpunkte und mehr Stufen heißt: genauer — aber auch **mehr Daten**", 0),
])

d.bullets("Das Abtasttheorem", [
    ("Kernaussage: Die Abtastrate muss **mehr als doppelt so hoch** sein wie die höchste vorkommende Frequenz", 0),
    ("Die Musik-CD tastet 44 100-mal pro Sekunde ab — genug für Töne bis etwa 20 000 Hz, die Grenze des Gehörs", 0),
    ("Das Telefon tastet nur 8 000-mal ab — deshalb klingt eine Stimme dort dünn", 0),
    ("Wird zu selten abgetastet, entsteht **Aliasing**: eine falsche, viel tiefere Frequenz", 0),
    ("Aus dem Kino bekannt: Wagenräder, die sich scheinbar **rückwärts** drehen", 0),
])

d.table_top("Ton und Bild — dieselben drei Schritte", [
    ["Schritt", "beim Ton", "beim Foto"],
    ["abtasten", "Messpunkte pro Sekunde", "Aufteilung in Bildpunkte"],
    ["quantisieren", "Stufen der Lautstärke", "Stufen von Helligkeit und Farbe"],
    ["codieren", "Bits je Messwert", "Bits je Bildpunkt"],
], [180, 318, 318], [
    ("Graustufenbild mit 100 × 200 Bildpunkten und 8 Bit je Punkt: 160 000 Bit = **20 000 Byte**", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Daten, Information, Wissen", "Und was Digitalisierung heißt",
          image="img/grundbegriffe-dikw.png",
          credit="DIKW-Pyramide — Longlivetheux, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:DIKW_Pyramid.svg")

d.bullets("Von Daten zu Wissen", [
    ("**Daten** werden gedeutet — so entsteht **Information**", 0),
    ("Verknüpfte Information, die man anwenden kann, ist **Wissen**", 0),
    ("Beispiel: 38,9 sind Daten, „38,9 Grad Fieber“ ist Information, „jetzt zum Arzt“ ist Wissen", 0),
    ("Ein Rechner speichert Daten — **Wissen** entsteht erst wieder in einem Kopf", 0),
])

d.bullets("Was „Digitalisierung“ meint", [
    ("**Im engen Sinn**: eine analoge Größe in Zahlen umwandeln — abtasten, quantisieren, codieren", 0),
    ("**Im weiten Sinn**: Arbeit, Schule und Alltag laufen über digitale Technik", 0),
    ("Beides hängt zusammen: Erst wenn etwas als Daten vorliegt, kann ein Rechner es verarbeiten", 0),
    ("Die Grenze: Erfahrung und Urteilskraft lassen sich **nicht** abtasten", 0),
])

d.merksatz("Ein Signal trägt eine Nachricht, ihre Bedeutung ist die Information, festgehalten "
           "wird sie als Daten — und digitalisieren heißt: abtasten, quantisieren, codieren.")

d.bullets("Fun Facts", [
    ("Claude Shannon machte 1948 das **Bit** zum Maß der Information — das Wort „bit“ hatte ihm John Tukey vorgeschlagen", 0),
    ("Die 44 100 Hz der CD stammen aus der **Videotechnik**: Frühe Digitalaufnahmen wurden auf Videobändern gespeichert", 0),
    ("Im **Morsecode** ist das häufigste Zeichen das kürzeste: das E ist ein einziger Punkt", 0),
    ("Mit 24 Bit je Bildpunkt zeigt ein Bildschirm über **16 Millionen** Farben", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Begriffslandkarte** in Partnerarbeit: Signal, Nachricht, Information, Daten, Wissen, Bit, analog, digital — mit beschrifteten Pfeilen", 0),
    ("**Codier-Experiment** ohne Rechner: eine Nachricht mit Klopfzeichen oder Taschenlampe übertragen — mit eurem eigenen Code aus kurz und lang", 0),
    ("Wie viele Zeichen braucht euer Code für 26 Buchstaben? (Tipp: $2^{5} = 32$)", 0),
    ("**Einordnen**: QR-Code, Fieberthermometer, Klingelton — was ist Signal, Nachricht, Information, Daten?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
