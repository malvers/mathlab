#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 5: Graphen-Repertoire ohne Hilfsmittel - die sechs Grundfunktionen.
Deck: tools/pptx/build_graphen_mathe11.py - Quiz: HTML/mathetest11-graphen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-graphen", "Sechs Graphen im Kopf", kw=5)

# ---------------------------------------------------------------- AFB I ----
s.task("Vier Graphen am Telefon", 1,
       r"Eine Mitschülerin beschreibt am Telefon vier Graphen aus den sechs Grundfunktionen $x$, $x^2$, $\sqrt{x}$, $\dfrac{1}{x}$, $2^x$ und $\sin x$. **(A)** „Er beginnt im Ursprung und liegt nur rechts davon.“ **(B)** „Er besteht aus zwei getrennten Ästen und berührt keine der beiden Achsen.“ **(C)** „Er ist eine Welle, die immer wiederkommt.“ **(D)** „Er ist eine Kurve, die links flach an der $x$-Achse klebt und rechts steil nach oben geht.“",
       [r"Ordne jeder Beschreibung die passende Grundfunktion zu.",
        r"Gib für A und B den Definitionsbereich an und begründe die Einschränkung.",
        r"Gib für C und D den Wertebereich an.",
        r"Welche der sechs Grundfunktionen sind achsensymmetrisch zur $y$-Achse, welche punktsymmetrisch zum Ursprung?"],
       solution=[
        r"(A) $\sqrt{x}$ — sie startet im Ursprung und existiert nur für nichtnegative $x$. (B) $\dfrac{1}{x}$ — die Hyperbel mit zwei Ästen. (C) $\sin x$ — periodisch. (D) $2^x$ — die Exponentialfunktion.",
        r"$\sqrt{x}$: $D = \{x \mid x \geq 0\}$, denn unter der Wurzel darf nichts Negatives stehen. $\dfrac{1}{x}$: $D = \mathbb{R} \setminus \{0\}$, denn durch null darf nicht geteilt werden. Genau deshalb hat die Hyperbel zwei getrennte Äste.",
        r"$\sin x$: $W = \{y \mid -1 \leq y \leq 1\}$ — der Sinus verlässt diesen Streifen nie. $2^x$: $W = \{y \mid y > 0\}$ — eine Potenz mit positiver Basis ist immer positiv, wird aber beliebig klein, ohne je null zu werden.",
        r"Achsensymmetrisch zur $y$-Achse ist $x^2$, denn $(-x)^2 = x^2$. Punktsymmetrisch zum Ursprung sind $x$, $\dfrac{1}{x}$ und $\sin x$, denn dort gilt jeweils $f(-x) = -f(x)$. Weder noch sind $\sqrt{x}$ und $2^x$ — schon weil $\sqrt{x}$ links vom Ursprung gar nicht existiert."],
       falle=r"$2^x$ „berührt“ die $x$-Achse nicht, so flach der Graph links auch aussieht. $2^{-10} \approx 0{,}001$ ist klein, aber nicht null — die Achse ist eine **Asymptote**.")

# --------------------------------------------------------------- AFB II ----
s.task("Wer liegt oben?", 2,
       r"Untersucht werden die drei Grundfunktionen $f(x) = x$, $g(x) = x^2$ und $h(x) = \sqrt{x}$, jeweils für $x \geq 0$.",
       [r"Bestimme rechnerisch alle Schnittpunkte von $f$ und $g$ sowie von $f$ und $h$.",
        r"Ordne die drei Werte für $x = 0{,}25$ der Größe nach. Tue dasselbe für $x = 4$.",
        r"Begründe allgemein, warum sich die Reihenfolge bei $x = 1$ umdreht.",
        r"Welchen Zusammenhang haben die Graphen von $g$ und $h$ zueinander? Prüfe ihn an einem Punkt."],
       solution=[
        r"$f$ und $g$: $x = x^2$ ergibt $x^2 - x = 0$ und ausgeklammert $x(x - 1) = 0$, also $x = 0$ und $x = 1$. Die Schnittpunkte sind $(0 \mid 0)$ und $(1 \mid 1)$. $f$ und $h$: $x = \sqrt{x}$, quadriert $x^2 = x$ — dieselbe Gleichung, also wieder $(0 \mid 0)$ und $(1 \mid 1)$.",
        r"Für $x = 0{,}25$: $g = 0{,}0625$, $f = 0{,}25$, $h = 0{,}5$. Also $x^2 < x < \sqrt{x}$. Für $x = 4$: $h = 2$, $f = 4$, $g = 16$. Also $\sqrt{x} < x < x^2$ — die Reihenfolge hat sich genau umgedreht.",
        r"Für $0 < x < 1$ macht das Multiplizieren mit einer Zahl kleiner als eins alles **kleiner**: $x^2 = x \cdot x < x$. Das Wurzelziehen macht es entsprechend größer. Für $x > 1$ ist es umgekehrt. Bei $x = 1$ sind alle drei gleich, denn $1^2 = 1 = \sqrt{1}$ — dort kreuzen sich alle drei Graphen.",
        r"$h$ ist die **Umkehrfunktion** von $g$ auf $x \geq 0$, die Graphen sind also Spiegelbilder an der Winkelhalbierenden $y = x$. Probe: $(2 \mid 4)$ liegt auf $g$, und der gespiegelte Punkt $(4 \mid 2)$ liegt auf $h$, denn $\sqrt{4} = 2$."],
       falle=r"Aus $x = \sqrt{x}$ durch Quadrieren $x^2 = x$ zu machen, ist erlaubt, kann aber Scheinlösungen erzeugen. Hier bestehen beide, $0$ und $1$, die Probe — nachrechnen muss man trotzdem jedes Mal.")

# -------------------------------------------------------------- AFB III ----
s.task("Irgendwann ist sie null", 3,
       r"Ein Mitschüler behauptet: **„Bei $f(x) = \dfrac{1}{x}$ wird der Wert irgendwann null, wenn $x$ nur groß genug ist. Bei $2^x$ ist es dasselbe, wenn $x$ weit genug ins Negative geht.“**",
       [r"Berechne $f(10)$, $f(1\,000)$ und $f(1\,000\,000)$. Was beobachtest du?",
        r"Untersuche rechnerisch, ob $\dfrac{1}{x} = 0$ überhaupt eine Lösung hat.",
        r"Was passiert mit $f$, wenn $x$ von rechts gegen null geht? Berechne $f(0{,}1)$, $f(0{,}001)$ und $f(0{,}000001)$.",
        r"Beurteile die Behauptung für beide Funktionen und benenne die beiden Asymptoten von $f$."],
       solution=[
        r"$f(10) = 0{,}1$, $f(1\,000) = 0{,}001$, $f(1\,000\,000) = 0{,}000001$. Die Werte werden immer kleiner und kommen der Null beliebig nahe — erreicht wird sie aber in keinem Schritt.",
        r"$\dfrac{1}{x} = 0$ hieße nach Multiplikation mit $x$, dass $1 = 0$ wäre. Das ist eine falsche Aussage, die Gleichung hat also **keine** Lösung. Ein Bruch ist genau dann null, wenn sein **Zähler** null ist — hier steht dort aber die $1$.",
        r"$f(0{,}1) = 10$, $f(0{,}001) = 1\,000$, $f(0{,}000001) = 1\,000\,000$. Die Werte wachsen über jede Grenze. An der Stelle $x = 0$ ist $f$ nicht definiert, und in ihrer Nähe verhält sich die Funktion genau umgekehrt zum Verhalten im Unendlichen.",
        r"Die Behauptung ist für beide Funktionen falsch, und zwar aus demselben Grund: die Werte **nähern sich** der Null beliebig genau an, ohne sie anzunehmen. Bei $2^x$ ist $2^{-100}$ winzig, aber als Potenz mit positiver Basis immer noch positiv. $f$ hat zwei Asymptoten: die $x$-Achse als **waagerechte** Asymptote für große $|x|$ und die $y$-Achse als **senkrechte** Asymptote bei $x = 0$. Die Exponentialfunktion hat nur die waagerechte."],
       falle=r"„Beliebig nahe“ ist nicht „gleich“. Ein Taschenrechner zeigt für $2^{-100}$ irgendwann $0$ an — das ist seine Anzeigegrenze, keine Eigenschaft der Funktion.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    assert 2 ** -10 > 0 and abs(2 ** -10 - 0.0009765625) < 1e-12
    # intersections
    f, g, h = (lambda x: x), (lambda x: x ** 2), (lambda x: math.sqrt(x))
    assert f(0) == g(0) == 0 and f(1) == g(1) == 1
    assert abs(h(0) - f(0)) < 1e-12 and abs(h(1) - f(1)) < 1e-12
    q = F(1, 4)
    assert g(q) == F(1, 16) and float(g(q)) == 0.0625 and h(0.25) == 0.5
    assert g(q) < q < F(1, 2)
    assert h(4) == 2.0 and f(4) == 4 and g(4) == 16 and h(4) < f(4) < g(4)
    assert g(2) == 4 and h(4) == 2                       # mirrored pair (2|4) / (4|2)
    # 1/x
    inv = lambda x: 1 / x
    assert inv(10) == 0.1 and inv(1000) == 0.001 and inv(10 ** 6) == 1e-6
    assert inv(0.1) == 10 and abs(inv(0.001) - 1000) < 1e-9 and abs(inv(1e-6) - 1e6) < 1e-3
    assert all(inv(x) > 0 for x in (10, 1000, 10 ** 6, 10 ** 12))
    assert 2 ** -100 > 0
    assert abs(math.sin(0)) < 1e-12 and -1 <= math.sin(3) <= 1


s.verify(check)
s.save()
