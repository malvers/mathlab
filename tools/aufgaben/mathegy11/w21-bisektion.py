#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 21 / KW 4 (WB 2): solving equations graphically and by
bisection. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=21, slug='bisektion', thema='Gleichungen grafisch lösen, Bisektionsmethode', lb='WB 2',
         blurb='Schnittpunkte deuten, Vorzeichenwechsel, Intervallhalbierung',
         comment='Blocks: graphical solving (1-5), sign change (6-9), bisection steps (10-15), accuracy and limits (16-20).')

# ------------------------------------------------------ graphical solving ----
Q.q(r'Warum lässt sich $e^x = 3 - x$ nicht mit den bekannten Umformungen nach $x$ auflösen?',
    [r'$x$ steht einmal im Exponenten und einmal als Summand; Logarithmieren hilft nicht.', r'Die Gleichung hat keine Lösung.',
     r'Man darf $e^x$ nicht logarithmieren.', r'Doch, mit $x = \ln 3$.'],
    [r'$\ln(3 - x) = x$ hat dasselbe Problem.',
     r'Solche Gleichungen löst man grafisch oder numerisch.'])

Q.q(r'Wie liest man die Lösung von $f(x) = g(x)$ aus den Graphen ab?',
    [r'Als $x$-Koordinate des Schnittpunkts beider Graphen.', r'Als $y$-Koordinate des Schnittpunkts.',
     r'Als Nullstelle von $f$.', r'Als Schnittpunkt mit der $y$-Achse.'],
    [r'Im Schnittpunkt haben beide Funktionen denselben Funktionswert.',
     r'Gesucht ist die Stelle $x$, an der das passiert.'])

Q.q(r'Wie formt man $e^x = 3 - x$ in eine Nullstellenaufgabe um?',
    [r'$h(x) = e^x + x - 3 = 0$', r'$h(x) = e^x - x - 3 = 0$', r'$h(x) = e^x \cdot (3 - x) = 0$', r'$h(x) = e^{3 - x} = 0$'],
    [r'Alles auf eine Seite bringen.',
     r'Die Lösung der Gleichung ist die Nullstelle von $h$.'])

Q.q(r'Wie viele Lösungen hat $x^2 = 2^x$?',
    [r'Drei', r'Zwei', r'Eine', r'Keine'],
    [r'Sofort sieht man $x = 2$ und $x = 4$.',
     r'Für negative $x$ fällt $x^2$ von oben, $2^x$ geht gegen 0: ein dritter Schnittpunkt bei $x \approx -0{,}77$.',
     r'Erst die Skizze zeigt alle Lösungen.'])

Q.q(r'Löse $x^2 = x + 2$ grafisch (Normalparabel und Gerade).',
    [r'$x = -1$ und $x = 2$', r'$x = 1$ und $x = -2$', r'$x = 2$', r'Keine Lösung'],
    [r'Schnittpunkte $(-1 \mid 1)$ und $(2 \mid 4)$.',
     r'Rechnerische Probe: $x^2 - x - 2 = (x - 2)(x + 1) = 0$.'])

# ------------------------------------------------------------- sign change ----
Q.q(r'$h(x) = e^x + x - 3$: Es gilt $h(0) = -2$ und $h(1) \approx 0{,}72$. Was folgt?',
    [r'Zwischen 0 und 1 liegt mindestens eine Nullstelle.', r'Zwischen 0 und 1 liegt keine Nullstelle.',
     r'Die Nullstelle ist genau 0,5.', r'Es folgt nichts.'],
    [r'$h$ ist stetig und wechselt das Vorzeichen.',
     r'Der Graph muss die $x$-Achse dazwischen kreuzen (Nullstellensatz).'])

Q.q(r'Was braucht die Bisektionsmethode am Start?',
    [r'Eine stetige Funktion und ein Intervall $[a;\,b]$ mit $h(a) \cdot h(b) < 0$.', r'Die Ableitung der Funktion.',
     r'Einen Startwert in der Nähe der Nullstelle, sonst nichts.', r'Eine Funktion ohne Extrema.'],
    [r'$h(a) \cdot h(b) < 0$ heißt: verschiedene Vorzeichen an den Rändern.',
     r'Ableitungen braucht erst das Newton-Verfahren.'])

Q.q(r'In welchem Intervall liegt eine Nullstelle von $h(x) = x^3 + x - 1$?',
    [r'$[0;\,1]$', r'$[1;\,2]$', r'$[-1;\,0]$', r'$[2;\,3]$'],
    [r'$h(0) = -1$, $h(1) = 1$: Vorzeichenwechsel.',
     r'$h(-1) = -3$ und $h(2) = 9$ helfen bei den anderen Intervallen nicht.'])

Q.q(r'In welchem Intervall liegt die Lösung von $\cos x = x$?',
    [r'$[0;\,1]$', r'$[1;\,2]$', r'$[-1;\,0]$', r'$[2;\,3]$'],
    [r'$h(x) = \cos x - x$: $h(0) = 1$, $h(1) \approx 0{,}54 - 1 = -0{,}46$.',
     r'Vorzeichenwechsel zwischen 0 und 1.'])

# --------------------------------------------------------- bisection steps ----
Q.q(r'Bisektion für $h(x) = e^x + x - 3$ auf $[0;\,1]$: Es ist $h(0{,}5) \approx -0{,}85$. Wie heißt das neue Intervall?',
    [r'$[0{,}5;\,1]$', r'$[0;\,0{,}5]$', r'$[0{,}25;\,0{,}75]$', r'$[0;\,1]$'],
    [r'$h(0{,}5) < 0$ und $h(1) > 0$: Der Vorzeichenwechsel liegt rechts.',
     r'Neues Intervall $[0{,}5;\,1]$.'])

Q.q(r'Weiter: $h(0{,}75) \approx -0{,}13$. Wie heißt das neue Intervall?',
    [r'$[0{,}75;\,1]$', r'$[0{,}5;\,0{,}75]$', r'$[0;\,0{,}75]$', r'$[0{,}625;\,0{,}875]$'],
    [r'$h(0{,}75) < 0$, $h(1) > 0$.',
     r'Die Nullstelle liegt in $[0{,}75;\,1]$; tatsächlich bei etwa 0,79.'])

Q.q(r'Bisektion für $h(x) = x^3 + x - 1$ auf $[0;\,1]$. Welcher Mittelpunkt wird zuerst berechnet und welches Intervall folgt?',
    [r'$h(0{,}5) = -0{,}375$, also $[0{,}5;\,1]$', r'$h(0{,}5) = 0{,}375$, also $[0;\,0{,}5]$', r'$h(0{,}5) = -0{,}375$, also $[0;\,0{,}5]$', r'$h(1) = 1$, also $[1;\,2]$'],
    [r'$0{,}5^3 + 0{,}5 - 1 = 0{,}125 - 0{,}5 = -0{,}375$',
     r'Negativ, und $h(1) > 0$: weiter mit $[0{,}5;\,1]$.'])

Q.q(r'Die CAS-Tabelle für $h(x) = x^3 - 2x - 1$ zeigt $h(1{,}6) = -0{,}104$ und $h(1{,}7) = 0{,}513$. Was folgt?',
    [r'Eine Nullstelle liegt zwischen 1,6 und 1,7.', r'Die Nullstelle ist 1,6.', r'Zwischen 1,6 und 1,7 liegt keine Nullstelle.', r'Die Nullstelle ist 1,65.'],
    [r'Vorzeichenwechsel zwischen den beiden Tabellenwerten.',
     r'Exakt ist es $\dfrac{1 + \sqrt{5}}{2} \approx 1{,}618$, der Goldene Schnitt.'])

Q.q(r'In welchem Intervall liegt die Lösung von $\ln x = 2 - x$?',
    [r'$[1;\,2]$', r'$[0;\,1]$', r'$[2;\,3]$', r'$[3;\,4]$'],
    [r'$h(x) = \ln x + x - 2$: $h(1) = -1$, $h(2) = \ln 2 \approx 0{,}69$.',
     r'Vorzeichenwechsel zwischen 1 und 2.'])

Q.q(r'Was ist nach einem Bisektionsschritt immer garantiert?',
    [r'Das Intervall mit der Nullstelle ist halb so lang wie vorher.', r'Man hat die Nullstelle exakt gefunden.',
     r'Der Mittelpunkt ist näher an der Nullstelle als vorher.', r'Das Intervall wird um 0,1 kürzer.'],
    [r'Jeder Schritt halbiert die Intervallbreite.',
     r'Ob der neue Mittelpunkt näher liegt, ist nicht garantiert, die Einschachtelung aber schon.'])

# ---------------------------------------------------- accuracy and limits ----
Q.q(r'Ein Startintervall hat die Länge 1. Wie lang ist es nach 10 Bisektionsschritten?',
    [r'$\dfrac{1}{1024}$, also kleiner als 0,001', r'$\dfrac{1}{10}$', r'$\dfrac{1}{20}$', r'$\dfrac{1}{100}$'],
    [r'Jeder Schritt halbiert: $\left(\dfrac{1}{2}\right)^{10} = \dfrac{1}{1024}$'])

Q.q(r'Wie viele Schritte braucht man mindestens, damit ein Intervall der Länge 1 kürzer als 0,01 wird?',
    [r'7', r'10', r'100', r'5'],
    [r'$2^6 = 64 < 100$, $2^7 = 128 > 100$.',
     r'Nach 7 Schritten ist die Länge $\dfrac{1}{128} < 0{,}01$.'])

Q.q(r'Ein Intervall $[2;\,3]$ wird dreimal halbiert. Wie lang ist es danach?',
    [r'0,125', r'0,25', r'0,333', r'0,5'],
    [r'$1 \cdot \left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$'])

Q.q(r'Warum findet die Bisektion die Nullstelle von $h(x) = (x - 1)^2$ nicht?',
    [r'$h$ hat bei der doppelten Nullstelle keinen Vorzeichenwechsel.', r'Weil $h$ nicht stetig ist.',
     r'Weil die Nullstelle eine ganze Zahl ist.', r'Sie findet sie, nur langsam.'],
    [r'$h(x) \geq 0$ überall: Es gibt kein Intervall mit verschiedenen Vorzeichen.',
     r'Berührpunkte bleiben der Bisektion verborgen.'])

Q.q(r'Welche Aussage über grafisches Lösen und Bisektion stimmt?',
    [r'Die Skizze verschafft den Überblick, die Bisektion liefert beliebig genaue Näherungen.', r'Die Skizze liefert exakte Lösungen.',
     r'Die Bisektion findet immer alle Lösungen.', r'Die Bisektion ist schneller als jedes andere Verfahren.'],
    [r'Aus der Skizze kommen Anzahl und grobe Lage der Lösungen.',
     r'Die Bisektion ist zuverlässig, aber langsam: ein Bit Genauigkeit pro Schritt.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    h = sp.exp(x) + x - 3
    assert h.subs(x, 0) == -2 and abs(float(h.subs(x, 1)) - 0.72) < 0.01
    assert abs(float(h.subs(x, 0.5)) + 0.85) < 0.01 and abs(float(h.subs(x, 0.75)) + 0.13) < 0.01
    r = sp.nsolve(h, x, 0.8)
    assert 0.75 < r < 1 and abs(r - 0.79) < 0.01
    assert sorted(sp.solve(x ** 2 - x - 2, x)) == [-1, 2]
    assert 2 ** 2 == 2 ** 2 and 4 ** 2 == 2 ** 4
    neg = sp.nsolve(x ** 2 - 2 ** x, x, -0.8)
    assert abs(neg + 0.767) < 0.001
    g = x ** 3 + x - 1
    assert g.subs(x, 0) == -1 and g.subs(x, 1) == 1 and g.subs(x, sp.Rational(1, 2)) == -sp.Rational(3, 8)
    c = sp.cos(x) - x
    assert c.subs(x, 0) == 1 and float(c.subs(x, 1)) < 0
    k = x ** 3 - 2 * x - 1
    assert abs(float(k.subs(x, 1.6)) + 0.104) < 1e-9 and abs(float(k.subs(x, 1.7)) - 0.513) < 1e-9
    assert sp.simplify(k.subs(x, (1 + sp.sqrt(5)) / 2)) == 0
    l = sp.log(x) + x - 2
    assert l.subs(x, 1) == -1 and abs(float(l.subs(x, 2)) - 0.69) < 0.01
    assert sp.Rational(1, 2) ** 10 == sp.Rational(1, 1024) and 2 ** 6 < 100 < 2 ** 7
    assert sp.Rational(1, 2) ** 3 == sp.Rational(1, 8)


Q.verify(check)
Q.save()
