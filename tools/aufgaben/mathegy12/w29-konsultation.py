#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 29 (Konsultationen): die typischen
Fehlerfallen kurz vor der Prüfung - Kettenregel, Stammfunktionen, Fläche gegen Integral,
notwendige und hinreichende Bedingungen, Abstands- und Winkelformeln, Gegenereignis.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp
from math import comb

Q = gy12(nr=29, slug='konsultation', thema='Fehlerfallen vor der Prüfung', lb='Abitur',
         blurb='Die Klassiker unter den Fehlern: erkennen und vermeiden',
         comment='Blocks: Ableiten (1, 5, 6, 15, 16), Stammfunktion und Integral (2, 3, 14, 18), Kurvendiskussion (4, 20), Logarithmus (17), Vektoren (7-10, 19), Stochastik (11-13). Ohne Hilfsmittel.')

Q.q(r'Leite $f(x) = e^{x^2}$ ab.',
    [r'$f^{\prime}(x) = 2x\,e^{x^2}$', r'$f^{\prime}(x) = e^{x^2}$', r'$f^{\prime}(x) = x^2\,e^{x^2 - 1}$', r'$f^{\prime}(x) = e^{2x}$'],
    [r'Kettenregel: Die innere Funktion $x^2$ hat die Ableitung $2x$.',
     r'Die Falle: Die $e$-Funktion bleibt nur ohne innere Funktion unverändert.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = \dfrac{1}{x^2}$?',
    [r'$F(x) = -\dfrac1x$', r'$F(x) = \ln x^2$', r'$F(x) = \dfrac{1}{3x^3}$', r'$F(x) = -\dfrac{2}{x^3}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$, Potenzregel: $\dfrac{x^{-1}}{-1}$.',
     r'Probe: $\left(-\tfrac1x\right)^{\prime} = \tfrac{1}{x^2}$ ✔ Der Logarithmus gehört nur zu $\tfrac1x$.'])

Q.q(r'Es gilt $\int_{-1}^{1} x\,dx = 0$. Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x$ und der $x$-Achse über $[-1;\ 1]$?',
    [r'$1$', r'$0$', r'$2$', r'$\tfrac12$'],
    [r'Unterhalb der Achse zählt das Integral negativ, die Teilflächen heben sich auf.',
     r'Fläche: $2 \cdot \tfrac12 = 1$. Darum an den Nullstellen aufteilen.'])

Q.q(r'Für $f(x) = x^3$ gilt $f^{\prime}(0) = 0$. Was liegt bei $x = 0$ vor?',
    [r'ein Sattelpunkt, kein Extremum', r'ein Tiefpunkt', r'ein Hochpunkt', r'eine Nullstelle von $f^{\prime\prime}$ ohne Bedeutung'],
    [r'$f^{\prime}(x) = 3x^2 \geq 0$ wechselt das Vorzeichen bei $0$ nicht.',
     r'$f^{\prime}(x_0) = 0$ ist nur notwendig, nicht hinreichend.'])

Q.q(r'Leite $f(x) = \ln(2x)$ ab.',
    [r'$f^{\prime}(x) = \dfrac1x$', r'$f^{\prime}(x) = \dfrac{1}{2x}$', r'$f^{\prime}(x) = \dfrac2x$', r'$f^{\prime}(x) = 2\ln x$'],
    [r'Kettenregel: $\dfrac{1}{2x} \cdot 2$.',
     r'$= \tfrac1x$. Auch so: $\ln(2x) = \ln 2 + \ln x$.'])

Q.q(r'Leite $f(x) = e^{-x}$ ab.',
    [r'$f^{\prime}(x) = -e^{-x}$', r'$f^{\prime}(x) = e^{-x}$', r'$f^{\prime}(x) = -x\,e^{-x - 1}$', r'$f^{\prime}(x) = e^{x}$'],
    [r'Innere Ableitung $-1$.',
     r'$f^{\prime}(x) = -e^{-x}$: Der Graph fällt überall.'])

Q.q(r'Was ergibt das Skalarprodukt zweier Vektoren im Raum?',
    [r'eine Zahl', r'einen Vektor', r'eine Matrix', r'eine Ebene'],
    [r'$\vec a \cdot \vec b = a_1 b_1 + a_2 b_2 + a_3 b_3$.',
     r'Einen Vektor liefert das Vektorprodukt $\vec a \times \vec b$.'])

Q.q(r'Mit welcher Winkelfunktion berechnet man den Winkel zwischen einer Geraden und einer Ebene aus $\vec u$ und $\vec n$?',
    [r'mit dem Sinus', r'mit dem Kosinus', r'mit dem Tangens', r'mit dem Kosinus und dann $+90^\circ$'],
    [r'Der Kosinusansatz liefert den Winkel zur Normalen.',
     r'Der Winkel zur Ebene ergänzt ihn zu $90^\circ$: daher der Sinus.'])

Q.q(r'Jemand berechnet den Abstand von $O$ zur Ebene $2x + y + 2z = 6$ als $6$. Was ist falsch?',
    [r'Es fehlt die Division durch $|\vec n| = 3$; richtig ist $2$.', r'Nichts, der Abstand ist $6$.', r'Es fehlt ein Vorzeichen; richtig ist $-6$.', r'Man muss durch $d = 6$ teilen; richtig ist $1$.'],
    [r'Abstand $\dfrac{|\vec n \cdot \vec p - d|}{|\vec n|}$.',
     r'$\tfrac63 = 2$. Abstände sind nie negativ.'])

Q.q(r'Zwei Geraden haben parallele Richtungsvektoren und keinen gemeinsamen Punkt. Wie liegen sie?',
    [r'echt parallel', r'windschief', r'identisch', r'Sie schneiden sich.'],
    [r'Windschief setzt nicht parallele Richtungen voraus.',
     r'Parallele Richtung ohne gemeinsamen Punkt: echt parallel.'])

Q.q(r'Eine faire Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens einmal Wappen?',
    [r'$\tfrac78$', r'$\tfrac18$', r'$\tfrac38$', r'$\tfrac12$'],
    [r'Gegenereignis: keinmal Wappen, $\tfrac18$.',
     r'$1 - \tfrac18 = \tfrac78$.'])

Q.q(r'$X$ nimmt nur ganze Zahlen an. Wie schreibt man $P(X > 3)$ mit der kumulierten Verteilung?',
    [r'$1 - P(X \leq 3)$', r'$1 - P(X \leq 4)$', r'$P(X \leq 3)$', r'$1 - P(X < 3)$'],
    [r'$X > 3$ heißt $X \geq 4$; das Gegenereignis ist $X \leq 3$.',
     r'Die Falle: $1 - P(X \leq 4)$ lässt den Wert $4$ weg.'])

Q.q(r'Was gibt das Signifikanzniveau $\alpha$ eines Tests an?',
    [r'die höchstens zulässige Wahrscheinlichkeit für einen Fehler 1. Art', r'die Wahrscheinlichkeit, dass $H_0$ wahr ist', r'die Wahrscheinlichkeit für einen Fehler 2. Art', r'den Anteil der Treffer in der Stichprobe'],
    [r'Der Ablehnungsbereich wird so gewählt, dass $P(\text{Ablehnung} \mid H_0) \leq \alpha$.',
     r'Ob $H_0$ wahr ist, sagt der Test nicht.'])

Q.q(r'Eine Zuflussrate ist in Liter pro Minute gegeben, die Zeit in Minuten. Welche Einheit hat $\int_0^{10} r(t)\,dt$?',
    [r'Liter', r'Liter pro Minute', r'Minuten', r'Liter pro Quadratminute'],
    [r'Integral: Rate mal Zeit, wie bei der Fläche unter der Kurve.',
     r'$\tfrac{\text{l}}{\text{min}} \cdot \text{min} = \text{l}$.'])

Q.q(r'Leite $f(x) = \sin(3x)$ ab.',
    [r'$f^{\prime}(x) = 3\cos(3x)$', r'$f^{\prime}(x) = \cos(3x)$', r'$f^{\prime}(x) = -3\cos(3x)$', r'$f^{\prime}(x) = 3\cos x$'],
    [r'Äußere Ableitung $\cos(3x)$, innere Ableitung $3$.',
     r'$f^{\prime}(x) = 3\cos(3x)$.'])

Q.q(r'Leite $f(x) = \dfrac{x}{x + 1}$ ab.',
    [r'$f^{\prime}(x) = \dfrac{1}{(x + 1)^2}$', r'$f^{\prime}(x) = 1$', r'$f^{\prime}(x) = \dfrac{2x + 1}{(x + 1)^2}$', r'$f^{\prime}(x) = \dfrac{-1}{(x + 1)^2}$'],
    [r'Quotientenregel: $\dfrac{1 \cdot (x + 1) - x \cdot 1}{(x + 1)^2}$.',
     r'$= \dfrac{1}{(x + 1)^2}$. Die Falle: Zähler und Nenner einzeln ableiten.'])

Q.q(r'Welche Gleichung stimmt für $a, b > 0$?',
    [r'$\ln(a \cdot b) = \ln a + \ln b$', r'$\ln(a + b) = \ln a + \ln b$', r'$\ln(a + b) = \ln a \cdot \ln b$', r'$\ln(a \cdot b) = \ln a \cdot \ln b$'],
    [r'Der Logarithmus macht aus Produkten Summen.',
     r'Für $\ln(a + b)$ gibt es keine solche Regel.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = e^{2x}$?',
    [r'$F(x) = \tfrac12 e^{2x}$', r'$F(x) = e^{2x}$', r'$F(x) = 2e^{2x}$', r'$F(x) = \tfrac{e^{2x + 1}}{2x + 1}$'],
    [r'Probe durch Ableiten: $\left(\tfrac12 e^{2x}\right)^{\prime} = \tfrac12 \cdot 2 e^{2x}$ ✔',
     r'Bei linearer innerer Funktion durch die innere Ableitung teilen.'])

Q.q(r'Eine Ebene wird von $\vec u$ und $\vec v$ aufgespannt. Wie erhält man einen Normalenvektor?',
    [r'$\vec u \times \vec v$', r'$\vec u + \vec v$', r'$\vec u \cdot \vec v$', r'$\vec u - \vec v$'],
    [r'Der Normalenvektor muss auf beiden Spannvektoren senkrecht stehen.',
     r'Das leistet das Vektorprodukt; Summe und Differenz liegen in der Ebene.'])

Q.q(r'Für $f(x) = x^4$ gilt $f^{\prime\prime}(0) = 0$. Hat $f$ bei $x = 0$ eine Wendestelle?',
    [r'Nein, $f^{\prime\prime}(x) = 12x^2$ wechselt das Vorzeichen nicht.', r'Ja, weil $f^{\prime\prime}(0) = 0$ ist.', r'Ja, weil $f(0) = 0$ ist.', r'Das lässt sich nicht entscheiden.'],
    [r'$f^{\prime\prime}(x_0) = 0$ ist nur notwendig.',
     r'$f^{\prime\prime} \geq 0$ überall: Bei $0$ liegt ein Tiefpunkt, keine Wendestelle.'])


def check():
    x = sp.symbols('x')
    xp = sp.symbols('xp', positive=True)
    assert sp.diff(sp.exp(x**2), x) == 2 * x * sp.exp(x**2) and sp.diff(-1 / x, x) == 1 / x**2
    assert sp.integrate(x, (x, -1, 1)) == 0 and sp.integrate(sp.Abs(x), (x, -1, 1)) == 1
    assert sp.diff(x**3, x).subs(x, 0) == 0
    assert sp.simplify(sp.diff(sp.log(2 * xp), xp) - 1 / xp) == 0 and sp.diff(sp.exp(-x), x) == -sp.exp(-x)
    assert 1 - comb(3, 0) * 0.5**3 == 0.875
    assert sp.diff(sp.sin(3 * x), x) == 3 * sp.cos(3 * x)
    assert sp.simplify(sp.diff(x / (x + 1), x) - 1 / (x + 1)**2) == 0
    assert sp.diff(sp.exp(2 * x) / 2, x) == sp.exp(2 * x)
    assert sp.diff(x**4, x, 2) == 12 * x**2


Q.verify(check)
Q.save()
