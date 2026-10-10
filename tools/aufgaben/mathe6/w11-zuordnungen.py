#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 11 / KW 46 (LB 2): assignments from everyday life -
unique, one-to-one, many-valued; words, tables, arrow diagrams. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from decimal import Decimal as D
from quiz import os6
from osfig import pfeildiagramm

Q = os6(nr=11, slug='zuordnungen', thema='Zuordnungen aus der Erfahrungswelt', lb='LB 2',
        blurb='eindeutig, eineindeutig, mehrdeutig, Pfeildarstellung, Wortform und Tabelle',
        comment='Blocks: kinds of assignments (1-7, 10-12), arrow diagrams (8-9), tables and rules (13-20).')

EIN, EINEIN, MEHR = r'eindeutig, aber nicht eineindeutig', r'eineindeutig', r'mehrdeutig'

# --------------------------------------------------- kinds of assignments ----
Q.q(r'Welche Art von Zuordnung ist „Person → Geburtstag (Tag und Monat)“?',
    [EIN, EINEIN, MEHR, r'gar keine Zuordnung'],
    [r'Jede Person hat genau einen Geburtstag: Die Zuordnung ist eindeutig.',
     r'Zwei Personen können aber am selben Tag Geburtstag haben.',
     r'Deshalb ist sie nicht eineindeutig.'])

Q.q(r'Welche Art von Zuordnung ist „Auto → amtliches Kennzeichen“?',
    [EINEIN, EIN, MEHR, r'gar keine Zuordnung'],
    [r'Jedes Auto hat genau ein Kennzeichen.',
     r'Jedes Kennzeichen gehört zu genau einem Auto.',
     r'In beide Richtungen eindeutig: eineindeutig.'])

Q.q(r'Welche Art von Zuordnung ist „Lehrkraft → Fächer, die sie unterrichtet“?',
    [MEHR, EIN, EINEIN, r'gar keine Zuordnung'],
    [r'Viele Lehrkräfte unterrichten zwei oder mehr Fächer.',
     r'Einer Lehrkraft werden dann mehrere Fächer zugeordnet.',
     r'Die Zuordnung ist mehrdeutig.'])

Q.q(r'Welche Art von Zuordnung ist „natürliche Zahl → ihr Doppeltes“?',
    [EINEIN, EIN, MEHR, r'gar keine Zuordnung'],
    [r'Jede Zahl hat genau ein Doppeltes: $3 \to 6$, $7 \to 14$.',
     r'Zu jedem Doppelten gehört genau eine Zahl: $14 \to 7$.',
     r'Also eineindeutig.'])

Q.q(r'Welche Art von Zuordnung ist „natürliche Zahl → ihre Teiler“?',
    [MEHR, EIN, EINEIN, r'gar keine Zuordnung'],
    [r'Die 12 hat die Teiler 1, 2, 3, 4, 6 und 12.',
     r'Einer Zahl werden mehrere Zahlen zugeordnet.',
     r'Also mehrdeutig.'])

Q.q(r'Welche Art von Zuordnung ist „Ware im Supermarkt → Preis“?',
    [EIN, EINEIN, MEHR, r'gar keine Zuordnung'],
    [r'Jede Ware hat genau einen Preis.',
     r'Verschiedene Waren können gleich viel kosten, etwa 1,99 €.',
     r'Also eindeutig, aber nicht eineindeutig.'])

Q.q(r'Welche Zuordnung ist mehrdeutig?',
    [r'Person → ihre Hobbys', r'Person → Schuhgröße', r'natürliche Zahl → ihr Nachfolger', r'Zahl → ihr Quadrat'],
    [r'Eine Person hat genau eine Schuhgröße; eine Zahl hat genau einen Nachfolger und genau ein Quadrat.',
     r'Eine Person kann aber mehrere Hobbys haben.',
     r'„Person → ihre Hobbys“ ist mehrdeutig.'])

# ---------------------------------------------------------- arrow diagrams ----
Q.q(r'Welche Art von Zuordnung zeigt die Pfeildarstellung?',
    [EIN, EINEIN, MEHR, r'gar keine Zuordnung'],
    [r'Von jedem Element links geht genau ein Pfeil aus: eindeutig.',
     r'Bei 1 € kommen aber zwei Pfeile an (Brötchen und Brezel).',
     r'Also nicht eineindeutig.'],
    fig=pfeildiagramm(['Brötchen', 'Brezel', 'Kuchen'], ['1 €', '2 €', '3 €'], [(0, 0), (1, 0), (2, 2)],
                      titles=('Ware', 'Preis')),
    figcap=r'Ware → Preis beim Bäcker')

Q.q(r'Welche Art von Zuordnung zeigt die Pfeildarstellung?',
    [MEHR, EIN, EINEIN, r'gar keine Zuordnung'],
    [r'Von Lea gehen zwei Pfeile aus: Sie spielt Fußball und Gitarre.',
     r'Ein Element links hat mehrere Partner rechts.',
     r'Also mehrdeutig.'],
    fig=pfeildiagramm(['Lea', 'Tom', 'Ali'], ['Fußball', 'Gitarre', 'Schach'], [(0, 0), (0, 1), (1, 2), (2, 0)],
                      titles=('Person', 'Hobby')),
    figcap=r'Person → Hobby')

Q.q(r'Welche Zuordnung ist eineindeutig?',
    [r'natürliche Zahl → ihr Nachfolger', r'Person → Lieblingsfarbe', r'Schulfach → Lehrkräfte der Schule', r'Monat → Anzahl seiner Tage'],
    [r'Lieblingsfarben teilen sich viele, ein Fach haben oft mehrere Lehrkräfte, 30 Tage haben mehrere Monate.',
     r'Jede natürliche Zahl hat genau einen Nachfolger: $5 \to 6$.',
     r'Und jeder Nachfolger hat genau einen Vorgänger: $6 \to 5$. Also eineindeutig.'])

Q.q(r'Die Zuordnung „Person → Sitzplatz im Klassenraum“ ist eineindeutig. Was bedeutet das?',
    [r'Jede Person hat genau einen Platz, und jeder Platz gehört genau einer Person.',
     r'Jede Person hat mehrere Plätze.', r'Zwei Personen teilen sich immer einen Platz.',
     r'Jeder Platz gehört zu mehreren Personen.'],
    [r'Eindeutig: Jede Person bekommt genau einen Platz.',
     r'Ein-eindeutig: auch rückwärts – jeder Platz gehört genau einer Person.',
     r'Man kann also vom Sitzplan auf die Person schließen.'])

Q.q(r'Ist „Alter in Jahren → Körpergröße“ für alle Personen einer Schule eine eindeutige Zuordnung?',
    [r'Nein, zu 12 Jahren gehören viele verschiedene Größen.', r'Ja, das Alter bestimmt die Größe genau.',
     r'Ja, ältere Personen sind immer größer.', r'Nein, weil man Größen nicht messen kann.'],
    [r'In einer Schule gibt es viele Zwölfjährige.',
     r'Sie sind nicht alle gleich groß: 1,45 m, 1,52 m, 1,61 m …',
     r'Einem Alter werden mehrere Größen zugeordnet: mehrdeutig, nicht eindeutig.'])

# -------------------------------------------------------- tables and rules ----
Q.q(r'An einem Tag wird gemessen: 8 Uhr: 12 °C, 10 Uhr: 15 °C, 12 Uhr: 19 °C, 14 Uhr: 21 °C. Zu welcher Uhrzeit war es 15 °C?',
    [r'10 Uhr', r'8 Uhr', r'12 Uhr', r'14 Uhr'],
    [r'Die Zuordnung ist Uhrzeit → Temperatur.',
     r'Gesucht ist rückwärts die Uhrzeit zum Wert 15 °C.',
     r'In der Tabelle steht 15 °C bei 10 Uhr.'])

Q.q(r'Eine Kinokarte kostet 8 €. Was kosten 5 Karten?',
    [r'40 €', r'13 €', r'45 €', r'35 €'],
    [r'Zuordnung: Anzahl Karten → Preis.',
     r'Jede Karte kostet 8 €.',
     r'$5 \cdot 8 = 40$ €'])

Q.q(r'Ein Brötchen kostet 0,40 €. Was steht in der Tabelle bei 6 Brötchen?',
    [r'2,40 €', r'2,00 €', r'6,40 €', r'1,60 €'],
    [r'1 Brötchen: 0,40 €, 2 Brötchen: 0,80 €, 4 Brötchen: 1,60 €',
     r'6 Brötchen: $6 \cdot 0{,}40$',
     r'$= 2{,}40$ €'])

Q.q(r'Ein Liter Benzin kostet 1,80 €. Welcher Tabelleneintrag „Liter → Preis“ ist falsch?',
    [r'30 Liter → 52 €', r'10 Liter → 18 €', r'20 Liter → 36 €', r'40 Liter → 72 €'],
    [r'$10 \cdot 1{,}80 = 18$, $20 \cdot 1{,}80 = 36$, $40 \cdot 1{,}80 = 72$',
     r'$30 \cdot 1{,}80 = 54$',
     r'Der Eintrag 52 € ist falsch.'])

Q.q(r'Jeder Seitenlänge eines Quadrats wird sein Umfang zugeordnet. Was gehört zu 7 cm?',
    [r'28 cm', r'49 cm', r'14 cm', r'21 cm'],
    [r'Ein Quadrat hat vier gleich lange Seiten.',
     r'Umfang: $4 \cdot 7$ cm',
     r'$= 28$ cm. (49 cm² wäre der Flächeninhalt.)'])

Q.q(r'Ein Bus fährt um 7:12 Uhr, 7:32 Uhr und 7:52 Uhr ab, immer im gleichen Takt. Wann fährt der übernächste Bus nach 7:52 Uhr?',
    [r'8:32 Uhr', r'8:12 Uhr', r'8:52 Uhr', r'8:02 Uhr'],
    [r'Der Takt beträgt 20 Minuten.',
     r'Der nächste Bus fährt um 8:12 Uhr.',
     r'Der übernächste um 8:32 Uhr.'])

Q.q(r'Jeder Zahl wird ihr Dreifaches plus 1 zugeordnet. Was wird der 4 zugeordnet?',
    [r'13', r'12', r'15', r'7'],
    [r'Das Dreifache von 4: $3 \cdot 4 = 12$',
     r'Plus 1: $12 + 1 = 13$',
     r'$4 \to 13$'])

Q.q(r'Jeder Zahl wird ihr Dreifaches plus 1 zugeordnet. Welche Zahl hat den Partner 22?',
    [r'7', r'8', r'21', r'66'],
    [r'Rückwärts rechnen: erst minus 1, dann durch 3.',
     r'$22 - 1 = 21$, $21 : 3 = 7$',
     r'Probe: $3 \cdot 7 + 1 = 22$.'])


def check():
    rule = lambda x: 3 * x + 1
    pairs1 = [(0, 0), (1, 0), (2, 2)]
    assert len({i for i, _ in pairs1}) == 3 and len({j for _, j in pairs1}) < 3
    pairs2 = [(0, 0), (0, 1), (1, 2), (2, 0)]
    assert [i for i, _ in pairs2].count(0) == 2
    assert 5 * 8 == 40
    assert 6 * D('0.40') == D('2.40') and 4 * D('0.40') == D('1.60')
    assert [n * D('1.80') for n in (10, 20, 30, 40)] == [18, 36, 54, 72]
    assert 4 * 7 == 28 and 7 * 7 == 49
    assert 32 + 20 == 52 and (52 + 20) - 60 == 12 and 12 + 20 == 32
    assert rule(4) == 13 and rule(7) == 22 and (22 - 1) // 3 == 7
    assert {d for d in range(1, 13) if 12 % d == 0} == {1, 2, 3, 4, 6, 12}


Q.verify(check)
Q.save()
