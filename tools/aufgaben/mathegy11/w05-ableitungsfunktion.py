#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 5 / KW 38 (LB 1): the derivative function - f(x) = x^2
by definition, from f to f', sketching the graph of f'. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=5, slug='ableitungsfunktion', thema='Die Ableitungsfunktion', lb='LB 1',
         blurb='Ableitung nach Definition, Tangenten, Graph der Ableitungsfunktion',
         comment='Blocks: derivative by definition (1-6), slopes and tangents (7-11), graph of f and f-prime (12-18), outlook (19-20).')

# ----------------------------------------------- derivative by definition ----
Q.q(r'Der Differenzenquotient von $f(x) = x^2$ ist $\dfrac{(x + h)^2 - x^2}{h}$. Wie lautet er vereinfacht?',
    [r'$2x + h$', r'$2x$', r'$x + h$', r'$2x + h^2$'],
    [r'$(x + h)^2 - x^2 = x^2 + 2xh + h^2 - x^2 = 2xh + h^2$',
     r'Durch $h$ teilen: $2x + h$.'])

Q.q(r'Welche Ableitungsfunktion hat $f(x) = x^2$?',
    [r'$f^{\prime}(x) = 2x$', r'$f^{\prime}(x) = x$', r'$f^{\prime}(x) = 2x + h$', r'$f^{\prime}(x) = x^2$'],
    [r'$f^{\prime}(x) = \lim\limits_{h \to 0} (2x + h)$',
     r'$= 2x$'])

Q.q(r'Welche Ableitungsfunktion hat $f(x) = x^3$? Der Differenzenquotient ist $3x^2 + 3xh + h^2$.',
    [r'$f^{\prime}(x) = 3x^2$', r'$f^{\prime}(x) = 3x^2 + 3x$', r'$f^{\prime}(x) = x^2$', r'$f^{\prime}(x) = 3x$'],
    [r'Für $h \to 0$ fallen $3xh$ und $h^2$ weg.',
     r'$f^{\prime}(x) = 3x^2$'])

Q.q(r'Welche Ableitungsfunktion hat $f(x) = 3x + 1$?',
    [r'$f^{\prime}(x) = 3$', r'$f^{\prime}(x) = 3x$', r'$f^{\prime}(x) = 1$', r'$f^{\prime}(x) = 4$'],
    [r'$\dfrac{3(x + h) + 1 - (3x + 1)}{h} = \dfrac{3h}{h} = 3$',
     r'Eine Gerade hat überall denselben Anstieg.'])

Q.q(r'Welche Ableitungsfunktion hat $f(x) = 7$?',
    [r'$f^{\prime}(x) = 0$', r'$f^{\prime}(x) = 7$', r'$f^{\prime}(x) = 7x$', r'$f^{\prime}(x) = 1$'],
    [r'$\dfrac{7 - 7}{h} = 0$',
     r'Der Graph ist waagerecht, sein Anstieg ist überall null.'])

Q.q(r'Für $f(x) = \dfrac{1}{x}$ ergibt der Differenzenquotient $-\dfrac{1}{x(x + h)}$. Welche Ableitung folgt?',
    [r'$f^{\prime}(x) = -\dfrac{1}{x^2}$', r'$f^{\prime}(x) = \dfrac{1}{x^2}$', r'$f^{\prime}(x) = -\dfrac{1}{x}$', r'$f^{\prime}(x) = \ln x$'],
    [r'Für $h \to 0$ wird aus $x(x + h)$ der Nenner $x^2$.',
     r'$f^{\prime}(x) = -\dfrac{1}{x^2}$; negativ, denn $\dfrac{1}{x}$ fällt auf beiden Ästen.'])

# --------------------------------------------------- slopes and tangents ----
Q.q(r'Wie groß ist der Anstieg von $f(x) = x^2$ an der Stelle $x = 3$?',
    [r'6', r'9', r'3', r'2'],
    [r'$f^{\prime}(x) = 2x$',
     r'$f^{\prime}(3) = 6$'])

Q.q(r'Wie lautet die Tangente an $f(x) = x^2$ an der Stelle $x_0 = -1$?',
    [r'$y = -2x - 1$', r'$y = -2x + 1$', r'$y = 2x + 3$', r'$y = -x$'],
    [r'$f(-1) = 1$, $f^{\prime}(-1) = -2$',
     r'$y = -2(x + 1) + 1 = -2x - 1$'])

Q.q(r'In welchem Punkt hat $f(x) = x^2$ den Anstieg 4?',
    [r'$P(2 \mid 4)$', r'$P(4 \mid 16)$', r'$P(2 \mid 2)$', r'$P(-2 \mid 4)$'],
    [r'$f^{\prime}(x) = 2x = 4$, also $x = 2$.',
     r'$f(2) = 4$, Punkt $(2 \mid 4)$.'])

Q.q(r'An welcher Stelle ist die Tangente an $f(x) = x^2$ parallel zur Geraden $y = -6x + 1$?',
    [r'$x = -3$', r'$x = 3$', r'$x = -6$', r'$x = \dfrac{1}{6}$'],
    [r'Parallel heißt: gleicher Anstieg, also $f^{\prime}(x) = -6$.',
     r'$2x = -6$, also $x = -3$.'])

Q.q(r'Warum haben $f(x) = x^2$ und $g(x) = x^2 + 5$ dieselbe Ableitung?',
    [r'Der Graph von $g$ ist nur nach oben verschoben, die Anstiege bleiben gleich.',
     r'Weil 5 eine Primzahl ist.', r'Sie haben nicht dieselbe Ableitung.', r'Weil beide Parabeln dieselben Nullstellen haben.'],
    [r'Verschieben in $y$-Richtung ändert an keiner Stelle den Anstieg.',
     r'Rechnerisch: Die Konstante 5 fällt im Differenzenquotienten weg.'])

# ------------------------------------------------ graph of f and f-prime ----
Q.q(r'Der Graph von $f$ ist eine nach oben geöffnete Parabel mit Scheitel bei $x = 2$. Welche Aussage über $f^{\prime}$ stimmt?',
    [r'$f^{\prime}(2) = 0$, links davon ist $f^{\prime}$ negativ, rechts positiv.',
     r'$f^{\prime}(2) = 0$, links davon ist $f^{\prime}$ positiv, rechts negativ.',
     r'$f^{\prime}$ ist überall positiv.', r'$f^{\prime}$ ist ebenfalls eine Parabel.'],
    [r'Im Scheitel ist die Tangente waagerecht: $f^{\prime}(2) = 0$.',
     r'Links fällt die Parabel ($f^{\prime} < 0$), rechts steigt sie ($f^{\prime} > 0$).',
     r'Der Graph von $f^{\prime}$ ist eine steigende Gerade durch $(2 \mid 0)$.'])

Q.q(r'$f$ hat an der Stelle $x_0$ einen Hochpunkt. Was gilt für den Graphen von $f^{\prime}$ dort?',
    [r'Er schneidet die $x$-Achse von oben nach unten.', r'Er schneidet die $x$-Achse von unten nach oben.',
     r'Er hat dort ebenfalls einen Hochpunkt.', r'Er hat dort eine Polstelle.'],
    [r'Vor dem Hochpunkt steigt $f$: $f^{\prime} > 0$.',
     r'Danach fällt $f$: $f^{\prime} < 0$.',
     r'Also Nullstelle von $f^{\prime}$ mit Vorzeichenwechsel von plus nach minus.'])

Q.q(r'$f$ steigt im Intervall $(1;\,4)$ überall. Was gilt dort für $f^{\prime}$?',
    [r'$f^{\prime}(x) \geq 0$', r'$f^{\prime}(x) \leq 0$', r'$f^{\prime}(x) = 0$', r'$f^{\prime}$ steigt ebenfalls.'],
    [r'Wo der Graph steigt, haben die Tangenten keinen negativen Anstieg.',
     r'Der Graph von $f^{\prime}$ liegt dort nicht unterhalb der $x$-Achse.',
     r'Ob $f^{\prime}$ selbst steigt, ist damit nicht gesagt.'])

Q.q(r'Der Graph von $f^{\prime}$ ist die waagerechte Gerade $y = 3$. Was ist der Graph von $f$?',
    [r'Eine Gerade mit dem Anstieg 3.', r'Die waagerechte Gerade $y = 3$.', r'Eine Parabel.', r'Eine Gerade durch den Ursprung mit dem Anstieg 0.'],
    [r'Konstante Ableitung heißt: überall derselbe Anstieg.',
     r'Also ist $f$ eine Gerade $f(x) = 3x + n$; $n$ lässt sich nicht ablesen.'])

Q.q(r'$f$ ist eine Funktion dritten Grades mit Hochpunkt bei $x = -1$ und Tiefpunkt bei $x = 1$. Wie sieht der Graph von $f^{\prime}$ aus?',
    [r'Eine nach oben geöffnete Parabel mit den Nullstellen −1 und 1.',
     r'Eine nach unten geöffnete Parabel mit den Nullstellen −1 und 1.',
     r'Eine Gerade durch $(-1 \mid 0)$ und $(1 \mid 0)$.', r'Eine Parabel mit Scheitel bei $x = 1$.'],
    [r'An den Extremstellen ist $f^{\prime} = 0$: Nullstellen bei −1 und 1.',
     r'Zwischen den Extrema fällt $f$, also $f^{\prime} < 0$; außen steigt $f$, also $f^{\prime} > 0$.',
     r'Das passt zu einer nach oben geöffneten Parabel.'])

Q.q(r'Ist $f(x) = |x|$ an der Stelle 0 differenzierbar?',
    [r'Nein, links ist der Anstieg −1, rechts 1: Der Graph hat einen Knick.',
     r'Ja, die Ableitung ist 0.', r'Ja, die Ableitung ist 1.', r'Nein, weil $|x|$ bei 0 unstetig ist.'],
    [r'Für $h > 0$ ist der Differenzenquotient $\dfrac{|h|}{h} = 1$, für $h < 0$ ist er −1.',
     r'Die einseitigen Grenzwerte sind verschieden, also gibt es keine Tangente.',
     r'Stetig ist $|x|$ trotzdem.'])

Q.q(r'Welche Formel beschreibt die Ableitung von $f$ an der Stelle $x_0$?',
    [r'$f^{\prime}(x_0) = \lim\limits_{h \to 0} \dfrac{f(x_0 + h) - f(x_0)}{h}$',
     r'$f^{\prime}(x_0) = \dfrac{f(x_0 + 1) - f(x_0)}{1}$',
     r'$f^{\prime}(x_0) = \lim\limits_{h \to 0} \bigl(f(x_0 + h) - f(x_0)\bigr)$',
     r'$f^{\prime}(x_0) = \dfrac{f(x_0)}{x_0}$'],
    [r'Erst der Differenzenquotient, dann der Grenzübergang $h \to 0$.',
     r'Ohne den Nenner $h$ wäre der Grenzwert bei stetigen Funktionen immer null.'])

# --------------------------------------------------------------- outlook ----
Q.q(r'Zu welcher Funktion gehört die Ableitung $f^{\prime}(x) = 4x^3$?',
    [r'$f(x) = x^4$', r'$f(x) = 12x^2$', r'$f(x) = 4x^4$', r'$f(x) = x^3$'],
    [r'Nach dem Muster $x^2 \mapsto 2x$, $x^3 \mapsto 3x^2$ gilt $x^4 \mapsto 4x^3$.',
     r'Das ist die Umkehrung des Differenzierens; auch $x^4 + 1$ hätte diese Ableitung.'])

Q.q(r'Für welche Funktion ist die Ableitungsfunktion überall null?',
    [r'$f(x) = -2$', r'$f(x) = x$', r'$f(x) = x^2$', r'$f(x) = \dfrac{1}{x}$'],
    [r'Anstieg null an jeder Stelle heißt: waagerechter Graph.',
     r'Das ist eine konstante Funktion wie $f(x) = -2$.'])


def check():
    import sympy as sp
    x, h = sp.symbols('x h')
    D = lambda f: sp.limit((f.subs(x, x + h) - f) / h, h, 0)
    assert sp.expand(((x + h) ** 2 - x ** 2) / h) == 2 * x + h and D(x ** 2) == 2 * x
    assert sp.expand(((x + h) ** 3 - x ** 3) / h) == 3 * x ** 2 + 3 * x * h + h ** 2 and D(x ** 3) == 3 * x ** 2
    assert D(3 * x + 1) == 3 and D(7 + 0 * x) == 0
    assert sp.simplify((1 / (x + h) - 1 / x) / h + 1 / (x * (x + h))) == 0 and D(1 / x) == -1 / x ** 2
    assert D(x ** 2).subs(x, 3) == 6
    assert (x ** 2).subs(x, -1) == 1 and D(x ** 2).subs(x, -1) == -2 and sp.expand(-2 * (x + 1) + 1) == -2 * x - 1
    assert sp.solve(2 * x - 4, x) == [2] and sp.solve(2 * x + 6, x) == [-3]
    assert D(x ** 2 + 5) == D(x ** 2)
    assert sp.limit(sp.Abs(h) / h, h, 0, '+') == 1 and sp.limit(sp.Abs(h) / h, h, 0, '-') == -1
    assert D(x ** 4) == 4 * x ** 3 and D(-2 + 0 * x) == 0
    f3 = x ** 3 - 3 * x                    # cubic with extrema at -1 (max) and 1 (min)
    assert sp.solve(sp.diff(f3, x), x) == [-1, 1] and sp.diff(f3, x, 2).subs(x, -1) < 0


Q.verify(check)
Q.save()
