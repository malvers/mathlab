#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 4 (LB 5): Integrieren mit Hilfsmitteln -
lineare Verkettungen, verkettete und verknüpfte Funktionen mit dem CAS, Ergebnisse durch
Ableiten bestätigen und deuten. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp

Q = gy12(nr=4, slug='integrieren-cas', thema='Integrieren mit Hilfsmitteln', lb='LB 5',
         blurb='lineare Verkettungen, CAS-Ergebnisse prüfen und deuten',
         comment='Blocks: lineare Verkettung von Hand (1-6, 10-12, 16), CAS-Ergebnis prüfen (7-9, 13, 15, 20), Anwendung (17), Grenzen des CAS (14, 18, 19). Mit CAS, aber Ergebnisse immer durch Ableiten bestätigen.')

Q.q(r'Berechne $\int \mathrm{e}^{2x}\,\mathrm{d}x$.',
    [r'$\tfrac12\,\mathrm{e}^{2x} + C$', r'$2\,\mathrm{e}^{2x} + C$', r'$\mathrm{e}^{2x} + C$', r'$\dfrac{\mathrm{e}^{2x+1}}{2x + 1} + C$'],
    [r'Lineare Verkettung: $\int f(ax + b)\,\mathrm{d}x = \tfrac1a F(ax + b) + C$.',
     r'Mit $a = 2$: $\tfrac12\,\mathrm{e}^{2x}$. Probe: $\left(\tfrac12\,\mathrm{e}^{2x}\right)^{\prime} = \mathrm{e}^{2x}$ ✔. $2\,\mathrm{e}^{2x}$ ist die Ableitung.'])

Q.q(r'Berechne $\int \sin(3x)\,\mathrm{d}x$.',
    [r'$-\tfrac13 \cos(3x) + C$', r'$-3\cos(3x) + C$', r'$\tfrac13 \cos(3x) + C$', r'$-\cos(3x) + C$'],
    [r'Stammfunktion von $\sin$ ist $-\cos$, wegen der inneren Ableitung $3$ teilt man durch $3$.',
     r'Probe: $\left(-\tfrac13 \cos(3x)\right)^{\prime} = \tfrac13 \sin(3x) \cdot 3 = \sin(3x)$ ✔'])

Q.q(r'Berechne $\int (2x + 1)^4\,\mathrm{d}x$.',
    [r'$\tfrac{1}{10} (2x + 1)^5 + C$', r'$\tfrac15 (2x + 1)^5 + C$', r'$\tfrac25 (2x + 1)^5 + C$', r'$8(2x + 1)^3 + C$'],
    [r'$\tfrac15 (2x + 1)^5$ und dann durch die innere Ableitung $2$ teilen: $\tfrac{1}{10}$.',
     r'Probe: $\left(\tfrac{1}{10}(2x + 1)^5\right)^{\prime} = \tfrac{5}{10}(2x + 1)^4 \cdot 2 = (2x + 1)^4$ ✔'])

Q.q(r'Berechne $\int \dfrac{1}{2x + 1}\,\mathrm{d}x$ für $x > -\tfrac12$.',
    [r'$\tfrac12 \ln(2x + 1) + C$', r'$\ln(2x + 1) + C$', r'$2\ln(2x + 1) + C$', r'$-\dfrac{2}{(2x + 1)^2} + C$'],
    [r'$\int \tfrac1u\,\mathrm{d}u = \ln u$, innere Funktion $2x + 1$ mit Ableitung $2$.',
     r'Also $\tfrac12 \ln(2x + 1) + C$. Probe: $\tfrac12 \cdot \dfrac{2}{2x + 1}$ ✔'])

Q.q(r'Berechne $\int \mathrm{e}^{-x/2}\,\mathrm{d}x$.',
    [r'$-2\,\mathrm{e}^{-x/2} + C$', r'$-\tfrac12\,\mathrm{e}^{-x/2} + C$', r'$2\,\mathrm{e}^{-x/2} + C$', r'$\mathrm{e}^{-x/2} + C$'],
    [r'Innere Ableitung von $-\tfrac{x}{2}$ ist $-\tfrac12$; durch $-\tfrac12$ teilen heißt mit $-2$ malnehmen.',
     r'Probe: $\left(-2\,\mathrm{e}^{-x/2}\right)^{\prime} = -2 \cdot \left(-\tfrac12\right)\mathrm{e}^{-x/2}$ ✔'])

Q.q(r'Berechne $\int \cos(\pi x)\,\mathrm{d}x$.',
    [r'$\dfrac{1}{\pi}\sin(\pi x) + C$', r'$\pi\sin(\pi x) + C$', r'$-\dfrac{1}{\pi}\sin(\pi x) + C$', r'$\sin(\pi x) + C$'],
    [r'$\int \cos u\,\mathrm{d}u = \sin u$, innere Ableitung $\pi$.',
     r'Ergebnis $\tfrac1\pi \sin(\pi x) + C$.'])

Q.q(r'Ein CAS liefert $\int x\,\mathrm{e}^x\,\mathrm{d}x = (x - 1)\,\mathrm{e}^x$. Berechne damit $\int_0^1 x\,\mathrm{e}^x\,\mathrm{d}x$.',
    [r'$1$', r'$0$', r'$\mathrm{e} - 1$', r'$-1$'],
    [r'Probe: $\left((x - 1)\,\mathrm{e}^x\right)^{\prime} = \mathrm{e}^x + (x - 1)\,\mathrm{e}^x = x\,\mathrm{e}^x$ ✔',
     r'$\left[(x - 1)\,\mathrm{e}^x\right]_0^1 = 0 - (-1) = 1$.'])

Q.q(r'Mit $\int x\cos x\,\mathrm{d}x = x\sin x + \cos x$: Berechne $\int_0^{\pi} x\cos x\,\mathrm{d}x$.',
    [r'$-2$', r'$0$', r'$2$', r'$\pi$'],
    [r'Obere Grenze: $\pi \sin\pi + \cos\pi = -1$. Untere Grenze: $0 + \cos 0 = 1$.',
     r'$-1 - 1 = -2$. Das Integral ist negativ, weil $x\cos x$ auf $(\tfrac\pi2;\ \pi)$ stärker negativ als vorher positiv ist.'])

Q.q(r'Zwei Rechner geben für $\int (2x + 2)\,\mathrm{d}x$ verschiedene Antworten: $(x + 1)^2$ und $x^2 + 2x$. Was stimmt?',
    [r'Beide sind richtig, sie unterscheiden sich um die Konstante $1$.', r'Nur $(x + 1)^2$ ist richtig.', r'Nur $x^2 + 2x$ ist richtig.', r'Keine ist richtig, es fehlt $+ C$ im Ergebnis.'],
    [r'Ableiten: $\left((x + 1)^2\right)^{\prime} = 2x + 2$ und $(x^2 + 2x)^{\prime} = 2x + 2$.',
     r'$(x + 1)^2 = x^2 + 2x + 1$: Stammfunktionen dürfen sich um eine Konstante unterscheiden.'])

Q.q(r'Berechne $\int_0^1 (3x + 1)^2\,\mathrm{d}x$.',
    [r'$7$', r'$\dfrac{64}{9}$', r'$21$', r'$\dfrac{16}{3}$'],
    [r'Stammfunktion: $\tfrac19 (3x + 1)^3$.',
     r'$\tfrac19 (64 - 1) = 7$. Wer die $1$ an der unteren Grenze vergisst, erhält $\tfrac{64}{9}$.'])

Q.q(r'Berechne $\int_0^2 \mathrm{e}^{0{,}5x}\,\mathrm{d}x$ auf zwei Nachkommastellen.',
    [r'$\approx 3{,}44$', r'$\approx 1{,}72$', r'$\approx 2{,}72$', r'$\approx 6{,}87$'],
    [r'Stammfunktion: $2\,\mathrm{e}^{0{,}5x}$.',
     r'$2\,\mathrm{e}^1 - 2\,\mathrm{e}^0 = 2(\mathrm{e} - 1) \approx 3{,}44$.'])

Q.q(r'Berechne $\int_0^{\pi} \sin(2x)\,\mathrm{d}x$.',
    [r'$0$', r'$2$', r'$1$', r'$-1$'],
    [r'Stammfunktion $-\tfrac12 \cos(2x)$: $-\tfrac12 \cos(2\pi) + \tfrac12 \cos 0 = -\tfrac12 + \tfrac12$.',
     r'$= 0$: Auf $[0;\ \pi]$ liegen eine positive und eine gleich große negative Halbwelle.'])

Q.q(r'Ein CAS liefert $\int \dfrac{x}{x^2 + 1}\,\mathrm{d}x = \tfrac12 \ln(x^2 + 1)$. Welche Probe bestätigt das?',
    [r'$\left(\tfrac12 \ln(x^2 + 1)\right)^{\prime} = \tfrac12 \cdot \dfrac{2x}{x^2 + 1} = \dfrac{x}{x^2 + 1}$', r'$\tfrac12 \ln(0^2 + 1) = 0$', r'$\left(\dfrac{x}{x^2 + 1}\right)^{\prime} = \tfrac12 \ln(x^2 + 1)$', r'$\ln(x^2 + 1) = \ln x^2 + \ln 1$'],
    [r'Eine Stammfunktion prüft man durch Ableiten, hier mit der Kettenregel.',
     r'Die innere Ableitung $2x$ hebt sich mit dem Faktor $\tfrac12$ zu $x$ im Zähler.'])

Q.q(r'Ein CAS gibt $\int \mathrm{e}^{-x^2}\,\mathrm{d}x$ nur mit einer besonderen Funktion an (der Fehlerfunktion). Was folgt daraus?',
    [r'Man kann bestimmte Integrale davon trotzdem numerisch berechnen.', r'Das Integral existiert nicht.', r'Die Fläche unter dem Graphen ist unendlich groß.', r'Der Rechner ist defekt.'],
    [r'Nicht jede Stammfunktion lässt sich mit den bekannten Funktionen hinschreiben.',
     r'Bestimmte Integrale wie $\int_0^1 \mathrm{e}^{-x^2}\,\mathrm{d}x \approx 0{,}747$ berechnet man numerisch, siehe Wahlbereich 5.'])

Q.q(r'Ein CAS liefert $\int \ln x\,\mathrm{d}x = x\ln x - x$. Berechne $\int_1^{\mathrm{e}} \ln x\,\mathrm{d}x$.',
    [r'$1$', r'$\mathrm{e} - 1$', r'$0$', r'$\mathrm{e}$'],
    [r'Obere Grenze: $\mathrm{e}\ln\mathrm{e} - \mathrm{e} = 0$, untere Grenze: $1 \cdot \ln 1 - 1 = -1$.',
     r'$0 - (-1) = 1$.'])

Q.q(r'Berechne $\int_0^2 \dfrac{1}{x + 1}\,\mathrm{d}x$ auf drei Nachkommastellen.',
    [r'$\approx 1{,}099$', r'$\approx 0{,}693$', r'$\approx 0{,}667$', r'$\approx 2{,}000$'],
    [r'Stammfunktion $\ln(x + 1)$.',
     r'$\ln 3 - \ln 1 = \ln 3 \approx 1{,}099$.'])

Q.q(r'In einen Tank fließen $r(t) = 20\,\mathrm{e}^{-0{,}1t}$ Liter pro Minute. Wie viel Wasser fließt in den ersten $10$ Minuten zu?',
    [r'$\approx 126{,}4$ l', r'$\approx 200{,}0$ l', r'$\approx 73{,}6$ l', r'$\approx 7{,}4$ l'],
    [r'$\int_0^{10} 20\,\mathrm{e}^{-0{,}1t}\,\mathrm{d}t = \left[-200\,\mathrm{e}^{-0{,}1t}\right]_0^{10}$.',
     r'$= -200\,\mathrm{e}^{-1} + 200 = 200(1 - \mathrm{e}^{-1}) \approx 126{,}4$ l. $7{,}4$ l/min ist die Rate am Ende.'])

Q.q(r'Ein CAS liefert $\int_0^{\pi} \sin^2 x\,\mathrm{d}x = \dfrac{\pi}{2}$. Welcher Wert ist das auf zwei Nachkommastellen?',
    [r'$\approx 1{,}57$', r'$\approx 3{,}14$', r'$\approx 0{,}79$', r'$\approx 2{,}00$'],
    [r'$\tfrac{\pi}{2} \approx 1{,}5708$.',
     r'Plausibel: $\sin^2 x$ liegt zwischen $0$ und $1$ und hat den Mittelwert $\tfrac12$, also etwa $\tfrac12 \cdot \pi$.'])

Q.q(r'Welche Antwort eines CAS für $\int \dfrac{2x + 3}{x^2 + 3x}\,\mathrm{d}x$ ($x > 0$) ist richtig?',
    [r'$\ln(x^2 + 3x) + C$', r'$\dfrac{x^2 + 3x}{\frac13 x^3 + \frac32 x^2} + C$', r'$(2x + 3)\ln x + C$', r'$\dfrac{1}{x^2 + 3x} + C$'],
    [r'Im Zähler steht die Ableitung des Nenners: $(x^2 + 3x)^{\prime} = 2x + 3$.',
     r'Dann ist $\ln(x^2 + 3x)$ eine Stammfunktion. Probe mit der Kettenregel ✔'])

Q.q(r'Berechne $\int_0^1 x^2\,\mathrm{e}^{x^3}\,\mathrm{d}x$ mit $\int x^2\,\mathrm{e}^{x^3}\,\mathrm{d}x = \tfrac13\,\mathrm{e}^{x^3}$.',
    [r'$\dfrac{\mathrm{e} - 1}{3} \approx 0{,}573$', r'$\dfrac{\mathrm{e}}{3} \approx 0{,}906$', r'$\mathrm{e} - 1 \approx 1{,}718$', r'$\dfrac13 \approx 0{,}333$'],
    [r'Probe: $\left(\tfrac13\,\mathrm{e}^{x^3}\right)^{\prime} = \tfrac13 \cdot 3x^2\,\mathrm{e}^{x^3}$ ✔',
     r'$\tfrac13 (\mathrm{e}^1 - \mathrm{e}^0) = \tfrac{\mathrm{e} - 1}{3} \approx 0{,}573$.'])


def check():
    x, t = sp.symbols('x t', positive=True)
    I = lambda f: sp.integrate(f, x)
    eq = lambda a, b: sp.simplify(a - b) == 0
    assert eq(I(sp.exp(2*x)), sp.exp(2*x)/2)
    assert eq(I(sp.sin(3*x)), -sp.cos(3*x)/3)
    assert eq(sp.diff((2*x + 1)**5/10, x), (2*x + 1)**4)
    assert eq(sp.diff(sp.log(2*x + 1)/2, x), 1/(2*x + 1))
    assert eq(I(sp.exp(-x/2)), -2*sp.exp(-x/2))
    assert eq(I(sp.cos(sp.pi*x)), sp.sin(sp.pi*x)/sp.pi)
    assert eq(sp.diff((x - 1)*sp.exp(x), x), x*sp.exp(x)) and sp.integrate(x*sp.exp(x), (x, 0, 1)) == 1
    assert eq(sp.diff(x*sp.sin(x) + sp.cos(x), x), x*sp.cos(x)) and sp.integrate(x*sp.cos(x), (x, 0, sp.pi)) == -2
    assert sp.expand((x + 1)**2 - (x**2 + 2*x)) == 1
    assert sp.integrate((3*x + 1)**2, (x, 0, 1)) == 7
    assert abs(float(sp.integrate(sp.exp(x/2), (x, 0, 2))) - 3.44) < 0.005
    assert sp.integrate(sp.sin(2*x), (x, 0, sp.pi)) == 0
    assert eq(sp.diff(sp.log(x**2 + 1)/2, x), x/(x**2 + 1))
    assert abs(float(sp.integrate(sp.exp(-x**2), (x, 0, 1))) - 0.747) < 0.0005
    assert sp.integrate(sp.log(x), (x, 1, sp.E)) == 1
    assert abs(float(sp.integrate(1/(x + 1), (x, 0, 2))) - 1.099) < 0.0005
    v = sp.integrate(20*sp.exp(-t/10), (t, 0, 10))
    assert abs(float(v) - 126.4) < 0.05 and abs(20*float(sp.exp(-1)) - 7.4) < 0.05
    assert sp.integrate(sp.sin(x)**2, (x, 0, sp.pi)) == sp.pi/2 and abs(float(sp.pi/2) - 1.57) < 0.005
    assert eq(sp.diff(sp.log(x**2 + 3*x), x), (2*x + 3)/(x**2 + 3*x))
    w = sp.integrate(x**2*sp.exp(x**3), (x, 0, 1))
    assert eq(w, (sp.E - 1)/3) and abs(float(w) - 0.573) < 0.0005


Q.verify(check)
Q.save()
