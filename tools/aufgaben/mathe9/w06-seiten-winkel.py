#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 6 / KW 39 (LB 1): Seiten und Winkel im
rechtwinkligen Dreieck mit sin, cos, tan und ihren Umkehrungen berechnen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=6, slug='seiten-winkel', thema='Seiten und Winkel berechnen', lb='LB 1',
        blurb='Fehlende Seiten mit sin, cos und tan, Winkel mit den Umkehrfunktionen, ganze Dreiecke',
        comment='Right angle always at C, calculator in DEG, values rounded. Blocks: sides (1-4, 15, 17-18), angles (5-8, 13-14), whole triangle and area (9-12), isosceles (19-20).')

# ----------------------------------------------------------------- Seiten ----
Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $c = 10$ cm und $\alpha = 30^\circ$. Wie lang ist $a$?',
    [r'5 cm', r'8,66 cm', r'20 cm', r'5,77 cm'],
    [r'$a$ ist Gegenkathete von $\alpha$: $\sin \alpha = \dfrac{a}{c}$.',
     r'$a = 10 \cdot \sin 30^\circ = 10 \cdot 0{,}5 = 5$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $c = 8$ cm und $\alpha = 40^\circ$. Wie lang ist $b$ (gerundet)?',
    [r'6,13 cm', r'5,14 cm', r'6,71 cm', r'10,44 cm'],
    [r'$b$ ist Ankathete von $\alpha$: $b = c \cdot \cos \alpha$.',
     r'$b = 8 \cdot \cos 40^\circ \approx 6{,}13$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $b = 5$ cm und $\alpha = 35^\circ$. Wie lang ist $a$ (gerundet)?',
    [r'3,50 cm', r'7,14 cm', r'2,87 cm', r'4,10 cm'],
    [r'$\tan \alpha = \dfrac{a}{b}$',
     r'$a = 5 \cdot \tan 35^\circ \approx 3{,}50$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $a = 4$ cm und $\alpha = 25^\circ$. Wie lang ist die Hypotenuse $c$ (gerundet)?',
    [r'9,46 cm', r'1,69 cm', r'4,41 cm', r'8,58 cm'],
    [r'$\sin \alpha = \dfrac{a}{c}$, also $c = \dfrac{a}{\sin \alpha}$.',
     r'$c = \dfrac{4}{\sin 25^\circ} \approx 9{,}46$ cm'])

# ------------------------------------------------------------------ Winkel ----
Q.q(r'Beide Katheten sind 7 cm lang. Wie groß ist $\alpha$?',
    [r'$45^\circ$', r'$30^\circ$', r'$60^\circ$', r'$7^\circ$'],
    [r'$\tan \alpha = \dfrac{7}{7} = 1$',
     r'$\alpha = \tan^{-1}(1) = 45^\circ$'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $a = 3$ cm und $c = 6$ cm. Wie groß ist $\alpha$?',
    [r'$30^\circ$', r'$60^\circ$', r'$26{,}57^\circ$', r'$0{,}5^\circ$'],
    [r'$\sin \alpha = \dfrac{3}{6} = 0{,}5$',
     r'$\alpha = \sin^{-1}(0{,}5) = 30^\circ$'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $b = 4$ cm und $c = 5$ cm. Wie groß ist $\alpha$ (gerundet)?',
    [r'$36{,}87^\circ$', r'$53{,}13^\circ$', r'$38{,}66^\circ$', r'$0{,}8^\circ$'],
    [r'$b$ liegt an $\alpha$ an: $\cos \alpha = \dfrac{4}{5} = 0{,}8$',
     r'$\alpha = \cos^{-1}(0{,}8) \approx 36{,}87^\circ$'])

Q.q(r'Die Katheten sind $a = 5$ cm und $b = 12$ cm. Wie groß ist $\alpha$ (gerundet)?',
    [r'$22{,}62^\circ$', r'$67{,}38^\circ$', r'$24{,}62^\circ$', r'$0{,}42^\circ$'],
    [r'$\tan \alpha = \dfrac{5}{12}$',
     r'$\alpha = \tan^{-1}\left(\dfrac{5}{12}\right) \approx 22{,}62^\circ$'])

# ------------------------------------------------------------ ganzes Dreieck ----
Q.q(r'In einem rechtwinkligen Dreieck ist $\alpha = 34^\circ$. Wie groß ist $\beta$?',
    [r'$56^\circ$', r'$146^\circ$', r'$34^\circ$', r'$66^\circ$'],
    [r'$\alpha + \beta = 180^\circ - 90^\circ = 90^\circ$',
     r'$\beta = 90^\circ - 34^\circ = 56^\circ$'])

Q.q(r'Die Katheten sind $a = 6$ cm und $b = 8$ cm. Wie groß ist $\beta$ (gerundet)?',
    [r'$53{,}13^\circ$', r'$36{,}87^\circ$', r'$48{,}59^\circ$', r'$41{,}41^\circ$'],
    [r'$\tan \beta = \dfrac{b}{a} = \dfrac{8}{6}$',
     r'$\beta \approx 53{,}13^\circ$, dazu $\alpha \approx 36{,}87^\circ$ und $c = 10$ cm.'])

Q.q(r'Ein rechtwinkliges Dreieck hat $c = 10$ cm und $\alpha = 30^\circ$. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'21,65 cm²', r'43,30 cm²', r'25 cm²', r'50 cm²'],
    [r'$a = 10 \cdot \sin 30^\circ = 5$ cm, $b = 10 \cdot \cos 30^\circ \approx 8{,}66$ cm',
     r'$A = \dfrac{a \cdot b}{2} \approx \dfrac{5 \cdot 8{,}66}{2} \approx 21{,}65$ cm²'])

Q.q(r'Gegeben sind Gegenkathete und Ankathete von $\alpha$. Welche Funktion führt direkt zu $\alpha$?',
    [r'$\tan^{-1}$', r'$\sin^{-1}$', r'$\cos^{-1}$', r'die Wurzel'],
    [r'Der Tangens verbindet genau diese beiden Seiten.',
     r'$\alpha = \tan^{-1}\left(\dfrac{\text{Gegenkathete}}{\text{Ankathete}}\right)$'])

Q.q(r'Was berechnet die Taste $\sin^{-1}$ auf dem Taschenrechner?',
    [r'den Winkel, der zu einem Sinuswert gehört', r'den Kehrwert $\dfrac{1}{\sin \alpha}$', r'den Sinus von −1', r'die Gegenkathete'],
    [r'$\sin^{-1}$ ist die Umkehrung: aus $\sin \alpha = 0{,}5$ wird $\alpha = 30^\circ$.',
     r'Mit dem Kehrwert hat die Taste nichts zu tun.'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $a = 2{,}4$ cm und $c = 4$ cm. Wie groß ist $\alpha$ (gerundet)?',
    [r'$36{,}87^\circ$', r'$53{,}13^\circ$', r'$30{,}96^\circ$', r'$0{,}6^\circ$'],
    [r'$\sin \alpha = \dfrac{2{,}4}{4} = 0{,}6$',
     r'$\alpha \approx 36{,}87^\circ$'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $\alpha = 60^\circ$ und $b = 3$ cm. Wie lang ist $c$?',
    [r'6 cm', r'1,5 cm', r'3,46 cm', r'5,20 cm'],
    [r'$b$ ist Ankathete: $\cos \alpha = \dfrac{b}{c}$',
     r'$c = \dfrac{3}{\cos 60^\circ} = \dfrac{3}{0{,}5} = 6$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $b = 9$ cm und $\alpha = 50^\circ$. Wie lang ist $c$ (gerundet)?',
    [r'14,0 cm', r'11,7 cm', r'5,8 cm', r'7,6 cm'],
    [r'$c = \dfrac{b}{\cos \alpha} = \dfrac{9}{\cos 50^\circ}$',
     r'$c \approx 14{,}0$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $c = 20$ cm und $\alpha = 52^\circ$. Wie lang ist $a$ (gerundet)?',
    [r'15,76 cm', r'12,31 cm', r'25,60 cm', r'16,00 cm'],
    [r'$a = c \cdot \sin \alpha = 20 \cdot \sin 52^\circ \approx 15{,}76$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $c = 12$ cm und $\beta = 25^\circ$. Wie lang ist $b$ (gerundet)?',
    [r'5,07 cm', r'10,88 cm', r'5,60 cm', r'28,39 cm'],
    [r'$b$ liegt $\beta$ gegenüber: $\sin \beta = \dfrac{b}{c}$.',
     r'$b = 12 \cdot \sin 25^\circ \approx 5{,}07$ cm'])

# ---------------------------------------------------- gleichschenklig ----
Q.q(r'Ein gleichschenkliges Dreieck hat Schenkel von 10 cm und Basiswinkel von $70^\circ$. Wie hoch ist es (gerundet)?',
    [r'9,40 cm', r'3,42 cm', r'27,47 cm', r'10 cm'],
    [r'Die Höhe zerlegt es in zwei rechtwinklige Dreiecke mit Hypotenuse 10 cm.',
     r'$h = 10 \cdot \sin 70^\circ \approx 9{,}40$ cm'])

Q.q(r'Wie lang ist die Basis dieses gleichschenkligen Dreiecks (Schenkel 10 cm, Basiswinkel $70^\circ$, gerundet)?',
    [r'6,84 cm', r'3,42 cm', r'18,79 cm', r'9,40 cm'],
    [r'Halbe Basis: $10 \cdot \cos 70^\circ \approx 3{,}42$ cm',
     r'Basis: $2 \cdot 3{,}42 \approx 6{,}84$ cm'])


def check():
    from math import sin, cos, tan, asin, acos, atan, degrees as d, radians as r, isclose
    R = lambda v, n=2: round(v, n)
    assert isclose(10 * sin(r(30)), 5) and R(8 * cos(r(40))) == 6.13
    assert R(5 * tan(r(35))) == 3.50 and R(4 / sin(r(25))) == 9.46
    assert isclose(d(atan(1)), 45) and isclose(d(asin(0.5)), 30)
    assert R(d(acos(0.8))) == 36.87 and R(d(atan(5 / 12))) == 22.62
    assert 90 - 34 == 56 and R(d(atan(8 / 6))) == 53.13
    assert R(5 * 10 * cos(r(30)) / 2) == 21.65
    assert R(d(asin(0.6))) == 36.87 and isclose(3 / cos(r(60)), 6)
    assert R(9 / cos(r(50)), 1) == 14.0 and R(20 * sin(r(52))) == 15.76
    assert R(12 * sin(r(25))) == 5.07 and R(12 * cos(r(25))) == 10.88
    assert R(10 * sin(r(70))) == 9.40 and R(2 * 10 * cos(r(70))) == 6.84


Q.verify(check)
Q.save()
