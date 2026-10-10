#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 22 (LB 8): Abstände Punkt–Gerade und Gerade–Gerade
(parallel und windschief). 8 Fragen aus dem Grundkurs-Blatt tools/aufgaben/mathegy12/w22-extremale-abstaende.py
(eine Quelle), 12 neue zu Lotfußpunkt, Hilfsebene und windschiefen Geraden. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=22, slug='abstaende-gerade', thema='Abstände von Geraden', lb='LB 8',
           blurb='Punkt–Gerade mit Lotfußpunkt und Hilfsebene, parallele und windschiefe Geraden, gemeinsames Lot',
           comment='Blocks: Punkt–Gerade: Lotfußpunkt, Hilfsebene, Beispiele (1-11), parallele Geraden (12, 13), windschiefe Geraden: Lage, Lot, Formel, Beispiele (14-20). Mit Hilfsmitteln erlaubt.')

N = new()

N.q(r'Wie bestimmt man den Abstand eines Punktes $P$ von einer Geraden $g$ im Raum?',
    [r'Lotfußpunkt $F$ auf $g$ mit $\vec{PF} \cdot \vec u = 0$ suchen, dann $|\vec{PF}|$ berechnen', r'$P$ in die Geradengleichung einsetzen',
     r'mit der Hesse’schen Normalenform der Geraden', r'den Abstand von $P$ zum Stützpunkt von $g$ nehmen'],
    [r'Der kürzeste Weg von $P$ zu $g$ trifft $g$ senkrecht im Lotfußpunkt $F$.',
     r'Der Abstand zum Stützpunkt ist meist größer; eine Hesse’sche Normalenform gibt es für Geraden nur in der Ebene.'])

N.q(r'Warum gibt es für eine Gerade im Raum keine Hesse’sche Normalenform?',
    [r'Eine Gleichung $\vec n \cdot \vec x = d$ beschreibt im Raum eine Ebene, keine Gerade.', r'Weil Geraden im Raum keinen Richtungsvektor haben.',
     r'Weil der Abstand eines Punktes von einer Geraden im Raum nicht definiert ist.', r'Weil man im Raum nicht durch $|\vec n|$ teilen darf.'],
    [r'Im Raum stehen unendlich viele Richtungen senkrecht auf einer Geraden, es gibt keinen eindeutigen Normalenvektor.',
     r'Die Punkte mit $\vec n \cdot \vec x = d$ bilden eine Ebene. Man braucht den Lotfußpunkt oder eine Hilfsebene.'])

N.q(r'Für $P(1 \mid 2 \mid 3)$ und $g\colon \vec x = t\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$: Welche Hilfsebene durch $P$ steht senkrecht auf $g$?',
    [r'$x + y + z = 6$', r'$x + y + z = 0$', r'$x + 2y + 3z = 14$', r'$x + y + z = 3$'],
    [r'Der Richtungsvektor von $g$ ist Normalenvektor der Hilfsebene: $x + y + z = d$.',
     r'$P$ einsetzen: $d = 1 + 2 + 3 = 6$.'])

N.q(r'Die Hilfsebene $x + y + z = 6$ schneidet $g\colon \vec x = t\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$ im Lotfußpunkt von $P(1 \mid 2 \mid 3)$. Wo liegt er?',
    [r'$F(2 \mid 2 \mid 2)$', r'$F(1 \mid 1 \mid 1)$', r'$F(6 \mid 6 \mid 6)$', r'$F(3 \mid 3 \mid 3)$'],
    [r'$g$ in die Ebene einsetzen: $t + t + t = 6$, also $t = 2$.',
     r'$F(2 \mid 2 \mid 2)$ und $|\vec{PF}| = \left|\begin{pmatrix} 1 \\ 0 \\ -1 \end{pmatrix}\right| = \sqrt2$, wie mit dem Skalarprodukt.'])

N.q(r'Warum versagt die Abstandsformel mit $\vec u \times \vec v$ bei parallelen Geraden?',
    [r'Dann ist $\vec u \times \vec v = \vec 0$, und man müsste durch $0$ teilen.', r'Weil parallele Geraden immer den Abstand $0$ haben.',
     r'Weil das Vektorprodukt nur für windschiefe Geraden definiert ist.', r'Sie versagt nicht, sie gibt immer den Abstand.'],
    [r'Parallele Richtungsvektoren spannen kein Parallelogramm auf: $|\vec u \times \vec v| = 0$.',
     r'Bei parallelen Geraden nimmt man einen Punkt der einen und bestimmt seinen Abstand von der anderen.'])

N.q(r'Wie liegen $g\colon \vec x = t\begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}$ und $h\colon \vec x = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} + s\begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$ zueinander?',
    [r'windschief', r'Sie schneiden sich.', r'parallel', r'identisch'],
    [r'Die Richtungsvektoren sind nicht Vielfache voneinander: nicht parallel.',
     r'Auf $g$ ist stets $z = 0$, auf $h$ stets $z = 1$: kein gemeinsamer Punkt. Also windschief.'])

N.q(r'Wie weit sind die windschiefen Geraden $g\colon \vec x = t\begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}$ und $h\colon \vec x = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} + s\begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$ voneinander entfernt?',
    [r'$1$', r'$\sqrt2$', r'$0$', r'$2$'],
    [r'$g$ ist die $x$-Achse, $h$ verläuft parallel zur $y$-Achse in der Höhe $1$ über dem Ursprung.',
     r'Die Verbindung $(0 \mid 0 \mid 0)$–$(0 \mid 0 \mid 1)$ steht auf beiden senkrecht: Abstand $1$.'])

N.q(r'Was gilt für die kürzeste Verbindungsstrecke zweier windschiefer Geraden?',
    [r'Sie steht auf beiden Geraden senkrecht (gemeinsames Lot).', r'Sie verbindet die beiden Stützpunkte.',
     r'Sie ist parallel zu einer der beiden Geraden.', r'Es gibt keine kürzeste Verbindung.'],
    [r'Stünde sie auf einer Geraden schief, könnte man ihren Endpunkt dort verschieben und sie verkürzen.',
     r'Also ist sie das gemeinsame Lot; ihre Richtung ist $\vec u \times \vec v$.'])

N.q(r'Welche Formel gibt den Abstand der windschiefen Geraden $g\colon \vec x = \vec p + t\,\vec u$ und $h\colon \vec x = \vec q + s\,\vec v$?',
    [r'$d = \dfrac{\left|(\vec q - \vec p) \cdot (\vec u \times \vec v)\right|}{|\vec u \times \vec v|}$', r'$d = |\vec q - \vec p|$',
     r'$d = \dfrac{|(\vec q - \vec p) \times \vec u|}{|\vec u|}$', r'$d = |\vec u \times \vec v|$'],
    [r'$\vec n = \vec u \times \vec v$ steht auf beiden Geraden senkrecht. Die Ebene durch $g$ mit diesem Normalenvektor ist parallel zu $h$.',
     r'Der Abstand ist die Länge der Projektion von $\vec q - \vec p$ auf $\vec n$: Hesse’sche Normalenform dieser Hilfsebene mit dem Punkt $\vec q$.'])

N.q(r'Welcher Vektor steht auf $\vec u = \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}$ und $\vec v = \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$ senkrecht?',
    [r'$\begin{pmatrix} -1 \\ -1 \\ 1 \end{pmatrix}$', r'$\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$', r'$\begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix}$', r'$\begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix}$'],
    [r'$\vec u \times \vec v = \begin{pmatrix} 0 \cdot 1 - 1 \cdot 1 \\ 1 \cdot 0 - 1 \cdot 1 \\ 1 \cdot 1 - 0 \cdot 0 \end{pmatrix} = \begin{pmatrix} -1 \\ -1 \\ 1 \end{pmatrix}$.',
     r'Probe: $-1 + 0 + 1 = 0$ und $0 - 1 + 1 = 0$ ✔. $\begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix} = \vec u + \vec v$ liegt in der Ebene der beiden.'])

N.q(r'Wie weit sind $g\colon \vec x = t\begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}$ und $h\colon \vec x = \begin{pmatrix} 1 \\ 2 \\ 0 \end{pmatrix} + s\begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$ voneinander entfernt?',
    [r'$\sqrt3$', r'$3$', r'$\sqrt5$', r'$1$'],
    [r'$\vec n = \vec u \times \vec v = \begin{pmatrix} -1 \\ -1 \\ 1 \end{pmatrix}$, $|\vec n| = \sqrt3$, und $\vec q - \vec p = \begin{pmatrix} 1 \\ 2 \\ 0 \end{pmatrix}$.',
     r'$d = \dfrac{|-1 - 2 + 0|}{\sqrt3} = \dfrac{3}{\sqrt3} = \sqrt3$. $\sqrt5$ ist nur der Abstand der Stützpunkte.'])

N.q(r'Zwei gerade Seile hängen in $10$ m und $12$ m Höhe: $\vec x = \begin{pmatrix} 0 \\ 0 \\ 10 \end{pmatrix} + t\begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}$ und $\vec x = \begin{pmatrix} 0 \\ 0 \\ 12 \end{pmatrix} + s\begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$. Wie nah kommen sie sich?',
    [r'$2$ m', r'$0$ m, sie kreuzen sich', r'$12$ m', r'$10$ m'],
    [r'$\vec u \times \vec v = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix}$, $\vec q - \vec p = \begin{pmatrix} 0 \\ 0 \\ 2 \end{pmatrix}$.',
     r'$d = \tfrac{|2|}{1} = 2$ m. Von oben gesehen kreuzen sie sich, im Raum sind sie windschief.'])

put(Q, [gk('w22-extremale-abstaende.py', [2]), N.take(0, 2), gk('w22-extremale-abstaende.py', [1, 3]), N.take(2, 4),
        gk('w22-extremale-abstaende.py', [4, 12, 13, 17, 19]), N.take(4)])


def check():
    gk_checks()
    t, s = sp.symbols('t s')
    P = sp.Matrix([1, 2, 3]); u = sp.Matrix([1, 1, 1])
    assert u.dot(P) == 6
    tt = sp.solve(u.dot(t*u) - 6, t)[0]
    F = tt*u
    assert F == sp.Matrix([2, 2, 2]) and (F - P).norm() == sp.sqrt(2) and (F - P).dot(u) == 0
    def dist(p, uu, q, vv):
        n = uu.cross(vv)
        return sp.Abs((q - p).dot(n)) / n.norm()
    def windschief(p, uu, q, vv):
        return uu.cross(vv) != sp.zeros(3, 1) and not sp.solve(list(p + t*uu - q - s*vv), [t, s], dict=True)
    g = (sp.zeros(3, 1), sp.Matrix([1, 0, 0])); h = (sp.Matrix([0, 0, 1]), sp.Matrix([0, 1, 0]))
    assert windschief(*g, *h) and dist(*g, *h) == 1
    u2, v2 = sp.Matrix([1, 0, 1]), sp.Matrix([0, 1, 1])
    n = u2.cross(v2)
    assert n == sp.Matrix([-1, -1, 1]) and n.dot(u2) == 0 and n.dot(v2) == 0
    assert sp.Matrix([1, 1, 2]) == u2 + v2 and sp.Matrix([1, -1, 1]).dot(u2) != 0
    q2 = sp.Matrix([1, 2, 0])
    assert windschief(sp.zeros(3, 1), u2, q2, v2) and dist(sp.zeros(3, 1), u2, q2, v2) == sp.sqrt(3) and q2.norm() == sp.sqrt(5)
    a = (sp.Matrix([0, 0, 10]), sp.Matrix([1, 0, 0])); b = (sp.Matrix([0, 0, 12]), sp.Matrix([0, 1, 0]))
    assert windschief(*a, *b) and dist(*a, *b) == 2
    assert sp.Matrix([1, 0, 0]).cross(sp.Matrix([2, 0, 0])) == sp.zeros(3, 1)


Q.verify(check)
Q.save()
