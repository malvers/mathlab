#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 23 / KW 8 (LB 3): steps of problem solving in geometry -
sketch, variables, sub-problems; composite areas by cutting and completing.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import vieleck

Q = os6(nr=23, slug='problemloesen-geometrie', thema='Problemlösen in der Geometrie', lb='LB 3',
        blurb='Skizze, Variablen, Teilprobleme, zusammengesetzte Flächen',
        comment='Blocks: composite figures (1-5, 17), steps and strategies (6-7, 15, 18), everyday areas (8-14, 16, 19-20).')

L = [(0, 0), (8, 0), (8, 3), (3, 3), (3, 6), (0, 6)]
ECKE = [(0, 0), (10, 0), (10, 3), (6, 6), (0, 6)]


def area(pts):
    return abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1] for i in range(len(pts)))) / 2


def perim(pts):
    return sum(math.dist(pts[i], pts[i - 1]) for i in range(len(pts)))


fig_L = vieleck(L, sides=[(0, '8 m'), (1, '3 m'), (4, '3 m'), (5, '6 m')], label='L-förmige Fläche')

# --------------------------------------------------------- composite figures ----
Q.q(r'Wie groß ist die L-förmige Terrasse?',
    [r'33 m²', r'48 m²', r'28 m²', r'39 m²'],
    [r'Zerlegen in zwei Rechtecke: unten $8 \cdot 3 = 24$ m².',
     r'Oben links: $3 \cdot 3 = 9$ m² (die Höhe ist $6 - 3 = 3$ m).',
     r'Zusammen $24 + 9 = 33$ m².'],
    fig=fig_L, figcap=r'Terrasse (Maße in Metern)')

Q.q(r'Wie groß ist der Umfang der L-förmigen Terrasse?',
    [r'28 m', r'20 m', r'33 m', r'24 m'],
    [r'Fehlende Seiten: oben rechts $8 - 3 = 5$ m, senkrecht in der Mitte $6 - 3 = 3$ m.',
     r'$8 + 3 + 5 + 3 + 3 + 6$',
     r'$= 28$ m – so viel wie ein Rechteck 8 m × 6 m.'],
    fig=fig_L, figcap=r'Terrasse (Maße in Metern)')

Q.q(r'Mia rechnet für die L-förmige Terrasse $8 \cdot 6 = 48$ m². Was hat sie falsch gemacht?',
    [r'Sie hat die fehlende Ecke oben rechts nicht abgezogen.', r'Nichts, das stimmt.',
     r'Sie hätte durch 2 teilen müssen.', r'Sie hätte den Umfang nehmen müssen.'],
    [r'$8 \cdot 6$ ist das große Rechteck um die Terrasse herum.',
     r'Oben rechts fehlt ein Rechteck mit $5 \cdot 3 = 15$ m².',
     r'$48 - 15 = 33$ m² – Ergänzen und Abziehen geht also auch.'],
    fig=fig_L, figcap=r'Terrasse (Maße in Metern)')

Q.q(r'Von einem rechteckigen Blech (10 cm × 6 cm) wird eine Ecke abgeschnitten. Wie groß ist das Blech jetzt?',
    [r'54 cm²', r'60 cm²', r'48 cm²', r'57 cm²'],
    [r'Großes Rechteck: $10 \cdot 6 = 60$ cm²',
     r'Abgeschnitten wurde ein rechtwinkliges Dreieck mit den Seiten 4 cm und 3 cm: $4 \cdot 3 : 2 = 6$ cm².',
     r'$60 - 6 = 54$ cm²'],
    fig=vieleck(ECKE, sides=[(0, '10 cm'), (1, '3 cm'), (4, '6 cm')],
                extra=[((6, 6), (10, 6), '4 cm'), ((10, 6), (10, 3), '')], label='Blech mit abgeschnittener Ecke'),
    figcap=r'Blech mit abgeschnittener Ecke')

Q.q(r'Man rechnet ein großes Rechteck aus und zieht davon ab, was fehlt. Wie heißt diese Strategie?',
    [r'Ergänzen', r'Zerlegen', r'Schätzen', r'Messen'],
    [r'Die Figur wird zu einer einfachen Figur ergänzt.',
     r'Danach zieht man das Ergänzte wieder ab.',
     r'Zerlegen wäre: die Figur in Teile schneiden und diese addieren.'])

# ----------------------------------------------------- steps and strategies ----
Q.q(r'Womit beginnt man beim Lösen einer Sachaufgabe zur Geometrie?',
    [r'wichtige Angaben heraussuchen und eine Skizze anfertigen', r'sofort mit der ersten Zahl rechnen',
     r'das Ergebnis schätzen und aufschreiben', r'die Formel für den Umfang hinschreiben'],
    [r'Erst verstehen: Was ist gegeben, was ist gesucht?',
     r'Eine Skizze mit allen Maßen macht die Aufgabe sichtbar.',
     r'Dann einen Plan machen, rechnen und das Ergebnis prüfen.'])

Q.q(r'Ein Rechteck ist doppelt so lang wie breit. Sein Umfang ist 36 cm. Wie breit ist es?',
    [r'6 cm', r'9 cm', r'12 cm', r'18 cm'],
    [r'Variable einführen: Breite $b$, Länge $2b$.',
     r'Umfang: $b + 2b + b + 2b = 6b = 36$',
     r'$b = 6$ cm, die Länge ist 12 cm.'])

Q.q(r'Du willst wissen, wie viele Eimer Farbe du für eine Wand brauchst. Was rechnest du zuerst?',
    [r'den Flächeninhalt der Wand', r'den Umfang der Wand', r'den Preis eines Eimers', r'die Höhe des Raumes mal 4'],
    [r'Auf der Farbdose steht, für wie viele Quadratmeter sie reicht.',
     r'Also braucht man zuerst die Fläche, die gestrichen wird.',
     r'Dann folgt das Teilproblem: Fläche durch Reichweite eines Eimers.'])

Q.q(r'Aus 12 Quadraten mit je 1 cm² soll ein Rechteck gelegt werden. Welches Rechteck hat den kleinsten Umfang?',
    [r'3 cm × 4 cm', r'2 cm × 6 cm', r'1 cm × 12 cm', r'2 cm × 5 cm'],
    [r'Systematisch probieren: 1 × 12, 2 × 6, 3 × 4 (2 × 5 hat nur 10 cm²).',
     r'Umfänge: 26 cm, 16 cm, 14 cm.',
     r'Am kleinsten ist er beim fast quadratischen 3 cm × 4 cm.'])

# ----------------------------------------------------------- everyday areas ----
Q.q(r'Eine Wand ist 4 m breit und 2,5 m hoch. Darin ist ein Fenster mit 1,2 m × 1 m. Wie viel Wandfläche wird gestrichen?',
    [r'8,8 m²', r'10 m²', r'11,2 m²', r'6,5 m²'],
    [r'Wand: $4 \cdot 2{,}5 = 10$ m²',
     r'Fenster: $1{,}2 \cdot 1 = 1{,}2$ m²',
     r'$10 - 1{,}2 = 8{,}8$ m²'])

Q.q(r'Ein Liter Farbe reicht für 5 m². Wie viele Liter muss man für 8,8 m² kaufen, wenn es nur ganze Liter gibt?',
    [r'2 Liter', r'1 Liter', r'1,76 Liter', r'44 Liter'],
    [r'$8{,}8 : 5 = 1{,}76$ Liter',
     r'Ein Liter reicht nicht.',
     r'Also 2 Liter kaufen – hier wird aufgerundet.'])

Q.q(r'Ein Rasen ist 12 m lang und 8 m breit. Rundherum liegt außen ein 1 m breiter Weg. Wie groß ist der Weg?',
    [r'44 m²', r'40 m²', r'96 m²', r'140 m²'],
    [r'Rasen mit Weg: $(12 + 2) \cdot (8 + 2) = 14 \cdot 10 = 140$ m²',
     r'Rasen allein: $12 \cdot 8 = 96$ m²',
     r'Weg: $140 - 96 = 44$ m²'])

Q.q(r'Ein Boden ist 3 m lang und 2,5 m breit. Ein Paket Laminat reicht für 1,5 m². Wie viele Pakete braucht man?',
    [r'5', r'4', r'7,5', r'6'],
    [r'Bodenfläche: $3 \cdot 2{,}5 = 7{,}5$ m²',
     r'$7{,}5 : 1{,}5 = 5$',
     r'Man braucht 5 Pakete (in der Praxis plant man etwas Verschnitt ein).'])

Q.q(r'Um einen quadratischen Platz mit 15 m Seitenlänge soll ein Zaun gebaut werden. 1 m Zaun kostet 12 €. Was kostet der Zaun?',
    [r'720 €', r'180 €', r'2700 €', r'360 €'],
    [r'Teilproblem 1, Umfang: $4 \cdot 15 = 60$ m',
     r'Teilproblem 2, Kosten: $60 \cdot 12$',
     r'$= 720$ €'])

Q.q(r'In ein Rechteck mit 6 cm Länge und 4 cm Breite wird ein Dreieck gezeichnet: zwei Ecken unten, die dritte auf der oberen Seite. Wie groß ist das Dreieck?',
    [r'12 cm²', r'24 cm²', r'6 cm²', r'10 cm²'],
    [r'Grundseite ist die untere Seite: $g = 6$ cm.',
     r'Die Höhe ist die Breite des Rechtecks: $h = 4$ cm.',
     r'$A = 6 \cdot 4 : 2 = 12$ cm² – immer die Hälfte, egal wo die Spitze liegt.'])

Q.q(r'Ein Grundstück ist ein Trapez: Straßenseite 30 m, Rückseite 20 m (parallel dazu), Tiefe 25 m. Wie groß ist es?',
    [r'625 m²', r'1250 m²', r'750 m²', r'500 m²'],
    [r'Skizze: Die Tiefe ist der Abstand der parallelen Seiten, also die Höhe.',
     r'$A = (30 + 20) \cdot 25 : 2$',
     r'$= 625$ m²'])

Q.q(r'Eine Hauswand besteht aus einem Rechteck (8 m breit, 3 m hoch) und darüber einem Giebeldreieck (8 m breit, 2,5 m hoch). Wie groß ist die Wand?',
    [r'34 m²', r'44 m²', r'24 m²', r'28 m²'],
    [r'Rechteck: $8 \cdot 3 = 24$ m²',
     r'Dreieck: $8 \cdot 2{,}5 : 2 = 10$ m²',
     r'Zusammen 34 m².'])

Q.q(r'Ein rechteckiges Beet hat den Flächeninhalt 48 m² und ist 8 m lang. Wie groß ist sein Umfang?',
    [r'28 m', r'14 m', r'56 m', r'32 m'],
    [r'Teilproblem: Breite $= 48 : 8 = 6$ m',
     r'Umfang $= 2 \cdot 8 + 2 \cdot 6$',
     r'$= 28$ m'])

Q.q(r'Eine Wohnung hat zwei Zimmer: 4 m × 3,5 m und 3 m × 3 m. Wie groß sind beide zusammen?',
    [r'23 m²', r'13,5 m²', r'20,5 m²', r'26 m²'],
    [r'Erstes Zimmer: $4 \cdot 3{,}5 = 14$ m²',
     r'Zweites Zimmer: $3 \cdot 3 = 9$ m²',
     r'Zusammen 23 m².'])

Q.q(r'Ein Grundstück ist 1500 m² groß. Wie viel Ar sind das?',
    [r'15 a', r'150 a', r'1,5 a', r'0,15 a'],
    [r'1 Ar ist ein Quadrat von 10 m × 10 m = 100 m².',
     r'$1500 : 100 = 15$',
     r'Also 15 a.'])


def check():
    assert area(L) == 33 and perim(L) == 28 and 8 * 6 - 5 * 3 == 33
    assert area(ECKE) == 54 and 10 * 6 - F(4 * 3, 2) == 54
    assert 6 * 6 == 36 and 36 / 6 == 6
    rects = {(1, 12): 26, (2, 6): 16, (3, 4): 14}
    assert all(2 * (a + b) == u and a * b == 12 for (a, b), u in rects.items()) and 2 * 5 != 12
    assert 4 * D('2.5') - D('1.2') * 1 == D('8.8')
    assert D('8.8') / 5 == D('1.76') and math.ceil(1.76) == 2
    assert 14 * 10 - 12 * 8 == 44
    assert 3 * D('2.5') / D('1.5') == 5
    assert 4 * 15 * 12 == 720
    assert F(6 * 4, 2) == 12
    assert F((30 + 20) * 25, 2) == 625
    assert 8 * 3 + F(8 * 5, 2 * 2) == 34
    assert 2 * 8 + 2 * (48 // 8) == 28
    assert 4 * D('3.5') + 9 == 23
    assert 1500 / 100 == 15


Q.verify(check)
Q.save()
