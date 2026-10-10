#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 5 / KW 38 (LB 1): pie charts - percent to angle
and back (1 % = 3.6 degrees), reading and drawing pie charts, strip and bar charts.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7
from osfig import kreisdiagramm

Q = os7(nr=5, slug='kreisdiagramme', thema='Kreisdiagramme', lb='LB 1',
        blurb='Prozent und Winkel, Kreisdiagramme lesen und zeichnen, andere Diagramme',
        comment='Blocks: percent and angle (1-6, 17-19), reading a pie chart (7-11), from data to chart (12-13, 20), choosing a chart (14-16).')

WEG = [('Bus', 40), ('Fahrrad', 25), ('zu Fuß', 20), ('Auto', 15)]
fig_weg = kreisdiagramm(WEG, label='Schulweg der Klasse 7a')
cap_weg = r'Schulweg der 20 Personen der Klasse 7a'
ang = lambda p: F(str(p)) * F(36, 10)

# --------------------------------------------------------------- percent and angle ----
Q.q(r'Welcher Winkel im Kreisdiagramm gehört zu 1 %?',
    [r'3,6°', r'1°', r'36°', r'0,36°'],
    [r'Der ganze Kreis sind 360°, das entspricht 100 %.',
     r'$360° : 100$',
     r'$= 3{,}6°$'])

Q.q(r'Welcher Winkel gehört zu 25 %?',
    [r'90°', r'25°', r'45°', r'100°'],
    [r'25 % ist ein Viertel.',
     r'Ein Viertel von 360°:',
     r'$360° : 4 = 90°$, ein rechter Winkel.'])

Q.q(r'Welcher Winkel gehört zu 40 %?',
    [r'144°', r'40°', r'160°', r'120°'],
    [r'1 % entspricht 3,6°.',
     r'$40 \cdot 3{,}6°$',
     r'$= 144°$'])

Q.q(r'Welcher Winkel gehört zu 15 %?',
    [r'54°', r'15°', r'45°', r'60°'],
    [r'$15 \cdot 3{,}6°$',
     r'$= 10 \cdot 3{,}6° + 5 \cdot 3{,}6° = 36° + 18°$',
     r'$= 54°$'])

Q.q(r'Ein Kreisausschnitt hat den Winkel 72°. Wie viel Prozent sind das?',
    [r'20 %', r'72 %', r'7,2 %', r'25 %'],
    [r'Rückwärts: durch 3,6° teilen.',
     r'$72 : 3{,}6 = 20$',
     r'= 20 % (72° ist ein Fünftel von 360°).'])

Q.q(r'Ein Kreisausschnitt hat den Winkel 180°. Wie viel Prozent sind das?',
    [r'50 %', r'18 %', r'100 %', r'180 %'],
    [r'180° ist der halbe Kreis.',
     r'Der halbe Kreis ist die Hälfte des Ganzen.',
     r'= 50 %'])

# ----------------------------------------------------------- reading a pie chart ----
Q.q(r'Wie viele Personen der 7a kommen mit dem Bus?',
    [r'8', r'40', r'4', r'12'],
    [r'Der Bus-Anteil ist 40 %.',
     r'40 % von 20 Personen:',
     r'$20 \cdot 0{,}4 = 8$ Personen'],
    fig=fig_weg, figcap=cap_weg)

Q.q(r'Welcher Winkel gehört zum Fahrrad-Sektor?',
    [r'90°', r'25°', r'100°', r'75°'],
    [r'Fahrrad: 25 %.',
     r'$25 \cdot 3{,}6° = 90°$',
     r'Ein Viertel des Kreises.'],
    fig=fig_weg, figcap=cap_weg)

Q.q(r'Wie viel Prozent der 7a kommen NICHT mit dem Auto?',
    [r'85 %', r'15 %', r'75 %', r'60 %'],
    [r'Alle Anteile zusammen sind 100 %.',
     r'Auto: 15 %',
     r'$100\,\% - 15\,\% = 85\,\%$'],
    fig=fig_weg, figcap=cap_weg)

Q.q(r'Wie groß sind alle Winkel eines Kreisdiagramms zusammen?',
    [r'360°', r'180°', r'100°', r'Das hängt von den Daten ab.'],
    [r'Die Sektoren füllen den ganzen Kreis.',
     r'Ein Vollwinkel hat 360°.',
     r'Das entspricht 100 %.'])

Q.q(r'Ein Kreisdiagramm hat die Anteile 35 %, 30 % und 20 %. Wie groß ist der vierte, letzte Anteil?',
    [r'15 %', r'25 %', r'85 %', r'10 %'],
    [r'Alle Anteile zusammen ergeben 100 %.',
     r'$35 + 30 + 20 = 85$',
     r'$100 - 85 = 15$ %'])

# ------------------------------------------------------- from data to chart ----
Q.q(r'Von 30 Personen spielen 12 am liebsten Fußball. Welcher Winkel gehört im Kreisdiagramm zu Fußball?',
    [r'144°', r'120°', r'12°', r'40°'],
    [r'Anteil: $\dfrac{12}{30} = \dfrac{2}{5} = 40\,\%$',
     r'$40 \cdot 3{,}6°$',
     r'$= 144°$ – oder direkt $\dfrac{2}{5} \cdot 360°$.'])

Q.q(r'Von 30 Personen spielen 3 am liebsten Volleyball. Welcher Winkel gehört zu Volleyball?',
    [r'36°', r'30°', r'10°', r'3°'],
    [r'Anteil: $\dfrac{3}{30} = \dfrac{1}{10} = 10\,\%$',
     r'$10 \cdot 3{,}6°$',
     r'$= 36°$'])

Q.q(r'Bei einer Umfrage unter 200 Personen hat ein Sektor den Winkel 54°. Wie viele Personen gehören dazu?',
    [r'30', r'54', r'15', r'108'],
    [r'$54 : 3{,}6 = 15$, also 15 %.',
     r'15 % von 200:',
     r'$200 \cdot 0{,}15 = 30$ Personen'])

# -------------------------------------------------------------- choosing a chart ----
Q.q(r'Wofür eignet sich ein Kreisdiagramm besonders gut?',
    [r'um Anteile an einem Ganzen zu zeigen', r'um einen Temperaturverlauf zu zeigen',
     r'um einen Fahrplan darzustellen', r'um sehr große Zahlen genau abzulesen'],
    [r'Der ganze Kreis ist das Ganze, also 100 %.',
     r'Jeder Sektor zeigt einen Teil davon.',
     r'Man sieht auf einen Blick, welcher Anteil groß und welcher klein ist.'])

Q.q(r'Bei welchen Daten ist ein Kreisdiagramm NICHT sinnvoll?',
    [r'Temperaturen an sieben Tagen einer Woche', r'Anteile der Verkehrsmittel auf dem Schulweg',
     r'Stimmenanteile bei einer Wahl', r'Anteile der Zutaten in einem Müsli'],
    [r'Ein Kreisdiagramm braucht Teile, die zusammen ein Ganzes ergeben.',
     r'Temperaturen verschiedener Tage ergeben zusammen kein Ganzes.',
     r'Dafür ist ein Linien- oder Säulendiagramm besser.'])

Q.q(r'Ein Streifendiagramm ist 10 cm lang. Wie lang ist der Abschnitt für 35 %?',
    [r'3,5 cm', r'35 cm', r'0,35 cm', r'6,5 cm'],
    [r'10 cm entsprechen 100 %.',
     r'1 cm entspricht 10 %.',
     r'35 % → 3,5 cm'])

Q.q(r'Ein Sektor hat den Winkel 120°. Wie viel Prozent sind das ungefähr?',
    [r'33,3 %', r'12 %', r'40 %', r'25 %'],
    [r'120° ist ein Drittel von 360°.',
     r'Ein Drittel sind $33\tfrac{1}{3}$ %.',
     r'Gerundet 33,3 %.'])

Q.q(r'Ben zeichnet für 30 % einen Sektor mit 30°. Was ist richtig?',
    [r'Der Sektor muss 108° haben.', r'Ben hat recht.', r'Der Sektor muss 90° haben.', r'Der Sektor muss 300° haben.'],
    [r'Prozent und Grad sind nicht dasselbe.',
     r'1 % entspricht 3,6°.',
     r'$30 \cdot 3{,}6° = 108°$'])

Q.q(r'In einem Halbkreisdiagramm entspricht der Halbkreis (180°) genau 100 %. Welcher Winkel gehört dann zu 20 %?',
    [r'36°', r'72°', r'20°', r'18°'],
    [r'Jetzt sind 180° das Ganze.',
     r'1 % entspricht $180° : 100 = 1{,}8°$.',
     r'$20 \cdot 1{,}8° = 36°$'])


def check():
    assert ang(1) == F('3.6') and ang(25) == 90 and ang(40) == 144 and ang(15) == 54
    assert F(72) / F('3.6') == 20 and F(180) / F('3.6') == 50
    assert sum(p for _, p in WEG) == 100 and dict(WEG)['Bus'] * 20 / 100 == 8
    assert ang(dict(WEG)['Fahrrad']) == 90 and 100 - dict(WEG)['Auto'] == 85
    assert 100 - (35 + 30 + 20) == 15
    assert F(12, 30) * 360 == 144 and F(3, 30) * 360 == 36
    assert F(54) / F('3.6') == 15 and 200 * F(15, 100) == 30
    assert D('0.35') * 10 == D('3.5')
    assert F(120, 360) * 100 == F(100, 3) and round(100 / 3, 1) == 33.3
    assert ang(30) == 108
    assert F(180, 100) * 20 == 36


Q.verify(check)
Q.save()
