#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 20 / KW 3 (LB 3): Kreisring, Kreis- und
Hohlzylinder darstellen, Mantel- und Oberflächeninhalt. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=20, slug='kreisring-zylinder', thema='Kreisring und Kreiszylinder', lb='LB 3',
        blurb='Kreisring, Netz und Ansichten des Zylinders, Mantel- und Oberflächeninhalt',
        comment='Values with the calculator key for pi, rounded at the end. Blocks: ring (1-3, 18), representing cylinders (4-5, 9-11, 19), lateral and total surface (6-8, 12-17, 20).')

# ------------------------------------------------------------ Kreisring ----
Q.q(r'Ein Kreisring hat den Außenradius 5 cm und den Innenradius 3 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'50,3 cm²', r'12,6 cm²', r'78,5 cm²', r'6,3 cm²'],
    [r'Großer Kreis minus kleiner Kreis: $A = \pi \cdot 5^2 - \pi \cdot 3^2$',
     r'$A = \pi \cdot (25 - 9) = 16\pi \approx 50{,}3$ cm²',
     r'12,6 cm² wäre $\pi \cdot (5 - 3)^2$, das ist falsch.'])

Q.q(r'Welche Formel gibt den Flächeninhalt eines Kreisrings mit Außenradius $r_a$ und Innenradius $r_i$ an?',
    [r'$A = \pi \cdot (r_a^2 - r_i^2)$', r'$A = \pi \cdot (r_a - r_i)^2$', r'$A = 2\pi \cdot (r_a - r_i)$', r'$A = \pi \cdot r_a^2 + \pi \cdot r_i^2$'],
    [r'Vom großen Kreis wird das Loch abgezogen: $\pi r_a^2 - \pi r_i^2$.',
     r'Ausklammern: $\pi \cdot (r_a^2 - r_i^2)$'])

Q.q(r'Eine Unterlegscheibe hat außen 2 cm und innen 0,8 cm Durchmesser. Wie groß ist ihre Fläche (gerundet)?',
    [r'2,64 cm²', r'3,77 cm²', r'1,13 cm²', r'10,56 cm²'],
    [r'Radien: 1 cm und 0,4 cm.',
     r'$A = \pi \cdot (1^2 - 0{,}4^2) = \pi \cdot 0{,}84 \approx 2{,}64$ cm²',
     r'10,56 cm² entsteht, wenn man die Durchmesser statt der Radien einsetzt.'])

# --------------------------------------------------------------- Darstellen ----
Q.q(r'Woraus besteht das Netz eines Kreiszylinders?',
    [r'aus zwei Kreisen und einem Rechteck', r'aus einem Kreis und einem Dreieck', r'aus zwei Rechtecken und einem Kreis', r'aus drei Kreisen'],
    [r'Grund- und Deckfläche sind zwei gleich große Kreise.',
     r'Der Mantel lässt sich zu einem Rechteck abrollen.'])

Q.q(r'Der Mantel eines Zylinders wird zu einem Rechteck abgerollt. Wie lang sind die Seiten des Rechtecks?',
    [r'Umfang der Grundfläche und Höhe', r'Radius und Höhe', r'Durchmesser und Höhe', r'Flächeninhalt der Grundfläche und Höhe'],
    [r'Eine Seite ist die Höhe $h$ des Zylinders.',
     r'Die andere Seite läuft einmal um den Grundkreis: $u = 2\pi r$.'])

Q.q(r'Ein Zylinder hat den Radius 4 cm und die Höhe 10 cm. Wie groß ist sein Mantelflächeninhalt (gerundet)?',
    [r'251,3 cm²', r'125,7 cm²', r'502,7 cm²', r'351,9 cm²'],
    [r'$A_M = 2\pi r \cdot h = 2\pi \cdot 4 \cdot 10$',
     r'$A_M = 80\pi \approx 251{,}3$ cm²'])

Q.q(r'Wie groß ist der Oberflächeninhalt des Zylinders aus der vorigen Aufgabe ($r = 4$ cm, $h = 10$ cm, gerundet)?',
    [r'351,9 cm²', r'301,6 cm²', r'251,3 cm²', r'402,1 cm²'],
    [r'$O = 2 \cdot A_G + A_M$',
     r'$2 \cdot \pi \cdot 16 = 32\pi$ und $A_M = 80\pi$',
     r'$O = 112\pi \approx 351{,}9$ cm²'])

Q.q(r'Ein Zylinder hat den Radius 3 cm. Wie groß ist seine Grundfläche (gerundet)?',
    [r'28,3 cm²', r'18,8 cm²', r'9,4 cm²', r'56,5 cm²'],
    [r'Die Grundfläche ist ein Kreis: $A_G = \pi r^2$',
     r'$A_G = 9\pi \approx 28{,}3$ cm²'])

Q.q(r'Ein Zylinder steht senkrecht auf dem Tisch. Wie sieht er von vorn und von oben aus?',
    [r'von vorn ein Rechteck, von oben ein Kreis', r'von vorn ein Kreis, von oben ein Rechteck',
     r'von vorn und von oben ein Kreis', r'von vorn ein Dreieck, von oben ein Kreis'],
    [r'Die Vorderansicht zeigt die Höhe und den Durchmesser: ein Rechteck.',
     r'Die Draufsicht zeigt die Deckfläche: einen Kreis.'])

Q.q(r'Wie erscheint der Grundkreis eines stehenden Zylinders in einer Schrägbildskizze?',
    [r'als Ellipse (flacher Kreis)', r'als Kreis', r'als Rechteck', r'als Strecke'],
    [r'Im Schrägbild sieht man auf die Grundfläche schräg von oben.',
     r'Der Kreis wird dabei gestaucht und erscheint als Ellipse.'])

Q.q(r'Welche Form haben die beiden Endflächen eines Rohrs (Hohlzylinder)?',
    [r'Kreisringe', r'Kreise', r'Rechtecke', r'Halbkreise'],
    [r'Ein Hohlzylinder ist ein Zylinder mit zylinderförmigem Loch.',
     r'Seine Grund- und Deckfläche sind Kreisringe.'])

Q.q(r'Eine Dose ohne Deckel hat den Radius 5 cm und die Höhe 12 cm. Wie viel Blech braucht man (gerundet)?',
    [r'455,5 cm²', r'534,1 cm²', r'377,0 cm²', r'942,5 cm²'],
    [r'Ohne Deckel: nur Boden und Mantel.',
     r'Boden: $25\pi$, Mantel: $2\pi \cdot 5 \cdot 12 = 120\pi$',
     r'Zusammen $145\pi \approx 455{,}5$ cm²'])

Q.q(r'Eine Dose hat 7,5 cm Durchmesser und ist 11 cm hoch. Wie groß ist das Etikett, das den Mantel genau bedeckt (gerundet)?',
    [r'259,2 cm²', r'518,4 cm²', r'82,5 cm²', r'303,4 cm²'],
    [r'$A_M = \pi \cdot d \cdot h = \pi \cdot 7{,}5 \cdot 11$',
     r'$A_M = 82{,}5\pi \approx 259{,}2$ cm²'])

Q.q(r'Ein Zylinder hat den Radius 3 cm. Wie breit muss das abgerollte Mantelrechteck sein (gerundet)?',
    [r'18,8 cm', r'9,4 cm', r'28,3 cm', r'6 cm'],
    [r'Die Breite ist der Umfang des Grundkreises.',
     r'$u = 2\pi \cdot 3 = 6\pi \approx 18{,}8$ cm'])

Q.q(r'Eine Litfaßsäule hat 1,2 m Durchmesser und ist 3 m hoch. Wie groß ist die Werbefläche am Mantel (gerundet)?',
    [r'11,3 m²', r'22,6 m²', r'3,4 m²', r'13,6 m²'],
    [r'$A_M = \pi \cdot d \cdot h = \pi \cdot 1{,}2 \cdot 3$',
     r'$A_M = 3{,}6\pi \approx 11{,}3$ m²'])

Q.q(r'Zylinder A hat $r = 2$ cm und $h = 6$ cm, Zylinder B hat $r = 3$ cm und $h = 4$ cm. Welcher hat den größeren Mantel?',
    [r'Beide Mäntel sind gleich groß.', r'A', r'B', r'Das hängt von $\pi$ ab.'],
    [r'A: $2\pi \cdot 2 \cdot 6 = 24\pi$',
     r'B: $2\pi \cdot 3 \cdot 4 = 24\pi$',
     r'Gleich groß; die Grundflächen sind aber verschieden.'])

Q.q(r'Welche Formel beschreibt den Oberflächeninhalt eines Zylinders?',
    [r'$O = 2\pi r \cdot (r + h)$', r'$O = \pi r^2 \cdot h$', r'$O = 2\pi r + h$', r'$O = \pi r \cdot (r + h)$'],
    [r'$O = 2\pi r^2 + 2\pi r h$',
     r'$2\pi r$ ausklammern: $O = 2\pi r \cdot (r + h)$',
     r'$\pi r^2 \cdot h$ ist das Volumen.'])

Q.q(r'Ein Kreisring ist 2 cm breit, sein Außenradius beträgt 10 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'113,1 cm²', r'12,6 cm²', r'314,2 cm²', r'201,1 cm²'],
    [r'Innenradius: $10 - 2 = 8$ cm',
     r'$A = \pi \cdot (100 - 64) = 36\pi \approx 113{,}1$ cm²'])

Q.q(r'Ein Rohr soll innen und außen gestrichen werden. Welche Flächen gehören dazu?',
    [r'Außenmantel, Innenmantel und die beiden Kreisringe an den Enden', r'nur der Außenmantel',
     r'zwei Kreise und ein Mantel', r'Außenmantel und die beiden ganzen Kreise an den Enden'],
    [r'Ein Hohlzylinder hat zwei Mäntel, einen außen und einen innen.',
     r'An den Enden sind die Ränder Kreisringe, keine ganzen Kreise.'])

Q.q(r'Ein Zylinder ist 8 cm hoch und hat einen Mantel von 150,8 cm². Wie groß ist sein Radius (gerundet)?',
    [r'3 cm', r'6 cm', r'9,4 cm', r'1,5 cm'],
    [r'$A_M = 2\pi r h$, also $r = \dfrac{A_M}{2\pi h}$',
     r'$r = \dfrac{150{,}8}{2\pi \cdot 8} = \dfrac{150{,}8}{50{,}27} \approx 3$ cm'])


def check():
    from math import pi
    r1 = lambda v: round(v, 1)
    assert r1(16 * pi) == 50.3 and r1(4 * pi) == 12.6
    assert round(pi * (1 - 0.16), 2) == 2.64 and round(pi * (4 - 0.64), 2) == 10.56
    assert r1(80 * pi) == 251.3
    assert r1(112 * pi) == 351.9
    assert r1(9 * pi) == 28.3
    assert r1(145 * pi) == 455.5 and r1(170 * pi) == 534.1
    assert r1(82.5 * pi) == 259.2
    assert r1(6 * pi) == 18.8
    assert r1(3.6 * pi) == 11.3
    assert 2 * 2 * 6 == 2 * 3 * 4 == 24
    assert r1(36 * pi) == 113.1
    assert round(150.8 / (2 * pi * 8), 1) == 3.0


Q.verify(check)
Q.save()
