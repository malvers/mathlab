#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 32 / KW 18 (LB 4): counting - product rule, with and without order and
repetition, factorial, binomial coefficient, lottery. 13 new questions, 7 from the Grundkurs sheet mathegy11/w33.
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=32, slug='abzaehlen', thema='Abzählverfahren: Fakultät und Binomialkoeffizient', lb='LB 4',
           blurb='Produktregel, mit und ohne Reihenfolge, mit und ohne Wiederholung, Fakultät, Binomialkoeffizient, Lotto',
           comment='New counting questions; factorial and binomial coefficients from the Grundkurs sheet mathegy11/w33.')

qs, check_gk = harvest('w33-bernoulli.py', [5, 6, 7, 8, 9, 11, 19])
gk = dict(zip([5, 6, 7, 8, 9, 11, 19], qs))


def take(q):
    Q.q(*q[0], **q[1])


Q.q(r'Wie viele vierstellige Zahlencodes aus den Ziffern 0 bis 9 gibt es?',
    [r'10 000', r'5040', r'210', r'40'],
    [r'Produktregel: Für jede Stelle 10 Möglichkeiten.',
     r'$10 \cdot 10 \cdot 10 \cdot 10 = 10^4$ (mit Reihenfolge, mit Wiederholung)'])

Q.q(r'Jemand hat 3 Hosen, 4 Shirts und 2 Paar Schuhe. Wie viele verschiedene Outfits gibt es?',
    [r'24', r'9', r'12', r'48'],
    [r'Produktregel: $3 \cdot 4 \cdot 2$.'])

Q.q(r'Auf wie viele Arten lassen sich 6 verschiedene Bücher nebeneinander ins Regal stellen?',
    [r'720', r'36', r'120', r'46 656'],
    [r'Für den ersten Platz 6 Bücher, für den zweiten 5, …',
     r'$6! = 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 720$'])
take(gk[5])
take(gk[6])

Q.q(r'Bei einem Lauf mit 10 Teilnehmenden werden Gold, Silber und Bronze vergeben. Wie viele Siegerlisten sind möglich?',
    [r'720', r'120', r'1000', r'30'],
    [r'Mit Reihenfolge, ohne Wiederholung: $10 \cdot 9 \cdot 8$.',
     r'Ohne Reihenfolge wären es $\dbinom{10}{3} = 120$ Gruppen.'])

Q.q(r'Wie viele Passwörter aus genau 8 Kleinbuchstaben (26 Buchstaben, ohne Umlaute) gibt es?',
    [r'$26^8 \approx 2{,}1 \cdot 10^{11}$', r'$8^{26}$', r'$\dbinom{26}{8} \approx 1{,}6 \cdot 10^{6}$', r'$26 \cdot 8 = 208$'],
    [r'Mit Reihenfolge, mit Wiederholung: Für jede der 8 Stellen 26 Möglichkeiten.',
     r'Ein Rechner, der eine Milliarde Passwörter pro Sekunde probiert, braucht dafür höchstens etwa 3,5 Minuten.'])

Q.q(r'Ein Würfel wird dreimal geworfen und die Augenzahlen werden der Reihe nach notiert. Wie viele Ergebnisse gibt es?',
    [r'216', r'18', r'20', r'120'],
    [r'Mit Reihenfolge, mit Wiederholung: $6^3$.'])

Q.q(r'Welche Formel gilt für den Binomialkoeffizienten?',
    [r'$\dbinom{n}{k} = \dfrac{n!}{k! \cdot (n - k)!}$', r'$\dbinom{n}{k} = \dfrac{n!}{k!}$', r'$\dbinom{n}{k} = n^k$', r'$\dbinom{n}{k} = \dfrac{n}{k}$'],
    [r'$\dfrac{n!}{(n - k)!}$ zählt die geordneten Auswahlen.',
     r'Jede Auswahl von $k$ Elementen kommt dabei $k!$-mal vor, deshalb teilt man durch $k!$.'])
take(gk[7])
take(gk[8])
take(gk[9])
take(gk[11])

Q.q(r'Warum gilt $\dbinom{10}{7} = \dbinom{10}{3}$?',
    [r'Wer 7 auswählt, legt zugleich die 3 nicht Gewählten fest.', r'Weil $7 + 3 = 10$ zufällig passt.',
     r'Weil $7 \cdot 3 = 21$ ist.', r'Das stimmt nicht.'],
    [r'Allgemein: $\dbinom{n}{k} = \dbinom{n}{n - k}$.',
     r'Beide sind 120.'])

Q.q(r'Acht Personen begrüßen sich, jede mit jeder genau einmal per Handschlag. Wie viele Handschläge sind das?',
    [r'28', r'56', r'64', r'16'],
    [r'Jeder Handschlag ist eine Auswahl von 2 Personen ohne Reihenfolge.',
     r'$\dbinom{8}{2} = \dfrac{8 \cdot 7}{2} = 28$'])

Q.q(r'Wie viele verschiedene Wörter entstehen durch Umstellen der Buchstaben von ANNA?',
    [r'6', r'24', r'12', r'4'],
    [r'$4! = 24$ Anordnungen, aber Vertauschen der beiden A und der beiden N ändert nichts.',
     r'$\dfrac{4!}{2! \cdot 2!} = 6$'])

Q.q(r'Wie viele Möglichkeiten gibt es beim Lotto „6 aus 49“?',
    [r'$\dbinom{49}{6} = 13\,983\,816$', r'$49^6$', r'$49 \cdot 6 = 294$', r'$\dfrac{49!}{43!} \approx 10^{10}$'],
    [r'Ohne Reihenfolge, ohne Wiederholung.',
     r'Die Wahrscheinlichkeit für 6 Richtige ist also $\tfrac{1}{13\,983\,816} \approx 7{,}2 \cdot 10^{-8}$.'])

Q.q(r'Wie wahrscheinlich sind beim Lotto „6 aus 49“ genau 3 Richtige?',
    [r'$\dfrac{\binom{6}{3} \cdot \binom{43}{3}}{\binom{49}{6}} \approx 0{,}0177$', r'$\dfrac{\binom{6}{3}}{\binom{49}{6}}$', r'$\dfrac{3}{49}$', r'$\dfrac{1}{2}$'],
    [r'3 der 6 Gewinnzahlen und 3 der 43 Nieten werden gezogen.',
     r'$\dfrac{20 \cdot 12\,341}{13\,983\,816} \approx 0{,}0177$'])

Q.q(r'Wie viele Teilmengen hat eine Menge mit 5 Elementen?',
    [r'32', r'25', r'120', r'10'],
    [r'Jedes Element ist dabei oder nicht: $2^5$.',
     r'Ebenso: $\dbinom{5}{0} + \dbinom{5}{1} + \ldots + \dbinom{5}{5} = 32$, die Summe der fünften Zeile im Pascalschen Dreieck.'])
take(gk[19])


def check():
    from math import comb, factorial, perm
    check_gk()
    assert 10 ** 4 == 10000 and 3 * 4 * 2 == 24 and factorial(6) == 720 and perm(10, 3) == 720 and comb(10, 3) == 120
    assert 6 ** 3 == 216 and comb(10, 7) == comb(10, 3) and comb(8, 2) == 28
    assert factorial(4) // (factorial(2) * factorial(2)) == 6
    assert comb(49, 6) == 13983816 and abs(1 / comb(49, 6) - 7.2e-8) < 0.05e-8
    assert comb(43, 3) == 12341 and abs(comb(6, 3) * comb(43, 3) / comb(49, 6) - 0.0177) < 0.00005
    assert 2 ** 5 == sum(comb(5, k) for k in range(6)) == 32
    assert abs(26 ** 8 / 1e11 - 2.1) < 0.05 and abs(comb(26, 8) / 1e6 - 1.6) < 0.05 and abs(26 ** 8 / 1e9 / 60 - 3.5) < 0.05


Q.verify(check)
Q.save()
