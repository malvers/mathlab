#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 12 / KW 47 (LB 2): Körperhöhe, Seitenhöhe und
Seitenkante der Pyramide mit Pythagoras in Stützdreiecken. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=12, slug='pyramide-hoehen', thema='Höhen und Kanten der Pyramide', lb='LB 2',
        blurb='Körperhöhe h, Seitenhöhe h_s, Seitenkante s, Stützdreiecke, Neigungswinkel',
        comment='Square pyramid with base edge a unless stated, values rounded. Blocks: support triangles (5-6, 18), side height (1, 3, 9, 14, 16-17, 19), lateral edge (2, 4, 8, 15), totals and angles (10-13, 20), famous pyramids (7-8, 14).')

# ----------------------------------------------------- Stützdreiecke ----
Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $h = 4$ cm. Wie groß ist die Seitenhöhe $h_s$?',
    [r'5 cm', r'7,2 cm', r'4,5 cm', r'10 cm'],
    [r'Stützdreieck aus $h$, $\dfrac{a}{2}$ und $h_s$.',
     r'$h_s = \sqrt{4^2 + 3^2} = \sqrt{25} = 5$ cm'])

Q.q(r'Wie lang ist bei derselben Pyramide ($a = 6$ cm, $h = 4$ cm) eine Seitenkante $s$ (gerundet)?',
    [r'5,83 cm', r'5 cm', r'7,21 cm', r'8,49 cm'],
    [r'Halbe Diagonale der Grundfläche: $\dfrac{6\sqrt{2}}{2} \approx 4{,}24$ cm, also $\left(\dfrac{d}{2}\right)^2 = 18$.',
     r'$s = \sqrt{16 + 18} = \sqrt{34} \approx 5{,}83$ cm'])

Q.q(r'Eine quadratische Pyramide hat $a = 12$ cm und $h_s = 10$ cm. Wie hoch ist sie?',
    [r'8 cm', r'6 cm', r'11,7 cm', r'15,6 cm'],
    [r'$h = \sqrt{h_s^2 - \left(\dfrac{a}{2}\right)^2} = \sqrt{100 - 36} = 8$ cm'])

Q.q(r'Wie lang ist eine Seitenkante dieser Pyramide ($a = 12$ cm, $h_s = 10$ cm, gerundet)?',
    [r'11,66 cm', r'10 cm', r'13,42 cm', r'8 cm'],
    [r'Im Seitendreieck: $s = \sqrt{h_s^2 + \left(\dfrac{a}{2}\right)^2} = \sqrt{100 + 36}$',
     r'$s = \sqrt{136} \approx 11{,}66$ cm'])

Q.q(r'Aus welchen Strecken besteht das Stützdreieck für die Seitenhöhe $h_s$?',
    [r'Körperhöhe $h$, halbe Grundkante $\dfrac{a}{2}$ und $h_s$', r'Körperhöhe $h$, halbe Diagonale und $s$',
     r'Grundkante $a$, Seitenkante $s$ und $h$', r'$h_s$, $s$ und die Diagonale'],
    [r'Die Höhe trifft die Mitte der Grundfläche, $h_s$ die Mitte einer Grundkante.',
     r'Der Abstand dieser beiden Punkte ist $\dfrac{a}{2}$.'])

Q.q(r'Aus welchen Strecken besteht das Stützdreieck für die Seitenkante $s$?',
    [r'Körperhöhe $h$, halbe Diagonale $\dfrac{d}{2}$ und $s$', r'Körperhöhe $h$, halbe Grundkante und $s$',
     r'$h_s$, $a$ und $s$', r'$a$, $d$ und $h$'],
    [r'Die Seitenkante läuft von einer Ecke zur Spitze.',
     r'Von der Ecke bis zur Mitte der Grundfläche ist es eine halbe Diagonale.'])

Q.q(r'Die Cheops-Pyramide hatte ursprünglich etwa $a = 230$ m und $h = 146{,}6$ m. Wie groß war ihre Seitenhöhe (gerundet)?',
    [r'186,3 m', r'219,0 m', r'115,0 m', r'261,0 m'],
    [r'$h_s = \sqrt{146{,}6^2 + 115^2}$',
     r'$h_s = \sqrt{34\,716{,}56} \approx 186{,}3$ m'])

Q.q(r'Wie lang war eine Seitenkante der Cheops-Pyramide ($a = 230$ m, $h = 146{,}6$ m, gerundet)?',
    [r'219,0 m', r'186,3 m', r'162,6 m', r'275,7 m'],
    [r'$\left(\dfrac{d}{2}\right)^2 = \dfrac{a^2}{2} = 26\,450$',
     r'$s = \sqrt{146{,}6^2 + 26\,450} \approx 219{,}0$ m'])

Q.q(r'Eine rechteckige Pyramide hat die Grundkanten 8 cm und 6 cm und die Höhe 12 cm. Wie groß ist die Seitenhöhe auf die 8-cm-Kante (gerundet)?',
    [r'12,37 cm', r'12,65 cm', r'13 cm', r'14,42 cm'],
    [r'Zur Mitte der 8-cm-Kante ist es von der Grundflächenmitte die halbe andere Kante: 3 cm.',
     r'$h_a = \sqrt{144 + 9} = \sqrt{153} \approx 12{,}37$ cm'])

Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $s = 5$ cm. Wie lang sind alle Kanten zusammen?',
    [r'44 cm', r'24 cm', r'20 cm', r'30 cm'],
    [r'4 Grundkanten: 24 cm, 4 Seitenkanten: 20 cm.',
     r'Zusammen 44 cm.'])

Q.q(r'Ein Tetraeder hat 6 cm Kantenlänge. Wie hoch ist eine seiner Seitenflächen (gerundet)?',
    [r'5,20 cm', r'4,90 cm', r'6 cm', r'3 cm'],
    [r'Jede Seitenfläche ist ein gleichseitiges Dreieck.',
     r'$h = \sqrt{36 - 9} = \sqrt{27} \approx 5{,}20$ cm'])

Q.q(r'Wie stark ist eine Seitenfläche der Pyramide mit $a = 6$ cm und $h = 4$ cm gegen die Grundfläche geneigt (gerundet)?',
    [r'$53{,}13^\circ$', r'$36{,}87^\circ$', r'$43{,}31^\circ$', r'$33{,}69^\circ$'],
    [r'Im Stützdreieck: $\tan \varepsilon = \dfrac{h}{a/2} = \dfrac{4}{3}$',
     r'$\varepsilon \approx 53{,}13^\circ$'])

Q.q(r'Wie stark ist eine Seitenkante dieser Pyramide ($a = 6$ cm, $h = 4$ cm) gegen die Grundfläche geneigt (gerundet)?',
    [r'$43{,}31^\circ$', r'$53{,}13^\circ$', r'$46{,}69^\circ$', r'$33{,}69^\circ$'],
    [r'$\tan \varphi = \dfrac{h}{d/2} = \dfrac{4}{4{,}243}$',
     r'$\varphi \approx 43{,}31^\circ$; Kanten sind flacher geneigt als Flächen.'])

Q.q(r'Die Glaspyramide am Louvre in Paris hat etwa 35 m Grundkante und 21,6 m Höhe. Wie groß ist ihre Seitenhöhe ungefähr?',
    [r'etwa 27,8 m', r'etwa 41,1 m', r'etwa 17,5 m', r'etwa 33,2 m'],
    [r'$h_s = \sqrt{21{,}6^2 + 17{,}5^2} = \sqrt{772{,}81}$',
     r'$h_s \approx 27{,}8$ m'])

Q.q(r'Eine quadratische Pyramide hat $a = 8$ cm und $s = 9$ cm. Wie hoch ist sie?',
    [r'7 cm', r'8,06 cm', r'5 cm', r'9,85 cm'],
    [r'$\left(\dfrac{d}{2}\right)^2 = \dfrac{64}{2} = 32$',
     r'$h = \sqrt{81 - 32} = \sqrt{49} = 7$ cm'])

Q.q(r'Ein quadratisches Zelt hat 2 m Grundkante, die Seitenhöhe ist 2,2 m. Wie hoch ist das Zelt in der Mitte (gerundet)?',
    [r'1,96 m', r'2,42 m', r'1,20 m', r'2,20 m'],
    [r'$h = \sqrt{2{,}2^2 - 1^2} = \sqrt{3{,}84}$',
     r'$h \approx 1{,}96$ m'])

Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $s = 5$ cm. Wie groß ist die Seitenhöhe?',
    [r'4 cm', r'5,83 cm', r'3,32 cm', r'2 cm'],
    [r'Im Seitendreieck: $h_s = \sqrt{s^2 - \left(\dfrac{a}{2}\right)^2} = \sqrt{25 - 9} = 4$ cm'])

Q.q(r'Du kennst $a$ und $h$ einer quadratischen Pyramide und suchst die Seitenkante. Was berechnest du zuerst?',
    [r'die halbe Diagonale der Grundfläche', r'die Seitenhöhe', r'das Volumen', r'den Umfang der Grundfläche'],
    [r'Das Stützdreieck für $s$ braucht $h$ und $\dfrac{d}{2}$.',
     r'$\dfrac{d}{2} = \dfrac{a\sqrt{2}}{2}$, danach $s = \sqrt{h^2 + \left(\dfrac{d}{2}\right)^2}$.'])

Q.q(r'Eine quadratische Pyramide hat $a = 10$ cm und $h = 12$ cm. Wie groß ist $h_s$?',
    [r'13 cm', r'15,6 cm', r'11 cm', r'17 cm'],
    [r'$h_s = \sqrt{144 + 25} = \sqrt{169} = 13$ cm'])

Q.q(r'Ein Seitendreieck einer Pyramide hat die Grundkante 6 cm und die Seitenhöhe 5 cm. Wie groß ist der Winkel an der Spitze dieses Dreiecks (gerundet)?',
    [r'$61{,}93^\circ$', r'$30{,}96^\circ$', r'$73{,}74^\circ$', r'$100{,}39^\circ$'],
    [r'Halber Winkel: $\tan \dfrac{\omega}{2} = \dfrac{3}{5}$, also $\dfrac{\omega}{2} \approx 30{,}96^\circ$.',
     r'$\omega \approx 61{,}93^\circ$'])


def check():
    from math import sqrt, atan, degrees as d
    R = lambda v, n=2: round(v, n)
    assert sqrt(16 + 9) == 5 and R(sqrt(16 + 18)) == 5.83
    assert sqrt(100 - 36) == 8 and R(sqrt(136)) == 11.66
    assert R(sqrt(146.6 ** 2 + 115 ** 2), 1) == 186.3 and R(sqrt(146.6 ** 2 + 230 ** 2 / 2), 1) == 219.0
    assert R(sqrt(153)) == 12.37 and R(sqrt(160)) == 12.65
    assert 4 * 6 + 4 * 5 == 44 and R(sqrt(27)) == 5.20
    assert R(d(atan(4 / 3))) == 53.13 and R(d(atan(4 / sqrt(18)))) == 43.31
    assert R(sqrt(21.6 ** 2 + 17.5 ** 2), 1) == 27.8
    assert sqrt(81 - 32) == 7 and R(sqrt(2.2 ** 2 - 1)) == 1.96 and sqrt(25 - 9) == 4
    assert sqrt(144 + 25) == 13 and R(2 * d(atan(3 / 5))) == 61.93


Q.verify(check)
Q.save()
