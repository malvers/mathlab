#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 27 / KW 10: Quanteninformatik II - Quantencomputer,
-kommunikation, -kryptologie (WB, Ustd. 3-4/4)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("quanteninformatik-2.pptx")

d.title("Informatik — Grundkurs 13", "Rechnen, übertragen, verschlüsseln",
        "Der Stand der Technik — und was das für heutige Verschlüsselung bedeutet")

d.chapter(1, "Der Stand", "Was heute wirklich geht")

d.table_top("Quantencomputer heute", [
    ["Frage", "Stand"],
    ["Wie viele Qubits?", "einige hundert bis über tausend, je nach Bauart"],
    ["Wie zuverlässig?", "Fehlerraten noch hoch, Zustände zerfallen schnell"],
    ["Fehlerkorrektur?", "braucht viele physische Qubits für ein fehlerfreies logisches"],
    ["Wofür brauchbar?", "Forschung, Optimierung, Simulation von Molekülen"],
    ["Wofür nicht?", "Textverarbeitung, Datenbanken, alles Alltägliche"],
], [230, 586], [
    ("Ein Quantencomputer ist **kein schnellerer PC** — er ist ein Spezialgerät", 0),
    ("Für die allermeisten Aufgaben bleibt der klassische Rechner überlegen", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 0): TINT_ORANGE})

d.bullets("Warum das so schwer ist", [
    ("Qubits müssen **fast vollständig von der Umwelt getrennt** sein", 0),
    ("Viele Bauarten arbeiten nahe dem **absoluten Nullpunkt**", 0),
    ("Jede Störung zerstört die Überlagerung — das heißt **Dekohärenz**", 0),
    ("**Fehlerkorrektur** braucht viele physische Qubits je logischem Qubit", 0),
    ("Deshalb ist die Zahl der Qubits allein keine brauchbare Kennzahl", 0),
])

d.chapter(2, "Die Algorithmen", "Zwei, die man kennen muss")

d.table_top("Shor und Grover", [
    ["Algorithmus", "löst", "Gewinn"],
    ["Shor (1994)", "Zerlegung großer Zahlen in Primfaktoren", "exponentiell schneller"],
    ["Grover (1996)", "Suche in unsortierten Daten", "quadratisch schneller"],
], [180, 380, 256], [
    ("**Shor** trifft RSA und Verfahren, die auf Faktorisierung oder diskreten Logarithmen beruhen", 0),
    ("**Grover** halbiert praktisch die Schlüssellänge — AES-256 bleibt damit sicher", 0),
    ("Beide brauchen weit mehr fehlerfreie Qubits, als es heute gibt", 0),
], font_size=11, bold_cols=(0,), marks={(1, 2): TINT_RED, (2, 2): TINT_ORANGE})

d.table_top("Was das für heutige Verschlüsselung heißt", [
    ["Verfahren", "Art", "Bewertung"],
    ["RSA, Diffie-Hellman, ECC", "asymmetrisch", "durch Shor gefährdet"],
    ["AES-128", "symmetrisch", "durch Grover geschwächt"],
    ["AES-256", "symmetrisch", "bleibt praktisch sicher"],
    ["Post-Quanten-Verfahren", "neu, gitterbasiert", "seit 2024 standardisiert"],
], [230, 200, 386], [
    ("**Harvest now, decrypt later**: heute abgefangene Daten könnten später entschlüsselt werden", 0),
    ("Deshalb stellen Behörden und Banken **jetzt** schon um, nicht erst später", 0),
], font_size=10.5, bold_cols=(0,), marks={(1, 2): TINT_RED, (4, 2): TINT_GREEN})

d.chapter(3, "Quantenkommunikation", "Und der Simulator")

d.bullets("Quantenschlüsselaustausch", [
    ("Zwei Seiten erzeugen einen gemeinsamen Schlüssel über einzelne **Photonen**", 0),
    ("Wer mithört, **verändert** die Zustände — das Messen hinterlässt Spuren", 0),
    ("Die Spuren zeigen sich als **erhöhte Fehlerrate** beim Vergleich einer Stichprobe", 0),
    ("Dadurch merken beide Seiten, dass jemand gelauscht hat, und verwerfen den Schlüssel", 0),
    ("Das erste Verfahren dieser Art heißt **BB84**, von 1984", 0),
])

d.table_top("Die Demo im Simulator", [
    ["Schritt", "was ihr baut", "was ihr seht"],
    ["1", "Ein Qubit, ein Hadamard-Gatter, Messung", "etwa 50:50 zwischen 0 und 1"],
    ["2", "Dasselbe 1000-mal messen", "die Verteilung stabilisiert sich"],
    ["3", "Zwei Qubits verschränken", "nur 00 und 11, nie 01 oder 10"],
    ["4", "Ein Gatter dazwischen setzen", "die Verteilung ändert sich"],
], [90, 350, 376], [
    ("Schritt 3 ist der Aha-Moment: die Einzelergebnisse sind zufällig, **die Paare aber nicht**", 0),
    ("Genau das ist Verschränkung, sichtbar gemacht", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 2): TINT_GREEN})

d.merksatz("Ein Quantencomputer ist kein schnellerer PC. Er ist ein Spezialgerät "
           "für wenige Aufgaben — von denen eine unsere Verschlüsselung betrifft.")

d.bullets("Fun Facts: Quantentechnik", [
    ("**Peter Shor** veröffentlichte seinen Algorithmus 1994 — lange vor jedem brauchbaren Gerät", 0),
    ("Das **NIST** standardisierte 2024 die ersten Post-Quanten-Verfahren", 0),
    ("**BB84** stammt von Bennett und Brassard, 1984 — vor der ersten Hardware", 0),
    ("Manche Quantenrechner arbeiten bei **unter 0,01 Kelvin** — kälter als das Weltall", 0),
    ("Der Begriff **Quantenüberlegenheit** meint nur: eine Aufgabe, die klassisch praktisch unlösbar ist", 0),
])

d.bullets("Eure Aufgabe", [
    ("Baut die **vier Schaltkreise** im Online-Simulator und notiert die Verteilungen", 0),
    ("Erklärt Schritt 3 in eigenen Worten: **warum nie 01 oder 10?**", 0),
    ("Ordnet vier Verschlüsselungsverfahren ein: **gefährdet, geschwächt oder sicher**", 0),
    ("Erklärt **harvest now, decrypt later** in drei Sätzen", 0),
    ("Schreibt auf: **Was hat euch am meisten überrascht?**", 0),
])

d.save()
