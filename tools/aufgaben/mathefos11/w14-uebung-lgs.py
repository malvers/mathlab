#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 14 / KW 49: Uebung - Gleichungssysteme und Geraden
gemischt (andere Aufgaben als in den Wochen 11 bis 13).
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=14, slug='uebung-lgs', thema='Übung: Gleichungssysteme und Geraden', lb='Übung',
          blurb='gemischte Wiederholung von Systemen, Geraden und Anwendungen',
          comment='Blocks: Gleichungssysteme (1-8), Geraden (9-14), gemischte Anwendungen (15-20).')

# -------------------------------------------------------- Gleichungssysteme ----
Q.q(r'Löse: $x + y = 9$ und $2x - y = 3$.',
    [r'$x = 4$, $y = 5$', r'$x = 5$, $y = 4$', r'$x = 3$, $y = 6$', r'$x = 4$, $y = 1$'],
    [r'Addieren: $3x = 12$, also $x = 4$.',
     r'Einsetzen: $4 + y = 9$, also $y = 5$.',
     r'Probe: $8 - 5 = 3$ stimmt.'])

Q.q(r'Löse: $3x + y = 11$ und $x - y = 1$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 4$, $y = 3$', r'$x = 3$, $y = -2$'],
    [r'Addieren: $4x = 12$, also $x = 3$.',
     r'Einsetzen: $3 - y = 1$, also $y = 2$.',
     r'Probe: $9 + 2 = 11$ stimmt.'])

Q.q(r'Löse: $2x - 3y = 0$ und $4x + 3y = 18$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 3$, $y = -2$', r'$x = 0$, $y = 6$'],
    [r'Addieren: $6x = 18$, also $x = 3$.',
     r'Einsetzen: $6 - 3y = 0$, also $y = 2$.',
     r'Probe: $12 + 6 = 18$ stimmt.'])

Q.q(r'Löse: $y = 2x$ und $x + y = 12$.',
    [r'$x = 4$, $y = 8$', r'$x = 8$, $y = 4$', r'$x = 6$, $y = 6$', r'$x = 3$, $y = 9$'],
    [r'Einsetzen: $x + 2x = 12$, also $3x = 12$.',
     r'$x = 4$ und $y = 8$.',
     r'Probe: $8 = 2 \cdot 4$ und $4 + 8 = 12$.'])

Q.q(r'Löse: $5x + 2y = 16$ und $3x - 2y = 0$.',
    [r'$x = 2$, $y = 3$', r'$x = 3$, $y = 2$', r'$x = 2$, $y = -3$', r'$x = 1$, $y = 5{,}5$'],
    [r'Addieren: $8x = 16$, also $x = 2$.',
     r'Einsetzen: $6 - 2y = 0$, also $y = 3$.',
     r'Probe: $10 + 6 = 16$ stimmt.'])

Q.q(r'Löse: $4x + 3y = 18$ und $y = x - 1$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 1$', r'$x = 4$, $y = 3$', r'$x = 3$, $y = 4$'],
    [r'Einsetzen: $4x + 3\,(x - 1) = 18$, also $7x - 3 = 18$.',
     r'$7x = 21$, also $x = 3$ und $y = 2$.',
     r'Probe: $12 + 6 = 18$ stimmt.'])

Q.q(r'Wie viele Lösungen hat $2x + 4y = 8$ und $x + 2y = 4$?',
    [r'unendlich viele', r'genau eine', r'keine', r'genau zwei'],
    [r'Die erste Gleichung ist das Doppelte der zweiten.',
     r'Beide beschreiben dieselbe Gerade.',
     r'Jeder Punkt dieser Geraden löst das System, etwa $(4|0)$ und $(0|2)$.'])

Q.q(r'Wie lautet die Lösungsmenge von $3x - 6y = 9$ und $x - 2y = 5$?',
    [r'$L = \{\}$', r'$L = \mathbb{R}$', r'$L = \{(3|1)\}$', r'$L = \{(5|0)\}$'],
    [r'Die erste Gleichung durch $3$ teilen: $x - 2y = 3$.',
     r'Zusammen mit $x - 2y = 5$ ergäbe das $3 = 5$.',
     r'Falsche Aussage, also keine Lösung: die Geraden sind parallel und verschieden.'])

# ---------------------------------------------------------------- Geraden ----
Q.q(r'Wie lautet die Gerade durch $A(1|4)$ und $B(3|8)$?',
    [r'$y = 2x + 2$', r'$y = 2x - 2$', r'$y = 4x$', r'$y = \dfrac{1}{2}x + 3{,}5$'],
    [r'$m = \dfrac{8 - 4}{3 - 1} = 2$',
     r'$A$ einsetzen: $4 = 2 + n$, also $n = 2$.',
     r'$y = 2x + 2$. Probe mit $B$: $6 + 2 = 8$.'])

Q.q(r'Berechne die Nullstelle von $y = 4x - 10$.',
    [r'$x = 2{,}5$', r'$x = -2{,}5$', r'$x = 10$', r'$x = 0{,}4$'],
    [r'$4x - 10 = 0$',
     r'$4x = 10$, also $x = 2{,}5$.',
     r'Probe: $10 - 10 = 0$.'])

Q.q(r'Wie lautet die Gerade, die parallel zu $y = \dfrac{1}{2}x - 1$ durch $P(2|3)$ verläuft?',
    [r'$y = \dfrac{1}{2}x + 2$', r'$y = \dfrac{1}{2}x - 2$', r'$y = 2x - 1$', r'$y = -2x + 7$'],
    [r'Parallel heißt $m = \dfrac{1}{2}$.',
     r'$3 = \dfrac{1}{2} \cdot 2 + n = 1 + n$, also $n = 2$.',
     r'$y = \dfrac{1}{2}x + 2$.'])

Q.q(r'Welche Gerade durch den Ursprung steht senkrecht auf $y = -3x$?',
    [r'$y = \dfrac{1}{3}x$', r'$y = -\dfrac{1}{3}x$', r'$y = 3x$', r'$y = -3x$'],
    [r'Bedingung: $m_1 \cdot m_2 = -1$, also $-3 \cdot m_2 = -1$.',
     r'$m_2 = \dfrac{1}{3}$',
     r'Durch den Ursprung bedeutet $n = 0$, also $y = \dfrac{1}{3}x$.'])

Q.q(r'Wo schneiden sich $y = -x + 6$ und $y = 2x - 3$?',
    [r'in $S(3|3)$', r'in $S(3|6)$', r'in $S(2|4)$', r'in $S(1|5)$'],
    [r'Gleichsetzen: $-x + 6 = 2x - 3$.',
     r'$9 = 3x$, also $x = 3$.',
     r'Einsetzen: $y = 3$, also $S(3|3)$.'])

Q.q(r'Welchen Neigungswinkel hat die Gerade $y = -x + 4$ gegenüber der $x$-Achse?',
    [r'$45^\circ$, sie fällt', r'$45^\circ$, sie steigt', r'$90^\circ$', r'$4^\circ$'],
    [r'$\left|m\right| = 1$, also $\tan\alpha = 1$ und $\alpha = 45^\circ$.',
     r'Das negative Vorzeichen bedeutet, dass die Gerade fällt.',
     r'Zur positiven $x$-Achse gemessen sind es $135^\circ$.'])

# ------------------------------------------------- gemischte Anwendungen ----
Q.q(r'Zwei Anbieter: A verlangt $30$ € Grundpreis und $0{,}20$ € je Einheit, B verlangt $10$ € und $0{,}60$ € je Einheit. Bei welcher Menge kosten beide gleich viel?',
    [r'bei $50$ Einheiten', r'bei $40$ Einheiten', r'bei $25$ Einheiten', r'bei $100$ Einheiten'],
    [r'Gleichsetzen: $0{,}20x + 30 = 0{,}60x + 10$.',
     r'$20 = 0{,}40x$, also $x = 50$.',
     r'Probe: beide kosten $40$ €.'])

Q.q(r'Aus Sorten zu $4$ € und $10$ € je Kilogramm sollen $12\,\mathrm{kg}$ zu $6$ € je Kilogramm gemischt werden. Wie viel der teuren Sorte wird gebraucht?',
    [r'$4\,\mathrm{kg}$', r'$8\,\mathrm{kg}$', r'$6\,\mathrm{kg}$', r'$3\,\mathrm{kg}$'],
    [r'Ansatz: $a + b = 12$ und $4a + 10b = 72$.',
     r'$4\,(12 - b) + 10b = 72$ ergibt $48 + 6b = 72$, also $b = 4$.',
     r'$4\,\mathrm{kg}$ der teuren und $8\,\mathrm{kg}$ der billigen Sorte. Probe: $32 + 40 = 72$ €.'])

Q.q(r'Zwei Züge starten gleichzeitig $300\,\mathrm{km}$ voneinander entfernt aufeinander zu, mit $90\,\mathrm{km/h}$ und $60\,\mathrm{km/h}$. Nach welcher Zeit begegnen sie sich?',
    [r'nach $2$ Stunden', r'nach $3$ Stunden', r'nach $2{,}5$ Stunden', r'nach $5$ Stunden'],
    [r'Sie nähern sich mit $90 + 60 = 150\,\mathrm{km/h}$.',
     r'$t = \dfrac{300}{150} = 2$ Stunden.',
     r'Probe: $180 + 120 = 300\,\mathrm{km}$.'])

Q.q(r'Bei $50$ Stück kostet die Produktion $450$ €, bei $80$ Stück $660$ €. Wie hoch sind die variablen Kosten je Stück?',
    [r'$7$ €', r'$9$ €', r'$8{,}25$ €', r'$6$ €'],
    [r'Ansatz $K(x) = kx + f$: $50k + f = 450$ und $80k + f = 660$.',
     r'Subtrahieren: $30k = 210$, also $k = 7$ €.',
     r'Die Fixkosten sind dann $f = 450 - 350 = 100$ €.'])

Q.q(r'Ein Rechteck hat den Umfang $34\,\mathrm{cm}$; die Länge ist doppelt so groß wie die Breite plus $2\,\mathrm{cm}$. Wie breit ist es?',
    [r'$5\,\mathrm{cm}$', r'$6\,\mathrm{cm}$', r'$4\,\mathrm{cm}$', r'$7\,\mathrm{cm}$'],
    [r'Ansatz: $2\,(l + b) = 34$, also $l + b = 17$, und $l = 2b + 2$.',
     r'Einsetzen: $2b + 2 + b = 17$, also $3b = 15$ und $b = 5$.',
     r'$l = 12$. Probe: $2 \cdot 17 = 34\,\mathrm{cm}$.'])

Q.q(r'In einer Kasse liegen nur $2$-€- und $5$-€-Münzen bzw. -Scheine: $28$ Stück mit dem Wert $92$ €. Wie viele Zwei-Euro-Stücke sind es?',
    [r'$16$ Stück', r'$12$ Stück', r'$14$ Stück', r'$18$ Stück'],
    [r'Ansatz: $z + f = 28$ und $2z + 5f = 92$.',
     r'$2\,(28 - f) + 5f = 92$ ergibt $56 + 3f = 92$, also $f = 12$.',
     r'$z = 16$. Probe: $32 + 60 = 92$ €.'])


def check():
    from fractions import Fraction as F
    from math import atan, degrees
    import sympy as sp
    x, y, a, b = sp.symbols('x y a b')
    S = lambda eqs: sp.solve(eqs, [x, y], dict=True)
    assert S([x + y - 9, 2 * x - y - 3]) == [{x: 4, y: 5}]
    assert S([3 * x + y - 11, x - y - 1]) == [{x: 3, y: 2}]
    assert S([2 * x - 3 * y, 4 * x + 3 * y - 18]) == [{x: 3, y: 2}]
    assert S([y - 2 * x, x + y - 12]) == [{x: 4, y: 8}]
    assert S([5 * x + 2 * y - 16, 3 * x - 2 * y]) == [{x: 2, y: 3}]
    assert S([4 * x + 3 * y - 18, y - (x - 1)]) == [{x: 3, y: 2}]
    unendlich = sp.solve([2 * x + 4 * y - 8, x + 2 * y - 4], [x, y], dict=True)
    assert unendlich and len(unendlich[0]) == 1
    assert 4 + 2 * 0 == 4 and 0 + 2 * 2 == 4
    assert sp.solve([3 * x - 6 * y - 9, x - 2 * y - 5], [x, y], dict=True) == []
    # Geraden
    assert F(8 - 4, 3 - 1) == 2 and 2 * 1 + 2 == 4 and 2 * 3 + 2 == 8
    assert sp.solve(4 * x - 10, x) == [F(5, 2)]
    assert F(1, 2) * 2 + 2 == 3
    assert -3 * F(1, 3) == -1
    assert sp.solve(sp.Eq(-x + 6, 2 * x - 3), x) == [3] and (-x + 6).subs(x, 3) == 3
    assert abs(degrees(atan(1)) - 45) < 1e-9 and 180 - 45 == 135
    # Anwendungen
    assert sp.solve(sp.Eq(F(20, 100) * x + 30, F(60, 100) * x + 10), x) == [50]
    assert F(20, 100) * 50 + 30 == 40 == F(60, 100) * 50 + 10
    assert sp.solve([a + b - 12, 4 * a + 10 * b - 72], [a, b], dict=True) == [{a: 8, b: 4}]
    assert 12 * 6 == 72 and 4 * 8 + 10 * 4 == 72
    assert F(300, 90 + 60) == 2 and 90 * 2 + 60 * 2 == 300
    k, f = sp.symbols('k f')
    assert sp.solve([50 * k + f - 450, 80 * k + f - 660], [k, f], dict=True) == [{k: 7, f: 100}]
    l_, br = sp.symbols('l_ br')
    assert sp.solve([2 * (l_ + br) - 34, l_ - (2 * br + 2)], [l_, br], dict=True) == [{l_: 12, br: 5}]
    z, fu = sp.symbols('z fu')
    assert sp.solve([z + fu - 28, 2 * z + 5 * fu - 92], [z, fu], dict=True) == [{z: 16, fu: 12}]
    assert 2 * 16 + 5 * 12 == 92


Q.verify(check)
Q.save()
