#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 24 / KW 9 (LB 3): computing with vectors - 16 questions of the Grundkurs sheet,
4 harder ones (equilibrium of forces, length with a parameter, triangle inequality, midpoint vector).
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=24, slug='vektoren', thema='Rechnen mit Vektoren', lb='LB 3',
           blurb='Ortsvektor, Verbindungsvektor, Betrag, Rechengesetze, vektorielle Größen in der Physik',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w24), 17-20 Leistungskurs.')

qs, check_gk = harvest('w24-vektoren.py', [0, 1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Auf einen Körper wirken $\vec{F}_1 = \begin{pmatrix} 2 \\ -1 \\ 3 \end{pmatrix}$ N und $\vec{F}_2 = \begin{pmatrix} -4 \\ 0 \\ 1 \end{pmatrix}$ N. Welche dritte Kraft hält ihn im Gleichgewicht?',
    [r'$\begin{pmatrix} 2 \\ 1 \\ -4 \end{pmatrix}$ N', r'$\begin{pmatrix} -2 \\ -1 \\ 4 \end{pmatrix}$ N',
     r'$\begin{pmatrix} 6 \\ -1 \\ 2 \end{pmatrix}$ N', r'$\begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$ N'],
    [r'Gleichgewicht: $\vec{F}_1 + \vec{F}_2 + \vec{F}_3 = \vec{o}$.',
     r'$\vec{F}_3 = -(\vec{F}_1 + \vec{F}_2) = -\begin{pmatrix} -2 \\ -1 \\ 4 \end{pmatrix}$'])

Q.q(r'Für welche $a$ hat $\begin{pmatrix} a \\ 2 \\ 2 \end{pmatrix}$ den Betrag 3?',
    [r'$a = 1$ oder $a = -1$', r'nur $a = 1$', r'$a = 3$', r'$a = \pm 9$'],
    [r'$\sqrt{a^2 + 4 + 4} = 3 \Leftrightarrow a^2 + 8 = 9$.',
     r'$a^2 = 1$ hat zwei Lösungen.'])

Q.q(r'Wann gilt $|\vec{a} + \vec{b}| = |\vec{a}| + |\vec{b}|$?',
    [r'wenn $\vec{a}$ und $\vec{b}$ gleich gerichtet sind (oder einer der Nullvektor ist)', r'immer', r'wenn $\vec{a}$ und $\vec{b}$ entgegengesetzt sind', r'nie'],
    [r'Allgemein gilt die Dreiecksungleichung $|\vec{a} + \vec{b}| \leq |\vec{a}| + |\vec{b}|$.',
     r'Gleichheit nur, wenn das Dreieck zu einer Strecke entartet.'])

Q.q(r'Welcher Vektorterm liefert den Ortsvektor des Mittelpunkts $M$ der Strecke $AB$?',
    [r'$\overrightarrow{OM} = \tfrac{1}{2}\left(\vec{a} + \vec{b}\right)$', r'$\overrightarrow{OM} = \tfrac{1}{2}\left(\vec{b} - \vec{a}\right)$',
     r'$\overrightarrow{OM} = \vec{a} + \vec{b}$', r'$\overrightarrow{OM} = 2\left(\vec{a} + \vec{b}\right)$'],
    [r'$\overrightarrow{OM} = \vec{a} + \tfrac{1}{2}\overrightarrow{AB} = \vec{a} + \tfrac{1}{2}\left(\vec{b} - \vec{a}\right)$.',
     r'Das vereinfacht sich zu $\tfrac{1}{2}\left(\vec{a} + \vec{b}\right)$.'])


def check():
    import sympy as sp
    check_gk()
    F1, F2 = sp.Matrix([2, -1, 3]), sp.Matrix([-4, 0, 1])
    assert -(F1 + F2) == sp.Matrix([2, 1, -4])
    a = sp.symbols('a', real=True)
    assert sorted(sp.solve(a ** 2 + 8 - 9, a)) == [-1, 1]
    u, v = sp.Matrix([1, 2, 2]), sp.Matrix([2, 4, 4])
    assert (u + v).norm() == u.norm() + v.norm() and (u - v).norm() < u.norm() + v.norm()
    A, B = sp.Matrix(sp.symbols('a1:4')), sp.Matrix(sp.symbols('b1:4'))
    assert sp.simplify(A + (B - A) / 2 - (A + B) / 2) == sp.zeros(3, 1)


Q.verify(check)
Q.save()
