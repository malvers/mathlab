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
        c.text(x + s / 2, y + s / 2, str(v), 22, S.INK, baseline="middle", tex=True)


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

# same canvas and columns as the full tree, so both tables sit at the same spot
st = S.Diagram(700, 440)
root = (30, 220)
st.node(*root)
st.text(250, 18, "1. Stufe: Lena", 15, S.INK)
st.text(600, 18, "Wahrsch.", 15, S.INK)
st.text(660, 18, "in %", 15, S.INK)
for ya, n in [(90, "3"), (220, "5"), (350, "7")]:
    st.branch(root, (250, ya), "1/3", size=14, tex=True)
    st.node(250, ya, n, "above", size=18, tex=True)
    st.texlabel(600, ya, "1/3", 15, S.BODY)
    st.texlabel(660, ya, "33,3 %", 15, S.BODY)
FIG_STUFE1 = write("stufe1", st)

PROZ = {"1/9": "11,1 %", "2/9": "22,2 %"}

t = S.Diagram(700, 440)
root = (30, 220)
t.node(*root)
t.text(250, 18, "1. Stufe: Lena", 15, S.INK)
t.text(462, 18, "2. Stufe: Mia", 15, S.INK)
t.text(540, 18, "Pfad", 15, S.INK)
t.text(600, 18, "Wahrsch.", 15, S.INK)
t.text(660, 18, "in %", 15, S.INK)
for ya, a in [(90, 3), (220, 5), (350, 7)]:
    t.branch(root, (250, ya), "1/3", size=14, tex=True)
    t.node(250, ya, str(a), "above", size=18, tex=True)
    for dy, b, pb, p in [(-42, 4, "2/3", "2/9"), (42, 6, "1/3", "1/9")]:
        win = a > b
        col = S.GREEN if win else S.MUTED
        t.branch((250, ya), (480, ya + dy), pb, color=col, width=2.4 if win else 1.3, size=14, tex=True)
        t.node(480, ya + dy, str(b), "right", color=col, size=17, tex=True)
        t.texlabel(540, ya + dy, "(%d | %d)" % (a, b), 14, S.GREEN if win else S.BODY)
        t.texlabel(600, ya + dy, p, 15, S.GREEN if win else S.BODY)
        t.texlabel(660, ya + dy, PROZ[p], 15, S.GREEN if win else S.BODY)
t.text(350, 432, "grün: Lena gewinnt", 14, S.GREEN)
FIG_BAUM = write("baum", t)

# ------------------------------------------------------------------- slides ---
d = Deck("mathe11-wuerfelspiel.pptx")

# the play button sits on the title slide, so Solita's hello opens the title narration

d.title("Mathematik — Berufliches Gymnasium 11", "Das Würfelspiel",
        "Baumdiagramm und Pfadregeln — ganz langsam, Schritt für Schritt")

# ---------------------------------------------------------------- Kapitel 01
d.say("Hallo, ich bin Solita. Heute geht es um ein Würfelspiel — und wir nehmen uns Zeit: ganz langsam, Schritt für Schritt. Wir lernen dabei zwei Dinge: wie man ein Baumdiagramm zeichnet — und wie man mit den Pfadregeln Wahrscheinlichkeiten ausrechnet.")

d.chapter(1, "Worum geht es?", "Ein Spiel mit zwei besonderen Würfeln")

d.say("Kapitel eins: Worum geht es? Ein Spiel mit zwei besonderen Würfeln.")

d.bullets("Das Spiel in drei Sätzen", [
    ("Lena und Mia würfeln mit **zwei verschiedenen**, selbst beschrifteten Würfeln", 0),
    ("Zuerst würfelt **Lena** einmal, danach **Mia** einmal", 0),
    ("Wer die **größere Zahl** oben hat, gewinnt die Runde", 0),
    ("Unsere Fragen: Wie sieht das **Baumdiagramm** aus — und wie wahrscheinlich gewinnt **Lena**?", 0),
])

d.say("Zuerst das Spiel selbst, in drei Sätzen.",
      "Lena und Mia haben zwei verschiedene Würfel, die sie selbst beschriftet haben.",
      "Zuerst würfelt Lena einmal, danach würfelt Mia einmal.",
      "Wer die größere Zahl oben hat, gewinnt die Runde.",
      "Und unsere Fragen: Wie sieht das Baumdiagramm aus? Und wie wahrscheinlich gewinnt Lena?")

d.picture("Die beiden Würfel — ausgeklappt als Netz", FIG_NETZE)

d.say("So sehen die beiden Würfel aus, wenn man sie aufklappt. Links Lenas Würfel mit den Zahlen drei, fünf und sieben — jede Zahl steht zweimal drauf. Rechts Mias Würfel: Die Vier steht viermal drauf, die Sechs zweimal. Gleiche Zahlen haben die gleiche Farbe.")

d.bullets("Was heißt zweistufig?", [
    ("Es wird **zweimal nacheinander** gewürfelt — das sind zwei **Stufen**", 0),
    ("Stufe $1$ ist Lenas Wurf, Stufe $2$ ist Mias Wurf", 0),
    ("Im Baum heißt das: **zwei Ebenen** von Ästen, von links nach rechts", 0),
    ("Jeder Weg von ganz links nach ganz rechts ist **ein möglicher Ausgang** des Spiels", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.say("Warum nennt man so etwas zweistufig?",
      "Weil zweimal nacheinander gewürfelt wird. Jeder Wurf ist eine Stufe.",
      "Die erste Stufe ist Lenas Wurf, die zweite Stufe ist Mias Wurf.",
      "Im Baum sieht man das als zwei Ebenen von Ästen, von links nach rechts.",
      "Und jeder Weg von ganz links nach ganz rechts ist ein möglicher Ausgang des Spiels.")

d.chapter(2, "Die Würfel lesen", "Zählen statt raten")

d.say("Kapitel zwei: Die Würfel lesen. Hier gilt: zählen statt raten.")

d.table_top("Lenas Würfel: sechs Flächen, drei Zahlen", [
    ["Zahl", "steht wie oft auf dem Würfel?", "Wahrscheinlichkeit"],
    ["$\\mathbf{3}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
    ["$\\mathbf{5}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
    ["$\\mathbf{7}$", "$2$-mal von $6$", "$\\frac{2}{6} = \\frac{1}{3}$"],
], [160, 380, 276], [
    ("Jede Fläche ist gleich wahrscheinlich — also einfach **zählen**: wie oft steht die Zahl drauf?", 0),
    ("Kontrolle: $\\frac{1}{3} + \\frac{1}{3} + \\frac{1}{3} = 1$", 0),
], font_size=13, bold_cols=(0,), corner=FIG_LENA,
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

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
], font_size=13, bold_cols=(0,), corner=FIG_MIA,
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_RED})

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
d.say("Und jetzt der wichtigste Trick.",
      "Man könnte für jede der sechs Flächen einen eigenen Ast zeichnen, jeden mit einem Sechstel. Das ist nicht falsch — aber unübersichtlich.",
      "Einfacher ist es, gleiche Zahlen zu einem einzigen Ast zusammenzufassen.",
      "Dann bekommt Lena drei Äste, für drei, fünf und sieben — und Mia zwei Äste, für vier und sechs.",
      "Und merkt euch: Die Äste, die an einem Punkt beginnen, ergeben zusammen immer eins.")

d.chapter(3, "Den Baum zeichnen", "Erst Lena, dann Mia")

d.say("Kapitel drei: Den Baum zeichnen. Erst Lena, dann Mia.")

d.picture("Stufe 1: Lenas Wurf — drei Äste mit je 1/3", FIG_STUFE1, align="left")

d.say("Das ist die erste Stufe: Lenas Wurf. Vom Startpunkt gehen drei Äste ab — zur Drei, zur Fünf und zur Sieben. An jedem Ast steht ein Drittel. Rechts stehen dieselben Werte in einer kleinen Tabelle, auch in Prozent: jeweils rund dreiunddreißig Prozent.")

d.bullets("Stufe 2: an jedes Ende kommt Mias Wurf", [
    ("An **jedes** der drei Enden hängen wir Mias zwei Äste: $4$ und $6$", 0),
    ("Mia würfelt immer mit **demselben** Würfel — also steht überall $\\frac{2}{3}$ bei der $4$ und $\\frac{1}{3}$ bei der $6$", 0),
    ("Lenas Ergebnis ändert nichts an Mias Würfel — die Würfe sind **unabhängig**", 0),
    ("Am Ende gibt es $3 \\cdot 2 = 6$ Wege durch den Baum", 0),
])

d.say("Jetzt kommt Mia dazu.",
      "An jedes der drei Enden hängen wir Mias zwei Äste: einen zur Vier und einen zur Sechs.",
      "Mia würfelt immer mit demselben Würfel. Deshalb steht überall zwei Drittel bei der Vier und ein Drittel bei der Sechs.",
      "Was Lena würfelt, ändert nichts an Mias Würfel. Man sagt: Die beiden Würfe sind unabhängig.",
      "Drei Äste mal zwei Äste — am Ende gibt es sechs Wege durch den Baum.")

d.picture("Der fertige Baum", FIG_BAUM, align="left")

d.say("Hier ist der fertige Baum. Rechts steht für jeden der sechs Wege seine Wahrscheinlichkeit, als Bruch und in Prozent. Grün sind die Wege, auf denen Lena gewinnt.")

d.bullets("Die Pfadregel: entlang eines Weges multiplizieren", [
    ("Die Wahrscheinlichkeit eines Weges: alle Äste auf dem Weg **malnehmen**", 0),
    ("Weg $(3 \\mid 4)$: $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$", 0),
    ("Weg $(3 \\mid 6)$: $\\frac{1}{3} \\cdot \\frac{1}{3} = \\frac{1}{9}$", 0),
    ("Kontrolle: alle sechs Wege zusammen $= 3 \\cdot \\frac{2}{9} + 3 \\cdot \\frac{1}{9} = 1$", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.say("Wie kommen die Zahlen rechts zustande? Mit der Pfadregel.",
      "Die Wahrscheinlichkeit eines Weges bekommt man, indem man alle Äste auf diesem Weg miteinander malnimmt.",
      "Zum Beispiel der Weg drei gegen vier: Ein Drittel mal zwei Drittel ergibt zwei Neuntel.",
      "Der Weg drei gegen sechs: Ein Drittel mal ein Drittel ergibt ein Neuntel.",
      "Und zur Kontrolle: Alle sechs Wege zusammen ergeben wieder genau eins.")

d.chapter(4, "Wer gewinnt?", "Alle sechs Ausgänge durchgehen")

d.say("Kapitel vier: Wer gewinnt? Dafür gehen wir alle sechs Ausgänge durch.")

d.table_top("Jeder Ausgang einzeln", [
    ["Weg", "Lena", "Mia", "Wer gewinnt?", "Wahrscheinlichkeit"],
    ["$\\mathbf{(3 \\mid 4)}$", "$3$", "$4$", "Mia", "$\\frac{2}{9}$"],
    ["$\\mathbf{(3 \\mid 6)}$", "$3$", "$6$", "Mia", "$\\frac{1}{9}$"],
    ["$\\mathbf{(5 \\mid 4)}$", "$5$", "$4$", "Lena", "$\\frac{2}{9}$"],
    ["$\\mathbf{(5 \\mid 6)}$", "$5$", "$6$", "Mia", "$\\frac{1}{9}$"],
    ["$\\mathbf{(7 \\mid 4)}$", "$7$", "$4$", "Lena", "$\\frac{2}{9}$"],
    ["$\\mathbf{(7 \\mid 6)}$", "$7$", "$6$", "Lena", "$\\frac{1}{9}$"],
], [150, 110, 110, 220, 226], [
    ("Lena gewinnt auf **drei** Wegen — auch die $\\mathbf{7}$ **schlägt die** $\\mathbf{6}$!", 0),
], font_size=13, bold_cols=(0,),
   marks={(3, 3): TINT_GREEN, (5, 3): TINT_GREEN, (6, 3): TINT_GREEN})

d.say("In dieser Tabelle steht jeder Ausgang einzeln: welcher Weg, welche Zahlen, wer gewinnt — und wie wahrscheinlich das ist.",
      "Lena gewinnt auf drei Wegen: fünf gegen vier, sieben gegen vier — und auch sieben gegen sechs, denn die Sieben schlägt die Sechs.")

d.bullets("Die Summenregel: passende Wege addieren", [
    ("Alle Wege, bei denen Lena gewinnt, werden **addiert**", 0),
    ("$P(\\text{Lena gewinnt}) = \\frac{2}{9} + \\frac{2}{9} + \\frac{1}{9} = \\frac{5}{9} \\approx 55{,}6\\,\\%$", 0),
    ("Gegenprobe Mia: $\\frac{2}{9} + \\frac{1}{9} + \\frac{1}{9} = \\frac{4}{9}$ — und $\\frac{5}{9} + \\frac{4}{9} = 1$", 0),
    ("Unentschieden gibt es nicht: Die beiden Würfel haben **keine gemeinsame Zahl**", 0),
])

d.say("Jetzt brauchen wir die zweite Regel: die Summenregel.",
      "Alle Wege, auf denen Lena gewinnt, werden zusammengezählt.",
      "Zwei Neuntel plus zwei Neuntel plus ein Neuntel ergibt fünf Neuntel. Das sind rund fünfundfünfzig Komma sechs Prozent.",
      "Zur Gegenprobe Mia: Zwei Neuntel plus ein Neuntel plus ein Neuntel ergibt vier Neuntel. Und fünf Neuntel plus vier Neuntel ergibt wieder eins.",
      "Unentschieden kann es übrigens nicht geben — die beiden Würfel haben keine gemeinsame Zahl.")

d.bullets("Die typischen Fehler", [
    ("Mias $4$ mit $\\frac{1}{2}$ statt $\\frac{2}{3}$ — die $4$ steht **viermal** auf dem Würfel", 0),
    ("Entlang eines Weges **addiert** statt multipliziert", 0),
    ("Den Weg $\\mathbf{(7 \\mid 6)}$ vergessen — die $7$ ist größer als die $6$", 0),
    ("Die Wege für Lenas Sieg **multipliziert** statt addiert", 0),
    ("Nur einen Weg genommen statt **alle drei**", 0),
])

d.say("Schauen wir uns noch die typischen Fehler an.",
      "Erstens: Mias Vier bekommt ein halb statt zwei Drittel. Dabei steht die Vier viermal auf dem Würfel.",
      "Zweitens: Entlang eines Weges wird addiert statt malgenommen.",
      "Drittens: Der Weg sieben gegen sechs wird vergessen — dabei ist die Sieben größer als die Sechs.",
      "Viertens: Die Wege für Lenas Sieg werden malgenommen statt addiert.",
      "Und fünftens: Man nimmt nur einen Weg, statt alle drei.")

d.merksatz("Entlang eines Pfades wird multipliziert — verschiedene Pfade zum selben Ereignis "
           "werden addiert.")

d.say("Das Wichtigste in einem Satz: Entlang eines Pfades wird malgenommen. Verschiedene Pfade zum selben Ereignis werden addiert.")

d.bullets("Das Rezept in fünf Schritten", [
    ("**1.** Würfelnetze zählen: Wie oft steht jede Zahl drauf?", 0),
    ("**2.** Wahrscheinlichkeit je Zahl: Anzahl durch $6$, dann kürzen", 0),
    ("**3.** Baum zeichnen: erst Stufe $1$, dann an **jedes** Ende Stufe $2$", 0),
    ("**4.** Pfadregel: entlang eines Weges **malnehmen**", 0),
    ("**5.** Summenregel: alle passenden Wege **addieren**", 0),
])

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
    ("Paul gewinnt bei $(5 \\mid 2)$, $(5 \\mid 4)$, $(6 \\mid 2)$, $(6 \\mid 4)$ — die $1$ gewinnt nie", 0),
    ("$P(\\text{Paul gewinnt}) = 4 \\cdot \\frac{1}{6} = \\frac{2}{3} \\approx 66{,}7\\,\\%$", 0),
])

d.say("Und hier ist die Lösung.",
      "Bei Paul stehen eins, fünf und sechs je zweimal drauf — also je ein Drittel. Bei Jonas stehen zwei und vier je dreimal drauf — also je ein halb.",
      "Jeder Weg hat damit ein Drittel mal ein halb, also ein Sechstel. Sechs Wege, zusammen eins.",
      "Paul gewinnt bei fünf gegen zwei, fünf gegen vier, sechs gegen zwei und sechs gegen vier. Mit der Eins gewinnt er nie.",
      "Also: Vier mal ein Sechstel ergibt zwei Drittel, rund sechsundsechzig Komma sieben Prozent. Super gemacht!")

d.save()
