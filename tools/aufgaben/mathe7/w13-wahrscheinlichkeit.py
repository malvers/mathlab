#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 13 / KW 48 (LB 2): probability - Laplace rule,
estimating from relative frequencies, expected counts; judging statistics and charts
critically (cut axes, pictograms, samples, gambler's fallacy). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os7
from osfig import saeulen

Q = os7(nr=13, slug='wahrscheinlichkeit', thema='Wahrscheinlichkeit, Statistik kritisch lesen', lb='LB 2',
        blurb='Wahrscheinlichkeit berechnen und schätzen, Diagramme und Umfragen kritisch beurteilen',
        comment='Blocks: Laplace probability (1-8, 10, 19-20), estimating and expecting (9, 18), critical reading (11-17).')

fig_cut = saeulen(['A', 'B'], [47, 49], 1, 50, 'Partei', 'Stimmen in %', w=300, label='Säulendiagramm mit abgeschnittener Achse', ymin=46)

# ---------------------------------------------------------- Laplace probability ----
Q.q(r'Wie groß ist beim fairen Würfel die Wahrscheinlichkeit für eine Sechs?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{2}$', r'$\dfrac{6}{1}$', r'$\dfrac{1}{5}$'],
    [r'Alle 6 Ergebnisse sind gleich wahrscheinlich.',
     r'Günstig ist nur 1 Ergebnis.',
     r'$P(6) = \dfrac{1}{6}$'])

Q.q(r'Wie groß ist beim fairen Würfel die Wahrscheinlichkeit für eine gerade Augenzahl?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{2}{6}$', r'$\dfrac{1}{6}$'],
    [r'Günstig: 2, 4, 6 – das sind 3 von 6.',
     r'$\dfrac{3}{6}$',
     r'$= \dfrac{1}{2}$'])

Q.q(r'Wie groß ist beim fairen Würfel die Wahrscheinlichkeit für „mehr als 4“?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{2}{3}$', r'$\dfrac{4}{6}$'],
    [r'Günstig: 5 und 6.',
     r'$\dfrac{2}{6}$',
     r'$= \dfrac{1}{3}$'])

Q.q(r'In einem Beutel sind 3 rote und 2 blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, ohne Hinsehen eine rote zu ziehen?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{3}{2}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{2}$'],
    [r'Jede Kugel hat dieselbe Chance: 5 mögliche.',
     r'Günstig: 3 rote.',
     r'$P(\text{rot}) = \dfrac{3}{5}$'])

Q.q(r'Ein Glücksrad hat 8 gleich große Felder, 3 davon sind rot. Wie groß ist die Wahrscheinlichkeit für Rot?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{3}{5}$', r'$\dfrac{1}{3}$', r'$\dfrac{5}{8}$'],
    [r'8 gleich wahrscheinliche Felder.',
     r'3 davon sind günstig.',
     r'$P(\text{rot}) = \dfrac{3}{8}$'])

Q.q(r'Welche Aussage über Wahrscheinlichkeiten stimmt?',
    [r'Sie liegen immer zwischen 0 und 1; ein sicheres Ereignis hat 1.', r'Sie können größer als 1 sein.',
     r'Ein unmögliches Ereignis hat 1.', r'Sie sind immer $\dfrac{1}{2}$.'],
    [r'0 heißt: tritt nie ein (unmöglich).',
     r'1 heißt: tritt immer ein (sicher).',
     r'Alles andere liegt dazwischen, auch in Prozent: 0 % bis 100 %.'])

Q.q(r'Wie groß ist beim fairen Würfel die Wahrscheinlichkeit, KEINE Sechs zu würfeln?',
    [r'$\dfrac{5}{6}$', r'$\dfrac{1}{6}$', r'$\dfrac{6}{5}$', r'0'],
    [r'Gegenereignis von „Sechs“.',
     r'$1 - \dfrac{1}{6}$',
     r'$= \dfrac{5}{6}$'])

Q.q(r'Wie berechnet man bei einem Laplace-Versuch die Wahrscheinlichkeit eines Ereignisses?',
    [r'Anzahl der günstigen Ergebnisse durch Anzahl aller Ergebnisse', r'Anzahl aller Ergebnisse durch Anzahl der günstigen',
     r'günstige Ergebnisse mal alle Ergebnisse', r'immer 1 durch 2'],
    [r'Laplace-Versuch: Alle Ergebnisse sind gleich wahrscheinlich.',
     r'$P(E) = \dfrac{\text{Anzahl günstige Ergebnisse}}{\text{Anzahl mögliche Ergebnisse}}$',
     r'Benannt nach Pierre-Simon Laplace (1749–1827).'])

Q.q(r'Zwei faire Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme 7?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{7}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{11}$'],
    [r'Es gibt $6 \cdot 6 = 36$ gleich wahrscheinliche Paare.',
     r'Summe 7: (1|6), (2|5), (3|4), (4|3), (5|2), (6|1) – 6 Paare.',
     r'$\dfrac{6}{36} = \dfrac{1}{6}$. (11 Summen sind nicht gleich wahrscheinlich!)'])

Q.q(r'Beutel A: 2 rote und 3 blaue Kugeln. Beutel B: 3 rote und 5 blaue. Aus welchem Beutel zieht man eher eine rote Kugel?',
    [r'aus A (0,4 statt 0,375)', r'aus B, weil er mehr rote Kugeln hat', r'aus beiden gleich wahrscheinlich', r'aus B (0,6 statt 0,4)'],
    [r'A: $\dfrac{2}{5} = 0{,}4$',
     r'B: $\dfrac{3}{8} = 0{,}375$',
     r'Entscheidend ist der Anteil, nicht die Anzahl.'])

Q.q(r'Wie viel Prozent sind die Wahrscheinlichkeit $\dfrac{1}{4}$?',
    [r'25 %', r'14 %', r'4 %', r'40 %'],
    [r'$\dfrac{1}{4} = \dfrac{25}{100}$',
     r'Hundertstel sind Prozent.',
     r'25 %'])

# ------------------------------------------------------ estimating and expecting ----
Q.q(r'Wie bestimmt man die Wahrscheinlichkeit, dass eine Reißzwecke auf dem Kopf landet?',
    [r'Man wirft sehr oft und nimmt die relative Häufigkeit als Schätzwert.', r'Man rechnet $\dfrac{1}{2}$.',
     r'Man wirft einmal und schaut nach.', r'Das geht überhaupt nicht.'],
    [r'Die Reißzwecke ist kein Laplace-Versuch.',
     r'Bei vielen Würfen stabilisiert sich die relative Häufigkeit.',
     r'Dieser Wert ist eine gute Schätzung der Wahrscheinlichkeit.'])

Q.q(r'Ein Ereignis hat die Wahrscheinlichkeit 0,25. Wie oft erwartet man es bei 80 Versuchen ungefähr?',
    [r'etwa 20-mal', r'genau 20-mal', r'etwa 25-mal', r'etwa 4-mal'],
    [r'Erwartete Anzahl = Wahrscheinlichkeit · Anzahl der Versuche',
     r'$0{,}25 \cdot 80 = 20$',
     r'Etwa 20-mal – es kann auch etwas mehr oder weniger sein.'])

# --------------------------------------------------------------- critical reading ----
Q.q(r'Das Diagramm zeigt die Stimmen von zwei Parteien. Was ist daran irreführend?',
    [r'Die Achse beginnt bei 46 %; B sieht dreimal so groß aus, obwohl der Unterschied nur 2 Prozentpunkte ist.',
     r'Nichts, B hat dreimal so viele Stimmen.', r'Die Säulen sind zu breit.', r'Es fehlt eine dritte Partei.'],
    [r'Auf der Hochachse steht unten nicht 0, sondern 46.',
     r'Ab 46 % gemessen ist A 1 Kästchen hoch, B 3 Kästchen – dabei unterscheiden sich 47 % und 49 % kaum.',
     r'Durch die abgeschnittene Achse wirkt der Unterschied riesig.'],
    fig=fig_cut, figcap=r'Werbe-Diagramm einer Partei')

Q.q(r'In einem Bilddiagramm wird ein Würfel doppelt so lang, breit und hoch gezeichnet, um „doppelt so viel“ zu zeigen. Was ist das Problem?',
    [r'Er wirkt achtmal so groß, weil sein Volumen achtmal so groß ist.', r'Es gibt kein Problem.',
     r'Er wirkt nur halb so groß.', r'Würfel darf man in Diagrammen nicht zeichnen.'],
    [r'Doppelte Kantenlänge: $2 \cdot 2 \cdot 2 = 8$-faches Volumen.',
     r'Unser Auge vergleicht die Größe des ganzen Bildes.',
     r'So wird „doppelt so viel“ stark übertrieben dargestellt.'])

Q.q(r'Eine Umfrage im Fitnessstudio ergibt: „90 % der Befragten treiben jede Woche Sport.“ Gilt das für alle Menschen in Deutschland?',
    [r'Nein, wer im Fitnessstudio gefragt wird, treibt meistens ohnehin Sport.', r'Ja, 90 % sind sehr viele.',
     r'Ja, wenn mindestens 10 Personen gefragt wurden.', r'Nein, weil man nie Sport treiben sollte.'],
    [r'Wichtig ist, wer gefragt wurde.',
     r'Die Befragten sind nicht typisch für alle Menschen.',
     r'Man sagt: Die Stichprobe ist nicht repräsentativ.'])

Q.q(r'Eine Werbung sagt: „4 von 5 Befragten empfehlen unser Produkt!“ Was sollte man zuerst fragen?',
    [r'Wie viele Personen wurden befragt, und wer?', r'Welche Farbe hat das Produkt?',
     r'Warum nicht 5 von 5?', r'Gar nichts, 80 % sind überzeugend.'],
    [r'Vielleicht wurden nur 5 Personen gefragt.',
     r'Vielleicht arbeiten sie alle für die Firma.',
     r'Ohne Angaben zur Umfrage ist die Zahl wenig wert.'])

Q.q(r'Ein Laden meldet: „Unser Verkauf ist um 100 % gestiegen!“ Er hat statt einem Fahrrad jetzt zwei verkauft. Was zeigt das?',
    [r'Prozentangaben ohne Grundwert können täuschen.', r'Der Laden ist jetzt sehr erfolgreich.',
     r'Die Rechnung ist falsch.', r'100 % bedeutet immer viel.'],
    [r'Von 1 auf 2 ist tatsächlich eine Steigerung um 100 %.',
     r'Bei einem Grundwert von 1 ist das aber nur 1 Fahrrad mehr.',
     r'Immer nach dem Grundwert fragen.'])

Q.q(r'In einem Kreisdiagramm einer Zeitung ergeben die Anteile zusammen 110 %. Was folgt daraus?',
    [r'Das Diagramm ist fehlerhaft oder Mehrfachantworten wurden zusammengezählt.', r'Alles in Ordnung.',
     r'Die Zeitung hat besonders genau gerechnet.', r'Ein Kreis hat 110 %.'],
    [r'Ein Kreisdiagramm zeigt Teile eines Ganzen: zusammen 100 %.',
     r'110 % passen nicht in einen Kreis.',
     r'Bei Mehrfachantworten ist ein Säulendiagramm die bessere Wahl.'])

Q.q(r'Beim Roulette kam fünfmal hintereinander Rot. Ist beim nächsten Mal Schwarz wahrscheinlicher?',
    [r'Nein, die Kugel hat kein Gedächtnis; die Chance bleibt gleich.', r'Ja, Schwarz ist jetzt fällig.',
     r'Ja, nach fünfmal Rot kommt immer Schwarz.', r'Nein, Rot ist jetzt wahrscheinlicher.'],
    [r'Jede Drehung ist unabhängig von den vorherigen.',
     r'Die Chance für Schwarz ist wieder $\dfrac{18}{37}$.',
     r'Der Irrtum „jetzt ist es fällig“ heißt Spielerfehlschluss.'])


def check():
    S = range(1, 7)
    P = lambda E: F(len([s for s in S if E(s)]), 6)
    assert P(lambda s: s == 6) == F(1, 6) and P(lambda s: s % 2 == 0) == F(1, 2) and P(lambda s: s > 4) == F(1, 3)
    assert 1 - P(lambda s: s == 6) == F(5, 6)
    assert F(3, 5) == F(3, 3 + 2) and F(3, 8) == F(3, 8)
    pairs = [(a, b) for a in S for b in S]
    assert F(len([p for p in pairs if sum(p) == 7]), 36) == F(1, 6)
    assert F(2, 5) == F('0.4') > F(3, 8) == F('0.375')
    assert F(1, 4) == F(25, 100) and F('0.25') * 80 == 20
    assert 49 - 47 == 2 and (49 - 46) == 3 * (47 - 46) and 2 ** 3 == 8 and F(4, 5) == F(80, 100) and (2 - 1) / 1 == 1


Q.verify(check)
Q.save()
