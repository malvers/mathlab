#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 31 / KW 17 (LB 2): Bernoulli-Ketten -
Bernoulli-Experiment, Formel von Bernoulli, Anwendungen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=31, slug='bernoulli', thema='Bernoulli-Ketten', lb='LB 2',
          blurb='Bernoulli-Experiment, Formel von Bernoulli, genau k Treffer, mindestens ein Treffer',
          comment='Blocks: Bernoulli-Experiment (1-5), Formel von Bernoulli (6-11), Rechnen (12-17), Anwendungen (18-20).')

# ------------------------------------------------------- Bernoulli-Experiment ----
Q.q(r'Was kennzeichnet ein Bernoulli-Experiment?',
    [r'Es hat genau zwei mögliche Ausgänge, meist Treffer und Niete genannt.',
     r'Es hat genau sechs mögliche Ausgänge.',
     r'Es wird genau einmal durchgeführt.',
     r'Alle Ausgänge sind gleich wahrscheinlich.'],
    [r'Die beiden Ausgänge heißen Treffer und Niete oder Erfolg und Misserfolg.',
     r'Ihre Wahrscheinlichkeiten sind $p$ und $1 - p$.',
     r'Gleich wahrscheinlich müssen sie nicht sein, nur genau zwei an der Zahl.'])

Q.q(r'Welcher Versuch ist unmittelbar ein Bernoulli-Experiment?',
    [r'das Werfen einer Münze', r'das Werfen eines Würfels mit Blick auf die Augenzahl',
     r'das Ziehen einer Karte aus einem Skatblatt mit Blick auf die Farbe',
     r'das Messen einer Körpergröße'],
    [r'Die Münze hat genau zwei Ausgänge: Kopf und Zahl.',
     r'Beim Würfel sind es sechs, bei der Kartenfarbe vier.',
     r'Solche Versuche lassen sich aber leicht umdeuten, etwa in „Sechs“ und „keine Sechs“.'])

Q.q(r'Wie macht man aus dem Würfeln ein Bernoulli-Experiment?',
    [r'indem man nur zwischen „Sechs“ und „keine Sechs“ unterscheidet',
     r'indem man den Würfel zweimal wirft',
     r'indem man nur gerade Augenzahlen zulässt',
     r'gar nicht, das geht nicht'],
    [r'Man fasst die interessierenden Ergebnisse zum Treffer zusammen.',
     r'Alles übrige wird zur Niete.',
     r'Hier: $p = \dfrac{1}{6}$ und $1 - p = \dfrac{5}{6}$.'])

Q.q(r'Was ist eine Bernoulli-Kette der Länge $n$?',
    [r'die $n$-fache unabhängige Wiederholung eines Bernoulli-Experiments mit gleichbleibendem $p$',
     r'eine Folge von $n$ verschiedenen Zufallsversuchen',
     r'ein Versuch mit $n$ möglichen Ausgängen',
     r'die Aneinanderreihung von $n$ Baumdiagrammen'],
    [r'Derselbe Versuch wird $n$-mal durchgeführt.',
     r'Die Durchführungen beeinflussen sich nicht, und $p$ bleibt gleich.',
     r'Beides zusammen macht die Bernoulli-Kette aus.'])

Q.q(r'Welche Bedingung ist beim Ziehen aus einer Urne für eine Bernoulli-Kette nötig?',
    [r'Es muss mit Zurücklegen gezogen werden, damit $p$ gleich bleibt.',
     r'Es muss ohne Zurücklegen gezogen werden.',
     r'Die Urne muss gleich viele Kugeln jeder Farbe enthalten.',
     r'Es darf höchstens zweimal gezogen werden.'],
    [r'Ohne Zurücklegen ändert sich der Urneninhalt und damit $p$.',
     r'Die Züge wären dann weder unabhängig noch gleichwahrscheinlich.',
     r'Mit Zurücklegen bleibt $p$ konstant, die Voraussetzungen sind erfüllt.'])

# ---------------------------------------------------- Formel von Bernoulli ----
Q.q(r'Wie lautet die Formel von Bernoulli für genau $k$ Treffer bei $n$ Versuchen?',
    [r'$P(X = k) = \binom{n}{k}\,p^k\,(1-p)^{n-k}$',
     r'$P(X = k) = p^k\,(1-p)^{n-k}$',
     r'$P(X = k) = \binom{n}{k}\,p^k$',
     r'$P(X = k) = \binom{n}{k}\,p\,(1-p)$'],
    [r'$p^k$ steht für die $k$ Treffer, $(1-p)^{n-k}$ für die übrigen Nieten.',
     r'Der Binomialkoeffizient zählt, auf wie viele Arten sich die Treffer auf die $n$ Plätze verteilen.',
     r'Ohne ihn erhielte man nur die Wahrscheinlichkeit einer einzigen festen Reihenfolge.'])

Q.q(r'Wofür steht der Binomialkoeffizient in der Formel von Bernoulli?',
    [r'für die Anzahl der möglichen Reihenfolgen der $k$ Treffer',
     r'für die Wahrscheinlichkeit eines Treffers',
     r'für die Anzahl der Versuche',
     r'für die Wahrscheinlichkeit einer Niete'],
    [r'Bei $3$ Würfen und $2$ Treffern gibt es die Muster TTN, TNT und NTT.',
     r'Das sind $\binom{3}{2} = 3$ Möglichkeiten.',
     r'Jede hat dieselbe Wahrscheinlichkeit, deshalb wird einmal gerechnet und mit der Anzahl multipliziert.'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für genau zweimal Kopf?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{4}$', r'$\dfrac{2}{3}$'],
    [r'$n = 3$, $k = 2$, $p = \dfrac{1}{2}$.',
     r'$P = \binom{3}{2} \cdot \left(\dfrac{1}{2}\right)^2 \cdot \dfrac{1}{2} = 3 \cdot \dfrac{1}{8}$',
     r'$= \dfrac{3}{8}$. Der Faktor $3$ steht für die drei möglichen Reihenfolgen.'])

Q.q(r'Eine Münze wird viermal geworfen. Wie groß ist die Wahrscheinlichkeit für viermal Kopf?',
    [r'$\dfrac{1}{16}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{4}$', r'$\dfrac{4}{16}$'],
    [r'$P = \binom{4}{4} \cdot \left(\dfrac{1}{2}\right)^4 = 1 \cdot \dfrac{1}{16}$',
     r'$= \dfrac{1}{16}$',
     r'Für $k = n$ ist der Binomialkoeffizient $1$ — es gibt nur eine Reihenfolge.'])

Q.q(r'Ein Würfel wird fünfmal geworfen. Wie groß ist die Wahrscheinlichkeit für genau eine Sechs?',
    [r'$\dfrac{3125}{7776} \approx 0{,}402$', r'$\dfrac{1}{6} \approx 0{,}167$',
     r'$\dfrac{625}{7776} \approx 0{,}080$', r'$\dfrac{5}{6} \approx 0{,}833$'],
    [r'$n = 5$, $k = 1$, $p = \dfrac{1}{6}$.',
     r'$P = \binom{5}{1} \cdot \dfrac{1}{6} \cdot \left(\dfrac{5}{6}\right)^4 = 5 \cdot \dfrac{625}{7776}$',
     r'$= \dfrac{3125}{7776} \approx 0{,}402$. Ohne den Faktor $5$ käme nur eine feste Reihenfolge heraus.'])

Q.q(r'Bei einem Versuch mit $p = 0{,}2$ wird dreimal wiederholt. Wie groß ist die Wahrscheinlichkeit für keinen Treffer?',
    [r'$0{,}512$', r'$0{,}8$', r'$0{,}008$', r'$0{,}2$'],
    [r'$k = 0$, also $P = \binom{3}{0} \cdot 0{,}2^0 \cdot 0{,}8^3$.',
     r'$= 1 \cdot 1 \cdot 0{,}512 = 0{,}512$',
     r'Für $k = 0$ vereinfacht sich die Formel zu $(1-p)^n$.'])

# ------------------------------------------------------------------- Rechnen ----
Q.q(r'Eine Münze wird viermal geworfen. Wie groß ist die Wahrscheinlichkeit für genau zweimal Kopf?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{4}$', r'$\dfrac{6}{8}$'],
    [r'$P = \binom{4}{2} \cdot \left(\dfrac{1}{2}\right)^4 = 6 \cdot \dfrac{1}{16}$',
     r'$= \dfrac{6}{16} = \dfrac{3}{8}$',
     r'Zwei Treffer bei vier Würfen ist der wahrscheinlichste Einzelfall, aber keineswegs sicher.'])

Q.q(r'Bei einer Produktion sind $10\,\%$ der Teile fehlerhaft. Wie groß ist die Wahrscheinlichkeit, dass unter $10$ Teilen kein fehlerhaftes ist?',
    [r'etwa $0{,}349$', r'etwa $0{,}9$', r'etwa $0{,}1$', r'etwa $0{,}651$'],
    [r'$P(X = 0) = 0{,}9^{10}$',
     r'$\approx 0{,}349$',
     r'Also nur rund $35\,\%$ — bei zehn Teilen ist ein Fehler eher die Regel als die Ausnahme.'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit für mindestens ein fehlerhaftes Teil?',
    [r'etwa $0{,}651$', r'etwa $0{,}349$', r'$1$', r'etwa $0{,}1$'],
    [r'Gegenereignis zu „kein fehlerhaftes“.',
     r'$1 - 0{,}349 = 0{,}651$',
     r'Bei „mindestens einmal“ ist der Weg über $k = 0$ fast immer der kürzeste.'])

Q.q(r'Wie berechnet man bei einer Bernoulli-Kette die Wahrscheinlichkeit für mindestens einen Treffer?',
    [r'$1 - (1-p)^n$', r'$n \cdot p$', r'$\binom{n}{1}\,p\,(1-p)^{n-1}$', r'$p^n$'],
    [r'Mindestens ein Treffer ist das Gegenereignis zu „kein Treffer“.',
     r'$P(X = 0) = (1-p)^n$',
     r'Also $P(X \geq 1) = 1 - (1-p)^n$. $\binom{n}{1}\,p\,(1-p)^{n-1}$ wäre genau ein Treffer.'])

Q.q(r'Ein Würfel wird sechsmal geworfen. Wie groß ist die Wahrscheinlichkeit für sechsmal eine gerade Augenzahl?',
    [r'$\dfrac{1}{64}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{2}$', r'$\dfrac{6}{64}$'],
    [r'Gerade Augenzahl hat $p = \dfrac{1}{2}$.',
     r'$P = \left(\dfrac{1}{2}\right)^6 = \dfrac{1}{64}$',
     r'Der Binomialkoeffizient $\binom{6}{6}$ ist $1$.'])

Q.q(r'Bei $n$ Versuchen mit Trefferwahrscheinlichkeit $p$ — wie viele Treffer sind im Mittel zu erwarten?',
    [r'$n \cdot p$', r'$\dfrac{n}{p}$', r'$n + p$', r'$p^n$'],
    [r'Bei $10$ Würfen einer Münze erwartet man $5$-mal Kopf.',
     r'$10 \cdot 0{,}5 = 5$',
     r'Allgemein ist der Erwartungswert $n \cdot p$ — die tatsächliche Trefferzahl schwankt aber darum herum.'])

# ------------------------------------------------------------- Anwendungen ----
Q.q(r'Bei einem Test mit $5$ Fragen und je $4$ Antworten wird geraten. Wie groß ist die Wahrscheinlichkeit, genau zwei richtig zu haben?',
    [r'$\dfrac{135}{512} \approx 0{,}264$', r'$\dfrac{1}{16} \approx 0{,}063$',
     r'$\dfrac{9}{16} \approx 0{,}563$', r'$\dfrac{2}{5} = 0{,}4$'],
    [r'$n = 5$, $k = 2$, $p = \dfrac{1}{4}$.',
     r'$P = \binom{5}{2} \cdot \left(\dfrac{1}{4}\right)^2 \cdot \left(\dfrac{3}{4}\right)^3 = 10 \cdot \dfrac{1}{16} \cdot \dfrac{27}{64}$',
     r'$= \dfrac{270}{1024} = \dfrac{135}{512} \approx 0{,}264$'])

Q.q(r'Ein Bauteil fällt mit $5\,\%$ Wahrscheinlichkeit aus. Wie groß ist die Wahrscheinlichkeit, dass von $20$ Bauteilen keines ausfällt?',
    [r'etwa $0{,}358$', r'etwa $0{,}95$', r'etwa $0{,}642$', r'etwa $0{,}05$'],
    [r'$P(X = 0) = 0{,}95^{20}$',
     r'$\approx 0{,}358$',
     r'Also fällt mit rund $64\,\%$ mindestens eines aus — bei vielen Bauteilen summiert sich auch ein kleines Risiko.'])

Q.q(r'In einer Umfrage stimmen $30\,\%$ zu. Wie groß ist die Wahrscheinlichkeit, dass von $4$ zufällig Befragten genau eine Person zustimmt?',
    [r'$0{,}4116$', r'$0{,}3$', r'$0{,}2401$', r'$0{,}0081$'],
    [r'$n = 4$, $k = 1$, $p = 0{,}3$.',
     r'$P = \binom{4}{1} \cdot 0{,}3 \cdot 0{,}7^3 = 4 \cdot 0{,}3 \cdot 0{,}343$',
     r'$= 0{,}4116$. $0{,}2401$ wäre $0{,}7^4$, also niemand stimmt zu.'])


def check():
    from math import comb
    from fractions import Fraction as F
    B = lambda n, k, p: comb(n, k) * p ** k * (1 - p) ** (n - k)
    h = F(1, 2)
    assert B(3, 2, h) == F(3, 8) and comb(3, 2) == 3
    assert B(4, 4, h) == F(1, 16) and comb(4, 4) == 1
    assert B(5, 1, F(1, 6)) == F(3125, 7776) and abs(float(F(3125, 7776)) - 0.402) < 0.0005
    assert F(5, 6) ** 4 == F(625, 1296) and 5 * F(625, 7776) == F(3125, 7776)
    assert B(3, 0, F(2, 10)) == F(512, 1000) and F(8, 10) ** 3 == F(512, 1000)
    assert B(4, 2, h) == F(6, 16) == F(3, 8) and comb(4, 2) == 6
    assert abs(float(F(9, 10) ** 10) - 0.349) < 0.0005
    assert abs(float(1 - F(9, 10) ** 10) - 0.651) < 0.0005
    assert h ** 6 == F(1, 64)
    assert 10 * F(1, 2) == 5
    # Anwendungen
    assert B(5, 2, F(1, 4)) == F(135, 512) and abs(float(F(135, 512)) - 0.264) < 0.0005
    assert comb(5, 2) == 10 and F(3, 4) ** 3 == F(27, 64) and F(270, 1024) == F(135, 512)
    assert abs(float(F(95, 100) ** 20) - 0.358) < 0.0005
    assert abs(float(1 - F(95, 100) ** 20) - 0.642) < 0.0005
    assert B(4, 1, F(3, 10)) == F(4116, 10000) and F(7, 10) ** 3 == F(343, 1000)
    assert F(7, 10) ** 4 == F(2401, 10000)


Q.verify(check)
Q.save()
