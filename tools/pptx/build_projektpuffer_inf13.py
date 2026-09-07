#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 20 / KW 2: Puffer und Projektarbeit - Restarbeiten."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("webprojekt-puffer.pptx")

d.title("Informatik — Grundkurs 13", "Restarbeiten",
        "Kassensturz, offene Punkte, und was jetzt noch dazukommt")

d.chapter(1, "Kassensturz", "Wo steht das Projekt?")

d.table_top("Die Abgleichliste", [
    ["Muss-Punkt", "fertig, wenn", "da?"],
    ["Mehrere Seiten mit Navigation", "auf jeder Seite gleich, aktuelle markiert", ""],
    ["Responsives Layout", "sieht auf 360 px und 1400 px gut aus", ""],
    ["Datenmodell umgesetzt", "mindestens drei Tabellen mit Schlüsseln", ""],
    ["Daten erfassen", "Formular speichert mit prepare", ""],
    ["Daten anzeigen", "dynamisch aus der Datenbank, maskiert", ""],
], [280, 440, 96], [
    ("Geht die Liste **zu dritt** durch — nicht jeder für sich", 0),
    ("Was hier fehlt, fehlt auch bei der Bewertung", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Die Reihenfolge heute", [
    ("**Zuerst**: fehlende Muss-Punkte — ohne die ist das Projekt nicht fertig", 0),
    ("**Dann**: Funde aus dem Team-Review, sortiert nach Schwere", 0),
    ("**Dann**: Sicherheit — prepare und Maskierung an **jeder** Stelle", 0),
    ("**Zuletzt**: Kann-Punkte, wenn wirklich Zeit bleibt", 0),
    ("**Nicht** heute: neue Ideen anfangen. Drei Doppelstunden sind noch übrig", 0),
])

d.chapter(2, "Die typischen offenen Punkte", "Was zu diesem Zeitpunkt meist fehlt")

d.table_top("Erfahrungswerte", [
    ["Fehlt meist", "Aufwand", "Wirkung"],
    ["Maskierung bei einer Ausgabe", "5 Minuten", "schließt eine Lücke"],
    ["Labels an Formularfeldern", "10 Minuten", "Barrierefreiheit"],
    ["Fehlermeldung bei leerer Eingabe", "15 Minuten", "Programm stürzt nicht ab"],
    ["Zugangsdaten außerhalb des Webordners", "10 Minuten", "verhindert Datenabfluss"],
    ["Test auf einem zweiten Gerät", "15 Minuten", "findet Layoutfehler"],
], [280, 200, 336], [
    ("Alle fünf zusammen sind gut eine Stunde — und sie machen den größten Unterschied", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 2): TINT_RED})

d.bullets("Die Sicherheitsrunde", [
    ("Jede Stelle suchen, an der **Nutzereingaben** in SQL gehen — steht dort prepare?", 0),
    ("Jede Stelle suchen, an der **Daten ausgegeben** werden — steht dort die Maskierung?", 0),
    ("Prüfen, ob **Zugangsdaten** im Repository oder im Webordner liegen", 0),
    ("Testen, was bei **leeren** und bei **sehr langen** Eingaben passiert", 0),
    ("Und was passiert, wenn jemand die **URL von Hand** ändert", 0),
])

d.chapter(3, "Zwischenstand sichern", "Damit nichts verloren geht")

d.bullets("Was heute gesichert wird", [
    ("Der **Code** als nummerierte Fassung an den vereinbarten Ort", 0),
    ("Ein **Export der Datenbank** — das Anlege-Skript plus Beispieldaten", 0),
    ("Die **Dokumentation** auf dem aktuellen Stand", 0),
    ("**Screenshots** vom aktuellen Aussehen — für die Doku und die Präsentation", 0),
    ("Und der aktualisierte **Aufgabenplan**: was ist fertig, was rutscht?", 0),
])

d.merksatz("Eine Stunde für die fünf typischen Lücken macht mehr Unterschied "
           "als drei Stunden für eine neue Funktion.")

d.bullets("Fun Facts: Endspurt", [
    ("**Featuritis** kurz vor Schluss ist der häufigste Grund für Fehler in der Vorführung", 0),
    ("Deshalb gibt es in echten Projekten einen **Feature Freeze**", 0),
    ("Die letzten **10 %** kosten erfahrungsgemäß die Hälfte der Zeit", 0),
    ("Ein **Datenbankexport** ist wertvoller als die Datei selbst — er lässt sich wiederholen", 0),
    ("Und Screenshots vom Zwischenstand sind später Gold wert für die Dokumentation", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Abgleichliste** zu dritt durchgehen und abhaken", 0),
    ("Die fünf typischen offenen Punkte **abarbeiten**", 0),
    ("Vollständige **Sicherheitsrunde** — jede Stelle einzeln prüfen", 0),
    ("**Zwischenstand sichern**: Code, Datenbankexport, Doku, Screenshots", 0),
    ("Aufgabenplan für die letzten drei Doppelstunden **aktualisieren**", 0),
])

d.save()
