#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 8 / KW 41: Vorbereitung Klassenarbeit 1 –
Dreiecke und Vielecke (LB 1 gemischt). Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=8, slug='ka1', thema='Klassenarbeit 1: Dreiecke und Vielecke', lb='KA 1',
         blurb='gemischte Aufgaben zu LB 1 zur Vorbereitung auf die Klassenarbeit',
         comment='Blocks: figures and angles (1-4), right triangles (5-8), law of sines (9-12), law of cosines (13-16), areas and context (17-20). Results rounded to one decimal.')

# --------------------------------------------------------- Figuren, Winkel ----
Q.q(r'Welches Viereck hat vier gleich lange Seiten, aber nicht unbedingt rechte Winkel?',
    [r'Raute', r'Rechteck', r'Trapez', r'Drachenviereck'],
    [r'Vier gleich lange Seiten: Raute oder Quadrat.',
     r'Das Quadrat hat zusätzlich rechte Winkel – ohne diese Bedingung bleibt die Raute.'])

Q.q(r'In einem gleichschenkligen Dreieck ist der Winkel an der Spitze $36^\circ$. Wie groß ist jeder Basiswinkel?',
    [r'$72^\circ$', r'$36^\circ$', r'$144^\circ$', r'$54^\circ$'],
    [r'Beide Basiswinkel sind gleich groß: $180^\circ - 36^\circ = 144^\circ$ für beide zusammen.',
     r'$144^\circ : 2 = 72^\circ$'])

Q.q(r'Wie groß ist ein Innenwinkel eines regelmäßigen Zehnecks?',
    [r'$144^\circ$', r'$36^\circ$', r'$162^\circ$', r'$108^\circ$'],
    [r'Winkelsumme: $(10 - 2) \cdot 180^\circ = 1440^\circ$.',
     r'Ein Winkel: $1440^\circ : 10 = 144^\circ$'])

Q.q(r'In einem Trapez ABCD mit AB parallel zu CD ist $\alpha = 65^\circ$. Wie groß ist $\delta$ (der Winkel bei D)?',
    [r'$115^\circ$', r'$65^\circ$', r'$25^\circ$', r'$295^\circ$'],
    [r'An einem Schenkel des Trapezes liegen zwei Winkel zwischen parallelen Seiten (Nachbarwinkel).',
     r'Sie ergänzen sich zu $180^\circ$: $\delta = 180^\circ - 65^\circ = 115^\circ$.'])

# ----------------------------------------------- rechtwinklige Dreiecke ----
Q.q(r'Ein rechtwinkliges Dreieck hat die Katheten 9 cm und 12 cm. Wie lang ist die Hypotenuse?',
    [r'15 cm', r'21 cm', r'7,9 cm', r'225 cm'],
    [r'$c = \sqrt{9^2 + 12^2} = \sqrt{81 + 144} = \sqrt{225} = 15$, also 15 cm.'])

Q.q(r'Im rechtwinkligen Dreieck ist die Hypotenuse 20 cm lang, ein spitzer Winkel misst $25^\circ$. Wie lang ist die Gegenkathete dieses Winkels (gerundet)?',
    [r'8,5 cm', r'18,1 cm', r'9,3 cm', r'47,3 cm'],
    [r'$a = c \cdot \sin \alpha = 20 \cdot \sin 25^\circ \approx 20 \cdot 0{,}423 \approx 8{,}5$ cm'])

Q.q(r'Eine 6 m lange Rampe überwindet 0,8 m Höhe. Wie groß ist der Neigungswinkel (gerundet)?',
    [r'$7{,}7^\circ$', r'$7{,}6^\circ$', r'$82{,}3^\circ$', r'$13{,}3^\circ$'],
    [r'Die Rampe ist die Hypotenuse: $\sin \alpha = \dfrac{0{,}8}{6} \approx 0{,}133$.',
     r'$\alpha \approx 7{,}7^\circ$. (Mit dem Tangens rechnet man fälschlich, als wäre 6 m die waagerechte Strecke.)'])

Q.q(r'Ein gleichschenkliges Dreieck hat die Basis 16 cm und die Basiswinkel $50^\circ$. Wie hoch ist es (gerundet)?',
    [r'9,5 cm', r'6,1 cm', r'19,1 cm', r'12,4 cm'],
    [r'Die Höhe halbiert die Basis: Ankathete 8 cm am Basiswinkel.',
     r'$h = 8 \cdot \tan 50^\circ \approx 8 \cdot 1{,}192 \approx 9{,}5$ cm'])

# -------------------------------------------------------------- Sinussatz ----
Q.q(r'Gegeben: $a = 10$ cm, $\alpha = 50^\circ$, $\beta = 70^\circ$. Berechne $b$ (gerundet).',
    [r'12,3 cm', r'8,2 cm', r'14 cm', r'11,3 cm'],
    [r'$b = \dfrac{a \cdot \sin \beta}{\sin \alpha} = \dfrac{10 \cdot \sin 70^\circ}{\sin 50^\circ} \approx \dfrac{9{,}40}{0{,}766} \approx 12{,}3$ cm'])

Q.q(r'Im selben Dreieck ($a = 10$ cm, $\alpha = 50^\circ$, $\beta = 70^\circ$): Berechne $c$ (gerundet).',
    [r'11,3 cm', r'12,3 cm', r'13,1 cm', r'8,7 cm'],
    [r'$\gamma = 180^\circ - 50^\circ - 70^\circ = 60^\circ$',
     r'$c = \dfrac{10 \cdot \sin 60^\circ}{\sin 50^\circ} \approx \dfrac{8{,}66}{0{,}766} \approx 11{,}3$ cm'])

Q.q(r'Gegeben: $a = 6$ cm, $b = 8$ cm, $\beta = 80^\circ$. Wie groß ist $\alpha$ (gerundet)?',
    [r'$47{,}6^\circ$', r'$60^\circ$', r'$132{,}4^\circ$', r'$52{,}4^\circ$'],
    [r'$\sin \alpha = \dfrac{6 \cdot \sin 80^\circ}{8} \approx 0{,}739$',
     r'$\alpha \approx 47{,}6^\circ$. Die stumpfe Lösung scheidet aus, da $\alpha$ der kleineren Seite gegenüberliegt.'])

Q.q(r'Die Punkte A und B liegen 250 m auseinander. Von A aus erscheint ein Turm T unter $\angle TAB = 58^\circ$, von B aus unter $\angle ABT = 47^\circ$. Wie weit ist der Turm von B entfernt (gerundet)?',
    [r'219,5 m', r'189,3 m', r'250 m', r'264,2 m'],
    [r'Winkel beim Turm: $180^\circ - 58^\circ - 47^\circ = 75^\circ$.',
     r'BT liegt dem Winkel bei A gegenüber: $BT = \dfrac{250 \cdot \sin 58^\circ}{\sin 75^\circ} \approx 219{,}5$ m.'])

# ------------------------------------------------------------ Kosinussatz ----
Q.q(r'Gegeben: $b = 9$ cm, $c = 6$ cm, $\alpha = 50^\circ$. Berechne $a$ (gerundet).',
    [r'6,9 cm', r'10,8 cm', r'47,6 cm', r'8,4 cm'],
    [r'$a^2 = 81 + 36 - 2 \cdot 9 \cdot 6 \cdot \cos 50^\circ \approx 117 - 69{,}4 = 47{,}6$',
     r'$a \approx \sqrt{47{,}6} \approx 6{,}9$ cm'])

Q.q(r'Ein Dreieck hat die Seiten 4 cm, 7 cm und 9 cm. Wie groß ist der größte Winkel (gerundet)?',
    [r'$106{,}6^\circ$', r'$73{,}4^\circ$', r'$25{,}2^\circ$', r'$48{,}2^\circ$'],
    [r'Er liegt der 9-cm-Seite gegenüber: $\cos \gamma = \dfrac{16 + 49 - 81}{2 \cdot 4 \cdot 7} = \dfrac{-16}{56} \approx -0{,}286$.',
     r'$\gamma \approx 106{,}6^\circ$ – negativer Kosinus, stumpfer Winkel.'])

Q.q(r'Zwei Wanderwege trennen sich an einer Kreuzung unter $70^\circ$. Anna geht 3 km auf dem einen, Ben 4 km auf dem anderen. Wie weit sind sie dann voneinander entfernt (gerundet)?',
    [r'4,1 km', r'5,0 km', r'7 km', r'2,9 km'],
    [r'$d^2 = 3^2 + 4^2 - 2 \cdot 3 \cdot 4 \cdot \cos 70^\circ \approx 25 - 8{,}21 = 16{,}79$',
     r'$d \approx 4{,}1$ km'])

Q.q(r'Bekannt sind die drei Seiten eines Dreiecks. Womit berechnest du zuerst einen Winkel?',
    [r'mit dem Kosinussatz', r'mit dem Sinussatz', r'mit der Winkelsumme', r'mit dem Tangens'],
    [r'Der Sinussatz braucht ein Paar aus Seite und Gegenwinkel – das fehlt.',
     r'Der Kosinussatz liefert aus drei Seiten jeden Winkel.'])

# -------------------------------------------------- Flächen, Sachbezug ----
Q.q(r'Berechne den Flächeninhalt eines Dreiecks mit $a = 10$ cm, $b = 7$ cm und $\gamma = 45^\circ$ (gerundet).',
    [r'24,7 cm²', r'49,5 cm²', r'35 cm²', r'17,5 cm²'],
    [r'$A = \dfrac{1}{2} \cdot 10 \cdot 7 \cdot \sin 45^\circ = 35 \cdot 0{,}707 \approx 24{,}7$ cm²'])

Q.q(r'Ein Drachen hat die Diagonalen 60 cm und 40 cm. Wie groß ist seine Fläche?',
    [r'1200 cm²', r'2400 cm²', r'100 cm²', r'600 cm²'],
    [r'Im Drachenviereck stehen die Diagonalen senkrecht aufeinander.',
     r'$A = \dfrac{e \cdot f}{2} = \dfrac{60 \cdot 40}{2} = 1200$ cm²'])

Q.q(r'Ein Grundstück hat die Form eines Dreiecks mit den Seiten 40 m und 55 m und dem eingeschlossenen Winkel $68^\circ$. Ein Quadratmeter kostet 120 €. Was kostet das Grundstück (gerundet auf Hunderter)?',
    [r'122 400 €', r'264 000 €', r'49 400 €', r'132 000 €'],
    [r'$A = \dfrac{1}{2} \cdot 40 \cdot 55 \cdot \sin 68^\circ \approx 1100 \cdot 0{,}927 \approx 1019{,}9$ m²',
     r'$1019{,}9 \cdot 120 \approx 122\,388$ €, gerundet 122 400 €.'])

Q.q(r'Ein Segelboot fährt 6 km nach Osten, dann 4 km in eine Richtung, die mit der ersten Strecke einen Innenwinkel von $110^\circ$ bildet. Wie weit ist es vom Start entfernt (gerundet)?',
    [r'8,3 km', r'10 km', r'5,9 km', r'7,2 km'],
    [r'Zwischen den beiden Strecken liegt im Dreieck der Winkel $110^\circ$.',
     r'$d^2 = 36 + 16 - 2 \cdot 6 \cdot 4 \cdot \cos 110^\circ \approx 52 + 16{,}4 = 68{,}4$',
     r'$d \approx 8{,}3$ km'])


def check():
    from math import sin, cos, asin, acos, atan, sqrt, radians as r, degrees as d
    R = lambda x, n=1: round(x, n)
    s, c = (lambda w: sin(r(w))), (lambda w: cos(r(w)))
    assert (180 - 36) / 2 == 72
    assert (10 - 2) * 180 / 10 == 144
    assert 180 - 65 == 115
    assert sqrt(81 + 144) == 15
    t = lambda w: sin(r(w)) / cos(r(w))
    assert R(20 * s(25)) == 8.5 and R(20 * c(25)) == 18.1 and R(20 * t(25)) == 9.3 and R(20 / s(25)) == 47.3
    assert R(d(asin(0.8 / 6))) == 7.7 and R(d(atan(0.8 / 6))) == 7.6 and R(d(acos(0.8 / 6))) == 82.3
    assert R(8 * t(50)) == 9.5 and R(8 * s(50)) == 6.1 and R(16 * t(50)) == 19.1 and R(8 / c(50)) == 12.4
    assert R(10 * s(70) / s(50)) == 12.3 and R(10 * s(50) / s(70)) == 8.2
    assert 180 - 50 - 70 == 60 and R(10 * s(60) / s(50)) == 11.3
    al = d(asin(6 * s(80) / 8))
    assert R(al) == 47.6 and R(180 - al) == 132.4
    assert 180 - 58 - 47 == 75 and R(250 * s(58) / s(75)) == 219.5 and R(250 * s(47) / s(75)) == 189.3
    a2 = 81 + 36 - 2 * 9 * 6 * c(50)
    assert R(a2) == 47.6 and R(sqrt(a2)) == 6.9 and R(sqrt(117)) == 10.8
    g = d(acos((16 + 49 - 81) / 56))
    assert R(g) == 106.6 and R(180 - g) == 73.4
    d2 = 9 + 16 - 24 * c(70)
    assert R(d2, 2) == 16.79 and R(sqrt(d2)) == 4.1
    assert R(35 * s(45)) == 24.7 and R(70 * s(45)) == 49.5
    assert 60 * 40 / 2 == 1200
    A = 0.5 * 40 * 55 * s(68)
    assert R(A) == 1019.9 and R(A * 120, -2) == 122400
    e2 = 36 + 16 - 48 * c(110)
    assert R(e2) == 68.4 and R(sqrt(e2)) == 8.3 and R(sqrt(52)) == 7.2


Q.verify(check)
Q.save()
