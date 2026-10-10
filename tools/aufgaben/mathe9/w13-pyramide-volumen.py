#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 13 / KW 48 (LB 2): Mantel, Oberfläche, Volumen
und Masse der Pyramide. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=13, slug='pyramide-volumen', thema='Oberfläche und Volumen der Pyramide', lb='LB 2',
        blurb='Mantel aus Dreiecken, Oberfläche, V = ⅓ · A_G · h, Masse, fehlende Größen',
        comment='Values rounded. Blocks: lateral surface and total surface (1-2, 7, 13, 16-17), volume (3-6, 14-15, 18, 20), mass and big pyramids (8-9), solving for h and a (10-11), scaling (12, 19).')

# ----------------------------------------------------- Mantel, Oberfläche ----
Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $h_s = 5$ cm. Wie groß ist ihr Mantel?',
    [r'60 cm²', r'30 cm²', r'120 cm²', r'96 cm²'],
    [r'Der Mantel besteht aus 4 Dreiecken mit Grundseite 6 cm und Höhe 5 cm.',
     r'$A_M = 4 \cdot \dfrac{6 \cdot 5}{2} = 60$ cm²'])

Q.q(r'Wie groß ist die Oberfläche dieser Pyramide ($a = 6$ cm, Mantel 60 cm²)?',
    [r'96 cm²', r'66 cm²', r'60 cm²', r'132 cm²'],
    [r'$O = A_G + A_M = 36 + 60 = 96$ cm²'])

Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $h = 4$ cm. Wie groß ist ihr Volumen?',
    [r'48 cm³', r'144 cm³', r'24 cm³', r'72 cm³'],
    [r'$V = \dfrac{1}{3} \cdot A_G \cdot h = \dfrac{1}{3} \cdot 36 \cdot 4$',
     r'$V = 48$ cm³'])

Q.q(r'Welche Formel gilt für das Volumen jeder Pyramide?',
    [r'$V = \dfrac{1}{3} \cdot A_G \cdot h$', r'$V = A_G \cdot h$', r'$V = \dfrac{1}{2} \cdot A_G \cdot h$', r'$V = \dfrac{1}{3} \cdot A_G \cdot h_s$'],
    [r'Grundfläche mal Körperhöhe, davon ein Drittel.',
     r'Die Seitenhöhe $h_s$ braucht man für den Mantel, nicht für das Volumen.'])

Q.q(r'Beim Umschüttversuch füllt man eine Pyramide mit Sand und schüttet in ein Prisma mit gleicher Grundfläche und Höhe. Wie oft muss man schütten?',
    [r'3-mal', r'2-mal', r'4-mal', r'1-mal'],
    [r'Das Prisma fasst genau das Dreifache der Pyramide.',
     r'Daher kommt der Faktor $\dfrac{1}{3}$ in der Formel.'])

Q.q(r'Eine Pyramide hat eine rechteckige Grundfläche mit 8 cm und 6 cm und die Höhe 12 cm. Wie groß ist ihr Volumen?',
    [r'192 cm³', r'576 cm³', r'96 cm³', r'288 cm³'],
    [r'$A_G = 8 \cdot 6 = 48$ cm²',
     r'$V = \dfrac{1}{3} \cdot 48 \cdot 12 = 192$ cm³'])

Q.q(r'Diese Pyramide hat die Seitenhöhen 12,37 cm (zur 8-cm-Kante) und 12,65 cm (zur 6-cm-Kante). Wie groß ist ihr Mantel (gerundet)?',
    [r'174,9 cm²', r'87,4 cm²', r'222,8 cm²', r'150,1 cm²'],
    [r'Zwei Dreiecke über 8 cm: $2 \cdot \dfrac{8 \cdot 12{,}37}{2} = 98{,}96$ cm²',
     r'Zwei Dreiecke über 6 cm: $2 \cdot \dfrac{6 \cdot 12{,}65}{2} = 75{,}9$ cm²',
     r'Zusammen $174{,}86$, also etwa 174,9 cm²'])

# --------------------------------------------------------- Masse, Riesen ----
Q.q(r'Die Cheops-Pyramide hatte etwa $a = 230$ m und $h = 146{,}6$ m. Wie groß war ihr Volumen ungefähr?',
    [r'etwa 2,6 Millionen m³', r'etwa 7,8 Millionen m³', r'etwa 26 000 m³', r'etwa 260 Millionen m³'],
    [r'$V = \dfrac{1}{3} \cdot 230^2 \cdot 146{,}6 = \dfrac{1}{3} \cdot 52\,900 \cdot 146{,}6$',
     r'$V \approx 2\,585\,000$ m³, also etwa 2,6 Millionen m³.'])

Q.q(r'Ein Briefbeschwerer ist eine quadratische Steinpyramide mit $a = 20$ cm und $h = 30$ cm. Der Stein hat die Dichte 2,6 g/cm³. Wie schwer ist er?',
    [r'10,4 kg', r'31,2 kg', r'4 kg', r'1,04 kg'],
    [r'$V = \dfrac{1}{3} \cdot 400 \cdot 30 = 4000$ cm³',
     r'$m = 2{,}6 \cdot 4000 = 10\,400$ g = 10,4 kg'])

# ---------------------------------------------------- fehlende Größen ----
Q.q(r'Eine quadratische Pyramide mit $a = 5$ cm hat das Volumen 100 cm³. Wie hoch ist sie?',
    [r'12 cm', r'4 cm', r'20 cm', r'1,33 cm'],
    [r'$h = \dfrac{3 \cdot V}{A_G} = \dfrac{300}{25}$',
     r'$h = 12$ cm'])

Q.q(r'Eine quadratische Pyramide ist 9 cm hoch und hat das Volumen 75 cm³. Wie lang ist die Grundkante?',
    [r'5 cm', r'25 cm', r'2,9 cm', r'8,3 cm'],
    [r'$A_G = \dfrac{3 \cdot 75}{9} = 25$ cm²',
     r'$a = \sqrt{25} = 5$ cm'])

Q.q(r'Die Höhe einer Pyramide wird halbiert, die Grundfläche bleibt gleich. Wie ändert sich das Volumen?',
    [r'Es halbiert sich.', r'Es wird ein Viertel.', r'Es wird ein Achtel.', r'Es bleibt gleich.'],
    [r'$V$ ist proportional zu $h$, wenn $A_G$ fest bleibt.'])

Q.q(r'Wie groß ist die Oberfläche eines Tetraeders mit 4 cm Kantenlänge (gerundet)?',
    [r'27,71 cm²', r'6,93 cm²', r'32 cm²', r'16 cm²'],
    [r'Ein gleichseitiges Dreieck mit $a = 4$ cm hat $A = \dfrac{\sqrt{3}}{4} \cdot 16 \approx 6{,}93$ cm².',
     r'Vier Flächen: $16\sqrt{3} \approx 27{,}71$ cm²'])

Q.q(r'Eine dreiseitige Pyramide hat die Grundfläche 12 cm² und die Höhe 10 cm. Wie groß ist ihr Volumen?',
    [r'40 cm³', r'120 cm³', r'60 cm³', r'22 cm³'],
    [r'$V = \dfrac{1}{3} \cdot 12 \cdot 10 = 40$ cm³'])

Q.q(r'Ein Würfel und eine Pyramide haben dieselbe Grundfläche und dieselbe Höhe. Welcher Anteil des Würfelvolumens ist die Pyramide?',
    [r'ein Drittel', r'die Hälfte', r'ein Viertel', r'zwei Drittel'],
    [r'Würfel: $A_G \cdot h$, Pyramide: $\dfrac{1}{3} \cdot A_G \cdot h$.'])

Q.q(r'Ein quadratisches Turmdach hat 4 m Grundkante und 5 m Seitenhöhe. Wie viel Dachfläche wird gedeckt?',
    [r'40 m²', r'20 m²', r'56 m²', r'80 m²'],
    [r'Nur der Mantel wird gedeckt: $4 \cdot \dfrac{4 \cdot 5}{2} = 40$ m²'])

Q.q(r'Eine quadratische Pyramide hat $a = 10$ cm und $h = 12$ cm. Wie groß ist ihre Oberfläche?',
    [r'360 cm²', r'260 cm²', r'340 cm²', r'580 cm²'],
    [r'Seitenhöhe: $h_s = \sqrt{144 + 25} = 13$ cm',
     r'Mantel: $4 \cdot \dfrac{10 \cdot 13}{2} = 260$ cm², Grundfläche 100 cm²',
     r'$O = 360$ cm²'])

Q.q(r'Wie groß ist das Volumen dieser Pyramide ($a = 10$ cm, $h = 12$ cm)?',
    [r'400 cm³', r'1200 cm³', r'433 cm³', r'600 cm³'],
    [r'$V = \dfrac{1}{3} \cdot 100 \cdot 12 = 400$ cm³'])

Q.q(r'Die Grundkante einer quadratischen Pyramide wird verdoppelt, die Höhe bleibt gleich. Wie ändert sich das Volumen?',
    [r'Es wird 4-mal so groß.', r'Es wird doppelt so groß.', r'Es wird 8-mal so groß.', r'Es bleibt gleich.'],
    [r'Die Grundfläche $a^2$ wird 4-mal so groß.',
     r'Bei gleicher Höhe wird auch $V$ 4-mal so groß.'])

Q.q(r'Ein Dachraum hat die Form einer quadratischen Pyramide mit 8 m Grundkante und 3 m Höhe. Wie groß ist der Dachraum?',
    [r'64 m³', r'192 m³', r'32 m³', r'24 m³'],
    [r'$V = \dfrac{1}{3} \cdot 64 \cdot 3 = 64$ m³'])


def check():
    from math import sqrt
    from fractions import Fraction as F
    assert 4 * 6 * 5 / 2 == 60 and 36 + 60 == 96 and F(1, 3) * 36 * 4 == 48
    assert F(1, 3) * 48 * 12 == 192
    assert round(8 * 12.37 + 6 * 12.65, 2) == 174.86 and round(sqrt(153), 2) == 12.37 and round(sqrt(160), 2) == 12.65
    assert round(52900 * 146.6 / 3) == 2585047
    assert F(1, 3) * 400 * 30 == 4000 and F('2.6') * 4000 == 10400
    assert F(300, 25) == 12 and sqrt(F(3 * 75, 9)) == 5
    assert round(16 * sqrt(3), 2) == 27.71 and F(1, 3) * 12 * 10 == 40
    assert 4 * 4 * 5 / 2 == 40
    assert sqrt(144 + 25) == 13 and 4 * 10 * 13 / 2 + 100 == 360 and F(1, 3) * 100 * 12 == 400
    assert F(1, 3) * 64 * 3 == 64


Q.verify(check)
Q.save()
