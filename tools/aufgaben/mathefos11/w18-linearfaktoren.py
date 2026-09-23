#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 18 / KW 1 (LB 1): Linearfaktoren und die Bestimmung
von Funktionsgleichungen aus gegebenen Bedingungen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=18, slug='linearfaktoren', thema='Linearfaktoren und Steckbriefaufgaben', lb='LB 1',
          blurb='Linearfaktordarstellung, Nullstellen ablesen, Funktionsgleichung aus Bedingungen',
          comment='Blocks: Linearfaktordarstellung (1-6), Nullstellen und Eigenschaften ablesen (7-11), Funktionsgleichung aus Bedingungen (12-16), groessere Systeme und Anwendungen (17-20).')

# ------------------------------------------------ Linearfaktordarstellung ----
Q.q(r'Wie lauten die Nullstellen von $y = (x - 2)(x - 5)$?',
    [r'$x_1 = 2$ und $x_2 = 5$', r'$x_1 = -2$ und $x_2 = -5$',
     r'$x_1 = 2$ und $x_2 = -5$', r'$x = 10$'],
    [r'Nullproduktsatz: jeder Faktor wird null gesetzt.',
     r'$x - 2 = 0$ ergibt $x = 2$; $x - 5 = 0$ ergibt $x = 5$.',
     r'In der Linearfaktordarstellung stehen die Nullstellen direkt ablesbar in den Klammern.'])

Q.q(r'Wie lautet $y = (x - 2)(x - 5)$ in der Normalform?',
    [r'$y = x^2 - 7x + 10$', r'$y = x^2 + 7x + 10$', r'$y = x^2 - 7x - 10$', r'$y = x^2 - 10$'],
    [r'Ausmultiplizieren: $x^2 - 5x - 2x + 10$.',
     r'$y = x^2 - 7x + 10$',
     r'Kontrolle über Vieta: Summe der Nullstellen $7$, Produkt $10$ — passt zu $-7$ und $+10$.'])

Q.q(r'Zerlege $y = x^2 - x - 12$ in Linearfaktoren.',
    [r'$y = (x - 4)(x + 3)$', r'$y = (x + 4)(x - 3)$', r'$y = (x - 4)(x - 3)$', r'$y = (x - 12)(x + 1)$'],
    [r'Vieta: zwei Zahlen mit der Summe $1$ und dem Produkt $-12$.',
     r'Das sind $4$ und $-3$, also die Nullstellen.',
     r'$y = (x - 4)\left(x - (-3)\right) = (x-4)(x+3)$. Probe: $x^2 + 3x - 4x - 12$.'])

Q.q(r'Welche Eigenschaften hat $y = 2\,(x - 1)(x + 3)$?',
    [r'Nullstellen bei $1$ und $-3$, nach oben geöffnet und gestreckt',
     r'Nullstellen bei $-1$ und $3$, nach oben geöffnet',
     r'Nullstellen bei $1$ und $-3$, nach unten geöffnet',
     r'Nullstellen bei $2$ und $-3$'],
    [r'Die Klammern liefern die Nullstellen $1$ und $-3$.',
     r'Der Faktor $a = 2$ ist positiv, die Parabel öffnet nach oben.',
     r'Weil $\left|a\right| > 1$ ist, ist sie gegenüber der Normalparabel gestreckt.'])

Q.q(r'Was bedeutet die Darstellung $y = (x - 3)^2$ für den Graphen?',
    [r'Er berührt die $x$-Achse bei $x = 3$, es liegt eine doppelte Nullstelle vor.',
     r'Er schneidet die $x$-Achse bei $x = 3$ und $x = -3$.',
     r'Er hat keine Nullstelle.',
     r'Er schneidet die $x$-Achse bei $x = 9$.'],
    [r'Beide Linearfaktoren sind gleich: $(x-3)(x-3)$.',
     r'Die Nullstelle $3$ tritt doppelt auf.',
     r'Bei doppelter Nullstelle berührt der Graph die Achse, statt sie zu durchsetzen.'])

Q.q(r'Wie lautet die Normalparabel mit den Nullstellen $4$ und $-1$?',
    [r'$y = (x - 4)(x + 1)$', r'$y = (x + 4)(x - 1)$', r'$y = (x - 4)(x - 1)$', r'$y = (x - 3)(x + 3)$'],
    [r'Zu jeder Nullstelle $x_0$ gehört der Linearfaktor $(x - x_0)$.',
     r'$x_0 = 4$ ergibt $(x-4)$, $x_0 = -1$ ergibt $(x+1)$.',
     r'Normalparabel heißt $a = 1$, also $y = (x-4)(x+1)$.'])

# ------------------------------------- Nullstellen und Eigenschaften ablesen ----
Q.q(r'Wo schneidet $y = (x - 2)(x - 5)$ die $y$-Achse?',
    [r'in $(0|10)$', r'in $(0|-7)$', r'in $(0|-10)$', r'in $(0|0)$'],
    [r'Bei $x = 0$ einsetzen: $(0-2)(0-5)$.',
     r'$= (-2) \cdot (-5) = 10$',
     r'Minus mal Minus ergibt Plus.'])

Q.q(r'Wie lauten die Nullstellen von $y = (x + 2)(x - 6)$?',
    [r'$x_1 = -2$ und $x_2 = 6$', r'$x_1 = 2$ und $x_2 = -6$',
     r'$x_1 = 2$ und $x_2 = 6$', r'$x_1 = -2$ und $x_2 = -6$'],
    [r'$x + 2 = 0$ ergibt $x = -2$.',
     r'$x - 6 = 0$ ergibt $x = 6$.',
     r'Das Vorzeichen kehrt sich beim Ablesen jeweils um.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = (x + 2)(x - 6)$?',
    [r'bei $x = 2$', r'bei $x = -2$', r'bei $x = 6$', r'bei $x = 4$'],
    [r'Die Parabel ist symmetrisch zur Mitte zwischen ihren Nullstellen.',
     r'Mitte von $-2$ und $6$: $\dfrac{-2 + 6}{2} = 2$.',
     r'Der Scheitelwert ist $y(2) = 4 \cdot (-4) = -16$.'])

Q.q(r'Warum reicht es nicht, nur die Nullstellen zu kennen, um eine Parabel eindeutig festzulegen?',
    [r'Weil der Faktor $a$ die Öffnung und Streckung bestimmt und beliebig sein kann.',
     r'Weil Nullstellen nicht eindeutig sind.',
     r'Weil noch der Scheitelpunkt fehlt.',
     r'Weil die Normalform nicht berechnet werden kann.'],
    [r'Alle Parabeln $y = a\,(x - x_1)(x - x_2)$ haben dieselben Nullstellen.',
     r'Sie unterscheiden sich aber in Öffnungsrichtung und Streckung.',
     r'Deshalb braucht es eine dritte Bedingung, etwa einen weiteren Punkt.'])

Q.q(r'Wie lautet die Parabel mit den Nullstellen $1$ und $3$, die durch $P(0|6)$ verläuft?',
    [r'$y = 2\,(x-1)(x-3)$', r'$y = (x-1)(x-3)$', r'$y = 6\,(x-1)(x-3)$', r'$y = -2\,(x-1)(x-3)$'],
    [r'Ansatz: $y = a\,(x-1)(x-3)$.',
     r'Punkt einsetzen: $6 = a \cdot (-1) \cdot (-3) = 3a$, also $a = 2$.',
     r'$y = 2\,(x-1)(x-3)$, ausmultipliziert $y = 2x^2 - 8x + 6$.'])

# ------------------------------- Funktionsgleichung aus Bedingungen ----
Q.q(r'Wie viele Bedingungen braucht man, um eine Parabel $y = ax^2 + bx + c$ eindeutig zu bestimmen?',
    [r'drei', r'zwei', r'eine', r'vier'],
    [r'Es sind drei Unbekannte zu bestimmen: $a$, $b$ und $c$.',
     r'Für drei Unbekannte braucht man drei voneinander unabhängige Gleichungen.',
     r'Jede Bedingung, etwa ein Punkt oder ein Scheitel, liefert eine Gleichung.'])

Q.q(r'Eine Parabel geht durch $A(0|1)$, $B(1|0)$ und $C(2|1)$. Wie lautet sie?',
    [r'$y = x^2 - 2x + 1$', r'$y = x^2 + 2x + 1$', r'$y = 2x^2 - 3x + 1$', r'$y = -x^2 + 2x + 1$'],
    [r'$A$ liefert sofort $c = 1$.',
     r'$B$: $a + b + 1 = 0$; $C$: $4a + 2b + 1 = 1$, also $2a + b = 0$.',
     r'Subtraktion ergibt $a = 1$ und $b = -2$. Probe: $y(1) = 0$ und $y(2) = 1$.'])

Q.q(r'Eine Parabel hat den Scheitel $S(2|-1)$ und verläuft durch $P(0|3)$. Wie lautet sie?',
    [r'$y = (x - 2)^2 - 1$', r'$y = (x + 2)^2 - 1$', r'$y = 2\,(x - 2)^2 - 1$', r'$y = (x - 2)^2 + 3$'],
    [r'Scheitelpunktform: $y = a\,(x - 2)^2 - 1$.',
     r'Punkt einsetzen: $3 = a \cdot 4 - 1$, also $4a = 4$ und $a = 1$.',
     r'$y = (x-2)^2 - 1$. Probe: $y(0) = 4 - 1 = 3$.'])

Q.q(r'Eine Parabel hat den Scheitel $S(-1|4)$ und verläuft durch $P(1|0)$. Wie lautet der Faktor $a$?',
    [r'$a = -1$', r'$a = 1$', r'$a = -4$', r'$a = 2$'],
    [r'Ansatz: $y = a\,(x + 1)^2 + 4$.',
     r'Punkt einsetzen: $0 = a \cdot 4 + 4$, also $4a = -4$.',
     r'$a = -1$; die Parabel ist nach unten geöffnet.'])

Q.q(r'Welche Bedingung liefert die Aussage „die Parabel schneidet die $y$-Achse bei $5$“?',
    [r'$c = 5$ in der Normalform', r'$a = 5$', r'$b = 5$', r'eine Nullstelle bei $5$'],
    [r'Der Schnittpunkt mit der $y$-Achse liegt bei $x = 0$.',
     r'$y(0) = a \cdot 0 + b \cdot 0 + c = c$',
     r'Also ist $c$ immer der $y$-Achsenabschnitt.'])

# ------------------------------ größere Systeme und Anwendungen ----
Q.q(r'Wie löst man ein Gleichungssystem mit drei Gleichungen und drei Unbekannten laut Lehrplan?',
    [r'mit dem GTR ohne CAS', r'ausschließlich im Kopf',
     r'gar nicht, das ist erst Stoff der Klasse 12', r'nur grafisch'],
    [r'Für zwei Gleichungen mit zwei Unbekannten wird von Hand gerechnet.',
     r'Größere Systeme, wie sie bei Steckbriefaufgaben entstehen, dürfen mit dem GTR gelöst werden.',
     r'Der Ansatz — also das Aufstellen der drei Gleichungen — bleibt aber Handarbeit.'])

Q.q(r'Beim Aufstellen der Bedingungen für eine Parabel durch drei Punkte entsteht ein System. Woran erkennt man einen Fehler im Ansatz besonders schnell?',
    [r'an der Probe: die gefundene Funktion muss alle drei Punkte treffen',
     r'daran, dass der GTR eine Fehlermeldung zeigt',
     r'daran, dass $a$ negativ wird',
     r'gar nicht, der Ansatz lässt sich nicht prüfen'],
    [r'Der GTR löst auch ein falsch aufgestelltes System klaglos.',
     r'Deshalb wird die gefundene Funktionsgleichung in jede der ursprünglichen Bedingungen eingesetzt.',
     r'Erst wenn alle drei Punkte getroffen werden, ist der Ansatz bestätigt.'])

Q.q(r'Ein Brückenbogen ist $20\,\mathrm{m}$ breit und in der Mitte $5\,\mathrm{m}$ hoch. Legt man den Scheitel in $(0|5)$, wie lautet die Parabel?',
    [r'$y = -0{,}05x^2 + 5$', r'$y = -0{,}5x^2 + 5$', r'$y = 0{,}05x^2 + 5$', r'$y = -0{,}05x^2 - 5$'],
    [r'Ansatz $y = a x^2 + 5$; die Enden liegen bei $x = \pm 10$ auf der Höhe $0$.',
     r'$0 = a \cdot 100 + 5$, also $a = -0{,}05$.',
     r'$y = -0{,}05x^2 + 5$. Probe: $y(10) = -5 + 5 = 0$.'])

Q.q(r'Ein Ball wird geworfen und erreicht seine größte Höhe von $4\,\mathrm{m}$ nach $2\,\mathrm{m}$ waagerechter Strecke; abgeworfen wurde er in Bodenhöhe. Wie lautet die Wurfparabel $h(x)$?',
    [r'$h(x) = -\left(x - 2\right)^2 + 4$', r'$h(x) = \left(x - 2\right)^2 + 4$',
     r'$h(x) = -\left(x + 2\right)^2 + 4$', r'$h(x) = -2\left(x - 2\right)^2 + 4$'],
    [r'Scheitelpunktform mit $S(2|4)$: $h(x) = a\,(x-2)^2 + 4$.',
     r'Abwurf in Bodenhöhe heißt $h(0) = 0$: $0 = 4a + 4$, also $a = -1$.',
     r'$h(x) = -(x-2)^2 + 4$. Probe: $h(4) = -4 + 4 = 0$, der Ball landet nach $4\,\mathrm{m}$.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a, b, c = sp.symbols('x a b c')
    f = (x - 2) * (x - 5)
    assert sp.solve(f, x) == [2, 5] and sp.expand(f) == x ** 2 - 7 * x + 10 and f.subs(x, 0) == 10
    assert sp.factor(x ** 2 - x - 12) == (x - 4) * (x + 3) and 4 + (-3) == 1 and 4 * (-3) == -12
    g = 2 * (x - 1) * (x + 3)
    assert sp.solve(g, x) == [-3, 1] and sp.expand(g).coeff(x, 2) == 2
    assert sp.solve((x - 3) ** 2, x) == [3]
    assert sp.solve((x - 4) * (x + 1), x) == [-1, 4]
    h = (x + 2) * (x - 6)
    assert sp.solve(h, x) == [-2, 6] and F(-2 + 6, 2) == 2 and h.subs(x, 2) == -16
    # a aus einem Punkt
    assert sp.solve(sp.Eq(a * (0 - 1) * (0 - 3), 6), a) == [2]
    assert sp.expand(2 * (x - 1) * (x - 3)) == 2 * x ** 2 - 8 * x + 6
    # Steckbriefaufgaben
    sol = sp.solve([c - 1, a + b + c, 4 * a + 2 * b + c - 1], [a, b, c])
    assert sol == {a: 1, b: -2, c: 1}
    p = x ** 2 - 2 * x + 1
    assert p.subs(x, 0) == 1 and p.subs(x, 1) == 0 and p.subs(x, 2) == 1
    assert sp.solve(sp.Eq(a * 4 - 1, 3), a) == [1] and ((x - 2) ** 2 - 1).subs(x, 0) == 3
    assert sp.solve(sp.Eq(a * 4 + 4, 0), a) == [-1]
    assert (a * x ** 2 + b * x + c).subs(x, 0) == c
    # Anwendungen
    assert sp.solve(sp.Eq(a * 100 + 5, 0), a) == [F(-1, 20)] and abs(float(F(-1, 20)) + 0.05) < 1e-12
    br = F(-1, 20) * x ** 2 + 5
    assert br.subs(x, 10) == 0 and br.subs(x, -10) == 0 and br.subs(x, 0) == 5
    assert sp.solve(sp.Eq(4 * a + 4, 0), a) == [-1]
    wu = -(x - 2) ** 2 + 4
    assert wu.subs(x, 0) == 0 and wu.subs(x, 2) == 4 and wu.subs(x, 4) == 0


Q.verify(check)
Q.save()
