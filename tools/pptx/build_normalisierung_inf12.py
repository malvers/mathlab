#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 25 / KW 8: Normalisierung bis zur dritten Normalform
(LB 2, Ustd. 15-16/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("normalisierung-inf12.pptx")

d.title("Informatik — Grundkurs 12", "Normalisierung",
        "Von der Sammeltabelle zur dritten Normalform — Schritt für Schritt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Problem", "Redundanz und ihre Anomalien")

d.table_top("Eine Sammeltabelle, wie sie oft entsteht", [
    ["SNr", "Name", "Klasse", "KNr", "Kursname", "Lehrkraft", "Raum", "Note"],
    ["1", "Meier", "BGY25", "10", "Informatik", "Alvers", "K413", "2"],
    ["1", "Meier", "BGY25", "20", "Mathe", "Berg", "K221", "1"],
    ["2", "Schulz", "BGY25", "10", "Informatik", "Alvers", "K413", "3"],
    ["3", "Krause", "BGY24", "10", "Informatik", "Alvers", "K413", "2"],
], [70, 110, 110, 70, 150, 130, 96, 80], [
    ("„Informatik“, „Alvers“ und „K413“ stehen **dreimal** — das ist **Redundanz**", 0),
    ("Der Primärschlüssel ist **(SNr, KNr)** — erst beide zusammen sind eindeutig", 0),
], font_size=10, bold_cols=(0,),
   marks={(r, c): TINT_ORANGE for r in (1, 3, 4) for c in (4, 5, 6)})

d.table_top("Die drei Anomalien", [
    ["Anomalie", "tritt auf", "Beispiel"],
    ["Änderung", "beim Ändern eines redundanten Werts", "Alvers zieht um: drei Zeilen ändern"],
    ["Einfüge", "wenn ein Ding ohne Partner nicht speicherbar ist", "neuer Kurs ohne Schüler"],
    ["Lösch", "wenn mit einer Zeile mehr verschwindet als gewollt", "letzter Schüler weg, Kurs weg"],
], [150, 330, 336], [
    ("Wird beim Ändern **eine** Zeile vergessen, ist der Bestand **inkonsistent**", 0),
    ("Die Normalisierung beseitigt die Ursache: die **Redundanz**", 0),
], font_size=10.5, bold_cols=(0,), marks={(r, 0): TINT_RED for r in range(1, 4)})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Erste und zweite Normalform", "Atomar und voll abhängig")

d.table_top("1NF und 2NF", [
    ["Form", "Bedingung", "in unserem Beispiel"],
    ["1NF", "alle Werte sind atomar, keine Wiederholungsgruppen", "erfüllt"],
    ["2NF", "1NF und jedes Nichtschlüsselattribut hängt vom **ganzen** Schlüssel ab", "verletzt"],
], [90, 420, 306], [
    ("**Name** und **Klasse** hängen nur von **SNr** ab — das ist eine **partielle** Abhängigkeit", 0),
    ("**Kursname**, **Lehrkraft** und **Raum** hängen nur von **KNr** ab — ebenfalls partiell", 0),
    ("Partielle Abhängigkeiten kann es nur bei **zusammengesetzten** Schlüsseln geben", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 2): TINT_RED})

d.table_top("Nach der Zerlegung in 2NF", [
    ["Relation", "Schema"],
    ["Schueler", "Schueler(SNr, Name, Klasse)"],
    ["Kurs", "Kurs(KNr, Kursname, Lehrkraft, Raum)"],
    ["Belegung", "Belegung(SNr, KNr, Note)"],
], [200, 616], [
    ("Jede Angabe steht jetzt **einmal** — bis auf die Fremdschlüssel, die dort hingehören", 0),
    ("**Note** bleibt in Belegung: sie hängt tatsächlich von **beiden** Schlüsseln ab", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(1,), marks={(3, 1): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Dritte Normalform", "Keine transitiven Abhängigkeiten")

d.bullets("Was in Kurs noch stört", [
    ("**KNr** bestimmt die **Lehrkraft** — das ist richtig so", 0),
    ("Aber die **Lehrkraft** bestimmt den **Raum** — jede Lehrkraft hat ein Stammzimmer", 0),
    ("Also bestimmt KNr den Raum nur **über die Lehrkraft** — das ist **transitiv**", 0),
    ("Folge: zieht eine Lehrkraft um, sind wieder mehrere Zeilen betroffen", 0),
    ("**3NF**: kein Nichtschlüsselattribut hängt von einem anderen Nichtschlüsselattribut ab", 0),
])

d.table_top("Das Ergebnis in dritter Normalform", [
    ["Relation", "Schema", "Bemerkung"],
    ["Schueler", "Schueler(SNr, Name, Klasse)", "unverändert"],
    ["Kurs", "Kurs(KNr, Kursname, Lehrkraft)", "Raum ausgelagert"],
    ["Lehrkraft", "Lehrkraft(Lehrkraft, Raum)", "neu"],
    ["Belegung", "Belegung(SNr, KNr, Note)", "unverändert"],
], [150, 400, 266], [
    ("Vier Tabellen statt einer — dafür steht **jede Angabe genau einmal**", 0),
    ("Der Preis: für eine lesbare Liste braucht es jetzt **JOINs**", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,), marks={(3, 2): TINT_GREEN})

d.merksatz("1NF: atomare Werte. 2NF: vom ganzen Schlüssel abhängig. "
           "3NF: nicht von einem anderen Nichtschlüsselattribut abhängig.")

d.bullets("Fun Facts: Normalformen", [
    ("Die ersten drei Normalformen stammen von **Codd** (1970 bis 1971)", 0),
    ("Die **Boyce-Codd-Normalform** verschärft die 3NF und kam 1974 dazu", 0),
    ("Es gibt Normalformen bis zur **sechsten** — in der Praxis endet man meist bei 3NF", 0),
    ("Der Merkspruch: **„the key, the whole key, and nothing but the key“**", 0),
    ("In Data Warehouses wird bewusst **denormalisiert** — dort zählt Lesegeschwindigkeit mehr", 0),
])

d.bullets("Eure Aufgabe: normalisieren", [
    ("Nehmt die Sammeltabelle **Ausleihe** vom Arbeitsblatt (Buch, Leser, Ausleihe, Verlag)", 0),
    ("Bestimmt den **Primärschlüssel** und alle funktionalen Abhängigkeiten", 0),
    ("Zerlegt in **2NF** und begründet jede partielle Abhängigkeit", 0),
    ("Zerlegt in **3NF** und benennt die transitive Abhängigkeit", 0),
    ("Setzt das Ergebnis als **CREATE TABLE** um und füllt es mit Beispieldaten", 0),
])

d.save()
