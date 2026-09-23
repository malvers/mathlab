#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 7 (LB 1): Ebenen im Raum II - Umwandlung zwischen
Parameter- und Koordinatengleichung, Lage von Gerade und Ebene, Durchstoßpunkt,
Schnittwinkel und Orthogonalität. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec

Q = fos12(nr=7, slug='ebenen2', thema='Ebenen im Raum II', lb='LB 1',
          blurb='Parameter- und Koordinatengleichung, Lage Gerade-Ebene, Durchstoßpunkt',
          comment='Blocks: Umwandlung der Gleichungsformen (1-7), Lage Gerade-Ebene (8-13), Durchstosspunkt (14-16), Schnittwinkel und Orthogonalitaet (17-20). Alles ohne CAS.')


def E(p, u, v, a='s', b='t'):
    """Parametergleichung as LaTeX: x = p + s*u + t*v."""
    return (r'\vec x = ' + vec(*p) + ' + ' + a + r' \cdot ' + vec(*u)
            + ' + ' + b + r' \cdot ' + vec(*v))


def g(p, u, t='t'):
    """Geradengleichung as LaTeX: x = p + t*u."""
    return r'\vec x = ' + vec(*p) + ' + ' + t + r' \cdot ' + vec(*u)


# ------------------------------------------------ Umwandlung der Gleichungsformen ----
Q.q(r'Gib eine Parametergleichung der Ebene $E: x + 2y + z = 4$ an.',
    [r'$E: ' + E((4, 0, 0), (-2, 1, 0), (-1, 0, 1)) + '$',
     r'$E: ' + E((4, 0, 0), (1, 2, 1), (-1, 0, 1)) + '$',
     r'$E: ' + E((1, 2, 1), (-2, 1, 0), (-1, 0, 1)) + '$',
     r'$E: ' + E((4, 0, 0), (2, 1, 0), (1, 0, 1)) + '$'],
    [r'Drei Punkte suchen: $y = z = 0$ gibt $(4|0|0)$, $y = 1$, $z = 0$ gibt $(2|1|0)$, $y = 0$, $z = 1$ gibt $(3|0|1)$.',
     r'Spannvektoren als Differenzen: $' + vec(-2, 1, 0) + r'$ und $' + vec(-1, 0, 1) + '$.',
     r'Probe: beide Spannvektoren sind senkrecht zu $\vec n = ' + vec(1, 2, 1) + '$ - der Normalenvektor selbst darf kein Spannvektor sein.'])

Q.q(r'Welcher Punkt liegt $\textbf{nicht}$ in der Ebene $E: 2x - y + 3z = 6$?',
    [r'$P(1|1|2)$', r'$P(3|0|0)$', r'$P(0|0|2)$', r'$P(1|2|2)$'],
    [r'Punktprobe heißt: einsetzen und mit $6$ vergleichen.',
     r'$2 \cdot 1 - 1 + 3 \cdot 2 = 7 \ne 6$ - dieser Punkt liegt nicht in $E$.',
     r'Die anderen drei liefern $6$: $6 - 0 + 0$, $0 - 0 + 6$ und $2 - 2 + 6$.'])

Q.q(r'Gib eine Parametergleichung der Ebene $E: 3x - z = 6$ an.',
    [r'$E: ' + E((2, 0, 0), (0, 1, 0), (1, 0, 3)) + '$',
     r'$E: ' + E((2, 0, 0), (0, 1, 0), (3, 0, -1)) + '$',
     r'$E: ' + E((6, 0, 0), (0, 1, 0), (1, 0, 3)) + '$',
     r'$E: ' + E((2, 0, 0), (1, 0, 0), (0, 0, 1)) + '$'],
    [r'$y$ kommt nicht vor, ist also frei wählbar: $' + vec(0, 1, 0) + '$ ist ein Spannvektor.',
     r'Stützpunkt aus $y = z = 0$: $3x = 6$, also $(2|0|0)$. Ein zweiter Punkt mit $z = 3$: $3x = 9$, also $(3|0|3)$ - Differenz $' + vec(1, 0, 3) + '$.',
     r'Probe: $\vec n = ' + vec(3, 0, -1) + r'$ steht senkrecht auf beiden Spannvektoren; als Spannvektor taugt $\vec n$ gerade nicht.'])

Q.q(r'Wandle $E: ' + E((2, 1, 0), (1, 0, -1), (0, 2, 1)) + '$ in eine Koordinatengleichung um.',
    [r'$2x - y + 2z = 3$', r'$2x - y + 2z = 5$', r'$2x + y + 2z = 3$', r'$x - y + 2z = 3$'],
    [r'Normalenvektor: $' + vec(1, 0, -1) + r' \times ' + vec(0, 2, 1) + ' = ' + vec(2, -1, 2) + '$',
     r'Ansatz $2x - y + 2z = d$, Stützpunkt $(2|1|0)$ einsetzen: $4 - 1 + 0 = 3$',
     r'Probe mit $s = 1$, $t = 0$: $(3|1|-1)$ gibt $6 - 1 - 2 = 3$.'])

Q.q(r'Welche Aussage über die Gleichungsformen einer Ebene ist richtig?',
    [r'Eine Ebene hat unendlich viele Parametergleichungen; ihre Koordinatengleichung ist bis auf einen gemeinsamen Faktor eindeutig.',
     r'Beide Formen sind eindeutig - zu einer Ebene gehört genau eine Gleichung.',
     r'Eine Ebene hat genau drei Parametergleichungen, eine je Punkt.',
     r'Eine Koordinatengleichung gibt es nur, wenn die Ebene durch den Ursprung geht.'],
    [r'Stützpunkt und Spannvektoren darf man frei wählen, solange sie in der Ebene liegen - daher unendlich viele Parametergleichungen.',
     r'Multipliziert man $2x - y + 2z = 3$ mit $5$, entsteht $10x - 5y + 10z = 15$ - dieselbe Ebene.',
     r'Geht die Ebene durch den Ursprung, ist lediglich $d = 0$.'])

Q.q(r'Wandle $E: ' + E((1, 1, 1), (2, 1, 0), (0, 1, 2)) + '$ in eine Koordinatengleichung um.',
    [r'$x - 2y + z = 0$', r'$x - 2y + z = 4$', r'$x + 2y + z = 0$', r'$2x - 4y + 2z = 1$'],
    [r'$' + vec(2, 1, 0) + r' \times ' + vec(0, 1, 2) + ' = ' + vec(2, -4, 2) + r'$, gekürzt $' + vec(1, -2, 1) + '$.',
     r'Stützpunkt $(1|1|1)$ einsetzen: $1 - 2 + 1 = 0$, also $d = 0$.',
     r'$d = 0$ heißt: die Ebene geht durch den Ursprung. $2x - 4y + 2z = 1$ wäre dagegen eine echt parallele Ebene.'])

Q.q(r'Wie lautet die Koordinatengleichung von $E: ' + E((0, 0, 3), (1, 0, 0), (0, 1, 0)) + '$?',
    [r'$z = 3$', r'$x + y = 3$', r'$z = 0$', r'$x + y + z = 3$'],
    [r'$' + vec(1, 0, 0) + r' \times ' + vec(0, 1, 0) + ' = ' + vec(0, 0, 1) + r'$, also $0x + 0y + 1z = d$.',
     r'Stützpunkt $(0|0|3)$: $d = 3$, somit $z = 3$.',
     r'Die Ebene liegt waagerecht in der Höhe $3$ - alle Punkte haben dieselbe $z$-Koordinate.'])

# ------------------------------------------------------- Lage Gerade-Ebene ----
Q.q(r'Untersuche die Lage von $g: ' + g((1, 0, 0), (1, 2, 0)) + r'$ und $E: x + y + z = 7$.',
    [r'$g$ schneidet $E$ in $S(3|4|0)$', r'$g$ liegt in $E$', r'$g$ ist echt parallel zu $E$', r'$g$ schneidet $E$ in $S(1|0|0)$'],
    [r'$\vec u \cdot \vec n = 1 + 2 + 0 = 3 \ne 0$ - die Gerade schneidet die Ebene.',
     r'Einsetzen: $(1 + t) + 2t + 0 = 7$, also $1 + 3t = 7$ und $t = 2$.',
     r'$t = 2$ in $g$: $S(3|4|0)$. Probe: $3 + 4 + 0 = 7$.'])

Q.q(r'Untersuche die Lage von $g: ' + g((1, 2, 0), (2, -1, 1)) + r'$ und $E: 2x + 3y - z = 5$.',
    [r'$g$ ist echt parallel zu $E$', r'$g$ liegt in $E$', r'$g$ schneidet $E$ in $S(1|2|0)$', r'$g$ steht senkrecht auf $E$'],
    [r'$\vec u \cdot \vec n = 4 - 3 - 1 = 0$ - die Gerade läuft parallel zur Ebene oder liegt in ihr.',
     r'Punktprobe mit dem Stützpunkt $(1|2|0)$: $2 + 6 - 0 = 8 \ne 5$.',
     r'Kein gemeinsamer Punkt, also echt parallel. Einsetzen liefert hier die falsche Aussage $8 = 5$.'])

Q.q(r'Untersuche die Lage von $g: ' + g((1, 1, 1), (1, -1, 0)) + r'$ und $E: x + y + 2z = 4$.',
    [r'$g$ liegt in $E$', r'$g$ ist echt parallel zu $E$', r'$g$ schneidet $E$ in $S(1|1|1)$', r'$g$ steht senkrecht auf $E$'],
    [r'$\vec u \cdot \vec n = 1 - 1 + 0 = 0$ - parallel zur Ebene oder in ihr.',
     r'Punktprobe $(1|1|1)$: $1 + 1 + 2 = 4$ - der Stützpunkt liegt in $E$.',
     r'Ein gemeinsamer Punkt bei paralleler Richtung heißt: die ganze Gerade liegt in der Ebene. Einsetzen gibt $4 = 4$ für jedes $t$.'])

Q.q(r'Woran erkennt man, dass eine Gerade parallel zu einer Ebene verläuft oder in ihr liegt?',
    [r'Das Skalarprodukt aus Richtungsvektor und Normalenvektor ist $0$.',
     r'Das Vektorprodukt aus Richtungsvektor und Normalenvektor ist der Nullvektor.',
     r'Der Richtungsvektor ist ein Vielfaches des Normalenvektors.',
     r'Der Stützpunkt der Geraden ist der Ursprung.'],
    [r'$\vec u \cdot \vec n = 0$ heißt: die Laufrichtung führt nie von der Ebene weg.',
     r'Ob die Gerade in der Ebene liegt oder echt parallel ist, entscheidet danach die Punktprobe mit dem Stützpunkt.',
     r'Ist $\vec u$ dagegen ein Vielfaches von $\vec n$, steht die Gerade senkrecht auf der Ebene - der Gegenfall.'])

Q.q(r'Für welchen Wert von $a$ steht $g: ' + g((1, 0, 2), (2, 'a', -1)) + r'$ senkrecht auf $E: 4x + 6y - 2z = 7$?',
    [r'$a = 3$', r'$a = 6$', r'$a = -3$', r'$a = 0$'],
    [r'Senkrecht auf der Ebene heißt: $\vec u$ ist parallel zum Normalenvektor $\vec n = ' + vec(4, 6, -2) + '$.',
     r'$' + vec(4, 6, -2) + r' = 2 \cdot ' + vec(2, 3, -1) + r'$, also muss $\vec u = ' + vec(2, 3, -1) + '$ sein: $a = 3$.',
     r'Falle: $a = 0$ macht $\vec u \cdot \vec n = 8 + 0 + 2 = 10$ - das wäre weder parallel noch senkrecht.'])

Q.q(r'Eine Gerade soll durch $P(1|0|1)$ verlaufen und ganz in $E: 3x - y + 2z = 5$ liegen. Welcher Richtungsvektor ist möglich?',
    [r'$' + vec(1, 3, 0) + '$', r'$' + vec(1, 1, 1) + '$', r'$' + vec(3, -1, 2) + '$', r'$' + vec(2, 1, 1) + '$'],
    [r'$P$ liegt in $E$: $3 - 0 + 2 = 5$. Der Richtungsvektor muss senkrecht zu $\vec n = ' + vec(3, -1, 2) + '$ stehen.',
     r'$' + vec(3, -1, 2) + r' \cdot ' + vec(1, 3, 0) + ' = 3 - 3 + 0 = 0$ - passt.',
     r'Die anderen liefern $4$, $14$ und $7$; $' + vec(3, -1, 2) + '$ selbst führt sogar senkrecht aus der Ebene heraus.'])

# ---------------------------------------------------------- Durchstoßpunkt ----
Q.q(r'Berechne den Durchstoßpunkt von $g: ' + g((1, 2, 3), (2, 1, -1)) + r'$ mit $E: x - y + 2z = 3$.',
    [r'$D(5|4|1)$', r'$D(1|2|3)$', r'$D(3|3|2)$', r'$D(7|5|0)$'],
    [r'Geradenpunkt einsetzen: $(1 + 2t) - (2 + t) + 2\,(3 - t) = 3$',
     r'$1 + 2t - 2 - t + 6 - 2t = 5 - t = 3$, also $t = 2$.',
     r'$t = 2$ in $g$: $D(5|4|1)$. Probe: $5 - 4 + 2 = 3$.'])

Q.q(r'Die Gerade durch $A(1|1|1)$ und $B(3|0|4)$ durchstößt $E: 2x + y + z = 16$. Bestimme den Durchstoßpunkt.',
    [r'$D(5|-1|7)$', r'$D(3|0|4)$', r'$D(7|-2|10)$', r'$D(1|1|1)$'],
    [r'Richtungsvektor $\overrightarrow{AB} = ' + vec(2, -1, 3) + r'$, also $g: ' + g((1, 1, 1), (2, -1, 3)) + '$.',
     r'Einsetzen: $2\,(1 + 2t) + (1 - t) + (1 + 3t) = 4 + 6t = 16$, also $t = 2$.',
     r'$D(5|-1|7)$; Probe: $10 - 1 + 7 = 16$. $A$ und $B$ selbst liegen nicht in $E$ ($4$ bzw. $10$).'])

Q.q(r'Ein Bohrer bewegt sich längs $g: ' + g((1, 2, 8), (1, -2, -2)) + r'$ auf eine Platte zu, die in $E: x - 2y - 2z = -10$ liegt. Trifft er senkrecht auf, und wo?',
    [r'ja, senkrecht; Durchstoßpunkt $D(2|0|6)$',
     r'ja, senkrecht; Durchstoßpunkt $D(1|2|8)$',
     r'nein, der Schnittwinkel beträgt $45^\circ$; $D(2|0|6)$',
     r'nein, $g$ verläuft parallel zur Platte'],
    [r'$\vec u = ' + vec(1, -2, -2) + r'$ ist genau der Normalenvektor der Ebene - die Gerade steht senkrecht auf der Platte.',
     r'Einsetzen: $(1 + t) - 2\,(2 - 2t) - 2\,(8 - 2t) = 9t - 19 = -10$, also $t = 1$.',
     r'$D(2|0|6)$; Probe: $2 - 0 - 12 = -10$.'])

# --------------------------------------- Schnittwinkel und Orthogonalität ----
Q.q(r'Unter welchem Winkel schneidet die Gerade $g: \vec x = t \cdot ' + vec(0, 0, 1) + r'$ die Ebene $E: x + y + z = 1$?',
    [r'$\alpha \approx 35{,}3^\circ$', r'$\alpha \approx 54{,}7^\circ$', r'$45^\circ$', r'$90^\circ$'],
    [r'Für den Schnittwinkel von Gerade und Ebene gilt $\sin\alpha = \dfrac{|\vec u \cdot \vec n|}{|\vec u| \cdot |\vec n|}$.',
     r'$\sin\alpha = \dfrac{1}{1 \cdot \sqrt{3}} \approx 0{,}577$, also $\alpha = \sin^{-1}(0{,}577) \approx 35{,}3^\circ$',
     r'Falle: mit $\cos^{-1}$ käme $54{,}7^\circ$ heraus - das ist der Winkel zwischen $g$ und dem Normalenvektor.'])

Q.q(r'Berechne den Schnittwinkel von $g: ' + g((0, 1, 0), (1, 2, 2)) + r'$ und $E: 2x - y + 2z = 3$.',
    [r'$\alpha \approx 26{,}4^\circ$', r'$\alpha \approx 63{,}6^\circ$', r'$\alpha \approx 24{,}0^\circ$', r'$45^\circ$'],
    [r'$\vec u \cdot \vec n = 2 - 2 + 4 = 4$, $|\vec u| = 3$, $|\vec n| = 3$',
     r'$\sin\alpha = \dfrac{4}{9} \approx 0{,}444$, also $\alpha \approx 26{,}4^\circ$',
     r'$63{,}6^\circ$ entsteht mit $\cos^{-1}$, $24{,}0^\circ$ mit $\tan^{-1}$ - beim Schnittwinkel Gerade-Ebene ist es der Sinus.'])

Q.q(r'Ein Laserstrahl startet in $L(0|0|6)$ und läuft in Richtung $' + vec(1, 2, -1) + r'$ (Angaben in Metern). In welchem Punkt trifft er die geneigte Wand $E: 2x + y + z = 12$?',
    [r'$(2|4|4)$', r'$(1|2|5)$', r'$(3|6|3)$', r'er trifft die Wand nicht, er verläuft parallel dazu'],
    [r'Strahlpunkt: $(t|2t|6 - t)$. Einsetzen: $2t + 2t + (6 - t) = 3t + 6 = 12$',
     r'$t = 2$ liefert den Auftreffpunkt $(2|4|4)$. Probe: $4 + 4 + 4 = 12$.',
     r'$\vec u \cdot \vec n = 2 + 2 - 1 = 3 \ne 0$ - der Strahl läuft also nicht parallel zur Wand.'])

Q.q(r'Ein Flugzeug fliegt längs $g: ' + g((0, 0, 2), (4, 3, 1)) + r'$ (Angaben in km). Eine Wolkenschicht liegt in der Ebene $z = 5$. Wo und unter welchem Winkel durchstößt es die Schicht?',
    [r'in $(12|9|5)$ unter etwa $11{,}3^\circ$', r'in $(12|9|5)$ unter etwa $78{,}7^\circ$',
     r'in $(4|3|3)$ unter etwa $11{,}3^\circ$', r'in $(12|9|5)$ unter $45^\circ$'],
    [r'$z = 2 + t = 5$ gibt $t = 3$, also den Punkt $(12|9|5)$.',
     r'Normalenvektor der Schicht: $\vec n = ' + vec(0, 0, 1) + r'$; $\sin\alpha = \dfrac{|1|}{\sqrt{26} \cdot 1} \approx 0{,}196$',
     r'$\alpha \approx 11{,}3^\circ$ - ein flacher Steigflug. $78{,}7^\circ$ wäre der Winkel zur Senkrechten.'])


def check():
    from math import sqrt, asin, acos, atan, degrees
    import sympy as sp
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    n2 = lambda a: dot(a, a)
    sub = lambda p, q: tuple(x - y for x, y in zip(p, q))
    mul = lambda k, v: tuple(k * x for x in v)
    at = lambda p, u, t: tuple(p[i] + t * u[i] for i in range(3))
    cross = lambda u, v: tuple(sp.Matrix(list(u)).cross(sp.Matrix(list(v))))
    coplanar = lambda u, v: sp.Matrix([list(u), list(v)]).rank() == 1
    near = lambda x, y, tol=0.05: abs(x - y) < tol
    gerade_winkel = lambda u, n: degrees(asin(abs(dot(u, n)) / sqrt(n2(u) * n2(n))))

    def plane(p, u, v):
        n = cross(u, v)
        gc = sp.gcd(sp.gcd(n[0], n[1]), n[2])
        n = tuple(sp.nsimplify(c / gc) for c in n)
        return n, dot(n, p)

    def same_plane(a, b):
        (n1, d1), (n2_, d2) = a, b
        return coplanar(n1, n2_) and sp.Matrix([list(n1) + [d1], list(n2_) + [d2]]).rank() == 1

    def lage(p, u, n, d):
        """schneidend (with point) / liegt darin / echt parallel."""
        t = sp.symbols('t')
        sol = sp.solve(sp.Eq(dot(n, at(p, u, t)), d), t)
        if dot(u, n) == 0:
            return 'liegt darin' if dot(n, p) == d else 'echt parallel'
        return ('schneidend', at(p, u, sol[0]))

    # 1: Koordinaten- in Parameterform
    assert plane((4, 0, 0), (-2, 1, 0), (-1, 0, 1)) == ((1, 2, 1), 4)
    for bad in (plane((4, 0, 0), (1, 2, 1), (-1, 0, 1)), plane((1, 2, 1), (-2, 1, 0), (-1, 0, 1)),
                plane((4, 0, 0), (2, 1, 0), (1, 0, 1))):
        assert not same_plane(((1, 2, 1), 4), bad)
    assert sub((2, 1, 0), (4, 0, 0)) == (-2, 1, 0) and sub((3, 0, 1), (4, 0, 0)) == (-1, 0, 1)
    for p in ((4, 0, 0), (2, 1, 0), (3, 0, 1)):
        assert dot((1, 2, 1), p) == 4
    # 2: Punktprobe
    assert dot((2, -1, 3), (1, 1, 2)) == 7
    for p in ((3, 0, 0), (0, 0, 2), (1, 2, 2)):
        assert dot((2, -1, 3), p) == 6
    # 3: 3x - z = 6
    assert plane((2, 0, 0), (0, 1, 0), (1, 0, 3)) == ((3, 0, -1), 6)
    for bad in (plane((2, 0, 0), (0, 1, 0), (3, 0, -1)), plane((6, 0, 0), (0, 1, 0), (1, 0, 3)),
                plane((2, 0, 0), (1, 0, 0), (0, 0, 1))):
        assert not same_plane(((3, 0, -1), 6), bad)
    assert dot((3, 0, -1), (3, 0, 3)) == 6 and sub((3, 0, 3), (2, 0, 0)) == (1, 0, 3)
    # 4: Parameter- in Koordinatenform
    assert cross((1, 0, -1), (0, 2, 1)) == (2, -1, 2)
    assert plane((2, 1, 0), (1, 0, -1), (0, 2, 1)) == ((2, -1, 2), 3)
    assert dot((2, -1, 2), at((2, 1, 0), (1, 0, -1), 1)) == 3
    for n, d in (((2, -1, 2), 5), ((2, 1, 2), 3), ((1, -1, 2), 3)):
        assert not same_plane(((2, -1, 2), 3), (n, d))
    # 5: Eindeutigkeit
    assert same_plane(((2, -1, 2), 3), ((10, -5, 10), 15))
    # 6: durch den Ursprung
    assert cross((2, 1, 0), (0, 1, 2)) == (2, -4, 2) and plane((1, 1, 1), (2, 1, 0), (0, 1, 2)) == ((1, -2, 1), 0)
    for n, d in (((1, -2, 1), 4), ((1, 2, 1), 0), ((2, -4, 2), 1)):
        assert not same_plane(((1, -2, 1), 0), (n, d))
    # 7: z = 3
    assert cross((1, 0, 0), (0, 1, 0)) == (0, 0, 1) and plane((0, 0, 3), (1, 0, 0), (0, 1, 0)) == ((0, 0, 1), 3)
    # 8-10: Lage Gerade-Ebene
    r = lage((1, 0, 0), (1, 2, 0), (1, 1, 1), 7)
    assert r == ('schneidend', (3, 4, 0)) and dot((1, 2, 0), (1, 1, 1)) == 3 and dot((1, 1, 1), (3, 4, 0)) == 7
    assert lage((1, 2, 0), (2, -1, 1), (2, 3, -1), 5) == 'echt parallel'
    assert dot((2, -1, 1), (2, 3, -1)) == 0 and dot((2, 3, -1), (1, 2, 0)) == 8
    assert lage((1, 1, 1), (1, -1, 0), (1, 1, 2), 4) == 'liegt darin'
    assert dot((1, -1, 0), (1, 1, 2)) == 0 and dot((1, 1, 2), (1, 1, 1)) == 4
    # 12: senkrecht
    assert mul(2, (2, 3, -1)) == (4, 6, -2) and coplanar((2, 3, -1), (4, 6, -2))
    for a in (6, -3, 0):
        assert not coplanar((2, a, -1), (4, 6, -2))
    assert dot((2, 0, -1), (4, 6, -2)) == 10
    # 13: Richtungsvektor in der Ebene
    assert dot((3, -1, 2), (1, 0, 1)) == 5 and dot((3, -1, 2), (1, 3, 0)) == 0
    assert dot((3, -1, 2), (1, 1, 1)) == 4 and dot((3, -1, 2), (3, -1, 2)) == 14 and dot((3, -1, 2), (2, 1, 1)) == 7
    # 14-15: Durchstoßpunkt
    assert lage((1, 2, 3), (2, 1, -1), (1, -1, 2), 3) == ('schneidend', (5, 4, 1))
    for t in (0, 1, 3):
        assert dot((1, -1, 2), at((1, 2, 3), (2, 1, -1), t)) != 3
    assert at((1, 2, 3), (2, 1, -1), 1) == (3, 3, 2) and at((1, 2, 3), (2, 1, -1), 3) == (7, 5, 0)
    assert sub((3, 0, 4), (1, 1, 1)) == (2, -1, 3)
    assert lage((1, 1, 1), (2, -1, 3), (2, 1, 1), 16) == ('schneidend', (5, -1, 7))
    assert dot((2, 1, 1), (1, 1, 1)) == 4 and dot((2, 1, 1), (3, 0, 4)) == 10 and dot((2, 1, 1), (7, -2, 10)) == 22
    # 16: Bohrer
    assert coplanar((1, -2, -2), (1, -2, -2)) and dot((1, -2, -2), (1, -2, -2)) == 9
    assert lage((1, 2, 8), (1, -2, -2), (1, -2, -2), -10) == ('schneidend', (2, 0, 6))
    assert dot((1, -2, -2), (1, 2, 8)) == -19 and dot((1, -2, -2), (2, 0, 6)) == -10
    assert near(gerade_winkel((1, -2, -2), (1, -2, -2)), 90, 1e-9)
    # 17-18: Schnittwinkel
    assert near(gerade_winkel((0, 0, 1), (1, 1, 1)), 35.3) and near(degrees(acos(1 / sqrt(3))), 54.7)
    assert near(1 / sqrt(3), 0.577, 0.0005)
    assert dot((1, 2, 2), (2, -1, 2)) == 4 and n2((1, 2, 2)) == 9 and n2((2, -1, 2)) == 9
    assert near(gerade_winkel((1, 2, 2), (2, -1, 2)), 26.4) and near(degrees(acos(4 / 9)), 63.6)
    assert near(degrees(atan(4 / 9)), 24.0) and near(4 / 9, 0.444, 0.0005)
    # 19: Laser
    assert lage((0, 0, 6), (1, 2, -1), (2, 1, 1), 12) == ('schneidend', (2, 4, 4))
    assert dot((2, 1, 1), (1, 2, -1)) == 3
    for t in (1, 3):
        assert dot((2, 1, 1), at((0, 0, 6), (1, 2, -1), t)) != 12
    assert at((0, 0, 6), (1, 2, -1), 1) == (1, 2, 5) and at((0, 0, 6), (1, 2, -1), 3) == (3, 6, 3)
    # 20: Flugzeug
    assert lage((0, 0, 2), (4, 3, 1), (0, 0, 1), 5) == ('schneidend', (12, 9, 5))
    assert near(gerade_winkel((4, 3, 1), (0, 0, 1)), 11.3) and near(degrees(acos(1 / sqrt(26))), 78.7)
    assert near(1 / sqrt(26), 0.196, 0.0005) and at((0, 0, 2), (4, 3, 1), 1) == (4, 3, 3)


Q.verify(check)
Q.save()
