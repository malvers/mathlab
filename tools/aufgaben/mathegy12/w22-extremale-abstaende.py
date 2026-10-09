#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 22 (LB 8): extremale Entfernungen -
Abstand Punkt-Gerade über Lotfußpunkt und Abstandsfunktion, kürzeste Entfernung zu
Funktionsgraphen, kleinster Abstand bewegter Objekte. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import sympy as sp
import math

Q = gy12(nr=22, slug='extremale-abstaende', thema='Extremale Entfernungen', lb='LB 8',
         blurb='Abstand Punkt–Gerade, kürzeste Wege zu Graphen, bewegte Objekte',
         comment='Blocks: Abstandsfunktion (1, 12, 17), Punkt und Gerade (2-5, 13, 14, 18, 20), Punkt und Graph (6-8, 15, 19), bewegte Objekte (9-11, 16). Taschenrechner erlaubt.')

Q.q(r'Welchen kleinsten Abstand hat ein Punkt $P_t(t \mid 2 - t \mid 0)$ vom Ursprung?',
    [r'$\sqrt2$', r'$2$', r'$1$', r'$0$'],
    [r'$d(t)^2 = t^2 + (2 - t)^2 = 2t^2 - 4t + 4$, Scheitel bei $t = 1$.',
     r'$d(1)^2 = 2$, also $d = \sqrt2$.'])

Q.q(r'Wie weit ist der Ursprung von der Geraden $g\colon \vec x = ' + vec(1, 2, 0) + r' + t' + vec(1, 0, 0) + r'$ entfernt?',
    [r'$2$', r'$\sqrt5$', r'$1$', r'$3$'],
    [r'$d(t)^2 = (1 + t)^2 + 4$ ist für $t = -1$ am kleinsten.',
     r'Lotfußpunkt $F(0 \mid 2 \mid 0)$, Abstand $2$.'])

Q.q(r'Welche Bedingung erfüllt der Lotfußpunkt $F$ von $P$ auf einer Geraden mit dem Richtungsvektor $\vec u$?',
    [r'$\vec{PF} \cdot \vec u = 0$', r'$\vec{PF} \times \vec u = \vec 0$', r'$\vec{PF} = \vec u$', r'$|\vec{PF}| = |\vec u|$'],
    [r'Die kürzeste Verbindung von $P$ zur Geraden steht senkrecht auf ihr.',
     r'Das liefert eine Gleichung für den Parameter von $F$.'])

Q.q(r'Wie weit ist $P(1 \mid 2 \mid 3)$ von der Geraden $\vec x = t \cdot ' + vec(1, 1, 1) + r'$ entfernt?',
    [r'$\sqrt2$', r'$\sqrt{14}$', r'$2\sqrt3$', r'$1$'],
    [r'$(t - 1;\ t - 2;\ t - 3) \cdot (1;\ 1;\ 1) = 3t - 6 = 0$, $t = 2$, $F(2 \mid 2 \mid 2)$.',
     r'$|\vec{PF}| = |(1;\ 0;\ -1)| = \sqrt2$.'])

Q.q(r'Wie weit ist $P(3 \mid 0 \mid 0)$ von der $y$-Achse entfernt?',
    [r'$3$', r'$0$', r'$\sqrt3$', r'$9$'],
    [r'Lotfußpunkt ist der Ursprung.',
     r'Abstand $3$.'])

Q.q(r'Welche Punkte der Parabel $y = x^2$ liegen dem Punkt $(0 \mid 2)$ am nächsten?',
    [r'$(\pm\sqrt{1{,}5} \mid 1{,}5)$', r'$(0 \mid 0)$', r'$(\pm 1 \mid 1)$', r'$(\pm\sqrt2 \mid 2)$'],
    [r'$d(x)^2 = x^2 + (x^2 - 2)^2 = x^4 - 3x^2 + 4$, Ableitung $4x^3 - 6x = 0$.',
     r'$x^2 = 1{,}5$, $d^2 = 1{,}75$, $d \approx 1{,}32$. Der Scheitel $(0 \mid 0)$ hat den Abstand $2$, er ist weiter weg.'])

Q.q(r'Wie weit ist der Ursprung von der Geraden $y = 2x + 1$ in der Ebene entfernt?',
    [r'$\tfrac{1}{\sqrt5} \approx 0{,}45$', r'$1$', r'$0{,}5$', r'$\tfrac{2}{\sqrt5} \approx 0{,}89$'],
    [r'$d(x)^2 = x^2 + (2x + 1)^2 = 5x^2 + 4x + 1$, Scheitel bei $x = -0{,}4$.',
     r'Lotfußpunkt $(-0{,}4 \mid 0{,}2)$, $d^2 = 0{,}2$, $d = \tfrac{1}{\sqrt5}$.'])

Q.q(r'Welcher Punkt des Graphen von $f(x) = \sqrt x$ liegt $(2{,}5 \mid 0)$ am nächsten?',
    [r'$(2 \mid \sqrt2)$, Abstand $1{,}5$', r'$(2{,}5 \mid \sqrt{2{,}5})$, Abstand $\approx 1{,}58$', r'$(0 \mid 0)$, Abstand $2{,}5$', r'$(1 \mid 1)$, Abstand $\approx 1{,}80$'],
    [r'$d(x)^2 = (x - 2{,}5)^2 + x = x^2 - 4x + 6{,}25$, Scheitel bei $x = 2$.',
     r'$d^2 = 4 - 8 + 6{,}25 = 2{,}25$, also $d = 1{,}5$. Der Punkt senkrecht darüber ist nicht der nächste.'])

Q.q(r'Zwei Punkte bewegen sich: $A_t(t \mid 0 \mid 0)$ und $B_t(0 \mid 6 - t \mid 0)$. Wie nah kommen sie sich?',
    [r'$3\sqrt2 \approx 4{,}24$', r'$0$', r'$6$', r'$3$'],
    [r'$d(t)^2 = t^2 + (6 - t)^2$, Scheitel bei $t = 3$.',
     r'$d(3) = \sqrt{18} = 3\sqrt2$.'])

Q.q(r'Ein Schiff startet in $(0 \mid 0)$ und fährt je Stunde um $' + vec(3, 4) + r'$ km. Ein Leuchtturm steht bei $L(10 \mid 0)$. Wie nah kommt das Schiff ihm?',
    [r'$8$ km', r'$6$ km', r'$10$ km', r'$4{,}8$ km'],
    [r'$t = \dfrac{\vec{OL} \cdot \vec v}{\vec v \cdot \vec v} = \dfrac{30}{25} = 1{,}2$: Position $(3{,}6 \mid 4{,}8)$.',
     r'Abstand $\sqrt{6{,}4^2 + 4{,}8^2} = \sqrt{64} = 8$ km.'])

Q.q(r'Wann ist das Schiff aus Aufgabe 10 dem Leuchtturm am nächsten?',
    [r'nach $72$ min', r'nach $1{,}2$ min', r'nach $2$ h', r'nach $60$ min'],
    [r'$t = 1{,}2$ h.',
     r'$1{,}2 \cdot 60 = 72$ min.'])

Q.q(r'Warum darf man statt $d(t)$ auch $d(t)^2$ minimieren?',
    [r'Die Wurzel ist streng monoton steigend, beide haben dieselbe Minimalstelle.', r'Weil $d(t)^2 = d(t)$ ist.', r'Weil $d(t)^2$ immer kleiner ist.', r'Weil man nur Quadrate ableiten kann.'],
    [r'Ist $d(t_0)^2$ der kleinste Wert, so ist auch $d(t_0) = \sqrt{d(t_0)^2}$ der kleinste.',
     r'$d^2$ ist ohne Wurzel leichter abzuleiten.'])

Q.q(r'Wie weit ist $P(1 \mid 2 \mid 0)$ von der Geraden $\vec x = ' + vec(1, 0, 0) + r' + t' + vec(0, 1, 1) + r'$ entfernt?',
    [r'$\sqrt2$', r'$2$', r'$1$', r'$\sqrt5$'],
    [r'$\vec{PF} = (0;\ t - 2;\ t)$, $\cdot\ (0;\ 1;\ 1) = 2t - 2 = 0$, $t = 1$.',
     r'$F(1 \mid 1 \mid 1)$, $|\vec{PF}| = |(0;\ -1;\ 1)| = \sqrt2$.'])

Q.q(r'Wie weit ist $P(2 \mid 3 \mid 1)$ von der $x$-Achse entfernt?',
    [r'$\sqrt{10} \approx 3{,}16$', r'$2$', r'$\sqrt{14} \approx 3{,}74$', r'$4$'],
    [r'Lotfußpunkt $(2 \mid 0 \mid 0)$.',
     r'$\sqrt{3^2 + 1^2} = \sqrt{10}$.'])

Q.q(r'Welcher Punkt der Hyperbel $y = \tfrac1x$ mit $x > 0$ liegt dem Ursprung am nächsten?',
    [r'$(1 \mid 1)$, Abstand $\sqrt2$', r'$(2 \mid 0{,}5)$, Abstand $\approx 2{,}06$', r'$(0{,}5 \mid 2)$, Abstand $\approx 2{,}06$', r'Es gibt keinen nächsten Punkt.'],
    [r'$d(x)^2 = x^2 + \tfrac{1}{x^2}$, Ableitung $2x - \tfrac{2}{x^3} = 0$.',
     r'$x^4 = 1$, $x = 1$: $d^2 = 2$.'])

Q.q(r'Zwei Flugzeuge fliegen auf $A_t(-10 + 2t \mid 0 \mid 8)$ und $B_t(0 \mid -10 + 2t \mid 9)$ ($t$ in min, km). Wie nah kommen sie sich?',
    [r'$1$ km', r'$0$ km', r'$\sqrt2$ km', r'$10$ km'],
    [r'$d(t)^2 = 2(2t - 10)^2 + 1$, am kleinsten bei $t = 5$.',
     r'$d = 1$ km: Beide sind dann über dem Ursprung, nur durch die Höhen getrennt.'])

Q.q(r'Für eine Abstandsfunktion gilt $d(t)^2 = 2t^2 - 8t + 11$. Wie groß ist der kleinste Abstand?',
    [r'$\sqrt3$', r'$\sqrt{11}$', r'$3$', r'$2$'],
    [r'Scheitel bei $t = \tfrac{8}{4} = 2$.',
     r'$d(2)^2 = 8 - 16 + 11 = 3$, $d = \sqrt3$.'])

Q.q(r'Wie weit ist $P(4 \mid 0 \mid 0)$ von der Geraden durch $O$ mit dem Richtungsvektor $' + vec(1, 1, 0) + r'$ entfernt?',
    [r'$2\sqrt2 \approx 2{,}83$', r'$4$', r'$2$', r'$\sqrt{8} \cdot 2$'],
    [r'$t = \dfrac{(4;\ 0;\ 0) \cdot (1;\ 1;\ 0)}{2} = 2$, $F(2 \mid 2 \mid 0)$.',
     r'$|\vec{PF}| = |(-2;\ 2;\ 0)| = 2\sqrt2$.'])

Q.q(r'Welcher Punkt des Kreises $x^2 + y^2 = 25$ liegt dem Punkt $(6 \mid 8)$ am nächsten?',
    [r'$(3 \mid 4)$, Abstand $5$', r'$(5 \mid 0)$, Abstand $\approx 8{,}06$', r'$(0 \mid 5)$, Abstand $\approx 6{,}71$', r'$(4 \mid 3)$, Abstand $\approx 5{,}39$'],
    [r'Der nächste Punkt liegt auf der Strecke vom Mittelpunkt zu $(6 \mid 8)$.',
     r'$(6 \mid 8)$ hat vom Ursprung den Abstand $10$; bei Radius $5$ ist das die Hälfte: $(3 \mid 4)$, Abstand $5$.'])

Q.q(r'Wie weit sind die parallelen Geraden $g\colon \vec x = t' + vec(1, 0, 0) + r'$ und $h\colon \vec x = ' + vec(0, 3, 4) + r' + s' + vec(1, 0, 0) + r'$ voneinander entfernt?',
    [r'$5$', r'$7$', r'$3$', r'$0$'],
    [r'Abstand eines Punktes von $h$, z. B. $(0 \mid 3 \mid 4)$, zu $g$: Lotfußpunkt ist der Ursprung.',
     r'$|(0;\ 3;\ 4)| = 5$.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    t = sp.symbols('t', real=True)
    def mind(expr):
        crit = [c for c in sp.solve(sp.diff(expr, t), t) if c.is_real]
        return min(sp.nsimplify(expr.subs(t, c)) for c in crit)
    assert mind(t**2 + (2 - t)**2) == 2 and mind((1 + t)**2 + 4) == 4
    def dline(P, A, u):
        P, A, u = a(*P), a(*A), a(*u)
        s = (P - A) @ u / (u @ u)
        return np.linalg.norm(A + s * u - P)
    assert abs(dline((1, 2, 3), (0, 0, 0), (1, 1, 1)) - math.sqrt(2)) < 1e-12 and dline((3, 0, 0), (0, 0, 0), (0, 1, 0)) == 3
    x = t
    assert mind(x**2 + (x**2 - 2)**2) == sp.Rational(7, 4) and abs(math.sqrt(1.75) - 1.32) < 0.005
    assert sp.nsimplify(mind(x**2 + (2 * x + 1)**2)) == sp.Rational(1, 5)
    assert mind((x - sp.Rational(5, 2))**2 + x) == sp.Rational(9, 4)
    assert abs(math.sqrt((1 - 2.5)**2 + 1) - 1.80) < 0.005 and abs(math.sqrt(2.5) - 1.58) < 0.005
    assert mind(t**2 + (6 - t)**2) == 18
    v, L = a(3, 4), a(10, 0)
    s = L @ v / (v @ v)
    assert s == 1.2 and np.linalg.norm(s * v - L) == 8
    assert abs(dline((1, 2, 0), (1, 0, 0), (0, 1, 1)) - math.sqrt(2)) < 1e-12 and abs(dline((2, 3, 1), (0, 0, 0), (1, 0, 0)) - math.sqrt(10)) < 1e-12
    xp = sp.symbols('xp', positive=True)
    e = xp**2 + 1 / xp**2
    assert sp.solve(sp.diff(e, xp), xp) == [1] and e.subs(xp, 1) == 2 and abs(math.sqrt(4.25) - 2.06) < 0.005
    assert mind(2 * (2 * t - 10)**2 + 1) == 1 and mind(2 * t**2 - 8 * t + 11) == 3
    assert abs(dline((4, 0, 0), (0, 0, 0), (1, 1, 0)) - 2 * math.sqrt(2)) < 1e-12
    assert np.linalg.norm(a(6, 8) - a(3, 4)) == 5 and abs(np.linalg.norm(a(6, 8) - a(5, 0)) - 8.06) < 0.005
    assert abs(np.linalg.norm(a(6, 8) - a(0, 5)) - 6.71) < 0.005 and abs(np.linalg.norm(a(6, 8) - a(4, 3)) - 5.39) < 0.005
    assert dline((0, 3, 4), (0, 0, 0), (1, 0, 0)) == 5


Q.verify(check)
Q.save()
