#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 37 / KW 23 (WB 2 Mathematische Spiele): plane and spatial
puzzles - tangram, Soma cube, sliding puzzle, pentominoes, with their sources.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os6
from osfig import tangram, TANGRAM

Q = os6(nr=37, slug='puzzles', thema='Puzzles: Tangram, Soma-Würfel, Schiebepuzzle', lb='WB 2',
        blurb='Legespiele, räumliche Puzzles, Schiebepuzzle, Pentominos',
        comment='Blocks: tangram (1-8), Soma cube (9-12, 18), sliding puzzle (13-15), pentominoes (16-17), rules (19-20). Sources in the texts.')

fig_t = tangram()
cap_t = r'Tangram: die sieben Teile im Quadrat'


def area(pts):
    return F(abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1] for i in range(len(pts)))), 2)


# ------------------------------------------------------------------ tangram ----
Q.q(r'Aus wie vielen Teilen besteht ein Tangram?',
    [r'7', r'5', r'9', r'12'],
    [r'Das Tangram ist ein Legespiel aus China, bekannt seit etwa 1800.',
     r'Ein Quadrat wird in Teile zerschnitten, die man neu zusammenlegt.',
     r'Es sind 7 Teile; auf Chinesisch heißt es „Sieben-Schlau-Brett“.'],
    fig=fig_t, figcap=cap_t)

Q.q(r'Welche Teile hat ein Tangram?',
    [r'5 Dreiecke, 1 Quadrat und 1 Parallelogramm', r'7 Dreiecke', r'4 Dreiecke, 2 Quadrate und 1 Trapez',
     r'3 Dreiecke, 2 Quadrate und 2 Rechtecke'],
    [r'Dreiecke: zwei große, ein mittleres, zwei kleine.',
     r'Dazu ein Quadrat (Teil 5) und ein Parallelogramm (Teil 7).',
     r'Zusammen 7 Teile.'],
    fig=fig_t, figcap=cap_t)

Q.q(r'Aus welchem Land stammt das Tangram?',
    [r'China', r'Ägypten', r'Griechenland', r'Japan'],
    [r'Das Legespiel kam um 1800 aus China nach Europa.',
     r'Dort wurde es schnell zu einem beliebten Zeitvertreib.',
     r'Es gibt über 1000 bekannte Legefiguren.'])

Q.q(r'Welchen Anteil am ganzen Quadrat hat ein großes Dreieck (Teil 1)?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{7}$'],
    [r'Die beiden großen Dreiecke bilden zusammen die Hälfte des Quadrats.',
     r'Ein großes Dreieck ist also die Hälfte der Hälfte.',
     r'$\dfrac{1}{2} \cdot \dfrac{1}{2} = \dfrac{1}{4}$'],
    fig=fig_t, figcap=cap_t)

Q.q(r'Welchen Anteil am ganzen Quadrat hat ein kleines Dreieck (Teil 4)?',
    [r'$\dfrac{1}{16}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{7}$'],
    [r'Zwei kleine Dreiecke ergeben zusammen das Quadrat (Teil 5).',
     r'Das Quadrat ist $\dfrac{1}{8}$ des Ganzen.',
     r'Ein kleines Dreieck: $\dfrac{1}{8} : 2 = \dfrac{1}{16}$'],
    fig=fig_t, figcap=cap_t)

Q.q(r'Das ganze Tangram-Quadrat ist 16 cm² groß. Wie groß ist das kleine Quadrat (Teil 5)?',
    [r'2 cm²', r'4 cm²', r'1 cm²', r'8 cm²'],
    [r'Das kleine Quadrat ist $\dfrac{1}{8}$ des Ganzen.',
     r'$16 : 8 = 2$',
     r'2 cm² – genauso groß wie das Parallelogramm und das mittlere Dreieck.'])

Q.q(r'Was kann man aus den beiden kleinen Tangram-Dreiecken legen?',
    [r'das Quadrat, das Parallelogramm und das mittlere Dreieck', r'nur das Quadrat', r'ein großes Dreieck',
     r'gar keine andere Tangram-Figur'],
    [r'Jedes kleine Dreieck ist $\dfrac{1}{16}$, zusammen $\dfrac{1}{8}$.',
     r'Genauso groß sind Quadrat, Parallelogramm und mittleres Dreieck.',
     r'Alle drei lassen sich aus den zwei kleinen Dreiecken legen.'])

Q.q(r'Welche Winkelgrößen kommen in den Tangram-Teilen vor?',
    [r'45°, 90° und 135°', r'30°, 60° und 90°', r'nur 90°', r'60° und 120°'],
    [r'Alle Dreiecke sind rechtwinklig und gleichschenklig: 45°, 45°, 90°.',
     r'Das Quadrat hat 90°-Winkel.',
     r'Das Parallelogramm hat 45° und 135°.'])

# ---------------------------------------------------------------- Soma cube ----
Q.q(r'Der Soma-Würfel ist ein räumliches Puzzle. Wer hat ihn 1933 erfunden?',
    [r'der dänische Dichter und Erfinder Piet Hein', r'Carl Friedrich Gauß', r'Adam Ries', r'Leonhard Euler'],
    [r'Piet Hein soll die Idee während eines Vortrags über Quantenphysik gehabt haben.',
     r'Er fragte sich, welche Formen man aus wenigen Würfeln bauen kann.',
     r'Daraus entstand der Soma-Würfel.'])

Q.q(r'Aus wie vielen kleinen Würfeln besteht der fertige Soma-Würfel?',
    [r'27', r'9', r'24', r'64'],
    [r'Der fertige Würfel ist 3 Würfel lang, breit und hoch.',
     r'$3 \cdot 3 \cdot 3$',
     r'$= 27$'])

Q.q(r'Der Soma-Würfel hat 7 Teile: sechs Teile aus je 4 Würfeln und ein kleineres Teil. Aus wie vielen Würfeln besteht das kleinste Teil?',
    [r'3', r'4', r'2', r'1'],
    [r'Sechs Teile: $6 \cdot 4 = 24$ Würfel.',
     r'Insgesamt sind es 27.',
     r'Das kleinste Teil hat $27 - 24 = 3$ Würfel.'])

Q.q(r'Die Mathematiker John Conway und Michael Guy zählten 1961, auf wie viele Arten man den Soma-Würfel zusammensetzen kann (gedrehte und gespiegelte Lösungen nicht doppelt). Wie viele sind es?',
    [r'240', r'1', r'7', r'27'],
    [r'Es gibt viel mehr als eine Lösung.',
     r'Conway und Guy fanden sie durch geschicktes Ordnen.',
     r'Es sind 240 verschiedene Lösungen.'])

Q.q(r'Wie viele kleine Würfel braucht man für einen großen Würfel mit der Kantenlänge 4 (in kleinen Würfeln)?',
    [r'64', r'16', r'48', r'27'],
    [r'$4 \cdot 4$ Würfel in einer Schicht = 16.',
     r'4 Schichten übereinander.',
     r'$16 \cdot 4 = 64$'])

# ------------------------------------------------------------ sliding puzzle ----
Q.q(r'Beim 15er-Schiebepuzzle liegen Steine in einem Kasten mit 4 × 4 Feldern. Wie viele Steine sind es?',
    [r'15', r'16', r'14', r'8'],
    [r'Der Kasten hat $4 \cdot 4 = 16$ Felder.',
     r'Ein Feld bleibt frei, damit man schieben kann.',
     r'Also 15 Steine.'])

Q.q(r'Wer hat das 15er-Schiebepuzzle um 1874 erfunden?',
    [r'Noyes Chapman, ein Postmeister in den USA', r'Sam Loyd', r'Piet Hein', r'Alkuin von York'],
    [r'Lange hielt man Sam Loyd für den Erfinder, er hat das selbst behauptet.',
     r'Forschungen zeigen: Der Postmeister Noyes Chapman hatte die Idee.',
     r'1880 gab es dann einen richtigen Schiebepuzzle-Rausch.'])

Q.q(r'Beim 15er-Puzzle sind nur die Steine 14 und 15 vertauscht. Kann man durch Schieben die richtige Reihenfolge herstellen?',
    [r'Nein, das ist unmöglich; bewiesen wurde es 1879.', r'Ja, mit genau einem Zug.', r'Ja, mit genau 15 Zügen.',
     r'Ja, wenn man lange genug schiebt.'],
    [r'Die Mathematiker Johnson und Story zeigten 1879:',
     r'Nur die Hälfte aller Anordnungen lässt sich durch Schieben erreichen.',
     r'Die vertauschte Stellung gehört zur anderen Hälfte – sie ist unlösbar.'])

# --------------------------------------------------------------- pentominoes ----
Q.q(r'Pentominos sind Figuren aus 5 gleichen Quadraten, die mit ganzen Seiten aneinanderliegen. Wie viele verschiedene gibt es (gedreht und gespiegelt zählt nicht neu)?',
    [r'12', r'5', r'10', r'25'],
    [r'Den Namen gab ihnen der Mathematiker Solomon Golomb 1953.',
     r'Man findet sie durch systematisches Probieren.',
     r'Es gibt genau 12 Pentominos.'])

Q.q(r'Mit allen 12 Pentominos zusammen kann man ein Rechteck legen. Welches?',
    [r'6 × 10', r'6 × 12', r'5 × 10', r'7 × 8'],
    [r'12 Teile mit je 5 Quadraten: $12 \cdot 5 = 60$ Quadrate.',
     r'Das Rechteck muss also 60 Quadrate haben.',
     r'$6 \cdot 10 = 60$ – dafür gibt es sogar 2339 Lösungen.'])

# --------------------------------------------------------------------- rules ----
Q.q(r'Mit den 7 Tangram-Teilen soll eine Figur gelegt werden. Welche Regel gilt?',
    [r'Alle 7 Teile werden benutzt und dürfen sich nicht überlappen.', r'Man darf Teile weglassen.',
     r'Man darf Teile zerschneiden.', r'Teile dürfen übereinanderliegen.'],
    [r'Jede Tangram-Figur hat denselben Flächeninhalt wie das Quadrat.',
     r'Dafür braucht man alle Teile.',
     r'Die Teile liegen flach nebeneinander und berühren sich nur an den Rändern.'])

Q.q(r'Eine Tangram-Figur sieht aus wie eine Katze. Wie groß ist ihr Flächeninhalt, wenn das Tangram-Quadrat 16 cm² hat?',
    [r'16 cm²', r'8 cm²', r'32 cm²', r'Das hängt von der Form ab.'],
    [r'Die Katze besteht aus denselben 7 Teilen.',
     r'Beim Umlegen ändert sich der Flächeninhalt nicht.',
     r'Also 16 cm² – nur der Umfang kann sich ändern.'])


def check():
    names = [n for n, _ in TANGRAM]
    assert len(TANGRAM) == 7 and sum('Dreieck' in n for n in names) == 5 and names.count('Quadrat') == 1
    areas = [area(p) for _, p in TANGRAM]
    total = sum(areas)
    assert total == 16
    assert areas[0] / total == F(1, 4) and areas[3] / total == F(1, 16) and areas[4] / total == F(1, 8)
    assert 16 * F(1, 8) == 2 and areas[2] == areas[4] == areas[6] == 2 * areas[3] == 2 * areas[5]
    assert 3 ** 3 == 27 and 27 - 6 * 4 == 3 and 4 ** 3 == 64
    assert 4 * 4 - 1 == 15
    assert 12 * 5 == 60 == 6 * 10 and 6 * 12 != 60 and 5 * 10 != 60 and 7 * 8 != 60


Q.verify(check)
Q.save()
