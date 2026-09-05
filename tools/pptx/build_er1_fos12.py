#!/usr/bin/env python3
"""Entity-Relationship-Modell I: Entitaeten, Attribute, Beziehungen (FOS 12, Woche 6)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import er_diagram, ORA, RD, GRN, NAVY

d = Deck("er-modell-1.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Entity-Relationship-Modell I",
        "Die Welt beschreiben, bevor man Tabellen baut")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Wirklichkeit wird Modell",
          "Erst verstehen, was es gibt — dann entscheiden, wie man es speichert")

d.bullets("Warum modellieren?", [
    ("Die Kursliste aus Woche 3 war ein Modell — ein **schlechtes**: alles in eine Tabelle", 0),
    ("Vor der ersten Tabelle drei Fragen: **Welche Dinge?** **Welche Eigenschaften?** **Welche Beziehungen?**", 0),
    ("Das **ER-Modell** (Peter Chen, 1976) beantwortet sie als **Bild** — ohne eine Zeile SQL", 0),
    ("Ein Bild, das Auftraggeber **und** Entwickler verstehen: die gemeinsame Sprache", 0),
    ("Danach ist der Weg zu den Tabellen **mechanisch** — nächste Woche", 0),
])

# the legend is clearer drawn by hand: rectangle, ellipse, diamond side by side
from PIL import Image, ImageDraw
from diagrams import box, centered, font, WHITE
img = Image.new("RGBA", (1600, 330), (0, 0, 0, 0))
dr = ImageDraw.Draw(img)
f_e, f_a, f_n = font("Orbitron-Bold.ttf", 26), font("Raleway-Medium.ttf", 24), font("Raleway-Regular.ttf", 24)
# entity
box(dr, (60, 60, 380, 150), r=8); dr.rectangle((60, 60, 74, 150), fill=ORA)
centered(dr, "SCHÜLER", 227, 105, f_e, NAVY)
centered(dr, "Entitätstyp: ein Rechteck", 220, 200, f_n, NAVY)
centered(dr, "eine Klasse gleichartiger Dinge", 220, 236, f_n, (110, 126, 159))
# attribute
dr.ellipse((520, 60, 760, 150), fill=WHITE, outline=NAVY, width=3)
centered(dr, "Name", 640, 105, f_a, NAVY)
dr.ellipse((780, 60, 1020, 150), fill=WHITE, outline=NAVY, width=3)
centered(dr, "SNr", 900, 105, f_a, NAVY)
dr.line([(870, 123), (930, 123)], fill=NAVY, width=3)
centered(dr, "Attribut: eine Ellipse", 770, 200, f_n, NAVY)
centered(dr, "Schlüsselattribut unterstrichen", 770, 236, f_n, (110, 126, 159))
# relation
pts = [(1310, 50), (1440, 105), (1310, 160), (1180, 105)]
dr.polygon(pts, fill=(244, 247, 252)); dr.line(pts + [pts[0]], fill=NAVY, width=3)
centered(dr, "belegt", 1310, 105, font("Raleway-SemiBold.ttf", 24), NAVY)
centered(dr, "Beziehungstyp: eine Raute", 1310, 200, f_n, NAVY)
centered(dr, "ein Verb zwischen zwei Entitätstypen", 1310, 236, f_n, (110, 126, 159))
img.save(P("er-legende.png"))

d.picture("Die drei Bausteine (Chen-Notation)", P("er-legende.png"), [
    ("**Entitätstyp**: Schüler, Kurs, Lehrkraft — die **Dinge**, die es gibt", 0),
    ("**Attribut**: Name, SNr, Raum — die **Eigenschaften** eines Dings", 0),
    ("**Beziehungstyp**: belegt, leitet — was die Dinge **miteinander** zu tun haben", 0),
    ("Linien verbinden — mehr Zeichen braucht das Modell nicht", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Entitäten und Attribute", "Was ist ein Ding, was ist nur eine Eigenschaft?")

d.table_bullets("Entität oder Attribut?", [
    ("**Entitätstyp** = die Klasse (Schüler), **Entität** = ein konkretes Exemplar (Lena Krause)", 0),
    ("Test: Hat es **eigene Eigenschaften**? Dann ist es eine Entität", 0),
    ("Test: Ist es nur **ein Wert**? Dann ist es ein Attribut", 0),
    ("Jeder Entitätstyp braucht ein **Schlüsselattribut**: eindeutig, nie leer", 0),
    ("Hat er keins, erfindet man eins: **SNr**, KNr, LNr", 0),
], [
    ["Kandidat", "Entität?", "Warum"],
    ["Schüler", "ja", "hat Name, Klasse, Datum"],
    ["Klasse 'FO12a'", "eher nein", "nur ein Wert"],
    ["Lehrkraft", "ja", "hat Name, Durchwahl"],
    ["Raum", "kommt drauf an", "nur Nummer → Attribut"],
    ["", "", "mit Größe, Ausstattung → Entität"],
], [110, 100, 200], font_size=10, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_RED, (3, 1): TINT_GREEN, (4, 1): TINT_ORANGE})

d.table_top("Vom Text zum Modell: der Auftrag lesen", [
    ["Satz aus dem Auftrag", "Baustein", "Im Modell"],
    ["„Jeder Schüler hat eine Nummer, einen Namen und eine Klasse.“", "Entität + Attribute", "SCHÜLER (SNr, Name, Klasse)"],
    ["„Ein Kurs hat ein Fach und einen Raum.“", "Entität + Attribute", "KURS (KNr, Fach, Raum)"],
    ["„Schüler belegen Kurse.“", "Beziehung", "SCHÜLER — belegt — KURS"],
    ["„Jeden Kurs leitet genau eine Lehrkraft.“", "Beziehung + Kardinalität", "LEHRKRAFT — leitet — KURS, 1:n"],
], [376, 180, 260], [
    ("**Hauptwörter** werden Entitätstypen — wenn sie eigene Eigenschaften haben", 0),
    ("**Eigenschaften** („hat eine Nummer“) werden Attribute", 0),
    ("**Verben** zwischen zwei Hauptwörtern („belegen“, „leitet“) werden Beziehungstypen", 0),
    ("**Zahlwörter** („genau eine“, „mehrere“) verraten die Kardinalität", 0),
], font_size=11)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Beziehungen und Kardinalitäten", "Wie viele auf jeder Seite? 1:1, 1:n oder n:m")

card = er_diagram(P("er-kardinalitaeten.png"), 1700, 720, {
    "Klasse":     {"pos": (200, 140), "color": ORA},
    "Klassenleitung": {"pos": (1420, 140), "color": NAVY},
    "Lehrkraft":  {"pos": (200, 380), "color": NAVY},
    "Kurs":       {"pos": (1420, 380), "color": GRN},
    "Schüler":    {"pos": (200, 620), "color": ORA},
    "Kurs ":      {"pos": (1420, 620), "color": GRN},
}, [
    {"name": "hat", "pos": (800, 140), "ends": [("Klasse", "1"), ("Klassenleitung", "1")]},
    {"name": "leitet", "pos": (800, 380), "ends": [("Lehrkraft", "1"), ("Kurs", "n")]},
    {"name": "belegt", "pos": (800, 620), "ends": [("Schüler", "n"), ("Kurs ", "m")]},
], notes=[("1 : 1", (800, 60)), ("1 : n", (800, 300)), ("n : m", (800, 540))])
d.picture("Kardinalitäten: 1:1, 1:n, n:m", card, [
    ("**1:1** — eine Klasse hat **eine** Klassenleitung, eine Klassenleitung **eine** Klasse", 0),
    ("**1:n** — **eine** Lehrkraft leitet **viele** Kurse, jeder Kurs hat **eine** Lehrkraft", 0),
    ("**n:m** — ein Schüler belegt **viele** Kurse, ein Kurs hat **viele** Schüler", 0),
], width=520)

d.bullets("Kardinalität bestimmen: zwei Fragen stellen", [
    ("Frage 1: **Ein** Schüler — wie viele Kurse kann er belegen? → **viele** (n)", 0),
    ("Frage 2: **Ein** Kurs — wie viele Schüler kann er haben? → **viele** (m)", 0),
    ("Beide Antworten zusammen: **n:m**", 0),
    ("Die Zahl steht immer **am anderen Ende**: „eine Lehrkraft leitet **n** Kurse“ — das n steht beim Kurs", 0),
    ("Genauer geht es mit **Min-Max**: (0,n) = kann auch keinen haben — (1,1) = genau einen, Pflicht", 0),
    ("Im Zweifel: den **Auftraggeber fragen**, nicht raten", 0),
])

schule = er_diagram(P("er-schule.png"), 1820, 660, {
    "Schüler":   {"pos": (300, 400), "color": ORA,
                  "attrs": [("SNr", True, (-200, -170)), ("Name", False, (0, -210)),
                            ("Klasse", False, (200, -170)), ("Geburtsdatum", False, (0, 160))]},
    "Kurs":      {"pos": (900, 400), "color": GRN,
                  "attrs": [("KNr", True, (-200, -170)), ("Fach", False, (0, -210)),
                            ("Raum", False, (200, -170))]},
    "Lehrkraft": {"pos": (1500, 400), "color": NAVY,
                  "attrs": [("LNr", True, (-200, -170)), ("Name", False, (0, -210)),
                            ("Durchwahl", False, (200, -170))]},
}, [
    {"name": "belegt", "pos": (600, 400), "ends": [("Schüler", "n"), ("Kurs", "m")]},
    {"name": "leitet", "pos": (1200, 400), "ends": [("Kurs", "n"), ("Lehrkraft", "1")]},
])
d.picture("Das ER-Modell unserer Schul-Datenbank", schule, [
    ("Drei Entitätstypen, zwei Beziehungstypen — das **ganze** Modell von schule.db", 0),
    ("Belegung ist **keine** Entität, sondern die n:m-Beziehung „belegt“ — ihre Tabelle entsteht erst bei der Überführung", 0),
], width=660)

praktikum = er_diagram(P("er-praktikum.png"), 1600, 660, {
    "Schüler": {"pos": (300, 400), "color": ORA,
                "attrs": [("SNr", True, (-200, -170)), ("Name", False, (0, -210)),
                          ("Klasse", False, (200, -170))]},
    "Betrieb": {"pos": (1300, 400), "color": GRN,
                "attrs": [("BNr", True, (-200, -170)), ("Name", False, (0, -210)),
                          ("Ort", False, (200, -170)), ("Branche", False, (0, 160))]},
}, [
    {"name": "absolviert", "pos": (800, 400), "ends": [("Schüler", "n"), ("Betrieb", "m")],
     "attrs": [("Beginn", (-130, 160)), ("Ende", (130, 160))]},
], notes=[("Beginn und Ende gehören zur Beziehung - weder zum Schüler noch zum Betrieb", (800, 620))])
d.picture("Fallbeispiel: das Praktikum", praktikum, [
    ("„Schüler absolvieren Praktika in Betrieben. Ein Betrieb hat Name, Ort, Branche.“", 0),
    ("„Jedes Praktikum hat Beginn und Ende.“ → **Attribute an der Beziehung**", 0),
    ("Ein Schüler macht **mehrere** Praktika, ein Betrieb nimmt **mehrere** Schüler: **n:m**", 0),
], width=540)

d.bullets("Fun Facts: ER-Modell", [
    ("**Peter Chen**, 1976: sein Aufsatz zum ER-Modell gehört zu den **meistzitierten** der Informatik", 0),
    ("Chen wollte eine Notation, die **Kaufleute und Programmierer** gleichermaßen lesen können", 0),
    ("Die **Krähenfuß**-Notation (crow's foot) zeichnet „viele“ als Vogelfuß — in Werkzeugen heute häufiger als Chens Rauten", 0),
    ("**Werkzeuge** wie draw.io oder dbdiagram.io machen aus dem Diagramm direkt die CREATE-TABLE-Befehle", 0),
])

d.merksatz("Dinge werden Entitäten, Eigenschaften werden Attribute, Verben werden Beziehungen.")

d.bullets("Eure Aufgabe: euer eigenes Modell", [
    ("Beschreibt einen Ausschnitt in **fünf Sätzen**: Praktikumsbetrieb, Verein, Nebenjob, Bibliothek …", 0),
    ("Mindestens **drei Entitätstypen**, jeder mit **Schlüssel** und zwei weiteren Attributen", 0),
    ("Alle **Beziehungstypen** mit Kardinalität — begründet jede mit den zwei Fragen", 0),
    ("Mindestens **eine n:m-Beziehung**, gern mit eigenem Attribut", 0),
    ("Auf Papier zeichnen — nächste Woche wird daraus die Datenbank", 0),
])

d.save()
