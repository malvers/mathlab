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


# ------------------------------------------------------------------ figures ---
def net(c, x0, y0, die, title):
    """A T-shaped die net: three faces on top, three below the middle one."""
    s = 54
    cells = [(x0 + i * s, y0, v) for i, v in enumerate(die["top"])]
    cells += [(x0 + s, y0 + (j + 1) * s, v) for j, v in enumerate(die["col"])]
    c.text(x0 + 1.5 * s, y0 - 14, title, 15, S.INK)
    for x, y, v in cells:
        c.rect(x, y, s, s, fill=die["fill"][v], stroke=S.INK, width=1.3)
        c.text(x + s / 2, y + s / 2, str(v), 22, S.INK, baseline="middle")


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

st = S.Diagram(520, 300)
root = (40, 150)
st.node(*root)
for y, v in [(50, "3"), (150, "5"), (250, "7")]:
    st.branch(root, (300, y), "1/3", size=15)
    st.node(300, y, v, "right", size=20)
st.text(300, 292, "1. Stufe: Lenas Wurf", 13, S.MUTED)
FIG_STUFE1 = write("stufe1", st)

t = S.Diagram(760, 440)
root = (30, 220)
t.node(*root)
t.text(250, 18, "1. Stufe: Lena", 13, S.MUTED)
t.text(480, 18, "2. Stufe: Mia", 13, S.MUTED)
t.text(600, 18, "Pfad", 13, S.MUTED)
t.text(700, 18, "Wahrsch.", 13, S.MUTED)
for ya, a in [(90, 3), (220, 5), (350, 7)]:
    t.branch(root, (250, ya), "1/3", size=14)
    t.node(250, ya, str(a), "above", size=18)
    for dy, b, pb, p in [(-42, 4, "2/3", "2/9"), (42, 6, "1/3", "1/9")]:
        win = a > b
        col = S.GREEN if win else S.MUTED
        t.branch((250, ya), (480, ya + dy), pb, color=col, width=2.4 if win else 1.3, size=14)
        t.node(480, ya + dy, str(b), "right", color=col, size=17)
        t.text(600, ya + dy + 5, "(%d | %d)" % (a, b), 14, S.GREEN if win else S.BODY)
        t.text(700, ya + dy + 5, p, 15, S.GREEN if win else S.BODY)
t.text(380, 432, "grün: Lena gewinnt", 13, S.GREEN)
FIG_BAUM = write("baum", t)

# ------------------------------------------------------------------- slides ---
d = Deck("mathe11-wuerfelspiel.pptx")

d.title("Mathematik — Berufliches Gymnasium 11", "Das Würfelspiel",
        "Baumdiagramm und Pfadregeln — ganz langsam, Schritt für Schritt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Worum geht es?", "Ein Spiel mit zwei besonderen Würfeln")

d.bullets("Das Spiel in drei Sätzen", [
    ("Lena und Mia würfeln mit **zwei verschiedenen**, selbst beschrifteten Würfeln", 0),
    ("Zuerst würfelt **Lena** einmal, danach **Mia** einmal", 0),
    ("Wer die **größere Zahl** oben hat, gewinnt die Runde", 0),
    ("Unsere Fragen: Wie sieht das **Baumdiagramm** aus — und wie wahrscheinlich gewinnt **Lena**?", 0),
])

d.picture("Die beiden Würfel — ausgeklappt als Netz", FIG_NETZE)

d.bullets("Was heißt zweistufig?", [
    ("Es wird **zweimal nacheinander** gewürfelt — das sind zwei **Stufen**", 0),
    ("Stufe 1 ist Lenas Wurf, Stufe 2 ist Mias Wurf", 0),
    ("Im Baum heißt das: **zwei Ebenen** von Ästen, von links nach rechts", 0),
    ("Jeder Weg von ganz links nach ganz rechts ist **ein möglicher Ausgang** des Spiels", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Würfel lesen", "Zählen statt raten")

d.table_top("Lenas Würfel: sechs Flächen, drei Zahlen", [
    ["Zahl", "steht wie oft auf dem Würfel?", "Wahrscheinlichkeit"],
    ["3", "2-mal von 6", "2/6 = 1/3"],
    ["5", "2-mal von 6", "2/6 = 1/3"],
    ["7", "2-mal von 6", "2/6 = 1/3"],
], [160, 380, 276], [
    ("Jede Fläche ist gleich wahrscheinlich — also einfach **zählen**: wie oft steht die Zahl drauf?", 0),
    ("Kontrolle: $\\frac{1}{3} + \\frac{1}{3} + \\frac{1}{3} = 1$", 0),
], font_size=13, bold_cols=(0,), corner=FIG_LENA,
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.table_top("Mias Würfel: sechs Flächen, zwei Zahlen", [
    ["Zahl", "steht wie oft auf dem Würfel?", "Wahrscheinlichkeit"],
    ["4", "4-mal von 6", "4/6 = 2/3"],
    ["6", "2-mal von 6", "2/6 = 1/3"],
], [160, 380, 276], [
    ("Achtung: Die **4 steht viermal** auf dem Würfel — nicht zweimal!", 0),
    ("Kontrolle: $\\frac{2}{3} + \\frac{1}{3} = 1$", 0),
], font_size=13, bold_cols=(0,), corner=FIG_MIA,
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_RED})

d.bullets("Der wichtigste Trick: gleiche Zahlen zusammenfassen", [
    ("Man **könnte** sechs Äste mit je $\\frac{1}{6}$ zeichnen — das ist nicht falsch, aber unübersichtlich", 0),
    ("Einfacher: **gleiche Zahlen zu einem Ast** zusammenfassen", 0),
    ("Lena bekommt dann **3 Äste** (3, 5, 7), Mia **2 Äste** (4, 6)", 0),
    ("Merke: Die Äste, die an **einem Punkt** starten, ergeben zusammen immer **1**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Den Baum zeichnen", "Erst Lena, dann Mia")

d.picture("Stufe 1: Lenas Wurf — drei Äste mit je 1/3", FIG_STUFE1)

d.bullets("Stufe 2: an jedes Ende kommt Mias Wurf", [
    ("An **jedes** der drei Enden hängen wir Mias zwei Äste: 4 und 6", 0),
    ("Mia würfelt immer mit **demselben** Würfel — also steht überall $\\frac{2}{3}$ bei der 4 und $\\frac{1}{3}$ bei der 6", 0),
    ("Lenas Ergebnis ändert nichts an Mias Würfel — die Würfe sind **unabhängig**", 0),
    ("Am Ende gibt es $3 \\cdot 2 = 6$ Wege durch den Baum", 0),
])

d.picture("Der fertige Baum", FIG_BAUM)

d.bullets("Die Pfadregel: entlang eines Weges multiplizieren", [
    ("Die Wahrscheinlichkeit eines Weges: alle Äste auf dem Weg **malnehmen**", 0),
    ("Weg (3 | 4): $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$", 0),
    ("Weg (3 | 6): $\\frac{1}{3} \\cdot \\frac{1}{3} = \\frac{1}{9}$", 0),
    ("Kontrolle: alle sechs Wege zusammen $= 3 \\cdot \\frac{2}{9} + 3 \\cdot \\frac{1}{9} = 1$", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Wer gewinnt?", "Alle sechs Ausgänge durchgehen")

d.table_top("Jeder Ausgang einzeln", [
    ["Weg", "Lena", "Mia", "Wer gewinnt?", "Wahrscheinlichkeit"],
    ["(3 | 4)", "3", "4", "Mia", "2/9"],
    ["(3 | 6)", "3", "6", "Mia", "1/9"],
    ["(5 | 4)", "5", "4", "Lena", "2/9"],
    ["(5 | 6)", "5", "6", "Mia", "1/9"],
    ["(7 | 4)", "7", "4", "Lena", "2/9"],
    ["(7 | 6)", "7", "6", "Lena", "1/9"],
], [150, 110, 110, 220, 226], [
    ("Lena gewinnt auf **drei** Wegen — auch die **7 schlägt die 6**!", 0),
], font_size=13, bold_cols=(0,),
   marks={(3, 3): TINT_GREEN, (5, 3): TINT_GREEN, (6, 3): TINT_GREEN})

d.bullets("Die Summenregel: passende Wege addieren", [
    ("Alle Wege, bei denen Lena gewinnt, werden **addiert**", 0),
    ("$P(\\text{Lena gewinnt}) = \\frac{2}{9} + \\frac{2}{9} + \\frac{1}{9} = \\frac{5}{9} \\approx 55{,}6\\,\\%$", 0),
    ("Gegenprobe Mia: $\\frac{2}{9} + \\frac{1}{9} + \\frac{1}{9} = \\frac{4}{9}$ — und $\\frac{5}{9} + \\frac{4}{9} = 1$", 0),
    ("Unentschieden gibt es nicht: Die beiden Würfel haben **keine gemeinsame Zahl**", 0),
])

d.bullets("Die typischen Fehler", [
    ("Mias 4 mit $\\frac{1}{2}$ statt $\\frac{2}{3}$ — die 4 steht **viermal** auf dem Würfel", 0),
    ("Entlang eines Weges **addiert** statt multipliziert", 0),
    ("Den Weg **(7 | 6)** vergessen — die 7 ist größer als die 6", 0),
    ("Die Wege für Lenas Sieg **multipliziert** statt addiert", 0),
    ("Nur einen Weg genommen statt **alle drei**", 0),
])

d.merksatz("Entlang eines Pfades wird multipliziert — verschiedene Pfade zum selben Ereignis "
           "werden addiert.")

d.bullets("Das Rezept in fünf Schritten", [
    ("**1.** Würfelnetze zählen: Wie oft steht jede Zahl drauf?", 0),
    ("**2.** Wahrscheinlichkeit je Zahl: Anzahl durch 6, dann kürzen", 0),
    ("**3.** Baum zeichnen: erst Stufe 1, dann an **jedes** Ende Stufe 2", 0),
    ("**4.** Pfadregel: entlang eines Weges **malnehmen**", 0),
    ("**5.** Summenregel: alle passenden Wege **addieren**", 0),
])

d.bullets("Fun Facts", [
    ("Würfel gibt es seit mindestens **5000 Jahren** — schon im alten Orient wurde gewürfelt", 0),
    ("Der Statistiker **Bradley Efron** erfand Würfel, bei denen A gegen B, B gegen C — und C wieder gegen A gewinnt", 0),
    ("Solche Würfel heißen **nicht-transitiv**: Wer zuerst wählen muss, verliert auf Dauer", 0),
    ("Unser Spiel ist harmloser: Mit $\\frac{5}{9}$ ist Lena nur **knapp** im Vorteil", 0),
])

d.bullets("Jetzt ihr: die Zwillingsaufgabe", [
    ("Pauls Würfel: **1, 1, 5, 5, 6, 6**", 0),
    ("Jonas' Würfel: **2, 2, 2, 4, 4, 4**", 0),
    ("a) Zeichnet das Baumdiagramm und schreibt an jeden Ast die Wahrscheinlichkeit", 0),
    ("b) Wie groß ist die Wahrscheinlichkeit, dass Paul gewinnt?", 0),
    ("Tipp: Geht genau das Rezept durch — Schritt für Schritt", 0),
])

d.bullets("Lösung der Zwillingsaufgabe", [
    ("Paul: 1, 5 und 6 je $\\frac{2}{6} = \\frac{1}{3}$ — Jonas: 2 und 4 je $\\frac{3}{6} = \\frac{1}{2}$", 0),
    ("Jeder Weg: $\\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$ — sechs Wege, zusammen 1", 0),
    ("Paul gewinnt bei (5 | 2), (5 | 4), (6 | 2), (6 | 4) — die 1 gewinnt nie", 0),
    ("$P(\\text{Paul gewinnt}) = 4 \\cdot \\frac{1}{6} = \\frac{2}{3} \\approx 66{,}7\\,\\%$", 0),
])

d.save()
