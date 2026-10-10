#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 15 / KW 50 (LB 3): number ranges N, Z, Q and
their subset relations (Venn diagram); points in all four quadrants, reflections.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os7
from osfig import koordinaten

Q = os7(nr=15, slug='zahlbereiche-koordinaten', thema='Zahlbereiche und vier Quadranten', lb='LB 3',
        blurb='natürliche, ganze und rationale Zahlen, Venn-Diagramm, Punkte in allen vier Quadranten',
        comment='Blocks: number ranges (1-7), coordinates in four quadrants (8-20).')

PTS = [(-3, 2, 'A'), (4, -1, 'B'), (0, -3, 'C'), (-2, -4, 'D')]
fig_k = koordinaten(PTS)
cap_k = r'Punkte im Koordinatensystem'


def quadrant(x, y):
    return {(1, 1): 'I', (-1, 1): 'II', (-1, -1): 'III', (1, -1): 'IV'}[(1 if x > 0 else -1, 1 if y > 0 else -1)]


# --------------------------------------------------------------- number ranges ----
Q.q(r'Welche Aussage über die Zahl −4 stimmt?',
    [r'Sie ist eine ganze Zahl, aber keine natürliche Zahl.', r'Sie ist eine natürliche Zahl.',
     r'Sie ist keine rationale Zahl.', r'Sie gehört zu keinem Zahlbereich.'],
    [r'Natürliche Zahlen: 0, 1, 2, 3, …',
     r'Ganze Zahlen: …, −2, −1, 0, 1, 2, …',
     r'−4 ist ganz (und damit auch rational), aber nicht natürlich.'])

Q.q(r'Welche Zahl ist rational, aber keine ganze Zahl?',
    [r'−2,5', r'−3', r'0', r'12'],
    [r'Rationale Zahlen lassen sich als Bruch schreiben, auch mit Minus.',
     r'−3, 0 und 12 sind ganze Zahlen.',
     r'$-2{,}5 = -\dfrac{5}{2}$ ist rational, aber nicht ganz.'])

Q.q(r'Welche Zahl ist eine natürliche Zahl?',
    [r'7', r'−7', r'0,7', r'$\dfrac{7}{2}$'],
    [r'Natürliche Zahlen sind 0, 1, 2, 3, …',
     r'Ohne Minus, ohne Komma und ohne echten Bruch.',
     r'Nur 7 ist natürlich.'])

Q.q(r'Welche Beziehung zwischen den Zahlbereichen stimmt?',
    [r'$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$', r'$\mathbb{Q} \subset \mathbb{Z} \subset \mathbb{N}$',
     r'$\mathbb{Z} \subset \mathbb{N} \subset \mathbb{Q}$', r'Die Bereiche haben nichts gemeinsam.'],
    [r'Jede natürliche Zahl ist auch eine ganze Zahl.',
     r'Jede ganze Zahl ist auch eine rationale Zahl, zum Beispiel $-3 = -\dfrac{3}{1}$.',
     r'$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$'])

Q.q(r'Wie liegen im Venn-Diagramm die Kreise für die natürlichen, ganzen und rationalen Zahlen?',
    [r'ineinander: $\mathbb{N}$ innen, darum $\mathbb{Z}$, außen $\mathbb{Q}$', r'nebeneinander ohne Überschneidung',
     r'$\mathbb{Q}$ ganz innen', r'Sie überschneiden sich nur in der Null.'],
    [r'Eine Teilmenge zeichnet man als Kreis innerhalb der größeren Menge.',
     r'$\mathbb{N}$ liegt ganz in $\mathbb{Z}$, $\mathbb{Z}$ ganz in $\mathbb{Q}$.',
     r'Drei Kreise ineinander, wie eine Zielscheibe.'])

Q.q(r'Ist $0{,}\overline{3}$ eine rationale Zahl?',
    [r'Ja, denn $0{,}\overline{3} = \dfrac{1}{3}$.', r'Nein, weil sie unendlich viele Stellen hat.',
     r'Nein, weil sie kein Minus hat.', r'Nur, wenn man rundet.'],
    [r'Rational heißt: als Bruch ganzer Zahlen darstellbar.',
     r'$1 : 3 = 0{,}333\ldots = 0{,}\overline{3}$',
     r'Auch periodische Dezimalzahlen sind rational.'])

Q.q(r'Warum braucht man negative Zahlen?',
    [r'Damit auch Aufgaben wie $3 - 5$ ein Ergebnis haben.', r'Damit man durch null teilen kann.',
     r'Damit es keine Brüche mehr gibt.', r'Man braucht sie eigentlich nicht.'],
    [r'In den natürlichen Zahlen hat $3 - 5$ kein Ergebnis.',
     r'Mit negativen Zahlen gilt: $3 - 5 = -2$.',
     r'Temperaturen und Kontostände unter null lassen sich so beschreiben.'])

# --------------------------------------------------- coordinates in four quadrants ----
Q.q(r'Welche Koordinaten hat der Punkt A?',
    [r'$A(-3 \mid 2)$', r'$A(2 \mid -3)$', r'$A(3 \mid 2)$', r'$A(-3 \mid -2)$'],
    [r'Erst nach links oder rechts: 3 nach links, also $x = -3$.',
     r'Dann nach oben oder unten: 2 nach oben, also $y = 2$.',
     r'$A(-3 \mid 2)$'],
    fig=fig_k, figcap=cap_k)

Q.q(r'In welchem Quadranten liegt der Punkt B?',
    [r'im IV. Quadranten', r'im I. Quadranten', r'im II. Quadranten', r'im III. Quadranten'],
    [r'$B(4 \mid -1)$: $x$ positiv, $y$ negativ.',
     r'Die Quadranten zählt man gegen den Uhrzeigersinn, rechts oben beginnt der I.',
     r'Rechts unten ist der IV. Quadrant.'],
    fig=fig_k, figcap=cap_k)

Q.q(r'Welcher Punkt hat die Koordinaten $(0 \mid -3)$?',
    [r'C', r'A', r'B', r'D'],
    [r'$x = 0$: Der Punkt liegt auf der $y$-Achse.',
     r'$y = -3$: 3 nach unten.',
     r'Das ist C.'],
    fig=fig_k, figcap=cap_k)

Q.q(r'Welche Koordinaten hat der Punkt D?',
    [r'$D(-2 \mid -4)$', r'$D(-4 \mid -2)$', r'$D(2 \mid -4)$', r'$D(-2 \mid 4)$'],
    [r'2 nach links: $x = -2$.',
     r'4 nach unten: $y = -4$.',
     r'$D(-2 \mid -4)$ im III. Quadranten.'],
    fig=fig_k, figcap=cap_k)

Q.q(r'In welchem Quadranten liegt der Punkt $P(-2 \mid -5)$?',
    [r'im III. Quadranten', r'im II. Quadranten', r'im IV. Quadranten', r'im I. Quadranten'],
    [r'Beide Koordinaten sind negativ.',
     r'Links unten.',
     r'Das ist der III. Quadrant.'])

Q.q(r'Welcher Punkt liegt auf der $x$-Achse?',
    [r'$(3 \mid 0)$', r'$(0 \mid 3)$', r'$(3 \mid 3)$', r'$(-3 \mid 1)$'],
    [r'Auf der $x$-Achse geht man nicht nach oben oder unten.',
     r'Die $y$-Koordinate ist 0.',
     r'$(3 \mid 0)$'])

Q.q(r'Was gilt für alle Punkte im II. Quadranten?',
    [r'$x$ ist negativ, $y$ ist positiv.', r'$x$ und $y$ sind positiv.', r'$x$ ist positiv, $y$ ist negativ.', r'$x$ und $y$ sind negativ.'],
    [r'Der II. Quadrant liegt links oben.',
     r'Links heißt $x < 0$, oben heißt $y > 0$.',
     r'Beispiel: $(-3 \mid 4)$.'])

Q.q(r'Der Punkt $(2 \mid 3)$ wird an der $y$-Achse gespiegelt. Welchen Bildpunkt erhält man?',
    [r'$(-2 \mid 3)$', r'$(2 \mid -3)$', r'$(-2 \mid -3)$', r'$(3 \mid 2)$'],
    [r'Bei der Spiegelung an der $y$-Achse bleibt die Höhe gleich.',
     r'Links und rechts werden vertauscht: $x$ wird zur Gegenzahl.',
     r'$(-2 \mid 3)$'])

Q.q(r'Der Punkt $(-1 \mid 4)$ wird am Ursprung gespiegelt. Welchen Bildpunkt erhält man?',
    [r'$(1 \mid -4)$', r'$(-1 \mid -4)$', r'$(1 \mid 4)$', r'$(4 \mid -1)$'],
    [r'Bei der Spiegelung am Ursprung werden beide Koordinaten zu Gegenzahlen.',
     r'$-1 \to 1$, $4 \to -4$',
     r'$(1 \mid -4)$'])

Q.q(r'$A(-2 \mid -1)$, $B(3 \mid -1)$ und $C(3 \mid 2)$ sind Ecken eines Rechtecks ABCD. Wo liegt D?',
    [r'$D(-2 \mid 2)$', r'$D(2 \mid -2)$', r'$D(-3 \mid 2)$', r'$D(3 \mid -2)$'],
    [r'D liegt senkrecht über A, also $x = -2$.',
     r'D liegt auf derselben Höhe wie C, also $y = 2$.',
     r'$D(-2 \mid 2)$'],
    fig=koordinaten([(-2, -1, 'A'), (3, -1, 'B'), (3, 2, 'C')], label='drei Ecken eines Rechtecks'),
    figcap=r'Drei Ecken des Rechtecks ABCD')

Q.q(r'Wie weit sind die Punkte $(-4 \mid 1)$ und $(2 \mid 1)$ voneinander entfernt (1 Einheit = 1 cm)?',
    [r'6 cm', r'2 cm', r'−6 cm', r'3 cm'],
    [r'Beide liegen auf derselben Höhe $y = 1$.',
     r'Abstand der $x$-Werte: von −4 bis 2.',
     r'$2 - (-4) = 6$ cm'])

Q.q(r'Welcher Punkt liegt genau in der Mitte zwischen $(-3 \mid 0)$ und $(5 \mid 0)$?',
    [r'$(1 \mid 0)$', r'$(4 \mid 0)$', r'$(2 \mid 0)$', r'$(-1 \mid 0)$'],
    [r'Abstand: $5 - (-3) = 8$.',
     r'Die Hälfte: 4 Schritte von −3 aus.',
     r'$-3 + 4 = 1$, also $(1 \mid 0)$.'])

Q.q(r'Das Dreieck mit $A(1 \mid 1)$, $B(4 \mid 1)$ und $C(1 \mid 3)$ wird an der $x$-Achse gespiegelt. Wohin kommt C?',
    [r'$C^\prime(1 \mid -3)$', r'$C^\prime(-1 \mid 3)$', r'$C^\prime(-1 \mid -3)$', r'$C^\prime(3 \mid 1)$'],
    [r'An der $x$-Achse bleibt $x$ gleich.',
     r'$y$ wird zur Gegenzahl: $3 \to -3$.',
     r'$C^\prime(1 \mid -3)$ im IV. Quadranten.'])


def check():
    assert quadrant(4, -1) == 'IV' and quadrant(-2, -5) == 'III' and quadrant(-3, 4) == 'II' and quadrant(-2, -4) == 'III'
    assert F(-5, 2) == F('-2.5') and F(1, 3) * 3 == 1 and 3 - 5 == -2
    mirror_y = lambda x, y: (-x, y)
    mirror_o = lambda x, y: (-x, -y)
    mirror_x = lambda x, y: (x, -y)
    assert mirror_y(2, 3) == (-2, 3) and mirror_o(-1, 4) == (1, -4) and mirror_x(1, 3) == (1, -3)
    A, B, C = (-2, -1), (3, -1), (3, 2)
    D = (A[0] + C[0] - B[0], A[1] + C[1] - B[1])
    assert D == (-2, 2)
    assert 2 - (-4) == 6 and (-3 + 5) / 2 == 1
    assert dict(((n, (x, y)) for x, y, n in PTS))['C'] == (0, -3)


Q.verify(check)
Q.save()
