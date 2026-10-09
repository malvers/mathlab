#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 33 / KW 19 (LB 4): Bernoulli experiment and chain, factorial,
binomial coefficient, deriving the single probability. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=33, slug='bernoulli', thema='Bernoulli-Ketten und Binomialkoeffizient', lb='LB 4',
         blurb='Bernoulli-Experiment, Bernoulli-Kette, Fakultät, Binomialkoeffizient',
         comment='Blocks: Bernoulli experiment and chain (1-5), factorial and binomial coefficient (6-12), single probabilities (13-20).')

# -------------------------------------------------- Bernoulli experiment and chain ----
Q.q(r'Was ist ein Bernoulli-Experiment?',
    [r'Ein Zufallsexperiment mit genau zwei Ergebnissen, Treffer und Niete.', r'Ein Experiment mit sechs gleich wahrscheinlichen Ergebnissen.',
     r'Ein Experiment, das immer einen Treffer liefert.', r'Ein Ziehen ohne Zurücklegen.'],
    [r'Treffer mit Wahrscheinlichkeit $p$, Niete mit $1 - p$.',
     r'Auch ein Würfel wird zum Bernoulli-Experiment, wenn nur „Sechs oder nicht“ zählt.'])

Q.q(r'Was ist eine Bernoulli-Kette der Länge $n$?',
    [r'$n$ unabhängige Wiederholungen eines Bernoulli-Experiments mit gleichem $p$.', r'$n$ verschiedene Experimente mit verschiedenen $p$.',
     r'Ein Experiment mit $n$ Ergebnissen.', r'$n$ Ziehungen ohne Zurücklegen.'],
    [r'Entscheidend: gleiche Trefferwahrscheinlichkeit und Unabhängigkeit der Stufen.'])

Q.q(r'Ist das Ziehen von 3 Kugeln ohne Zurücklegen aus einer Urne mit 3 roten und 2 blauen Kugeln eine Bernoulli-Kette?',
    [r'Nein, die Trefferwahrscheinlichkeit ändert sich von Zug zu Zug.', r'Ja, es gibt nur zwei Farben.', r'Ja, immer.', r'Nur wenn man auf Rot setzt.'],
    [r'Ohne Zurücklegen hängt jede Stufe von der vorigen ab.',
     r'Mit Zurücklegen wäre es eine Bernoulli-Kette mit $p = \dfrac{3}{5}$.'])

Q.q(r'5 % der Glühlampen einer Lieferung sind defekt. 10 werden zufällig geprüft. Welches Modell passt?',
    [r'Bernoulli-Kette mit $n = 10$ und $p = 0{,}05$', r'Bernoulli-Kette mit $n = 5$ und $p = 0{,}1$',
     r'Bernoulli-Kette mit $n = 10$ und $p = 0{,}95$ für „defekt“', r'Kein Zufallsexperiment'],
    [r'Treffer: „defekt“ mit $p = 0{,}05$; bei einer großen Lieferung sind die Prüfungen praktisch unabhängig.'])

Q.q(r'Ein Test hat 5 Fragen mit je 4 Antworten, eine davon richtig. Jemand rät. Welches $p$ hat ein Treffer?',
    [r'$p = \dfrac{1}{4}$', r'$p = \dfrac{1}{5}$', r'$p = \dfrac{3}{4}$', r'$p = \dfrac{1}{2}$'],
    [r'Eine von vier Antworten ist richtig.'])

# ------------------------------------------------ factorial and binomial coefficient ----
Q.q(r'Berechne $5!$.',
    [r'120', r'25', r'15', r'60'],
    [r'$5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$'])

Q.q(r'Welchen Wert hat $0!$?',
    [r'1', r'0', r'Nicht definiert', r'$\infty$'],
    [r'Man legt $0! = 1$ fest, damit Formeln wie $\binom{n}{0} = \dfrac{n!}{0! \cdot n!} = 1$ stimmen.'])

Q.q(r'Berechne $\dbinom{5}{2}$.',
    [r'10', r'20', r'5', r'2,5'],
    [r'$\dbinom{5}{2} = \dfrac{5!}{2! \cdot 3!} = \dfrac{5 \cdot 4}{2 \cdot 1}$'])

Q.q(r'Berechne $\dbinom{10}{3}$.',
    [r'120', r'30', r'720', r'210'],
    [r'$\dfrac{10 \cdot 9 \cdot 8}{3 \cdot 2 \cdot 1} = \dfrac{720}{6}$'])

Q.q(r'Berechne $\dbinom{20}{18}$.',
    [r'190', r'380', r'20', r'18'],
    [r'$\dbinom{n}{k} = \dbinom{n}{n - k}$, also $\dbinom{20}{18} = \dbinom{20}{2}$.',
     r'$\dfrac{20 \cdot 19}{2} = 190$'])

Q.q(r'Was zählt $\dbinom{6}{2}$ im Baumdiagramm einer Bernoulli-Kette der Länge 6?',
    [r'Die Pfade mit genau 2 Treffern, nämlich 15', r'Alle Pfade, nämlich 64', r'Die Pfade mit mindestens 2 Treffern', r'Die Stufen des Baums'],
    [r'Man wählt aus 6 Stufen die 2 Trefferstufen aus.',
     r'$\dbinom{6}{2} = 15$'])

Q.q(r'Aus 7 Personen wird ein Ausschuss von 3 Personen gewählt. Wie viele Möglichkeiten gibt es?',
    [r'35', r'210', r'21', r'343'],
    [r'Reihenfolge egal, ohne Wiederholung: $\dbinom{7}{3}$.',
     r'$\dfrac{7 \cdot 6 \cdot 5}{6} = 35$'])

# --------------------------------------------------------- single probabilities ----
Q.q(r'Welche Wahrscheinlichkeit hat EIN bestimmter Pfad mit $k$ Treffern in einer Bernoulli-Kette der Länge $n$?',
    [r'$p^k \cdot (1 - p)^{n - k}$', r'$\dbinom{n}{k} \cdot p^k$', r'$k \cdot p$', r'$p^n$'],
    [r'Längs des Pfades: $k$-mal $p$ und $(n - k)$-mal $1 - p$ multiplizieren.',
     r'Alle Pfade mit $k$ Treffern haben dieselbe Wahrscheinlichkeit.'])

Q.q(r'Warum steht in der Formel für $P(X = k)$ der Faktor $\dbinom{n}{k}$?',
    [r'Er zählt die Pfade mit genau $k$ Treffern; ihre Wahrscheinlichkeiten werden addiert.', r'Er macht die Formel symmetrisch.',
     r'Er ist ein Korrekturfaktor für das Runden.', r'Er gibt die Zahl der Nieten an.'],
    [r'2. Pfadregel: gleiche Pfadwahrscheinlichkeit mal Anzahl der Pfade.'])

Q.q(r'Ein Würfel wird dreimal geworfen. Wie wahrscheinlich sind genau zwei Sechsen?',
    [r'$\dfrac{5}{72}$', r'$\dfrac{1}{36}$', r'$\dfrac{5}{216}$', r'$\dfrac{1}{12}$'],
    [r'$\dbinom{3}{2} \cdot \left(\dfrac{1}{6}\right)^2 \cdot \dfrac{5}{6} = 3 \cdot \dfrac{5}{216}$',
     r'$= \dfrac{15}{216} = \dfrac{5}{72}$'])

Q.q(r'Eine Münze wird viermal geworfen. Wie wahrscheinlich ist genau zweimal Kopf?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{16}$'],
    [r'$\dbinom{4}{2} \cdot \left(\dfrac{1}{2}\right)^4 = \dfrac{6}{16}$'])

Q.q(r'Wie wahrscheinlich sind bei $p = 0{,}5$ vier Treffer in vier Versuchen?',
    [r'$\dfrac{1}{16}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{4}{16}$'],
    [r'Nur ein Pfad: $0{,}5^4 = \dfrac{1}{16}$.'])

Q.q(r'Der Test mit 5 Fragen wird geraten ($p = \dfrac{1}{4}$). Wie wahrscheinlich ist alles falsch?',
    [r'etwa 0,237', r'etwa 0,763', r'0,25', r'etwa 0,001'],
    [r'$\left(\dfrac{3}{4}\right)^5 = \dfrac{243}{1024} \approx 0{,}237$'])

Q.q(r'Wie wahrscheinlich ist beim Raten genau eine richtige Antwort?',
    [r'etwa 0,396', r'etwa 0,237', r'0,25', r'etwa 0,079'],
    [r'$\dbinom{5}{1} \cdot \dfrac{1}{4} \cdot \left(\dfrac{3}{4}\right)^4 = 5 \cdot \dfrac{81}{1024}$',
     r'$= \dfrac{405}{1024} \approx 0{,}396$'])

Q.q(r'Wie berechnet man $\dbinom{4}{2}$ mit dem Pascalschen Dreieck?',
    [r'Als Summe der beiden Zahlen darüber: $3 + 3 = 6$', r'Als Produkt $4 \cdot 2 = 8$', r'Als $4 - 2 = 2$', r'Als $\dfrac{4}{2} = 2$'],
    [r'Zeile 3 lautet 1, 3, 3, 1; Zeile 4 lautet 1, 4, 6, 4, 1.',
     r'$\dbinom{n}{k} = \dbinom{n - 1}{k - 1} + \dbinom{n - 1}{k}$'])


def check():
    from fractions import Fraction as F
    from math import comb, factorial
    assert factorial(5) == 120 and factorial(0) == 1
    assert comb(5, 2) == 10 and comb(10, 3) == 120 and comb(20, 18) == comb(20, 2) == 190
    assert comb(6, 2) == 15 and comb(7, 3) == 35
    assert comb(3, 2) * F(1, 6) ** 2 * F(5, 6) == F(5, 72)
    assert comb(4, 2) * F(1, 2) ** 4 == F(3, 8) and F(1, 2) ** 4 == F(1, 16)
    assert F(3, 4) ** 5 == F(243, 1024) and abs(float(F(243, 1024)) - 0.237) < 0.001
    assert comb(5, 1) * F(1, 4) * F(3, 4) ** 4 == F(405, 1024) and abs(float(F(405, 1024)) - 0.396) < 0.001
    assert comb(4, 2) == comb(3, 1) + comb(3, 2) == 6


Q.verify(check)
Q.save()
