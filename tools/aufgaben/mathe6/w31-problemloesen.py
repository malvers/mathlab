#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 31 / KW 17 (LB 5): problem-solving strategies - systematic
trying, working backwards, finding patterns, reducing to something known; classic puzzles
with their sources (Sunzi Suanjing, Alcuin of York, Gauss). Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from itertools import combinations
from math import comb
from quiz import os6

Q = os6(nr=31, slug='problemloesen', thema='Problemlösestrategien', lb='LB 5',
        blurb='systematisches Probieren, Rückwärtsarbeiten, Muster finden, Zurückführen auf Bekanntes',
        comment='Blocks: classic puzzles with sources (1-5), systematic trying (6-10, 18, 20), patterns (11-15), reducing to the known (16-17, 19).')

# --------------------------------------------------- classic puzzles, sources ----
Q.q(r'Aus einem chinesischen Rechenbuch, dem „Sunzi Suanjing“ (etwa 4. Jahrhundert): In einem Käfig sind Fasane und Kaninchen, zusammen 35 Köpfe und 94 Beine. Wie viele Kaninchen sind es?',
    [r'12', r'23', r'17', r'24'],
    [r'Probieren mit Überlegung: Wären alle 35 Tiere Fasane, gäbe es $35 \cdot 2 = 70$ Beine.',
     r'Es sind aber $94 - 70 = 24$ Beine mehr. Jedes Kaninchen bringt 2 Beine mehr als ein Fasan.',
     r'$24 : 2 = 12$ Kaninchen und 23 Fasane. Probe: $12 \cdot 4 + 23 \cdot 2 = 48 + 46 = 94$.'])

Q.q(r'Ein Rätsel von Alkuin von York (um 800): Ein Bauer will Wolf, Ziege und Kohlkopf über einen Fluss bringen. Im Boot hat nur eines davon Platz. Allein darf er Wolf und Ziege nicht lassen, auch nicht Ziege und Kohl. Was bringt er zuerst hinüber?',
    [r'die Ziege', r'den Wolf', r'den Kohl', r'nichts, er fährt erst leer'],
    [r'Nimmt er den Wolf, frisst die Ziege den Kohl.',
     r'Nimmt er den Kohl, frisst der Wolf die Ziege.',
     r'Nur mit der Ziege im Boot bleiben Wolf und Kohl sicher zurück.'])

Q.q(r'Alkuins Rätsel weiter: Wie viele Fahrten über den Fluss braucht der Bauer mindestens (hin und zurück einzeln gezählt)?',
    [r'7', r'3', r'5', r'9'],
    [r'Ziege hin, leer zurück, Wolf hin, Ziege zurück,',
     r'Kohl hin, leer zurück, Ziege hin.',
     r'Das sind 7 Fahrten – der Trick ist, die Ziege einmal zurückzubringen.'])

Q.q(r'Der junge Carl Friedrich Gauß soll in der Schule die Zahlen von 1 bis 100 blitzschnell addiert haben (so berichtet von seinem Biografen Sartorius von Waltershausen, 1856). Wie groß ist die Summe?',
    [r'5050', r'5000', r'10 100', r'4950'],
    [r'Paare bilden: $1 + 100 = 101$, $2 + 99 = 101$, …, $50 + 51 = 101$.',
     r'Das sind 50 Paare.',
     r'$50 \cdot 101 = 5050$'])

Q.q(r'Gauß’ Trick für 1 + 2 + … + 100: Wie viele Paare mit der Summe 101 bildet man?',
    [r'50', r'100', r'101', r'49'],
    [r'Jedes Paar besteht aus einer kleinen und einer großen Zahl.',
     r'Die kleinen Zahlen sind 1 bis 50.',
     r'Also 50 Paare.'])

# ----------------------------------------------------------- systematic trying ----
Q.q(r'Zwei natürliche Zahlen haben die Summe 20 und das Produkt 96. Welche sind es?',
    [r'8 und 12', r'6 und 14', r'4 und 16', r'10 und 10'],
    [r'Systematisch probieren mit einer Tabelle: $10 \cdot 10 = 100$, $9 \cdot 11 = 99$, $8 \cdot 12 = 96$.',
     r'Probe: $8 + 12 = 20$ ✓',
     r'$6 \cdot 14 = 84$ und $4 \cdot 16 = 64$ sind zu klein.'])

Q.q(r'6 Personen begrüßen sich, jede gibt jeder anderen genau einmal die Hand. Wie oft werden Hände geschüttelt?',
    [r'15', r'36', r'30', r'12'],
    [r'Die erste Person gibt 5 anderen die Hand, die zweite noch 4 neuen, dann 3, 2, 1.',
     r'$5 + 4 + 3 + 2 + 1 = 15$',
     r'$6 \cdot 5 = 30$ zählt jeden Handschlag doppelt.'])

Q.q(r'Ich denke mir eine Zahl, verdopple sie und addiere 7. Ich erhalte 31. Welche Zahl habe ich mir gedacht?',
    [r'12', r'19', r'24', r'15'],
    [r'Rückwärts arbeiten: Aus „plus 7“ wird „minus 7“: $31 - 7 = 24$.',
     r'Aus „verdoppeln“ wird „halbieren“: $24 : 2 = 12$.',
     r'Probe: $2 \cdot 12 + 7 = 31$.'])

Q.q(r'Auf wie viele Arten kann man genau 5 € nur mit 1-€- und 2-€-Münzen bezahlen (die Reihenfolge zählt nicht)?',
    [r'3', r'2', r'5', r'4'],
    [r'Systematisch nach der Zahl der 2-€-Münzen ordnen: keine, eine oder zwei.',
     r'0 · 2 € + 5 · 1 €, 1 · 2 € + 3 · 1 €, 2 · 2 € + 1 · 1 €',
     r'Drei 2-€-Münzen wären schon 6 €. Also 3 Möglichkeiten.'])

Q.q(r'Wie viele zweistellige Zahlen haben die Quersumme 5?',
    [r'5', r'4', r'6', r'10'],
    [r'Systematisch nach der Zehnerziffer: 14, 23, 32, 41, 50.',
     r'Die Zehnerziffer kann nicht 0 sein.',
     r'Also 5 Zahlen.'])

Q.q(r'Welche Strategie ist das: Man schreibt alle Möglichkeiten geordnet in eine Tabelle und prüft sie nacheinander.',
    [r'systematisches Probieren', r'Rückwärtsarbeiten', r'Raten', r'Zurückführen auf Bekanntes'],
    [r'Beim Raten probiert man ungeordnet.',
     r'Systematisch heißt: nach einer Ordnung, ohne etwas zu vergessen.',
     r'Das ist systematisches Probieren.'])

# --------------------------------------------------------------------- patterns ----
Q.q(r'An einen quadratischen Tisch passen 4 Personen. Schiebt man Tische in einer Reihe zusammen, passen an 2 Tische 6 und an 3 Tische 8 Personen. Wie viele passen an 10 Tische?',
    [r'22', r'40', r'20', r'24'],
    [r'Jeder neue Tisch bringt 2 Plätze dazu.',
     r'Regel: $2 \cdot (\text{Anzahl Tische}) + 2$',
     r'$2 \cdot 10 + 2 = 22$ Plätze'])

Q.q(r'Aus Streichhölzern werden Quadrate in einer Reihe gelegt: 1 Quadrat braucht 4 Hölzer, 2 Quadrate 7, 3 Quadrate 10. Wie viele Hölzer braucht man für 10 Quadrate?',
    [r'31', r'40', r'30', r'34'],
    [r'Jedes weitere Quadrat braucht nur 3 Hölzer, weil es eine Seite teilt.',
     r'Regel: $1 + 3 \cdot (\text{Anzahl Quadrate})$',
     r'$1 + 3 \cdot 10 = 31$'])

Q.q(r'Seerosen auf einem Teich verdoppeln ihre Fläche jeden Tag. Nach 30 Tagen ist der Teich ganz bedeckt. Nach wie vielen Tagen war er halb bedeckt?',
    [r'nach 29 Tagen', r'nach 15 Tagen', r'nach 20 Tagen', r'nach 25 Tagen'],
    [r'Rückwärts denken: Am 30. Tag ist der Teich voll.',
     r'Am Tag davor war es genau halb so viel.',
     r'Also nach 29 Tagen.'])

Q.q(r'Eine Schnecke sitzt am Grund eines 10 m tiefen Brunnens. Tagsüber kriecht sie 3 m hoch, nachts rutscht sie 2 m zurück. An welchem Tag kommt sie oben an?',
    [r'am 8. Tag', r'am 10. Tag', r'am 5. Tag', r'am 7. Tag'],
    [r'Nach jedem Tag und jeder Nacht ist sie 1 m höher: nach 7 Nächten bei 7 m.',
     r'Am 8. Tag kriecht sie von 7 m aus 3 m hoch.',
     r'Sie erreicht 10 m und ist oben – nachts rutscht sie dann nicht mehr zurück.'])

Q.q(r'Ein Ziegelstein wiegt 1 kg und einen halben Ziegelstein. Wie schwer ist ein Ziegelstein?',
    [r'2 kg', r'1,5 kg', r'1 kg', r'3 kg'],
    [r'Ein halber Ziegelstein ist das, was zu 1 kg noch fehlt.',
     r'Ganzer Stein = 1 kg + halber Stein, also ist der halbe Stein 1 kg.',
     r'Der ganze Stein wiegt 2 kg.'])

# ----------------------------------------------------- reducing to the known ----
Q.q(r'Ein Prisma hat ein 20-Eck als Grundfläche. Wie viele Ecken hat es?',
    [r'40', r'20', r'22', r'60'],
    [r'Zurückführen auf Bekanntes: Ein Dreiecksprisma hat $2 \cdot 3 = 6$ Ecken, ein Quader $2 \cdot 4 = 8$.',
     r'Unten und oben liegt je ein 20-Eck.',
     r'$2 \cdot 20 = 40$ Ecken'])

Q.q(r'Eine Mutter ist heute dreimal so alt wie ihre Tochter. In 10 Jahren ist sie doppelt so alt. Wie alt ist die Tochter heute?',
    [r'10 Jahre', r'5 Jahre', r'15 Jahre', r'20 Jahre'],
    [r'Probieren: Tochter 5, Mutter 15 – in 10 Jahren 15 und 25, nicht doppelt.',
     r'Tochter 10, Mutter 30 – in 10 Jahren 20 und 40. Passt!',
     r'Die Tochter ist heute 10 Jahre alt.'])

Q.q(r'Wie viele Diagonalen hat ein Sechseck?',
    [r'9', r'6', r'12', r'18'],
    [r'Von jeder Ecke gehen Diagonalen zu allen Ecken außer sich selbst und den zwei Nachbarn: 3.',
     r'$6 \cdot 3 = 18$, aber so ist jede Diagonale doppelt gezählt.',
     r'$18 : 2 = 9$ – wie beim Händeschütteln.'])

Q.q(r'In einem Gitter aus 2 × 2 Kästchen geht man von der linken unteren zur rechten oberen Ecke, immer nur nach rechts oder nach oben auf den Linien. Wie viele Wege gibt es?',
    [r'6', r'4', r'8', r'2'],
    [r'Jeder Weg besteht aus 2 Schritten nach rechts (R) und 2 nach oben (O).',
     r'Systematisch: RROO, RORO, ROOR, ORRO, OROR, OORR.',
     r'Das sind 6 Wege.'])


def check():
    sol = [(f, k) for f in range(36) for k in range(36) if f + k == 35 and 2 * f + 4 * k == 94]
    assert sol == [(23, 12)]
    # wolf-goat-cabbage: breadth-first search over the states, minimal number of crossings
    items = frozenset('WZK')
    bad = lambda side: {'W', 'Z'} <= side or {'Z', 'K'} <= side
    start, goal = (items, 0), (frozenset(), 1)
    dist, todo = {start: 0}, [start]
    while todo:
        left, boat = todo.pop(0)
        here = left if boat == 0 else items - left
        for cargo in [None] + sorted(here):
            moved = {cargo} if cargo else set()
            nl = left - moved if boat == 0 else left | moved
            alone = nl if boat == 0 else items - nl
            if bad(alone):
                continue
            st = (frozenset(nl), 1 - boat)
            if st not in dist:
                dist[st] = dist[(left, boat)] + 1
                todo.append(st)
    assert dist[goal] == 7
    assert sum(range(1, 101)) == 5050 == 50 * 101
    assert [(a, 20 - a) for a in range(1, 11) if a * (20 - a) == 96] == [(8, 12)]
    assert comb(6, 2) == 15 == 5 + 4 + 3 + 2 + 1
    assert (31 - 7) / 2 == 12
    assert len([(z, e) for z in range(0, 6) for e in range(0, 6) if 2 * z + e == 5]) == 3
    assert [n for n in range(10, 100) if n // 10 + n % 10 == 5] == [14, 23, 32, 41, 50]
    assert [2 * t + 2 for t in (1, 2, 3, 10)] == [4, 6, 8, 22]
    assert [1 + 3 * q for q in (1, 2, 3, 10)] == [4, 7, 10, 31]
    assert 2 ** 30 // 2 == 2 ** 29
    h, day = 0, 0
    while True:
        day += 1
        h += 3
        if h >= 10:
            break
        h -= 2
    assert day == 8
    assert [w for w in range(1, 10) if w == 1 + w / 2] == [2]
    assert 2 * 20 == 40
    assert [t for t in range(1, 40) if 3 * t + 10 == 2 * (t + 10)] == [10]
    assert 6 * (6 - 3) // 2 == 9 == comb(6, 2) - 6
    assert comb(4, 2) == 6


Q.verify(check)
Q.save()
