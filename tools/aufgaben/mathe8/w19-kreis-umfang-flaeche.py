#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 19 / KW 2 (LB 3): Umfang und Flächeninhalt
des Kreises, Kreiszahl π. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=19, slug='kreis-umfang-flaeche', thema='Umfang und Flächeninhalt des Kreises', lb='LB 3',
        blurb='Die Zahl π, u = π · d, A = π · r², Radius zurückrechnen, Sachaufgaben',
        comment='All values with the calculator key for pi, rounded at the end. Blocks: pi (1, 8-9), circumference (2-3, 6, 12, 17-18, 20), area (4-5, 7, 15-16), comparisons and parts (10-11, 13-14, 19).')

# ------------------------------------------------------------------- π ----
Q.q(r'Was erhält man, wenn man bei jedem Kreis den Umfang durch den Durchmesser teilt?',
    [r'immer dieselbe Zahl $\pi \approx 3{,}14$', r'immer den Radius', r'immer 2', r'je nach Kreis eine andere Zahl'],
    [r'Das Verhältnis $\dfrac{u}{d}$ ist bei allen Kreisen gleich.',
     r'Diese Kreiszahl heißt $\pi$, $\pi = 3{,}14159\ldots$'])

Q.q(r'Ein Kreis hat den Durchmesser 10 cm. Wie groß ist sein Umfang (gerundet)?',
    [r'31,4 cm', r'78,5 cm', r'62,8 cm', r'15,7 cm'],
    [r'$u = \pi \cdot d = \pi \cdot 10$',
     r'$u \approx 31{,}4$ cm'])

Q.q(r'Ein Kreis hat den Radius 6 cm. Wie groß ist sein Umfang (gerundet)?',
    [r'37,7 cm', r'18,8 cm', r'113,1 cm', r'36 cm'],
    [r'$u = 2 \cdot \pi \cdot r = 2 \cdot \pi \cdot 6$',
     r'$u = 12\pi \approx 37{,}7$ cm'])

Q.q(r'Ein Kreis hat den Radius 5 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'78,5 cm²', r'31,4 cm²', r'15,7 cm²', r'25 cm²'],
    [r'$A = \pi \cdot r^2 = \pi \cdot 25$',
     r'$A \approx 78{,}5$ cm²'])

Q.q(r'Ein Kreis hat den Durchmesser 12 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'113,1 cm²', r'452,4 cm²', r'37,7 cm²', r'144 cm²'],
    [r'Erst den Radius bestimmen: $r = 6$ cm.',
     r'$A = \pi \cdot 6^2 = 36\pi \approx 113{,}1$ cm²',
     r'452,4 cm² erhält man, wenn man fälschlich $d$ statt $r$ quadriert.'])

Q.q(r'Ein Kreis hat den Umfang 50 cm. Wie groß ist sein Radius (gerundet)?',
    [r'8,0 cm', r'15,9 cm', r'25 cm', r'4,0 cm'],
    [r'$u = 2\pi r$, also $r = \dfrac{u}{2\pi}$',
     r'$r = \dfrac{50}{2\pi} \approx 7{,}96$, also etwa 8,0 cm.'])

Q.q(r'Ein Kreis hat den Flächeninhalt 200 cm². Wie groß ist sein Radius (gerundet)?',
    [r'8,0 cm', r'63,7 cm', r'31,8 cm', r'14,1 cm'],
    [r'$A = \pi r^2$, also $r^2 = \dfrac{A}{\pi} = \dfrac{200}{\pi} \approx 63{,}66$',
     r'$r = \sqrt{63{,}66} \approx 7{,}98$, also etwa 8,0 cm.'])

Q.q(r'Warum kann man $\pi$ nicht genau als Bruch oder als abbrechende Dezimalzahl schreiben?',
    [r'$\pi$ ist keine rationale Zahl; seine Ziffern enden nie und werden nicht periodisch.',
     r'$\pi$ ist genau $\dfrac{22}{7}$, das kann man nur schlecht ausrechnen.',
     r'$\pi$ ist genau 3,14.',
     r'$\pi$ ist eine negative Zahl.'],
    [r'Rationale Zahlen haben abbrechende oder periodische Dezimaldarstellungen.',
     r'$\pi = 3{,}14159265\ldots$ hat keine Periode: $\pi$ ist nichtrational.',
     r'Brüche wie $\dfrac{22}{7}$ sind nur Näherungswerte.'])

Q.q(r'Archimedes zeigte um 250 vor Christus, dass $\pi$ etwas kleiner als $\dfrac{22}{7}$ ist. Wie groß ist $\dfrac{22}{7}$ auf drei Nachkommastellen?',
    [r'3,143', r'3,142', r'3,141', r'3,714'],
    [r'$22 : 7 = 3{,}142857\ldots$',
     r'Gerundet: 3,143. Zum Vergleich: $\pi \approx 3{,}142$.',
     r'Quelle: Archimedes, Kreismessung; er fand $3\tfrac{10}{71} < \pi < 3\tfrac{1}{7}$.'])

Q.q(r'Der Radius eines Kreises wird verdoppelt. Wie ändert sich der Flächeninhalt?',
    [r'Er wird 4-mal so groß.', r'Er wird doppelt so groß.', r'Er wird 8-mal so groß.', r'Er bleibt gleich.'],
    [r'$A = \pi r^2$: Der Radius steht im Quadrat.',
     r'$\pi \cdot (2r)^2 = 4 \cdot \pi r^2$'])

Q.q(r'Der Radius eines Kreises wird verdoppelt. Wie ändert sich der Umfang?',
    [r'Er wird doppelt so groß.', r'Er wird 4-mal so groß.', r'Er wächst um 2 cm.', r'Er bleibt gleich.'],
    [r'$u = 2\pi r$: Der Umfang ist proportional zum Radius.',
     r'$2\pi \cdot 2r = 2 \cdot 2\pi r$'])

Q.q(r'Ein Riesenrad hat den Durchmesser 60 m. Welchen Weg legt eine Gondel bei einer Umdrehung zurück (gerundet)?',
    [r'188,5 m', r'94,2 m', r'377,0 m', r'2827,4 m'],
    [r'$u = \pi \cdot 60$',
     r'$u \approx 188{,}5$ m'])

Q.q(r'Was ist mehr Pizza: eine Pizza mit 30 cm Durchmesser oder zwei Pizzen mit je 20 cm Durchmesser?',
    [r'die eine Pizza mit 30 cm', r'die zwei Pizzen mit 20 cm', r'beides gleich viel', r'Das kann man ohne Gewicht nicht sagen.'],
    [r'30 cm: $A = \pi \cdot 15^2 \approx 706{,}9$ cm²',
     r'20 cm: $A = \pi \cdot 10^2 \approx 314{,}2$ cm², zwei davon $\approx 628{,}3$ cm²',
     r'Die große Pizza hat mehr Fläche.'])

Q.q(r'Ein Halbkreis hat den Durchmesser 8 cm. Wie groß ist der Umfang der ganzen Halbkreisfigur (Bogen und Durchmesser, gerundet)?',
    [r'20,6 cm', r'12,6 cm', r'25,1 cm', r'33,1 cm'],
    [r'Bogen: $\dfrac{1}{2} \cdot \pi \cdot 8 \approx 12{,}57$ cm',
     r'Dazu der Durchmesser: $12{,}57 + 8 \approx 20{,}6$ cm'])

Q.q(r'Ein Viertelkreis hat den Radius 4 cm. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'12,6 cm²', r'50,3 cm²', r'6,3 cm²', r'4 cm²'],
    [r'Ganzer Kreis: $\pi \cdot 4^2 = 16\pi \approx 50{,}27$ cm²',
     r'Ein Viertel: $4\pi \approx 12{,}6$ cm²'])

Q.q(r'Ein Rasensprenger dreht sich im Kreis und spritzt 6 m weit. Wie groß ist die bewässerte Fläche (gerundet)?',
    [r'113,1 m²', r'37,7 m²', r'36 m²', r'452,4 m²'],
    [r'$r = 6$ m',
     r'$A = \pi \cdot 36 \approx 113{,}1$ m²'])

Q.q(r'Der Minutenzeiger einer Turmuhr ist 1,5 m lang. Welchen Weg legt seine Spitze in einer Stunde zurück (gerundet)?',
    [r'9,4 m', r'4,7 m', r'7,1 m', r'1,5 m'],
    [r'In einer Stunde läuft die Spitze einmal ganz herum.',
     r'$u = 2 \cdot \pi \cdot 1{,}5 = 3\pi \approx 9{,}4$ m'])

Q.q(r'Die Erde hat am Äquator einen Radius von etwa 6378 km. Wie lang ist der Äquator ungefähr?',
    [r'etwa 40 000 km', r'etwa 20 000 km', r'etwa 128 000 km', r'etwa 4000 km'],
    [r'$u = 2 \cdot \pi \cdot 6378 \approx 40\,074$ km',
     r'Also rund 40 000 km.'])

Q.q(r'In ein Quadrat ist ein Kreis gezeichnet, der alle vier Seiten berührt. Welchen Anteil des Quadrats bedeckt der Kreis ungefähr?',
    [r'etwa 79 %', r'etwa 50 %', r'etwa 64 %', r'etwa 91 %'],
    [r'Ist der Radius $r$, so hat das Quadrat die Seitenlänge $2r$ und den Flächeninhalt $4r^2$.',
     r'Anteil: $\dfrac{\pi r^2}{4r^2} = \dfrac{\pi}{4} \approx 0{,}785$, also etwa 79 %.'])

Q.q(r'An einem runden Tisch sollen 8 Personen mit je 60 cm Platz am Rand sitzen. Welchen Durchmesser braucht der Tisch mindestens (gerundet)?',
    [r'1,53 m', r'0,76 m', r'4,80 m', r'3,06 m'],
    [r'Benötigter Umfang: $8 \cdot 60 = 480$ cm',
     r'$d = \dfrac{u}{\pi} = \dfrac{480}{\pi} \approx 152{,}8$ cm, also etwa 1,53 m.'])


def check():
    from math import pi, sqrt
    r1 = lambda v: round(v, 1)
    assert r1(pi * 10) == 31.4 and r1(pi * 25) == 78.5
    assert r1(2 * pi * 6) == 37.7 and r1(pi * 36) == 113.1
    assert r1(pi * 25) == 78.5
    assert r1(pi * 36) == 113.1 and r1(pi * 144) == 452.4
    assert r1(50 / (2 * pi)) == 8.0
    assert r1(sqrt(200 / pi)) == 8.0 and r1(200 / pi) == 63.7
    assert round(22 / 7, 3) == 3.143 and 3 + 10 / 71 < pi < 22 / 7
    assert pi * (2 * 3) ** 2 == 4 * pi * 3 ** 2
    assert r1(pi * 60) == 188.5
    assert r1(pi * 15 ** 2) == 706.9 and r1(2 * pi * 10 ** 2) == 628.3
    assert r1(pi * 8 / 2 + 8) == 20.6
    assert r1(pi * 16 / 4) == 12.6
    assert r1(pi * 36) == 113.1
    assert r1(2 * pi * 1.5) == 9.4
    assert round(2 * pi * 6378) == 40074
    assert round(pi / 4 * 100) == 79
    assert round(480 / pi / 100, 2) == 1.53


Q.verify(check)
Q.save()
