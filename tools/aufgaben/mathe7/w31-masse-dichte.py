#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 31 / KW 17 (LB 4): mass and density - m = rho * V,
density from mass and volume, units, workpieces of wood, steel, concrete; floating.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=31, slug='masse-dichte', thema='Masse und Dichte', lb='LB 4',
        blurb='Dichte als Masse pro Volumen, Masse berechnen, Einheiten, Werkstücke',
        comment='Blocks: idea and units (1-2, 11, 16), mass from volume (3-8, 13, 17-18, 20), density and volume (9, 12, 15), reasoning (10, 14, 19).')

m = lambda rho, V: D(str(rho)) * D(str(V))

# ------------------------------------------------------------------ idea and units ----
Q.q(r'Was gibt die Dichte eines Stoffes an?',
    [r'wie viel Masse ein bestimmtes Volumen dieses Stoffes hat', r'wie groß ein Körper ist', r'wie hart ein Stoff ist',
     r'wie warm ein Stoff ist'],
    [r'Dichte = Masse : Volumen',
     r'Beispiel: 1 cm³ Eisen wiegt 7,8 g.',
     r'Die Dichte von Eisen ist also 7,8 g/cm³.'])

Q.q(r'Mit welcher Formel berechnet man die Masse eines Körpers aus Dichte $\rho$ und Volumen $V$?',
    [r'$m = \rho \cdot V$', r'$m = \dfrac{\rho}{V}$', r'$m = \rho + V$', r'$m = \dfrac{V}{\rho}$'],
    [r'Die Dichte sagt, wie viel Gramm jeder Kubikzentimeter wiegt.',
     r'Hat der Körper $V$ Kubikzentimeter, wiegt er $V$-mal so viel.',
     r'$m = \rho \cdot V$'])

Q.q(r'Welche Angaben sind gleich groß?',
    [r'1 g/cm³ = 1 kg/dm³ = 1 t/m³', r'1 g/cm³ = 1 kg/m³', r'1 g/cm³ = 1000 kg/dm³', r'1 g/cm³ = 1 t/dm³'],
    [r'1 dm³ = 1000 cm³ und 1 kg = 1000 g: Das Verhältnis bleibt gleich.',
     r'1 m³ = 1000 dm³ und 1 t = 1000 kg: wieder gleich.',
     r'Darum ist 1 g/cm³ = 1 kg/dm³ = 1 t/m³.'])

Q.q(r'Ein Körper aus Stahl hat das doppelte Volumen eines anderen Stahlkörpers. Was gilt für die Masse?',
    [r'Sie ist doppelt so groß.', r'Sie ist gleich.', r'Sie ist viermal so groß.', r'Sie ist halb so groß.'],
    [r'Gleicher Stoff, gleiche Dichte.',
     r'$m = \rho \cdot V$: Volumen und Masse sind direkt proportional.',
     r'Doppeltes Volumen, doppelte Masse.'])

# ------------------------------------------------------------- mass from volume ----
Q.q(r'Aluminium hat die Dichte 2,7 g/cm³. Wie schwer ist ein Aluminiumwürfel mit dem Volumen 10 cm³?',
    [r'27 g', r'2,7 g', r'12,7 g', r'3,7 g'],
    [r'$m = \rho \cdot V$',
     r'$= 2{,}7 \cdot 10$',
     r'$= 27$ g'])

Q.q(r'Ein Stahlquader ist 5 cm lang, 4 cm breit und 2 cm hoch. Stahl hat die Dichte 7,8 g/cm³. Wie schwer ist er?',
    [r'312 g', r'40 g', r'78 g', r'31,2 g'],
    [r'Volumen: $5 \cdot 4 \cdot 2 = 40$ cm³',
     r'$m = 7{,}8 \cdot 40$',
     r'$= 312$ g'])

Q.q(r'Ein Holzbrett ist 100 cm lang, 20 cm breit und 2 cm dick. Das Holz hat die Dichte 0,5 g/cm³. Wie schwer ist das Brett?',
    [r'2 kg', r'4 kg', r'20 kg', r'0,2 kg'],
    [r'Volumen: $100 \cdot 20 \cdot 2 = 4000$ cm³',
     r'$m = 0{,}5 \cdot 4000 = 2000$ g',
     r'= 2 kg'])

Q.q(r'Wasser hat die Dichte 1 g/cm³. Wie schwer ist 1 Liter Wasser?',
    [r'1 kg', r'1 g', r'10 kg', r'100 g'],
    [r'1 Liter = 1000 cm³',
     r'$m = 1 \cdot 1000 = 1000$ g',
     r'= 1 kg'])

Q.q(r'Eine Betonplatte ist 1 m lang, 1 m breit und 10 cm dick. Beton hat die Dichte 2,4 t/m³. Wie schwer ist sie?',
    [r'240 kg', r'24 kg', r'2,4 t', r'2400 kg'],
    [r'Volumen: $1 \cdot 1 \cdot 0{,}1 = 0{,}1$ m³',
     r'$m = 2{,}4 \cdot 0{,}1 = 0{,}24$ t',
     r'= 240 kg'])

Q.q(r'Gold hat die Dichte 19,3 g/cm³. Wie schwer ist ein kleiner Goldbarren mit 50 cm³?',
    [r'965 g', r'96,5 g', r'69,3 g', r'386 g'],
    [r'$m = 19{,}3 \cdot 50$',
     r'$= 965$ g',
     r'Fast ein Kilogramm – so klein und so schwer.'])

Q.q(r'Ein Prisma aus Stahl (7,8 g/cm³) hat die Grundfläche 6 cm² und die Höhe 10 cm. Wie schwer ist es?',
    [r'468 g', r'60 g', r'78 g', r'46,8 g'],
    [r'Volumen: $V = G \cdot h = 6 \cdot 10 = 60$ cm³',
     r'$m = 7{,}8 \cdot 60$',
     r'$= 468$ g'])

Q.q(r'Ein Stahlträger ist 2 m lang und hat einen Querschnitt von 20 cm². Stahl: 7,8 g/cm³. Wie schwer ist er?',
    [r'31,2 kg', r'312 g', r'3,12 kg', r'312 kg'],
    [r'Länge in cm: 200 cm. Volumen: $20 \cdot 200 = 4000$ cm³',
     r'$m = 7{,}8 \cdot 4000 = 31\,200$ g',
     r'= 31,2 kg'])

Q.q(r'Ein Lastwagen lädt 8 m³ Sand. Sand hat etwa die Dichte 1,5 t/m³. Wie schwer ist die Ladung?',
    [r'12 t', r'9,5 t', r'5,3 t', r'120 t'],
    [r'$m = \rho \cdot V$',
     r'$= 1{,}5 \cdot 8$',
     r'$= 12$ t'])

Q.q(r'Ein Aquarium ist 60 cm lang, 30 cm breit und 40 cm hoch und randvoll mit Wasser. Wie schwer ist das Wasser?',
    [r'72 kg', r'7,2 kg', r'720 kg', r'130 kg'],
    [r'Volumen: $6 \cdot 3 \cdot 4 = 72$ dm³ = 72 Liter',
     r'1 Liter Wasser wiegt 1 kg.',
     r'72 kg – dazu kommt noch das Glas.'])

# -------------------------------------------------------------- density and volume ----
Q.q(r'Ein Metallstück wiegt 135 g und hat das Volumen 50 cm³. Welche Dichte hat es – welches Metall könnte es sein?',
    [r'2,7 g/cm³, also Aluminium', r'7,8 g/cm³, also Stahl', r'19,3 g/cm³, also Gold', r'0,5 g/cm³, also Holz'],
    [r'$\rho = \dfrac{m}{V} = \dfrac{135}{50}$',
     r'$= 2{,}7$ g/cm³',
     r'Das passt zu Aluminium.'])

Q.q(r'Ein Stück Eisen (7,8 g/cm³) wiegt 780 g. Wie groß ist sein Volumen?',
    [r'100 cm³', r'6084 cm³', r'10 cm³', r'780 cm³'],
    [r'$V = \dfrac{m}{\rho}$',
     r'$= 780 : 7{,}8$',
     r'$= 100$ cm³'])

Q.q(r'Ein Liter Speiseöl wiegt 0,9 kg. Welche Dichte hat das Öl?',
    [r'0,9 g/cm³', r'9 g/cm³', r'1,1 g/cm³', r'90 g/cm³'],
    [r'1 Liter = 1000 cm³, 0,9 kg = 900 g.',
     r'$\rho = 900 : 1000$',
     r'$= 0{,}9$ g/cm³'])

# ------------------------------------------------------------------------ reasoning ----
Q.q(r'Eis hat die Dichte 0,92 g/cm³, Wasser 1 g/cm³. Was passiert mit einem Eiswürfel im Wasser?',
    [r'Er schwimmt, weil Eis eine kleinere Dichte hat.', r'Er sinkt, weil er fest ist.', r'Er schwebt genau in der Mitte.',
     r'Das hängt nur von seiner Größe ab.'],
    [r'Körper mit kleinerer Dichte als Wasser schwimmen.',
     r'$0{,}92 < 1$',
     r'Darum schwimmt Eis – ein kleiner Teil schaut heraus.'])

Q.q(r'Zwei Würfel haben dasselbe Volumen, einer ist aus Gold (19,3 g/cm³), einer aus Aluminium (2,7 g/cm³). Was gilt?',
    [r'Der Goldwürfel ist gut siebenmal so schwer.', r'Beide sind gleich schwer.', r'Der Aluminiumwürfel ist schwerer.',
     r'Der Goldwürfel ist doppelt so schwer.'],
    [r'Bei gleichem Volumen entscheidet die Dichte.',
     r'$19{,}3 : 2{,}7 \approx 7{,}1$',
     r'Gold ist gut siebenmal so schwer.'])

Q.q(r'Eine Kugel aus Aluminium wiegt viel weniger, als man aus ihrem Volumen und der Dichte ausrechnet. Was ist der wahrscheinlichste Grund?',
    [r'Sie ist innen hohl.', r'Aluminium wird beim Wiegen leichter.', r'Die Waage zeigt immer zu viel an.',
     r'Kugeln haben keine Masse.'],
    [r'$m = \rho \cdot V$ gilt für massive Körper.',
     r'Ist innen Luft, ist das Metallvolumen kleiner.',
     r'Die Kugel ist vermutlich hohl.'])


def check():
    assert m('2.7', 10) == 27 and m('7.8', 5 * 4 * 2) == 312 and m('0.5', 100 * 20 * 2) == 2000 and m(1, 1000) == 1000
    assert m('2.4', '0.1') == D('0.24') and m('19.3', 50) == 965 and m('7.8', 6 * 10) == 468
    assert m('7.8', 20 * 200) == 31200 and m('1.5', 8) == 12 and 6 * 3 * 4 == 72
    assert D(135) / 50 == D('2.7') and D(780) / D('7.8') == 100 and D(900) / 1000 == D('0.9')
    assert D('0.92') < 1 and round(19.3 / 2.7, 1) == 7.1


Q.verify(check)
Q.save()
