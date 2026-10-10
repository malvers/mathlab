#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 9 / KW 44 (LB 2): Potenzfunktionen
y = a · x^n für n = 1, 2, 3. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=9, slug='potenzfunktionen-positiv', thema='Potenzfunktionen mit positiven Exponenten', lb='LB 2',
         blurb='Funktionswerte, Symmetrie, Monotonie, Einfluss des Faktors a, Sachbezüge',
         comment='Blocks: values (1-2, 9, 19), symmetry and common points (3-6), the factor a (7-8, 12-13), monotony and range (10-11, 14), context (15-18, 20).')

Q.q(r'Gegeben ist $f(x) = x^3$. Berechne $f(2)$.',
    [r'8', r'6', r'9', r'5'],
    [r'$f(2) = 2^3 = 2 \cdot 2 \cdot 2 = 8$ – nicht $2 \cdot 3$.'])

Q.q(r'Gegeben ist $f(x) = x^3$. Berechne $f(-2)$.',
    [r'$-8$', r'8', r'$-6$', r'6'],
    [r'$(-2)^3 = (-2) \cdot (-2) \cdot (-2) = 4 \cdot (-2) = -8$',
     r'Bei ungeradem Exponenten bleibt das Vorzeichen erhalten.'])

Q.q(r'Welche Symmetrie hat der Graph von $y = x^2$?',
    [r'achsensymmetrisch zur y-Achse', r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur x-Achse', r'keine Symmetrie'],
    [r'$(-x)^2 = x^2$: zu $x$ und $-x$ gehört derselbe y-Wert.',
     r'Die Normalparabel ist spiegelbildlich zur y-Achse.'])

Q.q(r'Welche Symmetrie hat der Graph von $y = x^3$?',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur y-Achse', r'achsensymmetrisch zur x-Achse', r'keine Symmetrie'],
    [r'$(-x)^3 = -x^3$: zu $-x$ gehört der entgegengesetzte y-Wert.',
     r'Eine halbe Drehung um den Ursprung bildet den Graphen auf sich selbst ab.'])

Q.q(r'In welchen Punkten schneiden sich die Graphen von $y = x^2$ und $y = x^3$?',
    [r'in $(0 \mid 0)$ und $(1 \mid 1)$', r'nur in $(0 \mid 0)$',
     r'in $(0 \mid 0)$, $(1 \mid 1)$ und $(-1 \mid 1)$', r'in $(1 \mid 1)$ und $(-1 \mid -1)$'],
    [r'Gleichsetzen: $x^2 = x^3$, also $x^3 - x^2 = x^2 (x - 1) = 0$.',
     r'Lösungen $x = 0$ und $x = 1$. Bei $x = -1$ ist $x^2 = 1$, aber $x^3 = -1$.'])

Q.q(r'Welcher Punkt liegt auf jedem der Graphen $y = x$, $y = x^2$ und $y = x^3$?',
    [r'$(1 \mid 1)$', r'$(-1 \mid 1)$', r'$(2 \mid 4)$', r'$(0 \mid 1)$'],
    [r'$1^n = 1$ für jeden Exponenten.',
     r'Auch $(0 \mid 0)$ liegt auf allen dreien – aber das steht nicht zur Auswahl.'])

Q.q(r'Wie entsteht der Graph von $y = 2x^2$ aus der Normalparabel $y = x^2$?',
    [r'Er wird in y-Richtung mit dem Faktor 2 gestreckt.', r'Er wird mit dem Faktor 2 gestaucht.',
     r'Er wird um 2 nach oben verschoben.', r'Er wird um 2 nach rechts verschoben.'],
    [r'Jeder y-Wert wird verdoppelt: aus $(1 \mid 1)$ wird $(1 \mid 2)$.',
     r'Die Parabel wird dadurch steiler und wirkt schmaler.'])

Q.q(r'Wie entsteht der Graph von $y = -x^2$ aus der Normalparabel?',
    [r'durch Spiegelung an der x-Achse', r'durch Spiegelung an der y-Achse',
     r'durch Verschiebung um 1 nach unten', r'durch Stauchung'],
    [r'Jeder y-Wert wechselt das Vorzeichen.',
     r'Die Parabel ist nach unten geöffnet, der Scheitel bleibt in $(0 \mid 0)$.'])

Q.q(r'Berechne $f(4)$ für $f(x) = 0{,}5 \cdot x^3$.',
    [r'32', r'6', r'12', r'64'],
    [r'Erst potenzieren, dann multiplizieren: $4^3 = 64$.',
     r'$0{,}5 \cdot 64 = 32$'])

Q.q(r'Wie verhält sich $y = x^3$ beim Durchlaufen der x-Achse von links nach rechts?',
    [r'Die Funktion steigt überall.', r'Sie fällt für $x < 0$ und steigt für $x > 0$.',
     r'Die Funktion fällt überall.', r'Sie steigt nur für $x > 0$.'],
    [r'Größeres $x$ ergibt immer größeres $x^3$: zum Beispiel $-2 \to -8$, $-1 \to -1$, $0 \to 0$, $1 \to 1$.',
     r'Die Funktion ist streng monoton steigend.'])

Q.q(r'Wie verhält sich $y = x^2$?',
    [r'Sie fällt für $x < 0$ und steigt für $x > 0$.', r'Sie steigt überall.',
     r'Sie fällt überall.', r'Sie steigt für $x < 0$ und fällt für $x > 0$.'],
    [r'Wertetabelle: $-2 \to 4$, $-1 \to 1$, $0 \to 0$, $1 \to 1$, $2 \to 4$.',
     r'Links vom Scheitel fallen die Werte, rechts davon steigen sie.'])

Q.q(r'Der Graph von $y = a \cdot x^2$ geht durch den Punkt $(3 \mid 18)$. Bestimme $a$.',
    [r'2', r'6', r'3', r'0,5'],
    [r'Punkt einsetzen: $18 = a \cdot 3^2 = 9a$.',
     r'$a = 18 : 9 = 2$'])

Q.q(r'Der Graph von $y = a \cdot x^3$ geht durch den Punkt $(2 \mid -4)$. Bestimme $a$.',
    [r'$-0{,}5$', r'0,5', r'$-2$', r'$-1$'],
    [r'Einsetzen: $-4 = a \cdot 2^3 = 8a$.',
     r'$a = -4 : 8 = -0{,}5$'])

Q.q(r'Welche y-Werte nimmt $y = x^2$ an?',
    [r'alle Zahlen größer oder gleich null', r'alle reellen Zahlen', r'nur positive ganze Zahlen', r'nur Zahlen zwischen 0 und 1'],
    [r'Ein Quadrat ist nie negativ, und $0^2 = 0$.',
     r'Jede Zahl $y \geq 0$ wird erreicht, nämlich bei $x = \sqrt{y}$.'])

Q.q(r'Der Flächeninhalt eines Quadrats ist $A = s^2$. Was passiert mit der Fläche, wenn man die Seitenlänge verdoppelt?',
    [r'Sie wird vervierfacht.', r'Sie wird verdoppelt.', r'Sie wird verachtfacht.', r'Sie bleibt gleich.'],
    [r'$(2s)^2 = 4 s^2$', r'Beispiel: Seite 3 cm ergibt 9 cm², Seite 6 cm ergibt 36 cm².'])

Q.q(r'Das Volumen eines Würfels ist $V = a^3$. Wie ändert es sich, wenn man die Kantenlänge verdreifacht?',
    [r'Es wird 27-mal so groß.', r'Es wird dreimal so groß.', r'Es wird neunmal so groß.', r'Es wird sechsmal so groß.'],
    [r'$(3a)^3 = 27 a^3$', r'In jede der drei Richtungen passt die Kante dreimal: $3 \cdot 3 \cdot 3 = 27$ kleine Würfel.'])

Q.q(r'Faustregel für den Bremsweg in Metern: $s = \left(\dfrac{v}{10}\right)^2$, mit $v$ in km/h. Wie lang ist der Bremsweg bei 80 km/h?',
    [r'64 m', r'16 m', r'8 m', r'640 m'],
    [r'$\dfrac{80}{10} = 8$', r'$8^2 = 64$, also 64 m.'])

Q.q(r'Nach dieser Faustregel: Wie ändert sich der Bremsweg, wenn man doppelt so schnell fährt?',
    [r'Er wird viermal so lang.', r'Er wird doppelt so lang.', r'Er wird achtmal so lang.', r'Er bleibt gleich.'],
    [r'Der Bremsweg hängt quadratisch von der Geschwindigkeit ab.',
     r'$\left(\dfrac{2v}{10}\right)^2 = 4 \cdot \left(\dfrac{v}{10}\right)^2$ – zum Beispiel 25 m bei 50 km/h, 100 m bei 100 km/h.'])

Q.q(r'Welcher Punkt liegt auf dem Graphen von $y = x^3$?',
    [r'$(-3 \mid -27)$', r'$(-3 \mid 27)$', r'$(3 \mid 9)$', r'$(-3 \mid -9)$'],
    [r'$(-3)^3 = -27$', r'Bei $(3 \mid 9)$ wurde quadriert statt hoch drei genommen.'])

Q.q(r'Das Volumen einer Kugel ist $V = \dfrac{4}{3} \pi r^3$. Berechne es für $r = 3$ cm (gerundet).',
    [r'113,1 cm³', r'37,7 cm³', r'28,3 cm³', r'339,3 cm³'],
    [r'$r^3 = 27$', r'$V = \dfrac{4}{3} \cdot \pi \cdot 27 = 36 \pi \approx 113{,}1$ cm³'])


def check():
    from math import pi
    R = lambda x, n=1: round(x, n)
    assert 2 ** 3 == 8 and (-2) ** 3 == -8
    assert all((-x) ** 2 == x ** 2 and (-x) ** 3 == -x ** 3 for x in range(-5, 6))
    assert [x for x in range(-3, 4) if x ** 2 == x ** 3] == [0, 1]
    assert all(1 ** n == 1 for n in (1, 2, 3))
    assert 0.5 * 4 ** 3 == 32
    assert sorted(x ** 3 for x in range(-3, 4)) == [x ** 3 for x in range(-3, 4)]
    assert 18 / 3 ** 2 == 2 and -4 / 2 ** 3 == -0.5
    assert (2 * 3) ** 2 == 4 * 3 ** 2 and (3 * 2) ** 3 == 27 * 2 ** 3
    assert (80 / 10) ** 2 == 64 and (100 / 10) ** 2 == 4 * (50 / 10) ** 2
    assert (-3) ** 3 == -27
    assert R(4 / 3 * pi * 27) == 113.1 and R(4 / 3 * pi * 9) == 37.7 and R(pi * 9) == 28.3 and R(4 * pi * 27) == 339.3


Q.verify(check)
Q.save()
