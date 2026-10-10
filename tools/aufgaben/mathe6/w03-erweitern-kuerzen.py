#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 3 / KW 36 (LB 1): fractions on the number line, expanding
and reducing, mixed numbers. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from math import gcd
from quiz import os6
from osfig import zahlenstrahl

Q = os6(nr=3, slug='erweitern-kuerzen', thema='Zahlenstrahl, Erweitern und Kürzen', lb='LB 1',
        blurb='Brüche am Zahlenstrahl, Erweitern, Kürzen, gemischte Zahlen',
        comment='Blocks: number line (1-4), expanding and reducing (5-12), mixed numbers (13-15), everyday shares (16-20).')

# ------------------------------------------------------------ number line ----
Q.q(r'Welcher Bruch gehört zum markierten Punkt?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{3}{4}$', r'$\dfrac{2}{5}$', r'$\dfrac{5}{3}$'],
    [r'Die Strecke von 0 bis 1 ist in 5 gleich große Teile geteilt: Jeder Teil ist ein Fünftel.',
     r'Der Punkt liegt beim dritten Strich nach der 0.',
     r'Also bei $\dfrac{3}{5}$.'],
    fig=zahlenstrahl(0, 1, 5, [(F(3, 5), '?')]), figcap=r'Zahlenstrahl von 0 bis 1 in Fünfteln')

Q.q(r'Welcher Bruch gehört zum markierten Punkt?',
    [r'$\dfrac{7}{4}$', r'$\dfrac{7}{8}$', r'$\dfrac{3}{4}$', r'$\dfrac{4}{7}$'],
    [r'Jede Einheit ist in 4 Teile geteilt: Ein Teil ist ein Viertel.',
     r'Bis zur 1 sind es 4 Viertel, danach noch 3 weitere.',
     r'$4 + 3 = 7$ Viertel, also $\dfrac{7}{4} = 1\tfrac{3}{4}$.'],
    fig=zahlenstrahl(0, 2, 4, [(F(7, 4), '?')]), figcap=r'Zahlenstrahl von 0 bis 2 in Vierteln')

Q.q(r'Welcher Bruch liegt am Zahlenstrahl genau bei der 1?',
    [r'$\dfrac{5}{5}$', r'$\dfrac{1}{5}$', r'$\dfrac{5}{1}$', r'$\dfrac{0}{5}$'],
    [r'Ein Bruch hat den Wert 1, wenn Zähler und Nenner gleich sind.',
     r'$\dfrac{5}{5} = 5 : 5 = 1$',
     r'$\dfrac{5}{1}$ ist 5 und $\dfrac{0}{5}$ ist 0.'])

Q.q(r'Zwischen 0 und 1 trägt Ben Sechstel ein. Bei welchem Strich liegt $\dfrac{2}{3}$?',
    [r'beim vierten Strich', r'beim zweiten Strich', r'beim dritten Strich', r'beim sechsten Strich'],
    [r'Erweitern auf Sechstel: $\dfrac{2}{3} = \dfrac{2 \cdot 2}{3 \cdot 2} = \dfrac{4}{6}$',
     r'$\dfrac{4}{6}$ liegt beim vierten Sechstel-Strich.',
     r'Der dritte Strich wäre $\dfrac{3}{6} = \dfrac{1}{2}$.'])

# ------------------------------------------------- expanding and reducing ----
Q.q(r'Erweitere $\dfrac{2}{3}$ mit 4.',
    [r'$\dfrac{8}{12}$', r'$\dfrac{6}{7}$', r'$\dfrac{2}{12}$', r'$\dfrac{8}{3}$'],
    [r'Erweitern: Zähler UND Nenner mit derselben Zahl malnehmen.',
     r'$\dfrac{2 \cdot 4}{3 \cdot 4} = \dfrac{8}{12}$',
     r'Der Wert bleibt gleich, nur die Einteilung wird feiner.'])

Q.q(r'Kürze $\dfrac{12}{18}$ mit 6.',
    [r'$\dfrac{2}{3}$', r'$\dfrac{6}{9}$', r'$\dfrac{3}{2}$', r'$\dfrac{1}{3}$'],
    [r'Kürzen: Zähler UND Nenner durch dieselbe Zahl teilen.',
     r'$\dfrac{12 : 6}{18 : 6} = \dfrac{2}{3}$',
     r'$\dfrac{6}{9}$ entsteht beim Kürzen mit 2 – das ist noch nicht fertig.'])

Q.q(r'Welcher Bruch ist gleich groß wie $\dfrac{3}{4}$?',
    [r'$\dfrac{15}{20}$', r'$\dfrac{4}{5}$', r'$\dfrac{6}{12}$', r'$\dfrac{9}{16}$'],
    [r'Gleich groß sind Brüche, die durch Erweitern oder Kürzen auseinander hervorgehen.',
     r'$\dfrac{3 \cdot 5}{4 \cdot 5} = \dfrac{15}{20}$',
     r'$\dfrac{6}{12} = \dfrac{1}{2}$ und $\dfrac{9}{16}$ ist kein Erweitern (oben mal 3, unten mal 4).'])

Q.q(r'Kürze $\dfrac{24}{36}$ vollständig.',
    [r'$\dfrac{2}{3}$', r'$\dfrac{4}{6}$', r'$\dfrac{6}{9}$', r'$\dfrac{3}{4}$'],
    [r'Vollständig gekürzt heißt: Zähler und Nenner haben keinen gemeinsamen Teiler außer 1 mehr.',
     r'Der größte gemeinsame Teiler von 24 und 36 ist 12.',
     r'$\dfrac{24 : 12}{36 : 12} = \dfrac{2}{3}$'])

Q.q(r'Mit welcher Zahl kann man $\dfrac{16}{40}$ in einem einzigen Schritt vollständig kürzen?',
    [r'8', r'4', r'2', r'16'],
    [r'Gesucht ist der größte gemeinsame Teiler von 16 und 40.',
     r'Teiler von 16: 1, 2, 4, 8, 16. Davon teilt 8 auch die 40, 16 nicht.',
     r'$\dfrac{16 : 8}{40 : 8} = \dfrac{2}{5}$'])

Q.q(r'Erweitere $\dfrac{3}{5}$ auf den Nenner 20.',
    [r'$\dfrac{12}{20}$', r'$\dfrac{3}{20}$', r'$\dfrac{15}{20}$', r'$\dfrac{8}{20}$'],
    [r'Von 5 auf 20: Der Nenner wird mit 4 malgenommen.',
     r'Der Zähler auch: $3 \cdot 4 = 12$.',
     r'$\dfrac{3}{5} = \dfrac{12}{20}$'])

Q.q(r'Welche Zahl gehört in das Kästchen? $\dfrac{5}{6} = \dfrac{\square}{42}$',
    [r'35', r'30', r'41', r'5'],
    [r'Vom Nenner 6 zum Nenner 42: $42 : 6 = 7$, also mit 7 erweitern.',
     r'$5 \cdot 7 = 35$',
     r'$\dfrac{5}{6} = \dfrac{35}{42}$'])

Q.q(r'Welcher Bruch lässt sich NICHT kürzen?',
    [r'$\dfrac{7}{9}$', r'$\dfrac{6}{9}$', r'$\dfrac{4}{10}$', r'$\dfrac{15}{25}$'],
    [r'Man kann kürzen, wenn Zähler und Nenner einen gemeinsamen Teiler größer als 1 haben.',
     r'6 und 9: Teiler 3. 4 und 10: Teiler 2. 15 und 25: Teiler 5.',
     r'7 und 9 haben nur den gemeinsamen Teiler 1.'])

# ---------------------------------------------------------- mixed numbers ----
Q.q(r'Schreibe $2\tfrac{1}{3}$ als Bruch.',
    [r'$\dfrac{7}{3}$', r'$\dfrac{5}{3}$', r'$\dfrac{21}{3}$', r'$\dfrac{3}{7}$'],
    [r'2 Ganze sind $2 \cdot 3 = 6$ Drittel.',
     r'Dazu kommt noch 1 Drittel: $6 + 1 = 7$.',
     r'$2\tfrac{1}{3} = \dfrac{7}{3}$'])

Q.q(r'Schreibe $\dfrac{17}{5}$ als gemischte Zahl.',
    [r'$3\tfrac{2}{5}$', r'$3\tfrac{1}{5}$', r'$2\tfrac{2}{5}$', r'$5\tfrac{2}{3}$'],
    [r'$17 : 5 = 3$ Rest 2',
     r'3 Ganze und 2 Fünftel bleiben übrig.',
     r'$\dfrac{17}{5} = 3\tfrac{2}{5}$'])

Q.q(r'Welche Zahl ist gleich $\dfrac{14}{4}$?',
    [r'$\dfrac{7}{2}$', r'$\dfrac{7}{4}$', r'$\dfrac{14}{2}$', r'$\dfrac{2}{7}$'],
    [r'Mit 2 kürzen: $\dfrac{14 : 2}{4 : 2} = \dfrac{7}{2}$',
     r'Als gemischte Zahl: $3\tfrac{1}{2}$.',
     r'$\dfrac{14}{2}$ wäre 7, also doppelt so viel.'])

# ------------------------------------------------------- everyday shares ----
Q.q(r'Von den 30 Personen der Klasse kommen 18 mit dem Fahrrad. Welcher vollständig gekürzte Bruch beschreibt diesen Anteil?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{2}{5}$', r'$\dfrac{3}{10}$', r'$\dfrac{5}{3}$'],
    [r'Anteil: $\dfrac{18}{30}$',
     r'Größter gemeinsamer Teiler von 18 und 30 ist 6.',
     r'$\dfrac{18 : 6}{30 : 6} = \dfrac{3}{5}$'])

Q.q(r'Wie viele Minuten sind $\dfrac{3}{4}$ Stunde?',
    [r'45', r'34', r'75', r'40'],
    [r'Eine Stunde hat 60 Minuten.',
     r'$\dfrac{1}{4}$ Stunde sind $60 : 4 = 15$ Minuten.',
     r'$\dfrac{3}{4}$ Stunde sind $3 \cdot 15 = 45$ Minuten.'])

Q.q(r'Kürze $\dfrac{20}{100}$ vollständig.',
    [r'$\dfrac{1}{5}$', r'$\dfrac{1}{4}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{20}$'],
    [r'20 passt fünfmal in 100.',
     r'Mit 20 kürzen: $\dfrac{20 : 20}{100 : 20} = \dfrac{1}{5}$',
     r'20 Cent sind also ein Fünftel von einem Euro.'])

Q.q(r'Tom isst $\dfrac{2}{8}$ einer Pizza, Mia isst $\dfrac{1}{4}$ einer gleich großen Pizza. Wer hat mehr gegessen?',
    [r'Beide gleich viel.', r'Tom', r'Mia', r'Das kann man nicht sagen.'],
    [r'Kürze Toms Anteil mit 2: $\dfrac{2}{8} = \dfrac{1}{4}$',
     r'Beide Anteile sind $\dfrac{1}{4}$.',
     r'Tom hat nur kleinere Stücke – aber genauso viel Pizza.'])

Q.q(r'Was passiert beim Erweitern eines Bruches?',
    [r'Die Einteilung wird feiner, der Wert bleibt gleich.', r'Der Wert des Bruches wird größer.',
     r'Nur der Zähler wird größer.', r'Nur der Nenner wird größer.'],
    [r'Beim Erweitern werden Zähler und Nenner mit derselben Zahl malgenommen.',
     r'Beispiel: $\dfrac{1}{2} = \dfrac{2}{4} = \dfrac{4}{8}$ – immer eine halbe Pizza.',
     r'Es gibt mehr, aber kleinere Teile.'])


def check():
    assert F(3, 5) == F(3, 5) and F(7, 4) == 1 + F(3, 4)
    assert F(5, 5) == 1 and F(5, 1) == 5 and F(0, 5) == 0
    assert F(2, 3) == F(4, 6) and F(3, 6) == F(1, 2)
    assert (2 * 4, 3 * 4) == (8, 12)
    assert (12 // 6, 18 // 6) == (2, 3) and (12 // 2, 18 // 2) == (6, 9)
    assert F(15, 20) == F(3, 4) and F(4, 5) != F(3, 4) and F(6, 12) == F(1, 2) and F(9, 16) != F(3, 4)
    assert gcd(24, 36) == 12 and F(24, 36) == F(2, 3) and gcd(4, 6) > 1 and gcd(6, 9) > 1
    assert gcd(16, 40) == 8 and F(16, 40) == F(2, 5)
    assert 20 // 5 == 4 and F(3, 5) == F(12, 20)
    assert 42 // 6 == 7 and F(5, 6) == F(35, 42)
    assert gcd(7, 9) == 1 and gcd(6, 9) == 3 and gcd(4, 10) == 2 and gcd(15, 25) == 5
    assert 2 + F(1, 3) == F(7, 3)
    assert divmod(17, 5) == (3, 2) and 3 + F(2, 5) == F(17, 5)
    assert F(14, 4) == F(7, 2) == 3 + F(1, 2) and F(14, 2) == 7
    assert gcd(18, 30) == 6 and F(18, 30) == F(3, 5)
    assert F(3, 4) * 60 == 45
    assert F(20, 100) == F(1, 5)
    assert F(2, 8) == F(1, 4)
    assert F(1, 2) == F(2, 4) == F(4, 8)


Q.verify(check)
Q.save()
