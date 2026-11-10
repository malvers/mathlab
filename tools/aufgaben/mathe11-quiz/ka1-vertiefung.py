#!/usr/bin/env python3
"""Aufgaben Mathe 11 (BGY), KW 46: Vertiefung zur Klassenarbeit 1.

Doc, 10.11.2026: extra tasks for the tasks of Klassenarbeit 1 that went worst -
two-stage trees with path and sum rule and the fairness proof (6a-c), fraction
equations with domain, check and solution set (7), mental arithmetic with the
binomial formulas and a general reason (9), growth factor with direction and the
half-life exponent t/T (2c, 8). New numbers, same structure, easy -> exam level.
Plan: HTML/svp/mathe/mathe11.html, week 11 (KW 46), material "Aufgaben 3 (20)".
Textaufgaben of the same week: tools/aufgaben/mathe11/ka1-vertiefung.py.

    python3 tools/aufgaben/mathe11-quiz/ka1-vertiefung.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from fractions import Fraction as F
from quiz import Quiz
from baum import zweistufig, spiel, paare, faces

Q = Quiz(id='mathe11-w11-ka1-vertiefung',
         file='mathetest11-ka1-vertiefung.html',
         title='Aufgaben · Vertiefung zur Klassenarbeit 1',
         subtitle='Berufliches Gymnasium · Klasse 11 · Woche 11, KW 46 · 20 Aufgaben: Baumdiagramm, '
                  'Pfad- und Summenregel, faire Spiele, Bruchgleichungen mit Definitionsbereich, '
                  'binomische Formeln, Halbwertszeit · genau eine Antwort pro Aufgabe',
         dash_sub='BGY · Klasse 11 · KW 46 · Vertiefung KA 1 · Live-Auswertung: anonyme Einzelscores '
                  '+ Gruppenleistung pro Aufgabe',
         back='svp/mathe/mathe11.html',
         comment='Blocks: Baum, Pfad- und Summenregel, Fairness (1-8), Bruchgleichungen (9-12), '
                 'binomische Formeln (13-16), Wachstumsfaktor und Halbwertszeit (17-20).')

ROT, BLAU = [1, 1, 1, 4, 4, 7], [3, 3, 3, 3, 5, 5]
GRUEN, GELB = [2, 2, 2, 6, 6, 6], [1, 4, 4, 4, 4, 7]
ZWEI = [2, 2, 2, 2, 5, 5]

# --------------------------------------------- trees, path and sum rule ----
Q.q(r'Ein Würfel trägt die Zahlen $3, 3, 3, 3, 5, 5$. Mit welcher Wahrscheinlichkeit liegt nach einem Wurf die $3$ oben?',
    [r'$\dfrac{2}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{6}$'],
    [r'$4$ der $6$ Flächen tragen eine $3$: $P(3) = \dfrac{4}{6} = \dfrac{2}{3}$',
     r'Falle: $\dfrac{1}{2}$, weil es nur zwei verschiedene Zahlen gibt. Es zählt, wie viele Flächen die Zahl tragen.'])

Q.q(r'Ein Würfel trägt die Zahlen $2, 2, 2, 2, 5, 5$ und wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für erst eine $2$, dann eine $5$?',
    [r'$\dfrac{2}{9}$', r'$\dfrac{1}{4}$', r'$\dfrac{4}{9}$', r'$\dfrac{1}{9}$'],
    [r'$P(2) = \dfrac{4}{6} = \dfrac{2}{3}$ und $P(5) = \dfrac{2}{6} = \dfrac{1}{3}$',
     r'Pfadregel, entlang des Pfades multiplizieren: $\dfrac{2}{3} \cdot \dfrac{1}{3} = \dfrac{2}{9}$',
     r'Falle: $\dfrac{1}{4}$ entsteht mit $\dfrac{1}{2}$ an jedem Ast.'])

Q.q(r'Derselbe Würfel ($2, 2, 2, 2, 5, 5$) wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme $7$?',
    [r'$\dfrac{4}{9}$', r'$\dfrac{2}{9}$', r'$\dfrac{5}{9}$', r'$\dfrac{2}{3}$'],
    [r'Die Augensumme $7$ gibt es auf zwei Pfaden: $(2 \mid 5)$ und $(5 \mid 2)$',
     r'Jeder der beiden Pfade: $\dfrac{2}{3} \cdot \dfrac{1}{3} = \dfrac{2}{9}$',
     r'Summenregel, die Pfade addieren: $\dfrac{2}{9} + \dfrac{2}{9} = \dfrac{4}{9}$',
     r'Falle: nur einen der beiden Pfade zählen ($\dfrac{2}{9}$).'])

Q.q(r'Grün würfelt mit $2, 2, 2, 6, 6, 6$, danach Gelb mit $1, 4, 4, 4, 4, 7$. Wer die größere Zahl hat, gewinnt. Welche Pfadwahrscheinlichkeit gehört an die Stelle des Fragezeichens?',
    [r'$\dfrac{1}{12}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{3}$', r'$\dfrac{2}{3}$'],
    [r'Pfadregel: $\dfrac{1}{2} \cdot \dfrac{1}{6} = \dfrac{1}{12}$',
     r'Kontrolle, alle Pfade zusammen ergeben $1$: $\dfrac{1}{12} + \dfrac{1}{3} + \dfrac{1}{12} + \dfrac{1}{12} + \dfrac{1}{3} + \dfrac{1}{12} = \dfrac{12}{12} = 1$'],
    fig=zweistufig(GRUEN, GELB, 'Grün', 'Gelb', col_a='#799E31', col_b='#F5C242', hide=5,
                   label='Baumdiagramm: erst Grün, dann Gelb, der letzte Pfad zeigt ein Fragezeichen'),
    figcap=r'Erst Grün, dann Gelb. Am Ende jedes Pfades steht die Pfadwahrscheinlichkeit.')

Q.q(r'Rot würfelt mit $1, 1, 1, 4, 4, 7$, danach Blau mit $3, 3, 3, 3, 5, 5$. Wie groß ist die Wahrscheinlichkeit für den Pfad „Rot $4$, Blau $3$“?',
    [r'$\dfrac{2}{9}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{9}$', r'$\dfrac{1}{3}$'],
    [r'Rot: $P(4) = \dfrac{2}{6} = \dfrac{1}{3}$. Blau: $P(3) = \dfrac{4}{6} = \dfrac{2}{3}$',
     r'Pfadregel: $\dfrac{1}{3} \cdot \dfrac{2}{3} = \dfrac{2}{9}$',
     r'Falle: $\dfrac{1}{6}$ entsteht, wenn man bei Blau $\dfrac{1}{2}$ statt $\dfrac{2}{3}$ nimmt.'])

Q.q(r'Rot würfelt mit $1, 1, 1, 4, 4, 7$, danach Blau mit $3, 3, 3, 3, 5, 5$. Wer die größere Zahl hat, gewinnt. Wie groß ist die Wahrscheinlichkeit, dass Rot gewinnt?',
    [r'$\dfrac{7}{18}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{11}{18}$'],
    [r'Rot gewinnt auf den Pfaden $(4 \mid 3)$, $(7 \mid 3)$ und $(7 \mid 5)$',
     r'$(4 \mid 3)$: $\dfrac{1}{3} \cdot \dfrac{2}{3} = \dfrac{4}{18}$, $(7 \mid 3)$: $\dfrac{1}{6} \cdot \dfrac{2}{3} = \dfrac{2}{18}$, $(7 \mid 5)$: $\dfrac{1}{6} \cdot \dfrac{1}{3} = \dfrac{1}{18}$',
     r'Summenregel: $P(\text{Rot}) = \dfrac{4}{18} + \dfrac{2}{18} + \dfrac{1}{18} = \dfrac{7}{18} \approx 38{,}9\,\%$',
     r'Falle: den Pfad $(7 \mid 5)$ vergessen ($\dfrac{6}{18} = \dfrac{1}{3}$). $\dfrac{11}{18}$ ist die Gewinnwahrscheinlichkeit von Blau.'])

Q.q(r'Im Spiel Rot ($1, 1, 1, 4, 4, 7$) gegen Blau ($3, 3, 3, 3, 5, 5$) darf Rot genau eine Fläche seines Würfels neu beschriften. Welcher Vorschlag macht das Spiel fair, sodass beide mit $\dfrac{1}{2}$ gewinnen?',
    [r'Eine $1$ wird zur $4$.', r'Eine $1$ wird zur $3$.', r'Eine $1$ wird zur $8$.', r'Die $7$ wird zur $8$.'],
    [r'Zählen über die $36$ gleich wahrscheinlichen Flächenpaare: Rot gewinnt bisher $14$ davon, fair wäre $18$',
     r'Eine $1$ schlägt nichts, als $4$ schlägt sie die vier $3$en: $14 + 4 = 18$',
     r'Nachweis mit dem neuen Baum: Rot $1, 1, 4, 4, 4, 7$, also $P(1) = \dfrac{1}{3}$, $P(4) = \dfrac{1}{2}$, $P(7) = \dfrac{1}{6}$',
     r'$P(\text{Rot}) = \dfrac{1}{2} \cdot \dfrac{2}{3} + \dfrac{1}{6} \cdot \dfrac{2}{3} + \dfrac{1}{6} \cdot \dfrac{1}{3} = \dfrac{6}{18} + \dfrac{2}{18} + \dfrac{1}{18} = \dfrac{1}{2}$',
     r'Keine Zahl steht auf beiden Würfeln, also kein Unentschieden und $P(\text{Blau}) = \dfrac{1}{2}$: fair',
     r'Falle: Die $3$ erzeugt Unentschieden, die $8$ ist zu viel ($20$ von $36$), die $7$ als $8$ ändert nichts.'])

Q.q(r'Grün würfelt mit $2, 2, 2, 6, 6, 6$, danach Gelb mit $1, 4, 4, 4, 4, 7$. Dieses Spiel ist fair. Nun schreibt Gelb seine $7$ in eine $6$ um. Was gilt jetzt?',
    [r'Nicht fair: Grün $\dfrac{1}{2}$, Gelb $\dfrac{5}{12}$, unentschieden $\dfrac{1}{12}$',
     r'Weiter fair: beide gewinnen mit $\dfrac{1}{2}$',
     r'Fair, weil jetzt beide eine $6$ haben',
     r'Nicht fair: Gelb gewinnt mit $\dfrac{7}{12}$'],
    [r'Vorher: $P(\text{Grün}) = \dfrac{1}{12} + \dfrac{1}{12} + \dfrac{1}{3} = \dfrac{1}{2}$ auf $(2 \mid 1)$, $(6 \mid 1)$, $(6 \mid 4)$',
     r'Neu ist der Pfad $(6 \mid 6)$ mit $\dfrac{1}{2} \cdot \dfrac{1}{6} = \dfrac{1}{12}$: unentschieden',
     r'Gelb gewinnt nur noch auf $(2 \mid 4)$ und $(2 \mid 6)$: $\dfrac{1}{3} + \dfrac{1}{12} = \dfrac{5}{12}$',
     r'Merke: Eine Zahl auf beiden Würfeln erzeugt Unentschieden, dann gewinnen nicht beide mit $\dfrac{1}{2}$.'])

# ------------------------------------------------------ fraction equations ----
Q.q(r'Gib den Definitionsbereich von $\dfrac{4}{x-3} + \dfrac{1}{x+5}$ an.',
    [r'$D = \mathbb{R} \setminus \{-5;\ 3\}$', r'$D = \mathbb{R} \setminus \{-3;\ 5\}$',
     r'$D = \mathbb{R} \setminus \{3;\ 5\}$', r'$D = \mathbb{R}$'],
    [r'Kein Nenner darf $0$ werden',
     r'$x - 3 = 0 \Rightarrow x = 3$ und $x + 5 = 0 \Rightarrow x = -5$',
     r'Also $D = \mathbb{R} \setminus \{-5;\ 3\}$'])

Q.q(r'Löse $\dfrac{3}{x-4} = \dfrac{5}{x+2}$.',
    [r'$L = \{13\}$', r'$L = \{-11\}$', r'$L = \{5\}$', r'$L = \{-7\}$'],
    [r'$D = \mathbb{R} \setminus \{-2;\ 4\}$',
     r'Mit beiden Nennern multiplizieren: $3(x+2) = 5(x-4)$',
     r'$3x + 6 = 5x - 20 \quad | -3x + 20$',
     r'$26 = 2x \Rightarrow x = 13$',
     r'$13 \in D$, also $L = \{13\}$. Probe: $\dfrac{3}{9} = \dfrac{1}{3}$ und $\dfrac{5}{15} = \dfrac{1}{3}$',
     r'Falle: $5(x-4) = 5x - 4$. Die $5$ gehört an beide Glieder der Klammer.'])

Q.q(r'Löse $\dfrac{2x}{x-1} = \dfrac{2}{x-1} + 1$.',
    [r'$L = \{\,\}$', r'$L = \{1\}$', r'$L = \{-1\}$', r'$L = \mathbb{R} \setminus \{1\}$'],
    [r'$D = \mathbb{R} \setminus \{1\}$',
     r'Mal $(x-1)$: $2x = 2 + (x - 1)$',
     r'$2x = x + 1 \Rightarrow x = 1$',
     r'$1 \notin D$, also $L = \{\,\}$: Die Gleichung hat keine Lösung',
     r'Genau dafür steht $D$ am Anfang. Ohne die Prüfung schreibt man $L = \{1\}$ und teilt durch $0$.'])

Q.q(r'Jemand löst $\dfrac{2}{x+1} = \dfrac{4}{x+3}$, rechnet richtig $x = 1$ aus und schreibt nur „$x = 1$“ hin. Was fehlt noch zur vollständigen Lösung?',
    [r'Der Definitionsbereich, die Prüfung $1 \in D$ und die Lösungsmenge $L = \{1\}$',
     r'Nichts, $x = 1$ ist die Lösung',
     r'Nur die Probe mit $x = 0$',
     r'Nur die Einheit'],
    [r'$D = \mathbb{R} \setminus \{-3;\ -1\}$',
     r'$2(x+3) = 4(x+1) \Rightarrow 2x + 6 = 4x + 4 \Rightarrow x = 1$',
     r'$1 \in D$, also $L = \{1\}$',
     r'Definitionsbereich, Prüfung und Lösungsmenge gehören zu jeder Bruchgleichung dazu.'])

# ------------------------------------------------------- binomial formulas ----
Q.q(r'Wie lautet die dritte binomische Formel?',
    [r'$(a+b)(a-b) = a^2 - b^2$', r'$(a-b)^2 = a^2 - 2ab + b^2$',
     r'$(a+b)^2 = a^2 + 2ab + b^2$', r'$(a+b)(a-b) = a^2 - 2ab - b^2$'],
    [r'Erste: $(a+b)^2 = a^2 + 2ab + b^2$',
     r'Zweite: $(a-b)^2 = a^2 - 2ab + b^2$',
     r'Dritte: $(a+b)(a-b) = a^2 - ab + ab - b^2 = a^2 - b^2$, die gemischten Glieder heben sich auf'])

Q.q(r'Berechne ohne Rechner: $41 \cdot 39$',
    [r'$1599$', r'$1601$', r'$1561$', r'$1681$'],
    [r'$41 \cdot 39 = (40 + 1)(40 - 1)$',
     r'Dritte binomische Formel: $40^2 - 1^2 = 1600 - 1 = 1599$',
     r'Falle: $1681 = 41^2$, und bei $1601$ ist das Minus zum Plus geworden.'])

Q.q(r'Berechne ohne Rechner: $99^2$',
    [r'$9801$', r'$9999$', r'$9800$', r'$9601$'],
    [r'$99^2 = (100 - 1)^2$',
     r'Zweite binomische Formel: $100^2 - 2 \cdot 100 \cdot 1 + 1^2$',
     r'$= 10\,000 - 200 + 1 = 9801$',
     r'Falle: $10\,000 - 1 = 9999$ vergisst das gemischte Glied $2ab$.'])

Q.q(r'Welche Begründung zeigt allgemein, dass $(n+3)(n-3)$ immer um $9$ kleiner ist als $n^2$?',
    [r'Dritte binomische Formel: $(n+3)(n-3) = n^2 - 3^2 = n^2 - 9$ für jedes $n$',
     r'Für $n = 10$ gilt $13 \cdot 7 = 91 = 100 - 9$, also immer',
     r'Zweite binomische Formel: $(n+3)(n-3) = n^2 - 6n + 9$',
     r'Weil $(n+3) + (n-3) = 2n$ ist'],
    [r'Allgemein heißt: mit der Variablen $n$ rechnen, nicht mit einem Beispiel',
     r'$(n+3)(n-3) = n^2 - 3n + 3n - 9 = n^2 - 9$, das ist die dritte binomische Formel',
     r'Ein Zahlenbeispiel zeigt nur einen einzigen Fall. Die Formel nennen und mit $n$ rechnen, dann ist es für jedes $n$ gezeigt.'])

# ------------------------------------------ growth factor and half-life ----
Q.q(r'Zu welcher prozentualen Änderung gehört der Wachstumsfaktor $q = 0{,}94$?',
    [r'Abnahme um $6\,\%$', r'Zunahme um $6\,\%$', r'Abnahme um $94\,\%$', r'Zunahme um $94\,\%$'],
    [r'$q < 1$, also eine Abnahme',
     r'$0{,}94 = 1 - 0{,}06$, also Abnahme um $6\,\%$',
     r'Die Richtung, Abnahme oder Zunahme, gehört zur Antwort. „$6\,\%$“ allein reicht nicht.'])

Q.q(r'Zu welcher prozentualen Änderung gehört der Wachstumsfaktor $q = 1{,}035$?',
    [r'Zunahme um $3{,}5\,\%$', r'Zunahme um $35\,\%$', r'Zunahme um $0{,}35\,\%$', r'Abnahme um $3{,}5\,\%$'],
    [r'$q > 1$, also eine Zunahme',
     r'$1{,}035 = 1 + 0{,}035$ und $0{,}035 = 3{,}5\,\%$'])

Q.q(r'Von $800$ mg eines Wirkstoffs ist nach jeweils $4$ Stunden nur noch die Hälfte im Körper. Welche Funktion beschreibt die Menge nach $t$ Stunden?',
    [r'$m(t) = 800 \cdot 0{,}5^{t/4}$', r'$m(t) = 800 \cdot 0{,}5^{4t}$',
     r'$m(t) = 800 \cdot 0{,}5^{t}$', r'$m(t) = 800 \cdot 0{,}5^{1/4}$'],
    [r'Anfangswert $800$, Faktor $0{,}5$ pro Halbwertszeit',
     r'Nach $t$ Stunden sind $\dfrac{t}{4}$ Halbwertszeiten vergangen, das ist der Exponent',
     r'Kontrolle: $m(4) = 800 \cdot 0{,}5^1 = 400$ und $m(8) = 800 \cdot 0{,}5^2 = 200$',
     r'Falle: $0{,}5^{t}$ halbiert jede Stunde, und $0{,}5^{1/4}$ hängt gar nicht von $t$ ab.'])

Q.q(r'Von $800$ mg eines Wirkstoffs ist nach jeweils $4$ Stunden nur noch die Hälfte im Körper. Wie viel ist nach $10$ Stunden noch da?',
    [r'$\approx 141{,}4$ mg', r'$200$ mg', r'$100$ mg', r'$\approx 0{,}78$ mg'],
    [r'$m(t) = 800 \cdot 0{,}5^{t/4}$',
     r'$m(10) = 800 \cdot 0{,}5^{10/4} = 800 \cdot 0{,}5^{2{,}5}$',
     r'$\approx 800 \cdot 0{,}1768 \approx 141{,}4$ mg (Taschenrechner)',
     r'Plausibel: zwischen $m(8) = 200$ und $m(12) = 100$',
     r'Falle: $800 \cdot 0{,}5^{10} \approx 0{,}78$ halbiert jede Stunde.'])


# ----------------------------------------------------------- numbers check ----
def check():
    # 1-3: one die thrown twice
    assert dict(faces(BLAU))[3] == F(2, 3)
    p = dict(faces(ZWEI))
    assert p[2] == F(2, 3) and p[5] == F(1, 3)
    assert p[2] * p[5] == F(2, 9) and F(1, 2) * F(1, 2) == F(1, 4)
    assert sum(p[x] * p[y] for x in p for y in p if x + y == 7) == F(4, 9)
    # 4: Gruen vs Gelb, last path (6|7)
    g, y = dict(faces(GRUEN)), dict(faces(GELB))
    paths = [g[a] * y[b] for a in sorted(g) for b in sorted(y)]
    assert paths == [F(1, 12), F(1, 3), F(1, 12), F(1, 12), F(1, 3), F(1, 12)] and sum(paths) == 1
    # 5-7: Rot vs Blau
    r, b = dict(faces(ROT)), dict(faces(BLAU))
    assert r[4] * b[3] == F(2, 9) and r[4] * F(1, 2) == F(1, 6)
    assert spiel(ROT, BLAU) == (F(7, 18), F(11, 18), 0)
    assert r[4] * b[3] == F(4, 18) and r[7] * b[3] == F(2, 18) and r[7] * b[5] == F(1, 18)
    assert F(6, 18) == F(1, 3) and abs(float(F(7, 18)) - 0.389) < 0.0005
    assert paare(ROT, BLAU) == (14, 22, 0)
    fair = [1, 1, 4, 4, 4, 7]
    assert spiel(fair, BLAU) == (F(1, 2), F(1, 2), 0) and paare(fair, BLAU) == (18, 18, 0)
    rf = dict(faces(fair))
    assert rf[1] == F(1, 3) and rf[4] == F(1, 2) and rf[7] == F(1, 6)
    assert rf[4] * b[3] + rf[7] * b[3] + rf[7] * b[5] == F(1, 2)
    assert rf[4] * b[3] == F(6, 18) and rf[7] * b[3] == F(2, 18) and rf[7] * b[5] == F(1, 18)
    assert spiel([1, 1, 3, 4, 4, 7], BLAU) != (F(1, 2), F(1, 2), 0)      # 3: ties
    assert paare([1, 1, 8, 4, 4, 7], BLAU)[0] == 20                         # 8: too much
    assert paare([1, 1, 1, 4, 4, 8], BLAU) == paare(ROT, BLAU)              # 7 -> 8: nothing
    # every one-face change of Rot that makes it fair puts a number between 3 and 5 on a 1
    for i in range(6):
        for x in range(0, 13):
            d = ROT[:]; d[i] = x
            if spiel(d, BLAU) == (F(1, 2), F(1, 2), 0):
                assert ROT[i] == 1 and x == 4
    # 8: Gelb's 7 becomes a 6
    assert spiel(GRUEN, GELB) == (F(1, 2), F(1, 2), 0)
    assert spiel(GRUEN, [1, 4, 4, 4, 4, 6]) == (F(1, 2), F(5, 12), F(1, 12))
    assert F(1, 3) + F(1, 12) == F(5, 12)
    # 9-12: fraction equations
    assert 3 - 3 == 0 and -5 + 5 == 0
    x = F(26, 2)
    assert x == 13 and 3 * (x + 2) == 5 * (x - 4) and F(3, 9) == F(5, 15) == F(1, 3)
    assert 3 * (-11 - 4) == 5 * (-11 + 2)          # wrong pairing
    assert 3 * 5 + 6 == 5 * 5 - 4                   # 5(x-4) = 5x-4
    assert 3 * -7 + 6 == 5 * -7 + 20                # sign slip
    # 2x/(x-1) = 2/(x-1) + 1 -> 2x = 2 + x - 1 -> x = 1, excluded
    assert 2 * 1 == 2 + (1 - 1)
    assert 2 * (1 + 3) == 4 * (1 + 1)
    # 13-16: binomial formulas
    assert 41 * 39 == 40**2 - 1 == 1599 and 41**2 == 1681
    assert 99**2 == 100**2 - 200 + 1 == 9801
    assert all((n + 3) * (n - 3) == n * n - 9 for n in range(-20, 21)) and 13 * 7 == 91
    # 17-20: growth factor and half-life
    assert abs(1 - 0.94 - 0.06) < 1e-12 and abs(1.035 - 1 - 0.035) < 1e-12
    m = lambda t: 800 * 0.5 ** (t / 4)
    assert m(4) == 400 and m(8) == 200 and m(12) == 100
    assert abs(0.5 ** 2.5 - 0.1768) < 0.00005 and abs(m(10) - 141.4) < 0.05
    assert abs(800 * 0.5 ** 10 - 0.78) < 0.005


Q.verify(check)
Q.save()
