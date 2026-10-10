#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 9 / KW 44 (LB 2): proportionale Funktionen
y = m · x, Steigung, Steigungsdreieck. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=9, slug='proportionale-funktionen', thema='Proportionale Funktionen', lb='LB 2',
        blurb='y = m · x, Steigung, Steigungsdreieck, Sachbeispiele',
        comment='Blocks: graph and slope (1-6, 11, 16-17), points on the graph (9-10, 19), context (7-8, 12-15, 18, 20).')

# --------------------------------------------------------- Graph und Steigung ----
Q.q(r'Wie sieht der Graph einer Funktion $y = m \cdot x$ aus?',
    [r'eine Gerade durch den Ursprung', r'eine Gerade, die die $y$-Achse bei $m$ schneidet',
     r'eine Parabel', r'eine waagerechte Gerade'],
    [r'Für $x = 0$ ist $y = m \cdot 0 = 0$: Der Graph geht durch $O(0 \mid 0)$.',
     r'Gleich große Schritte in $x$ ergeben gleich große Schritte in $y$: Der Graph ist eine Gerade.'])

Q.q(r'Der Graph von $y = m \cdot x$ geht durch $P(2 \mid 6)$. Wie groß ist $m$?',
    [r'$m = 3$', r'$m = \dfrac{1}{3}$', r'$m = 4$', r'$m = 12$'],
    [r'Einsetzen: $6 = m \cdot 2$',
     r'$m = 6 : 2 = 3$'])

Q.q(r'Berechne $y$ für $y = -0{,}5x$ und $x = 4$.',
    [r'−2', r'2', r'−8', r'3,5'],
    [r'$y = -0{,}5 \cdot 4$',
     r'$y = -2$'])

Q.q(r'Im Steigungsdreieck geht man vom Graphen aus 1 nach rechts und dann 2 nach unten. Wie groß ist die Steigung?',
    [r'$m = -2$', r'$m = 2$', r'$m = -0{,}5$', r'$m = 0{,}5$'],
    [r'$m = \dfrac{\text{Änderung in } y}{\text{Änderung in } x}$',
     r'$m = \dfrac{-2}{1} = -2$, nach unten heißt negativ.'])

Q.q(r'Welche Gerade verläuft am steilsten?',
    [r'$y = -3x$', r'$y = 2x$', r'$y = 0{,}5x$', r'$y = -x$'],
    [r'Wie steil eine Gerade ist, hängt vom Betrag von $m$ ab, nicht vom Vorzeichen.',
     r'Beträge: 3, 2, 0,5 und 1. Am steilsten ist $y = -3x$, sie fällt stark.'])

Q.q(r'Welche Funktion ist fallend?',
    [r'$y = -0{,}2x$', r'$y = 0{,}2x$', r'$y = 5x$', r'$y = \dfrac{3}{4}x$'],
    [r'Bei negativer Steigung werden die $y$-Werte kleiner, wenn $x$ größer wird.',
     r'Nur $m = -0{,}2$ ist negativ.'])

# --------------------------------------------------------------- Sachbezug ----
Q.q(r'Ein Liter Benzin kostet 1,80 €, der Preis ist also $y = 1{,}8x$. Was kosten 35 Liter?',
    [r'63 €', r'36,80 €', r'19,44 €', r'630 €'],
    [r'$y = 1{,}8 \cdot 35$',
     r'$1{,}8 \cdot 35 = 63$, also 63 €.'])

Q.q(r'Ein Radfahrer fährt gleichmäßig 15 km pro Stunde: $s = 15t$. Wie weit kommt er in 2,5 Stunden?',
    [r'37,5 km', r'17,5 km', r'6 km', r'30 km'],
    [r'$s = 15 \cdot 2{,}5$',
     r'$15 \cdot 2 = 30$ und $15 \cdot 0{,}5 = 7{,}5$, zusammen 37,5 km.'])

# ------------------------------------------------------ Punkte auf dem Graph ----
Q.q(r'Der Graph von $y = m \cdot x$ geht durch $P(-3 \mid 6)$. Wie groß ist $m$?',
    [r'$m = -2$', r'$m = 2$', r'$m = -0{,}5$', r'$m = -18$'],
    [r'$6 = m \cdot (-3)$',
     r'$m = 6 : (-3) = -2$'])

Q.q(r'Welcher Punkt liegt auf dem Graphen von $y = -2{,}5x$?',
    [r'$P(4 \mid -10)$', r'$Q(-10 \mid 4)$', r'$R(4 \mid 10)$', r'$S(2 \mid -2{,}5)$'],
    [r'$x = 4$ einsetzen: $y = -2{,}5 \cdot 4 = -10$, also liegt $P$ auf dem Graphen.',
     r'Für $x = 2$ wäre $y = -5$, nicht $-2{,}5$.'])

Q.q(r'Eine Gerade geht durch den Ursprung und durch $P(5 \mid 2)$. Wie groß ist die Steigung?',
    [r'$m = 0{,}4$', r'$m = 2{,}5$', r'$m = 10$', r'$m = 3$'],
    [r'$m = \dfrac{2}{5}$',
     r'$m = 0{,}4$'])

Q.q(r'Ein Wasserhahn füllt eine Wanne mit 12 Litern pro Minute: $y = 12x$. Was bedeutet die Zahl 12?',
    [r'die Liter, die pro Minute hinzukommen', r'die Liter, die am Anfang in der Wanne sind',
     r'die Minuten, bis die Wanne voll ist', r'die Größe der Wanne in Litern'],
    [r'Die Steigung gibt an, um wie viel $y$ wächst, wenn $x$ um 1 wächst.',
     r'Hier: 12 Liter mehr pro Minute.'])

Q.q(r'Die Tabelle gehört zu einer proportionalen Funktion: x: 2, 5, 8 und y: 7, 17,5, 28. Wie lautet die Funktionsgleichung?',
    [r'$y = 3{,}5x$', r'$y = 5x$', r'$y = 2x + 3$', r'$y = 7x$'],
    [r'Proportional: Der Quotient $\dfrac{y}{x}$ ist immer gleich.',
     r'$\dfrac{7}{2} = 3{,}5$, $\dfrac{17{,}5}{5} = 3{,}5$, $\dfrac{28}{8} = 3{,}5$',
     r'$y = 3{,}5x$'])

Q.q(r'Welche Tabelle gehört zu einer proportionalen Funktion?',
    [r'x: 1, 2, 4 und y: 3, 6, 12', r'x: 1, 2, 4 und y: 3, 5, 9',
     r'x: 1, 2, 4 und y: 12, 6, 3', r'x: 1, 2, 4 und y: 1, 4, 16'],
    [r'Prüfe den Quotienten $\dfrac{y}{x}$: Bei der ersten Tabelle ist er immer 3.',
     r'Die dritte ist antiproportional ($x \cdot y = 12$), die vierte gehört zu $y = x^2$.'])

Q.q(r'Ein Weg steigt auf 100 m waagerechter Strecke um 8 m an. Wie groß ist die Steigung $m$?',
    [r'$m = 0{,}08$', r'$m = 8$', r'$m = 12{,}5$', r'$m = 0{,}8$'],
    [r'$m = \dfrac{8}{100}$',
     r'$m = 0{,}08$, das entspricht 8 % Steigung.'])

Q.q(r'Welcher Graph gehört zu $y = 0 \cdot x$?',
    [r'die $x$-Achse', r'die $y$-Achse', r'die Winkelhalbierende $y = x$', r'gar kein Graph'],
    [r'Für jedes $x$ ist $y = 0$.',
     r'Alle Punkte liegen auf der $x$-Achse.'])

Q.q(r'Wie zeichnest du vom Ursprung aus ein Steigungsdreieck für $y = \dfrac{2}{3}x$?',
    [r'3 nach rechts, 2 nach oben', r'2 nach rechts, 3 nach oben', r'3 nach rechts, 2 nach unten', r'2 nach rechts, 3 nach unten'],
    [r'$m = \dfrac{2}{3}$: Zähler ist die Änderung in $y$, Nenner die Änderung in $x$.',
     r'Also 3 nach rechts und 2 nach oben, so erreicht man den Punkt $(3 \mid 2)$.'])

Q.q(r'Ein Zoll sind 2,54 cm, also $y = 2{,}54x$. Wie lang ist eine Bildschirmdiagonale von 15,6 Zoll ungefähr?',
    [r'39,6 cm', r'6,1 cm', r'18,1 cm', r'396 cm'],
    [r'$y = 2{,}54 \cdot 15{,}6$',
     r'$y = 39{,}624$, also rund 39,6 cm.'])

Q.q(r'Eine proportionale Funktion geht durch $P(3 \mid 4)$. Welcher Funktionswert gehört zu $x = 6$?',
    [r'8', r'7', r'10', r'4,5'],
    [r'Proportional: doppeltes $x$, doppeltes $y$.',
     r'$x = 6$ ist das Doppelte von 3, also $y = 2 \cdot 4 = 8$.'])

Q.q(r'Welche Zuordnung ist nicht proportional?',
    [r'Alter einer Person → Körpergröße', r'Anzahl gleicher Hefte → Preis',
     r'Fahrzeit bei gleicher Geschwindigkeit → Weg', r'Menge Mehl → Masse in Gramm'],
    [r'Proportional heißt: doppeltes Argument, doppelter Wert.',
     r'Eine Person mit 20 Jahren ist nicht doppelt so groß wie mit 10 Jahren.'])


def check():
    from fractions import Fraction as F
    assert F(6, 2) == 3 and F(-1, 2) * 4 == -2
    assert F(-2, 1) == -2
    assert max([-3, 2, F(1, 2), -1], key=abs) == -3
    assert F('1.8') * 35 == 63
    assert 15 * F('2.5') == F('37.5')
    assert F(6, -3) == -2
    assert F('-2.5') * 4 == -10 and F('-2.5') * 2 == -5
    assert F(2, 5) == F('0.4')
    assert F(7, 2) == F('17.5') / 5 == F(28, 8) == F('3.5')
    assert [y / x for x, y in [(1, 3), (2, 6), (4, 12)]] == [3, 3, 3]
    assert [x * y for x, y in [(1, 12), (2, 6), (4, 3)]] == [12, 12, 12]
    assert F(8, 100) == F('0.08')
    assert F('2.54') * F('15.6') == F('39.624') and F('15.6') / F('2.54') < 7
    assert F(4, 3) * 6 == 8


Q.verify(check)
Q.save()
