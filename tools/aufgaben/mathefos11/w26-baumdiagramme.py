#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 26 / KW 11 (LB 2): Baumdiagramme und Pfadregeln,
mit und ohne Zuruecklegen. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=26, slug='baumdiagramme', thema='Baumdiagramme und Pfadregeln', lb='LB 2',
          blurb='Pfadmultiplikation, Pfadaddition, Ziehen mit und ohne Zurücklegen',
          comment='Blocks: Aufbau des Baumdiagramms (1-5), erste Pfadregel (6-11), zweite Pfadregel (12-16), mit und ohne Zuruecklegen (17-20). Urne durchgehend: 2 rote und 3 blaue Kugeln.')

# --------------------------------------------------- Aufbau des Baumdiagramms ----
Q.q(r'Was stellt ein Pfad in einem Baumdiagramm dar?',
    [r'genau ein Ergebnis des mehrstufigen Zufallsversuchs',
     r'ein Ereignis mit mehreren Ergebnissen',
     r'die Wahrscheinlichkeit einer Stufe',
     r'die Anzahl der Stufen'],
    [r'Ein Pfad führt von der Wurzel über je einen Ast pro Stufe bis zu einem Blatt.',
     r'Er beschreibt damit den vollständigen Ausgang des Versuchs, etwa „erst rot, dann blau“.',
     r'Die Zahl der Blätter ist die Zahl der Ergebnisse.'])

Q.q(r'Was gilt für die Wahrscheinlichkeiten an den Ästen, die von einem Knoten ausgehen?',
    [r'Ihre Summe ist $1$.', r'Ihre Summe ist $0$.',
     r'Ihr Produkt ist $1$.', r'Sie sind immer gleich groß.'],
    [r'An jedem Knoten tritt genau einer der möglichen Fälle ein.',
     r'Die Äste decken also alle Möglichkeiten dieser Stufe ab.',
     r'Deshalb addieren sich ihre Wahrscheinlichkeiten zu $1$ — eine gute Kontrolle beim Zeichnen.'])

Q.q(r'Ein Versuch hat drei Stufen mit je zwei Möglichkeiten. Wie viele Pfade hat das Baumdiagramm?',
    [r'$8$', r'$6$', r'$3$', r'$2$'],
    [r'Zählprinzip: $2 \cdot 2 \cdot 2$.',
     r'$= 8$ Pfade',
     r'$6$ wäre die Summe $2 + 2 + 2$ — bei Baumdiagrammen wird multipliziert.'])

Q.q(r'Eine Urne enthält $2$ rote und $3$ blaue Kugeln. Welche Wahrscheinlichkeiten stehen an den Ästen der ersten Stufe?',
    [r'$\dfrac{2}{5}$ für rot und $\dfrac{3}{5}$ für blau',
     r'$\dfrac{1}{2}$ für rot und $\dfrac{1}{2}$ für blau',
     r'$\dfrac{2}{3}$ für rot und $\dfrac{3}{2}$ für blau',
     r'$2$ für rot und $3$ für blau'],
    [r'Insgesamt sind $5$ Kugeln in der Urne.',
     r'$P(\text{rot}) = \dfrac{2}{5}$ und $P(\text{blau}) = \dfrac{3}{5}$.',
     r'Kontrolle: $\dfrac{2}{5} + \dfrac{3}{5} = 1$.'])

Q.q(r'Was bedeutet ein Blatt im Baumdiagramm?',
    [r'das Ende eines Pfades und damit ein Ergebnis des Gesamtversuchs',
     r'die Wahrscheinlichkeit der letzten Stufe',
     r'den Startpunkt des Versuchs',
     r'ein Ereignis'],
    [r'Die Wurzel steht für den Start, die Blätter für die Abschlüsse.',
     r'Jedes Blatt entspricht genau einem Ergebnis.',
     r'Seine Wahrscheinlichkeit erhält man durch Multiplikation entlang des Pfades.'])

# ------------------------------------------------------------ erste Pfadregel ----
Q.q(r'Wie lautet die erste Pfadregel?',
    [r'Die Wahrscheinlichkeiten längs eines Pfades werden multipliziert.',
     r'Die Wahrscheinlichkeiten längs eines Pfades werden addiert.',
     r'Die Wahrscheinlichkeiten mehrerer Pfade werden multipliziert.',
     r'Die Wahrscheinlichkeiten werden subtrahiert.'],
    [r'Entlang eines Pfades müssen alle Stufen nacheinander eintreten.',
     r'Für ein Nacheinander gilt die Multiplikationsregel.',
     r'Addiert wird erst, wenn mehrere Pfade zu einem Ereignis gehören.'])

Q.q(r'Aus der Urne mit $2$ roten und $3$ blauen Kugeln wird zweimal MIT Zurücklegen gezogen. Wie groß ist $P(\text{rot};\,\text{rot})$?',
    [r'$\dfrac{4}{25}$', r'$\dfrac{2}{25}$', r'$\dfrac{4}{5}$', r'$\dfrac{1}{10}$'],
    [r'Durch das Zurücklegen bleibt $P(\text{rot}) = \dfrac{2}{5}$ in beiden Zügen.',
     r'$P = \dfrac{2}{5} \cdot \dfrac{2}{5} = \dfrac{4}{25}$',
     r'$\dfrac{1}{10}$ wäre die Antwort ohne Zurücklegen.'])

Q.q(r'Dieselbe Urne, zweimal OHNE Zurücklegen. Wie groß ist $P(\text{rot};\,\text{rot})$?',
    [r'$\dfrac{1}{10}$', r'$\dfrac{4}{25}$', r'$\dfrac{2}{25}$', r'$\dfrac{1}{5}$'],
    [r'Erster Zug: $\dfrac{2}{5}$. Danach sind noch $1$ rote und $3$ blaue Kugeln da.',
     r'Zweiter Zug: $\dfrac{1}{4}$.',
     r'$P = \dfrac{2}{5} \cdot \dfrac{1}{4} = \dfrac{2}{20} = \dfrac{1}{10}$'])

Q.q(r'Zweimal mit Zurücklegen: wie groß ist $P(\text{rot};\,\text{blau})$, also erst rot, dann blau?',
    [r'$\dfrac{6}{25}$', r'$\dfrac{12}{25}$', r'$\dfrac{5}{25}$', r'$\dfrac{6}{20}$'],
    [r'$P = \dfrac{2}{5} \cdot \dfrac{3}{5}$',
     r'$= \dfrac{6}{25}$',
     r'Das gilt für genau diese Reihenfolge; „blau, dann rot“ ist ein eigener Pfad mit demselben Wert.'])

Q.q(r'Eine Münze wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für „erst Kopf, dann Zahl“?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{3}{4}$'],
    [r'$P = \dfrac{1}{2} \cdot \dfrac{1}{2} = \dfrac{1}{4}$',
     r'Der Baum hat vier Pfade: KK, KZ, ZK, ZZ.',
     r'Jeder hat die Wahrscheinlichkeit $\dfrac{1}{4}$, zusammen ergibt das $1$.'])

Q.q(r'Was ergibt die Summe der Wahrscheinlichkeiten aller Pfade eines Baumdiagramms?',
    [r'immer $1$', r'immer $0$', r'die Anzahl der Pfade', r'das hängt vom Versuch ab'],
    [r'Die Pfade beschreiben alle möglichen Ausgänge des Gesamtversuchs.',
     r'Genau einer davon tritt ein.',
     r'Deshalb ist ihre Summe $1$ — die wichtigste Kontrollrechnung beim Baumdiagramm.'])

# ----------------------------------------------------------- zweite Pfadregel ----
Q.q(r'Wie lautet die zweite Pfadregel?',
    [r'Die Wahrscheinlichkeiten aller Pfade, die zum Ereignis gehören, werden addiert.',
     r'Die Wahrscheinlichkeiten aller Pfade werden multipliziert.',
     r'Man nimmt den größten Pfadwert.',
     r'Man nimmt den Mittelwert der Pfade.'],
    [r'Ein Ereignis fasst oft mehrere Ergebnisse zusammen.',
     r'Jedes dieser Ergebnisse entspricht einem Pfad.',
     r'Weil sich die Pfade gegenseitig ausschließen, dürfen ihre Wahrscheinlichkeiten addiert werden.'])

Q.q(r'Zweimal mit Zurücklegen aus der Urne: wie groß ist die Wahrscheinlichkeit für genau einmal Rot?',
    [r'$\dfrac{12}{25}$', r'$\dfrac{6}{25}$', r'$\dfrac{4}{25}$', r'$\dfrac{16}{25}$'],
    [r'Zwei Pfade führen zum Ziel: rot-blau und blau-rot.',
     r'Jeder hat die Wahrscheinlichkeit $\dfrac{2}{5} \cdot \dfrac{3}{5} = \dfrac{6}{25}$.',
     r'Zusammen $\dfrac{12}{25}$. Der Faktor $2$ für die Reihenfolge wird leicht vergessen.'])

Q.q(r'Zweimal mit Zurücklegen: wie groß ist die Wahrscheinlichkeit für mindestens einmal Rot?',
    [r'$\dfrac{16}{25}$', r'$\dfrac{12}{25}$', r'$\dfrac{4}{25}$', r'$\dfrac{9}{25}$'],
    [r'Über das Gegenereignis: „kein einziges Mal rot“ bedeutet zweimal blau.',
     r'$P(\text{blau};\,\text{blau}) = \dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$',
     r'$1 - \dfrac{9}{25} = \dfrac{16}{25}$. Probe über die drei günstigen Pfade: $\dfrac{4}{25} + \dfrac{6}{25} + \dfrac{6}{25} = \dfrac{16}{25}$.'])

Q.q(r'Zweimal mit Zurücklegen: wie groß ist die Wahrscheinlichkeit für zwei Kugeln gleicher Farbe?',
    [r'$\dfrac{13}{25}$', r'$\dfrac{12}{25}$', r'$\dfrac{9}{25}$', r'$\dfrac{4}{25}$'],
    [r'Zwei Pfade sind günstig: rot-rot und blau-blau.',
     r'$\dfrac{4}{25} + \dfrac{9}{25} = \dfrac{13}{25}$',
     r'Probe: das Gegenereignis „verschiedene Farben“ hat $\dfrac{12}{25}$, zusammen $1$.'])

Q.q(r'Warum lohnt bei „mindestens einmal“ der Weg über das Gegenereignis?',
    [r'Weil das Gegenereignis meist aus nur einem Pfad besteht.',
     r'Weil das Gegenereignis immer wahrscheinlicher ist.',
     r'Weil man sonst multiplizieren müsste.',
     r'Weil die Pfadregeln dort nicht gelten.'],
    [r'„Mindestens einmal“ umfasst oft viele Pfade.',
     r'Das Gegenereignis „kein einziges Mal“ ist dagegen genau ein Pfad.',
     r'Ein Pfad statt vieler spart Rechenarbeit, besonders bei mehr als zwei Stufen.'])

# ---------------------------------------------- mit und ohne Zurücklegen ----
Q.q(r'Was ändert sich im Baumdiagramm beim Ziehen OHNE Zurücklegen?',
    [r'Die Wahrscheinlichkeiten der zweiten Stufe hängen vom Ergebnis der ersten ab.',
     r'Die Zahl der Pfade wird größer.',
     r'Die Pfadregeln gelten nicht mehr.',
     r'Die Summe aller Pfadwahrscheinlichkeiten ist nicht mehr $1$.'],
    [r'Nach dem ersten Zug hat sich der Urneninhalt verändert.',
     r'Die Äste der zweiten Stufe tragen deshalb je nach Vorgeschichte andere Zahlen.',
     r'Die beiden Pfadregeln gelten unverändert, und die Summe bleibt $1$.'])

Q.q(r'Zweimal OHNE Zurücklegen aus der Urne mit $2$ roten und $3$ blauen Kugeln: wie groß ist die Wahrscheinlichkeit für zwei blaue?',
    [r'$\dfrac{3}{10}$', r'$\dfrac{9}{25}$', r'$\dfrac{1}{10}$', r'$\dfrac{6}{25}$'],
    [r'Erster Zug blau: $\dfrac{3}{5}$. Danach sind noch $2$ blaue von $4$ Kugeln übrig.',
     r'$P = \dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{6}{20} = \dfrac{3}{10}$',
     r'Mit Zurücklegen wäre es $\dfrac{9}{25}$ — etwas mehr.'])

Q.q(r'Zweimal ohne Zurücklegen: wie groß ist die Wahrscheinlichkeit für genau einmal Rot?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{3}{10}$', r'$\dfrac{12}{25}$', r'$\dfrac{1}{10}$'],
    [r'Pfad rot-blau: $\dfrac{2}{5} \cdot \dfrac{3}{4} = \dfrac{6}{20}$. Pfad blau-rot: $\dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{6}{20}$.',
     r'Zusammen $\dfrac{12}{20} = \dfrac{3}{5}$.',
     r'Kontrolle aller vier Pfade: $\dfrac{2}{20} + \dfrac{6}{20} + \dfrac{6}{20} + \dfrac{6}{20} = 1$.'])

Q.q(r'In einer Produktion sind $10\,\%$ der Teile fehlerhaft. Zwei Teile werden unabhängig geprüft. Wie groß ist die Wahrscheinlichkeit, dass genau eines fehlerhaft ist?',
    [r'$18\,\%$', r'$20\,\%$', r'$10\,\%$', r'$1\,\%$'],
    [r'Zwei Pfade: fehlerhaft-gut und gut-fehlerhaft.',
     r'Jeder hat $0{,}1 \cdot 0{,}9 = 0{,}09$.',
     r'Zusammen $0{,}18$, also $18\,\%$.'])


def check():
    from fractions import Fraction as F
    r, b = F(2, 5), F(3, 5)
    assert r + b == 1 and 2 * 2 * 2 == 8
    # mit Zuruecklegen
    assert r * r == F(4, 25) and r * b == F(6, 25) and b * b == F(9, 25)
    assert r * r + r * b + b * r + b * b == 1
    assert 2 * (r * b) == F(12, 25)
    assert 1 - b * b == F(16, 25) and r * r + r * b + b * r == F(16, 25)
    assert r * r + b * b == F(13, 25) and 1 - F(13, 25) == F(12, 25)
    assert F(1, 2) * F(1, 2) == F(1, 4) and 4 * F(1, 4) == 1
    # ohne Zuruecklegen
    assert r * F(1, 4) == F(2, 20) == F(1, 10)
    assert b * F(2, 4) == F(6, 20) == F(3, 10)
    assert r * F(3, 4) == F(6, 20) and b * F(2, 4) == F(6, 20)
    assert r * F(3, 4) + b * F(2, 4) == F(12, 20) == F(3, 5)
    assert r * F(1, 4) + r * F(3, 4) + b * F(2, 4) + b * F(2, 4) == 1
    assert F(3, 10) < F(9, 25)
    # Produktion
    assert F(1, 10) * F(9, 10) == F(9, 100) and 2 * F(9, 100) == F(18, 100)


Q.verify(check)
Q.save()
