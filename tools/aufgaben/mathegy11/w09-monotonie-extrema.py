#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 9 / KW 44 (LB 1): monotonicity and extrema - necessary
and sufficient condition, local and global extrema, interval notation.
Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=9, slug='monotonie-extrema', thema='Monotonie und Extrema', lb='LB 1',
         blurb='Monotonie über f′, notwendige und hinreichende Bedingung, Intervallschreibweise',
         comment='Blocks: monotonicity (1-3), conditions (4-6), computing extrema (7-13), global extrema and ranges (14-17), context and notation (18-20).')

# ----------------------------------------------------------- monotonicity ----
Q.q(r'In welchem Intervall ist $f(x) = x^2 - 4x$ streng monoton fallend?',
    [r'$(-\infty;\,2]$', r'$[2;\,\infty)$', r'$(-\infty;\,4]$', r'$[0;\,4]$'],
    [r'$f^{\prime}(x) = 2x - 4$',
     r'$f^{\prime}(x) < 0$ für $x < 2$.',
     r'Am Scheitel $x = 2$ selbst wechselt das Verhalten.'])

Q.q(r'Die Ableitung einer Funktion ist $f^{\prime}(x) = (x - 1)(x + 2)$. Wo fällt $f$?',
    [r'Zwischen −2 und 1', r'Für $x < -2$', r'Für $x > 1$', r'Nirgends'],
    [r'$f^{\prime}$ ist eine nach oben geöffnete Parabel mit den Nullstellen −2 und 1.',
     r'Dazwischen ist $f^{\prime}$ negativ, also fällt $f$ dort.'])

Q.q(r'Welche Aussage gilt für $f(x) = x^3 + 3x$?',
    [r'$f$ ist streng monoton steigend und hat keine Extrema.', r'$f$ hat einen Hochpunkt bei $x = -1$.',
     r'$f$ hat einen Tiefpunkt bei $x = 0$.', r'$f$ ist für $x < 0$ fallend.'],
    [r'$f^{\prime}(x) = 3x^2 + 3 \geq 3 > 0$ für alle $x$.',
     r'Der Graph steigt überall, waagerechte Tangenten gibt es nicht.'])

# ------------------------------------------------------------- conditions ----
Q.q(r'Welche Bedingung ist notwendig dafür, dass eine differenzierbare Funktion an der Stelle $x_0$ ein lokales Extremum hat?',
    [r'$f^{\prime}(x_0) = 0$', r'$f(x_0) = 0$', r'$f^{\prime\prime}(x_0) = 0$', r'$f^{\prime}(x_0) > 0$'],
    [r'An einem Hoch- oder Tiefpunkt ist die Tangente waagerecht.',
     r'Notwendig heißt: Ohne diese Bedingung geht es nicht. Allein reicht sie aber nicht.'])

Q.q(r'Für $f(x) = x^3$ gilt $f^{\prime}(0) = 0$. Hat $f$ bei 0 ein Extremum?',
    [r'Nein, $f^{\prime}$ wechselt dort nicht das Vorzeichen (Sattelpunkt).', r'Ja, einen Tiefpunkt.',
     r'Ja, einen Hochpunkt.', r'Das lässt sich nicht entscheiden.'],
    [r'$f^{\prime}(x) = 3x^2 \geq 0$: links und rechts von 0 steigt $f$.',
     r'Kein Vorzeichenwechsel, also kein Extremum.',
     r'Beispiel dafür, dass $f^{\prime}(x_0) = 0$ nicht hinreichend ist.'])

Q.q(r'Welche Bedingung ist hinreichend für einen lokalen Hochpunkt bei $x_0$?',
    [r'$f^{\prime}(x_0) = 0$ und $f^{\prime\prime}(x_0) < 0$', r'$f^{\prime}(x_0) = 0$ und $f^{\prime\prime}(x_0) > 0$',
     r'$f^{\prime}(x_0) = 0$', r'$f^{\prime\prime}(x_0) = 0$'],
    [r'$f^{\prime\prime}(x_0) < 0$ heißt: Der Graph ist dort rechtsgekrümmt.',
     r'Waagerechte Tangente plus Rechtskrümmung ergibt einen Hochpunkt.',
     r'Gleichwertig: $f^{\prime}$ wechselt bei $x_0$ das Vorzeichen von plus nach minus.'])

# ------------------------------------------------------ computing extrema ----
Q.q(r'An welchen Stellen hat $f(x) = x^3 - 3x$ Extrema?',
    [r'$x = -1$ und $x = 1$', r'$x = 0$', r'$x = -\sqrt{3}$, $x = 0$ und $x = \sqrt{3}$', r'$x = 3$'],
    [r'$f^{\prime}(x) = 3x^2 - 3 = 0$',
     r'$x^2 = 1$, also $x = \pm 1$.',
     r'$f^{\prime\prime}(x) = 6x$ ist dort ungleich null, beide sind Extremstellen.'])

Q.q(r'Welcher Punkt ist der Hochpunkt von $f(x) = x^3 - 3x$?',
    [r'$H(-1 \mid 2)$', r'$H(1 \mid -2)$', r'$H(-1 \mid -2)$', r'$H(0 \mid 0)$'],
    [r'$f^{\prime\prime}(-1) = -6 < 0$, also Hochpunkt bei $x = -1$.',
     r'$f(-1) = -1 + 3 = 2$'])

Q.q(r'Bestimme den Hochpunkt von $f(x) = -x^2 + 6x - 5$.',
    [r'$H(3 \mid 4)$', r'$H(3 \mid -5)$', r'$H(-3 \mid 4)$', r'$H(6 \mid -5)$'],
    [r'$f^{\prime}(x) = -2x + 6 = 0 \Rightarrow x = 3$',
     r'$f(3) = -9 + 18 - 5 = 4$',
     r'$f^{\prime\prime}(x) = -2 < 0$: Hochpunkt.'])

Q.q(r'Welche Extrema hat $f(x) = x^4 - 2x^2$?',
    [r'Hochpunkt $(0 \mid 0)$, Tiefpunkte $(-1 \mid -1)$ und $(1 \mid -1)$', r'Tiefpunkt $(0 \mid 0)$, Hochpunkte $(\pm 1 \mid 1)$',
     r'Nur den Tiefpunkt $(0 \mid 0)$', r'Tiefpunkte $(\pm\sqrt{2} \mid 0)$'],
    [r'$f^{\prime}(x) = 4x^3 - 4x = 4x(x^2 - 1) = 0 \Rightarrow x \in \{-1;\,0;\,1\}$',
     r'$f^{\prime\prime}(x) = 12x^2 - 4$: $f^{\prime\prime}(0) = -4$ (Hochpunkt), $f^{\prime\prime}(\pm 1) = 8$ (Tiefpunkte).',
     r'$f(0) = 0$, $f(\pm 1) = 1 - 2 = -1$'])

Q.q(r'Welcher Punkt ist ein Extrempunkt von $f(x) = x \cdot e^{-x}$?',
    [r'Hochpunkt $\left(1 \mid \dfrac{1}{e}\right)$', r'Tiefpunkt $(0 \mid 0)$', r'Hochpunkt $(1 \mid e)$', r'Tiefpunkt $\left(-1 \mid -e\right)$'],
    [r'$f^{\prime}(x) = e^{-x} - x e^{-x} = (1 - x)e^{-x}$',
     r'Nullstelle $x = 1$; davor ist $f^{\prime} > 0$, danach $f^{\prime} < 0$: Hochpunkt.',
     r'$f(1) = e^{-1} = \dfrac{1}{e}$'])

Q.q(r'Welchen Extrempunkt hat $f(x) = x - \ln x$ für $x > 0$?',
    [r'Tiefpunkt $(1 \mid 1)$', r'Hochpunkt $(1 \mid 1)$', r'Tiefpunkt $(e \mid e - 1)$', r'Tiefpunkt $(1 \mid 0)$'],
    [r'$f^{\prime}(x) = 1 - \dfrac{1}{x} = 0 \Rightarrow x = 1$',
     r'$f^{\prime\prime}(x) = \dfrac{1}{x^2} > 0$: Tiefpunkt.',
     r'$f(1) = 1 - 0 = 1$'])

Q.q(r'$f^{\prime}$ wechselt bei $x = 4$ das Vorzeichen von minus nach plus. Was hat $f$ dort?',
    [r'Einen Tiefpunkt', r'Einen Hochpunkt', r'Einen Wendepunkt', r'Eine Nullstelle'],
    [r'Vor $x = 4$ fällt $f$, danach steigt $f$.',
     r'Also liegt bei $x = 4$ ein lokales Minimum.'])

# ------------------------------------------- global extrema and ranges ----
Q.q(r'Wo nimmt $f(x) = x^3 - 3x$ auf dem Intervall $[-3;\,3]$ seinen größten Wert an?',
    [r'Am Rand bei $x = 3$ mit $f(3) = 18$', r'Im Hochpunkt bei $x = -1$ mit $f(-1) = 2$',
     r'Bei $x = 0$', r'Am Rand bei $x = -3$'],
    [r'Lokale Extrema: $f(-1) = 2$, $f(1) = -2$.',
     r'Ränder: $f(-3) = -27 + 9 = -18$, $f(3) = 27 - 9 = 18$.',
     r'Das globale Maximum liegt am Rand: Randwerte immer mitprüfen.'])

Q.q(r'Gib den Wertebereich von $f(x) = x^2 - 4x + 7$ an.',
    [r'$[3;\,\infty)$', r'$[7;\,\infty)$', r'$(-\infty;\,3]$', r'$\mathbb{R}$'],
    [r'$f^{\prime}(x) = 2x - 4 = 0 \Rightarrow x = 2$, $f(2) = 4 - 8 + 7 = 3$.',
     r'Nach oben geöffnete Parabel: Tiefpunkt $(2 \mid 3)$ ist globales Minimum.',
     r'$W = [3;\,\infty)$'])

Q.q(r'Gib den größtmöglichen Definitionsbereich von $f(x) = \ln(x - 2)$ an.',
    [r'$(2;\,\infty)$', r'$[2;\,\infty)$', r'$\mathbb{R} \setminus \{2\}$', r'$(0;\,\infty)$'],
    [r'Der Logarithmus ist nur für positive Argumente definiert.',
     r'$x - 2 > 0 \Leftrightarrow x > 2$; die 2 selbst gehört nicht dazu (runde Klammer).'])

Q.q(r'Wie wird der Definitionsbereich von $f(x) = \dfrac{1}{x}$ in Mengenschreibweise notiert?',
    [r'$\mathbb{R} \setminus \{0\}$', r'$\mathbb{R}$', r'$(0;\,\infty)$', r'$\{0\}$'],
    [r'Nur die Null ist verboten, denn durch null darf man nicht teilen.',
     r'$\mathbb{R} \setminus \{0\}$: alle reellen Zahlen ohne die 0.'])

# ------------------------------------------------------ context and notation ----
Q.q(r'Ein Gewinn wird durch $G(x) = -x^2 + 40x - 300$ beschrieben ($x$ in Stück, $G$ in €). Bei welcher Stückzahl ist er am größten und wie groß ist er?',
    [r'Bei 20 Stück: 100 €', r'Bei 40 Stück: 0 €', r'Bei 20 Stück: 400 €', r'Bei 10 Stück: 0 €'],
    [r'$G^{\prime}(x) = -2x + 40 = 0 \Rightarrow x = 20$',
     r'$G(20) = -400 + 800 - 300 = 100$',
     r'$G^{\prime\prime}(x) = -2 < 0$: Maximum.'])

Q.q(r'Was zeigt $f^{\prime\prime}(1) = 6 > 0$ für $f(x) = x^3 - 3x$ an der Stelle 1?',
    [r'Bei $x = 1$ liegt ein Tiefpunkt.', r'Bei $x = 1$ liegt ein Hochpunkt.',
     r'Bei $x = 1$ liegt ein Wendepunkt.', r'$f$ steigt bei $x = 1$.'],
    [r'$f^{\prime}(1) = 0$ und $f^{\prime\prime}(1) > 0$: Linkskrümmung mit waagerechter Tangente.',
     r'Also Tiefpunkt $T(1 \mid -2)$.'])

Q.q(r'Was ist der Unterschied zwischen einem lokalen und einem globalen Maximum?',
    [r'Lokal: größter Wert in einer Umgebung; global: größter Wert im ganzen Definitionsbereich.',
     r'Es gibt keinen Unterschied.', r'Ein globales Maximum liegt immer im Hochpunkt.',
     r'Ein lokales Maximum liegt immer am Rand.'],
    [r'Ein Hochpunkt ist nur in seiner Nähe der höchste Punkt.',
     r'Global kann ein anderer Hochpunkt oder ein Randwert größer sein.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    d = lambda e, n=1: sp.diff(e, x, n)
    assert sp.solve(d(x ** 2 - 4 * x), x) == [2]
    assert sorted(sp.solve((x - 1) * (x + 2), x)) == [-2, 1] and ((0 - 1) * (0 + 2)) < 0
    assert sp.solve(d(x ** 3 + 3 * x), x) == []
    f = x ** 3 - 3 * x
    assert sorted(sp.solve(d(f), x)) == [-1, 1] and d(f, 2).subs(x, -1) == -6 and f.subs(x, -1) == 2
    assert d(f, 2).subs(x, 1) == 6 and f.subs(x, 1) == -2
    assert f.subs(x, 3) == 18 and f.subs(x, -3) == -18
    g = -x ** 2 + 6 * x - 5
    assert sp.solve(d(g), x) == [3] and g.subs(x, 3) == 4
    k = x ** 4 - 2 * x ** 2
    assert sorted(sp.solve(d(k), x)) == [-1, 0, 1] and d(k, 2).subs(x, 0) == -4 and d(k, 2).subs(x, 1) == 8
    assert k.subs(x, 1) == -1 and k.subs(x, 0) == 0
    m = x * sp.exp(-x)
    assert sp.solve(d(m), x) == [1] and m.subs(x, 1) == sp.exp(-1)
    p = sp.symbols('p', positive=True)
    n = p - sp.log(p)
    assert sp.solve(sp.diff(n, p), p) == [1] and n.subs(p, 1) == 1
    q = x ** 2 - 4 * x + 7
    assert q.subs(x, 2) == 3
    G = -x ** 2 + 40 * x - 300
    assert sp.solve(d(G), x) == [20] and G.subs(x, 20) == 100


Q.verify(check)
Q.save()
