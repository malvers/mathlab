#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 18 (LB 7): Schnittwinkel zwischen zwei
Geraden und zwischen Gerade und Ebene. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=18, slug='schnittwinkel', thema='Schnittwinkel von Geraden und Ebenen', lb='LB 7',
         blurb='Winkel zwischen zwei Geraden und zwischen Gerade und Ebene',
         comment='Blocks: Gerade und Gerade (1-6, 13, 17), Gerade und Ebene (7-12, 14-16), Anwendungen (18-20). Taschenrechner erlaubt.')

Q.q(r'Unter welchem Winkel schneiden sich zwei Geraden mit den Richtungsvektoren $' + vec(1, 0, 0) + r'$ und $' + vec(1, 1, 0) + r'$?',
    [r'$45^\circ$', r'$90^\circ$', r'$60^\circ$', r'$135^\circ$'],
    [r'$\cos\varphi = \dfrac{|1|}{1 \cdot \sqrt2}$.',
     r'$\varphi = 45^\circ$.'])

Q.q(r'Unter welchem Winkel schneiden sich zwei Geraden mit den Richtungsvektoren $' + vec(1, 2, 2) + r'$ und $' + vec(2, 1, -2) + r'$?',
    [r'$90^\circ$', r'$45^\circ$', r'$0^\circ$', r'$\approx 63{,}6^\circ$'],
    [r'Skalarprodukt $2 + 2 - 4 = 0$.',
     r'Die Geraden schneiden sich senkrecht.'])

Q.q(r'Mit welcher Formel berechnet man den Schnittwinkel zweier Geraden mit den Richtungsvektoren $\vec u$ und $\vec v$?',
    [r'$\cos\varphi = \dfrac{|\vec u \cdot \vec v|}{|\vec u| \cdot |\vec v|}$', r'$\sin\varphi = \dfrac{|\vec u \cdot \vec v|}{|\vec u| \cdot |\vec v|}$', r'$\cos\varphi = |\vec u| \cdot |\vec v|$', r'$\cos\varphi = \vec u \times \vec v$'],
    [r'Der Winkel zwischen den Geraden ist der Winkel zwischen ihren Richtungsvektoren.',
     r'Der Betrag im Zähler sorgt für den spitzen Winkel.'])

Q.q(r'Warum steht in der Formel für den Schnittwinkel zweier Geraden der Betrag $|\vec u \cdot \vec v|$?',
    [r'Der Schnittwinkel zweier Geraden liegt zwischen $0^\circ$ und $90^\circ$.', r'Damit das Ergebnis eine ganze Zahl wird.', r'Weil Skalarprodukte nie negativ sind.', r'Damit man den Taschenrechner nicht braucht.'],
    [r'Ein negatives Skalarprodukt liefert einen stumpfen Winkel zwischen den Vektoren.',
     r'Zwei Geraden bilden aber immer zwei Winkel, die sich zu $180^\circ$ ergänzen; man nimmt den spitzen.'])

Q.q(r'Unter welchem Winkel schneiden sich zwei Geraden mit den Richtungsvektoren $' + vec(1, 2, 2) + r'$ und $' + vec(0, 0, 1) + r'$?',
    [r'$\approx 48{,}2^\circ$', r'$\approx 41{,}8^\circ$', r'$\approx 70{,}5^\circ$', r'$\approx 131{,}8^\circ$'],
    [r'$\cos\varphi = \dfrac{2}{3 \cdot 1}$.',
     r'$\varphi \approx 48{,}2^\circ$. Mit dem Sinus kämen fälschlich $41{,}8^\circ$ heraus.'])

Q.q(r'Die Richtungsvektoren zweier sich schneidender Geraden schließen $135^\circ$ ein. Welchen Schnittwinkel haben die Geraden?',
    [r'$45^\circ$', r'$135^\circ$', r'$90^\circ$', r'$67{,}5^\circ$'],
    [r'Der Schnittwinkel ist der spitze Winkel.',
     r'$180^\circ - 135^\circ = 45^\circ$.'])

Q.q(r'Mit welcher Formel berechnet man den Winkel zwischen einer Geraden mit Richtungsvektor $\vec u$ und einer Ebene mit Normalenvektor $\vec n$?',
    [r'$\sin\varphi = \dfrac{|\vec u \cdot \vec n|}{|\vec u| \cdot |\vec n|}$', r'$\cos\varphi = \dfrac{|\vec u \cdot \vec n|}{|\vec u| \cdot |\vec n|}$', r'$\tan\varphi = \vec u \cdot \vec n$', r'$\sin\varphi = |\vec u| \cdot |\vec n|$'],
    [r'Der Kosinusansatz liefert den Winkel zwischen $\vec u$ und dem Normalenvektor.',
     r'Der gesuchte Winkel zur Ebene ergänzt ihn zu $90^\circ$; daraus wird der Sinus.'])

Q.q(r'Der Richtungsvektor einer Geraden schließt mit dem Normalenvektor einer Ebene $30^\circ$ ein. Welchen Winkel bildet die Gerade mit der Ebene?',
    [r'$60^\circ$', r'$30^\circ$', r'$120^\circ$', r'$90^\circ$'],
    [r'Gerade und Normale ergänzen sich zum rechten Winkel.',
     r'$90^\circ - 30^\circ = 60^\circ$.'])

Q.q(r'Welchen Winkel bildet die $z$-Achse mit der Ebene $z = 0$?',
    [r'$90^\circ$', r'$0^\circ$', r'$45^\circ$', r'$180^\circ$'],
    [r'Richtungsvektor $(0;\ 0;\ 1)$ und Normalenvektor $(0;\ 0;\ 1)$ sind gleich.',
     r'$\sin\varphi = 1$, die Achse steht senkrecht auf der Ebene.'])

Q.q(r'Welchen Winkel bildet eine Gerade mit dem Richtungsvektor $' + vec(1, 1, 0) + r'$ mit der Ebene $z = 0$?',
    [r'$0^\circ$', r'$45^\circ$', r'$90^\circ$', r'$\approx 35{,}3^\circ$'],
    [r'$(1;\ 1;\ 0) \cdot (0;\ 0;\ 1) = 0$, also $\sin\varphi = 0$.',
     r'Die Gerade verläuft parallel zur Ebene oder liegt in ihr.'])

Q.q(r'Welchen Winkel bildet eine Gerade mit dem Richtungsvektor $' + vec(1, 0, 1) + r'$ mit der Ebene $z = 0$?',
    [r'$45^\circ$', r'$90^\circ$', r'$0^\circ$', r'$60^\circ$'],
    [r'$\sin\varphi = \dfrac{1}{\sqrt2 \cdot 1}$.',
     r'$\varphi = 45^\circ$.'])

Q.q(r'Welchen Winkel bildet eine Gerade mit dem Richtungsvektor $' + vec(1, 2, 2) + r'$ mit der Ebene $E\colon 2x - y + 2z = 3$?',
    [r'$\approx 26{,}4^\circ$', r'$\approx 63{,}6^\circ$', r'$90^\circ$', r'$0^\circ$'],
    [r'$\vec u \cdot \vec n = 2 - 2 + 4 = 4$, $|\vec u| = |\vec n| = 3$.',
     r'$\sin\varphi = \tfrac49$, $\varphi \approx 26{,}4^\circ$. $63{,}6^\circ$ ist der Winkel zur Normalen.'])

Q.q(r'Welchen Winkel bildet eine Gerade mit dem Richtungsvektor $' + vec(2, 1, 2) + r'$ mit der $y$-Achse?',
    [r'$\approx 70{,}5^\circ$', r'$\approx 48{,}2^\circ$', r'$\approx 19{,}5^\circ$', r'$90^\circ$'],
    [r'Richtungsvektor der $y$-Achse: $(0;\ 1;\ 0)$.',
     r'$\cos\varphi = \tfrac13$, $\varphi \approx 70{,}5^\circ$.'])

Q.q(r'Eine Gerade hat den Richtungsvektor $' + vec(3, 4, 5) + r'$. Wie groß ist ihr Steigungswinkel gegenüber der $x$-$y$-Ebene?',
    [r'$45^\circ$', r'$\approx 53{,}1^\circ$', r'$\approx 36{,}9^\circ$', r'$60^\circ$'],
    [r'$|\vec u| = \sqrt{9 + 16 + 25} = \sqrt{50} = 5\sqrt2$.',
     r'$\sin\varphi = \tfrac{5}{5\sqrt2}$, $\varphi = 45^\circ$. Waagerecht legt sie $5$ zurück, senkrecht ebenfalls $5$.'])

Q.q(r'Eine Gerade hat den Richtungsvektor $' + vec(1, 1, 1) + r'$, die Ebene ist $x + y + z = 1$. Wie liegen sie zueinander?',
    [r'Die Gerade steht senkrecht auf der Ebene.', r'Die Gerade liegt in der Ebene.', r'Die Gerade ist parallel zur Ebene.', r'Sie schneiden sich unter $45^\circ$.'],
    [r'Der Richtungsvektor ist gleich dem Normalenvektor.',
     r'Also $\sin\varphi = 1$ und $\varphi = 90^\circ$.'])

Q.q(r'Für den Richtungsvektor $\vec u$ einer Geraden $g$ und den Normalenvektor $\vec n$ der Ebene $E$ gilt $\vec u \cdot \vec n = 0$. Was folgt?',
    [r'$g$ ist parallel zu $E$ oder liegt in $E$.', r'$g$ steht senkrecht auf $E$.', r'$g$ schneidet $E$ unter $45^\circ$.', r'$g$ ist windschief zu $E$.'],
    [r'$\vec u$ steht senkrecht auf dem Normalenvektor, verläuft also in Richtung der Ebene.',
     r'Eine Punktprobe mit dem Stützpunkt entscheidet, ob $g$ in $E$ liegt.'])

Q.q(r'Die Geraden $g\colon \vec x = ' + vec(1, 0, 0) + r' + t' + vec(1, 1, 0) + r'$ und $h\colon \vec x = ' + vec(0, 1, 0) + r' + s' + vec(1, -1, 0) + r'$ schneiden sich. Wo und unter welchem Winkel?',
    [r'in $(1 \mid 0 \mid 0)$ unter $90^\circ$', r'in $(0 \mid 1 \mid 0)$ unter $90^\circ$', r'in $(1 \mid 0 \mid 0)$ unter $45^\circ$', r'Sie sind windschief.'],
    [r'$1 + t = s$ und $t = 1 - s$ ergibt $t = 0$, $s = 1$: Schnittpunkt $(1 \mid 0 \mid 0)$.',
     r'$(1;\ 1;\ 0) \cdot (1;\ -1;\ 0) = 0$: Sie schneiden sich senkrecht.'])

Q.q(r'Eine Rampe steigt auf $10$ m waagerechter Strecke um $1$ m an, Richtungsvektor $' + vec(10, 0, 1) + r'$. Welchen Winkel bildet sie mit dem Boden $z = 0$?',
    [r'$\approx 5{,}7^\circ$', r'$\approx 84{,}3^\circ$', r'$10^\circ$', r'$\approx 0{,}1^\circ$'],
    [r'$\sin\varphi = \dfrac{1}{\sqrt{101}}$.',
     r'$\varphi \approx 5{,}7^\circ$, also $10\,\%$ Steigung.'])

Q.q(r'Eine Pyramide hat die quadratische Grundfläche mit den Ecken $(\pm 1 \mid \pm 1 \mid 0)$ und die Spitze $S(0 \mid 0 \mid 2)$. Welchen Winkel bildet eine Seitenkante mit der Grundfläche?',
    [r'$\approx 54{,}7^\circ$', r'$\approx 63{,}4^\circ$', r'$45^\circ$', r'$\approx 35{,}3^\circ$'],
    [r'Kante von $(1 \mid 1 \mid 0)$ nach $S$: $\vec u = (-1;\ -1;\ 2)$, $|\vec u| = \sqrt6$.',
     r'$\sin\varphi = \tfrac{2}{\sqrt6}$, $\varphi \approx 54{,}7^\circ$. $63{,}4^\circ$ ist der Winkel der Seitenfläche.'])

Q.q(r'Die Gerade durch $A(1 \mid 2 \mid 3)$ und $B(3 \mid 2 \mid 5)$: Welchen Winkel bildet sie mit der Ebene $x = 0$?',
    [r'$45^\circ$', r'$90^\circ$', r'$0^\circ$', r'$60^\circ$'],
    [r'$\vec{AB} = (2;\ 0;\ 2)$, Normalenvektor $(1;\ 0;\ 0)$.',
     r'$\sin\varphi = \tfrac{2}{2\sqrt2} = \tfrac{1}{\sqrt2}$, $\varphi = 45^\circ$.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    cosw = lambda u, v: math.degrees(math.acos(abs(u @ v) / np.linalg.norm(u) / np.linalg.norm(v)))
    sinw = lambda u, n: math.degrees(math.asin(min(1.0, abs(u @ n) / np.linalg.norm(u) / np.linalg.norm(n))))
    assert abs(cosw(a(1, 0, 0), a(1, 1, 0)) - 45) < 1e-9 and a(1, 2, 2) @ a(2, 1, -2) == 0
    assert abs(cosw(a(1, 2, 2), a(0, 0, 1)) - 48.2) < 0.05 and abs(90 - 48.19 - 41.8) < 0.05
    z = a(0, 0, 1)
    assert abs(sinw(z, z) - 90) < 1e-9 and sinw(a(1, 1, 0), z) == 0 and abs(sinw(a(1, 0, 1), z) - 45) < 1e-9
    assert abs(sinw(a(1, 2, 2), a(2, -1, 2)) - 26.4) < 0.05 and abs(cosw(a(1, 2, 2), a(2, -1, 2)) - 63.6) < 0.05
    assert abs(cosw(a(2, 1, 2), a(0, 1, 0)) - 70.5) < 0.05 and abs(sinw(a(3, 4, 5), z) - 45) < 1e-9
    assert abs(sinw(a(1, 1, 1), a(1, 1, 1)) - 90) < 1e-6
    t, s = 0, 1
    assert (a(1, 0, 0) + t * a(1, 1, 0) == a(0, 1, 0) + s * a(1, -1, 0)).all() and a(1, 1, 0) @ a(1, -1, 0) == 0
    assert abs(sinw(a(10, 0, 1), z) - 5.7) < 0.05
    assert abs(sinw(a(-1, -1, 2), z) - 54.7) < 0.05 and abs(math.degrees(math.atan(2)) - 63.4) < 0.05
    assert abs(sinw(a(2, 0, 2), a(1, 0, 0)) - 45) < 1e-9


Q.verify(check)
Q.save()
