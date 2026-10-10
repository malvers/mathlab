#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 6 (LB 5): Eigenschaften des bestimmten Integrals,
Integralfunktion, Hauptsatz. 19 Fragen aus dem Grundkurs-Blatt tools/aufgaben/mathegy12/w06-hauptsatz.py
(eine Quelle), 1 neue: nicht jede Stammfunktion ist eine Integralfunktion. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=6, slug='hauptsatz', thema='Eigenschaften des Integrals und Hauptsatz', lb='LB 5',
           blurb='Hauptsatz, Linearität, Intervalladditivität, Integralfunktion und Stammfunktion',
           comment='Blocks: Hauptsatz rechnen (1-3, 12-14, 16), Eigenschaften (4-7, 19, 20), Integralfunktion (8, 9, 10 neu: nicht jede Stammfunktion ist eine Integralfunktion, 17, 18), Hauptsatz verstehen (11), Grenze (15). Ohne Hilfsmittel.')

N = new()

N.q(r'Gibt es ein $a$, für das $F(x) = x^2 + 1$ die Integralfunktion $I_a(x) = \int_a^x 2t\,\mathrm{d}t$ ist?',
    [r'Nein: $I_a(x) = x^2 - a^2$ hat bei $x = a$ eine Nullstelle, $x^2 + 1$ hat keine.', r'Ja, mit $a = 1$.',
     r'Ja, mit $a = -1$.', r'Ja, denn jede Stammfunktion ist eine Integralfunktion.'],
    [r'$I_a(x) = \left[t^2\right]_a^x = x^2 - a^2$ und $I_a(a) = 0$: Jede Integralfunktion hat an ihrer unteren Grenze eine Nullstelle.',
     r'$x^2 - a^2 = x^2 + 1$ verlangt $a^2 = -1$, das hat keine reelle Lösung. Jede Integralfunktion ist eine Stammfunktion, aber nicht umgekehrt.'])

put(Q, [gk('w06-hauptsatz.py', list(range(9))), N.take(), gk('w06-hauptsatz.py', [9, 10, 11, 12, 13, 14, 15, 16, 17, 19])])


def check():
    gk_checks()
    x, t, a = sp.symbols('x t a')
    assert sp.expand(sp.integrate(2*t, (t, a, x)) - (x**2 - a**2)) == 0
    assert sp.solve(sp.Eq(-a**2, 1), a) and all(not r.is_real for r in sp.solve(sp.Eq(-a**2, 1), a))


Q.verify(check)
Q.save()
