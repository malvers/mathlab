#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 30 / KW 16 (LB 5): abhängige und unabhängige
Ereignisse, Ziehen mit und ohne Zurücklegen. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=30, slug='abhaengige-ereignisse', thema='Abhängige und unabhängige Ereignisse', lb='LB 5',
        blurb='Ziehen mit und ohne Zurücklegen, Gegenereignis, Spielerfehlschluss',
        comment='Blocks: urn with and without replacement (1-3, 15, 18-20), dependence (4-5, 11, 13-14), context (6-10, 12, 16-17).')

# --------------------------------------------------------------- Urnen ----
Q.q(r'In einer Urne sind 3 rote und 2 blaue Kugeln. Es wird zweimal ohne Zurücklegen gezogen. Wie groß ist P(rot, rot)?',
    [r'$\dfrac{3}{10}$', r'$\dfrac{9}{25}$', r'$\dfrac{3}{5}$', r'$\dfrac{6}{25}$'],
    [r'Erster Zug: $\dfrac{3}{5}$. Danach sind noch 2 rote unter 4 Kugeln.',
     r'$\dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{6}{20} = \dfrac{3}{10}$'])

Q.q(r'Dieselbe Urne (3 rot, 2 blau), aber mit Zurücklegen. Wie groß ist jetzt P(rot, rot)?',
    [r'$\dfrac{9}{25}$', r'$\dfrac{3}{10}$', r'$\dfrac{6}{10}$', r'$\dfrac{1}{4}$'],
    [r'Mit Zurücklegen ist die Urne beim zweiten Zug wieder voll.',
     r'$\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$'])

Q.q(r'Aus der Urne (3 rot, 2 blau) wurde ohne Zurücklegen schon eine rote Kugel gezogen. Wie groß ist die Wahrscheinlichkeit, dass auch die zweite rot ist?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{3}{5}$', r'$\dfrac{2}{5}$', r'$\dfrac{3}{4}$'],
    [r'Jetzt liegen noch 2 rote und 2 blaue Kugeln in der Urne.',
     r'$P = \dfrac{2}{4} = \dfrac{1}{2}$'])

Q.q(r'Wann heißen zwei Ereignisse bei einem zweistufigen Versuch unabhängig?',
    [r'wenn das Ergebnis der ersten Stufe die Wahrscheinlichkeiten der zweiten nicht verändert',
     r'wenn sie nie gleichzeitig eintreten', r'wenn sie gleich wahrscheinlich sind', r'wenn die Wahrscheinlichkeiten zusammen 1 ergeben'],
    [r'Beispiel: Zweimal würfeln, der erste Wurf beeinflusst den zweiten nicht.',
     r'Beim Ziehen ohne Zurücklegen ändert sich dagegen der Inhalt der Urne.'])

Q.q(r'Bei welchem Versuch sind die beiden Stufen voneinander abhängig?',
    [r'zwei Karten nacheinander aus einem Stapel ziehen, ohne die erste zurückzulegen', r'zweimal würfeln',
     r'zweimal eine Münze werfen', r'zweimal mit Zurücklegen aus einer Urne ziehen'],
    [r'Ohne Zurücklegen fehlt beim zweiten Zug die erste Karte.',
     r'Die Wahrscheinlichkeiten der zweiten Stufe hängen also vom ersten Ergebnis ab.'])

# ------------------------------------------------------------- Sachbezug ----
Q.q(r'In einer Schublade liegen 4 schwarze und 6 weiße Socken. Zwei werden blind herausgenommen. Wie groß ist die Wahrscheinlichkeit für zwei schwarze?',
    [r'$\dfrac{2}{15}$', r'$\dfrac{4}{25}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{3}$'],
    [r'$\dfrac{4}{10} \cdot \dfrac{3}{9} = \dfrac{12}{90}$',
     r'$= \dfrac{2}{15}$'])

Q.q(r'Wie groß ist in der Sockenaufgabe (4 schwarz, 6 weiß, zwei ohne Zurücklegen) die Wahrscheinlichkeit für zwei gleichfarbige Socken?',
    [r'$\dfrac{7}{15}$', r'$\dfrac{2}{15}$', r'$\dfrac{1}{3}$', r'$\dfrac{13}{25}$'],
    [r'Zwei schwarze: $\dfrac{12}{90}$, zwei weiße: $\dfrac{6}{10} \cdot \dfrac{5}{9} = \dfrac{30}{90}$',
     r'Zusammen $\dfrac{42}{90} = \dfrac{7}{15}$'])

Q.q(r'In einer Losbude sind 20 Lose, 4 davon gewinnen. Du kaufst zwei Lose. Wie groß ist die Wahrscheinlichkeit für zwei Nieten?',
    [r'$\dfrac{12}{19}$', r'$\dfrac{16}{25}$', r'$\dfrac{4}{5}$', r'$\dfrac{3}{5}$'],
    [r'$\dfrac{16}{20} \cdot \dfrac{15}{19} = \dfrac{240}{380}$',
     r'$= \dfrac{12}{19}$'])

Q.q(r'Wie groß ist bei den beiden Losen die Wahrscheinlichkeit für mindestens einen Gewinn?',
    [r'$\dfrac{7}{19}$', r'$\dfrac{12}{19}$', r'$\dfrac{1}{5}$', r'$\dfrac{9}{25}$'],
    [r'Gegenereignis zu „zwei Nieten“.',
     r'$1 - \dfrac{12}{19} = \dfrac{7}{19}$'])

Q.q(r'Aus einem Skatblatt mit 32 Karten (4 Asse) werden zwei Karten ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zwei Asse?',
    [r'$\dfrac{3}{248}$', r'$\dfrac{1}{64}$', r'$\dfrac{1}{8}$', r'$\dfrac{7}{248}$'],
    [r'$\dfrac{4}{32} \cdot \dfrac{3}{31} = \dfrac{12}{992}$',
     r'$= \dfrac{3}{248}$'])

Q.q(r'Eine faire Münze zeigte fünfmal nacheinander Kopf. Wie groß ist die Wahrscheinlichkeit, dass der sechste Wurf Kopf zeigt?',
    [r'$\dfrac{1}{2}$', r'kleiner als $\dfrac{1}{2}$, Zahl ist jetzt „dran“', r'größer als $\dfrac{1}{2}$, Kopf ist „in Serie“', r'$\dfrac{1}{64}$'],
    [r'Die Münze hat kein Gedächtnis: Die Würfe sind unabhängig.',
     r'Der Glaube, Zahl sei jetzt „dran“, heißt Spielerfehlschluss.',
     r'$\dfrac{1}{64}$ wäre die Wahrscheinlichkeit für sechsmal Kopf, bevor geworfen wurde.'])

Q.q(r'In einer Klasse mit 25 Personen tragen 10 eine Brille. Zwei Personen werden ausgelost. Wie groß ist die Wahrscheinlichkeit, dass beide eine Brille tragen?',
    [r'$\dfrac{3}{20}$', r'$\dfrac{4}{25}$', r'$\dfrac{2}{5}$', r'$\dfrac{9}{25}$'],
    [r'Ohne Zurücklegen: $\dfrac{10}{25} \cdot \dfrac{9}{24} = \dfrac{90}{600}$',
     r'$= \dfrac{3}{20}$'])

Q.q(r'Sind zwei Würfe mit demselben Würfel voneinander abhängig?',
    [r'Nein, der erste Wurf ändert nichts an den Wahrscheinlichkeiten des zweiten.', r'Ja, eine Zahl kommt nicht zweimal.',
     r'Ja, der Würfel erinnert sich.', r'Nur wenn beim ersten Mal eine Sechs fällt.'],
    [r'Jeder Wurf hat wieder die Wahrscheinlichkeit $\dfrac{1}{6}$ für jede Augenzahl.'])

Q.q(r'Eine Urne enthält eine rote und eine blaue Kugel. Ohne Zurücklegen wurde zuerst Rot gezogen. Wie groß ist P(blau) im zweiten Zug?',
    [r'1', r'$\dfrac{1}{2}$', r'0', r'$\dfrac{1}{4}$'],
    [r'Es ist nur noch die blaue Kugel übrig.',
     r'Das Ereignis ist sicher: $P = 1$.'])

Q.q(r'Urne mit 3 roten und 2 blauen Kugeln, zwei Züge ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für mindestens eine rote Kugel?',
    [r'$\dfrac{9}{10}$', r'$\dfrac{3}{10}$', r'$\dfrac{21}{25}$', r'$\dfrac{3}{5}$'],
    [r'Gegenereignis: zwei blaue, $\dfrac{2}{5} \cdot \dfrac{1}{4} = \dfrac{1}{10}$.',
     r'$P = 1 - \dfrac{1}{10} = \dfrac{9}{10}$'])

Q.q(r'Von 100 Glühbirnen sind 5 defekt. Zwei werden ohne Zurücklegen geprüft. Wie groß ist die Wahrscheinlichkeit, dass beide in Ordnung sind (gerundet)?',
    [r'0,902', r'0,950', r'0,9025', r'0,893'],
    [r'$\dfrac{95}{100} \cdot \dfrac{94}{99} = \dfrac{8930}{9900}$',
     r'$\approx 0{,}902$'])

Q.q(r'Mit Zurücklegen wäre die Wahrscheinlichkeit in der vorigen Aufgabe 0,9025. Warum ist der Unterschied so klein?',
    [r'Bei 100 Glühbirnen ändert das Entfernen einer Birne die Anteile kaum.', r'Weil defekte Birnen leichter sind.',
     r'Weil mit und ohne Zurücklegen immer dasselbe ergibt.', r'Weil nur zwei Birnen geprüft werden.'],
    [r'Ohne Zurücklegen: $\dfrac{94}{99} \approx 0{,}949$, mit Zurücklegen $\dfrac{95}{100} = 0{,}95$.',
     r'Bei großen Gesamtzahlen ist der Unterschied gering, bei kleinen (Urne mit 5 Kugeln) groß.'])

Q.q(r'Wie erkennt man im Baumdiagramm das Ziehen ohne Zurücklegen?',
    [r'In der zweiten Stufe sind die Nenner um 1 kleiner.', r'Alle Äste haben dieselbe Wahrscheinlichkeit.',
     r'Es gibt nur eine Stufe.', r'Die Wahrscheinlichkeiten werden addiert.'],
    [r'Nach dem ersten Zug fehlt eine Kugel.',
     r'Deshalb steht in der zweiten Stufe im Nenner eine Kugel weniger.'])

Q.q(r'Aus 3 roten und 2 blauen Kugeln werden drei ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit, dass alle drei rot sind?',
    [r'$\dfrac{1}{10}$', r'$\dfrac{27}{125}$', r'$\dfrac{3}{10}$', r'$\dfrac{1}{5}$'],
    [r'$\dfrac{3}{5} \cdot \dfrac{2}{4} \cdot \dfrac{1}{3} = \dfrac{6}{60}$',
     r'$= \dfrac{1}{10}$'])

Q.q(r'Aus Karten mit den Zahlen 1 bis 5 werden zwei ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit, zuerst die 1 und dann die 2 zu ziehen?',
    [r'$\dfrac{1}{20}$', r'$\dfrac{1}{25}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{10}$'],
    [r'$\dfrac{1}{5} \cdot \dfrac{1}{4} = \dfrac{1}{20}$',
     r'$\dfrac{1}{10}$ wäre die Wahrscheinlichkeit für 1 und 2 in beliebiger Reihenfolge.'])


def check():
    from fractions import Fraction as F
    assert F(3, 5) * F(2, 4) == F(3, 10) and F(3, 5) ** 2 == F(9, 25) and F(2, 4) == F(1, 2)
    assert F(4, 10) * F(3, 9) == F(2, 15) and F(4, 10) * F(3, 9) + F(6, 10) * F(5, 9) == F(7, 15)
    nn = F(16, 20) * F(15, 19)
    assert nn == F(12, 19) and 1 - nn == F(7, 19)
    assert F(4, 32) * F(3, 31) == F(3, 248)
    assert F(10, 25) * F(9, 24) == F(3, 20)
    assert 1 - F(2, 5) * F(1, 4) == F(9, 10)
    assert round(95 / 100 * 94 / 99, 3) == 0.902 and F(95, 100) ** 2 == F('0.9025')
    assert F(3, 5) * F(2, 4) * F(1, 3) == F(1, 10)
    assert F(1, 5) * F(1, 4) == F(1, 20) and 2 * F(1, 20) == F(1, 10)


Q.verify(check)
Q.save()
