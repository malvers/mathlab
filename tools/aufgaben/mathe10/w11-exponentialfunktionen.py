#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 11 / KW 46 (LB 2): Exponentialfunktionen
y = c · a^x, Wachstum und Zerfall. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=11, slug='exponentialfunktionen', thema='Exponentialfunktionen: Wachstum und Zerfall', lb='LB 2',
         blurb='Wachstumsfaktor, Anfangswert, Zinseszins, Verdopplung und Halbwertszeit',
         comment='Blocks: growth factor (1-3, 10, 13-14), values (4-9), graph properties (11-12, 19-20), context (15-18).')

Q.q(r'Eine Größe wächst jedes Jahr um 5 %. Welche Art von Wachstum ist das?',
    [r'exponentielles Wachstum', r'lineares Wachstum', r'quadratisches Wachstum', r'gar kein Wachstum'],
    [r'Jedes Jahr kommt nicht derselbe Betrag dazu, sondern derselbe Prozentsatz des aktuellen Werts.',
     r'Gleicher Faktor pro Schritt bedeutet exponentielles Wachstum.'])

Q.q(r'Wie heißt der Wachstumsfaktor bei einer Zunahme um 5 % pro Jahr?',
    [r'1,05', r'0,05', r'5', r'1,5'],
    [r'Neuer Wert $= 100\,\% + 5\,\% = 105\,\%$ des alten Werts.', r'Als Faktor: $1{,}05$.'])

Q.q(r'Ein Wert nimmt jedes Jahr um 20 % ab. Wie heißt der Faktor?',
    [r'0,8', r'0,2', r'1,2', r'$-0{,}2$'],
    [r'Es bleiben $100\,\% - 20\,\% = 80\,\%$ übrig.', r'Faktor $0{,}8$.'])

Q.q(r'Berechne $f(4)$ für $f(x) = 3 \cdot 2^x$.',
    [r'48', r'24', r'1296', r'14'],
    [r'Erst die Potenz: $2^4 = 16$.', r'$3 \cdot 16 = 48$ – nicht $(3 \cdot 2)^4 = 1296$.'])

Q.q(r'1000 € werden zu 3 % Zinsen angelegt, die Zinsen werden mitverzinst. Wie viel Geld ist es nach 2 Jahren?',
    [r'1060,90 €', r'1060,00 €', r'1090,00 €', r'1006,00 €'],
    [r'$1000 \cdot 1{,}03^2 = 1000 \cdot 1{,}0609 = 1060{,}90$ €',
     r'Im zweiten Jahr gibt es auch Zinsen auf die 30 € Zinsen des ersten Jahres.'])

Q.q(r'Wie viel Geld ist es bei 3 % Zinseszins nach 10 Jahren (gerundet)?',
    [r'1343,92 €', r'1300,00 €', r'1030,00 €', r'1103,00 €'],
    [r'$1000 \cdot 1{,}03^{10} \approx 1343{,}92$ €',
     r'Ohne Zinseszins wären es nur $1000 + 10 \cdot 30 = 1300$ €.'])

Q.q(r'Eine Bakterienkultur verdoppelt sich jede Stunde. Am Anfang sind es 500 Bakterien. Wie viele sind es nach 5 Stunden?',
    [r'16 000', r'2500', r'5000', r'3000'],
    [r'$N(t) = 500 \cdot 2^t$', r'$N(5) = 500 \cdot 32 = 16\,000$'])

Q.q(r'Ein Medikament hat eine Halbwertszeit von 6 Stunden. Wie viel ist von 80 mg nach 18 Stunden noch im Körper?',
    [r'10 mg', r'26,7 mg', r'40 mg', r'20 mg'],
    [r'18 Stunden sind drei Halbwertszeiten.', r'$80 \to 40 \to 20 \to 10$ mg, also $80 \cdot 0{,}5^3 = 10$ mg.'])

Q.q(r'Der Graph von $y = c \cdot a^x$ schneidet die y-Achse bei 5. Was folgt daraus?',
    [r'$c = 5$', r'$a = 5$', r'$c = 0$', r'$a = 0{,}5$'],
    [r'Für $x = 0$ ist $a^0 = 1$, also $y = c$.', r'Der Schnittpunkt mit der y-Achse liefert den Anfangswert $c$.'])

Q.q(r'Für welchen Wachstumsfaktor $a$ beschreibt $y = c \cdot a^x$ (mit $c > 0$) eine Abnahme?',
    [r'$0 < a < 1$', r'$a > 1$', r'$a = 1$', r'$a > 2$'],
    [r'Bei einem Faktor kleiner als 1 wird der Wert mit jedem Schritt kleiner.', r'Bei $a = 1$ bleibt alles gleich, bei $a > 1$ wächst es.'])

Q.q(r'Welcher Punkt liegt auf jedem Graphen $y = a^x$ (mit $a > 0$)?',
    [r'$(0 \mid 1)$', r'$(1 \mid 0)$', r'$(0 \mid 0)$', r'$(1 \mid 1)$'],
    [r'$a^0 = 1$ für jede Basis $a > 0$.'])

Q.q(r'Welche y-Werte nimmt $y = 2^x$ an?',
    [r'nur positive Zahlen', r'alle Zahlen', r'nur Zahlen größer als 1', r'nur ganze Zahlen'],
    [r'Für negative $x$ wird der Wert klein, aber nie null oder negativ: $2^{-3} = \dfrac{1}{8}$.', r'Die x-Achse ist eine Asymptote.'])

Q.q(r'Eine Tabelle zeigt: $x = 0, 1, 2$ und $y = 200, 240, 288$. Wie groß ist der Wachstumsfaktor?',
    [r'1,2', r'40', r'0,2', r'1,4'],
    [r'$\dfrac{240}{200} = 1{,}2$ und $\dfrac{288}{240} = 1{,}2$.', r'Die Quotienten sind gleich: exponentielles Wachstum mit dem Faktor $1{,}2$.'])

Q.q(r'Ein Bestand beträgt anfangs 50 und nach einem Jahr 75. Welche Gleichung passt bei exponentiellem Wachstum?',
    [r'$y = 50 \cdot 1{,}5^x$', r'$y = 50 + 25x$', r'$y = 75 \cdot 1{,}5^x$', r'$y = 50 \cdot 25^x$'],
    [r'Anfangswert $c = 50$.', r'Faktor $a = \dfrac{75}{50} = 1{,}5$.', r'$y = 50 + 25x$ wäre lineares Wachstum.'])

Q.q(r'Eine Stadt hat 80 000 Einwohner, die Zahl sinkt jährlich um 2 %. Wie viele sind es nach 3 Jahren (gerundet)?',
    [r'75 295', r'75 200', r'78 400', r'74 800'],
    [r'$80\,000 \cdot 0{,}98^3 \approx 75\,295$', r'Linear mit 1600 weniger pro Jahr käme man auf 75 200 – aber der Verlust wird jedes Jahr etwas kleiner.'])

Q.q(r'Welche Wertefolge gehört zu exponentiellem Wachstum?',
    [r'3, 6, 12, 24', r'3, 6, 9, 12', r'3, 5, 7, 9', r'3, 4, 6, 9'],
    [r'Exponentiell: gleicher Faktor von Schritt zu Schritt. Bei 3, 6, 12, 24 ist es jedes Mal 2.',
     r'3, 6, 9, 12 und 3, 5, 7, 9 wachsen um gleiche Summanden: linear. Bei 3, 4, 6, 9 sind die Quotienten verschieden.'])

Q.q(r'Ein Betrag wächst jährlich um 7 %. Nach etwa wie vielen Jahren hat er sich verdoppelt?',
    [r'nach etwa 10 Jahren', r'nach etwa 14 Jahren', r'nach etwa 7 Jahren', r'nach etwa 20 Jahren'],
    [r'$1{,}07^{10} \approx 1{,}97$, $1{,}07^{11} \approx 2{,}10$', r'Faustregel: Verdopplungszeit $\approx \dfrac{70}{\text{Prozentsatz}} = \dfrac{70}{7} = 10$ Jahre.'])

Q.q(r'Ein Medikament wird pro Stunde zu 20 % abgebaut. Wie viel ist von 100 mg nach 3 Stunden noch vorhanden?',
    [r'51,2 mg', r'40 mg', r'48,8 mg', r'60 mg'],
    [r'Faktor $0{,}8$ pro Stunde: $100 \cdot 0{,}8^3 = 100 \cdot 0{,}512 = 51{,}2$ mg.', r'Nicht $3 \cdot 20\,\% = 60\,\%$ abziehen – jede Stunde bezieht sich auf den Rest.'])

Q.q(r'Welche Funktion ist eine Exponentialfunktion?',
    [r'$y = 2^x$', r'$y = x^2$', r'$y = 2x$', r'$y = \dfrac{2}{x}$'],
    [r'Bei der Exponentialfunktion steht die Variable im Exponenten.', r'$y = x^2$ ist eine Potenzfunktion: dort steht die Variable in der Basis.'])

Q.q(r'Wie verhält sich $y = 0{,}5^x$?',
    [r'Die Funktion fällt.', r'Die Funktion steigt.', r'Sie ist konstant 0,5.', r'Sie fällt erst und steigt dann.'],
    [r'$0{,}5^0 = 1$, $0{,}5^1 = 0{,}5$, $0{,}5^2 = 0{,}25$', r'Faktor kleiner als 1: mit jedem Schritt halbiert sich der Wert.'])


def check():
    R = lambda x, n=2: round(x, n)
    assert 3 * 2 ** 4 == 48 and (3 * 2) ** 4 == 1296
    assert R(1000 * 1.03 ** 2) == 1060.90
    assert R(1000 * 1.03 ** 10) == 1343.92 and 1000 + 10 * 30 == 1300
    assert 500 * 2 ** 5 == 16000
    assert 80 * 0.5 ** 3 == 10
    assert 240 / 200 == 1.2 and 288 / 240 == 1.2
    assert 75 / 50 == 1.5
    assert round(80000 * 0.98 ** 3) == 75295 and 80000 - 3 * 1600 == 75200 and 80000 * 0.98 == 78400
    assert all(b / a == 2 for a, b in zip([3, 6, 12], [6, 12, 24]))
    assert R(1.07 ** 10) == 1.97 and R(1.07 ** 11) == 2.10
    assert R(100 * 0.8 ** 3, 1) == 51.2
    assert 0.5 ** 2 == 0.25


Q.verify(check)
Q.save()
