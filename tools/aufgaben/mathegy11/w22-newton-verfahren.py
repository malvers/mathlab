#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 22 / KW 5 (WB 2): Newton's method, convergence and
failure, comparing algebraic, graphical and numerical methods. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=22, slug='newton-verfahren', thema='Das Newton-Verfahren', lb='WB 2',
         blurb='Tangentenidee, Iteration, Konvergenz und Versagen, Verfahrensvergleich',
         comment='Blocks: idea and formula (1-4), iterations by hand (5-11), convergence and failure (12-16), comparison (17-20).')

# --------------------------------------------------------- idea and formula ----
Q.q(r'Welche Idee steckt hinter dem Newton-Verfahren?',
    [r'Man ersetzt den Graphen durch seine Tangente und nimmt deren Nullstelle als neue Näherung.',
     r'Man halbiert ein Intervall mit Vorzeichenwechsel.', r'Man liest die Nullstelle aus einer Wertetabelle ab.',
     r'Man ersetzt den Graphen durch eine Sekante durch zwei Randpunkte.'],
    [r'Die Tangente liegt in der Nähe des Berührpunkts dicht am Graphen.',
     r'Ihre Nullstelle ist leicht zu berechnen und meist eine bessere Näherung.'])

Q.q(r'Wie lautet die Iterationsvorschrift des Newton-Verfahrens?',
    [r'$x_{n+1} = x_n - \dfrac{f(x_n)}{f^{\prime}(x_n)}$', r'$x_{n+1} = x_n + \dfrac{f(x_n)}{f^{\prime}(x_n)}$',
     r'$x_{n+1} = x_n - \dfrac{f^{\prime}(x_n)}{f(x_n)}$', r'$x_{n+1} = \dfrac{x_n + f(x_n)}{2}$'],
    [r'Tangente in $x_n$: $y = f(x_n) + f^{\prime}(x_n)(x - x_n)$.',
     r'$y = 0$ setzen und nach $x$ auflösen.'])

Q.q(r'Was muss die Funktion für das Newton-Verfahren erfüllen?',
    [r'Sie muss differenzierbar sein, und $f^{\prime}(x_n)$ darf nicht null werden.', r'Sie muss ein Polynom sein.',
     r'Sie muss an den Intervallrändern verschiedene Vorzeichen haben.', r'Sie muss punktsymmetrisch sein.'],
    [r'Die Formel braucht $f^{\prime}(x_n)$ im Nenner.'])

Q.q(r'Wann bricht man die Iteration in der Praxis ab?',
    [r'Wenn sich $x_{n+1}$ und $x_n$ um weniger als die gewünschte Genauigkeit unterscheiden.', r'Nach genau drei Schritten.',
     r'Wenn $x_n$ eine ganze Zahl ist.', r'Wenn $f^{\prime}(x_n) > 0$ ist.'],
    [r'Abbruchkriterium: $|x_{n+1} - x_n| < \varepsilon$, z. B. $\varepsilon = 10^{-6}$.'])

# ----------------------------------------------------- iterations by hand ----
Q.q(r'Newton für $f(x) = x^2 - 2$ mit $x_0 = 1$. Wie groß ist $x_1$?',
    [r'1,5', r'2', r'1,25', r'0,5'],
    [r'$f(1) = -1$, $f^{\prime}(x) = 2x$, $f^{\prime}(1) = 2$',
     r'$x_1 = 1 - \dfrac{-1}{2} = 1{,}5$'])

Q.q(r'Weiter mit $x_1 = 1{,}5$. Wie groß ist $x_2$?',
    [r'etwa 1,4167', r'1,5', r'1,25', r'etwa 1,4142'],
    [r'$f(1{,}5) = 0{,}25$, $f^{\prime}(1{,}5) = 3$',
     r'$x_2 = 1{,}5 - \dfrac{0{,}25}{3} \approx 1{,}4167$'])

Q.q(r'Gegen welche Zahl konvergiert diese Folge?',
    [r'$\sqrt{2}$', r'2', r'1,5', r'$-\sqrt{2}$'],
    [r'Die positive Nullstelle von $x^2 - 2$ ist $\sqrt{2} \approx 1{,}414\,21$.',
     r'Schon $x_3 \approx 1{,}414\,216$ stimmt auf fünf Stellen.'])

Q.q(r'Newton für $f(x) = x^3 - x - 1$ mit $x_0 = 1$. Wie groß ist $x_1$?',
    [r'1,5', r'1', r'2', r'0,5'],
    [r'$f(1) = -1$, $f^{\prime}(x) = 3x^2 - 1$, $f^{\prime}(1) = 2$',
     r'$x_1 = 1 + \dfrac{1}{2} = 1{,}5$'])

Q.q(r'Weiter mit $x_1 = 1{,}5$ für $f(x) = x^3 - x - 1$. Wie groß ist $x_2$ ungefähr?',
    [r'1,348', r'1,5', r'1,250', r'1,413'],
    [r'$f(1{,}5) = 3{,}375 - 1{,}5 - 1 = 0{,}875$; $f^{\prime}(1{,}5) = 6{,}75 - 1 = 5{,}75$',
     r'$x_2 = 1{,}5 - \dfrac{0{,}875}{5{,}75} \approx 1{,}348$'])

Q.q(r'Newton für $f(x) = e^x + x - 3$ mit $x_0 = 1$. Wie groß ist $x_1$ ungefähr?',
    [r'0,807', r'0,5', r'1,193', r'0,72'],
    [r'$f(1) = e - 2 \approx 0{,}718$, $f^{\prime}(x) = e^x + 1$, $f^{\prime}(1) \approx 3{,}718$',
     r'$x_1 = 1 - \dfrac{0{,}718}{3{,}718} \approx 0{,}807$; die Lösung liegt bei 0,792.'])

Q.q(r'Newton für $f(x) = \cos x - x$ mit $x_0 = 1$. Wie groß ist $x_1$ ungefähr?',
    [r'0,750', r'0,540', r'1,250', r'0,460'],
    [r'$f(1) \approx 0{,}540 - 1 = -0{,}460$; $f^{\prime}(x) = -\sin x - 1$, $f^{\prime}(1) \approx -1{,}841$',
     r'$x_1 = 1 - \dfrac{-0{,}460}{-1{,}841} \approx 0{,}750$'])

# --------------------------------------------------- convergence and failure ----
Q.q(r'Was passiert, wenn $f^{\prime}(x_n) = 0$ ist?',
    [r'Die Tangente ist waagerecht und hat keine Nullstelle; das Verfahren bricht ab.', r'Man hat die Nullstelle gefunden.',
     r'Das Verfahren konvergiert besonders schnell.', r'Man setzt $x_{n+1} = 0$.'],
    [r'Division durch null in der Formel.',
     r'Geometrisch: Eine waagerechte Tangente schneidet die $x$-Achse nicht (außer sie liegt auf ihr).'])

Q.q(r'Newton für $f(x) = x^3 - 2x + 2$ mit $x_0 = 0$ liefert $x_1 = 1$ und $x_2 = 0$. Was passiert?',
    [r'Die Folge springt immer zwischen 0 und 1 hin und her und konvergiert nicht.', r'Die Folge konvergiert gegen 0,5.',
     r'0 ist eine Nullstelle.', r'Das Verfahren bricht wegen $f^{\prime} = 0$ ab.'],
    [r'$x_1 = 0 - \dfrac{2}{-2} = 1$; $x_2 = 1 - \dfrac{1}{1} = 0$',
     r'Ein Zyklus: Ein anderer Startwert, z. B. $x_0 = -2$, führt zur Nullstelle bei etwa −1,77.'])

Q.q(r'Eine Funktion hat zwei Nullstellen. Wovon hängt ab, welche das Newton-Verfahren findet?',
    [r'Vom Startwert $x_0$', r'Von der Abbruchgenauigkeit', r'Davon, wie oft man iteriert', r'Es findet immer die kleinere.'],
    [r'Die Tangente führt meist zur benachbarten Nullstelle.',
     r'Deshalb wählt man den Startwert mithilfe einer Skizze.'])

Q.q(r'Was passiert, wenn $x_n$ zufällig genau eine Nullstelle ist?',
    [r'Dann ist $x_{n+1} = x_n$, die Folge bleibt stehen.', r'Das Verfahren bricht ab.', r'Dann springt die Folge weg.', r'Dann ist $x_{n+1} = 0$.'],
    [r'$f(x_n) = 0$, also wird nichts abgezogen.'])

Q.q(r'Wie schnell konvergiert das Newton-Verfahren in der Nähe einer einfachen Nullstelle?',
    [r'Sehr schnell: Die Zahl der richtigen Stellen verdoppelt sich ungefähr pro Schritt.', r'Wie die Bisektion: eine halbe Stelle pro Schritt.',
     r'Gar nicht.', r'Immer genau eine Stelle pro Schritt.'],
    [r'Beispiel $\sqrt{2}$: 1,5 → 1,4167 → 1,414216.',
     r'Man spricht von quadratischer Konvergenz.'])

# --------------------------------------------------------------- comparison ----
Q.q(r'Das Heron-Verfahren $x_{n+1} = \dfrac{1}{2}\left(x_n + \dfrac{a}{x_n}\right)$ berechnet $\sqrt{a}$. Wie hängt es mit Newton zusammen?',
    [r'Es ist das Newton-Verfahren für $f(x) = x^2 - a$.', r'Es ist die Bisektion für $x^2 - a$.', r'Es hat nichts damit zu tun.',
     r'Es ist das Newton-Verfahren für $f(x) = \sqrt{x} - a$.'],
    [r'$x_n - \dfrac{x_n^2 - a}{2x_n} = \dfrac{x_n}{2} + \dfrac{a}{2x_n}$',
     r'Heron von Alexandria kannte es schon vor etwa 2000 Jahren.'])

Q.q(r'Berechne mit Heron einen Schritt für $\sqrt{10}$ mit $x_0 = 3$.',
    [r'$x_1 = \dfrac{19}{6} \approx 3{,}1667$', r'$x_1 = 3{,}5$', r'$x_1 = \dfrac{10}{3}$', r'$x_1 = 3{,}1623$'],
    [r'$\dfrac{1}{2}\left(3 + \dfrac{10}{3}\right) = \dfrac{1}{2} \cdot \dfrac{19}{3} = \dfrac{19}{6}$',
     r'$\sqrt{10} \approx 3{,}1623$: schon nach einem Schritt nah dran.'])

Q.q(r'Welche Aussage zum Vergleich der Verfahren ist richtig?',
    [r'Algebraisch: exakt, aber nur für spezielle Gleichungen; numerisch: immer anwendbar, liefert Näherungen.',
     r'Numerische Verfahren liefern immer exakte Lösungen.', r'Grafische Verfahren sind am genauesten.',
     r'Das Newton-Verfahren funktioniert immer, die Bisektion nie.'],
    [r'Jedes Verfahren hat seinen Platz: Skizze für den Überblick, Algebra wenn möglich, Numerik sonst.'])

Q.q(r'Wie gibt man die Newton-Iteration für $f(x) = x^2 - 2$ im CAS als Rekursion ein?',
    [r'$x_{n+1} = x_n - \dfrac{x_n^2 - 2}{2x_n}$ mit $x_0 = 1$', r'$x_{n+1} = x_n^2 - 2$ mit $x_0 = 1$',
     r'$x_{n+1} = \dfrac{x_n^2 - 2}{2x_n}$ mit $x_0 = 1$', r'$x_{n+1} = 2x_n$ mit $x_0 = 1$'],
    [r'In die Formel $f(x_n)$ und $f^{\prime}(x_n) = 2x_n$ einsetzen.',
     r'Die Listen- oder Folgenfunktion des CAS liefert dann $x_1, x_2, \ldots$'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    def newton(f, x0, n=1):
        df = sp.diff(f, x)
        v = sp.nsimplify(x0)
        for _ in range(n):
            v = v - f.subs(x, v) / df.subs(x, v)
        return v
    f = x ** 2 - 2
    assert newton(f, 1) == sp.Rational(3, 2) and abs(float(newton(f, 1, 2)) - 1.4167) < 1e-4
    assert abs(float(newton(f, 1, 3)) - 1.414216) < 1e-6
    g = x ** 3 - x - 1
    assert newton(g, 1) == sp.Rational(3, 2) and abs(float(newton(g, 1, 2)) - 1.348) < 1e-3
    h = sp.exp(x) + x - 3
    assert abs(float(newton(h, 1)) - 0.807) < 1e-3 and abs(float(sp.nsolve(h, x, 0.8)) - 0.792) < 1e-3
    c = sp.cos(x) - x
    assert abs(float(newton(c, 1)) - 0.750) < 1e-3
    k = x ** 3 - 2 * x + 2
    assert newton(k, 0) == 1 and newton(k, 0, 2) == 0
    assert abs(float(sp.nsolve(k, x, -2)) + 1.77) < 0.01
    a = sp.symbols('a', positive=True)
    xn = sp.symbols('x_n', positive=True)
    assert sp.simplify(xn - (xn ** 2 - a) / (2 * xn) - (xn + a / xn) / 2) == 0
    assert sp.Rational(1, 2) * (3 + sp.Rational(10, 3)) == sp.Rational(19, 6)


Q.verify(check)
Q.save()
