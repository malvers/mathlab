#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 20 / KW 3 (LB 1): ganzrationale Funktionen dritten und
hoeheren Grades - Linearfaktorzerlegung, Substitution, Kurvenverlauf.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=20, slug='ganzrationale', thema='Ganzrationale Funktionen', lb='LB 1',
          blurb='Grad und Verhalten im Unendlichen, Linearfaktorzerlegung, Substitution, Vielfachheit, Symmetrie',
          comment='Blocks: Grad und Verhalten im Unendlichen (1-5), Nullstellen durch Ausklammern und Linearfaktoren (6-11), Substitution (12-15), Vielfachheit und Symmetrie (16-20).')

# --------------------------------------- Grad und Verhalten im Unendlichen ----
Q.q(r'Welchen Grad hat $f(x) = 3x^5 - 2x^2 + 1$?',
    [r'den Grad $5$', r'den Grad $3$', r'den Grad $8$', r'den Grad $2$'],
    [r'Der Grad ist der höchste vorkommende Exponent von $x$.',
     r'Hier ist das $5$.',
     r'Die $3$ davor ist der Leitkoeffizient, nicht der Grad.'])

Q.q(r'Wie verhält sich $f(x) = 3x^5 - 2x^2 + 1$ für $x \to +\infty$?',
    [r'$f(x) \to +\infty$', r'$f(x) \to -\infty$', r'$f(x) \to 1$', r'$f(x) \to 3$'],
    [r'Entscheidend ist der Term höchsten Grades $3x^5$.',
     r'Ungerader Grad mit positivem Leitkoeffizienten: für große $x$ wächst er über alle Grenzen.',
     r'Probe: $f(10) = 300\,000 - 200 + 1$, also deutlich positiv.'])

Q.q(r'Wie verhält sich $f(x) = 3x^5 - 2x^2 + 1$ für $x \to -\infty$?',
    [r'$f(x) \to -\infty$', r'$f(x) \to +\infty$', r'$f(x) \to 0$', r'$f(x) \to 1$'],
    [r'Bei ungeradem Grad behält der führende Term das Vorzeichen des Arguments.',
     r'$3 \cdot (-10)^5 = -300\,000$',
     r'Der Graph verläuft also von links unten nach rechts oben.'])

Q.q(r'Wie verhält sich $f(x) = -x^4 + 2x$ für $x \to \pm\infty$?',
    [r'beide Male $f(x) \to -\infty$', r'beide Male $f(x) \to +\infty$',
     r'$f(x) \to +\infty$ bzw. $f(x) \to -\infty$', r'$f(x) \to 0$'],
    [r'Der führende Term ist $-x^4$: gerader Grad, negativer Leitkoeffizient.',
     r'Gerader Grad bedeutet gleiches Verhalten auf beiden Seiten.',
     r'Das Minus zieht beide Äste nach unten.'])

Q.q(r'Welcher Term bestimmt das Verhalten einer ganzrationalen Funktion im Unendlichen?',
    [r'der Term mit dem höchsten Exponenten', r'das Absolutglied',
     r'der Term mit dem größten Koeffizienten', r'alle Terme gleichermaßen'],
    [r'Für große $\left|x\right|$ wächst die höchste Potenz am schnellsten.',
     r'Beispiel bei $x = 100$: $x^4 = 100\,000\,000$, aber $50x^2 = 500\,000$.',
     r'Der Term höchsten Grades überwiegt alle anderen.'])

# --------------------------- Nullstellen durch Ausklammern und Linearfaktoren ----
Q.q(r'Wie lauten die Nullstellen von $f(x) = x^3 - 4x$?',
    [r'$x = 0$, $x = 2$ und $x = -2$', r'$x = 0$ und $x = 4$',
     r'$x = 2$ und $x = -2$', r'$x = 0$ und $x = 2$'],
    [r'$x$ ausklammern: $x\,(x^2 - 4) = 0$.',
     r'Zweiter Faktor über die dritte binomische Formel: $x\,(x-2)(x+2)$.',
     r'Nullstellen $0$, $2$ und $-2$.'])

Q.q(r'Wie lauten die Nullstellen von $f(x) = x^3 - x^2$?',
    [r'$x = 0$ (doppelt) und $x = 1$', r'$x = 0$ und $x = -1$',
     r'nur $x = 1$', r'$x = 1$ und $x = -1$'],
    [r'$x^2$ ausklammern: $x^2\,(x - 1) = 0$.',
     r'$x^2 = 0$ liefert die doppelte Nullstelle $0$.',
     r'$x - 1 = 0$ liefert $x = 1$.'])

Q.q(r'Wie lauten die reellen Nullstellen von $f(x) = x^4 - 16$?',
    [r'$x = 2$ und $x = -2$', r'$x = 4$ und $x = -4$',
     r'$x = 2$, $x = -2$, $x = 4$ und $x = -4$', r'nur $x = 2$'],
    [r'Dritte binomische Formel: $x^4 - 16 = (x^2 - 4)(x^2 + 4)$.',
     r'$x^2 - 4 = 0$ ergibt $x = \pm 2$.',
     r'$x^2 + 4 = 0$ hat im Reellen keine Lösung, denn $x^2$ ist nie negativ.'])

Q.q(r'Wie lauten die Nullstellen von $f(x) = (x - 1)(x + 2)(x - 3)$?',
    [r'$x = 1$, $x = -2$ und $x = 3$', r'$x = -1$, $x = 2$ und $x = -3$',
     r'$x = 1$, $x = 2$ und $x = 3$', r'$x = 6$'],
    [r'Nullproduktsatz: jeder Faktor wird für sich null gesetzt.',
     r'$x = 1$, $x = -2$, $x = 3$.',
     r'Die Funktion hat den Grad $3$ und hier die größtmögliche Zahl von drei Nullstellen.'])

Q.q(r'Wie viele Nullstellen kann eine ganzrationale Funktion vierten Grades höchstens haben?',
    [r'vier', r'zwei', r'drei', r'beliebig viele'],
    [r'Jede Nullstelle entspricht einem Linearfaktor.',
     r'Beim Ausmultiplizieren von mehr als vier Linearfaktoren entstünde ein höherer Grad.',
     r'Also höchstens vier — es können auch weniger sein.'])

Q.q(r'Wie lauten die Nullstellen von $f(x) = x^3 + x^2 - 6x$?',
    [r'$x = 0$, $x = -3$ und $x = 2$', r'$x = 0$, $x = 3$ und $x = -2$',
     r'$x = -3$ und $x = 2$', r'$x = 0$ und $x = 6$'],
    [r'$x$ ausklammern: $x\,(x^2 + x - 6) = 0$.',
     r'Die Klammer über Vieta: zwei Zahlen mit Summe $-1$ und Produkt $-6$, also $-3$ und $2$.',
     r'$f(x) = x\,(x+3)(x-2)$, Nullstellen $0$, $-3$ und $2$.'])

# ----------------------------------------------------------- Substitution ----
Q.q(r'Löse mit Substitution: $x^4 - 5x^2 + 4 = 0$.',
    [r'$x = \pm 1$ und $x = \pm 2$', r'$x = 1$ und $x = 4$',
     r'$x = \pm 2$', r'keine reelle Lösung'],
    [r'Substitution $u = x^2$: $u^2 - 5u + 4 = 0$.',
     r'Vieta: $u_1 = 1$ und $u_2 = 4$.',
     r'Rücksubstitution: $x^2 = 1$ ergibt $\pm 1$, $x^2 = 4$ ergibt $\pm 2$ — vier Nullstellen.'])

Q.q(r'Löse mit Substitution: $x^4 - 13x^2 + 36 = 0$.',
    [r'$x = \pm 2$ und $x = \pm 3$', r'$x = \pm 4$ und $x = \pm 9$',
     r'$x = \pm 6$', r'$x = 4$ und $x = 9$'],
    [r'$u = x^2$: $u^2 - 13u + 36 = 0$ mit den Lösungen $u = 4$ und $u = 9$.',
     r'Rücksubstitution: $x = \pm 2$ und $x = \pm 3$.',
     r'Die Werte $4$ und $9$ sind nur die Zwischenergebnisse, nicht die Nullstellen.'])

Q.q(r'Warum hilft die Substitution $u = x^2$ bei $x^4 + b\,x^2 + c = 0$?',
    [r'Weil die Gleichung dadurch quadratisch wird und die Lösungsformel gilt.',
     r'Weil sich der Grad dadurch halbiert und die Gleichung linear wird.',
     r'Weil man so die Nullstellen sofort ablesen kann.',
     r'Weil nur so alle Lösungen gefunden werden.'],
    [r'Eine Gleichung vierten Grades lässt sich nicht direkt mit der Lösungsformel behandeln.',
     r'Mit $u = x^2$ entsteht $u^2 + bu + c = 0$, also eine quadratische Gleichung.',
     r'Nach dem Lösen muss unbedingt zurücksubstituiert werden: aus jedem positiven $u$ werden zwei Werte für $x$.'])

Q.q(r'Wie viele reelle Lösungen hat $x^4 + 3x^2 + 2 = 0$?',
    [r'keine', r'zwei', r'vier', r'eine'],
    [r'$u = x^2$: $u^2 + 3u + 2 = 0$ mit den Lösungen $u = -1$ und $u = -2$.',
     r'Beide sind negativ.',
     r'Aus $x^2 = -1$ bzw. $x^2 = -2$ folgt im Reellen nichts — es gibt keine Lösung.'])

# ------------------------------------------ Vielfachheit und Symmetrie ----
Q.q(r'Was bedeutet eine doppelte Nullstelle für den Graphen?',
    [r'Der Graph berührt die $x$-Achse dort, ohne sie zu durchsetzen.',
     r'Der Graph schneidet die $x$-Achse dort besonders steil.',
     r'Der Graph hat dort einen Sprung.',
     r'Der Graph verläuft dort senkrecht.'],
    [r'Bei einer einfachen Nullstelle wechselt der Funktionswert das Vorzeichen.',
     r'Bei gerader Vielfachheit bleibt das Vorzeichen erhalten.',
     r'Der Graph kommt also an die Achse heran und kehrt auf dieselbe Seite zurück.'])

Q.q(r'Wie verhält sich der Graph von $f(x) = (x - 1)^2\,(x + 2)$ an seinen Nullstellen?',
    [r'Er berührt die Achse bei $x = 1$ und schneidet sie bei $x = -2$.',
     r'Er schneidet die Achse bei $x = 1$ und berührt sie bei $x = -2$.',
     r'Er berührt sie an beiden Stellen.',
     r'Er schneidet sie an beiden Stellen.'],
    [r'$x = 1$ tritt wegen des Quadrats doppelt auf, $x = -2$ einfach.',
     r'Gerade Vielfachheit bedeutet Berühren, ungerade bedeutet Schneiden.',
     r'Probe: $f(0) = 1 \cdot 2 = 2$ und $f(2) = 1 \cdot 4 = 4$ — beide positiv, die Achse wurde bei $1$ nicht durchsetzt.'])

Q.q(r'Woran erkennt man, dass der Graph einer ganzrationalen Funktion achsensymmetrisch zur $y$-Achse ist?',
    [r'Es kommen nur gerade Exponenten vor.', r'Es kommen nur ungerade Exponenten vor.',
     r'Der Leitkoeffizient ist positiv.', r'Das Absolutglied ist null.'],
    [r'Achsensymmetrie bedeutet $f(-x) = f(x)$.',
     r'Bei geraden Exponenten gilt $(-x)^n = x^n$, das Vorzeichen bleibt.',
     r'Ein Absolutglied ist erlaubt, es entspricht $x^0$ und hat ebenfalls geraden Exponenten.'])

Q.q(r'Woran erkennt man Punktsymmetrie zum Koordinatenursprung?',
    [r'Es kommen nur ungerade Exponenten vor.', r'Es kommen nur gerade Exponenten vor.',
     r'Der Graph geht durch den Ursprung.', r'Die Funktion hat drei Nullstellen.'],
    [r'Punktsymmetrie bedeutet $f(-x) = -f(x)$.',
     r'Bei ungeraden Exponenten gilt $(-x)^n = -x^n$.',
     r'Ein Absolutglied würde die Symmetrie zerstören, denn es ändert sein Vorzeichen nicht.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^3 - 4x$?',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur $y$-Achse',
     r'achsensymmetrisch zur $x$-Achse', r'keine Symmetrie'],
    [r'Es kommen nur die ungeraden Exponenten $3$ und $1$ vor.',
     r'Probe: $f(-x) = -x^3 + 4x = -\left(x^3 - 4x\right) = -f(x)$.',
     r'Also Punktsymmetrie zum Ursprung; passend dazu liegen die Nullstellen $-2$, $0$ und $2$ symmetrisch.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, u = sp.symbols('x u')
    f = 3 * x ** 5 - 2 * x ** 2 + 1
    assert sp.degree(f, x) == 5
    assert sp.limit(f, x, sp.oo) is sp.oo and sp.limit(f, x, -sp.oo) is -sp.oo
    assert f.subs(x, 10) == 300000 - 200 + 1 and 3 * (-10) ** 5 == -300000
    g = -x ** 4 + 2 * x
    assert sp.limit(g, x, sp.oo) is -sp.oo and sp.limit(g, x, -sp.oo) is -sp.oo
    assert 100 ** 4 == 100000000 and 50 * 100 ** 2 == 500000
    # Nullstellen
    assert sp.solve(x ** 3 - 4 * x, x) == [-2, 0, 2] and sp.factor(x ** 3 - 4 * x) == x * (x - 2) * (x + 2)
    assert sp.solve(x ** 3 - x ** 2, x) == [0, 1] and sp.factor(x ** 3 - x ** 2) == x ** 2 * (x - 1)
    assert sp.solveset(x ** 4 - 16, x, sp.S.Reals) == sp.FiniteSet(-2, 2)
    assert sp.solveset(x ** 2 + 4, x, sp.S.Reals) == sp.S.EmptySet
    assert sp.solve((x - 1) * (x + 2) * (x - 3), x) == [-2, 1, 3]
    assert sp.solve(x ** 3 + x ** 2 - 6 * x, x) == [-3, 0, 2]
    assert sp.factor(x ** 3 + x ** 2 - 6 * x) == x * (x - 2) * (x + 3)
    # Substitution
    assert sp.solve(u ** 2 - 5 * u + 4, u) == [1, 4]
    assert sp.solveset(x ** 4 - 5 * x ** 2 + 4, x, sp.S.Reals) == sp.FiniteSet(-2, -1, 1, 2)
    assert sp.solve(u ** 2 - 13 * u + 36, u) == [4, 9]
    assert sp.solveset(x ** 4 - 13 * x ** 2 + 36, x, sp.S.Reals) == sp.FiniteSet(-3, -2, 2, 3)
    assert sp.solve(u ** 2 + 3 * u + 2, u) == [-2, -1]
    assert sp.solveset(x ** 4 + 3 * x ** 2 + 2, x, sp.S.Reals) == sp.S.EmptySet
    # Vielfachheit und Symmetrie
    v = (x - 1) ** 2 * (x + 2)
    assert sp.solve(v, x) == [-2, 1] and v.subs(x, 0) == 2 and v.subs(x, 2) == 4
    s = x ** 3 - 4 * x
    assert sp.simplify(s.subs(x, -x) + s) == 0 and sp.solve(s, x) == [-2, 0, 2]
    gerade = x ** 4 - 3 * x ** 2 + 1
    assert sp.simplify(gerade.subs(x, -x) - gerade) == 0


Q.verify(check)
Q.save()
