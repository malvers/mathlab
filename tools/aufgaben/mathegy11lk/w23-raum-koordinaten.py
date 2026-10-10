#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 23 / KW 8 (LB 3): the spatial Cartesian coordinate system - 16 questions of the
Grundkurs sheet, 4 on spheres and on cylindrical and spherical coordinates (Lehrplan: hint at other coordinate
systems). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=23, slug='raum-koordinaten', thema='Das räumliche Koordinatensystem', lb='LB 3',
           blurb='Punkte, Körper und Koordinatenebenen, Abstand und Mittelpunkt, Zylinder- und Kugelkoordinaten',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w23), 17-20 other coordinate systems.')

qs, check_gk = harvest('w23-raum-koordinaten.py', [0, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 17, 18, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Welche Punkte haben vom Ursprung den Abstand 3?',
    [r'alle Punkte der Kugel(oberfläche) $x^2 + y^2 + z^2 = 9$', r'alle Punkte des Kreises $x^2 + y^2 = 9$ mit $z = 0$',
     r'nur $(3 \mid 3 \mid 3)$', r'die Punkte $(\pm 3 \mid 0 \mid 0)$'],
    [r'Abstand zum Ursprung: $\sqrt{x^2 + y^2 + z^2} = 3$.',
     r'Im Raum ist das eine Kugel, in der Ebene wäre es ein Kreis.'])

Q.q(r'In Zylinderkoordinaten hat ein Punkt den Abstand $r = 2$ zur $z$-Achse, den Winkel $\varphi = 90^\circ$ und die Höhe $z = 5$. Wie heißt er kartesisch?',
    [r'$(0 \mid 2 \mid 5)$', r'$(2 \mid 0 \mid 5)$', r'$(2 \mid 90 \mid 5)$', r'$(0 \mid 5 \mid 2)$'],
    [r'$x = r\cos\varphi$, $y = r\sin\varphi$, $z = z$.',
     r'$x = 2\cos 90^\circ = 0$, $y = 2\sin 90^\circ = 2$.'])

Q.q(r'Welche Fläche beschreibt die Gleichung $r = 2$ in Zylinderkoordinaten?',
    [r'einen unendlich langen Zylindermantel mit Radius 2 um die $z$-Achse', r'eine Kugel mit Radius 2',
     r'die Ebene $x = 2$', r'einen Kreis in der $xy$-Ebene'],
    [r'$r$ ist der Abstand zur $z$-Achse; $\varphi$ und $z$ sind beliebig.',
     r'Kartesisch: $x^2 + y^2 = 4$, $z$ beliebig.'])

Q.q(r'Wo begegnen dir Kugelkoordinaten im Alltag?',
    [r'bei geografischer Länge und Breite auf der Erdkugel', r'bei Hausnummern', r'bei Postleitzahlen', r'bei der Uhrzeit'],
    [r'Ein Punkt auf der Erdoberfläche ist durch Erdradius, Längengrad und Breitengrad festgelegt.',
     r'Kugelkoordinaten: Abstand zum Mittelpunkt und zwei Winkel.'])


def check():
    import sympy as sp
    check_gk()
    x, y, z = sp.symbols('x y z', real=True)
    assert sp.sqrt(3 ** 2 + 0 + 0) == 3 and sp.sqrt(3 ** 2 * 3) != 3                 # (3|3|3) is farther away
    r, ph = 2, sp.pi / 2
    assert (r * sp.cos(ph), r * sp.sin(ph)) == (0, 2)


Q.verify(check)
Q.save()
