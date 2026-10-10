#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 8 (LB 5): Volumina von Rotationskörpern bei Rotation um
die x-Achse, Herleitung der Volumenformeln für Kegel und Kugel. Alle 20 Fragen neu (Leistungskurs).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12lk
import sympy as sp

Q = gy12lk(nr=8, slug='rotationskoerper', thema='Rotationskörper', lb='LB 5',
           blurb='Volumen bei Rotation um die x-Achse, Herleitung für Kegel und Kugel, Gefäße und Grenzfälle',
           comment='Blocks: Formel und Idee (1, 2), einfache Körper (3-6), Herleitung Kegel (7, 8) und Kugel (9-11), weitere Funktionen (12, 13), Struktur und Umkehraufgabe (14, 15), Rohr, Vase, Paraboloid, Einheiten (16-19), unendlich langer Körper (20). Teils mit Hilfsmitteln.')

Q.q(r'Der Graph von $f$ über $[a;\ b]$ rotiert um die $x$-Achse. Welche Formel liefert das Volumen des Rotationskörpers?',
    [r'$V = \pi \int_a^b \big(f(x)\big)^2\,\mathrm{d}x$', r'$V = \pi \int_a^b f(x)\,\mathrm{d}x$',
     r'$V = 2\pi \int_a^b f(x)\,\mathrm{d}x$', r'$V = \left(\pi \int_a^b f(x)\,\mathrm{d}x\right)^2$'],
    [r'Ein Schnitt senkrecht zur $x$-Achse ist ein Kreis mit dem Radius $f(x)$ und dem Inhalt $\pi \big(f(x)\big)^2$.',
     r'Diese Kreisflächen über $[a;\ b]$ aufsummiert: $V = \pi \int_a^b \big(f(x)\big)^2\,\mathrm{d}x$.'])

Q.q(r'Woraus setzt man den Rotationskörper bei der Herleitung der Volumenformel näherungsweise zusammen?',
    [r'aus dünnen Zylinderscheiben mit dem Radius $f(x)$ und der Dicke $\Delta x$', r'aus kleinen Kegeln mit der Spitze auf der $x$-Achse',
     r'aus Kugelschalen um den Ursprung', r'aus Quadern mit der Grundfläche $\big(f(x)\big)^2$'],
    [r'Eine Scheibe hat das Volumen $\pi \big(f(x_i)\big)^2 \cdot \Delta x$, die Summe ist eine Riemann-Summe.',
     r'Für $\Delta x \to 0$ wird aus der Summe das Integral $\pi \int_a^b \big(f(x)\big)^2\,\mathrm{d}x$.'])

Q.q(r'Der Graph von $f(x) = 2$ über $[0;\ 3]$ rotiert um die $x$-Achse. Wie groß ist das Volumen?',
    [r'$12\pi$', r'$6\pi$', r'$36\pi$', r'$24\pi$'],
    [r'Es entsteht ein Zylinder mit dem Radius $2$ und der Höhe $3$.',
     r'$V = \pi \int_0^3 2^2\,\mathrm{d}x = 4\pi \cdot 3 = 12\pi$, passend zu $\pi r^2 h$.'])

Q.q(r'Der Graph von $f(x) = x$ über $[0;\ 3]$ rotiert um die $x$-Achse. Wie groß ist das Volumen?',
    [r'$9\pi$', r'$\tfrac92\pi$', r'$27\pi$', r'$3\pi$'],
    [r'$V = \pi \int_0^3 x^2\,\mathrm{d}x = \pi \left[\tfrac{x^3}{3}\right]_0^3$.',
     r'$\pi \cdot \tfrac{27}{3} = 9\pi$. Ohne das Quadrat käme $\tfrac92\pi$ heraus.'])

Q.q(r'Der Graph von $f(x) = \sqrt{x}$ über $[0;\ 4]$ rotiert um die $x$-Achse. Wie groß ist das Volumen?',
    [r'$8\pi$', r'$\tfrac{16}{3}\pi$', r'$16\pi$', r'$4\pi$'],
    [r'$\big(\sqrt{x}\big)^2 = x$, also $V = \pi \int_0^4 x\,\mathrm{d}x$.',
     r'$\pi \cdot \tfrac{16}{2} = 8\pi$. $\tfrac{16}{3}\pi$ wäre $\pi \int_0^4 \sqrt{x}\,\mathrm{d}x$ ohne Quadrat.'])

Q.q(r'Der Graph von $f(x) = x^2$ über $[0;\ 1]$ rotiert um die $x$-Achse. Wie groß ist das Volumen?',
    [r'$\tfrac{\pi}{5}$', r'$\tfrac{\pi}{3}$', r'$\tfrac{\pi^2}{5}$', r'$\tfrac{\pi}{25}$'],
    [r'$\big(x^2\big)^2 = x^4$, also $V = \pi \int_0^1 x^4\,\mathrm{d}x$.',
     r'$\pi \cdot \tfrac15 = \tfrac{\pi}{5}$.'])

Q.q(r'Welche Funktion erzeugt über $[0;\ h]$ bei Rotation um die $x$-Achse einen Kegel mit der Spitze im Ursprung, der Höhe $h$ und dem Grundkreisradius $r$?',
    [r'$f(x) = \tfrac{r}{h}\,x$', r'$f(x) = \tfrac{h}{r}\,x$', r'$f(x) = r\,x$', r'$f(x) = r - x$'],
    [r'Die Mantellinie ist eine Gerade durch den Ursprung, die bei $x = h$ die Höhe $r$ erreicht.',
     r'Steigung $\tfrac{r}{h}$, also $f(x) = \tfrac{r}{h}\,x$ mit $f(h) = r$ ✔'])

Q.q(r'Rotiert $f(x) = \tfrac{r}{h}\,x$ über $[0;\ h]$ um die $x$-Achse, entsteht ein Kegel. Welches Volumen liefert das Integral?',
    [r'$\tfrac13 \pi r^2 h$', r'$\pi r^2 h$', r'$\tfrac12 \pi r^2 h$', r'$\tfrac13 \pi r h^2$'],
    [r'$V = \pi \int_0^h \tfrac{r^2}{h^2}\,x^2\,\mathrm{d}x = \pi\,\tfrac{r^2}{h^2} \cdot \tfrac{h^3}{3}$.',
     r'$= \tfrac13 \pi r^2 h$: ein Drittel des Zylinders mit gleicher Grundfläche und Höhe.'])

Q.q(r'Welcher Graph erzeugt bei Rotation um die $x$-Achse eine Kugel mit dem Radius $3$?',
    [r'$f(x) = \sqrt{9 - x^2}$ über $[-3;\ 3]$', r'$f(x) = 9 - x^2$ über $[-3;\ 3]$',
     r'$f(x) = \sqrt{9 - x^2}$ über $[0;\ 3]$', r'$f(x) = \sqrt{3 - x^2}$ über $[-3;\ 3]$'],
    [r'Der obere Halbkreis um den Ursprung mit dem Radius $3$: $x^2 + y^2 = 9$, $y \ge 0$, also $y = \sqrt{9 - x^2}$.',
     r'Er muss ganz rotieren, von $-3$ bis $3$. Über $[0;\ 3]$ entsteht nur eine Halbkugel, $9 - x^2$ ist eine Parabel.'])

Q.q(r'Der Halbkreis $f(x) = \sqrt{r^2 - x^2}$ über $[-r;\ r]$ rotiert um die $x$-Achse. Welches Volumen liefert das Integral?',
    [r'$\tfrac43 \pi r^3$', r'$\tfrac23 \pi r^3$', r'$4\pi r^2$', r'$2\pi r^3$'],
    [r'$V = \pi \int_{-r}^{r} (r^2 - x^2)\,\mathrm{d}x = \pi \left[r^2 x - \tfrac{x^3}{3}\right]_{-r}^{r}$.',
     r'$= \pi \left(\tfrac23 r^3 + \tfrac23 r^3\right) = \tfrac43 \pi r^3$. $4\pi r^2$ ist die Oberfläche der Kugel.'])

Q.q(r'Wie groß ist das Volumen, wenn $f(x) = \sqrt{r^2 - x^2}$ nur über $[0;\ r]$ rotiert?',
    [r'$\tfrac23 \pi r^3$', r'$\tfrac43 \pi r^3$', r'$\tfrac13 \pi r^3$', r'$\pi r^3$'],
    [r'Über $[0;\ r]$ entsteht eine Halbkugel.',
     r'$\pi \left[r^2 x - \tfrac{x^3}{3}\right]_0^r = \pi \cdot \tfrac23 r^3 = \tfrac23 \pi r^3$, die Hälfte der Kugel.'])

Q.q(r'Der Graph von $f(x) = \mathrm{e}^x$ über $[0;\ 1]$ rotiert um die $x$-Achse. Wie groß ist das Volumen?',
    [r'$\tfrac{\pi}{2}\left(\mathrm{e}^2 - 1\right)$', r'$\pi\,(\mathrm{e} - 1)$', r'$\pi\left(\mathrm{e}^2 - 1\right)$', r'$\tfrac{\pi}{2}\,\mathrm{e}^2$'],
    [r'$\left(\mathrm{e}^x\right)^2 = \mathrm{e}^{2x}$, Stammfunktion $\tfrac12\,\mathrm{e}^{2x}$ (lineare Substitution).',
     r'$V = \pi \cdot \tfrac12 \left(\mathrm{e}^2 - \mathrm{e}^0\right) = \tfrac{\pi}{2}\left(\mathrm{e}^2 - 1\right) \approx 10{,}04$.'])

Q.q(r'Der Bogen von $f(x) = \sin x$ über $[0;\ \pi]$ rotiert um die $x$-Achse. Ein CAS liefert $\int_0^{\pi} \sin^2 x\,\mathrm{d}x = \tfrac{\pi}{2}$. Wie groß ist das Volumen?',
    [r'$\tfrac{\pi^2}{2}$', r'$2\pi$', r'$\tfrac{\pi}{2}$', r'$\pi^2$'],
    [r'$V = \pi \int_0^{\pi} \sin^2 x\,\mathrm{d}x$.',
     r'$= \pi \cdot \tfrac{\pi}{2} = \tfrac{\pi^2}{2} \approx 4{,}93$. $2\pi$ wäre $\pi \int_0^{\pi} \sin x\,\mathrm{d}x$ ohne Quadrat.'])

Q.q(r'Man ersetzt $f$ durch $2f$ und lässt den Graphen über demselben Intervall rotieren. Wie ändert sich das Volumen?',
    [r'Es vervierfacht sich.', r'Es verdoppelt sich.', r'Es verachtfacht sich.', r'Es bleibt gleich.'],
    [r'$\pi \int_a^b \big(2f(x)\big)^2\,\mathrm{d}x = 4 \cdot \pi \int_a^b \big(f(x)\big)^2\,\mathrm{d}x$.',
     r'Alle Radien verdoppeln sich, alle Kreisflächen vervierfachen sich, die Länge bleibt.'])

Q.q(r'Der Graph von $f(x) = \sqrt{x}$ über $[0;\ b]$ rotiert um die $x$-Achse. Für welches $b > 0$ ist das Volumen $8\pi$?',
    [r'$b = 4$', r'$b = 16$', r'$b = 2$', r'$b = 8$'],
    [r'$V(b) = \pi \int_0^b x\,\mathrm{d}x = \tfrac{\pi}{2}\,b^2$.',
     r'$\tfrac{\pi}{2}\,b^2 = 8\pi$ gibt $b^2 = 16$, also $b = 4$.'])

Q.q(r'Die Fläche zwischen $y = 2$ und $y = 1$ über $[0;\ 3]$ rotiert um die $x$-Achse; es entsteht ein Rohr. Wie groß ist sein Volumen?',
    [r'$9\pi$', r'$3\pi$', r'$12\pi$', r'$15\pi$'],
    [r'Äußerer Zylinder minus innerer Zylinder: $V = \pi \int_0^3 \left(2^2 - 1^2\right)\mathrm{d}x$.',
     r'$= \pi \cdot 3 \cdot 3 = 9\pi$. Falsch wäre $\pi \int_0^3 (2 - 1)^2\,\mathrm{d}x = 3\pi$: erst quadrieren, dann subtrahieren.'])

Q.q(r'Eine Vase entsteht, wenn $f(x) = 0{,}5x + 1$ über $[0;\ 4]$ (in cm) um die $x$-Achse rotiert. Wie groß ist ihr Volumen?',
    [r'$\tfrac{52}{3}\pi \approx 54{,}5\ \mathrm{cm}^3$', r'$\tfrac{26}{3}\pi \approx 27{,}2\ \mathrm{cm}^3$',
     r'$8\pi \approx 25{,}1\ \mathrm{cm}^3$', r'$\tfrac{104}{3}\pi \approx 108{,}9\ \mathrm{cm}^3$'],
    [r'$V = \pi \int_0^4 (0{,}5x + 1)^2\,\mathrm{d}x$, Stammfunktion $\dfrac{(0{,}5x + 1)^3}{3 \cdot 0{,}5}$ (lineare Substitution).',
     r'$\pi \cdot \dfrac{27 - 1}{1{,}5} = \tfrac{52}{3}\pi \approx 54{,}5\ \mathrm{cm}^3$. Ohne den Faktor $\tfrac{1}{0{,}5}$ käme die Hälfte heraus.'])

Q.q(r'Ein Glas hat die Form eines Rotationsparaboloids: $f(x) = \sqrt{2x}$ rotiert über $[0;\ h]$. Welcher Anteil des umschreibenden Zylinders (Radius $\sqrt{2h}$, Höhe $h$) ist das?',
    [r'die Hälfte', r'ein Drittel', r'zwei Drittel', r'ein Viertel'],
    [r'Paraboloid: $V = \pi \int_0^h 2x\,\mathrm{d}x = \pi h^2$. Zylinder: $\pi \cdot 2h \cdot h = 2\pi h^2$.',
     r'$\dfrac{\pi h^2}{2\pi h^2} = \tfrac12$, unabhängig von $h$. Ein Kegel hätte ein Drittel.'])

Q.q(r'$f(x)$ und $x$ sind in dm angegeben, das Integral liefert $V = 2\pi$. Wie viel fasst das Gefäß?',
    [r'$\approx 6{,}28$ Liter', r'$\approx 0{,}628$ Liter', r'$\approx 62{,}8$ Liter', r'$2$ Liter'],
    [r'Volumen in $\mathrm{dm}^3$, und $1\ \mathrm{dm}^3 = 1$ Liter.',
     r'$2\pi \approx 6{,}28\ \mathrm{dm}^3 \approx 6{,}28$ Liter.'])

Q.q(r'Der Graph von $f(x) = \tfrac1x$ über $[1;\ b]$ rotiert um die $x$-Achse. Gegen welchen Wert strebt das Volumen für $b \to \infty$?',
    [r'$\pi$', r'Es wächst über alle Grenzen.', r'$2\pi$', r'$\tfrac{\pi}{2}$'],
    [r'$V(b) = \pi \int_1^b \tfrac{1}{x^2}\,\mathrm{d}x = \pi \left(1 - \tfrac1b\right)$, und das strebt gegen $\pi$.',
     r'Dieser unendlich lange Körper hat also ein endliches Volumen, obwohl seine Oberfläche unendlich groß ist. Evangelista Torricelli hat das 1643 entdeckt (Quelle: De solido hyperbolico acuto, gedruckt in seiner Opera geometrica, Florenz 1644); man nennt ihn Torricellis Trompete.'])


def check():
    x, r, h, b = sp.symbols('x r h b', positive=True)
    V = lambda f, a, c: sp.pi * sp.integrate(f**2, (x, a, c))
    assert V(sp.Integer(2), 0, 3) == 12*sp.pi
    assert V(x, 0, 3) == 9*sp.pi and sp.pi*sp.integrate(x, (x, 0, 3)) == sp.Rational(9, 2)*sp.pi
    assert V(sp.sqrt(x), 0, 4) == 8*sp.pi and sp.pi*sp.integrate(sp.sqrt(x), (x, 0, 4)) == sp.Rational(16, 3)*sp.pi
    assert V(x**2, 0, 1) == sp.pi/5
    assert sp.simplify(V(r/h*x, 0, h) - sp.pi*r**2*h/3) == 0
    assert sp.simplify(V(sp.sqrt(r**2 - x**2), -r, r) - sp.Rational(4, 3)*sp.pi*r**3) == 0
    assert sp.simplify(V(sp.sqrt(r**2 - x**2), 0, r) - sp.Rational(2, 3)*sp.pi*r**3) == 0
    assert sp.simplify(V(sp.exp(x), 0, 1) - sp.pi/2*(sp.E**2 - 1)) == 0 and abs(float(sp.pi/2*(sp.E**2 - 1)) - 10.04) < 0.005
    assert sp.integrate(sp.sin(x)**2, (x, 0, sp.pi)) == sp.pi/2 and V(sp.sin(x), 0, sp.pi) == sp.pi**2/2
    assert abs(float(sp.pi**2/2) - 4.93) < 0.005
    assert sp.solve(sp.Eq(V(sp.sqrt(x), 0, b), 8*sp.pi), b) == [4]
    assert sp.pi*sp.integrate(2**2 - 1**2, (x, 0, 3)) == 9*sp.pi and sp.pi*sp.integrate((2 - 1)**2, (x, 0, 3)) == 3*sp.pi
    vase = V(sp.Rational(1, 2)*x + 1, 0, 4)
    assert vase == sp.Rational(52, 3)*sp.pi and abs(float(vase) - 54.5) < 0.05
    assert abs(float(sp.Rational(26, 3)*sp.pi) - 27.2) < 0.05 and abs(float(8*sp.pi) - 25.1) < 0.05 and abs(float(sp.Rational(104, 3)*sp.pi) - 108.9) < 0.05
    assert sp.simplify(V(sp.sqrt(2*x), 0, h) / (sp.pi*2*h*h)) == sp.Rational(1, 2)
    assert abs(float(2*sp.pi) - 6.28) < 0.005
    assert sp.limit(V(1/x, 1, b), b, sp.oo) == sp.pi


Q.verify(check)
Q.save()
