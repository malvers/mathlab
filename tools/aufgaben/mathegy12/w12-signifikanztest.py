#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 12 (LB 6): Einseitige Signifikanztests für
binomialverteilte Zufallsgrößen - Nullhypothese, Testgröße, Signifikanzniveau, kritischer
Wert, Ablehnungsbereich, Entscheidungsregel. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
from math import comb

Q = gy12(nr=12, slug='signifikanztest', thema='Einseitige Signifikanztests', lb='LB 6',
         blurb='Nullhypothese, Signifikanzniveau, kritischer Wert, Ablehnungsbereich',
         comment='Blocks: Hypothese, Testgröße, Richtung (1-4, 19), Ablehnungsbereich rechtsseitig (5, 6, 9, 14-17), linksseitig (10), Entscheidung und Deutung (7, 8, 11-13, 18, 20). Mit CAS/Tabelle der kumulierten Binomialverteilung.')


def B(n, p, k):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def cdf(n, p, k):
    return sum(B(n, p, i) for i in range(0, k + 1))


def ge(n, p, k):
    return 1 - cdf(n, p, k - 1)


def fig_hist():
    n, p = 60, 1 / 6
    pl = S.Plot((-0.8, 26.8), (-0.004, 0.152), w=480, h=280)
    pl.axes(5, 0.05, xlabel="k", ylabel="P(X = k)", yticks=False)
    for k in range(0, 27):
        h = B(n, p, k)
        col = S.RED if k >= 16 else S.ORANGE
        pl.rect(pl.X(k - 0.4), pl.Y(h), pl.X(0.8) - pl.X(0), pl.Y(0) - pl.Y(h), fill=col, stroke=S.INK, width=0.6, opacity=0.8)
    return pl.svg("Histogramm der Binomialverteilung mit n = 60 und p = 1/6, Ablehnungsbereich ab k = 16 rot")


FIG = fig_hist()

Q.q(r'Ein Spieler vermutet, dass ein Würfel zu oft eine Sechs zeigt. Welche Nullhypothese prüft er?',
    [r'$H_0\colon p = \tfrac16$ (der Würfel ist in Ordnung)', r'$H_0\colon p > \tfrac16$', r'$H_0\colon p = \tfrac12$', r'$H_0\colon p = 0$'],
    [r'Die Nullhypothese beschreibt den Normalfall, den man widerlegen möchte.',
     r'Die Vermutung $p > \tfrac16$ ist die Gegenhypothese. Nur große Anzahlen von Sechsen sprechen gegen $H_0$: rechtsseitiger Test.'])

Q.q(r'Was ist beim Würfeltest die Testgröße?',
    [r'die Anzahl $X$ der Sechsen bei $n$ Würfen', r'die Augensumme aller Würfe', r'die Wahrscheinlichkeit $\tfrac16$', r'die Anzahl der Würfe $n$'],
    [r'Die Testgröße ist die Zufallsgröße, deren Wert man in der Stichprobe beobachtet.',
     r'Unter $H_0$ ist $X$ binomialverteilt mit $n$ und $p = \tfrac16$.'])

Q.q(r'Was bedeutet ein Signifikanzniveau von $\alpha = 5\,\%$?',
    [r'Die Wahrscheinlichkeit, $H_0$ abzulehnen, obwohl $H_0$ wahr ist, beträgt höchstens $5\,\%$.', r'$H_0$ ist mit $5\,\%$ Wahrscheinlichkeit wahr.', r'Der Test ist zu $5\,\%$ genau.', r'$5\,\%$ der Würfe zählen nicht.'],
    [r'Auch bei einem fairen Würfel fallen manchmal zufällig sehr viele Sechsen.',
     r'Den Ablehnungsbereich wählt man so, dass dieser Irrtum höchstens mit $\alpha$ passiert.'])

Q.q(r'Welche Form hat der Ablehnungsbereich eines rechtsseitigen Tests mit $n$ Versuchen?',
    [r'$K = \{k;\ k + 1;\ \ldots;\ n\}$', r'$K = \{0;\ 1;\ \ldots;\ k\}$', r'$K = \{k\}$', r'$K = \{0;\ n\}$'],
    [r'Gegen $H_0$ sprechen beim rechtsseitigen Test nur auffällig große Werte.',
     r'Der kleinste Wert $k$ im Ablehnungsbereich heißt kritischer Wert.'])

Q.q(r'Der Würfel wird $60$-mal geworfen, $H_0\colon p = \tfrac16$, rechtsseitig, $\alpha = 5\,\%$. Es gilt $P(X \ge 15) \approx 0{,}065$ und $P(X \ge 16) \approx 0{,}034$. Wie lautet der Ablehnungsbereich?',
    [r'$K = \{16;\ \ldots;\ 60\}$', r'$K = \{15;\ \ldots;\ 60\}$', r'$K = \{0;\ \ldots;\ 15\}$', r'$K = \{11;\ \ldots;\ 60\}$'],
    [r'Gesucht ist das kleinste $k$ mit $P(X \ge k) \le 0{,}05$.',
     r'$P(X \ge 15) > 0{,}05$, aber $P(X \ge 16) \le 0{,}05$: kritischer Wert $16$.'],
    fig=FIG, figcap='B(60; 1/6): rot der Ablehnungsbereich ab k = 16')

Q.q(r'Mit welcher Wahrscheinlichkeit lehnt man beim Test aus Aufgabe 5 einen fairen Würfel fälschlich ab?',
    [r'$\approx 3{,}4\,\%$', r'genau $5\,\%$', r'$\approx 6{,}5\,\%$', r'$0\,\%$'],
    [r'Fälschlich abgelehnt wird, wenn $X \in K$ obwohl $p = \tfrac16$.',
     r'$P(X \ge 16) \approx 0{,}034$. Das tatsächliche Niveau liegt unter $5\,\%$, weil $X$ nur ganze Werte annimmt.'])

Q.q(r'Bei $60$ Würfen fallen $14$ Sechsen. Wie entscheidet man mit dem Test aus Aufgabe 5?',
    [r'$H_0$ wird nicht abgelehnt.', r'$H_0$ wird abgelehnt.', r'Der Würfel ist bewiesen fair.', r'Man kann nicht entscheiden.'],
    [r'$14 \notin K = \{16;\ \ldots;\ 60\}$.',
     r'Die Abweichung vom Erwartungswert $10$ ist nicht auffällig genug. Bewiesen ist damit nichts.'])

Q.q(r'Bei $60$ Würfen fallen $18$ Sechsen. Wie entscheidet man mit dem Test aus Aufgabe 5?',
    [r'$H_0$ wird abgelehnt: Der Würfel zeigt vermutlich zu oft eine Sechs.', r'$H_0$ wird nicht abgelehnt.', r'$H_0$ ist sicher falsch.', r'Man muss noch $60$-mal würfeln.'],
    [r'$18 \in K$: Das Ergebnis wäre bei einem fairen Würfel sehr unwahrscheinlich.',
     r'Man lehnt $H_0$ ab, irrt sich dabei aber mit höchstens $5\,\%$ Wahrscheinlichkeit.'])

Q.q(r'Ein Medikament heilt bisher $60\,\%$. Ein neues soll besser sein. Getestet wird an $50$ Personen, $H_0\colon p = 0{,}6$, rechtsseitig, $\alpha = 5\,\%$. Mit $P(X \ge 36) \approx 0{,}054$ und $P(X \ge 37) \approx 0{,}028$: Ab wie vielen Heilungen spricht man von einem besseren Medikament?',
    [r'ab $37$', r'ab $36$', r'ab $30$', r'ab $31$'],
    [r'Kleinstes $k$ mit $P(X \ge k) \le 0{,}05$.',
     r'$k = 37$. Der Erwartungswert unter $H_0$ ist $30$; erst deutlich mehr Heilungen sind signifikant.'])

Q.q(r'Eine Partei behauptet, mindestens $40\,\%$ Zustimmung zu haben. Bei $100$ Befragten soll das linksseitig getestet werden, $\alpha = 5\,\%$. Es gilt $P(X \le 31) \approx 0{,}040$ und $P(X \le 32) \approx 0{,}062$. Wie lautet der Ablehnungsbereich?',
    [r'$K = \{0;\ \ldots;\ 31\}$', r'$K = \{0;\ \ldots;\ 32\}$', r'$K = \{31;\ \ldots;\ 100\}$', r'$K = \{0;\ \ldots;\ 40\}$'],
    [r'Gegen $H_0\colon p \ge 0{,}4$ sprechen nur auffällig kleine Werte.',
     r'Größtes $k$ mit $P(X \le k) \le 0{,}05$: $k = 31$.'])

Q.q(r'Wie formuliert man die Entscheidungsregel zum Test aus Aufgabe 10?',
    [r'Stimmen höchstens $31$ Befragte zu, wird $H_0$ abgelehnt, sonst nicht.', r'Stimmen mindestens $31$ zu, wird $H_0$ abgelehnt.', r'Stimmen genau $40$ zu, wird $H_0$ angenommen.', r'Stimmen weniger als $40$ zu, wird $H_0$ abgelehnt.'],
    [r'Die Regel nennt den Ablehnungsbereich und die Folge.',
     r'$35$ Zustimmungen etwa liegen unter $40$, sprechen aber noch nicht signifikant gegen die Behauptung.'])

Q.q(r'Was ist der kritische Wert eines Tests?',
    [r'die Grenze des Ablehnungsbereichs', r'der Erwartungswert unter $H_0$', r'das Signifikanzniveau', r'die Anzahl der Versuche'],
    [r'Beim rechtsseitigen Test ist es der kleinste, beim linksseitigen der größte Wert des Ablehnungsbereichs.',
     r'Im Würfeltest: $16$.'])

Q.q(r'Der Test lehnt $H_0$ nicht ab. Was folgt daraus?',
    [r'Die Daten sprechen nicht deutlich genug gegen $H_0$; bewiesen ist $H_0$ damit nicht.', r'$H_0$ ist bewiesen.', r'$H_0$ ist mit $95\,\%$ Wahrscheinlichkeit wahr.', r'Die Gegenhypothese ist falsch.'],
    [r'Ein Signifikanztest kann eine Hypothese nur mit begrenztem Irrtum verwerfen.',
     r'Nicht abgelehnt heißt nur: Das Ergebnis ist mit $H_0$ verträglich.'])

Q.q(r'Man verkleinert das Signifikanzniveau von $5\,\%$ auf $1\,\%$. Was passiert mit dem Ablehnungsbereich eines rechtsseitigen Tests?',
    [r'Er wird kleiner, der kritische Wert größer.', r'Er wird größer.', r'Er bleibt gleich.', r'Er verschiebt sich nach links.'],
    [r'Für $\alpha = 1\,\%$ muss das Ergebnis noch extremer sein.',
     r'Beim Medikament: kritischer Wert $39$ statt $37$.'])

Q.q(r'Beim Medikamententest mit $n = 50$, $H_0\colon p = 0{,}6$, $\alpha = 1\,\%$: Mit $P(X \ge 38) \approx 0{,}013$ und $P(X \ge 39) \approx 0{,}006$, wie lautet der Ablehnungsbereich?',
    [r'$K = \{39;\ \ldots;\ 50\}$', r'$K = \{38;\ \ldots;\ 50\}$', r'$K = \{37;\ \ldots;\ 50\}$', r'$K = \{0;\ \ldots;\ 39\}$'],
    [r'Kleinstes $k$ mit $P(X \ge k) \le 0{,}01$.',
     r'$P(X \ge 38) > 0{,}01$, $P(X \ge 39) \le 0{,}01$: $k = 39$.'])

Q.q(r'Eine Münze soll auf zu viel Zahl getestet werden: $n = 20$, $H_0\colon p = 0{,}5$, rechtsseitig, $\alpha = 5\,\%$. Mit $P(X \ge 14) \approx 0{,}058$ und $P(X \ge 15) \approx 0{,}021$: Wie lautet der Ablehnungsbereich?',
    [r'$K = \{15;\ \ldots;\ 20\}$', r'$K = \{14;\ \ldots;\ 20\}$', r'$K = \{11;\ \ldots;\ 20\}$', r'$K = \{0;\ \ldots;\ 5\}$'],
    [r'Kleinstes $k$ mit $P(X \ge k) \le 0{,}05$.',
     r'$k = 15$, tatsächliches Niveau etwa $2{,}1\,\%$.'])

Q.q(r'Wie berechnet man $P(X \ge k)$ mit einem Rechner, der nur $P(X \le k)$ kennt?',
    [r'$P(X \ge k) = 1 - P(X \le k - 1)$', r'$P(X \ge k) = 1 - P(X \le k)$', r'$P(X \ge k) = P(X \le n - k)$ immer', r'$P(X \ge k) = P(X \le k) - P(X = k)$'],
    [r'$X \ge k$ ist das Gegenereignis zu $X \le k - 1$.',
     r'Mit $1 - P(X \le k)$ fehlt die Wahrscheinlichkeit für genau $k$.'])

Q.q(r'Welchen Wert erwartet man beim Würfeltest ($n = 60$) für die Anzahl der Sechsen, wenn $H_0$ stimmt?',
    [r'$10$', r'$6$', r'$16$', r'$30$'],
    [r'Erwartungswert der Binomialverteilung: $\mu = n \cdot p = 60 \cdot \tfrac16$.',
     r'$= 10$. Der kritische Wert $16$ liegt deutlich darüber.'])

Q.q(r'Ein Hersteller befürchtet, dass seine Ausschussquote von $5\,\%$ gestiegen ist. Welcher Test passt?',
    [r'ein rechtsseitiger Test mit $H_0\colon p = 0{,}05$', r'ein linksseitiger Test mit $H_0\colon p = 0{,}05$', r'ein rechtsseitiger Test mit $H_0\colon p = 0{,}5$', r'gar kein Test'],
    [r'Gegen die Nullhypothese „unverändert“ sprechen viele defekte Teile.',
     r'Also große Werte von $X$: rechtsseitig.'])

Q.q(r'Beim Test der Partei (Aufgabe 10) stimmen $30$ von $100$ zu. Was ist die richtige Schlussfolgerung?',
    [r'$H_0$ wird abgelehnt; die Behauptung von mindestens $40\,\%$ ist auf dem $5\,\%$-Niveau widerlegt.', r'$H_0$ wird nicht abgelehnt.', r'Die Partei hat genau $30\,\%$.', r'Die Partei hat sicher weniger als $40\,\%$.'],
    [r'$30 \in K = \{0;\ \ldots;\ 31\}$.',
     r'Ablehnen heißt: Wäre $p \ge 0{,}4$, wäre ein so kleines Ergebnis sehr unwahrscheinlich. Sicher ist es trotzdem nicht.'])


def check():
    assert ge(60, 1/6, 16) <= 0.05 < ge(60, 1/6, 15) and abs(ge(60, 1/6, 15) - 0.065) < 0.0005 and abs(ge(60, 1/6, 16) - 0.034) < 0.0005
    assert 60 / 6 == 10
    assert ge(50, 0.6, 37) <= 0.05 < ge(50, 0.6, 36) and abs(ge(50, 0.6, 36) - 0.054) < 0.0005 and abs(ge(50, 0.6, 37) - 0.028) < 0.0005
    assert cdf(100, 0.4, 31) <= 0.05 < cdf(100, 0.4, 32) and abs(cdf(100, 0.4, 31) - 0.040) < 0.0005 and abs(cdf(100, 0.4, 32) - 0.062) < 0.0005
    assert ge(50, 0.6, 39) <= 0.01 < ge(50, 0.6, 38) and abs(ge(50, 0.6, 38) - 0.013) < 0.0005 and abs(ge(50, 0.6, 39) - 0.006) < 0.0005
    assert ge(20, 0.5, 15) <= 0.05 < ge(20, 0.5, 14) and abs(ge(20, 0.5, 14) - 0.058) < 0.0005 and abs(ge(20, 0.5, 15) - 0.021) < 0.0005
    assert 50 * 0.6 == 30


Q.verify(check)
Q.save()
