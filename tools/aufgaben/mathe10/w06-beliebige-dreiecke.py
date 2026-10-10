#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 6 / KW 39 (LB 1): Berechnungen in beliebigen
Dreiecken und Vielecken. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=6, slug='beliebige-dreiecke', thema='Beliebige Dreiecke und Vielecke', lb='LB 1',
         blurb='Flächeninhalt mit dem Sinus, Vielecke zerlegen, Vermessungsaufgaben',
         comment='Blocks: area with the sine (1-6), regular polygons (7-10), polygons split into triangles (11-14), mixed surveying tasks (15-20). Results rounded to one decimal.')

# --------------------------------------------------- Fläche mit dem Sinus ----
Q.q(r'Mit welcher Formel berechnest du den Flächeninhalt eines Dreiecks aus zwei Seiten $a$, $b$ und dem eingeschlossenen Winkel $\gamma$?',
    [r'$A = \dfrac{1}{2} \cdot a \cdot b \cdot \sin \gamma$', r'$A = a \cdot b \cdot \sin \gamma$',
     r'$A = \dfrac{1}{2} \cdot a \cdot b \cdot \cos \gamma$', r'$A = \dfrac{1}{2} \cdot a \cdot b$'],
    [r'Die Höhe auf $a$ ist $h_a = b \cdot \sin \gamma$ (rechtwinkliges Teildreieck).',
     r'$A = \dfrac{1}{2} \cdot a \cdot h_a = \dfrac{1}{2} \cdot a \cdot b \cdot \sin \gamma$'])

Q.q(r'Berechne den Flächeninhalt: $a = 8$ cm, $b = 5$ cm, $\gamma = 30^\circ$.',
    [r'10 cm²', r'20 cm²', r'17,3 cm²', r'40 cm²'],
    [r'$A = \dfrac{1}{2} \cdot 8 \cdot 5 \cdot \sin 30^\circ = 20 \cdot 0{,}5 = 10$, also 10 cm².'])

Q.q(r'Berechne den Flächeninhalt (gerundet): $b = 12$ m, $c = 9$ m, $\alpha = 75^\circ$.',
    [r'52,2 m²', r'104,3 m²', r'14,0 m²', r'54 m²'],
    [r'$A = \dfrac{1}{2} \cdot 12 \cdot 9 \cdot \sin 75^\circ \approx 54 \cdot 0{,}966 \approx 52{,}2$ m²'])

Q.q(r'Ein Dreieck hat den Flächeninhalt 24 cm², zwei Seiten sind 8 cm und 12 cm lang. Wie groß ist der eingeschlossene (spitze) Winkel?',
    [r'$30^\circ$', r'$60^\circ$', r'$45^\circ$', r'$15^\circ$'],
    [r'$24 = \dfrac{1}{2} \cdot 8 \cdot 12 \cdot \sin \gamma = 48 \cdot \sin \gamma$',
     r'$\sin \gamma = 0{,}5$, also $\gamma = 30^\circ$ (die stumpfe Möglichkeit wäre $150^\circ$).'])

Q.q(r'Für welchen eingeschlossenen Winkel wird der Flächeninhalt eines Dreiecks mit zwei festen Seiten am größten?',
    [r'$90^\circ$', r'$60^\circ$', r'$45^\circ$', r'$180^\circ$'],
    [r'Der Flächeninhalt ist proportional zu $\sin \gamma$.',
     r'Der Sinus ist bei $90^\circ$ am größten (Wert 1). Bei $180^\circ$ liegt das Dreieck flach, die Fläche ist null.'])

Q.q(r'Berechne den Flächeninhalt eines Parallelogramms mit den Seiten 10 cm und 6 cm und einem Innenwinkel von $50^\circ$ (gerundet).',
    [r'46,0 cm²', r'23,0 cm²', r'60 cm²', r'38,6 cm²'],
    [r'Die Diagonale teilt das Parallelogramm in zwei gleich große Dreiecke.',
     r'$A = 2 \cdot \dfrac{1}{2} \cdot 10 \cdot 6 \cdot \sin 50^\circ = 60 \cdot 0{,}766 \approx 46{,}0$ cm²'])

# ------------------------------------------------- regelmäßige Vielecke ----
Q.q(r'Ein regelmäßiges Sechseck hat die Seitenlänge 4 cm. In wie viele gleichseitige Dreiecke kann man es vom Mittelpunkt aus zerlegen?',
    [r'6', r'4', r'3', r'12'],
    [r'Vom Mittelpunkt zu den sechs Ecken entstehen sechs Dreiecke mit Mittelpunktswinkel $360^\circ : 6 = 60^\circ$.',
     r'Die beiden Seiten am Mittelpunkt sind gleich lang, also sind auch die Basiswinkel $60^\circ$: alle sechs Dreiecke sind gleichseitig.'])

Q.q(r'Berechne den Flächeninhalt dieses regelmäßigen Sechsecks mit der Seite 4 cm (gerundet).',
    [r'41,6 cm²', r'6,9 cm²', r'24 cm²', r'96 cm²'],
    [r'Ein gleichseitiges Dreieck mit Seite 4 cm hat $A = \dfrac{1}{2} \cdot 4 \cdot 4 \cdot \sin 60^\circ \approx 6{,}93$ cm².',
     r'Sechseck: $6 \cdot 6{,}93 \approx 41{,}6$ cm²'])

Q.q(r'Wie groß ist der Mittelpunktswinkel eines regelmäßigen Achtecks?',
    [r'$45^\circ$', r'$135^\circ$', r'$60^\circ$', r'$22{,}5^\circ$'],
    [r'Die acht Bestimmungsdreiecke teilen den Vollwinkel gleichmäßig.',
     r'$360^\circ : 8 = 45^\circ$. ($135^\circ$ ist der Innenwinkel des Achtecks.)'])

Q.q(r'Ein regelmäßiges Achteck hat den Umkreisradius 5 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'70,7 cm²', r'78,5 cm²', r'100 cm²', r'8,8 cm²'],
    [r'Acht Dreiecke mit zwei Seiten von 5 cm und dem Winkel $45^\circ$ dazwischen.',
     r'$A = 8 \cdot \dfrac{1}{2} \cdot 5 \cdot 5 \cdot \sin 45^\circ = 100 \cdot 0{,}707 \approx 70{,}7$ cm²',
     r'Plausibel: etwas weniger als der Kreis mit $\pi \cdot 25 \approx 78{,}5$ cm².'])

# --------------------------------------------------- Vielecke zerlegen ----
Q.q(r'Ein Viereck ABCD wird durch die Diagonale AC in zwei Dreiecke zerlegt. Die Teildreiecke haben 18 m² und 27 m². Wie groß ist das Viereck?',
    [r'45 m²', r'9 m²', r'486 m²', r'22,5 m²'],
    [r'Die Diagonale zerlegt das Viereck lückenlos und ohne Überlappung.',
     r'$18 + 27 = 45$ m²'])

Q.q(r'Ein Viereck hat die Diagonale $e = 10$ m. Die beiden Ecken neben der Diagonale haben von ihr die Abstände 3 m und 5 m. Wie groß ist der Flächeninhalt?',
    [r'40 m²', r'80 m²', r'25 m²', r'150 m²'],
    [r'Zwei Dreiecke mit der Grundseite 10 m und den Höhen 3 m und 5 m.',
     r'$A = \dfrac{1}{2} \cdot 10 \cdot 3 + \dfrac{1}{2} \cdot 10 \cdot 5 = 15 + 25 = 40$ m²'])

Q.q(r'Ein Grundstück hat die Form eines Vierecks. Die Diagonale AC ist 50 m lang. Das Dreieck ABC hat bei A den Winkel $40^\circ$ mit AB = 30 m, das Dreieck ACD hat bei A den Winkel $35^\circ$ mit AD = 40 m. Wie groß ist das Grundstück (gerundet)?',
    [r'1055,7 m²', r'2111,4 m²', r'1350 m²', r'1500 m²'],
    [r'$A_{ABC} = \dfrac{1}{2} \cdot 30 \cdot 50 \cdot \sin 40^\circ \approx 482{,}1$ m²',
     r'$A_{ACD} = \dfrac{1}{2} \cdot 40 \cdot 50 \cdot \sin 35^\circ \approx 573{,}6$ m²',
     r'Zusammen $\approx 1055{,}7$ m²'])

Q.q(r'Ein Fünfeck soll vermessen werden. In wie viele Dreiecke zerlegt man es mindestens, wenn man alle Diagonalen von einer Ecke aus zieht?',
    [r'3', r'5', r'2', r'4'],
    [r'Von einer Ecke aus kann man zu den beiden nicht benachbarten Ecken Diagonalen ziehen.',
     r'Zwei Diagonalen ergeben drei Dreiecke (allgemein: ein $n$-Eck in $n - 2$ Dreiecke).'])

# --------------------------------------------------- Vermessungsaufgaben ----
Q.q(r'Ein Dreieck hat die Seiten $a = 7$ cm und $b = 9$ cm und den eingeschlossenen Winkel $\gamma = 100^\circ$. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'31,0 cm²', r'62,0 cm²', r'5,5 cm²', r'31,5 cm²'],
    [r'$A = \dfrac{1}{2} \cdot 7 \cdot 9 \cdot \sin 100^\circ \approx 31{,}5 \cdot 0{,}985 \approx 31{,}0$ cm²',
     r'Auch für stumpfe Winkel ist der Sinus positiv – die Formel gilt unverändert.'])

Q.q(r'Im Dreieck sind alle drei Seiten bekannt: 5 cm, 6 cm, 7 cm. Wie gehst du vor, um den Flächeninhalt zu berechnen?',
    [r'erst mit dem Kosinussatz einen Winkel, dann $A = \dfrac{1}{2} ab \sin \gamma$', r'Seiten multiplizieren und halbieren',
     r'erst mit dem Sinussatz einen Winkel, dann $A = g \cdot h$', r'Das geht ohne Winkelangabe nicht.'],
    [r'Für die Sinus-Formel braucht man einen eingeschlossenen Winkel.',
     r'Aus drei Seiten liefert ihn der Kosinussatz, z.B. $\cos \gamma = 0{,}2$ und $\gamma \approx 78{,}5^\circ$.'])

Q.q(r'Berechne damit den Flächeninhalt des Dreiecks mit den Seiten 5 cm, 6 cm und 7 cm (gerundet).',
    [r'14,7 cm²', r'15 cm²', r'29,4 cm²', r'105 cm²'],
    [r'Winkel zwischen 5 cm und 6 cm: $\cos \gamma = \dfrac{25 + 36 - 49}{60} = 0{,}2$, $\gamma \approx 78{,}46^\circ$.',
     r'$A = \dfrac{1}{2} \cdot 5 \cdot 6 \cdot \sin 78{,}46^\circ \approx 15 \cdot 0{,}980 \approx 14{,}7$ cm²'])

Q.q(r'Ein Dreieck hat $c = 10$ cm, $\alpha = 40^\circ$ und $\beta = 60^\circ$. Wie hoch ist es über der Seite $c$ (gerundet)?',
    [r'5,7 cm', r'8,8 cm', r'6,6 cm', r'10 cm'],
    [r'Mit dem Sinussatz: $\gamma = 80^\circ$, $b = \dfrac{10 \cdot \sin 60^\circ}{\sin 80^\circ} \approx 8{,}79$ cm.',
     r'Die Höhe auf $c$: $h_c = b \cdot \sin \alpha \approx 8{,}79 \cdot 0{,}643 \approx 5{,}7$ cm.'])

Q.q(r'Ein dreieckiges Beet hat zwei Seiten von 4 m und 6 m mit einem Winkel von $120^\circ$ dazwischen. Wie viel Fläche hat es (gerundet)?',
    [r'10,4 m²', r'6 m²', r'12 m²', r'20,8 m²'],
    [r'$A = \dfrac{1}{2} \cdot 4 \cdot 6 \cdot \sin 120^\circ = 12 \cdot 0{,}866 \approx 10{,}4$ m²',
     r'Zum Vergleich: der Kosinus würde hier ein negatives Ergebnis liefern – für Flächen gehört der Sinus in die Formel.'])

Q.q(r'Eine dreieckige Wiese mit den Seiten 80 m und 60 m und dem eingeschlossenen Winkel $65^\circ$ soll eingesät werden. Pro m² braucht man 25 g Samen. Wie viel Samen braucht man (gerundet)?',
    [r'54,4 kg', r'2,2 kg', r'60 kg', r'108,8 kg'],
    [r'$A = \dfrac{1}{2} \cdot 80 \cdot 60 \cdot \sin 65^\circ \approx 2400 \cdot 0{,}906 \approx 2175{,}1$ m²',
     r'$2175{,}1 \cdot 25$ g $\approx 54\,378$ g $\approx 54{,}4$ kg'])


def check():
    from math import sin, cos, acos, pi, radians as r, degrees as d
    R = lambda x, n=1: round(x, n)
    s = lambda w: sin(r(w))
    assert R(0.5 * 8 * 5 * s(30), 6) == 10
    assert R(0.5 * 12 * 9 * s(75)) == 52.2 and R(12 * 9 * s(75)) == 104.3 and R(0.5 * 12 * 9 * cos(r(75))) == 14.0
    assert R(24 / 48, 6) == 0.5
    assert R(60 * s(50)) == 46.0 and R(30 * s(50)) == 23.0 and R(60 * cos(r(50))) == 38.6
    assert 360 / 6 == 60
    tri = 0.5 * 4 * 4 * s(60)
    assert R(tri, 2) == 6.93 and R(6 * tri) == 41.6
    assert 360 / 8 == 45 and (8 - 2) * 180 / 8 == 135
    assert R(8 * 0.5 * 25 * s(45)) == 70.7 and R(pi * 25) == 78.5
    assert 18 + 27 == 45
    assert 0.5 * 10 * 3 + 0.5 * 10 * 5 == 40
    a1, a2 = 0.5 * 30 * 50 * s(40), 0.5 * 40 * 50 * s(35)
    assert R(a1) == 482.1 and R(a2) == 573.6 and R(a1 + a2) == 1055.7
    assert 5 - 2 == 3
    assert R(0.5 * 7 * 9 * s(100)) == 31.0
    g = d(acos(0.2))
    assert R(g, 2) == 78.46 and R(0.5 * 5 * 6 * s(g)) == 14.7
    b = 10 * s(60) / s(80)
    assert R(b, 2) == 8.79 and R(b * s(40)) == 5.7
    assert R(0.5 * 4 * 6 * s(120)) == 10.4
    A = 0.5 * 80 * 60 * s(65)
    assert R(A) == 2175.1 and R(A * 25 / 1000) == 54.4


Q.verify(check)
Q.save()
