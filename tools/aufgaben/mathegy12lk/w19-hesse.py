#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 19 (LB 8): Orthogonalitätsbedingung, Normalenvektor,
Hesse'sche Normalenform für Geraden- und Ebenengleichungen. 12 Fragen aus den Grundkurs-Blättern
tools/aufgaben/mathegy12/w16-normalenvektor.py und w20-abstand-punkt-ebene.py (eine Quelle), 8 neue zur
Normalenform und Hesse'schen Normalenform einer Geraden in der Ebene. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=19, slug='hesse', thema='Normalenvektor und Hesse’sche Normalenform', lb='LB 8',
           blurb='Normalenvektor, Normalen- und Koordinatenform, Hesse’sche Normalenform für Geraden und Ebenen',
           comment='Blocks: Normalenvektor und Ebenengleichungen (1-10), Gerade in der Ebene: Normalenform und Hesse’sche Normalenform, Abstände (11-16), Ebene: Einheitsnormalenvektor, Hesse’sche Normalenform, Seiten (17-20). Ohne Hilfsmittel.')

N = new()

N.q(r'Wie lautet die Gerade $g$ in der Ebene durch $A(1 \mid 2)$ mit dem Normalenvektor $\vec n = \begin{pmatrix} 3 \\ -1 \end{pmatrix}$ in Koordinatenform?',
    [r'$3x - y = 1$', r'$3x - y = 5$', r'$x + 3y = 7$', r'$3x - y = -1$'],
    [r'Normalenform $\left(\vec x - \begin{pmatrix} 1 \\ 2 \end{pmatrix}\right) \cdot \begin{pmatrix} 3 \\ -1 \end{pmatrix} = 0$.',
     r'Ausmultipliziert $3x - y - (3 - 2) = 0$, also $3x - y = 1$. Probe: $3 \cdot 1 - 2 = 1$ ✔. $x + 3y = 7$ hätte $\vec n$ als Richtungsvektor.'])

N.q(r'Wie lautet die Hesse’sche Normalenform der Geraden $g\colon 3x + 4y = 10$?',
    [r'$\dfrac{3x + 4y - 10}{5} = 0$', r'$\dfrac{3x + 4y - 10}{7} = 0$', r'$\dfrac{3x + 4y - 10}{25} = 0$', r'$3x + 4y - 10 = 5$'],
    [r'Durch die Länge des Normalenvektors teilen: $\left|\begin{pmatrix} 3 \\ 4 \end{pmatrix}\right| = \sqrt{9 + 16} = 5$.',
     r'Dann ist der Normalenvektor $\tfrac15\begin{pmatrix} 3 \\ 4 \end{pmatrix}$ ein Einheitsvektor. $7 = 3 + 4$ und $25 = 5^2$ sind falsche Längen.'])

N.q(r'Wie weit ist der Ursprung von der Geraden $3x + 4y = 10$ entfernt?',
    [r'$2$', r'$10$', r'$\tfrac{10}{7}$', r'$2{,}5$'],
    [r'Hesse’sche Normalenform: $d = \dfrac{|3 \cdot 0 + 4 \cdot 0 - 10|}{5}$.',
     r'$d = \tfrac{10}{5} = 2$.'])

N.q(r'Wie weit ist $P(4 \mid 3)$ von der Geraden $3x + 4y = 10$ entfernt?',
    [r'$2{,}8$', r'$14$', r'$0{,}56$', r'$2$'],
    [r'$P$ in die Hesse’sche Normalenform einsetzen: $\dfrac{|3 \cdot 4 + 4 \cdot 3 - 10|}{5} = \dfrac{14}{5}$.',
     r'$d = 2{,}8$. Ohne Teilen käme $14$ heraus, beim Teilen durch $25$ der Wert $0{,}56$.'])

N.q(r'Wie weit sind die parallelen Geraden $3x + 4y = 10$ und $3x + 4y = 25$ voneinander entfernt?',
    [r'$3$', r'$15$', r'$0{,}6$', r'$7$'],
    [r'Beide haben den Normalenvektor $\begin{pmatrix} 3 \\ 4 \end{pmatrix}$ der Länge $5$.',
     r'Ein Punkt der zweiten Geraden, etwa $(0 \mid 6{,}25)$, hat von der ersten den Abstand $\tfrac{|25 - 10|}{5} = 3$.'])

N.q(r'Welche Punkte der $x$-Achse haben von der Geraden $3x + 4y = 10$ den Abstand $2$?',
    [r'$(0 \mid 0)$ und $\left(\tfrac{20}{3} \mid 0\right)$', r'nur $(0 \mid 0)$', r'$\left(\tfrac{10}{3} \mid 0\right)$ und $\left(-\tfrac{10}{3} \mid 0\right)$', r'nur $\left(\tfrac{20}{3} \mid 0\right)$'],
    [r'Für $Q(x \mid 0)$: $\dfrac{|3x - 10|}{5} = 2$, also $3x - 10 = 10$ oder $3x - 10 = -10$.',
     r'$x = \tfrac{20}{3}$ oder $x = 0$: Auf jeder Seite der Geraden liegt ein Punkt.'])

N.q(r'Welcher Vektor ist ein Einheitsnormalenvektor der Ebene $E\colon x - 2y + 2z = 3$?',
    [r'$\tfrac13\begin{pmatrix} 1 \\ -2 \\ 2 \end{pmatrix}$', r'$\tfrac15\begin{pmatrix} 1 \\ -2 \\ 2 \end{pmatrix}$',
     r'$\begin{pmatrix} 1 \\ -2 \\ 2 \end{pmatrix}$', r'$\tfrac13\begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix}$'],
    [r'Normalenvektor ablesen: $\begin{pmatrix} 1 \\ -2 \\ 2 \end{pmatrix}$ mit der Länge $\sqrt{1 + 4 + 4} = 3$.',
     r'Durch $3$ teilen ergibt die Länge $1$. $\tfrac15$ käme vom Addieren $1 + 2 + 2$ statt von der Wurzel.'])

N.q(r'In der Hesse’schen Normalenform $\dfrac{ax + by + cz - d}{|\vec n|} = 0$ mit $d > 0$ setzt man einen Punkt $P$ ein. Was sagt das Vorzeichen des Ergebnisses?',
    [r'auf welcher Seite der Ebene $P$ liegt: positiv auf der Seite, in die $\vec n$ vom Ursprung weg zeigt', r'ob $P$ in der Ebene liegt',
     r'ob der Abstand größer als $1$ ist', r'nichts, nur der Betrag zählt'],
    [r'Der Betrag des Ergebnisses ist der Abstand von $P$ zur Ebene.',
     r'Das Vorzeichen trennt die beiden Halbräume; mit $d > 0$ liegt der Ursprung auf der negativen Seite. Gleiches Vorzeichen heißt: gleiche Seite.'])

put(Q, [gk('w16-normalenvektor.py', [0, 1, 2, 3, 5, 6, 8, 11, 12, 15]), N.take(0, 7), gk('w20-abstand-punkt-ebene.py', [10, 11]), N.take(7)])


def check():
    gk_checks()
    x, y = sp.symbols('x y')
    assert sp.expand((x - 1)*3 + (y - 2)*(-1)) == 3*x - y - 1
    assert sp.sqrt(3**2 + 4**2) == 5
    d = lambda px, py: sp.Abs(3*px + 4*py - 10) / 5
    assert d(0, 0) == 2 and d(4, 3) == sp.Rational(14, 5) and sp.Rational(14, 25) == sp.Rational(56, 100)
    assert d(0, sp.Rational(25, 4)) == 3 and 3*0 + 4*sp.Rational(25, 4) == 25
    xs = sp.symbols('xs', real=True)
    assert set(sp.solve(sp.Eq(sp.Abs(3*xs - 10) / 5, 2), xs)) == {0, sp.Rational(20, 3)}
    assert sp.sqrt(1 + 4 + 4) == 3
    # the sign: origin and the far side for 2x + y + 2z = 6
    s = lambda p: (2*p[0] + p[1] + 2*p[2] - 6) / sp.Integer(3)
    assert s((0, 0, 0)) < 0 < s((3, 3, 3))


Q.verify(check)
Q.save()
