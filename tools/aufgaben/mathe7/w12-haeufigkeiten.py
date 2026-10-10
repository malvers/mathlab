#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 12 / KW 47 (LB 2): raw list, tally chart,
absolute and relative frequency, bar chart, stabilising relative frequencies, simulation.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7
from osfig import saeulen

Q = os7(nr=12, slug='haeufigkeiten', thema='Häufigkeiten', lb='LB 2',
        blurb='Urliste, Strichliste, absolute und relative Häufigkeit, Stabilisierung',
        comment='Blocks: raw list and tally (1-6, 18, 20), bar chart (7-9), relative frequency rules (14-17), many trials and simulation (10-13, 19).')

URLISTE = [3, 5, 2, 3, 6, 3, 1, 3, 4, 5]
SAEULEN = {1: 7, 2: 9, 3: 8, 4: 10, 5: 6, 6: 10}
fig_s = saeulen(list(SAEULEN), list(SAEULEN.values()), 2, 12, 'Augenzahl', 'Anzahl', label='Ergebnisse von 50 Würfen')
cap_s = r'50 Würfe mit einem Würfel'
liste = r'3, 5, 2, 3, 6, 3, 1, 3, 4, 5'

# --------------------------------------------------------- raw list and tally ----
Q.q(r'Urliste von 10 Würfen: ' + liste + r'. Wie groß ist die absolute Häufigkeit der 3?',
    [r'4', r'3', r'10', r'0,4'],
    [r'Die absolute Häufigkeit zählt, wie oft ein Ergebnis vorkommt.',
     r'Die 3 steht an der 1., 4., 6. und 8. Stelle.',
     r'Also 4-mal.'])

Q.q(r'Urliste von 10 Würfen: ' + liste + r'. Wie groß ist die relative Häufigkeit der 3?',
    [r'0,4', r'4', r'0,3', r'40'],
    [r'Relative Häufigkeit = absolute Häufigkeit : Anzahl der Würfe',
     r'$4 : 10$',
     r'$= 0{,}4$, also 40 %.'])

Q.q(r'Urliste von 10 Würfen: ' + liste + r'. Welche Augenzahl ist gar nicht vorgekommen?',
    [r'keine – jede Zahl von 1 bis 6 kam mindestens einmal vor', r'die 1', r'die 2', r'die 6'],
    [r'Durchgehen: 1 kommt einmal vor, 2 einmal, 4 einmal, 6 einmal.',
     r'3 kommt viermal, 5 zweimal vor.',
     r'Jede Augenzahl ist dabei. Summe: $1 + 1 + 4 + 1 + 2 + 1 = 10$ ✓'])

Q.q(r'Was ist eine Urliste?',
    [r'die Liste aller Ergebnisse in der Reihenfolge, in der sie aufgetreten sind', r'eine sortierte Tabelle',
     r'eine Liste mit den Wahrscheinlichkeiten', r'eine besonders alte Liste'],
    [r'Man schreibt jedes Ergebnis sofort auf.',
     r'Die Reihenfolge bleibt erhalten.',
     r'Aus der Urliste macht man danach Strichliste und Häufigkeitstabelle.'])

Q.q(r'Eine Strichliste zeigt drei Fünferbündel und einen einzelnen Strich. Wie oft ist das Ergebnis aufgetreten?',
    [r'16', r'4', r'15', r'31'],
    [r'Ein Fünferbündel steht für 5.',
     r'$3 \cdot 5 = 15$',
     r'$15 + 1 = 16$'])

Q.q(r'Bei 40 Würfen trat ein Ergebnis 16-mal auf. Wie groß ist die relative Häufigkeit in Prozent?',
    [r'40 %', r'16 %', r'24 %', r'2,5 %'],
    [r'$\dfrac{16}{40}$',
     r'$= \dfrac{2}{5} = \dfrac{40}{100}$',
     r'= 40 %'])

Q.q(r'In einer Umfrage nennen 24 Personen ihre Lieblingsfarbe, 18 davon sagen „Blau“. Wie groß ist die relative Häufigkeit von „Blau“ als gekürzter Bruch?',
    [r'$\dfrac{3}{4}$', r'$\dfrac{18}{24}$', r'$\dfrac{2}{3}$', r'$\dfrac{1}{4}$'],
    [r'$\dfrac{18}{24}$',
     r'Mit 6 kürzen.',
     r'$= \dfrac{3}{4}$'])

Q.q(r'Bei einer Umfrage antworten 200 Personen. Die relative Häufigkeit für „Ja“ ist 0,35. Wie viele haben „Ja“ gesagt?',
    [r'70', r'35', r'0,35', r'165'],
    [r'Absolute Häufigkeit = relative Häufigkeit · Anzahl',
     r'$0{,}35 \cdot 200$',
     r'$= 70$'])

# --------------------------------------------------------------------- bar chart ----
Q.q(r'Wie groß ist die relative Häufigkeit der Augenzahl 4?',
    [r'0,2', r'10', r'0,1', r'0,4'],
    [r'Die Säule bei 4 ist 10 hoch.',
     r'Insgesamt sind es 50 Würfe.',
     r'$10 : 50 = 0{,}2$'],
    fig=fig_s, figcap=cap_s)

Q.q(r'Welche Augenzahl fiel am seltensten?',
    [r'5', r'1', r'3', r'6'],
    [r'Gesucht ist die niedrigste Säule.',
     r'Bei 5 ist sie nur 6 hoch.',
     r'Die 5 fiel am seltensten.'],
    fig=fig_s, figcap=cap_s)

Q.q(r'Wie oft fiel insgesamt eine gerade Augenzahl?',
    [r'29', r'21', r'25', r'10'],
    [r'Gerade Augenzahlen: 2, 4 und 6.',
     r'$9 + 10 + 10$',
     r'= 29-mal, also relative Häufigkeit 0,58.'],
    fig=fig_s, figcap=cap_s)

# ------------------------------------------------------- relative frequency rules ----
Q.q(r'Wie groß ist die Summe aller relativen Häufigkeiten eines Versuchs?',
    [r'1', r'100', r'die Anzahl der Versuche', r'0'],
    [r'Alle absoluten Häufigkeiten zusammen sind die Anzahl der Versuche $n$.',
     r'Geteilt durch $n$ ergibt das 1.',
     r'Also immer 1 (100 %).'])

Q.q(r'Eine Tabelle hat die relativen Häufigkeiten 0,15; 0,25 und 0,4. Ein Wert fehlt noch. Wie groß ist er?',
    [r'0,2', r'0,8', r'0,1', r'0,25'],
    [r'Alle relativen Häufigkeiten zusammen ergeben 1.',
     r'$0{,}15 + 0{,}25 + 0{,}4 = 0{,}8$',
     r'$1 - 0{,}8 = 0{,}2$'])

Q.q(r'Lena würfelt 20-mal und hat 5 Sechsen, Tim würfelt 30-mal und hat 4 Sechsen. Wie groß ist die relative Häufigkeit der Sechs für alle Würfe zusammen?',
    [r'0,18', r'0,25', r'0,133', r'0,19'],
    [r'Zusammen: $20 + 30 = 50$ Würfe.',
     r'Sechsen zusammen: $5 + 4 = 9$',
     r'$9 : 50 = 0{,}18$ (nicht der Mittelwert aus 0,25 und 0,133!)'])

# --------------------------------------------------------- many trials, simulation ----
Q.q(r'Was beobachtet man bei sehr vielen Würfen mit der relativen Häufigkeit eines Ergebnisses?',
    [r'Sie schwankt immer weniger und pendelt sich bei einem Wert ein.', r'Sie wird immer größer.',
     r'Sie springt immer stärker hin und her.', r'Sie wird am Ende 0.'],
    [r'Nach wenigen Würfen kann sie stark schwanken.',
     r'Mit jedem Wurf ändert sie sich bei großem $n$ nur noch wenig.',
     r'Man sagt: Die relative Häufigkeit stabilisiert sich.'])

Q.q(r'Eine Münze: nach 10 Würfen 0,7 Kopf, nach 100 Würfen 0,54, nach 1000 Würfen 0,507. Welcher Wert ist die beste Schätzung für die Chance auf Kopf?',
    [r'0,507', r'0,7', r'0,54', r'Der Durchschnitt der drei Werte.'],
    [r'Je mehr Würfe, desto verlässlicher ist die relative Häufigkeit.',
     r'Die meisten Würfe stecken im Wert nach 1000 Würfen.',
     r'Beste Schätzung: 0,507 – sehr nah an 0,5.'])

Q.q(r'Eine Reißzwecke fiel bei 1000 Würfen 620-mal auf den Kopf. Wie oft etwa erwartest du „Kopf“ bei 50 Würfen?',
    [r'etwa 31-mal', r'etwa 25-mal', r'genau 31-mal', r'etwa 62-mal'],
    [r'Schätzung der Chance: $620 : 1000 = 0{,}62$',
     r'$0{,}62 \cdot 50 = 31$',
     r'Etwa 31-mal – genau vorhersagen kann man es nicht.'])

Q.q(r'Wie kann man einen Münzwurf mit Zufallszahlen simulieren?',
    [r'Zufallsziffer gerade: Kopf, ungerade: Zahl', r'Man nimmt immer die Ziffer 1.',
     r'Man zählt bis 10.', r'Gar nicht, eine Münze kann man nicht nachahmen.'],
    [r'Bei Zufallsziffern 0 bis 9 sind 5 gerade und 5 ungerade.',
     r'Beide Fälle sind also gleich wahrscheinlich – wie Kopf und Zahl.',
     r'Taschenrechner oder Computer erzeugen schnell Tausende Würfe.'])

Q.q(r'Nach 10 Würfen ist noch keine Sechs gefallen. Was ist eine sinnvolle Aussage?',
    [r'10 Würfe sind zu wenig, um über den Würfel zu urteilen.', r'Der Würfel ist sicher gezinkt.',
     r'Jetzt muss bald eine Sechs kommen.', r'Die Sechs ist bei diesem Würfel unmöglich.'],
    [r'Auch bei einem fairen Würfel kommen lange Serien ohne Sechs vor.',
     r'Der Würfel hat kein Gedächtnis: Die nächste Sechs wird nicht „fällig“.',
     r'Erst sehr viele Würfe erlauben eine gute Beurteilung.'])


Q.q(r'Ein fairer Würfel wird 600-mal geworfen. Wie viele Sechsen erwartet man ungefähr?',
    [r'etwa 100', r'genau 100', r'etwa 60', r'etwa 6'],
    [r'Bei einem fairen Würfel ist jede Augenzahl gleich wahrscheinlich: $\dfrac{1}{6}$.',
     r'$600 \cdot \dfrac{1}{6} = 100$',
     r'Etwa 100 – es können auch 93 oder 108 sein.'])

def check():
    assert URLISTE.count(3) == 4 and len(URLISTE) == 10 and F(4, 10) == F('0.4')
    assert set(URLISTE) == set(range(1, 7)) and [URLISTE.count(k) for k in range(1, 7)] == [1, 1, 4, 1, 2, 1]
    assert 3 * 5 + 1 == 16 and F(16, 40) == F(40, 100) and F(18, 24) == F(3, 4) and D('0.35') * 200 == 70
    assert sum(SAEULEN.values()) == 50 and F(SAEULEN[4], 50) == F('0.2')
    assert min(SAEULEN, key=SAEULEN.get) == 5 and SAEULEN[2] + SAEULEN[4] + SAEULEN[6] == 29
    assert 1 - (D('0.15') + D('0.25') + D('0.4')) == D('0.2')
    assert F(5 + 4, 20 + 30) == F('0.18')
    assert D(620) / 1000 * 50 == 31 and 600 * F(1, 6) == 100


Q.verify(check)
Q.save()
