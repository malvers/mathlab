#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 15 / KW 50 (LB 2): Volumen und Masse von
Kegel und Pyramide, Höhe und Radius berechnen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=15, slug='kegel-pyramide-volumen', thema='Volumen und Masse von Kegel und Pyramide', lb='LB 2',
        blurb='V = ⅓ · π · r² · h, Masse mit der Dichte, Höhe und Radius berechnen, Füllhöhen',
        comment='Values with the calculator key for pi, rounded. Blocks: cone volume (1-4, 10-11, 16), scaling (3, 12-13, 15), mass (5, 8-9, 18), solving for h and r (6-7), pyramid (14, 17, 19-20).')

# ------------------------------------------------------------ Kegelvolumen ----
Q.q(r'Ein Kegel hat $r = 3$ cm und $h = 4$ cm. Wie groß ist sein Volumen (gerundet)?',
    [r'37,70 cm³', r'113,10 cm³', r'12,57 cm³', r'47,12 cm³'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 9 \cdot 4 = 12\pi \approx 37{,}70$ cm³'])

Q.q(r'Ein Kegel hat $r = 6$ cm und $h = 10$ cm. Wie groß ist sein Volumen (gerundet)?',
    [r'377,0 cm³', r'1131,0 cm³', r'125,7 cm³', r'188,5 cm³'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 36 \cdot 10 = 120\pi \approx 377{,}0$ cm³'])

Q.q(r'Ein Kegel und ein Zylinder haben denselben Radius und dieselbe Höhe. Welcher Anteil des Zylindervolumens ist der Kegel?',
    [r'ein Drittel', r'die Hälfte', r'zwei Drittel', r'ein Viertel'],
    [r'Zylinder: $\pi r^2 h$, Kegel: $\dfrac{1}{3}\pi r^2 h$.',
     r'Wie bei Prisma und Pyramide.'])

Q.q(r'Eine Eiswaffel ist innen ein Kegel mit $r = 2{,}5$ cm und $h = 11$ cm. Wie viel Eis passt hinein, wenn sie bis zum Rand gefüllt wird (gerundet)?',
    [r'72,0 cm³', r'216,0 cm³', r'28,8 cm³', r'86,4 cm³'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 6{,}25 \cdot 11 \approx 72{,}0$ cm³'])

Q.q(r'Ein Sandhaufen ist ein Kegel mit 2 m Radius und 1,5 m Höhe. 1 m³ Sand wiegt 1,5 t. Wie schwer ist der Haufen (gerundet)?',
    [r'9,42 t', r'28,27 t', r'6,28 t', r'4,19 t'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 4 \cdot 1{,}5 = 2\pi \approx 6{,}28$ m³',
     r'$m = 1{,}5 \cdot 6{,}28 \approx 9{,}42$ t'])

Q.q(r'Ein Kegel mit $r = 4$ cm soll 100 cm³ fassen. Wie hoch muss er sein (gerundet)?',
    [r'5,97 cm', r'1,99 cm', r'18,75 cm', r'6,25 cm'],
    [r'$h = \dfrac{3V}{\pi r^2} = \dfrac{300}{16\pi}$',
     r'$h \approx 5{,}97$ cm'])

Q.q(r'Ein 6 cm hoher Kegel soll 200 cm³ fassen. Welchen Radius braucht er (gerundet)?',
    [r'5,64 cm', r'3,26 cm', r'31,83 cm', r'10,61 cm'],
    [r'$r^2 = \dfrac{3V}{\pi h} = \dfrac{600}{6\pi} \approx 31{,}83$',
     r'$r = \sqrt{31{,}83} \approx 5{,}64$ cm'])

Q.q(r'Ein Messingkegel hat $r = 2$ cm und $h = 6$ cm. Messing hat die Dichte 8,5 g/cm³. Wie schwer ist er (gerundet)?',
    [r'213,6 g', r'640,9 g', r'25,1 g', r'106,8 g'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 4 \cdot 6 = 8\pi \approx 25{,}13$ cm³',
     r'$m = 8{,}5 \cdot 25{,}13 \approx 213{,}6$ g'])

Q.q(r'Eine quadratische Granitpyramide hat $a = 0{,}5$ m und $h = 0{,}8$ m. Granit hat die Dichte 2,7 t/m³. Wie schwer ist sie?',
    [r'180 kg', r'540 kg', r'67 kg', r'1,08 t'],
    [r'$V = \dfrac{1}{3} \cdot 0{,}25 \cdot 0{,}8 \approx 0{,}0667$ m³',
     r'$m = 2{,}7 \cdot 0{,}0667 = 0{,}18$ t = 180 kg'])

Q.q(r'Ein kegelförmiger Trichter hat innen $r = 5$ cm und $h = 10$ cm. Wie viel Wasser fasst er (gerundet)?',
    [r'261,8 cm³', r'785,4 cm³', r'523,6 cm³', r'83,3 cm³'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 25 \cdot 10 \approx 261{,}8$ cm³'])

Q.q(r'Ein Kegel hat $s = 10$ cm und $r = 6$ cm. Wie groß ist sein Volumen (gerundet)?',
    [r'301,6 cm³', r'377,0 cm³', r'904,8 cm³', r'226,2 cm³'],
    [r'Erst die Höhe: $h = \sqrt{100 - 36} = 8$ cm.',
     r'$V = \dfrac{1}{3} \cdot \pi \cdot 36 \cdot 8 = 96\pi \approx 301{,}6$ cm³'])

Q.q(r'Die Höhe eines Kegels wird halbiert, der Radius bleibt gleich. Wie ändert sich das Volumen?',
    [r'Es wird halb so groß.', r'Es wird ein Viertel.', r'Es wird ein Achtel.', r'Es bleibt gleich.'],
    [r'$V$ ist bei festem Radius proportional zur Höhe.'])

Q.q(r'Der Radius eines Kegels wird verdoppelt, die Höhe bleibt gleich. Wie ändert sich das Volumen?',
    [r'Es wird 4-mal so groß.', r'Es wird doppelt so groß.', r'Es wird 8-mal so groß.', r'Es wird 6-mal so groß.'],
    [r'Der Radius steht im Quadrat: $(2r)^2 = 4r^2$.'])

Q.q(r'Was haben die Volumenformeln von Pyramide und Kegel gemeinsam?',
    [r'Beide sind ein Drittel von Grundfläche mal Höhe.', r'Beide enthalten $\pi$.',
     r'Beide sind die Hälfte von Grundfläche mal Höhe.', r'Beide brauchen die Seitenhöhe.'],
    [r'$V = \dfrac{1}{3} \cdot A_G \cdot h$ gilt für alle „Spitzkörper“.',
     r'Beim Kegel ist $A_G = \pi r^2$.'])

Q.q(r'Ein kegelförmiges Glas (Spitze unten) hat innen $r = 4$ cm und $h = 9$ cm. Es wird bis zur halben Höhe gefüllt. Wie viel ist darin (gerundet)?',
    [r'18,85 cm³', r'75,40 cm³', r'37,70 cm³', r'150,80 cm³'],
    [r'Volles Glas: $\dfrac{1}{3} \cdot \pi \cdot 16 \cdot 9 = 48\pi \approx 150{,}80$ cm³',
     r'Die Füllung ist ein ähnlicher Kegel mit $k = \dfrac{1}{2}$, also $\dfrac{1}{8}$ des Volumens.',
     r'$150{,}80 : 8 \approx 18{,}85$ cm³; das halbe Glas ist also bei Weitem nicht halb voll.'])

Q.q(r'Ein Turm hat ein Kegeldach mit $r = 3$ m und $h = 4$ m. Wie groß ist der Raum unter dem Dach (gerundet)?',
    [r'37,7 m³', r'113,1 m³', r'47,1 m³', r'12,6 m³'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 9 \cdot 4 = 12\pi \approx 37{,}7$ m³'])

Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $h = 8$ cm. Wie groß ist ihr Volumen?',
    [r'96 cm³', r'288 cm³', r'48 cm³', r'128 cm³'],
    [r'$V = \dfrac{1}{3} \cdot 36 \cdot 8 = 96$ cm³'])

Q.q(r'Ein Holzkegel hat $r = 10$ cm und $h = 30$ cm. Das Holz hat die Dichte 0,6 g/cm³. Wie schwer ist der Kegel (gerundet)?',
    [r'1,88 kg', r'5,65 kg', r'3,14 kg', r'0,63 kg'],
    [r'$V = \dfrac{1}{3} \cdot \pi \cdot 100 \cdot 30 = 1000\pi \approx 3141{,}6$ cm³',
     r'$m = 0{,}6 \cdot 3141{,}6 \approx 1885$ g, also etwa 1,88 kg.'])

Q.q(r'Wie viele Liter sind 1 dm³ und wie viele cm³ ist ein Liter?',
    [r'1 dm³ = 1 l = 1000 cm³', r'1 dm³ = 10 l = 100 cm³', r'1 dm³ = 1 l = 100 cm³', r'1 dm³ = 1000 l = 1 cm³'],
    [r'1 dm = 10 cm, also 1 dm³ = $10 \cdot 10 \cdot 10 = 1000$ cm³ = 1 l.'])

Q.q(r'Was hat mehr Volumen: ein Kegel mit $r = 3$ cm und $h = 6$ cm oder eine quadratische Pyramide mit $a = 5$ cm und $h = 6$ cm?',
    [r'der Kegel mit etwa 56,5 cm³', r'die Pyramide mit 50 cm³', r'beide gleich', r'die Pyramide mit 150 cm³'],
    [r'Kegel: $\dfrac{1}{3} \cdot \pi \cdot 9 \cdot 6 = 18\pi \approx 56{,}5$ cm³',
     r'Pyramide: $\dfrac{1}{3} \cdot 25 \cdot 6 = 50$ cm³'])


def check():
    from math import pi, sqrt
    R = lambda v, n=2: round(v, n)
    cone = lambda r, h: pi * r * r * h / 3
    assert R(cone(3, 4)) == 37.70 and R(cone(6, 10), 1) == 377.0 and R(cone(2.5, 11), 1) == 72.0
    assert R(1.5 * cone(2, 1.5)) == 9.42 and R(300 / (16 * pi)) == 5.97 and R(sqrt(600 / (6 * pi))) == 5.64
    assert R(8.5 * cone(2, 6), 1) == 213.6 and R(2.7 * 0.25 * 0.8 / 3 * 1000) == 180
    assert R(cone(5, 10), 1) == 261.8 and sqrt(100 - 36) == 8 and R(cone(6, 8), 1) == 301.6
    assert R(cone(4, 9) / 8) == 18.85 and R(cone(3, 4), 1) == 37.7 and 36 * 8 / 3 == 96
    assert R(0.6 * cone(10, 30) / 1000) == 1.88 and R(cone(3, 6), 1) == 56.5 and 25 * 6 / 3 == 50


Q.verify(check)
Q.save()
