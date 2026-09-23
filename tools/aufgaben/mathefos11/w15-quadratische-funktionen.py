#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 15 / KW 50 (LB 1): quadratische Funktionen -
Eigenschaften, Scheitelpunktform, Normalform, Graphen und Anwendungen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=15, slug='quadratische-funktionen', thema='Quadratische Funktionen', lb='LB 1',
          blurb='Normalparabel, Verschiebung und Streckung, Scheitelpunktform, Normalform, Anwendungen',
          comment='Blocks: Normalparabel und Parameter (1-6), Scheitelpunktform (7-12), Normalform und Scheitel (13-16), Anwendungen (17-20).')

# ----------------------------------------------- Normalparabel und Parameter ----
Q.q(r'Wo liegt der Scheitelpunkt der Normalparabel $y = x^2$?',
    [r'in $(0|0)$', r'in $(1|1)$', r'in $(0|1)$', r'sie hat keinen Scheitelpunkt'],
    [r'Der kleinste Funktionswert ist $0$, angenommen bei $x = 0$.',
     r'Also liegt der Scheitel im Ursprung $(0|0)$.',
     r'Die Parabel ist zur $y$-Achse symmetrisch.'])

Q.q(r'Wie entsteht der Graph von $y = x^2 + 3$ aus der Normalparabel?',
    [r'durch Verschiebung um $3$ nach oben', r'durch Verschiebung um $3$ nach rechts',
     r'durch Verschiebung um $3$ nach links', r'durch Streckung um den Faktor $3$'],
    [r'Die $3$ wird zum Funktionswert addiert.',
     r'Jeder Punkt wandert um $3$ nach oben, der Scheitel liegt in $(0|3)$.',
     r'Eine Verschiebung nach rechts entstünde durch $(x-3)^2$.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = (x - 2)^2$?',
    [r'in $(2|0)$', r'in $(-2|0)$', r'in $(0|2)$', r'in $(0|-2)$'],
    [r'Der kleinste Wert ist $0$, er tritt ein, wenn die Klammer null wird.',
     r'$x - 2 = 0$ ergibt $x = 2$.',
     r'Scheitel $(2|0)$ — das Minus in der Klammer verschiebt nach rechts.'])

Q.q(r'Wie verläuft der Graph von $y = -x^2$?',
    [r'nach unten geöffnet, Scheitel in $(0|0)$', r'nach oben geöffnet, Scheitel in $(0|0)$',
     r'nach unten geöffnet, Scheitel in $(0|-1)$', r'wie die Normalparabel, nur nach links verschoben'],
    [r'Das Minus spiegelt die Normalparabel an der $x$-Achse.',
     r'Sie ist also nach unten geöffnet.',
     r'Der Scheitel bleibt im Ursprung, ist jetzt aber der größte Wert.'])

Q.q(r'Wie unterscheidet sich der Graph von $y = 2x^2$ von der Normalparabel?',
    [r'Er ist schmaler, also gestreckt.', r'Er ist breiter, also gestaucht.',
     r'Er ist um $2$ nach oben verschoben.', r'Er ist nach unten geöffnet.'],
    [r'Jeder Funktionswert wird verdoppelt.',
     r'Die Parabel steigt doppelt so schnell an und wirkt dadurch schmaler.',
     r'Probe: bei $x = 1$ liegt der Punkt bei $y = 2$ statt bei $y = 1$.'])

Q.q(r'Wie unterscheidet sich der Graph von $y = 0{,}5x^2$ von der Normalparabel?',
    [r'Er ist breiter, also gestaucht.', r'Er ist schmaler, also gestreckt.',
     r'Er ist um $0{,}5$ nach unten verschoben.', r'Er ist nach unten geöffnet.'],
    [r'Bei $\left|a\right| < 1$ werden alle Funktionswerte kleiner.',
     r'Die Parabel öffnet sich weiter.',
     r'Probe: bei $x = 2$ liegt der Punkt bei $y = 2$ statt bei $y = 4$.'])

# --------------------------------------------------------- Scheitelpunktform ----
Q.q(r'Wo liegt der Scheitelpunkt von $y = (x - 3)^2 + 1$?',
    [r'in $(3|1)$', r'in $(-3|1)$', r'in $(3|-1)$', r'in $(1|3)$'],
    [r'Scheitelpunktform $y = a\,(x - x_S)^2 + y_S$.',
     r'Hier $x_S = 3$ und $y_S = 1$.',
     r'Das Vorzeichen in der Klammer kehrt sich um: $(x-3)$ bedeutet $x_S = 3$.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = (x + 2)^2 - 5$?',
    [r'in $(-2|-5)$', r'in $(2|-5)$', r'in $(-2|5)$', r'in $(2|5)$'],
    [r'$(x+2)$ lässt sich als $\left(x - (-2)\right)$ lesen.',
     r'Also $x_S = -2$ und $y_S = -5$.',
     r'Probe: $y(-2) = 0 - 5 = -5$.'])

Q.q(r'Wie lautet die Scheitelpunktform einer nach oben geöffneten Normalparabel mit dem Scheitel $S(1|-4)$?',
    [r'$y = (x - 1)^2 - 4$', r'$y = (x + 1)^2 - 4$', r'$y = (x - 1)^2 + 4$', r'$y = (x - 4)^2 + 1$'],
    [r'Einsetzen in $y = (x - x_S)^2 + y_S$.',
     r'$y = (x - 1)^2 - 4$',
     r'Probe: $y(1) = -4$ stimmt.'])

Q.q(r'Was bedeutet $a < 0$ in $y = a\,(x - x_S)^2 + y_S$?',
    [r'Die Parabel ist nach unten geöffnet, der Scheitel ist ihr höchster Punkt.',
     r'Die Parabel ist nach oben geöffnet.',
     r'Der Scheitel liegt unterhalb der $x$-Achse.',
     r'Die Parabel ist gestaucht.'],
    [r'Das Vorzeichen von $a$ entscheidet über die Öffnungsrichtung.',
     r'Bei $a < 0$ öffnet sie nach unten.',
     r'Dann ist der Scheitelwert das Maximum der Funktion, nicht das Minimum.'])

Q.q(r'Beschreibe den Graphen von $y = 2\,(x - 1)^2 + 3$.',
    [r'nach oben geöffnet, gestreckt, Scheitel in $(1|3)$',
     r'nach unten geöffnet, Scheitel in $(1|3)$',
     r'nach oben geöffnet, gestaucht, Scheitel in $(-1|3)$',
     r'nach oben geöffnet, Scheitel in $(3|1)$'],
    [r'$a = 2 > 0$: nach oben geöffnet und gestreckt.',
     r'$x_S = 1$ und $y_S = 3$.',
     r'Kleinster Funktionswert ist $3$, angenommen bei $x = 1$.'])

Q.q(r'Welchen kleinsten Wert nimmt $y = 3\,(x + 4)^2 - 7$ an?',
    [r'$-7$', r'$-4$', r'$3$', r'$7$'],
    [r'Das Quadrat ist nie negativ, der kleinste Wert der Klammer ist also $0$.',
     r'Das tritt bei $x = -4$ ein.',
     r'Dann bleibt $y = -7$ übrig.'])

# ----------------------------------------------- Normalform und Scheitel ----
Q.q(r'Wo liegt der Scheitelpunkt von $y = x^2 - 6x + 5$?',
    [r'in $(3|-4)$', r'in $(-3|-4)$', r'in $(3|4)$', r'in $(6|5)$'],
    [r'Quadratische Ergänzung: $x^2 - 6x + 9 - 9 + 5 = (x-3)^2 - 4$.',
     r'Also $x_S = 3$ und $y_S = -4$.',
     r'Probe: $y(3) = 9 - 18 + 5 = -4$.'])

Q.q(r'Wie lauten die Nullstellen von $y = x^2 - 6x + 5$?',
    [r'$x_1 = 1$ und $x_2 = 5$', r'$x_1 = -1$ und $x_2 = -5$',
     r'$x_1 = 2$ und $x_2 = 3$', r'$x_1 = 0$ und $x_2 = 6$'],
    [r'Nach Vieta suchen wir zwei Zahlen mit der Summe $6$ und dem Produkt $5$.',
     r'Das sind $1$ und $5$.',
     r'Probe: $1 - 6 + 5 = 0$ und $25 - 30 + 5 = 0$.'])

Q.q(r'Wo schneidet $y = x^2 - 6x + 5$ die $y$-Achse?',
    [r'in $(0|5)$', r'in $(0|-6)$', r'in $(5|0)$', r'in $(0|0)$'],
    [r'Die $y$-Achse wird bei $x = 0$ geschnitten.',
     r'$y(0) = 5$',
     r'Das Absolutglied der Normalform ist immer der $y$-Achsenabschnitt.'])

Q.q(r'Wie lautet die Symmetrieachse von $y = x^2 - 6x + 5$?',
    [r'$x = 3$', r'$x = -3$', r'$y = -4$', r'$x = 5$'],
    [r'Jede Parabel ist achsensymmetrisch zur Senkrechten durch ihren Scheitel.',
     r'Der Scheitel liegt bei $x = 3$.',
     r'Die Symmetrieachse ist also die Gerade $x = 3$. Kontrolle: $y(1) = y(5) = 0$.'])

# --------------------------------------------------------------- Anwendungen ----
Q.q(r'Ein Ball fliegt nach $h(t) = -5t^2 + 20t$ (Höhe in Metern, $t$ in Sekunden). Wann ist er am höchsten?',
    [r'nach $2$ Sekunden', r'nach $4$ Sekunden', r'nach $20$ Sekunden', r'nach $5$ Sekunden'],
    [r'Die Parabel ist nach unten geöffnet, der Scheitel ist der höchste Punkt.',
     r'Nullstellen sind $t = 0$ und $t = 4$; der Scheitel liegt genau dazwischen.',
     r'$t = 2$ Sekunden.'])

Q.q(r'Welche Höhe erreicht der Ball aus der vorigen Aufgabe höchstens?',
    [r'$20$ Meter', r'$40$ Meter', r'$15$ Meter', r'$10$ Meter'],
    [r'Scheitelwert: $h(2) = -5 \cdot 4 + 40$.',
     r'$= -20 + 40 = 20$ Meter',
     r'Nach $4$ Sekunden ist er wieder am Boden: $h(4) = -80 + 80 = 0$.'])

Q.q(r'Der Gewinn beträgt $G(x) = -2x^2 + 24x - 40$ (in €). Bei welcher Stückzahl ist er am größten?',
    [r'bei $6$ Stück', r'bei $12$ Stück', r'bei $24$ Stück', r'bei $3$ Stück'],
    [r'Scheitel einer Parabel $y = ax^2 + bx + c$: $x_S = -\dfrac{b}{2a}$.',
     r'$x_S = -\dfrac{24}{2 \cdot (-2)} = 6$',
     r'Probe: $G(6) = -72 + 144 - 40 = 32$ €, und $G(5) = 30$ € ist kleiner.'])

Q.q(r'Ein rechteckiges Beet soll mit $20\,\mathrm{m}$ Zaun eingefasst werden. Welcher Term beschreibt die Fläche in Abhängigkeit von einer Seite $x$?',
    [r'$A(x) = x\,(10 - x)$', r'$A(x) = x\,(20 - x)$', r'$A(x) = 20x$', r'$A(x) = x^2$'],
    [r'Aus $2x + 2y = 20$ folgt $y = 10 - x$.',
     r'Die Fläche ist $A = x \cdot y = x\,(10 - x)$.',
     r'Das ist eine nach unten geöffnete Parabel; ihr Scheitel bei $x = 5$ liefert die größte Fläche von $25\,\mathrm{m^2}$.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, t = sp.symbols('x t')
    assert (x ** 2).subs(x, 0) == 0
    assert (x ** 2 + 3).subs(x, 0) == 3
    assert sp.solve(x - 2, x) == [2] and ((x - 2) ** 2).subs(x, 2) == 0
    assert (2 * x ** 2).subs(x, 1) == 2 and (x ** 2).subs(x, 1) == 1
    assert (F(1, 2) * x ** 2).subs(x, 2) == 2 and (x ** 2).subs(x, 2) == 4
    # Scheitelpunktform
    assert ((x - 3) ** 2 + 1).subs(x, 3) == 1
    assert ((x + 2) ** 2 - 5).subs(x, -2) == -5
    assert ((x - 1) ** 2 - 4).subs(x, 1) == -4
    assert (2 * (x - 1) ** 2 + 3).subs(x, 1) == 3
    assert (3 * (x + 4) ** 2 - 7).subs(x, -4) == -7
    assert all((3 * (x + 4) ** 2 - 7).subs(x, v) >= -7 for v in (-10, -5, -4, 0, 5))
    # Normalform
    f = x ** 2 - 6 * x + 5
    assert sp.expand((x - 3) ** 2 - 4) == f and f.subs(x, 3) == -4
    assert sp.solve(f, x) == [1, 5] and f.subs(x, 1) == 0 and f.subs(x, 5) == 0
    assert f.subs(x, 0) == 5
    assert f.subs(x, 1) == f.subs(x, 5)
    # Anwendungen
    h = -5 * t ** 2 + 20 * t
    assert sp.solve(h, t) == [0, 4] and h.subs(t, 2) == 20 and h.subs(t, 4) == 0
    assert all(h.subs(t, v) <= 20 for v in (0, 1, 2, 3, 4))
    G = -2 * x ** 2 + 24 * x - 40
    assert -F(24, 2 * -2) == 6 and G.subs(x, 6) == 32 and G.subs(x, 5) == 30
    A = x * (10 - x)
    assert sp.expand(A) == 10 * x - x ** 2 and A.subs(x, 5) == 25
    assert 2 * 5 + 2 * 5 == 20 and all(A.subs(x, v) <= 25 for v in (1, 3, 5, 7, 9))


Q.verify(check)
Q.save()
