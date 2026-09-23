#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 4 (LB 1): Geraden im Raum - Punkt-Richtungs-Form und
Zwei-Punkte-Form, Punktprobe, Parameterwert, Spurpunkte, Geraden durch Kanten und
Diagonalen eines Quaders. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Solid, MUTED, GREEN, RED

Q = fos12(nr=4, slug='geraden', thema='Geraden im Raum', lb='LB 1',
          blurb='Parametergleichung, Punktprobe, Spurpunkte',
          comment='Blocks: Geradengleichung aufstellen (1-6), Punktprobe und Parameter (7-12), Spurpunkte (13-16), Quader und Anwendungen (17-20). Alles ohne CAS.')


# ------------------------------------------------------------- figures ----
def quader_fig(hilite):
    """Cuboid A(0|0|0) ... G(4|3|2); `hilite` is a list of (P, Q, colour) segments to stress."""
    f = Solid(w=360, h=340, scale=36, ox=140, oy=240)
    A, B, C, D = (0, 0, 0), (4, 0, 0), (4, 3, 0), (0, 3, 0)
    E, F_, G, H = (0, 0, 2), (4, 0, 2), (4, 3, 2), (0, 3, 2)
    f.shade([B, C, G, F_])
    f.shade([E, F_, G, H], opacity=0.12)
    f.edges([(B, C), (C, D), (B, F_), (C, G), (D, H), (E, F_), (F_, G), (G, H), (H, E)])
    f.edges([(A, B), (A, D), (A, E)], color=MUTED, width=1.2, dash='4 3')
    for p, q, col in hilite:
        f.edge(p, q, color=col, width=3)
    for p, lab, pos in ((A, 'A', 'left'), (B, 'B', 'below-left'), (C, 'C', 'below-right'),
                        (D, 'D', 'right'), (E, 'E', 'above-left'), (F_, 'F', 'left'),
                        (G, 'G', 'right'), (H, 'H', 'above-right')):
        f.vertex(p, lab, pos)
    svg = f.svg('Quader ABCDEFGH')
    assert "'" not in svg
    return svg


def g(p, u, t='t'):
    """Parametergleichung as LaTeX: \\vec x = p + t \\cdot u."""
    return r'\vec x = ' + vec(*p) + ' + ' + t + r' \cdot ' + vec(*u)


# ------------------------------------------------ Geradengleichung aufstellen ----
Q.q(r'Die Gerade $g$ geht durch $P(1|2|3)$ und hat den Richtungsvektor $\vec u = ' + vec(2, 0, -1) + r'$. Wie lautet eine Gleichung von $g$?',
    [r'$g: ' + g((1, 2, 3), (2, 0, -1)) + '$',
     r'$g: ' + g((2, 0, -1), (1, 2, 3)) + '$',
     r'$g: ' + g((1, 2, 3), (2, 0, 1)) + '$',
     r'$g: ' + g((1, 2, 3), (3, 2, 2)) + '$'],
    [r'Punkt-Richtungs-Form: $\vec x = \vec p + t \cdot \vec u$ - Stützvektor ist der Ortsvektor des Punktes, dahinter der Richtungsvektor.',
     r'$g: ' + g((1, 2, 3), (2, 0, -1)) + '$',
     r'Falle: Stütz- und Richtungsvektor vertauschen ergibt eine andere Gerade.'])

Q.q(r'Stelle eine Gleichung der Geraden durch $A(1|0|2)$ und $B(3|4|1)$ auf.',
    [r'$g: ' + g((1, 0, 2), (2, 4, -1)) + '$',
     r'$g: ' + g((1, 0, 2), (3, 4, 1)) + '$',
     r'$g: ' + g((1, 0, 2), (4, 4, 3)) + '$',
     r'$g: ' + g((2, 4, -1), (1, 0, 2)) + '$'],
    [r'Zwei-Punkte-Form: $\vec x = \vec a + t \cdot \overrightarrow{AB}$',
     r'$\overrightarrow{AB} = \vec b - \vec a = ' + vec(3 - 1, 4 - 0, 1 - 2) + '$',
     r'Falle: der Ortsvektor von $B$ ist kein Richtungsvektor - es muss die Differenz sein.'])

Q.q(r'Gegeben ist $g: ' + g((2, 1, 0), (1, -2, 3)) + r'$. Welcher Vektor ist ebenfalls ein Richtungsvektor von $g$?',
    [r'$' + vec(-2, 4, -6) + '$', r'$' + vec(2, 1, 0) + '$', r'$' + vec(1, 2, 3) + '$', r'$' + vec(3, -1, 3) + '$'],
    [r'Jedes Vielfache $k \cdot \vec u$ mit $k \neq 0$ ist ein Richtungsvektor derselben Geraden.',
     r'$' + vec(-2, 4, -6) + r' = -2 \cdot ' + vec(1, -2, 3) + '$ - passt.',
     r'Der Stützvektor $' + vec(2, 1, 0) + r'$ ist ein Punkt der Geraden, keine Richtung.'])

Q.q(r'Die Gerade $g$ geht durch den Ursprung und den Punkt $P(3|-1|2)$. Wie lautet eine Gleichung von $g$?',
    [r'$g: \vec x = t \cdot ' + vec(3, -1, 2) + '$',
     r'$g: ' + g((3, -1, 2), (1, 1, 1)) + '$',
     r'$g: ' + g((1, 1, 1), (3, -1, 2)) + '$',
     r'$g: \vec x = t \cdot ' + vec(3, 1, 2) + '$'],
    [r'Stützpunkt $O(0|0|0)$, Richtungsvektor $\overrightarrow{OP} = ' + vec(3, -1, 2) + '$',
     r'$g: \vec x = ' + vec(0, 0, 0) + r' + t \cdot ' + vec(3, -1, 2) + r' = t \cdot ' + vec(3, -1, 2) + '$',
     r'Probe: $t = 1$ liefert $P$, $t = 0$ den Ursprung.'])

Q.q(r'Wie viele Richtungsvektoren hat eine Gerade im Raum?',
    [r'unendlich viele - jedes Vielfache $k \cdot \vec u$ mit $k \neq 0$',
     r'genau einen',
     r'genau zwei: $\vec u$ und $-\vec u$',
     r'genau drei, einen für jede Koordinatenachse'],
    [r'Ein Richtungsvektor gibt nur die Richtung an; seine Länge und seine Orientierung sind frei.',
     r'Deshalb beschreiben $' + g((1, 2, 3), (2, 0, -1)) + r'$ und $' + g((1, 2, 3), (-4, 0, 2), 's') + r'$ dieselbe Gerade.',
     r'Ebenso darf jeder Punkt der Geraden als Stützpunkt dienen.'])

Q.q(r'Stelle eine Gleichung der Geraden durch $A(2|-1|4)$ und $B(2|3|4)$ auf.',
    [r'$g: ' + g((2, -1, 4), (0, 1, 0)) + '$',
     r'$g: ' + g((2, -1, 4), (1, 0, 1)) + '$',
     r'$g: ' + g((0, 4, 0), (2, -1, 4)) + '$',
     r'$g: ' + g((2, -1, 4), (4, 2, 8)) + '$'],
    [r'$\overrightarrow{AB} = ' + vec(0, 4, 0) + r'$, gekürzt zu $' + vec(0, 1, 0) + '$ - das ist erlaubt, nur die Richtung zählt.',
     r'$g: ' + g((2, -1, 4), (0, 1, 0)) + '$',
     r'Die Gerade verläuft parallel zur $y$-Achse: nur die $y$-Koordinate ändert sich.'])

# ------------------------------------------------- Punktprobe und Parameter ----
Q.q(r'Liegt der Punkt $P(5|2|1)$ auf $g: ' + g((1, 2, 3), (2, 0, -1)) + '$?',
    [r'ja, für $t = 2$', r'nein, die zweite Koordinate passt nicht', r'nein, die dritte Koordinate passt nicht', r'ja, für $t = -2$'],
    [r'Punktprobe: $\vec p$ einsetzen und zeilenweise nach $t$ auflösen.',
     r'$1 + 2t = 5$ gibt $t = 2$; zweite Zeile: $2 = 2$ stimmt; dritte Zeile: $3 - 2 = 1$ stimmt.',
     r'Alle drei Zeilen liefern denselben Wert - $P$ liegt auf $g$.'])

Q.q(r'Liegt der Punkt $Q(3|4|0)$ auf $g: ' + g((1, 0, 2), (2, 4, -1)) + '$?',
    [r'nein: aus den ersten beiden Zeilen folgt $t = 1$, aber $2 - 1 = 1 \neq 0$', r'ja, für $t = 1$', r'ja, für $t = 2$', r'nein, die erste Koordinate passt nicht'],
    [r'$1 + 2t = 3$ gibt $t = 1$; $0 + 4t = 4$ gibt ebenfalls $t = 1$.',
     r'Dritte Zeile: $2 - 1 \cdot 1 = 1$, aber die $z$-Koordinate von $Q$ ist $0$ - Widerspruch.',
     r'Falle: nach zwei passenden Zeilen aufhören. Alle drei müssen stimmen.'])

Q.q(r'Für welchen Parameterwert $t$ liefert $g: ' + g((0, 1, -2), (1, -1, 2)) + r'$ den Punkt $(3|-2|4)$?',
    [r'$t = 3$', r'$t = -3$', r'$t = 2$', r'für keinen Wert von $t$'],
    [r'$0 + t = 3$ gibt $t = 3$.',
     r'Probe: $1 - 3 = -2$ und $-2 + 2 \cdot 3 = 4$ - beide Zeilen passen.',
     r'Der Punkt liegt also auf $g$, und zwar bei $t = 3$.'])

Q.q(r'Welcher Punkt liegt auf $g: ' + g((1, 1, 1), (2, -1, 3)) + '$?',
    [r'$(5|-1|7)$', r'$(3|0|3)$', r'$(2|-1|3)$', r'$(-1|2|-1)$'],
    [r'$(5|-1|7)$: $1 + 2t = 5$ gibt $t = 2$; $1 - 2 = -1$ und $1 + 6 = 7$ - passt.',
     r'$(3|0|3)$: $t = 1$ liefert $(3|0|4)$, nicht $(3|0|3)$. $(-1|2|-1)$: $t = -1$ liefert $(-1|2|-2)$.',
     r'$(2|-1|3)$ sind nur die Koordinaten des Richtungsvektors - als Punkt liegt er nicht auf $g$: $t = \frac{1}{2}$ liefert $(2|0{,}5|2{,}5)$.'])

Q.q(r'Berechne den Punkt von $g: ' + g((4, 0, 1), (-1, 2, 3)) + r'$ für $t = -2$.',
    [r'$(6|-4|-5)$', r'$(2|4|7)$', r'$(2|-4|-6)$', r'$(5|-2|-2)$'],
    [r'$\vec x = ' + vec(4, 0, 1) + r' - 2 \cdot ' + vec(-1, 2, 3) + ' = ' + vec(4, 0, 1) + ' + ' + vec(2, -4, -6) + '$',
     r'$= ' + vec(6, -4, -5) + '$',
     r'Falle: $-2 \cdot (-1) = +2$; und den Stützvektor nicht vergessen.'])

Q.q(r'Der Punkt $P(3|a|4)$ liegt auf $g: ' + g((1, 2, 0), (1, -1, 2)) + r'$. Bestimme $a$.',
    [r'$a = 0$', r'$a = 4$', r'$a = 2$', r'$a = -2$'],
    [r'Aus der ersten Zeile: $1 + t = 3$, also $t = 2$. Probe dritte Zeile: $0 + 2 \cdot 2 = 4$ - passt.',
     r'Zweite Zeile mit $t = 2$: $a = 2 - 2 = 0$',
     r'Falle: $2 + 2 = 4$ - das Minus im Richtungsvektor übersehen.'])

# ------------------------------------------------------------- Spurpunkte ----
Q.q(r'Bestimme den Spurpunkt von $g: ' + g((1, 2, 3), (2, 0, -1)) + r'$ mit der $x$-$y$-Ebene.',
    [r'$S_{xy}(7|2|0)$', r'$S_{xy}(1|2|0)$', r'$S_{xy}(-5|2|0)$', r'$S_{xy}(7|2|3)$'],
    [r'In der $x$-$y$-Ebene ist $z = 0$: $3 - t = 0$, also $t = 3$.',
     r'$t = 3$ einsetzen: $x = 1 + 6 = 7$, $y = 2$, $z = 0$ - Spurpunkt $S_{xy}(7|2|0)$.',
     r'Falle: einfach $z$ durch $0$ ersetzen ($(1|2|0)$) - der Punkt liegt nicht auf $g$.'])

Q.q(r'Bestimme den Spurpunkt von $g: ' + g((2, 4, 1), (1, -2, 3)) + r'$ mit der $x$-$z$-Ebene.',
    [r'$S_{xz}(4|0|7)$', r'$S_{xz}(0|0|-5)$', r'$S_{xz}(2|0|1)$', r'$S_{xz}(3|2|4)$'],
    [r'In der $x$-$z$-Ebene ist $y = 0$: $4 - 2t = 0$, also $t = 2$.',
     r'$x = 2 + 2 = 4$, $z = 1 + 6 = 7$ - Spurpunkt $S_{xz}(4|0|7)$.',
     r'$(0|0|-5)$ gehört zu $t = -2$ - Vorzeichenfehler beim Auflösen.'])

Q.q(r'Bestimme den Spurpunkt von $g: ' + g((3, 1, -2), (-1, 2, 1)) + r'$ mit der $y$-$z$-Ebene.',
    [r'$S_{yz}(0|7|1)$', r'$S_{yz}(0|1|-2)$', r'$S_{yz}(0|-5|-5)$', r'$S_{yz}(0|7|-1)$'],
    [r'In der $y$-$z$-Ebene ist $x = 0$: $3 - t = 0$, also $t = 3$.',
     r'$y = 1 + 6 = 7$, $z = -2 + 3 = 1$ - Spurpunkt $S_{yz}(0|7|1)$.',
     r'Probe: $t = 3$ in alle drei Zeilen einsetzen.'])

Q.q(r'Welchen Spurpunkt hat die Gerade $g: ' + g((1, 2, 3), (2, 1, 0)) + r'$ nicht?',
    [r'keinen mit der $x$-$y$-Ebene, weil $z = 3$ konstant bleibt',
     r'keinen mit der $x$-$z$-Ebene',
     r'keinen mit der $y$-$z$-Ebene',
     r'Sie hat alle drei Spurpunkte.'],
    [r'Die $z$-Koordinate ist $3 + 0 \cdot t = 3$ für jedes $t$ - sie wird nie $0$.',
     r'$g$ verläuft parallel zur $x$-$y$-Ebene in der Höhe $3$ und trifft sie nicht.',
     r'Mit den anderen beiden Ebenen: $y = 0$ bei $t = -2$, $x = 0$ bei $t = -\frac{1}{2}$ - die gibt es.'])

# ------------------------------------------------ Quader und Anwendungen ----
Q.q(r'Ein Quader hat die Ecken $A(0|0|0)$, $B(4|0|0)$, $C(4|3|0)$, $D(0|3|0)$ und darüber $E$, $F$, $G$, $H$ in der Höhe $2$. Wie lautet eine Gleichung der Geraden durch die Kante $\overline{BF}$?',
    [r'$g: ' + g((4, 0, 0), (0, 0, 1)) + '$',
     r'$g: ' + g((4, 0, 0), (4, 0, 2)) + '$',
     r'$g: ' + g((0, 0, 0), (4, 0, 2)) + '$',
     r'$g: ' + g((4, 0, 0), (0, 1, 0)) + '$'],
    [r'$F$ liegt senkrecht über $B$: $F(4|0|2)$, also $\overrightarrow{BF} = ' + vec(0, 0, 2) + r'$, gekürzt $' + vec(0, 0, 1) + '$.',
     r'$g: ' + g((4, 0, 0), (0, 0, 1)) + '$',
     r'$' + g((0, 0, 0), (4, 0, 2)) + r'$ wäre die Flächendiagonale $\overline{AF}$.'],
    fig=quader_fig([((4, 0, 0), (4, 0, 2), RED)]), figcap=r'Quader mit der Kante $\overline{BF}$')

Q.q(r'Im selben Quader: Liegt der Punkt $P(2|1{,}5|2)$ auf der Geraden durch die Flächendiagonale $\overline{EG}$?',
    [r'ja, für $t = \dfrac{1}{2}$ - $P$ ist der Mittelpunkt der Deckfläche',
     r'nein, die $z$-Koordinate passt nicht',
     r'ja, für $t = 2$',
     r'nein, die $y$-Koordinate passt nicht'],
    [r'$E(0|0|2)$, $G(4|3|2)$: $g_{EG}: ' + g((0, 0, 2), (4, 3, 0)) + '$',
     r'$4t = 2$ gibt $t = \frac{1}{2}$; $3 \cdot \frac{1}{2} = 1{,}5$ stimmt; $z = 2$ stimmt.',
     r'$t = \frac{1}{2}$ heißt: $P$ liegt genau in der Mitte zwischen $E$ und $G$.'],
    fig=quader_fig([((0, 0, 2), (4, 3, 2), GREEN)]), figcap=r'Quader mit der Flächendiagonale $\overline{EG}$')

Q.q(r'Eine Drohne startet in $P(2|1|0)$ und fliegt geradlinig; ihre Position nach $t$ Sekunden ist $\vec x = ' + vec(2, 1, 0) + r' + t \cdot ' + vec(3, 4, 1) + r'$ (Angaben in Metern). Wann erreicht sie die Höhe $6\,\mathrm{m}$, und wo ist sie dann?',
    [r'nach $6\,\mathrm{s}$ im Punkt $(20|25|6)$', r'nach $6\,\mathrm{s}$ im Punkt $(18|24|6)$', r'nach $2\,\mathrm{s}$ im Punkt $(8|9|2)$', r'nach $3\,\mathrm{s}$ im Punkt $(11|13|3)$'],
    [r'Höhe ist die $z$-Koordinate: $0 + 1 \cdot t = 6$, also $t = 6$.',
     r'$x = 2 + 18 = 20$, $y = 1 + 24 = 25$, $z = 6$',
     r'Falle: $(18|24|6)$ vergisst den Startpunkt $P$.'])

Q.q(r'Ein Lichtstrahl geht von der Lampe $L(2|3|6)$ aus durch den Punkt $P(3|4|4)$. Wo trifft er den Boden (die $x$-$y$-Ebene)?',
    [r'$(5|6|0)$', r'$(3|4|0)$', r'$(4|5|2)$', r'$(6|7|0)$'],
    [r'Gerade durch $L$ und $P$: $\overrightarrow{LP} = ' + vec(1, 1, -2) + r'$, also $g: ' + g((2, 3, 6), (1, 1, -2)) + '$',
     r'Boden: $z = 0$, also $6 - 2t = 0$, $t = 3$.',
     r'$x = 2 + 3 = 5$, $y = 3 + 3 = 6$ - Auftreffpunkt $(5|6|0)$; das ist der Spurpunkt $S_{xy}$.'])


def check():
    from fractions import Fraction as F
    add = lambda p, q: tuple(x + y for x, y in zip(p, q))
    sub = lambda p, q: tuple(x - y for x, y in zip(p, q))
    mul = lambda k, v: tuple(k * x for x in v)
    at = lambda p, u, t: add(p, mul(t, u))

    def on_line(p, u, x):
        """t with p + t u = x, or None (independent of the steps' reasoning)."""
        ts = set()
        for pi, ui, xi in zip(p, u, x):
            if ui == 0:
                if pi != xi:
                    return None
            else:
                ts.add(F(xi - pi, ui))
        return ts.pop() if len(ts) == 1 else None

    # 1-6: Geradengleichung aufstellen
    assert on_line((1, 2, 3), (2, 0, -1), (1, 2, 3)) == 0
    assert on_line((2, 0, -1), (1, 2, 3), (1, 2, 3)) is None and on_line((1, 2, 3), (2, 0, 1), (3, 2, 2)) is None
    assert sub((3, 4, 1), (1, 0, 2)) == (2, 4, -1) and add((3, 4, 1), (1, 0, 2)) == (4, 4, 3)
    assert on_line((1, 0, 2), (2, 4, -1), (3, 4, 1)) == 1 and on_line((1, 0, 2), (3, 4, 1), (3, 4, 1)) is None
    assert mul(-2, (1, -2, 3)) == (-2, 4, -6)
    for v in ((2, 1, 0), (1, 2, 3), (3, -1, 3)):
        assert on_line((0, 0, 0), (1, -2, 3), v) is None  # not a multiple of u
    assert on_line((0, 0, 0), (3, -1, 2), (3, -1, 2)) == 1
    assert on_line((3, -1, 2), (1, 1, 1), (0, 0, 0)) is None and on_line((1, 1, 1), (3, -1, 2), (0, 0, 0)) is None
    assert on_line((0, 0, 0), (3, 1, 2), (3, -1, 2)) is None
    assert mul(-2, (2, 0, -1)) == (-4, 0, 2)
    assert sub((2, 3, 4), (2, -1, 4)) == (0, 4, 0) and mul(4, (0, 1, 0)) == (0, 4, 0) and add((2, 3, 4), (2, -1, 4)) == (4, 2, 8)
    assert on_line((2, -1, 4), (0, 1, 0), (2, 3, 4)) == 4
    # 7-12: Punktprobe und Parameter
    assert on_line((1, 2, 3), (2, 0, -1), (5, 2, 1)) == 2
    assert on_line((1, 0, 2), (2, 4, -1), (3, 4, 0)) is None and at((1, 0, 2), (2, 4, -1), 1) == (3, 4, 1)
    assert on_line((0, 1, -2), (1, -1, 2), (3, -2, 4)) == 3
    assert on_line((1, 1, 1), (2, -1, 3), (5, -1, 7)) == 2
    assert at((1, 1, 1), (2, -1, 3), 1) == (3, 0, 4) and at((1, 1, 1), (2, -1, 3), -1) == (-1, 2, -2)
    for v in ((3, 0, 3), (2, -1, 3), (-1, 2, -1)):
        assert on_line((1, 1, 1), (2, -1, 3), v) is None
    assert at((4, 0, 1), (-1, 2, 3), -2) == (6, -4, -5) and at((4, 0, 1), (-1, 2, 3), 2) == (2, 4, 7)
    assert mul(-2, (-1, 2, 3)) == (2, -4, -6) and at((4, 0, 1), (-1, 2, 3), -1) == (5, -2, -2)
    assert at((1, 2, 0), (1, -1, 2), 2) == (3, 0, 4)
    # 13-16: Spurpunkte
    assert at((1, 2, 3), (2, 0, -1), 3) == (7, 2, 0) and at((1, 2, 3), (2, 0, -1), -3) == (-5, 2, 6)
    assert at((2, 4, 1), (1, -2, 3), 2) == (4, 0, 7) and at((2, 4, 1), (1, -2, 3), -2) == (0, 8, -5) and at((2, 4, 1), (1, -2, 3), 1) == (3, 2, 4)
    assert at((3, 1, -2), (-1, 2, 1), 3) == (0, 7, 1)
    assert all(at((1, 2, 3), (2, 1, 0), t)[2] == 3 for t in range(-5, 6))
    assert at((1, 2, 3), (2, 1, 0), -2)[1] == 0 and at((1, 2, 3), (2, 1, 0), F(-1, 2))[0] == 0
    # 17-20: Quader und Anwendungen
    B, F_, E, G = (4, 0, 0), (4, 0, 2), (0, 0, 2), (4, 3, 2)
    assert sub(F_, B) == (0, 0, 2) and mul(2, (0, 0, 1)) == (0, 0, 2)
    assert on_line(B, (0, 0, 1), F_) == 2 and on_line((0, 0, 0), (4, 0, 2), F_) == 1 and on_line((0, 0, 0), (4, 0, 2), B) is None
    assert on_line(B, (0, 1, 0), F_) is None
    assert sub(G, E) == (4, 3, 0) and on_line(E, (4, 3, 0), (2, F(3, 2), 2)) == F(1, 2)
    assert at(E, (4, 3, 0), F(1, 2)) == (2, F(3, 2), 2)
    assert at((2, 1, 0), (3, 4, 1), 6) == (20, 25, 6) and mul(6, (3, 4, 1)) == (18, 24, 6)
    assert at((2, 1, 0), (3, 4, 1), 2) == (8, 9, 2) and at((2, 1, 0), (3, 4, 1), 3) == (11, 13, 3)
    assert sub((3, 4, 4), (2, 3, 6)) == (1, 1, -2) and at((2, 3, 6), (1, 1, -2), 3) == (5, 6, 0)
    assert at((2, 3, 6), (1, 1, -2), 2) == (4, 5, 2) and at((2, 3, 6), (1, 1, -2), 4) == (6, 7, -2)


Q.verify(check)
Q.save()
