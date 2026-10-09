#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 10 / KW 45 (LB 1): curvature and inflection points,
zeros, symmetry. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=10, slug='wendepunkte-symmetrie', thema='Wendepunkte, Nullstellen und Symmetrie', lb='LB 1',
         blurb='Krümmung und Wendepunkte über f″, Nullstellen, Symmetrie',
         comment='Blocks: curvature and inflection points (1-8), zeros (9-13), symmetry (14-16), context and mixed (17-20).')

# ------------------------------------------ curvature and inflection points ----
Q.q(r'Was bedeutet $f^{\prime\prime}(x) > 0$ in einem Intervall?',
    [r'Der Graph ist dort linksgekrümmt.', r'Der Graph ist dort rechtsgekrümmt.', r'Der Graph steigt dort.', r'Der Graph liegt über der $x$-Achse.'],
    [r'$f^{\prime\prime} > 0$ heißt: $f^{\prime}$ wächst, die Tangenten werden steiler.',
     r'Fährt man den Graphen entlang, lenkt man nach links.'])

Q.q(r'Welche Bedingung ist notwendig für einen Wendepunkt bei $x_0$?',
    [r'$f^{\prime\prime}(x_0) = 0$', r'$f^{\prime}(x_0) = 0$', r'$f(x_0) = 0$', r'$f^{\prime\prime\prime}(x_0) = 0$'],
    [r'Im Wendepunkt wechselt die Krümmung.',
     r'Dort hat $f^{\prime\prime}$ einen Vorzeichenwechsel, also eine Nullstelle.'])

Q.q(r'Bestimme die Wendestelle von $f(x) = x^3 - 3x^2$.',
    [r'$x = 1$', r'$x = 0$', r'$x = 2$', r'$x = 3$'],
    [r'$f^{\prime}(x) = 3x^2 - 6x$, $f^{\prime\prime}(x) = 6x - 6$',
     r'$6x - 6 = 0 \Rightarrow x = 1$',
     r'$f^{\prime\prime\prime}(x) = 6 \neq 0$: tatsächlich Wendestelle.'])

Q.q(r'Welcher Punkt ist der Wendepunkt von $f(x) = x^3 - 3x^2$?',
    [r'$W(1 \mid -2)$', r'$W(1 \mid 2)$', r'$W(0 \mid 0)$', r'$W(2 \mid -4)$'],
    [r'Wendestelle $x = 1$ (siehe vorige Aufgabe).',
     r'$f(1) = 1 - 3 = -2$'])

Q.q(r'Wie lautet die Wendetangente von $f(x) = x^3 - 3x^2$ im Punkt $W(1 \mid -2)$?',
    [r'$y = -3x + 1$', r'$y = -3x - 2$', r'$y = 3x - 5$', r'$y = -2$'],
    [r'$f^{\prime}(1) = 3 - 6 = -3$',
     r'$y = -3(x - 1) - 2 = -3x + 1$'])

Q.q(r'Für $f(x) = x^4$ gilt $f^{\prime\prime}(0) = 0$. Hat der Graph bei 0 einen Wendepunkt?',
    [r'Nein, $f^{\prime\prime}(x) = 12x^2$ wechselt das Vorzeichen nicht.', r'Ja, weil $f^{\prime\prime}(0) = 0$.',
     r'Ja, einen Sattelpunkt.', r'Das kann man nicht entscheiden.'],
    [r'$f^{\prime\prime}(x) = 12x^2 \geq 0$: überall linksgekrümmt.',
     r'Ohne Krümmungswechsel kein Wendepunkt; bei 0 liegt ein Tiefpunkt.'])

Q.q(r'Was ist ein Sattelpunkt?',
    [r'Ein Wendepunkt mit waagerechter Tangente, z. B. $(0 \mid 0)$ bei $f(x) = x^3$.',
     r'Ein Hochpunkt mit $f^{\prime\prime} = 0$.', r'Eine doppelte Nullstelle.', r'Ein Punkt, in dem $f$ nicht definiert ist.'],
    [r'Bei $x^3$ gilt $f^{\prime}(0) = 0$ und $f^{\prime\prime}(0) = 0$ mit Vorzeichenwechsel von $f^{\prime\prime}$.',
     r'Die Krümmung wechselt, die Tangente ist waagerecht.'])

Q.q(r'Bestimme die Wendestellen von $f(x) = x^4 - 6x^2$.',
    [r'$x = -1$ und $x = 1$', r'$x = 0$', r'$x = -\sqrt{3}$ und $x = \sqrt{3}$', r'$x = -\sqrt{6}$ und $x = \sqrt{6}$'],
    [r'$f^{\prime\prime}(x) = 12x^2 - 12$',
     r'$12x^2 - 12 = 0 \Rightarrow x = \pm 1$, jeweils mit Vorzeichenwechsel.'])

# ----------------------------------------------------------------- zeros ----
Q.q(r'Bestimme die Nullstellen von $f(x) = x^3 - 4x$.',
    [r'$x \in \{-2;\,0;\,2\}$', r'$x \in \{0;\,4\}$', r'$x \in \{-2;\,2\}$', r'$x \in \{0;\,2\}$'],
    [r'$x$ ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$.',
     r'Ein Produkt ist null, wenn ein Faktor null ist.'])

Q.q(r'Bestimme die Nullstellen von $f(x) = x^4 - 5x^2 + 4$.',
    [r'$x \in \{-2;\,-1;\,1;\,2\}$', r'$x \in \{1;\,4\}$', r'$x \in \{-1;\,1\}$', r'$x \in \{-4;\,-1;\,1;\,4\}$'],
    [r'Substitution $z = x^2$: $z^2 - 5z + 4 = 0$ mit $z = 1$ oder $z = 4$.',
     r'Rücksubstitution: $x^2 = 1$ oder $x^2 = 4$.'])

Q.q(r'Was gilt für die Nullstellen von $f(x) = (x - 1)^2 (x + 3)$?',
    [r'Bei 1 berührt der Graph die $x$-Achse, bei −3 schneidet er sie.', r'Bei −1 und 3 schneidet der Graph die $x$-Achse.',
     r'Bei 1 schneidet der Graph die $x$-Achse, bei −3 berührt er sie.', r'Es gibt drei verschiedene Nullstellen.'],
    [r'$x = 1$ ist doppelte Nullstelle: kein Vorzeichenwechsel, der Graph berührt die Achse.',
     r'$x = -3$ ist einfache Nullstelle: Vorzeichenwechsel.'])

Q.q(r'Bestimme die Nullstelle von $f(x) = e^x - 1$.',
    [r'$x = 0$', r'$x = 1$', r'$x = e$', r'Es gibt keine.'],
    [r'$e^x = 1$',
     r'$x = \ln 1 = 0$'])

Q.q(r'Hat $f(x) = x^2 e^x$ Nullstellen?',
    [r'Ja, nur $x = 0$ (doppelt).', r'Nein, $e^x$ ist nie null.', r'Ja, $x = 0$ und $x = -1$.', r'Ja, $x = 1$.'],
    [r'$e^x > 0$ für alle $x$, nur $x^2$ kann null werden.',
     r'Also $x = 0$; dort berührt der Graph die $x$-Achse.'])

# -------------------------------------------------------------- symmetry ----
Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^4 - 3x^2 + 1$?',
    [r'Achsensymmetrie zur $y$-Achse', r'Punktsymmetrie zum Ursprung', r'Beide', r'Keine'],
    [r'Nur gerade Exponenten (auch $1 = x^0$).',
     r'$f(-x) = f(x)$'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^3 - 2x$?',
    [r'Punktsymmetrie zum Ursprung', r'Achsensymmetrie zur $y$-Achse', r'Beide', r'Keine'],
    [r'Nur ungerade Exponenten.',
     r'$f(-x) = -x^3 + 2x = -f(x)$'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^3 + x^2$?',
    [r'Keine der beiden', r'Achsensymmetrie zur $y$-Achse', r'Punktsymmetrie zum Ursprung', r'Beide'],
    [r'Gerade und ungerade Exponenten gemischt.',
     r'$f(-1) = 0$, $f(1) = 2$: weder $f(-x) = f(x)$ noch $f(-x) = -f(x)$.'])

# ----------------------------------------------------- context and mixed ----
Q.q(r'Die Zahl der Neuerkrankten wird durch $f(t) = -t^3 + 6t^2$ beschrieben ($t$ in Wochen). Wann nimmt sie am stärksten zu?',
    [r'Bei $t = 2$', r'Bei $t = 4$', r'Bei $t = 6$', r'Bei $t = 0$'],
    [r'Stärkste Zunahme heißt: $f^{\prime}$ maximal, also Wendestelle.',
     r'$f^{\prime\prime}(t) = -6t + 12 = 0 \Rightarrow t = 2$',
     r'$f^{\prime\prime\prime} = -6 < 0$: Dort ist $f^{\prime}$ am größten.'])

Q.q(r'Bestimme die Wendestelle von $f(x) = x e^x$.',
    [r'$x = -2$', r'$x = -1$', r'$x = 0$', r'$x = 2$'],
    [r'$f^{\prime}(x) = (x + 1)e^x$, $f^{\prime\prime}(x) = (x + 2)e^x$',
     r'$f^{\prime\prime}(x) = 0 \Rightarrow x = -2$ mit Vorzeichenwechsel.'])

Q.q(r'Welche Wendestelle hat $f(x) = \sin x$ im offenen Intervall $(0;\,2\pi)$?',
    [r'$x = \pi$', r'$x = \dfrac{\pi}{2}$', r'$x = \dfrac{3\pi}{2}$', r'Keine'],
    [r'$f^{\prime\prime}(x) = -\sin x$',
     r'Nullstellen von $\sin x$ in $(0;\,2\pi)$: nur $x = \pi$; dort wechselt die Krümmung.'])

Q.q(r'Ein Graph ist punktsymmetrisch zum Ursprung und durch $(0 \mid 0)$ hindurch differenzierbar. Was gilt sicher?',
    [r'$f(0) = 0$', r'$f^{\prime}(0) = 0$', r'$f$ hat bei 0 ein Extremum.', r'$f$ ist eine Gerade.'],
    [r'Punktsymmetrie: $f(-x) = -f(x)$, für $x = 0$ also $f(0) = -f(0)$.',
     r'Daraus folgt $f(0) = 0$. Der Anstieg dort kann beliebig sein, z. B. $x^3 - 2x$.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    d = lambda e, n=1: sp.diff(e, x, n)
    f = x ** 3 - 3 * x ** 2
    assert sp.solve(d(f, 2), x) == [1] and f.subs(x, 1) == -2 and d(f).subs(x, 1) == -3
    assert sp.expand(-3 * (x - 1) - 2) == -3 * x + 1
    assert d(x ** 4, 2) == 12 * x ** 2
    assert sorted(sp.solve(d(x ** 4 - 6 * x ** 2, 2), x)) == [-1, 1]
    assert sorted(sp.solve(x ** 3 - 4 * x, x)) == [-2, 0, 2]
    assert sorted(sp.solve(x ** 4 - 5 * x ** 2 + 4, x)) == [-2, -1, 1, 2]
    assert sorted(sp.solve((x - 1) ** 2 * (x + 3), x)) == [-3, 1]
    assert sp.solve(sp.exp(x) - 1, x) == [0] and sp.solve(x ** 2 * sp.exp(x), x) == [0]
    p = x ** 4 - 3 * x ** 2 + 1
    assert sp.expand(p.subs(x, -x) - p) == 0
    q = x ** 3 - 2 * x
    assert sp.expand(q.subs(x, -x) + q) == 0
    r = x ** 3 + x ** 2
    assert r.subs(x, -1) == 0 and r.subs(x, 1) == 2
    t = -x ** 3 + 6 * x ** 2
    assert sp.solve(d(t, 2), x) == [2]
    assert sp.solve(d(x * sp.exp(x), 2), x) == [-2]
    assert [s for s in sp.solve(sp.sin(x), x) if 0 < s < 2 * sp.pi] == [sp.pi]


Q.verify(check)
Q.save()
