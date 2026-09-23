#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 19 / KW 2 (LB 1): Arbeit mit Parametern bei
quadratischen Funktionen, auch mit Fallunterscheidung.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=19, slug='parameter-fallunterscheidung', thema='Parameter und Fallunterscheidung', lb='LB 1',
          blurb='Funktionenscharen, Nullstellen in Abhängigkeit vom Parameter, Diskriminante',
          comment='Blocks: Scharen verstehen (1-5), Nullstellen und Scheitel mit Parameter (6-11), Fallunterscheidung ueber die Diskriminante (12-17), Anwendungen (18-20).')

# --------------------------------------------------------- Scharen verstehen ----
Q.q(r'Was ist eine Funktionenschar?',
    [r'eine Menge von Funktionen, die sich nur im Wert eines Parameters unterscheiden',
     r'eine Funktion mit mehreren Variablen',
     r'eine Funktion, die mehrere Werte zuordnet',
     r'eine Folge von Funktionswerten'],
    [r'In der Funktionsgleichung steht neben $x$ ein Buchstabe, der keine Variable, sondern ein Parameter ist.',
     r'Für jeden festen Wert des Parameters entsteht eine einzelne Funktion.',
     r'Alle diese Funktionen zusammen bilden die Schar.'])

Q.q(r'Wie entstehen die Graphen der Schar $f_a(x) = x^2 + a$ auseinander?',
    [r'durch Verschiebung längs der $y$-Achse', r'durch Verschiebung längs der $x$-Achse',
     r'durch Streckung', r'durch Spiegelung an der $x$-Achse'],
    [r'Der Parameter wird zum Funktionswert addiert.',
     r'Der Scheitel wandert von $(0|0)$ nach $(0|a)$.',
     r'Form und Öffnung bleiben unverändert.'])

Q.q(r'Wo liegt der Scheitelpunkt der Schar $f_a(x) = (x - a)^2$?',
    [r'in $(a|0)$', r'in $(0|a)$', r'in $(-a|0)$', r'in $(a|a)$'],
    [r'Der kleinste Wert $0$ wird angenommen, wenn die Klammer null ist.',
     r'$x - a = 0$ ergibt $x = a$.',
     r'Alle Scheitel liegen also auf der $x$-Achse.'])

Q.q(r'Was bewirkt der Parameter in der Schar $f_a(x) = a\,x^2$ mit $a \neq 0$?',
    [r'Er bestimmt Öffnungsrichtung und Streckung.', r'Er verschiebt den Graphen nach oben.',
     r'Er verschiebt den Graphen nach rechts.', r'Er ändert die Nullstelle.'],
    [r'Das Vorzeichen von $a$ entscheidet über die Öffnungsrichtung.',
     r'Der Betrag entscheidet über Streckung oder Stauchung.',
     r'Der Scheitel bleibt für jedes $a$ im Ursprung.'])

Q.q(r'Für welches $a$ verläuft der Graph von $f_a(x) = x^2 + a$ durch den Punkt $P(2|1)$?',
    [r'$a = -3$', r'$a = 3$', r'$a = 1$', r'$a = -1$'],
    [r'Punktprobe: $1 = 2^2 + a$.',
     r'$1 = 4 + a$, also $a = -3$.',
     r'Probe: $f_{-3}(2) = 4 - 3 = 1$.'])

# -------------------------------------- Nullstellen und Scheitel mit Parameter ----
Q.q(r'Wie lauten die Nullstellen von $f_a(x) = x^2 - a$ für $a > 0$?',
    [r'$x = \pm\sqrt{a}$', r'$x = \pm a$', r'$x = a^2$', r'$x = \pm\dfrac{a}{2}$'],
    [r'$x^2 - a = 0$ ergibt $x^2 = a$.',
     r'Wurzel ziehen, beide Vorzeichen: $x = \pm\sqrt{a}$.',
     r'Probe mit $a = 9$: Nullstellen $\pm 3$.'])

Q.q(r'Wie viele Nullstellen hat $f_a(x) = x^2 - a$ für $a < 0$?',
    [r'keine', r'eine', r'zwei', r'das hängt vom Betrag von $a$ ab'],
    [r'Die Gleichung $x^2 = a$ hätte eine negative rechte Seite.',
     r'Ein Quadrat ist im Reellen nie negativ.',
     r'Für $a < 0$ liegt die ganze Parabel oberhalb der $x$-Achse.'])

Q.q(r'Wie lauten die Nullstellen von $f_a(x) = x^2 - a\,x$?',
    [r'$x_1 = 0$ und $x_2 = a$', r'$x_1 = 0$ und $x_2 = -a$',
     r'$x = \pm\sqrt{a}$', r'nur $x = a$'],
    [r'$x$ ausklammern: $x\,(x - a) = 0$.',
     r'Nullproduktsatz: $x = 0$ oder $x = a$.',
     r'Für $a = 0$ fallen beide zusammen, es bleibt die doppelte Nullstelle $0$.'])

Q.q(r'Was ist das Besondere an $f_a(x) = x^2 - 2a\,x + a^2$?',
    [r'Der Term ist $(x - a)^2$, es gibt eine doppelte Nullstelle bei $x = a$.',
     r'Es gibt zwei getrennte Nullstellen bei $\pm a$.',
     r'Es gibt keine Nullstelle.',
     r'Der Graph ist nach unten geöffnet.'],
    [r'Erste binomische Formel rückwärts: $x^2 - 2ax + a^2 = (x-a)^2$.',
     r'Die Nullstelle $a$ tritt doppelt auf.',
     r'Der Graph berührt die $x$-Achse im Punkt $(a|0)$.'])

Q.q(r'Wo liegt der Scheitelpunkt der Schar $f_a(x) = x^2 - 2a\,x$?',
    [r'in $\left(a\,\middle|\,-a^2\right)$', r'in $\left(a\,\middle|\,a^2\right)$',
     r'in $\left(2a\,\middle|\,0\right)$', r'in $\left(-a\,\middle|\,-a^2\right)$'],
    [r'Quadratische Ergänzung: $x^2 - 2ax + a^2 - a^2 = (x-a)^2 - a^2$.',
     r'Also $x_S = a$ und $y_S = -a^2$.',
     r'Probe mit $a = 3$: $f_3(x) = x^2 - 6x$ hat den Scheitel $(3|-9)$.'])

Q.q(r'Auf welcher Kurve liegen alle Scheitelpunkte der Schar $f_a(x) = x^2 - 2a\,x$?',
    [r'auf der Parabel $y = -x^2$', r'auf der Parabel $y = x^2$',
     r'auf der Geraden $y = -x$', r'auf der $x$-Achse'],
    [r'Die Scheitel sind $S\left(a\,\middle|\,-a^2\right)$.',
     r'Setzt man $x = a$, so ist $y = -a^2 = -x^2$.',
     r'Diese Kurve heißt Ortskurve der Scheitelpunkte.'])

# ------------------------------------ Fallunterscheidung über die Diskriminante ----
Q.q(r'Wie lautet die Diskriminante von $f_a(x) = x^2 + a\,x + 1$?',
    [r'$D = a^2 - 4$', r'$D = a^2 + 4$', r'$D = a - 4$', r'$D = 4 - a^2$'],
    [r'Für $x^2 + px + q$ ist $D = p^2 - 4q$.',
     r'Hier $p = a$ und $q = 1$.',
     r'$D = a^2 - 4$'])

Q.q(r'Für welche $a$ hat $f_a(x) = x^2 + a\,x + 1$ zwei verschiedene Nullstellen?',
    [r'für $a < -2$ oder $a > 2$', r'für $-2 < a < 2$', r'für $a > 0$', r'für jedes $a$'],
    [r'Zwei Nullstellen bedeutet $D > 0$, also $a^2 - 4 > 0$.',
     r'$a^2 > 4$ gilt für $\left|a\right| > 2$.',
     r'Probe mit $a = 3$: $D = 5 > 0$, es gibt zwei Nullstellen.'])

Q.q(r'Für welche $a$ hat $f_a(x) = x^2 + a\,x + 1$ genau eine Nullstelle?',
    [r'für $a = 2$ und $a = -2$', r'für $a = 0$', r'für $a = 1$', r'für kein $a$'],
    [r'Genau eine Nullstelle bedeutet $D = 0$, also $a^2 = 4$.',
     r'$a = 2$ oder $a = -2$.',
     r'Probe: $x^2 + 2x + 1 = (x+1)^2$ hat die doppelte Nullstelle $-1$.'])

Q.q(r'Für welche $a$ hat $f_a(x) = x^2 + a\,x + 1$ keine reelle Nullstelle?',
    [r'für $-2 < a < 2$', r'für $a > 2$', r'für $a < -2$', r'für kein $a$'],
    [r'Keine Nullstelle bedeutet $D < 0$, also $a^2 < 4$.',
     r'Das gilt für $\left|a\right| < 2$, also $-2 < a < 2$.',
     r'Probe mit $a = 0$: $x^2 + 1 = 0$ hat im Reellen keine Lösung.'])

Q.q(r'Warum muss man bei der Schar $f_a(x) = a\,x^2 + 2x + 1$ den Fall $a = 0$ getrennt betrachten?',
    [r'Weil die Funktion dann linear ist und die Lösungsformel nicht gilt.',
     r'Weil sie dann keine Nullstelle hat.',
     r'Weil der Graph dann eine senkrechte Gerade ist.',
     r'Weil sie dann nicht definiert ist.'],
    [r'Für $a = 0$ bleibt $f_0(x) = 2x + 1$ stehen — eine Gerade, keine Parabel.',
     r'Die Lösungsformel für quadratische Gleichungen setzt aber $a \neq 0$ voraus.',
     r'Die Gerade hat genau eine Nullstelle, nämlich $x = -\dfrac{1}{2}$.'])

Q.q(r'Für welche $a \neq 0$ hat $f_a(x) = a\,x^2 + 2x + 1$ genau eine Nullstelle?',
    [r'für $a = 1$', r'für $a = 2$', r'für $a = -1$', r'für $a = 4$'],
    [r'Diskriminante der allgemeinen Form: $D = b^2 - 4ac = 4 - 4a$.',
     r'$D = 0$ ergibt $4a = 4$, also $a = 1$.',
     r'Probe: $x^2 + 2x + 1 = (x+1)^2$ berührt die $x$-Achse bei $x = -1$.'])

# ----------------------------------------------------------- Anwendungen ----
Q.q(r'Ein Ball fliegt nach $h_v(t) = -5t^2 + v\,t$, wobei $v$ die Abwurfgeschwindigkeit in Metern je Sekunde ist. Wann landet er?',
    [r'nach $t = \dfrac{v}{5}$ Sekunden', r'nach $t = \dfrac{v}{10}$ Sekunden',
     r'nach $t = 5v$ Sekunden', r'nach $t = v$ Sekunden'],
    [r'Landen bedeutet $h_v(t) = 0$: $t\,(-5t + v) = 0$.',
     r'$t = 0$ ist der Abwurf, die zweite Lösung ist $t = \dfrac{v}{5}$.',
     r'Probe mit $v = 20$: nach $4$ Sekunden, und $h(4) = -80 + 80 = 0$.'])

Q.q(r'Welche größte Höhe erreicht der Ball aus der vorigen Aufgabe?',
    [r'$\dfrac{v^2}{20}$ Meter', r'$\dfrac{v^2}{10}$ Meter', r'$\dfrac{v}{20}$ Meter', r'$v^2$ Meter'],
    [r'Der Scheitel liegt in der Mitte zwischen den Nullstellen $0$ und $\dfrac{v}{5}$, also bei $t = \dfrac{v}{10}$.',
     r'$h\left(\dfrac{v}{10}\right) = -5 \cdot \dfrac{v^2}{100} + \dfrac{v^2}{10} = \dfrac{v^2}{20}$',
     r'Probe mit $v = 20$: $\dfrac{400}{20} = 20$ Meter.'])

Q.q(r'Der Gewinn beträgt $G_p(x) = -x^2 + p\,x - 24$ (in €), wobei $p$ der Verkaufspreis ist. Für welche $p$ macht der Betrieb überhaupt Gewinn?',
    [r'für $p > \sqrt{96} \approx 9{,}8$', r'für $p > 24$', r'für $p > 0$', r'für jedes $p$'],
    [r'Gewinn ist möglich, wenn die Parabel die $x$-Achse schneidet, also $D > 0$.',
     r'$D = p^2 - 4 \cdot 1 \cdot 24 = p^2 - 96 > 0$',
     r'$p > \sqrt{96} \approx 9{,}8$ €. Darunter liegt die ganze Gewinnkurve unter der Null.'])


def check():
    from fractions import Fraction as F
    from math import sqrt
    import sympy as sp
    x, a, t, v, p = sp.symbols('x a t v p')
    ap = sp.Symbol('ap', positive=True)
    assert (x ** 2 + a).subs(x, 0) == a
    assert sp.solve((x - a) ** 2, x) == [a]
    assert sp.solve(sp.Eq(2 ** 2 + a, 1), a) == [-3] and 4 - 3 == 1
    # Nullstellen mit Parameter
    assert sp.solve(x ** 2 - ap, x) == [-sp.sqrt(ap), sp.sqrt(ap)]
    assert sp.solve(x ** 2 - 9, x) == [-3, 3]
    assert sp.solveset(x ** 2 + 1, x, sp.S.Reals) == sp.S.EmptySet
    assert sp.solve(x ** 2 - a * x, x) == [0, a] and sp.factor(x ** 2 - a * x) == x * (x - a)
    assert sp.factor(x ** 2 - 2 * a * x + a ** 2) == (x - a) ** 2
    assert sp.expand((x - a) ** 2 - a ** 2) == x ** 2 - 2 * a * x
    assert (x ** 2 - 2 * a * x).subs({a: 3, x: 3}) == -9
    # Diskriminante
    assert a ** 2 - 4 * 1 == a ** 2 - 4
    assert (3 ** 2 - 4) == 5 > 0 and (2 ** 2 - 4) == 0 and (0 ** 2 - 4) == -4 < 0
    assert sp.solve(sp.Eq(a ** 2 - 4, 0), a) == [-2, 2]
    assert sp.factor(x ** 2 + 2 * x + 1) == (x + 1) ** 2 and sp.solve(x ** 2 + 2 * x + 1, x) == [-1]
    assert sp.solve(2 * x + 1, x) == [F(-1, 2)]
    assert sp.solve(sp.Eq(4 - 4 * a, 0), a) == [1]
    # Anwendungen
    h = -5 * t ** 2 + v * t
    assert sp.solve(h, t) == [0, v / 5]
    assert h.subs({v: 20, t: 4}) == 0 and F(20, 5) == 4
    top = sp.simplify(h.subs(t, v / 10))
    assert sp.simplify(top - v ** 2 / 20) == 0 and top.subs(v, 20) == 20
    assert sp.solve(sp.Eq(p ** 2 - 96, 0), p) == [-sp.sqrt(96), sp.sqrt(96)]
    assert abs(sqrt(96) - 9.8) < 0.05


Q.verify(check)
Q.save()
