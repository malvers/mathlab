#!/usr/bin/env python3
"""Aufgabensatz zum Eingangstest Klasse 11 -> HTML/mathetest11-eingangstest.html

    python3 tools/build_mathetest11_eingangstest.py

Deckt alle dreizehn Bereiche des IBB-Eingangstests ab, durchgehend mit neuen
Zahlen. Die Zeichnungen kommen aus tools/aufgaben/svgfig.py, derselben
Bibliothek wie in den Abitur-Blaettern - nie SVG von Hand tippen. Das Geruest
wird byte fuer byte aus einer abgenommenen Quizdatei uebernommen, ersetzt wird
nur window.QUIZ.
"""
import os
import sys
from fractions import Fraction as F
import math

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(HERE, "aufgaben"))
import svgfig as S                                             # noqa: E402

SRC = os.path.join(REPO, "HTML", "mathetest11-werkzeuge.html")
OUT = os.path.join(REPO, "HTML", "mathetest11-eingangstest.html")


# ---------------------------------------------------------------- Figuren ----
def _rechter_winkel(c, x, y, dx, dy, size=15):
    """Das kleine Quadrat im rechten Winkel, dx/dy zeigen in die Schenkel."""
    c.path("M%g %g L%g %g L%g %g" % (x + dx * size, y, x + dx * size, y + dy * size,
                                     x, y + dy * size), stroke=S.INK, width=1.3)


def dreieck_katheten(a, b, ca, cb, ch, gesucht="c"):
    """Rechtwinkliges Dreieck, rechter Winkel unten links bei A. gesucht faerbt
    die gesuchte Groesse rot - alles andere neutral, sonst liest sich die
    Zeichnung falsch herum."""
    px = min(200.0 / max(a, 1e-9), 150.0 / max(b, 1e-9))
    W = 330
    H = b * px + 96                                            # Hoehe folgt der Figur
    x0, y0 = 66, H - 46
    x1, y1 = x0 + a * px, y0
    x2, y2 = x0, y0 - b * px
    c = S.Canvas(W, H)
    c.poly([(x0, y0), (x1, y1), (x2, y2)], stroke=S.INK, width=1.7,
           fill=S.GREEN, opacity=0.16)
    _rechter_winkel(c, x0, y0, 1, -1)
    for (x, y) in ((x0, y0), (x1, y1), (x2, y2)):
        c.circle(x, y, 3.4, fill=S.INK, stroke=S.PAPER)
    c.text(x0 - 14, y0 + 18, "A", 13, S.INK)
    c.text(x1 + 12, y1 + 18, "B", 13, S.INK)
    c.text(x2 - 14, y2 - 8, "C", 13, S.INK)

    def lbl(x, y, t, key):
        rot = key == gesucht
        c.text(x, y, t, 13, S.RED if rot else S.BODY,
               weight="700" if rot else None, halo=S.PAPER)
    lbl((x0 + x1) / 2, y0 + 22, ca, "a")
    lbl(x0 - 24, (y0 + y2) / 2, cb, "b")
    lbl((x1 + x2) / 2 + 20, (y1 + y2) / 2 - 8, ch, "c")
    return c.svg()


def rechteck_diagonale(b, h):
    W, H = 350, 250
    px = min(230.0 / b, 150.0 / h)
    x0, y0 = 58, 42
    w, hh = b * px, h * px
    c = S.Canvas(W, H)
    c.rect(x0, y0, w, hh, fill=S.ORANGE, stroke=S.INK, width=1.7, opacity=0.14)
    c.line(x0, y0 + hh, x0 + w, y0, color=S.RED, width=1.9)
    _rechter_winkel(c, x0, y0 + hh, 1, -1)
    c.text(x0 + w / 2, y0 + hh + 26, "%g cm" % b, 13, S.BODY)
    c.text(x0 - 26, y0 + hh / 2, "%g cm" % h, 13, S.BODY)
    c.text(x0 + w / 2 + 26, y0 + hh / 2 - 14, "d", 13, S.RED, weight="700", halo=S.PAPER)
    return c.svg()


def rechteck_zerlegt(b, h, links):
    """Rechteck mit einer Spitze auf der oberen Kante: drei Dreiecke wie in
    Aufgabe 12 des Tests. links = Abstand der Spitze von der linken oberen Ecke."""
    W, H = 380, 250
    px = min(260.0 / b, 140.0 / h)
    x0, y0 = 56, 46
    w, hh = b * px, h * px
    sx = x0 + links * px
    c = S.Canvas(W, H)
    c.poly([(x0, y0), (sx, y0), (x0, y0 + hh)], fill=S.ORANGE, opacity=0.30,
           stroke="none", width=0)
    c.poly([(x0, y0 + hh), (sx, y0), (x0 + w, y0 + hh)], fill=S.GREEN, opacity=0.26,
           stroke="none", width=0)
    c.poly([(sx, y0), (x0 + w, y0), (x0 + w, y0 + hh)], fill=S.RED, opacity=0.16,
           stroke="none", width=0)
    c.rect(x0, y0, w, hh, fill="none", stroke=S.INK, width=1.7)
    c.line(x0, y0 + hh, sx, y0, color=S.INK, width=1.4)
    c.line(sx, y0, x0 + w, y0 + hh, color=S.INK, width=1.4)
    c.circle(sx, y0, 3.2, fill=S.INK, stroke=S.PAPER)
    c.text(x0 + (sx - x0) / 2 - 6, y0 + hh / 2 - 8, "A\u2081", 14, S.INK, weight="700")
    c.text(x0 + w / 2, y0 + hh - 22, "A\u2082", 14, S.INK, weight="700")
    c.text(sx + (x0 + w - sx) / 2 + 8, y0 + hh / 2 - 10, "A\u2083", 14, S.INK, weight="700")
    c.text(x0 + (sx - x0) / 2, y0 - 14, "%g cm" % links, 12.5, S.MUTED)
    c.text(sx + (x0 + w - sx) / 2, y0 - 14, "%g cm" % (b - links), 12.5, S.MUTED)
    c.text(x0 + w / 2, y0 + hh + 26, "%g cm" % b, 13, S.BODY)
    c.text(x0 - 26, y0 + hh / 2, "%g cm" % h, 13, S.BODY)
    return c.svg()


def dreieck_grundseite_hoehe(g, h, spitze=0.68):
    """Dreieck mit eingezeichneter Hoehe - sie steht senkrecht auf der
    Grundseite, nicht auf einer Schenkelseite."""
    W, H = 360, 240
    px = min(240.0 / g, 130.0 / h)
    x0, y0 = 60, H - 50
    w, hh = g * px, h * px
    sx = x0 + spitze * w
    c = S.Canvas(W, H)
    c.poly([(x0, y0), (x0 + w, y0), (sx, y0 - hh)], stroke=S.INK, width=1.7,
           fill=S.GREEN, opacity=0.16)
    c.line(sx, y0 - hh, sx, y0, color=S.RED, width=1.5, dash="5 4")
    _rechter_winkel(c, sx, y0, -1, -1, 13)
    c.text(x0 + w / 2, y0 + 24, "g = %g cm" % g, 13, S.BODY)
    c.text(sx + 46, y0 - hh / 2, "h = %g cm" % h, 13, S.RED, halo=S.PAPER)
    return c.svg()


def dreieck_volle_grundseite(b, h, spitze=0.62):
    """Rechteck mit einem Dreieck darin, das die ganze untere Kante als
    Grundseite hat - die Haelfte des Rechtecks, egal wo die Spitze sitzt."""
    W, H = 360, 240
    px = min(250.0 / b, 130.0 / h)
    x0, y0 = 56, 44
    w, hh = b * px, h * px
    sx = x0 + spitze * w
    c = S.Canvas(W, H)
    c.poly([(x0, y0), (x0 + w, y0), (x0 + w, y0 + hh), (x0, y0 + hh)],
           stroke=S.MUTED, width=1.3, fill="none", dash="5 4")
    c.poly([(x0, y0 + hh), (x0 + w, y0 + hh), (sx, y0)], stroke=S.INK, width=1.7,
           fill=S.GREEN, opacity=0.20)
    c.circle(sx, y0, 3.2, fill=S.INK, stroke=S.PAPER)
    c.text(x0 + w / 2, y0 + hh + 26, "%g cm" % b, 13, S.BODY)
    c.text(x0 - 26, y0 + hh / 2, "%g cm" % h, 13, S.BODY)
    return c.svg()


Q = []


def q(text, opts, steps, solution, fig=None, figcap=None):
    """fig ist ein fertiges Inline-SVG aus svgfig; figcap die Bildunterschrift.
    Die Zeichnung darf die Lösung nie verraten - sie zeigt nur, was gegeben ist."""
    assert len(opts) == 4, text
    assert len(set(opts)) == 4, "doppelte Option: " + text
    assert 0 <= solution < 4
    assert 2 <= len(steps) <= 4, text
    assert fig is None or fig.lstrip().startswith("<svg"), "fig ist kein SVG: " + text[:40]
    assert (figcap is None) or fig, "figcap ohne fig: " + text[:40]
    Q.append(dict(q=text, opts=opts, steps=steps, solution=solution, fig=fig, figcap=figcap))


# ------------------------------------------------------- 1 Bruchrechnung ----
q(r'Berechne $\dfrac{3}{5} + \dfrac{1}{4}$ und kürze so weit wie möglich.',
  [r'$\dfrac{4}{9}$', r'$\dfrac{17}{20}$', r'$\dfrac{3}{20}$', r'$\dfrac{4}{20}$'],
  ['Brüche werden nie über Zähler und Nenner getrennt addiert — erst auf einen gemeinsamen Nenner bringen.',
   r'Hauptnenner ist $20$: $\dfrac{3}{5} = \dfrac{12}{20}$ und $\dfrac{1}{4} = \dfrac{5}{20}$.',
   r'$\dfrac{12}{20} + \dfrac{5}{20} = \dfrac{17}{20}$ — $17$ ist prim, mehr lässt sich nicht kürzen.'],
  1)

q(r'Berechne $\dfrac{1}{2} - \dfrac{3}{4} \cdot \dfrac{2}{9}$.',
  [r'$\dfrac{1}{3}$', r'$-\dfrac{1}{18}$', r'$\dfrac{1}{18}$', r'$-\dfrac{1}{9}$'],
  ['Punkt vor Strich: zuerst das Produkt, dann die Subtraktion.',
   r'$\dfrac{3}{4} \cdot \dfrac{2}{9} = \dfrac{6}{36} = \dfrac{1}{6}$',
   r'$\dfrac{1}{2} - \dfrac{1}{6} = \dfrac{3}{6} - \dfrac{1}{6} = \dfrac{2}{6} = \dfrac{1}{3}$'],
  0)

q(r'Berechne $\dfrac{2}{7} : \dfrac{4}{21}$ und kürze so weit wie möglich.',
  [r'$\dfrac{8}{147}$', r'$\dfrac{2}{3}$', r'$\dfrac{3}{2}$', r'$\dfrac{42}{28}$'],
  ['Durch einen Bruch teilt man, indem man mit seinem Kehrwert multipliziert.',
   r'$\dfrac{2}{7} : \dfrac{4}{21} = \dfrac{2}{7} \cdot \dfrac{21}{4}$',
   r'Kürzen: $\dfrac{2 \cdot 21}{7 \cdot 4} = \dfrac{42}{28} = \dfrac{3}{2}$ — das Ergebnis muss gekürzt angegeben werden.'],
  2)

q(r'Welches Zeichen steht richtig zwischen $\dfrac{5}{4}$ und $1{,}2$?',
  [r'$\dfrac{5}{4} < 1{,}2$', r'$\dfrac{5}{4} = 1{,}2$', r'$\dfrac{5}{4} > 1{,}2$',
   'lässt sich nicht vergleichen'],
  [r'Den Bruch in eine Dezimalzahl verwandeln: $5 : 4 = 1{,}25$.',
   r'$1{,}25$ liegt rechts von $1{,}2$ auf dem Zahlenstrahl.',
   r'Also gilt $\dfrac{5}{4} > 1{,}2$.'],
  2)

# --------------------------------------------------------- 2 Gleichungen ----
q(r'Löse die Gleichung $9x + 7 = 4x + 42$.',
  ['$x = 7$', '$x = 5$', '$x = 9{,}8$', '$x = -7$'],
  [r'Alle $x$ auf eine Seite: $\;|\; -4x$ ergibt $5x + 7 = 42$.',
   r'Zahlen auf die andere Seite: $\;|\; -7$ ergibt $5x = 35$.',
   r'$\;|\; :5$ ergibt $x = 7$. Probe: $9 \cdot 7 + 7 = 70$ und $4 \cdot 7 + 42 = 70$ ✓'],
  0)

q(r'Löse die Gleichung $12 - 3\,(2 - x) = 20 - (x + 6)$.',
  ['$x = 2$', '$x = 5$', '$x = -2$', '$x = 3{,}5$'],
  [r'Klammern auflösen, das Minus dreht jedes Vorzeichen: $12 - 6 + 3x = 20 - x - 6$',
   r'Zusammenfassen: $6 + 3x = 14 - x$',
   r'$\;|\; +x$ und $\;|\; -6$ ergibt $4x = 8$, also $x = 2$. Probe: links $12 - 3 \cdot 0 = 12$, rechts $20 - 8 = 12$ ✓'],
  0)

# ------------------------------------------------------------ 3 Klammern ----
q(r'Fasse zusammen: $7a - (3b - 2a)$',
  ['$9a - 3b$', '$5a - 3b$', '$9a + 3b$', '$7a - 3b - 2a$'],
  ['Ein Minus vor der Klammer dreht das Vorzeichen jedes Summanden darin um.',
   r'$7a - 3b + 2a$',
   r'Gleiche Variablen zusammenfassen: $9a - 3b$. Nur $a$ mit $a$, niemals $a$ mit $b$.'],
  0)

q(r'Multipliziere aus: $(3x + 2)(2x + 5)$',
  ['$6x^2 + 10$', '$6x^2 + 19x + 10$', '$6x^2 + 17x + 10$', '$5x^2 + 19x + 7$'],
  ['Jeder Summand der ersten Klammer wird mit jedem der zweiten multipliziert.',
   r'$3x \cdot 2x = 6x^2$, $\;3x \cdot 5 = 15x$, $\;2 \cdot 2x = 4x$, $\;2 \cdot 5 = 10$',
   r'Die gemischten Glieder zusammenfassen: $15x + 4x = 19x$, also $6x^2 + 19x + 10$.'],
  1)

# ------------------------------------------------------------ 4 Einheiten ----
q(r'Rechne um: $540$ min $=$ ? h',
  ['$5{,}4$ h', '$9$ h', r'$32\,400$ h', '$54$ h'],
  [r'Eine Stunde hat $60$ Minuten, also wird durch $60$ geteilt.',
   r'$540 : 60 = 9$',
   r'Also $540$ min $= 9$ h. Gegenprobe: $9 \cdot 60 = 540$ ✓'],
  1)

# ------------------------------------------------- 5 Gleichung aus Text ----
q('Schreibe als Gleichung: „Das Vierfache einer Zahl, vermindert um $18$, ist genauso groß wie das Doppelte dieser Zahl.“',
  ['$4x - 18 = 2x$', '$4x + 18 = 2x$', '$18 - 4x = 2x$', '$4(x - 18) = 2x$'],
  [r'„Das Vierfache einer Zahl“ heißt $4x$.',
   r'„vermindert um $18$“ heißt $-18$, und zwar hinter dem Vierfachen — nicht in einer Klammer.',
   r'„genauso groß wie das Doppelte“ liefert das Gleichheitszeichen und $2x$: $\;4x - 18 = 2x$.'],
  0)

q('Lena und ihr Vater sind zusammen $70$ Jahre alt. Vor acht Jahren war der Vater fünfmal so alt wie Lena. Welche Gleichung beschreibt das, wenn $x$ Lenas heutiges Alter ist?',
  ['$70 - x = 5(x - 8)$', '$62 - x = 5(x - 8)$', '$62 - x = 5(x + 8)$', '$70 - x = 5x - 8$'],
  [r'Heute: Lena $x$, der Vater $70 - x$.',
   r'Vor acht Jahren war jede Person acht Jahre jünger: Lena $x - 8$, der Vater $70 - x - 8 = 62 - x$.',
   r'„fünfmal so alt“ verbindet beide: $62 - x = 5(x - 8)$. Daraus folgt $x = 17$, der Vater ist $53$.'],
  1)

# ------------------------------------------------------ 6 Formel umstellen ----
q(r'Stelle $E = \dfrac{m}{2} \cdot v^2$ nach $m$ um.',
  [r'$m = \dfrac{2E}{v^2}$', r'$m = \dfrac{E}{2v^2}$', r'$m = 2E - v^2$', r'$m = \dfrac{E \cdot v^2}{2}$'],
  [r'Zuerst den Bruch beseitigen: $\;|\; \cdot 2$ ergibt $2E = m \cdot v^2$.',
   r'Dann durch den Faktor bei $m$ teilen: $\;|\; : v^2$.',
   r'$m = \dfrac{2E}{v^2}$, gültig für $v \neq 0$.'],
  0)

# ---------------------------------------------------------------- 7 Prozent ----
q(r'Frau Berger verdient $1\,800$ € im Monat und gibt $35\,\%$ davon für die Miete aus. Wie hoch ist die Miete?',
  ['$630$ €', '$514{,}29$ €', r'$5\,142{,}86$ €', '$63$ €'],
  ['Gesucht ist der Prozentwert, der Grundwert ist bekannt — also wird multipliziert.',
   r'$1\,800 \cdot 0{,}35 = 630$',
   r'Die Miete beträgt $630$ €. Kontrolle: $10\,\%$ wären $180$ €, $35\,\%$ also gut das Dreifache.'],
  0)

q(r'Herr Kunz zahlt $468$ € Miete, das sind $26\,\%$ seines Gehalts. Wie viel verdient er?',
  [r'$1\,216{,}80$ €', r'$1\,800$ €', '$121{,}68$ €', '$494$ €'],
  ['Hier ist der Prozentwert bekannt und der Grundwert gesucht — also wird geteilt.',
   r'$G = \dfrac{468}{0{,}26} = 1\,800$',
   r'Er verdient $1\,800$ €. Probe: $1\,800 \cdot 0{,}26 = 468$ ✓'],
  1)

q(r'Eine Miete von $840$ € wird um $4\,\%$ erhöht. Wie hoch ist sie danach, gerundet auf ganze Euro?',
  ['$844$ €', '$880$ €', '$874$ €', '$873$ €'],
  [r'Eine Erhöhung um $4\,\%$ bedeutet den Faktor $1{,}04$ — der alte Betrag bleibt erhalten und kommt nicht weg.',
   r'$840 \cdot 1{,}04 = 873{,}60$',
   r'Auf ganze Euro gerundet: $874$ €. Die Nachkommastelle $6$ rundet auf.'],
  2)

# ------------------------------------------------------------ 8 Pythagoras ----
q(r'In einem rechtwinkligen Dreieck sind die Katheten $4$ cm und $7$ cm lang. Wie lang ist die Hypotenuse?',
  [r'$11$ cm', r'$\sqrt{33} \approx 5{,}74$ cm', r'$\sqrt{65} \approx 8{,}06$ cm', r'$5{,}5$ cm'],
  ['Die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite.',
   r'$c^2 = 4^2 + 7^2 = 16 + 49 = 65$',
   r'$c = \sqrt{65} \approx 8{,}06$ cm. Plausibel: länger als $7$ cm, kürzer als $4 + 7 = 11$ cm.'],
  2,
  fig=dreieck_katheten(4, 7, r'4 cm', r'7 cm', r'c', gesucht='c'),
  figcap='Die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite.')

q(r'Ist ein Dreieck mit $a = 9$ cm, $b = 12$ cm und $c = 15$ cm rechtwinklig?',
  ['nein, die Seiten passen nicht zusammen',
   r'ja, der rechte Winkel liegt bei $C$',
   r'ja, der rechte Winkel liegt bei $A$',
   'das lässt sich ohne Zeichnung nicht entscheiden'],
  [r'Der Satz des Pythagoras wird mit der längsten Seite geprüft, hier $c = 15$ cm.',
   r'$9^2 + 12^2 = 81 + 144 = 225$ und $15^2 = 225$ — beide Seiten stimmen überein.',
   r'Das Dreieck ist rechtwinklig. Der rechte Winkel liegt der längsten Seite gegenüber, also bei $C$.'],
  1)

# --------------------------------------------------------------- 9 Fläche ----
q(r'Ein Rechteck ist $10$ cm breit und $8$ cm hoch. Ein Dreieck darin hat die ganze untere Kante als Grundseite, seine Spitze liegt auf der oberen Kante. Wie groß ist seine Fläche?',
  [r'$80\ \mathrm{cm^2}$', r'$40\ \mathrm{cm^2}$', r'$18\ \mathrm{cm^2}$', r'$20\ \mathrm{cm^2}$'],
  [r'Die Dreiecksfläche ist $A = \dfrac{g \cdot h}{2}$; die Höhe ist der Abstand der Spitze zur Grundseite, hier die volle Rechteckhöhe.',
   r'$A = \dfrac{10\ \mathrm{cm} \cdot 8\ \mathrm{cm}}{2} = 40\ \mathrm{cm^2}$',
   'Das ist genau die Hälfte des Rechtecks — und zwar unabhängig davon, wo auf der oberen Kante die Spitze sitzt.'],
  1,
  fig=dreieck_volle_grundseite(10, 8),
  figcap='Die gestrichelte Linie ist das Rechteck, grün das Dreieck darin.')

# ------------------------------------------------------ 10 lineare Funktionen ----
q(r'Die Graphen von $f(x) = \dfrac{1}{2}x + 2$ und $g(x) = -x + 5$ schneiden einander. Wie lauten die Koordinaten des Schnittpunkts?',
  [r'$S(2 \mid 3)$', r'$S(3 \mid 2)$', r'$S(2 \mid 4)$', r'$S(1{,}5 \mid 2{,}75)$'],
  [r'Im Schnittpunkt sind beide Funktionswerte gleich: $\dfrac{1}{2}x + 2 = -x + 5$',
   r'$\;|\; +x$ und $\;|\; -2$ ergibt $\dfrac{3}{2}x = 3$, also $x = 2$.',
   r'Einsetzen in $f$: $f(2) = 1 + 2 = 3$. Probe mit $g$: $-2 + 5 = 3$ ✓ Also $S(2 \mid 3)$.'],
  0)

# ------------------------------------------------------------ 11 Pfadregel ----
q(r'Annas Würfel zeigt je zweimal die $1$, die $4$ und die $6$. Beates Würfel zeigt viermal die $3$ und zweimal die $5$. Anna würfelt zuerst, dann Beate; es gewinnt die größere Zahl. Wie groß ist die Wahrscheinlichkeit, dass Anna gewinnt?',
  [r'$\dfrac{1}{2}$', r'$\dfrac{4}{9}$', r'$\dfrac{5}{9}$', r'$\dfrac{2}{3}$'],
  [r'Annas Zahlen haben je die Wahrscheinlichkeit $\dfrac{1}{3}$. Bei Beate gilt $P(3) = \dfrac{4}{6} = \dfrac{2}{3}$ und $P(5) = \dfrac{1}{3}$.',
   r'Anna gewinnt auf drei Pfaden: $(4 \mid 3)$, $(6 \mid 3)$ und $(6 \mid 5)$. Die $1$ verliert immer.',
   r'Pfadregel: $\dfrac{1}{3} \cdot \dfrac{2}{3} + \dfrac{1}{3} \cdot \dfrac{2}{3} + \dfrac{1}{3} \cdot \dfrac{1}{3} = \dfrac{2}{9} + \dfrac{2}{9} + \dfrac{1}{9} = \dfrac{5}{9}$'],
  2)


# ------------------------------------------------- 12 Geometrie, gezeichnet ----
q(r'Von einem rechtwinkligen Dreieck sind die Hypotenuse $c = 13$ cm und die Kathete $b = 5$ cm bekannt. Wie lang ist die zweite Kathete $a$?',
  [r'$a = 8$ cm', r'$a = 12$ cm', r'$a = \sqrt{194} \approx 13{,}9$ cm', r'$a = 18$ cm'],
  [r'Der Satz des Pythagoras lautet $a^2 + b^2 = c^2$. Gesucht ist hier eine Kathete, also wird umgestellt.',
   r'$a^2 = c^2 - b^2 = 169 - 25 = 144$',
   r'$a = \sqrt{144} = 12$ cm. Die Kathete ist kürzer als die Hypotenuse - das ist die Probe im Kopf.'],
  1,
  fig=dreieck_katheten(12, 5, r'a', r'5 cm', r'13 cm', gesucht='a'),
  figcap='Gegeben sind die Hypotenuse und eine Kathete, gesucht ist die zweite (rot).')

q(r'Ein Rechteck ist $12$ cm breit und $9$ cm hoch. Wie lang ist seine Diagonale?',
  [r'$21$ cm', r'$\sqrt{63} \approx 7{,}9$ cm', r'$15$ cm', r'$10{,}5$ cm'],
  [r'Die Diagonale zerlegt das Rechteck in zwei rechtwinklige Dreiecke; die Seiten sind die Katheten.',
   r'$d^2 = 12^2 + 9^2 = 144 + 81 = 225$',
   r'$d = \sqrt{225} = 15$ cm. Die Diagonale ist länger als jede Seite, aber kürzer als beide zusammen.'],
  2,
  fig=rechteck_diagonale(12, 9),
  figcap='Die Diagonale (rot) ist die Hypotenuse eines rechtwinkligen Dreiecks.')

q(r'Ist ein Dreieck mit $a = 5$ cm, $b = 6$ cm und $c = 8$ cm rechtwinklig?',
  [r'ja, der rechte Winkel liegt bei $C$', r'ja, der rechte Winkel liegt bei $B$',
   r'das hängt von der Zeichnung ab', r'nein'],
  [r'Geprueft wird immer mit der längsten Seite, hier $c = 8$ cm.',
   r'$5^2 + 6^2 = 25 + 36 = 61$, aber $8^2 = 64$.',
   r'Wegen $61 \neq 64$ ist das Dreieck nicht rechtwinklig. Es gibt also keinen rechten Winkel anzugeben.'],
  3)

q(r'Ein Dreieck hat die Grundseite $g = 14$ cm und die Höhe $h = 9$ cm. Wie groß ist sein Flächeninhalt?',
  [r'$126\ \mathrm{cm^2}$', r'$23\ \mathrm{cm^2}$', r'$63\ \mathrm{cm^2}$', r'$46\ \mathrm{cm^2}$'],
  [r'Die Dreiecksfläche ist $A = \dfrac{g \cdot h}{2}$.',
   r'$A = \dfrac{14\ \mathrm{cm} \cdot 9\ \mathrm{cm}}{2} = \dfrac{126}{2}\ \mathrm{cm^2}$',
   r'$A = 63\ \mathrm{cm^2}$. Wer das Halbieren vergisst, erhält $126\ \mathrm{cm^2}$ - die Fläche des Rechtecks.'],
  2,
  fig=dreieck_grundseite_hoehe(14, 9),
  figcap='Die Höhe steht senkrecht auf der Grundseite, nicht auf einer Schenkelseite.')

q(r'Ein Rechteck ist $12$ cm breit und $5$ cm hoch. Ein Punkt auf der oberen Kante teilt sie in $8$ cm und $4$ cm und zerlegt das Rechteck in drei Dreiecke. Wie groß ist $A_1$, das linke Dreieck?',
  [r'$20\ \mathrm{cm^2}$', r'$40\ \mathrm{cm^2}$', r'$30\ \mathrm{cm^2}$', r'$10\ \mathrm{cm^2}$'],
  [r'$A_1$ hat die Grundseite $8$ cm auf der oberen Kante; seine Höhe ist die volle Rechteckhöhe $5$ cm.',
   r'$A_1 = \dfrac{8\ \mathrm{cm} \cdot 5\ \mathrm{cm}}{2} = 20\ \mathrm{cm^2}$',
   r'Probe am Ende: alle drei Dreiecke zusammen muessen $12 \cdot 5 = 60\ \mathrm{cm^2}$ ergeben.'],
  0,
  fig=rechteck_zerlegt(12, 5, 8),
  figcap='Alle drei Dreiecke haben die Rechteckhöhe als Höhe.')

q(r'Im selben Rechteck: wie groß ist $A_3$, das rechte Dreieck oben?',
  [r'$20\ \mathrm{cm^2}$', r'$12\ \mathrm{cm^2}$', r'$30\ \mathrm{cm^2}$', r'$10\ \mathrm{cm^2}$'],
  [r'$A_3$ hat den Rest der oberen Kante als Grundseite: $12 - 8 = 4$ cm, die Höhe ist wieder $5$ cm.',
   r'$A_3 = \dfrac{4\ \mathrm{cm} \cdot 5\ \mathrm{cm}}{2} = 10\ \mathrm{cm^2}$',
   r'Probe: $A_1 + A_2 + A_3 = 20 + 30 + 10 = 60\ \mathrm{cm^2}$, und das Rechteck misst $12 \cdot 5 = 60\ \mathrm{cm^2}$ ✓'],
  3,
  fig=rechteck_zerlegt(12, 5, 8),
  figcap='Dieselbe Zerlegung: A₂ ist die halbe Fläche, A₁ und A₃ teilen sich die andere Hälfte.')

q(r'Ein Rechteck hat den Flächeninhalt $72\ \mathrm{cm^2}$ und ist $8$ cm breit. Wie groß ist sein Umfang?',
  [r'$17$ cm', r'$80$ cm', r'$26$ cm', r'$34$ cm'],
  [r'Aus $A = a \cdot b$ folgt die zweite Seite: $a = \dfrac{72}{8} = 9$ cm.',
   r'Der Umfang zählt jede Seite doppelt: $U = 2 \cdot (9 + 8)$',
   r'$U = 2 \cdot 17 = 34$ cm. Wer $9 + 8$ stehen laesst, gibt nur den halben Umfang an.'],
  3)

q(r'Ein Dreieck hat den Flächeninhalt $54\ \mathrm{cm^2}$ und die Grundseite $g = 12$ cm. Wie hoch ist es?',
  [r'$4{,}5$ cm', r'$9$ cm', r'$648$ cm', r'$18$ cm'],
  [r'$A = \dfrac{g \cdot h}{2}$ nach $h$ umstellen: mal $2$, dann durch $g$.',
   r'$h = \dfrac{2A}{g} = \dfrac{108}{12}$',
   r'$h = 9$ cm. Wer das Verdoppeln vergisst, erhält $4{,}5$ cm - die Hälfte des richtigen Werts.'],
  1)


# ------------------------------------------------------------------ check ----
def check():
    assert F(3, 5) + F(1, 4) == F(17, 20)
    assert F(1, 2) - F(3, 4) * F(2, 9) == F(1, 3)
    assert F(2, 7) / F(4, 21) == F(3, 2)
    assert F(5, 4) > F(12, 10) and float(F(5, 4)) == 1.25
    assert 9 * 7 + 7 == 4 * 7 + 42 == 70                       # x = 7
    x = 2                                                       # bracket equation
    assert 12 - 3 * (2 - x) == 20 - (x + 6) == 12
    # 7a - (3b - 2a) = 9a - 3b, checked on two sample values
    for a, b in ((3, 5), (-2, 7)):
        assert 7 * a - (3 * b - 2 * a) == 9 * a - 3 * b
    for t in (0, 1, -3, 2.5):                                   # (3x+2)(2x+5)
        assert abs((3 * t + 2) * (2 * t + 5) - (6 * t ** 2 + 19 * t + 10)) < 1e-12
    assert 540 / 60 == 9
    assert 4 * 9 - 18 == 2 * 9                                  # text equation, x = 9
    lena = 17                                                   # age puzzle
    assert 62 - lena == 5 * (lena - 8) == 45 and lena + (70 - lena) == 70
    assert (70 - lena) - 8 == 45 and lena - 8 == 9
    E, v, m = 50.0, 5.0, 4.0                                    # E = m/2 v^2
    assert abs(E - m / 2 * v ** 2) < 1e-12 and abs(m - 2 * E / v ** 2) < 1e-12
    assert 1800 * 0.35 == 630.0
    assert abs(468 / 0.26 - 1800) < 1e-9 and abs(1800 * 0.26 - 468) < 1e-9
    assert abs(840 * 1.04 - 873.60) < 1e-9 and round(873.60) == 874
    assert 4 ** 2 + 7 ** 2 == 65 and abs(math.sqrt(65) - 8.0623) < 1e-4
    assert 7 < math.sqrt(65) < 11
    assert 9 ** 2 + 12 ** 2 == 15 ** 2 == 225
    assert F(10 * 8, 2) == 40
    xs = F(2)                                                   # intersection
    assert F(1, 2) * xs + 2 == -xs + 5 == 3
    p = F(1, 3) * F(2, 3) + F(1, 3) * F(2, 3) + F(1, 3) * F(1, 3)
    assert p == F(5, 9)                                         # tree diagram
    # --- geometry ---
    assert 13 ** 2 - 5 ** 2 == 144 and math.isqrt(144) == 12    # cathetus wanted
    assert 12 < 13 and 5 ** 2 + 12 ** 2 == 13 ** 2              # plausibility + probe
    assert 12 ** 2 + 9 ** 2 == 225 and math.isqrt(225) == 15    # diagonal
    assert 15 > 12 and 15 < 12 + 9
    assert 5 ** 2 + 6 ** 2 == 61 and 8 ** 2 == 64 and 61 != 64  # not right-angled
    assert F(14 * 9, 2) == 63 and 14 * 9 == 126                 # triangle area
    assert F(8 * 5, 2) == 20 and F(12 * 5, 2) == 30 and F(4 * 5, 2) == 10
    assert 20 + 30 + 10 == 12 * 5 == 60                         # the decomposition adds up
    assert 12 - 8 == 4
    assert F(72, 8) == 9 and 2 * (9 + 8) == 34                  # perimeter from area
    assert F(2 * 54, 12) == 9 and F(54, 12) * 2 == 9            # height from area
    assert F(10 * 8, 2) == 40                                   # the existing full-base item
    # A figure may never give the answer away. Only the labels count - the
    # coordinates of an SVG contain arbitrary numbers and would raise false alarms.
    import re
    for item in Q:
        if not item.get("fig"):
            continue
        labels = " ".join(re.findall(r"<text[^>]*>([^<]*)</text>", item["fig"]))
        loesung = item["opts"][item["solution"]]
        for zahl in re.findall(r"\d+", loesung):
            if len(zahl) < 2:
                continue
            assert zahl not in re.findall(r"\d+", labels), \
                "Die Zeichnung verraet die Loesung (%s): %s" % (zahl, item["q"][:50])
    # every distractor must differ from the right answer
    for item in Q:
        assert item["opts"][item["solution"]] not in (
            o for i, o in enumerate(item["opts"]) if i != item["solution"])
        item["_right"] = item["opts"][item["solution"]]        # survives the rotation
    print("check ok: %d Aufgaben, Loesungen auf Position %s"
          % (len(Q), sorted({i["solution"] for i in Q})))


def build():
    src = open(SRC, encoding="utf-8").read()
    head, rest = src.split("window.QUIZ = {", 1)
    tail = rest.split("\n};\n", 1)[1]
    head = head.replace("<title>Aufgaben: Gleichungen mit Hilfsmitteln — Doc Alvers Mathe-Labor</title>",
                        "<title>Aufgaben: Eingangstest üben — Doc Alvers Mathe-Labor</title>")
    assert "Eingangstest üben" in head

    def js(s):
        """One Python string -> one JS single-quoted literal.

        Every backslash is doubled here, so the text that reaches KaTeX in the
        browser is byte for byte the text written above. Writing "\\," by hand in
        the task text is what broke 5\\,142 into 5,142 (found 09.09.2026)."""
        assert '"' not in s, "gerade Anfuehrungszeichen: " + s[:50]
        return s.replace("\\", "\\\\").replace("'", "\\'")

    def js_svg(t):
        """Das SVG steht in einem einfach gequoteten JS-String: nur Backslash und
        das einfache Anfuehrungszeichen muessen weg, die doppelten der Attribute
        duerfen bleiben."""
        return t.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")

    items = []
    for it in Q:
        it.pop("_right", None)
        opts = ",\n        ".join("'%s'" % js(o) for o in it["opts"])
        steps = ",\n        ".join("'%s'" % js(s) for s in it["steps"])
        extra = ""
        if it.get("fig"):
            extra += ",\n      fig: '%s'" % js_svg(it["fig"])
            if it.get("figcap"):
                extra += ",\n      figcap: '%s'" % js(it["figcap"])
        items.append("""    {
      q: '%s',
      opts: [
        %s
      ],
      steps: [
        %s
      ],
      solution: %d%s
    }""" % (js(it["q"]), opts, steps, it["solution"], extra))

    quiz = """window.QUIZ = {
  id: 'mathe11-eingangstest',
  version: 'v1',
  submitLabel: 'Auswertung',   /* Uebungsblatt: der Knopf heisst Auswertung */
  solutions: 'always',  /* Loesung pro Aufgabe sofort aufklappbar */
  title: 'Aufgaben · Eingangstest üben',
  subtitle: 'Berufliches Gymnasium · Klasse 11 · Woche 5, KW 38 · 28 Aufgaben zu allen Bereichen des Eingangstests: Bruchrechnung, Gleichungen, Klammern, Einheiten, Prozent, Pythagoras und Flächen mit Zeichnung, lineare Funktionen, Pfadregel · genau eine Antwort pro Aufgabe',
  dashSub: 'BGY · Klasse 11 · KW 38 · Live-Auswertung: anonyme Einzelscores + Gruppenleistung pro Aufgabe',
  back: 'svp/mathe/mathe11.html', /* opened from the Mathe-11 plan */
  /* Nacharbeit zum Eingangstest: dieselben dreizehn Bereiche wie auf dem Testbogen,
     durchgehend mit neuen Zahlen. Die Distraktoren sind die Fehler, die im Test
     tatsaechlich vorkamen - Strichrechnung vor Punktrechnung, Minus vor der Klammer
     nicht verteilt, Grundwert mit dem Prozentwert verwechselt, Pythagoras ohne die
     längste Seite geprüft. Sieben Aufgaben tragen eine Zeichnung aus svgfig. */
  questions: [
%s
  ]
};
""" % (",\n".join(items))

    out = head + quiz + tail
    for ch in out:
        assert ch == "\n" or ch == "\t" or ord(ch) >= 32, "Steuerzeichen im Text"
    open(OUT, "w", encoding="utf-8").write(out)
    print(os.path.relpath(OUT, REPO), "geschrieben,", len(out), "Bytes")


def balance():
    """Spread the right answers evenly over the four positions (5 each).

    Rotating an option list keeps every distractor and every step untouched - the
    steps never name a position, they argue with the numbers themselves."""
    target = [i % 4 for i in range(len(Q))]          # 0,1,2,3,0,1,2,3,...
    for item, want in zip(Q, target):
        cur = item["solution"]
        shift = (want - cur) % 4
        item["opts"] = item["opts"][-shift:] + item["opts"][:-shift] if shift else item["opts"]
        item["solution"] = want
        assert len(item["opts"]) == 4 and len(set(item["opts"])) == 4
    for item in Q:
        assert item["opts"][item["solution"]] == item["_right"], \
            "Rotation hat die richtige Antwort verschoben: " + item["q"][:50]
    counts = {i: target.count(i) for i in range(4)}
    assert set(counts.values()) == {len(Q) // 4}, counts
    print("balanciert:", counts)


check()
balance()
build()
