#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 36 (Wahlbereich 3): Differenzial- und Integralrechnung
mit CAS I - Funktionenscharen, auch mit zwei Parametern, und Extremalaufgaben.
Liegt nach der schriftlichen FHR-Pruefung. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=36, slug='cas1', thema='Differenzial- und Integralrechnung mit CAS I', lb='WB 3',
          blurb='exakt und numerisch, Funktionenscharen mit einem und zwei Parametern, Extremalaufgaben',
          comment='Blocks: exakt und numerisch (1-4), Scharen mit einem Parameter (5-10), Scharen mit zwei Parametern (11-15), Extremalaufgaben mit CAS (16-18), abschnittsweise definierte Funktionen (19-20). Wahlbereich: hier ist das CAS erlaubt.')

# --------------------------------------------------- exakt und numerisch ----
Q.q(r'Ein CAS gibt für $\sqrt{8}$ das Ergebnis $2\sqrt{2}$ aus, ein GTR dagegen $2{,}828427125$. Worin liegt der Unterschied?',
    [r'Das CAS rechnet exakt mit dem Wurzelterm, der GTR liefert einen gerundeten Näherungswert.',
     r'Das CAS rechnet ungenauer als der GTR.',
     r'Beide Ergebnisse sind verschiedene Zahlen.',
     r'Der GTR kann keine Wurzeln berechnen.'],
    [r'$2\sqrt{2}$ und $2{,}828427125$ bezeichnen dieselbe Zahl, nur in verschiedener Form.',
     r'Exakt heißt: der Term bleibt stehen, es wird nichts gerundet.',
     r'Probe: $\left(2\sqrt{2}\right)^2 = 4 \cdot 2 = 8$, während der gerundete Wert quadriert $8{,}000000001\ldots$ ergibt und damit knapp danebenliegt.'])

Q.q(r'Welche Lösungen liefert ein CAS für die Gleichung $x^2 = 2$ bei exakter Rechnung?',
    [r'$x = \sqrt{2}$ und $x = -\sqrt{2}$', r'nur $x = \sqrt{2}$',
     r'$x = 1{,}41$ und $x = -1{,}41$', r'$x = 1$ und $x = 2$'],
    [r'Exakt heißt: die Wurzel bleibt als Term stehen, es wird nicht gerundet.',
     r'Eine quadratische Gleichung hat hier zwei Lösungen, das Vorzeichen darf nicht vergessen werden.',
     r'$1{,}41$ wäre nur eine gerundete Näherung; quadriert ergibt das $1{,}9881$, nicht $2$.'])

Q.q(r'Ein CAS liefert für eine Extremstelle das Ergebnis $x = \dfrac{5}{3}$. Warum lohnt es sich trotzdem, die Aufgabe im Kopf zu überschlagen?',
    [r'Weil ein CAS nur das rechnet, was eingegeben wurde — ein Tippfehler im Term bleibt sonst unbemerkt.',
     r'Weil ein CAS grundsätzlich ungenau rechnet.',
     r'Weil ein CAS keine Brüche darstellen kann.',
     r'Weil Extremstellen immer ganzzahlig sind.'],
    [r'Das CAS prüft nicht, ob die eingegebene Funktion die gemeinte ist.',
     r'Ein Überschlag oder ein Blick auf den Graphen deckt Eingabefehler sofort auf.',
     r'Die Rechnung selbst ist zuverlässig, die Eingabe ist die Fehlerquelle.'])

Q.q(r'Ein CAS gibt als Stammfunktion von $f(x) = 2x$ das Ergebnis $x^2$ aus. Was fehlt gegenüber der vollständigen mathematischen Antwort?',
    [r'die Integrationskonstante $C$', r'der Faktor $2$', r'der Exponent', r'nichts, die Antwort ist vollständig'],
    [r'Jede Funktion der Form $x^2 + C$ hat die Ableitung $2x$.',
     r'Viele CAS geben nur eine einzelne Stammfunktion aus.',
     r'Vollständig lautet die Antwort $F(x) = x^2 + C$.'])

# ----------------------------------------- Scharen mit einem Parameter ----
Q.q(r'Bestimme die Nullstellen der Schar $f_a(x) = a\,x^2 - 2x$ für $a \neq 0$.',
    [r'$x_1 = 0$ und $x_2 = \dfrac{2}{a}$', r'$x_1 = 0$ und $x_2 = 2a$',
     r'$x_1 = 0$ und $x_2 = -\dfrac{2}{a}$', r'nur $x = 0$'],
    [r'$x$ ausklammern: $f_a(x) = x\,(a x - 2)$',
     r'Ein Produkt ist null, wenn ein Faktor null ist: $x = 0$ oder $ax - 2 = 0$.',
     r'Aus $ax = 2$ folgt $x = \dfrac{2}{a}$. Probe mit $a = 2$: Nullstellen $0$ und $1$.'])

Q.q(r'Die Schar $f_a(x) = x^2 - 2a\,x$ hat für jedes $a$ eine Extremstelle. Wo liegt sie?',
    [r'bei $x = a$', r'bei $x = 2a$', r'bei $x = -a$', r'bei $x = 0$'],
    [r'$f_a^{\prime}(x) = 2x - 2a = 0$',
     r'Umstellen: $x = a$.',
     r'$f_a^{\prime\prime}(x) = 2 > 0$ — es ist stets ein Tiefpunkt, unabhängig von $a$.'])

Q.q(r'Bestimme die Extremstellen der Schar $f_a(x) = x^3 - 3a^2 x$ für $a > 0$.',
    [r'$x = a$ und $x = -a$', r'$x = 3a$ und $x = -3a$', r'$x = a^2$ und $x = -a^2$', r'nur $x = 0$'],
    [r'$f_a^{\prime}(x) = 3x^2 - 3a^2 = 3\,(x^2 - a^2) = 0$',
     r'Also $x^2 = a^2$ und damit $x = \pm a$.',
     r'Probe mit $a = 2$: $f_2^{\prime}(x) = 3x^2 - 12$ ist bei $x = \pm 2$ null.'])

Q.q(r'Welchen Wert hat der Tiefpunkt der Schar $f_a(x) = x^2 - 2a\,x$?',
    [r'$f_a(a) = -a^2$', r'$f_a(a) = a^2$', r'$f_a(a) = 0$', r'$f_a(a) = -2a^2$'],
    [r'Die Extremstelle liegt bei $x = a$.',
     r'Einsetzen: $f_a(a) = a^2 - 2a \cdot a = a^2 - 2a^2 = -a^2$.',
     r'Die Tiefpunkte $T(a|-a^2)$ liegen also alle auf der Parabel $y = -x^2$ — das ist ihre Ortskurve.'])

Q.q(r'Wie entstehen die Graphen der Schar $f_a(x) = x^2 + a$ auseinander?',
    [r'durch Verschiebung in Richtung der $y$-Achse', r'durch Verschiebung in Richtung der $x$-Achse',
     r'durch Streckung in Richtung der $y$-Achse', r'durch Spiegelung an der $x$-Achse'],
    [r'Der Parameter $a$ wird zum Funktionswert addiert, nicht zum Argument.',
     r'Jeder Punkt wandert also um $a$ nach oben bzw. unten.',
     r'Bei $f(x) = (x+a)^2$ wäre es dagegen eine Verschiebung längs der $x$-Achse.'])

Q.q(r'Für welche $a$ ist die Schar $f_a(x) = a\,x^3$ auf ganz $\mathbb{R}$ streng monoton steigend?',
    [r'für $a > 0$', r'für $a < 0$', r'für jedes $a$', r'für kein $a$'],
    [r'$f_a^{\prime}(x) = 3a\,x^2$, und $x^2 \geq 0$ für alle $x$.',
     r'Für $a > 0$ ist $f_a^{\prime}(x) \geq 0$ und nur an der Stelle $x = 0$ gleich null — das genügt für strenge Monotonie.',
     r'Für $a < 0$ wäre die Funktion fallend, für $a = 0$ konstant.'])

# ------------------------------------- Scharen mit zwei Parametern ----
Q.q(r'Bestimme die Nullstellen der Schar $f_{a,b}(x) = a\,x^2 + b\,x$ für $a \neq 0$.',
    [r'$x_1 = 0$ und $x_2 = -\dfrac{b}{a}$', r'$x_1 = 0$ und $x_2 = \dfrac{b}{a}$',
     r'$x_1 = a$ und $x_2 = b$', r'$x_1 = 0$ und $x_2 = -\dfrac{a}{b}$'],
    [r'$x$ ausklammern: $f_{a,b}(x) = x\,(a x + b)$',
     r'$x = 0$ oder $ax + b = 0$, also $x = -\dfrac{b}{a}$.',
     r'Probe mit $a = 1$ und $b = -4$: $x^2 - 4x$ hat die Nullstellen $0$ und $4$.'])

Q.q(r'Wo liegt der Wendepunkt der Schar $f_{a,b}(x) = x^3 + a\,x + b$?',
    [r'stets bei $x = 0$, unabhängig von $a$ und $b$', r'bei $x = -a$', r'bei $x = b$', r'bei $x = -\dfrac{a}{3}$'],
    [r'$f^{\prime}_{a,b}(x) = 3x^2 + a$ und $f^{\prime\prime}_{a,b}(x) = 6x$.',
     r'$6x = 0$ liefert $x = 0$ — die Parameter tauchen in der zweiten Ableitung gar nicht auf.',
     r'$f^{\prime\prime\prime}(x) = 6 \neq 0$, es ist wirklich ein Wendepunkt; sein $y$-Wert ist $b$.'])

Q.q(r'Für welche Beziehung zwischen $a$ und $b$ hat die Schar $f_{a,b}(x) = a\,x^2 + b\,x + 1$ ihren Scheitel an der Stelle $x = 1$?',
    [r'$b = -2a$', r'$b = 2a$', r'$a = -2b$', r'$a = b$'],
    [r'$f^{\prime}_{a,b}(x) = 2a\,x + b$, Scheitel bei $f^{\prime}(1) = 0$.',
     r'$2a + b = 0$, also $b = -2a$.',
     r'Probe mit $a = 3$, $b = -6$: $f(x) = 3x^2 - 6x + 1$ hat den Scheitel bei $x = 1$.'])

Q.q(r'Die Schar $f_{a,b}(x) = a\,x^3 + b\,x$ besitzt genau dann zwei Extremstellen, wenn …',
    [r'$a$ und $b$ verschiedene Vorzeichen haben.', r'$a$ und $b$ dasselbe Vorzeichen haben.',
     r'$a = b$ gilt.', r'$b = 0$ gilt.'],
    [r'$f^{\prime}_{a,b}(x) = 3a\,x^2 + b = 0$ führt auf $x^2 = -\dfrac{b}{3a}$.',
     r'Zwei Lösungen gibt es nur, wenn $-\dfrac{b}{3a} > 0$ ist, also wenn $a$ und $b$ verschiedene Vorzeichen haben.',
     r'Probe: $x^3 - 3x$ hat Extrema bei $\pm 1$, $x^3 + 3x$ dagegen keine.'])

Q.q(r'Welche Rolle spielen die Parameter in $f_{a,b}(x) = a\,(x - b)^2$ mit $a > 0$?',
    [r'$a$ streckt oder staucht die Parabel, $b$ verschiebt sie längs der $x$-Achse.',
     r'$a$ verschiebt sie nach oben, $b$ nach rechts.',
     r'$a$ verschiebt sie längs der $x$-Achse, $b$ streckt sie.',
     r'Beide Parameter verschieben die Parabel nach oben.'],
    [r'Der Faktor vor der Klammer verändert die Öffnung: $a > 1$ streckt, $0 < a < 1$ staucht.',
     r'Das $b$ steht beim Argument, es verschiebt den Scheitel nach $S(b|0)$.',
     r'Probe: $f_{2,3}(x) = 2(x-3)^2$ hat den Scheitel bei $x = 3$ und ist doppelt so steil wie die Normalparabel.'])

# -------------------------------------------- Extremalaufgaben mit CAS ----
Q.q(r'Eine zylindrische Dose soll $1000\,\mathrm{cm^3}$ fassen und möglichst wenig Blech verbrauchen. Wie lautet die Zielfunktion für die Oberfläche in Abhängigkeit vom Radius $r$?',
    [r'$O(r) = 2\pi r^2 + \dfrac{2000}{r}$', r'$O(r) = 2\pi r^2 + 2\pi r$',
     r'$O(r) = \pi r^2 + \dfrac{1000}{r}$', r'$O(r) = 2\pi r^2 \cdot \dfrac{1000}{r}$'],
    [r'Oberfläche: $O = 2\pi r^2 + 2\pi r h$, Nebenbedingung: $\pi r^2 h = 1000$, also $h = \dfrac{1000}{\pi r^2}$.',
     r'Einsetzen: $2\pi r h = 2\pi r \cdot \dfrac{1000}{\pi r^2} = \dfrac{2000}{r}$.',
     r'Zielfunktion: $O(r) = 2\pi r^2 + \dfrac{2000}{r}$ — erst danach übernimmt das CAS.'])

Q.q(r'Das CAS liefert für $O(r) = 2\pi r^2 + \dfrac{2000}{r}$ die Ableitung $O^{\prime}(r) = 4\pi r - \dfrac{2000}{r^2}$. Welcher Radius minimiert die Oberfläche?',
    [r'$r = \sqrt[3]{\dfrac{500}{\pi}} \approx 5{,}42\,\mathrm{cm}$', r'$r = \sqrt[3]{\dfrac{2000}{\pi}} \approx 8{,}60\,\mathrm{cm}$',
     r'$r = \sqrt{\dfrac{500}{\pi}} \approx 12{,}62\,\mathrm{cm}$', r'$r = 10\,\mathrm{cm}$'],
    [r'$O^{\prime}(r) = 0$ bedeutet $4\pi r = \dfrac{2000}{r^2}$, also $r^3 = \dfrac{2000}{4\pi} = \dfrac{500}{\pi}$.',
     r'$r = \sqrt[3]{\dfrac{500}{\pi}} \approx 5{,}42\,\mathrm{cm}$.',
     r'Die zugehörige Höhe ist $h \approx 10{,}84\,\mathrm{cm}$, also genau der doppelte Radius — so sieht die materialsparendste Dose aus.'])

Q.q(r'Eine Zielfunktion $A(x)$ ist nur auf dem Intervall $0 \leq x \leq 4$ sinnvoll. Das CAS findet keine Nullstelle von $A^{\prime}(x)$ in diesem Intervall. Was folgt daraus?',
    [r'Das Maximum liegt am Rand, also bei $x = 0$ oder $x = 4$.',
     r'Die Aufgabe hat keine Lösung.',
     r'Die Zielfunktion wurde falsch aufgestellt.',
     r'Das Maximum liegt außerhalb des Intervalls und wird trotzdem genommen.'],
    [r'Ein Extremum im Inneren setzt $A^{\prime}(x) = 0$ voraus.',
     r'Fehlt eine solche Stelle, ist die Funktion auf dem ganzen Intervall monoton.',
     r'Dann entscheiden die Randwerte: beide einsetzen und vergleichen. Randextrema findet das CAS nicht von selbst.'])

# ----------------------------- abschnittsweise definierte Funktionen ----
Q.q(r'Für welches $c$ ist die Funktion $f(x) = x^2$ für $x \leq 2$ und $f(x) = c\,x$ für $x > 2$ an der Nahtstelle stetig?',
    [r'$c = 2$', r'$c = 4$', r'$c = 1$', r'für kein $c$'],
    [r'Beide Teile müssen an der Stelle $x = 2$ denselben Wert liefern.',
     r'Links: $2^2 = 4$. Rechts: $c \cdot 2$.',
     r'$2c = 4$ ergibt $c = 2$. Der Graph geht dann ohne Sprung ineinander über.'])

Q.q(r'Eine Funktion ist stückweise definiert als $f(x) = x^2$ für $x < 1$ und $f(x) = \dfrac{1}{x}$ für $x \geq 1$. Wie verhält sie sich für $x \to \infty$?',
    [r'$f(x) \to 0$', r'$f(x) \to \infty$', r'$f(x) \to 1$', r'$f(x)$ hat keinen Grenzwert'],
    [r'Für große $x$ gilt der zweite Zweig, also $f(x) = \dfrac{1}{x}$.',
     r'$\lim\limits_{x \to \infty} \dfrac{1}{x} = 0$.',
     r'Der erste Zweig spielt für das Verhalten im Unendlichen keine Rolle — bei stückweisen Funktionen zählt immer der passende Ast.'])


def check():
    from math import pi, sqrt
    import sympy as sp
    x, a, b, r, c = sp.symbols('x a b r c')
    d = lambda e, v=x: sp.diff(e, v)
    # exakt und numerisch
    assert sp.sqrt(8) == 2 * sp.sqrt(2) and abs(float(sp.sqrt(8)) - 2.828427125) < 5e-10
    assert (2 * sp.sqrt(2)) ** 2 == 8 and 2.828427125 ** 2 != 8 and abs(2.828427125 ** 2 - 8.000000001) < 5e-10
    assert sorted(sp.solve(x ** 2 - 2, x), key=str) == sorted([sp.sqrt(2), -sp.sqrt(2)], key=str)
    assert abs(1.41 ** 2 - 1.9881) < 1e-12
    assert d(x ** 2 + c, x) == 2 * x                       # C faellt beim Ableiten weg
    # Scharen mit einem Parameter
    fa = a * x ** 2 - 2 * x
    assert sp.factor(fa) == x * (a * x - 2) and sorted(sp.solve(fa, x), key=str) == sorted([0, 2 / a], key=str)
    assert sp.solve(fa.subs(a, 2), x) == [0, 1]
    g = x ** 2 - 2 * a * x
    assert sp.solve(d(g), x) == [a] and d(d(g)) == 2 and sp.simplify(g.subs(x, a) + a ** 2) == 0
    h3 = x ** 3 - 3 * a ** 2 * x
    assert sorted(sp.solve(d(h3), x), key=str) == sorted([a, -a], key=str)
    assert sp.solve(d(h3).subs(a, 2), x) == [-2, 2] and sp.expand(d(h3).subs(a, 2)) == 3 * x ** 2 - 12
    assert sp.simplify((x ** 2 + a).subs(x, 0) - a) == 0   # a verschiebt in y-Richtung
    assert d(a * x ** 3) == 3 * a * x ** 2
    # Scharen mit zwei Parametern
    fab = a * x ** 2 + b * x
    assert sp.factor(fab) == x * (a * x + b) and sorted(sp.solve(fab, x), key=str) == sorted([0, -b / a], key=str)
    assert sp.solve(fab.subs({a: 1, b: -4}), x) == [0, 4]
    w = x ** 3 + a * x + b
    assert d(w) == 3 * x ** 2 + a and d(d(w)) == 6 * x and sp.solve(d(d(w)), x) == [0]
    assert d(d(d(w))) == 6 and w.subs(x, 0) == b
    p = a * x ** 2 + b * x + 1
    assert sp.solve(sp.Eq(d(p).subs(x, 1), 0), b) == [-2 * a]
    assert d(p.subs({a: 3, b: -6})).subs(x, 1) == 0
    s = a * x ** 3 + b * x
    assert sp.solve(d(s), x) == sp.solve(3 * a * x ** 2 + b, x)
    assert sp.solve(d(x ** 3 - 3 * x), x) == [-1, 1] and sp.solveset(d(x ** 3 + 3 * x), x, sp.S.Reals) == sp.S.EmptySet
    assert (2 * (x - 3) ** 2).subs(x, 3) == 0
    # Extremalaufgaben
    O = 2 * sp.pi * r ** 2 + 2000 / r
    hh = 1000 / (sp.pi * r ** 2)
    assert sp.simplify(2 * sp.pi * r * hh - 2000 / r) == 0
    assert sp.simplify(d(O, r) - (4 * sp.pi * r - 2000 / r ** 2)) == 0
    rs = [s for s in sp.solve(d(O, r), r) if s.is_real][0]
    assert sp.simplify(rs ** 3 - 500 / sp.pi) == 0 and abs(float(rs) - 5.42) < 0.005
    assert abs(float(hh.subs(r, rs)) - 10.84) < 0.005 and abs(float(hh.subs(r, rs)) - 2 * float(rs)) < 1e-9
    assert abs((2000 / pi) ** (1 / 3) - 8.60) < 0.005 and abs(sqrt(500 / pi) - 12.62) < 0.005
    # abschnittsweise definierte Funktionen
    assert sp.solve(sp.Eq(2 ** 2, c * 2), c) == [2]
    assert sp.limit(1 / x, x, sp.oo) == 0


Q.verify(check)
Q.save()
