#!/usr/bin/env python3
"""Normalisierung: 1. bis 3. Normalform an Beispieltabellen (FOS 12, Woche 8)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import schema_diagram, ORA, RD, GRN, NAVY

d = Deck("normalisierung.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Normalisierung",
        "Redundanz systematisch loswerden: 1., 2. und 3. Normalform")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum Normalformen?", "Ein Prüfverfahren, das die Anomalien aus Woche 3 verhindert")

d.bullets("Vom Bauchgefühl zur Regel", [
    ("Woche 3: die Kursliste war **schlecht** — wir haben es gesehen, aber nicht bewiesen", 0),
    ("**Normalformen** sind Tests: besteht eine Tabelle den Test, ist diese Art Redundanz weg", 0),
    ("Drei Stufen, immer in dieser Reihenfolge: **1NF → 2NF → 3NF**", 0),
    ("Ein sauberes **ER-Modell** liefert meist schon 3NF — Normalisierung ist das Sicherheitsnetz", 0),
    ("Das Werkzeug dahinter: **Abhängigkeit** — welcher Wert legt welchen anderen fest?", 0),
])

d.table_top("Ausgangspunkt: noch schlimmer als die Kursliste", [
    ["SNr", "Name", "Klasse", "Kurse", "Lehrkräfte", "Räume", "Durchwahl"],
    ["1001", "Lena Krause", "FO12a", "Informatik, Physik", "Alvers, Schulze", "204, 305", "31, 42"],
    ["1002", "Tim Vogel", "FO12a", "Informatik, Physik", "Alvers, Schulze", "204, 305", "31, 42"],
    ["1003", "Mia Hahn", "FO12b", "Informatik", "Alvers", "204", "31"],
    ["1004", "Ben Roth", "FO12b", "Mathematik", "Berger", "118", "27"],
], [50, 110, 66, 170, 150, 100, 170], [
    ("Eine Zeile pro Schüler — bequem zum Tippen, **unbrauchbar** zum Fragen", 0),
    ("„Wer ist in Physik?“ → das DBMS müsste **Listen in Zellen** durchsuchen", 0),
    ("Welche Durchwahl gehört zu welcher Lehrkraft? Nur die **Reihenfolge** verrät es", 0),
], font_size=11, bold_cols=(1,), marks={(r, c): TINT_RED for r in (1, 2) for c in (3, 4, 5, 6)})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "1. Normalform", "Jede Zelle enthält genau einen Wert")

d.table_top("1NF: Listen auflösen — eine Zeile pro Wert", [
    ["SNr", "Name", "Klasse", "Kurs", "Lehrkraft", "Raum", "Durchwahl"],
    ["1001", "Lena Krause", "FO12a", "Informatik", "Alvers", "204", "31"],
    ["1001", "Lena Krause", "FO12a", "Physik", "Schulze", "305", "42"],
    ["1002", "Tim Vogel", "FO12a", "Informatik", "Alvers", "204", "31"],
    ["1002", "Tim Vogel", "FO12a", "Physik", "Schulze", "305", "42"],
    ["1003", "Mia Hahn", "FO12b", "Informatik", "Alvers", "204", "31"],
    ["1004", "Ben Roth", "FO12b", "Mathematik", "Berger", "118", "27"],
], [60, 130, 70, 150, 130, 100, 176], [
    ("**1NF**: jede Zelle **ein** Wert — keine Listen, keine Wiederholungsgruppen", 0),
    ("Dafür wiederholen sich Zeilen: das ist die **Kursliste** aus Woche 3", 0),
    ("Jetzt braucht die Tabelle einen **Schlüssel**: SNr allein reicht nicht mehr → **(SNr, Kurs)**", 0),
], font_size=11, bold_cols=(1,), marks={(r, 0): TINT_ORANGE for r in range(1, 7)} |
   {(r, 3): TINT_ORANGE for r in range(1, 7)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "2. Normalform", "Jedes Attribut hängt vom ganzen Schlüssel ab — nicht von einem Teil")

d.table_top("2NF: Wovon hängt jede Spalte ab?", [
    ["Spalte", "hängt ab von", "vom ganzen Schlüssel (SNr, Kurs)?", "gehört in Tabelle"],
    ["Name", "SNr", "nein — nur von SNr", "Schüler"],
    ["Klasse", "SNr", "nein — nur von SNr", "Schüler"],
    ["Lehrkraft", "Kurs", "nein — nur von Kurs", "Kurs"],
    ["Raum", "Kurs", "nein — nur von Kurs", "Kurs"],
    ["Durchwahl", "Kurs (über Lehrkraft)", "nein — nur von Kurs", "Kurs (vorerst)"],
    ["—", "(SNr, Kurs)", "das Paar selbst", "Belegung"],
], [110, 190, 300, 216], [
    ("Frage je Spalte: Brauche ich **beide** Schlüsselteile, um den Wert zu kennen?", 0),
    ("**Nein** → **Teilabhängigkeit** → die Spalte wandert zu ihrem Schlüsselteil in eine eigene Tabelle", 0),
    ("Übrig bleibt die reine Zuordnung **Belegung(SNr, Kurs)**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 3): TINT_ORANGE, (2, 3): TINT_ORANGE, (3, 3): TINT_GREEN, (4, 3): TINT_GREEN,
          (5, 3): TINT_GREEN, (6, 3): TINT_RED})

s2 = schema_diagram(P("schema-2nf.png"), [
    ("SCHÜLER", [("SNr", "PK"), ("Name", ""), ("Klasse", "")], ORA),
    ("BELEGUNG", [("SNr", "FK"), ("Kurs", "FK")], RD),
    ("KURS", [("Kurs", "PK"), ("Lehrkraft", ""), ("Raum", ""), ("Durchwahl", "")], GRN),
], Hd=400, caption="nach 2NF: drei Tabellen - aber in KURS steckt noch ein Problem")
d.picture("Nach der 2. Normalform", s2, [
    ("Name und Klasse stehen jetzt **einmal** pro Schüler, Lehrkraft und Raum **einmal** pro Kurs", 0),
    ("Die Änderungsanomalie „Raum 210“ ist damit **erledigt**", 0),
    ("Aber: **Durchwahl** wiederholt sich, wenn Alvers mehrere Kurse hat — warum?", 0),
], width=700)

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "3. Normalform", "Kein Attribut hängt von einem anderen Nicht-Schlüssel-Attribut ab")

d.table_bullets("3NF: die versteckte Abhängigkeit", [
    ("Durchwahl hängt von **Lehrkraft** ab — und Lehrkraft vom Kurs: eine **Kette**", 0),
    ("Fachwort: **transitive Abhängigkeit** (Kurs → Lehrkraft → Durchwahl)", 0),
    ("Lösung: Lehrkraft bekommt eine **eigene Tabelle**, Kurs behält nur den **Fremdschlüssel**", 0),
    ("Test: „Hängt eine Spalte von einer **anderen Nicht-Schlüssel-Spalte** ab?“ → raus damit", 0),
], [
    ["Kurs", "Lehrkraft", "Raum", "Durchwahl"],
    ["Informatik", "Alvers", "204", "31"],
    ["Physik", "Schulze", "305", "42"],
    ["Mathematik", "Berger", "118", "27"],
    ["Chemie", "Alvers", "118", "31"],
], [90, 80, 50, 76], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_ORANGE, (1, 3): TINT_ORANGE, (4, 1): TINT_ORANGE, (4, 3): TINT_ORANGE})

s3 = schema_diagram(P("schema-3nf.png"), [
    ("SCHÜLER", [("SNr", "PK"), ("Name", ""), ("Klasse", "")], ORA),
    ("BELEGUNG", [("SNr", "FK"), ("KNr", "FK")], RD),
    ("KURS", [("KNr", "PK"), ("Fach", ""), ("Raum", ""), ("LNr", "FK")], GRN),
    ("LEHRKRAFT", [("LNr", "PK"), ("Name", ""), ("Durchwahl", "")], NAVY),
], Hd=400, caption="3NF = genau das Schema, das die Überführung des ER-Modells ergab")
d.picture("Nach der 3. Normalform: bekannt?", s3, [
    ("Vier Tabellen — **dieselben** wie aus dem ER-Modell in Woche 7", 0),
    ("Zwei Wege, ein Ziel: **modellieren** (ER) oder **zerlegen** (Normalisierung)", 0),
    ("In der Praxis beides: erst modellieren, dann mit den Normalformen **prüfen**", 0),
], width=760)

d.table_top("Die drei Normalformen im Überblick", [
    ["Normalform", "Regel", "Testfrage", "Verstoß sieht so aus"],
    ["1NF", "jede Zelle genau ein Wert", "Steht irgendwo eine Liste?", "„Informatik, Physik“ in einer Zelle"],
    ["2NF", "alles hängt vom ganzen Schlüssel ab", "Reicht ein Teil des Schlüssels?", "Name hängt nur von SNr ab"],
    ["3NF", "nichts hängt von Nicht-Schlüsseln ab", "Hängt eine Spalte von einer anderen ab?", "Durchwahl hängt von Lehrkraft ab"],
], [90, 230, 250, 246], [
    ("Jede Stufe **setzt die vorige voraus**: erst 1NF, dann 2NF, dann 3NF", 0),
    ("Merkhilfe von Bill Kent: **„der Schlüssel, der ganze Schlüssel und nichts als der Schlüssel“**", 0),
    ("2NF ist nur ein Thema bei **zusammengesetzten** Schlüsseln", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Prüfrezept in fünf Schritten", [
    ("**Listen in Zellen?** Auflösen, eine Zeile pro Wert → 1NF", 0),
    ("**Schlüssel** bestimmen: welche Spalten machen eine Zeile eindeutig?", 0),
    ("**Teilabhängigkeit?** Spalten, die nur an einem Schlüsselteil hängen, auslagern → 2NF", 0),
    ("**Kette?** Spalten, die an einer anderen Nicht-Schlüssel-Spalte hängen, auslagern → 3NF", 0),
    ("**Probe:** steht jede Information genau einmal? Fremdschlüssel eintragen, fertig", 0),
])

d.bullets("Fun Facts: Normalformen", [
    ("**Edgar F. Codd** definierte 1NF bis 3NF 1970/71 — im selben Aufsatz wie das relationale Modell", 0),
    ("Es gibt weiter: **BCNF**, 4NF, 5NF, 6NF — im Alltag reicht die 3NF fast immer", 0),
    ("**Bill Kents** Merkspruch endet mit „… so help me Codd“ — ein Wortspiel auf den Eid", 0),
    ("**Denormalisierung**: Data Warehouses brechen die Regeln absichtlich, für Geschwindigkeit", 0),
])

d.merksatz("Der Schlüssel, der ganze Schlüssel und nichts als der Schlüssel.", "Bill Kent, 1983")

d.bullets("Eure Aufgabe: die Pizzeria-Tabelle normalisieren", [
    ("Tabelle **Bestellungen**: BestNr, Datum, Kunde, Adresse, Pizzen, Preise, Fahrer, Fahrer-Handy", 0),
    ("**1NF** herstellen: eine Zeile pro Pizza — und den Schlüssel bestimmen", 0),
    ("**2NF**: Welche Spalten hängen nur an BestNr, welche nur an der Pizza?", 0),
    ("**3NF**: Wovon hängt das Fahrer-Handy ab? Wovon der Preis?", 0),
    ("Vergleicht das Ergebnis mit eurem **ER-Modell** — stimmen die Tabellen überein?", 0),
])

d.save()
