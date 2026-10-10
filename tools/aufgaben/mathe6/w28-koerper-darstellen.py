#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 28 / KW 14 (LB 4): representing solids - nets, plan and
side views of cube buildings, oblique drawing, views of cylinder, cone and pyramid.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os6
from osfig import netz, wuerfelbau

Q = os6(nr=28, slug='koerper-darstellen', thema='Körper darstellen', lb='LB 4',
        blurb='Körpernetze, Grundriss und Seitenansichten, Schrägbild',
        comment='Blocks: cube nets (1-4, 18, 20), views of a cube building (5-7), oblique drawing (8-9, 17), nets and views of other solids (10-16, 19).')

KREUZ = [(1, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2)]
REIHE = [(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (5, 0)]
BLOCK = [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1)]
TREPPE = [(0, 0), (1, 0), (1, 1), (2, 1), (2, 2), (3, 2)]
BAU = [(0, 0, 0), (0, 1, 0), (0, 2, 0), (1, 0, 0), (1, 1, 0), (1, 2, 0), (0, 0, 1), (0, 1, 1)]
fig_bau = wuerfelbau(BAU)
cap_bau = r'Körper aus 8 Würfeln, vorne ist unten links'

# ----------------------------------------------------------------- cube nets ----
Q.q(r'Lässt sich dieses Netz zu einem Würfel falten?',
    [r'Ja.', r'Nein, ein Quadrat fehlt.', r'Nein, zwei Quadrate überlappen beim Falten.', r'Nein, ein Würfelnetz braucht 8 Quadrate.'],
    [r'Die mittlere Reihe aus 4 Quadraten wird zu einem Ring um den Würfel gefaltet.',
     r'Das obere und das untere Quadrat werden Deckel und Boden.',
     r'Also ja – das ist das bekannte Kreuz-Netz.'],
    fig=netz(KREUZ), figcap=r'Netz aus 6 Quadraten')

Q.q(r'Lässt sich dieses Netz zu einem Würfel falten?',
    [r'Nein, beim Falten überlappen sich Quadrate und zwei Flächen bleiben offen.', r'Ja.',
     r'Ja, wenn man es zweimal faltet.', r'Nein, weil ein Würfel 8 Flächen hat.'],
    [r'Vier Quadrate in einer Reihe bilden schon einen Ring.',
     r'Das fünfte und sechste Quadrat würden wieder auf dem Ring landen.',
     r'Deckel und Boden fehlen: kein Würfelnetz.'],
    fig=netz(REIHE, unit=40), figcap=r'Sechs Quadrate in einer Reihe')

Q.q(r'Lässt sich dieses Netz zu einem Würfel falten?',
    [r'Nein, es ist ein Rechteck aus 2 × 3 Quadraten.', r'Ja.', r'Ja, aber nur zu einem Quader.', r'Nein, weil es nur 5 Quadrate sind.'],
    [r'Ein Würfelnetz darf keine Fläche aus 2 × 2 Quadraten enthalten.',
     r'Hier liegen sogar zweimal 2 × 2 Quadrate zusammen.',
     r'Beim Falten würden Quadrate aufeinanderliegen: kein Würfelnetz.'],
    fig=netz(BLOCK), figcap=r'Netz aus 6 Quadraten')

Q.q(r'Das Netz wird zu einem Würfel gefaltet. Welche Fläche liegt dann gegenüber von A?',
    [r'B', r'C', r'D', r'E'],
    [r'In der Reihe aus vier Quadraten liegt jedes zweite gegenüber.',
     r'Von A aus: D ist Nachbar, B ist das übernächste Quadrat.',
     r'Also liegt B gegenüber von A (und C gegenüber von E).'],
    fig=netz(KREUZ, marks={(1, 1): 'A', (3, 1): 'B', (1, 0): 'C', (2, 1): 'D', (1, 2): 'E', (0, 1): 'F'}),
    figcap=r'Würfelnetz mit Buchstaben')

Q.q(r'Lässt sich auch dieses treppenförmige Netz zu einem Würfel falten?',
    [r'Ja.', r'Nein, es ist zu schief.', r'Nein, zwei Flächen überlappen.', r'Nur, wenn man ein Quadrat abschneidet.'],
    [r'Probe durch Abrollen: Man rollt den Würfel Feld für Feld über das Netz.',
     r'Dabei liegt auf jedem Feld eine andere Würfelfläche unten.',
     r'Alle sechs Flächen werden genau einmal getroffen: ein Würfelnetz.'],
    fig=netz(TREPPE), figcap=r'Treppen-Netz')

Q.q(r'Wie viele verschiedene Würfelnetze gibt es (gedrehte und gespiegelte Netze nicht doppelt gezählt)?',
    [r'11', r'6', r'4', r'24'],
    [r'Man findet sie durch systematisches Probieren.',
     r'Sechs Netze haben eine Reihe aus vier Quadraten, die anderen nicht.',
     r'Insgesamt gibt es genau 11 Würfelnetze.'])

# ------------------------------------------------------ views of a building ----
Q.q(r'Wie viele Quadrate sieht man in der Draufsicht (Grundriss, von oben)?',
    [r'6', r'8', r'2', r'4'],
    [r'Von oben sieht man jede Stelle, an der mindestens ein Würfel steht.',
     r'Die Grundfläche sind 2 Reihen zu je 3 Würfeln.',
     r'Der Grundriss besteht aus 6 Quadraten.'],
    fig=fig_bau, figcap=cap_bau)

Q.q(r'Wie viele Quadrate sieht man in der Vorderansicht (von vorn)?',
    [r'5', r'6', r'8', r'3'],
    [r'Von vorn sieht man drei Spalten nebeneinander.',
     r'Links und in der Mitte sind sie 2 Würfel hoch, rechts 1 Würfel.',
     r'$2 + 2 + 1 = 5$ Quadrate.'],
    fig=fig_bau, figcap=cap_bau)

Q.q(r'Wie viele Quadrate sieht man in der Seitenansicht von rechts?',
    [r'3', r'4', r'2', r'5'],
    [r'Von rechts sieht man zwei Spalten: vorne und hinten.',
     r'Hinten ist der Körper 2 Würfel hoch, vorne 1 Würfel.',
     r'$2 + 1 = 3$ Quadrate.'],
    fig=fig_bau, figcap=cap_bau)

# ------------------------------------------------------------ oblique drawing ----
Q.q(r'Wie zeichnet man im Schrägbild die Kanten, die nach hinten laufen?',
    [r'schräg unter 45° und auf die Hälfte verkürzt', r'waagerecht und in wahrer Länge',
     r'senkrecht und doppelt so lang', r'gar nicht'],
    [r'Die Vorderfläche zeichnet man in wahrer Größe.',
     r'Die Kanten nach hinten laufen schräg, meist unter 45°.',
     r'Damit der Körper nicht zu tief aussieht, werden sie auf die Hälfte verkürzt.'])

Q.q(r'Wie zeichnet man im Schrägbild die Kanten, die man in Wirklichkeit nicht sehen kann?',
    [r'gestrichelt', r'gar nicht', r'besonders dick', r'in Rot'],
    [r'Verdeckte Kanten liegen hinter dem Körper.',
     r'Man zeichnet sie trotzdem, damit man den Körper gut erkennt.',
     r'Sie werden gestrichelt gezeichnet.'])

Q.q(r'Ein Quader ist 4 cm lang, 3 cm tief und 2 cm hoch. Wie lang zeichnet man im Schrägbild die Kante für die Tiefe?',
    [r'1,5 cm', r'3 cm', r'6 cm', r'2 cm'],
    [r'Die Tiefe läuft nach hinten.',
     r'Diese Kanten werden auf die Hälfte verkürzt.',
     r'$3 : 2 = 1{,}5$ cm'])

# -------------------------------------------- nets and views of other solids ----
Q.q(r'Aus welchen Flächen besteht das Netz eines Quaders?',
    [r'aus 6 Rechtecken', r'aus 4 Rechtecken und 2 Dreiecken', r'aus 6 Dreiecken', r'aus 8 Quadraten'],
    [r'Ein Quader hat 6 Flächen.',
     r'Jede Fläche ist ein Rechteck (manchmal sogar ein Quadrat).',
     r'Gegenüberliegende Rechtecke sind gleich groß.'])

Q.q(r'Ein Quadernetz für einen Quader mit 5 cm × 3 cm × 2 cm: Wie viele Rechtecke mit 5 cm × 3 cm enthält es?',
    [r'2', r'1', r'3', r'4'],
    [r'Die Flächen kommen paarweise vor: oben und unten, vorn und hinten, links und rechts.',
     r'5 cm × 3 cm ist zum Beispiel Boden und Deckel.',
     r'Also 2 Rechtecke dieser Größe.'])

Q.q(r'Aus welchen Flächen besteht das Netz eines Dreiecksprismas?',
    [r'aus 2 Dreiecken und 3 Rechtecken', r'aus 3 Dreiecken und 2 Rechtecken', r'aus 4 Dreiecken', r'aus 1 Dreieck und 3 Rechtecken'],
    [r'Grund- und Deckfläche sind gleiche Dreiecke.',
     r'Jede Dreiecksseite trägt eine rechteckige Seitenfläche.',
     r'Also 2 Dreiecke und 3 Rechtecke.'])

Q.q(r'Aus welchen Flächen besteht das Netz einer Pyramide mit quadratischer Grundfläche?',
    [r'aus 1 Quadrat und 4 Dreiecken', r'aus 2 Quadraten und 4 Rechtecken', r'aus 4 Quadraten und 1 Dreieck', r'aus 5 Dreiecken'],
    [r'Die Grundfläche ist ein Quadrat.',
     r'An jeder Seite des Quadrats hängt ein Dreieck.',
     r'Zusammen 1 Quadrat und 4 Dreiecke.'])

Q.q(r'Ein Netz besteht aus zwei Kreisen und einem Rechteck. Welcher Körper entsteht?',
    [r'Zylinder', r'Kegel', r'Prisma', r'Kugel'],
    [r'Die Kreise sind Boden und Deckel.',
     r'Das Rechteck wird zum gekrümmten Mantel gerollt.',
     r'Es entsteht ein Zylinder.'])

Q.q(r'Wie sieht ein aufrecht stehender Zylinder von vorn aus?',
    [r'wie ein Rechteck', r'wie ein Kreis', r'wie ein Dreieck', r'wie ein Quadrat mit Spitze'],
    [r'Von oben sieht man einen Kreis.',
     r'Von vorn sieht man die Höhe und den Durchmesser.',
     r'Die Vorderansicht ist ein Rechteck.'])

Q.q(r'Welcher Körper sieht von vorn wie ein Dreieck und von oben wie ein Kreis aus?',
    [r'Kegel', r'Zylinder', r'Pyramide', r'Kugel'],
    [r'Von oben ein Kreis: Zylinder, Kegel oder Kugel.',
     r'Von vorn ein Dreieck: Er läuft spitz zu.',
     r'Das ist ein Kegel.'])

Q.q(r'Welcher Körper sieht von vorn wie ein Dreieck und von oben wie ein Quadrat (mit Diagonalen) aus?',
    [r'quadratische Pyramide', r'Kegel', r'Würfel', r'Dreiecksprisma'],
    [r'Von oben ein Quadrat, dessen Ecken zur Mitte verbunden sind: Dort sitzt die Spitze.',
     r'Von vorn ein Dreieck.',
     r'Das ist eine Pyramide mit quadratischer Grundfläche.'])


def fold(cells):
    """Roll a cube over the net; return the face on the bottom for every cell (or None)."""
    roll = {(1, 0): lambda o: {**o, 'B': o['E'], 'E': o['T'], 'T': o['W'], 'W': o['B']},
            (-1, 0): lambda o: {**o, 'B': o['W'], 'W': o['T'], 'T': o['E'], 'E': o['B']},
            (0, 1): lambda o: {**o, 'B': o['S'], 'S': o['T'], 'T': o['N'], 'N': o['B']},
            (0, -1): lambda o: {**o, 'B': o['N'], 'N': o['T'], 'T': o['S'], 'S': o['B']}}
    start = cells[0]
    seen = {start: {k: k for k in 'BTNSEW'}}
    todo = [start]
    while todo:
        c = todo.pop()
        for (dx, dy), f in roll.items():
            n = (c[0] + dx, c[1] + dy)
            if n in cells and n not in seen:
                seen[n] = f(seen[c])
                todo.append(n)
    faces = {c: o['B'] for c, o in seen.items()}
    return faces if len(set(faces.values())) == 6 and len(faces) == 6 else None


OPP = {'B': 'T', 'T': 'B', 'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E'}


def check():
    kreuz = fold(KREUZ)
    assert kreuz is not None and fold(REIHE) is None and fold(BLOCK) is None and fold(TREPPE) is not None
    letters = {(1, 1): 'A', (3, 1): 'B', (1, 0): 'C', (2, 1): 'D', (1, 2): 'E', (0, 1): 'F'}
    face = {letters[c]: f for c, f in kreuz.items()}
    assert OPP[face['A']] == face['B'] and OPP[face['C']] == face['E'] and OPP[face['D']] == face['F']
    top = {(x, y) for x, y, z in BAU}
    front = {(y, z) for x, y, z in BAU}
    right = {(x, z) for x, y, z in BAU}
    assert len(top) == 6 and len(front) == 5 and len(right) == 3
    assert 3 / 2 == 1.5


Q.verify(check)
Q.save()
