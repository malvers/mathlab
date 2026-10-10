#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 23 / KW 8 (LB 3): Scheitelpunktform
y = (x + d)² + e - Verschiebung, Scheitelpunkt ablesen, Gleichung aufstellen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=23, slug='scheitelpunktform', thema='Scheitelpunktform y = (x + d)² + e', lb='LB 3',
        blurb='Verschiebung in x- und y-Richtung, Scheitelpunkt ablesen, Gleichung aus dem Scheitel',
        comment='Blocks: reading the vertex (1-2, 13, 19-20), equation from vertex (3, 12), shifts (4), zeros (5-6, 14), range, values and symmetry (7-11, 16), expanding (15), throw (17-18).')

# ----------------------------------------------------------- Scheitel ablesen ----
Q.q(r'Welchen Scheitelpunkt hat $y = (x - 3)^2 + 2$?',
    [r'$S(3 \mid 2)$', r'$S(-3 \mid 2)$', r'$S(2 \mid 3)$', r'$S(3 \mid -2)$'],
    [r'In $y = (x + d)^2 + e$ ist der Scheitel $S(-d \mid e)$.',
     r'Hier ist $d = -3$, also $S(3 \mid 2)$.'])

Q.q(r'Welchen Scheitelpunkt hat $y = (x + 1)^2 - 4$?',
    [r'$S(-1 \mid -4)$', r'$S(1 \mid -4)$', r'$S(-1 \mid 4)$', r'$S(4 \mid -1)$'],
    [r'$d = 1$, $e = -4$, also $S(-1 \mid -4)$.',
     r'Probe: Für $x = -1$ ist die Klammer 0, der Wert $-4$ ist der kleinste.'])

Q.q(r'Eine verschobene Normalparabel hat den Scheitel $S(2 \mid -5)$. Wie lautet ihre Gleichung?',
    [r'$y = (x - 2)^2 - 5$', r'$y = (x + 2)^2 - 5$', r'$y = (x - 5)^2 + 2$', r'$y = x^2 + 2x - 5$'],
    [r'Die Klammer muss bei $x = 2$ null werden: $(x - 2)$.',
     r'Verschiebung nach unten um 5: $-5$.'])

Q.q(r'Wie entsteht der Graph von $y = (x + 4)^2$ aus der Normalparabel?',
    [r'Verschiebung um 4 nach links', r'Verschiebung um 4 nach rechts', r'Verschiebung um 4 nach oben', r'Streckung mit dem Faktor 4'],
    [r'Der Scheitel liegt bei $x = -4$, also links vom Ursprung.'])

Q.q(r'Hat $y = (x - 2)^2 + 1$ Nullstellen?',
    [r'Nein, der kleinste Wert ist 1.', r'Ja, $x = 2$.', r'Ja, $x = 1$ und $x = 3$.', r'Ja, $x = -2$.'],
    [r'Der Scheitel $(2 \mid 1)$ liegt über der $x$-Achse, die Parabel ist nach oben geöffnet.'])

Q.q(r'Welche Nullstellen hat $y = (x - 1)^2 - 9$?',
    [r'$x = 4$ und $x = -2$', r'$x = 10$ und $x = -8$', r'$x = 1$', r'$x = 3$ und $x = -3$'],
    [r'$(x - 1)^2 = 9$, also $x - 1 = 3$ oder $x - 1 = -3$.',
     r'$x = 4$ oder $x = -2$'])

Q.q(r'Welchen Wertebereich hat $y = (x + 3)^2 - 2$?',
    [r'alle $y \geq -2$', r'alle $y \geq 3$', r'alle $y \leq -2$', r'alle Zahlen'],
    [r'Scheitel $(-3 \mid -2)$, Parabel nach oben geöffnet.'])

Q.q(r'Berechne $f(5)$ für $f(x) = (x - 2)^2 - 4$.',
    [r'5', r'13', r'−1', r'9'],
    [r'$(5 - 2)^2 - 4 = 9 - 4 = 5$'])

Q.q(r'Welche Symmetrieachse hat $y = (x - 3)^2 + 1$?',
    [r'die Gerade $x = 3$', r'die $y$-Achse', r'die Gerade $y = 1$', r'die Gerade $x = -3$'],
    [r'Jede Parabel ist symmetrisch zur senkrechten Geraden durch ihren Scheitel.'])

Q.q(r'Wo ist $y = (x - 3)^2$ fallend?',
    [r'für $x < 3$', r'für $x > 3$', r'für $x < 0$', r'nirgends'],
    [r'Links vom Scheitel $(3 \mid 0)$ fällt eine nach oben geöffnete Parabel.'])

Q.q(r'Liegt der Punkt $(1 \mid 3)$ auf $y = (x + 1)^2 - 1$?',
    [r'Ja, denn $(1 + 1)^2 - 1 = 3$.', r'Nein, denn $(1 + 1)^2 - 1 = 1$.', r'Nein, denn $1 + 1 - 1 = 1$.', r'Ja, weil 3 größer als 1 ist.'],
    [r'$2^2 - 1 = 4 - 1 = 3$'])

Q.q(r'Die Normalparabel wird so verschoben, dass ihr Scheitel bei $(-2 \mid 3)$ liegt. Wie lautet die Gleichung?',
    [r'$y = (x + 2)^2 + 3$', r'$y = (x - 2)^2 + 3$', r'$y = (x + 3)^2 - 2$', r'$y = x^2 - 2x + 3$'],
    [r'2 nach links: $(x + 2)^2$; 3 nach oben: $+3$.'])

Q.q(r'Welchen Scheitelpunkt hat $y = -(x - 1)^2 + 4$, und ist es ein Maximum oder ein Minimum?',
    [r'$S(1 \mid 4)$, Maximum', r'$S(1 \mid 4)$, Minimum', r'$S(-1 \mid 4)$, Maximum', r'$S(1 \mid -4)$, Minimum'],
    [r'Das Minus vor der Klammer öffnet die Parabel nach unten.',
     r'Der Scheitel $(1 \mid 4)$ ist der höchste Punkt.'])

Q.q(r'Welche Nullstellen hat $y = -(x - 1)^2 + 4$?',
    [r'$x = 3$ und $x = -1$', r'$x = 5$ und $x = -3$', r'$x = 1$', r'keine'],
    [r'$(x - 1)^2 = 4$, also $x - 1 = \pm 2$.',
     r'$x = 3$ oder $x = -1$'])

Q.q(r'Multipliziere aus: $(x - 3)^2 + 2$',
    [r'$x^2 - 6x + 11$', r'$x^2 + 11$', r'$x^2 - 6x + 7$', r'$x^2 - 9 + 2$'],
    [r'Binomische Formel: $(x - 3)^2 = x^2 - 6x + 9$',
     r'$+2$: $x^2 - 6x + 11$'])

Q.q(r'Welchen kleinsten Wert hat $y = (x + 5)^2 - 7$ und wo?',
    [r'−7 bei $x = -5$', r'−5 bei $x = -7$', r'−7 bei $x = 5$', r'0 bei $x = -5$'],
    [r'Die Klammer ist bei $x = -5$ null, dann bleibt $-7$.'])

Q.q(r'Ein Ball wird geworfen, seine Höhe ist $h(t) = -(t - 2)^2 + 9$ (in m, $t$ in s). Wie hoch fliegt er höchstens?',
    [r'9 m nach 2 s', r'2 m nach 9 s', r'5 m nach 2 s', r'9 m nach 3 s'],
    [r'Scheitelpunkt $(2 \mid 9)$: Nach 2 s ist der Ball 9 m hoch, höher nicht.'])

Q.q(r'Wann landet der Ball aus der vorigen Aufgabe ($h(t) = -(t - 2)^2 + 9$) auf dem Boden?',
    [r'nach 5 s', r'nach 3 s', r'nach 9 s', r'nach 11 s'],
    [r'$h(t) = 0$: $(t - 2)^2 = 9$, also $t - 2 = \pm 3$.',
     r'$t = 5$ oder $t = -1$; nur $t = 5$ s ist sinnvoll.'])

Q.q(r'Welche Gleichung gehört zu einer Normalparabel mit dem Scheitel $(-3 \mid 0)$?',
    [r'$y = (x + 3)^2$', r'$y = (x - 3)^2$', r'$y = x^2 - 3$', r'$y = x^2 + 3$'],
    [r'Scheitel auf der $x$-Achse bei $-3$: nur Verschiebung nach links.'])

Q.q(r'Lena sagt: „$y = (x + 2)^2$ hat den Scheitel $(2 \mid 0)$.“ Was stimmt?',
    [r'Der Scheitel ist $(-2 \mid 0)$, denn die Klammer wird bei $x = -2$ null.', r'Lena hat recht.',
     r'Der Scheitel ist $(0 \mid 2)$.', r'Der Scheitel ist $(0 \mid 4)$.'],
    [r'Plus in der Klammer bedeutet Verschiebung nach links.'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    assert sorted(sp.solve((x - 1)**2 - 9, x)) == [-2, 4]
    assert (5 - 2) ** 2 - 4 == 5 and (1 + 1) ** 2 - 1 == 3
    assert sorted(sp.solve(-(x - 1)**2 + 4, x)) == [-1, 3]
    assert sp.expand((x - 3)**2 + 2) == x**2 - 6*x + 11
    assert sorted(sp.solve(-(x - 2)**2 + 9, x)) == [-1, 5]
    assert sp.solve((x - 2)**2 + 1, x) == [2 - sp.I, 2 + sp.I]


Q.verify(check)
Q.save()
