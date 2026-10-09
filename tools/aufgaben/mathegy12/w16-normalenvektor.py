#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 16 (LB 7): Orthogonalitätsbedingung,
Normalenvektor, Normalen- und Koordinatenform der Ebene, Spurpunkte, parallele und
orthogonale Ebenen. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np

Q = gy12(nr=16, slug='normalenvektor', thema='Normalenvektor und Koordinatenform', lb='LB 7',
         blurb='Normalenvektor, Normalen- und Koordinatenform, Spurpunkte, Lage von Ebenen',
         comment='Blocks: Normalenvektor ablesen und berechnen (1, 2, 9, 12, 19), Ebenengleichungen aufstellen (3, 4, 7, 17, 18), Punktprobe und Spurpunkte (5, 6, 15), besondere Ebenen (10, 11, 14), parallel und orthogonal (8, 13, 16, 20). Ohne Hilfsmittel.')

Q.q(r'Welcher Vektor ist ein Normalenvektor der Ebene $E\colon 2x - y + 3z = 5$?',
    [r'$' + vec(2, -1, 3) + r'$', r'$' + vec(2, 1, 3) + r'$', r'$' + vec(5, 0, 0) + r'$', r'$' + vec(-1, 3, 5) + r'$'],
    [r'In der Koordinatenform $ax + by + cz = d$ ist $(a;\ b;\ c)$ ein Normalenvektor.',
     r'Also $(2;\ -1;\ 3)$; jedes Vielfache davon auch.'])

Q.q(r'Die Ebene $E$ wird von $\vec u = ' + vec(1, 0, 1) + r'$ und $\vec v = ' + vec(0, 1, 1) + r'$ aufgespannt. Welcher Vektor ist ein Normalenvektor?',
    [r'$' + vec(-1, -1, 1) + r'$', r'$' + vec(1, 1, 2) + r'$', r'$' + vec(1, -1, 0) + r'$', r'$' + vec(0, 0, 1) + r'$'],
    [r'$\vec u \times \vec v = (0 \cdot 1 - 1 \cdot 1;\ 1 \cdot 0 - 1 \cdot 1;\ 1 \cdot 1 - 0 \cdot 0)$.',
     r'$= (-1;\ -1;\ 1)$. Probe: $(-1;\ -1;\ 1) \cdot \vec u = 0$ und $\cdot\ \vec v = 0$ ✔'])

Q.q(r'Wie lautet die Koordinatengleichung der Ebene durch $A(1 \mid 2 \mid 0)$ mit dem Normalenvektor $' + vec(2, 1, -1) + r'$?',
    [r'$2x + y - z = 4$', r'$2x + y - z = 0$', r'$x + 2y = 4$', r'$2x + y - z = 2$'],
    [r'$d = \vec n \cdot \vec{OA} = 2 \cdot 1 + 1 \cdot 2 - 1 \cdot 0$.',
     r'$= 4$.'])

Q.q(r'Wie lautet die Normalenform einer Ebene durch $P$ mit Normalenvektor $\vec n$?',
    [r'$(\vec x - \vec p) \cdot \vec n = 0$', r'$\vec x = \vec p + t \cdot \vec n$', r'$(\vec x - \vec p) \times \vec n = 0$', r'$\vec x \cdot \vec p = \vec n$'],
    [r'Jeder Verbindungsvektor von $P$ zu einem Punkt $X$ der Ebene steht senkrecht auf $\vec n$.',
     r'Ausmultipliziert ergibt sich die Koordinatenform. $\vec p + t\vec n$ wäre die Lotgerade.'])

Q.q(r'Liegt $P(1 \mid 1 \mid 1)$ in $E\colon 2x + y - z = 2$?',
    [r'Ja, $2 + 1 - 1 = 2$.', r'Nein, $2 + 1 + 1 = 4$.', r'Nein, $1 + 1 + 1 = 3$.', r'Das lässt sich nicht entscheiden.'],
    [r'Punktprobe: Koordinaten einsetzen.',
     r'$2 \cdot 1 + 1 - 1 = 2$ ✔'])

Q.q(r'Welche Spurpunkte hat $E\colon 2x + 3y + 6z = 12$?',
    [r'$(6 \mid 0 \mid 0)$, $(0 \mid 4 \mid 0)$, $(0 \mid 0 \mid 2)$', r'$(2 \mid 0 \mid 0)$, $(0 \mid 3 \mid 0)$, $(0 \mid 0 \mid 6)$', r'$(12 \mid 0 \mid 0)$, $(0 \mid 12 \mid 0)$, $(0 \mid 0 \mid 12)$', r'$(6 \mid 4 \mid 2)$'],
    [r'Je zwei Koordinaten null setzen: $2x = 12$, $3y = 12$, $6z = 12$.',
     r'Spurpunkte $(6 \mid 0 \mid 0)$, $(0 \mid 4 \mid 0)$, $(0 \mid 0 \mid 2)$.'])

Q.q(r'Welche Koordinatengleichung hat die Ebene durch $A(1 \mid 0 \mid 0)$, $B(0 \mid 2 \mid 0)$, $C(0 \mid 0 \mid 3)$?',
    [r'$6x + 3y + 2z = 6$', r'$x + 2y + 3z = 6$', r'$x + y + z = 1$', r'$2x + 3y + 6z = 6$'],
    [r'$\vec{AB} \times \vec{AC} = (-1;\ 2;\ 0) \times (-1;\ 0;\ 3) = (6;\ 3;\ 2)$, $d = 6$.',
     r'Probe: $B$: $6$ ✔, $C$: $6$ ✔. Die Kehrwerte der Achsenabschnitte $1;\ \tfrac12;\ \tfrac13$ mal $6$.'])

Q.q(r'Sind $' + vec(2, 1, -2) + r'$ und $' + vec(1, 0, 1) + r'$ orthogonal?',
    [r'Ja, das Skalarprodukt ist $0$.', r'Nein, das Skalarprodukt ist $4$.', r'Nein, sie sind parallel.', r'Ja, weil beide ganzzahlig sind.'],
    [r'$2 \cdot 1 + 1 \cdot 0 + (-2) \cdot 1 = 0$.',
     r'Orthogonalitätsbedingung: $\vec a \cdot \vec b = 0$.'])

Q.q(r'Welcher Vektor steht senkrecht auf der Ebene $x + y + z = 3$?',
    [r'$' + vec(2, 2, 2) + r'$', r'$' + vec(1, -1, 0) + r'$', r'$' + vec(3, 0, 0) + r'$', r'$' + vec(1, 1, -2) + r'$'],
    [r'Normalenvektor $(1;\ 1;\ 1)$; jedes Vielfache steht ebenfalls senkrecht.',
     r'$(1;\ -1;\ 0)$ und $(1;\ 1;\ -2)$ liegen dagegen parallel zur Ebene.'])

Q.q(r'Welche Ebene ist parallel zur $x$-$y$-Ebene und geht durch $(0 \mid 0 \mid 4)$?',
    [r'$z = 4$', r'$x + y = 4$', r'$x = 4$', r'$x + y + z = 4$'],
    [r'Normalenvektor $(0;\ 0;\ 1)$, also $z = d$.',
     r'Durch $(0 \mid 0 \mid 4)$: $z = 4$.'])

Q.q(r'Wie liegt die Ebene $x = 2$?',
    [r'parallel zur $y$-$z$-Ebene', r'parallel zur $x$-$y$-Ebene', r'durch den Ursprung', r'senkrecht zur $y$-$z$-Ebene'],
    [r'Normalenvektor $(1;\ 0;\ 0)$ zeigt in $x$-Richtung.',
     r'Die Ebene enthält alle Punkte mit $x = 2$: eine Wand im Abstand $2$ von der $y$-$z$-Ebene.'])

Q.q(r'Wie lautet eine Koordinatengleichung der Ebene durch $A(1 \mid 1 \mid 0)$, $B(3 \mid 1 \mid 1)$, $C(1 \mid 4 \mid 2)$?',
    [r'$3x + 4y - 6z = 7$', r'$3x + 4y + 6z = 7$', r'$2x + 3y + 2z = 5$', r'$x + y + z = 2$'],
    [r'$\vec{AB} \times \vec{AC} = (2;\ 0;\ 1) \times (0;\ 3;\ 2) = (-3;\ -4;\ 6)$, mal $-1$: $(3;\ 4;\ -6)$.',
     r'$d = 3 + 4 - 0 = 7$. Probe: $B$: $9 + 4 - 6 = 7$ ✔, $C$: $3 + 16 - 12 = 7$ ✔'])

Q.q(r'Wie liegen $E_1\colon 2x - y + z = 1$ und $E_2\colon -4x + 2y - 2z = 3$ zueinander?',
    [r'echt parallel', r'identisch', r'orthogonal', r'sie schneiden sich in einer Geraden unter $60^\circ$'],
    [r'$\vec n_2 = -2\,\vec n_1$: parallele Normalenvektoren.',
     r'$E_1$ mal $-2$ ergibt $-4x + 2y - 2z = -2 \neq 3$: nicht identisch, also echt parallel.'])

Q.q(r'Welche Ebene enthält den Ursprung?',
    [r'$3x - y + 2z = 0$', r'$3x - y + 2z = 1$', r'$x = 1$', r'$z = -2$'],
    [r'Einsetzen von $(0 \mid 0 \mid 0)$ ergibt links immer $0$.',
     r'Also enthält eine Ebene den Ursprung genau dann, wenn $d = 0$ ist.'])

Q.q(r'Für welches $a$ liegt $P(2 \mid a \mid 1)$ in $E\colon x + 2y - z = 5$?',
    [r'$a = 2$', r'$a = 1$', r'$a = 3$', r'$a = 0$'],
    [r'$2 + 2a - 1 = 5$.',
     r'$2a = 4$, $a = 2$.'])

Q.q(r'Stehen $E_1\colon x + 2y - z = 0$ und $E_2\colon 3x - y + z = 1$ senkrecht aufeinander?',
    [r'Ja, $\vec n_1 \cdot \vec n_2 = 3 - 2 - 1 = 0$.', r'Nein, $\vec n_1 \cdot \vec n_2 = 6$.', r'Nein, sie sind parallel.', r'Ja, weil $d_1 = 0$ ist.'],
    [r'Zwei Ebenen sind orthogonal, wenn ihre Normalenvektoren orthogonal sind.',
     r'$(1;\ 2;\ -1) \cdot (3;\ -1;\ 1) = 0$ ✔'])

Q.q(r'Die Ebene $E$ hat die Achsenabschnitte $2$, $4$ und $4$. Wie lautet ihre Koordinatengleichung?',
    [r'$2x + y + z = 4$', r'$x + 2y + 2z = 4$', r'$2x + 4y + 4z = 1$', r'$x + y + z = 10$'],
    [r'Achsenabschnittsform $\tfrac{x}{2} + \tfrac{y}{4} + \tfrac{z}{4} = 1$, mal $4$.',
     r'$2x + y + z = 4$. Probe: $(2 \mid 0 \mid 0)$ ✔, $(0 \mid 4 \mid 0)$ ✔, $(0 \mid 0 \mid 4)$ ✔'])

Q.q(r'Welche Ebene enthält die Gerade $g\colon \vec x = ' + vec(1, 0, 0) + r' + t' + vec(1, 1, 0) + r'$ und den Punkt $P(0 \mid 0 \mid 1)$?',
    [r'$x - y + z = 1$', r'$x + y + z = 1$', r'$x - y - z = 1$', r'$z = 1$'],
    [r'Spannvektoren $(1;\ 1;\ 0)$ und $\vec{AP} = (-1;\ 0;\ 1)$, Kreuzprodukt $(1;\ -1;\ 1)$.',
     r'Mit $A(1 \mid 0 \mid 0)$: $d = 1$. Probe: $P$: $0 - 0 + 1 = 1$ ✔'])

Q.q(r'Welcher Vektor ist der Einheitsnormalenvektor zu $' + vec(2, 1, 2) + r'$?',
    [r'$' + vec(r'\tfrac23', r'\tfrac13', r'\tfrac23') + r'$', r'$' + vec(r'\tfrac25', r'\tfrac15', r'\tfrac25') + r'$', r'$' + vec(1, r'\tfrac12', 1) + r'$', r'$' + vec(2, 1, 2) + r'$'],
    [r'$|\vec n| = \sqrt{4 + 1 + 4} = 3$.',
     r'Durch $3$ teilen. Durch die Summe $5$ zu teilen ergibt keine Länge $1$.'])

Q.q(r'Ist $\vec w = ' + vec(1, -1, 0) + r'$ parallel zur Ebene $x + y + 2z = 0$?',
    [r'Ja, denn $\vec n \cdot \vec w = 0$.', r'Nein, denn $\vec w \neq \vec n$.', r'Nein, denn $\vec n \cdot \vec w = 2$.', r'Ja, denn beide haben eine Null.'],
    [r'$(1;\ 1;\ 2) \cdot (1;\ -1;\ 0) = 1 - 1 + 0 = 0$.',
     r'Ein Vektor senkrecht zum Normalenvektor liegt parallel zur Ebene.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    assert (np.cross(a(1, 0, 1), a(0, 1, 1)) == a(-1, -1, 1)).all()
    assert a(2, 1, -1) @ a(1, 2, 0) == 4 and 2 + 1 - 1 == 2
    assert 12 / 2 == 6 and 12 / 3 == 4 and 12 / 6 == 2
    n = np.cross(a(-1, 2, 0), a(-1, 0, 3))
    assert (n == a(6, 3, 2)).all() and n @ a(1, 0, 0) == 6 and n @ a(0, 2, 0) == 6 and n @ a(0, 0, 3) == 6
    assert a(2, 1, -2) @ a(1, 0, 1) == 0 and a(1, 1, 1) @ a(1, -1, 0) == 0 and a(1, 1, 1) @ a(1, 1, -2) == 0
    n = np.cross(a(2, 0, 1), a(0, 3, 2))
    assert (n == a(-3, -4, 6)).all()
    m = -n
    assert m @ a(1, 1, 0) == 7 and m @ a(3, 1, 1) == 7 and m @ a(1, 4, 2) == 7
    assert (a(-4, 2, -2) == -2 * a(2, -1, 1)).all() and -2 * 1 != 3
    assert 2 + 2 * 2 - 1 == 5 and a(1, 2, -1) @ a(3, -1, 1) == 0
    assert all(a(2, 1, 1) @ p == 4 for p in (a(2, 0, 0), a(0, 4, 0), a(0, 0, 4)))
    n = np.cross(a(1, 1, 0), a(-1, 0, 1))
    assert (n == a(1, -1, 1)).all() and n @ a(1, 0, 0) == 1 and n @ a(0, 0, 1) == 1
    assert np.linalg.norm(a(2, 1, 2)) == 3 and a(1, 1, 2) @ a(1, -1, 0) == 0


Q.verify(check)
Q.save()
