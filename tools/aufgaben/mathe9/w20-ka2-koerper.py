#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 20 / KW 3: Vorbereitung Klassenarbeit 2
(LB 2 Pyramide, Kreiskegel, Kugel). Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=20, slug='ka2-koerper', thema='Vorbereitung Klassenarbeit 2: Pyramide, Kegel, Kugel', lb='KA 2',
        blurb='gemischte Wiederholung zu Darstellung, Höhen, Oberfläche, Volumen, Masse und zusammengesetzten Körpern',
        comment='Mixed review of LB 2, values with the calculator key for pi, rounded. Blocks: pyramid (1-7), cone (8-12), sphere (13-16), composite bodies (17-20).')

# ----------------------------------------------------------------- Pyramide ----
Q.q(r'Wie viele Kanten hat eine fünfseitige Pyramide?',
    [r'10', r'5', r'6', r'15'],
    [r'5 Grundkanten und 5 Seitenkanten.'])

Q.q(r'Eine quadratische Pyramide hat $a = 8$ cm und $h = 3$ cm. Wie groß ist die Seitenhöhe?',
    [r'5 cm', r'8,5 cm', r'4,1 cm', r'7 cm'],
    [r'$h_s = \sqrt{9 + 16} = 5$ cm'])

Q.q(r'Eine quadratische Pyramide hat $a = 4$ cm und $h = 7$ cm. Wie lang ist eine Seitenkante (gerundet)?',
    [r'7,55 cm', r'7,28 cm', r'8,06 cm', r'5,74 cm'],
    [r'$\left(\dfrac{d}{2}\right)^2 = \dfrac{16}{2} = 8$',
     r'$s = \sqrt{49 + 8} = \sqrt{57} \approx 7{,}55$ cm'])

Q.q(r'Wie groß ist die Oberfläche einer quadratischen Pyramide mit $a = 8$ cm und $h_s = 5$ cm?',
    [r'144 cm²', r'80 cm²', r'224 cm²', r'104 cm²'],
    [r'Mantel: $4 \cdot \dfrac{8 \cdot 5}{2} = 80$ cm², Grundfläche 64 cm².',
     r'$O = 144$ cm²'])

Q.q(r'Wie groß ist das Volumen einer quadratischen Pyramide mit $a = 8$ cm und $h = 3$ cm?',
    [r'64 cm³', r'192 cm³', r'32 cm³', r'96 cm³'],
    [r'$V = \dfrac{1}{3} \cdot 64 \cdot 3 = 64$ cm³'])

Q.q(r'Eine Pyramide hat das Volumen 120 cm³ und die Grundfläche 30 cm². Wie hoch ist sie?',
    [r'12 cm', r'4 cm', r'1,33 cm', r'36 cm'],
    [r'$h = \dfrac{3V}{A_G} = \dfrac{360}{30} = 12$ cm'])

Q.q(r'In welcher Ansicht des senkrechten Zweitafelbildes sieht man die Grundfläche einer stehenden Pyramide unverzerrt?',
    [r'im Grundriss', r'im Aufriss', r'in keiner', r'im Schrägbild'],
    [r'Die Grundfläche liegt waagerecht, von oben sieht man sie in wahrer Gestalt.'])

# --------------------------------------------------------------------- Kegel ----
Q.q(r'Ein Kegel hat $r = 9$ cm und $h = 12$ cm. Wie lang ist die Mantellinie?',
    [r'15 cm', r'21 cm', r'7,9 cm', r'225 cm'],
    [r'$s = \sqrt{81 + 144} = 15$ cm'])

Q.q(r'Wie groß ist der Mantel dieses Kegels ($r = 9$ cm, $s = 15$ cm, gerundet)?',
    [r'424,1 cm²', r'678,6 cm²', r'254,5 cm²', r'135 cm²'],
    [r'$A_M = \pi \cdot 9 \cdot 15 = 135\pi \approx 424{,}1$ cm²'])

Q.q(r'Wie groß ist die Oberfläche dieses Kegels (gerundet)?',
    [r'678,6 cm²', r'424,1 cm²', r'932,6 cm²', r'508,9 cm²'],
    [r'$O = \pi \cdot 81 + 135\pi = 216\pi \approx 678{,}6$ cm²'])

Q.q(r'Wie groß ist das Volumen dieses Kegels ($r = 9$ cm, $h = 12$ cm, gerundet)?',
    [r'1017,9 cm³', r'3053,6 cm³', r'339,3 cm³', r'1272,3 cm³'],
    [r'$V = \dfrac{1}{3}\pi \cdot 81 \cdot 12 = 324\pi \approx 1017{,}9$ cm³'])

Q.q(r'Ein Kegel und ein Zylinder haben gleichen Radius und gleiche Höhe. Der Zylinder fasst 900 ml. Wie viel fasst der Kegel?',
    [r'300 ml', r'450 ml', r'600 ml', r'2700 ml'],
    [r'Der Kegel ist ein Drittel des Zylinders: $900 : 3 = 300$ ml.'])

# --------------------------------------------------------------------- Kugel ----
Q.q(r'Wie groß ist das Volumen einer Kugel mit $r = 6$ cm (gerundet)?',
    [r'904,8 cm³', r'452,4 cm³', r'301,6 cm³', r'2714,3 cm³'],
    [r'$V = \dfrac{4}{3}\pi \cdot 216 = 288\pi \approx 904{,}8$ cm³'])

Q.q(r'Wie groß ist die Oberfläche einer Kugel mit $d = 6$ cm (gerundet)?',
    [r'113,1 cm²', r'452,4 cm²', r'28,3 cm²', r'37,7 cm²'],
    [r'$r = 3$ cm',
     r'$O = 4\pi \cdot 9 = 36\pi \approx 113{,}1$ cm²'])

Q.q(r'Eine Kugel hat das Volumen 4189 cm³. Wie groß ist ihr Radius (gerundet)?',
    [r'10 cm', r'20 cm', r'32 cm', r'1000 cm'],
    [r'$r^3 = \dfrac{3 \cdot 4189}{4\pi} \approx 1000$',
     r'$r = \sqrt[3]{1000} = 10$ cm'])

Q.q(r'Eine Bleikugel hat 2 cm Radius. Blei hat die Dichte 11,3 g/cm³. Wie schwer ist sie (gerundet)?',
    [r'378,7 g', r'33,5 g', r'94,7 g', r'1136 g'],
    [r'$V = \dfrac{4}{3}\pi \cdot 8 \approx 33{,}51$ cm³',
     r'$m = 11{,}3 \cdot 33{,}51 \approx 378{,}7$ g'])

# --------------------------------------------------- zusammengesetzte Körper ----
Q.q(r'Ein Zylinder ($r = 2$ cm, $h = 5$ cm) trägt einen Kegel mit gleichem Radius und $h = 3$ cm. Wie groß ist das Volumen (gerundet)?',
    [r'75,4 cm³', r'62,8 cm³', r'100,5 cm³', r'12,6 cm³'],
    [r'Zylinder: $20\pi$, Kegel: $\dfrac{1}{3}\pi \cdot 4 \cdot 3 = 4\pi$',
     r'Zusammen $24\pi \approx 75{,}4$ cm³'])

Q.q(r'Ein Würfel mit 6 cm Kantenlänge hat eine halbkugelförmige Mulde mit 2 cm Radius. Wie groß ist das Restvolumen (gerundet)?',
    [r'199,2 cm³', r'182,5 cm³', r'216 cm³', r'207,6 cm³'],
    [r'Würfel: 216 cm³, Halbkugel: $\dfrac{2}{3}\pi \cdot 8 \approx 16{,}76$ cm³',
     r'$216 - 16{,}76 \approx 199{,}2$ cm³'])

Q.q(r'Eine Laterne hat ein Kegeldach aus Blech mit $r = 20$ cm und $h = 15$ cm. Wie viel Blech braucht das Dach (gerundet)?',
    [r'1570,8 cm²', r'2827,4 cm²', r'942,5 cm²', r'6283,2 cm²'],
    [r'$s = \sqrt{400 + 225} = 25$ cm',
     r'$A_M = \pi \cdot 20 \cdot 25 = 500\pi \approx 1570{,}8$ cm²'])

Q.q(r'Ein Messbecher ist ein Kegel (Spitze unten), der bis zum Rand 400 ml fasst. Wie viel ist bei halber Höhe darin?',
    [r'50 ml', r'200 ml', r'100 ml', r'133 ml'],
    [r'Die Füllung ist ein ähnlicher Kegel mit $k = \dfrac{1}{2}$.',
     r'Volumen: $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$, also $400 : 8 = 50$ ml.'])


def check():
    from math import pi, sqrt
    R = lambda v, n=1: round(v, n)
    assert 2 * 5 == 10 and sqrt(9 + 16) == 5 and round(sqrt(57), 2) == 7.55
    assert 4 * 8 * 5 / 2 + 64 == 144 and 64 * 3 / 3 == 64 and 3 * 120 / 30 == 12
    assert sqrt(81 + 144) == 15 and R(135 * pi) == 424.1 and R(216 * pi) == 678.6 and R(324 * pi) == 1017.9
    assert 900 / 3 == 300
    assert R(288 * pi) == 904.8 and R(36 * pi) == 113.1 and round((3 * 4189 / (4 * pi)) ** (1 / 3)) == 10
    assert R(11.3 * 4 / 3 * pi * 8) == 378.7
    assert R(24 * pi) == 75.4 and R(216 - 2 / 3 * pi * 8) == 199.2
    assert sqrt(400 + 225) == 25 and R(500 * pi) == 1570.8 and 400 / 8 == 50


Q.verify(check)
Q.save()
