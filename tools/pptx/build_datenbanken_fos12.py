#!/usr/bin/env python3
"""Anforderungen an Datenbanken - Redundanz, Konsistenz, Integritaet (FOS 12, Woche 3).

Built on the Informatik design template like build_webstuhl.py. Tables are native
PowerPoint tables (tables.py), the schema picture is drawn with Pillow.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import (ORANGE, GREEN, RED, INK, BODY, MUTED, CODE_INK, CODE_MUTED,
                        FONT_M, MARGIN, BODY_Y, BODY_H, CONTENT_W, W, emu)
from slides import add_greeting
from deck_util import fill_ph, drop_ph, add_click_build, save_deck
from tables import add_table, check_fit, TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from diagrams import box, centered, arrow, font, hexrgb, NAVY, MUTED as MUTED_RGB, WHITE
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
os.makedirs(IMG, exist_ok=True)
prs = Presentation(os.path.join(HERE, "out", "informatik-vorlage.pptx"))
LAY = {l.name: l for l in prs.slide_layouts}
add = lambda name: prs.slides.add_slide(LAY[name])

add_greeting(prs, LAY, "datenbanken-anforderungen.pptx")   # Auftaktfolie als Folie 0
ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)


def content(layout, title, lines, kicker=None):
    s = add(layout)
    if title:
        s.shapes.title.text_frame.text = title
    if kicker:
        fill_ph(s, 10, [(kicker, 0)])
    body = fill_ph(s, 1, lines) if lines else None
    return s, body


def place(ph, x, y, w, h):
    """Move a placeholder - all four values at once, else the rest falls to 0."""
    ph.left, ph.top, ph.width, ph.height = emu(x), emu(y), emu(w), emu(h)


def table_slide(title, lines, rows, col_w, marks=None, font_size=12, bold_cols=(),
                mono_cols=(), align=None):
    """Bullets on the left (404 pt), a native table on the right, one click per bullet."""
    s, body = content("Inhalt", title, lines)
    place(body, MARGIN, BODY_Y, 404, BODY_H)
    tw = sum(col_w)
    bad = check_fit(rows, col_w, font_size, bold_cols, mono_cols)
    assert not bad, (title, bad)
    add_table(s, rows, W - MARGIN - tw, BODY_Y + 4, col_w, font_size=font_size,
              marks=marks, bold_cols=bold_cols, mono_cols=mono_cols, align=align)
    add_click_build(s, [(body, lines)])
    return s


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
s = add("Titel")
fill_ph(s, 10, [("Informatik — FOS 12", 0)])
fill_ph(s, 0, [("Anforderungen an Datenbanken", 0)])
fill_ph(s, 1, [("Redundanz, Konsistenz, Integrität — was eine einzige Tabelle alles falsch machen kann", 0)])

# ------------------------------------------------------------ 2 Kapitel 01 ---
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 01", 0)])
s.shapes.title.text_frame.text = "Eine „schlechte“ Tabelle"
fill_ph(s, 1, [("Die Kursliste der FO 12 — alles in einer Liste. Was kann da schiefgehen?", 0)])

# ------------------------------------------------------------ 3 Kursliste ----
L3 = [("**Aufgabe**: Findet mindestens drei Stellen, an denen dieselbe Information mehrfach steht.", 0)]
s, body = content("Inhalt", "Alles in einer Tabelle: die Kursliste", L3)
assert not check_fit(KURSLISTE, KURS_W, 13, bold_cols=(1,)), check_fit(KURSLISTE, KURS_W, 13, bold_cols=(1,))
add_table(s, KURSLISTE, MARGIN, BODY_Y, KURS_W, font_size=13, row_h=26, bold_cols=(1,), align=KURS_ALIGN)
place(body, MARGIN, BODY_Y + 7 * 26 + 24, CONTENT_W, 80)
add_click_build(s, [(body, L3)])

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
s, body = content("Inhalt", "Redundanz: dieselbe Information mehrfach", L4)
add_table(s, KURSLISTE, MARGIN, BODY_Y, KURS_W, font_size=12, row_h=22, bold_cols=(1,),
          marks=marks, align=KURS_ALIGN)
place(body, MARGIN, BODY_Y + 7 * 22 + 14, CONTENT_W, 170)
add_click_build(s, [(body, L4)])

# ------------------------------------------------------------ 5 Kapitel 02 ---
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 02", 0)])
s.shapes.title.text_frame.text = "Anomalien"
fill_ph(s, 1, [("Drei Arten, wie eine redundante Tabelle kaputtgeht", 0)])

# ------------------------------------------------------------ 6 Update -------
L6 = [("Informatik zieht um in **Raum 210**", 0),
      ("Drei Zeilen ändern — **eine wird vergessen**", 0),
      ("Jetzt hat ein Kurs **zwei Räume**: die Tabelle widerspricht sich", 0),
      ("Fachwort: **Änderungsanomalie** (Update-Anomalie)", 0)]
T6 = [["Name", "Kurs", "Lehrkraft", "Raum"],
      ["Lena Krause", "Informatik", "Alvers", "210"],
      ["Tim Vogel", "Informatik", "Alvers", "210"],
      ["Mia Hahn", "Informatik", "Alvers", "204"]]
table_slide("Änderungsanomalie: eine Änderung, viele Zeilen", L6, T6, [112, 100, 88, 60],
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
table_slide("Einfügeanomalie: kein Platz für Neues", L7, T7, [52, 100, 92, 78, 52],
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
table_slide("Löschanomalie: mit dem Schüler geht der Kurs", L8, T8, [96, 92, 78, 50, 72],
            marks={3: TINT_RED}, font_size=11, align=["l", "l", "l", "r", "r"])

# ------------------------------------------------------------ 9 Merksatz -----
s = add("Merksatz")
fill_ph(s, 1, [("Redundanz ist der Nährboden für Anomalien. Jede Information gehört genau einmal in die Datenbank.", 0)])
fill_ph(s, 2, [("Merksatz", 0)])

# ------------------------------------------------------------ 10 Kapitel 03 --
s = add("Kapitel")
fill_ph(s, 10, [("Kapitel 03", 0)])
s.shapes.title.text_frame.text = "Konsistenz und Integrität"
fill_ph(s, 1, [("Widerspruchsfrei bleiben — mit Regeln, die das DBMS selbst überwacht", 0)])

# ------------------------------------------------------------ 11 Konsistenz --
s = add("Zwei Spalten")
s.shapes.title.text_frame.text = "Konsistenz: die Datenbank widerspricht sich nicht"
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
left = fill_ph(s, 1, LL)
right = fill_ph(s, 2, LR)
add_click_build(s, [(left, LL), (right, LR)])

# ------------------------------------------------------------ 12 Integritaet -
L12 = [("**Konsistenz** ist ein **Zustand** — **Integrität** sind die **Regeln**, die ihn sichern", 0),
       ("Das **DBMS** prüft die Regeln bei jedem Einfügen, Ändern, Löschen", 0),
       ("Verstoß → die Operation wird **abgelehnt**, nicht „irgendwie gespeichert“", 0),
       ("Vier Regelarten: **Entität**, **Referenz**, **Wertebereich**, **Semantik**", 0)]
s, body = content("Inhalt", "Integrität: Regeln, die Konsistenz erzwingen", L12)
add_click_build(s, [(body, L12)])

# ------------------------------------------------------------ 13 Fall 1 ------
L13 = [("Zwei **Max Meier** im Jahrgang — wer bekommt die Note?", 0),
       ("**Primärschlüssel**: jeder Datensatz hat einen **eindeutigen** Wert (SNr)", 0),
       ("Der Schlüssel darf **nie leer** (NULL) sein", 0),
       ("Regel: **Entitätsintegrität**", 0)]
T13 = [["SNr", "Name", "Klasse"],
       ["1007", "Max Meier", "FO12a"],
       ["1012", "Max Meier", "FO12b"],
       ["NULL", "Sara Kern", "FO12a"]]
table_slide("Fall 1: Zwei Max Meier", L13, T13, [60, 110, 70],
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
s = table_slide("Fall 2: Der Kurs ohne Lehrkraft", L14, T14, [50, 110, 50],
                marks={(3, 2): TINT_RED}, font_size=11, bold_cols=(0,), align=["r", "l", "r"])
T14b = [["LNr", "Name", "Durchwahl"],
        ["1", "Alvers", "31"],
        ["2", "Schulze", "42"],
        ["3", "Berger", "27"]]
assert not check_fit(T14b, [50, 90, 76], 11, bold_cols=(0,))
add_table(s, T14b, W - MARGIN - 216, BODY_Y + 4 + 4 * 21 + 30, [50, 90, 76], font_size=11,
          bold_cols=(0,), align=["r", "l", "r"], name="Lehrkraft")

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
table_slide("Fall 3: Note 7 und der 31. Februar", L15, T15, [104, 92, 130],
            marks={(1, 1): TINT_RED, (2, 1): TINT_RED, (3, 1): TINT_RED, (4, 1): TINT_RED},
            font_size=11, bold_cols=(0,), align=["l", "l", "l"])

# ------------------------------------------------------------ 16 Fall 4 ------
L16 = [("Manche Regeln stehen in **keinem** Datentyp", 0),
       ("Ein Kurs hat **höchstens 30** Teilnehmende", 0),
       ("Abmeldung nur **vor** Kursbeginn", 0),
       ("Eine Lehrkraft ist nicht in **zwei Räumen** zur selben Zeit", 0),
       ("Regel: **semantische Integrität** — Fachregeln, im DBMS als CHECK oder Trigger", 0)]
s, body = content("Inhalt", "Fall 4: Regeln aus der Wirklichkeit", L16)
add_click_build(s, [(body, L16)])

# ------------------------------------------------------------ 17 Fun Facts ---
L17 = [("**Christopher Null**, Journalist: Web-Formulare halten seinen Nachnamen für **„leer“**", 0),
       ("**Jahr-2000-Problem**: Jahreszahlen mit **zwei Ziffern** — ein Wertebereichsfehler für Milliarden", 0),
       ("Dresdens **01067**: wer die PLZ als Zahl speichert, verliert die **Null**", 0),
       ("**Bobby Tables** (xkcd): Eingaben, die selbst SQL sind — Regeln prüfen ist auch **Schutz**", 0)]
s, body = content("Inhalt", "Fun Facts: wenn Regeln fehlen", L17)
add_click_build(s, [(body, L17)])

# ------------------------------------------------------------ 18 Code --------
s = add("Code")
s.shapes.title.text_frame.text = "Regeln im CREATE TABLE: das DBMS passt auf"
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
tf = s.placeholders[1].text_frame
tf.word_wrap = False
for i, parts in enumerate(CODE):
    p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
    for text, color in parts:
        r = p.add_run()
        r.text = text
        r.font.name = FONT_M
        r.font.size = Pt(13)
        r.font.color.rgb = RGBColor.from_string(color)


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
s, body = content("Inhalt", "Ausblick: die Tabelle aufteilen", L19)
schema = schema_diagram(os.path.join(IMG, "schema.png"))
iw, ih = Image.open(schema).size
pw = 816.0
ph_ = pw * ih / iw
s.shapes.add_picture(schema, emu(MARGIN), emu(BODY_Y), emu(pw), emu(ph_))
place(body, MARGIN, BODY_Y + ph_ + 6, CONTENT_W, 504 - (BODY_Y + ph_ + 6) - 8)
add_click_build(s, [(body, L19)])

# ------------------------------------------------------------ 20 Merksatz ----
s = add("Merksatz")
fill_ph(s, 1, [("Konsistenz ist der Zustand. Integritätsregeln sind die Wächter. Redundanz ist der Feind von beiden.", 0)])
fill_ph(s, 2, [("Merksatz", 0)])

# ------------------------------------------------------------ 21 Aufgabe -----
L21 = [("Tabelle **Bestellungen** einer Pizzeria: Kunde, Adresse, Pizza, Preis, Fahrer, Fahrer-Handy", 0),
       ("Findet **drei Redundanzen**", 0),
       ("Erfindet je **eine** Einfüge-, Änderungs- und Löschanomalie", 0),
       ("Formuliert **drei Integritätsregeln** — und nennt die Regelart", 0),
       ("Bonus: Wie würdet ihr die Tabelle **aufteilen**?", 0)]
s, body = content("Inhalt", "Eure Aufgabe: die Pizzeria-Tabelle", L21)
add_click_build(s, [(body, L21)])

out = os.path.join(HERE, "out", "datenbanken-anforderungen.pptx")
save_deck(prs, out)
print("deck:", out, len(prs.slides._sldIdLst), "Folien")
