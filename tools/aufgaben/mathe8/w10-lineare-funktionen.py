#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 10 / KW 45 (LB 2): lineare Funktionen
y = m · x + n, Parameter m und n. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=10, slug='lineare-funktionen', thema='Lineare Funktionen', lb='LB 2',
        blurb='y = m · x + n, Steigung und y-Achsenabschnitt, Grundgebühr plus Preis pro Einheit',
        comment='Blocks: reading m and n (1-7, 12, 18-19), values and points (4, 11, 20), equation from points (10, 15-16), drawing (13), context (8-9, 14, 17).')

# ------------------------------------------------------------ m und n ----
Q.q(r'In welchem Punkt schneidet der Graph von $y = 2x - 3$ die $y$-Achse?',
    [r'$(0 \mid -3)$', r'$(0 \mid 2)$', r'$(-3 \mid 0)$', r'$(2 \mid -3)$'],
    [r'Auf der $y$-Achse ist $x = 0$.',
     r'$y = 2 \cdot 0 - 3 = -3$, der Schnittpunkt ist $(0 \mid -3)$.',
     r'Das Absolutglied $n = -3$ gibt ihn direkt an.'])

Q.q(r'Wie groß ist die Steigung von $y = -4x + 1$?',
    [r'$m = -4$', r'$m = 1$', r'$m = 4$', r'$m = -3$'],
    [r'In $y = m \cdot x + n$ ist $m$ der Faktor vor $x$.',
     r'Hier: $m = -4$, $n = 1$.'])

Q.q(r'Welche Funktion hat die Steigung 0,5 und den $y$-Achsenabschnitt 2?',
    [r'$y = 0{,}5x + 2$', r'$y = 2x + 0{,}5$', r'$y = 0{,}5x - 2$', r'$y = 2{,}5x$'],
    [r'$m = 0{,}5$ steht vor $x$, $n = 2$ wird addiert.',
     r'$y = 0{,}5x + 2$'])

Q.q(r'Berechne $f(-2)$ für $f(x) = 3x - 7$.',
    [r'−13', r'−1', r'13', r'1'],
    [r'$f(-2) = 3 \cdot (-2) - 7$',
     r'$= -6 - 7 = -13$'])

Q.q(r'Welche Gerade ist parallel zu $y = 2x + 5$?',
    [r'$y = 2x - 1$', r'$y = 5x + 2$', r'$y = -2x + 5$', r'$y = 0{,}5x + 5$'],
    [r'Parallele Geraden haben dieselbe Steigung.',
     r'Nur $y = 2x - 1$ hat $m = 2$; sie ist um 6 nach unten verschoben.'])

Q.q(r'Eine Gerade schneidet die $y$-Achse bei 4 und fällt bei jedem Schritt nach rechts um 2. Wie lautet ihre Gleichung?',
    [r'$y = -2x + 4$', r'$y = 2x + 4$', r'$y = 4x - 2$', r'$y = -4x + 2$'],
    [r'$y$-Achsenabschnitt: $n = 4$',
     r'Fallen um 2 pro Schritt: $m = -2$',
     r'$y = -2x + 4$'])

Q.q(r'Wie ändert sich der Graph von $y = 0{,}5x + n$, wenn $n$ von 1 auf 4 vergrößert wird?',
    [r'Er wird um 3 nach oben verschoben.', r'Er wird steiler.', r'Er wird um 3 nach rechts verschoben.', r'Er wird an der $x$-Achse gespiegelt.'],
    [r'$n$ ist der $y$-Achsenabschnitt; die Steigung bleibt gleich.',
     r'Jeder Funktionswert wird um 3 größer: Verschiebung um 3 nach oben.'])

# --------------------------------------------------------------- Sachbezug ----
Q.q(r'Ein Handwerker berechnet 40 € Anfahrt und 30 € pro Stunde. Was kostet ein Einsatz von 3,5 Stunden?',
    [r'145 €', r'245 €', r'140 €', r'105 €'],
    [r'Funktion: $y = 30x + 40$',
     r'$y = 30 \cdot 3{,}5 + 40 = 105 + 40 = 145$'])

Q.q(r'Ein Taxi kostet 4 € Grundpreis und 2,20 € pro Kilometer. Eine Fahrt kostet 26 €. Wie weit war sie?',
    [r'10 km', r'11,8 km', r'13,6 km', r'8 km'],
    [r'$2{,}20x + 4 = 26$',
     r'$2{,}20x = 22$',
     r'$x = 10$'])

Q.q(r'Eine Gerade geht durch $(0 \mid 1)$ und $(2 \mid 7)$. Wie lautet ihre Gleichung?',
    [r'$y = 3x + 1$', r'$y = 3x + 7$', r'$y = 6x + 1$', r'$y = 4x - 1$'],
    [r'$n = 1$, weil die Gerade die $y$-Achse bei 1 schneidet.',
     r'$m = \dfrac{7 - 1}{2 - 0} = \dfrac{6}{2} = 3$',
     r'$y = 3x + 1$'])

Q.q(r'Welcher Punkt liegt auf der Geraden $y = -2x + 3$?',
    [r'$P(-1 \mid 5)$', r'$Q(1 \mid 5)$', r'$R(2 \mid 1)$', r'$S(0 \mid -2)$'],
    [r'$x = -1$: $y = 2 + 3 = 5$, also liegt $P$ auf der Geraden.',
     r'Für $x = 1$ wäre $y = 1$, für $x = 2$ wäre $y = -1$, für $x = 0$ wäre $y = 3$.'])

Q.q(r'Welche Steigung hat die Gerade $y = 4$?',
    [r'$m = 0$', r'$m = 4$', r'$m = 1$', r'Sie hat keine Steigung, weil $x$ fehlt.'],
    [r'$y = 4$ heißt $y = 0 \cdot x + 4$.',
     r'Die Gerade verläuft waagerecht, $m = 0$.'])

Q.q(r'Wie zeichnest du den Graphen von $y = -\dfrac{1}{2}x + 3$?',
    [r'Bei $(0 \mid 3)$ beginnen, dann 2 nach rechts und 1 nach unten.',
     r'Bei $(0 \mid 3)$ beginnen, dann 1 nach rechts und 2 nach unten.',
     r'Bei $(3 \mid 0)$ beginnen, dann 2 nach rechts und 1 nach unten.',
     r'Bei $(0 \mid -\frac{1}{2})$ beginnen, dann 1 nach rechts und 3 nach oben.'],
    [r'Startpunkt ist der $y$-Achsenabschnitt $(0 \mid 3)$.',
     r'$m = -\dfrac{1}{2}$: 2 nach rechts, 1 nach unten.'])

Q.q(r'Für die Höhe einer Kerze gilt $h = 20 - 1{,}5t$ (in cm, $t$ in Stunden). Was bedeutet $-1{,}5$?',
    [r'Die Kerze wird pro Stunde 1,5 cm kürzer.', r'Die Kerze ist am Anfang 1,5 cm hoch.',
     r'Die Kerze brennt 1,5 Stunden.', r'Die Kerze wird pro Stunde 1,5 cm länger.'],
    [r'$-1{,}5$ ist die Steigung: Änderung der Höhe pro Stunde.',
     r'Negativ heißt: Die Höhe nimmt ab.'])

Q.q(r'Eine Gerade geht durch $A(1 \mid 2)$ und $B(4 \mid 11)$. Wie groß ist ihre Steigung?',
    [r'$m = 3$', r'$m = \dfrac{1}{3}$', r'$m = 9$', r'$m = 2{,}6$'],
    [r'$m = \dfrac{11 - 2}{4 - 1}$',
     r'$m = \dfrac{9}{3} = 3$'])

Q.q(r'Die Gerade aus der vorigen Aufgabe hat die Steigung 3 und geht durch $A(1 \mid 2)$. Wie groß ist $n$?',
    [r'$n = -1$', r'$n = 1$', r'$n = 2$', r'$n = 5$'],
    [r'$A$ einsetzen: $2 = 3 \cdot 1 + n$',
     r'$n = 2 - 3 = -1$, die Gerade ist $y = 3x - 1$.',
     r'Probe mit $B$: $3 \cdot 4 - 1 = 11$'])

Q.q(r'In Meereshöhe ist es 15 °C. Pro Meter Höhe wird es um 0,0065 °C kälter: $T = 15 - 0{,}0065h$. Wie warm ist es in 2000 m Höhe?',
    [r'2 °C', r'13 °C', r'−2 °C', r'28 °C'],
    [r'$0{,}0065 \cdot 2000 = 13$',
     r'$T = 15 - 13 = 2$, also 2 °C.'])

Q.q(r'Welche Funktion ist steigend und schneidet die $y$-Achse unterhalb der $x$-Achse?',
    [r'$y = 0{,}5x - 2$', r'$y = -0{,}5x - 2$', r'$y = 0{,}5x + 2$', r'$y = -2x + 0{,}5$'],
    [r'Steigend heißt $m > 0$.',
     r'Unterhalb der $x$-Achse heißt $n < 0$.',
     r'Beides gilt nur für $y = 0{,}5x - 2$.'])

Q.q(r'Welchen $y$-Achsenabschnitt hat die Gerade $2y = 4x + 6$?',
    [r'3', r'6', r'2', r'4'],
    [r'Zuerst nach $y$ auflösen: durch 2 teilen.',
     r'$y = 2x + 3$, also $n = 3$.'])

Q.q(r'Gegeben ist $y = 0{,}5x - 1$. Welcher Wert gehört zu $x = -4$?',
    [r'−3', r'1', r'−1', r'3'],
    [r'$y = 0{,}5 \cdot (-4) - 1$',
     r'$y = -2 - 1 = -3$'])


def check():
    from fractions import Fraction as F
    f = lambda m, n: (lambda x: m * x + n)
    assert f(2, -3)(0) == -3
    assert f(3, -7)(-2) == -13
    assert 30 * F('3.5') + 40 == 145
    assert (26 - 4) / F('2.2') == 10
    assert F(7 - 1, 2 - 0) == 3
    g = f(-2, 3)
    assert g(-1) == 5 and g(1) == 1 and g(2) == -1 and g(0) == 3
    assert F(11 - 2, 4 - 1) == 3 and 2 - 3 * 1 == -1 and 3 * 4 - 1 == 11
    assert 15 - F('0.0065') * 2000 == 2
    assert F(6, 2) == 3
    assert F('0.5') * (-4) - 1 == -3


Q.verify(check)
Q.save()
