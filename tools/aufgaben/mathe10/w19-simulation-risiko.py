#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 19 / KW 2 (LB 3): Simulation von Zufallsversuchen
und Risikoabschätzung. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=19, slug='simulation-risiko', thema='Simulation und Risiko', lb='LB 3',
         blurb='Zufallszahlen, relative Häufigkeit, Ausfall technischer Geräte, Versicherung',
         comment='Blocks: simulating with random numbers (1-2, 5-6, 20), relative frequency (3-4, 7, 15-17), failure of devices (8-13), de Mere and insurance (14, 18-19). Problem of the Chevalier de Mere: Pascal and Fermat, letters of 1654.')

Q.q(r'Wie simuliert man den Wurf eines Würfels mit dem Taschenrechner?',
    [r'mit einer ganzzahligen Zufallszahl von 1 bis 6', r'mit einer Zufallszahl zwischen 0 und 1',
     r'mit der Zahl 6 geteilt durch eine Zufallszahl', r'mit einer Zufallszahl von 0 bis 6'],
    [r'Jede der Zahlen 1 bis 6 muss gleich wahrscheinlich vorkommen – sonst nichts.'])

Q.q(r'Wie simuliert man einen Münzwurf mit Zufallszahlen?',
    [r'Zufallszahl 0 oder 1: 0 für Kopf, 1 für Zahl', r'Zufallszahl von 1 bis 6: 6 für Kopf',
     r'Zufallszahl von 1 bis 3: 1 für Kopf', r'Zufallszahl von 0 bis 9: 0 für Kopf'],
    [r'Beide Seiten der Münze sind gleich wahrscheinlich, also braucht man zwei gleich wahrscheinliche Zahlen.'])

Q.q(r'Bei 50 Würfen fiel 11-mal eine 6. Wie groß ist die relative Häufigkeit?',
    [r'0,22', r'0,11', r'0,17', r'11'],
    [r'Relative Häufigkeit $= \dfrac{\text{Anzahl}}{\text{Versuche}} = \dfrac{11}{50} = 0{,}22$'])

Q.q(r'Was passiert mit der relativen Häufigkeit einer 6, wenn man sehr oft würfelt?',
    [r'Sie nähert sich der Wahrscheinlichkeit $\dfrac{1}{6}$.', r'Sie wird immer genau $\dfrac{1}{6}$.',
     r'Sie wird immer größer.', r'Sie schwankt immer stärker.'],
    [r'Das ist das Gesetz der großen Zahlen: die Schwankungen werden mit vielen Würfen kleiner.'])

Q.q(r'Ein Ereignis hat die Wahrscheinlichkeit 30 %. Wie simuliert man es mit Zufallsziffern von 0 bis 9?',
    [r'Es tritt ein, wenn eine der Ziffern 0, 1 oder 2 kommt.', r'Es tritt ein, wenn die Ziffer 3 kommt.',
     r'Es tritt ein, wenn eine der Ziffern 0 bis 7 kommt.', r'Es tritt ein, wenn eine gerade Ziffer kommt.'],
    [r'Drei von zehn gleich wahrscheinlichen Ziffern ergeben $\dfrac{3}{10} = 30\,\%$.'])

Q.q(r'Warum darf man die Augensumme zweier Würfel nicht mit einer Zufallszahl von 2 bis 12 simulieren?',
    [r'Die Summen sind nicht gleich wahrscheinlich.', r'Die Zahl 12 kann nicht vorkommen.',
     r'Man braucht dafür Zufallszahlen mit Komma.', r'Das geht doch, es ist dasselbe.'],
    [r'Die Summe 7 kommt sechsmal so oft wie die Summe 2.', r'Richtig: zwei Zufallszahlen von 1 bis 6 erzeugen und addieren.'])

Q.q(r'Eine Simulation mit 1000 Durchläufen ergibt das Ereignis 412-mal. Welche Wahrscheinlichkeit schätzt man?',
    [r'etwa 41 %', r'genau 41,2 %', r'etwa 4 %', r'etwa 59 %'],
    [r'$\dfrac{412}{1000} = 0{,}412$', r'Eine Simulation liefert nur einen Schätzwert, keinen exakten Wert.'])

Q.q(r'Ein Gerät fällt in einem Jahr mit 2 % Wahrscheinlichkeit aus. Wie groß ist die Wahrscheinlichkeit, dass es das Jahr ohne Ausfall übersteht?',
    [r'98 %', r'2 %', r'96 %', r'100 %'],
    [r'Gegenereignis: $1 - 0{,}02 = 0{,}98$'])

Q.q(r'Eine Anlage braucht zwei Bauteile, die unabhängig voneinander je mit 98 % Wahrscheinlichkeit ein Jahr lang funktionieren. Wie groß ist die Wahrscheinlichkeit, dass beide funktionieren?',
    [r'96,04 %', r'98 %', r'96 %', r'99,96 %'],
    [r'Beide müssen funktionieren: Pfadregel.', r'$0{,}98 \cdot 0{,}98 = 0{,}9604 = 96{,}04\,\%$'])

Q.q(r'Wie groß ist bei 2 % Ausfallwahrscheinlichkeit pro Jahr die Wahrscheinlichkeit, dass das Gerät drei Jahre ohne Ausfall läuft (gerundet)?',
    [r'94,1 %', r'94 %', r'98 %', r'6 %'],
    [r'Drei Jahre ohne Ausfall: $0{,}98^3 \approx 0{,}941$.', r'94 % käme heraus, wenn man fälschlich $3 \cdot 2\,\%$ abzieht.'])

Q.q(r'Mit welcher Wahrscheinlichkeit fällt dieses Gerät (2 % pro Jahr) innerhalb der zwei Jahre Garantie mindestens einmal aus (gerundet)?',
    [r'etwa 4 %', r'genau 2 %', r'etwa 96 %', r'etwa 1 %'],
    [r'Gegenereignis „zwei Jahre ohne Ausfall“: $0{,}98^2 = 0{,}9604$.', r'$1 - 0{,}9604 = 0{,}0396 \approx 4\,\%$'])

Q.q(r'Eine Lichterkette hat 20 Lämpchen in Reihe – fällt eines aus, ist alles dunkel. Jedes funktioniert mit 99 % Wahrscheinlichkeit. Wie wahrscheinlich leuchtet die Kette (gerundet)?',
    [r'81,8 %', r'99 %', r'80 %', r'19,8 %'],
    [r'Alle 20 müssen funktionieren: $0{,}99^{20} \approx 0{,}818$.', r'Viele zuverlässige Teile in Reihe ergeben ein deutlich weniger zuverlässiges Ganzes.'])

Q.q(r'Zwei Pumpen arbeiten parallel; die Anlage fällt nur aus, wenn beide ausfallen. Jede fällt unabhängig mit 10 % Wahrscheinlichkeit aus. Wie wahrscheinlich ist ein Ausfall der Anlage?',
    [r'1 %', r'10 %', r'20 %', r'0,1 %'],
    [r'Beide müssen ausfallen: $0{,}1 \cdot 0{,}1 = 0{,}01 = 1\,\%$', r'Darum baut man wichtige Teile doppelt ein (Redundanz).'])

Q.q(r'Der Chevalier de Méré wettete im 17. Jahrhundert, bei vier Würfen eines Würfels mindestens eine 6 zu werfen. Wie groß ist seine Gewinnwahrscheinlichkeit (gerundet)?',
    [r'51,8 %', r'66,7 %', r'48,2 %', r'16,7 %'],
    [r'Gegenereignis „keine 6 in vier Würfen“: $\left(\dfrac{5}{6}\right)^4 \approx 0{,}482$.', r'$1 - 0{,}482 = 0{,}518$ – knapp über der Hälfte. Quelle: Briefwechsel zwischen Blaise Pascal und Pierre de Fermat, 1654.',
     r'$4 \cdot \dfrac{1}{6} = 66{,}7\,\%$ ist falsch: die Fälle mit mehreren Sechsen würden mehrfach gezählt.'])

Q.q(r'Nach 10 Würfen sind 4 Sechsen gefallen. Ist der Würfel deshalb unfair?',
    [r'Das lässt sich nach so wenigen Würfen nicht sagen.', r'Ja, denn es müssten genau 1 bis 2 Sechsen sein.',
     r'Ja, denn 40 % ist mehr als $\dfrac{1}{6}$.', r'Nein, ein Würfel ist immer fair.'],
    [r'Bei wenigen Würfen schwankt die relative Häufigkeit stark.', r'Erst sehr viele Würfe erlauben eine sichere Aussage.'])

Q.q(r'Ein Spiel wird am Computer 10 000-mal simuliert, die Gewinne werden gemittelt. Was erhält man näherungsweise?',
    [r'den Erwartungswert des Gewinns', r'die Gewinnchance', r'den höchsten möglichen Gewinn', r'den Einsatz'],
    [r'Der Mittelwert vieler Gewinne nähert sich dem Erwartungswert.'])

Q.q(r'Bei 200 Simulationsläufen tritt ein Ereignis 38-mal ein. Wie groß ist die relative Häufigkeit?',
    [r'0,19', r'0,38', r'0,038', r'5,26'],
    [r'$\dfrac{38}{200} = 0{,}19$'])

Q.q(r'Eine Versicherung hat 10 000 Kunden. Jeder hat im Jahr mit 1 % Wahrscheinlichkeit einen Schaden von 500 €. Welchen Beitrag pro Kunde braucht sie mindestens, um die erwarteten Schäden zu decken?',
    [r'5 €', r'50 €', r'500 €', r'1 €'],
    [r'Erwarteter Schaden pro Kunde: $500 \cdot 0{,}01 = 5$ €.', r'Insgesamt $10\,000 \cdot 5 = 50\,000$ €. Dazu kommen in Wirklichkeit noch Kosten und Gewinn.'])

Q.q(r'Risiko A: 1 % Wahrscheinlichkeit für 1000 € Schaden. Risiko B: 10 % für 50 € Schaden. Welches Risiko ist, gemessen am erwarteten Schaden, größer?',
    [r'A mit 10 € erwartetem Schaden', r'B mit 5 € erwartetem Schaden', r'beide gleich', r'B, weil es häufiger eintritt'],
    [r'A: $1000 \cdot 0{,}01 = 10$ €, B: $50 \cdot 0{,}1 = 5$ €.', r'Seltene, aber teure Schäden können das größere Risiko sein.'])

Q.q(r'Was liefert eine Simulation?',
    [r'einen Schätzwert für eine Wahrscheinlichkeit', r'immer den exakten Wert der Wahrscheinlichkeit',
     r'einen Beweis', r'nur bei Würfeln ein Ergebnis'],
    [r'Simulationen helfen, wenn die Rechnung schwer ist. Ihr Ergebnis schwankt aber von Lauf zu Lauf.'])


def check():
    R = lambda x, n=4: round(x, n)
    assert 11 / 50 == 0.22 and 412 / 1000 == 0.412 and 38 / 200 == 0.19
    assert R(1 - 0.02) == 0.98 and R(0.98 ** 2) == 0.9604 and R(0.98 ** 3, 3) == 0.941 and R(1 - 0.98 ** 2) == 0.0396
    assert R(0.99 ** 20, 3) == 0.818 and R(0.1 * 0.1) == 0.01
    assert R((5 / 6) ** 4, 3) == 0.482 and R(1 - (5 / 6) ** 4, 3) == 0.518 and R(4 / 6, 3) == 0.667
    assert 500 * 0.01 == 5 and 10000 * 5 == 50000
    assert 1000 * 0.01 == 10 and R(50 * 0.1) == 5


Q.verify(check)
Q.save()
