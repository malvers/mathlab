#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 19 / KW 2 (WB 2): the general iteration x = phi(x), the convergence condition
|phi'| < 1, Banach's fixed-point theorem (with sources), judging methods. 13 new questions, 7 from the Grundkurs
sheets mathegy11/w21 and w22. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=19, slug='iterationsverfahren', thema='Allgemeines Iterationsverfahren und Konvergenz', lb='WB 2',
           blurb='Fixpunktform, Iteration, Konvergenzbedingung, Banachscher Fixpunktsatz, Verfahren beurteilen',
           comment='New questions on fixed-point iteration and Banach (sources in the steps); 7 from mathegy11/w21 and w22.')

qs_n, check_n = harvest('w22-newton-verfahren.py', [3, 13, 14, 16, 17, 18])
qs_b, check_b = harvest('w21-bisektion.py', [19])
newton = dict(zip([3, 13, 14, 16, 17, 18], qs_n))


def take(q):
    Q.q(*q[0], **q[1])


# ------------------------------------------------------------- fixed points ----
Q.q(r'Was ist ein Fixpunkt einer Funktion $\varphi$?',
    [r'eine Stelle $x^{*}$ mit $\varphi(x^{*}) = x^{*}$, also ein Schnittpunkt des Graphen mit $y = x$', r'eine Nullstelle von $\varphi$',
     r'eine Stelle mit $\varphi^{\prime}(x^{*}) = 0$', r'der Startwert der Iteration'],
    [r'Der Funktionswert ist gleich dem Argument: $\varphi$ hält $x^{*}$ fest.',
     r'Die Gleichung $f(x) = 0$ wird dazu in die Form $x = \varphi(x)$ gebracht.'])

Q.q(r'Welche Umformung bringt $x^3 + x - 1 = 0$ korrekt in die Fixpunktform $x = \varphi(x)$?',
    [r'$x = \dfrac{1}{x^2 + 1}$', r'$x = x^3 + 1$', r'$x = (1 - x)^3$', r'$x = \dfrac{1}{x^2 - 1}$'],
    [r'$x^3 + x = 1 \Leftrightarrow x\,(x^2 + 1) = 1 \Leftrightarrow x = \dfrac{1}{x^2 + 1}$.',
     r'Auch $x = 1 - x^3$ ist eine Fixpunktform. Ob sie taugt, entscheidet die Konvergenzbedingung.'])

Q.q(r'Iteration $x_{n+1} = \cos x_n$ mit $x_0 = 1$ (Bogenmaß). Wie groß ist $x_2$?',
    [r'etwa 0,858', r'etwa 0,540', r'etwa 0,739', r'etwa 0,654'],
    [r'$x_1 = \cos 1 \approx 0{,}5403$.',
     r'$x_2 = \cos 0{,}5403 \approx 0{,}8576$.'])

Q.q(r'Gegen welchen Wert konvergiert $x_{n+1} = \cos x_n$?',
    [r'gegen die Lösung von $\cos x = x$, etwa 0,739', r'gegen 0', r'gegen 1', r'Sie konvergiert nicht.'],
    [r'Der Grenzwert ist ein Fixpunkt: $x^{*} = \cos x^{*}$.',
     r'Dort ist $|\varphi^{\prime}(x^{*})| = \sin 0{,}739 \approx 0{,}67 < 1$.'])

Q.q(r'Wann konvergiert die Iteration $x_{n+1} = \varphi(x_n)$ sicher gegen den Fixpunkt $x^{*}$?',
    [r'wenn $|\varphi^{\prime}(x)| < 1$ in einer Umgebung von $x^{*}$ gilt und der Startwert dort liegt', r'wenn $\varphi^{\prime}(x^{*}) > 1$ ist',
     r'immer, wenn ein Fixpunkt existiert', r'nur wenn $\varphi$ eine Gerade ist'],
    [r'Nahe $x^{*}$ gilt $x_{n+1} - x^{*} \approx \varphi^{\prime}(x^{*}) \cdot (x_n - x^{*})$.',
     r'Der Fehler wird also in jedem Schritt mit etwa $|\varphi^{\prime}(x^{*})|$ multipliziert.'])

Q.q(r'Warum versagt die Iteration $x_{n+1} = 1 - x_n^3$ für die Lösung $x^{*} \approx 0{,}682$ von $x^3 + x - 1 = 0$?',
    [r'$|\varphi^{\prime}(x^{*})| = 3\,(x^{*})^2 \approx 1{,}40 > 1$: Fehler werden größer.', r'Weil $x^{*}$ kein Fixpunkt von $\varphi$ ist.',
     r'Weil $\varphi$ nicht stetig ist.', r'Sie versagt nicht, sie konvergiert nur langsam.'],
    [r'$\varphi(x) = 1 - x^3$, $\varphi^{\prime}(x) = -3x^2$.',
     r'Mit $x = \dfrac{1}{x^2 + 1}$ klappt es dagegen.'])

Q.q(r'Ist $|\varphi^{\prime}(x)| \leq 0{,}5$ nahe dem Fixpunkt, wie entwickelt sich der Fehler?',
    [r'Er wird in jedem Schritt mindestens halbiert.', r'Er bleibt gleich.', r'Er verdoppelt sich.', r'Er wird quadriert.'],
    [r'$|x_{n+1} - x^{*}| \leq 0{,}5 \cdot |x_n - x^{*}|$.',
     r'Nach 10 Schritten ist er auf höchstens $\tfrac{1}{1024}$ geschrumpft.'])

Q.q(r'$\varphi(x) = x^2$ hat die Fixpunkte 0 und 1. Welcher ist anziehend?',
    [r'0, denn $\varphi^{\prime}(0) = 0$; die 1 stößt ab, denn $\varphi^{\prime}(1) = 2$.', r'1, denn $\varphi(1) = 1$.', r'beide', r'keiner'],
    [r'Start bei 0,9: 0,81; 0,66; 0,43; … läuft zur 0.',
     r'Start bei 1,1: 1,21; 1,46; 2,14; … läuft weg von der 1.'])

Q.q(r'Gegen welchen Wert konvergiert $x_{n+1} = \sqrt{x_n + 2}$ mit $x_0 = 0$?',
    [r'2', r'$\sqrt{2}$', r'−1', r'Sie konvergiert nicht.'],
    [r'Fixpunkt: $x = \sqrt{x + 2} \Leftrightarrow x^2 - x - 2 = 0$ mit $x \geq 0$, also $x = 2$.',
     r'$\varphi^{\prime}(2) = \tfrac{1}{4} < 1$; die Folge 0; 1,414; 1,848; 1,962; … steigt gegen 2.'])

Q.q(r'Im Spinnwebdiagramm läuft die Iteration spiralförmig um den Fixpunkt herum und nähert sich ihm. Was gilt für $\varphi^{\prime}(x^{*})$?',
    [r'$-1 < \varphi^{\prime}(x^{*}) < 0$', r'$0 < \varphi^{\prime}(x^{*}) < 1$', r'$\varphi^{\prime}(x^{*}) > 1$', r'$\varphi^{\prime}(x^{*}) < -1$'],
    [r'Negativer Anstieg: Die Folge springt abwechselnd links und rechts vom Fixpunkt.',
     r'Bei $0 < \varphi^{\prime}(x^{*}) < 1$ entsteht eine Treppe, die einseitig zum Fixpunkt läuft.'])

Q.q(r'Was sagt der Banachsche Fixpunktsatz (anschaulich, für ein Intervall)?',
    [r'Bildet $\varphi$ ein abgeschlossenes Intervall in sich ab und gilt dort $|\varphi^{\prime}(x)| \leq L < 1$, so gibt es genau einen Fixpunkt, und die Iteration konvergiert von jedem Startwert aus.',
     r'Jede Funktion hat genau einen Fixpunkt.', r'Die Iteration konvergiert immer, wenn $\varphi$ stetig ist.', r'Ein Fixpunkt existiert nur bei Geraden.'],
    [r'Die Bedingung $|\varphi^{\prime}| \leq L < 1$ heißt: $\varphi$ zieht Abstände zusammen (Kontraktion).',
     r'Der Satz liefert Existenz, Eindeutigkeit und ein Verfahren zugleich.'])

Q.q(r'Erfüllt $\varphi(x) = \dfrac{1}{x^2 + 1}$ auf $[0;\,1]$ die Voraussetzungen dieses Satzes?',
    [r'Ja: $\varphi$ bildet $[0;\,1]$ in $[0{,}5;\,1]$ ab, und $|\varphi^{\prime}(x)| \leq 0{,}65 < 1$.', r'Nein, $\varphi$ ist auf $[0;\,1]$ nicht stetig.',
     r'Nein, $|\varphi^{\prime}(1)| = 2$.', r'Nein, $\varphi(0) = 1$ liegt außerhalb.'],
    [r'$\varphi$ fällt auf $[0;\,1]$ von 1 auf 0,5.',
     r'$\varphi^{\prime}(x) = -\dfrac{2x}{(x^2 + 1)^2}$ hat den größten Betrag bei $x = \tfrac{1}{\sqrt{3}}$: $\tfrac{3\sqrt{3}}{8} \approx 0{,}65$.'])

Q.q(r'Würdigung: Stefan Banach (1892–1945) veröffentlichte den Fixpunktsatz 1922. Wofür steht sein Name in der Mathematik noch?',
    [r'Er ist ein Begründer der Funktionalanalysis (Banachräume).', r'Er erfand die Differentialrechnung.',
     r'Er bewies den Satz des Pythagoras.', r'Er entwickelte das Gauß-Jordan-Verfahren.'],
    [r'Banach, geboren in Krakau, wirkte in Lwów (heute Lwiw); der Satz stammt aus seiner Dissertation von 1920.',
     r'Quelle: S. Banach, Sur les opérations dans les ensembles abstraits et leur application aux équations intégrales, Fundamenta Mathematicae 3 (1922), S. 133–181; Biografie: MacTutor History of Mathematics, St Andrews.'])

# --------------------------------------------- Newton as iteration, judging ----
for i in (16, 17, 3, 13, 14, 18):
    take(newton[i])
for a, k in qs_b:
    Q.q(*a, **k)


def check():
    import math
    import sympy as sp
    check_n()
    check_b()
    x = sp.symbols('x', real=True)
    assert sp.simplify(x * (x ** 2 + 1) - 1 - (x ** 3 + x - 1)) == 0
    x1 = math.cos(1); x2 = math.cos(x1)
    assert abs(x1 - 0.540) < 1e-3 and abs(x2 - 0.858) < 1e-3 and abs(math.cos(x2) - 0.654) < 1e-3
    d = 1.0
    for _ in range(200):
        d = math.cos(d)
    assert abs(d - 0.739) < 1e-3 and abs(math.sin(d) - 0.67) < 0.005
    r = 0.5
    for _ in range(100):
        r = 1 / (r * r + 1)
    assert abs(r ** 3 + r - 1) < 1e-12 and abs(r - 0.682) < 1e-3 and abs(3 * r * r - 1.40) < 0.005
    for wrong in (x ** 3 + 1, (1 - x) ** 3, 1 / (x ** 2 - 1)):                       # the root is no fixed point of the wrong forms
        assert abs(r - float(wrong.subs(x, r))) > 0.1
    y = 0.6
    for _ in range(6):
        y = 1 - y ** 3
    assert abs(y - r) > 0.1                                                           # 1 - x^3 runs away
    assert 2 ** -10 == 1 / 1024
    s = 0.9
    for _ in range(3):
        s = s * s
    assert abs(s - 0.43) < 0.01
    t = 1.1
    for _ in range(3):
        t = t * t
    assert abs(t - 2.14) < 0.01
    v = 0.0
    seq = []
    for _ in range(4):
        v = math.sqrt(v + 2); seq.append(round(v, 3))
    assert seq[:3] == [1.414, 1.848, 1.962] and sp.solve(x ** 2 - x - 2, x) == [-1, 2]
    phi = 1 / (x ** 2 + 1)
    dphi = sp.diff(phi, x)
    crit = [c for c in sp.solve(sp.diff(dphi, x), x) if 0 <= c <= 1]
    assert crit == [1 / sp.sqrt(3)] and sp.simplify(abs(dphi.subs(x, crit[0])) - 3 * sp.sqrt(3) / 8) == 0
    assert abs(float(3 * sp.sqrt(3) / 8) - 0.65) < 0.005 and phi.subs(x, 0) == 1 and phi.subs(x, 1) == sp.Rational(1, 2)


Q.verify(check)
Q.save()
