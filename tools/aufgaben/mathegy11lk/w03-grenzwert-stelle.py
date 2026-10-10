#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 3 / KW 36 (LB 1): limit at a point, piecewise defined functions, limit laws -
11 questions of the Grundkurs sheet, 9 Leistungskurs ones. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=3, slug='grenzwert-stelle', thema='Grenzwert an einer Stelle', lb='LB 1',
           blurb='einseitige Grenzwerte, abschnittsweise definierte Funktionen, Grenzwertsätze',
           comment='Questions 1-11 from the Grundkurs sheet (mathegy11/w03), 12-20 Leistungskurs (piecewise functions, harder limits).')

qs, check_gk = harvest('w03-grenzwert-stetigkeit.py', [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 17])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------- piecewise defined functions ----
Q.q(r'$f(x) = x^2$ für $x < 1$ und $f(x) = 2x$ für $x \geq 1$. Was gilt an der Stelle 1?',
    [r'Links Grenzwert 1, rechts 2: kein Grenzwert.', r'Grenzwert 2, weil $f(1) = 2$.', r'Grenzwert 1,5', r'Grenzwert 1'],
    [r'Von links gilt die obere Vorschrift: $x^2 \to 1$.',
     r'Von rechts die untere: $2x \to 2$.',
     r'Verschiedene einseitige Grenzwerte: kein Grenzwert an der Stelle 1.'])

Q.q(r'$f(x) = x + 1$ für $x < 2$ und $f(x) = x^2 - 1$ für $x \geq 2$. Existiert $\lim\limits_{x \to 2} f(x)$?',
    [r'Ja, beide einseitigen Grenzwerte sind 3.', r'Nein, weil die Vorschrift wechselt.', r'Ja, er ist 2.', r'Nein, links 3 und rechts 4.'],
    [r'Links: $2 + 1 = 3$. Rechts: $4 - 1 = 3$.',
     r'Gleiche einseitige Grenzwerte, also Grenzwert 3.'])

Q.q(r'Welche abschnittsweise Vorschrift beschreibt $f(x) = |x - 2|$?',
    [r'$2 - x$ für $x < 2$, $x - 2$ für $x \geq 2$', r'$x - 2$ für $x < 2$, $2 - x$ für $x \geq 2$', r'$x + 2$ für $x < 2$, $x - 2$ für $x \geq 2$', r'$2 - x$ für alle $x$'],
    [r'Für $x < 2$ ist $x - 2$ negativ, der Betrag dreht das Vorzeichen um: $2 - x$.',
     r'Für $x \geq 2$ bleibt $x - 2$.'])

Q.q(r'Bestimme die einseitigen Grenzwerte von $\dfrac{|x|}{x}$ an der Stelle 0.',
    [r'links −1, rechts 1', r'beide 0', r'beide 1', r'links $-\infty$, rechts $\infty$'],
    [r'Für $x < 0$ ist $|x| = -x$, der Bruch ist −1.',
     r'Für $x > 0$ ist der Bruch 1. Kein Grenzwert an der Stelle 0.'])

Q.q(r'Bestimme die einseitigen Grenzwerte von $f(x) = \dfrac{x^2 - 4}{|x - 2|}$ an der Stelle 2.',
    [r'links −4, rechts 4', r'beide 4', r'beide 0', r'links 4, rechts −4'],
    [r'Für $x > 2$: $\dfrac{(x - 2)(x + 2)}{x - 2} = x + 2 \to 4$.',
     r'Für $x < 2$: $|x - 2| = 2 - x$, also $\dfrac{(x - 2)(x + 2)}{2 - x} = -(x + 2) \to -4$.'])

Q.q(r'Ein Handytarif kostet 10 € bis 1 GB und darüber $10 + 5(x - 1)$ € für $x$ GB. Wie verhält sich der Preis an der Stelle $x = 1$?',
    [r'Beide einseitigen Grenzwerte sind 10 €: kein Preissprung.', r'Der Preis springt von 10 € auf 15 €.', r'Links 10 €, rechts 5 €.', r'Der Preis ist dort nicht definiert.'],
    [r'Links: konstant 10.',
     r'Rechts: $10 + 5 \cdot 0 = 10$. Kein Sprung, der Tarif ist stetig.'])

Q.q(r'Es gilt $\lim\limits_{x \to 0} x^2 = 0$ und $\lim\limits_{x \to 0} x = 0$. Was folgt für $\lim\limits_{x \to 0} \dfrac{x^2}{x}$?',
    [r'Der Quotientensatz ist nicht anwendbar, der Grenzwert ist trotzdem 0.', r'Der Grenzwert ist $\tfrac{0}{0} = 1$.', r'Der Grenzwert existiert nicht.', r'Der Grenzwert ist $\infty$.'],
    [r'Der Grenzwertsatz für Quotienten verlangt einen Nenner-Grenzwert ungleich 0.',
     r'Erst kürzen: $\dfrac{x^2}{x} = x \to 0$.'])

Q.q(r'Bestimme $\lim\limits_{x \to 0} \dfrac{\sqrt{x + 4} - 2}{x}$.',
    [r'$\dfrac{1}{4}$', r'0', r'$\dfrac{1}{2}$', r'Der Grenzwert existiert nicht.'],
    [r'Mit $\sqrt{x + 4} + 2$ erweitern: Zähler $(x + 4) - 4 = x$.',
     r'$\dfrac{x}{x\,(\sqrt{x + 4} + 2)} = \dfrac{1}{\sqrt{x + 4} + 2} \to \dfrac{1}{4}$.'])

Q.q(r'Bestimme $\lim\limits_{x \to 3} \dfrac{x^2 - 5x + 6}{x^2 - 9}$.',
    [r'$\dfrac{1}{6}$', r'0', r'$\dfrac{1}{3}$', r'Der Grenzwert existiert nicht.'],
    [r'Zähler $(x - 2)(x - 3)$, Nenner $(x - 3)(x + 3)$.',
     r'Kürzen: $\dfrac{x - 2}{x + 3} \to \dfrac{1}{6}$.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    check_gk()
    assert sp.limit(x ** 2, x, 1, '-') == 1 and sp.limit(2 * x, x, 1, '+') == 2
    assert (2 + 1) == 3 and (2 ** 2 - 1) == 3
    assert all(sp.Abs(v - 2) == (2 - v if v < 2 else v - 2) for v in (0, 1, 2, 3, 5))
    assert sp.limit(sp.Abs(x) / x, x, 0, '-') == -1 and sp.limit(sp.Abs(x) / x, x, 0, '+') == 1
    f = (x ** 2 - 4) / sp.Abs(x - 2)
    assert sp.limit(f, x, 2, '-') == -4 and sp.limit(f, x, 2, '+') == 4
    assert 10 + 5 * (1 - 1) == 10
    assert sp.limit(x ** 2 / x, x, 0) == 0
    assert sp.limit((sp.sqrt(x + 4) - 2) / x, x, 0) == sp.Rational(1, 4)
    assert sp.limit((x ** 2 - 5 * x + 6) / (x ** 2 - 9), x, 3) == sp.Rational(1, 6)


Q.verify(check)
Q.save()
