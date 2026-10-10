#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 21 (LB 8): Abstände Punkt–Punkt, Punkt–Ebene,
Gerade–Ebene, Ebene–Ebene. 18 Fragen aus den Grundkurs-Blättern tools/aufgaben/mathegy12/w20-abstand-punkt-ebene.py
und w21-abstaende-anwendungen.py (eine Quelle), 2 neue zum Abstand Gerade–Ebene. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=21, slug='abstaende-ebene', thema='Abstände von einer Ebene', lb='LB 8',
           blurb='Punkt–Punkt, Punkt–Ebene mit Hesse’scher Normalenform und Lotfußpunkt, parallele Gerade und Ebene',
           comment='Blocks: Punkt–Punkt (1, 2), Punkt–Ebene (3-9), Ebene–Ebene (10), Gerade–Ebene (11, 12 neu), weitere Abstände mit Parameter (13-16), Dach und Kugel (17-20). Mit Hilfsmitteln erlaubt.')

N = new()

N.q(r'Wie weit ist die Gerade $g\colon \vec x = \begin{pmatrix} 4 \\ 2 \\ 1 \end{pmatrix} + t\begin{pmatrix} 1 \\ 0 \\ -1 \end{pmatrix}$ von der Ebene $E\colon 2x + y + 2z = 6$ entfernt?',
    [r'$2$', r'$0$, sie schneiden sich', r'$6$', r'Das hängt von $t$ ab.'],
    [r'$\vec n \cdot \vec u = 2 \cdot 1 + 1 \cdot 0 + 2 \cdot (-1) = 0$: $g$ ist parallel zu $E$, jeder Punkt hat denselben Abstand.',
     r'Stützpunkt einsetzen: $\dfrac{|2 \cdot 4 + 2 + 2 \cdot 1 - 6|}{3} = \dfrac{6}{3} = 2$.'])

N.q(r'Welchen Abstand hat die Gerade $g\colon \vec x = t\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$ von der Ebene $E\colon 2x + y + 2z = 6$?',
    [r'$0$, denn $g$ schneidet $E$', r'$2$, den Abstand des Ursprungs', r'$\tfrac53$', r'Er ist nicht definiert.'],
    [r'$\vec n \cdot \vec u = 2 + 1 + 2 = 5 \neq 0$: $g$ ist nicht parallel zu $E$, sondern schneidet sie.',
     r'Im Schnittpunkt $\left(\tfrac65 \mid \tfrac65 \mid \tfrac65\right)$ ist der Abstand $0$. Nur für parallele Geraden ist der Abstand eines Punktes der Abstand der Geraden.'])

put(Q, [gk('w20-abstand-punkt-ebene.py', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), N.take(),
        gk('w20-abstand-punkt-ebene.py', [12, 16, 17, 18]), gk('w21-abstaende-anwendungen.py', [10, 11, 12, 15])])


def check():
    gk_checks()
    t = sp.symbols('t')
    n = sp.Matrix([2, 1, 2])
    assert n.dot(sp.Matrix([1, 0, -1])) == 0
    for tv in (0, 1, -3):
        p = sp.Matrix([4, 2, 1]) + tv*sp.Matrix([1, 0, -1])
        assert sp.Abs(n.dot(p) - 6) / n.norm() == 2
    assert n.dot(sp.Matrix([1, 1, 1])) == 5
    ts = sp.solve(n.dot(t*sp.Matrix([1, 1, 1])) - 6, t)
    assert ts == [sp.Rational(6, 5)]


Q.verify(check)
Q.save()
