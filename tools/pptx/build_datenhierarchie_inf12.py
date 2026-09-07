#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 15 / KW 50: Strukturierung von Daten - Datenhierarchie
(LB 2, Ustd. 1-2/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("datenhierarchie.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Von Bit bis Datenbank",
        "Die Datenhierarchie — und wie ein Rechner strukturierte Daten speichert")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Hierarchie", "Sechs Stufen, aufeinander aufgebaut")

dia = pap(P("pap-datenhierarchie-inf12.png"), 1560, 330, {
    "a": dict(pos=(150, 130), w=210, h=110, text="Bit"),
    "b": dict(pos=(410, 130), w=210, h=110, text="Byte / Zeichen"),
    "c": dict(pos=(690, 130), w=250, h=110, text="Datenfeld"),
    "e": dict(pos=(1000, 130), w=250, h=110, text="Datensatz"),
    "f": dict(pos=(1330, 130), w=250, h=110, text="Datei / Tabelle"),
}, [("a", "b", ""), ("b", "c", ""), ("c", "e", ""), ("e", "f", "")], size=30)
d.picture("Die Datenhierarchie", dia, [
    ("Jede Stufe **besteht aus** der vorigen — und bekommt dabei eine **Bedeutung** dazu", 0),
    ("Über der Datei steht die **Datenbank**: mehrere Tabellen mit Beziehungen", 0),
], width=816)

d.table_top("Die Stufen im Einzelnen", [
    ["Stufe", "ist", "Beispiel"],
    ["Bit", "kleinste Einheit, 0 oder 1", "1"],
    ["Byte", "8 Bit, meist ein Zeichen", "01001101 = M"],
    ["Datenfeld", "eine zusammengehörige Angabe", "Nachname"],
    ["Datensatz", "alle Felder zu einem Objekt", "eine Schülerzeile"],
    ["Datei / Tabelle", "alle gleichartigen Datensätze", "die Schülerliste"],
    ["Datenbank", "mehrere Tabellen mit Beziehungen", "Schulverwaltung"],
], [180, 350, 286], [
    ("Der Sprung von **Byte zu Datenfeld** ist der entscheidende: dort kommt die **Bedeutung** dazu", 0),
    ("Ein Byte allein sagt nichts. Erst das Feld sagt: **das ist ein Nachname**", 0),
], font_size=11, bold_cols=(0,), marks={(3, 0): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Vom Feld zum Byte", "Wie eine Angabe wirklich im Speicher liegt")

d.table_top("Dieselbe Angabe, verschiedene Speicherung", [
    ["Angabe", "als Text", "als Zahl", "Bemerkung"],
    ["2026", "4 Byte (Zeichen)", "2 Byte (Ganzzahl)", "Zahl ist kompakter"],
    ["01067", "5 Byte", "geht nicht ohne Verlust", "führende Null"],
    ["true", "4 Byte", "1 Bit", "Wahrheitswert"],
    ["Meier", "5 Byte", "nicht möglich", "reiner Text"],
], [150, 220, 220, 226], [
    ("Der **Datentyp** entscheidet über Speicherbedarf, Sortierung und mögliche Operationen", 0),
    ("Bei **Unicode/UTF-8** braucht ein Umlaut **zwei** Byte — Textlängen sind nicht Zeichenzahlen", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Wie eine Datei strukturierte Daten hält", [
    ("**Feste Satzlänge**: jedes Feld hat eine feste Größe, Datensätze folgen lückenlos", 0),
    ("Vorteil: der **n-te** Datensatz lässt sich direkt berechnen — schneller Zugriff", 0),
    ("Nachteil: **verschwendeter Platz** und starre Struktur", 0),
    ("**Trennzeichen** (CSV): Felder durch Komma, Sätze durch Zeilenumbruch", 0),
    ("Vorteil: sparsam und lesbar. Nachteil: **Suchen heißt Lesen** — von vorn bis hinten", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Warum das nicht reicht", "Der Weg zur Datenbank")

d.table_top("Grenzen der Dateiverwaltung", [
    ["Problem", "was passiert"],
    ["Redundanz", "dieselbe Adresse steht in drei Dateien"],
    ["Inkonsistenz", "sie wird nur in einer davon geändert"],
    ["Abhängigkeit", "jedes Programm muss das Dateiformat kennen"],
    ["Mehrbenutzerbetrieb", "zwei schreiben gleichzeitig, einer verliert"],
    ["Zugriffsschutz", "wer die Datei hat, sieht alles"],
], [200, 616], [
    ("Genau diese fünf Probleme löst ein **Datenbankmanagementsystem**", 0),
    ("Deshalb ist die Datenbank keine bessere Datei, sondern eine **andere Architektur**", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 0): TINT_RED for r in range(1, 6)})

d.merksatz("Bit, Byte, Datenfeld, Datensatz, Datei, Datenbank. "
           "Die Bedeutung kommt erst auf der Stufe des Datenfelds dazu.")

d.bullets("Fun Facts: Daten und Speicher", [
    ("Das Wort **Byte** wurde 1956 bei IBM geprägt — bewusst anders geschrieben als „bite“", 0),
    ("Dass ein Byte **8 Bit** hat, ist keine Naturkonstante: frühe Rechner nutzten 6, 7 oder 9", 0),
    ("**ASCII** von 1963 kam mit 7 Bit aus — für Umlaute reichte das nicht", 0),
    ("**UTF-8** von 1992 ist rückwärtskompatibel und braucht für Umlaute zwei Byte", 0),
    ("Ein **Kibibyte** sind 1024 Byte, ein **Kilobyte** 1000 — Festplattenhersteller rechnen gern in Kilo", 0),
])

d.bullets("Eure Aufgabe", [
    ("Öffnet eine **CSV-Datei** im Texteditor und benennt Datenfeld, Datensatz und Datei", 0),
    ("Rechnet aus: wie viele **Byte** braucht ein Datensatz eurer Tabelle als Text?", 0),
    ("Vergleicht das mit derselben Tabelle bei **fester Satzlänge**", 0),
    ("Findet in einer Beispieldatei eine **Redundanz** und beschreibt die mögliche Inkonsistenz", 0),
    ("Formuliert drei Sätze: **Warum genügt eine Datei für die Schulverwaltung nicht?**", 0),
])

d.save()
