#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 37 / KW 23 (LB 4): modelling with the binomial distribution (checking the
assumptions, germination rates, quality control) - 8 new questions; then mixed practice LB 3 and LB 4 with 12
questions from the Grundkurs sheets not used in the LK sheets before. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=37, slug='modellieren-binomial', thema='Modellieren mit der Binomialverteilung', lb='LB 4',
           blurb='Modellannahmen prüfen, Keimraten, Qualitätskontrolle, vermischte Übung zu LB 3 und LB 4',
           comment='Questions 1-8 new (modelling), 9-20 mixed practice from the Grundkurs sheets mathegy11/w26, w27, w28, w30, w31, w34, w35.')

mix = []
for name, pick in (('w34-binomialverteilung.py', [2, 3, 10, 11]), ('w35-kumuliert.py', [15, 17]), ('w31-mehrstufig.py', [14]),
                   ('w26-geraden.py', [16, 17]), ('w27-lage-geraden.py', [18]), ('w28-ebenen-parameterform.py', [10]),
                   ('w30-gerade-ebene.py', [16])):
    mix.append(harvest(name, pick))

# -------------------------------------------------------------- modelling ----
Q.q(r'Aus einer Lieferung von nur 20 Teilen werden 5 ohne Zurücklegen geprüft. Warum ist die Binomialverteilung hier nur eine grobe Näherung?',
    [r'Ohne Zurücklegen ändert sich die Fehlerquote von Zug zu Zug; bei 20 Teilen merklich.', r'Weil 5 Teile zu viele sind.',
     r'Weil defekte Teile nicht gezählt werden dürfen.', r'Sie ist exakt richtig.'],
    [r'Eine Bernoulli-Kette braucht eine konstante Trefferwahrscheinlichkeit und unabhängige Stufen.',
     r'Ist ein defektes Teil gezogen, sinkt der Anteil der defekten im Rest.'])

Q.q(r'Wann darf man Ziehen ohne Zurücklegen näherungsweise als Bernoulli-Kette rechnen?',
    [r'wenn die Gesamtzahl sehr groß gegenüber dem Stichprobenumfang ist', r'nie', r'nur bei genau zwei Kugeln', r'wenn $p = 0{,}5$ ist'],
    [r'Beispiel: 10 Teile aus einer Produktion von 100 000 Stück.',
     r'Die Trefferwahrscheinlichkeit ändert sich dann kaum.'])

Q.q(r'Bei einer Grippewelle werden 25 Schülerinnen und Schüler derselben Klasse auf Erkrankung untersucht. Warum passt die Binomialverteilung schlecht?',
    [r'Wegen Ansteckung sind die Erkrankungen nicht unabhängig.', r'Weil 25 eine ungerade Zahl ist.',
     r'Weil es mehr als zwei Ergebnisse gibt.', r'Sie passt perfekt.'],
    [r'Wer neben einer kranken Person sitzt, erkrankt eher.',
     r'Die Unabhängigkeit der Stufen ist verletzt.'])

Q.q(r'Saatgut keimt laut Packung mit 85 %. Es werden 20 Samen gesät. Wie viele Keimlinge erwartet man, und wie wahrscheinlich keimen alle?',
    [r'17; etwa 0,039', r'17; etwa 0,85', r'20; etwa 0,039', r'15; etwa 0,15'],
    [r'$E(X) = 20 \cdot 0{,}85 = 17$.',
     r'$P(X = 20) = 0{,}85^{20} \approx 0{,}039$'])

Q.q(r'Ein Gärtner braucht mindestens 18 Pflanzen und sät 20 Samen ($p = 0{,}85$). Wie wahrscheinlich reicht das?',
    [r'etwa 0,405', r'etwa 0,85', r'etwa 0,039', r'etwa 0,595'],
    [r'$P(X \geq 18) = P(X = 18) + P(X = 19) + P(X = 20)$.',
     r'$\approx 0{,}229 + 0{,}137 + 0{,}039$; sicherer wäre es, mehr Samen zu säen.'])

Q.q(r'Bei einer Produktion sind 5 % der Teile defekt. Eine Stichprobe von 50 Teilen wird abgelehnt, wenn mehr als 4 defekt sind. Wie wahrscheinlich wird eine solche Stichprobe abgelehnt?',
    [r'etwa 0,104', r'etwa 0,896', r'etwa 0,05', r'etwa 0,25'],
    [r'$P(X \geq 5) = 1 - P(X \leq 4)$ mit $n = 50$, $p = 0{,}05$.',
     r'Mit dem CAS: $P(X \leq 4) \approx 0{,}896$.'])

Q.q(r'Von 100 Samen ($p = 0{,}9$ laut Packung) keimen nur 75. Was spricht gegen die Angabe auf der Packung?',
    [r'Erwartet sind 90 mit $\sigma = 3$; 75 liegt 5 Standardabweichungen darunter und ist dann sehr unwahrscheinlich.', r'Nichts, Zufall ist Zufall.',
     r'75 ist mehr als erwartet.', r'Man darf nur 10 Samen prüfen.'],
    [r'$\sigma = \sqrt{100 \cdot 0{,}9 \cdot 0{,}1} = 3$.',
     r'Ob man die Angabe ablehnt, entscheidet man in Jahrgangsstufe 12 mit einem Signifikanztest.'])

Q.q(r'Bildung für nachhaltige Entwicklung: Warum testen Saatgutbetriebe die Keimrate an Stichproben, statt jedes Korn zu prüfen?',
    [r'Ein Keimtest verbraucht das Korn; aus der Stichprobe schätzt man die Rate der ganzen Partie.', r'Weil Körner nicht keimen können.',
     r'Weil jede Stichprobe genau die Packungsangabe liefert.', r'Weil das Gesetz es verbietet.'],
    [r'Der statistische Zugang: relative Häufigkeit in einer großen Stichprobe.',
     r'Je größer die Stichprobe, desto verlässlicher die Schätzung (Gesetz der großen Zahlen).'])

# --------------------------------------------------- mixed practice LB 3/4 ----
for qs, _ in mix:
    for a, k in qs:
        Q.q(*a, **k)


def check():
    from math import comb, sqrt
    for _, c in mix:
        c()
    B = lambda n, p, k: comb(n, k) * p ** k * (1 - p) ** (n - k)
    assert 20 * 0.85 == 17 and abs(0.85 ** 20 - 0.039) < 0.0005
    parts = [B(20, 0.85, k) for k in (18, 19, 20)]
    assert abs(sum(parts) - 0.405) < 0.0005 and [round(v, 3) for v in parts] == [0.229, 0.137, 0.039]
    low = sum(B(50, 0.05, k) for k in range(5))
    assert abs(low - 0.896) < 0.0005 and abs(1 - low - 0.104) < 0.0005
    assert abs(sqrt(100 * 0.9 * 0.1) - 3) < 1e-12 and (90 - 75) / 3 == 5


Q.verify(check)
Q.save()
