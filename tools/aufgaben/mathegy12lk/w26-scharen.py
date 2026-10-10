#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 26 (LB 9): Parameter - Funktionsscharen und Ortskurven,
Geraden- und Ebenenscharen. 18 Fragen aus den Grundkurs-Blättern tools/aufgaben/mathegy12/w25-funktionenscharen.py
und w26-geradenscharen.py (eine Quelle), 2 neue zu Ebenenscharen. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=26, slug='scharen', thema='Funktions-, Geraden- und Ebenenscharen', lb='LB 9',
           blurb='gemeinsame Punkte, Extrem- und Wendepunkte mit Parameter, Ortskurven, Geraden- und Ebenenscharen',
           comment='Blocks: Funktionsscharen mit Ortskurven (1-10), Geradenscharen in Ebene und Raum (11-18), Ebenenscharen (19, 20). Ohne Hilfsmittel, CAS zum Entdecken erlaubt.')

N = new()

N.q(r'Welche Gerade liegt in allen Ebenen der Schar $E_a\colon ax + y - z = a$?',
    [r'$\vec x = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix} + t\begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$', r'$\vec x = t\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$',
     r'$\vec x = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix} + t\begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}$', r'Es gibt keine gemeinsame Gerade.'],
    [r'Nach dem Parameter ordnen: $a\,(x - 1) + (y - z) = 0$.',
     r'Das gilt für jedes $a$ genau dann, wenn $x = 1$ und $y = z$: die Punkte $(1 \mid t \mid t)$. Alle Ebenen der Schar drehen sich um diese Gerade (Ebenenbüschel).'])

N.q(r'Für welches $a$ steht die Ebene $E_a\colon x + ay + z = 4$ senkrecht auf $F\colon x - y + z = 0$?',
    [r'$a = 2$', r'$a = -2$', r'$a = 0$', r'$a = 1$'],
    [r'Ebenen stehen senkrecht, wenn ihre Normalenvektoren orthogonal sind.',
     r'$\begin{pmatrix} 1 \\ a \\ 1 \end{pmatrix} \cdot \begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix} = 2 - a = 0$, also $a = 2$.'])

put(Q, [gk('w25-funktionenscharen.py', [0, 1, 2, 4, 5, 6, 9, 10, 12, 13]), gk('w26-geradenscharen.py', [0, 2, 6, 8, 9, 10, 16, 18]), N.take()])


def check():
    gk_checks()
    a, t, x, y, z = sp.symbols('a t x y z')
    assert sp.expand(a*1 + t - t - a) == 0
    assert sp.expand(a*x + y - z - a - (a*(x - 1) + (y - z))) == 0
    assert sp.expand(a*(1 + t) + 0 - 0 - a) != 0          # the x-direction is not in every plane
    assert sp.solve(sp.Matrix([1, a, 1]).dot(sp.Matrix([1, -1, 1])), a) == [2]


Q.verify(check)
Q.save()
