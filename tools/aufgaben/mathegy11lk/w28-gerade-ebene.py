#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 28 / KW 14 (LB 3): line and plane - 16 questions of the Grundkurs sheet, 4 harder
ones (parameter for parallelism, trace point, reflected light ray, flight path against a slope).
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=28, slug='gerade-ebene', thema='Lage von Gerade und Ebene', lb='LB 3',
           blurb='schneidend, parallel, in der Ebene liegend, Durchstoßpunkt, Schatten, Spiegelung, Flugbahn',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w30), 17-20 Leistungskurs.')

qs, check_gk = harvest('w30-gerade-ebene.py', [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Für welches $a$ ist $g\colon \vec{x} = t \cdot \begin{pmatrix} 1 \\ a \\ 1 \end{pmatrix}$ parallel zur Ebene $E\colon x + y + z = 5$?',
    [r'$a = -2$', r'$a = 2$', r'$a = 0$', r'$a = 5$'],
    [r'Einsetzen: $t + at + t = 5 \Leftrightarrow (2 + a)\,t = 5$.',
     r'Keine Lösung genau für $2 + a = 0$; der Ursprung liegt nicht in $E$, also parallel.'])

Q.q(r'Wo durchstößt $g\colon \vec{x} = \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ -1 \end{pmatrix}$ die $xy$-Ebene?',
    [r'in $(4 \mid 5 \mid 0)$', r'in $(1 \mid 2 \mid 0)$', r'in $(-2 \mid -1 \mid 0)$', r'gar nicht'],
    [r'$xy$-Ebene: $z = 0$, also $3 - t = 0$, $t = 3$.',
     r'$\begin{pmatrix} 1 + 3 \\ 2 + 3 \\ 0 \end{pmatrix}$ ist der Spurpunkt.'])

Q.q(r'Ein Lichtstrahl mit der Richtung $\begin{pmatrix} 1 \\ 2 \\ -3 \end{pmatrix}$ wird am Boden $z = 0$ gespiegelt. Welche Richtung hat der reflektierte Strahl?',
    [r'$\begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix}$', r'$\begin{pmatrix} -1 \\ -2 \\ 3 \end{pmatrix}$', r'$\begin{pmatrix} -1 \\ -2 \\ -3 \end{pmatrix}$', r'$\begin{pmatrix} 1 \\ -2 \\ 3 \end{pmatrix}$'],
    [r'Die Spiegelung an der $xy$-Ebene ändert nur das Vorzeichen der $z$-Komponente.',
     r'Der Strahl läuft in derselben Richtung weiter, aber wieder nach oben.'])

Q.q(r'Ein Flugzeug startet in $(0 \mid 0 \mid 1)$ und legt pro Minute $\begin{pmatrix} 2 \\ 1 \\ 0{,}5 \end{pmatrix}$ zurück (in km). Ein Berghang liegt in der Ebene $x + z = 11$. Wann und wo träfe es den Hang?',
    [r'nach 4 Minuten in $(8 \mid 4 \mid 3)$', r'nach 5 Minuten in $(10 \mid 5 \mid 1)$', r'nach 4 Minuten in $(8 \mid 4 \mid 1)$', r'nie, die Bahn ist parallel'],
    [r'Einsetzen: $2t + 1 + 0{,}5\,t = 11$, also $2{,}5\,t = 10$, $t = 4$.',
     r'$\begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} + 4 \cdot \begin{pmatrix} 2 \\ 1 \\ 0{,}5 \end{pmatrix} = \begin{pmatrix} 8 \\ 4 \\ 3 \end{pmatrix}$'])


def check():
    import sympy as sp
    check_gk()
    a, t = sp.symbols('a t')
    assert sp.solve(2 + a, a) == [-2] and 0 + 0 + 0 != 5
    P = sp.Matrix([1, 2, 3]) + 3 * sp.Matrix([1, 1, -1])
    assert P == sp.Matrix([4, 5, 0])
    v = sp.Matrix([1, 2, -3])
    assert sp.diag(1, 1, -1) * v == sp.Matrix([1, 2, 3])
    ts = sp.solve(2 * t + 1 + sp.Rational(1, 2) * t - 11, t)
    assert ts == [4] and sp.Matrix([0, 0, 1]) + 4 * sp.Matrix([2, 1, sp.Rational(1, 2)]) == sp.Matrix([8, 4, 3])


Q.verify(check)
Q.save()
