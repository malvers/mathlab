#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 12 (LB 2): Grenzwert und Änderungsrate - Grenzwert an
einer Stelle (auch hebbare Lücke), Stetigkeit anschaulich, Durchschnitts- und
Momentangeschwindigkeit, mittlere Änderungsrate in Kontexten, Newton und Leibniz.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=12, slug='aenderungsraten', thema='Grenzwert und Änderungsrate', lb='LB 2',
          blurb='Grenzwert an einer Stelle, Stetigkeit, mittlere und momentane Änderungsrate',
          comment='Blocks: Grenzwerte (1-7), Stetigkeit (8-11), Geschwindigkeiten (12-16), Änderungsraten in Kontexten (17-20). Alles ohne CAS.')

# --------------------------------------------------------------- Grenzwerte ----
Q.q(r'Berechne $\lim\limits_{x \to 2} (x^2 + 3x)$.',
    [r'$10$', r'$4$', r'$7$', r'$13$'],
    [r'Ganzrationale Funktionen sind überall stetig - der Grenzwert ist einfach der Funktionswert.',
     r'$2^2 + 3 \cdot 2 = 4 + 6 = 10$',
     r'Falle: $3x$ heißt $3 \cdot 2$, nicht $3$.'])

Q.q(r'Berechne $\lim\limits_{x \to 3} \dfrac{x^2 - 9}{x - 3}$.',
    [r'$6$', r'$0$', r'$3$', r'der Grenzwert existiert nicht'],
    [r'Einsetzen liefert $\dfrac{0}{0}$ - das ist kein Ergebnis, sondern ein Zeichen zum Kürzen.',
     r'$x^2 - 9 = (x - 3)(x + 3)$, also $\dfrac{(x - 3)(x + 3)}{x - 3} = x + 3$ für $x \ne 3$.',
     r'$\lim\limits_{x \to 3} (x + 3) = 6$ - die Lücke bei $3$ ist hebbar.'])

Q.q(r'Berechne $\lim\limits_{x \to 0} \dfrac{x^2 + 5x}{x}$.',
    [r'$5$', r'$0$', r'$1$', r'der Grenzwert existiert nicht'],
    [r'Im Zähler $x$ ausklammern: $x^2 + 5x = x\,(x + 5)$.',
     r'Kürzen: $\dfrac{x\,(x + 5)}{x} = x + 5$ für $x \ne 0$.',
     r'$\lim\limits_{x \to 0} (x + 5) = 5$'])

Q.q(r'Berechne $\lim\limits_{x \to -2} \dfrac{x^2 + 2x}{x + 2}$.',
    [r'$-2$', r'$2$', r'$0$', r'der Grenzwert existiert nicht'],
    [r'$x^2 + 2x = x\,(x + 2)$, kürzen gegen den Nenner: $\dfrac{x\,(x + 2)}{x + 2} = x$.',
     r'$\lim\limits_{x \to -2} x = -2$',
     r'Falle: Nach dem Kürzen bleibt $x$ selbst, und $x$ läuft gegen $-2$, nicht gegen $2$.'])

Q.q(r'Berechne $\lim\limits_{x \to 2} \dfrac{x^2 - 5x + 6}{x - 2}$.',
    [r'$-1$', r'$1$', r'$0$', r'der Grenzwert existiert nicht'],
    [r'Zähler faktorisieren (Nullstellen $2$ und $3$): $x^2 - 5x + 6 = (x - 2)(x - 3)$.',
     r'Kürzen: $\dfrac{(x - 2)(x - 3)}{x - 2} = x - 3$ für $x \ne 2$.',
     r'$\lim\limits_{x \to 2} (x - 3) = 2 - 3 = -1$'])

Q.q(r'Berechne $\lim\limits_{x \to 1} \dfrac{2x^2 - 2}{x^2 - x}$.',
    [r'$4$', r'$2$', r'$0$', r'der Grenzwert existiert nicht'],
    [r'Zähler: $2x^2 - 2 = 2\,(x - 1)(x + 1)$; Nenner: $x^2 - x = x\,(x - 1)$.',
     r'Kürzen: $\dfrac{2\,(x + 1)}{x}$ für $x \ne 1$.',
     r'Einsetzen: $\dfrac{2 \cdot 2}{1} = 4$'])

Q.q(r'Berechne $\lim\limits_{x \to 2} \dfrac{x + 1}{x - 2}$.',
    [r'der Grenzwert existiert nicht', r'$3$', r'$0$', r'$1$'],
    [r'Einsetzen: Zähler $3$, Nenner $0$ - hier lässt sich nichts kürzen.',
     r'Für $x$ knapp unter $2$ wird der Bruch riesig negativ, knapp über $2$ riesig positiv: eine Polstelle.',
     r'Es gibt keinen Grenzwert. Nur bei $\dfrac{0}{0}$ lohnt sich das Kürzen.'])

# --------------------------------------------------------------- Stetigkeit ----
Q.q(r'Die Funktion $f(x) = \dfrac{x^2 - 4}{x - 2}$ ist für $x = 2$ nicht definiert. Mit welchem Wert $f(2)$ lässt sich die Lücke stetig schließen?',
    [r'$f(2) = 4$', r'$f(2) = 2$', r'$f(2) = 0$', r'mit keinem Wert - die Lücke ist nicht hebbar'],
    [r'$\dfrac{x^2 - 4}{x - 2} = \dfrac{(x - 2)(x + 2)}{x - 2} = x + 2$ für $x \ne 2$.',
     r'Grenzwert: $\lim\limits_{x \to 2} (x + 2) = 4$.',
     r'Setzt man $f(2) = 4$, hat der Graph kein Loch mehr - die Lücke ist hebbar.'])

Q.q(r'Anschaulich gesprochen ist eine Funktion auf einem Intervall stetig, wenn …',
    [r'man ihren Graphen dort zeichnen kann, ohne den Stift abzusetzen.',
     r'ihr Graph dort durch den Ursprung verläuft.',
     r'ihr Graph dort überall denselben Anstieg hat.',
     r'sie dort keine Nullstelle hat.'],
    [r'Stetig heißt: keine Sprünge, keine Löcher, keine Polstellen - der Graph ist eine durchgehende Linie.',
     r'Genauer: An jeder Stelle $x_0$ gilt $\lim\limits_{x \to x_0} f(x) = f(x_0)$.',
     r'Ein Knick (wie bei $|x|$) stört die Stetigkeit nicht.'])

Q.q(r'Welche Funktion ist an der Stelle $x = 0$ nicht stetig?',
    [r'$f(x) = \begin{cases} 1 & \text{für } x \ge 0 \\ -1 & \text{für } x < 0 \end{cases}$',
     r'$f(x) = |x|$', r'$f(x) = x^2$', r'$f(x) = x^3 - x$'],
    [r'Von links kommt der Graph bei $-1$ an, von rechts bei $1$: ein Sprung der Höhe $2$.',
     r'Linker und rechter Grenzwert sind verschieden, also gibt es keinen Grenzwert bei $0$.',
     r'$|x|$ hat bei $0$ nur einen Knick, $x^2$ und $x^3 - x$ sind ganzrational - alle drei sind stetig.'])

Q.q(r'Für welchen Wert von $c$ ist $f(x) = \begin{cases} x^2 & \text{für } x \le 1 \\ 2x + c & \text{für } x > 1 \end{cases}$ an der Stelle $x = 1$ stetig?',
    [r'$c = -1$', r'$c = 1$', r'$c = 0$', r'$c = -2$'],
    [r'Von links: $f(1) = 1^2 = 1$. Von rechts: $\lim\limits_{x \to 1} (2x + c) = 2 + c$.',
     r'Stetig heißt beide Werte gleich: $2 + c = 1$, also $c = -1$.',
     r'Probe: $2 \cdot 1 + (-1) = 1$ - die beiden Teile treffen sich im Punkt $(1|1)$.'])

# ------------------------------------------------------ Geschwindigkeiten ----
Q.q(r'Wer entwickelte im 17. Jahrhundert unabhängig voneinander die Differenzialrechnung - und stritt danach jahrzehntelang um die Urheberschaft?',
    [r'Isaac Newton und Gottfried Wilhelm Leibniz', r'Leonhard Euler und Carl Friedrich Gauß',
     r'René Descartes und Pierre de Fermat', r'Pythagoras und Euklid'],
    [r'Newton (England) suchte um 1666 nach Momentangeschwindigkeiten („Fluxionen“), Leibniz (geboren in Leipzig) um 1675 nach Tangentenanstiegen.',
     r'Unsere Schreibweisen $\dfrac{\mathrm{d}y}{\mathrm{d}x}$ und $\int$ stammen von Leibniz, der Punkt $\dot{s}$ für die Geschwindigkeit von Newton.',
     r'Der Prioritätsstreit vergiftete die Beziehung zwischen englischen und kontinentalen Mathematikern für ein Jahrhundert.'])

Q.q(r'Was ist die Momentangeschwindigkeit zum Zeitpunkt $t_0$, wenn $s(t)$ den zurückgelegten Weg beschreibt?',
    [r'der Grenzwert der Durchschnittsgeschwindigkeiten über immer kürzere Zeitspannen um $t_0$',
     r'der Quotient $\dfrac{s(t_0)}{t_0}$',
     r'die Durchschnittsgeschwindigkeit in der ersten Sekunde nach $t_0$',
     r'der bis $t_0$ zurückgelegte Weg $s(t_0)$'],
    [r'Durchschnittsgeschwindigkeit auf $[t_0;\, t_0 + h]$: $\bar v = \dfrac{s(t_0 + h) - s(t_0)}{h}$.',
     r'Lässt man $h$ gegen $0$ laufen, wird aus der Durchschnitts- die Momentangeschwindigkeit: $v(t_0) = \lim\limits_{h \to 0} \dfrac{s(t_0 + h) - s(t_0)}{h}$.',
     r'$\dfrac{s(t_0)}{t_0}$ wäre nur die Durchschnittsgeschwindigkeit seit dem Start.'])

Q.q(r'Ein Stein fällt nach dem Weg-Zeit-Gesetz $s(t) = 5t^2$ ($s$ in m, $t$ in s). Wie groß ist seine Durchschnittsgeschwindigkeit zwischen $t = 1$ und $t = 3$?',
    [r'$20\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$40\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$15\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$10\,\dfrac{\mathrm{m}}{\mathrm{s}}$'],
    [r'$s(1) = 5$, $s(3) = 45$: In den $2$ Sekunden legt der Stein $40\,\mathrm{m}$ zurück.',
     r'$\bar v = \dfrac{s(3) - s(1)}{3 - 1} = \dfrac{40}{2} = 20\,\dfrac{\mathrm{m}}{\mathrm{s}}$',
     r'$40$ wäre nur der Weg, $15 = \dfrac{45}{3}$ der Durchschnitt seit dem Start.'])

Q.q(r'Weiter mit $s(t) = 5t^2$: Wie groß ist die Momentangeschwindigkeit zum Zeitpunkt $t = 1$?',
    [r'$10\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$5\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$20\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$(10 + 5h)\,\dfrac{\mathrm{m}}{\mathrm{s}}$'],
    [r'Durchschnitt auf $[1;\, 1 + h]$: $\dfrac{5(1 + h)^2 - 5}{h} = \dfrac{10h + 5h^2}{h} = 10 + 5h$',
     r'Grenzübergang $h \to 0$: $v(1) = 10\,\dfrac{\mathrm{m}}{\mathrm{s}}$',
     r'$10 + 5h$ ist erst die Durchschnittsgeschwindigkeit - der Grenzwert fehlt noch.'])

Q.q(r'Ein Fahrzeug beschleunigt nach $s(t) = 2t^2 + 3t$ ($s$ in m, $t$ in s). Bestimme die Momentangeschwindigkeit bei $t = 1$.',
    [r'$7\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$5\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$4\,\dfrac{\mathrm{m}}{\mathrm{s}}$', r'$3\,\dfrac{\mathrm{m}}{\mathrm{s}}$'],
    [r'$s(1 + h) = 2(1 + h)^2 + 3(1 + h) = 2 + 4h + 2h^2 + 3 + 3h = 5 + 7h + 2h^2$',
     r'$\dfrac{s(1 + h) - s(1)}{h} = \dfrac{7h + 2h^2}{h} = 7 + 2h \to 7$ für $h \to 0$',
     r'$5 = s(1)$ ist der Weg, keine Geschwindigkeit.'])

# --------------------------------------------- Änderungsraten in Kontexten ----
Q.q(r'Die Kosten einer Produktion betragen $K(x) = x^2 + 10x + 100$ (in €, $x$ Stück). Wie groß ist die mittlere Änderungsrate der Kosten, wenn die Produktion von $10$ auf $20$ Stück steigt?',
    [r'$40$ € pro Stück', r'$400$ € pro Stück', r'$35$ € pro Stück', r'$30$ € pro Stück'],
    [r'$K(10) = 100 + 100 + 100 = 300$ und $K(20) = 400 + 200 + 100 = 700$',
     r'Mittlere Änderungsrate: $\dfrac{K(20) - K(10)}{20 - 10} = \dfrac{400}{10} = 40$ € pro Stück',
     r'$35 = \dfrac{700}{20}$ wären die Durchschnittskosten pro Stück - etwas anderes.'])

Q.q(r'Eine Stadt hatte $2010$ genau $48\,000$ Einwohner, $2020$ waren es $52\,500$. Wie groß war die mittlere Änderungsrate der Einwohnerzahl?',
    [r'$450$ Einwohner pro Jahr', r'$4\,500$ Einwohner pro Jahr', r'$45$ Einwohner pro Jahr', r'$5\,250$ Einwohner pro Jahr'],
    [r'Zuwachs: $52\,500 - 48\,000 = 4\,500$ Einwohner in $10$ Jahren.',
     r'$\dfrac{4\,500}{10} = 450$ Einwohner pro Jahr',
     r'Eine mittlere Änderungsrate ist immer „Änderung geteilt durch Zeitspanne“.'])

Q.q(r'In einen Tank fließt Wasser; die Wassermenge nach $t$ Minuten ist $V(t) = 3t^2$ (in Litern). Wie groß ist die momentane Zuflussrate zum Zeitpunkt $t = 4$?',
    [r'$24$ Liter pro Minute', r'$12$ Liter pro Minute', r'$48$ Liter pro Minute', r'$6$ Liter pro Minute'],
    [r'$\dfrac{V(4 + h) - V(4)}{h} = \dfrac{3(16 + 8h + h^2) - 48}{h} = \dfrac{24h + 3h^2}{h} = 24 + 3h$',
     r'Für $h \to 0$: momentane Zuflussrate $24$ Liter pro Minute.',
     r'$12 = \dfrac{48}{4}$ ist die mittlere Rate seit dem Start, $48$ der Inhalt.'])

Q.q(r'Ein Stein fällt von einem Turm ($s(t) = 5t^2$, $s$ in m, $t$ in s) und schlägt nach $3$ Sekunden auf. Mit welcher Geschwindigkeit trifft er auf - in km/h?',
    [r'$108\,\dfrac{\mathrm{km}}{\mathrm{h}}$', r'$54\,\dfrac{\mathrm{km}}{\mathrm{h}}$', r'$30\,\dfrac{\mathrm{km}}{\mathrm{h}}$', r'$162\,\dfrac{\mathrm{km}}{\mathrm{h}}$'],
    [r'Momentangeschwindigkeit bei $t = 3$: $\dfrac{5(3 + h)^2 - 45}{h} = \dfrac{30h + 5h^2}{h} = 30 + 5h \to 30\,\dfrac{\mathrm{m}}{\mathrm{s}}$',
     r'Umrechnen: $30 \cdot 3{,}6 = 108\,\dfrac{\mathrm{km}}{\mathrm{h}}$',
     r'$54\,\dfrac{\mathrm{km}}{\mathrm{h}}$ wäre die Durchschnittsgeschwindigkeit $\dfrac{45}{3} = 15\,\dfrac{\mathrm{m}}{\mathrm{s}}$ - beim Aufprall ist er doppelt so schnell.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x, h = sp.symbols('x h')
    lim = lambda expr, a: sp.limit(expr, x, a)
    # limits
    assert 2 ** 2 + 3 * 2 == 10 and 2 ** 2 == 4 and 2 ** 2 + 3 == 7 and 2 ** 2 + 3 ** 2 == 13
    assert lim((x ** 2 - 9) / (x - 3), 3) == 6 and sp.expand((x - 3) * (x + 3)) == x ** 2 - 9
    assert lim((x ** 2 + 5 * x) / x, 0) == 5
    assert lim((x ** 2 + 2 * x) / (x + 2), -2) == -2
    assert lim((x ** 2 - 5 * x + 6) / (x - 2), 2) == -1 and sp.expand((x - 2) * (x - 3)) == x ** 2 - 5 * x + 6
    assert lim((2 * x ** 2 - 2) / (x ** 2 - x), 1) == 4 and sp.expand(2 * (x - 1) * (x + 1)) == 2 * x ** 2 - 2
    assert sp.limit((x + 1) / (x - 2), x, 2, '-') == -sp.oo and sp.limit((x + 1) / (x - 2), x, 2, '+') == sp.oo
    # continuity
    assert lim((x ** 2 - 4) / (x - 2), 2) == 4
    assert 1 ** 2 == 1 and 2 * 1 + (-1) == 1 and 2 * 1 + 1 != 1 and 2 * 1 + 0 != 1
    # speeds, s(t) = 5t^2
    s = lambda t: 5 * t ** 2
    assert s(1) == 5 and s(3) == 45 and s(3) - s(1) == 40 and F(s(3) - s(1), 2) == 20 and F(s(3), 3) == 15
    assert sp.simplify((5 * (1 + h) ** 2 - 5) / h - (10 + 5 * h)) == 0 and sp.limit((5 * (1 + h) ** 2 - 5) / h, h, 0) == 10
    s2 = lambda t: 2 * t ** 2 + 3 * t
    assert sp.expand(s2(1 + h)) == 5 + 7 * h + 2 * h ** 2 and s2(1) == 5
    assert sp.limit((s2(1 + h) - s2(1)) / h, h, 0) == 7
    # contexts
    K = lambda n: n ** 2 + 10 * n + 100
    assert K(10) == 300 and K(20) == 700 and F(K(20) - K(10), 10) == 40 and F(700, 20) == 35 and F(300, 10) == 30
    assert 52500 - 48000 == 4500 and F(4500, 10) == 450
    V = lambda t: 3 * t ** 2
    assert V(4) == 48 and sp.expand(V(4 + h) - V(4)) == 24 * h + 3 * h ** 2 and sp.limit((V(4 + h) - V(4)) / h, h, 0) == 24
    assert F(48, 4) == 12
    assert sp.limit((s(3 + h) - s(3)) / h, h, 0) == 30 and s(3) == 45
    assert abs(30 * 3.6 - 108) < 1e-9 and abs(15 * 3.6 - 54) < 1e-9 and abs(45 * 3.6 - 162) < 1e-9


Q.verify(check)
Q.save()
