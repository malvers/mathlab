#!/usr/bin/env python3
"""Informatik 11 (BGY), KW 19 (live plan): Wahlbereich II - Pruefbit- und Pruefziffernverfahren:
Paritaet, Hamming-Distanz, ISBN/EAN, IBAN, CRC (WB, Ustd. 3-4/4).

Facts line up with the worksheet HTML/inf11test-pruefziffern.html (20 Aufgaben). Worked examples
were recomputed: EAN 4006381333931 (sum 90), ISBN 978-3-16-148410-0 (sum 100), IBAN
DE89 3704 0044 0532 0130 00 (remainder 1). Chapter pictures from Wikimedia Commons.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-pruefziffern.pptx")

d.title("Informatik — Grundkurs 11", "Fehler erkennen",
        "Paritätsbit, Hamming-Distanz und die Prüfziffern auf Buch, Barcode und Konto")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Prüfbit", "Parität und ihre Grenzen",
          image="img/pruefziffern-lochstreifen.jpg",
          credit="Lochstreifen mit 5 und 8 Spuren — Foto: TedColes, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:PaperTapes-5and8Hole.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Redundanz **entfernen** — Lauflänge, Huffman, JPEG", 0),
    ("Heute umgekehrt: Redundanz gezielt **hinzufügen**", 0),
    ("Unterwegs kippen Bits, beim Abtippen passieren Dreher", 0),
    ("Leitfrage: Wie merkt der Empfänger einen Fehler — **ohne** das Original zu kennen?", 0),
])

d.bullets("Das Prüfbit", [
    ("Ein **Prüfbit** ist ein zusätzliches Bit ohne Nutzinformation", 0),
    ("Es macht bestimmte Übertragungsfehler **erkennbar**", 0),
    ("**Gerade Parität**: Das Prüfbit wird so gesetzt, dass die Anzahl der Einsen — Prüfbit mitgezählt — gerade ist", 0),
    ("Bei **ungerader** Parität ist es umgekehrt — beide sind gleich leistungsfähig", 0),
    ("Erkennen ist nicht Korrigieren: Man weiß, **dass** ein Fehler da ist, nicht **wo**", 0),
])

d.table_top("Prüfbit bei gerader Parität", [
    ["Datenbits", "Anzahl Einsen", "Prüfbit", "gesendet"],
    ["1011", "3 — ungerade", "1", "10111"],
    ["1100", "2 — gerade", "0", "11000"],
    ["1000001 (ASCII A)", "2 — gerade", "0", "10000010"],
    ["0111", "3 — ungerade", "1", "01111"],
], [230, 220, 130, 236], [
    ("Der Empfänger zählt die Einsen: **ungerade** Anzahl heißt Fehler", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 2): TINT_ORANGE, (4, 2): TINT_ORANGE})

d.table_top("Was die Parität übersieht", [
    ["gesendet 10111, empfangen", "Anzahl Einsen", "Parität", "Ergebnis"],
    ["10111", "4", "gerade", "in Ordnung"],
    ["10011 (1 Bit gekippt)", "3", "ungerade", "Fehler erkannt"],
    ["11011 (2 Bits gekippt)", "4", "gerade", "Fehler NICHT erkannt"],
    ["01011 (3 Bits gekippt)", "3", "ungerade", "Fehler erkannt"],
], [270, 160, 150, 236], [
    ("Eine **gerade Anzahl** gekippter Bits bleibt unentdeckt — ein einzelner Fehler wird immer erkannt", 0),
], font_size=11, bold_cols=(0,),
   marks={(2, 3): TINT_GREEN, (3, 3): TINT_RED, (4, 3): TINT_GREEN})

d.bullets("Der Kartentrick", [
    ("Jemand legt 5 × 5 Karten zufällig, schwarz oder weiß nach oben", 0),
    ("Ihr ergänzt eine Zeile und eine Spalte, sodass **jede** Zeile und Spalte gerade viele schwarze Karten hat", 0),
    ("Ihr dreht euch um — jemand wendet **eine** Karte", 0),
    ("Genau eine Zeile und eine Spalte sind jetzt ungerade: Sie **kreuzen sich** an der gewendeten Karte", 0),
    ("Aus Erkennen wird **Korrigieren** — mit mehr Prüfbits", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Abstand und Korrektur", "Hamming-Distanz, Bündelfehler, CD",
          image="img/pruefziffern-cd.jpg",
          credit="Beschädigte CD-R — Foto: Jes from Melbourne, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:CD-R_with_surface_damage_and_chipped_side.jpg")

d.bullets("Erkennen oder korrigieren?", [
    ("**Erkennung** meldet den Fehler — **Korrektur** stellt die richtigen Daten wieder her", 0),
    ("Korrektur braucht deutlich **mehr Redundanz**", 0),
    ("Erkennen genügt, wenn neu gesendet werden kann — wie im Netz", 0),
    ("Bei einer CD geht das nicht: Sie muss sich **selbst** helfen", 0),
    ("Der Preis jedes Schutzes: zusätzliche Bits ohne Nutzinformation — je mehr Schutz, desto mehr", 0),
])

d.table_top("Die Hamming-Distanz", [
    ["Codewort 1", "Codewort 2", "verschieden an Stelle", "Distanz"],
    ["1011", "1001", "3", "1"],
    ["1100", "1010", "2 und 3", "2"],
    ["10111", "11011", "2 und 3", "2"],
    ["0000", "1111", "1, 2, 3 und 4", "4"],
], [190, 190, 280, 156], [
    ("**Hamming-Distanz**: Anzahl der Stellen, in denen sich zwei gleich lange Codewörter unterscheiden", 0),
    ("Die **kleinste** Distanz im Code bestimmt, was er leisten kann", 0),
], font_size=11, bold_cols=(0,),
   marks={(2, 3): TINT_ORANGE})

d.bullets("Was die Mindestdistanz verrät", [
    ("Bei Mindestdistanz $d$ erkennt ein Code bis zu $d-1$ Fehler", 0),
    ("Korrigieren kann er bis zu $\\frac{d-1}{2}$ Fehler (abgerundet)", 0),
    ("Paritätsbit: $d = 2$ — einen Fehler erkennen, keinen korrigieren", 0),
    ("$d = 3$: **zwei** Fehler erkennen, **einen** korrigieren", 0),
    ("Beispiel: Aus 0 wird 000, aus 1 wird 111 — empfangen 010, am nächsten liegt **000**", 0),
])

d.bullets("Bündelfehler und CRC", [
    ("**Bündelfehler**: mehrere aufeinanderfolgende Bits gestört — durch Kratzer oder Störimpulse", 0),
    ("Ein einfaches Paritätsbit versagt dabei", 0),
    ("**CRC** (zyklische Redundanzprüfung): eine Prüfsumme über eine Bitfolge, berechnet durch **Polynomdivision**", 0),
    ("CRC erkennt auch Bündelfehler zuverlässig — Standard in Netzwerken und auf Speichermedien", 0),
])

d.bullets("Wie die CD Kratzer übersteht", [
    ("Die CD speichert **fehlerkorrigierende Codes** zusätzlich zur Musik", 0),
    ("Die Daten eines Blocks werden über die Oberfläche **verteilt** — das heißt Interleaving", 0),
    ("Ein Kratzer trifft dann nur **kleine Teile vieler Blöcke** statt eines Blocks ganz", 0),
    ("Diese kleinen Lücken kann die Korrektur rekonstruieren — die Musik spielt weiter", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Prüfziffern", "Buch, Barcode, Konto",
          image="img/pruefziffern-isbn.png",
          credit="ISBN als EAN-13-Strichcode — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:EAN-13-ISBN-13.svg")

d.bullets("Wozu eine Prüfziffer?", [
    ("Eine **Prüfziffer** wird aus den übrigen Ziffern berechnet und hinten angehängt", 0),
    ("Passt sie nicht, war die Eingabe **fehlerhaft** — Tippfehler fallen sofort auf", 0),
    ("Der häufigste Tippfehler ist der **Zahlendreher**: 81 statt 18", 0),
    ("Mit gleicher Gewichtung, etwa der Quersumme, fiele ein Tausch nie auf", 0),
    ("Deshalb gehen die Ziffern mit **unterschiedlichen Gewichten** in die Rechnung ein", 0),
])

d.table_top("EAN-13 nachrechnen", [
    ["Stelle", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    ["Ziffer", "4", "0", "0", "6", "3", "8", "1", "3", "3", "3", "9", "3"],
    ["Gewicht", "1", "3", "1", "3", "1", "3", "1", "3", "1", "3", "1", "3"],
    ["Produkt", "4", "0", "0", "18", "3", "24", "1", "9", "3", "9", "9", "9"],
], [120] + [58] * 12, [
    ("Summe: 89 — bis zur nächsten Zehnerzahl 90 fehlt **1**: Die Prüfziffer ist 1, die EAN lautet 400638133393**1**", 0),
    ("Die ISBN-13 rechnet genauso: 978-3-16-148410-**0** hat die Summe 100 — schon durch 10 teilbar", 0),
], font_size=11, bold_cols=(0,),
   marks={(2, 2): TINT_ORANGE, (2, 4): TINT_ORANGE, (2, 6): TINT_ORANGE, (2, 8): TINT_ORANGE,
          (2, 10): TINT_ORANGE, (2, 12): TINT_ORANGE})

d.bullets("Warum der Zahlendreher auffällt", [
    ("Gewichte abwechselnd **1 und 3** — die Summe aller 13 Ziffern muss durch 10 teilbar sein", 0),
    ("Vertauscht man zwei Nachbarn $a$ und $b$, ändert sich die Summe um $2 \\cdot (a-b)$", 0),
    ("Beispiel: 4006381333931 wird zu 4006318333931 — Summe 76 statt 90, **erkannt**", 0),
    ("Lücke: Nachbarn, die sich um **5** unterscheiden (etwa 1 und 6), ändern die Summe um 10 — unentdeckt", 0),
    ("Der Scanner an der Kasse prüft sofort — passt die Ziffer nicht, piept er nicht", 0),
])

d.table_top("Die IBAN prüfen", [
    ["Schritt", "am Beispiel DE89 3704 0044 0532 0130 00"],
    ["1. Land und Prüfziffern nach hinten", "370400440532013000 DE89"],
    ["2. Buchstaben in Zahlen: A = 10, B = 11", "D = 13, E = 14: 370400440532013000131489"],
    ["3. durch 97 teilen", "Rest 1 — die IBAN ist gültig"],
], [330, 486], [
    ("Die zwei Prüfziffern machen Fehler in **Land, Bankleitzahl und Kontonummer** erkennbar", 0),
    ("Beim Modulo-97-Verfahren fallen fast alle Tippfehler und Dreher auf", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 1): TINT_GREEN})

d.bullets("Schutz gegen Versehen, nicht gegen Absicht", [
    ("Der **Luhn-Algorithmus** prüft Kreditkarten- und ähnliche Nummern auf Eingabefehler", 0),
    ("Über Echtheit oder Deckung sagt er **nichts**", 0),
    ("Jedes Prüfziffernverfahren ist öffentlich — jeder kann eine passende Nummer erzeugen", 0),
    ("Gegen **Fälschung** braucht es digitale Signaturen", 0),
    ("Reihenfolge beim Empfang: **erst** Prüfsumme vergleichen, **dann** die Daten verwenden", 0),
])

d.merksatz("Prüfbits und Prüfziffern sind gezielte Redundanz: Sie machen Fehler erkennbar, "
           "mit genug Abstand zwischen den Codewörtern sogar korrigierbar — aber sie schützen vor Versehen, nicht vor Fälschung.")

d.bullets("Fun Facts", [
    ("**Richard Hamming** ärgerte sich, dass sein Relaisrechner bei Fehlern nur abbrach — 1950 veröffentlichte er die Hamming-Codes", 0),
    ("Die Luhn-Formel stammt von **Hans Peter Luhn** aus Barmen, heute Wuppertal — er arbeitete bei IBM", 0),
    ("Die alte ISBN-10 kannte als Prüfziffer auch ein **X** — es steht für 10", 0),
    ("Ein **QR-Code** bleibt auf der höchsten Stufe lesbar, selbst wenn rund 30 Prozent fehlen", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Barcode-Detektive**: drei EANs von Verpackungen oder Büchern mit dem Taschenrechner nachrechnen", 0),
    ("**Partnerübung**: Eine schreibt eine EAN mit Tippfehler oder Dreher ab, der andere findet ihn per Prüfziffer", 0),
    ("**Fehlersuche-Spiel**: 4-Bit-Nachrichten mit Paritätsbit senden — der Sender kippt heimlich ein oder zwei Bits", 0),
    ("**Kartentrick**: 5 × 5 Karten mit Paritätszeile und -spalte — findet die gewendete Karte", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
