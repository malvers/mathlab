#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 33 / KW 19 (Wahlpflichtbereich 3): Vermessungsprobleme –
Hilfsmittel, Höhenbestimmung, Strahlensätze, maßstäbliche Zeichnung. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=33, slug='vermessung-hilfsmittel', thema='Vermessungsprobleme: Hilfsmittel', lb='WB 3',
         blurb='Försterdreieck, Peilstab und Strahlensatz, Messrad, Schattenmethode, Daumensprung, Triangulation',
         comment='Blocks: forester triangle and angle of elevation (1-2, 9), intercept theorem and shadows (3-4, 10-11, 14), measuring wheel, steps and scale (5-8, 19), levelling and triangulation (15-18), right angle and thumb jump (12-13, 20). Thales and the pyramid: Diogenes Laertius, Lives of the Philosophers I 27.')

Q.q(r'Mit einem Försterdreieck ($45^\circ$) peilt man die Spitze eines Baumes an, wenn man 18 m vom Stamm entfernt steht. Die Augenhöhe ist 1,6 m. Wie hoch ist der Baum?',
    [r'19,6 m', r'18 m', r'16,4 m', r'25,5 m'],
    [r'Bei $45^\circ$ ist die Höhe über dem Auge so groß wie der Abstand: 18 m.', r'Dazu die Augenhöhe: $18 + 1{,}6 = 19{,}6$ m.'])

Q.q(r'Warum ist beim Försterdreieck die Höhe über Augenhöhe gleich dem Abstand zum Baum?',
    [r'Weil $\tan 45^\circ = 1$ ist.', r'Weil $\sin 45^\circ = 1$ ist.', r'Weil der Baum senkrecht steht.', r'Weil das Dreieck gleichseitig ist.'],
    [r'Im rechtwinkligen Dreieck aus Abstand und Höhe gilt $\tan 45^\circ = \dfrac{h}{d} = 1$.', r'Die beiden Katheten sind gleich lang.'])

Q.q(r'Ein 2 m hoher Stab steht 4 m vor dir. Liegst du mit dem Auge am Boden, liegen Stabspitze und Turmspitze auf einer Linie. Der Turm ist 40 m von dir entfernt. Wie hoch ist er?',
    [r'20 m', r'80 m', r'10 m', r'22 m'],
    [r'Strahlensatz: $\dfrac{h}{40} = \dfrac{2}{4}$', r'$h = 40 \cdot 0{,}5 = 20$ m'])

Q.q(r'Welche Beziehung nutzt die Messung mit dem Peilstab?',
    [r'den Strahlensatz', r'den Satz des Thales', r'den Kosinussatz', r'die Winkelsumme im Viereck'],
    [r'Stab und Turm stehen parallel, die Peillinie schneidet beide: ähnliche Dreiecke, Strahlensatz.'])

Q.q(r'Ein Messrad hat den Umfang 1 m. Beim Abfahren eines Weges dreht es sich 245-mal. Wie lang ist der Weg?',
    [r'245 m', r'24,5 m', r'769,7 m', r'2,45 km'],
    [r'Pro Umdrehung 1 m: $245 \cdot 1$ m $= 245$ m'])

Q.q(r'Welchen Durchmesser muss ein Messrad haben, damit sein Umfang genau 1 m beträgt (gerundet)?',
    [r'31,8 cm', r'50 cm', r'15,9 cm', r'1 m'],
    [r'$u = \pi d = 1$ m', r'$d = \dfrac{1}{\pi} \approx 0{,}318$ m $= 31{,}8$ cm'])

Q.q(r'Eine 40 m lange Strecke soll im Maßstab 1 : 500 gezeichnet werden. Wie lang wird sie auf dem Papier?',
    [r'8 cm', r'80 cm', r'0,8 cm', r'20 cm'],
    [r'40 m $= 4000$ cm', r'$4000 : 500 = 8$ cm'])

Q.q(r'In einer Zeichnung im Maßstab 1 : 500 ist eine Strecke 6,4 cm lang. Wie lang ist sie in Wirklichkeit?',
    [r'32 m', r'3,2 m', r'320 m', r'78 m'],
    [r'$6{,}4 \cdot 500 = 3200$ cm $= 32$ m'])

Q.q(r'Mit einer Winkelmess-App misst man aus 25 m Entfernung einen Höhenwinkel von $38^\circ$ zur Spitze eines Masts. Die Augenhöhe ist 1,5 m. Wie hoch ist der Mast (gerundet)?',
    [r'21,0 m', r'19,5 m', r'16,9 m', r'33,5 m'],
    [r'Über Augenhöhe: $25 \cdot \tan 38^\circ \approx 19{,}5$ m.', r'Mast: $19{,}5 + 1{,}5 = 21{,}0$ m'])

Q.q(r'Wer soll nach antiker Überlieferung die Höhe einer ägyptischen Pyramide mithilfe ihres Schattens bestimmt haben?',
    [r'Thales von Milet', r'Pythagoras von Samos', r'Archimedes', r'Euklid'],
    [r'Überliefert bei Diogenes Laertius (Leben der Philosophen, Buch I): Thales maß die Pyramide zu der Tageszeit, in der unser Schatten so lang ist wie wir selbst.',
     r'Dann ist auch der Schatten der Pyramide so lang wie ihre Höhe.'])

Q.q(r'Ein 1 m langer Stab wirft einen 1,25 m langen Schatten, ein Gebäude zur selben Zeit einen 15 m langen. Wie hoch ist das Gebäude?',
    [r'12 m', r'18,75 m', r'15 m', r'13,75 m'],
    [r'Höhe und Schatten stehen im selben Verhältnis: $\dfrac{h}{15} = \dfrac{1}{1{,}25}$.', r'$h = 15 : 1{,}25 = 12$ m'])

Q.q(r'Eine Schnur ist durch Knoten in 12 gleich lange Stücke geteilt. Welches Dreieck spannt man damit auf, um einen rechten Winkel abzustecken?',
    [r'3, 4 und 5 Stücke', r'4, 4 und 4 Stücke', r'2, 5 und 5 Stücke', r'3, 3 und 6 Stücke'],
    [r'$3^2 + 4^2 = 9 + 16 = 25 = 5^2$', r'Nach der Umkehrung des Satzes des Pythagoras liegt der rechte Winkel zwischen den Seiten 3 und 4.'])

Q.q(r'Was misst man mit einem Nivelliergerät?',
    [r'Höhenunterschiede im Gelände', r'die Temperatur', r'Entfernungen zu Sternen', r'die Masse eines Körpers'],
    [r'Das Gerät zeigt eine genau waagerechte Linie an. An senkrechten Messlatten liest man ab, wie weit der Boden darunter liegt.'])

Q.q(r'Zwei ähnliche Dreiecke: Im kleinen gehört zur 4 m langen Seite eine 3 m lange. Im großen ist die entsprechende Seite 24 m lang. Wie lang ist die gesuchte Seite (die Flussbreite)?',
    [r'18 m', r'32 m', r'23 m', r'12 m'],
    [r'Gleiches Verhältnis: $\dfrac{x}{24} = \dfrac{3}{4}$', r'$x = 24 \cdot 0{,}75 = 18$ m'])

Q.q(r'Beim Nivellieren liest man an der hinteren Latte 1,85 m ab, an der vorderen 0,60 m. Wie groß ist der Höhenunterschied der beiden Standpunkte?',
    [r'1,25 m, vorne höher', r'1,25 m, hinten höher', r'2,45 m, vorne höher', r'0,60 m, vorne höher'],
    [r'Die Ablesung zeigt, wie weit der Boden unter der waagerechten Ziellinie liegt.', r'Vorne ist der Abstand kleiner, der Boden also um $1{,}85 - 0{,}60 = 1{,}25$ m höher.'])

Q.q(r'Der Höhenunterschied von 1,25 m verteilt sich auf 50 m waagerechte Strecke. Wie groß ist die Steigung?',
    [r'2,5 %', r'25 %', r'1,25 %', r'40 %'],
    [r'$\dfrac{1{,}25}{50} = 0{,}025 = 2{,}5\,\%$'])

Q.q(r'Warum zerlegt man bei der Landesvermessung das Gelände in Dreiecke (Triangulation)?',
    [r'Man misst eine Basislinie und Winkel und berechnet die übrigen Strecken.', r'Dreiecke sind leichter zu zeichnen als Vierecke.',
     r'Man braucht dann gar keine Messung mehr.', r'Nur Dreiecke haben Flächeninhalte.'],
    [r'Winkel lassen sich auch über große Entfernungen genau messen, lange Strecken kaum.', r'Mit einer bekannten Seite und den Winkeln liefert der Sinussatz alle anderen Seiten.'])

Q.q(r'Bei einer Triangulation ist die Basislinie 500 m lang, an ihren Enden misst man die Winkel $60^\circ$ und $70^\circ$ zum Zielpunkt. Wie weit ist der Zielpunkt vom Endpunkt mit dem $60^\circ$-Winkel entfernt (gerundet)?',
    [r'613,3 m', r'565,3 m', r'500 m', r'436,3 m'],
    [r'Winkel am Zielpunkt: $180^\circ - 60^\circ - 70^\circ = 50^\circ$.', r'Die gesuchte Strecke liegt dem $70^\circ$-Winkel gegenüber: $\dfrac{500 \cdot \sin 70^\circ}{\sin 50^\circ} \approx 613{,}3$ m.'])

Q.q(r'20 Schritte ergeben ausgemessen 15 m. Wie lang ist ein Weg, für den man 140 Schritte braucht?',
    [r'105 m', r'186,7 m', r'75 m', r'115 m'],
    [r'Schrittlänge: $15 : 20 = 0{,}75$ m.', r'$140 \cdot 0{,}75 = 105$ m'])

Q.q(r'Beim Daumensprung ist der Arm 60 cm lang, die Augen sind 6 cm voneinander entfernt. Der Daumen springt vor einem Haus scheinbar um 30 m. Wie weit ist das Haus ungefähr entfernt?',
    [r'etwa 300 m', r'etwa 30 m', r'etwa 180 m', r'etwa 3 km'],
    [r'Armlänge zu Augenabstand: $60 : 6 = 10$.', r'Dasselbe Verhältnis gilt draußen (Strahlensatz): Entfernung $\approx 10 \cdot 30$ m $= 300$ m.'])


def check():
    from math import tan, sin, pi, radians as r
    R = lambda x, n=1: round(x, n)
    assert 18 + 1.6 == 19.6 and R(tan(r(45)), 9) == 1 and 40 * 2 / 4 == 20
    assert 245 * 1 == 245 and R(100 / pi) == 31.8 and 4000 / 500 == 8 and 6.4 * 500 == 3200
    assert R(25 * tan(r(38))) == 19.5 and R(25 * tan(r(38)) + 1.5) == 21.0 and 15 / 1.25 == 12
    assert 3 ** 2 + 4 ** 2 == 5 ** 2 and 3 + 4 + 5 == 12 and 24 * 3 / 4 == 18
    assert R(1.85 - 0.60, 2) == 1.25 and 1.25 / 50 == 0.025
    assert R(500 * sin(r(70)) / sin(r(50))) == 613.3 and R(500 * sin(r(60)) / sin(r(50))) == 565.3
    assert 140 * 15 / 20 == 105 and 60 / 6 * 30 == 300


Q.verify(check)
Q.save()
