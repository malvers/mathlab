#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 23 (LB 8): Spiegelung von Punkten und
Geraden an Punkten, Geraden und Ebenen, Spiegelebene, Reflexion und kürzeste Wege.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=23, slug='spiegelung', thema='Spiegelung im Raum', lb='LB 8',
         blurb='Spiegeln an Punkten, Geraden und Ebenen, Reflexion und kürzeste Wege',
         comment='Blocks: Koordinatenebenen und Punkte (1-4, 10), an Ebenen (5-7, 16, 17), an Geraden (8, 9), Geraden und Strahlen (11, 12), Spiegelebene (13-15, 20), kürzester Weg (18, 19). Ohne Hilfsmittel.')

Q.q(r'Wohin wird $P(1 \mid 2 \mid 3)$ an der Ebene $z = 0$ gespiegelt?',
    [r'$(1 \mid 2 \mid -3)$', r'$(-1 \mid -2 \mid 3)$', r'$(-1 \mid -2 \mid -3)$', r'$(1 \mid 2 \mid 0)$'],
    [r'Nur die Koordinate senkrecht zur Ebene wechselt das Vorzeichen.',
     r'$(1 \mid 2 \mid -3)$. $(1 \mid 2 \mid 0)$ ist der Lotfußpunkt.'])

Q.q(r'Wohin wird $P(1 \mid 2 \mid 3)$ an der Ebene $x = 0$ gespiegelt?',
    [r'$(-1 \mid 2 \mid 3)$', r'$(1 \mid -2 \mid -3)$', r'$(0 \mid 2 \mid 3)$', r'$(1 \mid 2 \mid -3)$'],
    [r'Die $y$-$z$-Ebene hat den Normalenvektor $(1;\ 0;\ 0)$.',
     r'Die $x$-Koordinate wechselt das Vorzeichen.'])

Q.q(r'Wohin wird $P(1 \mid 2 \mid 3)$ am Ursprung gespiegelt?',
    [r'$(-1 \mid -2 \mid -3)$', r'$(1 \mid 2 \mid -3)$', r'$(-1 \mid 2 \mid 3)$', r'$(3 \mid 2 \mid 1)$'],
    [r'$\vec{OP^\prime} = -\vec{OP}$.',
     r'Alle drei Koordinaten wechseln das Vorzeichen.'])

Q.q(r'Wohin wird $P(1 \mid 2 \mid 3)$ am Punkt $Z(2 \mid 2 \mid 2)$ gespiegelt?',
    [r'$(3 \mid 2 \mid 1)$', r'$(1 \mid 2 \mid 1)$', r'$(-1 \mid -2 \mid -3)$', r'$(1{,}5 \mid 2 \mid 2{,}5)$'],
    [r'$Z$ ist der Mittelpunkt von $P$ und $P^\prime$: $\vec{OP^\prime} = 2\vec{OZ} - \vec{OP}$.',
     r'$(4 - 1 \mid 4 - 2 \mid 4 - 3) = (3 \mid 2 \mid 1)$.'])

Q.q(r'Wohin wird der Ursprung an der Ebene $2x + y + 2z = 9$ gespiegelt?',
    [r'$(4 \mid 2 \mid 4)$', r'$(2 \mid 1 \mid 2)$', r'$(-2 \mid -1 \mid -2)$', r'$(9 \mid 0 \mid 0)$'],
    [r'Lotgerade $t \cdot (2;\ 1;\ 2)$ in $E$: $9t = 9$, Lotfußpunkt $F(2 \mid 1 \mid 2)$.',
     r'$\vec{OP^\prime} = 2\vec{OF} = (4;\ 2;\ 4)$.'])

Q.q(r'In welcher Reihenfolge spiegelt man einen Punkt $P$ an einer Ebene $E$?',
    [r'Lotgerade durch $P$, Lotfußpunkt $F$ als Schnitt mit $E$, dann $\vec{OP^\prime} = \vec{OP} + 2\vec{PF}$', r'$P$ in $E$ einsetzen und das Vorzeichen umdrehen', r'den Normalenvektor zu $P$ addieren', r'$\vec{OP^\prime} = \vec{OP} + \vec{PF}$'],
    [r'$F$ ist der Mittelpunkt von $P$ und $P^\prime$.',
     r'Darum geht man von $P$ aus zweimal den Weg zu $F$. Nur einmal landet man auf $F$ selbst.'])

Q.q(r'Wohin wird $P(3 \mid 4 \mid 5)$ an der Ebene $x + y + z = 3$ gespiegelt?',
    [r'$(-3 \mid -2 \mid -1)$', r'$(0 \mid 1 \mid 2)$', r'$(-3 \mid -4 \mid -5)$', r'$(1 \mid 2 \mid 3)$'],
    [r'Lotgerade $(3 + t \mid 4 + t \mid 5 + t)$: $12 + 3t = 3$, $t = -3$, $F(0 \mid 1 \mid 2)$.',
     r'$P^\prime = P + 2\vec{PF} = (3 - 6 \mid 4 - 6 \mid 5 - 6)$.'])

Q.q(r'Wohin wird $P(1 \mid 1 \mid 0)$ an der $x$-Achse gespiegelt?',
    [r'$(1 \mid -1 \mid 0)$', r'$(-1 \mid 1 \mid 0)$', r'$(-1 \mid -1 \mid 0)$', r'$(1 \mid 0 \mid 0)$'],
    [r'Lotfußpunkt auf der $x$-Achse: $F(1 \mid 0 \mid 0)$.',
     r'$P^\prime = 2F - P = (1 \mid -1 \mid 0)$. Allgemein wechseln $y$ und $z$ das Vorzeichen.'])

Q.q(r'Wohin wird $P(0 \mid 2 \mid 0)$ an der Geraden durch $O$ mit dem Richtungsvektor $' + vec(1, 1, 0) + r'$ gespiegelt?',
    [r'$(2 \mid 0 \mid 0)$', r'$(0 \mid -2 \mid 0)$', r'$(1 \mid 1 \mid 0)$', r'$(-2 \mid 0 \mid 0)$'],
    [r'Lotfußpunkt: $t = \tfrac{2}{2} = 1$, $F(1 \mid 1 \mid 0)$.',
     r'$P^\prime = 2F - P = (2 \mid 0 \mid 0)$.'])

Q.q(r'Wohin wird $P(1 \mid 3 \mid 5)$ an der Ebene $x = y$ gespiegelt?',
    [r'$(3 \mid 1 \mid 5)$', r'$(-1 \mid -3 \mid 5)$', r'$(1 \mid 3 \mid -5)$', r'$(2 \mid 2 \mid 5)$'],
    [r'Die Spiegelung an $x - y = 0$ vertauscht $x$ und $y$.',
     r'$(3 \mid 1 \mid 5)$. $(2 \mid 2 \mid 5)$ ist der Lotfußpunkt.'])

Q.q(r'Die Gerade $g\colon \vec x = ' + vec(0, 0, 2) + r' + t' + vec(1, 0, 1) + r'$ wird an der Ebene $z = 0$ gespiegelt. Wie lautet das Bild?',
    [r'$\vec x = ' + vec(0, 0, -2) + r' + t' + vec(1, 0, -1) + r'$', r'$\vec x = ' + vec(0, 0, -2) + r' + t' + vec(1, 0, 1) + r'$', r'$\vec x = ' + vec(0, 0, 2) + r' + t' + vec(-1, 0, -1) + r'$', r'$\vec x = ' + vec(0, 0, 0) + r' + t' + vec(1, 0, 0) + r'$'],
    [r'Stützpunkt spiegeln: $(0 \mid 0 \mid -2)$; zweiten Punkt $(1 \mid 0 \mid 3)$ spiegeln: $(1 \mid 0 \mid -3)$.',
     r'Neuer Richtungsvektor $(1;\ 0;\ -1)$: Auch beim Richtungsvektor wechselt die $z$-Komponente.'])

Q.q(r'Ein Lichtstrahl mit der Richtung $' + vec(1, 1, -1) + r'$ trifft auf einen Spiegel in der Ebene $z = 0$. In welche Richtung läuft er weiter?',
    [r'$' + vec(1, 1, 1) + r'$', r'$' + vec(-1, -1, 1) + r'$', r'$' + vec(1, 1, -1) + r'$', r'$' + vec(-1, -1, -1) + r'$'],
    [r'Einfallswinkel gleich Ausfallswinkel: Die Komponente senkrecht zum Spiegel kehrt sich um.',
     r'$(1;\ 1;\ 1)$. $(-1;\ -1;\ 1)$ liefe genau zurück.'])

Q.q(r'An welcher Ebene muss man $A(1 \mid 0 \mid 0)$ spiegeln, um $B(3 \mid 0 \mid 0)$ zu erhalten?',
    [r'$x = 2$', r'$x = 0$', r'$x = 3$', r'$y = 2$'],
    [r'Die Spiegelebene steht senkrecht auf $\vec{AB}$ und geht durch den Mittelpunkt $(2 \mid 0 \mid 0)$.',
     r'Also $x = 2$.'])

Q.q(r'An welcher Ebene muss man $A(1 \mid 2 \mid 3)$ spiegeln, um $B(3 \mid 4 \mid 1)$ zu erhalten?',
    [r'$x + y - z = 3$', r'$x + y + z = 7$', r'$x + y - z = 0$', r'$2x + 2y - 2z = 3$'],
    [r'Normalenvektor $\vec{AB} = (2;\ 2;\ -2)$, kürzer $(1;\ 1;\ -1)$; Mittelpunkt $(2 \mid 3 \mid 2)$.',
     r'$d = 2 + 3 - 2 = 3$.'])

Q.q(r'Welche Punkte bleiben bei der Spiegelung an einer Ebene $E$ an ihrem Platz?',
    [r'genau die Punkte von $E$', r'kein Punkt', r'nur der Lotfußpunkt des Ursprungs', r'alle Punkte'],
    [r'Für $P$ in $E$ ist der Lotfußpunkt $P$ selbst.',
     r'Dann ist auch $P^\prime = P$. Alle anderen Punkte wechseln die Seite.'])

Q.q(r'Der Ursprung wird an $E\colon 2x + y + 2z = 9$ gespiegelt. Wie weit sind $O$ und sein Bild voneinander entfernt?',
    [r'$6$', r'$3$', r'$9$', r'$4{,}5$'],
    [r'Abstand von $O$ zu $E$: $\tfrac93 = 3$.',
     r'Das Bild liegt genauso weit auf der anderen Seite: $2 \cdot 3 = 6$.'])

Q.q(r'Wohin wird $P(2 \mid 0 \mid 0)$ an der Ebene $x + y = 0$ gespiegelt?',
    [r'$(0 \mid -2 \mid 0)$', r'$(-2 \mid 0 \mid 0)$', r'$(1 \mid -1 \mid 0)$', r'$(0 \mid 2 \mid 0)$'],
    [r'Lotgerade $(2 + t \mid t \mid 0)$: $2 + 2t = 0$, $t = -1$, $F(1 \mid -1 \mid 0)$.',
     r'$P^\prime = 2F - P = (0 \mid -2 \mid 0)$.'])

Q.q(r'Von $A(0 \mid 0 \mid 1)$ soll ein Weg über einen Punkt der Ebene $z = 0$ nach $B(4 \mid 0 \mid 3)$ führen. Wie lang ist der kürzeste?',
    [r'$4\sqrt2 \approx 5{,}66$', r'$\sqrt{20} \approx 4{,}47$', r'$4$', r'$8$'],
    [r'$A$ an der Ebene spiegeln: $A^\prime(0 \mid 0 \mid -1)$. Jeder Weg über die Ebene ist so lang wie der Weg von $A^\prime$ nach $B$.',
     r'Am kürzesten ist die Strecke: $|(4;\ 0;\ 4)| = 4\sqrt2$. $\sqrt{20}$ ist der direkte Weg ohne Ebene.'])

Q.q(r'Über welchen Punkt der Ebene führt der kürzeste Weg aus Aufgabe 18?',
    [r'$(1 \mid 0 \mid 0)$', r'$(2 \mid 0 \mid 0)$', r'$(0 \mid 0 \mid 0)$', r'$(3 \mid 0 \mid 0)$'],
    [r'Strecke $A^\prime B$: $(0;\ 0;\ -1) + s(4;\ 0;\ 4)$, $z = 0$ bei $s = \tfrac14$.',
     r'$(1 \mid 0 \mid 0)$. Dort gilt Einfallswinkel gleich Ausfallswinkel.'])

Q.q(r'$P$ wird an einer Ebene gespiegelt, das Bild $P^\prime$ wird noch einmal an derselben Ebene gespiegelt. Was entsteht?',
    [r'wieder $P$', r'der Lotfußpunkt', r'ein Punkt im doppelten Abstand', r'der Ursprung'],
    [r'Die Spiegelung macht sich selbst rückgängig.',
     r'Zweimal angewandt ergibt sie die identische Abbildung.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    def refl(P, n, d):
        P, n = a(*P), a(*n)
        return P - 2 * (n @ P - d) / (n @ n) * n
    assert (refl((1, 2, 3), (0, 0, 1), 0) == a(1, 2, -3)).all() and (refl((1, 2, 3), (1, 0, 0), 0) == a(-1, 2, 3)).all()
    assert (2 * a(2, 2, 2) - a(1, 2, 3) == a(3, 2, 1)).all()
    assert (refl((0, 0, 0), (2, 1, 2), 9) == a(4, 2, 4)).all() and (refl((3, 4, 5), (1, 1, 1), 3) == a(-3, -2, -1)).all()
    def refl_line(P, u):
        P, u = a(*P), a(*u)
        return 2 * (P @ u / (u @ u)) * u - P
    assert (refl_line((1, 1, 0), (1, 0, 0)) == a(1, -1, 0)).all() and (refl_line((0, 2, 0), (1, 1, 0)) == a(2, 0, 0)).all()
    assert (refl((1, 3, 5), (1, -1, 0), 0) == a(3, 1, 5)).all()
    assert (refl((0, 0, 2), (0, 0, 1), 0) == a(0, 0, -2)).all() and (refl((1, 0, 3), (0, 0, 1), 0) == a(1, 0, -3)).all()
    u = a(1, 1, -1)
    assert (u - 2 * (u @ a(0, 0, 1)) * a(0, 0, 1) == a(1, 1, 1)).all()
    assert (refl((1, 0, 0), (1, 0, 0), 2) == a(3, 0, 0)).all() and (refl((1, 2, 3), (1, 1, -1), 3) == a(3, 4, 1)).all()
    assert np.linalg.norm(refl((0, 0, 0), (2, 1, 2), 9)) == 6 and (refl((2, 0, 0), (1, 1, 0), 0) == a(0, -2, 0)).all()
    A1, B = a(0, 0, -1), a(4, 0, 3)
    assert abs(np.linalg.norm(B - A1) - 4 * math.sqrt(2)) < 1e-12 and (A1 + 0.25 * (B - A1) == a(1, 0, 0)).all()
    assert abs(np.linalg.norm(B - a(0, 0, 1)) - math.sqrt(20)) < 1e-12
    assert (refl(tuple(refl((3, 4, 5), (1, 1, 1), 3)), (1, 1, 1), 3) == a(3, 4, 5)).all()


Q.verify(check)
Q.save()
