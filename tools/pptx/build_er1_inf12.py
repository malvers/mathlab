#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 22 / KW 4: Semantische und logische Datenmodellierung -
ER-Modell I (LB 2, Ustd. 11-12/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import er_diagram

d = Deck("er-modell-1-inf12.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Das Entity-Relationship-Modell",
        "Entitäten, Attribute, Beziehungen — und die Kardinalitäten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei Bausteine", "Entität, Attribut, Beziehung")

d.table_top("Die Elemente des ER-Modells", [
    ["Element", "Form", "ist", "Beispiel"],
    ["Entitätstyp", "Rechteck", "eine Art von Ding", "Schueler"],
    ["Attribut", "Ellipse", "ein Merkmal", "name, geburt"],
    ["Schlüsselattribut", "unterstrichen", "macht eindeutig", "snr"],
    ["Beziehungstyp", "Raute", "Zusammenhang zweier Entitätstypen", "belegt"],
    ["Kardinalität", "Beschriftung", "wie viele zu wie vielen", "1:n, n:m"],
], [180, 160, 300, 176], [
    ("Das Modell ist **sprach- und systemunabhängig** — es beschreibt die Miniwelt, nicht die Tabellen", 0),
    ("Erst im nächsten Schritt wird daraus ein **Relationenschema**", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Wie man Entitätstypen findet", [
    ("**Substantive** im Anforderungstext markieren", 0),
    ("Prüfen: Hat das Ding **eigene Merkmale**, die man speichern will?", 0),
    ("Prüfen: Gibt es davon **mehrere Exemplare**, die man unterscheiden muss?", 0),
    ("Zweimal ja: **Entitätstyp**. Sonst meist ein **Attribut**", 0),
    ("„Klasse“ kann beides sein — Attribut von Schueler oder eigener Entitätstyp. Der **Zweck** entscheidet", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Kardinalitäten", "Die wichtigste Entscheidung im Modell")

d.table_top("Die drei Grundfälle", [
    ["Typ", "heißt", "Beispiel"],
    ["1:1", "einer zu genau einem", "Schüler und Ausweisnummer"],
    ["1:n", "einer zu vielen", "eine Klasse hat viele Schüler"],
    ["n:m", "viele zu vielen", "Schüler belegen Kurse"],
], [130, 300, 386], [
    ("Bestimmt wird sie durch **zwei Fragen**, je Richtung eine", 0),
    ("„**Ein** Schüler belegt wie viele Kurse?“ — viele. „**Ein** Kurs hat wie viele Schüler?“ — viele", 0),
    ("Zweimal „viele“ ergibt **n:m** — der Fall, der beim Umsetzen eine eigene Tabelle braucht", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(3, 0): TINT_ORANGE, (3, 1): TINT_ORANGE, (3, 2): TINT_ORANGE})

d.bullets("Der häufigste Fehler bei Kardinalitäten", [
    ("Beide Fragen **in dieselbe Richtung** gestellt — dann kommt immer 1:n heraus", 0),
    ("Die Frage lautet: **Ein** Exemplar links steht zu wie vielen rechts? Und umgekehrt", 0),
    ("Achtet auf den **Zeitbezug**: „ein Schüler hat einen Klassenlehrer“ — jetzt, oder je gehabt?", 0),
    ("Und auf die **Pflicht**: muss jeder Kurs belegt sein, oder darf er leer bleiben?", 0),
    ("Diese Feinheit heißt **Optionalität** und wird oft als (min, max) notiert", 0),
])

er = er_diagram(P("er-schule-inf12.png"), 1500, 520, {
    "Schueler": {"pos": (330, 300), "attrs": [("snr", True, (-190, -150)),
                                              ("name", False, (0, -170)),
                                              ("klasse", False, (-200, 150))]},
    "Kurs": {"pos": (1170, 300), "attrs": [("knr", True, (190, -150)),
                                           ("bezeichnung", False, (10, -170)),
                                           ("stunden", False, (200, 150))]},
}, [
    {"name": "belegt", "pos": (750, 300),
     "ends": [("Schueler", "n"), ("Kurs", "m")],
     "attrs": [("note", (0, 150))]},
])
d.picture("Ein ER-Diagramm der Schuldatenbank", er, [
    ("**Schueler** und **Kurs** sind Entitätstypen, **belegt** ist die Beziehung", 0),
    ("Die Kardinalität **n:m** steht an den Kanten der Raute", 0),
], width=700)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Modellieren", "Vom Text zum Diagramm")

d.table_top("Der Weg in fünf Schritten", [
    ["Schritt", "Ergebnis"],
    ["1. Text lesen und Substantive markieren", "Kandidatenliste"],
    ["2. Entitätstypen auswählen", "Rechtecke"],
    ["3. Attribute zuordnen, Schlüssel bestimmen", "Ellipsen, unterstrichen"],
    ["4. Beziehungen benennen", "Rauten mit Verb"],
    ["5. Kardinalitäten bestimmen", "Beschriftung an den Kanten"],
], [330, 486], [
    ("Beziehungen werden mit einem **Verb** benannt: belegt, unterrichtet, gehört zu", 0),
    ("Wenn die Beziehung eigene Merkmale hat (etwa die **Note**), gehören sie an die **Raute**", 0),
], font_size=11.5, bold_cols=(0,), marks={(5, 0): TINT_GREEN})

d.merksatz("Die Kardinalität bestimmt man mit zwei Fragen — einer je Richtung. "
           "Wer nur in eine Richtung fragt, bekommt immer 1:n.")

d.bullets("Fun Facts: ER-Modell", [
    ("**Peter Chen** veröffentlichte das ER-Modell 1976 am MIT", 0),
    ("Sein Aufsatz gehört zu den meistzitierten der ganzen Informatik", 0),
    ("Die **Chen-Notation** mit Rauten ist die klassische — daneben gibt es Krähenfuß und UML", 0),
    ("Der **Krähenfuß** (crow's foot) zeigt die Kardinalität als dreizinkiges Symbol an der Kante", 0),
    ("In Werkzeugen sieht man heute meist die **UML-Notation** mit Zahlen an den Enden", 0),
])

d.bullets("Eure Aufgabe: ein ER-Diagramm entwerfen", [
    ("Nehmt eine Miniwelt aus eurem Fachbereich — Bibliothek, Verein, Werkstatt, Fuhrpark", 0),
    ("**Drei bis fünf Entitätstypen** mit Attributen und Schlüssel", 0),
    ("Mindestens eine **1:n**- und eine **n:m**-Beziehung", 0),
    ("Jede Kardinalität mit **beiden Fragen** begründen — schriftlich", 0),
    ("Tauscht mit dem Nachbarpaar: **Sind die Kardinalitäten nachvollziehbar?**", 0),
])

d.save()
