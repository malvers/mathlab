#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 4 / KW 37 (LB 1): continuity at a point, on an interval and on the domain;
parameters that make a function continuous, kinds of discontinuity - 7 questions of the Grundkurs sheet, 13 new.
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=4, slug='stetigkeit', thema='Stetigkeit', lb='LB 1',
           blurb='an einer Stelle, im Intervall, im Definitionsbereich; Parameter, Unstetigkeitsstellen',
           comment='Questions 1-7 from the Grundkurs sheet (mathegy11/w03), 8-20 Leistungskurs.')

qs, check_gk = harvest('w03-grenzwert-stetigkeit.py', [11, 12, 13, 14, 15, 16, 19])
for a, k in qs:
    Q.q(*a, **k)

# --------------------------------------------------- interval and domain ----
Q.q(r'Wann heißt eine Funktion stetig im Intervall $[a;\,b]$?',
    [r'Wenn sie an jeder inneren Stelle stetig ist und an den Rändern einseitig stetig.', r'Wenn sie in $[a;\,b]$ monoton ist.',
     r'Wenn $f(a) = f(b)$ gilt.', r'Wenn sie in $[a;\,b]$ eine Nullstelle hat.'],
    [r'Stetigkeit im Intervall heißt: an jeder Stelle des Intervalls.',
     r'An den Rändern zählt nur der einseitige Grenzwert von innen.'])

Q.q(r'Ist $f(x) = \dfrac{1}{x}$ eine stetige Funktion?',
    [r'Ja, sie ist an jeder Stelle ihres Definitionsbereichs $\mathbb{R} \setminus \{0\}$ stetig.', r'Nein, sie hat bei 0 einen Sprung.',
     r'Nein, weil man den Graphen nicht ohne Absetzen zeichnen kann.', r'Nur für $x > 0$.'],
    [r'Stetigkeit wird nur an Stellen des Definitionsbereichs geprüft; 0 gehört nicht dazu.',
     r'An jeder Stelle $x_0 \neq 0$ gilt $\lim\limits_{x \to x_0} \tfrac{1}{x} = \tfrac{1}{x_0}$.',
     r'Das Absetzen beim Zeichnen passiert an der Definitionslücke, nicht an einer Stelle des Definitionsbereichs.'])

Q.q(r'Welche Unstetigkeitsstellen hat $f(x) = \dfrac{x - 1}{x^2 - 1}$, wenn man $f$ auf ganz $\mathbb{R}$ betrachten will?',
    [r'bei $x = 1$ eine behebbare Lücke, bei $x = -1$ eine Polstelle', r'bei $\pm 1$ je eine Polstelle', r'bei $x = 1$ eine Polstelle, bei $x = -1$ eine Lücke', r'keine'],
    [r'$\dfrac{x - 1}{(x - 1)(x + 1)} = \dfrac{1}{x + 1}$ für $x \neq 1$.',
     r'Bei 1 existiert der Grenzwert $\tfrac{1}{2}$: behebbar. Bei −1 wachsen die Werte über alle Grenzen.'])

Q.q(r'Was ist die Abrundungsfunktion $f(x) = \lfloor x \rfloor$ (größte ganze Zahl $\leq x$) an der Stelle 2?',
    [r'unstetig, links Grenzwert 1, rechts 2', r'stetig', r'nicht definiert', r'eine Polstelle'],
    [r'Kurz vor 2 ist $\lfloor x \rfloor = 1$, ab 2 ist es 2.',
     r'Sprungstelle an jeder ganzen Zahl.'])

# -------------------------------------------------------------- parameters ----
Q.q(r'Für welches $a$ ist $f(x) = a x^2$ für $x \leq 2$ und $f(x) = 4x - 4$ für $x > 2$ überall stetig?',
    [r'$a = 1$', r'$a = 2$', r'$a = 4$', r'$a = \dfrac{1}{2}$'],
    [r'Beide Teile sind für sich stetig, kritisch ist nur die Nahtstelle 2.',
     r'$f(2) = 4a$, rechts $4 \cdot 2 - 4 = 4$.',
     r'$4a = 4 \Rightarrow a = 1$.'])

Q.q(r'$f(x) = x + 1$ für $x < 0$, $f(0) = c$, $f(x) = e^x$ für $x > 0$. Für welches $c$ ist $f$ stetig?',
    [r'$c = 1$', r'$c = 0$', r'$c = e$', r'Für kein $c$'],
    [r'Links: $0 + 1 = 1$. Rechts: $e^0 = 1$.',
     r'Beide einseitigen Grenzwerte sind 1, also muss $f(0) = 1$ sein.'])

Q.q(r'$f(x) = ax + b$ für $x < 1$ und $f(x) = x^2$ für $x \geq 1$. Welche Bedingung macht $f$ an der Stelle 1 stetig?',
    [r'$a + b = 1$', r'$a = 2$ und $b = -1$', r'$a = b$', r'$b = 1$'],
    [r'Links: $a \cdot 1 + b$. Rechts und an der Stelle: $1^2 = 1$.',
     r'Stetig genau dann, wenn $a + b = 1$; das sind unendlich viele Paare.',
     r'$a = 2$, $b = -1$ ist eines davon; dann ist $f$ dort sogar knickfrei.'])

Q.q(r'Für welches $k$ ist $f(x) = \dfrac{x^2 - 9}{x - 3}$ für $x \neq 3$ und $f(3) = k$ stetig?',
    [r'$k = 6$', r'$k = 3$', r'$k = 0$', r'$k = 9$'],
    [r'$\lim\limits_{x \to 3} (x + 3) = 6$.',
     r'Stetige Fortsetzung mit $f(3) = 6$.'])

# ------------------------------------------------------------ consequences ----
Q.q(r'$f$ ist stetig auf $[1;\,2]$ mit $f(1) = -3$ und $f(2) = 5$. Was folgt?',
    [r'$f$ hat in $(1;\,2)$ mindestens eine Nullstelle.', r'$f$ hat in $(1;\,2)$ genau eine Nullstelle.', r'$f$ ist in $[1;\,2]$ steigend.', r'Es folgt nichts.'],
    [r'Ein stetiger Graph kann nicht von −3 nach 5 gelangen, ohne die $x$-Achse zu kreuzen (Zwischenwertsatz).',
     r'Wie viele Nullstellen es sind, bleibt offen. Darauf beruht die Bisektion im Wahlbereich.'])

Q.q(r'$f$ und $g$ sind an der Stelle $x_0$ stetig. Was gilt sicher?',
    [r'$f + g$ und $f \cdot g$ sind dort stetig.', r'$\dfrac{f}{g}$ ist dort immer stetig.', r'$f$ ist dort differenzierbar.', r'$f(x_0) = g(x_0)$'],
    [r'Das folgt direkt aus den Grenzwertsätzen.',
     r'Beim Quotienten muss zusätzlich $g(x_0) \neq 0$ sein.'])

Q.q(r'Ist jede stetige Funktion differenzierbar?',
    [r'Nein, $|x|$ ist bei 0 stetig, aber nicht differenzierbar.', r'Ja, stetig heißt differenzierbar.',
     r'Nein, aber jede differenzierbare Funktion ist unstetig.', r'Ja, außer an Polstellen.'],
    [r'Stetig heißt: kein Sprung. Differenzierbar heißt: kein Knick und kein Sprung.',
     r'Umgekehrt gilt: Jede differenzierbare Funktion ist stetig.'])

Q.q(r'Welche Funktion ist im ganzen Definitionsbereich stetig, hat aber einen Graphen aus zwei getrennten Ästen?',
    [r'$f(x) = \dfrac{1}{x - 2}$', r'$f(x) = |x - 2|$', r'$f(x) = \lfloor x \rfloor$', r'$f(x) = x^2 - 2$'],
    [r'Der Definitionsbereich $\mathbb{R} \setminus \{2\}$ zerfällt in zwei Intervalle.',
     r'Auf jedem ist $f$ stetig; die Lücke bei 2 gehört nicht zum Definitionsbereich.'])

Q.q(r'Welche Art Unstetigkeitsstelle hat die Vorzeichenfunktion (−1 für $x < 0$, 0 bei 0, 1 für $x > 0$) bei 0?',
    [r'eine Sprungstelle', r'eine Polstelle', r'eine behebbare Lücke', r'keine, sie ist stetig'],
    [r'Links Grenzwert −1, rechts 1.',
     r'Verschiedene endliche einseitige Grenzwerte: Sprung.'])


def check():
    import sympy as sp
    x, a, b, c = sp.symbols('x a b c', real=True)
    check_gk()
    assert sp.limit((x - 1) / (x ** 2 - 1), x, 1) == sp.Rational(1, 2)
    assert sp.limit((x - 1) / (x ** 2 - 1), x, -1, '+') in (sp.oo, -sp.oo)
    assert sp.floor(sp.Rational(199, 100)) == 1 and sp.floor(2) == 2
    assert sp.solve(sp.Eq(a * 2 ** 2, 4 * 2 - 4), a) == [1]
    assert (0 + 1) == 1 and sp.exp(0) == 1
    assert 2 + (-1) == 1 and sp.diff(x ** 2, x).subs(x, 1) == 2
    assert sp.limit((x ** 2 - 9) / (x - 3), x, 3) == 6
    assert sp.limit(sp.sign(x), x, 0, '-') == -1 and sp.limit(sp.sign(x), x, 0, '+') == 1


Q.verify(check)
Q.save()
