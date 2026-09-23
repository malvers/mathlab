#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 38 (nach der Prüfung): Nachbesprechung der schriftlichen
Prüfung und Vorbereitung auf die mündliche Prüfung - Begriffe erklären, an kleinen
Beispielen rechnen und begründen, typische Fehler finden, Aussagen prüfen.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=38, slug='nachbesprechung', thema='Nachbesprechung und mündliche Prüfung',
          lb='nach der Prüfung',
          blurb='typische Prüfungsfehler, Begriffe erklären, Aufgaben im Stil der mündlichen Prüfung',
          comment='Blocks: Begriffe erklären (1-6), Rechnen und begründen (7-12), Wo steckt der Fehler? (13-17), Wahr oder falsch (18-20). Alles ohne CAS.')

# ------------------------------------------------------- Begriffe erklären ----
Q.q(r'Mündliche Prüfung, erste Frage: „Was beschreibt die Ableitung $f^{\prime}(x_0)$ einer Funktion an der Stelle $x_0$?“',
    [r'die Steigung der Tangente an den Graphen im Punkt $P(x_0|f(x_0))$, also die momentane Änderungsrate von $f$ an dieser Stelle',
     r'den Funktionswert von $f$ an der Stelle $x_0$',
     r'die Steigung der Sekante durch den Ursprung und den Punkt $P(x_0|f(x_0))$',
     r'den Flächeninhalt zwischen dem Graphen und der $x$-Achse bis zur Stelle $x_0$'],
    [r'Die Ableitung ist der Grenzwert des Differenzenquotienten: $f^{\prime}(x_0) = \lim_{h \to 0} \dfrac{f(x_0 + h) - f(x_0)}{h}$.',
     r'Geometrisch: Die Sekantensteigungen gehen in die Tangentensteigung über.',
     r'Der Flächeninhalt gehört zum Integral, nicht zur Ableitung.'])

Q.q(r'„Erklären Sie, was eine Stammfunktion ist.“ Welche Antwort ist richtig?',
    [r'$F$ ist eine Stammfunktion von $f$, wenn $F^{\prime}(x) = f(x)$ für alle $x$ gilt; alle Stammfunktionen unterscheiden sich nur um eine Konstante $C$.',
     r'$F$ ist eine Stammfunktion von $f$, wenn $F(x) = f^{\prime}(x)$ gilt.',
     r'Jede Funktion hat genau eine Stammfunktion.',
     r'$F$ und $f$ haben dieselben Nullstellen.'],
    [r'Beispiel: $F(x) = x^2$ ist Stammfunktion von $f(x) = 2x$, denn $F^{\prime}(x) = 2x$.',
     r'Auch $x^2 + 5$ ist eine Stammfunktion, die Konstante fällt beim Ableiten weg - deshalb schreibt man $\int 2x\,dx = x^2 + C$.',
     r'Die Richtung ist wichtig: Aufleiten (Integrieren) ist die Umkehrung des Ableitens.'])

Q.q(r'„Was kennzeichnet einen Wendepunkt des Graphen von $f$?“',
    [r'Der Graph wechselt dort die Krümmung (links- zu rechtsgekrümmt oder umgekehrt): $f^{\prime\prime}(x_0) = 0$ und $f^{\prime\prime}$ wechselt bei $x_0$ das Vorzeichen.',
     r'$f^{\prime}(x_0) = 0$ und $f^{\prime\prime}(x_0) \ne 0$',
     r'Der Graph wechselt dort das Vorzeichen, also $f(x_0) = 0$.',
     r'$f^{\prime\prime}(x_0) = 0$ allein genügt immer als Nachweis.'],
    [r'Krümmung heißt Änderung der Steigung, also zweite Ableitung: Vorzeichenwechsel von $f^{\prime\prime}$.',
     r'$f^{\prime}(x_0) = 0$ mit $f^{\prime\prime}(x_0) \ne 0$ ist die Bedingung für einen Extrempunkt.',
     r'Gegenbeispiel zur letzten Option: $f(x) = x^4$ hat $f^{\prime\prime}(0) = 0$, aber bei $x = 0$ einen Tiefpunkt und keinen Wendepunkt.'])

Q.q(r'„Welche Asymptoten hat der Graph von $f(x) = \dfrac{2x + 1}{x - 3}$?“',
    [r'waagerechte Asymptote $y = 2$, senkrechte Asymptote $x = 3$',
     r'waagerechte Asymptote $y = 3$, senkrechte Asymptote $x = 2$',
     r'waagerechte Asymptote $y = 0$, senkrechte Asymptote $x = 3$',
     r'waagerechte Asymptote $y = 2$, senkrechte Asymptote $x = -3$'],
    [r'Senkrecht: Nenner $x - 3 = 0$ bei $x = 3$, der Zähler ist dort $7 \ne 0$ - Polstelle, Asymptote $x = 3$.',
     r'Waagerecht: Zähler- und Nennergrad sind gleich ($1$), Grenzwert ist der Quotient der Leitkoeffizienten $\dfrac{2}{1} = 2$, also $y = 2$.',
     r'Probe: $f(1000) = \dfrac{2001}{997} \approx 2{,}007$.'])

Q.q(r'„Was ist ein Normalenvektor einer Ebene, und wo taucht er in der Koordinatengleichung auf?“',
    [r'ein Vektor, der senkrecht auf der Ebene steht (orthogonal zu beiden Spannvektoren); seine Koordinaten sind die Koeffizienten $a$, $b$, $c$ in $ax + by + cz = d$',
     r'ein Vektor der Länge $1$, der in der Ebene liegt',
     r'der Ortsvektor des Stützpunkts der Ebene',
     r'ein Vektor, der parallel zu einem Spannvektor der Ebene ist'],
    [r'Für jeden Punkt $X$ der Ebene gilt $\vec n \cdot (\vec x - \vec p) = 0$ - ausmultipliziert ist das $n_1 x + n_2 y + n_3 z = \vec n \cdot \vec p$.',
     r'Man erhält $\vec n$ z. B. als Vektorprodukt der beiden Spannvektoren.',
     r'Die Länge spielt keine Rolle: Jedes Vielfache von $\vec n$ ist ebenfalls Normalenvektor.'])

Q.q(r'„Zwei Vektoren $\vec a \ne \vec 0$ und $\vec b \ne \vec 0$ haben das Skalarprodukt $\vec a \cdot \vec b = 0$. Was folgt daraus?“',
    [r'Die Vektoren stehen senkrecht aufeinander (Winkel $90^\circ$).',
     r'Die Vektoren sind parallel zueinander.',
     r'Die Vektoren haben denselben Betrag.',
     r'Auch das Vektorprodukt $\vec a \times \vec b$ ist dann der Nullvektor.'],
    [r'$\vec a \cdot \vec b = |\vec a| \cdot |\vec b| \cdot \cos\varphi$; für Vektoren ungleich $\vec 0$ ist das Produkt genau dann $0$, wenn $\cos\varphi = 0$, also $\varphi = 90^\circ$.',
     r'Parallele Vektoren haben dagegen $\cos\varphi = \pm 1$.',
     r'Das Vektorprodukt zweier senkrechter Vektoren hat den Betrag $|\vec a| \cdot |\vec b| \ne 0$.'])

# ---------------------------------------------------- Rechnen und begründen ----
Q.q(r'„Stehen $\vec a = ' + vec(2, -1, 3) + r'$ und $\vec b = ' + vec(1, 5, 1) + r'$ senkrecht aufeinander? Begründen Sie.“',
    [r'ja, denn $\vec a \cdot \vec b = 2 - 5 + 3 = 0$',
     r'nein, denn $\vec a \cdot \vec b = 2 + 5 + 3 = 10$',
     r'nein, denn das Skalarprodukt ist der Vektor $' + vec(2, -5, 3) + r' \ne \vec 0$',
     r'ja, denn $|\vec a| = |\vec b|$'],
    [r'Skalarprodukt: $2 \cdot 1 + (-1) \cdot 5 + 3 \cdot 1 = 2 - 5 + 3 = 0$.',
     r'Das Skalarprodukt ist eine Zahl, kein Vektor - und das Minus darf nicht verloren gehen.',
     r'Die Beträge sind übrigens verschieden: $|\vec a| = \sqrt{14}$, $|\vec b| = \sqrt{27}$ - darauf kommt es nicht an.'])

Q.q(r'„$f(x) = x^3 - 3x$. Berechnen Sie $f^{\prime}(1)$ und deuten Sie das Ergebnis.“',
    [r'$f^{\prime}(1) = 0$: waagerechte Tangente; wegen $f^{\prime\prime}(1) = 6 > 0$ liegt bei $T(1|-2)$ ein Tiefpunkt.',
     r'$f^{\prime}(1) = 0$: waagerechte Tangente; bei $H(1|-2)$ liegt ein Hochpunkt.',
     r'$f^{\prime}(1) = 0$: bei $W(1|-2)$ liegt ein Wendepunkt.',
     r'$f^{\prime}(1) = 0$: bei $x = 1$ liegt eine Nullstelle von $f$.'],
    [r'$f^{\prime}(x) = 3x^2 - 3$, also $f^{\prime}(1) = 3 - 3 = 0$ und $f(1) = 1 - 3 = -2$.',
     r'Art: $f^{\prime\prime}(x) = 6x$, $f^{\prime\prime}(1) = 6 > 0$ - linksgekrümmt, also Tiefpunkt $T(1|-2)$.',
     r'Nullstelle heißt $f(1) = 0$, nicht $f^{\prime}(1) = 0$; die Nullstellen liegen bei $0$ und $\pm\sqrt{3}$.'])

Q.q(r'„Berechnen Sie $\displaystyle\int_0^2 (3x^2 - 2x)\,dx$.“',
    [r'$4$', r'$12$', r'$-4$', r'$8$'],
    [r'Stammfunktion: $F(x) = x^3 - x^2$ (Probe: $F^{\prime}(x) = 3x^2 - 2x$).',
     r'$F(2) - F(0) = (8 - 4) - 0 = 4$.',
     r'$12$ entsteht, wenn man $+x^2$ statt $-x^2$ aufleitet; $-4$ bei vertauschten Grenzen.'])

Q.q(r'„Wie liegt die Gerade $g: \vec x = ' + vec(1, 2, 0) + r' + t \cdot ' + vec(1, 1, 1) + r'$ zur Ebene $E: x + y - 2z = 5$?“',
    [r'$g$ ist echt parallel zu $E$: Richtungsvektor senkrecht zum Normalenvektor, der Stützpunkt liegt nicht in $E$.',
     r'$g$ liegt in $E$.',
     r'$g$ schneidet $E$ in genau einem Punkt.',
     r'$g$ steht senkrecht auf $E$.'],
    [r'Normalenvektor $\vec n = ' + vec(1, 1, -2) + r'$; $\vec n \cdot ' + vec(1, 1, 1) + r' = 1 + 1 - 2 = 0$, also $g \parallel E$ oder $g \subset E$.',
     r'Stützpunkt einsetzen: $1 + 2 - 0 = 3 \ne 5$ - der Punkt liegt nicht in $E$, also echt parallel.',
     r'Senkrecht wäre $g$ nur, wenn der Richtungsvektor ein Vielfaches von $\vec n$ wäre.'])

Q.q(r'„Bestimmen Sie $\lim\limits_{x \to \infty} \dfrac{3x^2 - 1}{x^2 + 4}$ und begründen Sie.“',
    [r'$3$', r'$0$', r'$+\infty$', r'$-\dfrac{1}{4}$'],
    [r'Zähler und Nenner durch die höchste Potenz $x^2$ teilen: $\dfrac{3 - \frac{1}{x^2}}{1 + \frac{4}{x^2}}$.',
     r'Für $x \to \infty$ gehen $\frac{1}{x^2}$ und $\frac{4}{x^2}$ gegen $0$, es bleibt $\dfrac{3}{1} = 3$.',
     r'Probe mit dem GTR: $f(100) \approx 2{,}9988$. $-\dfrac{1}{4}$ ist $f(0)$, nicht der Grenzwert.'])

Q.q(r'„Lösen Sie die Gleichung $2 \cdot e^{3x} = 10$.“',
    [r'$x = \dfrac{\ln 5}{3} \approx 0{,}536$',
     r'$x = \dfrac{\ln 10}{3} \approx 0{,}768$',
     r'$x = \ln 5 \approx 1{,}609$',
     r'$x = \dfrac{5}{3} \approx 1{,}667$'],
    [r'Erst durch $2$ teilen: $e^{3x} = 5$.',
     r'Logarithmieren: $3x = \ln 5$, also $x = \dfrac{\ln 5}{3} \approx 0{,}536$.',
     r'Probe: $2 \cdot e^{3 \cdot 0{,}536} \approx 2 \cdot 4{,}99 \approx 10$. Wer nicht durch $2$ teilt, landet bei $\ln 10$.'])

# --------------------------------------------------- Wo steckt der Fehler? ----
Q.q(r'Ein Schüler leitet ab: „$f(x) = (2x + 1)^3$, also $f^{\prime}(x) = 3\,(2x + 1)^2$ und $f^{\prime}(0) = 3$.“ Wo steckt der Fehler?',
    [r'Die innere Ableitung $2$ fehlt: $f^{\prime}(x) = 3\,(2x + 1)^2 \cdot 2 = 6\,(2x + 1)^2$, also $f^{\prime}(0) = 6$.',
     r'Der Exponent bleibt beim Ableiten stehen: $f^{\prime}(x) = 3\,(2x + 1)^3$.',
     r'Es ist alles richtig, $f^{\prime}(0) = 3$ stimmt.',
     r'Man muss zuerst ausmultiplizieren; die Kettenregel gilt nur für Potenzen von $x$.'],
    [r'Kettenregel: äußere Ableitung $3\,(\ldots)^2$ mal innere Ableitung $(2x + 1)^{\prime} = 2$.',
     r'$f^{\prime}(0) = 6 \cdot 1^2 = 6$.',
     r'Probe durch Ausmultiplizieren: $f(x) = 8x^3 + 12x^2 + 6x + 1$, $f^{\prime}(x) = 24x^2 + 24x + 6$, $f^{\prime}(0) = 6$.'])

Q.q(r'Winkel zwischen $\vec a = ' + vec(1, 2, 2) + r'$ und $\vec b = ' + vec(2, 0, 0) + r'$. Ein Schüler rechnet: „$\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a| \cdot |\vec b|} = \dfrac{2}{\sqrt{5} \cdot 2}$, also $\varphi \approx 63{,}4^\circ$.“ Wo steckt der Fehler?',
    [r'$|\vec a|$ ist falsch: Die Koordinaten müssen quadriert werden, $|\vec a| = \sqrt{1 + 4 + 4} = 3$; richtig ist $\cos\varphi = \dfrac{1}{3}$, $\varphi \approx 70{,}5^\circ$.',
     r'Das Skalarprodukt ist falsch, es muss $\vec a \cdot \vec b = 4$ sein.',
     r'Im Nenner muss die Summe $|\vec a| + |\vec b|$ stehen, nicht das Produkt.',
     r'Es ist alles richtig, $\varphi \approx 63{,}4^\circ$.'],
    [r'$\vec a \cdot \vec b = 1 \cdot 2 + 2 \cdot 0 + 2 \cdot 0 = 2$ stimmt; $|\vec b| = 2$ stimmt.',
     r'Aber $|\vec a| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{9} = 3$, nicht $\sqrt{1 + 2 + 2}$.',
     r'$\cos\varphi = \dfrac{2}{3 \cdot 2} = \dfrac{1}{3}$, $\varphi = \cos^{-1}\!\left(\dfrac{1}{3}\right) \approx 70{,}5^\circ$.'])

Q.q(r'Flächeninhalt zwischen dem Graphen von $f(x) = x^2 - 4$ und der $x$-Achse über $[-2\,;\,2]$. Ein Schüler rechnet: „$\displaystyle\int_{-2}^{2} (x^2 - 4)\,dx = \left[\dfrac{x^3}{3} - 4x\right]_{-2}^{2} = -\dfrac{32}{3}$, also ist die Fläche $-\dfrac{32}{3}$.“ Wo steckt der Fehler?',
    [r'Der Graph liegt zwischen $-2$ und $2$ unter der $x$-Achse, deshalb ist das Integral negativ; der Flächeninhalt ist der Betrag $\dfrac{32}{3} \approx 10{,}67$.',
     r'Die Stammfunktion ist falsch, es muss $F(x) = 2x$ sein.',
     r'Man darf nicht über $[-2\,;\,2]$ integrieren, weil dort eine Nullstelle im Inneren liegt.',
     r'Es ist alles richtig, Flächeninhalte können negativ sein.'],
    [r'Die Rechnung selbst stimmt: $\left(\dfrac{8}{3} - 8\right) - \left(-\dfrac{8}{3} + 8\right) = -\dfrac{32}{3}$.',
     r'Die Nullstellen $\pm 2$ sind genau die Grenzen, im Inneren gibt es keinen Vorzeichenwechsel - man darf in einem Stück integrieren.',
     r'Fläche $= \left|-\dfrac{32}{3}\right| = \dfrac{32}{3}$; ein Flächeninhalt ist nie negativ.'])

Q.q(r'Ein Schüler löst $e^{2x} - 3e^{x} = 0$: „$e^{x}\,(e^{x} - 3) = 0$, also $e^{x} = 0$ oder $e^{x} = 3$; Lösungen $x = 0$ und $x = \ln 3$.“ Wo steckt der Fehler?',
    [r'$e^{x} = 0$ hat keine Lösung, denn $e^{x} > 0$ für alle $x$; die einzige Lösung ist $x = \ln 3 \approx 1{,}099$.',
     r'Der zweite Faktor liefert $x = 3$, nicht $x = \ln 3$.',
     r'Richtig wären $x = \ln 3$ und $x = -\ln 3$.',
     r'Es ist alles richtig: $x = 0$ und $x = \ln 3$.'],
    [r'Das Ausklammern ist korrekt: $e^{2x} = (e^{x})^2 = e^{x} \cdot e^{x}$.',
     r'Aber $e^{x} = 0$ ist unlösbar - $x = 0$ liefert $e^0 = 1$, nicht $0$. Probe: $e^{0} - 3e^{0} = -2 \ne 0$.',
     r'Probe für $x = \ln 3$: $e^{2\ln 3} - 3 \cdot e^{\ln 3} = 9 - 9 = 0$.'])

Q.q(r'Ebene $E: \vec x = ' + vec(1, 0, 2) + r' + r \cdot ' + vec(1, 1, 0) + r' + s \cdot ' + vec(0, 1, 1) + r'$. Ein Schüler rechnet: „$\vec n = ' + vec(1, 1, 0) + r' \times ' + vec(0, 1, 1) + r' = ' + vec(1, -1, 1) + r'$, also $E: x - y + z = 0$.“ Wo steckt der Fehler?',
    [r'Die rechte Seite fehlt: Stützpunkt einsetzen ergibt $1 - 0 + 2 = 3$, also $E: x - y + z = 3$.',
     r'Das Vektorprodukt ist falsch, es muss $\vec n = ' + vec(1, 1, 1) + r'$ sein.',
     r'Der Normalenvektor muss senkrecht auf dem Stützvektor stehen - das tut er nicht.',
     r'Es ist alles richtig, $E: x - y + z = 0$.'],
    [r'Vektorprodukt: $' + vec(r'1 \cdot 1 - 0 \cdot 1', r'0 \cdot 0 - 1 \cdot 1', r'1 \cdot 1 - 1 \cdot 0') + r' = ' + vec(1, -1, 1) + r'$ stimmt (Probe: Skalarprodukt mit beiden Spannvektoren ist $0$).',
     r'$d = \vec n \cdot \vec p = 1 \cdot 1 + (-1) \cdot 0 + 1 \cdot 2 = 3$ - die Ebene geht nicht durch den Ursprung.',
     r'Probe mit einem zweiten Punkt, $r = 1$, $s = 0$: $P(2|1|2)$, $2 - 1 + 2 = 3$. Passt.'])

# --------------------------------------------------------- Wahr oder falsch ----
Q.q(r'Aussage: „Wenn $f^{\prime}(x_0) = 0$ ist, dann hat $f$ an der Stelle $x_0$ einen Extrempunkt.“ Welche Beurteilung ist richtig?',
    [r'falsch - Gegenbeispiel $f(x) = x^3$ bei $x_0 = 0$: $f^{\prime}(0) = 0$, aber dort liegt ein Sattelpunkt (Wendepunkt mit waagerechter Tangente)',
     r'wahr - das ist die notwendige und hinreichende Bedingung für Extrempunkte',
     r'wahr - aber nur für ganzrationale Funktionen',
     r'falsch - Gegenbeispiel $f(x) = x^2$ bei $x_0 = 0$'],
    [r'$f^{\prime}(x_0) = 0$ ist nur notwendig: Die Steigung muss verschwinden, aber die Ableitung muss auch das Vorzeichen wechseln.',
     r'$f(x) = x^3$: $f^{\prime}(x) = 3x^2 \ge 0$ überall, die Funktion steigt durch $x = 0$ hindurch - kein Extrempunkt.',
     r'$f(x) = x^2$ taugt nicht als Gegenbeispiel: Dort liegt bei $0$ tatsächlich ein Tiefpunkt.'])

Q.q(r'Aussage: „Zwei Geraden im Raum, die keinen gemeinsamen Punkt haben, sind parallel.“ Welche Beurteilung ist richtig?',
    [r'falsch - sie können windschief sein, z. B. $g: \vec x = t \cdot ' + vec(1, 0, 0) + r'$ und $h: \vec x = ' + vec(0, 0, 1) + r' + s \cdot ' + vec(0, 1, 0) + r'$',
     r'wahr - genau wie in der Ebene',
     r'wahr - Geraden ohne Schnittpunkt haben immer kollineare Richtungsvektoren',
     r'falsch - sie können auch identisch sein'],
    [r'Im Raum gibt es vier Lagen: identisch, echt parallel, schneidend, windschief.',
     r'Im Beispiel sind die Richtungsvektoren nicht kollinear, und $t \cdot 1 = 0$, $0 = s$, $0 = 1$ hat keine Lösung - kein Schnittpunkt, also windschief.',
     r'Identische Geraden haben unendlich viele gemeinsame Punkte, sie sind kein Gegenbeispiel.'])

Q.q(r'Aussage: „Der Graph einer gebrochenrationalen Funktion kann seine waagerechte Asymptote nicht schneiden.“ Welche Beurteilung ist richtig?',
    [r'falsch - z. B. hat $f(x) = \dfrac{x}{x^2 + 1}$ die Asymptote $y = 0$ und schneidet sie im Ursprung',
     r'wahr - eine Asymptote wird nur angenähert, nie erreicht',
     r'wahr - wegen der Polstellen ist ein Schnittpunkt ausgeschlossen',
     r'falsch - $f(x) = \dfrac{1}{x}$ schneidet seine Asymptote $y = 0$'],
    [r'Die Asymptote beschreibt nur das Verhalten für $x \to \pm\infty$: $\dfrac{x}{x^2 + 1} \to 0$, weil der Nennergrad größer ist.',
     r'Im Endlichen darf der Graph die Asymptote kreuzen: $f(0) = 0$, und für $x < 0$ ist $f(x) < 0$, für $x > 0$ ist $f(x) > 0$.',
     r'$\dfrac{1}{x}$ dagegen wird nie $0$ - dieses Beispiel belegt nichts.'])


def check():
    from fractions import Fraction as F
    import math
    import sympy as sp
    x, h, t, s = sp.symbols('x h t s')
    # 1: derivative as limit of the difference quotient (an example)
    assert sp.limit(((x + h) ** 2 - x ** 2) / h, h, 0) == 2 * x
    # 2: F(x) = x^2 and x^2 + 5 are both antiderivatives of 2x
    assert sp.diff(x ** 2, x) == 2 * x and sp.diff(x ** 2 + 5, x) == 2 * x
    # 3: x^4 has f''(0) = 0 but a minimum at 0 (no sign change of f'')
    f4 = x ** 4
    assert sp.diff(f4, x, 2).subs(x, 0) == 0
    assert sp.diff(f4, x, 2).subs(x, -1) > 0 and sp.diff(f4, x, 2).subs(x, 1) > 0 and f4.subs(x, 0) == 0 and f4.subs(x, 1) > 0
    # 4: asymptotes of (2x+1)/(x-3)
    f = (2 * x + 1) / (x - 3)
    assert sp.limit(f, x, sp.oo) == 2 and sp.limit(f, x, -sp.oo) == 2
    assert (2 * 3 + 1) == 7 and sp.limit(f, x, 3, '+') == sp.oo
    assert abs(F(2001, 997) - F(2007, 1000)) < F(1, 1000)
    # 5: normal vector orthogonal to both direction vectors -> coefficients (example)
    n, u, v = sp.Matrix([1, -1, 1]), sp.Matrix([1, 1, 0]), sp.Matrix([0, 1, 1])
    assert n.dot(u) == 0 and n.dot(v) == 0
    # 6: a.b = 0 -> 90 degrees; cross product of orthogonal vectors has |a||b|
    a, b = sp.Matrix([1, 0, 0]), sp.Matrix([0, 2, 0])
    assert a.dot(b) == 0 and a.cross(b).norm() == a.norm() * b.norm() != 0
    # 7: 2 - 5 + 3 = 0; distractors 10 and |a| != |b|
    assert 2 * 1 + (-1) * 5 + 3 * 1 == 0 and 2 * 1 + 1 * 5 + 3 * 1 == 10
    assert 2 ** 2 + 1 + 9 == 14 and 1 + 25 + 1 == 27 and 14 != 27
    # 8: f = x^3 - 3x
    f = x ** 3 - 3 * x
    assert sp.diff(f, x).subs(x, 1) == 0 and f.subs(x, 1) == -2 and sp.diff(f, x, 2).subs(x, 1) == 6
    assert set(sp.solve(f, x)) == {0, sp.sqrt(3), -sp.sqrt(3)}
    # 9: integral 0..2 of 3x^2 - 2x = 4; distractors 12 (x^3 + x^2) and -4 (swapped)
    assert sp.integrate(3 * x ** 2 - 2 * x, (x, 0, 2)) == 4
    assert (8 + 4) - 0 == 12 and sp.integrate(3 * x ** 2 - 2 * x, (x, 2, 0)) == -4
    assert sp.diff(x ** 3 - x ** 2, x) == 3 * x ** 2 - 2 * x
    # 10: line parallel to plane, support point not in it
    nrm, d = sp.Matrix([1, 1, -2]), sp.Matrix([1, 1, 1])
    assert nrm.dot(d) == 0 and 1 + 2 - 2 * 0 == 3 and 3 != 5
    # 11: limit 3; f(0) = -1/4; f(100) ~ 2.9988
    g = (3 * x ** 2 - 1) / (x ** 2 + 4)
    assert sp.limit(g, x, sp.oo) == 3 and g.subs(x, 0) == -sp.Rational(1, 4)
    assert abs(float(g.subs(x, 100)) - 2.9988) < 0.0001
    # 12: 2e^{3x} = 10
    assert abs(math.log(5) / 3 - 0.536) < 0.0005 and abs(math.log(10) / 3 - 0.768) < 0.0005
    assert abs(math.log(5) - 1.609) < 0.0005 and abs(5 / 3 - 1.667) < 0.0005
    assert abs(2 * math.exp(3 * math.log(5) / 3) - 10) < 1e-9 and abs(2 * math.exp(3 * 0.536) - 10) < 0.02
    assert abs(2 * 4.99 - 10) < 0.05
    # 13: chain rule
    f = (2 * x + 1) ** 3
    assert sp.expand(sp.diff(f, x)) == sp.expand(6 * (2 * x + 1) ** 2) and sp.diff(f, x).subs(x, 0) == 6
    assert sp.expand(f) == 8 * x ** 3 + 12 * x ** 2 + 6 * x + 1
    assert sp.expand(sp.diff(f, x)) == 24 * x ** 2 + 24 * x + 6
    # 14: angle between (1,2,2) and (2,0,0)
    assert 1 * 2 + 2 * 0 + 2 * 0 == 2 and math.isqrt(1 + 4 + 4) == 3 and 1 + 2 + 2 == 5
    assert abs(math.degrees(math.acos(F(1, 3))) - 70.5) < 0.05
    assert abs(math.degrees(math.acos(2 / (math.sqrt(5) * 2))) - 63.4) < 0.05
    # 15: integral -2..2 of x^2 - 4 = -32/3
    assert sp.integrate(x ** 2 - 4, (x, -2, 2)) == -sp.Rational(32, 3)
    assert (F(8, 3) - 8) - (-F(8, 3) + 8) == -F(32, 3) and abs(32 / 3 - 10.67) < 0.005
    assert all((v ** 2 - 4) < 0 for v in (-1.5, 0, 1.5)) and set(sp.solve(x ** 2 - 4, x)) == {-2, 2}
    # 16: e^{2x} - 3e^x = 0 -> only ln 3
    e = sp.exp(2 * x) - 3 * sp.exp(x)
    assert sp.solve(e, x) == [sp.log(3)] and e.subs(x, 0) == -2 and sp.simplify(e.subs(x, sp.log(3))) == 0
    assert abs(math.log(3) - 1.099) < 0.0005
    # 17: cross product and d = 3; second point (2|1|2)
    p = sp.Matrix([1, 0, 2])
    assert u.cross(v) == n and n.dot(p) == 3
    p2 = p + u
    assert list(p2) == [2, 1, 2] and n.dot(p2) == 3 and sp.Matrix([1, 1, 1]).dot(u) != 0
    # 18: x^3 has f'(0) = 0 without an extremum; x^2 has a minimum at 0
    assert sp.diff(x ** 3, x).subs(x, 0) == 0 and (-0.1) ** 3 < 0 < 0.1 ** 3
    assert sp.diff(x ** 2, x).subs(x, 0) == 0 and sp.diff(x ** 2, x, 2).subs(x, 0) == 2 > 0
    # 19: skew lines g: t(1,0,0), h: (0,0,1) + s(0,1,0)
    sol = sp.solve([t - 0, 0 - s, 0 - 1], [t, s])
    assert sol == [] and sp.Matrix([1, 0, 0]).cross(sp.Matrix([0, 1, 0])) != sp.zeros(3, 1)
    # 20: x/(x^2+1) -> 0, crosses at 0; 1/x never 0
    k = x / (x ** 2 + 1)
    assert sp.limit(k, x, sp.oo) == 0 and k.subs(x, 0) == 0 and k.subs(x, -1) < 0 < k.subs(x, 1)
    assert sp.solve(1 / x, x) == []


Q.verify(check)
Q.save()
