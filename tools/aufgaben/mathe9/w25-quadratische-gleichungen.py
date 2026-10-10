#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 25 / KW 10 (LB 3): quadratische Gleichungen
inhaltlich lösen - x² = c, Satz vom Nullprodukt, Ausklammern. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=25, slug='quadratische-gleichungen', thema='Quadratische Gleichungen inhaltlich lösen', lb='LB 3',
        blurb='x² = c, Produkt gleich null, Ausklammern, Eindeutigkeit des Wurzelziehens',
        comment='Blocks: pure quadratic equations (1-4, 8, 10, 16-17), zero product (5-6, 11, 15, 19), factoring (7, 12), squares of brackets (9), context and errors (13-14, 18, 20). Examples 2 and 5 are the Lehrplan examples.')

# -------------------------------------------------- reinquadratisch ----
Q.q(r'Löse: $x^2 = 49$',
    [r'$x = 7$ oder $x = -7$', r'nur $x = 7$', r'$x = 24{,}5$', r'keine Lösung'],
    [r'Zwei Zahlen haben das Quadrat 49: 7 und −7.'])

Q.q(r'Löse: $x^2 - 169 = 0$',
    [r'$x = 13$ oder $x = -13$', r'nur $x = 13$', r'$x = 169$', r'$x = 84{,}5$'],
    [r'$x^2 = 169$',
     r'$x = \pm 13$'])

Q.q(r'Löse: $x^2 = -4$',
    [r'Es gibt keine Lösung.', r'$x = -2$', r'$x = 2$ oder $x = -2$', r'$x = -16$'],
    [r'Ein Quadrat ist nie negativ.',
     r'Auch $(-2)^2 = 4$, nicht $-4$.'])

Q.q(r'Löse: $x^2 = 0$',
    [r'nur $x = 0$', r'$x = 0$ oder $x = 1$', r'keine Lösung', r'jede Zahl'],
    [r'Nur $0 \cdot 0 = 0$.'])

# ------------------------------------------------------- Nullprodukt ----
Q.q(r'Löse: $(x - 3) \cdot (x + 2) = 0$',
    [r'$x = 3$ oder $x = -2$', r'$x = -3$ oder $x = 2$', r'$x = 6$', r'nur $x = 3$'],
    [r'Ein Produkt ist null, wenn einer der Faktoren null ist.',
     r'$x - 3 = 0$ oder $x + 2 = 0$'])

Q.q(r'Löse: $x \cdot (x - 5) = 0$',
    [r'$x = 0$ oder $x = 5$', r'nur $x = 5$', r'$x = -5$', r'$x = 0$ oder $x = -5$'],
    [r'Erster Faktor $x = 0$ oder zweiter Faktor $x - 5 = 0$.'])

Q.q(r'Löse: $x^2 - 5x = 0$',
    [r'$x = 0$ oder $x = 5$', r'nur $x = 5$', r'$x = \pm\sqrt{5}$', r'$x = 0$ oder $x = -5$'],
    [r'$x$ ausklammern: $x \cdot (x - 5) = 0$',
     r'Wer durch $x$ teilt, verliert die Lösung $x = 0$.'])

Q.q(r'Löse: $2x^2 = 50$',
    [r'$x = 5$ oder $x = -5$', r'$x = 25$', r'$x = \pm 10$', r'nur $x = 5$'],
    [r'$x^2 = 25$',
     r'$x = \pm 5$'])

Q.q(r'Löse: $(x - 4)^2 = 9$',
    [r'$x = 7$ oder $x = 1$', r'$x = 7$ oder $x = -7$', r'$x = 13$', r'$x = 4 \pm 9$'],
    [r'$x - 4 = 3$ oder $x - 4 = -3$',
     r'$x = 7$ oder $x = 1$'])

Q.q(r'Löse: $3x^2 - 27 = 0$',
    [r'$x = 3$ oder $x = -3$', r'$x = 9$', r'$x = \pm 9$', r'keine Lösung'],
    [r'$3x^2 = 27$, $x^2 = 9$',
     r'$x = \pm 3$'])

Q.q(r'Was besagt der Satz vom Nullprodukt?',
    [r'Ein Produkt ist genau dann null, wenn mindestens ein Faktor null ist.', r'Jedes Produkt ist null.',
     r'Ein Produkt ist null, wenn beide Faktoren gleich sind.', r'Eine Summe ist null, wenn ein Summand null ist.'],
    [r'Deshalb zerlegt man quadratische Terme gern in Faktoren.'])

Q.q(r'Löse: $x^2 + 7x = 0$',
    [r'$x = 0$ oder $x = -7$', r'$x = 0$ oder $x = 7$', r'nur $x = -7$', r'$x = \pm\sqrt{7}$'],
    [r'$x \cdot (x + 7) = 0$',
     r'$x = 0$ oder $x = -7$'])

Q.q(r'Ein Quadrat hat den Flächeninhalt 64 cm². Wie lang ist seine Seite?',
    [r'8 cm', r'−8 cm oder 8 cm', r'32 cm', r'16 cm'],
    [r'$a^2 = 64$ hat die Lösungen $\pm 8$.',
     r'Eine Länge ist positiv: $a = 8$ cm.'])

Q.q(r'Max löst $x^2 = 25$ und schreibt nur $x = 5$. Was fehlt?',
    [r'die Lösung $x = -5$', r'nichts', r'die Lösung $x = 0$', r'die Lösung $x = 25$'],
    [r'$(-5)^2 = 25$ ist ebenfalls richtig.',
     r'$\sqrt{25} = 5$ ist eindeutig, die Gleichung $x^2 = 25$ hat aber zwei Lösungen.'])

Q.q(r'Löse: $(2x - 6) \cdot (x + 1) = 0$',
    [r'$x = 3$ oder $x = -1$', r'$x = 6$ oder $x = -1$', r'$x = -3$ oder $x = 1$', r'$x = 2$ oder $x = -1$'],
    [r'$2x - 6 = 0$ ergibt $x = 3$.',
     r'$x + 1 = 0$ ergibt $x = -1$.'])

Q.q(r'Löse: $x^2 = 2$ (gerundet).',
    [r'$x \approx 1{,}41$ oder $x \approx -1{,}41$', r'$x = 1$', r'$x = \pm 4$', r'nur $x \approx 1{,}41$'],
    [r'$x = \pm\sqrt{2} \approx \pm 1{,}41$'])

Q.q(r'Löse: $4x^2 = 9$',
    [r'$x = 1{,}5$ oder $x = -1{,}5$', r'$x = 2{,}25$', r'$x = \pm 4{,}5$', r'$x = \pm 3$'],
    [r'$x^2 = \dfrac{9}{4}$',
     r'$x = \pm\dfrac{3}{2} = \pm 1{,}5$'])

Q.q(r'Ein Stein fällt nach $s = 5t^2$ (in m, $t$ in s). Wann hat er 45 m zurückgelegt?',
    [r'nach 3 s', r'nach 9 s', r'nach 4,5 s', r'nach 225 s'],
    [r'$5t^2 = 45$, $t^2 = 9$',
     r'$t = 3$ s (die negative Lösung entfällt).'])

Q.q(r'Für welche Zahlen gilt $x^2 = x + 12$? Hinweis: $x^2 - x - 12 = (x - 4) \cdot (x + 3)$.',
    [r'$x = 4$ oder $x = -3$', r'$x = -4$ oder $x = 3$', r'$x = 12$', r'$x = 4$ oder $x = 3$'],
    [r'$x^2 - x - 12 = 0$, also $(x - 4)(x + 3) = 0$.',
     r'Probe: $16 = 4 + 12$ und $9 = -3 + 12$.'])

Q.q(r'Ein Kreis hat den Flächeninhalt 50 cm². Wie groß ist sein Radius (gerundet)?',
    [r'3,99 cm', r'15,92 cm', r'7,07 cm', r'25 cm'],
    [r'$\pi r^2 = 50$, $r^2 = \dfrac{50}{\pi} \approx 15{,}92$',
     r'$r = \sqrt{15{,}92} \approx 3{,}99$ cm'])


def check():
    import sympy as sp
    from math import pi, sqrt
    x = sp.symbols('x')
    s = lambda e: sorted(sp.solve(e, x))
    assert s(x**2 - 49) == [-7, 7] and s(x**2 - 169) == [-13, 13] and sp.solve(x**2 + 4, x) == [-2*sp.I, 2*sp.I]
    assert s(x**2) == [0] and s((x - 3)*(x + 2)) == [-2, 3] and s(x*(x - 5)) == [0, 5] and s(x**2 - 5*x) == [0, 5]
    assert s(2*x**2 - 50) == [-5, 5] and s((x - 4)**2 - 9) == [1, 7] and s(3*x**2 - 27) == [-3, 3]
    assert s(x**2 + 7*x) == [-7, 0] and s((2*x - 6)*(x + 1)) == [-1, 3]
    assert round(sqrt(2), 2) == 1.41 and s(4*x**2 - 9) == [sp.Rational(-3, 2), sp.Rational(3, 2)]
    assert s(5*x**2 - 45) == [-3, 3] and s(x**2 - x - 12) == [-3, 4] and sp.expand((x - 4)*(x + 3)) == x**2 - x - 12
    assert round(sqrt(50 / pi), 2) == 3.99


Q.verify(check)
Q.save()
