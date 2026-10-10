#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 5 (LB 5): Bestimmtes Integral als rekonstruierter Bestand,
als Flächeninhalt und als physikalische Größe. 18 Fragen aus dem Grundkurs-Blatt
tools/aufgaben/mathegy12/w05-bestand.py (eine Quelle), 2 neue zur Arbeit als Integral der Kraft über den Weg.
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=5, slug='bestand', thema='Bestand, Fläche und physikalische Größe', lb='LB 5',
           blurb='Änderungsraten und Bestand, Ober- und Untersummen, Riemann, Weg, Energie und Arbeit',
           comment='Blocks: Bestand aus Raten (1-4), Ober- und Untersumme (5-7), Bestand mit Startwert (8, 9), Riemann und Deutung (10, 11), physikalische Größen Weg, Energie, Arbeit (12-15), Untersumme, Einheiten und Anwendungen (16-20). Mit Hilfsmitteln erlaubt.')

N = new()

N.q(r'Welche physikalische Größe liefert das Integral $\int_{s_1}^{s_2} F(s)\,\mathrm{d}s$ der Kraft über den Weg?',
    [r'die Arbeit', r'die Leistung', r'die Geschwindigkeit', r'den Impuls'],
    [r'Bei konstanter Kraft gilt Arbeit $=$ Kraft $\cdot$ Weg, $W = F \cdot s$.',
     r'Ändert sich die Kraft längs des Weges, summiert das Integral die Beiträge $F(s)\,\mathrm{d}s$: $W = \int_{s_1}^{s_2} F(s)\,\mathrm{d}s$.'])

N.q(r'Eine Feder braucht die Kraft $F(s) = 200\,s$ (in N, $s$ in m). Welche Arbeit ist nötig, um sie von $s = 0$ auf $s = 0{,}1$ m zu dehnen?',
    [r'$1$ J', r'$2$ J', r'$20$ J', r'$10$ J'],
    [r'$W = \int_0^{0{,}1} 200\,s\,\mathrm{d}s = \left[100\,s^2\right]_0^{0{,}1}$.',
     r'$100 \cdot 0{,}01 = 1$ J. Mit Endkraft mal Weg, $20 \cdot 0{,}1 = 2$ J, wäre die Arbeit doppelt so groß, weil die Kraft erst anwächst.'])

put(Q, [gk('w05-bestand.py', list(range(13))), N.take(), gk('w05-bestand.py', [13, 14, 15, 16, 19])])


def check():
    gk_checks()
    s = sp.symbols('s')
    assert sp.integrate(200*s, (s, 0, sp.Rational(1, 10))) == 1
    assert 200 * sp.Rational(1, 10) == 20 and 20 * sp.Rational(1, 10) == 2


Q.verify(check)
Q.save()
