#!/usr/bin/env python3
"""Anforderungen an Datenbanken - Redundanz, Konsistenz, Integritaet (FOS 12, Woche 3).

The first deck of the series, originally written straight against python-pptx.
Ported to slides.Deck on 09.09.2026 so that the one script feeds both outputs -
the .pptx and, through html_deck.py, the web deck. Content unchanged, slide for
slide. Tables are native PowerPoint tables (tables.py), the schema picture is
drawn with Pillow.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from design_lib import ORANGE, GREEN, RED, CODE_INK, CODE_MUTED, BODY_Y
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN
from diagrams import box, centered, arrow, font, hexrgb, NAVY, MUTED as MUTED_RGB, WHITE
from PIL import Image, ImageDraw

d = Deck("datenbanken-anforderungen.pptx")          # Auftaktfolie als Folie 0
ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)

# ------------------------------------------------------------ the bad table --
HEAD = ["SNr", "Name", "Klasse", "Kurs", "Lehrkraft", "Raum", "Durchwahl"]
KURSLISTE = [HEAD,
             ["1001", "Lena Krause", "FO12a", "Informatik", "Alvers", "204", "31"],
             ["1001", "Lena Krause", "FO12a", "Physik", "Schulze", "305", "42"],
             ["1002", "Tim Vogel", "FO12a", "Informatik", "Alvers", "204", "31"],
             ["1002", "Tim Vogel", "FO12a", "Physik", "Schulze", "305", "42"],
             ["1003", "Mia Hahn", "FO12b", "Informatik", "Alvers", "204", "31"],
             ["1004", "Ben Roth", "FO12b", "Mathematik", "Berger", "118", "27"]]
KURS_W = [70, 170, 80, 160, 146, 80, 110]          # = 816 = CONTENT_W
KURS_ALIGN = ["r", "l", "l", "l", "l", "r", "r"]

# ------------------------------------------------------------ 1 Titel --------
d.title("Informatik — FOS 12", "Anforderungen an Datenbanken",
        "Redundanz, Konsistenz, Integrität — was eine einzige Tabelle alles falsch machen kann")

# ------------------------------------------------------------ 2 Kapitel 01 ---
d.chapter(1, "Eine „schlechte“ Tabelle",
          "Die Kursliste der FO 12 — alles in einer Liste. Was kann da schiefgehen?")

# ------------------------------------------------------------ 3 Kursliste ----
L3 = [("**Aufgabe**: Findet mindestens drei Stellen, an denen dieselbe Information mehrfach steht.", 0)]
d.table_top("Alles in einer Tabelle: die Kursliste", KURSLISTE, KURS_W, L3,
            font_size=13, row_h=26, bold_cols=(1,), align=KURS_ALIGN)

# ------------------------------------------------------------ 4 Redundanz ----
L4 = [("**Redundanz** = dieselbe Information steht an mehreren Stellen", 0),
      ("Name und Klasse: pro Kurs **noch einmal** abgetippt", 0),
      ("Alvers, 204, 31: **dreimal** gespeichert — für **eine** Lehrkraft", 0),
      ("Kostet Speicher, vor allem aber: jede Änderung muss **überall** nachgezogen werden", 0)]
marks = {}
for r in (1, 2, 3, 4):                       # doubled pupils
    marks[(r, 1)] = TINT_ORANGE
    marks[(r, 2)] = TINT_ORANGE
for r in (1, 3, 5):                          # tripled teacher block
    for c in (4, 5, 6):
        marks[(r, c)] = TINT_GREEN
d.table_top("Redundanz: dieselbe Information mehrfach", KURSLISTE, KURS_W, L4,
            marks=marks, font_size=12, row_h=22, bold_cols=(1,), align=KURS_ALIGN)

# ------------------------------------------------------------ 5 Kapitel 02 ---
d.chapter(2, "Anomalien", "Drei Arten, wie eine redundante Tabelle kaputtgeht")

# ------------------------------------------------------------ 6 Update -------
L6 = [("Informatik zieht um in **Raum 210**", 0),
      ("Drei Zeilen ändern — **eine wird vergessen**", 0),
      ("Jetzt hat ein Kurs **zwei Räume**: die Tabelle widerspricht sich", 0),
      ("Fachwort: **Änderungsanomalie** (Update-Anomalie)", 0)]
T6 = [["Name", "Kurs", "Lehrkraft", "Raum"],
      ["Lena Krause", "Informatik", "Alvers", "210"],
      ["Tim Vogel", "Informatik", "Alvers", "210"],
      ["Mia Hahn", "Informatik", "Alvers", "204"]]
d.table_bullets("Änderungsanomalie: eine Änderung, viele Zeilen", L6, T6, [112, 100, 88, 60],
                marks={(1, 3): TINT_GREEN, (2, 3): TINT_GREEN, (3, 3): TINT_RED},
                font_size=11, align=["l", "l", "l", "r"])

# ------------------------------------------------------------ 7 Insert -------
L7 = [("Neue Lehrkraft **Frau Lang** kommt — hat noch **keinen Kurs**", 0),
      ("Eine Zeile braucht Schüler **und** Kurs: ohne beides **keine Zeile**", 0),
      ("Ausweg „leere Felder“ (NULL) erzeugt **Datenmüll**", 0),
      ("Fachwort: **Einfügeanomalie** (Insert-Anomalie)", 0)]
T7 = [["SNr", "Name", "Kurs", "Lehrkraft", "Raum"],
      ["1003", "Mia Hahn", "Informatik", "Alvers", "204"],
      ["1004", "Ben Roth", "Mathematik", "Berger", "118"],
      ["NULL", "NULL", "NULL", "Lang", "112"]]
d.table_bullets("Einfügeanomalie: kein Platz für Neues", L7, T7, [52, 100, 92, 78, 52],
                marks={(3, 0): TINT_RED, (3, 1): TINT_RED, (3, 2): TINT_RED},
                font_size=11, align=["r", "l", "l", "l", "r"])

# ------------------------------------------------------------ 8 Delete -------
L8 = [("**Ben Roth** verlässt die Schule — seine Zeile wird gelöscht", 0),
      ("Er war der **Einzige** im Mathematik-Kurs", 0),
      ("Mit ihm verschwinden **Kurs, Lehrkraft, Raum und Durchwahl**", 0),
      ("Fachwort: **Löschanomalie** (Delete-Anomalie)", 0)]
T8 = [["Name", "Kurs", "Lehrkraft", "Raum", "Durchwahl"],
      ["Mia Hahn", "Informatik", "Alvers", "204", "31"],
      ["Tim Vogel", "Physik", "Schulze", "305", "42"],
      ["Ben Roth", "Mathematik", "Berger", "118", "27"]]
d.table_bullets("Löschanomalie: mit dem Schüler geht der Kurs", L8, T8, [96, 92, 78, 50, 72],
                marks={3: TINT_RED}, font_size=11, align=["l", "l", "l", "r", "r"])

# ------------------------------------------------------------ 9 Merksatz -----
d.merksatz("Redundanz ist der Nährboden für Anomalien. "
           "Jede Information gehört genau einmal in die Datenbank.")

# ------------------------------------------------------------ 10 Kapitel 03 --
d.chapter(3, "Konsistenz und Integrität",
          "Widerspruchsfrei bleiben — mit Regeln, die das DBMS selbst überwacht")

# ------------------------------------------------------------ 11 Konsistenz --
LL = [("Konsistent", 0),
      ("Jede Frage hat **genau eine** Antwort", 1),
      ("„Wo ist Informatik?“ → **204**", 1),
      ("Alle Zeilen erzählen **dieselbe** Geschichte", 1),
      ("Zustand nach **jeder** Änderung erhalten", 1)]
LR = [("Inkonsistent", 0),
      ("Zeile 1 sagt **210**, Zeile 5 sagt **204**", 1),
      ("Welche stimmt? **Niemand** weiß es", 1),
      ("Der Fehler fällt erst auf, wenn jemand **vor der falschen Tür** steht", 1),
      ("Typische Folge von **Redundanz**", 1)]
d.two_cols("Konsistenz: die Datenbank widerspricht sich nicht", LL, LR)

# ------------------------------------------------------------ 12 Integritaet -
L12 = [("**Konsistenz** ist ein **Zustand** — **Integrität** sind die **Regeln**, die ihn sichern", 0),
       ("Das **DBMS** prüft die Regeln bei jedem Einfügen, Ändern, Löschen", 0),
       ("Verstoß → die Operation wird **abgelehnt**, nicht „irgendwie gespeichert“", 0),
       ("Vier Regelarten: **Entität**, **Referenz**, **Wertebereich**, **Semantik**", 0)]
d.bullets("Integrität: Regeln, die Konsistenz erzwingen", L12)

# ------------------------------------------------------------ 13 Fall 1 ------
L13 = [("Zwei **Max Meier** im Jahrgang — wer bekommt die Note?", 0),
       ("**Primärschlüssel**: jeder Datensatz hat einen **eindeutigen** Wert (SNr)", 0),
       ("Der Schlüssel darf **nie leer** (NULL) sein", 0),
       ("Regel: **Entitätsintegrität**", 0)]
T13 = [["SNr", "Name", "Klasse"],
       ["1007", "Max Meier", "FO12a"],
       ["1012", "Max Meier", "FO12b"],
       ["NULL", "Sara Kern", "FO12a"]]
d.table_bullets("Fall 1: Zwei Max Meier", L13, T13, [60, 110, 70],
                marks={(1, 1): TINT_ORANGE, (2, 1): TINT_ORANGE, (3, 0): TINT_RED},
                font_size=11, bold_cols=(0,), align=["r", "l", "l"])

# ------------------------------------------------------------ 14 Fall 2 ------
L14 = [("Kurs Chemie verweist auf Lehrkraft **Nr. 9** — die gibt es nicht", 0),
       ("**Fremdschlüssel** muss auf einen **vorhandenen** Datensatz zeigen", 0),
       ("Lehrkraft löschen? Nur wenn **kein Kurs** mehr auf sie zeigt — oder Kurse **mitlöschen**", 0),
       ("Regel: **referentielle Integrität**", 0)]
T14 = [["KNr", "Fach", "LNr"],
       ["3", "Informatik", "1"],
       ["4", "Physik", "2"],
       ["5", "Chemie", "9"]]
T14b = [["LNr", "Name", "Durchwahl"],
        ["1", "Alvers", "31"],
        ["2", "Schulze", "42"],
        ["3", "Berger", "27"]]
# the Lehrkraft table sits under the Kurs table: LNr 9 points at nothing
d.table_bullets("Fall 2: Der Kurs ohne Lehrkraft", L14, T14, [50, 110, 50],
                marks={(3, 2): TINT_RED}, font_size=11, bold_cols=(0,), align=["r", "l", "r"],
                more=[dict(rows=T14b, col_w=[50, 90, 76], y=BODY_Y + 4 + 4 * 21 + 30,
                           font_size=11, bold_cols=(0,), align=["r", "l", "r"],
                           name="Lehrkraft")])

# ------------------------------------------------------------ 15 Fall 3 ------
L15 = [("Jedes Feld hat einen **Datentyp** und einen **Wertebereich**", 0),
       ("Note 7, 31. Februar, Klasse 12x: das DBMS lehnt **ab**", 0),
       ("Festgelegt beim Anlegen der Tabelle: **INTEGER**, **DATE**, **CHECK**", 0),
       ("Regel: **Wertebereichsintegrität** (Domäne)", 0)]
T15 = [["Feld", "Eingabe", "erlaubt"],
       ["Note", "7", "1 bis 6"],
       ["Geburtsdatum", "31.02.2009", "gültiges Datum"],
       ["Klasse", "FO12x", "FO12a, FO12b"],
       ["Durchwahl", "abc", "10 bis 99"]]
d.table_bullets("Fall 3: Note 7 und der 31. Februar", L15, T15, [104, 92, 130],
                marks={(1, 1): TINT_RED, (2, 1): TINT_RED, (3, 1): TINT_RED, (4, 1): TINT_RED},
                font_size=11, bold_cols=(0,), align=["l", "l", "l"])

# ------------------------------------------------------------ 16 Fall 4 ------
L16 = [("Manche Regeln stehen in **keinem** Datentyp", 0),
       ("Ein Kurs hat **höchstens 30** Teilnehmende", 0),
       ("Abmeldung nur **vor** Kursbeginn", 0),
       ("Eine Lehrkraft ist nicht in **zwei Räumen** zur selben Zeit", 0),
       ("Regel: **semantische Integrität** — Fachregeln, im DBMS als CHECK oder Trigger", 0)]
d.bullets("Fall 4: Regeln aus der Wirklichkeit", L16)

# ------------------------------------------------------------ 17 Fun Facts ---
L17 = [("**Christopher Null**, Journalist: Web-Formulare halten seinen Nachnamen für **„leer“**", 0),
       ("**Jahr-2000-Problem**: Jahreszahlen mit **zwei Ziffern** — ein Wertebereichsfehler für Milliarden", 0),
       ("Dresdens **01067**: wer die PLZ als Zahl speichert, verliert die **Null**", 0),
       ("**Bobby Tables** (xkcd): Eingaben, die selbst SQL sind — Regeln prüfen ist auch **Schutz**", 0)]
d.bullets("Fun Facts: wenn Regeln fehlen", L17)

# ------------------------------------------------------------ 18 Code --------
CODE = [
    [("-- Regeln, die das DBMS selbst überwacht", CODE_MUTED)],
    [("CREATE TABLE", ORANGE), (" Lehrkraft (", CODE_INK)],
    [("  LNr        INTEGER ", CODE_INK), ("PRIMARY KEY", GREEN), (",", CODE_INK), ("               -- Entitätsintegrität", CODE_MUTED)],
    [("  Name       TEXT    ", CODE_INK), ("NOT NULL", GREEN), (",", CODE_INK)],
    [("  Durchwahl  INTEGER ", CODE_INK), ("CHECK", GREEN), (" (Durchwahl ", CODE_INK), ("BETWEEN", ORANGE), (" 10 ", CODE_INK), ("AND", ORANGE), (" 99)", CODE_INK), ("  -- Wertebereich", CODE_MUTED)],
    [(");", CODE_INK)],
    [("CREATE TABLE", ORANGE), (" Kurs (", CODE_INK)],
    [("  KNr   INTEGER ", CODE_INK), ("PRIMARY KEY", GREEN), (",", CODE_INK)],
    [("  Fach  TEXT    ", CODE_INK), ("NOT NULL", GREEN), (",", CODE_INK)],
    [("  Raum  TEXT    ", CODE_INK), ("CHECK", GREEN), (" (Raum ", CODE_INK), ("IN", ORANGE), (" ('118', '204', '210', '305')),", CODE_INK)],
    [("  LNr   INTEGER ", CODE_INK), ("NOT NULL REFERENCES", GREEN), (" Lehrkraft(LNr)", CODE_INK), ("   -- referentielle Integrität", CODE_MUTED)],
    [(");", CODE_INK)],
]
d.code("Regeln im CREATE TABLE: das DBMS passt auf", CODE)


# ------------------------------------------------------------ 19 Ausblick ----
def schema_diagram(path, Wd=1600, Hd=420):
    """Four linked tables - a preview of what the split-up Kursliste looks like."""
    img = Image.new("RGBA", (Wd, Hd), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head = font("Orbitron-Bold.ttf", 28)
    f_txt = font("Raleway-Medium.ttf", 26)
    f_tag = font("Orbitron-Bold.ttf", 18)
    f_small = font("Raleway-Regular.ttf", 24)
    bw, bh, y = 300, 300, 30
    tables = [("SCHÜLER", [("SNr", "PK"), ("Name", ""), ("Klasse", "")], ORA),
              ("BELEGUNG", [("SNr", "FK"), ("KNr", "FK")], RD),
              ("KURS", [("KNr", "PK"), ("Fach", ""), ("Raum", ""), ("LNr", "FK")], GRN),
              ("LEHRKRAFT", [("LNr", "PK"), ("Name", ""), ("Durchwahl", "")], NAVY)]
    gap = (Wd - 80 - 4 * bw) / 3
    xs = [40 + i * (bw + gap) for i in range(4)]
    for x, (head, attrs, col) in zip(xs, tables):
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + bw, y + 64), radius=18, fill=col)
        d.rectangle((x, y + 40, x + bw, y + 64), fill=col)
        centered(d, head, x + bw / 2, y + 32, f_head, WHITE)
        for i, (name, tag) in enumerate(attrs):
            yy = y + 100 + i * 52
            d.text((x + 28, yy - 16), name, font=f_txt, fill=NAVY)
            if tag:
                tc = ORA if tag == "PK" else RD
                d.rounded_rectangle((x + bw - 84, yy - 16, x + bw - 24, yy + 16), radius=8, fill=tc)
                centered(d, tag, x + bw - 54, yy, f_tag, WHITE)
    a = 22
    for i in range(3):
        arrow(d, (xs[i] + bw + a, y + bh / 2), (xs[i + 1] - a, y + bh / 2), MUTED_RGB, 4)
    centered(d, "PK = Primärschlüssel   ·   FK = Fremdschlüssel   ·   jede Information genau einmal",
             Wd / 2, Hd - 40, f_small, MUTED_RGB)
    img.save(path)
    return path


L19 = [("Jede Tabelle beschreibt **eine** Sache: Schüler, Kurs, Lehrkraft", 0),
       ("Zusammenhang über **Schlüssel** statt über abgetippte Namen", 0),
       ("Wie man sauber aufteilt: **Normalformen** — in ein paar Wochen", 0)]
d.picture("Ausblick: die Tabelle aufteilen", schema_diagram(os.path.join(IMG, "schema.png")), L19)

# ------------------------------------------------------------ 20 Merksatz ----
d.merksatz("Konsistenz ist der Zustand. Integritätsregeln sind die Wächter. "
           "Redundanz ist der Feind von beiden.")

# ------------------------------------------------------------ 21 Aufgabe -----
L21 = [("Tabelle **Bestellungen** einer Pizzeria: Kunde, Adresse, Pizza, Preis, Fahrer, Fahrer-Handy", 0),
       ("Findet **drei Redundanzen**", 0),
       ("Erfindet je **eine** Einfüge-, Änderungs- und Löschanomalie", 0),
       ("Formuliert **drei Integritätsregeln** — und nennt die Regelart", 0),
       ("Bonus: Wie würdet ihr die Tabelle **aufteilen**?", 0)]
d.bullets("Eure Aufgabe: die Pizzeria-Tabelle", L21)

d.save()
