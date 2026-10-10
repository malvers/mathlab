#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 14 / KW 49 (LB 2): Kreiskegel - Darstellung,
Mantellinie, Mantel als Kreisausschnitt, Oberfläche. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=14, slug='kegel', thema='Der Kreiskegel', lb='LB 2',
        blurb='Netz, Ansichten, Mantellinie s, Mantel π · r · s, Oberfläche, Winkel',
        comment='Values with the calculator key for pi, rounded. Blocks: representation (1, 8-9, 19), slant height (2-4, 17, 20), lateral and total surface (5-6, 10-11, 14, 16, 18), angles and sector (7, 12-13, 15).')

# ------------------------------------------------------------- Darstellung ----
Q.q(r'Woraus besteht das Netz eines Kreiskegels?',
    [r'aus einem Kreis und einem Kreisausschnitt', r'aus zwei Kreisen und einem Rechteck', r'aus einem Kreis und einem Dreieck', r'aus einem Kreisring'],
    [r'Die Grundfläche ist ein Kreis.',
     r'Der abgewickelte Mantel ist ein Kreisausschnitt mit dem Radius $s$.'])

Q.q(r'Ein Kegel hat $r = 3$ cm und $h = 4$ cm. Wie lang ist die Mantellinie $s$?',
    [r'5 cm', r'7 cm', r'2,65 cm', r'25 cm'],
    [r'Radius, Höhe und Mantellinie bilden ein rechtwinkliges Dreieck.',
     r'$s = \sqrt{9 + 16} = 5$ cm'])

Q.q(r'Ein Kegel hat $r = 6$ cm und $h = 8$ cm. Wie lang ist $s$?',
    [r'10 cm', r'14 cm', r'5,3 cm', r'100 cm'],
    [r'$s = \sqrt{36 + 64} = 10$ cm'])

Q.q(r'Ein Kegel hat $s = 13$ cm und $r = 5$ cm. Wie hoch ist er?',
    [r'12 cm', r'8 cm', r'13,9 cm', r'18 cm'],
    [r'$h = \sqrt{169 - 25} = \sqrt{144} = 12$ cm'])

Q.q(r'Ein Kegel hat $r = 3$ cm und $s = 5$ cm. Wie groß ist sein Mantel (gerundet)?',
    [r'47,12 cm²', r'94,25 cm²', r'28,27 cm²', r'15 cm²'],
    [r'$A_M = \pi \cdot r \cdot s = 15\pi$',
     r'$A_M \approx 47{,}12$ cm²'])

Q.q(r'Wie groß ist die Oberfläche dieses Kegels ($r = 3$ cm, $s = 5$ cm, gerundet)?',
    [r'75,40 cm²', r'47,12 cm²', r'56,55 cm²', r'103,67 cm²'],
    [r'$O = \pi r^2 + \pi r s = 9\pi + 15\pi = 24\pi$',
     r'$O \approx 75{,}40$ cm²'])

Q.q(r'Der Mantel dieses Kegels ($r = 3$ cm, $s = 5$ cm) wird abgewickelt. Wie groß ist der Mittelpunktswinkel des Kreisausschnitts?',
    [r'$216^\circ$', r'$108^\circ$', r'$300^\circ$', r'$180^\circ$'],
    [r'Der Bogen des Ausschnitts ist so lang wie der Grundkreis: $2\pi \cdot 3$.',
     r'Anteil am Vollkreis mit Radius 5: $\dfrac{3}{5}$, also $\dfrac{3}{5} \cdot 360^\circ = 216^\circ$.'])

Q.q(r'Wie erscheint der Grundkreis eines stehenden Kegels in der Schrägbildskizze?',
    [r'als Ellipse', r'als Kreis', r'als Rechteck', r'als Dreieck'],
    [r'Man sieht den Kreis schräg von oben, er wird gestaucht.'])

Q.q(r'Wie sehen Aufriss und Grundriss eines stehenden Kegels aus?',
    [r'Aufriss: gleichschenkliges Dreieck, Grundriss: Kreis mit Mittelpunkt', r'Aufriss: Kreis, Grundriss: Dreieck',
     r'Aufriss: Rechteck, Grundriss: Kreis', r'beide: Kreis'],
    [r'Von vorn sieht man den Durchmesser als Grundseite und die Spitze darüber.',
     r'Von oben sieht man den Grundkreis, die Spitze als Punkt in der Mitte.'])

# -------------------------------------------------------------- Sachbezug ----
Q.q(r'Eine Eiswaffel ist ein Kegel mit $r = 2{,}5$ cm und $s = 12$ cm. Wie viel Waffel braucht man für den Mantel (gerundet)?',
    [r'94,25 cm²', r'188,50 cm²', r'113,10 cm²', r'30 cm²'],
    [r'$A_M = \pi \cdot 2{,}5 \cdot 12 = 30\pi \approx 94{,}25$ cm²'])

Q.q(r'Ein Partyhut ist ein Kegel mit $r = 8$ cm und $h = 15$ cm. Wie viel Pappe braucht man für den Mantel (gerundet)?',
    [r'427,26 cm²', r'376,99 cm²', r'628,32 cm²', r'201,06 cm²'],
    [r'$s = \sqrt{64 + 225} = 17$ cm',
     r'$A_M = \pi \cdot 8 \cdot 17 = 136\pi \approx 427{,}26$ cm²'])

Q.q(r'Ein Kegel hat $r = 5$ cm und $h = 12$ cm. Wie groß ist der Öffnungswinkel an der Spitze (gerundet)?',
    [r'$45{,}24^\circ$', r'$22{,}62^\circ$', r'$134{,}76^\circ$', r'$67{,}38^\circ$'],
    [r'Halber Öffnungswinkel: $\tan \dfrac{\omega}{2} = \dfrac{5}{12}$, also $\dfrac{\omega}{2} \approx 22{,}62^\circ$.',
     r'$\omega \approx 45{,}24^\circ$'])

Q.q(r'Unter welchem Winkel ist die Mantellinie dieses Kegels ($r = 5$ cm, $h = 12$ cm) gegen die Grundfläche geneigt (gerundet)?',
    [r'$67{,}38^\circ$', r'$22{,}62^\circ$', r'$45{,}24^\circ$', r'$73{,}74^\circ$'],
    [r'$\tan \alpha = \dfrac{h}{r} = \dfrac{12}{5}$',
     r'$\alpha \approx 67{,}38^\circ$'])

Q.q(r'Ein Zirkuszelt hat ein Kegeldach mit 10 m Radius und 6 m Höhe. Wie viel Zeltstoff braucht das Dach (gerundet)?',
    [r'366,4 m²', r'188,5 m²', r'680,6 m²', r'314,2 m²'],
    [r'$s = \sqrt{100 + 36} = \sqrt{136} \approx 11{,}66$ m',
     r'$A_M = \pi \cdot 10 \cdot 11{,}66 \approx 366{,}4$ m²'])

Q.q(r'Aus einem Halbkreis mit 10 cm Radius wird ein Kegelmantel gebogen. Welchen Radius hat der Grundkreis?',
    [r'5 cm', r'10 cm', r'3,14 cm', r'2,5 cm'],
    [r'Der Halbkreisbogen ist $\dfrac{1}{2} \cdot 2\pi \cdot 10 = 10\pi$ lang.',
     r'Er wird zum Grundkreis: $2\pi r = 10\pi$, also $r = 5$ cm; die Mantellinie ist 10 cm.'])

Q.q(r'Warum gilt für den Kegelmantel $A_M = \pi \cdot r \cdot s$?',
    [r'Er ist ein Kreisausschnitt mit Radius $s$, dessen Bogen $2\pi r$ lang ist.', r'Er ist ein Rechteck mit den Seiten $r$ und $s$.',
     r'Er ist ein Dreieck mit Grundseite $r$ und Höhe $s$.', r'Weil $\pi \cdot r^2$ die Grundfläche ist.'],
    [r'Ein Ausschnitt hat denselben Anteil an Fläche wie an Bogen: $\dfrac{2\pi r}{2\pi s}$.',
     r'$A_M = \dfrac{r}{s} \cdot \pi s^2 = \pi r s$'])

Q.q(r'Ein Lampenschirm ist ein Kegel mit 10 cm Durchmesser und 13 cm Mantellinie. Wie hoch ist er?',
    [r'12 cm', r'8,3 cm', r'16,4 cm', r'3 cm'],
    [r'$r = 5$ cm',
     r'$h = \sqrt{169 - 25} = 12$ cm'])

Q.q(r'Ein Kegel hat 12 cm Durchmesser und 8 cm Höhe. Wie groß ist sein Mantel (gerundet)?',
    [r'188,50 cm²', r'301,59 cm²', r'377,0 cm²', r'150,80 cm²'],
    [r'$r = 6$ cm, $s = \sqrt{36 + 64} = 10$ cm',
     r'$A_M = 60\pi \approx 188{,}50$ cm²'])

Q.q(r'Welche Eigenschaft hat ein Kreiskegel nicht?',
    [r'zwei gleich große Grundflächen', r'eine Spitze', r'eine kreisförmige Grundfläche', r'einen gekrümmten Mantel'],
    [r'Zwei Grundflächen hat der Zylinder.',
     r'Der Kegel hat eine Grundfläche und eine Spitze.'])

Q.q(r'Ein Verkehrshütchen hat 15 cm Radius und ist 50 cm hoch. Wie lang ist seine Mantellinie (gerundet)?',
    [r'52,2 cm', r'65 cm', r'47,7 cm', r'35 cm'],
    [r'$s = \sqrt{225 + 2500} = \sqrt{2725} \approx 52{,}2$ cm'])


def check():
    from math import pi, sqrt, atan, degrees as d
    R = lambda v, n=2: round(v, n)
    assert sqrt(9 + 16) == 5 and sqrt(36 + 64) == 10 and sqrt(169 - 25) == 12
    assert R(15 * pi) == 47.12 and R(24 * pi) == 75.40 and 3 / 5 * 360 == 216
    assert R(30 * pi) == 94.25 and sqrt(64 + 225) == 17 and R(136 * pi) == 427.26
    assert R(2 * d(atan(5 / 12))) == 45.24 and R(d(atan(12 / 5))) == 67.38
    assert R(pi * 10 * sqrt(136), 1) == 366.4
    assert 10 * pi / (2 * pi) == 5 and R(60 * pi) == 188.50 and R(sqrt(2725), 1) == 52.2


Q.verify(check)
Q.save()
