#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 5 / KW 38 (LB 1): linear approximation, secant and tangent, average and local rate
of change - 15 questions of the Grundkurs sheet, 5 on linear approximation. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=5, slug='aenderungsraten', thema='Lineare Approximation und Änderungsraten', lb='LB 1',
           blurb='Tangente als beste lineare Näherung, Sekante, mittlere und lokale Änderungsrate',
           comment='Questions 1-15 from the Grundkurs sheet (mathegy11/w04), 16-20 linear approximation.')

qs, check_gk = harvest('w04-aenderungsraten.py', [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 18])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------- linear approximation ----
Q.q(r'Die Tangente an $f(x) = \sqrt{x}$ bei $x_0 = 4$ ist $t(x) = 2 + \tfrac{1}{4}(x - 4)$. Welchen Näherungswert liefert sie für $\sqrt{4{,}1}$?',
    [r'2,025', r'2,1', r'2,25', r'2,0025'],
    [r'$t(4{,}1) = 2 + \tfrac{1}{4} \cdot 0{,}1 = 2{,}025$.',
     r'Genau ist $\sqrt{4{,}1} \approx 2{,}024\,85$: Nahe bei $x_0$ ist die Tangente eine sehr gute Näherung.'])

Q.q(r'Nahe bei 0 wird $e^x$ durch die Tangente $1 + x$ ersetzt. Wie groß ist der Fehler bei $x = 0{,}1$ ungefähr?',
    [r'etwa 0,005', r'etwa 0,1', r'etwa 0,05', r'0'],
    [r'Näherung: $1 + 0{,}1 = 1{,}1$.',
     r'Genau: $e^{0{,}1} \approx 1{,}105\,17$.',
     r'Fehler $\approx 0{,}005$: Er wächst mit dem Abstand zu $x_0$.'])

Q.q(r'Mit der Näherung $(1 + x)^n \approx 1 + n x$ für kleine $x$: Wie groß ist etwa $1{,}01^{10}$?',
    [r'etwa 1,1', r'etwa 1,01', r'etwa 10,1', r'etwa 2'],
    [r'$x = 0{,}01$, $n = 10$: $1 + 10 \cdot 0{,}01 = 1{,}1$.',
     r'Genau: $1{,}01^{10} \approx 1{,}1046$. Das ist die Tangente an $(1 + x)^{10}$ bei 0.'])

Q.q(r'In der Physik ersetzt man beim Pendel $\sin x$ für kleine Winkel (Bogenmaß) durch $x$. Warum ist das sinnvoll?',
    [r'$y = x$ ist die Tangente an die Sinuskurve im Ursprung.', r'Weil $\sin x = x$ für alle $x$ gilt.',
     r'Weil die Sinuskurve eine Gerade ist.', r'Weil $\sin 0 = 1$ ist.'],
    [r'$\sin 0 = 0$ und der Anstieg bei 0 ist $\cos 0 = 1$: Tangente $y = x$.',
     r'Für $x = 0{,}1$: $\sin 0{,}1 \approx 0{,}0998$, also fast gleich.'])

Q.q(r'Welche Gerade nähert $f(x) = x^2$ in der Nähe von $x_0 = 3$ am besten an?',
    [r'die Tangente $y = 6x - 9$', r'die Sekante durch $(2 \mid 4)$ und $(4 \mid 16)$: $y = 6x - 8$', r'die waagerechte Gerade $y = 9$', r'die Gerade $y = 3x$'],
    [r'Nur die Tangente stimmt in Funktionswert und Anstieg bei $x_0$ überein.',
     r'$f(3) = 9$, $f^{\prime}(3) = 6$: $t(x) = 6(x - 3) + 9 = 6x - 9$.',
     r'Die Sekante hat zwar denselben Anstieg, liegt aber um 1 zu hoch.'])


def check():
    import math
    check_gk()
    assert abs(2 + 0.1 / 4 - 2.025) < 1e-12 and abs(math.sqrt(4.1) - 2.02485) < 1e-5
    assert abs(math.exp(0.1) - 1.10517) < 1e-5 and abs(math.exp(0.1) - 1.1 - 0.005) < 0.001
    assert abs(1.01 ** 10 - 1.1046) < 1e-4
    assert abs(math.sin(0.1) - 0.0998) < 1e-4
    assert (16 - 4) / (4 - 2) == 6 and 16 - 6 * 4 == -8 and 9 - 6 * 3 == -9


Q.verify(check)
Q.save()
