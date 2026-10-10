#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 22 / KW 5 (LB 3): Parabeln y = a · x² + c -
Strecken, Stauchen, Spiegeln, Verschieben, Monotonie. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=22, slug='parabel-a-c', thema='Parabeln der Form y = a · x² + c', lb='LB 3',
        blurb='Gestreckt, gestaucht, nach unten geöffnet, verschoben, Nullstellen, Maximum und Minimum',
        comment='Blocks: effect of a (1-3, 18), effect of c (4, 16-17), values, zeros and ranges (5-8, 10, 12), extremum and monotony (9, 15), context (11, 13-14, 19-20).')

# -------------------------------------------------------------- Einfluss a ----
Q.q(r'Wie unterscheidet sich der Graph von $y = 2x^2$ von der Normalparabel?',
    [r'Er ist gestreckt (enger).', r'Er ist gestaucht (weiter).', r'Er ist nach unten geöffnet.', r'Er ist um 2 nach oben verschoben.'],
    [r'Alle Funktionswerte sind doppelt so groß: Die Parabel steigt schneller.',
     r'Für $|a| > 1$ ist die Parabel gestreckt.'])

Q.q(r'Wie unterscheidet sich der Graph von $y = 0{,}5x^2$ von der Normalparabel?',
    [r'Er ist gestaucht (weiter).', r'Er ist gestreckt (enger).', r'Er ist nach unten geöffnet.', r'Er ist um 0,5 nach unten verschoben.'],
    [r'Für $0 < a < 1$ sind die Werte kleiner: Die Parabel ist flacher und weiter.'])

Q.q(r'Wie sieht der Graph von $y = -x^2$ aus?',
    [r'wie die Normalparabel, aber an der $x$-Achse gespiegelt (nach unten geöffnet)', r'wie die Normalparabel, um 1 nach unten verschoben',
     r'wie die Normalparabel, an der $y$-Achse gespiegelt', r'eine Gerade'],
    [r'Jeder Funktionswert wechselt das Vorzeichen.',
     r'Der Scheitelpunkt $(0 \mid 0)$ ist jetzt der höchste Punkt.'])

# -------------------------------------------------------------- Einfluss c ----
Q.q(r'Welchen Scheitelpunkt hat $y = x^2 + 3$?',
    [r'$S(0 \mid 3)$', r'$S(3 \mid 0)$', r'$S(-3 \mid 0)$', r'$S(0 \mid -3)$'],
    [r'$+3$ verschiebt die Normalparabel um 3 nach oben.'])

Q.q(r'Welche Nullstellen hat $y = x^2 - 4$?',
    [r'$x = -2$ und $x = 2$', r'$x = 4$', r'$x = -4$ und $x = 4$', r'keine'],
    [r'$x^2 - 4 = 0$, also $x^2 = 4$.',
     r'$x = \pm 2$'])

Q.q(r'Welche Nullstellen hat $y = -2x^2 + 8$?',
    [r'$x = -2$ und $x = 2$', r'$x = -4$ und $x = 4$', r'$x = 8$', r'keine'],
    [r'$-2x^2 + 8 = 0$, also $x^2 = 4$.',
     r'$x = \pm 2$'])

Q.q(r'Welcher Wert gehört bei $y = 3x^2$ zu $x = -2$?',
    [r'12', r'−12', r'36', r'−6'],
    [r'Erst quadrieren, dann mal 3: $3 \cdot (-2)^2 = 3 \cdot 4 = 12$.',
     r'36 wäre $(3 \cdot (-2))^2$.'])

Q.q(r'Welchen Wertebereich hat $y = -x^2 + 5$?',
    [r'alle $y \leq 5$', r'alle $y \geq 5$', r'alle Zahlen', r'alle $y \geq -5$'],
    [r'Die Parabel ist nach unten geöffnet, der Scheitel $(0 \mid 5)$ ist der höchste Punkt.'])

Q.q(r'Hat $y = -0{,}5x^2 + 2$ im Scheitelpunkt ein Maximum oder ein Minimum?',
    [r'ein Maximum, weil $a < 0$ ist', r'ein Minimum, weil $c > 0$ ist', r'ein Minimum, weil $a < 0$ ist', r'weder noch'],
    [r'Bei $a < 0$ ist die Parabel nach unten geöffnet.',
     r'Der Scheitelpunkt $(0 \mid 2)$ ist der höchste Punkt: Maximum.'])

Q.q(r'Hat $y = 0{,}5x^2 + 1$ Nullstellen?',
    [r'Nein, alle Werte sind mindestens 1.', r'Ja, $x = \pm 1$.', r'Ja, $x = -2$.', r'Ja, $x = 0$.'],
    [r'Die Parabel ist nach oben geöffnet und hat den tiefsten Punkt $(0 \mid 1)$.',
     r'Sie erreicht die $x$-Achse nie.'])

# ---------------------------------------------------------------- Kontext ----
Q.q(r'Ein Brückenbogen wird durch $y = -0{,}02x^2 + 8$ beschrieben (in m). Wie weit ist er am Boden gespannt?',
    [r'40 m', r'20 m', r'8 m', r'400 m'],
    [r'Fußpunkte: $-0{,}02x^2 + 8 = 0$, also $x^2 = 400$.',
     r'$x = \pm 20$, die Spannweite ist $40$ m.'])

Q.q(r'Eine Parabel $y = a \cdot x^2 + 1$ geht durch $(2 \mid 9)$. Wie groß ist $a$?',
    [r'$a = 2$', r'$a = 4$', r'$a = 2{,}5$', r'$a = 8$'],
    [r'$9 = a \cdot 4 + 1$',
     r'$4a = 8$, also $a = 2$.'])

Q.q(r'Ein fallender Stein legt in $t$ Sekunden ungefähr $s = 5t^2$ Meter zurück. Wie weit fällt er in 3 Sekunden?',
    [r'45 m', r'15 m', r'225 m', r'30 m'],
    [r'$s = 5 \cdot 9 = 45$ m'])

Q.q(r'Wie lange braucht ein Stein nach $s = 5t^2$ für 80 m Fallhöhe?',
    [r'4 s', r'16 s', r'8 s', r'2 s'],
    [r'$5t^2 = 80$, also $t^2 = 16$.',
     r'$t = 4$ s (die negative Lösung ergibt hier keinen Sinn).'])

Q.q(r'Wie verhält sich $y = -x^2$ für $x > 0$?',
    [r'fallend', r'steigend', r'konstant', r'erst fallend, dann steigend'],
    [r'Für $x = 1, 2, 3$ ist $y = -1, -4, -9$.',
     r'Rechts vom Scheitel fällt eine nach unten geöffnete Parabel.'])

Q.q(r'Eine Normalparabel ist so verschoben, dass sie die $y$-Achse bei $-3$ schneidet und ihr Scheitel auf der $y$-Achse liegt. Wie lautet ihre Gleichung?',
    [r'$y = x^2 - 3$', r'$y = x^2 + 3$', r'$y = -3x^2$', r'$y = (x - 3)^2$'],
    [r'Scheitel $(0 \mid -3)$: Verschiebung um 3 nach unten.'])

Q.q(r'Die Normalparabel wird um 2 nach unten verschoben. Welche Gleichung ergibt sich?',
    [r'$y = x^2 - 2$', r'$y = (x - 2)^2$', r'$y = x^2 + 2$', r'$y = -2x^2$'],
    [r'Verschiebung in $y$-Richtung: $c$ addieren, hier $c = -2$.'])

Q.q(r'Wie hängen die Graphen von $y = 3x^2$ und $y = -3x^2$ zusammen?',
    [r'Sie sind an der $x$-Achse gespiegelt.', r'Sie sind an der $y$-Achse gespiegelt.', r'Sie sind gleich.', r'Sie sind gegeneinander verschoben.'],
    [r'Zu jedem $x$ haben die Funktionswerte entgegengesetzte Vorzeichen.'])

Q.q(r'In welchen Punkten schneiden sich $y = x^2$ und $y = -x^2 + 8$?',
    [r'$(-2 \mid 4)$ und $(2 \mid 4)$', r'$(0 \mid 8)$', r'$(-4 \mid 16)$ und $(4 \mid 16)$', r'Sie schneiden sich nicht.'],
    [r'$x^2 = -x^2 + 8$, also $2x^2 = 8$ und $x^2 = 4$.',
     r'$x = \pm 2$, $y = 4$'])

Q.q(r'Ein Beet ist ein Quadrat mit der Seite $x$ m, dazu kommt ein fester Weg von 5 m². Welche Funktion beschreibt die Gesamtfläche?',
    [r'$A(x) = x^2 + 5$', r'$A(x) = 5x^2$', r'$A(x) = (x + 5)^2$', r'$A(x) = 4x + 5$'],
    [r'Quadrat: $x^2$, dazu 5 m².',
     r'Der Graph ist die um 5 nach oben verschobene Normalparabel (nur für $x > 0$ sinnvoll).'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    assert sorted(sp.solve(x**2 - 4, x)) == [-2, 2] and sorted(sp.solve(-2*x**2 + 8, x)) == [-2, 2]
    assert 3 * (-2) ** 2 == 12 and (3 * -2) ** 2 == 36
    assert sp.solve(sp.Rational(1, 2)*x**2 + 1, x) == [-sp.sqrt(2)*sp.I, sp.sqrt(2)*sp.I]
    assert sorted(sp.solve(-sp.Rational(2, 100)*x**2 + 8, x)) == [-20, 20]
    assert sp.solve(4*x + 1 - 9, x) == [2]
    assert 5 * 3 ** 2 == 45 and sp.solve(5*x**2 - 80, x) == [-4, 4]
    assert sorted(sp.solve(x**2 - (-x**2 + 8), x)) == [-2, 2] and 2 ** 2 == 4


Q.verify(check)
Q.save()
