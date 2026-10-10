#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 14 / KW 49 (LB 2): rotations in the plane and in space, interlinked production
(raw materials, intermediate and end products), practice with linear systems. 11 new questions, 9 from the
Grundkurs sheets mathegy11/w13 and w14. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=14, slug='drehung-verflechtung', thema='Drehungen und Verflechtungen mit Matrizen', lb='LB 2',
           blurb='Drehmatrizen in Ebene und Raum, Rohstoffe, Zwischen- und Endprodukte, Übung zu Gleichungssystemen',
           comment='New questions on rotations and interlinked production; 9 questions from the Grundkurs sheets mathegy11/w13 and w14.')

qs_m, check_m = harvest('w13-matrizen.py', [15, 16, 17])
qs_g, check_g = harvest('w14-gauss-jordan.py', [4, 5, 6, 16, 17, 18])
mat = {i: q for i, q in zip([15, 16, 17], qs_m)}
lgs = {i: q for i, q in zip([4, 5, 6, 16, 17, 18], qs_g)}


def take(q):
    Q.q(*q[0], **q[1])


# ----------------------------------------------------------------- rotations ----
Q.q(r'Welche Matrix dreht Punkte um den Ursprung um den Winkel $\alpha$ (gegen den Uhrzeigersinn)?',
    [r'$\begin{pmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{pmatrix}$',
     r'$\begin{pmatrix} \cos\alpha & \sin\alpha \\ \sin\alpha & \cos\alpha \end{pmatrix}$',
     r'$\begin{pmatrix} \sin\alpha & -\cos\alpha \\ \cos\alpha & \sin\alpha \end{pmatrix}$',
     r'$\begin{pmatrix} \cos\alpha & 0 \\ 0 & \sin\alpha \end{pmatrix}$'],
    [r'Die Spalten sind die Bilder der Einheitsvektoren: $\begin{pmatrix} 1 \\ 0 \end{pmatrix} \mapsto \begin{pmatrix} \cos\alpha \\ \sin\alpha \end{pmatrix}$, $\begin{pmatrix} 0 \\ 1 \end{pmatrix} \mapsto \begin{pmatrix} -\sin\alpha \\ \cos\alpha \end{pmatrix}$.',
     r'Für $\alpha = 90^\circ$ entsteht die Matrix $D$ der nächsten Aufgabe.'])
take(mat[16])
take(mat[17])

Q.q(r'Wohin dreht die Drehung um $180^\circ$ den Punkt $P(3 \mid -2)$?',
    [r'$P^{\prime}(-3 \mid 2)$', r'$P^{\prime}(3 \mid 2)$', r'$P^{\prime}(-3 \mid -2)$', r'$P^{\prime}(2 \mid 3)$'],
    [r'$\cos 180^\circ = -1$, $\sin 180^\circ = 0$: Die Matrix ist $\begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix}$.',
     r'Beide Koordinaten wechseln das Vorzeichen (Punktspiegelung am Ursprung).'])

Q.q(r'Der Punkt $P(2 \mid 0)$ wird um $60^\circ$ um den Ursprung gedreht. Wo liegt das Bild?',
    [r'$P^{\prime}(1 \mid \sqrt{3})$', r'$P^{\prime}(\sqrt{3} \mid 1)$', r'$P^{\prime}(1 \mid 2)$', r'$P^{\prime}(2 \mid \sqrt{3})$'],
    [r'$\cos 60^\circ = \tfrac{1}{2}$, $\sin 60^\circ = \tfrac{\sqrt{3}}{2}$.',
     r'$\begin{pmatrix} 2\cos 60^\circ \\ 2\sin 60^\circ \end{pmatrix} = \begin{pmatrix} 1 \\ \sqrt{3} \end{pmatrix}$'])

Q.q(r'Was ergibt $D_{30^\circ} \cdot D_{60^\circ}$, das Produkt zweier Drehmatrizen?',
    [r'$D_{90^\circ}$', r'$D_{30^\circ}$', r'$D_{1800^\circ}$', r'die Einheitsmatrix'],
    [r'Zwei Drehungen hintereinander sind eine Drehung um die Summe der Winkel.',
     r'Mit den Additionstheoremen: $D_\alpha \cdot D_\beta = D_{\alpha + \beta}$.'])

Q.q(r'Welche Matrix macht die Drehung $D_\alpha$ wieder rückgängig?',
    [r'$D_{-\alpha} = \begin{pmatrix} \cos\alpha & \sin\alpha \\ -\sin\alpha & \cos\alpha \end{pmatrix}$',
     r'$\begin{pmatrix} -\cos\alpha & \sin\alpha \\ -\sin\alpha & -\cos\alpha \end{pmatrix}$',
     r'$\begin{pmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{pmatrix}$',
     r'$\begin{pmatrix} \sin\alpha & \cos\alpha \\ \cos\alpha & \sin\alpha \end{pmatrix}$'],
    [r'Zurückdrehen heißt: um $-\alpha$ drehen; $\cos(-\alpha) = \cos\alpha$, $\sin(-\alpha) = -\sin\alpha$.',
     r'Probe: $D_{-\alpha} \cdot D_\alpha = D_0 = E$.'])

Q.q(r'Der Punkt $P(3 \mid 4)$ wird um $45^\circ$ um den Ursprung gedreht. Wie weit ist das Bild vom Ursprung entfernt?',
    [r'5', r'7', r'$5\sqrt{2}$', r'$\tfrac{5}{\sqrt{2}}$'],
    [r'Eine Drehung um den Ursprung ändert keine Abstände zum Ursprung.',
     r'$\sqrt{3^2 + 4^2} = 5$'])

Q.q(r'Welche Matrix dreht im Raum um die $z$-Achse um $90^\circ$?',
    [r'$\begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}$',
     r'$\begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{pmatrix}$',
     r'$\begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}$',
     r'$\begin{pmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}$'],
    [r'In der $xy$-Ebene wirkt die ebene Drehmatrix, die $z$-Koordinate bleibt.',
     r'Die zweite Matrix dreht um die $x$-Achse, die letzte spiegelt an der Ebene $x = y$.'])

Q.q(r'Wohin dreht diese Matrix den Punkt $P(1 \mid 2 \mid 3)$?',
    [r'$P^{\prime}(-2 \mid 1 \mid 3)$', r'$P^{\prime}(2 \mid -1 \mid 3)$', r'$P^{\prime}(1 \mid -3 \mid 2)$', r'$P^{\prime}(-2 \mid 1 \mid 0)$'],
    [r'$\begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix} \cdot \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} = \begin{pmatrix} -2 \\ 1 \\ 3 \end{pmatrix}$'])

# -------------------------------------------------------------- interlinking ----
take(mat[15])

Q.q(r'Zwischenprodukte $Z_1$, $Z_2$ brauchen Rohstoffe nach $A = \begin{pmatrix} 2 & 1 \\ 1 & 3 \end{pmatrix}$ (Zeilen $R_1$, $R_2$; Spalten $Z_1$, $Z_2$). Endprodukte brauchen Zwischenprodukte nach $B = \begin{pmatrix} 1 & 2 \\ 3 & 1 \end{pmatrix}$ (Zeilen $Z_1$, $Z_2$; Spalten $E_1$, $E_2$). Welche Matrix gibt den Rohstoffbedarf pro Endprodukt an?',
    [r'$A \cdot B = \begin{pmatrix} 5 & 5 \\ 10 & 5 \end{pmatrix}$', r'$B \cdot A = \begin{pmatrix} 4 & 7 \\ 7 & 6 \end{pmatrix}$',
     r'$\begin{pmatrix} 2 & 2 \\ 3 & 3 \end{pmatrix}$', r'$A + B = \begin{pmatrix} 3 & 3 \\ 4 & 4 \end{pmatrix}$'],
    [r'Ein Stück $E_1$ braucht 1 Stück $Z_1$ und 3 Stück $Z_2$, also $2 \cdot 1 + 1 \cdot 3 = 5$ Einheiten $R_1$.',
     r'Genau das rechnet die Zeile $R_1$ von $A$ mal die Spalte $E_1$ von $B$.'])

Q.q(r'Warum rechnet man bei der Verflechtung $A \cdot B$ und nicht $B \cdot A$?',
    [r'Die Spalten von $A$ und die Zeilen von $B$ gehören zu den Zwischenprodukten; nur so passen sie zusammen.',
     r'Weil $A$ größer ist als $B$.', r'Das ist egal, beide Produkte sind gleich.', r'Weil man immer die Rohstoffe zuletzt multipliziert.'],
    [r'Die Matrizenmultiplikation ist nicht kommutativ.',
     r'Die Bedeutung der Indizes muss in der Mitte übereinstimmen: $(R \times Z) \cdot (Z \times E) = (R \times E)$.'])

Q.q(r'Mit $A \cdot B = \begin{pmatrix} 5 & 5 \\ 10 & 5 \end{pmatrix}$ sollen 10 Stück $E_1$ und 20 Stück $E_2$ entstehen. Wie viel Rohstoff braucht man?',
    [r'150 Einheiten $R_1$ und 200 Einheiten $R_2$', r'100 Einheiten $R_1$ und 150 Einheiten $R_2$',
     r'150 Einheiten $R_1$ und 250 Einheiten $R_2$', r'200 Einheiten $R_1$ und 150 Einheiten $R_2$'],
    [r'$\begin{pmatrix} 5 & 5 \\ 10 & 5 \end{pmatrix} \cdot \begin{pmatrix} 10 \\ 20 \end{pmatrix} = \begin{pmatrix} 150 \\ 200 \end{pmatrix}$'])
take(lgs[18])

# ------------------------------------------------------- practice: systems ----
for i in (4, 5, 6, 16, 17):
    take(lgs[i])


def check():
    import sympy as sp
    check_m()
    check_g()
    al, be = sp.symbols('alpha beta', real=True)
    D = lambda t: sp.Matrix([[sp.cos(t), -sp.sin(t)], [sp.sin(t), sp.cos(t)]])
    assert D(sp.pi / 2) == sp.Matrix([[0, -1], [1, 0]])
    assert D(sp.pi) * sp.Matrix([3, -2]) == sp.Matrix([-3, 2])
    assert D(sp.pi / 3) * sp.Matrix([2, 0]) == sp.Matrix([1, sp.sqrt(3)])
    assert sp.simplify(D(al) * D(be) - D(al + be)) == sp.zeros(2, 2)
    assert D(sp.pi / 6) * D(sp.pi / 3) == D(sp.pi / 2)
    assert sp.simplify(D(-al) * D(al) - sp.eye(2)) == sp.zeros(2, 2)
    assert sp.simplify(D(-al) - sp.Matrix([[sp.cos(al), sp.sin(al)], [-sp.sin(al), sp.cos(al)]])) == sp.zeros(2, 2)
    v = D(sp.pi / 4) * sp.Matrix([3, 4])
    assert sp.simplify(v.norm()) == 5
    Rz = sp.Matrix([[0, -1, 0], [1, 0, 0], [0, 0, 1]])
    assert Rz * sp.Matrix([1, 2, 3]) == sp.Matrix([-2, 1, 3])
    A, B = sp.Matrix([[2, 1], [1, 3]]), sp.Matrix([[1, 2], [3, 1]])
    assert A * B == sp.Matrix([[5, 5], [10, 5]]) and B * A == sp.Matrix([[4, 7], [7, 6]]) and A + B == sp.Matrix([[3, 3], [4, 4]])
    assert A * B * sp.Matrix([10, 20]) == sp.Matrix([150, 200])


Q.verify(check)
Q.save()
