#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 40 / KW 26: Jahresabschluss - Rueckblick in
Planreihenfolge und acht Knobeleien. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=40, slug='jahresabschluss', thema='Jahresabschluss', lb='Abschluss',
          blurb='Rückblick in Planreihenfolge und acht Knobeleien',
          comment='Blocks: Rueckblick in Planreihenfolge (1-12), Knobeleien und Spiele (13-20). Andere Raetsel als in Woche 17 und 33.')

# --------------------------------------------------- Rückblick in Planreihenfolge ----
Q.q(r'Multipliziere aus: $(x + 8)(x - 8)$.',
    [r'$x^2 - 64$', r'$x^2 + 64$', r'$x^2 - 16x - 64$', r'$x^2 - 64x$'],
    [r'Dritte binomische Formel.',
     r'$x^2 - 8^2 = x^2 - 64$',
     r'Probe mit $x = 9$: $17 \cdot 1 = 17$ und $81 - 64 = 17$.'])

Q.q(r'Löse: $4x + 7 = 2x + 19$.',
    [r'$x = 6$', r'$x = 4$', r'$x = 13$', r'$x = 3$'],
    [r'$2x$ abziehen: $2x + 7 = 19$.',
     r'$2x = 12$, also $x = 6$.',
     r'Probe: $24 + 7 = 31$ und $12 + 19 = 31$.'])

Q.q(r'Löse: $\dfrac{3}{x + 1} = 1$.',
    [r'$x = 2$', r'$x = 3$', r'$x = -2$', r'$x = 4$'],
    [r'Definitionsbereich: $x \neq -1$.',
     r'Mit $x+1$ multiplizieren: $3 = x + 1$.',
     r'$x = 2$. Probe: $\dfrac{3}{3} = 1$.'])

Q.q(r'Wie lautet die Gerade durch $P(0|-2)$ mit dem Anstieg $m = 5$?',
    [r'$y = 5x - 2$', r'$y = 5x + 2$', r'$y = -2x + 5$', r'$y = 5x$'],
    [r'Der Punkt liegt auf der $y$-Achse, also ist $n = -2$.',
     r'$y = 5x - 2$',
     r'Probe: $f(0) = -2$.'])

Q.q(r'Wo schneiden sich $y = 2x + 1$ und $y = -x + 10$?',
    [r'in $S(3|7)$', r'in $S(7|3)$', r'in $S(3|10)$', r'in $S(2|5)$'],
    [r'Gleichsetzen: $2x + 1 = -x + 10$.',
     r'$3x = 9$, also $x = 3$.',
     r'Einsetzen: $y = 7$.'])

Q.q(r'Löse: $x + 2y = 11$ und $x - y = 2$.',
    [r'$x = 5$, $y = 3$', r'$x = 3$, $y = 5$', r'$x = 7$, $y = 2$', r'$x = 4$, $y = 3{,}5$'],
    [r'Subtrahieren: $3y = 9$, also $y = 3$.',
     r'Einsetzen: $x - 3 = 2$, also $x = 5$.',
     r'Probe: $5 + 6 = 11$ stimmt.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = x^2 - 8x + 12$?',
    [r'in $(4|-4)$', r'in $(-4|-4)$', r'in $(4|4)$', r'in $(8|12)$'],
    [r'Quadratische Ergänzung: $x^2 - 8x + 16 - 16 + 12 = (x-4)^2 - 4$.',
     r'Also $x_S = 4$ und $y_S = -4$.',
     r'Probe: $y(4) = 16 - 32 + 12 = -4$.'])

Q.q(r'Wie lauten die Nullstellen von $y = x^2 - 8x + 12$?',
    [r'$x_1 = 2$ und $x_2 = 6$', r'$x_1 = -2$ und $x_2 = -6$',
     r'$x_1 = 3$ und $x_2 = 4$', r'$x_1 = 4$ und $x_2 = 8$'],
    [r'Vieta: Summe $8$, Produkt $12$.',
     r'Das sind $2$ und $6$.',
     r'Probe: $4 - 16 + 12 = 0$ und $36 - 48 + 12 = 0$.'])

Q.q(r'Wie lauten die Nullstellen von $f(x) = x^3 - 25x$?',
    [r'$x = 0$, $x = 5$ und $x = -5$', r'$x = 0$ und $x = 25$',
     r'$x = 5$ und $x = -5$', r'$x = 0$ und $x = 5$'],
    [r'$x$ ausklammern: $x\,(x^2 - 25) = 0$.',
     r'Dritte binomische Formel: $x\,(x-5)(x+5)$.',
     r'Nullstellen $0$, $5$ und $-5$.'])

Q.q(r'Wie groß ist beim Würfel die Wahrscheinlichkeit für „gerade Augenzahl UND größer als $3$“?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{3}$'],
    [r'Gerade: $\{2;\,4;\,6\}$. Größer als $3$: $\{4;\,5;\,6\}$.',
     r'Der Durchschnitt ist $\{4;\,6\}$, also zwei Ergebnisse.',
     r'$P = \dfrac{2}{6} = \dfrac{1}{3}$'])

Q.q(r'Eine Urne enthält $1$ rote und $3$ blaue Kugeln. Zweimal wird mit Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zweimal Rot?',
    [r'$\dfrac{1}{16}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{8}$', r'$\dfrac{9}{16}$'],
    [r'$P(\text{rot}) = \dfrac{1}{4}$ in beiden Zügen.',
     r'$P = \dfrac{1}{4} \cdot \dfrac{1}{4} = \dfrac{1}{16}$',
     r'Erste Pfadregel: längs des Pfades multiplizieren.'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für genau einmal Kopf?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$'],
    [r'$P = \binom{3}{1} \cdot \left(\dfrac{1}{2}\right)^3 = 3 \cdot \dfrac{1}{8}$',
     r'$= \dfrac{3}{8}$',
     r'Der Faktor $3$ steht für die drei möglichen Positionen des Kopfes.'])

# --------------------------------------------------------- Knobeleien und Spiele ----
Q.q(r'Beim Turm von Hanoi müssen $3$ Scheiben umgestapelt werden, immer nur eine und nie eine größere auf eine kleinere. Wie viele Züge braucht man mindestens?',
    [r'$7$', r'$6$', r'$8$', r'$3$'],
    [r'Für $n$ Scheiben braucht man $2^n - 1$ Züge.',
     r'$2^3 - 1 = 7$',
     r'Mit jeder zusätzlichen Scheibe verdoppelt sich der Aufwand fast — bei $64$ Scheiben dauerte es länger als das Alter des Weltalls.'])

Q.q(r'Auf wie viele Nullen endet $20!$?',
    [r'auf $4$ Nullen', r'auf $2$ Nullen', r'auf $5$ Nullen', r'auf $20$ Nullen'],
    [r'Jede Endnull braucht einen Faktor $5$ und einen Faktor $2$; Zweien gibt es reichlich.',
     r'Faktoren $5$ stecken in $5$, $10$, $15$ und $20$ — das sind vier.',
     r'Also vier Nullen. Erst ab $25$ käme eine fünfte dazu, weil $25 = 5 \cdot 5$ zwei Fünfen liefert.'])

Q.q(r'Der Erfinder des Schachspiels wünschte sich ein Weizenkorn auf dem ersten Feld, zwei auf dem zweiten, vier auf dem dritten und so weiter. Wie viele Körner sind das auf allen $64$ Feldern?',
    [r'$2^{64} - 1$, also rund $18$ Trillionen', r'$64^2$, also $4096$',
     r'$2 \cdot 64$, also $128$', r'$64!$'],
    [r'Die Summe $1 + 2 + 4 + \ldots + 2^{63}$ ist eine geometrische Summe.',
     r'Ihr Wert ist $2^{64} - 1 \approx 1{,}8 \cdot 10^{19}$.',
     r'Das ist mehr Weizen, als die Menschheit je geerntet hat — exponentielles Wachstum in Reinform.'])

Q.q(r'Die Summe der natürlichen Zahlen von $1$ bis $n$ beträgt $55$. Wie groß ist $n$?',
    [r'$n = 10$', r'$n = 11$', r'$n = 55$', r'$n = 9$'],
    [r'Die Summenformel lautet $\dfrac{n\,(n+1)}{2}$.',
     r'$\dfrac{n\,(n+1)}{2} = 55$ ergibt $n^2 + n - 110 = 0$.',
     r'Die positive Lösung ist $n = 10$. Probe: $\dfrac{10 \cdot 11}{2} = 55$.'])

Q.q(r'Was ist mehr: zwei Pizzen mit $20\,\mathrm{cm}$ Durchmesser oder eine mit $30\,\mathrm{cm}$?',
    [r'die eine große, sie hat rund $707\,\mathrm{cm^2}$ gegen rund $628\,\mathrm{cm^2}$',
     r'die beiden kleinen, sie haben zusammen mehr Fläche',
     r'beides gleich viel',
     r'das hängt von der Dicke ab'],
    [r'Fläche eines Kreises: $A = \pi r^2$.',
     r'Zwei kleine: $2 \cdot \pi \cdot 10^2 \approx 628\,\mathrm{cm^2}$. Eine große: $\pi \cdot 15^2 \approx 707\,\mathrm{cm^2}$.',
     r'Die Fläche wächst quadratisch mit dem Radius — deshalb gewinnt die große überraschend deutlich.'])

Q.q(r'Ein Blatt Papier ist $0{,}1\,\mathrm{mm}$ dick. Wie hoch wäre der Stapel, wenn man es $42$-mal falten könnte?',
    [r'weiter als bis zum Mond, rund $440\,000\,\mathrm{km}$', r'etwa $4{,}2\,\mathrm{mm}$',
     r'etwa $42\,\mathrm{m}$', r'etwa $4{,}2\,\mathrm{km}$'],
    [r'Jedes Falten verdoppelt die Dicke: $0{,}1\,\mathrm{mm} \cdot 2^{42}$.',
     r'$2^{42} \approx 4{,}4 \cdot 10^{12}$, also rund $4{,}4 \cdot 10^{11}\,\mathrm{mm}$.',
     r'Das sind etwa $440\,000\,\mathrm{km}$ — der Mond ist nur $384\,000\,\mathrm{km}$ entfernt.'])

Q.q(r'Beim Nim liegen zwei Häufchen mit $3$ und $5$ Hölzchen. Wer das letzte Hölzchen nimmt, gewinnt. Wie gewinnt der erste Spieler?',
    [r'Er nimmt zwei Hölzchen vom größeren Häufchen und spiegelt danach jeden Zug.',
     r'Er nimmt ein ganzes Häufchen weg.',
     r'Er nimmt ein einzelnes Hölzchen vom kleineren Häufchen.',
     r'Er kann bei bestem Gegenspiel nicht gewinnen.'],
    [r'Gleich große Häufchen sind für den, der am Zug ist, eine Verluststellung.',
     r'Der erste Spieler macht sie gleich: $5 - 2 = 3$.',
     r'Danach beantwortet er jeden Zug des Gegners auf dem anderen Häufchen genauso.'])

Q.q(r'Wie viele Quadrate enthält ein Brett von $4 \times 4$ Feldern insgesamt?',
    [r'$30$', r'$16$', r'$20$', r'$17$'],
    [r'Es zählen Quadrate jeder Größe.',
     r'$16$ der Größe $1 \times 1$, $9$ der Größe $2 \times 2$, $4$ der Größe $3 \times 3$, $1$ der Größe $4 \times 4$.',
     r'$16 + 9 + 4 + 1 = 30$ — es sind die Quadratzahlen rückwärts summiert.'])


def check():
    from math import comb, factorial as fa, pi
    from fractions import Fraction as F
    import sympy as sp
    x, y, n = sp.symbols('x y n')
    assert sp.expand((x + 8) * (x - 8)) == x ** 2 - 64 and (9 + 8) * (9 - 8) == 17 == 81 - 64
    assert sp.solve(sp.Eq(4 * x + 7, 2 * x + 19), x) == [6] and 4 * 6 + 7 == 31 == 2 * 6 + 19
    assert sp.solve(sp.Eq(3 / (x + 1), 1), x) == [2]
    assert (5 * x - 2).subs(x, 0) == -2
    assert sp.solve(sp.Eq(2 * x + 1, -x + 10), x) == [3] and (2 * x + 1).subs(x, 3) == 7
    assert sp.solve([x + 2 * y - 11, x - y - 2], [x, y], dict=True) == [{x: 5, y: 3}]
    p = x ** 2 - 8 * x + 12
    assert sp.expand((x - 4) ** 2 - 4) == p and p.subs(x, 4) == -4 and sp.solve(p, x) == [2, 6]
    assert sp.solve(x ** 3 - 25 * x, x) == [-5, 0, 5]
    assert {2, 4, 6} & {4, 5, 6} == {4, 6} and F(2, 6) == F(1, 3)
    assert F(1, 4) * F(1, 4) == F(1, 16)
    assert comb(3, 1) * F(1, 2) ** 3 == F(3, 8)
    # Knobeleien
    assert 2 ** 3 - 1 == 7
    assert str(fa(20)).endswith('0000') and not str(fa(20)).endswith('00000')
    assert sum(1 for k in (5, 10, 15, 20)) == 4
    assert 2 ** 64 - 1 == 18446744073709551615 and abs((2 ** 64 - 1) / 1e19 - 1.8) < 0.05
    assert sum(2 ** k for k in range(64)) == 2 ** 64 - 1
    assert sp.solve(n * (n + 1) / 2 - 55, n) == [-11, 10] and 10 * 11 // 2 == 55
    assert abs(2 * pi * 10 ** 2 - 628) < 1 and abs(pi * 15 ** 2 - 707) < 1
    assert pi * 15 ** 2 > 2 * pi * 10 ** 2
    hoehe_mm = 0.1 * 2 ** 42
    assert abs(hoehe_mm / 1e6 - 439804.65) < 1 and hoehe_mm / 1e6 > 384000
    assert abs(2 ** 42 / 1e12 - 4.4) < 0.05
    assert (3 ^ 5) != 0 and (3 ^ 3) == 0      # Nim: gleiche Haeufchen sind die Verluststellung
    assert 16 + 9 + 4 + 1 == 30


Q.verify(check)
Q.save()
