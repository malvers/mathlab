#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 14 / KW 49 (LB 2): Lösbarkeit linearer
Gleichungssysteme, Tarif- und Preisvergleiche. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=14, slug='tarifvergleich', thema='Lösbarkeit und Tarifvergleiche', lb='LB 2',
        blurb='Eine, keine oder unendlich viele Lösungen, Tarife und Preise vergleichen',
        comment='Blocks: number of solutions (1-5, 18-19), tariff comparisons (6-17, 20).')

# --------------------------------------------------------------- Lösbarkeit ----
Q.q(r'Zwei Geraden haben dieselbe Steigung, aber verschiedene $y$-Achsenabschnitte. Wie viele Lösungen hat das zugehörige Gleichungssystem?',
    [r'keine', r'genau eine', r'unendlich viele', r'genau zwei'],
    [r'Gleiche Steigung heißt parallel.',
     r'Verschiedene Achsenabschnitte: Die Geraden liegen nicht aufeinander und schneiden sich nie.'])

Q.q(r'Ein Gleichungssystem hat unendlich viele Lösungen. Was gilt für die beiden Geraden?',
    [r'Sie sind identisch.', r'Sie sind parallel und verschieden.', r'Sie schneiden sich senkrecht.', r'Sie gehen beide durch den Ursprung.'],
    [r'Unendlich viele gemeinsame Punkte gibt es nur, wenn die Geraden aufeinanderliegen.'])

Q.q(r'Wie viele Lösungen hat das System $y = -3x + 2$ und $6x + 2y = 4$?',
    [r'unendlich viele', r'keine', r'genau eine', r'genau zwei'],
    [r'Zweite Gleichung nach $y$: $2y = -6x + 4$, also $y = -3x + 2$.',
     r'Das ist dieselbe Gerade wie die erste.'])

Q.q(r'Wie viele Lösungen hat das System $y = 0{,}5x + 1$ und $x - 2y = 6$?',
    [r'keine', r'unendlich viele', r'genau eine', r'genau zwei'],
    [r'Zweite Gleichung nach $y$: $-2y = -x + 6$, also $y = 0{,}5x - 3$.',
     r'Gleiche Steigung 0,5, verschiedene Achsenabschnitte 1 und −3: parallel.'])

Q.q(r'Welche Gleichung bildet mit $y = 4x - 1$ ein System mit genau einer Lösung?',
    [r'$y = -4x - 1$', r'$y = 4x + 3$', r'$2y = 8x - 2$', r'$y - 4x = 5$'],
    [r'Genau eine Lösung gibt es, wenn die Steigungen verschieden sind.',
     r'$2y = 8x - 2$ ist dieselbe Gerade, $y = 4x + 3$ und $y = 4x + 5$ sind parallel.',
     r'Nur $y = -4x - 1$ hat eine andere Steigung.'])

# ------------------------------------------------------------- Tarifvergleich ----
Q.q(r'Tarif A: 10 € im Monat plus 0,05 € pro Minute. Tarif B: 0,15 € pro Minute ohne Grundgebühr. Bei wie vielen Minuten kosten beide gleich viel?',
    [r'bei 100 Minuten', r'bei 50 Minuten', r'bei 200 Minuten', r'bei 66,7 Minuten'],
    [r'A: $y = 10 + 0{,}05x$, B: $y = 0{,}15x$',
     r'$10 + 0{,}05x = 0{,}15x$, also $10 = 0{,}10x$.',
     r'$x = 100$; darüber ist A günstiger.'])

Q.q(r'Was kostet Tarif A aus der vorigen Aufgabe (10 € plus 0,05 € pro Minute) bei 150 Minuten?',
    [r'17,50 €', r'22,50 €', r'7,50 €', r'10,05 €'],
    [r'$10 + 0{,}05 \cdot 150 = 10 + 7{,}50$',
     r'$= 17{,}50$ €. Tarif B kostet dann $0{,}15 \cdot 150 = 22{,}50$ €.'])

Q.q(r'Stromanbieter A: 120 € Grundpreis pro Jahr und 0,30 € pro kWh. Anbieter B: 60 € und 0,35 € pro kWh. Bei welchem Verbrauch kosten beide gleich viel?',
    [r'bei 1200 kWh', r'bei 600 kWh', r'bei 2400 kWh', r'bei 180 kWh'],
    [r'$120 + 0{,}30x = 60 + 0{,}35x$',
     r'$60 = 0{,}05x$',
     r'$x = 1200$'])

Q.q(r'Ein Haushalt verbraucht 3000 kWh im Jahr. Welcher Anbieter aus der vorigen Aufgabe ist günstiger, und um wie viel?',
    [r'A, um 90 €', r'B, um 90 €', r'A, um 150 €', r'Beide kosten gleich viel.'],
    [r'A: $120 + 0{,}30 \cdot 3000 = 120 + 900 = 1020$ €',
     r'B: $60 + 0{,}35 \cdot 3000 = 60 + 1050 = 1110$ €',
     r'A ist um 90 € günstiger, weil 3000 kWh über dem Gleichstand von 1200 kWh liegen.'])

Q.q(r'Fitnessstudio A: 30 € Aufnahmegebühr und 25 € pro Monat. Studio B: keine Aufnahmegebühr, 30 € pro Monat. Nach wie vielen Monaten haben beide gleich viel gekostet?',
    [r'nach 6 Monaten', r'nach 5 Monaten', r'nach 12 Monaten', r'nach 1 Monat'],
    [r'$30 + 25x = 30x$',
     r'$30 = 5x$, also $x = 6$.'])

Q.q(r'Was bedeutet der Schnittpunkt zweier Tarifgeraden?',
    [r'Bei dieser Menge kosten beide Tarife gleich viel.', r'Dort sind beide Tarife kostenlos.',
     r'Dort beginnt die Grundgebühr.', r'Ab dort ist immer der steilere Tarif günstiger.'],
    [r'Im Schnittpunkt haben beide Funktionen denselben $x$-Wert und denselben Preis.',
     r'Links und rechts davon ist jeweils ein anderer Tarif günstiger.'])

Q.q(r'Mietwagen A kostet 40 € pro Tag, Kilometer frei. Mietwagen B kostet 25 € pro Tag und 0,20 € pro km. Ab wie vielen Kilometern an einem Tag ist A günstiger?',
    [r'ab mehr als 75 km', r'ab mehr als 125 km', r'ab mehr als 200 km', r'ab mehr als 15 km'],
    [r'Gleichstand: $25 + 0{,}20x = 40$',
     r'$0{,}20x = 15$, also $x = 75$.',
     r'Fährt man mehr als 75 km, ist A günstiger.'])

Q.q(r'Handwerker A: 50 € Anfahrt und 40 € pro Stunde. Handwerker B: 20 € Anfahrt und 50 € pro Stunde. Bei welcher Arbeitszeit kosten beide gleich viel?',
    [r'bei 3 Stunden', r'bei 7 Stunden', r'bei 2 Stunden', r'bei 0,6 Stunden'],
    [r'$50 + 40x = 20 + 50x$',
     r'$30 = 10x$, also $x = 3$.',
     r'Beide kosten dann 170 €.'])

Q.q(r'Welcher Handwerker aus der vorigen Aufgabe ist bei 2 Stunden Arbeit günstiger?',
    [r'B, er kostet 120 €.', r'A, er kostet 130 €.', r'Beide kosten 170 €.', r'B, er kostet 100 €.'],
    [r'A: $50 + 40 \cdot 2 = 130$ €',
     r'B: $20 + 50 \cdot 2 = 120$ €',
     r'Unterhalb von 3 Stunden ist B günstiger.'])

Q.q(r'Ein Tarif hat eine höhere Grundgebühr, aber einen niedrigeren Preis pro Einheit als ein anderer. Wann lohnt er sich?',
    [r'bei großer Nutzung', r'bei kleiner Nutzung', r'nie', r'immer'],
    [r'Die Grundgebühr ist ein fester Nachteil.',
     r'Der niedrigere Preis pro Einheit holt diesen Nachteil erst bei vielen Einheiten auf.'])

Q.q(r'Eine 10er-Karte für das Kino kostet 65 €, eine Einzelkarte 8 €. Ab wie vielen Kinobesuchen lohnt sich die 10er-Karte?',
    [r'ab 9 Besuchen', r'ab 8 Besuchen', r'ab 10 Besuchen', r'ab 7 Besuchen'],
    [r'8 Einzelkarten kosten 64 €, das ist noch weniger als 65 €.',
     r'9 Einzelkarten kosten 72 €, das ist mehr als 65 €.',
     r'Ab 9 Besuchen ist die 10er-Karte günstiger.'])

Q.q(r'Taxi A: 3,90 € Grundpreis und 2 € pro km. Taxi B: 6 € Grundpreis und 1,70 € pro km. Bei welcher Strecke kosten beide gleich viel?',
    [r'bei 7 km', r'bei 3 km', r'bei 10 km', r'bei 2,1 km'],
    [r'$3{,}90 + 2x = 6 + 1{,}70x$',
     r'$0{,}30x = 2{,}10$',
     r'$x = 7$'])

Q.q(r'Wie viele Lösungen hat das System $2x - y = 1$ und $4x - 2y = 3$?',
    [r'keine', r'unendlich viele', r'genau eine', r'genau zwei'],
    [r'Nach $y$ umgestellt: $y = 2x - 1$ und $y = 2x - 1{,}5$.',
     r'Gleiche Steigung, verschiedene Achsenabschnitte: parallele Geraden.'])

Q.q(r'Wie viele Lösungen hat das System $3x + y = 7$ und $9x + 3y = 21$?',
    [r'unendlich viele', r'keine', r'genau eine', r'genau drei'],
    [r'Die zweite Gleichung ist das Dreifache der ersten.',
     r'Beide beschreiben die Gerade $y = -3x + 7$.'])

Q.q(r'Streamingdienst: monatlich 7,99 € oder ein Jahresabo für 79,90 €. Wie viel spart man im Jahr mit dem Jahresabo?',
    [r'15,98 €', r'7,99 €', r'71,91 €', r'0,80 €'],
    [r'Monatlich über 12 Monate: $12 \cdot 7{,}99 = 95{,}88$ €',
     r'Ersparnis: $95{,}88 - 79{,}90 = 15{,}98$ €'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x, y = sp.symbols('x y')
    n = lambda a, b: sp.solve((a, b), (x, y), dict=True)
    same = lambda a, b: sp.solve(a, y) == sp.solve(b, y)
    assert same(y + 3*x - 2, 6*x + 2*y - 4)
    assert n(y - x / 2 - 1, x - 2*y - 6) == []
    assert same(2*y - 8*x + 2, y - 4*x + 1)
    assert len(n(y + 4*x + 1, y - 4*x + 1)) == 1
    lin = lambda a, b, c, d: sp.solve(sp.Eq(a + b*x, c + d*x), x)[0]
    R = sp.Rational
    assert lin(10, R(5, 100), 0, R(15, 100)) == 100
    assert 10 + F('0.05') * 150 == F('17.5') and F('0.15') * 150 == F('22.5')
    assert lin(120, R(3, 10), 60, R(35, 100)) == 1200
    a, b = 120 + F('0.3') * 3000, 60 + F('0.35') * 3000
    assert a == 1020 and b == 1110 and b - a == 90
    assert lin(30, 25, 0, 30) == 6
    assert lin(25, R(1, 5), 40, 0) == 75
    assert lin(50, 40, 20, 50) == 3 and 50 + 40 * 3 == 170
    assert 50 + 40 * 2 == 130 and 20 + 50 * 2 == 120
    assert 8 * 8 < 65 < 8 * 9
    assert lin(R(39, 10), 2, 6, R(17, 10)) == 7
    assert n(2*x - y - 1, 4*x - 2*y - 3) == []
    assert same(3*x + y - 7, 9*x + 3*y - 21)
    assert 12 * F('7.99') == F('95.88') and F('95.88') - F('79.90') == F('15.98')


Q.verify(check)
Q.save()
