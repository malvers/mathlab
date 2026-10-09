#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 3 / KW 36 (LB 1): limit at a point, limit laws,
continuity. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=3, slug='grenzwert-stetigkeit', thema='Grenzwert an einer Stelle und Stetigkeit', lb='LB 1',
         blurb='Grenzwert an einer Stelle, Grenzwertsätze, Stetigkeit',
         comment='Blocks: limits at a point (1-8), limit laws (9-11), continuity (12-18), bridge to the derivative (19-20).')

# ---------------------------------------------------- limits at a point ----
Q.q(r'Bestimme $\lim\limits_{x \to 2} (x^2 + 1)$.',
    [r'5', r'4', r'3', r'Der Grenzwert existiert nicht.'],
    [r'$x^2 + 1$ ist stetig, man darf einsetzen.',
     r'$2^2 + 1 = 5$'])

Q.q(r'Bestimme $\lim\limits_{x \to 3} \dfrac{x^2 - 9}{x - 3}$.',
    [r'6', r'0', r'3', r'Der Grenzwert existiert nicht, weil man durch null teilt.'],
    [r'Einsetzen ergibt $\dfrac{0}{0}$, das ist kein Ergebnis.',
     r'Dritte binomische Formel: $\dfrac{(x - 3)(x + 3)}{x - 3} = x + 3$ für $x \neq 3$.',
     r'$\lim\limits_{x \to 3} (x + 3) = 6$'])

Q.q(r'Bestimme $\lim\limits_{x \to 1} \dfrac{x^2 - 1}{x - 1}$.',
    [r'2', r'1', r'0', r'Der Grenzwert existiert nicht.'],
    [r'$x^2 - 1 = (x - 1)(x + 1)$',
     r'Für $x \neq 1$ kürzen: $x + 1$.',
     r'$\lim\limits_{x \to 1} (x + 1) = 2$'])

Q.q(r'Bestimme $\lim\limits_{x \to 0} \dfrac{x^2 + 2x}{x}$.',
    [r'2', r'0', r'1', r'$\infty$'],
    [r'$x$ ausklammern: $\dfrac{x(x + 2)}{x} = x + 2$ für $x \neq 0$.',
     r'$\lim\limits_{x \to 0} (x + 2) = 2$'])

Q.q(r'Was gilt für $f(x) = \dfrac{1}{x}$, wenn $x$ von rechts gegen null geht?',
    [r'$f(x) \to \infty$', r'$f(x) \to -\infty$', r'$f(x) \to 0$', r'$f(x) \to 1$'],
    [r'Für kleine positive $x$ ist $\dfrac{1}{x}$ groß und positiv: $f(0{,}01) = 100$.',
     r'Also rechtsseitig $f(x) \to \infty$.',
     r'Von links gilt $f(x) \to -\infty$; einen Grenzwert an der Stelle 0 gibt es deshalb nicht.'])

Q.q(r'$f(x) = 1$ für $x < 0$ und $f(x) = 2$ für $x \geq 0$. Was gilt an der Stelle $x_0 = 0$?',
    [r'Links- und rechtsseitiger Grenzwert sind verschieden, es gibt keinen Grenzwert.',
     r'Der Grenzwert ist 2, weil $f(0) = 2$.',
     r'Der Grenzwert ist 1,5.', r'Der Grenzwert ist 1.'],
    [r'Linksseitig: $f(x) = 1$, also Grenzwert 1.',
     r'Rechtsseitig: $f(x) = 2$, also Grenzwert 2.',
     r'Verschiedene einseitige Grenzwerte: Es gibt keinen Grenzwert, der Graph hat einen Sprung.'])

Q.q(r'Was gilt für $f(x) = \dfrac{1}{(x - 3)^2}$ in der Nähe von $x_0 = 3$?',
    [r'Von beiden Seiten $f(x) \to \infty$.', r'Links $f(x) \to -\infty$, rechts $f(x) \to \infty$.',
     r'$f(x) \to 0$', r'$f(x) \to 3$'],
    [r'Der Nenner $(x - 3)^2$ geht gegen null und ist immer positiv.',
     r'Ein Bruch mit positivem Zähler und kleinem positiven Nenner wird beliebig groß.',
     r'Polstelle ohne Vorzeichenwechsel.'])

Q.q(r'Bestimme $\lim\limits_{x \to -1} \dfrac{x^3 + 1}{x + 1}$.',
    [r'3', r'0', r'1', r'−1'],
    [r'Polynomdivision oder Faktorisieren: $x^3 + 1 = (x + 1)(x^2 - x + 1)$.',
     r'Für $x \neq -1$ bleibt $x^2 - x + 1$.',
     r'$(-1)^2 - (-1) + 1 = 3$'])

# ----------------------------------------------------------- limit laws ----
Q.q(r'Es gilt $\lim\limits_{x \to x_0} f(x) = 3$ und $\lim\limits_{x \to x_0} g(x) = -2$. Bestimme $\lim\limits_{x \to x_0} \bigl(f(x) \cdot g(x)\bigr)$.',
    [r'−6', r'1', r'5', r'−1,5'],
    [r'Grenzwertsatz für Produkte: Der Grenzwert des Produkts ist das Produkt der Grenzwerte.',
     r'$3 \cdot (-2) = -6$'])

Q.q(r'Mit denselben Grenzwerten ($f \to 3$, $g \to -2$): Bestimme $\lim\limits_{x \to x_0} \bigl(2f(x) - g(x)\bigr)$.',
    [r'8', r'4', r'6', r'−8'],
    [r'Summen- und Faktorregel für Grenzwerte.',
     r'$2 \cdot 3 - (-2) = 6 + 2 = 8$'])

Q.q(r'Mit denselben Grenzwerten ($f \to 3$, $g \to -2$): Bestimme $\lim\limits_{x \to x_0} \dfrac{f(x)}{g(x)}$.',
    [r'$-\dfrac{3}{2}$', r'$-\dfrac{2}{3}$', r'1', r'Der Grenzwert existiert nicht.'],
    [r'Quotientenregel für Grenzwerte, erlaubt weil der Grenzwert des Nenners nicht null ist.',
     r'$\dfrac{3}{-2} = -\dfrac{3}{2}$'])

# ------------------------------------------------------------ continuity ----
Q.q(r'Was bedeutet: $f$ ist an der Stelle $x_0$ stetig?',
    [r'$\lim\limits_{x \to x_0} f(x)$ existiert und ist gleich $f(x_0)$.',
     r'$f(x_0) = 0$', r'$f$ ist an der Stelle $x_0$ definiert.', r'Der Graph hat bei $x_0$ eine waagerechte Tangente.'],
    [r'Anschaulich: Der Graph lässt sich an dieser Stelle ohne Absetzen zeichnen.',
     r'Formal: Grenzwert existiert und stimmt mit dem Funktionswert überein.'])

Q.q(r'Welche Funktion ist an der Stelle $x_0 = 0$ unstetig?',
    [r'$f(x) = 1$ für $x < 0$, $f(x) = 2$ für $x \geq 0$', r'$f(x) = x^2$', r'$f(x) = |x|$', r'$f(x) = e^x$'],
    [r'Die Sprungfunktion hat links den Grenzwert 1, rechts 2.',
     r'$|x|$ hat bei 0 einen Knick, ist aber stetig.',
     r'$x^2$ und $e^x$ sind überall stetig.'])

Q.q(r'$f(x) = \dfrac{x^2 - 4}{x - 2}$ ist an der Stelle 2 nicht definiert. Welchen Wert muss man $f(2)$ geben, damit die Funktion dort stetig wird?',
    [r'$f(2) = 4$', r'$f(2) = 0$', r'$f(2) = 2$', r'Das ist nicht möglich.'],
    [r'Für $x \neq 2$ gilt $f(x) = x + 2$.',
     r'$\lim\limits_{x \to 2} (x + 2) = 4$',
     r'Mit $f(2) = 4$ ist die Lücke geschlossen (behebbare Definitionslücke).'])

Q.q(r'Für welches $a$ ist $f(x) = x + a$ für $x < 1$ und $f(x) = 2x$ für $x \geq 1$ an der Stelle 1 stetig?',
    [r'$a = 1$', r'$a = 2$', r'$a = 0$', r'$a = -1$'],
    [r'Rechts: $f(1) = 2 \cdot 1 = 2$.',
     r'Links: $\lim\limits_{x \to 1} (x + a) = 1 + a$.',
     r'Stetig, wenn $1 + a = 2$, also $a = 1$.'])

Q.q(r'Ein Parkhaus kostet 2 € für jede angefangene Stunde. Was gilt für die Funktion Parkdauer $\mapsto$ Preis?',
    [r'Sie ist an jeder vollen Stunde unstetig.', r'Sie ist überall stetig.',
     r'Sie ist nur bei 0 Stunden unstetig.', r'Sie hat Polstellen.'],
    [r'Bei 59 Minuten kostet es 2 €, bei 61 Minuten 4 €.',
     r'An jeder vollen Stunde springt der Preis: Treppenfunktion.',
     r'Sprungstellen sind Unstetigkeitsstellen.'])

Q.q(r'Bestimme $\lim\limits_{x \to 4} \sqrt{x}$.',
    [r'2', r'16', r'4', r'$\sqrt{2}$'],
    [r'Die Wurzelfunktion ist für $x \geq 0$ stetig.',
     r'Also einsetzen: $\sqrt{4} = 2$.'])

Q.q(r'Die Wertetabelle zeigt $\dfrac{\sin x}{x}$ für $x = 0{,}1$; 0,01; 0,001: etwa 0,9983; 0,99998; 0,9999998. Was vermutest du für $x \to 0$?',
    [r'Grenzwert 1', r'Grenzwert 0', r'Grenzwert $\infty$', r'Kein Grenzwert, weil man durch null teilt.'],
    [r'An der Stelle 0 selbst ist $\dfrac{\sin x}{x}$ nicht definiert.',
     r'Die Werte nähern sich aber erkennbar der 1.',
     r'Tatsächlich gilt $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$.'])

# ------------------------------------------------ bridge to the derivative ----
Q.q(r'Bestimme $\lim\limits_{h \to 0} \dfrac{(2 + h)^2 - 4}{h}$.',
    [r'4', r'0', r'2', r'Der Grenzwert existiert nicht.'],
    [r'Ausmultiplizieren: $(2 + h)^2 - 4 = 4h + h^2$.',
     r'Durch $h$ teilen: $4 + h$.',
     r'Für $h \to 0$ bleibt 4. So wird nächste Woche der Anstieg der Tangente berechnet.'])

Q.q(r'Welche Aussage ist richtig?',
    [r'Wenn $f$ an $x_0$ stetig ist, gilt $\lim\limits_{x \to x_0} f(x) = f(x_0)$.',
     r'Jede Funktion mit einem Knick ist unstetig.',
     r'Wenn $f(x_0)$ existiert, ist $f$ dort stetig.',
     r'Eine Funktion mit Definitionslücke hat dort immer eine Polstelle.'],
    [r'Die erste Aussage ist genau die Definition der Stetigkeit.',
     r'$|x|$ hat einen Knick und ist stetig.',
     r'Die Sprungfunktion ist bei 0 definiert und trotzdem unstetig; $\dfrac{x^2 - 4}{x - 2}$ hat eine behebbare Lücke, keinen Pol.'])


def check():
    import sympy as sp
    x, h = sp.symbols('x h')
    L = lambda e, to, d='+-': sp.limit(e, x, to, d) if d != '+-' else sp.limit(e, x, to)
    assert L(x ** 2 + 1, 2) == 5
    assert L((x ** 2 - 9) / (x - 3), 3) == 6
    assert L((x ** 2 - 1) / (x - 1), 1) == 2
    assert L((x ** 2 + 2 * x) / x, 0) == 2
    assert L(1 / x, 0, '+') == sp.oo and L(1 / x, 0, '-') == -sp.oo
    assert L(1 / (x - 3) ** 2, 3, '+') == sp.oo and L(1 / (x - 3) ** 2, 3, '-') == sp.oo
    assert L((x ** 3 + 1) / (x + 1), -1) == 3
    assert 3 * -2 == -6 and 2 * 3 - (-2) == 8 and sp.Rational(3, -2) == -sp.Rational(3, 2)
    assert L((x ** 2 - 4) / (x - 2), 2) == 4
    a = sp.symbols('a')
    assert sp.solve(sp.Eq(1 + a, 2), a) == [1]
    assert L(sp.sqrt(x), 4) == 2
    for v, approx in ((0.1, 0.9983), (0.01, 0.99998), (0.001, 0.9999998)):
        assert abs(sp.sin(v) / v - approx) < 1e-4
    assert L(sp.sin(x) / x, 0) == 1
    assert sp.limit(((2 + h) ** 2 - 4) / h, h, 0) == 4


Q.verify(check)
Q.save()
