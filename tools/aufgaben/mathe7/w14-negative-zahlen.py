#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 14 / KW 49 (LB 3): negative numbers - number
line, opposite number, absolute value, comparing and ordering, everyday contexts.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7
from osfig import zahlenstrahl

Q = os7(nr=14, slug='negative-zahlen', thema='Negative Zahlen', lb='LB 3',
        blurb='Zahlengerade, Gegenzahl, Betrag, Vergleichen und Ordnen, Temperatur und Kontostand',
        comment='Blocks: number line (1-2, 11, 18, 20), comparing and ordering (3-4, 7, 13-16), opposite and absolute value (5-6, 12, 17), contexts (8-10, 19).')

# ---------------------------------------------------------------- number line ----
Q.q(r'Welche Zahl gehört zum markierten Punkt?',
    [r'−3', r'3', r'−2', r'−4'],
    [r'Links von der Null liegen die negativen Zahlen.',
     r'Der Punkt liegt 3 Schritte links von 0.',
     r'Also bei −3.'],
    fig=zahlenstrahl(-5, 5, 1, [(-3, '?')]), figcap=r'Zahlengerade von −5 bis 5')

Q.q(r'Welche Zahl gehört zum markierten Punkt?',
    [r'−1,5', r'−0,5', r'1,5', r'−2,5'],
    [r'Zwischen zwei ganzen Zahlen liegt hier ein Teilstrich: Halbe.',
     r'Der Punkt liegt zwischen −2 und −1, genau in der Mitte.',
     r'Also bei −1,5.'],
    fig=zahlenstrahl(-3, 2, 2, [(F(-3, 2), '?')]), figcap=r'Zahlengerade von −3 bis 2 in Halben')

Q.q(r'Wie groß ist der Abstand zwischen −3 und 4 auf der Zahlengerade?',
    [r'7', r'1', r'−7', r'4'],
    [r'Von −3 bis 0 sind es 3 Schritte.',
     r'Von 0 bis 4 sind es 4 Schritte.',
     r'Zusammen 7.'])

Q.q(r'Was gilt für eine Zahl und ihre Gegenzahl auf der Zahlengerade?',
    [r'Sie liegen gleich weit von der Null entfernt, auf verschiedenen Seiten.', r'Sie liegen nebeneinander.',
     r'Die Gegenzahl ist immer größer.', r'Sie liegen beide links von der Null.'],
    [r'Beispiel: 4 und −4.',
     r'Beide sind 4 Schritte von 0 entfernt.',
     r'Die Zahlengerade ist an der 0 gespiegelt.'])

Q.q(r'Welche Aussage stimmt?',
    [r'Je weiter links eine Zahl auf der Zahlengerade liegt, desto kleiner ist sie.', r'Je weiter links, desto größer.',
     r'Negative Zahlen sind größer als 0.', r'−10 ist größer als −1.'],
    [r'Die Zahlengerade wächst nach rechts.',
     r'−10 liegt weiter links als −1.',
     r'Also ist −10 kleiner als −1.'])

# --------------------------------------------------------- comparing and ordering ----
Q.q(r'Am Montag waren es −4 °C, am Dienstag −7 °C. Wann war es kälter?',
    [r'am Dienstag', r'am Montag', r'an beiden Tagen gleich', r'Das kann man nicht sagen.'],
    [r'−7 liegt weiter links auf der Zahlengerade als −4.',
     r'$-7 < -4$',
     r'Am Dienstag war es kälter.'])

Q.q(r'Ordne von klein nach groß: −3; 2; −5; 0',
    [r'$-5 < -3 < 0 < 2$', r'$-3 < -5 < 0 < 2$', r'$0 < 2 < -3 < -5$', r'$2 < 0 < -3 < -5$'],
    [r'Die negativen Zahlen sind kleiner als 0.',
     r'−5 liegt links von −3.',
     r'$-5 < -3 < 0 < 2$'])

Q.q(r'Welche Zahl ist größer: −2,5 oder −2,05?',
    [r'−2,05', r'−2,5', r'Beide sind gleich groß.', r'Man kann sie nicht vergleichen.'],
    [r'Beträge vergleichen: 2,5 ist mehr als 2,05.',
     r'Bei negativen Zahlen ist die mit dem größeren Betrag kleiner.',
     r'Also ist −2,05 größer.'])

Q.q(r'Welche ganzen Zahlen liegen zwischen −2 und 1?',
    [r'−1 und 0', r'−2, −1, 0 und 1', r'−1, 0 und 1', r'nur 0'],
    [r'„Zwischen“ heißt: −2 und 1 gehören nicht dazu.',
     r'Dazwischen: −1 und 0.',
     r'Also −1 und 0.'])

Q.q(r'Welche ist die kleinste ganze Zahl, die größer als −3,5 ist?',
    [r'−3', r'−4', r'−3,4', r'0'],
    [r'−3,5 liegt zwischen −4 und −3.',
     r'Die nächste ganze Zahl rechts davon ist −3.',
     r'−4 ist kleiner als −3,5.'])

Q.q(r'Welche Zahl ist kleiner: $-\dfrac{1}{2}$ oder $-\dfrac{1}{3}$?',
    [r'$-\dfrac{1}{2}$', r'$-\dfrac{1}{3}$', r'Beide sind gleich.', r'Man kann sie nicht vergleichen.'],
    [r'$\dfrac{1}{2} > \dfrac{1}{3}$',
     r'Größerer Betrag heißt bei negativen Zahlen: kleiner.',
     r'$-\dfrac{1}{2} < -\dfrac{1}{3}$'])

Q.q(r'Temperaturen mittags: Montag −2 °C, Dienstag 3 °C, Mittwoch −5 °C, Donnerstag 0 °C. An welchem Tag war es am kältesten?',
    [r'Mittwoch', r'Montag', r'Donnerstag', r'Dienstag'],
    [r'Gesucht ist die kleinste Zahl.',
     r'$-5 < -2 < 0 < 3$',
     r'Am Mittwoch war es am kältesten.'])

# --------------------------------------------------- opposite and absolute value ----
Q.q(r'Wie heißt die Gegenzahl von −8?',
    [r'8', r'−8', r'0', r'$\dfrac{1}{8}$'],
    [r'Die Gegenzahl hat denselben Betrag, aber das andere Vorzeichen.',
     r'−8 → 8',
     r'Probe: $-8 + 8 = 0$.'])

Q.q(r'Wie groß ist der Betrag $|-6|$?',
    [r'6', r'−6', r'0', r'36'],
    [r'Der Betrag ist der Abstand zur Null.',
     r'−6 ist 6 Schritte von 0 entfernt.',
     r'$|-6| = 6$ – ein Betrag ist nie negativ.'])

Q.q(r'Welche Zahlen haben den Betrag 5?',
    [r'5 und −5', r'nur 5', r'nur −5', r'0 und 5'],
    [r'Abstand 5 von der Null:',
     r'5 Schritte nach rechts oder 5 Schritte nach links.',
     r'Also 5 und −5.'])

Q.q(r'Wie heißt die Gegenzahl von 0?',
    [r'0', r'−1', r'1', r'Die 0 hat keine Gegenzahl.'],
    [r'Die 0 liegt genau in der Mitte.',
     r'Gespiegelt bleibt sie an ihrem Platz.',
     r'Die Gegenzahl von 0 ist 0.'])

# ----------------------------------------------------------------------- contexts ----
Q.q(r'Auf dem Konto sind 50 €. Es werden 80 € abgehoben. Wie ist der Kontostand jetzt?',
    [r'−30 €', r'30 €', r'130 €', r'−130 €'],
    [r'Bis 0 € werden 50 € abgehoben.',
     r'Es fehlen noch 30 €.',
     r'Das Konto steht bei −30 € („im Minus“).'])

Q.q(r'Das Ufer des Toten Meeres liegt etwa 430 m unter dem Meeresspiegel. Welche Höhenangabe passt?',
    [r'etwa −430 m', r'etwa 430 m', r'etwa −43 m', r'etwa 0 m'],
    [r'Höhen werden ab dem Meeresspiegel (0 m) gemessen.',
     r'Unter dem Meeresspiegel bekommt die Höhe ein Minus.',
     r'Also etwa −430 m.'])

Q.q(r'Im Aufzug bedeutet „−2“ eine Etage der Tiefgarage. Wo liegt sie?',
    [r'zwei Etagen unter dem Erdgeschoss', r'im zweiten Stock', r'zwei Etagen über dem Dach', r'im Erdgeschoss'],
    [r'Das Erdgeschoss ist die 0.',
     r'Positive Zahlen gehen nach oben, negative nach unten.',
     r'−2 ist zwei Etagen unter dem Erdgeschoss.'])

Q.q(r'In Moskau sind es −12 °C, in Berlin −3 °C. Wie viel Grad ist es in Berlin wärmer?',
    [r'9 Grad', r'15 Grad', r'−9 Grad', r'3 Grad'],
    [r'Von −12 bis −3 auf dem Thermometer zählen.',
     r'Das sind 9 Schritte.',
     r'In Berlin ist es 9 Grad wärmer.'])


def check():
    assert -3 == -3 and F(-3, 2) == D('-1.5')
    assert 4 - (-3) == 7
    assert -7 < -4 and sorted([-3, 2, -5, 0]) == [-5, -3, 0, 2]
    assert D('-2.05') > D('-2.5') and [n for n in range(-5, 5) if -2 < n < 1] == [-1, 0]
    assert min(n for n in range(-10, 10) if n > D('-3.5')) == -3
    assert F(-1, 2) < F(-1, 3)
    t = {'Mo': -2, 'Di': 3, 'Mi': -5, 'Do': 0}
    assert min(t, key=t.get) == 'Mi'
    assert -(-8) == 8 and abs(-6) == 6 and {x for x in range(-9, 10) if abs(x) == 5} == {5, -5} and -0 == 0
    assert 50 - 80 == -30 and -3 - (-12) == 9


Q.verify(check)
Q.save()
