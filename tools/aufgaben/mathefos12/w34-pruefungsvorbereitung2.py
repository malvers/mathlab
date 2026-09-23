#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 34 (Prüfungsvorbereitung): Prüfungsvorbereitung II -
Generalprobe über alle Lernbereiche der Klasse 12, dazu Wahrscheinlichkeiten aus
Klasse 11 (LB 2) und Fragen zur Prüfungsstrategie. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=34, slug='pruefungsvorbereitung2', thema='Prüfungsvorbereitung II', lb='Prüfungsvorbereitung',
          blurb='Generalprobe: alle Lernbereiche gemischt, dazu Wahrscheinlichkeiten aus Klasse 11',
          comment='Blocks: Pruefungsstrategie (1-2), Vektorrechnung (3-6), Differenzialrechnung (7-10), Integral und weitere Funktionen (11-14), Wahrscheinlichkeiten Klasse 11 (15-19), Anwendung (20). GTR ohne CAS.')

# ------------------------------------------------------ Prüfungsstrategie ----
Q.q(r'Im Lehrplan steht bei fast jedem Lernziel „Nutzung des GTR ohne CAS“. Welche Hilfsmittel sind demnach in der schriftlichen Prüfung vorgesehen?',
    [r'der GTR ohne CAS, die zugelassene Formelsammlung und Zeichengeräte',
     r'ein CAS-Rechner, weil er exakt ableiten und integrieren kann',
     r'nur ein einfacher wissenschaftlicher Taschenrechner ohne Grafikfunktion',
     r'gar kein Hilfsmittel, alles muss im Kopf gerechnet werden'],
    [r'Der Lehrplan nennt als Werkzeug durchgehend den GTR ohne CAS - genau dieses Gerät ist auch in der Prüfung vorgesehen.',
     r'Dazu kommen die zugelassene Formelsammlung und Zeichengeräte.',
     r'Ein CAS ist erst im Wahlbereich 3 nach der schriftlichen Prüfung erlaubt.'])

Q.q(r'Eine Extremalaufgabe liefert die Kantenlänge $x = \sqrt{54}\,\mathrm{cm} \approx 7{,}35\,\mathrm{cm}$. Gesucht ist die Oberfläche $O = 6x^2$ eines Würfels. Wie lautet das Ergebnis?',
    [r'$O = 324\,\mathrm{cm^2}$', r'$O \approx 319{,}7\,\mathrm{cm^2}$', r'$O = 324\,\mathrm{cm}$', r'$O \approx 44{,}1\,\mathrm{cm^2}$'],
    [r'Mit dem ungerundeten Wert weiterrechnen: $x^2 = 54$, also $O = 6 \cdot 54 = 324$.',
     r'Das Ergebnis ist exakt: $O = 324\,\mathrm{cm^2}$ - eine Fläche hat die Einheit $\mathrm{cm^2}$.',
     r'Fallen: mit $x \approx 7{,}3$ vorgerundet kommt $319{,}7$ heraus, und $6 \cdot 7{,}35 = 44{,}1$ vergisst das Quadrat.'])

# --------------------------------------------------------- Vektorrechnung ----
Q.q(r'Bestimme den Durchstoßpunkt der Geraden $g\!: \vec x = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(2, 1, -1) + r'$ mit der Ebene $E\!: x - y + 2z = 3$.',
    [r'$S(5|4|1)$', r'$S(3|3|2)$', r'$S(1|2|3)$', r'$g$ ist echt parallel zu $E$, es gibt keinen Durchstoßpunkt.'],
    [r'Koordinaten von $g$ in $E$ einsetzen: $(1 + 2t) - (2 + t) + 2\,(3 - t) = 5 - t$',
     r'$5 - t = 3 \Rightarrow t = 2$, eingesetzt in $g$: $S(5|4|1)$',
     r'Probe: $5 - 4 + 2 \cdot 1 = 3$. Bei $t = 1$ erhielte man $(3|3|2)$ - dort ist $3 - 3 + 4 = 4 \ne 3$.'])

Q.q(r'Wie liegen die Geraden $g\!: \vec x = ' + vec(1, 0, 0) + r' + s \cdot ' + vec(1, 1, 0) + r'$ und $h\!: \vec x = ' + vec(0, 1, 3) + r' + t \cdot ' + vec(0, 1, 1) + r'$ zueinander?',
    [r'$g$ und $h$ sind windschief.', r'$g$ und $h$ schneiden sich in $S(0|-1|0)$.', r'$g$ und $h$ sind echt parallel.', r'$g$ und $h$ sind identisch.'],
    [r'Die Richtungsvektoren $' + vec(1, 1, 0) + r'$ und $' + vec(0, 1, 1) + r'$ sind kein Vielfaches voneinander - parallel scheidet aus.',
     r'Gleichsetzen: $1 + s = 0 \Rightarrow s = -1$; dritte Zeile $0 = 3 + t \Rightarrow t = -3$',
     r'Probe in der zweiten Zeile: $s = 1 + t$ hieße $-1 = -2$ - Widerspruch, also kein Schnittpunkt: windschief.'])

Q.q(r'Wie liegt die Gerade $g\!: \vec x = ' + vec(1, 1, 1) + r' + t \cdot ' + vec(2, -4, 2) + r'$ zur Ebene $E\!: x - 2y + z = 3$?',
    [r'$g$ steht senkrecht auf $E$ und trifft sie in $S(1{,}5|0|1{,}5)$.',
     r'$g$ liegt in $E$.',
     r'$g$ ist echt parallel zu $E$.',
     r'$g$ schneidet $E$, steht aber nicht senkrecht darauf.'],
    [r'Normalenvektor $\vec n = ' + vec(1, -2, 1) + r'$, Richtungsvektor $' + vec(2, -4, 2) + r' = 2\,\vec n$: also $g \perp E$.',
     r'Durchstoßpunkt: $(1 + 2t) - 2\,(1 - 4t) + (1 + 2t) = 12t = 3 \Rightarrow t = \dfrac{1}{4}$',
     r'$S(1{,}5|0|1{,}5)$; Probe: $1{,}5 - 0 + 1{,}5 = 3$. Der Stützpunkt $(1|1|1)$ liegt wegen $1 - 2 + 1 = 0 \ne 3$ nicht in $E$.'])

Q.q(r'Ein dreieckiges Sonnensegel ist in den Punkten $A(0|0|0)$, $B(3|0|0)$ und $C(0|4|3)$ befestigt (Angaben in Metern). Wie groß ist seine Fläche?',
    [r'$7{,}5\,\mathrm{m^2}$', r'$15\,\mathrm{m^2}$', r'$6\,\mathrm{m^2}$', r'$12\,\mathrm{m^2}$'],
    [r'$\overrightarrow{AB} = ' + vec(3, 0, 0) + r'$, $\overrightarrow{AC} = ' + vec(0, 4, 3) + r'$, Vektorprodukt: $\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(0, -9, 12) + r'$',
     r'$|\overrightarrow{AB} \times \overrightarrow{AC}| = \sqrt{0 + 81 + 144} = \sqrt{225} = 15$ ist die Parallelogrammfläche.',
     r'Das Dreieck ist halb so groß: $A_\triangle = 7{,}5\,\mathrm{m^2}$. $6$ käme heraus, wenn man die Höhe $3$ vergisst.'])

# --------------------------------------------------- Differenzialrechnung ----
Q.q(r'Wie lautet die Gleichung der Tangente an den Graphen von $f(x) = x^3 - 4x$ an der Stelle $x = 2$?',
    [r'$y = 8x - 16$', r'$y = 8x$', r'$y = 8x + 16$', r'$y = 12x - 24$'],
    [r'$f(2) = 8 - 8 = 0$, der Berührpunkt ist $B(2|0)$.',
     r'$f^{\prime}(x) = 3x^2 - 4$, also $m = f^{\prime}(2) = 12 - 4 = 8$',
     r'$y = 8\,(x - 2) + 0 = 8x - 16$. Falle: $f^{\prime}(2) = 12$ entsteht, wenn man die $-4$ vergisst.'])

Q.q(r'Bestimme die Extrempunkte des Graphen von $f(x) = x^3 - 6x^2 + 9x$.',
    [r'$H(1|4)$ und $T(3|0)$', r'$T(1|4)$ und $H(3|0)$', r'nur $H(1|4)$', r'$W(2|2)$'],
    [r'$f^{\prime}(x) = 3x^2 - 12x + 9 = 3\,(x - 1)(x - 3) = 0 \Rightarrow x = 1$ oder $x = 3$',
     r'$f^{\prime\prime}(x) = 6x - 12$: $f^{\prime\prime}(1) = -6 < 0$ (Hochpunkt), $f^{\prime\prime}(3) = 6 > 0$ (Tiefpunkt)',
     r'$f(1) = 4$, $f(3) = 0$. $W(2|2)$ ist der Wendepunkt - dort ist $f^{\prime\prime} = 0$, nicht $f^{\prime}$.'])

Q.q(r'Unter welchem Winkel schneidet der Graph von $f(x) = x^2 - 2x$ die $x$-Achse an der Nullstelle $x = 2$?',
    [r'$\alpha \approx 63{,}4^\circ$', r'$\alpha \approx 26{,}6^\circ$', r'$\alpha = 45^\circ$', r'$\alpha \approx 116{,}6^\circ$'],
    [r'$f^{\prime}(x) = 2x - 2$, also $m = f^{\prime}(2) = 2$',
     r'$\tan\alpha = m = 2 \Rightarrow \alpha = \tan^{-1}(2) \approx 63{,}4^\circ$',
     r'$26{,}6^\circ$ wäre $\tan^{-1}\!\left(\dfrac{1}{2}\right)$; der Schnittwinkel mit einer Achse wird immer zwischen $0^\circ$ und $90^\circ$ angegeben.'])

Q.q(r'Ein Rechteck liegt mit der Grundseite auf der $x$-Achse, die beiden oberen Ecken liegen auf dem Graphen von $f(x) = 12 - x^2$. Welche Maße liefern die größte Fläche?',
    [r'Breite $4$, Höhe $8$, $A = 32$', r'Breite $2$, Höhe $8$, $A = 16$', r'Breite $6$, Höhe $3$, $A = 18$', r'Breite $4$, Höhe $12$, $A = 48$'],
    [r'Die Ecken sind $(\pm x\,|\,0)$ und $(\pm x\,|\,12 - x^2)$, also $A(x) = 2x\,(12 - x^2) = 24x - 2x^3$ mit $0 < x < \sqrt{12}$.',
     r'$A^{\prime}(x) = 24 - 6x^2 = 0 \Rightarrow x = 2$; $A^{\prime\prime}(x) = -12x < 0$: Maximum',
     r'Breite $2x = 4$, Höhe $f(2) = 8$, $A = 32$. Bei $x = 3$ ergäbe sich $6 \cdot 3 = 18$ - weniger.'])

# ------------------------------------------ Integral und weitere Funktionen ----
Q.q(r'Berechne $\int_{0}^{2} (x^3 - 4x)\,dx$ und deute das Ergebnis.',
    [r'$-4$: der Graph verläuft zwischen $0$ und $2$ unterhalb der $x$-Achse.',
     r'$4$: das ist der Flächeninhalt zwischen Graph und $x$-Achse.',
     r'$0$: die Flächen oberhalb und unterhalb heben sich auf.',
     r'$-8$: der Graph verläuft unterhalb der $x$-Achse.'],
    [r'Stammfunktion: $F(x) = \dfrac{x^4}{4} - 2x^2$',
     r'$F(2) - F(0) = (4 - 8) - 0 = -4$',
     r'Ein negatives Integral bedeutet: der Graph liegt im ganzen Intervall unter der $x$-Achse. Der Flächeninhalt wäre $4$.'])

Q.q(r'Wie groß ist der Inhalt der Fläche, die der Graph von $f(x) = x^3 - 4x$ im Intervall $[0\,;\,3]$ mit der $x$-Achse einschließt?',
    [r'$A = 10{,}25$', r'$A = 2{,}25$', r'$A = 6{,}25$', r'$A = 4$'],
    [r'Nullstelle im Intervall: $x\,(x^2 - 4) = 0 \Rightarrow x = 2$ (und $x = 0$), also in zwei Teilen rechnen.',
     r'$\int_0^2 (x^3 - 4x)\,dx = -4$ und $\int_2^3 (x^3 - 4x)\,dx = \left(\dfrac{81}{4} - 18\right) - (4 - 8) = 6{,}25$',
     r'Flächeninhalt: $|-4| + 6{,}25 = 10{,}25$. Falle: $\int_0^3 = 2{,}25$ ist nur die Bilanz, nicht die Fläche.'])

Q.q(r'Untersuche $f(x) = \dfrac{x^2 - 3x}{x^2 - 9}$ an der Stelle $x = 3$.',
    [r'behebbare Lücke mit dem Grenzwert $\dfrac{1}{2}$',
     r'Polstelle mit Vorzeichenwechsel',
     r'behebbare Lücke mit dem Grenzwert $0$',
     r'$f$ ist dort definiert und stetig'],
    [r'Zähler und Nenner faktorisieren: $\dfrac{x\,(x - 3)}{(x - 3)(x + 3)} = \dfrac{x}{x + 3}$ für $x \ne 3$',
     r'Der Faktor $(x - 3)$ kürzt sich weg: keine Polstelle, sondern eine behebbare Lücke.',
     r'Grenzwert: $\dfrac{3}{3 + 3} = \dfrac{1}{2}$. Bei $x = -3$ bleibt dagegen eine Polstelle.'])

Q.q(r'Welchen Extrempunkt hat der Graph von $f(x) = x \cdot e^{2x}$?',
    [r'Tiefpunkt $T(-0{,}5|-0{,}18)$', r'Hochpunkt $H(-0{,}5|-0{,}18)$', r'Tiefpunkt $T(0|0)$', r'Tiefpunkt $T(-1|-0{,}14)$'],
    [r'Produktregel: $f^{\prime}(x) = e^{2x} + x \cdot 2e^{2x} = (1 + 2x)\,e^{2x}$',
     r'$e^{2x} > 0$, also $1 + 2x = 0 \Rightarrow x = -0{,}5$; $f^{\prime\prime}(x) = (4x + 4)\,e^{2x}$, $f^{\prime\prime}(-0{,}5) = 2e^{-1} > 0$: Tiefpunkt',
     r'$f(-0{,}5) = -0{,}5 \cdot e^{-1} \approx -0{,}18$. Falle: die Kettenregel liefert den Faktor $2$, sonst käme $x = -1$ heraus.'])

# --------------------------------------- Wahrscheinlichkeiten aus Klasse 11 ----
Q.q(r'In einer Schachtel liegen $4$ rote und $6$ grüne Bonbons. Zwei werden nacheinander ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit, dass beide grün sind?',
    [r'$\dfrac{1}{3}$', r'$0{,}36$', r'$\dfrac{2}{5}$', r'$\dfrac{2}{15}$'],
    [r'Baumdiagramm, erster Pfad: $P(\text{grün}) = \dfrac{6}{10}$, danach sind nur noch $5$ von $9$ grün.',
     r'Produktregel (Pfadregel): $P = \dfrac{6}{10} \cdot \dfrac{5}{9} = \dfrac{30}{90} = \dfrac{1}{3}$',
     r'$0{,}36 = 0{,}6^2$ gilt nur mit Zurücklegen; $\dfrac{2}{15}$ wäre $P(\text{beide rot})$.'])

Q.q(r'Ein Bauteil ist unabhängig von den anderen mit der Wahrscheinlichkeit $5\,\%$ defekt. Ein Gerät enthält $3$ solche Bauteile. Wie groß ist die Wahrscheinlichkeit, dass mindestens eines defekt ist?',
    [r'$\approx 14{,}3\,\%$', r'$15\,\%$', r'$\approx 85{,}7\,\%$', r'$0{,}0125\,\%$'],
    [r'Gegenereignis: kein Bauteil defekt, $P = 0{,}95^3 = 0{,}857375$',
     r'$P(\text{mindestens eines defekt}) = 1 - 0{,}857375 = 0{,}142625 \approx 14{,}3\,\%$',
     r'$3 \cdot 5\,\% = 15\,\%$ ist nur eine grobe Näherung: Wahrscheinlichkeiten addiert man nicht über Pfade hinweg.'])

Q.q(r'In einem Betrieb arbeiten $250$ Personen, davon $100$ im Außendienst. $60$ Personen fahren einen Dienstwagen, darunter $45$ aus dem Außendienst. Wie viele Personen im Innendienst haben keinen Dienstwagen?',
    [r'$135$', r'$150$', r'$105$', r'$190$'],
    [r'Vierfeldertafel: Innendienst $= 250 - 100 = 150$.',
     r'Dienstwagen im Innendienst: $60 - 45 = 15$',
     r'Innendienst ohne Dienstwagen: $150 - 15 = 135$. Probe: $45 + 55 + 15 + 135 = 250$.'])

Q.q(r'Gleicher Betrieb ($250$ Personen, $100$ im Außendienst, $60$ Dienstwagen, davon $45$ im Außendienst): Eine zufällig gewählte Person fährt einen Dienstwagen. Mit welcher Wahrscheinlichkeit arbeitet sie im Außendienst?',
    [r'$0{,}75$', r'$0{,}45$', r'$0{,}24$', r'$0{,}18$'],
    [r'Bedingte Wahrscheinlichkeit: $P(A|D) = \dfrac{P(A \cap D)}{P(D)}$, hier mit Anzahlen: $\dfrac{45}{60}$',
     r'$\dfrac{45}{60} = 0{,}75$',
     r'Falle: $\dfrac{45}{100} = 0{,}45$ ist $P(D|A)$ - die Bedingung steht im Nenner.'])

Q.q(r'Zwei Zulieferer: $A$ liefert $70\,\%$ der Teile mit $4\,\%$ Ausschuss, $B$ liefert $30\,\%$ mit $10\,\%$ Ausschuss. Wie groß ist der Ausschussanteil insgesamt?',
    [r'$5{,}8\,\%$', r'$8{,}2\,\%$', r'$7\,\%$', r'$14\,\%$'],
    [r'Zweistufiges Baumdiagramm, Pfade über $A$ und über $B$ addieren.',
     r'$P = 0{,}7 \cdot 0{,}04 + 0{,}3 \cdot 0{,}10 = 0{,}028 + 0{,}03 = 0{,}058$',
     r'$8{,}2\,\%$ entsteht beim Vertauschen der Anteile, $7\,\%$ ist der ungewichtete Mittelwert.'])

# ------------------------------------------------------------- Anwendung ----
Q.q(r'Ein Betrieb hat die Kostenfunktion $K(x) = x^3 - 6x^2 + 12x + 80$ (in Tsd. €, $x$ in ME) und verkauft jede ME für $48$ Tsd. €. Bei welcher Menge ist der Gewinn maximal?',
    [r'$x = 6$ ME, $G = 136$ Tsd. €', r'$x = 6$ ME, $G = 216$ Tsd. €', r'$x = 2$ ME, $G = 8$ Tsd. €', r'$x = 4$ ME, $G = 96$ Tsd. €'],
    [r'Gewinn: $G(x) = 48x - K(x) = -x^3 + 6x^2 + 36x - 80$',
     r'$G^{\prime}(x) = -3x^2 + 12x + 36 = -3\,(x - 6)(x + 2) = 0 \Rightarrow x = 6$ (die Lösung $x = -2$ ist ohne Bedeutung)',
     r'$G^{\prime\prime}(x) = -6x + 12$, $G^{\prime\prime}(6) = -24 < 0$: Maximum. $G(6) = -216 + 216 + 216 - 80 = 136$',
     r'$x = 2$ ist die Stelle der Kostenkehre ($K^{\prime\prime} = 0$), nicht das Gewinnmaximum.'])


def check():
    from fractions import Fraction as F
    import math
    import sympy as sp
    x, t = sp.symbols('x t')
    M = sp.Matrix
    # 2 Rundung und Einheiten
    assert 6 * 54 == 324 and abs(math.sqrt(54) - 7.35) < 0.005
    assert abs(6 * 7.3 ** 2 - 319.74) < 1e-9 and abs(6 * 7.35 - 44.1) < 1e-9
    # 3 Durchstoßpunkt
    s3 = sp.solve((1 + 2 * t) - (2 + t) + 2 * (3 - t) - 3, t)
    assert s3 == [2]
    P3 = M([1, 2, 3]) + 2 * M([2, 1, -1])
    assert P3 == M([5, 4, 1]) and P3[0] - P3[1] + 2 * P3[2] == 3
    P3b = M([1, 2, 3]) + 1 * M([2, 1, -1])
    assert P3b == M([3, 3, 2]) and P3b[0] - P3b[1] + 2 * P3b[2] == 4
    # 4 windschief
    s, tt = sp.symbols('s tt')
    assert sp.solve([1 + s, s - (1 + tt), -(3 + tt)], [s, tt]) == []
    assert M([1, 1, 0]).cross(M([0, 1, 1])) != M([0, 0, 0])
    # 5 senkrecht zur Ebene
    n5 = M([1, -2, 1])
    assert M([2, -4, 2]) == 2 * n5
    s5 = sp.solve((1 + 2 * t) - 2 * (1 - 4 * t) + (1 + 2 * t) - 3, t)
    assert s5 == [sp.Rational(1, 4)]
    P5 = M([1, 1, 1]) + sp.Rational(1, 4) * M([2, -4, 2])
    assert P5 == M([sp.Rational(3, 2), 0, sp.Rational(3, 2)]) and P5[0] - 2 * P5[1] + P5[2] == 3
    assert 1 - 2 * 1 + 1 == 0
    # 6 Sonnensegel
    c6 = M([3, 0, 0]).cross(M([0, 4, 3]))
    assert c6 == M([0, -9, 12]) and c6.norm() == 15 and sp.Rational(15, 2) == sp.Rational(15, 2)
    assert 15 / 2 == 7.5 and 3 * 4 / 2 == 6
    # 7 Tangente
    f7 = x**3 - 4 * x
    assert f7.subs(x, 2) == 0 and sp.diff(f7, x).subs(x, 2) == 8
    assert sp.expand(8 * (x - 2)) == 8 * x - 16
    # 8 Extrempunkte
    f8 = x**3 - 6 * x**2 + 9 * x
    assert sorted(sp.solve(sp.diff(f8, x), x)) == [1, 3]
    assert sp.diff(f8, x, 2).subs(x, 1) == -6 and sp.diff(f8, x, 2).subs(x, 3) == 6
    assert f8.subs(x, 1) == 4 and f8.subs(x, 3) == 0
    assert sp.solve(sp.diff(f8, x, 2), x) == [2] and f8.subs(x, 2) == 2
    # 9 Schnittwinkel mit der x-Achse
    f9 = x**2 - 2 * x
    assert f9.subs(x, 2) == 0 and sp.diff(f9, x).subs(x, 2) == 2
    a9 = math.degrees(math.atan(2))
    assert abs(a9 - 63.4) < 0.05 and abs(math.degrees(math.atan(0.5)) - 26.6) < 0.05
    assert abs(180 - a9 - 116.6) < 0.05
    # 10 Rechteck unter der Parabel
    A10 = 2 * x * (12 - x**2)
    assert sp.expand(A10) == 24 * x - 2 * x**3
    assert [v for v in sp.solve(sp.diff(A10, x), x) if v > 0] == [2]
    assert sp.diff(A10, x, 2).subs(x, 2) < 0 and A10.subs(x, 2) == 32 and (12 - 2**2) == 8
    assert A10.subs(x, 3) == 18 and (12 - 3**2) == 3
    # 11 Integral
    assert sp.integrate(f7, (x, 0, 2)) == -4
    # 12 Flächeninhalt über [0;3]
    assert sp.solve(f7, x) == [-2, 0, 2]
    i2 = sp.integrate(f7, (x, 2, 3))
    assert i2 == sp.Rational(25, 4) and abs(i2) + 4 == sp.Rational(41, 4) and float(sp.Rational(41, 4)) == 10.25
    assert sp.integrate(f7, (x, 0, 3)) == sp.Rational(9, 4)
    assert sp.Rational(81, 4) - 18 - (4 - 8) == sp.Rational(25, 4)
    # 13 behebbare Lücke
    f13 = (x**2 - 3 * x) / (x**2 - 9)
    assert sp.simplify(f13 - x / (x + 3)) == 0 and sp.limit(f13, x, 3) == sp.Rational(1, 2)
    assert sp.limit(f13, x, -3, '+') in (sp.oo, -sp.oo)
    # 14 Extrempunkt der e-Funktion
    f14 = x * sp.exp(2 * x)
    assert sp.simplify(sp.diff(f14, x) - (1 + 2 * x) * sp.exp(2 * x)) == 0
    assert sp.solve(sp.diff(f14, x), x) == [-sp.Rational(1, 2)]
    assert sp.simplify(sp.diff(f14, x, 2) - (4 * x + 4) * sp.exp(2 * x)) == 0
    assert sp.diff(f14, x, 2).subs(x, -sp.Rational(1, 2)) > 0
    assert abs(-0.5 * math.exp(-1) - (-0.18)) < 0.005 and abs(-1 * math.exp(-2) - (-0.14)) < 0.005
    # 15 Baumdiagramm ohne Zurücklegen
    assert F(6, 10) * F(5, 9) == F(1, 3) and F(4, 10) * F(3, 9) == F(2, 15)
    assert abs(0.6 ** 2 - 0.36) < 1e-12 and F(6, 10) * F(6, 9) == F(2, 5)
    # 16 mindestens ein defektes Bauteil
    assert abs(0.95 ** 3 - 0.857375) < 1e-12 and abs(1 - 0.95 ** 3 - 0.142625) < 1e-12
    assert abs((1 - 0.95 ** 3) * 100 - 14.3) < 0.05 and abs(0.857375 * 100 - 85.7) < 0.05
    assert abs(0.05 ** 3 * 100 - 0.0125) < 1e-9
    # 17 Vierfeldertafel
    assert 250 - 100 == 150 and 60 - 45 == 15 and 150 - 15 == 135
    assert 45 + (100 - 45) + 15 + 135 == 250 and 150 - 45 == 105
    # 18 bedingte Wahrscheinlichkeit
    assert F(45, 60) == F(3, 4) and F(3, 4) == 0.75
    assert F(45, 100) == F(9, 20) and F(60, 250) == F(6, 25) and F(45, 250) == F(9, 50)
    assert abs(float(F(9, 20)) - 0.45) < 1e-12 and abs(float(F(6, 25)) - 0.24) < 1e-12 and abs(float(F(9, 50)) - 0.18) < 1e-12
    # 19 totale Wahrscheinlichkeit
    assert abs(0.7 * 0.04 + 0.3 * 0.10 - 0.058) < 1e-12
    assert abs(0.7 * 0.10 + 0.3 * 0.04 - 0.082) < 1e-12 and (4 + 10) / 2 == 7
    # 20 Gewinnmaximum
    K = x**3 - 6 * x**2 + 12 * x + 80
    G = sp.expand(48 * x - K)
    assert G == -x**3 + 6 * x**2 + 36 * x - 80
    assert sp.expand(sp.diff(G, x) - (-3 * (x - 6) * (x + 2))) == 0
    assert sorted(sp.solve(sp.diff(G, x), x)) == [-2, 6]
    assert sp.diff(G, x, 2).subs(x, 6) == -24 and G.subs(x, 6) == 136
    assert G.subs(x, 2) == 8 and G.subs(x, 4) == 96 and sp.solve(sp.diff(K, x, 2), x) == [2]


Q.verify(check)
Q.save()
