#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 6 (LB 1): Ebenen im Raum I - Parametergleichung aus drei
Punkten, Vektorprodukt und Normalenvektor, Koordinatengleichung ax + by + cz = d,
Spurpunkte und Punktprobe. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec
from svgfig import Solid, GREEN, MUTED

Q = fos12(nr=6, slug='ebenen1', thema='Ebenen im Raum I', lb='LB 1',
          blurb='Parametergleichung, Vektorprodukt, Normalenvektor, Koordinatengleichung',
          comment='Blocks: Parametergleichung (1-5), Vektorprodukt und Normalenvektor (6-11), Koordinatengleichung (12-16), Spurpunkte und Anwendungen (17-20). Alles ohne CAS.')


# ------------------------------------------------------------------ figure ----
def spur_fig(sx, sy, sz):
    """The three axis intercepts of a plane and the triangle between them."""
    f = Solid(w=360, h=270, scale=32, ox=85, oy=175)
    f.axes(lx=5, ly=7, lz=4)
    A, B, C = (sx, 0, 0), (0, sy, 0), (0, 0, sz)
    f.face([A, B, C], fill=GREEN, opacity=0.18, stroke=GREEN, width=1.8)
    for p, lab, pos in ((A, 'Sx', 'below-left'), (B, 'Sy', 'below-right'), (C, 'Sz', 'above')):
        f.vertex(p, lab, pos, color=GREEN)
    f.label3((0, 0, 0), 'O', dx=-11, dy=6, color=MUTED)
    svg = f.svg('Ebene mit ihren drei Spurpunkten')
    assert "'" not in svg
    return svg


def E(p, u, v, a='s', b='t'):
    """Parametergleichung as LaTeX: x = p + s*u + t*v."""
    return (r'\vec x = ' + vec(*p) + ' + ' + a + r' \cdot ' + vec(*u)
            + ' + ' + b + r' \cdot ' + vec(*v))


# ------------------------------------------------------- Parametergleichung ----
Q.q(r'Stelle eine Parametergleichung der Ebene durch $A(1|2|0)$, $B(3|2|1)$ und $C(1|5|2)$ auf.',
    [r'$E: ' + E((1, 2, 0), (2, 0, 1), (0, 3, 2)) + '$',
     r'$E: ' + E((1, 2, 0), (3, 2, 1), (1, 5, 2)) + '$',
     r'$E: ' + E((1, 2, 0), (4, 4, 1), (2, 7, 2)) + '$',
     r'$E: ' + E((2, 0, 1), (1, 2, 0), (0, 3, 2)) + '$'],
    [r'Drei-Punkte-Form: $\vec x = \vec a + s \cdot \overrightarrow{AB} + t \cdot \overrightarrow{AC}$',
     r'$\overrightarrow{AB} = ' + vec(2, 0, 1) + r'$ und $\overrightarrow{AC} = ' + vec(0, 3, 2) + '$ - jeweils „Spitze minus Fuß“.',
     r'Falle: die Ortsvektoren von $B$ und $C$ sind keine Spannvektoren, es müssen die Differenzen sein.'])

Q.q(r'Liegt $P(3|3|3)$ in der Ebene $E: ' + E((1, 1, 0), (1, 0, 1), (0, 2, 1)) + '$?',
    [r'ja, mit $s = 2$ und $t = 1$', r'ja, mit $s = 1$ und $t = 2$',
     r'nein, $P$ liegt nicht in $E$', r'das lässt sich nur mit einer Koordinatengleichung entscheiden'],
    [r'Punktprobe: $1 + s = 3$, $1 + 2t = 3$, $s + t = 3$.',
     r'Aus den ersten beiden Zeilen: $s = 2$ und $t = 1$. Probe in der dritten: $2 + 1 = 3$ - stimmt.',
     r'Erst wenn alle drei Zeilen passen, liegt der Punkt in der Ebene.'])

Q.q(r'Welche Bedingung müssen die beiden Spannvektoren einer Ebene erfüllen?',
    [r'Sie dürfen nicht parallel (kollinear) sein.',
     r'Sie müssen senkrecht aufeinander stehen.',
     r'Sie müssen beide den Betrag $1$ haben.',
     r'Sie müssen senkrecht zum Stützvektor stehen.'],
    [r'Zwei parallele Spannvektoren spannen nur eine Gerade auf, keine Ebene.',
     r'Senkrecht oder normiert müssen sie nicht sein - das macht die Rechnung nur bequemer.',
     r'Probe: ist $\vec v = k \cdot \vec u$, so beschreibt die Gleichung keine Ebene.'])

Q.q(r'Stelle eine Parametergleichung der Ebene auf, die den Punkt $P(2|1|3)$ und die Gerade $g: \vec x = ' + vec(1, 0, 1) + r' + r \cdot ' + vec(1, 2, 0) + '$ enthält.',
    [r'$E: ' + E((1, 0, 1), (1, 2, 0), (1, 1, 2)) + '$',
     r'$E: ' + E((1, 0, 1), (1, 2, 0), (2, 1, 3)) + '$',
     r'$E: ' + E((2, 1, 3), (1, 0, 1), (1, 2, 0)) + '$',
     r'$E: ' + E((1, 0, 1), (1, 2, 0), (3, 1, 4)) + '$'],
    [r'Die Ebene erbt Stützpunkt und Richtungsvektor der Geraden.',
     r'Zweiter Spannvektor: vom Stützpunkt der Geraden zu $P$, also $' + vec(2, 1, 3) + ' - ' + vec(1, 0, 1) + ' = ' + vec(1, 1, 2) + '$.',
     r'Probe: $s = 0$, $t = 1$ liefert $P(2|1|3)$; $t = 0$ liefert die ganze Gerade.'])

Q.q(r'Welche Gleichung beschreibt die Ebene, die parallel zur $x$-$y$-Ebene in der Höhe $z = 4$ liegt?',
    [r'$E: ' + E((0, 0, 4), (1, 0, 0), (0, 1, 0)) + '$',
     r'$E: ' + E((0, 0, 4), (1, 0, 0), (0, 0, 1)) + '$',
     r'$E: ' + E((4, 0, 0), (0, 1, 0), (0, 0, 1)) + '$',
     r'$E: ' + E((0, 0, 0), (1, 0, 0), (0, 1, 0)) + '$'],
    [r'Der Stützpunkt muss die Höhe $4$ haben: $(0|0|4)$.',
     r'Die Spannvektoren dürfen die Höhe nicht verändern, also $' + vec(1, 0, 0) + r'$ und $' + vec(0, 1, 0) + '$.',
     r'Jeder Punkt der Ebene hat dann $z = 4$ - das ist die Koordinatengleichung $z = 4$.'])

# -------------------------------------------- Vektorprodukt und Normalenvektor ----
Q.q(r'Berechne das Vektorprodukt $' + vec(1, 0, 2) + r' \times ' + vec(3, 1, 0) + '$.',
    [r'$' + vec(-2, 6, 1) + '$', r'$' + vec(2, 6, 1) + '$', r'$' + vec(-2, -6, 1) + '$', r'$' + vec(3, 0, 0) + '$'],
    [r'$\vec u \times \vec v = ' + vec(r'u_2 v_3 - u_3 v_2', r'u_3 v_1 - u_1 v_3', r'u_1 v_2 - u_2 v_1') + '$',
     r'$' + vec(r'0 \cdot 0 - 2 \cdot 1', r'2 \cdot 3 - 1 \cdot 0', r'1 \cdot 1 - 0 \cdot 3') + ' = ' + vec(-2, 6, 1) + '$',
     r'Probe: $' + vec(1, 0, 2) + r' \cdot ' + vec(-2, 6, 1) + ' = -2 + 0 + 2 = 0$ - das Ergebnis steht senkrecht auf beiden.'])

Q.q(r'Welche Eigenschaft hat das Vektorprodukt $\vec u \times \vec v$?',
    [r'Es steht senkrecht auf $\vec u$ und auf $\vec v$.',
     r'Es ist parallel zu $\vec u$.',
     r'Es ist eine Zahl, kein Vektor.',
     r'Sein Betrag ist stets $|\vec u| \cdot |\vec v|$.'],
    [r'Deshalb ist es genau der Normalenvektor der von $\vec u$ und $\vec v$ aufgespannten Ebene.',
     r'Eine Zahl liefert das Skalarprodukt $\vec u \cdot \vec v$ - beim Vektorprodukt kommt ein Vektor heraus.',
     r'Für den Betrag gilt $|\vec u \times \vec v| = |\vec u| \cdot |\vec v| \cdot \sin\varphi$, also nur bei $\varphi = 90^\circ$ das volle Produkt.'])

Q.q(r'Bei welchem Paar ist das Vektorprodukt der Nullvektor?',
    [r'$' + vec(1, 2, 3) + r'$ und $' + vec(2, 4, 6) + '$',
     r'$' + vec(1, 2, 3) + r'$ und $' + vec(3, 2, 1) + '$',
     r'$' + vec(1, 0, 0) + r'$ und $' + vec(0, 1, 0) + '$',
     r'$' + vec(2, -1, 2) + r'$ und $' + vec(1, 2, 0) + '$'],
    [r'$' + vec(2, 4, 6) + r' = 2 \cdot ' + vec(1, 2, 3) + '$ - die Vektoren sind parallel.',
     r'Parallele Vektoren spannen kein Parallelogramm auf, die Fläche ist $0$: $\vec u \times \vec v = \vec 0$.',
     r'Falle: $' + vec(2, -1, 2) + r'$ und $' + vec(1, 2, 0) + r'$ stehen senkrecht - da ist das Skalarprodukt $0$, nicht das Vektorprodukt.'])

Q.q(r'Bestimme einen Normalenvektor der Ebene $E: ' + E((1, 1, 0), (2, 1, 0), (1, 0, 2)) + '$.',
    [r'$' + vec(2, -4, -1) + '$', r'$' + vec(2, 4, -1) + '$', r'$' + vec(2, 0, 0) + '$', r'$' + vec(3, 1, 2) + '$'],
    [r'Der Normalenvektor ist das Vektorprodukt der Spannvektoren: $' + vec(2, 1, 0) + r' \times ' + vec(1, 0, 2) + '$.',
     r'$' + vec(r'1 \cdot 2 - 0 \cdot 0', r'0 \cdot 1 - 2 \cdot 2', r'2 \cdot 0 - 1 \cdot 1') + ' = ' + vec(2, -4, -1) + '$',
     r'Probe: $4 - 4 + 0 = 0$ und $2 + 0 - 2 = 0$ - beide Skalarprodukte verschwinden.'])

Q.q(r'Ist $\vec n = ' + vec(1, -2, 1) + r'$ ein Normalenvektor der Ebene $E: ' + E((0, 0, 0), (2, 1, 0), (1, 1, 1)) + '$?',
    [r'ja, denn beide Skalarprodukte sind $0$',
     r'nein, denn $\vec n \cdot \vec u = 4$',
     r'ja, denn $\vec n \times \vec u = \vec 0$',
     r'nein, denn $\vec n$ hat nicht den Betrag $1$'],
    [r'$\vec n \cdot ' + vec(2, 1, 0) + ' = 2 - 2 + 0 = 0$',
     r'$\vec n \cdot ' + vec(1, 1, 1) + ' = 1 - 2 + 1 = 0$',
     r'Der Vektor steht auf beiden Spannvektoren senkrecht - das Vektorprodukt muss man dafür nicht ausrechnen.'])

Q.q(r'Bestimme einen Normalenvektor der Ebene durch $A(2|0|0)$, $B(0|4|0)$ und $C(0|0|4)$.',
    [r'$' + vec(2, 1, 1) + '$', r'$' + vec(1, 2, 2) + '$', r'$' + vec(2, 4, 4) + '$', r'$' + vec(-2, 4, 0) + '$'],
    [r'$\overrightarrow{AB} = ' + vec(-2, 4, 0) + r'$ und $\overrightarrow{AC} = ' + vec(-2, 0, 4) + '$',
     r'$\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(16, 8, 8) + r'$; gekürzt mit $8$: $' + vec(2, 1, 1) + '$',
     r'Probe: $-4 + 4 + 0 = 0$ und $-4 + 0 + 4 = 0$. $' + vec(-2, 4, 0) + '$ liegt dagegen in der Ebene.'])

# ----------------------------------------------------- Koordinatengleichung ----
Q.q(r'Die Ebene $E$ hat den Normalenvektor $\vec n = ' + vec(2, -1, 3) + r'$ und geht durch $P(1|1|2)$. Wie lautet ihre Koordinatengleichung?',
    [r'$2x - y + 3z = 7$', r'$2x - y + 3z = 4$', r'$2x - y + 3z = -7$', r'$x + y + 2z = 6$'],
    [r'Aus dem Normalenvektor kommen die Koeffizienten: $2x - y + 3z = d$.',
     r'$d$ durch Einsetzen von $P$: $2 \cdot 1 - 1 + 3 \cdot 2 = 7$',
     r'Falle: $d$ ist nicht die Summe der Punktkoordinaten ($1 + 1 + 2 = 4$), sondern das Skalarprodukt $\vec n \cdot \vec p$.'])

Q.q(r'Wandle $E: ' + E((1, 0, 2), (1, 1, 0), (0, 1, 1)) + '$ in eine Koordinatengleichung um.',
    [r'$x - y + z = 3$', r'$x + y + z = 3$', r'$x - y + z = 1$', r'$x - y + z = 0$'],
    [r'Normalenvektor: $' + vec(1, 1, 0) + r' \times ' + vec(0, 1, 1) + ' = ' + vec(1, -1, 1) + '$',
     r'Ansatz $x - y + z = d$, Stützpunkt $(1|0|2)$ einsetzen: $1 - 0 + 2 = 3$',
     r'Probe mit einem zweiten Punkt, z. B. $s = 1$: $(2|1|2)$ gibt $2 - 1 + 2 = 3$.'])

Q.q(r'Liegt $P(2|1|-1)$ in der Ebene $E: 3x - 2y + z = 3$?',
    [r'ja, denn $3 \cdot 2 - 2 \cdot 1 + (-1) = 3$',
     r'nein, es kommt $5$ heraus',
     r'nein, es kommt $9$ heraus',
     r'das lässt sich nur mit der Parametergleichung prüfen'],
    [r'Punktprobe: die Koordinaten von $P$ in die linke Seite einsetzen.',
     r'$6 - 2 - 1 = 3$ - das ist genau die rechte Seite, also liegt $P$ in $E$.',
     r'In der Koordinatenform ist die Punktprobe nur eine Zeile - in der Parameterform ein ganzes LGS.'])

Q.q(r'Welche Ebene ist echt parallel zu $E: 2x + y - 2z = 6$?',
    [r'$4x + 2y - 4z = 1$', r'$4x + 2y - 4z = 12$', r'$2x + y + 2z = 6$', r'$x + 2y - 2z = 6$'],
    [r'Parallel heißt: gleicher Normalenvektor bis auf einen Faktor. $' + vec(4, 2, -4) + r' = 2 \cdot ' + vec(2, 1, -2) + '$',
     r'Echt parallel heißt außerdem: kein gemeinsamer Punkt. Die rechte Seite müsste bei $4x + 2y - 4z$ den Wert $12$ haben, damit es dieselbe Ebene wäre.',
     r'$4x + 2y - 4z = 12$ ist also $E$ selbst; die beiden anderen haben einen anderen Normalenvektor und schneiden $E$.'])

Q.q(r'Bestimme die Spurpunkte von $E: 2x + 3y + 6z = 12$.',
    [r'$S_x(6|0|0)$, $S_y(0|4|0)$, $S_z(0|0|2)$',
     r'$S_x(2|0|0)$, $S_y(0|3|0)$, $S_z(0|0|6)$',
     r'$S_x(12|0|0)$, $S_y(0|12|0)$, $S_z(0|0|12)$',
     r'$S_x(6|0|0)$, $S_y(0|2|0)$, $S_z(0|0|4)$'],
    [r'Spurpunkt auf der $x$-Achse: $y = z = 0$ setzen, also $2x = 12$ und $x = 6$.',
     r'Ebenso $3y = 12$ mit $y = 4$ und $6z = 12$ mit $z = 2$.',
     r'Merkregel: $d$ durch den jeweiligen Koeffizienten teilen - nicht die Koeffizienten selbst hinschreiben.'])

# ------------------------------------------------ Spurpunkte und Anwendungen ----
Q.q(r'Eine Ebene schneidet die $x$-Achse bei $4$, die $y$-Achse bei $6$ und die $z$-Achse bei $3$ (siehe Skizze). Wie lautet ihre Koordinatengleichung?',
    [r'$3x + 2y + 4z = 12$', r'$4x + 6y + 3z = 12$', r'$2x + 3y + 4z = 12$', r'$6x + 4y + 3z = 12$'],
    [r'Ansatz $ax + by + cz = d$ mit $d = 12$ (dem kleinsten gemeinsamen Vielfachen von $4$, $6$ und $3$).',
     r'$a = \dfrac{12}{4} = 3$, $b = \dfrac{12}{6} = 2$, $c = \dfrac{12}{3} = 4$',
     r'Probe: $(4|0|0)$ gibt $12$, $(0|6|0)$ gibt $12$, $(0|0|3)$ gibt $12$.'],
    fig=spur_fig(4, 6, 3), figcap='Die Ebene und ihr Spurdreieck')

Q.q(r'Welche Besonderheit hat die Ebene $E: 3y + 2z = 6$?',
    [r'Sie verläuft parallel zur $x$-Achse.',
     r'Sie verläuft parallel zur $y$-$z$-Ebene.',
     r'Sie geht durch den Ursprung.',
     r'Sie verläuft parallel zur $x$-$y$-Ebene.'],
    [r'Der Normalenvektor ist $' + vec(0, 3, 2) + r'$; er steht senkrecht auf $' + vec(1, 0, 0) + '$, der Richtung der $x$-Achse.',
     r'Ein Richtungsvektor der Ebene ist damit $' + vec(1, 0, 0) + '$ - die Ebene läuft in $x$-Richtung unbegrenzt weiter.',
     r'Durch den Ursprung geht sie nicht: $0 \ne 6$. Deshalb gibt es auch keinen Spurpunkt auf der $x$-Achse.'])

Q.q(r'Eine Solaranlage liegt in der Ebene durch $A(0|0|2)$, $B(4|0|2)$ und $C(0|3|5)$ (Angaben in Metern). Wie lautet eine Koordinatengleichung dieser Ebene?',
    [r'$-y + z = 2$', r'$y + z = 2$', r'$-y + z = 0$', r'$x - y + z = 2$'],
    [r'$\overrightarrow{AB} = ' + vec(4, 0, 0) + r'$, $\overrightarrow{AC} = ' + vec(0, 3, 3) + r'$, Vektorprodukt $' + vec(0, -12, 12) + r'$, gekürzt $' + vec(0, -1, 1) + '$.',
     r'$-y + z = d$ mit $A(0|0|2)$: $d = 2$.',
     r'Probe: $C$ gibt $-3 + 5 = 2$. Dass $x$ fehlt, passt: die Anlage steigt nur in $y$-Richtung an.'])

Q.q(r'Liegen die vier Punkte $A(1|0|0)$, $B(0|1|0)$, $C(0|0|1)$ und $D(1|1|1)$ in einer gemeinsamen Ebene?',
    [r'Nein: $A$, $B$ und $C$ spannen die Ebene $x + y + z = 1$ auf, für $D$ ergibt sich aber $3$.',
     r'Ja, alle vier erfüllen $x + y + z = 1$.',
     r'Ja, weil sie Ecken eines Würfels sind.',
     r'Nein, weil $A$, $B$ und $C$ auf einer Geraden liegen.'],
    [r'Die Ebene durch $A$, $B$, $C$ hat die Spurpunkte $(1|0|0)$, $(0|1|0)$, $(0|0|1)$, also $x + y + z = 1$.',
     r'Punktprobe für $D$: $1 + 1 + 1 = 3 \ne 1$.',
     r'$D$ liegt also über der Ebene - vier Punkte im Raum liegen im Allgemeinen nicht in einer Ebene.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    sub = lambda p, q: tuple(x - y for x, y in zip(p, q))
    add = lambda p, q: tuple(x + y for x, y in zip(p, q))
    mul = lambda k, v: tuple(k * x for x in v)
    cross = lambda u, v: tuple(sp.Matrix(list(u)).cross(sp.Matrix(list(v))))
    coplanar = lambda u, v: sp.Matrix([list(u), list(v)]).rank() == 1

    def plane(p, u, v):
        """(n, d) of the plane through p spanned by u, v - reduced by the gcd."""
        n = cross(u, v)
        g = sp.gcd(sp.gcd(n[0], n[1]), n[2])
        n = tuple(sp.nsimplify(c / g) for c in n)
        return n, dot(n, p)

    def same_plane(a, b):
        (n1, d1), (n2, d2) = a, b
        return coplanar(n1, n2) and sp.Matrix([list(n1) + [d1], list(n2) + [d2]]).rank() == 1

    # 1: Parametergleichung aus drei Punkten
    A, B, C = (1, 2, 0), (3, 2, 1), (1, 5, 2)
    assert sub(B, A) == (2, 0, 1) and sub(C, A) == (0, 3, 2) and add(B, A) == (4, 4, 1) and add(C, A) == (2, 7, 2)
    # 2: Punktprobe in Parameterform
    P = lambda p, u, v, s, t: tuple(p[i] + s * u[i] + t * v[i] for i in range(3))
    assert P((1, 1, 0), (1, 0, 1), (0, 2, 1), 2, 1) == (3, 3, 3)
    assert P((1, 1, 0), (1, 0, 1), (0, 2, 1), 1, 2) == (2, 5, 3)
    # 4: Ebene aus Punkt und Gerade
    assert sub((2, 1, 3), (1, 0, 1)) == (1, 1, 2) and add((2, 1, 3), (1, 0, 1)) == (3, 1, 4)
    right = plane((1, 0, 1), (1, 2, 0), (1, 1, 2))
    for bad in (plane((1, 0, 1), (1, 2, 0), (2, 1, 3)), plane((2, 1, 3), (1, 0, 1), (1, 2, 0)),
                plane((1, 0, 1), (1, 2, 0), (3, 1, 4))):
        assert not same_plane(right, bad)
    assert P((1, 0, 1), (1, 2, 0), (1, 1, 2), 0, 1) == (2, 1, 3)
    # 5: Ebene z = 4
    assert all(P((0, 0, 4), (1, 0, 0), (0, 1, 0), s, t)[2] == 4 for s, t in ((0, 0), (2, -3), (5, 7)))
    for bad in (plane((0, 0, 4), (1, 0, 0), (0, 0, 1)), plane((4, 0, 0), (0, 1, 0), (0, 0, 1)),
                plane((0, 0, 0), (1, 0, 0), (0, 1, 0))):
        assert not same_plane(plane((0, 0, 4), (1, 0, 0), (0, 1, 0)), bad)
    # 6: Vektorprodukt
    assert cross((1, 0, 2), (3, 1, 0)) == (-2, 6, 1)
    assert dot((1, 0, 2), (-2, 6, 1)) == 0 and dot((3, 1, 0), (-2, 6, 1)) == 0
    assert (1 * 3, 0 * 1, 2 * 0) == (3, 0, 0)
    # 8: Nullvektor
    assert cross((1, 2, 3), (2, 4, 6)) == (0, 0, 0) and mul(2, (1, 2, 3)) == (2, 4, 6)
    assert cross((1, 2, 3), (3, 2, 1)) != (0, 0, 0) and cross((1, 0, 0), (0, 1, 0)) != (0, 0, 0)
    assert cross((2, -1, 2), (1, 2, 0)) != (0, 0, 0) and dot((2, -1, 2), (1, 2, 0)) == 0
    # 9: Normalenvektor
    assert cross((2, 1, 0), (1, 0, 2)) == (2, -4, -1)
    assert dot((2, 1, 0), (2, -4, -1)) == 0 and dot((1, 0, 2), (2, -4, -1)) == 0
    for bad in ((2, 4, -1), (2, 0, 0), (3, 1, 2)):
        assert dot((2, 1, 0), bad) != 0 or dot((1, 0, 2), bad) != 0
    assert (2 * 1, 1 * 0, 0 * 2) == (2, 0, 0) and add((2, 1, 0), (1, 0, 2)) == (3, 1, 2)
    # 10: Normalenvektor prüfen
    assert dot((1, -2, 1), (2, 1, 0)) == 0 and dot((1, -2, 1), (1, 1, 1)) == 0
    # 11: Normalenvektor aus drei Punkten
    A2, B2, C2 = (2, 0, 0), (0, 4, 0), (0, 0, 4)
    assert sub(B2, A2) == (-2, 4, 0) and sub(C2, A2) == (-2, 0, 4)
    assert cross((-2, 4, 0), (-2, 0, 4)) == (16, 8, 8) and mul(8, (2, 1, 1)) == (16, 8, 8)
    assert dot((2, 1, 1), (-2, 4, 0)) == 0 and dot((2, 1, 1), (-2, 0, 4)) == 0
    for bad in ((1, 2, 2), (2, 4, 4), (-2, 4, 0)):
        assert dot(bad, (-2, 4, 0)) != 0 or dot(bad, (-2, 0, 4)) != 0
    # 12: Koordinatengleichung aus Normalenvektor und Punkt
    assert dot((2, -1, 3), (1, 1, 2)) == 7 and 1 + 1 + 2 == 4 and dot((1, 1, 2), (1, 1, 2)) == 6
    # 13: Parameter- in Koordinatenform
    n13, d13 = plane((1, 0, 2), (1, 1, 0), (0, 1, 1))
    assert (n13, d13) == ((1, -1, 1), 3) and dot((1, -1, 1), P((1, 0, 2), (1, 1, 0), (0, 1, 1), 1, 0)) == 3
    # 14: Punktprobe in Koordinatenform
    assert dot((3, -2, 1), (2, 1, -1)) == 3
    # 15: echt parallel
    assert mul(2, (2, 1, -2)) == (4, 2, -4) and 2 * 6 == 12
    assert not same_plane(((4, 2, -4), 1), ((2, 1, -2), 6)) and same_plane(((4, 2, -4), 12), ((2, 1, -2), 6))
    assert not coplanar((2, 1, 2), (2, 1, -2)) and not coplanar((1, 2, -2), (2, 1, -2))
    # 16: Spurpunkte
    assert F(12, 2) == 6 and F(12, 3) == 4 and F(12, 6) == 2
    for p in ((6, 0, 0), (0, 4, 0), (0, 0, 2)):
        assert dot((2, 3, 6), p) == 12
    for p in ((2, 0, 0), (0, 3, 0), (0, 0, 6), (12, 0, 0), (0, 2, 0), (0, 0, 4)):
        assert dot((2, 3, 6), p) != 12
    # 17: Achsenabschnitte -> Koordinatengleichung
    for p in ((4, 0, 0), (0, 6, 0), (0, 0, 3)):
        assert dot((3, 2, 4), p) == 12
    for n in ((4, 6, 3), (2, 3, 4), (6, 4, 3)):
        assert not all(dot(n, p) == 12 for p in ((4, 0, 0), (0, 6, 0), (0, 0, 3)))
    # 18: Ebene parallel zur x-Achse
    assert dot((0, 3, 2), (1, 0, 0)) == 0 and dot((0, 3, 2), (0, 0, 0)) != 6
    # 19: Solaranlage
    A3, B3, C3 = (0, 0, 2), (4, 0, 2), (0, 3, 5)
    assert sub(B3, A3) == (4, 0, 0) and sub(C3, A3) == (0, 3, 3)
    assert cross((4, 0, 0), (0, 3, 3)) == (0, -12, 12)
    assert plane(A3, (4, 0, 0), (0, 3, 3)) == ((0, -1, 1), 2)
    for p in (A3, B3, C3):
        assert dot((0, -1, 1), p) == 2
    for n, d in (((0, 1, 1), 2), ((0, -1, 1), 0), ((1, -1, 1), 2)):
        assert not same_plane(((0, -1, 1), 2), (n, d))
    # 20: vier Punkte komplanar?
    for p in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
        assert dot((1, 1, 1), p) == 1
    assert dot((1, 1, 1), (1, 1, 1)) == 3
    assert sp.Matrix([sub((0, 1, 0), (1, 0, 0)), sub((0, 0, 1), (1, 0, 0))]).rank() == 2


Q.verify(check)
Q.save()
