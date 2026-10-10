#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 39 / KW 25: Klausur 11/II - mixed questions on LB 3 (vectors, lines and planes)
and LB 4 (binomial random variables). 16 from the Grundkurs Klausur sheet mathegy11/w38, 4 Leistungskurs
(line of intersection, Bayes, counting, linear dependence with a parameter). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=39, slug='ka2', thema='Klausur 11/II: Vektoren, Geraden, Ebenen und Wahrscheinlichkeitsrechnung', lb='KL 11/II',
           blurb='gemischte Aufgaben zu LB 3 und LB 4 zur Klausurvorbereitung',
           comment='Questions 1-16 from the Grundkurs Klausur sheet (mathegy11/w38), 17-20 Leistungskurs.')

qs, check_gk = harvest('w38-ka2.py', [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Für welches $t$ sind $\begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix}$, $\begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix}$ und $\begin{pmatrix} 3 \\ 3 \\ t \end{pmatrix}$ linear abhängig?',
    [r'$t = 3$', r'$t = 0$', r'$t = 6$', r'für kein $t$'],
    [r'Die Summe der ersten beiden ist $\begin{pmatrix} 3 \\ 3 \\ 3 \end{pmatrix}$.',
     r'Für $t = 3$ ist der dritte Vektor eine Linearkombination der ersten beiden.'])

Q.q(r'Bestimme die Schnittgerade der Ebenen $x + y = 2$ und $z = 1$.',
    [r'$\vec{x} = \begin{pmatrix} 2 \\ 0 \\ 1 \end{pmatrix} + t \cdot \begin{pmatrix} -1 \\ 1 \\ 0 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 2 \\ 0 \\ 1 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$', r'Die Ebenen sind parallel.'],
    [r'$z = 1$ fest; mit $y = t$ folgt $x = 2 - t$.'])

Q.q(r'Es gilt $P(A) = 0{,}2$, $P_A(B) = 0{,}9$ und $P_{\overline{A}}(B) = 0{,}1$. Wie groß ist $P_B(A)$?',
    [r'$\dfrac{9}{13} \approx 0{,}692$', r'0,9', r'0,18', r'0,26'],
    [r'$P(B) = 0{,}2 \cdot 0{,}9 + 0{,}8 \cdot 0{,}1 = 0{,}26$.',
     r'Bayes: $P_B(A) = \dfrac{0{,}18}{0{,}26}$.'])

Q.q(r'Aus 12 Personen wird ein Team von 4 Personen gebildet. Wie viele Möglichkeiten gibt es?',
    [r'495', r'11 880', r'48', r'20 736'],
    [r'Ohne Reihenfolge, ohne Wiederholung: $\dbinom{12}{4} = \dfrac{12 \cdot 11 \cdot 10 \cdot 9}{4!}$.'])


def check():
    from fractions import Fraction as F
    from math import comb, perm
    import sympy as sp
    check_gk()
    t = sp.symbols('t')
    assert sp.solve(sp.Matrix([[1, 2, 3], [2, 1, 3], [3, 0, t]]).det(), t) == [3]
    x = lambda s: (2 - s, s, 1)
    assert all(x(s)[0] + x(s)[1] == 2 and x(s)[2] == 1 for s in (-1, 0, 2))
    pB = F(2, 10) * F(9, 10) + F(8, 10) * F(1, 10)
    assert pB == F(26, 100) and F(18, 100) / pB == F(9, 13) and abs(9 / 13 - 0.692) < 0.0005
    assert comb(12, 4) == 495 and perm(12, 4) == 11880 and 12 ** 4 == 20736


Q.verify(check)
Q.save()
