#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 16 / KW 51 (LB 1): quadratische Gleichungen,
Nullprodukt, Termstrukturen, Loesungsformel und Vieta.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=16, slug='quadratische-gleichungen', thema='Quadratische Gleichungen', lb='LB 1',
          blurb='reinquadratische Gleichungen, Nullprodukt, Lösungsformel, Satz von Vieta, Diskriminante',
          comment='Blocks: reinquadratische Gleichungen (1-6), Nullprodukt und Ausklammern (7-11), Loesungsformel und Vieta (12-16), Diskriminante und Anwendungen (17-20).')

# ------------------------------------------- reinquadratische Gleichungen ----
Q.q(r'Löse: $x^2 = 16$.',
    [r'$x = 4$ und $x = -4$', r'nur $x = 4$', r'$x = 8$', r'$x = 256$'],
    [r'Beide Zahlen mit dem Quadrat $16$ kommen in Frage.',
     r'$x = \pm\sqrt{16} = \pm 4$',
     r'Das negative Vorzeichen wird gern vergessen — $(-4)^2$ ist ebenfalls $16$.'])

Q.q(r'Löse: $x^2 = 0$.',
    [r'$x = 0$ als doppelte Lösung', r'$x = 0$ und $x = 1$',
     r'keine Lösung', r'unendlich viele Lösungen'],
    [r'Ein Produkt ist genau dann null, wenn ein Faktor null ist.',
     r'$x \cdot x = 0$ ergibt nur $x = 0$.',
     r'Man spricht von einer doppelten Nullstelle: der Graph berührt die $x$-Achse.'])

Q.q(r'Löse in $\mathbb{R}$: $x^2 = -4$.',
    [r'Es gibt keine reelle Lösung.', r'$x = -2$', r'$x = 2$ und $x = -2$', r'$x = 4$'],
    [r'Ein Quadrat ist im Reellen nie negativ.',
     r'Es gibt also keine reelle Zahl mit $x^2 = -4$.',
     r'Die Lösungsmenge ist leer: $L = \{\}$.'])

Q.q(r'Löse: $2x^2 = 18$.',
    [r'$x = 3$ und $x = -3$', r'$x = 9$ und $x = -9$', r'nur $x = 3$', r'$x = 6$'],
    [r'Durch $2$ teilen: $x^2 = 9$.',
     r'$x = \pm 3$',
     r'Erst isolieren, dann die Wurzel ziehen.'])

Q.q(r'Löse: $x^2 - 9 = 0$.',
    [r'$x = 3$ und $x = -3$', r'$x = 9$', r'nur $x = 3$', r'keine Lösung'],
    [r'Entweder $x^2 = 9$ und daraus $x = \pm 3$.',
     r'Oder über die dritte binomische Formel: $(x+3)(x-3) = 0$.',
     r'Beide Wege liefern dasselbe Ergebnis.'])

Q.q(r'Löse: $(x - 2)^2 = 9$.',
    [r'$x = 5$ und $x = -1$', r'$x = 5$ und $x = 1$', r'nur $x = 5$', r'$x = 11$ und $x = -7$'],
    [r'Wurzel ziehen, beide Vorzeichen beachten: $x - 2 = 3$ oder $x - 2 = -3$.',
     r'$x = 5$ oder $x = -1$',
     r'Probe: $(5-2)^2 = 9$ und $(-1-2)^2 = 9$.'])

# --------------------------------------------- Nullprodukt und Ausklammern ----
Q.q(r'Wie lautet der Nullproduktsatz?',
    [r'Ein Produkt ist genau dann null, wenn mindestens einer der Faktoren null ist.',
     r'Ein Produkt ist genau dann null, wenn alle Faktoren null sind.',
     r'Eine Summe ist genau dann null, wenn ein Summand null ist.',
     r'Ein Produkt ist nie null.'],
    [r'Er ist der Schlüssel zum Lösen faktorisierter Gleichungen.',
     r'Aus $a \cdot b = 0$ folgt $a = 0$ oder $b = 0$.',
     r'Deshalb lohnt es sich, eine quadratische Gleichung in Faktoren zu zerlegen.'])

Q.q(r'Löse: $x\,(x - 5) = 0$.',
    [r'$x = 0$ und $x = 5$', r'nur $x = 5$', r'$x = 0$ und $x = -5$', r'keine Lösung'],
    [r'Nullproduktsatz: ein Faktor muss null sein.',
     r'$x = 0$ oder $x - 5 = 0$.',
     r'Also $x = 0$ oder $x = 5$. Wer durch $x$ teilt, verliert die Lösung $x = 0$.'])

Q.q(r'Löse: $(x + 1)(x - 4) = 0$.',
    [r'$x = -1$ und $x = 4$', r'$x = 1$ und $x = -4$', r'$x = 1$ und $x = 4$', r'$x = -1$ und $x = -4$'],
    [r'Jeder Faktor wird für sich null gesetzt.',
     r'$x + 1 = 0$ ergibt $x = -1$; $x - 4 = 0$ ergibt $x = 4$.',
     r'In den Linearfaktoren stehen die Nullstellen mit umgekehrtem Vorzeichen.'])

Q.q(r'Löse: $x^2 - 3x = 0$.',
    [r'$x = 0$ und $x = 3$', r'nur $x = 3$', r'$x = 0$ und $x = -3$', r'$x = 3$ und $x = -3$'],
    [r'$x$ ausklammern: $x\,(x - 3) = 0$.',
     r'$x = 0$ oder $x = 3$.',
     r'Ohne Absolutglied lohnt immer das Ausklammern statt der Lösungsformel.'])

Q.q(r'Löse: $2x^2 + 6x = 0$.',
    [r'$x = 0$ und $x = -3$', r'$x = 0$ und $x = 3$', r'nur $x = -3$', r'$x = -3$ und $x = 3$'],
    [r'$2x$ ausklammern: $2x\,(x + 3) = 0$.',
     r'$x = 0$ oder $x + 3 = 0$.',
     r'Also $x = 0$ oder $x = -3$.'])

# ---------------------------------------------- Lösungsformel und Vieta ----
Q.q(r'Löse: $x^2 + 2x - 8 = 0$.',
    [r'$x = 2$ und $x = -4$', r'$x = -2$ und $x = 4$', r'$x = 2$ und $x = 4$', r'$x = -2$ und $x = -4$'],
    [r'Lösungsformel: $x = \dfrac{-2 \pm \sqrt{4 + 32}}{2} = \dfrac{-2 \pm 6}{2}$',
     r'$x_1 = 2$ und $x_2 = -4$',
     r'Probe über Vieta: Summe $-2$, Produkt $-8$ — stimmt.'])

Q.q(r'Löse: $x^2 - 7x + 12 = 0$.',
    [r'$x = 3$ und $x = 4$', r'$x = -3$ und $x = -4$', r'$x = 2$ und $x = 6$', r'$x = 1$ und $x = 12$'],
    [r'Nach Vieta zwei Zahlen mit der Summe $7$ und dem Produkt $12$ suchen.',
     r'Das sind $3$ und $4$.',
     r'Probe: $9 - 21 + 12 = 0$.'])

Q.q(r'Wie lautet der Satz von Vieta für $x^2 + px + q = 0$?',
    [r'$x_1 + x_2 = -p$ und $x_1 \cdot x_2 = q$', r'$x_1 + x_2 = p$ und $x_1 \cdot x_2 = q$',
     r'$x_1 + x_2 = q$ und $x_1 \cdot x_2 = p$', r'$x_1 - x_2 = p$ und $x_1 \cdot x_2 = -q$'],
    [r'Die Summe der Lösungen ist das Negative des Koeffizienten bei $x$.',
     r'Das Produkt ist das Absolutglied.',
     r'Probe an $x^2 - 7x + 12$: Summe $7$, Produkt $12$ — die Lösungen $3$ und $4$ passen.'])

Q.q(r'Löse: $x^2 - 5x + 6 = 0$.',
    [r'$x = 2$ und $x = 3$', r'$x = -2$ und $x = -3$', r'$x = 1$ und $x = 6$', r'$x = 5$ und $x = 6$'],
    [r'Vieta: Summe $5$, Produkt $6$.',
     r'Das sind $2$ und $3$.',
     r'Probe: $4 - 10 + 6 = 0$ und $9 - 15 + 6 = 0$.'])

Q.q(r'Löse: $x^2 + 4x + 4 = 0$.',
    [r'$x = -2$ als doppelte Lösung', r'$x = 2$ als doppelte Lösung',
     r'$x = -2$ und $x = 2$', r'keine reelle Lösung'],
    [r'Der Term ist ein vollständiges Quadrat: $(x + 2)^2 = 0$.',
     r'Daraus folgt nur $x = -2$.',
     r'Der Graph berührt die $x$-Achse, er schneidet sie nicht.'])

# ------------------------------------ Diskriminante und Anwendungen ----
Q.q(r'Was sagt die Diskriminante $D = p^2 - 4q$ bzw. der Term unter der Wurzel aus?',
    [r'$D > 0$: zwei Lösungen, $D = 0$: eine doppelte, $D < 0$: keine reelle Lösung',
     r'$D > 0$: keine Lösung, $D < 0$: zwei Lösungen',
     r'$D$ gibt den Scheitelpunkt an',
     r'$D$ gibt die Summe der Lösungen an'],
    [r'Unter der Wurzel der Lösungsformel steht die Diskriminante.',
     r'Ist sie positiv, liefert $\pm$ zwei verschiedene Werte.',
     r'Ist sie null, fallen beide zusammen; ist sie negativ, gibt es im Reellen keine Wurzel.'])

Q.q(r'Wie viele reelle Lösungen hat $x^2 + x + 1 = 0$?',
    [r'keine', r'eine', r'zwei', r'unendlich viele'],
    [r'Diskriminante: $1^2 - 4 \cdot 1 \cdot 1 = -3$.',
     r'Sie ist negativ.',
     r'Also gibt es keine reelle Lösung; der Graph schneidet die $x$-Achse nicht.'])

Q.q(r'Ein Rechteck ist um $3\,\mathrm{cm}$ länger als breit und hat den Flächeninhalt $40\,\mathrm{cm^2}$. Wie breit ist es?',
    [r'$5\,\mathrm{cm}$', r'$8\,\mathrm{cm}$', r'$4\,\mathrm{cm}$', r'$10\,\mathrm{cm}$'],
    [r'Ansatz: $b\,(b + 3) = 40$, also $b^2 + 3b - 40 = 0$.',
     r'Vieta: zwei Zahlen mit der Summe $-3$ und dem Produkt $-40$ sind $5$ und $-8$.',
     r'Negative Längen entfallen, also $b = 5\,\mathrm{cm}$ und $l = 8\,\mathrm{cm}$. Probe: $40\,\mathrm{cm^2}$.'])

Q.q(r'Ein Stein fliegt nach $h(t) = -5t^2 + 10t + 15$ (Höhe in Metern). Wann trifft er den Boden?',
    [r'nach $3$ Sekunden', r'nach $1$ Sekunde', r'nach $5$ Sekunden', r'nach $15$ Sekunden'],
    [r'Boden bedeutet $h(t) = 0$: $-5t^2 + 10t + 15 = 0$.',
     r'Durch $-5$ teilen: $t^2 - 2t - 3 = 0$, also $t = 3$ oder $t = -1$.',
     r'Eine negative Zeit ist im Sachzusammenhang sinnlos, also $t = 3$ Sekunden.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, t, b = sp.symbols('x t b')
    assert sp.solve(x ** 2 - 16, x) == [-4, 4] and (-4) ** 2 == 16
    assert sp.solve(x ** 2, x) == [0]
    assert sp.solveset(sp.Eq(x ** 2, -4), x, sp.S.Reals) == sp.S.EmptySet
    assert sp.solve(2 * x ** 2 - 18, x) == [-3, 3]
    assert sp.solve(x ** 2 - 9, x) == [-3, 3] and sp.factor(x ** 2 - 9) == (x - 3) * (x + 3)
    assert sp.solve((x - 2) ** 2 - 9, x) == [-1, 5] and (5 - 2) ** 2 == 9 == (-1 - 2) ** 2
    # Nullprodukt
    assert sp.solve(x * (x - 5), x) == [0, 5]
    assert sp.solve((x + 1) * (x - 4), x) == [-1, 4]
    assert sp.solve(x ** 2 - 3 * x, x) == [0, 3] and sp.factor(x ** 2 - 3 * x) == x * (x - 3)
    assert sp.solve(2 * x ** 2 + 6 * x, x) == [-3, 0] and sp.factor(2 * x ** 2 + 6 * x) == 2 * x * (x + 3)
    # Loesungsformel und Vieta
    assert sp.solve(x ** 2 + 2 * x - 8, x) == [-4, 2] and 2 + (-4) == -2 and 2 * (-4) == -8
    assert 4 + 32 == 36 and F(-2 + 6, 2) == 2 and F(-2 - 6, 2) == -4
    assert sp.solve(x ** 2 - 7 * x + 12, x) == [3, 4] and 3 + 4 == 7 and 3 * 4 == 12
    assert sp.solve(x ** 2 - 5 * x + 6, x) == [2, 3] and 2 + 3 == 5 and 2 * 3 == 6
    assert sp.solve(x ** 2 + 4 * x + 4, x) == [-2] and sp.factor(x ** 2 + 4 * x + 4) == (x + 2) ** 2
    # Diskriminante und Anwendungen
    assert 1 ** 2 - 4 * 1 * 1 == -3
    assert sp.solveset(x ** 2 + x + 1, x, sp.S.Reals) == sp.S.EmptySet
    assert sp.solve(b ** 2 + 3 * b - 40, b) == [-8, 5] and 5 * (5 + 3) == 40
    h = -5 * t ** 2 + 10 * t + 15
    assert sp.solve(h, t) == [-1, 3] and h.subs(t, 3) == 0 and h.subs(t, 0) == 15


Q.verify(check)
Q.save()
