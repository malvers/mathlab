#!/usr/bin/env python3
"""Das Wuerfelspiel - Mathe 11 (BGY), KW 38: tree diagram and path rules, explained very slowly.

Doc, 15.09.2026: a test task on exactly this went badly (8 % / 3 %). The test itself must never
be public (feedback_school_material_never_in_repo), so this deck uses a self-invented task of
the same kind - own names, own numbers, own wording; its answer differs from the test (5/9).

HTML only: the figures are SVG (drawn here with tools/aufgaben/svgfig.py into
HTML/decks/img/wuerfelspiel-*.svg), which the .pptx backend cannot place.

    python3 tools/pptx/html_deck.py build_wuerfelspiel_mathe11.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "aufgaben"))
from slides import Deck
from tables import TINT_GREEN, TINT_ORANGE, TINT_BLUE, TINT_RED   # same tints as the die nets
import svgfig as S

IMG = os.path.normpath(os.path.join(HERE, "..", "..", "HTML", "decks", "img"))
# TINT_* are bare hex for the .pptx tables ("FBEBBF") - SVG needs the "#", or it paints black
LIGHT = {k: "#" + v for k, v in
         {"orange": TINT_ORANGE, "green": TINT_GREEN, "blue": TINT_BLUE, "red": TINT_RED}.items()}
LENA = {"top": [3, 5, 3], "col": [7, 5, 7], "fill": {3: LIGHT["orange"], 5: LIGHT["green"], 7: LIGHT["blue"]}}
MIA = {"top": [4, 6, 4], "col": [4, 6, 4], "fill": {4: LIGHT["blue"], 6: LIGHT["red"]}}
# the root node has a name and every path starts there (Doc, 17.09.2026: "Weg (* -> 3 -> 4), den Root-Knoten
# könnten wir benennen") - one name for the trees, the slides and the summaries
ROOT = "Start"


def weg(*stops, bold=False):
    """A path from the root as LaTeX: weg(3, 4) -> $(\\text{Start} \\to 3 \\to 4)$."""
    inner = " \\to ".join(["\\text%s{%s}" % ("bf" if bold else "", ROOT)] + [str(x) for x in stops])
    return "$\\mathbf{(%s)}$" % inner if bold else "$(%s)$" % inner


def weg_pfeile(a, b, pa, pb):
    """The path with each branch probability on its arrow, like the branches in the tree (Doc, 17.09.2026:
    "über Start -> 3 eine Klammer mit 1/3" - braces looked "bissl grob", labelled arrows are finer).
    pa, pb: (numerator, denominator); the fractions stay full size, muted like the tree labels."""
    fa, fb = ("\\;\\textstyle\\color{%s}\\frac{%d}{%d}\\;" % ((S.MUTED,) + f) for f in (pa, pb))
    return "$(\\text{%s} \\xrightarrow{%s} %d \\xrightarrow{%s} %d)$" % (ROOT, fa, a, fb, b)


def weg_txt(*stops):
    """The same path as plain text for the summaries: (Start→3→4)."""
    return "(" + "→".join([ROOT] + [str(x) for x in stops]) + ")"


# ------------------------------------------------------------------ figures ---
def net(c, x0, y0, die, title):
    """A T-shaped die net: three faces on top, three below the middle one."""
    s = 54
    cells = [(x0 + i * s, y0, v) for i, v in enumerate(die["top"])]
    cells += [(x0 + s, y0 + (j + 1) * s, v) for j, v in enumerate(die["col"])]
    c.text(x0 + 1.5 * s, y0 - 14, title, 15, S.INK)
    for x, y, v in cells:
        c.rect(x, y, s, s, fill=die["fill"][v], stroke=S.INK, width=1.3)
        c.text(x + s / 2, y + s / 2, str(v), 22, S.INK, baseline="middle", tex=True)


def die3d(die, x, y, w=160, h=180):
    """A real 3D die (HTML/wuerfel3d.html) laid over the slide next to its net - same numbers in
    the same net order, same pastel per number. Tap rolls, drag turns (Doc, 16.09.2026)."""
    faces = list(die["top"]) + list(die["col"])            # top0 top1 top2, then the column
    colors = ",".join("%d:%s" % (v, die["fill"][v].lstrip("#")) for v in sorted(die["fill"]))
    return dict(src="wuerfel3d.html?flaechen=%s&farben=%s&stil=hell" % (",".join(map(str, faces)), colors),
                x=x, y=y, w=w, h=h, title="Würfel in 3D: antippen würfelt, ziehen dreht")


def write(name, canvas):
    with open(os.path.join(IMG, "wuerfelspiel-%s.svg" % name), "w", encoding="utf-8") as f:
        f.write(canvas.svg())
    return "img/wuerfelspiel-%s.svg" % name


both = S.Canvas(520, 290)
net(both, 20, 40, LENA, "Lenas Würfel")
net(both, 300, 40, MIA, "Mias Würfel")
FIG_NETZE = write("netze", both)
one = S.Canvas(200, 252)
net(one, 19, 34, LENA, "Lenas Würfel")
FIG_LENA = write("netz-lena", one)
one = S.Canvas(200, 252)
net(one, 19, 34, MIA, "Mias Würfel")
FIG_MIA = write("netz-mia", one)

def die_table(c, x, y, die, rows):
    """The table of slide 8, narrow: number | how often | probability, the number tinted like the die net.
    rows: (number, how often, num, den, short num, short den) - e.g. (3, 2, 2, 6, 1, 3)."""
    cw, hh, rh = (58, 146, 152), 34, 48
    xs = [x, x + cw[0], x + cw[0] + cw[1]]
    for i, head in enumerate(("Zahl", "wie oft drauf?", "Wahrscheinlichkeit")):
        c.rect(xs[i], y, cw[i], hh, fill=S.INK, stroke=S.INK, width=0.75)
        c.text(xs[i] + 9, y + hh / 2.0 + 4.5, head, 13, "#FFFFFF", anchor="start", weight=700)
    for r, (n, k, a, b, a2, b2) in enumerate(rows):
        ry, cy = y + hh + r * rh, y + hh + r * rh + rh / 2.0
        for i in range(3):
            c.rect(xs[i], ry, cw[i], rh, fill=die["fill"][n] if i == 0 else S.PAPER, stroke=S.INK, width=0.75)
        c.text(xs[0] + cw[0] / 2.0, cy + 18 * 0.32, str(n), 18, S.INK, weight=700, tex=True)
        c.text(xs[1] + 10, cy + 15 * 0.32, "$%d$-mal von $6$" % k, 15, S.BODY, anchor="start", tex=True)
        w = c.frac(xs[2] + 10, cy, a, b, 15, S.BODY, anchor="start")
        c.text(xs[2] + 10 + w + 12, cy + 15 * 0.32, "=", 15, S.BODY, tex=True)
        c.frac(xs[2] + 10 + w + 24, cy, a2, b2, 15, S.BODY, anchor="start")


# Slides 12 and 14 share one canvas: the tree on the left, the dice tables stacked on the right (Lena above,
# Mia below), the whole group centred on the slide (Doc, 16.09.2026: "tree + Table mittig x", "beide Tabellen
# ... übereinander"). Same canvas = the tree and Lena's table stay put when you turn from 12 to 14.
FIG_W, TAB_X = 924, 560
LENA_ROWS = [(3, 2, 2, 6, 1, 3), (5, 2, 2, 6, 1, 3), (7, 2, 2, 6, 1, 3)]
MIA_ROWS = [(4, 4, 4, 6, 2, 3), (6, 2, 2, 6, 1, 3)]


def dice_tables(c, mia=True):
    """Lena's table (and Mia's underneath) - the tables of slides 8 and 9, narrow."""
    c.text(TAB_X, 47, "Lenas Würfel", 15, S.INK, anchor="start")
    die_table(c, TAB_X, 55, LENA, LENA_ROWS)
    if mia:
        c.text(TAB_X, 271, "Mias Würfel", 15, S.INK, anchor="start")
        die_table(c, TAB_X, 279, MIA, MIA_ROWS)


# stage 1: where each 1/3 comes from stays in sight while the branches are drawn
# (Doc, 16.09.2026: "da steht ganz klar wie man auf die 1/3s kommt")
st = S.Diagram(FIG_W, 440)
root = (60, 220)
st.node(*root)
st.text(48, 225, ROOT, 15, S.INK, anchor="end")
st.text(250, 18, "1. Stufe: Lena", 15, S.INK)
for ya, n in [(90, "3"), (220, "5"), (350, "7")]:
    st.branch(root, (250, ya), "1/3", size=14, tex=True)
    st.node(250, ya, n, "above", size=18, tex=True)
dice_tables(st, mia=False)
FIG_STUFE1 = write("stufe1", st)

def full_tree(c):
    """The finished tree, left to right - on slide 14 beside the dice tables, small in the corner of 15."""
    root = (60, 220)
    c.node(*root)
    c.text(48, 225, ROOT, 15, S.INK, anchor="end")
    c.text(250, 18, "1. Stufe: Lena", 15, S.INK)
    c.text(462, 18, "2. Stufe: Mia", 15, S.INK)
    for ya, a in [(90, 3), (220, 5), (350, 7)]:
        c.branch(root, (250, ya), "1/3", size=14, tex=True)
        c.node(250, ya, str(a), "above", size=18, tex=True)
        for dy, b, pb in [(-42, 4, "2/3"), (42, 6, "1/3")]:
            win = a > b
            col = S.GREEN if win else S.MUTED
            c.branch((250, ya), (480, ya + dy), pb, color=col, width=2.4 if win else 1.3, size=14, tex=True)
            c.node(480, ya + dy, str(b), "right", color=col, size=17, tex=True)
    c.text(255, 432, "grün: Lena gewinnt", 14, S.GREEN)


# the full tree: both dice tables beside it; each path's probability is on slide 17 ("Jeder Ausgang einzeln")
t = S.Diagram(FIG_W, 440)
full_tree(t)
dice_tables(t)
FIG_BAUM = write("baum", t)
# the same tree alone, small bottom right on the path rule (Doc, 17.09.2026)
k = S.Diagram(520, 440)
full_tree(k)
FIG_BAUM_KLEIN = write("baum-klein", k)


def label_off(c, p, q, text, gap=22, size=14):
    """Branch probability beside a top-down branch, `gap` px off its middle along the normal that
    points outwards: up-left for a branch to the left, up-right to the right, right for a straight one."""
    (x1, y1), (x2, y2) = p, q
    d = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 or 1.0
    ux, uy = (x2 - x1) / d, (y2 - y1) / d
    nx, ny = (-uy, ux) if ux < 0 else (uy, -ux) if ux > 0 else (1.0, 0.0)
    c.texlabel((x1 + x2) / 2.0 + nx * gap, (y1 + y2) / 2.0 + ny * gap, text, size, S.BODY)


# the whole tree once more, flat and top-down, under the sum rule - the slide has ~190 px left
# under its four bullets (Doc, 17.09.2026: "unten den ganzen Baum")
fl = S.Diagram(816, 196)
top = (480, 26)
fl.node(*top)
fl.text(480, 14, ROOT, 14, S.INK)
fl.text(0, 40, "grün: Lena gewinnt", 14, S.GREEN, anchor="start")
fl.text(0, 102, "1. Stufe: Lena", 15, S.INK, anchor="start")
fl.text(0, 180, "2. Stufe: Mia", 15, S.INK, anchor="start")
for cx, a, side in [(260, 3, "left"), (480, 5, "right"), (700, 7, "right")]:
    mid = (cx, 96)
    fl.branch(top, mid)
    label_off(fl, top, mid, "1/3")
    fl.node(cx, 96, str(a), side, size=18, tex=True)
    for dx, b, pb in [(-50, 4, "2/3"), (50, 6, "1/3")]:
        win = a > b
        col = S.GREEN if win else S.MUTED
        leaf = (cx + dx, 164)
        fl.branch(mid, leaf, color=col, width=2.4 if win else 1.3)
        label_off(fl, mid, leaf, pb)
        fl.node(cx + dx, 164, str(b), "below", color=col, size=17, tex=True)
FIG_BAUM_FLACH = write("baum-flach", fl)

# a pupil's tree that starts with "Lena or Mia" (Doc, 17.09.2026: "eine Schülerin kam mit der Idee ... mach dazu bitte
# eine Folie nach Fehlern") - redrawn, anonymous: left as it was drawn with the faults in red, right how it goes
fw = S.Diagram(924, 440)
# left: the tree as drawn - the start splits into L and M, and below each one throws her own die twice
fw.text(250, 18, "So nicht", 16, S.RED, weight="bold")
root = (40, 230)
fw.node(*root)
fw.text(40, 212, ROOT, 14, S.INK)
wrong_path = [(140, 130), (260, 130), (360, 154)]          # Start -> L -> 5 -> 7, the path we read out
for who, y, kids in [("L", 130, [(50, [3, 5, 7]), (130, [3, 5, 7]), (210, [3, 5, 7])]),
                     ("M", 370, [(330, [4, 6]), (410, [4, 6])])]:
    fw.branch(root, (140, y), color=S.RED, width=2.2)
    fw.node(140, y, color=S.RED)
    fw.text(140, y - 11, who, 17, S.RED, weight="bold")      # names, not variables: upright
    for (ky, leaves), k in zip(kids, [3, 5, 7] if who == "L" else [4, 6]):
        on = who == "L" and k == 5
        fw.branch((140, y), (260, ky), color=S.RED if on else S.MUTED, width=2.2 if on else 1.3)
        fw.node(260, ky, str(k), "above", size=16, tex=True)
        step = 24 if who == "L" else 20
        for i, leaf in enumerate(leaves):
            ly = ky + (i - (len(leaves) - 1) / 2.0) * step
            hot = on and leaf == 7
            fw.branch((260, ky), (360, ly), color=S.RED if hot else S.MUTED, width=2.2 if hot else 1.1)
            fw.node(360, ly, str(leaf), "right", color=S.RED if hot else S.INK, size=13, tex=True)
fw.text(165, 246, "L oder M?", 14, S.RED, anchor="start", weight="bold")
fw.text(165, 264, "Beide würfeln doch!", 13, S.RED, anchor="start")
fw.text(392, 150, "Lena $5$, dann Lena $7$", 13, S.RED, anchor="start", tex=True)
fw.text(392, 168, "und wo ist Mia?", 13, S.RED, anchor="start")
fw.text(392, 372, "Mias $4$ steht $4$-mal:", 13, S.RED, anchor="start", tex=True)
fw.text(392, 396, "also", 13, S.RED, anchor="start")
fw.frac(426, 392, 2, 3, 13, S.RED)
fw.text(435, 396, ", nicht", 13, S.RED, anchor="start")
fw.frac(486, 392, 1, 2, 13, S.RED)
fw.line(548, 20, 548, 420, color="#DCE4F0", width=1.2)
# right: how it goes - Lena's throw is stage 1, Mia's throw hangs on every end as stage 2
fw.text(740, 18, "So stimmt es", 16, S.GREEN, weight="bold")
fw.text(690, 44, "1. Stufe: Lena", 12.5, S.MUTED)
fw.text(830, 44, "2. Stufe: Mia", 12.5, S.MUTED)
r2 = (590, 160)
fw.node(*r2)
fw.text(590, 142, ROOT, 14, S.INK)
for ya, a in [(80, 3), (160, 5), (240, 7)]:
    fw.branch(r2, (700, ya), color=S.INK, width=1.4)
    fw.node(700, ya, str(a), "above", size=15, tex=True)
    for dy, b in [(-22, 4), (22, 6)]:
        fw.branch((700, ya), (810, ya + dy), color=S.GREEN if (a, b) == (5, 4) else S.MUTED,
                  width=2.2 if (a, b) == (5, 4) else 1.1)
        fw.node(810, ya + dy, str(b), "right", size=13, tex=True, color=S.GREEN if (a, b) == (5, 4) else S.INK)
fw.text(836, 142, "Lena $5$, Mia $4$", 12.5, S.GREEN, anchor="start", tex=True)
for i, line in enumerate(["Äste aus einem Punkt: entweder – oder.",
                          "Lena würfelt und Mia würfelt:",
                          "zwei Stufen untereinander.",
                          "Jeder Weg ist genau eine ganze Runde."]):
    fw.text(572, 318 + i * 26, line, 14.5, S.INK, anchor="start", weight="bold" if i in (0, 3) else None)
FIG_BAUM_FALSCH = write("baum-falsch", fw)

# ------------------------------------------------------------------- slides ---
d = Deck("mathe11-wuerfelspiel.pptx")

# the play button sits on the title slide, so Solita's hello opens the title narration

d.title("Mathematik — Berufliches Gymnasium 11", "Das Würfelspiel",
        "Baumdiagramm und Pfadregeln — ganz langsam, Schritt für Schritt")

# ---------------------------------------------------------------- Kapitel 01
d.summary("Titel: Das Würfelspiel - Baumdiagramm und Pfadregeln, Mathematik BGY 11")
d.say("Hallo, ich bin Solita. Heute geht es um ein Würfelspiel — und wir nehmen uns Zeit: ganz langsam, Schritt für Schritt. Wir lernen dabei zwei Dinge: wie man ein Baumdiagramm zeichnet — und wie man mit den Pfadregeln Wahrscheinlichkeiten ausrechnet.")

d.chapter(1, "Worum geht es?", "Ein Spiel mit zwei besonderen Würfeln")

d.summary("Kapitel 1: Worum geht es? Ein Spiel mit zwei besonderen Würfeln")
d.say("Kapitel eins: Worum geht es? Ein Spiel mit zwei besonderen Würfeln.")

d.bullets("Das Spiel in drei Sätzen", [
    ("Lena und Mia würfeln mit **zwei verschiedenen**, selbst beschrifteten Würfeln", 0),
    ("Zuerst würfelt **Lena** einmal, danach **Mia** einmal", 0),
    ("Wer die **größere Zahl** oben hat, gewinnt die Runde", 0),
    ("Unsere Fragen: Wie sieht das **Baumdiagramm** aus — und wie wahrscheinlich gewinnt **Lena**?", 0),
])

d.summary("Spielregeln: Lena und Mia haben verschiedene, selbst beschriftete Würfel. Erst würfelt Lena, dann Mia, die größere Zahl gewinnt. Gefragt: Baumdiagramm und P(Lena gewinnt)")
d.say("Zuerst das Spiel selbst, in drei Sätzen.",
      "Lena und Mia haben zwei verschiedene Würfel, die sie selbst beschriftet haben.",
      "Zuerst würfelt Lena einmal, danach würfelt Mia einmal.",
      "Wer die größere Zahl oben hat, gewinnt die Runde.",
      "Und unsere Fragen: Wie sieht das Baumdiagramm aus? Und wie wahrscheinlich gewinnt Lena?")

d.picture("Die beiden Würfel — ausgeklappt als Netz", FIG_NETZE,
          frames=[die3d(LENA, 74, 225), die3d(MIA, 694, 225)])

d.summary("Würfelnetze: Lena hat 3, 5, 7 je zweimal; Mia hat die 4 viermal und die 6 zweimal")
d.say("So sehen die beiden Würfel aus, wenn man sie aufklappt. Links Lenas Würfel mit den Zahlen drei, fünf und sieben — jede Zahl steht zweimal drauf. Rechts Mias Würfel: Die Vier steht viermal drauf, die Sechs zweimal. Gleiche Zahlen haben die gleiche Farbe.")

d.bullets("Was heißt zweistufig?", [
    ("Es wird **zweimal nacheinander** gewürfelt — das sind zwei **Stufen**", 0),
    ("Stufe $1$ ist Lenas Wurf, Stufe $2$ ist Mias Wurf", 0),
    ("Im Baum heißt das: **zwei Ebenen** von Ästen, von links nach rechts", 0),
    ("Jeder Weg von ganz links nach ganz rechts ist **ein möglicher Ausgang** des Spiels", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.summary("Zweistufig: zweimal nacheinander gewürfelt = 2 Stufen (Stufe 1 Lena, Stufe 2 Mia); jeder Weg von links nach rechts ist ein Ausgang")
d.say("Warum nennt man so etwas zweistufig?",
      "Weil zweimal nacheinander gewürfelt wird. Jeder Wurf ist eine Stufe.",
      "Die erste Stufe ist Lenas Wurf, die zweite Stufe ist Mias Wurf.",
      "Im Baum sieht man das als zwei Ebenen von Ästen, von links nach rechts.",
      "Und jeder Weg von ganz links nach ganz rechts ist ein möglicher Ausgang des Spiels.")

d.chapter(2, "Die Würfel lesen", "Zählen statt raten")

d.summary("Kapitel 2: Die Würfel lesen - zählen statt raten")
d.say("Kapitel zwei: Die Würfel lesen. Hier gilt: zählen statt raten.")

d.table_top("Lenas Würfel: sechs Flächen, drei Zahlen", [
    ["Zahl", "steht wie oft auf dem Würfel?", "Wahrscheinlichkeit"],
    ["$\\mathbf{3}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
    ["$\\mathbf{5}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
    ["$\\mathbf{7}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
], [160, 380, 276], [
    ("Jede Fläche ist gleich wahrscheinlich — also einfach **zählen**: wie oft steht die Zahl drauf?", 0),
    ("Kontrolle: $\\frac{1}{3} + \\frac{1}{3} + \\frac{1}{3} = 1$", 0),
], font_size=13, bold_cols=(0,), corner=FIG_LENA, frames=[die3d(LENA, 565, 320, 165, 170)],
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.summary("Lenas Würfel: 3, 5 und 7 stehen je 2 von 6 Mal drauf = je 1/3. Kontrolle 1/3 + 1/3 + 1/3 = 1")
d.say("Fangen wir mit Lenas Würfel an. Er hat sechs Flächen, aber nur drei verschiedene Zahlen: drei, fünf und sieben. Jede davon steht zweimal auf dem Würfel. Zwei von sechs — das ist gekürzt ein Drittel.",
      "Jede Fläche kommt gleich oft nach oben. Deshalb müssen wir nur zählen, wie oft eine Zahl auf dem Würfel steht.",
      "Zur Kontrolle: Ein Drittel plus ein Drittel plus ein Drittel ergibt eins. Das muss so sein — irgendeine Zahl liegt ja immer oben.")

d.table_top("Mias Würfel: sechs Flächen, zwei Zahlen", [
    ["Zahl", "steht wie oft auf dem Würfel?", "Wahrscheinlichkeit"],
    ["$\\mathbf{4}$", "$4$-mal von $6$", "$\\frac{4}{6} = \\frac{2}{3}$"],
    ["$\\mathbf{6}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
], [160, 380, 276], [
    ("Achtung: Die $\\mathbf{4}$ **steht viermal** auf dem Würfel — nicht zweimal!", 0),
    ("Kontrolle: $\\frac{2}{3} + \\frac{1}{3} = 1$", 0),
], font_size=13, bold_cols=(0,), corner=FIG_MIA, frames=[die3d(MIA, 565, 320, 165, 170)],
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_RED})

d.summary("Mias Würfel: die 4 steht 4-mal drauf = 4/6 = 2/3 (nicht 1/2!), die 6 steht 2-mal = 1/3. Kontrolle 2/3 + 1/3 = 1")
d.say("Jetzt Mias Würfel. Die Vier steht viermal drauf — vier von sechs, also zwei Drittel. Die Sechs steht zweimal drauf — zwei von sechs, also ein Drittel.",
      "Achtung, hier passieren die meisten Fehler: Die Vier steht viermal auf dem Würfel, nicht zweimal. Ihre Wahrscheinlichkeit ist zwei Drittel, nicht ein halb.",
      "Kontrolle: Zwei Drittel plus ein Drittel ergibt wieder eins.")

d.bullets("Der wichtigste Trick: gleiche Zahlen zusammenfassen", [
    ("Man **könnte** sechs Äste mit je $\\frac{1}{6}$ zeichnen — das ist nicht falsch, aber unübersichtlich", 0),
    ("Einfacher: **gleiche Zahlen zu einem Ast** zusammenfassen", 0),
    ("Lena bekommt dann $\\mathbf{3}$ **Äste** $(3, 5, 7)$, Mia $\\mathbf{2}$ **Äste** $(4, 6)$", 0),
    ("Merke: Die Äste, die an **einem Punkt** starten, ergeben zusammen immer $\\mathbf{1}$", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.summary("Trick: gleiche Zahlen zu einem Ast zusammenfassen statt 6 Äste mit je 1/6. Lena 3 Äste (3, 5, 7), Mia 2 Äste (4, 6). Äste ab einem Punkt ergeben zusammen 1")
d.say("Und jetzt der wichtigste Trick.",
      "Man könnte für jede der sechs Flächen einen eigenen Ast zeichnen, jeden mit einem Sechstel. Das ist nicht falsch — aber unübersichtlich.",
      "Einfacher ist es, gleiche Zahlen zu einem einzigen Ast zusammenzufassen.",
      "Dann bekommt Lena drei Äste, für drei, fünf und sieben — und Mia zwei Äste, für vier und sechs.",
      "Und merkt euch: Die Äste, die an einem Punkt beginnen, ergeben zusammen immer eins.")

d.chapter(3, "Den Baum zeichnen", "Erst Lena, dann Mia")

d.summary("Kapitel 3: Den Baum zeichnen - erst Lena, dann Mia")
d.say("Kapitel drei: Den Baum zeichnen. Erst Lena, dann Mia.")

d.picture("Stufe 1: Lenas Wurf — drei Äste mit je 1/3", FIG_STUFE1)   # tree + table centred (Doc, 16.09.2026)

d.summary("Baum Stufe 1: vom Start drei Äste zu Lenas 3, 5, 7 mit je 1/3; rechts Lenas Tabelle: jede Zahl steht 2-mal von 6 drauf, 2/6 = 1/3")
d.say("Das ist die erste Stufe: Lenas Wurf. Vom Startpunkt gehen drei Äste ab — zur Drei, zur Fünf und zur Sieben. An jedem Ast steht ein Drittel. Rechts seht ihr noch einmal, woher das kommt: Jede Zahl steht zweimal auf Lenas Würfel. Zwei von sechs — also ein Drittel.")

d.bullets("Stufe 2: an jedes Ende kommt Mias Wurf", [
    ("An **jedes** der drei Enden hängen wir Mias zwei Äste: $4$ und $6$", 0),
    ("Mia würfelt immer mit **demselben** Würfel — also steht überall $\\frac{2}{3}$ bei der $4$ und $\\frac{1}{3}$ bei der $6$", 0),
    ("Lenas Ergebnis ändert nichts an Mias Würfel — die Würfe sind **unabhängig**", 0),
    ("Am Ende gibt es $3 \\cdot 2 = 6$ Wege durch den Baum", 0),
])

d.summary("Baum Stufe 2: an jedes der 3 Enden Mias Äste 4 (2/3) und 6 (1/3); die Würfe sind unabhängig; 3 mal 2 = 6 Wege")
d.say("Jetzt kommt Mia dazu.",
      "An jedes der drei Enden hängen wir Mias zwei Äste: einen zur Vier und einen zur Sechs.",
      "Mia würfelt immer mit demselben Würfel. Deshalb steht überall zwei Drittel bei der Vier und ein Drittel bei der Sechs.",
      "Was Lena würfelt, ändert nichts an Mias Würfel. Man sagt: Die beiden Würfe sind unabhängig.",
      "Drei Äste mal zwei Äste — am Ende gibt es sechs Wege durch den Baum.")

d.picture("Der fertige Baum", FIG_BAUM)   # tree + both tables centred (Doc, 16.09.2026)

d.summary("Fertiger Baum: Lenas Äste 3, 5, 7 je 1/3, an jedem Ende Mias Äste 4 (2/3) und 6 (1/3); grün die Wege, auf denen Lena gewinnt; rechts übereinander Lenas und Mias Tabelle: 3, 5, 7 je 2-mal von 6 = 1/3, die 4 4-mal von 6 = 2/3, die 6 2-mal von 6 = 1/3")
d.say("Hier ist der fertige Baum. Rechts stehen beide Würfel noch einmal als Tabelle: oben Lenas, unten Mias. Daraus kommen alle Wahrscheinlichkeiten an den Ästen. Grün sind die Wege, auf denen Lena gewinnt.")

d.bullets("Die Pfadregel: entlang eines Weges multiplizieren", [
    ("Die Wahrscheinlichkeit eines Weges: alle Äste auf dem Weg **malnehmen**", 0),
    ("Weg %s: $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$" % weg_pfeile(3, 4, (1, 3), (2, 3)), 0),
    ("Weg %s: $\\frac{1}{3} \\cdot \\frac{1}{3} = \\frac{1}{9}$" % weg_pfeile(3, 6, (1, 3), (1, 3)), 0),
    ("Kontrolle: alle sechs Wege zusammen $= 3 \\cdot \\frac{2}{9} + 3 \\cdot \\frac{1}{9} = 1$", 0),
], corner=FIG_BAUM_KLEIN, corner_size=(250, 212))

# ---------------------------------------------------------------- Kapitel 04
d.summary("Pfadregel: entlang eines Weges multiplizieren. Weg " + weg_txt(3, 4) + " = 1/3 mal 2/3 = 2/9, Weg " + weg_txt(3, 6) + " = 1/3 mal 1/3 = 1/9. Alle 6 Wege: 3 mal 2/9 + 3 mal 1/9 = 1")
d.say("Wie kommen die Zahlen rechts zustande? Mit der Pfadregel.",
      "Die Wahrscheinlichkeit eines Weges bekommt man, indem man alle Äste auf diesem Weg miteinander malnimmt.",
      "Zum Beispiel der Weg drei gegen vier: Ein Drittel mal zwei Drittel ergibt zwei Neuntel.",
      "Der Weg drei gegen sechs: Ein Drittel mal ein Drittel ergibt ein Neuntel.",
      "Und zur Kontrolle: Alle sechs Wege zusammen ergeben wieder genau eins.")

d.chapter(4, "Wer gewinnt?", "Alle sechs Ausgänge durchgehen")

d.summary("Kapitel 4: Wer gewinnt? Alle sechs Ausgänge durchgehen")
d.say("Kapitel vier: Wer gewinnt? Dafür gehen wir alle sechs Ausgänge durch.")

d.table_top("Jeder Ausgang einzeln", [
    ["Weg", "Lena", "Mia", "Wer gewinnt?", "Wahrscheinlichkeit"],
    [weg(3, 4, bold=True), "$3$", "$4$", "Mia", "$\\frac{2}{9}$"],
    [weg(3, 6, bold=True), "$3$", "$6$", "Mia", "$\\frac{1}{9}$"],
    [weg(5, 4, bold=True), "$5$", "$4$", "Lena", "$\\frac{2}{9}$"],
    [weg(5, 6, bold=True), "$5$", "$6$", "Mia", "$\\frac{1}{9}$"],
    [weg(7, 4, bold=True), "$7$", "$4$", "Lena", "$\\frac{2}{9}$"],
    [weg(7, 6, bold=True), "$7$", "$6$", "Lena", "$\\frac{1}{9}$"],
], [150, 110, 110, 220, 226], [
    ("Lena gewinnt auf **drei** Wegen — auch die $\\mathbf{7}$ **schlägt die** $\\mathbf{6}$!", 0),
], font_size=13, bold_cols=(0,),
   marks={(3, 3): TINT_GREEN, (5, 3): TINT_GREEN, (6, 3): TINT_GREEN})

d.summary("Alle Ausgänge: " + ", ".join("%s %s %s" % (weg_txt(a, b), w, p) for a, b, w, p in [(3, 4, "Mia", "2/9"), (3, 6, "Mia", "1/9"), (5, 4, "Lena", "2/9"), (5, 6, "Mia", "1/9"), (7, 4, "Lena", "2/9"), (7, 6, "Lena", "1/9")]) + ". Lena gewinnt auf 3 Wegen, auch 7 schlägt 6")
d.say("In dieser Tabelle steht jeder Ausgang einzeln: welcher Weg, welche Zahlen, wer gewinnt — und wie wahrscheinlich das ist.",
      "Lena gewinnt auf drei Wegen: fünf gegen vier, sieben gegen vier — und auch sieben gegen sechs, denn die Sieben schlägt die Sechs.")

d.bullets("Die Summenregel: passende Wege addieren", [
    ("Alle Wege, bei denen Lena gewinnt, werden **addiert**", 0),
    ("$P(\\text{Lena gewinnt}) = \\frac{2}{9} + \\frac{2}{9} + \\frac{1}{9} = \\frac{5}{9} \\approx 55{,}6\\,\\%$", 0),
    ("Gegenprobe Mia: $\\frac{2}{9} + \\frac{1}{9} + \\frac{1}{9} = \\frac{4}{9}$ — und $\\frac{5}{9} + \\frac{4}{9} = 1$", 0),
    ("Unentschieden gibt es nicht: Die beiden Würfel haben **keine gemeinsame Zahl**", 0),
], below=FIG_BAUM_FLACH)

d.summary("Summenregel: Lenas Gewinnwege addieren: 2/9 + 2/9 + 1/9 = 5/9, rund 55,6 %. Gegenprobe Mia 4/9, zusammen 1. Kein Unentschieden, die Würfel haben keine gemeinsame Zahl. Unten noch einmal der ganze Baum von oben nach unten, grün Lenas Gewinnwege " + ", ".join(weg_txt(a, b) for a, b in [(5, 4), (7, 4), (7, 6)]))
d.say("Jetzt brauchen wir die zweite Regel: die Summenregel.",
      "Alle Wege, auf denen Lena gewinnt, werden zusammengezählt.",
      "Zwei Neuntel plus zwei Neuntel plus ein Neuntel ergibt fünf Neuntel. Das sind rund fünfundfünfzig Komma sechs Prozent.",
      "Zur Gegenprobe Mia: Zwei Neuntel plus ein Neuntel plus ein Neuntel ergibt vier Neuntel. Und fünf Neuntel plus vier Neuntel ergibt wieder eins.",
      "Unentschieden kann es übrigens nicht geben — die beiden Würfel haben keine gemeinsame Zahl.")

d.bullets("Die typischen Fehler", [
    ("Mias $4$ mit $\\frac{1}{2}$ statt $\\frac{2}{3}$ — die $4$ steht **viermal** auf dem Würfel", 0),
    ("Entlang eines Weges **addiert** statt multipliziert", 0),
    ("Den Weg %s vergessen — die $7$ ist größer als die $6$" % weg(7, 6, bold=True), 0),
    ("Die Wege für Lenas Sieg **multipliziert** statt addiert", 0),
    ("Nur einen Weg genommen statt **alle drei**", 0),
])

d.summary("Typische Fehler: Mias 4 mit 1/2 statt 2/3; entlang eines Weges addiert statt multipliziert; Weg " + weg_txt(7, 6) + " vergessen; Gewinnwege multipliziert statt addiert; nur einen Weg statt aller drei")
d.say("Schauen wir uns noch die typischen Fehler an.",
      "Erstens: Mias Vier bekommt ein halb statt zwei Drittel. Dabei steht die Vier viermal auf dem Würfel.",
      "Zweitens: Entlang eines Weges wird addiert statt malgenommen.",
      "Drittens: Der Weg sieben gegen sechs wird vergessen — dabei ist die Sieben größer als die Sechs.",
      "Viertens: Die Wege für Lenas Sieg werden malgenommen statt addiert.",
      "Und fünftens: Man nimmt nur einen Weg, statt alle drei.")

d.picture("Noch ein Fehler: Lena oder Mia?", FIG_BAUM_FALSCH)
d.summary("Fehler im Aufbau des Baums: Der Start teilt sich in L und M (Lena oder Mia), darunter würfelt jede zweimal ihren eigenen Würfel. Falsch, denn Äste aus einem Punkt sind entweder-oder, Lena und Mia würfeln aber beide - das sind zwei Stufen untereinander. Probe: die Runde Lena 5, Mia 4 kommt in dem Baum gar nicht vor. Dazu Mias 4 mit 1/2 statt 2/3. Richtig: Stufe 1 Lena 3, 5, 7, Stufe 2 an jedes Ende Mia 4 und 6; jeder Weg ist genau eine ganze Runde")
d.say("Noch ein Fehler, der beim Baum gern passiert. Links teilt sich der Baum gleich am Start in L und M, also in Lena oder Mia. Darunter würfelt Lena zweimal, und Mia würfelt zweimal. "
      "Aber Äste, die aus einem Punkt kommen, bedeuten: entweder, oder. Genau einer davon passiert. "
      "Lena und Mia würfeln aber beide. Das ist kein Entweder-oder. Deshalb gehören die beiden untereinander, in zwei Stufen. "
      "Die Probe: Nehmen wir eine echte Runde. Lena würfelt eine Fünf, Mia eine Vier. Diesen Weg gibt es links gar nicht. Auf keinem Weg kann man sagen, wer gewinnt. "
      "Und noch etwas: Mias Vier steht viermal auf dem Würfel. Sie bekommt zwei Drittel, nicht ein halb. "
      "Rechts steht es richtig: erst Lenas Wurf, dann an jedes Ende Mias Wurf. Jeder Weg ist genau eine ganze Runde.")

d.merksatz("Entlang eines Pfades wird multipliziert — verschiedene Pfade zum selben Ereignis "
           "werden addiert.")

d.summary("Merksatz: entlang eines Pfades multiplizieren, verschiedene Pfade zum selben Ereignis addieren")
d.say("Das Wichtigste in einem Satz: Entlang eines Pfades wird malgenommen. Verschiedene Pfade zum selben Ereignis werden addiert.")

d.bullets("Das Rezept in fünf Schritten", [
    ("**1.** Würfelnetze zählen: Wie oft steht jede Zahl drauf?", 0),
    ("**2.** Wahrscheinlichkeit je Zahl: Anzahl durch $6$, dann kürzen", 0),
    ("**3.** Baum zeichnen: erst Stufe $1$, dann an **jedes** Ende Stufe $2$", 0),
    ("**4.** Pfadregel: entlang eines Weges **malnehmen**", 0),
    ("**5.** Summenregel: alle passenden Wege **addieren**", 0),
])

d.summary("Rezept: 1. Netze zählen, 2. Anzahl durch 6 und kürzen, 3. Baum erst Stufe 1 dann Stufe 2, 4. Pfadregel malnehmen, 5. Summenregel addieren")
d.say("Hier ist das ganze Rezept in fünf Schritten.",
      "Erstens: die Würfelnetze zählen — wie oft steht jede Zahl drauf?",
      "Zweitens: die Wahrscheinlichkeit für jede Zahl — Anzahl durch sechs, dann kürzen.",
      "Drittens: den Baum zeichnen — erst die erste Stufe, dann an jedes Ende die zweite.",
      "Viertens: die Pfadregel — entlang eines Weges malnehmen.",
      "Und fünftens: die Summenregel — alle passenden Wege addieren.")

d.bullets("Fun Facts", [
    ("Würfel gibt es seit mindestens $\\mathbf{5000}$ **Jahren** — schon im alten Orient wurde gewürfelt", 0),
    ("Der Statistiker **Bradley Efron** erfand Würfel, bei denen A gegen B, B gegen C — und C wieder gegen A gewinnt", 0),
    ("Solche Würfel heißen **nicht-transitiv**: Wer zuerst wählen muss, verliert auf Dauer", 0),
    ("Unser Spiel ist harmloser: Mit $\\frac{5}{9}$ ist Lena nur **knapp** im Vorteil", 0),
])

d.summary("Fun Facts: Würfel gibt es seit mindestens 5000 Jahren; Bradley Efron erfand nicht-transitive Würfel (A schlägt B, B schlägt C, C schlägt A); Lena ist mit 5/9 nur knapp vorn")
d.say("Zum Schluss noch ein paar Fun Facts.",
      "Würfel gibt es seit mindestens fünftausend Jahren — schon im alten Orient wurde gewürfelt.",
      "Der Statistiker Bradley Efron hat Würfel erfunden, bei denen A gegen B gewinnt, B gegen C — und C wieder gegen A.",
      "Solche Würfel nennt man nicht-transitiv. Wer zuerst einen Würfel wählen muss, verliert auf Dauer.",
      "Unser Spiel ist harmloser: Mit fünf Neunteln ist Lena nur knapp im Vorteil.")

d.bullets("Jetzt ihr: die Zwillingsaufgabe", [
    ("Pauls Würfel: $\\mathbf{1, 1, 5, 5, 6, 6}$", 0),
    ("Jonas' Würfel: $\\mathbf{2, 2, 2, 4, 4, 4}$", 0),
    ("a) Zeichnet das Baumdiagramm und schreibt an jeden Ast die Wahrscheinlichkeit", 0),
    ("b) Wie groß ist die Wahrscheinlichkeit, dass Paul gewinnt?", 0),
    ("Tipp: Geht genau das Rezept durch — Schritt für Schritt", 0),
])

d.summary("Zwillingsaufgabe für die Klasse: Paul hat 1, 1, 5, 5, 6, 6, Jonas hat 2, 2, 2, 4, 4, 4. a) Baumdiagramm zeichnen, b) Wahrscheinlichkeit, dass Paul gewinnt. Tipp: das Rezept Schritt für Schritt")
d.say("Jetzt seid ihr dran, mit einer Zwillingsaufgabe.",
      "Pauls Würfel trägt die Zahlen eins, eins, fünf, fünf, sechs, sechs.",
      "Jonas' Würfel trägt die Zahlen zwei, zwei, zwei, vier, vier, vier.",
      "Aufgabe a: Zeichnet das Baumdiagramm und schreibt an jeden Ast seine Wahrscheinlichkeit.",
      "Aufgabe b: Wie groß ist die Wahrscheinlichkeit, dass Paul gewinnt?",
      "Mein Tipp: Geht genau das Rezept durch, Schritt für Schritt. Wenn ihr fertig seid, geht es zur Lösung.",
      hold=True)   # the solution comes only on a click

d.bullets("Lösung der Zwillingsaufgabe", [
    ("Paul: $1$, $5$ und $6$ je $\\frac{2}{6} = \\frac{1}{3}$ — Jonas: $2$ und $4$ je $\\frac{3}{6} = \\frac{1}{2}$", 0),
    ("Jeder Weg: $\\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$ — sechs Wege, zusammen $1$", 0),
    ("Paul gewinnt bei %s, %s, %s, %s — die $1$ gewinnt nie" % (weg(5, 2), weg(5, 4), weg(6, 2), weg(6, 4)), 0),
    ("$P(\\text{Paul gewinnt}) = 4 \\cdot \\frac{1}{6} = \\frac{2}{3} \\approx 66{,}7\\,\\%$", 0),
])

d.summary("Lösung Zwillingsaufgabe: Paul 1, 5, 6 je 1/3, Jonas 2, 4 je 1/2; jeder Weg 1/6. Paul gewinnt bei " + ", ".join(weg_txt(a, b) for a, b in [(5, 2), (5, 4), (6, 2), (6, 4)]) + ", mit der 1 nie. P(Paul gewinnt) = 4 mal 1/6 = 2/3, rund 66,7 %")
d.say("Und hier ist die Lösung.",
      "Bei Paul stehen eins, fünf und sechs je zweimal drauf — also je ein Drittel. Bei Jonas stehen zwei und vier je dreimal drauf — also je ein halb.",
      "Jeder Weg hat damit ein Drittel mal ein halb, also ein Sechstel. Sechs Wege, zusammen eins.",
      "Paul gewinnt bei fünf gegen zwei, fünf gegen vier, sechs gegen zwei und sechs gegen vier. Mit der Eins gewinnt er nie.",
      "Also: Vier mal ein Sechstel ergibt zwei Drittel, rund sechsundsechzig Komma sieben Prozent. Super gemacht!")

# the new lab as the last slide (Doc, 16.09.2026: "bau mal das neue Lab in das Deck ein ans Ende")
d.lab("Das Würfelspiel im Labor", "wuerfelspiel.html",
      note="Eure Würfel: Fläche antippen, neue Zahl wählen — alles rechnet sofort mit.")

d.summary("Labor zum Schluss: das Würfelspiel zum Anfassen mit Würfelnetzen, Würfel lesen, Baumdiagramm Stufe für Stufe, Summe der Gewinnwege und Efron-Würfeln; eigene Zahlen auf die Flächen tippen, alle Ansichten rechnen sofort mit")

d.save()
