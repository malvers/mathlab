#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 18 / KW 1 (LB 2): zusammengesetzte Körper -
Bauwerke, Werkstücke, Behälter, Materialbedarf. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=18, slug='zusammengesetzte-koerper', thema='Zusammengesetzte Körper', lb='LB 2',
        blurb='Türme, Silos, Werkstücke mit Bohrung, Kapseln, Behälter, Materialbedarf und Oberfläche',
        comment='Values with the calculator key for pi, rounded. Blocks: buildings (1-4, 11, 18), workpieces and mass (5-6, 9), small bodies (7-8, 12-14, 20), containers (15, 19), surfaces and saving material (10, 16-17).')

# --------------------------------------------------------------- Bauwerke ----
Q.q(r'Ein Turm besteht aus einem Zylinder ($r = 3$ m, $h = 10$ m) mit einem Kegeldach ($h = 4$ m). Wie groß ist sein Volumen (gerundet)?',
    [r'320,4 m³', r'282,7 m³', r'395,8 m³', r'37,7 m³'],
    [r'Zylinder: $\pi \cdot 9 \cdot 10 = 90\pi$',
     r'Kegel: $\dfrac{1}{3}\pi \cdot 9 \cdot 4 = 12\pi$',
     r'Zusammen $102\pi \approx 320{,}4$ m³'])

Q.q(r'Wie groß ist die Außenfläche dieses Turms ohne Boden (Zylindermantel und Kegelmantel, gerundet)?',
    [r'235,6 m²', r'188,5 m²', r'263,9 m²', r'292,2 m²'],
    [r'Zylindermantel: $2\pi \cdot 3 \cdot 10 = 60\pi$',
     r'Kegel: $s = \sqrt{9 + 16} = 5$ m, Mantel $\pi \cdot 3 \cdot 5 = 15\pi$',
     r'Die Kreisfläche zwischen Zylinder und Dach ist innen und zählt nicht: $75\pi \approx 235{,}6$ m²'])

Q.q(r'Ein Silo besteht aus einem Zylinder ($r = 2$ m, $h = 8$ m) mit einer Halbkugel obendrauf. Wie viel fasst es (gerundet)?',
    [r'117,3 m³', r'100,5 m³', r'134,0 m³', r'33,5 m³'],
    [r'Zylinder: $\pi \cdot 4 \cdot 8 = 32\pi$',
     r'Halbkugel: $\dfrac{2}{3}\pi \cdot 8 = \dfrac{16}{3}\pi$',
     r'Zusammen $\approx 117{,}3$ m³'])

Q.q(r'Ein Haus ist ein Quader (10 m × 8 m × 6 m) mit Satteldach (Prisma, Giebeldreieck mit 8 m Grundseite und 3 m Höhe, 10 m lang). Wie groß ist der umbaute Raum?',
    [r'600 m³', r'720 m³', r'480 m³', r'540 m³'],
    [r'Quader: $10 \cdot 8 \cdot 6 = 480$ m³',
     r'Dach: $\dfrac{8 \cdot 3}{2} \cdot 10 = 120$ m³',
     r'Zusammen 600 m³'])

# -------------------------------------------------------------- Werkstücke ----
Q.q(r'Durch einen Stahlwürfel mit 10 cm Kantenlänge wird ein Loch mit 4 cm Durchmesser gebohrt (ganz durch). Wie groß ist das Restvolumen (gerundet)?',
    [r'874,3 cm³', r'497,3 cm³', r'960 cm³', r'125,7 cm³'],
    [r'Bohrung: Zylinder mit $r = 2$ cm, $h = 10$ cm: $40\pi \approx 125{,}7$ cm³',
     r'$1000 - 125{,}7 \approx 874{,}3$ cm³'])

Q.q(r'Wie schwer ist dieses Werkstück aus Stahl (Dichte 7,8 g/cm³, gerundet)?',
    [r'6,82 kg', r'7,80 kg', r'0,98 kg', r'68,2 kg'],
    [r'$m = 7{,}8 \cdot 874{,}3 \approx 6820$ g, also etwa 6,82 kg.'])

Q.q(r'Eine Eistüte ist ein Kegel ($r = 3$ cm, $h = 10$ cm), oben liegt eine Halbkugel Eis mit demselben Radius. Wie viel Eis ist es insgesamt, wenn auch die Waffel gefüllt ist (gerundet)?',
    [r'150,8 cm³', r'94,2 cm³', r'207,3 cm³', r'56,5 cm³'],
    [r'Kegel: $\dfrac{1}{3}\pi \cdot 9 \cdot 10 = 30\pi$',
     r'Halbkugel: $\dfrac{2}{3}\pi \cdot 27 = 18\pi$',
     r'Zusammen $48\pi \approx 150{,}8$ cm³'])

Q.q(r'Auf einem Würfel mit 4 cm Kantenlänge sitzt eine quadratische Pyramide mit gleicher Grundfläche und 3 cm Höhe. Wie groß ist die Oberfläche des ganzen Körpers (gerundet)?',
    [r'108,8 cm²', r'124,8 cm²', r'96 cm²', r'80 cm²'],
    [r'Würfel ohne Deckfläche: $5 \cdot 16 = 80$ cm²',
     r'Pyramide: $h_s = \sqrt{9 + 4} \approx 3{,}606$ cm, Mantel $4 \cdot \dfrac{4 \cdot 3{,}606}{2} \approx 28{,}8$ cm²',
     r'Zusammen etwa 108,8 cm²'])

Q.q(r'Ein Rohrstück ist 1 m lang, außen 10 cm und innen 8 cm dick. Wie viel Material hat es (gerundet)?',
    [r'2827,4 cm³', r'7854,0 cm³', r'5026,5 cm³', r'282,7 cm³'],
    [r'Radien 5 cm und 4 cm, Länge 100 cm.',
     r'$V = \pi \cdot (25 - 16) \cdot 100 = 900\pi \approx 2827{,}4$ cm³'])

Q.q(r'Welche Flächen zählen bei einem zusammengesetzten Körper nicht zur Oberfläche?',
    [r'die Flächen, an denen die Teilkörper aneinanderstoßen', r'die gekrümmten Flächen', r'die Grundflächen', r'die Flächen der Spitzen'],
    [r'Berührflächen liegen innen und sind von außen nicht sichtbar.'])

Q.q(r'Die Außenfläche des Turms aus Aufgabe 2 (etwa 235,6 m²) wird gestrichen. Man braucht 0,2 Liter Farbe pro m². Wie viel Farbe braucht man (gerundet)?',
    [r'47,1 l', r'1178 l', r'23,6 l', r'4,7 l'],
    [r'$235{,}6 \cdot 0{,}2 \approx 47{,}1$ l'])

Q.q(r'Eine Kapsel besteht aus einem Zylinder ($r = 1$ cm, $h = 4$ cm) mit je einer Halbkugel an beiden Enden. Wie groß ist ihr Volumen (gerundet)?',
    [r'16,76 cm³', r'12,57 cm³', r'20,94 cm³', r'14,66 cm³'],
    [r'Zwei Halbkugeln ergeben eine Kugel: $\dfrac{4}{3}\pi$',
     r'Zylinder: $4\pi$, zusammen $\dfrac{16}{3}\pi \approx 16{,}76$ cm³'])

Q.q(r'Wie groß ist die Oberfläche dieser Kapsel (gerundet)?',
    [r'37,70 cm²', r'31,42 cm²', r'43,98 cm²', r'25,13 cm²'],
    [r'Zylindermantel: $2\pi \cdot 1 \cdot 4 = 8\pi$, Kugeloberfläche: $4\pi$',
     r'Zusammen $12\pi \approx 37{,}70$ cm²'])

Q.q(r'Eine Spielfigur besteht aus einem Kegel ($r = 1$ cm, $h = 3$ cm) und einer Kugel ($r = 0{,}8$ cm) als Kopf. Wie groß ist ihr Volumen (gerundet)?',
    [r'5,29 cm³', r'3,14 cm³', r'2,14 cm³', r'11,57 cm³'],
    [r'Kegel: $\dfrac{1}{3}\pi \cdot 1 \cdot 3 = \pi \approx 3{,}14$ cm³',
     r'Kugel: $\dfrac{4}{3}\pi \cdot 0{,}512 \approx 2{,}14$ cm³',
     r'Zusammen etwa 5,29 cm³'])

Q.q(r'Ein Behälter besteht aus einem Quader (2 m × 1 m × 1 m) mit einem liegenden Halbzylinder obendrauf ($r = 0{,}5$ m, 2 m lang). Wie viele Liter fasst er (gerundet)?',
    [r'2785 l', r'3571 l', r'2393 l', r'2000 l'],
    [r'Quader: 2 m³',
     r'Halbzylinder: $\dfrac{1}{2}\pi \cdot 0{,}25 \cdot 2 \approx 0{,}785$ m³',
     r'Zusammen $\approx 2{,}785$ m³ = 2785 l'])

Q.q(r'Welcher Körper hat bei gleichem Volumen die kleinste Oberfläche?',
    [r'die Kugel', r'der Würfel', r'der Zylinder', r'die Pyramide'],
    [r'Die Kugel umschließt ein Volumen mit der geringsten Hülle.',
     r'Deshalb sind Seifenblasen und Wassertropfen rund.'])

Q.q(r'Warum sind viele Konservendosen etwa so hoch wie breit?',
    [r'Bei Höhe gleich Durchmesser braucht ein Zylinder für sein Volumen am wenigsten Blech.', r'Weil sie so besser rollen.',
     r'Weil Kugeldosen verboten sind.', r'Weil sie dann mehr Volumen haben als jede andere Dose.'],
    [r'Für ein festes Volumen ist die Oberfläche eines Zylinders bei $h = 2r$ am kleinsten.',
     r'Das spart Material und Ressourcen.'])

Q.q(r'Ein Kirchturm besteht aus einem Quader (6 m × 6 m × 20 m) und einer quadratischen Pyramide (6 m Grundkante, 9 m hoch). Wie groß ist der umbaute Raum?',
    [r'828 m³', r'1044 m³', r'720 m³', r'936 m³'],
    [r'Quader: $36 \cdot 20 = 720$ m³',
     r'Pyramide: $\dfrac{1}{3} \cdot 36 \cdot 9 = 108$ m³',
     r'Zusammen 828 m³'])

Q.q(r'Eine Schüssel ist innen eine Halbkugel mit 12 cm Radius. Wie viel passt hinein (gerundet)?',
    [r'etwa 3,6 l', r'etwa 7,2 l', r'etwa 1,8 l', r'etwa 36 l'],
    [r'$V = \dfrac{2}{3}\pi \cdot 1728 = 1152\pi \approx 3619$ cm³',
     r'Also etwa 3,6 l.'])

Q.q(r'Ein Trichter besteht aus einem Kegel ($r = 6$ cm, $h = 8$ cm) und einem Auslaufrohr ($r = 0{,}5$ cm, 10 cm lang). Wie viel Wasser fasst er (gerundet)?',
    [r'309,4 cm³', r'301,6 cm³', r'912,6 cm³', r'7,9 cm³'],
    [r'Kegel: $\dfrac{1}{3}\pi \cdot 36 \cdot 8 = 96\pi$',
     r'Rohr: $\pi \cdot 0{,}25 \cdot 10 = 2{,}5\pi$',
     r'Zusammen $98{,}5\pi \approx 309{,}4$ cm³'])


def check():
    from math import pi, sqrt
    R = lambda v, n=1: round(v, n)
    assert R(102 * pi) == 320.4 and R(75 * pi) == 235.6 and R(32 * pi + 16 / 3 * pi) == 117.3
    assert 480 + 8 * 3 / 2 * 10 == 600
    rest = 1000 - 40 * pi
    assert R(rest) == 874.3 and round(7.8 * rest / 1000, 2) == 6.82
    assert R(48 * pi) == 150.8 and R(80 + 4 * 4 * sqrt(13) / 2) == 108.8
    assert R(900 * pi) == 2827.4 and R(75 * pi * 0.2) == 47.1
    assert round(16 / 3 * pi, 2) == 16.76 and round(12 * pi, 2) == 37.70
    assert round(pi + 4 / 3 * pi * 0.512, 2) == 5.29 and round((2 + 0.25 * pi) * 1000) == 2785
    assert 720 + 108 == 828 and R(1152 * pi / 1000) == 3.6 and R(98.5 * pi) == 309.4


Q.verify(check)
Q.save()
