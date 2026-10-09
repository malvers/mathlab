#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 1 (Kursauftakt): Wiederholung der
Differentialrechnung aus Jahrgangsstufe 11 - Ableitungsregeln, Tangente und Normale,
Extrem- und Wendepunkte, Grenzwerte, Steckbrief und Extremwertproblem.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp

Q = gy12(nr=1, slug='auftakt', thema='Kursauftakt: Wiederholung Differentialrechnung', lb='Auftakt',
         blurb='Ableitungsregeln, Tangenten, Extrem- und Wendepunkte, Grenzwerte',
         comment='Blocks: Ableitungsregeln (1-7), Tangente und Normale (8, 14), Kurvenuntersuchung (9-11, 17, 20), Grenzwerte und Stetigkeit (12, 13, 19), Steckbrief und Optimieren (15, 16), Verkettung (18). Ohne Hilfsmittel.')

# ------------------------------------------------------------ Ableitungsregeln ----
Q.q(r'Leite ab: $f(x) = 3x^4 - 2x^2 + 5$.',
    [r'$f^{\prime}(x) = 12x^3 - 4x$', r'$f^{\prime}(x) = 12x^3 - 4x + 5$', r'$f^{\prime}(x) = 3x^3 - 2x$', r'$f^{\prime}(x) = 12x^4 - 4x^2$'],
    [r'Potenz-, Faktor- und Summenregel: $(3x^4)^{\prime} = 12x^3$, $(-2x^2)^{\prime} = -4x$, $(5)^{\prime} = 0$.',
     r'Also $f^{\prime}(x) = 12x^3 - 4x$. Die Konstante fällt weg, der Exponent sinkt um 1.'])

Q.q(r'Berechne $f^{\prime}(4)$ für $f(x) = \sqrt{x}$.',
    [r'$\dfrac14$', r'$\dfrac12$', r'$2$', r'$4$'],
    [r'$f(x) = x^{1/2}$, also $f^{\prime}(x) = \tfrac12 x^{-1/2} = \dfrac{1}{2\sqrt{x}}$.',
     r'$f^{\prime}(4) = \dfrac{1}{2 \cdot 2} = \dfrac14$. Die $2$ ist der Funktionswert $\sqrt4$, nicht die Steigung.'])

Q.q(r'Berechne $f^{\prime}(0)$ für $f(x) = \mathrm{e}^{2x}$.',
    [r'$2$', r'$1$', r'$\mathrm{e}^2$', r'$0$'],
    [r'Kettenregel: $f^{\prime}(x) = 2\,\mathrm{e}^{2x}$ (innere Ableitung $2$).',
     r'$f^{\prime}(0) = 2 \cdot \mathrm{e}^0 = 2$. Wer die innere Ableitung vergisst, erhält $1$.'])

Q.q(r'Berechne $f^{\prime}(2)$ für $f(x) = \ln x$.',
    [r'$\dfrac12$', r'$\ln 2$', r'$2$', r'$-\dfrac14$'],
    [r'$(\ln x)^{\prime} = \dfrac1x$.',
     r'$f^{\prime}(2) = \dfrac12$. $\ln 2$ ist der Funktionswert, $-\tfrac14$ wäre die Ableitung von $\tfrac1x$.'])

Q.q(r'Leite ab: $f(x) = \sin(3x)$.',
    [r'$f^{\prime}(x) = 3\cos(3x)$', r'$f^{\prime}(x) = \cos(3x)$', r'$f^{\prime}(x) = -3\cos(3x)$', r'$f^{\prime}(x) = 3\sin(3x)$'],
    [r'Äußere Ableitung: $\sin \to \cos$, innere Ableitung von $3x$: $3$.',
     r'$f^{\prime}(x) = \cos(3x) \cdot 3 = 3\cos(3x)$. Das Minus gehört zur Ableitung von $\cos$, nicht von $\sin$.'])

Q.q(r'Leite ab: $f(x) = x \cdot \mathrm{e}^x$.',
    [r'$f^{\prime}(x) = (x + 1)\,\mathrm{e}^x$', r'$f^{\prime}(x) = \mathrm{e}^x$', r'$f^{\prime}(x) = x\,\mathrm{e}^x$', r'$f^{\prime}(x) = (x - 1)\,\mathrm{e}^x$'],
    [r'Produktregel: $(u v)^{\prime} = u^{\prime} v + u v^{\prime}$ mit $u = x$, $v = \mathrm{e}^x$.',
     r'$f^{\prime}(x) = 1 \cdot \mathrm{e}^x + x \cdot \mathrm{e}^x = (x + 1)\,\mathrm{e}^x$.'])

Q.q(r'Leite ab: $f(x) = (2x - 1)^3$.',
    [r'$f^{\prime}(x) = 6(2x - 1)^2$', r'$f^{\prime}(x) = 3(2x - 1)^2$', r'$f^{\prime}(x) = 6(2x - 1)^3$', r'$f^{\prime}(x) = 2(2x - 1)^2$'],
    [r'Kettenregel: äußere Ableitung $3(\ldots)^2$, innere Ableitung $2$.',
     r'$f^{\prime}(x) = 3(2x - 1)^2 \cdot 2 = 6(2x - 1)^2$.'])

# ------------------------------------------------------------ Tangente ----
Q.q(r'Wie lautet die Gleichung der Tangente an den Graphen von $f(x) = x^2$ im Punkt $P(3 \mid 9)$?',
    [r'$y = 6x - 9$', r'$y = 6x + 9$', r'$y = 6x - 3$', r'$y = 3x$'],
    [r'Steigung $m = f^{\prime}(3) = 6$, Ansatz $y = 6x + n$.',
     r'Punktprobe mit $P$: $9 = 18 + n$, also $n = -9$ und $y = 6x - 9$.'])

# ------------------------------------------------------------ Kurvenuntersuchung ----
Q.q(r'Wo hat der Graph von $f(x) = x^3 - 3x$ einen lokalen Hochpunkt?',
    [r'$H(-1 \mid 2)$', r'$H(1 \mid -2)$', r'$H(0 \mid 0)$', r'$H(-1 \mid -2)$'],
    [r'$f^{\prime}(x) = 3x^2 - 3 = 0$ liefert $x = \pm 1$; $f^{\prime\prime}(x) = 6x$.',
     r'$f^{\prime\prime}(-1) = -6 < 0$: Hochpunkt, $f(-1) = -1 + 3 = 2$. Bei $x = 1$ liegt der Tiefpunkt $(1 \mid -2)$.'])

Q.q(r'Bestimme den Wendepunkt des Graphen von $f(x) = x^3 - 6x^2 + 1$.',
    [r'$W(2 \mid -15)$', r'$W(4 \mid -31)$', r'$W(0 \mid 1)$', r'$W(2 \mid 0)$'],
    [r'$f^{\prime\prime}(x) = 6x - 12 = 0$ bei $x = 2$, und $f^{\prime\prime\prime}(x) = 6 \neq 0$.',
     r'$f(2) = 8 - 24 + 1 = -15$. Bei $x = 4$ liegt der Tiefpunkt, nicht der Wendepunkt.'])

Q.q(r'Auf welchem Intervall ist $f(x) = x^3 - 12x$ monoton fallend?',
    [r'$[-2;\ 2]$', r'$(-\infty;\ -2]$', r'$[0;\ 12]$', r'$[-\sqrt{12};\ \sqrt{12}]$'],
    [r'$f^{\prime}(x) = 3x^2 - 12 = 3(x - 2)(x + 2)$.',
     r'$f^{\prime}(x) \le 0$ genau für $-2 \le x \le 2$. $\pm\sqrt{12}$ sind die Nullstellen von $f$, nicht von $f^{\prime}$.'])

# ------------------------------------------------------------ Grenzwerte ----
Q.q(r'Bestimme $\lim\limits_{x \to \infty} \dfrac{2x^2 + 1}{x^2 - 3}$.',
    [r'$2$', r'$0$', r'$\infty$', r'$-\dfrac13$'],
    [r'Zähler und Nenner durch $x^2$ teilen: $\dfrac{2 + \frac{1}{x^2}}{1 - \frac{3}{x^2}}$.',
     r'Für $x \to \infty$ gehen die Brüche gegen $0$, es bleibt $\tfrac21 = 2$. $-\tfrac13$ ist der Wert bei $x = 0$.'])

Q.q(r'Welchen Wert hat $\lim\limits_{h \to 0} \dfrac{\mathrm{e}^h - 1}{h}$?',
    [r'$1$', r'$0$', r'$\mathrm{e}$', r'Der Grenzwert existiert nicht.'],
    [r'Das ist der Differenzenquotient von $\mathrm{e}^x$ an der Stelle $0$: $\dfrac{\mathrm{e}^{0 + h} - \mathrm{e}^0}{h}$.',
     r'Sein Grenzwert ist die Ableitung $\mathrm{e}^0 = 1$.'])

Q.q(r'Wie lautet die Normale an den Graphen von $f(x) = x^2$ an der Stelle $x_0 = 1$?',
    [r'$y = -\tfrac12 x + \tfrac32$', r'$y = 2x - 1$', r'$y = -2x + 3$', r'$y = -\tfrac12 x + 1$'],
    [r'Tangentensteigung $f^{\prime}(1) = 2$, Normalensteigung $m_n = -\tfrac12$.',
     r'Durch $P(1 \mid 1)$: $1 = -\tfrac12 + n$, also $n = \tfrac32$. $y = 2x - 1$ ist die Tangente.'])

# ------------------------------------------------------------ Steckbrief, Optimieren ----
Q.q(r'Eine Parabel hat den Scheitelpunkt $S(1 \mid 1)$ und geht durch $P(0 \mid 2)$. Wie lautet ihre Gleichung?',
    [r'$f(x) = x^2 - 2x + 2$', r'$f(x) = x^2 + 2$', r'$f(x) = 2x^2 - 2x + 1$', r'$f(x) = -x^2 + 2x$'],
    [r'Scheitelform: $f(x) = a(x - 1)^2 + 1$; $f(0) = a + 1 = 2$ gibt $a = 1$.',
     r'$f(x) = (x - 1)^2 + 1 = x^2 - 2x + 2$.'])

Q.q(r'Ein Rechteck hat den Umfang $20$ cm. Wie groß ist sein Flächeninhalt höchstens?',
    [r'$25$ cm²', r'$100$ cm²', r'$24$ cm²', r'$20$ cm²'],
    [r'$a + b = 10$, Zielfunktion $A(a) = a(10 - a) = 10a - a^2$.',
     r'$A^{\prime}(a) = 10 - 2a = 0$ bei $a = 5$: das Quadrat mit $A = 25$ cm².'])

Q.q(r'An welcher Stelle hat der Graph von $f(x) = x \ln x$ ($x > 0$) eine waagerechte Tangente?',
    [r'$x = \dfrac{1}{\mathrm{e}}$', r'$x = 1$', r'$x = \mathrm{e}$', r'$x = 0$'],
    [r'Produktregel: $f^{\prime}(x) = 1 \cdot \ln x + x \cdot \dfrac1x = \ln x + 1$.',
     r'$\ln x + 1 = 0$ heißt $\ln x = -1$, also $x = \mathrm{e}^{-1} = \dfrac1{\mathrm{e}}$. Bei $x = 1$ ist $f = 0$, nicht $f^{\prime}$.'])

Q.q(r'Leite ab: $f(x) = \mathrm{e}^{-x^2}$.',
    [r'$f^{\prime}(x) = -2x\,\mathrm{e}^{-x^2}$', r'$f^{\prime}(x) = \mathrm{e}^{-x^2}$', r'$f^{\prime}(x) = -x^2\,\mathrm{e}^{-x^2 - 1}$', r'$f^{\prime}(x) = 2x\,\mathrm{e}^{-x^2}$'],
    [r'Kettenregel: äußere Ableitung $\mathrm{e}^{\ldots}$ bleibt, innere Ableitung von $-x^2$ ist $-2x$.',
     r'$f^{\prime}(x) = -2x\,\mathrm{e}^{-x^2}$. Die Potenzregel gilt hier nicht: der Exponent ist die Variable.'])

Q.q(r'$f(x) = x^2$ für $x \le 1$ und $f(x) = 2x - 1$ für $x > 1$. Welche Aussage über $f$ an der Stelle $1$ stimmt?',
    [r'$f$ ist dort stetig und differenzierbar.', r'$f$ ist dort stetig, aber nicht differenzierbar.', r'$f$ ist dort unstetig.', r'$f$ ist dort nicht definiert.'],
    [r'Funktionswerte: $1^2 = 1$ und $2 \cdot 1 - 1 = 1$, also stetig.',
     r'Steigungen: links $2x = 2$, rechts $2$ - gleich, also kein Knick: differenzierbar. Die Gerade ist die Tangente der Parabel.'])

Q.q(r'Die Ableitung $f^{\prime}$ ist positiv für $x < 2$ und negativ für $x > 2$. Was hat der Graph von $f$ bei $x = 2$?',
    [r'einen Hochpunkt', r'einen Tiefpunkt', r'einen Wendepunkt', r'eine Nullstelle'],
    [r'$f$ steigt bis $x = 2$ und fällt danach: Vorzeichenwechsel von $+$ nach $-$.',
     r'Das ist das hinreichende Kriterium für einen Hochpunkt. Über die Nullstellen von $f$ sagt $f^{\prime}$ nichts.'])


def check():
    x, h = sp.symbols('x h')
    d = lambda e: sp.simplify(sp.diff(e, x))
    assert sp.expand(d(3*x**4 - 2*x**2 + 5) - (12*x**3 - 4*x)) == 0
    assert sp.diff(sp.sqrt(x), x).subs(x, 4) == sp.Rational(1, 4)
    assert sp.diff(sp.exp(2*x), x).subs(x, 0) == 2
    assert sp.diff(sp.log(x), x).subs(x, 2) == sp.Rational(1, 2)
    assert sp.simplify(sp.diff(sp.sin(3*x), x) - 3*sp.cos(3*x)) == 0
    assert sp.simplify(sp.diff(x*sp.exp(x), x) - (x + 1)*sp.exp(x)) == 0
    assert sp.expand(sp.diff((2*x - 1)**3, x) - 6*(2*x - 1)**2) == 0
    assert sp.diff(x**2, x).subs(x, 3) == 6 and 9 - 18 == -9
    f = x**3 - 3*x
    assert sp.solve(sp.diff(f, x), x) == [-1, 1] and sp.diff(f, x, 2).subs(x, -1) == -6 and f.subs(x, -1) == 2
    f = x**3 - 6*x**2 + 1
    assert sp.solve(sp.diff(f, x, 2), x) == [2] and f.subs(x, 2) == -15 and sp.solve(sp.diff(f, x), x) == [0, 4]
    assert sp.solve(sp.diff(x**3 - 12*x, x), x) == [-2, 2]
    assert sp.limit((2*x**2 + 1)/(x**2 - 3), x, sp.oo) == 2 and sp.Rational(1, -3) == -sp.Rational(1, 3)
    assert sp.limit((sp.exp(h) - 1)/h, h, 0) == 1
    assert 1 - (-sp.Rational(1, 2)) * 1 == sp.Rational(3, 2)
    assert sp.expand((x - 1)**2 + 1) == x**2 - 2*x + 2 and ((x - 1)**2 + 1).subs(x, 0) == 2
    a = sp.symbols('a')
    assert sp.solve(sp.diff(a*(10 - a), a), a) == [5] and 5*5 == 25
    assert sp.solve(sp.diff(x*sp.log(x), x), x) == [sp.exp(-1)]
    assert sp.simplify(sp.diff(sp.exp(-x**2), x) + 2*x*sp.exp(-x**2)) == 0
    assert (x**2).subs(x, 1) == (2*x - 1).subs(x, 1) and sp.diff(x**2, x).subs(x, 1) == 2


Q.verify(check)
Q.save()
