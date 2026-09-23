#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 11 (LB 2): Grenzwerte - konvergente Zahlenfolgen
und das Verhalten ganzrationaler Funktionen im Unendlichen.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=11, slug='grenzwerte', thema='Grenzwerte', lb='LB 2',
          blurb='Zahlenfolgen, Konvergenz, Verhalten ganzrationaler Funktionen im Unendlichen',
          comment='Blocks: Zahlenfolgen (1-5), Grenzwert einer Folge (6-11), ganzrationale Funktionen im Unendlichen (12-17), Anwendungen (18-20). Alles ohne CAS.')

# ------------------------------------------------------------ Zahlenfolgen ----
Q.q(r'Die Folge ist durch $a_n = \dfrac{1}{n}$ gegeben. Wie lautet $a_4$?',
    [r'$\dfrac{1}{4}$', r'$4$', r'$\dfrac{1}{5}$', r'$0$'],
    [r'Für das vierte Glied wird $n = 4$ eingesetzt.',
     r'$a_4 = \dfrac{1}{4}$',
     r'Der Index $n$ zählt die Glieder, er ist nicht der Wert des Gliedes.'])

Q.q(r'Die Folge ist durch $a_n = \dfrac{n}{n+1}$ gegeben. Wie lautet $a_3$?',
    [r'$\dfrac{3}{4}$', r'$\dfrac{4}{3}$', r'$\dfrac{3}{5}$', r'$\dfrac{1}{4}$'],
    [r'$n = 3$ einsetzen: $a_3 = \dfrac{3}{3+1}$',
     r'$a_3 = \dfrac{3}{4}$'])

Q.q(r'Welche Folge ist eine geometrische Folge?',
    [r'$a_n = 3 \cdot \left(\dfrac{1}{2}\right)^n$', r'$a_n = 3n + 2$', r'$a_n = n^2$', r'$a_n = \dfrac{1}{n}$'],
    [r'Bei einer geometrischen Folge ist der Quotient zweier benachbarter Glieder konstant.',
     r'Hier gilt $\dfrac{a_{n+1}}{a_n} = \dfrac{1}{2}$ für jedes $n$.',
     r'$a_n = 3n + 2$ ist arithmetisch: dort ist die Differenz konstant, nicht der Quotient.'])

Q.q(r'Die ersten Glieder einer Folge lauten $2$, $6$, $18$, $54$. Wie lautet das nächste Glied?',
    [r'$162$', r'$108$', r'$72$', r'$216$'],
    [r'Jedes Glied ist das Dreifache des vorherigen: $6 = 3 \cdot 2$, $18 = 3 \cdot 6$, $54 = 3 \cdot 18$.',
     r'Also $3 \cdot 54 = 162$.',
     r'$108 = 2 \cdot 54$ wäre die Verdopplung — hier wird aber verdreifacht.'])

Q.q(r'Für welches $n$ wird das Glied der Folge $a_n = \dfrac{1}{n}$ erstmals kleiner als $0{,}01$?',
    [r'$n = 101$', r'$n = 100$', r'$n = 10$', r'$n = 99$'],
    [r'Gesucht ist das kleinste $n$ mit $\dfrac{1}{n} < 0{,}01$, also $n > 100$.',
     r'Für $n = 100$ ist $\dfrac{1}{100} = 0{,}01$ — das ist noch nicht kleiner.',
     r'Das erste Glied darunter ist $a_{101} = \dfrac{1}{101} \approx 0{,}0099$.'])

# ------------------------------------------------- Grenzwert einer Folge ----
Q.q(r'Bestimme $\lim\limits_{n \to \infty} \dfrac{1}{n}$.',
    [r'$0$', r'$1$', r'$\infty$', r'die Folge hat keinen Grenzwert'],
    [r'Je größer $n$ wird, desto kleiner wird $\dfrac{1}{n}$: $0{,}1$, $0{,}01$, $0{,}001$, …',
     r'Die Werte kommen der Null beliebig nahe, erreichen sie aber nie.',
     r'Also $\lim\limits_{n \to \infty} \dfrac{1}{n} = 0$; die Folge ist eine Nullfolge.'])

Q.q(r'Bestimme $\lim\limits_{n \to \infty} \dfrac{n}{n+1}$.',
    [r'$1$', r'$0$', r'$\infty$', r'$\dfrac{1}{2}$'],
    [r'Zähler und Nenner durch $n$ teilen: $\dfrac{n}{n+1} = \dfrac{1}{1 + \frac{1}{n}}$',
     r'Für $n \to \infty$ geht $\dfrac{1}{n}$ gegen $0$, der Nenner also gegen $1$.',
     r'Der Grenzwert ist $1$; die Glieder $\tfrac{1}{2}$, $\tfrac{2}{3}$, $\tfrac{3}{4}$, … wachsen von unten dagegen.'])

Q.q(r'Bestimme $\lim\limits_{n \to \infty} \left(\dfrac{1}{2}\right)^n$.',
    [r'$0$', r'$1$', r'$\dfrac{1}{2}$', r'$\infty$'],
    [r'Die Glieder sind $\tfrac{1}{2}$, $\tfrac{1}{4}$, $\tfrac{1}{8}$, $\tfrac{1}{16}$, …',
     r'Eine geometrische Folge $q^n$ ist für $|q| < 1$ eine Nullfolge.',
     r'Also ist der Grenzwert $0$.'])

Q.q(r'Welche Folge ist NICHT konvergent?',
    [r'$a_n = 2^n$', r'$a_n = \dfrac{5}{n}$', r'$a_n = 3 + \dfrac{1}{n^2}$', r'$a_n = \left(\dfrac{3}{4}\right)^n$'],
    [r'$a_n = 2^n$ wächst über jede Schranke hinaus: $2$, $4$, $8$, $16$, … — sie ist bestimmt divergent.',
     r'Die anderen drei haben Grenzwerte: $0$, $3$ und $0$.',
     r'Konvergent heißt: die Glieder nähern sich einer festen Zahl beliebig genau an.'])

Q.q(r'Bestimme $\lim\limits_{n \to \infty} \dfrac{3n + 1}{n}$.',
    [r'$3$', r'$4$', r'$0$', r'$\infty$'],
    [r'Term aufspalten: $\dfrac{3n+1}{n} = 3 + \dfrac{1}{n}$',
     r'Der zweite Summand geht gegen $0$.',
     r'Der Grenzwert ist $3$. Die $1$ im Zähler fällt gegen das wachsende $n$ nicht ins Gewicht.'])

Q.q(r'Bestimme $\lim\limits_{n \to \infty} \dfrac{2n^2 + 1}{n^2 + n}$.',
    [r'$2$', r'$0$', r'$\dfrac{1}{2}$', r'$\infty$'],
    [r'Zähler und Nenner durch die höchste Potenz $n^2$ teilen.',
     r'$\dfrac{2 + \frac{1}{n^2}}{1 + \frac{1}{n}} \to \dfrac{2 + 0}{1 + 0}$',
     r'Der Grenzwert ist $2$ — bei gleichem Grad entscheidet das Verhältnis der höchsten Koeffizienten.'])

# ------------------------------- ganzrationale Funktionen im Unendlichen ----
Q.q(r'Wie verhält sich $f(x) = x^3$ für $x \to +\infty$ und für $x \to -\infty$?',
    [r'$f(x) \to +\infty$ bzw. $f(x) \to -\infty$', r'beide Male $f(x) \to +\infty$',
     r'beide Male $f(x) \to -\infty$', r'$f(x) \to -\infty$ bzw. $f(x) \to +\infty$'],
    [r'Der Grad $3$ ist ungerade, der Leitkoeffizient $1$ ist positiv.',
     r'Für große positive $x$ ist $x^3$ groß und positiv, für große negative $x$ groß und negativ.',
     r'Probe: $f(10) = 1000$ und $f(-10) = -1000$.'])

Q.q(r'Wie verhält sich $f(x) = -2x^4$ für $x \to \pm\infty$?',
    [r'beide Male $f(x) \to -\infty$', r'beide Male $f(x) \to +\infty$',
     r'$f(x) \to +\infty$ bzw. $f(x) \to -\infty$', r'$f(x) \to 0$'],
    [r'Der Grad $4$ ist gerade, also liefern $x$ und $-x$ denselben Wert von $x^4$.',
     r'Der Leitkoeffizient $-2$ ist negativ, also kippt das Vorzeichen nach unten.',
     r'Probe: $f(10) = -20000$ und $f(-10) = -20000$.'])

Q.q(r'Welcher Term bestimmt das Verhalten von $f(x) = x^3 - 5x^2 + 2$ im Unendlichen?',
    [r'$x^3$', r'$-5x^2$', r'$2$', r'alle Terme gleich stark'],
    [r'Für sehr große $|x|$ wächst die höchste Potenz am schnellsten.',
     r'Bei $x = 100$ ist $x^3 = 1\,000\,000$, aber $-5x^2 = -50\,000$ — der kubische Term überwiegt deutlich.',
     r'Deshalb entscheidet allein der Term höchsten Grades über das Verhalten im Unendlichen.'])

Q.q(r'Wie verhält sich $f(x) = -x^3 + 4x$ für $x \to -\infty$?',
    [r'$f(x) \to +\infty$', r'$f(x) \to -\infty$', r'$f(x) \to 0$', r'$f(x) \to 4$'],
    [r'Der führende Term ist $-x^3$, der Grad ist ungerade und der Leitkoeffizient negativ.',
     r'Für $x \to -\infty$ ist $x^3 \to -\infty$, das Minus davor dreht das um.',
     r'Probe: $f(-10) = 1000 - 40 = 960$, und für noch kleinere $x$ wächst das weiter.'])

Q.q(r'Eine ganzrationale Funktion hat geraden Grad und einen positiven Leitkoeffizienten. Wie verläuft ihr Graph in den Randbereichen?',
    [r'er steigt auf beiden Seiten nach oben', r'er fällt auf beiden Seiten nach unten',
     r'links nach oben, rechts nach unten', r'links nach unten, rechts nach oben'],
    [r'Gerader Grad heißt: beide Seiten verhalten sich gleich, denn $(-x)^n = x^n$ für gerades $n$.',
     r'Positiver Leitkoeffizient heißt: nach oben.',
     r'Beispiel $f(x) = x^4$ oder $f(x) = 3x^2$ — beide öffnen nach oben.'])

Q.q(r'Bestimme $\lim\limits_{x \to \infty} \left(3x^5 - x^2\right)$.',
    [r'$+\infty$', r'$-\infty$', r'$0$', r'$3$'],
    [r'Der Term höchsten Grades ist $3x^5$ mit positivem Leitkoeffizienten und ungeradem Grad.',
     r'Für $x \to +\infty$ wächst $3x^5$ über alle Grenzen, $-x^2$ bremst das nicht.',
     r'Probe bei $x = 10$: $300\,000 - 100 = 299\,900$.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Ein Kapital von $1000$ € wird mit $5\,\%$ jährlich verzinst. Welche Folge beschreibt das Kapital nach $n$ Jahren, und wie groß ist es nach $2$ Jahren?',
    [r'$K_n = 1000 \cdot 1{,}05^n$, also $K_2 = 1102{,}50$ €',
     r'$K_n = 1000 \cdot 1{,}05^n$, also $K_2 = 1100{,}00$ €',
     r'$K_n = 1000 + 50n$, also $K_2 = 1100{,}00$ €',
     r'$K_n = 1000 \cdot 0{,}05^n$, also $K_2 = 2{,}50$ €'],
    [r'Beim Zinseszins wird jedes Jahr mit dem Faktor $1{,}05$ multipliziert — das ist eine geometrische Folge.',
     r'$K_2 = 1000 \cdot 1{,}05^2 = 1000 \cdot 1{,}1025 = 1102{,}50$ €',
     r'$1100$ € käme heraus, wenn man die Zinsen nicht mitverzinste — das ist der Unterschied zwischen Zins und Zinseszins.'])

Q.q(r'Einem Kreis mit Radius $1$ werden regelmäßige $n$-Ecke einbeschrieben. Wogegen strebt ihr Umfang für $n \to \infty$?',
    [r'gegen $2\pi \approx 6{,}283$', r'gegen $\pi \approx 3{,}142$', r'gegen $4$', r'er wächst über alle Grenzen'],
    [r'Mit wachsender Eckenzahl schmiegt sich das Vieleck immer enger an den Kreis an.',
     r'Der Umfang nähert sich dem Kreisumfang $U = 2\pi r = 2\pi$.',
     r'So hat schon Archimedes $\pi$ eingegrenzt — ein Grenzwert, lange bevor es den Begriff gab.'])

Q.q(r'Die Stückkosten einer Produktion betragen $k(x) = \dfrac{4000}{x} + 12$ (in € je Stück bei $x$ Stück). Was passiert mit den Stückkosten bei immer größerer Stückzahl?',
    [r'Sie nähern sich $12$ € je Stück, ohne diesen Wert je zu erreichen.',
     r'Sie sinken auf $0$ € je Stück.',
     r'Sie nähern sich $4000$ € je Stück.',
     r'Sie wachsen über alle Grenzen.'],
    [r'Für $x \to \infty$ geht der Bruch $\dfrac{4000}{x}$ gegen $0$.',
     r'Übrig bleibt der Grenzwert $12$ — das sind die variablen Kosten je Stück.',
     r'Probe: bei $x = 1000$ sind es $16$ €, bei $x = 10\,000$ noch $12{,}40$ €. Die Fixkosten verteilen sich, verschwinden aber nie ganz.'])


def check():
    from fractions import Fraction as F
    from math import pi
    import sympy as sp
    n, x = sp.symbols('n x', positive=True), sp.Symbol('x')
    nn = sp.Symbol('n', positive=True)
    # Folgen
    assert F(1, 4) == F(1, 4) and F(3, 3 + 1) == F(3, 4)
    assert [3 * F(1, 2) ** k for k in (1, 2)] == [F(3, 2), F(3, 4)]
    assert F(3, 2) / 3 == F(1, 2) and F(3, 4) / F(3, 2) == F(1, 2)   # konstanter Quotient
    assert (3 * 1 + 2, 3 * 2 + 2) == (5, 8) and 8 - 5 == 3           # arithmetisch: konstante Differenz
    assert [2 * 3 ** k for k in range(4)] == [2, 6, 18, 54] and 3 * 54 == 162 and 2 * 54 == 108
    assert F(1, 100) == F(1, 100) and not F(1, 100) < F(1, 100) and F(1, 101) < F(1, 100)
    assert abs(1 / 101 - 0.0099) < 0.00006
    # Grenzwerte von Folgen
    assert sp.limit(1 / nn, nn, sp.oo) == 0
    assert sp.limit(nn / (nn + 1), nn, sp.oo) == 1 and [F(k, k + 1) for k in (1, 2, 3)] == [F(1, 2), F(2, 3), F(3, 4)]
    assert sp.limit(sp.Rational(1, 2) ** nn, nn, sp.oo) == 0
    assert [F(1, 2) ** k for k in (1, 2, 3, 4)] == [F(1, 2), F(1, 4), F(1, 8), F(1, 16)]
    assert sp.limit(2 ** nn, nn, sp.oo) is sp.oo
    assert sp.limit(5 / nn, nn, sp.oo) == 0 and sp.limit(3 + 1 / nn ** 2, nn, sp.oo) == 3
    assert sp.limit(sp.Rational(3, 4) ** nn, nn, sp.oo) == 0
    assert sp.limit((3 * nn + 1) / nn, nn, sp.oo) == 3
    assert sp.simplify((3 * nn + 1) / nn - (3 + 1 / nn)) == 0
    assert sp.limit((2 * nn ** 2 + 1) / (nn ** 2 + nn), nn, sp.oo) == 2
    # ganzrationale Funktionen im Unendlichen
    assert sp.limit(x ** 3, x, sp.oo) is sp.oo and sp.limit(x ** 3, x, -sp.oo) is -sp.oo
    assert 10 ** 3 == 1000 and (-10) ** 3 == -1000
    assert sp.limit(-2 * x ** 4, x, sp.oo) is -sp.oo and sp.limit(-2 * x ** 4, x, -sp.oo) is -sp.oo
    assert -2 * 10 ** 4 == -20000 and -2 * (-10) ** 4 == -20000
    assert 100 ** 3 == 1000000 and -5 * 100 ** 2 == -50000
    assert sp.limit(-x ** 3 + 4 * x, x, -sp.oo) is sp.oo
    assert -(-10) ** 3 + 4 * (-10) == 1000 - 40 == 960
    assert sp.limit(3 * x ** 5 - x ** 2, x, sp.oo) is sp.oo and 3 * 10 ** 5 - 10 ** 2 == 299900
    # Anwendungen
    assert F(105, 100) ** 2 == F(11025, 10000) and 1000 * F(105, 100) ** 2 == F(22050, 20) == 1102.5
    assert 1000 + 2 * 50 == 1100 and 1000 * F(5, 100) ** 2 == F(5, 2) == 2.5
    assert abs(2 * pi - 6.283) < 0.0005 and abs(pi - 3.142) < 0.0005
    k = lambda v: F(4000, v) + 12
    assert sp.limit(4000 / x + 12, x, sp.oo) == 12 and k(1000) == 16 and k(10000) == F(124, 10)


Q.verify(check)
Q.save()
