#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 19 (LB 7): Schnittwinkel zweier Ebenen,
Schnittgerade, Dach- und Hangneigungen. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=19, slug='ebenenwinkel', thema='Winkel zwischen zwei Ebenen', lb='LB 7',
         blurb='Schnittwinkel zweier Ebenen, Schnittgerade, Dach- und Hangneigung',
         comment='Blocks: Formel und Begriff (1, 8, 9, 20), Winkel berechnen (2-4, 7, 10, 11, 17), Schnittgerade (12-14, 18), Parameter (15), Anwendungen (5, 6, 16, 19). Taschenrechner erlaubt.')

Q.q(r'Mit welcher Formel berechnet man den Schnittwinkel zweier Ebenen mit den Normalenvektoren $\vec n_1$ und $\vec n_2$?',
    [r'$\cos\varphi = \dfrac{|\vec n_1 \cdot \vec n_2|}{|\vec n_1| \cdot |\vec n_2|}$', r'$\sin\varphi = \dfrac{|\vec n_1 \cdot \vec n_2|}{|\vec n_1| \cdot |\vec n_2|}$', r'$\cos\varphi = \vec n_1 \times \vec n_2$', r'$\tan\varphi = \dfrac{|\vec n_1|}{|\vec n_2|}$'],
    [r'Die Ebenen schließen denselben Winkel ein wie ihre Normalenvektoren.',
     r'Also der Kosinusansatz, mit Betrag für den spitzen Winkel.'])

Q.q(r'Welchen Winkel schließen die Ebenen $z = 0$ und $x = 0$ ein?',
    [r'$90^\circ$', r'$0^\circ$', r'$45^\circ$', r'$60^\circ$'],
    [r'$(0;\ 0;\ 1) \cdot (1;\ 0;\ 0) = 0$.',
     r'Boden und Wand stehen senkrecht aufeinander.'])

Q.q(r'Welchen Winkel schließen die Ebenen $z = 0$ und $x + z = 1$ ein?',
    [r'$45^\circ$', r'$90^\circ$', r'$60^\circ$', r'$30^\circ$'],
    [r'$\vec n_1 = (0;\ 0;\ 1)$, $\vec n_2 = (1;\ 0;\ 1)$.',
     r'$\cos\varphi = \tfrac{1}{\sqrt2}$, $\varphi = 45^\circ$.'])

Q.q(r'Welchen Winkel schließen $E_1\colon 2x + y + 2z = 3$ und $E_2\colon 2x - y + 2z = 1$ ein?',
    [r'$\approx 38{,}9^\circ$', r'$\approx 51{,}1^\circ$', r'$90^\circ$', r'$0^\circ$'],
    [r'$\vec n_1 \cdot \vec n_2 = 4 - 1 + 4 = 7$, beide Beträge $3$.',
     r'$\cos\varphi = \tfrac79$, $\varphi \approx 38{,}9^\circ$.'])

Q.q(r'Eine Dachfläche geht durch $(0 \mid 0 \mid 3)$, $(10 \mid 0 \mid 3)$ und $(0 \mid 4 \mid 6)$. Wie groß ist ihre Neigung gegenüber dem Boden $z = 0$?',
    [r'$\approx 36{,}9^\circ$', r'$\approx 53{,}1^\circ$', r'$45^\circ$', r'$\approx 41{,}4^\circ$'],
    [r'Spannvektoren $(10;\ 0;\ 0)$ und $(0;\ 4;\ 3)$, Normalenvektor $(0;\ -3;\ 4)$.',
     r'$\cos\varphi = \tfrac45$, $\varphi \approx 36{,}9^\circ$. Kontrolle: $3$ m Anstieg auf $4$ m.'])

Q.q(r'Ein Hang liegt in der Ebene $x + y + z = 10$, die $z$-Achse zeigt nach oben. Wie steil ist er?',
    [r'$\approx 54{,}7^\circ$', r'$\approx 35{,}3^\circ$', r'$45^\circ$', r'$60^\circ$'],
    [r'Winkel zwischen $(1;\ 1;\ 1)$ und $(0;\ 0;\ 1)$: $\cos\varphi = \tfrac{1}{\sqrt3}$.',
     r'$\varphi \approx 54{,}7^\circ$.'])

Q.q(r'Welchen Winkel schließen die Ebenen $x + y = 2$ und $y = 0$ ein?',
    [r'$45^\circ$', r'$90^\circ$', r'$0^\circ$', r'$\approx 35{,}3^\circ$'],
    [r'$(1;\ 1;\ 0) \cdot (0;\ 1;\ 0) = 1$, Beträge $\sqrt2$ und $1$.',
     r'$\cos\varphi = \tfrac{1}{\sqrt2}$, $\varphi = 45^\circ$.'])

Q.q(r'Warum nimmt man den Betrag $|\vec n_1 \cdot \vec n_2|$?',
    [r'Ein Normalenvektor kann in beide Richtungen zeigen; der Ebenenwinkel ist höchstens $90^\circ$.', r'Damit der Winkel stumpf wird.', r'Weil Normalenvektoren immer die Länge $1$ haben.', r'Weil das Kreuzprodukt negativ ist.'],
    [r'Mit $-\vec n_2$ statt $\vec n_2$ würde der Kosinus sein Vorzeichen wechseln.',
     r'Der Betrag macht das Ergebnis unabhängig von dieser Wahl.'])

Q.q(r'Die Normalenvektoren zweier Ebenen schließen $120^\circ$ ein. Welchen Winkel haben die Ebenen?',
    [r'$60^\circ$', r'$120^\circ$', r'$30^\circ$', r'$90^\circ$'],
    [r'Der Ebenenwinkel ist der spitze Winkel.',
     r'$180^\circ - 120^\circ = 60^\circ$.'])

Q.q(r'Welchen Winkel bildet die Ebene $x + 2y + 2z = 5$ mit der $x$-$y$-Ebene?',
    [r'$\approx 48{,}2^\circ$', r'$\approx 41{,}8^\circ$', r'$\approx 70{,}5^\circ$', r'$\approx 33{,}7^\circ$'],
    [r'$\cos\varphi = \dfrac{|(1;\ 2;\ 2) \cdot (0;\ 0;\ 1)|}{3 \cdot 1} = \tfrac23$.',
     r'$\varphi \approx 48{,}2^\circ$.'])

Q.q(r'Welchen Winkel schließen die Ebenen $3x + 4z = 0$ und $x = 0$ ein?',
    [r'$\approx 53{,}1^\circ$', r'$\approx 36{,}9^\circ$', r'$90^\circ$', r'$45^\circ$'],
    [r'$\vec n_1 = (3;\ 0;\ 4)$ mit Betrag $5$, $\vec n_2 = (1;\ 0;\ 0)$.',
     r'$\cos\varphi = \tfrac35$, $\varphi \approx 53{,}1^\circ$.'])

Q.q(r'Was ist die Schnittgerade der Ebenen $z = 0$ und $x = 0$?',
    [r'die $y$-Achse', r'die $x$-Achse', r'die $z$-Achse', r'Es gibt keine, die Ebenen sind parallel.'],
    [r'Punkte mit $x = 0$ und $z = 0$ haben die Form $(0 \mid y \mid 0)$.',
     r'Das ist die $y$-Achse.'])

Q.q(r'Welche Gerade ist die Schnittgerade von $x + y + z = 2$ und $x - y = 0$?',
    [r'$\vec x = ' + vec(0, 0, 2) + r' + t' + vec(1, 1, -2) + r'$', r'$\vec x = ' + vec(0, 0, 2) + r' + t' + vec(1, -1, 0) + r'$', r'$\vec x = ' + vec(1, 1, 0) + r' + t' + vec(1, 1, 1) + r'$', r'$\vec x = t' + vec(1, 1, -2) + r'$'],
    [r'$x = y = t$ setzen, dann $z = 2 - 2t$.',
     r'Probe: $t + t + 2 - 2t = 2$ ✔ und $t - t = 0$ ✔. Ohne Stützvektor läge der Ursprung auf der Geraden, er erfüllt aber $x + y + z = 2$ nicht.'])

Q.q(r'Wie erhält man einen Richtungsvektor der Schnittgeraden zweier Ebenen am schnellsten?',
    [r'$\vec n_1 \times \vec n_2$', r'$\vec n_1 + \vec n_2$', r'$\vec n_1 \cdot \vec n_2$', r'$\vec n_1 - \vec n_2$'],
    [r'Die Schnittgerade liegt in beiden Ebenen, ihr Richtungsvektor steht also senkrecht auf beiden Normalenvektoren.',
     r'Genau das leistet das Vektorprodukt. Beispiel 13: $(1;\ 1;\ 1) \times (1;\ -1;\ 0) = (1;\ 1;\ -2)$.'])

Q.q(r'Für welches $a$ stehen $x + y + az = 1$ und $x - y + z = 0$ senkrecht aufeinander?',
    [r'$a = 0$', r'$a = 1$', r'$a = -1$', r'$a = 2$'],
    [r'$(1;\ 1;\ a) \cdot (1;\ -1;\ 1) = 1 - 1 + a$.',
     r'$a = 0$.'])

Q.q(r'Eine Pyramide hat die quadratische Grundfläche mit den Ecken $(\pm 1 \mid \pm 1 \mid 0)$ und die Spitze $S(0 \mid 0 \mid 2)$. Welchen Winkel bildet eine Seitenfläche mit der Grundfläche?',
    [r'$\approx 63{,}4^\circ$', r'$\approx 54{,}7^\circ$', r'$45^\circ$', r'$\approx 26{,}6^\circ$'],
    [r'Seitenfläche durch $(1 \mid 1 \mid 0)$, $(1 \mid -1 \mid 0)$, $S$: Normalenvektor $(2;\ 0;\ 1)$.',
     r'$\cos\varphi = \tfrac{1}{\sqrt5}$, $\varphi \approx 63{,}4^\circ$. Kontrolle: $\tan\varphi = \tfrac21$.'])

Q.q(r'Welchen Winkel schließen die Ebenen $x = 0$ und $x + y + \sqrt2\,z = 0$ ein?',
    [r'$60^\circ$', r'$45^\circ$', r'$30^\circ$', r'$90^\circ$'],
    [r'$|(1;\ 1;\ \sqrt2)| = \sqrt{1 + 1 + 2} = 2$.',
     r'$\cos\varphi = \tfrac12$, $\varphi = 60^\circ$.'])

Q.q(r'Wie liegen $E_1\colon 2x - y + z = 1$ und $E_2\colon -4x + 2y - 2z = 5$ zueinander?',
    [r'echt parallel, ohne Schnittgerade', r'Sie schneiden sich senkrecht.', r'identisch', r'Sie schneiden sich unter $60^\circ$.'],
    [r'$\vec n_2 = -2\,\vec n_1$: parallele Normalenvektoren.',
     r'$E_1$ mal $-2$ ergibt rechts $-2 \neq 5$: echt parallel.'])

Q.q(r'Ein Satteldach hat zwei Dachflächen mit je $40^\circ$ Neigung. Welchen Winkel schließen die beiden Dachflächen am First ein?',
    [r'$100^\circ$', r'$80^\circ$', r'$140^\circ$', r'$40^\circ$'],
    [r'Im Querschnitt bilden die Dachflächen mit dem Boden ein Dreieck mit zwei Basiswinkeln von $40^\circ$.',
     r'Am First: $180^\circ - 2 \cdot 40^\circ = 100^\circ$. Der Schnittwinkel der Ebenen (spitz) wäre $80^\circ$.'])

Q.q(r'Wie misst man den Winkel zwischen zwei Ebenen an einem Modell?',
    [r'in einer Ebene, die senkrecht auf der Schnittgeraden steht', r'entlang der Schnittgeraden', r'zwischen zwei beliebigen Geraden der Ebenen', r'zwischen den Spurpunkten'],
    [r'Man schneidet beide Ebenen mit einer Ebene senkrecht zur Schnittgeraden.',
     r'Die beiden Schnittlinien schließen den Ebenenwinkel ein; er stimmt mit dem Winkel der Normalen überein.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    w = lambda u, v: math.degrees(math.acos(abs(u @ v) / np.linalg.norm(u) / np.linalg.norm(v)))
    z = a(0, 0, 1)
    assert abs(w(z, a(1, 0, 0)) - 90) < 1e-9 and abs(w(z, a(1, 0, 1)) - 45) < 1e-9
    assert abs(w(a(2, 1, 2), a(2, -1, 2)) - 38.9) < 0.05
    n = np.cross(a(10, 0, 0), a(0, 4, 3))
    assert (n / 10 == a(0, -3, 4)).all() and abs(w(n, z) - 36.9) < 0.05
    assert abs(w(a(1, 1, 1), z) - 54.7) < 0.05 and abs(w(a(1, 1, 0), a(0, 1, 0)) - 45) < 1e-9
    assert abs(w(a(1, 2, 2), z) - 48.2) < 0.05 and abs(w(a(3, 0, 4), a(1, 0, 0)) - 53.1) < 0.05
    d = np.cross(a(1, 1, 1), a(1, -1, 0))
    assert (d == a(1, 1, -2)).all()
    for t in (0, 1, -2.5):
        p = a(0, 0, 2) + t * d
        assert p.sum() == 2 and p[0] - p[1] == 0
    assert a(1, 1, 0) @ a(1, -1, 1) == 0
    n = np.cross(a(1, -1, 0) - a(1, 1, 0), a(0, 0, 2) - a(1, 1, 0))
    assert (n / -2 == a(2, 0, 1)).all() and abs(w(n, z) - 63.4) < 0.05
    assert abs(w(a(1, 0, 0), a(1, 1, math.sqrt(2))) - 60) < 1e-9
    assert (a(-4, 2, -2) == -2 * a(2, -1, 1)).all() and 180 - 2 * 40 == 100


Q.verify(check)
Q.save()
