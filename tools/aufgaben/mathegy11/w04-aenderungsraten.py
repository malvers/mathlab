#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 4 / KW 37 (LB 1): rates of change - difference quotient
(secant, average rate), differential quotient (tangent, local rate), Newton and Leibniz.
Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=4, slug='aenderungsraten', thema='Änderungsraten: Sekante und Tangente', lb='LB 1',
         blurb='Differenzenquotient, Differentialquotient, mittlere und lokale Änderungsrate',
         comment='Blocks: average rate of change (1-6), meaning and notation (7-11), local rate via h -> 0 (12-17), context (18-20).')

# ------------------------------------------------ average rate of change ----
Q.q(r'Bestimme die mittlere Änderungsrate von $f(x) = x^2$ im Intervall $[1;\,3]$.',
    [r'4', r'8', r'2', r'6'],
    [r'Differenzenquotient: $\dfrac{f(3) - f(1)}{3 - 1}$',
     r'$\dfrac{9 - 1}{2} = 4$'])

Q.q(r'Bestimme die mittlere Änderungsrate von $f(x) = x^3$ im Intervall $[0;\,2]$.',
    [r'4', r'8', r'2', r'12'],
    [r'$\dfrac{f(2) - f(0)}{2 - 0} = \dfrac{8 - 0}{2}$',
     r'Ergebnis 4. Wer nur $f(2) - f(0)$ rechnet, erhält fälschlich 8.'])

Q.q(r'Ein Körper fällt nach $s(t) = 5t^2$ ($s$ in m, $t$ in s). Wie groß ist seine mittlere Geschwindigkeit zwischen $t = 1$ und $t = 3$?',
    [r'20 m/s', r'40 m/s', r'10 m/s', r'45 m/s'],
    [r'$s(3) = 45$, $s(1) = 5$',
     r'$\bar v = \dfrac{45 - 5}{3 - 1} = \dfrac{40}{2} = 20$ m/s'])

Q.q(r'Bestimme die mittlere Änderungsrate von $f(x) = \sqrt{x}$ zwischen $x = 1$ und $x = 4$.',
    [r'$\dfrac{1}{3}$', r'1', r'3', r'$\dfrac{1}{2}$'],
    [r'$f(4) = 2$, $f(1) = 1$',
     r'$\dfrac{2 - 1}{4 - 1} = \dfrac{1}{3}$'])

Q.q(r'Bestimme die mittlere Änderungsrate von $f(x) = \dfrac{1}{x}$ im Intervall $[1;\,2]$.',
    [r'$-\dfrac{1}{2}$', r'$\dfrac{1}{2}$', r'−1', r'$-\dfrac{3}{2}$'],
    [r'$f(2) = \dfrac{1}{2}$, $f(1) = 1$',
     r'$\dfrac{\frac{1}{2} - 1}{2 - 1} = -\dfrac{1}{2}$',
     r'Negativ, denn die Funktion fällt.'])

Q.q(r'Um 6 Uhr zeigt das Thermometer 12 °C, um 10 Uhr 20 °C. Wie groß ist die mittlere Änderungsrate?',
    [r'2 °C pro Stunde', r'8 °C pro Stunde', r'0,5 °C pro Stunde', r'4 °C pro Stunde'],
    [r'Änderung der Temperatur: 8 °C in 4 Stunden.',
     r'$\dfrac{20 - 12}{10 - 6} = 2$, also 2 °C pro Stunde.'])

# ---------------------------------------------------- meaning and notation ----
Q.q(r'Was gibt der Differenzenquotient $\dfrac{f(b) - f(a)}{b - a}$ geometrisch an?',
    [r'Den Anstieg der Sekante durch $(a \mid f(a))$ und $(b \mid f(b))$.',
     r'Den Anstieg der Tangente im Punkt $(a \mid f(a))$.',
     r'Den Flächeninhalt unter dem Graphen.', r'Die Länge der Strecke zwischen beiden Punkten.'],
    [r'Er ist Höhenunterschied durch Breitenunterschied zweier Kurvenpunkte.',
     r'Das ist der Anstieg der Geraden durch beide Punkte, der Sekante.'])

Q.q(r'Was gibt der Differentialquotient $f^{\prime}(x_0)$ an?',
    [r'Den Anstieg der Tangente im Punkt $(x_0 \mid f(x_0))$, die lokale Änderungsrate.',
     r'Den Anstieg der Sekante über $[0;\,x_0]$.', r'Den Funktionswert an der Stelle $x_0$.',
     r'Die mittlere Änderungsrate über die ganze Definitionsmenge.'],
    [r'Der Differentialquotient ist der Grenzwert der Differenzenquotienten für $h \to 0$.',
     r'Aus den Sekanten wird die Tangente, aus der mittleren die lokale Änderungsrate.'])

Q.q(r'Welcher Term ist der Differenzenquotient von $f$ an der Stelle $x_0$ mit der Schrittweite $h$?',
    [r'$\dfrac{f(x_0 + h) - f(x_0)}{h}$', r'$\dfrac{f(x_0 + h) - f(x_0)}{x_0}$',
     r'$\dfrac{f(x_0) + f(h)}{h}$', r'$f(x_0 + h) - f(x_0)$'],
    [r'Die Intervallbreite ist $(x_0 + h) - x_0 = h$.',
     r'Höhenunterschied $f(x_0 + h) - f(x_0)$ durch diese Breite.'])

Q.q(r'Der Wasserstand $W$ eines Flusses wird in cm gemessen, die Zeit $t$ in Stunden. Welche Einheit hat die Änderungsrate $W^{\prime}(t)$?',
    [r'cm/h', r'cm·h', r'h/cm', r'cm'],
    [r'Die Änderungsrate ist ein Quotient: Änderung von $W$ durch Änderung von $t$.',
     r'Einheit: cm durch h.'])

Q.q(r'Von wem stammt die Schreibweise $\dfrac{dy}{dx}$ für die Ableitung?',
    [r'Gottfried Wilhelm Leibniz', r'Isaac Newton', r'Leonhard Euler', r'Carl Friedrich Gauß'],
    [r'Leibniz dachte an das Verhältnis „unendlich kleiner“ Differenzen $dy$ und $dx$.',
     r'Newton schrieb $\dot{y}$ und sprach von Fluxionen. Beide fanden die Differentialrechnung im 17. Jahrhundert unabhängig voneinander.'])

# ------------------------------------------------- local rate via h -> 0 ----
Q.q(r'Für $f(x) = x^2$ und $x_0 = 3$ vereinfacht sich der Differenzenquotient zu $6 + h$. Wie groß ist der Anstieg der Tangente bei $x_0 = 3$?',
    [r'6', r'9', r'$6 + h$', r'3'],
    [r'$\dfrac{(3 + h)^2 - 9}{h} = \dfrac{6h + h^2}{h} = 6 + h$',
     r'Für $h \to 0$ bleibt 6.'])

Q.q(r'Bestimme die lokale Änderungsrate von $f(x) = x^2$ an der Stelle $x_0 = -2$.',
    [r'−4', r'4', r'−2', r'2'],
    [r'$\dfrac{(-2 + h)^2 - 4}{h} = \dfrac{-4h + h^2}{h} = -4 + h$',
     r'Für $h \to 0$: −4. Die Parabel fällt dort.'])

Q.q(r'Ein Körper fällt nach $s(t) = 5t^2$. Wie groß ist seine Momentangeschwindigkeit bei $t = 2$?',
    [r'20 m/s', r'10 m/s', r'40 m/s', r'5 m/s'],
    [r'$\dfrac{5(2 + h)^2 - 20}{h} = \dfrac{20h + 5h^2}{h} = 20 + 5h$',
     r'Für $h \to 0$: 20 m/s.'])

Q.q(r'Bestimme mit $h \to 0$ den Anstieg von $f(x) = x^3$ an der Stelle $x_0 = 1$.',
    [r'3', r'1', r'$3 + 3h + h^2$', r'0'],
    [r'$(1 + h)^3 = 1 + 3h + 3h^2 + h^3$',
     r'$\dfrac{(1 + h)^3 - 1}{h} = 3 + 3h + h^2$',
     r'Für $h \to 0$ bleibt 3.'])

Q.q(r'Wie lautet die Gleichung der Tangente an $f(x) = x^2$ im Punkt $(1 \mid 1)$?',
    [r'$y = 2x - 1$', r'$y = 2x + 1$', r'$y = x$', r'$y = 2x$'],
    [r'Anstieg: $\dfrac{(1 + h)^2 - 1}{h} = 2 + h \to 2$.',
     r'Ansatz $y = 2x + n$ mit dem Punkt $(1 \mid 1)$: $1 = 2 + n$, also $n = -1$.',
     r'Tangente $y = 2x - 1$.'])

Q.q(r'Ein Ball fliegt nach $h(t) = 20t - 5t^2$ ($h$ in m, $t$ in s). Wie schnell steigt er bei $t = 1$?',
    [r'10 m/s', r'15 m/s', r'20 m/s', r'5 m/s'],
    [r'$h(1) = 15$, $h(1 + k) = 20 + 20k - 5(1 + 2k + k^2) = 15 + 10k - 5k^2$',
     r'Differenzenquotient: $\dfrac{10k - 5k^2}{k} = 10 - 5k$',
     r'Für $k \to 0$: 10 m/s.'])

# --------------------------------------------------------------- context ----
Q.q(r'Die Kosten einer Produktion sind $K(x) = 0{,}5x^2 + 10$ (in €, $x$ in Stück). Wie stark steigen sie im Mittel zwischen 10 und 20 Stück?',
    [r'15 € pro Stück', r'150 € pro Stück', r'10 € pro Stück', r'20 € pro Stück'],
    [r'$K(10) = 60$, $K(20) = 210$',
     r'$\dfrac{210 - 60}{20 - 10} = 15$'])

Q.q(r'Die mittlere Änderungsrate von $f$ auf $[a;\,b]$ ist null. Was folgt daraus?',
    [r'$f(a) = f(b)$', r'$f$ ist auf $[a;\,b]$ konstant.', r'$f(a) = f(b) = 0$', r'$f$ hat in $[a;\,b]$ eine Nullstelle.'],
    [r'Der Zähler $f(b) - f(a)$ muss null sein.',
     r'Also $f(a) = f(b)$; dazwischen darf $f$ steigen und fallen, z. B. $x^2$ auf $[-1;\,1]$.'])

Q.q(r'Ein Auto fährt eine Stunde lang mit der mittleren Geschwindigkeit 80 km/h. Was ist sicher?',
    [r'Es hat in dieser Stunde 80 km zurückgelegt.', r'Der Tacho zeigte immer 80 km/h.',
     r'Es war nie schneller als 80 km/h.', r'Es fuhr nie langsamer als 80 km/h.'],
    [r'Die mittlere Geschwindigkeit ist eine mittlere Änderungsrate: Weg durch Zeit.',
     r'Sie sagt nichts über die Momentangeschwindigkeit zu einzelnen Zeitpunkten.',
     r'Sicher ist nur: 80 km in einer Stunde.'])


def check():
    import sympy as sp
    x, h = sp.symbols('x h')
    dq = lambda f, a, b: (f.subs(x, b) - f.subs(x, a)) / (b - a)
    loc = lambda f, x0: sp.limit((f.subs(x, x0 + h) - f.subs(x, x0)) / h, h, 0)
    assert dq(x ** 2, 1, 3) == 4
    assert dq(x ** 3, 0, 2) == 4
    assert dq(5 * x ** 2, 1, 3) == 20
    assert dq(sp.sqrt(x), 1, 4) == sp.Rational(1, 3)
    assert dq(1 / x, 1, 2) == -sp.Rational(1, 2)
    assert sp.Rational(20 - 12, 10 - 6) == 2
    assert sp.expand(((3 + h) ** 2 - 9) / h) == 6 + h and loc(x ** 2, 3) == 6
    assert sp.expand(((-2 + h) ** 2 - 4) / h) == -4 + h and loc(x ** 2, -2) == -4
    assert sp.expand((5 * (2 + h) ** 2 - 20) / h) == 20 + 5 * h
    assert sp.expand(((1 + h) ** 3 - 1) / h) == 3 + 3 * h + h ** 2
    assert loc(x ** 2, 1) == 2 and 1 - 2 == -1
    k = sp.symbols('k')
    H = 20 * x - 5 * x ** 2
    assert H.subs(x, 1) == 15 and sp.expand(H.subs(x, 1 + k)) == 15 + 10 * k - 5 * k ** 2 and loc(H, 1) == 10
    K = sp.Rational(1, 2) * x ** 2 + 10
    assert K.subs(x, 10) == 60 and K.subs(x, 20) == 210 and dq(K, 10, 20) == 15
    assert dq(x ** 2, -1, 1) == 0


Q.verify(check)
Q.save()
