#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 23 / KW 8: Vorbereitung Klassenarbeit 3
(LB 3 Kreis und Kreiszylinder). Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=23, slug='ka3-kreis-zylinder', thema='Vorbereitung Klassenarbeit 3: Kreis und Kreiszylinder', lb='KA 3',
        blurb='gemischte Wiederholung zu Kreis und Gerade, Thales, Umfang, Fläche, Kreisring und Zylinder',
        comment='Mixed review of LB 3, values with the calculator key for pi, rounded at the end. Blocks: lines and Thales (1-4), circle (5-10), cylinder (11-20).')

# ------------------------------------------------------ Gerade und Thales ----
Q.q(r'Ein Kreis hat den Radius 6 cm. Eine Gerade hat vom Mittelpunkt den Abstand 4 cm. Was ist die Gerade?',
    [r'eine Sekante', r'eine Tangente', r'eine Passante', r'ein Radius'],
    [r'Abstand kleiner als Radius: zwei Schnittpunkte.'])

Q.q(r'Eine Gerade berührt einen Kreis in genau einem Punkt $B$. Welchen Winkel bildet sie mit dem Radius $\overline{MB}$?',
    [r'$90^\circ$', r'$180^\circ$', r'$45^\circ$', r'$0^\circ$'],
    [r'Eine Tangente steht immer senkrecht auf dem Berührungsradius.'])

Q.q(r'$\overline{AB}$ ist Durchmesser, $C$ liegt auf dem Kreis und $\alpha = 27^\circ$. Wie groß ist $\beta$?',
    [r'$63^\circ$', r'$27^\circ$', r'$153^\circ$', r'$73^\circ$'],
    [r'Thales: $\gamma = 90^\circ$',
     r'$\beta = 180^\circ - 90^\circ - 27^\circ = 63^\circ$'])

Q.q(r'Welchen Radius hat der Thaleskreis über einer 7 cm langen Strecke $\overline{AB}$?',
    [r'3,5 cm', r'7 cm', r'14 cm', r'22 cm'],
    [r'$\overline{AB}$ ist der Durchmesser: $r = 7 : 2 = 3{,}5$ cm.'])

# ---------------------------------------------------------------- Kreis ----
Q.q(r'Ein Kreis hat den Durchmesser 25 cm. Wie groß ist sein Umfang (gerundet)?',
    [r'78,5 cm', r'157,1 cm', r'490,9 cm', r'39,3 cm'],
    [r'$u = \pi \cdot d = 25\pi \approx 78{,}5$ cm'])

Q.q(r'Ein Kreis hat den Radius 7 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'153,9 cm²', r'44,0 cm²', r'615,8 cm²', r'49 cm²'],
    [r'$A = \pi \cdot 7^2 = 49\pi \approx 153{,}9$ cm²'])

Q.q(r'Ein Kreis hat den Umfang 31,4 cm. Wie groß ist sein Radius (gerundet)?',
    [r'5,0 cm', r'10,0 cm', r'3,2 cm', r'15,7 cm'],
    [r'$r = \dfrac{u}{2\pi} = \dfrac{31{,}4}{2\pi} \approx 5{,}0$ cm'])

Q.q(r'Ein Kreis hat den Flächeninhalt 50,3 cm². Wie groß ist sein Durchmesser (gerundet)?',
    [r'8,0 cm', r'4,0 cm', r'16,0 cm', r'16,0 cm²'],
    [r'$r = \sqrt{\dfrac{50{,}3}{\pi}} \approx 4{,}0$ cm',
     r'$d = 2r \approx 8{,}0$ cm'])

Q.q(r'Ein Kreisring hat den Außenradius 6 cm und den Innenradius 4 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'62,8 cm²', r'12,6 cm²', r'163,4 cm²', r'31,4 cm²'],
    [r'$A = \pi \cdot (36 - 16) = 20\pi \approx 62{,}8$ cm²'])

Q.q(r'Ein Halbkreis hat den Radius 10 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'157,1 cm²', r'314,2 cm²', r'31,4 cm²', r'78,5 cm²'],
    [r'Ganzer Kreis: $100\pi \approx 314{,}2$ cm²',
     r'Halbkreis: $50\pi \approx 157{,}1$ cm²'])

# ------------------------------------------------------------- Zylinder ----
Q.q(r'Ein Zylinder hat $r = 2$ cm und $h = 5$ cm. Wie groß ist sein Mantelflächeninhalt (gerundet)?',
    [r'62,8 cm²', r'31,4 cm²', r'88,0 cm²', r'125,7 cm²'],
    [r'$A_M = 2\pi r h = 2\pi \cdot 2 \cdot 5 = 20\pi \approx 62{,}8$ cm²'])

Q.q(r'Wie groß ist der Oberflächeninhalt des Zylinders aus der vorigen Aufgabe ($r = 2$ cm, $h = 5$ cm, gerundet)?',
    [r'88,0 cm²', r'62,8 cm²', r'75,4 cm²', r'100,5 cm²'],
    [r'$O = 2\pi r^2 + 2\pi r h = 8\pi + 20\pi$',
     r'$O = 28\pi \approx 88{,}0$ cm²'])

Q.q(r'Ein Zylinder hat $r = 3$ cm und $h = 5$ cm. Wie groß ist sein Volumen (gerundet)?',
    [r'141,4 cm³', r'47,1 cm³', r'94,2 cm³', r'565,5 cm³'],
    [r'$V = \pi \cdot 9 \cdot 5 = 45\pi \approx 141{,}4$ cm³'])

Q.q(r'Ein Kochtopf hat innen 24 cm Durchmesser und ist 15 cm hoch. Wie viel passt hinein (gerundet)?',
    [r'etwa 6,8 l', r'etwa 27,1 l', r'etwa 1,1 l', r'etwa 68 l'],
    [r'$V = \pi \cdot 12^2 \cdot 15 = 2160\pi \approx 6786$ cm³',
     r'Also etwa 6,8 l.'])

Q.q(r'Ein Hohlzylinder hat $r_a = 4$ cm, $r_i = 3$ cm und $h = 10$ cm. Wie groß ist sein Volumen (gerundet)?',
    [r'219,9 cm³', r'31,4 cm³', r'502,7 cm³', r'282,7 cm³'],
    [r'$V = \pi \cdot (16 - 9) \cdot 10 = 70\pi \approx 219{,}9$ cm³'])

Q.q(r'Der Hohlzylinder aus der vorigen Aufgabe (etwa 219,9 cm³) ist aus Stahl mit der Dichte 7,8 g/cm³. Wie schwer ist er (gerundet)?',
    [r'1,72 kg', r'28,2 kg', r'0,17 kg', r'17,2 kg'],
    [r'$m = \rho \cdot V = 7{,}8 \cdot 219{,}9 \approx 1715$ g',
     r'Also etwa 1,72 kg.'])

Q.q(r'Eine zylinderförmige Dose mit 10 cm Durchmesser soll genau 1 Liter fassen. Wie hoch muss sie sein (gerundet)?',
    [r'12,7 cm', r'3,2 cm', r'31,8 cm', r'10 cm'],
    [r'$h = \dfrac{1000}{\pi \cdot 5^2} = \dfrac{1000}{25\pi} \approx 12{,}7$ cm'])

Q.q(r'Welche Form hat der abgerollte Mantel eines Zylinders?',
    [r'ein Rechteck mit der Breite $2\pi r$ und der Höhe $h$', r'ein Kreis mit dem Radius $h$',
     r'ein Rechteck mit der Breite $r$ und der Höhe $h$', r'ein Dreieck'],
    [r'Der Mantel wird an einer Mantellinie aufgeschnitten und abgerollt.',
     r'Seine Breite ist der Umfang des Grundkreises.'])

Q.q(r'Bei einem Zylinder werden Radius und Höhe verdoppelt. Wie ändert sich das Volumen?',
    [r'Es wird 8-mal so groß.', r'Es wird 4-mal so groß.', r'Es wird doppelt so groß.', r'Es wird 6-mal so groß.'],
    [r'$V = \pi r^2 h$: Der Radius zählt doppelt, die Höhe einfach.',
     r'$\pi \cdot (2r)^2 \cdot 2h = 8 \cdot \pi r^2 h$'])

Q.q(r'Ein Rad hat 0,7 m Durchmesser. Welche Strecke legt es bei 1000 Umdrehungen zurück (gerundet)?',
    [r'etwa 2,2 km', r'etwa 0,7 km', r'etwa 4,4 km', r'etwa 22 km'],
    [r'Eine Umdrehung: $u = \pi \cdot 0{,}7 \approx 2{,}199$ m',
     r'1000 Umdrehungen: etwa 2199 m, also rund 2,2 km.'])


def check():
    from math import pi, sqrt
    r1 = lambda v: round(v, 1)
    assert 180 - 90 - 27 == 63 and 7 / 2 == 3.5
    assert r1(25 * pi) == 78.5
    assert r1(49 * pi) == 153.9
    assert r1(31.4 / (2 * pi)) == 5.0
    assert r1(2 * sqrt(50.3 / pi)) == 8.0
    assert r1(20 * pi) == 62.8
    assert r1(50 * pi) == 157.1
    assert r1(20 * pi) == 62.8 and r1(28 * pi) == 88.0
    assert r1(45 * pi) == 141.4
    assert r1(2160 * pi / 1000) == 6.8
    assert r1(70 * pi) == 219.9
    assert round(7.8 * 219.9 / 1000, 2) == 1.72
    assert r1(1000 / (25 * pi)) == 12.7
    assert 2 ** 2 * 2 == 8
    assert r1(pi * 0.7 * 1000 / 1000) == 2.2


Q.verify(check)
Q.save()
