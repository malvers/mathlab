#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 3 / KW 36 (LB 1): binomische Formeln, Potenzgesetze,
Prozentrechnung. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=3, slug='potenzen-prozent', thema='Binomische Formeln, Potenzen, Prozente', lb='LB 1',
          blurb='binomische Formeln vorwärts und rückwärts, Potenzgesetze, Prozentrechnung',
          comment='Blocks: binomische Formeln (1-6), Potenzgesetze (7-13), Prozentrechnung (14-20). Ohne Hilfsmittel.')

# ---------------------------------------------------- binomische Formeln ----
Q.q(r'Wie lautet die erste binomische Formel?',
    [r'$(a+b)^2 = a^2 + 2ab + b^2$', r'$(a+b)^2 = a^2 + b^2$',
     r'$(a+b)^2 = a^2 + ab + b^2$', r'$(a+b)^2 = 2a + 2b$'],
    [r'Ausmultiplizieren: $(a+b)(a+b) = a^2 + ab + ba + b^2$.',
     r'Die beiden mittleren Glieder sind gleich, zusammen $2ab$.',
     r'Probe mit $a = b = 1$: links $4$, rechts $1 + 2 + 1 = 4$.'])

Q.q(r'Multipliziere aus: $(x + 5)^2$.',
    [r'$x^2 + 10x + 25$', r'$x^2 + 25$', r'$x^2 + 5x + 25$', r'$x^2 + 10x + 10$'],
    [r'Erste binomische Formel mit $a = x$ und $b = 5$.',
     r'$x^2 + 2 \cdot x \cdot 5 + 5^2 = x^2 + 10x + 25$',
     r'Probe mit $x = 1$: $36$ und $1 + 10 + 25 = 36$.'])

Q.q(r'Multipliziere aus: $(x - 4)^2$.',
    [r'$x^2 - 8x + 16$', r'$x^2 - 16$', r'$x^2 - 8x - 16$', r'$x^2 + 8x + 16$'],
    [r'Zweite binomische Formel: $(a-b)^2 = a^2 - 2ab + b^2$.',
     r'$x^2 - 8x + 16$ — das letzte Glied ist positiv, denn $(-4)^2 = 16$.',
     r'Probe mit $x = 1$: $9$ und $1 - 8 + 16 = 9$.'])

Q.q(r'Multipliziere aus: $(x + 3)(x - 3)$.',
    [r'$x^2 - 9$', r'$x^2 + 9$', r'$x^2 - 6x - 9$', r'$x^2 - 6x + 9$'],
    [r'Dritte binomische Formel: $(a+b)(a-b) = a^2 - b^2$.',
     r'Die gemischten Glieder $-3x$ und $+3x$ heben sich auf.',
     r'$x^2 - 9$. Probe mit $x = 5$: $8 \cdot 2 = 16$ und $25 - 9 = 16$.'])

Q.q(r'Zerlege in Faktoren: $x^2 - 16$.',
    [r'$(x + 4)(x - 4)$', r'$(x - 4)^2$', r'$(x + 4)^2$', r'$(x - 16)(x + 1)$'],
    [r'Das ist die dritte binomische Formel rückwärts: $a^2 - b^2$ mit $a = x$ und $b = 4$.',
     r'$x^2 - 16 = (x+4)(x-4)$',
     r'Probe mit $x = 5$: $9$ und $9 \cdot 1 = 9$.'])

Q.q(r'Zerlege in Faktoren: $x^2 + 6x + 9$.',
    [r'$(x + 3)^2$', r'$(x - 3)^2$', r'$(x + 3)(x - 3)$', r'$(x + 9)(x + 1)$'],
    [r'Das letzte Glied ist $3^2$, das mittlere $2 \cdot x \cdot 3$.',
     r'Also erste binomische Formel rückwärts: $(x+3)^2$.',
     r'Probe mit $x = 1$: $1 + 6 + 9 = 16$ und $4^2 = 16$.'])

# -------------------------------------------------------- Potenzgesetze ----
Q.q(r'Vereinfache: $x^3 \cdot x^4$.',
    [r'$x^7$', r'$x^{12}$', r'$x^{34}$', r'$2x^7$'],
    [r'Potenzen mit gleicher Basis werden multipliziert, indem man die Exponenten addiert.',
     r'$x^3 \cdot x^4 = x^{3+4} = x^7$',
     r'Probe mit $x = 2$: $8 \cdot 16 = 128 = 2^7$.'])

Q.q(r'Vereinfache: $\dfrac{x^8}{x^3}$ für $x \neq 0$.',
    [r'$x^5$', r'$x^{11}$', r'$x^{\frac{8}{3}}$', r'$x^{24}$'],
    [r'Bei der Division mit gleicher Basis werden die Exponenten subtrahiert.',
     r'$x^{8-3} = x^5$',
     r'Probe mit $x = 2$: $\dfrac{256}{8} = 32 = 2^5$.'])

Q.q(r'Vereinfache: $\left(x^2\right)^5$.',
    [r'$x^{10}$', r'$x^7$', r'$x^{25}$', r'$2x^5$'],
    [r'Beim Potenzieren einer Potenz werden die Exponenten multipliziert.',
     r'$x^{2 \cdot 5} = x^{10}$',
     r'Probe mit $x = 2$: $4^5 = 1024 = 2^{10}$.'])

Q.q(r'Welchen Wert hat $x^0$ für $x \neq 0$?',
    [r'$1$', r'$0$', r'$x$', r'nicht definiert'],
    [r'Aus dem Divisionsgesetz folgt $\dfrac{x^n}{x^n} = x^{n-n} = x^0$.',
     r'Andererseits ist $\dfrac{x^n}{x^n} = 1$.',
     r'Also muss $x^0 = 1$ sein — für jede Basis außer null.'])

Q.q(r'Schreibe ohne negativen Exponenten: $x^{-3}$ für $x \neq 0$.',
    [r'$\dfrac{1}{x^3}$', r'$-x^3$', r'$-\dfrac{1}{x^3}$', r'$\dfrac{1}{3x}$'],
    [r'Ein negativer Exponent bedeutet Kehrwert, nicht negatives Vorzeichen.',
     r'$x^{-3} = \dfrac{1}{x^3}$',
     r'Probe mit $x = 2$: $2^{-3} = \dfrac{1}{8}$.'])

Q.q(r'Vereinfache: $(2x)^3$.',
    [r'$8x^3$', r'$2x^3$', r'$6x^3$', r'$8x$'],
    [r'Beim Potenzieren eines Produkts wird jeder Faktor potenziert.',
     r'$(2x)^3 = 2^3 \cdot x^3 = 8x^3$',
     r'Probe mit $x = 1$: $2^3 = 8$. Wer nur das $x$ potenziert, landet bei $2x^3$.'])

Q.q(r'Schreibe $\sqrt{x}$ als Potenz (für $x \geq 0$).',
    [r'$x^{\frac{1}{2}}$', r'$x^2$', r'$x^{-2}$', r'$\dfrac{x}{2}$'],
    [r'Eine Wurzel ist eine Potenz mit gebrochenem Exponenten.',
     r'$\sqrt{x} = x^{\frac{1}{2}}$',
     r'Probe über das Potenzgesetz: $x^{\frac{1}{2}} \cdot x^{\frac{1}{2}} = x^1 = x$ — genau das leistet die Wurzel.'])

# ------------------------------------------------------- Prozentrechnung ----
Q.q(r'Berechne $25\,\%$ von $80$ €.',
    [r'$20$ €', r'$25$ €', r'$16$ €', r'$320$ €'],
    [r'$25\,\% = \dfrac{1}{4}$',
     r'$\dfrac{80}{4} = 20$ €',
     r'Kontrolle: $20 \cdot 4 = 80$.'])

Q.q(r'Ein Artikel kostet $120$ € und wird um $15\,\%$ teurer. Was kostet er dann?',
    [r'$138$ €', r'$135$ €', r'$102$ €', r'$18$ €'],
    [r'Erhöhung um $15\,\%$ bedeutet Multiplikation mit dem Faktor $1{,}15$.',
     r'$120 \cdot 1{,}15 = 138$ €',
     r'Zur Kontrolle: der Zuschlag ist $120 \cdot 0{,}15 = 18$ €, und $120 + 18 = 138$ €.'])

Q.q(r'Ein Bestand wächst von $80$ auf $100$ Stück. Um wie viel Prozent ist er gewachsen?',
    [r'um $25\,\%$', r'um $20\,\%$', r'um $80\,\%$', r'um $125\,\%$'],
    [r'Der Zuwachs beträgt $20$ Stück, bezogen wird er auf den Anfangswert $80$.',
     r'$\dfrac{20}{80} = 0{,}25$, also $25\,\%$.',
     r'$20\,\%$ käme heraus, wenn man fälschlich auf den Endwert $100$ bezieht.'])

Q.q(r'Nach $20\,\%$ Rabatt kostet ein Gerät $64$ €. Wie hoch war der ursprüngliche Preis?',
    [r'$80$ €', r'$76{,}80$ €', r'$84$ €', r'$128$ €'],
    [r'Der Rabattpreis entspricht $80\,\%$ des alten Preises, also dem Faktor $0{,}8$.',
     r'$x \cdot 0{,}8 = 64$, also $x = \dfrac{64}{0{,}8} = 80$ €.',
     r'Probe: $80 \cdot 0{,}8 = 64$ €. Wer stattdessen $20\,\%$ auf $64$ € aufschlägt, erhält $76{,}80$ € — das ist falsch.'])

Q.q(r'Ein Nettopreis von $200$ € wird mit $19\,\%$ Umsatzsteuer belegt. Wie hoch ist der Bruttopreis?',
    [r'$238$ €', r'$219$ €', r'$162$ €', r'$380$ €'],
    [r'Brutto ist netto mal dem Faktor $1{,}19$.',
     r'$200 \cdot 1{,}19 = 238$ €',
     r'Die Steuer selbst beträgt $38$ €.'])

Q.q(r'Ein Preis wird zweimal hintereinander um je $10\,\%$ erhöht. Um wie viel Prozent ist er insgesamt gestiegen?',
    [r'um $21\,\%$', r'um $20\,\%$', r'um $100\,\%$', r'um $10\,\%$'],
    [r'Zwei Erhöhungen bedeuten zwei Faktoren: $1{,}1 \cdot 1{,}1 = 1{,}21$.',
     r'Das sind $121\,\%$ des Ausgangswertes, also ein Zuwachs von $21\,\%$.',
     r'Prozentsätze werden nicht addiert, ihre Faktoren werden multipliziert.'])

Q.q(r'Ein Preis wird erst um $20\,\%$ erhöht und danach um $20\,\%$ gesenkt. Wie steht er zum Ausgangspreis?',
    [r'Er liegt bei $96\,\%$, also $4\,\%$ darunter.', r'Er ist wieder genauso hoch wie am Anfang.',
     r'Er liegt bei $104\,\%$, also $4\,\%$ darüber.', r'Er liegt bei $80\,\%$ des Ausgangspreises.'],
    [r'Die Faktoren sind $1{,}2$ und $0{,}8$.',
     r'$1{,}2 \cdot 0{,}8 = 0{,}96$, also $96\,\%$.',
     r'Der Grund: die Senkung bezieht sich auf den bereits erhöhten Preis, also auf eine größere Grundmenge.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a, b = sp.symbols('x a b')
    # binomische Formeln
    assert sp.expand((a + b) ** 2) == a ** 2 + 2 * a * b + b ** 2 and (1 + 1) ** 2 == 4
    assert sp.expand((x + 5) ** 2) == x ** 2 + 10 * x + 25 and (1 + 5) ** 2 == 36 == 1 + 10 + 25
    assert sp.expand((x - 4) ** 2) == x ** 2 - 8 * x + 16 and (1 - 4) ** 2 == 9 == 1 - 8 + 16
    assert sp.expand((x + 3) * (x - 3)) == x ** 2 - 9 and (5 + 3) * (5 - 3) == 16 == 25 - 9
    assert sp.factor(x ** 2 - 16) == (x + 4) * (x - 4) and 5 ** 2 - 16 == 9 == (5 + 4) * (5 - 4)
    assert sp.factor(x ** 2 + 6 * x + 9) == (x + 3) ** 2 and 1 + 6 + 9 == 16 == 4 ** 2
    # Potenzgesetze
    assert sp.simplify(x ** 3 * x ** 4 - x ** 7) == 0 and 2 ** 3 * 2 ** 4 == 128 == 2 ** 7
    assert sp.simplify(x ** 8 / x ** 3 - x ** 5) == 0 and F(2 ** 8, 2 ** 3) == 32 == 2 ** 5
    assert sp.simplify((x ** 2) ** 5 - x ** 10) == 0 and 4 ** 5 == 1024 == 2 ** 10
    assert sp.Integer(5) ** 0 == 1 and F(2 ** 4, 2 ** 4) == 1
    assert sp.simplify(x ** -3 - 1 / x ** 3) == 0 and F(1, 2 ** 3) == F(1, 8)
    assert sp.expand((2 * x) ** 3) == 8 * x ** 3 and 2 ** 3 == 8
    assert sp.simplify(sp.sqrt(x) - x ** sp.Rational(1, 2)) == 0
    assert sp.simplify(x ** sp.Rational(1, 2) * x ** sp.Rational(1, 2) - x) == 0
    # Prozentrechnung
    assert F(25, 100) * 80 == 20 and F(80, 4) == 20 and 20 * 4 == 80
    assert 120 * F(115, 100) == 138 and 120 * F(15, 100) == 18 and 120 + 18 == 138
    assert F(100 - 80, 80) == F(1, 4) and F(20, 100) == F(1, 5)
    assert F(64, 1) / F(8, 10) == 80 and 80 * F(8, 10) == 64 and 64 * F(12, 10) == F(384, 5)
    assert abs(float(64 * F(12, 10)) - 76.8) < 1e-9
    assert 200 * F(119, 100) == 238 and 200 * F(19, 100) == 38 and 200 + 38 == 238
    assert F(11, 10) ** 2 == F(121, 100) and F(121, 100) - 1 == F(21, 100)
    assert F(12, 10) * F(8, 10) == F(96, 100) and 1 - F(96, 100) == F(4, 100)


Q.verify(check)
Q.save()
