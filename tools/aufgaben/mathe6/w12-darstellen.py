#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 12 / KW 47 (LB 2): representing assignments - table of
values, coordinate system (first quadrant), reading graphs, equations. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import graph

Q = os6(nr=12, slug='darstellen', thema='Zuordnungen darstellen', lb='LB 2',
        blurb='Wertetabelle, Koordinatensystem, Graphen lesen, Gleichung',
        comment='Blocks: reading graphs (1-3, 10-13), tables and equations (4, 7-9, 14, 19), coordinates and axes (5-6, 15-18, 20).')

TEMP = [(6, 8), (8, 9), (10, 13), (12, 18), (14, 20), (16, 17), (18, 13)]
WANNE = [(0, 0), (2, 30), (4, 60), (6, 90), (8, 120)]
RAD = [(0, 0), (1, 12), (1.5, 12), (3, 0)]
fig_temp = graph(TEMP, (4, 20), (0, 24), 2, 4, 'Uhr', '°C', label='Temperatur im Tagesverlauf')
fig_wanne = graph(WANNE, (0, 10), (0, 150), 1, 15, 'min', 'Liter', dots=False, label='Wasser in der Badewanne')
fig_rad = graph(RAD, (0, 3.5), (0, 14), 0.5, 2, 'h', 'km', dots=False, label='Radtour von Jana')
cap_temp = r'Temperatur an einem Herbsttag (Uhrzeit → Temperatur in °C)'
cap_wanne = r'Eine Badewanne läuft voll (Zeit in Minuten → Wasser in Litern)'
cap_rad = r'Janas Radtour (Zeit in Stunden → Entfernung von zu Hause in km)'

# ----------------------------------------------------------- reading graphs ----
Q.q(r'Wie warm war es um 12 Uhr?',
    [r'18 °C', r'13 °C', r'20 °C', r'12 °C'],
    [r'Auf der Rechtsachse die 12 suchen.',
     r'Senkrecht nach oben bis zum Graphen gehen.',
     r'Waagerecht nach links ablesen: 18 °C.'],
    fig=fig_temp, figcap=cap_temp)

Q.q(r'Um wie viel Uhr war es am wärmsten?',
    [r'um 14 Uhr', r'um 12 Uhr', r'um 16 Uhr', r'um 18 Uhr'],
    [r'Gesucht ist der höchste Punkt des Graphen.',
     r'Er liegt bei 20 °C.',
     r'Darunter steht auf der Rechtsachse 14 Uhr.'],
    fig=fig_temp, figcap=cap_temp)

Q.q(r'Zwischen welchen Uhrzeiten stieg die Temperatur am stärksten?',
    [r'zwischen 10 und 12 Uhr', r'zwischen 6 und 8 Uhr', r'zwischen 12 und 14 Uhr', r'zwischen 14 und 16 Uhr'],
    [r'Anstiege: 6–8 Uhr um 1 Grad, 8–10 Uhr um 4 Grad, 10–12 Uhr um 5 Grad, 12–14 Uhr um 2 Grad.',
     r'Nach 14 Uhr sinkt die Temperatur.',
     r'Am steilsten ist der Graph zwischen 10 und 12 Uhr.'],
    fig=fig_temp, figcap=cap_temp)

# ------------------------------------------------------ tables and equations ----
Q.q(r'Zur Gleichung $y = 2 \cdot x + 1$ gehört eine Wertetabelle mit $x$ = 0, 1, 2, 3. Welche $y$-Werte stehen darin?',
    [r'1; 3; 5; 7', r'2; 4; 6; 8', r'0; 3; 5; 7', r'1; 2; 3; 4'],
    [r'$x = 0$: $y = 2 \cdot 0 + 1 = 1$',
     r'$x = 1$: $y = 3$, $x = 2$: $y = 5$',
     r'$x = 3$: $y = 2 \cdot 3 + 1 = 7$'])

# --------------------------------------------------- coordinates and axes ----
Q.q(r'Die Zuordnung ist Anzahl Hefte → Preis in €. Welcher Punkt gehört zu „3 Hefte kosten 4,50 €“?',
    [r'$(3 \mid 4{,}5)$', r'$(4{,}5 \mid 3)$', r'$(3 \mid 1{,}5)$', r'$(1 \mid 4{,}5)$'],
    [r'Die Ausgangsgröße (Anzahl) ist die $x$-Koordinate, sie steht zuerst.',
     r'Der Preis ist die $y$-Koordinate.',
     r'Also der Punkt $(3 \mid 4{,}5)$.'])

Q.q(r'Welcher Punkt liegt auf der Hochachse ($y$-Achse)?',
    [r'$(0 \mid 5)$', r'$(5 \mid 0)$', r'$(5 \mid 5)$', r'$(1 \mid 5)$'],
    [r'Auf der Hochachse geht man nicht nach rechts.',
     r'Die $x$-Koordinate ist also 0.',
     r'$(0 \mid 5)$ liegt auf der Hochachse, $(5 \mid 0)$ auf der Rechtsachse.'])

Q.q(r'Eine Wertetabelle: $x$ = 1, 2, 3, 4 und $y$ = 5, 10, 15, 20. Welche Gleichung passt?',
    [r'$y = 5 \cdot x$', r'$y = x + 4$', r'$y = x + 5$', r'$y = 4 \cdot x + 1$'],
    [r'Jeder $y$-Wert ist das Fünffache des $x$-Wertes.',
     r'$y = x + 4$ passt nur für $x = 1$.',
     r'Probe: $5 \cdot 4 = 20$. Also $y = 5 \cdot x$.'])

Q.q(r'Ein Taxi kostet 3 € Grundgebühr und 2 € für jeden Kilometer. Welche Gleichung beschreibt den Preis $y$ in € für $x$ Kilometer?',
    [r'$y = 2 \cdot x + 3$', r'$y = 3 \cdot x + 2$', r'$y = 5 \cdot x$', r'$y = 2 \cdot x$'],
    [r'Für jeden Kilometer 2 €: $2 \cdot x$',
     r'Die Grundgebühr kommt immer dazu: $+ 3$',
     r'$y = 2 \cdot x + 3$'])

Q.q(r'Ein Taxi kostet 3 € Grundgebühr und 2 € für jeden Kilometer. Was kostet eine Fahrt von 7 km?',
    [r'17 €', r'14 €', r'23 €', r'35 €'],
    [r'$y = 2 \cdot 7 + 3$',
     r'$= 14 + 3$',
     r'$= 17$ €'])

Q.q(r'Wie viele Liter sind nach 5 Minuten in der Wanne?',
    [r'75 Liter', r'60 Liter', r'90 Liter', r'50 Liter'],
    [r'In 2 Minuten kommen 30 Liter dazu, also 15 Liter pro Minute.',
     r'Bei 5 Minuten liegt der Graph genau zwischen 60 und 90 Litern.',
     r'$5 \cdot 15 = 75$ Liter'],
    fig=fig_wanne, figcap=cap_wanne)

Q.q(r'Nach wie vielen Minuten sind 105 Liter in der Wanne?',
    [r'nach 7 Minuten', r'nach 6 Minuten', r'nach 8 Minuten', r'nach 10 Minuten'],
    [r'Auf der Hochachse 105 suchen, waagerecht bis zum Graphen.',
     r'Rechnung: $105 : 15 = 7$',
     r'Nach 7 Minuten.'],
    fig=fig_wanne, figcap=cap_wanne)

Q.q(r'Was macht Jana zwischen 1 und 1,5 Stunden?',
    [r'Sie macht eine Pause.', r'Sie fährt schneller.', r'Sie fährt nach Hause.', r'Sie fährt bergauf.'],
    [r'Zwischen 1 h und 1,5 h verläuft der Graph waagerecht.',
     r'Die Entfernung von zu Hause bleibt 12 km.',
     r'Jana bewegt sich nicht: Sie macht eine halbe Stunde Pause.'],
    fig=fig_rad, figcap=cap_rad)

Q.q(r'Wie lange braucht Jana für den Rückweg nach Hause?',
    [r'1,5 Stunden', r'1 Stunde', r'3 Stunden', r'0,5 Stunden'],
    [r'Der Rückweg beginnt nach der Pause bei 1,5 h.',
     r'Bei 3 h ist die Entfernung wieder 0 km.',
     r'$3 - 1{,}5 = 1{,}5$ Stunden – sie fährt zurück langsamer als hin.'],
    fig=fig_rad, figcap=cap_rad)

Q.q(r'Der Preis ist das 1,2-Fache der Anzahl Liter. Welche Gleichung passt ($x$: Liter, $y$: Preis in €)?',
    [r'$y = 1{,}2 \cdot x$', r'$y = x + 1{,}2$', r'$x = 1{,}2 \cdot y$', r'$y = 12 \cdot x$'],
    [r'„Das 1,2-Fache“ heißt: mit 1,2 malnehmen.',
     r'Der Preis $y$ hängt von der Literzahl $x$ ab.',
     r'$y = 1{,}2 \cdot x$'])

Q.q(r'Du zeichnest die Zuordnung Zeit → zurückgelegter Weg. Welche Größe trägst du an der Rechtsachse ($x$-Achse) ab?',
    [r'die Zeit', r'den Weg', r'beide gleichzeitig', r'immer die Größe mit den größeren Zahlen'],
    [r'An die Rechtsachse kommt die Ausgangsgröße, also die Größe vor dem Pfeil.',
     r'Bei Zeit → Weg ist das die Zeit.',
     r'Der Weg kommt an die Hochachse.'])

Q.q(r'Preise bis 90 € sollen auf einer 9 cm langen Hochachse Platz finden. Welche Einteilung passt?',
    [r'1 cm entspricht 10 €', r'1 cm entspricht 1 €', r'1 cm entspricht 90 €', r'1 cm entspricht 9 €'],
    [r'90 € sollen auf 9 cm passen.',
     r'$90 : 9 = 10$',
     r'1 cm entspricht 10 €.'])

Q.q(r'Auf einer Karte gilt: 1 cm entspricht 5 km. Wie lang zeichnest du eine Strecke von 35 km?',
    [r'7 cm', r'5 cm', r'35 cm', r'1,75 cm'],
    [r'5 km pro Zentimeter.',
     r'$35 : 5 = 7$',
     r'Die Strecke wird 7 cm lang.'])

Q.q(r'Die Punkte $(1 \mid 2)$, $(2 \mid 4)$ und $(3 \mid 6)$ gehören zu einer Zuordnung. Welcher Punkt passt auch dazu?',
    [r'$(5 \mid 10)$', r'$(5 \mid 7)$', r'$(10 \mid 5)$', r'$(4 \mid 6)$'],
    [r'Der $y$-Wert ist immer das Doppelte des $x$-Wertes: $y = 2 \cdot x$.',
     r'Zu $x = 5$ gehört $y = 10$.',
     r'$(10 \mid 5)$ hat die Koordinaten vertauscht.'])

Q.q(r'Berechne den $y$-Wert für $x = 6$ bei $y = 0{,}5 \cdot x + 2$.',
    [r'5', r'8', r'3,2', r'6,5'],
    [r'$0{,}5 \cdot 6 = 3$',
     r'$3 + 2 = 5$',
     r'Zum $x$-Wert 6 gehört $y = 5$.'])

Q.q(r'Beim Graphen „Anzahl Kinokarten → Preis“ verbindet man die Punkte nicht. Warum?',
    [r'Es gibt nur ganze Karten, Zwischenwerte wie 2,5 Karten ergeben keinen Sinn.',
     r'Weil die Punkte sonst zu dick werden.', r'Weil Kinokarten nichts kosten.',
     r'Weil man Punkte nie verbinden darf.'],
    [r'Bei der Badewanne fließt das Wasser ohne Pause: Jede Zeit ist möglich, also Linie.',
     r'Karten kann man nur ganz kaufen: 1, 2, 3, …',
     r'Deshalb bleiben es einzelne Punkte.'])


def check():
    T = dict(TEMP)
    assert T[12] == 18 and max(T, key=T.get) == 14
    rises = {(a, b): T[b] - T[a] for a, b in zip(sorted(T), sorted(T)[1:])}
    assert max(rises, key=rises.get) == (10, 12) and rises[(10, 12)] == 5 and rises[(8, 10)] == 4
    assert [2 * x + 1 for x in range(4)] == [1, 3, 5, 7]
    assert all(y == 5 * x for x, y in zip((1, 2, 3, 4), (5, 10, 15, 20))) and 2 + 4 != 10
    assert 2 * 7 + 3 == 17
    rate = F(WANNE[1][1], WANNE[1][0])
    assert rate == 15 and all(y == rate * x for x, y in WANNE) and 5 * rate == 75 and 105 / rate == 7
    assert RAD[1][1] == RAD[2][1] == 12 and RAD[3][0] - RAD[2][0] == 1.5
    assert 90 / 9 == 10 and 35 / 5 == 7
    assert all(y == 2 * x for x, y in ((1, 2), (2, 4), (3, 6), (5, 10))) and not 7 == 2 * 5
    assert D('0.5') * 6 + 2 == 5


Q.verify(check)
Q.save()
