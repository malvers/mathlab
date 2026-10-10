#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 38 / KW 24: Vorbereitung Klassenarbeit 4
(LB 4 beschreibende Statistik und Jahresstoff). Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=38, slug='ka4-statistik', thema='Vorbereitung Klassenarbeit 4: Statistik und Jahresstoff', lb='KA 4',
        blurb='gemischte Wiederholung zu Statistik, rechtwinkligen Dreiecken, Körpern und quadratischen Gleichungen',
        comment='Mixed review: statistics (1-10), right triangles (11-13), solids (14-16), quadratics (17-19), golden section (20). Calculator in DEG, values rounded.')

# --------------------------------------------------------------- Statistik ----
Q.q(r'Berechne das arithmetische Mittel von 12, 15, 15, 18, 20.',
    [r'16', r'15', r'17', r'80'],
    [r'Summe 80, Anzahl 5: $80 : 5 = 16$'])

Q.q(r'Wie groß ist der Zentralwert von 12, 15, 15, 18, 20?',
    [r'15', r'16', r'18', r'15,5'],
    [r'Der mittlere der fünf geordneten Werte ist 15.'])

Q.q(r'Wie groß ist die Spannweite von 12, 15, 15, 18, 20?',
    [r'8', r'20', r'12', r'32'],
    [r'$20 - 12 = 8$'])

Q.q(r'Wie groß ist der Zentralwert von 4, 9, 2, 7, 5, 8?',
    [r'6', r'5', r'7', r'5,8'],
    [r'Ordnen: 2, 4, 5, 7, 8, 9.',
     r'Mitte zwischen 5 und 7: $6$'])

Q.q(r'Ein Gehalt von 20 000 € kommt zu vier Gehältern um 2500 € hinzu. Welcher Kennwert ändert sich kaum?',
    [r'der Zentralwert', r'das arithmetische Mittel', r'die Spannweite', r'das Maximum'],
    [r'Der Zentralwert hängt nur von der Mitte ab, Mittel, Spannweite und Maximum reagieren stark.'])

Q.q(r'Von 80 Befragten fahren 28 Bus. Welcher Mittelpunktswinkel gehört dazu im Kreisdiagramm?',
    [r'$126^\circ$', r'$28^\circ$', r'$35^\circ$', r'$100{,}8^\circ$'],
    [r'Anteil: $\dfrac{28}{80} = 0{,}35$',
     r'$0{,}35 \cdot 360^\circ = 126^\circ$'])

Q.q(r'Ein Säulendiagramm beginnt bei 50 statt bei 0. Was ist die Folge?',
    [r'Unterschiede wirken größer, als sie sind.', r'Alle Säulen sind gleich hoch.', r'Das Diagramm wird genauer.', r'Keine.'],
    [r'Abgeschnittene Achsen übertreiben Unterschiede.'])

Q.q(r'Ein Anteil sinkt von 40 % auf 30 %. Was ist richtig?',
    [r'minus 10 Prozentpunkte, das sind 25 % weniger', r'minus 10 %', r'minus 25 Prozentpunkte', r'minus 30 %'],
    [r'$40 - 30 = 10$ Prozentpunkte',
     r'Relativ: $\dfrac{10}{40} = 25$ %'])

Q.q(r'Noten: Note 1 zweimal, Note 2 viermal, Note 3 dreimal, Note 4 einmal. Wie groß ist der Durchschnitt?',
    [r'2,3', r'2,5', r'2', r'2,4'],
    [r'Summe: $2 + 8 + 9 + 4 = 23$, Anzahl 10',
     r'$23 : 10 = 2{,}3$'])

Q.q(r'Welche Frage ist für eine Umfrage am besten geeignet?',
    [r'„Wie viele Stunden schläfst du an Schultagen? (unter 7 / 7 bis 8 / über 8)“', r'„Schläfst du nicht auch viel zu wenig?“',
     r'„Wie findest du Schlaf?“', r'„Bist du müde und faul?“'],
    [r'Neutral, eindeutig, mit festen Antworten.'])

# ------------------------------------------------- rechtwinklige Dreiecke ----
Q.q(r'Die Katheten eines rechtwinkligen Dreiecks sind 8 cm und 15 cm lang. Wie lang ist die Hypotenuse?',
    [r'17 cm', r'23 cm', r'12,7 cm', r'289 cm'],
    [r'$\sqrt{64 + 225} = \sqrt{289} = 17$ cm'])

Q.q(r'Eine Leiter ist 5 m lang und lehnt unter $65^\circ$ an einer Wand. Wie hoch reicht sie (gerundet)?',
    [r'4,53 m', r'2,11 m', r'10,72 m', r'5,52 m'],
    [r'$h = 5 \cdot \sin 65^\circ \approx 4{,}53$ m'])

Q.q(r'Eine Straße steigt auf 400 m waagerechter Strecke um 28 m. Wie groß ist die Steigung in Prozent?',
    [r'7 %', r'14,3 %', r'28 %', r'0,07 %'],
    [r'$\dfrac{28}{400} = 0{,}07 = 7$ %'])

# ------------------------------------------------------------------ Körper ----
Q.q(r'Eine quadratische Pyramide hat $a = 6$ cm und $h = 10$ cm. Wie groß ist ihr Volumen?',
    [r'120 cm³', r'360 cm³', r'60 cm³', r'200 cm³'],
    [r'$V = \dfrac{1}{3} \cdot 36 \cdot 10 = 120$ cm³'])

Q.q(r'Ein Kegel hat $r = 4$ cm und $h = 3$ cm. Wie groß ist sein Mantel (gerundet)?',
    [r'62,83 cm²', r'50,27 cm²', r'37,70 cm²', r'113,10 cm²'],
    [r'$s = \sqrt{16 + 9} = 5$ cm',
     r'$A_M = \pi \cdot 4 \cdot 5 = 20\pi \approx 62{,}83$ cm²'])

Q.q(r'Eine Kugel hat 3 cm Radius. Wie groß ist ihr Volumen (gerundet)?',
    [r'113,10 cm³', r'37,70 cm³', r'113,10 cm²', r'28,27 cm³'],
    [r'$V = \dfrac{4}{3}\pi \cdot 27 = 36\pi \approx 113{,}10$ cm³'])

# -------------------------------------------------------------- quadratisch ----
Q.q(r'Welchen Scheitelpunkt hat $y = x^2 - 6x + 4$?',
    [r'$S(3 \mid -5)$', r'$S(-3 \mid -5)$', r'$S(3 \mid 4)$', r'$S(6 \mid 4)$'],
    [r'$y = (x - 3)^2 - 9 + 4 = (x - 3)^2 - 5$'])

Q.q(r'Löse: $x^2 - 2x - 8 = 0$',
    [r'$x = 4$ oder $x = -2$', r'$x = -4$ oder $x = 2$', r'$x = 8$', r'keine Lösung'],
    [r'$x = 1 \pm \sqrt{1 + 8} = 1 \pm 3$'])

Q.q(r'Wie viele Lösungen hat $x^2 + 2x + 1 = 0$?',
    [r'eine, $x = -1$', r'zwei', r'keine', r'unendlich viele'],
    [r'$x^2 + 2x + 1 = (x + 1)^2$, also nur $x = -1$.'])

# --------------------------------------------------------- Goldener Schnitt ----
Q.q(r'Eine 20 cm lange Strecke wird im Goldenen Schnitt geteilt. Wie lang ist der größere Teil (gerundet)?',
    [r'12,36 cm', r'7,64 cm', r'10 cm', r'32,36 cm'],
    [r'$20 : 1{,}618 \approx 12{,}36$ cm'])


def check():
    from statistics import mean, median
    from math import pi, sin, radians, sqrt
    from fractions import Fraction as F
    d = [12, 15, 15, 18, 20]
    assert mean(d) == 16 and median(d) == 15 and max(d) - min(d) == 8 and median([4, 9, 2, 7, 5, 8]) == 6
    assert F(28, 80) * 360 == 126 and F(40 - 30, 40) == F(1, 4)
    assert F(2 * 1 + 4 * 2 + 3 * 3 + 4, 10) == F('2.3')
    assert sqrt(64 + 225) == 17 and round(5 * sin(radians(65)), 2) == 4.53 and F(28, 400) == F(7, 100)
    assert 36 * 10 / 3 == 120 and round(20 * pi, 2) == 62.83 and round(36 * pi, 2) == 113.10
    import sympy as sp
    x = sp.symbols('x')
    assert sp.expand((x - 3)**2 - 5) == x**2 - 6*x + 4 and sorted(sp.solve(x**2 - 2*x - 8, x)) == [-2, 4]
    assert sp.solve(x**2 + 2*x + 1, x) == [-1]
    assert round(20 / ((1 + sqrt(5)) / 2), 2) == 12.36


Q.verify(check)
Q.save()
