#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 36 / KW 22: mixed preparation for Klassenarbeit 4
(LB 4 Geometrische Körper, LB 5 Mathematik im Alltag). Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os6
from osfig import netz, wuerfelbau

Q = os6(nr=36, slug='ka4', thema='Klassenarbeit 4: Körper und Mathematik im Alltag', lb='KA 4',
        blurb='gemischte Aufgaben zu LB 4 und LB 5 zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: solids and nets (1-5), volume and surface (6-11, 20), problem solving (12-14, 18-19), random experiments (15-17).')

ZNETZ = [(0, 0), (0, 1), (1, 1), (2, 1), (3, 1), (3, 2)]
TURM = [(0, 0, 0), (0, 1, 0), (0, 2, 0), (0, 2, 1), (0, 2, 2), (1, 0, 0)]
fig_turm = wuerfelbau(TURM, label='Körper aus 6 Würfeln')
cap_turm = r'Körper aus Würfeln, vorne ist unten links'


def vol(l, b, h):
    return l * b * h


def surf(l, b, h):
    return 2 * (l * b + l * h + b * h)


Q.q(r'Wie viele Kanten hat ein Quader?',
    [r'12', r'8', r'6', r'4'],
    [r'4 Kanten oben, 4 unten, 4 senkrecht.',
     r'$4 + 4 + 4$',
     r'$= 12$'])

Q.q(r'Wie viele Ecken hat ein Dreiecksprisma?',
    [r'6', r'3', r'5', r'9'],
    [r'Die Grundfläche ist ein Dreieck: 3 Ecken.',
     r'Die Deckfläche auch: 3 Ecken.',
     r'Zusammen 6 Ecken.'])

Q.q(r'Lässt sich dieses Netz zu einem Würfel falten?',
    [r'Ja.', r'Nein, zwei Quadrate überlappen.', r'Nein, es fehlt ein Quadrat.', r'Nein, ein Würfelnetz ist immer ein Kreuz.'],
    [r'Die Reihe aus vier Quadraten wird zum Ring.',
     r'Das Quadrat links oben wird zum Deckel, das rechts unten zum Boden.',
     r'Also ja – es gibt 11 verschiedene Würfelnetze, nicht nur das Kreuz.'],
    fig=netz(ZNETZ), figcap=r'Netz aus 6 Quadraten')

Q.q(r'Aus wie vielen Würfeln besteht der Körper? (keine Hohlräume)',
    [r'6', r'5', r'7', r'4'],
    [r'Hinten liegt eine Reihe aus 3 Würfeln.',
     r'Auf dem rechten hinteren Würfel stehen 2 weitere, vorne links liegt 1.',
     r'$3 + 2 + 1 = 6$ Würfel.'],
    fig=fig_turm, figcap=cap_turm)

Q.q(r'Wie viele Quadrate sieht man in der Vorderansicht dieses Körpers?',
    [r'5', r'6', r'3', r'4'],
    [r'Von vorn sieht man drei Spalten.',
     r'Links 1 Würfel hoch (der vordere verdeckt den hinteren), Mitte 1, rechts 3.',
     r'$1 + 1 + 3 = 5$ Quadrate.'],
    fig=fig_turm, figcap=cap_turm)

Q.q(r'Ein Quader ist 6 cm lang, 4 cm breit und 3 cm hoch. Wie groß ist sein Volumen?',
    [r'72 cm³', r'13 cm³', r'108 cm³', r'54 cm³'],
    [r'$V = 6 \cdot 4 \cdot 3$',
     r'$= 24 \cdot 3$',
     r'$= 72$ cm³'])

Q.q(r'Wie groß ist die Oberfläche desselben Quaders (6 cm × 4 cm × 3 cm)?',
    [r'108 cm²', r'72 cm²', r'54 cm²', r'52 cm²'],
    [r'Flächen: $6 \cdot 4 = 24$, $6 \cdot 3 = 18$, $4 \cdot 3 = 12$',
     r'$O = 2 \cdot (24 + 18 + 12)$',
     r'$O = 108$ cm²'])

Q.q(r'Wie groß ist die Oberfläche eines Würfels mit 5 cm Kantenlänge?',
    [r'150 cm²', r'125 cm²', r'25 cm²', r'100 cm²'],
    [r'Eine Fläche: $5 \cdot 5 = 25$ cm²',
     r'6 Flächen: $6 \cdot 25$',
     r'$= 150$ cm² (125 cm³ wäre das Volumen).'])

Q.q(r'Ein Aquarium ist 60 cm lang, 30 cm breit und 40 cm hoch. Wie viele Liter fasst es?',
    [r'72 Liter', r'720 Liter', r'7,2 Liter', r'130 Liter'],
    [r'In Dezimetern: 6 dm, 3 dm, 4 dm.',
     r'$6 \cdot 3 \cdot 4 = 72$ dm³',
     r'72 dm³ = 72 Liter'])

Q.q(r'Ein Prisma hat ein Dreieck mit $g = 6$ cm und $h = 4$ cm als Grundfläche und ist 10 cm hoch. Wie groß ist sein Volumen?',
    [r'120 cm³', r'240 cm³', r'60 cm³', r'20 cm³'],
    [r'Grundfläche: $6 \cdot 4 : 2 = 12$ cm²',
     r'$V = G \cdot h = 12 \cdot 10$',
     r'$V = 120$ cm³'])

Q.q(r'Ein Körper besteht aus zwei Quadern: 8 cm × 4 cm × 2 cm und darauf 4 cm × 4 cm × 3 cm. Wie groß ist sein Volumen?',
    [r'112 cm³', r'64 cm³', r'48 cm³', r'176 cm³'],
    [r'Unterer Quader: $8 \cdot 4 \cdot 2 = 64$ cm³',
     r'Oberer Quader: $4 \cdot 4 \cdot 3 = 48$ cm³',
     r'Zusammen 112 cm³.'])

Q.q(r'Ein Liter Saft soll verpackt werden: als Würfel mit 10 cm Kante oder als Quader 25 cm × 10 cm × 4 cm. Welche Verpackung braucht weniger Material?',
    [r'der Würfel', r'der Quader', r'beide gleich viel', r'Das kann man nicht sagen.'],
    [r'Würfel: $6 \cdot 100 = 600$ cm²',
     r'Quader: $2 \cdot (250 + 100 + 40) = 780$ cm²',
     r'Der Würfel braucht weniger Material.'])

Q.q(r'Im Stall sind Hühner und Schafe, zusammen 20 Köpfe und 56 Beine. Wie viele Schafe sind es?',
    [r'8', r'12', r'14', r'6'],
    [r'Wären alle 20 Tiere Hühner: $20 \cdot 2 = 40$ Beine.',
     r'Es fehlen $56 - 40 = 16$ Beine; jedes Schaf hat 2 Beine mehr.',
     r'$16 : 2 = 8$ Schafe, 12 Hühner. Probe: $32 + 24 = 56$.'])

Q.q(r'Ich denke mir eine Zahl, multipliziere sie mit 3 und ziehe 5 ab. Ich erhalte 25. Welche Zahl habe ich gedacht?',
    [r'10', r'6,7', r'20', r'90'],
    [r'Rückwärts: $25 + 5 = 30$',
     r'$30 : 3 = 10$',
     r'Probe: $3 \cdot 10 - 5 = 25$.'])

Q.q(r'Aus Streichhölzern werden Dreiecke in einer Reihe gelegt: 1 Dreieck braucht 3 Hölzer, 2 Dreiecke 5, 3 Dreiecke 7. Wie viele Hölzer braucht man für 10 Dreiecke?',
    [r'21', r'30', r'20', r'23'],
    [r'Jedes neue Dreieck braucht 2 Hölzer.',
     r'Regel: $1 + 2 \cdot (\text{Anzahl Dreiecke})$',
     r'$1 + 2 \cdot 10 = 21$'])

Q.q(r'Bei 80 Würfen fiel 20-mal die Sechs. Wie groß ist die relative Häufigkeit?',
    [r'0,25', r'20', r'0,2', r'4'],
    [r'$\dfrac{20}{80}$',
     r'$= \dfrac{1}{4}$',
     r'$= 0{,}25$, also 25 %.'])

Q.q(r'Bei 40 Würfen einer Reißzwecke ist die relative Häufigkeit für „Kopf“ 0,3. Wie oft fiel sie auf den Kopf?',
    [r'12', r'30', r'3', r'13'],
    [r'Absolute Häufigkeit = relative Häufigkeit · Anzahl der Würfe.',
     r'$0{,}3 \cdot 40$',
     r'$= 12$-mal'])

Q.q(r'Ein Glücksrad hat 10 gleich große Felder: 5 rot, 3 gelb und 2 blau. Welche Farbe wird vermutlich am seltensten angezeigt?',
    [r'blau', r'rot', r'gelb', r'Alle gleich oft.'],
    [r'Blau hat die wenigsten Felder.',
     r'Je weniger Felder, desto seltener bleibt der Zeiger dort stehen.',
     r'Vermutlich blau – bei wenigen Drehungen kann es aber anders ausfallen.'])

Q.q(r'Welche Zahl ist ein Gegenbeispiel zu: „Jede Zahl, die auf 5 endet, ist durch 10 teilbar“?',
    [r'15', r'10', r'20', r'100'],
    [r'Gesucht: Sie endet auf 5, ist aber nicht durch 10 teilbar.',
     r'$15 : 10 = 1{,}5$ – nicht ohne Rest.',
     r'15 widerlegt die Aussage.'])

Q.q(r'Je mehr Personen sich eine Pizza teilen, desto kleiner wird jedes Stück. Welche Art von Zuordnung ist „Anzahl Personen → Stückgröße“?',
    [r'indirekt proportional', r'direkt proportional', r'nicht proportional', r'gar keine'],
    [r'Doppelt so viele Personen: Jedes Stück ist halb so groß.',
     r'Das Produkt Anzahl · Stückgröße bleibt eine ganze Pizza.',
     r'Also indirekt proportional.'])


OPP = {'B': 'T', 'T': 'B', 'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E'}


def fold(cells):
    roll = {(1, 0): lambda o: {**o, 'B': o['E'], 'E': o['T'], 'T': o['W'], 'W': o['B']},
            (-1, 0): lambda o: {**o, 'B': o['W'], 'W': o['T'], 'T': o['E'], 'E': o['B']},
            (0, 1): lambda o: {**o, 'B': o['S'], 'S': o['T'], 'T': o['N'], 'N': o['B']},
            (0, -1): lambda o: {**o, 'B': o['N'], 'N': o['T'], 'T': o['S'], 'S': o['B']}}
    seen, todo = {cells[0]: {k: k for k in 'BTNSEW'}}, [cells[0]]
    while todo:
        c = todo.pop()
        for (dx, dy), f in roll.items():
            n = (c[0] + dx, c[1] + dy)
            if n in cells and n not in seen:
                seen[n] = f(seen[c])
                todo.append(n)
    return len({o['B'] for o in seen.values()}) == 6 and len(seen) == 6


def check():
    assert fold(ZNETZ)
    assert len(TURM) == 6 and len({(y, z) for x, y, z in TURM}) == 5
    assert vol(6, 4, 3) == 72 and surf(6, 4, 3) == 108 and surf(5, 5, 5) == 150
    assert vol(6, 3, 4) == 72
    assert F(6 * 4, 2) * 10 == 120
    assert vol(8, 4, 2) + vol(4, 4, 3) == 112
    assert surf(10, 10, 10) == 600 and surf(25, 10, 4) == 780 and vol(25, 10, 4) == 1000
    assert [(h, s) for h in range(21) for s in range(21) if h + s == 20 and 2 * h + 4 * s == 56] == [(12, 8)]
    assert (25 + 5) / 3 == 10
    assert [1 + 2 * n for n in (1, 2, 3, 10)] == [3, 5, 7, 21]
    assert F(20, 80) == F('0.25') and F('0.3') * 40 == 12
    assert 15 % 10 != 0


Q.verify(check)
Q.save()
