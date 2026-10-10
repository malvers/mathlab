#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 21 / KW 4 (LB 3): solving equations
a * x + b = c * x + d by equivalent transformations (balance model), proportions,
rearranging formulas, word problems. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=21, slug='gleichungen-loesen', thema='Gleichungen lösen und Formeln umstellen', lb='LB 3',
        blurb='Waage-Modell, a · x + b = c · x + d, Verhältnisgleichungen, Formeln umstellen, Sachaufgaben',
        comment='Blocks: solving (1-8, 17-19), proportions (9-10), formulas (11-13, 20), word problems (14-16).')


def solve(a, b, c, d):
    """Solution of a*x + b = c*x + d (a != c)."""
    return F(d - b, a - c)


# ------------------------------------------------------------------------ solving ----
Q.q(r'Löse: $2x + 3 = 11$',
    [r'$x = 4$', r'$x = 7$', r'$x = 5{,}5$', r'$x = 16$'],
    [r'Auf beiden Seiten 3 subtrahieren: $2x = 8$',
     r'Auf beiden Seiten durch 2 teilen.',
     r'$x = 4$. Probe: $2 \cdot 4 + 3 = 11$ ✓'])

Q.q(r'Löse: $5x - 7 = -22$',
    [r'$x = -3$', r'$x = 3$', r'$x = -5{,}8$', r'$x = -29$'],
    [r'Auf beiden Seiten 7 addieren: $5x = -15$',
     r'Durch 5 teilen.',
     r'$x = -3$'])

Q.q(r'Löse: $3x + 4 = x + 10$',
    [r'$x = 3$', r'$x = 7$', r'$x = 1{,}5$', r'$x = 14$'],
    [r'Auf beiden Seiten $x$ subtrahieren: $2x + 4 = 10$',
     r'Auf beiden Seiten 4 subtrahieren: $2x = 6$',
     r'$x = 3$. Probe: $13 = 13$ ✓'])

Q.q(r'Löse: $7x - 5 = 4x + 13$',
    [r'$x = 6$', r'$x = 8$', r'$x = 2$', r'$x = 18$'],
    [r'$-4x$: $3x - 5 = 13$',
     r'$+5$: $3x = 18$',
     r'$x = 6$'])

Q.q(r'Löse: $-2x + 9 = 3x - 6$',
    [r'$x = 3$', r'$x = -3$', r'$x = 15$', r'$x = 0{,}6$'],
    [r'$+2x$: $9 = 5x - 6$',
     r'$+6$: $15 = 5x$',
     r'$x = 3$'])

Q.q(r'Löse: $4 \cdot (x - 2) = 2x + 6$',
    [r'$x = 7$', r'$x = 4$', r'$x = 2$', r'$x = 1$'],
    [r'Klammer auflösen: $4x - 8 = 2x + 6$',
     r'$-2x$ und $+8$: $2x = 14$',
     r'$x = 7$'])

Q.q(r'Was darf man beim Lösen einer Gleichung tun, damit die Lösung gleich bleibt?',
    [r'auf beiden Seiten dasselbe addieren, subtrahieren, multiplizieren oder durch dieselbe Zahl (nicht 0) teilen',
     r'nur auf der linken Seite etwas verändern', r'beide Seiten vertauschen und das Vorzeichen ändern',
     r'auf beiden Seiten verschiedene Zahlen addieren'],
    [r'Denke an eine Waage im Gleichgewicht.',
     r'Was man links tut, muss man auch rechts tun.',
     r'Solche Umformungen heißen Äquivalenzumformungen.'])

Q.q(r'Was ist ein sinnvoller erster Schritt bei $3x + 4 = x + 10$?',
    [r'auf beiden Seiten $x$ subtrahieren', r'auf beiden Seiten 3 subtrahieren', r'nur links durch 3 teilen', r'$x$ und 10 vertauschen'],
    [r'Ziel: Alle $x$ auf eine Seite, alle Zahlen auf die andere.',
     r'$-x$ auf beiden Seiten ergibt $2x + 4 = 10$.',
     r'Danach $-4$ und $: 2$.'])

Q.q(r'Löse: $\dfrac{x}{2} + 3 = 7$',
    [r'$x = 8$', r'$x = 2$', r'$x = 20$', r'$x = 5$'],
    [r'$-3$: $\dfrac{x}{2} = 4$',
     r'$\cdot 2$: $x = 8$',
     r'Probe: $4 + 3 = 7$ ✓'])

Q.q(r'Lisa erhält für $5x - 3 = 2x + 3$ die Lösung $x = 2$. Stimmt das?',
    [r'Ja, beide Seiten ergeben 7.', r'Nein, richtig ist $x = 0$.', r'Nein, richtig ist $x = -2$.', r'Man kann es nicht prüfen.'],
    [r'Probe durch Einsetzen.',
     r'Links: $5 \cdot 2 - 3 = 7$, rechts: $2 \cdot 2 + 3 = 7$.',
     r'Beide Seiten gleich: $x = 2$ stimmt.'])

Q.q(r'Welche Lösung hat $x + 2 = x + 5$?',
    [r'keine Lösung', r'$x = 3$', r'$x = 0$', r'jede Zahl'],
    [r'$-x$ auf beiden Seiten: $2 = 5$',
     r'Das ist eine falsche Aussage, egal was $x$ ist.',
     r'Die Gleichung hat keine Lösung: $L = \{\ \}$.'])

# -------------------------------------------------------------------- proportions ----
Q.q(r'Löse die Verhältnisgleichung $x : 6 = 5 : 3$.',
    [r'$x = 10$', r'$x = 2{,}5$', r'$x = 8$', r'$x = 90$'],
    [r'$\dfrac{x}{6} = \dfrac{5}{3}$',
     r'Mit 6 malnehmen: $x = \dfrac{5 \cdot 6}{3}$',
     r'$x = 10$'])

Q.q(r'Löse: $\dfrac{4}{x} = \dfrac{2}{7}$',
    [r'$x = 14$', r'$x = 3{,}5$', r'$x = 8$', r'$x = 1$'],
    [r'Kehrwerte: $\dfrac{x}{4} = \dfrac{7}{2}$',
     r'$x = 4 \cdot \dfrac{7}{2}$',
     r'$x = 14$'])

# ----------------------------------------------------------------------- formulas ----
Q.q(r'Stelle die Formel $A = a \cdot b$ nach $b$ um.',
    [r'$b = \dfrac{A}{a}$', r'$b = A \cdot a$', r'$b = A - a$', r'$b = \dfrac{a}{A}$'],
    [r'$b$ wird mit $a$ malgenommen.',
     r'Umkehrung: durch $a$ teilen.',
     r'$b = A : a$'])

Q.q(r'Stelle die Umfangsformel $u = 2a + 2b$ nach $a$ um.',
    [r'$a = \dfrac{u - 2b}{2}$', r'$a = u - 2b$', r'$a = \dfrac{u}{2} - 2b$', r'$a = 2u - b$'],
    [r'$-2b$: $u - 2b = 2a$',
     r'$: 2$',
     r'$a = \dfrac{u - 2b}{2}$'])

Q.q(r'Stelle $V = G \cdot h$ nach $h$ um.',
    [r'$h = \dfrac{V}{G}$', r'$h = V \cdot G$', r'$h = V - G$', r'$h = \dfrac{G}{V}$'],
    [r'$h$ wird mit $G$ malgenommen.',
     r'Durch $G$ teilen.',
     r'$h = V : G$'])

Q.q(r'Für den Weg gilt $s = v \cdot t$. Wie lange braucht man für 150 km bei 60 km/h?',
    [r'2,5 h', r'90 h', r'0,4 h', r'2 h'],
    [r'Umstellen: $t = \dfrac{s}{v}$',
     r'$t = 150 : 60$',
     r'$= 2{,}5$ h, also 2 Stunden 30 Minuten.'])

# ------------------------------------------------------------------- word problems ----
Q.q(r'Eine Taxifahrt kostet 3 € Grundgebühr und 2 € pro Kilometer. Jana bezahlt 19 €. Wie weit ist sie gefahren?',
    [r'8 km', r'9,5 km', r'11 km', r'6 km'],
    [r'Gleichung: $2x + 3 = 19$',
     r'$2x = 16$',
     r'$x = 8$ km'])

Q.q(r'Tarif A: 10 € im Monat plus 0,10 € pro Minute. Tarif B: 0,30 € pro Minute. Bei wie vielen Minuten kosten beide gleich viel?',
    [r'bei 50 Minuten', r'bei 25 Minuten', r'bei 100 Minuten', r'bei 33 Minuten'],
    [r'Gleichung: $10 + 0{,}1x = 0{,}3x$',
     r'$-0{,}1x$: $10 = 0{,}2x$',
     r'$x = 50$ Minuten – dann kosten beide 15 €.'])

Q.q(r'Tom ist 4 Jahre älter als Lea. Zusammen sind sie 30 Jahre alt. Wie alt ist Lea?',
    [r'13 Jahre', r'17 Jahre', r'15 Jahre', r'26 Jahre'],
    [r'Lea: $x$, Tom: $x + 4$',
     r'$x + x + 4 = 30$, also $2x = 26$',
     r'$x = 13$: Lea ist 13, Tom 17.'])


def check():
    assert solve(2, 3, 0, 11) == 4 and solve(5, -7, 0, -22) == -3 and solve(3, 4, 1, 10) == 3
    assert solve(7, -5, 4, 13) == 6 and solve(-2, 9, 3, -6) == 3 and solve(4, -8, 2, 6) == 7
    assert solve(F(1, 2), 3, 0, 7) == 8 and solve(5, -3, 2, 3) == 2
    assert F(5, 3) * 6 == 10 and 4 * F(7, 2) == 14
    assert D(150) / 60 == D('2.5')
    assert solve(2, 3, 0, 19) == 8 and solve(F(1, 10), 10, F(3, 10), 0) == 50 and 10 + F(1, 10) * 50 == 15
    assert solve(2, 4, 0, 30) == 13


Q.verify(check)
Q.save()
