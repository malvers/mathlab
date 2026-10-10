#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 13 / KW 48 (LB 2): directly, inversely and not proportional
assignments - quotient and product tests, graphs, missing values. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import graph

Q = os6(nr=13, slug='proportional', thema='Proportional oder nicht?', lb='LB 2',
        blurb='direkt proportional, indirekt proportional, nicht proportional, Quotient und Produkt',
        comment='Blocks: recognising the kind (1-2, 10, 15-17), table tests (3-5), graphs (6-7, 13-14), missing values (8-9, 11-12, 18-20).')

DIR, IND, NICHT = r'direkt proportional', r'indirekt proportional', r'nicht proportional'
LINE = [(0, 0), (2, 3), (4, 6), (6, 9)]
HYP = [(1, 12), (2, 6), (3, 4), (4, 3), (6, 2)]

# ------------------------------------------------------ recognising the kind ----
Q.q(r'Welche Zuordnung ist direkt proportional?',
    [r'Anzahl Brötchen → Preis', r'Alter → Körpergröße', r'Anzahl Personen → Zeit für eine gemeinsame Arbeit',
     r'gefahrene Kilometer → Taxipreis mit Grundgebühr'],
    [r'Direkt proportional: doppelt so viel, doppelt so viel; dreimal so viel, dreimal so viel.',
     r'Doppelt so viele Brötchen kosten doppelt so viel.',
     r'Mehr Personen arbeiten schneller (indirekt), beim Taxi stört die Grundgebühr.'])

Q.q(r'Welche Zuordnung ist indirekt proportional?',
    [r'Anzahl Personen → Anteil an einer Pizza', r'Anzahl Hefte → Preis', r'Zeit → Weg beim Wandern mit gleichem Tempo',
     r'Alter → Schuhgröße'],
    [r'Indirekt proportional: doppelt so viel, halb so viel.',
     r'Bei doppelt so vielen Personen bekommt jede nur die Hälfte.',
     r'Hefte → Preis und Zeit → Weg sind direkt proportional.'])

# ------------------------------------------------------------- table tests ----
Q.q(r'Eine Tabelle: $x$ = 2, 4, 6 und $y$ = 3, 6, 9. Welchen Wert hat der Quotient $y : x$?',
    [r'1,5', r'1', r'0,5', r'3'],
    [r'$3 : 2 = 1{,}5$, $6 : 4 = 1{,}5$, $9 : 6 = 1{,}5$',
     r'Der Quotient ist immer gleich: quotientengleich.',
     r'Die Zuordnung ist direkt proportional mit dem Faktor 1,5.'])

Q.q(r'Eine Tabelle: $x$ = 2, 3, 6 und $y$ = 12, 8, 4. Welche Art von Zuordnung liegt vor?',
    [IND, DIR, NICHT, r'gar keine Zuordnung'],
    [r'Produkte: $2 \cdot 12 = 24$, $3 \cdot 8 = 24$, $6 \cdot 4 = 24$',
     r'Das Produkt ist immer gleich: produktgleich.',
     r'Also indirekt proportional.'])

Q.q(r'Eine Tabelle: $x$ = 1, 2, 3, 4 und $y$ = 5, 7, 9, 11. Welche Art von Zuordnung liegt vor?',
    [NICHT, DIR, IND, r'gar keine Zuordnung'],
    [r'Quotienten: $5 : 1 = 5$, aber $7 : 2 = 3{,}5$ – nicht gleich.',
     r'Produkte: 5, 14, 27, 44 – auch nicht gleich.',
     r'Die Zuordnung ist nicht proportional (es kommt jeweils 2 dazu).'])

# ------------------------------------------------------------------- graphs ----
Q.q(r'Wie sieht der Graph einer direkt proportionalen Zuordnung aus?',
    [r'Er ist eine Gerade durch den Ursprung.', r'Er ist eine fallende Kurve.',
     r'Er ist eine waagerechte Linie.', r'Er ist eine Gerade, die nicht durch den Ursprung geht.'],
    [r'Zu 0 gehört 0: Der Graph beginnt im Ursprung $(0 \mid 0)$.',
     r'Jeder Schritt nach rechts bringt gleich viel nach oben.',
     r'Also eine steigende Gerade durch den Ursprung.'])

Q.q(r'Wie sieht der Graph einer indirekt proportionalen Zuordnung aus?',
    [r'Er ist eine fallende Kurve, die den Achsen immer näher kommt.', r'Er ist eine Gerade durch den Ursprung.',
     r'Er ist eine steigende Gerade.', r'Er ist eine waagerechte Linie.'],
    [r'Wird $x$ größer, wird $y$ kleiner: Der Graph fällt.',
     r'Er fällt aber nicht gleichmäßig: erst steil, dann flach.',
     r'Diese Kurve heißt Hyperbel; sie berührt die Achsen nie.'])

Q.q(r'Welcher $y$-Wert gehört zu $x = 8$?',
    [r'12', r'11', r'16', r'10'],
    [r'Der Graph ist eine Gerade durch den Ursprung: direkt proportional.',
     r'Zu $x = 2$ gehört $y = 3$, der Faktor ist $3 : 2 = 1{,}5$.',
     r'$8 \cdot 1{,}5 = 12$'],
    fig=graph(LINE, (0, 8), (0, 12), 1, 2, 'x', 'y', label='Gerade durch den Ursprung'),
    figcap=r'Graph einer Zuordnung')

Q.q(r'Welche Art von Zuordnung zeigt der Graph?',
    [IND, DIR, NICHT, r'gar keine Zuordnung'],
    [r'Die Punkte: $(1 \mid 12)$, $(2 \mid 6)$, $(3 \mid 4)$, $(4 \mid 3)$, $(6 \mid 2)$',
     r'Das Produkt ist immer 12.',
     r'Also indirekt proportional.'],
    fig=graph(HYP, (0, 7), (0, 14), 1, 2, 'x', 'y', join=False, label='fallende Punkte'),
    figcap=r'Graph einer Zuordnung')

# --------------------------------------------------- missing values, rules ----
Q.q(r'Die Zuordnung ist direkt proportional. Zu 3 gehört 12. Was gehört zu 5?',
    [r'20', r'14', r'15', r'7,2'],
    [r'Faktor: $12 : 3 = 4$',
     r'$5 \cdot 4 = 20$',
     r'Probe: $20 : 5 = 4$.'])

Q.q(r'4 Personen brauchen für das Streichen eines Zauns 6 Tage. Wie lange brauchen 3 Personen bei gleichem Tempo?',
    [r'8 Tage', r'4,5 Tage', r'5 Tage', r'7 Tage'],
    [r'Weniger Personen brauchen länger: indirekt proportional.',
     r'Arbeit insgesamt: $4 \cdot 6 = 24$ Personentage.',
     r'$24 : 3 = 8$ Tage'])

Q.q(r'Lea sagt: „Je älter man ist, desto größer ist man. Also ist Alter → Körpergröße direkt proportional.“ Was stimmt?',
    [r'Lea irrt: Wer doppelt so alt ist, ist nicht doppelt so groß.', r'Lea hat recht.',
     r'Die Zuordnung ist indirekt proportional.', r'Je–desto bedeutet immer direkt proportional.'],
    [r'„Je mehr, desto mehr“ reicht für direkte Proportionalität nicht.',
     r'Mit 6 Jahren ist man etwa 1,15 m, mit 12 Jahren aber nicht 2,30 m groß.',
     r'Und Erwachsene wachsen gar nicht mehr. Die Zuordnung ist nicht proportional.'])

Q.q(r'Bei einer direkt proportionalen Zuordnung wird der $x$-Wert verdreifacht. Was passiert mit dem $y$-Wert?',
    [r'Er wird verdreifacht.', r'Er wird gedrittelt.', r'Er bleibt gleich.', r'Er wird um 3 größer.'],
    [r'Direkt proportional: Das Verhältnis $y : x$ bleibt gleich.',
     r'Wird $x$ mit 3 malgenommen, muss auch $y$ mit 3 malgenommen werden.',
     r'Der $y$-Wert wird verdreifacht.'])

Q.q(r'Bei einer indirekt proportionalen Zuordnung wird der $x$-Wert halbiert. Was passiert mit dem $y$-Wert?',
    [r'Er wird verdoppelt.', r'Er wird halbiert.', r'Er bleibt gleich.', r'Er wird um 2 kleiner.'],
    [r'Indirekt proportional: Das Produkt $x \cdot y$ bleibt gleich.',
     r'Wird $x$ halbiert, muss $y$ verdoppelt werden.',
     r'Beispiel: $4 \cdot 6 = 24$ und $2 \cdot 12 = 24$.'])

Q.q(r'Ein Taxi kostet 3 € Grundgebühr und 2 € pro Kilometer. Ist „Kilometer → Preis“ direkt proportional?',
    [r'Nein, 1 km kostet 5 €, 2 km kosten aber nur 7 €.', r'Ja, mehr Kilometer kosten mehr.',
     r'Ja, der Faktor ist 2.', r'Nein, sie ist indirekt proportional.'],
    [r'1 km: $2 + 3 = 5$ €, 2 km: $4 + 3 = 7$ €',
     r'Doppelte Strecke, aber nicht doppelter Preis.',
     r'Wegen der Grundgebühr ist die Zuordnung nicht proportional.'])

Q.q(r'Ein Handytarif kostet jeden Monat 10 €, egal wie viel man telefoniert. Welche Art hat die Zuordnung „Minuten → Monatspreis“?',
    [NICHT, DIR, IND, r'gar keine Zuordnung'],
    [r'Für 0, 100 oder 500 Minuten zahlt man immer 10 €.',
     r'Doppelte Minuten, gleicher Preis: weder direkt noch indirekt proportional.',
     r'Der Graph ist eine waagerechte Linie.'])

Q.q(r'Zu welcher Zuordnung passt die Gleichung $y = 4 \cdot x$?',
    [r'zu einer direkt proportionalen mit dem Faktor 4', r'zu einer indirekt proportionalen',
     r'zu einer mit Grundgebühr 4', r'zu einer, bei der $y$ immer 4 ist'],
    [r'Der $y$-Wert ist immer das Vierfache des $x$-Wertes.',
     r'Der Quotient $y : x$ ist immer 4.',
     r'Also direkt proportional mit dem Faktor 4.'])

Q.q(r'Ein Schwimmbecken wird mit 2 gleichen Pumpen in 6 Stunden gefüllt. Wie lange dauert es mit 3 Pumpen?',
    [r'4 Stunden', r'9 Stunden', r'3 Stunden', r'5 Stunden'],
    [r'Mehr Pumpen, weniger Zeit: indirekt proportional.',
     r'Eine Pumpe allein bräuchte $2 \cdot 6 = 12$ Stunden.',
     r'Drei Pumpen: $12 : 3 = 4$ Stunden'])

Q.q(r'Ein Radfahrer fährt gleichmäßig 15 km in jeder Stunde. Wie weit kommt er in 2,5 Stunden?',
    [r'37,5 km', r'30 km', r'17,5 km', r'6 km'],
    [r'Zeit → Weg ist bei gleichem Tempo direkt proportional.',
     r'$2{,}5 \cdot 15$',
     r'$= 37{,}5$ km'])

Q.q(r'500 g Kirschen kosten 2,50 €. Was kostet 1 kg?',
    [r'5,00 €', r'2,50 €', r'3,00 €', r'1,25 €'],
    [r'1 kg sind 1000 g, also doppelt so viel wie 500 g.',
     r'Doppelte Menge, doppelter Preis.',
     r'$2 \cdot 2{,}50 = 5{,}00$ €'])


def check():
    assert {F(y, x) for x, y in ((2, 3), (4, 6), (6, 9))} == {F(3, 2)}
    assert {x * y for x, y in ((2, 12), (3, 8), (6, 4))} == {24}
    pts = ((1, 5), (2, 7), (3, 9), (4, 11))
    assert len({F(y, x) for x, y in pts}) > 1 and len({x * y for x, y in pts}) > 1
    assert [x * y for x, y in pts] == [5, 14, 27, 44]
    assert all(F(y, x) == F(3, 2) for x, y in LINE[1:]) and 8 * F(3, 2) == 12
    assert {x * y for x, y in HYP} == {12}
    assert 5 * F(12, 3) == 20
    assert 4 * 6 / 3 == 8
    assert 3 * 4 * F(1, 1) == 12 and (2 * 12, 4 * 6) == (24, 24)
    assert (2 * 1 + 3, 2 * 2 + 3) == (5, 7) and 7 != 2 * 5
    assert 2 * 6 / 3 == 4
    assert D('2.5') * 15 == D('37.5')
    assert 2 * D('2.50') == 5


Q.verify(check)
Q.save()
