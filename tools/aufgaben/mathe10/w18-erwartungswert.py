#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 18 / KW 1 (LB 3): der Erwartungswert –
Gewinnchance und Gewinnerwartung, faire Spiele. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=18, slug='erwartungswert', thema='Der Erwartungswert', lb='LB 3',
         blurb='Erwartungswert berechnen und deuten, faire Spiele, Gewinnchance und Gewinnerwartung',
         comment='Blocks: definition and dice (1, 6, 13, 15), games and fairness (2-5, 7-8, 16-17), chance vs expectation (9, 18-20), lotteries and insurance (10-12, 14). Roulette: European wheel with 37 numbers, single number pays 35 to 1.')

Q.q(r'Wie berechnet man den Erwartungswert einer Zufallsgröße X?',
    [r'Jeden Wert mit seiner Wahrscheinlichkeit multiplizieren und alles addieren.', r'Alle Werte addieren und durch ihre Anzahl teilen.',
     r'Den größten Wert mit seiner Wahrscheinlichkeit multiplizieren.', r'Alle Wahrscheinlichkeiten addieren.'],
    [r'$E(X) = x_1 \cdot P(X = x_1) + x_2 \cdot P(X = x_2) + \ldots$', r'Ein einfacher Mittelwert der Werte ist nur richtig, wenn alle Werte gleich wahrscheinlich sind.'])

Q.q(r'Einsatz 1 €, einmal würfeln. Bei einer 6 werden 4 € ausgezahlt, sonst nichts. Wie groß ist der Erwartungswert des Gewinns (gerundet)?',
    [r'$-0{,}33$ €', r'0,50 €', r'3 €', r'$-1$ €'],
    [r'Gewinn 3 € mit $\dfrac{1}{6}$, Verlust 1 € mit $\dfrac{5}{6}$.', r'$E = 3 \cdot \dfrac{1}{6} + (-1) \cdot \dfrac{5}{6} = \dfrac{3 - 5}{6} = -\dfrac{1}{3} \approx -0{,}33$ €'])

Q.q(r'Was bedeutet ein Erwartungswert des Gewinns von $-0{,}33$ € pro Spiel?',
    [r'Auf lange Sicht verliert man im Mittel etwa 33 Cent pro Spiel.', r'Man verliert bei jedem Spiel genau 33 Cent.',
     r'Man gewinnt in 33 % der Spiele.', r'Das Spiel ist fair.'],
    [r'Der Erwartungswert ist ein Durchschnitt über sehr viele Spiele.', r'Im einzelnen Spiel gewinnt man 3 € oder verliert 1 € – 33 Cent kommen nie genau vor.'])

Q.q(r'Wann nennt man ein Glücksspiel fair?',
    [r'wenn der Erwartungswert des Gewinns null ist', r'wenn die Gewinnchance 50 % beträgt',
     r'wenn man oft gewinnt', r'wenn der Einsatz klein ist'],
    [r'Fair heißt: auf lange Sicht gewinnt weder der Spieler noch der Anbieter.', r'Die Gewinnchance allein entscheidet das nicht – es kommt auch auf die Beträge an.'])

Q.q(r'Einsatz 1 €, einmal würfeln, nur bei einer 6 gibt es eine Auszahlung. Wie hoch muss sie sein, damit das Spiel fair ist?',
    [r'6 €', r'5 €', r'4 €', r'7 €'],
    [r'Fair: die erwartete Auszahlung ist gleich dem Einsatz.', r'$A \cdot \dfrac{1}{6} = 1$ €, also $A = 6$ €.'])

Q.q(r'Welchen Erwartungswert hat die Augenzahl beim Wurf eines fairen Würfels?',
    [r'3,5', r'3', r'6', r'21'],
    [r'$E = (1 + 2 + 3 + 4 + 5 + 6) \cdot \dfrac{1}{6} = \dfrac{21}{6} = 3{,}5$'])

Q.q(r'Ein Glücksrad zahlt mit Wahrscheinlichkeit $\dfrac{1}{2}$ nichts, mit $\dfrac{1}{4}$ 2 € und mit $\dfrac{1}{4}$ 4 €. Wie groß ist die erwartete Auszahlung?',
    [r'1,50 €', r'2,00 €', r'6,00 €', r'1,00 €'],
    [r'$E = 0 \cdot \dfrac{1}{2} + 2 \cdot \dfrac{1}{4} + 4 \cdot \dfrac{1}{4} = 0 + 0{,}5 + 1 = 1{,}50$ €'])

Q.q(r'Ein Dreh an diesem Glücksrad kostet 2 €. Welchen Gewinn erwartet man pro Spiel?',
    [r'$-0{,}50$ €', r'0,50 €', r'1,50 €', r'$-2$ €'],
    [r'Erwarteter Gewinn = erwartete Auszahlung minus Einsatz.', r'$1{,}50 - 2 = -0{,}50$ € – das Spiel ist für Spielende ungünstig.'])

Q.q(r'Bei einem Spiel gewinnt man in 60 % der Fälle 1 € und verliert in 40 % der Fälle 2 €. Lohnt es sich auf lange Sicht?',
    [r'Nein, der Erwartungswert ist $-0{,}20$ €.', r'Ja, weil man meistens gewinnt.',
     r'Ja, der Erwartungswert ist 0,20 €.', r'Es ist genau fair.'],
    [r'$E = 1 \cdot 0{,}6 + (-2) \cdot 0{,}4 = 0{,}6 - 0{,}8 = -0{,}2$ €', r'Hohe Gewinnchance, aber negative Gewinnerwartung: die seltenen Verluste sind größer.'])

Q.q(r'Bei einer Lotterie gibt es 1000 Lose. Ausgezahlt werden einmal 500 €, zehnmal 50 € und hundertmal 5 €. Wie groß ist die erwartete Auszahlung pro Los?',
    [r'1,50 €', r'0,50 €', r'555 €', r'5 €'],
    [r'Gesamte Auszahlung: $500 + 10 \cdot 50 + 100 \cdot 5 = 1500$ €.', r'Pro Los: $1500 : 1000 = 1{,}50$ €.'])

Q.q(r'Ein Würfel wird 600-mal geworfen. Wie viele Sechsen erwartet man?',
    [r'etwa 100', r'genau 100', r'etwa 60', r'etwa 6'],
    [r'$600 \cdot \dfrac{1}{6} = 100$', r'„Erwartet“ heißt: ungefähr – genau 100 sind eher selten.'])

Q.q(r'Ein Handy ist 400 € wert. Mit 5 % Wahrscheinlichkeit geht es in einem Jahr kaputt. Wie hoch ist der erwartete Schaden pro Jahr?',
    [r'20 €', r'5 €', r'380 €', r'200 €'],
    [r'$400 \cdot 0{,}05 = 20$ €', r'Eine Versicherung, die 60 € im Jahr kostet, ist nach dieser Rechnung für die Kundschaft im Mittel ein Verlustgeschäft.'])

Q.q(r'Der Erwartungswert der Augenzahl ist 3,5, obwohl man nie 3,5 würfeln kann. Wie passt das zusammen?',
    [r'3,5 ist der Mittelwert der Augenzahlen bei sehr vielen Würfen.', r'Der Würfel ist nicht fair.',
     r'Der Erwartungswert ist falsch berechnet.', r'Man muss auf 4 runden.'],
    [r'Der Erwartungswert ist ein Durchschnitt auf lange Sicht, kein mögliches Einzelergebnis.'])

Q.q(r'X nimmt die Werte 0, 10 und 20 mit den Wahrscheinlichkeiten 0,5, 0,3 und 0,2 an. Berechne $E(X)$.',
    [r'7', r'10', r'30', r'3'],
    [r'$E(X) = 0 \cdot 0{,}5 + 10 \cdot 0{,}3 + 20 \cdot 0{,}2 = 0 + 3 + 4 = 7$'])

Q.q(r'Eine Münze wird zweimal geworfen, X zählt die Anzahl Kopf. Wie groß ist $E(X)$?',
    [r'1', r'0,5', r'2', r'0,25'],
    [r'$P(X = 0) = \dfrac{1}{4}$, $P(X = 1) = \dfrac{1}{2}$, $P(X = 2) = \dfrac{1}{4}$', r'$E = 0 + 1 \cdot \dfrac{1}{2} + 2 \cdot \dfrac{1}{4} = 1$'])

Q.q(r'Einsatz 1 €, zwei Münzwürfe. Bei zweimal Kopf werden 3 € ausgezahlt. Wie groß ist der erwartete Gewinn?',
    [r'$-0{,}25$ €', r'0,75 €', r'2,00 €', r'0 €'],
    [r'Erwartete Auszahlung: $3 \cdot \dfrac{1}{4} = 0{,}75$ €.', r'Gewinn: $0{,}75 - 1 = -0{,}25$ €'])

Q.q(r'Wie hoch müsste die Auszahlung bei zweimal Kopf sein, damit dieses Spiel (Einsatz 1 €) fair ist?',
    [r'4 €', r'3 €', r'2 €', r'1 €'],
    [r'$A \cdot \dfrac{1}{4} = 1$ €, also $A = 4$ €.'])

Q.q(r'Beim Roulette mit 37 Zahlen setzt man 1 € auf eine Zahl. Trifft sie, bekommt man 36 € (Einsatz plus 35 € Gewinn). Wie viel verliert man auf lange Sicht pro Spiel (gerundet)?',
    [r'etwa 2,7 Cent', r'nichts, das Spiel ist fair', r'etwa 1 €', r'etwa 35 Cent'],
    [r'Erwartete Auszahlung: $36 \cdot \dfrac{1}{37} \approx 0{,}973$ €.', r'Erwarteter Gewinn: $0{,}973 - 1 \approx -0{,}027$ €, also etwa 2,7 Cent Verlust pro Euro.'])

Q.q(r'Spiel A hat den Erwartungswert $-0{,}10$ € pro Spiel, Spiel B $-0{,}25$ €. Welches ist für Spielende günstiger?',
    [r'Spiel A', r'Spiel B', r'beide gleich', r'Das kann man nicht sagen.'],
    [r'Bei A verliert man auf lange Sicht im Mittel 10 Cent pro Spiel, bei B 25 Cent.'])

Q.q(r'Warum verdient eine Spielbank auf lange Sicht Geld?',
    [r'Der Erwartungswert des Gewinns ist für Spielende negativ.', r'Die Spielenden gewinnen nie.',
     r'Die Gewinnchance ist immer unter 1 %.', r'Die Kugel ist manipuliert.'],
    [r'Einzelne gewinnen durchaus. Über sehr viele Spiele bleibt aber pro Einsatz im Mittel ein fester Anteil bei der Bank.'])


def check():
    from fractions import Fraction as F
    assert 3 * F(1, 6) - F(5, 6) == F(-1, 3) and round(-1 / 3, 2) == -0.33
    assert F(6, 6) == 1
    assert sum(F(k, 6) for k in range(1, 7)) == F(7, 2)
    assert 2 * F(1, 4) + 4 * F(1, 4) == F(3, 2) and F(3, 2) - 2 == F(-1, 2)
    assert round(0.6 - 2 * 0.4, 9) == -0.2
    assert (500 + 10 * 50 + 100 * 5) / 1000 == 1.5
    assert 600 / 6 == 100 and 400 * 0.05 == 20
    assert round(10 * 0.3 + 20 * 0.2, 9) == 7
    assert 1 * F(1, 2) + 2 * F(1, 4) == 1
    assert 3 * F(1, 4) - 1 == F(-1, 4) and 4 * F(1, 4) == 1
    assert round(36 / 37 - 1, 3) == -0.027


Q.verify(check)
Q.save()
