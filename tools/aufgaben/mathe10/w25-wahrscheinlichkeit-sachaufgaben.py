#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 25 / KW 10 (LB 4): Wahrscheinlichkeiten und
Erwartungswerte in Sachaufgaben. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=25, slug='wahrscheinlichkeit-sachaufgaben', thema='Wahrscheinlichkeiten in Sachaufgaben', lb='LB 4',
         blurb='mehrstufige Zufallsversuche modellieren, Gegenereignis, Erwartungswerte, Ergebnisse prüfen',
         comment='Blocks: independent stages (1-4, 7, 10), guessing and games (5-6, 12-13, 19), without replacement and tables (14-15), expectation (8-9, 16, 18), plausibility and counting (11, 17, 20).')

Q.q(r'Auf dem Schulweg liegen zwei Ampeln. Die erste ist mit 40 %, die zweite unabhängig davon mit 50 % Wahrscheinlichkeit grün. Wie wahrscheinlich sind beide grün?',
    [r'20 %', r'90 %', r'45 %', r'10 %'],
    [r'Pfadregel: $0{,}4 \cdot 0{,}5 = 0{,}2 = 20\,\%$'])

Q.q(r'Wie wahrscheinlich muss man an mindestens einer dieser beiden Ampeln halten (also ist mindestens eine nicht grün)?',
    [r'80 %', r'50 %', r'30 %', r'110 %'],
    [r'Gegenereignis: beide grün mit $20\,\%$.', r'$100\,\% - 20\,\% = 80\,\%$'])

Q.q(r'In einer Lieferung sind 5 % der Teile defekt. Man prüft zwei Teile. Wie wahrscheinlich sind beide in Ordnung (gerundet)?',
    [r'90,25 %', r'95 %', r'90 %', r'99,75 %'],
    [r'$0{,}95 \cdot 0{,}95 = 0{,}9025$'])

Q.q(r'Wie wahrscheinlich ist bei zwei geprüften Teilen (5 % defekt) genau eines defekt?',
    [r'9,5 %', r'5 %', r'4,75 %', r'10 %'],
    [r'Zwei Pfade: defekt-gut und gut-defekt.', r'$2 \cdot 0{,}05 \cdot 0{,}95 = 0{,}095 = 9{,}5\,\%$'])

Q.q(r'Ein Test hat 3 Fragen mit je 4 Antworten, von denen eine richtig ist. Jemand rät. Wie wahrscheinlich sind alle drei richtig?',
    [r'$\dfrac{1}{64}$', r'$\dfrac{3}{4}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{4}$'],
    [r'$\left(\dfrac{1}{4}\right)^3 = \dfrac{1}{64}$ – also etwa 1,6 %.'])

Q.q(r'Wie viele richtige Antworten erwartet man bei diesem Raten (3 Fragen, je 4 Antworten)?',
    [r'0,75', r'1', r'3', r'0,25'],
    [r'Jede Frage trägt im Mittel $\dfrac{1}{4}$ richtige Antwort bei.', r'$3 \cdot \dfrac{1}{4} = 0{,}75$'])

Q.q(r'Eine Spielerin verwandelt Elfmeter mit 80 % Wahrscheinlichkeit. Wie wahrscheinlich trifft sie zweimal hintereinander?',
    [r'64 %', r'80 %', r'160 %', r'96 %'],
    [r'$0{,}8 \cdot 0{,}8 = 0{,}64$'])

Q.q(r'Ein Lieferdienst ist mit 80 % Wahrscheinlichkeit pünktlich. Ist er zu spät, gibt es 5 € Rabatt. Wie hoch ist der erwartete Rabatt pro Bestellung?',
    [r'1 €', r'4 €', r'5 €', r'0,20 €'],
    [r'$E = 0 \cdot 0{,}8 + 5 \cdot 0{,}2 = 1$ €'])

Q.q(r'Wie viele Treffer erwartet man bei der Spielerin mit 80 % Trefferquote bei zwei Elfmetern?',
    [r'1,6', r'2', r'0,8', r'1,28'],
    [r'$E = 2 \cdot 0{,}8 = 1{,}6$', r'Oder ausführlich: $0 \cdot 0{,}04 + 1 \cdot 0{,}32 + 2 \cdot 0{,}64 = 1{,}6$'])

Q.q(r'Ein Bus ist an jedem Schultag mit 90 % Wahrscheinlichkeit pünktlich. Wie wahrscheinlich ist er an allen fünf Tagen einer Woche pünktlich (gerundet)?',
    [r'59 %', r'90 %', r'45 %', r'50 %'],
    [r'$0{,}9^5 \approx 0{,}59$', r'Auch ein zuverlässiger Bus schafft eine ganze Woche nur in etwa 6 von 10 Wochen.'])

Q.q(r'Ein Glücksrad hat drei Sektoren mit den Winkeln $120^\circ$, $90^\circ$ und $150^\circ$. Wie wahrscheinlich bleibt es im $90^\circ$-Sektor stehen?',
    [r'25 %', r'90 %', r'33,3 %', r'30 %'],
    [r'$\dfrac{90^\circ}{360^\circ} = \dfrac{1}{4} = 25\,\%$'])

Q.q(r'Zwei Würfel werden geworfen. Wie wahrscheinlich ist ein Pasch (zwei gleiche Augenzahlen)?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{3}$'],
    [r'Sechs Paschs: (1,1) bis (6,6) – also $\dfrac{6}{36} = \dfrac{1}{6}$.'])

Q.q(r'Bei einem Brettspiel darf man dreimal würfeln, um eine 6 zu bekommen. Wie wahrscheinlich gelingt das (gerundet)?',
    [r'42,1 %', r'50 %', r'57,9 %', r'16,7 %'],
    [r'Gegenereignis „dreimal keine 6“: $\left(\dfrac{5}{6}\right)^3 \approx 0{,}579$.', r'$1 - 0{,}579 = 0{,}421$'])

Q.q(r'In einer Lostrommel liegen 5 Lose, 2 davon sind Gewinne. Man zieht zwei Lose ohne Zurücklegen. Wie wahrscheinlich ist mindestens ein Gewinn dabei?',
    [r'70 %', r'40 %', r'30 %', r'80 %'],
    [r'Gegenereignis „zwei Nieten“: $\dfrac{3}{5} \cdot \dfrac{2}{4} = 0{,}3$.', r'$1 - 0{,}3 = 0{,}7$'])

Q.q(r'In einer Klasse kommen 18 von 30 Personen mit dem Fahrrad. Wie wahrscheinlich kommt eine zufällig ausgewählte Person mit dem Fahrrad?',
    [r'60 %', r'18 %', r'40 %', r'1,8 %'],
    [r'$\dfrac{18}{30} = 0{,}6$'])

Q.q(r'Eine Rechnung ergibt eine Wahrscheinlichkeit von 1,2. Was folgt daraus?',
    [r'Es steckt ein Fehler in der Rechnung.', r'Das Ereignis ist besonders sicher.',
     r'Das Ereignis tritt 1,2-mal ein.', r'Man muss auf 1 runden.'],
    [r'Wahrscheinlichkeiten liegen immer zwischen 0 und 1.', r'Häufiger Fehler: Wahrscheinlichkeiten addiert, wo man multiplizieren oder das Gegenereignis nehmen müsste.'])

Q.q(r'Ein Spiel: man gewinnt mit 30 % Wahrscheinlichkeit, der Einsatz beträgt 3 €. Welche Auszahlung macht das Spiel fair?',
    [r'10 €', r'9 €', r'3,90 €', r'6 €'],
    [r'$A \cdot 0{,}3 = 3$ €', r'$A = 3 : 0{,}3 = 10$ €'])

Q.q(r'Ein Gerät kostet in der Reparatur 120 €. Es geht mit 15 % Wahrscheinlichkeit innerhalb eines Jahres kaputt. Eine Garantieverlängerung kostet 25 €. Lohnt sie sich im Mittel?',
    [r'Nein, der erwartete Schaden ist nur 18 €.', r'Ja, der erwartete Schaden ist 25 €.',
     r'Ja, der erwartete Schaden ist 120 €.', r'Das kann man nicht berechnen.'],
    [r'Erwarteter Schaden: $120 \cdot 0{,}15 = 18$ €.', r'$18$ € $< 25$ € – im Mittel lohnt sich die Verlängerung nicht. Für jemanden, der eine Reparatur nicht bezahlen könnte, kann sie trotzdem sinnvoll sein.'])

Q.q(r'Wie viele verschiedene vierstellige PINs gibt es mit den Ziffern 0 bis 9?',
    [r'10 000', r'40', r'5040', r'9999'],
    [r'Für jede der vier Stellen gibt es 10 Möglichkeiten: $10^4 = 10\,000$.'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit, eine vierstellige PIN mit einem einzigen Versuch zu erraten?',
    [r'0,01 %', r'1 %', r'0,1 %', r'25 %'],
    [r'$\dfrac{1}{10\,000} = 0{,}0001 = 0{,}01\,\%$'])


def check():
    from fractions import Fraction as F
    R = lambda x, n=4: round(x, n)
    assert R(0.4 * 0.5) == 0.2 and R(1 - 0.2) == 0.8
    assert R(0.95 ** 2) == 0.9025 and R(2 * 0.05 * 0.95) == 0.095
    assert F(1, 4) ** 3 == F(1, 64) and 3 * F(1, 4) == F(3, 4)
    assert R(0.8 ** 2) == 0.64 and R(5 * 0.2) == 1 and R(2 * 0.8) == 1.6 and R(1 * 0.32 + 2 * 0.64) == 1.6
    assert R(0.9 ** 5, 2) == 0.59 and F(90, 360) == F(1, 4) and F(6, 36) == F(1, 6)
    assert R(1 - (5 / 6) ** 3, 3) == 0.421 and 1 - F(3, 5) * F(2, 4) == F(7, 10) and F(18, 30) == F(3, 5)
    assert R(3 / 0.3) == 10 and R(120 * 0.15) == 18 and 10 ** 4 == 10000


Q.verify(check)
Q.save()
