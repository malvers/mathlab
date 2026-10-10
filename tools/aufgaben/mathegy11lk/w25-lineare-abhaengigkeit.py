#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 25 / KW 10 (LB 3): linear dependence and independence - 15 questions of the
Grundkurs sheet, 5 harder ones (parameter, three vectors, proofs with vectors incl. Varignon with source).
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=25, slug='lineare-abhaengigkeit', thema='Lineare Abhängigkeit und Unabhängigkeit', lb='LB 3',
           blurb='Linearkombination, kollinear und komplanar, Prüfung über ein Gleichungssystem, Beweise mit Vektoren',
           comment='Questions 1-15 from the Grundkurs sheet (mathegy11/w25), 16-20 Leistungskurs.')

qs, check_gk = harvest('w25-lineare-abhaengigkeit.py', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 14, 16, 17, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Für welches $t$ sind $\begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}$, $\begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$ und $\begin{pmatrix} 1 \\ 1 \\ t \end{pmatrix}$ linear abhängig?',
    [r'$t = 2$', r'$t = 0$', r'$t = 1$', r'für kein $t$'],
    [r'Die ersten beiden sind nicht parallel. Abhängig, wenn der dritte ihre Linearkombination ist.',
     r'$r \cdot \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} + s \cdot \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$ mit $r = 1$, $s = 1$ ergibt $\begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix}$.'])

Q.q(r'Sind $\begin{pmatrix} 1 \\ 2 \\ 0 \end{pmatrix}$, $\begin{pmatrix} 0 \\ 1 \\ 3 \end{pmatrix}$ und $\begin{pmatrix} 2 \\ 5 \\ 3 \end{pmatrix}$ linear abhängig?',
    [r'Ja, der dritte ist das Doppelte des ersten plus der zweite.', r'Nein, keiner ist ein Vielfaches eines anderen.',
     r'Nein, drei Vektoren im Raum sind immer unabhängig.', r'Ja, weil alle Koordinaten positiv sind.'],
    [r'$2 \cdot \begin{pmatrix} 1 \\ 2 \\ 0 \end{pmatrix} + \begin{pmatrix} 0 \\ 1 \\ 3 \end{pmatrix} = \begin{pmatrix} 2 \\ 5 \\ 3 \end{pmatrix}$',
     r'Drei Vektoren können abhängig sein, ohne dass zwei davon parallel sind: Sie sind dann komplanar.'])

Q.q(r'In welchem Verhältnis teilt der Schwerpunkt $S$ eines Dreiecks jede Seitenhalbierende (von der Ecke aus)?',
    [r'2 : 1', r'1 : 1', r'1 : 2', r'3 : 1'],
    [r'$\overrightarrow{OS} = \tfrac{1}{3}(\vec{a} + \vec{b} + \vec{c})$.',
     r'Von $A$ zum Seitenmittelpunkt $M_a$: $\overrightarrow{AS} = \tfrac{2}{3}\overrightarrow{AM_a}$.'])

Q.q(r'Wie zeigt man mit Vektoren, dass sich die Diagonalen eines Parallelogramms $ABCD$ halbieren?',
    [r'Aus $\vec{b} - \vec{a} = \vec{c} - \vec{d}$ folgt $\tfrac{1}{2}(\vec{a} + \vec{c}) = \tfrac{1}{2}(\vec{b} + \vec{d})$: Beide Diagonalen haben denselben Mittelpunkt.',
     r'Man misst beide Diagonalen nach.', r'Man zeigt, dass beide Diagonalen gleich lang sind.', r'Man zeigt, dass die Diagonalen senkrecht aufeinander stehen.'],
    [r'Parallelogramm: $\overrightarrow{AB} = \overrightarrow{DC}$.',
     r'Umgestellt: $\vec{a} + \vec{c} = \vec{b} + \vec{d}$.'])

Q.q(r'Satz von Varignon: Verbindet man die Seitenmitten eines beliebigen Vierecks $ABCD$, entsteht ein Parallelogramm. Was ist der Kern des Vektorbeweises?',
    [r'Zwei gegenüberliegende Seiten des Mittenvierecks sind beide gleich $\tfrac{1}{2}\overrightarrow{AC}$.', r'Alle vier Seiten des Vierecks sind gleich lang.',
     r'Die Diagonalen des Vierecks sind senkrecht.', r'Das Viereck muss ein Trapez sein.'],
    [r'Seitenmitten $M_{AB}$ und $M_{BC}$: $\overrightarrow{M_{AB}M_{BC}} = \tfrac{1}{2}(\vec{c} - \vec{a})$; ebenso $\overrightarrow{M_{DA}M_{CD}} = \tfrac{1}{2}(\vec{c} - \vec{a})$.',
     r'Der Beweis gilt sogar für Vierecke im Raum, deren Ecken nicht in einer Ebene liegen.',
     r'Quelle: P. Varignon (1654–1722), Élémens de mathématique, Paris 1731 (nach seinem Tod erschienen); MacTutor History of Mathematics, St Andrews.'])


def check():
    import sympy as sp
    check_gk()
    t = sp.symbols('t')
    M = sp.Matrix([[1, 0, 1], [0, 1, 1], [1, 1, t]])
    assert sp.solve(M.det(), t) == [2]
    assert 2 * sp.Matrix([1, 2, 0]) + sp.Matrix([0, 1, 3]) == sp.Matrix([2, 5, 3])
    a, b, c, d = (sp.Matrix(sp.symbols(n + '1:4')) for n in 'abcd')
    Ma = (b + c) / 2
    S = (a + b + c) / 3
    assert sp.simplify((S - a) - sp.Rational(2, 3) * (Ma - a)) == sp.zeros(3, 1)
    dd = a + c - b                                                                    # parallelogram: d = a + c - b
    assert sp.simplify((a + c) / 2 - (b + dd) / 2) == sp.zeros(3, 1)
    mab, mbc, mcd, mda = (a + b) / 2, (b + c) / 2, (c + d) / 2, (d + a) / 2
    assert sp.simplify((mbc - mab) - (c - a) / 2) == sp.zeros(3, 1) and sp.simplify((mcd - mda) - (c - a) / 2) == sp.zeros(3, 1)


Q.verify(check)
Q.save()
