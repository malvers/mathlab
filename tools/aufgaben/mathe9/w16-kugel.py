#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 16 / KW 51 (LB 2): Oberfläche und Volumen der
Kugel, Kubikwurzel. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=16, slug='kugel', thema='Die Kugel', lb='LB 2',
        blurb='O = 4 · π · r², V = 4/3 · π · r³, Kubikwurzel, Halbkugel, Kugeln im Alltag',
        comment='Values with the calculator key for pi, rounded. Blocks: surface (1, 4-5, 9, 17), volume (2-3, 10, 13-14, 19), cube root (6-8), mass (11-12), comparisons (15-16, 18, 20). Problem 15 after Archimedes, On the Sphere and Cylinder.')

# ---------------------------------------------------------------- Formeln ----
Q.q(r'Wie groß ist die Oberfläche einer Kugel mit $r = 5$ cm (gerundet)?',
    [r'314,16 cm²', r'78,54 cm²', r'523,60 cm²', r'100 cm²'],
    [r'$O = 4\pi r^2 = 4\pi \cdot 25 = 100\pi$',
     r'$O \approx 314{,}16$ cm²'])

Q.q(r'Wie groß ist das Volumen einer Kugel mit $r = 3$ cm (gerundet)?',
    [r'113,10 cm³', r'37,70 cm³', r'84,82 cm³', r'36 cm³'],
    [r'$V = \dfrac{4}{3}\pi r^3 = \dfrac{4}{3}\pi \cdot 27 = 36\pi$',
     r'$V \approx 113{,}10$ cm³'])

Q.q(r'Eine Kugel hat 10 cm Durchmesser. Wie groß ist ihr Volumen (gerundet)?',
    [r'523,60 cm³', r'4188,79 cm³', r'314,16 cm³', r'130,90 cm³'],
    [r'$r = 5$ cm',
     r'$V = \dfrac{4}{3}\pi \cdot 125 \approx 523{,}60$ cm³; mit $d$ statt $r$ käme das Achtfache heraus.'])

Q.q(r'Ein Fußball hat etwa 22 cm Durchmesser. Wie groß ist seine Oberfläche (gerundet)?',
    [r'1520,5 cm²', r'6082,1 cm²', r'380,1 cm²', r'5575,3 cm²'],
    [r'$r = 11$ cm',
     r'$O = 4\pi \cdot 121 = 484\pi \approx 1520{,}5$ cm²'])

Q.q(r'Die Erde hat einen mittleren Radius von etwa 6370 km. Wie groß ist ihre Oberfläche ungefähr?',
    [r'etwa 510 Millionen km²', r'etwa 127 Millionen km²', r'etwa 1 Billion km²', r'etwa 40 000 km²'],
    [r'$O = 4\pi \cdot 6370^2 \approx 509\,900\,000$ km²',
     r'Davon sind etwa 71 % Wasser.'])

# ------------------------------------------------------------ Kubikwurzel ----
Q.q(r'Eine Kugel soll das Volumen 1000 cm³ haben. Wie groß ist ihr Radius (gerundet)?',
    [r'6,20 cm', r'15,45 cm', r'8,92 cm', r'238,73 cm'],
    [r'$r^3 = \dfrac{3V}{4\pi} = \dfrac{3000}{4\pi} \approx 238{,}73$',
     r'$r = \sqrt[3]{238{,}73} \approx 6{,}20$ cm'])

Q.q(r'Wie groß ist $\sqrt[3]{27}$?',
    [r'3', r'9', r'5,2', r'13,5'],
    [r'Gesucht ist die Zahl, deren dritte Potenz 27 ist.',
     r'$3 \cdot 3 \cdot 3 = 27$'])

Q.q(r'Wie groß ist $\sqrt[3]{125}$?',
    [r'5', r'11,2', r'25', r'41,7'],
    [r'$5^3 = 125$'])

Q.q(r'Eine Kugel hat die Oberfläche $100\pi$ cm². Wie groß ist ihr Radius?',
    [r'5 cm', r'10 cm', r'25 cm', r'2,5 cm'],
    [r'$4\pi r^2 = 100\pi$, also $r^2 = 25$.',
     r'$r = 5$ cm'])

Q.q(r'Der Radius einer Kugel wird verdoppelt. Wie ändert sich ihr Volumen?',
    [r'Es wird 8-mal so groß.', r'Es wird 4-mal so groß.', r'Es wird doppelt so groß.', r'Es wird 6-mal so groß.'],
    [r'$r$ steht in der dritten Potenz: $(2r)^3 = 8r^3$.'])

# ------------------------------------------------------------------ Masse ----
Q.q(r'Eine Glasmurmel hat 1,6 cm Durchmesser, Glas hat die Dichte 2,5 g/cm³. Wie schwer ist sie (gerundet)?',
    [r'5,36 g', r'42,9 g', r'2,14 g', r'10,72 g'],
    [r'$V = \dfrac{4}{3}\pi \cdot 0{,}8^3 \approx 2{,}145$ cm³',
     r'$m = 2{,}5 \cdot 2{,}145 \approx 5{,}36$ g'])

Q.q(r'Eine Eisenkugel hat 5 cm Radius, Eisen hat die Dichte 7,8 g/cm³. Wie schwer ist sie (gerundet)?',
    [r'4,08 kg', r'2,45 kg', r'32,7 kg', r'0,52 kg'],
    [r'$V = \dfrac{4}{3}\pi \cdot 125 \approx 523{,}6$ cm³',
     r'$m = 7{,}8 \cdot 523{,}6 \approx 4084$ g, also etwa 4,08 kg.'])

Q.q(r'Wie groß ist das Volumen einer Halbkugel mit $r = 6$ cm (gerundet)?',
    [r'452,39 cm³', r'904,78 cm³', r'226,19 cm³', r'150,80 cm³'],
    [r'Halbe Kugel: $\dfrac{1}{2} \cdot \dfrac{4}{3}\pi \cdot 216 = 144\pi$',
     r'$V \approx 452{,}39$ cm³'])

Q.q(r'Wie groß ist die gesamte Oberfläche einer massiven Halbkugel mit $r = 6$ cm (gerundet)?',
    [r'339,29 cm²', r'226,19 cm²', r'452,39 cm²', r'113,10 cm²'],
    [r'Gewölbte Fläche: $\dfrac{1}{2} \cdot 4\pi r^2 = 2\pi r^2$, dazu der ebene Kreis $\pi r^2$.',
     r'$O = 3\pi \cdot 36 = 108\pi \approx 339{,}29$ cm²'])

Q.q(r'Archimedes zeigte: Eine Kugel und der Zylinder, der sie genau umschließt, haben ein festes Volumenverhältnis. Welches?',
    [r'2 : 3', r'1 : 3', r'1 : 2', r'3 : 4'],
    [r'Zylinder: $\pi r^2 \cdot 2r = 2\pi r^3$, Kugel: $\dfrac{4}{3}\pi r^3$.',
     r'$\dfrac{4}{3} : 2 = 2 : 3$. Quelle: Archimedes, Über Kugel und Zylinder; die Figur soll auf seinem Grabstein gestanden haben.'])

Q.q(r'Eine Kugel liegt genau in einem Würfel mit 10 cm Kantenlänge. Wie viel Prozent des Würfels füllt sie (gerundet)?',
    [r'52,4 %', r'78,5 %', r'66,7 %', r'33,3 %'],
    [r'Kugel mit $r = 5$ cm: $V \approx 523{,}6$ cm³; Würfel: 1000 cm³.',
     r'Anteil: $\dfrac{523{,}6}{1000} \approx 52{,}4$ %'])

Q.q(r'Eine Christbaumkugel hat 8 cm Durchmesser. Wie viel Fläche wird bemalt (gerundet)?',
    [r'201,06 cm²', r'50,27 cm²', r'268,08 cm²', r'804,25 cm²'],
    [r'$r = 4$ cm',
     r'$O = 4\pi \cdot 16 = 64\pi \approx 201{,}06$ cm²'])

Q.q(r'Drei Tennisbälle liegen genau übereinander in einer zylinderförmigen Dose. Welcher Anteil der Dose ist mit Bällen gefüllt?',
    [r'zwei Drittel', r'die Hälfte', r'drei Viertel', r'ein Drittel'],
    [r'Ballradius $r$: Dose mit Radius $r$ und Höhe $6r$, also $6\pi r^3$.',
     r'Drei Bälle: $3 \cdot \dfrac{4}{3}\pi r^3 = 4\pi r^3$, Anteil $\dfrac{4}{6} = \dfrac{2}{3}$.'])

Q.q(r'Ein Ball wird von 10 cm auf 11 cm Radius aufgepumpt. Um wie viel Prozent wächst sein Volumen (gerundet)?',
    [r'um 33,1 %', r'um 10 %', r'um 21 %', r'um 3,3 %'],
    [r'$\left(\dfrac{11}{10}\right)^3 = 1{,}331$',
     r'Zunahme: 33,1 %'])

Q.q(r'Die Erde hat etwa 6371 km Radius, der Mond etwa 1737 km. Wie viele Monde würden ungefähr in die Erde passen (nach Volumen)?',
    [r'etwa 49', r'etwa 4', r'etwa 13', r'etwa 1000'],
    [r'Volumen wachsen mit der dritten Potenz des Radius.',
     r'$\left(\dfrac{6371}{1737}\right)^3 \approx 3{,}67^3 \approx 49$'])


def check():
    from math import pi
    R = lambda v, n=2: round(v, n)
    S = lambda r: 4 * pi * r * r
    V = lambda r: 4 / 3 * pi * r ** 3
    assert R(S(5)) == 314.16 and R(V(3)) == 113.10 and R(V(5)) == 523.60 and R(S(11), 1) == 1520.5
    assert round(S(6370) / 1e6) == 510
    assert R((3000 / (4 * pi)) ** (1 / 3)) == 6.20 and round(27 ** (1 / 3), 9) == 3 and round(125 ** (1 / 3), 9) == 5
    assert R(2.5 * V(0.8)) == 5.36 and R(7.8 * V(5) / 1000) == 4.08
    assert R(V(6) / 2) == 452.39 and R(3 * pi * 36) == 339.29
    assert R(V(1) / (pi * 2), 6) == R(2 / 3, 6)
    assert R(V(5) / 10, 1) == 52.4 and R(S(4)) == 201.06
    assert R(3 * V(1) / (6 * pi), 6) == R(2 / 3, 6) and R(1.1 ** 3, 3) == 1.331
    assert round((6371 / 1737) ** 3) == 49


Q.verify(check)
Q.save()
