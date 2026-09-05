#!/usr/bin/env python3
"""Entity-Relationship-Modell II: Ueberfuehrung in ein Datenbanksystem (FOS 12, Woche 7)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import add_table, TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import er_diagram, schema_diagram, ORA, RD, GRN, NAVY
from design_lib import MARGIN, BODY_Y, W

d = Deck("er-modell-2.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Entity-Relationship-Modell II",
        "Vom Diagramm zur Datenbank: drei Überführungsregeln")


def rule_slide(title, pic, lines, tables, pic_w=600):
    """Picture centred on top, bullets bottom-left, result tables stacked bottom-right."""
    from deck_util import add_click_build
    from PIL import Image
    from design_lib import emu, CONTENT_W, FOOT_Y
    s, body = d._content("Inhalt", title, lines)
    iw, ih = Image.open(pic).size
    ph = pic_w * ih / iw
    s.shapes.add_picture(pic, emu(MARGIN + (CONTENT_W - pic_w) / 2), emu(BODY_Y), emu(pic_w), emu(ph))
    top = BODY_Y + ph + 10
    body_w = CONTENT_W - max(sum(cw) for _, cw, _ in tables) - 24
    d.place(body, MARGIN, top, body_w, FOOT_Y - top - 8)
    d._check_body(lines, body_w, FOOT_Y - top - 8, title)
    y = top + 4
    for rows, col_w, kw in tables:
        add_table(s, rows, W - MARGIN - sum(col_w), y, col_w, **kw)
        y += kw.get("font_size", 10) * 1.9 * len(rows) + 14
    add_click_build(s, [(body, lines)])
    return s

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei Regeln", "Aus jedem ER-Modell wird mechanisch ein Satz Tabellen")

d.table_top("Die Überführungsregeln im Überblick", [
    ["Regel", "Im ER-Modell", "In der Datenbank"],
    ["1", "Entitätstyp mit Attributen", "eine Tabelle, Attribute = Spalten, Schlüssel = PRIMARY KEY"],
    ["2", "Beziehung 1:n", "Fremdschlüssel auf der n-Seite"],
    ["3", "Beziehung n:m", "eigene Tabelle mit zwei Fremdschlüsseln (+ Beziehungsattribute)"],
    ["3a", "Beziehung 1:1", "Fremdschlüssel auf einer Seite — oder beide Tabellen zusammenlegen"],
], [60, 240, 516], [
    ("Die Regeln sind so **mechanisch**, dass Werkzeuge sie automatisch anwenden", 0),
    ("Trotzdem von Hand können: in der **Klausur** gibt es kein Werkzeug", 0),
    ("Danach prüfen: kommt jede Information **genau einmal** vor?", 0),
], font_size=11, bold_cols=(0,), align=["c", "l", "l"])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Regel 1: Entitätstyp wird Tabelle", "Attribute werden Spalten, das Schlüsselattribut wird Primärschlüssel")

frag1 = er_diagram(P("er-regel1.png"), 760, 420, {
    "Schüler": {"pos": (380, 320), "color": ORA,
                "attrs": [("SNr", True, (-220, -170)), ("Name", False, (-70, -210)),
                          ("Klasse", False, (90, -210)), ("Geburtsdatum", False, (240, -160))]},
}, [])
s = d.picture_table("Regel 1: SCHÜLER wird zur Tabelle Schueler", frag1, [
    ["SNr", "Name", "Klasse", "Geburtsdatum"],
    ["1001", "Lena Krause", "FO12a", "2008-04-17"],
    ["1002", "Tim Vogel", "FO12a", "2007-11-02"],
    ["1003", "Mia Hahn", "FO12b", "2008-09-30"],
], [56, 110, 66, 110], [
    ("Rechteck → **Tabelle**, jede Ellipse → **Spalte**, unterstrichen → **PRIMARY KEY**", 0),
    ("Für jede Spalte einen **Datentyp** wählen: INTEGER, TEXT, ISO-Datum als TEXT", 0),
    ("Zusammengesetzte Attribute (Adresse) → **mehrere** Spalten: Straße, PLZ, Ort", 0),
], pic_w=320, font_size=11, bold_cols=(0,))

d.code("Regel 1 in SQL", [
    "CREATE TABLE Schueler (",
    "  SNr           INTEGER PRIMARY KEY,   -- das unterstrichene Attribut",
    "  Name          TEXT    NOT NULL,",
    "  Klasse        TEXT    NOT NULL,",
    "  Geburtsdatum  TEXT                   -- 'JJJJ-MM-TT'",
    ");",
    "",
    "CREATE TABLE Lehrkraft (",
    "  LNr        INTEGER PRIMARY KEY,",
    "  Name       TEXT    NOT NULL,",
    "  Durchwahl  INTEGER",
    ");",
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Regel 2: 1:n wird Fremdschlüssel", "Der Schlüssel der 1-Seite wandert als Spalte auf die n-Seite")

frag2 = er_diagram(P("er-regel2.png"), 1500, 300, {
    "Lehrkraft": {"pos": (250, 150), "color": NAVY},
    "Kurs":      {"pos": (1250, 150), "color": GRN},
}, [{"name": "leitet", "pos": (750, 150), "ends": [("Lehrkraft", "1"), ("Kurs", "n")]}])
rule_slide("Regel 2: LEHRKRAFT leitet KURS (1:n)", frag2, [
    ("Ein Kurs hat **genau eine** Lehrkraft → er merkt sich ihre Nummer: **LNr in Kurs**", 0),
    ("Die Lehrkraft merkt sich **nichts**: viele Kurse passen nicht in eine Zelle", 0),
    ("Regel: der Fremdschlüssel steht **immer auf der n-Seite**", 0),
], [
    ([["LNr", "Name", "Durchwahl"], ["1", "Alvers", "31"], ["2", "Schulze", "42"]],
     [44, 80, 80], dict(font_size=10, bold_cols=(0,), align=["r", "l", "r"], name="Lehrkraft")),
    ([["KNr", "Fach", "Raum", "LNr"], ["3", "Informatik", "204", "1"], ["4", "Physik", "305", "2"],
      ["5", "Mathematik", "118", "1"]],
     [44, 90, 52, 64], dict(font_size=10, bold_cols=(0,), align=["r", "l", "r", "r"], name="Kurs",
                            marks={(1, 3): TINT_RED, (2, 3): TINT_RED, (3, 3): TINT_RED})),
])

d.code("Regel 2 in SQL: REFERENCES", [
    "CREATE TABLE Kurs (",
    "  KNr   INTEGER PRIMARY KEY,",
    "  Fach  TEXT    NOT NULL,",
    "  Raum  TEXT,",
    "  LNr   INTEGER NOT NULL REFERENCES Lehrkraft(LNr)   -- der Fremdschlüssel",
    ");",
    "",
    "-- NOT NULL: jeder Kurs MUSS eine Lehrkraft haben  -> Min-Max (1,1)",
    "-- ohne NOT NULL: Kurs darf (noch) ohne Lehrkraft sein -> (0,1)",
    "",
    "-- Reihenfolge: Lehrkraft VOR Kurs anlegen - der Verweis braucht sein Ziel",
    "PRAGMA foreign_keys = ON;",
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Regel 3: n:m wird eigene Tabelle", "Die Beziehung bekommt eine Tabelle mit zwei Fremdschlüsseln")

frag3 = er_diagram(P("er-regel3.png"), 1500, 300, {
    "Schüler": {"pos": (250, 150), "color": ORA},
    "Kurs":    {"pos": (1250, 150), "color": GRN},
}, [{"name": "belegt", "pos": (750, 150), "ends": [("Schüler", "n"), ("Kurs", "m")]}])
rule_slide("Regel 3: SCHÜLER belegt KURS (n:m)", frag3, [
    ("Auf **keiner** Seite passt der Fremdschlüssel: beide hätten viele Werte", 0),
    ("Also bekommt die **Raute** eine eigene Tabelle: **Belegung (SNr, KNr)**", 0),
    ("Beide Spalten zusammen sind der **Primärschlüssel**: jedes Paar nur einmal", 0),
    ("Jede Spalte ist zugleich **Fremdschlüssel** auf ihre Tabelle", 0),
], [
    ([["SNr", "KNr"], ["1001", "3"], ["1001", "4"], ["1002", "3"], ["1003", "3"]],
     [60, 60], dict(font_size=10, bold_cols=(0, 1), align=["r", "r"], name="Belegung",
                    marks={(1, 0): TINT_ORANGE, (2, 0): TINT_ORANGE})),
])

d.code("Regel 3 in SQL: zusammengesetzter Schlüssel", [
    "CREATE TABLE Belegung (",
    "  SNr  INTEGER NOT NULL REFERENCES Schueler(SNr),",
    "  KNr  INTEGER NOT NULL REFERENCES Kurs(KNr),",
    "  PRIMARY KEY (SNr, KNr)         -- das Paar ist der Schlüssel",
    ");",
    "",
    "-- Beziehungsattribute wandern mit in die Beziehungstabelle:",
    "CREATE TABLE Praktikum (",
    "  SNr     INTEGER NOT NULL REFERENCES Schueler(SNr),",
    "  BNr     INTEGER NOT NULL REFERENCES Betrieb(BNr),",
    "  Beginn  TEXT NOT NULL,",
    "  Ende    TEXT,",
    "  PRIMARY KEY (SNr, BNr, Beginn) -- derselbe Betrieb zweimal? dann gehört Beginn dazu",
    ");",
])

schema = schema_diagram(P("schema-praktikum.png"), [
    ("SCHÜLER", [("SNr", "PK"), ("Name", ""), ("Klasse", "")], ORA),
    ("PRAKTIKUM", [("SNr", "FK"), ("BNr", "FK"), ("Beginn", ""), ("Ende", "")], RD),
    ("BETRIEB", [("BNr", "PK"), ("Name", ""), ("Ort", ""), ("Branche", "")], GRN),
], Hd=440, caption="aus zwei Entitätstypen und einer n:m-Beziehung mit Attributen werden drei Tabellen")
d.picture("Das Praktikums-Modell nach der Überführung", schema, [
    ("Regel 1 zweimal: **Schüler**, **Betrieb**", 0),
    ("Regel 3 einmal: **absolviert** → Tabelle **Praktikum** mit Beginn und Ende", 0),
    ("Probe: Betrieb „Müller GmbH, Dresden, Handwerk“ steht **genau einmal** — egal wie viele Praktika", 0),
], width=700)

# ---------------------------------------------------------------- Fallen
d.two_cols("Fallen bei der Überführung", [
    ("Typische Fehler", 0),
    ("Fremdschlüssel auf der **1-Seite**: „Kurse: 3, 4, 5“ in einer Zelle", 1),
    ("n:m als **zwei** Fremdschlüssel statt eigener Tabelle", 1),
    ("Schlüssel **vergessen** — Tabelle ohne PRIMARY KEY", 1),
    ("Tabellen in **falscher Reihenfolge** angelegt", 1),
], [
    ("So geht es richtig", 0),
    ("Fremdschlüssel steht dort, wo **ein** Wert reicht", 1),
    ("Jede n:m-Raute wird **eine** Tabelle", 1),
    ("Jede Tabelle hat **einen** Primärschlüssel — notfalls zusammengesetzt", 1),
    ("Erst Tabellen **ohne**, dann **mit** Fremdschlüsseln — und PRAGMA an", 1),
])

d.merksatz("Entität wird Tabelle, 1:n wird Fremdschlüssel, n:m wird eigene Tabelle.")

d.bullets("Eure Aufgabe: euer ER-Modell wird Datenbank", [
    ("Nehmt euer **Modell von letzter Woche** — Praktikum, Verein, Nebenjob …", 0),
    ("Wendet die **drei Regeln** an: schreibt zuerst alle Tabellen mit Spalten auf Papier, markiert PK und FK", 0),
    ("Legt die Tabellen in **SQLite** an — richtige Reihenfolge, PRAGMA foreign_keys = ON", 0),
    ("**Drei Datensätze** je Tabelle, dann eine **JOIN-Abfrage** über zwei Tabellen", 0),
    ("Provoziert einen **Fremdschlüssel-Fehler** und erklärt, welche Regel gegriffen hat", 0),
])

d.save()
