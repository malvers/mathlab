#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 15 (LB 7): Skalarprodukt und Vektorprodukt
mit ihrer geometrischen Interpretation - Winkel, Orthogonalität, Projektion, Flächeninhalt,
Rechenregeln. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=15, slug='skalar-vektorprodukt', thema='Skalarprodukt und Vektorprodukt', lb='LB 7',
         blurb='Winkel, Orthogonalität, Projektion, Flächen mit dem Vektorprodukt',
         comment='Blocks: Skalarprodukt und Winkel (1-4, 12, 13, 18, 20), Orthogonalität (14, 16), Vektorprodukt (5-11, 15, 17), Flächen (7, 8, 19). Taschenrechner erlaubt.')

Q.q(r'Berechne $' + vec(1, 2, 3) + r' \cdot ' + vec(4, -1, 2) + r'$.',
    [r'$8$', r'$12$', r'$' + vec(4, -2, 6) + r'$', r'$2$'],
    [r'$1 \cdot 4 + 2 \cdot (-1) + 3 \cdot 2 = 4 - 2 + 6$.',
     r'$= 8$. Das Skalarprodukt ist eine Zahl, kein Vektor.'])

Q.q(r'Welchen Winkel schließen $' + vec(1, 0, 0) + r'$ und $' + vec(1, 1, 0) + r'$ ein?',
    [r'$45^\circ$', r'$90^\circ$', r'$60^\circ$', r'$30^\circ$'],
    [r'$\cos\varphi = \dfrac{1}{1 \cdot \sqrt2}$.',
     r'$\varphi = 45^\circ$.'])

Q.q(r'Welchen Winkel schließen $' + vec(2, 1, 2) + r'$ und $' + vec(1, 2, -2) + r'$ ein?',
    [r'$90^\circ$', r'$0^\circ$', r'$45^\circ$', r'$63{,}6^\circ$'],
    [r'Skalarprodukt $2 + 2 - 4 = 0$.',
     r'Die Vektoren stehen senkrecht aufeinander.'])

Q.q(r'Welchen Winkel schließen $' + vec(1, 2, 2) + r'$ und $' + vec(2, -1, 2) + r'$ ein?',
    [r'$\approx 63{,}6^\circ$', r'$\approx 26{,}4^\circ$', r'$\approx 116{,}4^\circ$', r'$90^\circ$'],
    [r'Skalarprodukt $2 - 2 + 4 = 4$, beide Beträge $3$.',
     r'$\cos\varphi = \tfrac49$, $\varphi \approx 63{,}6^\circ$.'])

Q.q(r'Berechne $' + vec(1, 0, 0) + r' \times ' + vec(0, 1, 0) + r'$.',
    [r'$' + vec(0, 0, 1) + r'$', r'$' + vec(0, 0, -1) + r'$', r'$0$', r'$' + vec(1, 1, 0) + r'$'],
    [r'$\vec a \times \vec b = \begin{pmatrix} a_2 b_3 - a_3 b_2 \\ a_3 b_1 - a_1 b_3 \\ a_1 b_2 - a_2 b_1 \end{pmatrix} = \begin{pmatrix} 0 - 0 \\ 0 - 0 \\ 1 - 0 \end{pmatrix}$.',
     r'Die $x$- und die $y$-Richtung spannen die $x$-$y$-Ebene auf, das Produkt zeigt in $z$-Richtung.'])

Q.q(r'Berechne $' + vec(1, 2, 3) + r' \times ' + vec(4, 5, 6) + r'$.',
    [r'$' + vec(-3, 6, -3) + r'$', r'$' + vec(3, -6, 3) + r'$', r'$32$', r'$' + vec(4, 10, 18) + r'$'],
    [r'$\begin{pmatrix} 2 \cdot 6 - 3 \cdot 5 \\ 3 \cdot 4 - 1 \cdot 6 \\ 1 \cdot 5 - 2 \cdot 4 \end{pmatrix} = \begin{pmatrix} -3 \\ 6 \\ -3 \end{pmatrix}$.',
     r'$32$ wäre das Skalarprodukt, $(4;\ 10;\ 18)$ das zeilenweise Produkt.'])

Q.q(r'Wie groß ist das Parallelogramm, das $' + vec(3, 0, 0) + r'$ und $' + vec(0, 4, 0) + r'$ aufspannen?',
    [r'$12$', r'$7$', r'$5$', r'$6$'],
    [r'$\vec a \times \vec b = (0;\ 0;\ 12)$, Betrag $12$.',
     r'Probe: ein Rechteck mit den Seiten $3$ und $4$.'])

Q.q(r'Berechne den Flächeninhalt des Dreiecks $A(1 \mid 0 \mid 0)$, $B(0 \mid 2 \mid 0)$, $C(0 \mid 0 \mid 3)$.',
    [r'$3{,}5$', r'$7$', r'$3$', r'$6$'],
    [r'$\vec{AB} \times \vec{AC} = (-1;\ 2;\ 0) \times (-1;\ 0;\ 3) = (6;\ 3;\ 2)$, Betrag $\sqrt{49} = 7$.',
     r'Dreieck: die Hälfte, $3{,}5$.'])

Q.q(r'Welche Eigenschaft hat $\vec a \times \vec b$ für nicht parallele Vektoren $\vec a$, $\vec b$?',
    [r'Es steht senkrecht auf $\vec a$ und auf $\vec b$.', r'Es ist parallel zu $\vec a$.', r'Es ist eine Zahl.', r'Es halbiert den Winkel zwischen $\vec a$ und $\vec b$.'],
    [r'Probe mit Aufgabe 6: $(-3;\ 6;\ -3) \cdot (1;\ 2;\ 3) = -3 + 12 - 9 = 0$.',
     r'Darum liefert das Vektorprodukt einen Normalenvektor.'])

Q.q(r'Wie hängen $\vec a \times \vec b$ und $\vec b \times \vec a$ zusammen?',
    [r'$\vec b \times \vec a = -(\vec a \times \vec b)$', r'Sie sind gleich.', r'$\vec b \times \vec a = 0$', r'$\vec b \times \vec a = 2(\vec a \times \vec b)$'],
    [r'Vertauscht man die Faktoren, wechseln in jeder Zeile beide Produkte die Plätze.',
     r'Gleicher Betrag, entgegengesetzte Richtung.'])

Q.q(r'Wie hängt der Betrag des Vektorprodukts mit dem Winkel $\varphi$ zwischen $\vec a$ und $\vec b$ zusammen?',
    [r'$|\vec a \times \vec b| = |\vec a| \cdot |\vec b| \cdot \sin\varphi$', r'$|\vec a \times \vec b| = |\vec a| \cdot |\vec b| \cdot \cos\varphi$', r'$|\vec a \times \vec b| = |\vec a| + |\vec b|$', r'$|\vec a \times \vec b| = \sin\varphi$'],
    [r'Grundseite $|\vec a|$ mal Höhe $|\vec b|\sin\varphi$ ergibt den Flächeninhalt des Parallelogramms.',
     r'Mit dem Kosinus wird das Skalarprodukt berechnet.'])

Q.q(r'Es gilt $|\vec a| = 3$, $|\vec b| = 4$ und der Winkel zwischen ihnen ist $60^\circ$. Berechne $\vec a \cdot \vec b$.',
    [r'$6$', r'$12$', r'$6\sqrt3$', r'$7$'],
    [r'$\vec a \cdot \vec b = 3 \cdot 4 \cdot \cos 60^\circ = 12 \cdot \tfrac12$.',
     r'$= 6$. $6\sqrt3$ wäre der Betrag des Vektorprodukts.'])

Q.q(r'Wie lang ist die senkrechte Projektion von $\vec b = ' + vec(2, 1, 3) + r'$ auf die Richtung von $\vec a = ' + vec(3, 0, 4) + r'$?',
    [r'$3{,}6$', r'$18$', r'$5$', r'$\approx 3{,}74$'],
    [r'Projektionslänge $= \dfrac{\vec a \cdot \vec b}{|\vec a|} = \dfrac{6 + 0 + 12}{5}$.',
     r'$= 3{,}6$. $\sqrt{14} \approx 3{,}74$ ist die Länge von $\vec b$ selbst.'])

Q.q(r'Für welches $t$ ist $' + vec('t', 2, 1) + r'$ orthogonal zu $' + vec(3, -1, 4) + r'$?',
    [r'$t = -\tfrac23$', r'$t = \tfrac23$', r'$t = 2$', r'$t = -2$'],
    [r'$3t - 2 + 4 = 0$.',
     r'$3t = -2$, $t = -\tfrac23$.'])

Q.q(r'Berechne $' + vec(1, 2, 3) + r' \times ' + vec(2, 4, 6) + r'$.',
    [r'$\vec 0$', r'$' + vec(2, 8, 18) + r'$', r'$28$', r'$' + vec(-1, -2, -3) + r'$'],
    [r'Der zweite Vektor ist das Doppelte des ersten: Die Vektoren sind parallel.',
     r'Parallele Vektoren spannen keine Fläche auf, ihr Vektorprodukt ist der Nullvektor.'])

Q.q(r'Eine Kraft $\vec F = ' + vec(10, 0, 5) + r'$ N verschiebt einen Körper um $\vec s = ' + vec(4, 3, 0) + r'$ m. Wie groß ist die Arbeit $W = \vec F \cdot \vec s$?',
    [r'$40$ J', r'$55$ J', r'$75$ J', r'$0$ J'],
    [r'$10 \cdot 4 + 0 \cdot 3 + 5 \cdot 0$.',
     r'$= 40$ J. Nur der Kraftanteil in Bewegungsrichtung verrichtet Arbeit.'])

Q.q(r'Welcher Einheitsvektor steht senkrecht auf $' + vec(1, 0, 0) + r'$ und $' + vec(0, 1, 1) + r'$?',
    [r'$\dfrac{1}{\sqrt2}' + vec(0, -1, 1) + r'$', r'$' + vec(0, -1, 1) + r'$', r'$\dfrac{1}{\sqrt2}' + vec(1, 1, 1) + r'$', r'$' + vec(0, 1, 1) + r'$'],
    [r'Vektorprodukt: $(1;\ 0;\ 0) \times (0;\ 1;\ 1) = (0;\ -1;\ 1)$ mit dem Betrag $\sqrt2$.',
     r'Durch den Betrag teilen: Länge $1$.'])

Q.q(r'Welche Beziehung gilt für jeden Vektor $\vec a$?',
    [r'$\vec a \cdot \vec a = |\vec a|^2$', r'$\vec a \cdot \vec a = 0$', r'$\vec a \times \vec a = |\vec a|^2$', r'$\vec a \cdot \vec a = |\vec a|$'],
    [r'$a_1^2 + a_2^2 + a_3^2$ ist das Quadrat des Betrags.',
     r'Das Vektorprodukt $\vec a \times \vec a$ ist dagegen der Nullvektor.'])

Q.q(r'Berechne den Flächeninhalt des Dreiecks $A(0 \mid 0 \mid 0)$, $B(4 \mid 0 \mid 0)$, $C(1 \mid 3 \mid 0)$.',
    [r'$6$', r'$12$', r'$8$', r'$\approx 6{,}3$'],
    [r'$(4;\ 0;\ 0) \times (1;\ 3;\ 0) = (0;\ 0;\ 12)$.',
     r'Hälfte: $6$. Kontrolle: Grundseite $4$, Höhe $3$.'])

Q.q(r'Das Dreieck $A(0 \mid 0 \mid 0)$, $B(2 \mid 0 \mid 0)$, $C(1 \mid 1 \mid \sqrt2)$: Welchen Winkel hat es bei $A$?',
    [r'$60^\circ$', r'$45^\circ$', r'$90^\circ$', r'$30^\circ$'],
    [r'$\vec{AB} \cdot \vec{AC} = 2$, $|\vec{AB}| = 2$, $|\vec{AC}| = \sqrt{1 + 1 + 2} = 2$.',
     r'$\cos\alpha = \tfrac{2}{4} = \tfrac12$, also $60^\circ$. Auch $|\vec{BC}| = 2$: Das Dreieck ist gleichseitig.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    ang = lambda u, v: math.degrees(math.acos(u @ v / np.linalg.norm(u) / np.linalg.norm(v)))
    assert a(1, 2, 3) @ a(4, -1, 2) == 8
    assert abs(ang(a(1, 0, 0), a(1, 1, 0)) - 45) < 1e-9 and a(2, 1, 2) @ a(1, 2, -2) == 0
    assert abs(ang(a(1, 2, 2), a(2, -1, 2)) - 63.6) < 0.05
    assert (np.cross(a(1, 0, 0), a(0, 1, 0)) == a(0, 0, 1)).all() and (np.cross(a(1, 2, 3), a(4, 5, 6)) == a(-3, 6, -3)).all()
    assert np.linalg.norm(np.cross(a(3, 0, 0), a(0, 4, 0))) == 12
    c = np.cross(a(-1, 2, 0), a(-1, 0, 3))
    assert (c == a(6, 3, 2)).all() and np.linalg.norm(c) / 2 == 3.5
    assert a(-3, 6, -3) @ a(1, 2, 3) == 0 and (np.cross(a(4, 5, 6), a(1, 2, 3)) == -a(-3, 6, -3)).all()
    assert abs(3 * 4 * 0.5 - 6) < 1e-12 and abs(3 * 4 * math.sin(math.radians(60)) - 6 * math.sqrt(3)) < 1e-9
    assert (a(3, 0, 4) @ a(2, 1, 3)) / 5 == 3.6 and abs(math.sqrt(14) - 3.74) < 0.005
    assert 3 * (-2 / 3) - 2 + 4 == 0
    assert (np.cross(a(1, 2, 3), a(2, 4, 6)) == 0).all()
    assert a(10, 0, 5) @ a(4, 3, 0) == 40
    assert (np.cross(a(1, 0, 0), a(0, 1, 1)) == a(0, -1, 1)).all()
    assert np.linalg.norm(np.cross(a(4, 0, 0), a(1, 3, 0))) / 2 == 6
    C = a(1, 1, math.sqrt(2))
    assert abs(ang(a(2, 0, 0), C) - 60) < 1e-9 and abs(np.linalg.norm(C) - 2) < 1e-12 and abs(np.linalg.norm(C - a(2, 0, 0)) - 2) < 1e-12


Q.verify(check)
Q.save()
