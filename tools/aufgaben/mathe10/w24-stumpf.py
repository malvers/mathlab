#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 24 / KW 9 (LB 4): Pyramidenstumpf und Kegelstumpf –
Formeln herleiten, Volumen, Mantel, Masse, Herstellungskosten. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=24, slug='stumpf', thema='Pyramidenstumpf und Kegelstumpf', lb='LB 4',
         blurb='Stumpf als Differenz zweier Körper, Volumen- und Mantelformeln, Werkstücke, Masse und Kosten',
         comment='Blocks: idea and derivation (1-2, 13, 16-17, 20), cone frustum (3-4, 6-9, 12, 18), pyramid frustum (5, 14-15), mass, cost and profit (10-11, 19). Results rounded to one decimal.')

Q.q(r'Was ist ein Pyramidenstumpf?',
    [r'eine Pyramide, von der die Spitze parallel zur Grundfläche abgeschnitten wurde', r'eine Pyramide mit dreieckiger Grundfläche',
     r'eine besonders flache Pyramide', r'zwei aufeinandergestellte Pyramiden'],
    [r'Grund- und Deckfläche sind dann parallel und ähnlich zueinander, die Seitenflächen sind Trapeze.'])

Q.q(r'Eine Pyramide mit quadratischer Grundfläche ($a = 6$ cm, $h = 8$ cm) wird auf halber Höhe parallel zur Grundfläche durchgeschnitten. Wie groß ist das Volumen des Stumpfes?',
    [r'84 cm³', r'48 cm³', r'96 cm³', r'72 cm³'],
    [r'Ganze Pyramide: $\dfrac{1}{3} \cdot 36 \cdot 8 = 96$ cm³.', r'Abgeschnittene Spitze: Kante 3 cm, Höhe 4 cm, also $\dfrac{1}{3} \cdot 9 \cdot 4 = 12$ cm³.',
     r'Stumpf: $96 - 12 = 84$ cm³ – nicht die Hälfte, denn die Spitze ist viel kleiner.'])

Q.q(r'Wie lautet die Volumenformel des Kegelstumpfs mit den Radien $R$ und $r$ und der Höhe $h$?',
    [r'$V = \dfrac{\pi h}{3} (R^2 + R r + r^2)$', r'$V = \pi h (R^2 + r^2)$',
     r'$V = \dfrac{\pi h}{3} (R + r)^2$', r'$V = \dfrac{\pi h}{2} (R^2 + r^2)$'],
    [r'Sie entsteht als Differenz aus großem und abgeschnittenem kleinem Kegel.'])

Q.q(r'Ein Kegelstumpf hat die Radien $R = 4$ cm und $r = 2$ cm und die Höhe 6 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'175,9 cm³', r'226,2 cm³', r'301,6 cm³', r'125,7 cm³'],
    [r'$V = \dfrac{\pi \cdot 6}{3} (16 + 8 + 4) = 2\pi \cdot 28 = 56\pi \approx 175{,}9$ cm³'])

Q.q(r'Ein Pyramidenstumpf hat quadratische Grund- und Deckflächen mit den Kanten 4 cm und 2 cm und die Höhe 3 cm. Wie groß ist sein Volumen?',
    [r'28 cm³', r'60 cm³', r'20 cm³', r'36 cm³'],
    [r'$V = \dfrac{h}{3} \left(G_1 + \sqrt{G_1 G_2} + G_2\right)$ mit $G_1 = 16$, $G_2 = 4$.', r'$V = \dfrac{3}{3} (16 + 8 + 4) = 28$ cm³'])

Q.q(r'Ein Kegelstumpf hat $R = 5$ cm, $r = 2$ cm und die Höhe 4 cm. Wie lang ist seine Mantellinie $s$?',
    [r'5 cm', r'4 cm', r'7 cm', r'6,4 cm'],
    [r'Im Achsenschnitt: rechtwinkliges Dreieck mit der Höhe 4 cm und dem Radienunterschied $5 - 2 = 3$ cm.', r'$s = \sqrt{4^2 + 3^2} = 5$ cm'])

Q.q(r'Wie groß ist der Mantel dieses Kegelstumpfs ($R = 5$ cm, $r = 2$ cm, $s = 5$ cm, gerundet)?',
    [r'110,0 cm²', r'78,5 cm²', r'31,4 cm²', r'157,1 cm²'],
    [r'$M = \pi s (R + r) = \pi \cdot 5 \cdot 7 = 35\pi \approx 110{,}0$ cm²'])

Q.q(r'Wie groß ist das Volumen dieses Kegelstumpfs ($R = 5$ cm, $r = 2$ cm, $h = 4$ cm, gerundet)?',
    [r'163,4 cm³', r'364,4 cm³', r'205,3 cm³', r'104,7 cm³'],
    [r'$V = \dfrac{\pi \cdot 4}{3} (25 + 10 + 4) = \dfrac{4\pi}{3} \cdot 39 = 52\pi \approx 163{,}4$ cm³'])

Q.q(r'Ein Eimer hat oben den Radius 15 cm, unten 12 cm und ist 30 cm hoch. Wie viele Liter passen hinein (gerundet)?',
    [r'17,2 l', r'21,2 l', r'5,7 l', r'172,5 l'],
    [r'$V = \dfrac{\pi \cdot 30}{3} (225 + 180 + 144) = 10\pi \cdot 549 \approx 17\,247$ cm³', r'$17\,247$ cm³ $\approx 17{,}2$ l'])

Q.q(r'Ein Betonsockel ist ein Pyramidenstumpf mit quadratischen Flächen (Kanten 1 m und 0,6 m) und der Höhe 0,5 m. Beton wiegt 2,4 t pro m³. Wie schwer ist der Sockel (gerundet)?',
    [r'784 kg', r'1200 kg', r'327 kg', r'544 kg'],
    [r'$V = \dfrac{0{,}5}{3} (1 + 0{,}6 + 0{,}36) = \dfrac{0{,}5}{3} \cdot 1{,}96 \approx 0{,}3267$ m³', r'$m \approx 0{,}3267 \cdot 2{,}4 \approx 0{,}784$ t $= 784$ kg'])

Q.q(r'Ein Kubikmeter Beton kostet 150 €. Was kostet der Beton für diesen Sockel (0,3267 m³, gerundet)?',
    [r'49 €', r'150 €', r'459 €', r'75 €'],
    [r'$0{,}3267 \cdot 150 \approx 49$ €'])

Q.q(r'Ein Lampenschirm ist der Mantel eines Kegelstumpfs mit $R = 20$ cm, $r = 10$ cm und der Mantellinie 25 cm. Wie viel Stoff braucht man (gerundet)?',
    [r'2356,2 cm²', r'785,4 cm²', r'1570,8 cm²', r'4712,4 cm²'],
    [r'$M = \pi \cdot 25 \cdot (20 + 10) = 750\pi \approx 2356{,}2$ cm²'])

Q.q(r'Ein Kegel wird auf halber Höhe parallel zur Grundfläche durchgeschnitten. Welcher Anteil des Volumens bleibt im Stumpf?',
    [r'$\dfrac{7}{8}$', r'$\dfrac{1}{2}$', r'$\dfrac{3}{4}$', r'$\dfrac{1}{8}$'],
    [r'Der kleine Kegel ist in allen Längen halb so groß, sein Volumen also $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$.', r'Im Stumpf bleiben $1 - \dfrac{1}{8} = \dfrac{7}{8}$.'])

Q.q(r'Ein Pyramidenstumpf hat quadratische Flächen mit den Kanten 6 cm und 4 cm, jede Trapezfläche hat die Höhe 5 cm. Wie groß ist die Oberfläche?',
    [r'152 cm²', r'100 cm²', r'52 cm²', r'252 cm²'],
    [r'Grund- und Deckfläche: $36 + 16 = 52$ cm².', r'Vier Trapeze: $4 \cdot \dfrac{6 + 4}{2} \cdot 5 = 100$ cm².', r'$O = 152$ cm²'])

Q.q(r'Ein Pyramidenstumpf hat quadratische Flächen mit den Kanten 10 cm und 4 cm, die Trapezhöhe beträgt 5 cm. Wie hoch ist der Stumpf?',
    [r'4 cm', r'5 cm', r'3 cm', r'6 cm'],
    [r'Im Schnitt durch die Mitte: Die Trapezhöhe ist Hypotenuse, eine Kathete ist $\dfrac{10 - 4}{2} = 3$ cm.', r'$h = \sqrt{5^2 - 3^2} = 4$ cm'])

Q.q(r'Was ergibt die Kegelstumpf-Formel $V = \dfrac{\pi h}{3}(R^2 + R r + r^2)$ für $r = 0$?',
    [r'das Volumen eines Kegels', r'das Volumen eines Zylinders', r'null', r'das Volumen einer Kugel'],
    [r'$V = \dfrac{\pi h}{3} R^2 = \dfrac{1}{3} \pi R^2 h$ – die Deckfläche schrumpft zur Spitze.'])

Q.q(r'Was ergibt dieselbe Formel für $r = R$?',
    [r'das Volumen eines Zylinders', r'das Volumen eines Kegels', r'das Dreifache eines Zylinders', r'null'],
    [r'$V = \dfrac{\pi h}{3} \cdot 3R^2 = \pi R^2 h$ – die Formel passt zu den Grenzfällen.'])

Q.q(r'Ein Blumentopf hat oben den Radius 10 cm, unten 7 cm und ist 12 cm hoch. Wie viel Erde passt hinein (gerundet)?',
    [r'2,75 l', r'3,77 l', r'1,85 l', r'27,5 l'],
    [r'$V = \dfrac{\pi \cdot 12}{3} (100 + 70 + 49) = 4\pi \cdot 219 = 876\pi \approx 2752$ cm³ $\approx 2{,}75$ l'])

Q.q(r'Ein Werkstück kostet 12 € Material und 8 € Arbeit und wird für 32 € verkauft. Wie viel Prozent der Kosten beträgt der Gewinn?',
    [r'60 %', r'37,5 %', r'12 %', r'160 %'],
    [r'Kosten: $12 + 8 = 20$ €, Gewinn: $32 - 20 = 12$ €.', r'$\dfrac{12}{20} = 60\,\%$ der Kosten. (Bezogen auf den Verkaufspreis wären es $37{,}5\,\%$.)'])

Q.q(r'Eine Pyramide wird auf halber Höhe parallel zur Grundfläche durchgeschnitten. Wie groß ist die Schnittfläche im Vergleich zur Grundfläche?',
    [r'ein Viertel', r'die Hälfte', r'ein Achtel', r'genauso groß'],
    [r'Alle Längen der Schnittfläche sind halb so groß.', r'Flächen wachsen mit dem Quadrat: $\left(\dfrac{1}{2}\right)^2 = \dfrac{1}{4}$.'])


def check():
    from math import pi, sqrt
    R = lambda x, n=1: round(x, n)
    assert 36 * 8 / 3 - 9 * 4 / 3 == 84
    assert R(pi * 6 / 3 * (16 + 8 + 4)) == 175.9 and 3 / 3 * (16 + sqrt(64) + 4) == 28
    assert sqrt(16 + 9) == 5 and R(35 * pi) == 110.0 and R(pi * 4 / 3 * 39) == 163.4
    assert R(pi * 30 / 3 * 549, 0) == 17247
    V = 0.5 / 3 * (1 + sqrt(1 * 0.36) + 0.36)
    assert R(V, 4) == 0.3267 and R(V * 2400, 0) == 784 and R(V * 150, 0) == 49
    assert R(750 * pi) == 2356.2 and 1 - 0.5 ** 3 == 7 / 8
    assert 36 + 16 + 4 * (6 + 4) / 2 * 5 == 152 and sqrt(25 - 9) == 4
    assert R(pi * 12 / 3 * 219, 0) == 2752 and (32 - 20) / 20 == 0.6 and 12 / 32 == 0.375


Q.verify(check)
Q.save()
