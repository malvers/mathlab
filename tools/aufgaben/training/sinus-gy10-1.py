#!/usr/bin/env python3
"""Training sheet 1 of 2, Gymnasium class 10: sine function - the foundations.
Built for a pupil's error pattern (29.10.2026): the wrong options are exactly the typical slips -
pi/4 read as a quarter turn, an angle given as the sine value, the reciprocal in b = 2pi/p,
multiplying instead of dividing, "0 = ..." when a function value is asked for.
No plan row: the sheet stands on its own (back='')."""
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import Quiz  # noqa: E402

Q = Quiz(id='mathegy10-training-sinus-1',
         file='mathetestgy10-sinus-training-1.html',
         title='Aufgaben · Sinusfunktion: Grundlagen sichern',
         subtitle='Gymnasium · Klasse 10 · Training 1 von 2 · 20 Aufgaben: Einheitskreis und Bogenmaß, '
                  'Sinus und Kosinus beliebiger Winkel, b und p, Funktionswerte · genau eine Antwort pro Aufgabe',
         dash_sub='Gymnasium · Klasse 10 · Training Sinus 1 · Live-Auswertung: anonyme Einzelscores + '
                  'Gruppenleistung pro Aufgabe',
         back='',
         comment='Blocks: unit circle and radians (1-6), sin/cos of any angle (7-11), b and p (12-16), '
                 'function values (17-20).')

# ------------------------------------------------- unit circle and radians ----
Q.q(r'In welchem Quadranten liegt der Winkel $\dfrac{5\pi}{4}$?',
    [r'im 3. Quadranten', r'im 1. Quadranten', r'im 2. Quadranten', r'im 4. Quadranten'],
    [r'$\pi$ ist eine halbe Runde ($180^\circ$), also $\pi = \dfrac{4\pi}{4}$.',
     r'$\dfrac{4\pi}{4} < \dfrac{5\pi}{4} < \dfrac{6\pi}{4} = \dfrac{3\pi}{2}$: Der Winkel liegt zwischen $180^\circ$ und $270^\circ$, also im 3. Quadranten.',
     r'Falle: $\dfrac{\pi}{4}$ ist ein Achtel der Runde ($45^\circ$), nicht ein Viertel.'])

Q.q(r'Wie viel Grad sind $\dfrac{3\pi}{4}$?',
    [r'$135^\circ$', r'$270^\circ$', r'$75^\circ$', r'$45^\circ$'],
    [r'$\pi = 180^\circ$, also $\dfrac{\pi}{4} = 45^\circ$.',
     r'$\dfrac{3\pi}{4} = 3 \cdot 45^\circ = 135^\circ$.',
     r'$270^\circ$ wären drei Viertel einer ganzen Runde, das ist $\dfrac{3\pi}{2}$.'])

Q.q(r'Welcher Winkel im Bogenmaß gehört zu $300^\circ$?',
    [r'$\dfrac{5\pi}{3}$', r'$\dfrac{3\pi}{5}$', r'$\dfrac{5\pi}{6}$', r'$\dfrac{10\pi}{3}$'],
    [r'Umrechnen: $\dfrac{300^\circ}{180^\circ} \cdot \pi$.',
     r'$\dfrac{300}{180} = \dfrac{5}{3}$, also $\dfrac{5\pi}{3}$.'])

Q.q(r'Was ist $\sin(\alpha)$ am Einheitskreis?',
    [r'die Höhe ($y$-Koordinate) des Punktes auf dem Kreis', r'die $x$-Koordinate des Punktes auf dem Kreis',
     r'der Winkel $\alpha$ im Bogenmaß', r'die Länge des Bogens bis zum Punkt'],
    [r'Zum Winkel $\alpha$ gehört ein Punkt auf dem Kreis mit Radius 1.',
     r'Seine $y$-Koordinate ist $\sin(\alpha)$, seine $x$-Koordinate ist $\cos(\alpha)$.',
     r'Darum liegt jeder Sinuswert zwischen $-1$ und $1$. Ein Ergebnis mit $\pi$ kann kein Sinuswert sein.'])

Q.q(r'Welcher Winkel zwischen $0$ und $2\pi$ gehört zum selben Punkt auf dem Einheitskreis wie $\dfrac{17\pi}{6}$?',
    [r'$\dfrac{5\pi}{6}$', r'$\dfrac{11\pi}{6}$', r'$\dfrac{\pi}{6}$', r'$\dfrac{7\pi}{6}$'],
    [r'Eine ganze Runde ist $2\pi = \dfrac{12\pi}{6}$.',
     r'$\dfrac{17\pi}{6} - \dfrac{12\pi}{6} = \dfrac{5\pi}{6}$.'])

Q.q(r'In welchem Quadranten liegt $\dfrac{11\pi}{4}$?',
    [r'im 2. Quadranten', r'im 3. Quadranten', r'im 1. Quadranten', r'im 4. Quadranten'],
    [r'Erst eine ganze Runde abziehen: $\dfrac{11\pi}{4} - \dfrac{8\pi}{4} = \dfrac{3\pi}{4}$.',
     r'$\dfrac{2\pi}{4} < \dfrac{3\pi}{4} < \dfrac{4\pi}{4}$, also zwischen $90^\circ$ und $180^\circ$: 2. Quadrant.'])

# ------------------------------------------------- sin / cos of any angle ----
Q.q(r'Bestimme $\sin\left(\dfrac{5\pi}{4}\right)$.',
    [r'$-\dfrac{\sqrt{2}}{2}$', r'$\dfrac{\sqrt{2}}{2}$', r'$-\dfrac{1}{2}$', r'$\dfrac{\pi}{4}$'],
    [r'Quadrant: $\pi < \dfrac{5\pi}{4} < \dfrac{3\pi}{2}$, also 3. Quadrant, dort ist der Sinus negativ.',
     r'Bezugswinkel: $\dfrac{5\pi}{4} - \pi = \dfrac{\pi}{4}$.',
     r'$\sin\left(\dfrac{5\pi}{4}\right) = -\sin\left(\dfrac{\pi}{4}\right) = -\dfrac{\sqrt{2}}{2}$.'])

Q.q(r'Bestimme $\cos\left(\dfrac{2\pi}{3}\right)$.',
    [r'$-\dfrac{1}{2}$', r'$\dfrac{1}{2}$', r'$-\dfrac{\sqrt{3}}{2}$', r'$\dfrac{\sqrt{3}}{2}$'],
    [r'Quadrant: $\dfrac{3\pi}{6} < \dfrac{4\pi}{6} < \dfrac{6\pi}{6}$, also 2. Quadrant, dort ist der Kosinus negativ.',
     r'Bezugswinkel: $\pi - \dfrac{2\pi}{3} = \dfrac{\pi}{3}$, und $\cos\left(\dfrac{\pi}{3}\right) = \dfrac{1}{2}$.',
     r'Also $\cos\left(\dfrac{2\pi}{3}\right) = -\dfrac{1}{2}$.'])

Q.q(r'Bestimme $\sin\left(\dfrac{13\pi}{6}\right)$.',
    [r'$\dfrac{1}{2}$', r'$-\dfrac{1}{2}$', r'$\dfrac{\pi}{6}$', r'$\dfrac{\sqrt{3}}{2}$'],
    [r'Eine ganze Runde abziehen: $\dfrac{13\pi}{6} - \dfrac{12\pi}{6} = \dfrac{\pi}{6}$.',
     r'$\sin\left(\dfrac{\pi}{6}\right) = \dfrac{1}{2}$. Gefragt ist der Wert, nicht der Winkel $\dfrac{\pi}{6}$.'])

Q.q(r'Bestimme $\cos\left(-\dfrac{\pi}{3}\right)$.',
    [r'$\dfrac{1}{2}$', r'$-\dfrac{1}{2}$', r'$\dfrac{\sqrt{3}}{2}$', r'$-\dfrac{\sqrt{3}}{2}$'],
    [r'Ein Minus beim Winkel heißt: im Uhrzeigersinn drehen. Der Punkt wird an der $x$-Achse gespiegelt.',
     r'Die $x$-Koordinate ändert sich dabei nicht: $\cos\left(-\dfrac{\pi}{3}\right) = \cos\left(\dfrac{\pi}{3}\right) = \dfrac{1}{2}$.'])

Q.q(r'Welche Aussage stimmt?',
    [r'$\sin\left(\dfrac{5\pi}{6}\right) > \cos\left(\dfrac{5\pi}{6}\right)$',
     r'$\sin\left(\dfrac{5\pi}{6}\right) = \cos\left(\dfrac{5\pi}{6}\right)$',
     r'$\sin\left(\dfrac{5\pi}{6}\right) < \cos\left(\dfrac{5\pi}{6}\right)$',
     r'$\sin\left(\dfrac{5\pi}{6}\right)$ und $\cos\left(\dfrac{5\pi}{6}\right)$ sind beide negativ'],
    [r'$\dfrac{5\pi}{6} = 150^\circ$ liegt im 2. Quadranten: Der Punkt ist links oben.',
     r'$\sin\left(\dfrac{5\pi}{6}\right) = \dfrac{1}{2}$ (oben, positiv), $\cos\left(\dfrac{5\pi}{6}\right) = -\dfrac{\sqrt{3}}{2}$ (links, negativ).',
     r'Eine positive Zahl ist größer als eine negative.'])

# ------------------------------------------------------------ b and p ----
Q.q(r'Eine Sinusfunktion $f(x) = \sin(b \cdot x)$ hat die Periodenlänge $p = 6\pi$. Bestimme $b$.',
    [r'$\dfrac{1}{3}$', r'$3$', r'$12\pi^2$', r'$3\pi$'],
    [r'$b = \dfrac{2\pi}{p} = \dfrac{2\pi}{6\pi}$.',
     r'Erst $\pi$ kürzen, dann normal kürzen: $\dfrac{2}{6} = \dfrac{1}{3}$.',
     r'Probe: $b \cdot p = \dfrac{1}{3} \cdot 6\pi = 2\pi$. Große Periode heißt kleines $b$.'])

Q.q(r'Welche Funktion hat die Periodenlänge $10$?',
    [r'$f(x) = \sin\left(\dfrac{\pi}{5} x\right)$', r'$f(x) = \sin(10x)$',
     r'$f(x) = \sin\left(\dfrac{1}{10} x\right)$', r'$f(x) = \sin(5\pi x)$'],
    [r'$b = \dfrac{2\pi}{p} = \dfrac{2\pi}{10} = \dfrac{\pi}{5}$.',
     r'Zum Vergleich: $\sin(10x)$ hat $p = \dfrac{2\pi}{10} = \dfrac{\pi}{5}$, $\sin\left(\dfrac{x}{10}\right)$ hat $p = 20\pi$, $\sin(5\pi x)$ hat $p = \dfrac{2}{5}$.'])

Q.q(r'Eine Sinusfunktion hat die Periodenlänge $p = 5$. Bestimme $b$.',
    [r'$\dfrac{2\pi}{5}$', r'$\dfrac{5}{2\pi}$', r'$10\pi$', r'$\dfrac{2}{5}$'],
    [r'$b = \dfrac{2\pi}{p} = \dfrac{2\pi}{5}$.',
     r'Hier gibt es kein $\pi$ zum Kürzen. Die Periode muss kein Vielfaches von $\pi$ sein.',
     r'Probe: $\dfrac{2\pi}{5} \cdot 5 = 2\pi$.'])

Q.q(r'Bestimme die Periodenlänge von $g(x) = \sin\left(\dfrac{\pi}{3} x\right)$.',
    [r'$6$', r'$\dfrac{2\pi^2}{3}$', r'$\dfrac{1}{6}$', r'$6\pi$'],
    [r'$p = \dfrac{2\pi}{b} = 2\pi : \dfrac{\pi}{3}$.',
     r'Durch einen Bruch teilen heißt: mit dem Kehrwert malnehmen. $2\pi \cdot \dfrac{3}{\pi} = 6$.',
     r'Probe: $b \cdot p = \dfrac{\pi}{3} \cdot 6 = 2\pi$.'])

Q.q(r'Bestimme die Periodenlänge von $f(x) = \sin\left(\dfrac{1}{2} x\right)$.',
    [r'$4\pi$', r'$\pi$', r'$4$', r'$\dfrac{\pi}{4}$'],
    [r'$p = \dfrac{2\pi}{b} = 2\pi : \dfrac{1}{2} = 2\pi \cdot 2 = 4\pi$.',
     r'$\pi$ käme heraus, wenn man malnimmt statt teilt. Probe: $\dfrac{1}{2} \cdot 4\pi = 2\pi$.'])

# ------------------------------------------------------- function values ----
Q.q(r'Gegeben ist $f(x) = 4 \sin\left(\dfrac{\pi}{6}(x - 2)\right) + 5$. Berechne $f(5)$.',
    [r'$9$', r'$5$', r'$1$', r'$2\pi + 5$'],
    [r'Von innen nach außen. Klammer: $5 - 2 = 3$.',
     r'Mal $b$: $\dfrac{\pi}{6} \cdot 3 = \dfrac{\pi}{2}$. Sinus: $\sin\left(\dfrac{\pi}{2}\right) = 1$.',
     r'Mal $a$, plus $d$: $4 \cdot 1 + 5 = 9$.'])

Q.q(r'Die Höhe einer Gondel ist $h(t) = 15 \sin\left(\dfrac{\pi}{20}(t - 10)\right) + 17$ (in m, $t$ in s). Berechne $h(0)$.',
    [r'$2$', r'$32$', r'$17$', r'$-\dfrac{15\pi}{2} + 17$'],
    [r'Klammer: $0 - 10 = -10$. Mal $b$: $\dfrac{\pi}{20} \cdot (-10) = -\dfrac{\pi}{2}$.',
     r'Sinus: $\sin\left(-\dfrac{\pi}{2}\right) = -1$.',
     r'$15 \cdot (-1) + 17 = 2$. Die Gondel ist am Start ganz unten, 2 m über dem Boden.'])

Q.q(r'Ein Temperaturmodell lautet $T(t) = 5 \sin\left(\dfrac{\pi}{12}(t - 8)\right) + 15$. Welche Temperatur sagt es für $t = 8$ voraus?',
    [r'$15$ °C', r'$0$ °C', r'$20$ °C', r'$\dfrac{5\pi}{12} + 15$ °C'],
    [r'Einsetzen, nicht nach 0 auflösen: $T(8) = 5 \sin\left(\dfrac{\pi}{12} \cdot (8 - 8)\right) + 15$.',
     r'$\dfrac{\pi}{12} \cdot 0 = 0$ und $\sin(0) = 0$.',
     r'$5 \cdot 0 + 15 = 15$, also 15 °C.'])

Q.q(r'Für $f(x) = 2 \sin\left(\dfrac{\pi}{6}(x + 2)\right) + 1$ soll man zeigen, dass $f(1) = 3$ ist. Welcher Rechenweg ist richtig?',
    # split into three formulas so the option can wrap on a 390 px phone (one piece was 429 px wide)
    [r'$f(1) = 2 \sin\left(\dfrac{\pi}{6} \cdot 3\right) + 1$ $= 2 \sin\left(\dfrac{\pi}{2}\right) + 1$ $= 2 \cdot 1 + 1 = 3$',
     r'$0 = 2 \sin\left(\dfrac{\pi}{6}(1 + 2)\right) + 1$, dann nach $x$ auflösen',
     r'$f(1) = 2 \sin\left(\dfrac{\pi}{2}\right) + 1 = 2 \cdot \dfrac{\pi}{2} + 1 = \pi + 1$',
     r'$f(1) = 2 \sin\left(\dfrac{\pi}{6} + 2\right) + 1$, dann ausrechnen'],
    [r'Bei „Zeige, dass …“ setzt man nur ein und rechnet aus. Am Ende muss 3 herauskommen.',
     r'Klammer: $1 + 2 = 3$, mal $b$: $\dfrac{\pi}{6} \cdot 3 = \dfrac{\pi}{2}$, $\sin\left(\dfrac{\pi}{2}\right) = 1$.',
     r'$2 \cdot 1 + 1 = 3$. Den Sinus darf man nicht weglassen, und $b$ multipliziert die ganze Klammer.'])


def check():
    s, c, r, pi = math.sin, math.cos, math.sqrt, math.pi
    near = lambda a, b: abs(a - b) < 1e-9
    assert pi < 5 * pi / 4 < 3 * pi / 2
    assert near(3 * 180 / 4, 135) and near(300 / 180, 5 / 3)
    assert near(17 / 6 - 2, 5 / 6) and pi / 2 < 11 * pi / 4 - 2 * pi < pi
    assert near(s(5 * pi / 4), -r(2) / 2) and near(c(2 * pi / 3), -0.5)
    assert near(s(13 * pi / 6), 0.5) and near(c(-pi / 3), 0.5)
    assert near(s(5 * pi / 6), 0.5) and near(c(5 * pi / 6), -r(3) / 2)
    assert near(2 * pi / (6 * pi), 1 / 3)
    period = lambda b: 2 * pi / b
    assert near(period(pi / 5), 10) and near(period(10), pi / 5) and near(period(0.1), 20 * pi)
    assert near(period(5 * pi), 2 / 5)
    assert near(2 * pi / 5 * 5, 2 * pi)
    assert near(period(pi / 3), 6) and near(period(0.5), 4 * pi)
    f = lambda x: 4 * s(pi / 6 * (x - 2)) + 5
    assert near(f(5), 9)
    h = lambda t: 15 * s(pi / 20 * (t - 10)) + 17
    assert near(h(0), 2)
    T = lambda t: 5 * s(pi / 12 * (t - 8)) + 15
    assert near(T(8), 15)
    g = lambda x: 2 * s(pi / 6 * (x + 2)) + 1
    assert near(g(1), 3)


Q.verify(check)
Q.save()
