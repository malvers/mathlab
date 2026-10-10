#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 33 / KW 19 (LB 4): composite solids by cutting
and completing; packaging - volume used, material needed, saving material (education for
sustainable development). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=33, slug='zusammengesetzte-koerper', thema='Zusammengesetzte Körper und Verpackungen', lb='LB 4',
        blurb='Zerlegen und Ergänzen, Volumen und Oberfläche, Materialverbrauch von Verpackungen',
        comment='Blocks: composite volumes (1-4, 12-14), surfaces (5, 17, 20), packaging and material (6-11, 15-16, 18-19).')

vol = lambda a, b, c: a * b * c
surf = lambda a, b, c: 2 * (a * b + a * c + b * c)

# --------------------------------------------------------------- composite volumes ----
Q.q(r'Ein Körper besteht aus zwei Quadern: unten 10 cm × 6 cm × 3 cm, darauf 4 cm × 6 cm × 5 cm. Wie groß ist sein Volumen?',
    [r'300 cm³', r'180 cm³', r'120 cm³', r'420 cm³'],
    [r'Unten: $10 \cdot 6 \cdot 3 = 180$ cm³',
     r'Oben: $4 \cdot 6 \cdot 5 = 120$ cm³',
     r'Zusammen 300 cm³.'])

Q.q(r'Aus einem Holzquader (10 cm × 6 cm × 4 cm) wird ein durchgehendes quadratisches Loch (2 cm × 2 cm) der Länge nach gebohrt. Wie viel Holz bleibt?',
    [r'200 cm³', r'240 cm³', r'40 cm³', r'224 cm³'],
    [r'Ganzer Quader: $10 \cdot 6 \cdot 4 = 240$ cm³',
     r'Loch: ein Prisma mit $G = 2 \cdot 2 = 4$ cm² und Länge 10 cm: 40 cm³.',
     r'$240 - 40 = 200$ cm³'])

Q.q(r'Ein Gartenhaus besteht aus einem Quader (8 m × 6 m × 3 m) und einem Satteldach (Dreiecksprisma: Dreieck 6 m breit, 2 m hoch, 8 m lang). Wie groß ist der umbaute Raum?',
    [r'192 m³', r'144 m³', r'240 m³', r'48 m³'],
    [r'Quader: $8 \cdot 6 \cdot 3 = 144$ m³',
     r'Dach: $G = 6 \cdot 2 : 2 = 6$ m², $V = 6 \cdot 8 = 48$ m³',
     r'Zusammen 192 m³.'])

Q.q(r'In einen Holzklotz (10 cm × 6 cm × 4 cm) wird oben der Länge nach eine dreieckige Nut gefräst (Dreieck: 2 cm breit, 2 cm tief). Wie groß ist das Restvolumen?',
    [r'220 cm³', r'200 cm³', r'236 cm³', r'230 cm³'],
    [r'Klotz: $10 \cdot 6 \cdot 4 = 240$ cm³',
     r'Nut: Prisma mit $G = 2 \cdot 2 : 2 = 2$ cm², 10 cm lang: 20 cm³',
     r'$240 - 20 = 220$ cm³'])

Q.q(r'Eine Betontreppe hat drei Stufen, jede 1 m breit und 20 cm hoch. Von unten nach oben sind sie 90 cm, 60 cm und 30 cm tief (gestapelt). Wie groß ist ihr Volumen?',
    [r'0,36 m³', r'0,18 m³', r'3,6 m³', r'0,54 m³'],
    [r'Drei Quader: $100 \cdot 20 \cdot (90 + 60 + 30)$ cm³',
     r'$= 100 \cdot 20 \cdot 180 = 360\,000$ cm³',
     r'$= 360$ dm³ $= 0{,}36$ m³'])

Q.q(r'Beton hat die Dichte 2,4 t/m³. Wie schwer ist die Treppe mit 0,36 m³?',
    [r'0,864 t', r'8,64 t', r'0,15 t', r'2,76 t'],
    [r'$m = \rho \cdot V$',
     r'$= 2{,}4 \cdot 0{,}36$',
     r'$= 0{,}864$ t, also 864 kg'])

Q.q(r'Welche Aussage über das Berechnen zusammengesetzter Körper stimmt?',
    [r'Man kann zerlegen und addieren oder ergänzen und abziehen.', r'Man muss immer zerlegen.',
     r'Das Volumen ändert sich beim Zerlegen.', r'Man kann nur Quader berechnen.'],
    [r'Zerlegen: Der Körper wird in einfache Teile geteilt, deren Volumen man addiert.',
     r'Ergänzen: Man rechnet einen großen Körper und zieht ab, was fehlt.',
     r'Beides liefert dasselbe Ergebnis.'])

# ----------------------------------------------------------------------- surfaces ----
Q.q(r'Drei Würfel mit 2 cm Kantenlänge werden zu einem Turm (2 cm × 2 cm × 6 cm) aufeinandergeklebt. Wie groß ist die Oberfläche des Turms?',
    [r'56 cm²', r'72 cm²', r'48 cm²', r'64 cm²'],
    [r'Der Turm ist ein Quader 2 × 2 × 6.',
     r'$O = 2 \cdot (4 + 12 + 12)$',
     r'$= 56$ cm² (die Klebeflächen zählen nicht mit).'])

Q.q(r'Ein Schuhkarton ohne Deckel ist 30 cm lang, 18 cm breit und 12 cm hoch. Wie viel Pappe braucht man (ohne Klebelaschen)?',
    [r'1692 cm²', r'2232 cm²', r'6480 cm²', r'1152 cm²'],
    [r'Boden: $30 \cdot 18 = 540$ cm², kein Deckel.',
     r'Seiten: $2 \cdot 30 \cdot 12 + 2 \cdot 18 \cdot 12 = 720 + 432 = 1152$ cm²',
     r'Zusammen $540 + 1152 = 1692$ cm²'])

Q.q(r'Für einen Würfel mit 10 cm Kante braucht man 600 cm² Pappe. Für Klebelaschen kommen 10 % dazu. Wie viel Pappe ist das insgesamt?',
    [r'660 cm²', r'610 cm²', r'700 cm²', r'540 cm²'],
    [r'10 % von 600 cm² sind 60 cm².',
     r'$600 + 60$',
     r'$= 660$ cm²'])

# ------------------------------------------------------------ packaging and material ----
Q.q(r'Ein Liter Saft soll in einen Quader. Welche Verpackung braucht am wenigsten Material?',
    [r'10 cm × 10 cm × 10 cm', r'20 cm × 10 cm × 5 cm', r'25 cm × 8 cm × 5 cm', r'40 cm × 5 cm × 5 cm'],
    [r'Alle haben 1000 cm³ = 1 Liter.',
     r'Oberflächen: 600 cm², 700 cm², 730 cm², 850 cm².',
     r'Je würfelähnlicher der Quader, desto weniger Material.'])

Q.q(r'Warum sind würfelähnliche Verpackungen umweltfreundlicher als lange, flache?',
    [r'Bei gleichem Volumen brauchen sie weniger Material.', r'Sie sind immer bunter.', r'Sie fassen mehr Luft.',
     r'Sie sind schwerer.'],
    [r'Weniger Oberfläche bedeutet weniger Pappe oder Kunststoff.',
     r'Das spart Rohstoffe, Energie und Müll.',
     r'Trotzdem muss die Verpackung auch gut stapelbar und stabil sein.'])

Q.q(r'Wie viele Würfel mit 10 cm Kantenlänge passen genau in eine Schachtel mit 30 cm × 20 cm × 10 cm?',
    [r'6', r'60', r'5', r'12'],
    [r'Längs: $30 : 10 = 3$, quer: $20 : 10 = 2$, hoch: $10 : 10 = 1$.',
     r'$3 \cdot 2 \cdot 1$',
     r'$= 6$ Würfel'])

Q.q(r'Wie viele Würfel mit 2 cm Kante passen genau in eine Box mit 10 cm × 6 cm × 4 cm?',
    [r'30', r'240', r'60', r'15'],
    [r'$10 : 2 = 5$, $6 : 2 = 3$, $4 : 2 = 2$',
     r'$5 \cdot 3 \cdot 2 = 30$',
     r'Probe: $30 \cdot 8 = 240$ cm³ = Volumen der Box.'])

Q.q(r'Ein Produkt mit 4000 cm³ steckt in einer Schachtel mit 6000 cm³. Wie viel Prozent der Schachtel ist Luft?',
    [r'etwa 33 %', r'etwa 67 %', r'20 %', r'40 %'],
    [r'Luft: $6000 - 4000 = 2000$ cm³',
     r'$\dfrac{2000}{6000} = \dfrac{1}{3}$',
     r'Etwa 33 % Luft – eine „Mogelpackung“.'])

Q.q(r'Eine Firma spart bei jeder Schachtel 100 cm² Pappe. Sie verschickt 50 000 Schachteln. Wie viel Pappe spart sie insgesamt?',
    [r'500 m²', r'5000 m²', r'50 m²', r'5 m²'],
    [r'$100 \cdot 50\,000 = 5\,000\,000$ cm²',
     r'1 m² = 10 000 cm²',
     r'$5\,000\,000 : 10\,000 = 500$ m²'])

Q.q(r'Ein Würfel und ein Quader haben dasselbe Volumen. Welche Aussage stimmt meistens?',
    [r'Der Würfel hat die kleinere Oberfläche.', r'Der Quader hat die kleinere Oberfläche.',
     r'Beide haben immer gleich viel Oberfläche.', r'Der Würfel ist schwerer.'],
    [r'Beispiel: 10 × 10 × 10 und 20 × 10 × 5 haben beide 1000 cm³.',
     r'Oberfläche: 600 cm² gegen 700 cm².',
     r'Unter allen Quadern mit gleichem Volumen hat der Würfel die kleinste Oberfläche.'])

Q.q(r'Eine Kiste ist 60 cm × 40 cm × 30 cm groß. Wie viele Liter passen hinein?',
    [r'72 Liter', r'720 Liter', r'7,2 Liter', r'130 Liter'],
    [r'In Dezimetern: 6 dm × 4 dm × 3 dm.',
     r'$6 \cdot 4 \cdot 3 = 72$ dm³',
     r'= 72 Liter'])


Q.q(r'Eine Pralinenschachtel ist ein Dreiecksprisma: Dreieck mit 6 cm Grundseite und 5 cm Höhe, 20 cm lang. Wie groß ist ihr Volumen?',
    [r'300 cm³', r'600 cm³', r'150 cm³', r'31 cm³'],
    [r'Grundfläche: $6 \cdot 5 : 2 = 15$ cm²',
     r'$V = 15 \cdot 20$',
     r'$= 300$ cm³'])

Q.q(r'Ein würfelförmiger Karton hat das Volumen 216 cm³. Wie viel Pappe braucht man dafür (ohne Klebelaschen)?',
    [r'216 cm²', r'36 cm²', r'1296 cm²', r'144 cm²'],
    [r'Kantenlänge: $6 \cdot 6 \cdot 6 = 216$, also 6 cm.',
     r'Oberfläche: $6 \cdot 6 \cdot 6 = 216$ cm² (6 Flächen zu je 36 cm²).',
     r'Zufällig dieselbe Zahl – aber andere Einheit!'])

def check():
    assert vol(10, 6, 3) + vol(4, 6, 5) == 300 and vol(10, 6, 4) - vol(2, 2, 10) == 200
    assert vol(8, 6, 3) + F(6 * 2, 2) * 8 == 192 and vol(10, 6, 4) - F(2 * 2, 2) * 10 == 220
    assert 100 * 20 * (90 + 60 + 30) == 360000 and D('2.4') * D('0.36') == D('0.864')
    assert surf(2, 2, 6) == 56 and 30 * 18 + 2 * 30 * 12 + 2 * 18 * 12 == 1692 and 600 * D('1.1') == 660
    boxes = [(10, 10, 10), (20, 10, 5), (25, 8, 5), (40, 5, 5)]
    assert all(vol(*b) == 1000 for b in boxes) and [surf(*b) for b in boxes] == [600, 700, 730, 850]
    assert (30 // 10) * (20 // 10) * (10 // 10) == 6 and (10 // 2) * (6 // 2) * (4 // 2) == 30 and 30 * 8 == vol(10, 6, 4)
    assert F(6000 - 4000, 6000) == F(1, 3) and 100 * 50000 / 10000 == 500 and vol(6, 4, 3) == 72
    assert F(6 * 5, 2) * 20 == 300 and 6 ** 3 == 216 and surf(6, 6, 6) == 216


Q.verify(check)
Q.save()
