#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 37 (Wahlbereich 3): Differenzial- und Integralrechnung
mit CAS II - offene Extremwertbetrachtungen und Regression.
Liegt nach der schriftlichen FHR-Pruefung. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=37, slug='cas2', thema='Differenzial- und Integralrechnung mit CAS II', lb='WB 3',
          blurb='offene Extremwertbetrachtungen, Regression, Modellwahl und Prognose',
          comment='Blocks: offene Extremwertfragen (1-6), Regression und Modellwahl (7-11), Regressionsgerade rechnen (12-15), quadratische und exponentielle Regression (16-18), Prognose und ihre Grenzen (19-20).')

# --------------------------------------- offene Extremwertbetrachtungen ----
Q.q(r'Was kennzeichnet eine offene Extremwertaufgabe?',
    [r'Die Zielsetzung ist nicht eindeutig vorgegeben, das Ergebnis hängt davon ab, was optimiert werden soll.',
     r'Die Zielfunktion hat keine Extremstelle.',
     r'Das CAS kann die Aufgabe nicht lösen.',
     r'Es gibt unendlich viele Lösungen.'],
    [r'Bei einer klassischen Aufgabe steht fest, was maximal oder minimal werden soll.',
     r'Bei einer offenen Aufgabe muss man diese Frage erst selbst festlegen: kleinster Materialverbrauch, größter Gewinn, handlichste Form?',
     r'Die Rechnung ist dann dieselbe, aber die Zielfunktion und damit das Ergebnis ändern sich mit der Zielsetzung.'])

Q.q(r'Ein Rechteck hat den Umfang $20$ m. Welche Maße liefern die größte Fläche?',
    [r'$5\,\mathrm{m} \times 5\,\mathrm{m}$ mit $25\,\mathrm{m^2}$', r'$8\,\mathrm{m} \times 2\,\mathrm{m}$ mit $16\,\mathrm{m^2}$',
     r'$10\,\mathrm{m} \times 10\,\mathrm{m}$ mit $100\,\mathrm{m^2}$', r'$7\,\mathrm{m} \times 3\,\mathrm{m}$ mit $21\,\mathrm{m^2}$'],
    [r'Nebenbedingung $2a + 2b = 20$ ergibt $b = 10 - a$.',
     r'$A(a) = a\,(10 - a)$, $A^{\prime}(a) = 10 - 2a = 0$ liefert $a = 5$.',
     r'Das Quadrat $5 \times 5$ mit $25\,\mathrm{m^2}$ gewinnt. $10 \times 10$ hätte den Umfang $40$ m.'])

Q.q(r'Dieselben $20$ m Zaun, aber eine Seite der Fläche ist eine Hauswand und braucht keinen Zaun. Welche Maße liefern jetzt die größte Fläche?',
    [r'$5\,\mathrm{m} \times 10\,\mathrm{m}$ mit $50\,\mathrm{m^2}$', r'$5\,\mathrm{m} \times 5\,\mathrm{m}$ mit $25\,\mathrm{m^2}$',
     r'$6\,\mathrm{m} \times 8\,\mathrm{m}$ mit $48\,\mathrm{m^2}$', r'$4\,\mathrm{m} \times 12\,\mathrm{m}$ mit $48\,\mathrm{m^2}$'],
    [r'Jetzt lautet die Nebenbedingung $2x + y = 20$, also $y = 20 - 2x$.',
     r'$A(x) = x\,(20 - 2x)$, $A^{\prime}(x) = 20 - 4x = 0$ liefert $x = 5$ und $y = 10$.',
     r'$A = 50\,\mathrm{m^2}$ statt $25\,\mathrm{m^2}$ — dieselbe Zaunlänge, andere Bedingung, doppelte Fläche. Genau das meint „offen“.'])

Q.q(r'Eine Zielfunktion $V(x)$ ist nur für $0 \leq x \leq 3$ sinnvoll. Es gilt $V^{\prime}(x) > 0$ auf dem ganzen Intervall. Wo liegt das Maximum?',
    [r'am rechten Rand bei $x = 3$', r'am linken Rand bei $x = 0$',
     r'in der Mitte bei $x = 1{,}5$', r'es gibt kein Maximum'],
    [r'$V^{\prime}(x) > 0$ bedeutet: die Funktion steigt überall im Intervall.',
     r'Eine streng steigende Funktion nimmt ihren größten Wert am rechten Rand an.',
     r'Ein Randextremum findet das CAS nicht über $V^{\prime}(x) = 0$ — man muss die Randwerte selbst einsetzen.'])

Q.q(r'Eine Dose mit $1000\,\mathrm{cm^3}$ hat bei $r \approx 5{,}42\,\mathrm{cm}$ die kleinste Oberfläche, dann ist $h \approx 10{,}84\,\mathrm{cm}$. Tatsächlich verkaufte Dosen sind flacher. Wie beurteilst du das?',
    [r'Die Rechnung optimiert nur das Material; Griffigkeit, Stapelbarkeit und Regalhöhe sind weitere Ziele.',
     r'Die Rechnung ist falsch.',
     r'Die Hersteller kennen die Mathematik nicht.',
     r'Die Oberfläche spielt bei Dosen keine Rolle.'],
    [r'Das Modell beantwortet genau eine Frage: minimaler Blechverbrauch.',
     r'In der Praxis zählen weitere Kriterien, die in der Zielfunktion gar nicht vorkommen.',
     r'Ein Modellergebnis ist eine Antwort auf die gestellte Frage, nicht auf alle Fragen.'])

Q.q(r'Bei $x$ Stück betragen die Stückkosten $k(x) = \dfrac{1000}{x} + 5$ € und der Gewinn $G(x) = -x^2 + 60x$ €. Warum führen „minimale Stückkosten“ und „maximaler Gewinn“ zu verschiedenen Stückzahlen?',
    [r'$k$ fällt immer weiter, hat also kein Minimum im Inneren, während $G$ sein Maximum bei $x = 30$ hat.',
     r'Beide Ziele führen zu $x = 30$.',
     r'Der Gewinn ist bei minimalen Stückkosten immer am größten.',
     r'$k$ hat ein Minimum bei $x = 30$, $G$ dagegen keines.'],
    [r'$k^{\prime}(x) = -\dfrac{1000}{x^2}$ ist immer negativ — die Stückkosten sinken mit jeder weiteren Einheit, ein Minimum gibt es nur am Rand.',
     r'$G^{\prime}(x) = -2x + 60 = 0$ liefert $x = 30$ mit $G(30) = 900$ €.',
     r'Zwei Ziele, zwei Antworten: welche zählt, muss die Aufgabenstellung sagen.'])

# --------------------------------------------- Regression und Modellwahl ----
Q.q(r'Was leistet eine Regression?',
    [r'Sie bestimmt die Funktion eines gewählten Typs, die sich den Messpunkten am besten anpasst.',
     r'Sie berechnet eine Funktion, deren Graph durch alle Messpunkte verläuft.',
     r'Sie glättet die Messwerte, sodass keine Abweichungen mehr auftreten.',
     r'Sie beweist einen Zusammenhang zwischen zwei Größen.'],
    [r'Man legt den Funktionstyp fest: linear, quadratisch, exponentiell.',
     r'Das Verfahren sucht dann die Parameter so, dass die Summe der quadrierten Abweichungen am kleinsten wird.',
     r'Durch alle Punkte geht die Kurve in der Regel nicht — und ein Zusammenhang wird dadurch nicht bewiesen.'])

Q.q(r'Eine Messreihe verdoppelt sich in gleichen Zeitschritten. Welches Modell passt?',
    [r'ein exponentielles Modell', r'ein lineares Modell', r'ein quadratisches Modell', r'ein konstantes Modell'],
    [r'Gleiche Zeitschritte, gleicher Faktor — das ist das Kennzeichen exponentiellen Wachstums.',
     r'Linear wäre es bei gleichem Zuwachs, also gleicher Differenz.',
     r'Merksatz: Differenzen konstant heißt linear, Quotienten konstant heißt exponentiell.'])

Q.q(r'Eine Regression liefert das Bestimmtheitsmaß $R^2 = 0{,}998$. Was bedeutet das?',
    [r'Das Modell beschreibt die vorliegenden Messwerte sehr gut.',
     r'Die Messwerte sind zu $99{,}8\,\%$ richtig gemessen.',
     r'Das Modell ist zu $99{,}8\,\%$ sicher auch außerhalb des Messbereichs gültig.',
     r'Die gesuchte Größe wächst um $99{,}8\,\%$.'],
    [r'$R^2$ misst, wie gut die Kurve zu den vorhandenen Datenpunkten passt; $1$ wäre eine perfekte Anpassung.',
     r'Es sagt nichts über die Messgenauigkeit und nichts über die Gültigkeit außerhalb des Messbereichs.',
     r'Auch ein hoher Wert beweist keinen ursächlichen Zusammenhang.'])

Q.q(r'Was ist ein Residuum bei einer Regression?',
    [r'die Abweichung eines Messwertes vom Wert der Regressionskurve an derselben Stelle',
     r'der Abstand zweier Messpunkte',
     r'der Funktionswert der Regressionskurve',
     r'die Steigung der Regressionsgeraden'],
    [r'Für jeden Messpunkt gibt es einen vorhergesagten Wert auf der Kurve.',
     r'Das Residuum ist die Differenz aus gemessenem und vorhergesagtem Wert.',
     r'Die Regression macht die Summe der quadrierten Residuen so klein wie möglich.'])

Q.q(r'Warum werden bei der Regression die Abweichungen quadriert und nicht einfach addiert?',
    [r'Weil sich positive und negative Abweichungen sonst gegenseitig aufheben würden.',
     r'Weil Quadrate leichter zu berechnen sind.',
     r'Weil die Abweichungen sonst zu klein wären.',
     r'Weil nur so eine Gerade entsteht.'],
    [r'Liegt ein Punkt über und einer gleich weit unter der Geraden, ergäbe die einfache Summe null.',
     r'Die Anpassung sähe dann perfekt aus, obwohl sie es nicht ist.',
     r'Das Quadrat macht jede Abweichung positiv und gewichtet große Ausreißer zusätzlich stärker.'])

# --------------------------------------------- Regressionsgerade rechnen ----
Q.q(r'Gegeben sind die Messpunkte $(1|3)$, $(2|5)$ und $(3|10)$. Wie lauten die Mittelwerte $\bar{x}$ und $\bar{y}$?',
    [r'$\bar{x} = 2$ und $\bar{y} = 6$', r'$\bar{x} = 2$ und $\bar{y} = 5$',
     r'$\bar{x} = 3$ und $\bar{y} = 6$', r'$\bar{x} = 6$ und $\bar{y} = 18$'],
    [r'$\bar{x} = \dfrac{1 + 2 + 3}{3} = 2$',
     r'$\bar{y} = \dfrac{3 + 5 + 10}{3} = \dfrac{18}{3} = 6$',
     r'$5$ ist der mittlere Messwert der Größe nach, aber nicht der Mittelwert.'])

Q.q(r'Wie lautet die Regressionsgerade zu den Punkten $(1|3)$, $(2|5)$ und $(3|10)$?',
    [r'$y = 3{,}5x - 1$', r'$y = 3{,}5x + 1$', r'$y = 2x + 2$', r'$y = 3x$'],
    [r'Anstieg: $m = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} = \dfrac{(-1)(-3) + 0 \cdot (-1) + 1 \cdot 4}{1 + 0 + 1} = \dfrac{7}{2} = 3{,}5$',
     r'Achsenabschnitt: $n = \bar{y} - m\,\bar{x} = 6 - 3{,}5 \cdot 2 = -1$',
     r'Also $y = 3{,}5x - 1$.'])

Q.q(r'Welcher Punkt liegt bei jeder Regressionsgeraden garantiert auf der Geraden?',
    [r'der Schwerpunkt $(\bar{x}\,|\,\bar{y})$', r'der erste Messpunkt',
     r'der Ursprung', r'der Punkt mit dem größten Messwert'],
    [r'Aus $n = \bar{y} - m\,\bar{x}$ folgt unmittelbar $\bar{y} = m\,\bar{x} + n$.',
     r'Der Schwerpunkt der Punktwolke erfüllt also die Geradengleichung.',
     r'Probe mit dem Beispiel: $3{,}5 \cdot 2 - 1 = 6 = \bar{y}$. Das ist eine schnelle Kontrolle für jedes Regressionsergebnis.'])

Q.q(r'Die Regressionsgerade $y = 3{,}5x - 1$ beschreibt den Umsatz in Tausend Euro nach $x$ Monaten. Wie ist der Anstieg zu deuten?',
    [r'Der Umsatz wächst um etwa $3500$ € je Monat.', r'Der Umsatz beträgt nach einem Monat $3500$ €.',
     r'Der Umsatz wächst um $3{,}5\,\%$ je Monat.', r'Der Umsatz beträgt anfangs $3500$ €.'],
    [r'Der Anstieg gibt die Änderung pro Einheit der $x$-Achse an.',
     r'Ein Monat mehr bedeutet $3{,}5$ Tausend Euro mehr, also $3500$ €.',
     r'Der Anfangswert wäre $n = -1$, also $-1000$ € — außerhalb des Messbereichs ein deutliches Zeichen für die Grenzen des Modells.'])

# ------------------------------ quadratische und exponentielle Regression ----
Q.q(r'Durch die Punkte $(0|1)$, $(1|0)$ und $(2|3)$ soll eine Parabel $y = ax^2 + bx + c$ gelegt werden. Wie lautet sie?',
    [r'$y = 2x^2 - 3x + 1$', r'$y = x^2 - 2x + 1$', r'$y = 2x^2 - x + 1$', r'$y = 3x^2 - 4x + 1$'],
    [r'$(0|1)$ liefert sofort $c = 1$.',
     r'$(1|0)$: $a + b + 1 = 0$; $(2|3)$: $4a + 2b + 1 = 3$, also $2a + b = 1$.',
     r'Subtraktion der beiden Gleichungen ergibt $a = 2$ und damit $b = -3$. Probe bei $x = 2$: $8 - 6 + 1 = 3$.'])

Q.q(r'Die Messwerte $(0|2)$, $(1|6)$ und $(2|18)$ sollen exponentiell modelliert werden. Wie lautet die Funktion?',
    [r'$y = 2 \cdot 3^x$', r'$y = 2 \cdot 2^x$', r'$y = 3 \cdot 2^x$', r'$y = 2x^3$'],
    [r'Bei $x = 0$ ist $y = 2$, also ist der Anfangswert $2$.',
     r'Die Quotienten sind konstant: $\dfrac{6}{2} = 3$ und $\dfrac{18}{6} = 3$, der Wachstumsfaktor ist also $3$.',
     r'$y = 2 \cdot 3^x$. Probe bei $x = 2$: $2 \cdot 9 = 18$.'])

Q.q(r'Das Modell $y = 2 \cdot 3^x$ beschreibt ein Wachstum. Um wie viel Prozent wächst der Bestand je Zeitschritt?',
    [r'um $200\,\%$', r'um $300\,\%$', r'um $3\,\%$', r'um $100\,\%$'],
    [r'Der Wachstumsfaktor $3$ bedeutet: aus $100\,\%$ werden $300\,\%$.',
     r'Der Zuwachs ist also $300\,\% - 100\,\% = 200\,\%$.',
     r'Verwechslungsgefahr: Faktor $3$ heißt Verdreifachung, nicht $300\,\%$ Zuwachs.'])

# ------------------------------------------- Prognose und ihre Grenzen ----
Q.q(r'Welchen Umsatz sagt das Modell $y = 3{,}5x - 1$ (in Tausend Euro) für den fünften Monat voraus?',
    [r'$16\,500$ €', r'$17\,500$ €', r'$16{,}5$ €', r'$18\,000$ €'],
    [r'$y(5) = 3{,}5 \cdot 5 - 1 = 17{,}5 - 1 = 16{,}5$',
     r'Die Einheit ist Tausend Euro, also $16\,500$ €.',
     r'$17\,500$ € wäre $3{,}5 \cdot 5$ ohne den Achsenabschnitt.'])

Q.q(r'Ein exponentielles Modell beschreibt eine Bakterienkultur der ersten sechs Stunden sehr gut. Warum ist die Vorhersage für den dritten Tag trotzdem zweifelhaft?',
    [r'Weil Nährstoffe und Platz begrenzt sind, das Modell aber unbegrenztes Wachstum annimmt.',
     r'Weil exponentielle Modelle grundsätzlich ungenau sind.',
     r'Weil das Bestimmtheitsmaß mit der Zeit sinkt.',
     r'Weil man Stunden nicht in Tage umrechnen darf.'],
    [r'Ein Regressionsmodell gilt zunächst nur im Bereich der Messwerte.',
     r'Exponentielles Wachstum wächst über jede Grenze, echte Populationen laufen dagegen in eine Sättigung.',
     r'Extrapolation weit über den Messbereich hinaus ist die häufigste Fehlanwendung der Regression.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a, b, c = sp.symbols('x a b c')
    d = lambda e, v=x: sp.diff(e, v)
    # Extremwertaufgaben
    A1 = lambda v: v * (10 - v)
    assert sp.solve(d(x * (10 - x)), x) == [5] and A1(5) == 25 and A1(8) == 16 and A1(7) == 21
    assert 2 * 5 + 2 * 5 == 20 and 2 * 8 + 2 * 2 == 20 and 2 * 7 + 2 * 3 == 20
    A2 = lambda v: v * (20 - 2 * v)
    assert sp.solve(d(x * (20 - 2 * x)), x) == [5] and A2(5) == 50 and 20 - 2 * 5 == 10
    assert A2(6) == 48 and A2(4) == 48 and 2 * 5 + 10 == 20 and 50 == 2 * 25
    # Dose (Werte aus Woche 36)
    import math
    r0 = (500 / math.pi) ** (1 / 3)
    assert abs(r0 - 5.42) < 0.005 and abs(1000 / (math.pi * r0 ** 2) - 10.84) < 0.005
    # Stueckkosten gegen Gewinn
    assert sp.simplify(d(1000 / x + 5) - (-1000 / x ** 2)) == 0
    assert d(1000 / x + 5).subs(x, 10) < 0 and d(1000 / x + 5).subs(x, 100) < 0
    G = lambda v: -v ** 2 + 60 * v
    assert sp.solve(d(-x ** 2 + 60 * x), x) == [30] and G(30) == 900
    # Regressionsgerade
    P = [(1, 3), (2, 5), (3, 10)]
    xb = F(sum(p[0] for p in P), 3); yb = F(sum(p[1] for p in P), 3)
    assert xb == 2 and yb == 6 and sum(p[1] for p in P) == 18
    sxy = sum((p[0] - xb) * (p[1] - yb) for p in P)
    sxx = sum((p[0] - xb) ** 2 for p in P)
    assert sxy == 7 and sxx == 2
    m = F(sxy, 1) / sxx; n = yb - m * xb
    assert m == F(7, 2) and n == -1 and m * xb + n == yb          # Schwerpunkt liegt auf der Geraden
    assert m * 5 + n == F(33, 2) and float(m * 5 + n) == 16.5 and 1000 * (m * 5 + n) == 16500
    assert m * 5 == F(35, 2) and 1000 * m * 5 == 17500
    assert m * 1 + n == F(5, 2)                                    # Modell trifft die Punkte nicht exakt
    # quadratische Regression
    sol = sp.solve([c - 1, a + b + c, 4 * a + 2 * b + c - 3], [a, b, c])
    assert sol == {a: 2, b: -3, c: 1}
    q = 2 * x ** 2 - 3 * x + 1
    assert [q.subs(x, v) for v in (0, 1, 2)] == [1, 0, 3]
    # exponentielle Regression
    e = 2 * 3 ** x
    assert [e.subs(x, v) for v in (0, 1, 2)] == [2, 6, 18]
    assert F(6, 2) == 3 and F(18, 6) == 3 and 3 * 100 - 100 == 200
    assert [3 * 2 ** v for v in (0, 1, 2)] == [3, 6, 12] and [2 * 2 ** v for v in (0, 1, 2)] == [2, 4, 8]


Q.verify(check)
Q.save()
