#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 13 (LB 6): Zweiseitige Signifikanztests
für binomialverteilte Zufallsgrößen, statistische Sicherheit, Vergleich mit einseitigen
Tests, Deutung. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
from math import comb

Q = gy12(nr=13, slug='zweiseitige-tests', thema='Zweiseitige Tests und statistische Sicherheit', lb='LB 6',
         blurb='zweiseitiger Ablehnungsbereich, Niveau auf beide Seiten, statistische Sicherheit',
         comment='Blocks: Wann zweiseitig (1, 2, 15, 16), Niveau aufteilen und Bereich bestimmen (3-7, 11, 12, 17), statistische Sicherheit und tatsächliches Niveau (8-10, 18), Entscheidung und Deutung (13, 14, 19, 20). Mit CAS/Tabelle.')


def B(n, p, k):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def cdf(n, p, k):
    return sum(B(n, p, i) for i in range(0, k + 1))


def ge(n, p, k):
    return 1 - cdf(n, p, k - 1)


def fig_two():
    n, p = 100, 0.5
    pl = S.Plot((25, 75), (-0.004, 0.09), w=480, h=260)
    pl.axes(10, 0.05, xlabel="k", ylabel="P(X = k)", yticks=False)
    for k in range(26, 75):
        h = B(n, p, k)
        col = S.RED if (k <= 39 or k >= 61) else S.ORANGE
        pl.rect(pl.X(k - 0.42), pl.Y(h), pl.X(0.84) - pl.X(0), pl.Y(0) - pl.Y(h), fill=col, stroke=S.INK, width=0.4, opacity=0.8)
    return pl.svg("Histogramm von B(100; 0,5), beidseitiger Ablehnungsbereich bis 39 und ab 61 rot")


FIG = fig_two()

Q.q(r'Eine Münze soll auf Fairness geprüft werden, ohne Vermutung über die Richtung. Welcher Test passt?',
    [r'ein zweiseitiger Test mit $H_0\colon p = 0{,}5$', r'ein rechtsseitiger Test mit $H_0\colon p = 0{,}5$', r'ein linksseitiger Test mit $H_0\colon p = 0{,}5$', r'ein Test mit $H_0\colon p \ne 0{,}5$'],
    [r'Gegen eine faire Münze sprechen auffällig viele und auffällig wenige Zahl-Würfe.',
     r'Darum liegt der Ablehnungsbereich auf beiden Seiten.'])

Q.q(r'Welche Form hat der Ablehnungsbereich eines zweiseitigen Tests?',
    [r'$K = \{0;\ \ldots;\ k_1\} \cup \{k_2;\ \ldots;\ n\}$', r'$K = \{k_1;\ \ldots;\ k_2\}$', r'$K = \{k_2;\ \ldots;\ n\}$', r'$K = \{\mu\}$'],
    [r'Zwei Teile: auffällig klein und auffällig groß.',
     r'Der Bereich dazwischen, um den Erwartungswert herum, ist der Annahmebereich.'])

Q.q(r'Wie teilt man bei einem zweiseitigen Test das Signifikanzniveau $\alpha = 5\,\%$ üblicherweise auf?',
    [r'je höchstens $2{,}5\,\%$ auf jede Seite', r'$5\,\%$ auf jede Seite', r'$5\,\%$ nur auf die größere Seite', r'je höchstens $10\,\%$ auf jede Seite'],
    [r'Beide Teile zusammen dürfen höchstens $\alpha$ ausmachen.',
     r'Symmetrisch: $P(X \le k_1) \le 0{,}025$ und $P(X \ge k_2) \le 0{,}025$.'])

Q.q(r'$n = 100$, $H_0\colon p = 0{,}5$, zweiseitig, $\alpha = 5\,\%$. Es gilt $P(X \le 39) \approx 0{,}018$ und $P(X \le 40) \approx 0{,}028$. Wo endet der linke Teil des Ablehnungsbereichs?',
    [r'bei $k_1 = 39$', r'bei $k_1 = 40$', r'bei $k_1 = 45$', r'bei $k_1 = 25$'],
    [r'Größtes $k_1$ mit $P(X \le k_1) \le 0{,}025$.',
     r'$P(X \le 40) > 0{,}025$, also $k_1 = 39$.'],
    fig=FIG, figcap='B(100; 0,5): rot der zweiseitige Ablehnungsbereich')

Q.q(r'Wie lautet der ganze Ablehnungsbereich zu Aufgabe 4? Die Verteilung ist symmetrisch zu $50$.',
    [r'$K = \{0;\ \ldots;\ 39\} \cup \{61;\ \ldots;\ 100\}$', r'$K = \{0;\ \ldots;\ 39\} \cup \{60;\ \ldots;\ 100\}$', r'$K = \{39;\ \ldots;\ 61\}$', r'$K = \{0;\ \ldots;\ 40\} \cup \{60;\ \ldots;\ 100\}$'],
    [r'Wegen $p = 0{,}5$ ist $P(X \ge 61) = P(X \le 39) \approx 0{,}018$.',
     r'Die Grenzen liegen symmetrisch: $50 - 11$ und $50 + 11$.'])

Q.q(r'Bei $100$ Würfen der Münze fällt $58$-mal Zahl. Wie entscheidet der Test aus Aufgabe 5?',
    [r'$H_0$ wird nicht abgelehnt.', r'$H_0$ wird abgelehnt.', r'Die Münze ist bewiesen unfair.', r'Man kann nicht entscheiden.'],
    [r'$58$ liegt im Annahmebereich $\{40;\ \ldots;\ 60\}$.',
     r'Eine Abweichung um $8$ vom Erwartungswert ist bei $100$ Würfen nicht auffällig.'])

Q.q(r'Bei $100$ Würfen fällt $63$-mal Zahl. Wie entscheidet der Test aus Aufgabe 5?',
    [r'$H_0$ wird abgelehnt: Die Münze ist vermutlich nicht fair.', r'$H_0$ wird nicht abgelehnt.', r'Die Münze zeigt sicher zu oft Zahl.', r'Der Test muss rechtsseitig wiederholt werden.'],
    [r'$63 \in \{61;\ \ldots;\ 100\}$.',
     r'Ablehnen mit höchstens $5\,\%$ Irrtumswahrscheinlichkeit.'])

Q.q(r'Was versteht man unter der statistischen Sicherheit eines Tests mit dem Signifikanzniveau $\alpha$?',
    [r'$1 - \alpha$: die Wahrscheinlichkeit, eine wahre Nullhypothese nicht abzulehnen', r'$\alpha$ selbst', r'die Wahrscheinlichkeit, dass $H_0$ wahr ist', r'die Größe der Stichprobe'],
    [r'Bei $\alpha = 5\,\%$ ist die statistische Sicherheit $95\,\%$.',
     r'So oft trifft man bei wahrer Nullhypothese die richtige Entscheidung.'])

Q.q(r'Wie groß ist das tatsächliche Signifikanzniveau des Tests aus Aufgabe 5?',
    [r'$\approx 3{,}5\,\%$', r'genau $5\,\%$', r'$\approx 1{,}8\,\%$', r'$\approx 5{,}7\,\%$'],
    [r'$P(X \le 39) + P(X \ge 61) \approx 0{,}018 + 0{,}018$.',
     r'$\approx 0{,}035$. Wegen der ganzen Zahlen bleibt man unter den erlaubten $5\,\%$.'])

Q.q(r'Welche statistische Sicherheit hat der Test aus Aufgabe 5 tatsächlich?',
    [r'$\approx 96{,}5\,\%$', r'genau $95\,\%$', r'$\approx 98{,}2\,\%$', r'$\approx 3{,}5\,\%$'],
    [r'$1 - 0{,}035 = 0{,}965$.',
     r'Mindestens $95\,\%$ waren gefordert.'])

Q.q(r'$n = 50$, $H_0\colon p = 0{,}5$, zweiseitig, $\alpha = 5\,\%$. Es gilt $P(X \le 17) \approx 0{,}016$ und $P(X \le 18) \approx 0{,}032$. Wie lautet der Ablehnungsbereich?',
    [r'$K = \{0;\ \ldots;\ 17\} \cup \{33;\ \ldots;\ 50\}$', r'$K = \{0;\ \ldots;\ 18\} \cup \{32;\ \ldots;\ 50\}$', r'$K = \{17;\ \ldots;\ 33\}$', r'$K = \{0;\ \ldots;\ 17\} \cup \{32;\ \ldots;\ 50\}$'],
    [r'Links: größtes $k_1$ mit $P(X \le k_1) \le 0{,}025$, also $17$.',
     r'Rechts symmetrisch: $50 - 17 = 33$.'])

Q.q(r'Ein Würfel soll zweiseitig auf die Häufigkeit der Sechs getestet werden: $n = 120$, $\alpha = 10\,\%$. Es gilt $P(X \le 12) \approx 0{,}028$, $P(X \le 13) \approx 0{,}050$, $P(X \ge 28) \approx 0{,}037$, $P(X \ge 27) \approx 0{,}060$. Wie lautet der Ablehnungsbereich?',
    [r'$K = \{0;\ \ldots;\ 12\} \cup \{28;\ \ldots;\ 120\}$', r'$K = \{0;\ \ldots;\ 13\} \cup \{27;\ \ldots;\ 120\}$', r'$K = \{0;\ \ldots;\ 12\} \cup \{27;\ \ldots;\ 120\}$', r'$K = \{12;\ \ldots;\ 28\}$'],
    [r'Je Seite höchstens $5\,\%$: links $P(X \le 13)$ ist knapp über $0{,}05$, also $k_1 = 12$; rechts $P(X \ge 27) > 0{,}05$, also $k_2 = 28$.',
     r'Bei $p = \tfrac16$ ist die Verteilung nicht symmetrisch, man muss beide Seiten getrennt bestimmen.'])

Q.q(r'Was bedeutet „Das Ergebnis ist signifikant auf dem $5\,\%$-Niveau“?',
    [r'Bei wahrer Nullhypothese wäre ein so extremes Ergebnis höchstens mit $5\,\%$ Wahrscheinlichkeit aufgetreten.', r'Das Ergebnis ist zu $95\,\%$ richtig.', r'Die Gegenhypothese ist mit $95\,\%$ wahr.', r'Das Ergebnis ist wichtig.'],
    [r'Signifikant heißt hier nur: unvereinbar genug mit $H_0$.',
     r'Über die Wahrscheinlichkeit der Hypothesen selbst sagt der Test nichts.'])

Q.q(r'Ein Test lehnt $H_0$ ab. Kann man sich dabei irren?',
    [r'Ja, mit höchstens der Wahrscheinlichkeit $\alpha$, falls $H_0$ wahr ist.', r'Nein, ein abgelehntes $H_0$ ist sicher falsch.', r'Ja, immer mit genau $50\,\%$.', r'Nein, wenn $n$ groß genug ist.'],
    [r'Auch unter $H_0$ fallen manchmal Ergebnisse in den Ablehnungsbereich.',
     r'Diese Irrtumswahrscheinlichkeit begrenzt das Signifikanzniveau.'])

Q.q(r'Ein Schokoladenhersteller will prüfen, ob die Füllmaschine den Sollanteil von $20\,\%$ Nüssen einhält, zu viel und zu wenig wären schlecht. Welcher Test passt?',
    [r'zweiseitig mit $H_0\colon p = 0{,}2$', r'rechtsseitig mit $H_0\colon p = 0{,}2$', r'linksseitig mit $H_0\colon p = 0{,}2$', r'zweiseitig mit $H_0\colon p = 0{,}5$'],
    [r'Beide Abweichungen sollen auffallen.',
     r'Darum Ablehnungsbereich auf beiden Seiten von $\mu = 0{,}2\,n$.'])

Q.q(r'Ein Forscher vermutet nur, dass ein Anteil gestiegen ist. Warum ist dann ein einseitiger Test sinnvoller als ein zweiseitiger?',
    [r'Er konzentriert $\alpha$ auf die interessante Seite und erkennt eine Erhöhung leichter.', r'Weil einseitige Tests nie irren.', r'Weil zweiseitige Tests nur für $p = 0{,}5$ gelten.', r'Weil man dann weniger Daten braucht als null.'],
    [r'Beim einseitigen Test steht das ganze $\alpha$ auf einer Seite, der kritische Wert liegt näher am Erwartungswert.',
     r'Die Richtung muss aber vor dem Versuch feststehen, nicht nach einem Blick auf die Daten.'])

Q.q(r'Beim Münztest mit $n = 100$ und $\alpha = 5\,\%$: Rechtsseitig wäre der kritische Wert $59$, zweiseitig liegt der rechte Teil erst ab $61$. Warum?',
    [r'Zweiseitig stehen rechts nur $2{,}5\,\%$ zur Verfügung statt $5\,\%$.', r'Weil die Münze zweiseitig unfair ist.', r'Weil zweiseitige Tests $n$ verdoppeln.', r'Das ist ein Rechenfehler.'],
    [r'Weniger Irrtumswahrscheinlichkeit auf einer Seite heißt: Das Ergebnis muss dort extremer sein.',
     r'$P(X \ge 59) \approx 0{,}044 \le 0{,}05$, aber erst $P(X \ge 61) \approx 0{,}018 \le 0{,}025$.'])

Q.q(r'Man erhöht bei gleichem $\alpha$ den Stichprobenumfang. Was passiert mit dem Annahmebereich relativ zu $n$?',
    [r'Er wird relativ schmaler: Schon kleinere relative Abweichungen werden signifikant.', r'Er wird relativ breiter.', r'Er bleibt relativ gleich breit.', r'Er verschwindet.'],
    [r'Die Standardabweichung wächst nur mit $\sqrt n$, der Bereich in absoluten Zahlen also langsamer als $n$.',
     r'Darum fallen mit großen Stichproben auch kleine Unterschiede auf.'])

Q.q(r'Eine Umfrage mit $n = 100$ ergibt $45$ Zustimmungen. Der zweiseitige Test von $H_0\colon p = 0{,}5$ lehnt nicht ab. Welche Aussage ist richtig?',
    [r'Das Ergebnis ist mit $p = 0{,}5$ verträglich; ein Anteil unter $50\,\%$ ist nicht nachgewiesen.', r'Der Anteil ist genau $50\,\%$.', r'Der Anteil ist genau $45\,\%$.', r'Die Umfrage ist wertlos.'],
    [r'$45$ liegt im Annahmebereich $\{40;\ \ldots;\ 60\}$.',
     r'Nicht ablehnen ist kein Beweis für $H_0$; die Schätzung $\hat p = 0{,}45$ bleibt bestehen.'])

Q.q(r'Ein zweiseitiger Test auf $5\,\%$-Niveau lehnt ab. Hätte ein zweiseitiger Test auf $1\,\%$-Niveau mit denselben Daten auch abgelehnt?',
    [r'Nicht unbedingt: Der $1\,\%$-Ablehnungsbereich ist kleiner.', r'Ja, immer.', r'Nein, nie.', r'Nur, wenn $n$ gerade ist.'],
    [r'Ein kleineres $\alpha$ verlangt ein noch extremeres Ergebnis.',
     r'Ist das Ergebnis nur knapp im $5\,\%$-Bereich, liegt es im $1\,\%$-Annahmebereich.'])


def check():
    assert cdf(100, 0.5, 39) <= 0.025 < cdf(100, 0.5, 40) and abs(cdf(100, 0.5, 39) - 0.018) < 0.0005 and abs(cdf(100, 0.5, 40) - 0.028) < 0.0005
    assert abs(ge(100, 0.5, 61) - cdf(100, 0.5, 39)) < 1e-12
    a = cdf(100, 0.5, 39) + ge(100, 0.5, 61)
    assert abs(a - 0.035) < 0.0005 and abs((1 - a) - 0.965) < 0.0005
    assert cdf(50, 0.5, 17) <= 0.025 < cdf(50, 0.5, 18) and abs(cdf(50, 0.5, 17) - 0.016) < 0.0005 and abs(cdf(50, 0.5, 18) - 0.032) < 0.0005
    assert abs(ge(50, 0.5, 33) - cdf(50, 0.5, 17)) < 1e-12
    p = 1 / 6
    assert cdf(120, p, 12) <= 0.05 < cdf(120, p, 13) and ge(120, p, 28) <= 0.05 < ge(120, p, 27)
    assert abs(cdf(120, p, 12) - 0.028) < 0.0005 and abs(cdf(120, p, 13) - 0.050) < 0.0005
    assert abs(ge(120, p, 28) - 0.037) < 0.0005 and abs(ge(120, p, 27) - 0.060) < 0.0005
    assert ge(100, 0.5, 59) <= 0.05 < ge(100, 0.5, 58) and abs(ge(100, 0.5, 59) - 0.044) < 0.0005 and ge(100, 0.5, 61) <= 0.025 < ge(100, 0.5, 60)


Q.verify(check)
Q.save()
