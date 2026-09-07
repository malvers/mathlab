#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 6 / KW 39: Modellierung von Prozessen - Ziele und
Grundsaetze (LB 1, Ustd. 7-8/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("prozessmodellierung-grundsaetze.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Prozesse modellieren",
        "Vom realen Ablauf zum Modell — Ziele, Grundsätze und die erste Aufnahme")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Was ist ein Prozess?", "Und was ihn vom Ablauf unterscheidet")

d.bullets("Die Definition, mit der wir arbeiten", [
    ("Ein **Prozess** ist eine Folge von Tätigkeiten, die aus einem Auslöser ein Ergebnis macht", 0),
    ("Er hat einen **Anfang** (ein Ereignis) und ein **Ende** (ein Ergebnis)", 0),
    ("Er läuft **wiederholt** ab — nicht einmalig wie ein Projekt", 0),
    ("Er überquert oft mehrere **Rollen** oder Abteilungen", 0),
    ("Und er lässt sich **messen**: Dauer, Kosten, Fehlerquote", 0),
])

d.table_top("Prozess, Projekt, Funktion — auseinandergehalten", [
    ["", "Prozess", "Projekt"],
    ["Häufigkeit", "wiederholt sich ständig", "einmalig"],
    ["Ziel", "ein Ergebnis je Durchlauf", "ein Ergebnis insgesamt"],
    ["Beispiel", "Bestellung bearbeiten", "Onlineshop einführen"],
    ["Verbesserung", "am Ablauf selbst", "am Ergebnis"],
], [180, 320, 316], [
    ("Beides braucht Modelle — aber **verschiedene**", 0),
    ("Ein **Geschäftsprozess** ist ein Prozess, der zum Zweck des Unternehmens beiträgt", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Wozu modellieren?", "Fünf Ziele, die den Aufwand rechtfertigen")

d.table_top("Ziele der Prozessmodellierung", [
    ["Ziel", "heißt konkret"],
    ["Verstehen", "alle Beteiligten sehen denselben Ablauf"],
    ["Dokumentieren", "das Wissen hängt nicht an einer Person"],
    ["Verbessern", "Doppelarbeit, Wartezeiten und Schleifen werden sichtbar"],
    ["Automatisieren", "was modelliert ist, kann ein System übernehmen"],
    ["Prüfen", "Vorgaben und Regeln lassen sich nachweisen"],
], [200, 616], [
    ("Das häufigste Ziel in der Praxis ist das erste: **Beteiligte haben verschiedene Bilder im Kopf**", 0),
    ("Ein Modell macht die Unterschiede sichtbar — oft ist das schon der halbe Gewinn", 0),
], font_size=11.5, bold_cols=(0,), marks={(1, 0): TINT_GREEN})

d.bullets("Die Grundsätze ordnungsmäßiger Modellierung", [
    ("**Richtigkeit**: das Modell bildet den Ablauf zutreffend ab", 0),
    ("**Relevanz**: nur was für den Zweck gebraucht wird, kommt hinein", 0),
    ("**Wirtschaftlichkeit**: der Aufwand muss zum Nutzen passen", 0),
    ("**Klarheit**: die Adressaten müssen es lesen können", 0),
    ("**Vergleichbarkeit** und **systematischer Aufbau**: gleiche Notation, gleiche Regeln", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Aufnahme", "Wie ein Prozess erhoben wird")

dia = pap(P("pap-prozessaufnahme-inf12.png"), 1560, 340, {
    "a": dict(pos=(200, 130), w=330, h=120, text="1. Abgrenzen: Auslöser und Ergebnis"),
    "b": dict(pos=(590, 130), w=330, h=120, text="2. Erheben: Beteiligte befragen"),
    "c": dict(pos=(980, 130), w=330, h=120, text="3. Modellieren: Notation anwenden"),
    "e": dict(pos=(1370, 130), w=330, h=120, text="4. Validieren: rückspielen lassen"),
}, [
    ("a", "b", ""), ("b", "c", ""), ("c", "e", ""),
    ("e", "b", "Lücke gefunden", [(1370, 280), (590, 280)]),
], size=30)
d.picture("Vier Schritte der Prozessaufnahme", dia, [
    ("Schritt 4 ist der wichtigste: **die Beteiligten bestätigen das Modell** — oder eben nicht", 0),
    ("Wer nur am Schreibtisch modelliert, bildet den Prozess ab, den es geben **sollte**", 0),
], width=816)

d.bullets("Die typischen Funde bei der ersten Aufnahme", [
    ("Der **dokumentierte** und der **gelebte** Prozess sind nicht derselbe", 0),
    ("Es gibt **Sonderwege**, die niemand aufgeschrieben hat", 0),
    ("An einer Stelle wartet der Vorgang regelmäßig — ein **Engpass**", 0),
    ("Dieselbe Angabe wird **mehrfach** erfasst", 0),
    ("Und: niemand kann sagen, wie lange der Prozess insgesamt **dauert**", 0),
])

d.merksatz("Ein Prozessmodell ist erst fertig, wenn die Beteiligten sich darin "
           "wiedererkennen — nicht, wenn es schön aussieht.")

d.bullets("Fun Facts: Prozesse", [
    ("Der Begriff **Geschäftsprozess** wurde durch Hammer und Champy 1993 populär — Business Reengineering", 0),
    ("Ihre These: Prozesse **neu denken**, statt sie zu optimieren. Viele Projekte scheiterten daran", 0),
    ("Die Grundsätze ordnungsmäßiger Modellierung stammen von **Becker, Rosemann und Schütte** (1995)", 0),
    ("Die **Durchlaufzeit** eines Vorgangs besteht in der Praxis oft zu über 80 % aus **Liegezeit**", 0),
    ("Deshalb bringt das Beschleunigen einzelner Tätigkeiten meist wenig", 0),
])

d.bullets("Eure Aufgabe: einen Prozess aufnehmen", [
    ("Wählt zu zweit einen Prozess der Schule: **Krankmeldung**, **Raumbuchung** oder **Materialausgabe**", 0),
    ("**Abgrenzen**: Was löst ihn aus, was ist das Ergebnis, wer ist beteiligt?", 0),
    ("**Erheben**: Schreibt die Tätigkeiten in der richtigen Reihenfolge auf", 0),
    ("Markiert je eine Stelle mit **Wartezeit** und eine mit **Doppelerfassung**", 0),
    ("Prüft euer Ergebnis an den **Grundsätzen**: richtig, relevant, klar?", 0),
])

d.save()
