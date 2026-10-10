#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 10 / KW 45: Vorbereitung Klassenarbeit 1
(LB 1 rechtwinklige Dreiecke). Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=10, slug='ka1-dreiecke', thema='Vorbereitung Klassenarbeit 1: Rechtwinklige Dreiecke', lb='KA 1',
        blurb='gemischte Wiederholung zu Pythagoras, Umkehrung, Sinus, Kosinus, Tangens und Sachaufgaben',
        comment='Mixed review of LB 1, calculator in DEG, values rounded. Blocks: Pythagoras (1-4, 7, 18), converse (5-6), trigonometry (8-13, 19), context (14-17, 20).')

# --------------------------------------------------------------- Pythagoras ----
Q.q(r'Die Katheten eines rechtwinkligen Dreiecks sind 9 cm und 12 cm lang. Wie lang ist die Hypotenuse?',
    [r'15 cm', r'21 cm', r'7,9 cm', r'225 cm'],
    [r'$c = \sqrt{81 + 144} = \sqrt{225} = 15$ cm'])

Q.q(r'Die Hypotenuse ist 17 cm, eine Kathete 8 cm lang. Wie lang ist die andere Kathete?',
    [r'15 cm', r'9 cm', r'18,8 cm', r'25 cm'],
    [r'$b = \sqrt{289 - 64} = \sqrt{225} = 15$ cm'])

Q.q(r'Ein Rechteck ist 7 cm breit und 24 cm lang. Wie lang ist seine Diagonale?',
    [r'25 cm', r'31 cm', r'23 cm', r'17 cm'],
    [r'$d = \sqrt{49 + 576} = \sqrt{625} = 25$ cm'])

Q.q(r'Wie hoch ist ein gleichseitiges Dreieck mit 10 cm Seitenlänge (gerundet)?',
    [r'8,66 cm', r'7,07 cm', r'5 cm', r'11,18 cm'],
    [r'$h = \sqrt{100 - 25} = \sqrt{75} \approx 8{,}66$ cm'])

# --------------------------------------------------------------- Umkehrung ----
Q.q(r'Ist ein Dreieck mit den Seiten 12 cm, 16 cm und 20 cm rechtwinklig?',
    [r'Ja, denn $144 + 256 = 400$.', r'Nein, denn $12 + 16 \neq 20$.', r'Nein, denn 20 ist zu lang.', r'Das lässt sich nicht berechnen.'],
    [r'$12^2 + 16^2 = 400 = 20^2$: nach der Umkehrung rechtwinklig.'])

Q.q(r'Ein Dreieck hat die Seiten 6 cm, 8 cm und 11 cm. Was für ein Dreieck ist es?',
    [r'stumpfwinklig', r'rechtwinklig', r'spitzwinklig', r'gleichschenklig'],
    [r'$36 + 64 = 100 < 121$',
     r'Die längste Seite ist zu lang für einen rechten Winkel: stumpfwinklig.'])

Q.q(r'Wie weit sind $P(2 \mid -1)$ und $Q(8 \mid 7)$ voneinander entfernt?',
    [r'10', r'14', r'100', r'8,5'],
    [r'Unterschiede 6 und 8.',
     r'$\sqrt{36 + 64} = 10$'])

# ------------------------------------------------------------ Trigonometrie ----
Q.q(r'Ein rechtwinkliges Dreieck hat die Seiten 7 cm, 24 cm und 25 cm. $\alpha$ liegt der 7-cm-Seite gegenüber. Wie groß ist $\sin \alpha$?',
    [r'0,28', r'0,96', r'0,29', r'3,43'],
    [r'$\sin \alpha = \dfrac{7}{25} = 0{,}28$'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $c = 15$ cm und $\alpha = 40^\circ$. Wie lang ist $a$ (gerundet)?',
    [r'9,64 cm', r'11,49 cm', r'12,59 cm', r'23,34 cm'],
    [r'$a = c \cdot \sin \alpha = 15 \cdot \sin 40^\circ \approx 9{,}64$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $b = 6$ cm und $\alpha = 55^\circ$. Wie lang ist $a$ (gerundet)?',
    [r'8,57 cm', r'4,20 cm', r'4,91 cm', r'10,46 cm'],
    [r'$\tan \alpha = \dfrac{a}{b}$',
     r'$a = 6 \cdot \tan 55^\circ \approx 8{,}57$ cm'])

Q.q(r'Im Dreieck mit $\gamma = 90^\circ$ ist $a = 5$ cm und $c = 13$ cm. Wie groß ist $\alpha$ (gerundet)?',
    [r'$22{,}62^\circ$', r'$67{,}38^\circ$', r'$21{,}04^\circ$', r'$0{,}38^\circ$'],
    [r'$\sin \alpha = \dfrac{5}{13}$',
     r'$\alpha \approx 22{,}62^\circ$'])

Q.q(r'Die Katheten sind $a = 9$ cm und $b = 4$ cm. Wie groß ist $\alpha$ (gerundet)?',
    [r'$66{,}04^\circ$', r'$23{,}96^\circ$', r'$63{,}61^\circ$', r'$2{,}25^\circ$'],
    [r'$\tan \alpha = \dfrac{9}{4} = 2{,}25$',
     r'$\alpha \approx 66{,}04^\circ$'])

Q.q(r'In einem rechtwinkligen Dreieck ist $\alpha = 28^\circ$. Wie groß ist $\beta$?',
    [r'$62^\circ$', r'$152^\circ$', r'$28^\circ$', r'$72^\circ$'],
    [r'$\beta = 90^\circ - 28^\circ = 62^\circ$'])

# --------------------------------------------------------------- Sachbezug ----
Q.q(r'Eine 4 m lange Leiter steht unter $75^\circ$ zum Boden an einer Wand. Wie hoch reicht sie (gerundet)?',
    [r'3,86 m', r'1,04 m', r'14,93 m', r'4,14 m'],
    [r'$h = 4 \cdot \sin 75^\circ \approx 3{,}86$ m'])

Q.q(r'Eine Straße hat 15 % Steigung. Wie groß ist der Steigungswinkel (gerundet)?',
    [r'$8{,}53^\circ$', r'$15^\circ$', r'$8{,}63^\circ$', r'$81{,}47^\circ$'],
    [r'$\tan \alpha = 0{,}15$',
     r'$\alpha = \tan^{-1}(0{,}15) \approx 8{,}53^\circ$'])

Q.q(r'Ein Haus ist 12 m breit, das symmetrische Dach hat $40^\circ$ Neigung. Wie hoch ist der First über dem Dachboden (gerundet)?',
    [r'5,03 m', r'10,07 m', r'3,86 m', r'7,15 m'],
    [r'Halbe Breite 6 m ist die Ankathete.',
     r'$h = 6 \cdot \tan 40^\circ \approx 5{,}03$ m'])

Q.q(r'Ein 8 m hoher Mast wirft bei $32^\circ$ Sonnenhöhe einen Schatten. Wie lang ist er (gerundet)?',
    [r'12,80 m', r'5,00 m', r'4,24 m', r'15,10 m'],
    [r'$\tan 32^\circ = \dfrac{8}{x}$',
     r'$x = \dfrac{8}{\tan 32^\circ} \approx 12{,}80$ m'])

Q.q(r'Ein Quader hat die Kanten 2 cm, 3 cm und 6 cm. Wie lang ist seine Raumdiagonale?',
    [r'7 cm', r'11 cm', r'6,7 cm', r'49 cm'],
    [r'$d = \sqrt{4 + 9 + 36} = \sqrt{49} = 7$ cm'])

Q.q(r'Ein gleichschenkliges Dreieck hat die Basis 12 cm und Schenkel von 10 cm. Wie groß sind die Basiswinkel (gerundet)?',
    [r'$53{,}13^\circ$', r'$36{,}87^\circ$', r'$50{,}19^\circ$', r'$73{,}74^\circ$'],
    [r'Die Höhe halbiert die Basis: Ankathete 6 cm, Hypotenuse 10 cm.',
     r'$\cos \alpha = \dfrac{6}{10}$, $\alpha \approx 53{,}13^\circ$'])

Q.q(r'Eine 12 m lange Rampe überwindet 1 m Höhe. Wie groß ist ihr Neigungswinkel (gerundet)?',
    [r'$4{,}78^\circ$', r'$4{,}76^\circ$', r'$85{,}22^\circ$', r'$12^\circ$'],
    [r'Die Rampe ist die Hypotenuse: $\sin \alpha = \dfrac{1}{12}$',
     r'$\alpha \approx 4{,}78^\circ$'])


def check():
    from math import sin, cos, tan, asin, acos, atan, degrees as d, radians as r, sqrt, dist
    R = lambda v, n=2: round(v, n)
    assert sqrt(81 + 144) == 15 and sqrt(289 - 64) == 15 and sqrt(49 + 576) == 25 and R(sqrt(75)) == 8.66
    assert 144 + 256 == 400 and 36 + 64 < 121 and dist((2, -1), (8, 7)) == 10
    assert 7 / 25 == 0.28 and R(15 * sin(r(40))) == 9.64 and R(6 * tan(r(55))) == 8.57
    assert R(d(asin(5 / 13))) == 22.62 and R(d(atan(9 / 4))) == 66.04
    assert R(4 * sin(r(75))) == 3.86 and R(d(atan(0.15))) == 8.53 and R(6 * tan(r(40))) == 5.03
    assert R(8 / tan(r(32))) == 12.80 and sqrt(49) == 7 and R(d(acos(0.6))) == 53.13
    assert R(d(asin(1 / 12))) == 4.78 and R(d(atan(1 / 12))) == 4.76


Q.verify(check)
Q.save()
