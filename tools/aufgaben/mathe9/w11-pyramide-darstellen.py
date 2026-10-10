#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 11 / KW 46 (LB 2): Pyramiden darstellen -
Ecken, Kanten, Flächen, Netz, Schrägbild, senkrechtes Zweitafelbild. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=11, slug='pyramide-darstellen', thema='Pyramiden darstellen', lb='LB 2',
        blurb='Ecken, Kanten und Flächen, Netz, Schrägbildskizze, Grundriss und Aufriss',
        comment='Blocks: counting (1-4, 17-18), nets (5, 13, 16), terms (6, 14-15, 20), oblique view (7-8, 19), two-plane view (9-12).')

# ------------------------------------------------------------------ Zählen ----
Q.q(r'Wie viele Ecken, Kanten und Flächen hat eine quadratische Pyramide?',
    [r'5 Ecken, 8 Kanten, 5 Flächen', r'4 Ecken, 8 Kanten, 4 Flächen', r'5 Ecken, 4 Kanten, 5 Flächen', r'8 Ecken, 12 Kanten, 6 Flächen'],
    [r'Ecken: 4 Grundecken und die Spitze.',
     r'Kanten: 4 Grundkanten und 4 Seitenkanten. Flächen: Grundfläche und 4 Dreiecke.'])

Q.q(r'Wie viele Ecken, Kanten und Flächen hat eine dreiseitige Pyramide?',
    [r'4 Ecken, 6 Kanten, 4 Flächen', r'3 Ecken, 6 Kanten, 3 Flächen', r'4 Ecken, 4 Kanten, 4 Flächen', r'5 Ecken, 6 Kanten, 5 Flächen'],
    [r'3 Grundecken + Spitze = 4, 3 Grund- + 3 Seitenkanten = 6, Grundfläche + 3 Dreiecke = 4.'])

Q.q(r'Wie viele Kanten hat eine sechsseitige Pyramide?',
    [r'12', r'6', r'7', r'18'],
    [r'6 Grundkanten und 6 Seitenkanten.'])

Q.q(r'Für Pyramiden gilt der Eulersche Polyedersatz $E + F - K = 2$. Prüfe ihn an der quadratischen Pyramide.',
    [r'$5 + 5 - 8 = 2$', r'$4 + 5 - 8 = 1$', r'$5 + 4 - 8 = 1$', r'$5 + 5 - 4 = 6$'],
    [r'Ecken 5, Flächen 5, Kanten 8.',
     r'$5 + 5 - 8 = 2$ stimmt.'])

# ------------------------------------------------------------------- Netz ----
Q.q(r'Woraus besteht das Netz einer geraden quadratischen Pyramide?',
    [r'aus einem Quadrat und vier gleichschenkligen Dreiecken', r'aus einem Quadrat und vier Rechtecken',
     r'aus zwei Quadraten und vier Dreiecken', r'aus vier gleichseitigen Dreiecken'],
    [r'Die Grundfläche ist das Quadrat.',
     r'Die Seitenflächen sind gleichschenklige Dreiecke, weil die Spitze über der Mitte liegt.'])

Q.q(r'Wann heißt eine Pyramide gerade?',
    [r'wenn die Spitze senkrecht über dem Mittelpunkt der Grundfläche liegt', r'wenn alle Kanten gleich lang sind',
     r'wenn sie eine quadratische Grundfläche hat', r'wenn sie genau vier Flächen hat'],
    [r'Bei einer geraden Pyramide trifft die Körperhöhe die Mitte der Grundfläche.'])

# --------------------------------------------------------------- Schrägbild ----
Q.q(r'Welche Festlegung gilt meist für die Schrägbildskizze im Unterricht?',
    [r'Tiefenkanten unter $45^\circ$ und auf die Hälfte verkürzt', r'Tiefenkanten senkrecht und doppelt so lang',
     r'alle Kanten unter $30^\circ$ in wahrer Länge', r'Tiefenkanten werden weggelassen'],
    [r'Breite und Höhe werden in wahrer Größe gezeichnet.',
     r'Kanten in die Tiefe zeichnet man unter $45^\circ$ und mit dem Faktor $\dfrac{1}{2}$.'])

Q.q(r'Eine 4 cm lange Kante zeigt in die Tiefe. Wie lang zeichnet man sie im Schrägbild ($45^\circ$, Verkürzung $\dfrac{1}{2}$)?',
    [r'2 cm', r'4 cm', r'8 cm', r'2,83 cm'],
    [r'$4 \cdot \dfrac{1}{2} = 2$ cm'])

Q.q(r'Wie sieht der Grundriss (Draufsicht) einer geraden quadratischen Pyramide aus?',
    [r'ein Quadrat mit seinen beiden Diagonalen', r'ein gleichschenkliges Dreieck', r'ein Kreis', r'ein Rechteck ohne Linien'],
    [r'Von oben sieht man die quadratische Grundfläche.',
     r'Die Seitenkanten laufen zur Spitze über der Mitte: Sie erscheinen als Diagonalen.'])

Q.q(r'Wie sieht der Aufriss (Vorderansicht) einer geraden quadratischen Pyramide aus, deren Grundkante parallel zur Bildebene liegt?',
    [r'ein gleichschenkliges Dreieck', r'ein Quadrat', r'ein Rechteck', r'ein Trapez'],
    [r'Von vorn sieht man die Grundkante unten und die Spitze in der Mitte darüber.'])

Q.q(r'In welcher Ansicht erscheint die Körperhöhe einer geraden Pyramide in wahrer Länge?',
    [r'im Aufriss', r'im Grundriss', r'in keiner Ansicht', r'nur im Netz'],
    [r'Die Körperhöhe steht senkrecht auf der Grundfläche.',
     r'Im Aufriss sieht man sie unverkürzt, im Grundriss schrumpft sie auf einen Punkt.'])

Q.q(r'Erscheinen die Seitenkanten einer geraden quadratischen Pyramide im Aufriss in wahrer Länge?',
    [r'Nein, sie sind gegen die Bildebene geneigt und erscheinen verkürzt.', r'Ja, immer.',
     r'Ja, aber nur die vorderen.', r'Sie erscheinen gar nicht.'],
    [r'Die Seitenkanten laufen schräg nach hinten.',
     r'Ihre wahre Länge berechnet man mit dem Satz des Pythagoras.'])

Q.q(r'Welches Netz gehört zu keiner Pyramide?',
    [r'ein Quadrat und vier Rechtecke', r'ein Quadrat und vier Dreiecke', r'vier gleichseitige Dreiecke', r'ein Sechseck und sechs Dreiecke'],
    [r'Bei einer Pyramide laufen alle Seitenflächen in einer Spitze zusammen: Sie sind Dreiecke.',
     r'Rechtecke als Seitenflächen gehören zu einem Prisma.'])

Q.q(r'Was unterscheidet eine Pyramide von einem Prisma?',
    [r'Die Pyramide hat nur eine Grundfläche und eine Spitze.', r'Die Pyramide hat zwei Grundflächen.',
     r'Die Pyramide hat nur rechteckige Flächen.', r'Es gibt keinen Unterschied.'],
    [r'Ein Prisma hat zwei gleiche, parallele Grundflächen.',
     r'Eine Pyramide hat eine Grundfläche, ihre Seitenflächen treffen sich in der Spitze.'])

Q.q(r'Welcher Körper ist eine Pyramide aus vier gleichseitigen Dreiecken?',
    [r'das Tetraeder', r'der Würfel', r'das Oktaeder', r'der Kegel'],
    [r'Tetra heißt vier: vier Flächen.',
     r'Jede Fläche kann als Grundfläche dienen.'])

Q.q(r'Eine quadratische Pyramide hat 4 cm Grundkanten und 5 cm Seitenkanten. Welche Seitenlängen haben die Dreiecke im Netz?',
    [r'4 cm, 5 cm und 5 cm', r'4 cm, 4 cm und 5 cm', r'5 cm, 5 cm und 5 cm', r'4 cm, 4 cm und 4 cm'],
    [r'Jedes Seitendreieck hat eine Grundkante und zwei Seitenkanten.'])

Q.q(r'Wie viele Seitenflächen hat eine $n$-seitige Pyramide?',
    [r'$n$', r'$n + 1$', r'$2n$', r'$n - 1$'],
    [r'Über jeder Grundkante steht ein Seitendreieck.',
     r'Mit der Grundfläche hat sie insgesamt $n + 1$ Flächen.'])

Q.q(r'Wie viele Kanten hat eine $n$-seitige Pyramide?',
    [r'$2n$', r'$n$', r'$n + 1$', r'$3n$'],
    [r'$n$ Grundkanten und $n$ Seitenkanten.'])

Q.q(r'Als was erscheint die quadratische Grundfläche einer Pyramide in der Schrägbildskizze?',
    [r'als Parallelogramm', r'als Quadrat', r'als Kreis', r'als Dreieck'],
    [r'Die vordere Kante bleibt waagerecht, die Tiefenkanten laufen schräg und verkürzt.',
     r'So wird aus dem Quadrat ein Parallelogramm.'])

Q.q(r'Welche Grundfläche hat die Cheops-Pyramide in Gizeh?',
    [r'ein Quadrat', r'ein gleichseitiges Dreieck', r'ein Rechteck mit sehr verschiedenen Seiten', r'einen Kreis'],
    [r'Die Cheops-Pyramide ist eine gerade quadratische Pyramide mit etwa 230 m Grundkante.'])


def check():
    py = lambda n: (n + 1, 2 * n, n + 1)
    assert py(4) == (5, 8, 5) and py(3) == (4, 6, 4) and py(6)[1] == 12
    E, K, F = py(4)
    assert E + F - K == 2
    assert 4 * 0.5 == 2


Q.verify(check)
Q.save()
