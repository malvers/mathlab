#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 23 / KW 8 (LB 4): Körper darstellen und berechnen –
Prisma, Zylinder, Pyramide, Kegel, Kugel, zusammengesetzte Körper. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=23, slug='koerper', thema='Körper darstellen und berechnen', lb='LB 4',
         blurb='Volumen und Oberfläche von Prisma, Zylinder, Pyramide, Kegel und Kugel, zusammengesetzte Körper, Masse',
         comment='Blocks: prisms and cylinders (1-5, 12-13), pyramids and cones (6-8, 14, 17-18), spheres (9-10, 19), composite bodies, mass, litres (11, 15-16, 20). Results rounded to one decimal.')

Q.q(r'Ein Quader ist 5 cm lang, 4 cm breit und 3 cm hoch. Wie groß ist sein Volumen?',
    [r'60 cm³', r'12 cm³', r'94 cm³', r'47 cm³'],
    [r'$V = a \cdot b \cdot c = 5 \cdot 4 \cdot 3 = 60$ cm³'])

Q.q(r'Ein Würfel hat die Kantenlänge 4 cm. Wie groß ist seine Oberfläche?',
    [r'96 cm²', r'64 cm²', r'16 cm²', r'48 cm²'],
    [r'Sechs Quadrate mit je $4 \cdot 4 = 16$ cm².', r'$O = 6 \cdot 16 = 96$ cm²'])

Q.q(r'Ein Prisma hat ein Dreieck als Grundfläche (Grundseite 6 cm, Höhe 4 cm) und ist 10 cm hoch. Wie groß ist sein Volumen?',
    [r'120 cm³', r'240 cm³', r'80 cm³', r'40 cm³'],
    [r'Grundfläche: $G = \dfrac{6 \cdot 4}{2} = 12$ cm².', r'$V = G \cdot h_K = 12 \cdot 10 = 120$ cm³'])

Q.q(r'Ein Zylinder hat den Radius 3 cm und die Höhe 10 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'282,7 cm³', r'94,2 cm³', r'188,5 cm³', r'900 cm³'],
    [r'$V = \pi r^2 h = \pi \cdot 9 \cdot 10 = 90\pi \approx 282{,}7$ cm³'])

Q.q(r'Wie groß ist die Mantelfläche dieses Zylinders ($r = 3$ cm, $h = 10$ cm, gerundet)?',
    [r'188,5 cm²', r'94,2 cm²', r'282,7 cm²', r'245,0 cm²'],
    [r'Der Mantel ist abgewickelt ein Rechteck: Umfang mal Höhe.', r'$M = 2\pi r h = 2\pi \cdot 3 \cdot 10 = 60\pi \approx 188{,}5$ cm²'])

Q.q(r'Eine Pyramide hat eine quadratische Grundfläche mit $a = 6$ cm und die Höhe 8 cm. Wie groß ist ihr Volumen?',
    [r'96 cm³', r'288 cm³', r'144 cm³', r'48 cm³'],
    [r'$V = \dfrac{1}{3} \cdot G \cdot h = \dfrac{1}{3} \cdot 36 \cdot 8 = 96$ cm³', r'Ohne den Faktor $\dfrac{1}{3}$ wäre es das Volumen des Quaders: 288 cm³.'])

Q.q(r'Ein Kegel hat den Radius 3 cm und die Höhe 4 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'37,7 cm³', r'113,1 cm³', r'12,6 cm³', r'50,3 cm³'],
    [r'$V = \dfrac{1}{3} \pi r^2 h = \dfrac{1}{3} \cdot \pi \cdot 9 \cdot 4 = 12\pi \approx 37{,}7$ cm³'])

Q.q(r'Wie groß ist die Mantelfläche dieses Kegels ($r = 3$ cm, $h = 4$ cm, gerundet)?',
    [r'47,1 cm²', r'37,7 cm²', r'75,4 cm²', r'28,3 cm²'],
    [r'Mantellinie mit Pythagoras: $s = \sqrt{3^2 + 4^2} = 5$ cm.', r'$M = \pi r s = \pi \cdot 3 \cdot 5 = 15\pi \approx 47{,}1$ cm²'])

Q.q(r'Eine Kugel hat den Radius 5 cm. Wie groß ist ihr Volumen (gerundet)?',
    [r'523,6 cm³', r'314,2 cm³', r'392,7 cm³', r'166,7 cm³'],
    [r'$V = \dfrac{4}{3} \pi r^3 = \dfrac{4}{3} \cdot \pi \cdot 125 \approx 523{,}6$ cm³'])

Q.q(r'Wie groß ist die Oberfläche dieser Kugel ($r = 5$ cm, gerundet)?',
    [r'314,2 cm²', r'78,5 cm²', r'523,6 cm²', r'157,1 cm²'],
    [r'$O = 4 \pi r^2 = 4 \cdot \pi \cdot 25 = 100\pi \approx 314{,}2$ cm²'])

Q.q(r'Auf einem Würfel mit 6 cm Kantenlänge sitzt eine Pyramide mit derselben Grundfläche und der Höhe 4 cm. Wie groß ist das Gesamtvolumen?',
    [r'264 cm³', r'360 cm³', r'216 cm³', r'48 cm³'],
    [r'Würfel: $6^3 = 216$ cm³.', r'Pyramide: $\dfrac{1}{3} \cdot 36 \cdot 4 = 48$ cm³.', r'Zusammen: $216 + 48 = 264$ cm³ (Zerlegungsprinzip).'])

Q.q(r'Ein Rohr (Hohlzylinder) hat den Außenradius 5 cm, den Innenradius 3 cm und die Länge 10 cm. Wie groß ist das Materialvolumen (gerundet)?',
    [r'502,7 cm³', r'785,4 cm³', r'125,7 cm³', r'62,8 cm³'],
    [r'Großer minus kleiner Zylinder: $V = \pi (5^2 - 3^2) \cdot 10 = 160\pi \approx 502{,}7$ cm³', r'Nicht $\pi \cdot (5 - 3)^2 \cdot 10$ rechnen – die Radien werden einzeln quadriert.'])

Q.q(r'Zu welchem Körper gehört ein Netz aus zwei Kreisen und einem Rechteck?',
    [r'Zylinder', r'Kegel', r'Kugel', r'Prisma mit dreieckiger Grundfläche'],
    [r'Die Kreise sind Grund- und Deckfläche, das Rechteck ist der abgewickelte Mantel.'])

Q.q(r'Ein Kegel und ein Zylinder haben dieselbe Grundfläche und dieselbe Höhe. Wie verhalten sich ihre Volumina?',
    [r'Der Kegel hat ein Drittel des Zylindervolumens.', r'Beide sind gleich groß.',
     r'Der Kegel hat die Hälfte des Zylindervolumens.', r'Der Kegel hat zwei Drittel des Zylindervolumens.'],
    [r'$V_{\text{Kegel}} = \dfrac{1}{3} G h$, $V_{\text{Zylinder}} = G h$', r'Man kann einen Zylinder mit drei Kegelfüllungen Wasser füllen.'])

Q.q(r'Ein Stahlwürfel hat die Kantenlänge 5 cm, Stahl hat die Dichte 7,85 g/cm³. Wie schwer ist der Würfel (gerundet)?',
    [r'981 g', r'39 g', r'196 g', r'125 g'],
    [r'$V = 5^3 = 125$ cm³', r'$m = V \cdot \rho = 125 \cdot 7{,}85 \approx 981$ g'])

Q.q(r'Ein Aquarium ist innen 80 cm lang, 40 cm breit und 50 cm hoch. Wie viele Liter passen hinein?',
    [r'160 l', r'1600 l', r'16 l', r'170 l'],
    [r'$V = 80 \cdot 40 \cdot 50 = 160\,000$ cm³', r'$1$ l $= 1$ dm³ $= 1000$ cm³, also 160 l.'])

Q.q(r'Eine quadratische Pyramide hat die Grundkante 6 cm und die Seitenhöhe (Höhe einer Dreiecksfläche) 5 cm. Wie hoch ist die Pyramide?',
    [r'4 cm', r'5 cm', r'5,8 cm', r'3 cm'],
    [r'Rechtwinkliges Dreieck aus Körperhöhe, halber Grundkante (3 cm) und Seitenhöhe (Hypotenuse).', r'$h = \sqrt{5^2 - 3^2} = 4$ cm'])

Q.q(r'Wie groß ist die Oberfläche dieser Pyramide (Grundkante 6 cm, Seitenhöhe 5 cm)?',
    [r'96 cm²', r'66 cm²', r'156 cm²', r'60 cm²'],
    [r'Grundfläche: $36$ cm². Vier Dreiecke: $4 \cdot \dfrac{6 \cdot 5}{2} = 60$ cm².', r'$O = 36 + 60 = 96$ cm²'])

Q.q(r'Eine Kugel hat den Durchmesser 12 cm. Wie groß ist ihr Volumen (gerundet)?',
    [r'904,8 cm³', r'7238,2 cm³', r'452,4 cm³', r'113,1 cm³'],
    [r'Radius $= 6$ cm.', r'$V = \dfrac{4}{3} \pi \cdot 6^3 = 288\pi \approx 904{,}8$ cm³', r'Wer mit dem Durchmesser rechnet, bekommt das Achtfache: 7238,2 cm³.'])

Q.q(r'Eine zylinderförmige Dose soll genau 1 l fassen und hat den Radius 5 cm. Wie hoch muss sie sein (gerundet)?',
    [r'12,7 cm', r'6,4 cm', r'20 cm', r'40 cm'],
    [r'1 l $= 1000$ cm³, Grundfläche $\pi \cdot 25 \approx 78{,}54$ cm².', r'$h = \dfrac{1000}{78{,}54} \approx 12{,}7$ cm'])


def check():
    from math import pi, sqrt
    R = lambda x, n=1: round(x, n)
    assert 5 * 4 * 3 == 60 and 6 * 16 == 96 and 6 * 4 / 2 * 10 == 120
    assert R(90 * pi) == 282.7 and R(60 * pi) == 188.5 and R(30 * pi) == 94.2
    assert 36 * 8 / 3 == 96 and R(12 * pi) == 37.7 and sqrt(9 + 16) == 5 and R(15 * pi) == 47.1
    assert R(4 / 3 * pi * 125) == 523.6 and R(100 * pi) == 314.2
    assert 216 + 36 * 4 / 3 == 264 and R(160 * pi) == 502.7 and R(250 * pi) == 785.4
    assert R(125 * 7.85, 0) == 981 and 80 * 40 * 50 == 160000 and sqrt(25 - 9) == 4 and 36 + 4 * 15 == 96
    assert R(4 / 3 * pi * 216) == 904.8 and R(4 / 3 * pi * 1728) == 7238.2 and R(1000 / (25 * pi)) == 12.7


Q.verify(check)
Q.save()
