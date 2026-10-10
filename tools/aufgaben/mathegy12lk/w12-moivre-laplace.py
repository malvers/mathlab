#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 12 (LB 6): Zusammenhang zwischen Binomial- und Normalverteilung,
Näherung nach de Moivre und Laplace mit Faustregel und Stetigkeitskorrektur. Alle 20 Fragen neu.
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12lk
from math import comb, sqrt, pi, exp
from statistics import NormalDist

Q = gy12lk(nr=12, slug='moivre-laplace', thema='Binomial- und Normalverteilung', lb='LB 6',
           blurb='Glockenform der Histogramme, Näherung nach de Moivre und Laplace, Faustregel, Stetigkeitskorrektur',
           comment='Blocks: Histogramme und Kenngrößen (1-3, 16, 17), Faustregel (4, 5, 18), Stetigkeitskorrektur und Näherungen (6-10, 15), Sigma-Intervalle (11, 19), Geschichte und Galtonbrett (12, 13, 20), Standardisierung (14). Mit Hilfsmitteln.')

Q.q(r'Wie sehen die Histogramme von $B(n;\ p)$ für wachsendes $n$ aus?',
    [r'Sie nähern sich einer Glockenform.', r'Sie werden immer gleichmäßiger, alle Säulen gleich hoch.',
     r'Sie haben immer genau zwei Gipfel.', r'Sie fallen von links nach rechts ab.'],
    [r'Für großes $n$ ähneln die Histogramme der Glockenkurve der Normalverteilung, mit Mitte $\mu = np$.',
     r'Das ist der Inhalt des Satzes von de Moivre und Laplace; die Glocke wird mit wachsendem $n$ breiter und flacher.'])

Q.q(r'$X$ ist binomialverteilt mit $n = 100$ und $p = 0{,}5$. Welche Kenngrößen hat die passende Normalverteilung?',
    [r'$\mu = 50$, $\sigma = 5$', r'$\mu = 50$, $\sigma = 25$', r'$\mu = 50$, $\sigma = \sqrt{50}$', r'$\mu = 100$, $\sigma = 5$'],
    [r'$\mu = np = 50$, $\sigma = \sqrt{np(1 - p)} = \sqrt{25}$.',
     r'$\sigma = 5$; $25$ ist die Varianz.'])

Q.q(r'$X$ ist binomialverteilt mit $n = 200$ und $p = 0{,}3$. Wie groß ist $\sigma$?',
    [r'$\approx 6{,}48$', r'$42$', r'$\approx 7{,}75$', r'$\approx 4{,}58$'],
    [r'$\sigma = \sqrt{np(1 - p)} = \sqrt{200 \cdot 0{,}3 \cdot 0{,}7} = \sqrt{42}$.',
     r'$\approx 6{,}48$. $42$ ist die Varianz, $\sqrt{60}$ vergisst den Faktor $1 - p$.'])

Q.q(r'Welche Faustregel (Laplace-Bedingung) sagt, wann die Normalverteilung eine Binomialverteilung gut annähert?',
    [r'$\sigma = \sqrt{np(1 - p)} > 3$', r'$n > 30$', r'$p = 0{,}5$', r'$np > 1$'],
    [r'Die Glocke braucht genug Säulen in der Breite und darf nicht an den Rand $0$ oder $n$ stoßen.',
     r'Beides sichert $\sigma > 3$; dann liegen in $\mu \pm 3\sigma$ mindestens $19$ Werte von $X$.'])

Q.q(r'Ist die Näherung für $B(50;\ 0{,}1)$ nach der Faustregel geeignet?',
    [r'Nein, $\sigma \approx 2{,}12$ ist zu klein.', r'Ja, $n = 50 > 30$.', r'Ja, $\mu = 5 > 3$.', r'Nein, $p$ muss genau $0{,}5$ sein.'],
    [r'$\sigma = \sqrt{50 \cdot 0{,}1 \cdot 0{,}9} = \sqrt{4{,}5} \approx 2{,}12$.',
     r'$2{,}12 < 3$: Das Histogramm ist schief und stößt fast an $0$, die Glocke passt schlecht.'])

Q.q(r'$X \sim B(100;\ 0{,}5)$. Schätze $P(X \le 55)$ mit der Normalverteilung und Stetigkeitskorrektur.',
    [r'$\approx 0{,}864$', r'$\approx 0{,}841$', r'$\approx 0{,}816$', r'$\approx 0{,}136$'],
    [r'$\mu = 50$, $\sigma = 5$, Korrektur: bis $55{,}5$ integrieren, $P(X \le 55) \approx \Phi\!\left(\tfrac{55{,}5 - 50}{5}\right) = \Phi(1{,}1)$.',
     r'$\Phi(1{,}1) \approx 0{,}864$ (genau: $0{,}8644$). Ohne Korrektur gibt $\Phi(1) \approx 0{,}841$.'])

Q.q(r'Warum rechnet man bei der Stetigkeitskorrektur bis $k + 0{,}5$ statt bis $k$?',
    [r'Die Säule für den Wert $k$ reicht im Histogramm von $k - 0{,}5$ bis $k + 0{,}5$.',
     r'Damit das Ergebnis kleiner wird.', r'Weil $\Phi$ nur für halbe Zahlen definiert ist.', r'Weil die Glocke bei $0{,}5$ ihr Maximum hat.'],
    [r'Die Fläche der Säule zu $k$ ist $P(X = k)$, ihre Breite ist $1$, ihre Mitte $k$.',
     r'Wer $P(X \le k)$ als Fläche unter der Glocke nimmt, muss die ganze Säule mitnehmen, also bis $k + 0{,}5$.'])

Q.q(r'$X \sim B(100;\ 0{,}5)$. Schätze $P(45 \le X \le 55)$ mit Stetigkeitskorrektur.',
    [r'$\approx 0{,}729$', r'$\approx 0{,}683$', r'$\approx 0{,}632$', r'$\approx 0{,}864$'],
    [r'Von $44{,}5$ bis $55{,}5$: $\Phi(1{,}1) - \Phi(-1{,}1) = 2\,\Phi(1{,}1) - 1$.',
     r'$\approx 0{,}729$, genau $0{,}7287$. Ohne Korrektur käme die $1\sigma$-Regel mit $0{,}683$ heraus.'])

Q.q(r'$X \sim B(100;\ 0{,}5)$. Schätze $P(X = 50)$ mit der Dichte: $P(X = k) \approx \tfrac{1}{\sigma}\,\varphi\!\left(\tfrac{k - \mu}{\sigma}\right)$ mit $\varphi(z) = \tfrac{1}{\sqrt{2\pi}}\,\mathrm{e}^{-z^2/2}$.',
    [r'$\approx 0{,}080$', r'$0{,}5$', r'$\approx 0{,}399$', r'$\approx 0{,}010$'],
    [r'$\tfrac{1}{5}\,\varphi(0) = \tfrac{1}{5\sqrt{2\pi}}$.',
     r'$\approx 0{,}080$, genau $0{,}0796$. $0{,}399 = \varphi(0)$ vergisst den Faktor $\tfrac{1}{\sigma}$.'])

Q.q(r'Ein Würfel wird $600$-mal geworfen, $X$ zählt die Sechsen. Schätze $P(X \le 110)$ mit Stetigkeitskorrektur.',
    [r'$\approx 0{,}875$', r'$\approx 0{,}863$', r'$\approx 0{,}125$', r'$\approx 0{,}95$'],
    [r'$\mu = 100$, $\sigma = \sqrt{600 \cdot \tfrac16 \cdot \tfrac56} \approx 9{,}13$, $z = \tfrac{110{,}5 - 100}{9{,}13} \approx 1{,}15$.',
     r'$\Phi(1{,}15) \approx 0{,}875$. Ohne Korrektur, mit $z \approx 1{,}10$, käme $0{,}863$ heraus.'])

Q.q(r'Eine Münze wird $400$-mal geworfen. In welchem Intervall liegt die Anzahl der Wappen mit etwa $95\,\%$ Wahrscheinlichkeit?',
    [r'$[180;\ 220]$', r'$[190;\ 210]$', r'$[195;\ 205]$', r'$[160;\ 240]$'],
    [r'$\mu = 200$, $\sigma = \sqrt{400 \cdot 0{,}25} = 10$; die $2\sigma$-Umgebung enthält etwa $95\,\%$.',
     r'$[200 - 20;\ 200 + 20] = [180;\ 220]$. $[190;\ 210]$ ist nur die $1\sigma$-Umgebung mit etwa $68\,\%$.'])

Q.q(r'Wer zeigte 1733 als Erster, dass Binomialverteilungen mit $p = \tfrac12$ für großes $n$ einer Glockenkurve folgen?',
    [r'Abraham de Moivre', r'Carl Friedrich Gauß', r'Jakob Bernoulli', r'Blaise Pascal'],
    [r'Abraham de Moivre (1667–1754) verbreitete 1733 eine lateinische Schrift dazu; englisch steht sie in der zweiten Auflage seiner Doctrine of Chances von 1738.',
     r'Das ist das erste Auftreten des Normalverteilungsintegrals, lange vor Gauß (Quelle: A. de Moivre, The Doctrine of Chances, 2. Aufl., London 1738, S. 235–243).'])

Q.q(r'Was fügte Pierre-Simon Laplace der Entdeckung de Moivres hinzu?',
    [r'Er bewies die Näherung für jedes $p$ mit $0 < p < 1$.', r'Er erfand die Binomialkoeffizienten.',
     r'Er zeigte, dass die Näherung nur für $p = \tfrac12$ gilt.', r'Er schaffte die Stetigkeitskorrektur ab.'],
    [r'De Moivre hatte den symmetrischen Fall $p = \tfrac12$ behandelt.',
     r'Laplace verallgemeinerte auf beliebiges $p$ (Quelle: P. S. Laplace, Théorie analytique des probabilités, Paris 1812). Deshalb heißt der Satz nach beiden.'])

Q.q(r'$X \sim B(n;\ p)$. Gegen welche Verteilung strebt $Z = \dfrac{X - np}{\sqrt{np(1 - p)}}$ für $n \to \infty$?',
    [r'gegen die Standardnormalverteilung', r'gegen $B(n;\ 0{,}5)$', r'gegen die Gleichverteilung', r'gegen eine Verteilung, die nur den Wert $0$ annimmt'],
    [r'Abziehen von $np$ zentriert, Teilen durch $\sigma$ normiert die Breite.',
     r'Das standardisierte Histogramm (Säulenhöhen mal $\sigma$) nähert sich der Glocke $\varphi(z)$ mit $\mu = 0$, $\sigma = 1$.'])

Q.q(r'Bei einer Umfrage unter $1000$ Personen mit dem Anteil $p = 0{,}4$: Schätze $P(X \ge 430)$ mit Stetigkeitskorrektur.',
    [r'$\approx 2{,}8\,\%$', r'$\approx 2{,}6\,\%$', r'$\approx 97{,}2\,\%$', r'$\approx 5\,\%$'],
    [r'$\mu = 400$, $\sigma = \sqrt{240} \approx 15{,}49$. $P(X \ge 430) = 1 - P(X \le 429) \approx 1 - \Phi\!\left(\tfrac{429{,}5 - 400}{15{,}49}\right)$.',
     r'$1 - \Phi(1{,}90) \approx 0{,}028$. Ohne Korrektur gibt $z \approx 1{,}94$ etwa $2{,}6\,\%$.'])

Q.q(r'Bei festem $n = 100$: Für welches $p$ ist das Histogramm von $B(100;\ p)$ am symmetrischsten und die Näherung am besten?',
    [r'$p = 0{,}5$', r'$p = 0{,}1$', r'$p = 0{,}9$', r'$p = 0{,}01$'],
    [r'$\sigma = \sqrt{100\,p(1 - p)}$ ist für $p = 0{,}5$ am größten, nämlich $5$.',
     r'Für $p = 0{,}5$ ist das Histogramm genau symmetrisch zu $50$. Für $p = 0{,}01$ ist $\sigma \approx 0{,}99$, da passt keine Glocke.'])

Q.q(r'$X \sim B(n;\ 0{,}5)$. Wie ändert sich $\sigma$, wenn man $n$ vervierfacht?',
    [r'$\sigma$ verdoppelt sich.', r'$\sigma$ vervierfacht sich.', r'$\sigma$ bleibt gleich.', r'$\sigma$ halbiert sich.'],
    [r'$\sigma = \sqrt{n \cdot 0{,}25} = \tfrac12\sqrt{n}$ wächst mit $\sqrt{n}$.',
     r'$\sqrt{4n} = 2\sqrt{n}$: doppelte Breite der Glocke bei vierfacher Wurfzahl.'])

Q.q(r'Ab welchem $n$ ist $B(n;\ 0{,}2)$ nach der Faustregel $\sigma > 3$ gut durch eine Normalverteilung anzunähern?',
    [r'ab $n = 57$', r'ab $n = 45$', r'ab $n = 30$', r'ab $n = 100$'],
    [r'$\sqrt{n \cdot 0{,}2 \cdot 0{,}8} > 3$ heißt $0{,}16\,n > 9$, also $n > 56{,}25$.',
     r'Das kleinste solche $n$ ist $57$.'])

Q.q(r'Eine Münze wird $10\,000$-mal geworfen. In welchem Intervall liegt die relative Häufigkeit der Wappen mit etwa $95\,\%$ Wahrscheinlichkeit?',
    [r'$[0{,}49;\ 0{,}51]$', r'$[0{,}45;\ 0{,}55]$', r'$[0{,}499;\ 0{,}501]$', r'$[0{,}4;\ 0{,}6]$'],
    [r'Absolut: $\mu = 5000$, $\sigma = 50$, $2\sigma$-Umgebung $[4900;\ 5100]$.',
     r'Geteilt durch $10\,000$: $[0{,}49;\ 0{,}51]$. Mit wachsendem $n$ wird das Intervall der relativen Häufigkeit immer enger.'])

Q.q(r'In einem Galtonbrett mit $10$ Nagelreihen springt jede Kugel an jedem Nagel mit $50\,\%$ nach rechts. Wie ist die Nummer des Fachs verteilt, in dem sie landet?',
    [r'binomial mit $n = 10$, $p = 0{,}5$', r'gleichverteilt auf die $11$ Fächer', r'binomial mit $n = 11$, $p = 0{,}1$', r'normalverteilt mit $\mu = 0$, $\sigma = 1$'],
    [r'Die Fachnummer ist die Zahl der Rechtssprünge bei $10$ unabhängigen Versuchen mit $p = 0{,}5$.',
     r'Also $B(10;\ 0{,}5)$; die Kugelhaufen zeigen schon die Glocke. Francis Galton (1822–1911) baute das Brett, um genau das vorzuführen.'])


def check():
    Z = NormalDist()
    Phi = Z.cdf
    def binom_cdf(k, n, p):
        return sum(comb(n, i) * p**i * (1 - p)**(n - i) for i in range(0, k + 1))
    assert sqrt(100 * 0.25) == 5
    assert abs(sqrt(42) - 6.48) < 0.005 and abs(sqrt(60) - 7.75) < 0.005 and abs(sqrt(21) - 4.58) < 0.005
    assert abs(sqrt(50 * 0.1 * 0.9) - 2.12) < 0.005
    assert round(Phi(1.1), 3) == 0.864 and round(binom_cdf(55, 100, 0.5), 4) == 0.8644
    assert round(Phi(1.0), 3) == 0.841 and round(Phi(0.9), 3) == 0.816 and round(1 - Phi(1.1), 3) == 0.136
    assert round(2*Phi(1.1) - 1, 3) == 0.729 and round(binom_cdf(55, 100, 0.5) - binom_cdf(44, 100, 0.5), 4) == 0.7287
    assert round(2*Phi(0.9) - 1, 3) == 0.632
    assert round(1/(5*sqrt(2*pi)), 3) == 0.080 and round(comb(100, 50) / 2**100, 4) == 0.0796 and round(1/sqrt(2*pi), 3) == 0.399
    s6 = sqrt(600 / 6 * 5 / 6)
    assert round(s6, 2) == 9.13 and round((110.5 - 100) / s6, 2) == 1.15 and round(Phi((110.5 - 100) / s6), 3) == 0.875
    assert round((110 - 100) / s6, 2) == 1.10 and round(Phi((110 - 100) / s6), 3) == 0.863
    assert abs(binom_cdf(110, 600, 1/6) - 0.875) < 0.005
    assert sqrt(400 * 0.25) == 10
    s4 = sqrt(240)
    assert round(s4, 2) == 15.49 and round(1 - Phi((429.5 - 400) / s4), 3) == 0.028 and round(1 - Phi(30 / s4), 3) == 0.026
    assert abs((1 - binom_cdf(429, 1000, 0.4)) - 0.028) < 0.003
    assert all(sqrt(100*p*(1 - p)) < 5 for p in (0.1, 0.9, 0.01)) and abs(sqrt(100*0.01*0.99) - 0.99) < 0.005
    assert sqrt(4 * 0.25) == 2 * sqrt(0.25)
    assert sqrt(56 * 0.16) < 3 < sqrt(57 * 0.16)
    assert sqrt(10000 * 0.25) == 50 and (5000 - 100) / 10000 == 0.49
    assert abs(sum(comb(10, k) for k in range(11)) / 2**10 - 1) < 1e-12


Q.verify(check)
Q.save()
