#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 32 / KW 18 (LB 4): Daten in den Medien -
Diagramme kritisch lesen, Stichproben, Prozent und Prozentpunkte. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=32, slug='daten-medien', thema='Daten in den Medien', lb='LB 4',
        blurb='Abgeschnittene Achsen, Bildstatistiken, Stichproben, absolute und relative Zahlen, Prozentpunkte',
        comment='Blocks: misleading diagrams (1-3, 13, 19), samples and sources (4, 15, 17-18), relative numbers and percent (5-6, 10-12), pie charts (7-9, 20), correlation and averages (14, 16).')

# ------------------------------------------------- irreführende Diagramme ----
Q.q(r'Ein Säulendiagramm beginnt auf der Hochachse bei 90 statt bei 0. Welche Wirkung hat das?',
    [r'Unterschiede wirken viel größer, als sie sind.', r'Unterschiede wirken kleiner.', r'Das Diagramm wird genauer.', r'Es hat keine Wirkung.'],
    [r'Man sieht nur die Spitzen der Säulen.',
     r'Kleine Unterschiede erscheinen dadurch riesig.'])

Q.q(r'In diesem Diagramm (Achse ab 90) sind die Werte 92 und 96 dargestellt. Die zweite Säule ist dreimal so hoch. Um wie viel Prozent ist 96 tatsächlich größer als 92 (gerundet)?',
    [r'um 4,3 %', r'um 200 %', r'um 4 %', r'um 300 %'],
    [r'Sichtbar sind nur $92 - 90 = 2$ und $96 - 90 = 6$.',
     r'Tatsächlich: $\dfrac{96 - 92}{92} \approx 0{,}043 = 4{,}3$ %'])

Q.q(r'In einer Bildstatistik wird ein Geldsack doppelt so hoch und doppelt so breit gezeichnet, um „doppelt so viel“ zu zeigen. Was ist das Problem?',
    [r'Die Fläche ist 4-mal so groß, das Bild übertreibt.', r'Es gibt kein Problem.', r'Die Fläche ist nur doppelt so groß.', r'Das Bild untertreibt.'],
    [r'Länge mal 2 und Breite mal 2 ergibt Fläche mal 4.',
     r'Das Auge vergleicht Flächen, nicht Höhen.'])

# ----------------------------------------------------- Stichprobe, Quelle ----
Q.q(r'Vor einem Fitnessstudio werden 20 Personen gefragt, wie oft sie Sport treiben. Taugt das als Aussage über alle Menschen der Stadt?',
    [r'Nein, die Stichprobe ist klein und einseitig ausgewählt.', r'Ja, 20 Personen reichen immer.',
     r'Ja, weil alle ehrlich antworten.', r'Nein, weil man nur Erwachsene fragen darf.'],
    [r'Wer vor einem Fitnessstudio steht, treibt wahrscheinlich mehr Sport als der Durchschnitt.',
     r'Eine aussagekräftige Stichprobe muss zufällig und groß genug sein.'])

Q.q(r'Eine Schlagzeile lautet: „Unfälle an der Kreuzung um 100 % gestiegen!“ Es waren vorher 1, jetzt 2 Unfälle. Was ist die Kritik?',
    [r'Bei so kleinen Zahlen sagen Prozentangaben wenig, die absolute Zahl fehlt.', r'Die Rechnung ist falsch, es sind 50 %.',
     r'Es sind 200 %.', r'Es gibt nichts zu kritisieren.'],
    [r'Von 1 auf 2 ist tatsächlich eine Verdopplung, also +100 %.',
     r'Ohne die Grundzahl wirkt die Meldung aber viel dramatischer.'])

Q.q(r'Stadt A hat 50 Unfälle bei 10 000 Einwohnern, Stadt B 120 Unfälle bei 60 000 Einwohnern. Wo ist das Risiko pro Einwohner höher?',
    [r'in A: 5 statt 2 Unfälle pro 1000 Einwohner', r'in B, weil dort mehr Unfälle sind', r'gleich hoch', r'Das lässt sich nicht vergleichen.'],
    [r'A: $\dfrac{50}{10\,000} = 5$ pro 1000',
     r'B: $\dfrac{120}{60\,000} = 2$ pro 1000'])

# ----------------------------------------------------------- Kreisdiagramme ----
Q.q(r'Ein Kreisdiagramm in einer Zeitung zeigt die Anteile 45 %, 30 % und 30 %. Was stimmt nicht?',
    [r'Die Anteile ergeben zusammen 105 %, nicht 100 %.', r'Kreisdiagramme dürfen nur zwei Anteile zeigen.',
     r'45 % ist zu groß.', r'Alles stimmt.'],
    [r'Ein Kreisdiagramm zeigt die Teile eines Ganzen, also zusammen genau 100 %.'])

Q.q(r'Welcher Mittelpunktswinkel gehört im Kreisdiagramm zu 25 %?',
    [r'$90^\circ$', r'$25^\circ$', r'$45^\circ$', r'$100^\circ$'],
    [r'$0{,}25 \cdot 360^\circ = 90^\circ$'])

Q.q(r'Welcher Mittelpunktswinkel gehört zu 18 %?',
    [r'$64{,}8^\circ$', r'$18^\circ$', r'$36^\circ$', r'$20^\circ$'],
    [r'$0{,}18 \cdot 360^\circ = 64{,}8^\circ$'])

Q.q(r'Bei einer Umfrage sagen 120 von 400 Befragten Ja. Wie viel Prozent sind das?',
    [r'30 %', r'12 %', r'40 %', r'3,3 %'],
    [r'$\dfrac{120}{400} = 0{,}3 = 30$ %'])

Q.q(r'Eine Wahlumfrage sieht eine Partei bei 24 %, mit einer Unsicherheit von ±2 Prozentpunkten. Welcher Bereich ist gemeint?',
    [r'22 % bis 26 %', r'23,52 % bis 24,48 %', r'20 % bis 28 %', r'genau 24 %'],
    [r'Prozentpunkte werden direkt addiert und subtrahiert: $24 \pm 2$.'])

Q.q(r'Ein Anteil steigt von 10 % auf 12 %. Was ist richtig?',
    [r'Er steigt um 2 Prozentpunkte, das sind 20 % mehr.', r'Er steigt um 2 %.', r'Er steigt um 12 %.', r'Er steigt um 20 Prozentpunkte.'],
    [r'Differenz der Prozentsätze: $12 - 10 = 2$ Prozentpunkte.',
     r'Bezogen auf den alten Wert: $\dfrac{2}{10} = 20$ %'])

Q.q(r'In einem Liniendiagramm liegen die Jahre 2000, 2010, 2020, 2021, 2022, 2023 gleich weit auseinander. Was ist daran irreführend?',
    [r'Die Zeitabstände sind verschieden, der Verlauf wirkt verzerrt.', r'Nichts.', r'Liniendiagramme dürfen keine Jahre zeigen.', r'Es fehlen Farben.'],
    [r'Zehn Jahre und ein Jahr nehmen gleich viel Platz ein.',
     r'Eine langsame Entwicklung kann so wie ein plötzlicher Sprung aussehen.'])

Q.q(r'In heißen Monaten werden mehr Eis verkauft und es gibt mehr Sonnenbrände. Folgt daraus, dass Eis Sonnenbrand verursacht?',
    [r'Nein, beides hängt am sonnigen Wetter; ein Zusammenhang ist keine Ursache.', r'Ja, das zeigen die Zahlen.',
     r'Ja, aber nur bei Schokoladeneis.', r'Nein, weil Eis kalt ist.'],
    [r'Beide Größen steigen gemeinsam mit einer dritten Größe, dem Sonnenschein.'])

Q.q(r'Ein Fragebogen enthält die Frage: „Finden Sie nicht auch, dass die Schule zu früh beginnt?“ Was ist das Problem?',
    [r'Die Frage ist suggestiv und lenkt die Antwort.', r'Die Frage ist zu kurz.', r'Man darf keine Fragen zur Schule stellen.', r'Es gibt kein Problem.'],
    [r'Neutral wäre: „Wie beurteilen Sie den Schulbeginn um 7:30 Uhr?“ mit festen Antwortmöglichkeiten.'])

Q.q(r'In einer Firma verdienen 9 Personen je 2500 € und die Chefin 25 000 €. Eine Werbung nennt „durchschnittlich 4750 €“. Welcher Wert beschreibt die Gehälter besser?',
    [r'der Zentralwert 2500 €', r'das arithmetische Mittel 4750 €', r'das Maximum 25 000 €', r'die Spannweite 22 500 €'],
    [r'Mittel: $\dfrac{9 \cdot 2500 + 25\,000}{10} = 4750$ €, durch einen Ausreißer verzerrt.',
     r'Der Zentralwert ist 2500 €, so viel verdienen die meisten.'])

Q.q(r'30 % von 250 befragten Personen einer Schule wollen eine Fahrrad-AG. Wie viele wären das an der ganzen Schule mit 800 Personen ungefähr?',
    [r'etwa 240', r'etwa 75', r'etwa 30', r'etwa 550'],
    [r'Hochrechnung: $0{,}3 \cdot 800 = 240$',
     r'Das setzt voraus, dass die Stichprobe die Schule gut abbildet.'])

Q.q(r'Eine Studie zur Gesundheit von Süßigkeiten wurde von einem Süßwarenhersteller bezahlt. Was sollte man beachten?',
    [r'Die Auftraggeber haben ein Interesse am Ergebnis, man sollte die Daten besonders kritisch prüfen.', r'Nichts, Studien sind immer neutral.',
     r'Die Studie ist automatisch falsch.', r'Man darf sie nicht lesen.'],
    [r'Medien sind Informationsquelle, aber auch Einflussfaktor.',
     r'Fragen: Wer hat erhoben? Wie? Wie viele wurden befragt?'])

Q.q(r'Was bewirkt ein schräg gestelltes 3D-Kreisdiagramm oft?',
    [r'Vordere Stücke wirken größer als gleich große hintere.', r'Alle Stücke wirken gleich.', r'Es wird genauer.', r'Es zeigt mehr Daten.'],
    [r'Durch die Perspektive werden vordere Teile größer gezeichnet.',
     r'Für ehrliche Vergleiche sind flache Diagramme besser.'])

Q.q(r'Welche Darstellung eignet sich, um die Anteile eines Ganzen zu zeigen, z. B. wie die Klasse zur Schule kommt?',
    [r'ein Kreisdiagramm', r'ein Liniendiagramm', r'eine Wertetabelle mit Formeln', r'ein Koordinatensystem mit Gerade'],
    [r'Das Kreisdiagramm zeigt, wie sich 100 % aufteilen.',
     r'Liniendiagramme zeigen Entwicklungen über die Zeit.'])


def check():
    from fractions import Fraction as F
    assert round((96 - 92) / 92 * 100, 1) == 4.3 and (96 - 90) / (92 - 90) == 3
    assert 2 * 2 == 4 and (2 - 1) / 1 == 1
    assert F(50, 10000) * 1000 == 5 and F(120, 60000) * 1000 == 2
    assert 45 + 30 + 30 == 105 and F(25, 100) * 360 == 90 and F(18, 100) * 360 == F('64.8')
    assert F(120, 400) == F(3, 10) and (24 - 2, 24 + 2) == (22, 26) and F(12 - 10, 10) == F(1, 5)
    assert (9 * 2500 + 25000) / 10 == 4750 and F(3, 10) * 800 == 240


Q.verify(check)
Q.save()
