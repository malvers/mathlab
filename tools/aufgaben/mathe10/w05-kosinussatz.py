#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 5 / KW 38 (LB 1): der Kosinussatz.
Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=5, slug='kosinussatz', thema='Der Kosinussatz', lb='LB 1',
         blurb='Kosinussatz aufstellen und umstellen, dritte Seite, Winkel aus drei Seiten, Sinussatz oder Kosinussatz',
         comment='Blocks: the law (1-5), third side (6-10), angles from three sides (11-15), context and choice (16-20). Results rounded to one decimal.')

# ----------------------------------------------------------------- Der Satz ----
Q.q(r'Wie lautet der Kosinussatz für die Seite $a$?',
    [r'$a^2 = b^2 + c^2 - 2bc \cdot \cos \alpha$', r'$a^2 = b^2 + c^2$',
     r'$a^2 = b^2 + c^2 + 2bc \cdot \cos \alpha$', r'$a = b + c - 2bc \cdot \cos \alpha$'],
    [r'Der Winkel im Kosinussatz ist der Winkel, der der gesuchten Seite gegenüberliegt – also der zwischen $b$ und $c$.',
     r'$a^2 = b^2 + c^2 - 2bc \cdot \cos \alpha$'])

Q.q(r'Was wird aus dem Kosinussatz $c^2 = a^2 + b^2 - 2ab \cdot \cos \gamma$, wenn $\gamma = 90^\circ$ ist?',
    [r'der Satz des Pythagoras', r'der Sinussatz', r'die Winkelsumme', r'die Flächenformel'],
    [r'$\cos 90^\circ = 0$, das letzte Glied fällt weg.',
     r'Es bleibt $c^2 = a^2 + b^2$ – der Satz des Pythagoras ist ein Sonderfall des Kosinussatzes.'])

Q.q(r'Wann hilft der Kosinussatz weiter?',
    [r'wenn drei Seiten oder zwei Seiten und der eingeschlossene Winkel bekannt sind', r'nur in rechtwinkligen Dreiecken',
     r'wenn zwei Winkel und eine Seite bekannt sind', r'wenn nur die drei Winkel bekannt sind'],
    [r'Im Kosinussatz stehen drei Seiten und ein Winkel. Kennt man drei dieser vier Größen, findet man die vierte.',
     r'Bei zwei Winkeln und einer Seite ist der Sinussatz schneller.'])

Q.q(r'Stelle $a^2 = b^2 + c^2 - 2bc \cdot \cos \alpha$ nach $\cos \alpha$ um.',
    [r'$\cos \alpha = \dfrac{b^2 + c^2 - a^2}{2bc}$', r'$\cos \alpha = \dfrac{a^2 - b^2 - c^2}{2bc}$',
     r'$\cos \alpha = \dfrac{b^2 + c^2 + a^2}{2bc}$', r'$\cos \alpha = \dfrac{2bc}{b^2 + c^2 - a^2}$'],
    [r'$2bc \cdot \cos \alpha$ auf die linke Seite, $a^2$ auf die rechte: $2bc \cdot \cos \alpha = b^2 + c^2 - a^2$.',
     r'Durch $2bc$ teilen.'])

Q.q(r'Du rechnest und erhältst $\cos \gamma = -0{,}3$. Was bedeutet das?',
    [r'Der Winkel $\gamma$ ist stumpf.', r'Es liegt sicher ein Rechenfehler vor.',
     r'Der Winkel $\gamma$ ist spitz.', r'Das Dreieck existiert nicht.'],
    [r'Für Winkel zwischen $90^\circ$ und $180^\circ$ ist der Kosinus negativ.',
     r'$\gamma = \cos^{-1}(-0{,}3) \approx 107{,}5^\circ$ – ein stumpfer Winkel, alles in Ordnung.'])

# ----------------------------------------------------------- dritte Seite ----
Q.q(r'Gegeben: $b = 5$ cm, $c = 7$ cm, $\alpha = 60^\circ$. Berechne $a$ (gerundet).',
    [r'6,2 cm', r'8,6 cm', r'7,5 cm', r'39 cm'],
    [r'$a^2 = 5^2 + 7^2 - 2 \cdot 5 \cdot 7 \cdot \cos 60^\circ = 25 + 49 - 35 = 39$',
     r'$a = \sqrt{39} \approx 6{,}2$ cm – die Wurzel nicht vergessen.'])

Q.q(r'Gegeben: $a = 8$ cm, $b = 11$ cm, $\gamma = 35^\circ$. Berechne $c$ (gerundet).',
    [r'6,4 cm', r'13,6 cm', r'9,2 cm', r'40,8 cm'],
    [r'$c^2 = 64 + 121 - 2 \cdot 8 \cdot 11 \cdot \cos 35^\circ \approx 185 - 144{,}2 = 40{,}8$',
     r'$c \approx \sqrt{40{,}8} \approx 6{,}4$ cm'])

Q.q(r'Ein Parallelogramm hat die Seiten 6 cm und 4 cm und einen Innenwinkel von $60^\circ$. Wie lang ist die kürzere Diagonale (gerundet)?',
    [r'5,3 cm', r'8,7 cm', r'7,2 cm', r'10 cm'],
    [r'Die kürzere Diagonale liegt dem $60^\circ$-Winkel gegenüber.',
     r'$e^2 = 36 + 16 - 2 \cdot 6 \cdot 4 \cdot \cos 60^\circ = 52 - 24 = 28$, also $e \approx 5{,}3$ cm.'])

Q.q(r'Ein dreieckiges Grundstück hat zwei Seiten von 30 m und 40 m, die einen Winkel von $50^\circ$ einschließen. Wie lang ist die dritte Seite (gerundet)?',
    [r'30,9 m', r'50,0 m', r'25,7 m', r'70 m'],
    [r'$x^2 = 30^2 + 40^2 - 2 \cdot 30 \cdot 40 \cdot \cos 50^\circ \approx 2500 - 1542{,}7 = 957{,}3$',
     r'$x \approx 30{,}9$ m. 50 m wäre die Länge bei einem rechten Winkel.'])

Q.q(r'Zwei Dachsparren von je 5 m treffen sich am First unter einem Winkel von $100^\circ$. Wie weit liegen ihre unteren Enden auseinander (gerundet)?',
    [r'7,7 m', r'6,4 m', r'10 m', r'7,1 m'],
    [r'$x^2 = 25 + 25 - 2 \cdot 5 \cdot 5 \cdot \cos 100^\circ \approx 50 + 8{,}7 = 58{,}7$',
     r'Weil $\cos 100^\circ$ negativ ist, wird hier addiert: $x \approx 7{,}7$ m.'])

# ---------------------------------------------------- Winkel aus drei Seiten ----
Q.q(r'Ein Dreieck hat die Seiten 5 cm, 6 cm und 7 cm. Wie groß ist der Winkel gegenüber der 7-cm-Seite (gerundet)?',
    [r'$78{,}5^\circ$', r'$11{,}5^\circ$', r'$101{,}5^\circ$', r'$60^\circ$'],
    [r'$\cos \gamma = \dfrac{5^2 + 6^2 - 7^2}{2 \cdot 5 \cdot 6} = \dfrac{12}{60} = 0{,}2$',
     r'$\gamma = \cos^{-1}(0{,}2) \approx 78{,}5^\circ$'])

Q.q(r'Ein Dreieck hat die Seiten 3 cm, 5 cm und 7 cm. Wie groß ist sein größter Winkel?',
    [r'$120^\circ$', r'$60^\circ$', r'$30^\circ$', r'$150^\circ$'],
    [r'Der größte Winkel liegt der größten Seite (7 cm) gegenüber.',
     r'$\cos \gamma = \dfrac{9 + 25 - 49}{2 \cdot 3 \cdot 5} = \dfrac{-15}{30} = -0{,}5$, also $\gamma = 120^\circ$.'])

Q.q(r'Ein Dreieck hat die Seiten 7 cm, 8 cm und 9 cm. Wie groß ist der Winkel gegenüber der 9-cm-Seite (gerundet)?',
    [r'$73{,}4^\circ$', r'$58{,}4^\circ$', r'$48{,}2^\circ$', r'$106{,}6^\circ$'],
    [r'$\cos \gamma = \dfrac{49 + 64 - 81}{2 \cdot 7 \cdot 8} = \dfrac{32}{112} \approx 0{,}286$',
     r'$\gamma \approx 73{,}4^\circ$'])

Q.q(r'Ein Dreieck hat die Seiten $a = 13$ cm, $b = 14$ cm und $c = 15$ cm. Wie groß ist $\alpha$ (gerundet)?',
    [r'$53{,}1^\circ$', r'$59{,}5^\circ$', r'$67{,}4^\circ$', r'$36{,}9^\circ$'],
    [r'$\cos \alpha = \dfrac{14^2 + 15^2 - 13^2}{2 \cdot 14 \cdot 15} = \dfrac{252}{420} = 0{,}6$',
     r'$\alpha \approx 53{,}1^\circ$'])

Q.q(r'Was liefert der Kosinussatz für jeden Winkel eines gleichseitigen Dreiecks mit der Seite $s$?',
    [r'$\cos \alpha = 0{,}5$, also $60^\circ$', r'$\cos \alpha = 0$, also $90^\circ$',
     r'$\cos \alpha = 1$, also $0^\circ$', r'$\cos \alpha = -0{,}5$, also $120^\circ$'],
    [r'$\cos \alpha = \dfrac{s^2 + s^2 - s^2}{2 s^2} = \dfrac{s^2}{2 s^2} = 0{,}5$',
     r'Das passt zur Winkelsumme: drei gleiche Winkel von je $60^\circ$.'])

# ------------------------------------------------------ Sachbezug und Wahl ----
Q.q(r'Von einem Punkt P aus ist A 450 m und B 620 m entfernt, der Winkel APB beträgt $72^\circ$. Wie weit liegen A und B auseinander (gerundet)?',
    [r'643,8 m', r'766,1 m', r'1070 m', r'170 m'],
    [r'$AB^2 = 450^2 + 620^2 - 2 \cdot 450 \cdot 620 \cdot \cos 72^\circ \approx 586\,900 - 172\,431 = 414\,469$',
     r'$AB \approx 643{,}8$ m'])

Q.q(r'Ein Flugzeug fliegt 200 km geradeaus, dreht dann um $40^\circ$ nach rechts und fliegt weitere 150 km. Wie weit ist es jetzt vom Start entfernt (gerundet)?',
    [r'329,3 km', r'350 km', r'128,6 km', r'250 km'],
    [r'Im Dreieck aus beiden Flugstrecken liegt zwischen ihnen der Winkel $180^\circ - 40^\circ = 140^\circ$.',
     r'$d^2 = 200^2 + 150^2 - 2 \cdot 200 \cdot 150 \cdot \cos 140^\circ \approx 62\,500 + 45\,963 = 108\,463$',
     r'$d \approx 329{,}3$ km – mit $\cos 40^\circ$ statt $\cos 140^\circ$ käme fälschlich 128,6 km heraus.'])

Q.q(r'Bekannt sind $b$, $c$ und $\alpha$. Womit berechnest du $a$ am direktesten?',
    [r'mit dem Kosinussatz', r'mit dem Sinussatz', r'mit dem Satz des Pythagoras', r'mit der Winkelsumme'],
    [r'$\alpha$ ist der von $b$ und $c$ eingeschlossene Winkel (SWS).',
     r'Zu keiner bekannten Seite kennt man den Gegenwinkel – der Sinussatz hat keinen Ansatz. Der Kosinussatz liefert $a$ sofort.'])

Q.q(r'Mit den Seiten 4 cm, 5 cm und 10 cm erhältst du $\cos \gamma = -1{,}475$. Was bedeutet das?',
    [r'Ein solches Dreieck gibt es nicht.', r'Der Winkel ist größer als $180^\circ$.',
     r'Der Winkel ist genau $90^\circ$.', r'Der Taschenrechner steht auf Bogenmaß.'],
    [r'Der Kosinus eines Winkels liegt immer zwischen $-1$ und 1.',
     r'Die Seiten verletzen die Dreiecksungleichung: $4 + 5 = 9 < 10$.'])

Q.q(r'Welche Angaben reichen nicht aus, um ein Dreieck eindeutig zu berechnen?',
    [r'die drei Winkel', r'die drei Seiten', r'zwei Seiten und der eingeschlossene Winkel', r'eine Seite und die beiden anliegenden Winkel'],
    [r'Drei Winkel legen nur die Form fest: ein Dreieck mit $50^\circ$, $60^\circ$, $70^\circ$ gibt es in jeder Größe.',
     r'Alle anderen Angaben entsprechen einem Kongruenzsatz (SSS, SWS, WSW).'])


def check():
    from math import cos, acos, sqrt, radians as r, degrees as d
    R = lambda x, n=1: round(x, n)
    c = lambda w: cos(r(w))
    assert R(d(acos(-0.3))) == 107.5
    assert R(25 + 49 - 2 * 5 * 7 * c(60), 6) == 39 and R(sqrt(39)) == 6.2 and R(sqrt(74)) == 8.6 and R(sqrt(74 - 5 * 7 * c(60))) == 7.5
    c2 = 64 + 121 - 2 * 8 * 11 * c(35)
    assert R(c2) == 40.8 and R(sqrt(c2)) == 6.4 and R(sqrt(185)) == 13.6
    from math import sin
    assert R(sqrt(185 - 176 * sin(r(35)))) == 9.2
    assert R(36 + 16 - 48 * c(60), 6) == 28 and R(sqrt(28)) == 5.3 and R(sqrt(36 + 16 + 24)) == 8.7 and R(sqrt(52)) == 7.2
    x2 = 900 + 1600 - 2400 * c(50)
    assert R(sqrt(x2)) == 30.9 and sqrt(2500) == 50 and R(sqrt(2500 - 2400 * sin(r(50)))) == 25.7
    y2 = 50 - 50 * c(100)
    assert R(sqrt(y2)) == 7.7 and R(sqrt(50 + 50 * c(100))) == 6.4 and R(sqrt(50)) == 7.1
    assert R(d(acos(12 / 60))) == 78.5 and R(d(acos(-0.2))) == 101.5 and R(90 - d(acos(0.2))) == 11.5
    assert (9 + 25 - 49) / 30 == -0.5 and R(d(acos(-0.5))) == 120
    g = d(acos(32 / 112))
    assert R(g) == 73.4 and R(d(acos(66 / 126))) == 58.4 and R(d(acos(96 / 144))) == 48.2 and R(180 - g) == 106.6
    assert 252 / 420 == 0.6 and R(d(acos(0.6))) == 53.1 and R(d(acos(198 / 390))) == 59.5 and R(d(acos(140 / 364))) == 67.4
    ab2 = 450 ** 2 + 620 ** 2 - 2 * 450 * 620 * c(72)
    assert R(ab2, 0) == 414469 and R(sqrt(ab2)) == 643.8 and R(sqrt(450 ** 2 + 620 ** 2)) == 766.1
    d2 = 200 ** 2 + 150 ** 2 - 2 * 200 * 150 * c(140)
    assert R(d2, 0) == 108463 and R(sqrt(d2)) == 329.3 and R(sqrt(62500 - 2 * 200 * 150 * c(40))) == 128.6
    assert (16 + 25 - 100) / 40 == -1.475 and 4 + 5 < 10


Q.verify(check)
Q.save()
