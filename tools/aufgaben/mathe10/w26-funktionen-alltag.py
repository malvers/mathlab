#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 26 / KW 11 (LB 4): funktionale Zusammenhänge im
Alltag – Tarife, Wachstum und Wertverlust, Modelle prüfen. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=26, slug='funktionen-alltag', thema='Funktionale Zusammenhänge im Alltag', lb='LB 4',
         blurb='Tarife vergleichen, lineare und exponentielle Modelle, Wurfparabel, Grenzen von Modellen',
         comment='Blocks: tariffs (1-8), value loss and growth (9-11, 20), limits of models (12, 14), filling, throws, proportions (13, 15-19).')

Q.q(r'Tarif A kostet 5 € Grundgebühr plus 0,10 € pro Minute, Tarif B 0,15 € pro Minute ohne Grundgebühr. Bei wie vielen Minuten kosten beide gleich viel?',
    [r'bei 100 Minuten', r'bei 50 Minuten', r'bei 20 Minuten', r'bei 200 Minuten'],
    [r'$5 + 0{,}10 t = 0{,}15 t$', r'$5 = 0{,}05 t$, also $t = 100$'])

Q.q(r'Was kostet Tarif A (5 € + 0,10 € pro Minute) bei 60 Minuten?',
    [r'11 €', r'6 €', r'9 €', r'65 €'],
    [r'$5 + 0{,}10 \cdot 60 = 5 + 6 = 11$ €'])

Q.q(r'Welcher Tarif ist bei 150 Minuten günstiger (A: 5 € + 0,10 €/min, B: 0,15 €/min)?',
    [r'A mit 20 €', r'B mit 22,50 €', r'beide gleich', r'B mit 15 €'],
    [r'A: $5 + 15 = 20$ €, B: $0{,}15 \cdot 150 = 22{,}50$ €.', r'Ab 100 Minuten ist A günstiger.'])

Q.q(r'Ein Stromtarif kostet 12 € Grundpreis im Monat und 0,35 € pro kWh. Was kosten 200 kWh im Monat?',
    [r'82 €', r'70 €', r'212,35 €', r'24 €'],
    [r'$12 + 0{,}35 \cdot 200 = 12 + 70 = 82$ €'])

Q.q(r'Die Kosten sind $K(x) = 0{,}35 x + 12$ ($x$ in kWh, $K$ in €). Was bedeutet die Zahl 0,35?',
    [r'den Preis pro kWh', r'den monatlichen Grundpreis', r'den Verbrauch', r'die Gesamtkosten'],
    [r'0,35 ist der Anstieg: jede zusätzliche kWh kostet 0,35 € mehr.'])

Q.q(r'Was bedeutet in $K(x) = 0{,}35 x + 12$ die Zahl 12?',
    [r'den Grundpreis, den man auch ohne Verbrauch zahlt', r'den Preis pro kWh', r'die Anzahl der Monate', r'den Verbrauch in kWh'],
    [r'Bei $x = 0$ ist $K = 12$: der y-Achsenabschnitt ist der Grundpreis.'])

Q.q(r'Ein Taxi kostet 4 € Grundpreis plus 2,20 € pro km. Was kostet eine Fahrt über 12 km?',
    [r'30,40 €', r'26,40 €', r'48,00 €', r'18,20 €'],
    [r'$4 + 2{,}20 \cdot 12 = 4 + 26{,}40 = 30{,}40$ €'])

Q.q(r'Wie weit kommt man mit diesem Taxi (4 € + 2,20 € pro km) für 25 € höchstens (gerundet auf eine Stelle)?',
    [r'etwa 9,5 km', r'etwa 11,4 km', r'etwa 13,2 km', r'etwa 6,2 km'],
    [r'$4 + 2{,}20 x = 25$', r'$2{,}20 x = 21$, also $x \approx 9{,}5$ km.'])

Q.q(r'Ein Smartphone für 800 € verliert jedes Jahr 20 % seines Werts. Was ist es nach 2 Jahren noch wert?',
    [r'512 €', r'480 €', r'640 €', r'400 €'],
    [r'$800 \cdot 0{,}8^2 = 800 \cdot 0{,}64 = 512$ €', r'Nicht $2 \cdot 20\,\% = 40\,\%$ abziehen: der zweite Verlust bezieht sich auf 640 €.'])

Q.q(r'Ein Gerät für 800 € wird linear in 4 Jahren abgeschrieben. Wie viel ist es nach 2 Jahren noch wert?',
    [r'400 €', r'512 €', r'200 €', r'600 €'],
    [r'Linear: jedes Jahr gleich viel, $800 : 4 = 200$ € pro Jahr.', r'Nach 2 Jahren: $800 - 400 = 400$ €.'])

Q.q(r'Ein Ort hat 10 000 Einwohner, die Zahl wächst jährlich um 1,5 %. Wie viele sind es nach 4 Jahren (gerundet)?',
    [r'10 614', r'10 600', r'10 150', r'16 000'],
    [r'$10\,000 \cdot 1{,}015^4 \approx 10\,613{,}6$'])

Q.q(r'Eine Kerze ist 20 cm lang und brennt 2 cm pro Stunde ab: $h(t) = 20 - 2t$. Für welche Zeiten ist dieses Modell sinnvoll?',
    [r'$0 \leq t \leq 10$', r'für alle $t$', r'$t \geq 10$', r'$0 \leq t \leq 20$'],
    [r'Nach 10 Stunden ist die Kerze abgebrannt: $h(10) = 0$.', r'Danach würde das Modell negative Längen liefern – das gibt es nicht.'])

Q.q(r'Ein Becken fasst 1200 l, es fließen 40 l pro Minute zu. Nach wie vielen Minuten ist es voll?',
    [r'30 min', r'48 min', r'1160 min', r'3 min'],
    [r'$1200 : 40 = 30$'])

Q.q(r'Ein Kanal hat 100 Follower, die Zahl verdoppelt sich jeden Monat. Nach diesem Modell wären es nach 12 Monaten 409 600. Wie ist das zu bewerten?',
    [r'Das Modell gilt nur für kurze Zeit, so ein Wachstum hält nicht an.', r'Die Rechnung ist falsch, es wären 1200.',
     r'Das ist realistisch, Verdopplung bleibt immer gleich.', r'Es wären genau 2400.'],
    [r'$100 \cdot 2^{12} = 409\,600$ – die Rechnung stimmt.', r'Exponentielles Wachstum stößt in der Wirklichkeit an Grenzen: das Modell muss geprüft werden.'])

Q.q(r'Ein Ball fliegt auf der Bahn $h(x) = -0{,}05 x^2 + x + 1{,}5$ ($x$ und $h$ in m). Wie hoch ist er 4 m nach dem Abwurf?',
    [r'4,7 m', r'5,5 m', r'6,3 m', r'3,9 m'],
    [r'$h(4) = -0{,}05 \cdot 16 + 4 + 1{,}5 = -0{,}8 + 5{,}5 = 4{,}7$ m'])

Q.q(r'Welche größte Höhe erreicht der Ball auf der Bahn $h(x) = -0{,}05 x^2 + x + 1{,}5$?',
    [r'6,5 m bei $x = 10$', r'1,5 m bei $x = 0$', r'11,5 m bei $x = 10$', r'6,5 m bei $x = 20$'],
    [r'Der Scheitel liegt bei $x = -\dfrac{1}{2 \cdot (-0{,}05)} = 10$.', r'$h(10) = -5 + 10 + 1{,}5 = 6{,}5$ m'])

Q.q(r'3 kg Äpfel kosten 5,40 €. Was kosten 5 kg?',
    [r'9,00 €', r'7,40 €', r'10,80 €', r'8,10 €'],
    [r'Proportional: 1 kg kostet $5{,}40 : 3 = 1{,}80$ €.', r'$5 \cdot 1{,}80 = 9$ €'])

Q.q(r'Vier Personen streichen einen Zaun in 6 Tagen. Wie lange brauchen drei Personen bei gleichem Tempo?',
    [r'8 Tage', r'4,5 Tage', r'5 Tage', r'7 Tage'],
    [r'Umgekehrt proportional: die Arbeit beträgt $4 \cdot 6 = 24$ Personentage.', r'$24 : 3 = 8$ Tage'])

Q.q(r'Ein Akku entlädt sich gleichmäßig von 100 % in 10 Stunden auf 0 %. Welcher Graph beschreibt den Ladestand?',
    [r'eine fallende Gerade', r'eine steigende Gerade', r'eine Parabel', r'eine Sinuskurve'],
    [r'Gleichmäßig heißt: pro Stunde immer 10 Prozentpunkte weniger – linear fallend.'])

Q.q(r'Angenommen, Koffein wird im Körper mit einer Halbwertszeit von 5 Stunden abgebaut. Wie viel ist von 200 mg nach 10 Stunden noch vorhanden?',
    [r'50 mg', r'100 mg', r'0 mg', r'150 mg'],
    [r'10 Stunden sind zwei Halbwertszeiten.', r'$200 \to 100 \to 50$ mg'])


def check():
    R = lambda x, n=2: round(x, n)
    assert R(5 / 0.05) == 100 and R(5 + 0.1 * 60) == 11 and R(5 + 15) == 20 and R(0.15 * 150) == 22.5
    assert R(12 + 0.35 * 200) == 82 and R(4 + 2.2 * 12) == 30.4 and R(21 / 2.2, 1) == 9.5
    assert R(800 * 0.8 ** 2) == 512 and 800 - 2 * 200 == 400 and R(10000 * 1.015 ** 4, 0) == 10614
    assert 20 - 2 * 10 == 0 and 1200 / 40 == 30 and 100 * 2 ** 12 == 409600
    h = lambda x: -0.05 * x * x + x + 1.5
    assert R(h(4)) == 4.7 and R(h(10)) == 6.5 and R(-1 / (2 * -0.05)) == 10 and h(10) >= max(h(x / 10) for x in range(0, 300))
    assert R(5.4 / 3 * 5) == 9 and 4 * 6 / 3 == 8 and 200 * 0.5 ** 2 == 50


Q.verify(check)
Q.save()
